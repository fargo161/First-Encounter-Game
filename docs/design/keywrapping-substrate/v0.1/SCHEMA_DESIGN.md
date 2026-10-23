# Candidate structural validation design

**Version:** v0.1 · **Date checked:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT
**Role:** Schema & Combinatorics Engineer

Owner decision OD-KW-02 defers actual `.schema.json` files. This document supplies design prose and review criteria only: no metaschema, validator, loader, generated bindings, fixture files, implementation scaffolding or dependency is created. [JSON_RECORD_FAMILY.md](JSON_RECORD_FAMILY.md) contains original strict JSON instance examples in Markdown, with a shared declared paper context; it does not define an accepted serialized contract. Accepted contracts, C1, C2.1 B0 and frozen packages remain unchanged.

## Dialect candidate and inspected primary sources

The official [JSON Schema specification index](https://json-schema.org/specification), checked 2026-10-22, identifies **2020-12** as the current published family. The linked [Core document](https://json-schema.org/draft/2020-12/json-schema-core) is the 2022-06-16 Internet-Draft for that family; the linked [Validation document](https://json-schema.org/draft/2020-12/json-schema-validation) supplies its structural validation vocabulary. A repository work-in-progress commit is not a later published dialect. These are external research inputs, not governing Encounter authority.

If a later owner scope authorizes schema creation, 2020-12 is a reasonable candidate to evaluate for tagged alternatives, shared definitions and composed object closure. Exact validator behavior and supported vocabularies would need to be selected and verified then. This proposal adopts no runtime validator or schema conformance claim. The released Internet-Draft's IETF notice and source repository licensing are different scopes; see [SOURCE_LICENSE_LEDGER.md](../../../research/keywrapping-substrate/v0.1/SOURCE_LICENSE_LEDGER.md). This document is independent original analysis, with no copied specification examples, metaschemas or Code Components.

## Minimal logical boundaries

The proposed family should be understood in three narrow groups, not one universal object with hundreds of optional fields:

| Boundary | Candidate contents | Required separation |
| --- | --- | --- |
| Qualified identity and meaning | Typed refs, exact artifact/version context, candidate action/predicate senses and grouped expressions | An address/type is not authority, knowledge or capability. A donor evidence key is not an action ID. |
| Historical and normative records | Occurrences; communication/receipts/evidence; claims/stances; immutable proposal versions, assent, agreement, individual duties and credits | Canonical occurrence, attributed assertion, belief, permission and actual performance cannot share one truth/status field. |
| Wrapping and actor views | Wrapper identity; promotion/retention; acquisition, labels and identity associations; privileged projection context and actor-safe output | Canonical refs and private fields belong outside actor outputs. A shared subject does not authorize its entire graph. |

A later authorized implementation can organize these into files or modules based on a concrete consumer; these groups are not required services, schemas or tables. Owner sign-off approved the documentation package, not a repository-wide data ontology. No accepted package's strict/unknown-field or schema conventions are automatically inherited.

## Proposed shape checks

The following are candidates for future schema coverage. They do not claim a generic JSON Schema validator resolves arbitrary game references, causal history or access rights.

| Shape responsibility | Candidate expression in a later authorized schema design | Limit |
| --- | --- | --- |
| Tagged record alternatives | Require a discriminating `recordType`; exact family-specific required fields, with mutually exclusive variants | Structurally valid `assent` can still be forged, stale or unauthorized. |
| Full privileged refs | Require producer, exact artifact and artifact revision, kind, local ID; exact target revision where the record type requires it | The target must actually exist, match that kind/snapshot and be permitted for the use. Paper `{ref:x}` is a declared fixture abbreviation only. |
| Actor view handles | A distinct closed output shape with scope, actor-known kind and opaque handle; exclude canonical refs/IDs, private state and raw revision/hash data by construction | A valid string can still encode a secret or correlate hidden aliases. Handle generation and information flow need semantic review. |
| Expression tags and arity | Disjoint action/predicate/connector alternatives; AND/OR at least two children; NOT exactly one; IF explicit phase/attachment; temporal nodes explicit anchors | Valid arity does not prove sensible meaning, known participants, useful choice semantics or acyclic term dependencies. |
| Function/force/time distinction | Functions restricted to REQUEST/OFFER/REMARK, separate current self performance versus report/proposal/request | String tags do not establish actual delivery, speaker identity, standing or intent. |
| Typed quantities | Exact amount text and explicit unit in the selected domain; positive performed transfers; no missing currency unit | Precision, conversion, available balance, allocation and replay safety are domain/semantic matters. |
| Temporal structure | Distinguish occurrence, emission, reception, inference, acquisition, activation and deadline fields; preserve clock/scope and relative anchors | Shape does not prove the order was possible or that a deadline's interpretation is agreed. Research dates are not game time. |
| Proposal and assent target | Required proposal identity/version, terms revision, required party refs and explicit assent target | Exact term equality, eligible state, acquired terms, comprehension, authority and quorum cannot be inferred from a matching integer. |
| Source/interpretation structure | Separate actual provenance, source assertion and holder-known evidence; no mandatory actual occurrence for claims | Accurate lineage does not prove proposition truth or source authenticity. |
| Promotion dimensions | Distinct significance, historical retention, active priority, acquisition and availability fields | No universal promotion tier or memory deletion rule is fixed. |
| Output cardinality and bounded size | Public request limits and bounded arrays; no secret-neighbor counts in actor shape | A schema maximum does not prevent hidden-edge-dependent ordering, truncation, timing, search or error leaks. |

Before a later implementation accepts arbitrary JSON, its parser policy must also settle duplicate object keys, numeric ranges, text normalization and maximum input size. These are proposed entry requirements for interoperable data, not an added parser implementation. The supplied examples use unique keys and decimal strings where quantities occur. Native ID spelling must not be normalized in a way that merges identities.

## Requiredness, optionality and unknown values

The candidate family's field table defines required fields by record type. Optional absence means **not recorded or not included for that purpose**; it never grants permission or means false, zero, no related records, no private motive or no source. Avoid a universal `unknown` value that conflates author uncertainty, actor ignorance, concealed existence, storage failure and known absence. Privileged diagnostics can distinguish those causes; actor output can disclose only the distinctions the actor legitimately acquired.

If a future record deliberately needs uncertainty, its typed representation should identify what is uncertain and whose assessment it is, with available evidence. A named actor's report that “the source is secret” can be represented as received content. A hidden source that nobody mentioned must not become a public `source:redacted` placeholder. Unknown deadlines cannot become `overdue:false` certainty, and unknown guilt cannot become a canonical innocent/guilty field.

Keep actor output as a distinct constructed view. A field such as a schema metadata annotation about reading or writing does not enforce confidentiality. Allow-listing fields is necessary but insufficient: values, titles, kinds, absence, counts, status, order, revision tokens, images, search suggestions and error differences also carry information. Even a structurally conforming actor response can leak a hidden canonical ID by placing it in `label`.

## Closure and extensions are proposals

The [Core applicator and unevaluated-property design](https://json-schema.org/draft/2020-12/json-schema-core) offers mechanisms a later schema author can use to compose narrow object variants. The exact strategy remains open pending a real authorized consumer:

| Strategy | Proposed tradeoff | Safe condition before use |
| --- | --- | --- |
| Closed record families | Reject misspellings, stray universal fields and accidentally serialized private data early | Review closure across composed alternatives; do not assume closing one subschema closes every composed branch. |
| Composed closure using evaluated-property accounting | Can share common identity fields while closing a completed tagged alternative | Verify supported validator/dialect behavior with deliberate positive and negative examples. Do not copy keywords without checking their actual scope. |
| Explicit namespaced extension object | A bounded future producer-owned extension can avoid weakening the whole record | Identify producer, version, semantics, permitted consumers and independent projection rules. Unknown content has no execution or disclosure authority. |
| Unknown-field preservation | Useful only where a chosen owning native contract explicitly requires round-tripping | No universal preservation promise. A private extension cannot be blindly copied to actor output, logs, search or dialogue. |
| Ignore unknown action/sense/version | Superficially convenient but can silently change terms | Reject/defer consequential interpretation; preserve original evidence only in an authorized privileged scope. No fallback to a “similar” known verb or newest proposal. |

This package recommends reviewing closed core variants and explicitly reviewed extensions, without freezing either as an accepted standard. Existing Room Creator round-trip behavior does not authorize equivalent preservation in KeyWrapping or strict Encounter records. Cross-system mutation authority remains with the owner subsystem; an extension or reference cannot install a binding to RC, Atlas or ZANT.

## Versioning and exactness

Retain distinct producer-owned axes: notation/schema dialect, record format, authored artifact/content revision, proposal terms revision, record revision, world/run/history snapshot, actor knowledge cutoff, and opaque actor information token. They have different meanings and need not share one integer or semantic-version policy. Display names and filenames cannot replace identity. If an authorized consumer needs compatibility negotiation, it must select a specific supported pair and demonstrate behavior; no automatic migration, upgrade, canonicalization change or shared registry is proposed here.

Proposal terms and historical receipts are immutable addressed evidence. A counter creates a new proposal version linked to the prior terms. An assertion of “I accepted yesterday” adds a claim; it does not reconstruct a missing assent. A later re-identification adds an actor-local acquired association without rewriting old receipts or historical knowledge. A derived current assessment can point back to its evidence and cutoff rather than mutating that evidence.

Every exact ref should resolve against its intended artifact/snapshot; a present-day “latest” fallback cannot repair missing historical terms. Hash scope and integrity policy must be explicit if selected later. A public low-entropy content hash can disclose a secret through guess matching, so a checksum is not a redaction technique. Audience tokens must not encode global revision gaps or let unconnected aliases join by a shared key.

## Validation beyond shape

These checks require a later authorized semantic design and evidence. They are not validation code created by this proposal.

| Check | Required evidence / review question | Failure boundary |
| --- | --- | --- |
| Reference and kind closure | Does each full ref resolve in scope? Does each local term selector resolve in its exact expression? | No hidden target guessing, label-based coercion or version fallback. |
| Acquired vocabulary | What encounter/background/receipt permits this actor to use each handle/content fragment now? | Known parent does not acquire children; receiving does not endorse. |
| Performative validity | Is it current self performance, actually delivered, exact targeted and under valid standing/lifecycle rules? | REQUEST ACCEPT and third-party/past REMARK ACCEPT create no assent. |
| Agreement formation | Every required party validly assents to the same material terms and chosen formation conditions | No secret fees, inferred courier assent or proposition-Agree substituted for bargain-Accept. |
| World execution | Supported effect, state/capability and exact authority where constitutive | A discussable/impossible promise may remain valid. Social illegality is not physical impossibility. |
| Duty credit | Exact obligation, unit/criterion, source effect, allocation and replay identity | No duplicate payment credit, testimony-to-payment conversion or automatic secret rollback. |
| Temporal consistency | Known clocks/anchors, activation versus due, strictness and causal order | No breach from an unmet activation condition or guessed deadline. |
| Graph constraints | Allowed typed edges, authorized expansion, visited identity, bounded depth/work and dependency checks | A meaningful reference cycle must terminate; a contradictory strict-before dependency needs correction. |
| Actor projection | Existence, fields, labels, sources, edges and all observable metadata authorized for audience/purpose/snapshot/cutoff | Hidden-only changes with equal outward history must not alter exported contents, counts, ordering, failures or composer choices. |
| Dialogue fidelity | Structured terms and outward cues actually match utterance/performance | A template can still add a condition or secret; no automatic correctness from template use. |

A validation finding itself is sensitive data. Privileged diagnostics may identify a concealed cancellation, owner or broken link; actor output must not expose that reason by status text, a disabled choice or different guessed-handle response. A deliberately chosen NPC outward refusal can be an authorized clue. Keep that decision distinct from accidental serialization of private validation reasons.

## Documentation checks now and later entry conditions

The current deliverable can check fenced JSON syntax, duplicate keys, declared fixture ref closure, exact target revisions, local links, forbidden file types and the preservation diff. Those checks establish documentary consistency within the stated assumptions. They cannot verify actor-safe runtime behavior, authenticity, schema conformance, real execution, replay or enjoyable composition because none is implemented.

Before any future schema creation/implementation, a separate scope would need the owner to select a concrete consumer and minimal record subset, settle its relevant open choices, approve actual schemas/code, define privileged versus actor output surfaces, choose validation/dialect capabilities and specify meaningful positive/adversarial cases. A paper test of language enjoyment remains a separate pre-freeze acceptance activity. Nothing in this document initiates Stage 13 or authorizes a dependency, adapter or integration.

Primary design evidence: KW-CONTEXT §§4, 13–22 and source classifications in [SOURCE_SNAPSHOT.md](../../../research/keywrapping-substrate/v0.1/SOURCE_SNAPSHOT.md); [action dictionary](../../../research/keywrapping-substrate/v0.1/ACTION_PREDICATE_MAPPING.md), [transaction analysis](../../../research/keywrapping-substrate/v0.1/TRANSACTION_DONOR_MINING.md), [provenance requirements](../../../research/keywrapping-substrate/v0.1/PROVENANCE_DONOR_MINING.md) and [social decision separation](../../../research/keywrapping-substrate/v0.1/SOCIAL_REASONING_DONORS.md). Structural field strategies are Encounter proposals; external donors remain attributed conceptual inputs. Actual schema files remain deferred.
