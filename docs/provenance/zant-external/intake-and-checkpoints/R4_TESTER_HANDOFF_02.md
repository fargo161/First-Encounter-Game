# C001 R4 final shoulder cleanup: owner-review handoff

**NEUTRAL PAIR READY FOR OWNER ART REVIEW. STOP.**

Review-only candidate: `C001_ZANT_GATE_A_R4_NEUTRAL_REVIEW_CANDIDATE_02.zip` (33,921,583 bytes; 149 manifest-governed files plus manifest). The neutral contour is not owner-accepted or frozen for reuse. Gate A remains incomplete. A25 alone retains its prior acceptance.

ZIP SHA-256: `c43e34ac80a8fd32f1ee5f30e5116dad06129a10b196032afc2fb2746a8188b3`

Manifest SHA-256: `e7a727520b99ec3fc2c273f79843c4a951adf11dbe5bbf4e2eeaf33a791af4c9`

Fresh-extraction builder audit SHA-256: `6aea6dc1584eebe4360e59b2d6a4a0e721d3beb1f11726a89fe9047dbf3b8e49`

This revision restores exactly15 pre-existing tee-edge texels into previously transparent locations of A05 (6) and A04 (9), near the two reported shoulder ledges. No existing visible RGBA texel changes. All other assets, anchors, registration and layer orders remain exact. Jacket-on differs from candidate01 in zero decoded RGBA pixels. A25 and A16 are byte-identical. A16 remains the authored waist proposal awaiting an owner material/design decision; it is not source-exact RGB.

Begin with `evidence/source_vs_R4_pair_384.png`, `evidence/neutral_pair_native.png`, `evidence/shoulder_contours_before_after_native_5bg.png` and the3x location board. Read the current report and `contract/R4_SHOULDER_FINISH_AUTHORITY.md`. The CSV enumerates every changed texel. Earlier authoring provenance is retained separately and was not rerun for this finish.

The builder extracted the archive afresh and ran the standard-library verifier. Both declared recipes replay exactly in all RGBA channels, including hidden RGB, and reopened audit PNGs match. The accepted head/source-RGB/alpha/registration checks pass. The local neutral checks also pass, with zero tee slivers and no missing coverage in declared join cores. These results certify technical reproduction, not owner art acceptance or a completed Gate A proof. Actual results: `fresh_author_audit_results_02/verification.json` and `FINAL_REVIEW_INTEGRITY_02.json` beside the archive. Source/R1/R2/R3 and both independent-review trees remain unchanged; candidate01 and its prior external files remain unchanged.

For a fresh read-only independent audit, extract to a new folder and run from its packet root:

```powershell
python .\validation\verify_checkpoint.py --out ..\audit-r4-shoulder-independent
```

Use a new external output directory. Python3.12 standard library suffices; no network/install. Do not run authoring scripts or repair the packet. Confirm hashes/manifest before and after review, inspect native and384px views, and return findings to the owner outside the packet.

Inventory remains32 baseline slots:15 exported,17 held,0 reserves. Only two neutral recipes exist, pending acceptance; all other224 valid cases and17 production negatives remain unrun. No alternate state, facial work, palettes, viewer, Gate B or integrations were started.

**STOP FOR OWNER ART REVIEW.**
