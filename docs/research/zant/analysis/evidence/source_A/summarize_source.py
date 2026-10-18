from pathlib import Path
import json,statistics,collections
import numpy as np
from PIL import Image,ImageDraw,ImageFont
OUT=Path(__file__).resolve().parent;ROOT=OUT.parents[3];SRC=ROOT/'work/ZANT_analysis_sources';MOD=SRC/'modular/NEUTRAL_CHARACTER_MODULAR_REBUILD_V03_2'
d=json.loads((OUT/'source_measurements.json').read_text())
chars=d['characters'];r=d['image_records'];s={}
for k in ['silhouette_iou_same_canvas_gt127','silhouette_iou_after_root_translation_gt127','height_ratio_rebuilt_source','width_ratio_rebuilt_source']:
    vals=[c['comparison'][k] for c in chars];s[k]={'min':min(vals),'median':statistics.median(vals),'max':max(vals)}
s['bottom_positions_source_rebuilt_equal_all44']=all(c['source']['bottom_y_exclusive']==c['rebuilt']['bottom_y_exclusive'] for c in chars)
s['bbox_gt0_heights_source_rebuilt_equal_all44']=all(c['source']['bbox_width_height'][1]==c['rebuilt']['bbox_width_height'][1] for c in chars)
s['fit_assignment_summary']={}
for fit in sorted(set(c['fit_class_supplied'] for c in chars)):
    cc=[c for c in chars if c['fit_class_supplied']==fit]
    s['fit_assignment_summary'][fit]={'characters':[c['id'] for c in cc],'calibration_height_range':[min(c['calibration']['bbox_width_height'][1] for c in cc),max(c['calibration']['bbox_width_height'][1] for c in cc)],'calibration_width_range':[min(c['calibration']['bbox_width_height'][0] for c in cc),max(c['calibration']['bbox_width_height'][0] for c in cc)],'calibration_width_height_ratio_range':[min(c['calibration']['bbox_width_height'][0]/c['calibration']['bbox_width_height'][1] for c in cc),max(c['calibration']['bbox_width_height'][0]/c['calibration']['bbox_width_height'][1] for c in cc)]}
s['catalog_border_pixels']={}
for p in sorted((MOD/'clothing_catalogs').glob('*.png')):
    a=np.array(Image.open(p).convert('RGBA'));m=a[:,:,3]>0
    s['catalog_border_pixels'][p.name]={'top':int(m[0,:].sum()),'bottom':int(m[-1,:].sum()),'left':int(m[:,0].sum()),'right':int(m[:,-1].sum()),'visible_near_magenta_rgb':int(((a[:,:,0]>140)&(a[:,:,2]>140)&(a[:,:,1]<100)&m).sum())}
s['source_partial_alpha_ids']=[c['id'] for c in chars if c['source']['alpha_partial']]
s['source_magenta_ids']=[{'id':c['id'],'exact':c['source']['visible_exact_magenta'],'near':c['source']['visible_near_magenta']} for c in chars if c['source']['visible_near_magenta']]
s['source_rebuild_iou_below_0_92']=[{'id':c['id'],'iou':c['comparison']['silhouette_iou_same_canvas_gt127']} for c in chars if c['comparison']['silhouette_iou_same_canvas_gt127']<.92]
s['original_extra_duplicates']=[g for g in d['duplicate_groups'] if all(x.startswith('original/') and not Path(x).name.startswith('C0') for x in g)]
FONT=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',15)
for fam,sz,th in [('clothing_catalogs',(300,300),35),('gear_accessory_catalogs',(300,190),35)]:
    pp=sorted((MOD/fam).glob('*.png'))
    for page in range(2):
        batch=pp[page*22:(page+1)*22];w,h=sz;im=Image.new('RGBA',(6*w,4*(h+th)),(218,220,221,255));dr=ImageDraw.Draw(im)
        for i,p in enumerate(batch):
            a=Image.open(p).convert('RGBA');a.thumbnail(sz,Image.Resampling.LANCZOS);x=(i%6)*w;y=(i//6)*(h+th);im.alpha_composite(a,(x+(w-a.width)//2,y+(h-a.height)//2));dr.text((x+5,y+h+4),p.name.split('_')[0],font=FONT,fill=(0,0,0))
        im.convert('RGB').save(OUT/f'{fam}_contact_{page+1}.jpg')
(OUT/'source_summary.json').write_text(json.dumps(s,indent=2),encoding='utf-8');print(json.dumps(s,indent=2))
