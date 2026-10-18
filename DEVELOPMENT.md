# Fresh-clone development

Use a full clone of the private canonical repository. Access requires repository permission and GitHub authentication.

    git clone https://github.com/fargo161/First-Encounter-Game.git
    cd First-Encounter-Game
    python -B tools/repo.py doctor
    python -B tools/repo.py integrity
    python -B tools/repo.py all

Run commands from the repository root. On Windows, use python or py -3.12 with Python 3.12.x selected. Put Node 24.x on PATH. No npm install, pip install, private archive, browser or asset library is required for these bounded commands. Wrappers use the Python standard library and existing package scripts; they do not install software.

The supported baseline is Windows with Python 3.12.x and Node 24.x. Stage 11 validates Windows locally and provides Windows CI. Linux/macOS are not certified by this stage. Do not use Python -O, which disables assertions. Allow several minutes, roughly 1 GB of disposable disk space for all checks, and local loopback networking for Room Creator. Git is needed to clone; checks also work without .git in a clean export.

## Commands and outputs

| Root command | Supported work | Successful verification means |
| --- | --- | --- |
| python -B tools/repo.py doctor | Tool versions, three package paths, optional external library identity | Environment located; no acceptance |
| python -B tools/repo.py integrity | Exact package membership/hashes, 132 execution inputs, 2310 dependency members, Stage 10 bindings, authority/defects | Preserved checkout; no archive needed |
| python -B tools/repo.py encounter-atlas | 224 supplied tests, M3/A1 builds, 12 proofs, preservation/identity, 21 independent tests, inherited IR3 | Exactly 24 pass / 1 actual IR3-25 fail / 0 skip in IR3; accepted limitation remains |
| python -B tools/repo.py room-creator | 11 Node suites / 308 assertions, LF/CRLF build reproduction, source build | HOLD_FOR_FURTHER_REMEDIATION remains |
| python -B tools/repo.py zant | Frozen 166-file packet verifier, four RGBA evidence replays | Gate A incomplete; GATE_A_FAILED_AT_G_SLEEVE_PILOT remains |
| python -B tools/repo.py all | Three package checks sequentially | Verification only; no acceptance promotion |

Package commands verify repository integrity, copy the selected package to a disposable directory, run unchanged scripts there, then recheck the canonical checkout. Outputs remain in the printed OS temporary directory; summary.json and commands.json index results and logs. Supply --out followed by a NEW absolute directory outside the checkout to choose its location. Existing directories and destinations inside or containing the checkout are rejected. Outputs are retained for inspection; remove only your own disposable output directory when finished.

A1 uses a checkpoint/evidence sibling layout for its independent harness. The wrapper creates it automatically and expands test globs for Windows. It checks rebuilt HTML/proofs against known hashes and retains the real failing IR3 TAP result. Other failures, changed counts, skipped tests, missing summaries or unexpected exits fail verification.

Room Creator's unchanged Node runner opens a temporary localhost server. The wrapper selects an available port; --port NUMBER overrides it. Port selection has a small bind race: choose an explicit unused port if contention occurs. Package tests/builds write files, so use the root wrapper for supported operations.

ZANT's strict packet rejects extra files, including bytecode/outputs. The wrapper uses Python -B and an output sibling outside the copied packet. PASS means failed-pilot evidence reproduced intact, never art approval.

## External dependencies

None is required for bounded checks or ordinary CI.

Room Creator's optional full asset/browser review needs the separately preserved library ZIP, SHA256 4cf39cb712d55e866a593ad12394efec891d5ae3ac14dfd35d932b32bd8b1241 (178595688 bytes), Playwright 1.56.0 and compatible Chrome. Raw assets remain external with license restrictions, including 29 unverified vehicle-license flags. See [library records](assets/manifests/room-creator-library-v1/) and [Stage 7 testing](docs/testing/STAGE_7_VERIFICATION.md). The known missing-image repair warning defect remains unresolved; Node checks do not rerun independent browser acceptance.

To verify the optional ZIP read-only:

    python -B tools/repo.py doctor --room-library-zip "ABSOLUTE_PATH_TO_LIBRARY_ZIP"

Alternatively set FIRST_ENCOUNTER_ROOM_LIBRARY_ZIP. Unset configuration reports NOT_CONFIGURED_OPTIONAL. An explicitly configured missing/wrong ZIP fails with a clear path/identity error. This hashes the ZIP only; it does not unpack it or execute browser audits. Optional manual replay requires a separate disposable extraction and the historical audit setup. Never write into preserved archives.

Downloads/Desktop/prior-chat paths in source-authority, manifests, archived handoffs and old verifiers are provenance, not normal development configuration. Preserved launchers/historical orchestration may assume original layouts. Root wrappers use paths relative to their own files and OS temporary/configured outputs. Historical full-snapshot verifiers require their recorded commit because Stage 10 removed 271 redundant copies. Do not restore them to satisfy an old checker.

Optional deeper ZANT pixel probes use NumPy/Pillow and the historical audit sibling layout. They are outside the minimum portable command and were not rerun in Stage 11. Original archives and historical browser environments remain separate optional replay dependencies.

## CI and boundaries

[Readiness workflow](.github/workflows/readiness.yml) creates four separate Windows jobs for integrity, Encounter/Atlas, held Room Creator and incomplete ZANT. Jobs have read-only repository permission, a 15-minute timeout, Python 3.12 and Node 24. Action revisions are pinned. No secrets, private archive, dependency install, release or deployment is configured. Job logs show results; disposable runner outputs do not persist after CI. Failures print the failing log tail.

Canonical package files, known-defects.json, STATUS_INTERPRETATION.md, source-fingerprints.json and historical verifier bytes remain unchanged. Encounter governs gameplay grammar. Stop before Stage 12; contracts, remediation, art changes, Unity and LFS require separate authorization.

Workflow action options/revisions were checked against the official [checkout](https://github.com/actions/checkout), [setup-python](https://github.com/actions/setup-python) and [setup-node](https://github.com/actions/setup-node) repositories.
