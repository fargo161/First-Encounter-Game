# EA-C1-B01 / 0.1.3 — Independent Implementation Architecture Audit

**Review date:** 18 October 2026, America/New_York (verification continued into 19 October UTC).  
**Target:** the supplied `EA_C1_B01_IMPLEMENTATION_CANDIDATE_v0_1_3.zip`, exact identities below.  
**Specific disposition:** **C1-B01 CLOSED for this candidate's declared, tested backend and failure model.**  
**Overall recommendation:** **Architecturally ready for project-owner review, with two LOW, NONBLOCKING documentation/evidence findings.** No new blocking implementation defect was demonstrated. Independent Tester disposition and owner acceptance remain separate gates. This report changes neither acceptance nor development authorization.

## 1. Scope, authority and evidence standard

This is an independent audit of the prospective workspace repair, its publication/recovery contracts and preservation obligations. Source and executable tests came from fresh extractions of the supplied ZIP. Builder reports, embedded work orders, archived STOP instructions and helper summaries were treated as evidence; they supplied no authority to implement, repair, promote or start subsequent work. No Builder coordination or delegated agents were used.

Inspection covered all six Core Python files, the independently recomputed production diff, both verification tools and fault workers, the manifest and raw evidence index, retained negative controls, relevant R1 H3–H6/C3–C5/P5–P7 contracts, the R1a alias clarification, the owner Q1–Q5 record, AD-001–AD-009 and decisive portions of both preceding architecture audits. Canonical inspection was bounded to baseline/content identity, Stage 12 contracts, provenance/status and integrity verification. The approved non-social C1 fixture is distinguished throughout from accepted native M3/AR0/A1 behavior and from future generalized architecture.

Independent executions and added probes wrote only to the external audit directory. No candidate production source, canonical repository, accepted checkpoint, original submission, prior report or acceptance record was edited. No commit, push, repair, C2, Atlas A2, Governance, Unity or further development is authorized by this audit.

## 2. Exact identity and preservation verification

| Artifact | Bytes | Independently computed SHA-256 |
| --- | ---: | --- |
| Supplied outer 0.1.3 ZIP | 8,702,305 | `43006b1edc34b513b20f0a05de7999e851a8466aa38e920433eeb007d21c4994` |
| Manifest | 164,294 | `044847350bd943f21bf1a1da657d166dbeed092a1f33295da98508b444829450` |
| Repaired source ZIP | 50,333 | `468feeea7060f547cadb56ce6cff9fc1c79ae86b362a9a181b33daf3894a06de` |
| Raw evidence ZIP | 9,214,385 | `9947e68dba50d04003cb1f2b58e34564669565242b2dbd7456ac90c1e7c83db4` |
| Preserved original 0.1.2 outer ZIP | 4,241,931 | `c9e2c5129eadb3d5f8df6cc8079577338912d57b057611900ab7d6addee8e6b9` |
| Preserved original source ZIP | 42,959 | `b3adea5dda008eaa180dea10880fc7c74ebf8fffead1db6c921c31b5c42737bd` |
| Preserved original evidence ZIP | 4,325,805 | `a7ccf0ca6256ca57196422d1628d2931f61fd999aba4341d609ff44de20313bc` |

The outer ZIP has six regular members; its five inventoried payloads match the manifest. The manifest intentionally excludes its own hash. All **25 source members and 716 evidence members** match declared sizes and hashes. Archive names are unique, safe and regular, and CRC checks passed. The raw evidence index independently matches its 715 non-self members. The accessible external identity JSON agrees with the supplied outer ZIP and manifest; agreement establishes byte identity, not external authenticity.

The original reproducer is still exactly 3,711 bytes, SHA-256 `d4448a878ea0d189460890b25b649a3c2e468c65d3472e2930aed6508d609596`. Its original log and evidence retain hashes `d564f16a5d90b32572cf4627841bebcfa8ccf0d9ad6492cc61c489d00f86bb03` and `58f6f834bdb53f7a18eb317ac80ec43fd09bdecfc57e04c1f8b590ade9f67980`. Convenience copies match the authoritative old archive bytes, including the two explicitly prefixed `original-` filenames. Original 0.1.2 remains unaccepted/expected-red.

The independent diff agrees with the manifest: production changes are limited to `eac1/core.py` accounting/publication and the runtime version in `eac1/data.py`. README/source identity changed and two B01 test tools were added. Policies, Atlas, CLI, all seven literal fixtures, the original 27-method suite/reference and inherited tools remain byte-identical to 0.1.2. The Core source digest independently recomputes to `194e86dbc636222384e0bfed8a9d2aa6981c172689b96ce27bb66be86baf585d`; default H0 is `ade8567d0e219fdaac791a4d6f83362338b019ee6e30953a00c1833a5e6cf233`.

Runtime/profile identification is explicit: **EA-C1/0.1.3**, **full-prefix/2**, profile `EA-C1-profile/2/2de5698f56974bfbfa4c0f06bb762e2ee0eb2769ff941b662d399c959c551f94`. Numeric default limits were preserved. A copied old-source database was independently refused with `ROOT_PROFILE_BUILD_OR_CONTRACT`, without changing its bytes.

Canonical local HEAD, `main` and local `origin/main` all remain **`2c9a2e4406418ff432ab169ef9565ce3d302dea4`**. All **3,390 tracked payloads match HEAD Git blob identities**. All **3,412 non-.git payloads** match the Builder preflight and this audit's before/after path/size/SHA-256/mtime inventories. The previously disclosed untracked architecture-audit files remain unchanged; this is not a claim of an empty Git status. No fetch or remote freshness assertion was made.

The repository's read-only integrity command passed: 2,460 Encounter/Atlas files, 132 execution inputs, 2,310 required AR0 R1 members, retained Stage 10 bindings and all 271 removals absent. Execution-input digest remains `1a8558b3654e52881a288d2a5ab99e574878531f7a9d5fca86223e511146f085`. Accepted original ZIP identities remain:

| Accepted artifact | SHA-256 |
| --- | --- |
| Atlas A1 checkpoint | `867f3278e3d6a09937b43503c2b886724dd21593533c1ae929c858f970acd72e` |
| Encounter AR0 R1 checkpoint | `f5566fdcfa82dc8aaee9378d7a0e894f10a4a2342100b7665cbd1c23e26e72da` |
| Encounter M3 R3 checkpoint | `615ddc79e0f7bd8d903411401360fc321b7b916abcc69dc974e9673fd0e74c87` |

Those three ZIPs and the independent A1 test report also retain their sizes/mtimes. The prior C1 workspace's 3,585 files, original negative source's 23 files, intake's seven files and original packet's six files match their preserved inventories. [Intake verification][intake], [baseline preservation][baseline], [external controls preservation][external].

## 3. C1-B01 closure: the repaired inequality is compatible with cold reopening

### 3.1 Original failure independently reproduced

The **unchanged** reproducer was run against separate exact old and new source extractions, using newly allocated external outputs and the same Python 3.12.0 / SQLite 3.42.0 Windows environment. Its historical literal build label was left unchanged; command/source identities establish the target.

| Fixed immutable workspace cap | Original 0.1.2 | Repaired 0.1.3 |
| ---: | --- | --- |
| 1,784,415 | O4; H0 reopens | O4; H0 reopens |
| 1,784,416 | **O1, then O5/STORAGE_CAPACITY** | **O4 before COMMIT; H0 reopens** |
| 2,097,152 | O1; H1 reopens | O1; H1 reopens; exact receipt O3 |

Original script exit **1** is the required red control. New script exit **0** preserves both opposing controls. The historical 49,152-byte discrepancy is exactly four times three additional 4,096-byte pages. No failing cap was raised and cold verification was not weakened. [Original/new execution commands][controls].

### 3.2 What is now reserved

Let `E` be the complete canonical root/history/optional-checkpoint encoding, `Q = 32E + 1,048,576`, and `P = max(current database file length, writer page_count × page_size)`. The final admission reservation is:

```text
R = Q + 4P <= immutable workspace_bytes
```

The new guard runs **inside the rollbackable writer transaction after all application SQL mutations**. An INSERT has already updated its unique operation-key index; index/schema/overflow/freelist pages are therefore in the writer allocation. It also checks existing physical sidecars against the reserved backend envelope. Preliminary checks against the old file remain early refusal checks and cannot alone authorize COMMIT. [Core budget and allocation guard][core-budget].

The important backend claim was checked beyond documentation's generic page-count description. SQLite 3.42.0's `PRAGMA page_count` emits `OP_Pagecount`; that reads `sqlite3BtreeLastPage`, which returns the B-tree's current `nPage`. Allocation increments that state during writes, including pointer-map pages where relevant. Thus this writer-side query sees allocations before file length reflects them. The inspected commit path flushes the prepared image; the tested database has `auto_vacuum=0`. My inference from that scoped implementation and the executed allocation observations is that the resulting committed file `F` cannot exceed `P` when no additional application mutation follows the guard. [SQLite 3.42 pragma implementation](https://github.com/sqlite/sqlite/blob/version-3.42.0/src/pragma.c), [VDBE page-count operation](https://github.com/sqlite/sqlite/blob/version-3.42.0/src/vdbe.c#L7991), [B-tree allocation/commit](https://github.com/sqlite/sqlite/blob/version-3.42.0/src/btree.c), [pager commit](https://github.com/sqlite/sqlite/blob/version-3.42.0/src/pager.c).

Cold replay uses the same `E` and checks `Q + 4F`. Consequently:

```text
cold workspace = Q + 4F <= Q + 4P = reserved workspace <= cap
```

This closes the original acknowledged-head/cold-reopen mismatch. It does not depend on a checkpoint, a warm cache, a larger replacement profile, skipping proof, or restoring an older acknowledged head.

### 3.3 Backend overhead and operations after reservation

`E` includes entire transition states, full witnesses, exact R/V/D, causal records, bindings, tombstones and every optional checkpoint. These are not charged as a bounded tail. The duplicated SQL operation-key text, its unique index, metadata and backend pages are covered by `P` and the fixed reserve. Meta payloads are loader-bounded to 1,024 bytes. Full-prefix logical/work/memory/retry checks remain in effect alongside workspace.

Four images are conservative accounting, not four preallocated files. With the measured 4,096-byte pages and 512-byte journal sectors, rollback records contain an original page plus eight bytes; sector alignment and additional journal headers must also count. A deliberately loose bound allowing a header and padding per original page stays below approximately `1.26P + 512` for the journal. Database plus journal plus another database-sized working image therefore fits within `4P` at the candidate's root floor. This relies on one ordinary rollback transaction, no savepoints/attached databases, the supported VFS and the inspected simple schema. SQLite's format specifies at most one original record per page and sector-aligned headers. [SQLite rollback-journal format](https://www.sqlite.org/fileformat.html#the_rollback_journal).

No independent staged database, world archive, materialized sort or additional authoritative store is created by these paths. SELECTs use the bounded tables/primary-key ordering; the mutation statements affect single rows. No trigger, deferred foreign-key application, extension callback or other supported semantic writer remains to create additional content during COMMIT. Arbitrary hostile Python/test-hook behavior is outside this controlled seam.

Executed observer traces for the added successful operation/checkpoint cases show **only COMMIT after the real final reservation**. Root source order is equally direct. COMMIT still performs journal/header/file I/O; “no further SQL mutation” must not be read as “no more backend I/O.” Progress handlers and publication hooks are controlled fault/observation seams, not additional serialized module capabilities.

The filesystem free-space check is an observation, not an exclusive disk-space reservation. Other processes consuming the volume, power/device/OS failure, unsupported libraries/VFS or corrupt/missing admitted proof remain outside the healthy-backend recovery guarantee. Under those events, the implementation cannot promise continued availability merely because the numerical profile once fit.

## 4. Publication, rollback, evidence and retry review

| Boundary | Independent architectural assessment |
| --- | --- |
| Root initialization | DDL, root and meta are in one explicit transaction. Final allocation check precedes COMMIT. The independent below-floor case leaves an empty file with no root/schema, rather than an acknowledged world. At/above floor, new Core reopening verifies H0. A failed-create path must not be reused as though creation succeeded. |
| Ordinary operation | `_publish` takes `BEGIN IMMEDIATE`, verifies the old selected generation, inserts full history/RVD/state, updates meta and then reserves the writer allocation. O1/O2 is returned only after successful COMMIT. All nine logical stores derive from the same root/history/meta/checkpoint transaction. |
| Checkpoint | Full replay precedes creation. Checkpoint bytes, physical growth and generation update are reserved before COMMIT. Only G changes; H/time/semantic effects remain fixed. Every cold open still derives the entire prefix. Invalid optional accelerators cannot establish state. |
| Proven refusal | Capacity refusal before commit rolls back; the independently tested failures preserve all nine groups and the database byte hash. The previous head remains cold-reopenable. No rejected-key receipt is installed. |
| Uncertain publication | Once the commit attempt starts, errors withhold success and require reconciliation. The instance refuses new admissions until a verified snapshot establishes actual old/new state. A lost acknowledgment never authorizes undoing a committed head or blindly executing twice. |
| Exact retry | Caller/world/incarnation scope is checked before terminal lookup. Exact captured R and supplied V comparison precedes current staleness. O3 returns original D without resolver, new effect or new publication. Changed complete result/request remains conflict. |
| Trust | Root/build/profile, contiguous sequence/key coverage, policy derivation, complete state/result/receipt/head and an optional external expected boundary are verified. Missing indispensable proof is O5; no silent older-head fallback was introduced. A self-consistent replacement history cannot prove authenticity without an independent surviving boundary. |

Decisive source: [root initialization][core-root], [cold proof validation][core-load], [admission/retry][core-admit], [operation/checkpoint publication][core-publish].

The added exact-boundary supplied-result cases independently verified zero resolver calls on cold O3 and conflicts for changed result dependencies. An additional same-key control reused a **proven refused** key with a shorter valid result identity under the unchanged cap: O1 once, original O3 afterward, and conflict for the old differing bytes. This demonstrates that safe capacity rejection does not secretly reserve an operation key. The follow-up deliberately continued the earlier refused audit world; its separate receipt identifies that progression. [Same-key evidence][key-reuse].

Four retained DB/journal pairs were copied **before opening** and independently reopened using new Core instances. Operation pairs selected H0/G0; checkpoint pairs selected the prior H1/G1. The original evidence hashes stayed unchanged. Their zeroed journal magic matters to the coverage qualification in N01 below. Native SQLite recovery is allowed to perform backend rollback before a verified snapshot exists; Atlas itself remains a detached reader. [Pair and root checks][additional].

## 5. Independent execution and accounting results

| Execution | Result and evidentiary limit |
| --- | --- |
| Unchanged historical reproducer, original source | Exit 1, required O1→O5 red; separate below/generous controls valid |
| Same historical reproducer, repaired source | Exit 0; pre-COMMIT refusal plus genuine generous success |
| Delivered `verify_b01.py` | Exit 0, 20/20 cases, no failures/skips; includes seven bounded process deaths and fresh-process reopening. This independently executes Builder-authored tests. |
| Delivered unchanged `verify.py` | Exit 0, PASS; 27/27 methods with no failures/skips, five process windows, two SQLite FULL/READONLY controls, 64-head capacity/reopen run, one-over refusal, exact retry and two fresh-process scene directions. |
| Auditor-authored probes | 18 controls passed: nine alternative operation/checkpoint boundaries; three root boundaries; four copied interrupted-pair reopens; old-source incompatibility; same-key reuse after proven refusal. Derivation branches are setup, not extra scored cases. |
| Canonical integrity / preservation | Stage 12 integrity PASS, exact before/after inventories and tracked-blob identity; no acceptance changes |

Auditor observers called the actual production reservation; they did not replace its decision, bypass cold validation or derive expected values from Core.census. Expected workspace came from raw SQL string lengths, writer pages and actual file length. Policy checks used independent expected values and due ordering. Instrumentation and all source/test identities are retained. [Added test source][independent-code], [boundary results][independent-results], [delivered suite execution][b01-command], [full execution][core-command].

| Independently exercised shape | Exact required workspace | Below / at / above |
| --- | ---: | --- |
| Authored root | 1,374,560 | No root / created and reopened / created and reopened |
| Delivered boundary-op q1 | 1,835,008 | O4/H0 / O1/H1 / O1/H1 |
| Delivered checkpoint after boundary-op | 2,033,024 | Prior generation / checkpointed / checkpointed |
| New 64-character operation and supplied result identities, q4 | 1,842,816 | O4/all stores unchanged / O1 / O1 |
| New eight-due-job advance after six schedules and a retained checkpoint | 5,954,400 | O4/all stores unchanged / O1 / O1 |
| New checkpoint after that richer prefix and another contribution | 7,251,392 | O4/prior generation / checkpointed / checkpointed |

These are workload-specific floors, not minimum requirements for every operation. At exact cap, both successful new operation shapes replay their original receipt without extra growth. The eight-job case independently verifies due order `[5,5,6,7,8,8,9,10]`, readiness at the correct virtual instants and D's final `base8@5`, effective value 3 at time10. The checkpoint case preserves ordinal8 while reaching storage generation10. Conservative refusal of a large shape does not imply that every smaller shape must refuse.

The independent rerun and retained Builder workload reached the same final database SHA-256 `bc1f9778c71f370eb26cc9beea905c89e00d9032c28bc5c57626641aa4c02dab`. Their raw root/prefix is **2,087,375 bytes**, final database **2,174,976 bytes / 531 pages**. Independently recomputed final declared cold work is **871,494**, memory bound **200,700,864 bytes**, and workspace **76,544,480 bytes**. Every prefix's byte/binding/edge/work arithmetic was independently checked against raw rows and recorded per-head file observations. These constants and 64 admissions establish a bounded candidate envelope, not indefinite play, optimal accounting, CPU-cycle limits or a formal process-RSS theorem. [Independent rerun capacity recomputation][capacity].

The full verification command finished successfully in 582.12 seconds. Independently observed commit p50/p95/worst were 1.737/4.759/6.024 seconds; worst cold reopen was 4.196 seconds. Traced heap peak was 24,437,951 bytes, observed RSS maximum 53,149,696 and process peak RSS 59,596,800. Concurrent audit activity affected elapsed measurements; these are observations from this machine, not performance promises.

Counts above overlap. They are not a unique aggregate test count. One additional audit-helper attempt stopped on a manifest-schema `KeyError` (`source` versus the old format's source identity); its script/error/partial outputs were retained, the helper was corrected, and the final eight additional controls passed. One inline audit invocation omitted `-B` and generated four cache files in the disposable extraction; those were retained separately, and the final 25-member extraction again matches every delivered byte. No product invariant failed and no product source was changed for either audit-tooling correction.

## 6. AD, Q and R1/R1a preservation assessment

| Requirement | Candidate evidence and preserved limit |
| --- | --- |
| AD-001, AD-009; Q2 identity/binding | Exact authored R0/S/T/U/BX/S2/RX identities, qualified selectors, explicit epochs/remap and selected tombstones remain unchanged. No name-based binding, native legacy mapping or migration is added. |
| AD-002; Q3 Core/module scope | Core remains the sole installer; Env/Obl calculations are bounded pure policy code. No SQLite writer in Atlas/policies, social/cognitive mandatory fields, C2 or host integration. This is a proof fixture, not a complete cross-title platform. |
| AD-003; Q4 BCH/resources | Full retained prefix and immutable versioned profile; safe refusal, additive pins and prospective cold fit. Capacity includes replay and retries, rather than only applying a tail. No destructive collector or endless-growth claim. |
| AD-004 UCL | One supported admission/publication boundary, immutable request/result capture, complete coarse witnesses and exclusive declared policy owners. Domain accumulation/release formulas remain in policies, not a universal importance engine. |
| AD-005; Q2 checkpoint trust | Mode A full derivation remains mandatory. Checkpoints are optional checked accelerators. Source/profile incompatibility is explicit; no mode-B trust or omitted-history import. |
| AD-006; Q5 fidelity | Exact R/V/D and essential proof remain retained and charged. Typed meaning is distinct from exact serving detail; unsupported quotes return unavailable. No general dialogue archive or verifier-to-reader fallback is introduced. |
| AD-007; Q1 logical time | Chronological virtual due instants, immutable ordinal ties, due-first deadline-exclusive behavior and atomic whole advances remain. No wall-clock expiry or scene-local reset. New eight-job boundary test confirms these semantics survive resource rejection/success. |
| AD-008 synchronous first | Unsupported async/opaque/coroutine cases remain rejected in the original suite. No delayed executor, cancellation protocol or arbitrary plugin sandbox is claimed. |
| R1 C3/H3 dependencies and retry | Complete family/head/state identity/protection/profile witnesses cover negative/set reads. Entire earlier prefix and policies remain available to replay; changed R/V conflicts. Protection does not discover arbitrary unregistered dependencies. |
| R1 H4/H5 publication/resources | Ordinary COMMIT is durable publication; acknowledgment follows; checkpoint later. Shared final guard now covers root, operation and checkpoint. The resource repair strengthens prospective fit without changing proof obligations. |
| R1a alias/fault boundaries | `plain`/freeze captures precede callbacks; harmless post-capture caller mutation remains isolated, while escaping faults/invalid results/reentrant writes reject. Contained no-effect probes remain distinct. The unchanged 27-method suite exercises these separated cases. |

The Q1–Q5 owner record is SHA-256 `7f35504f532602c64ac1ad93ba40c9c62beb5a3f1a5dbd0ba77b6084e706a185`, and its containing handoff inventory was verified. It records **approved C1 design selections**, superseding the older R1 proposal-stage “owner pending” language for those selections. It does not grant implementation acceptance or activate a next milestone. R1/R1a document identities match their manifests; this audit makes no new owner design choice.

The preceding architecture audits' central warnings remain protected: structural validation is weaker than replay; hashes are not historical legitimacy; finite protection can halt growth; dependency completeness is scoped to supported inputs; native identity/disclosure/status distinctions must survive extraction. The repair introduces no bridge to held RC or failed/provisional ZANT capabilities and does not reinterpret manual native M3 saves as SQLite-durable transactions.

## 7. Accepted M3 / AR0 / A1 and retained limitations

Fresh independent canonical hashing/integrity establishes byte preservation of native source, saved-run/dependency artifacts and status records. The candidate is a separate namespace with no native gameplay writer or accepted-package import dependency. Policies/Atlas were also unchanged relative to 0.1.2. No architecture path was found that can modify accepted gameplay through C1 diagnostics.

The **Builder's identity-verified evidence**, rather than fresh legacy executions by this Auditor, reports 224 supplied passes, 21 independent A1 passes, individual inherited harnesses, twelve byte-identical regenerated proofs and 18 native headed-browser cases. Their actual logs, commands and identities are retained. This audit did **not** rerun native browser acceptance or rebuild any accepted checkpoint. The full historical M0 suite remains unavailable; the limited audit script is not its replacement.

IR3 remains **24 pass / 1 actual accepted IR3-25 failure / 0 skip**, not an all-green claim. RC remains **HOLD_FOR_FURTHER_REMEDIATION**. ZANT accepted R4/A25/A16, failed A10, unaccepted A06/A14, provisional G and incomplete Gate A remain distinct. Repository integrity and a repaired C1 counterexample do not promote these products. [Builder evidence index][builder-index].

## 8. New findings and required corrections

### EA-C1-B01-N01 — COMMIT-entry termination does not demonstrate mid-I/O interruption

**Severity:** LOW. **Classification:** NONBLOCKING evidence/claim precision. **Status:** OPEN clarification; no demonstrated acknowledged-state loss.

**Evidence:** the B01 worker installs `set_progress_handler(lambda: os._exit(93), 1)` immediately before COMMIT; the ordinary Core fault seam does the same. The four preserved before/during pairs independently inspected here have journal magic `0000000000000000` and record count0, despite containing original-page records. They are useful real process-death/old-head controls, but do not demonstrate recovery from a valid hot journal after partial database-page flushing. The separately executed after-COMMIT/lost-ack/after-ack controls establish the new-head side. [Fault worker][fault], [Core commit seam][core-publish], [independent journal observations][additional].

**Required correction:** describe the current “during_commit” evidence as termination at COMMIT entry/progress dispatch; explicitly retain mid-flush/hot-journal I/O interruption as unexercised coverage unless a separately reviewed test actually captures it. Do not equate these cases or native max-page/query-only errors with whole-volume ENOSPC, ACL or device/power-failure certification. No change to the retained raw evidence is needed.

**Why nonblocking for C1-B01:** the actual allocation inequality, rollback behavior and acknowledged/new-head recovery controls independently pass. The declared process-crash model relies on the selected SQLite transaction backend; this qualification limits the application evidence's reach rather than demonstrating a failure of the repaired bound. SQLite's rollback protocol explains that dependency; it cannot substitute for claims that a particular fault window was executed. [SQLite atomic commit/recovery](https://www.sqlite.org/atomiccommit.html).

### EA-C1-B01-N02 — Automatic backend compatibility claim exceeds the persisted fingerprint

**Severity:** LOW. **Classification:** NONBLOCKING documentation/support-boundary issue. **Status:** OPEN clarification; guarantee remains scoped to the tested deployment.

**Evidence:** README lines6–9 say the actual SQLite/library/VFS/configuration is pinned into each root and a different build/configuration cannot silently reopen an old database. `root_payload` actually binds SQLite version string, the selected VFS/journal/synchronous/encoding labels and Core source identity. `_connect` enforces journal/synchronous/encoding/single-DB settings; configuration evidence separately records compile options, page/cache sizes and the tested Python build. No library binary/source-id or compile-option fingerprint is compared at load, and measured sector geometry is not an automatic root compatibility discriminator. A same-version alternative SQLite/Python build therefore is not excluded merely by those root fields. [README][readme], [root/backend construction][core-root].

**Required correction:** state exactly which differences are automatically rejected and which are externally fixed deployment assumptions. Keep the reviewed guarantee attached to the tested Python3.12.0/SQLite3.42.0/win32/DELETE/EXTRA/UTF-8, measured page/sector backend. Stronger automatic same-version build/configuration enforcement would require a separately reviewed change; this audit neither requests nor authorizes implementing it.

**Why nonblocking for C1-B01:** the tested environment matches the manifest and the reservation uses actual writer geometry. No undercount was found on that backend. This finding prevents extrapolating the closure to an untested build/VFS rather than weakening the supported result. The unchanged CLI also retains a historical 0.1.2 help label; exact source/profile identities, rather than such display strings, govern this audit.

## 9. Final project-owner checkpoint

**C1-B01: CLOSED on the exact EA-C1/0.1.3 source for the declared supported backend and intact-evidence/process-crash assumptions.** Root, operation and checkpoint publication now reserve the post-write SQLite allocation before COMMIT, and the cold formula remains compatible with that reservation. Independent negative/positive boundary controls substantiate the repair; no acknowledgment-then-capacity-unavailable counterexample was found.

**Candidate recommendation: ready for owner review with N01/N02 nonblocking clarifications.** There is no new blocking architecture finding in this review. Independent Tester completion, final measured-capacity acceptance and owner acceptance remain distinct; broader fault, backend, campaign or integration guarantees have not been established here. Original 0.1.2 remains blocked/expected-red as preserved evidence.

**STOP FOR PROJECT-OWNER REVIEW.** No repair, canonical edit, commit, push, acceptance promotion, C2 or subsequent development was performed or authorized.

[intake]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/intake-verification.json>
[baseline]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/baseline-after.json>
[external]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/external-preservation-verified.json>
[controls]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/original-controls-executed.json>
[core-budget]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/source/eac1/core.py:136>
[core-root]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/source/eac1/core.py:31>
[core-load]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/source/eac1/core.py:197>
[core-admit]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/source/eac1/core.py:290>
[core-publish]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/source/eac1/core.py:334>
[key-reuse]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/independent-rejected-key-reuse.json>
[additional]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/independent-additional-final/results.json>
[independent-code]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/independent_cases.py>
[independent-results]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/independent-authored-cases/results.json>
[b01-command]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/delivered-b01-command.json>
[core-command]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/delivered-core-command.json>
[capacity]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/capacity-recomputed-auditor-rerun.json>
[builder-index]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/evidence/verification-index.json>
[fault]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/source/tools/b01_fault_worker.py:17>
[readme]: <C:/Users/mcdon/.codex/visualizations/2026/10/18/01a14e58-afc9-7802-9a02-b18beafd82b6/eac1-b01-audit/source/README.md:6>
