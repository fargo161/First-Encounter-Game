from pathlib import Path
import hashlib,json,difflib
root=Path(__file__).resolve().parents[1];ev=root/'evidence/ar0-r1';sha=lambda b:hashlib.sha256(b).hexdigest()
baseline=json.loads((root/'historical/Encounter_AR0_Atlas_Readiness_Checkpoint.identity.json').read_text(encoding='utf-8'));modified=[]
for e in baseline['files']:
 p=root/e['path'];assert p.is_file(),e['path']
 if sha(p.read_bytes())!=e['sha256']:modified.append(e['path'])
assert modified==['src/ar0/atlas.mjs'],modified
m3=json.loads((root/'historical/Encounter_M3_Checkpoint_R3.identity.json').read_text(encoding='utf-8'))
for e in m3['files']:assert sha((root/e['path']).read_bytes())==e['sha256'],e['path']
original={e['path'] for e in baseline['files']};added=sorted(p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.relative_to(root).as_posix() not in original)
assert not any(n.startswith(('src/','content/','dist/','dist-m3/')) for n in added),'Unexpected production addition'
record={'baselineAR0ZIPSHA256':baseline['sha256'],'baselineMembers':len(original),'modifiedExistingFiles':modified,'allOtherBaselineMembersByteIdentical':True,'acceptedM3R3MembersByteIdentical':len(m3['files']),'catalogUnchanged':True,'IR3_25TestSHA256':sha((root/'independent/m3-r3-review/independent-r3-display.test.mjs').read_bytes()),'addedFiles':added}
(ev/'preservation.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in record.items() if k!='addedFiles'}))
