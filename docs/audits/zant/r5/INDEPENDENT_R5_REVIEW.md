# C001 Gate A R5 independent failed sleeve pilot review

**Overall conclusion: FAIL / STOPPED AT G-SLEEVE PILOT. The stop was warranted.**

**Evidence integrity passes. The current A10 jacket sleeve fails. The G wrist/hand interface should remain provisional before another jacket sleeve is authored.** The open, palm-up G hand is a suitable gesture candidate for sharing across the two outfits; I found no pose-level reason to require a second outfit-specific hand. That does not make the current A14 export or its attachment contract accepted. The wrist point and oblique seam are plausible working references, but I do not recommend freezing them as the remediation baseline yet. In addition to the failed cuff, the exported bare-arm/hand split does not realize most of its nominal hidden-overlap band.

This failure does not establish a broader architectural impossibility or a need for more surfaces. The accepted R4 candidate02 neutral interfaces, A16 and A25 remain accepted and byte-locked. Their artistic acceptance was not reopened.

Review date: 2026-10-18, America/New_York. Environment: Windows 11 build 26200, Python 3.12.0. The required portable verifier used the standard library only. A separate independent decode/composition audit used Pillow 12.3.0 and NumPy 2.5.1 without importing authoring code. All results are outside the frozen packet. Packet-relative evidence paths below resolve under `fresh_extraction/C001_ZANT_GATE_A_R5_FAILED_G_SLEEVE_PILOT/` in this review directory.

The review followed `R5_TESTER_HANDOFF.md`, `START_HERE.md` and `TESTER_HANDOFF.md`. Historical resume authority was read as evidence, not permission to resume now. No authoring, initialization or export script was run. No image generation, art repair or retouch occurred. The required verifier wrote four exact evidence replays into a new external audit directory. Neither the candidate nor the accepted neutral files were modified.

**Integrity and preservation**

| Check | Independent result |
|---|---|
| ZIP | 23,227,104 bytes; external SHA-256 matches; CRC check passed |
| Manifest and inventory | External manifest SHA-256 matches; all 165 governed files verify; 166 total files including manifest; no missing, changed or extra files |
| Fresh extraction versus delivered folder | All files match |
| Accepted-neutral lock | All 20 governed neutral art/alpha/calibration/interface/recipe/head-lock files match; neutral layer orders are unchanged |
| Original source/history | 620 source, 119 R1, 31 R2, 462 R3, 163 independent R3 review, 735 R4 and 149 independent R4 review files match their baseline; zero changed, added or missing |
| Builder audit sidecar | SHA-256 matches the handoff; treated separately from independent results |
| Final recheck | ZIP, delivered folder and fresh extraction remain unchanged; all preservation and neutral-lock checks remain clean |

ZIP SHA-256: `5c8196e1d81ed8aae3bd42a740c6afd01294bc069345c9d683c90163faac2796`

Manifest SHA-256: `f583c0b57b7ad606b2c8dd985c189836b9831e056fecd07aa9c685ee2b4895dc`

A25 remains `f57ca9e06a203810c3a7f5d9e4c94bf6ecb9f5a2ff83d74b27eff62b4fbba724`; A16 remains `23ad2c87efb724bb4c747d13d4bd76c49f4c411e5517c6f59f44f1de000008c7`. A16 is owner-accepted authored art, not wholly source-exact RGB. Historical draft labels do not undo the explicit R4 acceptance record.

Preservation is an independent comparison of the current workspace to the archived baseline, not an independent observation of the pre-build moment. The root manifest governs this packet; the preserved original R4 manifest is provenance, not an assertion that its entire archive is nested here. Evidence: [initial integrity audit](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R5_Independent_Review_2026-10-18/integrity_initial.json>) and [final integrity audit](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R5_Independent_Review_2026-10-18/integrity_final.json>).

**Reproduction and measured cuff failure**

The portable verifier exited 0 with `auditIntegrity: PASS` and `gateAVerdict: GATE_A_FAILED_AT_G_SLEEVE_PILOT`. The independent Pillow/NumPy implementation reproduced all four buffers using the declared layer orders and integer reference composition. Every canonical and reopened comparison had 0 different pixels, changed RGBA channel counts [0,0,0,0], and maximum deltas [0,0,0,0], including hidden RGB.

| Evidence case | Actual status | Decoded RGBA SHA-256 |
|---|---|---|
| `B_off_NN_NN` | Accepted neutral reproduction | `b315f5a7696e506b98e39c04e3ceaa9e7666b860d2cd49b49797b3ad8c254909` |
| `B_on_NN_NN` | Accepted neutral reproduction | `48feb5aa9fc7f5da1fbdffc4d2347d9faa38d26fc4314788431593b787692d24` |
| `B_off_GN_NN` | Unaccepted G pilot | `9ddd02db7526817fa5fe29a8e4eb5800b0ad26f154fd1fab1bce9cf8915c4b5b` |
| `B_on_GN_NN` | Failed garment/wrist pilot | `7d5433d6087e363628a05ad781cce00ba003c90ed65d6e816fdf38b6874d838a` |

All 18,229 retained A25 pixels preserve source RGB; accepted head alpha remains exact. Each render preserves the 14,254-pixel protected facial region with zero changed RGBA channels. N hand retained RGB and palm/finger RGBA checks pass. Fixed neutral coordinates remain exact. The supplementary RGB-only and alpha-only controls each detect exactly one pixel and one channel change of magnitude 1. These controls are separate from the unrun production negatives.

Independent vector and scalar counts both reproduce **1,252 shared-hand core texels covered by the sleeve beyond the declared band**, in half-open body bounds [605,708,661,765). That is approximately 25.5% of A14's 4,905 alpha>127 hand-core texels. The maximum signed vertical distance from `y=.7*(x-637)+705` is 60.4 pixels; perpendicular distance is 49.4816 pixels. The nominal band is ±10 signed vertical pixels, equivalent to approximately ±8.1923 perpendicular pixels. Those are pilot definitions, not universal anatomical tolerances. No change of distance convention can explain away the observed palm coverage.

Results: [portable verification](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R5_Independent_Review_2026-10-18/audit_replay/verification.json>) and [independent pilot audit](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R5_Independent_Review_2026-10-18/independent_pilot_audit.json>).

**Independent visual assessment**

The current four-column 384 comparison, current native G off/on renders, current upper-interface crops, marked wrist, both outfits on all five wrist backgrounds, donor coordinate view and selected v2 sleeve donor were inspected. Earlier v1 renders were not substituted for the selected failed v2 evidence.

| Subject | Finding |
|---|---|
| Current jacket sleeve | The ribbed cuff extends over the palm toward the fingers instead of meeting the shared wrist. This remains obvious on light, dark, saturated and textured backgrounds and changes the read of the hand at gameplay scale. The problem is cloth coverage and geometry, not a background-dependent matte illusion. |
| G shoulder/root and jacket style | The new sleeve has a visible diagonal graft/root transition into the frozen cap, with an unsettled stripe entry and differing fold/volume treatment. It does not yet read as a clean new pose of the accepted source-style jacket. This is a failure of the new derivative, not grounds to revise the accepted neutral jacket. |
| G bare arm and hand | The palm-up, lightly cupped open hand is readable, side-specific and plausible as a relaxed offering/explanatory gesture. Thumb/finger arrangement and forearm rotation form a coherent single-side proposal. I found no inherent requirement for a different hand when the jacket is added. Its size and gesture do not force rejection at native or 384 scale. A06/A14 remain unaccepted pilots, not qualified final anatomy. |
| Shared-hand implementation | Both G recipes select the same A14 PNG. The v2 sleeve donor ends as cloth and contains no selected second hand. The failed on-state obscures the existing shared palm rather than demonstrating that sharing the hand is impossible. |
| Wrist point and seam | The point (637,705) is in the current wrist/hand vicinity and the oblique seam is a plausible transverse drawing guide. The images do not prove that the point or slope is anatomically wrong. They also do not establish an accepted cuff plane, receiving wrist region or protected-palm boundary. Their plausible appearance alone is insufficient to freeze the interface. |

Primary evidence: [384 comparison](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R5_Independent_Review_2026-10-18/fresh_extraction/C001_ZANT_GATE_A_R5_FAILED_G_SLEEVE_PILOT/evidence/R5_STOP_comparison_384.png>), [marked failed wrist](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R5_Independent_Review_2026-10-18/fresh_extraction/C001_ZANT_GATE_A_R5_FAILED_G_SLEEVE_PILOT/evidence/FAILED_G_L_wrist_registration_native.png>), [bare-arm native interface](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R5_Independent_Review_2026-10-18/fresh_extraction/C001_ZANT_GATE_A_R5_FAILED_G_SLEEVE_PILOT/evidence/B_off_GN_NN_upper_interface_native.png>) and [jacket native interface](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R5_Independent_Review_2026-10-18/fresh_extraction/C001_ZANT_GATE_A_R5_FAILED_G_SLEEVE_PILOT/evidence/B_on_GN_NN_upper_interface_native.png>).

**Additional interface-export finding**

The bare arm and hand were split from one continuous donor. Their coherent off-state therefore does not independently demonstrate that a separately painted cuff can attach to a well-defined reusable wrist. There is also a concrete limitation in the current split's overlap ownership.

`export_G_L_pilot.py` labels an ownership operation as applying to exterior antialias texels, but selects all donor pixels with alpha<255 inside the ±10 band. The donor has near-opaque alpha throughout much of its interior. The rule therefore divides most interior wrist-band coverage between the arm and hand at the seam, rather than preserving the nominal overlapping coverage there.

The independent diagnostic found:

| Diagnostic | Result |
|---|---:|
| Donor alpha>127 pixels in the nominal band | 888 |
| Actual A06/A14 double-coverage pixels in that band | 35 |
| Band pixels inside a 3×3 donor-core neighborhood | 828 |
| Double-coverage pixels in that interior subset | 7 |
| Donor band-core pixels with neither exported part above alpha127 | 0 |

Thus there is **no demonstrated bare-arm core hole**, and its current seamless appearance is real. But most of the nominal hidden-overlap area acts as a matching boundary between halves of the same painting, with very little double coverage. At the datum itself, donor and hand alpha are 253 while A06 alpha is 0. The 3×3 interior classification is only an analysis method, not a new contract tolerance.

This is distinct from the jacket's excessive coverage: the sleeve artwork overshoots the palm, while the proposed bare-arm/hand export has not established the robust hidden receiving interface its description suggests. Numerical reproduction of either result does not qualify the interface. Diagnostic and reproducible read-only script: [overlap ownership audit](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R5_Independent_Review_2026-10-18/wrist_overlap_ownership_audit.json>) and [diagnostic source](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/C001_ZANT_GATE_A_R5_Independent_Review_2026-10-18/wrist_overlap_ownership_audit.py>).

**What should remain provisional before another sleeve**

I recommend retaining the open-hand gesture as a promising shared-hand candidate, while **keeping A14, the pilot G wrist datum, seam extent and ownership/overlap policy provisional**. Do not freeze the entire current wrist proposal even as an assumed-good remediation target. First obtain owner disposition of the anatomical wrist/cuff plane, palm protection and actual receiving overlap for these new G parts. The point (637,705) and current tangent can remain working references during that review; the evidence does not require moving them, replacing the gesture or reopening any N datum.

There is also an older provisional guide (625,617) in `authoring/G_pose_plan.json`; the operative pilot recipes, export and focused cuff prompt use (637,705). The older file explicitly calls elbow/wrist coordinates guides until measured. This is not an integrity contradiction or a neutral-anchor change, but any approved G interface should identify one authoritative revision rather than allowing the earlier guide to become an accidental competing instruction.

After a local interface decision, new sleeve artwork would still need to meet that interface and source-style jacket requirements. The current cuff must not be excused by widening the band, hiding more palm, selecting an outfit-specific replacement hand, or altering accepted neutral parts. This review changes no coordinates, masks, tolerances or authorizations and approves no new authoring.

**Failure classification**

| Category | Independent conclusion |
|---|---|
| Current A10 jacket-sleeve artwork | Failed: palm coverage and native garment/root/stripe quality justify the stop. |
| Current G wrist/hand proposal | Not proven intrinsically anatomically wrong, but not ready to freeze. The nominal point/seam is plausible; actual overlap ownership is insufficiently established, and the shared cuff fit has not been demonstrated. |
| Broader architecture | No impossibility or budget overrun demonstrated. The same-hand concept remains viable in principle. Opposite G, mixed/GG combinations and all later work remain unproven. No second hand, extra repair layer or relaxed neutral lock is justified by this evidence. |

The rejected v1 processing defect is separate: its broad warm-color predicate removed stripe texels as if they were skin. The selected v2 construction does not apply that predicate. Its cuff/root failure therefore remains a genuine failure of the current selected sleeve, rather than a misreading of the discarded v1 holes.

**Inventory and execution boundary**

All 32 contract IDs are present in the ledger. There are 18 exported logical parts: 15 accepted neutral parts, A06/A14 unaccepted pilots, and failed A10. Fourteen baseline slots are absent. Reserves used: 0. Each render selects declared parts once. The two root-occlusion files are single-channel coverage masks exactly derived from frozen A02/A03 alpha with the declared fade; they contain no repair RGB and are not extra painted surfaces. No combined-body runtime layer, mirrored source arm, neutral fitting or selectable second G hand was found.

| Matrix group | Required | Actual recorded state |
|---|---:|---|
| Body | 24 | 2 accepted neutral reproductions; 1 unaccepted off G pilot; 1 failed on G pilot; 20 unrun |
| Palette | 54 | Unrun |
| Isolated face | 120 | Unrun |
| Assembled face | 28 | Unrun |
| Production negatives | 17 | Unrun |

All 243 IDs are unique. The remaining 222 valid cases and all 17 production negatives were not executed. Four reproducible evidence renders do not constitute four passing Gate A cases. No missing G R, O, expression, palette, viewer, later-gate or integration functionality was tested as though implemented.

**STOP FOR OWNER REVIEW.**
