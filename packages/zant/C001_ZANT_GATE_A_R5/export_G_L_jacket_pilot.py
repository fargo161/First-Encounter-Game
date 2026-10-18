from gate_a_core import *
from PIL import ImageFilter,ImageDraw,ImageFont
Y,X=np.mgrid[:1536,:1024]
donor=np.zeros((1536,1024,4),np.uint8);donor[350:950,520:820]=read('authoring/G_L_jacket_v1_native.png')
rgb=donor[:,:,:3].astype(int)
skin=(rgb[:,:,0]-rgb[:,:,1]>20)&(rgb[:,:,0]-rgb[:,:,2]>45)
donor[skin]=0
old=read('assets/A08_jacket_arm_L_N.png');t=np.clip((Y-435)/45,0,1)[:,:,None]
a=old[:,:,3:4].astype(float)*(1-t)+donor[:,:,3:4]*t
prem=old[:,:,:3].astype(float)*old[:,:,3:4]*(1-t)+donor[:,:,:3].astype(float)*donor[:,:,3:4]*t
arm=np.concatenate((np.floor(prem/np.maximum(a,1)+.5),np.floor(a+.5)),axis=2).astype('uint8');arm[Y<435]=old[Y<435]
torso=read('assets/A03_jacket_open_torso.png')
occ=np.floor(torso[:,:,3]*np.clip((580-Y)/30,0,1)+.5).astype('uint8')
arm[:,:,3]=((arm[:,:,3].astype('uint16')*(255-occ.astype('uint16'))+127)//255).astype('uint8')
Image.fromarray(occ).save(ROOT/'masks/coverage/A10_root_jacket_occlusion.png')
save(arm,'assets/A10_jacket_arm_L_G.png');assert_neutral_lock()
recipes=json.loads((ROOT/'data/neutral_recipes.json').read_text())['recipes']
on=[i for i in recipes['B_on_NN_NN']['layerOrder'] if i not in ['A08_jacket_arm_L_N','A12_hand_L_N']]+['A14_hand_L_G','A10_jacket_arm_L_G']
off=json.loads((ROOT/'authoring/G_L_pilot_export.json').read_text())['layerOrder']
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',13)
pair=Image.new('RGB',(512,410),(47,51,58));d=ImageDraw.Draw(pair)
for j,(outfit,order) in enumerate([('off',off),('on',on)]):
    out=render_order(order);save(out,f'authoring/G_L_{outfit}_pilot.png')
    im=Image.fromarray(backdrop(out));im.save(ROOT/f'evidence/G_L_{outfit}_pilot_native.png')
    im.crop((520,350,790,800)).save(ROOT/f'evidence/G_L_{outfit}_pilot_join_native.png')
    pair.paste(im.resize((256,384),Image.Resampling.LANCZOS).convert('RGB'),(j*256,26));d.text((j*256+4,5),outfit+' / G L + N R / pilot',font=font,fill='white')
pair.save(ROOT/'evidence/G_L_both_outfits_pilot_384.png')
(ROOT/'authoring/G_L_jacket_pilot_export.json').write_text(json.dumps({'status':'PILOT_REVIEW_NOT_ACCEPTED','raw':'G_L_jacket_v1.png','nativeExport':[300,600],'bodyOrigin':[520,350],'skinTexelsExcluded':int(skin.sum()),'GHand':'A14_hand_L_G shared unchanged from tee pilot; no generated jacket-hand pixels selected','wristG':[637,705],'cuffPolicy':'generated cloth may overlap more of same hidden wrist; palm/fingers are the same hand file','rootPolicy':'N source cap paint through435; transition435..480; pure A03 coverage mask on root; no new RGB repair','layerOrder':on,'neutralChanged':False,'reserves':0},indent=2)+'\n')
print(json.dumps({'jacketPilotRendered':True,'sharedHandByteExact':sha('assets/A14_hand_L_G.png'),'neutralUnchanged':True}))
