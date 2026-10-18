# Recommended ZANT modular authoring standard v0.1

**Recommendation: use a common semantic anchor vocabulary with person-specific calibration, garment-aware authored whole limbs, and a registered identity-head package. Retain five facial controls, but revise patch ownership and pairing rules before treating them as freely interchangeable.** This is a research recommendation and proposed authoring contract. No production system or new production art has been built.

The evidence supports a small, constrained hybrid rather than unrestricted joint rotation or eight unrelated chassis. C001's stripe continuity makes the cost of arbitrary elbow cuts visible; C020's coat/skirt and C042's dress require coupled drapes; C028 requires gear layers and occlusion. Source/rebuild differences establish that standardization can remove memorable wardrobe decisions. The original masters remain the identity and silhouette authority. See [forensics](01_SOURCE_TRUTH_AND_FORENSICS.md), [options](02_ARCHITECTURE_OPTIONS.md), and [face findings](03_FIVE_SLOT_FACE_SYSTEM_ANALYSIS.md).

## 1. Canonical units

| Domain | Canonical unit | What may be shared |
|---|---|---|
| Body | A person-calibrated, view-specific body/underplate package with named anchors and approved pose coverage | Semantic names, fitting references, and explicitly compatible geometry; not one body stretched into every person |
| Arm | A complete authored shoulder-to-wrist silhouette for a view, anatomical side, and pose; garment layers follow that same silhouette | Approved arm states and compatible sleeves; a hand attaches at a documented cuff/wrist interface |
| Leg | An authored hip-to-ankle silhouette for a view/side/pose, coordinated with waist and ground contact | Compatible trouser/skin layers; a foot/shoe attaches at a documented ankle interface |
| Garment | A family of fitted view/pose surfaces, material channels, coverage/occlusion and compatibility rules | Family design and approved fit variants; a family is not a single universal bitmap |
| Head | One identity's registered view package: invariant skin/skull base, face performance regions, neck interface and separate hair/accessory layers | Topology and QA method; never another identity's facial geometry by default |
| Performance | A saved visible recipe of compatible body, head, face and wardrobe selections | Repeatable art combinations without gameplay meaning |

The eight historical fit labels remain searchable construction references. They are not the schema's sex/body ontology, nor proof of eight independent rigs. Each person retains a profile/calibration: stature, shoulder slope/width, torso length/girth, pelvis/leg proportions, neck position, head scale, posture and deliberate asymmetry. New profiles are added when art requires them; garment compatibility is verified per profile. A short/wide label alone grants no fitting permission.

## 2. Coordinates, anchors, and fit

Use image-right +X and image-down +Y, authoring pixels, explicit canvas dimensions, anatomical left/right, and a single declared scale per identity. `floor_root` is the persistent origin for a held pose; it is not automatically the alpha bounding box's bottom center. Pose art is registered to that origin. Frame cropping must preserve a trim offset and root metadata; transparent padding must not change physical scale.

For the C001 proof only, propose a 1024 × 1536 body frame with root **(512, 1472)**. This is a new authoring target, not a measured existing pivot. Fit the original C001 through translation and documented calibration; do not stretch it to fill the frame. If padding is insufficient, enlarge the canvas and record the new origin instead of shrinking individual views. Across the future cast, equal canvas size must not imply equal visible height. The source corpus's shared canvas and variable foot locations do not already establish a common root.

Required attachment vocabulary: floor/root, pelvis, torso, neck base/head attachment, left/right shoulders, wrists, hips, ankles and sole contacts. Elbows, knees and head landmarks are useful authoring/validation targets; they do not require visible bitmap cuts. Store view-specific coordinates and pose overrides. Explicitly distinguish an attachment point, a motion target and a ground contact. Cuffs, collars and boot shafts must have hidden continuation behind the receiving surface.

The body calibration is an art reference with numerical anchors, not a mandate to replace the source's stance or proportions with the gray calibration figure. Keep source-to-candidate offsets and the reason for any silhouette change reviewable. Do not scale X and Y independently or silently adjust shoulders/limbs to fit an available shirt.

## 3. Four canonical views and bounded head freedom

Define `front` (0°), `three_quarter_left` (+45°), `side_left` (+90°), and `back` (180°). Positive yaw means the subject turns toward anatomical left from frontal; for the first three views the nose moves toward image-right. The exact rendered three-quarter angle is authored to this target and checked with the turnaround, not inferred from a crop. Keep anatomical side labels through every view. Right-facing counterparts are separate assets unless a specific layer has passed mirroring review.

All four views must preserve scale, root/floor, cranial size, garment hem/cuff lengths, stripe/pattern identity, and distinctive asymmetry. Do not force shoulder or foot X coordinates to match across foreshortened views. Compare semantic heights, projected volume and landmark correspondence. A true side has its own nose/chin, chest/back contour, near/far limb order and shoe profile; a rotated frontal cutout does not qualify.

Default allowed head/body combinations are matching views. Add front-body/three-quarter-head and three-quarter-body/front-head only after neck, ear, hair and collar review. No arbitrary continuous yaw or front head pasted onto a back body. Over-shoulder performances require their own authored compatibility entry. Individual eye gaze may vary within a fixed head view without pretending that the skull turned.

The canonical library retains all four views. A later runtime consumer may use front/back or front/three-quarter/back subsets. Expose available views, roots, approved head pairs and pose coverage; do not design the consumer's routes, billboard angles, selection policy or camera hysteresis. These are read-only surrounding-system concerns, documented in [Specialist F](specialists/F_READ_ONLY_CONTEXT.md).

## 4. Pose and garment contract

Use semantic joints for alignment and authoring. Render whole, view-specific limb silhouettes with bounded transforms explicitly approved for the asset. Default transform is translation for registration; rotation/scale permission is absent until tested. A small wrist or shoulder adjustment may be allowed with per-asset limits, but there is no universal ±angle guarantee. Significant bending, foreshortening, fold direction or changed cuff orientation needs a new authored state.

A top separates central torso from pose sleeves/arms; an open jacket additionally needs interior/lining/underside coverage. C001's wardrobe plate shows a zipped presentation while its source wears the jacket open. Opening it requires a shape state, not a palette control. A sleeve pose may include arm-skin continuation but must expose the wrist interface. Skin hue and cuff geometry must agree with the attached hand. Long sleeves can cover more anatomy than short sleeves without changing attachment semantics.

Pants separate waist/pelvis from authored leg states where the crotch and folds permit. Supply overlapping hidden cloth at the join. A crossed or deeply bent pose that pulls the crotch/waist requires a coordinated pelvis variant; it is not two freely rotated tubes. Skirts/dresses and long coats use front/rear drape pieces or an authored lower-body bundle where splitting would break continuous cloth. Free left/right legs are not promised beneath every garment. Mark coupled coverage and reject unsupported pose pairs.

Shoes/boots contain sole/contact metadata and a compatible ankle/hem interface. Boots may occlude trousers; trouser hems may occlude shoes. A lifted foot is deliberately marked non-contact. Hands/gloves are alternate visible surfaces with matched wrists, not a glove pasted over an incompatible hand silhouette. Belts, helmet straps, collars, necklaces, radios and other gear use named asset-facing sockets plus view/pose occlusion, never inferred attachment from an item label.

Each family declares covered body regions, fit whitelist, required torso/pelvis variants, pose coverage, pair restrictions, mirror safety, and any hidden continuation. Unknown compatibility is rejected pending review. Shared family ID does not make every fit/view/pose combination valid.

## 5. Compositing and color

Use a per-view/pose layer dependency graph, resolved to a deterministic draw order. Typical relations include rear hair/gear and far limbs behind torso; lower body below torso overlap; near arm over torso unless the authored pose reaches behind; head/neck behind or in front of the appropriate collar; front hair/hat brim/glasses above their permitted head regions. Coats and straps may contribute multiple front/rear layers. Occlusion masks are explicit assets. Reject cyclic layer constraints and missing required layers. There is no universal single Z-order that handles C001, C020 and C028.

Store straight-alpha RGBA PNGs with declared color space and a documented reference composition profile. Judge the visible result over dark, light, magenta/green and scene-like backgrounds. Zero-alpha RGB may contain deliberate texture padding; it is not visible damage by itself. Check partial-alpha edge color, premultiplication on upload, and filtering separately. A later renderer must demonstrate reference parity; it must not assume its alpha/color behavior matches Pillow automatically.

Prefer artist-authored semantic material masks, with texture/value detail retained from the source. C001 requires at least independent jacket fabric, trouser fabric and stripe/trim treatment; shirt/footwear should remain separate materials even if initially unchanged. Recolor permitted material ranges through a value-preserving material treatment, with exceptions for highlights, wear, logos, seams, zips, soles and skin. Test at actual display scale. A white shirt does not become a convincing dark shirt through hue rotation. Large light/dark or material changes may need an authored alternate texture. Pattern changes and opening/closing garments are shape/texture variants, not palette swaps. Skin recoloring is outside the first proof.

The lead's [C001 crop diagnostic](evidence/palette_lead/palette_crop_comparison.png) and [measurements](evidence/palette_lead/palette_crop_measurements.json) compare hue rotation with a linear-luminance-target green treatment. The blue detail's mean absolute linear-luminance change is 0.01115 for hue rotation versus 0.0000241 for the constructed luminance treatment (two clipped pixels), before output quantization. The light shirt remains nearly neutral under hue rotation. The crop also includes zipper detail that both broad treatments wrongly recolor. This demonstrates the need for semantic protection, not a validated finished recolor: the rectangular tests contain no garment masks, and preserving numerical luminance alone does not prove convincing material appearance.

## 6. Head, face, hair and extreme states

Retain anatomical `LEFT_BROW`, `RIGHT_BROW`, `LEFT_EYE`, `RIGHT_EYE`, `LOWER_FACE` as persistent authoring controls for front and three-quarter views. Revise the physical masks and painting contract: slot cores must own their semantic features; neighboring replacement content must not erase those features. Permit only reviewed feather overlap and explicit dependencies. Reordering current layers alone is not a general solution. The existing Goose bank is valid evidence for exact preset reconstruction, but its eye patches can overwrite neutral eyebrows and its alpha can change inside the mask union. It is not a validated free-mix library.

The head base must be an invariant identity underplate independent of wardrobe. A separate neck/body bridge receives it. Skin/scalp/ears remain under hair; hair can have rear/front/side sections. Facial hair that crosses a moving jaw needs compatible lower-face states or separate reviewed layers. Glasses, hats and earrings have their own view-aware sockets/occlusion. Do not use the Goose blue collar, hair, mask rectangles, face size or 18 labels as mandatory ZANT content.

For ordinary face states, declare an authoritative silhouette and apply its alpha **once** after replacement-color composition, or use a demonstrably equivalent compositor. Neutral and ordinary patch toggles must preserve that silhouette alpha exactly; do not recreate Goose's accumulated source-over alpha. Record `alphaPolicy`, `silhouette` and `compositionProfile` per head view. Extended silhouette groups are explicit exceptions with their own approved alpha. Key every mask by anatomical slot and give each variant an explicit mask reference/ownership contract.

For v0.1, keep eye shape and gaze baked into reviewed eye assets, with a paired-gaze ID and approved asymmetry exceptions. Do not introduce a separate freely translated pupil system until it survives eyelid/sclera/lighting tests. Default eye selection keeps coherent pairs; approved one-eye closure or asymmetric acting is allowed through a known combination. Save known-good complete presets, then whitelist mixed recipes with explicit seam risk and dependencies. Default arbitrary combinations to unreviewed.

An omitted active slot means leave that region on the approved neutral base; it does not mean a required PNG is missing. Neutral needs no empty overlay files. A selected variant's `requiredCompanions` lists hard dependencies such as the other eye of a gaze pair, separately from descriptive compatibility notes. Reject a lateral eye paired with an unsupported neutral counterpart; an approved eye-closure exception records why the companion is unnecessary.

Lower face means mouth, cheeks, chin/jaw contour and supporting local shading. Compact changes can use owned patches. A dropped jaw or inflated cheek extending the invariant silhouette needs a coordinated **head-silhouette variant** with updated coverage/neck interface; do not clip it into a fixed rectangle or quietly capture clothing. Mark such states as coupled and block incompatible hair/beard/neck accessories. This is a bounded exception to base invariance, not permission to replace the entire identity for every expression.

Front/three-quarter may expose all five controls with independently authored geometry. Side exposes only the visible brow/eye and lower face, mapped to anatomical side after inspecting the art; an occluded control is explicitly unavailable, not a mysterious empty PNG. Back has no facial patches. Nonfrontal independence remains a hypothesis until new head artwork tests it.

## 7. Schema and validation

The [proposed JSON Schema](evidence/zant_asset_authoring_v0_1.schema.json) records identity/source authority, profile/calibration, views/roots/anchors, fitted garment/limb assets, materials/masks, layers/occlusion, mirroring, head/face slots, presets/compatibility, provenance and QA. It is an authoring schema, not a personality, response, or runtime world schema. The [SPEC_ONLY example](evidence/C001_proof_SPEC_ONLY.example.json) explicitly marks future art as uncreated and contains no fabricated measured anchors beyond the proposed root.

Structural JSON validation is only the first check. Semantic QA must also enforce unique IDs/views; yaw/view agreement; reference existence/hash; all required anchors; approved body/head pairs; fit and pose compatibility; mask ownership/registration; gaze pairing; acyclic layers; complete recipe references; ground contacts; and visible art review. An empty valid specification is not a renderable capsule. Promotion to approved requires a populated, visually reviewed recipe and evidence records.

## 8. Decisions and open questions

Adopt the semantic authoring contract, source authority, finite view/pose coverage, material separation and reviewed facial compatibility now as the proposed v0.1 standard. The proof must decide the practical granularity of sleeves/legs, acceptable transform bounds, mask/feather geometry, actual C001 anchors, viable recolor range, independent head-pair coverage and whether sparse pose coverage gives enough leverage. Do not lock the final number of fit profiles, nonfrontal face geometry, extreme silhouette topology, animation/gait design, or full-cast production budget before that evidence exists.

The [first proof specification](05_FIRST_COMBINATORIAL_CHARACTER_PROOF_SPEC.md) is the next reviewable step. No mass conversion, production implementation or new final artwork is authorized by this recommendation.
