"""Archive partial Gate A failure evidence and replay it from fresh extraction."""
from pathlib import Path
import hashlib,json,shutil,zipfile,subprocess,sys
R=Path(__file__).resolve().parent;PROJECT=R.parent.parent
NAME='C001_ZANT_GATE_A_R5_FAILED_G_SLEEVE_PILOT'
D=R/'deliverables';PACK=D/NAME;ARCHIVE=D/(NAME+'.zip')
def sha(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
    return h.hexdigest()
def tree(p):return {f.relative_to(p).as_posix():{'bytes':f.stat().st_size,'sha256':sha(f)} for f in sorted(p.rglob('*')) if f.is_file()}
PACK.mkdir(parents=True,exist_ok=False)
for p in sorted(R.rglob('*')):
    if not p.is_file():continue
    rel=p.relative_to(R)
    if rel.parts[0]=='deliverables' or '__pycache__' in rel.parts or p.suffix=='.pyc':continue
    q=PACK/rel;q.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,q)
files=[{'path':p.relative_to(PACK).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(PACK.rglob('*')) if p.is_file()]
manifest={'candidateId':NAME,'status':'FAILED_PARTIAL_GATE_A_G_SLEEVE_PILOT','dateLocal':'2026-10-18 America/New_York','gateAVerdict':'GATE_A_FAILED_AT_G_SLEEVE_PILOT','gateAComplete':False,'acceptedNeutralOwnerAccepted':True,'acceptedNeutralFrozen':True,'newPilotOwnerAccepted':False,'baselineSlots':32,'acceptedNeutralBaselineSurfaces':15,'unacceptedPilotSurfaces':3,'unauthoredBaselineSlots':14,'reservesUsed':0,'viewerImplemented':False,'runtimeScope':'front C001; partial failure evidence only','files':files}
(PACK/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
with zipfile.ZipFile(ARCHIVE,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in sorted(PACK.rglob('*')):
        if p.is_file():z.write(p,NAME+'/'+p.relative_to(PACK).as_posix())
with zipfile.ZipFile(ARCHIVE) as z:
    assert z.testzip() is None
    assert len(z.namelist())==len(set(z.namelist()))==len(files)+1
QA=D/'fresh_extraction';QA.mkdir(exist_ok=False)
with zipfile.ZipFile(ARCHIVE) as z:z.extractall(QA)
EXTRACT=QA/NAME;assert tree(PACK)==tree(EXTRACT)
hashes={'candidateId':NAME,'zip':ARCHIVE.name,'zipBytes':ARCHIVE.stat().st_size,'zipSHA256':sha(ARCHIVE),'manifestSHA256':sha(PACK/'manifest.json'),'governedFiles':len(files),'filesIncludingManifest':len(files)+1,'gateAVerdict':'GATE_A_FAILED_AT_G_SLEEVE_PILOT','acceptedNeutralFrozen':True,'A25SHA256':sha(PACK/'assets/A25_head_front_neutral_rgba.png'),'A16SHA256':sha(PACK/'assets/A16_pants_pelvis_NN.png')}
(D/(NAME+'_HASHES.json')).write_text(json.dumps(hashes,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'archiveCreated':True,**hashes}),flush=True)
AUDIT=D/'fresh_builder_audit'
subprocess.run([sys.executable,str(EXTRACT/'validation/verify_checkpoint.py'),'--out',str(AUDIT)],cwd=EXTRACT,check=True)
audit=json.loads((AUDIT/'verification.json').read_text())
assert audit['auditIntegrity']=='PASS' and audit['gateAVerdict']=='GATE_A_FAILED_AT_G_SLEEVE_PILOT'
assert audit['failedSharedWristPixelsBeyondDeclaredBand']==1252
assert len(audit['replayedEvidenceRenders'])==4
assert tree(PACK)==tree(EXTRACT)
assert sha(ARCHIVE)==hashes['zipSHA256'] and sha(PACK/'manifest.json')==hashes['manifestSHA256']
for f in files:
    p=PACK/f['path'];assert sha(p)==f['sha256'] and p.stat().st_size==f['bytes']
preserve={}
for key,info in json.loads((PACK/'validation/preservation_baseline.json').read_text())['roots'].items():
    now=tree(PROJECT/info['path']);assert now==info['files'],key
    preserve[key]={'files':len(now),'changed':0,'missing':0,'added':0,'unchanged':True}
result={'candidateId':NAME,'archiveCRC':'PASS','manifest':'PASS','freshExtractionExact':True,'portableReplayIntegrity':'PASS','builderAuditSHA256':sha(AUDIT/'verification.json'),'replayedEvidenceCases':4,'acceptedNeutralExact':True,'A25Exact':True,'A16Exact':True,'failedSharedWristTexels':1252,'preservation':preserve,'gateAVerdict':'GATE_A_FAILED_AT_G_SLEEVE_PILOT','newArtOwnerAccepted':False,'reservesUsed':0,'zipSHA256':hashes['zipSHA256'],'manifestSHA256':hashes['manifestSHA256']}
(D/'FINAL_FAILURE_CHECKPOINT_INTEGRITY.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
handoff=f'''# C001 Gate A R5 frozen failure handoff

**GATE A FAILED AT G-SLEEVE PILOT. STOP FOR OWNER REVIEW.**

Archive: `{NAME}.zip` ({hashes['zipBytes']:,} bytes; {len(files)} governed files plus manifest).

ZIP SHA-256: `{hashes['zipSHA256']}`

Manifest SHA-256: `{hashes['manifestSHA256']}`

Fresh builder audit SHA-256: `{result['builderAuditSHA256']}`

Read the packet's `START_HERE.md`, `IMPLEMENTATION_REPORT.md` and `TESTER_HANDOFF.md`. The accepted R4 neutral interfaces, A16 and A25 remain exact. Three G L pilot parts are unaccepted/failed;14 baseline slots are unauthored;0 reserves are used. The new jacket cuff covers1252 shared-hand texels beyond the declared pilot wrist band and fails native source/interface review. The full Gate A matrix and viewer were not completed after that stop.

Begin with the384px four-column comparison and native failed wrist/upper-interface evidence. All three raw working donors and exact built-in imagegen prompts are archived. No generated jacket-hand pixels were selected in the final failed A10 derivative. The rejected v1 processing defect is disclosed separately.

The builder extracted this archive afresh and ran the portable standard-library verifier. Four evidence renders reproduced in all RGBA channels and after independent PNG reopen; accepted head/source-RGB/alpha and frozen neutral hashes passed. The independent scalar wrist-count check reproduced1252. One-pixel RGB and alpha comparator controls detected their exact respective changes. This is an evidence-integrity PASS alongside a Gate A FAIL, not an independent art judgment or completed proof. Actual audit: `fresh_builder_audit/verification.json`; final archive/source-history recheck: `FINAL_FAILURE_CHECKPOINT_INTEGRITY.json`. Original sources, R1–R4 and both independent-review trees remain unchanged.

For independent inspection, extract again to a new folder, then run from the packet root:

```powershell
python .\\validation\\verify_checkpoint.py --out ..\\audit-r5-independent
```

The external output directory must be new. Python3.12 standard library only; no install/network. Do not run authoring scripts or modify the packet. Return technical and visual findings outside the packet. All other222 valid cases and17 production negatives remain unrun; no missing pose, face, palette or viewer is represented as implemented.

The current asset method failed. The packet does not prove that the architecture cannot be solved by different new G artwork within the same contract. Further authoring waits for explicit owner steering; accepted neutral interfaces are not reopened by this report.

**STOP FOR OWNER REVIEW.**
'''
(D/'R5_TESTER_HANDOFF.md').write_text(handoff,encoding='utf-8')
print(json.dumps(result,indent=2),flush=True)
