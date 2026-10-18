"""Independent R5 pixel/inventory audit. JSON only; no artwork writes or author imports."""
from pathlib import Path
from collections import Counter
import hashlib,json,math,platform,re
import numpy as np
from PIL import Image,__version__ as pillow_version
R=Path(__file__).resolve().parent
P=R/'fresh_extraction/C001_ZANT_GATE_A_R5_FAILED_G_SLEEVE_PILOT'
def read(rel):return json.loads((P/rel).read_text(encoding='utf-8'))
def rgba(rel):
    with Image.open(P/rel) as im:
        assert im.mode=='RGBA',(rel,im.mode)
        return np.array(im)
def sha(p):
    with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def stats(a,b):
    d=np.abs(a.astype(np.int16)-b.astype(np.int16))
    return {'differentPixels':int(np.any(d,axis=2).sum()),'differentChannelsRGBA':np.count_nonzero(d,axis=(0,1)).tolist(),'maxDeltaRGBA':d.max(axis=(0,1)).tolist(),'includesHiddenRGB':True}
def over(dst,src):
    s=src.astype(np.uint64);d=dst.astype(np.uint64);sa=s[:,:,3:4];da=d[:,:,3:4]
    den=sa*255+da*(255-sa)
    rgb=(s[:,:,:3]*sa*255+d[:,:,:3]*da*(255-sa)+den//2)//np.maximum(den,1)
    return np.concatenate((rgb,(den+127)//255),axis=2).astype(np.uint8)
ledger=read('data/surface_ledger.json');surfaces=ledger['surfaces'];bank={s['id']:s['path'] for s in surfaces if s['path']}
arrays={id:rgba(rel) for id,rel in bank.items()}
source=rgba('references/C001_source_neutral_rgba.png');head=arrays['A25_head_front_neutral'];retained=head[:,:,3]>0
with Image.open(P/'validation/A25_protected_audit_L8.png') as im:protected=np.array(im)>0
result={'environment':{'python':platform.python_version(),'pillow':pillow_version,'numpy':np.__version__},'retainedSourceHeadPixels':int(retained.sum()),
    'retainedSourceHeadRGBChangedChannels':int(np.count_nonzero(head[:,:,:3][retained]!=source[:640,256:768,:3][retained])),
    'protectedFacePixels':int(protected.sum()),'evidenceReplays':{}}
pilot=read('data/pilot_recipes.json');recipes=pilot['recipes'];neutral=read('data/neutral_recipes.json')['recipes']
assert pilot['scale']==1 and pilot['rotation']==0 and pilot['mirror'] is False and pilot['headTranslation']==[256,54]
for id,r in recipes.items():
    layers=r['layerOrder'];assert len(set(layers))==len(layers) and all(p in bank for p in layers)
    dst=np.zeros((1536,1024,4),np.uint8)
    for part in layers:
        a=arrays[part]
        if part=='A25_head_front_neutral':dst[54:694,256:768]=over(dst[54:694,256:768],a)
        else:dst=over(dst,a)
    expected=rgba('expected/'+id+'.png')
    with Image.open(R/'audit_replay'/(id+'.png')) as im:reopened=np.array(im)
    result['evidenceReplays'][id]={'recordedStatus':r['status'],'canonical':stats(dst,expected),'reopened':stats(reopened,expected),
        'decodedRgbaSha256':hashlib.sha256(dst.tobytes()).hexdigest(),
        'protectedFaceChangedRGBAChannels':int(np.count_nonzero(dst[54:694,256:768][protected]!=head[protected])),
        'onlyDeclaredPartsDrawnOnce':True}
coat=arrays['A10_jacket_arm_L_G'];hand=arrays['A14_hand_L_G'];arm=arrays['A06_tee_arm_L_G']
Y,X=np.mgrid[:1536,:1024];signed=Y-(.7*(X-637)+705)
both=(coat[:,:,3]>127)&(hand[:,:,3]>127);outside=both&(signed>10)
yy,xx=np.where(outside);core_hand=np.argwhere(hand[:,:,3]>127)
scalar_count=sum(coat[int(y),int(x),3]>127 and int(y)-(.7*(int(x)-637)+705)>10 for y,x in core_hand)
line_hand=(hand[:,:,3]>127)&(np.abs(signed)<=1)
sy,sx=np.where(line_hand)
result['failedWrist']={'vectorCount':int(outside.sum()),'independentScalarCount':int(scalar_count),
    'bodyBoundsInclusive':[int(xx.min()),int(yy.min()),int(xx.max()),int(yy.max())],
    'bodyBoundsHalfOpen':[int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1)],
    'maximumSignedVerticalDistance':float(signed[outside].max()),
    'maximumPerpendicularDistance':float(signed[outside].max()/math.sqrt(1+.7**2)),
    'sharedHandCorePixels':int(len(core_hand)),'fractionOfHandCoreCoveredBeyondBand':float(outside.sum()/len(core_hand)),
    'datum':[637,705],'seamEquation':'y=.7*(x-637)+705','bandSignedVerticalPixelsEachSide':10,
    'bandPerpendicularPixelsEachSide':10/math.sqrt(1+.7**2),
    'datumAlphaHandArmSleeve':[int(a[705,637,3]) for a in (hand,arm,coat)],
    'handCoreNearLineBoundsInclusive':[int(sx.min()),int(sy.min()),int(sx.max()),int(sy.max())],
    'geometricMeasurementsDoNotApproveAnatomicalWrist':True}
result['sharedGHand']={'path':bank['A14_hand_L_G'],'sha256':sha(P/bank['A14_hand_L_G']),
    'sameDeclaredFileInBothGPilots':all('A14_hand_L_G' in recipes[id]['layerOrder'] for id in ('B_off_GN_NN','B_on_GN_NN')),
    'onHasNoBareLArmOrNeutralLHand':all(p not in recipes['B_on_GN_NN']['layerOrder'] for p in ('A06_tee_arm_L_G','A12_hand_L_N')),
    'offHasNoJacketGArm': 'A10_jacket_arm_L_G' not in recipes['B_off_GN_NN']['layerOrder']}
result['occlusionMasks']={}
for name,receiving in [('A06_root_tee_occlusion','A02_tee_torso'),('A10_root_jacket_occlusion','A03_jacket_open_torso')]:
    with Image.open(P/'masks/coverage'/(name+'.png')) as im:
        a=np.array(im);mode=im.mode
    wanted=np.floor(arrays[receiving][:,:,3]*np.clip((580-Y)/30,0,1)+.5).astype(np.uint8)
    result['occlusionMasks'][name]={'mode':mode,'size':[a.shape[1],a.shape[0]],'equalsFrozenReceivingCoverageFade':bool(np.array_equal(a,wanted)),'paintedRGB':False}
lock=read('contract/ACCEPTED_R4_NEUTRAL_LOCK.json')
result['acceptedNeutralLock']={'candidate':lock['acceptedCandidate'],'files':len(lock['files']),
    'mismatches':[name for name,e in lock['files'].items() if sha(P/name)!=e['sha256'] or (P/name).stat().st_size!=e['bytes']],
    'neutralLayerOrdersUnchanged':all(recipes[id]['layerOrder']==r['layerOrder'] for id,r in neutral.items())}
contract=(P/'contract/00_GATE_A_IMPLEMENTATION_PREFLIGHT.md').read_text(encoding='utf-8');ids=re.findall(r'^\| \d\d \| `(A\d\d_[^`]+)`',contract,re.M)
matrix=read('data/required_matrix.json');keys=('body','palette','isolatedFace','assembledFace','negative');cases=[c for k in keys for c in matrix[k]]
result['inventory']={'all32IdsMatchContract':[s['id'] for s in surfaces]==ids and len(ids)==32,'statusCounts':dict(Counter(s['status'] for s in surfaces)),
    'presentIncludingFailedDrafts':len(bank),'missing':[s['id'] for s in surfaces if not s['path']],'reserves':ledger['reserves'],
    'assetsOnlyDeclaredPartsAndA25Alpha':sorted(p.relative_to(P).as_posix() for p in (P/'assets').rglob('*') if p.is_file())==sorted([*bank.values(),'assets/A25_head_front_silhouette.png'])}
result['matrix']={k:{'count':len(matrix[k]),'statuses':dict(Counter(c['status'] for c in matrix[k]))} for k in keys}
result['all243CaseIdsUnique']=len({c['id'] for c in cases})==len(cases)==243
result['interfaceMetadata']={'operativePilotDatum':pilot['fixedG_L_Wrist'],
    'earlierLGuide':read('authoring/G_pose_plan.json')['plans']['L']['wristGuide'],
    'earlierGuideExplicitlyProvisional':read('authoring/G_pose_plan.json')['elbowWristAreArtGuidesUntilMeasured']}
result['artworkAuthoredRepairedOrModified']=False
(R/'independent_pilot_audit.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,indent=2))
