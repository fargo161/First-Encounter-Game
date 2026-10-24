# Architecture cross-review and finding ledger

Status: **completed integrated review ledger; ready for owner Gate A review**. Candidate remains proposed, not owner-accepted or implemented. Separate I and J reviews found no remaining architecture blocker/must-fix; actual successor qualification remains NOT RUN. The Director fixed documentary findings and reviewers inspected the resulting text. No production Builder is active.

## Review coverage and independence

| Required review | Reviewer / evidence | Scope / limitation |
| --- | --- | --- |
| C provenance → D organizational model | C/G specialist, appendices in [semantics](IE_INFORMATION_SEMANTICS_CANDIDATES.md) and [integration](IE_ENCOUNTER_INTEGRATION_CONSTRAINTS.md) | Custodial receipt, assignment, actual individual acquisition, authority and sealed original-case links |
| D organizational practicality → C semantics | B/D specialist, [organizational candidate](IE_ORGANIZATIONAL_PROCESSING_CANDIDATE.md) | Same functions for one actor and compartments; finite explicit grants/selected delivery; not a claim of universal institutional realism |
| E identifies unnecessary custom/library work | E specialist, [software reuse](IE_SOFTWARE_REUSE_EVALUATION.md) | Bounded native requirements still custom; zero external runtime dependencies justified; no unrun library benchmark |
| G authority/integration → whole candidate | C/G specialist, integration appendix | New native sole installer vs frozen C1, KW single acquisition realization, actual/alleged subjects, time and local causal order |
| F authorability/debuggability | F specialist, [game precedents](IE_GAME_AI_PRECEDENTS.md) | Separate safe/privileged inspectors, explicit negative-path reasons, no accidental retrieval/read mutation |
| I independent testability | Separate worker, [testability review](IE_ARCHITECTURE_TESTABILITY_REVIEW.md) and [independent spike evidence](evidence/independent-spike-verification.json) | Does not author candidate/spikes; reruns final toy source, finds malformed-lineage limits, defines future A–L oracles; no IE runtime PASS |
| J independent adversarial architecture audit | Separate worker, [audit](IE_ADVERSARIAL_ARCHITECTURE_AUDIT.md) | Does not author candidate, specialist reports, spikes or I's tests; reports findings rather than silently fixes candidate; design-level verdict only |

Director A authored synthesis and disposable spikes; I and J are separate workers and independent from A and each other. Specialist peer reviews do not substitute for independent I/J. After any future implementation approval, Builder H cannot sign either independent verdict. No reviewer can give owner acceptance.

## Documentary findings and disposition

Severity here follows the draft cross-review classes: BLOCKER, MUST FIX, SHOULD FIX, OPTIONAL, ACCEPTED TRADEOFF. Individual reviewers may also state severity levels; the table maps their needed action explicitly.

| ID / class | Finding | Documentary change / status |
| --- | --- | --- |
| CG-A01 — MUST FIX | Atomic operation table omitted actual derivation despite requiring derivation elsewhere | **CLOSED**, C/G rechecked: candidate §8 `Derive` validates earlier eligible premises/rule/alternative sets and atomically creates conclusion/support/holder receipt; no automatic stance |
| CG-A02 — MUST FIX | Clock/due semantics lacked explicit authorized admission unit | **CLOSED**, C/G rechecked: §8 root-controlled `AdvanceTime`, ≤8 due jobs with stable order and coupled bounds, no implicit query/qualification/workflow delivery |
| CG-A03 — SHOULD FIX | Contradiction grouping might expose a hidden canonical alias association | **CLOSED**, C/G rechecked: §10 actor grouping uses only acquired handles/associations; canonical grouping privileged |
| TI-01 — MUST FIX evidence wording (medium) | S1 originless cycle claims complete/unknownfalse; dangling edge throws; hidden argument unused. Scratch output cannot prove production authorization/origin completeness | **CLOSED documentary**, I rechecked limits: [spike report](INFORMATION_ECONOMY_SPIKE_REPORT.md) explicitly states weakness; §6 requires mandatory causal parent existence/backward order, safe optional unknowns and no empty-origin independence. Actual native malformed-input tests remain NOT RUN |
| TI-02 — MUST FIX consistency (medium) | 8 KiB request did not accommodate full coarse 128 KiB state witness | **CLOSED documentary**, final profile distinguishes 8 KiB semantic intent /160 KiB prepared private request. S5 revised to charge witness+poststate; all candidate/integration descriptions aligned |
| TI-05 — MUST FIX (medium) | “No supported alternative” could wrongly collapse UNKNOWN to UNSUPPORTED | **CLOSED documentary**, candidate §9 explicit three-valued OR-of-AND algebra. Unknown/incomplete/dirty stays indeterminate unless another complete alternative supports or every alternative is definitively unsupported |
| TI-06 — MUST FIX (medium) | Parents-before-admission rule conflicted with atomic creation plus receipt | **CLOSED documentary**, §§4/6/15 total `(admissionSeq,localCausalPosition)` with valid earlier-local parents; external derivation premises must be prior admitted units; same-unit forward/cycles refuse. Spike report aligned |
| EF-01 — SHOULD FIX | Sender disclosure permission alone cannot authorize destination-side case creation | **CLOSED documentary**, §8 `Refer` checks independent destination intake and workflow scope; explicitly requested combined unit refuses without it. Delivery-only requires a separate explicit intent, not hidden fallback |
| EF-02 — SHOULD FIX | Positive transition diagnostics alone leave author unable to explain failed guards | **CLOSED documentary**, §18 adds bounded privileged read-only negative diagnostics with policy/input/grant/cost basis; safe actor unavailable form unchanged |
| S5-R1 — MUST FIX coupled cost assumption | Initial serialization toy counted poststate but not full coarse request witness | **CLOSED documentary/experiment**, retained r0 labeled; revised final source/seed1 and I seed2 charge both. Full-history byte/work costs can refuse long before per-kind maxima; not a successor capacity qualification |
| J-A01 — MUST FIX documentary acceptance condition | Own admission40M/byte8MiB caps did not ensure future cold/retry20M viability | **CLOSED by J direct recheck**: candidate§13/proposal require prospective actual-prefix scratch rederivation, worst/oldest exact retry and promised holder/boundary/receipt query budgets before COMMIT;16-admission usefulness floor; all native tests still future |
| J-A02 — SHOULD FIX exact-contract bounds | Byte caps did not specify predecode structural grammar/full-key sort costs | **CLOSED by J direct recheck**: candidate§12–14/proposal specify depth/object/array/node/string/int bounds, duplicate/nonfinite refusal, string-aware predecode checks, finite expression grammar and encoded full-key sort charging |
| J-A05 — MUST FIX review completion | Auditor must inspect completed exact implementation proposal/ledger, not sign off a future work order | **CLOSED by J direct recheck** of GA01–04/new-file/M0–M5/independent controls/exclusions and final I report. Auditor pins exact reviewed candidate/proposal inputs; final preservation is separate stewardship evidence |
| J-A06 — SHOULD FIX notice selector | Task/case existence alone may not provide the known record selector needed for a later content acquisition | **CLOSED by J direct recheck** of final candidate§8/proposal trace3–4: assignment notice includes only the authorized actor-local receiver-held slice/version existence handle; no content/grant or sealed original-file backlink. I's final delta review pins the same exact inputs |
| DB-01 — LOW / SHOULD FIX implementation pin | Need a complete actual receipt/notice trace and counts, not a documentary arrow that implies handler knowledge | **CLOSED documentary** in proposalM0 eight-admission trace: container receipt, dispatcher notice, assignment existence handle, separate handler acquisition, review/decision/effect/close. All notices counted; I/J delta review covers compound ordering; actual trace remains NOT RUN |
| DB-02 — LOW / SHOULD FIX lifecycle pin | Reopen task identity/enqueue age was left as an implementation choice | **CLOSED documentary** candidate§11/proposal: samecase, retained oldclosedtask/decision/receipts, newlinkedtask/newenqueueage/newacquired-evidence basis. Closedtasks count32; reprioritization retains existingage; I/J delta review covers exact expected behavior |
| TI-03 — REQUIRED IMPLEMENTATION QUALIFICATION (medium) | Toy storage/decode cannot prove actual successor cold replay/retry/physical budget | Retained as **NOT RUN / Gate B condition**: exact proposal M1/M4 and I independent limits/cold/retry/source/backend oracles. This is not an unresolved architecture defect after the gate is explicit |
| TI-04 — REQUIRED IMPLEMENTATION TEST SEAMS (medium) | Need independently observable admission/boundary and separate sealed holder path without arbitrary callback state | Retained as **NOT RUN / Gate B condition**: native pure controlled participants, privileged captures and holder-safe detached queries, independently authored oracles; no actor given raw head/witness to make tests easier |

The auditor's final numbered findings and closure are authoritative for its own review and are recorded in the linked independent audit. No unresolved architecture BLOCKER/MUST FIX remains in the completed packet. Future implementation requirements stay explicitly unexecuted. J-A03 finite/full-witness/no-migration and J-A04 zero-dependency evidence limits are proposed tradeoffs, awaiting owner acceptance rather than technical defects.

## Resolved synthesis choices and accepted tradeoffs proposed to owner

| Choice | Rationale / practical cost |
| --- | --- |
| New native bounded successor, no overlay/import | Avoid second writer and frozen C1 changes; requires independent successor requalification, not a cheap plugin |
| KW semantic ownership with one native L1 realization | Avoid duplicate acquisition/identity/provenance inventory; no new KW composer/Player authoring scope |
| Full coarse private witness | Avoid premature compact-witness completeness proof; higher request/history costs and early refusal |
| Finite conjunctive profile/full prefix/no compaction | Preserve support/retry/reload; can stop below64 operations/per-kind caps; no indefinite campaign claim |
| Diagnostic support invalidation, preserved stance | First capability is explainable and testable; stronger automatic psychology/stance revision deferred |
| Explicit synchronous table, local reference effect | Covers first organization/causality questions with no legal/domain package or autonomous action |
| Zero new external runtime packages | Avoid library hidden state/ordering/license closure without demonstrated first-proof saving; optional developer graph/export later |

These tradeoffs are recommendations, not already accepted by the owner. Research showed recurring structures and concrete implementation pitfalls; it did not prove every future organization is covered or all future social behavior is solved. Exact scope, unresolved owner decision bundle and new-file proposal are in [Gate A](INFORMATION_ECONOMY_GATE_A_PROPOSAL.md).

## Executed versus unexecuted

Executed: four selected tiny disposable questions, one revised cost formulation, independent seed2 rerun and malformed-lineage probes, documentary peer/I/J review and final repository preservation/link checks. P0 baseline results remain historical and immutable.

Not executed: new native root/installer/L1/L2, all production A–L acceptance, actual successor crash/reload/capacity/work budget, library comparison benchmarks, migrations, live consumer, playable slice, Unity or Stage13. Documentary closure is never runtime PASS. **STOP AT GATE A.**
