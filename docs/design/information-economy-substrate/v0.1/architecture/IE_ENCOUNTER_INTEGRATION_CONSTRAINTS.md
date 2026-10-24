# Encounter integration constraints — native bounded successor candidate

Date: 2026-10-23, America/New_York. Role G, with C semantic review. Status: **ARCHITECTURE RECOMMENDATION ONLY**. Architecture investigation is now authorized after Gate P0; no production code/dependency/schema/migration, accepted Core change, Git mutation, Unity work or playable slice is authorized. Stop at Gate A. This is a specialist constraint/recommendation report, not Auditor J's independent final sign-off.

## Evidence and controlling scope

The [P0 compatibility](../preflight/INFORMATION_ECONOMY_CORE_COMPATIBILITY_PREFLIGHT.md) and [persistence](../preflight/INFORMATION_ECONOMY_PERSISTENCE_PREFLIGHT.md) reports trace the inspected code. Governing sources remain [root instructions](../../../../../AGENTS.md), [Stage 12 decision](../../../../../contracts/SHARED_CONTRACT_DECISION.md), [inventory](../../../../../contracts/SHARED_CONTRACT_INVENTORY.md), [boundary matrix](../../../../../contracts/BOUNDARY_MATRIX.md), [examples](../../../../../contracts/COMPATIBILITY_EXAMPLES.md), [development workflow](../../../../../DEVELOPMENT.md), [source authority](../../../../provenance/source-authority.json) and [next-stage gate](../../../../consolidation/NEXT_STAGE_GATE.md). Their existing consolidation and subsystem authority records remain unchanged.

Accepted [EA-C1/0.1.3](../../../../../packages/encounter-core-c1/README.md) is a bounded non-social reference proof, with exact [owner scope](../../../../../packages/encounter-core-c1/provenance/0.1.3/EA_C1_0_1_3_OWNER_ACCEPTANCE_RECORD.md) and [source/evidence identity](../../../../provenance/encounter-core-c1-0.1.3.json). Its six-file Core digest is `194e86dbc636222384e0bfed8a9d2aa6981c172689b96ce27bb66be86baf585d`, accounting `full-prefix/2`. The authored default root head, source ZIP SHA, whole package inventory and Git identity have separate scopes. No new proof may claim this identity after any source/contract change.

[C1 core.py](../../../../../packages/encounter-core-c1/0.1.3/eac1/core.py#L24) checks exactly `root/history/meta/checkpoints` tables, rejects triggers/views, checks root equality against its exact source/backend/profile/fixture payload and rederives the complete prefix. [policies.py](../../../../../packages/encounter-core-c1/0.1.3/eac1/policies.py#L4) enumerates only controlled non-social operations. These are executable facts, not an assumed extension API.

[Legacy M3](../../../../../packages/encounter-atlas/src/m3/engine.mjs#L292) is a separate accepted scenario with save@3 replay, recipient-local [knowledge](../../../../../packages/encounter-atlas/src/m3/knowledge.mjs#L11) and its own package/run schemas. [C2.1 B0](../../../encounter-core/c21-b0/v0.1.2/README.md) is a reviewed technical-design proposal, not an accepted runtime/successor loader. Its B1 scope/playability amendment and owner authorization requirement remain effective. An Information proof cannot silently activate B1 by changing a name.

## Boundary options and recommendation

| Option | Can it meet the requested persistent reusable L1/L2 proof? | Disposition |
| --- | --- | --- |
| Read-only pure consumer of accepted C1 snapshots | Can inspect approved existing fixture actuality. Cannot add actual acquisitions, false accounts, record versions, support qualifications or case transitions because the accepted state/policies lack them | Retain as a diagnostic pattern; insufficient as the substrate proof itself |
| Social tables/policies patched into accepted C1 under its existing source/root identity | Loader/root/source/policy checks reject the assumption; it would alter the frozen accepted proof | **REJECT.** Do not relax checks, reuse the old hash or present a changed source as accepted C1 |
| Independently persistent social overlay/event store over C1 | Creates consequential social history/state whose installer/retry/atomic boundary differs from world truth; crash/replay can leave partial coupled outcomes | **REJECT as authoritative integration.** An optional rebuildable projection is allowed only when all consequential admitted basis remains in L0, and it cannot become a writer |
| Extend frozen legacy M3 or invent an M3↔C1 bridge | Requires separately authorized package work and a concrete conversion/ordering/identity protocol; no such shared executable contract exists | **NOT SELECTED.** Keep M3 unchanged and use its behaviors as regression/context evidence, not a native bridge |
| Treat B0 as an installed accepted dependency | No B1 execution/acceptance exists; B0 has distinct roots, schemas/hash groups and loss contract | **REJECT the assumption.** Borrow/reconcile reviewed design ideas explicitly, leaving its acceptance and B1 gates intact |
| Separately versioned native bounded Encounter successor proof with one L0 installer and pure L1/L2 participants | Can demonstrate the required semantics with one root/history/transaction, without modifying accepted source or migrating worlds | **RECOMMEND for Gate A.** It is a new proposed proof, not accepted C1 integration or production deployment |

The synthesis working identity **`EA-IE/0.1`**, with a possible later package path `packages/encounter-ie-reference/0.1.0/`, is proposed solely to distinguish that future proof's source/root/contract identity. It is not C2.1 acceptance or an EA-C1 extension under its accepted identity. No such package, source digest, root or executable API is installed by naming it. Copying/deriving reviewed minimal C1 mechanisms into the new namespace, if selected, remains implementation work after Gate A and triggers complete successor qualification.

“Successor” means a new standalone native proof lineage. It does not mean replacement of canonical accepted C1, compatibility with old C1 DBs, migration of legacy saves, product integration, promotion of B0 or a supported upgrade path. A first synthetic world is independent; no dual active writer shares that world. Any later migration/integration needs a separate named contract and approval.

## Proposed native authority path

The smallest coherent proof uses a controlled root, native logical state and one transactional publication boundary. Participants calculate on detached immutable verified state; they do not receive DB handles, effect executors, private unrestricted projections or asynchronous mutation callbacks.

1. **L0 captures a request** with exact producer/incarnation/world-lineage/operation and result correlation, selected source/policy/profile/root identity and required witnesses. Capture precedes validation, and immutable captured values become the replay basis.
2. **L0 verifies current authoritative input** and exact retry/conflict before evaluating a new operation. An exact acknowledged old request returns its original receipt; it does not create another acquisition/task/referral. A reused identity with changed content/result is rejected.
3. **Selected pure participants calculate proposals.** L1 validates acquisition/claim/source/support/holder scope; L2 validates case/routing/task transitions; supplied authority participants validate actual powers. They share one verified state and explicit deterministic ordering. A rule library, if later approved, can return a calculation only.
4. **L0 independently checks the proposed result and resource envelope.** Authoritative state, receipt/event identities, mandatory support and prospective cold/retry/query/recovery costs must fit before acknowledgment. A participant cannot supply an uncharged external graph as required state.
5. **L0 publishes one transaction** covering admitted informational/workflow changes, causal proof/index, operation registry and current head. COMMIT precedes acknowledgment; uncertain publication stops new writes until reconciliation. No external consequence occurs through a library callback.
6. **Detached queries construct scoped views.** Privileged proof diagnostics and actor-safe acquired context are separate. Querying a record pointer is not retrieval; retrieval/acquisition is an explicit admitted operation. Cache rebuild/inspection does not change knowledge, time or world state.

This path is an architecture recommendation, not evidence of an existing module interface. Exact request/result/receipt encodings and proofs need the candidate's own closed contract and independent review before implementation. Reusing C1 techniques does not inherit C1 acceptance.

## Non-negotiable successor constraints

| Constraint | Required meaning and design check |
| --- | --- |
| One world truth and installer | All actual state changes, including that a false claim was received or a case assigned, are admitted L0 facts. The proposition can remain false. No L1/L2 event store, library serialized graph, workflow DB or callback independently commits consequential history |
| Native identity qualification | Existing actor/world identity retains producer/artifact/native kind/local selector and version/hash scope; alleged subjects have no fabricated canonical occurrence. Audience handles do not expose canonical equality or become a parallel actor registry |
| Exact new identity | New source/root/contract/profile/hash domains must be explicit and distinguishable. Do not label new tables/operations `EA-C1/0.1.3`, reuse its accepted digest or claim its old roots open under the new reader. Preserve all accepted source bytes and fixtures |
| Minimal no-migration first proof | Start a new authored synthetic root under the new identity. No C1 DB mutation, old-save import, remap of legacy actors or cross-package adapter is needed. An optional research import remains non-authoritative and cannot imply compatibility |
| Deterministic admission | Logical world time and causal input order only; stable explicit due/queue/rule ties and bounded synchronous work. No wall-clock belief aging, random hidden spread, async completion-order mutation or LLM-produced actuality |
| Replay authority | Retain exact admitted request/result/receipt/source/policy/root/profile and mandatory causal support; rederive complete bounded history from authorized root. Stored current graphs/state are not trusted substitutes. Full-prefix costs must be newly charged for actual successor shapes |
| Honest refusal and recovery | A refused operation changes no admitted semantic head/acquisition/queue. Limits are checked prospectively including staged DB allocation and recovery overhead; an acknowledged head must remain cold-readable under its selected profile. No cap increase/hot-cache shortcut after acknowledgment |
| Historical precision | Exact received fragments, then-valid content/rule/version/labels and holder cutoff survive to answer promised queries. No invented detailed past from aggregates, sources or summaries; unknown/offline detail remains unavailable at its justified fidelity |
| No destructive collector | The first proof retains indispensable history and uses finite capacity with refusal. Cache eviction is allowed only for rebuildable views. Staleness, closure, revoked access or NPC forgetting does not authorize deleting causal/retry/support proof |
| Actor-safe projection | Eligible acquisition basis before serialization/search/count/order; actual/asserted/known provenance separate; unacquired unknown/denied/missing handles do not reveal hidden existence. Technical cost/hash/source-identity diagnostics stay privileged |
| Controlled code boundary | Pure selected native policies, no hostile-plugin sandbox claim, no arbitrary opaque serialized objects or coroutine hooks. Native controlled execution is narrower than a general security/authentication platform |

## Interaction with accepted neighboring responsibilities

**KeyWrapping/L1:** [semantic candidate](IE_INFORMATION_SEMANTICS_CANDIDATES.md) recommends one realization of accepted referent/acquisition/claim/projection semantics in L0 state. KeyWrapping's composer/reference consumers use that basis. Do not add a second persistent vocabulary/`knows` list, Player scratchpad, implicit alias join or blanket disclosure through an addressable wrapper. Exact handle encoding remains a candidate implementation detail; semantic acceptance does not freeze record fields.

**L1/L2:** ordinary actual delivery provides acquisition; L2 records intake/task/referral and selected processing. Organizations are record/authority scopes, not omniscient actors made from member unions. A manager can see a task exists only if eligible; assignment is not reading. An organization-owned case reference grants neither all attachments nor a sender's permissions. A one-person organization needs no artificial job-role hierarchy.

**Source and authority:** actual admitted producer scope is not in-world source authentication. Optional authored authentication evidence supports a source/channel assessment, not content truth or normative power. A forged grant/official report remains a possible attributed claim. L2 decisions require actual separately supplied grants before world effects; Laws/Factions authority is not implemented by routing.

**Support and cognition:** append scoped support qualifications and diagnose whether selected premise sets still support a conclusion. Preserve historical derivations and stance; recommend no automatic mental-state retraction in the first proof. A hidden actual-world change must not alter actor-facing confidence/labels merely because privileged validation can see it. Technical proof corruption is unavailable/stopped verification, not a new in-world correction.

**BASED:** consume only the actor's eligible information and permitted cues; never expose speaker's hidden selected vibe, motive, deception intent or private decision trace. Equal performed information and relevant listener/context must remain behaviorally equivalent under a hidden-selector-only substitution. Dialogue realization and social-choice policy remain above this proof.

**Economy/Laws/Factions:** preserve F1–F5, exact effect versus claim versus duty/authority distinctions and all D01–D11 residuals. No invented tax/warrant/insurance/gang policy or guaranteed concealed-revenue benefit. Synthetic domain variants may supply explicit narrow rules to exercise generic machinery; they do not become universal policy or an implementation of those systems.

**Atlas/RC/ZANT/Unity:** detached descriptive/diagnostic views, authored spatial records and presentation retain their owners. Reference resolution does not establish observation, hearing, identity binding or permission. No adapter, shared executable schema, spatial transform or Stage 13 work is needed or authorized.

## Persistence, hash and loss design constraints

The first successor should specify its own finite full-prefix contract with explicit mandatory records and optional derived views, without borrowing an accepted identity. A tagged new digest domain may borrow deterministic JSON techniques, but exact source identity, serialization domain, root/head/receipt/row scopes and raw-file bytes must be stated and tested as separate identities. A hash is neither truth nor actor access. No particular wire spelling or hash-domain token is installed here.

The Director's proposed smallest storage pattern retains four conceptual tables for new root, history, meta and optional accelerators, using a newly versioned full-state body. Similar table names do **not** make existing C1 schema, root, policies, DBs or proof domains compatible. An isolated serialization/census spike cannot qualify the resulting state engine, SQLite publication or durability guarantees.

### Synthesis profile under review

The following Director-selected first-proof limits are **proposals requiring owner approval and later implementation measurement/qualification**, not measured product support or a claim that all maxima can coexist:

| Proposed limit | Candidate value |
| --- | --- |
| Total semantic admissions per synthetic world | 64; all operation kinds share this global budget |
| Actors / organizations | 16 / 4 |
| Content roots / content versions | 32 / 64 |
| Receipts / actual transmissions | 128 / 64 |
| Explicit derivations / premise edges | 32 / 128 |
| Cases / tasks | 16 / 32 |
| Maximum complete encoded state | 128 KiB |
| Root + full history + accelerator encoded bytes | 8 MiB |
| Semantic intent / complete privileged prepared request / query output | 8 KiB / 160 KiB / 64 KiB |
| Memory / physical workspace bounds | 256 MiB / 1 GiB |
| Per-query traversal nodes / edges / depth | 256 / 512 / 8 |

Per-kind counts do not promise a workload reaching each cap: one acquisition/transition may consume several kinds of records and full-state history bytes, while all semantic admissions count toward 64. The integrated candidate retains the **full coarse private state witness**, charged within the 160 KiB prepared-request cap; the 8 KiB limit applies only to semantic intent. A compact commitment-only witness is not selected. Both complete witness and poststate, as well as result/receipt/root/accelerator and actual writer overhead, count toward the coupled history/recovery profile. Request/result/validation/replay cost, content/premise fan-in, per-operation staging and SQLite page/journal overhead must additionally be charged. No fixed numeric work bound or backend-support result follows from this table. If a selected cap cannot be independently justified, the implementation must lower/revise the approved profile through review rather than claim inherited C1 capacity. Optional libraries remain unnecessary for the proposed standard-library first proof.

Recommended smallest loss behavior: mandatory proof loss/corruption stops verification and new writes; optional derived graph/cache can be discarded/rebuilt from mandatory admitted inputs without canonical writes. If an accelerator exists, define whether its bytes are committed and what missing versus present-corrupt means. Do not mix accepted C1's optional ignored-invalid accelerator policy with B0's proposed committed G9 whole-row absence/exact scratch reconstruction contract. The latter is a separately reviewed proposal, not an implemented dependency or default recovery promise.

Current accepted C1 support is the measured Windows 11/Python 3.12.0/SQLite 3.42.0/win32/DELETE/EXTRA/UTF-8/fixed local storage process-crash model with retained N01/N02. A successor must declare and independently qualify its actual backend/profile; copying source or matching a version label does not certify it. No automatic mid-flush/power/device/whole-volume-ENOSPC/ACL or exhaustive same-version backend discrimination is inherited.

## Full successor proof and regression obligations

**Fresh legacy/C1 regression and successor qualification are separate.** Baseline commands can prove accepted bytes and behavior remain preserved. They cannot demonstrate a new implementation's guarantee, even if it reuses none of C1's code. Conversely, rewriting the implementation does not waive the guarantees the new candidate claims. Every applicable C1 architectural obligation needs a successor test or an explicit approved exclusion; method counts/old head hashes cannot simply be copied as a PASS label.

| Proof family | Required successor evidence and oracle |
| --- | --- |
| Authority/identity | Qualified bindings and wrong world/lineage/producer/incarnation/result conflicts; authored root and source/profile mismatch rejection; no silent actor merge or legacy bridge. If lifecycle/remap is claimed, test current versus historical binding, offline/tombstone/revision scope |
| Pure derivation/witness | Independent complete result/state rederivation; stale or incomplete witness; supplied-result mismatch; participant attempted mutation/reentrancy/async behavior; exact operation effect once. Include a non-social controlled effect to demonstrate sole installer alongside social state |
| Retry/correlation | Exact old request after intervening state still returns original receipt; changed request/result under old identity fails; retry after uncertain publication/reopen produces neither duplicate acquisition nor duplicate task/referral |
| Logical time | Chronological due work with stable ties, cancellation/fulfillment and no unsettled due work in an admitted state where claimed; no read/host-clock/random/async hidden advance; historical knowledge and actual occurrence time distinct |
| Durability/recovery | Commit-before-ack, close/reopen, ordinary process windows, stopped writes during uncertain publication and deterministic reconciliation. State exact executed crash model; do not rename COMMIT-entry interruption arbitrary mid-flush evidence |
| Prospective capacity | Independent actual count/byte/work/memory/workspace/retry/query census; limit−1/at/+1, combined limits, staged allocated pages and free-list/journal overhead; conservative refusal preserves old readable head. Reproduce a successor-specific analogue of C1-B01's acknowledged-head/cold-reopen boundary, not just C1's historical PASS |
| Proof inventory/loss | Canonical data/domain checks; required row/source/policy/receipt/index loss/tamper; externally anchored rollback/alternate-history control; optional projection loss/corruption and no read repair. No checkpoint-only trust or old-head fallback |
| Detached reads/sealing | Snapshot mutation/foreign snapshot refusal as applicable; reads leave DB/time/state unchanged; unknown/denied/missing guessed refs; audience/cutoff/cache/alias/count/hash/error substitutions; privileged provenance inaccessible to actors |
| L1 semantics | All inherited A–L synthetic cases plus phantom subject, unknown correlated origin, alternative support sets, support qualification invisible to nonrecipients, access revocation versus receipt and historical re-identification. Support is not universal truth/psychology |
| L2 composition | One actor/multiple functions and compartments/multiple actors; every transition cites actual inputs, policy, actor/grant and cause; partial referral, queue limit/refusal, close/reassess, no blanket organizational knowledge/power |
| Dependency removability | Optional graph/export/rule helper absence cannot alter admitted state, recipient scope, proof/retry or deterministic authority. No full library object serialization becomes the only history |
| Accepted baseline preservation | Run `python -B tools/repo.py doctor`, `integrity`, relevant disposable legacy wrapper/all, and both accepted C1 verifier commands from exact external copies as documented. Preserve 27-method and B01 scopes separately, IR3 24 pass/1 actual fail/0 skip, RC HOLD and ZANT incomplete mixed states. No writes in frozen packages |

If exact C1 tests cannot run on a new API, provide a case-by-case semantic mapping, new independent assertions and explicit changed/unsupported capabilities. For a comparable non-social fixture, compare semantic outcomes; new root/hash identity means byte-identical heads are not the expected oracle. C1's accepted source stays separately runnable as the reference baseline. Do not weaken original tests or restore Stage 10 removals to satisfy historical full-state verifiers.

The [P0 test plan](../preflight/INFORMATION_ECONOMY_TEST_PLAN.md) and [boundedness model](../preflight/INFORMATION_ECONOMY_BOUNDEDNESS_PREFLIGHT.md) supply adversarial categories; these tables add successor-specific obligations. No successor behavior, backend support, performance or test PASS is established by this architecture report. Implementation requires approved exact support profile, test seams and independent I/J review after code exists.

## Recommendation and unresolved decisions

Recommend the new native bounded standalone proof, pure L1/L2 participants, one L0 installer, no migration, explicit acquisition/referral operations, mandatory finite history and replaceable derived views. Source authentication is optional scoped evidence; support invalidation diagnoses explicit support state without a universal belief engine. These choices avoid changing accepted Core or relying on a nonexistent bridge/runtime dependency.

Gate A must approve the exact candidate and first capability/deferral set, numeric support envelope/refusal policy, source/root/persistence/loss contract and independent proof plan. It must distinguish that new work from B0/B1's separate requirements and accepted C1. Any owner request for a real C1 upgrade, M3 integration, broad migration, automatic cognition, domain enforcement or playable slice is a different concrete scope. No commit/push/publication or Stage 13 authority is inferred. **STOP at Gate A.**

## C/G cross-review of the integrated candidate

Reviewed [Architecture Candidate v0.1](INFORMATION_ECONOMY_ARCHITECTURE_V0_1.md), particularly §§2–9 and §§12–16. This is the assigned specialist cross-review, **not independent Auditor J sign-off**. Source/library facts and future runtime guarantees are not newly certified here.

The selected EA-IE namespace/new-world boundary, sole L0 installer, L1 realization of accepted KW semantics, container receipt versus actual individual notices, exact selective referral, holder-qualified support and no automatic Player belief are coherent. Accepted source packages, original accepted archives/evidence and any accepted-world DBs remain immutable/read-only reference material: a new proof world cannot write, convert, repair, normalize, delete or replace them. Source changes require a new exact-source proof identity, not relabeling the accepted baseline.

The former request-size mismatch is resolved by the candidate's 160 KiB complete privileged request with full coarse witness, separate 8 KiB intent and conjunctive history limits. Near-limit full states may exhaust the 8 MiB history cap well before 64 admissions. S5's toy witness-plus-poststate accounting illustrates that interaction but omits real root/result/receipt/policy/SQLite overhead and is not native successor qualification.

Cross-review findings CG-A01–CG-A03 and documentary closures are recorded in the [semantic specialist cross-review note](IE_INFORMATION_SEMANTICS_CANDIDATES.md#integrated-candidate-cross-review). Rechecked candidate §8 now includes explicit `Derive` conclusion/support/holder-receipt admission and controller-authorized bounded L0 `AdvanceTime`; §10 restricts actor-facing contradiction grouping to acquired handles/associations. The revised three-valued support and local causal-position rules retain required unknown/cycle/atomic-receipt distinctions. **No remaining C/G blocker to presenting the candidate at Gate A.** This is specialist documentary review, not permission to implement, owner acceptance, successor qualification or independent I/J sign-off.
