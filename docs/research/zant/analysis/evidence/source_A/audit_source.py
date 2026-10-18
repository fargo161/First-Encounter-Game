"""Read-only source forensics; only writes diagnostic evidence beside this script."""
from pathlib import Path
import json, hashlib, csv, math
from collections import Counter, defaultdict
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[4]
SRC=ROOT/'work/ZANT_analysis_sources'
MOD=SRC/'modular/NEUTRAL_CHARACTER_MODULAR_REBUILD_V03_2'
OUT=Path(__file__).resolve().parent
OUT.mkdir(parents=True, exist_ok=True)
FONT=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',19)
SMALL=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',15)

def hash_file(p): return hashlib.sha256(p.read_bytes()).hexdigest()

def component_boxes(mask,minimum=64):
    # Row-run union find; records alpha-connected blobs, not semantic garment counts.
    parents=[]; runs=[]; prev=[]
    def find(i):
        while parents[i]!=i:
            parents[i]=parents[parents[i]]; i=parents[i]
        return i
    for y,row in enumerate(mask):
        d=np.diff(np.r_[False,row,False].astype(np.int8))
        spans=list(zip(np.where(d==1)[0],np.where(d==-1)[0]))
        curr=[]
        for l,r in spans:
            i=len(parents); parents.append(i); runs.append((int(l),int(y),int(r),int(r-l))); curr.append((l,r,i))
            for pl,pr,pi in prev:
                if pr>=l and pl<=r: parents[find(i)]=find(pi)
        prev=curr
    groups={}
    for i,(l,y,r,n) in enumerate(runs):
        k=find(i)
        if k not in groups: groups[k]=[l,y,r,y+1,n]
        else:
            g=groups[k];g[0]=min(g[0],l);g[1]=min(g[1],y);g[2]=max(g[2],r);g[3]=max(g[3],y+1);g[4]+=n
    return sorted([g for g in groups.values() if g[4]>=minimum],key=lambda g:-g[4])

def properties(p,components=False):
    im=Image.open(p).convert('RGBA'); a=np.asarray(im); alpha=a[:,:,3]; m=alpha>0
    ys,xs=np.where(m)
    bbox=[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)] if len(xs) else None
    result={'path':str(p.relative_to(SRC)).replace('\\','/'),'sha256':hash_file(p),'size':list(im.size),'mode_original':Image.open(p).mode,
        'alpha_nonzero':int(m.sum()),'alpha_partial':int(((alpha>0)&(alpha<255)).sum()),'alpha_opaque':int((alpha==255).sum()),
        'bbox_alpha_gt0':bbox,'bbox_alpha_gt127':list(im.getchannel('A').point(lambda v:255 if v>127 else 0).getbbox() or []),
        'alpha_weighted_centroid_xy':[float((xs*alpha[m]).sum()/alpha[m].sum()),float((ys*alpha[m]).sum()/alpha[m].sum())] if len(xs) else None,
        'rgb_nonzero_under_zero_alpha':int(((a[:,:,:3]!=0).any(2)&(alpha==0)).sum()),
        'visible_exact_magenta':int(((a[:,:,:3]==[255,0,255]).all(2)&m).sum()),
        'visible_near_magenta':int(((a[:,:,0]>200)&(a[:,:,1]<50)&(a[:,:,2]>200)&m).sum())}
    if bbox:
        l,t,r,b=bbox;h=b-t
        result['bbox_width_height']=[r-l,h];result['bbox_center_x']=(l+r)/2;result['bottom_y_exclusive']=b
        result['relative_band_widths']={}
        for name,lo,hi in [('head',.02,.18),('shoulder',.20,.30),('torso',.30,.48),('pelvis',.48,.60),('legs',.61,.83),('feet',.9,1)]:
            band=m[t+int(h*lo):t+int(h*hi)]
            by,bx=np.where(band)
            result['relative_band_widths'][name]=int(bx.max()-bx.min()+1) if len(bx) else 0
    if components:result['alpha_components_area_ge64']=component_boxes(m)
    return result

def binary_iou(a,b):
    den=np.logical_or(a,b).sum();return float(np.logical_and(a,b).sum()/den) if den else 1.0

def translated(m,dx,dy):
    out=np.zeros_like(m);h,w=m.shape
    x0=max(0,dx);x1=min(w,w+dx);y0=max(0,dy);y1=min(h,h+dy)
    if x1>x0 and y1>y0:out[y0:y1,x0:x1]=m[y0-dy:y1-dy,x0-dx:x1-dx]
    return out

def compare(pa,pb,ma,mb):
    a=np.asarray(Image.open(pa).convert('RGBA'));b=np.asarray(Image.open(pb).convert('RGBA'))
    am=a[:,:,3]>127;bm=b[:,:,3]>127
    ba=ma['bbox_alpha_gt127'];bb=mb['bbox_alpha_gt127']
    dx=round((ba[0]+ba[2]-bb[0]-bb[2])/2);dy=ba[3]-bb[3]
    both=am&bm
    return {'silhouette_iou_same_canvas_gt127':binary_iou(am,bm),'silhouette_iou_same_canvas_gt0':binary_iou(a[:,:,3]>0,b[:,:,3]>0),
      'rebuilt_align_to_source_root_dx_dy':[dx,dy],'silhouette_iou_after_root_translation_gt127':binary_iou(am,translated(bm,dx,dy)),
      'bbox_delta_rebuilt_minus_source':[bb[i]-ba[i] for i in range(4)],
      'height_ratio_rebuilt_source':(bb[3]-bb[1])/(ba[3]-ba[1]),'width_ratio_rebuilt_source':(bb[2]-bb[0])/(ba[2]-ba[0]),
      'rgb_mae_on_shared_opaque':float(np.abs(a[:,:,:3].astype(float)-b[:,:,:3].astype(float))[both].mean()) if both.any() else None,
      'note':'Silhouette overlap measures shape/placement, never identity; RGB error includes re-rendering and alignment.'}

manifest=json.loads((MOD/'metadata/character_manifest_v03.json').read_text(encoding='utf-8'))
records={}; pairs={}; duplicate_map=defaultdict(list)
for p in sorted(SRC.rglob('*.png')):
    if 'face' in p.relative_to(SRC).parts:continue
    fam=p.parent.name
    if fam in ['source_masters','rebuilt_composites','body_calibration','fit_classes','clothing_catalogs','gear_accessory_catalogs'] or p.parent==SRC/'original/characters trapstar source' or p.parent==SRC/'wardrobe':
        props=properties(p,components=fam in ['clothing_catalogs','gear_accessory_catalogs'] or p.parent==SRC/'wardrobe')
        records[props['path']]=props;duplicate_map[props['sha256']].append(props['path'])

characters=[]
for ch in manifest['characters']:
    cid=ch['id']; ps=MOD/ch['source_master'];pr=MOD/ch['rebuilt_composite'];pc=MOD/ch['body_calibration']
    keys=[str(p.relative_to(SRC)).replace('\\','/') for p in [ps,pr,pc]]
    ms,mr,mc=[records[k] for k in keys]
    pairs[cid]=compare(ps,pr,ms,mr)
    characters.append({'id':cid,'fit_class_supplied':ch['fit_class'],'source':ms,'rebuilt':mr,'calibration':mc,'comparison':pairs[cid],'garments_supplied':[x['logical_family'] for x in ch.get('garments',[])]})

fits={}
for name,cid in manifest['recommended_fit_masters'].items():
    p=MOD/f'fit_classes/{name}_canonical_rgba.png';q=MOD/f'body_calibration/{cid}_fit_calibration_rgba.png'
    fits[name]={'nominated_character':cid,'identical_to_calibration':hash_file(p)==hash_file(q),'properties':records[str(p.relative_to(SRC)).replace('\\','/')]}

summary={}
for fam in ['source_masters','rebuilt_composites','body_calibration','fit_classes','clothing_catalogs','gear_accessory_catalogs']:
    rr=[r for k,r in records.items() if '/'+fam+'/' in k]
    bb=[r for r in rr if r['bbox_alpha_gt0']]
    summary[fam]={'count':len(rr),'sizes':dict(Counter(str(r['size']) for r in rr)),'partial_alpha_files':sum(r['alpha_partial']>0 for r in rr),'empty_files':[r['path'] for r in rr if not r['alpha_nonzero']],
    'bottom_y_range':[min(r['bottom_y_exclusive'] for r in bb),max(r['bottom_y_exclusive'] for r in bb)] if bb else None,
    'bbox_center_x_range':[min(r['bbox_center_x'] for r in bb),max(r['bbox_center_x'] for r in bb)] if bb else None,
    'bbox_height_range':[min(r['bbox_width_height'][1] for r in bb),max(r['bbox_width_height'][1] for r in bb)] if bb else None,
    'visible_exact_magenta_total':sum(r['visible_exact_magenta'] for r in rr)}

data={'method':'All PNGs fully decoded with Pillow 12.3.0. Metrics use alpha>0 and >127 as named; row-run 8-connectivity components >=64 pixels count blobs only. Original art and supplied manifests never modified.','families':summary,'characters':characters,'fit_references':fits,'image_records':records,'duplicate_groups':[v for v in duplicate_map.values() if len(v)>1]}
(OUT/'source_measurements.json').write_text(json.dumps(data,indent=2),encoding='utf-8')
with (OUT/'character_comparisons.csv').open('w',newline='',encoding='utf-8') as f:
    fields=['id','fit_class','source_bottom','rebuilt_bottom','source_height','rebuilt_height','source_width','rebuilt_width','iou_raw','iou_root_aligned','height_ratio','width_ratio']
    wr=csv.DictWriter(f,fields);wr.writeheader()
    for c in characters:
        s,r,d=c['source'],c['rebuilt'],c['comparison']
        wr.writerow(dict(zip(fields,[c['id'],c['fit_class_supplied'],s['bottom_y_exclusive'],r['bottom_y_exclusive'],s['bbox_width_height'][1],r['bbox_width_height'][1],s['bbox_width_height'][0],r['bbox_width_height'][0],d['silhouette_iou_same_canvas_gt127'],d['silhouette_iou_after_root_translation_gt127'],d['height_ratio_rebuilt_source'],d['width_ratio_rebuilt_source']])))

def thumb(p,w,h,background=(215,218,219,255)):
    im=Image.open(p).convert('RGBA');im.thumbnail((w,h),Image.Resampling.LANCZOS)
    out=Image.new('RGBA',(w,h),background);out.alpha_composite(im,((w-im.width)//2,(h-im.height)//2));return out.convert('RGB')

def grid(paths,labels,dest,cols=6,tilew=300,tileh=450,labelh=45):
    rows=math.ceil(len(paths)/cols);out=Image.new('RGB',(cols*tilew,rows*(tileh+labelh)),(240,240,235));d=ImageDraw.Draw(out)
    for i,(p,l) in enumerate(zip(paths,labels)):
        x=(i%cols)*tilew;y=(i//cols)*(tileh+labelh);out.paste(thumb(p,tilew,tileh),(x,y));d.text((x+6,y+tileh+3),l,font=SMALL,fill=(0,0,0))
    out.save(OUT/dest)

for family,folder,pattern in [('source','source_masters','*_source_neutral_rgba.png'),('rebuilt','rebuilt_composites','*_neutral_composite_rgba.png'),('calibration','body_calibration','*_fit_calibration_rgba.png')]:
    pp=sorted((MOD/folder).glob(pattern))
    for page in range(2):
        batch=pp[page*22:(page+1)*22];grid(batch,[p.name.split('_')[0] for p in batch],f'{family}_contact_{page+1}.jpg')

fitpaths=sorted((MOD/'fit_classes').glob('*.png'))
grid(fitpaths,[p.stem.replace('_canonical_rgba','') for p in fitpaths],'eight_fit_references.jpg',cols=4,tilew=300,tileh=450)

for i,ids in enumerate([['C001','C020'],['C028','C033'],['C034','C010']]):
    pp=[];ll=[]
    for cid in ids:
        for folder,suffix,label in [('source_masters','source_neutral_rgba','SOURCE'),('rebuilt_composites','neutral_composite_rgba','REBUILT'),('body_calibration','fit_calibration_rgba','CALIBRATION'),('clothing_catalogs','clothing_inventory_rgba','WARDROBE')]:
            pp.append(MOD/folder/f'{cid}_{suffix}.png');ll.append(f'{cid} {label}')
    grid(pp,ll,f'comparison_plate_{i+1}.jpg',cols=4,tilew=420,tileh=630)

extras=sorted(p for p in (SRC/'original/characters trapstar source').glob('*.png') if not p.name.startswith('C0'))
for page in range(3):
    batch=extras[page*18:(page+1)*18];grid(batch,[f'{page*18+i+1:02d} {p.name[:30]}' for i,p in enumerate(batch)],f'original_reference_contact_{page+1}.jpg',cols=6,tilew=300,tileh=350,labelh=50)
(OUT/'original_reference_key.json').write_text(json.dumps({str(i+1):p.name for i,p in enumerate(extras)},indent=2),encoding='utf-8')

print(json.dumps({'families':summary,'fit_copies':{k:v['identical_to_calibration'] for k,v in fits.items()},'pair_iou_range':[min(p['silhouette_iou_same_canvas_gt127'] for p in pairs.values()),max(p['silhouette_iou_same_canvas_gt127'] for p in pairs.values())],'pair_root_iou_range':[min(p['silhouette_iou_after_root_translation_gt127'] for p in pairs.values()),max(p['silhouette_iou_after_root_translation_gt127'] for p in pairs.values())]},indent=2))
