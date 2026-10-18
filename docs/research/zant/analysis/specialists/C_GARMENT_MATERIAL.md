# Specialist C — garment and material architecture

Analysis only, 2026-10-18. No supplied art was changed, no runtime asset bank or implementation was made, and no final artwork was generated. The output images are source-inspection contact sheets on a neutral background. All cited diagnostics were visually inspected.

## Evidence and authority

The authority for the intended person is `modular/NEUTRAL_CHARACTER_MODULAR_REBUILD_V03_2/source_masters/Cxxx_source_neutral_rgba.png`, duplicated from the original masters; the separate `wardrobe/Cxxx_clothing_inventory_rgba.png` files show garment reference imagery. Kit plates and rebuilt composites are secondary construction evidence. Metadata cannot overrule these images.

Evidence root: `../evidence/garment_C/`. The reproducible diagnostic script is `garment_diagnostics.py`; measurements are `representative_measurements.json` and `gear_remaining19_measurements.json`. Its source paths are relative to the workspace. `representative_A.jpg`, `representative_B.jpg`, eight `Cxxx_source_wardrobe_kit.jpg` plates, and `gear_remaining19.jpg` were inspected. No recolor was performed: palette findings below separate observed image content from proposed production technique.

## Representative findings

| Case | Visually observed evidence | Consequence |
|---|---|---|
| C001 | Original is bald man in white crew-neck T-shirt, open blue track jacket with continuous light sleeve/shoulder stripes, dark blue track trousers, worn light sneakers. Inventory jacket is presented closed/zipped; source is open. Inventory includes magenta edges, a strip of calibration arm, and plate guides. | Best cheap patterned-limb test, but the catalog jacket is a reference for another closure state, not an overlay. `garment_catalog_v03.json` saying polo/plaid/loafers is plainly stale. |
| C003 | Original has burgundy leather jacket, leopard camisole with lace neckline, black jeans and burgundy ankle boots. Kit dressed figure/rebuild omit the jacket. Inventory jacket has rich specular folds and dark interior lining. | Restoring original silhouette is required before treating the rebuild as a baseline. Metadata track jacket/sneakers mislabels leather/boots. Jacket off is a real alternative configuration, not original-fidelity success. |
| C018 | Original has leopard outer jacket over black shiny blouse, red flared trousers, black ankle boots and jewelry. Kit/rebuild dressed figure lacks the leopard jacket. Original alpha extent is x250–768 versus rebuild x286–732, with same y36–1452. | The 72px width loss is measured evidence of missing outer volume, not a numerical identity-distance metric. Preserve fur pattern and bulk; no generic torso stretching. |
| C020 | Long dark coat over black button shirt and calf-length black skirt/tights with bright red running shoes. Inventory shoes are severely truncated at the catalog crop; kit supplies complete small shoe references. | Coat front/rear and skirt are coupled drape states. This is not two independently swinging trouser legs. The catalog shoe crop cannot be promoted as complete footwear. |
| C028 | Source helmet, vest, gloves, knee pads, belt/pouches and visible blue reflective sleeve/vest strips. Kit separates many gear references; rebuild shows uncovered head, uniform torso and bare hands. | Gear-off rebuild cannot establish fidelity to fully dressed source. Gear needs pose/view sockets plus occlusion; rubber, cloth, transparent visor and reflective band are separate material semantics. |
| C033 | Purple textured/mesh jersey over white T-shirt, loose pale denim and high tops; source chain missing from catalog declaration and rebuilt visible styling. | Good low-complexity layering candidate but less diagnostic than C001 for full-sleeve continuity. Mesh texture should survive recolor. |
| C034 | Plaid open short-sleeve shirt over white vest, dusty/marked tan work trousers, sneakers; glasses hang at chest in source. | Plaid alignment and grime must not become generic hue replacement. Gear metadata is empty despite glasses. Rolled/short sleeves and open front are shape states. |
| C042 | Striped leather sleeves, floral dress, ripped tights on one knee, boots and fingerless gloves in source. Kit/rebuild omit the gloves; gear metadata is empty and gear catalog fully transparent. | Floral skirt is whole drape silhouette; torn tights and glove handedness prohibit casual mirroring. Missing gloves are an undeclared source-isolation gap. |

The representative source/rebuild dimensions are 1024×1536, kits 1536×1024, wardrobe catalogs 737×737 and gear catalogs 737×461. Same canvas size does not establish anchors, hollow openings, hidden continuation or layer compatibility. The modular tree contains no file whose name indicates a garment material mask, palette, occlusion mask, layer or anchor export. README explicitly calls inventories authoring references rather than engine overlays.

## V03.2 repair is a 25-sheet subset

`metadata/gear_accessory_catalog_repair_v03_2.json` scopes its repair to 25 formerly flagged catalogs. Its 13 recovered assets / 30 missing declared items / 5 clean complete / 2 clean partial / 18 clean empty statements are **repair-subset reporting**, not counts of all actual items in the cast. Do not use them to estimate total usable gear.

The remaining 19 are C001,C008,C009,C010,C013,C018,C020,C023,C027,C028,C031,C033,C034,C036,C038,C040,C041,C042,C044. Actual alpha audit: 18 nonempty, one empty (C042). Visual inspection of `gear_remaining19.jpg`: 17 of the 19 contain clothing/footwear and/or plate guides; C028 is the one nonempty sheet that appears gear-only. Of the 11 remaining entries declared `[]`, 10 still contain pixels. Examples: C001 trouser cuffs/shoes/guide box; C020 skirt/coat hem/red shoes/guide box; C033 shoe tips/guide box; C034 trousers/shoes/calibration fragments/guide box; C041 boot tips; C044 trousers/boots. C010 has clipped clothing and boots alongside gloves/pads. C027 includes trouser/boot fragments above its gear. C040 includes trousers/boots above goggles/gloves. These sheets need isolation review regardless of unflagged status.

## Recommended garment unit

A garment is a versioned **family of authored view/fit/shape/pose states**, with references to the render layers it needs. It is neither a whole inventory sheet nor a universal colorable torso. A logical garment can have several images and masks. Garment family identity must keep cut, closure, sleeve length, drape, material, pattern and characteristic wear distinct.

Minimum contract per state:

1. Family/version, provenance back to original source and explicit art approval; shape-state ID (open/closed/rolled/hem configuration); canonical view; compatible fit/calibration versions; relevant limb/stance states.
2. Full-canvas registration or crop plus exact integer origin; named shoulder/neck/waist/wrist/ankle attachment data as applicable; coverage/occlusion and draw ordering; authored overlap beyond the visible join.
3. Neck/arm/waist interfaces whose hollow regions reveal the intended inner layer. A dark lining rendered in the open chest of a reference jacket is not automatically transparent. Armhole coverage must survive both allowed arm states.
4. Front and rear layers where needed; limb-aware sleeves; optional separate collar/lapel/cuff/cap pieces only where they improve actual painterly continuity. No requirement to expose every semantic joint as a sprite seam.
5. Mask channels with semantic names, base coverage alpha, protected pattern/trim/detail, approved color ramps/range and material interpretation; mirror safety and asymmetry notes; QA at source scale and intended display scale.

| Garment problem | Contract |
|---|---|
| Base top | Torso owns neckline/hem; sleeve belongs to garment-aware arm assembly. Extend skin/inner shirt underneath hems and openings so removal reveals complete authored material. |
| Outerwear | Open/closed states are different shapes. Rear/lining behind inner top, front panels over it, sleeves attached to view/pose states. Original outer volume is preserved. |
| Sleeves/arms | Author whole shoulder-to-wrist silhouettes for each useful state, including folds/stripes/foreshortening. Use joint targets for alignment, not visible elbow slicing. Attach separate hand only when cuff conceals the join; shoulder overlap hides under torso/cap. |
| Trousers | Waist/pelvis overlap with whole hip-to-ankle legs. A shared crotch/seat transition belongs to an explicitly compatible stance, not arbitrary rotated thigh halves. Validate hem/shoe relation. |
| Skirts/dresses | Connected silhouette with drape-state ID linked to stance; legs/tights behind and revealed only where appropriate. Do not split floral skirt into independent left/right trouser substitutes. |
| Long coats | Rear tails/lining behind legs, front panels over them, sleeve states and hem/drape states. Test crossing/offset legs before supporting them; author missing inside fabric. |
| Shoes/boots | View- and pose-specific foot orientation. An ankle seam can be hidden by a hem, sock or boot top. Tall boots own part of lower-leg silhouette; cannot assume universal foot swivel or mirrored wear. |
| Hands/gloves | Hands remain anatomy, gloves are removable posed hand surfaces with correct wrist coverage. Fingerless gloves need intact fingers beneath; glove-on/off must not alter arm length. Watches/bracelets stack separately where visible. |
| Gear | Chest/waist/thigh/head/wrist sockets are pose/view-specific attachment data with orientation/occlusion; rigid gear can use small approved transforms, straps often need authored variants. Armor does not replace body underplate. No fixed gameplay meaning. |

Fit compatibility is explicit, not a claim that eight classes make all clothes interchangeable. Use the eight references as drafting seeds; character calibration preserves shoulder drop, belly, hip, limb lengths and stance. Garment compatibility should name reviewed fit/calibration sets or bounded drafting envelopes. Reuse a pattern/cut family while authoring another fit; do not simply stretch C001 onto C028 or C034. Hand/boot sizes and sleeve/pant lengths are part of fit. Mirroring is opt-in after inspecting buttons/zips, sleeve bands, logos, pockets, jewelry, scuffs, hair and tears; anatomical left/right IDs survive view changes.

## Palette and material recommendation

The observed art contains folds, weave, reflective areas, wear and multiple purposeful colors, so recoloring needs per-material control. No supplied garment has the semantic mask exports needed to establish this pipeline as proven.

| Approach | Value here | Limit/risk |
|---|---|---|
| Semantic coverage masks + material-specific color ramps | Recommended default for relatively plain cloth: preserve authored structural values/detail, separate trim and metal, edit only named material. Masks made while painting are more reliable than hue-threshold extraction later. | Needs new masks, gamut/range constraints and visual approval. A mask alone cannot change material or shape. |
| Grayscale/value-preserving material treatment | Useful source of fold/highlight structure for C001 cloth and C033 jersey; keep residual texture and material-specific shadow/mid/high response. Decode color appropriately; preserve coverage alpha and avoid baking matte into edges. | A single grayscale multiply can crush dark cloth or wash highlights; white-to-dark and near-black-to-light changes require authored ramps. Brightness change may need new painting. |
| Indexed final palette | Small data footprint and exact swatch replacement for genuinely indexed art. An indexed **semantic label map** can identify editable regions. | Quantizing this painterly RGB source to a small final palette risks texture/AA/color loss. Do not convert corpus by default. |
| HSV/HSL/hue rotation | Cheap diagnostic for already saturated, single-material regions. | Not a robust master system: white/black have little hue, HSV value is not perceived luminance, skin/zip/stripes/reflectors can be accidentally shifted, and wide shifts clip gamut. |
| Authored alternate texture/colorway | Best for important plaid/floral/leopard combinations, major value/material changes, characteristic wear or approved identity styling. | Costs artwork; bounded curated options keep the person intentional. Share the geometry contract but treat alternate colors as authored evidence. |

Practical proposal: a garment retains original approved raster/texture and alpha plus soft semantic masks and per-material ramps. Recolor only the allowed material range; retain seam/trim/pattern overlays or protected original color where needed. Composite with explicit straight/premultiplied convention and edge QA on dark/light backgrounds. A fabric ramp may preserve original value/detail within a tested range, but exact luminance preservation across all requested hues is not guaranteed by this analysis. Mark palette combinations approved after viewing. Shape variants (open jacket, rolled sleeve, hem length, boot shaft, drape) must never be encoded as palette variants.

Specific limits: C001 light stripes, zipper, shirt and shoe wear stay protected from blue cloth edits. C028 blue reflective bands, visor, rubber/armor and cloth need separate materials. C003 leather highlights cannot be recolored into cotton. C034 plaid bands and trouser grime need protected structure; C018 leopard/rosettes and fur must remain recognizable; C042 floral motifs and intentional tights damage need authored alternatives or careful selective masks. C020 near-black coat cannot be usefully hue-shifted without an explicit value response.

## Small first proof, garment contribution

C001 is preferable to C033 for a falsifiable first test: no hair/gear burden, but the continuous sleeve stripes, open jacket, cuffs, trouser side stripes and sneaker hems expose cheap-rig failure. C033 is simpler and therefore a fallback if C001 hidden interfaces prove too expensive; it would not test long-sleeve stripe continuity as strongly. This selection does not establish general fit or long-garment success.

Minimum scope proposal for lead integration:

- One C001 identity and male_short_slim drafting seed plus C001 calibration; four canonically aligned body views. Preserve source irregularity rather than tracing the mannequin as identity.
- Two dressed configurations: white T-shirt + track trousers + sneakers, with the source-style **open** track jacket added/removed. This tests an actual independent garment configuration; a second unrelated cut is deferred. It does not prove cross-character garment sharing.
- Each anatomical arm: relaxed and one useful forearm-forward/bent gesture, independently selectable; garment-aware whole-arm sleeves for jacket-on and short-sleeve/exposed-arm assembly for jacket-off. Authored hands with relaxed and gesture orientation as needed; do not rotate a neutral hand to fake the grip. Four arm combinations must look intentional.
- Legs: relaxed planted and a modest authored offset/weight-shift-compatible state per side; validate supported pairings so arbitrary states cannot create a floating or unbalanced body. Whole trouser-leg/seat transitions, shoe orientation and hems are authored. Lead may select one smaller asymmetric stance test; full walking is outside first proof.
- Functional layers per view: skin/neck core; far arm assembly; far leg/foot; near leg/foot; tee torso; jacket rear/lining where visible; jacket front panels; near arm assembly; hands; head. Pose-specific occlusion can interleave hands/forearms at the torso. Do not force this into one immutable order list: view/pose state supplies ordering. Rear/frontal jacket ordering is part of garment contract.
- Two editable channels: jacket main fabric and trouser main fabric, independently set, each with original plus two restrained approved test ramps; protected light stripes/zipper and T-shirt/shoes. A third T-shirt channel is useful later, not necessary to disprove the first material path. Include original palette as baseline.
- Existing usable input is **source/reference**: source neutral front, wardrobe design/textile/footwear references, C001 calibration, male_short_slim fit reference. None is a ready-made whole-body modular four-view bank. Front can be extracted only as a working start; missing shoulders/underarms, jacket-off continuation, hand/skin reveals, exact open jacket and occlusion require authored repair. New art is required for three additional views and useful pose variants in all four views, plus hollow interfaces, layers and material masks. Counts of logical slots must not be misreported as counts of ready PNG files.

Failure tests: visible stripe discontinuities/circular elbow cut; shoulder or crotch gaps; exposed calibration/mannequin or baked clothing beneath removal; wrong open/closed jacket state; unstable foot contact/limb lengths across views; color bleed into stripes/skin/zipper/shoes; removal losing source-specific proportions; handedness/errors after mirroring; pose combination looking pasted at intended display size. Tests should compare against an owner-approved C001 master and an intentionally authored composite, not the rebuilt composite alone.

## Decisions and unknowns

Recommend a semantic alignment skeleton with authored garment-aware whole-limb output and small explicitly approved transforms. Garment topology is family-specific. Keep pattern-rich/long garments for later stress stages. Do not conclude the entire 44 cast is modular-ready, and do not conclude the 25-sheet gear repair cleaned the whole bank. Hidden continuation and genuine four-view/pose fidelity remain new-art questions to resolve in the bounded proof.
