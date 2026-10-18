---
title: "Encounter System — Master Document v2.1"
document_id: "encounter-system-master"
version: "2.1"
date: "2026-10-17"
owner: "Theodore (Teddy) McDonald"
executable_baseline: "Encounter Core v0.1.0"
first_scenario: "Last Collection"
status: "Approved design decisions recorded; Sign-off A (CR-01) and Sign-off B (PD-01–PD-12) approved 2026-10-17 with two amendments"
approval_record: "Encounter_Approval_Record_2026-10-17.md"
authorization: "Design documentation only; no software built and no development agents launched. Sending a kickoff brief is a separate owner action."
supersedes: "Encounter_System_Master_v2.0.md and Encounter_System_Consolidated_Design_and_Architecture_v1.0.md, within the authority rules below"
---

# Encounter System — Master Document v2.1

**The encounter is the product. Learn the controls once; keep learning how to deal with the people.**

<a id="part-0"></a>
# Part 0 — Start here

## The project in five sentences

Encounter is a reusable game system for dealing with people through things you offer, request, or say. Each non-player character (NPC) has their own knowledge, needs, relationships, and imperfect impressions of you. You use learned subjects and BASED—a set of ways to perform a message—while the character visibly takes it in and responds. The first test, **Last Collection**, asks you to recover an absent musician’s instrument case from a transport office without requiring everyone to like you or every secret to be exposed. The **Encounter Assembler** is the small editing workbench that will let Teddy change the people and starting situation, replay, and understand why the result changed.

## Decided, open, and deferred

The decision IDs are permanent labels for finding the exact rules in Appendix B. A **seed** is a repeatable starting arrangement, not another game.

| Status | Item | Reference |
|---|---|---|
| DECIDED | One property-recovery scenario, with a privacy concern. | LC-D01 |
| DECIDED | Recovery wins; relationships are separate side outcomes. | LC-D02 |
| DECIDED | Restriction, one repair opportunity, then warned escalation can close the visit. | LC-D03 |
| DECIDED | Payment is optional; Seed B has a credible nonpayment route. | LC-D04 |
| DECIDED | Pressure is generous; author testing can remove it. | LC-D05 |
| DECIDED | A reasonable paperwork request can be misunderstood; the first ordinary request is protected. | LC-D06 |
| DECIDED | The nonpayment bargain uses a witnessed record, not a new debt or promise. | LC-D07 |
| DECIDED | Start with 12 coins, adjustable; show spending and debt separately; decline unnecessary payment in Seed A. | LC-D08 |
| DECIDED | Seed A’s “collected” entry begins as ambiguous shorthand; later evasion is separate. | LC-D09 |
| DECIDED | Twenty vibes × six communicative actions × three settings: 360 required coverage cases. | ES-D01 |
| DECIDED | Salience means prominence; it changes social framing, never material terms. | ES-D02 |
| DECIDED | NPCs react to outward communication, not the hidden selected vibe label. | ES-D03 |
| DECIDED | NPC interpretations use reusable rules with support, correction, and consequences. | ES-D04 |
| DECIDED | PERCEIVED is foundational and stored as linked observations. | ES-D05 |
| DECIDED | New shared rules with checked record types selectively reuse verified earlier work. | ES-D06 |
| DECIDED | Preserve old files; do not automatically convert old saves. | ES-D07 |
| DECIDED | Four guided editing areas; edit, check, restart, compare; no changes to a running game. | ES-D08 |
| DECIDED | Start with one lead builder and one independent tester. | ES-D09 |
| DECIDED | Closing safeguards are fixed; the exact closing rule is in §2.12. | ES-D10 |
| DECIDED | The exact closing rule CR-01, plus a preview notice before any closing message. Approved 2026-10-17. | Sign-off A; §2.12 |
| DECIDED | The grouped technical behavior defaults PD-01–PD-12. Approved 2026-10-17. | Sign-off B; §3.0 |
| DECIDED | Seed B: Orrin accepts the nonpayment release because the witnessed record ends the office’s treatment of his claim as paid. Approved 2026-10-17. | §1.6, §1.10 |
| DEFERRED | Combat, playable theft/stealth, full senses, unrestricted promises, runtime AI, live-run editing, save conversion. | Part 8 |

The established Offer/Request/Remark loop, NPC Intake/Delivery, learned keywords, and human-player boundary remain in force. They are not being reopened. [Appendix B, historical D-01–D-30.]

## Owner sign-off — **recorded 2026-10-17**

**A. Closing rule — APPROVED with amendment.** One clearly explained, visit-long repair episode: a relevant clarification preserves progress; renewed demands for protected information after the delivered warning can end collection service. Failure depends on understandable conduct, not a question count. **Amendment:** once the warning has been given, any draft that would trigger closure shows a plain notice in its preview before Send. Read §2.12.

**B. Technical behavior package — APPROVED.** The defaults in §3.0 together: complete message previews, source-linked knowledge, evidence that can be questioned, one current exact offer, one consequence path, safe presentation fallbacks, and resumable saves. This group also includes the pacing, record-handling, and public ending rules in §3.13. Field names and file layout remain builder-review details, as long as the approved behavior is unchanged.

The approval, its date, and both amendments are recorded in `Encounter_Approval_Record_2026-10-17.md` and in Appendix B.4. **v2.1 reading rule:** some explanatory text in later sections still describes CR-01 or PD-01–PD-12 as “proposed,” “pending,” or “awaiting sign-off.” For those items, read that wording as DECIDED. Sending a kickoff brief to a builder is still a separate owner action.

## Authority and reading routes

**This document records the owner’s approved decisions and supersedes older material where it records a later decision. Its PROPOSED items do not override established requirements just because this document is newer.** Later direct owner instructions take precedence; the 2026-10-17 approval record is one of these. The authorized v2 prompt and agreed review clarifications govern this revision; v1.0 and the older sources supply everything still compatible. Exact source order and availability are in Appendix C.

**Teddy:** Parts 0–1, §2.12, the examples in §3.0, and Part 5. **Builders:** Parts 2–6 and 8, then Appendices A–D. **Tester:** Parts 0, 2–4, 6–8 and the decision-to-test links in Appendix B. The glossary is in Part 9.

---

## Contents

- [Part 0 — Start here](#part-0)
- [Part 1 — The game and how we got here](#part-1)
- [Part 2 — Design rules](#part-2)
- [Part 3 — Technical package](#part-3)
- [Part 4 — BASED coverage plan](#part-4)
- [Part 5 — Assembler v1 specification](#part-5)
- [Part 6 — Agent team preparation and kickoff briefs](#part-6)
- [Part 7 — Acceptance tests](#part-7)
- [Part 8 — Still open and deferred](#part-8)
- [Part 9 — Glossary](#part-9)
- [Appendix A — Legacy and inherited numbers](#appendix-a)
- [Appendix B — Decision register and test links](#appendix-b)
- [Appendix C — Sources and verification boundary](#appendix-c)
- [Appendix D — Changelog](#appendix-d)
- [Consistency check](#consistency-check)

**Status key:** DECIDED = approved requirement. PROPOSED DEFAULT = a recommended behavior awaiting owner sign-off (in v2.1, no item still carries this status: CR-01 and PD-01–PD-12 are approved). PROPOSED = an engineering or example detail for builder review. OPEN = a remaining choice. DEFERRED = outside the first build. IMPLEMENTED BASELINE = found in the earlier executable, not proof of the new prototype. Historical tables are explicitly marked legacy or inherited draft. A section’s status applies to its contents unless an item has its own label.

Portable references such as [F §12], [W Q10], [v1.0 §8], and [V2P ES-D03] name sources listed in Appendix C. They work outside this chat.

<a id="part-1"></a>
# Part 1 — The game and how we got here

## 1.1 Elevator pitch

Instead of choosing a prewritten line that secretly awards friendship points, you choose what you are trying to communicate and how to perform it. The people you meet have different information, responsibilities, grievances, and reasons to cooperate. As you learn about them, they also develop imperfect impressions of you. A useful question might reveal a clue, invite assistance, or make someone wonder why you are interested. Encounter is the shared machinery behind those exchanges; individual games provide their people, circumstances, art, voice, and physical actions.

It is not an unrestricted chatbot or a claim to simulate real human psychology. The first version uses a small, supported message vocabulary and authored rules. Its aim is a recognizable person whose response makes sense in context—not a universal formula for manipulating people. [F §§02–03; v1.0 §1.]

## 1.2 Four names, four jobs

| Name | Job |
|---|---|
| **Encounter System** | The overall reusable design for communication, observation, individual interpretation, response, and consequences. |
| **Encounter Core v0.1.0** | The earlier, smaller browser executable. It is a reference for code reuse and safeguards. |
| **Encounter Assembler** | The first authoring workbench: edit a few meaningful ingredients, test a run, inspect causes, save and compare. |
| **Last Collection** | The single selected scenario used to test the next prototype. |

The document’s version **2.0** is not an engine version. The Assembler and the new core are still to be built.

## 1.3 What the player does in a turn

You select **Offer**, **Request**, or **Remark**, choose learned subjects, and choose a BASED vibe with Subtle, Nuanced, or Overt prominence. A preview explains the actual communication before you send it; it does not predict the reply, with one exception: after Tamsin’s explicit warning, a draft that would end collection service says so before you can send it (§2.12 C2). The NPC then performs **Intake**, the visible act of registering your message, and **Delivery**, the outward reply, gesture, proposal, refusal, or deliberate silence. You regain control and choose your next move.

Body and face belong to one coherent performance. The first build can describe it rather than display finished animation:

```text
YOU — Request · Handling paperwork · Boundaried · Nuanced
Preview: Requests the handling information needed to verify collection,
while limiting the request to the case rather than unrelated records.

TAMSIN — Intake
Draws the file closer and looks from the ticket to the selected entry.

TAMSIN — Delivery
Explains that the file also contains private information.
Offers the handling extract or a supervised comparison.

[Continue]   [End conversation]
```

This mockup tells the player what was communicated. It does not reveal a hidden motive or guarantee that Tamsin’s statements are true. Selecting a vibe does not make a physical action happen. Asking permission to search and performing that search are separate. [F §§06–10; V2P ES-D01–ES-D03.]

## 1.4 Last Collection: the situation

You are collecting **Nera Vale’s green instrument case** from a small transport office. You carry a valid collection ticket. The case is not on its usual rack, and an entry says “collected.”

**Tamsin**, the duty clerk, knows the paperwork and release procedure. She values a defensible handover, Nera’s privacy, and avoiding embarrassment. **Orrin**, the baggage handler, knows the physical handling and his own work for Nera. He wants payment, recognition, and workable relations. **Nera** is absent but remains the owner; her instructions, past payments, and relationships matter.

The player’s actual task is **recover the case**. There is no requirement to expose every secret, settle every grievance, or earn everyone’s affection. Names, the green case, and the existing two story arrangements are retained as working content; exact profile numbers remain adjustable. [v1.0 §§11–12; LC-D01–LC-D09.]

| Person | Understandable concern | A possible mistaken conclusion |
|---|---|---|
| Tamsin | Correct collection and private customer information. | The collector wants more access than the errand requires; or a depot payment settled a separate hauling job. |
| Orrin | His work and account should not be dismissed. | A wrapped case leaving its rack must have been collected through favoritism. |
| Nera | Her property and private information remain hers to control. | No new offscreen conclusion is simulated unless she actually learns something. |

## 1.5 Privacy: the player can ask a reasonable question

Nera’s file contains the case-handling section and her private contact information. At the start, the player does not know that organization. Asking for paperwork concerning the case is legitimate.

Tamsin may initially hear a broader request than the player intended. She explains the split and offers relevant access. That first ordinary request creates **no grievance, serious restriction, or use of the repair opportunity**.

The interesting risk comes later. A player might ask where Nera is, then insist on seeing the full file even after a relevant extract has been offered. Tamsin can become concerned about the pattern. She may still be wrong about the player’s purpose. Her interpretation cannot alter the historical message from “requested case paperwork” into “demanded the address.”

The address is never necessary for recovery. A request for it and actual disclosure of it are also different outcomes. [LC-D06.]

## 1.6 Two coherent starting arrangements

### Seed A — The protective shortcut

Tamsin moved the case to dry storage after a spill. Her “collected” entry began as office shorthand for collected from the rack, not an intentional false claim that an authorized recipient took it. She later becomes evasive about what happened. The original mistake and later concealment remain different events or judgments.

Orrin saw a wrapped green case moving toward the partition. He did not see the damp seam, final cupboard, or Tamsin’s purpose. The missing recipient signature, a numbered drying tag, and his limited account point toward internal handling rather than completed collection. The separate hauling obligation is already paid.

A firm evidence-based approach and a considerate correction route should both work. Paying a nonexistent collection charge is not required. Tamsin declines an ordinary offer of extra collection money; she does not automatically accuse the player of bribery. [LC-D08–LC-D09; v1.0 §12.2.]

### Seed B — The private hold

Orrin put the case in his locker because Nera owes him six coins for a separate hauling job. The authored office rules do not allow him to withhold the case for that private debt. Tamsin saw a depot charge paid and mistakenly treats that as proof that everything was paid.

The depot receipt and hauling note refer to different obligations. A handling stub connects the case’s movement to Orrin’s locker section. Information from people and records establishes the relevant facts; the player is not handed the answer by an inspector label.

The player can pay the real named claim on Nera’s behalf under a confirmed release arrangement. Alternatively, Tamsin can examine the evidence and produce a witnessed written distinction between the charges. Orrin can accept a release that does not waive or settle his claim, because that record gives him what holding the case was really for.

**Why Orrin agrees — DECIDED 2026-10-17.** Until the comparison exists, the office’s own record keeper treats his claim as already paid. Holding the case is the only thing forcing anyone to take it seriously. The witnessed comparison is the first office record stating that his claim is separate and was not paid by the depot receipt. In this seed, his authored top priority is **recognition of the claim as real and outstanding**; payment is a strong but secondary priority, and workable relations come after that. So the trade he accepts is: leverage for recognition. He keeps the claim against Nera and gives up only the hold on her property. Exact priority values remain tunable, but this order must hold in the official Seed B fixture, or the nonpayment route loses its reason.

The witnessed record does not create the debt, make the player liable, guarantee Nera’s payment, or function as a legal ruling. Any completed-handover statement becomes true only when the case changes custody. [LC-D07–LC-D08; v1.0 §12.3.]

## 1.7 The fun loop

**Learn → interpret → choose whom to approach → communicate selectively → read the response → adapt.**

A receipt is not simply a key that opens a dialogue branch. Showing it can correct Tamsin’s belief, make Orrin feel that his work is finally being understood, or provoke an argument if the player uses it to support an incorrect accusation. The player also decides how much to disclose and when to change partners.

Two courteous conversations can create different impressions. Questions about signatures suggest verification; questions about unrelated contact details may suggest a different interest. Someone who recognizes the collection objective may offer help rather than become suspicious. There is no universal suspicion bar and no required sequence of “be nice, then threaten.”

The initial pressure is generous. Reading slowly, editing a draft, changing vibe, switching partners, and watching or skipping performance do not advance the clock. The proposed detailed allowance is grouped with the technical behavior defaults, not hidden in this story description. [LC-D05; ES-D04; §3.13.]

## 1.8 Outcome, not a single moral score

The ending separates recovery, spending, debt status, privacy, and publicly evident relationship consequences. A paid recovery and a zero-cost recovery can both be wins. A strained relationship cannot undo an already completed recovery.

```text
SEED A — CASE RECOVERED
Spent: 0 coins       Remaining: 12 coins
Collection charge: none was owed
Private contact information: not disclosed during this run
Other result: the collection entry was corrected
```

```text
SEED B, PAYMENT ROUTE — CASE RECOVERED
Spent: 6 coins       Remaining: 6 coins
Hauling claim: named payment acknowledged and settled
Private contact information: not disclosed during this run
Other result: Orrin completed the agreed release
```

The Seed B nonpayment ending appears at the end of §1.10. (v2.1 correction: v2.0’s first example mixed a Seed B debt line with a Seed A result, a combination neither seed can produce.)

The exact ending layout is proposed. Unknown debt details are shown as unestablished or as someone’s claim, not revealed from hidden records. Secret trust levels and Nera’s unobserved feelings are not ordinary-player rewards. The author inspector can separately show underlying state. [LC-D02, LC-D08; §3.13.]

## 1.9 Worked play-through — Seed A, recovery after repair

**PROPOSED example using the closing rule in §2.12.** This demonstrates one possible route, not the only successful sequence or a claim of executed gameplay.

**1. Establish the discrepancy.** The player requests collection. Tamsin cites the “collected” entry. The valid ticket is shown through an explicit evidence action; Tamsin can now recognize the collection authority. Neither she nor the player thereby learns every record in the file.

**2. Make the protected ordinary request.** The player asks to see case paperwork. Tamsin explains the file organization and offers the extract. There is no serious concern record and no repair opportunity spent.

```text
TAMSIN — Delivery
Explains that the file includes unrelated customer information.
Offers access to the handling extract for this case.

Access available: handling extract
Collection service remains available.
```

**3. Obtain partial evidence.** The player inspects the extract: there is no recipient signature. Orrin is asked what he saw. He describes a wrapped case moving toward the partition, then offers his interpretation that Tamsin arranged an exception. His account is not certified as a complete event. An authorized search of the handling tray yields the matching drying tag.

**4. Produce a meaningful misunderstanding later.** The player asks Tamsin where Nera is, receives a boundary and a ticket-verification alternative, then requests the whole customer file to check for other instructions. The preview plainly describes a whole-file request. In this example, Tamsin links those observed choices to a concern about unrelated private information; she does not forget the player’s verified collection authority.

```text
TAMSIN — Intake
Closes the file and keeps a hand on its cover.

TAMSIN — Delivery
Restricts handling-record access to a supervised comparison.
Offers that comparison as a way to finish the collection.
Warns that renewing demands for protected customer details will end
collection service for this visit.

[Explain the concern]  [Prepare a reply]  [End conversation]
```

**5. Use the repair episode.** The player asks Why. The preview binds it to the restriction. That clarification does not consume the repair chance. The player then remarks that the request concerns the missing signature and drying tag, and requests the supervised comparison rather than the address. That is a present clarification of scope, not a promise of future confidentiality.

**6. Verify, then collect.** Tamsin offers the bounded comparison. The player deliberately performs it. Only its declared participants receive the compared details. Tamsin identifies dry storage and proposes release; the player confirms the exact zero-payment handover. One operation changes custody and records collection, while Nera remains owner.

```text
CONFIRM HANDOVER
Receive: Nera’s case, as authorized collector
Pay: 0 coins
Ownership: remains with Nera
Private information included: none

[Confirm these terms]  [Cancel]
```

The original shorthand entry remains in history with its correction. Tamsin can remain embarrassed or cautious after helping. Success does not require forgiving or exposing everything.

## 1.10 Worked play-through — Seed B, nonpayment recovery after repair

**PROPOSED example using the same rules.** The nonpayment route must be demonstrated end to end in the eventual build; writing this route is not proof that its incentives are fun.

**1. Hear conflicting accounts.** Tamsin says the recorded payment suggests the account is settled. Orrin explains that his hauling job is separate and that he has the case. The player requests the relevant payment records. The ordinary paperwork request receives the same protected explanation as in Seed A.

**2. Make a correctable factual mistake.** The player presents the depot receipt as though it settles Orrin’s claim. Orrin disputes that interpretation and identifies the distinct hauling note. The player later acknowledges the two charges after inspecting their identities. His original receipt was real; the conclusion was wrong. Correcting it is not proof that the player knowingly lied.

**3. Exercise the privacy risk.** The player asks Tamsin about reaching Nera, then insists on seeing all the file after the extract and a relevant comparison were offered. Tamsin’s supported concern triggers supervised-only access and the explicit warning. This is a later pattern, not the first request being punished to satisfy the example.

**4. Repair by giving a practical reason and narrowing scope.** The player identifies the two charge references and accepts a comparison limited to them. Tamsin revises her interpretation enough to provide that route. Neither she nor Orrin learns the other’s private conversation by magic; the player has deliberately carried the relevant information between them.

**5. Prepare the nonpayment record.** Tamsin examines the permitted documents and writes a witnessed comparison of what they establish. It can state that the depot payment concerns a different charge and that the hauling balance is reported or supported as unpaid. A separate handover section is still a draft. It cannot already say that the case has been returned.

```text
WITNESSED COMPARISON — AVAILABLE TO SHOW
The depot receipt concerns the depot charge.
The hauling note concerns Orrin’s separate work for Nera.
The attached evidence supports an outstanding hauling claim.
No payment guarantee or new obligation is created.

HANDOVER SECTION — NOT YET COMPLETED
To be completed only if the agreed release occurs.
```

**6. Give Orrin a reason to agree.** The player shows the comparison and proposes release without payment, with a handover record that does not represent the claim as settled. Until now, the office treated his claim as paid, and holding the case was the only thing making anyone take it seriously. The comparison is the first office record that his claim is separate and outstanding. Because recognition of that claim is his top priority in this seed (§1.6), he gets what he was holding the case for. He keeps the claim; he gives up only the leverage. The player does not gain obedience merely by citing ALLOWED.

```text
ORRIN — Intake
Reads the comparison line about the hauling note twice.

ORRIN — Delivery
Agrees to release the case, provided the handover record
states that his claim remains open.
```

**7. Confirm once.** The player confirms the current accepted handover terms. The case changes custody. The completion record now states what happened: no money changed hands and the hauling claim was not settled. A defined supervised handover can make Tamsin a witness to that physical event without making her a listener to every private negotiation.

```text
CASE RECOVERED
Spent: 0 coins       Remaining: 12 coins
Hauling claim: not settled by this handover
Record: release completed without payment; existing claim retained
```

**Payment alternative:** The player instead offers six coins credited to the named hauling obligation in exchange for immediate case release. Only exact accepted confirmation performs payment, release, and settlement together. No private contact information is part of either route.

## 1.11 How this work developed

| Stage | What it contributed | What it does not require now |
|---|---|---|
| Earlier PSG, Functional Behavior, DPA, BASED, and TPL work | Separate meaning, aims, routes, expression, perception, interpretation, and traceable causes. DPA means Deal, Pressure, Ask. | Implementing an entire historical semantic system before one encounter works. |
| Marcus/Trapstar experiments | Information as leverage, expressive characters, and awareness differences. | Reusing setting-specific characters, economies, or action controls as neutral core rules. |
| Encounter Core v0.1.0 | A neutral offline authoring baseline, mixed exchanges, validation, explicit confirmation, and rank-based beliefs. | Pretending the richer mechanics are already implemented. |
| Verb/card draft revisions | Fifteen typed relationships, distinct ownership/custody, caused reactions, editable profiles, layers, and separate needs. | Treating inherited numerical suggestions as final balance. |
| Locked encounter experience | Offer/Request/Remark; player preview; unified NPC Intake/Delivery; human-player asymmetry. | A separate player Intake control or a pose for every vibe. |
| Dialogue/skeleton review and workbook | Meaningful placeholders and 32 indexed questions about contracts and scope. | Reopening every question at every review. |
| Perception discussion | Replace a percentage-of-event idea with the actual details available to each NPC. | A full sensory or stealth engine. |
| Four scenario proposals | Compare Last Collection, Before the Notice Goes Out, The Guest Who Left Twice, and The Bell Must Stay Quiet. | Building all four scenarios. |
| Owner selection and subsequent reviews | Property recovery with privacy, independent side outcomes, fair repair, nonpayment, generous pressure; then concrete first-build decisions. | A universal suspicion meter or a moral score for payment. |
| This v2 revision | Records LC-D01–09 and ES-D01–10, reconciles the approved review clarifications, and supplies proposed contracts plus gated kickoff briefs. | Authorization to launch builders or treat pending defaults as approved. |
| v2.1 revision and owner approval (2026-10-17) | Approves CR-01 and PD-01–PD-12, adds the closure preview notice, makes Orrin’s Seed B motive explicit, and corrects an example ending. | Authorization to launch builders; sending a brief is still a separate owner action. |

The older source reset rules, direct incoming-vibe reaction lookup, optional treatment of perception, and ambiguous “three names” heading are not active design rules. Appendix D records their replacements. [v1.0 §§3–4; F §§04–05, 29; G semantic/social lineage; C review and authorization.]

<a id="part-2"></a>
# Part 2 — Design rules

The rules below explain what must stay consistent while different characters behave differently. Exact programming field names and the remaining starting policies are separated into Part 3 so they cannot silently replace approved behavior.

## 2.1 The encounter loop and control boundary

**DECIDED — historical D-03–D-12, D-21–D-23.**

```text
Player initiation:
compose → preview → send → NPC Intake → NPC Delivery → player control

NPC initiation:
NPC Delivery → player composes/previews/sends → NPC Intake → NPC Delivery
```

An NPC opening is an actual outward communication and must be logged and routed accordingly. It does not cost the player a second automatic turn. A response can contain an explanation and a follow-up, but cannot force the human to answer or launch an unbounded NPC-to-NPC conversation.

Intake and Delivery are phases of one response. Each contains one complete body-and-face performance or a short sequence. The final posture may persist. Missing artwork uses a description. Missing authored wording uses a message skeleton. Deliberate silence is its own response choice, not a failed lookup.

Ordinary **End** stops a conversation. Refusing a request, limiting an action, closing the collection service, and finishing the scenario are different operations. Changing partners does not erase significant history or automatically end the investigation. Playback never changes facts, accepted terms, clock, or rewards. [F §06; v1.0 §§5, 17.]

## 2.2 The human player participates without a simulated mind

**DECIDED — D-09–D-10, D-13, D-25, ES-D03.**

The player has an identity, inventory, permissions, possible obligations, and information that the interface actually presented. NPCs can feel SOFT, SORE, TRUSTS, or FEARS toward the player. These are NPC-owned relationships, not a second machine-controlled set of player feelings.

No system record may assert the human’s true private objective, sincerity, desired relationship, or emotional state. The scenario’s recovery goal is an objective rule, not a player AIMS_FOR entry that NPCs may inspect. Selected BASED records the performed tactic. An NPC’s conclusion about that tactic remains local and fallible.

NPC policy cannot inspect unsent drafts, mouse hesitation, hidden objectives, unshared player vocabulary, other private conversations, or future choices. Player-facing availability must not disclose which NPC secretly knows an answer. A setting can add physical rules, but cannot bypass these information boundaries merely by calling them a host feature. [F §§11.1, 20–22.]

## 2.3 Three families, six first-build communicative actions

**DECIDED — ES-D01; D-19–D-23.** The families organize the controls; the six actions define the required coverage catalog. They are not six new foundational ledger verbs.

| Coverage code | Reusable act | Main family | Required content and first-scene example |
|---|---|---|---|
| A1 | Ask whereabouts | Request | Known subject; requested location information. Ask where the case is. |
| A2 | Challenge a record | Remark | The record/claim being challenged and the specific discrepancy or uncertainty. Challenge whether “collected” proves handover. |
| A3 | Present evidence | Remark | An available evidence item or report, the portion shown, and what it is offered to support. Show the depot receipt, not the entire customer file. |
| A4 | Acknowledge a grievance | Remark | The person’s communicated concern and the scope of acknowledgment. Recognize Orrin’s separate work without promising payment. |
| A5 | Request access | Request | Target, scope, and requested permission or bounded assistance. Ask for the handling extract or a supervised comparison. |
| A6 | Propose an exchange | Offer | Exact parties, what each gives/receives, and any named settlement. Propose payment-and-release or documented nonpayment release. |

Contextual Why/Yes/No and destination answers, normal End, exact confirmation/cancel, and scenario actions are supporting operations, not additional rows secretly multiplying the 360-case target. A witnessed-note preparation or supervised comparison is a bounded scenario service, not a seventh universal conversational family.

Acknowledging a grievance does not necessarily agree with every factual allegation. Presenting a document does not transfer its ownership or custody unless exact exchange terms say so. A request is not a permission grant. An offer is not execution. [F §§07, 16; W Q01–Q04.]

## 2.4 Keywords and context

Keywords identify subjects: Nera, Case, Collection Record, Receipt, Hauling Claim, and a contact-information topic when it has been mentioned. Learning a subject does not reveal its value, location, hidden aliases, or every fact connected to it. Separate obligations remain separate even when both are displayed as payments.

**DECIDED 2026-10-17 — Sign-off B, PD-01/PD-02.** Learn vocabulary from explicitly discoverable outward references and seeded starting knowledge. Do not parse finished prose to invent grants. The composer can show compact refiners when a keyword supports several meanings. Ambiguous material intent stops Send until the player selects the intended meaning; the NPC never receives that unfinished draft.

A short reply binds to the most recent compatible act, with the reference visible in preview. Two equally plausible material references require a compact choice. An older compatible target can be selected explicitly. After a partner change, a reply cannot silently bind to the former partner’s question. Conversational Yes never confirms a material exchange.

Why follows a permitted reason or explanation link, not a complete private policy trace. A first build can show one relevant reason at a time and allow the NPC to refuse. Source cycles and repeated equivalent requests are detected; this is a processing bound, not a universal number of questions before failure. [W Q03–Q04, Q20; F §§09–10.]

## 2.5 BASED makes meaning; it is not a hidden listener control

**DECIDED — ES-D01–ES-D03; D-08, D-11–D-12.**

B is Belligerence, A Aggression, S Sociability, E Empathy, and D Deception. Pair order matters. The twenty names and shared framing examples are in Part 4. Their inherited fusion definitions remain there for traceability.

A chosen vibe can change the communication from a measured challenge to a demand carrying an asserted consequence. The full intended message is previewed. It cannot silently change the item, amount, addressee, accepted terms, or physical act. A promise, concession, or threat must be represented explicitly if the supported message includes it.

| Salience | Shared meaning | Invariant |
|---|---|---|
| Subtle | Understated or indirect social framing. | The substantive act and material terms remain intact. |
| Nuanced | Clearly conveyed but measured framing. | Not an arbitrary blend of vibes. |
| Overt | Strongly foregrounded or explicit framing. | Not automatic detection of deception or compulsory compliance. |

The first-build assumption is that the substantive direct request is received at each setting by its addressed listener. Recognizing its social implications can depend on the outward prominence and the listener’s available context. This is not a general hearing simulation.

### Reconciliation with the old reception tables

**The runtime must not index an incoming reaction by the other speaker’s hidden selected vibe label.** This supersedes direct label-based deltas and “sees through the selected vibe” bonuses from the earlier executable and draft tables. Appendix A preserves those values as historical material, not active code instructions.

The message compiler may privately use the player’s chosen vibe to construct a complete outward act. A listener then evaluates observable requests, assertions, challenges, displayed concern, implications, prominence, and context. Character preferences can favor or dislike those observed patterns. A supposedly “observable feature” must not simply rename one secret vibe ID or reveal concealed sincerity.

**Distinctive is allowed; hidden is not — v2.1 clarification of the existing rule.** An outward cue may be produced by only one vibe and still be a legitimate listener input, because the listener actually perceived that performance. For example, only Feigning adds an outward invitation to rely on displayed concern; a listener may notice that invitation and dislike it. What is forbidden is any listener input the listener could not have perceived:

- the selected label itself, under any name;
- the human player’s sincerity, private motive, or true objective;
- a field, ID, template name, asset name, cache key, or random seed that carries either of the above;
- a cue with no matching performed content, such as a `feigning_style` flag that changes nothing the listener could see or hear.

**Test:** two messages with identical performed content must produce identical listener results (LC-T47). Two messages with different performed content may produce different results, even when only one vibe ever produces that content. This sentence governs how LC-T46, LC-T47, and LC-T67 are judged; it does not change ES-D03.

An NPC’s own expression generator may choose its own outgoing BASED privately, using its own profile. The restriction is on access to another speaker’s private selector and on leaking diagnostic labels to the player. This preserves the historical requirement that NPCs also express themselves through BASED without restoring incoming mind-reading.

**PROPOSED builder detail:** Retain whole-vibe authoring presets only as a preview/generation convenience mapped to shared outward preferences. Conflicting presets that describe the same outward pattern must be reconciled explicitly; no one-to-one hidden reaction lookup may remain underneath. A minimal Assembler does not need this broad preset editor before M2. [V2P ES-D03; C review clarification 3; v1.0 §10 and Appendix A, superseded in this respect.]

## 2.6 Deception, inference, and useful differences

A deceptive tactic is a chosen performance, not an authoritative diagnosis of the human. Its usefulness must arise through communicated content or behavior and the listener’s beliefs.

**Bluffing:** Represent specified leverage or evidence not demonstrated to the listener. “Not demonstrated” is not the same as “false.” Actual world records can establish falsity for resolution or diagnostics; the listener learns it only through accessible evidence. A bluff cannot create a complaint, item, witness, or authority.

**Predatory:** Shape the act around a concern actually learned by the player. Lack of that prerequisite is explained using the player’s available information; hidden concerns cannot be surfaced to make the option work.

**Insinuating:** Supply an indirect connection the player can preview. It may be recognized, missed, or misread. An NPC can confront or resent the implication, but it never becomes an unrecorded contractual promise. “Supported implication” means the grammar represents it and its references are available, not that the suggested conclusion is guaranteed true.

**Feigning:** The approved request example performs concern and adds the outward implication that the display is a reason to trust or accommodate the speaker. For A2–A4, apply the same principle to the performed challenge, evidence, or acknowledgment; do not insert an unrequested new ask. For example, presenting evidence can also perform shared concern and imply that this alignment makes the offered account especially worth relying on. That implication is something the listener can assess, not a “fake” flag.

**Compassionate messages may include requests and useful purposes.** Concern plus an ask is not automatically manipulative. A Feigning example and a Compassionate example should have useful outward differences across supported uses, but need not cause different immediate responses in every context.

All Deception-following vibes—Extortive, Hustled, Coaxing, and Deflecting—obey the same boundary. A pressure tactic cannot hide exact exchange terms from the human preview. Outward urgency can discourage scrutiny without mechanically suppressing the explicit confirmation requirement.

The equality test holds the complete outward information, listener, relevant prior state, context, and controlled variation state constant. Changing only the inaccessible selected label must not change the NPC’s response or future observable trace. It does not require different NPCs or changed circumstances to react identically. [ES-D03; C review clarifications 4 and 6.]

## 2.7 Ledger vocabulary and identity

The ledger records reusable relationships rather than a custom action verb for every story event. A **slot** is a labeled place for one kind of information; **record identity** determines when two entries concern the same question or obligation.

**DECIDED scope:** Preserve the fifteen-verb working vocabulary and typed distinctions. Its implementation fields are proposed in Part 3; a complete promises or autonomous goals engine is not implied. [F §§11–13; v1.0 §7; V2P Part 2.]

| Verb | Kind and required meaning | Same current record when | Key safeguard |
|---|---|---|---|
| HOLDS | Exact amount of an item or goods type held by an actor/container. | Same holder and item/goods type. | Custody is not ownership; unique items cannot be duplicated across holders. |
| OWNS | Owner-valued switch: actor, group, none, or declared shared set. | Same thing. | Competing owners answer the same slot; theft does not transfer title automatically. |
| OWES | Named obligation, debtor, creditor, resource/service, amount and due scope. | Same obligation ID. | Two charges between the same parties remain separate. |
| PROMISED_TO | Promise identity, participants, act/duty, due scope, open/kept/broken/released status. | Same promise ID. | Release is neither fulfillment nor breach; unsupported future commitments stay unavailable. |
| MEMBER_OF | Person, group, member/neither/barred, rank or roles. | Same person/group. | Membership is not affection, loyalty, or every possible permission. |
| ALLOWED | Person/group, act/place/goods/topic scope, authority, allowed/unset/forbidden. | Same subject, scope, and authority. | Permission is not performance; authority precedence needs declared policy. |
| SOFT | Positive feeling toward a target, with caused contributions. | Same feeling subject and target; distinct causes contribute. | Does not imply truth acceptance. |
| SORE | Resentment toward a target, with caused contributions. | Same subject/target and cause accounting. | Can coexist with SOFT; does not itself choose revenge. |
| TRUSTS | Reliance on a person/group’s word or reliability. | Same subject/target and cause accounting. | Not legacy conversational trust, friendliness, or a reward for flattering delivery. |
| FEARS | Fear of an actor/group. | Same subject/target and cause accounting. | Not hatred, obedience, or automatic scene closure. |
| NEEDS | Need identity, what, intensity, optional quantity/deadline, completion behavior. | Same need ID. | Gratitude is attributed once to the relevant satisfaction, not each conversation. |
| AIMS_FOR | Actor and goal, active/inactive. | Same actor/goal. | A goal is not a full planner; do not assign a private human-player goal. |
| BELIEVES | A holder’s belief represented as information about one inner assertion, with certainty/source. | Same holder and inner assertion question. | One level deep; ordinary knowledge and hypotheses use linked records, not recursive belief stacks. |
| IS | Declared subject/property/value with the property’s type and multiplicity. | Same subject/property/applicable time. | Location, condition, and count are not interchangeable untyped strings. |
| HAPPENED | Actual event identity, type, participants, time/context, and caused effects. | Same occurrence ID. | A reported nonexistent event is an allegation, not an executable occurrence. |

PERCEIVED is the additional first-class concept with linked records under ES-D05. It does not disappear because the inherited predicate registry still has fifteen rows.

**Switches** hold a position or owner. **Dials** hold a strength. **Amounts** hold an exact quantity in declared units. NEEDS can combine a dial and amount; IS follows its property type; HAPPENED is a historical occurrence rather than a switch/dial/amount. Legacy evidence ranks 1/2/4, draft certainty 1–5, relationship points 0–100, and cue scores 0–5 are different domains.

**PROPOSED representation:** Give the unique case one immediate physical holder, such as dry cupboard or locker. A container has a location and a responsible custodian. Derive an actor’s offerable custody from the declared control/permission links rather than recording a second HOLDS count for the same unique item. After release, the player is the holder; Nera remains owner. Containers are world entities, not extra simulated characters. Validate container links for cycles.

Truth, time, sources, sharing, and valuation attach to their appropriate records. A character may assert a false statement or know an old location. Contradictions concern incompatible answers for the same scope and time, not just two strings mentioning the same person.

Flavor names may relabel a core relation: LOCATED_AT can mean IS/location; FORBIDDEN can mean ALLOWED/forbidden. Do not store them as independent competing facts. Derived ideas such as warmth, urgency, and loyalty can use existing causes rather than add redundant meters. The inherited loyalty and warmth formulas are optional policy ideas, not human-behavior laws. [F §§11–15; R21 Part 1.]

## 2.8 PERCEIVED, claims, belief, and evidence

**DECIDED — ES-D04–ES-D05, ES-D03.** A linked observation records the observer, source event, received details, and relevant channel/time. Beliefs and knowledge point back to that lineage; a separate editable “knows because saw” flag must not contradict it.

Hearing “Orrin took the case” is an observation of a claim. It is not observation of the taking. Seeing a wrapped case move is not observation of the contents, destination, ownership, or motive. Missing a detail does not imply the detail is false. Recognizing a face can also be mistaken; first-build ambiguous descriptions must not disclose the hidden canonical identity.

The runtime can store all records centrally. That does not make them available to every NPC. Source links exist for bookkeeping; the NPC’s read functions cannot follow them into concealed fields. A note can have authentic marks yet support only its stated charge, not every conclusion the player attaches to it.

Actual world facts, delivered claims, current beliefs, and hypotheses about behavior remain separate. An NPC can hear a claim and reject it, believe it and withhold it, or be mistaken while speaking honestly. Proving an account wrong does not establish deliberate deception. An NPC may form that attribution only from its own permitted evidence, and may later revise it.

**DECIDED 2026-10-17 (Sign-off B):** The exact evidence-acceptance policy is PD-05 in §3.0/§3.3. It chooses one consistent strong-but-not-infallible policy rather than retaining the source conflict between conclusive proof and modified certainty. No observation system can be repaired by confidence arithmetic after it has leaked hidden facts. [W Q07, Q09–Q12, Q24; F §§11, 21.]

## 2.9 Characters, relationships, and the bounded observer

A character card brings together identity, groups, own expressive tendencies, temperament, priorities, needs, directed relationships, evidence links, and present conditions. The card links to shared records rather than duplicating mutable world truth.

Group, personal, and situational influences remain part of the design. The inherited layer order is base → numeric adjustments → named-setting precedence → pins. A generated value may be replaced by author editing; a pin deliberately prevents later nudges. Ordinary edits are not pins. Detailed multi-layer generation is not required in the four-area Assembler, but stored author values must not be destroyed. Historical formulas are in Appendix A, not approved runtime balance.

Long-term SOFT, SORE, TRUSTS, and FEARS differ from immediate receptiveness, tension, and patience. Tension does not mean a particular emotion. A tense NPC can be helpful; a relaxed NPC can refuse. Default home/calm/cornered tendencies do not limit an NPC to three expression modes.

### Three required interpretation examples

**DECIDED — ES-D04.** Each instance is bound to roles, known subjects, and the NPC’s evidence, never a literal character-name test.

| Interpretation | Supporting observations | Weakening or corrective observations | Available consequence |
|---|---|---|---|
| Collector seeks unrelated private information. | Continued full-file requests after the extract and scope explanation; related volunteered location questions. | Accepts relevant extract/comparison and identifies the handling issue. | Probe, restrict broad handling, then restore a relevant route if corrected. |
| Collector is resolving a handling error. | Compares ticket, missing signature, and movement account. | Later insists on unrelated information without explaining its relevance. | Offer verification or ask what is actually needed. |
| Collector dismisses unpaid work. | Claims the depot receipt proves the hauling job was paid, without examining the distinct note. | Recognizes the two charges after seeing the support. | Reject the argument, then reconsider the witnessed-record arrangement. |

An answer to the NPC’s own question is not automatically fresh volunteered interest. A conclusion cannot generate new evidence for itself. Repeated paraphrases of one source are not independent corroboration. Individual hypotheses may have support levels; those are not a global suspicion meter.

**DECIDED 2026-10-17 (Sign-off B):** PD-03 uses small rule templates with attributed evidence and correction, while §3.4 gives a precise bounded first policy. PD-12 recommends response eligibility before priority comparison. A response must fit known facts, current access, exact terms, and the communicated act; personality cannot bypass those boundaries. A stable tie rule keeps fixed runs reproducible. The decision can produce help, probing, disclosure, refusal, bargaining, restriction, silence, or End. Helpful recognition is a required case, not a bonus polish feature. [F §§17–20; W Q05–Q08.]

## 2.10 Events, reactions, needs, and continuity

Actual events update authoritative state. Reactions occur when a particular character receives relevant information and interprets it. Every relationship contribution cites its cause and applicable belief, so corrections can withdraw or redirect that contribution without rewriting history or assuming universal forgiveness.

The inherited recipe vocabulary includes movement of amounts; obligation creation/change/closure; switches and ownership; IS properties; rank/roles; adding/withdrawing/redirecting dial contributions; validity windows; need creation/completion; promise status; and named settlement at confirmation. These describe reusable operations, not an unrestricted scripting language. This first build only exposes the subset its declared actions use. Saying “a theft occurred” does not execute a theft recipe.

Need satisfaction may cause gratitude. TRUSTS changes only for reliability evidence. A gift, completed need, and kept promise cannot independently award the same gratitude three times. New need identity distinguishes a genuinely recurring need from restarting a conversation.

Saved observations, relevant beliefs, hypotheses, caused relationships, verified authority, and visit restrictions survive partner switching. A copied state can preserve current receptiveness/tension/patience without making them permanent forever. PD-12 recommends no passive cooling during this short run; explicit corrections and new events can change them. Future time-based recovery remains outside this first fixture policy. [F §§14, 18; v1.0 §§9–10, 16.]

## 2.11 Negotiation and witnessed records

**DECIDED — LC-D04, LC-D07–LC-D08; ES-D01.** Propose terms, let the NPC accept/counter/reject, then explicitly confirm current accepted terms. Related material effects occur together or not at all. A “settlement” label never forces agreement.

Payment in Seed B is six coins from the player to Orrin, credited to the named hauling obligation, with immediate case release. Nera remains the debtor on the historical obligation and the owner of the case; the player paying on her behalf does not create an automatic reimbursement debt. The paid depot charge and the outstanding hauling amount must not be conflated.

The nonpayment comparison note can be issued before release if it describes the evidence accurately. Its completion section is a draft until handover. The final record states no payment and no settlement; it does not alter the existing debt. Tamsin’s witness role grants no new legal authority. Whether Orrin accepts is a response-policy question constrained by the required reachable route. His reason is fixed by the approved Seed B motive in §1.6: recognition of his claim as real and outstanding ranks above payment, so a record that ends the office’s treatment of the claim as paid is worth more to him than the hold.

The record can be a disclosed piece of information or a generated document item under a declared local action. “Document creation” must be one supported operation, not a text renderer secretly adding a fact or item. A receipt of actual handover is a generated result of confirmation, not an action that must be separately bargained for afterward.

Information is not consumed by disclosure. Showing evidence differs from giving the object. An offer may identify information without revealing private contents before confirmation; public proposal descriptions cannot expose protected values through labels or valuation. Repeatedly presenting known information does not recreate exchange value.

An intelligible offer of ordinary payment in Seed A is socially declined, not a malformed command. The refusal can be recorded as received communication, while money remains unchanged. A payment offer to evade privacy explicitly means something different and must be previewed as such. [LC-D07–08; F §16; W Q13–Q15.]

<a id="closing-rule"></a>
## 2.12 Exact restriction, repair, and closure rule

This rule determines when a recoverable misunderstanding becomes a loss of collection service. It does not punish ordinary questions, change the human’s intent, or confuse an NPC’s private concern with a proven accusation.

**DECIDED — Sign-off A; policy CR-01, approved 2026-10-17 with the preview-notice amendment in part C2.** The safeguards in LC-D03, LC-D06, and ES-D10 were already decided; this precise visit-long episode is now the approved rule.

### A. Conditions for the serious restriction

The same NPC must have received all relevant support. The default template requires an already-delivered explanation that case handling and private contact information differ, an offered viable case-only alternative, a renewed request for the protected/full-file scope, and another distinct relevant observed interest such as asking where Nera is. An ordinary initial paperwork request is explicitly excluded. No combination is satisfied by private drafts, the other NPC’s unshared conversation, a hidden vibe ID, or an unseen seed field.

This forms a fallible concern, not certainty of malicious intent. Tamsin responds by requiring supervision for further relevant-file inspection. She explains the available comparison, asks the player to identify the relevant scope, and delivers an explicit warning. Previously private contact information remains private; it was never generally available permission that the player has now lost.

### B. The single repair episode

The episode is a state of the visit, not the next mouse click. The warning and a short reminder remain available in the normal conversation record. Reading, drafting, previewing, changing partners, ending the current conversation, clarifying the warning, and technically rejected commands do not consume the episode.

A substantive correction resolves it when it does one of the following through a supported message: accepts the already offered case-only comparison; identifies the handling discrepancy and limits the current request to the relevant extract; or supplies newly inspectable evidence that establishes why the proposed scope is relevant and permitted. The character must actually receive the correction. A vague apology or a polite tone alone does not automatically satisfy it, but neither is a further breach.

Resolution reopens the appropriate recovery route. It does not disclose the address or erase every unrelated grievance. Record the repair as used once for this concern in this visit. Do not grant a reset by closing and reopening dialogue.

### C. The warning’s exact meaning

The default public skeleton communicates:

```text
Tamsin limits further handling-record access to a supervised comparison.
She offers that comparison so the collection can still be completed.
She warns that renewing a demand for protected customer details, or
asking her to bypass that boundary, will end collection service for
this visit. This boundary still applies after a clarification.
```

The player receives that warning at the mechanical response commit and can read it afterward. Watching an animation is not a condition for receiving the rule. The text is an observable placeholder, not final authored dialogue.

### C2. The preview notice — approved amendment, v2.1

Once the warning in part C has been delivered, any draft to Tamsin that would meet closure conditions 4 and 5 below must show a plain notice in its preview, before Send:

```text
PREVIEW: Requests the whole customer file, including details outside
the case-handling section.

⚠ Tamsin warned that renewing this request will end collection
service for this visit.

[Send anyway]  [Edit draft]
```

**Why:** Without it, a player who forgot the warning could lose the scenario with a single send. With it, closure is always a deliberate choice made after a reminder.

**What it may use:** only the public warning and the player’s own draft and inspected evidence, all of which the player already has. It reveals no NPC belief, hypothesis, or hidden seed fact. It is the one deliberate exception to “a preview does not predict the reply” (§1.3, §3.8), and it applies only to this publicly warned consequence.

**What it does not do:** it does not block Send, rewrite the draft, or offer an alternative wording. Editing the draft or choosing not to send costs nothing (part B). Wording, icon, and layout are placeholders.

### D. Exact closure predicate

Close collection service only when all of these are true:

1. The actual case-recovery success event has not already completed.
2. The serious restriction and viable case-only alternative were actually communicated to the player.
3. The explicit visit-long warning above was delivered in an earlier committed response.
4. A later deliberate, intelligible sent message to Tamsin renews a demand for the protected information/full-file scope despite that explanation, or explicitly asks her to bypass the same privacy boundary.
5. That later act supplies no new inspected authorization or evidence that makes the requested scope permitted under the authored rule.
6. That message was sent from a current preview that displayed the part C2 notice. A stale draft refreshes its preview first (§3.2). If the notice was not shown, the message is still delivered and Tamsin may still refuse it, but collection service does not close; the missing notice is logged as a defect.

The closure is a scenario action ending authorized collection service for this visit. It is not a generic refusal, a mood threshold, a particular vibe, or a question quota. It can occur after declining the offered repair or after a completed repair followed by renewed warned escalation. The successful repair does not reset the visit-long warning; that fact was part of the warning itself.

The host marks service closed and routes the outward closure event to its declared observers. Orrin follows the resulting office-service state under the authored scene rules, not by reading Tamsin’s private hypothesis. A previously issued draft record is not a completed case handover, and cannot bypass the closed service. Previously completed recovery remains success and possessions are not confiscated to manufacture loss.

### E. Non-closing cases

| Player action | Required handling |
|---|---|
| First ordinary request for case paperwork. | Explain scope; no serious restriction or repair cost. |
| Why after the restriction. | Explain the appropriate public reason; keep repair available. |
| End or switch partners. | Keep the visit state and warning; do not close collection service. |
| Decline to pay the hauling debt. | Continue valid nonpayment possibilities; payment refusal is not a privacy breach. |
| Challenge Tamsin’s “collected” entry with evidence, even firmly. | Evaluate the challenge; it is not automatically a renewed private-data demand. |
| Perform the agreed comparison but find it inconclusive. | Keep the actual result; technical insufficiency is not intentional escalation. |
| Clearly narrow the request to the handling discrepancy. | Apply the correction and restore the appropriate route. |
| Offer money merely for ordinary collection in Seed A. | Decline payment without automatic bribery accusation. |

**Why this rule:** It makes the boundary explicit, preserves one meaningful correction episode, and keeps ordinary investigation viable. **Tradeoff:** A visit-long warning is stricter than an endlessly resettable repair loop; the persistent public reminder, the preview notice, and the narrowly defined breach are therefore essential. A different choice must retain the already-approved safeguards. No generalized violent-interruption exception is added, because playable theft and combat are deferred. [V2P ES-D10; v1.0 §13; C review clarifications.]

<a id="part-3"></a>
# Part 3 — Technical package

These are the shared forms and processing agreements that stop one part of the program from contradicting another. Each example describes behavior Teddy can review; the builder still reviews exact field names and implementation details.

<a id="defaults"></a>
## 3.0 One grouped owner review, not separate approval loops

A **contract** is an agreement about what information a component receives, returns, and may change. **Sign-off B** approved the behavior of this package on 2026-10-17. Names, file organization, and equivalent internal implementation remain builder-review details, as long as the approved behavior is unchanged.

| ID | Status | Original question | Recommended default | Why / owner-facing example |
|---|---|---|---|---|
| PD-01 | DECIDED 2026-10-17 | O-01 / Q01 | One primary act with a bounded set of explicit qualifications and social framing; validate before Send. | A demand or implication remains visible in preview without a free-form language engine. “Handling page” cannot silently become “whole file.” |
| PD-02 | DECIDED 2026-10-17 | O-04 / Q04 | Most recent compatible act, a visible target, and explicit selection for material ambiguity or an older target. | Why answers the restriction you see; Yes does not buy anything. |
| PD-03 | DECIDED 2026-10-17 | O-06 / Q05 | Small reusable pattern templates, attributed support and correction, and tentative/actionable/corrected states. Retain support for the run; no recursive inference. | Tamsin’s concern can grow and be corrected without a universal suspicion meter. |
| PD-04 | DECIDED 2026-10-17 | O-07 / Q06 | Separate NPC-local observations, factual beliefs, and hypotheses linked by common IDs. One canonical source lineage. | Correcting Tamsin’s guess leaves your actual original question unchanged. |
| PD-05 | DECIDED 2026-10-17 | O-10 / Q10 | Strong but fallible evidence, evaluated once within its observed scope; contradictions can remain disputed. | A depot receipt supports the depot charge, not every debt; rudeness does not make its printed amount change. |
| PD-06 | DECIDED 2026-10-17 | O-24 / Q15 | One active offer for the current partner; discussion preserves it, material replacement/withdrawal invalidates it, End/switch closes it. Exact confirmation remains separate. | Asking about the six coins does not cancel the offer or pay them. Returning after End requires fresh approval. |
| PD-07 | DECIDED 2026-10-17 | O-27 / Q28 | One staged command resolution with a working state copy, a single commit, and cause/duplicate protection. | A failed handover cannot take the money; replaying it cannot pay twice. |
| PD-08 | DECIDED 2026-10-17 | S-01 / Q29 | A common message identity with typed act content, separate private composition, and derived outward/observer/public views. | The player sees their choice; Tamsin never receives the hidden selected-vibe field. |
| PD-09 | DECIDED 2026-10-17 | S-02 / Q30 | Observable act descriptions plus exact terms and control state; diagnostics separate. | Show “declines broad access,” not “hides her guilt.” |
| PD-10 | DECIDED 2026-10-17 | S-03 / Q31 | Short ordered sequences of complete body-and-face units for Intake, Delivery, and held posture. | Missing images still leave two understandable phases and return control normally. |
| PD-11 | DECIDED 2026-10-17 | S-04 / Q32 | A small optional presentation connection, initially returning the approved skeleton; meaning changes go back through validation. | Later character wording cannot add a promise after the rules already resolved the message. |
| PD-12 | DECIDED 2026-10-17 | Connected first-build choices, §3.13 | Explicit local custody/authority, deterministic response selection, persistent visit state, scoped side outcomes, and a generous soft opportunity allowance. | The scene stays coherent across partner switches, and the ending does not expose hidden feelings or facts. |

These recommendations implement the new approved boundaries; they do not ask whether to keep them. O-07’s linked observation direction is already constrained by ES-D05; PD-04 specifies the companion records. O-10 selects the strong-evidence branch and removes the older competing “proof always wins” instruction. Each row is proposed once here, then explained below. [W Q01, Q04–Q07, Q10, Q15, Q28–Q32; V2P Part 3.]

## 3.1 Code organization and ownership

The common rules must work without knowing Tamsin’s name or that the object is an instrument case. The scenario supplies those details; the interface and physical-action connection call the same rules rather than keeping their own copies.

**PROPOSED builder arrangement under ES-D06.** Use a browser-independent typed core, plain scenario data, a local action resolver, and a browser workbench. A TypeScript implementation compiled into an offline browser bundle is a suitable proposal; no library, framework, or package version is selected here. The builder must verify the actual offline launch/export behavior rather than assume modern module loading works by double-click everywhere.

```text
encounter/
  src/core/
    types-and-validation     Shared record types, references, invariants
    ledger-and-events        Facts, custody, obligations, effects, causes
    message-compiler          Families, six acts, BASED → outward meaning
    knowledge-and-views       Observation access, claims, evidence, projections
    observer                  Reusable hypothesis templates and revision
    npc-policy                Eligible response choices and priorities
    exchanges                 Offer versions, approval, exact confirmation
    runtime                   One command and consequence path
    persistence               New-format saves and validation
  src/presentation/
    skeletons                 Public readable act descriptions
    performances              Complete Intake/Delivery/held units
    expression-adapter        Optional future voice/TPL connection
  src/host/
    local-actions             Inspect, search, compare, witnessed-note operations
  src/ui/
    player                    NPC-centered controls and exact terms
    assembler                 Four editable areas and restart workflow
    inspector                 Read-only causal explanations and comparisons
  content/last-collection/
    actors, subjects, documents, actions, policies, performances, outcomes
    seeds/protective-shortcut, private-hold
  tests/
    core, scenario, integration, browser, content-validation
  reference/                  Immutable copies or pointers to the old baseline
```

Filenames are illustrative, not files created by this document. Components may be combined while preserving responsibility. The core cannot import the DOM, renderer, or scenario-specific filenames to decide outcomes. The NPC-policy module receives only a filtered NPC view, not the unrestricted world. The compiler and authoritative validator have wider access for their own jobs but cannot pass private results as listener knowledge.

| State | Owner | Persistence |
|---|---|---|
| Authored package and draft edits | Assembler/content layer | Separate from every run. Changes take effect after validation and restart. |
| World instance and actual events | Runtime/ledger | One authoritative running instance. |
| Observations, claims, beliefs, hypotheses | Knowledge/observer, stored within the session | Individually attributed; visible only through allowed views. |
| Relationship contributions and local pressure | Runtime/NPC policy | Per actor/target/cause; not a player-wide mood value. |
| Active partner, reference focus, pending offer | Encounter/session layer | Explicit End/switch and offer lifecycle rules. |
| Player-disclosed information and vocabulary | Knowledge projection | What was shown, not what the human privately believes. |
| Playback cursor and held pose | Presentation | May resume or fall back without changing mechanical state. |
| Debug explanation | Inspector | Derived from recorded causes; read-only. |

**Baseline map for M0.** The available HTML contains `EncounterBased` (catalog), `EncounterBeliefs` (rank revision), `EncounterCore` (pure engine), and the browser workspace. The world has two fixed actor seats, topic/goods/information arrays, one NPC profile, and a session with status/history/events/pending. Inspect `validateWorld`, `validateIntent`, `normalizeTerms`, `preview`, `send`, `acceptOffer`, `cancelOffer`, `applyWorld`, and `publicView` before reuse. `playerLine` does not implement the new semantic BASED behavior. `send` clears pending on every send; the new PD-06 proposal intentionally differs. The old public view is insufficient for the new hidden-information safeguards. [B named functions; v1.0 §4.]

## 3.2 Message contract

A message record is the single agreed account of what the player sent, not a second version of what the NPC guessed. Its private construction choices and the outward communication have different readers.

**Contract proposal implementing PD-01, PD-02, and PD-08.**

| Required information | Rules |
|---|---|
| Schema version, message ID, source command ID, sender and addressed participants | IDs are neutral and stable; not hidden seed/vibe names. |
| Family, one supported primary act, known subject references and scopes | Validate required slots and compatible additions. False supported claims are not malformed input. |
| Assertions, questions, requested acts, displayed stances, explicit terms, outward cue content | State who is asked to do what. Distinguish an asserted claim from a question and an indirect cue. |
| Context target and preview revision | Do not retarget a sent Why after the fact. A stale draft requires refreshed preview. |
| Private composition | Selected vibe, selected salience, author/template provenance, and the player’s chosen intended framing; no invented human psychology. |
| Outward payload | Substantive act, actual publicly performed wording/semantic cue, observable prominence, and permitted references. No selected vibe or recipe ID. |
| Optional presentation references | Missing wording/art is distinguishable from deliberate silence. Asset identifiers are not passed as diagnostic truth. |

```yaml
# Illustrative record: field names are PROPOSED.
messageId: m_0041
commandId: cmd_0088
sender: player
addressee: tamsin
family: Request
privateComposition:
  selectedVibe: EA
  selectedSalience: NUANCED
outward:
  act: request_access
  target: handling_section
  scope: case_handling_only
  request: inspect_relevant_entry
  framing:
    - establishes_limit: unrelated_customer_details_not_requested
  delivery: measured_and_firm
contextTarget: m_0040
terms: null
```

The listener receives `outward`, permitted participant/reference information, and a neutral source identity—not `privateComposition`. The player may see their own selected controls. The author may see the whole record. An NPC’s outward reply follows the same split when compiled, while its own expressive choice stays private.

An implied relation must have an outward basis. Do not pass an extra `intendedHiddenConclusion` to the observer. For an insinuation, store the actually performed association or question as a cue; the NPC’s template may recognize a consequence from it. The player preview can explain what the human is choosing to suggest without promising that the NPC will recognize it.

A cue such as “expresses concern and invites reliance on that expressed alignment” is about visible communication. A cue called “fake_concern=true” would be a forbidden hidden classification. Template names, IDs, derived embeddings, random seeds, or cached histories must not smuggle that classification back into the listener.

**Reference example:** Why after the restriction targets its public request/reason, not a previous hauling claim. If the preceding NPC response contains two plausible Why targets, the preview asks the player to select one. UI previews and rejected drafts create no NPC evidence and cost no time.

## 3.3 Observation, claim, belief, and hypothesis contracts

An observation stores what arrived; a belief stores what the character currently accepts; a hypothesis stores a possible interpretation. Keeping their identities separate lets a character change their mind without changing the past.

**Contract proposal implementing ES-D05 and PD-04/PD-05.**

### Observation

| Information | Rules |
|---|---|
| Observation ID, observer, source occurrence/message, sequence/time, channel | Link to a real receiving event. Hearing a rumor points to the speech event, not to a fabricated theft. |
| Received details | Explicit allowed subset. Use observer-local descriptions for unrecognized entities. |
| Evidence roots and limited source access | Common roots identify retellings of one source. Source pointers are opaque to NPC code. |
| Apparent limits, only when observed | A sealed envelope can be visibly sealed. Do not expose a list of all hidden event fields. |

```text
AUTHOR EVENT e_0012:
  Tamsin moved the wrapped case from rack to dry cupboard after a spill.

NPC OBSERVATION o_0025, owned by Orrin:
  source occurrence: e_0012 (opaque reference)
  received: wrapped green case; removal from rack; toward partition
  channel: sight

AUTHOR DIAGNOSTIC ONLY:
  final cupboard, wet seam, and purpose were not delivered to Orrin.
```

The NPC does not receive that diagnostic list or access to the source event. A physically visible search similarly reveals conduct without its unread small print. Retellings preserve their root source rather than masquerade as new direct observations.

### Claim

A claim needs its own ID, a proposition or alleged incident, speaker, actual recipients, the communication event, qualifications, and supporting references explicitly communicated. “Orrin says it was privately collected” is a claim even when wrong. An alleged incident can have an identity without a matching actual occurrence. Only an authoritative action result or authored historical occurrence enters the actual event stream as that incident.

An item’s printed statement, a person’s statement about the item, and the engine’s knowledge of its authenticity are different records. Known aliases and event matches are shared only through allowed evidence; string similarity cannot reveal an unknown identity.

### Factual belief

A belief needs holder, question identity, accepted/competing claim references, stance, support level, source roots, time scope, and revision cause. Proposed stances are unestablished, suspected, accepted, disputed, or rejected. A holder can record a received statement while not accepting it.

The common question key identifies an owner for one item, a balance for one obligation, or a property at one applicable time. A depot receipt and hauling note do not answer the same debt question. Seeded mistakes must be marked as initial interpretations with their available basis, not quietly given nonexistent observations. Tamsin’s initial overgeneralization can be revised when the two charge identities are compared.

### Proposed evidence rule, PD-05

Use the inherited 1–5 support scale with **one consistent strong-but-fallible calculation**. The following starting values and the example threshold are tunable defaults approved with Sign-off B (2026-10-17), not calibrated psychological measurements.

| Source actually available to this NPC | Starting support |
|---|---:|
| Unsupported inference or uncertain initial assumption | 1 |
| A received ordinary report | 2 |
| A relevant partial check or genuinely independent corroboration | 3 |
| An inspected document with a recognized mark, for its visible explicit content | 4 |
| Direct perception of the specific fact within the observed scope | 5 |

A reported source with TRUSTS at displayed level 4 or more can add one support step to testimony, not to proof already credited for the same reliability. A concrete accessible contradiction about that source’s accuracy may subtract one step; mere dislike, the selected vibe, or contradiction of an unsupported prior belief does not. Clamp to 1–5. The source trust threshold and adjustment are tunable defaults adapted from the inherited draft; their allowed evidence inputs are narrowed here to respect ES-D03.

For a candidate proposition, use its strongest eligible support rather than adding repeated reports until they become certainty. The level-3 corroboration route requires explicitly distinct roots. The proposed initial acceptance threshold is 3, editable per NPC. Compare candidates answering the same question: a strictly stronger eligible candidate can replace a weaker accepted account; equally strongest incompatible candidates remain disputed; weaker contrary support is retained as a challenge rather than silently deleted. No active credible candidate yields unestablished, not automatically false.

Recognition is an explicit author-supplied, observer-available match—such as seeing the relevant receipt identity or mark—not a lookup of global `authentic=true`. A recognized receipt still proves no more than its scope. A new inspection can change support or show an old assumption used the wrong question key. Store the new revision and preserve the old observation.

**Last Collection example:** The depot receipt supports payment of the depot charge. Comparing its identity with the hauling note undercuts the assumption that it paid the hauling job. Tamsin can accept the distinction without a Menacing delivery making the receipt less true. She can still dislike the threat, distrust an unrelated claim, or decline an unrelated disclosure.

### Hypothesis

A hypothesis needs a holder, reusable type, target/scope, evidence supports, corrective references, current band, response consequences already applied, and revision history. It cannot write a world-level player goal or silently change a sent act.

```text
Hypothesis h_0007, owned by Tamsin:
  interpretation: collector_may_seek_protected_scope
  target: player / this customer-file boundary
  support: actual location inquiry + renewed broad-file request
  contrary support: later relevant-case-only clarification
  current band: corrected
  restriction cause: retained historically, no duplicate application
```

Ordinary knowledge points to these observations and claims; do not maintain another freely editable “how known” field. An author changing starting knowledge edits supported initial observations or interpretations and restarts the seed. It does not patch a live belief secretly. [F §§11–13, 21; W Q06–Q07, Q09–Q12.]

## 3.4 Interpretation template and response-selection contract

A template is a reusable pattern such as “someone may be seeking more access than their purpose requires.” Its instance supplies the character, subjects, and evidence, so the engine never needs an `if name == Tamsin` rule.

**Contract proposal implementing ES-D04 and PD-03/PD-12.**

| Template field | Required behavior |
|---|---|
| Template identity and meaning | Neutral type; no promise that the interpretation is true. |
| Bindings | Observer, target participant, known topic, protected scope, relevant alternative. |
| Supporting patterns | Predicates over actual received acts and known facts; distinguish volunteered from NPC-prompted content. |
| Corrective patterns | Actual received narrowing, comparison evidence, retraction, or appropriate acceptance. |
| Confidence bands | Proposed none/tentative/actionable/corrected; band transition is explicit and inspectable. |
| Eligible responses | Probe, help, limit access, reconsider an offer, or another supported act. Separate from final selection. |
| Cause handling | Root IDs prevent duplicate support and repeated restriction/reward. |
| Retention and bounds | Keep this run’s support; evaluate declared templates once per new relevant event; no self-feeding recursion. |

For the privacy template, an ordinary first request is ineligible for serious concern. A relevant inquiry can make a tentative interpretation eligible for a question. The conjunction in CR-01 makes restriction eligible; the later warning/breach predicate is still separately required for closure. Correction updates the band and the relevant access path. Thus an editable support weight or band threshold cannot bypass fixed fairness guards.

For the handling-error template, matching ticket/entry and movement-account references supports useful verification. A later unrelated demand can weaken that interpretation. For the unpaid-work template, a stated conflation of the two charges supports concern; acknowledging their distinction after receiving evidence corrects it. The actual spoken wording and references must support these features.

Use source-linked sets rather than an endlessly increasing suspicion total. The first templates need only a few named support conditions; the Assembler edits choices and sensitivities within validated ranges. It does not author arbitrary formulas. Initial band and support patterns are proposed content, with structural guards fixed by the decisions.

### How a response is chosen

First remove responses that violate available knowledge, disclosure scope, supported act types, or material availability. Next apply specific visit guards, such as the protected first request and CR-01’s warning requirement. Compare the remaining candidates using authored priorities, needs, directed relationships, current receptiveness/tension/patience, observed framing, and the supported hypothesis bands. Use an explicitly documented stable tie order, not uncontrolled randomness.

An offer’s accepted terms are not rerolled when confirmed. Ordinary reply choice can prepare a new offer or explicitly withdraw one. It cannot reinterpret a technical confirmation as a fresh persuasion roll.

NPCs can choose an opening or a follow-up through the same eligible-response mechanism. At most one bounded NPC response episode follows a player command in the first build. Other observers can revise their local records without starting a cascade of conversations. This limit is an implementation boundary, not a restriction on how many units a short performance sequence can contain.

## 3.5 Offers, confirmation, and document-result contract

An offer records a proposed arrangement, while confirmation performs the current accepted arrangement exactly once. The witnessed note documents evidence; the handover receipt documents an event that has actually occurred.

**Contract proposal implementing PD-06/PD-07 and LC-D07–LC-D08.**

An offer needs a neutral offer ID, offer revision, parties, exact resource lines, disclosed information scopes, named settlement IDs, required permissions/availability, approval status, validity conditions, and source message. Prior revisions remain historical and cannot be confirmed. One active offer belongs to the current negotiation; another offer must explicitly replace it.

Proposed lifecycle: drafted → proposed → accepted or countered/declined → confirmed, withdrawn, superseded, or closed on End. Counters create a visible new version. Acknowledgments and ordinary questions about terms preserve the offer unless the NPC explicitly withdraws it or a material condition changes. End or partner switching closes uncompleted terms but preserves their history. Reopening needs fresh approval. Saving and reloading the same continuing encounter is not End.

```yaml
# Illustrative exact accepted terms; coin precision is declared by the package.
offerId: offer_0010
offerRevision: 2
parties: [player, orrin]
give:
  - resource: coin
    amountMinor: 600
    minorUnitsPerCoin: 100
receive:
  - item: case
    quantity: 1
    effect: custody_to_player
settle:
  - obligation: hauling_obligation
    amountMinor: 600
ownerAfter: nera
privateDisclosures: []
status: accepted
```

Here 600 minor units means six coins. A minor unit is the smallest stored money unit; the 100-per-coin convention is a proposed format consistent with the old exact-money approach, not a new currency requirement for all games. The initial 12 coins are 1200 such units. Arithmetic never uses relationship points as money.

Confirmation names the exact offer and accepted version plus the current expected session revision. It checks balances, item custody/control, relevant authority, named settlement balance, availability, acceptance, and allowed disclosure. The displayed accepted offer revision does not change merely because a harmless Why advanced the session revision; refresh the confirmation’s current-state token instead. A failed recheck returns no partial transfers, document-completion record, or settlement.

A new unsupported amount or unavailable resource in an offer does not become a false world fact. Depending on declared authoring scope, a technically impossible transfer is a validation failure; a valid proposal a character dislikes is a recorded social refusal. Player errors must not reveal unrelated hidden balances or secret item locations.

### Nonpayment variant

The active terms receive case custody with no payment and no settlement operation. A witnessed-comparison document is a prerequisite the appropriate NPC has inspected, not an automatic global belief update. Its final handover wording is a result template populated only from the committed event. The record makes no player debt or promise.

Tamsin’s comparison note can be generated by a declared local `record_comparison` action after she consents and the evidence has been inspected. It states evidence-backed distinctions and identifies what remains a reported claim. It can exist before handover. The separate completion section cannot be signed off as having happened before the actual transfer. A confirmed supervised transfer can produce the completion receipt and declared witness observations together.

Already-disclosed information remains known to its recipients. A proposal to disclose private information does not reveal its contents prematurely. A new label for the same content cannot renew information value. [F §16; W Q13–Q16; ES-D03.]

## 3.6 Physical action request and result contract

A physical request asks the local game layer to do something, rather than merely talk about it. The result reports what actually occurred and who could observe which parts.

**PROPOSED builder contract under PD-07/PD-12.** A request includes command ID, actor, supported action ID, target, evidence of required permission, expected state revision, and any declared cost. A result includes resolution ID, matching request, outcome, actual effects, permitted disclosures, observer-specific visible details, cause IDs, and cost actually incurred.

```text
REQUEST:
  actor = player
  action = inspect_handling_tray
  permission = current permitted inspection

RESOLVED RESULT:
  action performed
  player receives matching drying-tag details in Seed A
  Orrin sees the player inspecting the tray
  Orrin does not receive the unread small-print contents
  no case custody change
```

A local resolver consults authoritative scenario state for the physical outcome. NPC policy never receives that unrestricted input. The core stages and commits the returned effects once; the local resolver cannot mutate the same inventory independently. Each result must match an authorized pending request, contain only declared supported effects, and preserve conservation/identity. Repeated delivery of the same result does not repeat it.

Valid attempts may return success, no useful discovery, or visible refusal. A request rejected before any attempt is not evidence that the player actually searched. The cost policy distinguishes deliberate performed actions from invalid or stale commands. An unchanged unsuccessful search must not reroll a different clue on every click.

Playable actions now are relevant record inspection, handling-tray search, supervised comparison, and the bounded document/handover support described above. A document render is not a physical action. Steal, attack, full movement, and stealth are unavailable in ordinary play. Future hosts can add their own resolvers for actual attempts, hits, misses, custody changes, and observer detail without implying those mechanics exist now.

For future integrations, explicitly choose which side owns each physical change. A remote or combat host may commit its own effects and report them; the local first-build convention is not proof that distributed actions can be committed atomically across every future game.

## 3.7 One update order

A single command can change facts, what someone learns, and the reply they choose. One documented order prevents a character from answering using old beliefs while the screen shows new ones.

**Contract proposal implementing PD-07.**

1. Receive a deliberate command with neutral identity and expected context/revision. Separate preview from execution.
2. Validate shape, references, player-accessible composition prerequisites, and supported act type. Reject stale or ambiguous input without in-world consequences.
3. Check duplicate command/result identity. Return the previously committed result for a true retry; a deliberately repeated message has a new command identity.
4. Make a working copy of the current session. For communication, freeze the approved canonical meaning and outward payload. For physical actions, obtain the matched local result. For confirmation, load the exact accepted terms.
5. Stage the actual initiating occurrence and only its authorized effects. A proposal does not execute its proposed exchange. A claim is recorded as said, not made true.
6. Route eligible outward observations, explicit disclosures, and discoverable keyword references. Preserve source lineage and information limits.
7. Revise affected NPC factual beliefs and hypotheses from their allowed evidence. Update attributable relationship/temporary-state consequences once. A material correction is available to the next response.
8. Select the active NPC’s response from its filtered updated view. Other observers do not automatically become speakers.
9. Compile that response’s outward meaning and compatible complete performance. Stage any supported immediate disclosure, permission grant/restriction, explicit offer withdrawal, document operation, or scenario action. Resolve exact confirmation without a new bargaining roll.
10. Route response disclosures and actual response-action observations; update passive local knowledge once without recursively initiating replies. Apply named need/relationship causes without duplicate rewards.
11. Check invariants and scenario outcomes. Successful recovery takes precedence over a budget warning on the same final handover. A preexisting completed recovery cannot become failure because of a later relationship problem.
12. Commit the coherent session, outcome, and causal trace once. If any staged technical operation fails, commit none of its gameplay effects and return a safe error. Author error logs are separate.
13. Present committed Intake/Delivery and return control. Replay, skip, a view refresh, or missing assets cannot repeat a command or consume time.

A social refusal at step 8 is a valid committed response: the listener may already have heard the claim at step 6. A technical error before a successful commit is not a fictional statement that was secretly uttered. This first build is local and synchronous; an unlimited event-processing network and full event-sourced architecture are not required.

**Worked sequence:** A player shows the two charge records. Tamsin receives only their shown fields, revises the paid-everything assumption, and becomes eligible to offer a witnessed comparison in the same response. Rendering that offer cannot itself mark the comparison or handover as completed.

## 3.8 Player, NPC, and author views

A view is the portion of information a component is allowed to read. Hiding an inspector panel is not enough if a tooltip, error message, or source link still reveals the secret.

**Contract proposal implementing PD-08/PD-09 and ES-D03/ES-D05.**

| View | May include | Must exclude |
|---|---|---|
| Player composition/preview | Own selected vibe and salience; intended supported act; known subjects; exact terms; prerequisite explanation; the CR-01 closure notice when a draft renews a publicly warned request (§2.12 C2). | Secret NPC knowledge, a guaranteed outcome (other than that publicly warned closure), unknown weakness values, hidden file organization before disclosure. |
| NPC decision input | Its actual observations, claims, beliefs/hypotheses, own relationships/priorities, known rules, and outward incoming content. | Sender’s selected vibe/salience controls, deceptive-mode tags, hidden intent, private drafts, other NPC stores, full source events, global seed answer. |
| Player response/history | Outward NPC acts, stated claims, visible performance descriptions, actual disclosed information, terms, control state, warnings. | NPC chosen deceptive label, private motives, diagnostic confidence, secret factual truth, full policy trace. |
| Author inspection | Full world, source/private composition, observer projections, evidence roots, candidate reasons, committed effects, validation errors. | Ability to mutate the live run through inspection or trigger rewards while refreshing. |

Observable prominence may be represented as understated/measured/emphatic characteristics of the performance. This is not passing the selector field under another name with hidden semantics attached. If two actual performances are identical, changing the selected setting alone cannot alter what the listener received.

Public subject IDs need not expose readable secret aliases. NPC-local unknown descriptions remain local until identification is learned. The same rule applies to saved history, cached views, error traces, choice menus, and future expression-provider input.

The source link that an observer can cite does not grant permission to query the full event. Read APIs should return allowed record views and deny arbitrary dereferencing. Authoritative transfer validation may use hidden world state for correctness, but errors should disclose only what the current interaction legitimately makes observable.

This is a logical gameplay boundary in an offline authoring tool, not a claim that all stored bytes are secure from a person inspecting their local file.

## 3.9 Save format and versioning

A save preserves a run; a scenario file describes how a new run starts. Mixing them would let a previous play-through silently become the next seed.

**PROPOSED builder contract under PD-07/PD-12 and ES-D07/ES-D08.** Use separate versioned formats for authored packages and running sessions. Example tags `encounter-package@2` and `encounter-run@2` are proposed names, distinct from the old `encounter-world@1` and `encounter-session@1`; they do not claim automatic conversion.

A session save includes package/seed identity and version; a snapshot of current facts and actual events; individual evidence and hypotheses; relationship causes; player-disclosed information; partner/reference context; current offer with its version and status; restrictions/repair/warning state; opportunity state; outcomes; and committed-command identities needed for duplicate protection. Keep enough record history to explain active causes. No automatic deletion of evidence that would make a repeated rumor fresh again.

Loading validates versions, identities, references, quantities, view boundaries, and active terms before replacing the running state. If the package version differs, refuse silent reinterpretation and explain the mismatch. The first version can save the exact package snapshot or reference a verified matching snapshot; the builder documents its choice. It must not silently substitute newly edited content under an old run.

An accepted continuing offer can be restored and revalidated; restoration does not confirm it. A presentation sequence can resume descriptively or finish from its stored committed result; it does not rerun the decision. Same content, same seed, same meaningful commands and controlled variation state reproduce the same outcome.

Keep a manual export/import path even if local autosave exists. An invalid or unsupported old save remains untouched and can be opened by the old executable. Show a clear compatibility message rather than guessing missing perception history. No automatic schema migration is in scope.

## 3.10 Stable IDs and record identity

An ID is an internal address that survives renaming. Good identity rules prevent a new display label from duplicating a case, erasing a debt, or revealing a secret.

**PROPOSED builder contract under PD-04/PD-08.** Use stable opaque identifiers for actors, containers, unique items, goods types, obligations, statements, questions, claims, events, observations, hypotheses, offers/versions, permissions, needs, commands, response episodes, and performance assets. A neutral prefix plus a generated sequence is sufficient as an example; no particular ID library is selected.

A question key combines the typed relation, identifying slots, and time/scope. OWNS keys by item; OWES by obligation; HOLDS by holder/item; IS by subject/property; a hypothesis by holder/template/target/scope. Causes and evidence roots are separate from the proposition identity. Two beliefs can disagree while both correctly recording what their holders think.

A document has a stable identity and explicit revision if corrected. The original “collected” entry remains a historical version. Two similar incident reports remain distinct until an authored/validated correlation connects them; inference cannot discover identity merely from a secret shared primary key.

**Example:** Rename Orrin to another display name and the hauling obligation still identifies its creditor. Split the depot and hauling notes into two document versions and neither produces a duplicate unique case. A canonical event ID may remain in an observation as an opaque citation, but its private fields are not reachable.

## 3.11 Voice, TPL, and performance connections

Voice and animation express an already selected communication; they do not decide whether a debt was paid. Empty presentation slots therefore need working readable substitutes rather than a stalled encounter.

**Contract proposal implementing PD-09–PD-11.**

| Slot | Required first-build data | Fallback and boundary |
|---|---|---|
| Public mechanical message | Supported act, outward claims/framing, exact terms, control state. | Deterministic readable description from the canonical outward meaning. |
| Character voice | Optional wording reference and allowed expression context. | Use the skeleton when absent. Character voice is phrasing, not necessarily audio. |
| TPL | Optional pacing/emphasis/register treatment. | Plain text. No punctuation-to-secret-emotion codebook. |
| Intake | Ordered complete performance units with public descriptions and optional assets. | Show descriptions; do not infer truth from the pose. |
| Delivery | Complete units matched to the outward response. | Distinguish silent response from missing wording. |
| Held posture | Final complete unit or defined neutral fallback. | Persists without modifying game state. |
| Audio | Optional later matched output. | None required; cannot add different commitments. |

An expression provider receives only approved outward meaning and suitable character-expression context. Its outputs are wording/performance references, not state mutations or newly disclosed facts. A proposed semantic addition must return for compilation, preview where relevant, and validation before resolution. Adding a promise during final rendering is invalid.

For the first provider, use curated templates/skeletons whose slots come from approved data. Structural checks can catch missing terms, invalid references, and unsupported attachments. They cannot prove that arbitrary free-written or generated prose preserves every nuance; such general language validation is not promised. Future wording must be authored/reviewed against the semantic example or fall back.

Assets can be modular in a separate art pipeline, but runtime selection uses complete compatible performance units. A body and face cannot be independently chosen from unrelated emotional labels. Sequence length limits, asset formats, and frame timing are builder details to propose without setting a twenty-pose ceiling. [W Q29–Q32; F §§06, 19; v1.0 §17.]

## 3.12 Reusable consequences across later physical modes

A later adventure or combat system can tell Encounter what actually happened and what was observable. Encounter can then preserve the same knowledge and relationship history instead of replacing a person with a generic enemy.

**DEFERRED execution, preserved connection requirement — D-15, D-28.** Search is the working local example. Theft would require a resolver for attempts, custody changes, detection, and future discovery. Attack would require a combat resolver for attempts, damage, interruption, and recovery. The existing observation and event vocabulary does not implement those physical rules.

A future unseen theft could move HOLDS without changing OWNS or immediately assigning blame. A discovered loss or later testimony could alter an NPC’s belief and resentment. A threat could influence FEARS without an attack occurring. These are boundary examples, not playable commands or a new approved action catalog.

The first tester may exercise a neutral local action-result fixture and verify one-time state changes plus observation filtering. That proves the boundary for supported effects, not a finished stealth or combat system. Declared future effects unsupported by the local resolver must fail clearly rather than appear to work.

## 3.13 Connected default details included in Sign-off B

These choices make the small scene predictable enough to test. They are grouped with the technical defaults because they affect what the owner experiences, not because the owner must program them.

**PD-12 detail package:**

**Pacing.** Recommend a soft allowance of **24 consequential opportunities**, a tunable new starting default. Its initial function is a visible closing-time reminder, not an automatic loss; author mode suppresses the reminder. One completed substantive message, performed physical action, or exact material confirmation normally counts one. Preview, reading, partner switching, End, failed technical commands, and clarification of the active restriction count zero. The repair clarification cannot be lost to a ticking clock. Hard deadline loss remains a later tuning choice for owner review rather than being used to hide weak NPC behavior.

**NPC continuity.** Preserve relevant temporary state and its causes through this visit; no passive cooling or memory decay is needed initially. A correction can reduce the pressure caused by that misunderstanding. A new partner has their own state, not a copy of the other person’s tension. Closing a panel never restores patience or resets the repair episode.

**Custody and authority.** Store the case in one container/holder with explicit control and location links (§2.7). The authored depot role can grant relevant inspection and collection service, not authority to judge Nera’s private debt. The valid collection ticket authorizes collection, not the private address. Once observed and verified, that authority persists unless an actual relevant event changes it. A general grant does not override the explicitly narrower private-information prohibition.

**Records and consent.** Tamsin may offer a comparison note after seeing the distinct evidence. The scenario action creates only the supported comparison. The confirmed handover populates the actual release section. Proposed note wording and a final release record are visibly different. All resource and document effects follow the same runtime path.

**Amounts.** Use integer minor money units with a declared scale; the example 100 minor units per coin is tunable package metadata. The approved starting balance remains 12 displayed coins and the retained Seed B example is a six-coin named hauling claim. Unique case quantity is one. A quantity bound is a validator safety parameter, not an extra story fact.

**Known versus private endings.** Report actual recovery and the player’s spending/remaining balance. Report a named settlement when that was executed under public agreed terms. Otherwise qualify debt status by what was actually established or acknowledged in play. The privacy side record counts actual unauthorized disclosure, not merely asking or composing a request. A secret NPC feeling appears only in the author inspector; ordinary endings may describe what an NPC actually communicated. Nera is not automatically informed.

**Response and evidence tuning.** Use stable deterministic selection among eligible acts. Expose a small set of priorities and observed-framing preferences; no incoming vibe lookup. Record cause-linked relationship changes and tune their magnitude in content rather than silently importing Appendix A’s label bonuses. The initial evidence thresholds and pattern bands in §§3.3–3.4 must be validated through both successful and corrective routes.

**First-build allegation and promise scope.** Support claims and implications over the authored known subjects and bounded incident forms. Do not invent new entities to complete a lie. Keep future promises and broad partial settlements unavailable; the witnessed record is immediate documentation, not a confidentiality contract. A nominal PROMISED_TO type can be retained in the registry without pretending that future fulfillment logic has been built.

**Why this package:** It gives the first prototype enough determinism and author control to identify actual design failures. It does not require full sensory simulation, a complex economy, world-day aging, a living town, or a general rule programming language.

<a id="part-4"></a>
# Part 4 — BASED coverage plan

This plan gives the full expressive vocabulary a finish line without requiring hundreds of disconnected response scripts. The examples are specifications to implement and test, not evidence that any coverage case has already passed.

## 4.1 Preserved vocabulary and reusable social meanings

The names and fusion descriptions below are inherited source vocabulary. The right column proposes reusable outward meanings for the first build; it is not a replacement definition of a person’s emotions. [F §08; v1.0 §6.3; ES-D01–ES-D03.]

**PROPOSED content mapping under the decided vocabulary.** Social meaning components are shared across vibes. Their combinations and emphasis distinguish the performances; the listener does not receive this row’s code as a hidden reaction key.

| Code / vibe | Preserved fusion description | Shared outward meaning candidates |
|---|---|---|
| BA **Reckless** | Opposition leads; forward force makes it rash, volatile, and ready to act. | Forceful immediacy + disregard for careful deliberation; no physical action is implied by the label. |
| BS **Instigating** | Opposition leads; social awareness turns it into bait, spectacle, or provocation. | Provocation + an invitation to defend a social or procedural position. |
| BE **Condemning** | Opposition leads; emotional reading becomes judgment, guilt, or moral accusation. | Moral evaluation + a challenge framed as a failure of responsibility. |
| BD **Extortive** | Opposition leads; concealed or ambiguous leverage controls the target. | Known leverage + an adverse consequence whose full reach is left uncertain; exact requested terms remain explicit. |
| AB **Menacing** | Forward movement leads; hostility makes the advance threatening. | Direct demand + a specified threatening or adverse consequence. |
| AS **Commanding** | Forward movement leads; social fluency makes direction feel authoritative. | Assertive direction + publicly supported procedural or social authority. |
| AE **Urgent** | Forward movement leads; recognized stakes make action immediate and emotionally legible. | Practical urgency + emphasis on the acknowledged stakes. |
| AD **Hustled** | Forward movement leads; obscured terms and compressed time prevent scrutiny. | Compressed deliberation + selective emphasis; never bypasses exact terms or confirmation. |
| SB **Irreverent** | Rapport leads; antagonism appears as insolence, teasing, mockery, or social trespass. | Familiarity or levity + a pointed social challenge. |
| SA **Charismatic** | Rapport leads; confidence and forward motion turn charm into momentum. | Rapport + confidence that moves the shared task forward. |
| SE **Compassionate** | Rapport leads; emotional care makes the bond supportive and sincere. | Acknowledgment of difficulty + supportive concern, with or without a request. |
| SD **Coaxing** | Rapport leads; concealed intent gently steers the target. | Gentle steering + selective emphasis on the attractive or easy part of the act. |
| EB **Steadfast** | Understanding leads; opposition makes the speaker emotionally aware but immovable. | Acknowledgment + an immovable position on the relevant issue. |
| EA **Boundaried** | Understanding leads; decisive force establishes a clear limit or next move. | Recognition of limits + a clearly bounded next step. |
| ES **Communal** | Understanding leads; affiliation turns shared feeling into collective action. | Shared interest + an appeal to cooperative action. |
| ED **Deflecting** | Understanding leads; emotional recognition redirects attention or avoids the real issue. | Recognition of a concern + redirection to a different relevant focus. |
| DB **Bluffing** | Interpretive control leads; hostility is projected through uncertain or false threat. | A specified but unverified representation of leverage/evidence; no new actual resources. |
| DA **Predatory** | Interpretive control leads; concealed intent advances toward an exposed weakness. | A learned concern + a proposal framed around its vulnerability; no hidden weakness lookup. |
| DS **Insinuating** | Interpretation leads; implication travels through friendly or social framing. | An observable association or indirect cue inviting an inference; not a contractual promise. |
| DE **Feigning** | Interpretive control leads; simulated understanding or care conceals the real motive. | Performed alignment/concern + an invitation to rely on or accommodate the speaker because of that display. |

The components are ordinary communicative features such as acknowledgment, request, boundary, practical urgency, judgment, asserted consequence, displayed alignment, and indirect association. No fixed count is required. Some can be combined differently or share an immediate outcome. A cue named “deception detected” is an interpretation requiring evidence, not a component automatically sent from the selected vibe.

## 4.2 Request access across all twenty vibes at Nuanced

**Common controlled example:** The player requests inspection of the handling section, not the private address. The ticket has been presented; the collected wording and missing signature are known. For the applicable rows, the test fixture has also supplied the owner’s stated practical need, Orrin’s movement account, Tamsin’s outward concern about accurate records, and her preceding question about the player’s interest. These are declared test prerequisites, not extra information automatically granted in every ordinary run.

Every row keeps the substantive target and scope. Any adverse consequence, represented leverage, or implied association is a chosen previewed part of that row’s message. The actual response remains a general policy decision, not a hard-coded row-to-line lookup.

| Vibe | Mechanical-message skeleton at Nuanced | Important limit/prerequisite |
|---|---|---|
| BA **Reckless** | Requests immediate inspection of the handling section, dismisses further procedural delay as needless obstruction, and foregrounds proceeding now over careful discussion. | No authority or action is granted by this impatient framing. |
| BS **Instigating** | Requests the handling section while challenging the consistency of the collected entry and inviting Tamsin to defend that procedure. | Uses the known entry, not an invented audience or public scandal. |
| BE **Condemning** | Requests the handling section and frames unjustified withholding of relevant collection information as a failure of responsibility to the owner. | The moral accusation is communicated, not certified as true. |
| BD **Extortive** | Requests the handling section while linking refusal to possible use of the known record discrepancy in a complaint, leaving the reach of that leverage uncertain. | The complaint possibility is selected and previewed; no complaint is filed. |
| AB **Menacing** | Demands access to the handling section and directly raises a complaint about the unresolved handling discrepancy as a possible consequence of refusal. | A possible adverse consequence is not a silently created promise or attack. |
| AS **Commanding** | Directs Tamsin to provide the relevant handling section as the next step in completing the collector’s already-presented collection procedure. | Uses the verified ticket; invents no supervisory rank. |
| AE **Urgent** | Requests prompt access to the handling section and emphasizes that completing collection matters because Nera needs the instrument for work. | The owner’s stated practical need is supplied in this example’s known context. |
| AD **Hustled** | Requests a quick look at the handling section before further procedural discussion, emphasizing apparent simplicity and discouraging delay. | Exact scope stays explicit; neither inspection permission nor confirmation is bypassed. |
| SB **Irreverent** | Requests the handling section while treating the gap between the collected entry and missing signature with pointed, informal levity. | The public skeleton describes the manner; it need not write a finished joke. |
| SA **Charismatic** | Requests the handling section with confident rapport, framing the comparison as a straightforward task that the collector and clerk can complete together. | Confidence is expressed without claiming new legal authority. |
| SE **Compassionate** | Requests the handling section while acknowledging Tamsin’s responsibility to protect unrelated information and the difficulty of resolving a mistake. | Concern and a request coexist; neither sincerity nor compliance is guaranteed. |
| SD **Coaxing** | Requests the handling section as a small helpful favor, emphasizing how easy a limited comparison could be while avoiding an overt accusation. | The gentle steering is observable; a concealed motive is not sent to the listener. |
| EB **Steadfast** | Acknowledges the privacy responsibility, requests the handling section, and maintains that the actual collection discrepancy still needs an answer. | Firmness does not demand unrelated private details. |
| EA **Boundaried** | Requests only the handling information needed for collection, distinguishes it from unrelated private material, and states that limited comparison as the desired next step. | A present scope limit is not a new future confidentiality promise. |
| ES **Communal** | Requests the handling section as a cooperative check serving Nera’s need for the case and both employees’ interest in an accountable handover. | The shared interests must have been communicated or otherwise learned. |
| ED **Deflecting** | Acknowledges Tamsin’s question about the collector’s broader interest, then redirects the exchange to inspecting the specific handling discrepancy. | Requires that prior question; the preview names what is being redirected. |
| DB **Bluffing** | Requests the handling section while claiming that the known movement account establishes that no authorized collection occurred, invoking that stronger conclusion without demonstrating it. | The account exists, but its claimed conclusiveness may be unsupported; the listener cannot consult hidden truth. |
| DA **Predatory** | Requests the handling section by tying a discreet, limited comparison to Tamsin’s already-disclosed concern about leaving an inaccurate record unresolved. | Requires the learned concern; promises neither secrecy nor immunity from later consequences. |
| DS **Insinuating** | Places the collected wording and absent recipient signature in an indirect association, suggesting that the handling section may explain what kind of collection actually occurred, while requesting access. | The direct request is received; the suggested conclusion may be missed or misread. |
| DE **Feigning** | Requests the handling section, performs shared concern for customer privacy, and invites Tamsin to treat that displayed alignment as a reason to accommodate the inspection. | No fake-concern flag is delivered; the added appeal to displayed alignment is outward. |

A fixture can supply a prerequisite to test a combination, but the delivered prototype must also demonstrate the missing-prerequisite explanation. For example, a player who has not learned Tamsin’s concern cannot unlock Predatory by inspecting her hidden card. An unavailable variation is explained; it is never counted as complete merely because its button exists.

## 4.3 One action at all three salience settings

**PROPOSED content example:** Request access, Menacing. The same selected possible consequence—a complaint about the unresolved record—exists in all three versions. Changing prominence must not change “possible” to “guaranteed,” add an audience, alter the requested scope, or promise to file anything.

| Setting | Previewed/performed framing | Unchanged content |
|---|---|---|
| Subtle | Makes the request with an understated reference to the discrepancy becoming a complaint if unresolved. | Inspection of the handling section; no money; possible complaint; no executed physical act. |
| Nuanced | Clearly raises the possible complaint while making a measured demand for the relevant inspection. | Same subject, scope, terms, and selected consequence. |
| Overt | Strongly foregrounds the same complaint possibility and the demand for inspection. | Same content; no automatic threat success or compulsory response. |

The NPC’s perception receives the direct request at all settings. Recognition of the social implication depends on the outward cue and context, not a hidden salience multiplier applied to truth. A test may find identical immediate decisions where the difference is irrelevant; that is not a failure of the equal-outward-information boundary.

## 4.4 Feigning outside requests

The approved request row does not require every other act to acquire an extra ask. These two examples make the reviewed generalization concrete:

| Core act | Compassionate example | Feigning example |
|---|---|---|
| Present evidence | Shows the same receipt and acknowledges how an honest mistake could have happened. | Shows the receipt, performs shared concern, and implies that this displayed alignment is an additional reason to rely on the offered account. |
| Acknowledge a grievance | Recognizes that Orrin’s work is a distinct concern without claiming that every allegation is established. | Performs the same recognition and invites Orrin to read the display as evidence that the collector is especially on his side. |

The second column can be sincere, strategic, both, or neither in the human’s private mind; the game does not decide that. The third column adds an outward solicitation of reliance on the display. It still does not create a demand, exchange, promise, secret weakness, or guaranteed change in trust. Tests compare the actual supported performance, not merely the two labels. [ES-D03; C review clarification 4.]

## 4.5 Coverage matrix to complete during the build

Every cell tracks Subtle / Nuanced / Overt. `—` means content/test status not yet supplied; `EX` means a document example exists only. No cell below means implemented or passed. Replace each cell during development with links to the expression fixture and its three test records. A5 has the twenty Nuanced examples above; the Menacing A5 row also has examples at all settings.

A1 whereabouts; A2 challenge; A3 evidence; A4 grievance; A5 access; A6 exchange.

| Vibe | A1 | A2 | A3 | A4 | A5 | A6 |
|---|---|---|---|---|---|---|
| BA **Reckless** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| BS **Instigating** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| BE **Condemning** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| BD **Extortive** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| AB **Menacing** | —/—/— | —/—/— | —/—/— | —/—/— | EX/EX/EX | —/—/— |
| AS **Commanding** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| AE **Urgent** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| AD **Hustled** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| SB **Irreverent** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| SA **Charismatic** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| SE **Compassionate** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| SD **Coaxing** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| EB **Steadfast** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| EA **Boundaried** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| ES **Communal** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| ED **Deflecting** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| DB **Bluffing** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| DA **Predatory** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| DS **Insinuating** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |
| DE **Feigning** | —/—/— | —/—/— | —/—/— | —/—/— | —/EX/— | —/—/— |

For every cell and setting, record all five ES-D01 checks: **preview meaning; unchanged sent meaning; outward-only receipt; general-rule evaluation; missing-prerequisite handling**. Also identify the fixture state, actual inspected observations, expected result, implementation/test version, and status. Require a valid enabled example for each combination. Keep the cases readable and reusable; no rule is allowed to return a predetermined response because it recognized a `(vibe, action, character-name)` triple.

Completion requires 120 usable act/vibe expressions with consistent behavior at all three settings: **360 coverage cases**. This is not a requirement for 360 distinct outcomes. Positive uses and missing-prerequisite tests may share fixtures; every row still needs meaningful author review. Content tests must include Deception-following as well as Deception-leading vibes. No coverage passes are claimed in this document.

<a id="part-5"></a>
# Part 5 — Assembler v1 specification

The first Assembler lets Teddy change a few important ingredients without editing program code. It also shows why the resulting encounter changed, so testing a character is not guesswork.

## 5.1 Editing scope

**DECIDED — ES-D08.** There are four editing areas. New rule types, a general script language, a room editor, and editing a running game are not included.

| Area | Proposed exposed fields | Fixed safeguards |
|---|---|---|
| **People: priorities and relationships** | Selected NPC; weights/order for payment, recognition, privacy, accurate procedure, and workable relations where applicable; directed SOFT/SORE/TRUSTS/FEARS with causes; selected allowed immediate-state defaults. | No human-player personality controls. Author values are not overwritten by regeneration. No incoming selected-vibe reception table. |
| **Observed and learned information** | Observer; selectable authored event/message/document; permitted received components; channel/time reference; source roots; authored initial interpretation and disclosure scope where supported. | No global “knows everything” checkbox. A record refers to a source; a false belief is labeled an interpretation, not fabricated direct observation. |
| **Interpretation and response conditions** | Existing template; role/subject bindings; eligible supporting/corrective patterns; tentative/actionable sensitivity within validated settings; allowed consequence choices; priority. | Cannot create arbitrary new rule types, use secret fields, remove fixed first-request protection, or replace CR-01 with a global meter. |
| **Scenario starting conditions** | Seed family; money; soft opportunity allowance; case’s valid start arrangement; authored clue availability; pressure/no-pressure testing; selected document versions. | Only compatible seed values. The unique case is not duplicated, debts remain identified, and unrelated secrets cannot become recovery requirements. |

Fields and widgets are proposed details. The fixed behavioral boundaries are not editable as ordinary tuning. A broader character generator can later expose home/calm/cornered choices, group layers, or more parameters, but the first UI must not promise those tools before they exist. It should preserve valid data already represented by the core.

## 5.2 Validate before starting a changed run

A **validation error** identifies inconsistent data, such as a missing source or impossible quantity. A **test result** checks behavior, such as whether a nonpayment route remains reachable; those are different kinds of assurance.

Structural checks cover: missing/duplicate IDs; wrong units/types; broken source links; impossible unique-item custody; container cycles; two merged debts; unavailable actors; source details incorrectly exposed; unknown selected-template parameters; incompatible action prerequisites; contradictory document dates/statuses; premature handover wording; hidden data in public text fields; unsupported schema versions; and a private address wrongly required for the ordinary recovery route.

Behavior checks cover both seed routes, protected first requests, restrictions and correction, allowed disclosure, outgoing semantic consistency, and general-rule rather than named-character responses. A changed card can be structurally valid but make Orrin’s priorities implausible or remove a promised route. Mark that variant as needing scenario testing instead of declaring it ready merely because its JSON parses.

Official first-build fixtures must pass payment/nonpayment and fair-failure tests. Deliberate author experiments are not automatically certified first-build fixtures. The UI should distinguish errors that prevent safe loading from warnings or failed behavioral checks requiring review.

## 5.3 Edit → validate → restart → compare

The current run stays frozen while the author edits a separate package draft. Validation runs on that draft; Restart creates a fresh run of the same seed with the edited package revision. It never patches the live beliefs, inventory, warning state, or current offer behind the player’s back.

Save the original package and seed identity plus the meaningful action sequence for comparison. Rerunning the same inputs against an edited package is a controlled experiment, not a promise of identical outcomes. Repeating the same edited version and actions should reproduce its changed result.

A read-only inspector may be opened during the live run. Switching from that inspector into editing either retains the old run separately or explicitly ends it before restart; typing never applies changes. This is the approved no-live-edit boundary.

## 5.4 Screens and text wireframes

**PROPOSED UI details.** These text wireframes define the initial screens/tabs without requiring finished artwork. The first two present the run; the next four are the approved editing areas; the final two handle validation and causal comparison.

### Start / scenario selection

```text
ENCOUNTER ASSEMBLER
Package: Last Collection     Version: [current authored version]
Starting arrangement: [Protective shortcut ▾]
Pressure: [Generous reminder] [No-pressure author test]

[Play new run]  [Open saved run]  [Edit package]  [Export]

Old v0.1.0 saves are preserved, but do not load as this new format.
```

### Player encounter

```text
LAST COLLECTION                         Coins: 12
Current partner: Tamsin                  [Speak with Orrin]

[Complete NPC performance area or descriptive placeholder]
Intake: [public complete-pose description]
Delivery: [outward message; claims are described as claims]

[Offer] [Request] [Remark]
Subjects: [Case] [Collection record] [Receipt] [...known subjects]
Action/refinement: [Request access to relevant handling information]
BASED: [Boundaried ▾]     [Subtle] [Nuanced] [Overt]

PREVIEW: [complete intended communication, not predicted success]
         [closure notice, only when the draft renews a publicly warned request]
[Send]  [End conversation]

Investigation: [Inspect allowed entry] [Examine handling tray]
Pending exact terms: [only when a current offer exists]
Warning/reminder: [only an actually communicated boundary]
```

The player sees their own selected vibe. NPC reply labels must not certify hidden Deception or private motive. The action menu uses known subjects and visible permissions, not the solution encoded in the seed.

### Editor 1 / People

```text
AUTHOR DRAFT — edits apply only after restart
[People] [Information] [Interpretation rules] [Starting conditions]

NPC: [Orrin ▾]
Priorities: Payment [setting]  Recognition [setting]
            Workable relations [setting]
Relationship toward: [Nera ▾]
SOFT [value]  SORE [value]  TRUSTS [value]  FEARS [value]
Causes: [select an existing supported cause / review]
Author override / pin: [explicit indication where supported]

[Validate draft] [Revert draft] [Save package draft]
```

### Editor 2 / Information

```text
Observer: [Orrin ▾]      Source: [Case movement event ▾]
Available source components (author view):
[x] Wrapped green case    [x] Removed from rack
[x] Toward partition     [ ] Final cupboard
[ ] Damp seam            [ ] Private purpose

Channel: sight    Time/reference: [source occurrence]
Initial interpretation: [private collection may have occurred]
Sharing: [own description / authored disclosure rule]

NPC preview: only checked permitted details and the chosen interpretation
[Validate source links] [Save draft]
```

The checkbox display is author-only. The NPC does not receive the unchecked labels or the whole source record. Editing an initial interpretation preserves its distinction from received details.

### Editor 3 / Interpretation rules

```text
Template: [Possible unrelated private-information interest ▾]
Bound observer role: [Customer-record custodian]
Target scope: [Nera customer-file boundary]

Supporting patterns: [renewed broad request after scope explanation]
Additional support: [related volunteered location inquiry]
Correction: [accept relevant comparison + identify discrepancy]
Action sensitivity: [validated template setting]
Consequence: [probe / supervised-only restriction]

LOCKED SAFEGUARDS
First ordinary request is protected.
A hypothesis alone cannot close collection service.
The selected vibe label is not an input.

[Preview rule explanation] [Validate] [Save draft]
```

### Editor 4 / Starting conditions

```text
Seed family: [Private hold ▾]
Player money: [12] coins
Opportunity reminder: [24] [No-pressure mode]
Case start: [Orrin-controlled locker]
Hauling claim: [existing named six-coin balance]
Documents: [depot receipt] [hauling note] [handling stub]
Clue availability: [compatible authored choices]
Private contact value: [protected placeholder; not recovery evidence]

[Check structural validity] [Check known route fixtures]
[Save draft] [Restart after validation]
```

Twenty-four is the approved tunable soft-reminder default in PD-12 (Sign-off B, 2026-10-17); it can be adjusted in testing. Twelve starting coins is already decided as adjustable.

### Validation / restart

```text
DRAFT VALIDATION
Structure: [pass / errors listed by record]
Information boundary: [pass / prohibited path]
Required route checks: [not run / passed / failed with trace]

Example error:
The completed handover sentence refers to an event that has not occurred.
Use the draft handover wording until confirmation.

The current run will not be edited.
[Create a fresh run from this draft] [Return to edit]
```

### Inspector / comparison

```text
AUTHOR INSPECTOR — READ ONLY
Package version / seed / command: [identities]
[Before] [After] [Compare two runs]

What the NPC received: [outward payload + observations]
What it believed: [claim refs, evidence, uncertainty]
What it inferred: [template, support, correction, band]
What it could choose: [eligible acts]
Why this act won: [actual recorded priority contributions]
What changed: [facts, permissions, terms, relationship causes]
What was withheld: [author-only projection check]

Original run vs edited run:
Same player action; Orrin values documented recognition differently.
Result: [observed difference with source references]
```

## 5.5 Inspector questions and limits

The inspector answers: Which detail was actually observed? Which claim was believed? Which support justified a concern? Which correction changed it? Which priority or permission made a response eligible? Why were exact terms accepted or withdrawn? Which effects committed? Why did an action become unavailable? Was money spent, the case moved, or a record merely drafted?

It explains actual recorded causes, not generated after-the-fact storytelling. It also distinguishes rule failure from an unenjoyable but consistent design. It cannot guarantee that a mystery is fun, that a bargain feels credible, or that every author-edited variant remains solvable.

<a id="part-6"></a>
# Part 6 — Agent team preparation

Development agents help build and test the software; they are not the NPC logic inside the game. The seven responsibilities below can be performed by fewer people or agents, and only the lead builder and independent tester start through M2.

## 6.1 Seven role cards

**DECIDED staffing boundary — ES-D09.** The detailed assignments below are preparation, not launched tasks.

### Role 1 — Lead builder and integrator

**Owns:** Shared contracts, implementation scope, core integration, dependency order, and the single consequence path. **Delivers:** Source inventory, keep/change plan, proposed contract refinements, a connected M2 build, and an honest status report. **Must not:** Approve owner-facing defaults, change the vocabulary, implement four scenarios, or call disconnected modules a playable encounter. **Reads:** Parts 0–8 and Appendices A–D, especially §§2.5, 2.12, 3.0, 3.7.

### Role 2 — Ledger, events, and exchanges specialist

**Owns:** Typed world state, unique custody, record identity, exact amounts, caused events, document-result effects, transaction validation, and core save integrity. **Delivers:** Tested operations and confirmation behavior with no partial state. **Must not:** Assign NPC personality in inventory code, create world events from allegations, or count document wording as a completed handover. **Reads:** §§2.7–2.11, Part 3, Parts 7–8, Appendix A.

### Role 3 — Observation and NPC-decision specialist

**Owns:** PERCEIVED, local evidence access, factual belief revision, hypotheses, caused relationships, and response eligibility/selection. **Delivers:** Filtered views, reusable templates, support/correction traces, and behavior changes. **Must not:** Read incoming vibe labels, full source events, private player inventories, or the seed’s solution; add a universal suspicion meter; hard-code names. **Reads:** §§2.5–2.10, 2.12, §§3.2–3.4, 3.8, Part 7.

### Role 4 — Communication and performance specialist

**Owns:** Six-act composition, semantic BASED, salience, context binding, preview, public skeletons, and complete Intake/Delivery/held performance. **Delivers:** Coverage fixtures, meaningful previews, safe output views, and optional expression fallback. **Must not:** Add hidden terms or actions, define Compassionate as ask-free, force every Feigning act to ask, or mutate state while animating. **Reads:** §§2.1–2.6, §§3.2, 3.8, 3.11, Part 4, Part 7.

### Role 5 — Assembler and player-interface specialist

**Owns:** The four guided editing areas, the player workspace, immutable author drafts, validation feedback, restart/compare workflow, save/export access, and inspector screens. **Delivers:** A usable workbench linked to common services. **Must not:** Add live-run editing, expose hidden diagnostics in play, create a full rule language, or copy business rules into buttons. **Reads:** Parts 0–1, §§3.8–3.10, Part 5, applicable tests in Part 7.

### Role 6 — Scenario and action-connection specialist

**Owns:** Last Collection’s two seeds, authored observations, documents, searches, witnessed comparison, actual handover, outcome reporting, and required route fixtures. **Delivers:** A valid scenario package plus payment/nonpayment and fair restriction/repair/closure play paths. **Must not:** Fork core logic for Tamsin/Orrin, require private-address disclosure for recovery, or implement theft/combat as unapproved shortcuts. **Reads:** Parts 1–4, §§3.5–3.7, 3.12–3.13, Parts 5, 7–8.

### Role 7 — Independent tester and reviewer

**Owns:** Adversarial boundary testing, scenario reachability, portability, regression checks, author workflow verification, and evidence of what actually ran. **Delivers:** Reproducible checks, failures with traces, scope limits, and independent milestone verdicts. **Must not:** Repeat builder pass claims, use historical test totals as new evidence, weaken an invariant to make a build pass, or silently rewrite the design. **Reads:** Parts 0, 2–8 and Appendix B; inspect relevant source when available.

## 6.2 Milestones and entry/exit criteria

| Milestone | Entry | Work | Exit evidence |
|---|---|---|---|
| **M0 — Inventory and reuse** | Separate owner implementation authorization and accessible reference files. | Preserve v0.1.0; inventory code/tests/content; identify catalog, validation, exchange, and interface reuse; isolate superseded label-based logic. | Actual source list, reproducible commands where available, keep/change record, missing sources reported without fabrication. |
| **M1 — Contract alignment** | Sign-off B recorded; lead and tester agree on scope. | Review proposed record formats, filtered views, source roots, exact confirmation, save boundary, and command order. | Shared examples, schema/tests agreed for M2, ownership defined, no conflicting private/public rules. |
| **M2 — One connected interaction** | M1 contracts stable; lead + tester only. | Compose/preview/send ordinary paperwork request → Tamsin explains → permitted inspection → correct observation → consequential response. Use a contrasting BASED subset internally. | Playable end-to-end chain, inspector explanation, no first-request penalty, no hidden labels, no duplicate effects, tester result. Not the complete prototype. |
| **M3 — Seed A playable** | M2 passes; Sign-off A recorded before closure implementation. | Full Seed A recovery, evidence, understandable privacy pattern, repair and warned failure, unnecessary-money refusal, save continuity. | Successful recovery and warned failure routes, with no fictitious debt or privacy requirement. |
| **M4 — Seed B through the same engine** | Shared core remains scenario-independent. | Separate charges, witnessed-note preparation/completion, optional payment and credible nonpayment, declared witness routing. | Both routes exercised end to end; no new core branch naming the seed or character. |
| **M5 — Assembler and full coverage** | Both seeds playable. | Four editing areas, restart/compare, validated variants, saved state, all twenty vibes over six acts and salience coverage. | Usable owner editing loop and 360 implemented coverage cases with the five checks, plus missing-prerequisite tests. |
| **M6 — Integrated acceptance** | M3–M5 evidence available. | Full safety/portability tests, missing-asset behavior, novice playtests, generosity of pressure, repeated/revised beliefs, independent review. | Fresh report naming exact build/package, actual test results and defects; owner can play and edit the single test scenario. |

A milestone may expose a defect in earlier work. Fix it through the shared contract and tests, not by inventing new scope. Document preparation and static content checks are not M0–M6 execution.

## 6.3 Ownership and integration rules

One component owns each mutable record and every committed effect. The lead owns shared contract changes until a specialist is explicitly assigned. The tester reviews but does not silently edit production rules. Scenario files contain names and parameters; core code contains reusable operations.

Propose a contract change with: the failing example; affected records/modules; unchanged invariants; required test updates; migration implications for new-format development saves; and whether owner-facing behavior changes. Owner-facing changes return for approval. Equivalent field names or internal refactoring can be agreed by builders and recorded.

No shared branch or file can receive conflicting simultaneous edits without an assigned integrator. Review and combine changes in dependency order: contracts before consumers, authoritative state before rendering, semantic meaning before finished wording. Interface code calls shared functions; search resolvers report effects to the shared runtime; animation does not apply them again.

## 6.4 Handoff checklist

Before a kickoff brief is sent as an executable task, confirm the owner has separately authorized development. Sign-off A and Sign-off B were recorded on 2026-10-17 (`Encounter_Approval_Record_2026-10-17.md`); attach that record with every brief. Identify exact source files and the new workspace; preserve the old executable/saves. Agree who owns shared contracts and where the tester reports failures. Confirm no agent is assuming an unavailable source/test package or an unverified product capability.

M0 may inventory real inputs without pretending their tests already pass. M2 uses an internal subset; its report must state that all-vibe and full-scenario work remain. Later staffing changes do not change the approved scope or allow private labels to leak.

<a id="lead-kickoff"></a>
## 6.5 Prepared kickoff brief A — Lead builder, M0–M2

The block below can be sent later as a standalone assignment together with this master document. It is dormant text in the current documentation task, not an instruction to launch a builder now.

```text
TASK: Encounter lead builder — M0 through M2 only

AUTHORIZATION GATE
Execute only when Teddy separately sends this as a development task.
Use Encounter_System_Master_v2.1.md as the complete design reference,
together with Encounter_Approval_Record_2026-10-17.md. That record
approves Sign-off A (closing rule CR-01, with a preview notice before
any closing message) and Sign-off B (technical defaults PD-01–PD-12).
If the approval record is missing, stop and ask Teddy for it.
The closing rule is approved but outside M0–M2; do not implement it yet.

PROJECT IN PLAIN TERMS
Build the start of a reusable browser encounter system. The player uses
Offer, Request, or Remark, learned subjects, and BASED to compose a
message. BASED changes the communication, not just a reaction score.
The NPC performs Intake then Delivery; an NPC opening starts at Delivery.
The human player has resources and shown information, but no simulated
private personality. Last Collection is one test scenario: recover Nera’s
instrument case from a transport office with Tamsin and Orrin present.
Nera is absent but her ownership, payments, instructions, and relationships
matter. The privacy concern is that case handling and private contact
information share a file whose layout the player initially does not know.

FIXED REQUIREMENTS
- All twenty BASED vibes and Subtle/Nuanced/Overt remain the final target.
  The six core acts are whereabouts, challenge record, present evidence,
  acknowledge grievance, request access, and propose exchange. M2 may use
  Boundaried, Compassionate, and Menacing as an internal contrasting subset.
- Preserve the fifteen ledger relations in Part 2 and foundational PERCEIVED,
  stored as linked observations. Observation, claim, belief, and hypothesis
  must remain distinct and source-linked.
- NPC decision input never receives the sender’s selected vibe label or
  hidden intent. React to outward acts/cues plus NPC-available context.
  Do not rename a hidden label as an observable feature. A performed
  cue that only one vibe produces is allowed, because the listener saw it
  (master §2.5, “Distinctive is allowed; hidden is not”).
- An ordinary first paperwork request triggers explanation/limited relevant
  access, not a grievance, serious restriction, or used repair opportunity.
  Tamsin’s interpretation never rewrites the sent message.
- Showing an item is not giving it. Permission is not the physical search.
  Proposals and conversational Yes never spend money or hand over the case.
- Use one consequence path. Preview, replay, animation, and retries do not
  duplicate events, knowledge, rewards, or transfers.
- The new core is typed and reusable. Selectively reuse verified parts of
  v0.1.0, but do not stretch its two-seat world or carry forward its incoming
  vibe reaction lookup, legacy trust meaning, or evidence ranks as new rules.
- Preserve old files and saves. No automatic conversion. Author edits affect
  new runs only, not the current run.

INPUTS
This master document, especially Parts 0–3, 5–8, and Appendices A–D.
Encounter_Core.html if provided, plus the named local reference sources.
Read the actual files; report missing sources rather than inventing them.
No repository URL, tool capability, framework version, or original test
archive is guaranteed by this brief. Verify the supplied workspace.

SCOPE AND ORDER
M0: inventory the available baseline and tests, preserve reference copies,
and write a keep/change/reuse plan. Distinguish observed code, historical
reported results, and tests you actually execute.
M1: agree the narrow shared records and update sequence with the tester.
Use the approved behavior defaults; field names may be refined without
changing meaning. Log any disputed owner-facing behavior.
M2: build one complete ordinary paperwork interaction. The player previews
and sends a request; Tamsin explains the file split and offers a relevant
inspection; the player deliberately performs it; the correct details reach
the player and any declared observer; the NPC’s next response can change
from actual newly available information. Provide readable Intake/Delivery
fallbacks and an author inspector showing the true causal chain.

Keep scenario data separate from core logic. Do not implement a full editor
before the chain works. Prepare compatible data for the later four editing
areas: priorities/relationships, observed information, settings inside known
interpretation templates, and starting conditions.

OUT OF SCOPE
Full Seed B negotiation, exact scenario closure, all 360 coverage cases,
finished art/dialogue, runtime AI, combat, playable theft/stealth, broad
promise contracts, autonomous NPC conversation, live-run editing, old-save
conversion, and recruiting additional agents before the M2 review.

DELIVERABLES
Actual source inventory; shared contract note with approval references;
source for the connected M2 path; a usable local launch/export method;
small valid scenario fixture; inspector; tests for the built behavior;
and a report separating completed, partial, blocked, and deferred work.
State exactly how to run it. Do not claim universal double-click support
without testing it in the intended environment.

ACCEPTANCE
Demonstrate LC-T01–12 as applicable to M2, the protected first request
(LC-T41–42), selected-label boundary and equal-outward-state checks
(LC-T46–47), and document/source safety checks assigned by the tester.
No pass is claimed for an unimplemented feature. Changing only private
selected-vibe metadata with identical outward payload, NPC state/context,
and variation state cannot change the listener result. No hidden receipt
contents or source-event fields appear through menus, errors, or history.

REPORT
Name exact code/content versions and environment. List executed commands,
actual results, failed tests with a reproducible trace, limitations, and
contract changes. Include one complete M2 interaction transcript and the
corresponding inspector trace. Do not reuse the historical 253/29 totals
as results of your new work.

YOU MAY NOT DECIDE
Do not change the twenty-vibe target, three families, salience meaning,
privacy protection, no-mind-reading boundary, or future approval gates.
Do not change the approved evidence/offer/closure behavior recorded in
the approval record. If a proposed field layout conflicts with behavior, preserve the
behavior, explain the conflict, and obtain review before integrating it.
```

<a id="tester-kickoff"></a>
## 6.6 Prepared kickoff brief B — Independent tester, M0–M2

The tester checks the implementation independently rather than assuming the lead’s report is correct. The following block supplies the project boundaries even when the tester has not read the chat history.

```text
TASK: Encounter independent tester — M0 through M2 only

AUTHORIZATION GATE
Execute only after Teddy separately sends this as a development task.
Read Encounter_System_Master_v2.1.md and
Encounter_Approval_Record_2026-10-17.md. The record approves Sign-off A
(closing rule CR-01 plus its preview notice) and Sign-off B (PD-01–PD-12),
so those defaults are test expectations. If the record is missing, stop and
ask Teddy for it. Exact closure is approved but not part of M0–M2.
You are independent of the lead builder and do not launch more agents.

WHAT IS BEING BUILT
A reusable encounter core and the beginning of one scenario, Last Collection.
The player is an authorized collector of Nera’s instrument case. Tamsin and
Orrin have partial information, different priorities, and local beliefs.
The player uses Offer/Request/Remark plus learned subjects and BASED.
NPC Intake and Delivery are distinct, with safe text/performance fallbacks.
Development agents are not runtime NPC chatbots.

KEY RULES TO CHALLENGE
The first ordinary request for case paperwork is legitimate. Tamsin may
explain that the file also contains private information, but this alone
creates no grievance, serious restriction, or spent repair opportunity.
Her interpretation must not rewrite what was actually sent.

NPCs can inspect only their own legitimate observations and related knowledge.
They do not read the selected incoming vibe label, private draft, human
intent, seed answer, unshown inventory, full source event, or another
character’s private exchange. PERCEIVED is source-linked partial information,
not a whole-event percentage or global knowledge flag. A claim remains a
claim even when the listener accepts it. Missing perception is not falsity.

All twenty vibes and three salience settings remain the final target across
six core acts (whereabouts, challenge, evidence, grievance, access, exchange).
M2 may use a contrasting subset; report that limitation. Salience cannot
alter terms. Compassionate may ask; Feigning is not detected from a hidden
label. Identical complete outward information with the same NPC, relevant
state/context, and controlled variation state must produce the same listener
result when only the inaccessible selector differs. A performed cue that only
one vibe produces is NOT a leak: the listener actually saw it. Fail a build
only when listener input carries something the listener could not perceive
(the label under any name, sincerity, or a field/ID/cache encoding them).
See master §2.5, “Distinctive is allowed; hidden is not.”

The new typed core selectively reuses the old executable. Its legacy trust,
rank scale, two-seat world, and label-based reaction deltas are not current
requirements. Preserve old files. A single owner commits effects; proposals,
Yes, animation, preview, and technical retries cannot duplicate transfers.

INPUTS
This master, actual available baseline/source files, the lead’s implementation,
contract note and launch instructions, and the owner approval record.
No inaccessible archive or old test suite is assumed. Historical 253 engine
and 29 browser checks are source-reported old results, not your pass count.

YOUR WORK
M0: independently inspect source inventory and the keep/change plan. Identify
what can genuinely be rerun and what is reconstructed or absent. Do not
block forever searching unspecified repositories.
M1: review record/view boundaries and update order against the approved
examples. Write tests from requirements, not merely from current code.
M2: test the full ordinary paperwork path: preview/send → NPC explanation →
explicit permitted inspection → correct disclosures/observations → a later
response grounded in that evidence. Check the player view and inspector
separately. Read-only inspection must not change a run.

Test malformed versus socially refused messages, stale drafts, duplicate
commands, view refresh, End/partner switch, missing assets, source-pointer
leaks, keyword/menu leaks, receipt scope, and the protected first request.
Make private-label perturbations without changing the outward payload.
Test a hidden world detail change that the NPC never learned. Test one
neutral renamed fixture so the core cannot rely on Tamsin/Orrin literals.
A deferred transfer feature is reported untested, not passed by assumption.

DELIVERABLES
Independent test files and fixtures; exact reproduction instructions;
results tied to build/content versions; a severity-ranked defect report;
one before/after causal trace for the M2 chain; and a milestone verdict:
ready for next scope, conditionally ready with named defects, or not ready.

BOUNDARIES
Do not build finished art/dialogue, expand the editor, implement combat or
stealth, invent unseen historical observations, weaken failing invariants,
or silently fix production code. Send a minimal reproduction and expected
behavior to the lead. Tests for unapproved defaults are conditional/spec
checks until approval, not grounds for silently choosing the rule yourself.

REPORTING
Separate automated checks, manual UI checks, static reviews, not-run tests,
and subjective play observations. A valid record format is not proof that
a bargain is enjoyable. End-to-end nonpayment, warned closure, and all-vibe
coverage belong to later milestones and must remain visibly outstanding.
Record any disagreement between requirements and implementation before
signing off M2. This brief authorizes no work beyond M0–M2.
```

<a id="part-7"></a>
# Part 7 — Acceptance tests

An acceptance test states a setup, an action, and the result the prototype must demonstrate. These are executable test specifications and document-review checks—not claims that the new game has been run.

## 7.1 Status and method

**PROPOSED test specifications.** LC-T01–LC-T40 preserve v1.0’s identities and update their expectations for the authorized decisions. LC-T41–LC-T68 add the new safeguards and coverage checks; v2.1 adds LC-T69 for the closure preview notice. CR-01 and PD-01–PD-12 were approved on 2026-10-17, so tests using them are no longer conditional; fixed invariants remain mandatory as before. No gameplay test in this document is marked passed.

Each test cites a decided requirement. Its exact schema expectations also cite the relevant contract through the surrounding sections. Use unit tests for individual operations, integration tests for connected paths, browser/manual checks for visible behavior, and human playtests for clarity and credibility. Review checks DOC-C01–DOC-C09 cover naming, document authorization, and future architecture boundaries that do not require implementing deferred gameplay.

### Loop, meaning, and compact controls

| Test | Setup | Action | Expected result | Decision(s) |
|---|---|---|---|---|
| **LC-T01 — Player initiation** | A valid new run, an active NPC, and a supported request. | Preview and send the message. | One actual message, distinct complete Intake and Delivery, then player control. No extra human Intake control. | D-02, D-03, D-09, D-10 |
| **LC-T02 — NPC initiation** | An eligible NPC opening with only its permitted information. | Start that opening and respond using the normal composer. | Opening begins at Delivery; subsequent player send follows the same Intake/Delivery loop and controls. No forced response. | D-04, D-22 |
| **LC-T03 — Semantic BASED** | The same practical request with supported Boundaried and Menacing framing. | Compile, preview, send, and inspect each. | The outward meanings differ in the specified framing; the response uses that meaning, not an incoming selected-label bonus. | D-08, ES-D01, ES-D03 |
| **LC-T04 — Preview safety** | An unchanged world, NPC records, clock, and offer history. | Edit subjects, vibe, salience, and target without sending; abandon a draft. | No NPC learns the draft; no clock, relationship, or material change. The player sees their own selection without gaining simulated feelings. | D-09, D-10, D-25, ES-D03 |
| **LC-T05 — No hidden material act** | A supported threatening request with no actual attack or payment instruction. | Send the request. | Its outward consequence is communicated but no attack, transfer, promise, or authority is created by choosing a vibe. | D-08, ES-D02, ES-D03 |
| **LC-T06 — Contextual Why and Yes** | A current public restriction explanation and an older accepted offer. | Preview Why, then a conversational Yes addressed to the current question. | The visible reference is stable; Why has a permitted bounded explanation; Yes spends nothing and does not confirm the old offer. | D-22, D-23, ES-D01 |
| **LC-T07 — Keyword without hidden detail** | The contact-information topic becomes publicly mentioned but its value remains protected. | Learn/select the subject and inspect suggestions/tooltips. | The keyword is usable without its address, unknown aliases, secret associations, or which NPC secretly knows it being revealed. | D-19, D-20, ES-D03, LC-D06 |
| **LC-T08 — One subject, different question** | The Case keyword and two distinct supported relationships. | Ask where the case is, then challenge its collection record. | Different acts/questions remain distinct; neither is suppressed merely because the same subject was used. | D-19, D-20, D-21, ES-D01 |

### Perception and individual understanding

| Test | Setup | Action | Expected result | Decision(s) |
|---|---|---|---|---|
| **LC-T09 — Partial historical perception** | Seed A’s movement event and Orrin’s permitted observation. | Ask Orrin about movement; query all allowed NPC views. | He can use wrapped case/removal/toward partition; he cannot read cupboard, damp seam, or purpose through the event reference. | ES-D05, D-24 |
| **LC-T10 — Witnessing a claim** | A supported allegation whose described theft is not an actual occurrence. | Have an NPC hear the allegation. | A real communication and received claim exist, but no theft effect or firsthand theft observation is fabricated. | ES-D05, ES-D03, D-25 |
| **LC-T11 — Private conversations stay private** | Player speaks separately with Orrin while Tamsin has no declared receiving path. | Reveal a claim to Orrin, then return to Tamsin. | Only eligible recipients learn it; changing partners does not share the transcript or hypothesis. | ES-D05, ES-D04, D-25 |
| **LC-T12 — Visible search is not readable content** | A tray search observable by Orrin but its small print readable only by the player. | Perform the permitted search. | Orrin may infer an interest from the conduct, but gets none of the unread result fields. | ES-D05, D-24, D-27 |
| **LC-T13 — Omission is not negation** | An observation excludes the case’s final cupboard. | Ask about that destination and inspect belief handling. | The NPC may say it does not know or give a sourced inference; no automatic belief that the case was not there. | ES-D05, D-25 |
| **LC-T14 — Equally polite, different interests** | One NPC, equal manners/prominence, and two substantive question sequences. | Use a verification-focused sequence and a protected-information sequence. | Different grounded interpretations can affect behavior. Courtesy alone does not equal the same outcome or suspicion value. | D-24, D-27, ES-D04 |
| **LC-T15 — Different people, same outward message** | Two authored NPC views with different legitimate priorities/relationships but the same received message. | Evaluate each using shared rules. | They can choose different justified acts; no name-based response branch or single global mood substitutes for individuality. | D-12, D-14, D-16, ES-D04 |
| **LC-T16 — Helpful recognition** | A hypothesis template with observed verification interest and a helpful priority. | Present a coherent handling-discrepancy sequence. | The NPC offers a useful check or assistance; interpretation is not universally suspicion. | D-24, D-27, ES-D04 |

### Restriction, repair, and authority

| Test | Setup | Action | Expected result | Decision(s) |
|---|---|---|---|---|
| **LC-T17 — Specific restriction** | CR-01’s required local observations, offered alternative, and scope explanation. | Send the later supported broad-scope request. | A named supervised-only handling restriction and public alternative appear. The first ordinary request is not used as the trigger. | LC-D03, LC-D06, ES-D04, ES-D10 |
| **LC-T18 — One meaningful repair episode** | An active serious restriction with the comparison route and delivered warning. | Clarify the warning, then narrow the request with the relevant discrepancy or accept the comparison. | Clarification does not consume the episode; substantive correction revises the concern and restores the appropriate route, without granting private information. | LC-D03, LC-D06, ES-D10, D-25, D-27 |
| **LC-T19 — Clearly warned closure** | An unrecovered case and CR-01 warning delivered in a prior committed response. | Renew the protected demand without new relevant permission, after rejecting or after using the offered repair. | Collection service closes through the explicit scenario action; merely reading, drafting, normal End, or asking routine questions cannot do it. | LC-D03, ES-D10, D-07 |
| **LC-T20 — Keep verified authority** | Tamsin has actually inspected the valid collection ticket. | Trigger an overbroad-access concern and revisit the encounter. | She retains collection authority as known and distinguishes overreach from impersonation; no convenient factual amnesia. | LC-D06, ES-D05, D-25 |

### Custody, debt, information, and transactions

| Test | Setup | Action | Expected result | Decision(s) |
|---|---|---|---|---|
| **LC-T21 — Custody versus ownership** | One unique case in the seed’s valid container/holder; Nera owns it. | Complete an authorized handover. | One custody/location chain changes; no duplicate case and no ownership transfer to the player. | LC-D01, LC-D02 |
| **LC-T22 — Separate obligations** | Distinct depot and hauling obligation IDs and evidence. | Present or pay the depot charge. | The hauling obligation is not settled, merged, or overwritten. A character’s mistaken generalization remains a belief, not a world edit. | LC-D04, LC-D07, LC-D08 |
| **LC-T23 — Payment route** | Seed B, sufficient player funds, valid accepted six-coin release/settlement terms. | Confirm the exact current offer once. | Pay the named amount, transfer case custody, and settle only that hauling balance together; retain Nera as owner and avoid a new player debt. | LC-D02, LC-D04, LC-D08 |
| **LC-T24 — Credible nonpayment route** | Seed B with the distinct records and the required authored priorities (recognition of the claim ranked above payment, §1.6). | Correct the payment assumption, obtain/show the witnessed comparison, negotiate and confirm zero-payment release. | The route actually reaches recovery; the claim stays unpaid; no secret coercion, promised future payment, or automatic obedience to ALLOWED. The inspector shows Orrin’s acceptance caused by his recognition priority being met by the comparison he received, and the same proposal without the comparison is not accepted. | LC-D04, LC-D07, D-17 |
| **LC-T25 — No fictitious debt in Seed A** | Seed A’s already-settled hauling record. | Investigate and seek ordinary collection. | No invented fee or hauling settlement is required to exercise trading. | LC-D08, LC-D09 |
| **LC-T26 — Failed or stale transaction** | Accepted terms, then altered funds/custody or a stale offer version. | Submit confirmation. | No partial money, custody, settlement, or completed-handover record; safe feedback does not reveal unrelated secret balances. | LC-D07, LC-D08, ES-D06 |
| **LC-T27 — Information conservation and novelty** | A disclosed fact remains with its giver; a duplicate label points to the same content/root. | Re-offer or re-show the known information. | The giver retains it; a duplicate label or retelling cannot create independent evidence or renewed exchange value. | ES-D05, D-17, D-23 |
| **LC-T28 — Duplicate cause protection** | A committed command, a satisfied need cause, and its saved result. | Retry the same command/result, refresh the view, then deliberately send a new repeated message. | Retries/refreshes apply no second effect; a deliberate later message is a new act but cannot re-award the same information or fulfillment. | D-07, ES-D06, LC-D08 |
| **LC-T29 — Revised blame without rewriting history** | An NPC accepted a mistaken account with cause-linked resentment. | Supply newly accessible corrective evidence. | Belief and eligible contributions change; original observations remain; correction alone does not certify intentional deception. | D-25, ES-D03, ES-D05 |

### Outcomes, continuity, and portability

| Test | Setup | Action | Expected result | Decision(s) |
|---|---|---|---|---|
| **LC-T30 — Privacy-preserving recovery** | Each official seed with legitimate collection authority and its relevant evidence route. | Recover the case through an extract/comparison without obtaining the contact value. | Recovery succeeds; the private address is not a prerequisite and not disclosed by the ending. | LC-D01, LC-D02, LC-D06 |
| **LC-T31 — Independent outcomes and directed feelings** | A valid recovery with unpaid claim or strained relationship. | Complete and inspect the player ending versus author state. | Recovery remains victory; spending, debt, and permitted side outcomes are separate; NPC feelings are not assigned to the human player. | LC-D02, LC-D08, D-13 |
| **LC-T32 — Absent actor is not omniscient** | Nera has no receiving event for the ongoing office interaction. | Recover the case, argue, or disclose information to a present NPC. | Nera’s own emotional knowledge does not update automatically; her existing ownership/instructions/relationships still affect present behavior. | LC-D01, ES-D05 |
| **LC-T33 — Continuity and save/load** | A run with partial evidence, local relationships, warning/repair state, and an accepted offer. | Switch partners and separately test saving/loading a continuing encounter. | Relevant history persists; switching closes uncompleted terms under PD-06 without erasing negotiation history; loading does not execute or reroll accepted terms. | LC-D03, ES-D05, ES-D07, D-27 |
| **LC-T34 — Missing content versus silence** | A response with no polished line or image, and a separate deliberate-silence response. | Render both. | Fallbacks show complete body/face phases and return control; absent content is not mistaken for silence or consent. | D-05, D-06, D-11, ES-D06 |
| **LC-T35 — Playback neutrality** | A committed response including an actual transfer or restriction. | Skip, replay, and change animation speed. | No factual, clock, offer, or reward changes; necessary terms and warnings remain readable. | D-06, D-07 |
| **LC-T36 — Exact-run reproducibility** | Fixed package version, seed, meaningful inputs, and any saved variation state. | Run twice. | The same mechanical outcomes and causal trace result; reading/playback duration is irrelevant. | LC-D05, ES-D06 |
| **LC-T37 — Seed differences are causal** | Same meaningful inquiries in the two valid starting arrangements. | Compare returned observations, beliefs, and responses. | Differences trace to seed facts and local understanding, not a hidden seed-name branch inside NPC policy. | LC-D01, D-16, ES-D04 |
| **LC-T38 — Content portability** | The scenario with renamed display labels and a small neutral fixture. | Load and perform the same supported relationships/actions. | Core primitives work without character/item-name special cases; this does not claim integration with every host game. | D-01, ES-D06 |
| **LC-T39 — Author values and pins survive** | Edited priority/relationship values plus any supported pin metadata. | Validate, save, restart, and exercise implemented default generation if present. | Author values persist; supported pins are distinct from ordinary edits. Advanced layer-generation behavior is reviewed, not reported passed if unimplemented. | ES-D08, D-16 |
| **LC-T40 — External/local result boundary** | A supported neutral local physical-action request and matched result. | Deliver the result twice and inspect recipient views. | Effects commit once, matched to the request, with eligible observations only. No playable combat or theft is implied. | D-15, D-28, ES-D05, ES-D06 |

### New scenario and BASED decisions

| Test | Setup | Action | Expected result | Decision(s) |
|---|---|---|---|---|
| **LC-T41 — Misunderstanding never changes the message** | First case-paperwork request followed by Tamsin’s broader interpretation. | Inspect canonical message, NPC hypothesis, and public history. | The message still requests case paperwork; the hypothesis may concern full-file expectations; no invented address demand replaces the source. | LC-D06, D-25 |
| **LC-T42 — Protected ordinary first request** | A fresh ordinary request before any serious privacy pattern. | Send it across relevant supported framing examples without adding an explicit unrelated demand. | Tamsin explains scope or offers relevant access; no grievance, serious restriction, warning episode, or used repair. A framing that actually adds an unrelated demand is a different test. | LC-D06, ES-D10 |
| **LC-T43 — Witness record creates no debt or promise** | Seed B evidence examined; note preparation supported; case still not released. | Prepare/show the comparison, inspect the draft handover section, then complete release. | The note creates no obligation, debtor reassignment, settlement, or payment guarantee. Actual handover wording becomes true only after confirmation. | LC-D07 |
| **LC-T44 — Sensible Seed A payment refusal** | Seed A, no extra collection charge, an intelligible ordinary payment offer. | Send the offer. | Tamsin declines and explains no extra charge; the message can be received socially but no money moves and no automatic bribery judgment appears. | LC-D08 |
| **LC-T45 — All-vibe completion criteria** | Controlled fixtures for all 20 vibes × 6 acts × 3 settings, including necessary known prerequisites. | Execute the five works checks for each of 360 cases and the required negative cases. | Every combination has a usable expression and general-rule evaluation. Disabled placeholders do not count. Unique scenes/responses are not required. | ES-D01, D-11, D-21 |
| **LC-T46 — Incoming selected labels stay private** | Compiled incoming message with private selection and outward data; all caches/history/views available to audit. | Trace every NPC decision input, including presentation IDs and source pointers. | No selected vibe, private tactic label, hidden intent, or one-to-one secret proxy reaches listener logic. Own outgoing expression selection remains separate. | ES-D03, ES-D05, D-24 |
| **LC-T47 — Equal outward information, equal listener result** | Same complete outward payload, same NPC and relevant prior state/context, and identical variation state. | Change only inaccessible selection metadata and neutral source bookkeeping not conveying meaning. | The listener response and future listener-observable trace remain the same. Do not compare different NPCs or changed evidence as equal context. | ES-D03 |
| **LC-T48 — Insinuation has consequences, not a contract** | A performed indirect association supported by known references. | Have one fixture recognize and confront it, and another miss or misread it. | Both paths are possible under declared rules; confrontation/resentment can follow. No promise or transfer is silently created. | ES-D03, D-26 |
| **LC-T49 — Feigning and Compassionate have useful outward differences** | The Part 4 access examples with identical material target. | Compare previews/outward records and evaluate a context where the added appeal to displayed alignment matters. | Compassionate still requests; Feigning adds the specified outward reliance appeal. No fake flag or guaranteed different immediate outcome is required. | ES-D03, ES-D01 |
| **LC-T50 — Feigning without an added ask** | Evidence and grievance examples from §4.4. | Compile the non-request acts under Feigning. | The performed alignment shapes the same primary act; no extra request, payment, or promise appears solely to satisfy the request-row wording. | ES-D03, ES-D01 |
| **LC-T51 — Salience changes prominence only** | One complete act and exact material terms under the three settings. | Compare canonical substantive content and listener-available performance. | Terms, people, items, quantity, and selected consequence scope are unchanged; the direct request is received; Overt is not automatic deception detection. | ES-D02, ES-D03 |
| **LC-T52 — Prerequisites without secret discovery** | Player has not learned the concern required for a Predatory example. | Attempt that draft, then test an enabled fixture after legitimate disclosure. | The unavailable prerequisite is explained without revealing its hidden value; enabled coverage is demonstrated only after knowledge is supplied. | ES-D01, ES-D03, ES-D05 |
| **LC-T53 — Edit, restart, and reproduce a difference** | A saved package/seed and fixed action sequence; an eligible priority/observation edit that should matter. | Validate, restart, compare to original, and repeat the edited version. | The original live run was not mutated; edited results differ for a recorded reason and repeat under the same edited conditions. | ES-D08 |
| **LC-T54 — Witness does not become an authority** | A private hauling claim outside the depot’s adjudication power. | Ask Tamsin to record the examined evidence. | The note distinguishes evidence-supported fact from allegation; no legal verdict, guaranteed collection, or new depot power appears. | LC-D07 |
| **LC-T55 — Mistake versus later evasion** | Seed A’s original shorthand and later evasive behavior. | Inspect history and obtain corrective evidence. | The original entry is retained as ambiguous shorthand; later concealment is separately represented or inferred from evidence, not retroactively declared the original lie. | LC-D09, ES-D03 |

### Engineering boundaries and fair execution

| Test | Setup | Action | Expected result | Decision(s) |
|---|---|---|---|---|
| **LC-T56 — Old saves remain intact** | Copies of legacy files plus a new-format session. | Try loading an unsupported legacy save into the new tool. | Clear refusal/compatibility explanation; old bytes are untouched; no fabricated observation history or copied legacy trust-to-TRUSTS conversion. | ES-D07, ES-D06 |
| **LC-T57 — New core is not a renamed two-seat engine** | The source tree and a fixture with arbitrary actor IDs including an absent actor. | Inspect dependencies and run basic shared relations/observations. | No mandatory player/npc seat arrays or scene-name branches constrain the new model; verified catalog/safeguards can be reused without legacy hidden-label deltas. | ES-D06, D-01 |
| **LC-T58 — Four areas and no live rule language** | The first usable Assembler and a running session. | Edit each approved area; try unsupported new rule types and live apply. | Guided forms support the approved settings; new rule authoring/live mutation are absent or rejected. Inspector stays read-only. | ES-D08 |
| **LC-T59 — Permission, attempt, and physical result differ** | An access request, a granted permission, and an explicit inspection action. | Grant permission without inspecting, then perform the action; also test a rejected request before an attempt. | Only the performed inspection reveals its result; a rejected pre-attempt command is not logged as a physical search. | ES-D01, ES-D05, D-17 |
| **LC-T60 — Expression provider cannot add consequences** | A curated provider fixture with missing output and another with a structured unsupported promise addition. | Render the message through each and remove the provider. | Fallback remains playable; structured semantic additions return for validation or are rejected before effects. Arbitrary prose equivalence is reviewed, not claimed automatically proven. | D-05, D-06, D-07, ES-D03 |
| **LC-T61 — Paid and unpaid wins are not moral ranks** | The two Seed B successful endings plus Seed A’s legitimate free collection. | Display outcome records to player and author. | Recovery is the main success in all; spent/remaining and qualified debt status are separate; paying a real claim is not labeled a mistake. | LC-D02, LC-D08 |
| **LC-T62 — Repair opportunity cannot be consumed by interface activity** | CR-01 repair episode and recorded warning. | Read, edit a draft, ask for clarification, switch partners, or retry a rejected command. | The opportunity persists; no question count, animation duration, or UI timing creates the closing predicate. | LC-D03, LC-D05, ES-D10 |
| **LC-T63 — First file split is not a spoiler** | Player initially lacks the file-layout knowledge. | Inspect initial keyword/refiner menus, then receive Tamsin’s explanation. | The initial interface does not silently disclose hidden sections/values. After the explanation, the relevant scope can be selected without exposing private content. | LC-D06, D-19 |
| **LC-T64 — Prompted answers are not volunteered pursuit** | NPC asks a question about a relevant connection. | Answer it once; compare to separately volunteered repeated inquiries with different roots. | The observer retains the response context and does not count its own probe as fresh independent evidence that the player persistently introduced the subject. | ES-D04, D-25, D-27 |
| **LC-T65 — Privacy refusal alone is not scenario failure** | A relevant recovery route remains available while the private address is denied. | Accept the denial, pursue case-only recovery, or decline payment. | No scenario loss solely from denied private access or nonpayment; only the actual authorized close/recovery predicates end the objective. | LC-D02, LC-D04, LC-D06, ES-D10 |
| **LC-T66 — Generous reminder and no-pressure testing** | The approved PD-12 soft allowance in one run and no-pressure author mode in another. | Use the same actions through and beyond the reminder, including final confirmation at the boundary. | The initial soft reminder is not a hidden loss; no-pressure removes it; completed recovery remains success. PD-12 was approved 2026-10-17, so this test is no longer conditional. | LC-D05, LC-D02 |
| **LC-T67 — No label leak through a renamed feature** | Two message pipelines whose private template/asset choices differ but outward cue content matches. | Audit cached descriptors, history signatures, decision seeds, and asset/name references. | A hidden one-to-one template or deceptive-mode proxy cannot affect listener state. Outward meaning and legitimately observed differences still may, including a performed cue only one vibe produces (§2.5, “Distinctive is allowed; hidden is not”). A distinctive performance is not a failure of this test. | ES-D03, ES-D05 |
| **LC-T68 — Unlearned world changes do not become NPC evidence** | Same NPC-local view and same outward action; alter a private world detail irrelevant to actual physical availability. | Compare local inference and response eligibility from knowledge. | No change arises solely from hidden truth. A legitimate authoritative physical validation difference is reported separately, not converted into NPC knowledge without an observation. | ES-D03, ES-D04, ES-D05, D-25 |
| **LC-T69 — Closure is always previewed** | CR-01 warning delivered; case not yet recovered. Three drafts: a renewed whole-file request, a case-only comparison request, and a Why about the restriction. | Preview each; then send the renewed request once with the notice shown and, in a separate fixture, once with the notice deliberately suppressed. | Only the renewed request shows the closure notice; the other two show none. The notice contains no NPC belief or hidden seed fact. Editing or abandoning the flagged draft costs nothing. Sending after the notice closes service; sending with the notice suppressed does not close service and is logged as a defect. Before the warning, no draft shows the notice. | LC-D03, ES-D10 |

## 7.2 Document and architecture review checks

| Check | Setup | Action | Expected result | Decision(s) |
|---|---|---|---|---|
| **DOC-C01 — Authority and authorization** | The master, decision section, sign-off record, and both briefs. | Review execution gates and statuses. | Historical D-30 authorizes its old document only; current work remains documentation; pending defaults are not silently approved and no build/agents are launched. | D-29, D-30, ES-D09, ES-D10 |
| **DOC-C02 — Compact human interface** | Player wireframe and six-act composition definitions. | Review available controls and examples. | Offer/Request/Remark, keywords and context stay primary; no required third-person player avatar, selectable player Intake, or six mandatory interrogative fields. | D-02, D-09, D-10, D-20, D-21, D-22 |
| **DOC-C03 — Performance is coherent and not a truth code** | Performance contract, NPC cards, and mapping tables. | Inspect meanings, references, and restrictions. | Body/face units remain coherent; no mandatory 20-pose count or universal mood meter; appearance is not guaranteed hidden truth. | D-05, D-06, D-11, D-12, D-14 |
| **DOC-C04 — Future composability without building future modes** | Physical-result contract, deferred list, and historical examples. | Review boundary scope. | Relevant actor history is portable; theft/combat/blackmail/rail-shooter examples are not current subsystems or mandatory lore. | D-01, D-15, D-17, D-28 |
| **DOC-C05 — Names and design lineage** | Historical register, glossary, and authority order. | Compare with available sources. | Encounter System naming is retained; DPA expands to Deal, Pressure, Ask without replacing current controls; Shadowrun is attributed as the owner’s historical keyword reference. | D-18, D-19 |
| **DOC-C06 — Two-role start and self-contained briefs** | Both kickoff blocks and milestone table. | Read each without chat context. | Each contains scope, inputs, deliverables, gates and limits; only lead/tester through M2; specialists wait for stable contracts. | ES-D09, D-29 |
| **DOC-C07 — No approval loop disguised as defaults** | Part 0, §3.0, Part 8, and Appendix B. | Trace every open/default item. | The two owner review groups cover proposed behavior without reopening decided LC/ES choices; builder details are distinguished from owner defaults. | ES-D10, D-29 |
| **DOC-C08 — Existing code is not new validation** | Baseline map, source register, legacy appendix, and reports. | Inspect code availability and test claims. | Old 253/29 are historical reports only; new typed-core scope and save preservation are explicit; no runtime result is invented. | ES-D06, ES-D07, D-29 |
| **DOC-C09 — Portable and linked document** | The final Markdown, anchors, decision IDs, test references, and glossary. | Run static checks and manually review examples. | No chat-specific citation artifacts, broken internal anchors, missing registered decision/test links, or unmarked active use of obsolete label-based rules. | D-29, ES-D03, ES-D10 |

## 7.3 Human playtesting

Ask novice players whether they know the objective, whether previews match what they intended, whether the two NPCs seem different for understandable reasons, and whether the restriction feels connected to their actual conduct. Ask them to explain what each person observed versus inferred. Do not tell them a hidden answer through the question itself.

Watch for a false nonpayment route that technically exists but no reasonable player can discover; a privacy trap triggered by ordinary curiosity; a correct clue that removes any need to talk; a single optimal vibe used everywhere; or an inspector summary pretending the NPC had information it lacked. Those can be design failures even when all record types validate.

Test recovery with payment, without payment, with a repaired misunderstanding, with unresolved resentment, and through a warned failure. Compare generous reminders with no-pressure mode before adding a harsh clock. Different outcomes should be attributable, not random gotchas. Collect observations and adjust tunable parameters without changing approved semantic boundaries.

## 7.4 Reporting results

Every future report names the actual build and authored package versions, environment, executed commands/tests, passed and failed cases, not-run cases, manual checks, and limitations. Keep documentation checks, static code inspection, runtime checks, and subjective play observations separate. Historical 253 engine tests and 29 browser checks refer only to the old reported executable validation. Neither this document nor a coverage matrix creates a new pass count.

LC-T39’s advanced layer-generation portion remains a conditional review when that feature is absent; its first-build requirement is preserving author edits and supported pin data. LC-T40 uses a supported neutral result fixture, not an excuse to build combat. The equality tests never require two different NPCs or changed contexts to react identically. [C review clarification 6; ES-D01, ES-D03, ES-D08.]

<a id="part-8"></a>
# Part 8 — Still open and deferred

Only the items below still need a choice or implementation review. The original workbook is retained for traceability, not presented as thirty-two unanswered owner questions again.

## 8.1 Owner review after delivery

| Owner item | Status | Recommendation and reason | Where to review |
|---|---|---|---|
| **Sign-off A — Exact closure** | DECIDED 2026-10-17 | Approved: CR-01’s one visit-long repair episode, persistent warning, and narrowly defined renewed protected-scope demand, amended with a preview notice before any closing message. It prevents one-click punishment and endlessly resetting a serious warning. | §2.12, the two play-throughs, LC-T17–20, LC-T62/65, LC-T69. |
| **Sign-off B — Technical behavior package** | DECIDED 2026-10-17 | Approved: PD-01–PD-12 as a connected first-build package. Review the examples for what the player/NPC receives, how corrections work, how exact offers persist, and what the ending shows; let builders refine equivalent field/layout details. | §3.0 and its contract examples; Part 5. |

The package includes the proposed soft allowance of 24, evidence calculation/thresholds, no passive cooling within the short run, and scoped document/outcome rules. These are not automatically approved because the prompt requested a recommendation. The already-approved 12-coin starting amount remains tunable and is not reopened.

After the owner responds, record the approval or exact amendment with its scope and date, revise affected examples/tests, and then prepare the selected kickoff briefs for sending. No builder receives an instruction to make these owner decisions silently. A specific implementation authorization is still separate from accepting the document’s recommendations.

## 8.2 Builder decisions and implementation work

| Item | Status | Recommended approach and reason |
|---|---|---|
| Exact schema fields and module layout | PROPOSED | Keep the record/view split and one consequence path; choose explicit types and validation. Names may change without altering approved behavior. |
| Baseline source/test inventory | OPEN — builder task | Inspect the provided HTML and available workspace once at M0; reuse verified parts and reconstruct missing tests from declared invariants when authorized. Do not search indefinitely or claim the old suite was recovered. |
| Supported message components and the remaining coverage content | OPEN — builder/content task | Fill the Part 4 matrix with reusable combinations. All 20 names and 360-case target are decided; this is authoring work, not permission to reduce coverage. |
| Exact outward-cue recognition and response priority parameters | PROPOSED | Deterministic, inspectable conditions over permitted cues; validate against both seeds. No selected-label proxies or automatic deception codebook. |
| Equality, source-root deduplication, and temporal question keys | PROPOSED | Use the typed identity guide, explicit roots, and declared time scope; do not infer hidden aliases from strings. |
| Local action/result and note formatting | PROPOSED | Keep request, permission, attempt, performed inspection, comparison note, and actual handover distinct. All effects pass through the runtime. |
| Browser packaging, exports, and asset lookup | OPEN — builder task | Prefer a dependable offline bundle and manual export. Test real launch/storage limits; do not choose a runtime network service merely for convenience. |
| Template parameter ranges and remaining profile tuning | PROPOSED | Use a few visible named controls and bounded values. Test the credible nonpayment route and preserve protected behaviors before declaring a changed fixture ready. |
| Side-outcome presentation | PROPOSED | Use §3.13’s known-versus-hidden reporting. Do not invent a privacy breach solely to produce a different score; not every imaginable outcome is guaranteed reachable in the first two fixtures. |

Engineering work that reveals a new user-visible behavior choice returns to the owner. It must not be concealed under the phrase “implementation detail.” Equivalent internal changes remain the builders’ responsibility.

## 8.3 Original workbook disposition

This is a cross-reference map, not a fresh decision sheet. “Covered” means the decision constrains the work; it does not claim software or tests are finished.

| Original ID / workbook | Current disposition | Remaining treatment |
|---|---|---|
| O-01 / Q01 | PD-01 | Primary act plus bounded framing; owner package review. |
| O-02 / Q02 | PD-01 and §3.2 | Builder validates incomplete/ambiguous/unsupported combinations without fake sends. |
| O-03 / Q03 | §2.4 and §3.10 | Builder supplies discoverable references and safe keyword/alias handling. |
| O-04 / Q04 | PD-02 | Compatible visible reference and explicit confirmation separation. |
| O-05 / Q20 | §2.4 | Bounded public reasons, cycle detection, novelty; no arbitrary question quota. |
| O-06 / Q05 | ES-D04 + PD-03 | Reusable support/correction rules; exact bands/policy under package review. |
| O-07 / Q06 | ES-D05 + PD-04 | Linked observations are decided; companion local stores and identities are proposed. |
| O-08 / Q13 | LC-D07–08 and §3.5 | Immediate named payment/release supported; general partial grievance settlement deferred. |
| O-09 / Q09 | §§2.8, 3.3, 3.13 | Bounded authored/supported allegations remain separate from actual occurrences. |
| O-10 / Q10 | PD-05 | One strong-but-fallible evidence policy replaces contradictory inherited instructions. |
| O-11 / Q11 | ES-D03 and §§2.6, 3.3–3.4 | Falsehood, error, and attributed deception remain distinct; add only bounded supported patterns. |
| O-12 / Q14 | DEFERRED | No unrestricted future promise engine; immediate witnessed records are not substitutes for promises. |
| O-13 / Q17 | PD-12, §§3.1, 3.9 | Preserve the visit’s relevant state; defined End/offer and presentation boundaries. |
| O-14 / Q18 | PD-12 | Action-based generous reminder, not wall-clock reading or animation time; broad aging deferred. |
| O-15 / Q21 | §§2.5, 3.4, 3.11 | Own outgoing BASED is privately selected to express an eligible message; hidden incoming labels remain forbidden. |
| O-16 / Q22 | PD-10 | Complete performance units/sequences, fallback, no fixed pose count. |
| O-17 / Q08 | PD-12 and §3.4 | Eligible responses before priority comparison, stable ties, bounded initiative. |
| O-18 / Q19 | §§2.4, 2.10, 3.7 | Semantic/source novelty and caused effects, not raw keyword/vibe repetition. |
| O-19 / Q16 | §2.10 | Avoid duplicate fulfillment credit; broad multi-contributor proportional rewards deferred unless a required fixture needs them. |
| O-20 / Q26 | ES-D07 — DEFERRED conversion | Preserve old files; use new versions; no invented historical data. |
| O-21 / Q23 | §§2.9, 5.1 | Preserve authorship/pins; advanced layer generator and undefined cooling formulas are not prerequisites. |
| O-22 / Q25 | LC-D07, PD-12 | Explicit local scope/role authority; private-debt adjudication is not invented. General jurisdiction resolution deferred. |
| O-23 / Q12 | §3.10 | Typed question identities, source roots, and neutral IDs; ambiguous matches require explicit authored links. |
| O-24 / Q15 | PD-06 | One current accepted proposal with explicit lifecycle and exact confirmation. |
| O-25 / Q27 | M0 inventory | The HTML is available here; the old separate suite is not assumed recovered. |
| O-26 / Q07 | ES-D03/05, §3.8 | Filter every listener/public path, including indirect queries, menus, saves, and errors. |
| O-27 / Q28 | PD-07 | One staged command and commit order. |
| O-28 / Q24 | ES-D05 | Linked selective observations are decided; detailed senses are deferred; exact fields are builder review. |
| S-01 / Q29 | PD-08 | Typed message and private/outward/view separation. |
| S-02 / Q30 | PD-09 | Public skeleton with claims/terms/control clarity and no hidden diagnostics. |
| S-03 / Q31 | PD-10 | Coherent short complete-pose sequences and held posture. |
| S-04 / Q32 | PD-11 | Small optional expression boundary; no automatic semantic guarantees for arbitrary prose. |

## 8.4 Deferred scope

**DEFERRED:** playable combat and attack resolution; playable theft/pickpocketing; stealth; geometric sight/hearing; cognitive memory decay; autonomous offscreen life; unrestricted NPC-to-NPC conversation; a general future-promises engine; broad conditional/partial settlements; runtime generative AI; finished voice/audio/art production; a general rule-builder; editing a running game; automatic old-save conversion; broad multi-game migration tooling; and a full room/map/exploration editor.

Reserved references and local action tests are preparation for these connections, not implementation claims. Their absence must be honest in the UI. A feature comes out of this list only through a later explicit scope decision and testable integration work. [V2P Part 8; v1.0 §§17, 22; D-15, D-17, D-28.]

<a id="part-9"></a>
# Part 9 — Glossary

These definitions explain the project’s vocabulary without turning every historical idea into a feature of the first build. The wording follows the approved decisions and the named sources; an engineering definition describes a proposed implementation concept where applicable. [V2P; v1.0 §23; F §§06–22; W reading aids.]

## The project and player experience

| Term | Everyday meaning |
|---|---|
| **Encounter System** | The reusable design for communicating with NPCs and handling their individual interpretations, responses, and consequences. |
| **Encounter Core** | The executable foundation; v0.1.0 is the smaller browser prototype inspected here. |
| **Encounter Assembler** | The first guided workbench for editing the four approved areas, restarting a seed, inspecting causes, and saving/exporting runs. |
| **Last Collection** | The selected first test scenario: recover Nera's case while navigating people and privacy. |
| **NPC** | A non-player character whose choices are determined by the game's authored rules and state. |
| **Player** | The human-controlled participant. The system records relevant actions and resources, not private human thoughts. |
| **Encounter** | One exchange with a character, including communication, reception, response, and consequences. |
| **Scenario** | The larger bounded situation containing the objective, characters, clues, actions, and possible endings. |
| **Run / session** | One instance of playing from a selected starting arrangement and continuing through its consequences. |
| **Seed** | A repeatable starting arrangement of facts, events, observations, relationships, and clues. A seed is not a second game. |
| **Seed family** | A bounded group of coherent variations, such as the handling-mistake version. |
| **Replayability** | Reasons another run can involve a genuinely different investigation or social approach. |
| **Offer** | Propose supported exchange terms, a contribution, concession, disclosure, or commitment. |
| **Request** | Ask for information, permission, help, goods, explanation, or a favor. |
| **Remark** | Communicate a statement, answer, accusation, warning, apology, praise, or another supported message. |
| **Keyword** | A learned short subject label used to compose messages, not a whole dialogue line or all facts about that subject. |
| **Context** | The relevant prior exchange that makes a short answer or Why refer to the right thing. |
| **Preview** | A non-mutating description of what you are about to communicate. Not a guaranteed prediction of the reply, except the closure notice after a public warning (§2.12 C2). |
| **Closure notice** | The preview line that appears, after Tamsin’s explicit warning, when a draft would end collection service. It restates a public warning; it reveals nothing hidden and does not block Send. |
| **Intake** | The NPC's visible reception/consideration phase after the player sends a message. |
| **Delivery** | The NPC's outward response phase, possibly including deliberate silence. |
| **NPC initiative** | The NPC starts with Delivery and then uses the same encounter loop. |
| **Restriction** | A specific limit on access or cooperation imposed within the scenario. |
| **Repair opportunity** | A meaningful chance to address a serious concern, not a timer or the next interface click. CR-01 sets one visit-long episode (approved 2026-10-17). |
| **Closure** | The actual ending of collection service for this visit, not a private-data refusal or closing a conversation panel. Its exact CR-01 rule remains proposed for owner approval. |
| **Side outcome** | A consequence separate from recovery, such as privacy preserved or a debt left unresolved. |
| **Exposure risk** | Your outward behavior can reveal an interest that changes how a particular NPC deals with you. |

## Meaning, knowledge, and records

| Term | Everyday meaning |
|---|---|
| **Ledger** | Structured records the game uses to keep facts and relationships consistent. |
| **World ledger** | The authoritative record of actual game conditions and occurrences, including that an NPC has a view. The world itself does not perceive. |
| **Character / personal ledger** | The records relevant to an individual, especially their knowledge, beliefs, needs, and relationships. Not necessarily a full duplicate database. |
| **Statement / information statement** | A structured assertion using a foundational verb and the values it requires; earlier discussion also called these sentences. |
| **Verb / predicate** | A reusable relation such as HOLDS or OWES, not a separate custom action word for every story event. |
| **Slot** | A labeled place in a record for a particular kind of value, such as debtor, target, or amount. |
| **Switch** | A mutually exclusive position or answer, such as allowed/forbidden or the current owner. |
| **Dial** | A varying intensity, such as resentment, that is not an exact count of physical resources. |
| **Amount** | An exact quantity expressed in defined units, such as six coins. |
| **World fact** | A condition actually true in the authored game world; NPCs need not know it. |
| **Claim** | Something a character communicated, which can be true, mistaken, incomplete, or deliberately false. |
| **Belief** | What a particular NPC currently accepts or suspects based on its available support. |
| **Observation** | A source-linked record of received details. Seeing a claim being made is not witnessing the incident claimed. |
| **PERCEIVED** | The foundational observation concept, stored as linked records of which details a particular NPC actually received. |
| **Partial perception** | Receiving only some relevant details, rather than a percentage that automatically reveals the rest. |
| **Clarity** | Optional information about how distinct an observation was; not automatically certainty that its interpretation is true. |
| **Hearsay** | Information received from someone else's statement rather than witnessing the claimed occurrence. |
| **Evidence** | Available support for an assertion or interpretation. Its meaning and weight depend on the defined rules. |
| **Proof item** | An object linked to an assertion as evidence in the authored design; possession does not automatically grant every conclusion. |
| **Certainty** | An NPC’s acceptance/support level under the chosen evidence policy, not a guarantee of world truth. |
| **Evidence rank** | An ordering of evidence strength. The old 1/2/4 ranks are not automatically the proposed new 1–5 support levels. |
| **Inference** | A conclusion drawn from available information rather than directly observed. |
| **Hypothesis** | An NPC-owned, revisable interpretation of available evidence, such as what a collector may be trying to do. |
| **Expectation** | What an NPC thinks may happen next and can use to choose a response. |
| **Adaptation** | A change in actual NPC behavior because their understanding or circumstances changed. |
| **Provenance / source lineage** | Where information or a consequence came from and which earlier records support it. |
| **Record identity** | What makes two entries concern the same obligation, item, event, or question rather than different ones. |
| **Contradiction** | Incompatible answers about the same relevant thing at the same applicable time/scope. |
| **Metadata / wrapper** | Information about an assertion, such as validity, source, certainty, or sharing policy. |
| **Disclosure** | Actually communicating information to a recipient. Offering disclosure is not disclosing its private contents. |
| **Sharing policy** | Whether a particular holder makes information open, exchange-only, private, or otherwise restricted. |
| **Hidden information** | Facts or diagnostic details not available to the current NPC or ordinary player view. |
| **Novel information** | Something meaningfully new to the recipient, not an old claim with a different label. |

## The foundational relationships

| Term | Everyday meaning |
|---|---|
| **HOLDS** | Who currently possesses or has custody of an amount/item. |
| **OWNS** | Who owns the thing, which can differ from who holds it. |
| **OWES** | A specific outstanding obligation between identified parties. |
| **PROMISED_TO** | A represented commitment with a status such as open, kept, broken, or released. |
| **MEMBER_OF** | Membership, rank, or role in a group; not automatic loyalty. |
| **ALLOWED** | Permission or prohibition under an identified authority and scope. |
| **SOFT** | Affection, positive feeling, or gratitude toward a target. |
| **SORE** | Resentment or grievance toward a target. |
| **TRUSTS** | Reliance on someone's word or reliability, distinct from liking. |
| **FEARS** | Fear toward a person/group, not automatic obedience. |
| **NEEDS** | A currently relevant want/shortage/urgency, optionally with an exact amount and deadline. |
| **AIMS_FOR** | A broader desired outcome or goal, not a full autonomous planner. |
| **BELIEVES** | A belief represented as information about an actor; the inherited draft limits inner nesting. |
| **IS** | A declared property such as condition or location, with the property's own type. |
| **HAPPENED** | An actual historical occurrence recorded by identity; claims about an occurrence remain distinguishable. |
| **Directed relationship** | A feeling or stance from one actor toward another; the reverse relationship can differ. |
| **Contribution** | One caused part of a relationship value, such as resentment from a particular accusation. |
| **Need fulfillment** | Meeting a specific need entry, so the same satisfaction is not rewarded every conversation. |
| **Settlement** | An explicitly agreed change reducing/closing a named obligation or grievance. A witnessed note alone is not settlement. |

## Character and presentation

| Term | Everyday meaning |
|---|---|
| **BASED** | Belligerence, Aggression, Sociability, Empathy, and Deception: the ordered-cue vocabulary shaping communication. |
| **Vibe** | One of twenty ordered BASED pairs used to construct expressive communication. Its selected label is not given to the listener. |
| **Salience** | How prominently social framing is performed: Subtle, Nuanced, or Overt. It does not alter material terms. |
| **Nuanced** | The middle salience setting, not an unrestricted blend of vibes. |
| **Character card** | The organized profile and links needed for an NPC's individual behavior. |
| **Temperament** | Authored tendencies such as patience or sensitivity to challenge. They are not scientific diagnoses or a limit to three behavior modes. |
| **Home / calm / cornered** | Inherited expressive defaults, not the entire limit on a character's behavior. |
| **Receptiveness** | How open the NPC is to the present exchange. |
| **Tension** | Immediate pressure in the encounter, not a unique emotion or automatic combat threshold. |
| **Patience** | Willingness to continue under the policy, affected by meaningful context and repetition. |
| **Reception table** | Historical per-vibe adjustment table. Direct use of incoming selected labels is superseded; v2 listeners evaluate outward communication instead. |
| **Response policy** | The authored rules that select an NPC’s eligible communication/actions from its own information, priorities, and observed message. |
| **Layer** | A bundle of group, personal, or situational adjustments to an authored character. |
| **Nudge** | A numeric adjustment that combines with the base and other allowed adjustments. |
| **Pin** | An explicit author lock preserved separately from a normal edit. Full layer editing is not required in the first four-area Assembler. |
| **Mechanical-message skeleton** | A readable description of the actual communication before finished character dialogue exists. |
| **Character voice** | Individual phrasing and expression; not necessarily recorded speech. |
| **TPL / Textual Paralanguage** | Expression through written pacing, pauses, emphasis, register, and formatting. It cannot silently add facts or commitments. |
| **Complete performance unit** | A coherent body-and-face pose/action description or asset reference. |
| **Held posture** | The final visible pose remaining while the player prepares the next message. |
| **Fallback** | A safe usable substitute when finished wording or art is absent. |
| **Purposeful silence** | An intentionally silent response, different from missing content. |
| **No codebook** | A surface cue such as punctuation or a smile is not a guaranteed lookup of a hidden emotion or truth. |
| **PSG / Periodic Semantic Grammar** | Earlier semantic-architecture work emphasizing distinct meaning, relation, boundaries, references, and traceable transformation. |
| **Functional Behavior** | Historical framing of what result matters to an actor; not a required new player-side meter. |
| **DPA** | Deal, Pressure, Ask: historical social-route vocabulary. It is not the current Offer/Request/Remark controls or a required escalation ladder. |

## Engineering and development

| Term | Everyday meaning |
|---|---|
| **Core / kernel** | Common rules reused across different scenario content. |
| **Host game** | The larger game supplying setting, physical actions, world events, and presentation. |
| **Adapter / connection** | A defined way for two components to exchange information without silently changing responsibilities. |
| **Action resolver** | The part that determines the actual result of a supported physical attempt. |
| **Payload** | The relevant information carried in a message or event result. |
| **Schema** | The declared shape and allowed types of a record. |
| **Contract** | Agreement about what information a component accepts, returns, and may change. |
| **Semantic** | About what the communication means, rather than just its exact printed wording. |
| **Canonical message** | The single structured account of a sent communication. Private construction fields are separated from derived outward/observer/public views. |
| **Projection / view** | A permitted subset or representation of data for a particular consumer. |
| **Validation** | Checking types, references, permissions, quantities, or other declared requirements before accepting data/effects. |
| **Invariant** | A rule that must remain true, such as no item duplication or no hidden transfer during preview. |
| **Atomic transaction** | Related changes happen together or none of them happen; no half-completed payment-and-handover. |
| **Idempotency** | Reprocessing the same committed result cannot apply its consequences twice. |
| **Revision / staleness** | A version marker showing whether proposed terms or a draft still refer to the current state. |
| **Event recipe** | Authored instructions made from supported effect operations for a kind of occurrence. |
| **State** | The current stored conditions of the run. |
| **State transition** | A supported change from one set of conditions to another. |
| **Snapshot** | A saved state of the system at one point. |
| **Event sourcing** | A possible architecture deriving state from an event log; not chosen as a compulsory first-build method. |
| **Serialization** | Writing data into a save/export form so it can later be reconstructed. |
| **Migration** | Converting data between formats. Automatic conversion of old Encounter saves is deferred; originals remain intact. |
| **Deterministic** | Reproducible under the same relevant inputs and controlled state. |
| **Fixture** | A defined test arrangement of facts, actors, and inputs. |
| **Regression test** | A check that a change did not break behavior already intended to work. |
| **Acceptance test** | A concrete behavior the prototype must demonstrate before it is accepted. |
| **Integration test** | A check that several components work correctly together. |
| **Inspector** | The author-facing explanation of facts, observations, decisions, and their causes. |
| **Development agent** | A software-building or reviewing role. It is distinct from in-game NPC rules and is not launched by this document. |
| **Vertical slice** | One small complete path through the actual connected components, such as the ordinary-paperwork interaction at M2. |
| **Tuning** | Adjusting values for play quality after their meaning and limits are clear. |
| **Provenance hash / SHA-256** | A fingerprint of exact file bytes. It can identify a source snapshot but cannot certify gameplay correctness. |
| **Soft-lock** | A state where progress is no longer possible without a clear intended ending or understandable reason. |

## Approved and proposed work

| Term | Everyday meaning |
|---|---|
| **DECIDED** | An approved requirement recorded in this document. It is not automatically an implemented feature. |
| **PROPOSED DEFAULT** | A recommended starting behavior awaiting the owner’s later sign-off. |
| **PROPOSED** | A record layout, field name, example, or other builder-review detail, subject to the approved behavior. |
| **OPEN** | A remaining choice or implementation task; not permission to guess silently. |
| **DEFERRED** | Explicitly outside the first build, even when a future connection is described. |
| **IMPLEMENTED BASELINE** | Behavior present in the old executable, not a claim about the new prototype. |
| **Owner sign-off** | Teddy’s approval of a proposed behavior after seeing what it means in play. |
| **Sign-off A** | The grouped approval for CR-01, the exact closing rule. Approved 2026-10-17 with the preview-notice amendment. |
| **Sign-off B** | The grouped approval for PD-01–PD-12, the technical behavior package. Approved 2026-10-17. |
| **PD identifier** | A stable label for one proposed default. It is not a new engine verb. |
| **D / LC-D / ES-D identifiers** | Historical foundation, Last Collection, and current system decision labels respectively. |
| **O / Q / S identifiers** | Original open-item, workbook-question, and reserved skeleton-question labels. Their numbers are not interchangeable. |
| **LC-T / DOC-C identifiers** | Behavior test specifications and document/architecture review checks respectively. |
| **Milestone M0–M6** | A defined development checkpoint with entry conditions and evidence required for completion. |
| **Kickoff brief** | A prepared assignment describing scope, inputs, deliverables, tests, and limits for a later authorized builder. |
| **Conformance** | Whether actual behavior satisfies the stated design rules. |
| **Definition of done** | The specific evidence required before a feature or milestone counts as complete. |

## Additional game and information distinctions

| Term | Everyday meaning |
|---|---|
| **Witnessed record** | A written account of evidence or an observed event. It does not create a debt, adjudicate one, or guarantee payment. |
| **Comparison note** | The record of differences supported by examined documents; it can exist before a case handover. |
| **Draft handover section** | Proposed receipt wording that is not yet a statement of a completed event. |
| **Handover receipt** | A record generated from the actual confirmed transfer of custody. |
| **Allegation** | A communicated assertion that something occurred; the alleged event may not exist. |
| **Acknowledgment** | Recognizing a concern or piece of information without necessarily accepting every allegation or promising a remedy. |
| **Authority** | A defined ability to grant permission within a scope, not automatic obedience or expertise. |
| **Scope** | Exactly which thing, information, time, person, or action a rule or claim concerns. |
| **Custody** | Who physically holds or controls an item, distinct from who owns it. |
| **Container** | A world entity that can directly hold an item, such as a cupboard; not an extra psychological character. |
| **Custodian** | The responsible actor/group linked to a stored item or container, without creating another copy of the item. |
| **Outward payload** | The actual communicated/performed information available for observation, excluding the hidden selector. |
| **Private composition** | The sender’s recorded construction choices, such as selected BASED; not a simulated human motive. |
| **Observable cue** | A feature of what is actually communicated or performed, not a renamed secret label. |
| **Framing** | How the message presents its subject: as a boundary, appeal, challenge, shared problem, or possible consequence. |
| **Implication** | A meaning suggested indirectly. It can affect people without becoming an explicit contract. |
| **Material terms** | Exact resources, quantities, parties, and settlement/disclosure scope in an arrangement. |
| **Inferred intent** | What an NPC suspects a person may be pursuing; not knowledge of the human’s private purpose. |
| **Volunteered versus prompted** | Whether the player independently introduced a subject or responded to a question the NPC asked. |
| **Evidence root** | The original source behind one or more reports. Repeating it does not create independent corroboration. |
| **Corroboration** | Support from a genuinely independent relevant source or check, not the same rumor retold. |
| **Recognition** | What the observer can establish about an inspected source, such as a visible identifying mark. |
| **Question key** | The structured identity of what is being answered, such as the balance of one specific debt. |
| **Confidence band** | A limited state such as tentative or actionable for a particular hypothesis, not a global suspicion score. |
| **Soft allowance** | An adjustable opportunity reminder. The initial proposed version does not create automatic countdown failure. |
| **Counteroffer** | A proposed replacement arrangement with its changed exact terms visible before confirmation. |
| **Semantic novelty** | A meaningful new act, fact, source, term, or context, rather than a different spelling of the same thing. |
| **Known concern** | A vulnerability, priority, or worry the player has actually learned about; required for relevant Predatory uses. |
| **One repair episode** | The visit-scoped opportunity to address a particular serious concern, with non-consuming clarification. |
| **CR-01** | The exact first-build closure policy, approved 2026-10-17 (Sign-off A) with the preview notice in §2.12 C2. |
| **Actor** | An identified participant such as the player, Tamsin, Orrin, or absent Nera; not every world entity is an actor. |

## Additional programming and testing terms

| Term | Everyday meaning |
|---|---|
| **Typed core** | Program rules whose records distinguish money, people, events, permissions, and other kinds of data explicitly. |
| **Type** | A declared kind of value with allowed uses, such as an amount, actor reference, or promise status. |
| **Enum / named choice** | A small allowed set of named values, such as accepted, declined, or confirmed. |
| **Field** | One named place in a stored record. |
| **Validation error** | A violation of a declared data or execution rule, distinct from an NPC choosing to refuse. |
| **JSON / YAML** | Readable formats for structured data. Examples here illustrate information, not a final mandatory syntax. |
| **Markdown** | The plain-text document format used by this master file, with headings, tables, and links. |
| **TypeScript** | A possible typed JavaScript-based implementation language proposed for builder review, not a selected framework/version. |
| **JavaScript** | The language used in the existing browser executable. |
| **DOM** | The browser’s representation of page elements; core game rules should not depend on it. |
| **Module** | A code unit with a defined responsibility and interface. |
| **API / read API** | An agreed interface for asking a component to perform or return something; access limits still apply. |
| **Command** | A deliberate request to the runtime, such as sending a message, performing a search, or confirming terms. |
| **Resolver** | The component that computes the actual outcome of a supported requested action. |
| **Effect** | A declared change caused by an actual event, such as custody movement or permission restriction. |
| **Staging / working copy** | Preparing related changes in temporary state before accepting the whole result. |
| **Commit** | Making the validated staged result the authoritative state once. |
| **Rollback** | Discarding staged changes after a technical failure rather than leaving half an operation applied. |
| **Duplicate command** | The same request received again through retry; distinct from intentionally repeating a new message. |
| **Nonce / neutral ID** | An identifier used for bookkeeping without encoding hidden story meaning or selected tactics. |
| **Dereference** | Follow an ID to its record. An NPC cannot use a source pointer to bypass its allowed view. |
| **Cache** | Stored derived information reused for speed; it must obey the same secrecy and version rules as fresh data. |
| **Proxy feature** | A renamed or indirect value that could leak a secret, such as an asset ID uniquely encoding a hidden tactic. |
| **Snapshot identity** | The particular saved content/state version used by a run or comparison. |
| **Serialization version** | A label identifying how a saved record is structured, separate from the master document’s version. |
| **Bundle** | A packaged set of code/content or a group of exchange resources, depending on context. |
| **Offline bundle** | A local runnable package without a required runtime network service; actual launch behavior must be tested. |
| **Local storage** | A browser persistence mechanism; a manual export remains necessary when it is unavailable. |
| **Expression provider** | An optional component returning wording or performance for an already validated outward act. |
| **Semantic equivalence** | Whether two communications mean the same relevant thing; arbitrary prose equivalence is not automatically proven here. |
| **Interpretation rule template** | A reusable pattern with allowed support, correction, and response choices. |
| **Binding** | An instance’s assignment of concrete actors, subjects, and scope to a reusable template. |
| **Predicate / condition** | A test of a declared fact or state, such as whether a warning was delivered. |
| **Eligibility** | Whether an action or response is available under the required constraints, before selecting among it and alternatives. |
| **Priority comparison** | Choosing among eligible responses according to the character’s authored concerns and state. |
| **Tie rule** | A declared deterministic choice when two eligible options compare equally. |
| **Root deduplication** | Counting one original evidence source or cause only once despite copies or retries. |
| **Metamorphic / perturbation test** | Change one input that should not matter, such as a hidden label, and check that the protected result stays unchanged. |
| **Unit test** | A check of a small operation in isolation. |
| **Browser test** | A check of the actual visible interaction and controls in a browser. |
| **Static review** | Inspecting text or code without executing the game. |
| **Reachability test** | A check that a required success or failure route can actually be reached from the specified start. |
| **Coverage matrix** | A table tracking which defined combinations have content and which checks were actually completed. |
| **Test harness** | The runner and fixtures used to execute checks; writing its plan is not a passed test. |
| **Regression** | A change that breaks previously intended behavior. |
| **Portability** | The ability to reuse common meanings and rules with different scenario content or host connections. |
| **Wireframe** | A simple layout sketch of a screen before final visuals exist. |
| **Causal trace** | The actual recorded chain of evidence, decisions, and effects explaining a result. |

## The twenty vibe names

| Term | Everyday meaning |
|---|---|
| **Reckless** | BA: opposition carried forward rashly. See Part 4 for the preserved fusion definition and first-build example. |
| **Instigating** | BS: provocation using social framing. See Part 4 for the preserved fusion definition and first-build example. |
| **Condemning** | BE: an emotionally informed judgment or accusation. See Part 4 for the preserved fusion definition and first-build example. |
| **Extortive** | BD: pressure through uncertain or concealed leverage. See Part 4 for the preserved fusion definition and first-build example. |
| **Menacing** | AB: a forceful advance with a threatening consequence. See Part 4 for the preserved fusion definition and first-build example. |
| **Commanding** | AS: assertive, socially authoritative direction. See Part 4 for the preserved fusion definition and first-build example. |
| **Urgent** | AE: immediate action framed through recognized stakes. See Part 4 for the preserved fusion definition and first-build example. |
| **Hustled** | AD: pressure to decide quickly with selective emphasis. See Part 4 for the preserved fusion definition and first-build example. |
| **Irreverent** | SB: rapport or levity carrying a pointed challenge. See Part 4 for the preserved fusion definition and first-build example. |
| **Charismatic** | SA: confident rapport moving the task forward. See Part 4 for the preserved fusion definition and first-build example. |
| **Compassionate** | SE: supportive concern; may include requests. See Part 4 for the preserved fusion definition and first-build example. |
| **Coaxing** | SD: gentle steering through selective attractive framing. See Part 4 for the preserved fusion definition and first-build example. |
| **Steadfast** | EB: understanding combined with a firm position. See Part 4 for the preserved fusion definition and first-build example. |
| **Boundaried** | EA: recognizing limits and setting a clear next step. See Part 4 for the preserved fusion definition and first-build example. |
| **Communal** | ES: a shared-interest appeal to cooperation. See Part 4 for the preserved fusion definition and first-build example. |
| **Deflecting** | ED: acknowledging a concern while redirecting attention. See Part 4 for the preserved fusion definition and first-build example. |
| **Bluffing** | DB: representing specified leverage not demonstrated to the listener. See Part 4 for the preserved fusion definition and first-build example. |
| **Predatory** | DA: shaping an approach around a learned concern. See Part 4 for the preserved fusion definition and first-build example. |
| **Insinuating** | DS: inviting an inference indirectly, with possible social consequences. See Part 4 for the preserved fusion definition and first-build example. |
| **Feigning** | DE: performed alignment with an outward appeal to rely on that display, without certifying human sincerity. See Part 4 for the preserved fusion definition and first-build example. |

<a id="appendix-a"></a>
# Appendix A — Legacy and inherited numerical material

The old numbers explain where the design came from and what an M0 reuse review must examine. They are not a second active rulebook or evidence that the new prototype is already calibrated.


**Historical data only.** Legacy executable values and later draft suggestions are retained for traceability. The active rules in Parts 2–3 govern the new build. In particular, direct incoming-vibe reaction adjustments, selected-vibe “sees through” bonuses, automatic mood closure, and per-selected-vibe rewards are not allowed to re-enter the implementation through this appendix. PD-05 supplies the single proposed evidence-policy replacement. None of the tables below are fresh test results.

### A.1 Legacy executable response rows — inactive as v2 listener rules

These are the actual `defaultProfile` whole-vibe deltas before salience and repetition processing. Legacy session trust is not the later TRUSTS relationship. [B `defaultProfile`; F Appendix B.]


| Code | Vibe | Legacy session trust delta | Tension delta |
| --- | --- | ---: | ---: |
| `BA` | Reckless | -5 | +7 |
| `BS` | Instigating | -3 | +5 |
| `BE` | Condemning | -2 | +4 |
| `BD` | Extortive | -5 | +6 |
| `AB` | Menacing | -3 | +5 |
| `AS` | Commanding | +1 | +2 |
| `AE` | Urgent | +2 | +1 |
| `AD` | Hustled | -2 | +3 |
| `SB` | Irreverent | +0 | +1 |
| `SA` | Charismatic | +3 | -1 |
| `SE` | Compassionate | +4 | -2 |
| `SD` | Coaxing | +1 | +0 |
| `EB` | Steadfast | +1 | +1 |
| `EA` | Boundaried | +2 | -1 |
| `ES` | Communal | +3 | -2 |
| `ED` | Deflecting | -1 | +1 |
| `DB` | Bluffing | -4 | +5 |
| `DA` | Predatory | -4 | +4 |
| `DS` | Insinuating | -1 | +2 |
| `DE` | Feigning | -2 | +1 |


Other legacy defaults: patience 40; walk-away tension 90; minimum sharing trust 15; margin 1; flexibility 0.15; buying multiplier 1; selling multiplier 1. New sessions begin with trust 50 and tension 0.

The inspected formulas are:

```text
delivery trust change = round(whole-vibe trust delta × salience)
delivery tension change = round(whole-vibe tension delta × salience)
salience = 0.5 / 1 / 1.5 for Subtle / Nuanced / Overt

If the turn is not meaningful progress:
  positive trust changes become zero
  negative tension changes become zero

additional repeat tension = min(repeat count × 2, 6)
patience change = -1 - min(repeat count, 2)

trade ratio = max(0.05,
  profile margin + clamp(
    (current tension - (current legacy trust - 50)) × 0.002,
    -profile flexibility,
    +profile flexibility))
```

Bundle value adds money, goods quantity × value × the applicable buy/sell multiplier, and configured information values. The counteroffer changes money rather than silently changing goods/information. A trade is meaningful progress in the legacy code only when it is not an exact repeated proposal and its offered-minus-requested advantage exceeds prior recorded trade advantages. The richer semantic novelty policy remains open.

These implementation facts are preserved for selective reuse and comparison. Automatic old-save migration and the old tone-only/label-indexed reaction system are not part of the new build.

### A.2 Draft cue-to-temperament and need suggestions

These are generated suggestions, not universal personality rules. Cue inputs range 0–5; the draft activates social needs and delivery spots at scores of at least 3. Authors can override. [F §17.3; R21.]


| Cue | Temperament dial it sets | Social need it creates | When desperate, they… |
| --- | --- | --- | --- |
| **B** Belligerence | Pride: being contradicted stings | Respect, winning | Threaten |
| **A** Aggression | Impatience: less patience; repeats cost more | Progress, results | Rush and set deadlines |
| **S** Sociability | Openness: shares at lower receptiveness | Approval, belonging | Charm or beg |
| **E** Empathy | Insight: strengthens what they see through | Being understood, honesty | Appeal to your feelings |
| **D** Deception | Skepticism: wants better evidence | Control, advantage | Scheme |


### A.3 Historical draft whole-vibe preferences — not hidden-label detection

“Sees through” is a response preference toward a signal, not permission to know hidden truth or sincerity. A true statement may still be doubted. [F §17.4.]


| Cue | Usually soft to | Usually sore at | Sees through |
| --- | --- | --- | --- |
| **B** | Steadfast (EB), Boundaried (EA): a fair, firm challenge | Irreverent (SB), Instigating (BS): being mocked or baited | Bluffing (DB), Extortive (BD) |
| **A** | Urgent (AE), Commanding (AS): getting to the point | Deflecting (ED), Coaxing (SD): stalling | Hustled (AD) |
| **S** | Charismatic (SA), Communal (ES): warmth and company | Condemning (BE), Menacing (AB): coldness, judgment | Insinuating (DS) |
| **E** | Compassionate (SE), Communal (ES): real care | Feigning (DE), Predatory (DA): fake care | Feigning (DE), Deflecting (ED) |
| **D** | Insinuating (DS), Coaxing (SD): respects the game | Commanding (AS), Hustled (AD): being controlled | Coaxing (SD), Predatory (DA) |


### A.4 Historical draft reception-table generator — superseded input boundary

For each of the twenty vibe rows, start receptiveness and tension contributions at zero. For each cue score at least 3, use strength = score − 2. Its soft-to vibes receive receptiveness +2 × strength and tension −1 × strength. Its sore-at vibes receive receptiveness −2 × strength and tension +2 × strength. Its sees-through vibes receive tension +1 × strength alongside separate certainty handling. Add contributions, clamp generated rows to −20…+20, use authored replacements where provided, then apply layers and pins. [F §17.5.]

**Historical interpretation only:** the table was authoritative within the old draft reception role. ES-D03 now forbids using the incoming selected label as a reaction key. These numbers may inform reviewed outward-preference tuning, but this generator is not an active v2 listener algorithm.

### A.5 Draft temperament formulas


| Dial | Comes from | Starting formula |
| --- | --- | --- |
| Patience | A | 40 turns − 4 × A |
| Walk-away tension | B + A | 90 − 3 × (B + A) |
| Breaking point (switch to cornered vibe) | B | Tension 60 − 4 × B |
| Receptiveness needed to share | S | 30 − 4 × S |
| Starting receptiveness | Relationship | 20 for a stranger, ±10 per level of SOFT − SORE toward the speaker |
| Insight | E | Scales the tension added by what they see through |
| Skepticism | D | Certainty needed to accept a claim: D 0–1 needs 2 · D 2–3 needs 3 · D 4–5 needs 4 |
| Pride | B | Tension added when told something that contradicts their beliefs: + B |
| Grudge-holding | B + D | How slowly SORE cools |
| Warming | S + E | How fast SOFT builds |


“Scales,” “how fast,” and descriptive cooling rates are not complete mathematical functions. Bounds after layering, equal-priority ties, and several formulas still need decisions. No calibrated final tuning is claimed.

### A.6 Draft home, calm, cornered, and relationship rules

Selecting a home vibe fills lead cue 4, follow cue 3, remaining cues 1; the author may edit. Calm defaults to home. The cornered suggestion chooses the strongest of B/A/D as lead, with the strongest remaining cue that does not recreate calm as follow; ties use B, A, D, E, S. An authored choice may differ. Earlier source reports of exhaustive valid-pair checks were not rerun here. [F §17.7.]

Initial receptiveness in the later draft starts at 20 for a stranger, adjusted by ten per level of SOFT minus SORE and any permitted group influence, clamped to the declared range. This is not the legacy session's starting trust 50.

The historical draft allowed a small delivery contribution to SOFT/SORE only on real progress: once per vibe per world day and no more than one level (20 stored points) in aggregate from delivery alone. **That per-selected-vibe reward key is superseded**: current rewards must use actual observed acts and cause identities under ES-D03, and this short run has no adopted world-day system. Actual events can have stronger consequences. Exact clock, novelty, and overlap rules remain open. TRUSTS changes through reliability evidence, not delivery alone. [F §18.4; R21.]

### A.7 Historical draft certainty values and their v2 disposition


| Evidence | Starting certainty |
| --- | --- |
| Heard it (hearsay) | 2 |
| Supported: partial proof, or several sources agreeing | 3 |
| Read a document carrying a mark they recognize | 4 |
| Saw it, or holds proof | 5 |


Historical draft modifiers: +1 for a source TRUSTS at level 4 or higher; −1 for a vibe the NPC sees through; −1 for contradicting an existing belief; clamp final certainty to 1–5. **Do not use the incoming selected-vibe modifier in v2.** PD-05 limits adjustments to relevant available evidence and does not penalize a document merely for contradicting an unsupported belief. Draft D-score acceptance thresholds are 2 for D 0–1, 3 for D 2–3, and 4 for D 4–5. Doubting a claim does not mean it was never received.

**Historical source conflict:** a separate proof-phase criterion said recognized proof sets top certainty, while this formula treated it as a modifiable starting value. V2 recommends PD-05 for owner review: one strong-but-fallible policy with scoped recognition. Do not implement both old branches or the selected-vibe certainty modifier. PD-05 was approved with Sign-off B on 2026-10-17. None of these numbers are the legacy HEARSAY/SUPPORTED/OBSERVED ranks 1/2/4. [F §§21.1–21.3; W Q10.]

### A.8 Draft event-reaction examples

These are authored example reactions, not universal social laws or new mandatory Last Collection values. The default “deceived” reaction needs grounds for intentional deception; a correction alone does not prove it. Settlement requires agreed terms and an explicit cause reference. [F §14.3.]


| Event type | World effects (always) | Reactions (for those who learn of it) |
| --- | --- | --- |
| Bad deal | None beyond the trade itself | SORE +30 toward the other party; TRUSTS −20 |
| Kept promise | PROMISED\_TO becomes kept | TRUSTS +20 |
| Broken promise | PROMISED\_TO becomes broken | SORE +40; TRUSTS −40 |
| Promise released | PROMISED\_TO becomes released | None by default |
| Gift | HOLDS moves | SOFT +20, or +40 if it meets a NEED (and marks that need met) |
| Theft | HOLDS moves; OWNS unchanged | SORE +60 toward whoever they believe took it |
| Deceived (discovered) | None | SORE +40 and TRUSTS −40 toward whoever misled them |
| Settlement | Closes or reduces the referenced obligation | Withdraws SORE contributions citing the settled event, by the share the response policy sets |
| Access granted | MEMBER\_OF an access group, valid until a set time or condition | SOFT +20 toward the granter |
| Promotion | MEMBER\_OF rank moves one step up the ladder | None by default |
| Bridge collapses (example) | IS: the bridge's condition becomes broken | None by default |


### A.9 Draft verb consequence table

This table preserves the inherited response-policy wording so later agents can distinguish meaning from proposed consequences. The main document's safeguards qualify it: fear is not compulsory compliance; possession is not authority; settlement consideration is not forced acceptance; delivered words are not automatic world effects; and seeing/learning is now selective under PERCEIVED. [F §12.2.]


| Verb | Changed by | Default effect (response policy) | Does not mean |
| --- | --- | --- | --- |
| HOLDS | Confirmed trades, gifts, theft, loss | What can be offered; proof items enable Show | That they rightfully own it |
| OWNS | Sale, gift, inheritance (not theft) | By default may grant access to it; theft makes the owner SORE once they learn of it | That they have it on them |
| OWES | Deals create it; payment shrinks it; forgiveness closes it | Demand and settle moves; ongoing service counts as duty | That the debt is fair or agreed |
| PROMISED\_TO | Made by an event; closes kept or broken, or released by the promisee (neither kept nor broken). An ongoing duty ends only by release or by leaving its group or role | Duty, which feeds loyalty; broken means SORE up, TRUSTS down | That they will keep it |
| MEMBER\_OF | Join, grant, promote, expel or revoke, by someone with authority; expiry | Gates and permissions; identity groups add culture layers | Loyalty or affection |
| ALLOWED | Grants, revokes and laws from an authority | Gates on topics, places, goods, acts; breaking it is an event | That they will do it, or that it is safe |
| SOFT | Help, gifts, met needs; a small share of fitting delivery; cools over time | Better prices; shares trade-only information; warmer start | Trust |
| SORE | Harm, bad deals, broken promises, insults; a small share of grating delivery; cools; settling its event removes its share | Tense start; refuses favors and charges more at 3+; topic becomes taboo at 5. Never blocks an exchange marked as settling its cause | Fear, or a plan to retaliate |
| TRUSTS | Kept promises and claims that check out raise it; broken promises and exposed lies lower it. Delivery never moves it directly | Whose word counts as supported evidence | Liking |
| FEARS | Threats, harm, shows of power; fades with time | Gives in under pressure; avoids; may end the talk | Hatred or obedience |
| NEEDS | The situation; met by Trade, Tell or delivery | Pays more; accepts worse deals; shorter fuse; one SOFT boost per need entry when met | A request they made; they may hide it |
| AIMS\_FOR | Authored or set by events; ends when reached or dropped | Which NEEDS step is active; the goal is tradeable information | A list of steps (steps are NEEDS) |
| BELIEVES | Tell, Show, proof, witnessing; conflicting claims dispute it | What they act on; whether a lie is exposed | That it is true |
| IS | Events (the bridge collapses) | Topic content; conditions for other rules | Anyone's opinion; truth sits in the wrapper |
| HAPPENED | Never changes; only added | The "because of" behind feelings, debts and access | That anyone saw it |



<a id="appendix-b"></a>
# Appendix B — Decision register and verification links

The D numbers are the foundation’s historical decisions, LC-D numbers concern Last Collection, and ES-D numbers are the approved first-build system decisions. They are different registers and must not be renumbered into one another.

## B.1 Historical D-01–D-30

The source status is retained as history. These decisions remain applicable where not superseded by the later LC/ES decisions. In particular, historical references to BASED performance mean outward communication, not permission to inspect an incoming selector; D-30 authorized the earlier document, not this software build. Documentation/architecture checks satisfy historical naming and future-boundary decisions without implementing deferred modes. [F §04.1; v1.0 Appendix B.]

| ID | Historical source status | Source decision and context | Verification links |
|---|---|---|---|
| **D-01** | AGREED-DIRECTION | The core is independent and reusable across many games; setting content is supplied by the game. Established at the beginning of the chat. | LC-T38, LC-T57, DOC-C04 |
| **D-02** | AGREED-DIRECTION | Elegance and the NPC-centered experience govern mechanics before graphics. User explicitly foregrounded this before rebuilding. | LC-T01, DOC-C02 |
| **D-03** | LOCKED | Player-initiated loop: compose/send → NPC Intake → NPC Delivery → repeat/end. User said “agreed lock this in.” | LC-T01 |
| **D-04** | LOCKED | NPC initiation enters the same loop at Delivery; the player retains the same composition controls. | LC-T02 |
| **D-05** | LOCKED | Body and facial expression are packaged together as a complete performance pose. | LC-T34, LC-T60, DOC-C03 |
| **D-06** | LOCKED | Intake/Delivery can be short sequences; Delivery can be purposeful silence; pace is flexible; meaningful posture may persist. | LC-T34, LC-T35, LC-T60, DOC-C03 |
| **D-07** | LOCKED | Outcomes and factual correctness must not depend on animation playback. End currently just ends. | LC-T19, LC-T28, LC-T35, LC-T60 |
| **D-08** | AGREED-DIRECTION | Player BASED participates in the actual message, not only tone. User contrasted Boundaried and Menacing accusations. This supersedes the earlier strict wording/delivery separation. | LC-T03, LC-T05 |
| **D-09** | AGREED-DIRECTION | Player has no third-person encounter avatar; BASED is effectively the player's communicative “pose.” | LC-T01, LC-T04, DOC-C02 |
| **D-10** | AGREED-DIRECTION | No selectable player Intake for now. The human receives and interprets the response. | LC-T01, LC-T04, DOC-C02 |
| **D-11** | AGREED-DIRECTION | NPCs use the same twenty BASED vibes, but physical performances are not one-to-one with them. The user wants a repertoire beyond a twenty-pose ceiling. | LC-T34, LC-T45, DOC-C03 |
| **D-12** | AGREED-DIRECTION | Pose selection draws on who the NPC is, their current feelings/state, and what they are communicating. No additional player-specific relationship meter is needed. | LC-T15, DOC-C03 |
| **D-13** | AGREED-DIRECTION | SOFT, SORE, TRUSTS, and FEARS can target the player just as they target other people. The player belongs to the same world model. | LC-T31 |
| **D-14** | AGREED-DIRECTION | Reuse relevant existing state for dynamic posing rather than adding a new generic mood meter. Exact mapping remains open. | LC-T15, DOC-C03 |
| **D-15** | AGREED-DIRECTION | Relevant character state should support continuity across future modes; a character should not become a generic enemy merely because combat starts. Combat itself is not being built. | LC-T40, DOC-C04 |
| **D-16** | AGREED-DIRECTION | Current behavior expresses patterns in context, rather than a fixed personality label determining everything. | LC-T15, LC-T37, LC-T39 |
| **D-17** | AGREED-DIRECTION | Social maneuvers should compose from common encounter tools. Blackmail was an example, not a separately authorized blackmail subsystem. | LC-T24, LC-T27, LC-T59, DOC-C04 |
| **D-18** | AGREED-DIRECTION | The chosen broader name is Encounter System. The user explicitly preferred “encounter” over a narrower “interaction” label. | DOC-C05 |
| **D-19** | AGREED-DIRECTION | Keywords are literal words or short labels collected as expressive tools, not long prewritten dialogue choices. Shadowrun on Super Nintendo was the user's reference. | LC-T07, LC-T08, LC-T63, DOC-C05 |
| **D-20** | AGREED-DIRECTION | Keywords can be stacked where useful; Who/What/Where/When/Why/How are optional reusable tools, not mandatory fields. | LC-T07, LC-T08, DOC-C02 |
| **D-21** | AGREED-DIRECTION | Asking is within Request; Request also covers favors, permission, goods, and assistance. Remark is broader than investigation. | LC-T08, LC-T45, DOC-C02 |
| **D-22** | AGREED-DIRECTION | Remark can answer an NPC's question. Context can supply omitted words; the player may counter-question, offer, remark, or leave instead. | LC-T02, LC-T06, DOC-C02 |
| **D-23** | AGREED-DIRECTION | Why and short responses need contextual reference, bounded processing, repetition awareness, and the freedom to refuse an explanation. User accepted the four-guardrail explanation. | LC-T06, LC-T27 |
| **D-24** | AGREED-DIRECTION | NPCs must be able to form a read on the player from sent keywords, actual message meaning, BASED performance, and observable behavior. Include a bounded version in the initial playable target. | LC-T09, LC-T12, LC-T14, LC-T16, LC-T46 |
| **D-25** | AGREED-DIRECTION | An NPC's interpretation of the player is fallible and revisable, not an authoritative hidden player profile or mission readout. | LC-T04, LC-T10, LC-T11, LC-T13, LC-T18, LC-T20, LC-T29, LC-T41, LC-T64, LC-T68 |
| **D-26** | AGREED-DIRECTION | Indirect questions and remarks can create useful inferences without directly stating the target conclusion. This is not guaranteed mind control. | LC-T48 |
| **D-27** | AGREED-DIRECTION | NPCs can learn outward patterns, form expectations, and adapt; the player can recognize that adaptation and change approach. User confirmed this with “Yes, exactly.” | LC-T12, LC-T14, LC-T16, LC-T18, LC-T33, LC-T64 |
| **D-28** | AGREED-DIRECTION | Shared observation/adaptation is a building block for future modes. The Trapstar rail-shooter discussion is example-only and explicitly must not be hard-coded. | LC-T40, DOC-C04 |
| **D-29** | AGREED-DIRECTION | Prepare a consolidated foundation before the separate Codex multi-agent handoff. One connected playable encounter matters more than disconnected components. | DOC-C01, DOC-C06, DOC-C07, DOC-C08, DOC-C09 |
| **D-30** | AUTHORIZED-DELIVERABLE | The user requested this Markdown file, instructed the assistant to wait, then said “proceed.” This authorizes consolidation, not implementation. | DOC-C01 |

## B.2 Current Last Collection decisions

**DECIDED — LC-D01–LC-D09.** The typed execution authorization adopted the supplied prompt’s decision section. This does not approve the new defaults drafted in Part 3 or CR-01.

| ID | Decision | Required qualification | Verification links |
|---|---|---|---|
| **LC-D01** | Property recovery with the guest-scenario privacy element. | Last Collection is the one selected scenario, not four games. The address is not required for recovery. | LC-T21, LC-T30, LC-T32, LC-T37 |
| **LC-D02** | Recovering the case is the clear victory; relationships are separate side objectives. | Completed recovery cannot be revoked merely by a strained relationship or later loss of cooperation. | LC-T21, LC-T23, LC-T30, LC-T31, LC-T61, LC-T65, LC-T66 |
| **LC-D03** | Initial restriction, one repair opportunity, then closure after clearly warned escalation. | The episode must be meaningful, not a one-click trap. Exact CR-01 approved 2026-10-17, with the preview notice before any closing message. | LC-T17, LC-T18, LC-T19, LC-T33, LC-T62, LC-T69 |
| **LC-D04** | Optional payment with a credible nonpayment route. | Seed B’s nonpayment route must be reachable and motivated, not an always-failing nominal option. | LC-T22, LC-T23, LC-T24, LC-T65 |
| **LC-D05** | Generous time pressure plus a no-pressure author-testing mode. | No tight clock should hide weak NPC behavior. PD-12’s soft allowance of 24 was approved 2026-10-17 as a tunable default. | LC-T36, LC-T62, LC-T66 |
| **LC-D06** | One customer file contains handling and private contact sections; its layout is initially unknown. | A reasonable first paperwork request receives explanation/appropriate access, no grievance/restriction/repair cost. Serious concern requires context/pattern. Interpretation never rewrites the actual message, and the address is never required. | LC-T07, LC-T17, LC-T18, LC-T20, LC-T30, LC-T41, LC-T42, LC-T63, LC-T65 |
| **LC-D07** | Seed B nonpayment uses Tamsin’s witnessed record distinguishing the two charges. | Document only what the examined evidence supports; an allegation stays a claim. No official private-debt ruling, new debt/promise, player liability, or payment guarantee. Completed handover wording waits for the event. Orrin’s acceptance is character-specific and must be playtested. v2.1 (approved 2026-10-17): his motive is that the record ends the office’s treatment of his claim as paid; recognition outranks payment in the official Seed B fixture. | LC-T22, LC-T24, LC-T26, LC-T43, LC-T54 |
| **LC-D08** | Start with 12 coins as a tunable default; report spending, remaining funds, and debt separately. | Both zero-cost and six-coin recovery can win. Settle only the named real claim. Seed A ordinary collection costs nothing and an extra payment offer is declined, not automatically bribery. Money to bypass privacy has a different explicit meaning. A proposal transfers nothing. | LC-T22, LC-T23, LC-T25, LC-T26, LC-T28, LC-T31, LC-T44, LC-T61 |
| **LC-D09** | Seed A’s collected entry starts as ambiguous rack-removal shorthand, not a deliberate lie. | Tamsin later becomes evasive; preserve initial error and later concealment separately. | LC-T25, LC-T55 |

## B.3 Current system decisions

**DECIDED — ES-D01–ES-D10.** ES-D10 fixes safeguards and requests a proposed exact rule; it does not mark that rule approved. The seven agreed review clarifications are recorded in Appendix D and applied in the relevant contract/test text.

| ID | Decision | Required qualification | Verification links |
|---|---|---|---|
| **ES-D01** | Preserve all twenty vibes, six core communicative actions, and three settings in the first complete prototype. | The six are whereabouts, record challenge, evidence, grievance acknowledgment, access request, and exchange proposal; physical searches are separate. Finish all 120 act/vibe expressions at all settings: 360 coverage cases. All five works checks apply; test fixtures may supply prerequisites; never invent hidden facts or count disabled placeholders. Internal checkpoints may use a subset. | LC-T03, LC-T06, LC-T08, LC-T45, LC-T49, LC-T50, LC-T52, LC-T59 |
| **ES-D02** | Subtle is understated/indirect, Nuanced measured/clear, Overt foregrounded/explicit. | Prominence changes, not amounts/items/people/terms/promises/actions. The direct request is received at all settings; social implications may be recognized differently. Overt Feigning is not automatic detection. | LC-T05, LC-T51 |
| **ES-D03** | All twenty vibes obey the outward-information boundary, including Deception-following ones. | The listener never receives the incoming selected label or hidden intent. Equal complete outward information, same listener/state/context/variation state means equal listener result when only private selection changes. Represented leverage creates no resources; Predatory needs a learned concern; insinuation is socially accountable but not a contract; Feigning adds outward reliance on performed alignment, generalized to the primary act without inserting an ask. Compassionate may ask. Human sincerity is not simulated. | LC-T03, LC-T04, LC-T05, LC-T07, LC-T10, LC-T29, LC-T46, LC-T47, LC-T48, LC-T49, LC-T50, LC-T51, LC-T52, LC-T55, LC-T60, LC-T67, LC-T68, DOC-C09 |
| **ES-D04** | Use a small set of authored reusable interpretation rule templates. | Each names interpretation, support, correction, and possible responses; bind to NPC-local observations/priorities, not literal names. Include the private-information, handling-resolution, and dismissed-work examples. No universal suspicion meter. | LC-T11, LC-T14, LC-T15, LC-T16, LC-T17, LC-T37, LC-T64, LC-T68 |
| **ES-D05** | PERCEIVED is foundational and stored as linked observation records. | Store observer, source, received details, and relevant time/channel. Beliefs use the same lineage; no competing knowledge-source copy and no source dereference to hidden details. The world does not perceive. | LC-T09, LC-T10, LC-T11, LC-T12, LC-T13, LC-T20, LC-T27, LC-T29, LC-T32, LC-T33, LC-T40, LC-T46, LC-T52, LC-T59, LC-T67, LC-T68 |
| **ES-D06** | Build a new typed core, selectively reusing verified v0.1.0 parts. | Inspect catalog, validation, exchange/confirmation safeguards, and useful UI code. Do not stretch the old two-seat structure, rename old trust to TRUSTS, or reuse ranks 1/2/4 as the new certainty scale. | LC-T26, LC-T28, LC-T34, LC-T36, LC-T38, LC-T40, LC-T56, LC-T57, DOC-C08 |
| **ES-D07** | Preserve old saves/exports/executable untouched; use new-format scenarios and saves. | No automatic conversion. Specific useful content may be imported deliberately later with review. | LC-T33, LC-T56, DOC-C08 |
| **ES-D08** | Four guided Assembler areas: priorities/relationships, observed information, template settings, starting conditions. | Named choices and validation, not a programming language. Edit → validate → restart the same seed → compare. No live-run editing or new rule-type authoring. Inspector explains actual causes; sensitivity always concerns a specific interpretation. | LC-T39, LC-T53, LC-T58 |
| **ES-D09** | Keep seven responsibilities, but start with one lead builder and one independent tester through M2. | Specialists join only after shared contracts and the consequence path are stable; documentation does not launch agents. | DOC-C01, DOC-C06 |
| **ES-D10** | Draft exact closing behavior for owner approval while fixing the fairness guards now. | Ordinary clarification is not breach; reading/preview/drafting cannot lose repair; closure follows relevant warned escalation, never question count; a privacy refusal alone is not failure. The exact rule (CR-01) was approved 2026-10-17. | LC-T17, LC-T18, LC-T19, LC-T42, LC-T62, LC-T65, LC-T69, DOC-C01, DOC-C07, DOC-C09 |

## B.4 Sign-off record

| Group | Content | Current approval state | Promotion rule |
|---|---|---|---|
| Sign-off A | CR-01, exact visit-long restriction/repair/closure policy. | **Approved 2026-10-17** with one amendment: a preview notice before any closing message (§2.12 C2, LC-T69). | Done in v2.1: §2.12, Part 5 wireframe, §3.8 view table, and tests updated. Implement at M3. |
| Sign-off B | PD-01–PD-12, with each original O/S mapping in §3.0. | **Approved 2026-10-17** without amendment. | Builders finalize equivalent field/layout details and test expectations at M1–M2. |

No empty approval row defaults to Yes. Do not change decided LC/ES items back to OPEN merely because a supporting implementation task remains. Conversely, neither a later timestamp nor a complete kickoff block promotes a proposed default to DECIDED.

## B.5 Traceability interpretation

There are **49 registered source/approved decisions** here: 30 historical, nine Last Collection, and ten system decisions. Every one links to at least one behavior specification or document/architecture review check; every check in Part 7 cites one or more of these IDs. These links establish specification coverage, not executed runtime coverage. The 360 BASED cases are a separate parameterized implementation target within LC-T45.

<a id="appendix-c"></a>
# Appendix C — Source register and verification boundary

These references identify what was actually available and how it was used. They do not imply that a historical test result was rerun or that unavailable source history has been reconstructed.

## C.1 Authority order

Later direct owner instructions and the explicit review/authorization conversation govern this task. Next are the approved decisions in [V2P], then [v1.0] for still-valid material, [P], [F], [W], and [R21]. The executable [B] establishes what the old code contains, not what later design must remain. [O], [G], and the reviews are historical or explanatory sources except where their recommendations were adopted in [V2P] or the agreed clarifications.

The initial upload was for review only, despite the prompt’s generic sentence about upload equaling approval. The later typed “proceed,” following the clarified process, authorizes this master-document task and its listed decisions plus the review fixes. New proposed defaults are reviewed after delivery. This source hierarchy does not launch the prepared agents.

## C.2 Available sources

Byte counts below were read from the actual mounted files. The workbook was accessed as indexed text, so no raw-byte count or fingerprint is asserted for it. No source hash is needed for this document’s provenance table.

| Key | Exact source | Availability / use | Bytes when locally available |
|---|---|---|---:|
| **[V2P]** | `Encounter_Master_v2_Prompt_for_ChatGPT.md` | Full uploaded prompt available. Primary approved decision/output source, subject to the later explicit authorization and agreed review clarifications. | 23,975 |
| **[v1.0]** | `Encounter_System_Consolidated_Design_and_Architecture_v1.0.md` | Full local reference available. Scenario, history, technical proposals, LC-T01–40, glossary, inherited numerical appendix, and historical register retained or updated. | 178,048 |
| **[P]** | `Encounter_First_Scenario_Prompt_REVISED_FOR_REVIEW(1).md` | Full local revised scenario brief available. Its earlier selection-task limits and then-open observation representation are superseded where the v2 task/decisions explicitly change them. | 20,556 |
| **[F]** | `Encounter_System_Foundation_GDD_v0.1.md` | Full local foundation available. Relevant canonical loop, vocabulary, evidence, identities, source lineage, and open-register material checked through local/retrieved sections and v1.0 references. | 200,746 |
| **[R21]** | `Encounter Core — Verbs, Character Profile & Design Pass (2).md` | Full local revision 2.1 available. Inherited verb/card/number source; later approved semantics and scopes take precedence. | 44,158 |
| **[B]** | `Encounter_Core.html` | Actual local HTML available. Focused static checks confirmed catalog/profile, validation and named engine functions, legacy message/reaction handling, versions and public view. No game or original test suite executed for this document. | 102,613 |
| **[O]** | `Pasted text.txt` | Original full scenario-comparison brief available. Historical investigation and comparison scope, not authority to build four scenarios now. | 42,611 |
| **[G]** | `PSG_Context_for_Claude.md` | Local historical context available. Relevant semantic/social lineage is used; not an independent audit of every older branch or an instruction to implement all PSG features. | 48,923 |
| **[R-C]** | `Encounter Review — Response to the Counter-Review.md` | Full uploaded response available. Source of concrete privacy and witnessed-record refinements and the corrected coverage-workload discussion. | 5,406 |
| **[R-V]** | `Encounter First Build — Verdicts on ChatGPT's Seven Answers.md` | Full uploaded verdicts available. Supplies measurable coverage and editor limits; its no-ask Compassionate and consequence-free insinuation suggestions are not adopted. | 4,420 |
| **[W]** | `Encounter_System_32_Question_Decision_Workbook_v1.0.md` | Available through indexed source reads and earlier supplied excerpts; the relevant message/context, interpretation, evidence, offer, update-order, and S-01–S-04 sections were consulted. No local raw workbook file was used. | — |
| **[C]** | Current Encounter conversation | Direct owner choices, reviewed corrections, clarification that remaining sign-off happens after delivery, and final typed authorization. Not represented as a separately byte-verified transcript. | — |

The duplicate revised-brief attachment without `(1)` is also locally available and has the same byte count. It does not create a different decision version. The first screenshot review is represented through the available conversation and follow-up review documents; it is not claimed as a newly recovered complete textual source.

## C.3 What is not established here

The old separate editable-source/test archive and the original executable validation scripts were not recovered or executed during this document task. Their absence here is not proof that they do not exist elsewhere. M0 must inventory the actual implementation workspace and report any genuine gaps.

The old **253 engine tests and 29 browser checks** are historical reports referenced by [F], [W], and [v1.0]. They are not results for the new typed core, PERCEIVED implementation, 360-case coverage, Assembler, or Last Collection. Static code review and Markdown consistency checks are different kinds of work.

No exhaustive review of every prior chat, repository, asset archive, or historical PSG/TPL branch is claimed. No external web research was needed for this source-consolidation task. Technical arrangements marked PROPOSED are authoring recommendations made for this document, not undocumented features attributed to the sources.

## C.4 Retention map from v1.0

| v1.0 material | v2 location / treatment |
|---|---|
| Pitch, names, history, scope | Parts 0–1; four names corrected; review history added. |
| Actual executable architecture and limitations | §3.1, Appendix A, and this source boundary; old label behavior is historical. |
| Loop, keywords, BASED, ledger, identities | Part 2 and Part 4, with approved label/perception changes. |
| Events, reactions, needs, relationships, observer | §§2.8–2.11 and §§3.3–3.7. |
| Scenario seeds, privacy, searches, outcomes | Part 1, §2.12, §§3.5–3.6, 3.13. |
| Proposed modules, records, state, views | Part 3, now grouped into an explicit technical-default review. |
| Voice/TPL/performance and physical-action connections | §§3.6, 3.11–3.12, plus reserved future boundaries. |
| Assembler/save/migration discussion | Parts 5 and 8; live editing/conversion are now explicitly deferred. |
| Seven-role team and milestones | Part 6, with two-role start and two gated kickoff briefs. |
| LC-T01–LC-T40 | Part 7, identities preserved and expectations updated; LC-T41–68 added in v2.0, LC-T69 in v2.1. |
| All 32 question identities | §8.3, with current dispositions rather than relabeling approved items as open. |
| Glossary, inherited numbers, historical decisions | Part 9 and Appendices A–B, corrected and expanded. |

<a id="appendix-d"></a>
# Appendix D — Changelog

v2.1 changes are listed first. D.1–D.4 are the v2.0 changelog from v1.0, kept as written; where they call CR-01 or PD-01–PD-12 proposed or pending, that was true at v2.0 and is superseded by D.0.

## D.0 Changes in v2.1 (2026-10-17)

Made after an independent review of v2.0 and the owner’s approval on 2026-10-17. The full approval is in `Encounter_Approval_Record_2026-10-17.md`. v2.0 is kept unchanged as a source.

| Change | Type | Where | Why |
|---|---|---|---|
| Sign-off A (CR-01) approved, with a preview notice before any closing message. Closure condition 6 added: no closure unless that notice was shown. | Owner-approved amendment | §2.12 C2 and D; §1.3; §3.8; Part 5 wireframe; glossary; LC-T69 | Without the notice, a player who forgot the warning could lose with one send. With it, closure is always a deliberate choice. |
| Sign-off B (PD-01–PD-12) approved without amendment. | Owner approval | Part 0; §§2.4, 2.8, 2.9, 3.0, 3.3, 3.13; Part 5; Part 8; B.4; glossary | Lets builders treat the technical defaults as requirements instead of open questions. |
| Orrin’s Seed B motive made explicit: the witnessed record ends the office’s treatment of his claim as paid; recognition outranks payment in the official fixture. | Owner-approved design change | §1.6; §1.10 step 6; §2.11; LC-D07 note; LC-T24 | v2.0’s reason (“values a credible record and workable relations”) could read as Orrin simply caving. Now he trades leverage for the recognition he was holding the case to get. |
| Example ending in §1.8 corrected and both endings labeled by seed. | Correction | §1.8 | v2.0 combined a Seed B debt line with a Seed A result, which neither seed can produce. Builders treat examples as targets. |
| One-paragraph clarification of the existing no-proxy rule: a performed cue that only one vibe produces is allowed; only unperceivable information is forbidden. | Clarification, no rule change | §2.5; LC-T67; both kickoff briefs | Prevents the builder and tester from disagreeing about whether a distinctive performance counts as a hidden label leak. |
| Kickoff briefs point to v2.1 and require the approval record; they stop and ask if it is missing. | Handoff update | §6.4–6.6 | v2.0’s briefs required a sign-off record that did not yet exist. |
| Status labels, B.4, Part 8, and the consistency check updated for the approvals and the new test LC-T69. | Bookkeeping | Throughout | Keeps statuses and counts true. |

**Known remaining issue, not changed in v2.1:** D.4 below says repeated disclaimers were replaced. That overstated the v2.0 cleanup; many repeated “not proof / not approved” statements remain. They were left alone to avoid unrelated churn. Treat the status labels and the approval record, not those repeated sentences, as authoritative.

## D.1 Approved first-build changes (v2.0)

| Change | Governing decision | Effect |
|---|---|---|
| Make the privacy misunderstanding legitimate at first. | LC-D06 | Unknown file split; ordinary first request is protected; NPC interpretation cannot rewrite the sent act. |
| Make the nonpayment bargain concrete. | LC-D07 | Witnessed comparison and actual-release record replace vague official acknowledgment; no new debt/promise/guarantee. |
| Make money an independent outcome. | LC-D08 | Twelve starting coins, adjustable; zero/six spent can both win; reject needless ordinary Seed A payment without automatic bribery inference. |
| Separate shorthand error from later evasion. | LC-D09 | Preserve the original collected-from-rack meaning and later behavior independently. |
| Give BASED a finish line. | ES-D01 | Twenty vibes, six acts, three settings, 360 coverage cases with the five works checks. |
| Define salience once. | ES-D02 | Prominence changes while material content and action scope remain stable. |
| Enforce the outward-information boundary for every vibe. | ES-D03 | No hidden selected-label input; stronger account of Bluffing, Predatory, Insinuating, and Feigning. |
| Bound NPC interpretation. | ES-D04 | Reusable supporting/corrective patterns and real behavior changes; no global suspicion meter. |
| Select perception storage. | ES-D05 | PERCEIVED remains foundational and uses linked observations with one lineage. |
| Choose a new core and preserve earlier work. | ES-D06–07 | Selective verified reuse; no stretching old seats, raw trust/rank conversion, or automatic old-save migration. |
| Limit the first editor. | ES-D08 | Four guided areas, fixed template types, restart workflow, no live-run mutation. |
| Start the team smaller. | ES-D09 | Lead and independent tester through M2; seven roles remain responsibilities. |
| Preserve the closing safeguards while drafting the exact rule. | ES-D10 | CR-01 is proposed for post-document owner review, not silently approved. |

## D.2 The seven review clarifications incorporated (v2.0)

1. **Document scope and authority.** This is the requested layered v2 reference plus a proposed technical package and two prepared kickoff briefs, not an implementation run. Its proposed sections do not override established requirements because the file is newer.
2. **Approval boundary.** The reviewed upload did not itself approve execution. The later typed authorization adopts the prompt’s LC/ES decisions; newly drafted defaults and closure remain pending after delivery.
3. **Old reception-table conflict.** Direct incoming selected-vibe reaction lookup is superseded. Historical tables are preserved only as source data; live preference evaluation uses outward content and legitimate local context.
4. **Feigning generalization.** The approved request example applies its performed-alignment principle to the other primary acts without automatically inserting a new request. Compassionate requests remain valid.
5. **Grouped sign-off.** Related technical defaults are one explicit owner review package, with builder field/layout choices separated. The exact closure rule is the other owner item; the document does not recreate seven or thirty-two open owner questions.
6. **Test precision.** Equal-outward-information tests hold NPC, relevant state/context, and variation state fixed. Document/architecture reviews cover historical and deferred-boundary decisions without forcing future features into the build. Coverage plans are not passed runtime tests.
7. **Worked-example consistency.** Each seed demonstrates a later evidence-supported restriction and repair, not punishment of the first ordinary request solely to force the mechanic into the example.

These clarify implementation of the approved task; they do not authorize unrelated new mechanics. [C review and explicit confirmation about incorporating sections 1–7.]

## D.3 New proposals drafted for owner/builder review (v2.0; approved in v2.1)

CR-01 specifies one visit-long repair episode and a precise renewed protected-demand closure predicate. PD-01–PD-12 specify the bounded grammar, context binding, linked local records, evidence calculation, offer lifecycle, one commit path, public/observer separation, expression fallbacks, and connected local state rules. Their record names, TypeScript/layout example, and wireframes are builder proposals. The soft allowance of 24 and the detailed evidence thresholds/adjustments are tunable proposed defaults, not original source decisions.

The first-demo nonpayment record flow separates comparison-note issuance from actual handover completion. The outcome view qualifies unknown debt and privacy facts. No elaborate printing, forwarding, machinery, promise, or combat subsystem has been imported from the discarded scenario candidates.

## D.4 Editorial and traceability fixes (v2.0)

A short front section now distinguishes decided/open/deferred work and the timing of sign-off. Chat-specific citation artifacts are replaced by portable source keys. The four-name table has a matching heading. DPA is expanded. The historical decision register and LC-T01–40 identities are retained, and tests are linked in both directions. Builder sections use short plain-language introductions. Repeated disclaimers are replaced by explicit status assignments and one source/verification boundary.

The glossary is expanded to cover the technical vocabulary actually used. Legacy numerical material is retained with clear superseded-input warnings. The original files remain unchanged.


<a id="consistency-check"></a>
# Consistency check

These are checks of this document’s structure, cross-references, and stated rules. They are not evidence that the unbuilt prototype has passed its gameplay tests.

1. **Portable references:** No chat-specific citation artifacts remain. Source keys and section references replace the old tool-dependent links.
2. **Compassionate requests:** Compassionate may include requests throughout the active rules, examples, coverage plan, glossary, and kickoff instructions. Feigning’s distinguishing outward alignment does not require inserting an extra ask.
3. **Information boundary:** Listener inputs exclude the incoming selected-vibe label and the human player’s hidden intent. Historical direct-label tables are marked inactive; an NPC’s own private outgoing selection is not incoming knowledge.
4. **Salience and exact terms:** All three settings preserve items, people, quantities, scope, terms, and commitments. The example changes only the prominence of the same social framing.
5. **Witnessed record:** The comparison note documents available evidence. It creates no debt, promise, player liability, or payment guarantee; completed-handover wording requires the actual event.
6. **Decision consistency:** All 19 DECIDED LC/ES rows in Part 0 have matching records in Appendix B. The three further DECIDED rows added in v2.1 (Sign-off A, Sign-off B, and Orrin’s Seed B motive) are recorded in Appendix B.2/B.4 and the approval record. The 30 historical D records are retained with their original status/context and applicable later qualifications.
7. **Traceability:** Each of the 69 behavioral test specifications and 9 document/architecture review checks cites a registered decision. All 49 registered historical/current decisions have at least one verification link; the original LC-T01–LC-T40 identities are preserved. Conditional and deferred-boundary checks are not represented as completed runtime features.
8. **Kickoff completeness:** Both prepared M0–M2 briefs contain context, authorization gates, scope, inputs, deliverables, exclusions, acceptance checks, reporting instructions, and limits on independent decisions. They require this document, the 2026-10-17 approval record, and the supplied workspace, not an inaccessible chat history. Neither brief has been sent or executed.
9. **Front-summary size:** Part 0 contains about 843 words in v2.1, excluding the contents list. At an assumed 180 words per minute, that is about 4.7 minutes; actual reading time varies. Markdown has no fixed page size, so the short opening is designed for roughly two normal text pages rather than claiming a measured pagination result.

10. **v2.1 changes:** Every v2.1 change is listed in Appendix D.0 with its location. CR-01 and PD-01–PD-12 carry DECIDED status where their status is stated; remaining explanatory “proposed/pending” wording for them is covered by the reading rule in Part 0.

**Document-production checks completed:** Markdown structure, balanced code blocks, consistent table columns, navigation targets, source-artifact removal, coverage-table dimensions, and decision/test cross-links. **Not executed:** game-engine tests, browser gameplay checks, the 360-case BASED suite, the kickoff briefs, or human playtests. Those remain future implementation and acceptance work.
