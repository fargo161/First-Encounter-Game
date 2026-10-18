"""Read-only R5 failed-pilot evidence audit. Python 3.12 standard library only.

Exit 0 means the review packet reproduced intact. It never grants art approval
or a Gate A pass. Write audit outputs to a new directory outside the packet.
"""
from pathlib import Path
import argparse, hashlib, json, struct, sys, zlib, platform

ROOT=Path(__file__).resolve().parents[1]
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def read_png(path):
    encoded=path.read_bytes();assert encoded[:8]==b'\x89PNG\r\n\x1a\n'
    pos=8;chunks=[];info=None
    while pos<len(encoded):
        n=struct.unpack('>I',encoded[pos:pos+4])[0];kind=encoded[pos+4:pos+8];body=encoded[pos+8:pos+8+n]
        crc=struct.unpack('>I',encoded[pos+8+n:pos+12+n])[0]
        assert (zlib.crc32(kind+body)&0xffffffff)==crc,'PNG CRC mismatch'
        if kind==b'IHDR':info=struct.unpack('>IIBBBBB',body)
        if kind==b'IDAT':chunks.append(body)
        pos+=n+12
        if kind==b'IEND':break
    w,h,depth,ct,compression,filtering,interlace=info
    assert depth==8 and ct in (0,6) and interlace==0 and compression==0 and filtering==0,'Unsupported PNG profile'
    bpp=1 if ct==0 else 4;stride=w*bpp
    packed=zlib.decompress(b''.join(chunks));assert len(packed)==h*(stride+1)
    data=bytearray(w*h*bpp);previous=bytearray(stride)
    for y in range(h):
        start=y*(stride+1);f=packed[start];row=bytearray(packed[start+1:start+1+stride])
        if f==0:pass
        elif f==1:
            if row.count(0)!=stride:
                for x in range(bpp,stride):row[x]=(row[x]+row[x-bpp])&255
        elif f==2:
            row=bytearray((a+b)&255 for a,b in zip(row,previous))
        elif f==3:
            for x in range(stride):row[x]=(row[x]+((row[x-bpp] if x>=bpp else 0)+previous[x])//2)&255
        elif f==4:
            if row.count(0)==stride and previous.count(0)==stride:pass
            else:
                for x in range(stride):
                    a=row[x-bpp] if x>=bpp else 0;b=previous[x];c=previous[x-bpp] if x>=bpp else 0
                    p=a+b-c;pa=abs(p-a);pb=abs(p-b);pc=abs(p-c)
                    v=a if pa<=pb and pa<=pc else b if pb<=pc else c
                    row[x]=(row[x]+v)&255
        else:raise ValueError('Unknown PNG filter')
        data[y*stride:(y+1)*stride]=row;previous=row
    return w,h,bpp,data

def write_png(path,w,h,data):
    def chunk(k,b):return struct.pack('>I',len(b))+k+b+struct.pack('>I',zlib.crc32(k+b)&0xffffffff)
    rows=b''.join(b'\0'+bytes(data[y*w*4:(y+1)*w*4]) for y in range(h))
    path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(rows,6))+chunk(b'IEND',b''))

def compare(a,b):
    assert len(a)==len(b) and len(a)%4==0
    counts=[0]*4;maximum=[0]*4;pixels=0
    if a!=b:
        for i in range(0,len(a),4):
            changed=False
            for c in range(4):
                d=abs(a[i+c]-b[i+c])
                if d:counts[c]+=1;maximum[c]=max(maximum[c],d);changed=True
            pixels+=int(changed)
    return {'differentPixels':pixels,'differentChannelsRGBA':counts,'maxDeltaRGBA':maximum,'equal':a==b,'includesHiddenRGB':True}

def composite(parts):
    dst=bytearray(1024*1536*4)
    for w,h,bpp,src,ox,oy in parts:
        assert bpp==4 and 0<=ox and ox+w<=1024 and 0<=oy and oy+h<=1536
        for sy in range(h):
            base=sy*w*4;target=((sy+oy)*1024+ox)*4
            alpha=src[base+3:base+w*4:4]
            for x,sa in enumerate(alpha):
                if not sa:continue
                s=base+x*4;d=target+x*4
                if sa==255:dst[d:d+4]=src[s:s+4];continue
                da=dst[d+3];D=sa*255+da*(255-sa)
                if D:
                    for c in range(3):dst[d+c]=(src[s+c]*sa*255+dst[d+c]*da*(255-sa)+D//2)//D
                    dst[d+3]=(D+127)//255
    return dst

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--out',required=True,type=Path);args=parser.parse_args()
    output=args.out.resolve()
    assert output!=ROOT and ROOT not in output.parents,'Outputs must stay outside the frozen packet'
    output.mkdir(parents=True,exist_ok=False)
    manifest=json.loads((ROOT/'manifest.json').read_text(encoding='utf-8'))
    bad=[]
    for entry in manifest['files']:
        p=ROOT/entry['path']
        if not p.is_file() or p.stat().st_size!=entry['bytes'] or sha(p)!=entry['sha256']:bad.append(entry['path'])
    actual={str(p.relative_to(ROOT)).replace('\\','/') for p in ROOT.rglob('*') if p.is_file()}
    governed={e['path'] for e in manifest['files']}|{'manifest.json'}
    extras=sorted(actual-governed)
    assert not bad and not extras,('Manifest mismatch',bad,extras)
    print('Manifest verified:',len(manifest['files']),'governed files',flush=True)
    ledger=json.loads((ROOT/'data/surface_ledger.json').read_text());bank={s['id']:s['path'] for s in ledger['surfaces'] if s['path']}
    cache={}
    def asset(id):
        if id not in cache:
            print('Decode',id,flush=True);cache[id]=read_png(ROOT/bank[id])
        return cache[id]
    lock=json.loads((ROOT/'contract/A25_LOCK.json').read_text())
    a25id='A25_head_front_neutral';head=asset(a25id);alpha=read_png(ROOT/'assets/A25_head_front_silhouette.png')
    assert sha(ROOT/bank[a25id])==lock['artSha256']
    assert sha(ROOT/'assets/A25_head_front_silhouette.png')==lock['alphaSha256']
    assert head[:3]==(512,640,4) and alpha[:3]==(512,640,1)
    assert head[3][3::4]==alpha[3],'Head alpha differs from accepted silhouette'
    for f,h in lock['frozenFiles'].items():assert sha(ROOT/'accepted_A25'/f)==h
    source=read_png(ROOT/'references/C001_source_neutral_rgba.png');retained=0;rgb_changes=0
    for y in range(640):
        for x in range(512):
            i=(y*512+x)*4
            if head[3][i+3]:
                retained+=1;j=(y*1024+x+256)*4
                rgb_changes+=head[3][i:i+3]!=source[3][j:j+3]
    assert rgb_changes==0
    recipe_map=json.loads((ROOT/'data/neutral_recipes.json').read_text())['recipes']
    neutral_lock=json.loads((ROOT/'contract/ACCEPTED_R4_NEUTRAL_LOCK.json').read_text())
    for name,value in neutral_lock['files'].items():assert sha(ROOT/name)==value['sha256'],('Frozen neutral changed',name)
    calibration=json.loads((ROOT/'data/calibration.json').read_text())
    assert calibration['bodyFrame']==[1024,1536] and calibration['floor_root']==[512,1472]
    assert calibration['sourceTranslation']==[0,54] and calibration['headLocalToBodyTranslation']==[256,54]
    for key,value in {'neck_base':[501,381],'shoulder_L':[612,407],'shoulder_R':[380,407],'wrist_L_N':[684,824],'wrist_R_N':[301,822]}.items():assert calibration['anchorsBody'][key]==value
    for r in recipe_map.values():
        assert r['scale']==[1,1] and r['rotation']==0 and r['mirror'] is False and r['headTranslation']==[256,54]
        assert len(r['layerOrder'])==len(set(r['layerOrder']))
    hand_results={}
    for side,id in [('L','A12_hand_L_N'),('R','A13_hand_R_N')]:
        h=asset(id);before=read_png(ROOT/('authoring/inputs/R4_source_hand_'+side+'_before_alpha_cleanup.png'))
        changed_alpha=0;retained_rgb_changes=0;core_changes=0;source_rgb_changes=0
        for y in range(1536):
            for x in range(1024):
                i=(y*1024+x)*4
                if h[3][i+3]!=before[3][i+3]:changed_alpha+=1
                if h[3][i+3]:
                    retained_rgb_changes+=h[3][i:i+3]!=before[3][i:i+3]
                    assert y>=54
                    j=((y-54)*1024+x)*4
                    source_rgb_changes+=h[3][i:i+3]!=source[3][j:j+3]
                if y>=842:core_changes+=h[3][i:i+4]!=before[3][i:i+4]
        assert retained_rgb_changes==0 and core_changes==0 and source_rgb_changes==0
        hand_results[side]={'alphaTransitionPixels':changed_alpha,'retainedRGBChanged':retained_rgb_changes,'retainedRGBDifferentFromOriginalC001Source':source_rgb_changes,'palmFingerRGBAChangedAtY842Plus':core_changes}
    evidence_map=json.loads((ROOT/'data/pilot_recipes.json').read_text())['recipes']
    recipes=[{'id':k,'layers':v['layerOrder'],'expected':'expected/'+k+'.png'} for k,v in evidence_map.items()];results={}
    audit_mask=read_png(ROOT/'validation/A25_protected_audit_L8.png');assert audit_mask[:3]==(512,640,1)
    for recipe in recipes:
        print('Render',recipe['id'],flush=True);parts=[]
        for id in recipe['layers']:
            w,h,bpp,pixels=asset(id);ox,oy=(256,54) if id==a25id else (0,0)
            parts.append((w,h,bpp,pixels,ox,oy))
        pixels=composite(parts);expected=read_png(ROOT/recipe['expected'])
        stats=compare(pixels,expected[3]);assert stats['equal'],recipe['id']+' canonical mismatch'
        protected_count=0;protected_changed=0
        for i,v in enumerate(audit_mask[3]):
            if v:
                protected_count+=1;y,x=divmod(i,512);j=((y+54)*1024+x+256)*4
                protected_changed+=pixels[j:j+4]!=head[3][i*4:i*4+4]
        assert protected_count==14254 and protected_changed==0
        write_png(output/(recipe['id']+'.png'),1024,1536,pixels)
        # Reopen our independently encoded output and compare every RGBA byte.
        reopened=read_png(output/(recipe['id']+'.png'));roundtrip=compare(reopened[3],expected[3]);assert roundtrip['equal']
        results[recipe['id']]={'canonical':stats,'reopened':roundtrip,'decodedRGBA256':hashlib.sha256(pixels).hexdigest(),'protectedFacialPixels':protected_count,'protectedFaceRGBAChanged':protected_changed,'recordedStatus':evidence_map[recipe['id']]['status'],'artAcceptance':'OWNER_ACCEPTED_R4_NEUTRAL' if recipe['id'] in recipe_map else 'NOT_ACCEPTED_FAILED_PILOT_EVIDENCE'}
    reference=expected[3];i=next(i-3 for i in range(3,len(reference),4) if reference[i]==255)
    changed=bytearray(reference);changed[i]^=1;rgb_control=compare(changed,reference)
    assert rgb_control['differentChannelsRGBA']==[1,0,0,0] and not rgb_control['equal']
    changed=bytearray(reference);changed[i+3]^=1;alpha_control=compare(changed,reference)
    assert alpha_control['differentChannelsRGBA']==[0,0,0,1] and not alpha_control['equal']
    coat=asset('A10_jacket_arm_L_G');ghand=asset('A14_hand_L_G');bad_wrist=0
    for y in range(1536):
        for x in range(1024):
            i=(y*1024+x)*4
            if coat[3][i+3]>127 and ghand[3][i+3]>127 and y-(.7*(x-637)+705)>10:bad_wrist+=1
    recorded=json.loads((ROOT/'validation/G_L_failed_wrist_measurement.json').read_text())
    assert bad_wrist==recorded['pixels'] and bad_wrist>0
    result={'capsuleStatus':manifest['status'],'gateAVerdict':'GATE_A_FAILED_AT_G_SLEEVE_PILOT','auditIntegrity':'PASS','python':platform.python_version(),'dependencies':'standard library only; no network','manifestFilesVerified':len(manifest['files']),'presentBaselineSurfacesIncludingFailedDrafts':len(bank),'missingBaselineSurfaces':32-len(bank),'reservesUsed':len(ledger['reserves']),'acceptedNeutralLockExact':True,'A25FileHashUnchanged':True,'acceptedA25RecordsUnchanged':True,'headAlphaExact':True,'retainedSourceHeadRGBPixelsCompared':retained,'retainedSourceHeadRGBChanged':rgb_changes,'fixedRegistrationExact':True,'handInterfaceAudit':hand_results,'replayedEvidenceRenders':results,'failedSharedWristPixelsBeyondDeclaredBand':bad_wrist,'supplementaryComparisonControls':{'RGBOnlyOnePixel':rgb_control,'alphaOnlyOnePixel':alpha_control},'gateAMatrix':'2 accepted neutral cases reproduced; 2 unaccepted G L pilots rendered (on FAIL); other 222 valid and all 17 production negatives NOT_RUN_STOP_CONDITION','warning':'PASS means the failed evidence reproduced intact. It is explicitly not a Gate A pass or visual acceptance; other body/face/palette/viewer work is absent.'}
    (output/'verification.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'auditIntegrity':'PASS','gateAVerdict':'GATE_A_FAILED_AT_G_SLEEVE_PILOT','output':str(output)},indent=2))

if __name__=='__main__':main()
