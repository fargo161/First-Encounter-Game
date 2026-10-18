"""Read-only comparison with the failed M3 checkpoint; enforce narrow source scope."""
from pathlib import Path
from zipfile import ZipFile
import hashlib,json
root=Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
identity=root/'historical/Encounter_M3_Checkpoint.identity.json';archive=root/'historical/Encounter_M3_Checkpoint.zip'
assert sha(identity.read_bytes())=='d025fe33a6a2773e88e249ce3c624280fca70921c8f541617ec8e92d4302abf4'
record=json.loads(identity.read_text(encoding='utf-8'));assert sha(archive.read_bytes())==record['sha256']=='de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64'
unchanged=[];changed=[]
allowed={'src/m3/ui.mjs','scripts/source-identity-m3.py','dist-m3/index.html','README.md','Test_Results_and_Scope.md'}
with ZipFile(archive) as z:
 assert len(z.namelist())==189 and z.testzip() is None
 for e in record['files']:
  b=z.read(e['path']);assert len(b)==e['bytes'] and sha(b)==e['sha256']
  p=root/e['path'];assert p.is_file(),e['path']
  if sha(p.read_bytes())==e['sha256']:unchanged.append(e['path']);continue
  name=e['path'];assert name in allowed or name.startswith(('evidence/m3/','transcripts/browser-','traces/browser-')),name
  changed.append({'path':name,'beforeSHA256':e['sha256'],'afterSHA256':sha(p.read_bytes())})
for e in record['files']:
 if e['path'].startswith(('src/','content/','tests/')) and e['path']!='src/m3/ui.mjs':assert e['path'] in unchanged,e['path']
report={'result':'PASS','failedCheckpointSHA256':record['sha256'],'failedIdentitySHA256':sha(identity.read_bytes()),'verifiedHistoricalMembers':189,'unchangedOriginalMembers':unchanged,'intentionalChanges':changed,'onlyProductionSourceChange':'src/m3/ui.mjs','enginePolicyKnowledgeMeaningTypesAndAuthoredContentUnchanged':True,'allInheritedTestSourcesUnchanged':True,'addedFiles':sorted(p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file() and p.relative_to(root).as_posix() not in {e['path'] for e in record['files']} and '__pycache__' not in p.parts)}
(root/'evidence/m3-d01/preservation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k not in ['unchangedOriginalMembers','intentionalChanges','addedFiles']}))
