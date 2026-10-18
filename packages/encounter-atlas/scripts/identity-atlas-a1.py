from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest();paths=[root/'package.json',root/'Start_Atlas_A1.cmd']
for d in ['src','content','tests','scripts','fixtures/atlas-a1']:
 paths.extend(p for p in (root/d).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
paths.extend((root/'independent').rglob('*.mjs'));paths.extend((root/'independent').rglob('*.py'))
entries=[{'path':p.relative_to(root).as_posix(),'sha256':sha(p.read_bytes())} for p in sorted(set(paths),key=lambda p:p.relative_to(root).as_posix())]
old=json.loads((root/'historical/Encounter_AR0_Atlas_Readiness_Checkpoint_R1.identity.json').read_text())
record={'sourceRevision':'Atlas-A1-person-source-v1','sourceDigest':sha(json.dumps(entries,sort_keys=True,separators=(',',':')).encode()),'dependencyRevision':old['sourceRevision'],'dependencySourceDigest':old['sourceDigest'],'dependencyZIPSHA256':old['sha256'],'preservedM3BuildSHA256':old['M3BuildSHA256'],'catalogSHA256':old['catalogSHA256'],'packageRef':old['packageRef'],'atlasBuildSHA256':sha((root/'dist-atlas-a1/index.html').read_bytes()),'files':entries};(root/'evidence/atlas-a1/source-identity.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in record.items() if k!='files'}))
