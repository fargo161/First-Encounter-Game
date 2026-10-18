from pathlib import Path
import hashlib,json,difflib
root=Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest();old=json.loads((root/'historical/Encounter_AR0_Atlas_Readiness_Checkpoint_R1.identity.json').read_text());modified=[]
for e in old['files']:
 p=root/e['path'];assert p.is_file(),e['path']
 if sha(p.read_bytes())!=e['sha256']:modified.append(e['path'])
assert not modified,modified
original={e['path'] for e in old['files']};added=sorted(p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.relative_to(root).as_posix() not in original)
for name in added:
 if name.startswith(('src/','content/','dist/','dist-m3/')):assert name.startswith('src/atlas-a1/'),name
production=[n for n in added if n.startswith(('src/atlas-a1/','dist-atlas-a1/'))];patch=[]
for n in production:
 text=(root/n).read_text(encoding='utf-8');patch.extend(difflib.unified_diff([],text.splitlines(keepends=True),fromfile='/dev/null',tofile=n))
(root/'evidence/atlas-a1/production-additions.patch').write_text(''.join(patch),encoding='utf-8')
record={'result':'PASS','dependencyZIPSHA256':old['sha256'],'all2310DependencyMembersByteIdentical':True,'modifiedExistingFiles':modified,'originalTestsAndAssertionsUnchanged':True,'onlyNewProductionPaths':production,'addedFiles':added};(root/'evidence/atlas-a1/preservation.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in record.items() if k!='addedFiles'}))
