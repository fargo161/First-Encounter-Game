# First combinatorial ZANT character proof specification

**Select C001. Build a fail-fast front capsule first, then a sparse four-view capsule if it passes.** This document specifies a future owner-approved experiment; no proof implementation or new final art has been created in this analysis.

C001 is justified by actual source/kit inspection and a relatively close source/rebuild silhouette (IoU 0.98736 at alpha>127), not by earlier preference alone. His bald head avoids a first hair-stack problem; tee, open jacket, striped sleeves/trousers, cuffs and sneakers expose real join, layering and palette failures. C033 would be cheaper but less revealing of long-sleeve stripe continuity. C020 and C028 combine too many long-drape/equipment difficulties for the first failure. C034 is the preferred next different-proportion/plaid test, not part of this proof. See [01](01_SOURCE_TRUTH_AND_FORENSICS.md) and [02](02_ARCHITECTURE_OPTIONS.md).

## Scope and calibration

One C001 identity, one person-specific body profile and one outfit family: light T-shirt, source-style **open** blue track jacket, track pants, cream sneakers. Two dressed configurations: jacket on and jacket off. Independent material controls for jacket cloth and trouser cloth. No alternate identity, cross-fit claim, new hair family, long coat, gear stack, walking cycle or gameplay mapping.

Use `fit_classes/male_short_slim_canonical_rgba.png` and `body_calibration/C001_fit_calibration_rgba.png` as drafting references; they are the same supplied image. The original `C001_source_neutral_rgba.png` governs body/head proportions and finished styling. The gray mannequin is not an anatomical ground truth. Do not copy the stale polo/plaid/loafers labels.

Proposed body frame: 1024 × 1536, root (512,1472), image-right +X/image-down +Y. This root is a proposed target, not an existing source pivot. Record the source-to-frame translation and artist-approved anchors. Preserve C001 scale across all four views; add padding rather than independently shrinking a view. Neutral body views are front0°, three-quarter-left45°, true-side-left90° and back180° under deliverable04's turn convention. Right-facing mirroring is unsupported until audited.

## Exact state coverage

| Domain | Required coverage | Deliberate limit |
|---|---|---|
| Body/wardrobe views | Neutral stance in all four views; jacket on/off in each | Four-view authoring is required even if a future runtime chooses fewer |
| Arms | `N` relaxed on each side in all views; `G` forearm forward/bent with a readable relaxed open hand on each side in front and three-quarter | Side/back have only N; no implied alternate pose bank there |
| Legs | `N` planted on each side in all views; `O` modest authored offset/weight-shift leg on each side in front | Front supports NN, NO and ON; OO is rejected. Other views support NN only. This is not a gait |
| Hands | Matching side/view/orientation for every arm state, shared by tee and jacket configurations | No prop/grip library; cuff overlap must work in both configurations |
| Shoes | Matching side/view/contact for every leg state, shared by both configurations | One sneaker design; testing a foot state does not prove arbitrary shoe-style interchange |
| Head | Four neutral identity bases plus matching neck attachments | Matching body/head views first; front-body/three-quarter-head and inverse require explicit approved entries |
| Face | Seven front patches, one five-patch three-quarter preset, three visible-side patches, no back patches | Only front tests free reviewed recombination; three-quarter preset is not a free-mix claim |

G is drawn as a whole shoulder-to-wrist silhouette with the appropriate tee/skin or jacket sleeve. O is drawn with appropriate knee, trouser folds, ankle/shoe projection and support, not a rotated neutral leg. Keep the supporting foot and floor root stable. If NO or ON requires a pelvis transition, use the reserved authored variant and declare the coupling; do not hide it with scaling.

## Surface budget and early stop

These counts are **logical authored surface slots**, not a claim that supplied PNGs already fill them or an engine atlas/file format. One surface may be packed/cropped later while preserving registration; extra layers count against the reserve. Material masks and metadata are additional non-art support data.

| Surface responsibility | Front gate | Complete sparse capsule |
|---|---:|---:|
| Minimal skin/neck underplate | 1 | 4 |
| Tee torso | 1 | 4 |
| Open jacket torso/panels | 1 | 4 |
| Tee/exposed-skin whole arms | 4 | 12 |
| Jacket whole sleeves | 4 | 12 |
| Shared hands | 4 | 12 |
| Pants waist/pelvis | 1 | 4 |
| Pants whole legs | 4 | 10 |
| Shared sneakers/feet | 4 | 10 |
| Neutral head bases | 1 | 4 |
| Face performance patches | 7 | 15 |
| **Total** | **32** | **91** |

Reserve at most four additional lining/occlusion surfaces and two front pelvis transitions: **97 maximum surface slots** without revisiting scope. Keep the front gate at32 plus at most its required share of that reserve. The comparable full pose grid would use115 surfaces; sparse coverage removes24 without dropping the four neutral views. Do not paint side/back alternate limbs before evidence demands them.

Ten front logical material-mask sets cover editable jacket torso/sleeves (1+4) and pants waist/legs (1+4); complete sparse coverage needs30 (4+12+4+10). These are coverage sets, not a mandated number of PNG files: multiple material channels may share a packed map. Tee, skin, hands, sneakers and head remain original-color/protected. Document mask packing separately from surface count. No wardrobe image may acquire a new render dependency on the gray calibration.

**Gate A: front only.** Author/assemble the32-surface draft, verify source fidelity, jacket on/off, arm joins, leg pairs and front face ownership. If it needs per-combination full-body repainting, loses identity, or requires unbounded patches, stop before authoring the other views. Revise the contract or present a smaller alternative for review.

**Gate B: complete sparse four-view capsule.** Add neutral three-quarter/side/back, three-quarter arm alternatives, the bounded nonfrontal face coverage, and per-view occlusion. Only after Gate A passes. A success is a proof of this one capsule's coverage, not proof that all44 can be converted or that cross-fit reuse works.

## Head and five-slot test

Author a wardrobe-free C001 head package; do not relabel Goose as C001. A proposed 512 × 640 local head canvas is an initial drafting resolution, subject to source-fidelity review; all patches within a head view retain the exact approved canvas. Record neck attachment and body placement, avoiding per-expression manual alignment. C001 is bald; hair-layer support stays in the contract, while hair art validation waits for a later identity.

Front base supplies neutral features with no overlay files. Seven patches provide:

1. Two independent brows forming one deliberately uneven arrangement.
2. Two eyes forming one coherent lateral gaze pair.
3. One compact uneven smile/lower-face state.
4. One bounded open-jaw lower-face state with cheek/chin shading.
5. One single-eye closure state, with an explicit approved pairing exception.

Save a complete compact preset using both brows, both lateral eyes and compact lower face. Also save neutral, open-jaw-on-base and one-eye-closure-on-base. Test at least: changing only each brow; paired gaze with neutral brows; the compact preset; uneven brow + paired gaze + open jaw; a deliberate wink; and one lateral eye against its neutral counterpart as a **rejected** gaze combination. Omitted selections retain the neutral base. No empty neutral patches are needed.

The paired-gaze/neutral-brow test directly targets the supplied Goose M2 eyebrow-erasure failure. Owned feature masks must protect each brow core from eye patches. Apply the authoritative ordinary-head alpha once and preserve it exactly across neutral and ordinary patches. Demonstrate all-channel recomposition with a one-RGB-pixel negative control. An open-jaw state must remain believable; if it genuinely needs a silhouette change, stop and specify an explicit extended-head group and revised art budget rather than clipping the intended jaw or capturing neck/clothes.

Three-quarter uses one complete nonneutral five-patch preset to challenge registration; it establishes preset correspondence only. Side uses visible brow/eye/lower-face, with anatomical side determined from the drawing. Back has no facial overlays. Approve front-body/three-quarter-head and three-quarter-body/front-head only if both look convincing with the same neck/collar interfaces; otherwise mark unsupported and record that independence limit.

## Clothing, materials, layers and provenance

Existing source can guide/extract parts of the front appearance: original neutral master, wardrobe design/textile references, complete kit plate, gray calibration. None supplies the new registered bank. New derivative work is required for hidden chest/shoulder/underarm/cuff/waist continuation, clean open jacket geometry (inventory is zipped), useful poses and hands/feet, three additional views, head/face ownership, masks and occlusion. Keep texture and distinctive wear, not only silhouette. Source files remain untouched and every derivative records its origin.

Required recipe data: identity/profile versions; view/root/anchors; torso/pelvis/limb/hand/foot/head asset IDs; shape state and fit compatibility; draw-order/occlusion dependencies; palette selections; face slots/preset and gaze companions; mirror status; provenance/hashes; QA status. The [SPEC_ONLY schema example](evidence/C001_proof_SPEC_ONLY.example.json) is unpopulated research data, not a ready recipe.

Layers must handle far/near arms and legs, neckline/neck bridge, jacket open fronts/lining, cuffs/hands and pant hems/shoes in each view. A forearm in front of the torso must occlude it correctly; an arm behind must be covered. Jacket off reveals authored tee/skin rather than baked jacket or gray mannequin. Missing layers or invalid combinations are rejected explicitly.

Two independent editable materials each get original plus two restrained candidate ramps: jacket blue → muted green and muted burgundy; pants blue → restrained charcoal and brown. These are targets for approval, not prevalidated colors. Preserve stripes, zipper/hardware, tee, skin, shoe texture/soles and coverage alpha. A large lightness/material change is outside scope. The [crop trial](evidence/palette_lead/palette_crop_comparison.png) demonstrates texture preservation possibilities and unprotected hardware recoloring, not a finished mask system.

## Minimal future viewer and review matrix

Specify a local static 2D review viewer: load a recipe, choose available view, jacket configuration, independent supported arm/leg states, approved face controls/presets and two material ramps; toggle anchors/masks and light/dark/textured backgrounds; save/reload recipe and export a reference render plus validation results. Keep unsupported choices visibly unavailable with a concrete reason. No gameplay controls, 3D scene editor, production database, animation engine, server or Unity integration is needed. This analysis did **not** implement that viewer.

Required geometry reviews at original palette/neutral face: front 2 outfits ×4 arm pairs ×3 leg pairs =24 recipes; three-quarter 2×4×1 =8; side/back 2 each =4; **36 supported body recipes**. Do not silently advertise the rejected OO leg pair. Review all nine independent jacket/pants palette pairs on the worst shoulder/cuff/hem configurations. Face tests can use isolated head renders plus representative assembled body recipes; no need to paint a new full-body sprite for each facial choice. Include the two optional crossed head/body view pairs only when approved.

## Proposed pass/fail criteria

The following are review thresholds for the experiment, not measured guarantees from supplied art. A numerical pass never overrides an evident source-fidelity or anatomy failure.

| Gate | Pass condition / explicit failure |
|---|---|
| Determinism | Every saved recipe reopens and reproduces all RGBA channels exactly under the declared reference profile. One-pixel RGB mutation is detected. Missing/invalid refs, fits, poses, gaze companions and layer cycles fail. |
| Registration | Root coordinates/metadata remain exact; planted contacts vary by no more than1 authoring pixel from declared contact targets. No scale correction per view/pose. Neutral crown-to-floor height differs by no more than1% across views absent an explicit projection reason and art approval. |
| Source fidelity | Aligned dressed-neutral front targets silhouette IoU≥0.97 at alpha>127 as a flag, plus owner approval against the original head/proportions/texture and decisive clothing details. Preserving the wrong rebuild outfit fails even if IoU is high. |
| Joins and occlusion | No unintended background hole/mannequin/guide leak in annotated join regions; no broken stripe, floating cuff/shoe, duplicated hand or impossible near/far order at native1536 and body display heights768/384. Intentional negative space is annotated, not miscounted as a hole. |
| Independent leverage | All36 supported body recipes use saved parts and data, not a bespoke repaint per full-body combination. Local reserved transition surfaces are allowed and counted; exceeding97 surfaces or needing a complete torso repaint per arm pair triggers scope review. |
| Palette | Coverage alpha is unchanged; RGB outside declared editable masks/feathers is unchanged. All9 palette pairs retain fold/texture/stripe/hardware readability at the chosen scales without matte fringes or unacceptable clipping. Failure narrows the range or requires authored alternatives. |
| Face ownership | Neutral brows survive paired eye changes; unselected feature cores are unchanged outside declared ownership overlap. Ordinary head alpha/root remain invariant. Wink/asymmetry, gaze and bounded jaw look like C001 at head display sizes128/256 and native inspection. Matte strips, neighboring feature erasure or wardrobe dependence fail. |
| View/identity | All4 neutral body/head views read as one person with one outfit and coherent head/neck/sole scale. Rotation of a front cutout or silent mirroring of asymmetric details fails. Unconvincing crossed head/body pairs are withheld, not forced. |
| Art/authoring cost | Owner accepts the assembled person as intentionally drawn; the exact source-specific invariants survive. Log authored surfaces, repairs and rejected combinations. Technical count alone cannot certify this. |

## What success does and does not unlock

Success supports one calibrated identity, one layered outfit, finite sparse limb coverage, front facial recombination, limited nonfrontal face handling, controlled recoloring and deterministic recipe assembly. It does not prove another fit, arbitrary cross-character garments/heads, patterned long garments, armor, removable hair/beards, extreme head silhouette deformation, full pose coverage or animation.

Next, test a genuinely different profile and garment fit (C034 or an owner-approved new person), then C003/C018 pattern/outerwear and C042 hair/dress/asymmetry, C020 long drape, and C028 equipment. Add one difficulty at a time. A C001 failure is useful evidence: revise or narrow the standard before scaling. **Stop after this specification for owner review; building the proof requires a new authorization.**
