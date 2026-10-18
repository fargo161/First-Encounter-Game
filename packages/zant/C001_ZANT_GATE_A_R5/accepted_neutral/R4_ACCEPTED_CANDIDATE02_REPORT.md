# C001 Gate A R4 final shoulder-contour cleanup

**NEUTRAL PAIR READY FOR OWNER ART REVIEW. STOP.**

Candidate: `C001_ZANT_GATE_A_R4_NEUTRAL_REVIEW_CANDIDATE_02`. This revision addresses only the two upper-shoulder contour ledges identified by the independent R4 reviewer. The neutral interfaces remain unaccepted and unfrozen; Gate A is incomplete. A25 retains its prior acceptance. No later states were authored.

The review found that both whole-arm exports started at body row365. This clipped a few pixels of the existing tee slope above that row, producing the reported shelves. The finish restores **15 existing native working-paint texels**, copied exactly without resampling into previously transparent locations in A04/A05 outside A02. No image generation, new painting, arm transformation or retained visible-pixel replacement occurred in this pass. The paint comes from `authoring/v3_working_paint_in_body_frame.png`, which predates this cleanup; it is reconstructed tee art, not original source skin or face art.

| Side / surface | Restored texels | Actual changed body bounds, XYXY exclusive |
|---|---:|---|
| Anatomical R / image-left / A05 | 6 | [401,363,405,365) |
| Anatomical L / image-right / A04 | 9 | [596,362,601,365) |

Every change is enumerated with before/after RGBA in `validation/shoulder_contour_texel_changes.csv`; `validation/shoulder_contour_cleanup.json` contains ROI limits, hashes and outline measurements. All previously visible RGBA texels in both surfaces are exact, and everything at row365 and below is exact. Shoulder anchors at L(612,407)/R(380,407), wrist anchors, current arm volumes, sleeve openings, balance and asymmetry remain unchanged. There is no mirroring or rescaling.

At alpha>127, the left outline at rows363/364/365 is now405/402/400, replacing405/405/400. The right outline is now596/599/601, replacing595/595/601. This restores the existing sloping contour through the partition instead of adding another surface.

## Regenerated review evidence

- `evidence/source_vs_R4_pair_384.png`: source/off/on at384px frame height.
- `evidence/neutral_pair_native.png`: off/on at native1024x1536 per state.
- `evidence/neutral_off_visible_body_384.png` and `neutral_on_visible_body_384.png`: literal384px crown-to-sole appearance.
- `evidence/shoulder_contours_before_after_3x.png`: nearest-neighbor magnification for locating the edit; not a quality substitute for native review.
- `evidence/shoulder_contours_before_after_native_5bg.png`: native before/after on light, dark, magenta, green and textured backgrounds.
- `evidence/CURRENT_native_5bg_upper_pair.png`: current complete upper interfaces on those backgrounds.

The native and gameplay views were visually checked after regeneration. The small shelves are removed; no broad shoulder/arm redesign was performed. The jacket-off composite differs from candidate01 at exactly15 RGBA texels. The jacket-on composite differs at **zero RGBA texels**, including hidden RGB. Its decoded hash remains `48feb5aa9fc7f5da1fbdffc4d2347d9faa38d26fc4314788431593b787692d24` and source silhouette IoU remains0.9810194273336492.

## Preserved invariants and waist decision

A25 art/alpha and all accepted lock records are unchanged. Body1024x1536, root(512,1472), source translation(0,54), A25 placement(256,54), fixed shoulder/wrist/neck-base and other datums are unchanged. Calibration, interface records and recipe layer orders are byte-identical to before this pass. Every other asset file, including A01/A02, source hands, jacket, legs and shoes, is byte-identical.

**A16 is byte-identical to candidate01**, SHA-256 `23ad2c87efb724bb4c747d13d4bd76c49f4c411e5517c6f59f44f1de000008c7`. It remains the current authored, unaccepted waist/upper-pants proposal. It is not source-exact RGB. The prior disclosed13,564 retained-RGB differences versus its source-led seed, including5,066 at y840–864, are unchanged; the existing coordinate CSV remains available. No shoulder cleanup required a waist change. The owner must decide its waistband/upper-pants appearance after viewing the pair.

The original source/R1/R2/R3/independent-R3 preservation audit passes. The new before-edit baseline also confirms candidate01, its external files and the entire independent R4 review remain unchanged. Preservation records are in `validation/`.

## Checks and scope

The read-only neutral checks pass: zero unintended tee-sliver pixels, no missing coverage in declared occupied join cores, shoulder/wrist datums covered, source hand cores unchanged. The arm measurements below the edited region equal candidate01. The portable standard-library verifier is rerun on a fresh candidate02 ZIP extraction; its actual result and archive hashes accompany the package. An integrity pass is not owner art acceptance.

The inventory stays32 baseline IDs:15 exported,17 held; **zero reserves used**. Only the two neutral recipes are rendered pending art review. The other224 valid cases and17 production negatives remain not run. No G/O poses, expressions, palettes, viewer, Gate B, other characters or integration work was begun.

Earlier reconstruction, hand-alpha policy and provenance are retained in `references/R4_candidate01_remediation_report.md` and the authoring records. Those earlier methods were not rerun for this finish. The immutable candidate02 review snapshot records ownerAccepted=false and neutralContourFrozen=false.

**STOP FOR OWNER ART REVIEW.**
