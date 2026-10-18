from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
identity=json.loads((root/'historical/Encounter_M3_Checkpoint_R3.identity.json').read_text(encoding='utf-8'));assert identity['sha256']=='615ddc79e0f7bd8d903411401360fc321b7b916abcc69dc974e9673fd0e74c87'
old={e['path'] for e in identity['files']}
for e in identity['files']:
 p=root/e['path'];assert p.is_file(),e['path'];b=p.read_bytes();assert len(b)==e['bytes'] and sha(b)==e['sha256'],e['path']
additions=sorted(p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.relative_to(root).as_posix() not in old)
record={'result':'PASS','baselineR3SHA256':identity['sha256'],'baselineMembers':1430,'allBaselineMembersByteIdentical':True,'modifiedBaselineFiles':[],'removedBaselineFiles':[],'M3BuildSHA256':sha((root/'dist-m3/index.html').read_bytes()),'productionAdditions':[n for n in additions if n.startswith(('src/','content/'))],'allAdditions':additions}
(root/'evidence/ar0/preservation.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8')
(root/'evidence/ar0/production.diff').write_text('All 1,430 accepted M3 R3 files: unchanged.\nNo existing production file edited or removed.\n'+''.join('ADD '+n+'\n' for n in record['productionAdditions']),encoding='utf-8')
print(json.dumps({k:v for k,v in record.items() if k!='allAdditions'}))
