"""Reproducible identity of all executable source, content, tests and tools."""
from pathlib import Path
import hashlib
import json
root=Path(__file__).resolve().parents[1]
paths=[root/'package.json']
for folder in ['src','content','tests','scripts']:
    paths.extend(p for p in (root/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
paths.extend((root/'independent').glob('*.test.mjs'))
paths=sorted(paths,key=lambda p:p.relative_to(root).as_posix())
entries=[{'path':p.relative_to(root).as_posix(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in paths]
digest=hashlib.sha256(json.dumps(entries,sort_keys=True,separators=(',',':')).encode()).hexdigest()
record={'sourceRevision':'M3-runtime-v1-R3-D03','sourceDigest':digest,'files':entries}
(root/'evidence/m3/source-identity.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'sourceRevision':record['sourceRevision'],'sourceDigest':digest,'files':len(entries)}))
