# Specialist B — body/view/pose findings

Completed after Specialist A. Detailed comparison and proposed gate/counts are in [02_ARCHITECTURE_OPTIONS.md](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/02_ARCHITECTURE_OPTIONS.md>).

Recommend one semantic contract + character/view calibration and technical compatibility profiles. Visible arms/legs use garment-aware whole-limb states with small validated transforms. Eight supplied bodies are reference exemplars, not proven independent chassis. Preserve C034 mass/stains, C020 layered long cloth, C042 hem/tights asymmetry; do not scale everyone into bins.

Source evidence: all44 shared1024×1536 yet ground/bottom spans159px; fit/calibration exact duplicates; within-bin ratio overlap; original C033 shoulder/jersey changes, C020 coat panels, C042 dress/ripped-tights/striped sleeves. These make arbitrary segmented rotations weak. Semantic elbows/knees need not be visible cuts.

Minimum targets: root/scale + foot contacts; pelvis/hips; torso; neck; shoulders; state-specific wrists/hands and ankles/feet; elbow/knee guides. Four views0/45/90/180 target yaw with explicit left/right convention. Per-view geometry, same person/scale/hem proportions. Same-view head/body default; adjacent-facing only after visual QA. Mirroring per asset; source asymmetries forbid blanket mirroring.

Reconciled budget:91surface slots, frontgate32; neutralallfourviews,armN/G eachside front+3/4only,legN/O eachside frontonly,matchedhands/shoes,frontface7+3/4preset5+side3. Optional4liner/occlusion+2frontpelvis reserves cap97; masks/approvalimages extra. Full2states/side/limb/allviews under thissame15facepatch/hand/shoecontract would be115surfaces(24more than sparse:8arms+4hands+6legs+6shoes), before6reserve. Sparse coverage explicitly does not validate alternate side/back poses or3/4 leg alternatives;3/4faceknownpreset is not freemixing. Lead05 is binding. Neutral face inherits immutablebase/no-op; no emptyfilesneeded. Tenmaterialmasks must denote logicalmasksets/packedatlases with per-surfacecoverage, not assume10filescover everyposedraster.

Root caution: floorY1450 clips tallest1498px source bbox if translated at unchanged scale. Root-local coords and variable transparent frame padding are safer;Y1516 in1536 frame fits current tallest neutral with18px head margin but leaves poor gesture room. Do not rescale characters to fit pose bounds.

C001 first; frontfail-fast before authoring other3views; C033/C034 reuse/fit next; C020 longcloth then C028 gear. Require explicit admissible stance pairs and torso support state when shoulder/cloth pull needs it. Firstproof cannot certify future animation or every cross-product. All source/Encounter/Room Creator files remain unchanged.
