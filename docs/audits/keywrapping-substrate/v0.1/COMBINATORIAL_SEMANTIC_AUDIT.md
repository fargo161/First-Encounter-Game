# Independent combinatorial and semantic audit

**Version:** v0.1 · **Date:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT
**Role:** Independent Combinatorial / Semantic Auditor, role 10
**Outcome:** Bounded documentary review complete after one medium finding was corrected and independently rechecked. No unresolved critical, high or medium finding in the reviewed scope.

## Independence, authority and method

This reviewer did not author the dictionary, substrate models, examples or sealing audit. Review began after role 9's initial sealing review and its SL-01 correction/recheck cycle. The Lead received the finding below, changed the dictionary, and this reviewer independently inspected that correction before closing this review. The reviewer's only authored repository file is this report. The [team execution record](TEAM_EXECUTION.md) records the full sequence, including the affected sealing recheck requested after the dictionary correction.

The direct owner sign-off authorizes documentation production with ten roles, defers actual JSON Schema files, treats the supplied complete Context v0.1 as baseline and holds push/merge/publication. KW-CONTEXT §§13–18 supplies the three Functions, all 66 starting words, contextual composition, grouped exchange and saying/agreeing/doing distinctions. KW-REPLY refines performative conditions and predicate recommendations. Reviewer suggestions and donor semantics do not overrule established owner direction. C2.1 B0 is a comparison input, not the governing source or an accepted KeyWrapping implementation contract. Source identities/classifications are in [SOURCE_SNAPSHOT.md](../../../research/keywrapping-substrate/v0.1/SOURCE_SNAPSHOT.md).

Repository working rules, shared-contract boundaries and the Stage 13 stop gate were consulted. No accepted contracts, C1, C2.1 B0, frozen packages, runtime, schema files, adapters or Unity work were changed by this reviewer. This report does not independently rerun repository package behavior; the [verification report](VERIFICATION_REPORT.md) records those separate checks.

The audit combined direct document reading, independent read-only Python inspection and manual counterexample reasoning. Python ran from an inline command without creating a repository script or fixture. It parsed the pinned external VerbNet XML and Markdown JSON; it did not execute a KeyWrapping interpreter. Every expected result in the catalog below is a documentary requirement or paper interpretation. None is reported as an implemented runtime test, proof of exhaustive composition, design acceptance or gameplay-fun result.

## Finding, correction and independent recheck

Severity describes the consequence for this proposed specification: critical/high would invalidate a central boundary or permit broad false effects; medium is a concrete inconsistent semantic rule/example; low is a localized clarity issue. Open owner policies are not automatically defects when consequential interpretation is explicitly deferred.

| Finding | Original evidence and counterexample | Expected rule | Correction and recheck |
| --- | --- | --- | --- |
| CS-01 — Medium | [ACTION_PREDICATE_MAPPING.md](../../../research/keywrapping-substrate/v0.1/ACTION_PREDICATE_MAPPING.md), §21 Hide, line 234, originally required `from:A[]`, while `?` denoted optional slots. [JSON_RECORD_FAMILY.md](../../../design/keywrapping-substrate/v0.1/JSON_RECORD_FAMILY.md), F1 crosswalk and `hide0`/`secretAccount`, used `hide.object` with actor/theme/location but no audience. Applying the signature literally could reject the central account or require inventing a hidden audience. | Separate audience-free physical concealment from audience-relative information withholding. Do not infer an unnamed observer or claim successful concealment from every actor. Information withholding needs selected accessible content and an identified audience. | **Lead corrected; independently rechecked and closed.** Physical roles now permit optional `from`, require a physically concealable target and resolvable operation, and deny audience-specific detection/success without its own basis. The F1 role aliases and intentionally omitted audience are explicit. Information withholding separately requires selected actor-accessible content and a nonempty identified audience; it cannot erase receipts or prevent independent observation/disclosure. |

Original dictionary SHA-256: `d9f68a4b53b14e2cad0756ac2343257df7ecd2b926a107fe9a4b291234502ec2`. Rechecked dictionary SHA-256: `5ad2374b9a851cd82198263243137911bd9da041dc3c2c7d9ded4703beecebd6`.

The recheck compared the revised §21 with the common required-slot/force rules, F1 `hide.object`, the Player's attributed account and actor-safe view, and the no-hidden-oracle/no-erasure boundaries. The central JSON and donor appendix did not change. No observer, guard-specific detection result or extra Player acquisition was added. Role 9's affected-boundary recheck is recorded in the [sealing audit](LEAK_SEALING_AUDIT.md); the two audits retain separate responsibilities.

No other documentary finding was raised. This means no additional contradiction was found in this bounded review, not that every possible sentence or later implementation has been validated.

## Independent lexical and donor evidence checks

The reviewer read the 66-word table in the actual supplied Context and compared it with all numbered dictionary headings: **66 unique words, same sequence and spelling; no omissions, silent merges or additions**. Each entry contains a definition, selected senses/donor fit or gap, typed roles/gates/effects, positive and negative examples, confidence and related-word distinctions. Shared Function defaults apply with entry-specific exceptions; this organization avoids an enormous flat list of every sentence.

The external read-only cache contained all **329** `verbnet3.4/*.xml` files at pinned commit [`ae8e9cfdc2c0d3414b748763612f1a0a34194cc1`](https://github.com/cu-clear/verbnet/tree/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4). The reviewer independently parsed `VNCLASS` and nested `VNSUBCLASS`, matched exact `MEMBER/@name`, and obtained **61 hits** and exactly five no-hits: **Share, Cancel, Challenge, Apologize, Delegate**. Appendix B's complete memberships for all 66 words were independently compared with the XML: **zero differences**.

All **65 selected Appendix A rows**, rather than a sample alone, were independently compared against the XML for exact lemma membership class, frame-owning ancestor/subclass, 1-based local frame ordinal, primary description, NP thematic-role order and effective role restrictions. Ancestor declarations were accumulated with each subclass's declaration replacing the same role. Result: **zero differences**. Frame-role names were checked as supplied, rather than repaired into a game schema. This confirms the transcribed evidence, not the appropriateness of every gameplay extension.

Manual sense review specifically retained these limits:

- Threaten's `amuse-31.1` membership/frame supplies emotional-impact structure, not the proposed threatening speech act or automatic FEARS. The dictionary explicitly calls the speech act an Encounter gap.
- Fix's preparation, attachment and valuation entries do not supply general repair. The proposed repair sense remains a gap.
- Break's solid-patient physical frame does not type an obligation; breach has separate assessment semantics and no selected exact contractual frame.
- Compare's broader physical-object use, Protect/Defend's object/claim uses, and Release's resource/latch uses are explicitly marked extensions beyond the selected donor restrictions.
- Acceptance authority, exact versioning, loan return duties, scoped permission, authentic evidence, belief and sealing are Encounter proposals; lexical membership supplies none of those guards.
- `D` keys remain research citations, and the F1 sense tokens remain local illustrative aliases. No uninspected FrameNet match or final action registry is asserted.

The [license ledger](../../../research/keywrapping-substrate/v0.1/SOURCE_LICENSE_LEDGER.md) retains the selected VerbNet metadata notice/attribution and limits redistribution of unresolved donor datasets. This audit verifies documentary traceability and evidence transcription; it does not grant a new license or approve publication.

## Coverage of all 66 candidate words

W/C/I/Q below are the dictionary's world, communication, institutional and inquiry families. A slash identifies explicit senses/mechanisms, not permission to coerce one into another. The audit checked each entry against its family defaults and the stated discriminator; the catalog that follows attacks the reusable rules. This is manual coverage of all entries, not 198 executed Function combinations or an exhaustive Cartesian search.

| # / word | Family and reviewed discriminator |
| --- | --- |
| 01 Give | W; custody versus ownership, transferable theme, recipient and fungible quantity/unit; saying does not transfer. |
| 02 Take | W; source/control versus title; unauthorized taking can be physically possible. |
| 03 Keep | W; existing custody and interval; an offer does not acquire the resource. |
| 04 Lend | W plus separately formed I duty; temporary handover and return terms do not collapse into one speech effect. |
| 05 Borrow | W/I; same loan from borrower role; consent defines borrowing, not all physical taking. |
| 06 Return | W; resource restoration versus self-motion; no hidden-owner destination inference. |
| 07 Share | W/C; resource allocation versus selected disclosure; explicit original senses after no lemma hit. |
| 08 Pay | W; currency plus exact settlement target; a gift and a payment need not discharge the same duty. |
| 09 Accept | I; exact eligible version, party/standing, known material terms and current self performance. |
| 10 Refuse | I/C; decline participation, not falsify content or refuse on another party's behalf. |
| 11 Promise | I; self undertaking, future content and beneficiary; no involuntary third-party duty or fulfillment. |
| 12 Change | W/I; physical property versus new proposal terms; old agreement cannot be overwritten. |
| 13 Withdraw | I/W; eligible proposal retraction versus departure; formed duties survive absent termination rules. |
| 14 Cancel | I/W; exact cancellation right versus physical stopping; no retrospective erasure. |
| 15 Fulfill | W plus evaluation; matching individual performance evidence, not merely saying Fulfill. |
| 16 Break | W or breach assessment; solid object versus obligation; accusation is not guilt. |
| 17 Tell | C; selected attributed payload and recipient/channel; offer/report is not present disclosure. |
| 18 Show | C/W; selected visible aspect or demonstration; not custody transfer or compelled belief. |
| 19 Explain | C; explicit why/how content, which can be mistaken; not private-reason extraction. |
| 20 Reveal | C; recipient-relative disclosure sense; actual novelty remains open, with no knowledge oracle. |
| 21 Hide | W/C; physical concealment versus scoped withholding; **CS-01 corrected and rechecked**. |
| 22 Confirm | C or explicit I certification; attestation versus actual effect/authority. |
| 23 Deny | C; assert proposition false, without deletion or acquittal. |
| 24 Find | Q/W; bounded discovery path without taking or omniscient location lookup. |
| 25 Check | Q/W; identified criterion/access/method, possibly inconclusive. |
| 26 Compare | Q/W; at least two targets and common dimension; explicit donor-type extension. |
| 27 Identify | Q/C; evidence-bound identification/claim versus world-person merge. |
| 28 Prove | Q/C; evidence and standard versus setting truth or belief. |
| 29 Challenge | C/Q; contest specified scope without automatically voiding terms. |
| 30 Agree | C; concordance with proposition/plan, not bargain acceptance. |
| 31 Disagree | C; nonconcordance, not refusal or falsity of every source claim. |
| 32 Praise | C; expressed positive evaluation without forced trust/relationship bonus. |
| 33 Criticize | C; negative evaluation without evidence deletion or sanctions. |
| 34 Accuse | C; expressible attributed wrong, optionally without evidence; no canonical guilt or invented verb. |
| 35 Thank | C; actor recipient and recoverable benefit; no forced gratitude. |
| 36 Apologize | C; offense/responsibility scope, without automatic restitution or forgiveness. |
| 37 Forgive | C/I; own grievance expression versus explicit right waiver. |
| 38 Help | W/C; contribution to a task versus guaranteed success or endorsement. |
| 39 Hinder | W/C; explicit intervention and impediment, not unlimited actor disabling. |
| 40 Support | C/W; backing a side versus task-neutral assistance or silent assent. |
| 41 Oppose | C/W; resistance/position, not negation of truth or permission. |
| 42 Protect | W/C; explicit threat/means and mitigation, not guaranteed safety or erasure of history. |
| 43 Defend | W/C/Q; resisting attack versus argument about a claim, without forced agreement. |
| 44 Warn | C; attributed risk can be false or ignored; no automatic watcher disclosure. |
| 45 Threaten | C; adverse intention/pressure can be a bluff; no automatic harm, capability or FEARS. |
| 46 Allow | I; actual authority over exact permission scope; no automatic door/knowledge effect. |
| 47 Forbid | I; scoped normative restriction, not physical impossibility. |
| 48 Assign | I/C; selected assignment authority/rule versus proposed task and assumed consent. |
| 49 Delegate | I; source delegability, scope subset and revocation terms; no wider powers/knowledge. |
| 50 Release | W/I; physical restraint versus exact entitlement; other creditors remain unaffected. |
| 51 Go | W; known destination/route and actual traversal separate from permission and RC metadata. |
| 52 Stay | W; location/participation interval; impossible execution does not ban meaningful discussion. |
| 53 Leave | W/I; spatial departure versus formal participation exit; debts do not vanish. |
| 54 Follow | W; tracking versus compliance; no hidden destination or forced obedience. |
| 55 Lead | W/C; actual guidance and follower perception/choice, without teleportation or authority grant. |
| 56 Join | W/I; participation/admission rule versus co-location and automatic group secrets. |
| 57 Meet | W; actual encounter versus scheduling, name learning or guaranteed recognition. |
| 58 Wait | W; explicit time/observable trigger, not notification of another mind's secret decision. |
| 59 Use | W; resource-specific purpose/mode and capability, not arbitrary wrapper execution. |
| 60 Make | W; product/material/process, not free creation of an accepted agreement. |
| 61 Fix | W; fault/working condition and actual repair; donor mismatch remains explicit. |
| 62 Destroy | W; destructible physical target, without deleting history/witnesses. |
| 63 Open | W or explicit I opening; barrier versus establishment/activity, not permission. |
| 64 Close | W or explicit I closure; barrier/operation versus debts and existing effects. |
| 65 Start | W or explicit I ceremonial start; supported activity/eligible state, not speech-triggered arbitrary execution. |
| 66 Stop | W/I; cessation/pause versus normative termination; completed disclosure remains. |

TRUSTS, FEARS, NEEDS and BELIEVES were separately checked as candidate predicates outside the 66-word count. Attributed remarks cannot read private state or create it. `NOT [BELIEVES P]` and `BELIEVES [NOT P]` remain distinct. Attack/Hurt/Kill/Steal remain candidate additions only; source-pack shooting/death/theft scenes are historical examples, not new language executors.

## Nonsense and ambiguity catalog with guardrails

Document keys: AD = [dictionary](../../../research/keywrapping-substrate/v0.1/ACTION_PREDICATE_MAPPING.md); EC = [expressions](../../../design/keywrapping-substrate/v0.1/EXPRESSIONS_COMPATIBILITY.md); TC = [transactions](../../../design/keywrapping-substrate/v0.1/TRANSACTIONS_COMMITMENTS.md); RP = [references](../../../design/keywrapping-substrate/v0.1/REFERENCES_PROMOTION.md); PP = [perspective](../../../design/keywrapping-substrate/v0.1/PERSPECTIVE_PROVENANCE.md); JR = [JSON family](../../../design/keywrapping-substrate/v0.1/JSON_RECORD_FAMILY.md); SD = [schema design](../../../design/keywrapping-substrate/v0.1/SCHEMA_DESIGN.md). “Supported” means the documents contain the stated guard, not that code enforced it.

| Case | Counterexample / ambiguity | Required interpretation or guardrail | Documentary inspection |
| --- | --- | --- | --- |
| N01 | OFFER GIVE Hotel Shootout as inventory | Reject transferable-slot coercion; explicitly Tell selected content if that is intended. | Supported: AD01, EC four questions, RP R03. |
| N02 | Offer 30 coins while secretly unable to pay | Discussion/self-assent can remain valid; no menu oracle or invented funds. | Supported: AD shared boundary, TC C04, PP P14. |
| N03 | Take a key without owner consent | Physical effect and normative violation differ; do not call all unauthorized taking physically impossible. | Supported: AD02, TC C11. |
| N04 | Lend and Borrow descriptions credit two handovers | They can describe one loan from two roles; identify the same effect once. | Supported: AD04/05 and near-duplicate table; TC C09. |
| N05 | RETURN resolves destination through secret ownership | Select resource/motion sense and actor-known destination; missing basis cannot query hidden ownership. | Supported: AD06, PP P14. |
| N06 | SHARE a key silently shares every related route | Resource allocation and selected information are distinct senses. | Supported: AD07 and disclosure boundary. |
| N07 | PAY by asserting payment or reuse a gift as automatic settlement | Require actual currency effect and exact duty allocation. | Supported: AD08, TC C09, JR money credit. |
| N08 | REQUEST ACCEPT V2 creates assent | It requests another act, without performing it. | Supported: EC Function table, TC C05. |
| N09 | OFFER ACCEPT V2 later creates immediate assent | Preserve future/conditional proposal force; no current acceptance. | Supported: AD common gate, EC Function table. |
| N10 | REMARK Ray accepted yesterday / quoted “I accept” | Record attributed report/quotation, not Ray's or quoting speaker's new assent. | Supported: AD09, TC C05. |
| N11 | Current self ACCEPT V1 while V2 is eligible | Keep exact V1 target and apply explicit eligibility policy; never retarget by newest label. | Supported: JR pv1/pv2 and exclusive tick-13 boundary, TC C01/C02. |
| N12 | “Yes” with two known offers or only partial terms | Clarify before binding; neither a hidden canonical link nor receipt alone supplies understood terms. | Supported: EC context section, TC C02, JR comprehension stipulation. |
| N13 | Agree with a plan means accepting every bargain clause | Concordance and exact proposal assent differ. | Supported: AD09/30, TC C02/C05. |
| N14 | Current Promise Return key imposes a duty on its guard beneficiary | Only the promisor undertakes; beneficiary receipt is the declared paper policy, not bilateral assent. | Supported: JR returnPromise/returnDuty, TC C03–C06. |
| N15 | Promise is impossible/dishonest, therefore no duty exists | Do not substitute capability or sincerity for valid self undertaking. | Supported: AD11, TC C04, JR promise explanation. |
| N16 | Change price silently rewrites an earlier acceptance | New linked exact terms/version and required assent; preserve old evidence. | Supported: AD12, TC C01/C12. |
| N17 | Withdraw an offer after formation erases accepted debt | Pending-offer withdrawal and release/cancellation rights differ. | Supported: AD13/14/50, TC C12. |
| N18 | Say Fulfill after paying only 10 of 30 | Credit actual distinct effect once; remaining 20 and independent Tell duty remain. | Supported: AD15, JR moneyAt25, TC C09. |
| N19 | Alleged Break is canonical breach or deleted duty | Claim, actual duty, timing, fault/excuse and evaluation remain separate. | Supported: AD16, TC C07/C12. |
| N20 | OFFER TELL discloses its offered payload immediately | Proposal states selected subject/criterion only; actual later receipt supplies payload. | Supported: AD17, TC C10, JR offer versus tellReceipt. |
| N21 | SHOW/CONFIRM/PROVE forces belief or truth | Present evidence/attestation under its criterion; receiving does not endorse. | Supported: AD18/22/28, PP P03. |
| N22 | EXPLAIN Why extracts private NPC reasoning | Request explanation; outward reason can be a pretext/claim. | Supported: AD19, PP §7. |
| N23 | REVEAL's novelty check tells speaker what recipient secretly knows | Novelty policy remains open; no hidden-knowledge feedback. | Supported: AD20, PP P11/P14. |
| N24 | HIDE key lacks a named audience, or HIDE erases received information | Physical concealment need not name audience; audience-relative withholding requires one and changes no past receipt. | **CS-01 corrected/rechecked**; AD21 and JR hide account agree. |
| N25 | DENY or DISAGREE deletes underlying event/evidence | These are expressed proposition stances, not erasure or global source invalidation. | Supported: AD23/31, PP P05. |
| N26 | FIND/IDENTIFY culprit returns hidden canonical identity | Bounded evidence/acquisition or attributed claim, not lookup by correct guess. | Supported: AD24/27, PP P15. |
| N27 | COMPARE one target, or incompatible units without conversion | Require two or more comparable targets/dimension, with explicit conversion if used. | Supported: AD26, SD semantic limits. |
| N28 | CHALLENGE agreement voids everyone's obligations | Delivered contest creates claim/dispute; no automatic termination. | Supported: AD29, TC C12. |
| N29 | PRAISE/THANK/APOLOGIZE/FORGIVE force trust, guilt, restitution or another creditor's waiver | Expressed act and exact own-right effect remain separate. | Supported: AD32/35/36/37, TC C11/C12. |
| N30 | ACCUSE ABOUT incident supplies unspoken “fired first” | ABOUT is topic, not allegation content; preserve unsupported vocabulary gap. | Supported: AD34 and candidate-only section, EC ABOUT. |
| N31 | HELP/SUPPORT bind everyone to the backed plan | Task contribution, endorsement and assent differ. | Supported: AD38/40, TC C03. |
| N32 | OPPOSE/HINDER/FORBID/STOP are interchangeable | Resistance, actual impediment, norm and cessation have different required roles/effects. | Supported: AD39/41/47/66. |
| N33 | PROTECT/DEFEND guarantees success or rewrites history | Explicit threat/means and actual bounded mitigation/argument; no universal shield. | Supported: AD42/43. |
| N34 | WARN/THREATEN proves risk, causes harm or sets FEARS | Delivered warning/threat may be mistaken/bluff; effect and stance need separate evidence. | Supported: AD44/45 and predicate section. |
| N35 | ALLOW by bystander opens the door; FORBID disables capability | Scope-bound authority for norms; world capability/effect remains separate. | Supported: AD46/47, TC C11, JR conflicting norms. |
| N36 | ASSIGN/DELEGATE bind strangers or exceed source authority | Explicit assignment/acceptance policy, delegability and subset; no inherited secret knowledge. | Supported: AD48/49, TC C03/C11. |
| N37 | GO/FOLLOW uses RC point/name to grant movement or reveal destination | Spatial description/reference is no permission, observation or executable bridge. | Supported: AD51/54, repository ownership boundaries. |
| N38 | STAY in two exclusive places is offered | Conflicting execution can be impossible while discussion is meaningful; no secret-based filtering. | Supported by AD shared W/discussion distinction and AD52; not a proof of feasible execution. |
| N39 | LEAVE/JOIN/MEET silently cancels debts or teaches names/group secrets | Apply selected participation rules and actual acquired aspects, not global knowledge. | Supported: AD53/56/57, PP P08. |
| N40 | LEAD teleports unwilling follower; WAIT signals a secret decision | Actual guidance/perception and observable trigger; no compelled motion or private-state alarm. | Supported: AD55/58, TC C08. |
| N41 | USE/MAKE/FIX label supplies an arbitrary executor | Typed purpose/product/process/fault and capability evidence; unsupported execution remains discussable. | Supported: AD59–61, EC four questions. |
| N42 | DESTROY evidence deletes all provenance; CLOSE/STOP reverses disclosure | Preserve historical identity, receipts and completed effects. | Supported: AD62/64/66, PP P17, TC C12. |
| N43 | OPEN/START conflates barrier state, operational start and permission | Select target kind/sense and explicit institutional rule where needed. | Supported: AD63/65, near-duplicate table. |
| N44 | AND clauses execute in listed order or collapse to one duty | AND preserves group, not temporal sequencing; each actual performance/credit remains separate. | Supported: EC nodes, TC C07/C09, JR playerSide. |
| N45 | IF applies only to Tell rather than money AND Tell | Preserve explicit group attachment and formation-versus-activation phase. | Supported: EC exchange explanation, JR conditionalLinks/groupId and three duties. |
| N46 | IN EXCHANGE FOR implies atomic rollback of a told secret | Explicit reciprocity/order and no automatic rollback; cancellation cannot unlearn. | Supported: EC exchange, TC C10/C12, JR rollback none. |
| N47 | OR key/pay selects easiest branch without chooser/cardinality | Resolve chooser, inclusive/exclusive meaning and selection time before binding. | Supported: EC OR and open choices. |
| N48 | BEFORE A requires BEFORE B requires A; AFTER/UNTIL lacks boundary | Detect strict dependency cycle or clarify contingent intent; clock/anchor/boundary cannot be guessed. | Supported: EC temporal nodes/bounds, TC C08. |
| N49 | NOT ACCEPT means Refuse, or NOT GIVE undoes transfer | Select negation target/mode; propositional denial, negative undertaking and prohibition differ. | Supported: EC NOT, TC C12. |
| N50 | BECAUSE Ray says paid proves payment; nested deal↔dispute expands forever | Reasons remain attributed claims; typed authorized edges, visited identities and public budgets stop expansion. | Supported: EC BECAUSE/traversal, RP R03, PP P09, JR bounded view. |

The 13 near-duplicate comparison groups in AD were all reviewed against these guards. None is silently merged. Ambiguities that depend on owner policy, including OR selection, counteroffer races, partial acceptance, delegation consent, novelty, proof standards and deadline interpretation, are retained in [OPEN_QUESTIONS.md](../../../design/keywrapping-substrate/v0.1/OPEN_QUESTIONS.md). Missing policy cannot authorize an invented binding effect.

## Integrated F1 semantic and structural inspection

Independent duplicate-key-rejecting JSON parsing found **10 valid fenced JSON blocks** in JR: one privileged context, five privileged record groups and four actor-safe outputs. The record groups contain **64 records**; the context declares **18 external objects**, for **82 unique local declarations** and **243 abbreviated reference occurrences**. Every abbreviated ref resolves; every explicitly supplied target revision matches. Common/family required fields from the document's table are present. The external declarations, self-authored terms, receipt authenticity and stipulated comprehension remain paper assumptions, not evidence of a functioning game.

The reviewer inspected target kinds and semantic selectors, rather than accepting string closure alone:

- Proposal versions refer to their exact expression revision; each assent targets `pv2` record revision 1 and terms revision 2. `artifactRevision`, record revision and terms revision do not substitute for one another. The guard's own authored terms and Player's full counter receipt are distinct legitimate terms bases under the declared fixture assumptions.
- `access`, `money` and `tell` select action leaves in exact `counter2` revision 1. A condition reference to `termId=access` is a selector use, not a second binding declaration. `playerSide` is the grouped conjunction targeted by IF. Both Player duties activate after the actual scoped permission performance; the guard's duty activates at formation.
- The counter changes 50 to 30, preserves the Tell/access/grouping/settlement terms and leaves V1 as immutable history. V1's exclusive `until=13` and V2's `from=13` are explicitly declared. Opposite proposing speakers do not invert the explicit undertaking-party roles.
- Guard and Player accept through separate current self expressions, actual emissions and complete receipts at ticks 14–17. Agreement forms at 18, not upon offer/counter receipt. There is no third-party assent inferred from being named.
- At coarse tick 19, emission precedes receipt, which causes the scoped permission occurrence; equal tick labels do not reverse that explicit causal chain. Access credit follows at 20, transfer at 21, money credit at 22, retelling at 23, receipt at 24 and credit/assessment at 25. No inspected receipt predates its emission and no credit predates its source effect.
- Currency transfer matches the agreed custody interpretation, actor/recipient, unit and 10-coin amount. The 30-coin duty has 20 remaining. `thisDutyOnly` and distinct-effect counting forbid duplicate/cross-duty credit in this fixture. The received attributed report is credited independently; the topic is known in the proposal, while its payload is not prematurely disclosed.
- `tellReceipt` is evidence of received selected content, not guard belief, objective truth or independent corroboration. Ray's false Marcus claim is separate from actual guard taking and Ray's observation. Only Ray has the explicit authored disbelief stance; Player receipt and TRUSTS composition do not create an unexpressed Player mind record.
- `returnPromise` is formed under the explicitly fixture-only self-standing plus beneficiary complete-receipt policy at tick 27. `returnDuty.formationBasis.kind=promise` resolves to a promise, without manufacturing an agreement or guard duty. `returnKey` resolves within exact `promiseSpeech` revision 1 with its ancestor AFTER completion anchor intact. No completed entry, key custody or return effect is fabricated; global promise validity remains open.
- Permission and prohibition rules overlap at tick 32 under a separately declared authority scope. `entryCapabilityAt32` is distinct privileged background. No winner, automatic breach, revocation of the earlier grant or physical disabling is invented.
- Shopkeeper continuity/promotion at 40 precedes Player meeting/acquisition at 50 and received name at 60. Historical/current view labels preserve that difference. Neither promotion nor canonical identity imports hidden stock-loss evidence into the book.
- The four actor outputs use locally scoped opaque handles, without F1 refs/revisions/hidden sources. The cyclic agreement/dispute view declares a separate acquired-knowledge assumption; it does not claim those acquisitions occurred in the earlier warehouse timeline. Its visited-link/budget requirement terminates the known cycle without counting hidden edges.

SD correctly limits structural validation: JSON shape cannot establish authenticity, matching terms, causal order, authority, fulfillment allocation, confidentiality or dialogue fidelity. Duplicate-key rejection, reference checks and this manual review are documentary evidence only. Research-report schematic JSON is not automatically part of F1 or a new accepted notation.

## Reviewed snapshot

SHA-256 values below identify the reviewed raw Markdown bytes, including the CS-01 correction. They are privileged review bookkeeping, not actor tokens or assertions of gameplay truth. Later semantic changes need affected-case review; unrelated final index/team/verification bookkeeping is outside this frozen model list.

| File | SHA-256 |
| --- | --- |
| `ACTION_PREDICATE_MAPPING.md` | `5ad2374b9a851cd82198263243137911bd9da041dc3c2c7d9ded4703beecebd6` |
| `SUBSTRATE_SPEC.md` | `ea18402daaad65717ce1c954d289c41b934ebaf7174769a4c50e864749fb5261` |
| `REFERENCES_PROMOTION.md` | `f84cd28c92bf90b98f430b6d5507e8f4130d841da0b5cdf3f72e525344854074` |
| `PERSPECTIVE_PROVENANCE.md` | `34de0cf889d52bbe0126d05251c9b56d26c4a2d5195ff8f2d0e5d4317e6573d5` |
| `TRANSACTIONS_COMMITMENTS.md` | `26c04efeaf6131d6a0cbf58098c910312ed71e893fa6af740b37d0857e337684` |
| `EXPRESSIONS_COMPATIBILITY.md` | `d6f0250105d8de64dc0385fedef24ad9e20c75bbaf2dca17b4978eadfd78594d` |
| `JSON_RECORD_FAMILY.md` | `5e05d3670ce1d65062dbc39b15a32bf22c8d9ec3e2faf287a2750d7702a3690e` |
| `SCHEMA_DESIGN.md` | `9fd9b3d040dea522618089d3a71354db4e0817a2177ef9e5520b4246083a5f30` |
| `SOURCE_SNAPSHOT.md` | `26ba8e213b63ae77829545675bcd1ccf194b00000878abdc1b45359834b007e3` |
| `OPEN_QUESTIONS.md` | `5e301e912326dac1a37cb4de4b793f40c9b828679cee959841b3f53b12d35771` |

The four owner-held original byte hashes were independently recomputed and matched SOURCE_SNAPSHOT, including the Reply hash containing `bcab6d8b`. No equivalence to an unavailable numbered duplicate was asserted. The role-9 report's initial reviewed byte hash was `2bcdbe75f69d9dacf7f951daaade64de3954f5603190f61a5cdfc6b7e0c0be6d`; its later CS-01 affected-boundary addendum is separate evidence, not silently the same snapshot.

## Remaining limits and owner decisions

The corrected package is coherent enough for owner review as a proposed documentation substrate. It does not freeze the dictionary or rules. Actual schema creation, runtime enforcement, parser policy, identity/authority authenticity, replay semantics, side-channel resistance, performance budgets and dialogue realization need a separately scoped implementation and meaningful adversarial tests. The 50 catalog cases and full lexical checks do not enumerate unbounded nested compositions or settle every scenario policy.

The missing embedded NPC four-check diagram remains unavailable; no predicate/order was reconstructed. A Player-involved paper test still precedes design freeze or implementation acceptance. The actual public/private repository discrepancy and publication hold remain in the decision log/integration plan. This audit authorizes no commit, push, merge, visibility change or publication.
