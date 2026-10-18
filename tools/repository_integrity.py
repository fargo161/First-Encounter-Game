"""Read-only current checkout integrity; historical verifier files stay frozen."""
from pathlib import Path
from verify_stage10_cleanup import load, sha, check, files, digest, tree

ROOT = Path(__file__).resolve().parents[1]


def verify():
    m = load(ROOT / "docs/provenance/stage10-cleanup-manifest.json")
    removed = {e["path"]: e for e in m["removals"]}
    assert len(removed) == 271 and sum(e["bytes"] for e in removed.values()) == 46310805
    assert all(p.startswith("packages/encounter-atlas/evidence/atlas-a1/inherited/") for p in removed)
    a1 = load(ROOT / "docs/provenance/encounter-atlas-stage4-import.json")
    pkg = ROOT / a1["repository_package"]
    prefix = a1["repository_package"] + "/"
    current = [e for e in a1["files"] if prefix + e["path"] not in removed]
    assert files(pkg) == {e["path"] for e in current}, "Encounter membership changed"
    for e in a1["files"]:
        rel = prefix + e["path"]
        if rel in removed:
            d = removed[rel]
            assert not (ROOT / rel).exists(), rel
            assert (d["bytes"], d["sha256"]) == (e["bytes"], e["sha256"])
            replacement = ROOT / d["retained_duplicate"]
            assert replacement.resolve().is_relative_to(ROOT)
            assert d["retained_duplicate"] not in removed
            check(replacement, e)
        else:
            check(pkg / e["path"], e)
    assert tree(a1["files"]) == m["projection"]["A1_before_tree_sha256"]
    assert tree(current) == m["projection"]["A1_after_tree_sha256"]
    assert len(current) == 2460 and sum(e["bytes"] for e in current) == 376487390
    locked = load(pkg / "historical/Encounter_AR0_Atlas_Readiness_Checkpoint_R1.identity.json")
    assert len(locked["files"]) == 2310
    for e in locked["files"]:
        assert prefix + e["path"] not in removed
        check(pkg / e["path"], e)
    source = load(ROOT / "docs/provenance/source-fingerprints.json")["encounter_a1"]
    assert len(source["inputs"]) == 132 and digest(source["inputs"]) == source["source_digest"]
    for e in source["inputs"]:
        assert prefix + e["path"] not in removed
        assert sha(pkg / e["path"]) == e["sha256"], e["path"]
    rc = load(ROOT / "docs/provenance/room-creator-stage6-import.json")
    rp = ROOT / rc["repository_package"]
    rc_entries = rc["files"] + rc["packaging_metadata"]
    assert files(rp) == {e["path"] for e in rc_entries}, "Room Creator membership changed"
    for e in rc_entries:
        check(rp / e["path"], e)
    z = load(ROOT / "docs/provenance/zant-stage8-import.json")
    zp = ROOT / z["repository_package"]
    assert files(zp) == {e["path"] for e in z["files"]}, "ZANT membership changed"
    for e in z["files"] + z["supplemental_provenance"]:
        check(ROOT / e["repository_path"], e)
    assert not load(zp / "data/run_state.json")["gateAComplete"]
    for e in load(ROOT / "docs/provenance/zant-stage9-verification.json")["repository_evidence"]:
        check(ROOT / e["path"], e)
    for e in m["verification_records"]:
        check(ROOT / e["path"], e)
    authority = load(ROOT / "docs/provenance/source-authority.json")
    stage = authority["current_authorized_stage"]
    assert stage in (11, 12)
    assert authority["next_stage"].startswith(f"Stage {stage + 1}")
    assert digest(authority["subsystems"]) == m["preserved_subsystems_authority_sha256"]
    assert sha(ROOT / "docs/provenance/known-defects.json") == m["preserved_known_defects_sha256"]
    assert sha(ROOT / "docs/provenance/STATUS_INTERPRETATION.md") == m["preserved_status_interpretation_sha256"]
    assert m["verdict"] == "PASS WITH RETAINED NECESSARY DUPLICATION" and not m["stage11_started"]
    assert not (ROOT / "runtime").exists()
    assert "filter=lfs" not in (ROOT / ".gitattributes").read_text(encoding="utf-8")
    return {
        "integrity": "PASS", "stage": stage, "removed_duplicates_still_absent": len(removed),
        "encounter_files": len(current), "encounter_tree_sha256": tree(current),
        "encounter_source_inputs": 132, "encounter_source_digest": source["source_digest"],
        "AR0_R1_members": 2310, "historical_A1_reconstructible_files": 2731,
        "room_creator_files": len(rc_entries), "room_creator_baseline_tree_sha256": tree(rc["files"]),
        "zant_files": len(z["files"]), "zant_tree_sha256": tree(z["files"]),
        "acceptance_records_unchanged": True,
        "statuses": {name: {k: v for k, v in record.items() if k in
                     ("acceptance", "neutral_acceptance", "current_work_acceptance")}
                     for name, record in authority["subsystems"].items()},
        "Gate_A_complete": False, "external_archive_access_required": False,
    }
