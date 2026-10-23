# NPC social reasoning donors

**Version:** v0.1 · **Date checked:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT
**Role:** NPC Social Reasoning Miner · documentation and source analysis only

The useful result from Ensemble and FAtiMA is a set of separations: remembered social state, interpretation, candidate decisions, communication and authorized effects. Encounter should retain those separations while designing its own actor-scoped information boundary. Neither donor supplies KeyWrapping sealing merely by being used. No dependency, psychology model, numeric policy, dialogue service or executable interface is selected here.

## 1. Source authority and evidence

The owner-approved complete KeyWrapping Context v0.1 is the design baseline; see [source identities and precedence](SOURCE_SNAPSHOT.md). `KW-CONTEXT §§13, 16, 20, 24` establish a shared mechanical language, outward BASED performance, sealed perspectives and decisions affected by needs, circumstances, relationships, beliefs, costs, risks and obligations. The private selector and secret intent are unavailable to the listener. `KW-CONTEXT §24` recommends interpretable decisions rather than a universal persuasion percentage.

`KW-REPLY`, “Where it improved on my review,” recommends choosing a structured answer before rendering dialogue. The runbook explicitly requests that separation. The reply's “NPC decisions: a first version” suggests four ordered checks with the first failure deciding the response. Its embedded diagram is absent from the supplied Markdown: the four predicates, their exact order and their sufficiency are **unknown**. The text does identify promise history as an input to its third question. This report neither reconstructs the missing checks nor adopts first-failure acceptance as settled policy.

`KW-REVIEW` recommends templates and a paper test. Templates can constrain wording, but template use alone cannot guarantee term fidelity: an incorrectly filled slot, undisclosed label or authored extra condition can still violate it. `KW-REPLY` preserves the paper test before design freeze or software proof. These remain proposed acceptance activities; this research does not show that composing or bargaining is enjoyable.

The [C2.1 B0 README](../../../design/encounter-core/c21-b0/v0.1.2/README.md) is a comparison point for observation-scoped knowledge, belief, Intake/Delivery and authority/action separation. Its proposed capabilities and finite proof cases do not override the source pack, settle NPC policy, or authorize changes to C2.1 B0. This work changes no accepted contract or package.

### Pinned primary sources actually read

All links below identify repository paths at exact commits; symbol names provide durable section locators. These are source inspections, not execution or compatibility tests.

| ID | Snapshot and inspected source | Evidence used |
| --- | --- | --- |
| E-STATE | Ensemble `8b74bdec4ba2ef4e14795b7591df3b5d73f283e3`, [socialRecord.js](https://github.com/ensemble-engine/ensemble/blob/8b74bdec4ba2ef4e14795b7591df3b5d73f283e3/ensemble/socialRecord.js), `setupNextTimeStep`, `get`, `set`, `addHistory` | Predicate history by timestep, defaults, directions and durations; backstory loading |
| E-RULE | Same commit, [RuleLibrary.js](https://github.com/ensemble-engine/ensemble/blob/8b74bdec4ba2ef4e14795b7591df3b5d73f283e3/ensemble/RuleLibrary.js), `runTriggerRules`, `calculateVolition`, `evaluateConditions` | Separate rule evaluation, triggered effects, weighted volitions and explanations |
| E-ACTION | Same commit, [ActionLibrary.js](https://github.com/ensemble-engine/ensemble/blob/8b74bdec4ba2ef4e14795b7591df3b5d73f283e3/ensemble/ActionLibrary.js), `doAction`, `getActionHierarchyFromVolition`, `actionIsAppropriate`, `computeInfluenceRuleWeight` | Conditioned role bindings, action hierarchy, acceptance polarity, influence and effect execution |
| E-VOLITION | Same commit, [Volition.js](https://github.com/ensemble-engine/ensemble/blob/8b74bdec4ba2ef4e14795b7591df3b5d73f283e3/ensemble/Volition.js), `isAccepted`, `register` | Numeric ordering, acceptance cutoff and acceptance default when no matching volition is found |
| E-AUTHOR | Same commit, [README, Ensemble Authoring Tool](https://github.com/ensemble-engine/ensemble/blob/8b74bdec4ba2ef4e14795b7591df3b5d73f283e3/README.md) and [ruleTester.js](https://github.com/ensemble-engine/ensemble/blob/8b74bdec4ba2ef4e14795b7591df3b5d73f283e3/ensembletool/js/ruleTester.js), `update` and condition display | Domain authoring divided into schemas, rules, cast, history and actions; inspection of bound conditions |
| F-KB | FAtiMA Toolkit `56b7cbd992f953cfe21a7b12cb1a0e6cdf6ccf9f`, [KB.cs](https://github.com/GAIPS/FAtiMA-Toolkit/blob/56b7cbd992f953cfe21a7b12cb1a0e6cdf6ccf9f/Components/KnowledgeBase/KB.cs), `Tell`, `AskProperty`, `AssertPerspective` | Perspective-indexed properties, belief certainty and dynamic property queries |
| F-RPC | Same commit, [RolePlayerCharacterAsset.cs](https://github.com/GAIPS/FAtiMA-Toolkit/blob/56b7cbd992f953cfe21a7b12cb1a0e6cdf6ccf9f/Assets/RolePlayCharacter/RolePlayerCharacterAsset.cs), constructor, `Perceive`, `Decide`, `UpdateBelief`, `EventRecords` | Character KB, autobiographic memory, perceived events, candidate utility ordering and dialogue substitutions |
| F-APPRAISAL | Same commit, [EmotionalAppraisalAsset.cs](https://github.com/GAIPS/FAtiMA-Toolkit/blob/56b7cbd992f953cfe21a7b12cb1a0e6cdf6ccf9f/Assets/EmotionalAppraisal/EmotionalAppraisalAsset.cs), `AppraiseEvents`, `UpdateEmotions` | Event recording, property-change processing and configurable appraisal feeding emotional state |
| F-DECISION | Same commit, [EmotionalDecisionMakingAsset.cs](https://github.com/GAIPS/FAtiMA-Toolkit/blob/56b7cbd992f953cfe21a7b12cb1a0e6cdf6ccf9f/Assets/EmotionalDecisionMaking/EmotionalDecisionMakingAsset.cs), `RegisterKnowledgeBase`, `Decide` | Activated rules generate candidate actions; application retains execution responsibility |
| F-SOCIAL | Same commit, [SocialImportanceAsset.cs](https://github.com/GAIPS/FAtiMA-Toolkit/blob/56b7cbd992f953cfe21a7b12cb1a0e6cdf6ccf9f/Assets/SocialImportance/SocialImportanceAsset.cs), `GetSocialImportance`, `CalculateSI` | Perspective-sensitive relational attribution, cached values and configured attribution rules |
| F-EXCHANGE | Same commit, [SocialExchange.cs](https://github.com/GAIPS/FAtiMA-Toolkit/blob/56b7cbd992f953cfe21a7b12cb1a0e6cdf6ccf9f/Assets/CommeillFaut/SocialExchange.cs), `VolitionValue`, and [CommeillFautAsset.cs](https://github.com/GAIPS/FAtiMA-Toolkit/blob/56b7cbd992f953cfe21a7b12cb1a0e6cdf6ccf9f/Assets/CommeillFaut/CommeillFautAsset.cs), `CalculateSocialMoveVolition` | Authored exchange steps, starting conditions and mode-specific influence rules |
| F-AUTHOR | Same commit, [IntegratedAuthoringToolAsset.cs](https://github.com/GAIPS/FAtiMA-Toolkit/blob/56b7cbd992f953cfe21a7b12cb1a0e6cdf6ccf9f/Assets/IntegratedAuthoringTool/IntegratedAuthoringToolAsset.cs), `GetDialogueActions`, `GetDialogAction`, and [tutorial](https://github.com/GAIPS/FAtiMA-Toolkit/blob/56b7cbd992f953cfe21a7b12cb1a0e6cdf6ccf9f/Tutorials/IntegratedAuthoringToolTutorial/Program.cs) | Dialogue selected by state, meaning and style; character action selection precedes retrieval of an utterance |

## 2. Retain, adapt and reject

Each Encounter column below is an **Encounter proposal**, except where it explicitly restates the KeyWrapping baseline. Source symbols support the observed donor behavior, not the proposed policy.

| Pattern and source | Retain or adapt for Encounter | Reject or leave undecided |
| --- | --- | --- |
| Social state and history, E-STATE | Retain a distinction between current social concerns and source-linked history. Adapt history queries to an actor's authorized receipts and beliefs; keep immutable occurrences separate from revisable interpretation. | A shared social record is not automatically a safe NPC knowledge store. Do not inherit predicate defaults as evidence, reversible timesteps as occurrence deletion, or status expiry as history erasure. |
| Trigger versus desire, E-RULE | Retain separate descriptions for an eligibility/constraint rule, a preference and a consequence proposal. Explanations help authorized testers identify relevant terms and evidence. | A trigger that matches global truth must not silently teach every NPC that truth or mutate a deal without the transaction authority's validation. |
| Actions versus volition, E-ACTION | Retain explicit participant bindings and conditions on candidate acts. Separate discussable meaning, willingness and authorized performance. | Ensemble acceptance polarity is not Encounter's exact proposal-version acceptance. An action hierarchy does not define wrapper nesting or commitment lifecycle. |
| Weighted volition, E-VOLITION | Retain only the question “which considerations favor this response?” | Do not adopt the numeric cutoff, missing-match acceptance default, summed influence or a universal persuasion score. Unknown feasibility/authority can produce an inquiry instead of assumed assent. |
| Beliefs and perspective, F-KB / F-RPC | Retain character-owned interpretation and memory distinct from outside events. Add explicit receipt/source chains and authorized projection before decision input is assembled. | A perspective parameter, certainty number or model of another mind is not access control or proof. An NPC's belief about another NPC is still the first NPC's belief. |
| Appraisal, F-APPRAISAL | Retain the distinction between perceived occurrence and actor-relative significance. Needs, priorities and concern categories can explain why the same terms matter differently. | No OCC emotion taxonomy, decay model, sensor pipeline or numerical emotional state is selected. Emotion inference cannot certify a speaker's actual feelings, honesty or hidden intent. |
| Decision candidates, F-DECISION / F-RPC | Retain structured candidate responses and independent authorized execution. A response can be intelligible despite lacking a supported world executor. | Do not import utility maximization, tie randomization or automatic event ingestion. Repeatability and variation remain owner/scenario decisions with recorded policy revisions. |
| Relational interpretation, F-SOCIAL / F-EXCHANGE | Retain authored expectations appropriate to a relationship and setting, with actor-known evidence and provenance. Authority and obligation can influence willingness without being reducible to liking. | Social importance is not legal authority, ownership, consent, objective morality, Player significance/promotion or guaranteed compliance. No fixed social rank/threshold table is adopted. |
| Authoring and diagnostics, E-AUTHOR / F-AUTHOR | Retain distinct authored meaning, policy conditions and rendering choices. Inspect bindings, contradictory rules, missing evidence and why candidate responses were considered. | Import neither donor's authoring UI, sample domain, dialogue-tree grammar nor unscoped belief substitutions. BASED's intended performance is not permission to disclose hidden calculations. |

The result should support small scenario-authored policies. It need not model the complete population or simulate offscreen conversation. A relationship or broken-promise history can matter only if the deciding actor learned it, inferred it through an allowed rule, or legitimately held it as authored background. Knowing the label “Warehouse Deal” alone supplies none of its hidden terms or performance history (`KW-CONTEXT §§20, 24`).

## 3. Proposed minimum decision interfaces

These are documentation interfaces for synthesis, with illustrative field names. They are not serialized contracts, algorithms, runtime modules or JSON Schemas. All sample IDs belong to one explicit fictional fixture scope; a real cross-artifact reference must additionally carry the repository's producer, exact artifact and local-kind identity qualification.

### Actor-authorized evaluation input

The decision stage receives a finite, revision-bound view assembled **for the deciding actor**:

1. The received expression and its exact proposal/version or unresolved context; communication receipt, source, time and actual perceivable BASED cues. A performance label is available only when it was actually conveyed or is explicitly authored as observable; the private selector is never passed through.
2. Actor-owned needs, preferences, current priorities and intended commitments. These remain private unless deliberately expressed. No minimum numeric need scale or universal personality profile is required.
3. Actor-known resources, control/capability and perceived feasibility, each marked as observation, testimony, belief, authored background or inference. Objective feasibility remains an independent execution concern. An NPC may believe it can comply and be wrong, or knowingly offer impossible terms.
4. Actor-perceived costs, risks, alternatives and relationship context. Preserve uncertain or contested interpretations rather than completing them from canonical truth.
5. Relevant known obligations, permissions, asserted authority and open proposals. Separate “believes authorized” from a validated authority grant, and willingness from performative validity.
6. A bounded evidence set with acquisition source, visibility scope and revision, plus the authored decision policy identifier/revision. Missing evidence stays missing; no fallback query into canonical history or another actor's private state is allowed.

Illustrative private evaluation input, not a Player payload:

```json
{
  "fixture_scope": {
    "producer": "Encounter",
    "artifact": "illustrative-key-lending-paper-fixture",
    "revision": "draft-a"
  },
  "actor_ref": {"kind": "actor", "id": "shopkeeper"},
  "received_expression_ref": {"kind": "expression", "id": "lend-key-offer"},
  "proposal_ref": {"kind": "proposal_version", "id": "key-loan-v2"},
  "receipt_ref": {"kind": "receipt", "id": "shopkeeper-heard-offer"},
  "known_terms": ["lend shop key", "return time unresolved"],
  "observable_delivery_refs": ["receipt:audible-polite-request"],
  "private_concern_refs": ["concern:close-shop-with-key"],
  "perceived_feasibility": "unresolved-until-return-time-specified",
  "evidence_refs": ["observation:holds-key", "memory:shop-closing-duty"],
  "decision_policy_ref": "policy:shopkeeper-paper-draft-a"
}
```

The free strings summarize an index-card fixture, not machine-readable action semantics. The synthesis must bind actual terms to typed clauses before any later implementation. Private concerns and evidence references are never copied wholesale into a renderer's input, tooltip or exported Player book.

### Structured decision result and private diagnostics

The decision result identifies the considered expression/proposal version and chooses `accept`, `refuse`, `counter`, `ask` or `challenge`, or records unresolved interpretation. A counter supplies new structured terms without replacing the prior version. An acceptance targets exact grouped terms; it does not certify fulfillment, truthfulness or executable capability. A response's performance must still satisfy the relevant speech-act validity and encounter/turn conditions.

Keep the internal evaluation trace in a separate actor-private or explicitly authorized Director/tester record. It may reference failed constraints, competing concerns, uncertainty and supporting receipts. It must not be passed as an unfiltered “reason” field to Player presentation. The outward response can truthfully disclose a reason, evade it or make a separately represented false claim. An authored lie is a communication event with a claim; it is not permission to replace the protected private diagnostic or canonical occurrence.

### Outward meaning and dialogue realization input

Only the approved outward mechanical meaning, audience-authorized labels/references, deliberate communicated claims and selected observable delivery reach the renderer. This subset is formed by an explicit disclosure decision and recipient projection. A new disclosure must be represented by the outgoing communication; the receiver's knowledge changes only on eligible receipt. It is not granted because the generator received secret context.

Illustrative outward result for the fixture above:

```json
{
  "fixture_scope": {
    "producer": "Encounter",
    "artifact": "illustrative-key-lending-paper-fixture",
    "revision": "draft-a"
  },
  "speaker_ref": {"kind": "actor", "id": "shopkeeper"},
  "response_kind": "ask",
  "addresses_proposal_ref": {"kind": "proposal_version", "id": "key-loan-v2"},
  "communicated_meaning": "request an explicit return time for the shop key",
  "audience_label": "Shop key",
  "observable_delivery": "a calm question",
  "dialogue_example": "When would you bring the key back?"
}
```

This asks for clarification and creates no agreement. Neither secret shop-closing duty nor a hidden motive label appears in the outward result. The dialogue example conveys the fixed request and introduces no new binding deadline. A later renderer must not turn it into “Return it before closing and we have a deal” without adding the corresponding counterproposal and obtaining the appropriate decision. This fidelity requirement follows `KW-CONTEXT §16` and `KW-REPLY`; F-AUTHOR supplies only a comparison pattern for selecting words after actions.

Actual outward dialogue/performance remains important to the Player's reading of the character. Structured output does not replace it, and a public “Deception=true” flag must not certify that an NPC is lying. Recipients may form source-linked suspicions from outward cues; suspicion and the speaker's true intent remain separate records.

## 4. Policy choices that remain open

The following are proposed decision dimensions, **not the missing four-check diagram or a fixed evaluation order**: understood terms and context; actor-perceived feasibility; authority/obligation conflicts; expected needs/preferences; relationship and source credibility; costs/risks and alternatives; willingness to disclose; and candidate accept/refuse/counter/ask/challenge responses. Their interaction, precedence and variation need authored scenario tests.

For example, an NPC may ask about a missing term despite disliking the proposal; refuse privately on cost grounds while offering an outward pretext; accept a task it cannot actually perform; or make a counter conditioned on a permission it mistakenly believes the Player controls. Keeping these distinctions permits deception and mistaken belief without treating invalid authority or nonexistent performance as actual success. No rule here requires a first failure to terminate consideration or all conditions passing to force assent.

The Director/tester needs sufficient diagnostics to distinguish a deliberate lie, uncertain belief, refused request, unsupported world capability and renderer inconsistency. The Player needs performed communication and legitimately acquired sources, not the same diagnostic trace. Whether and how ordinary Player UI reports failed performance remains an open presentation decision with leakage review.

## 5. Proposed paper and later implementation acceptance scenarios

These are planned checks, **not executed results**. Run the paper test before freeze/implementation; software verification later tests data and information boundaries rather than proving fun.

| Scenario | Required distinction and review observation |
| --- | --- |
| Same key loan, two NPCs with different priorities | Needs and relationships can yield different structured responses while each view remains actor-local. Watch whether the Player can improve terms or circumstances intelligibly. |
| Unresolved return time | `ask` retains exact proposal context; dialogue cannot silently accept or invent a deadline. |
| Secret broken promise known to only one NPC | Only the informed NPC's evaluation may use its history. The other NPC cannot query it by wrapper label, rule failure or generic relationship lookup. |
| True breach versus false allegation | Canonical performance, actor receipt, belief and accusation remain separate. A false rumor can affect willingness only through that actor's recorded acquisition/inference. |
| Polite and menacing delivery with identical terms | A listener reacts to outward cues and known circumstances, not an invisible BASED selector or hidden sender intention. No universal reaction bonus is assumed. |
| Mistaken capability or dishonest assent | Decision, valid acceptance and actual completion remain distinguishable. Agreement does not create the resource, authority or success. |
| Private motive and public pretext | Private trace stays protected; the pretext is an explicit communicated claim. Player labels, dialogue slots and exports reveal no additional motive. |
| Unauthorized “I cancel your debt” | Willingness to say it cannot supply the missing creditor authority. Validate the attempted performance independently without leaking unrelated private reasons. |
| Meaning-rendering mismatch | Any added amount, party, condition, deadline, allegation or promise is identified as a semantic mismatch unless explicitly represented. |
| Repeated paper scene | Record which words and terms participants actually use, whether refusals offer understandable opportunities and whether conversation stays engaging. Do not infer enjoyment from record validity. |

Later software scope would require separate owner authorization. Future tests should include hidden-state substitutions: change facts that the deciding actor has no lawful path to learn and confirm no effect on its inputs, response or rendering. Changing an authorized receipt can change the decision. Even identical visible outcomes do not prove safety if logs, errors, labels, timing or nested reference expansion disclose private differences. Independent sealing and combinatorial audits should challenge these proposals before any freeze.

## 6. Versions, source use, licenses and access limits

| Donor | Version basis and source use here | License obligations recorded for possible future reuse |
| --- | --- | --- |
| Ensemble | Exact commit above; original architecture analysis and comparison only. No code, sample social rules, domain schema, binaries, screenshots or datasets copied. | [Pinned LICENSE.md](https://github.com/ensemble-engine/ensemble/blob/8b74bdec4ba2ef4e14795b7591df3b5d73f283e3/LICENSE.md): University of California-specific BSD-4-Clause. Source redistribution preserves copyright/conditions/disclaimer; binary redistribution reproduces them in accompanying material; advertising mentioning features or use must carry its specified UC Santa Cruz acknowledgement; no endorsement by university/contributor names without permission. Do not flatten this into BSD-3-Clause or omit the advertising clause. |
| FAtiMA Toolkit | Exact commit above, rather than an inferred release tag; original architecture analysis only. No C# code, authoring assets, dialogue corpus, emotional parameters or binaries copied. | [Pinned License.txt](https://github.com/GAIPS/FAtiMA-Toolkit/blob/56b7cbd992f953cfe21a7b12cb1a0e6cdf6ccf9f/License.txt): Apache License 2.0. Future code redistribution requires a license copy, applicable notice retention and identification of modified files; preserve applicable NOTICE attribution if present and relevant. The license also addresses patents and trademarks. |

These licenses do not constitute a blanket clearance for every third-party library, bundled dependency, image, voice, document or dataset in either repository. No such asset is selected or imported. Any future copying must identify the particular artifact and its own notices/terms in the [source/license ledger](SOURCE_LICENSE_LEDGER.md), and obtain the separate implementation/publication authorization relevant to that use. Citations here identify conceptual sources without claiming endorsement or framework conformance.

Pinned files and repository trees were accessible through the connected GitHub read tools. Several web fetches of Ensemble paths and the FAtiMA Assets directory returned cache misses; connector reads recovered the exact files listed above. The FAtiMA website was inaccessible in preflight, so this analysis relies on repository source rather than unverified website API claims. No donor was installed, compiled, executed or benchmarked. Tutorials were inspected as source; demos, GUI behavior, all framework branches, external documentation PDFs and third-party license inventories were not exhaustively audited. A snapshot analysis is neither a claim about the newest release nor evidence that either framework enforces Encounter's information boundaries.

The synthesis should carry forward the baseline's sealing, grouped/versioned terms, explicit performance validity and decision/wording separation, while leaving the exact scenario policy open. All interface spellings and policy organization in this report remain proposals for the architect and subsequent independent audits.
