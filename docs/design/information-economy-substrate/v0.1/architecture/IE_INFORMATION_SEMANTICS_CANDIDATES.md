# Information semantics candidates — architecture investigation

Date: 2026-10-23, America/New_York. Role C, with G boundary review. Status: **PROPOSED ARCHITECTURE; NO IMPLEMENTATION OR SCHEMA INSTALLED**. Gate P0 was explicitly approved for architecture-only investigation, selected disposable spikes, synthesis and review. Stop at Gate A. This document supplies specialist recommendations, not owner adoption or independent final audit.

## Evidence and inference

The [P0 context index](../preflight/INFORMATION_ECONOMY_CONTEXT_INDEX.md) distinguishes accepted implementation, accepted design, reviewed proposals and historical labels. The controlling semantic evidence is:

- [KeyWrapping perspectives](../../../keywrapping-substrate/v0.1/PERSPECTIVE_PROVENANCE.md), especially P01–P17, and [references](../../../keywrapping-substrate/v0.1/REFERENCES_PROMOTION.md), R01–R12: actual occurrences, alleged subjects, acquired fragments, actual/asserted/holder-known lineage, opaque audience handles and cutoffs differ. Their older proposal headers are reconciled by the [later governance correction](../../../economy-substrate/v0.1/phase-10/GOVERNANCE_BOUNDARY_SUMMARY.md) and [owner acceptance record](../../../economy-substrate/v0.1/phase-10/OWNER_ACCEPTANCE_RECORD.md). KeyWrapping is accepted bounded **design**; runtime/shared representation is unaccepted.
- [Encounter master §§2.5–2.9](../../../../../packages/encounter-atlas/reference/Encounter_System_Master_v2.1.md): receipt is not belief; authentic marks do not certify every conclusion; BASED's hidden selector cannot be incoming listener evidence. [M3 knowledge](../../../../../packages/encounter-atlas/src/m3/knowledge.mjs#L11) implements recipient-local views and bounded scenario-specific stance policy, not universal confidence semantics.
- [Accepted C1 owner record](../../../../../packages/encounter-core-c1/provenance/0.1.3/EA_C1_0_1_3_OWNER_ACCEPTANCE_RECORD.md), [policies](../../../../../packages/encounter-core-c1/0.1.3/eac1/policies.py#L28) and [Core admission](../../../../../packages/encounter-core-c1/0.1.3/eac1/core.py#L290): one installer, deterministic logical ordering, exact retry and protected finite history are implemented for a **non-social** proof. They establish no generic information operation.
- [Accepted Economy design](../../../economy-substrate/v0.1/phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md), particularly F5, plus its [boundaries](../../../economy-substrate/v0.1/phase-10/GOVERNANCE_BOUNDARY_SUMMARY.md): an actual account may assert a wholly nonexistent loss; authentic authorship, record existence and contents differ. Laws/Factions and D01–D11 retain their scope.

**Inference:** creating a new authoritative “knowledge graph” beside these models would duplicate their responsibility. A single native realization of the accepted semantic separations is needed; organization machinery may add processing, not a second truth or a second acquisition registry. The following candidate selects that direction for review.

## Candidate comparison and recommendation

| Candidate | Benefit | Failure pressure / disposition |
| --- | --- | --- |
| Typed attributed contents plus actual acquisitions and explicit support links, native to one Encounter admission history | Separates false contents from true communication history; finite inspectable provenance and audience boundaries; composes with KeyWrapping/F5 | **RECOMMEND.** Use only the typed relation shapes needed by the bounded proof. No universal sentence ontology or complete logic is required |
| Global fact graph with per-actor visibility flags | Simple apparent query surface | **REJECT as authoritative semantics.** An allegation can lack a true event; canonical aliases, negative lookups and graph metadata can disclose secrets. An allowlist over selected acquired content may be a projection implementation, not this model |
| One universal PROV/RDF entity graph for truth, claims, workflow and authority | Common relation vocabulary/export opportunities | **BORROW CONCEPTS only.** Attribution/derivation are useful; a graph/export vocabulary does not supply the game's truth/receipt/access/authority distinctions or justify a dependency |
| Full belief/LTMS/confidence/psychology engine at Level 1 | Rich automatic stance revision | **DEFER.** More behavior and hidden policy than the first proof needs. Explicit derivation support diagnostics are sufficient without automatic mental-state replacement |
| Organization knowledge as union of every member's information | Easy organization lookup | **REJECT.** Membership neither delivers contents nor grants every member access. Use records, authorized acquisition and explicit compartment scope |

## Exact division of responsibility

These are proposed semantic responsibilities inside one native successor, not separate durable services. See [integration constraints](IE_ENCOUNTER_INTEGRATION_CONSTRAINTS.md).

| Responsibility | Owner and interface consequence |
| --- | --- |
| Actual world identities, admitted state/history, logical time, occurrence and once-only receipt/effect identity | **L0 Encounter:** sole durable installer. An L1 claim's false proposition is compatible with the true L0 fact that the claim was delivered |
| Existing referent/acquisition/claim/projection invariants and social meaning | **Accepted KeyWrapping design:** remains the semantic source and adjacent expression/reference design. This candidate does not transfer design authority away or create a competing set of wrappers |
| Native acquisition/content/source/support interpretation and audience-safe information queries | **L1 pure participant:** realizes those shared KeyWrapping responsibilities once in L0 state. KeyWrapping consumers obtain known handles/content from the same acquired basis; they do not maintain another persistent `knows` store |
| Persistent handle/association meaning if continuity requires it | **Same native acquired-reference basis under L0**, governed by KeyWrapping. A handle is an audience/view token, not a new world identity. Exact encoding/field names remain uninstalled |
| Case/intake/task/route/assignment/referral/closure bookkeeping | **L2 pure participant:** references L1 acquisitions/record versions; proposes bounded transitions to L0. It owns neither organizational membership nor action/disclosure powers |
| Actual grants, delegation, organizational standing and normative applicability | **Their owning Encounter/domain/Factions/Laws authority**, supplied narrowly by the selected proof root. L1/L2 validate use of supplied grants; they cannot mint standing from job titles or a source assertion |
| Personality, whether an NPC believes/discloses, BASED, dialogue, institutional thresholds and actions | **Higher-layer or L3 policy:** consumes eligible information and proposes acts. No universal psychology, confidence scale, legal judgment or dialogue engine is adopted |

“L1 owns semantics” means it checks selected informational transitions; “L0 owns state” means only L0 may admit/install them. These are compatible responsibilities, not two sources of truth. Semantic records can share storage structures and payload bytes. The table does not require one object, table or process per responsibility.

## Minimal logical record family

These are responsibilities and mandatory distinctions for a candidate, **not JSON Schema, table definitions, public APIs or frozen field spellings**. Separate only those identities and versions needed to answer the selected questions.

| Logical record | Minimum represented meaning | Invariant / what it does not imply |
| --- | --- | --- |
| Qualified subject / topic reference | Existing Encounter-world identity and exact artifact/version scope where applicable; or an explicitly alleged, hypothetical or descriptive subject | A topic is not a new actual occurrence/person. An alleged burglary need not join a burglary event. No guessed secret identity is registered as Player-acquired vocabulary |
| Immutable attributed content version | Bounded proposition/account/selected fragment, asserting source where applicable, applicable subject/time scope and content/version identity | Authorship and content integrity do not establish truth. Opposing and outdated contents coexist. An expression can be represented without modeling the human's private belief |
| Actual acquisition/receipt occurrence | Particular recipient, actual delivered/observed portion, channel/mode, logical point, actual causal origin and operation identity | Intended audience or record access alone is not receipt. Receipt does not imply acceptance, reading every attachment, knowing original source or learning all facts about the subject |
| Record/document version | Reference to an actual record entity plus immutable selected informational version and actual authorship/change basis | Physical possession/custody, knowing existence, current lookup authority and previously acquired contents remain separate. Record destruction does not undo a prior receipt |
| Source assertion | A claim about provenance: firsthand, named source, unknown/omitted source, purported official authorship, etc. | Can be false or unsupported while actual transmission lineage remains unchanged. It can reuse the attributed-content family rather than require a special independent engine |
| Acquired handle / identity-association assertion | Audience-scoped addressability of a received subject and an explicitly acquired association between known handles, with its basis/status | Two handles secretly referring to one canonical actor stay unjoined until the holder has an association. A mistaken association remains a holder claim; it never merges world people |
| Explicit derivation | Holder, exact eligible premise versions/acquisitions, bounded rule identity/version, inference point and bounded alternative support sets if selected | Reasoned support is not objective truth. The same received statement can support different scoped conclusions. No complete world closure, arbitrary recursive logic or new actor knowledge from a privileged graph query |
| Support qualification/correction | Appended, causally supported qualification/retraction/correction of specified support, with holder/purpose/time scope and actual received basis where actor-facing | Does not overwrite original speech or automatically retract belief. A record's loss, an actor's receipt of a retraction and a false proposition are different qualifications |
| Selected stance or assessment, only where needed | An explicitly modeled NPC/expressed assessment and its source/cutoff/policy, separate from receipt and support diagnostics | A recorded stance can remain after all support is withdrawn. No unexpressed Player thought store, universal scalar certainty or truth-derived confidence |
| Case/task/transition record at L2 | Organization-owned record/task identity, exact L1 inputs/attachments, assignment/route/status, acting function, policy revision and cause | Case status grants no authority, records no omniscient institutional consensus and creates no receipt in every employee. One person can perform all functions |

A minimal implementation may combine a claim and its source assertion in one immutable content structure, or represent a support qualification as another admitted attributed account plus a typed relation. It must preserve the distinctions, not maximize record classes. Byte deduplication is optional and cannot collapse distinct utterances, receipts, actors or time scopes.

## Minimal semantic operations and guards

Every mutating operation below is a **proposal to L0**. L1/L2 calculate a deterministic result on immutable verified input; only L0 publishes one transaction. Queries do not acquire information, repair rows, advance time or update stance. The selected native contract must specify exact request/result/retry identities; names below are descriptive.

| Operation | Required admitted basis / result | Reject |
| --- | --- | --- |
| Admit bounded initial or observed acquisition | Explicit root-authorized background or observation rule; real source/context and only eligible details; recipient/content/point recorded | Full world-event lookup passed to an NPC; location/ownership implies perception; arbitrary caller says “I observed the secret” |
| Author/receive an attributed account | Actual authored/received act; known referents or legitimate alleged/descriptive subject; exact content and version | Content becomes fact, forgery becomes real power, or author learns concealed reference details merely by making an allegation |
| Deliver selected content to one recipient | Explicit selected recipient, deliverable fragment and source; actual delivery occurrence installs one receipt; onward disclosure policy supplied if the action needs it | Queueing alone means receipt; hidden attachments/source/other recipients copied; retries duplicate delivery. Larger recipient sets require explicit bounded separate units or an approved atomic batch |
| Retrieve a record version | Current actual access decision and exact requested scope, performed retrieval with only delivered details recorded | Grant/possession/known existence is already content knowledge; read of a pointer traverses sealed back-links; revocation retroactively deletes earlier receipts |
| Acquire/derive a handle association | Eligible received or boundedly inferred association between already addressable subjects, preserved as an attributed/correctable relation | Join all canonical aliases, merge actual entities or reveal other people's information |
| Derive one explicit conclusion | Selected pure rule/version and finite eligible premise set(s), same holder/purpose/cutoff; resulting content and derivation record admitted | Hidden premise, automatic omniscient inference, arbitrary new source authenticity or recursive closure. Reject a self-support cycle in the first proof |
| Append support qualification or correction | Actual supported correction/retraction/discovery act, target and semantic scope; actor-facing qualification needs eligible acquisition | Delete old claim, make unseen source retraction affect current visible confidence, or treat corrupted proof as a new in-world rumor |
| Change actual lookup grant | Supplied standing/scope/policy from L0's selected authority participant, no privilege inferred from a claim | L1/L2 invent grants, organization role implies universal access, or a grant retroactively acquires contents |
| Process one L2 transition/referral | Exact available inputs, acting function/grant, current task status, versioned generic transition and selected finite destinations; referral uses ordinary delivery semantics | Action/enforcement becomes an automatic workflow side effect, whole source case becomes receiver knowledge, or closed case erases original communications |

All first-proof acquisition paths are explicit and bounded. No autonomous NPC-to-NPC gossip, open-ended observer search, generic investigation planner, probabilistic propagation or full conversation runtime is required. Synthetic actual deliveries can exercise semantics without becoming the playable slice.

## Provenance, origin correlation and authentication

Maintain three answers separately:

1. **Actual lineage:** what admitted occurrences/content actually supplied this acquisition, retained for privileged audit and derivation. A liar cannot rewrite it.
2. **Asserted lineage:** what a speaker/record says about its source. “I saw it” can be false; a forged official letter is still a real delivered claim.
3. **Holder-known lineage:** only the source assertions and lineage details this holder acquired by the requested cutoff. It may be incomplete or mistaken.

Correlation analysis is a bounded **derived diagnostic**, not a confidence oracle. A known shared ancestor means repeated paths do not add a new independent originating basis. Distinct record IDs, tellers, offices, hashes, quote nodes or origin labels do not prove independence. If ancestry is unknown, opaque, truncated or unavailable, correlation remains **unknown/incomplete**; it does not become independent. Even fully disjoint tracked lineages establish only disjointness within that tracked scope, not statistical independence or truth. Institutional credibility formulas remain above L1.

Communication cycles are permitted as distinct chronological occurrences: A tells B, B tells A. Their causal occurrence links point backward in admitted order and traversal terminates using visited identities and a selected budget. They do not create a self-supporting derivation. For the first proof, recommend only explicit finite acyclic derivation/support references, pointing to already admitted premises. Do not add automatic alternative-proof enumeration or fixed-point inference.

**Source authentication recommendation:** optional evidence capability, not a required cryptographic platform. Native admission validates producer/caller scope under the selected controlled proof root; those checks are not an authentication platform and do not prove an in-world asserted name or an external sender's identity. A selected authored mark, witness or attestation can support the statement “this source/channel is authenticated under policy P”; it never proves the reported event or all contents true. A holder learns that assessment only through an eligible acquisition. The first proof can use explicitly trusted fixture-origin actors/channels plus false source assertions and an `unverified/unknown` condition. No external signature service, generalized identity verification or globally authentic-by-default document is needed. This does not reopen KeyWrapping's source-authentication policies universally.

## Access, invalidation and historical views

Access and knowledge must be tested as independent axes: known existence/no content; grant/no retrieval; possession/no permission; actual retrieval then revocation; prior receipt after document destruction. A real grant's effective status can change without telling every actor about it. A later attempted lookup uses current actual authority; its outward failure remains safe under the holder's acquired context. No technical failure or denied guessed record may disclose whether a secret exists.

Recommended first-proof support semantics:

- A derivation records historical premise/rule use once. Its inference occurrence remains real even if all support later fails.
- A support **set** is conjunctive; expressly selected alternative sets are disjunctive. One invalid premise defeats that set; another complete eligible set can still support the scoped conclusion. Do not infer unspecified alternative justifications or enumerate every graph path.
- Support status is always qualified by holder/purpose/cutoff/rule and the available support qualifications. “Supported under those premises” never means objectively true. Staleness requires a declared time scope/policy rather than a host-clock TTL.
- First proof: append holder-eligible corrections/qualifications and derive `supported / unsupported / analysis unavailable` explanations under the selected scope. Exact display wording is not an API commitment. A truncated check cannot certify completeness. If a future runtime cannot complete its approved check within budget, it refuses the dependent proposed action or returns safe unavailability; it never leaves a known-stale supported certification.
- Do **not** automatically replace the NPC's recorded stance, erase acquired content or propagate corrections to nonrecipients. Whether an NPC changes its mind belongs to a later explicit cognition/domain policy. Actor queries must not reflect a hidden world change merely because a privileged graph can see it.
- Canonical required-proof corruption is a technical verification failure, not a gameplay support retraction. Optional graph-cache loss is a rebuild/unavailability issue. Neither creates a new belief, event or receipt.

Historical views use both an authoritative snapshot boundary and that holder's knowledge cutoff. Occurrence time, communication time, receipt time, inference time and later identity-association/correction point are separately retained where they affect meaning. A current alias or correction must not be backfilled into earlier views. An earlier receipt uses its exact content version/fragment, original attribution and then-eligible labels; current explanatory commentary needs explicit separate authorization. Revocation and cache eviction do not select permanent Player-book availability or NPC forgetting, which remain open KeyWrapping policy.

## Small adversarial semantic oracle

These are proposed outcomes, not executed tests. The complete [P0 A–L plan](../preflight/INFORMATION_ECONOMY_TEST_PLAN.md) remains inherited.

| Fixture | Required result |
| --- | --- |
| Unseen theft, then observed till discrepancy | Preserve real loss; owner receives discrepancy only. No culprit or police receipt without an actual later path |
| Phantom loss / mistaken accusation | Real account/delivery and alleged subject, no fabricated loss/guilt/world identity merge |
| Liar names a hidden original source falsely | Actual lineage unchanged; recipient sees only delivered attribution and permitted cues, not the hidden original |
| Two reports share an origin / origin unavailable | Shared actual basis is not double corroboration. Unknown ancestry stays unknown, never defaults to independent |
| A→B→A retelling | More receipts, no new independent origin or self-validating derivation |
| Known record existence, then lookup revocation | Existence/acquired detail and past receipts remain; present lookup may fail without secret existence/count/source leaks |
| Support E1 withdrawn, alternative E2 remains | Explicit E1-dependent set fails under eligible scope; surviving complete E2-set remains; old derivation/stance/history preserved |
| Hidden fact changes, holder hears nothing | Actor-visible content/support/labels/search do not change because of the hidden fact; privileged diagnostics may show separate actual state |
| Sender refers one attachment from a larger case | Receiver gets exactly selected delivered content and disclosed attribution, no source-case recursive access or power inheritance |
| Same canonical person under two unjoined acquired handles | No canonical-ID merge or cross-handle content join until an actual holder acquisition supplies that association |

## Recommendations and open questions for Gate A

Recommend adopting the single native semantic realization, explicit finite acquisitions, immutable attributed contents, backward causal provenance, optional bounded authentication assessments, acyclic explicit derivations and diagnostic-only support qualification before any psychology engine. L2 can reuse ordinary deliveries for intake and referral; no special organization-wide knowledge primitive is warranted.

Owner-level decisions remain the selected successor/proof boundary, finite support horizon/refusal behavior, first implemented capability/deferral set and any automatic stance revision. Technical field/encoding/collection choices can be resolved within the architecture candidate and reviewed without a questionnaire. Open gameplay policy remains open: learned-book permanence, NPC forgetting, disclosure willingness, confidence/credibility/valuation, fictional law and organizational standing. Narrow synthetic root policies may supply demonstrative cases without adopting universal rules. No shared executable contract or runtime acceptance follows from this document. **STOP at Gate A.**

## Integrated candidate cross-review

Reviewed [Architecture Candidate v0.1](INFORMATION_ECONOMY_ARCHITECTURE_V0_1.md) as C/G specialist. This is peer cross-review, not independent Tester I or Auditor J acceptance. KeyWrapping/L1 responsibility, phantom subjects, actual/asserted/known origin, unknown correlation, container-versus-individual acquisition, prior receipt after access loss, holder-qualified support change and explicit modeled/expressed stance remain consistent with this recommendation. No automatic unexpressed Player belief is authorized by `DeclareStance` or a receipt.

| ID / severity | Candidate evidence / finding | Required closure and current status |
| --- | --- | --- |
| CG-A01 — MEDIUM, MUST FIX before Gate A | §§4/9/16 require explicit immutable Derivation; the initially reviewed §8 omitted its admission unit | **CLOSED on documentary recheck:** §8 now specifies `Derive` with earlier acquired premise versions/receipts, holder/rule/version/alternatives, and atomic immutable conclusion, derivation/support links and holder acquisition. It expressly excludes hidden premises, new observations, automatic stance and world-truth assertion |
| CG-A02 — MEDIUM, MUST FIX before Gate A | §§9/10/12/15 depend on known expiry, logical time and bounded due work; the initially reviewed operation list omitted clock advancement | **CLOSED on documentary recheck:** §8 now specifies root-controller-only L0 `AdvanceTime`, nondecreasing target/witness, at most eight due jobs ordered `(dueTick,originalOrdinal)`, atomic bounded publication and no automatic information/workflow/stance action. §§9/12/13 retain coupled support/time/work and refusal constraints; queries/qualification never advance implicitly |
| CG-A03 — LOW, SHOULD FIX clarity | §10 subject-based contradiction grouping could be misread as grouping actor-visible claims by privileged canonical identity when the holder has unjoined aliases | **CLOSED on documentary recheck:** §10 now explicitly limits actor-facing grouping to acquired handles/identity associations and permits canonical grouping only in privileged diagnostics |

The integrated §8 notice rules resolve the earlier organizational ambiguity: container delivery is not employee acquisition; assignment includes an explicit minimal notice, without content/grant; dispatcher reasoning requires a real notice or record read; selected route/referral intake updates are atomic and counted. §9 correctly makes hidden withdrawal/world change incapable of changing holder-visible support. §7 keeps privileged witnesses/native error/capacity diagnostics out of actor speech/menu inputs. These are documentary design findings; future implementation and paired-view tests remain required.

Final C/G documentary disposition: **no remaining C/G blocker to presenting this architecture candidate at Gate A**, with CG-A01–CG-A03 closed as above. The recheck also confirms explicit three-valued OR-of-AND support handling and total causal order `(admissionSeq,localCausalPosition)`: same-unit item-before-receipt references are allowed, mandatory dangling/forward/cyclic actual parents are rejected, and derivation premises require earlier admissions. Unknown ancestry remains explicit unknown. This does not accept the architecture on the owner's behalf, certify implementation, replace independent I/J review or authorize any follow-on work.
