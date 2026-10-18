# CODEX HANDOFF — TRAPSTAR Room Creator v0.14 (start here)

This file lets a new technical agent understand, run and verify the project **without any earlier chat history**.
Read it top to bottom once; it links to the deeper documents. Package date: 2026-10-18.

---

## 1. What Room Creator is
A **browser-based, single-file level editor** for TRAPSTAR, a first-person / rail-shooter "living comic" game set in a
gritty 90s city block. You build rooms and stories on a 2D plan, see them in a WebGL 3D first-person view, place
viewpoints, author rails (camera routes), a route-walk prototype (player route + NPC lanes + cover spots), and — new in
0.14 — place real **3D objects from a standardized asset library** with appearance variants, collision, gameplay tags
and Use Points. It is an authoring tool: it records *where and what* things are; game systems decide behaviour later.
Open `Room_Creator.html` directly in Chrome/Edge — no server, no install, no network.

**Status:** v0.14 complete. All 0.14 automated checks pass (§9). Not a released game; internal tool.

## 2. Authoritative files (this package is the source of truth)
| What | File |
|---|---|
| Runnable build (everything inlined, incl. three.js r159) | `Room_Creator.html` (sha256 starts `c8c2190019810bf9`; the build is deterministic) — rebuild with `python3 source/build.py` |
| Source (edit these, never the built HTML) | `source/` (see §4) |
| Data format reference | `source/FORMAT.md` (0.14 section first, then format 11 history) |
| Baseline map — **must stay byte-identical** | `examples/Route_Prototype_Street.room.json` (sha256 starts `5b296703315cf9c1`) |
| Furnished integration map (0.14) | `examples/Route_Prototype_Street_ASSET_DEMO.room.json` (sha256 starts `6497e3d5daa5fd87`; regenerate: `tests/make_asset_demo.py`) |
| What changed / why / evidence | `CHANGELOG.md`, `IMPLEMENTATION_REPORT.md`, `TEST_REPORT.md` |
| User guides | `START_HERE.txt`, `README.md`, `README_ROUTE_PROTOTYPE.md` |
| Route-walk prototype results (0.13.1) | `PROTOTYPE_FINDINGS.md` |
| Checksums of every packaged file | `MANIFEST_SHA256.txt` |
| Tests + evidence | `tests/` (runner: `tests/run_asset_tests.sh`), screenshots in `tests/assets_evidence/` |

**Not included (external dependency):** the asset library `Trapstar_RoomCreator_Asset_Library_v1` (327 models, 1043
textures, 3 palettes; ~227 MB). It is delivered separately and is **read-only canonical data** — never modify it.

## 3. Run it
1. Open `Room_Creator.html` in Chrome or Edge (bottom right should read "3D · GRAPHICS CARD").
2. Open → `examples/Route_Prototype_Street_ASSET_DEMO.room.json`.
3. Library tab (left) → Connect asset library… → pick the unzipped library folder. (Without it, objects show as boxes.)
4. Try: click an object card → click a floor; select → drag / round handle / right-panel sections. Header **Route walk**
   runs the 0.13.1 prototype on the furnished street.

## 4. Architecture
**Build.** `source/build.py` reads `shell.html` and replaces tokens with files: `STYLE` (style.css), `THREE`
(vendor-three.min.js, r159, MIT), `GLTFLOADER` (vendor-gltfloader.js → `window.RCGLTFLoader`), `LEGACY1/3`
(old-format importers), `CORE` (core.js → `window.RCCore`, also `require()`-able in Node), `RAILS` (rails.js →
`window.RCRails`), `RENDERER` (renderer.js → `window.RCRenderer`, 2D fallback + helpers), `GL` (gl.js → `window.RCGL`),
`ASSETS` (assetlib.js → `window.RCAssets`), `APP` (app.js with all `ui-*.js` spliced in at `/*UI_EXTENSIONS*/`).
Output: one self-contained `Room_Creator.html` (~1.6 MB).

**Shared scope rule.** `app.js` + `ui-gl.js, ui-fp.js, ui-sky.js, ui-rails.js, ui-stories.js, ui-route.js, ui-props.js`
run in ONE function scope (shared `project`, `catalog`, `selection`, `panel`, `pane`, `tool`, `mutate`, `capture`,
`pushHistory`, `restore`, `refresh`, `renderLeft`, `renderInspector`, `drawSoon`, `toast`, `GLE`, …). A duplicate
top-level name would silently replace another — `build.py` now refuses to build if that happens.

**Extension points.** `HOOKS` (defined in ui-gl.js): `pointerDown, pointerMove, pointerUp, mapClick, dblClick, wheel,
keyDown, keyUp, click, action, drawGraph, underGraph, underlay, top, messages, leftRender, inspectorRender`. A handler
returns `true` to consume the event. Order = module order in `build.py`. Test/automation hooks: `RCApp` (project,
mutate, undo/redo, applyBundle, makeBundle, saveProject, selectView, selectRoom, selectStory, setMode, projectPoint,
focusMap, engine, rails, `ext()`) and `RCApp.ext().{fp, sky, rails, stories, route, props}`.

**Edits and history.** Every change goes through `mutate(fn,label)` = snapshot → change → `C.validateBundle` (normalizes
and checks everything) → history (200 steps) → refresh. Drags change in place then `pushHistory(before)`. Crash recovery
stores the latest bundle in IndexedDB. Save = one `.room.json` (project + embedded images).

**Modules (what to read for what).**
- `core.js` — project model, validation/migration (format 11), geometry (rooms, walls, openings, stories, stairs),
  viewpoint-first cover pairs, route-net normalization, and 0.14 props maths (`normalizeProp`, `propAppearance`,
  `propYaw`, `propFrontTurn`, `propToPlan`, `planToProp`, `propFootprint`, `propBlocksWalking`).
- `gl.js` — WebGL renderer (map + first person): rooms, surfaces, lights, sky, haze, GPU picking, a `dynamic` layer for
  route-walk cards, and the 0.14 `props` layer (one shared model per asset, per-copy shader material with tint/palette/
  hue/brightness, room light pools, grey "loading" / pink "missing" placeholder boxes).
- `rails.js` — 0.2 m walk grid per story (walls, pillars, solid 3D objects), path-finding, rail timing.
- `assetlib.js` — library connection (folder handle / file list / URL providers), manifest index and plain-language
  check, one-load-per-model cache with precise bounds, thumbnails rendered from GLBs (IndexedDB cache), provenance.
- `ui-props.js` — Library tab, placing, selecting/dragging, inspector (placement, appearance, collision, gameplay,
  Use Points, info/licence/front side), looks/palettes/textures, export/import, route conflict check, overlays.
- `ui-route.js` — route-walk prototype (player, NPC cards, traffic, sight lines that include solid 3D objects).
- `ui-fp.js` first-person editing and walking; `ui-rails.js` rails; `ui-stories.js` stories/stairs; `ui-sky.js` sky.

**Coordinates.** Plan metres, `x` east, `y` south, stories stacked (`storyHeight`), heading 0 = north, clockwise. 3D
world = (x, height, y). Library models: metres, +Y up, ground-centre pivot, front +Z unless the model setup says
`frontTurn` 90/180/270 (+X is the model's left). Object `rotation` = heading its real front faces.

## 5. Data rules that must not be broken
1. **Unknown/custom metadata survives load → edit → save unchanged** everywhere in `props`, `objectLibrary` and
   `routeNet` (hard requirement from the commissioner; tests `props_metadata.test.js`, browser C1–C4).
2. Tags and Use Point types are **open-ended** (any string; tag objects allowed). No closed lists in data or code paths.
3. A missing asset / look / palette reference is **kept** for repair (placeholder + message), never deleted.
4. Projects reference library models by stable `asset_id`; no geometry in project files. Library textures used on
   surfaces are copied in as project images (with `library.asset_id`).
5. Format number stays 11; new blocks are optional and only written when present (old files unchanged).
6. The library folder is never written. Looks/palettes/setups live in `project.objectLibrary` and move between projects
   via Export/Import (`trapstar-room-creator-looks` v1).
7. `examples/Route_Prototype_Street.room.json` stays byte-identical (checked by `asset_demo_file.test.js`).

## 6. Feature status
**Implemented and tested in 0.14** — Library tab (connect, check, browse/search/categories/recent/favourites, textures,
palettes, looks views); place on map and in first person (ghost, turn, Shift keep, Esc); select/move/turn/nudge/size/
stretch/height; duplicate, delete, replace (keeps placement, tags, points); switched on / locked; looks (shared),
per-object overrides, palette chips + editable project palettes + per-object colour swatches, UV-model texture swap,
colour adjustments, Pixel/Smooth; library textures on room surfaces; export/import looks; collision (solid, auto/box/
round) feeding walking, rails, route-walk sight/blocking; route conflict report; open tags + extra properties; Use Points
(any type, plain-terms editing, drag, defaults for new copies); 4-way model front setup; licence-unverified flags;
furnished integration map; undo/redo for all of the above.

**Inherited and still working (0.10–0.13.1)** — rooms, floor sections, free walls/partitions, pillars, doors/windows/open
walls, ceiling cuts/patches, light pools, images/objects (2D sprites), texture studio, saved room looks, shared exterior
mattes, viewpoint-first Cover ↔ Exposed pairs, Test walk, WebGL renderer with 2D fallback, direct first-person editing,
free camera, rails with video/frames/camera-path export, sky + haze, multi-story with stairs and floor holes, and the
0.13.1 **route-walk prototype** (route net: edges/strafe band, NPC lanes, spots with one occupant, zones, portals,
traffic, actors; placeholder NPC cards; debug overlay and measurements).

**Not implemented (by design for this pass; candidates next)** — runtime gameplay (tags/points are data only),
procedural furnishing, Unity export, instancing/LOD, tilt/roll rotation, wall snapping, multi-select, two-box vehicle
collision, a GUI editor for the route network (still JSON), an asset gallery scene. See IMPLEMENTATION_REPORT §13.

## 7. Gameplay / data concepts preserved from earlier work (do not lose these)
- **Viewpoint-first cover**: a viewpoint can be paired (Cover ↔ Exposed); cover is assigned per viewpoint.
- **Route walk**: player moves along authored route edges inside a narrow strafe band (bulges at spots); junctions chosen
  by looking; doors block branches; crouch; cover is decided by **sight lines** (walls with openings + solid boxes with
  heights — now including solid 3D objects). Spots (`nodes`) hold one occupant; NPCs spawn/despawn only out of sight.
- **NPCs are 2D cards** (FRONT / 3/4 / BACK…) against rough 3D scenery; traffic is 2D — intentional art direction.
- **Art direction**: low-poly, pixel textures (Pixel filter default), visible repetition, mixed fidelity, old-PC feel.
  Do not "modernize" (no PBR push).
- **Use Points / tags** describe affordances (sit, work, customer, cover, hide, driver, search, …) for later systems; the
  demo mirrors the route-net cover spots N4/N5 as cover points on the real car.

## 8. Known issues and limitations (summary)
Full list with reasons: `IMPLEMENTATION_REPORT.md` §9 and §11. Highlights: one box/circle collision per object (cars give
generous cover); library models disagree on front direction (fixed per model via setup); upstairs walls overlap
street-level walls in maps where `wallHeight` > `storyHeight` (pre-existing; flicker if textures differ); full map
rebuild cost grows with triangle count (no instancing yet); Firefox/Safari cannot remember the library folder; surface
textures on UV vehicles replace their whole picture; library PREVIEW thumbnails are colour-wrong (editor renders its own).
Old pre-0.13 browser suites have stale selectors — same failures on 0.13.1 and 0.14 (TEST_REPORT §0.6).

## 9. How to test
```bash
# everything (needs python3 + playwright + chromium, node 18+); library path is required
tests/run_asset_tests.sh /path/to/Trapstar_RoomCreator_Asset_Library_v1 all
# data-only checks (no browser, no library)
for t in tests/*.test.js; do node "$t"; done
```
The runner links the package and library into a temp folder, serves it on 127.0.0.1:8770, sets `RC_BASE`, `RC_PAGE`,
`RC_LIB`, `RC_FIXTURES`, `RC_LIB_DIR`, and runs: all `*.test.js`, `assets_browser.py` (60 UI checks),
`assets_all_models.py` (327 models), `assets_demo_checks.py`, `assets_perf.py`, `assets_vehicle_fronts.py`.
Expected: `ALL CHECKS PASSED`. Results land next to each test as `*_results.json`; pictures in `tests/assets_evidence/`.
Regenerate the demo map: `python3 tests/make_asset_demo.py` (same env vars; a server must be running) then
`python3 tests/demo_screens.py` for screenshots. Route-walk scripts: `python3 tests/route/route_smoke.py | route_keys.py |
route_perf.py | route_eval.py` (open the page from disk; output in `tests/route/out/`). Do **not** run
`tests/route/make_route_scene.cjs` — it would regenerate the baseline map.

**Recorded results for this package** (TEST_REPORT §0): props_metadata 10/10 · asset_demo_file 6/6 · browser 60/60 ·
models 327/327, 0 problems · demo checks 4/4 · eight older node suites all pass · route-walk key test identical to 0.13.1.

## 10. Dependencies and source assets
- Runtime: none beyond a modern browser (WebGL2 preferred; 2D fallback exists). three.js r159 + GLTFLoader r159 inlined
  (MIT, `THREE_LICENSE.txt`).
- Tests: Python 3.10+ with Playwright (≥1.45 for folder upload), Chromium; Node 18+ (22 used). Pillow optional.
- Asset library v1: `ASSET_MANIFEST.json` (schema 1.0, 1373 assets), `CATEGORY_SCHEMA.json`, `SOURCE_PACK_MANIFEST.json`,
  `STANDARDIZED_LIBRARY/` (GLB models, palettes, textures). 306 palette-mapped models (3 palettes), 21 UV-textured.
  **29 vehicles have unverified licences** (`cars_lowpoly_v2`, `cars_kent_lowpoly`) and stay flagged in the UI.
  The pixel texture pack may not be redistributed raw — keep the library out of shared packages.

## 11. Verification checklist for the audit chat
1. `sha256sum -c MANIFEST_SHA256.txt` (all OK).
2. `python3 source/build.py` then confirm `Room_Creator.html` matches the manifest hash (deterministic build).
3. `for t in tests/*.test.js; do node "$t"; done` — all pass (includes the baseline-map hash check).
4. With the library: `tests/run_asset_tests.sh <library> all` → ALL CHECKS PASSED.
5. Manually: open the demo, connect the library, walk "Route walk", open the furnished viewpoints (Stockroom, Flat ·
   dining/living, Shop counter, Parked cover car, Taco truck), select an object and change its look.
6. Read IMPLEMENTATION_REPORT §9/§11/§13 for limitations, library findings and next steps.

## 12. Working rules for builder / tester chats
- Edit `source/`, rebuild with `python3 source/build.py`; never hand-edit `Room_Creator.html`.
- Use `mutate()` for every data change; keep unknown keys; extend `core.validateBundle` + `FORMAT.md` together.
- In one-line inserted JS use `/* */` comments, not `//` (it swallows the rest of a minified line).
- Add UI through `HOOKS` / a `ui-*.js` module; keep top-level names unique (the build checks).
- Keep the baseline map unchanged; put new demo content in copies. Never write to the asset library.
- Add tests next to the feature (`tests/*.test.js` for data, Playwright for UI) and record results in `TEST_REPORT.md`.
- Keep the novice-first UI: plain words, defaults that work, technical detail in Info sections only.
