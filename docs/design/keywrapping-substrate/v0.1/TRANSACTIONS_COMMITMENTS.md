# Transactions, commitments and scoped authority

**Version:** v0.1 · **Date:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT
**Role:** KeyWrapping Architect, after all four mining reports

This document proposes the semantics of bargains and commitments for paper review. It does not implement a deal engine, select a persistence backend, install authority bindings or change any accepted contract/package. The owner approved documentation production; actual `.schema.json` files, runtime work, C1/C2.1 B0 edits, Unity integration, commits and publication are outside this role's authorized work. C2.1 B0 is comparison evidence only. See [source authority](../../../research/keywrapping-substrate/v0.1/SOURCE_SNAPSHOT.md) and the [decision log](DECISION_LOG.md).

## 1. Evidence and design status

KW-CONTEXT §§13–18, 25 and 29 establish grouped exchanges and the distinctions between saying, agreeing and doing. Its preliminary lifecycle, stable version IDs and detailed obligation organization are recommendations rather than a frozen state machine. Incapable/dishonest assent, exact terms, partial fulfillment and preserved counteroffer history are essential source directions carried forward. KW-REPLY's “Talk verbs need conditions to count” qualifies the earlier Design Review's immediate-on-hearing rule.

The [transaction miner](../../../research/keywrapping-substrate/v0.1/TRANSACTION_DONOR_MINING.md) recommends T01–T14, used below as trace keys. The [action dictionary](../../../research/keywrapping-substrate/v0.1/ACTION_PREDICATE_MAPPING.md) supplies proposed Accept/Agree, Cancel/Withdraw/Release/Forgive and related sense distinctions. Its D01-style labels locate donor evidence; they are not ratified sense-registry IDs. All record organization, formation rules and guards here are **Encounter proposals** for owner/paper review.

ODRL informed party/duty/permission distinctions, ActivityStreams social-act/effect distinctions, and Schema.org potential/performed actions. Their complete models are not adopted. ODRL's duty-capability premise is not a universal Encounter assent gate, its policy replacement is not negotiated amendment, and its constraint `andSequence` does not create atomic barter. Exact primary links, version dates, limitations and rights are in the mining report and [license ledger](../../../research/keywrapping-substrate/v0.1/SOURCE_LICENSE_LEDGER.md). No donor code, data or schema is imported.

## 2. Proposed record family and meanings

These are logical responsibilities, not required tables, services or an installed serialization.

| Concept | Minimum proposed meaning | Does not imply |
| --- | --- | --- |
| Negotiation/wrapper | Continuing addressable subject for a bargain and linked history | An agreement exists or every holder knows its terms |
| Proposal version | Immutable communicated grouped terms, role bindings, required assent parties/scopes, conditions and originating expression | Queueing forms a proposal for every listener; newest version replaces earlier terms automatically |
| Assent act | A particular authorized party's explicit effective acceptance of an exact eligible version and term scope | Receipt, silence, tentative interest or generic Agree suffices |
| Agreement | Evidence that the selected formation rule is satisfied for the exact terms and required parties | Ability, honest intent, actual performance or universal knowledge |
| Obligation | An addressable promised performance attributable to an obligor, with beneficiary/entitlement, accepted basis, activation and due/satisfaction terms | Permission, physical capability, immediate execution or enforceability by every actor |
| Permission/prohibition | A bounded normative grant/restriction from an actually authorized source | The door opens, the act is physically possible/impossible, or hidden knowledge is revealed |
| Performance/effect evidence | An actual authorized result/disclosure/grant tied to its world or communication cause | An actor's assertion that performance happened proves it |
| Fulfillment credit | A supported quantity/scope of a particular effect credited toward an exact obligation under its terms | Every deal duty is complete or the same effect can be credited repeatedly |
| Release/amendment/dispute/evaluation | A specific later change, contest or evaluation with authority, scope, evidence and time | Rewriting the agreement, erasing completed effects or converting an accusation into guilt |

An expression/claim can concern an alleged deal that has no actual agreement. A wrapper for “the broken deal” may be a disputed account rather than an objective breach. Maintain the perspective/claim boundary in [PERSPECTIVE_PROVENANCE.md](PERSPECTIVE_PROVENANCE.md).

## 3. Exact proposal versions and eligible assent

**C01 — preserve communicated terms.** A version fixes grouped clauses, explicit senses and actors/recipients, resource quantities/units, deadlines/time anchors, conditions, alternatives, required assent parties and material dependency rules. Changing any of these creates a new linked version. Preserve the original expression, actual recipients/fragments and time. An unspoken/queued preparation is not a communicated proposal and creates no listener acquisition. Mutable labels are not term identity. Basis: KW-CONTEXT §§14, 17–18, 25, 29; T01/T02.

**C02 — acceptance identifies exact scope.** Effective assent must target the exact eligible version and terms the party is authorized to accept. Each required party needs legitimate access to the full terms of its assent scope, including conditions, obligations, entitlements and material dependencies it is purportedly accepting. An opaque target ID or hash cannot bind a party to undisclosed fees, changed amounts or hidden binding conditions. A later version cannot inherit a previous “yes.” If contextual “yes” has more than one eligible actor-visible target, ask for clarification rather than resolving from hidden state. Basis: T02/T03/T13; KW-CONTEXT §§14, 18.

This rule permits asymmetric perspectives: a bystander may know only the deal's label, and a party need not learn unrelated sealed information or another private side arrangement. It does not permit a party to be bound by unknown material terms in its own scope. A later implementation of separately disclosed multi-party subagreements must identify exactly which parties and scoped terms each assent binds; this v0.1 does not use partial knowledge to imply assent to a whole hidden bargain.

**C03 — required parties are explicit.** A version declares whose assent is required for the proposed agreement scope. The documented simple formation rule requires each such party's valid assent. A speaker, listener, witness, beneficiary and obligor are distinct roles, even if one actor fills several. The proposer is not automatically committed merely because an OFFER was sent; an explicitly represented undertaking within an authorized proposal can supply its own scoped commitment evidence, otherwise the proposer assents separately. No witness, bystander or absent third party is bound by being named. Representation needs actual authority for the exact represented scope. Authored quorums, joint liability and partial agreements remain OPEN and cannot be inferred from the simple rule. Basis: T03/T04; action dictionary Accept/Promise/Assign.

**C04 — formation is separate from feasibility and honesty.** Valid self-assent can occur despite impossible performance, mistaken capability or deliberate dishonesty. Preserve an explicitly modeled private intent separately; falsity or failure alone does not prove intent. Agreement cannot create absent resources, world capability or authority. A person cannot bind someone else by promising that person's action without appropriate standing. No imported ODRL capability prerequisite blocks every impossible promise. Basis: KW-CONTEXT §18; T05/T13; social donor private-decision boundary.

Eligibility of old countered versions, withdrawal/assent races, expiry rules and simultaneous ordering require explicit scenario/owner policy. Until selected, an ambiguous target or ordering is unresolved; do not silently choose “latest wins,” “counteroffer cancels everything,” or a universal priority rule. The integrated fixture below selects enough order to avoid ambiguity without settling the general policy.

## 4. Communicative force and validity

**C05 — current self performance is explicit.** An institutional speech act takes effect only when its selected sense explicitly means current self performance; it is actually delivered through an eligible channel; its target/version, party, time and scope are resolved; and the selected act's lifecycle/authority conditions hold. REQUEST ACCEPT and OFFER ACCEPT discuss an act. A REMARK can be a report or an explicit current performance; its Function alone does not determine effects. Basis: KW-REPLY performative refinement; action dictionary common C/I gate; T04/T14.

| Expression in an eligible encounter | Proposed result |
| --- | --- |
| REMARK “I hereby ACCEPT Warehouse V2” with valid exact-party/terms/lifecycle guards | Record scoped assent; form agreement only if all formation evidence is present |
| REMARK “Ray accepted V2 yesterday” | A received claim about an earlier act; no new Ray assent |
| REMARK quoting “I accept V2” | A quotation/report, not the quoting speaker's acceptance |
| REQUEST ACCEPT V2 | A request addressed to an eligible party, not that party's assent |
| OFFER PROMISE RETURN key tomorrow | Proposed future undertaking; no current promise merely from the word Promise |
| Explicit current “I PROMISE RETURN this key tomorrow” | Evaluate a self-undertaking with exact performance, beneficiary, channel and scope; create no return effect |
| “I ALLOW entry” without actual authority | Attempted/claimed grant communication; no valid permission grant |

Private contextual speech can be short when the speaker's accessible context uniquely resolves it. It cannot use canonical secret links to decide which proposal a listener meant. Replayed, quoted, past, hypothetical, conditional future or third-party acts do not re-exercise institutional powers.

**C06 — failed validity preserves the attempt.** An invalid performative can leave real communication, suspicion, misunderstanding, a claim that it succeeded or an addressable dispute. It changes no purported permission/duty without the missing guards. Others may believe it worked, with their own acquisition/stance evidence. Failure explanation is projected only when the audience may know it; internal eligibility/authority checks cannot become a secret-fact oracle. Basis: T13/T14; KP-06/KP-14.

For standalone promises, beneficiary receipt/acceptance requirements, enforceability, revocability and outcome-versus-best-effort semantics remain OPEN. The proposal above preserves an attributable explicit self-undertaking without assuming the whole bargain-formation mechanism applies identically to every promise.

## 5. Obligation dimensions, timing and fulfillment

**C07 — no single status substitutes for meaning.** A commitment can be partly fulfilled, overdue, contested and now impossible at the same time. Preserve separate dimensions and their supporting evidence; a presentation summary derives only from the viewer's acquired information. Basis: KW-CONTEXT §18; T05/T08/T10.

| Dimension | Required proposed question | Invalid shortcut |
| --- | --- | --- |
| Formation | Which exact party/version/term assent formed the duty? | Deal label or generic “yes” forms all duties |
| Activation | What condition makes the promised performance operative? | Unmet or unknown condition is automatically true/breach |
| Due | When is the performance required, using which named time/causal anchor? | Due time inferred from prose or a later receipt |
| Execution order | Must one act precede another? | Conjunction alone specifies order |
| Exchange dependency | Which performances are consideration/conditions for others? | Flattened independent acts or automatic all-or-nothing rollback |
| Credited performance | Which actual effect satisfies which quantity/scope under which criterion? | Saying Fulfill or Confirm proves completion |
| Release/change | Who validly waived/cancelled/amended what, and when? | A bystander or debtor extinguishes every beneficiary's right |
| Breach/impossibility/dispute | What authoritative evaluation or attributed claim supports each conclusion? | Failure proves guilt; impossibility erases debt; accusation is objective breach |

**C08 — explicit activation and due conditions.** Relative times identify their anchor and relevant clock. BEFORE, AFTER and UNTIL scope over explicit clauses/groups. A conditional promise can exist before its performance condition is met; this does not itself establish breach. Unknown condition satisfaction stays unresolved. A world authority may evaluate an actual condition separately from the actor's knowledge, but any notification or visible status needs an authorized information path. A hidden private mental state cannot become a Player alarm through WAIT/IF without an explicit permitted observation/disclosure mechanism. Deadline boundaries, grace periods and simultaneous-event ordering remain OPEN. Basis: T08; action dictionary Wait and grouping rules; KP-06/KP-10.

**C09 — credit actual evidence once.** Each proposed fulfillment evaluation names the exact obligation, effect evidence, credited scope/quantity, applicable terms and evaluation point. It checks compatibility of actor/recipient, item or currency/unit, condition, timing and any selected satisfaction criterion. Preserve earlier credits so retry/replay cannot count the same performance twice toward the same required scope. One effect supporting multiple obligations requires an explicit allocation/overlap rule; no unlimited reuse is assumed. An accusation of payment, a forged receipt or an actor's belief is distinct from validated effect evidence. Basis: T07; KW-CONTEXT §§15, 18, 25; KP-11.

Partial performance credits only the supported part. Paying 10 of 30 coins leaves 20 of that quantity uncredited under the simple fixture rule; it does not fulfill an independent disclosure. Late payment can satisfy a quantity while leaving a missed deadline question; substitute performance, overpayment, refunds, currency conversion, partial waivers and cure criteria need explicit terms/policy. They are not supplied by the word Pay or Fulfill.

**C10 — information performance has exact content/recipient scope.** “Tell what I heard” differs from “give a verified true account.” A delivered false report may satisfy a promise to pass on that report while failing a separately agreed truth criterion. Actual delivery of the specified selected content to the required recipient is evidence of disclosure; merely claiming to have told them is not. Comprehension, belief and endorsement do not automatically follow. A partial receipt may fail a full-payload delivery criterion. Truth/authenticity standards and the evaluator's authority must be explicit where the terms require them. Basis: T07/T08/T13; action dictionary Tell/Show/Reveal/Confirm/Prove; perspective P02/P04.

No offering of information discloses the hidden payload merely because an OFFER TELL clause names a subject. A recipient learns only the proposal's eligible terms until the later actual disclosure. The disclosed payload cannot expand all nested wrapper facts or reveal hidden actual provenance automatically.

## 6. Authority, normative rules and change guards

**C11 — actual authority is scope-bounded.** Granting access, forbidding conduct, assigning duties, delegating authority, waiving a right or cancelling accepted terms needs actual standing over that exact target/scope/time under a selected authority rule. Believing or claiming authority is insufficient for the actual grant. A delegation cannot exceed the source's delegable scope; representation and revocation need their own provenance. No general hierarchy or policy-conflict winner is selected. Basis: KW-REPLY cancellation/door examples; T06/T09/T13; action dictionary Allow/Forbid/Assign/Delegate/Release.

Normative permission is separate from physical ability, execution support and knowledge access. A valid access grant need not open a locked door; opening a door need not grant legal permission; a prohibition may be violated physically; a permission to read does not by itself create a reading receipt or teach the content. A legitimate promise to seek a grant does not itself grant it. This preserves both source meaning and repository subsystem ownership boundaries.

**C12 — changes preserve history and completed consequences.** Later changes are new scoped acts linked to the old basis. Apply no automatic history replacement, global waiver, truth change or memory erasure. Basis: T09/T11/T12; KW-CONTEXT §§17–18; KP-10/KP-13.

| Proposed change | Guard and exact scope | Preserved result / reject |
| --- | --- | --- |
| Counteroffer | New complete grouped terms, originating party, link to prior version and new communication | Old version/receipts remain; old eligibility follows chosen policy, never silent overwrite |
| Withdraw | Proposer/authorized representative; exact still-withdrawable pending version | Availability can end prospectively; formed duties and old receipts do not vanish |
| Cancel accepted terms | Selected cancellation right over exact scope, or fresh consent of affected required parties | Surviving obligations and completed effects remain identified; mere speaker status is insufficient |
| Waive/Release entitlement | Actual right-holder or authorized representative; exact beneficiary/quantity/scope | Release only that authorized right; one beneficiary cannot erase another's rights |
| Personal Forgive | Speaker's own grievance and identified offense | Expressed forgiveness does not automatically waive a separate legal/financial claim or rewrite actual emotion/history |
| Amend | Linked proposal, changed terms, appropriate new assent for affected scope | Original agreement remains historical; no price/deadline retargeting of old acceptance |
| Delegate performance | Actual delegable task/authority and explicit scope; any selected acceptance rule | Do not silently transfer original liability or every beneficiary's rights |
| Evaluate breach | Existing duty, due/condition facts, selected fault/excuse/standard and qualified evidence | An accusation remains a claim; inability, refusal and deadline miss are not interchangeable |
| Record impossibility | Specific supported loss of feasibility for an identified performance | Does not automatically excuse fault, release entitlement, repay money or award compensation |
| Raise dispute | Actor's actual challenge/claim about exact scope with receipt/provenance | Does not itself suspend/cancel duties or invert authoritative facts |
| Restitution/repair | New separately authorized transfer, disclosure, waiver or other supported effect | Deleting old effects is not a refund; a disclosed secret cannot be unlearned |

Actual assignment/novation, joint rights, cancellation fees, enforcement/remedy, breach excuses, liability transfer and default conflict resolution remain OPEN. The model can describe their absence or a scenario-selected rule without inventing universal law.

## 7. Integrated warehouse paper fixture

This aligns with the [JSON record family](JSON_RECORD_FAMILY.md). All identities and selected policy belong to an illustrative Encounter warehouse fixture; values are examples, not defaults. The fixture chooses access-first activation and a clear assent order. Other execution orders and counteroffer eligibility remain open.

1. The Player actually communicates V1: a grouped offer to give 50 coins **and** tell Ray's selected account of hiding the spare key **in exchange for** the guard granting bounded warehouse access. The proposal describes future information performance; it does not transmit that information now.
2. The guard communicates a linked V2 with 30 coins and the same selected disclosure/access scope. V1 is preserved. The fixture uses V2 for all subsequent acts; it does not infer V1's general eligibility from the existence of the counteroffer.
3. Both required parties explicitly assent to V2's exact authorized terms. No hidden fee, source-revelation obligation or extra deadline is added through dialogue. An overhearing bystander can acquire only its received fragment and has no assent role.
4. The fixture's accepted terms specify that the valid grant of access activates the Player's grouped payment/disclosure duties. The grantor actually has the required authority. Granting permission remains distinct from opening a door or physically entering.
5. An actual payment effect of 10 coins is credited once to the 30-coin obligation. Twenty coins remain uncredited under this fixture's simple amount rule. The disclosure duty remains separately unresolved.
6. A later qualifying communication delivers exactly the selected report to the guard. That receipt can support its disclosure credit under the agreed criterion; it need not make the report true or the guard believe it. The Player's remaining coin duty is unchanged.
7. If the parties later cancel outstanding scope validly, the original access/payment/disclosure history remains. Money is returned only through a new transfer. The guard cannot be made to forget the report by deleting or cancelling the deal.

The exchange is one dependency group with separate obligation/effect evidence. AND preserves joint terms; it supplies neither simultaneity nor atomic rollback. No ODRL `andSequence`, database transaction or unselected escrow protocol is being used to promise barter safety.

## 8. Adversarial paper cases

These are proposed review exercises, not executed tests or proof of enjoyable bargaining.

| Case | Required distinction |
| --- | --- |
| “Yes” after V1 and V2 | Resolve one eligible visible target or clarify; never silently accept newer or hidden terms |
| Undisclosed fee on V2 | No assent to that party's hidden material term; no fee duty manufactured by private version content |
| Guard dishonest or incapable | Valid self-assent can exist; private intent/perceived ability stays separate from actual grant/performance |
| Fake guard grants access | Actual authority validation creates no permission; communication and actor beliefs may persist |
| Third party says “Ray accepted” | A claim about Ray, not Ray's assent or an agreement shortcut |
| Two parties assent, third required party silent | No full agreement under this proposal's all-required-party rule; witnesses/beneficiaries are not assumed assent |
| Pay 10 twice by replaying one receipt | One effect credited once; genuine second transfer has separate actual evidence |
| Coins paid, information withheld | Partial performance retained; no all-fulfilled label and no automatic coin rollback |
| Quoted/historical acceptance replay | Records quotation/history, no present institutional re-performance |
| Debtor “cancels” creditor's debt | No waiver without actual right-holder authority; false success claim remains distinct |
| One of two beneficiaries waives | Only authorized scope released; other entitlement survives |
| Due condition unknown or not met | No automatic activation/breach; keep unresolved information and temporal basis explicit |
| Performance becomes impossible after formation | Preserve commitment/evidence; decide excuse, release and remedy separately under selected rules |
| Promise to repeat rumor versus prove truth | Different agreed satisfaction criteria; do not upgrade delivery to verification |
| Confidential source in disclosure bargain | Promise terms specify what may be told; raw hidden lineage never joins the payload by default |
| Private refusal reason | Decision can use actor's own private concern; outward refusal/pretext discloses only selected content |
| Stale queued offer | Re-evaluate actual performance/recipient/version at delivery; queue preview grants neither assent nor secret knowledge |

## 9. Open decisions and audit handoff

Before freeze or implementation, choose promise taxonomy, quorum/joint-duty policy, exact scoped-party visibility, standing/representation, version expiry/counteroffer retention, race ordering, relative clock/deadline rules, authority conflicts, partial/substitute performance, effect-credit allocation, fault/excuse/cure standards, remedies and outward failure feedback. [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) retains these choices. No universal psychology, persuasion score, capability prerequisite or hidden diagnostic feedback is adopted.

The sealing audit should challenge exact term visibility, actual versus asserted authority, audience-safe statuses, source secrecy and irreversible disclosures. The combinatorial audit should challenge grouping, actor roles, force/tense/quotation, ambiguous contexts, partial credits, conflicting rights and cycles. Schema prose/JSON syntax can make these questions inspectable; it does not execute effects, settle every rule or demonstrate playability.
