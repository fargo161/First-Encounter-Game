# KeyWrapping substrate specification

**Version:** v0.1 · **Date:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT
**Role:** Lead Synthesis / Systems Referee.

## 1. Purpose and authority

The proposed substrate makes people, events, claims, promises and deals reusable subjects of Encounter's compositional language without making a reference an omniscient database lookup. Its reusable foundation is action meaning, typed composition, social validity, causal history and actor-scoped interpretation. It describes a design to review, not a runtime that exists.

The direct owner sign-off approved documentation production, the ten-role workflow, donor research and JSON-shaped specifications. It explicitly deferred actual JSON Schema files and held publication. The [source snapshot](../../../research/keywrapping-substrate/v0.1/SOURCE_SNAPSHOT.md) identifies the owner-held source pack and its precedence. The [decision log](DECISION_LOG.md) distinguishes owner decisions from proposals below. Existing [repository boundaries](../../../../contracts/SHARED_CONTRACT_DECISION.md) remain binding on preservation and integration.

In this document, a **candidate requirement** states what this proposed design must preserve to be coherent; it does not claim owner design-freeze acceptance or implemented enforcement. Field names, status names, selected action senses and scenario policies remain proposals. Established direction in the source pack must not be confused with approval of every representation invented here.

## 2. Preserved invariants and traceability

| ID | Candidate requirement / preserved direction | Source and detailed model |
| --- | --- | --- |
| KW-01 | Hard Keywords carry stable game-recognized referents/capabilities; Wrappers make social/historical/relational subjects addressable | KW-CONTEXT §4; [reference model](REFERENCES_PROMOTION.md) |
| KW-02 | Recognizing a shared subject grants no hidden content, related identities or another actor's account | KW-CONTEXT §§4.4, 20; [perspective model](PERSPECTIVE_PROVENANCE.md) |
| KW-03 | Keep canonical occurrence, received evidence, claim/stance, reference identity, actor label and Player-visible detail distinct | KW-CONTEXT §§12, 19–21; [record family](JSON_RECORD_FAMILY.md) |
| KW-04 | Stable internal identity, alias changes and re-identification must not reveal a proper name or hidden association | KW-CONTEXT §§4.3, 5, 10; KW-REVIEW labels/merge; [reference model](REFERENCES_PROMOTION.md) |
| KW-05 | Promotion allocates continuity/significance, not combat power, capability or universal publicity | KW-CONTEXT §§5–10; [reference model](REFERENCES_PROMOTION.md) |
| KW-06 | World existence, private NPC understanding and Player acquisition have separate causal paths | KW-CONTEXT §§8, 11–12, 24; [perspective model](PERSPECTIVE_PROVENANCE.md) |
| KW-07 | Historical retention, active salience and Player availability answer separate questions | KW-CONTEXT §9; permanent learned-book policy remains [OQ-02](OPEN_QUESTIONS.md) |
| KW-08 | No Player scratchpad or create-keyword button; references emerge through eligible gameplay | KW-CONTEXT §§7–8, 17, 23 |
| KW-09 | REQUEST/OFFER/REMARK and 66 starting action words support typed, grouped recursive composition with Context and BASED | KW-CONTEXT §§13–16; [expression model](EXPRESSIONS_COMPATIBILITY.md), [dictionary](../../../research/keywrapping-substrate/v0.1/ACTION_PREDICATE_MAPPING.md) |
| KW-10 | Asking, offering, reporting, valid social performance and world execution are different operations | KW-CONTEXT §§15, 18; KW-REPLY validity refinement; [transaction model](TRANSACTIONS_COMMITMENTS.md) |
| KW-11 | Choose a structured NPC decision before realizing outward wording; keep private inputs/diagnostics sealed | KW-REPLY; runbook §§4.11–4.12; [social donor analysis](../../../research/keywrapping-substrate/v0.1/SOCIAL_REASONING_DONORS.md) |
| KW-12 | NPC dialogue/performance remains available alongside mechanical meaning and cannot invent binding terms | KW-CONTEXT §§3, 16, 23; no renderer is built |
| KW-13 | Proposal, exact version assent, agreement and fulfillment differ; partial performance and later disputes preserve prior history | KW-CONTEXT §§17–19, 29; [transaction model](TRANSACTIONS_COMMITMENTS.md) |
| KW-14 | Recursive links need stable typed targets, cycle protection and bounded per-actor expansion | KW-CONTEXT §§17, 20–21; [expression](EXPRESSIONS_COMPATIBILITY.md) and [projection](PERSPECTIVE_PROVENANCE.md) models |
| KW-15 | Lightweight anonymous records and bounded elaboration preserve consequences without exhaustive offscreen simulation | KW-CONTEXT §§2, 11, 22; [reference model](REFERENCES_PROMOTION.md) |

These invariants are cross-cutting. A correct transaction record can still fail by exposing a hidden party through its label. A safe projection can still fail correctness if it silently rewrites the original deal. Both dimensions require separate review.

## 3. Small composable concept families

The following groups are logical responsibilities, not required services, tables or universal runtime types. The [integrated JSON examples](JSON_RECORD_FAMILY.md) give one explicitly illustrative representation; the domain documents define their constraints.

| Family | Responsibility | Must remain separate from |
| --- | --- | --- |
| Referents and wrappers | Stable underlying identity; known game kinds; linked social/historical subjects, including alleged subjects | Labels, acquired knowledge, acceptance, physical capability and truth of an allegation |
| Semantic definitions | Proposed action senses, predicate signatures, typed participant roles and validity expectations | A word's spelling, an installed executor, NPC willingness and a generic English ontology |
| Expressions | Function, explicit sense/proposition, participants, grouping, connector scope, temporal stance, recoverable context and outward manner | Performance, receipt and fulfillment |
| Occurrence and causal evidence | Authoritative emitted communication, validated social performance or separately resolved world effect | What every observer knows and whether a claim describes a true event |
| Receipts and accounts | Which fragment an actor perceived; source assertions, claims, stances and authorized inference basis | Full original message, another actor's private state and actual undisclosed source lineage |
| Actor reference knowledge | Labels, acquired handles, source-linked identity associations and disclosure history | Global identity joins and omniscient catalog search |
| Deal and normative records | Immutable proposal versions, scoped assent, formed commitments, constraints, entitlements, permissions/prohibitions and credited effects | Physical impossibility, assumed law, automatic penalties and one all-purpose lifecycle flag |
| Significance and retention | Why continuity matters; what causal history must endure; active priority and separately managed availability | Name revelation, Player knowledge, combat rank and retroactive erasure |
| Authorized projection | A bounded derived view of the actor's available information at a stated context/cutoff | Full save, Director diagnostics, canonical graph serialization and merely cosmetic UI hiding |

Evidence, relationships and provenance links compose with these families. A relationship can be an actor-local belief or a separately supported social relation; its epistemic scope must be stated. A wrapper can reference a claim about a nonexistent incident without requiring a canonical incident record. A separate permanent object for every passing thought is unnecessary.

NPC private cognition can be represented where explicitly authored or otherwise selected. The Player's acquired information does not require modeling unexpressed Player thoughts: receipt never assigns endorsement or belief, and this proposal adds no private Player hypothesis editor or scratchpad (KW-CONTEXT §7).

## 4. Meaning to consequences

The conceptual sequence is:

1. Construct a typed expression from the speaker's available vocabulary and context. Missing/ambiguous terms cannot be resolved by inspecting hidden truth.
2. Preserve its grouping, exact terms, intended participants and temporal/performative force. Preparation is not emission.
3. Record actual emission and individual received fragments where applicable. Intended audience, hearing, comprehension, belief and assent remain different evidence.
4. Evaluate any proposed social performance against its explicit target/version, standing, eligible channel and selected formation rules. A report of acceptance is still a claim.
5. A valid agreement can create commitments. Performance still requires separately resolved effects; valid assent may be dishonest or objectively infeasible.
6. Record observations, claims, stances, promotion/acquisition and later consequences under their appropriate scopes. No implied global synchronization follows.
7. Derive the authorized view before providing material to composition, dialogue, UI, search or actor export. Apply the boundary again for each nested link.

This is a semantic sequence, not an implementation architecture or transaction algorithm. It selects no persistence backend, process layout, installer, transport, scheduler, durable format, hash algorithm or numeric capacity.

The [action dictionary](../../../research/keywrapping-substrate/v0.1/ACTION_PREDICATE_MAPPING.md) found exact lemma entries for 61 of 66 words after inspecting 329 pinned VerbNet XML files. It distinguishes lexical membership from sense fit. Share, Cancel, Challenge, Apologize and Delegate had no exact lemma hit; several other words have mismatched or incomplete game senses. All 66 remain starting vocabulary; none is declared a completed runtime system. Research citation keys such as D01 are not installed action IDs.

## 5. Four independent decisions

| Question | Example | Consequence |
| --- | --- | --- |
| Is the expression meaningful and well-typed? | GIVE a transferable key versus GIVE a historical event as inventory | Structural plausibility; no permission or success implied |
| May this actor express/discuss it with known references? | Ask for a key the actor wrongly believes is available | Discussable even when impossible; hidden feasibility cannot become a composer oracle |
| Did this utterance validly perform a social act? | Current authorized self-acceptance of the exact eligible proposal versus a past report | Possible scoped social state; failed performance still leaves an actual utterance/claim |
| Did an authorized world effect occur? | Key actually transferred, selected information delivered or door opened | Effect evidence can support fulfillment; saying it happened cannot create that evidence |

Social permission/prohibition is also distinct from engine admission rights and physical capability. A forbidden physical act may occur and cause consequences. A character's belief that it has authority does not make an authority grant valid. The NPC's willingness calculation may use mistaken beliefs; authoritative performance validation must not reuse that mistake as authority.

## 6. Sealing boundary

A projection must have an explicit audience, information context/cutoff and permitted purpose. It exposes only acquired references, labels, propositions and eligible inferences. Actual hidden source lineage, canonical identities and internal importance metadata are not default output fields. A known wrapper may have zero accessible details without revealing how many hidden records exist.

Identity requires particular care: if the Player knows an unnamed shopkeeper and Eddie as apparently different people, exposing the same global ID joins them before the Player learns the association. Actor-facing handles must not reveal that join. A later discovery changes the current known association without rewriting prior speech or distributing Eddie's private history.

Safe failure includes guessed references. Where an actor cannot distinguish nonexistent, inaccessible and internally unavailable subjects, lookup errors, counts, status and timing must not disclose the hidden cause. Composer filters must not certify a guess by comparing it with secret truth. Privileged diagnostics remain separate from actor-facing output.

Sealing does not require actors with different private beliefs to behave identically. An NPC can choose a revealing act or give a deliberate clue through an authorized outward interaction. The [perspective model](PERSPECTIVE_PROVENANCE.md) distinguishes intentional outward behavior from accidental metadata leakage and defines the proposed equal-known-history comparison used by the auditors.

## 7. Social evaluation and wording

The [social analysis](../../../research/keywrapping-substrate/v0.1/SOCIAL_REASONING_DONORS.md) retains separate authored history/state, candidate evaluation, decision and realization from Ensemble/FAtiMA. It rejects their numeric defaults as Encounter requirements. Relevant inputs can include the deciding actor's acquired terms, beliefs, needs, relationships, obligations, perceived risk/cost/feasibility and actually observed BASED cues.

The result is a structured accept/refuse/counter/ask/challenge or other explicitly authored response, addressing an exact visible context. A private reason may differ from an outward pretext; the pretext is a claim, not a leak of the private explanation. Realization receives only permitted outward meaning and cues. Neither a template nor a generated line can add an unrepresented price, person, deadline or promise. The Player still sees the actual dialogue/performance alongside mechanical meaning.

The reply's embedded four-check diagram is missing from the supplied Markdown. This specification does not reconstruct its predicates or assert that passing four checks forces assent. Exact personality policy, variations and cue readability remain open.

## 8. Bounded examples and review criteria

The integrated examples and domain models should be read together:

| Scenario | Required distinction |
| --- | --- |
| Learn an unnamed shopkeeper's name | Stable person and newly acquired label; no automatic inventory, family or history disclosure |
| Minor unwitnessed theft; later severe irreversible act | Actual consequences and significance can exist before discovery; salience is not historical truth or Player availability |
| Hotel incident, partial witness and false report | One occurrence can support different fragments/accounts; a fabricated incident needs no actual occurrence |
| Compound warehouse exchange and counteroffer | Grouped money-plus-information terms, exact changed version, required assent and independent performance |
| Payment completed, information still pending | Partial fulfillment uses exact effect evidence; replay does not double-credit |
| Failed cancellation after disclosure | Authority and scope matter; learned information and earlier transfers are not erased |
| Nested promise/deal/dispute with cycle | Linked composition terminates without copying or exposing the entire graph |
| Past REMARK ACCEPT versus current self acceptance | Content, tense, actor and force determine whether performance is even eligible |

These are documentary scenarios, not executed runtime tests. The [sealing audit](../../../audits/keywrapping-substrate/v0.1/LEAK_SEALING_AUDIT.md) and [combinatorial audit](../../../audits/keywrapping-substrate/v0.1/COMBINATORIAL_SEMANTIC_AUDIT.md) record independent review and specific dispositions; do not infer their verdict from the presence of this table. The [verification report](../../../audits/keywrapping-substrate/v0.1/VERIFICATION_REPORT.md) separates JSON syntax, local links, preserved repository behavior and implementation/playability claims.

## 9. Paper test and later acceptance

Before freezing senses or authorizing an implementation proof, run a small Player-involved paper scene using the three Functions, a selected subset of the 66 words, known keyword cards and BASED cues. The subset is a test convenience, not an approved vocabulary reduction. Give two NPCs different private accounts of one event; permit one grouped bargain and reuse its earned reference later.

Record which intended meanings could not be expressed, ambiguous “yes” cases, unused/near-duplicate words, composing effort, whether refusal/counterproposal offers understandable ways forward, whether new references feel useful and whether dialogue supplies meaningful cues. Keep exact secrets and sources separate when handing out new cards. Do not infer fun from successful paperwork or assume that favorable comments prove broad playability.

Resolve the resulting choices through [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md). A later implementation work order must select bounded scenarios, supported senses, validity/authority policies, effect evidence, disclosure/inference/retention rules, compatibility boundaries and actual executable tests. This proposal does not start that work order, integrate the sandbox into accepted Core or begin Stage 13.

## 10. Delivery boundary

All external resources remain donors or architecture references. [Standards mining](../../../research/keywrapping-substrate/v0.1/STANDARDS_MINING.md) explains rejected assumptions; the [license ledger](../../../research/keywrapping-substrate/v0.1/SOURCE_LICENSE_LEDGER.md) declares the selected VerbNet metadata and required notice. No new dependency or external ontology governs Encounter.

The package is left on a local documentation branch for owner review. Actual schemas, gameplay UI, production runtime, full NPC AI, dialogue service, live database migration, microservices, adapters, stubs, unrelated cleanup and Unity integration are excluded. Existing C2.1 B0 remains a comparison input, accepted C1 and all other preserved packages remain unchanged, and push/merge/publication remain held under the [integration plan](GITHUB_INTEGRATION_PLAN.md).
