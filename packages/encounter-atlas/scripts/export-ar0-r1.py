from pathlib import Path
import hashlib,json,sys,zipfile
root=Path(__file__).resolve().parents[1];label='Encounter_AR0_Atlas_Readiness_Checkpoint_R1'
assert len(sys.argv)==1 or sys.argv[1]==label,'Only AR0 R1 export is permitted'
archive=root.parent/(label+'.zip');external=root.parent/(label+'.identity.json');assert not archive.exists() and not external.exists(),'Refusing to overwrite frozen artifacts'
sha=lambda b:hashlib.sha256(b).hexdigest();entries=[]
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted((p for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts),key=lambda p:p.relative_to(root).as_posix()):
  b=p.read_bytes();n=p.relative_to(root).as_posix();i=zipfile.ZipInfo(n,date_time=(2026,10,18,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,b);entries.append({'path':n,'bytes':len(b),'sha256':sha(b)})
s=json.loads((root/'evidence/ar0-r1/source-identity.json').read_text());old=json.loads((root/'historical/Encounter_AR0_Atlas_Readiness_Checkpoint.identity.json').read_text());record={'snapshot':archive.name,'sha256':sha(archive.read_bytes()),'bytes':archive.stat().st_size,**{k:s[k] for k in ['sourceRevision','sourceDigest','M3BuildSHA256','catalogSHA256']},'previousAR0SHA256':old['sha256'],'previousM3R3SHA256':old['previousM3R3SHA256'],'packageRef':old['packageRef'],'contentRevision':old['contentRevision'],'files':entries};external.write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in record.items() if k!='files'}))
