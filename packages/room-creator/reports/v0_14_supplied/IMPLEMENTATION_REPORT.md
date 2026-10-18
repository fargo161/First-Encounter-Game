# Room Creator 0.14 — implementation report (asset library / object placement / retexturing pass)

Written for the person who commissioned the pass and for any agent continuing it. Follows the handoff's
§42 deliverables list. Test numbers are in `TEST_REPORT.md` §0; how to run everything is in `CODEX_HANDOFF.md`.

## 1. What was added
- A **Library tab** that connects the standardized Trapstar asset library folder (read-only), checks it, and lets you
  browse/search all 327 models (thumbnails drawn from the GLB files themselves), 1043 surface textures and 3 palettes.
- **Placed 3D objects** ("props") on any story, on the map or in first person: place, select, move, turn, size/stretch,
  height, duplicate, delete, replace, switch off, lock — all through the existing Undo/Redo.
- A **non-destructive appearance system**: library default ← named **look** (shared, reusable) ← this object's own
  **override**. Palette swaps (one-click Grimy/Faded/Night/Warm, editable project palettes, per-object colour swatches),
  library textures for painted (UV) models, colour adjustments, Pixel/Smooth filtering.
- **Library textures on room surfaces** (walls, floors, ceilings, partitions, pillars, floor sections, ceiling patches) with
  a Pixel/Smooth choice.
- **Export/Import** of looks, project palettes and object setups between projects (never touching the library).
- **Simple collision** (solid/walk-through; automatic box, custom box, round) wired into first-person walking, rails
  path-finding, route-walk sight lines and blocking, plus a **route check** listing objects on routes/lanes/spots.
- Open-ended **gameplay tags**, free **extra properties**, and editable **Use Points** of any type attached to objects.
- **Model setups**: which side is a model's real front (4-way), default use points for new copies.
- A **furnished integration map** (`examples/Route_Prototype_Street_ASSET_DEMO.room.json`) built by
  `tests/make_asset_demo.py` through the real editor. The baseline map is byte-identical to 0.13.1.

## 2. Existing architecture reused (not redesigned)
- **Single-file build**: `source/build.py` still inlines everything into `Room_Creator.html`. New pieces join the same
  way: `vendor-gltfloader.js` and `assetlib.js` as their own `<script>`s, `ui-props.js` spliced into `app.js` at
  `/*UI_EXTENSIONS*/` like the other `ui-*.js` modules (shared scope: `project`, `selection`, `mutate`, `HOOKS`, …).
- **Hooks**: all interaction goes through the existing `HOOKS` registry (pointerDown/Move/Up, keyDown, click, action,
  drawGraph, leftRender, inspectorRender, messages, top). `app.js` changed in ~26 lines (Library tab branch, inspector
  branch, delete/duplicate delegation, version strings, status count, the "Library textures…" button, Escape routing,
  a `focusMap` test helper).
- **Data model + validation**: `core.validateBundle` normalizes the new blocks the same way as everything else; edits use
  `mutate()` so history, dirty flag and crash recovery work unchanged.
- **Renderer**: `gl.js` gained a `props` group drawn by both the map and first person, using the same room light pools,
  story ghosting and GPU picking ids as the rest of the scene. `rails.js` nav grid and `ui-route.js` sight lines read the
  same collision footprint.
- **Surfaces**: library textures become ordinary project images (`assets[]`), so the texture studio, repeat/offset/rotation
  and saving work as before.

## 3. Schema changes
Format stays **11**. Two optional top-level blocks, written only when used: `project.props[]` and
`project.objectLibrary` (`looks`, `palettes`, `setups`). Surfaces gained `filter`. `routeNet` unknown top-level keys are
now kept (it previously rebuilt the object). Full field list: `source/FORMAT.md` (top section).
**Hard rule implemented and tested:** unknown/custom fields anywhere in objects, collision, gameplay, tags, points,
overrides, looks, palettes and setups survive load → edit → save unchanged (`tests/props_metadata.test.js`, browser test
C1–C4). Missing assets/looks are kept as references, never deleted.

## 4. How model loading works
- Browsers cannot read sibling files of a page opened from disk, so the library is **connected**: File System Access
  folder picker (handle remembered in IndexedDB, "Reconnect" next time) or a `webkitdirectory` folder chooser fallback;
  tests use a web-address provider. All three are small "providers" behind one interface (`assetlib.js`), so a desktop
  wrapper would only add one more.
- On connect: `ASSET_MANIFEST.json` (+ `CATEGORY_SCHEMA.json`, `SOURCE_PACK_MANIFEST.json`) is indexed and checked; the
  folder listing is compared with the manifest; problems are plain sentences in the Library tab ("Library check").
- Each GLB is loaded **once** with three.js r159 `GLTFLoader` (vendored as a classic script) and shared by every copy
  (`template(id)`: scene, base texture, precise bounds, parts, triangle count). Copies clone the scene graph but share
  geometry; each copy gets one small shader material. Multipart structure (parts/nodes) is kept as authored.
- Thumbnails are rendered from the models in an off-screen renderer and cached in IndexedDB (the package's PREVIEW PNGs
  are colour-wrong, see §11).

## 5. How appearance variants (looks) work
`core.propAppearance(project, object)` merges, field by field: library default ← look ← override, and reports where each
value came from (the panel shows "look" / "this object" labels). Looks live in `objectLibrary.looks` and are referenced
by id, so editing a look changes every copy using it; "Update the look from this object" folds a copy's changes into
the look; "Clear this object's changes" removes the override. Overrides never touch other copies (tested D1–D6).

## 6. How palette assets are treated
- 306 models are palette-mapped: their only texture is one of three palette images. The manifest has no compatibility
  field, so a model's palette family is inferred from its source pack (verified: every palette model's embedded texture
  is byte-identical to its pack's palette, 306/306); a size check on load warns if one ever isn't.
- A palette swap = draw the same model with a different palette image (no geometry change). Project palettes are PNG data
  URLs in `objectLibrary.palettes` with `base` = the library palette they were copied from.
- Per-object colour change = the panel lists the colours the model's UVs actually use (`RCAssets.usedColors`), and
  changing one creates/updates a palette owned by that object only (exact-colour replacement over the grid).
- The 21 UV-textured models (lp2 vehicles) keep their own picture by default and can take a library texture instead.

## 7. How collision / footprints work
`core.propFootprint` turns the object's measured bounds (or a custom box/round size) into a plan polygon plus height range,
following position, turn, stretch and height above floor. A **solid**, switched-on object whose height range overlaps
0.15–1.8 m above its floor: blocks the first-person walking grid (`rails.js storyGrid`, padded like pillars) and its
safety-margin fallback (`propAt`), rails path-finding, route-walk player movement, and route-walk sight lines (oriented
boxes with height: a 1.42 m car hides a crouched player but not a standing one). Vehicles and objects ≥ 0.2 m² and
≥ 0.45 m tall start solid; small clutter starts walk-through. The route check reports objects that block a player
route, narrow its strafe band, sit on an NPC or traffic lane, or cover a spot.

## 8. How tags and Use Points work
- Tags are an open list: strings or objects. The UI offers suggestions (Interactable, Movable, Cover, Hiding spot, Seat,
  Container, Climbable, Breakable, Spawn, Vehicle, Commercial, Evidence, Pickup) and accepts any word; structured tags
  from other tools are shown as "kept unchanged". Extra properties are free key/value (numbers/JSON parsed).
- Use Points are stored in model space so they inherit the object's transform. The panel edits them in the object's own
  terms (metres right/forward of its real front, height, facing) and they can be dragged on the map. Types are free
  text; suggestions get colours. Points can be switched off, named, saved as the model's defaults for new copies, and
  are kept (with a warning) on Replace. Room Creator only authors them; game systems decide what they do.

## 9. Known limitations
- Rotation is around the vertical axis only (no tilt/roll); no snapping to walls/surfaces or stacking helpers (use
  "Height above floor"); no multi-select / group move.
- Collision is one box or circle per object — a car counts as a 1.42 m box over its whole length (the demo hides a
  crouched player at N4/N5 more often than the old 6 boxes did). Use a custom box size to tune it.
- Palette colour changes match exact colours; colours shared by several parts change together.
- Library surface textures applied to a UV vehicle replace its whole picture (the rusty van loses its windows) — the
  library textures do not fit vehicle UV layouts.
- Library models do not agree on which side is the front (chairs, monitors, TVs, shelves vary). The 4-way "Which side is
  the front?" fixes it per model; the demo's setups were checked by eye. The Plane lies across the vehicle convention.
- In the route map (and this engine generally) story walls are `wallHeight` tall (6 m here) while stories are 3 m apart,
  so upstairs walls overlap street-level walls. Giving the upstairs flat a different wallpaper makes the two walls flicker,
  so the demo retextures its floor only (pre-existing engine behaviour, not new in 0.14).
- Firefox/Safari cannot remember the library folder (browser limitation) — choose it each session.
- Switched-off objects are hidden in first person but faint on the map; locked objects still accept panel edits.
- 2D image objects from earlier versions are separate from 3D objects (no conversion between them).

## 10. Performance observations
Measured in headless Chromium with **software graphics (SwiftShader)** — far slower than a real graphics card, so read
the numbers relative to each other. Files: `tests/assets_demo_checks_results.json`, `tests/assets_perf_results.json`.
- Each model loads once (median ~55 ms, max ~280 ms over all 327); copies share geometry.
- Redraw of a first-person view / the map (already prepared): baseline 3–7 ms, demo (69 objects, ~180k triangles)
  5–10 ms, stress (569 objects, ~1.28M triangles) 5–18 ms.
- A *full* rebuild of the map picture (story switch): ~0.45 s baseline, ~1.0 s demo, ~4 s stress in the software
  renderer — this cost grows with triangle count and is the one real bottleneck found. On a graphics card it is much
  smaller; instancing / level of detail is the recommended fix (§13).
- Editing on the demo: select 35 ms, move edit 30 ms, duplicate 27 ms, undo/redo 18 ms, open project 0.2 s, build the
  save file 65 ms (18.3 MB, almost all of it the map's existing pictures; the 69 objects add ~0.1 MB). Stress: edits
  35–45 ms, open 0.27 s. First palette swap ~1.9 s (makes the palette image and rebuilds), later swaps ~30 ms.
- Route walk with 279 solid boxes in the stress copy still runs normally.

## 11. Library assets that failed or behaved incorrectly
- **Failed to load: none** (327/327; `tests/assets_all_models.py`). Measured sizes match `dimensions_m` and pivots are
  ground-centred for all 327 after switching to precise bounds.
- **Package PREVIEW thumbnails are colour-wrong** for palette models (colour grid sampled upside down) — Room Creator
  renders its own thumbnails instead. Evidence: `tests/assets_evidence/all_models_contact_sheet.png`.
- **Front direction is not consistent** across furniture/tech: e.g. Chair Wood 01, Chair Single 05 and 010 seat toward −Z;
  Monitor 02 and TV CRT 01/05 screens toward +X; shelves 04/05/06 open toward ±X. Vehicles all face +Z
  (`tests/assets_evidence/vehicle_fronts.png`) except **Plane** (wings along Z, nose toward +X).
- **Checkout Till 01** has a turned/scaled part; a quick bounding box over-measures it (fixed by precise bounds).
- **Ford Crown Victoria** default palette is police livery (black/white + light bar); the demo's unmarked car is a
  per-object repaint.
- Gaps for interiors: no sofa, bed, shop counter, landline phone or bench; Desk 01 is small (0.75 × 1.04 m).
- Several crates/trolleys/TVs are near-black in their palette (dark in dim rooms).

## 12. Licence flags
The 29 vehicles from `cars_lowpoly_v2` (21) and `cars_kent_lowpoly` (8) have no licence text: they stay flagged
**licence unverified** — ⚠ on their Library cards and a warning in the object's Info panel ("confirm before any
commercial release"). Nothing in 0.14 marks them commercially safe. The pixel texture pack's terms forbid redistributing
the raw textures except as project content: this package does not include the library, and only the few textures used
in the demo are embedded in that project file (internal use).

## 13. Recommended next steps
1. Instancing (THREE.InstancedMesh) for repeated models and a simple distance cull on the map — the stress case's only
   real cost.
2. Library v1.1 metadata: a verified front direction per model (`front_axis`) and an explicit palette family field;
   fix the PREVIEW thumbnails; add the missing interior pieces (counter, sofa, bed, phone, bench).
3. Optional two-box vehicle collision (body + cabin) so cars give realistic partial cover.
4. Wall-snapping and "place on top of" for clutter on tables/counters; multi-select.
5. Let wall height follow story height for upper stories (removes the upstairs wall overlap).
6. Unity export later: the data already separates asset id, transform, appearance, collision, tags and points.
