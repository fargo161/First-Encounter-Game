"""Fingerprint M2 source, authored content, tests, and build/evidence tools."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
paths = [root / "package.json"]
for folder in ("src", "tests", "scripts", "content"):
    paths.extend(p for p in (root / folder).rglob("*") if p.is_file() and "__pycache__" not in p.parts)
entries = [{"path": p.relative_to(root).as_posix(), "sha256": hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(paths)]
digest = hashlib.sha256(json.dumps(entries, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
result = {"sourceRevision": "M2-runtime-v1", "sourceDigest": digest, "files": entries}
(root / "evidence/M2_source_identity.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"sourceRevision": result["sourceRevision"], "sourceDigest": digest, "files": len(entries)}))
