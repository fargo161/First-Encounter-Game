# C001 ZANT Gate A implementation preflight

Date: 2026-10-18. Status: planning complete; implementation has not begun.

**Readiness verdict: READY TO BUILD GATE A.** The inputs are sufficient to attempt the bounded experiment below. This is readiness to start experimental authoring after explicit owner approval, not a claim that the artwork exists, that Gate A has passed, or that the research recommendation is final production architecture.

The owner's current instruction approves the research/architecture pass as the basis for experimental implementation, but explicitly requires this preflight and a stop before implementation. That stop remains in force. No sprites, masks, anchors file, renderer, viewer, recipes, or implementation checkpoint were created in this pass.

## 1. Controlling scope and inspected evidence

The controlling deliverable is [05_FIRST_COMBINATORIAL_CHARACTER_PROOF_SPEC.md](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/05_FIRST_COMBINATORIAL_CHARACTER_PROOF_SPEC.md>), restricted to **Gate A: front-facing C001**. The experimental contract follows [04_RECOMMENDED_ZANT_MODULAR_STANDARD_v0_1.md](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/04_RECOMMENDED_ZANT_MODULAR_STANDARD_v0_1.md>). Where the broader documents discuss later work, this document does not authorize it.

One identity, one person-specific calibration, one outfit family, one front body view and one front head view. Required configurations are light crew-neck tee, dark blue striped track trousers and cream sneakers, with the source-style **open** blue track jacket on or off. Jacket closure is not a control. There is no closed-jacket variant.

Excluded: Gate B; three-quarter, side or back authoring; crossed head/body views; additional characters; cross-fit transfer; mass conversion; animation or gait; Unity; Encounter/Room Creator changes; production database work; production atlas or deployment decisions. A Gate A pass does not automatically authorize any of these.

### Evidence actually inspected for this preflight

The following paths are under the unchanged [evidence source root](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/work/ZANT_analysis_sources>). `M/` below means `modular/NEUTRAL_CHARACTER_MODULAR_REBUILD_V03_2/` under that root.

| Input | Inspection and consequence |
|---|---|
| `original/characters trapstar source/C001_source_neutral_rgba.png` and `M/source_masters/C001_source_neutral_rgba.png` | Byte hashes checked; copies match. Source master inspected at full image scale. It governs identity, proportions, stance, open jacket, stripes, texture, wear and footwear styling. |
| `M/body_calibration/C001_fit_calibration_rgba.png` and `M/fit_classes/male_short_slim_canonical_rgba.png` | Calibration inspected; both files decoded and hashed. They are exact duplicate references, not two independent confirmations of anatomy. Gray clothing/mannequin geometry is never a render dependency. |
| `wardrobe/C001_clothing_inventory_rgba.png` and `M/clothing_catalogs/C001_clothing_inventory_rgba.png` | Corresponding copies match. Catalog inspected: useful tee/textile/sneaker references, zipped jacket, cropped gray arm, magenta/edge contamination and bottom guide. Not registered overlays. |
| `M/kit_plates/C001_modular_kit_plate_rgba.png` | Inspected as a complete plate. It mixes dressed figure, gray calibration and catalog references; its separated jacket is zipped. No automatic component export. |
| `M/rebuilt_composites/C001_neutral_composite_rgba.png` | Inspected together with the existing alpha-composited source/rebuild comparison plate. Reconstruction is secondary evidence; local face, stripe and texture differences cannot replace source authority. |
| `M/README.md` | Its inventories expressly still require aligned layers, masks and anchors. Its historical “production status” heading does not certify modular readiness. |
| Research deliverables 01, 03, 04, 05 and 07; relevant body/garment findings and machine-readable scope/example | Read for source authority, body interfaces, exact budget, face failures and acceptance gates. The SPEC_ONLY example has empty asset/recipe banks and no measured anatomy anchors; it must not be loaded as a completed capsule. |
| Goose notes plus existing base/slot, M2 interface, diagnostic mix and source-comparison plates | Inspected as engineering/failure evidence. The prior independent measurements are cited below as prior analysis, not falsely represented as a fresh audit of all 90 Goose slots. |

The [source/rebuild comparison](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/source_A/comparison_plate_1.jpg>) and [source/wardrobe/kit plate](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/garment_C/C001_source_wardrobe_kit.jpg>) were inspected. The recorded C001 source/rebuild silhouette IoU of 0.98736 is prior analysis evidence, not a quality certificate for the rebuild or a result from a new modular assembly.

**Goose is an experimental proof/failure corpus.** Some supplied assets are messy, uneven, broken or unusable. Neither their polish nor their defects are C001's visual target. Reuse the lessons about topology, registration, asymmetry, gaze, lower-face scope, compositing, compatibility and failed validation. Reuse no Goose face pixels, identity, hair, collar, mask rectangles, feather widths or expression labels as C001 artwork requirements. Exact recomposition can reproduce bad artwork exactly.

### Read-only measurements made now

All six C001 image roles below decoded successfully as RGBA. Bounds are half-open `[left, top, right, bottom)`.

| Image | Size | Alpha > 0 bounds | Alpha > 127 bounds |
|---|---|---|---|
| Source master | 1024 × 1536 | `[259,93,732,1419)` | `[260,94,731,1418)` |
| Calibration / duplicate fit reference | 1024 × 1536 | `[288,93,702,1419)` | `[288,93,702,1419)` |
| Wardrobe catalog | 737 × 737 | `[0,50,720,737)` | Same |
| Kit plate | 1536 × 1024 | `[105,21,1519,975)` | Same |
| Rebuilt composite | 1024 × 1536 | `[258,93,733,1419)` | Same |

Source visible support is 1326 pixels high. These bounds do not measure shoulders, joints, weight bearing or actual sole-contact curves. Deliberate RGB padding under zero alpha in the supplied rebuild/calibration must not be mistaken for visible anatomy; judge those images with correct alpha composition.

SHA-256 baselines, checked during this pass:

| Input | SHA-256 |
|---|---|
| Original / preserved C001 source | `f651af252d32fd7a0870d254faab31ec63e4f620a42492641b834fd76274e0db` |
| Calibration / fit reference | `add7415be15d664ba04b205846ca7d1e7a82bf3a27e243403bf7fffaf790e4f1` |
| Wardrobe / clothing catalog | `9a02bf9c5b80581d0ecba558521cf6d7eccce2eb1114632ca54f4cc1540554cb` |
| Kit plate | `36970230e64dc438fcaaa237e3fb07d424721dd73a03f591704cb97348b63aba` |
| Rebuilt composite | `e8319df52dfb1355107cd4a0d773db4117309cfb2c3f2cb76825ab1ee29a4c3f` |
| Recommended standard 04 | `e730a47ce1aa6c388de035529ceb08197a3c38469ea77202b3628c748964a852` |
| Proof specification 05 | `4da9cfef9b2e108c2bf20cc639f90ed1e2afdd4352aa3dd597af72fb2c86339e` |

## 2. Exact 32-surface authoring ledger

These are logical authored surfaces, not a count of supplied files, layers that already exist, or future atlas pages. Each has a stable ID, one registration and one defined render responsibility. Anatomical `L` is image-right; anatomical `R` is image-left. Pose-pair strings always list anatomical L first, R second.

Arm `N` is source-like relaxed; `G` is a modest forearm-forward/bent pose with a readable relaxed open hand. Leg `N` is source-like planted; `O` is a modest authored offset/weight-shift state, not a rotated leg or gait frame. Both G arms must remain individually readable together without crossing/interpenetrating.

Derivation classes:

- **D — source-led clean derivative:** visible source appearance can seed the surface. Isolation, edge cleanup, registration, hidden overlap and missing continuation still require work. No D surface is accepted unchanged from a plate.
- **N — substantially new artwork:** the required anatomy, pose or performance is absent. References guide painterly style and identity but cannot supply the missing geometry through cropping or rigid transforms.

| # | Stable surface ID | Exact responsibility | Class / available art and missing work |
|---:|---|---|---|
| 01 | `A01_skin_neck` | Minimal neck/upper-chest underplate and head bridge | D: source neck skin; newly continue hidden skin behind tee/collar and head seam. No gray mannequin pixels. |
| 02 | `A02_tee_torso` | Tee central torso, neckline and hem | D: source visible tee plus catalog design; repair full jacket-off width, shoulders and underarm/waist overlap. |
| 03 | `A03_jacket_open_torso` | Open jacket central torso, both front panels and collar at one draw depth | D: source open jacket is authority; clean openings, panel returns and hidden armhole/hem cloth. Zipped catalog is textile reference only. |
| 04 | `A04_tee_arm_L_N` | Whole short-sleeve/exposed-skin L arm, N, shoulder to wrist | N: source long sleeve hides this skin; catalog tee only guides sleeve cut. |
| 05 | `A05_tee_arm_R_N` | Whole short-sleeve/exposed-skin R arm, N | N: side-specific anatomy and sleeve continuation. |
| 06 | `A06_tee_arm_L_G` | Whole short-sleeve/exposed-skin L arm, G | N: bent/foreshortened anatomy, tee sleeve and folds. |
| 07 | `A07_tee_arm_R_G` | Whole short-sleeve/exposed-skin R arm, G | N: authored counterpart, not a mirror. |
| 08 | `A08_jacket_arm_L_N` | Whole jacket L sleeve, N, shoulder to wrist/cuff | D: source sleeve; restore hidden shoulder/underarm overlap and continuous stripe. |
| 09 | `A09_jacket_arm_R_N` | Whole jacket R sleeve, N | D: source-specific folds, stripe and cuff. |
| 10 | `A10_jacket_arm_L_G` | Whole jacket L sleeve, G | N: authored bend, fold, stripe path, cuff orientation. |
| 11 | `A11_jacket_arm_R_G` | Whole jacket R sleeve, G | N: independent side-specific state. |
| 12 | `A12_hand_L_N` | L hand matching N wrist; shared by both outfits | D: source hand with cleaned edge and hidden wrist continuation. |
| 13 | `A13_hand_R_N` | R hand matching N wrist; shared by both outfits | D: source hand, preserve asymmetry. |
| 14 | `A14_hand_L_G` | L relaxed open hand matching G wrist; shared by both outfits | N: actual pose/orientation, not neutral-hand rotation. |
| 15 | `A15_hand_R_G` | R relaxed open hand matching G wrist; shared by both outfits | N: authored counterpart. |
| 16 | `A16_pants_pelvis_NN` | Default trouser waist/pelvis, including crotch join coverage | D: source/cat trousers; repair hidden waistband and overlapping upper legs; test reuse for NO/ON. |
| 17 | `A17_pants_leg_L_N` | Whole L trouser leg, N, hip to ankle | D: source folds, stripe, hem, hidden hip continuation. |
| 18 | `A18_pants_leg_R_N` | Whole R trouser leg, N | D: corresponding source-specific leg. |
| 19 | `A19_pants_leg_L_O` | Whole L trouser leg, O | N: altered projection, knee/folds/hem and support geometry. |
| 20 | `A20_pants_leg_R_O` | Whole R trouser leg, O | N: authored counterpart. |
| 21 | `A21_sneaker_L_N` | L sneaker/foot matching N ankle and contact | D: source footwear; clean isolation and hidden ankle/upper. |
| 22 | `A22_sneaker_R_N` | R sneaker/foot matching N ankle and contact | D: source counterpart; preserve scuffs and blue side detail. |
| 23 | `A23_sneaker_L_O` | L sneaker/foot matching O ankle/contact | N: changed foot projection/contact; catalog guides design only. |
| 24 | `A24_sneaker_R_O` | R sneaker/foot matching O ankle/contact | N: authored counterpart. |
| 25 | `A25_head_front_neutral` | Wardrobe-free C001 front head with all neutral facial features | D: original bald head/face; clean contour, separate neck ownership, retain age and facial proportions. No Goose transplant. |
| 26 | `A26_brow_L_uneven` | Independent L brow raised/arched component | N: C001-specific brow, wrinkles and local skin replacement. |
| 27 | `A27_brow_R_uneven` | Independent R brow lowered/knit component | N: combines with A26 into deliberate uneven brows. |
| 28 | `A28_eye_L_lateral` | L eye/eyelids plus one coherent lateral gaze | N: paired with A29; cannot overwrite brow core. |
| 29 | `A29_eye_R_lateral` | R eye/eyelids, same lateral attention target | N: paired with A28. |
| 30 | `A30_lower_compact` | Compact uneven smile with cheek/chin shading | N: broad lower-face performance, not a floating mouth sticker. |
| 31 | `A31_lower_open` | Bounded open-jaw/mouth performance with believable cheeks/chin | N: ordinary silhouette only; see stop rule below. |
| 32 | `A32_eye_L_closed` | Deliberate single-eye closure/wink | N: explicit exception with the opposite neutral eye. |

Accounting: 1 skin/neck + 1 tee torso + 1 jacket torso + 4 tee arms + 4 jacket sleeves + 4 hands + 1 pelvis + 4 trouser legs + 4 sneakers + 1 head base + 7 face patches = **32**. Thirteen are source-led D surfaces and nineteen need substantially new artwork. The D/N distinction describes available evidence, not an effort estimate: several D surfaces need substantial hidden-region painting.

### Allowed reserve, with a hard Gate A ceiling

Start with zero reserves consumed. Only actual demonstrated interface failures can spend them; record the reason, image evidence, compatibility and running count. The four lining/occlusion allowances belong to the entire experiment described by 05, not four per outfit, pose or view. Gate A may use its required share, up to all four. No unused future-view allocation is presumed here.

| Reserve ID | Maximum additional surface | Permitted use |
|---|---:|---|
| `R01_jacket_lining_rear` | 1 | Separate inner/rear jacket coverage when A03 cannot supply the required depth. |
| `R02_collar_occlusion_front` | 1 | Separate collar/lapel return or equivalent demonstrated local occlusion requirement. |
| `R03_shoulder_occlusion_L` | 1 | One required L shoulder/underarm lining or occlusion surface, with explicit outfit/state compatibility. |
| `R04_shoulder_occlusion_R` | 1 | Corresponding R local surface. |
| `R05_pelvis_NO` | 1 | Authored replacement of A16 for L=N, R=O, if shared pelvis fails. |
| `R06_pelvis_ON` | 1 | Authored replacement of A16 for L=O, R=N. |

R01–R04 may be reassigned among demonstrated lining/occlusion needs with a ledger entry, within their aggregate limit of four. They cannot become extra expression, limb, hand, shoe, full-torso or full-body alternatives. Different painted versions for tee and jacket each consume a surface; packing them together does not make them one. R05/R06 are stance-coupled pelvis replacements, not freely selectable overlays.

**Gate A ceiling: 32 + at most 4 lining/occlusion + at most 2 pelvis transitions = 38 surfaces.** The full-capsule figure of 97 in 05 is not a Gate A budget. One surface drawn at two distinct depths, or split into separately ordered art layers, incurs the extra layer against reserve. Two disjoint panels drawn together at one depth may remain A03. Cropping/packing cannot hide extra logical variants. Pure coverage/ownership/material masks, metadata, recipes and diagnostic composite renders are support data, not extra painted surfaces; a colored repair disguised as a mask is artwork and counts.

If the required two outfits, four arm pairs or three leg pairs cannot work within this ledger, stop and report Gate A failure or a contract revision. Do not silently remove required combinations or repaint each combined body.

## 3. Front registration, anchors and interfaces

### Coordinate contract

Use a 1024 × 1536 front authoring frame, image-right +X, image-down +Y, integer authoring pixels, yaw 0°, anatomical sides, and `floor_root = (512,1472)`. Root-local coordinates are `(x-512,y-1472)`. Preserve the source's native pixel scale: scale 1, rotation 0, no mirroring, no per-pose resizing.

A concrete initial source-registration proposal is translation **(0,+54)**. It places the source's last nonzero-alpha row, y=1418, at y=1472 and its nonzero support at `[259,147,732,1473)`. This is a declared drafting choice, not discovery of an existing source pivot or a claim that alpha-bottom automatically gives anatomical contact. Keep horizontal source placement; do not recenter by bbox. During the first approved calibration task, annotate the actual soles and confirm the floor guide against them. If art review requires a different source translation, revise and version the calibration once before downstream authoring; retain both the proposal and reason. Never compensate independently per recipe.

Retain transparent padding. If a G pose exceeds the frame, add explicit canvas padding/trim offsets while preserving logical root and scale; a frame revision must affect registration consistently. No silent clipping or shrinking. In cropped exports, store integer `trimOffset` and reconstruct the same logical frame exactly.

### Mandatory anchor record

The numerical anatomy anchors do not exist in the supplied handoff. They must be measured/placed on the source-led derivative and signed off during the first build task; fabricating exact joint coordinates now would misrepresent evidence. The vocabulary and constraints are fixed below. Missing coordinates block that asset's assembly and checkpoint promotion, not this permission to attempt authoring.

| Required anchor / region | Ownership and invariant |
|---|---|
| `floor_root` | Exact target above; independent of alpha bbox, cropping and current foot selection. |
| `pelvis`, `torso` | Central registration references; no automatic movement when one leg/arm changes. Pelvis variants explicitly declare any changed local hip interfaces. |
| `neck_base`, `head_attach` | A01 receives A25 at a fixed skull/neck attachment; jaw performance never determines head placement. Tee neckline and jacket collar retain their own coverage edges. |
| `shoulder_L/R` plus `shoulder_join_L/R` bands | Whole-arm attachment. N/G preserve approved shoulder location; geometry/folds change within the authored surface. No elbow cut. |
| `wrist_L/R[N,G]` plus wrist seam width/tangent/overlap | Tee and jacket arms for the same side/state must meet the same hand interface. Record short-sleeve skin coverage and jacket cuff lip separately. |
| `hip_L/R`, `hip_join_L/R[NN,NO,ON]` | Pelvis-to-whole-leg overlaps; declare R05/R06 dependencies where used. No independent thigh rotation. |
| `ankle_L/R[N,O]` plus ankle seam width/tangent/overlap | Whole leg meets its matching sneaker; pant hem owns its overhang above the shoe upper. |
| `sole_contact_L/R[N,O]` | Contact point(s)/polyline, floor target and `contact` flag. N/N and the supporting N foot in N/O or O/N must remain planted. O may stay grounded or be explicitly non-contact; the choice is authored and reviewed. |
| Elbow/knee guides; crown, jaw, ear, brow/eye and mouth landmarks | Validation/painting targets, not bitmap pivots or additional cuts. Record side and pose where applicable. |

For each attachment record frame/crop origin, coordinates, seam endpoints or band polygon, receiving surface, hidden overlap region, tangent/orientation, compatible states, allowed transforms and reviewer/status. Begin with a proposed **8-pixel hidden overlap** at native body scale where geometry permits; this is an authoring starting point, not a supplied measurement or a substitute for seam review. Record actual approved margins. A margin that fails at 384-pixel body display height must be repaired or trigger the reserve/stop rules.

The shared hand is placed by its wrist interface with a fixed per-state transform in both outfits. Jacket cuffs can hide more wrist skin; tee arms must contain complete visible forearm/wrist skin beneath that same hand. A hand cannot acquire a jacket-colored wrist to make the join work. Sneakers similarly share the same ankle/contact geometry between outfits; O shoes are not rotated N shoes. No mirrored replacements are authorized.

### Outfit switching and deterministic layer order

Jacket off selects A02 + the matching A04–A07 arms, with A01 beneath. Jacket on selects A02 + A03 + the matching A08–A11 sleeves, with A01 beneath. Tee arms are omitted when jacket sleeves are active; no complete long-sleeve jacket or baked source torso remains under jacket-off art. Both configurations use the same state-matched hands, pants, shoes and assembled head. All jacket-specific reserves switch off with the jacket.

Use a front/pose-specific acyclic dependency graph, resolved deterministically. The initial order below specifies the intended local depth relationships; it is not a universal cast-wide stack:

1. Optional rear jacket lining, behind the tee and appropriate arm roots.
2. Sneakers, whole trouser legs, then the selected pelvis/waist over their hidden hip ends. N/O and O/N declare near/far leg order; NN uses an explicit stable tie order. Pant hems cover shoe uppers; intentional negative spaces remain transparent.
3. A01 skin/neck bridge and the assembled A25 head, positioned so head owns the jaw and A01 owns visible neck/chest. Head-to-neck hidden overlap does not introduce a duplicate chin or dark double edge.
4. N arm/hand assemblies behind the corresponding torso side edges. Within each assembly, draw hand wrist continuation before the arm/cuff that covers it.
5. Tee torso over upper arm/waist continuations; jacket front torso/panels/collar over tee and appropriate neck regions when on.
6. G arm/hand assemblies in front of tee/jacket, with each cuff over its hand's hidden wrist. G is designed so its shoulder root remains concealed by approved overlap/occlusion while its forearm reads in front. If that requires a separate cap/pass, count and declare the reserve surface.
7. Required local front collar/shoulder occlusion reserves, each constrained to its annotated region. Resolve both G arms with an explicit tie order and visible separation.

The front head's facial color replacement happens locally before that head surface enters the body stack. Keep neck/wardrobe outside face masks. Where the initial order cannot satisfy an actual interface, record the local DAG change and reserve usage; do not introduce an uncounted second pass or cover an entire failure with a new body render. Reject cycles and missing dependencies before rendering.

## 4. Material-mask and palette ownership

There are **ten baseline logical material-mask sets**: A03 and A08–A11 for jacket cloth (5); A16 and A17–A20 for trouser cloth (5). They are support coverage sets, not necessarily ten PNG files. Each selected reserve containing editable cloth additionally needs explicitly mapped coverage; packed storage may share channels, but cannot leave reserve cloth behind in the old color.

Each set distinguishes editable main cloth from protected light stripes/piping, zipper/teeth/pull, hardware, seams/details that need original color, and coverage/edge feather. Jacket fabric and pants fabric have different material IDs and independent ramps. Preserve source texture, folds, patterned weave and wear; do not replace them with flat fill. Document the exact mask/channel packing and per-surface mapping at freeze.

Tee, skin/neck, hands, all sneakers/soles/blue shoe detail, neutral head and facial patches are protected/original-color. There is no skin, tee, stripe, hardware or shoe recolor control. A garment's silhouette alpha is not its editable-color mask. An editable feather cannot extend into protected feature cores or recolor a background matte. Occlusion masks may only control coverage; they cannot carry painted repair RGB.

Candidate discrete palettes, subject to Gate A visual acceptance:

| Material | Original | Candidate 1 | Candidate 2 |
|---|---|---|---|
| Jacket main cloth | Source blue | Muted green | Muted burgundy |
| Pants main cloth | Source dark blue | Restrained charcoal | Restrained brown |

Original is an exact no-op. Define versioned, restrained material ramps retaining value/texture response, with explicit gamut/clipping behavior; no unbounded hue sliders or large lightness/material change. The existing [crop comparison](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/palette_lead/palette_crop_comparison.png>) is prior diagnostic evidence only: its unprotected zipper recoloring is a failure to prevent, not an accepted mask system.

RGB outside the declared editable/feather support must be byte-identical to original for a fixed geometry recipe; all coverage alpha must remain identical everywhere. Jacket changes must leave pants unchanged and vice versa. When jacket is off, changing the stored jacket palette must produce identical output. Approve all nine jacket/pants pairs at the seam stress states below. A failed candidate ramp is reported and repaired or explicitly returned for scope review; a missing required candidate cannot be silently called a pass.

## 5. C001 front head and face contract

### Neutral base and seven patches

Use a wardrobe-free bald C001 head whose source-specific skull, ears, weathered forehead, eyelids, nose, mouth, jaw, skin tone and asymmetry survive. No beautification toward Goose's portrait proportions. A01 owns neck/chest; A25 owns scalp/ears/face/jaw and only the concealed attachment overlap. No hair art, new accessory, collar or tee pixels are added to the head bank.

Start with the proposed **512 × 640 head-local canvas**, shared exactly by A25–A32 and all their masks. A practical native-scale initial coordinate window is source rectangle `[256,0,768,640)`, with head-local origin mapping to body `(256,54)` under the proposed source translation. Everything except the actual isolated head is transparent; this window is a coordinate proposal, not permission to retain its clothing/neck contents. Fix `head_attach` in both spaces before patch authoring. Keep local-to-body placement fixed across every expression and outfit, with no per-expression nudging or head enlargement. A larger working painting may be downsampled only through one declared, fixed export transform preserving this body scale.

Source head detail is limited by its full-body resolution. Close-up displays are inspection scales, not evidence that extra portrait detail was supplied. Judge identity against the original source, including at assembled-body scale.

The neutral base contains both neutral brows, both neutral eyes and the neutral lower face. Omission means inherit that region from A25; no neutral patch files and no blank placeholders. Persistent semantic controls are `LEFT_BROW`, `RIGHT_BROW`, `LEFT_EYE`, `RIGHT_EYE`, `LOWER_FACE`. The seven nonneutral assets are precisely A26–A32 in the ledger.

The lateral gaze target is toward **image-right / anatomical left**, with both eyes attending coherently to the same target. Both eyes carry baked eye shape, sclera, iris, eyelids and appropriate local shading. No independently translated pupil system. Give A28/A29 one `gazePairId` and reciprocal hard `requiredCompanions`. Selecting gaze in the viewer changes both eyes atomically.

A32 closes anatomical L (image-right). Its reviewed wink exception explicitly allows anatomical R to remain on A25's neutral eye. It does not authorize a lateral opposite eye, the other wink, or an arbitrary asymmetric eye mix. Keep the independent anatomical controls in data so the deliberate asymmetry and invalid pairing can be tested, with invalid export blocked.

### Feature ownership and lower face

Author C001-shaped masks, not Goose rectangles. Each feature has a protected core and a documented feather/skin-context band. A brow core covers both its neutral feature footprint and the selected brow's displaced footprint; the eye's editable weight is zero there. Conversely, brow replacement must not change the eye core. Inactive brow pixels must survive the paired-gaze test exactly. Lower-face editable support avoids both eye/brow cores. Any necessary skin-only overlap has a declared owner/order and must pass the specific mixed recipes.

Use stable local replacement order `LEFT_BROW → RIGHT_BROW → LEFT_EYE → RIGHT_EYE → LOWER_FACE`, but obtain independence from ownership masks and compatible painting, not order alone. Core protection applies to neutral and nonneutral selected brows. Required wrinkles may belong to the brow patch; an eye patch may not paint neutral skin over those wrinkles or brow hair to hide a seam.

LOWER_FACE owns mouth/lips/interior/teeth as needed, cheeks, chin/jaw shading and the required local skin transition. A30 is compact and uneven; A31 tests a bounded believable open-jaw/mouth performance. Neither includes a collar, chest, moving neck or a sixth control.

All required Gate A states use the ordinary head silhouette. **If a believable A31 genuinely needs a changed chin/cheek silhouette, stop.** Document a proposed extended-head group with its own alpha, neck/accessory compatibility and revised artwork count, then return for owner review. Do not clip the jaw to fit, pretend an implausible open mouth passes, or spend a lining reserve on another head. This preflight does not authorize the extension.

### Alpha and reference composition policy

Store declared sRGB straight-alpha RGBA PNG art and separate grayscale replacement weights. Freeze a reference profile before implementation output is accepted: `C001_GATE_A_sRGB8_integer_v1`. Use explicit integer rounding and stable layer order; no renderer-default blend behavior as the reference.

For head color replacement, mix patch RGB into the current RGB by its 0–255 ownership weight, rounding each channel once per patch with round-half-up. These weights are not repeatedly composited head coverage. After all active color replacements, apply the authoritative A25 silhouette alpha **once**, exactly. Ordinary neutral/patch combinations must have identical alpha at every pixel, not merely equal nonzero support. The alpha asset is support data derived/approved with A25, not another painted head state.

For subsequent body source-over composition, the reference uses straight RGBA bytes, sRGB-encoded channel arithmetic and round-half-up with sufficiently wide integer intermediates. For source alpha `As` and destination alpha `Ad`, use `D = As*255 + Ad*(255-As)`; output alpha is `round(D/255)`, and each output color is `round((Cs*As*255 + Cd*Ad*(255-As))/D)` when D is nonzero. Fully transparent output RGB is normalized to zero. This is an explicit experimental display profile; numerical parity alone is not approval of appearance. Material ramp math/quantization and display resampling must be separately versioned in the same profile.

Do not source-over all face patches with the silhouette alpha again; that recreates Goose's alpha accumulation. Do not threshold antialiasing away or copy white/magenta/green/checkerboard donor matte into retained edge RGB. Inspect partial-alpha pixels over light, dark, saturated and textured backgrounds. Deliberate zero-alpha texture padding is allowed in source/asset files if documented; file hashes still preserve those bytes. Exported composite transparent RGB follows the reference rule above.

Compare decoded arrays explicitly in **all RGBA channels**, including hidden RGB where file/pixel equality is claimed. Do not rely on an alpha-only bbox, a luminance threshold or a nonempty-image test. Mutating one visible RGB channel at one pixel while leaving alpha unchanged must fail comparison. The prior Goose analysis reports exact recomposition of its 18 previews but also this validator blind spot, M2 brow erasure, incoherent unpaired gaze and changed alpha versus base; these are separate observations. See [03_FIVE_SLOT_FACE_SYSTEM_ANALYSIS.md](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/03_FIVE_SLOT_FACE_SYSTEM_ANALYSIS.md>).

### Required face recipes

These eight front recipes are the minimum reviewed whitelist. Unlisted mixtures remain unreviewed, not universally valid. In the table, omitted slots inherit neutral A25.

| Test/preset ID | Active patches | Required observation |
|---|---|---|
| `F00_neutral` | None | Source-faithful neutral C001, no overlay files. |
| `F01_brow_L_only` | A26 | Only the selected brow/context changes; opposite brow and eye cores survive. |
| `F02_brow_R_only` | A27 | Equivalent R-only ownership check. |
| `F03_gaze_neutral_brows` | A28, A29 | Coherent lateral gaze; neutral brows remain byte-identical in their protected cores. Direct M2 regression. |
| `F04_compact_preset` | A26, A27, A28, A29, A30 | Complete five-slot preset: uneven brows, paired eyes, compact uneven smile. |
| `F05_open_on_base` | A31 | Believable bounded jaw/cheek/chin performance on neutral features. |
| `F06_uneven_gaze_open` | A26, A27, A28, A29, A31 | Mixed lower-face state works with uneven brows and coherent gaze. |
| `F07_wink_on_base` | A32 | Deliberate anatomical L closure with neutral anatomical R eye; approved pairing exception. |

Negative cases must reject A28 alone with the opposite neutral eye, A29 alone with its opposite neutral eye, and A32 with A29. Unknown patch/head revisions, wrong anatomical side and absent required selected assets also fail. An omitted neutral slot remains valid. Do not reject the intended wink merely because the ordinary lateral-gaze rule requires a pair.

## 6. Minimal local review viewer and validation

Build only a local static 2D reviewer after approval. It loads the frozen capsule from relative local paths. A loopback-only static file server is acceptable for browser loading; no backend, account, network asset fetch, database, runtime world or integration is needed. Bundle required client dependencies and record versions.

The viewer needs:

- A front body canvas and isolated-head inspection panel; source/master comparison overlay or side-by-side display; original-palette reset.
- Jacket on/off; independent L/R N/G arm choices; L/R N/O leg selectors with OO visibly unavailable and explained. Automatically resolve matching hands/shoes and stance pelvis; reject mismatches in imported recipes.
- The eight approved face recipes and constrained anatomical controls; paired gaze is atomic, wink uses its explicit exception, and invalid/unreviewed mixes show a concrete reason and cannot export as approved.
- Independent discrete jacket/pants palettes; mask, anchor, contact, ownership and layer-order overlays; light, dark, magenta, green and textured background choices; native and intended-size review.
- Recipe save/reload, reset, deterministic transparent PNG export, current validation status/reasons, validation JSON export and surface/reserve ledger display.

Only `front` is available. Out-of-scope controls must be absent or clearly unavailable; do not create empty future-view asset records to imply coverage. Missing art fails visibly instead of falling back to Goose, the gray mannequin, a whole-body master or an unrelated limb.

Canonical pixel rendering/export must use the declared CPU/reference buffer and a pinned PNG decode/encode path, with no implicit ICC conversion or canvas premultiply/unpremultiply round-trip as the source of truth. Canvas/GPU display may present that buffer, but canvas readback is not the all-channel equality oracle. Record browser/OS and display scaling separately from canonical render hashes. A second independent checker must compare decoded output arrays rather than just trust the viewer's “pass” badge.

### Exact review coverage

| Review | Required cases |
|---|---|
| Body geometry | **24:** jacket `{off,on}` × arm pair `{NN,NG,GN,GG}` × leg pair `{NN,NO,ON}`, original palette and F00. All must use the saved parts and data. |
| Palette seams | All **9** jacket/pants pairs on GG with each supported leg pair, in both outfit configurations: 54 runs, including deliberate jacket-off duplicate-output checks. These exercise shoulder/cuff and both offset hem/waist risks. |
| Isolated face | All 8 face recipes at visible-head display heights 128 and 256 and native inspection, over the background choices above. Inspection upscaling does not create source detail. |
| Face on body | All 8 face recipes on jacket on and off with body NN arms / NN legs; also F04, F06 and F07 on GG / NO and GG / ON with each outfit. Confirm neck/collar and palette-independent head placement. |
| Rejections | OO legs; lone lateral eye; lateral-eye/wink mismatch; unsupported view, mirror or closed jacket; wrong fit/state/side/hand/shoe/head revision; missing required asset; cyclic layer DAG; unresolved reserved dependency; unreviewed face mix. |

Every valid exported recipe records identity/profile/calibration revisions, source authority/hashes, view/frame/root/trim offsets, selected surface IDs and variants, resolved hand/shoe/pelvis IDs, interface compatibility, layer DAG/order, material/mask/ramp versions, head revision/placement, slot map/preset/companions, alpha/composition profile, mirror status, provenance and QA status. Saving/reloading preserves those decisions; no runtime inference from legacy polo/plaid/loafers labels.

### Acceptance checks and stop conditions

| Check | Pass requirement / failure consequence |
|---|---|
| Input and inventory integrity | All referenced files decode, sizes/modes/versions/hashes match, IDs are unique, all 32 baseline surfaces exist, reserves are declared and total is ≤38. Support masks cannot conceal extra painted variants. Empty SPEC_ONLY data is not a pass. |
| Registration | Root/metadata exact; no pose-specific scale, mirroring or manual expression offsets. Declared planted contacts stay within 1 native authoring pixel of their targets; supporting N contact stays stable in NO/ON. Exact wrist/ankle attachment compatibility in both outfits. |
| Source fidelity | Compare aligned jacket-on, NN arms/NN legs/F00 at original palette to the original master. Silhouette IoU ≥0.97 at alpha >127 is a review flag/target; record actual value and cleanup differences. Owner must accept identity, proportions, stance, open jacket, stripes, cloth texture, shoe styling and wear. A high IoU cannot override wrong art. |
| Joins and depth | No unintended hole, guide/mannequin leak, broken stripe, floating cuff/foot, duplicated hand, bad skin seam or impossible occlusion at body heights 1536, 768 and 384. Review annotated shoulder, wrist, neck, waist/crotch and ankle regions. Annotate intentional negative spaces. |
| Independent recombination | All 24 required body recipes work with the ledger's surfaces, bounded reserves and metadata. Per-combination whole-body or torso repainting, more than four local lining/occlusion additions, more than two pelvis transitions, or dropping a required pair triggers stop/review. Composite reference PNGs are evidence, never replacement source sprites. |
| Palette | Original no-op; exact unchanged alpha; exact RGB protection outside editable support; independent jacket/pants changes; all nine pairs retain trim, folds, weave, wear and plausible material response without fringe/clipping at review sizes. |
| Face ownership | Each unselected protected core remains unchanged; paired gaze preserves neutral brows and selected uneven brows; lower-face changes preserve eye/brow cores. Approved wink works; unsupported gaze mixtures reject. C001 identity survives all eight recipes. |
| Head alpha and bounds | Every ordinary face render has exactly A25's alpha and fixed placement. No collar/clothes in head patches, matte strips, fake clipped jaw or unannounced head-state group. An essential extended silhouette returns for revised scope. |
| Determinism and sensitivity | Save/reload reproduces canonical RGBA exactly for every required reference render. Compare decoded arrays and report per-channel difference counts/max error. A one-RGB-pixel mutation with unchanged alpha must fail; changed alpha, missing ref and invalid companion controls also fail with specific errors. File SHA and decoded-pixel SHA serve different purposes. |
| Visual authority | Numeric checks do not certify painterly quality, anatomy, weight or identity. Independent tester records technical/visual findings; owner accepts source fidelity and artwork. No final Gate A pass while a material failure or required art acceptance remains unresolved. |

The current research/preflight is not a record of these tests passing. No reference implementation or new C001 art exists yet.

## 7. Unresolved risks that can fail Gate A

The following are material experimental uncertainties. They are bounded by review tasks and stop rules; no required source package is currently missing. A future failure is useful evidence and must not be hidden to obtain a “ready” or “pass” label.

| Risk | What remains unknown | Resolution / failure trigger |
|---|---|---|
| RISK-01 Source fidelity under decomposition | Whether cuts/repairs preserve the original face, short/slim proportions, texture and clothing decisions. Rebuild similarity does not prove it. | Source-aligned neutral and intended-size owner review. Stop on identity/wardrobe drift even if IoU passes. |
| RISK-02 Numerical calibration | Actual shoulder/hip/wrist/ankle/head anchors, contact curves and accepted overlap margins are unauthored; proposed floor registration uses visible support as an initial guide. | First build task must populate and review them before reusable interfaces are frozen. A source-scale fit that needs per-state scaling or persistent re-registration fails. |
| RISK-03 Jacket-off anatomy | Bare arms, full tee width and hidden shoulder/underarm continuation are not supplied. | New C001 skin/tee drawing with consistent light and believable anatomy. Mannequin substitution or baked jacket remnants fail. |
| RISK-04 Open-jacket geometry/depth | Zipped catalog cannot reveal all open-panel returns, lining and collar/armhole behavior. | Source-led open structure, hollow openings, bounded reserves. Uncounted layers or a complete torso per arm pair fail. |
| RISK-05 G arms and shared wrists | Stripe continuity, shoulder pull, foreshortening and wrist/cuff interfaces may not work independently in NN/NG/GN/GG and both outfits. | Whole-arm authoring and shared-hand tests. Crossing/interpenetrating GG or outfit-specific extra hands exceed this contract. |
| RISK-06 Offset stance/pelvis | Independent O legs may pull crotch/seat folds or create unstable weight bearing. | Review NO and ON with fixed supporting foot; at most two declared pelvis transitions. OO remains rejected. More coupled body repainting fails. |
| RISK-07 Footwear/contact | Native source shoes do not provide O projections or hidden ankle coverage; hems may expose seams. | New O feet plus contact/hem review in both outfits and palette extremes. Floating/rotated shoes or foot-root drift fail. |
| RISK-08 Head detail/identity | Small source head may be insufficient for clean enlarged inspection; new expression painting may smooth age or change likeness. | Preserve native body scale, compare against source, approve neutral before patches. Portrait-size beautification or unreviewed invented detail fails fidelity. |
| RISK-09 Face ownership/seams | C001-shaped masks may prevent brow erasure but create new skin/wrinkle seams in F03/F04/F06. | Protected cores, declared skin overlap, all-channel and visual mixed-recipe checks. Reordering alone is insufficient. |
| RISK-10 Gaze/asymmetry semantics | Side labels, neutral fallback and wink exception may be confused or permit incoherent attention. | Atomic pair, reciprocal companions, explicit L-wink/neutral-R whitelist and negative tests. Any silent unsupported pair fails. |
| RISK-11 Bounded open jaw | A convincing A31 may require an external contour change or neck deformation. | Try only a plausible bounded ordinary state. If the intended performance needs silhouette extension, stop and propose revised group/budget; do not force it into the mask. |
| RISK-12 Alpha/edge quality | Source green edges, catalog magenta, donor mattes, hidden RGB and browser premultiplication can produce fringe or change alpha. | Clean derivatives only; authoritative head alpha once; declared decode/composite/export path and background QA. Never alter source to hide a failure. |
| RISK-13 Material masks/ramps | Existing crop trial lacks semantic protection; new poses/reserves can develop mismatched cloth color, crushed folds or recolored trim. | Explicit per-surface coverage, protected cores, nine pairs and independent controls. Visual quality decides viable ramps. |
| RISK-14 Determinism/validator coverage | Browser color conversion, rounding, codec differences or alpha-only comparisons can make exactness claims false. | Versioned canonical buffer, all-channel independent check, RGB-only negative control and recipe reopen tests. Display screenshots alone cannot prove equality. |
| RISK-15 Authoring leverage/budget | Required clean art may take more local layers or coordinated repainting than the 32+6 design allows. | Count every render-depth/art variant, record repair effort/rejected combinations. Exceeding the ceiling or bespoke combined bodies returns a failed/narrowed proposal. |
| RISK-16 Review/checkpoint reproducibility | A tester may receive stale expectations, hidden local paths, missing dependencies or only the author's self-comparison. | Freeze all governed files, portable relative refs, independent rerun procedure, expected artifacts and external archive hash. Missing reproducibility blocks Gate A acceptance. |

No unsupported multi-view, hair, arbitrary shoe-style or cross-character claim is needed to resolve these risks. Keep those questions outside this experiment.

## 8. Frozen checkpoint for an independent tester

This defines a future deliverable; **do not create it during this preflight**. After an approved Gate A build, freeze one candidate directory and ZIP, for example `C001_ZANT_GATE_A_R1/` and `C001_ZANT_GATE_A_R1.zip`. Do not point the tester at a live authoring folder. Repairs produce R2 and a new ZIP/hash, preserving R1 and its report.

Required checkpoint layout and contents:

| Path | Required content |
|---|---|
| `START_HERE.md` | Candidate ID/status, Gate A-only scope, exact setup/run commands, prerequisites and versions, offline/loopback behavior, output location, test sequence, known issues, and stop/failure reporting. No implicit permission for Gate B or integration. |
| `contract/` | This preflight, controlling 04/05 copies with hashes, any explicitly approved Gate A amendments, schema/reference composition profile, calibration/anchor/contact/interface records and source-registration decision. Include owner build authorization as a distinct record; do not invent it. |
| `manifest.json` | Capsule/identity/profile/head revision; every governed relative file path, byte length and SHA-256; surface ledger with reserve reasons; material-mask mappings; supported/rejected state matrix; provenance and QA status. Manifest excludes its own checksum to avoid recursion; provide manifest and archive hashes externally with the handoff. |
| `references/` | The unchanged C001 original master, calibration/fit evidence, wardrobe, kit and rebuild necessary to review fidelity, plus source roles/hashes. Deduplicate exact copies with explicit equivalence records. Include relevant Goose failure evidence/notes clearly labeled reference-only, never runtime art or quality target. |
| `assets/` | Exactly the 32 logical surfaces and only declared used reserves; clean straight-alpha exports, head silhouette, ownership/material/occlusion masks and documented packing. Include editable authoring sources or a fully documented reproducible export from archived sources. All retained provenance and export settings resolve within the packet. |
| `data/` | Fully populated Gate A asset/compatibility/layer/head/material definitions, 24 body recipes, 8 face recipes, palette stress recipes and explicit negative fixtures/expected rejection reasons. No uncreated SPEC_ONLY records presented as valid assets. |
| `viewer/` | Static reviewer, bundled/pinned dependencies, reference renderer and export path; no remote CDN or absolute workspace dependency. Local launcher serves only the packet on loopback when necessary. |
| `validation/` | Runnable checks and instructions, independent decoded-RGBA comparison method, complete expected case list, contact/join annotations, all-channel/RGB-only negative controls, and precise machine-readable pass/fail fields. Record actual runtime/library versions used, not assumed versions from the research pass. |
| `expected/` | Frozen transparent reference renders, decoded-pixel hashes, contact sheets, masks/anchors inspection captures and source comparison evidence for required cases. Tie each image to recipe/profile/asset hashes. Clearly distinguish author-generated expectations from owner-accepted art and independent results. |
| `author_results/` | Executed command/session transcript, validation JSON, all-channel difference statistics, rejection results, actual surface/reserve/repair ledger, visual review notes, known defects and outstanding acceptance. A claimed pass needs real outputs, not a checklist ticked from this plan. |
| `TESTER_INSTRUCTIONS.md` | The independent procedure below, report template, severity/failure criteria and requested final verdict. Tester outputs go to a separate review directory, never overwrite the frozen packet. |

All paths must be relative and case-exact within the packet. No dependency on the original workspace, generated-image cache, user account, external service, unarchived authoring tool state or an unfrozen live branch. Freeze necessary redistributable runtime dependencies or supply a tested portable setup with exact prerequisites; do not leave an unexplained install/network step. Hashes certify bytes; they do not certify aesthetic quality.

Independent tester procedure:

1. Verify the externally supplied archive hash, extract to a fresh location, verify manifest/file hashes and resolve all relative dependencies before running the viewer. Read scope, known issues and approval status.
2. Run the documented startup from the frozen packet and write results outside it. Confirm the viewer uses its declared assets, not cached/live workspace content or a whole-body fallback.
3. Re-run the 24 body cases, palette stress set, eight isolated faces and assembled-head stress set. Inspect source fidelity, all annotated joins, root/contact, core ownership, collar independence and backgrounds at declared display sizes. Record screenshots and specific failing recipe/region IDs.
4. Save/reload recipes and independently compare every canonical reference render in all decoded RGBA channels. Report actual differing pixel/channel counts and max deltas, separate from encoded PNG hashes. Do not treat the author's expected renders as independent art approval.
5. Exercise negative fixtures in a disposable copy/in memory: RGB-only one-pixel mutation with unchanged alpha, changed alpha, missing selected asset, bad hand/foot interface, invalid gaze/wink mix, OO, unsupported view and cyclic layering. Each must fail for the expected reason. Reverify the clean packet afterward; no repairs during testing.
6. Report `PASS`, `FAIL`, or `BLOCKED` for Gate A only, with evidence paths, environment, case totals, failed/untested cases, surface count, reserve usage and limits. An inability to run independently is blocked, not passed. Leave owner artistic acceptance explicit when outstanding. No tester rerun or pass starts Gate B.

## 9. Proposed build sequence after explicit approval

This is the work that would become authorized by a subsequent owner approval of this preflight; none of it is executed now.

1. Create a separate derivative workspace and provenance ledger. Place/review source registration, numerical anchors, contact curves and the fixed head/neck interface; preserve source files.
2. Establish clean neutral front parts and the neutral head; check original-palette jacket on/off fidelity before producing alternate states. Reject identity or open-jacket drift early.
3. Author whole G arms/shared hands and O legs/shared feet; exercise all 24 body combinations; consume only evidenced reserves. Stop on excessive coupling or art budget failure.
4. Author the seven C001 face patches and ownership masks, freeze the ordinary silhouette, and prove the eight required facial recipes plus negative pairings. Stop if A31 requires extended head geometry.
5. Author the ten baseline material-mask sets and any used-reserve coverage; calibrate restrained ramps and test all required palette pairs/joins.
6. Finish the minimal local viewer/reference validation, record actual results, freeze a candidate and hand it to an independent tester. Owner acceptance of the artwork and Gate A result remains explicit. Stop at Gate A regardless of the result.

## Final verdict and authorization boundary

**READY TO BUILD GATE A**

There is no known missing-input or unresolved scope blocker to starting this bounded experimental build. Numerical anatomy anchors, clean hidden surfaces, masks, alternate limbs and C001 facial art are required build outputs, not already completed inputs. The risks above remain unproven and can still cause Gate A to fail.

**STOP — awaiting explicit owner approval of this preflight before implementation.** Research approval and this readiness verdict do not supply that approval. No Gate B, additional-character work or integration follows automatically.
