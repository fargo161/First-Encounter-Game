# EA-C1-B01 independent implementation test report

**Verdict: C1-B01 PASS — EA-C1/0.1.3.**

The original acknowledged-but-unreadable save defect is independently reproduced on exact 0.1.2 and no longer occurs on exact 0.1.3 in the executed controls. The three original workspace limits were used unchanged. Additional independently calculated root, operation and checkpoint boundaries, real process termination, copied-journal recovery, retries, inherited tests and visible-browser checks passed. No new repaired-candidate blocker was found in this verification.

This is the independent Tester result for the frozen B01 candidate, not owner acceptance, a substitute for the separate Auditor disposition, or authorization for further development. The accepted IR3-25 synthetic failure remains an actual failing test. Repository implementation, acceptance records and originals were not modified.

## Scope, inputs and isolation

Review date: 18 October 2026, America/New_York. Review workspace: `C:\Users\mcdon\Documents\Codex\2026-10-18\EA-C1-B01-independent-review`. The user authorized implementation verification only. The supplied handoff, reproduction instructions, Builder report, manifest and source were read as claims and procedures to assess. Their reported pass counts were not used as fresh evidence.

Both runtime versions came from newly created, separate source extractions. Core tests ran against those extractions, with `-B`; all worlds, crash files, logs, screenshots, builds and generated proofs were written outside frozen source and outside the canonical checkout. Legacy writers ran in a fresh disposable copy made by the unchanged repository wrapper. Independent checks used public Core entry points, separate JSON/SHA-256 arithmetic and observable SQLite records. They did not override the production accounting guard or weaken the cold reader.

| Verified object | Bytes / members | SHA-256 |
| --- | ---: | --- |
| User-supplied 0.1.3 outer ZIP | 8,702,305 / 6 | `43006b1edc34b513b20f0a05de7999e851a8466aa38e920433eeb007d21c4994` |
| External-identity-pinned manifest | 164,294 | `044847350bd943f21bf1a1da657d166dbeed092a1f33295da98508b444829450` |
| Exact 0.1.3 source ZIP | 50,333 / 25 | `468feeea7060f547cadb56ce6cff9fc1c79ae86b362a9a181b33daf3894a06de` |
| Supplied raw evidence ZIP, treated as untrusted evidence | 9,214,385 / 716 | `9947e68dba50d04003cb1f2b58e34564669565242b2dbd7456ac90c1e7c83db4` |
| Preserved 0.1.2 outer ZIP | 4,241,931 / 6 | `c9e2c5129eadb3d5f8df6cc8079577338912d57b057611900ab7d6addee8e6b9` |
| Exact 0.1.2 source ZIP | 42,959 / 23 | `b3adea5dda008eaa180dea10880fc7c74ebf8fffead1db6c921c31b5c42737bd` |
| Preserved 0.1.2 raw evidence ZIP | 4,325,805 | `a7ccf0ca6256ca57196422d1628d2931f61fd999aba4341d609ff44de20313bc` |
| Unchanged original reproducer | 3,711 | `d4448a878ea0d189460890b25b649a3c2e468c65d3472e2930aed6508d609596` |

The local external identity was located at `C:/Users/mcdon/Documents/Codex/2026-10-18/EA-C1-B01-candidate-v0.1.3/EA_C1_B01_IMPLEMENTATION_CANDIDATE_v0_1_3.identity.json`. Every package, manifest, source and evidence field above was independently compared. Every inventoried outer/source/evidence member was read, CRC-checked, sized and SHA-256 hashed. Exact membership was compared with each available manifest inventory; unsafe, duplicate and case-colliding paths were rejected. The parent raw-evidence archive has no separately supplied member inventory: its exact archive identity and complete safe member scan are recorded, rather than implying an unavailable manifest comparison.

The six-file Core digest was independently calculated as `194e86dbc636222384e0bfed8a9d2aa6981c172689b96ce27bb66be86baf585d`. Raw default root hashing yielded H0 `ade8567d0e219fdaac791a4d6f83362338b019ee6e30953a00c1833a5e6cf233`. The observed profile is `EA-C1-profile/2/2de5698f56974bfbfa4c0f06bb762e2ee0eb2769ff941b662d399c959c551f94`, accounting `full-prefix/2`. All seven supplied fixture files retained their exact approved hashes.

Per-file comparison with 0.1.2 confirms only `eac1/core.py` and the runtime version constant in `eac1/data.py` changed in production. Policies, Atlas, immutable capture, original 27-method test/reference suite, fixtures, CLI and original legacy tools remain byte-identical. Nonproduction changes are README, source identity and two added B01 test tools. Evidence: `evidence/intake.json`, `evidence/external-identity.json` and `runs/independent-capacity/source-digest.json`.

## Executed environment

Windows 11, build 26200; Python 3.12.0 (tags/v3.12.0:0fb18b0, Oct  2 2023, 13:03:39) [MSC v.1935 64 bit (AMD64)]; executable `C:\Users\mcdon\AppData\Local\Programs\Python\Python312\python.exe`; SQLite **3.42.0**; Node **24.18.0**. The Core used explicit win32 VFS, DELETE journal, synchronous EXTRA (3), UTF-8, 4,096-byte database pages and a 512 KiB configured cache. The independently observed disk sector size was 512 bytes, eight sectors per cluster. Browser: headed Chrome **155.0.8059.41**, preinstalled Playwright **1.62.1**, native viewport 1500 × 1300.

Default immutable limits observed in the root: 64 operations, 8 checkpoints, 20,000,000 cold/retry/query work units, 40,000,000 admission/checkpoint units, 8,388,608 logical bytes, 268,435,456 memory bytes, 1,073,741,824 workspace bytes, 8 due jobs and 2,097,152 query bytes. Capacity variations were declared before root creation and never raised afterward. Independent boundary profiles used 7 operations and a seven-digit workspace limit; fixed historical controls retained all default limits except their specified workspace cap.

`COMMANDS.md` and `evidence/commands.json` record exact argv, working directories, exit codes, durations, log hashes and environment overrides. Individual crash folders record their child and cold-replay commands. `reproduction-inputs/canonical-repo-wrapper.py` preserves the unchanged legacy command expansion. No dependencies were installed. Loopback HTTP was used only for local browser testing; no application deployment or external service was involved.

## Original reproducer: expected old RED, repaired GREEN

The exact same 3,711-byte script ran first against the old extraction and then against the repaired extraction:

| Target | Actual exit | Observed original-limit behavior | Interpretation |
| --- | ---: | --- | --- |
| Exact 0.1.2 | **1** | At 1,784,416 bytes: O1 acknowledged, then fresh Core snapshot O5 / STORAGE_CAPACITY | **Expected RED negative control reproduced** |
| Exact 0.1.3 | **0** | At 1,784,416 bytes: O4, H0 remains readable; generous control still O1 | Repaired invariant holds |

Old RED log SHA-256: `d564f16a5d90b32572cf4627841bebcfa8ccf0d9ad6492cc61c489d00f86bb03`. New log: `b0fcfe8d0f6bf8f394af42877fe9cceb33e6f300f29ca46e75024c61446f9e6b`. The original script's historical literal build label was left unchanged even on the 0.1.3 run; exact source hashes and command arguments identify the executed target.

Separate reviewer-written fixed-cap tests created six new worlds and inspected all four SQL tables, complete stored entries, original save bytes and all nine Core store groups:

| Immutable workspace bytes | Exact 0.1.2 | Exact 0.1.3 |
| ---: | --- | --- |
| **1,784,415** | O4; byte-identical H0 database and stores; cold H0 | O4; byte-identical H0 database and stores; cold H0 |
| **1,784,416** | O1; valid H1 in raw SQL; cold O5 / STORAGE_CAPACITY | O4; byte-identical H0 database and stores; cold H0 |
| **2,097,152** | O1; cold H1; exact retry O3 | O1; cold H1; original receipt on O3; zero resolver calls |

The original `o1` successful publication requires **1,833,568 bytes** under the unchanged cold formula. The 49,152-byte gap from 1,784,416 equals four times the additional three 4,096-byte SQLite pages. The rejected repaired publication did not reserve its key or create a terminal receipt. The expected old failure is not counted as a new repaired-candidate failure.

Evidence: `runs/original-012-red`, `runs/original-reproducer-013`, `runs/independent-fixed-012` and `runs/independent-fixed-013`.

## Independent capacity oracles and paired boundaries

`independent_checks.py` calculates expected costs from raw stored payloads and SQLite geometry. It never calls product `census`, `_budget`, `_publication_budget`, or Builder verification helpers to generate its expected thresholds. Let **E** be UTF-8 bytes of canonical root + every history payload + checkpoint payloads; metadata is excluded from E but occupies charged SQLite pages. Let **P = max(database file bytes, PRAGMA page_size × PRAGMA page_count)**. The independently implemented acceptance threshold is:

`required workspace = 32 × E + 1,048,576 + 4 × P`

A generous calibration world establishes each actual publication shape. Fresh below/at/above worlds use unchanged-width profile values; their raw encoded lengths and actual allocation are checked again. Different names, a Unicode operation name, an independently calculated D2 release, maximum-length request/result identifiers, an O2 transition and two checkpoint shapes prevent agreement from depending on the Builder's single `boundary-op` fixture.

| Independent shape | E bytes | Pages × 4,096 | Exact required bytes | Just below / at / above |
| --- | ---: | ---: | ---: | --- |
| Root, 7-operation profile | 6,601 | 7 | **1,374,496** | Rejected / created / created |
| D2 q4, Unicode operation name | 19,574 | 10 | **1,838,784** | O4 / O1 / O1 |
| O2 q0 after D2 release, 64-character operation/result IDs | 33,017 | 13 | **2,318,112** | O4 / O2 / O2 |
| Checkpoint after two independently checked operations | 39,128 | 14 | **2,530,048** | O4 / checkpointed / checkpointed |
| Second checkpoint of the same two-operation head | 45,127 | 15 | **2,738,400** | O4 / checkpointed / checkpointed |

Each row used required−1, required and required+1, for **15 fresh boundary cases**. Below-root attempts acknowledged no root and left no authoritative tables. Below-operation and below-checkpoint attempts preserved the prior database hash, all raw rows, head, generation, clock, nine stores and valid save copy. At/above operations matched an independently constructed complete state/result/receipt/head entry; exact retries returned O3. At/above checkpoints preserved the semantic head and ordinal, incremented generation once and were verified as optional accelerators after reopening.

The independent D2 oracle computes x=4, y=floor(3×4/2)+4=10, crosses the release threshold and leaves D unchanged. Whole-entry comparison includes the occurrence ID, prior cause, dependency head, effects, canonical request digest, next head and receipt. The O2 branch still consumes one durable operation/receipt and must fit the capacity bound; it is not treated as a free no-op.

At 1,838,783 bytes the longer original envelope was refused. A shorter complete result identity under the **same never-published key** then committed, independently requiring only 1,835,424 bytes. Retrying that admitted envelope returned O3; retrying the earlier conflicting envelope returned O4. This demonstrates positive admission and absence of failed-key reservation, rather than blanket rejection.

The unchanged supplied B01 suite also freshly passed **20 cases**: the three fixed controls, its separate 9 boundary cases, full-storage/retry/export behavior and seven native process-interruption controls. Its root/operation/checkpoint floors were 1,374,560 / 1,835,008 / 2,033,024 bytes. These differ legitimately from the independent workload's encoded envelopes; they are not universal minima. Supplied helpers remain identified as Builder-authored evidence.

## Crash recovery, exact retries and prior-save preservation

Independent operation process termination ran at the reviewer-calculated **1,838,784-byte** limit. Each interrupted original DB/journal pair was copied and hashed **before any recovery connection**. Recovery used a separate copy in another Python process. The interrupted originals and prior valid save remained unchanged.

| Termination seam | Cold observed ordinal | Original request after recovery | Resolver calls |
| --- | ---: | --- | ---: |
| Before SQL write | 0 | O1 with independently expected receipt | 1 |
| After SQL writes, before COMMIT | 0 | O1 with independently expected receipt | 1 |
| Native SQLite COMMIT progress handler | 0 in this run | O1 with independently expected receipt | 1 |
| After COMMIT, before acknowledgment | 1 | O3 with exact original receipt | 0 |
| After acknowledgment | 1 | O3 with exact acknowledged receipt | 0 |

The before/during-COMMIT operation snapshots preserved a 28,672-byte DB plus a 16,928-byte journal. Committed operation snapshots contained a 40,960-byte DB. After retry, exactly one history entry, one terminal receipt and the independently expected D2 effect existed. A second retry returned the same receipt without a new effect.

Independent checkpoint termination ran at **2,530,048 bytes** before, during and after COMMIT. A Python trace injector stopped the actual checkpoint method at its COMMIT boundary or installed a SQLite progress-handler exit; it did not replace or suppress the production reservation. Both separate replays of each sealed file pair produced identical observations. Before/during COMMIT retained generation 2 with no checkpoint; after COMMIT retained generation 3 with one verified checkpoint. All retained the same two-operation semantic head, and exact prior operation retry was O3 with zero resolver calls. Journal headers and both replay commands are preserved.

A separate lost-ack exception after a committed operation produced O5 uncertainty; further admission on that Core remained O5 until reconcile. Reconcile recovered the independently expected committed head, then original retry returned O3 exactly once. Native SQLite FULL (`max_page_count`) and READONLY (`query_only`) failures returned O4 with byte-identical prior stores; a normal valid retry then committed. These are real SQLite error results, not whole-volume or ACL certification.

The unchanged broad C1 suite separately reproduced its five default process-death windows, two SQLite faults and two fresh-process cross-scene directions. The supplied B01 suite reproduced seven narrow windows. Counts overlap and are not summed into unique safety coverage.

Evidence: `runs/independent-capacity/crash-*`, `runs/independent-supplemental/checkpoint-*`, their `interrupted-sealed` file pairs, `runs/c1-suite` and `runs/b01-suite`.

## Broader C1 verification and bounded measurements

The unchanged **27 original test methods passed, 0 failed, 0 skipped**. Their source and assertions were inspected, including the independent-looking but still Builder-owned reference module. Positive controls and actual data comparisons exist for qualified identity and parent scope; S/T continuity; exact remap and incarnation lifecycle; absence/set witnesses; ordered environmental effects, cap/decay/restoration; causal protection/pins; raw-byte/work/memory envelopes; mode-A history and externally anchored forgery; due settlement/cancel/clock; exact supplied-result identity; unsupported async/policy/profile ranges; detached Atlas purity and R1a capture/fault/reentry distinctions.

The reviewer-written suite passed **38 checks** and the independent supplement **5 checks**, in addition to the six fixed-cap version controls. They include caller post-capture q1→q4 isolation; escaping versus contained protected-input mutation; explicit false/invalid validator outcomes; invalid supplied result; contained nested writes invalidating the outer attempt; complete independent state/receipt/head derivation; real backend faults and acknowledgment uncertainty; public hidden-bundle non-disclosure; optional forged accelerator rejection as authority; externally anchored truncated-history detection; old-source data rejected without rewriting; and exact retry when operation capacity is full.

For logical time, independent observation saw A at 5 with effective 0, then B at 8 with effective 5. External reads inside both substeps still saw time 0 until atomic publication. Final time 10 had D base8@5, effective3, and B expired-ready. Backward time was O4 with unchanged state; same-time advance produced O2 with a receipt.

For Atlas, public outputs for ten restricted source/history/census queries were exactly equal with and without a hidden exact-source bundle, including status/reason. Author detail required the explicit available bundle; meaning-only M could not yield an exact quote. Repeated inspection preserved the database bytes and all nine stores. Forged optional checkpoints could not replace the independently replayed authoritative prefix.

The default **64-operation** run completed, cold-reopened each head, rejected operation 65 and retained an exact O3 retry. A separate reviewer oracle recomputed **all 64 complete transitions, result records, hashes and receipts** directly from ordered SQL history and literal environmental arithmetic. It independently counted 2,087,375 encoded prefix bytes, 704 binding checks and 1,152 edge visits. The final SQL head is `f5d77a76f61956eb16f17d02cb7acbced78102c30a30c5fbb8f8388178a58cdb`.

| Independently checked final quantity | Observed |
| --- | ---: |
| DB allocation/file | 531 × 4,096 = 2,174,976 bytes |
| Cold/retry deterministic work | 871,494 units |
| Admission/checkpoint work | 1,742,988 units |
| Conservative memory bound | 200,700,864 bytes |
| Complete publication/cold workspace bound | 76,544,480 bytes |
| Separate traced heap peak | 24,437,951 bytes |
| Observed process peak RSS | 65,552,384 bytes |
| Commit median / p95 / worst | 2.052s / 4.949s / 6.901s |
| Worst measured complete cold reopen | 4.662s |

All quantities fit the frozen default profile. Deterministic accounting units are not CPU cycles, and these host measurements do not establish campaign length or an unbounded performance guarantee. Evidence: `evidence/independent-full-prefix.json`, `runs/c1-suite/capacity/measurements.json` and the actual final DB.

## Acceptance scope mapping

The approved R1/R1a distinction is retained; the 25 EA-T rows are not claimed as 25 implemented architecture features.

| Plan rows | Executed interpretation |
| --- | --- |
| EA-T01–04 | Applicable C1 identity, continuity, explicit remap and witness gates; L attribution separately covered. No new cognition/report implementation claimed. |
| EA-T05 | C2-only forgetting/social-memory behavior **NOT IN THIS MILESTONE**. |
| EA-T06–09 | Env effects, causal closure/pins, bounded resources and supported fidelity. Destructive collection and social disposition excluded. |
| EA-T10 | Incompatible/unsupported policy-history/upgrade rejection only; no migration/backfill pass claimed. |
| EA-T11–20 | Applicable mode-A anchors/coverage, ordinary crash recovery, static logical-time jobs, immediate result/retry, strict ranges/profile, detached purity, selected identity lifecycle and R1a mutation/fault isolation. Mode B, async executor, hostile plug-ins and broad lifecycle remain unsupported. |
| EA-T21 | New social/private-composition loop **NOT IN THIS MILESTONE**; legacy M3 behavior rerun separately. |
| EA-T22–23 | Core operates with the optional social/RC/ZANT modules physically absent; supported required owner/policy validation and environmental reversal/expiry. Legacy recovery remains protected. No new subjective forgetting/correction capability claimed. |
| EA-T24 | L-only native browser notice cases and saved traces; actual IR3-25 retained. No new C1 renderer. |
| EA-T25 | Exact delivery/source/input/profile identities, unchanged tests/legacy/statuses and complete recorded failure classifications. |

## Fresh legacy and visible-browser results

Canonical local baseline: HEAD/main/local origin-main all `2c9a2e4406418ff432ab169ef9565ce3d302dea4`. The fresh disposable root wrapper passed with documented known limitation:

| Gate | Fresh result |
| --- | --- |
| Supplied Encounter/AR0/A1 tests | **224 passed / 0 failed / 0 skipped** |
| Independent A1 adversarial harness | **21 / 0 / 0** |
| M0 limited baseline audit | **7 passed / 0 failed**; historical full M0 suite unavailable |
| Independent M1 | **22 / 0 / 0** |
| Independent M2 | **18 / 0 / 0** |
| Independent M3 | **18 / 0 / 0** |
| Original M3-D01 | **1 / 0 / 0** |
| M3-D02 | **9 / 0 / 0** |
| M3-D03 | **20 / 0 / 0** |
| Independent AR0 | **22 / 0 / 0** |
| Independent AR0 R1 | **15 / 0 / 0** |
| IR3 suite | **24 passed / 1 actual IR3-25 failure / 0 skipped**, expected process exit1 |
| Rebuilt M3 and A1 HTML | Both exact accepted hashes |
| Regenerated A1 proofs | **12 byte-identical files** |

The historical failed-AR0 26-file source subset required for the old positive defect control was freshly extracted into the disposable inherited-review location and inventoried. The provided AR0 R1 path adapter changes paths only; existing assertions were not edited. No RC or ZANT product acceptance or new browser claim was made.

Accepted builds remained M3 `8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb` and A1 `b9612d61f41bcf2bee5085902ff65c5e418b226de3dd5c8af6490ccd15e4ae9f`. The 132-input A1 source digest remained `1a8558b3654e52881a288d2a5ab99e574878531f7a9d5fca86223e511146f085`.

Fresh headed Chrome ran the supplied **18 browser cases** using actual controls: clean Seed A verification/evidence path; repair continuity across drafts, Why, partner/end and save/load; substantive repair; comparison/exact confirmation; one custody transfer while Nera remains owner; zero payment; separate record correction; post-recovery protection; visible deliberate closure; own opacity0, collapse, hidden and offscreen invalid notices; six A1 saves × two audiences with Person/Source inspection. Native saves, traces, geometry, screenshots and zero page errors were retained.

The additional reviewer-written **10 browser cases passed**. Native ancestor-opacity0, display:none, zero-size, partial-left clipping and negative-top notices produced no closure, no close action result, exactly one missing-preview defect and unchanged balances. A truthful visible receipt survived subsequent actual scrolling and permitted one deliberate closure. Editing the preview after an earlier receipt while the new notice was transparent did not reuse the old receipt. No `getBoundingClientRect()` or viewport values were mocked.

Independent A1 JSON imports in author/player views matched reviewer-calculated canonical input and catalog SHA-256 values, preserved the original input strings, exposed the selected Person ID correctly, kept Orrin's interpretation out of Nera's card and omitted full developer source from the player view. The canonical actor-conflict catalog was rejected through native controls with zero remaining Person buttons. All test-server requests were GET. Representative recovery, invalid-display and conflict-rejection screenshots were visually inspected.

**IR3-25 remains nonblocking under the prior accepted rule.** Its unchanged test manually reports width1000 in a 920-wide viewport while simultaneously reporting contained edges. The real failing TAP output still shows displayed=true, serviceOpen=false and one close result. This is retained synthetic hardening evidence. No corresponding native contradictory geometry or realistic production path was reproduced in this review. It was not removed, skipped, repaired, or relabeled passing.

Evidence: `runs/EA-C1-candidate-legacy`, `runs/legacy-extra`, `runs/browser-supplied-native`, `runs/browser-independent-v3` and all earlier failed harness artifacts.

## Failures, exclusions and remaining gates

Expected failures are distinct: unchanged old 0.1.2 RED exits1; IR3-25 is the single accepted failing legacy assertion. Neither is a repaired-candidate failure.

Four unsuccessful review attempts are retained and explicitly classified:

1. `headed-browser-supplied`: Chrome navigation received ERR_NETWORK_ACCESS_DENIED at 127.0.0.1 inside the network sandbox, before any application case completed. A permitted local-server execution then passed all18 cases.
2. `headed-browser-independent`: seven native notice cases passed; the reviewer harness timed out filling JSON inside a closed nested disclosure. Opening that existing control corrected the harness.
3. `headed-browser-independent-v2`: seven native notice cases passed; the harness incorrectly read `technical.projection` rather than the delivered `technical.person` field. The corrected v3 passed all10 without application changes.
4. `independent-final-identity-prefix`: the reviewer SQL query used ORDER BY1 on a payload-only selection, sorting JSON text rather than history sequence. Correcting it to explicit seq ordering allowed the independent 64-entry oracle to pass. The accounting calculation was order-independent; no implementation assertion was weakened.

Prior versions of the affected reviewer harnesses, logs, failure JSON and screenshots remain in the evidence. None of these errors justified modifying implementation or changing the expected product outcome.

No mandatory executed runtime test was skipped or converted to passing. Historical full M0 reconstruction remains **NOT RUN / unavailable**; seven audit checks are not presented as that full suite. Whole-volume ENOSPC, real ACL denial, power/OS/device failure, distributed persistence, other Python/SQLite/VFS/OS versions, malicious Python isolation, authentication, migration, mode B, destructive collection, C2 cognition/social behavior, further Atlas UI, Governance and Unity were not certified or begun. Native SQLite fault controls and process-crash recovery establish only their documented bounded model.

**Remaining acceptance blockers:** no new technical C1-B01 blocker was identified by the executed independent Tester verification. The separate Auditor disposition and project-owner decision remain outstanding review/acceptance gates; this report does not change those statuses. The known IR3-25 limitation and unavailable historical full M0 suite remain explicitly recorded inherited limits. If a broader platform or storage guarantee is required, it needs its own authorization and evidence rather than extrapolation from this PASS.

## Preservation and delivery

Final independent census matched all **3,412 canonical non-.git payloads**, including sizes, hashes, paths and modification times, against the recorded pre-review baseline; the 3,390 tracked-payload baseline and exact local commit were preserved. Frozen old/new extracted packages and source membership remained exact. Accepted M3 R3, AR0 R1 and A1 archives retained their recorded hashes; source/status/known-defect records stayed unchanged. The final checks did not write Git or promote any subsystem. Detailed receipts: `evidence/canonical-before.json`, `evidence/final-preservation.json` and `evidence/intake.json`.

The evidence ZIP includes this report, exact command ledger, independent harnesses, raw SQL observations, real databases and sealed interrupted pairs, fresh logs/proofs/browser saves/traces/screenshots, exact old/new source inputs, the unchanged original reproducer and a separately inventoried pristine 2,460-file legacy package. `EVIDENCE_MANIFEST.json` lists every bundled member's size and SHA-256, excluding itself; the external ZIP identity pins the manifest and final archive. `REPRODUCE.md` and `reproduce_bundle.py` give fresh-directory replay. The convenience orchestrator was syntax-checked; its replay commands are derived from the actual executed commands, and its existence is not counted as another run.

**Final independent implementation-verification verdict: C1-B01 PASS. Stop for project-owner review.**
