"""First G donor export and frozen-neutral attachment check, not acceptance."""
from gate_a_core import *
from PIL import ImageFilter,ImageDraw,ImageFont
Y,X=np.mgrid[:1536,:1024]
donor=np.zeros((1536,1024,4),np.uint8)
donor[350:950,520:820]=read('authoring/G_L_tee_hand_v1_native.png')
# Isolated, saturated generation matte specks only; never source/head art.
rgb=donor[:,:,:3].astype(int)
edge=np.array(Image.fromarray(donor[:,:,3]).filter(ImageFilter.MinFilter(3)))<200
bad=edge&((rgb[:,:,0]-rgb[:,:,1]>145)|(rgb[:,:,1]-rgb[:,:,2]>140))
donor[bad]=0
old=read('assets/A04_tee_arm_L_N.png')
t=np.clip((Y-435)/45,0,1)[:,:,None]
a=old[:,:,3:4].astype(float)*(1-t)+donor[:,:,3:4]*t
prem=old[:,:,:3].astype(float)*old[:,:,3:4]*(1-t)+donor[:,:,:3].astype(float)*donor[:,:,3:4]*t
mixed=np.concatenate((np.floor(prem/np.maximum(a,1)+.5),np.floor(a+.5)),axis=2).astype('uint8')
mixed[Y<435]=old[Y<435]
distance=Y-(.7*(X-637)+705)
arm=mixed.copy();arm[distance>10]=0
hand=donor.copy();hand[distance < -10]=0
# Only one owner of each antialiased exterior texel in the wrist overlap.
overlap=(distance>=-10)&(distance<=10)&(donor[:,:,3]<255)
arm[overlap&(distance>=0)]=0;hand[overlap&(distance<0)]=0
# The forearm must read in front of the torso. Conceal only its shoulder root
# with a pure coverage mask derived from frozen tee ownership, not repair RGB.
tee=read('assets/A02_tee_torso.png')
root_occlusion=np.floor(tee[:,:,3]*np.clip((580-Y)/30,0,1)+.5).astype('uint8')
arm[:,:,3]=((arm[:,:,3].astype('uint16')*(255-root_occlusion.astype('uint16'))+127)//255).astype('uint8')
(ROOT/'masks/coverage').mkdir(parents=True,exist_ok=True)
Image.fromarray(root_occlusion).save(ROOT/'masks/coverage/A06_root_tee_occlusion.png')
save(arm,'assets/A06_tee_arm_L_G.png');save(hand,'assets/A14_hand_L_G.png')
assert_neutral_lock()
base=json.loads((ROOT/'data/neutral_recipes.json').read_text())['recipes']['B_off_NN_NN']['layerOrder']
order=[i for i in base if i not in ['A04_tee_arm_L_N','A12_hand_L_N']]
order.extend(['A14_hand_L_G','A06_tee_arm_L_G'])
out=render_order(order);save(out,'authoring/G_L_pilot_composite.png')
Image.fromarray(backdrop(out)).save(ROOT/'evidence/G_L_pilot_native.png')
Image.fromarray(backdrop(out)).resize((256,384),Image.Resampling.LANCZOS).save(ROOT/'evidence/G_L_pilot_384.png')
Image.fromarray(backdrop(out)).crop((520,350,780,800)).save(ROOT/'evidence/G_L_pilot_join_native.png')
(ROOT/'authoring/G_L_pilot_export.json').write_text(json.dumps({'status':'PILOT_REVIEW_NOT_ACCEPTED','raw':'G_L_tee_hand_v1.png','nativeExport':{'rawFrame':list(Image.open(ROOT/'authoring/raw/G_L_tee_hand_v1.png').size),'wholeCanvasResize':[300,600],'bodyOrigin':[520,350],'resample':'Lanczos'},'shoulder':[612,407],'wristG':[637,705],'wristSeamLine':'y = .7*(x-637)+705','wristHiddenOverlapEachSide':10,'matteTexelsRemoved':int(bad.sum()),'root':'accepted N cap paint retained above body435, new G transition435..480; then pure frozen-tee root-occlusion alpha baked into G only; no neutral modification','layerOrder':order,'depthRationale':'G hand then whole G arm in front, cuff/forearm over hidden hand wrist. Shoulder root concealed using pure coverage ownership mask from frozen A02, full at y<=550, fades to zero by580. No repair RGB, repeated arm draw, extra painted layer or reserve.'},indent=2)+'\n')
print(json.dumps({'pilotExported':True,'frozenNeutralUnchanged':True,'G_Wrist':[637,705],'paintedBaselineParts':17,'reservesUsed':0}))
