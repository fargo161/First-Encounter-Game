# Game and social-AI precedents — architecture research

Date: 2026-10-23, America/New_York. Role F. Status: primary-source comparison for the owner-authorized architecture phase. Evidence below is documentary/source inspection, **not** independent reproduction of another project's tests, product maturity, privacy or scale. No package installed, external project copied or game/agent implementation integrated. [Phase scope](README.md), accepted Encounter/KeyWrapping/Economy boundaries and the immutable [P0 packet](../preflight/INFORMATION_ECONOMY_PREFLIGHT_REPORT.md) remain controlling.

## Findings

No examined system supplies a ready-made Encounter information substrate with its authority, qualified identity, bounded replay and actor-sealing guarantees. The strongest reusable ideas are explicit per-holder representations, distinct received content versus adopted stance, source/support metadata, author inspection and bounded propagation. Adopt none of the projects' global social truth, belief-strength arithmetic, automatic disclosure, forgetting or model-memory rules as substrate defaults.

The comparison separates **E: source evidence**, **I: inference about Encounter fit**, **R: recommendation**, and **O: open evidence**. Apparent missing guarantees mean the inspected material did not establish them; they are not claims that an entire external codebase lacks a feature.

## Ensemble / Comme il Faut family

**E.** [Official Ensemble repository](https://github.com/ensemble-engine/ensemble) identifies it as an evolution of Comme il Faut, used for socially aware characters, and supplies a JavaScript library plus an authoring tool. The [API](https://github.com/ensemble-engine/ensemble/wiki/Ensemble-API) loads schema/rules/cast/history/actions, calculates volitions, selects actions, executes action effects, applies trigger rules and dumps the social record. Its [schema documentation, edited 2019-11-21](https://github.com/ensemble-engine/ensemble/wiki/Schema) distinguishes boolean/scalar directional predicates, defaults and durations, with zero-duration predicates used as events. These are social-state and action-selection mechanics, not evidence that each actor acquired every queried predicate.

The [authoring guide, edited 2019-12-04](https://github.com/ensemble-engine/ensemble/wiki/Using-the-Authoring-Tool) documents rule/schema editing and a console, while action/history/cast editing still requires JSON; it warns about autosave and refresh/reload behavior. This is concrete evidence that social authoring needs inspection and reproducible reset, not only a rule engine.

**I.** A single social-record lookup is unsafe as the authority for what a particular Encounter actor knows. Timed reversion/default values also cannot erase the historical acquisition/cause. Trigger/action effects would compete with Core if integrated directly. Volition/personal preference belongs above L1/L2.

**R.** Borrow separation of authored domain, trigger conditions and inspectors; show why a candidate transition matched or failed. Keep simulation reset/export deliberate and replayable. Consume already sealed information in higher-layer social reasoning; never feed unrestricted privileged history to it.

**O.** No exact executable release, runtime, holder-sealing property or source-correlation test was qualified. Concepts only. [Ensemble's actual license](https://raw.githubusercontent.com/ensemble-engine/ensemble/master/LICENSE.md) is **BSD-4-Clause, University of California specific**, including an advertising acknowledgement condition; do not assume BSD-3-Clause if code reuse is later proposed.

## FAtiMA Toolkit

**E.** [Mascarenhas et al., arXiv:2103.03020v1, 2021-03-04, §§3.3, 4.2 and 6](https://arxiv.org/html/2103.03020) describes perspective-qualified beliefs, default lookup in the agent's own perspective, Theory-of-Mind queries, certainty affecting utility, and procedural meta-beliefs with access to the knowledge base. It also describes character belief/memory/goals editors and a simulator inspector exposing beliefs, memory and fired rules. The [separate authoring study, arXiv:2206.03360v1, 2022-06-07](https://arxiv.org/html/2206.03360) reports harder reasoning tasks and substantial dialogue/decision authoring effort; it does not establish that a rich social model is cheap to author.

**I.** Perspective is a useful lookup dimension, but a modeled belief about another actor is not permission to inspect the other actor's real knowledge. A meta-belief callback with unrestricted KB access would defeat sealing. Certainty/utility/emotion is higher-layer interpretation, not generic truth or source independence. A simulator inspector is an author tool whose privilege cannot be reused for NPC queries.

**R.** Require two inspectable paths: a privileged causal/support explanation and the exact selected holder's safe view. Trace failed prerequisites and fired rule/version without exposing hidden contents through reasons. Any later cognitive reasoner receives only its authorized input snapshot and returns proposals; it cannot query Core arbitrarily or install effects.

**O.** No live toolkit integration or behavioral replication performed. The [official source license](https://raw.githubusercontent.com/GAIPS/FAtiMA-Toolkit/master/License.txt) is Apache-2.0; paper permissions are separate (the 2021 page states CC BY-NC-ND; the 2022 page states CC BY-NC-SA). No text/figures/code are copied. C# toolkit/runtime/authoring tooling would introduce scope beyond a minimal Python proof; no engine setup is authorized.

## Talk of the Town / Bad News: fallible knowledge and investigation

**E.** [Ryan et al., “Toward Characters Who Observe, Tell, Misremember, and Lie,” pp. 2–5](https://expressiveintelligence.github.io/papers/ryanEtAl_TowardCharactersWhoObserveTellMisrememberLie.pdf) uses per-character mental models and belief facets with predecessor/evidence metadata. Evidence records source, location, time and strength. Lies are treated as statements by recipients while privileged lineage records their actual origin; characters retain competing beliefs. The model sums support strength and slightly strengthens a belief when its owner retells it. The paper reports implemented simulation but unfinished gameplay/authoring work at that publication.

The [authors' Game AI Pro 3 chapter, §§37.3–37.4](https://www.gameaipro.com/GameAIPro3/GameAIPro3_Chapter37_Simulating_Character_Knowledge_Phenomena_in_Talk_of_the_Town.pdf) explains authored salience/mutation distributions and evidence-source metadata surfaced in dialogue. [Ryan's own project account](https://jamesryan.computer/) describes Bad News as an investigative next-of-kin search using generated town relationships, a live actor and a hidden wizard. It is a computationally assisted performance precedent, not evidence of autonomous generated dialogue or unattended investigative correctness.

**I.** The source/location/time and predecessor trail directly motivate diagnostic questions: who said this, when/where, what was superseded, and how did the current view form? Retelling-strength psychology, however, is incompatible with using repetitions as independent corroboration. Mutation/forgetting requires authored behavior and cannot be imported as causal proof deletion. Privileged knowledge that a statement is a lie must not create a listener-visible lie flag.

**R.** Preserve source/support and historical versions; test sincere error versus intentional false statement separately. Expose explanations in terms of what the actor actually received. Keep optional memory fallibility, salience, intention and disclosure strategy above L1. Use a tiny investigation fixture to inspect acquisition/correction, without building a playable slice.

**O.** No complete source/version/license closure or current product benchmark evaluated. The chapter itself is copyright material; public reading is not code/figure reuse permission. No current autonomous game-readiness claim follows from those papers.

## Generative Agents and AI Town: retrieval is not authority

**E.** [Generative Agents, arXiv:2304.03442v2, 2023-08-06, §§4, 6.5.2 and 7.1.1](https://arxiv.org/html/2304.03442v2) combines retrieval/reflection/planning, reports missed retrieval and embellished recollection, and checks information diffusion against source dialogue. Its behavior study is not an Encounter authority or deterministic replay proof.

The inspected [AI Town memory implementation, moving main](https://raw.githubusercontent.com/a16z-infra/ai-town/main/convex/agent/memory.ts) filters vector candidates by player ID, reranks them using relevance/importance/recency, updates last-access time through a mutation using `Date.now`, and stores reflection references to related memory IDs. Reflections/importance are model-produced. Its [architecture document](https://raw.githubusercontent.com/a16z-infra/ai-town/main/ARCHITECTURE.md) distinguishes engine inputs from asynchronous agent work and permits separate agent tables; that separation is useful context, not shared Encounter persistence semantics.

**I.** Related-memory IDs are useful explanatory links, but model-selected references do not establish complete, truthful support or source independence. A ranked subset is attention, not the full set of acquired records; failure to retrieve is not forgetting. Touching recency on a query changes later retrieval and conflicts with a pure Encounter inspection API if imported as admitted semantics. Player-ID filtering does not by itself establish organization grants, historical cutoffs or protected-source sealing.

**R.** Keep admitted acquisition/support separate from optional presentation retrieval. Authorize before ranking. Do not turn model summaries, importance, embeddings or query touches into canonical history/stance. Any future model use must be an explicit recorded proposal, with independent validation and bounded inputs; none is needed for the first proof.

**O.** AI Town source was inspected at moving-main URLs, not pinned or executed. [Its source license](https://raw.githubusercontent.com/a16z-infra/ai-town/main/LICENSE) is MIT, separate from the paper and model/service licenses. No model, embedding store, Convex backend or autonomous agent is adopted.

## VelvetRP: a closely related bounded-ledger design, with status caveats

**E.** The primary project is [mojomast/velvetrp](https://github.com/mojomast/velvetrp). Inspected snapshots conflict: the [older raw knowledge document](https://raw.githubusercontent.com/mojomast/velvetrp/main/docs/npc-knowledge-rumors.md) says researched/not implemented and describes eviction, while [Plan 4](https://raw.githubusercontent.com/mojomast/velvetrp/main/docs/plan-4-living-knowledge.md) reports implemented immutable observation rows, cap refusal rather than deletion, bounded co-presence propagation, trust-gated reads and a provider-free evaluator. It names milestone commits and records deferred clue-source/browser work. Its closing rollback text still mentions eviction despite the immutability/no-eviction description. These are project-reported claims with internal status/text inconsistencies; this research did not reproduce them.

**I.** Useful engineering controls are authorization before ranking, actual immutable observations, bounded writes and explicit evidence/deferrals. Co-presence-based automatic telling, faction sharing, a verified-before-rumor ordering or always-disclosable verified material are authored Velvet policy, not universal information semantics. Encounter needs an actual admitted communication/acquisition basis, and even an accurate record can remain secret. Row caps do not prove complete history, byte/work/reload fit or a safe response to exhausted support.

**R.** Borrow test shapes: no narration-created observation, no paid/model call during inspection, deterministic cap refusal, selective audience/negation hard negatives and preserved holdouts. Reject silent eviction of required evidence. Require receiver-specific grant/acquisition and trace any propagation as explicit operations under the selected native contract.

**O.** No exact commit/source/license closure or independent current test execution established. Treat the named milestone IDs as that project's evidence pointers, not verified snapshots. The status conflicts forbid claiming this is a proven drop-in solution. No Velvet code or schema is copied.

## Repage: receiving reputation is not endorsing it

**E.** [Sabater, Paolucci and Conte, JASSS 9(2), 2006-03-31](https://www.jasss.org/9/2/3.html) distinguishes personal evaluation (image) from a belief that an evaluation circulates (reputation). An actor can relay reputation without accepting that evaluation. Its model uses predicate dependencies/detectors; changes can cause cascades that revise dependent values.

**I.** Knowing that a rumor circulates, asserting that rumor and endorsing its proposition are three distinct concerns. Dependencies support explanation, but eager detector cascades create the same boundedness problem as rule firing. Reputation/image categories and numerical trust policy are higher-layer social behavior, not necessary L1 record types or universal truth scores.

**R.** Preserve assertion/receipt/stance distinctions and optional metaclaims without requiring every claim to have a true occurrence anchor. Bound reverse-support re-evaluation; incomplete analysis cannot certify current support. Do not implement a complete reputation market or recursively model every actor's beliefs about every other actor.

**O.** Concept study only; no current package/implementation license or performance qualification. The paper's evaluations do not validate Encounter's common-source, secrecy or persistence requirements.

## Transfer into the candidate and review oracles

These are **recommendations**, not claims that the candidate already provides them.

| Design pressure | Candidate requirement / concrete review oracle |
| --- | --- |
| Unseen world event | Hold an actual event fixed; uninvolved actor's safe output remains unchanged until admitted acquisition. Do not equate geometric presence with comprehension or hearing. |
| Repetition and circular rumors | Distinct utterances/receipts coexist; identical source loops never add grounded independent origin. An unknown/truncated chain cannot certify independence. Psychological repetition effects, if later desired, remain separately labeled. |
| False source / false contents | Preserve actual teller and alleged origin separately. Privileged falsehood/intent annotations never appear merely because a recipient reads the claim. |
| Restricted record | Acquired existence metadata does not unlock contents, source identities, counts or attachments. Correctness of a record does not authorize disclosure. |
| Retrieval versus retention | Safe inspection has no semantic side effects. Ranking omits material only from attention; it does not erase prior acquisition or support. |
| Support loss / disagreement | Keep original inference and historical stance. Report affected/incomplete/unsupported support at its causal point; automatic stance replacement is a separate explicit behavior choice. |
| Author explanation | For one result, inspect the actual received fragment, qualified referent, actual/asserted/known source, rule/version, eligible support and blocked prerequisite. Compare privileged and holder views on the same fixture. |
| Bounded simulation | Charge receipts/payloads/links/worklists/grants/history as well as prompt size. Read limits, hop limits and top-k retrieval alone do not establish a bounded persistence contract. |
| Authoring scope | Synthetic policy IDs and explicit transitions suffice to prove plumbing; do not author a complete social ontology, mutation graph, dialogue or institutional law package to validate L1/L2. |

Open design questions for Gate A: exact recipient/content/acquisition semantics; support graph grounding and incomplete outcomes; current lookup versus historical receipt; overlap with accepted KeyWrapping; and the smallest useful privileged/holder diagnostic views. The C/G and Director candidate must answer these. F supplies comparison and peer review, not independent I/J acceptance or permission to implement.

## Research record and limits

Ten batched primary-web calls in this architecture pass deepened mechanisms and authorability rather than reinstalling candidates or repeating popularity lists. Primary evidence comprises official project docs/source/license text, author/lab papers, publisher chapter and JASSS paper. No secondary mirrors or search summaries are used as technical authority; failed fetches and moving-snapshot conflicts are retained as limits. Quantitative external test results are not relabeled independent Encounter results. No claim of a solved general NPC epistemology, indefinite campaign or city-scale system is made.

## F peer cross-review of Architecture Candidate v0.1

Reviewed the [candidate](INFORMATION_ECONOMY_ARCHITECTURE_V0_1.md) for the transferable constraints above. **No F blocker or must-fix found.** The candidate distinguishes actual/asserted/holder-known lineage, receipt from stance, unknown from false, shared origin from repetition, privileged inspection from actor views, and attention/access from historical retention. It rejects automatic co-presence acquisition, source-count truth scores, unrestricted callback effects, host-clock mutations, automatic stance revision and historical eviction. These are appropriate departures from optional behavior in the studied projects, not claims those projects promised Encounter's guarantees.

The small actor/org/operation envelope and explicit no-playability/no-city-scale claims are suitable for a reference proof. Selecting a new exact-source native proof requires Gate A; it is not hidden adoption of a social runtime. The author inspection questions in §18 are materially useful. **EF-02 (SHOULD FIX)** in the reuse report adds the missing negative-path question, “why did this eligible-looking transition not proceed,” confined to privileged safe diagnostics. **EF-01 (SHOULD FIX)** makes receiver-controlled intake composition explicit. No new personality, dialogue, investigation game, full social ontology or UI is needed to close either item.

Peer disposition is limited to authorability/diagnostic design and reuse fit. It is not independent I/J acceptance, external-project test reproduction, actual IE behavior verification or owner approval.
