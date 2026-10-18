# AR0 implementation report

**READY FOR INDEPENDENT AR0 REVIEW.** This is the builder handoff, not independent acceptance. Stop after AR0. No Atlas UI, Atlas v0.1, M4, Seed B or unrelated future mechanic was implemented.

## Baseline and preflight

The accepted M3 R3 baseline exactly matches the handoff: ZIP SHA-256 `615ddc79e0f7bd8d903411401360fc321b7b916abcc69dc974e9673fd0e74c87`, 98,549,633 bytes, 1,430 regular files. Its source revision/digest remain `M3-runtime-v1-R3-D03` / `a609f63c56ed1e047f44e8f3ef28b21f91adec9e40e35d08eb988d0e78de9362`; browser SHA-256 remains `8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb` (133,751 bytes). Package `package_0003`, revision 1, digest `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f`, and content `M3-protective-shortcut-v1` are unchanged.

Preflight and implementation plan were written before adding production code. The handoff, governing Master/approvals, M3 implementation, R3 remediation/verification, final independent R3 verdict and existing source/tests informed that preflight. The owner explicitly authorized proceeding through a frozen AR0 checkpoint after verification. The future independent tester prompt was treated as a separate role, not permission to self-award independent acceptance.

All **1,430 accepted files remain byte-identical in AR0**. Nothing was edited or removed from the accepted source, policy, content, UI, tests, tools or historical evidence. The original accepted ZIP, identity and delivered tree were rehashed unchanged. AR0 is an additive adapter, not a refactor of M3. R3's ZIP remains at its original output path; its exact identity is included rather than another duplicate 98 MB nested archive.

## Production additions

There are precisely two production additions:

- `src/ar0/atlas.mjs`: catalog/reference validation, deterministic author/player projection, normalized links, meaningful events, recent changes, projection validation and Markdown/network proof renderers.
- `content/ar0/last-collection.json`: descriptive semantic catalog, pinned to the exact accepted package reference.

The new module reads the accepted M3 API and canonical records. M3 never imports it or the catalog. No Atlas mutable store, update command, cached truth database or authoring UI exists. Complete run replay uses the existing pure engine on fresh detached copies to validate committed lineage and derive recent changes; no reconstructed state is installed, no host action is sent and no gameplay effect is repeated externally.

The source classification and complete additions patch are under `evidence/ar0/`. New tests/tooling are separately classified. No inherited assertion was edited.

## Identity, kinds and scenario structure

Catalog entities declare `person`, `place`, `thing`, `group`, `event` or `scenario`. Types are not inferred from labels or ID prefixes. Existing actor/subject identities are reused. Nera's owner-topic reference aliases the existing Person, so it does not create a second Nera. Descriptive names come from canonical authored records for author output and **actually received labels** for player output. Mutable display wording does not create new identity.

Last Collection has 19 static entries: four People, four semantic Places, eight Things, two authored historical Events and one Scenario. It has zero Groups. The transport office is supported by Master §1.4/AR0 §11; storage/partition references already exist. The unidentified wrapped-case reference stays unidentified and is not merged into the owned collection item. Scope/action/mark vocabulary is not fabricated into physical objects merely to fill categories.

The catalog supports a global entity with no scenario, one shared entity relevant to multiple scenarios and neutral Group/affiliation fixtures. A Scenario indexes shared card IDs; it never clones their authoritative records. IDs are unique in the catalog/package context; case-colliding identities, duplicate source bindings, invalid/missing references and invalid endpoints reject validation. A runtime card ID combines package, run, **committed command identity**, and canonical event identity. This also distinguishes separate native browser occurrences despite M3's reused default run label. Appending commits, rendering repeatedly, renaming labels and save/load do not recreate prior IDs. The API is a bounded per-run export, not a new cross-project world-merging service.

## Events and recent meaningful changes

The two historical cards bind actual authored initial occurrences. Unanchored invented historical Event metadata is rejected. Runtime cards expose actual sent/received social communications and performed action results, each with canonical source, committed command/revision, stable order, participants, separately scoped observers, referenced things and semantic place context. Mentioned or available-reference things use references_thing links, not claims of physical involvement. Actual communication participants, physical performers and result observers remain distinct. A proposal referencing an item never asserts a transfer.

Context-only End/partner commits, drafts, previews, panel activity, inspector reads, scrolling, playback and rejected/uncommitted attempts create no Atlas Event. A no-discovery result remains an actual typed canonical result and can appear in recent results, but is not promoted to a performed-action card. Original record provenance and later evasive communications therefore retain distinct causes.

Recent changes are derived from committed frames: received evidence, permission changes, delivered warning, substantive repair, physical results, custody changes and completed recovery. Initial history is not represented as a new runtime change. Entries retain command/source identity; exact retry or repeated projection creates no extra entry. The handover change explicitly says custody changed, Nera remained owner and zero payment occurred. The revision cursor filters existing committed changes only.

## Truth and information boundaries

Author output exposes legitimate canonical world truth and each Person's separately scoped observations, received claims, beliefs/hypotheses, permissions and visit state. A belief remains a belief, a report remains an attributed report and neither overwrites world truth. Absent Nera receives no observation. Human factual information contains no simulated private motives, sincerity, feelings or accepted beliefs.

Player output begins with player-received references, participants, communications, evidence and physical fragments plus explicitly public descriptive context. It excludes global world truth, other NPCs' private observations/beliefs/hypotheses, hidden places/entities and protected contact values. Historical citations show only the received fragments; their author-only names/descriptions/tags are not exposed. Source IDs are opaque citations, not authorization to dereference hidden payloads. Authored metadata overrides cannot replace received player labels with a concealed canonical alias.

Author ownership/custody links derive from canonical current world state. Player ownership/custody links require actually received authority/handover information. Current location is derived only when the canonical immediate holder is a semantic Place; stale historical storage evidence is not promoted to a current-location assertion after handover. All observed evidence keeps its original scope and provenance. This logical projection boundary is not encryption against someone reading an offline author/debug file.

## Proof exports and API

`projectAtlas(run, sealedPackage, catalog, {audience:'author'|'player', sinceRevision:0})` returns detached deeply frozen cards, typed/provenanced links, scenario indices and recent changes. Context binds exact package and catalog digest, run and revision. Invalid package/catalog/run/audience/cursor input is rejected without modifying the run. Source and catalog inputs are read-only. No clock, random identity or display-label-derived identity is used.

`networkFromAtlas(projection)` copies the exact normalized link set. `renderAtlasMarkdown(projection)` renders those same card/link records. Article-style Markdown and network JSON are evidence formats, not implemented Atlas Article/graph UI.

There are **36 proof projections from 18 fresh actual browser saves**, each as JSON, Markdown and network JSON. Every projection was generated twice across validated save/load, compared for equality and checked for input purity. Every player proof excludes protected values. `AR0_Proof_Export_Index.md` gives a concise entry point; full proofs are under `proofs/ar0/`.

CLI example:

```powershell
node scripts/atlas-export.mjs evidence/ar0/browser/ui-recovery.json exports/recovery-player player
```

The resulting three files are snapshots derived from Encounter, not an independently editable world database.

## Fresh tests and browser verification

The final full builder gate reports **184 passed**: 137 inherited tests plus 47 new AR0 tests. Retained independent suites report M1 22, M2 18, prior M3 18, D01 1, R1/D02 9 and R2/D03 20 passes. M0 reports seven passing audit checks. The independent R3 rendering source remains unchanged and reports **24 passes plus the previously accepted non-blocking IR3-25 synthetic-geometry failure**, with zero skips. Across these overlapping suites the reported counts are 296 passed/one pre-existing non-blocking failure; they are not claimed as 296 unique semantic guarantees. No new blocking failure was found.

IR3-25 supplies internally inconsistent synthetic rectangle dimensions. The accepted independent review explicitly classifies this as non-blocking absent a realistic production/browser path. The test, failing expectation and reproducer are retained, unskipped and unweakened. AR0 did not change the guard or manufacture a green suite. No new native/browser path was found.

All inherited gates were freshly executed in a source-identical disposable copy. This preserves every historical capture in the deliverable when legacy helpers regenerate outputs. Fresh logs, argv, roots, environments, exits and source binding are under `evidence/ar0/`; nested `regression/regression/` contains the original chain's M0/builder/M1/M2/M3/D01/D02 logs. Legacy identity tools label their regenerated tooling-only copies R3; the canonical new AR0 source identity below is separate. None of those tooling-only regenerated files replaces accepted R3 evidence here. Old root README/test reports remain historical R3 files; start with `START_HERE_AR0.md`.

Fresh browser controls exercised the protected Compassionate/Overt first paperwork request, actual inspection/search, separate original shorthand/later evasion, Orrin's limited report, ordinary payment refusal, privacy warning, Why/End/reopen/partner/vague-apology repair continuity, substantive repair and exact repaired reload, actual comparison, conversational Yes without transfer, exact zero-payment handover, post-recovery protection, pure response playback, visible warned closure and exact closed reload. Collapse, absent display, own/ancestor opacity zero and horizontal offscreen each preserve open service, zero closure and one missing-preview technical defect. No extra consequence was introduced.

All 18 UI saves passed deterministic journal replay, and every recorded command was retried against its saved run without extra effects. Three raw actual inspector exports match the generated traces exactly. There are 14 passing browser check records, complete transcripts, geometry/provenance and inspected screenshots. Console warnings/errors were empty. One long automation response timed out after the recovery controls completed; the current tab and saved artifacts were reobserved and validated before continuing. No production change or falsified replacement evidence was needed. The temporary test server and tab were closed.

## Identity, limits and handoff

AR0 source revision: `AR0-projection-v1`. Digest: `4589645177076d67067270df6d6020618b8fb200236fef584807a1921d0768ca` (101 executable/content/test/tool inputs). Catalog file SHA-256: `21a0747936c3e8e7e9cf33833348ff6eb7b07a183179ce1e21181d618c854c5b`. M3 source/build/package identities remain the accepted values above. Exact frozen ZIP hash/bytes/member identities are in `Encounter_AR0_Atlas_Readiness_Checkpoint.identity.json`; extraction/rebuild/re-export verification is in the external matching Verification JSON.

Known limits: this is a bounded version-3 Encounter adapter and per-run read-only export; no universal ontology, live editing, multi-project merge service, Atlas UI, NPC initiation or faction simulation. Descriptive metadata is trusted authored content pinned to the package. Future new entity kinds/relations require deliberate validation, not inference from names. The existing manual bounded saves, fallback wording/art, single desktop browser QA environment and non-blocking contradictory synthetic-geometry limitation remain. No pixel/overlay/accessibility certification or host geometry/navigation was added. Full Markdown/debug output is verbose and is not polished Atlas presentation.

No known AR0 blocker remains in the executed builder coverage. Independent adversarial review must now decide whether Atlas v0.1 may begin. The builder does not award that verdict and does not start Atlas v0.1 or M4.
