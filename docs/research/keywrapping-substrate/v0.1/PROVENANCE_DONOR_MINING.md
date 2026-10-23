# Knowledge, provenance and perspective donor mining

**PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT**
Version: v0.1
Date: 2026-10-22
Role: Knowledge, Provenance & Perspective Miner

This document proposes Encounter-specific information boundaries for later synthesis and independent audits. It creates no runtime behavior, persistence format, schema, permission, integration or acceptance. Field and record names below are explanatory candidates. The owner approved production of this documentation package, not every proposed detail within it.

The supplied Complete KeyWrapping Context v0.1 is the design baseline. Its latest corrections govern earlier exploration; the Design Review and Reply to the Second Review supply attributed recommendations and refinements. C2.1 B0 is a comparison input and does not override that source pack or become an accepted implementation contract. Repository ownership and frozen-package boundaries remain in force. References to existing provenance conventions do not authorize modifying C1, C2.1 B0 or another package.

## Evidence and selective donor use

The following primary sources were inspected on 2026-10-22. The dated Recommendation URLs identify the research baseline; rolling latest-version and repository notices are recorded separately. No donor ontology, example dataset, diagram, specification text or code is vendored here. The Encounter requirements and scenarios below are original proposals, not an assertion of PROV or ActivityStreams conformance.

| Source and exact baseline | Concepts retained for comparison | Concepts adapted or rejected | License evidence and intended use |
| --- | --- | --- | --- |
| [PROV-O, W3C Recommendation, 2013-04-30](https://www.w3.org/TR/2013/REC-prov-o-20130430/) | Entity/activity/agent separation; generation, use, derivation and attribution; qualified relations | Adapt links into narrowly typed Encounter evidence. Reject automatic knowledge, truth, permission or identity inferences from a provenance edge; no OWL/RDF dependency | Publication identifies W3C document-use rules. Its document-use link currently resolves to the [2023 Document License](https://www.w3.org/copyright/document-license-2023/). Conceptual reference only |
| [PROV-DM, W3C Recommendation, 2013-04-30](https://www.w3.org/TR/2013/REC-prov-dm-20130430/) | Descriptions can themselves have provenance; quotation and revision distinguish later accounts from earlier material | Use separate accounts and immutable communication history. Do not treat a provenance bundle as a sealed container or access control; do not equate alternate/specialized descriptions with actor-known alias equivalence | Same document-use notice and linked restriction as PROV-O. Historical [2002 Document License](https://www.w3.org/copyright/document-license-2002/) also inspected. No copied/adapted technical-specification text |
| [ActivityStreams 2.0 Core, W3C Recommendation, 2017-05-23](https://www.w3.org/TR/2017/REC-activitystreams-core-20170523/) | Distinguish potential/completed activity descriptions; compare identity, activity participants and context; heed privacy/security concerns | Encounter needs separate communication, receipt and validated effect records. Reject automatic JSON-LD serialization, remote resolution, federation and claim-to-effect conversion | Current [official repository license](https://github.com/w3c/activitystreams/blob/main/LICENSE.md), inspected through GitHub, links the W3C Software and Document License. Current license file metadata: modified 2026-01-15T18:16:10Z. This is distinct evidence from the dated Recommendation |
| [Activity Vocabulary, W3C Recommendation, 2017-05-23](https://www.w3.org/TR/2017/REC-activitystreams-vocabulary-20170523/) | Compare actor/object/target/result and audience; activity types offer useful naming comparisons | [Audience targeting](https://www.w3.org/TR/2017/REC-activitystreams-vocabulary-20170523/#audienceTargeting) describes creator intent and leaves enforcement largely to implementations. Intended recipient is not proof of reception, comprehension or authorization. Do not import a universal Undo or a social-media audience model | Same repository license evidence. [2015](https://www.w3.org/copyright/software-license-2015/) and [2023](https://www.w3.org/copyright/software-license-2023/) W3C Software and Document licenses inspected; copying/modification carries notice requirements. This pass cites concepts without copying artifacts |

The PROV document license expressly restricts publication of derivative technical specifications. The chosen use is independent Encounter design with brief concept references and links, avoiding adapted definitions and examples. A future copied ontology, context file, specification excerpt or dataset requires its own artifact-specific rights record and notices; a license on one repository is not blanket clearance for every dated publication. These observations record source notices and the current use decision, not a legal determination about future artifacts.

## Source-pack requirements and recommendations

The baseline's sections 4.4, 12, 19-21, 23-25 and 30 establish the essential separation: events happen; actors perceive or receive limited information; actors interpret it; the Player earns vocabulary through eligible encounters and discovery. Recognition and receipt do not imply endorsement. An internal wrapper reference grants no right to expand nested contents. Canonical history remains coherent while actors disagree.

The baseline recommends explicit perspective checks at lookups, UI projections, NPC decisions, exports and receipts. Its suggested stable IDs, record shapes, cycle bounds and append-only evidence remain design recommendations rather than accepted storage contracts. The Review adds warnings about labels, source displays, rumor hops and alias discovery; the Reply refines the proposed performative conditions and advocates retaining learned keywords. Exact propagation, inference, naming, retention and presentation policies are still open.

## Proposed distinctions to preserve

The following is an Encounter proposal for synthesis. These are logical roles; they need not be separate services, files or database tables.

| Logical record or view | What its existence establishes | What it does not establish |
| --- | --- | --- |
| Canonical occurrence | A validated world occurrence and its authoritative causal position | That anyone perceived it, knows its cause, can name its participants or may inspect it |
| Observation | A particular actor perceived a specified fragment through a specified channel under recorded conditions | Complete coverage, correct identification, accurate interpretation or belief |
| Communication and delivery receipt | A specific expression was emitted, and a specified recipient actually received a specified portion | Every intended listener heard it, understood it, believed it, agreed, or received nested information |
| Evidence reference | A scoped artifact or receipt is available for a stated use, with source and integrity information where known | The proposition it supports is true, the speaker is honest, or the recipient may inspect every attached record |
| Transmitted claim | A speaker asserted a proposition, possibly quoting another account | The proposition occurred; the named source really said it; the speaker believes it |
| Actor-local interpretation | An actor's belief, doubt, hypothesis, denial or private explanation at a recorded point | A canonical fact, another actor's mental state, or a public disclosure |
| Private communicative intent | A private intention or deliberate misrepresentation when explicitly modeled | A Player-visible lie marker. Objective falsity alone is not evidence of intentional lying |
| Wrapper identity | Durable addressability for a subject, including an alleged/fictional/contested subject where appropriate | Existence of the alleged event, all its relationships, shared knowledge, globally shared naming or promotion into truth |
| Actor-local alias and identity association | The holder has a particular label or an acquired association between known handles | Global identity equality visible to that actor or retrospective access to the other handle's history |
| Player projection | A bounded presentation of information the Player character legitimately acquired | Director access, raw world state, private NPC state or an unrestricted graph query |

One actual shooting, three observation fragments, four reports and several incompatible interpretations can coexist. A fabricated report may have real utterance and reception history while its alleged shooting has no validated occurrence. Link the report to an allegation subject when existence is unresolved; do not manufacture a canonical occurrence to satisfy a mandatory event reference.

Record the scope of every claim: subject, predicate/action, participants as the speaker identified them, time or temporal uncertainty, polarity and qualification. The complete expression belongs to communication history; a recipient's receipt contains only the part actually available to that recipient. A partial overhearing must not receive the full structured expression because the original expression is easier to reference.

## Actual source, asserted source and holder-known source

An account needs three distinguishable questions:

1. What actually produced this record or information transfer in authoritative history?
2. What source did the speaker claim, quote, omit or fabricate?
3. What source does this holder currently know or believe, and why?

For example, Ray heard Dee repeat an accusation but tells the Player, "I saw it." The world can retain Dee's communication as the actual origin of Ray's information. The Player receives Ray's eyewitness assertion, not the hidden Dee link. Ray's claimed source must neither replace actual provenance nor silently expose it. The Player may doubt Ray without acquiring a canonical lie classification.

Unknown provenance is not negative evidence that no source exists. Secret provenance is not automatically a visible "secret source" placeholder. When the Player knows that Ray claims to protect a source, that utterance can be shown with attribution; when the Player has no such knowledge, a redaction badge or hidden-source count would itself disclose information. Distinguish unavailable records from actor-known uncertainty internally, and disclose the distinction only when acquired legitimately.

An integrity hash proves identity within its declared byte/canonicalization scope. It does not prove truth, source authenticity, owner acceptance or access rights. Avoid publishing a hash of a hidden low-entropy fact as a purportedly safe redaction; matching guesses could reveal the fact.

## Rumor hops and independent corroboration

The Review's cheap rumor hop is an optional Encounter proposal, not an adopted world-simulation requirement. If selected later, every applied hop should retain the actual sender, recipient, channel or bounded background mechanism, source account, delivered proposition, time/order and any distortion. Whether to attempt a hop depends on explicit scenario/relationship conditions and a bounded scheduling policy. No current document installs that scheduler or requires fully simulated offscreen conversations.

Distortion produces a new communicated claim linked to the earlier account; it must not mutate the source utterance or canonical event. A holder may know only the immediate teller. Full actual hop history can stay private. A claim about an unknown subject can enter as a report without confirming the subject's existence.

If Ray tells Dee, Dee tells Len, and Len tells Ray, three receptions are not three independent eyewitness sources. Preserve shared origin when known internally; do not let a cycle amplify confidence merely by returning the same information. Actor-local evaluation may mistakenly regard reports as independent if the actor lacks the connection, but that mistake must remain attributed to that actor. The authoritative provenance must not make the same error.

Retelling, overhearing and forwarding use distinct delivery evidence. Neither relationship membership, co-location, intended audience nor elapsed time alone proves receipt. A failed or unperformed propagation attempt grants no knowledge and no visible keyword. Confidentiality norms and capability to repeat are separate: learning something does not necessarily give an actor social permission to share it, and lacking permission does not make physical disclosure impossible.

## Inference rights and guessed secrets

Inference should use only premises available to the actor at the evaluated point, plus explicitly authorized scenario background knowledge. An outcome may be correct by coincidence without becoming confirmed knowledge. A belief such as "Marcus probably fired first" must retain its inferential or conjectural status even if hidden canonical history agrees. Do not validate an actor's guess by querying a secret and then show confidence, completion, selectable actions or wording that confirms the match.

Knowing all visible premises does not authorize every conceivable conclusion. Later synthesis must identify allowed inference rules, uncertainty treatment, contradiction handling and resource limits. No automatic logical closure over the world graph, all aliases or another actor's private beliefs is proposed. NPC decisions can read the NPC's private perspective and relevant authorized world capability checks, while dialogue realization receives only the decided expression and outwardly permitted cues. A private refusal reason need not be disclosed and may be misrepresented deliberately.

The Player's real-world guess is distinct from acquired vocabulary. A Player who knows Marcus can accuse Marcus using legitimate known references without proving guilt. A walkthrough must not unlock an otherwise unknown person or secret handle. Any design for expressing speculation must preserve the no-scratchpad/no-direct-keyword-authoring rule; a private Player hypothesis editor is not introduced by this proposal.

## Aliases, re-identification and time

The world may maintain one underlying person while the Player holds "the shopkeeper" and "Eddie" as unconnected handles. Equality of an exposed global ID would reveal the connection. Candidate public handles should therefore be audience-scoped and reveal no hidden canonical joining key. Their exact encoding and stability policy remain open.

A later eligible identity reveal adds an acquired association at its actual discovery point. It can change the current Player projection to connect already known facts. It must not rewrite what an earlier speaker knew, relabel past utterances as if the proper name had been known then, disclose sealed history attached to Eddie, or assert that every other actor learned the same association. A mistaken re-identification remains a holder-local claim until supported; avoid globally merging two canonical persons based on one actor's assertion.

Distinguish occurrence time, utterance time, reception time, inference time and disclosure/learning time. Historical views require the actor's knowledge cutoff, not today's richer account. Preserve the original wording and terms when presenting a historical utterance, with a separately marked present-day explanation if the projection permits it.

Promotion may retain a person because a consequential act affected them even when nobody identified the Player. The promotion reason, relationship graph and simulation priority are internal data unless legitimately learned. Increasing significance or retaining a canonical death must not notify every relative, name the victim for the Player or reveal an investigation.

## Proposed safe-projection requirements for synthesis

The following proposed requirements are acceptance candidates for architecture and record design. They are not an installed API or claims of tested enforcement.

| ID | Requirement | Required rejection or bounded behavior |
| --- | --- | --- |
| KP-01 | Bind each lookup to audience, authorized purpose, world/run snapshot and knowledge cutoff | Reject absent/ambiguous contexts; never fall back to an omniscient default |
| KP-02 | Authorize existence, fields, relations and each nested expansion separately | Knowing a parent or its label cannot disclose unknown children, participants, source chains or their counts |
| KP-03 | Retain an actor-eligible acquisition or inference basis for every newly exposed proposition or reference | No shared-wrapper recognition shortcut; no unperformed delivery as acquisition |
| KP-04 | Keep source attribution and interpretation status in the authorized projection | Show "Ray says" when that is known; do not upgrade the claim to neutral world narration |
| KP-05 | Generate labels from the audience's acquired information and preserve attributed names | Do not label a scene "Marcus's betrayal" as objective truth or reveal a nameless person's proper name |
| KP-06 | Treat status, type, IDs, timestamps, revision gaps, ordering, search matches, autocomplete, disabled controls, relation counts, thumbnails and diagnostic text as information | No hidden culprit revealed by sorting, status badges, successful lookup or a different error for a guessed secret. Composer filtering uses acquired reference/type information, not hidden objective capability, inventory, ownership, permissions or NPC facts |
| KP-07 | Project before serializing, rendering, indexing or giving material to a dialogue renderer | No full world object passed to an actor export and then cosmetically hidden by UI |
| KP-08 | Keep actor exports separate from privileged Director/save/replay artifacts | A full save is never an actor-safe export; receiving a save artifact in tooling grants no in-world knowledge |
| KP-09 | Bound traversal by typed edges, per-edge permission, visited identity and depth/work budget | Cycles stop safely; truncation must not disclose hidden graph size or edge existence |
| KP-10 | Preserve append-only communication/acquisition history and exact snapshot references where history is required | Later beliefs, aliases and proposal versions cannot silently rewrite earlier receipt contents |
| KP-11 | Replay the same acquisition and effect history once within its declared identity/revision scope | Reload/retry must not fabricate a second receipt, repeat effects or grant present-day knowledge to past listeners |
| KP-12 | Preserve separate actual provenance, source assertions and holder-known provenance | A fabricated source cannot corrupt authoritative lineage; a hidden true source cannot leak through a source display |
| KP-13 | Make revocation, retention and export policy explicit rather than accidental | Hiding a current view does not erase a learned fact from history; archival salience alone does not authorize forgetting |
| KP-14 | Audit observable behavior through the chosen authorized surfaces | NPC response can be an intentional clue; internal scores, deception intent and private reason codes are not exposed automatically |

Inaccessible and nonexistent guessed handles should have the same actor-facing behavior wherever the actor is not entitled to distinguish them. A known absence or an acquired statement that a document is confidential can be shown; universal generic redaction placeholders would reveal more than they protect. The owner must later choose how explicit uncertainty appears when the character already knows a question exists.

Unknown, denied and missing references need safe failure behavior. For an unacquired guessed handle, do not reveal which of those causes applies. For an already acquired handle whose material cannot currently be projected, preserve only legitimately known information and show a bounded unavailable result if warranted by that known context; keep permission diagnostics, storage failures and broken hidden links in privileged diagnostics. Do not return a placeholder for every hidden related record. An internal integrity failure can be diagnosed without telling an actor that a concealed entity exists.

Discussability is separate from objective feasibility. A known person may be asked for an unavailable object, make an impossible offer, or discuss an action they cannot perform. A composer must not remove a verb or disable a proposition merely because a hidden inventory/authority/capability check fails. It can use known types to prevent malformed expressions and known facts to provide attributed context; any intentional disclosure of new capability information needs its own authorized outward interaction. Final world validation remains a separate boundary and must not silently leak its private reason through composer options.

## Proposed negative controls for independent audits

These are documentary scenarios to evaluate, not automated tests run in this pass. The sealing auditor should independently inspect each outward surface, including JSON examples and failure cases.

| Control | Setup | Passing boundary |
| --- | --- | --- |
| Hidden event | Only one NPC sees the guard fire first; Player hears shots | Player gets no shooter identity from wrapper expansion, tags, title, counts or export |
| False testimony | Ray falsely claims Marcus shot first | Player can quote Ray's accusation; no canonical shooting or guilt fact is generated from receipt |
| Hidden source | Ray repeats Dee's story while claiming eyewitness status | Actual Dee link retained privately; Player sees only received source assertion and eligible cues |
| Phantom allegation | NPC describes a murder that never occurred | A report can be referenced without constructing a validated murder occurrence |
| Partial hearing | Listener hears the subject and final word, not the named actor or condition | Receipt contains only the received fragment; referenced expression cannot restore omitted terms |
| Rumor loop | Ray → Dee → Len → Ray | No authoritative independent-source multiplication, automatic belief synchronization or world truth promotion |
| Alias reveal | Player knows an unnamed shopkeeper; later learns Eddie's identity | Current authorized facts can connect; historical knowledge and unknown private facts remain sealed |
| Correct guess | Player conjectures the secret culprit from permitted clues | Correctness does not trigger confirming labels, special lookup success or hidden truth status |
| Composer oracle | NPC secretly loses a key or authority, while the Player's acquired history is unchanged | Discussable request/offer options do not disappear or change status; any later outward refusal follows its own permitted disclosure rules |
| Failure oracle | Guess an unacquired handle that is unknown, denied or internally missing | Actor-facing status, counts, order and failure behavior do not identify the hidden cause |
| Private refusal | NPC declines due to a private debt and cites another reason | Structured outward refusal remains faithful; debt and actual reason are not included automatically |
| Nested cycle | Dispute refers to Deal, which refers back to Dispute | Projection terminates within budget without expanding private terms or leaking hidden cycle details |
| Export/reload | Actor-safe export, Director save and historical replay are compared | Actor export remains scoped; privileged artifacts are explicitly privileged; replay grants no later knowledge |
| Secret-only edit | Two histories differ only in an uncommunicated secret while all permitted outward effects are held fixed | Actor-visible projection, discovery results and ordering are equivalent; no secret-dependent metadata drift |

The final control is deliberately conditional on equal permitted outward effects. Sealing does not require NPCs with different private beliefs to act identically: chosen speech and actions can be legitimate clues. It does require a documented disclosure path or authorized outward behavior for every difference, instead of accidental record or UI leakage.

This is a conceptual noninterference goal: with equal actor-known history and equal intentionally disclosed outward effects, changes confined to hidden world records should leave projected contents, counts, order, status, composer filtering and failure behavior equivalent. No runtime proof or implemented guarantee is claimed.

## Open decisions and synthesis handoff

- Define the permitted inference rules and which background knowledge is scenario-authored. Do not substitute an all-knowing truth query for reasoning.
- Select whether/how rumor hops exist, their conditions, maximum work, distortion policy and disclosure of provenance. No propagation algorithm is settled here.
- Choose audience-scoped handle stability and alias reconciliation, including mistaken associations, correction and historical presentation.
- Decide retention of learned Player references, private NPC memory and compacted causal evidence separately. The Reply's no-housekeeping-forgetting rule remains an attributed recommendation pending adoption.
- Define safe uncertainty displays, unknown-source treatment and timing precision when the actor knows only part of a fact.
- Specify replay/save privilege boundaries and how historical projections identify their source snapshot without exposing hidden revision activity.
- Decide how much cue information BASED and personality intentionally disclose. A private deception selector or lie flag must not become a default Player-visible badge.
- Decide which evidence authenticates a source and which only records a source assertion; unknown authenticity must remain representable.

The architect and schema designer should carry KP-01 through KP-14 into proposed record relationships and examples, record any exceptions, and leave unresolved choices explicit. Independent audits should evaluate provenance correctness separately from actor projection safety: a perfectly traced but publicly exposed secret still fails sealing, while a sealed account with fabricated canonical lineage still fails correctness.
