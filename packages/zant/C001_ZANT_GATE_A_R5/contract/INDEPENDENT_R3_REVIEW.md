# C001 ZANT Gate A R3 independent neutral interface review

**Overall conclusion: FAIL / STOPPED AT NEUTRAL INTERFACE.**

**The R3 stop was warranted. I agree with holding the neutral prerequisite for owner review, but qualify the builder's explanation of source-geometry failure.** The packet demonstrates an unresolved authored neutral interface and a rejected painting that misses its proposed guide. It does not establish an exact original bare-arm contour that the reconstruction must reproduce. The jacket conceals much of that anatomy. **I recommend a narrowly revised, owner-approved neutral-interface contract before R4**, with explicit authority for observed geometry, fixed registration and reconstructed anatomy. No contract change is made or authorized by this review.

Review date: 2026-10-18, America/New_York. Environment: Windows 11 build 26200, Python 3.12.0; the required portable audit uses the standard library only. A separate independent numerical audit used Pillow 12.3.0 and NumPy 2.5.1 without importing authoring code. Review outputs are outside the frozen packet. Packet-relative paths below resolve under `fresh_extraction/C001_ZANT_GATE_A_R3_FAILED_NEUTRAL_INTERFACE/` in this review directory.

The review follows `R3_TESTER_HANDOFF.md`, `TESTER_INSTRUCTIONS.md` and `START_HERE.md`. Historical implementation approvals and optional authoring commands are context, not fresh permission to author. No authoring script or image generator was run. The required verifier replayed the two existing rejected neutral drafts into a new external `audit_replay/` directory; no artwork was repaired, retouched or newly designed. No missing downstream functionality was tested.

**Integrity and preservation**

| Check | Independent result |
|---|---|
| Frozen ZIP | 37,024,363 bytes; external SHA-256 matches; ZIP CRC check passed |
| Manifest | External SHA-256 matches; all 149 governed files match sizes and hashes |
| Packet inventory | 150 files including manifest; no duplicate ZIP names, missing files or extras |
| Fresh extraction versus delivered folder | All 150 files match exactly |
| Original source tree | All 620 files match the frozen preservation baseline; zero changed, missing or added |
| R1 history | All 37 files and the R1 ZIP match the frozen preservation baseline |
| R2 history | All 31 files match the frozen preservation baseline |
| Accepted A25 | Art and silhouette match R2 and the R3 lock; all five archived acceptance/registration files verify |
| Final recheck | ZIP, delivered folder and fresh extraction remain unchanged; source and history checks remain clean |

ZIP SHA-256: `1abab0ff4fef0f41dff14f07cd799f08a58bee72e01f6a6b02ecddddc407341a`

Manifest SHA-256: `38ca31bec782bc2b160fa6e7577b6db932e27033c97d7b17c8b699d16597d8ab`

A25 art SHA-256: `f57ca9e06a203810c3a7f5d9e4c94bf6ecb9f5a2ff83d74b27eff62b4fbba724`

A25 silhouette SHA-256: `37e11415f639cf8fa3634ca066bdf718ede06c77acff2121fb79441e62104052`

The source/history finding is an independent present-day comparison to the archived pre-build baseline, not an independent observation of that earlier moment. The packet's original C001 reference also matches the preserved original master. Full results: [initial integrity audit](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R3_Independent_Review_2026-10-18/integrity_initial.json>) and [final integrity audit](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R3_Independent_Review_2026-10-18/integrity_final.json>).

**Actual numerical comparisons**

The required standard-library verifier exited 0 with `auditIntegrity: PASS` and `gateAVerdict: FAIL`. A second implementation decoded the PNGs with Pillow and recomposed the declared Axx layers using the contract's integer source-over profile. It independently reproduced the same buffers. Comparisons include all RGBA bytes, including RGB under zero alpha.

| Recipe | Canonical versus frozen expected | Reopened audit PNG versus expected | Protected face |
|---|---|---|---|
| `B_off_NN_NN` | 0 different pixels; RGBA channel counts [0,0,0,0]; maximum deltas [0,0,0,0] | Same zero differences | 14,254 pixels; 0 changed RGBA channels |
| `B_on_NN_NN` | 0 different pixels; RGBA channel counts [0,0,0,0]; maximum deltas [0,0,0,0] | Same zero differences | 14,254 pixels; 0 changed RGBA channels |

Decoded RGBA SHA-256 values are `cc9bda9179d494cbd423eb04772c99dd4bac54ea956db037f9cd0790976f5e4d` for jacket off and `16e163955748b05747016ada37e25a840cbf900bbcf7277bdadbd4eaed590ea0` for jacket on. All 18,229 retained A25 pixels preserve original source RGB. Head alpha equals the accepted silhouette exactly. The supplementary RGB-only control reports one different pixel and channel counts [1,0,0,0]; the alpha-only control reports one different pixel and [0,0,0,1]. Each maximum change is 1. These comparison controls do not execute the 17 production negatives.

The independent audit also found no changed source RGB channels in retained palm/finger cores below body y842 at alpha >127: 3,597 L pixels and 3,466 R pixels. These explicitly thresholded counts differ from the author's broader retained-pixel counts. Both N sole core-contact rows are body y1471, exactly their targets. Jacket-on silhouette IoU against the translated source is 0.9817098761253639. That figure concerns clothed silhouette support; it cannot certify hidden bare anatomy or art acceptance. Results: [portable verification](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R3_Independent_Review_2026-10-18/audit_replay/verification.json>) and [independent pixel and inventory audit](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R3_Independent_Review_2026-10-18/independent_pixel_inventory_audit.json>).

**Visual findings**

The original master, calibration reference, latest jacket-on render, native neck/shoulder comparison, final detail sheet, all five jacket-off native backgrounds and the 384-height comparison were inspected. The rejected L paint field and its contour overlay were reviewed separately from selected runtime art.

| Recipe or evidence | Finding and practical limit |
|---|---|
| `neutral_neck_shoulder_native_review.png` | The latest collar sits higher and the paired shoulder caps read more continuously than the earlier rejected version. The earlier low/narrow shoulder finding should not be repeated as though it describes the final geometry. A25 has not moved. The broad tee shoulder envelope is an authored reconstruction informed by the clothed source and calibration. |
| `B_off_NN_NN`, native light/dark/magenta/green/textured | Sleeve openings connect to painted upper arms, but paired arm mass and trajectory remain uneven: anatomical L, on image-right, has a more outward elbow/forearm sweep and fuller outside contour. Upper-arm insertion under the sleeves still needs a coherent accepted anatomical baseline. This is a reconstruction-quality judgment, not a measured original skin contour. Background inspection does not establish a hidden anatomical outline. |
| `neutral_detail_native_final.png` | The raised collar and retained hand positions are visible. The shirt side boundaries and new hem/waist transition are authored interfaces requiring review; they cannot be approved merely because A25 and contacts are exact. No head movement is needed or justified by these concerns. |
| `neutral_gameplay_384_review.png` | The revised draft is more coherent than the earlier version, while the paired arm outline remains a visible design difference. This view supports reviewing the overall neutral silhouette before propagating it to alternate states; it cannot resolve exact elbow or deltoid anatomy hidden in the jacket. |
| `rejected_A04_field_vs_required_contour_native.png` | The painted elbow/forearm and wrist do not consistently follow the proposed contour. Around the middle/lower forearm, contour and painted anatomical edge diverge; clipping would retain some exterior bleed/background-toned paint and misplaced anatomical shading. Rejecting this field as a conforming paint donor was reasonable. The cyan guide is a proposed reconstruction, not a recovered original bare-arm boundary. The rejected field is not the final A04 runtime layer. |

Existing inspection images: [native shoulder comparison](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R3_Independent_Review_2026-10-18/fresh_extraction/C001_ZANT_GATE_A_R3_FAILED_NEUTRAL_INTERFACE/evidence/neutral_neck_shoulder_native_review.png>), [384-height comparison](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R3_Independent_Review_2026-10-18/fresh_extraction/C001_ZANT_GATE_A_R3_FAILED_NEUTRAL_INTERFACE/evidence/neutral_gameplay_384_review.png>) and [rejected field overlay](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R3_Independent_Review_2026-10-18/fresh_extraction/C001_ZANT_GATE_A_R3_FAILED_NEUTRAL_INTERFACE/evidence/rejected_A04_field_vs_required_contour_native.png>).

**Architectural assessment**

The evidence supports three different kinds of constraint. Treating them all as exact source contours obscures the reason a neutral can fail.

| Authority | What should remain strict | What it does not establish |
|---|---|---|
| Source-observed geometry | Accepted head shape, proportions and placement; visible hands and their pose/asymmetry; visible neck/tee and jacket design evidence; source N stance, trousers, shoes and contacts. The jacket-on garment silhouette, stripe paths and sleeve/hand relationship remain strong source-fidelity constraints, with documented cleanup. | A jacket's outer cloth edge is not the skin edge. Its folds do not locate an exact bare elbow, deltoid, muscle boundary or underarm. Observable body fidelity also does not make every body derivative's RGB immutable in the way A25 is. |
| Calibration and interface registration | The 1024 ×1536 body frame, anatomical sides, source translation (0,+54), root (512,1472), A25 translation (256,54), accepted head attach (501,320), fixed scale and no mirroring/per-recipe fit. Declared neck, shoulder and wrist datums must be used consistently; seams, receiving parts, overlap and ownership must be explicit. | A joint datum is not an entire alpha contour. The non-head calibration still says `builder_draft_not_owner_art_accepted`. A gray reference or an annotated shoulder point is not independent measurement of all hidden anatomy. |
| Hidden or inferred anatomy | A side-specific, plausible C001 reconstruction is required: shoulder/upper-arm insertion, elbow shape, bare forearm volume, hidden neck/chest continuation, full tee width and underarm coverage. It must meet fixed interfaces, source-like neutral pose, lighting, body type and the existing surface budget, and receive owner approval before it becomes the frozen baseline. | An exact original skin silhouette cannot be recovered from occluded pixels. Neither a uniform inset from a sleeve nor a mannequin trace can substitute for the reconstruction and approval step. |

This distinction is already supported by the preflight. Section 2 classifies A04/A05 as **N, substantially new artwork** and explicitly says the source long sleeve hides this skin. RISK-03 says bare arms, full tee width and hidden shoulder/underarm continuation are not supplied. Section 3 preserves approved shoulder locations while allowing authored surface geometry/folds. RISK-02 requires reviewing anchors and overlap before freezing reusable interfaces.

The R3 reconstruction guide confirms the inference. `authoring/N_skin_geometry_v2.json` calls its contour a sleeve-interior proxy with a 6-pixel inset and newly authored forearm taper; its status is `unfrozen anatomy correction proposal`. `refine_neutral_geometry.py` derives upper rows from A08/A09 sleeve support, then supplies manual lower-arm rows. The A04 prompt elevates that guide to an authoritative painting target. That is a valid way to specify a proposed drawing, but does not turn its exact per-row outline into observable C001 anatomy. The packet itself acknowledges this in `author_results/source_envelope_rows.json`: coat is outer clothing and gray geometry is not exact hidden-anatomy ground truth.

Independent row measurements reproduced the archived values. At body y380, source jacket support is x361–639, calibration x362–633, and the **latest** rejected off draft x361–633. The earlier off draft's x397–602 was substantially narrower; that old discrepancy is not the current state. At y407, latest off support x332–662 is also close to calibration x332–663. Farther down, the latest image-right bare arm at y700 spans x678–737 versus the source sleeve x646–726: the outward trajectory warrants pose/volume review, but those different garment/skin intervals are not a pixel-exact anatomical truth test. No numerical skin-contour tolerance has been established by those measurements.

The two frozen recipes use fixed scale 1, rotation 0, no mirror, declared A25 placement and body-native parts. **I found no demonstrated per-state runtime scaling or shifting in these recipes.** Repeated attempts to paint a neutral correctly, and failure to hit a provisional guide, establish an unresolved authoring task. They do not alone demonstrate that a finished modular solution inherently needs forbidden per-state fitting. RISK-02 is a reasonable reason to stop before propagating the unresolved interface; describing the entire problem as loss of observable source geometry overstates the evidence.

**Recommended owner decision before R4**

I recommend a narrow written clarification or revision for owner approval, preserving the existing contract until that decision. The clarification should:

1. Identify the source-observed regions, fixed joint/registration datums and inferred reconstruction regions separately. Keep exact A25 RGB, alpha and registration locked, plus source hands/contacts and the existing coordinate rules.
2. Define shoulder and wrist attachment requirements independently of the outer skin contour. Keep the declared shoulder datums R(380,407), L(612,407), wrists R(301,822), L(684,824) and neck-base datum (501,381) as working constraints. Their draft status and any later owner-approved baseline decision must be recorded explicitly; no silent adjustment or per-recipe compensation is allowed.
3. Judge hidden bare anatomy through plausible volume, neutral pose, sleeve insertion, source-specific proportions, continuity and native/384-size appearance. Treat coat/calibration envelopes and inset guides as evidence or proposed bounds, with owner-selected tolerances, rather than a demand to reproduce an unobserved exact skin edge.
4. Approve one neutral reconstruction and its seam/ownership records before freezing its contours and proceeding. A painting that misses an approved guide still fails; masking, padding or a runtime warp must not disguise misplaced anatomy. A contract clarification is not acceptance of the current arms or rejected field.
5. Preserve the 32 baseline slots, four lining/occlusion plus two pelvis reserves, shared-part rules, seven-patch face scope, validation matrix and downstream hold. No larger budget, combined runtime body or relaxed identity anchor is justified by this failure.

These are recommendations only. No numerical tolerance, new contour, anchor revision, artwork acceptance or permission to restart is granted here.

**Inventory and execution boundary**

All 32 ledger IDs match the contract. Fifteen baseline surfaces are exported: A25 is the only owner-accepted surface and 14 body surfaces are unaccepted drafts. Seventeen surfaces are missing: A06/A07, A10/A11, A14/A15, A19/A20, A23/A24 and A26–A32. Reserves used: 0 of 6; the ceiling remains 38. The two recipes use only declared Axx exports. The coherent garment master and raw paint fields are authoring sources, not runtime layers. No whole-body fallback, Goose image or mannequin reference is in either layer list. Assets contain exactly the 15 declared part PNGs plus the A25 silhouette support file. Expected outputs contain only the two rejected neutral PNGs and their honest `index.json` metadata. The viewer contains `NOT_BUILT.md`.

| Required matrix group | Count | Actual recorded state |
|---|---:|---|
| Body | 24 | 2 RENDERED_NOT_ACCEPTED; 22 NOT_RUN_STOP_CONDITION |
| Palette | 54 | NOT_RUN_STOP_CONDITION |
| Isolated face | 120 | NOT_RUN_STOP_CONDITION |
| Assembled face | 28 | NOT_RUN_STOP_CONDITION |
| Production negatives | 17 | NOT_RUN_STOP_CONDITION |

The four valid combination sets match the preflight enumeration and all 243 IDs are unique. There are 226 valid requirements, with 224 unrun and no accepted passing cases. Only the two neutral body recipes were replayed. No G/O state, facial patch, palette system, complete viewer or missing negative fixture was exercised or treated as implemented.

No technical integrity blocker or surface-budget failure was found. The records disclose ten historical generated working outputs, a final rejected unexported L field, and consistency exports of selected drafts after the stop. No downstream art appears in the frozen bank. Historic inputs for every discarded generation are not fully byte-attested, as the author acknowledges; this limits claims about the entire generation history, not the reproducibility of the frozen neutral outputs. The architectural viability and all missing Gate A work remain unproven.

**STOP FOR OWNER REVIEW.**
