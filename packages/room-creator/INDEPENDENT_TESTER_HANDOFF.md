# Independent tester handoff — Room Creator v0.14.1

This document is a builder-to-tester handoff, not an independent certification. The candidate is **not promoted**. Perform your own reproductions and make a separate accept/hold recommendation to the project owner.

## Delivered artifacts

- `Room_Creator_v0_14_1_remediation_candidate.zip`: runnable HTML, source, examples, tests, fresh/historical evidence and reports.
- `Room_Creator_v0_14_1_source.zip`: source and test code for review/rebuild; use checkpoint examples/evidence for complete acceptance.
- `Room_Creator_v0_14_1_regression_tests.zip`: new regressions, restored browser tests and portable test tooling; run against the checkpoint source/examples.
- `Room_Creator_v0_14_1_reports.zip`: builder reports, provenance, source diffs, preservation seal and result JSON.
- `SHA256SUMS.txt`: delivered-file checksums. The checkpoint has its own `MANIFEST_SHA256.txt`, excluding only that manifest.

Library dependency: separately supplied `Trapstar_RoomCreator_Asset_Library_v1`, read only. It is intentionally absent from these archives. Do not update it, the original v0.14 ZIP, or the v0.13.1 baseline while testing.

## Identity and first checks

1. Read `reports/INPUT_AUDIT_REPORT.md`, `reports/REMEDIATION_REPORT.md`, `reports/TEST_REPORT.md` and `reports/DEVELOPMENT_ATTEMPTS.md`.
2. Verify delivered checksums and every file in the candidate manifest. Verify library `CHECKSUMS.sha256` independently.
3. Work from a disposable extraction. Run `python source/build.py` and `python tests/build_repro.py`. Built HTML must be 1,615,201 bytes, SHA256 `a4e8a14ddc4d734c036902f56b1a7d7bb8a157a77ef3911b97ea70c76f228c97`, with LF bytes. The builder tested Windows plus LF/CRLF source simulation; independently execute on another OS if cross-platform certification is required.
4. Baseline `examples/Route_Prototype_Street.room.json` SHA256 must remain `5b296703315cf9c1dec1db809faedf2d72df04b11d76e9cae0af0ff374c72d01`. Shipped demo SHA256 is `6497e3d5daa5fd877728e0d40713f965c0bb2cccc06eb3c3431e4175f71443b3`.

Reference distinction: the full `Room_Creator_v0_13_1_route_prototype.zip` is the prior preservation source. The reduced preview inside the asset library has another map hash and no source; do not use it to create a false baseline regression.

## Reproducible environment

The builder used Python 3.12.0, Node 24.18.0, Playwright 1.56.0, Chrome 155.0.8059.41 on Windows 11 with ANGLE SwiftShader. `tests/requirements.txt` pins Python dependencies. Use a fresh environment and a fresh `--out` folder; retain failed runs. Software graphics timings are observations, especially when several tests share a machine.

```
python tests/run_tests.py --suite node
python tests/run_tests.py --library "/absolute/path/to/Trapstar_RoomCreator_Asset_Library_v1" --browser "/absolute/path/to/chrome" --suite all
```

Windows: `tests/run_tests.ps1 -Library <folder> -Browser <chrome.exe> -Suite all`.
Optional full prior v0.12 comparison: add `--prior-v12 <folder>`.
Demo regeneration: run the Python runner with `--suite assets --scripts make_asset_demo.py`; it writes a separate `generated/` map. Do not run `route/make_route_scene.cjs` over the baseline. See `tests/README_TESTS.md` for all environment and output options.

## Independently challenge the repairs

- **F1:** prop-only story refuses ordinary deletion. Furnished forced deletion removes its props. Delete an empty middle story and confirm all higher props shift with rooms, rather than normalizing to Ground. Delete a room once with no floor underneath and once with an independent supporting floor. Check counts/messages, custom metadata, undo, redo and saved reopen for each. Include floor cuts and a retained/rehosted prop.
- **F2:** use front calibration 90/180/270 with nonzero instance rotation and nonuniform scale. Snapshot rendered pose, collision polygon, world point positions/headings and custom data. Delete calibration and import both conflicting and previously absent setups. Existing setup conflicts must be kept and reported; no silent replacement. Repeat undo/redo and saved reopen. Confirm defaults on subsequently placed copies.
- **F3:** drag elevated point handles on raised objects and upper stories, including rotated/scaled objects. Keep handles visibly inside the canvas. Sub-threshold drags must not change data. Visible drags must follow the pointer on the actual height plane; height/custom metadata must survive history and reopen.
- **F4:** ray through the empty (0.9,0.9) corner of a radius-1 round footprint must be clear; centre crossing must block. Include rotated/stretched circles, collision offsets, low/high/sloping rays, disabled/non-solid props and legacy pillars. Walking retains deliberate safety margins; sight uses the collision polygon without those margins.
- **F5:** open projects with missing palette, library texture, embedded image and incompatible palette references. Inspector must show the retained ID and repair/reset controls. Save/reopen without repair must retain it. Field reset must leave unrelated unknown metadata intact. Valid canonical textures/palettes must still render; original acceptance D8b specifically guards this.
- **F6:** inspect restored tests and parameterized paths. Rebuild from LF and CRLF source trees and compare exact bytes. Repeat deterministic package creation using `tests/package_checkpoint.py`. Run on another native OS when available. Separate historical results from fresh runs and assertions from printed observations.
- **F7:** simulate one transient read failure, persistent failure and a readiness deadline. At most three automatic attempts; diagnostics must name the asset/path/error. Explicit Retry should recover after repair. Late results must not replace a newer template or connection. Demo generation must stop before editing/saving if models remain unresolved. Successful normal generation must retain all 69 prop references and source navigation data. Original intermittent root cause remains unknown.
- **Cache:** load project palettes, reset/new/reopen and reconnect; confirm obsolete prop resources are released. Broader cache capacity, long-duration soak behavior and performance scaling remain deferred debt.

## Promotion review

Expected builder assertions: 297 existing Node assertions, 11 new core regression cases, 45 new browser checks, 60 original asset-browser checks, 327 loaded models, four demo integration checks, exact build byte checks and unchanged input/baseline seals. Read the recovered preservation/route outputs and inspect their images: most are observational scripts, and exit 0 alone is not a pass for every named feature.

Review the furnished stockroom/shop/street, upper-story placement, route walk, sky, rails/exports, stairs/floor holes, legacy examples and 2D fallback. Recheck licence flags and unknown metadata. The inherited coarse vehicle cover, story-wall overlap, unfinished NPC art/facing, absence of instancing/LOD/snapping and data-only gameplay tags remain disclosed limitations.

Record your own result, evidence hashes and unresolved findings. The project owner controls canonical promotion; do not treat builder completion as authorization to overwrite either baseline or library.
