# Next action brief — owner review

**The approved analysis is complete. Recommend a source-faithful, calibrated hybrid: shared semantic anchors, authored garment-aware whole limbs, four canonical views, material masks, and identity-specific head packages. Retain five facial controls with revised mask ownership, authoritative silhouette alpha and reviewed gaze/mix compatibility. Specify C001 as the first bounded proof.**

This is a recommended standard and a falsifiable experiment, not a claim that the current library already works as a production character creator. The supplied material supports the approach and reveals concrete failure modes. Missing views, hidden continuation, new limb/head art and multi-identity fitting still require an owner-approved build/art phase.

## Owner reading path and delivered files

Start with [04 — Recommended standard](04_RECOMMENDED_ZANT_MODULAR_STANDARD_v0_1.md) and [05 — First proof specification](05_FIRST_COMBINATORIAL_CHARACTER_PROOF_SPEC.md). Use the evidence reports to challenge the recommendation:

| Deliverable | Review purpose |
|---|---|
| [01 — Source truth and forensics](01_SOURCE_TRUTH_AND_FORENSICS.md) | Verified corpus, source authority, measurements, visual drift, dirty/cropped catalogs and metadata limits |
| [02 — Architecture options](02_ARCHITECTURE_OPTIONS.md) | Fit/rig alternatives, all three limb strategies, garment/palette tradeoffs and hypothesis dispositions |
| [03 — Five-slot face analysis](03_FIVE_SLOT_FACE_SYSTEM_ANALYSIS.md) | Actual90 slots/18 previews/five masks/base, independent validation, mixtures, gaze, extremes, alpha and context defects |
| [04 — Recommended modular standard v0.1](04_RECOMMENDED_ZANT_MODULAR_STANDARD_v0_1.md) | Concrete authoring contract, coordinate/view/layer/head/garment/material rules and proposed schema |
| [05 — First combinatorial proof spec](05_FIRST_COMBINATORIAL_CHARACTER_PROOF_SPEC.md) | C001 selection, exact sparse state/art budget, staged gates and measurable failure conditions |
| [06 — New-character workflow](06_NEW_ZANT_CHARACTER_TO_DATABASE_WORKFLOW.md) | Person-first art development through calibrated four-view assets, slots/masks, QA and candidate-family promotion |
| [07 — Gaps, risks and required new art](07_GAPS_RISKS_AND_REQUIRED_NEW_ART.md) | Prioritized production gaps and limits on expansion |
| [08 — This brief](08_NEXT_ACTION_BRIEF.md) | Decision summary and the stop/review boundary |

All six specialist responsibilities were covered. A/B handled source forensics and body/view/pose; C/E handled garments/materials and ZANT workflow; D handled head/face/hair; the lead separately documented F's read-only surrounding constraints and synthesized the recommendation. Independent review of the face portions of04/schema identified and resolved explicit alpha-policy, slot-mask ownership and omitted-neutral-selection gaps. The six role reports remain under `specialists/`.

## Findings that drive the decision

- **The originals survive intact.** All44 neutral source masters and44 wardrobe sheets are present; preserved counterparts match. The eight fit images duplicate nominated calibrations. They support common semantic references, not eight proven independent chassis.
- **A common canvas is not a common root.** Original alpha>0 bottoms span159 pixels. Source/rebuild pairs preserve each person's vertical extent, but source-to-rebuild silhouettes vary (median IoU0.97564; C0270.79322). Metrics do not establish identity or garment fidelity.
- **Rebuilds can omit defining clothes.** C003 loses the burgundy jacket, C018 the leopard outerwear, C028 protective gear, and C042 gloves. Original art remains authority. C010 still carries a thigh holster despite the gear-removal intention.
- **Catalogs need selective recovery.** 38/44 wardrobe sheets touch a canvas edge; confirmed cases include clipped shoes and mannequin fragments. The gear repair covers25 sheets. Of the other19,17 show clothing/footwear or guides, C028 appears gear-only but has clipped references, and C042 is empty. File counts and old labels are not usable-item counts.
- **The face storage proof passes a stronger check.** All18 saved previews recompose exactly in every RGBA channel; all90 slots match independent extraction. The supplied validator can miss RGB-only changes, so its pass alone is insufficient, although the actual previews pass independently.
- **Five semantic controls do not guarantee five independent paintings.** Paired gaze10 combined with neutral brows erases eyebrow content; unpaired10/12 eyes direct attention inconsistently. Some supplied presets contain bright matte contour strips. Base/slots carry portrait hair/neck/clothing context, and ordinary overlays accumulate alpha rather than preserving the base alpha raster. These require a revised production contract.
- **Color control needs semantic protection.** The inspected C001 crop trial preserves texture structure under constrained luminance treatment but recolors zipper detail too. Numerical luminance preservation alone cannot replace masks and art approval.

The central question is therefore **plausible but not yet proven end to end**. Source evidence supports a constrained hybrid; it does not justify a mass conversion or an unrestricted paper-doll/puppet system.

## Plain answers to the master questions

| Question | Current recommendation and practical limit |
|---|---|
| Canonical body | Person-calibrated view/pose underplate plus semantic anchors; preserve individual geometry |
| Canonical limb | Authored whole anatomical limb state with garment-aware surfaces and bounded hand/foot interfaces |
| Canonical garment | Versioned fitted view/shape/pose family with hidden coverage, layers, materials and explicit compatibility |
| Body irregularity | Per-person calibration and source approval; historical fit bins do not override posture, proportions or asymmetry |
| Four-view correspondence | Authored0/45/90/180-degree targets with one identity scale/root; true side, anatomical sides and explicit mirror policy |
| Painterly palette swaps | Protected semantic materials plus constrained value/detail treatment; authored alternates for large changes/patterns |
| Canonical head | Identity/view package with invariant skin/skull base, neck interface, face regions and separate hair/accessories |
| Five-slot topology | Retain semantics, revise physical masks/ownership; front/three-quarter full, side reduced, back none |
| Gaze and eyes | Baked eye-shape/gaze assets with required paired companions and explicit closure/asymmetry exceptions first |
| Presets and mixing | Known complete presets plus reviewed mixes; arbitrary selection remains candidate/unreviewed |
| Extreme lower face | Broad local paint for compact states; explicit coordinated head-silhouette group if a real jaw/cheek change exceeds it |
| Independent layers | Head skin/ears, neck/body bridge, hair front/back, facial hair where deformation needs it, glasses/hats/earrings, collar/wardrobe |
| Existing usability | Original stills/reference/provenance usable unchanged; catalogs source-only, gray fits calibration-only, modular four-view output requires new derivatives |
| Smallest worthwhile proof | C001,32-surface front gate then91-surface sparse four-view capsule, maximum97 with declared reserves |
| Falsification | Lost identity, feature overwrite, matte seams, broken stripes/contacts, unbounded repairs or full-body repaint per combination |
| Expansion order | Different profile/fitting next; then pattern/hair/asymmetry, long drape, equipment, and only then gated cast-scale work |
| New character workflow | Approve a particular person first; author aligned views/hidden layers/slots/masks together; promote reuse only after QA |
| Remain open | Transform limits, final fit-profile count, nonfrontal mixing, extended jaw groups, cross-fit ranges, hair/beard deformation, animation and production cost |

## Precisely what the first proof would establish

The future proof would have four neutral views, jacket on/off in all four, alternate independent arm states only in front/three-quarter, and alternate leg states only in front. Front NN/NO/ON legs are supported; OO is rejected. Side/back remain neutral. This is deliberate sparse coverage, not a hidden claim of arbitrary poses in every view.

Front facial coverage uses seven patches over a neutral base; three-quarter has one complete five-patch preset; side has three visible controls; back has none. Neutral uses the base without empty overlay files. The proof must directly test eyebrow survival under gaze changes, a wink/asymmetry, bounded jaw performance, an invalid unpaired gaze, alpha invariance and source identity. C001's bald head limits initial cost; hair and cross-fit remain later tests.

Do the32-surface front gate before spending on the remaining views. Ninety-one is the complete sparse surface budget, with at most four lining/occlusion and two pelvis reserves,97 total. Ten front/30 complete logical blue-material mask sets are additional coverage data; mask file packing is separate. Review36 supported original-palette body recipes and the nine independent jacket/pants palette pairs on demanding configurations. See05 for exact counts, provenance, gates and the future minimal review viewer. Nothing in that viewer specification has been implemented.

Even a complete pass would not establish a second fit or character, all facial combinations, hair/beards, true extreme silhouette deformation, skirts/coats, armor, gait, runtime performance, or database integration. A family becomes a cross-character reuse claim only after a second calibrated host passes.

## Safest expansion across the44-character corpus

Use gated waves, with the original look approved separately for every identity. These are proposed priorities, not production authorization or a claim that group members share compatible geometry.

| Wave after a successful C001 proof | Why this order / exit requirement |
|---|---|
| Second host and proportion change: C034, with C033 as a lower-complexity comparison | C034 challenges belly/shoulder/short-sleeve/plaid calibration; C033 challenges jersey layering and another person's head. Preserve each original outfit first. Test one explicitly fitted shared garment family on a second host before claiming cross-character reuse. |
| Ordinary additional fits and tailored layers: examples C012/C016 and C002/C019 | Test simple polos and structured suiting on different observed bodies. Reuse only validated interfaces, and count new fitted cuts honestly. One successful second host does not validate the entire historical fit bin. |
| Pattern, hair and asymmetry: C003/C018, then C042 | Restore source outerwear, preserve leather/leopard/floral material decisions, then test hair, gloves, torn tights and connected dress drape. These are separate difficulties, not one generic clothing-recolor task. |
| Long garments: C020, then comparable C023/C030/C041 looks | Validate front/rear panels, hidden lining, leg reveals, hems and neck/hair/collar overlap before extending the long-garment family. |
| Protective stack: C028, then C010/C026/C027/C029 | Explicit head/vest/glove/knee/thigh gear ownership and sockets; resolve dirty/clipped catalogs and gear still baked into nominal clothing first. |
| Remaining C001–C044 backlog, in small comparable batches | Admit each identity only after source-label reconciliation, approved four-view calibration, complete declared sparse coverage and source-fidelity review. Pick one new difficulty per batch; retain bespoke exceptions. No automatic conversion by filename or fit label. |

Maintain a44-row readiness ledger with source identity, reviewed outfit truth, fit/calibration version, four-view coverage, pose/head/face/material coverage, missing isolation, authoring effort, QA status and approved recipe. Count the eligible reuse actually achieved, including bespoke exceptions. Expand pose coverage only when a consumer needs it and the preceding wave passes. Animation, production atlas optimization and runtime integration follow stable still-pose recipes rather than determining the art prematurely.

## Supporting evidence and preservation

Machine-readable evidence includes full source/alpha/silhouette measurements and CSVs, face masks/overlaps/normalization/recomposition results, gear isolation measurements, diagnostic-only contact sheets, the local crop color trial, a proposed [asset-authoring JSON Schema](evidence/zant_asset_authoring_v0_1.schema.json), and an explicitly uncreated [SPEC_ONLY example](evidence/C001_proof_SPEC_ONLY.example.json). The scripts are reproducible analysis tools, not production converters. Output images recombine or inspect supplied pixels; none is a new final character or facial asset.

The final [bundle and preservation audit](evidence/final_bundle_audit.json) records deliverable existence, local Markdown link resolution, JSON/schema checks, and SHA-256 comparison of supplied inputs and recorded evidence copies to intake baselines. Encounter and Room Creator were used only for asset-facing constraints; their text/HTML copies remain hash-identical. No source archive, supplied asset, existing project code or surrounding system was modified by this work.

## Owner decision and stop

Review whether the recommended standard and the bounded C001 experiment justify authorizing its new art and minimal viewer. Approval of this analysis is not approval of production implementation or all44 conversions. If the owner chooses a proof build, the concrete scope is05, with Gate A stopping cheaply on failure and Gate B proceeding only within its sparse budget. No ongoing monitor or later work was scheduled.

**STOPPED FOR OWNER REVIEW — no implementation, mass asset conversion, new final artwork, Encounter changes, Room Creator changes or Unity integration has begun.**
