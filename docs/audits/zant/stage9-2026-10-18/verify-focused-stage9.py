from pathlib import Path
from collections import Counter
import json,hashlib,zipfile,csv,io,re
import numpy as np
from PIL import Image
R=Path.cwd();V=Path(r'C:\Users\mcdon\Documents\ChatGPT\First Encounter Game Archive\stage-9-verification-2026-10-18');D=V/'work/independent-r5';P=D/'fresh_extraction/C001_ZANT_GATE_A_R5_FAILED_G_SLEEVE_PILOT'
def load(p):return json.loads(p.read_text(encoding='utf-8'))
def sha(p):
 with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def save(p,o):p.write_text(json.dumps(o,indent=2)+'\n',encoding='utf-8',newline='\n')
def rgba(p):
 with Image.open(p) as im:return np.array(im.convert('RGBA'))
a=load(V/'inputs/source-authority-before.json');m=load(V/'inputs/stage8-import-manifest.json');A=Path(m['archive_root']);z=a['subsystems']['zant']
lock=load(P/'contract/ACCEPTED_R4_NEUTRAL_LOCK.json');r4=z['accepted_neutral_checkpoint'];entries=[]
assert sha(Path(r4['source_path']))==sha(A/r4['archive_path'])==r4['sha256']
with zipfile.ZipFile(A/r4['archive_path']) as f:
 members={i.filename.split('/',1)[1]:i for i in f.infolist() if not i.is_dir() and '/' in i.filename}
 for rel,e in lock['files'].items():
  actual=hashlib.sha256(f.read(members[rel])).hexdigest()
  assert actual==sha(P/rel)==sha(R/m['repository_package']/rel)==e['sha256']
  entries.append({'path':rel,'bytes':e['bytes'],'sha256':actual,'accepted_candidate02_match':True,'canonical_and_disposable_match':True})
 neutral=[]
 for case in ['B_off_NN_NN','B_on_NN_NN']:
  b=f.read(members['expected/'+case+'.png']);old=rgba(io.BytesIO(b));current=rgba(P/'expected'/f'{case}.png')
  assert np.array_equal(old,current)
  neutral.append({'case':case,'R4_expected_encoded_sha256':hashlib.sha256(b).hexdigest(),'R5_expected_encoded_sha256':sha(P/'expected'/f'{case}.png'),'all_RGBA_bytes_equal':True,'decoded_RGBA_sha256':hashlib.sha256(old.tobytes()).hexdigest()})
save(V/'checks/R4-accepted-lock-and-mappings.json',{'result':'PASS','candidate02_zip_sha256':r4['sha256'],'locked_entries':entries,'neutral_expected_buffers':neutral,'owner_acceptance_record_sha256':sha(P/'contract/OWNER_RESUME_AFTER_R4.md'),'A16_role':'accepted authored art; not wholly source-exact RGB','historical_draft_labels_unchanged':True})
seed=rgba(P/'references/A16_source_seed.png');accepted=rgba(P/'assets/A16_pants_pelvis_NN.png')
delta=np.any(seed[:,:,:3]!=accepted[:,:,:3],axis=2)&(accepted[:,:,3]>0)
with (P/'validation/A16_RGB_changes_from_source_seed.csv').open(encoding='utf-8',newline='') as f:rows=list(csv.DictReader(f))
coords=set()
for row in rows:
 x,y=int(row['body_x']),int(row['body_y']);coords.add((x,y))
 assert seed[y,x,:3].tolist()==[int(row['source_'+c]) for c in ['r','g','b']]
 assert accepted[y,x,:3].tolist()==[int(row['derivative_'+c]) for c in ['r','g','b']]
ys,xs=np.where(delta);computed=set(zip(xs.tolist(),ys.tolist()))
assert coords==computed and len(rows)==len(coords)==13564
waist=sum(840<=y<=864 for x,y in coords)
assert waist==5066,waist
save(V/'checks/A16-authored-disclosure.json',{'result':'PASS','accepted_A16_sha256':sha(P/'assets/A16_pants_pelvis_NN.png'),'source_seed_sha256':sha(P/'references/A16_source_seed.png'),'visible_RGB_different_pixels':len(coords),'CSV_rows':len(rows),'CSV_source_and_accepted_RGB_match':True,'waist_band_y840_to864_different_pixels':waist,'interpretation':'Existing accepted authored A16 difference is exactly disclosed, not a regression or new alteration.'})
ledger=load(P/'data/surface_ledger.json');matrix=load(P/'data/required_matrix.json');groups=['body','palette','isolatedFace','assembledFace','negative'];cases=[c for k in groups for c in matrix[k]]
assert len(ledger['surfaces'])==32 and len(cases)==243 and len({c['id'] for c in cases})==243
counts=dict(Counter(s['status'] for s in ledger['surfaces']))
assert counts==m['status_preservation']['surface_ledger_counts']
assert ledger['reserves']==[]
distribution=dict(Counter(c['status'] for c in cases))
assert distribution==m['status_preservation']['matrix_summary']['actualStatuses']
for rel in ['data/surface_ledger.json','data/required_matrix.json','data/neutral_recipes.json','data/pilot_recipes.json','data/calibration.json','data/interfaces_neutral.json','validation/G_L_failed_wrist_measurement.json','validation/matrix_execution_summary.json','data/run_state.json']:
 e=next(e for e in m['files'] if e['path']==rel)
 assert sha(P/rel)==e['sha256']
state={'result':'PASS','slot_count':32,'slot_states':[{'id':s['id'],'path':s['path'],'status':s['status']} for s in ledger['surfaces']],'slot_status_counts':counts,'reserve_use':0,'matrix_ids':[c['id'] for c in cases],'matrix_groups':{k:{'count':len(matrix[k]),'states':dict(Counter(c['status'] for c in matrix[k]))} for k in groups},'total_matrix_cases':243,'status_distribution':distribution,'unrun_valid':222,'unrun_production_negatives':17,'selected_record_bytes_match_stage8':True,'Gate_A_complete':False}
save(V/'checks/ledger-matrix-state-preservation.json',state)
external=load(R/m['external_intake_index']);intake_root=Path(z['original_source_collection']['source_root']);intake_manifest=load(R/'docs/provenance/zant-external/tree-manifests/zant-intake-source.json');files=intake_manifest['files']
originals=[e for e in files if e['path'].startswith('original/') and re.fullmatch(r'C\d{3}_source_neutral_rgba.png',Path(e['path']).name)]
extra_originals=[e for e in files if e['path'].startswith('original/') and e not in originals]
dups=[e for e in files if '/source_masters/' in e['path']]
assert len(originals)==len(dups)==44 and len(extra_originals)==52
by_name={Path(e['path']).name:e for e in originals}
for e in originals+dups:
 assert sha(intake_root/e['path'])==e['sha256']
 if e in dups:assert by_name[Path(e['path']).name]['sha256']==e['sha256']
references=[]
for ref in external['imported_reference_origins']:
 assert sha(R/ref['repository_path'])==ref['sha256']
 for rel in ref['byte_identical_intake_paths']:assert sha(intake_root/rel)==ref['sha256']
 references.append(ref)
parts=[]
for e in external['seven_intake_packages']:
 assert sha(Path(e['source_path']))==sha(A/e['archive_path'])==e['sha256']
 parts.append({'name':e['name'],'bytes':e['bytes'],'sha256':e['sha256'],'source_and_archive_match':True,'role':e['purpose'],'imported_payload':False})
failed=z['current_failed_checkpoint'];assert sha(Path(failed['source_path']))==sha(A/failed['archive_path'])==failed['sha256']
roles={'result':'PASS','original_neutral_masters':44,'original_additional_design_pose_references':52,'byte_identical_source_master_duplicates':44,'fresh_original_and_duplicate_hashes_checked':88,'imported_reference_mappings':references,'seven_intake_parts':parts,'failed_R5_checkpoint_sha256':failed['sha256'],'accepted_R4_checkpoint_sha256':r4['sha256'],'original_master_role':'identity/design authority','derived_roles_distinct':True,'experimental_face_and_research_not_production_contracts':True,'evidence_basis':'Exact unchanged imported contracts/ledgers and separate research/schema/reference locations; source mapping hashes, accepted lock, historical owner chronology and no new runtime/integration files. No claim of cast-wide modular art acceptance.'}
save(V/'checks/source-authority-and-external-identities.json',roles)
print(json.dumps({'R4_lock_entries':len(entries),'accepted_neutral_expected_buffers':len(neutral),'A16_disclosed_RGB_changes':len(coords),'A16_waist_band_changes':waist,'slots':32,'matrix_cases':243,'reserve_use':0,'seven_external_intake_hashes':'PASS','original_master_and_duplicate_hashes':88,'scope':'Focused independent checks; no product changes.'},indent=2))
