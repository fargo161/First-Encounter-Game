# Information Economy Core compatibility preflight

Date: 2026-10-23, America/New_York. Status: PREFLIGHT ONLY; inspected contract compatibility, no information-substrate execution, architecture acceptance, bridge or implementation. Existing Core baseline reproduction is recorded separately in the safety evidence. Roles C/G. Evidence IDs and status chronology are in the [context index](INFORMATION_ECONOMY_CONTEXT_INDEX.md).

## Finding

The intended semantics are compatible with Encounter's single authority only if Information responsibilities operate within a separately approved admission/persistence design. The current accepted C1 reference is deliberately non-social and has no generic social state extension point. Legacy M3 already implements bounded knowledge but is a distinct JavaScript/save/replay system. C2.1 B0 describes adjacent proposed social machinery and is not a runtime dependency. No installed bridge or implicit follow-on implementation is established. E06–E14.

### Acceptance and implementation matrix

| Concern | Verified present evidence | Compatibility requirement / actual gap |
| --- | --- | --- |
| Single semantic installer | C1 `core.py` module contract, `_validate:175`, `admit:290`, `_publish:334`; controlled `calculate` is pure | Information claims may be wrong while the authoritative fact of an actual receipt remains correct. No external library, SQLite side writer, inference callback or organization workflow may install effects independently |
| Controlled capability set | `policies.py:4` OWNERS enumerates Env/Obl/Core fixture operations; `calculate:28` rejects unsupported capability and validates owner/policy | There is no generic claim/receive/assign/referral operation. Adding these is a new approved design/implementation, not configuration of the accepted proof |
| Qualified world identity | `policies.py:11` constructs producer/artifact/native/normalization/digest/kind/selector/epoch/revision; `resolve:16` checks exact artifact and unique current/historical binding | Reuse native qualified references. A new claim ID is an informational record identity, not a replacement actor identity. Subject allegation and actual occurrence must remain distinct; no bare display name/position/RC actor/ZANT identity join |
| Request correlation and exact retry | `core.py:185` producer/incarnation/world/lineage scope; `admit:306` prior request/result equality returns O3 before current witness validation | Future transmission retry must not cause another receipt, workflow task or effect. No idempotence promise across independent DBs/services is supplied. Supplied changed result/identity conflict must not be silently accepted |
| Witness and stale input | `core.py:42,175` requires complete state witness tied to current head; `_publish` reloads/checks old meta under transaction | Queries that inform an action need a declared authoritative basis and revalidation path. Actor-safe projection tokens cannot simply reveal privileged full state/head. No general API or token encoding is adopted |
| State derivation and proof | `_entry:192` hashes previous/head/seq/request/result/state; `_load:197` independently recalculates every row and checks receipts/head/index scope | An information graph or workflow export cannot become a substitute replay authority. Accepted current roots derive only selected fixture state; claim/organization replay needs its own approved root/policy contract |
| Logical chronology | `policies.py:28` uses `clock.now`; `advance` settles active due items sorted by `(due,ordinal)` before new time; events carry effective/publication time | Record acquisition at actual receipt/discovery time; past event time does not backdate knowledge. Proposed rumor/routing delays need deterministic admitted schedules. Use explicit causal ordering, not wall-clock polling or thread completion |
| Finite capacity | `core.py:19,48,136,154` budgets full prefix, work/memory/storage and prospective publication; fixed authored fixture | No generic city-scale, indefinite campaign, arbitrary graph closure or dynamic organization capacity claim. A larger profile is not safe merely because SQLite has room. New data changes census/work and cold-reopen bounds |
| Causal retention | `data.py:69,82` computes closure over authored essential roots/pins; `atlas.py` reports all actual mode-A rows retained, no destructive collection | Provenance supports, receipt/retry evidence and original consequences cannot disappear through graph pruning or NPC forgetting. Existing fixture graph is not a general information-retention implementation |
| Durable publication | `_connect:101` win32/DELETE/EXTRA; `_publish` BEGIN IMMEDIATE, write then prospective capacity check then COMMIT before receipt | Preserve one atomic admitted consequence path. Cross-organization referral is informational transfer, not an independent distributed transaction guarantee. Uncertain publication requires reconciliation before new writes |
| Checkpoints | `checkpoint:364` stores same seq/head/state accelerator; `_load` derives full prefix and ignores invalid accelerator state | Never authorize deletion of mandatory history based on an accelerator. B0 optional G9 loss semantics are design-only and different; see persistence report |
| Read-only projections | `snapshot:265` issues detached frozen verified Snapshot; `atlas.py:6` accepts only verified Snapshot and does not write | Useful diagnostic pattern, not an actor knowledge service. C1 public current/identity/due is fixture-public; no inference that arbitrary actor identity, due jobs, hashes or state may be disclosed |
| Existing local knowledge | M3 `engine.mjs:14,65`, `knowledge.mjs:11,26` uses recipient observations, claims, local stance/history; `engine.mjs:292` exports save@3 and `importRun:293` validates by replay | Preserve accepted legacy behavior. These scenario functions do not establish a generic C1 schema, durable organization workflow or a new source of canonical world truth |
| Adjacent proposed successor | B0 README, checkpoint/hash contracts and C0 proposal-admission contract (E11/E12) | Reconcile before designing duplicate Comm/Receive/Choice/Cog meaning. Do not instantiate B0, assume social-capable C1 labels mean accepted EA-C1, or treat expected vectors as executed PASS |

## Boundaries above the generic machinery

**KeyWrapping:** its bounded architecture/design acceptance governs referents, actual versus alleged subjects, acquisitions, source assertions, exact-term/authority/performance distinctions and actor-safe views. JSON/field names/schema/API remain unfrozen; runtime and shared integration are unaccepted. A new Level 1 must realize/reconcile those responsibilities rather than silently swallowing or duplicating them. E15–E20.

**BASED and cognition:** a listener may react to received/performed content and its own permitted context, not the sender's hidden selected vibe, real intent or universal truth lookup. Master §2.5's equality control holds performed information/listener/prior state/context fixed. Actual falsehood is not proof of deceptive intent; receipt is not belief. NPC inference may be wrong, and the Player's unexpressed mental state must not be modeled as a system fact. E13 §§2.5–2.9; E14 `recomputeBeliefs`; E16 P03/P14–P17.

**Laws:** fictional rule authority/applicability, classification, authorized assessment/remedy and enforcement boundaries require supplied policy. A discrepancy can support a suspicion without establishing theft, culprit, intent, jurisdiction or punishment. Generic screening/flagging/assignment may propose action but cannot mint police or legal authority. No accepted standalone Laws runtime was established. E19/E21/E22.

**Factions and organizations:** membership/hierarchy/grants/collective assent remain with their owning authority. An information queue assignment or job label is not an actual delegation. A record held by an organization, a role's access and a person's acquired information differ. One actor may perform multiple functions; larger organizations need explicit compartment/acquisition policies. No accepted standalone Factions implementation was established. E19/E23.

**Economy:** F5 accounts may exist, be destroyed or assert false contents; F1–F4 retain positions/effects/duties/operations as economic meanings under Encounter. Information discovery/inference/referral does not create money, discharge a duty, establish ownership or guarantee insurance/tax/police response. D03/D10/D11 remain open where a dependent outcome needs a finite envelope, executable consumer or recipient-specific benefit. E20/E21.

**Atlas/RC/ZANT:** descriptive projection, authored spatial metadata and presentation remain separate. Reference qualification confers no observation, hearing, authority, gameplay identity binding or mutation permission. Do not infer a witness from geometric co-location or delivery from a presentation cue. No spatial/hearing adapter or Unity work is selected. E01/E02/E04.

## Determinism and purity obligations for a future candidate

| Potential source of instability | Existing constraint and review obligation |
| --- | --- |
| Random rumor spread or credibility sampling | No hidden RNG in C1 policy derivation; any later choice needs explicitly admitted seed/input and recorded cause. No RNG feature is selected |
| Async receipt or referral order | C1 rejects coroutine hooks and has one transactional publication order. A future design must define stable ties, bounded batching and admission sequencing; external arrival order must be explicit input |
| Graph traversal / rule firing | Sort only according to an explicit semantic recipe, retain cycles safely and identify deterministic support identities. Library insertion/hash iteration order is not a contract |
| Wall-clock or cache expiry | Use Encounter logical time for simulation consequences. Operational measurement timestamps do not silently age beliefs or invoke world actions |
| External model inference | No model output may silently create truth, source provenance, belief or consequences. If later selected, it remains a proposed/recorded input subjected to approved admission and sealing |
| Projection/retrieval | Reads cannot advance time, create receipts, repair canonical rows or change stance. Cache rebuild must use exact holder/snapshot/cutoff/policy and preserve output order. No generic cache implementation exists here |

## Required architecture work, without installing it

1. Map every proposed record/change/query onto one owner and the accepted KeyWrapping semantic responsibility. Define allegation-without-event and source/holder distinctions before field design.
2. Select a bounded proof target and explicit relationship to accepted C1, legacy M3 and reviewed B0. A successor root or isolated reference design would be a proposal requiring approval; no adapter/root/schema is installed by this report.
3. Specify single-writer admission, logical chronology, exact retry, support retention, privilege-safe introspection, capacity/reopen and loss behavior for that target. Mere use of SQLite/NetworkX/PROV supplies none of these guarantees.
4. Review generic organizational roles against authority/access/receipt boundaries; use narrow authored domain policies without adopting them as Laws/Factions rules.
5. Obtain owner architecture/implementation authorization and independent test/audit gates. Do not equate Gate P0 completion, paper review, dependency evaluation or existing Core acceptance with acceptance of the new substrate.

No current evidence requires Core remediation for preflight. The absence of a generic installed integration is a **preimplementation design dependency**, not permission to modify the frozen proof or a claim that the preflight itself failed. Stop at Gate P0.
