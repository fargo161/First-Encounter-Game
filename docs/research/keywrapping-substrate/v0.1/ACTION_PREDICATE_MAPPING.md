# KeyWrapping Action Dictionary and predicate mining

**Version:** v0.1
**Date:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT
**Role:** Action & Predicate Semantic Miner; original Encounter definitions informed by selected VerbNet evidence.
**Scope:** All 66 starting words; no vocabulary merge, runtime capability, accepted contract, executable schema, or implementation acceptance is asserted.

## Authority, evidence and confidence

The owner-approved design baseline is Complete KeyWrapping Context v0.1, especially §§13–15, 17–20 and 33. The Design Review's action split and near-duplicate questions are recommendations. The Reply to the Second Review refines that recommendation: talk acts need validity conditions, and predicates can represent feelings/needs/beliefs. The reply supersedes the earlier blanket suggestion that hearing a talk verb always makes it effective. These sources are identified and compared in [SOURCE_SNAPSHOT.md](SOURCE_SNAPSHOT.md); C2.1 B0 is a comparison input with no precedence over this pack. The dictionary's definitions, role types, transition rules and validity gates below are **new Encounter proposals**, unless explicitly attributed to the source pack. No wording here changes owner acceptance of C1 or C2.1 B0.

Primary linguistic snapshot: University of Colorado [VerbNet 3.4 at commit ae8e9cfdc2c0d3414b748763612f1a0a34194cc1](https://github.com/cu-clear/verbnet/tree/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4), accessed 2026-10-22. All **329 top-level `.xml` files** in `verbnet3.4/` were parsed, traversing `VNCLASS` and nested `VNSUBCLASS` elements and matching the exact lower-case `MEMBERS/MEMBER/@name` to each starting word. This found **61 words with one or more lemma memberships and five without**: Share, Cancel, Challenge, Apologize and Delegate. No inflection, synonym, substring or class-title match was counted as a lemma hit. Membership is evidence of a lexical entry, not proof that a selected gameplay sense is covered.

For each selected candidate, the donor evidence appendix identifies the XML file, exact membership class, supplying frame class, and **1-based ordinal within that class's own `FRAMES/FRAME` list**. A subclass may inherit a parent's frame; ordinals are not universal VerbNet frame IDs. The appendix transcribes selected frame descriptions, role order and effective thematic-role restrictions. Ancestor roles/frames were followed, with a subclass role declaration taking precedence for that role. Only inspected, relevant frames are selected; the complete lemma-hit inventory records other memberships without adopting them. Raw XML was downloaded to an external temporary research cache; no corpus or donor example sentences are vendored.

**H/M/L confidence** means high/moderate/low confidence in the proposed sense-to-donor fit, never gameplay validity or implementation support. **Gap** means the inspected donor does not supply the required meaning or rule; it does not prove no linguistic resource could supply it. The five no-hit words and mismatched senses remain original, explicit design proposals. Official FrameNet searches did not yield an inspectable release-backed frame for these gaps in this pass; no FrameNet, Framester or Schema.org frame equivalence is asserted. Their availability and rights remain in [SOURCE_LICENSE_LEDGER.md](SOURCE_LICENSE_LEDGER.md).

VerbNet's 3.X terms permit research and derived use with the required notice/disclaimer and attribution; see the [official terms](https://verbs.colorado.edu/~mpalmer/projects/verbnet/downloads.html), the package [retained notice](SOURCE_LICENSE_LEDGER.md#verbnet-attribution-and-retained-notice), and Kipper, Korhonen, Ryant and Palmer, *A Large-scale Classification of English Verbs*, Language Resources and Evaluation 42(1), 21–40 (2008). Selected role/frame metadata are derived evidence; all gameplay examples are newly written. Keep the full retained notice and attribution with this document and any exported mapping when redistributing it.

## Shared type, force and validation rules

These compact defaults are part of **every entry**, supplemented by its exceptions. Slot names are explanatory notation, not frozen JSON field names. `A` = actor; `E` = identified entity; `T` = transferable item/resource with amount/unit when fungible; `L` = place; `P` = proposition/claim content; `X` = grouped action expression; `V` = exact proposal/agreement version; `O` = exact obligation; `Ev` = event/observation/evidence reference; `Act` = bounded activity instance or plan. `?` marks a semantically optional slot. A wrapper fills a slot only through its declared referent kind: an event wrapper is not a key, and a label string is not evidence. References retain producer/artifact/local-kind scope; these symbols do not install a repository-wide ID syntax.

Every clause resolves **who acts, who receives/experiences the act, its sense, temporal stance and target**. The speaker and action actor can differ. Recipient, debtor, authority holder and beneficiary are distinct roles. A contextual omission is permitted only when the actor's accessible conversation context has one eligible referent; ambiguity asks for clarification. A hidden canonical link cannot resolve an actor's ambiguity. Bare past/present/future and explicit self performance must be distinguishable before binding effects.

| Family/code | REQUEST | OFFER | REMARK/report | Can communication itself take effect? |
| --- | --- | --- | --- | --- |
| **W: world act** | Ask the specified actor to attempt/perform X; creates no world result. | Propose the speaker/explicit actor doing X under grouped terms; neither transfer nor commitment automatically occurs. | Assert occurrence, state or intention with actor/time; not proof or replay. | No. Authorized world resolution and evidence are separate. |
| **C: communication act** | Ask an actor to communicate specified content to a recipient. | Propose a future communication; no disclosure yet. | Report a communication, or explicitly perform the speaker's current communicative act. | Only the actually delivered, attributed content creates communication receipts; truth, belief and obedience do not follow. |
| **I: institutional act** | Request an eligible authority/party to perform the act on an exact target. | Propose future performance; preserve any conditions; not immediate exercise. | Report it, or explicitly perform it now as the authorized speaker. | Only with exact target/version, valid authority, eligible lifecycle state, current time, actual delivery and the entry's additional gates. |
| **Q: inquiry/evidence act** | Ask for a bounded investigation, comparison or demonstration. | Propose doing that work and communicating its result. | Assert a result or explicitly present an argument; not automatic canonical proof. | Inquiry utterance can request/present evidence; world inspection and adjudication remain separate. |

**Performative gate common to C/I:** the expression must explicitly mean current self performance, be actually delivered through an eligible channel, identify its target/content and recipients, and satisfy entry-specific standing and lifecycle rules. Quoted, hypothetical, conditional future, past-tense or third-party reported acts never execute as current self acts. `REMARK [Ray accepted V2 yesterday]` creates a claim; `REMARK [I hereby ACCEPT V2]` can be evaluated as acceptance. A request to accept is not acceptance. If the institutional gates fail, record only the attempted/claimed communication, with no purported permission/obligation change. Visible failure details must not disclose inaccessible facts.

**Epistemic boundary common to all:** menu suggestions and semantic filtering use actor-known or actor-perceived capabilities, references and conditions. An unknown locked door, secret ownership, hidden evidence or another actor's inability cannot disappear from a menu in a way that discloses the secret. Distinguish malformed, ambiguous, semantically valid but unsupported, attempted but failed, and actually completed. Discussable actions need no installed executor. A knowingly false claim may still be communicated using acquired references and expressible claim content; the engine must not hand the actor inaccessible true content to make lying possible.

**Execution boundary common to W:** check actual capability, access/reach, resources, target state and any relevant authority when execution is separately authorized. Permission is not physical capability; inability is not automatically illegality; an unauthorized physical act may still happen and have consequences. Never apply generic “owner consent required” as a physical impossibility rule. Numerical thresholds, deterministic effects and available world capabilities remain scenario/prototype decisions. Saying an act happened cannot satisfy its world preconditions.

**Information boundary common to C/Q:** “transfer information” in donor semantics is adapted to **transfer an attributed representation/receipt**, not guaranteed knowledge of truth. The speaker can lie or err; the recipient can misunderstand, disbelieve or hear only part. Disclose only selected content, not every nested wrapper, label, provenance source, secret or belief. Actual delivery creates its own event; a report of past delivery does not deliver the original payload again.

## Complete 66-word dictionary

### Possession and exchange — 8

### 01 Give

**Definition:** Transfer a specified item or resource from a giver to a recipient under an explicit custody or ownership interpretation.

- **Senses/donor:** Tangible/resource transfer, D01; giving access or information is a separate Allow/Tell sense, not a silent coercion. Donor possession does not distinguish title from custody.
- **Slots, gates, effect:** `giver:A, theme:T, recipient:A, transferMode, amount?`; actual control, quantity and transfer capability are checked for execution; apply only the authorized possession/title change. **W** defaults apply; OFFER GIVE is still a proposal.
- **Valid:** OFFER GIVE 20 coins to Ray. **Invalid:** GIVE the Hotel Shootout event as if it were transferable property.
- **Fit:** H for transfer; ownership policy is a gap. Compare Pay (settlement), Lend (temporary custody) and Share (nonexclusive allocation).

### 02 Take

**Definition:** Acquire control or possession of a specified item or resource from a source.

- **Senses/donor:** Acquisition D02; the scan also finds removal and theft senses, but theft is not the default and Steal remains candidate-only. Reject light senses such as “take time.”
- **Slots, gates, effect:** `taker:A, theme:T, source:E/L/A, amount?`; accessible control/reach and availability matter; legality is recorded separately from physical possibility; successful execution changes custody, not automatically ownership. **W**.
- **Valid:** REMARK Ray took the key from the desk yesterday. **Invalid:** TAKE Ray's belief into one's inventory.
- **Fit:** H acquisition; nonconsensual taking and ownership need explicit policies. Compare Borrow (temporary authorized acquisition), Give (giver viewpoint), Find (discovery without custody).

### 03 Keep

**Definition:** Continue holding a specified item or resource for a stated period or until a condition.

- **Senses/donor:** Retained possession D03; “keep someone from acting” is Hinder/Forbid, not this sense.
- **Slots, gates, effect:** `holder:A, theme:T, interval/condition?, location?`; actor must actually hold/control it to execute retention; the outcome preserves custody over an interval and may conflict with a return obligation. **W**; offering to keep does not acquire it.
- **Valid:** REQUEST KEEP the key until the guard returns. **Invalid:** KEEP an event as an exclusive physical possession.
- **Fit:** H retention; time granularity and interference rules open. Compare Stay (actor location), Lend/Borrow (temporary transfer), Hide (concealment).

### 04 Lend

**Definition:** Give another actor temporary use or custody of a specified resource with explicit return terms.

- **Senses/donor:** Transfer D01 supplies possession roles; temporary tenure, ownership retention and return obligation are Encounter additions.
- **Slots, gates, effect:** `lender:A, theme:T, borrower:A, returnTerms:X, due?`; actual control and lend capability; valid agreement and actual handover are separately recorded. **W** handover plus **I** commitment only through the agreement rules; OFFER LEND does neither yet.
- **Valid:** OFFER LEND key to Ray until dawn. **Invalid:** LEND the same indivisible key simultaneously to two distant actors with exclusive custody.
- **Fit:** M because the donor omits repayment semantics. Compare Give and Borrow; loaned money may require equivalence rather than the identical token, an open policy.

### 05 Borrow

**Definition:** Receive another actor's resource temporarily with agreed return or equivalent-repayment terms.

- **Senses/donor:** Obtain-from-source D04; temporary custody and return duty are explicit Encounter additions.
- **Slots, gates, effect:** `borrower:A, theme:T, lender:A, returnTerms:X, due?`; lender consent is constitutive of borrowing, whereas a physical taking without it remains Take; handover still needs actual execution. **W** plus agreement-dependent **I** duty; REQUEST BORROW asks the lender for a loan, with actor roles resolved explicitly.
- **Valid:** REQUEST BORROW Ray's key until dawn. **Invalid:** BORROW a deceased person's inaccessible private memory.
- **Fit:** M; loan currency/equivalence open. Compare Lend: same proposed transfer seen from the receiving role, not two transfers.

### 06 Return

**Definition:** Restore a specified resource to an identified prior holder or agreed destination, or explicitly move an actor back to a prior place.

- **Senses/donor:** Resource movement D05; self return D39 with exact `return` membership in `escape-51.1-1`. Prior entitlement/loan history is not supplied by either donor.
- **Slots, gates, effect:** Resource: `returner:A, theme:T, destination:A/L, priorBasis:Ev/O?`; movement: `mover:A, destination:L`. **W**; correct item/quantity and destination plus execution are needed before satisfying a linked duty.
- **Valid:** REQUEST RETURN key to Ray after use. **Invalid:** RETURN an accusation to inventory without a defined communication sense.
- **Fit:** M; “return” must select transfer or movement; destination cannot be inferred from hidden ownership. Compare Go, Give and Fulfill.

### 07 Share

**Definition:** Allocate joint or partial use of a resource or communicate selected content without treating the whole referent as exclusively transferred.

- **Senses/donor:** **No exact VerbNet lemma hit.** Resource allocation and information-sharing are original proposed senses, with Give/Tell analogies rather than claimed mappings.
- **Slots, gates, effect:** Resource: `sharer:A, participants:A[2+], theme:T, allocation/useScope, interval?`; information: `speaker:A, recipient:A, selectedContent:P/Ev`. **W** resource allocation or **C** actual disclosure; capability, divisibility and access rights are distinct from universal ownership.
- **Valid:** OFFER SHARE half the food with Ray. **Invalid:** SHARE key and silently reveal all associated secret door routes.
- **Fit:** L donor coverage; exact joint-use/exclusive-use semantics need owner choice. Compare Give, Lend and Tell; preserve one word with distinct senses pending paper tests.

### 08 Pay

**Definition:** Transfer money toward an identified debt, charge or agreed consideration.

- **Senses/donor:** Payment D06, with currency restriction; paying attention is excluded. The reply's “giving money that's owed” supports the settlement distinction; prepayment/consideration breadth remains a proposal.
- **Slots, gates, effect:** `payer:A, payee:A, asset:T(currency), amount, settlementTarget:O/V/charge`; available funds, correct currency and payable target; executed transfer may partially discharge that target. **W**; receipt of an offer is not payment.
- **Valid:** OFFER PAY Ray 20 coins toward debt O1. **Invalid:** PAY Ray with the claim that Ray already has coins.
- **Fit:** H payment; conversion, overpayment and allocation priority open. Compare Give: no settlement target is required for a gift.

### Bargaining and commitments — 8

### 09 Accept

**Definition:** Bind the accepting party to the exact eligible proposal version and terms identified by the act.

- **Senses/donor:** D07 supplies acceptance lexical roles; institutional binding, exact-version matching and eligible parties are Encounter additions. Physical receipt belongs to Take/Give, not this selected sense.
- **Slots, gates, effect:** `acceptor:A, target:V, acceptanceScope, authorityBasis?`; pending eligible V, acceptor entitled to bind that party, exact known terms, explicit present self performance and valid channel; append acceptance, create agreement/duties only when all required parties accept. **I**.
- **Valid:** I hereby ACCEPT Warehouse proposal V2. **Invalid:** ACCEPT V1 after only V2 remains eligible, or third-party “Ray accepted” mutating Ray's state.
- **Fit:** M; multi-party partial acceptance policy open. Compare Agree: agreement with a proposition alone binds no bargain.

### 10 Refuse

**Definition:** Decline a specified request or proposal without asserting that its content is false.

- **Senses/donor:** Reject D08; discourse target and lifecycle handling are proposed.
- **Slots, gates, effect:** `refuser:A, target:request/V, scope?`; the addressed party/authorized representative can refuse its participation in a pending target. **I/C**: current refusal records response; it neither deletes history nor prevents later proposals. REQUEST REFUSE asks someone to refuse; OFFER REFUSE proposes a future response and requires a meaningful context.
- **Valid:** I REFUSE V2. **Invalid:** refusing Ray's offer on Ray's behalf without representation authority.
- **Fit:** M; request expiry/reopening policy open. Compare Disagree (stance), Deny (asserted falsity) and Oppose (resistance).

### 11 Promise

**Definition:** Undertake a specified future action or outcome as a commitment attributable to the promising actor.

- **Senses/donor:** Communication D09; `future_having-13.3` is a second lemma hit for promised allocation, not a substitute for commitment validity.
- **Slots, gates, effect:** `promisor:A, beneficiary:A, content:X, condition?, deadline?`; explicit self undertaking, identifiable performance and beneficiary, standing to bind self; **I** can create a promise record, never its fulfillment. Dishonesty or perceived infeasibility need not prevent promising; no power to bind someone else is inferred.
- **Valid:** I PROMISE RETURN key tomorrow. **Invalid:** promising Ray will give his key while silently creating Ray's duty.
- **Fit:** M; beneficiary receipt, revocation and outcome-versus-best-effort policy open. OFFER PROMISE is a proposal to undertake later, not that undertaking.

### 12 Change

**Definition:** Alter a specified property or propose a new version of specified terms while preserving the previous state in history.

- **Senses/donor:** Physical change D10; negotiated-term revision is an Encounter gap. Exchange/clothing senses from the scan are not defaults.
- **Slots, gates, effect:** Physical: `changer:A, target:E, property, intendedValue`; terms: `proposer:A, base:V, changes`. **W** physical execution; **I** authorized issuance of a new proposal version, not unilateral amendment of a binding agreement. OFFER/REQUEST CHANGE can negotiate changes; REMARK reports or performs only valid version issuance.
- **Valid:** OFFER CHANGE V2 price from 20 to 15 coins. **Invalid:** overwriting already spoken V2 or silently changing another party's obligations.
- **Fit:** M physical, L contractual donor fit; amendment consent rules remain explicit/open. Compare Cancel and Withdraw.

### 13 Withdraw

**Definition:** Retract one's eligible pending proposal or exit an activity under its applicable rules.

- **Senses/donor:** Participation withdrawal D11; retracting an exact offer version is a proposed institutional extension, not claimed donor coverage. Physical removal/movement hits are separate senses.
- **Slots, gates, effect:** `withdrawer:A, target:V/Act, authorityBasis?`; proposer or delegated representative, withdrawable lifecycle, current exact target; **I** retracts availability prospectively, preserving prior speech. Accepted duties survive unless a separate termination/waiver rule applies. **W** applies to actual departure.
- **Valid:** I WITHDRAW my still-pending V2. **Invalid:** WITHDRAW someone else's accepted debt to erase it.
- **Fit:** M participation, L offer retraction; race ordering with acceptance open. Compare Cancel (authorized termination), Leave (departure), Refuse (recipient response).

### 14 Cancel

**Definition:** Terminate a specified pending arrangement, activity or obligation through a recognized cancellation right.

- **Senses/donor:** **No exact VerbNet lemma hit**; this lifecycle/authority meaning is an original Encounter proposal.
- **Slots, gates, effect:** `canceller:A, target:V/Act/O, cancellationBasis`; valid cancellable state and authority over that exact scope, plus common **I** gate. A creditor cancelling their receivable may waive it; one debtor cannot cancel another creditor's right. Physical stopping is separately executed **W**.
- **Valid:** Ray, the creditor, CANCELS debt O1 under its waiver rule. **Invalid:** “I cancel your debt” from an unrelated bystander changing the debt.
- **Fit:** L donor, medium design clarity; termination fees, consent and irreversible completed parts open. Compare Withdraw, Stop, Release and Forgive.

### 15 Fulfill

**Definition:** Complete the specified obligation's required performance according to its terms and supporting outcome evidence.

- **Senses/donor:** Act D12 and satisfaction D13; neither donor supplies versioned obligation adjudication.
- **Slots, gates, effect:** `performer:A, target:O/V, performance:Ev[]`; due/active duty and matching action, recipient, amount, conditions/time; **W** linked acts plus separate evaluation mark only proven parts fulfilled. REQUEST/OFFER FULFILL can reference a grouped deal; REMARK FULFILL is a claim, never a shortcut to completion.
- **Valid:** REQUEST FULFILL O1 by returning the identified key. **Invalid:** marking all three deal obligations complete because one payment occurred.
- **Fit:** M; acceptable evidence, late/partial/substitute performance open. Compare Give/Pay/Return (concrete performance) and Confirm (statement about status).

### 16 Break

**Definition:** Damage a physical object or fail a specified obligation in the explicit physical-damage or breach sense.

- **Senses/donor:** Physical break D14; contractual breach has **no selected exact donor frame**. Do not apply a `+solid` patient frame to a promise.
- **Slots, gates, effect:** Physical: `breaker:A, patient:E(breakable), instrument?`; breach: `responsible:A, obligation:O, allegedFailure:Ev/P`. **W** damage requires actual effect; breach is evaluated from duties, time, excuses and evidence. A REMARK about breach creates a claim/dispute, not canonical guilt; requesting/offering breach discusses a prospective act, not instantaneous violation.
- **Valid:** REMARK Ray broke O1 by missing its deadline. **Invalid:** speaking BREAK O1 automatically deleting it.
- **Fit:** H physical, L breach donor; excused impossibility/intent policy open. Compare Destroy (loss of usable existence), Cancel (authorized termination).

### Information and disclosure — 7

### 17 Tell

**Definition:** Communicate specified attributed content to identified recipients.

- **Senses/donor:** Message transfer D15; telling someone to act is a separate directive sense supported by D15b, not execution of the requested act.
- **Slots, gates, effect:** `speaker:A, recipients:A[], payload:P/Ev/selectedView, channel`; source-view access or explicitly expressible fabrication, actual channel delivery, bounded selection. **C**; OFFER TELL does not disclose, current explicit TELL delivers only selected payload, reported past telling does not resend.
- **Valid:** OFFER TELL Ray the claim I heard about the shipment. **Invalid:** TELL event wrapper and copy all canonical linked facts to Ray.
- **Fit:** H transfer shape; truth, interpretation, disclosure scope and source concealment are Encounter rules. Compare Explain (why/how) and Reveal (disclosure changes prior accessibility).

### 18 Show

**Definition:** Present a specified object, representation or demonstration so a recipient may observe its selected outward content.

- **Senses/donor:** Communicative showing D15/D16; bodily display/appearance lemma hits are not universal proof. Physical object presentation has no selected exact donor frame here and needs world observation support in addition to message shape.
- **Slots, gates, effect:** `presenter:A, target:E/Ev/P, observers:A[], medium/channel, selectedAspect`; visible access and actual observation/delivery; **C/W** depending on medium. Showing a key does not give it, and showing evidence does not force belief.
- **Valid:** OFFER SHOW Ray the visible receipt. **Invalid:** SHOW Ray a sealed witness memory without a disclosure path.
- **Fit:** M; channel fidelity/partial visibility open. Compare Tell (asserted description), Prove (argument under criterion), Give (custody transfer).

### 19 Explain

**Definition:** Communicate a stated reason, cause or method for an identified subject or action.

- **Senses/donor:** How/method communication D15c; indicating an explanation D16 is supplementary. Reasons may be false, incomplete or mistaken.
- **Slots, gates, effect:** `explainer:A, recipient:A, topic:E/P/X, explanation:P/X, relation:why/how`; common **C** delivery/access conditions; explanatory content must be present, rather than silently exposing private motives. REQUEST WHY can resolve this sense from unique actor-known context.
- **Valid:** REQUEST EXPLAIN why Ray refused V2. **Invalid:** forcing Ray's private refusal calculation into the reply because explanation was requested.
- **Fit:** H communicative frame, M why/how adequacy; explanation quality is not guaranteed. Compare Tell and Reveal; no binding new terms in unrepresented explanatory dialogue.

### 20 Reveal

**Definition:** Disclose selected content previously concealed or unavailable to the specified recipient.

- **Senses/donor:** Communicative revelation D17/D16; appearance and characterization hits are distinct senses. The recipient-relative novelty/concealment condition is an Encounter proposal, not linguistic certainty.
- **Slots, gates, effect:** `revealer:A, recipient:A, payload:P/Ev/selectedView, concealedBasis?`; **C** current disclosure records the payload received, never every secret of a wrapper. OFFER REVEAL proposes future disclosure. A failed novelty check must not expose what the recipient secretly knew.
- **Valid:** OFFER REVEAL to Ray the route I have withheld. **Invalid:** revealing “the secret” by dereferencing all secrets attached to Ray.
- **Fit:** M; whether novelty is required or merely claimed remains open. Compare Tell; revealing may have consequences but imposes no universal cost.

### 21 Hide

**Definition:** Physically conceal a specified object/entity, optionally relative to a named audience; separately, withhold selected information from an identified audience.

- **Senses/donor:** Concealment D18 supports agent/patient/audience or location; physical concealment and information withholding remain explicit senses.
- **Slots, gates, effect:** Physical sense: `hider:A, target:E, place:L?, from:A[]?`, with target restricted to a physically concealable entity. **W** relocation/occlusion requires actual control and a resolvable physical concealment operation. An audience is optional; its absence neither invents a hidden observer nor proves concealment from every actor. Audience-specific detection/success needs its own stated basis. F1 `hide.object` uses `actor/theme/location` as local aliases for `hider/target/place` and deliberately omits audience. Information-withholding sense: `hider:A, payload:P/selectedView, from:A[]`, with selected actor-accessible content and a nonempty identified audience; this describes withholding future **C** disclosure to those actors. It cannot erase existing receipts/memories, retract already delivered content or prevent independent observation or a different source's disclosure.
- **Valid:** REMARK Ray hid the key in the warehouse, without claiming whom it defeated; OFFER HIDE the key from the guard in the drawer; OFFER withhold this selected account from Ray. **Invalid:** HIDE a communicated claim and delete it from all listeners' histories, or infer an unnamed observer from an audience-free concealment.
- **Fit:** M; concealment detection mechanics open. Compare Keep (custody), Reveal (disclosure), Forbid (authority).

### 22 Confirm

**Definition:** Reaffirm a specified proposition or attest that a specified reported status is supported from the speaker's stated standpoint.

- **Senses/donor:** Indication D16; certification power and exact lifecycle confirmation are not supplied by the donor.
- **Slots, gates, effect:** `confirmer:A, proposition:P, basis:Ev?, authorityBasis?`; **C** current attestation adds a claim/receipt; **I** certification only under an explicit separate authority rule. REQUEST/OFFER CONFIRM asks/proposes attestation, not proof. Confirmation of acceptance never substitutes for the acceptance record.
- **Valid:** REMARK CONFIRM that I received 20 coins. **Invalid:** CONFIRM Ray paid and thereby transfer Ray's funds.
- **Fit:** M; certification scopes open. Compare Agree (stance), Prove (demonstration), Accept (binding target version).

### 23 Deny

**Definition:** Assert that an identified proposition or accusation is false without deciding canonical truth.

- **Senses/donor:** Propositional conjecture D19; denied access is Forbid/Refuse, not this selected sense.
- **Slots, gates, effect:** `denier:A, proposition:P, audience:A[], basis:Ev?`; identifiable claim and delivered current **C** assertion; records denial and stance, with no automatic acquittal or evidence removal. REQUEST DENY asks someone to deny; OFFER DENY proposes future denial, potentially dishonest.
- **Valid:** I DENY the claim that Ray took the key. **Invalid:** DENY accusation and delete the underlying canonical theft.
- **Fit:** M; counterevidence and explicit negation representation open. Compare Refuse, Disagree and Oppose; negating a proposition is not negating receipt of its utterance.

### Inquiry and evidence — 6

### 24 Find

**Definition:** Discover or locate a specified entity, evidence item or fact through a bounded acquisition path.

- **Senses/donor:** Discovery D20 and perceptual encounter D20b; acquisition lemma hits distinguish obtaining. Search/locating procedures are Encounter additions; finding does not imply taking.
- **Slots, gates, effect:** `finder:A, sought:E/P/Ev, searchScope:L/E?, source:Ev?`; **Q/W** bounded search and actual discovery/observation; REMARK finding is a claim until supported. Unknown canonical location cannot be projected as a helpful result without a discovery path.
- **Valid:** REQUEST FIND key in the warehouse. **Invalid:** FIND the murderer and return an inaccessible canonical identity without investigation.
- **Fit:** M; success criterion, search cost and absence evidence open. Compare Check (inspect a known target), Identify (resolve identity), Take (custody).

### 25 Check

**Definition:** Inspect a specified target against a stated question, attribute or criterion.

- **Senses/donor:** Assessment D21; search/visual peer hits may support other explicit inspection senses, not omniscient verification.
- **Slots, gates, effect:** `checker:A, target:E/P/Ev, criterion:P/attribute, method?`; **Q/W** access, instrument/method and bounded observation; outcome can be inconclusive. REQUEST/OFFER CHECK proposes work, REMARK reports it; a check assertion does not validate hidden truth.
- **Valid:** REQUEST CHECK whether the visible seal is broken. **Invalid:** CHECK Ray's private belief by reading a shared wrapper.
- **Fit:** H inspection, M criterion semantics; evidence sufficiency open. Compare Prove (demonstrate under standard), Find (discover), Compare (two or more targets).

### 26 Compare

**Definition:** Examine at least two identified targets along an explicit common dimension or question.

- **Senses/donor:** Reciprocal comparison D22; its selected donor restricts patients to animate or abstract, so physical-object comparison is a declared Encounter extension, not exact donor compliance.
- **Slots, gates, effect:** `comparer:A, targets:E/P/Ev[2+], dimension, result?`; actor-accessible target aspects and commensurate dimension; **Q/W** inspection followed by **C** result as needed. No type/label equality implies identity.
- **Valid:** REQUEST COMPARE these two receipts by date. **Invalid:** COMPARE one key with no second target or comparison criterion recoverable from context.
- **Fit:** M; allowed dimensions/type extensions open. Compare Check and Identify; incompatible units need an explicit conversion rule, never a guessed one.

### 27 Identify

**Definition:** Resolve or assert the identity, class or role of a specified observed referent using stated evidence.

- **Senses/donor:** Characterization-as D23; the empathy hit is rejected. Canonical identity equality and actor knowledge of equality are separate Encounter concepts.
- **Slots, gates, effect:** `identifier:A, observed:E, proposedIdentity:E/type, basis:Ev?`; **Q** evidence assessment or **C** identification claim. An authorized world identity decision is distinct from an actor's tentative identification; merge actor aliases only when that actor has a causal learning basis.
- **Valid:** REMARK IDENTIFY this shopkeeper as Eddie based on his introduction. **Invalid:** identifying one visible alias and exposing all canonically linked secret aliases.
- **Fit:** M; certainty and false-positive handling open. Compare Find, Prove and wrapper reconciliation.

### 28 Prove

**Definition:** Present or derive evidence intended to establish a specified proposition under an explicit standard.

- **Senses/donor:** Deduction D24 and indication D16; no donor establishes game-wide proof or belief authority.
- **Slots, gates, effect:** `prover:A, proposition:P, evidence:Ev[], criterion, audience:A[]`; admissible accessible evidence plus method/criterion; **Q/C** argument delivery, with separate bounded adjudication. REQUEST/OFFER PROVE asks/proposes this task; REMARK PROVE may present evidence, never set proposition true merely by its action word.
- **Valid:** REQUEST PROVE payment O1 using the receipt and matching transfer. **Invalid:** PROVE accusation from its title alone or from circular repetitions of the same claim.
- **Fit:** M; standards, counterevidence and adversarial evidence open. Compare Show, Check and Confirm.

### 29 Challenge

**Definition:** Contest a specified claim, evidence interpretation or arrangement and request reconsideration or support.

- **Senses/donor:** **No exact VerbNet lemma hit.** Contestation is an original proposal; a challenge to a physical contest would be a different explicit sense.
- **Slots, gates, effect:** `challenger:A, target:P/Ev/V/O, grounds:P?, requestedResponse:X?`; identifiable actor-known target and delivered **C/Q** contestation; can create a dispute/reference but does not void a contract or invert truth. OFFER CHALLENGE can promise future advocacy; it is not nonsensical solely because unusual.
- **Valid:** REMARK CHALLENGE the claim that O1 was fulfilled. **Invalid:** CHALLENGE an agreement and automatically release every party.
- **Fit:** L donor; standing requirements and dispute procedure open. Compare Deny (falsity), Disagree (stance), Oppose (resistance).

### Opinion and expression — 8

### 30 Agree

**Definition:** Express concordance with a specified proposition or stated plan without silently accepting a bargain.

- **Senses/donor:** Reciprocal communication D25 with exact `agree` subclass membership; contractual agreement is not its automatic gameplay effect.
- **Slots, gates, effect:** `agreer:A, proposition:P/plan:X, with:A?, audience`; **C** current expressed stance, distinct from private belief and from binding acceptance. REQUEST/OFFER AGREE asks/proposes expressing agreement; these may be strategic or dishonest. Use Accept on V for contractual binding.
- **Valid:** I AGREE that the warehouse is risky. **Invalid:** AGREE about the weather and mark Warehouse Deal V2 accepted.
- **Fit:** H stance shape; how plans are distinguished from binding proposals remains open. Compare Accept and Confirm; concordance is not proof.

### 31 Disagree

**Definition:** Express nonconcordance with a specified proposition, evaluation or plan.

- **Senses/donor:** Reciprocal communication D25, exact `disagree` parent membership; same topic/co-actor structure with opposing stance.
- **Slots, gates, effect:** `disagreer:A, proposition:P/plan:X, with:A?, audience`; **C** current expressed stance; requests/offers discuss that expression. No automatic refusal of a separate deal, canonical falsity or hostile action follows.
- **Valid:** I DISAGREE that the accusation is well supported. **Invalid:** DISAGREE Ray and infer that all Ray's unrelated claims are false.
- **Fit:** H stance shape; degree/partial disagreement open. Compare Deny (specific falsity assertion), Refuse (participation decision), Oppose (active/social resistance).

### 32 Praise

**Definition:** Communicate a positive evaluation of a specified actor, act or quality.

- **Senses/donor:** Judgment D26; characterization hit is supplementary, not a separate need. Donor `+human` Agent is broadened explicitly to Encounter actors capable of expression.
- **Slots, gates, effect:** `praiser:A, target:A/Ev/E, praisedAspect:P?, audience:A[]`; identifiable evaluative target and delivered **C** performance. Records praise; relationship change requires independent recipient evaluation, not a fixed automatic bonus.
- **Valid:** REMARK PRAISE Ray for returning the key. **Invalid:** PRAISE Ray and force every listener to trust him.
- **Fit:** M; credible/ironic evaluation and BASED interpretation open. Compare Thank (gratitude for a benefit), Support (backing a side), Confirm (attestation).

### 33 Criticize

**Definition:** Communicate a negative evaluation of a specified actor, act or quality.

- **Senses/donor:** Judgment D26 with the same explicit actor extension as Praise.
- **Slots, gates, effect:** `critic:A, target:A/Ev/E, criticizedAspect:P?, audience`; current **C** evaluation records criticism without proving fault, imposing a sanction or compelling remorse. REQUEST/OFFER CRITICIZE asks/proposes that communication.
- **Valid:** REMARK CRITICIZE Ray's delay in returning the key. **Invalid:** CRITICIZE the accusation and silently remove its evidence.
- **Fit:** M; sarcasm, audience and consequence policy open. Compare Accuse (attribution of wrongdoing), Deny (falsity) and Oppose (resistance). Criticism can accept the act occurred while disapproving of it.

### 34 Accuse

**Definition:** Attribute specified wrongdoing to an identified actor as a claim addressed to an audience.

- **Senses/donor:** Suspect/accusation D27 supplies subject/theme/attribute roles; the utterance remains an attribution, not authoritative guilt.
- **Slots, gates, effect:** `accuser:A, accused:A, allegedWrong:P/X, incident:E/Ev?, audience`; expressible allegations and actual **C** delivery; evidence optional for making an accusation, required only for any later adjudication standard. The allegation can be false.
- **Valid:** REMARK ACCUSE Ray of taking the key during the hotel incident. **Invalid:** ACCUSE Ray ABOUT Hotel Shootout and infer the unexpressed allegation “Ray fired first.”
- **Fit:** M; supported violation vocabulary remains limited to approved actions/predicates; no silent Attack/Kill addition. Compare Criticize, Deny and Prove.

### 35 Thank

**Definition:** Express gratitude to a specified actor for an identified benefit or perceived benefit.

- **Senses/donor:** Judgment D26 supports expressive evaluation; the gratitude/benefit relation is the explicit Encounter distinction.
- **Slots, gates, effect:** `thanker:A, thanked:A, benefit:Ev/P?, audience`; common **C** gate, a recoverable or explicit beneficiary context; insincere thanks is still expressed thanks, with no forced gratitude or bond. REQUEST THANK asks someone to express it; OFFER THANK can promise future public thanks.
- **Valid:** I THANK Ray for returning the key. **Invalid:** OFFER THANK warehouse with a place filling the thanked-actor slot and no actor referent.
- **Fit:** M; indirect thanks/beneficiary policies open. Compare Praise (positive evaluation without gratitude), Pay (settlement), Forgive (release of grievance).

### 36 Apologize

**Definition:** Express an apology attributable to the speaker for an identified act, harm or perceived offense.

- **Senses/donor:** **No exact VerbNet lemma hit.** Original expressive proposal; no forced FrameNet equivalence asserted.
- **Slots, gates, effect:** `apologizer:A, recipient:A, offense:P/Ev, responsibilityScope`; common **C** gate and clear referent; representation of another actor's apology needs standing, but does not manufacture their remorse. Apology creates communication, not truth of guilt, forgiveness, restitution or a promise unless separate clauses express them.
- **Valid:** I APOLOGIZE to Ray for hiding the key. **Invalid:** APOLOGIZE and automatically fulfill the outstanding return obligation.
- **Fit:** L donor; responsibility admission versus regret-only senses need owner/prototype choice. OFFER APOLOGIZE proposes a future apology; Compare Forgive and Promise.

### 37 Forgive

**Definition:** Express release of one's own grievance against an identified actor for a specified offense.

- **Senses/donor:** Judgment D26; personal grievance release is the selected **C** sense. Waiving a monetary/legal claim is a distinct **I** sense requiring explicit right/scope, not implicit in the donor.
- **Slots, gates, effect:** `forgiver:A, forgiven:A, offense:P/Ev, rightOrGrievanceScope`; authority over one's grievance, or exact waivable right; records expressed forgiveness/authorized waiver without changing canonical wrongdoing, others' grievances or actual private emotion.
- **Valid:** I FORGIVE Ray for the insult. **Invalid:** forgiving Ray and erasing a debt owed to someone else.
- **Fit:** M expressive, L waiver; multi-victim rights open. REQUEST/OFFER FORGIVE discuss future forgiveness. Compare Apologize, Cancel and Release.

### Cooperation and conflict — 8

### 38 Help

**Definition:** Contribute specified effort or resources toward another actor's identified task or goal.

- **Senses/donor:** Assistance D28; it need not endorse the beneficiary's side or values.
- **Slots, gates, effect:** `helper:A, beneficiary:A, task:X/Act, contribution:X/T`; **W** actual contribution with capability/resources and task relevance; **C** advice is a separate communicative contribution with selected content. Success and relationship improvement are not guaranteed. REQUEST/OFFER HELP must identify or contextually resolve the task.
- **Valid:** OFFER HELP Ray carry the crate. **Invalid:** HELP Warehouse Deal and mark all its obligations fulfilled without identifying performance.
- **Fit:** H assistance, M contribution sufficiency; goals may be mistaken or opposed by others. Compare Support (back a side), Protect and Fulfill.

### 39 Hinder

**Definition:** Impede an identified actor's specified activity or goal through an explicit intervention.

- **Senses/donor:** Discouragement/prevention D29; emotional discouragement is a possible distinct mechanism, not an automatic mental-state effect.
- **Slots, gates, effect:** `hinderer:A, affectedActor:A, activity:X/Act, intervention:X`; **W/C** by mechanism, actual opportunity/capability and outcome evidence; no authority is needed merely for physical obstruction to be possible. REQUEST/OFFER HINDER discusses intervention; REMARK reports it.
- **Valid:** OFFER HINDER the guard's pursuit by blocking the passage. **Invalid:** HINDER Ray and set every Ray action impossible indefinitely.
- **Fit:** M; how much delay counts is scenario-specific. Compare Oppose (stance/resistance), Forbid (institutional prohibition), Stop (cessation).

### 40 Support

**Definition:** Back an identified actor's side, claim or plan through a stated endorsement or material contribution.

- **Senses/donor:** Assistance D28 supports material aid; attitude D30 is a state analogy, not performative endorsement; physical support is excluded from this social default.
- **Slots, gates, effect:** `supporter:A, backedActor/side:A/E, position:P/X, means:P/X/T`; **C** public backing or **W** material aid. Mere support is not acceptance of every plan term and never reveals private trust. REQUEST/OFFER SUPPORT asks/proposes backing.
- **Valid:** OFFER SUPPORT Ray's side in the dispute with testimony. **Invalid:** SUPPORT Ray and bind Ray or all supporters to an unstated bargain.
- **Fit:** M; reputational effects/contextual side resolution open. Compare Help: task aid can be neutral, while Support aligns with a side.

### 41 Oppose

**Definition:** Express resistance to or act against a specified actor's position, plan or course of action.

- **Senses/donor:** Reciprocal opposition D31; explicit **C** opposition and **W** resistance are separate realizations.
- **Slots, gates, effect:** `opposer:A, target:A/P/X/Act, grounds/means?`; identifiable target and delivered expression or actual intervention. The action records opposition; it does not negate truth, cancel permission or guarantee obstruction. REQUEST/OFFER OPPOSE can be future advocacy.
- **Valid:** REMARK OPPOSE Ray's plan to close the warehouse. **Invalid:** OPPOSE a fact and make it false.
- **Fit:** M; strength/means open. Compare Disagree (nonconcordance), Deny (falsity assertion), Refuse (declining participation) and Hinder (effective impediment).

### 42 Protect

**Definition:** Reduce an identified beneficiary's exposure to a specified threat through preventive or shielding action.

- **Senses/donor:** Defense D32; donor beneficiary is animate/organization, so protecting a key/place is a proposed capability-specific extension.
- **Slots, gates, effect:** `protector:A, beneficiary:A/E, threat:E/P/X, protectiveAction:X`; **W** capability, access and actual mitigation; **C** warning/disclosure can be a protective means only if explicitly represented. Guarantee of safety is not inherent. OFFER PROTECT is no automatic shield.
- **Valid:** OFFER PROTECT Ray from the approaching guard by sheltering him. **Invalid:** PROTECT Hotel Shootout and erase its historical harm.
- **Fit:** M; prevention criteria/physical-item extension open. Compare Defend (respond to attack/challenge), Warn (communicate risk), Help (task contribution).

### 43 Defend

**Definition:** Resist a specified attack or challenge against an identified actor, object or position.

- **Senses/donor:** Defense D32 for actor beneficiary; defending a claim through argument is a proposed explicit **C/Q** sense, not a physical-patient coercion.
- **Slots, gates, effect:** `defender:A, defended:A/E/P, threat/challenge:E/P/X, response:X/P`; **W** actual resistance or **C/Q** argument; access/capability or expressible support required. Claim defense does not prove the claim, and physical defense does not guarantee success.
- **Valid:** OFFER DEFEND Ray's account using my observation. **Invalid:** DEFEND account and rewrite every witness's memory to agree.
- **Fit:** M; object/claim extensions and reactive-versus-preventive boundary open. Compare Protect, Support and Prove.

### 44 Warn

**Definition:** Communicate an attributed risk or adverse possibility to specified recipients.

- **Senses/donor:** Advice/warning D33; a warning can be mistaken, deceptive or ignored.
- **Slots, gates, effect:** `warner:A, recipients:A[], risk:P/X, evidence:Ev?`; actual **C** delivery and expressible content; belief in the risk is private unless expressed. No requirement that the threat be canonically true for a warning to be uttered. OFFER WARN proposes later warning.
- **Valid:** I WARN Ray that the route may be watched. **Invalid:** WARN Ray and automatically reveal the real hidden watcher.
- **Fit:** H communication shape, M risk policy. Compare Threaten (speaker-attributed adverse intention/control), Tell (content without warning force), Protect (mitigation).

### 45 Threaten

**Definition:** Communicate an attributed adverse intention or conditional adverse consequence intended as pressure on a recipient.

- **Senses/donor:** Exact lemma hit D34 models emotional impact, **not the required threat speech act**; do not infer threat validity or fear from that frame. Communicated coercive intention is an original Encounter proposal.
- **Slots, gates, effect:** `threatener:A, recipient:A, adverseContent:X/P, condition:P/X?`; current **C** delivery records threat, not harm, ability to cause harm or recipient fear. A bluff remains expressible; actual harm requires separate capabilities. OFFER THREATEN proposes a future threat.
- **Valid:** I THREATEN to close access unless Ray returns the key. **Invalid:** THREATEN and force FEARS or execute the adverse act.
- **Fit:** L donor; intimidation/consequence policy open. Compare Warn and Promise; threat content cannot silently add candidate-only action vocabulary.

### Permission and responsibility — 5

### 46 Allow

**Definition:** Grant a specified actor permission for a bounded action, resource or access scope within one's authority.

- **Senses/donor:** Permission/enabling D35; mere physical causation and future allocation hits are not institutional authority rules.
- **Slots, gates, effect:** `grantor:A, grantee:A, permitted:X, resource:E/L?, scope/time, authorityBasis`; valid current **I** gate over the exact scope. Permission record does not open a locked door, move an actor, share hidden information or establish physical ability. REQUEST/OFFER ALLOW asks/proposes a grant.
- **Valid:** The authorized guard ALLOWS Ray records-room entry until dusk. **Invalid:** an unrelated bystander ALLOWS entry and changes the owner's access rule.
- **Fit:** M; permission priority/revocation open. Compare Open (physical state), Assign (responsibility), Give (transfer).

### 47 Forbid

**Definition:** Impose a bounded prohibition on specified conduct within an identified authority scope.

- **Senses/donor:** Prevention/prohibition D36; causal prevention is not automatically a legitimate prohibition. Selected parent frame avoids treating the XML's undeclared `Theme` role in some subclass frames as a validated schema.
- **Slots, gates, effect:** `issuer:A, subject:A, prohibited:X, scope/time, authorityBasis`; current **I** standing and applicable lifecycle; changes normative permission status, not physical possibility or secret knowledge. Conflicting authorities require explicit resolution. REQUEST/OFFER FORBID can ask/propose exercise.
- **Valid:** An authorized keeper FORBIDS removal of the archive key. **Invalid:** FORBID theft and make physical taking impossible by definition.
- **Fit:** M; hierarchy/exceptions open. Compare Hinder (impediment), Stop (actual cessation), Refuse (response).

### 48 Assign

**Definition:** Allocate a specified task, role or resource responsibility to an actor under an applicable assignment rule.

- **Senses/donor:** Future allocation D37; duty creation/acceptance is an explicit institutional extension, not supplied by the transfer frame.
- **Slots, gates, effect:** `assigner:A, assignee:A, taskOrRole:X/E, scope/time, authorityBasis`; **I** only where authority and assignment rules permit; otherwise **C** request/proposal. A proposed assignment does not compel performance or silently imply assignee consent.
- **Valid:** An authorized coordinator ASSIGNS Ray the agreed watch duty O1. **Invalid:** assigning a stranger permanent duties by naming them in an offer.
- **Fit:** M allocation, L duty semantics; acceptance/standing and reassignment policy open. Compare Delegate (limited derived authority), Promise (self undertaking), Give (possession).

### 49 Delegate

**Definition:** Confer a bounded subset of one's delegable authority or task responsibility on an identified actor.

- **Senses/donor:** **No exact VerbNet lemma hit**; original authority proposal, with Assign as analogy only.
- **Slots, gates, effect:** `delegator:A, delegate:A, sourceAuthority:E/O, delegatedScope, expiry/revocation, redelegationRule`; valid current **I** standing, delegability, scope subset and eligible recipient; it creates no wider powers and discloses no source's hidden knowledge. Acceptance requirement remains scenario policy.
- **Valid:** The keeper DELEGATES key-loan approval to Ray for this shift. **Invalid:** delegating powers the speaker lacks, or acquiring every secret of the principal.
- **Fit:** L donor; chains, revocation and responsibility retention open. REQUEST/OFFER DELEGATE proposes exercise; compare Assign and Allow.

### 50 Release

**Definition:** Remove a specified actor or resource from an identified restraint, custody relation or obligation within the relevant scope.

- **Senses/donor:** Freedom-from D38; physical release and institutional discharge are explicit separate **W/I** senses. The donor's Source names the freed actor, not automatically the legal creditor; applying this meaning to a resource/latch is an explicit proposed extension beyond that animate/organization restriction.
- **Slots, gates, effect:** `releaser:A, released:A/E, restraint:E/O, authorityBasis?`; actual ability for physical restraint; right-holder/authorized party for duty waiver. Completed history remains; release from one duty affects no others. REQUEST/OFFER RELEASE proposes the selected sense.
- **Valid:** Creditor RELEASES Ray from O1; jailer physically releases a latch. **Invalid:** releasing one actor and waiving every creditor's claim.
- **Fit:** M freedom, L exact normative rule; partial discharge open. Compare Cancel, Forgive, Open and Give.

### Movement and participation — 8

### 51 Go

**Definition:** Move an identified actor toward or to an identified destination along an optional route.

- **Senses/donor:** Motion D39; the many function/occurrence/speech/light-verb hits are excluded from this default.
- **Slots, gates, effect:** `mover:A, destination:L, origin:L?, route:L[]?, timing`; **W** traversal/reach/capability and separately applicable access; proposal may remain intelligible despite an unknown obstruction. No Room Creator reference supplies permission or executes movement.
- **Valid:** REQUEST GO to the warehouse after dusk. **Invalid:** GO a promise with an obligation in the destination slot.
- **Fit:** H motion; arrival-versus-attempt and route semantics open. Compare Leave (source), Return (prior destination), Follow/Lead (relational motion).

### 52 Stay

**Definition:** Remain at an identified place or in an explicitly selected participation state over a bounded interval.

- **Senses/donor:** Locative persistence D40; participation persistence is a proposed extension. Apparent-state “stay calm” is outside this default.
- **Slots, gates, effect:** `stayer:A, location:L/state:Act, interval/condition`; **W** location or participation maintained through time with actual capability, not instantaneous achievement. REQUEST/OFFER STAY asks/proposes persistence; REMARK is a claim about it.
- **Valid:** OFFER STAY at the hotel until Ray returns. **Invalid:** STAY at two mutually exclusive places over the same interval.
- **Fit:** H locative, M participation; interruption policy open. Compare Wait (defer pending a trigger), Keep (retention of another resource), Leave.

### 53 Leave

**Definition:** Depart from a specified place, group or activity, with the selected sense identifying what is exited.

- **Senses/donor:** Locative departure D41; organization-role departure D41b. Activity/group resignation still requires a separate membership/notice policy, not automatic spatial departure semantics.
- **Slots, gates, effect:** `leaver:A, source:L/Act/group, destination:L?, time`; **W** actual departure or **I** formal resignation if valid under membership rules. Physical absence does not waive obligations. REQUEST/OFFER LEAVE discusses the selected sense.
- **Valid:** REQUEST LEAVE the hotel via the front door. **Invalid:** LEAVE the room and automatically cancel the rent debt.
- **Fit:** H spatial, M participation; formal exit/notice rules open. Compare Go, Withdraw and Stop; “leave a key” is Keep/Give, a different sense.

### 54 Follow

**Definition:** Move in relation to a specified leader or adhere to explicitly identified instructions in a selected motion or compliance sense.

- **Senses/donor:** Pursuit D42; compliance D43. Temporal “follow an event” and mental comprehension are separate scan hits, not default meanings.
- **Slots, gates, effect:** Motion `follower:A, target:A/E, route?, interval`; compliance `actor:A, instructions:X/V`. **W** tracking/actual acts, with perception and capability; saying FOLLOW is no universal obedience command and does not force target disclosure.
- **Valid:** REQUEST FOLLOW Ray to the warehouse. **Invalid:** FOLLOW unseen Ray and reveal Ray's secret destination without observation.
- **Fit:** H motion, M compliance; catch-up/loss-of-contact open. Compare Lead, Go and Fulfill.

### 55 Lead

**Definition:** Guide identified followers toward a specified place or through an explicitly identified activity.

- **Senses/donor:** Accompanied motion D44 and supervision D44b for leading an activity; the latter describes an authority/work relation, not a universal authority grant.
- **Slots, gates, effect:** `leader:A, followers:A[], destination:L/task:Act, method/route?`; **W/C** actual guiding behavior and follower perception/choice; no automatic obedience or teleportation. Request/offer is a proposal to guide, not follower consent.
- **Valid:** OFFER LEAD Ray to the records room. **Invalid:** LEAD Ray and move him despite no consent, observation or separate coercive capability.
- **Fit:** H motion, M activity; guide-versus-command boundary open. Compare Follow, Delegate and Assign.

### 56 Join

**Definition:** Enter a specified shared activity or membership relationship with identified participants under its entry rules.

- **Senses/donor:** Cooperation D45; physical joining in the scan is a separate assembly sense, not group admission.
- **Slots, gates, effect:** `joiner:A, activity:Act/group, coParticipants:A[]?, admissionBasis?`; **W** participation plus **I** admission only if membership rules permit; co-location alone is not membership. REQUEST JOIN can ask for entry; OFFER JOIN proposes one's participation; REMARK reports or performs only valid entry.
- **Valid:** OFFER JOIN Ray in checking the warehouse. **Invalid:** JOIN a secret group and immediately acquire its members' beliefs and identities.
- **Fit:** M cooperation, L admission; invitation/approval rules open. Compare Meet, Help, Stay and Accept.

### 57 Meet

**Definition:** Come into a specified encounter or planned meeting with identified actors.

- **Senses/donor:** Social meeting D46; perceptual/accidental encounter D20b needs no implied arrangement. Meeting requirements is not this sense.
- **Slots, gates, effect:** `participants:A[2+], place:L?, time, arrangement:V?`; **W** actual encounter/presence and eligible channels; scheduling an encounter is a proposal, never its completion. Meeting alone does not disclose proper names, secrets or guaranteed mutual recognition.
- **Valid:** REQUEST MEET Ray at the hotel tomorrow. **Invalid:** MEET Ray and automatically learn Ray's legal name and debts.
- **Fit:** H meeting, M accidental distinction; remote meetings/recognition open. Compare Join, Find and Go.

### 58 Wait

**Definition:** Defer progression or remain available until an explicit time, event or condition.

- **Senses/donor:** Persistence D40; waiting-for-trigger and maximum-duration semantics are proposed additions beyond the generic existence/location frame.
- **Slots, gates, effect:** `waiter:A, until:time/P/Ev, location:L?, timeout?`; **W** elapsed time and availability; a trigger must be observable to the actor or supplied by an authorized clock, not an inaccessible canonical secret. REQUEST/OFFER WAIT proposes delay; REMARK reports it.
- **Valid:** OFFER WAIT until Ray visibly arrives or midnight passes. **Invalid:** WAIT until Ray privately decides something and alert the Player at that hidden moment.
- **Fit:** M; interrupted/indefinite waits open. Compare Stay, Stop and Start; waiting is not retroactive time advancement by utterance alone.

### Objects and activities — 8

### 59 Use

**Definition:** Employ a specified resource or capability for an identified purpose or activity.

- **Senses/donor:** Instrumental use D47; consumption/time-spending hits are separate explicit senses. A generic Use word supplies no arbitrary executor.
- **Slots, gates, effect:** `user:A, resource:E/T, purpose:X/Act, mode, duration?`; **W** resource-specific affordance, access, actual capability and any consequences/consumption; permission distinct from capability. REQUEST/OFFER USE asks/proposes a supported or discussable use.
- **Valid:** REQUEST USE key to open this lock. **Invalid:** USE Hotel Shootout as a physical key because both are keywords.
- **Fit:** H purpose relation, M execution; consumable/shared usage policy open. Compare Give/Lend (custody), Open (specific effect), Make (creation).

### 60 Make

**Definition:** Create an identified product from specified materials or perform an explicitly selected supported construction process.

- **Senses/donor:** Creation D48; causative “make Ray act” is a separate scan hit and must not grant coercion implicitly.
- **Slots, gates, effect:** `maker:A, product:E/type, materials:T[], recipe/process, beneficiary:A?`; **W** capability, resources and actual work produce a new identified result; proposed product is not already extant inventory. REQUEST/OFFER MAKE proposes creation.
- **Valid:** OFFER MAKE a duplicate key from the available blank using a supported process. **Invalid:** MAKE Warehouse Deal and create a binding agreement without communication/acceptance.
- **Fit:** H physical creation; social artifact creation uses its own lifecycle. Recipes, quality and novelty open. Compare Fix and Change.

### 61 Fix

**Definition:** Restore an identified damaged or malfunctioning target toward a specified working condition.

- **Senses/donor:** **No suitable selected repair frame.** Exact lemma hits D49 (food preparation), D50 (attachment) and D49b (valuation) are real but do not establish this repair meaning. Repair is an explicit Encounter gap; attachment can be a separately selected sub-action.
- **Slots, gates, effect:** `repairer:A, target:E(repairable), fault:P/Ev, desiredState, method/resources`; **W** diagnostic access, capability/materials and actual repair outcome; saying FIX does not repair or erase damage history.
- **Valid:** OFFER FIX the damaged latch using replacement parts. **Invalid:** FIX an accusation by silently changing canonical history.
- **Fit:** L donor; repairability/partial restoration open. REQUEST/OFFER discuss work; REMARK asserts result. Compare Make and Change.

### 62 Destroy

**Definition:** Render an identified object unusable or cease its supported physical existence through a destructive act.

- **Senses/donor:** Destruction D51; abstract reputation-destruction is a separate unselected metaphor, not the physical default.
- **Slots, gates, effect:** `destroyer:A, patient:E(destructible), means:E/X?, outcomeCriterion`; **W** access/capability and actual irreversible or defined destruction outcome. Destruction may be unauthorized yet possible; historical event/reference identity remains retained.
- **Valid:** REMARK Ray destroyed the paper receipt by burning it. **Invalid:** DESTROY event wrapper and erase every witness's memory and provenance.
- **Fit:** H physical; material remnants/recovery policy open. REQUEST/OFFER describes a prospective destructive act; compare Break (damage may be repairable), Hide (concealment), Cancel (normative termination).

### 63 Open

**Definition:** Change a specified barrier or container to an open state, or explicitly initiate a specified establishment/activity sense.

- **Senses/donor:** Physical state change D10; opening an establishment D52. Permission/access grants remain Allow, not automatic consequences of the word.
- **Slots, gates, effect:** Physical `opener:A, target:E(openable), instrument:E?`; activity `actor:A, target:Act`. **W** supported state/capability and actual effect; **I** formal opening only with separately defined rules. REQUEST/OFFER OPEN proposes the selected sense; REMARK reports it.
- **Valid:** REQUEST OPEN the warehouse door using this key. **Invalid:** OPEN door and automatically grant legal entry to all actors.
- **Fit:** H physical, M establishment; open-activity versus Start policy open. Compare Allow, Use, Close and Start.

### 64 Close

**Definition:** Change an open barrier or container to a closed state, or explicitly cease an identified operation.

- **Senses/donor:** Physical state change D10; operational cessation D53 with exact `close` membership in `stop-55.4-1`.
- **Slots, gates, effect:** `closer:A, target:E(closable)/Act, means?`; **W** appropriate target state, capability and actual effect. Closing a shop's doors does not cancel debts, revoke all permissions or erase prior attendance; formal closure needs separate **I** authority if applicable.
- **Valid:** REQUEST CLOSE the open records-room door. **Invalid:** CLOSE Warehouse Deal and infer every outstanding obligation fulfilled.
- **Fit:** H physical, M operational; pause-versus-terminal closure open. REQUEST/OFFER proposes, REMARK reports; compare Stop and Cancel.

### 65 Start

**Definition:** Initiate an identified activity or supported process at a specified time or condition.

- **Senses/donor:** Beginning D54; location-origin and emotional-startle hits are not this default.
- **Slots, gates, effect:** `starter:A, activity:Act/X, time/condition?`; **W** executable process, resources and eligible not-yet-running state; any required participant consent/authority is distinct. A current **I** ceremonial start exists only under explicit institutional rules. OFFER START does not begin before conditions are met.
- **Valid:** OFFER START checking the warehouse after Ray arrives. **Invalid:** START an undefined action solely because its label exists.
- **Fit:** H activity onset; restart/idempotence and participant policy open. Compare Open, Make, Stop and Wait.

### 66 Stop

**Definition:** Cease or interrupt a specified ongoing activity or supported process.

- **Senses/donor:** Cessation D53; forbid and stopping-at-location hits are separate senses. Ending action does not necessarily terminate its obligations.
- **Slots, gates, effect:** `stopper:A, activity:Act/X, scope, completionOrPause?`; **W** actual control/intervention and running state; **I** valid termination only under explicit authority rules. REQUEST/OFFER STOP asks/proposes cessation, REMARK reports it, and none automatically reverses completed effects.
- **Valid:** REQUEST STOP copying the records now. **Invalid:** STOP the completed disclosure and make every recipient forget it.
- **Fit:** H cessation; pause/restart/cancellation distinction open. Compare Hinder, Forbid, Close, Cancel and Fulfill.

## Near-duplicate decision comparisons

All distinctions below are recommendations for owner/paper review; no baseline word is merged or removed.

| Words | Proposed visible difference | Required disambiguator |
| --- | --- | --- |
| Accept / Agree | Accept binds an eligible exact proposal version; Agree expresses concordance with a proposition. | Target kind/version and explicit force. Never infer binding from ordinary concordance. |
| Refuse / Disagree / Oppose / Deny | Refuse declines participation; Disagree expresses nonconcordance; Oppose resists a course; Deny asserts a claim false. | Request/proposal versus proposition/plan, plus stance versus intervention. |
| Tell / Explain / Reveal | Tell communicates selected content; Explain supplies why/how; Reveal discloses content previously concealed/unavailable relative to a recipient. | Payload, explanation relation and recipient-relative disclosure sense; no automatic revelation cost. |
| Help / Support | Help contributes to a task; Support backs a side or position, optionally through material help. | Task/goal versus position/side and explicit means. |
| Give / Pay | Give transfers; Pay transfers currency toward a debt/charge/consideration. | Exact settlement target and amount; a gift has no implied debt. |
| Lend / Borrow | Same temporary transfer from opposite actor roles. | One linked transfer/loan, not duplicate transactions. |
| Withdraw / Cancel / Release / Forgive | Withdraw retracts eligible participation/proposal; Cancel terminates under a cancellation right; Release removes a specific restraint/duty; Forgive expresses release of one's grievance. | Exact target, lifecycle and authority/right scope; no universal erasure. |
| Fulfill / Confirm / Prove | Fulfill performs and satisfies terms; Confirm attests a status; Prove supplies evidence under a criterion. | Performance evidence versus attestation versus adjudication. |
| Protect / Defend | Protect emphasizes prevention/shielding; Defend responds to attack/challenge and can defend a claim by argument. | Threat/challenge, beneficiary/claim kind and chosen means. |
| Find / Identify / Check / Compare | Find discovers/locates; Identify resolves identity/class; Check inspects a criterion; Compare relates multiple targets on a dimension. | Target count, question, identity hypothesis and evidence. |
| Break / Destroy / Cancel | Break damages or breaches; Destroy removes physical usability/existence; Cancel exercises a lifecycle right. | Physical versus obligation sense and actual authority/effect. |
| Stay / Wait / Keep | Stay concerns actor location/participation; Wait concerns a time/trigger; Keep concerns held resource. | Actor versus resource, interval and observable condition. |
| Open / Start; Close / Stop | Open/Close can change barriers; Start/Stop refer to process onset/cessation. Establishment-operation senses overlap and need explicit selection. | Target kind and selected sense; no hidden permission conversion. |

## Predicate recommendations and candidate-only additions

The reply recommends **TRUSTS, FEARS, NEEDS, BELIEVES** as state-shaped predicates rather than adding four feeling/action verbs. They are **proposed, outside the 66 action-word count**, and must not become global public facts by default. The predicate vocabulary is not ratified by approving this research. No additional VerbNet mappings for these predicate forms are claimed.

| Candidate predicate | Proposed signature and meaning | Appropriate expression / invalid inference |
| --- | --- | --- |
| TRUSTS | `holder:A, trusted:A, domain:X/P?, time`; holder's current actor-local confidence/reliance stance. | REMARK “Ray TRUSTS Marcus” is an attributed claim; it neither reads Ray's private state nor orders trust into existence. |
| FEARS | `holder:A, feared:A/E/P/X, time`; an actor-local fear stance toward a perceived threat. | A received threat can be evidence of exposure, never sufficient proof of FEARS. REQUEST FEARS as a direct world action is malformed; request reassurance or a changed circumstance instead. |
| NEEDS | `holder:A, resource/state:T/P/X, scope/time`; an actor-local need or authored constraint with source and uncertainty. | “Ray NEEDS money” can be claimed; requesting Ray to NEED money does not create a need. Distinguish objective survival constraint from perceived desire. |
| BELIEVES | `holder:A, proposition:P, stance/time, basis:Ev?`; actor-local acceptance/uncertainty of a proposition. | A report “Ray BELIEVES P” remains a claim about Ray; receiving P does not automatically create belief in P. No recursively unbounded mind-reading. |

Negation and uncertainty must remain scoped: `NOT [Ray BELIEVES P]` differs from `Ray BELIEVES [NOT P]`; neither establishes the truth of P. Actor-local records can be canonical records **of that actor's state** while the proposition they concern is false. Their exported visibility remains restricted. Want is discussed in the first review but not silently registered as a fifth predicate.

**Attack, Hurt, Kill and Steal remain candidate-only words**, with the review's proposed distinctions: attempted harm, caused harm, caused death, and taking without owner consent. They are not rows 67–70, installed actions, or authorized execution. Their definitions require further decisions: nonphysical harm, accidental death, ownership versus custody, consent scope, and local law. Until explicitly approved, an allegation can use approved actions and supported event/claim content; it cannot introduce an unregistered verb by free-text dialogue. If an example requires “fired first,” record that as a vocabulary/capability gap rather than pretending Threaten or Accuse expresses it.

## Proposed combinatorial guardrails and open decisions

1. **Sense before execution.** Select the explicit sense and typed roles. Physical Break/contractual Break, motion Return/resource Return, physical Open/permission Allow, and personal Forgive/right waiver must not share untyped effects.
2. **Role defaults follow the Function and clause.** A request usually asks its addressee to act, but REQUEST BORROW can mean speaker borrows from addressee. Resolve the borrower/lender roles visibly; do not apply a universal “subject = addressee” rewrite.
3. **Pending speech has no effects.** Previewed/queued OFFER TELL is not disclosure. Listener presence, channel access, selected payload and exact target versions are re-evaluated at actual delivery without distributing hidden failure details.
4. **Conditions preserve grouping.** `(OFFER GIVE coins AND OFFER TELL selected claim) IN EXCHANGE FOR REQUEST ALLOW access` is one grouped bargain. It does not disclose the claim at offer time. IF on future promises and immediate institutional acts must remain explicit.
5. **History versus current force.** A valid past report about an institutional action is still a report. A replay, quote, denial or nested hypothetical must not exercise that action again. Repeated delivery never duplicates an accepted effect by semantic coincidence.
6. **Normative versus physical.** Allow/Forbid/Assign/Delegate/Release require scoped authority for institutional effects; no such word supplies physical execution. Physical actions can violate duties and permissions without becoming logically impossible.
7. **Known versus true.** Preserve plausible failed requests and bluffing; actor-known filtering cannot be an oracle for actual funds, secret ownership, covert restrictions or private beliefs. The owner must choose how inaccessible execution failures are communicated.
8. **Evidence never autoconverts.** Tell/Show/Reveal/Confirm/Prove/Identify/Accuse produce distinct content/evidence/claim events. None alone copies canonical truth or another actor's beliefs into a recipient view.
9. **No silent vocabulary reduction/addition.** Preserve all 66 selectable semantic candidates. Distinctions and capability gaps are owner/paper-test inputs. Unsupported execution remains distinguishable from malformed communication.

Open owner/prototype questions include exact sense inventory; whether Reveal requires actual novelty or only presented disclosure; when assignment/delegation requires acceptance; personal forgiveness versus right waiver; restitution/equivalent repayment; multi-party/partial acceptance; proof/admissibility criteria; duty discharge versus excuse; operational Open/Start and Close/Stop overlap; maximum activity/wait scope; and how truth-preserving diagnostic results are projected without leaking secrets. The missing embedded NPC four-check diagram is not evidence for any of these decisions. Linguistic coverage and well-typed records do not establish that composing the language is enjoyable; the paper/prototype test remains separate.

## Reproducing the lexical coverage check

Obtain the pinned public source outside the repository, retain its terms, and inspect only `verbnet3.4/*.xml`. This read-only research sketch does not create a runtime module or schema:

```python
from pathlib import Path
import xml.etree.ElementTree as ET

root = Path("<external-cache>/verbnet-<pinned-commit>/verbnet3.4")
words = """Give Take Keep Lend Borrow Return Share Pay Accept Refuse Promise Change
Withdraw Cancel Fulfill Break Tell Show Explain Reveal Hide Confirm Deny Find Check
Compare Identify Prove Challenge Agree Disagree Praise Criticize Accuse Thank
Apologize Forgive Help Hinder Support Oppose Protect Defend Warn Threaten Allow
Forbid Assign Delegate Release Go Stay Leave Follow Lead Join Meet Wait Use Make
Fix Destroy Open Close Start Stop""".lower().split()
hits = {word: [] for word in words}
files = sorted(root.glob("*.xml"))
for file in files:
    for cls in ET.parse(file).getroot().iter():
        if cls.tag not in {"VNCLASS", "VNSUBCLASS"}:
            continue
        for member in cls.findall("./MEMBERS/MEMBER"):
            if member.get("name") in hits:
                hits[member.get("name")].append((file.name, cls.get("ID")))
print(len(files), len(words), sum(bool(rows) for rows in hits.values()))
print([word for word, rows in hits.items() if not rows])
```

Observed result: `329 66 61`; missing `share, cancel, challenge, apologize, delegate`. The following appendices preserve the selected donor details and full membership results so a later reviewer can distinguish an exhaustive lemma scan from semantic adjudication.

## Appendix A — selected exact VerbNet evidence

D-keys are local **research citation keys**, not adopted action/sense IDs. The word entries decide suitability; this table records lexical/frame facts, including deliberately rejected near-sense evidence D34 and D49/D50. `*` means no thematic selection restriction declared, **not** an Encounter permission to accept every keyword. `+`/`-`, AND/OR preserve donor restrictions; they are not the proposed gameplay type system. `F1` means first own frame of the stated supplying class, not an official global frame identifier. All rows use the pinned commit above.

| Key / checked lemmas | Exact membership → supplying frame | Exact primary description; thematic role order | Effective declared donor roles/restrictions | Primary XML |
| --- | --- | --- | --- | --- |
| D01: give | `give-13.1-1` → `give-13.1/F1` | `NP V NP PP.recipient`; `Agent / Theme / Recipient` | `Agent=(+animate OR +organization); Theme=*; Recipient=(+animate OR +organization); Asset=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/give-13.1.xml) |
| D01: lend | `give-13.1` → `give-13.1/F1` | `NP V NP PP.recipient`; `Agent / Theme / Recipient` | `Agent=(+animate OR +organization); Theme=*; Recipient=(+animate OR +organization)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/give-13.1.xml) |
| D02: take | `get-13.5.1` → `get-13.5.1/F2` | `NP V NP PP.source`; `Agent / Theme / Source` | `Agent=(+animate OR +organization); Theme=*; Source=(+concrete); Beneficiary=(+animate OR +organization); Asset=(-location AND -region)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/get-13.5.1.xml) |
| D03: keep | `keep-15.2` → `keep-15.2/F2` | `NP V NP`; `Agent / Theme` | `Agent=(+animate OR +organization); Theme=*; Location=(+location AND -region)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/keep-15.2.xml) |
| D04: borrow | `obtain-13.5.2` → `obtain-13.5.2/F2` | `NP V NP PP.source`; `Agent / Theme / Source` | `Agent=(+animate OR +organization); Theme=*; Source=(+concrete)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/obtain-13.5.2.xml) |
| D05: return | `send-11.1` → `send-11.1/F3` | `NP V NP PP.destination`; `Agent / Theme / Destination` | `Agent=(+animate OR +organization); Theme=(+concrete); Initial_Location=(+location); Destination=(+animate OR +location OR -region)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/send-11.1.xml) |
| D06: pay | `pay-68-1` → `pay-68-1/F2` | `NP V NP NP`; `Agent / Recipient / Asset` | `Agent=(+animate OR +organization); Asset=(+currency); Theme=*; Recipient=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/pay-68.xml) |
| D07: accept | `accept-77.1` → `accept-77.1/F2` | `NP V NP`; `Agent / Theme` | `Agent=(+animate OR +organization); Theme=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/accept-77.1.xml) |
| D08: refuse | `reject-77.2` → `reject-77.2/F1` | `NP V NP`; `Agent / Theme` | `Agent=(+animate OR +organization); Theme=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/reject-77.2.xml) |
| D09: promise | `promise-37.13` → `promise-37.13/F1` | `NP V NP that S`; `Agent / Recipient / Topic` | `Agent=(+animate OR +organization); Recipient=(+animate OR +organization); Topic=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/promise-37.13.xml) |
| D10: change open close | `other_cos-45.4` → `other_cos-45.4/F1` | `NP V NP.patient`; `Agent / Patient` | `Agent=(+int_control); Patient=*; Instrument=*; Result=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/other_cos-45.4.xml) |
| D11: withdraw | `withdraw-82-2` → `withdraw-82-2/F1` | `NP V PP.source`; `Agent / Source` | `Agent=(+animate OR +organization); Source=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/withdraw-82.xml) |
| D12: fulfill | `act-114` → `act-114/F1` | `NP V NP`; `Agent / Eventuality` | `Agent=*; Eventuality=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/act-114.xml) |
| D13: fulfill | `satisfy-55.7` → `satisfy-55.7/F2` | `NP V NP PP`; `Agent / Theme / Instrument` | `Agent=(+animate OR +organization); Theme=*; Instrument=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/satisfy-55.7.xml) |
| D14: break | `break-45.1` → `break-45.1/F1` | `NP V NP`; `Agent / Patient` | `Agent=(+int_control); Patient=(+solid); Instrument=(+solid); Result=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/break-45.1.xml) |
| D15: tell show | `transfer_mesg-37.1.1-1-1` → `transfer_mesg-37.1.1/F8` | `NP V NP PP.recipient`; `Agent / Topic / Recipient` | `Agent=(+animate OR +organization); Topic=*; Recipient=(+animate OR +organization)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/transfer_mesg-37.1.1.xml) |
| D15b: tell | `transfer_mesg-37.1.1-1-1` → `transfer_mesg-37.1.1-1-1/F2` | `NP V NP S_INF`; `Agent / Recipient / Topic` | `Agent=(+animate OR +organization); Topic=*; Recipient=(+animate OR +organization)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/transfer_mesg-37.1.1.xml) |
| D15c: explain | `transfer_mesg-37.1.1` → `transfer_mesg-37.1.1/F4` | `NP V PP.recipient how S_INF`; `Agent / Recipient / Topic` | `Agent=(+animate OR +organization); Topic=*; Recipient=(+animate OR +organization)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/transfer_mesg-37.1.1.xml) |
| D16: show reveal confirm prove | `indicate-78-1-1` → `indicate-78/F3` | `NP V NP`; `Pivot / Topic` | `Pivot=*; Topic=*; Experiencer=(+animate OR +organization)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/indicate-78.xml) |
| D16: explain | `indicate-78-1` → `indicate-78/F3` | `NP V NP`; `Pivot / Topic` | `Pivot=*; Topic=*; Experiencer=(+animate OR +organization)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/indicate-78.xml) |
| D17: reveal | `say-37.7-1-1` → `say-37.7-1-1/F1` | `NP V that S`; `Agent / Topic` | `Agent=(+animate OR +organization); Topic=(+communication); Recipient=(+animate OR +organization)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/say-37.7.xml) |
| D18: hide | `concealment-16-1` → `concealment-16/F1` | `NP V NP PP.beneficiary`; `Agent / Patient / Beneficiary` | `Agent=(+animate); Beneficiary=(+animate); Patient=*; Location=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/concealment-16.xml) |
| D19: deny | `conjecture-29.5` → `conjecture-29.5/F2` | `NP V that S`; `Agent / Theme` | `Agent=(+animate OR +organization); Theme=*; Eventuality=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/conjecture-29.5.xml) |
| D20: find | `discover-84` → `discover-84/F3` | `NP V NP`; `Agent / Topic` | `Agent=(+animate OR +organization); Topic=*; Source=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/discover-84.xml) |
| D21: check | `assessment-34.1` → `assessment-34.1/F2` | `NP V NP PP.attribute`; `Agent / Theme / Attribute` | `Agent=(+animate); Theme=*; Attribute=*; Value=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/assessment-34.1.xml) |
| D22: compare | `amalgamate-22.2-2` → `amalgamate-22.2-2/F1` | `NP V NP PP.co-patient`; `Agent / Patient / Co-Patient` | `Agent=(+concrete); Patient=(+animate OR +abstract); Co-Patient=(+animate OR +abstract)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/amalgamate-22.2.xml) |
| D23: identify | `characterize-29.2-1-1` → `characterize-29.2/F3` | `NP V NP PP.attribute`; `Agent / Theme / Attribute` | `Agent=(+animate OR +organization); Theme=(+concrete OR +organization); Attribute=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/characterize-29.2.xml) |
| D24: prove | `deduce-97.2` → `deduce-97.2/F2` | `NP V NP PP.source`; `Agent / Theme / Source` | `Agent=(+animate OR +organization); Theme=*; Source=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/deduce-97.2.xml) |
| D25: agree | `correspond-36.1-1` → `correspond-36.1/F12` | `NP V PP.co-agent PP.theme`; `Agent / Co-Agent / Topic` | `Agent=(+animate OR +organization); Co-Agent=(+animate OR +organization); Topic=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/correspond-36.1.xml) |
| D25: disagree | `correspond-36.1` → `correspond-36.1/F12` | `NP V PP.co-agent PP.theme`; `Agent / Co-Agent / Topic` | `Agent=(+animate OR +organization); Co-Agent=(+animate OR +organization); Topic=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/correspond-36.1.xml) |
| D26: praise criticize thank forgive | `judgment-33.1-1` → `judgment-33.1/F2` | `NP V NP PP.attribute`; `Agent / Theme / Attribute` | `Agent=(+human); Theme=*; Attribute=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/judgment-33.1.xml) |
| D27: accuse | `suspect-81` → `suspect-81/F1` | `NP V NP PP.attribute`; `Agent / Theme / Attribute` | `Agent=(+animate OR +organization); Theme=*; Attribute=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/suspect-81.xml) |
| D28: help | `help-72.1-1-1` → `help-72.1-1/F2` | `NP V NP PP.theme`; `Agent / Beneficiary / Theme` | `Agent=(+animate OR +organization); Beneficiary=(+animate OR +organization); Theme=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/help-72.1.xml) |
| D28: support | `help-72.1-1` → `help-72.1-1/F2` | `NP V NP PP.theme`; `Agent / Beneficiary / Theme` | `Agent=(+animate OR +organization); Beneficiary=(+animate OR +organization); Theme=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/help-72.1.xml) |
| D29: hinder | `discourage-64.5-1` → `discourage-64.5/F1` | `NP V NP PP.eventuality`; `Causer / Beneficiary / Eventuality` | `Causer=*; Eventuality=*; Beneficiary=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/discourage-64.5.xml) |
| D30: support | `admire-31.2` → `admire-31.2/F1` | `NP V NP`; `Experiencer / Stimulus` | `Stimulus=*; Experiencer=(+animate); Attribute=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/admire-31.2.xml) |
| D31: oppose | `amalgamate-22.2-3` → `amalgamate-22.2-3/F1` | `NP V NP`; `Agent / Patient` | `Agent=(+animate OR +machine); Patient=*; Co-Patient=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/amalgamate-22.2.xml) |
| D32: protect defend | `defend-72.3` → `defend-72.3/F2` | `NP V NP PP.theme`; `Agent / Beneficiary / Theme` | `Agent=(+animate OR +organization); Beneficiary=(+animate OR +organization); Theme=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/defend-72.3.xml) |
| D33: warn | `advise-37.9-1` → `advise-37.9/F3` | `NP V NP.recipient that S`; `Agent / Recipient / Topic` | `Agent=(+animate OR +organization); Topic=(+communication); Recipient=(+animate OR +organization)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/advise-37.9.xml) |
| D34: threaten | `amuse-31.1` → `amuse-31.1/F1` | `NP V NP`; `Stimulus / Experiencer` | `Experiencer=(+animate); Stimulus=*; Result=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/amuse-31.1.xml) |
| D35: allow | `allow-64.1-1` → `allow-64.1-1/F1` | `NP V NP S`; `Causer / Beneficiary / Eventuality` | `Causer=*; Beneficiary=*; Eventuality=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/allow-64.1.xml) |
| D36: forbid | `forbid-64.4-1` → `forbid-64.4/F1` | `NP V NP PP.theme`; `Causer / Beneficiary / Eventuality` | `Causer=*; Eventuality=*; Beneficiary=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/forbid-64.4.xml) |
| D37: assign | `future_having-13.3` → `future_having-13.3/F1` | `NP V NP PP.goal`; `Agent / Theme / Goal` | `Agent=*; Theme=*; Goal=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/future_having-13.3.xml) |
| D38: release | `free-10.6.3-1` → `free-10.6.3/F1` | `NP V NP PP.theme`; `Causer / Source / Theme` | `Causer=*; Source=(+animate OR +organization); Theme=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/free-10.6.3.xml) |
| D39: go return | `escape-51.1-1` → `escape-51.1/F1` | `NP V PP.destination`; `Theme / Destination` | `Theme=(+concrete); Initial_Location=(+concrete); Destination=(+concrete); Trajectory=(+concrete)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/escape-51.1.xml) |
| D40: stay wait | `exist-47.1` → `exist-47.1/F2` | `NP V PP.location`; `Theme / Location` | `Theme=*; Location=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/exist-47.1.xml) |
| D41: leave | `leave-51.2-1` → `leave-51.2/F2` | `NP V NP.initial_location PP.destination`; `Theme / Source / Destination` | `Theme=(+animate); Source=(+location OR +animate); Goal=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/leave-51.2.xml) |
| D42: follow | `chase-51.6` → `chase-51.6/F1` | `NP V NP`; `Agent / Theme` | `Agent=(+animate); Theme=(+concrete); Trajectory=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/chase-51.6.xml) |
| D43: follow | `abide_by-93.2` → `abide_by-93.2/F1` | `NP V NP`; `Agent / Theme` | `Agent=(+animate OR +organization); Theme=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/abide_by-93.2.xml) |
| D44: lead | `accompany-51.7` → `accompany-51.7/F2` | `NP V NP PP.destination`; `Agent / Theme / Destination` | `Agent=(+animate); Theme=(+animate); Destination=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/accompany-51.7.xml) |
| D45: join | `cooperate-73.1-1` → `cooperate-73.1-1/F2` | `NP V PP.co-agent PP.theme`; `Agent / Co-Agent / Theme` | `Agent=(+animate OR +organization); Co-Agent=(+animate OR +organization); Theme=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/cooperate-73.1.xml) |
| D46: meet | `meet-36.3-1` → `meet-36.3-1/F3` | `NP V NP`; `Agent / Co-Agent` | `Agent=(+animate); Co-Agent=(+animate)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/meet-36.3.xml) |
| D47: use | `use-105.1` → `use-105.1/F3` | `NP V NP PP.predicate`; `Agent / Theme / Eventuality` | `Agent=(+animate OR +organization); Theme=*; Eventuality=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/use-105.1.xml) |
| D48: make | `build-26.1-1` → `build-26.1/F2` | `NP V NP.product PP.material`; `Agent / Product / Material` | `Agent=(+animate OR +machine); Material=(+concrete); Product=*; Beneficiary=(+animate OR +organization); Asset=(+currency)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/build-26.1.xml) |
| D49: fix | `preparing-26.3-1` → `preparing-26.3-1/F1` | `NP V NP`; `Agent / Product` | `Agent=(+animate OR +machine); Beneficiary=(+animate); Product=(+concrete); Material=(+concrete)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/preparing-26.3.xml) |
| D50: fix | `shake-22.3-2` → `shake-22.3-2/F1` | `NP V NP PP`; `Agent / Patient / Co-Patient` | `Agent=(+animate OR +machine); Patient=(+concrete); Co-Patient=(+concrete)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/shake-22.3.xml) |
| D51: destroy | `destroy-44` → `destroy-44/F1` | `NP V NP`; `Agent / Patient` | `Agent=(+int_control); Patient=(+concrete); Instrument=(+concrete)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/destroy-44.xml) |
| D52: open | `establish-55.5-1` → `establish-55.5/F1` | `NP V NP`; `Agent / Patient` | `Agent=(+animate OR +organization); Patient=*; Instrument=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/establish-55.5.xml) |
| D53: close | `stop-55.4-1` → `stop-55.4/F1` | `NP V NP.eventuality`; `Affector / Eventuality` | `Affector=(+animate OR +organization); Eventuality=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/stop-55.4.xml) |
| D53: stop | `stop-55.4-1-1` → `stop-55.4/F1` | `NP V NP.eventuality`; `Affector / Eventuality` | `Affector=(+animate OR +organization); Eventuality=*; Subeventuality=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/stop-55.4.xml) |
| D54: start | `begin-55.1-1-1` → `begin-55.1-1-1/F2` | `NP V NP`; `Agent / Eventuality` | `Agent=(+animate OR +organization); Eventuality=*; Subeventuality=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/begin-55.1.xml) |

| D20b: find meet | `encounter-30.5` → `encounter-30.5/F1` | `NP V NP`; `Experiencer / Stimulus` | `Experiencer=(+animate); Stimulus=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/encounter-30.5.xml) |
| D41b: leave | `resign-10.11-2` → `resign-10.11-2/F1` | `NP V NP`; `Agent / Source` | `Agent=(+animate OR +organization); Source=*` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/resign-10.11.xml) |
| D44b: lead | `supervision-95.2.2-1` → `supervision-95.2.2/F1` | `NP V NP.theme`; `Agent / Theme` | `Agent=(+animate OR +organization); Theme=(+animate OR +organization)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/supervision-95.2.2.xml) |
| D49b: fix | `price-54.4` → `price-54.4/F2` | `NP V NP PP.value`; `Agent / Theme / Value` | `Agent=(+animate); Theme=(+concrete); Value=(+currency)` | [XML](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/price-54.4.xml) |

The selected physical/communicative frames do not supply loan return duties, acceptance authority, proposal versioning, consent, ownership law, proof standards, actor-scoped secrecy or game execution. These remain explicitly proposed Encounter rules. D34 records an emotional-state effect shape rather than the speech-act meaning of Threaten; D49 records preparation and D50 attachment rather than general repair. In D36 some other subclass frames use a Theme not declared in their role list; that source irregularity is preserved as evidence of why linguistic XML is not an executable game schema.

## Appendix B — exhaustive exact lemma memberships

Every hit below was considered as a lexical candidate; the selected frame evidence above records the sense analysis actually retained. A hit absent from the selected evidence/word sense is **unadopted**, not an approved extra sense. In particular light verbs, metaphors, physical appearance, emotional effects, value setting and causative control do not become default gameplay effects. Five no-hit rows are retained.

| # | Starting word | Exact MEMBER membership classes, grouped by source XML |
| --- | --- | --- |
| 01 | Give | [break_down-45.8](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/break_down-45.8.xml); [conduct-111.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/conduct-111.1.xml); [give-13.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/give-13.1.xml); [substance_emission-43.4](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/substance_emission-43.4.xml) |
| 02 | Take | [absorb-39.8](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/absorb-39.8.xml); [adopt-93.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/adopt-93.1.xml); [bring-11.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/bring-11.3.xml); [characterize-29.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/characterize-29.2.xml); [convert-26.6.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/convert-26.6.2.xml); [cost-54.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/cost-54.2.xml); [devour-39.4](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/devour-39.4.xml); [fit-54.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/fit-54.3.xml); [get-13.5.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/get-13.5.1.xml); [remove-10.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/remove-10.1.xml); [render-29.90](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/render-29.90.xml); [require-103](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/require-103.xml); [scribble-25.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/scribble-25.2.xml); [steal-10.5](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/steal-10.5.xml); [vehicle_path-51.4.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/vehicle_path-51.4.3.xml) |
| 03 | Keep | [forbid-64.4](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/forbid-64.4.xml); [keep-15.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/keep-15.2.xml); [seem-109](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/seem-109.xml); [sustain-55.6-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/sustain-55.6.xml) |
| 04 | Lend | [give-13.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/give-13.1.xml) |
| 05 | Borrow | [obtain-13.5.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/obtain-13.5.2.xml) |
| 06 | Return | [convert-26.6.2, convert-26.6.2-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/convert-26.6.2.xml); [engender-27.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/engender-27.1.xml); [escape-51.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/escape-51.1.xml); [reciprocate-112](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/reciprocate-112.xml); [send-11.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/send-11.1.xml) |
| 07 | Share | **NO EXACT LEMMA HIT** |
| 08 | Pay | [pay-68-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/pay-68.xml) |
| 09 | Accept | [accept-77.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/accept-77.1.xml); [characterize-29.2-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/characterize-29.2.xml); [obtain-13.5.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/obtain-13.5.2.xml) |
| 10 | Refuse | [reject-77.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/reject-77.2.xml) |
| 11 | Promise | [future_having-13.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/future_having-13.3.xml); [promise-37.13](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/promise-37.13.xml) |
| 12 | Change | [dress-41.1.1-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/dress-41.1.1.xml); [exchange-13.6.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/exchange-13.6.1.xml); [other_cos-45.4](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/other_cos-45.4.xml); [turn-26.6.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/turn-26.6.1.xml) |
| 13 | Withdraw | [escape-51.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/escape-51.1.xml); [remove-10.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/remove-10.1.xml); [resign-10.11-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/resign-10.11.xml); [withdraw-82-2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/withdraw-82.xml) |
| 14 | Cancel | **NO EXACT LEMMA HIT** |
| 15 | Fulfill | [act-114](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/act-114.xml); [satisfy-55.7](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/satisfy-55.7.xml) |
| 16 | Break | [appear-48.1.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/appear-48.1.1.xml); [break-45.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/break-45.1.xml); [free-10.6.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/free-10.6.3.xml); [hurt-40.8.3-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/hurt-40.8.3.xml); [split-23.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/split-23.2.xml) |
| 17 | Tell | [transfer_mesg-37.1.1-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/transfer_mesg-37.1.1.xml) |
| 18 | Show | [crane-40.3.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/crane-40.3.2.xml); [indicate-78-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/indicate-78.xml); [reflexive_appearance-48.1.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/reflexive_appearance-48.1.2.xml); [transfer_mesg-37.1.1-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/transfer_mesg-37.1.1.xml) |
| 19 | Explain | [indicate-78-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/indicate-78.xml); [transfer_mesg-37.1.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/transfer_mesg-37.1.1.xml) |
| 20 | Reveal | [characterize-29.2-1-2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/characterize-29.2.xml); [confess-37.10](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/confess-37.10.xml); [indicate-78-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/indicate-78.xml); [reflexive_appearance-48.1.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/reflexive_appearance-48.1.2.xml); [say-37.7-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/say-37.7.xml) |
| 21 | Hide | [concealment-16-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/concealment-16.xml) |
| 22 | Confirm | [indicate-78-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/indicate-78.xml) |
| 23 | Deny | [conjecture-29.5](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/conjecture-29.5.xml) |
| 24 | Find | [declare-29.4-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/declare-29.4.xml); [discover-84](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/discover-84.xml); [encounter-30.5](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/encounter-30.5.xml); [get-13.5.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/get-13.5.1.xml) |
| 25 | Check | [assessment-34.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/assessment-34.1.xml); [peer-30.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/peer-30.3.xml); [search-35.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/search-35.2.xml) |
| 26 | Compare | [amalgamate-22.2-2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/amalgamate-22.2.xml) |
| 27 | Identify | [characterize-29.2-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/characterize-29.2.xml); [empathize-88.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/empathize-88.2.xml) |
| 28 | Prove | [declare-29.4-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/declare-29.4.xml); [deduce-97.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/deduce-97.2.xml); [indicate-78-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/indicate-78.xml) |
| 29 | Challenge | **NO EXACT LEMMA HIT** |
| 30 | Agree | [correspond-36.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/correspond-36.1.xml) |
| 31 | Disagree | [correspond-36.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/correspond-36.1.xml) |
| 32 | Praise | [characterize-29.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/characterize-29.2.xml); [judgment-33.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/judgment-33.1.xml) |
| 33 | Criticize | [judgment-33.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/judgment-33.1.xml) |
| 34 | Accuse | [suspect-81](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/suspect-81.xml) |
| 35 | Thank | [judgment-33.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/judgment-33.1.xml) |
| 36 | Apologize | **NO EXACT LEMMA HIT** |
| 37 | Forgive | [judgment-33.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/judgment-33.1.xml) |
| 38 | Help | [help-72.1-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/help-72.1.xml) |
| 39 | Hinder | [discourage-64.5-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/discourage-64.5.xml) |
| 40 | Support | [admire-31.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/admire-31.2.xml); [contiguous_location-47.8](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/contiguous_location-47.8.xml); [help-72.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/help-72.1.xml); [support-15.3-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/support-15.3.xml) |
| 41 | Oppose | [amalgamate-22.2-3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/amalgamate-22.2.xml) |
| 42 | Protect | [defend-72.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/defend-72.3.xml) |
| 43 | Defend | [defend-72.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/defend-72.3.xml) |
| 44 | Warn | [advise-37.9-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/advise-37.9.xml) |
| 45 | Threaten | [amuse-31.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/amuse-31.1.xml) |
| 46 | Allow | [admit-64.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/admit-64.3.xml); [allow-64.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/allow-64.1.xml); [future_having-13.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/future_having-13.3.xml) |
| 47 | Forbid | [forbid-64.4-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/forbid-64.4.xml) |
| 48 | Assign | [future_having-13.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/future_having-13.3.xml) |
| 49 | Delegate | **NO EXACT LEMMA HIT** |
| 50 | Release | [free-10.6.3-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/free-10.6.3.xml) |
| 51 | Go | [attend-107.4-2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/attend-107.4.xml); [become-109.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/become-109.1.xml); [disappearance-48.2-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/disappearance-48.2.xml); [escape-51.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/escape-51.1.xml); [function-105.2.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/function-105.2.1.xml); [harmonize-22.6](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/harmonize-22.6.xml); [help-72.1-2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/help-72.1.xml); [meander-47.7](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/meander-47.7.xml); [occur-48.3-2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/occur-48.3.xml); [rummage-35.5](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/rummage-35.5.xml); [say-37.7](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/say-37.7.xml) |
| 52 | Stay | [exist-47.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/exist-47.1.xml); [lodge-46](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/lodge-46.xml); [seem-109-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/seem-109.xml) |
| 53 | Leave | [become-109.1-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/become-109.1.xml); [escape-51.1-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/escape-51.1.xml); [fulfilling-13.4.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/fulfilling-13.4.1.xml); [future_having-13.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/future_having-13.3.xml); [keep-15.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/keep-15.2.xml); [leave-51.2-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/leave-51.2.xml); [render-29.90](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/render-29.90.xml); [resign-10.11-2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/resign-10.11.xml); [sustain-55.6-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/sustain-55.6.xml) |
| 54 | Follow | [abide_by-93.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/abide_by-93.2.xml); [assessment-34.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/assessment-34.1.xml); [chase-51.6](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/chase-51.6.xml); [comprehend-87.2-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/comprehend-87.2.xml); [contiguous_location-47.8](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/contiguous_location-47.8.xml); [occur-48.3-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/occur-48.3.xml) |
| 55 | Lead | [accompany-51.7](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/accompany-51.7.xml); [compel-59.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/compel-59.1.xml); [result-27.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/result-27.2.xml); [spend_time-104](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/spend_time-104.xml); [supervision-95.2.2-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/supervision-95.2.2.xml); [terminus-47.9](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/terminus-47.9.xml) |
| 56 | Join | [cooperate-73.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/cooperate-73.1.xml); [mix-22.1-2-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/mix-22.1.xml) |
| 57 | Meet | [contiguous_location-47.8-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/contiguous_location-47.8.xml); [encounter-30.5](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/encounter-30.5.xml); [meet-36.3-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/meet-36.3.xml); [satisfy-55.7](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/satisfy-55.7.xml) |
| 58 | Wait | [exist-47.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/exist-47.1.xml) |
| 59 | Use | [consume-66](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/consume-66.xml); [eat-39.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/eat-39.1.xml); [spend_time-104](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/spend_time-104.xml); [use-105.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/use-105.1.xml) |
| 60 | Make | [act-114](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/act-114.xml); [build-26.1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/build-26.1.xml); [comprise-107.2-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/comprise-107.2.xml); [obtain-13.5.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/obtain-13.5.2.xml); [reach-51.8](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/reach-51.8.xml); [render-29.90-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/render-29.90.xml) |
| 61 | Fix | [preparing-26.3-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/preparing-26.3.xml); [price-54.4](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/price-54.4.xml); [shake-22.3-2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/shake-22.3.xml) |
| 62 | Destroy | [destroy-44](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/destroy-44.xml) |
| 63 | Open | [appear-48.1.1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/appear-48.1.1.xml); [crane-40.3.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/crane-40.3.2.xml); [establish-55.5-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/establish-55.5.xml); [other_cos-45.4](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/other_cos-45.4.xml); [put_spatial-9.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/put_spatial-9.2.xml); [spatial_configuration-47.6-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/spatial_configuration-47.6.xml) |
| 64 | Close | [crane-40.3.2](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/crane-40.3.2.xml); [fill-9.8](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/fill-9.8.xml); [other_cos-45.4](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/other_cos-45.4.xml); [stop-55.4-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/stop-55.4.xml) |
| 65 | Start | [begin-55.1-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/begin-55.1.xml); [marvel-31.3](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/marvel-31.3.xml); [terminus-47.9](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/terminus-47.9.xml) |
| 66 | Stop | [forbid-64.4-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/forbid-64.4.xml); [lodge-46](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/lodge-46.xml); [stop-55.4-1-1](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/stop-55.4.xml); [terminus-47.9](https://github.com/cu-clear/verbnet/blob/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4/terminus-47.9.xml) |

**Completeness:** 66 definitions, 66 typed-role/gate/effect entries, 66 positive and negative examples, 66 confidence/gap dispositions, family-level REQUEST/OFFER/REMARK coverage with per-word exceptions; 329 XMLs scanned; 61 exact lemma-hit words; five no-hit words. This is proposed research/specification evidence, not automated behavioral test evidence or proof of a functioning/fun game.
