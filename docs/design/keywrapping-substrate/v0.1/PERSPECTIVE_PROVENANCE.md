# Perspective, evidence and sealed projection

**Version:** v0.1 · **Date:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT
**Role:** KeyWrapping Architect, after all four mining reports

This document proposes the information boundary for KeyWrapping. It defines logical records and review guards, not a running access-control service, save format, schema, adapter or accepted implementation contract. The owner's scoped production sign-off and [source precedence](../../../research/keywrapping-substrate/v0.1/SOURCE_SNAPSHOT.md) govern. C2.1 B0 supplies a comparison only. Existing package authority and known acceptance states remain unchanged.

## 1. Evidence and scope of the proposal

KW-CONTEXT §§4.4–4.5, 12, 19–25 and 30 establish the central direction: actual history, received information, claims, beliefs and Player vocabulary differ. A shared wrapper grants a handle, not another mind or the whole world record. The Context recommends explicit per-actor projection and bounded inference. KW-REVIEW warns that labels and identity joins leak; KW-REPLY recommends decision-before-wording and qualified performatives. The [provenance miner](../../../research/keywrapping-substrate/v0.1/PROVENANCE_DONOR_MINING.md) supplies KP-01–KP-14; the [social miner](../../../research/keywrapping-substrate/v0.1/SOCIAL_REASONING_DONORS.md) supplies the decision/rendering split. Their recommendations are synthesized below as **Encounter proposals**, not silently promoted to owner-approved mechanics.

PROV's attribution/derivation distinctions and ActivityStreams' activity/audience distinctions informed the research. Neither grants truth or secrecy. Original-source links, exact dated snapshots and license boundaries are in the mining report and [license ledger](../../../research/keywrapping-substrate/v0.1/SOURCE_LICENSE_LEDGER.md). This document does not copy their ontologies, serialization or specification text, or claim conformance.

## 2. Minimal logical separation

| Logical concept | Proposed record meaning | Invalid conclusion from its presence |
| --- | --- | --- |
| Occurrence | A validated actual world effect/communication at a declared causal point | An actor perceived it, can identify its participants or may inspect it |
| Observation | A particular actor perceived a particular aspect through a recorded channel | They perceived everything, identified it correctly or believed an explanation |
| Communication | An expression actually performed, including its structured meaning and outward performance | Every intended audience received it or a queued plan was performed |
| Receipt | The fragment a recipient actually received, with its acquisition/source point | Full sender payload, comprehension, belief, agreement or nested disclosure |
| Claim | A proposition attributed to a source act: actor, action/predicate, participants, temporal/polarity/qualification scope | The proposition is true, the speaker believes it or its alleged event exists |
| Source assertion | What the speaker claimed about the claim's origin or evidential basis | Actual lineage, source authenticity or eyewitness status |
| Stance | A holder-local belief, doubt, denial, hypothesis or interpretation at a point, with eligible basis | World truth, another holder's stance, or public permission to disclose it |
| Private intent | Deliberate aim/misrepresentation where explicitly modeled | Falsity alone proves dishonesty, or the Player may see a lie flag |
| Acquisition/identity association | What a holder learned and any acquired connection between handles | A canonical equality join or another actor learning the association |
| Wrapper/label | Typed addressability and holder-specific presentation | Authoritative existence, objective guilt, full contents or globally shared naming |
| Projection | A newly formed view of eligible information for a named audience and historical scope | An unfiltered canonical object made safe by hiding a few UI elements |

Observations and communication receipts are different evidence modes even if a later format groups them under one acquisition/evidence family. These are logical roles, not mandatory tables or modules. The [JSON record family](JSON_RECORD_FAMILY.md) provides schematic notation; [references and promotion](REFERENCES_PROMOTION.md) gives handle/identity rules; [transactions](TRANSACTIONS_COMMITMENTS.md) adds exact assent and effect evidence.

**P01 — alleged subjects need no occurrence.** A fabricated murder has real utterance and receipt occurrences, a claim and an addressable alleged subject. Its content need not point to a murder occurrence. A hypothetical future plan likewise needs no actual event. Preserve that distinction when later evidence supports, contests or identifies an occurrence; wrapping a claim never supplies the missing fact. Basis: KW-CONTEXT §19; KP-03/KP-04.

**P02 — particular fragments.** A receipt records the delivered portion, not merely a link granting expansion of the sender's full expression. A listener hearing “...key...tomorrow” does not learn an omitted party, condition or amount. Internally linking the receipt to its source supports privileged tracing, but the listener's expansion remains limited to that fragment. Intended audience, proximity and an unperformed queue entry cannot stand in for reception. Basis: KW-CONTEXT §§20, 25; KP-02/KP-03/KP-10.

**P03 — truth and stance.** The world can retain a fact about an NPC's explicitly modeled private belief while the belief's proposition is false; visibility of that mental-state record remains restricted. “Ray believes P” in Player testimony is a claim about Ray, not a read of Ray's mind. Receiving a claim permits doubt, misunderstanding, rejection or no modeled stance. No automatic certainty or universal belief score is adopted. Basis: KW-CONTEXT §§12, 19–20, 24; action miner's predicate analysis; social miner's F-KB/F-RPC comparison.

The Player's receipt/acquisition history can retain attributed claims and observed facts without assigning the Player an unexpressed belief, intention or endorsement. Actor-local private cognition here primarily concerns NPCs or explicitly modeled/expressed stances. It does not add a Player thought store or private hypothesis editor; KW-CONTEXT §7 expressly rejects the scratchpad and says the Player's unexpressed mind need not be modeled.

## 3. Three kinds of provenance

**P04 — preserve actual lineage, source assertions and holder-known lineage separately.** These answer different questions:

| Question | Example in the Ray/Dee fixture |
| --- | --- |
| What actually supplied Ray's information? | Dee's delivered report to Ray, if that happened in authoritative history |
| What source does Ray assert to the Player? | “I saw it myself,” a possibly false eyewitness claim |
| What source can the Player know? | Ray's received eyewitness assertion and eligible observable cues; not the hidden Dee link |

A source assertion can quote an actual source, falsely name a source, omit one or claim firsthand perception. It cannot rewrite actual lineage. Unknown lineage is not proof of no source. A protected true source must not appear as a “hidden source: 1” badge unless the Player legitimately learned that such a source exists. Integrity hashes prove byte/record identity only within their declared scope; they certify neither truth, access rights nor honesty. Publishing a hash of hidden low-entropy content can reveal it by comparison and is not an accepted redaction mechanism. Basis: KW-CONTEXT §§19–21; KP-06/KP-12.

**P05 — new accounts preserve old accounts.** A correction, quotation, distortion or disagreement creates a new attributed account/stance/change with links to its eligible basis. Do not mutate the old utterance, receipt or actual event. The actor may know only the immediate teller even when privileged provenance retains a longer path. Showing provenance follows the same sealing rules as showing any other fact. Basis: KW-CONTEXT §§17–21; KP-04/KP-10/KP-12.

**P06 — repeated sources are not independent evidence by default.** If Ray tells Dee, Dee tells Len and Len tells Ray, the world retains the shared derivation. Three hops do not become three independent witnesses. Ray may mistakenly think the reports independent if his own evidence supports that mistake; that is an attributed stance, not corrupted authoritative lineage. No confidence aggregation formula is selected. Basis: provenance miner's rumor-loop analysis and KP-12; Encounter proposal consistent with sealed disagreement.

Rumor hops are an optional reviewer recommendation. Any later selected propagation needs an actual bounded source/delivery path, distinct delivered content and recorded distortion, with scenario eligibility and work limits. Relationship membership, elapsed time or co-location alone does not establish receipt. This documentation installs no scheduler, offscreen dialogue system or mandatory rumor spread.

## 4. Projection context and eligibility

**P07 — complete context is required.** A proposed projection is evaluated for one audience/holder, authorized purpose, exact world/run snapshot and knowledge cutoff. Where an output also has a presentation or policy revision, preserve it in privileged provenance. A missing or ambiguous audience/cutoff cannot fall back to omniscient truth. World state at a time and what the holder had learned by that time are separate coordinates. Snapshot identifiers, counters and policy revisions in a Player output must themselves be safe; an opaque projection token can identify a bounded result without leaking hidden world revision activity. Exact token encoding remains OPEN. Basis: KP-01/KP-06/KP-08/KP-10.

**P08 — acquired existence and details.** To expose a reference/proposition, the model needs an eligible acquisition basis no later than the cutoff, or an explicitly selected scenario background basis. Authorize subject existence, type, label, relation and each detail independently. A holder may know that a deal exists while lacking its terms. Knowing its name grants no access to private clauses, motive, witnesses or other holders' beliefs. A false testimony can support an attributed claim's availability without proving its subject exists. Basis: KW-CONTEXT §§4.4–4.5, 20, 23; KP-02–KP-05.

**P09 — bounded graph expansion.** Follow only typed relations eligible in the audience context. Each next subject/detail needs its own authorization; a permitted parent cannot transmit permission. Preserve visited identities privately and stop cycles/depth/work exhaustion safely. Omitted hidden edges do not create visible placeholders, counts or truncation reasons. If an already known collection is visibly incomplete, any “more may be available” message must be justified by the holder's known context rather than hidden graph size. Exact bounds remain an explicit future choice. Basis: KW-CONTEXT §17; KP-02/KP-09.

**P10 — project before exposure.** First form the eligible bounded contents, including labels and provenance, then serialize, index, render or supply a dialogue input. Do not pass full canonical/private records to a Player renderer and rely on masking fields afterward. Actor-visible caches, search indexes and derived summaries retain audience/snapshot/cutoff scope. A current richer cache must not answer an earlier historical query; an NPC cache must not answer Player queries. This is a logical boundary, not an implementation architecture decision. Basis: KP-07/KP-08/KP-10; social miner's outward-realization input.

## 5. Labels, metadata and safe unavailability

**P11 — metadata is information.** IDs, labels, kinds, times, revision gaps, counts, order, search hits, autocomplete, disabled controls, thumbnails, available action menus, source-chain length, warning text and diagnostics can disclose secrets. Only eligible projected content contributes to actor-visible sorting/counts/search. Do not reveal hidden content through “3 private claims,” a culprit-dependent rank, a more specific error, a label generated from the real killer, an exact timestamp that the holder never learned or a global revision increment. Authored observable clues can differ deliberately; their source/disclosure basis must be explicit. Basis: KW-REVIEW §5; KP-05/KP-06/KP-14.

**P12 — unknown, denied and missing guessed references are indistinguishable where unacquired.** An unacquired guessed handle must not reveal whether it matches a concealed entity, is unauthorized, or is missing/broken internally. Use the same bounded actor-facing unavailable behavior, without differential suggestions, counts, status or expansion. Privileged diagnostics can distinguish the causes. If the holder already legitimately knows an entry, an unavailable view can retain only acquired details and a context-justified indication of unavailability; it cannot expose the hidden failure reason. Do not add redaction stubs for every concealed child. Basis: KP-06/KP-13/KP-14 and failure-oracle analysis.

**P13 — handles do not join secrets.** Canonical IDs and stable hashes remain privileged. Two audience handles can refer internally to one identity without exposing equality. Only an acquired identity association connects them in that holder's current view. Learning Eddie's identity does not reveal his debt, his source's name, historical knowledge the Player lacked, or the association to other actors. False associations stay holder-local and correctable. Basis: [R02/R10/R11](REFERENCES_PROMOTION.md); KP-05/KP-06/KP-10.

**P14 — discussability uses acquired information.** The composer may use known referent kinds and visibly resolved roles to reject malformed combinations. It cannot use hidden objective inventory, authority, secret restrictions, actual culprit, unlearned alias equivalence or private NPC feasibility to disable an otherwise meaningful request, offer, accusation or hypothesis. A known false belief can still be expressed. Actual world validation occurs separately; its private failure reason is not automatically projected. If the system intentionally communicates new capability information, it needs an authorized outward event/path. Basis: action dictionary shared rules; KP-06; transaction T13/T14.

## 6. Inference, time and historical reconstruction

**P15 — bounded inference uses permitted premises.** An inference records its holder, rule/interpretation basis, eligible premises, point and qualification. No automatic logical closure over world facts, aliases or another mind is assumed. A correct guess remains a conjecture until acquired evidence warrants a stronger status; hidden truth must not confirm it through confidence, menu changes, label completion or query success. False expression using known references does not require handing the actor inaccessible true content. Player speculation through actual NPC interaction is distinct from the forbidden private scratchpad. Exact inference rules and resource limits remain OPEN. Basis: KW-CONTEXT §§7, 20, 24; KP-03/KP-06 and guessed-secret control.

**P16 — distinguish clocks.** Preserve occurrence time, communication time, reception time, interpretation/inference time and later discovery/identity-association time as appropriate. Relative “tomorrow” terms require their declared temporal anchor in transaction terms; hearing a later retelling does not move the original occurrence. Holder-visible time precision cannot exceed what that holder legitimately learned. Historical views use the earlier knowledge cutoff and retain original labels/wording. Current commentary can add an explicitly marked explanation only when authorized. Basis: KW-CONTEXT §§18, 25; KP-01/KP-10; transaction T08.

**P17 — change by addition.** New evidence can revise a current stance, add a correction or associate handles without replacing old receipts. A later label/version cannot be read into past speech as if it had been known then. Replay/reload must identify the same historical receipt/acquisition/effect once within its declared scope; it cannot duplicate knowledge or grant future information to a past listener. Exact persistence and deduplication mechanisms remain outside this documentary model. Basis: KP-10/KP-11; transaction T01/T02/T07.

## 7. NPC decision and dialogue boundary

An NPC's private evaluation may read its own eligible perceptions, memories, private concerns and selected authored policy. It must not read another actor's sealed knowledge or fill gaps from global truth. Actual authority/capability validation belongs to the separate authorized consequence decision; a private evaluation's “I can do it” is a belief and may be wrong or dishonest. Basis: KW-CONTEXT §§16, 24; social donor minimum interfaces; T13.

The outward result is a structured accept/refuse/counter/ask/challenge or other supported expression with exact target and deliberate outward claims. A private reason can remain private; an outward pretext is its own claim. Only selected mechanical meaning, audience-safe labels and intended outward performance enter dialogue realization. The NPC's private diagnostic trace, secret need, private BASED selector, actual deception intent and invisible relationship scores do not accompany it. Dialogue must not add unrepresented binding terms, names, amounts, conditions or allegations. A template alone cannot guarantee fidelity if its slots leak. Basis: KW-CONTEXT §§3, 16, 24; KW-REPLY decision-before-wording; social donor outward-realization section.

Observed hesitation, a spoken lie or an authorized action can be an intentional clue. Sealing does not require NPCs with different private histories to act identically. It requires each outward difference to follow an authorized selected behavior/disclosure, rather than accidental object access. Objective falsity does not establish private intent; a lie classification exists only where that intent is explicitly modeled and remains sealed unless legitimately revealed.

## 8. Privileged artifacts and saves

Actor-safe exports contain only their bounded projection, opaque handles and acquired provenance. Director diagnostics, authoritative replay and full saves can contain protected world/NPC material and must be explicitly privileged. They are not interchangeable with a Player book export, and tooling access to them does not grant in-world knowledge. A restore preserves its declared world and acquisition history; a present-day projection must not backfill earlier listeners. Future save/access/transport design needs separate authorization and threat review. Basis: KP-08/KP-10/KP-11.

Revoking a present lookup permission or quieting an entry cannot silently erase a fact already received from the historical record. What learned material remains currently usable is a separate retention/forgetting policy; this pass leaves the Reply's permanent-book recommendation open. Cancelling a bargain cannot make a recipient unlearn a secret. [Transactions](TRANSACTIONS_COMMITMENTS.md) preserves effects; [references](REFERENCES_PROMOTION.md) separates salience, history and availability.

## 9. Documentary guard and attack scenarios

These are proposed paper/audit criteria, not executed runtime tests.

| Scenario/change | Passing conceptual result | Reject |
| --- | --- | --- |
| Hotel incident: one witness sees who acted, another hears only shots | Separate observations; Player receives only eligible fragment/claims | Shared wrapper fills in culprit, sequence or eyewitness memory |
| Ray repeats Dee's report while claiming eyewitness status | Preserve actual Dee path privately and received Ray assertion publicly | Reveal Dee in a source badge, or replace true lineage with Ray's claim |
| Phantom murder account | Real communication and alleged subject; no murder occurrence required | A mandatory event reference manufactures a canonical murder |
| Partial overhearing | Recipient expands only received fragment | Following the source expression restores omitted actor or condition |
| Correct culprit guess | Expressible conjecture from known subjects retains its status | Hidden truth changes suggestions, confidence or acceptance status |
| Secret key loss | Unchanged Player-known history gives unchanged composer options | An offer disappears because objective inventory secretly changed |
| Alias reveal and mistaken merge | Per-holder association/correction at learning point; earlier views preserved | Canonical ID equality discloses link; all private history follows the join |
| Rumor cycle | Shared derivation preserved; holder may misunderstand independence | Repeated hearsay becomes three canonical witnesses or global belief |
| Nested deal/dispute cycle | Eligible typed expansion stops safely within budget | A cycle leaks hidden edges/counts or causes unrestricted traversal |
| Hidden/denied/missing guessed handle | Equivalent bounded unavailable result and outward behavior | Success/failure type, ordering, counts or hints distinguish concealed existence |
| Later knowledge in historical query | Earlier cutoff supplies earlier acquisitions and labels | Today's alias, terms or beliefs appear in yesterday's receipt |
| Private refusal with public pretext | Outward claim/response alone enters dialogue and export | Actual private reason or deception flag leaks through diagnostics/slots |
| Repeated save/replay | Same acquisition/effect history once in its identity scope | Duplicate receipts, repeated effects or present knowledge granted to past actors |
| Secret-only substitution | Hold acquired history and selected outward effects fixed; projected contents, metadata, menus and failures stay equivalent | Hidden changes alter outward surface without an acquisition/disclosure path |

Hotel shooting, theft and killing are source-pack world-history fixtures. They do not register candidate-only Player action words or fill gaps such as “fired first” in the approved 66-word expression vocabulary. The action dictionary records those expressive gaps separately.

The final control is a proposed conceptual noninterference criterion, conditional on equal permitted outward effects. It is not a software proof, and private beliefs can legitimately change chosen outward acts. Independent sealing review must examine the exact examples and all metadata surfaces; correct provenance alone does not prove sealing, and a sealed but fabricated lineage still fails correctness.

## 10. Open choices

Retain explicit decisions for inference rules/background knowledge, audience-handle stability, source authentication, uncertainty displays, time precision, bounded rumor/consequence scheduling, projection work budgets, actor-export/save privileges, learned-book/NPC retention and deliberate BASED cue disclosure. These are recorded in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md). No universal psychology, score, certainty update, filtering order or omniscient resolution rule is installed by this proposal.
