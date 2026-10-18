"""Read-only reproduction of the additional A06/A14 overlap diagnostic."""
from pathlib import Path
from PIL import Image
import numpy as np,json
R=Path(__file__).resolve().parent
P=R/'fresh_extraction/C001_ZANT_GATE_A_R5_FAILED_G_SLEEVE_PILOT'
a=np.array(Image.open(P/'assets/A06_tee_arm_L_G.png'))
h=np.array(Image.open(P/'assets/A14_hand_L_G.png'))
d=np.zeros((1536,1024,4),np.uint8)
d[350:950,520:820]=np.array(Image.open(P/'authoring/G_L_tee_hand_v1_native.png'))
y,x=np.mgrid[:1536,:1024];s=y-(.7*(x-637)+705)
core=d[:,:,3]>127;inner=np.zeros_like(core)
inner[1:-1,1:-1]=core[1:-1,1:-1]&core[:-2,1:-1]&core[2:,1:-1]&core[1:-1,:-2]&core[1:-1,2:]&core[:-2,:-2]&core[:-2,2:]&core[2:,:-2]&core[2:,2:]
band=core&(abs(s)<=10);inside=inner&(abs(s)<=10)
overlap=(a[:,:,3]>127)&(h[:,:,3]>127);union=(a[:,:,3]>127)|(h[:,:,3]>127)
levels,counts=np.unique(d[:,:,3][band],return_counts=True)
result={'bandDefinition':'abs(y-(.7*(x-637)+705))<=10 with donor alpha>127',
    'donorBandCorePixels':int(band.sum()),'donorBandInterior3x3Pixels':int(inside.sum()),
    'donorBandAlphaDistribution':{str(k):int(v) for k,v in zip(levels,counts)},
    'actualArmHandCoreOverlapInBand':int((overlap&band).sum()),
    'actualArmHandAnyAlphaOverlapInBand':int(((a[:,:,3]>0)&(h[:,:,3]>0)&band).sum()),
    'actualArmHandCoreOverlapInBandInterior':int((overlap&inside).sum()),
    'bandCorePixelsWithNeitherPartCore':int((band&~union).sum()),
    'datumAlphaDonorArmHand':[int(im[705,637,3]) for im in (d,a,h)],
    'interpretationScope':'Overlap/ownership diagnostic of current exported G parts; no art modification, no neutral-interface reassessment.'}
(R/'wrist_overlap_ownership_audit.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,indent=2))
