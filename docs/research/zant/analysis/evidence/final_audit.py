"""Validate the research bundle and demonstrate source preservation; no asset changes."""
from pathlib import Path
import hashlib, json, re, zipfile, platform
from urllib.parse import unquote
import jsonschema
from PIL import __version__ as pillow_version
import numpy as np

OUT=Path(__file__).resolve().parents[1]
WORKSPACE=OUT.parents[1]
DOWNLOADS=Path(r'C:\Users\mcdon\Downloads')
preflight=json.loads((WORKSPACE/'outputs/Trapstar_ZANT_preflight_2026-10-18/preflight_integrity_inventory.json').read_text())

def digest(p):
    with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()

expected=[
 '01_SOURCE_TRUTH_AND_FORENSICS.md','02_ARCHITECTURE_OPTIONS.md',
 '03_FIVE_SLOT_FACE_SYSTEM_ANALYSIS.md','04_RECOMMENDED_ZANT_MODULAR_STANDARD_v0_1.md',
 '05_FIRST_COMBINATORIAL_CHARACTER_PROOF_SPEC.md','06_NEW_ZANT_CHARACTER_TO_DATABASE_WORKFLOW.md',
 '07_GAPS_RISKS_AND_REQUIRED_NEW_ART.md','08_NEXT_ACTION_BRIEF.md']
result={'date':'2026-10-18','timezone':'America/New_York',
 'environment':{'python':platform.python_version(),'pillow':pillow_version,'numpy':np.__version__},
 'deliverables':[],'supplied_input_checks':[],'raw_copy_checks':{},'screenshot_copy_checks':[],
 'scope':'research_only_no_production_implementation','errors':[]}
for name in expected:
    p=OUT/name
    rec={'file':name,'exists':p.exists()}
    if p.exists():rec.update(bytes=p.stat().st_size,words=len(p.read_text(encoding='utf-8').split()),sha256=digest(p))
    if not p.exists() or rec.get('words',0)<300:result['errors'].append('Missing/insufficient deliverable: '+name)
    result['deliverables'].append(rec)

for entry in preflight['attachments']:
    p=DOWNLOADS/entry['name']
    now=digest(p)
    rec={'file':str(p),'baseline_sha256':entry['sha256'],'current_sha256':now,'unchanged':now.lower()==entry['sha256'].lower()}
    result['supplied_input_checks'].append(rec)
    if not rec['unchanged']:result['errors'].append('Supplied input changed: '+p.name)

copies=json.loads((OUT/'evidence/evidence_copy_manifest.json').read_text())
fail=[]
for entry in copies:
    p=Path(entry['copy'])
    if not p.exists() or digest(p)!=entry['sha256']:fail.append(str(p))
result['raw_copy_checks']={'records_checked':len(copies),'distinct_paths':len({v['copy'] for v in copies}),'unchanged':not fail,'failures':fail}
result['errors']+=fail
with zipfile.ZipFile(next(DOWNLOADS.glob('*v2_PART2_*.zip'))) as z:
    for name in z.namelist():
        if name.endswith('.png'):
            p=WORKSPACE/'work/ZANT_analysis_sources/original_screenshots'/Path(name).name
            match=p.read_bytes()==z.read(name)
            result['screenshot_copy_checks'].append({'file':str(p),'unchanged':match})
            if not match:result['errors'].append('Screenshot copy changed: '+str(p))

schema=json.loads((OUT/'evidence/zant_asset_authoring_v0_1.schema.json').read_text())
example=json.loads((OUT/'evidence/C001_proof_SPEC_ONLY.example.json').read_text())
jsonschema.Draft202012Validator.check_schema(schema)
jsonschema.validate(example,schema)
result['schema_checks']={'schema_valid':True,'SPEC_ONLY_example_structurally_valid':True,'renderable_capsule_claim':False,'semantic_production_validation_implemented':False}

scope={'artifactKind':'research_specification_unimplemented','identity':'C001',
 'surfaces':{'neck_underplate':[1,4],'tee_torso':[1,4],'open_jacket_torso':[1,4],
 'tee_arms':[4,12],'jacket_arms':[4,12],'hands':[4,12],'pants_pelvis':[1,4],
 'pants_legs':[4,10],'shoes':[4,10],'head_bases':[1,4],'face_patches':[7,15]},
 'columns':['front_gate','complete_sparse_four_view'],
 'reserve_surfaces':{'liner_occlusion':4,'front_pelvis':2},
 'editable_material_mask_sets':{'front':10,'complete':30,'packing':'not_a_PNG_file_count'},
 'body_recipe_counts':{'front':2*4*3,'three_quarter':2*4,'side':2,'back':2},
 'palette_pairs':3*3,'state_limits':{'side_back':'neutral_only','three_quarter_legs':'neutral_only','front_leg_pairs':['NN','NO','ON'],'unsupported':['OO_legs','arbitrary_head_body_pairs','unreviewed_gaze_mixes','cross_fit']}}
scope['surface_totals']=[sum(v[i] for v in scope['surfaces'].values()) for i in range(2)]
scope['surface_cap']=scope['surface_totals'][1]+sum(scope['reserve_surfaces'].values())
scope['body_recipe_total']=sum(scope['body_recipe_counts'].values())
(OUT/'evidence/C001_proof_scope.json').write_text(json.dumps(scope,indent=2),encoding='utf-8')
result['proof_count_checks']={'front':scope['surface_totals'][0],'complete':scope['surface_totals'][1],'cap':scope['surface_cap'],'body_recipes':scope['body_recipe_total'],'counts_match_spec':scope['surface_totals']==[32,91] and scope['surface_cap']==97 and scope['body_recipe_total']==36}

# Create the audit target before checking local links that point to this file.
auditpath=OUT/'evidence/final_bundle_audit.json'
auditpath.write_text('{}',encoding='utf-8')
links=[];broken=[]
for p in OUT.rglob('*.md'):
    for raw in re.findall(r'\]\((<[^>]+>|[^)]+)\)',p.read_text(encoding='utf-8')):
        value=raw.strip('<>')
        if value.startswith(('http://','https://','mailto:','#','codex:')):continue
        value=unquote(value.split('#')[0])
        value=re.sub(r':\d+$','',value)
        t=Path(value)
        if not t.is_absolute():t=p.parent/t
        okay=t.exists()
        links.append({'document':str(p.relative_to(OUT)),'target':value,'exists':okay})
        if not okay:broken.append(links[-1])
result['local_markdown_links']={'checked':len(links),'broken':broken}
result['errors'] += ['Broken link: '+str(v) for v in broken]

def reject_constant(v):raise ValueError('Nonfinite JSON value '+v)
jsonfiles=[]
for p in OUT.rglob('*.json'):
    json.loads(p.read_text(encoding='utf-8-sig'),parse_constant=reject_constant)
    jsonfiles.append(str(p.relative_to(OUT)))
result['strict_json_parse']={'files':len(jsonfiles),'passed':True}
result['all_checks_passed']=not result['errors'] and result['proof_count_checks']['counts_match_spec']
auditpath.write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps({'deliverables':len(result['deliverables']),'supplied_inputs_unchanged':all(v['unchanged'] for v in result['supplied_input_checks']),'raw_copies':result['raw_copy_checks'],'schema_checks':result['schema_checks'],'proof_count_checks':result['proof_count_checks'],'local_markdown_links':result['local_markdown_links'],'strict_json_parse':result['strict_json_parse'],'all_checks_passed':result['all_checks_passed']},indent=2))
if not result['all_checks_passed']:raise SystemExit(1)
