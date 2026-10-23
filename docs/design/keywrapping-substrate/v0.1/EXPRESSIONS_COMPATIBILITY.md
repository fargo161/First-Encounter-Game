# Expressions and semantic compatibility

**Version:** v0.1 · **Date:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT
**Role:** Schema & Combinatorics Engineer

This is an Encounter proposal for grouped meaning, not an installed grammar, composer, executor or schema. Its baseline is KW-CONTEXT §§13–20; KW-REPLY refines talk-act validity and predicate remarks. Source identities and precedence are in [SOURCE_SNAPSHOT.md](../../../research/keywrapping-substrate/v0.1/SOURCE_SNAPSHOT.md). The [66-word dictionary](../../../research/keywrapping-substrate/v0.1/ACTION_PREDICATE_MAPPING.md) supplies candidate senses and per-sense gates; its `D` keys identify donor evidence, not an accepted action registry. C2.1 B0 is a comparison input only. All structural names below are proposed notation.

## Four different questions

| Question | Required basis | Consequence of an unresolved or failed check |
| --- | --- | --- |
| Is the expression semantically typed? | Selected sense, participant kinds, amounts/units, connector attachment and time/target structure | Ask for missing meaning or reject that parse. An event cannot fill Give's transferable-resource slot merely because both have wrappers. |
| Can this actor discuss it? | Acquired references, actor-accessible context and scenario language | Clarify an ambiguous known target; do not reveal unacquired targets. Unsupported execution does not make a discussable request nonsense. |
| Does this delivered communication perform a social act? | Explicit current self performance, exact target/version, actual delivery, eligible party/standing and per-sense conditions | Record only the attempted communication/claim if the gates fail. Do not invent authority, assent or permission. |
| Did the world act succeed? | Separately authorized capability/state/effect resolution and evidence | Record attempt/failure or actual effect as supported. Request, offer, asserted success and valid commitment are not world completion. |

These are distinctions, not a universal four-stage runtime algorithm. In particular, semantic filtering must not consult a secret inventory, owner, capability, authority, cancellation or belief and then remove an option. A person can discuss an unknown impossibility, promise dishonestly, attempt an unauthorized taking, or lie with legitimately acquired references. A social prohibition can coexist with physical capability. Any intentional disclosure of inability or refusal belongs to its own outward interaction; private diagnostics do not become menu hints.

## Proposed meaning nodes

An expression has one of the three Functions `REQUEST`, `OFFER`, `REMARK`, an identified speaker, intended addressees, body, temporal stance and force. It can additionally carry outward performance cues and contextual resolution evidence. BASED changes performed meaning/cues without adding unchosen binding clauses. Private intent and private vibe selectors are not listener fields.

| Node | Proposed required meaning | Restrictions and unresolved choices |
| --- | --- | --- |
| `action` | Candidate sense plus named typed role bindings | The action actor can differ from the speaker. Required roles come from that sense; a noun-only answer is resolved through a unique accessible question slot. |
| `predicate` | Candidate predicate, subject/arguments and qualification | A proposition is not automatically canonical truth. TRUSTS/FEARS/NEEDS/BELIEVES remain candidate families; actor attribution and uncertainty matter. |
| `AND` | Two or more ordered child nodes and one explicit grouping scope | Both conjuncts are part of the meaning. Array order is presentation order unless an explicit temporal relation requires execution order. |
| `OR` | Two or more alternatives, chooser/selection rule and inclusive/exclusive interpretation | Unspecified chooser, cardinality or timing remains an unresolved term. Do not silently select the easiest alternative or assume exclusive OR. |
| `IF` | Condition, consequence subtree, attachment target and phase | `formation` gates whether an agreement forms; `obligationActivation` gates a particular duty after formation. A condition can be a canonical criterion or a named party's assessment only if that criterion is explicit. |
| `exchange` | Offered subtree, requested subtree and reciprocity/condition/timing terms | One grouped exchange, preserving who undertakes each side. A requested act inside its terms is not a separate unconditional spoken request. No implied atomic rollback. |
| `BEFORE` / `AFTER` | Main subtree, temporal anchor and strictness/boundary interpretation | Anchor may be an exact event, deadline or completion of another term. A circular dependency needs correction or explicit contingent intent; list order cannot resolve it. |
| `UNTIL` | Sustained/continuing subtree, terminating condition and boundary rule | Clarify whether the endpoint is included and what happens if the condition never occurs. No automatic expiry or forgetting rule. |
| `NOT` | One explicit target subtree and negation mode | Propositional denial, refusal, prohibition and a negative future undertaking are different. NOT GIVE does not undo an earlier transfer; NOT ACCEPT is not necessarily a refusal. |
| `ABOUT` | Main clause and topic reference | Topic does not become the action's object, proof or causal explanation. ACCUSE a person ABOUT an incident does not give the incident to them. |
| `BECAUSE` | Main proposition/action and stated reason/evidence | Marks an attributed explanation unless an authorized canonical assessment separately establishes causation. A reason claim cannot create its own proof. |

No implicit textual precedence is proposed. The stored meaning carries explicit parent/child attachment. A composer or dialogue renderer may print readable chunks, but must preserve those attachments. Two parses can share the same printed words and have different meanings; show the ambiguity before assent. Clauses quoted inside a claim remain quoted, rather than becoming newly performed acts.

The lexical label `IF` can express a condition in ordinary speech, but reciprocal bargaining requires an explicit exchange interpretation. In “money AND tell IF access,” both offered clauses are grouped. Whether access is an undertaking at formation, a completed grant activating the other duties, or an agreed later reciprocal performance is a term to resolve. The warehouse fixture in [JSON_RECORD_FAMILY.md](JSON_RECORD_FAMILY.md) deliberately chooses **completed access grant activates both offered duties**; that paper choice is not a universal interpretation imposed on the baseline.

## Function, force, time and target

`force` distinguishes `request`, `proposal`, `assertion` and `currentSelfPerformance`; these are candidate force labels within the three Functions, never extra Functions. Time distinguishes current performance from past report, future intention, hypothetical and quotation. A performative's effective occurrence is separately evidenced.

| Mechanical meaning | What it can establish |
| --- | --- |
| REQUEST + Accept V2 | A request that its addressee accept V2. The request is not assent by either party. |
| OFFER + Accept V2 later | A proposed future acceptance, preserving its conditions. |
| REMARK + “Ray accepted V2 yesterday” | A claim about past acceptance; neither Ray's assent nor proof of it. |
| REMARK + quoted “I accept V2” | A quotation. The quotation's first person is not the current speaker's self performance. |
| REMARK + “I hereby ACCEPT V2,” exact received terms and standing | An acceptance attempt eligible for validation; agreement only after every required party's eligible assent. |
| REMARK + “I PROMISE return the key,” knowingly impossible | Potentially a valid self commitment; capability, honesty, fulfillment and responsibility remain separate. |
| REMARK + “I ALLOW warehouse access,” no relevant control | Communication can occur; no actual permission grant is established by this invalid exercise of authority. |
| REMARK + “Ray TRUSTS Marcus” | Speaker-attributed predicate claim. It grants no access to Ray's private stance or actual psychology. |

For dialogue fidelity, “accept,” “counter,” “refuse” and “ask” can classify an NPC's **decision**; the outward expression still uses REQUEST/OFFER/REMARK. A renderer receives approved terms and outward cues, not private calculations. New amounts, conditions, identities or promises in wording require corresponding structured content and authority; a style template alone does not guarantee this.

## Contextual omission and clarification

Short speech is integral to KW-CONTEXT §14. A contextual answer records the active actor-accessible thread, eligible candidates at that knowledge point and the resulting resolved meaning. The speaker need not select every redundant field. A unique resolution can fill a known slot, but cannot import a hidden target from canonical history.

Examples:

- “Yes” following one fully received eligible proposal version can resolve to a specific current self acceptance if the conversation convention makes that force explicit. Merely saying yes is not universal assent.
- Two known pending versions, two bargains sharing a label, a partial receipt missing a condition, or an ambiguous “that one” require clarification before binding effects.
- “Warehouse” can answer a uniquely accessible destination question; it cannot silently specify a new request to open the warehouse.
- “Why?” targets an accessible prior clause or decision. It does not authorize disclosure of the NPC's actual private reason.
- A later alias reveal cannot make yesterday's contextual answer target a person or term the speaker did not then recognize.

An actor may be told that received material is incomplete when the incompleteness is itself perceptible. Do not expose the count or names of omitted secret terms. Unacquired, inaccessible and nonexistent guessed handles use equivalent actor-facing behavior where the actor cannot legitimately distinguish them. A known handle that cannot currently expand can retain its known label without a diagnostic revealing a concealed relation or storage cause.

## Compatibility and adversarial paper cases

These are semantic expectations for independent review, not executed runtime tests.

| Case | Required meaning or response |
| --- | --- |
| OFFER GIVE incident wrapper | Ill typed for tangible transfer; offer to Tell selected content about it is a different explicit sense. |
| OFFER TELL an NPC's whole private wrapper | A recognizable wrapper is not selected, available content. Choose actor-accessible content; no automatic recursive disclosure. |
| REQUEST OPEN a door secretly locked | May be well typed and discussable; no secret-dependent menu change. World execution is evaluated separately. |
| OFFER GIVE 50 AND TELL account IF ALLOW access | One exchange with explicit scope over both offered clauses, party roles and condition phase. Assent does not itself pay, tell or open. |
| Counter 50→30 followed by stale “accept” | Resolve exact version and chosen eligibility policy; never apply assent to the newest version by label. |
| Give 10 of agreed 30; claim “fulfilled” | Credit 10 once to the specified duty if supported. Claim cannot supply the remaining 20. |
| Tell promised account which is false | Delivered representation can satisfy an exact retelling duty without proving truth; a truth warranty would need its own agreed criterion. |
| Both exchange sides must happen strictly first | Detect cyclic dependency/deadlock; no flattening or invented simultaneous transaction. If a secret was already told, cancellation does not unlearn it. |
| OR give key / pay coins | Require chooser, cardinality and selection timing before binding that duty. Do not freeze these policies globally. |
| IF Ray believes X | If explicitly a party-assessment condition, evaluate under its agreed perspective/rule. Do not substitute canonical truth of X or disclose Ray's belief to the other party. |
| NOT BREAK promise | A negative undertaking differs from reporting “the promise was not broken,” and from prohibiting breakage. |
| BECAUSE Ray says payment occurred | A source-attributed reason; not payment evidence. |
| Dispute ABOUT agreement ABOUT dispute | Typed permitted edges and bounded traversal; no infinite expansion or hidden-neighbor counts. |

## Traversal and combinatorial bounds

Use linked typed nodes rather than copying every nested wrapper. A proposed expansion request names audience, purpose, world snapshot and knowledge cutoff in privileged context. Authorize existence/field/edge before expansion, visit only allowed relation kinds, track visited qualified identities in that privileged operation, and apply depth and work budgets. Bound expression size as well as wrapper expansion; malformed cycles in an expression tree differ from meaningful cycles among referenced wrappers.

The bounds are implementation policy choices requiring measurement later (OQ-15), not numeric limits frozen by this document. A paper demonstration can use a depth of two and work of eight. Its public response must depend on the authorized subgraph and public request budget; secret-only edges must not consume a visible budget or alter counts, ordering or “more” signals. Hidden-index timing side channels need separate implementation evaluation; no proof is claimed here.

When a visible cycle revisits an already shown known handle, a shallow link can stand in for recursion. If an authorized budget ends, a generic bounded view can omit expansion without reporting hidden size. Do not expose `hiddenCount`, raw visited identities, global graph depth, secret reference kinds or a canonical revision clock. More pages, search matches and failures need the same authorization discipline as the main view.

## Source and design traceability

Grouped composition, acquired vocabulary, the three Functions, the starting 66 words, BASED, no Player scratchpad and saying/agreeing/doing separation come from KW-CONTEXT §§7, 13–20. Explicit current performative validity and predicate candidates are recommendations in KW-REPLY. The typed node vocabulary, force field, four-check distinction, explicit condition phases, safe context resolution and proposed traversal requirements are original Encounter synthesis drawing on the [action mapping](../../../research/keywrapping-substrate/v0.1/ACTION_PREDICATE_MAPPING.md), [transaction mining](../../../research/keywrapping-substrate/v0.1/TRANSACTION_DONOR_MINING.md) and [provenance mining KP-01–KP-14](../../../research/keywrapping-substrate/v0.1/PROVENANCE_DONOR_MINING.md). No external ontology or license-sensitive specification text is copied. See the [license ledger](../../../research/keywrapping-substrate/v0.1/SOURCE_LICENSE_LEDGER.md).

Remaining owner choices include OR selection, exact inference/predicate families, time boundaries, contextual assent conventions, multi-party authority, performative delivery/comprehension rules, obligation satisfaction and retention. These are tracked in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md), rather than supplied by hidden defaults.
