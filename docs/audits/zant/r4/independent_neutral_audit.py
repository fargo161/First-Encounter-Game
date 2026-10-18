"""Independent R4 neutral audit. Reads art, writes JSON only; no author imports."""
from pathlib import Path
from collections import Counter
from itertools import product
import csv,hashlib,json,re,platform
import numpy as np
from PIL import Image,__version__ as pillow_version
R=Path(__file__).resolve().parent
P=R/'fresh_extraction/C001_ZANT_GATE_A_R4_NEUTRAL_REVIEW_CANDIDATE_01'
def read(rel):return json.loads((P/rel).read_text(encoding='utf-8'))
def rgba(rel):
    with Image.open(P/rel) as im:
        assert im.mode=='RGBA',(rel,im.mode)
        return np.array(im)
def stats(a,b):
    d=np.abs(a.astype(np.int16)-b.astype(np.int16))
    return {'differentPixels':int(np.any(d,axis=2).sum()),'differentChannelsRGBA':np.count_nonzero(d,axis=(0,1)).tolist(),'maxDeltaRGBA':d.max(axis=(0,1)).tolist(),'includesHiddenRGB':True}
def over(dst,src):
    s=src.astype(np.uint64);d=dst.astype(np.uint64)
    sa=s[:,:,3:4];da=d[:,:,3:4];den=sa*255+da*(255-sa)
    rgb=(s[:,:,:3]*sa*255+d[:,:,:3]*da*(255-sa)+den//2)//np.maximum(den,1)
    return np.concatenate((rgb,(den+127)//255),axis=2).astype(np.uint8)
def bounds(mask):
    y,x=np.where(mask)
    return [int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)] if x.size else None
ledger=read('data/surface_ledger.json');surfaces=ledger['surfaces'];bank={s['id']:s['path'] for s in surfaces if s['path']}
arrays={id:rgba(path) for id,path in bank.items()}
source=rgba('references/C001_source_neutral_rgba.png');aligned=np.zeros_like(source);aligned[54:]=source[:-54]
head=arrays['A25_head_front_neutral'];retained=head[:,:,3]>0
with Image.open(P/'validation/A25_protected_audit_L8.png') as im:protected=np.array(im)>0
recipes=read('data/neutral_recipes.json')['recipes'];checks=read('validation/neutral_interface_checks.json')
result={'environment':{'python':platform.python_version(),'pillow':pillow_version,'numpy':np.__version__},
    'retainedA25Pixels':int(retained.sum()),'A25SourceRGBChangedChannels':int(np.count_nonzero(head[:,:,:3][retained]!=source[:640,256:768,:3][retained])),
    'protectedFacePixels':int(protected.sum()),'recipes':{},'sourceJacketRGB':{},'hands':{},'armMeasurements':{}}
for id in ('A03_jacket_open_torso','A08_jacket_arm_L_N','A09_jacket_arm_R_N'):
    a=arrays[id];mask=a[:,:,3]>0
    result['sourceJacketRGB'][id]={'retainedPixels':int(mask.sum()),'differentRGBChannels':int(np.count_nonzero(a[:,:,:3][mask]!=aligned[:,:,:3][mask]))}
for side,id,armid in [('L','A12_hand_L_N','A04_tee_arm_L_N'),('R','A13_hand_R_N','A05_tee_arm_R_N')]:
    a=arrays[id];before=rgba('authoring/inputs/R4_source_hand_'+side+'_before_alpha_cleanup.png')
    change=a[:,:,3]!=before[:,:,3];keep=a[:,:,3]>0
    result['hands'][side]={'alphaChangedPixels':int(change.sum()),'alphaChangeBounds':bounds(change),'alphaChangesAtY842Plus':int(change[842:].sum()),
        'retainedSourceRGBChangedChannels':int(np.count_nonzero(a[:,:,:3][keep]!=aligned[:,:,:3][keep])),
        'palmFingerRGBAChangedChannelsAtY842Plus':int(np.count_nonzero(a[842:]!=before[842:])),
        'changedAlphaOutsideOpaqueReceiver':int(np.count_nonzero(change&(arrays[armid][:,:,3]<250)))}
for side,id in [('L','A04_tee_arm_L_N'),('R','A05_tee_arm_R_N')]:
    a=arrays[id];rows={}
    for y in (550,600,625,650,700,750,800):
        x=np.flatnonzero(a[y,:,3]>127);rows[str(y)]={'minX':int(x.min()),'maxX':int(x.max()),'width':int(x.max()-x.min()+1)}
    result['armMeasurements'][side]=rows
for id,r in recipes.items():
    assert len(set(r['layerOrder']))==len(r['layerOrder']) and all(x in bank for x in r['layerOrder'])
    assert r['scale']==[1,1] and r['rotation']==0 and r['mirror'] is False and r['headTranslation']==[256,54]
    dst=np.zeros((1536,1024,4),np.uint8)
    for part in r['layerOrder']:
        a=arrays[part]
        if part=='A25_head_front_neutral':dst[54:694,256:768]=over(dst[54:694,256:768],a)
        else:dst=over(dst,a)
    expected=rgba('expected/'+id+'.png')
    with Image.open(R/'audit_replay'/(id+'.png')) as im:reopened=np.array(im)
    outfit=r['jacket'];core_counts={}
    for name,c in checks['joinChecks'][outfit]['occupiedJoinCoreChecks'].items():
        x0,y0,x1,y1=c['boxXYXY'];core_counts[name]=int(np.count_nonzero(dst[y0:y1,x0:x1,3]<128))
    result['recipes'][id]={'layerOrder':r['layerOrder'],'canonical':stats(dst,expected),'reopened':stats(reopened,expected),
        'decodedRgbaSha256':hashlib.sha256(dst.tobytes()).hexdigest(),
        'protectedFaceChangedChannelsRGBA':int(np.count_nonzero(dst[54:694,256:768][protected]!=head[protected])),
        'sampledJoinCorePixelsBelowAlpha128':core_counts}
    if outfit=='on':
        a=dst[:,:,3]>127;b=aligned[:,:,3]>127
        result['jacketOnSilhouetteIoU']=float((a&b).sum()/(a|b).sum())
    else:
        result['shoulderContourRows']={}
        for y in range(360,371):
            xs=np.flatnonzero(dst[y,:,3]>127)
            result['shoulderContourRows'][str(y)]={'minX':int(xs.min()),'maxX':int(xs.max())}
        result['armCapSupportFirstBodyRows']={part:int(np.where(arrays[part][:,:,3]>0)[0].min()) for part in ('A04_tee_arm_L_N','A05_tee_arm_R_N')}
tee=arrays['A02_tee_torso'];Y=np.arange(1536)[:,None]
result['teeOpaquePixelsOutsideSourceSupportY571To829']=int(np.count_nonzero((tee[:,:,3]>127)&(aligned[:,:,3]<128)&(Y>570)&(Y<830)))
result['sourceNContactCoreRows']={part:int(np.where(arrays[part][:,:,3]>127)[0].max()) for part in ('A21_sneaker_L_N','A22_sneaker_R_N')}
seed=rgba('authoring/A16_source_seed.png');waist=arrays['A16_pants_pelvis_NN'];mask=(waist[:,:,3]>0)&np.any(seed[:,:,:3]!=waist[:,:,:3],axis=2)
csv_rows=list(csv.DictReader((P/'validation/A16_RGB_changes_from_source_seed.csv').open(encoding='utf-8')))
coordinates={(int(row['body_x']),int(row['body_y'])) for row in csv_rows}
y,x=np.where(mask);wanted=set(zip(x.tolist(),y.tolist()))
csv_values_correct=all([int(row['source_'+c]) for c in 'rgb']==seed[int(row['body_y']),int(row['body_x']),:3].tolist() and [int(row['derivative_'+c]) for c in 'rgb']==waist[int(row['body_y']),int(row['body_x']),:3].tolist() for row in csv_rows)
result['A16']={'alphaEqualsSeed':bool(np.array_equal(seed[:,:,3],waist[:,:,3])),
    'equalsArchivedR3WaistDerivative':bool(np.array_equal(waist,rgba('authoring/inputs/R3_A16_unaccepted_waist_derivative.png'))),
    'changedRetainedRGBTexels':int(mask.sum()),'changedBounds':bounds(mask),'changesY840To864':int(mask[840:865].sum()),'changesAtY865Plus':int(mask[865:].sum()),
    'csvRows':len(csv_rows),'csvCoordinatesExactlyMatch':coordinates==wanted and len(coordinates)==len(csv_rows),'csvBeforeAfterValuesMatch':csv_values_correct}
result['inventory']={'baselineIds':len(surfaces),'statuses':dict(Counter(s['status'] for s in surfaces)),'exported':len(bank),'missing':[s['id'] for s in surfaces if not s['path']],'reserves':ledger['reserves']}
result['sharedFilesInBothOutfits']={part:all(part in r['layerOrder'] for r in recipes.values()) for part in ('A02_tee_torso','A12_hand_L_N','A13_hand_R_N','A16_pants_pelvis_NN','A17_pants_leg_L_N','A18_pants_leg_R_N','A21_sneaker_L_N','A22_sneaker_R_N','A25_head_front_neutral')}
result['onlyDeclaredPartsAndAlphaInAssets']=sorted(p.relative_to(P).as_posix() for p in (P/'assets').rglob('*') if p.is_file())==sorted([*bank.values(),'assets/A25_head_front_silhouette.png'])
matrix=read('data/required_matrix.json');keys=('body','palette','isolatedFace','assembledFace','negative');allcases=[c for k in keys for c in matrix[k]]
result['matrix']={k:{'count':len(matrix[k]),'statuses':dict(Counter(c['status'] for c in matrix[k]))} for k in keys}
result['all243CaseIdsUnique']=len({c['id'] for c in allcases})==len(allcases)==243
contract=(P/'contract/00_GATE_A_IMPLEMENTATION_PREFLIGHT.md').read_text(encoding='utf-8');expected_ids=re.findall(r'^\| \d\d \| `(A\d\d_[^`]+)`',contract,re.M)
result['all32LedgerIdsMatchContract']=[s['id'] for s in surfaces]==expected_ids and len(expected_ids)==32
result['artworkModifiedOrGenerated']=False
(R/'independent_neutral_audit.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,indent=2))
