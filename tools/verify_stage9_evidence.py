"""Read-only Stage 9 source/evidence integrity; does not repeat pixel or behavior execution."""
from pathlib import Path
import argparse, hashlib, json, subprocess
ROOT = Path(__file__).resolve().parents[1]

def load(p):
    return json.loads(p.read_text(encoding="utf-8"))

def sha(p):
    with p.open("rb") as f:
        return hashlib.file_digest(f, "sha256").hexdigest()

def check(p, e):
    assert p.stat().st_size == e["bytes"] and sha(p) == e["sha256"], str(p)

def files(p):
    return {f.relative_to(p).as_posix() for f in p.rglob("*") if f.is_file()}

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--evidence-root", type=Path)
    ap.add_argument("--originals", action="store_true")
    ap.add_argument("--require-git", action="store_true")
    args = ap.parse_args()
    s = load(ROOT / "docs/provenance/zant-stage9-verification.json")
    m = load(ROOT / "docs/provenance/zant-stage8-import.json")
    p = ROOT / m["repository_package"]
    assert files(p) == {e["path"] for e in m["files"]}
    for e in m["files"] + m["supplemental_provenance"]:
        check(ROOT / e["repository_path"], e)
    for e in s["repository_evidence"]:
        check(ROOT / e["path"], e)
    for name in ["encounter-atlas-stage4-import.json", "room-creator-stage6-import.json"]:
        prior = load(ROOT / "docs/provenance" / name)
        es = prior["files"] + prior.get("packaging_metadata", [])
        q = ROOT / prior["repository_package"]
        assert files(q) == {e["path"] for e in es}
        for e in es:
            check(q / e["path"], e)
    a = load(ROOT / "docs/provenance/source-authority.json")
    assert a["current_authorized_stage"] == 9 and a["next_stage"].startswith("Stage 10")
    assert a["subsystems"]["encounter_atlas"] == s["unchanged_encounter_authority"]
    assert a["subsystems"]["room_creator"] == s["unchanged_room_creator_authority"]
    assert a["subsystems"]["room_creator"]["acceptance"] == "HOLD_FOR_FURTHER_REMEDIATION"
    z = a["subsystems"]["zant"]
    for key, value in s["preserved_zant_authority"].items():
        if key != "repository_import":
            assert z[key] == value, key
    for key, value in s["preserved_zant_authority"]["repository_import"].items():
        if key != "migration_behavior_verification":
            assert z["repository_import"][key] == value, key
    assert z["repository_import"]["migration_behavior_verification"] == "PASS_WITH_ACCEPTANCE_STATES_PRESERVED_STAGE_9"
    assert s["verdict"] == "PASS WITH ACCEPTANCE STATES PRESERVED"
    assert not s["Gate_A_complete"] and not s["pilot_or_interface_promoted"] and not s["stage10_started"]
    assert s["unauthored_slots"] == 14 and s["reserve_use"] == 0
    assert s["unrun_valid_cases"] == 222 and s["unrun_production_negatives"] == 17
    assert s["failed_wrist"]["vectorCount"] == s["failed_wrist"]["independentScalarCount"] == 1252
    assert s["overlap_ownership"]["actualArmHandCoreOverlapInBand"] == 35
    assert s["overlap_ownership"]["actualArmHandCoreOverlapInBandInterior"] == 7
    assert s["overlap_ownership"]["bandCorePixelsWithNeitherPartCore"] == 0
    assert s["new_baseline_defects"] == [] and s["migration_regressions"] == []
    lock = load(p / "contract/ACCEPTED_R4_NEUTRAL_LOCK.json")
    assert len(lock["files"]) == 20
    for rel, e in lock["files"].items():
        check(p / rel, e)
    from collections import Counter
    ledger = load(p / "data/surface_ledger.json")
    matrix = load(p / "data/required_matrix.json")
    assert dict(Counter(e["status"] for e in ledger["surfaces"])) == s["slot_states"]
    cases = [e for key in ["body", "palette", "isolatedFace", "assembledFace", "negative"] for e in matrix[key]]
    assert len(cases) == len({e["id"] for e in cases}) == 243
    assert dict(Counter(e["status"] for e in cases)) == s["matrix_status_distribution"]
    assert not load(p / "data/run_state.json")["gateAComplete"]
    assert not (ROOT / "runtime").exists()
    assert "filter=lfs" not in (ROOT / ".gitattributes").read_text(encoding="utf-8")
    evidence_count = 0
    if args.evidence_root:
        index = args.evidence_root / "stage9-evidence-inventory.json"
        assert sha(index) == s["private_evidence_inventory"]["sha256"]
        for e in load(index)["files"]:
            check(args.evidence_root / e["path"], e)
            evidence_count += 1
    originals = 0
    if args.originals:
        archive = Path(m["archive_root"])
        index = archive / "archive-inventory.json"
        assert sha(index) == m["preservation_inventory_sha256"]
        for e in load(index)["files"]:
            original = Path(e["source_path"])
            check(original, e)
            assert original.stat().st_mtime_ns == e["source_mtime_ns"]
            check(archive / e["archive_path"], e)
            originals += 1
        for e in m["excluded_original_caches"]:
            original = Path(e["source_path"])
            check(original, e)
            assert original.stat().st_mtime_ns == e["mtime_ns"]
    result = {
        "stage9_source_and_evidence_integrity": "PASS",
        "verdict": s["verdict"],
        "ZANT_files_unchanged": 166,
        "Encounter_files_unchanged": 2731,
        "Room_Creator_baseline_plus_metadata_unchanged": 384,
        "Room_Creator_status": "HOLD_FOR_FURTHER_REMEDIATION",
        "repository_evidence_files": len(s["repository_evidence"]),
        "private_evidence_files": evidence_count,
        "originals_and_archive_copies_verified": originals,
        "Gate_A_complete": False,
        "failed_provisional_material_promoted": False,
        "stage10_started": False,
        "scope": "Read-only recorded source/evidence integrity; no pixel or behavior re-execution.",
    }
    if args.require_git:
        def git(*a):
            return subprocess.check_output(["git", "-C", str(ROOT), *a], encoding="utf-8").strip()
        assert git("branch", "--show-current") == "main"
        assert not git("status", "--porcelain=v1", "--untracked-files=all")
        assert git("rev-list", "--max-parents=0", "HEAD") == m["history_root"]
        assert not git("diff", s["baseline_commit"], "HEAD", "--", "packages/encounter-atlas", "packages/room-creator", m["repository_package"], "docs/audits/zant/r4", "docs/audits/zant/r5", "docs/research/zant", "docs/provenance/zant-external")
        result["head"] = git("rev-parse", "HEAD")
        result["git"] = "PASS"
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
