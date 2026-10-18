# C001 Gate A R4 neutral-interface remediation

**NEUTRAL PAIR READY FOR OWNER ART REVIEW — NOT ACCEPTED.**

R4 addresses the neutral jacket-off/on prerequisite only. No neutral contour is frozen for reuse, no Gate A pass is claimed, and no G/O state, facial patch, palette work, viewer or integration has begun. The accepted R2 A25 remains the identity anchor. The original approved preflight, proof specification, 32 baseline slots and six bounded reserves remain controlling, with the owner's R4 authority clarification and subsequent cleanup steering.

## Current candidate

Use `evidence/source_vs_R4_pair_384.png` for the source/off/on comparison, `evidence/neutral_pair_native.png` for both native frames, and `evidence/CURRENT_native_5bg_upper_pair.png` plus `CURRENT_native_5bg_wrists_waist_pair.png` for native join inspection. Separate full-frame light, dark, magenta, green and textured PNGs exist for both outfits. `neutral_*_384.png` means a 384px body FRAME; `neutral_*_visible_body_384.png` additionally gives a literal 384px crown-to-sole display.

The current candidate supersedes the earlier R4 drafts with cutouts, bands and hard wrist boundaries. Those drafts are retained in authoring inputs/raw files and rejected diagnostics; they are not accepted interfaces or runtime fallbacks. The owner's instruction to continue cleanup superseded the early builder stop proposal. R1–R3 remain unchanged.

## Changes and ownership

The selected third working painting supplies a coherent new tee and whole arms. A02 owns collar, torso, side drape and hem. A04/A05 each contain their own short sleeve and exposed arm at one draw depth. Removing torso-colored tabs from the arm bank stopped arm refinement from dragging torso cloth into an underarm notch. Sleeve-to-skin continuity is baked within each whole arm; there is no runtime cut at that opening.

Authoring used the built-in imagegen tool, with three saved prompts in `authoring/prompts/` and exact raw outputs in `authoring/raw/`. The selected prompt is `neutral_skin_interface_cleanup_v3.txt`; earlier attempts and their inputs are preserved as work evidence. No CLI/API fallback was used.

The shared tee's right side was refined once for both outfits. No per-outfit tee copy, clipping override or body repaint is used. The check for opaque tee pixels outside the source lower-body support is **0**. Intentional arm–torso negative spaces remain open. They are background between a relaxed arm and torso; occupied join cores contain no missing coverage.

Both arms retain independent paintings. Side-specific offline contour fields adjust the newly inferred arm volumes and trajectory, with zero displacement at the fixed shoulders and the declared original wrist insertion at the other end. The image-right elbow/forearm sweep was brought inward; the other side receives its own smaller correction. These are baked drawing refinements of new anatomy, with every runtime recipe at scale1, rotation0 and mirror=false. Original head, hands, stance, trousers, shoes and jacket are not scaled or mirrored. Exact authoring fields are in `authoring/v3_interface_policy.json`.

At body y550 the authored arm widths are L65/R65; at y625 L64/R68; at y750 L41/R42. These measurements describe this candidate, not an exact recovered source contour or a production symmetry tolerance. Elbow/shoulder construction, muscle volume, light and natural asymmetry still require owner visual judgment.

A01 retains observed source neck pixels with a small new collar-side continuation behind them. A25 is drawn afterward at its unchanged placement. Its face is never a generation input. New tee/skin work stays outside the accepted head region. The collar meets the declared neck-base datum without shifting the head.

The original source hands are shared in both outfits. Their retained RGB is unchanged. The old oblique cuff cut receives a 14px smooth alpha transition only over receiving forearm alpha>=250 and below the wrist attachment area: **L635 / R718 alpha texels** change. All palm/finger RGBA at body y>=842 remains unchanged, and rendered opaque palm/finger RGB matches source in both outfits. The external finger silhouettes and hand asymmetry remain original. This body-interface alpha policy does not apply to A25.

A03/A08/A09 retain source jacket RGB at the source registration. Alpha cleanup removes green matte contamination, including opaque islands in the original arm–torso negative space. No jacket redesign, stripe redraw, source sleeve shift or additional jacket pass is used.

N legs remain source-pixel derivatives. Shoes retain source placement, shape and contacts; the source-extraction method includes disclosed green-fringe alpha cleanup and small bottom-sole RGB unmatting from nearby clean source shoe pixels. No foot scaling, substituted shoe or mannequin art is used. This edge treatment is detailed in `author_source_parts.py` and the provenance record.

A16 reuses the existing unaccepted R3 bounded waist derivative, with its alpha exactly matching the source-led seed. **Its RGB is not wholly source-exact:** 13,564 retained texels differ from that seed in body bounds [347,799,640,865), including a feather into visible upper pants; 5,066 changes lie at y840–864. Every coordinate and before/after RGB is in `validation/A16_RGB_changes_from_source_seed.csv`. No change exists at y>=865 in that A16 comparison. This retains the established pants geometry and source lower-leg/stance art; acceptance of the waist material/overlap remains an owner art decision. The packet does not relabel this derivative as original recovered pants artwork.

## Fixed registration and source integrity

| Invariant | Current result |
|---|---|
| Body frame / root / source translation | 1024x1536 / (512,1472) / (0,+54), unchanged |
| A25 body translation / attachment | (256,54) / (501,320), unchanged |
| Neck-base / shoulders | (501,381); L(612,407), R(380,407), unchanged |
| N wrists | L(684,824), R(301,822), unchanged |
| N sole core-contact rows | L1471/R1471; zero target difference |
| A25 PNG | `f57ca9e06a203810c3a7f5d9e4c94bf6ecb9f5a2ff83d74b27eff62b4fbba724` |
| A25 silhouette PNG | `37e11415f639cf8fa3634ca066bdf718ede06c77acff2121fb79441e62104052` |
| Source/history audit | All620 source files,119 R1 work files,31 R2 files,462 R3 files and163 independent-review files unchanged |

The accepted A25 art, alpha, extraction policy and registration records are byte-locked. Its 18,229 retained source RGB pixels remain exact. The portable audit checks 14,254 protected facial RGBA pixels in each assembled neutral. There is no neutral facial enhancement, redraw, scale compensation, silhouette expansion, Goose artwork or gray mannequin pixel in runtime parts.

## Actual checks and limits

The local neutral interface checks passed: occupied neck/shoulder/sleeve/wrist/waist/ankle cores have zero pixels below alpha128; both shoulder and wrist datums are covered by their arms; hand cores match source; the tee leak check is zero. Native and 768/384 frame-height renders were reviewed, with native light/dark/saturated/textured join boards. These diagnostics do not replace owner art approval.

Jacket-on silhouette IoU at alpha>127 is **0.98101943** against the translated source, above the0.97 numerical flag. This does not certify reconstructed anatomy. Jacket-off is not judged by exact clothed-source silhouette equality.

The supplied standard-library verifier recomposes the two declared layer orders using `C001_GATE_A_sRGB8_integer_v1`, compares all RGBA channels including hidden RGB, writes independent PNGs, reopens them and checks the accepted head. It also exercises separate one-pixel RGB-only and alpha-only comparison controls. Fresh-extraction author results and their hashes accompany the review ZIP. These two controls do not execute the17 production negatives.

| Scope | Actual state |
|---|---|
| Baseline inventory |15 exported:14 review body parts + accepted A25;17 absent/held |
| Reserves |0 of4 lining/occlusion;0 of2 pelvis; ceiling remains38 |
|24 body cases |2 neutral cases rendered, pending owner review;22 not run |
|54 palette /120 isolated-face /28 assembled-face |Not run; none authored for R4 |
|17 production negatives |Not run; fixtures remain requirements only |
| Viewer / later states / Gate B |Not implemented or started |

The full243-entry requirement matrix is preserved with honest hold statuses. There are no accepted passing Gate A cases. G/O compatibility, shared-state joins, facial ownership/performance, material masks/palettes, viewer behavior and the full Gate A proof remain unproven.

## Review boundary

The review ZIP is an immutable snapshot of this candidate for reproducible inspection. It does **not** freeze the neutral contour as an accepted interface. `data/neutral_review_state.json` explicitly records ownerAccepted=false and neutralContourFrozen=false. Artwork judgment remains with the owner, especially arm balance, collar/shoulder/underarm coherence, waist treatment and source-specific appearance at native and gameplay scale.

**STOP FOR OWNER ART REVIEW.** No propagation into alternate states or other Gate A work follows automatically.
