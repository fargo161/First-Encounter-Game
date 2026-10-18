# Atlas first workflows

Audit date: 2026-10-18. Applies to frozen AR0 R1, `AR0-projection-v1-R1-D01`.

**Recommended first milestone:** read-only Person inspection with source tracing in Last Collection. Start with Orrin's bounded report, check Nera as the absent-person counterexample, and use Tamsin to prove that received evidence and belief remain separate.

This specifies developer goals and semantic behavior, not layouts or implementation. Example questions describe what a developer should be able to find; they do not require a conversational AI or natural-language query engine. “Supported” means that the current foundation contains the necessary records, not that an Atlas UI already exists.

Evidence keys A/E/K/M/P/T/C/V/R/U/S/TA/TE/F/I/D refer to the linked sources in [the vocabulary specification](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/ATLAS_PLAIN_LANGUAGE_VOCABULARY.md>). The [audit report](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/ATLAS_AUDIT_REPORT.md>) records authority, fresh checks and remaining gaps.

## Priorities

| Priority | Developer goal | Current foundation | Placement |
|---|---|---|---|
| 1 | Inspect a person's received information, reports, beliefs and sources | Direct author projection; reverse source joins are derivable | First vertical slice |
| 2 | Inspect the case's current owner and holder | Direct typed links and full world state | v0.1 after the slice |
| 3 | Inspect what an Event actually records | Direct Event cards, fragments and committed causes | Minimal source detail in slice; fuller inspection in v0.1 |
| 4 | Trace why an assertion or connection is shown | Direct provenance plus bounded joins; some explanations require inspector | Information-source tracing in slice; deeper diagnostics later |
| 5 | Inspect recorded changes across saved points | Selective feed; two-snapshot comparison is derivable | v0.1, explicitly limited |

Validation is a cross-cutting requirement for every workflow, not a promise of a universal suspicious-state detector.

## 0. Open the right saved run

1. **Goal:** inspect a known saved point with the correct content and catalog.
2. **Normal language:** “Open this Last Collection run.” See run/step, full developer or player-received view, and content/catalog identity in details. Invalid data must explain why inspection cannot proceed.
3. **Underlying mapping:** `encounter-save@3`, sealed package/reference, `importRun`, exact journal replay, catalog package binding, `projectAtlas`, projection context.
4. **Current support:** direct API support. The existing CLI can export JSON/Markdown/network snapshots after validation. The first prototype can call the existing read-only seam; no mutable Atlas database is required. (E importRun; A projectAtlas; T seal/verify.)
5. **Unavailable/ambiguous:** an AR0 projection is not a reloadable Encounter save. Run labels may repeat; do not identify unrelated playthroughs by label alone. No cross-project merger or automatic migration is provided. UI ingestion is future work.
6. **Placement:** prerequisite for the first slice. Show one validated snapshot at a time; use existing fixtures for initial tests.

## 1. Inspect a person

1. **Goal:** understand who a person is, what information they received, what they were told, what they believe or suspect, what they hold/own where modeled, and where those assertions came from.
2. **Normal language:** “Show Orrin.” “What did Orrin receive about the earlier movement?” “What did he tell the Collector?” “Does Nera have any received information recorded?” “What is Tamsin's belief based on?” Summaries should distinguish **Received information**, **Reported to/by**, **Believes**, **Concerns**, and typed **Connections**.
3. **Underlying mapping:** Person identity/kind; person `observations`, `receivedClaims`, NPC `beliefs`/`hypotheses`, permissions/visit; incoming and outgoing typed links; source roots and message/event/result references. Names/reference aliases come from the validated catalog and package when needed, not from label matching.
4. **Current support:** direct author projection contains local records for all four canonical actors, including empty records for absent Nera. Reverse link lookup can show Orrin's reporting and Nera's ownership. The human has received information but no simulated belief/hypothesis. Alias inspection is derivable from the companion catalog. (A 139–153; K; TA-26/28/32; D01-05–08.)
5. **Unavailable/ambiguous:** complete alias lists and role profiles are not projected Person fields. A descriptive Person may have no actor state. NPC private state is hidden in player view; `{}` is not a claim of ignorance. No general biography, friendship/trust meters, person location, complete inventory or all-world memory exists. “What happened around them?” must mean recorded participation/receipt/mentions, not geographic proximity. “Recent changes” is selective.
6. **Placement:** first vertical slice. Source identity details can expose catalog bindings; full alias search and role inspection may follow. Holdings must remain limited to supported links, not an invented inventory.

**Required counterexamples:** Orrin's unidentified wrapped case must not become the owned instrument case; his report must not acquire destination/purpose he did not receive. Nera's absence must not acquire Orrin's observations. The Collector must not acquire machine-authored beliefs. A report about an occurrence must remain different from firsthand receipt of that occurrence.

## 2. Inspect a thing

1. **Goal:** understand what an object/resource/document is, its modeled current custody/ownership, relevant evidence and related happenings.
2. **Normal language:** “Who owns the case?” “Who currently holds it?” “Which received fragments mention it?” “What happened to it?” “Does this drying tag refer to the case?”
3. **Underlying mapping:** Thing card, `owns`, `holds`, optional `located_at`, `references_thing`, `received_evidence`, event details, current `worldTruth`, evidence subject/value references and validated source bindings.
4. **Current support:** direct owner/holder/location links for the single recoverable item; evidence and reverse relationships for supported Things. At recovery Nera remains owner, Collector is holder, payment is zero, and no current `located_at` link is asserted. (A 155–165; TA-24/31/34/44; F recovery.)
5. **Unavailable/ambiguous:** eight Things do not mean eight tracked inventories. Ticket/file/tray/coins do not all have current custody histories. The unidentified wrapped-case reference is not identity proof. Earlier Dry storage evidence and initial Office storage holder are separate references without a containment link. “Who knows about it?” must return specific receipt/report/belief records, with subjects/values resolved, rather than all people linked to the Thing. No universal awareness flag exists.
6. **Placement:** v0.1 after the Person/source slice. Start with the instrument case and explicitly absent fields on other Things.

## 3. Inspect an event

1. **Goal:** understand an actual recorded occurrence, its committed cause, participants, receipt and effects without inventing missing facts.
2. **Normal language:** “What happened?” “Who communicated?” “Who performed the action?” “Who received which part?” “Who learned about the earlier occurrence later?” “Which result changed the case's holder?”
3. **Underlying mapping:** Event class/order/basis/source/cause; outward communication or physical result; `participantRefs`, `observerRefs`, `thingRefs`, `placeRef`; observation sources and roots; claim/report links; corresponding journal revision and changes.
4. **Current support:** direct historical, communication and performed-action cards with stable identities. Received fragments and claims can be joined to explain later reports. Physical effects are in author result details; command identity anchors attribution. (A isMeaningful/event construction; E events/results; TA-19/22/44/47.)
5. **Unavailable/ambiguous:** observer arrays are populated for physical results, not a complete audience list for messages/history. Initial historical cards have empty participant/observer arrays despite existing local observations. Inspect receipt records, not arrays alone. A thing mentioned is not necessarily physically involved. Runtime place is authored Transport Office context, not geometry; historical place may be unrecorded. No wall-clock time, universal world history or cards for every log/commit exist. `no_discovery` remains inspectable as a result/change but is excluded from performed-action cards.
6. **Placement:** minimal source-event detail in the first slice; richer Event inspection in v0.1. Use “Not recorded” for absent participants/place, not “Nobody/Nowhere.”

## 4. Trace why information or a connection is shown

1. **Goal:** explain the basis and information path behind a displayed assertion.
2. **Normal language:** “Why does Atlas say Orrin reported this?” “How did the Collector learn about the movement?” “Why does Tamsin believe this?” “Why are these connected?” “Why does the Collector hold the case?”
3. **Underlying mapping:** link `epistemic`/provenance, immediate source refs, observation/claim/belief IDs, earlier roots, canonical messages/results/events, catalog authority on descriptive links, handover effect and cause.
4. **Current support:** direct references support bounded trace navigation. Belief records retain contributing observations and history; claims identify the actual speaker. Handover result explains current custody. Authored associations explain themselves as authored context. `readObservedSource` returns only a character's received fragments. (A links; K; V; D01-06; TE-38.)
5. **Unavailable/ambiguous:** there is no universal causal explanation service. Current owner provenance points to current world state; the original legal reason for Nera's ownership is not a modeled chain. Some links are authored descriptions with an authority string, not inferred events. Full source inspection is appropriate for the developer, but must be marked separately from what a particular person received. Repeated copies are not independent sources. Claims without mapped Event endpoints still exist in Person state and must not silently disappear from summaries.
6. **Placement:** essential in the first slice for received information/report/belief. Add physical-custody trace and authored-link explanations in v0.1. Leave universal “why” inference out.

## 5. Explain why an NPC responded this way

1. **Goal:** diagnose a specific response using the NPC's actual information at that moment.
2. **Normal language:** “What did Tamsin have available when she issued this warning?” “Which observed choices qualified the concern?” “Why did the apology not repair it?”
3. **Underlying mapping:** engine `decisions`, `inputBasis`, reconstructed `decisionInput`, candidate eligibility/reasons, selected response, visit/hypothesis state at that decision.
4. **Current support:** existing `inspectRun` includes exact actual inputs and candidate trace; commit-time equality checks bind the stored decision input to the real policy argument. Current policy is fixed bounded rules using local information/roles. (E 157–160/289–290; P; TE-10/13/36–38.)
5. **Unavailable/ambiguous:** AR0 Event/Person cards do not include the full decision trace or a decision link. A reader restricted to exported projection JSON cannot recreate all decision reasons. Broader Master weighting by needs/relationships/profile priorities is not implemented by this selector. Outward “Why” is an in-world clarification action, not the developer's full diagnostic view.
6. **Placement:** later diagnostic extension, using the existing author inspector rather than redesigning policy or adding mutable explanatory state. Show ordinary source tracing first.

## 6. Compare before and after

1. **Goal:** see meaningful recorded changes between compatible saved points and identify unexpected identity/reference differences.
2. **Normal language:** “What changed after the handover?” “Did the holder change while the owner stayed the same?” “Which received information was added?” “Did any identity or reference change?”
3. **Underlying mapping:** two validated snapshots; package/catalog/run context; committed-command lineage; IDs; typed record/link comparison; selective `recentChanges` with `sinceRevision`.
4. **Current support:** selected change feed is direct. Current snapshots and stable IDs make a two-snapshot comparison derivable without changing Encounter. Before/after handover supports one custody transfer, unchanged owner, zero payment and completed recovery. (A 166–194; R journal; TA-13/23/34/35/37.)
5. **Unavailable/ambiguous:** `sinceRevision` filters changes only; it does not make historical cards/links. The feed omits explicit belief changes, ordinary message-only changes and offer invalidation. Do not call it a complete diff. Use two actual saved points for a fuller comparison. Matching run labels alone does not establish common lineage; check committed-command prefix and exact content/catalog context. Across unrelated contexts show incompatibility, not guessed identity continuity. There is no wall-clock chronology.
6. **Placement:** selected changes in v0.1; explicit two-snapshot typed comparison after the core reader. Reconstructing arbitrary earlier snapshots or branching simulations belongs later, if requested.

## 7. Validate suspicious state

1. **Goal:** identify supported structural/identity problems without labeling ordinary uncertainty a defect.
2. **Normal language:** “This reference has no target.” “These two actor identities cannot share one Person.” “This saved state does not replay.” “The required closure preview was missing.”
3. **Underlying mapping:** package/run/domain/catalog/projection validators; replay equality; exact IDs, source bindings, endpoints and case checks; recorded `technicalDefects`.
4. **Current support:** the table below distinguishes existing validation from a possible reader-side check. R1 rejects conflicting actor binding for both audiences before a projection is emitted. (A/E/R; TA-02–12/38–39; D01 tests; I.)
5. **Unavailable/ambiguous:** no complete contradiction checker, semantic alias merger, privacy proof, deletion impact analyzer or prose-truth validator exists. Disputed NPC beliefs and disagreement between people can be valid state. Duplicate display names are not identity collisions. Catalog descriptive text is trusted authored material.
6. **Placement:** existing validation/error explanations in the first slice; labeled additional read-only diagnostics later. Never silently repair data during inspection.

| Suspicion | What current code checks | What Atlas may claim |
|---|---|---|
| Duplicate/case-colliding card IDs; duplicate source bindings; two canonical actors on one Person; missing actor Person | Catalog validation directly rejects these | “Conflicting identity/reference,” with offending context if available |
| Missing actor/subject/historical/scenario/place/link target | Catalog reference checks; projection endpoint/card-link checks | “Invalid reference” within those validated structures |
| Duplicate observation/result/etc. identity; observer roots with missing sources; foreign belief support; money/recovery invariant | Bounded M3 domain checks plus full journal replay | Specific validation failure, not “all state verified” |
| Edited/unreplayed save; mismatched content/catalog | Package verification, exact binding and deterministic replay | “Snapshot cannot be accepted with this content/catalog” |
| Missing closure preview | Recorded author technical defect; current guarded behavior covered by tests | Show the recorded defect; do not claim it proves all rendering correctness |
| Same displayed name on different people | No catalog uniqueness requirement for labels | Optional **Name is shared** convenience finding; never auto-merge |
| Contradictory beliefs | NPC inference can explicitly mark a question disputed | “Conflicting evidence for this NPC,” not necessarily malformed world state |
| Arbitrary semantically wrong relation or misleading prose | Type/endpoints may validate without verifying prose truth or relation meaning | Requires human review; do not advertise automatic semantic validation |
| Everything hidden from a player | Bounded audience filtering/tests; no universal leak certification | “Player-received view for this supported model,” not all-project secrecy proof |

## 8. Compare full developer state with player-received information

1. **Goal:** inspect information boundaries as developer data.
2. **Normal language:** “Show full state.” “What has the player actually been shown?” “Which part of this earlier occurrence did they receive?”
3. **Underlying mapping:** separate author/player projections and player observation records; received labels; opaque source reads.
4. **Current support:** two direct audiences. Initial author output has 19 cards versus 11 player cards; author includes local NPC state/full truth, player omits it. At recovery both can have 45 cards while still differing in fields and link basis. Card count is therefore not a privacy test. (A audience filtering; TA-27–31/43; F.)
5. **Unavailable/ambiguous:** no arbitrary-NPC audience mode. Developer inspection of an NPC's local records uses author output with explicit person scope. Matching visible names does not imply identical hidden state. Player-safe snapshots do not constrain what a full developer view may show and are not encrypted saves.
6. **Placement:** optional v0.1 follow-up after author summaries are correct. First slice can deliberately remain full-developer-only and clearly identify that view.

## 9. Ask what would be affected by a change or deletion

1. **Goal:** understand references before eventual authoring work.
2. **Normal language:** “Which cards or records refer to Nera?” “What would depend on deleting this person?”
3. **Underlying mapping:** catalog source/aliases/links/scenario membership; all package definitions and run observation/message/result/claim/belief/offer/journal references.
4. **Current support:** typed reverse links and source references can list **references present in this snapshot**. There is no complete dependency or change simulation API. (A/S/E/R.)
5. **Unavailable/ambiguous:** projection links are intentionally selective; absence of a link does not mean deletion is safe. Authored prose, package rules, aliases, old saves and journal payloads may depend on a record without a projected edge. No write migration or automatic repair contract exists.
6. **Placement:** later. Keep even a preview labeled **References found**, not **Safe to delete**. Writing/deleting/remapping entities is outside this audit and first prototype.

## First vertical slice and independent acceptance

Implement one **read-only Person summary with expandable source evidence** over a validated Last Collection save and the matching catalog/package. Use existing AR0 R1 output as the authoritative projection; any view models remain disposable derived presentation data.

The slice should let the developer select a Person by stable identity, read the typed information summary, inspect an assertion's immediate source and earlier citations, and open Encounter details for the original fields. Minimal Event/message/result detail is sufficient for the trace. No complete graph, editor, search language or simulation is required.

Use the following as independent acceptance cases for the future Builder handoff, not as new tests implemented by this audit:

| Case | Required observable outcome |
|---|---|
| Orrin's limited report in a warned/learned save | Correct speaker; unidentified wrapped case remains unidentified; direction only, without hidden destination or purpose; received report remains different from direct evidence |
| Nera in the same full developer snapshot | One correct Person, no received observations/beliefs/hypotheses; owner link can exist without receipt; no Orrin state installed under Nera |
| Tamsin's belief | “Believes,” holder and scoped evidence/source remain visible; accepted stance is not presented as objective truth |
| Collector | Received information is inspectable; no simulated human beliefs, motives or feelings |
| Same-name or renamed Person fixture | Correct stable IDs and sources; labels do not merge or replace identities |
| Original conflicting Orrin/Nera catalog | Safe validation failure before misleading Person output; no silent merge |
| Repeat read and exact save/load | Same records, identities and sources; no change to run/package/catalog; no new Events or effects |
| Missing/hidden/unmodeled data | Distinct accurate wording, without inventing negative facts |

Once independently verified, add Thing inspection, fuller Event reading and selected recent changes. Consider a network view only after article statements and source explanations are trustworthy. Future authoring requires a separately specified Encounter write contract and new scope.
