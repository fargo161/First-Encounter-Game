# Five-slot face system: evidence, limits, and recommended contract

Analysis date: 2026-10-18. Scope: supplied evidence and diagnostic recompositions only. No source was edited, no supplied builder was executed, and no new final artwork or production face implementation was created. ZANT is used only as art direction and character-creation method. Encounter and Room Creator remain read-only context.

## Recommendation

**Retain the five anatomical semantics, revise the production asset contract, and make geometry view-specific.** An approved identity/view head package is the canonical unit. Its slots are registered performance patches belonging to that head revision, skin treatment, and view; they are not interchangeable facial organs across people. Front and three-quarter can implement all five slots. Side can implement the visible brow, visible eye, and lower-face region while recording the hidden anatomical slots. Back normally implements no facial overlays.

The delivered Goose package is a serious and reproducible **frontal portrait compositing proof**. It demonstrates stable registration, localized replacement painting, complete presets, useful asymmetric components, and paired gaze. It does **not** establish unrestricted independent mixing, a wardrobe-independent head, clean final alpha, silhouette-changing expressions, or four-view facial correspondence. Exact recomposition confirms storage/compositing consistency; it does not certify artistic quality.

## Evidence and independent method

The face source root is `work/ZANT_analysis_sources/face/FIVE_SLOT_FACE_SYSTEM_REFERENCE/`. The immutable source authority for character identity remains the original character art, above these derivative face assets. The supplied source brief and prompts were read as provenance, not as authorization to generate another batch.

Read and inspected: `references/source_brief.md`, `references/goose_idle_identity_anchor.png`, `references/expression_reference_18.jpg`, `docs/GOOSE_EXPRESSION_BATCH_NOTES.md`, `docs/goose_slot_registration_guide.png`, the base, all 90 registered slots, all 18 saved previews, all 18 raw generated edits, all five masks, `manifest/goose_expression_manifest.json`, `technical/validation_results.json`, `technical/build_goose_expression_batch.py`, and prompt records.

The analysis scripts independently load and decode every image; verify the manifest's hashes; reproduce documented registration and slot extraction without importing the supplied builder; composite reopened saved slots; compare all four channels with NumPy; measure masks, overlap, alpha, and hidden RGB; and save explicitly diagnostic mixtures. Pillow 12.3.0 and NumPy 2.5.1 were used. The scripts write only inside this analysis evidence folder.

Reproducible secondary evidence:

- [Analysis script](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D/analyze_face.py>), [complete measurements](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D/face_measurements.json>).
- [Supplemental alpha/context script](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D/supplement_face.py>), [supplemental measurements](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D/supplement_face_measurements.json>).
- [All 18 face crops](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D/all_preview_face_crops.png>), [raw/preview extreme comparisons](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D/extremes_normalized_vs_preview.png>), [eight diagnostic mixtures](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D/diagnostic_mixes_contact.png>), [critical interface crops](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D/critical_interface_crops.png>).

## What the actual package establishes

| Check | Independent result | Interpretation |
|---|---|---|
| Base | One 1187 × 1484 RGBA image | Canonical frontal portrait space, not universal ZANT resolution |
| Slots | 90/90 readable, nonempty, full-canvas RGBA | 18 demonstrations × five anatomical slots; no manual per-expression positioning |
| Previews | 18/18 readable, full-canvas RGBA | Saved composites, not independent target paintings |
| Masks | Five readable L images, full canonical canvas | Fixed per-slot footprints across this one head |
| Manifest checksums | 111/111 match | Covers base, 90 slots, 18 previews, guide, and contact sheet; its own list does not hash raw edits, masks, scripts, or prompt records |
| Saved-slot recomposition | **18/18 exact in every RGBA channel**, zero maximum error | Confirms the supplied exact-recomposition claim independently |
| Independent extraction | **90/90 exactly match** normalized donor RGB and mask-multiplied alpha | The saved slots follow the supplied construction method |
| Base construction | Exact RGBA equality to independently normalized raw expression09 | The stable base is the neutral generated portrait, not the original full-body master or a bald underplate |
| Outside five-mask union | Exact equality to base for all 18 | The compositing method constrains changes outside the registered regions |
| Composite alpha across expressions | Identical across all 18, same nonzero support as base | Gross silhouette support stays fixed |
| Composite alpha versus base | **Not identical** for any of the 18 | Source-over overlays accumulate alpha; “immutable base” means its stored pixels are unmodified, not that output alpha equals base alpha |

The base SHA-256 is `AB44A82184C7450EBFD130A1A0186521A9E10A1F0A69D2E37B8D8624AAB91F12`. This is identity-specific provenance, not an architectural requirement.

Construction is **full-expression edit followed by masked extraction**, rather than five independently painted slot inputs. Each expression's five layers inherit one normalized full-composite donor. The prompt records explicitly request a full composite; the builder makes its five patches afterwards. This explains why complete presets agree well internally while cross-expression donors can contain incompatible neighboring skin or feature positions. Among the 17 nonneutral edits, 608,554–612,318 visible pixels outside the slot union differ in RGB from the saved preview (an exact inequality count, not a perceptual drift score). Recomposition deliberately restores base pixels there.

Provenance metadata also retains historical absolute paths under `Documents/ChatGPT/prototype/artifacts/goose_expression_batch` and `.codex/generated_images`; they are historical records, not missing runtime dependencies. The base prompt mentions `references/goose_tracksuit_reference.png`, which is absent from this face subtree; the supplied identity anchor and the original character corpus remain available, so this limits exact historical prompt-input reconstruction rather than blocking current image analysis. Prompt04 records selected attempt2, and prompt10 records a selected retry; discarded attempts are not supplied and should not be assumed audited. These records do not override actual saved rasters.

## Registration, mask geometry, and draw order

The delivered order is `BASE_HEAD → LEFT_BROW → RIGHT_BROW → LEFT_EYE → RIGHT_EYE → LOWER_FACE`. Anatomical LEFT appears on image-right in the unmirrored front. Bounding boxes below are half-open pixel bounds, matching Pillow `getbbox`; the manifest uses x/y/width/height and the builder's rectangle endpoints are inclusive.

| Slot | Actual mask support bbox | Mask support pixels | Actual nonzero slot-alpha pixels | Declared feather |
|---|---|---:|---:|---:|
| LEFT_BROW | [577,405,908,576) | 56,089 | 54,212 | 20 px |
| RIGHT_BROW | [280,405,611,576) | 56,089 | 54,189 | 20 px |
| LEFT_EYE | [584,515,888,706) | 57,208 | 56,143 | 20 px |
| RIGHT_EYE | [300,515,604,706) | 57,208 | 56,182 | 20 px |
| LOWER_FACE | [285,635,903,1001) | 221,468 | 195,037 | 24 px |

Each slot's alpha geometry is fixed across all 18 donors. The reduced nonzero slot-alpha counts reflect multiplication by the base-derived portrait silhouette. The lower face contains 128,264 fully opaque mask pixels and 93,204 partial mask pixels; this is broad replacement painting, not a mouth cutout. The brow masks each contain 36,620 partial pixels and eye masks each contain 35,730.

These masks **overlap materially**. A brow and its same-side eye share 18,079 nonzero mask pixels, including 5,029 where both masks exceed half opacity. Each eye and lower face share 20,624, including 6,135 where both exceed half opacity. The opposite eyes overlap 3,188 pixels around the nose bridge, at low weights. Consequently, slot draw order changes which donor wins, and semantic independence cannot be inferred from the file count or rectangular registration.

[Mask boxes over the actual base](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D/mask_boxes_on_base.png>) show why these rectangles must remain Goose-specific. Future heads need anatomy-shaped per-view masks and an explicit neighbor contract. A slot may carry necessary local wrinkle/skin context; it must not silently overwrite another slot's defining feature.

## Normalization and alpha: verified behavior and remaining defects

Raw edits comprise 17 RGB images and one RGBA neutral09. Four raw rasters need slight dimension normalization: three are 1166 × 1349 and one is 1164 × 1351; the other 14 are 1165 × 1350. The builder uses centered `ImageOps.fit` to 1165 × 1350, then pastes at (11,67) on 1187 × 1484. This establishes a raster frame; it is not anatomical landmark registration.

The supplied [builder lines 86–114](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/work/ZANT_analysis_sources/face/FIVE_SLOT_FACE_SYSTEM_REFERENCE/technical/build_goose_expression_batch.py:86>) detect usable alpha only when an A band contains a value below 255. For the 17 RGB edits, it copies the base alpha and substitutes base RGB where that alpha is below 250. All 90 saved slots exactly reproduce this documented result. The raw edits remain intact.

This recovers a true transparent cutout container, but cannot guarantee that donor content fits the base silhouette. White strips are visibly present inside the retained silhouette in several delivered previews: conspicuous examples are 03, 08, 10, 11, 16, and 17 near ears, cheeks, hair edges, or collar transitions. The [extreme comparison sheet](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D/extremes_normalized_vs_preview.png>) shows source matte/alignment mismatch surviving into registered regions. Expression08 contains 1,121 bright changed candidate pixels inside LOWER_FACE under the explicit diagnostic threshold recorded in supplemental JSON; visual inspection, not that threshold, identifies the contour problem. Alpha transfer does not reconstruct missing skin or remove baked matte colors from otherwise retained RGB.

The base is mostly slightly translucent even inside the portrait: 672,492 pixels have alpha253 and 260,655 have alpha252; only 324 pixels are alpha255. Applying the neutral09 slots changes **310,208 alpha pixels while changing zero RGB pixels**, with maximum alpha delta67 at partial boundaries. The same alpha-change field occurs in all 18 previews. Dominant near-opaque face changes are small, but edges and layer accumulation require explicit treatment.

For a future normal expression package, composite the expression colors under a separately approved head silhouette and apply that silhouette once, or use an equivalently verified replacement-patch compositor. This is a proposed production policy, not a change made here. Keep an explicit straight/premultiplied-alpha convention and verify filtered edges on light, dark, and textured backgrounds. Do not erase intentional antialiasing or simply threshold every source pixel.

All saved slot files retain substantial RGB behind zero alpha: **763,674–904,822 hidden nonzero-RGB pixels per file**. This follows `layer = image.copy(); layer.putalpha(...)` in [builder lines 131–134](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/work/ZANT_analysis_sources/face/FIVE_SLOT_FACE_SYSTEM_REFERENCE/technical/build_goose_expression_batch.py:131>). Correct source-over composition ignores those pixels; unsuitable filtering, crop/atlas tools, or alpha conventions can expose them. Preserve the originals; any later export derivative needs edge-safe processing and independent QA.

## Recomposition validator: real pass, incomplete test

The supplied [validator lines 263–269](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/work/ZANT_analysis_sources/face/FIVE_SLOT_FACE_SYSTEM_REFERENCE/technical/build_goose_expression_batch.py:263>) computes an RGBA difference and calls `difference.getbbox()` without disabling alpha-only behavior. In the Pillow used for this analysis, that call can return `None` when only RGB differs. The analysis script demonstrates the blind spot without touching a source: an in-memory one-pixel RGB mutation at (713,133), with unchanged alpha, returns `None` through the supplied test; an all-channel comparison and `getbbox(alpha_only=False)` correctly detect the difference.

**This flaw does not mean the delivered previews fail.** Our independent all-channel check establishes that all 18 actually pass. Future QA must explicitly compare all channels, verify expected file counts/hashes/dimensions, and include a negative control. The supplied changed-from-neutral count is a luminance threshold (`L > 3`), not an all-channel equality test, seam score, or identity test. Nonempty slots and exact preset recomposition do not establish unrestricted mixing quality.

## Actual visual coverage and extremes

All 18 saved previews were visually reviewed, alongside the supplied 18-cell photographic expression reference and the original Goose identity anchor. The names remain demonstration IDs, not an official emotion list or gameplay vocabulary.

| Evidence | What it demonstrates | What it does not establish |
|---|---|---|
| 01 / 03 | Broad painted open-mouth region includes teeth, tongue/interior, cheek and chin shading | Genuine external dropped-jaw silhouette; clean final boundaries in03 |
| 04 / 17 | Lower-face compression changes lips, chin tension, cheek folds | Independent neck deformation; full preservation of source chin silhouette intent |
| 08 | Inflated cheeks and lip compression within the common footprint | Expansion beyond the neutral head silhouette; white fringe requires repair in a derivative |
| 10 | Coherent paired upward lateral gaze and raised brow configuration | Head turn; independent reuse of the eye patch with every brow position |
| 12 | Matched inward/downward eye performance | Freely mixing its eyes with a lateral-gaze donor |
| 13 | Wide eyes and slack mouth inside fixed frontal pose | Source reference chin lift or pitch change |
| 18 | Authored uneven brow/eye/mouth performance retains recognizable identity | Every unilateral component combined with every other donor |
| 09 | Stable neutral RGB under overlays | Output alpha equality with base, or removable hair/clothes |

The package notes explicitly acknowledge clipping cheek inflation08 and normalizing the head-turn10/chin-lift13 cues. The actual raw/preview comparisons are consistent with an invariant silhouette treatment. This sacrifices some performance range in exchange for interchangeability. It is a defensible ordinary-state tier, provided it is named honestly.

Keep LOWER_FACE broad enough for mouth, lower nose where needed, cheeks, jaw, chin, and local shading. A floating mouth sticker would lose precisely the cheek/chin specificity these examples demonstrate. For genuinely silhouette-changing states, author a small **extended head set**: replacement head alpha, jaw/cheek/upper-neck transition artwork, affected neighboring slots, and accessory/hair compatibility. That set is an explicit override/group, not a sixth freely mixed universal slot. Do not let a general lower-face patch include a garment collar to hide its transition.

## Cross-slot mixing: tested structurally, visibly constrained

Eight diagnostic mixtures use only supplied pixels and the supplied draw order. They are evidence artifacts, not approved final expressions. Exact donor maps and per-overlap measurements are in `face_measurements.json`.

| Diagnostic | Donors, anatomical L/R | Visual finding |
|---|---|---|
| M1 | Brows05/18; eyes09/09; lower18 | Plausible deliberate asymmetry candidate; preserves identity; needs final-scale art approval |
| M2 | Brows09/09; eyes10/10; lower09 | **Neutral brows are visibly erased/attenuated** because later eye patches contain skin where the raised-brow donor's brows moved away |
| M3 | Brows09/09; eyes10/12; lower09 | Eyes direct attention inconsistently; registration alone does not create coherent gaze |
| M4 | Brows09/09; eyes12/12; lower09 | Convergence remains coherent, but brow/eye boundary ownership remains a QA obligation |
| M5 | Brows09/09; eyes01/01; lower08 | Deliberate closed-eye/cheek combination is readable; inherits08 contour defects and local skin-context changes |
| M6 | Brows03/03; eyes09/09; lower01 | Mixed tension is structurally possible; same-side eye overwrite weakens intended brow independence |
| M7 | Brows18/09; eyes15/09; lower18 | Useful wink/asymmetric-mouth candidate; validates why unilateral controls should remain available |
| M8 | Brows18/18; eyes13/13; lower17 | Readable unusual mixture; visible local transition/context risk remains |

The key falsification is M2: a mathematically registered swap can destroy the chosen feature. Each same-side brow/eye overlap contains 5,029 pixels where both masks exceed half opacity. Measured mean RGB donor disagreement in the worst overlap of M2 is 78.576 on a 0–255 scale. This directs inspection; it is not a calibrated seam or quality score. A high disagreement can be intentional performance contrast, while a low one can still be anatomically wrong.

Therefore do not expose the theoretical `18^5` combinations as a quality promise. Preserve known complete presets as a safe starting point, then admit reviewed mixes. Free authoring controls can create candidates, but export/promotion requires approval of the resulting specific combination or a demonstrated compatible family. Slot files are technically selectable; compatibility is a separate claim.

## Gaze, eye shape, presets, and compatibility

For v0.1 retain **baked eye-shape plus gaze assets**, grouped by a shared `gazePairId` and head/view revision. The existing evidence contains painted eyelid, iris, sclera, crease, and surrounding skin changes together; it does not demonstrate clean reusable eyeball layers. Do not invent a separate iris translation system for this painterly head on the strength of file registration.

Ordinary gaze selection chooses both eyes atomically. Allow deliberate exceptions such as one closed eye or an approved asymmetry. Expressions10 and12 should normally retain their eye pairs. Distinguish parallel lateral attention, convergence toward a near target, eye closure, and deliberate unilateral control as asset geometry/performance descriptions; assign no gameplay meaning.

Record `headRevision`, `view`, `semanticSlot`, anatomical side, local mask, skin/lighting revision, `shapeState`, optional `gazePairId`, `requiredCompanions`, `preferredCompanions`, incompatible neighbors, silhouette mode, accessory compatibility, provenance, and QA status. Complete presets are five-slot maps with their own QA status. Empty compatibility data means unreviewed, not universally valid. The [analysis-only contract example](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D/face_contract_example.json>) illustrates these fields without claiming a finished runtime schema.

Separate gaze sublayers may be investigated later on a deliberately authored eye package if close-up scale, painterly highlights, eyelid occlusion, and all permitted directions survive. That is an open proof question, not a dependency for the first proof.

## Context contamination: head, neck, hair, and wardrobe

The delivered `BASE_HEAD` visibly contains hair, ears, complete neck, white shirt, and blue tracksuit shoulders/collar. The actual lower slot also contains neck and collar: at source pixel (350,950) the blue collar has lower-mask value230; at (840,950) value223; at neck pixel (600,970) value178. Ear pixels (310,660) and (875,660) receive low mask weights2 and3. The broad brow rectangles also reach hair at the sides. These are sampled visual identifications, not a computed anatomical segmentation. [Base and isolated visible slots](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D/base_and_slots.png>) make the dependency clear.

Accordingly, use this portrait package unchanged as reference/control. It is not directly a removable head for arbitrary wardrobe. A production derivative needs a wardrobe-free identity head and a separate neck/attachment contract; source art must remain preserved. The authored neck transition must match the head's skin palette/light and the body's neck socket. Use a fixed skull/neck attachment anchor rather than letting a changing chin define placement.

Recommended independent layers, with view-specific occlusion rules:

- Hair/hat rear parts behind skull and neck; skin skull/ears underplate; registered face performance patches; expression-aware facial hair; front hair/hat portions; glasses and accessory pieces split where they pass behind ears or under hair.
- Neck underplate and wardrobe collar remain outside face performance regions. A front collar may occlude neck skin; expression patches must not carry collar pixels.
- Removable hair needs an approved skin/skull underplate. Preserve character-specific hairline, volume, ear exposure, and asymmetry. A hat is a compatible fit/occlusion variant, not a generic scale operation on every hairstyle.
- Static stubble may remain in an identity skin treatment if it does not need independent selection. A moustache/beard crossing lips or jaw deformation needs lower-face-linked variants or a jointly authored package, avoiding a stiff sticker over an open mouth.
- Glasses need frame/lens/temple occlusion and an explicit set of compatible head views/expressions. Brows and eye patches must not repaint over frames. Earrings and sideburns need anatomical-side identity under mirroring.

The exact stacking of hat brim, fringe, glasses, and ears cannot be universal. Store per-view layer/occlusion declarations rather than impose a single total order that ignores anatomy.

## Four-view head strategy and identity

Author front, three-quarter, true side, and back as separate coherent drawings tied to the same person. Preserve skull volume, ear/nose/jaw placement, hair mass, hairline, skin treatment, scale, and neck attachment; use shared semantic landmarks with per-view coordinates. Do not rotate or stretch the frontal portrait into another view.

| View | Minimum coherent contract |
|---|---|
| Front | Full five registered slots; anatomical left/right explicit; paired eyes and approved asymmetry |
| Three-quarter | Full semantic slots where visible; narrower far eye/brow masks; view-specific nose/cheek occlusion and lower-face geometry |
| Side | Visible-side brow and eye plus lower face; hidden anatomical slots explicitly unavailable; silhouette-changing mouth/nose/chin states need profile artwork |
| Back | Head/hair/ears/neck silhouette; no face overlays required |

A minimal proof should preserve all four authored bases, prove actual front recombination, and include one nonneutral three-quarter preset to challenge view-space registration. Side needs at least a neutral reduced implementation declaration; back needs no artificial face workload. Expanding all facial permutations across views before the front proof succeeds would multiply unverified work.

Permit only reviewed head/body facing combinations. A front face pasted on a true-side body is not evidence of a successful view system. Define the neck seam and acceptable facing combinations; author a transition when a combination is needed. Mirroring is opt-in per head, hair, accessory, and view. Anatomical labels follow the person, not image coordinates; asymmetric hair parting, scars, ears, stubble, and accessories may require a separate opposite-facing drawing.

Goose's stable features are recognizable across the supplied batch, but this derivative portrait is more polished and differently cropped than its original full-body identity anchor. An owner art review against the original master, at both head inspection scale and intended body display scale, remains necessary. Automated similarity is not identity authority.

## First proof contribution and acceptance gates

Do not automatically select Goose or C001 solely because Goose already has facial evidence; the body/wardrobe evidence determines the lead proof identity. Reuse Goose as an unchanged control for saved recomposition, gaze-pair behavior, and the demonstrated mixing failures.

For the chosen proof identity, specify a small wardrobe-free head package: four neutral view bases; full front five-slot coverage sufficient for neutral, deliberate uneven brow/mouth, matched lateral gaze, one-eye closure, and one bounded open-jaw **or** cheek stress; and one three-quarter complete performance preset. Test a deliberately unpaired gaze as a rejected combination. These are test cases, not emotion categories, and do not require all18 Goose names.

The proof passes only when a reviewer can change the selected brows, eyes, and lower face independently in approved combinations without losing identity, erasing neighboring features, repainting hair/clothes, producing a bright matte strip, or changing placement. A bounded extreme must retain believable cheek/chin/neck anatomy. Four-view scale and attachment must remain coherent on the same body. A valid rejection of an incompatible mix is part of the contract; silent acceptance of every mix is a failure.

Before promoting any head package, automatic QA should check: readable files and expected count; versioned hashes/provenance; correct per-view canvas and anchor registration; anatomical-side labels; nonempty required slots; alpha support outside declared editable regions; hidden-RGB/export policy; all-channel saved recomposition with a negative control; intended silhouette invariance for ordinary states; companion/gaze constraints; and valid asset references. Visual QA must cover light/dark/textured backgrounds, 1:1 inspection and intended display scale, all complete presets, selected cross-slot stress combinations, wink/asymmetry, paired and rejected unpaired gaze, neck/collar/hair/accessory occlusion, extremes, and original-master identity correspondence.

**Unproven until a later owner-approved proof:** anatomy-shaped masks solving the M2 overwrite without new seams; multi-view identity and expression correspondence; an extended-jaw silhouette group; removable hair/facial-hair/glasses under deformation; palette changes across skin plus patches; and acceptable authoring cost. These require new bounded art and testing after owner review, not additional claims from the existing frontal Goose rasters.

## Goose-specific facts versus general standard

Generalize: immutable identity source/reference, per-view registration, five anatomical performance semantics where visible, broad lower-face painting, deliberate asymmetry, paired gaze, approved presets plus reviewed mixes, explicit compatibility, source preservation, all-channel validation, and visual identity/seam QA.

Do not generalize: Goose's identity, hair, tracksuit, 1187 × 1484 canvas, exact rectangles/feather widths, the base's alpha252/253 distribution, eighteen names, generated-image normalization, fixed external silhouette for every performance, or portrait clothing baked into a head. The delivered proof supports further investigation of this methodology; its current masks and matte artifacts require revision before production promotion.

**Analysis complete; owner review is required before implementation or new final artwork.**
