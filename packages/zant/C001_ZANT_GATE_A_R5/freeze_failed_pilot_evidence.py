"""After stop: render/measure existing failed G sleeve, no new art or repair."""
from gate_a_core import *
from PIL import ImageDraw,ImageFont
Y,X=np.mgrid[:1536,:1024]
# Keep exactly the previously declared donor export/attachment method. V2 has
# no generated hand. No local warp, cuff shift, new body, or neutral repair.
donor=np.zeros((1536,1024,4),np.uint8);donor[350:950,520:820]=read('authoring/G_L_jacket_v2_native.png')
old=read('assets/A08_jacket_arm_L_N.png');t=np.clip((Y-435)/45,0,1)[:,:,None]
a=old[:,:,3:4].astype(float)*(1-t)+donor[:,:,3:4]*t
prem=old[:,:,:3].astype(float)*old[:,:,3:4]*(1-t)+donor[:,:,:3].astype(float)*donor[:,:,3:4]*t
arm=np.concatenate((np.floor(prem/np.maximum(a,1)+.5),np.floor(a+.5)),axis=2).astype('uint8');arm[Y<435]=old[Y<435]
occ=np.array(Image.open(ROOT/'masks/coverage/A10_root_jacket_occlusion.png'))
arm[:,:,3]=((arm[:,:,3].astype('uint16')*(255-occ.astype('uint16'))+127)//255).astype('uint8')
save(arm,'assets/A10_jacket_arm_L_G.png');assert_neutral_lock()
neutral=json.loads((ROOT/'data/neutral_recipes.json').read_text())['recipes']
off_order=json.loads((ROOT/'authoring/G_L_pilot_export.json').read_text())['layerOrder']
on_order=json.loads((ROOT/'authoring/G_L_jacket_pilot_export.json').read_text())['layerOrder']
orders={k:v['layerOrder'] for k,v in neutral.items()}
orders.update(B_off_GN_NN=off_order,B_on_GN_NN=on_order)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',14)
pair=Image.new('RGB',(1024,424),(47,51,58));d=ImageDraw.Draw(pair)
labels=['Accepted neutral off','Accepted neutral on','G pilot off / NOT ACCEPTED','G pilot on / FAIL / STOP']
results={}
for j,(id,order) in enumerate(orders.items()):
    out=render_order(order)
    if id in neutral:
        before=read('expected/'+id+'.png');assert np.array_equal(out,before),id
    else:save(out,'expected/'+id+'.png')
    results[id]={'layerOrder':order,'decodedRGBA_SHA256':hashlib.sha256(out.tobytes()).hexdigest(),'status':'PASS_ACCEPTED_NEUTRAL_REPRODUCTION' if id in neutral else ('FAIL_SOURCE_GARMENT_AND_WRIST_INTERFACE' if id=='B_on_GN_NN' else 'UNACCEPTED_PILOT_RENDERED_NOT_GATE_PASS')}
    im=Image.fromarray(backdrop(out));im.save(ROOT/f'evidence/{id}_native.png')
    im.resize((256,384),Image.Resampling.LANCZOS).save(ROOT/f'evidence/{id}_384.png')
    pair.paste(im.resize((256,384),Image.Resampling.LANCZOS).convert('RGB'),(j*256,40));d.text((j*256+3,8),labels[j],font=font,fill='white')
    if id not in neutral:
        im.crop((520,350,790,810)).save(ROOT/f'evidence/{id}_upper_interface_native.png')
        for bg,rgb in [('light',(240,240,236)),('dark',(18,22,29)),('magenta',(220,0,150)),('green',(0,190,75))]:
            Image.fromarray(backdrop(out,rgb)).crop((540,650,720,810)).save(ROOT/f'evidence/{id}_wrist_native_{bg}.png')
        grid=((X//11+Y//11)%2)*22;b=np.empty_like(out)
        b[:,:,0]=70+grid;b[:,:,1]=83+grid;b[:,:,2]=91+grid;b[:,:,3]=255
        Image.fromarray(over(b,out)).crop((540,650,720,810)).save(ROOT/f'evidence/{id}_wrist_native_textured.png')
pair.save(ROOT/'evidence/R5_STOP_comparison_384.png')
# Explicitly mark the already selected G wrist, not a newly proposed anchor.
on=Image.open(ROOT/'evidence/B_on_GN_NN_upper_interface_native.png').convert('RGB');d=ImageDraw.Draw(on)
x,y=637-520,705-350;d.line((x-8,y,x+8,y),fill=(255,30,180),width=1);d.line((x,y-8,x,y+8),fill=(255,30,180),width=1)
d.text((4,322),'Shared G wrist = body(637,705)',font=font,fill=(255,160,220))
on.save(ROOT/'evidence/FAILED_G_L_wrist_registration_native.png')
ledger=json.loads((ROOT/'data/surface_ledger.json').read_text())
for s in ledger['surfaces']:
    if s['id'] in ['A06_tee_arm_L_G','A14_hand_L_G','A10_jacket_arm_L_G']:
        s['path']='assets/'+s['id']+'.png';s['status']='FAILED_PILOT_NOT_APPROVED' if s['id'].startswith('A10') else 'UNACCEPTED_PILOT_NOT_GATE_PASS'
    elif not s['path']:s['status']='NOT_AUTHORED_STOP_CONDITION'
ledger['status']='FAILED_G_SLEEVE_PILOT_STOP_OWNER_REVIEW';ledger['reserves']=[]
(ROOT/'data/surface_ledger.json').write_text(json.dumps(ledger,indent=2)+'\n')
matrix=json.loads((ROOT/'data/required_matrix.json').read_text())
def visit(v):
    if isinstance(v,dict):
        for k,x in list(v.items()):
            if k=='status' and isinstance(x,str):v[k]='NOT_RUN_R5_STOP_CONDITION'
            elif k=='reason' and isinstance(x,str):v[k]='STOP_AT_G_SLEEVE_SOURCE_FIDELITY_AND_WRIST_INTERFACE'
            else:visit(x)
        if v.get('id') in results:v['status']=results[v['id']]['status']
    elif isinstance(v,list):
        for x in v:visit(x)
visit(matrix)
(ROOT/'data/required_matrix.json').write_text(json.dumps(matrix,indent=2)+'\n')
(ROOT/'data/pilot_recipes.json').write_text(json.dumps({'status':'FAILURE_EVIDENCE_NOT_VALID_COMPLETED_CAPSULE','identity':'C001','bodyView':'front','headView':'front','bodyFrame':[1024,1536],'root':[512,1472],'sourceTranslation':[0,54],'headTranslation':[256,54],'scale':1,'rotation':0,'mirror':False,'jacketClosure':'open','palettes':'original only','face':'F00 only; immutable A25','fixedG_L_Wrist':[637,705],'recipes':results},indent=2)+'\n')
(ROOT/'data/run_state.json').write_text(json.dumps({'verdict':'GATE_A_FAILED_AT_G_SLEEVE_PILOT','stopCondition':'source-garment drift / failed clean shared-wrist and root/stripe interface','authoringStopped':True,'acceptedNeutralFrozen':True,'neutralOwnerAccepted':True,'A25Unchanged':True,'A16Unchanged':True,'gateAComplete':False,'validCompletedNonneutralStates':0,'acceptedNeutralBaselineSurfaces':15,'unacceptedNewPilotSurfaces':3,'baselineSlots':32,'unauthoredBaselineSlots':14,'reservesUsed':0,'remainingWork':'not started after stop; no G R, O, facial patches, palettes, viewer, Gate B or integration','ownerReviewRequired':True},indent=2)+'\n')
(ROOT/'expected/index.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps({'authoringStopped':True,'neutralReproductionExact':True,'pilotCase':'B_on_GN_NN','verdict':'FAIL_VISUAL_SOURCE_AND_WRIST_INTERFACE','reservesUsed':0}))
