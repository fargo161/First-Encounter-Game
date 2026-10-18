"""Read-only verification of an external checkpoint identity and every ZIP member."""
import hashlib
import json
from pathlib import Path, PurePosixPath
import sys
import zipfile

identity_path = Path(sys.argv[1]).resolve()
identity = json.loads(identity_path.read_text(encoding="utf-8"))
archive = identity_path.parent / identity["snapshot"]
assert archive.parent == identity_path.parent
assert hashlib.sha256(archive.read_bytes()).hexdigest() == identity["sha256"], "Archive SHA-256 mismatch"
expected = {entry["path"]: entry for entry in identity["files"]}
assert len(expected) == len(identity["files"]), "Duplicate manifest path"
with zipfile.ZipFile(archive) as bundle:
    assert len(bundle.namelist()) == len(expected)
    assert set(bundle.namelist()) == set(expected)
    for name, entry in expected.items():
        relative = PurePosixPath(name)
        assert not relative.is_absolute() and ".." not in relative.parts and "\\" not in name
        content = bundle.read(name)
        assert len(content) == entry["bytes"]
        assert hashlib.sha256(content).hexdigest() == entry["sha256"], name
print(json.dumps({"verified": archive.name, "sha256": identity["sha256"], "files": len(expected)}))
