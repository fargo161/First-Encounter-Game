# M1 — Shared contracts for M2

Date: 2026-10-17 (America/New_York). Revision: `M1-contract-v2`, D01-A/D01-B remediation only, awaiting independent re-review. **M2 is gated and has not begun.** Code/content snapshot identity is the external `Encounter_M0_M1_Checkpoint_R2.identity.json`; inspect the matching ZIP, not a subsequently edited folder. The original reviewed checkpoint is preserved unchanged.

## 1. Authority, conflicts and implementation limit

The separately invoked kickoff controls M0–M2 scope, gates, and both §3 clarifications. Approval record decisions otherwise take precedence over master v2.1. The legacy HTML is evidence, not design authority. Master Part 6's dormant briefs, historical authorizations and later-milestone requirements do not launch agents or enlarge this assignment.

Two conflicts are resolved here:

1. Kickoff §3.1 excludes **all** collection closure and the missing-preview fallback despite the approval record/master wording. No partial CR-01, restriction/repair/warning machine or approximation is implemented. Before M3, Teddy must confirm the specific missing-preview fallback. The approved broader restriction/repair direction is preserved.
2. Kickoff §3.2 requires committed identity lookup before current-state staleness checks, replacing master §3.7 steps 2–3 in that respect. Section 7 below is the chosen order and is implemented/tested.

Dependency-free JavaScript is selected for this slice: strict runtime validators, JSDoc responsibility contracts, immutable projections and Node's built-in tests provide executable boundaries without a downloaded compiler/build chain. A full TypeScript migration, plugin framework, server, ECS or rule language is unnecessary. Browser modules/bundling are an M2 integration task; no browser artifact is claimed at M1.

**Implemented now:** record validators, vocabulary registry, view projections, generic atomic command envelope/journal, and pure matched-result staging, tested with neutral fixtures. **Specified for gated M2:** semantic compiler, scenario data and its validation, real policy/content, physical inspection resolver, full staged domain processing, browser controls and new-format import/export. Tests of the generic envelope are not proof that the unbuilt domain path works.

## 2. Stable identity

Record IDs use a type prefix and neutral lowercase hex counter/nonce, 4–32 digits; e.g. `actor_0001`. Allocation is monotonic or nonce-based, independent of meaning, vibe, seed and outcome. Display renaming preserves identity. IDs reserved for abandoned drafts are never repurposed for a different committed record. Sequence orders occurrences; session revision versions whole atomic commits; neither encodes hidden truth. Public semantic act names are supported operation types, not secret record identities.

| Record | Identity / ownership |
|---|---|
| Actor | `actor_…`; arbitrary participants, including an absent actor; human controlled actor is a role binding, not a fixed ledger seat. |
| Subject/item/document | `subject_…`; stable entity identity; document revision/time scope identifies the version inspected. Unique-item custody and ownership remain separate. |
| Canonical message | `message_…`, with source `command_…`; frozen once committed. A deliberate later repetition uses fresh message and command IDs. |
| Command | `command_…`, scoped to `run_…`; entire immutable payload retained for equality. Expected revision and package reference are part of that payload. |
| Actual event / physical result | `event_…` / `result_…`; an actual occurrence/result, never an alleged taking fabricated from speech. A result binds one exact request. |
| Observation | `observation_…`; one observer, source citation, sequence/channel, received detail subset and roots. Duplicate observation IDs reject. |
| Claim | `claim_…`; one actually communicated assertion, with speaker, recipients, message, question/proposition scope and receiving observations. |
| Permission | `permission_…`; grantee, grantor, action, target/scope, allowed/unset/forbidden and source message. It is not an action result. |
| Factual belief/stance | Not implemented in M1 and not needed for the minimal M2 report-based reply. If later required, `belief_…` identifies holder + typed question + time scope, preserving support/revision causes under PD-05. |
| Hypothesis | Not implemented or synthesized. A later necessary instance uses `hypothesis_…`, one NPC holder and rule/target/scope, attributed support/correction and revision history. No recursive theory of mind. |
| Package / run | `package_…` + authored integer revision + SHA-256 digest; `run_…` + nonnegative session revision. A run pins its exact authored content. |
| Decision/performance/policy | Future neutral `decision_…` / `performance_…` / `policy_…` records; not secret source-label encodings or listener input. No asset selector is implemented now. |

Fixture package digest `aaaa…` in `tests/fixtures.mjs` is explicitly a neutral test token. It is not a hash of a real Last Collection package. The exact current fixture file hash is supplied by the checkpoint manifest. No playable scenario package is authored at M1.

## 3. One canonical message, separate readers

`validateMessage` checks `encounter-message@2` with `id`, `commandId`, `sequence`, `contextMessageId`, `privateComposition`, and `outward`. The executable neutral example is `tests/fixtures.mjs:message()`.

Private composition contains only selected vibe, selected salience, author/template IDs and the player's chosen intended framing. These are construction records, not simulated sincerity, personality, true emotion or a hidden human objective.

Outward communication has these exact fields:

| Field | Meaning |
|---|---|
| `family`, `act` | Offer/Request/Remark and one primary supported act. Registry retains all six target acts; compilation/execution support must be explicit. |
| `senderId`, `recipientIds` | Actual addressed participants; no broadcast by default. |
| `subjectIds`, `targetId`, `scope` | Communicated known references and exact target/scope. Initial relevant-paperwork wording need not reveal that a hidden file split exists. |
| `content` | `kind`, public predicate, scalar value and time scope: a question, request, assertion, acknowledgment or proposal remains distinct. |
| `framing` | Actual performed cue kind, readable content and referenced subjects; no secret provenance/classification. Text must actually express the represented cue. |
| `prominence` | Understated/measured/emphatic performance feature, independent of the private salience selector as listener data. |
| `terms` | Null for the current contract subset. Non-null terms and exchange execution explicitly reject until implemented. |

Closed outward fields reject selector, asset, template, cache and hidden-conclusion fields. Nested substantive values are scalar at M1; richer supported structured acts require an explicit validated schema, not arbitrary JSON inside a listener payload. IDs alone do not make arbitrary authored text safe: M2's curated compiler and content review must verify performed meaning, cue text and public references. M1 does not claim general prose equivalence checking.

NPC reply shapes `explain_access`, `acknowledge_report` and `decline_scope` are registered separately from the six player coverage acts. They use the same canonical envelope, with an NPC sender and actual recipients; the NPC's own private expression selection stays hidden. These are record shapes only, not response rules or implemented NPC initiation. This avoids forcing future Delivery into a player-only act schema.

| View | Data source / permitted contents | Excluded |
|---|---|---|
| Player preview | `previewView` of a compiled candidate; own selection and complete outward act/context. M2 compiler receives only player-disclosed composition prerequisites. | Reply prediction, undisclosed file sections, private address, NPC beliefs. No closure notice exists in this milestone. |
| NPC listener/decision | `observeMessage` copies outward communication into an actual addressed observation. `listenerView` receives observation/claim stores and that actor's validated profile; output is only local fragments, actual incoming meaning, local claims and own priorities. | Canonical private composition, drafts, full events/world/package, another actor's observations, asset/cache keys, hidden seed facts. |
| Player history/response | `recipientHistory` returns only that participant's received fragments, with actual outward meaning. M2 renders it with public skeletons/control state. The player can separately inspect their own sent selection. | Private NPC expression selection, diagnostic reasoning, unobserved fields, inferred intent presented as fact. |
| Author inspector | `authorInspector` returns a detached frozen diagnostic copy. M2 adds recorded candidates, effects and withheld-detail comparisons. | Any setter, live edit, command dispatch, event routing or reward trigger on refresh. |

The registry preserves 20 vibe names and three salience choices. M2 initially compiles Boundaried, Compassionate and Menacing for required acts, using data-driven expression entries. Unsupported combinations report unavailable from player-known prerequisites. Catalog presence is not implemented coverage. No three-vibe type ceiling or future six-act ceiling smaller than the approved vocabulary is introduced.

M2 salience varies only prominence of the same selected framing: target, participants, amount, permission, action, promise, evidence and truth remain constant. In particular, Menacing needs an explicit previewed possible consequence already supported by known context; changing prominence never invents a complaint or executes one. A first request before the discrepancy is learned may use the supported nonthreatening subset; it must not conjure missing-signature knowledge. Contrasting semantic coverage can use a declared prerequisite fixture after discovery.

## 4. Observations, claims and minimal interpretation

`projectObservation(source, grant)` runs inside authoritative routing. A source has kind/ID, sequence and details. A grant declares observer, observation ID, receiving channel, exact received keys and lineage roots. It returns only those copied details. Unknown detail keys reject. It does not attach the concealed source or a list of concealed field names.

`readObservedSource(boundListenerView, citation)` has no world/event-store parameter, source resolver, callback or filesystem handle. It returns only that listener's already received fragments for the opaque citation, or an empty list. Knowing `result_0001` cannot retrieve its unread text or contact field. Evidence roots support deduplication and retelling lineage; they cannot establish an unobserved alias, destination or match just because hidden records share a primary key.

Tests change concealed source fields while holding received conduct fixed; the complete listener input stays identical. Tests also perturb private selected vibe, salience, template and intended framing while fixing outward meaning; the complete listener input stays identical. These are M1 projection proofs, not claims that M2's unimplemented decision pipeline has passed LC-T47/68 end to end.

Claims are stored separately from actual events. Listener claims must cite the local receiving observation and match the speaker, subject, predicate, time scope and scalar assertion actually heard. Hearing “recipient signature is blank” gives a sourced report, not direct observation that the record is blank. Neither claims nor observations have a global truth/known-everything flag. Missing detail creates no negative belief.

The narrow M2 path can offer a verification step in response to the received discrepancy report without first accepting it as true. Therefore no numeric belief engine or behavioral hypothesis is needed to force this demo. Tamsin's legitimate initial knowledge of her access role and the file layout is authored as scoped initial observations; her follow-up can say she received the reported discrepancy and offer verification. If a later change requires an accepted factual stance, implement the approved strongest-eligible-support/dispute policy in master §3.3; do not import legacy 1/2/4 or use delivery as evidence. A hypothesis, if later needed, must have an NPC owner, real supporting observations, explicit corrective observations, inspectable revisions and deduplicated roots; it never rewrites the message or becomes its own new evidence.

## 5. Permission, deliberate action and result ownership

Permission validates as a separate record. Granting it adds no inspection result and exposes no printed detail. M2 must preflight an actual `perform_action` command against the current permission, actor, target, action scope and package revision before invoking the local resolver. A permission menu is not an executed action.

`validateActionRequest` specifies command, actor, action type, target, permission and expected revision. `validateMatchedResult` requires result ID, an exact request copy, outcome, supported effects and observer-specific detail records. A result for another command, target, permission or revision rejects. Unsupported effects fail clearly.

`stageMatchedResult` is a pure helper: it detaches and freezes one authoritative request/result snapshot pair before validation. That same immutable pair governs matching, duplicate lookup, copied effect/observer arguments, and the stored result identity after staging. It never rereads caller-owned request/result objects after the effect callback runs; callback alias mutation cannot make another identity authoritative. It applies a matched neutral result to a state copy and records that immutable result. Replaying the same result/request is a no-op; the same result ID with changed bytes, or a second different result for one request, rejects. It never installs authoritative state. Tests use a neutral counter adapter, not an inspection resolver or hidden Last Collection fixture.

For M2, the local resolver reports what happened and the declared effects/details. It cannot apply inventory, knowledge or permission effects independently. The shared runtime alone commits the staged outcome and observations. Player disclosure includes only the permitted handling detail; an NPC who sees conduct gets that conduct without unread print or the player's conclusions. Subsequent reporting of the detail creates a new communication observation/claim for the listener. Source grants are trusted scenario configuration and require domain validation; this is a gameplay access boundary, not cryptographic protection against a local author changing JSON.

## 6. Deterministic response contract for M2

No production response selector exists in M1. The smallest M2 policy is a bounded role-bound candidate list:

| Candidate | Eligibility from listener-local information | Effects / basis |
|---|---|---|
| Explain record scope and offer relevant inspection | Received relevant-record access request, known record-custodian role, known mixed file/access rule and legitimate collection authority as needed. | Communicate the split, disclose only section references, grant the limited supported permission. This is the protected ordinary path, with no grievance, serious concern, repair cost or closure. |
| Acknowledge reported discrepancy and offer verification | Received challenge identifying the inspected handling detail; current available relevant route. | State the received report as a report unless independently supported; offer the next bounded verification step. No case recovery, note issuance or material transfer occurs. |
| Safe bounded refusal/clarification | Intelligible supported message but permitted scope/knowledge insufficient. | Receive/log the actual message; explain a public applicable limit without revealing hidden values. |

First remove candidates violating local knowledge, disclosure rules, authority, action support or actual availability. Apply protected-first-request guards before scoring. Among eligible candidates compare authored relevant-service/privacy/verification priorities and actually perceived framing; use a fixed declared ordinal as the final tie-break. No randomness is needed for M2. If variation is later added, persist its neutral deterministic state; never seed it from private selection/provenance.

Bind this shared rule to a role/profile supplied by content. Core predicates may inspect supported act/scope, received claim and known role/rule; they cannot inspect literal display names, scenario/seed names, hidden solution flags, incoming vibe labels or template IDs. One bounded response episode follows a message. NPC initiation can later enter with an outward Delivery record through the same routing; M2 need not implement that opening.

The first request remains “case paperwork.” Initially the player's composer knows neither hidden section structure nor the private value. After the explanation, discoverable section references enter vocabulary without disclosing contact content. A response policy never edits the original request into an address demand.

The proposed M2 fixture starts after the valid collection ticket has been shown and checked: a declared initial occurrence and separate player/clerk receiving observations establish that authority. This does not reveal the file split or missing signature. The player initially knows the case, ticket and outward “collected” entry. The clerk's scoped initial record-reading observation establishes the file layout and the relevant access rule for her own decisions; she receives no world-wide knowledge flag. No initial player observation contains the missing signature or contact value. This is a fixture contract, not implemented scenario content.

## 7. Exact command and commit order

`executeCommand` implements the outer path below. M2 plugs its domain resolver into that same path; the resolver is not a second commit owner.

1. Validate current run envelope/journal integrity. Create one detached immutable submitted-command snapshot, validating its JSON representability. Use only that snapshot for neutral command/run identity checks; reject a different run. No state-dependent gameplay validation yet.
2. Look up the snapshot's command ID in the committed journal. Compare the **entire** immutable command, including private composition, package reference, expected revision and payload. The same snapshot is used for validation, callbacks, resolution, receipt identity, commit/journaling and future exact-retry comparison; caller alias mutation cannot change authoritative command identity. Comparison sorts object keys recursively, preserves array order and JSON scalar values, and rejects unsupported values/accessors/cycles. No lossy hash-only comparison.
3. Same ID + same canonical payload: return the saved receipt without calling validators/resolver again, even though its old expected revision is now stale. Same ID + changed payload: `IDENTITY_CONFLICT`, no effects. Changed metadata is still changed command payload, even though it must not change a listener's evaluation of equal outward information.
4. For a genuinely new ID, validate command schema/support, exact package identity, then current expected revision. A new obsolete command returns `STALE_COMMAND` and creates no message, observation, action attempt or social consequence. Refreshing preview uses a new command identity after substantive changes; never edit a committed ID into a different command.
5. Run current domain preflight against a detached frozen state copy. M2 validates references, player-known prerequisites, context/preview binding, canonical message identity matching command, permissions and any action availability. Private drafts remain unreceived. Ambiguity is a technical rejection. New duplicate message identities must reject, even under another command ID.
6. Copy gameplay data. Run synchronous `resolve(stagedData, frozenCommand)` in the following M2 domain order: freeze initiating canonical message or obtain the matched physical result; stage only actual initiating occurrence/effects; route permitted observations/discoverable references; revise any genuinely required local records; construct filtered listener input; select one response; compile its outward reply and separate Intake/Delivery; stage supported immediate disclosures/permissions; route response observations without recursive conversation. Proposal terms are never executed here.
7. Validate staged domain invariants, result matching and causal trace. M1 `validateStaged` checks neutral fixture invariants; M2 supplies all record/reference, permission, view and scenario checks. A handler failure discards all staged gameplay data. Handler error details are not public feedback.
8. Build one receipt with the immutable snapshot's command ID, new committed revision and detached result; append that same immutable command snapshot and receipt to the journal without rereading the caller's command; validate the whole envelope; return one frozen coherent next run. Callbacks never make caller-owned mutable identities authoritative after they run. The host installs it once. An exception/rejection returns the original run unchanged. Technical diagnostics stay outside in-world records.
9. Render committed result and return player control. Replay, skip, inspector refresh, cached rendering and draft editing call read functions only. They never call `executeCommand` or a local effect adapter.

`validateNew` and `validateStaged` must synchronously return true; false/exception rejects. No remote or asynchronous resolver is supported by this M1 local contract. The generic runtime copies inputs and protects its journal/revision from hook writes; it cannot guarantee arbitrary future domain callbacks are correct. M2 review must audit those callbacks and their use of filtered inputs.

A valid social refusal may commit the hearing event and a refusal response. A technical failure commits neither. A deliberately repeated new message is a new social occurrence; repeated evidence roots or already-applied result IDs must still prevent duplicate knowledge/rewards. Receipt payloads are authoritative results/diagnostics and must go through appropriate public projections before display; the journal is never a listener history API.

## 8. Persistence and future transactions

Package/configuration and running session are separate. M1 runs contain `schema`, `id`, pinned `packageRef`, `revision`, JSON domain `data` and committed `journal`. The envelope validator checks journal identity, contiguous commit revisions and package/run consistency. It is not a complete M2 domain save validator. JSON round-trip retry tests prove the journal boundary only.

For M2, author a separate versioned `encounter-package@2` with actor/subject definitions, initial facts and receiving records, supported expressions/actions, role policies and fallbacks. A new `encounter-run@2` starts from a validated package copy. Export the exact package snapshot with the run or verify its digest on import; do not silently substitute edited content. Before replacing a live run validate all domain record types, uniqueness, references, actual/received-source links, package compatibility and current permissions. Current M1 validators are bounded JSON contracts (32 levels / 1 MiB per canonicalized value); revisit explicit save-size limits as needed when integrating the bounded M2 fixture, with tests and a clear message.

Manual package/run export/import is required at M2 even if optional autosave works. New storage keys must leave `encounter-core.session.v1` untouched. Unsupported `encounter-world@1` / `encounter-session@1` saves refuse with a compatibility message; no conversion, fabricated observation history or copied trust values. Author edits apply to a new validated package revision and restarted run, never a live state patch. Playback state is separate from mechanical effects and can resume from a committed receipt.

M2 has no money/custody exchange. Future offers retain proposal vs execution, showing vs giving, conversational Yes vs exact confirmation, one active offer for the current partner, independent offer revision and revalidation at confirmation. Payment, custody, named settlement and completion record must commit together or not at all. Harmless discussion preserves current terms; End/switch closes uncompleted terms. These are preserved contract requirements, not implemented transaction features.

## 9. M1 gate and next review

Review `Encounter_M0_M1_Checkpoint_R2.zip` against its adjacent SHA-256/per-file identity file. It includes the separate M0 plan, reference bytes, this note, repaired source, neutral fixtures, D01 regressions, unchanged tester tests, exact commands and fresh test logs. The earlier M0-only ZIP and original failed M1 checkpoint remain unchanged.

The independent tester should challenge identity-before-staleness, failure rollback, journal restoration, hidden-source dereferencing, nested metadata/proxies, actor-local claims, and whether the proposed M2 policy/records preserve the owner-facing invariants. Report feedback with this exact archive hash and distinguish contract findings from unimplemented gameplay.

**Gate remains uncleared:** the independent tester's original verdict was NOT READY FOR M2 (D01-A and D01-B). This R2 remediation requires independent re-review; rerunning the tester-supplied suite as the builder does not supply that verdict. Teddy has not waived re-review, and the remediation instruction explicitly withholds M2 authorization. No agent or specialist was launched. Stop here before authoring M2 content, compiler, policy, physical inspection or browser interaction.
