# Transaction, commitment and authority donor mining

**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT

**Version:** v0.1

**Date:** 2026-10-22

**Role:** Transactions, Commitments & Authority Miner

**Purpose:** Evidence and design recommendations for synthesis; this report does not freeze a transaction state machine, publish a schema, or authorize implementation.

## Source precedence and scope

The owner's production sign-off governs this work. The supplied complete KeyWrapping Context v0.1 is the design baseline; its established directions, recommendations and open choices remain distinguishable. The reviews refine recommendations without automatically becoming accepted mechanics. C2.1 B0 is a comparison input only. Repository ownership boundaries remain in force: Encounter owns interaction meaning and validated consequences. Atlas, Room Creator and ZANT do not acquire mutation authority through references.

Relevant baseline evidence is in Context §§13–15 (Functions, grouped exchanges, saying/agreeing/doing), §§17–18 (referencable deals, exact versions and preliminary lifecycle), §§19–21 (history, receipts, claims and sealed perspectives), §25 (spoken versus queued communication) and §29 (warehouse counteroffer). Section 18's named lifecycle is explicitly recommended and preliminary. The design review's immediate-on-hearing account of talk verbs is qualified by the reply's “Talk verbs need conditions to count” refinement. Use the package [source snapshot](SOURCE_SNAPSHOT.md) to identify local source copies and revision evidence; filenames do not determine precedence.

This report uses three labels:

- **SOURCE EVIDENCE:** what a cited donor or the baseline actually says.
- **ENCOUNTER PROPOSAL:** an original recommendation for this proposed substrate, requiring later selection and testing.
- **OPEN:** a choice this research does not settle.

## Checked primary sources and use boundaries

All checks are dated **2026-10-22**. These are conceptual references. No external vocabulary dump, ontology, source code, example JSON, table or donor document is vendored here.

| Key | Exact source and publication | Sections checked | License evidence and proposed use |
| --- | --- | --- | --- |
| O-M | [ODRL Information Model 2.2, W3C Recommendation 2018-02-15](https://www.w3.org/TR/2018/REC-odrl-model-20180215/) | §§1.3, 2.1.2–2.1.3, 2.3, 2.5, 2.6.1–2.6.7, 2.7–2.10 | Header links the [W3C Software and Document License, 2015](https://www.w3.org/copyright/software-license-2015/). Conceptual comparison in original prose. |
| O-V | [ODRL Vocabulary & Expression 2.2, W3C Recommendation 2018-02-15](https://www.w3.org/TR/2018/REC-odrl-vocab-20180215/) | §§3.2, 3.3, 3.7, 3.9–3.18, 4.3 | Same permissive document-license link in the dated publication's header. Selected terms identify concepts; no vocabulary import or ODRL-conformance claim. |
| A-C | [Activity Streams 2.0 Core, W3C Recommendation 2017-05-23](https://www.w3.org/TR/2017/REC-activitystreams-core-20170523/) | §§4.1–4.4, 6–7 | Lead confirmed the [official repository license](https://github.com/w3c/activitystreams/blob/main/LICENSE.md) through the GitHub connector on the check date: repository documents use the W3C Software and Document License. Conceptual reference; no copied serialization. |
| A-V | [Activity Vocabulary, W3C Recommendation 2017-05-23](https://www.w3.org/TR/2017/REC-activitystreams-vocabulary-20170523/) | §§2–4 (Activity, Accept, TentativeAccept, Offer, Reject, Undo), §§5.1, 5.5 | Same repository-document license evidence. Distinguish records of social acts; no social-web transport or federation dependency. |
| S-A | [Schema.org Action](https://schema.org/Action), footer V30.1 / 2026-09-16 | Action properties and role descriptions | [Schema.org FAQ, reuse terms](https://schema.org/docs/faq.html) identifies schemas, documentation and markup examples as CC BY-SA 3.0. Site software is separately Apache 2.0. Use concepts and citations only; no copied definitions or examples. |
| S-P | [Schema.org Potential Actions documentation](https://schema.org/docs/actions.html), checked alongside V30.1 | Parts 1–3: status, potentialAction, EntryPoint | Same documentation terms. Use the potential/performed distinction; do not copy execution endpoint conventions. |

Schema.org's live pages explicitly identify themselves as the development version. The [release listing](https://schema.org/docs/releases.html) confirms release 30.1 dated 2026-09-16, but the live term/doc pages are a dated observation, not a verified immutable 30.1 snapshot. Pin an official release artifact before any future vocabulary import.

Access limitation: this miner's web fetch of the ActivityStreams repository license returned a cache miss. The lead's successful GitHub-connector read supplies the stated license evidence; the report does not misreport the unsuccessful fetch as verification. Reuse of copied W3C material would require the applicable notice, disclaimers and change notices; copied/adapted Schema.org material would require attribution and applicable share-alike handling. The [source/license ledger](SOURCE_LICENSE_LEDGER.md) is the package-level record of actual use.

## Donor evidence, retained concepts and mismatches

**SOURCE EVIDENCE — O-M.** ODRL distinguishes offered rules from granted rules, and separates permissions, prohibitions and duties. Constraints qualify rules; a duty may condition permission. Its duty definition requires the obligated party to be able to exercise the action (§2.6.3). Its composition rules can expand multiple actions and targets into atomic rules (§2.7). Policy replacement and conflict handling have specified processing behavior (§§2.8–2.10). This is a rights-policy model, not evidence of an Encounter negotiation or performance protocol. [ODRL Model](https://www.w3.org/TR/2018/REC-odrl-model-20180215/)

**SOURCE EVIDENCE — O-V.** The vocabulary supplies assigner/assignee and additional party roles; it distinguishes duties, consequences and remedies. Logical operators include conjunction, alternatives, exclusive choice and ordered constraint satisfaction. `andSequence` applies to constraints and warns about unresolvable ordering (§3.17.4). It does not specify simultaneous exchange of world effects. [ODRL Vocabulary](https://www.w3.org/TR/2018/REC-odrl-vocab-20180215/)

**SOURCE EVIDENCE — A-C.** An Activity can describe something past, ongoing or future and relate actor, object, target, origin, result and instrument (§4.4). Core privacy/security sections require additional care; the data model is not an actor-perspective access-control mechanism. [Activity Streams Core](https://www.w3.org/TR/2017/REC-activitystreams-core-20170523/)

**SOURCE EVIDENCE — A-V.** Offer, Accept, TentativeAccept, Reject and Undo give distinct social-act descriptions. Section 5.5 distinguishes an inverse act from explicitly undoing a prior activity. Audience targeting (§5.1) describes recipients; it does not establish that recipients actually heard, understood, accepted or believed a message. These terms do not supply Encounter's assent guards or authority rules. [Activity Vocabulary](https://www.w3.org/TR/2017/REC-activitystreams-vocabulary-20170523/)

**SOURCE EVIDENCE — S-A/S-P.** Action exposes participant roles and possible results; Potential Actions distinguishes potential, active, completed and failed descriptions and discusses entry points. Neither the broad Action roles nor its small status vocabulary expresses all negotiation, agreement and fulfillment questions. [Action](https://schema.org/Action), [Potential Actions, Parts 1–3](https://schema.org/docs/actions.html)

The following are **ENCOUNTER PROPOSAL** dispositions, not claims that these donors mandate Encounter behavior.

| Concept investigated | Disposition | Encounter-specific reason |
| --- | --- | --- |
| Offer versus agreement (O-M/O-V) | Retain distinction | Proposing is not binding all parties or executing terms. |
| Party functional roles (O-V) | Adapt | Separate speaker, addressee, assent party, obligor, beneficiary, grantor and executor; one actor can fill several roles explicitly. |
| Duty / permission / prohibition (O-M/O-V) | Retain distinction | Owing an act, being allowed and being forbidden answer different questions. |
| Constraints and ordered conditions (O-V) | Adapt | Use typed, grouped Encounter clauses with explicit time/quantity interpretation. |
| Capable obligor as duty prerequisite (O-M) | Reject as universal validity rule | Context §18 permits dishonest or incapable acceptance. |
| Consequence/remedy (O-V) | Reference only | Consequences require selected Encounter authority and terms; penalties are not automatically created. |
| Cartesian atomic rule expansion (O-M) | Reject for grouped exchange semantics | A flattened set can lose the dependency binding both sides of the warehouse bargain. |
| Policy inheritance/replacement/conflict defaults (O-M) | Reject as defaults | Hidden imported terms, automatic supersession and universal winning policies would bypass exact assent and local authority. |
| Described social activity (A-C/A-V) | Retain distinction | Record what was communicated separately from resulting effects. |
| Undo (A-V) | Adapt narrowly | A later reversal/cancellation event keeps the original history and needs valid scope and authority. |
| Audience fields (A-V) | Reject as receipt or secrecy proof | Delivery and authorized projection need independent evidence. |
| Action role slots (S-A) | Adapt | Action-specific roles/type restrictions must refine generic agent/object/participant roles. |
| Potential/completed/failed (S-P) | Retain distinction | Discussability, attempt and execution result must remain separate. |
| EntryPoint target and web execution (S-P) | Reject for this pass | No endpoint, adapter, service or execution machinery is authorized. |

The clearest donor conflict is capability: retaining ODRL's complete duty-validity assumptions would silently remove KeyWrapping's intentional lies and false beliefs. A proposed commitment may be validly expressed while its promised world act remains infeasible or unsupported. A permission *grant*, in contrast, still needs the grantor's actual authority; believing one controls a door does not create that authority.

## Synthesis recommendations and traceability

Everything in this section is an **ENCOUNTER PROPOSAL**. The cited baseline/donor keys identify the problem that motivates each recommendation; they do not promote the recommendation to an owner-approved mechanic.

| ID | Recommendation for synthesis | Traceability and unresolved choice |
| --- | --- | --- |
| T01 | A proposal has a stable negotiation identity and separately addressable communicated versions. A version records its grouped expression, role assignments, required assent parties, explicit constraints and originating communication. Spoken versions are preserved. | Context §§17–18, 29; O-M offer/agreement distinction. Exact record names and version syntax remain synthesis choices. |
| T02 | Assent names one exact version and its exact scope. A changed amount, participant, deadline, condition or alternative creates a new version; accepting an older version does not accept the newest one. Contextual “yes” resolves only when there is one eligible visible target. | Context §§14, 18. Terms-digest format is optional; exact identity and preserved terms are the requirement. |
| T03 | Multi-party agreement requires evidence for each party whose assent the proposed terms require. A proposer can communicate its own commitment explicitly, but addressees, witnesses, recipients and beneficiaries are not silently assent parties. | Context §18 and §33.11; O-V party roles. Default unanimity versus authored quorum, representation and joint obligations remain OPEN. |
| T04 | Separate acceptance of terms, activation conditions and world performance. Silence, receipt, provisional interest, an “I agree with you” stance and a claim that a deal exists cannot replace valid assent. | Context §§15, 18, 25; reply's performative refinement; A-V distinctions. |
| T05 | Keep each obligation addressable with an obligor, beneficiary or entitled party, promised action/sense, typed participants, quantities, activation conditions, due conditions and provenance to accepted terms. | Context §18; O-V roles/duty/constraints. Promise taxonomy and third-party enforcement remain OPEN. |
| T06 | Record normative permission/prohibition separately from physical capability, execution support and knowledge access. A prohibition can be violated; its existence does not automatically make a physical action impossible. A gameplay permission does not reveal a secret. | Context §§4, 18, 20; repository boundary matrix; O-M rule distinction. Local priority/authority resolution remains OPEN. |
| T07 | Match fulfillment to actual authorized effect evidence and an exact obligation. Track credited quantity/scope, including partial results, while preserving original terms. Reusing the same effect cannot double-credit the same performance. | Context §§18, 25, 34; A-C result distinction. Fungible credit allocation and satisfaction policies remain OPEN. |
| T08 | Distinguish conditional activation, due deadline, execution order and exchange dependency. An unmet condition is not automatically breach; a relative time needs a named anchor. Unknown conditions must not be treated as true. | Context §§14, 18; O-V logical constraints; S-P status distinction. Canonical simulation clock, deadline boundaries and simultaneous-event ordering remain OPEN. |
| T09 | Waiver releases an identified entitlement/obligation scope through authorized action. Being the speaker, debtor or a bystander does not make one entitled to waive another's right. In a multi-beneficiary term one actor's release cannot erase everyone else's rights. | Reply debt-cancellation example; O-V party roles. Joint-holder authority and contractual waiver restrictions remain OPEN. |
| T10 | Breach, dispute and impossibility need different records or dimensions. A missed due condition can justify an evaluated breach under chosen terms; an accusation is only a claim. A lost capability may make performance impossible without deciding blame, release or compensation. | Context §§18–20, 33.11; O-V consequence/remedy reference. Grace periods, fault, excuse and repair policies remain OPEN. |
| T11 | Withdrawal targets an unaccepted proposal/version under the proposer's authority. Cancellation of accepted terms requires the selected cancellation right or fresh consent. Both preserve earlier speech, completed effects and surviving obligations. | Context §18; reply performative refinement; A-V Undo reference. Counteroffers superseding previous offers and withdrawal/assent race policy remain OPEN. |
| T12 | Renegotiation creates a linked amendment proposal and new assent; it cannot edit an earlier agreement in place. Delegating performance does not silently transfer the original obligor's responsibility or beneficiaries' rights. | Context §§18, 29; O-V distinct roles. Assignment/novation-like effects require a later explicit domain rule. |
| T13 | Evaluate communication validity using actual authority and eligible targets, while NPC willingness uses actor-local beliefs. Keep these results separate; do not expose hidden infeasibility as an otherwise unknowable rejection reason. | Context §§18, 20, 24; reply refinement. An impossible promise may persist as a commitment without creating world capability. |
| T14 | A failed performative still records a communicated attempt/claim and its permitted consequences. “I allow you in” without authority grants nothing; “I accept” without an eligible exact proposal forms no agreement. Others may nevertheless believe the attempted act succeeded. | Reply's conditions-to-count rule; Context §§15, 19–20; A-V activity distinction. Per-action failure policy remains OPEN. |

### Information disclosure is itself scoped performance

**ENCOUNTER PROPOSAL (T07/T08/T13).** A promise to tell “what I heard” differs from a promise to supply a true, verified account. Delivery of false information could satisfy the former content promise while violating the latter; truth criteria must be represented by the agreed terms, not inferred from the verb Tell. A claim of having disclosed something does not establish that disclosure occurred. A real disclosure requires the intended payload, actual recipient and qualifying receipt/source path. Full comprehension or belief need not follow automatically.

Once the recipient received a secret, cancelling the bargain cannot make them unlearn it. Returning coins is a further effect if authorized; it is not achieved by deleting the old transfer. A later failed bargain may still create persistent evidence, suspicion or a dispute. This recommendation follows the baseline's saying/doing separation and sealed history; it is not an ODRL or ActivityStreams compliance rule.

### Separate dimensions before choosing states

**ENCOUNTER PROPOSAL.** The preliminary Context §18 sequence is a useful discussion aid, but treating every label as one mutually exclusive state loses valid combinations. A partly paid debt may also be overdue, disputed and currently impossible to complete. Synthesis should preserve at least these questions separately:

| Question | Illustrative answers, not a frozen enum |
| --- | --- |
| Has this exact proposal been communicated and is it eligible for assent? | Unspoken; communicated; no longer available |
| Which required parties have assented to these terms? | Evidence by party and exact version; absent or tentative assent |
| Does a commitment exist and which conditions activated it? | Valid formation evidence; activation waiting or established |
| How much authorized performance has been credited? | No credited effect; partial quantity/scope; satisfied scope |
| Is the due condition met or missed? | Not due; due; deadline passed; time basis unresolved |
| What changed or released the obligation? | Specific waiver, cancellation, amendment or other selected authority |
| What is feasible, alleged or contested? | Actual impossibility evidence; actor-local feasibility belief; dispute claims |

No state label is a substitute for the cause, effective time, authorized scope and provenance of a change. Presentation can summarize a deal for an actor only from information that actor is allowed to know.

### Bounded transition cases for paper review

These are **ENCOUNTER PROPOSAL** guard cases for synthesis and auditing. They do not define an executable state machine or a final list of states.

| Attempt | Evidence/guard to examine | Permitted conceptual result | Result to reject |
| --- | --- | --- | --- |
| Speak a prepared bargain | Actual performed communication, recipients and grouped terms | A preserved communicated version and individual receipts as applicable | Queueing alone forms everyone's agreement |
| Accept version V1 | Eligible exact target; identified assent party; that party's available terms; any chosen formation rule | Record valid scoped assent; form agreement only when required assent conditions hold | Retarget assent to V2 or hidden terms |
| Counter V1 | New grouped terms and link to V1 | Preserve V1 and communicate V2 | Rewrite V1 or assume V1 automatically disappears |
| Fulfill an obligation | Exact obligation, actual effect evidence, compatible quantity/scope, previous credit | Credit supported performance under selected satisfaction rule | A Remark Fulfill executes a transfer or prooflessly marks completion |
| Waive an entitlement | Exact scope and actual waiver authority | A linked release affecting only authorized scope | Debtor declares debt erased or a co-creditor loses an unwaived right |
| Deadline passes | Chosen time basis and boundary, activation/due terms, credited performance and exceptions | Evaluate due/breach questions separately and preserve evidence | Unknown time or an unmet activation condition proves breach |
| Performance becomes impossible | Supported world evidence and affected obligation | Record feasibility change; apply only already selected release/breach rules | Automatically delete the agreement or disclose the hidden cause |
| Withdraw pending terms | Exact pending scope, proposer/authorized representative, chosen ordering policy | Stop later assent where the policy permits; preserve history | Revoke an already formed agreement through ordinary withdrawal |
| Cancel accepted terms | Exact right or required fresh consent, surviving terms/effects | Record scoped termination/release and surviving duties | Erase coins, secrets, prior breach or old communications |
| Attempt an invalid performative | Actual speaker, target and authority conditions | Preserve occurrence/claim and actor-specific interpretations | Create unauthorized authority or reveal private validation details |

## Scenario recommendations for independent auditors

All scenarios are proposed paper checks. They have **not** been executed against a runtime; no harness or implementation is supplied.

| ID | Adversarial setup | Expected distinction to preserve |
| --- | --- | --- |
| TX01 | Guard counters 20 coins plus information for warehouse entry with information only for records access; Player says “yes” to the original. | The acceptance target remains the original exact version; no accidental records-access agreement or invented agreement with newest terms. Eligibility of the old offer is a selected policy. |
| TX02 | Two simultaneously pending bargains share the visible label “Warehouse Deal”; Player says “accept that.” | Resolve an eligible unique context or require clarification. A display label cannot select secretly. |
| TX03 | A three-party exchange needs Player payment, courier delivery and guard permission; only Player and guard assent. | No silent courier commitment. A witnessed assent is not the courier's own assent. |
| TX04 | One party adds a private fee after the others accepted. | New terms need their own version and required assent; no binding undisclosed amendment. |
| TX05 | Player transfers 20 of the agreed 50 coins and says “Fulfilled.” The same transfer is replayed. | Partial credit remains 20 and is not duplicated; the claim is separate from authoritative performance. |
| TX06 | Payment and secret disclosure precede access. Guard cannot grant access. | Accepted promise versus actual grant authority remain separate; secret stays learned after dispute/cancellation. No automatic refund. |
| TX07 | Guard sincerely believes it controls the door, and an NPC promises a key it secretly lacks. | Invalid permission grant versus potentially valid incapable promise; private belief and objective feasibility are distinct. |
| TX08 | Debtor says “I cancel your debt”; one of two creditors later waives only its share. | Failed first performative; scoped later waiver; remaining creditor's entitlement survives. |
| TX09 | A deadline passes while an activation condition remains unmet; another actor alleges breach. | Activation, due status, canonical evaluation and allegation remain distinct. |
| TX10 | Key destruction makes return impossible; nobody saw the destruction. | Canonical feasibility can change without global knowledge, automatic blame or automatic release. |
| TX11 | A pending offer is withdrawn at the same simulation instant as assent. | Chosen deterministic precedence or unresolved ordering is visible in diagnostics; no invented timing rule. |
| TX12 | An accepted deal is “withdrawn” by one party without an agreed cancellation right. | Withdrawal word does not grant termination authority. The attempted communication can still matter socially. |
| TX13 | A prohibition and a permission from different purported authorities cover the same door. | Preserve each authority/scope and conflict; no universal permission-wins, prohibition-wins or policy-void rule. |
| TX14 | Each exchange side requires the other to act first; an OR clause also offers an alternative item. | Detect impossible dependency/deadlock and identify who may choose an alternative; flattening cannot change obligations. |
| TX15 | An actor says “I heard payment occurred,” while the real transfer never happened. | A report and belief cannot become fulfillment evidence merely by acquiring a wrapper. |
| TX16 | An eavesdropper hears only “I accept the deal” and can recognize the deal label. | Receipt establishes only heard material; private terms, participants, prices and assent targets do not leak through expansion. |
| TX17 | Acceptance fails because of a hidden cancellation, and UI filtering or an error message reveals the secret canceller. | Diagnostic truth stays outside unauthorized projection. The public failure surface must not reveal inaccessible cause, identity or terms. |
| TX18 | Speaker tells a false rumor exactly as promised; the recipient heard it but disbelieves it. | Disclosure performance, source attribution, truth and belief are evaluated separately under exact agreed content/quality terms. |
| TX19 | A party delegates delivery to a helper, who refuses; original party says its obligation moved. | Delegation of work does not by itself transfer commitment or release the original obligor. |
| TX20 | Reload/replay reconstructs two partly fulfilled versions and a later waiver. | Preserve exact version assent, credited effect identities, history and actor-scoped knowledge without duplicating consequences. |

## Open decisions to carry into synthesis

1. Which communicative constructions can perform Accept, Promise, Allow, Waive/Release and Cancel, rather than merely requesting, offering or reporting those acts? A `REMARK` Function alone cannot decide this; action sense, target, tense and speech-act intent matter.
2. Does communicating an offer also bind its proposer conditionally, and when can the proposer revoke it? What does a counteroffer do to older pending versions?
3. Which parties must assent in a multi-party bargain; can an authorized representative or explicitly authored quorum act for them? How is the authority itself established without a new global institution?
4. What does assent require the actor to have received or understood? Do mistaken interpretations create a dispute, prevent formation or support deliberately asymmetric agreements? Never bind an actor to secret canonical terms merely because it knows an ID.
5. Which quantities, quality criteria and evidence satisfy an obligation? Who allocates one divisible payment across debts, and when can one effect satisfy multiple explicit promises?
6. Which conditions are canonical, actor-perceived, or framed as a party's judgment? Who can declare fulfillment, excuse delay or settle a disputed quality standard?
7. What simulation clock, relative-time anchors, deadline boundaries and tie-breaking order apply? Dates in research documents are not gameplay clock requirements.
8. Which waiver, cancellation, excuse, compensation and surviving-obligation rules are authored per bargain/domain? No generic law of contracts is adopted by using transaction vocabulary.
9. How are permission/prohibition conflicts resolved at a concrete bounded authority scope? How do permission expiry/revocation affect a still-active promise to keep access available?
10. Which evidence and validation explanations can each actor see? Every exact version, duty and cause reference requires the same perspective check as a wrapper.

Synthesis should choose enough detail to make the JSON-shaped documentation and paper scenarios coherent, label unresolved policies explicitly, and preserve them in the decision log. It should not convert these questions into runtime modules, accepted contracts or actual `.schema.json` files.
