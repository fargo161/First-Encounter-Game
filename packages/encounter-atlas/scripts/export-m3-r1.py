"""New deterministic R1 checkpoint; old identity and existing destinations refused."""
from pathlib import Path
import hashlib,json,sys,zipfile
root=Path(__file__).resolve().parents[1];label=sys.argv[1]
if label!='Encounter_M3_Checkpoint_R1':raise SystemExit('Only the new M3 R1 identity is allowed')
archive=root.parent/(label+'.zip');external=root.parent/(label+'.identity.json')
if archive.exists() or external.exists():raise SystemExit('Refusing to overwrite an existing frozen artifact')
sha=lambda b:hashlib.sha256(b).hexdigest()
files=sorted((p for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts),key=lambda p:p.relative_to(root).as_posix());entries=[]
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in files:
  data=p.read_bytes();name=p.relative_to(root).as_posix();info=zipfile.ZipInfo(name,date_time=(2026,10,18,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,data);entries.append({'path':name,'bytes':len(data),'sha256':sha(data)})
source=json.loads((root/'evidence/m3/source-identity.json').read_text());package=json.loads((root/'content/m3/seed.mjs').read_text().split('export const fixture = ',1)[1].rsplit(';',1)[0])
identity={'snapshot':archive.name,'sha256':sha(archive.read_bytes()),'bytes':archive.stat().st_size,'sourceRevision':source['sourceRevision'],'sourceDigest':source['sourceDigest'],'contentRevision':package['content']['contentRevision'],'packageRef':package['ref'],'buildSHA256':sha((root/'dist-m3/index.html').read_bytes()),'previousM3SHA256':'de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64','baselineM2SHA256':'940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7','remediatedDefects':['M3-D01'],'files':entries}
external.write_text(json.dumps(identity,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in identity.items() if k!='files'}))
