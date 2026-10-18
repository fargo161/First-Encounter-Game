"""Bounded manifest/count/provenance cross-checks, plus unchanged visual samples."""
from pathlib import Path
from collections import Counter, defaultdict
import io
import json
import zipfile
from PIL import Image

ROOT = Path(r'C:\Users\mcdon\Downloads')
OUT = Path(__file__).resolve().parent
audit = json.loads((OUT / 'preflight_integrity_inventory.json').read_text())
parts = {i: next(ROOT.glob(f'*v2_PART{i}_*.zip')) for i in range(1, 8)}
zs = {i: zipfile.ZipFile(p) for i, p in parts.items()}
members = audit['members']
modroot = 'NEUTRAL_CHARACTER_MODULAR_REBUILD_V03_2/'
faceroot = 'FIVE_SLOT_FACE_SYSTEM_REFERENCE/'
face = json.loads(zs[5].read(faceroot + 'manifest/goose_expression_manifest.json'))
characters = json.loads(zs[3].read(modroot + 'metadata/character_manifest_v03.json'))
repair = json.loads(zs[3].read(modroot + 'metadata/gear_accessory_catalog_repair_v03_2.json'))
idmap = json.loads(zs[3].read(modroot + 'metadata/source_identity_map_v02.json'))
out = {}

def membermap(part, prefix=''):
    return {m['path']: m for m in members if m['archive'].startswith(parts[part].name + prefix)}

original = {Path(m['path']).name: m for m in members if m['archive'].endswith('characters_trapstar_source.zip')}
wardrobe = {Path(m['path']).name: m for m in members if m['archive'].endswith('C001-C044_clothing_inventory_rgba.zip')}
mod3, mod4 = membermap(3), membermap(4)
out['series'] = {}
for label, bank, fmt in [
    ('original_neutrals', original, 'C{:03d}_source_neutral_rgba.png'),
    ('reconstruction_source_masters', mod4, modroot + 'source_masters/C{:03d}_source_neutral_rgba.png'),
    ('clothing_original', wardrobe, 'C{:03d}_clothing_inventory_rgba.png'),
    ('calibrations', mod3, modroot + 'body_calibration/C{:03d}_fit_calibration_rgba.png'),
    ('clothing_modular', mod3, modroot + 'clothing_catalogs/C{:03d}_clothing_inventory_rgba.png'),
    ('gear_modular', mod3, modroot + 'gear_accessory_catalogs/C{:03d}_gear_accessory_inventory_rgba.png'),
    ('rebuilt_composites', mod4, modroot + 'rebuilt_composites/C{:03d}_neutral_composite_rgba.png'),
    ('kit_plates', mod4, modroot + 'kit_plates/C{:03d}_modular_kit_plate_rgba.png')]:
    out['series'][label] = {'expected': 44, 'present': sum(fmt.format(i) in bank for i in range(1,45)), 'missing': [fmt.format(i) for i in range(1,45) if fmt.format(i) not in bank]}

out['source_copies_identical'] = sum(original[f'C{i:03d}_source_neutral_rgba.png']['sha256'] == mod4[modroot + f'source_masters/C{i:03d}_source_neutral_rgba.png']['sha256'] for i in range(1,45))
out['wardrobe_copies_identical'] = sum(wardrobe[f'C{i:03d}_clothing_inventory_rgba.png']['sha256'] == mod3[modroot + f'clothing_catalogs/C{i:03d}_clothing_inventory_rgba.png']['sha256'] for i in range(1,45))
out['character_source_hashes'] = {'checked': 44, 'mismatches': [c['id'] for c in characters['characters'] if c['source_sha256'].lower() != original[c['id'] + '_source_neutral_rgba.png']['sha256']]}
out['repair_catalog_hashes'] = {'checked': len(repair['characters']), 'mismatches': [cid for cid, c in repair['characters'].items() if c['gear_catalog_sha256'].lower() != mod3[modroot + c['gear_catalog']]['sha256']]}
face_members = {m['path'][len(faceroot):]: m for m in members if m['path'].startswith(faceroot)}
out['face_manifest_hashes'] = {'checked': len(face['files']), 'missing': [], 'mismatches': []}
for path, record in face['files'].items():
    if path not in face_members: out['face_manifest_hashes']['missing'].append(path)
    elif record['sha256'].lower() != face_members[path]['sha256']: out['face_manifest_hashes']['mismatches'].append(path)
refs = [face['baseHead']] + [s['mask'] for s in face['slotDefinitions']]
for e in face['expressions']:
    refs += [e['baseHead'], e['preview'], e['generatedSource']] + list(e['slots'].values())
out['face_manifest_references'] = {'unique': len(set(refs)), 'missing': sorted(set(refs) - face_members.keys())}
out['face_slot_membership'] = {e['expressionId']: sorted(e['slots']) for e in face['expressions']}
out['fit_reference_calibration_copies'] = {fit: mod3[modroot + f'fit_classes/{fit}_canonical_rgba.png']['sha256'] == mod3[modroot + f'body_calibration/{cid}_fit_calibration_rgba.png']['sha256'] for fit, cid in characters['recommended_fit_masters'].items()}

groups = defaultdict(list)
for name,m in original.items(): groups[m['sha256']].append(name)
out['original_internal_duplicates'] = [p for p in groups.values() if len(p)>1]
out['original_non_neutral_count'] = len(original) - 44
out['original_non_neutral_distinct_count'] = len({m['sha256'] for n,m in original.items() if not n.startswith('C') or not n.endswith('_source_neutral_rgba.png')})
quick = [m for m in members if m['archive']==parts[1].name and m['path'].startswith('05_QUICK_REVIEW/')]
out['quick_review_duplicate_count'] = sum(any(n['sha256']==m['sha256'] and n['archive']!=parts[1].name for n in members) for m in quick)
out['embedded_master_matches_standalone'] = zs[1].read('06_RESEARCH_BRIEF/CODEX_MASTER_PROMPT_v2.md') == (ROOT/'CODEX_ZANT_COMBINATORIAL_CHARACTER_RESEARCH_MASTER_PROMPT_v2.md').read_bytes()
out['embedded_face_facts_match_standalone'] = zs[1].read('06_RESEARCH_BRIEF/FACE_SYSTEM_SOURCE_FACTS.md') == (ROOT/'ZANT_FIVE_SLOT_FACE_SYSTEM_SOURCE_FACTS.md').read_bytes()
out['legacy_identity_map'] = {'source_file_count': idmap['source_file_count'], 'distinct_identity_count': idmap['distinct_identity_count'], 'master_paths_present': sum(any(m['path'].endswith('/'+c['master']) for m in members) for c in idmap['masters']), 'source_filenames': len({s['file'] for c in idmap['masters'] for s in c['sources']}), 'source_filenames_found': sorted({s['file'] for c in idmap['masters'] for s in c['sources']} & original.keys())}
out['repair_summary_as_supplied'] = repair['summary']
out['zip_timestamp_range'] = [min(m['zip_timestamp'] for m in members), max(m['zip_timestamp'] for m in members)]

# Read-only path availability audit for the current merged modular tree.
modpaths = {m['path'][len(modroot):] for m in members if m['path'].startswith(modroot)}
keys = ['source_master','rebuilt_composite','body_calibration','kit_plate','clothing_inventory','gear_accessory_inventory']
out['character_manifest_references'] = {'checked': len(characters['characters'])*len(keys), 'missing': [c[k] for c in characters['characters'] for k in keys if c[k] not in modpaths]}

samples = {
    'original_44_contact.jpg': (1, '05_QUICK_REVIEW/neutral_44_source_contact.jpg'),
    'C001_clothing_inventory.png': (2, 'ORIGINAL_USER_SOURCE/C001_clothing_inventory_sample.png'),
    'eight_fit_classes.png': (1, '05_QUICK_REVIEW/eight_fit_classes_contact_sheet.png'),
    'C020_kit_plate.png': (1, '05_QUICK_REVIEW/C020_modular_kit_plate_rgba.png'),
    'C028_kit_plate.png': (1, '05_QUICK_REVIEW/C028_modular_kit_plate_rgba.png'),
    'face_contact.png': (5, faceroot + 'previews/goose_expression_contact_sheet.png'),
    'face_registration_guide.png': (5, faceroot + 'docs/goose_slot_registration_guide.png'),
}
(OUT/'samples').mkdir(exist_ok=True)
out['representative_decodes'] = {}
for dest,(part,path) in samples.items():
    data = zs[part].read(path)
    (OUT/'samples'/dest).write_bytes(data)
    with Image.open(io.BytesIO(data)) as im:
        im.load()
        out['representative_decodes'][dest] = {'size': list(im.size), 'mode': im.mode}

# A few actual assets from every major family, without a mass measurement pass.
with zipfile.ZipFile(io.BytesIO(zs[2].read('ORIGINAL_USER_SOURCE/characters_trapstar_source.zip'))) as origzip:
    for key, z, path in [
        ('original_C001', origzip, 'characters trapstar source/C001_source_neutral_rgba.png'),
        ('calibration_C001', zs[3], modroot+'body_calibration/C001_fit_calibration_rgba.png'),
        ('rebuild_C001', zs[4], modroot+'rebuilt_composites/C001_neutral_composite_rgba.png'),
        ('gear_C002', zs[3], modroot+'gear_accessory_catalogs/C002_gear_accessory_inventory_rgba.png'),
        ('base_head', zs[5], faceroot+'base/goose__base_head.png'),
        ('face_mask', zs[5], faceroot+'technical/slot_masks/left_eye__mask.png'),
        ('face_preview', zs[5], faceroot+'previews/goose_expr_01__preview.png'),
        ('raw_face_edit', zs[5], faceroot+'generated_full/goose_expr_01__generated.png'),
        ('slot_part6', zs[6], faceroot+'slots/goose_expr_01/goose_expr_01__left_eye.png'),
        ('slot_part7', zs[7], faceroot+'slots/goose_expr_18/goose_expr_18__lower_face.png')]:
        with Image.open(io.BytesIO(z.read(path))) as im:
            im.load()
            info = {'size': list(im.size), 'mode': im.mode}
            if key=='gear_C002': info['alpha_extrema']=im.getchannel('A').getextrema()
            out['representative_decodes'][key] = info

out['text_replacement_character_counts'] = {}
for i,z in zs.items():
    for n in z.namelist():
        if n.endswith(('.md','.txt','.json','.py','.html')):
            txt=z.read(n).decode('utf-8-sig')
            if '\ufffd' in txt: out['text_replacement_character_counts'][f'Part{i}!{n}']=txt.count('\ufffd')

(OUT/'preflight_crosschecks.json').write_text(json.dumps(out,indent=2),encoding='utf-8')
print(json.dumps(out,indent=2))
for z in zs.values(): z.close()
