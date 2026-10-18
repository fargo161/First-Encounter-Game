"""Freeze a newly identified R3 checkpoint only; never overwrite a frozen file."""
from pathlib import Path
import hashlib,json,sys,zipfile
root=Path(__file__).resolve().parents[1];label=sys.argv[1]
if label!='Encounter_M3_Checkpoint_R3':raise SystemExit('Only the new R3 label is allowed')
archive=root.parent/(label+'.zip');external=root.parent/(label+'.identity.json')
if archive.exists() or external.exists():raise SystemExit('Refusing to overwrite a frozen artifact')
sha=lambda b:hashlib.sha256(b).hexdigest();entries=[]
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted((p for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts),key=lambda p:p.relative_to(root).as_posix()):
  b=p.read_bytes();n=p.relative_to(root).as_posix();info=zipfile.ZipInfo(n,date_time=(2026,10,18,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,b);entries.append({'path':n,'bytes':len(b),'sha256':sha(b)})
source=json.loads((root/'evidence/m3/source-identity.json').read_text(encoding='utf-8'));package=json.loads((root/'content/m3/seed.mjs').read_text(encoding='utf-8').split('export const fixture = ',1)[1].rsplit(';',1)[0])
identity={'snapshot':archive.name,'sha256':sha(archive.read_bytes()),'bytes':archive.stat().st_size,'sourceRevision':source['sourceRevision'],'sourceDigest':source['sourceDigest'],'buildSHA256':sha((root/'dist-m3/index.html').read_bytes()),'contentRevision':package['content']['contentRevision'],'packageRef':package['ref'],'previousR2SHA256':'c3c866834b64aebc573b42e2839e173bed486cdc8125a0287ddcd952f43a1a10','remediatedDefects':['M3-D01','M3-D02','M3-D03'],'files':entries}
external.write_text(json.dumps(identity,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in identity.items() if k!='files'}))
