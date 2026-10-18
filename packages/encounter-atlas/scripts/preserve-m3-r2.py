"""Enforce the narrow production and test-fixture diff from preserved R1."""
from pathlib import Path
from zipfile import ZipFile
import hashlib,json,difflib
root=Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
archive=root/'historical/Encounter_M3_Checkpoint_R1.zip';ip=root/'historical/Encounter_M3_Checkpoint_R1.identity.json'
identity=json.loads(ip.read_text(encoding='utf-8'));assert sha(archive.read_bytes())==identity['sha256']=='f7afae2bfa1b75a4a8ec3e2ded09a7845671dbfb0ca9fc5ad487c655c6a68ed4'
unchanged=[];changed=[];productionDiff=''
with ZipFile(archive) as z:
 assert len(z.namelist())==592 and z.testzip() is None
 for e in identity['files']:
  b=z.read(e['path']);assert len(b)==e['bytes'] and sha(b)==e['sha256'];p=root/e['path'];assert p.is_file(),e['path'];now=p.read_bytes()
  if sha(now)==e['sha256']:unchanged.append(e['path']);continue
  n=e['path'];assert n in {'src/m3/ui.mjs','scripts/source-identity-m3.py','tests/m3-notice-display.test.mjs','dist-m3/index.html','README.md','Test_Results_and_Scope.md'} or n.startswith(('evidence/','transcripts/browser-','traces/browser-')),n
  if n.startswith(('src/','content/')):assert n=='src/m3/ui.mjs';productionDiff=''.join(difflib.unified_diff(b.decode('utf-8').splitlines(True),now.decode('utf-8').splitlines(True),fromfile='R1/'+n,tofile='R2/'+n))
  changed.append({'path':n,'beforeSHA256':e['sha256'],'afterSHA256':sha(now)})
 old=z.read('tests/m3-notice-display.test.mjs').decode('utf-8')
 substitutions=[("'innerHeight','markNoticeDisplayed'","'innerHeight','innerWidth','markNoticeDisplayed'"),('({top,bottom,height})','({top,bottom,height,left:100,right:400,width:300})'),('node.style,viewport,markNoticeDisplayed','node.style,viewport,1280,markNoticeDisplayed'),('()=>{},720,markNoticeDisplayed','()=>{},720,1280,markNoticeDisplayed')]
 for a,b in substitutions:assert old.count(a)==1;old=old.replace(a,b)
 assert old==(root/'tests/m3-notice-display.test.mjs').read_text(encoding='utf-8'),'Only the DOM fixture may change in the inherited R1 test'
for e in identity['files']:
 if e['path'].startswith(('src/','content/','tests/')) and e['path'] not in ['src/m3/ui.mjs','tests/m3-notice-display.test.mjs']:assert e['path'] in unchanged,e['path']
folder=root/'evidence/m3-d02';folder.mkdir(parents=True,exist_ok=True)
(folder/'production.diff').write_text(productionDiff,encoding='utf-8')
record={'result':'PASS','preservedR1SHA256':identity['sha256'],'preservedR1IdentitySHA256':sha(ip.read_bytes()),'verifiedR1Members':592,'onlyProductionSourceChange':'src/m3/ui.mjs','enginePolicyContractsKnowledgeMeaningContentUnchanged':True,'inheritedR1AssertionsUnchangedOnlyDOMFixtureCompleted':True,'allOtherInheritedTestsByteIdentical':True,'unchangedOriginalMembers':unchanged,'intentionalChanges':changed,'addedFiles':sorted(p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file() and p.relative_to(root).as_posix() not in {e['path'] for e in identity['files']} and '__pycache__' not in p.parts)}
(folder/'preservation.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in record.items() if k not in ['unchangedOriginalMembers','intentionalChanges','addedFiles']}))
