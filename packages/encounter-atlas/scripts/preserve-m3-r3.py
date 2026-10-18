"""Compare R3 with verified R2 member identities without duplicating its ZIP."""
from pathlib import Path
import hashlib,json,difflib
root=Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
ip=root/'historical/Encounter_M3_Checkpoint_R2.identity.json';identity=json.loads(ip.read_text(encoding='utf-8'))
assert identity['sha256']=='c3c866834b64aebc573b42e2839e173bed486cdc8125a0287ddcd952f43a1a10';assert len(identity['files'])==1152
unchanged=[];changed=[];allowed={'src/m3/ui.mjs','scripts/source-identity-m3.py','dist-m3/index.html','README.md','Test_Results_and_Scope.md','evidence/m3/source-identity.json'}
for e in identity['files']:
 p=root/e['path'];assert p.is_file(),e['path'];b=p.read_bytes()
 if len(b)==e['bytes'] and sha(b)==e['sha256']:unchanged.append(e['path']);continue
 assert e['path'] in allowed,e['path'];changed.append({'path':e['path'],'beforeSHA256':e['sha256'],'afterSHA256':sha(b)})
for e in identity['files']:
 if e['path'].startswith(('src/','content/','tests/')) and e['path']!='src/m3/ui.mjs':assert e['path'] in unchanged,e['path']
old=(root/'historical/R2_ui.mjs').read_bytes();new=(root/'src/m3/ui.mjs').read_bytes();oldEntry=next(e for e in identity['files'] if e['path']=='src/m3/ui.mjs');assert sha(old)==oldEntry['sha256']
assert new==old.replace(b"style.visibility!=='hidden'",b"style.visibility==='visible'",1),'Only the established visibility predicate may change in production'
folder=root/'evidence/m3-d03';folder.mkdir(parents=True,exist_ok=True)
(folder/'production.diff').write_text(''.join(difflib.unified_diff(old.decode('utf-8').splitlines(True),new.decode('utf-8').splitlines(True),fromfile='R2/src/m3/ui.mjs',tofile='R3/src/m3/ui.mjs')),encoding='utf-8')
record={'result':'PASS','verifiedR2BaselineSHA256':identity['sha256'],'R2IdentitySHA256':sha(ip.read_bytes()),'baselineMembersCompared':1152,'onlyProductionChange':'src/m3/ui.mjs: computed visibility must equal visible','exactOnePredicateProductionDiffEnforced':True,'allOtherProductionContentAndInheritedTestBytesUnchanged':True,'unchangedOriginalMembers':unchanged,'intentionalChanges':changed,'originalBaselineLocation':json.loads((root/'historical/R2_Preservation.json').read_text(encoding='utf-8'))}
(folder/'preservation.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in record.items() if k not in ['unchangedOriginalMembers','intentionalChanges','originalBaselineLocation']}))
