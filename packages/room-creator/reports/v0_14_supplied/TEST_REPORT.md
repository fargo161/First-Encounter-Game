# Room Creator v0.14 — test report (2026-10-18)

Section 0 is new for 0.14 (asset library, 3D objects, demo map). Sections 1–5 are the earlier reports; their suites were
re-run on 0.14 as listed in 0.6. Evidence files are in `tests/` and `tests/assets_evidence/`.

## 0. Asset library and 3D objects (0.14)

| Check | Result | File |
|---|---|---|
| Data model: unknown/custom fields survive load→edit→save; defaults; missing refs kept; placement maths; collision | 10 / 10 | `props_metadata.test.js` |
| Example maps: baseline byte-identical to 0.13.1 (sha256 5b296703…); demo valid, round-trips unchanged, keeps route net/stories/stairs/views, removed only the replaced boxes, exercises every feature | 6 / 6 | `asset_demo_file.test.js` |
| Browser acceptance (real clicks, keys, fields): library connect + counts + check + thumbnails + licence marks + broken-library messages + folder-chooser fallback; place/ghost/turn/Shift/Esc; map select, drag, rotate handle, keys; inspector edits; duplicate/delete/undo/redo; replace; first-person place and pick; save → reopen in a fresh editor with custom data byte-identical, also without the library; looks, per-object overrides, palette chips, swatch recolour, palette editor, painted-model texture, floor texture via Style tab, export/import looks, library file untouched; collision → nav grid, route check, walk-through, round shape, sight lines, walking; Use Points move/turn with object, plain-terms editing, custom types, front side 180°/90°, default points; missing asset placeholder; upstairs placement; route walk; no page errors | 60 / 60 | `assets_browser.py` → `assets_browser_results.json` |
| Every library model loads; size matches manifest; pivot on the ground; palette image matches | 327 / 327 load, 0 problems | `assets_all_models.py` → `assets_all_models_results.json`, `assets_evidence/all_models_contact_sheet.png` |
| Demo vs baseline: cover at N4/N5 (crouched hidden share 0.73 / 0.85 vs 0.54 / 0.45 with the boxes), route walk runs with solid objects, route check clean except one intended "narrows" note, draw times, stress copy (569 objects) | 4 / 4 | `assets_demo_checks.py` → `assets_demo_checks_results.json` |
| Editor responsiveness (open, save, select, edit, duplicate, undo/redo, palette, story switch) — demo and stress | measured | `assets_perf.py` → `assets_perf_results.json` |
| Vehicle front direction by eye | all +Z except Plane | `assets_vehicle_fronts.py` → `assets_evidence/vehicle_fronts.png` |
| Demo screenshots (first person and map) | reviewed | `demo_screens.py` → `assets_evidence/demo_*.png` |

### 0.6 Older suites re-run on 0.14
- Node suites (all pass, same counts as 0.13.1): core 84, architecture_extensions 59, style_openings 37, shared_matte 26,
  v0_11_1_story_floor 24, multistory 21, v0_12_stories_rooms 16, construction_v10 14.
- Route walk: `route_keys` output identical to 0.13.1 (diffed); `route_smoke` and `route_perf` run normally
  (step 0.52 ms, draw 7–9 ms). These scripts carry 0.13 workspace paths at the top — change them to run elsewhere.
- Pre-0.13 browser suites (`browser_acceptance.py`, `construction_v10_browser.py`, `multistory_browser.py`,
  `architecture_extensions_browser.py`, `style_openings_browser.py`, `shared_matte_browser.py`, and the `.cjs` story
  tests) give **exactly the same results on 0.13.1 and 0.14** when run side by side. Their failures pre-date 0.14 (they
  look for buttons that 0.12/0.13 renamed or moved, and one undo-during-drag case is timing-sensitive in both builds).
  Set `CHROMIUM=/path/to/chrome` for the Python ones.

### Environment
Headless Chromium (Playwright 1.56) with SwiftShader software graphics; Node 22. Browser tests load the page from a
local web server (`python3 -m http.server 8770` in the folder above `v14/`), because a page opened from disk cannot read
the library folder without a person choosing it.

# Room Creator v0.13.1 — test report (2026-10-18)

Sections 1–4 are the v0.13 results (unchanged code paths still pass; the node suites were re-run on 0.13.1). Section 5 is new: the route-walk prototype.

All checks below were run on the final build in this package.

## 1. Project-model tests (Node.js, `tests/*.test.js`)

| Suite | Result |
|---|---|
| core.test.js | 84 passed, 0 failed |
| architecture_extensions.test.js | 59 passed, 0 failed |
| style_openings.test.js | 37 passed, 0 failed |
| shared_matte.test.js | 26 passed, 0 failed |
| v0_11_1_story_floor.test.js | 24 passed, 0 failed |
| multistory.test.js | 21 passed, 0 failed |
| v0_12_stories_rooms.test.js | 16 passed, 0 failed |
| construction_v10.test.js | 14 passed, 0 failed |

Run them with `node tests/<name>.test.js`. (Version checks were updated from format 10 to 11.)

## 2. Browser tests (headless Chromium, `tests/browser/*.py`)

These drive the real editor with mouse and keyboard on the City Block.

| Test | What it checks | Result |
|---|---|---|
| ui_smoke | load, zoom 1×–60×, wheel zoom to 36×, Plan view, Labels button, story switch, first person and back | pass |
| fp_test | drag-to-look, W walk, wheel lens, E eye height, each one Undo step, Undo, free camera, walking into a wall, Save as viewpoint, double-click map floor → free camera, double-click glide | pass |
| fp_test2 | walking stops at walls in all four directions; free camera walks up a full flight (0 → 3.2 m) and back down | pass |
| sky_test | presets, picture mode picks the skyline panorama (not a sign), slider live edit, click-to-set horizon, haze, preview drag, Undo | pass |
| rails_test | new rail by clicking 3 markers, plan 62 m / 27 s with no warnings, play, ride in first person, scrub, export JSON (818 frames), JPEG frame zip, WebM video, test-walk glide between linked views | pass |
| rails_test2 | Shift-click inserts a bend, drag a bend (one Undo), Alt-click removes it, ride a rail in Test walk and finish at its last stop | pass |
| stories_test | Build-up trial for all 15 shape × edge combinations (all succeed, all get automatic stairs), wizard UI, build a story with stairs, select stairs on the map, Walk up in first person and climb to the new floor, Stairs tool drag, Page Up, Floor hole tool (also opens the ceiling below) | pass |
| rail_stairs_check | a rail between two stories climbs the stairs (0 → 3.2 m), no warnings | pass |
| final_test | every example file opens (format 11), the untouched v0.12 City Block file opens and upgrades to format 11, save → reopen gives an identical project, the demo rail rides from the street through the bodega door and up the stairs to the flat (52 s), no WebGL at all → "2D FALLBACK" badge and editing still works | pass |

No page errors were logged in any run.

## 3. Speed on the City Block (17 rooms, 46 floor pieces, 164 pillars, 120 walls, 63 objects)

| | v0.12 | v0.13 |
|---|---|---|
| Work the browser's main thread does to draw one map frame | 275–330 ms | 3–6 ms |
| Checking the project after an edit (validation) | 135 ms | 9 ms |

What this means: v0.12 drew every pixel of the map with JavaScript, so each frame took about a third of a second no matter how good the computer is — that is why panning and zooming felt sticky. v0.13 hands the drawing to the graphics card; the main thread only needs a few milliseconds, so the page stays responsive.

Honest limit of this measurement: the test machine has no graphics card, so the browser imitates one in software. Including that imitation, a full frame took 80–320 ms here. On a computer with any normal graphics card the same work takes a few milliseconds, but I could not measure that here.

## 4. Not covered by automatic tests

- Real mouse "feel" on your own hardware (speed of walking, look sensitivity, wheel steps) — tune in use.
- Video export length and quality depend on how fast the computer renders in real time.
- Firefox and Safari were not tested (Chrome/Edge are the targets).

## 5. Route-walk prototype (0.13.1, `tests/route/`)

| Test | What it checks | Result |
|---|---|---|
| node suites | all eight suites re-run after adding the optional `routeNet` block | pass (same counts as above) |
| route_smoke | scene opens, route walk starts in first person, walking, looking, map view | pass, no page errors |
| route_keys | every key: W/S, A/D (strafe stops at ±0.70 m), arrows (look stops at 95°), R twice, Tab, C, closed door stops you, E opens it, walking into the bodega, Space, 1/3, Esc; leaving puts the door back, adds nothing to Undo, project not marked changed | pass |
| route_perf | one simulation step (12 NPCs, 2 cars) and the debug drawing, after warm-up | 0.3 ms per step, about 1.3 ms extra per frame for the overlay |
| route_eval | five scripted, seeded walks plus settings sweeps (27 runs, about 47 simulated minutes), flicker test of the picture picker | see PROTOTYPE_FINDINGS.md |

Rules checked in every scripted walk (all runs): NPCs or cars appearing or vanishing where you could
see them **0**; two people on one spot **0**; bodies overlapping **0 s**; NPCs walked through from behind **0**.

Honest limit: the test machine has no graphics card, so the live loop ran at about 2 frames a second here.
That is the software imitation of a GPU, not the prototype: its own work is under 2 ms a frame. The
evaluation therefore steps the simulation in fixed 1/30 s steps instead of real time.
