"""Diagnostic textile crops only; no production mask or asset is created."""
from pathlib import Path
import colorsys, json
import numpy as np
from PIL import Image, ImageDraw
OUT=Path(__file__).resolve().parent
ROOT=Path(r'C:\Users\mcdon\Documents\ChatGPT\encounter and rc')
path=ROOT/'work/ZANT_analysis_sources/wardrobe/C001_clothing_inventory_rgba.png'
src=Image.open(path).convert('RGB')

def tolinear(a): return np.where(a<=.04045,a/12.92,((a+.055)/1.055)**2.4)
def tosrgb(a): return np.where(a<=.0031308,12.92*a,1.055*np.maximum(a,0)**(1/2.4)-.055)
def luma(a): return np.sum(tolinear(a)*[.2126,.7152,.0722],axis=2)
def hue(a):
    v=np.array([colorsys.hsv_to_rgb((h+.30)%1,s,val) for h,s,val in (colorsys.rgb_to_hsv(*p) for p in a.reshape(-1,3))])
    return v.reshape(a.shape)
def ramp(a):
    y=luma(a)
    target=tolinear(np.array([.22,.39,.28])); yy=float(target@[.2126,.7152,.0722])
    raw=y[:,:,None]*target/yy
    return np.clip(tosrgb(np.clip(raw,0,1)),0,1),int(np.any(raw>1,axis=2).sum())

crops={'blue_jacket':(540,130,600,220),'light_Tshirt':(190,170,285,280)}
sheet=Image.new('RGB',(960,600),(40,40,40));draw=ImageDraw.Draw(sheet)
draw.text((12,8),'DIAGNOSTIC CROPS: source | global hue shift | luminance-target green (no garment masks)',fill='white')
stats={'source':str(path),'warning':'Local texture tests only. Rectangular crops are not semantic masks or production recolors. No identity/garment geometry changed.','crops':{}}
for row,(name,box) in enumerate(crops.items()):
    patch=src.crop(box); a=np.asarray(patch).astype(float)/255
    h=hue(a); rr,clip=ramp(a)
    stats['crops'][name]={'box':box,'pixels':a.shape[0]*a.shape[1],'source_mean_luminance':float(luma(a).mean()),'hue_mean_abs_luminance_delta':float(np.abs(luma(h)-luma(a)).mean()),'ramp_mean_abs_luminance_delta':float(np.abs(luma(rr)-luma(a)).mean()),'ramp_out_of_gamut_pixels_before_clip':clip}
    for col,(label,b) in enumerate([('original',a),('hue +0.30',h),('target green, source luma',rr)]):
        tile=Image.fromarray(np.uint8(np.round(b*255))).resize((260,220))
        x=20+col*310;y=45+row*275
        sheet.paste(tile,(x,y));draw.text((x,y+225),name+' / '+label,fill='white')
sheet.save(OUT/'palette_crop_comparison.png')
(OUT/'palette_crop_measurements.json').write_text(json.dumps(stats,indent=2),encoding='utf-8')
print(json.dumps(stats,indent=2))
