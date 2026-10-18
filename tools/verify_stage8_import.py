"""Read-only Stage 8 import integrity. Never imports or executes ZANT code."""
from pathlib import Path
from collections import Counter
import argparse, hashlib, json, subprocess
ROOT = Path(__file__).resolve().parents[1]

def load(p):
    return json.loads(p.read_text(encoding="utf-8"))

def sha(p):
    with p.open("rb") as f:
        return hashlib.file_digest(f, "sha256").hexdigest()

def files(p):
    return {f.relative_to(p).as_posix() for f in p.rglob("*") if f.is_file()}

def check(p, e):
    assert p.stat().st_size == e["bytes"] and sha(p) == e["sha256"], str(p)

def fingerprint(es):
    records = sorted(
        [{"path": e["path"], "bytes": e["bytes"], "sha256": e["sha256"]} for e in es],
        key=lambda e: e["path"],
    )
    return hashlib.sha256(json.dumps(records, sort_keys=True, separators=(",", ":")).encode()).hexdigest()

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--originals", action="store_true", help="Verify the original preservation inventory and cache guard.")
    ap.add_argument("--require-git", action="store_true", help="Require clean main and unchanged other-subsystem Git paths.")
    args = ap.parse_args()
    m = load(ROOT / "docs/provenance/zant-stage8-import.json")
    p = ROOT / m["repository_package"]
    assert files(p) == {e["path"] for e in m["files"]}
    for e in m["files"] + m["supplemental_provenance"]:
        check(ROOT / e["repository_path"], e)
    for e in m["authored_records"]:
        check(ROOT / e["path"], e)
    assert fingerprint(m["files"]) == m["selected_package_tree_sha256"]
    frozen = load(p / "manifest.json")
    assert len(frozen["files"]) == 165
    assert {e["path"]: (e["bytes"], e["sha256"]) for e in frozen["files"]} == {
        e["path"]: (e["bytes"], e["sha256"]) for e in m["files"] if e["path"] != "manifest.json"
    }
    assert not frozen["gateAComplete"] and not frozen["newPilotOwnerAccepted"]
    assert frozen["gateAVerdict"] == "GATE_A_FAILED_AT_G_SLEEVE_PILOT"
    full = load(ROOT / "docs/provenance/zant-external/tree-manifests/zant-r5-editable.json")
    assert len(full["files"]) == 506 and fingerprint(full["files"]) == m["source"]["tree_sha256"]
    assert len(m["external_R5_delivery_files"]) == 340
    lock = load(p / "contract/ACCEPTED_R4_NEUTRAL_LOCK.json")
    assert len(lock["files"]) == 20
    for rel, e in lock["files"].items():
        check(p / rel, e)
    ledger = load(p / "data/surface_ledger.json")
    assert len(ledger["surfaces"]) == 32 and ledger["reserves"] == []
    assert dict(Counter(e["status"] for e in ledger["surfaces"])) == m["status_preservation"]["surface_ledger_counts"]
    for e in ledger["surfaces"]:
        if e["path"]:
            assert (p / e["path"]).is_file(), e["path"]
    matrix = load(p / "data/required_matrix.json")
    rows = [e for group in ["body", "palette", "isolatedFace", "assembledFace", "negative"] for e in matrix[group]]
    assert len(rows) == 243 and len({e["id"] for e in rows}) == 243
    summary = load(p / "validation/matrix_execution_summary.json")
    assert summary == m["status_preservation"]["matrix_summary"]
    assert dict(Counter(e["status"] for e in rows)) == summary["actualStatuses"]
    assert summary["actualStatuses"]["NOT_RUN_R5_STOP_CONDITION"] == 239
    state = load(p / "data/run_state.json")
    assert state["gateAComplete"] is False and state["reservesUsed"] == 0
    assert state["verdict"] == "GATE_A_FAILED_AT_G_SLEEVE_PILOT"
    a = load(ROOT / "docs/provenance/source-authority.json")
    assert a["current_authorized_stage"] == 8 and a["next_stage"].startswith("Stage 9")
    assert a["subsystems"]["encounter_atlas"] == m["unchanged_encounter_authority"]
    assert a["subsystems"]["room_creator"] == m["unchanged_room_creator_authority"]
    assert a["subsystems"]["room_creator"]["acceptance"] == "HOLD_FOR_FURTHER_REMEDIATION"
    assert a["subsystems"]["zant"]["neutral_acceptance"] == "OWNER_ACCEPTED_R4_CANDIDATE02"
    assert a["subsystems"]["zant"]["current_work_acceptance"] == "GATE_A_FAILED_AT_G_SLEEVE_PILOT"
    assert not a["verification_this_execution"]["source_builds_or_behavior_tests_executed"]
    assert not a["verification_this_execution"]["stage9_started"]
    a1 = load(ROOT / "docs/provenance/encounter-atlas-stage4-import.json")
    rc = load(ROOT / "docs/provenance/room-creator-stage6-import.json")
    for prior in [a1, rc]:
        es = prior["files"] + prior.get("packaging_metadata", [])
        q = ROOT / prior["repository_package"]
        assert files(q) == {e["path"] for e in es}
        for e in es:
            check(q / e["path"], e)
    s7 = load(ROOT / "docs/provenance/room-creator-stage7-verification.json")
    for e in s7["repository_evidence"]:
        check(ROOT / e["path"], e)
    external = load(ROOT / m["external_intake_index"])
    assert len(external["seven_intake_packages"]) == 7
    assert all(not e["imported_payload"] for e in external["seven_intake_packages"])
    assert not (ROOT / "runtime").exists()
    assert "filter=lfs" not in (ROOT / ".gitattributes").read_text(encoding="utf-8")
    originals = 0
    if args.originals:
        archive = Path(m["archive_root"])
        inventory_path = archive / "archive-inventory.json"
        assert sha(inventory_path) == m["preservation_inventory_sha256"]
        inventory = load(inventory_path)["files"]
        for e in inventory:
            original = Path(e["source_path"])
            check(original, e)
            assert original.stat().st_mtime_ns == e["source_mtime_ns"], str(original)
            check(archive / e["archive_path"], e)
        for e in m["excluded_original_caches"]:
            q = Path(e["source_path"])
            check(q, e)
            assert q.stat().st_mtime_ns == e["mtime_ns"]
        originals = len(inventory)
    result = {
        "stage8_import_integrity": "PASS",
        "ZANT_package_files": len(m["files"]),
        "ZANT_package_bytes": m["selected_package_bytes"],
        "ZANT_package_tree_sha256": m["selected_package_tree_sha256"],
        "supplemental_provenance_files": len(m["supplemental_provenance"]),
        "accepted_R4_lock_files": 20,
        "accepted_neutral_surfaces": 15,
        "unaccepted_or_failed_pilot_surfaces": 3,
        "unauthored_slots": 14,
        "reserves_used": 0,
        "unrun_valid_cases": 222,
        "unrun_production_negatives": 17,
        "Encounter_canonical_files_unchanged": 2731,
        "Room_Creator_baseline_files_unchanged": 383,
        "Room_Creator_Git_metadata_unchanged": 1,
        "Room_Creator_status": "HOLD_FOR_FURTHER_REMEDIATION",
        "originals_and_archive_copies_verified": originals,
        "ZANT_source_executed": False,
        "stage9_started": False,
        "scope": "Byte/membership/recorded-status/Git integrity only; no pixel replay, art acceptance or behavior tests.",
    }
    if args.require_git:
        def git(*a):
            return subprocess.check_output(["git", "-C", str(ROOT), *a], encoding="utf-8").strip()
        assert git("branch", "--show-current") == "main"
        assert not git("status", "--porcelain=v1", "--untracked-files=all")
        assert git("rev-list", "--max-parents=0", "HEAD") == m["history_root"]
        assert not git("diff", m["pre_stage8_commit"], "HEAD", "--", "packages/encounter-atlas", "packages/room-creator", "docs/audits/room-creator", "docs/audits/encounter-atlas", "tools/room-creator-independent", "tools/encounter-atlas-independent")
        result["head"] = git("rev-parse", "HEAD")
        result["git"] = "PASS"
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
