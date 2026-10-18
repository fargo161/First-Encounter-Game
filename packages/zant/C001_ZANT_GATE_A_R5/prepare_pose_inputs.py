"""Fixed-canvas references for new G art; never exports a runtime pose."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
R=Path(__file__).resolve().parent
def read(n):return Image.open(R/'assets'/n).convert('RGBA')
off=Image.open(R/'expected/B_off_NN_NN.png').convert('RGBA')
off.crop((240,330,784,944)).save(R/'authoring/inputs/accepted_upper_head_excluded.png')
plans={
 'L':{'bodyWindow':[520,350,820,950],'shoulder':[612,407],'elbowGuide':[699,625],'wristGuide':[625,617],'handGuideBox':[536,563,636,647]},
 'R':{'bodyWindow':[210,350,510,950],'shoulder':[380,407],'elbowGuide':[298,635],'wristGuide':[369,643],'handGuideBox':[360,589,455,675]}}
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',12)
for side,arm,hand in [('L','A04_tee_arm_L_N.png','A12_hand_L_N.png'),('R','A05_tee_arm_R_N.png','A13_hand_R_N.png')]:
    plan=plans[side];box=plan['bodyWindow'];x0,y0=box[:2]
    Image.alpha_composite(read(arm),read(hand)).crop(box).save(R/f'authoring/inputs/{side}_N_arm_hand_reference.png')
    guide=Image.new('RGB',(300,600),(39,43,50));d=ImageDraw.Draw(guide)
    pts=[(plan[k][0]-x0,plan[k][1]-y0) for k in ['shoulder','elbowGuide','wristGuide']]
    d.line(pts,fill=(100,205,245),width=2)
    for label,pt in zip(['FIXED shoulder','elbow guide','G wrist guide'],pts):
        d.ellipse((pt[0]-4,pt[1]-4,pt[0]+4,pt[1]+4),outline='yellow',width=2);d.text((pt[0]+7,pt[1]-5),label,font=font,fill='white')
    b=plan['handGuideBox'];b=[b[0]-x0,b[1]-y0,b[2]-x0,b[3]-y0];d.rectangle(b,outline=(255,170,100),width=1)
    d.text((6,570),'REFERENCE ONLY / body window '+str(box),font=font,fill='white')
    guide.save(R/f'authoring/inputs/{side}_G_layout_reference_only.png')
(R/'authoring/G_pose_plan.json').write_text(json.dumps({'bodyFrame':[1024,1536],'fixedBodyScale':1,'plans':plans,'elbowWristAreArtGuidesUntilMeasured':True,'runtimeTransform':'identity; crop reconstructs integer body coordinates','upperCapPolicy':'attach at frozen shoulder; no neutral edit','hands':'new G artwork; shared unchanged between tee and jacket'},indent=2)+'\n')
print('Prepared 5 head-excluded pose references and fixed-canvas plans.')
