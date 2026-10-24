# Information Economy Substrate — Architecture Candidate v0.1

Status: **PROPOSED FOR GATE A; NOT OWNER-ACCEPTED OR IMPLEMENTED**. Architecture-only work authorized after Gate P0. This document selects a coherent first implementation proposal for owner review; neither this selection nor the disposable experiments activates a runtime. [Gate A proposal](INFORMATION_ECONOMY_GATE_A_PROPOSAL.md) defines the exact approval boundary. Date: 2026-10-23, America/New_York.

## 1. Purpose and evidence

Represent what an actor or controlled record has actually acquired, claims, can presently access and derives, including falsehood, uncertainty and disagreement. Support reusable organizational processing without a second world truth or an organization-wide mind. Encounter alone admits actual observations, receipts, state changes and consequences. A true receipt of a false accusation must never make the accusation true.

Evidence and authority remain separate: [P0 context](../preflight/INFORMATION_ECONOMY_CONTEXT_INDEX.md) identifies accepted C1, accepted KeyWrapping/Economy design and proposed B0; the six specialist reports distinguish primary evidence, inference and recommendation. [Spikes](INFORMATION_ECONOMY_SPIKE_REPORT.md) answer small algorithm/serialization questions, not complete successor correctness. Existing C1 and legacy regression results in P0 are not IE tests.

## 2. Native consumer / successor decision

Select a **new native bounded Encounter reference successor**, working identity `EA-IE/0.1`, proposed source location `packages/encounter-ie-reference/0.1.0/`. Its consumer is a trusted synthetic reference harness and developer inspection API, not Unity, a playable scene or a live M3 game. No package/root is created in this phase. The name is a proposed native package identity, not acceptance of C2/C2.1 or a shared cross-system schema.

If approved for implementation, the successor has **one L0 installer, one versioned root, one admitted history and one transaction boundary per world**. L1 and L2 are pure deterministic participants in that same transition, not services with their own authoritative DBs. A new world is authored for this proof; it is never an overlay of a live accepted C1/M3 world. Accepted C1 remains an independent preserved historical implementation, not a second writer to the new world. No import, migration, old-root compatibility, dual write, bridge or simultaneous ownership of a world is supported.

Prefer deriving the small C1 identity/admission/retry/publication/full-prefix mechanisms into a new `eaie` namespace after explicit Gate A permission, retaining their provenance and tests. This requires requalification under the new exact source, root, profile and policies. If a mechanism cannot be preserved without broad redesign, stop that implementation milestone for review rather than quietly replacing Core. The existing six-file C1 execution digest and all 25 package files remain unchanged. A rewritten mechanism earns no inherited acceptance merely because its algorithm resembles C1.

Retain the four-table physical pattern (`root`, `history`, `meta`, `checkpoints`) **in the new proof only**, with a new strict full-state contract. New informational/organizational state belongs inside the admitted state. No optional SQLite sidecar may determine future knowledge, grants, queue order or consequences. Its root selects exact source/policy/content/profile/backend identity; foreign identities refuse. Frozen C1 actually rejected an extra-table probe in a disposable copy (`STORE_INVENTORY`); that is a rejection control, not a successor implementation.

## 3. Responsibility allocation: L0, KeyWrapping, L1, L2, L3

KeyWrapping is a semantic authority, not a competing storage layer. L1 is the **single native realization of the relevant accepted KeyWrapping semantics** in this proof. Do not maintain a KeyWrapping learned-book alongside a different IE knowledge inventory. KeyWrapping's composer/handle/reference presentation remains a consumer of that one acquired basis; full KW runtime and representations remain unaccepted. No accepted KW invariant is changed here.

| Responsibility | Semantic owner / implementation responsibility | Explicit boundary |
| --- | --- | --- |
| World identity, actual events/state/time, grant validity and committed effects | Encounter L0, sole native installer | Information can refer to actuality or an allegation; it cannot rewrite actuality |
| Qualified referents, alleged versus actual subjects, receipt versus stance, source assertions versus actual/known lineage, acquisition and audience sealing | Accepted KeyWrapping design; realized once by native L1 validators/records/projections | No parallel identity/handle/acquisition registry. No Player scratchpad or inferred unexpressed Player belief |
| Immutable information versions, exact delivered fragments, provenance, record existence/access distinctions, explicit derivation and support qualifications | L1 within L0 state | Defines supported information mechanics, not dialogue, universal credibility, guilt or domain law |
| Controlled record/inbox custody | L1 content/receipts plus L0 identities/access policy | Container receipt is not a receipt by its owner, members, manager or intake employee |
| Cases/tasks/queues, route/assign/reprioritize, decision records, referral coordination, closure/reassessment | L2 within the same L0 transaction | Case pointer/assignment/membership is not content acquisition, delegation or action power |
| Membership/hierarchy and normative standing | Supplied L0 fixture authority facts now; future Factions/Laws owners | First proof uses explicit authored limited grants; it does not implement Factions/Governance |
| Response thresholds, coverage, assessment, tax basis, sanctions, trade/value and substantive institutional rules | L3 / Laws / Economy / other separately scoped consumers | L1/L2 may evaluate supplied bounded test policy, not invent or install real-world law |
| BASED, speech performance, dialogue/personality/planning/UI | Higher-layer consumer | Uses eligible acquired content. No private vibe, motive or canonical hash in an actor-facing response |

## 4. Logical record model

These are proposed semantic records, not an installed executable schema. Each is versioned and validated in the new root contract; JSON envelopes/SQL are package-private, not a universal Encounter/Atlas contract.

| Record | Required meaning |
| --- | --- |
| Information item/version | Attributed bounded proposition or fragment; actual creation cause; immutable version identity; subject and validity scope. Correction creates a new version/claim and link, never edits the prior received content |
| Subject | Either a qualified native entity/event reference or a scoped alleged/hypothetical subject supplied through eligible referents. A nonexistent alleged theft is not a newly minted actual theft event or actor identity |
| Acquisition receipt | Actual holder (actor or named controlled container), exact item/version/fragment, channel, logical receipt point, sender/context and originating admitted operation. Intended recipient/co-location/access alone cannot create it |
| Source assertion | What a teller says about source/authorship, possibly false; distinct from actual privileged provenance and what the receiver knows |
| Provenance edge | Typed actual creation/observation/transmission/derivation relationship between exact versions/receipts/events; actual parents precede the child in the total causal order `(admissionSeq, localCausalPosition)`. Privileged lineage can exceed actor-known lineage |
| Record/container | A native qualified document/inbox identity, immutable content versions and controlled custody/access facts. Known existence, possession/custody, lookup permission and acquired contents are different |
| Grant/revocation | Explicit limited record-access or organizational-function basis under root-owned authority policy. A claim of authorization is not this grant. Revocation changes future lookup, not historic receipt |
| Derivation | Actor, exact eligible acquired premises, trusted finite rule/version, conclusion item/version and inference point; alternative justification sets are ORs of AND-premises. No arbitrary Python callback or world-truth lookup |
| Support qualification | Explicit holder-eligible withdrawal/correction/challenge/expiry basis and its acquisition/cause. Never means deletion of original claim, receipt, inference or historical stance |
| Stance | Optional explicit expressed/modeled NPC assessment of an acquired proposition; no universal confidence score, no automatic assent and no unexpressed Player psychology |
| Case/task/decision | Exact received-fragment basis, organizational processing scope, state, assigned function/actor, original enqueue point, bounded priority/due fields, transition cause/policy and decision record. No full-file dereference from a pointer |

Qualified refs preserve producer, exact artifact/package, local kind/ID, parent scope where needed, native schema/revision/hash domain and relevant world/incarnation/binding scope. New information IDs identify records within this root; they do not redefine people or places. Actor-visible local handles are mapped only after eligibility and cannot reveal privileged canonical equality. First proof has fixture-issued eligible references; it does not implement a new general KW authoring/composition system.

## 5. Acquisition and lifecycle

1. A root-authored or admitted L0 incident/condition may exist with no information receipt at all. Observation requires an explicit allowed acquisition path. A discrepancy observation need not include culprit identity.
2. An NPC can assert an eligible proposition that is false, sincere-mistaken, partial or hypothetical. L0 records the real creation/utterance; it does not validate proposition truth. Actual deception intent, if supplied by a fixture, stays privileged and is not inferred from falsity.
3. Delivery admits only selected source-eligible fragments. The transaction publishes actual receipt(s), provenance and any explicitly requested bounded inbox/task updates atomically. A failed proposal produces no partial delivered meaning.
4. Possessing a document or knowing it exists does not deliver its contents. `AcquireRecord` must validate present lookup permission and exact permitted version/fragment in a real admission, then create a receipt. Actor-view queries return already acquired content; they do not silently learn by reading.
5. Explicit inference, stance declaration, later qualification/correction, access revocation and L2 reassessment are separate admitted acts. Current views may derive eligibility/status from retained admitted inputs; they cannot fabricate communication or rewrite earlier cutoffs.

Current access and previously acquired contents coexist. A grant can be lost while the actor retains the exact earlier receipt; record deletion/unavailability is not forgetting. General NPC forgetting, permanent learned-book availability and device behavior remain deferred owner/design questions.

## 6. Provenance and corroboration

Keep actual origin/support, asserted origin and holder-known origin distinct. An unknown origin remains unknown. Distinct first statements or record IDs do not automatically prove independent evidence. Privileged diagnostics can show correlation/common originating basis without exposing it to a holder that never acquired those links. Any consumer assessment of independence must use its eligible evidence and an explicit policy, not a hidden origin count.

Actual causal lineage points backward in the total order `(admissionSeq, localCausalPosition)`. Earlier positions in the same atomic unit may create an item before its producer/delivery receipt; same-unit forward references/cycles are rejected. Derivation input premises must already exist in an earlier admitted unit, not be invented earlier in the same unit to satisfy inference. Mandatory missing/dangling/forward/cyclic causal parents refuse before publication. Optional genuinely unknown ancestry is explicit unknown, not an empty set certified independent. Actor A→B→A circulation produces additional later receipts of a shared basis, not a causal time cycle or new corroboration. Semantic topic/quote/case links may cycle and require visited-set/work limits. A truncated traversal returns incomplete/affected, never invented independence or certified complete support.

Authentication, if represented, attests only the authored identity/signing/source context actually acquired. It does not certify proposition truth. No cryptographic identity platform, universal evidence score or PROV conformance claim is needed in the first proof.

## 7. Access, possession and sealed disclosure

Access checks run before ranking, graph expansion, labels, counts or serialization. Actor enumeration starts from that actor's acquired receipt/known-existence basis, not a global item scan whose shape leaks hidden data. Case lookup requires both acquired existence and the required present access; a guessed unknown/missing/denied reference has one actor-visible unavailable form. Privileged diagnostics may distinguish the causes.

Every cache is scoped by holder, exact privileged snapshot/cutoff, actor information basis and policy version. Privileged root/head/hash/census, other actors' receipt counts and hidden source edges never become actor tokens, revision gaps or error detail. Pagination uses only actor-local acquired ordering/handles and eligible records; no global offset/count watermark is disclosed. A bounded incomplete response cannot label its partial origin/support analysis complete.

The reference API and prepared witness are trusted developer interfaces, not a network security boundary. Native command refusals, full witnesses and global capacity diagnostics stay privileged and do not filter an actor's speech menu or generate an automatic outward refusal. The first proof tests logical content/metadata/order/error sealing and read purity; it does not certify timing, physical resource or hostile multi-tenant side-channel immunity. A future live consumer needs its own boundary review.

## 8. Transmission / referral atomic units

| Proposed operation | Atomic admitted unit / what does not follow |
| --- | --- |
| `AssertClaim` / explicit `Observe` | Create one bounded item/version and actual producer/observer receipt with allowed referents/context. No automatic witness, belief, police or institution receipt |
| `Deliver` | Freeze selected fragment/version/source assertions; create actual receipt for up to four explicit targets (actor or container) plus actual transmission edges; optional permitted L2 intake updates within the same bounded transaction. A container target does not include its employees |
| `AcquireRecord` | Revalidate current grant, known record existence and selected content; acquire the exact fragment/version into the named actor's receipt. Detached later queries do not reacquire |
| `Derive` | Validate named holder, exact already-acquired earlier premise versions/receipts, rule/version, bounded alternative sets and conclusion; atomically create immutable conclusion, derivation/support links and that holder's conclusion acquisition receipt. No new observation, hidden premise, automatic stance or world-truth assertion |
| `OpenCase` / `RouteTask` | Use an existing container receipt and authorized processing scope to create/move bounded bookkeeping. Does not deliver contents or confer standing. Any selected dispatcher notice is an explicit receipt in the same transaction, counted against the four-target cap |
| `AssignTask` | Change assignment and deliver a minimal authorized assignment/existence notice to the named actor atomically, including the eligible actor-local record/fragment existence handle needed for a later `AcquireRecord`. It names only the selected receiver-held slice/version, never a sealed original-file backlink. If that existence cannot be disclosed, refuse. No content receipt or grant is implied; handler still needs an actual permitted read |
| `TransitionCase` / `RecordDecision` | Validate actual acquired case basis, function grant, current state and pure selected policy. Record cause/reason. No automatic external action, legal truth or belief revision |
| `Refer` | A restricted `Deliver` to named receiver inbox/actor with optional receiver case creation atomically. Sender disclosure authority and destination-controlled intake policy/current receiving scope are independently required. Optional receiver case creation additionally requires receiver-controlled workflow authorization; without it refuse that requested combined unit or explicitly submit delivery-only instead. Carries only selected eligible fragments and permitted source assertions; no grant inheritance, full-file expansion or automatic onward relay |
| `QualifySupport` / `DeclareStance` | Record the explicit holder-eligible qualification or stance with exact receipt/rule/cutoff basis. Stance declaration is separate from support status |
| `SetRecordAccess` | Scoped native authority-validated grant/revocation; prior acquisitions remain. No general normative delegation or Factions simulation |
| `ApplyReferenceEffect` (L0) | After an explicit decision, separately validate root-owned grant, selected cause/policy and exact retry, then admit the one allowed neutral Env `+1` counter effect for that decision's fixed reference-effect slot. Native L0 retains a consumed `(decisionID,effectSlot)` credit with the original receipt; a different operation ID cannot apply that slot twice, while exact original retry returns its receipt. No L2/library writer, arbitrary effects or police/payout implementation |
| `AdvanceTime` (L0) | Only the root-authorized trusted controller may propose a nondecreasing target tick. Validate exact witness; settle at most eight already-admitted L0 due jobs in `(dueTick, originalOrdinal)` order and publish the new clock atomically within the same byte/work limits. It does not deliver queued information, alter stance, perform workflow transitions or grant actors new world knowledge. Queries and qualifications never advance time implicitly |

Task lists shown to actors contain only actually acquired assignment/intake notices and permitted fields. First proof does not expose a magical complete organizational queue. A dispatcher must itself receive the selected intake/existence notice or explicitly acquire a permitted queue-record fragment before reasoning about it. Trusted scheduling can propose work, but it is not an NPC knowledge source.

Cross-organization referral is local to this one world/transaction, not a distributed exactly-once guarantee. Exact retry returns the original receipt without duplicate content/case/task/effect. Repeating the same words in a new real transmission is a distinct operation, with correlated provenance intact.

## 9. Inference and initial support invalidation decision

Select **inspectable support invalidation only; no automatic stance revision** for the first substrate. This is a resolved architecture recommendation awaiting Gate A approval, not an unanswered implementation default.

Derivations contain at most three alternative justification sets, each with at most four earlier eligible premises; depth ≤8 and total premise edges ≤128. Pure authored rule evaluation uses immutable eligible input, a finite validated expression/decision table and `TRUE / FALSE / UNKNOWN` for missing information. Absence is not falsity. No arbitrary code, regex engine, unrestricted recursion, hidden world query or autonomous rule firing.

For a holder and cutoff, support status is derived from that holder's acquired premises and qualifications (including an explicitly acquired validity interval and permitted logical time). For an AND-premise set, one definitively unsupported premise makes the set `UNSUPPORTED`; all supported premises make it `SUPPORTED`; otherwise it is `AFFECTED/INDETERMINATE`. Across OR-alternatives, one supported set makes the conclusion `SUPPORTED`; only if **every** alternative is definitively unsupported is it `UNSUPPORTED`; otherwise it is `AFFECTED/INDETERMINATE`. Dirty/unvisited/missing eligible support must not collapse to known unsupported. `SUPPORTED` means an admitted justification remains eligible under the selected rule; it does **not** mean proposition true. Exact diagnostic subcodes can be refined within those meanings.

A source withdrawal, present access loss, once-true data becoming outdated, actual proof corruption and a holder receiving correction are different. Hidden withdrawal/world change does not alter holder-visible support. Revocation does not retract prior receipt. Missing/corrupt required canonical support makes native verification unavailable; it is not a gameplay rumor qualification. A known acquired expiry can affect the qualified current view at the known time without adding a new fact or stance.

An explicit qualification marks affected descendants before any cached `SUPPORTED` result may be reused. Bound that admission's affected traversal; if the whole consequential closure cannot be accounted within native work bounds, refuse before commit. Queries may return bounded incomplete/affected explanations but may not leave a stale certified-supported cache. A small support graph permits full recomputation; no mandatory persisted cascade worker is needed initially. Original inference and recorded stance survive; an actor/consumer must explicitly declare a later stance or reassess a case. Prior actual consequences are not undone by support loss.

## 10. Time, contradiction and changing information

Use one Encounter integer logical clock plus total admission sequence. Store occurrence/validity time separately from actual receipt, derivation and later discovery. Late reports never backdate acquisition. Contradiction grouping compares proposition subject/predicate/scope and overlapping validity; actor-facing grouping uses only acquired handles/identity associations, while privileged diagnostics may use canonical identities. Secret aliases must not be merged by an actor-facing grouping query. An old correct location and a later location need not contradict. Competing claims can coexist with no selected winner.

No host clock, timer, async completion, LLM or random draw mutates information/workflow state. Wall-clock timings are benchmark evidence only. Random rumor spread is deferred; if later needed, it requires explicitly admitted algorithm/seed/choice causality and review.

## 11. Generic organizational machinery and domain separation

First workflow states: `queued → assigned → in_review → decision_recorded → closed`; `reopen` is an explicit new-evidence reassessment back to `queued`. Reopen retains the same case identity and all earlier receipts/decisions/closed task, creates a new linked task with enqueue age equal to the new reopen admission, and names the actually acquired new-evidence receipt. The retained old task does not silently reset or disappear; all tasks, including closed/reopened ones, count toward32. Reprioritizing an existing task still retains its own original age. Referrals and notices are explicit operations, not automatic state-entry callbacks. Screening/flagging/analysis are recorded decisions/reasons over acquired data; they need no mandatory department/job hierarchy.

Queue key: **descending bounded priority, due-null-last, logical due tick (fixed zero placeholder when absent), original enqueue sequence, native task ID**. Reprioritization is logged and retains original enqueue age. Any selected deadline is a routing condition, not autonomous enforcement. State transitions recheck current grants, input basis and full native witness at commit.

The same table supports a sole proprietor performing every function, a compartmentalized business/insurer, and separate police/tax/gang-like fixture configurations. Supplied policies differ; the mechanism does not. Tiny organization grants must still be explicit. Larger fixture members have separate content receipts and scopes. A report can cause a false yet authorized decision and the neutral reference effect; no actual arrest, insurance payout, tax liability or criminal policy is implemented. [Organizational candidate](IE_ORGANIZATIONAL_PROCESSING_CANDIDATE.md) marks broader lifecycle vocabulary as documentary alternatives, not extra first-proof requirements.

## 12. Finite workload profile and retention

Select a **small finite proof**, not a city-scale or indefinite campaign. Proposed maxima are immutable root profile limits. All are conjunctive; reaching any one can refuse an otherwise valid proposal. Per-kind maxima need not be simultaneously reachable and there is no guarantee of 64 successful large operations. Each A–L test uses a separately authored finite world.

| Axis | Proposed first-profile maximum |
| --- | --- |
| Semantic admissions, including acquisitions/qualifications/queue changes/effects | 64 total per world; refused attempts and detached queries do not add semantic history |
| Actors / organizations | 16 actors / 4 organizations; authored identities, no inferred membership |
| Information roots / all immutable versions | 32 / 64 |
| Receipts / transmissions / derivations / premise edges | 128 / 64 / 32 / 128, all within total admission/byte/work limits |
| Cases / tasks | 16 / 32 |
| One delivery / one transaction's L2 updates | ≤4 explicit targets / ≤8 queue/task changes, counted before publication |
| One fragment body / semantic intent body | 512 UTF-8 bytes / 8 KiB canonical bytes; actual escaped encoded storage also charged |
| Complete private prepared request | 160 KiB canonical bytes, including full coarse state witness and envelope; not the 8 KiB intent limit |
| Full current admitted state | 128 KiB canonical bytes, including L0/L1/L2 and consequential indexes if any |
| Root + mandatory full history + optional accelerator encoded bytes | 8 MiB total; exact new canonical storage domain charged before publication |
| Optional accelerators / due jobs | ≤8 / ≤8; accelerators never replace required history |
| Support alternatives / premises / depth | 3 / 4 / 8; all premises precede conclusion |
| Actor-query traversal / reply | 256 visited eligible nodes, 512 eligible edges, depth 8, 64 KiB encoded reply; incomplete results labeled, no unrestricted path enumeration |
| JSON structural limits | Complete request/state nesting ≤24, object keys ≤128, array members ≤256, total value nodes ≤32,768, generic string ≤4,096 UTF-8 bytes (fragment remains ≤512); integers within ±(2^53−1), duplicate keys/floats/nonfinite/opaque values refused |
| Logical time | Nondecreasing integer 0–1,000,000 fixture ticks; no universal seconds conversion |
| Memory / reserved workspace | 256 MiB / 1 GiB proposed qualification ceilings, not measured successor guarantees |
| Deterministic work | Proposed ceilings inherited only as numbers to requalify: 40M admission/checkpoint, 20M cold/retry/query units; exact charged stages described below, no CPU-cycle guarantee |

Retain the complete root/admitted chronological prefix, exact content versions/fragments, operation identities/receipts, authority/policy basis, qualification history and causal supports necessary to rederive and answer the selected historical cutoffs. No pruning, compaction, destructive collection, summary replacement, hidden eviction or history cap increase. Cold replay and acknowledged exact retry must remain possible under the same admitted profile. If a smaller valid request still fits after a refusal it may proceed; a full world stops when no permitted continuation fits.

History/source caches can be rebuilt/discarded only when admitted meaning, historical views, receipt/retention obligations and future continuation are unchanged. Staleness/forgetting/record destruction never authorizes canonical proof deletion. No private archive is an ordinary runtime requirement.

## 13. Coupled costs, safe limits and evidence

Retain full coarse **private** request witnesses for the first proof instead of inventing compact head-only concurrency witnesses. The trusted preparer captures complete relevant L0/L1/L2 state plus selected source/policy/profile identity; the 160 KiB full-request cap accommodates the 128 KiB state plus bounded intent/envelope. Refuse if it does not fit. The witness is never actor-facing. A compact commitment scheme is deferred until completeness can be independently proved.

Charge canonical root, complete actual request/result/state/receipt history and all optional accelerator payload bytes. Preserve C1's prospective physical-allocation principle in the new writer: complete SQL mutations, measure `P=max(actual file bytes, page_count×page_size)`, then reserve at least `32E + 1,048,576 + 4P` and check live physical files/free storage before COMMIT. New representation may need a **more conservative** formula; implementation must independently measure and refuse/seek review if this formula or ceiling does not cover cold/publication/recovery. No acknowledgement based only on pre-SQL estimated row size.

Deterministic work census charges every actual canonical byte parsed/validated/serialized per stage, record/node/edge visit and predicate term evaluation. For a bounded sort, let `K` be the maximum encoded full tuple-key length; charge key construction bytes plus `max(1,K)×n×ceil(log2(n+1))`, not only comparison count. Keys/integers have the structural/byte bounds above. Each charged pass is counted separately, not one byte count reused for all passes. Before a potentially large stage, reserve the conservative bound; abort/refuse on missing cost basis. Cold replay, exact retry and actor query have separate counters. Final implementation binds this recipe and integer arithmetic in source/profile identity and independently tests undercount/one-over; these numbers do not certify CPU/RSS. Use external qualification measurements for physical memory/workspace and do not claim an in-process Python memory limit is an OS sandbox.

**An admission must also preserve future verification feasibility.** Before COMMIT, use the actual prospective encoded root/history/request/result/receipt set from the writer transaction for a complete scratch cold rederivation under the selected verifier/census; verify its exact prospective head/state and reserve/check the full cold cost ≤20M. Separately reserve/verify the worst supported exact retry, including the oldest acknowledged operation under that future prefix, ≤20M. Admission's own ≤40M counter includes its actual staged work; it is not a substitute for the lower future cold/retry caps. At an 8 MiB prefix, three byte passes alone exceed 20M, so the work cap can refuse well before the byte cap. Never acknowledge that state and hope a warm cache makes it readable.

The required query envelope is deliberately narrow and must remain feasible: privileged current boundary/census and exact receipt-by-operation; each holder's acquired current/historical receipt page of at most four entries plus eligible support/existence lookup. For these promised recipes, check conservative future cold-plus-selected-query phase budgets under the same profile before admission; use bounded holder-only indexes derived from retained data. Larger graph/why-path enumeration may return explicitly incomplete/unavailable within its independent query caps. Queries do not promise every graph expansion completes. Independent qualification must demonstrate all A–L minimal worlds and at least one 16-admission nominal mixed information/organization sequence fully complete, reopen, answer these promised queries and exact-retry the oldest admitted operation; “refuse everything” is not a passing envelope.

The revised S5 toy charged both full witness and poststate. A roughly 48 KiB state completed 64 toy rows within 8 MiB; a near-128 KiB state refused the 32nd row at the prefix byte limit. That is intentional coupled-limit behavior. The toy omits real result/receipt/root and replay-policy overhead, so even those operation counts are **not successor capacity promises**. Unicode escaping, fan-out, large witnesses, accelerators, invalidation closure and combined cases require independent actual-writer qualification. See [spike evidence](INFORMATION_ECONOMY_SPIKE_REPORT.md).

Refusal must precede semantic publication, preserve the prior acknowledged boundary and deliver no partial recipient/task/effect. Publication uncertainty uses native reconciliation and exact retry; do not mislabel an uncertain physical COMMIT as proven no-write. Global native errors remain privileged. Actor queries cannot secretly make room, drop history or advance the clock.

## 14. Persistence, reload, hashes and rollback

Use Python 3.12.0 / SQLite 3.42.0 on the bounded Windows 11 local fixed-disk reference deployment for initial qualification, with selected win32/DELETE/EXTRA/UTF-8/page configuration and inherited N01/N02 limitations explicitly rechecked. No broader binary/backend/power-loss certification follows. New root/profile/source/backend mismatches refuse; no automatic upgrade or compatibility promise with accepted C1/B0/legacy saves.

Canonical data is strict JSON-only, sorted keys, compact ASCII-escaped encoding, bounded integer domain, no floats/opaque objects/coroutines and no final stored newline. Enforce byte and lexical nesting/token bounds before recursive decode, with string/escape-aware scanning; reject duplicate keys/nonfinite constants and validate all structural/type/count bounds before semantic use. Exact token handling is versioned/tested, not an assumed property of standard `json.loads`. Source, root, history/semantic heads, native item/version and raw archive/file hashes have distinct domains. The new source identity includes all writer/reducer/policy/serialization/fixture semantics used in replay. Every history link binds previous head, sequence, original request, result/receipt and derived full state; current meta must match the fully rederived prefix. Exact domain tags and local version tokens are frozen in the new implementation contract before any world is written and reviewed independently; none is an executable shared schema in this phase.

Commit is one transaction followed by acknowledgement. Close/reopen must independently rederive state, provenance, access, queues, support qualifications and ordering; optional graph/index caches cannot establish truth. Accelerators are derived and non-authoritative, with bytes charged and bounded invalid accelerators ignored only under the new explicitly selected C1-like contract. B0's absent-only G9 scratch reconstruction is **not adopted**; mandatory root/history/support corruption makes verification unavailable, not actor misinformation.

No migration is included. Preserve accepted sources/DBs; create only new proof worlds in separate output directories. Rollback means removing the new proof from use and retaining its source/evidence; it does not downgrade a mutated accepted world because none is admitted. Source changes invalidate existing exact-source proof worlds unless a separately approved future version/conversion exists. Tests must include unsupported old/new roots and no-overwrite behavior.

## 15. Deterministic admission and ordering

The trusted controller submits explicit intents one at a time. The native installer validates caller/world/lineage/producer/incarnation and exact operation/result identity, then exact prior replay **before** current staleness checks, then current full witness, grants, inputs, work/bytes and pure L0/L1/L2 result. It atomically publishes once. No callback independently mutates any family. Concurrent/stale proposals refuse/reprepare under native rules; there is no async worker race, external arrival sorter or distributed executor.

Native IDs derive from root-qualified admission/position, not timestamps, UUID randomness or object addresses. Freeze a causal local-position recipe: validate all preexisting inputs first, create content/conclusion versions before their receipts/links, then receiver-case/task updates and selected notices whose parents exist earlier; targets within each compatible stage use target-kind/native-ID/requested-position order. Reject duplicate targets, forward/cyclic same-unit parents or missing preexisting derivation premises. Queues use §11's stable key. Graph/support traversal uses stable qualified order and visited sets. Same admitted inputs/root/source/policies produce the same semantic state and projections across hash seeds and reconstruction; performance timestamps are excluded from semantic hashes.

## 16. Minimum capability set / explicit deferrals

| Minimum first proof | Acceptance obligation |
| --- | --- |
| Root-qualified actuality/actor/record/event and alleged subject references | One native authority; unseen and fabricated-event cases A/C; no name-based identity join |
| Observation, attributed true/false/mistaken/stale/conflicting claims and immutable records | No claim-to-truth conversion; correction/history and validity distinction B/C/F |
| Exact receipt, possession/access/existence distinction and revocation | G/K; query does not acquire, revoke does not unlearn |
| Selective transmission, actual/asserted/known provenance and correlated origins | D/E; unknown and repeated sources do not imply independence |
| Explicit bounded derivation and holder-qualified support diagnostics | L; surviving alternatives, dirty/incomplete states, historical stance preserved |
| Generic intake/route/assign/analyze/decision/referral/close/reopen bookkeeping | H/I/J/K with one actor and compartmentalized multi-actor variants; no implicit powers |
| Finite pure policy table and deterministic ordering | Same-input replay/hash-seed/queue-order controls; no engine/LLM side effects |
| One neutral L0 reference consequence from an information-based decision | False information can causally lead to an authorized numeric fixture effect without changing the original incident; exact retry once |
| Commit/reopen, exact retry/uncertainty, full causal retention, safe limits | Independent regression, corruption/refusal/coupled-boundary tests on actual new writer |
| Machine-readable author diagnostics and sealed actor views | Receipt/claim/derivation/queue “why” with qualified causes; paired hidden-state/read-purity controls |

Defer automatic belief/psychological retraction, universal confidence/value scores, probabilistic rumor spread, natural-language parsing/generation, full BASED/KW composer/UI, Player notes, permanent recall/forgetting policy, full domain packages, real enforcement/payouts, GOAP/HTN, LLM memory, general auth/crypto, distributed delivery, async background work, compaction/mode-B recovery/migrations, scale beyond this profile, native M3/C1/B0 bridges, Atlas UI/RC/ZANT bindings, playable slice and Unity/Stage 13. These require new scope; they are not silent reductions of tested first capabilities.

## 17. External libraries

Select **zero new external runtime dependencies** for the first proof: Python standard library JSON/hash/collections/SQLite and explicit bounded tables/traversal. PROV and support-maintenance ideas inform semantics; no PROV/RDF runtime or general LTMS is required. NetworkX/PROV export remain optional later developer tools after demonstrated need and exact artifact/license qualification. Workflow/rule/RETE/event-sourcing packages do not remove the hard work of native authority, acquisition, sealing, retention and deterministic admission; they currently add qualification surface without enough saved code.

This is an architecture recommendation for Gate A, not a package installation. No existing library benchmark is claimed: none of the candidates is installed in the selected Python environment. [Reuse evaluation](IE_SOFTWARE_REUSE_EVALUATION.md) explains concrete feature/risk tradeoffs and fallback; [P0 license ledger](../preflight/INFORMATION_ECONOMY_LICENSE_LEDGER.md) remains historical. Any later external code adoption needs its own exact version/hash/closure/notice decision.

## 18. Authoring / diagnostics / higher-layer APIs

Proposed trusted developer interfaces: prepare/admit/reconcile/checkpoint; fixture-authored identities/content/policies; read-only author inspection and sealed holder queries. Proposed L1/L2 operations are §8's internal native intents, not a public network wire protocol or full interaction language. Freeze exact public Python interfaces and exceptions in the implementation specification and document each before acceptance. No general plugin hook or arbitrary policy loading.

Author tools must answer who acquired which version/fragment when; actual versus asserted/known source; common-basis/unknown-origin relationships; contradiction/validity; why a conclusion is supported/unsupported/affected; why a task changed; which policy/grant/cause was used; and exactly what another organization received. Privileged read-only negative diagnostics must also explain why an operation/transition was refused or a record was ineligible, with bounded failed guards, selected policy/input/grant/cost basis and no state mutation. Actor tools show only the actor's eligible acquired answer/explanation with its cutoff and local handles; unknown/missing/denied remain the same actor unavailable form. Author hashes/head/census/raw proof never pass through by default.

Fixtures/policies are finite immutable inputs pinned into the root. Technical synthetic scenarios are not playable content or proof of institutional realism, legibility, balance or fun. A case-label or authored schema string cannot grant action authority. B0 proposed Comm/Receive/Cog meaning is reconciled at the semantic level only; this candidate does not claim full B0 coverage or activate its contracts.

## 19. Failure modes and rejection rules

Reject a candidate/result that needs duplicate authority, hidden truth lookup, shared organizational knowledge, a false true-event anchor, silently independent repeated sources, privileged lineage disclosure, library callback publication, unsupported continuation after proof loss, incomplete analysis labeled complete, acknowledge-before-cold-readability, silent pruning/upgrade, arbitrary code policy or automatic physical-world action. Native unavailable proof is a system limitation, not a false claim or an opportunity to infer an incident did not happen.

Known first-proof limits: no hostile-plugin sandbox; controlled fixture policies; no indefinite campaign or broad schema migration; profile may stop below per-kind maxima; no power/OS/device/whole-volume failure certification; formal side-channel security beyond declared logical-view controls unproven; no actual successor implementation exists yet. The audit must retain these as limitations rather than transform absence of code into PASS.

## 20. Rejected alternatives

| Alternative | Reason rejected / deferred |
| --- | --- |
| Patch frozen C1 or append social tables under its existing root | Violates accepted source/schema/profile identity and current no-edit scope |
| External social DB authoritative beside C1/M3 | Dual admission/history/receipt recovery and identity authority; no approved bridge |
| Adopt B0 C2.1 as installed foundation | Reviewed proposal has unexecuted runtime controls and different checkpoint/hash contracts |
| Separate KW and IE actor inventories | Duplicate acquisition/projection semantics; acceptance overlap unresolved by renaming |
| Compact hash-only witness now | Needs new completeness/concurrency proof; full private witness is simpler, charged and bounded |
| Full provenance/path enumeration or per-NPC world log | Unbounded replication/queries and hidden metadata leakage |
| Global support truth/automatic stance correction | Wrong actor knowledge and unnecessary psychology; use holder-qualified diagnostic invalidation |
| Event-sourcing/RETE/workflow/graph runtime stack | Duplicates existing authority or adds machinery without demonstrated first-proof saving |
| Historical compaction/summary/eviction to keep going | No preservation proof; refuse before losing indispensable support |

## 21. Decisions for Gate A

The candidate resolves a recommended native successor boundary, one KW/L1 realization, bounded L2, finite coupled limits, full private witness/prefix persistence, deterministic pure admission, diagnostic-only invalidation, minimum capabilities and no new runtime libraries. Approval must expressly choose that bundle; it is not already owner direction.

Remaining owner choices are bounded: authorize this isolated native reference successor versus stop/resize; accept the proposed finite envelope and refusal behavior; approve diagnostic-only support invalidation and the listed first capabilities/deferrals, including the neutral reference effect; authorize the exact new-package implementation scope and required independent verification. No Laws/Economy D01–D11 policy, playable content, persistent-world conversion, Factions implementation or KW invariant change is required or supplied. See the Gate A proposal for planned files, stages, review findings and exact acceptance conditions. **STOP AT GATE A.**
