# C001 Gate A R5 implementation stop report

**GATE A FAILED AT THE G-SLEEVE PILOT — STOP FOR OWNER REVIEW.**

The accepted R4 candidate02 neutral pair, including authored A16, is frozen. A25 is unchanged. The resumed build stops at the first anatomical L/image-right G-arm shared-wrist trial. This is a failed partial candidate, not a completed32-surface proof. It does not establish that the five-slot architecture or the finite body architecture is impossible; the current new sleeve artwork/export does not satisfy its interfaces or source-fidelity review.

## Actual result and stop condition

New tee/skin G art and a matching open hand were drawn, then one jacket-sleeve donor and one focused donor revision were tried against that same hand. No neutral part, anchor or scale was changed to make them fit. The jacket revision still places its cuff through the shared palm instead of meeting the declared G wrist, and its new shoulder/stripe transition and garment volume are not clean enough to accept against the frozen source-style jacket.

The body registration is1024x1536; anatomical L shoulder remains(612,407). The new pilot G wrist was declared at(637,705), with seam line `y=.7*(x-637)+705` and10-pixel signed vertical overlap on each side. This G wrist is a builder pilot datum, not an owner-approved extension of the neutral calibration. The G hand file is identical in both outfits. **1,252 opaque/core hand texels are covered by the revised sleeve beyond that declared band**, in body bounds[605, 708, 661, 765]. The deepest coverage is60.4 vertical pixels from the seam line, or49.48 perpendicular pixels. Native evidence shows the cuff running over the palm toward the fingers. This quantifies the failed pilot interface; it is not a cast-wide anatomical tolerance.

The source-fidelity and clean shared-wrist requirements in preflight sections3/6, RISK-01/RISK-05, and the owner's frozen-interface resume instruction are not met. Authoring stopped. No outfit-specific second hand, neutral-body change, per-recipe fitting, mirrored arm, extra full torso or whole-body replacement was introduced. A further new G drawing method may solve this within the budget; that remains unproven and is returned for owner review rather than asserted impossible.

## Work attempted and provenance

Only three previously empty logical slots were attempted: A06 tee L G arm, A14 shared L G hand, and A10 jacket L G sleeve. A06/A14 are unaccepted pilots, not validated finished parts. A10 is a failed draft. All other new slots remain absent.

Built-in imagegen produced three working donors: `G_L_tee_hand_v1.png`, `G_L_jacket_v1.png` and `G_L_jacket_v2.png`. Exact prompts are in `authoring/prompts/`, raw outputs in `authoring/raw/`. The imagegen skill was used; no CLI fallback or API runner was used. The two body references excluded the accepted head; A25 was never a generation input. One coherent tee/skin/hand working donor supplies two separately counted logical exports. The jacket donors supply only A10; their generated hand RGB is not selected as a second hand.

Each887x1774 donor is exported by a single declared whole-canvas Lanczos resize to300x600 and body origin(520,350), without bounding-box fitting. Existing N cap paint is retained above435, transitioning into new G paint at435–480. These are disclosed new-G authoring derivatives, not changes to the neutral assets. The G hand has a10-pixel wrist overlap; exterior antialias ownership is assigned to one part. Pure root-occlusion masks come from frozen A02/A03 coverage, full through550 and fading out by580. They carry no repair RGB, add no painted surface, and leave the complete forearm at its single front draw depth.

The first jacket export had an additional **builder processing defect**: its broad warm-color skin predicate also removed warm stripe texels, producing holes. That export is rejected and retained under `authoring/rejected/`. The final failed evidence uses v2, supplied without a hand, and does **not** apply that predicate. V2 still fails cuff fit and native garment/root quality. No repair was made after declaring the stop; the subsequent operations only rendered, measured, documented and archived existing failed art.

## Frozen neutral integrity

`contract/ACCEPTED_R4_NEUTRAL_LOCK.json` hashes all15 accepted painted parts, A25 silhouette and the original calibration/interface/recipe/head-lock records. Every byte remains exact. R5 replays both accepted neutral composites in every RGBA channel exactly, including hidden RGB. Body root(512,1472), source translation(0,54), A25 placement(256,54), N wrists L(684,824)/R(301,822), neck-base(501,381), and all other frozen datums remain unchanged. No G pilot datum replaces an N datum.

A25 PNG SHA-256: `f57ca9e06a203810c3a7f5d9e4c94bf6ecb9f5a2ff83d74b27eff62b4fbba724`.

A16 PNG SHA-256: `23ad2c87efb724bb4c747d13d4bd76c49f4c411e5517c6f59f44f1de000008c7`.

A16 is now an **owner-accepted authored waist proposal**, unchanged from R4 candidate02. Its prior13,564 source-seed RGB differences, including5,066 at y840–864, are disclosed in the preserved CSV. It is not relabeled as wholly source-exact RGB.

Historical draft/review labels in the byte-preserved calibration and accepted-neural snapshot remain historical text; the new explicit owner-acceptance record controls their current authority. It does not approve any new G art.

All original sources and R1–R4 history are unchanged. The fresh audit coverssources: 620 files, R1: 119 files, R2: 31 files, R3: 462 files, independent_R3: 163 files, R4: 735 files, independent_R4: 149 files. There are zero changed, missing or added files in those roots.

## Actual validation and unrun requirements

| Requirement | Actual result |
|---|---|
|32 baseline IDs | All retained;15 frozen accepted neutral parts +3 unaccepted/failed pilot parts +14 unauthored |
| Reserves |0 of4 lining/occlusion;0 of2 pelvis; no additional painted layer |
|24 body cases |2 accepted neutral replays exact; off/GN/NN unaccepted pilot; on/GN/NN failed visual/interface pilot;20 unrun |
|54 palette cases |Not run; no semantic material masks or palettes authored |
|120 isolated-face +28 body-face cases |Not run; no facial patch authored |
|17 production negatives |Not run; separate one-pixel RGB/alpha comparator controls only |
| Viewer |Not started after stop; no viewer pass implied |
| G R / O / remaining work |Not started after stop |

The full243 unique requirement IDs remain present. **222 valid cases and all17 production negatives are unrun**; the four rendered evidence cases include two unaccepted pilots and do not count as four Gate A passes. The portable standard-library verifier checks the manifest, all frozen neutral hashes, retained source head/hand RGB, authoritative head alpha, protected facial pixels, four exact canonical replays/reopened PNGs, comparator controls and independent reproduction of the failed wrist-overlap count. A successful verifier exit means that the **failed evidence** reproduced intact, not that the artwork passed.

## Checkpoint and owner handoff

The frozen failure snapshot is `C001_ZANT_GATE_A_R5_FAILED_G_SLEEVE_PILOT/` plus a ZIP and external SHA-256 sidecar. Begin with `evidence/R5_STOP_comparison_384.png`, `B_on_GN_NN_upper_interface_native.png`, `FAILED_G_L_wrist_registration_native.png`, and the native wrist background crops. The original accepted pair is included for direct comparison. The standard-library verifier writes only to a new external audit directory. Fresh builder replay results accompany the archive and remain distinct from independent testing.

The owner review point is the failed L G sleeve/root/shared-wrist method. Accepted R4 neutral anatomy, A16, A25 and their registration have not been reopened. Any resumption needs an explicit owner decision; this failed trial does not authorize loosening those locks or moving to later work.

**STOP FOR OWNER REVIEW.** No Gate B, other character, animation, Unity, Encounter/Room Creator or database changes.
