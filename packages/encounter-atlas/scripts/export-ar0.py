from pathlib import Path
import hashlib,json,sys,zipfile
root=Path(__file__).resolve().parents[1];label=sys.argv[1]
assert label=='Encounter_AR0_Atlas_Readiness_Checkpoint','Only the new AR0 checkpoint label is permitted'
archive=root.parent/(label+'.zip');external=root.parent/(label+'.identity.json');assert not archive.exists() and not external.exists(),'Refusing to overwrite a frozen artifact'
sha=lambda b:hashlib.sha256(b).hexdigest();entries=[]
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted((p for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts),key=lambda p:p.relative_to(root).as_posix()):
  b=p.read_bytes();n=p.relative_to(root).as_posix();info=zipfile.ZipInfo(n,date_time=(2026,10,18,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,b);entries.append({'path':n,'bytes':len(b),'sha256':sha(b)})
source=json.loads((root/'evidence/ar0/source-identity.json').read_text(encoding='utf-8'));previous=json.loads((root/'historical/Encounter_M3_Checkpoint_R3.identity.json').read_text(encoding='utf-8'))
record={'snapshot':archive.name,'sha256':sha(archive.read_bytes()),'bytes':archive.stat().st_size,'sourceRevision':source['sourceRevision'],'sourceDigest':source['sourceDigest'],'M3BuildSHA256':source['M3BuildSHA256'],'catalogSHA256':source['catalogSHA256'],'previousM3R3SHA256':previous['sha256'],'packageRef':previous['packageRef'],'contentRevision':previous['contentRevision'],'files':entries}
external.write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in record.items() if k!='files'}))
