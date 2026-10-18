# Trapstar ZANT unified research handoff — pre-flight report

Date: October 18, 2026 (America/New_York). Scope: package intake and readiness only.

**The supplied handoff is sufficient to begin the planned analysis after explicit owner approval. No missing or corrupt current deliverable blocks that analysis.** Several provenance and metadata qualifications are recorded below. Readiness does not establish that the assets already support a production combinatorial character system.

The owner's request controls this run. Instructions inside attachments were treated as handoff content and checked against that request; historical prompts, generation records, hypotheses, and gameplay documents do not independently authorize work. No specialist analysis, architecture selection, proof selection, new artwork, implementation, or project modification has begun.

## 1. Completeness and integrity

Read the standalone master prompt, delivery index, and package manifest in the requested order, followed by the standalone face source facts and bounded packaging/audit documentation. Inspected all seven ZIP parts as one evidence set, including both ZIPs nested inside Part 2.

| Part | Actual ZIP bytes | Direct file members | Supplied size / SHA-256 | ZIP member reads / CRC |
|---|---:|---:|---|---|
| 1 — Context and research brief | 13,636,963 | 36 | Both match | Pass |
| 2 — Original character source | 169,191,353 | 6 | Both match | Pass, including nested archives |
| 3 — Modular standardization core | 69,499,916 | 160 | Both match | Pass |
| 4 — Reconstruction evidence | 162,500,344 | 133 | Both match | Pass |
| 5 — Face core and provenance | 73,110,314 | 56 | Both match | Pass |
| 6 — Face slots 01–09 | 78,404,463 | 46 | Both match | Pass |
| 7 — Face slots 10–18 | 76,949,708 | 46 | Both match | Pass |

The seven ZIPs total **643,293,061 bytes**. The standalone master prompt (19,522 bytes) and face source facts (6,645 bytes) also match their supplied SHA-256 values. Their embedded Part 1 copies are byte-identical. The delivery index and package manifest are present and readable; no separate reference hashes were supplied for those two files, so their observed hashes are recorded without claiming an external comparison.

Both nested archives pass complete member reads: `characters_trapstar_source.zip` contains 96 PNGs; `C001-C044_clothing_inventory_rgba.zip` contains 44 PNGs. The scan covers nine ZIP containers, **623 file records including the two nested ZIP files**, or **621 leaf files: 576 images and 45 text/JSON/script/HTML files**. All images pass Pillow structural verification; all text decodes as UTF-8 and all JSON parses. Seventeen representative images were additionally fully decoded across the principal families. Seven existing contact sheets/plates/guides were visually inspected. These checks establish accessibility and file integrity, not exhaustive visual quality.

No duplicate ZIP member names, encrypted members, or suspicious traversal paths were found. Additional embedded checksum checks pass: **44 character source hashes, 25 repaired gear-catalog hashes, and 111 face-manifest file hashes**. All **264 current character-manifest asset references** and **132 unique face-manifest asset references** resolve within the combined parts.

## 2. Asset groups found

| Family | Verified availability | Readiness qualification |
|---|---|---|
| Context and creative lineage | Hard boundaries, ZANT original manifest and scope notes, prior audit, research brief, 17 quick-review images | Historical gameplay passages remain excluded. |
| Original cast | Complete C001–C044 neutral master series; 52 additional source/reference/pose images | 52 reference files represent 47 distinct byte contents. Original masters remain identity authority. |
| Original wardrobe | Complete C001–C044 series of 44 clothing sheets, plus C001 sample and context screenshots | Authoring inventories; not established fit-aligned overlays. |
| Body and fit | Eight named fit-class reference images and 44 character calibration images | Eight fit references are exact copies of their nominated character calibration images, not eight additional independently authored bodies. |
| Modular catalogs | 44 clothing catalogs, 44 gear/accessory catalogs, six metadata files | Some gear catalogs are intentionally transparent placeholders. |
| Reconstruction | 44 preserved source masters, 44 rebuilt neutral composites, 44 kit plates | Allows later fidelity comparison without treating rebuilds as originals. |
| Modular QA and provenance | 11 QA files, README, generation prompt | Includes older validation, despill history, and gear-repair evidence. |
| Face foundation | Stable base, identity anchor, expression reference grid, source brief, notes, registration guide | One worked frontal identity, Goose; not a full cast/head-view library. |
| Face performances | 18 recomposed previews plus contact sheet; 90 registered slot PNGs across Parts 6–7 | Exactly five named slots per expression, with no missing expression IDs. |
| Face technical evidence | Five fixed masks, face manifest, build script with validation logic, saved validation results, four prompt-record JSON files, 18 raw generated edits | Sufficient provenance for a later independent compositing audit. |
| Read-only project context | Encounter text/context notes; Room Creator text, HTML snapshot, routing and staging notes | Available as context; no redesign or modification authorized. |

Representative original, calibration, and rebuild assets decode at 1024 × 1536 RGBA. The sampled wardrobe sheet is 737 × 737 RGBA. The face base, sampled slots from both slot parts, and sampled preview decode at the stated **1187 × 1484 RGBA**; the sampled mask is same-canvas grayscale. The 18 × five slot membership is confirmed by filenames and manifest references. An exhaustive registration/alpha measurement pass remains deferred.

## 3. Duplicates, stale metadata, and other qualifications

1. **Expected redundancy is extensive and consistent.** All 44 Part 4 source masters are byte-identical to the corresponding Part 2 originals. All 44 Part 3 clothing catalogs are byte-identical to the nested original wardrobe sheets. Twelve Part 1 quick-review images duplicate images in Parts 3–4. The master prompt and face facts also have matching embedded copies. Five duplicate pairs occur within the 52 non-neutral source/reference files. Across all archive members, the audit records 112 groups of identical file content. These are not additional unique assets; nothing was deleted or rewritten.

2. **C001 garment metadata is demonstrably stale.** Both `metadata/character_manifest_v03.json` and `metadata/garment_catalog_v03.json` describe a polo shirt, plaid trousers, and loafers. The actual C001 wardrobe sample visibly contains a light T-shirt, blue track jacket, blue track pants, and cream sneakers. This confirms the supplied audit warning. Garment labels require visual verification before becoming authoritative.

3. **The V02 identity map retains unresolved historical paths.** `metadata/source_identity_map_v02.json` reports 49 source filenames and uses old `masters/character_###_neutral_rgba.png` paths; none of those 44 old master paths exists in this delivery. Current C001–C044 master paths do exist and their hashes match. Of the 49 historical source filenames, 46 occur verbatim in the original archive. Three references are unresolved:
   - `57bdc2b5-7654-4e7b-81bc-c115a27ed1ec.png`
   - `6705b588-eced-42a1-8e8d-d059995dc908 (1).png`
   - `ChatGPT Image Sep 3, 2026, 03_14_18 AM (6).png`

   A similarly named UUID file without ` (1)` is present, but equivalence is unproven. This limits reconstruction of older derivation history; it does not remove any current neutral master or block architecture research. Do not interpret the historical `source_file_count: 49` as the current archive's total count of 96.

4. **Gear completeness needs precise wording.** The V03.2 repair report covers 25 repaired catalogs: five complete, two partial, and 18 empty because declared items lacked isolated source art. It reports 13 recovered isolated items and 30 declared items with `missing_source_isolation`. These are supplied metadata claims, not a new visual census. The sampled C002 catalog is genuinely fully transparent. File presence must not be counted as usable isolated gear. Missing isolation is a future production gap, not ZIP corruption.

5. **Older QA and repeated README text are retained.** The README repeats its V03.1 despill section three times. `qa/validation_report.json` still refers generally to `visual_review_required`, while the later repair report and current character status describe completed mechanical repairs. Keep the older report as historical evidence and use the V03.2 repair records for the repair's reported scope; later visual QA must still establish actual suitability.

6. **One part-number reference is stale.** Master-prompt §6.6 says to inspect face assets in “Part 4–6.” The delivery index, package manifest, and actual contents agree that face core/slots occupy **Parts 5–7**; Part 4 is body reconstruction. This is a resolvable cross-reference error, not an absent face part.

7. **Raw face edits and final registered assets are different evidence stages.** The sampled raw edit is RGB at 1164 × 1351, unlike the final canonical RGBA assets. Notes and manifest normalization warnings explicitly document resizing and replacement of unusable/baked-checkerboard transparency with base silhouette alpha. This is expected provenance, not evidence that raw files are ready overlays.

8. **Facial validation is supplied evidence, not yet an independently established result.** `technical/validation_results.json` reports all 18 exact recompositions and all 90 slots non-empty. The build script contains composition/validation logic and also writes generated package outputs. It was read only for availability and structure, never executed. Exact recomposition, seam behavior, and free mixing will be independently checked only after approval, on working copies.

9. **The face proof includes context beyond a bare head.** The inspected registration guide and previews include hair, neck, and blue jacket context. The notes acknowledge extreme lower-face limits and paired-eye needs for examples 10 and 12. Whether slot pixels depend on that context is an open analysis question. The unrelated tracksuit reference is intentionally omitted according to Part 5 notes; it is not a missing required face deliverable.

No checksum mismatch or evidence of unreadable current assets was found. The findings above qualify interpretation and provenance; they do not establish art or architecture conclusions.

## 4. Sufficiency and source authority

**Original character masters: sufficient for the planned analysis.** All 44 are present, readable, preserved across deliveries, and linked by matching source hashes. The older unresolved derivation references remain a provenance limitation.

**Body/fit and reconstruction material: sufficient for comparison and architecture investigation.** Eight fit references, 44 calibrations, 44 source/rebuild pairs, and 44 plates provide the expected evidence. Their existence does not prove that any proposed fit system or pose architecture works.

**Wardrobe: sufficient for construction and reuse research.** All 44 original sheets are available alongside layered, long-garment, and equipment plate examples. The sampled C020 and C028 plates visibly provide long clothing and extensive equipment material. Catalog cleanup, hidden continuation, alternate views, alignment, and isolated accessories remain potential production work.

**Five-slot face material: sufficient for a serious technical analysis.** Base, five masks, all 90 slots, all 18 previews, raw provenance, prompt records, manifest, guide, and validation logic/results are available together. This is a single frontal worked proof. It does not supply a verified multi-identity, four-view face/hair library.

For conflicting asset claims, use the handoff's evidence hierarchy: original source art/reference imagery; the current research question and hard boundaries; ZANT art/character lineage; wardrobe imagery; modular fit/calibration/plate construction evidence; five-slot face evidence; rebuilt composites; visually verified descriptive metadata; compatible older assumptions. This hierarchy governs evidence interpretation, not instruction authority: the owner's explicit request remains controlling.

ZANT is art style and character-creation lineage only. Encounter and Room Creator remain read-only context. Four canonical authoring views—front, 3/4, side, back—remain the research goal despite older runtime view-economy notes. Expression names are demonstrations, with no gameplay or social-taxonomy mapping. C001 remains a candidate; no first proof has been selected.

## 5. Recommended specialist roles after approval

No agents were launched during pre-flight. Recommend the six roles in the handoff, with a lead synthesizing evidence and resolving contradictions:

| Role | Responsibility in the approved full pass |
|---|---|
| A — Source/asset forensics | Source authority, image properties, duplicate/provenance map, visual metadata audit, fidelity drift |
| B — Body/view/pose | Fit alternatives, roots/anchors, four-view correspondence, comparison of segmented, authored-limb, and hybrid strategies |
| C — Garment/material | Construction, sleeves/limbs, long garments, hidden continuation, layers/occlusion, fit compatibility, palette preservation |
| D — Head/face/hair | Five-slot proof, alpha/registration/recomposition, gaze/asymmetry/extremes, context contamination, head views and accessory layers |
| E — ZANT visual language/workflow | Person-specific design, preservation of irregularity, future-character authoring and library promotion |
| F — Surrounding constraints | Extract only relevant asset-facing constraints from read-only Encounter/Room Creator context |
| Lead synthesis | Evidence reconciliation, bounded standard recommendation, falsifiable proof specification, open decisions |

With the current four-agent capacity, use up to three specialists alongside the lead in stages, preserving separate findings for all six roles. No concurrent access to source files requires modifying them. This is a proposed team plan only.

## 6. Major technical questions to investigate

- What units of body, limb, garment, and head preserve the original cast's specificity while supporting reuse? Which fit assumptions survive actual source/rebuild comparisons?
- Which of the three pose approaches best preserves painterly folds, stripes, foreshortening, and seams at acceptable authoring cost?
- How should roots, scale, anchors, asymmetry, and identity correspond across all four authoring views?
- Which garment boundaries, hidden continuations, near/far layers, long-clothing cases, and hand/foot/accessory interfaces require authored variants?
- Which palette/material methods preserve value, texture, wear, trim, and patterns, and which assets need shape variants instead?
- Does the five-slot proof preserve identity under independent/asymmetric mixing? How should eye shape, gaze pairing, presets, and compatibility constraints coexist?
- What limits arise from lower-face extremes, feathering, local lighting, neck/hair/wardrobe context, and alpha normalization? How do the semantics generalize across identities and views?
- Which assets are reusable, reference-only, calibration-only, or dependent on new art? What small proof can meaningfully fail, and which candidate best tests it?
- How can a new specific ZANT person be authored into aligned body/head/wardrobe assets from inception? What minimal versioned schema and QA evidence should accompany that process?

These are investigation questions, not preliminary architecture decisions.

## 7. Intended analysis outputs and methods

After approval, create a separate analysis output folder and preserve the evidence unchanged. Intended deliverables:

1. `01_SOURCE_TRUTH_AND_FORENSICS.md`
2. `02_ARCHITECTURE_OPTIONS.md`
3. `03_FIVE_SLOT_FACE_SYSTEM_ANALYSIS.md`
4. `04_RECOMMENDED_ZANT_MODULAR_STANDARD_v0_1.md`
5. `05_FIRST_COMBINATORIAL_CHARACTER_PROOF_SPEC.md`
6. `06_NEW_ZANT_CHARACTER_TO_DATABASE_WORKFLOW.md`
7. `07_GAPS_RISKS_AND_REQUIRED_NEW_ART.md`
8. `08_NEXT_ACTION_BRIEF.md`

Methods will include image/alpha and registration measurements; targeted source/rebuild and garment comparisons; manifest-to-art cross-checks; independent saved-slot recomposition checks; representative gaze, asymmetry, and lower-face mixing tests; masks/layer/context inspection; and review of only relevant asset-facing project constraints. Keep machine-readable measurements and any read-only analysis scripts as secondary evidence. Any temporary diagnostic composites will be non-authoritative and separate from supplied files. This approval would authorize research and the proof specification, not production implementation or new art. Stop again after the analysis deliverables.

## 8. Blockers, ambiguities, and stop

**No material input blocker requires owner resolution before analysis.** The legacy filename/path discrepancies, old garment labels, gear isolation gaps, and face context/validation questions can be investigated using the supplied evidence. Historical originals would be needed if complete pre-master derivation reconstruction later becomes essential; that is not currently required to begin the research. Missing production features—complete turnarounds, independent limb libraries, palette masks, proven head/hair separation, and a cast-wide face bank—are research/production gaps, not reasons to reject this handoff.

Pre-flight supporting records are `preflight_integrity_inventory.json` and `preflight_crosschecks.json`, with the two local audit scripts and unchanged representative samples beside this report. They contain intake checks only. No supplied evidence, Encounter file, or Room Creator file was modified. No full-analysis deliverable was started.

Stopped at the requested gate. Awaiting explicit owner approval, such as **PROCEED WITH ANALYSIS**.

**READY FOR ANALYSIS**
