"""Freeze owner-accepted R4 candidate02 and open a separate Gate A work area."""
from pathlib import Path
import hashlib,json,shutil
R=Path(__file__).resolve().parent;P=R.parent.parent
OLD=P/'work/C001_ZANT_GATE_A_R4_NEUTRAL'
PACK=OLD/'deliverables/C001_ZANT_GATE_A_R4_NEUTRAL_REVIEW_CANDIDATE_02'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def tree(p):return {f.relative_to(p).as_posix():{'bytes':f.stat().st_size,'sha256':sha(f)} for f in sorted(p.rglob('*')) if f.is_file()}
assert sha(PACK/'manifest.json')=='e7a727520b99ec3fc2c273f79843c4a951adf11dbe5bbf4e2eeaf33a791af4c9'
assert sha(OLD/'deliverables/C001_ZANT_GATE_A_R4_NEUTRAL_REVIEW_CANDIDATE_02.zip')=='c43e34ac80a8fd32f1ee5f30e5116dad06129a10b196032afc2fb2746a8188b3'
for d in ['assets','accepted_neutral','contract','data','validation','expected','evidence','references','authoring/inputs','authoring/raw','authoring/prompts','deliverables']:(R/d).mkdir(parents=True,exist_ok=True)
for d in ['assets','accepted_A25','contract','references']:
    shutil.copytree(PACK/d,R/d,dirs_exist_ok=True)
for d in ['assets','data','accepted_A25']:
    shutil.copytree(PACK/d,R/'accepted_neutral'/d,dirs_exist_ok=True)
for n in ['surface_ledger.json','required_matrix.json','neutral_recipes.json','calibration.json','interfaces_neutral.json']:
    shutil.copyfile(PACK/'data'/n,R/'data'/n)
shutil.copyfile(PACK/'validation/A25_protected_audit_L8.png',R/'validation/A25_protected_audit_L8.png')
shutil.copyfile(PACK/'authoring/A16_source_seed.png',R/'references/A16_source_seed.png')
shutil.copyfile(PACK/'validation/A16_RGB_changes_from_source_seed.csv',R/'validation/A16_RGB_changes_from_source_seed.csv')
shutil.copyfile(PACK/'R4_NEUTRAL_INTERFACE_REMEDIATION_REPORT.md',R/'accepted_neutral/R4_ACCEPTED_CANDIDATE02_REPORT.md')
shutil.copyfile(PACK/'manifest.json',R/'accepted_neutral/ORIGINAL_R4_MANIFEST.json')
for n in ['B_off_NN_NN.png','B_on_NN_NN.png']:
    shutil.copyfile(PACK/'expected'/n,R/'expected'/n)
baseline=json.loads((PACK/'validation/preservation_baseline.json').read_text())
for key,path in [('R4','work/C001_ZANT_GATE_A_R4_NEUTRAL'),('independent_R4','outputs/C001_ZANT_GATE_A_R4_Independent_Review_2026-10-18')]:
    baseline['roots'][key]={'path':path,'files':tree(P/path)}
(R/'validation/preservation_baseline.json').write_text(json.dumps(baseline,indent=2)+'\n')
locked={f.relative_to(PACK).as_posix():{'bytes':f.stat().st_size,'sha256':sha(f)} for f in sorted((PACK/'assets').glob('*')) if f.is_file()}
for n in ['data/calibration.json','data/interfaces_neutral.json','data/neutral_recipes.json','contract/A25_LOCK.json']:
    f=PACK/n;locked[n]={'bytes':f.stat().st_size,'sha256':sha(f)}
lock={'acceptedCandidate':'C001_ZANT_GATE_A_R4_NEUTRAL_REVIEW_CANDIDATE_02','ownerAcceptance':'2026-10-18 explicit owner acceptance, including A16 authored waist/upper-pants treatment','status':'OWNER_ACCEPTED_FROZEN_NEUTRAL','A25':'prior accepted R2, unchanged RGB/alpha/registration','A16':'accepted authored proposal; not wholly source-exact RGB','files':locked,'fixedNeutralCoordinates':True,'newPoseMustAttachWithoutNeutralRevision':True,'reserveUseAtAcceptance':0}
(R/'contract/ACCEPTED_R4_NEUTRAL_LOCK.json').write_text(json.dumps(lock,indent=2)+'\n')
(R/'contract/OWNER_RESUME_AFTER_R4.md').write_text('''# Owner acceptance and C001 Gate A resume

The owner explicitly accepts R4 candidate02 neutral jacket-off/on, including the current authored A16 waist/upper-pants proposal. Freeze current registration, layer ownership, anchors, arm balance, wrist treatment, collar/shoulder construction and A16 treatment. A25 remains immutable. New pose artwork attaches to these fixed interfaces; neutral parts cannot change to accommodate it.

Resume remaining Gate A only: alternate whole-arm G/shared hands, O legs/shoes and evidenced allowed pelvis reserves, exactly seven face patches/ownership/gaze/asymmetry tests, semantic masks/restrained palettes, local viewer, full required matrix. Preserve original sources and all R1–R4/review history. The 32-baseline/6-bounded-reserve contract and existing stop rules remain controlling. Stop on a defined failure; otherwise freeze the completed independent-tester checkpoint and STOP FOR OWNER REVIEW. No later gate/character/animation/integration/database work.
''',encoding='utf-8')
ledger=json.loads((R/'data/surface_ledger.json').read_text())
for s in ledger['surfaces']:s['status']='OWNER_ACCEPTED_FROZEN' if s['path'] else 'NOT_YET_AUTHORED'
ledger['status']='GATE_A_RESUMED_WITH_FROZEN_R4_NEUTRAL'
(R/'data/surface_ledger.json').write_text(json.dumps(ledger,indent=2)+'\n')
print(json.dumps({'workspace':str(R),'frozenNeutralAssetFiles':len(list((R/'assets').glob('*'))),'R4HistoryFiles':len(baseline['roots']['R4']['files']),'reservesUsed':0}))
