# Repository safety and verification ledger

Status: P0 local documentation work. Inspection date 2026-10-23, America/New_York. Original [snapshot](evidence/repository-safety-snapshot.json) records exact machine-readable state, prompt identity and preexisting fixture byte hashes. Final verification evidence records preservation separately.

## Initial checkout

| Field | Observed value |
| --- | --- |
| Repository | `First-Encounter-Game`; root `C:\Users\mcdon\Documents\ChatGPT\encounter and rc` |
| Branch | `codex/economy-substrate-v0.1-accepted-baseline` |
| HEAD | `3f348c61b41ed3e5dfbcfb817a9e31f31bda42be` — `docs(economy): record owner-accepted v0.1 baseline` |
| Remote | `origin`, fetch/push URL `https://github.com/fargo161/First-Encounter-Game.git` |
| Tracked files | No initial staged or unstaged changes |
| Untracked prior work | 16 files under `docs/design/store-household-paper-fixture/`, versions v0.2/v0.3 and run-01; all retained byte-for-byte |
| Local tags | None returned by `git tag --list` |
| Worktrees | One local worktree, this root and branch; none created/removed |
| Remote releases / remote branch freshness | Not queried; no claim that no remote releases or newer commits exist. No fetch/push/merge/publication performed |
| Local checkpoints | Current accepted Economy commit above; `17fe7d1b1e2ac4ffc9c4e87527767921d011203d` design lineage; KeyWrapping navigation `22c06dc179e3a0739a5ce1e747d0a46dc114fab5`; exact accepted C1 checkpoint separately pinned by its provenance, not inferred from the branch name |

All new files belong under `docs/design/information-economy-substrate/v0.1/preflight/`. The current request permits those reports; it does not request a commit or a new branch. Remaining on the existing branch avoids moving unrelated untracked work. This does not promote the reports into an accepted baseline.

## Runtime, manifests, CI and supported checks

[Doctor](evidence/doctor.json) observed Windows 11, Python **3.12.0**, Node **v24.18.0**. Python's bundled SQLite is **3.42.0** (snapshot), matching the accepted C1 reference deployment. Root [DEVELOPMENT.md](../../../../../DEVELOPMENT.md) supports Windows/Python 3.12.x/Node 24.x; C1's narrower backend/process-crash qualifications apply to C1 only.

Manifest search found `packages/encounter-atlas/package.json` and `packages/room-creator/tests/requirements.txt`. No root/standalone C1 pyproject, requirements file, npm lockfile or package install step was established. C1 is standard-library-only. The RC requirements belong to optional deeper browser/audit work, not ordinary bounded checks. Optional library ZIP/browser histories were not accessed. No install was needed.

The [readiness workflow](../../../../../.github/workflows/readiness.yml) has four Windows jobs: integrity, Encounter A1, held Room Creator and incomplete ZANT. It pins action revisions, Python 3.12 and Node 24, read-only contents permission and a 15-minute timeout. It adds no C1 or information-economy CI job. CI configuration was inspected; this run did not dispatch or fetch a CI run.

| Command | Scope / expected interpretation |
| --- | --- |
| `python -B tools/repo.py doctor` | Environment/path discovery; no product acceptance |
| `python -B tools/repo.py integrity` | Exact frozen package/input/dependency/Stage 10 checks; retained authority/known defects |
| `python -B tools/repo.py all` | Disposable copies of legacy Encounter/Atlas, Room Creator and ZANT; IR3 must remain actual 24 pass / 1 fail / 0 skip |
| `python -B tools/verify.py --out NEW_EXTERNAL_OUTPUT` from copied C1 source | Existing original27 suite, five process windows, storage faults, 64-operation/refusal measurement and continuity proof |
| `python -B tools/verify_b01.py --out NEW_EXTERNAL_OUTPUT` from copied C1 source | Existing B01 twenty boundary/accounting cases, including seven process interruptions |

These commands reproduce existing tests. Passing them proves their bounded claims only; none tests the not-yet-designed information substrate. Historical negative 0.1.2 replay, headed browser acceptance, private archive replay, power/OS/device failure and broad migration are not rerun or certified.

## Execution evidence

The [Core baseline index](evidence/core-baseline.json) records the disposable copied source, command exits and temporary log/output locators. The [legacy summary](evidence/legacy-baseline.json) retains the wrapper's complete printed result. Detailed generated DBs, screenshots, measurements and package outputs were confined to OS temporary directories, outside canonical packages. The sandbox removed the legacy temporary directory after its command completed, so those detailed raw logs are unavailable; temporary locators must not be mistaken for durable archives. Core compact result summaries and unit log are captured separately while its run exists. See the [final verification index](evidence/final-verification.json) for retained evidence and preservation results.

All package writers run only in copied packages. C1 copy identity is checked against its original 25 source files before execution and canonical bytes again afterward. Final preservation verifies original fixture hashes, unchanged HEAD/branch, empty tracked diff and all twelve required preflight artifacts. No bytecode or generated output is intentionally written into accepted packages.

No Git mutation, remote action, dependency adoption, production source edit, stage-pointer/acceptance rewrite or historical verifier repair is part of P0.
