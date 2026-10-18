# M2 — Fresh test results and scope

Date: 2026-10-17 (America/New_York). **M2 is complete for independent testing; work stops here.** These are builder results, including unchanged tester-supplied tests. They are not an independent M2 acceptance verdict.

## Exact review target and baseline

New frozen export: **Encounter_M2_Checkpoint.zip**. Adjacent **Encounter_M2_Checkpoint.identity.json** supplies the archive SHA-256, complete member sizes/hashes, source identity, content revision and R2 baseline identity. Its own archive hash stays external to avoid a self-reference. The expanded source folder is a convenience copy; review the frozen ZIP.

- Code revision: **M2-runtime-v1**. Source digest: **907e4ec682172e90f2c3b0b0d78ec43ade848d8bcace1fbe6775301aefc43731**. Algorithm and 27 hashed package/source/content/test/tool entries: `scripts/source-identity.py`, `evidence/M2_source_identity.json`.
- Scenario/content: **M2-paperwork-v1**, package `package_0002` revision 1, canonical content SHA-256 **6dde071b2d6e6b280ca9ba6ce929bbdd1b42f4f128deba818fc1c32dd2b8e115**.
- Exact approved baseline: `Encounter_M0_M1_Checkpoint_R2.zip`, 584,636 bytes, SHA-256 **47a879c74ac7f684ff5d3d7d1de742d800d8d5cd801fe833234707ec66be555d**. All 35 archive members were verified before a fresh extraction; four R2 core modules remain unchanged.
- Independent R2 review: **READY FOR M2**, supplied review/evidence read before integration. Evidence ZIP SHA-256 **f758045250da945cb521ae22277c289a8e52055eaa5a347ff5f40f626002f46a**. Copies are preserved under `independent/`. This verdict applies only to the exact R2 checkpoint.
- Unchanged tester test source SHA-256: **c591b4366097e77da7d21b4ddb861161a6ee3e71e9bc2af15acf5f1393ba4651**.

## Fresh execution

Windows 11 build 26200 / PowerShell; Node **v24.18.0**, npm **11.16.0**, Python **3.12.0**. Browser: Codex in-app Chromium. No dependencies were installed. Static build is 78,995 bytes and contains ten bundled modules, styles and fixture content.

| Suite | Passed | Failed | Fresh log |
|---|---:|---:|---|
| M0 legacy non-DOM audit | 7 | 0 | `evidence/M2_M0_baseline_checks.txt` |
| Builder tests: preserved M1 38 + integrated M2 26 | 64 | 0 | `evidence/M2_M1_M2_tests.tap` |
| Unchanged tester-supplied M1 suite | 22 | 0 | `evidence/M2_tester_supplied_tests.tap` |
| Recorded browser checks | 12 | 0 | `evidence/M2_Browser_Checks.json` |

All suites exited 0, with no skipped/cancelled automated tests. Some cases contain matrices (all 18 act/vibe/salience compositions, nine protected first requests, private-selector comparisons); those are not counted as additional tests. The 7 M0 checks include demonstrating a legacy public-view weakness, not approving that old view for the new runtime. Historical 253/29 totals are not new results.

Exact executable paths, working directory, arguments, environment binding, stdout/stderr and exit codes are captured in `evidence/M2_executed_commands.json` and the corresponding logs. Version checks are in `evidence/M2_environment.json`.

Executed from the M2 root:

```powershell
node scripts/build.mjs
python scripts/source-identity.py
node scripts/audit-baseline.cjs
node --test --test-reporter=tap tests/*.test.mjs
$env:ENCOUNTER_CHECKPOINT = (Get-Location).Path
node --test --test-reporter=tap independent/M1_Independent_Contract_Tests.test.mjs
node scripts/generate-evidence.mjs
```

After freezing, archive verification, fresh-extraction checks, deterministic rebuild and all three automated suites are recorded externally in **Encounter_M2_Checkpoint_Verification.json** and its adjacent logs. These reruns confirm packaging; they do not add distinct test cases.

## Required coverage

| Requirement | Executed coverage |
|---|---|
| Compose/preview/Send → Intake → Delivery → control | M2-01/02 plus actual browser path; draft edits leave revision 0 |
| Semantic BASED and prominence-only salience | M2-03/04, both acts × three vibes × three saliences |
| Protected first request and initial keyword/menu secrecy | M2-05/06, all nine expressions; no initial split, signature or contact value |
| Permission versus deliberate inspection | M2-07/08, separate committed command and actual filtered result |
| Visible conduct versus small print | M2-08/09, player reading observation versus clerk sight observation; later hearing creates claim |
| Claims distinct from facts/private motive | M2-09, canonical request unchanged, no synthesized belief/hypothesis |
| Source-link secrecy, hidden truth perturbation | M2-10/14, real source/decision paths |
| Incoming selector/provenance isolation | M2-13/26, equal full paths with different private selections; actual filtered policy input |
| Single result application; retry/conflict/stale safety | M2-11/12 plus preserved M1 and tester D01 regressions |
| Read-only inspector/render/replay/skip | M2-15 plus byte-identical browser save before/after |
| Missing art/final wording fallbacks | M2-16; authored optional presentation fields are all null; browser uses readable descriptions |
| Failed technical command versus received social refusal | M2-17/18 |
| Portability without literal scenario names or fixed actor IDs | M2-19 renamed neutral package end to end |
| Validated package/run persistence; legacy refusal | M2-20/21 plus browser round-trip and invalid import |
| Soft reminder only; no closure | M2-22, 25 committed messages and no time/playback effect |
| Exact R2 modules preserved; extensible catalog; unsupported exchange explicit | M2-23/24/25 |

## Browser evidence and actual generated run

The browser exercised the complete Compassionate/Overt path at `http://127.0.0.1:8765/`, served by `python scripts/serve.py`. The first request produced a limited inspection permission. A separate physical command revealed the unfilled signature to the player; the clerk received conduct only. A new follow-up produced an acknowledgment of the received report and offered verification. Material custody/ownership, quantity and money did not change.

Screenshots `evidence/M2_Browser_Initial.jpg` and `M2_Browser_Complete.jpg` were visually inspected. The actual browser Save run JSON was downloaded and compared to its displayed export. UI replay, skip and inspector refresh preserved the exact saved run. Valid import restored revision 3; invalid legacy import left it unchanged with a compatibility notice. Twelve recorded browser checks passed, with no captured warning/error console entries.

`M2_Interaction_Run.json` is that browser export: `run_0002`, revision 3, three commands, four messages, ten observations, one claim, one permission, one performed result and two decisions. SHA-256 **68c24d368d797787666aa892d41c6edf54f0363e597a00b39a7bb6464e3ceb4f**. `scripts/generate-evidence.mjs` validates/replays it, renders actual bound previews, Intake/Delivery, result recipients and committed changes into **M2_Interaction_Transcript.md**, and produces **M2_Inspector_Trace.json**. It asserts equality with the actual browser inspector export. These are generated evidence for the same run, not a hand-written example.

## Preservation and practical limits

All original reference files, original R1/R2 archives/identities and their expanded checkpoint contents remain unchanged. The new M2 copy preserves the M0 plan, original tests, unchanged tester sources and all four R2 core modules. `evidence/M2_source_preservation.json` records fresh comparisons. Historical M1 evidence is retained by filename and is not counted as fresh M2 execution.

One initial M2 test run had 25 pass/1 fail because the R2 reference identity had not yet been copied into the new folder (a working-directory mistake). The missing reference was copied; all 26 M2 tests then passed and the final full 64-test run passed. No production logic or assertion was weakened. One UI test initially used the wrong import-button label; selecting the observed **Load this run** control completed the check. Initial sandbox server/network restrictions required relaunching the same loopback-only server through approved execution. These were setup/test-driver issues, not remaining gameplay defects.

The browser's URL policy blocked the direct `file:` launch check. No workaround was attempted. Localhost launch was verified; universal double-click behavior is not promised. Browser coverage is this one desktop Chromium surface, not a multi-browser, mobile or assistive-technology certification. Text performances are skeletons. The retained M1 JSON bounds are 32 levels / 1 MiB per canonicalized value; arbitrarily long sessions are not claimed. Manual saves are the persistence path; close/restart without saving loses the current run. Save/package author exports contain synthetic hidden fixture truth and are not encrypted. Logical actor access is enforced by projections and observations.

No known defect remains in the exercised M2 scope. Independent M2 review has not yet occurred. Full master 69 acceptance tests, all 360 BASED cases, original historical browser suite, future scenario/recovery/transaction flows, NPC initiation and M3+ systems were not run or claimed as implemented.

## Completed

Exact R2 baseline verification and M1 gate clearance; runnable static browser build/source; connected ordinary paperwork interaction; three semantic expressions and salience; protected first request; pure preview; filtered permission/action/result/claim path; deterministic listener-local response; separate text Intake/Delivery; read-only inspector; validated manual save/load; neutral portability test; fresh M0/M1/M2/tester tests; actual generated transcript/trace; new frozen M2 identity.

## Partial

None of the required M2 connected path remains partial. Finished art/dialogue, the other four player acts and seventeen authored expressions belong to later authorized coverage. The registries preserve the full target rather than treating those future features as implemented.

## Blocked

No functional M2 blocker. Direct-file launch verification is unavailable in the test browser; the verified localhost launch is supplied.

## Deferred

M3 and later; restriction/repair/warning/collection closure and its missing-preview fallback; final case recovery; full Seed B negotiation and exact material confirmation; NPC initiation; full Assembler/live authoring; full belief/hypothesis machinery; all 69/360 coverage; combat/theft/stealth; runtime generative AI; old-save conversion. No additional agent was launched.

## Design questions discovered

No new owner decision is needed to review this M2 path. The already-flagged missing-preview closure fallback still requires owner confirmation before M3. Later work should explicitly revisit session-size limits and broader content/act support under new scope. M2 implements neither closure nor a partial approximation.
