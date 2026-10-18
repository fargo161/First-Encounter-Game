"""Deterministic M3 freeze; refuses old labels and every existing destination."""
from pathlib import Path
import hashlib
import json
import sys
import zipfile
root=Path(__file__).resolve().parents[1]
label=sys.argv[1]
if label!='Encounter_M3_Checkpoint': raise SystemExit('Unknown M3 checkpoint label')
archive=root.parent/(label+'.zip');identity=root.parent/(label+'.identity.json')
if archive.exists() or identity.exists():raise SystemExit('Refusing to overwrite a frozen checkpoint or identity')
files=sorted((p for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts),key=lambda p:p.relative_to(root).as_posix())
entries=[]
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in files:
        data=p.read_bytes();name=p.relative_to(root).as_posix();info=zipfile.ZipInfo(name,date_time=(2026,10,17,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,data);entries.append({'path':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
source=json.loads((root/'evidence/m3/source-identity.json').read_text(encoding='utf-8'));package=json.loads((root/'runs/browser-recovery.json').read_text(encoding='utf-8'))['package']
record={'snapshot':archive.name,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'bytes':archive.stat().st_size,'sourceRevision':source['sourceRevision'],'sourceDigest':source['sourceDigest'],'contentRevision':package['content']['contentRevision'],'packageRef':package['ref'],'buildSHA256':hashlib.sha256((root/'dist-m3/index.html').read_bytes()).hexdigest(),'baselineSHA256':'940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7','files':entries}
identity.write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in record.items() if k!='files'}))
