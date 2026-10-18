# M3-D03 remediation — R3

READY FOR INDEPENDENT M3 RE-REVIEW. This is a builder handoff; independent acceptance is pending. Stop at M3. No M4 work was performed.

## Defect and exact change

The independent R2 review independently verified D01 and D02 fixed and found one new blocker: CSS `visibility: collapse` makes the current notice absent while leaving a positive, contained rectangle. R2 accepted that rectangle and recorded a false display receipt, so the unchanged engine closed service.

The complete supplied R2 report and 722-member evidence ZIP were ingested before modifying production code. `independent/m3-r2-review/INGESTION_READ_RECORD.json` records full byte reads, text decoding, JSON/JSONL and nested ZIP inspection. The decisive screenshots were also visually inspected. Document instructions were treated as review evidence within the owner's explicitly authorized D03 scope.

The sole production source change is in `src/m3/ui.mjs`, `acknowledgeVisibleNotice`:

```diff
- style.visibility!=='hidden'
+ style.visibility==='visible'
```

Computed visibility must now be `visible` before a new display acknowledgment can be earned. Both `hidden` and `collapse` fail. The existing current draft/revision binding, hidden flag, display state, own/ancestor opacity, finite positive geometry and full viewport containment remain intact. The early return for an already truthfully earned receipt remains intact, so later scrolling alone cannot revoke it. No scenario, actor, message, item, fixture or CSS string is inspected by this production decision.

Engine, policy, types/contracts, local knowledge, meaning, authored content and all inherited test source bytes are unchanged. No policy bypass, new consequence, fallback punishment or host feature was introduced. `evidence/m3-d03/production.diff` is the exact production diff; `preservation.json` enforces that the new source equals R2 with precisely this one predicate replacement.

## Before and after

Before patching, the new production-bound builder test failed (0/1) and the unmodified independent R2 suite produced 19 passes and the expected IR2-20 failure. Fresh actual browser controls against preserved R2 HTML with CSS-only collapse reproduced `displayed: true`, one physical close, closed service and no technical defect.

After patching, the focused display tests pass 25/25. The unmodified independent R2 suite passes 20/20, including IR2-20 with its original expectation. The fresh browser collapse case records `displayed: false`, normal receipt/refusal, service open, zero physical closure and exactly one `MISSING_CLOSURE_PREVIEW`. Retry idempotence is checked by dispatching the exact collapsed-notice command three more times in the new builder regression: each is replayed without changes or an extra defect.

| Fresh browser display case | Result |
|---|---|
| Preserved R2 + collapsed current notice | Expected historical defect reproduced: one false closure |
| R3 collapse, hidden, display none | No receipt; refusal, service open, zero closure, one technical defect |
| R3 own/ancestor opacity zero | Same protected result |
| R3 horizontal/vertical offscreen | Same protected result |
| R3 zero width/height, partial left clipping | Same protected result |
| R3 genuinely visible current notice | Valid receipt, deliberate Send, exactly one closure |
| R3 earned receipt, later scrolled out of view | Receipt retained for unchanged draft/revision; exactly one closure |

The browser host adds only a rendering-fault stylesheet; it never edits runtime JavaScript or authored content. `/before-collapse/` uses the exact preserved R2 HTML. `/normal/` serves the exact R3 HTML. `rendering-fault-provenance.json` records hashes and verifies that removing the injected style restores the source bytes. The partial-left stylesheet overlaps the Save control; keyboard activation of that ordinary UI button was used to export that case. No production behavior or test expectation was changed for the export.

Fresh successful recovery starts from New run, verifies the ticket, protects the first ordinary paperwork request, inspects and searches through actual actions, obtains Orrin's limited report, distinguishes the original shorthand from Tamsin's later evasive reply, declines unnecessary payment, exercises the privacy pattern and warning, asks Why without consuming repair, then substantively narrows to comparison. The repaired save reloads with exact JSON equality and its warning intact. Actual comparison produces an offer; exact confirmation separately completes a zero-payment handover. Nera remains owner, custody changes once, 12 coins remain, privacy stays protected, and record correction remains separate. A subsequent protected-scope demand leaves the recovered world unchanged with no closure or defect.

There are 18 fresh actual UI exports and 17 browser check records (one expected R2 defect and 16 passing R3 checks). Every exported run validates through full deterministic journal replay against the unchanged engine. Three raw actual inspector exports—collapse, visible closure and recovery—match their regenerated traces exactly. Matching transcripts, traces, geometry, screenshots and save/load pairs are under `evidence/m3-d03/`. No console warnings/errors were captured.

## Fresh gates

| Gate | Passed | Failed / skipped |
|---|---:|---:|
| M0 audit | 7 | 0 / 0 |
| Full builder M1/M2/M3/R1/R2 plus D03 | 137 | 0 / 0 |
| Independent M1 | 22 | 0 / 0 |
| Independent M2 | 18 | 0 / 0 |
| Prior independent M3 | 18 | 0 / 0 |
| Original independent M3-D01 reproducer | 1 | 0 / 0 |
| Independent R1/D02 rendering | 9 | 0 / 0 |
| Independent R2/D03 rendering, including IR2-20 | 20 | 0 / 0 |

These are fresh executions against the R3 source, not the older captured results. The full inherited chain was executed in a disposable copy whose 68 source inputs are byte-identical to R3 (`regression-source-binding.json`). This prevents legacy helpers from rewriting historical captures in the deliverable. Its fresh gate logs and exact command/environment/exit records are copied under `evidence/m3-d03/regression/`. The independent R2 run and new browser evidence execute directly against the R3 working root. Root-level `evidence/m3/`, `m3-d01/` and `m3-d02/` captures otherwise remain historical, not fresh R3 browser proof.

The 25 focused production-bound cases cover collapse, hidden/display state, own/ancestor opacity, both axes offscreen, empty/invalid/non-finite geometry, partial clipping, genuine visibility, earned receipt after scrolling, stale/edited binding, closure replay and completed recovery. The full suites also retain authority, local observation/belief/report separation, substantive repair continuity, warning persistence, money, custody/ownership, exact confirmation, save/load, idempotence, inspector roots, portability/renaming and host-boundary assertions. No failures were found in these classes.

The new builder test extracts the actual production acknowledgment body and dispatches its result through the real engine. The independent R2 test source is byte-identical to the supplied source. Its runner redirects only the evidence output directory into an isolated location, copying the two original input fixtures unchanged; all 20 assertions and behavioral expectations remain unchanged. Existing inherited test adapters remain as disclosed in their prior reports, including D02 viewport-fixture completion; no new behavioral relaxation was added.

## Identity and preservation

- Source revision: `M3-runtime-v1-R3-D03`.
- Source digest (68 source inputs): `a609f63c56ed1e047f44e8f3ef28b21f91adec9e40e35d08eb988d0e78de9362`.
- Runnable HTML: 133751 bytes, SHA-256 `8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb`.
- Content: `M3-protective-shortcut-v1`, package `package_0003`, revision 1, digest `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f` (unchanged).
- Preserved R2 ZIP: `c3c866834b64aebc573b42e2839e173bed486cdc8125a0287ddcd952f43a1a10`, 94187091 bytes; all 1152 members and the original delivered R2 tree rehashed unchanged.
- Original R2 review evidence ZIP: `38c47ea52edb952ec618618c52d6dba6d0985d89b1033b960745e2bc306f5446`, preserved unchanged.
- New frozen artifact: `Encounter_M3_Checkpoint_R3.zip`. Exact archive SHA-256, bytes, every member hash and complete source/build/package identities are in the external `Encounter_M3_Checkpoint_R3.identity.json`; post-freeze checks are in `Encounter_M3_Checkpoint_R3_Verification.json`. A ZIP cannot include its own final hash without circularity.

R2 remains at the original `outputs/Encounter_M3_Checkpoint_R2.zip` and `outputs/Encounter_M3_R2/` paths. To avoid nesting another duplicate 94 MB archive, R3 includes its exact external identity, preservation record, previous UI/HTML and previous README/test report, rather than another copy of R2's ZIP. Older inherited historical artifacts are retained unchanged.

The full supplied R2 review archive remains unchanged at `outputs/M3_R2_Independent_Test_Evidence.zip`. The R3 package preserves 139 original reviewer files (top-level review material and fresh evidence), plus its ingestion/selection records. `PACKAGED_REVIEW_SELECTION.json` lists the exact selected hashes and the full original archive location/hash. Duplicate reviewed-checkpoint and regenerated supplied-suite trees are excluded from that subset. It is not presented as the whole 722-member ZIP.

## Reproduction and limits

Run `python scripts/check-m3-r3.py` from the extracted source for all gates and evidence checks. `--regressions` or `--evidence` runs each phase separately. For visible CSS-only controls run `python scripts/serve-m3-d03.py`, load `independent/m3-r2-review/evidence/r2-fresh-warned.json` through Open run, select Request / Request the whole customer file, bring the notice area into view, then deliberately Send. Compare `/before-collapse/`, `/collapse/` and `/normal/`; other explicit routes are documented in the host source. Use `python scripts/serve-m3.py` for ordinary play.

Known limits remain: one desktop browser rendering environment; no pixel-level occlusion, overlays, accessibility certification or rendering-engine redesign; fallback art/wording; manual bounded debug saves containing authored truth; no autosave or old-save conversion. A truthful display receipt is not a claim about every possible CSS rendering fault. M4, Seed B, the full Assembler, NPC initiation and host geometry/locomotion/LOS/spawning remain outside scope. There are no known remaining blockers within the authorized D03 remediation; independent re-review is still required.
