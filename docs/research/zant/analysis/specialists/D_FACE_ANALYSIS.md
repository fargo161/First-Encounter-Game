# Specialist D — face/head/hair findings

Completed 2026-10-18. Owner-facing synthesis: [03_FIVE_SLOT_FACE_SYSTEM_ANALYSIS.md](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/03_FIVE_SLOT_FACE_SYSTEM_ANALYSIS.md>). This specialist independently read the master prompt and source facts, inspected all image families and construction records, and wrote only analysis outputs. No supplied builder was executed or source changed.

## Lead decisions

Retain five anatomical semantics with revised identity/view-specific masks and compatibility. Canonical head unit is the approved per-identity/view package, not universal interchangeable facial features. Front and three-quarter support five slots, side a reduced visible brow/eye/lower face, back none. Keep paired baked eyes for v0.1; distinct iris translation is unproven. Preserve complete presets and deliberate unilateral controls, but require approved mixes or demonstrated compatible families. Extreme silhouette-changing jaw/cheek states need an explicit extended head set with replacement silhouette/neck transition and companion compatibility.

The existing portrait is sufficient evidence to test the method, but insufficient as a production wardrobe-independent four-view head. Base and some lower-face slots include blue tracksuit collar, upper neck, ears, and hair-context pixels. Actual sampled lower-mask weights at collar (350,950)/(840,950) are230/223; at neck (600,970),178. This is a concrete separation gap, not a theoretical concern.

## Independent verified results

- All90 full-canvas RGBA slots,18 previews,18 raw edits, five masks, base, guides, manifest, prompts, and validator are readable. All111 hashes listed by facial manifest match; manifest list covers derived image outputs, not raw edits/masks/scripts/prompts.
- All18 saved previews exactly recompose in all four channels. All90 match an independent reconstruction of documented extraction. Base exactly matches registered neutral09. Outside mask union all18 retain exact base pixels.
- Raw images:17 RGB, one RGBA;14 rasters1165×1350, three1166×1349, one1164×1351. Registration is centered raster fit, not landmark alignment.
- Composite alpha is the same across18 and retains base nonzero silhouette support, but differs from base intensities. Neutral09 changes310,208 alpha pixels and zero RGB pixels. Dominant base alpha253 (672,492 pixels) and252 (260,655) accumulates under source-over; maximum boundary delta67. Only324 base pixels alpha255.
- Saved slots retain763,674–904,822 hidden nonzero RGB pixels per file. Safe straight-alpha composition works, but later exports/filtering need a declared policy.
- Supplied validator line266 uses RGBA `getbbox()` that can ignore RGB changes. In-memory same-alpha one-pixel mutation demonstrates false pass; independent all-channel actual tests still pass18/18. Do not describe this as corrupt delivered preview data.

## Falsifying diagnostic combinations

Eight mixtures made only from supplied art were visually inspected. M2 (neutral09 brows/lower; paired10 eyes) visibly erases/attenuates brows. Eye patches own skin where expression10 moved the eyebrows upward; draw order overwrites the chosen neutral brow. Same-side brow/eye masks overlap18,079 pixels, with5,029 at both opacities above half. This is a semantic independence failure despite perfect registration.

M3 unpaired10/12 eyes produces incompatible attention. M1 mixed05/18 brows and18 mouth and M7 unilateral15/09 closure are useful asymmetry candidates, not automatically approved final art. Other mixtures expose tension/skin-context constraints. Delivered previews03/08/10/11/16/17 also show conspicuous white contour strips; alpha transfer cannot correct shifted donor silhouettes or baked matte RGB retained inside the base silhouette.

## Evidence and unresolved gates

All scripts/JSON/contact sheets are in [evidence/face_D](<C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Trapstar_ZANT_analysis_2026-10-18/evidence/face_D>). `face_measurements.json` contains all per-file, per-slot, per-expression, mask overlap, hash, normalization, and mixture results. `supplement_face_measurements.json` records alpha distributions, sampled context coordinates, and explicit bright-pixel diagnostic threshold. Scripts are `analyze_face.py` and `supplement_face.py`; `face_contract_example.json` is an analysis-only schema proposal. PNGs are labeled diagnostic evidence and are not production assets.

Open gates: revised masks avoiding cross-slot feature overwrite; source-master fidelity approval; true wardrobe/hair independence; front/three-quarter/side correspondence; extended silhouette package; facial-hair/accessory deformation; final-scale visual quality; authoring cost. Recommend chosen body proof identity receive a wardrobe-free head package, four neutral view bases, small front tests for asymmetry/paired gaze/wink/bounded lower-face stress, one nonneutral three-quarter preset, and an explicit rejected unpaired gaze case. Goose remains an unchanged control, not an automatic first proof choice.

Stop at owner review. No gameplay taxonomy, production implementation, new expression generation, or Encounter/Room Creator edits were performed.
