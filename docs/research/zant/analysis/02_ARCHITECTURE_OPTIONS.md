# Architecture options: body, fit, views and pose

Recommend **one semantic body contract with per-person/per-view calibration and garment-aware authored whole-limb states**. Semantic joints describe attachment and pose targets; most visible arms and legs should not be cut into independently rotating upper/lower sprites. Keep technical fit profiles as explicit compatibility families learned from the proof, using the eight supplied mannequins as references rather than eight compulsory chassis.

This recommendation follows source evidence, not a tested production rig. The handoff has neutral composites, inventories and mannequins; it does not include a verified independently posed or four-view modular body. Missing construction art must be made in a separately approved proof build.

## What the corpus actually constrains

The [source forensics](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/01_SOURCE_TRUTH_AND_FORENSICS.md>) establishes all44 neutral canvases at1024×1536, original floor/bottom variation159px and original bbox heights1316–1498. Eight fit reference files exactly duplicate eight nominated calibrations. Within-bin calibration sizes vary and ratio ranges overlap: male_short_slim0.3025–0.3452 versus male_short_wide0.3276–0.3570; female_short_slim0.2865–0.3229 versus female_short_wide0.3026–0.3628. These are silhouette ratios including arms/shoes, not anatomical measurements. They establish neither eight invariant rigs nor free interchangeability.

The visual problems are concrete:

- C001's jacket sleeve stripe and crinkled track fabric cross the elbow region. A rotated forearm slice would need to preserve stripe width, fold direction, cuff and armpit tension. Its tee sleeve is a different visible coverage shape from the jacket sleeve.
- C033's short tee sleeves project beyond the jersey armholes. Its original `ChatGPT Image Sep 3, 2026, 10_17_37 PM (2).png` changes shoulder tilt, forearm foreshortening and jersey drape together; rotating the neutral arm cannot supply that appearance.
- C034 combines a broad belly, short patterned overshirt, thinner vest below it and stained trousers. Scaling him toward a slim template would erase design information even if attachment points matched.
- C020's long coat and skirt act as overlapping cloth volumes. Original `ChatGPT Image Sep 3, 2026, 03_58_57 AM (2).png` shows coat panels swinging with leg changes. C042's `5b655b91-12dc-45af-8ccf-a2df17ed912e.png` shows asymmetric hair, bent legs, ripped tights and a moving floral hem. Neither should be decomposed into naked leg pieces with a static skirt pasted on top.
- C028's protective vest, gloves, knees and belt cross ordinary body/garment boundaries. Its gear-free rebuilt outline differs substantially from the original (IoU0.88764); C010 even retains a holster in the nominal gear-free reconstruction. These are later layer/coverage tests, not the smallest first pose proof.

Evidence plates: [C001/C020](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/source_A/comparison_plate_1.jpg>), [C028/C033](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/source_A/comparison_plate_2.jpg>), [C034/C010](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/source_A/comparison_plate_3.jpg>), [original reference key](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/source_A/original_reference_key.json>).

## Body/fit models

| Model | Advantage | Cost/failure mode | Verdict |
|---|---|---|---|
| One fixed visual body stretched into every person | Few assets and simple registration | Silhouette, limb ratios, belly/shoulder differences and posture become deformation artifacts; C001/C034/C020 cannot be reduced to scaled copies | Reject as cast standard. |
| Eight independent chassis locked to historical labels | Familiar supplied grouping; initially clear ownership | Eight complete four-view state sets before evidence; hard bin boundaries do not encode continuous variation; quoted labels overstate technical certainty | Retain references, reject compulsory eight-rig architecture. |
| One semantic contract plus calibrated profiles | Shared vocabulary, tools and pose meanings; per-character ratios preserved; compatible garments selectively reused | Needs per-view coordinates, fit review and limited bespoke shapes; cannot promise every garment fits everyone | Recommended. |
| Fully bespoke body per identity with shared naming only | Maximum fidelity | Reuse stops at metadata; future wardrobe/pose authoring grows with every person | Escape hatch for unusual silhouettes, not default. |

The canonical body is **a calibrated person-shaped assembly in a defined view**, referenced by identity and technical fit profile. It contains a root/scale convention, torso/pelvis structure, attachment targets, uncovered-skin coverage and allowed garment/pose combinations. A gray mannequin is its authoring reference, not a visible final body and not a proxy for the original person's anatomy. Assign a new technical fit profile only when its reusable cuts/anchors demonstrably need one; do not precommit fewer or more than eight from these neutral silhouettes alone.

## Pose strategies

| Criterion | A: segmented upper/lower puppet | B: authored whole-limb library | C: semantic targets + authored visible limbs |
|---|---|---|---|
| Painterly folds and texture | Rotation preserves pixels but folds remain frozen; large bend needs invented inner/outer contour | Pose-specific fold/contour drawn correctly | Same strength as B; small transforms only where validated |
| Stripes, plaid, print | Joint cuts, rotated grids and repeated folds expose construction | Patterns can turn/compress coherently | State art preserves pattern; metadata prevents invalid mirroring |
| Foreshortening / perspective | Scale/rotation cannot supply unseen surfaces | Authored per view/state | Authored per view/state; semantic targets coordinate hand and socket |
| Shoulder/elbow/knee seams | Many visible cuts and hidden continuations | Shoulder/hip seam remains; wrist/ankle optional | Shoulder/hip plus deliberate wrist/ankle; support patches when needed |
| Garment coupling | Sleeve often slides independently of torso; pants bend below static crotch | Can author correct silhouette but needs torso/pelvis compatibility | Explicit torso/pelvis support state, coverage and near/far occlusion |
| Initial authoring cost | Low only for an unconvincing prototype; quality repairs accumulate | Higher per new state/view/garment | Moderate bounded library; no arbitrary large-angle pose promise |
| Combinatorial leverage | High theoretical count, many invalid results | Fewer strong states, controlled reuse | Useful independent choices with explicit admissibility |
| Fit variation | Easy to scale, difficult to preserve quality | Fit-specific shape families | Shared targets + profile compatibility + bespoke overrides |
| Four views | Needs four visual rigs regardless; front pieces cannot rotate into side/back | Four view-specific state libraries | One contract, four calibrated geometries and view-specific states |
| Later motion | Continuous transforms easy; deformation remains weak | Holds/cuts and authored transitions | Holds, limited interpolation, authored transition poses where motion requires it |

Choose C, with B as its visible-art method. A can remain a diagnostic alignment aid or a tightly constrained micro-adjustment inside coverage; it should not define final bent sleeves/legs. Do not confuse an elbow target in data with a visible elbow cut. The first proof should explicitly compare any proposed small rigid rotation against an authored bent C001 sleeve; quality approval controls the allowed transform envelope, rather than assigning a universal angle limit from theory.

## Minimum anchor vocabulary

| Anchor / datum | Required purpose | Must it be a visible sprite boundary? |
|---|---|---|
| Ground root and scale | Stable location and drawn scale across views/poses; per-foot contact descriptors | No. Never infer from arbitrary crop/bbox. |
| Pelvis center + left/right hip targets | Bottom garment and leg attachment; leg-state coherence | Pelvis/leg split is useful, but crotch overlap requires authored hidden continuation. |
| Torso center / upper torso | Torso garment registration and approved lean | No cut through chest/abdomen required. |
| Neck/head socket | Head/neck garment interface and identity scale | Yes, under a deliberate collar/neck overlap; head facing remains separately constrained. |
| Left/right shoulder | Whole-arm/sleeve attachment and near/far order | Yes, concealed attachment band; raised states may need torso support patches. |
| Elbow guide per state | Pose description and proportions, optional equipment placement | Normally no visible joint cut. |
| Wrist/hand socket per state | Hand orientation, cuff/glove coverage, hand changes | Separate only where cuff/skin boundary can be made convincing. |
| Knee guide per state | Silhouette/length QA and protective-gear constraints | Normally no visible cut; knee pads may own a local overlay. |
| Ankle/foot socket and sole contacts | Shoes, boot coverage, ground placement | Separate where trouser/boot hem hides overlap; otherwise whole lower silhouette. |

Store these per view and calibrated pose. Shoulder/hip pivots are not permission to rotate whole limbs freely. Root, scale, body proportions and identity remain fixed for a view change; coordinates and silhouettes change with projection. Left/right always means the character's anatomical side, with canvas X separately defined.

Use root-local coordinates and a shared source pixel scale for the proof. If a1024×1536 atlas is retained, a proposed floorY1450 would leave only1450px above it and clip the tallest1498px source bbox when translated unchanged. A floorY1516 leaves20px below the sole and18px above the tallest current bbox, but has little room for raised hands/hair. Therefore fix the logical ground root/scale, and permit larger transparent pose frames or per-frame crop metadata; do not resize the person to force a gesture into a fixed rectangle. The proof specification must choose its actual pixel frame deliberately. Semantic anchor positions are to be authored and reviewed; neutral silhouette bounds do not supply them automatically.

## Four-view correspondence

Canonical authoring views are front, front3/4, true side and back, at target yaw0°,45°,90°,180° relative to a fixed camera. Deliverable04 fixes the positive turn toward the subject's anatomical left, nose toward image-right, with side continuing that turn. These are art targets with controlled projection, not a requirement to derive sprites by mathematical rotation.

Author root height, person scale, head/torso/leg ratios, garment hem lengths, collar and cuff placements together on a turnaround guide. Different view widths are expected. Preserve visible side-specific details; garments' fronts, side seams and backs need authored continuation. Source action illustrations guide shapes, not camera registration. A front face should not simply ride on a true-side body: allow same-view head/body by default, add adjacent-facing combinations only after a neck/ear/collar visual check. Side head normally needs one visible eye/brow and a projected lower-face region; back normally needs no facial slots. Face findings in03 govern the exact contract.

Mirroring is per asset, not a global shortcut. C034 stains and pocket/print details, C042 ripped tights and jacket striping, C010 thigh holster and C020 watch demonstrate side-specific information. Mark mirror-safe assets explicitly; otherwise author the missing opposite-facing image or restrict that facing. Four canonical views do not automatically provide both sides of an asymmetric person. Runtime consumers may select fewer views, but that does not delete the four-view authoring requirement or authorize Room Creator edits.

## Smallest useful proof and budget tradeoff

C001 remains the first candidate: bald, uncluttered, useful layered tee/jacket/pants/shoes, intact authoritative source and a full plate. C033/C034 are better follow-on reuse/fit tests; C020/C028 add failures that a first proof would struggle to diagnose. Source catalogs require selective recovery/cleanup and newly authored continuations, not mass extraction.

The tempting full grid is two states for each arm and leg on both sides in all four views, with both tee and jacket sleeve coverage. This is a reasonable later completion target, but not the cheapest first falsification. It does not require testing every Cartesian combination; many combinations should be prohibited by contact/occlusion rules.

A **sparse proof** can first establish independent arm/leg changes in front, additional arm changes in3/4, neutral registration/clothing in all four views and one identity's frontal face mixing. Following lead reconciliation, the recommended bookkeeping is91 raster surface slots, assuming one surface per listed layer/state and allowing neutral face to inherit the base:

| Surface family | Front gate | Full sparse four-view proof |
|---|---:|---:|
| Neck/uncovered-skin underplate | 1 | 4 |
| Tee and jacket torso | 2 | 8 |
| Tee/jacket whole arms: neutral, both sides | 4 | 16 |
| Tee/jacket whole arms: alternative, both sides | 4 | 8: front and3/4 |
| Hands: neutral and alternative orientations | 4 | 12: neutral all views, alt front/3/4 |
| Pelvis / pants upper section | 1 | 4 |
| Whole trouser legs | 4 | 10: neutral all views, alt front only |
| Shoes | 4 | 10: paired with each supplied leg state; do not assume alternative ankle projection can reuse neutral shoes |
| Four-view identity head bases | 1 | 4 |
| Face alternates / view-specific preset patches | 7 | 15: front7,3/4 completepreset5,side3,back0 |
| **Raster surface slots** | **32** | **91** |

The seven frontal alternate slot images mean one alternative for each brow, one coherent paired gaze(two eye images), one unilateral eye-shape/blink and two lower-face deformations(compact and open-jaw). Neutral is base inheritance/no-op. The3/4 package has one complete known-good performance decomposed into five slots; this tests registration/recomposition, not free mixing. Side uses its visible brow, eye and projected lower-face region. Back uses no face slots. Deliverables03/05 define exact face tests; additional expressions increase count. No alpha-empty neutral slot images are required.

Reserve at most four liner/occlusion raster surfaces and two front pelvis support variants if the specified overlaps demand them:97 maximum before another owner review. Material masks are separate from these raster-art counts. The front gate's ten material-mask deliverables must be treated as explicitly packed masksets/atlases or reconciled with per-surface coverage; ten logical masks need not equal tenPNGfiles. Editable jacket and trouser surfaces need material coverage; protected shoes, tee and skin remain unchanged in this proof. Corrected shoulder support and complete-expression approval images cannot be silently omitted from budget tracking.

This sparse proof is only convincing if its claim is explicit: it validates four-view neutral assembly plus independent poses in the listed views. It does **not** prove independent pose coverage in side/back or alternate legs in3/4; those remain gated expansion. Requiring two limb states on each side in every view with matched shoes/hands adds24 surfaces to this91-slot plan: eight arms, four hands, six legs and six shoes. The resulting115 surfaces with the same15 face patches, before optional liners/support, are a separate broader coverage target.

Recommended gate: build the front32 surfaces first, with no hidden skeleton stretch and no body change to rescue fit. Inspect jacket-off and jacket-on, each arm alternative independently, each leg alternative independently, asymmetrical arm selection, paired gaze, unilateral eye shape and both lower-face variants on contrasting backgrounds at final intended display size. Permit only stable leg pairs: neutral/neutral, left alternate/right support, right alternate/left support. A footstep state needs authored pants folds and a recorded ground contact; two individually valid leg states need not form a valid stance together.

If that fails at shoulder/crotch/neck seams or loses identity/pattern, stop before authoring other views and revise the contract. If it passes, author side/back/3/4 neutral and3/4 alternate arms; validate root/scale, near/far layering, neck sockets and view-specific garment continuation. This sequence preserves the four-view goal while making the expensive art dependent on initial evidence. Deliverable05 selects the final binding proof coverage and pass/fail criteria; no build begins in this analysis pass.

## Garment, material and head alternatives

These comparisons use the actual representative source/wardrobe/kit images in [Specialist C](specialists/C_GARMENT_MATERIAL.md), the lead's [C001 textile diagnostic](evidence/palette_lead/palette_crop_comparison.png), and the independent face experiments in [03](03_FIVE_SLOT_FACE_SYSTEM_ANALYSIS.md). No production garment fitting or recolor system is claimed to have been validated.

| Garment organization | Tradeoff and decision |
|---|---|
| Whole outfit per pose | Preserves a coherent painting, but wardrobe/limb independence collapses and every combination becomes bespoke. Keep as comparison/reference or exceptional full-body pose. |
| Universal torso plus stretched sleeve/pants pieces | Cheap theoretical reuse; C001 stripes, C034 plaid/belly, C020 drape and C028 gear expose fit/continuity failure. Reject universal stretching. |
| View/fit/shape family with authored limb states | Bounded local reuse, explicit compatibility and occlusion; higher initial art cost, best match to supplied painterly clothing. Recommend. |
| Coupled skirt/coat/lower-body bundle | Fewer independent leg combinations, but preserves continuous hem, pattern and volume. Required exception for C020/C042 rather than forcing trouser topology. |

| Palette approach | Tradeoff and decision |
|---|---|
| Global hue transform | Fast saturated-cloth trial; also shifts unprotected hardware, fails meaningful near-white/black changes and changes perceived value. Diagnostic only. |
| Indexed final-color palette | Exact swatches for indexed art, but quantization would lose painterly RGB texture/antialiasing here. An indexed semantic label map remains useful; do not quantize final corpus by default. |
| Grayscale multiply or material ramp | Can retain folds/value structure; one universal multiply crushes dark detail or changes material character. Use per-material constrained response, not a blanket formula. |
| Semantic masks plus value/detail-preserving treatment | Protects trim/skin/zip/patterns while recoloring named cloth. Recommended ordinary-cloth path, subject to mask/range/edge review. |
| Authored alternate textures | Costs art but preserves deliberate plaid/floral/leopard choices and major value/material changes. Prefer when a numerical recolor cannot preserve intent. |

The lead's crop trial records floating-point linear-luminance differences and gamut clipping in [palette_crop_measurements.json](evidence/palette_lead/palette_crop_measurements.json). Both broad transforms color zipper pixels, demonstrating why local numerical success is not a finished material contract. Shape states such as open/closed jacket, rolled sleeve or longer hem remain separate art.

| Facial organization | Tradeoff and decision |
|---|---|
| Whole authored face for each performance | Strong coherent presets, but independent gaze/brow/lower-face choices are expensive. Keep known presets as references/safe recipes. |
| Five unrestricted rectangular donor patches | Supplied presets exactly reproduce, but M2 erases neutral brows and M3 has conflicting gaze. Reject unrestricted production mixing of this bank. |
| Five anatomical semantics, owned view-specific masks and reviewed compatibility | Retains useful asymmetry and broad lower-face painting while acknowledging context and pairing. Recommend, with normal alpha applied once. |
| Separate freely translated iris/pupil layer | More potential gaze reuse, but not supported by these painted eyes/creases/lighting. Defer until a local eye study proves it. |
| Extended silhouette group for extreme jaw/cheeks | Costs coordinated head/neck/hair variants, but preserves genuine contour change. Explicit exceptional state; not a universal sixth slot. |

## Disposition of supplied working hypotheses

All eleven hypotheses in Part1 `06_RESEARCH_BRIEF/WORKING_HYPOTHESES_NOT_REQUIREMENTS.md` were treated as questions: (1) shared semantic anchors — recommend; (2) eight references plus calibration — retain references, reject compulsory bin geometry; (3) authored whole limbs — recommend visible method; (4) hybrid — recommend with unproven transform bounds; (5) garment families — recommend, with coupled drape exceptions; (6) material masks — recommend, with authored alternates; (7) separate heads/hair/face — recommend revised ownership/alpha, not direct Goose promotion; (8) originals outrank construction — confirmed necessary; (9) C001 first — supported by comparative inspection, later sequence adjusted to test fit before complex drape/gear; (10) small capsule before mass conversion — recommend32-front/91-sparse gates; (11) defer animation — retain until still-pose interchange passes.

## Decisions to leave open

Keep exact technical fit-profile count, maximum transform envelope, which raised-arm states need torso support, side/back pose coverage, shoe reuse between stances, long-garment decomposition, opposite-side artwork for asymmetric assets and transition-animation costs open until the proof produces visual evidence. The semantic contract can be stable while those art decisions remain evidence-driven. No measured silhouette IoU or theoretical combination count can replace source-authority and seam-quality review.
