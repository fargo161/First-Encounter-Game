# M1 defect remediation report — R2

Date: 2026-10-17 (America/New_York). Authorization: `reference/Encounter_Codex_M1_Defect_Remediation_Prompt.md`. Revision: **M1-contract-v2**. **M2 has not begun.**

## 1. Defects addressed

D01-A (HIGH): a caller-held command alias could change the journal after the frozen command was resolved. D01-B (CRITICAL): effect-callback mutation of caller-held result/request identities could hide a prior result and allow a duplicate effect. Both were reproduced before repair and now pass new builder regressions and unchanged tester cases. No other production behavior was changed.

## 2. Production files changed

Only `src/runtime.mjs` and `src/action-boundary.mjs`. Other production modules, original builder fixtures/tests, M0 plan and original references are unchanged. Supporting updates cover the regression file, snapshot-name/overwrite protection, revision identity, required notes and fresh evidence.

## 3. Exact fix for D01-A

`executeCommand` creates `immutableCommand = freeze(copy(command))` before identity lookup/callbacks. That one authoritative snapshot supplies identity comparison, new-command validation, package/revision checks, callbacks, resolution, receipt identity and the stored command. Commit never rereads the caller command. Original exact retries replay; changed payloads conflict; new stale commands reject as before.

## 4. Exact fix for D01-B

`stageMatchedResult` detaches/freezes one request/result snapshot pair before validation. Matching, duplicate lookup and stored result identity use that pair; the adapter's effects/observer copies derive from it. It never rereads caller identities after application. Original result redelivery is a no-op; changed bytes and a second different result for one request reject. Staging copies gameplay state and publishes no partial state on failure.

## 5. Regression tests added

`tests/identity-regressions.test.mjs` adds two tests. D01-A mutates caller identity/metadata in preflight, resolution and postflight; resolved data, receipt and journal retain the independent original command, whose retry replays without effects. D01-B mutates result ID and request command aliases while applying one neutral effect; the original result remains journaled, redelivery does not apply again, conflicts/second results reject and failure preserves input state.

All original 36 builder cases remain unchanged. The unchanged tester file SHA-256 is **c591b4366097e77da7d21b4ddb861161a6ee3e71e9bc2af15acf5f1393ba4651**.

## 6. Commands executed

Before repair: builder regression file and tester D01-only cases, both using Node TAP; each produced the expected 0 pass/2 fail and exit 1. After repair:

```powershell
node scripts/audit-baseline.cjs
npm.cmd test
$env:ENCOUNTER_CHECKPOINT = (Get-Location).Path
node --test --test-reporter=tap independent/M1_Independent_Contract_Tests.test.mjs
python scripts/source-identity.py
python scripts/snapshot.py Encounter_M0_M1_Checkpoint_R2
python scripts/verify-checkpoint.py ../Encounter_M0_M1_Checkpoint_R2.identity.json
```

Exact executable paths, working directory, environment binding, exit codes and raw output are under `evidence/`. Read-only manifest/preservation/diff checks were also performed. Extracted-copy packaging verification is recorded in the external R2 verification sidecar/logs after freeze. No dependency installation or network call was used.

## 7. Fresh results

| Repaired-source execution | Passed | Failed |
|---|---:|---:|
| M0 baseline | 7 | 0 |
| Builder M1 (original 36 + 2 regressions) | 38 | 0 |
| Unchanged tester-supplied suite | 22 | 0 |

All four original reference-preservation checks passed. The failed ZIP/identity and all 24 original expanded members remain unchanged. Tester test/report/evidence copies are untouched. Only the intended two production files changed. Archive verification checks the new hash and every member after creation. Extracted-copy reruns are packaging validation, not extra distinct tests. Historical 253/29 results are not fresh evidence.

## 8. New checkpoint identity

- Archive: **Encounter_M0_M1_Checkpoint_R2.zip**.
- External identity: **Encounter_M0_M1_Checkpoint_R2.identity.json**, containing archive SHA-256 and every member's byte count/SHA-256. The archive's own hash stays external because this report is a member.
- Revision: **M1-contract-v2**.
- Executable-source digest: **137b1eeda83f325392ffc3b137a90574bd527801c7a766287e0a08c74015e171**, 13 entries in `evidence/M1_source_identity.json`.
- Unchanged builder fixture SHA-256: **f4ddba46ab2804f0358d78c07d30c9c26adca42ea825b2744fee780ddb8b85e4**.
- Preserved failed archive SHA-256: **e42900345ee3c1aba1956d6212577683321bc5c5f42ab3e1d6f12eb45fceb3bf**.

The archive includes repaired source, regressions, required notes/report, logs, original references, untouched tester inputs and verification tooling. No prior export or identity was overwritten.

## 9. Remaining limitations

This repairs local synchronous identity-boundary defects; it does not sandbox trusted callback code or undo external side effects in its own closure. Future domain validation and gameplay remain future integration work. No browser/UI, Last Collection M2 content, compiler/policy/actual resolver, closure, recovery/negotiation, Assembler expansion or full coverage was built/tested. No specialists or subagents were launched. Neither repair changes approved player-visible behavior.

## 10. M1 gate status

**STOPPED FOR INDEPENDENT RE-REVIEW. M2 REMAINS UNAUTHORIZED.** The original verdict was NOT READY FOR M2. Lead execution of the tester suite does not replace independent review of this exact R2 checkpoint. Only independent re-review or an explicit owner waiver can clear the gate; neither is claimed here.

