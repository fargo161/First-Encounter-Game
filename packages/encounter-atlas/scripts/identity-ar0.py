from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
paths=[root/'package.json']
for directory in ['src','content','tests','scripts']:
 paths.extend(p for p in (root/directory).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
paths.extend((root/'independent').rglob('*.mjs'));paths.extend((root/'independent').rglob('*.py'))
entries=[{'path':p.relative_to(root).as_posix(),'sha256':sha(p.read_bytes())} for p in sorted(set(paths),key=lambda p:p.relative_to(root).as_posix())]
record={'sourceRevision':'AR0-projection-v1','sourceDigest':sha(json.dumps(entries,sort_keys=True,separators=(',',':')).encode()),'baselineR3SourceDigest':'a609f63c56ed1e047f44e8f3ef28b21f91adec9e40e35d08eb988d0e78de9362','M3BuildSHA256':sha((root/'dist-m3/index.html').read_bytes()),'catalogSHA256':sha((root/'content/ar0/last-collection.json').read_bytes()),'files':entries}
(root/'evidence/ar0/source-identity.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in record.items() if k!='files'}))
