"""Verify the Stage 10 curated checkout and exact historical reconstruction bindings."""
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
    return {q.relative_to(p).as_posix() for q in p.rglob("*") if q.is_file()}

def digest(o):
    return hashlib.sha256(json.dumps(o, sort_keys=True, separators=(",", ":")).encode()).hexdigest()

def tree(es):
    return digest(sorted([{"path":e["path"],"bytes":e["bytes"],"sha256":e["sha256"]} for e in es], key=lambda e:e["path"]))

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--evidence-root", type=Path)
    ap.add_argument("--check-external", action="store_true")
    ap.add_argument("--require-git", action="store_true")
    args = ap.parse_args()
    m = load(ROOT / "docs/provenance/stage10-cleanup-manifest.json")
    removed = {e["path"]:e for e in m["removals"]}
    assert len(removed) == 271 and sum(e["bytes"] for e in removed.values()) == 46310805
    assert all(p.startswith("packages/encounter-atlas/evidence/atlas-a1/inherited/") for p in removed)
    a1 = load(ROOT / "docs/provenance/encounter-atlas-stage4-import.json")
    pkg = ROOT / a1["repository_package"]
    prefix = a1["repository_package"] + "/"
    assert files(pkg) == {e["path"] for e in a1["files"] if prefix+e["path"] not in removed}
    old_records, current_records = [], []
    for e in a1["files"]:
        rel = prefix + e["path"]
        if rel in removed:
            deletion = removed[rel]
            assert not (ROOT / rel).exists()
            assert deletion["bytes"] == e["bytes"] and deletion["sha256"] == e["sha256"]
            replacement = ROOT / deletion["retained_duplicate"]
            assert replacement.resolve().is_relative_to(ROOT)
            assert deletion["retained_duplicate"] not in removed
            check(replacement, e)
        else:
            check(pkg / e["path"], e)
            current_records.append(e)
        old_records.append(e)
    # Full historical identity is reconstructed from actual retained bytes, never weakened.
    assert tree(old_records) == m["projection"]["A1_before_tree_sha256"]
    assert tree(current_records) == m["projection"]["A1_after_tree_sha256"]
    assert len(current_records) == 2460 and sum(e["bytes"] for e in current_records) == 376487390
    locked = load(pkg / "historical/Encounter_AR0_Atlas_Readiness_Checkpoint_R1.identity.json")
    assert len(locked["files"]) == 2310
    for e in locked["files"]:
        assert prefix + e["path"] not in removed
        check(pkg / e["path"], e)
    source = load(ROOT / "docs/provenance/source-fingerprints.json")["encounter_a1"]
    assert len(source["inputs"]) == 132
    for e in source["inputs"]:
        assert prefix + e["path"] not in removed
        assert sha(pkg / e["path"]) == e["sha256"]
    assert digest(source["inputs"]) == source["source_digest"]
    rc = load(ROOT / "docs/provenance/room-creator-stage6-import.json")
    rp = ROOT / rc["repository_package"]
    entries = rc["files"] + rc["packaging_metadata"]
    assert files(rp) == {e["path"] for e in entries}
    for e in entries:
        check(rp / e["path"], e)
    z = load(ROOT / "docs/provenance/zant-stage8-import.json")
    zp = ROOT / z["repository_package"]
    assert files(zp) == {e["path"] for e in z["files"]}
    for e in z["files"] + z["supplemental_provenance"]:
        check(ROOT / e["repository_path"], e)
    assert not load(zp / "data/run_state.json")["gateAComplete"]
    s9 = load(ROOT / "docs/provenance/zant-stage9-verification.json")
    for e in s9["repository_evidence"]:
        check(ROOT / e["path"], e)
    for e in m["verification_records"]:
        check(ROOT / e["path"], e)
    a = load(ROOT / "docs/provenance/source-authority.json")
    assert a["current_authorized_stage"] == 10 and a["next_stage"].startswith("Stage 11")
    assert digest(a["subsystems"]) == m["preserved_subsystems_authority_sha256"]
    assert sha(ROOT / "docs/provenance/known-defects.json") == m["preserved_known_defects_sha256"]
    assert sha(ROOT / "docs/provenance/STATUS_INTERPRETATION.md") == m["preserved_status_interpretation_sha256"]
    assert a["subsystems"]["room_creator"]["acceptance"] == "HOLD_FOR_FURTHER_REMEDIATION"
    assert a["subsystems"]["zant"]["neutral_acceptance"] == "OWNER_ACCEPTED_R4_CANDIDATE02"
    assert a["subsystems"]["zant"]["current_work_acceptance"] == "GATE_A_FAILED_AT_G_SLEEVE_PILOT"
    assert m["verdict"] == "PASS WITH RETAINED NECESSARY DUPLICATION" and not m["stage11_started"]
    assert not (ROOT / "runtime").exists()
    assert "filter=lfs" not in (ROOT / ".gitattributes").read_text(encoding="utf-8")
    external = 0
    if args.check_external:
        for e in removed.values():
            check(Path(e["external_original"]), e)
            check(Path(e["external_archive"]), e)
            external += 1
    evidence_count = 0
    if args.evidence_root:
        p = args.evidence_root / "stage10-evidence-inventory.json"
        assert sha(p) == m["private_evidence_inventory"]["sha256"]
        for e in load(p)["files"]:
            check(args.evidence_root / e["path"], e)
            evidence_count += 1
        if args.check_external:
            guard = load(args.evidence_root / "inputs/external-archive-metadata-before.json")
            archive = Path(m["external_preservation_root"])
            actual = {str(p) for p in archive.rglob("*") if p.is_file()}
            assert actual == {e["path"] for e in guard}
            for e in guard:
                stat = Path(e["path"]).stat()
                assert stat.st_size == e["bytes"] and stat.st_mtime_ns == e["mtime_ns"]
    result = {"stage10_cleanup_integrity":"PASS","verdict":m["verdict"],
              "removed_files":271,"removed_bytes":46310805,"A1_current_files":2460,
              "A1_historical_files_reconstructible_from_retained_bytes":2731,
              "A1_source_inputs_unchanged":132,"AR0_R1_dependency_members_unchanged":2310,
              "Room_Creator_baseline_plus_metadata_unchanged":384,"ZANT_files_unchanged":166,
              "acceptance_and_known_defect_records_unchanged":True,
              "external_removal_bindings_checked":external,"private_evidence_files":evidence_count,
              "stage11_started":False,"scope":"Read-only curated membership/hash/status/evidence integrity."}
    if args.require_git:
        def git(*a):
            return subprocess.check_output(["git","-C",str(ROOT),*a], encoding="utf-8").strip()
        assert git("branch","--show-current") == "main"
        assert not git("status","--porcelain=v1","--untracked-files=all")
        assert git("rev-list","--max-parents=0","HEAD") == m["history_root"]
        changes = git("diff","--name-status",m["baseline_commit"],"HEAD","--","packages/encounter-atlas").splitlines()
        assert len(changes) == 271 and all(s.startswith("D\t") for s in changes)
        assert {s.split("\t",1)[1] for s in changes} == set(removed)
        assert not git("diff",m["baseline_commit"],"HEAD","--","packages/room-creator","packages/zant/C001_ZANT_GATE_A_R5")
        result["head"] = git("rev-parse","HEAD")
        result["git"] = "PASS"
    print(json.dumps(result,indent=2))

if __name__ == "__main__":
    main()
