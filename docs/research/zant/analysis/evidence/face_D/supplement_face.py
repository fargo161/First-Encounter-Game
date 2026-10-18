"""Additional read-only alpha, boundary, content contamination diagnostics."""
from pathlib import Path
import json,collections
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageOps
R=Path('work/ZANT_analysis_sources/face/FIVE_SLOT_FACE_SYSTEM_REFERENCE');O=Path('outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D')
B=np.array(Image.open(R/'base/goose__base_head.png').convert('RGBA'))
mask=np.array(Image.open(R/'technical/slot_masks/lower_face__mask.png'))
def bb(a):
    y,x=np.where(a);return [int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)] if len(x) else None
out={'base_alpha_top_counts':[[int(k),int(v)] for k,v in collections.Counter(B[:,:,3].ravel()).most_common(12)],'base_fully_opaque_pixels':int((B[:,:,3]==255).sum()),'expressions':[]}
for n in range(1,19):
    P=np.array(Image.open(R/f'previews/goose_expr_{n:02d}__preview.png').convert('RGBA'))
    d=np.abs(P.astype('int16')-B.astype('int16'));a=d[:,:,3]>0
    out['expressions'].append({'expression':n,'alpha_changed_pixels':int(a.sum()),'alpha_change_bbox':bb(a),'alpha_max_delta':int(d[:,:,3].max()),'rgb_changed_pixels':int(np.any(d[:,:,:3],axis=2).sum()),'rgb_max_delta':int(d[:,:,:3].max())})
neutral=np.array(Image.open(R/'previews/goose_expr_09__preview.png').convert('RGBA'))
out['preview_alpha_invariant_across_all18']=all(np.array_equal(np.array(Image.open(R/f'previews/goose_expr_{n:02d}__preview.png'))[:,:,3],neutral[:,:,3]) for n in range(1,19))
out['base_alpha_support_equals_preview_alpha_support']=bool(np.array_equal(B[:,:,3]>0,neutral[:,:,3]>0))
# Anatomical membership is not segmented ground truth: inspect fixed known samples visually.
points=[(350,950,'image-left blue collar inside lower mask'),(840,950,'image-right blue collar inside lower mask'),(600,970,'upper neck beneath neutral chin'),(310,660,'image-left ear near lower-mask edge'),(875,660,'image-right ear near lower-mask edge'),(330,435,'hair in brow rectangle')]
out['visually_identified_context_samples']=[{'xy':[x,y],'description':label,'base_rgba':[int(v) for v in B[y,x]],'lower_mask_value':int(mask[y,x])} for x,y,label in points]
# Locate bright-contour candidate pixels as a diagnostic, never a quality metric.
p8=np.array(Image.open(R/'previews/goose_expr_08__preview.png').convert('RGBA'))
candidate=(p8[:,:,:3].min(axis=2)>220)&(np.abs(p8[:,:,:3].astype('int16')-B[:,:,:3].astype('int16')).mean(axis=2)>80)&(mask>0)
out['expr08_bright_changed_candidates']={'test':'RGB minimum>220 and mean abs RGB change>80 inside lower mask; visually inspect, not semantic segmentation','pixels':int(candidate.sum()),'bbox':bb(candidate)}
Image.fromarray(np.where(candidate[:,:,None],np.array([255,0,255],dtype='uint8'),p8[:,:,:3])).save(O/'expr08_bright_candidate_locations.png')
# Every face layer starts with same donor pixels, including hidden RGB.
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',18)
cv=Image.new('RGB',(1400,700),(32,32,32));dr=ImageDraw.Draw(cv)
samples=[('Base collar / neck',Image.fromarray(B).crop((260,800,930,1030))),('Preview08 collar / cheek fringe',Image.fromarray(p8).crop((260,800,930,1030))),('Base brow / eye interfaces',Image.fromarray(B).crop((290,390,910,720))),('Mixed10 eyes +09 brows',Image.open(O/'diagnostic_mix_02.png').crop((290,390,910,720)))]
for i,(label,im) in enumerate(samples):
    x=(i%2)*700;y=(i//2)*350;tile=ImageOps.contain(im.convert('RGBA'),(690,310));cv.paste(tile,(x,y),tile);dr.text((x+5,y+320),label,font=font,fill='white')
cv.save(O/'critical_interface_crops.png')
(O/'supplement_face_measurements.json').write_text(json.dumps(out,indent=2))
print(json.dumps(out,indent=2))
