# M2 Independent Test Report

Date: 2026-10-17 (America/New_York). Independent testing of the supplied M2 checkpoint only.

**Milestone verdict: READY FOR NEXT SCOPE**

The exact checkpoint is verified. The complete M2 browser interaction passed, the supplied transcript and inspector trace were reproduced and compared, and all executed automated checks passed. No correctness defect was observed in the exercised M2 scope. Production source was not modified. Testing stops after M2; this report does not authorize or begin M3 or collection closure.

## 1. Build/checkpoint tested

| Identity | Independently verified value |
|---|---|
| Archive | `Encounter_M2_Checkpoint.zip`, 1,855,021 bytes |
| Archive SHA-256 | `940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7` |
| Matching manifest | `Encounter_M2_Checkpoint.identity.json` |
| Manifest SHA-256 | `d3c0db584d9b5fd392fcca307a319cd23350f3ff03a379f14246c3cd4820abff` |
| Verified archive members | All 73 member paths, byte counts and SHA-256 values; no missing, extra, duplicate, case-colliding or unsafe paths; ZIP integrity passed |
| Code revision | `M2-runtime-v1` |
| Independently reproduced source digest | `907e4ec682172e90f2c3b0b0d78ec43ade848d8bcace1fbe6775301aefc43731`, 27 entries |
| Content revision | `M2-paperwork-v1` |
| Package | `package_0002`, revision 1 |
| Independently reproduced package digest | `6dde071b2d6e6b280ca9ba6ce929bbdd1b42f4f128deba818fc1c32dd2b8e115` |
| Approved M1 baseline | R2 archive SHA-256 `47a879c74ac7f684ff5d3d7d1de742d800d8d5cd801fe833234707ec66be555d` |

Inputs came from `C:\Users\mcdon\Downloads\Encounter_M2_Tester_Handoff`. Its loose README, scope report and interaction transcript match their ZIP members byte for byte. `HANDOFF_PROVENANCE.txt` names the same verified archive hash. Its timestamp is provenance text, not an execution-time assertion by this reviewer.

Testing used a fresh extraction under `C:\Users\mcdon\Documents\Codex\2026-10-17\ca\work\m2-independent-review`. An existing scratch extraction was left intact rather than overwritten. The four R2 core modules, original M1 builder fixtures/tests, original independent M1 tests, and prior R2 independent review/evidence are unchanged. The earlier M1 verdict applies to R2; this report supplies the separate M2 verdict.

## 2. Environment

- Windows, PowerShell, Node v24.18.0, npm 11.16.0 and Python 3.12.0. Tool versions were freshly queried.
- The desktop in-app browser, controlled through the computer-use/browser APIs. No exact browser engine version or cross-browser certification is claimed.
- No dependency installation, external runtime service, model call or asset download was needed.
- Original source and the supplied build were retained unchanged. Build/evidence regeneration ran only in a separate disposable copy.
- Network access was granted for local testing. The successful browser server bound only `127.0.0.1` and served the verified `dist` folder.

The evidence bundle records source hashes, exact automated command arguments/environment/exit codes, browser state exports, screenshots, console observations, transcript comparison and final preservation checks.

## 3. Launch result

**Passed: the supplied `dist/index.html` ran successfully and completed M2 in the browser.** The static artifact was independently rebuilt to identical bytes: 78,995 bytes, SHA-256 `911b8a8be1224993ca43ea1af53bd2dec2ff211faf3dd47aa9c8747e1f2cba94`.

Initial terminal-managed loopback listeners timed out in this execution environment, including after a network-permission retry. A detached hidden Python server serving the same unchanged `dist` folder succeeded at `http://127.0.0.1:62586/`. This was a test-host/lifecycle adjustment; production code, HTML and network-security settings were not changed. The successful detached launch and actual browser interaction are the launch evidence; the earlier unsuccessful connections are not reported as passes.

The test helper uses the same standard-library static-serving approach as the supplied server, with a fresh available loopback port. Direct `file:`/double-click launch was not tested. The result establishes the supplied runnable build on this browser surface, not universal launch behavior on every environment.

## 4. Automated tests executed

| Fresh execution on the verified M2 source | Passed | Failed |
|---|---:|---:|
| M0 limited non-DOM baseline audit | 7 | 0 |
| Builder M1 + M2 suite | 64 | 0 |
| Unchanged independent M1 suite | 22 | 0 |
| External independent M2 suite | 18 | 0 |

All Node suites exited 0, with no skipped, cancelled or todo tests. The builder suite contains 38 preserved M1 cases and 26 M2 cases. The external M2 suite was inspected and freshly executed with `ENCOUNTER_CHECKPOINT` and `M2_BROWSER_EVIDENCE` explicitly bound to this fresh extraction and this review's browser exports. Existing scratch results were not substituted for execution.

Unchanged independent M1 test SHA-256: `c591b4366097e77da7d21b4ddb861161a6ee3e71e9bc2af15acf5f1393ba4651`. Independent M2 test SHA-256: `858171387e7edbcfe105a39cfe3d1a6f1dd58bf505a5dc65dbbd83df24ccc0de`.

Commands executed included:

```powershell
python work\verify_m2_checkpoint.py
python work\run_m2_checks.py
python work\run_m2_independent.py
node work\compare_m2_causal_evidence.mjs
```

The recorded runners actually invoked:

- `node scripts/audit-baseline.cjs`.
- `node --test --test-reporter=tap <all four builder *.test.mjs files>`.
- `node --test --test-reporter=tap <unchanged independent M1 test file>`, with the checkpoint environment binding.
- `node --test --test-reporter=tap <independent M2 test file>`, with both checkpoint and fresh browser-evidence bindings.
- `python scripts/verify-checkpoint.py <supplied matching M2 identity file>`.
- Independent read-only source/package digest calculations.
- `node scripts/build.mjs` and `node scripts/generate-evidence.mjs` in the disposable tooling copy, followed by byte comparisons with the verified originals.

The rebuilt sealed content module, build HTML, supplied transcript and supplied inspector trace all reproduced byte for byte. These integrity/regeneration checks are separate from the behavioral test totals. Matrices inside a test are not counted as additional tests. Historical 253/29 results are not fresh evidence.

To rerun the delivered independent M2 file, point it at an unchanged extracted checkpoint and this review's bundled `evidence` directory (containing the fresh browser run/inspector JSON):

```powershell
$env:ENCOUNTER_CHECKPOINT = 'C:\path\to\extracted\M2'
$env:M2_BROWSER_EVIDENCE = 'C:\path\to\review-bundle\evidence'
node --test --test-reporter=tap .\M2_Independent_Contract_Tests.test.mjs
```

## 5. Manual/browser checks executed

Eight recorded browser check groups passed:

1. Tried all nine visible vibe/salience draft combinations. Each retained revision 0; complete before/after save exports were equal.
2. Sent one Compassionate/Overt ordinary request. The separate Intake/Delivery path granted limited permission and disclosed section references, with no physical inspection or signature detail yet.
3. Deliberately clicked **Inspect handling extract**. Revision advanced to 2; the player received the signature detail and the clerk received conduct only. No reported claim existed yet.
4. Sent the previewed follow-up through **Remark**, then completed its separate Intake/Delivery. Revision 3 contained four messages, one inspection, one claim and two decisions.
5. Opened/refreshed/closed the author inspector and replayed/skipped the response. Complete saved run state stayed equal.
6. Attempted a legacy import. The compatibility error appeared and the current saved state remained unchanged.
7. Started a fresh run, imported the valid saved run, and verified exact revision-3 restoration without additional effects.
8. Clicked **Download JSON** and read the actual downloaded file. It exactly matched the displayed full run export.

These were real UI interactions, not calls to hidden browser state. Run/trace exports were read from the application's visible save dialog and inspector. Fresh initial, Intake and completed-page records, screenshots and downloaded JSON are included. No browser warning/error entries were captured.

The full browser path used Compassionate/Overt. All nine protected first-request variants were additionally executed by the independent automated suite; they are not described as nine separate browser playthroughs.

## 6. M2 path result

**Passed: all ten required steps in tester §9.**

| Step | Actual result |
|---|---|
| Compose relevant paperwork request | Supported Request, known case/record references, previewed Compassionate framing and Overt prominence |
| Preview | Exactly states the supported request; no hidden file layout or signature value is introduced |
| Send | One new command commits the initiating canonical message; the stored message equals the bound preview |
| Tamsin Intake | A separate visible Intake phase describes receiving the communication |
| Tamsin Delivery | Explains the file split, offers handling-extract inspection and excludes private contact content |
| Deliberate inspection | A separate performed-action command, not a side effect of permission |
| Filtered revelation | Player reads the unfilled signature; clerk sees conduct without unread print |
| Player follow-up | New canonical Remark reports the inspected signature detail |
| Grounded response | Clerk acknowledges the heard report and offers verification; expressly does not claim firsthand verification |
| Inspector | Records the actual message, receiving observations, claim, candidates, decision and committed changes; reads are non-mutating |

The browser run reached `run_0002`, revision 3: three committed commands, four canonical messages, ten observations, one permission, one performed inspection, one claim and two decisions. Final material state remained 1,200 minor units, quantity 1, owner `actor_0003`, holder `subject_0007`. No recovery or transaction was required or performed.

## 7. Information-boundary result

**Passed in the exercised paths and adversarial checks.**

| Required challenge | Independent evidence |
|---|---|
| Preview mutation | IM2-01 and the browser's nine-preview/save comparison leave the complete run unchanged |
| Protected first request | IM2-02 executes all nine first-request expressions; canonical request stays intact, limited access is offered, world state unchanged, no grievance/restriction/repair/closure state |
| Message versus interpretation | IM2-05/11 preserve the initiating request; follow-up is a new heard assertion. No invented belief, hypothesis or human sincerity field |
| Private-selector perturbation | IM2-06 uses one package/context with equal actual cues and different private selectors/provenance; complete outward histories and future listener traces agree |
| Hidden proxies | IM2-10 audits actual decision inputs and production source; private selectors/templates/cache/psychology fields remain absent, while actually performed cues are retained |
| Hidden-world perturbation | IM2-07 changes concealed contact truth without changing responses, and verifies an uninspected signature change does not alter the first response |
| Permission without action | IM2-04/08 and the browser permission-only save contain no inspection result or signature revelation |
| Performed inspection | IM2-08 confirms player reading versus clerk sight; private contact content is absent from their received projections |
| Source-pointer attack | IM2-09 follows every actual decision-input observation citation and root through the source-read API, including valid hidden-source citations; only received fragments return |
| Keyword/menu leak | IM2-04 and the initial browser view show case/ticket/record only; section references arrive after explanation, without the protected value |

The save/package files contain the synthetic authored contact value by design; these are explicit author/debug snapshots, not player or listener projections. That documented local author access is not misclassified as an NPC information leak. The gameplay notebook and actual policy inputs remain filtered.

The production policy takes the filtered listener view, not the unrestricted world/package. No character-name or seed-name response branch was found in the reviewed core integration. A distinctive performed Menacing cue is legitimate outward information under the tester/master clarification, not evidence of hidden-label leakage.

## 8. Idempotency/staleness result

**Passed.** IM2-12 tests each committed command kind at the completed run: exact retries replay saved receipts, changed payload under the same identity rejects as `IDENTITY_CONFLICT`, and a new obsolete identity rejects as `STALE_COMMAND`. The run remains unchanged.

IM2-14 redelivers the real physical result: no additional result, observation, opportunity or effect appears. Changed result bytes and a second result identity for the same request reject. IM2-13 checks tampered previews, invalid permission and a staged observer-detail leak: technical failures publish no partial action; a valid social refusal can still record message receipt without material effects.

The unchanged M1 suite and preserved R2 regressions also pass, including D01-A and D01-B. The four reviewed R2 core modules are byte-identical; the M2 integration calls the same command commit and matched-result staging boundaries.

Browser replay/skip, inspector refresh, save download and valid save restoration preserved the exact complete saved run. These UI observations support the corresponding pure-read tests rather than relying solely on architecture claims.

## 9. Portability result

**Passed for the supported M2 paperwork mechanics.** IM2-16 renames every actor and subject ID and display label in a neutral archive fixture, then runs the full sequence through the same core. Both expected decisions occur, ownership is preserved and the absent owner receives no observations. Missing optional art/final wording still yields readable Intake/Delivery and returns player control.

This proves the exercised role/reference binding and neutral fixture, not integration with every host game, scenario or future communicative act. The UI's Last Collection title and current paperwork descriptions are authored presentation, not response-rule tests of character names.

## 10. Inspector/causal-trace result

**Passed: the supplied transcript, supplied run, supplied trace and fresh browser evidence agree.**

1. `M2_Interaction_Run.json` was imported and its entire committed journal replayed against the exact package.
2. The supplied `M2_Inspector_Trace.json` trace equals inspection of that validated saved run. The archived browser inspector export agrees as well.
3. The supplied evidence generator regenerated both transcript and trace byte for byte in a disposable copy.
4. This review's fresh browser Save run and inspector exports replay and match each other exactly.
5. The fresh browser run equals the complete supplied run after consistently normalizing **only neutral command IDs**. No message meaning, observation, claim, result, decision or material state was normalized.

The actual first decision, `decision_0001 / explain_access`, uses observations `0002`, `0003`, `0004`. The second, `decision_0002 / acknowledge_report`, uses those plus `0008` (inspection conduct) and `0009` (the later heard report). It does not treat conduct as reading the signature. The claim cites `message_0003`, while `message_0001` remains the original request.

Fresh browser-run SHA-256: `c98c9e20cb4c7e268b2b5e73edc4642ea1cf7b09e37ca4c2a06adcf4b6e8f2e1`. Fresh inspector-export SHA-256: `338357bfbc1b0d26f9b524b366a0312bd31eeef99d4e1b705d6a71993ae729c5`.

`M2_Independent_Interaction_Transcript.md` records the freshly exercised sequence. Raw exports and machine-readable comparison are in the evidence bundle. Inspection/replay neutrality was verified against complete saved state.

## 11. Defects by severity

No BLOCKER, CRITICAL, HIGH, MEDIUM or LOW correctness defect was observed in the executed M2 scope. There is therefore no new defect reproduction or production fix in this report.

The initial socket timeouts and an initial screenshot attempt while the browser was hidden were test-environment issues; the successful detached launch and visible-browser captures resolved them. The existing older scratch extraction was preserved. None required changing production code or weakening an assertion. No automatic approval rejection occurred.

The previous D01 findings remain resolved on the unchanged R2 boundaries. The report does not assert absence of defects in untested later scope, arbitrary trusted callbacks, unsupported acts or unlimited-size sessions.

## 12. Not tested / later scope

- M3 and later; collection closure, its missing-preview fallback, serious restriction/repair rules, completed case recovery, full Seed A/Seed B routes and negotiations.
- Full offer/confirmation/transaction execution, NPC initiation, the full Assembler, belief/hypothesis machinery, combat/theft/stealth and runtime generative AI.
- All 69 master acceptance specifications or all 360 BASED cases. This package implements two acts and three authored expressions; broader registry vocabulary is not implemented coverage.
- Universal double-click/file launch, other browsers, mobile layouts, assistive-technology certification, long/unbounded sessions and storage beyond the documented JSON limits.
- Novice human playtests or a claim that schema correctness establishes fun.

The specific missing-preview closure fallback remains an owner question before M3. Its absence is not an M2 defect, and no closure implementation or exact closure testing was undertaken. Manual save/import is the tested persistence path; no autosave or old-save conversion is claimed.

## 13. Subjective play observations

The tested previews make the requested act and visible framing understandable. The notebook and separate inspection button make the permission/action distinction visible. The clerk's follow-up clearly distinguishes a received report from independent verification. Text/body-and-face descriptions are readable without finished artwork.

The author trace is useful for causal verification but dense to scan as raw JSON. These are observations by the tester during one desktop interaction, not novice playtest findings or a verdict on final character writing, pacing or enjoyment.

## 14. Milestone verdict

**READY FOR NEXT SCOPE**

The verified M2 checkpoint meets the required connected interaction, challenged information boundaries, retry/result safety, neutral portability, missing-asset fallback and transcript/inspector consistency checks in this report. All executed suites passed; no M2 correctness defect remains open from this independent test.

Stopped after M2. No production source was modified. No additional agent was launched. No M3 implementation, collection closure or later-scope testing was begun or authorized by this report.
