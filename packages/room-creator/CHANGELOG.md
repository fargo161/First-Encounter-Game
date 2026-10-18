# v0.14.1 remediation candidate — 18 October 2026

Focused fixes for audit F1-F7 and the reproduced project texture-cache reset. See reports/REMEDIATION_REPORT.md and reports/TEST_REPORT.md. Format remains 11; original baseline and furnished demo remain byte-identical. No canonical promotion.

---

# v0.14 — 2026-10-18 — asset library, 3D objects, looks, collision, Use Points

Added
- **Library tab**: connect the Trapstar asset library folder once (Chrome/Edge remember it; other browsers use a folder
  chooser). Browse all 327 objects with thumbnails drawn from the real models, search (all words), categories and
  sub-categories, Recent, Favourites, reference samples hidden by default. Textures (1043) and palettes (3) views.
  The folder is checked on connect and problems are reported in plain words; the library is never modified.
- **Placing 3D objects** on the map or in first person: ghost under the cursor, `[` `]` turn 15° (Shift 5°), Shift+click
  keeps placing, Esc stops. Placing off every floor is refused.
- **Editing**: click to select (map or first person), drag to move (0.05 m snap, Alt = free), round handle to turn,
  arrows nudge, Size slider and per-axis stretch, height above floor, Duplicate (Ctrl+D), Delete, Replace… (keeps
  position, turn, size, tags and use points; warns about anything dropped), Switched on / Locked. All with Undo/Redo.
- **Appearance without touching the model**: named **looks** shared by many copies; per-object changes on top, labelled
  "this object"; palette chips (Default, Grimy, Faded, Night, Warm, your own); click a colour swatch to change that colour
  on this object only; palette editor for project palettes; library textures as the picture of painted models;
  tint / brightness / saturation / contrast / hue; Pixel-crisp or Smooth per object.
- **Library textures on walls, floors, ceilings, partitions and pillars** ("Library textures…" in the Style panel), copied
  into the project, Pixel by default, with a new Pixel / Smooth choice for surfaces.
- **Export / Import looks**: looks, edited palettes and object setups as a small `.rclooks.json` file for other projects.
- **Collision**: solid / walk-through, automatic box, custom box or round footprint. Solid objects block first-person
  walking, rails paths and route-walk sight lines; the Rails panel and the object panel list objects that stand on a player
  route, narrow its strafe space, sit on an NPC/traffic lane or cover a spot.
- **Gameplay tags** (open-ended; any word; structured tags from other tools are kept) and free **extra properties**.
- **Use Points**: attached spots of any type (sit, use, work, customer, cover, hide, driver, …, or your own) edited in plain
  terms (metres right/forward of the front, height, facing) or dragged on the map; they move and turn with the object.
- **Model setup** (all copies): which side is the real front (as built / its left / other end / its right), default use
  points for new copies.
- `examples/Route_Prototype_Street_ASSET_DEMO.room.json`: the route-prototype street lightly furnished outside and fully
  furnished in the bodega shop floor, stockroom, back office and upstairs flat (69 objects; real Crown Victoria replaces
  the placeholder car while keeping cover spots N4/N5). `examples/Route_Prototype_Street.room.json` is unchanged.

Changed
- Project data may carry optional `props` and `objectLibrary` (format stays 11). Unknown fields anywhere in them — and
  unknown top-level keys of `routeNet` — are kept unchanged through load, edit and save.
- Escape now also reaches add-on tools (placing, stair drafts) before resetting the tool.
- `build.py` stops the build if two top-level functions/variables in `app.js` + `ui-*.js` share a name.

Fixed during this pass (found by the new tests)
- Two new function names clashed with existing ones (room "Save look", first-person double-click glide); renamed and
  guarded. First-person clicks on 3D objects were swallowed by drag-to-look. Palettes/textures that finished loading
  after an object was drawn did not show. Turned model parts made measured sizes too big. A background model load could
  redraw the object panel while you were typing.

# v0.13.1 — 2026-10-18 — route-walk prototype (test build)

Added
- **Route walk** (header button, or Rails tab → Route network): a prototype of route-bound first-person
  movement for Trapstar. Walk forward/back on an authored route, strafe inside a narrow band that bulges
  at spots, limited look, deliberate turn-around (R), junctions chosen by looking, a branch blocked by a
  closed door (E opens it), crouch, short sprint and shooting.
- NPC lanes on both sidewalks, a gathering zone, a stoop sitter, a shopper who comes out of the bodega
  only while the door is open, "the mark" who stops across the street to watch, and two 2D traffic cars
  that stop for people. Strict spot occupancy and hidden-only spawning, checked live.
- Placeholder NPC cards (FRONT / 3/4 / BACK, with SIDE and BACK 3/4 as diagnostics), rubber-band turning,
  hysteresis that grows up close, a separate head that turns toward you, a small phone flourish.
- Debug overlay (route, strafe band, lanes, junctions, zones, spots and who is in them, hidden ways in/out,
  travel direction, body picture, true angle, card turn, head, distance) with a top-down dial per NPC;
  live measurements panel with a JSON download.
- `examples/Route_Prototype_Street.room.json` (City Block + a solid parked car + the route network).

Changed
- Project data may carry an optional `routeNet` (format stays 11; files without it are unchanged).
- The graphics engine has a separate layer for moving cards, hidden in map views and clicks.

# v0.13 — 2026-10-17 — graphics-card overhaul: editable first person, rails, sky, stairs

Added
- **Graphics-card renderer** (WebGL2 via three.js r159) for the map and first person, with automatic fallback to the 2D renderer. Zoom range 15%–80×. New flat **Plan** view (keys 1 / 2 / 3).
- Icons and labels keep a fixed screen size; **Labels** (selected / all with overlap skipping / off) and **Icons** (doors / all / off) buttons, keys L and I.
- **Story elevator** on the map, Page Up / Page Down, and smooth gliding between stories that keeps the zoom. The map remembers its position when you visit first person.
- **Direct first-person editing**: drag = look (left/right and up/down), wheel = lens, W A S D / arrows = walk with wall collision, Q / E = eye height, double-click = glide; one Undo step per gesture. Heads-up bar with Level and Guides.
- **Free camera** that walks anywhere and climbs stairs; Save as viewpoint, Move view here; double-click map floor to stand there.
- Viewpoint **Look up / down** (`horizon`) setting.
- **Rails**: automatic camera routes with walking paths around walls, through doors and up stairs, eased speed, rounded corners, look-ahead, turn-to-face stops, holds, loops; map editing tool, timeline, ride in first person, rail preview, and exports to WebM video, JPEG frame zip and camera-path JSON.
- **Test walk** travel glides along the walking path; rails can be ridden in Test walk.
- **Sky editor**: presets, gradient, wrapped panorama picture with click-to-set horizon and full mapping controls, distance haze.
- **Build up** wizard for the next story (same size / set back / overhang / gallery ring / roof deck; enclosed room / parapet / no walls; copy looks; automatic stairs; live preview).
- **Stairs** tool and inspector (auto floor opening above, ceiling opening below, guard rails), **Floor hole** tool and inspector.
- Export **Every viewpoint · PNG zip**.

Changed
- Project format 11 (sky, rails, stairs, floorCuts, viewpoint horizon). Format 4–10 files upgrade on load.
- Validation no longer copies every embedded image on each edit (about 12× faster on image-heavy projects).
- Five left tabs: Build, Images, Views, Rails, Sky.

# v0.12 — 2026-10-03 — every story gets a room

Changed
- **+ Next story creates an enclosed room by default**, matching the room(s) on the story below (all of them, or one you pick). Light pools, doors, windows, partitions and ceiling edits work on the new story straight away. "Empty story" is still available for galleries and overhangs.
- **Make room** (floor-space inspector) turns a floor rectangle into an enclosed room with walls and a ceiling, keeping its floor material and adopting any viewpoints/props on it. Use it on stories you already drew with floor space.
- Deleting a story that still has content now lists what is on it and deletes it all after confirmation (Undo restores it), instead of refusing.
- Undo history holds 200 steps (was 60).

Fixed (found in the v0.12 audit)
- Partitions and free walls on different stories blocked each other when they shared X/Y ("cannot overlap on the same line"); doorway-junction checks had the same cross-story bug.
- A room with a ceiling cut or ceiling patch could not be deleted ("Ceiling edit lost its room").
- Deleting a room deleted free walls it merely styled — including free walls on other stories. Free walls are now re-hosted and kept; viewpoints and props still standing on floor space are kept.
- First person under an open ceiling showed a strip of empty sky between the wall top and the floor above. Room walls now continue up to the next story's floor wherever there is floor above (drawn in the wall's top-trim colour, editable in Texture Studio → Finish / trim).
- The Ceiling cut tool reported "Ceiling patch added".
- Room-only tools (light, partition, ceiling, door/window/opening) on a story without a room now say how to fix it (Make room / Room above) instead of a generic message.

# v0.11.2 — 2026-10-03 — place things on floor space

Fixed
- Viewpoints and props can now be placed on any floor space on the active story — an enclosed room or a floor section. A story built only from floor rectangles is no longer empty-handed.
- Floor-space items carry their story and elevation without a room (`roomId: null`); saving and reopening keeps them on their story instead of reassigning them to a room on another story.
- Cover pairs work from floor-space viewpoints; exposed partners are located on the cover view's story.
- Props clamp to floor sections as well as rooms; their colour tint comes from the room they stand in or the room under the floor section.
- First-person prop placement checks the viewpoint's own story floor (it previously checked Ground).

Unchanged: 2D light pools, ceiling cuts and room partitions still require an enclosed room, because they are room-local.

# v0.11.1 — 2026-10-03 — story / floor fixes

Fixed
- Lights on upper stories no longer jump to a Ground room when dragged, nudged or edited by X/Y.
- Object drags are checked against the object's own story floor, not Ground.
- Story height is entered in the display unit (feet converts correctly); min/max shown in that unit.
- First person now shows a floor section that sits on a room floor (or overlaps another section), matching the isometric view; the later section wins on overlap.
- Stacked isometric renders (PNG map export, thumbnails) draw each story's floors in order, so lower floor sections no longer paint over upper rooms.
- Deleting a story renames shifted stories that still had their default name (custom names are kept); new stories never get a duplicate default name; dialogs and messages use stored story names.
- Snapping works against the floor you just drew.
- Undo / Redo during a live drag cancels the drag first instead of being lost.
- "Half footprint" halves both dimensions and centres the result.
- After deleting a story the editor lands on the story below and never selects a room on another story (also fixes deleting the top story jumping two levels).
- Floor sections take default materials and light tint from the room they sit on or the nearest room below, not always the Ground room.
- Inspector rejects floor space smaller than 0.25 m; Room above is atomic (a failed add leaves no stray stories).

Schema unchanged (project version 10). New core helpers: `storyName`, `floorSectionHost`.

# v0.11 — 2026-10-03 — focused story / floor UX

- Make active story independent from selected room; clear cross-story selection.
- Add an elevated work plane and locked grayscale references with projected footprints.
- Correct upper-story hover and drag projection, and keep framing stable during edits.
- Make floor space directly selectable, movable, resizable, splittable and extendable.
- Add full / partial / offset matching from a room below and alignment guides.
- Cancel drafts on story switches; preserve editor context through Undo / Redo.
- Keep free walls and floor material editing usable without an enclosed room on that story.
- Preserve v10 project schema and all retained construction and material features.

# Changelog

## v0.10 — Manual construction, ceilings, pillars, contiguous stories

### Added
- Contiguous Story Manager with fast story selection, add-next, rename and safe delete/reindex behavior.
- `Add empty story above` workflow that creates a build level without filling it with a room.
- Manual rectangular floor sections with independently editable top and underside materials.
- Automatic underside/ceiling rendering beneath upper manual floor sections.
- Manual free wall segments that may exist independently of an enclosed room footprint.
- Partial ceiling cuts and ceiling patches, coexisting with the existing whole-room Open Above shortcut.
- General-purpose pillars, valid inside rooms, at boundaries, in voids, or outside lower-room footprints.
- Pillar material editing and pillar assignment as an explicit physical cover source.
- New `Manual_Construction_Atrium.room.json` example and v0.10 construction regression suites.

### Retained
- All v0.9 room-above/atrium/gallery tools remain as shortcuts.
- All v0.8 deep opening, texture and style controls remain.
- Connected rooms, partitions, room attachment, shared exterior mattes, linked viewpoints, cover/exposed pairing, routes and Test walk remain.

### Format
- Project format is now 10. Supported older project formats are normalized into the contiguous Ground-first story model without deleting existing room/view/object identities.

---

## v0.9 — Multi-story architecture

- Added story-aware rooms, Room Above, vertical voids, upper gallery/balcony edges, stacked isometric architecture and lower-floor first-person visibility of upper structures.
- Added explicit cross-story viewpoint transitions.

---

## v0.8 — Opening layouts, material studio and room styling

- Added opening sliders, single/double panes and doors, deep non-destructive texture studio, expanded room palettes, colour grading and saved looks.
