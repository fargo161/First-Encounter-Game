"""Read-only face forensics; output diagnostic composites/measurements only.
Run from workspace root. Never imports or executes the supplied builder.
"""
from pathlib import Path
import hashlib,json,itertools
from collections import Counter
import numpy as np
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageChops

ROOT=Path('work/ZANT_analysis_sources/face/FIVE_SLOT_FACE_SYSTEM_REFERENCE')
OUT=Path('outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D')
OUT.mkdir(parents=True,exist_ok=True)
M=json.loads((ROOT/'manifest/goose_expression_manifest.json').read_text())
ORDER=M['slotDrawOrder'][1:]
SIZE=(1187,1484)
BASE=Image.open(ROOT/M['baseHead']).convert('RGBA'); B=np.array(BASE)
MASKS={x['slotId']:np.array(Image.open(ROOT/x['mask']).convert('L')) for x in M['slotDefinitions']}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest().upper()
def bbox(mask):
    yy,xx=np.where(mask)
    return [int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1)] if len(xx) else None
def difference(a,b):
    d=np.abs(a.astype('int16')-b.astype('int16'))
    return {'all_channels_exact':bool(not np.any(d)), 'different_pixels':int(np.any(d,axis=2).sum()),'max_channel_error':int(d.max()),'bbox':bbox(np.any(d,axis=2))}
def norm(raw,fallback):
    # Independent reproduction of documented fixed-frame registration.
    usable='A' in raw.getbands() and raw.getchannel('A').getextrema()[0]<255
    source=raw.convert('RGBA')
    if source.size!=(1165,1350):source=ImageOps.fit(source,(1165,1350),Image.Resampling.LANCZOS,centering=(.5,.5))
    cv=Image.new('RGBA',SIZE);cv.alpha_composite(source,dest=(11,67))
    if fallback and not usable:
        a=BASE.getchannel('A');edge=a.point(lambda x:255 if x<250 else 0)
        cv=Image.composite(BASE,cv,edge);cv.putalpha(a)
    return cv,usable
def compose(donors):
    comp=BASE.copy()
    for s in ORDER:comp=Image.alpha_composite(comp,LAYERS[(donors[s],s)])
    return comp
FONT=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',18)
SMALL=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',15)
def sheet(tiles,name,cols=4,ts=(360,390)):
    w,h=ts;cv=Image.new('RGB',(cols*w,((len(tiles)+cols-1)//cols)*h),(26,29,33));d=ImageDraw.Draw(cv)
    for i,(label,im) in enumerate(tiles):
        x=(i%cols)*w;y=(i//cols)*h
        im=im.convert('RGBA'); tile=ImageOps.contain(im,(w-10,h-49),Image.Resampling.LANCZOS)
        cv.paste(tile,(x+(w-tile.width)//2,y+5),tile)
        for j,line in enumerate(label.split('\n')):d.text((x+7,y+h-42+18*j),line,font=SMALL,fill=(245,245,245))
    cv.save(OUT/name)

F={}
for p in sorted(ROOT.rglob('*')):
    if p.suffix.lower() in ('.png','.jpg'):
        with Image.open(p) as im:
            im.load();a=np.array(im.convert('RGBA'));alpha=a[:,:,3]
            F[p.relative_to(ROOT).as_posix()]={'size':list(im.size),'mode':im.mode,'alpha_min_max':[int(alpha.min()),int(alpha.max())], 'alpha_bbox':bbox(alpha>0), 'visible_pixels':int((alpha>0).sum()),'hidden_rgb_nonzero_pixels':int(((alpha==0)&np.any(a[:,:,:3]>0,axis=2)).sum())}
HASH={p:sha(ROOT/p)==v['sha256'] for p,v in M['files'].items()}
LAYERS={};P={};E=[];S=[]
union=np.any(np.stack([x>0 for x in MASKS.values()]),axis=0)
base09,_=norm(Image.open(ROOT/'generated_full/goose_expr_09__generated.png'),False)
for ex in M['expressions']:
    eid=ex['expressionId']; n=int(eid[-2:]);raw=Image.open(ROOT/ex['generatedSource']);normalized,usable=norm(raw,True);N=np.array(normalized)
    comp=BASE.copy()
    for s in ORDER:
        im=Image.open(ROOT/ex['slots'][s]).convert('RGBA');L=np.array(im);LAYERS[(n,s)]=im
        expected=np.array(normalized).copy();expected[:,:,3]=np.array(ImageChops.multiply(normalized.getchannel('A'),Image.fromarray(MASKS[s])))
        comp=Image.alpha_composite(comp,im)
        ring=(MASKS[s]>0)&(MASKS[s]<128)&(B[:,:,3]>250)
        dd=np.abs(L[:,:,:3].astype('int16')-B[:,:,:3].astype('int16')).mean(axis=2)
        S.append({'expression':n,'slot':s,'alpha_equals_mask_times_normalized_alpha':bool(np.array_equal(L[:,:,3],expected[:,:,3])), 'all_channels_equal_independent_extraction':bool(np.array_equal(L,expected)), 'alpha_bbox':bbox(L[:,:,3]>0),'alpha_support_pixels':int((L[:,:,3]>0).sum()),'alpha_partial_pixels':int(((L[:,:,3]>0)&(L[:,:,3]<255)).sum()), 'feather_raw_rgb_vs_base_mean_abs_0_255':round(float(dd[ring].mean()),3),'feather_raw_rgb_vs_base_p95':round(float(np.percentile(dd[ring],95)),3)})
    preview=Image.open(ROOT/ex['preview']).convert('RGBA');P[n]=preview;A=np.array(preview);C=np.array(comp)
    raw_vs_preview=difference(N,A)
    E.append({'expression':n,'name':ex['expressionName'],'raw_mode':raw.mode,'raw_size':list(raw.size),'usable_source_alpha':bool(usable), 'recomposition':difference(C,A),'preview_alpha_equals_base':bool(np.array_equal(A[:,:,3],B[:,:,3])), 'outside_slot_union_equals_base':bool(np.array_equal(A[~union],B[~union])), 'preview_vs_base':difference(A,B),'normalized_raw_vs_preview':raw_vs_preview,'normalized_raw_different_pixels_outside_union':int(np.any(N[:,:,:3]!=A[:,:,:3],axis=2)[~union & (B[:,:,3]>0)].sum())})

OVER=[]
for s,t in itertools.combinations(ORDER,2):
    ov=(MASKS[s]>0)&(MASKS[t]>0)
    if ov.any():OVER.append({'first':s,'second':t,'overlap_pixels':int(ov.sum()),'bbox':bbox(ov),'both_alpha_over_half_pixels':int(((MASKS[s]>127)&(MASKS[t]>127)).sum())})
# Controlled validator falsification: identical-alpha one-pixel RGB mutation.
test=BASE.copy();ta=np.array(test);pt=tuple(np.argwhere(B[:,:,3]==255)[0]);y,x=pt;ta[y,x,0]^=1
diff=ImageChops.difference(BASE,Image.fromarray(ta))
VALIDATOR={'mutation_xy':[int(x),int(y)],'default_RGBA_getbbox':diff.getbbox(),'all_channel_numpy_equal':bool(np.array_equal(B,ta)),'RGB_getbbox':diff.convert('RGB').getbbox(),'all_band_getbbox_alpha_only_false':diff.getbbox(alpha_only=False)}
MIXES=[('M1 asymmetric brows05/18; eyes09; lower18',{'LEFT_BROW':5,'RIGHT_BROW':18,'LEFT_EYE':9,'RIGHT_EYE':9,'LOWER_FACE':18}),('M2 paired eyes10; brows09; lower09',{'LEFT_BROW':9,'RIGHT_BROW':9,'LEFT_EYE':10,'RIGHT_EYE':10,'LOWER_FACE':9}),('M3 unpaired eyes10/12; rest09',{'LEFT_BROW':9,'RIGHT_BROW':9,'LEFT_EYE':10,'RIGHT_EYE':12,'LOWER_FACE':9}),('M4 paired eyes12; brows09; lower09',{'LEFT_BROW':9,'RIGHT_BROW':9,'LEFT_EYE':12,'RIGHT_EYE':12,'LOWER_FACE':9}),('M5 eyes01; brows09; lower08',{'LEFT_BROW':9,'RIGHT_BROW':9,'LEFT_EYE':1,'RIGHT_EYE':1,'LOWER_FACE':8}),('M6 brows03; eyes09; lower01',{'LEFT_BROW':3,'RIGHT_BROW':3,'LEFT_EYE':9,'RIGHT_EYE':9,'LOWER_FACE':1}),('M7 left wink15/right09; lower18',{'LEFT_BROW':18,'RIGHT_BROW':9,'LEFT_EYE':15,'RIGHT_EYE':9,'LOWER_FACE':18}),('M8 brows18; eyes13; lower17',{'LEFT_BROW':18,'RIGHT_BROW':18,'LEFT_EYE':13,'RIGHT_EYE':13,'LOWER_FACE':17})]
mixout=[]; tiles=[]
for k,(label,donors) in enumerate(MIXES,1):
    comp=compose(donors); comp.save(OUT/f'diagnostic_mix_{k:02d}.png')
    overlaps=[]
    for o in OVER:
        s,t=o['first'],o['second'];ov=(MASKS[s]>0)&(MASKS[t]>0)
        aa=np.array(LAYERS[(donors[s],s)])[:,:,:3].astype('int16');bb=np.array(LAYERS[(donors[t],t)])[:,:,:3].astype('int16')
        dd=np.abs(aa-bb).mean(axis=2)
        overlaps.append({'slots':[s,t],'donors':[donors[s],donors[t]],'mean_rgb_disagreement_in_overlap':round(float(dd[ov].mean()),3),'p95_rgb_disagreement_in_overlap':round(float(np.percentile(dd[ov],95)),3)})
    mixout.append({'label':label,'donors':donors,'overlap_source_disagreement':overlaps})
    tiles.append((label.replace('; ',';\n',1),comp.crop((240,330,960,1080))))
sheet(tiles,'diagnostic_mixes_contact.png',4,(400,460))
sheet([(f'{n:02d} '+M['expressions'][n-1]['expressionName'].replace('_',' '),P[n].crop((240,330,960,1080))) for n in range(1,19)],'all_preview_face_crops.png',4,(400,460))
extremes=[1,3,4,8,13,17,18];tiles=[]
for n in extremes:
    nr,_=norm(Image.open(ROOT/f'generated_full/goose_expr_{n:02d}__generated.png'),True)
    tiles.extend([(f'{n:02d} normalized source edit',nr.crop((240,330,960,1080))),(f'{n:02d} saved five-slot preview',P[n].crop((240,330,960,1080)))])
sheet(tiles,'extremes_normalized_vs_preview.png',4,(360,420))
sheet([('BASE (hair+ears+neck+tracksuit)',BASE),('LOWER_FACE08 visible footprint',LAYERS[(8,'LOWER_FACE')]),('LEFT_EYE10 visible footprint',LAYERS[(10,'LEFT_EYE')]),('RIGHT_EYE12 visible footprint',LAYERS[(12,'RIGHT_EYE')])],'base_and_slots.png',4,(360,470))
# Pixel-exact difference heatmap diagnostically compares reconstruction and normalized raw08.
overlay=BASE.copy(); od=ImageDraw.Draw(overlay)
for i,s in enumerate(ORDER):od.rectangle(bbox(MASKS[s]>0),outline=[(255,70,70),(255,170,50),(60,220,255),(60,255,130),(220,90,255)][i],width=4)
overlay.save(OUT/'mask_boxes_on_base.png')
out={'scope':'Read-only evidence study and diagnostic recompositions; no production assets generated.', 'root':str(ROOT),'base09_independent_normalization':difference(np.array(base09),B),'files':F,'manifest_hashes':{'checked':len(HASH),'all_match':all(HASH.values()),'mismatches':[k for k,v in HASH.items() if not v]},'masks':{s:{'bbox':bbox(a>0),'support_pixels':int((a>0).sum()),'opaque_pixels':int((a==255).sum()),'partial_pixels':int(((a>0)&(a<255)).sum()),'alpha_levels':int(len(np.unique(a)))} for s,a in MASKS.items()},'overlaps':OVER,'expressions':E,'slots':S,'diagnostic_mixes':mixout,'validator_mutation_demonstration':VALIDATOR}
(OUT/'face_measurements.json').write_text(json.dumps(out,indent=2))
print(json.dumps({'manifest_hashes':out['manifest_hashes'],'base09_normalization':out['base09_independent_normalization'],'recomposition_exact_count':sum(e['recomposition']['all_channels_exact'] for e in E),'preview_alpha_invariant_count':sum(e['preview_alpha_equals_base'] for e in E),'outside_union_invariant_count':sum(e['outside_slot_union_equals_base'] for e in E),'source_alpha_usable_count':sum(e['usable_source_alpha'] for e in E),'independent_slot_extractions_exact':sum(e['all_channels_equal_independent_extraction'] for e in S),'validator_mutation':VALIDATOR,'masks':out['masks'],'overlaps':OVER},indent=2))
