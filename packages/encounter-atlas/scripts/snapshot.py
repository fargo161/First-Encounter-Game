"""Deterministic, path-relative checkpoint export; identity file stays outside ZIP."""
import hashlib
import json
from pathlib import Path
import sys
import zipfile

root = Path(__file__).resolve().parents[1]
label = sys.argv[1]
if label != "Encounter_M2_Checkpoint":
    raise SystemExit("Unknown checkpoint label")
archive = root.parent / (label + ".zip")
identity = root.parent / (label + ".identity.json")
if archive.exists() or identity.exists():
    raise SystemExit("Refusing to overwrite a frozen checkpoint or identity")
files = sorted(p for p in root.rglob("*") if p.is_file() and "__pycache__" not in p.parts)
manifest = []
with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
    for file in files:
        content = file.read_bytes()
        name = file.relative_to(root).as_posix()
        entry = zipfile.ZipInfo(name, date_time=(2026, 10, 17, 0, 0, 0))
        entry.compress_type = zipfile.ZIP_DEFLATED
        entry.external_attr = 0o100644 << 16
        bundle.writestr(entry, content)
        manifest.append({"path": name, "bytes": len(content), "sha256": hashlib.sha256(content).hexdigest()})
source = json.loads((root / 'evidence/M2_source_identity.json').read_text(encoding='utf-8'))
package = json.loads((root / 'M2_Interaction_Run.json').read_text(encoding='utf-8'))['package']
record = {"snapshot": archive.name, "sha256": hashlib.sha256(archive.read_bytes()).hexdigest(),
          "baseline": {"snapshot": "Encounter_M0_M1_Checkpoint_R2.zip", "sha256": "47a879c74ac7f684ff5d3d7d1de742d800d8d5cd801fe833234707ec66be555d"},
          "sourceRevision": source['sourceRevision'], "sourceDigest": source['sourceDigest'],
          "contentRevision": package['content']['contentRevision'], "packageRef": package['ref'], "files": manifest}
identity.write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"snapshot": archive.name, "sha256": record["sha256"], "files": len(files)}))
