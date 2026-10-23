# Candidate JSON record family and paper fixtures

**Version:** v0.1 · **Date:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT
**Role:** Schema & Combinatorics Engineer

These original Encounter examples specify separations and concrete field meanings for review. They are JSON **instances in Markdown**, not JSON Schema, runtime fixtures, migrations or serialization commitments. No backend is chosen. The source-pack baseline, recommendations and unresolved choices remain distinguished in [SOURCE_SNAPSHOT.md](../../../research/keywrapping-substrate/v0.1/SOURCE_SNAPSHOT.md), [DECISION_LOG.md](DECISION_LOG.md) and [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md). C2.1 B0 is a comparison only. Read alongside [SUBSTRATE_SPEC.md](SUBSTRATE_SPEC.md), [EXPRESSIONS_COMPATIBILITY.md](EXPRESSIONS_COMPATIBILITY.md) and [SCHEMA_DESIGN.md](SCHEMA_DESIGN.md).

## Notation, identity and version axes

All examples share the **F1 paper fixture** below. A privileged record's identity is `(producer, artifact, artifactRevision, recordType, id)` in that context. Its positive integer `revision` addresses that record's immutable revision; an event's original revision is not overwritten by a later interpretation. A proposed full canonical reference carries `producer`, `artifact`, `artifactRevision`, `kind`, `id` and, for a revision-specific target, `revision`. `kind` must match `recordType` or the external declaration's kind. ID spelling/case matters; no runtime prefix convention is asserted.

To keep examples legible, **only in this paper fixture**, `{ "ref": "x" }` abbreviates a full qualified reference to the uniquely declared F1 object or record `x`. A revision field pins an exact record revision. The declaration table and envelopes provide its kind. This abbreviation is not a proposed global wire format or a bare ID acceptable across packages. Every such target is either a record in a later block or an explicitly external declaration below; forward references are intentional. A `termId`, `groupId`, expression `node` or sense token is a local symbolic selector, not a canonical ref.

`recordFormat` names this illustrative record notation; `artifactRevision` identifies authored paper content; `worldSnapshot` identifies privileged paper history; a record's `revision`, a proposal's `termsRevision`, and the actor's opaque `informationToken` are separate axes. None upgrades, validates or hashes the others. No actual content hashes are invented. If hashes are later useful, record their algorithm and exact byte/canonicalization scope separately. A hash cannot prove truth, license, compatibility or access permission.

**F1 context — AUTHOR/PRIVATE, never an actor export.** External objects and their scoped identities are declared here rather than relying on a hidden registry. The external objects are illustrative authored background, not actual game/package IDs. `initialKnowledge` grants only the named reference/type and its given label to the indicated actor, not all related facts. Background starts are a scenario proposal consistent with earned vocabulary; the author records their basis explicitly.

```json
{
  "fixture": "F1",
  "context": {
    "producer": "Encounter",
    "artifact": "keywrapping-paper-warehouse",
    "artifactRevision": "1",
    "recordFormat": "kw-paper-records-v0.1",
    "worldSnapshot": "paper-history-1",
    "clock": "paper-ticks"
  },
  "external": [
    { "id": "player", "kind": "actor" },
    { "id": "guard", "kind": "actor" },
    { "id": "ray", "kind": "actor" },
    { "id": "marcus", "kind": "actor" },
    { "id": "shopkeeper", "kind": "actor", "privateName": "Eddie" },
    { "id": "coins", "kind": "resource", "unit": "coin" },
    { "id": "key", "kind": "object" },
    { "id": "warehouse", "kind": "place" },
    { "id": "keyTopic", "kind": "informationTopic", "designation": "Ray's account of hiding the spare key" },
    { "id": "entryActivity", "kind": "activity", "designation": "Player entry to warehouse" },
    { "id": "entryControl", "kind": "authorityBasis", "holder": "guard", "scope": "grant Player one warehouse entry" },
    { "id": "entryRuleAuthority", "kind": "authorityBasis", "holder": "guard", "scope": "issue scoped warehouse-entry norms in the later paper demonstration only" },
    { "id": "entryCapabilityAt32", "kind": "capabilityAssessment", "designation": "privileged paper fact: Player can physically enter at tick 32, independently of the conflicting norms; not automatically Player-known" },
    { "id": "openingStockLoss", "kind": "occurrence", "designation": "authored offscreen consequence of a Player encounter affecting shopkeeper at tick 40" },
    { "id": "stockLossTrace", "kind": "evidence", "designation": "privileged effect trace of openingStockLoss; unavailable to Player" },
    { "id": "shopMeetingReceipt", "kind": "receipt", "designation": "Player meets unnamed shopkeeper at tick 50 and receives only the role label" },
    { "id": "nameReceipt", "kind": "receipt", "designation": "at tick 60 shopkeeper introduces self as Eddie in a Player encounter" },
    { "id": "disputeClaim", "kind": "claim", "designation": "guard's later allegation about agreement outcome; no automatic truth status" }
  ],
  "initialKnowledge": [
    { "holder": "player", "references": ["player", "guard", "ray", "marcus", "coins", "key", "warehouse", "entryActivity"], "basis": "scenario-authored prior acquaintance and resource recognition" },
    { "holder": "guard", "references": ["player", "guard", "ray", "coins", "key", "warehouse", "entryActivity", "keyTopic"], "basis": "scenario-authored acquaintances and the described information topic; not its payload" }
  ]
}
```

The external authority establishes only the stated grant scope. It grants no general ownership, knowledge of Ray's account or power to bind other parties. The occurrence/evidence/receipts in `external` are explicitly authored declarations for this paper, not claims that omitted implementation records were inspected. External receipt authenticity, exact content and tick bounds are assumptions of the fixture and would need real evidence in an implementation.

## Small family, common presence rules and field rationale

Every privileged record below requires `recordType`, unique local `id` and positive `revision`, inheriting F1 context. Family-specific required fields are those listed without `?` in this table. A question mark denotes optionality; absence has the specified narrow meaning. No `null` values are used or silently substituted. All unlisted fields are undefined in this paper notation; a future extension policy needs separate review.

| Family / required fields and optional fields | Meaning and reason | Boundary and source |
| --- | --- | --- |
| `occurrence`: `at`, `effect`, `participants`; `authorityBasis?`, `causedBy?` | Validated paper-world effect, tick and participating refs; optional authority/causal evidence is separate from the effect. Its absence means not recorded here, never “unauthorized” or “uncaused.” | No automatic witnesses. KW-CONTEXT §§15, 19–21; Encounter effect structure proposal. |
| `observation`: `holder`, `at`, `content`, `channel`; `occurrence?` | What an actor perceived; a source occurrence can remain unknown or unconfirmed. Content is the actual fragment, not the whole source. | Observation is not complete understanding. KW-CONTEXT §§19–20; provenance miner. |
| `expression`: `function`, `speaker`, `addressees`, `force`, `time`, `body`; `outwardCues?` | Delivered/prepared meaning with typed body, Function and explicit force/time. Delivery is evidenced separately; intended addressees alone do not acquire it. | Three Functions only. No private BASED selector/intent in outward cues. KW-CONTEXT §§13–16; KW-REPLY. |
| `communication`: `expression`, `emittedAt`, `channel`; `actualSource?`, `privateIntent?` | Actual emission; optional actual provenance and explicitly authored private intent remain privileged. Absence of intent means unmodeled, not sincere. | Falsity never proves intent. PROV-inspired original separation; provenance miner. |
| `receipt`: `holder`, `receivedAt`, `communication`, `receivedContent`, `extent` | Delivery evidence for only the received fragment. `extent=completeExpression` refers to fully received expression content; partial extent contains its own fragment. | Never expose a full expression link to a partial listener. Receipt does not mean belief/assent. KW-CONTEXT §§18–20. |
| `evidence`: `source`, `availableTo`, `supports`, `assessment` | Scoped evidence for a proposition or effect. `assessment` says what this evidence establishes, not universal truth. | Possessing evidence grants no nested access or independent corroboration. Provenance mining. |
| `claim`: `claimant`, `at`, `proposition`; `sourceAssertion?` | Speaker-attributed proposition and claimed source, possibly false, alleged or fictional. Missing source assertion means none represented in the claim, not no actual source. | No occurrence ref is mandatory. SourceAssertion does not replace actual lineage. KW-CONTEXT §§19–21. |
| `stance`: `holder`, `at`, `claim`, `position`, `basis` | Actor-local belief/doubt/interpretation with eligible basis. Position labels are nonnumeric candidate categories. | No canonical truth or another mind's state. KW-REPLY predicates; provenance/social mining. |
| `definition`: `definitionKind`, `token`, `sourceEntry`, `roles`, `functions`, `performance` | Candidate action/predicate signature with role and Function compatibility. These are authored definitions, not an imported ontology or ratified registry. | Dictionary entry and selected sense govern; field names are Encounter proposals. |
| `normativeRule`: `modality`, `issuer`, `authority`, `subject`, `activity`, `scope`, `condition`, `basis` | Permission or prohibition attributed to a scoped authority, with explicit typed condition. Each rule survives independently when norms conflict. | A norm neither proves physical capability nor automatically executes an effect. Transaction donor mining; no universal legal engine. |
| `wrapper`: `referentKind`, `subject`, `origin`; `links?` | Addressable subject and typed links, whether real, alleged, disputed or authored fictional. Origin is the causal encounter basis, not a grant of actor visibility. | Durable identity differs from learned label. KW-CONTEXT §§4, 7–12, 17. |
| `label`: `holder`, `target`, `text`, `basis`, `acquiredAt`; `attribution?` | Holder-specific name with acquired basis. Missing attribution means this fixture's holder-applied label, not an objective title. | Titles can leak. KW-REVIEW naming warning. |
| `promotion`: `target`, `at`, `basis`, `significance`, `historicalRetention`, `activePriority` | Significance allocation, causal retention policy and current simulation salience are separate dimensions. Values below are paper choices. | Does not acquire, label or notify. KW-CONTEXT §§5–12. |
| `acquisition`: `holder`, `target`, `at`, `basis`, `availability` | How a holder gains a permitted reference/fragment; current book availability recorded separately from promotion and retention. | No Player scratchpad. Availability policies remain OQ-02. |
| `identityAssociation`: `holder`, `knownHandles`, `at`, `basis`, `assessment` | Actor-acquired association between previously known handles. It may be disputed or mistaken. | Never merge world people from an actor claim or retroactively rewrite old views. KW-CONTEXT §10 and provenance mining. |
| `proposalVersion`: `proposalId`, `termsRevision`, `terms`, `proposer`, `communicatedBy`, `requiredParties`, `eligibility`; `counterOf?` | Immutable exact terms and party requirements; counter linkage never overwrites prior speech. Eligibility is a privileged paper assessment, not a free public badge. | A proposal is not its proposer's assent in this fixture. KW-CONTEXT §§17–18; transaction mining. |
| `assent`: `party`, `target`, `termsRevision`, `performedBy`, `termsBasis`, `validity` | Exact targeted version and explicit eligible self performance, supported by acquired/authored terms. | Validity is privileged; unknown conditions are not automatically false or a public reason. |
| `agreement`: `proposalVersion`, `assents`, `formedAt`, `obligations` | Formed relation only when every required party validly assents to the same exact terms. | Cannot bind an unrepresented third party. KW-CONTEXT §18. |
| `promise`: `promisor`, `beneficiary`, `content`, `createdBy`, `validityPolicy`, `obligations` | A valid self undertaking with exact content and delivery evidence. This need not fabricate a bilateral agreement. | Beneficiary receipt/self-standing policy is explicitly a fixture choice; global promise validity remains open. |
| `obligation`: `formationBasis`, `termId`, `debtor`, `beneficiary`, `performance`, `activation`, `satisfaction` | Individual duty and explicit activation/credit rule. `formationBasis` selects exact agreement or valid promise; `performance` resolves within its exact content expression. | Activation, due, credited quantity, impossibility, breach allegation and dispute are separate dimensions. |
| `performanceCredit`: `obligation`, `sourceEffect`, `creditedAt`, `credit`, `assessment` | One scoped effect's credit to one duty. Identity must prevent replay/double allocation under the chosen rule. | A claim of fulfillment cannot replace an effect/receipt. |
| `obligationAssessment`: `obligation`, `at`, `activation`, `credited`, `remaining`, `due`, `dispute` | Derived paper assessment tied to evidence/history; `notSpecified` is explicit unknown deadline, not overdue/never due. | No single lossy enum collapsing normative and performance status. |
| `projection`: `audience`, `purpose`, `worldSnapshot`, `knowledgeCutoff`, `authorizedView` | Privileged request/result association; only `authorizedView` can become an actor export. | Project before serialization. No full-world object sent then cosmetically hidden. KP-01–KP-14. |

Absence is never a truth-negation/default, a permission grant or proof that a hidden relation does not exist. An actor export omits inaccessible fields without redaction counts or placeholder entries. Actor-known uncertainty can be expressed with its acquired basis; concealed existence cannot be marked merely because the author knows it. Empty lists in the **actor view** enumerate only that bounded view, not all world relations. Privileged empty lists assert only the fixture's explicitly bounded field.

Exact target revisions are required for proposal terms, assent, credit source evidence and historical interpretation. Identity-only wrapper/actor refs can omit `revision` when pointing to a stable subject; the privileged snapshot/knowledge cutoff still bounds every resolved attribute. A missing or mismatched exact revision is not “latest.” Structural typing and a resolvable ref do not grant standing or disclosure rights.

## Illustrative sense crosswalk

The following tokens are **local F1 example aliases, not ratified registry IDs**. Their entire meaning is the named candidate dictionary sense plus explicit fixture terms. No `Dxx` donor citation is used as an executable action ID. Predicates are separately analyzed in that dictionary; there is no claim that VerbNet supplies the gameplay validity rules.

| Example token | Dictionary entry and selected sense | F1 role names |
| --- | --- | --- |
| `give.resource` | 01 Give — tangible/resource transfer, explicit custody interpretation | `actor`, `recipient`, `theme`, `quantity`, `transferMode` |
| `take.resource` | 02 Take — acquiring control/possession; legality separate | `actor`, `theme`, `source` |
| `tell.content` | 17 Tell — communicate selected attributed content | `actor`, `recipient`, `contentTopic`, `reportMode`, `truthWarranty` |
| `hide.object` | 21 Hide — conceal an object at a specified location | `actor`, `theme`, `location` |
| `accept.proposal` | 09 Accept — exact eligible proposal-version binding | `actor`, `target`, `termsRevision` |
| `promise.undertake` | 11 Promise — self-attributable future undertaking, distinct from fulfillment | `actor`, `beneficiary`, `content` |
| `return.resource` | 06 Return — restore a resource to identified prior holder/agreed destination | `actor`, `theme`, `destination`; prior basis remains explicitly optional |
| `allow.access` | 46 Allow — authority-bound permission scope, not physical opening | `actor`, `beneficiary`, `activity`, `scope` |
| `TRUSTS` | Predicate recommendation — holder-attributed trust relation | `subject`, `object`; no universal numeric scale |

Other canonical primitive effects below (`permissionGranted`, `resourceTransferred`) describe paper outcomes, not extra Player action words. The future need for a sense registry and its versioning remains open. The four candidate additions Attack/Hurt/Kill/Steal are not used as language actions.

## Secret receipt, false claim and predicate remark

**AUTHOR/PRIVATE records.** Ray actually hid the key; the guard later took it. Ray tells the Player a true account of his hiding, then falsely says Marcus took it, claiming eyewitness status. Intentional misrepresentation is explicitly authored here; a runtime must not infer it from falsity. Actual hide/take records have no observer list, so their existence does not teach the Player. The Player receives attributed accounts, not certified world history. The secret is a privately held account disclosed through a real receipt; secrecy, truth and belief are independent.

```json
{
  "fixture": "F1",
  "records": [
    { "recordType": "occurrence", "id": "hide0", "revision": 1, "at": 0, "effect": { "sense": "hide.object", "actor": { "ref": "ray" }, "theme": { "ref": "key" }, "location": { "ref": "warehouse" } }, "participants": [{ "ref": "ray" }, { "ref": "key" }] },
    { "recordType": "occurrence", "id": "take1", "revision": 1, "at": 1, "effect": { "sense": "take.resource", "actor": { "ref": "guard" }, "theme": { "ref": "key" }, "source": { "ref": "warehouse" } }, "participants": [{ "ref": "guard" }, { "ref": "key" }] },
    { "recordType": "claim", "id": "secretAccount", "revision": 1, "claimant": { "ref": "ray" }, "at": 2, "proposition": { "node": "action", "sense": "hide.object", "time": { "stance": "past", "at": 0 }, "roles": { "actor": { "ref": "ray" }, "theme": { "ref": "key" }, "location": { "ref": "warehouse" } } }, "sourceAssertion": { "mode": "selfReport" } },
    { "recordType": "expression", "id": "secretSpeech", "revision": 1, "function": "REMARK", "speaker": { "ref": "ray" }, "addressees": [{ "ref": "player" }], "force": "assertion", "time": { "stance": "current" }, "body": { "claim": { "ref": "secretAccount", "revision": 1 } } },
    { "recordType": "communication", "id": "secretEmission", "revision": 1, "expression": { "ref": "secretSpeech", "revision": 1 }, "emittedAt": 2, "channel": "privateSpeech", "actualSource": { "ref": "hide0", "revision": 1 } },
    { "recordType": "receipt", "id": "secretReceipt", "revision": 1, "holder": { "ref": "player" }, "receivedAt": 3, "communication": { "ref": "secretEmission", "revision": 1 }, "receivedContent": { "claim": { "ref": "secretAccount", "revision": 1 } }, "extent": "completeExpression" },
    { "recordType": "acquisition", "id": "secretAcquired", "revision": 1, "holder": { "ref": "player" }, "target": { "ref": "secretAccount", "revision": 1 }, "at": 3, "basis": { "ref": "secretReceipt", "revision": 1 }, "availability": "availableAsAttributedAccount" },
    { "recordType": "observation", "id": "rayObservation", "revision": 1, "holder": { "ref": "ray" }, "at": 1, "occurrence": { "ref": "take1", "revision": 1 }, "channel": "sight", "content": { "sense": "take.resource", "actor": { "ref": "guard" }, "theme": { "ref": "key" }, "source": { "ref": "warehouse" } } },
    { "recordType": "claim", "id": "falseAccount", "revision": 1, "claimant": { "ref": "ray" }, "at": 4, "proposition": { "node": "action", "sense": "take.resource", "time": { "stance": "past", "at": 1 }, "roles": { "actor": { "ref": "marcus" }, "theme": { "ref": "key" }, "source": { "ref": "warehouse" } } }, "sourceAssertion": { "mode": "claimedEyewitness" } },
    { "recordType": "expression", "id": "falseSpeech", "revision": 1, "function": "REMARK", "speaker": { "ref": "ray" }, "addressees": [{ "ref": "player" }], "force": "assertion", "time": { "stance": "current" }, "body": { "claim": { "ref": "falseAccount", "revision": 1 } } },
    { "recordType": "communication", "id": "falseEmission", "revision": 1, "expression": { "ref": "falseSpeech", "revision": 1 }, "emittedAt": 4, "channel": "privateSpeech", "actualSource": { "ref": "rayObservation", "revision": 1 }, "privateIntent": "deliberately misattribute the observed taker to Marcus" },
    { "recordType": "receipt", "id": "falseReceipt", "revision": 1, "holder": { "ref": "player" }, "receivedAt": 5, "communication": { "ref": "falseEmission", "revision": 1 }, "receivedContent": { "claim": { "ref": "falseAccount", "revision": 1 } }, "extent": "completeExpression" },
    { "recordType": "evidence", "id": "reportEvidence", "revision": 1, "source": { "ref": "falseReceipt", "revision": 1 }, "availableTo": [{ "ref": "player" }], "supports": { "ref": "falseAccount", "revision": 1 }, "assessment": "evidence that Ray made this received assertion; not proof of taking" },
    { "recordType": "stance", "id": "rayAssessment", "revision": 1, "holder": { "ref": "ray" }, "at": 6, "claim": { "ref": "falseAccount", "revision": 1 }, "position": "disbelieves", "basis": [{ "ref": "rayObservation", "revision": 1 }] },
    { "recordType": "expression", "id": "trustRemark", "revision": 1, "function": "REMARK", "speaker": { "ref": "player" }, "addressees": [{ "ref": "guard" }], "force": "assertion", "time": { "stance": "current" }, "body": { "node": "predicate", "predicate": "TRUSTS", "subject": { "ref": "ray" }, "object": { "ref": "marcus" }, "qualification": "speakerConjecture" } }
  ]
}
```

`actualSource` in this fixture means Ray's actual source, not a Player-visible claim that Ray saw it. Ray's observation is private and does not fabricate Player observation. `reportEvidence.supports` is qualified by its assessment: source availability proves received assertion, not proposition truth. A report of a nonexistent event would use the same claim/receipt structure **without creating an occurrence**. Ray's NPC-local stance is explicitly authored; receiving a claim never auto-assigns an invisible Player belief. The predicate remark represents an explicitly composed outward Player conjecture, not private thought or a hypothesis editor. It is an unperformed composition until a communication and receipt are recorded; it neither reads Ray's mind nor changes trust.

## Grouped warehouse exchange, counter and exact assent

**AUTHOR/PRIVATE records.** These are paper choices, not settled universal bargain policy:

- V1 offers Player Give 50 coins **AND** Tell Ray's account, **IF** the guard grants Player one entry. The `IF` attaches to the whole Player group and activates its two duties after completed permission grant. Permission is not door opening or physical entry.
- The guard counters with 30 coins; both parties receive the same complete terms, including that activation/order rule. V2 makes V1 ineligible under this fixture's explicit replacement policy. Other counteroffer/withdrawal ordering policies remain open.
- Communicating a proposal creates no assent, including for its proposer. Both parties separately perform present self acceptance of exact V2. The guard's authored exact terms and Player's complete counter receipt are their terms bases. Required understanding is stipulated for this paper; receipt alone does not generally prove comprehension.
- No deadline or atomic rollback is agreed. Tell means retell one attributed report about the named topic, with no truth warranty; the topic/criterion is a known term, while the as-yet-undisclosed account payload is not an extra secret contractual term.

An exchange's sides explicitly name the undertaking parties; they need not equal the current proposing speaker. Either party can propose the whole exchange, but cannot bind the other by proposing it. Local term selectors `money`, `tell`, `access` and group `playerSide` are scoped to that exact expression revision.

```json
{
  "fixture": "F1",
  "records": [
    {
      "recordType": "expression", "id": "offer1", "revision": 1,
      "function": "OFFER", "speaker": { "ref": "player" }, "addressees": [{ "ref": "guard" }], "force": "proposal", "time": { "stance": "future" },
      "body": {
        "node": "exchange",
        "offered": { "party": { "ref": "player" }, "groupId": "playerSide", "node": "AND", "items": [
          { "node": "action", "termId": "money", "sense": "give.resource", "roles": { "actor": { "ref": "player" }, "recipient": { "ref": "guard" }, "theme": { "ref": "coins" }, "quantity": { "amount": "50", "unit": "coin" }, "transferMode": "custody" } },
          { "node": "action", "termId": "tell", "sense": "tell.content", "roles": { "actor": { "ref": "player" }, "recipient": { "ref": "guard" }, "contentTopic": { "ref": "keyTopic" }, "reportMode": "oneAttributedReport", "truthWarranty": "none" } }
        ] },
        "requested": { "party": { "ref": "guard" }, "node": "action", "termId": "access", "sense": "allow.access", "roles": { "actor": { "ref": "guard" }, "beneficiary": { "ref": "player" }, "activity": { "ref": "entryActivity" }, "scope": "oneWarehouseEntry" } },
        "conditionalLinks": [{ "node": "IF", "phase": "obligationActivation", "condition": { "termId": "access", "criterion": "permissionGrantCompleted" }, "consequence": { "groupId": "playerSide" } }],
        "settlementRules": { "money": "cumulativeDistinctTransfers", "allocation": "thisDutyOnly", "tell": "oneReceivedAttributedReport", "access": "validPermissionGrant" },
        "formation": "allRequiredPartiesExplicitlyAssent", "rollback": "none", "deadline": "notSpecified"
      }
    },
    { "recordType": "communication", "id": "offerEmission", "revision": 1, "expression": { "ref": "offer1", "revision": 1 }, "emittedAt": 10, "channel": "conversation" },
    { "recordType": "receipt", "id": "offerReceipt", "revision": 1, "holder": { "ref": "guard" }, "receivedAt": 11, "communication": { "ref": "offerEmission", "revision": 1 }, "receivedContent": { "expression": { "ref": "offer1", "revision": 1 } }, "extent": "completeExpression" },
    { "recordType": "proposalVersion", "id": "pv1", "revision": 1, "proposalId": "warehouseNegotiation", "termsRevision": 1, "terms": { "ref": "offer1", "revision": 1 }, "proposer": { "ref": "player" }, "communicatedBy": { "ref": "offerEmission", "revision": 1 }, "requiredParties": [{ "ref": "player" }, { "ref": "guard" }], "eligibility": { "from": 11, "until": 13, "policy": "counterReplacesPriorOnceBothKnow" } },
    {
      "recordType": "expression", "id": "counter2", "revision": 1,
      "function": "OFFER", "speaker": { "ref": "guard" }, "addressees": [{ "ref": "player" }], "force": "proposal", "time": { "stance": "future" },
      "body": {
        "node": "exchange",
        "offered": { "party": { "ref": "player" }, "groupId": "playerSide", "node": "AND", "items": [
          { "node": "action", "termId": "money", "sense": "give.resource", "roles": { "actor": { "ref": "player" }, "recipient": { "ref": "guard" }, "theme": { "ref": "coins" }, "quantity": { "amount": "30", "unit": "coin" }, "transferMode": "custody" } },
          { "node": "action", "termId": "tell", "sense": "tell.content", "roles": { "actor": { "ref": "player" }, "recipient": { "ref": "guard" }, "contentTopic": { "ref": "keyTopic" }, "reportMode": "oneAttributedReport", "truthWarranty": "none" } }
        ] },
        "requested": { "party": { "ref": "guard" }, "node": "action", "termId": "access", "sense": "allow.access", "roles": { "actor": { "ref": "guard" }, "beneficiary": { "ref": "player" }, "activity": { "ref": "entryActivity" }, "scope": "oneWarehouseEntry" } },
        "conditionalLinks": [{ "node": "IF", "phase": "obligationActivation", "condition": { "termId": "access", "criterion": "permissionGrantCompleted" }, "consequence": { "groupId": "playerSide" } }],
        "settlementRules": { "money": "cumulativeDistinctTransfers", "allocation": "thisDutyOnly", "tell": "oneReceivedAttributedReport", "access": "validPermissionGrant" },
        "formation": "allRequiredPartiesExplicitlyAssent", "rollback": "none", "deadline": "notSpecified"
      }
    },
    { "recordType": "communication", "id": "counterEmission", "revision": 1, "expression": { "ref": "counter2", "revision": 1 }, "emittedAt": 12, "channel": "conversation" },
    { "recordType": "receipt", "id": "counterReceipt", "revision": 1, "holder": { "ref": "player" }, "receivedAt": 13, "communication": { "ref": "counterEmission", "revision": 1 }, "receivedContent": { "expression": { "ref": "counter2", "revision": 1 } }, "extent": "completeExpression" },
    { "recordType": "proposalVersion", "id": "pv2", "revision": 1, "proposalId": "warehouseNegotiation", "termsRevision": 2, "terms": { "ref": "counter2", "revision": 1 }, "proposer": { "ref": "guard" }, "communicatedBy": { "ref": "counterEmission", "revision": 1 }, "requiredParties": [{ "ref": "player" }, { "ref": "guard" }], "eligibility": { "from": 13, "policy": "pendingUntilFormationOrExplicitClosure" }, "counterOf": { "ref": "pv1", "revision": 1 } },
    { "recordType": "expression", "id": "guardAccept", "revision": 1, "function": "REMARK", "speaker": { "ref": "guard" }, "addressees": [{ "ref": "player" }], "force": "currentSelfPerformance", "time": { "stance": "current" }, "body": { "node": "action", "sense": "accept.proposal", "roles": { "actor": { "ref": "guard" }, "target": { "ref": "pv2", "revision": 1 }, "termsRevision": 2 } } },
    { "recordType": "communication", "id": "guardAcceptEmission", "revision": 1, "expression": { "ref": "guardAccept", "revision": 1 }, "emittedAt": 14, "channel": "conversation" },
    { "recordType": "receipt", "id": "guardAcceptReceipt", "revision": 1, "holder": { "ref": "player" }, "receivedAt": 15, "communication": { "ref": "guardAcceptEmission", "revision": 1 }, "receivedContent": { "expression": { "ref": "guardAccept", "revision": 1 } }, "extent": "completeExpression" },
    { "recordType": "assent", "id": "guardAssent", "revision": 1, "party": { "ref": "guard" }, "target": { "ref": "pv2", "revision": 1 }, "termsRevision": 2, "performedBy": { "ref": "guardAcceptReceipt", "revision": 1 }, "termsBasis": { "ref": "counter2", "revision": 1 }, "validity": "paperFixtureValidSelfAssent" },
    { "recordType": "expression", "id": "playerAccept", "revision": 1, "function": "REMARK", "speaker": { "ref": "player" }, "addressees": [{ "ref": "guard" }], "force": "currentSelfPerformance", "time": { "stance": "current" }, "body": { "node": "action", "sense": "accept.proposal", "roles": { "actor": { "ref": "player" }, "target": { "ref": "pv2", "revision": 1 }, "termsRevision": 2 } } },
    { "recordType": "communication", "id": "playerAcceptEmission", "revision": 1, "expression": { "ref": "playerAccept", "revision": 1 }, "emittedAt": 16, "channel": "conversation" },
    { "recordType": "receipt", "id": "playerAcceptReceipt", "revision": 1, "holder": { "ref": "guard" }, "receivedAt": 17, "communication": { "ref": "playerAcceptEmission", "revision": 1 }, "receivedContent": { "expression": { "ref": "playerAccept", "revision": 1 } }, "extent": "completeExpression" },
    { "recordType": "assent", "id": "playerAssent", "revision": 1, "party": { "ref": "player" }, "target": { "ref": "pv2", "revision": 1 }, "termsRevision": 2, "performedBy": { "ref": "playerAcceptReceipt", "revision": 1 }, "termsBasis": { "ref": "counterReceipt", "revision": 1 }, "validity": "paperFixtureValidSelfAssent" },
    { "recordType": "agreement", "id": "agreement2", "revision": 1, "proposalVersion": { "ref": "pv2", "revision": 1 }, "assents": [{ "ref": "guardAssent", "revision": 1 }, { "ref": "playerAssent", "revision": 1 }], "formedAt": 18, "obligations": [{ "ref": "accessDuty", "revision": 1 }, { "ref": "moneyDuty", "revision": 1 }, { "ref": "tellDuty", "revision": 1 }] },
    { "recordType": "obligation", "id": "accessDuty", "revision": 1, "formationBasis": { "kind": "agreement", "target": { "ref": "agreement2", "revision": 1 } }, "termId": "access", "debtor": { "ref": "guard" }, "beneficiary": { "ref": "player" }, "performance": { "expression": { "ref": "counter2", "revision": 1 }, "termId": "access" }, "activation": { "kind": "onFormation" }, "satisfaction": { "kind": "validPermissionGrant", "scope": "oneWarehouseEntry" } },
    { "recordType": "obligation", "id": "moneyDuty", "revision": 1, "formationBasis": { "kind": "agreement", "target": { "ref": "agreement2", "revision": 1 } }, "termId": "money", "debtor": { "ref": "player" }, "beneficiary": { "ref": "guard" }, "performance": { "expression": { "ref": "counter2", "revision": 1 }, "termId": "money" }, "activation": { "kind": "afterSatisfied", "obligation": { "ref": "accessDuty", "revision": 1 } }, "satisfaction": { "kind": "cumulativeDistinctTransfers", "amount": "30", "unit": "coin", "allocation": "thisDutyOnly" } },
    { "recordType": "obligation", "id": "tellDuty", "revision": 1, "formationBasis": { "kind": "agreement", "target": { "ref": "agreement2", "revision": 1 } }, "termId": "tell", "debtor": { "ref": "player" }, "beneficiary": { "ref": "guard" }, "performance": { "expression": { "ref": "counter2", "revision": 1 }, "termId": "tell" }, "activation": { "kind": "afterSatisfied", "obligation": { "ref": "accessDuty", "revision": 1 } }, "satisfaction": { "kind": "oneReceivedAttributedReport", "topic": { "ref": "keyTopic" }, "truthWarranty": "none" } }
  ]
}
```

V1's `until=13` uses the paper clock's exclusive upper boundary; V2 begins at 13. This known counter rule is a fixture choice, not a secret revision leak or law of offer revocation. An acceptance targeting V1 at tick 16 would remain targeted to V1 and fail this policy; it would not become V2 acceptance. A bare past/third-party REMARK ACCEPT is a claim, and REQUEST ACCEPT is a request; neither can supply either assent record. Full terms include the proposal's required parties, expression's settlement rules and activation interpretations stated here; an implementation would have to present all of them explicitly, rather than infer additional terms from prose. `settlementRules` explicitly allows cumulative partial money credit from distinct effects and assigns each effect to this duty only; the later obligation records instantiate those agreed criteria.

## Partial fulfillment and irreversible disclosure

**AUTHOR/PRIVATE records.** The guard validly grants permission under the exact external scope. The Player transfers 10 coins, then communicates the acquired account. The money duty still has 20 remaining; the account duty can be satisfied even if the guard disbelieves it. This grants no canonical certainty about the account to the recipient. No deadline means no breach conclusion is drawn from the partial state. Capability/honesty did not gate valid assent.

```json
{
  "fixture": "F1",
  "records": [
    { "recordType": "expression", "id": "grantAccess", "revision": 1, "function": "REMARK", "speaker": { "ref": "guard" }, "addressees": [{ "ref": "player" }], "force": "currentSelfPerformance", "time": { "stance": "current" }, "body": { "node": "action", "sense": "allow.access", "roles": { "actor": { "ref": "guard" }, "beneficiary": { "ref": "player" }, "activity": { "ref": "entryActivity" }, "scope": "oneWarehouseEntry" } } },
    { "recordType": "communication", "id": "grantEmission", "revision": 1, "expression": { "ref": "grantAccess", "revision": 1 }, "emittedAt": 19, "channel": "conversation" },
    { "recordType": "receipt", "id": "grantReceipt", "revision": 1, "holder": { "ref": "player" }, "receivedAt": 19, "communication": { "ref": "grantEmission", "revision": 1 }, "receivedContent": { "expression": { "ref": "grantAccess", "revision": 1 } }, "extent": "completeExpression" },
    { "recordType": "occurrence", "id": "accessGranted", "revision": 1, "at": 19, "effect": { "kind": "permissionGranted", "scope": "oneWarehouseEntry", "beneficiary": { "ref": "player" }, "activity": { "ref": "entryActivity" } }, "participants": [{ "ref": "guard" }, { "ref": "player" }], "authorityBasis": { "ref": "entryControl" }, "causedBy": { "ref": "grantReceipt", "revision": 1 } },
    { "recordType": "performanceCredit", "id": "accessCredit", "revision": 1, "obligation": { "ref": "accessDuty", "revision": 1 }, "sourceEffect": { "ref": "accessGranted", "revision": 1 }, "creditedAt": 20, "credit": { "kind": "scopeSatisfied", "scope": "oneWarehouseEntry" }, "assessment": "valid exact scoped permission; not physical entry" },
    { "recordType": "occurrence", "id": "paid10", "revision": 1, "at": 21, "effect": { "kind": "resourceTransferred", "actor": { "ref": "player" }, "recipient": { "ref": "guard" }, "theme": { "ref": "coins" }, "amount": "10", "unit": "coin", "transferMode": "custody" }, "participants": [{ "ref": "player" }, { "ref": "guard" }] },
    { "recordType": "performanceCredit", "id": "moneyCredit", "revision": 1, "obligation": { "ref": "moneyDuty", "revision": 1 }, "sourceEffect": { "ref": "paid10", "revision": 1 }, "creditedAt": 22, "credit": { "amount": "10", "unit": "coin" }, "assessment": "count once; allocated solely to moneyDuty" },
    { "recordType": "expression", "id": "tellReport", "revision": 1, "function": "REMARK", "speaker": { "ref": "player" }, "addressees": [{ "ref": "guard" }], "force": "currentSelfPerformance", "time": { "stance": "current" }, "body": { "node": "action", "sense": "tell.content", "roles": { "actor": { "ref": "player" }, "recipient": { "ref": "guard" }, "contentTopic": { "ref": "keyTopic" }, "reportMode": "oneAttributedReport", "truthWarranty": "none" }, "selectedContent": { "claim": { "ref": "secretAccount", "revision": 1 }, "attribution": { "ref": "ray" } } } },
    { "recordType": "communication", "id": "tellEmission", "revision": 1, "expression": { "ref": "tellReport", "revision": 1 }, "emittedAt": 23, "channel": "conversation", "actualSource": { "ref": "secretReceipt", "revision": 1 } },
    { "recordType": "receipt", "id": "tellReceipt", "revision": 1, "holder": { "ref": "guard" }, "receivedAt": 24, "communication": { "ref": "tellEmission", "revision": 1 }, "receivedContent": { "claim": { "ref": "secretAccount", "revision": 1 }, "attribution": { "ref": "ray" } }, "extent": "completeExpression" },
    { "recordType": "performanceCredit", "id": "tellCredit", "revision": 1, "obligation": { "ref": "tellDuty", "revision": 1 }, "sourceEffect": { "ref": "tellReceipt", "revision": 1 }, "creditedAt": 25, "credit": { "kind": "reportReceived" }, "assessment": "matches topic and attributed-report criterion; truth and belief unadjudicated" },
    { "recordType": "obligationAssessment", "id": "moneyAt25", "revision": 1, "obligation": { "ref": "moneyDuty", "revision": 1 }, "at": 25, "activation": { "kind": "active", "basis": { "ref": "accessCredit", "revision": 1 } }, "credited": { "amount": "10", "unit": "coin", "basis": [{ "ref": "moneyCredit", "revision": 1 }] }, "remaining": { "amount": "20", "unit": "coin" }, "due": "notSpecified", "dispute": "noneRecordedInThisAssessment" }
  ]
}
```

`sourceEffect` can be an occurrence or actual-delivery receipt, according to the duty's satisfaction criterion; its kind is not interchangeable without that criterion. At coarse paper tick 19 the causal sequence is emission → receipt → validated permission occurrence, as the references and `causedBy` show; equal tick labels do not imply simultaneous reversal. A repetition/reload of `paid10` cannot create a second distinct credit, and a sentence “I paid 30” supplies no transfer evidence. A further cancellation, release or dispute needs its own scoped authority/evidence record and cannot erase the emitted account, recipient's acquisition, transferred coins or original assents. There is no atomic transaction spanning money and memory. A partial overhearing would create a fragment receipt with a safe inline fragment, not the full `tellReport` or all related accounts.

## Candidate signatures, norms and a unilateral promise

**AUTHOR/PRIVATE definitions and records.** Signatures below are original Encounter candidates crosswalked to dictionary 01 Give and the TRUSTS predicate recommendation. They do not create final registry IDs, add Functions or imply that every word has a world executor. `roleType` refers to local semantic constraints, not accepted package schema types; `transferable` excludes an event wrapper merely because it has an ID. Function support describes meaning, while `performance` distinguishes communication from physical execution.

The two later entry norms deliberately overlap. Each is attached to the stated issuer/authority relationship and time-window constraint. They do not silently resolve each other, disable the actor's physical capability, cancel the earlier access agreement or create a universal legal system. The external `entryCapabilityAt32` separately stipulates physical entry is possible at tick 32. The rules are authored normative records for this paper; they are not automatically disclosed to an actor merely because they exist. Conflict adjudication, revocation and remedies remain open.

The Player then explicitly performs a unilateral Promise to Return the key after the known entry activity completes. **For this fixture only**, valid self undertaking plus actual complete delivery to the named beneficiary is sufficient formation; the beneficiary need not separately accept. This is a paper policy proposed for review, not a frozen global promise rule. The guard receives the promise, but acquires no duty from it. The Player does not receive custody by promising, and current inability or dishonest intent would not by itself invalidate the undertaking. An obligation can originate from this valid promise without fabricating an agreement.

```json
{
  "fixture": "F1",
  "records": [
    {
      "recordType": "definition", "id": "giveDefinition", "revision": 1,
      "definitionKind": "action", "token": "give.resource", "sourceEntry": "ACTION_PREDICATE_MAPPING.md / 01 Give / tangible-resource transfer",
      "roles": [
        { "name": "actor", "roleType": "actor", "presence": "required" },
        { "name": "recipient", "roleType": "actor", "presence": "required" },
        { "name": "theme", "roleType": "transferable", "presence": "required" },
        { "name": "quantity", "roleType": "positiveAmountAndUnit", "presence": "requiredForFungibleTheme" },
        { "name": "transferMode", "roleType": "custodyOrOwnership", "presence": "required" }
      ],
      "functions": { "REQUEST": "ask specified actor to transfer", "OFFER": "propose transfer under exact terms", "REMARK": "assert transfer with actor and temporal stance" },
      "performance": { "communicationEffect": "noTransferFromSaying", "worldEffect": "separatelyValidatedTransfer", "discussionCapabilityCheck": "actorKnownMeaningOnly" }
    },
    {
      "recordType": "definition", "id": "trustDefinition", "revision": 1,
      "definitionKind": "predicate", "token": "TRUSTS", "sourceEntry": "ACTION_PREDICATE_MAPPING.md / Predicate recommendations / TRUSTS",
      "roles": [{ "name": "subject", "roleType": "actor", "presence": "required" }, { "name": "object", "roleType": "actor", "presence": "required" }],
      "functions": { "REMARK": "speaker-attributed trust proposition" },
      "performance": { "communicationEffect": "assertionOnly", "privateStateRead": "notGranted", "canonicalTruth": "notEstablished", "scale": "notSelected" }
    },
    {
      "recordType": "normativeRule", "id": "entryPermissionRule", "revision": 1,
      "modality": "permission", "issuer": { "ref": "guard" },
      "authority": { "relation": "controlsEntryForThisScope", "holder": { "ref": "guard" }, "target": { "ref": "warehouse" }, "evidence": { "ref": "entryRuleAuthority" } },
      "subject": { "ref": "player" }, "activity": { "ref": "entryActivity" }, "scope": "oneWarehouseEntry",
      "condition": { "kind": "timeWindow", "clock": "paper-ticks", "startsAt": 30, "endsBefore": 40 }, "basis": { "ref": "entryRuleAuthority" }
    },
    {
      "recordType": "normativeRule", "id": "entryProhibitionRule", "revision": 1,
      "modality": "prohibition", "issuer": { "ref": "guard" },
      "authority": { "relation": "controlsEntryForThisScope", "holder": { "ref": "guard" }, "target": { "ref": "warehouse" }, "evidence": { "ref": "entryRuleAuthority" } },
      "subject": { "ref": "player" }, "activity": { "ref": "entryActivity" }, "scope": "oneWarehouseEntry",
      "condition": { "kind": "timeWindow", "clock": "paper-ticks", "startsAt": 32, "endsBefore": 34 }, "basis": { "ref": "entryRuleAuthority" }
    },
    {
      "recordType": "expression", "id": "promiseSpeech", "revision": 1,
      "function": "REMARK", "speaker": { "ref": "player" }, "addressees": [{ "ref": "guard" }], "force": "currentSelfPerformance", "time": { "stance": "current" },
      "body": { "node": "action", "sense": "promise.undertake", "roles": {
        "actor": { "ref": "player" }, "beneficiary": { "ref": "guard" },
        "content": { "node": "AFTER", "anchor": { "activity": { "ref": "entryActivity" }, "criterion": "completed" }, "boundary": "strictlyAfterCompletion", "main": { "node": "action", "termId": "returnKey", "sense": "return.resource", "roles": { "actor": { "ref": "player" }, "theme": { "ref": "key" }, "destination": { "ref": "guard" } } } }
      } }
    },
    { "recordType": "communication", "id": "promiseEmission", "revision": 1, "expression": { "ref": "promiseSpeech", "revision": 1 }, "emittedAt": 26, "channel": "conversation" },
    { "recordType": "receipt", "id": "promiseReceipt", "revision": 1, "holder": { "ref": "guard" }, "receivedAt": 27, "communication": { "ref": "promiseEmission", "revision": 1 }, "receivedContent": { "expression": { "ref": "promiseSpeech", "revision": 1 } }, "extent": "completeExpression" },
    { "recordType": "promise", "id": "returnPromise", "revision": 1, "promisor": { "ref": "player" }, "beneficiary": { "ref": "guard" }, "content": { "expression": { "ref": "promiseSpeech", "revision": 1 }, "termId": "returnKey" }, "createdBy": { "ref": "promiseReceipt", "revision": 1 }, "validityPolicy": "paperSelfStandingPlusBeneficiaryCompleteReceipt", "obligations": [{ "ref": "returnDuty", "revision": 1 }] },
    { "recordType": "obligation", "id": "returnDuty", "revision": 1, "formationBasis": { "kind": "promise", "target": { "ref": "returnPromise", "revision": 1 } }, "termId": "returnKey", "debtor": { "ref": "player" }, "beneficiary": { "ref": "guard" }, "performance": { "expression": { "ref": "promiseSpeech", "revision": 1 }, "termId": "returnKey" }, "activation": { "kind": "afterActivityCompleted", "activity": { "ref": "entryActivity" } }, "satisfaction": { "kind": "exactResourceReturn", "theme": { "ref": "key" }, "destination": { "ref": "guard" } } },
    { "recordType": "wrapper", "id": "promiseWrapper", "revision": 1, "referentKind": "promise", "subject": { "ref": "returnPromise", "revision": 1 }, "origin": { "ref": "promiseEmission", "revision": 1 } }
  ]
}
```

`formationBasis.kind` is exactly one of `agreement` or `promise` in these instances, and its target must have that kind. Adding a different source of obligation needs an explicit later semantic decision. A term selector resolves the chosen clause **with its applicable ancestor grouping, conditions and temporal attachments**, rather than dropping those attachments by copying only the leaf. Thus the `AFTER` plan anchor determines this duty's activation; it does not retroactively postpone formation of the promise. `validityPolicy` names the declared fixture policy and is not self-authenticating evidence of authority. Unsupported or ambiguous promise conditions should defer a consequential interpretation while preserving the delivered communication.

## Anonymous promotion and later acquisition

**AUTHOR/PRIVATE records.** An authored stock-loss encounter affects an unnamed shopkeeper and creates consequential continuity before the Player learns a persistent person reference. This promotes neither a global name nor Player knowledge. The later meeting earns the role label; a separate introduction earns the name. These are paper trigger/retention choices, not universal numeric tiers. The exact nature of stock loss is canonical background evidence; it does not add Steal or another candidate word to Player vocabulary.

```json
{
  "fixture": "F1",
  "records": [
    { "recordType": "wrapper", "id": "shopWrapper", "revision": 1, "referentKind": "person", "subject": { "ref": "shopkeeper" }, "origin": { "ref": "openingStockLoss" } },
    { "recordType": "promotion", "id": "shopPromotion", "revision": 1, "target": { "ref": "shopWrapper" }, "at": 40, "basis": { "ref": "stockLossTrace" }, "significance": "consequentialEncounter", "historicalRetention": "retainCausalIdentity", "activePriority": "scenarioBounded" },
    { "recordType": "acquisition", "id": "shopAcquired", "revision": 1, "holder": { "ref": "player" }, "target": { "ref": "shopWrapper" }, "at": 50, "basis": { "ref": "shopMeetingReceipt" }, "availability": "available" },
    { "recordType": "label", "id": "shopRoleLabel", "revision": 1, "holder": { "ref": "player" }, "target": { "ref": "shopWrapper" }, "text": "the shopkeeper", "basis": { "ref": "shopMeetingReceipt" }, "acquiredAt": 50 },
    { "recordType": "label", "id": "shopNameLabel", "revision": 1, "holder": { "ref": "player" }, "target": { "ref": "shopWrapper" }, "text": "Eddie", "basis": { "ref": "nameReceipt" }, "acquiredAt": 60, "attribution": "selfIntroduction" },
    { "recordType": "wrapper", "id": "dealWrapper", "revision": 1, "referentKind": "agreement", "subject": { "ref": "agreement2", "revision": 1 }, "origin": { "ref": "counterEmission", "revision": 1 }, "links": [{ "relation": "disputedBy", "target": { "ref": "disputeWrapper" } }] },
    { "recordType": "wrapper", "id": "disputeWrapper", "revision": 1, "referentKind": "dispute", "subject": { "ref": "disputeClaim" }, "origin": { "ref": "disputeClaim" }, "links": [{ "relation": "aboutAgreement", "target": { "ref": "dealWrapper" } }] }
  ]
}
```

A wrapper can be de-emphasized without losing causal retention or acquired book availability. The Reply's permanent learned-book access is a recommendation awaiting owner policy; these examples do not adopt housekeeping forgetting. Even permanent canonical retention or a later actor-local identity association reveals no private motives, relatives or previously unreceived history. Historical tick-50 views keep the role label; they do not backfill Eddie at tick 50. If the Player already separately knew an “Eddie” handle, joining it to this role would require a new holder-specific `identityAssociation` with acquired evidence; matching internal IDs cannot perform the reveal.

## Actor-safe projections and bounded traversal

The next blocks are **ACTOR-SAFE OUTPUT EXAMPLES**, each a newly constructed bounded view. They deliberately contain no F1 canonical refs, record revisions, worldSnapshot, hidden source, private intent, truth flag, secret relation counts or hash. `scope` binds opaque local handles to an actor information context; a handle can be stable within that declared context without joining aliases across contexts/audiences. Opaque tokens below are hand-chosen paper values, not a proposed encoding or security claim. The privileged projection request retains the actual audience, world snapshot, cutoff and purpose; those cannot be recovered from a token.

The Player legitimately heard Ray's two accounts. The output preserves source assertion versus certainty. The learned place/key/person handles used in the clauses are explicitly listed in the same view. Their types reflect actor-known categories, not hidden objective classifications. No hidden canonical source event or guard identity appears.

```json
{
  "viewType": "receivedAccounts",
  "audience": "self",
  "scope": "p-a",
  "informationToken": "u7",
  "entries": [
    { "kind": "person", "handle": "h2", "label": "Ray" },
    { "kind": "person", "handle": "h3", "label": "Marcus" },
    { "kind": "object", "handle": "h4", "label": "spare key" },
    { "kind": "place", "handle": "h5", "label": "warehouse" },
    { "kind": "account", "handle": "h6", "label": "Ray's account of hiding the key", "source": { "kind": "person", "handle": "h2" }, "content": { "sense": "hide.object", "actor": "h2", "theme": "h4", "location": "h5", "time": "before this conversation" }, "status": "Ray's self-report" },
    { "kind": "account", "handle": "h7", "label": "Ray's account of taking the key", "source": { "kind": "person", "handle": "h2" }, "content": { "sense": "take.resource", "actor": "h3", "theme": "h4", "source": "h5", "time": "before this conversation" }, "sourceAssertion": "Ray says he saw it", "assessment": "unassessed" }
  ]
}
```

The safe view deliberately reports only the time precision this paper receipt makes available for the Player, without disclosing the privileged tick clock. Time wording is an authored example; any more precise time must have a received basis. Actor-safe sense tokens retain the earlier local illustrative crosswalk and reveal only known semantic categories.

**Historical actor-safe view after the meeting but before the name introduction:**

```json
{
  "viewType": "keywordBook",
  "audience": "self",
  "scope": "p-b",
  "informationToken": "k8",
  "entries": [
    { "kind": "person", "handle": "r4", "label": "the shopkeeper", "source": "you met this shopkeeper" }
  ]
}
```

**Current actor-safe view after the name introduction:**

```json
{
  "viewType": "keywordBook",
  "audience": "self",
  "scope": "p-b",
  "informationToken": "m2",
  "entries": [
    { "kind": "person", "handle": "r4", "label": "Eddie", "knownRole": "the shopkeeper", "source": "introduced himself to you" }
  ]
}
```

The same handle is allowed here because the introduction legitimately identifies this already met person. Before tick 50, this bounded person view would have no entry for this person, regardless of the hidden promotion. If two recognized aliases are still unconnected in the Player's knowledge, they require distinct nonjoining public handles even if a privileged map resolves both to one canonical person. No shared canonical ID, digest, ordering adjacency or automatic “same person” response can reveal their equivalence.

The final actor-safe block illustrates a **separate declared outward-knowledge context**: the Player has received both the agreement label and the existence/topic of a later dispute, through explicit scenario-authored conversation. It does not assert the Player learned `disputeClaim` in the preceding fixture history. Those acquisitions are an external paper assumption specific to this bounded demonstration. The Player knows only that this dispute concerns that agreement; the guard's allegation content and any other links remain unavailable.

Request policy for this demonstration permits only actor-known `aboutAgreement`/`disputedBy` edges, depth two and work eight over the authorized subgraph. Visited handles stop the visible cycle by linking back. Secret-only edges neither consume a public budget nor change output size/order. A budget end can yield a bounded view without advertising hidden existence, hidden counts or canonical path length.

```json
{
  "viewType": "boundedReferenceView",
  "audience": "self",
  "scope": "p-c",
  "informationToken": "q3",
  "root": { "kind": "agreement", "handle": "d8" },
  "entries": [
    { "kind": "agreement", "handle": "d8", "label": "warehouse arrangement", "knownLinks": [{ "relation": "disputedBy", "target": { "kind": "dispute", "handle": "v2" } }] },
    { "kind": "dispute", "handle": "v2", "label": "dispute about the warehouse arrangement", "knownLinks": [{ "relation": "aboutAgreement", "target": { "kind": "agreement", "handle": "d8" } }] }
  ],
  "viewExtent": "bounded"
}
```

`viewExtent=bounded` describes every response under this fixed public budget, including an otherwise identical history with additional secret edges. It is not a secret-dependent “more hidden records exist” flag. This is a documentary noninterference requirement, not a measured timing or runtime access-control proof. Unknown/denied/nonexistent guessed handles must remain indistinguishable wherever the actor has no basis to distinguish them.

## Remaining semantic constraints and review limits

All local refs must resolve to the declared kind/revision in F1; all term selectors resolve within their exact expression. Amount strings are exact nonnegative decimal text in this paper, with positive transfer quantities and explicit units; future precision/currency conversion/overpayment rules remain open. No coercion from a wrapper's label to resource, person or evidence is allowed. The paper chooses cumulative distinct transfer credit and no cross-duty reuse; broader allocation rules are OQ-13. Status words in assessments are candidate descriptive values, not a final exhaustive enum.

The main families intentionally separate authority, agreement, performance, epistemic stance, retention and current availability. A single `status=accepted` cannot stand for all of them. Draft expression storage alone creates neither communication nor Player keywords. A valid promise/assent may be impossible or dishonest; a permission attempt may fail for lack of authority. A public failure must not expose that private cause unless an authorized outward interaction discloses it.

Source rationale follows KW-CONTEXT §§4, 7–12, 13–21, KW-REPLY's validity/predicate refinements, the [transaction donor analysis](../../../research/keywrapping-substrate/v0.1/TRANSACTION_DONOR_MINING.md), [provenance KP-01–KP-14](../../../research/keywrapping-substrate/v0.1/PROVENANCE_DONOR_MINING.md) and [social reasoning separation](../../../research/keywrapping-substrate/v0.1/SOCIAL_REASONING_DONORS.md). Field spellings, grouping layout, identity envelope, snapshot notation and fixture policies are original Encounter proposals. External donors are conceptual sources, with [artifact-specific licenses](../../../research/keywrapping-substrate/v0.1/SOURCE_LICENSE_LEDGER.md); no donor ontology, example payload or source code is copied here.

Strict JSON syntax and local reference closure are useful document checks, not implemented schema validity, secrecy enforcement, world execution, truthful dialogue, owner design acceptance or gameplay enjoyment. Independent sealing and combinatorial audits must inspect those distinctions and the fixture's explicit assumptions. No actual schema files or runtime validator are included.
