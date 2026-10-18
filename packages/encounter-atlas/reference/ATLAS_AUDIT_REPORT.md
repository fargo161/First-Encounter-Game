# Atlas jargon translation audit report

2026-10-18 · America/New_York · Audit/design only

**Recommendation: proceed to a tightly scoped, read-only Atlas Builder pass.** AR0 R1 provides sufficient verified data for Person inspection and source tracing. It does not yet provide every field or explanation implied by a broad workbench vision. The key design rule is to simplify the language while preserving who received, reported or believes each assertion and how that differs from current world state.

The handoff consists of this report, [ATLAS_PLAIN_LANGUAGE_VOCABULARY.md](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/ATLAS_PLAIN_LANGUAGE_VOCABULARY.md>) and [ATLAS_FIRST_WORKFLOWS.md](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/ATLAS_FIRST_WORKFLOWS.md>). Those documents contain the detailed translation rules, evidence index, workflow support limits and first-slice acceptance cases.

## Evidence and authoritative versions

The current baseline is [the frozen AR0 R1 checkpoint](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Encounter_AR0_Atlas_Readiness_Checkpoint_R1.zip>), whose delivered tree is `outputs/Encounter_AR0_R1`.

| Identity | Audited value |
|---|---|
| Source revision | `AR0-projection-v1-R1-D01` |
| Frozen ZIP | SHA-256 `f5566fdcfa82dc8aaee9378d7a0e894f10a4a2342100b7665cbd1c23e26e72da`; 110,840,429 bytes; 2,310 files |
| Source digest recorded in R1 identity | `8dd542efed9f74573bcb1913d367f7c791d63c3830d65b7f35f68abdcb92f09c` |
| Gameplay foundation | Accepted M3 R3, `M3-runtime-v1-R3-D03` |
| Sealed package | `package_0003`, revision 1, `M3-protective-shortcut-v1`; digest `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f` |
| Catalog file identity | SHA-256 `21a0747936c3e8e7e9cf33833348ff6eb7b07a183179ce1e21181d618c854c5b` |

This audit recomputed the R1 ZIP hash and compared every archive member with the delivered tree: **all 2,310 matched**. It read the adjacent [identity](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Encounter_AR0_Atlas_Readiness_Checkpoint_R1.identity.json>) and [verification](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Encounter_AR0_Atlas_Readiness_Checkpoint_R1_Verification.json>) records, R1 start/remediation/test/proof material, original AR0 defect report, [independent R1 re-review](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/AR0_R1_Independent_Test_Report.md>) and its [evidence identity](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/AR0_R1_Independent_Test_Evidence.identity.json>). That re-review concludes **READY FOR ATLAS v0.1**, independently verifies the Orrin/Nera binding fix and retains legitimate non-actor aliases.

The original AR0 checkpoint is historical and failed its independent identity-binding review. M3, M3 R1 and M3 R2 precede the accepted R3 foundation. Old root README/package metadata/test headings describe inherited M3 work; original AR0 reports remain explicitly historical under R1 START_HERE. They do not supersede the external R1 acceptance. `before-*` proof files deliberately preserve the old misattribution. No current behavior was inferred from those incorrect outputs.

Inspected implementation includes the complete AR0 projection/catalog, M3 engine/types/inference/compiler/policy, shared run/observation/result contracts and relevant presentation code. Inspected tests include AR0/D01, M3 domain, and retained independent R1 adversarial source. Inspected design references include the Master, Atlas readiness specification and M1/M2 contract note, treating earlier builder/tester instructions as historical material. No embedded prompt was treated as a request to implement its milestone.

Fresh verification in this audit:

- `node --test --test-reporter=tap tests/*.test.mjs` against the exact delivered R1 tree: **194 passed, 0 failed, 0 skipped** on Node v24.18.0.
- Imported the actual initial, warned, acknowledged and recovered R1 browser saves through the real replay validator. Recomputed both audiences: **eight projections exactly matched the packaged JSON proofs**. Checked detached/frozen output and input preservation.
- Additional in-memory assertions verified absent Nera's empty local receipt, alias omission from projected Person source refs, initial Event observer-array incompleteness, and the persistence of dry-storage fact wording after custody transfer. A cursor at the current revision produced an empty feed while leaving current cards/links intact.

| Actual saved point | Run revision | Author cards / links / changes | Player cards / links / changes |
|---|---:|---:|---:|
| Initial | 0 | 19 / 43 / 0 | 11 / 15 / 0 |
| Warned | 11 | 34 / 152 / 13 | 32 / 115 / 13 |
| Acknowledged proposal | 19 | 44 / 239 / 33 | 44 / 183 / 26 |
| Recovered | 20 | 45 / 244 / 36 | 45 / 189 / 29 |

Earlier independent browser execution/evidence was reviewed, not freshly repeated here. Its accepted IR3-25 contradictory synthetic-geometry limitation remains historical, non-blocking evidence; the 194-test fresh result does not claim to rerun that separate independent suite. No new browser certification or universal semantic validation is claimed.

## 1. What Encounter currently feels like to use

The read-only developer exports expose useful information through dense machinery. `renderAtlasMarkdown` prints raw relation kinds, identity tokens and entire Person/Event state JSON. A single recovered author snapshot has 244 links, including receipt, relevance and reference edges; finding the important story requires understanding why those edges exist. This is a concrete navigation and vocabulary burden, not evidence that the underlying distinctions are unnecessary.

The distinction between views is also easy to misread. A player projection's NPC state is `{}` because private records are hidden; absent Nera in author view has explicit empty local arrays. Treating both as “knows nothing” produces a false explanation. The player's factual card likewise has no simulated beliefs, despite received reports and documents.

Names are readable but not authoritative identity. Nera's actor and owner-topic reference legitimately identify the same Person, while Orrin must remain a different actor. AR0 R1 now validates that distinction. Atlas should make the result understandable without requiring the owner to learn the alias registry.

## 2. Biggest vocabulary barriers, ranked

1. **“Knowledge” hides several different meanings.** Observation, evidence, report, belief and hypothesis all sound like ways to know something; merging them would change the model.
2. **Identity and references leak into every explanation.** Actor/subject/card/source/alias are needed internally, but ordinary inspection should start with people and topics.
3. **History has several overlapping representations.** Journal commits, domain events, Event cards, results, changes and document/belief histories are neither identical nor exhaustive substitutes.
4. **Status words overstate completion.** An offer created as `accepted` still awaits exact confirmation. Permission, acknowledgment and action result must read differently.
5. **“Relationship” suggests more simulation than exists.** Current links include evidence receipt and authored context, while broader trust/affection/needs/debt systems in the Master are not live generic capabilities.
6. **Source, revision, receipt and visibility are overloaded.** An original event, immediate message, run step, document version and displayed-notice acknowledgment require qualified wording.

## 3. Concepts Atlas can simplify safely

Use **Person, Thing, Place, Event, Scenario, Group** as the entry categories. Translate low-level relations into **Owns, Currently holds, Was told by, Believes, Source, Mentions, Happened at** when the underlying record supports that wording. Replace “projection audience” with **Full developer view / Player-received view**. Put IDs, schema names, digests, command payloads and raw type tags under **Encounter details**.

Progressive disclosure fits the existing detached cards/links/provenance architecture. It does not require a separate truth store. The qualifications must remain in the summary: who holds the belief, whether information is reported, and whether a handover is still pending cannot be hidden behind a technical expansion.

## 4. Concepts Atlas must preserve precisely

The most important boundary is **actual state versus a person's received information versus their interpretation**. Orrin received only a bounded movement fragment; the Collector receives his report; neither path proves that the unidentified wrapped case was the owned case or reveals destination/purpose he did not receive.

Also preserve owner/holder, current custody/earlier location evidence, observation of conduct/reading contents, permission/performance, proposal/Yes/exact confirmation, participant/observer/mention, original occurrence/later report/correction, warning/repair/closure, and full developer/player-received view. The vocabulary document enumerates the dangerous pairs and the required wording safeguards.

## 5. What Atlas v0.1 should expose

Begin with one validated Last Collection run in full developer view: a small scenario index; Person summaries with typed information and Source expansion; basic Thing owner/holder inspection; Event source/result detail; selected recorded changes; and clear existing-validation failures. Stable identity and original data should remain inspectable. Plain summaries should be derived from current records each time.

Last Collection has four People, four Places, eight Things, two initial historical Events and zero Groups; runtime Events grow with actual supported occurrences. Group support can remain empty. Search/filter and a player-received comparison are reasonable follow-ups once statements are correct. A graph is optional after the article/source reader is trusted.

## 6. What Atlas v0.1 should leave out

Leave out editing/deletion, automatic merges, live belief patches, write migrations, complete deletion-impact claims, universal contradiction detection, generic inventories, friendship/trust meters, debt/promise/need/goal systems, a full BASED editor, NPC initiation, sensory simulation, host geometry, global multi-run world merging and a player notebook product.

Also leave out any claim that the current changes feed is a complete timeline or that every Event observer array lists everyone who received information. These are semantic limits, not merely deferred polish.

## 7. Gaps and ambiguities in the current contract

| Finding | Evidence and practical consequence | Treatment for Builder |
|---|---|---|
| Generic “knows” is not a current record type | Person state contains observations/claims/beliefs/hypotheses, not one truth-qualified knowledge set | Use typed information headings; define any future “Knows” label before using it |
| Alias/profile information is outside Person output | Projection `sourceRefs` includes primary catalog source, not the alias list; profile roles/weights are not Person fields | Use validated companion catalog/package in details or defer those fields; no schema change needed for the first slice |
| Current location and stored facts can diverge in meaning | Initial current holder is Office storage; fact/evidence says Dry storage. No containment relation links them. Dry-storage fact persists after Collector becomes holder | Use current holder for current custody; show the sourced location fragment separately. Whether these Places mean containment or an underspecified location contract remains unresolved |
| Changes are selective | Explicit feed kinds omit belief-revision and offer-invalidation entries. Cursor filters feed only | Say “Recorded changes”; compare two saved snapshots for broader differences |
| Event audience fields are incomplete for general receipt questions | `observerRefs` is built for physical results; historical/message receipt requires observation/claim joins | Distinguish performed/communicated/received/mentioned; never infer “no observers” from an empty array |
| Some “why” data requires another existing read API | `inspectRun`/`decisionInput` expose real response reasons; AR0 output does not include complete decisions | Keep first-slice why limited to assertion sources; add inspector-backed diagnosis later |
| Broader Master design exceeds current engine | Master §2.7 and §3.4 describe more ledger/selection behavior. Current policy uses role/local-state gates and fixed priorities, not profile priorities/needs/relationship weighting | Treat broad systems as design-only. Do not expose inactive controls as effective behavior |
| `accepted` offer is pending | `buildOffer` creates status accepted before material confirmation | Show “Awaiting exact confirmation,” then actual result separately |
| Validity is bounded | Validators enforce references and replay invariants but do not prove prose truth, all relation semantics, privacy in arbitrary authored text or temporal consistency | Report specific checks; preserve unresolved issues for human review |
| Identity is contextual | IDs are stable in the supported catalog/package/run scope; run labels may repeat | Do not promise global identity or compare unrelated runs by label alone |
| Contract names overlap across versions | Shared M2 claim/permission validators differ from M3 runtime records; schema versions intentionally mix | Bind reader to current M3/AR0 shapes and original source symbols, not term similarity |

These are explicit limits on presentation and scope. No new blocking identity or gameplay defect was demonstrated for the recommended Person/source slice. The location/time ambiguity is a reason to avoid an unqualified current-location sentence, not permission to invent a repair.

## 8. Recommended next Codex pass

Give the Atlas Builder the three audit documents, the exact frozen AR0 R1 ZIP plus adjacent identity/verification, independent R1 acceptance/evidence, and the validated Last Collection saves/catalog. Require the Builder to resolve versions before starting and use the existing projection seam. No new canonical storage or gameplay refactor is required for the initial reader.

Its first milestone should implement **read-only Person inspection with source tracing**. Begin with Orrin, Nera and Tamsin as semantic counterexamples. The independent acceptance cases in the workflow document cover source attribution, absence, belief versus truth, human factual state, aliases/identity conflict, save/load and read purity. Stop that implementation milestone for independent testing before expanding the workbench or authoring capabilities. This audit implemented none of it.

## Required questions — plain-English answers

### 1. What 10–20 concepts do I actually need?

These 18: **Person, Thing, Place, Group, Event, Scenario, Owner, Current holder, Received information, Reported claim, Belief, Suspicion, Source, Permission, Proposed handover, Completed result, Visit warning/repair, Changes in this run.** Learn what those mean, not the internal schema syntax. Group may have no entries.

### 2. Which terms should I never need to see normally?

Registry/binding, canonical serialization, sealed package/digest, schema versions, projection/epistemic, raw actor/subject IDs, `sourceRefs`/`roots`, journal/command envelope/receipt, staged resolver, idempotence, revision cursor and BASED letter codes. Their useful meanings should appear as Source, Step, View, Person, Topic and readable actions; raw details remain available.

### 3. Which distinctions cannot safely be hidden or merged?

What happened, what someone received, what they were told and what they believe. Also owner/holder; current state/earlier evidence; same name/same identity; permission/action; proposal/confirmation; participant/observer/mention; warning/repair/closure; and full developer/player-received information. The technical words may disappear; these differences must remain clear.

### 4. What are the five highest-value inspections?

1. A person's received information, reports, beliefs and sources.
2. The case's current owner and holder.
3. An Event's actual communication/action and who received which part.
4. The source chain behind an assertion or connection.
5. Recorded changes between compatible saved points.

### 5. What should the first prototype deliberately leave out?

Writing, deleting, merging identities, generic simulation/editor controls, a complete graph-first experience, global world synchronization, universal contradiction/deletion analysis, and a player journal. Start with a trustworthy reader.

### 6. Does AR0 R1 expose enough stable information?

**Mostly.** It has stable typed cards/links, validated save lineage, local information/beliefs, sources, two audiences and selected changes. The accepted identity fix and fresh checks support the bounded first reader. Complete aliases, role data and decision explanations need the companion catalog/package or inspector; complete history/diff, location/time semantics and generalized validation remain limited. Readiness is sufficient for the specified slice, not every aspirational workflow.

### 7. What is the single best first vertical slice?

**Select a Person, read their received information and beliefs in plain language, and trace an assertion to its actual source.** Prove Orrin stays the reporter, Nera stays absent without borrowed knowledge, Tamsin's belief stays fallible, and human receipt stays separate from simulated psychology. Independently test that reader before adding editing or more simulation.
