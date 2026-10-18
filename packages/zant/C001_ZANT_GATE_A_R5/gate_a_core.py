"""Gate A author/reference integer RGBA composition. No artwork side effects."""
from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from functools import lru_cache
ROOT=Path(__file__).resolve().parent
def read(p):return np.array(Image.open(ROOT/p).convert('RGBA'))
def sha(p):return hashlib.sha256((ROOT/p).read_bytes()).hexdigest()
def over(dst,src):
    s=src.astype('uint64');d=dst.astype('uint64');sa=s[:,:,3:4];da=d[:,:,3:4]
    den=sa*255+da*(255-sa)
    rgb=(s[:,:,:3]*sa*255+d[:,:,:3]*da*(255-sa)+den//2)//np.maximum(den,1)
    return np.concatenate((rgb,(den+127)//255),axis=2).astype('uint8')
@lru_cache(maxsize=48)
def asset_frame(id):
    a=read('assets/'+id+('_rgba.png' if id.startswith('A25') else '.png'))
    if id.startswith('A25'):
        frame=np.zeros((1536,1024,4),np.uint8);frame[54:694,256:768]=a;a=frame
    y,x=np.where(a[:,:,3]>0)
    return a,(int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1))
def render_order(order):
    out=np.zeros((1536,1024,4),np.uint8)
    for id in order:
        a,(x0,y0,x1,y1)=asset_frame(id)
        out[y0:y1,x0:x1]=over(out[y0:y1,x0:x1],a[y0:y1,x0:x1])
    return out
def save(a,path):
    a=a.copy();a[a[:,:,3]==0,:3]=0
    Image.fromarray(a.astype('uint8')).save(ROOT/path)
def backdrop(a,rgb=(74,79,87)):
    b=np.empty_like(a);b[:]=[*rgb,255];return over(b,a)
def assert_neutral_lock():
    lock=json.loads((ROOT/'contract/ACCEPTED_R4_NEUTRAL_LOCK.json').read_text())
    for path,v in lock['files'].items():assert sha(path)==v['sha256'],('frozen neutral changed',path)
