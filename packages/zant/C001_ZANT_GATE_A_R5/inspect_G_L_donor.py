from gate_a_core import *
from PIL import ImageDraw,ImageFont
raw=Image.open(ROOT/'authoring/raw/G_L_tee_hand_v1.png').convert('RGBA')
native=raw.resize((300,600),Image.Resampling.LANCZOS)
native.save(ROOT/'authoring/G_L_tee_hand_v1_native.png')
frame=np.zeros((1536,1024,4),np.uint8);frame[350:950,520:820]=np.array(native)
Image.fromarray(backdrop(frame)).crop((520,350,820,950)).save(ROOT/'evidence/G_L_donor_native_inspection.png')
im=Image.fromarray(backdrop(frame)).crop((520,350,820,950));d=ImageDraw.Draw(im);f=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',11)
for y in range(400,851,50):
    d.line((0,y-350,299,y-350),fill=(100,180,240));d.text((0,y-350),str(y),font=f,fill='white')
for x in range(550,801,50):
    d.line((x-520,0,x-520,599),fill=(100,180,240));d.text((x-520,2),str(x),font=f,fill='white')
im.save(ROOT/'evidence/G_L_donor_coordinate_inspection.png')
assert_neutral_lock()
print('Donor resized by whole canvas only. Runtime G parts not yet exported.')
