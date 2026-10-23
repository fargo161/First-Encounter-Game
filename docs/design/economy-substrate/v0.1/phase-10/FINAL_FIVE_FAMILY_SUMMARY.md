# Five-family final owner review summary

**Status:** PHASE 10 DECISION PACKAGING / PROPOSED ECONOMY ARCHITECTURE / OWNER ACCEPTANCE PENDING  
**Review target:** the unchanged Phase 4 reconciled candidate. "Final" identifies this review summary, not final owner acceptance, implementation readiness or a new architecture selection.

The five families answer different economic questions within Encounter's admitted state/effect/time/history authority. They are not five engines, data stores, runtime classes or mutation authorities. Required roles remain distinguishable even if a later authorized representation organizes them differently. This summary preserves the [current family responsibilities](../phase-4/FAMILY_STRUCTURE_FOR_AUDIT.md#L10), the [minimum support questions](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L28) and the [Phase 3 to Phase 4 changes](../phase-4/CHANGES_FROM_PHASE_3.md#L31); it selects no further primitive or policy.

## F1 - Resource positions and economic relations

**Owns in the proposed Economy specialization:** supported resource kinds, quantities, conditions and pool/item or credited monetary positions; separately supported economic interests, custody responsibility, immediate possession, practical control and applicable scoped grants. These describe supported economic relationships; F1 references actual authority rather than creating it ([candidate:46-60](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L46)).

**Distinctions that must survive:** product kind / stock quantity / specific physical item; cash amount / cash location / credited bank position / pending-credit claim / bank statement; property or economic interest / custody / possession / practical control / permission. Available or saleable quantity is a derived view. Expected delivery, reservation or overlapping promise is not extra physical stock. Mixed source can remain supported at coarse precision without claiming unavailable per-unit ancestry.

**Does not own:** general property law, title timing, management powers, normative permission, automatic actor knowledge or a new identity system. Possession cannot manufacture title; a share cannot manufacture management, Factions standing, assent or shared knowledge. Wallets, tills, bank positions, stock pools, tenancy and share participation are specializations or relations, not new top-level families.

**Encounter / KeyWrapping dependencies:** Encounter supplies admitted identity, state and actual changes. Qualified references preserve their native scopes. Accepted KeyWrapping architecture constrains references, claims and actual scoped authority. A claimed grant differs from an applicable grant; a valid institutional change requires its owning authority and guards. Exact title/grant/distribution choices remain [D02](RESIDUAL_DECISION_REGISTER.md#d02---property-grants-interests-and-distribution).

**Strong counterexamples already used:**

| Counterexample | Separation it challenges | Existing source |
| --- | --- | --- |
| Clerk carries store cash under transport-only authority; manager has no equity and investor has no till authority | Holding, responsibility, interest, ability and permission vary independently | [P4-S01](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L20); [cold O01](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L73) / [O18](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L90) |
| Cash is received for deposit but bank credit remains pending; an authentic statement asserts more credit | Bank value is not cash location or report content; no simultaneous dual spendability | [P4-S02](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L21); [cold pending-credit trace](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L57) |
| A pool splits; a later dispute asks for an old serial or exact source of a mixed partial outflow | Refinement cannot duplicate the parent quantity or invent ancestry | [P4-S04](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L23); [cold O06-O08](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L78) |

## F2 - Actual economic effects

**Owns in the proposed Economy specialization:** economic meaning of supported actual resource movement, use, transformation, loss, and service/work occurrence, including supported source, destination, cause and effect scope. Encounter admits the occurrence. A declared outside boundary may support coarse flows; an account or label cannot supply an unperformed effect ([candidate:32](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L32), [64-75](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L64)).

**Distinctions that must survive:** occurrence / acknowledgment / qualification; actual movement / commercial purpose / duty discharge; money payment / goods transfer; loss / claim / payout / recovery. Sale, gift, wage, repayment, insurance payout and diversion reuse effects with different supplied bases. Refund, return, restitution, compensation and recovery require new supported effects; failure or record correction does not rewrite an earlier payment or delivery. An episode or "transaction" grouping supplies no atomicity or rollback promise.

**Does not own:** duty formation, automatic fulfillment, truth of a receipt, pricing or accounting standards, violence/injury/coercion resolution, legal classification, discovery or enforcement. It cannot mint money from profit, a distribution calculation or an owner injection mislabeled as sales. It cannot create goods by insurance recovery, record correction or aggregate elaboration.

**Encounter / KeyWrapping dependencies:** Encounter supplies admitted effects, ordering, actual identity and protected history. Accepted KeyWrapping performance/current-act distinctions prevent replay of a historical acknowledgment as a fresh act. No generic Economy effect protocol, retry mechanism or shared executable contract exists; dependent support remains D03/D10.

**Strong counterexamples already used:**

| Counterexample | Separation it challenges | Existing source |
| --- | --- | --- |
| Buyer pays without delivery; seller delivers without payment; receipt falsely says paid | Money, goods, assertions and discharge remain independent | [P4-S03](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L22); [cold O10-O12](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L82) |
| Ten shipped units are two received, three diverted and five still in transit; later recovery and resale move originals | No second full shipment, duplicate recovered original or manifest-created delivery | [P4-S05](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L24); [adversarial PC02](../phase-7/PATHOLOGICAL_COMBINATIONS.md#L32) |
| A false insurance claim causes a real funded payout, followed by recovered goods under explicit terms | A payout can be real while the claim is false; recovery cannot erase payment or decide repayment rights | [P4-S10](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L29); [cold O21](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L93) |

## F3 - Required performance and fulfillment

**Owns in the proposed Economy specialization:** exact supplied requirement/duty basis and terms, formation/activation/due dimensions, qualification and credited scope of the same actual occurrence described by F2. It can represent unpaid, partially performed, late and disputed duties without collapsing them into one lifecycle flag ([candidate:64-75](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L64)).

**Distinctions that must survive:** obligation / activation / due state / actual performance / qualification / credited scope; actual work / wage eligibility / wage due / payroll funding / actual pay; receipt of information / truth / any separate truth criterion. Qualifying a shift, delivery, payment or service never performs it again. Same required scope cannot receive duplicate credit. Genuine later occurrence remains possible. General cross-duty sharing, allocation, netting, priority and remedies remain open rather than universally forbidden or permitted.

**Does not own:** independent payment or delivery execution, automatic duty activation from a label, a universal assent rule, legal remedies, generic cross-duty priority, management authority or service outcome truth. Wage, rent, supplier and statutory bases specialize the same responsibility; payroll grouping, remainder and summary status are derived concerns.

**Encounter / KeyWrapping dependencies:** Encounter supplies the one actual occurrence and time/history. Accepted KeyWrapping exact terms, actual authority and performance semantics constrain applicability and qualification. Governance/KeyWrapping must reconcile shared formation/allocation semantics where needed; Laws supplies any normative basis. [D01](RESIDUAL_DECISION_REGISTER.md#d01---duty-basis-allocation-priority-and-remedies) retains those decisions. No runtime correlation/retry guarantee is claimed.

**Strong counterexamples already used:**

| Counterexample | Separation it challenges | Existing source |
| --- | --- | --- |
| One shift occurs; 11 of a 30 wage is paid; 19 remains due, late and disputed | F3 credits the same F2 payment once; it creates no second shift or transfer | [P4-S08](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L27); [cold O04](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L76) |
| A no-show receives actual money under false attendance; authorized leave could have a different eligibility basis | Real pay does not prove work, earned wage, fraud or fulfillment of an unrelated duty | [adversarial PC03](../phase-7/PATHOLOGICAL_COMBINATIONS.md#L49); [cold O19](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L91) |
| Actual service fails a supplied quality/time/beneficiary criterion, or a false report is actually delivered | Occurrence and qualification differ; real performance need not satisfy the selected requirement | [P4-S08](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L27); [performance conservation verdict](../phase-5/CONSERVATION_VERDICTS.md#L13) |

## F4 - Operating conditions and capacity

**Owns in the proposed Economy specialization:** authored operation/configuration and supported current inputs, availability, service/storage capacity and access conditions. Expected hours or staffing remain distinct from actual availability. Opportunities derive from relevant resources, terms, conditions and eligible actor context; they are conditional possibilities, not authoritative balances or guaranteed results ([candidate:79-81](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L79)).

**Distinctions that must survive:** operation / owner / operator / employee / management grant; offering / communicated binding offer; schedule / actual activity; paid access / use / successful consequence; suitable product / willing funded demand. Cash surplus, commercial result under a stated recognition basis, authorized distributable pool and funded payout remain separate derived questions across F1-F4, with attributed reports in F5.

**Does not own:** autonomous demand generation, guaranteed profit, health/needs truth, social trust, consent, information acquisition, violence or a separate opportunity truth system. Stores, restaurants, warehouses, housing services, employers, clubs, fences and mixed businesses are configurations. Payday, weekends and re-entry cannot create sales or replay covered activity. Household recovery and comparative crime/work rewards remain content and proof questions.

**Encounter / KeyWrapping dependencies:** Encounter supplies time, conditions, admitted interruptions and consequences. Management/access permissions require actual scoped authority under accepted KeyWrapping constraints; economic interest alone supplies neither. Actor-facing opportunities use eligible acquired context. No schedule, aggregate promotion algorithm or runtime availability protocol is accepted here.

**Strong counterexamples already used:**

| Counterexample | Separation it challenges | Existing source |
| --- | --- | --- |
| Fence likes the goods but lacks money, capacity, willingness or downstream opportunity | Product fit is not guaranteed demand; partial refusal leaves unsold goods intact | [P4-S11](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L30); [cold O24](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L96) |
| Weekend, time skip and passive ownership coexist with recurring rent; a later period may earn while a replay may not | Prospective rhythms are not effects; new supported activity differs from repeated coverage | [adversarial PC04](../phase-7/PATHOLOGICAL_COMBINATIONS.md#L67); [cold C9-D](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L47) |
| Paid admission grants no introduction/consent; paid bed or shower access does not establish use or recovery | Capacity, access, service occurrence and externally supplied outcome differ | [P4-S08](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L27) / [S12](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L31); [cold O23](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L95) / [O26](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L98) |

## F5 - Attributed economic accounts

**Owns in the proposed Economy specialization:** attributed assertions/reports with supported account, artifact, authorship and communication context. Asserted subjects can be nonexistent, hypothetical or unresolved; no phantom actual sale or loss is needed. Official, private, secret/off-books, receipt, manifest, payroll, tax and insurance accounts share this concern ([candidate:95-103](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L95)).

**Distinctions that must survive:** actual occurrence / actual record existence / asserted content / asserted signer or authority / supported authorship / eligible acquired fragment / belief or knowledge. Authenticity, secrecy, arithmetic consistency and official status certify no commercial truth. A bank statement is F5; credited bank value is F1. A mere assertion of authority differs from a genuine current institutional act performed under the owning authority's exact guards.

**Does not own:** canonical economic truth, a privileged criminal ledger, actor reference/knowledge storage, automatic disclosure, investigation, inference, guilt, tax payment, insurance rights or institutional acceptance. Changing or destroying a record may affect future access; it does not undo prior effects, protected history or already acquired fragments, nor guarantee another clue. False revenue may exceed real throughput; capacity is no lie validator.

**Encounter / KeyWrapping dependencies:** Encounter owns actual account creation/change/destruction and communication history. Accepted KeyWrapping architecture owns reference/claim/acquisition and current-authority/performance constraints. Every actor-facing label, alias, menu, export or failure reason needs eligible scope. Future Information Economy owns discovery/inference/response; no executable sealing proof follows from documentary compatibility.

**Strong counterexamples already used:**

| Counterexample | Separation it challenges | Existing source |
| --- | --- | --- |
| Actual receipts 50, official 35 and secret 45; a real false claim describes a nonexistent shipment | Both books may lie; assertion requires no fabricated F2 subject | [P4-S07](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L26); [cold O14-O15](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L86) |
| Genuine scoped grant versus an impostor's identical prose; one actor receives a fragment and another receives nothing | Authorship, truth, authority and acquisition differ; valid acts remain possible through accepted guards | [family clarification](../phase-4/FAMILY_STRUCTURE_FOR_AUDIT.md#L28); [cold O29](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L101) |
| Mixed business reports 600 sales, claims a false loss and deposits actual cash | Report magnitude, funded effects, tax basis, source and recipient decision remain separate | [adversarial PC05](../phase-7/PATHOLOGICAL_COMBINATIONS.md#L84); [cold C9-E](../phase-9/SCENARIO_VERIFICATION_MATRIX.md#L55) |

## Conditions across all five families

All five share one Encounter-authoritative history. Ordinary and shadow activity reuse the same positions, effects, requirements, operating constraints and fallible accounts; classification, source, permission and acquired knowledge can vary independently. Aggregate background activity is coarse representation of that same history, with declared coverage and exclusions, rather than a second stock/money engine. Refinement preserves consequential facts and cannot replay events or invent unsupported old precision. Finite protected support must preserve needed terms, causes, credits and exceptions; no microscopic accounting, indefinite history or safe-compaction promise follows ([candidate:107-141](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L107)).

KeyWrapping's bounded architectural/design baseline and semantic invariants are already owner-accepted. Its runtime is absent/unaccepted, shared Encounter integration remains unaccepted and representations remain unfrozen. Economy's five-family candidate remains proposed pending the owner's explicit decision. The independent Phase 5/7/9 counterexamples support documentary coherence at their stated scope; they do not establish runtime enforcement, full actor-facing sealing, balance, playability, legibility or fun. No D01-D11 residual is resolved by this summary.
