"""Read-only package integrity/inventory audit. Does not execute supplied code."""
from pathlib import Path, PurePosixPath
from collections import Counter, defaultdict
import hashlib
import io
import json
import zipfile
from PIL import Image

ROOT = Path(r'C:\Users\mcdon\Downloads')
OUT = Path(__file__).resolve().parent
MANIFEST = ROOT / 'Trapstar_ZANT_Combinatorial_Character_Research_Handoff_v2_PACKAGE_MANIFEST.json'
manifest = json.loads(MANIFEST.read_text(encoding='utf-8-sig'))
result = {'method': 'SHA-256, full ZIP member reads (CRC), recursive ZIP reads, image structural verification, UTF-8 text/JSON parsing; no supplied scripts executed', 'attachments': [], 'archives': [], 'members': [], 'errors': [], 'warnings': []}

def audit_zip(source, locator):
    with zipfile.ZipFile(source) as z:
        files = [i for i in z.infolist() if not i.is_dir()]
        rec = {'locator': locator, 'files': len(files), 'bytes_uncompressed': sum(i.file_size for i in files), 'extensions': dict(Counter(PurePosixPath(i.filename).suffix.lower() for i in files)), 'groups': dict(Counter(str(PurePosixPath(i.filename).parent) for i in files))}
        result['archives'].append(rec)
        for name, count in Counter(i.filename for i in files).items():
            if count > 1:
                result['warnings'].append({'archive': locator, 'duplicate_member_name': name, 'count': count})
        for info in files:
            name = info.filename
            path = PurePosixPath(name.replace('\\', '/'))
            if path.is_absolute() or '..' in path.parts or ':' in name or info.flag_bits & 1:
                result['warnings'].append({'archive': locator, 'unsafe_or_encrypted_member': name})
            member = {'archive': locator, 'path': name, 'bytes': info.file_size, 'crc32': f'{info.CRC:08x}', 'zip_timestamp': list(info.date_time)}
            try:
                data = z.read(info)  # Reads every byte and verifies member CRC.
                member['sha256'] = hashlib.sha256(data).hexdigest()
                member['crc_read_ok'] = True
                ext = path.suffix.lower()
                if ext == '.zip':
                    audit_zip(io.BytesIO(data), locator + '!' + name)
                elif ext in {'.png', '.jpg', '.jpeg', '.webp', '.gif'}:
                    with Image.open(io.BytesIO(data)) as im:
                        im.verify()  # Structural integrity only; no mass image measurements.
                    member['image_verify_ok'] = True
                elif ext in {'.md', '.txt', '.json', '.html', '.py', '.csv'}:
                    txt = data.decode('utf-8-sig')
                    member['text_decode_ok'] = True
                    if ext == '.json':
                        json.loads(txt)
                        member['json_parse_ok'] = True
            except Exception as exc:
                member['error'] = str(exc)
                result['errors'].append({'archive': locator, 'path': name, 'error': str(exc)})
            result['members'].append(member)

expected = manifest['parts'] + [manifest['master_prompt'], manifest['face_system_source_facts']]
for item in expected:
    p = ROOT / item['name']
    check = {'name': p.name, 'exists': p.is_file(), 'expected_bytes': item['bytes'], 'expected_sha256': item['sha256']}
    if p.is_file():
        check['bytes'] = p.stat().st_size
        with p.open('rb') as f:
            check['sha256'] = hashlib.file_digest(f, 'sha256').hexdigest()
        check['size_matches'] = check['bytes'] == item['bytes']
        check['sha256_matches'] = check['sha256'] == item['sha256']
        if p.suffix.lower() == '.zip':
            audit_zip(p, p.name)
        else:
            p.read_text(encoding='utf-8-sig')
    result['attachments'].append(check)
    print(json.dumps(check), flush=True)

for p in [MANIFEST, ROOT / 'Trapstar_ZANT_Combinatorial_Character_Research_Handoff_v2_DELIVERY_INDEX.md']:
    data = p.read_bytes()
    data.decode('utf-8-sig')
    result['attachments'].append({'name': p.name, 'exists': True, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'published_hash': False})

byhash = defaultdict(list)
for m in result['members']:
    if 'sha256' in m:
        byhash[m['sha256']].append(m['archive'] + '!' + m['path'])
result['byte_identical_groups'] = [{'sha256': h, 'paths': p} for h, p in byhash.items() if len(p) > 1]
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'preflight_integrity_inventory.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps({'archives': result['archives'], 'members_including_nested_archives': len(result['members']), 'image_verify_count': sum(bool(m.get('image_verify_ok')) for m in result['members']), 'text_decode_count': sum(bool(m.get('text_decode_ok')) for m in result['members']), 'errors': result['errors'], 'warnings': result['warnings'], 'byte_identical_groups': len(result['byte_identical_groups'])}, indent=2), flush=True)
