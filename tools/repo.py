"""Fresh-clone checks. Package commands execute only in retained disposable copies."""
import argparse
import json
import os
from pathlib import Path
import platform
import re
import shutil
import socket
import subprocess
import sys
import tempfile
import time

from repository_integrity import ROOT, verify
from verify_stage10_cleanup import load, sha

PACKAGES = {
    "encounter-atlas": "packages/encounter-atlas",
    "room-creator": "packages/room-creator",
    "zant": "packages/zant/C001_ZANT_GATE_A_R5",
}
LIBRARY_SHA = "4cf39cb712d55e866a593ad12394efec891d5ae3ac14dfd35d932b32bd8b1241"


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def doctor(target, library):
    needs_node = target in ("doctor", "encounter-atlas", "room-creator", "all")
    require(sys.version_info[:2] == (3, 12), "Use Python 3.12.x; see DEVELOPMENT.md")
    node = shutil.which("node")
    node_version = subprocess.check_output([node, "--version"], text=True).strip() if node else None
    if needs_node:
        require(node_version and re.match(r"^v24\.", node_version),
                "Node 24.x must be on PATH; no npm install is needed. See DEVELOPMENT.md")
    package_records = [{"name": name, "path": rel, "present": (ROOT / rel).is_dir()}
                       for name, rel in PACKAGES.items()]
    require(all(p["present"] for p in package_records), "Package missing: use a full clone/export")
    supplied = library or os.environ.get("FIRST_ENCOUNTER_ROOM_LIBRARY_ZIP")
    external = {"room_creator_library": "NOT_CONFIGURED_OPTIONAL",
                "needed_for_bounded_checks": False,
                "archive_replays": "OPTIONAL_PROVENANCE_ONLY; not accessed",
                "browser": "OPTIONAL; Playwright 1.56.0 and compatible Chrome for historical browser audits"}
    if supplied:
        path = Path(supplied).expanduser().resolve()
        require(path.is_file(), f"Configured Room Creator library ZIP is missing: {path}")
        require(path.stat().st_size == 178595688 and sha(path) == LIBRARY_SHA,
                f"Room Creator library ZIP identity mismatch: {path}")
        external["room_creator_library"] = "VERIFIED_READ_ONLY_ZIP"
        external["configured_zip"] = str(path)
    return {"python": platform.python_version(), "node": node_version, "platform": platform.platform(),
            "packages": package_records, "external_dependencies": external}


def tap(text, expected):
    values = {}
    for key in ("tests", "pass", "fail", "skipped"):
        matches = re.findall(r"^# " + key + r" (\d+)\s*$", text, re.M)
        require(bool(matches), f"TAP summary missing: {key}")
        values[key] = int(matches[-1])
    require(values == expected, f"Unexpected TAP result: {values}; expected {expected}")
    return values


class Run:
    def __init__(self, output):
        self.output = output
        self.records = []
        self.env = dict(os.environ, PYTHONUTF8="1", PYTHONDONTWRITEBYTECODE="1")
        self.env.pop("NODE_OPTIONS", None)  # Do not inherit local test/loader injection.

    def command(self, name, args, cwd, expected_exit=0):
        log = self.output / (name + ".log")
        print("START " + name, flush=True)
        started = time.monotonic()
        try:
            with log.open("w", encoding="utf-8", newline="\n") as stream:
                result = subprocess.run([str(a) for a in args], cwd=cwd, env=self.env,
                                        stdout=stream, stderr=subprocess.STDOUT, timeout=600)
            code = result.returncode
        except subprocess.TimeoutExpired:
            code = "TIMEOUT"
        self.records.append({"name": name, "exit_code": code, "expected_exit": expected_exit,
                             "seconds": round(time.monotonic() - started, 3),
                             "log": log.name, "log_sha256": sha(log)})
        (self.output / "commands.json").write_text(json.dumps(self.records, indent=2) + "\n", encoding="utf-8")
        if code != expected_exit:
            print("\n".join(log.read_text(encoding="utf-8").splitlines()[-60:]), flush=True)
        require(code == expected_exit, f"{name}: exit {code}; inspect {log}")
        return log.read_text(encoding="utf-8")


def encounter(run):
    home = run.output / "encounter"
    home.mkdir()
    pkg = home / "checkpoint"
    shutil.copytree(ROOT / PACKAGES["encounter-atlas"], pkg)
    (home / "evidence").mkdir()
    harness = home / "ATLAS_A1_Independent_Adversarial_Tests.test.mjs"
    shutil.copy2(ROOT / "tools/encounter-atlas-independent" / harness.name, harness)
    node = shutil.which("node")
    supplied = tap(run.command("a1-supplied", [node, "--test", "--test-reporter=tap",
                   *sorted((pkg / "tests").glob("*.test.mjs"))], pkg),
                   {"tests": 224, "pass": 224, "fail": 0, "skipped": 0})
    builds = {}
    for script, path, expected in (
        ("build-m3.mjs", "dist-m3/index.html", "8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb"),
        ("build-atlas-a1.mjs", "dist-atlas-a1/index.html", "b9612d61f41bcf2bee5085902ff65c5e418b226de3dd5c8af6490ccd15e4ae9f"),
    ):
        run.command("a1-" + script, [node, "scripts/" + script], pkg)
        builds[path] = sha(pkg / path)
        require(builds[path] == expected, "Build fingerprint changed: " + path)
    run.command("a1-proofs", [node, "scripts/generate-atlas-a1-evidence.mjs"], pkg)
    proof_paths = sorted((ROOT / PACKAGES["encounter-atlas"] / "proofs/atlas-a1").rglob("*"))
    proof_paths = [p for p in proof_paths if p.is_file()]
    require(len(proof_paths) == 12, "Unexpected proof membership")
    for p in proof_paths:
        require(sha(pkg / p.relative_to(ROOT / PACKAGES["encounter-atlas"])) == sha(p),
                "Regenerated proof changed: " + p.name)
    for name in ("preserve-atlas-a1.py", "identity-atlas-a1.py"):
        run.command("a1-" + name, [sys.executable, "-B", "scripts/" + name], pkg)
    source = load(pkg / "evidence/atlas-a1/source-identity.json")
    expected = load(ROOT / "docs/provenance/source-fingerprints.json")["encounter_a1"]
    require(source["sourceDigest"] == expected["source_digest"] and len(source["files"]) == 132,
            "Encounter execution identity changed")
    independent = tap(run.command("a1-independent", [node, "--test", "--test-reporter=tap", harness], home),
                      {"tests": 21, "pass": 21, "fail": 0, "skipped": 0})
    ir3_text = run.command("a1-ir3-known-limitation",
                          [node, "--test", "--test-reporter=tap", "scripts/run-independent-m3-r3.mjs"],
                          pkg, expected_exit=1)
    ir3 = tap(ir3_text, {"tests": 25, "pass": 24, "fail": 1, "skipped": 0})
    failures = re.findall(r"^not ok \d+ - (.+)$", ir3_text, re.M)
    require(len(failures) == 1 and "IR3-25" in failures[0],
            "Only the documented IR3-25 failure is allowed")
    return {"verification": "PASS_WITH_DOCUMENTED_KNOWN_LIMITATION", "supplied": supplied,
            "independent": independent, "IR3_actual_failure_preserved": ir3,
            "build_sha256": builds, "regenerated_proofs_byte_identical": 12,
            "source_inputs": 132, "source_digest": source["sourceDigest"],
            "product_acceptance": "ACCEPTED_ATLAS_A1_WITH_PRESERVED_ENCOUNTER_DEPENDENCIES"}


def room(run, port):
    pkg = run.output / "room-creator"
    shutil.copytree(ROOT / PACKAGES["room-creator"], pkg)
    # The preserved runner needs a loopback port even for its Node-only suite.
    if port == 0:
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
    run.command("room-node", [sys.executable, "-B", "tests/run_tests.py", "--suite", "node",
                            "--out", run.output / "room-node", "--port", port], pkg)
    entries = load(run.output / "room-node/run-index.json")
    require(len(entries) == 12 and all(e["exitCode"] == 0 for e in entries),
            "Room Creator expected 11 Node suites plus build reproduction")
    counts = []
    for e in entries:
        if e["script"].endswith(".test.js"):
            text = (run.output / "room-node" / e["log"]).read_text(encoding="utf-8")
            matches = re.findall(r"(\d+) passed, (\d+) failed", text)
            if not matches:
                matches = re.findall(r'"passed"\s*:\s*(\d+),\s*"failed"\s*:\s*(\d+)', text)
            require(len(matches) == 1, "Room suite count missing: " + e["script"])
            passed, failed = map(int, matches[0])
            require(failed == 0, "Room Creator assertion failure")
            counts.append({"suite": e["script"], "passed": passed, "failed": failed})
    require(len(counts) == 11 and sum(e["passed"] for e in counts) == 308,
            "Room Creator assertion inventory changed")
    run.command("room-build", [sys.executable, "-B", "source/build.py"], pkg)
    built = sha(pkg / "Room_Creator.html")
    require(built == "a4e8a14ddc4d734c036902f56b1a7d7bb8a157a77ef3911b97ea70c76f228c97",
            "Room Creator build changed")
    return {"verification": "PASS_WITH_HOLD_PRESERVED", "node_suites": counts,
            "assertions": 308, "LF_CRLF_build_reproduction": "PASS", "build_sha256": built,
            "product_acceptance": "HOLD_FOR_FURTHER_REMEDIATION",
            "browser_and_external_library_checks": "NOT_RUN_OPTIONAL",
            "known_asset_repair_warning_defect": "UNRESOLVED; Stage 7 audit remains authoritative"}


def zant(run):
    pkg = run.output / "zant"
    shutil.copytree(ROOT / PACKAGES["zant"], pkg)
    run.command("zant-portable", [sys.executable, "-B", "validation/verify_checkpoint.py",
                                "--out", run.output / "zant-replay"], pkg)
    result = load(run.output / "zant-replay/verification.json")
    require(result["auditIntegrity"] == "PASS" and
            result["gateAVerdict"] == "GATE_A_FAILED_AT_G_SLEEVE_PILOT", "Unexpected ZANT status")
    require(len(result["replayedEvidenceRenders"]) == 4 and
            result["failedSharedWristPixelsBeyondDeclaredBand"] == 1252, "ZANT replay changed")
    return {"verification": "PASS_WITH_ACCEPTANCE_STATES_PRESERVED",
            "evidence_replays": 4, "gateAVerdict": result["gateAVerdict"],
            "Gate_A_complete": False, "failed_wrist_pixels": 1252,
            "details": "zant-replay/verification.json"}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("target", choices=["doctor", "integrity", *PACKAGES, "all"])
    ap.add_argument("--out", type=Path, help="NEW directory outside the checkout; default OS temporary directory")
    ap.add_argument("--room-library-zip", help="Optional read-only identity check; or FIRST_ENCOUNTER_ROOM_LIBRARY_ZIP")
    ap.add_argument("--port", type=int, default=0, help="Room runner loopback port; 0 chooses an available port")
    args = ap.parse_args()
    require(not sys.flags.optimize, "Do not use Python -O: integrity assertions must remain enabled")
    env = doctor(args.target, args.room_library_zip)
    if args.target == "doctor":
        print(json.dumps(env, indent=2))
        return
    integrity = verify()
    if args.target == "integrity":
        print(json.dumps(integrity, indent=2))
        return
    output = args.out.expanduser().resolve() if args.out else Path(tempfile.mkdtemp(prefix="first-encounter-check-"))
    require(not output.is_relative_to(ROOT) and not ROOT.is_relative_to(output),
            "--out must be outside the checkout and cannot be its ancestor")
    if args.out:
        output.mkdir(parents=True, exist_ok=False)
    print("Disposable outputs retained at " + str(output), flush=True)
    run = Run(output)
    report = {"environment": env, "integrity_before": integrity, "results": {}, "output": str(output)}
    try:
        targets = list(PACKAGES) if args.target == "all" else [args.target]
        for target in targets:
            report["results"][target] = (encounter(run) if target == "encounter-atlas" else
                                         room(run, args.port) if target == "room-creator" else zant(run))
        report["integrity_after"] = verify()
        report["result"] = "PASS_WITH_PRESERVED_PRODUCT_STATES"
    except Exception as error:
        report["result"] = "FAIL"
        report["error"] = str(error)
        raise
    finally:
        (output / "summary.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
        print("Report: " + str(output / "summary.json"), flush=True)
    print(json.dumps(report["results"], indent=2))


if __name__ == "__main__":
    try:
        main()
    except (Exception, KeyboardInterrupt) as error:
        print("ERROR: " + str(error), file=sys.stderr)
        sys.exit(1)
