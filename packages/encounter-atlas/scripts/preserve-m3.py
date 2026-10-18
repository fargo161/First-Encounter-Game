"""Verify the immutable M2 baseline and identify intentional M3 copy changes."""
from pathlib import Path
from zipfile import ZipFile
import hashlib
import json
root=Path(__file__).resolve().parents[1]
sha=lambda b:hashlib.sha256(b).hexdigest()
identity=json.loads((root/'baseline/Encounter_M2_Checkpoint.identity.json').read_text(encoding='utf-8'))
archive=root/'baseline/Encounter_M2_Checkpoint.zip'
assert sha(archive.read_bytes())==identity['sha256']=='940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7'
assert sha((root/'baseline/Encounter_M2_Checkpoint.identity.json').read_bytes())=='d3c0db584d9b5fd392fcca307a319cd23350f3ff03a379f14246c3cd4820abff'
changed=[];unchanged=[]
with ZipFile(archive) as z:
    assert z.testzip() is None
    assert len(z.namelist())==73 and set(z.namelist())=={e['path'] for e in identity['files']}
    for e in identity['files']:
        b=z.read(e['path']);assert len(b)==e['bytes'] and sha(b)==e['sha256']
        current=root/e['path'];assert current.is_file(),e['path']
        (unchanged if sha(current.read_bytes())==e['sha256'] else changed).append(e['path'])
assert set(changed)<= {'package.json','README.md','Test_Results_and_Scope.md'},changed
for name in ['src/runtime.mjs','src/contracts.mjs','src/views.mjs','src/action-boundary.mjs','tests/runtime.test.mjs','tests/views.test.mjs','tests/identity-regressions.test.mjs','tests/m2.test.mjs']:
    assert name in unchanged
evidence_zip=root/'independent/M2_Independent_Test_Evidence.zip'
assert sha(evidence_zip.read_bytes())=='dd0e7e2423b389f070591cac999e657297bc6fbaa6b9842c1f2f321c5fb68518'
with ZipFile(evidence_zip) as z:
    assert z.testzip() is None
    manifest=json.loads(z.read('review-manifest.json'))
    for e in manifest['members']:
        b=z.read(e['path']);assert len(b)==e['bytes'] and sha(b)==e['sha256']
assert sha((root/'independent/M2_Independent_Contract_Tests.test.mjs').read_bytes())=='858171387e7edbcfe105a39cfe3d1a6f1dd58bf505a5dc65dbbd83df24ccc0de'
record={'result':'PASS','baselineSHA256':identity['sha256'],'baselineMembersVerified':73,'baselineIdentitySHA256':sha((root/'baseline/Encounter_M2_Checkpoint.identity.json').read_bytes()),'unchangedM2MembersInM3Copy':unchanged,'intentionalMetadataDocumentationChanges':changed,'independentM2EvidenceSHA256':sha(evidence_zip.read_bytes()),'independentM2EvidenceManifestMembersVerified':len(manifest['members']),'fourSharedKernelModulesUnchanged':True,'allInheritedTestSourcesUnchanged':True}
(root/'evidence/m3/preservation.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'result':record['result'],'baselineMembers':73,'unchangedCopyMembers':len(unchanged),'intentionalChanges':changed}))
