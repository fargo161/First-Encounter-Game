# v0.14.1 remediation semantics (format remains 11)

This candidate adds no required schema fields. Unknown/custom prop, Use Point, appearance, library and route metadata remains open-ended and is preserved. Missing references remain saved until the author chooses a repair or a field reset.

- Props count as story contents. Forced deletion removes them; collapsing an intermediate story shifts props with architecture. Deleting a room retains a prop when its pivot still has floor support on that story (including independent floor sections); otherwise it removes and counts it. A floor cut is not support. Retained props acquire the remaining room host, or null. This matches the existing prop placement rule; overhang is allowed.
- Removing front calibration compensates every existing instance heading by old front minus new front, keeping rendered pose, collision and world-space Use Points fixed. Imported setups use keep-existing-on-conflict, reporting asset IDs; identical entries count as already present. A new imported calibration also compensates existing instances. Setup defaults apply only to subsequently placed copies.
- Use Point plan dragging projects onto story elevation + object height + local point height times vertical scale. A 3-pixel threshold rejects accidental drags; movement is relative to the initial pointer position.
- Round collision retains the existing 12-sided footprint transformed by object scale/rotation. Route sight clips the same polygon as a vertical prism. Walking retains its deliberate 0.12 m safety margin; route player blocking retains 0.25 m. Sight uses the footprint without either walking margin. This pass adds no independent sight shape.
- The inspector identifies unresolved or incompatible palette/texture IDs and offers field-only reset/replacement. A reset writes the existing `default` sentinel and preserves unrelated override and custom keys. Rendering ignores incompatible references while retaining them for repair.
- Model readiness makes at most three attempts per automatic load, with a 12-second deadline per attempt and short bounded backoff. Late results cannot replace a newer template/connection. Explicit Retry starts a new budget. Demo generation uses a bounded readiness result with asset IDs, paths, attempts and errors, then stops before scene edits/saving if any model is unresolved.

Unchanged files on disk are distinct from normalized semantic serialization: old surfaces can gain default `filter: pixel`. No byte-identical old export claim is made.

---

# Room Creator 0.14 — placed 3D objects (`props`) and the project object library (`objectLibrary`)

Format number stays **11**. Both blocks are optional and only written when present, so files without 3D objects are
byte-for-byte what 0.13.1 wrote. **Rule for every block below: fields the editor does not know are kept unchanged on
load, edit and save** (tested in `tests/props_metadata.test.js`). Unknown tag objects, unknown point types, unknown
keys in `override`, `collision`, `gameplay`, points, looks, palettes and setups all survive.

Geometry is never stored in a project: an object references a library model by its stable `asset_id`
(`ASSET_MANIFEST.json`). The library itself is read-only; Room Creator never writes to it.

## Coordinates
- Plan metres: `x` east, `y` south, `story` = story index. `z` = height above that story's floor (or the room floor).
- `rotation` = plan heading in degrees that the model's **front** faces (0 north, 90 east, 180 south, 270 west).
- Model space = the GLB's own axes: metres, +Y up, ground-centre pivot. The front is +Z unless the asset's setup says
  otherwise (`frontTurn`, below). +X is the model's **left**.
- three.js yaw = π − rad(rotation) − rad(frontTurn).  `core.propToPlan / planToProp / propYaw / propFootprint` do the maths.

## `project.props[]` — one record per placed object
```json
{"id":"prop_till","asset":"lp_technology_props_misc_tech_props_mesh_checkout_till_02","name":"Register",
 "x":57.35,"y":31.9,"story":0,"z":1.0,"rotation":270,"scale":[1,1,1],"enabled":true,"locked":false,
 "roomId":"room_shop",
 "look":null,
 "override":{"palette":"palv_x","tint":"#c23b2a","tintStrength":0.5,"brightness":1,"contrast":1,"saturation":1,"hue":0,
             "filter":"pixel","texture":{"library":"pix_metal_metal_01_grey_rust_3"}},
 "collision":{"solid":true,"shape":"auto"},
 "gameplay":{"tags":["interactable","commercial",{"id":"faction","value":"police"}],"props":{"cash":{"min":40,"max":220}}},
 "points":[{"id":"pt_till_1","type":"customer","name":"Customer pays here","x":0,"y":0,"z":0.85,"yaw":0,"enabled":true}],
 "bounds":{"min":[-0.17,0,-0.24],"max":[0.17,0.44,0.24]}}
```
- `asset` — library `asset_id`. A missing/renamed asset is **kept** (pink placeholder + repair message, never deleted).
- `roomId` — recomputed on every load/save from the position (room on that story, or `null` on open floor space).
- `scale` — per axis, 0.01–50 (a single number is read as uniform). `enabled:false` = faint in the map, absent in first
  person, not solid. `locked:true` = cannot be dragged/turned.
- `look` — id of a named look in `objectLibrary.looks`, or `null`.
- `override` — this object's own appearance changes, on top of the look. Known fields (`LOOK_FIELDS`):
  `palette` (project palette id, library palette id, or `"default"` = force the library palette even if the look has one),
  `texture` (`{library: textureAssetId}` or `{image: projectAssetId}`, or `"default"`), `tint` (#rrggbb), `tintStrength` 0–1,
  `brightness`, `contrast`, `saturation`, `hue` (degrees), `filter` (`"pixel"` crisp | `"smooth"`).
  Resolution order: library default ← look ← override (`core.propAppearance`).
- `collision` — `solid` (people can't walk through), `shape` `auto` (box fitted to the model) | `box` | `cylinder`,
  optional `size` [width, depth, height] in model metres (before scale) and `offset` [x, z]. A solid object blocks walking
  when its height range overlaps 0.15–1.8 m above its floor. Used by first-person walking, rails paths, route-walk sight
  lines/blocking and the route check.
- `gameplay.tags` — open-ended: any string, or any object (kept as-is). Suggested words in the UI are only suggestions.
  `gameplay.props` — free key/value data for later game systems. Other keys in `gameplay` are kept.
- `points[]` — Use Points / sockets attached to the object: `type` is any string (`sit`, `use`, `work`, `customer`, `cover`,
  `hide`, `driver`, `passenger`, `arrival`, `look`, `stand`, `search` are suggestions; new types need no code), position
  `x,y,z` in **model space** (so points move/turn/scale with the object), `yaw` degrees (rotates +Z toward +X),
  `enabled`, optional `name`. Room Creator authors where/what a point is; it does not run behaviour.
- `bounds` — the model's measured box (model space), stored so collision and placeholders work without the library.

Limits: 5000 objects per project; duplicate ids are renamed on load.

## `project.objectLibrary` — reusable, project-local, exportable
```json
{"schema":1,
 "looks":[{"id":"look_chair_red","name":"Painted red","asset":"lp_furniture_chairs_mesh_chair_wood_01","palette":"palv_red_paint"}],
 "palettes":[{"id":"palv_red_paint","name":"Red paint, teal seat","base":"pal_lowpoly_master_32","image":"data:image/png;base64,…",
              "quick":"grimy","owner":"prop_id"}],
 "setups":{"lp_furniture_chairs_mesh_chair_wood_01":{"frontTurn":180,"points":[…default use points…],"tags":[…],"collision":{…}}}}
```
- **looks** — named appearances (any `LOOK_FIELDS`). `asset` limits a look to one model; without it a look may name a
  palette `family`.
- **palettes** — edited copies of a library palette image (`base` = library palette id). `quick` marks the one-click
  Grimy/Faded/Night/Warm versions; `owner` marks a palette made for one object's own colour change.
- **setups** — per-model defaults for *new* copies: `frontTurn` (0 / 90 / 180 / 270 = which side of the model is its real
  front, measured from +Z toward +X; older `front:-1` is read as 180), default `points`, `tags`, `collision`.
- Export/Import: the Looks view writes `{"format":"trapstar-room-creator-looks","version":1,"looks":[…],"palettes":[…],
  "setups":{…}}` (palettes a chosen look needs are always included). Import skips identical entries and adds clashing ids
  as new copies. The canonical library is never touched.

## Library textures on walls/floors
Choosing a library texture copies it into the project's image list (`assets[]`) with `library:{asset_id, library}` so the
project keeps working without the library. Surfaces gained `filter: "pixel"|"smooth"` (default pixel).

# Project format 11 (Room Creator v0.13)

Version 11 adds five things. Version 4/7/8/9/10 files are upgraded on load (the new fields get defaults); nothing old is removed.

- `project.sky` — `{mode:'gradient'|'image', top, horizon, bottom (#rrggbb), curve 0.1–4, assetId|null, rotation (deg), repeat 1–16 (integer), mirror, flipX, horizonV 0–1 (row of the picture placed at eye level, 0 = top), size 0.1–8, lift −45…45 (deg), fadeTop 0–1, fadeBottom 0–1, brightness 0.1–3, saturation 0–2.5, tint (#rrggbb), tintStrength 0–1, haze:{enabled, color|null (null = horizon colour), start m, end m (> start), strength 0–1}}`. A picture is wrapped round the camera on a cylinder: one copy spans 360°/repeat; its height follows the picture's proportions × size. `mode:'image'` without an existing asset falls back to the gradient. `SKY_PRESETS` holds the built-in gradients.
- `viewpoint.horizon` — 0.1–0.9 (default 0.42): the fraction of the picture height where eye level sits. Lower values look up, higher values look down; the camera stays upright (vertical lines stay vertical).
- `project.stairs[]` — `{id, name, story (bottom story; top is story+1), x, y, width (X extent), length (Y extent), dir:'N'|'E'|'S'|'W' (climbing direction), steps, rails, surface}`. `createStairs`/`editStairs` keep three generated records in step: a `floorCuts` opening on the story above (`stairId`), `ceilingCuts` over the flight in rooms below (`stairId`), and guard-rail free walls with spindle openings round the opening upstairs (`partitions[].stairId`). `deleteStairs` removes all of them. `stairGeometry(p,st)` gives steps, rise, run, bottom/top centres and the walk-on (`entry`) and walk-off (`exit`) points.
- `project.floorCuts[]` — `{id, name, story, x, y, width ≥ 0.2, length ≥ 0.2, stairId?, openBelow?}`: rectangular holes in a story's floor. `inFloor` treats them as not-floor; the renderer leaves them open. Editor-made holes also open the ceiling of rooms directly below through `ceilingCuts` tagged `floorCutId` (unless `openBelow:false`).
- `project.rails[]` — `{id, name, speed m/s 0.2–40, ease m, corner m, lookAhead m, turnDistance m, hold s, autoPath, loop, nodes[]}`; each node is `{id, kind:'stop', viewId, hold|null, speed|null}` or `{id, kind:'via', x, y, story, speed|null}`. `rails.js` (`RCRails`) turns a rail into a timed camera path: a walking path on a 0.2 m grid per story (around walls with 0.2 m clearance, through open doors/passages ≥ 1.65 m high, up stairs), rounded corners, cosine speed ramps, look-ahead headings blended into each stop's facing, and holds at stops. `RCRails.exportFrames(plan,fps)` returns per-frame `{t, x, y, story, eyeZ, facing, fov, horizon, stop}` — the same data the editor's "Camera path (.json)" export writes.

The map can also be shown as a flat top-down plan (`setMapProjection('plan')`); this is display state only and is not saved.

> v0.12 keeps schema version 10. New core operations: `addStoryWithRooms(p,{name,sourceIds})`, `floorSectionToRoom(p,id)`, `deleteRoom(p,id)` (re-hosts free walls, removes the room's ceiling edits, keeps items still on floor space), `storyContents(p,i)`, `deleteStory(p,i,{force:true})`. Partition overlap and junction checks compare walls on the same story only.

> v0.11.2: viewpoints and objects may stand on a floor section with no enclosed room. They then store `roomId: null` with an integer `story`; `floorZ` derives from that story's elevation. Validation never reassigns a story-tagged item to a room on another story. `lightingRoomAt(p,q,story)` gives the room whose tint applies at a floor point.

> v0.11.1 keeps schema version 10. `storyName(p,i)` returns a story's stored name; `floorSectionHost(p,f)` picks the room a floor section borrows default materials/tint from (same-story room under its centre → nearest lower room under its centre → any same-story room → first room). Deleting a story renames shifted stories that still carry their default label.

> Editor v0.11 uses the existing v10 project schema. Story focus, reference visibility, drawing guides and fixed editing projection are session-only UI state. Floor operations edit the existing floorSections array; split/extend preserve top and underside materials.

# Project format 10 — implementation notes

The portable bundle is `{project, assets, savedWith}`. `RCCore.validateBundle` is the authoritative validator. All plan coordinates and construction dimensions use metres internally; `project.units` changes display only. Facing remains degrees clockwise from North (negative Y). +X is East and +Y is South.

`project.format` remains `trapstar-room-creator`; `version` is 10. Supported earlier room-project formats are normalized to format 10. v0.10 introduces an explicit contiguous `stories[]` stack plus manual floor, ceiling, wall and pillar construction records. Story indices must be consecutive beginning at 0 (Ground); nonexistent intermediate stories are invalid.

### v0.10 construction records

- `stories[]`: `{id,index,name}`. Indices are contiguous `0..n-1`. Adding creates only `n`; deleting a used story is refused, while deleting an empty intermediate story shifts higher records down one level.
- `floorSections[]`: rectangular manual floor patches with `story`, `x/y/width/length`, `floor` material and `underside` material. They can extend beyond rooms and provide their underside as ceiling to lower viewpoints.
- `ceilingCuts[]`: rectangular holes hosted by a room ceiling.
- `ceilingPatches[]`: explicit rectangular ceiling areas hosted by a room; these can restore selected overhead areas even when the room uses the broad `openAbove` mode.
- `partitions[]` may set `free:true` and a `story`; these free walls use the same two-face material/opening pipeline but are not required to lie wholly inside an enclosed room footprint.
- `pillars[]`: `{id,name,story,x,y,width,depth,height,surface,blocks}`. Pillars may exist inside or outside room footprints and can be explicit cover sources.

The older rectangular `rooms[]` workflow is retained. `Adjoin same story` and `Room above` remain convenience tools layered alongside manual construction rather than being replaced by it.

## Persistent records

- `rooms[]`: axis-aligned rectangles with IDs, origin, width, length, `story`, `openAbove`, `balconySides`, floor/wall/ceiling style, individual N/E/S/W overrides, ambient light, and exterior matte settings. Rooms may overlap in X/Y only when they are on different stories.
- `partitions[]`: independent interior wall lines, always hosted in one room section. See below.
- `openings[]`: apertures attached either to a room boundary side or to a partition; geometry is shared, not copied into separate views.
- `lights[]`: room-local 2D falloff tint records.
- `objects[]`: shared image instances with room/story attachment, absolute `floorZ`, floor coordinates, footprint, height/mount, facing, anchors, opacity, sprite/panel/floor mode, image assignments, visibility/locking, and blocking flag.
- `viewpoints[]`: room/story attachment, absolute `floorZ`, floor position and facing, FOV, eye level, output pixel dimensions, role, optional explicit `cover`, and notes.
- `pairs[]`: primary covered view ID, exposed view ID, sideways/forward offsets, exposed eye level, and name. `syncPairs` derives the exposed pose from its primary.
- `links[]`: ordinary directed/two-way travel routes between viewpoint IDs, separate from paired-state switches.
- `startViewId`, `migrationNotes`, `legacyArchive`: existing navigation/provenance fields.
- Bundle `assets[]`: imported PNG/JPEG/WebP data URIs, ID, name, and dimensions. New projects and the new partition example use an empty array.

## Multi-story records

`project.storyHeight` is the common floor-to-floor spacing in metres (2.2–8.0). A room stores integer `story` (`0` Ground, positive values above, negative values basements). `roomElevation(project, room)` returns the room floor elevation; `roomTop` adds the common wall height.

Each room adds:

```json
{
  "story": 0,
  "openAbove": false,
  "balconySides": []
}
```

`openAbove` suppresses that room's normal ceiling wherever the view can continue into higher architecture, allowing atriums and double-height spaces. `balconySides` contains N/E/S/W sides on upper rooms that should render as a simplified 1.05 m gallery edge rather than a full-height boundary wall. It is an authoring shorthand, not a configurable railing-asset system.

`addRoomAbove` creates a higher-story rectangle from an existing room with optional X/Y offsets and dimensions. X/Y overlap is legal across different stories; same-story overlap remains invalid. `addAdjoining` always creates a room on the parent room's current story. `roomWalls` includes the story in its deduplication key so walls at the same X/Y on different floors stay independent.

Objects and viewpoints carry `roomId`, `story`, and derived `floorZ`. Validation re-derives `floorZ` from the owning room so changing `storyHeight` does not require hand-editing every record. Cover partners remain on the primary viewpoint's story.

A `links[]` route whose endpoint viewpoints are on different stories is an explicit vertical transition. The core treats it as author-defined navigation; it does not create stair, elevator, ramp, or ladder geometry. Same-story routes continue to use the normal straight floor-plan obstruction checks.

The first-person renderer uses absolute floor elevations so a Ground viewpoint can see upper slabs, walls, openings and balcony caps when the lower room is open above. Isometric rendering stacks rooms using the same elevations. Stories are still authored as flat 2D floor sections; there are no meshes, sloped floors, or physical floor-thickness simulation.

## Partition record

```json
{
  "id": "partition_example",
  "name": "Interior divider",
  "roomId": "room_main",
  "axis": "h",
  "x": 1,
  "y": 3.4,
  "length": 8,
  "height": null,
  "faces": { "A": {}, "B": {} }
}
```

The `faces` values above stand for full surface-style records from `surface()`; empty objects are not valid styles. `axis:'h'` extends from `(x,y)` to `(x+length,y)`. `axis:'v'` extends to `(x,y+length)`. Length is positive, 0.35-40 m. Null height follows the common room height; a custom height must be 0.3 m through the common wall height.

Face A is viewed from the positive side of the line (+Y for horizontal, +X for vertical), Face B from the negative side. Both faces use the same direct texture schema as room walls. There is no `exterior`, `matte`, or `backdrop` field on a partition; validation rejects such assignments.

Both endpoints must lie inside/on the owning rectangle, and the line's fixed coordinate must be at least 0.04 m inside that rectangle. Collinear overlap is invalid. Orthogonal solid junctions are permitted but cannot run through another partition's aperture. Geometry edits preserve hosted opening offsets; a resize too small for an opening fails atomically.

`partitionWall` derives a line for the common wall-processing pipeline:

```
kind: 'partition'
partitionId: partition.id
id: 'partition_wall_' + partition.id
owners: [{roomId, partitionId, face:'A', side:'A'}, ...face B...]
height: resolved common/custom height
```

This is not an exterior boundary and does not duplicate a room section. It participates in visibility, viewpoint clearance, routes, first-person tags, and isometric selection.

## Aperture hosts and multiple cuts

Boundary opening:

```
roomId: host room ID
side: 'N' | 'E' | 'S' | 'W'
partitionId: null or absent
```

Partition opening:

```
roomId: partition's room ID
partitionId: partition ID
side: null
```

Both store `offset`, `width`, `bottom`, `height`, `kind:'door'|'window'|'passage'`, `open`, `trim`, frame/panel/glass colors, and optional door-panel texture ID. Offset is measured from the host line's increasing-coordinate start, not the observer's screen-left. A host can contain many nonoverlapping intervals. Stacked apertures at overlapping horizontal intervals are not supported.

`openingHostLine`, `openingCap`, and `openingHostLabel` resolve either kind of host. `openingsForWall` restricts by partition identity before considering line overlap, preventing leakage between distinct hosts.

`unusedWallSpans` subtracts occupied intervals from the selected segment; usable gaps are at least 0.35 m. `suggestOpening` fits a new cut within one gap. `openUnusedSpans` validates a trial copy and adds passages in those gaps without modifying existing openings. `fullOpenWall` remains non-destructive and refuses occupied walls.

## Attaching rooms

`canAttachRoom` requires an existing boundary opening whose entire span is exterior. `attachRoomPlan` takes `width`, `length`, optional `inset` (null means center), and optional name. It returns a nonmutating trial plan and affected-opening names for UI preview. The new room lies outside the host side, with its whole edge covering the selected opening and no overlap with other rooms.

`attachRoom` commits the validated new room only. It never duplicates or changes the existing aperture. Room boundary deduplication derives the new shared geometry; matte visibility follows the shared/exterior intervals, not a mutable per-opening interior flag. Opening kind and door state are preserved. New viewpoints/routes are not automatically created.

Room-section resize/move operations carry hosted partitions with room contents when requested, and validate all partitions before commit. Deleting a partition removes its hosted apertures and clears dangling cover sources without discarding view positions.

## Surface styles

Surfaces retain the previous color/finish/texture/repeat/angle/offset/opacity settings. `surface()` and validation define exact defaults. A room's shared wall default can have per-side overrides; a partition stores independent complete Face A and Face B styles. A selected-face texture import identifies the partition and face explicitly, so changing panel context cannot redirect an in-flight import to another surface.

Isometric wall material patches use the same texture sampler and room tint/light settings as the first-person surface. Texture coordinates run along the host wall and vertically through its height. An aperture clips the wall surface; it does not re-fit the wall texture into each remaining piece.

## Shared-side mattes, retained from 0.6.1

`rooms[].exterior.default` and `rooms[].exterior.sides[N|E|S|W]` hold:

```json
{"assetId": null, "fit": "cover", "scale": 1, "offsetX": 0, "offsetY": 0, "alpha": 1, "distance": 0}
```

Empty side image references inherit the default. `backdropFor` is a nonmutating read and explicitly returns null for partition owners. `backdropFrame` rejects partition owners. Renderers only apply mattes to actual exterior boundary segments (`owners.length === 1`, no partition ID), not shared-room or interior-partition segments.

The entire room side supplies the matte coordinate reference, not an aperture or a deduplicated subsegment. Horizontal direction is screen-right when viewed from inside: N west-to-east, E north-to-south, S east-to-west, W south-to-north. Shared/exterior subdivision does not change that framing. `distance` 0-100 m shifts the flat matte outward for observer-relative parallax. Out-of-image samples remain empty instead of tiling, clamping, or smearing.

Exterior pixels have separate hit tags from wall, partition, and opening-frame tags. They never count as frame/partition cover. A partition opening may reveal another real room opening farther away; that boundary opening may legitimately show an exterior matte.

## Viewpoint-first cover

A new obstruction source is supported:

```json
{"kind":"partition","id":"partition_example"}
```

Existing sources remain `wall` (roomId/side), `opening` (ID), and `object` (ID). A partition source matches visible solid partition pixels, not an aperture, scenery, or an unrelated wall behind it. Cover percentages are authoring aids only. Exposed partners cannot exist without an assigned primary covered viewpoint. Geometry edits never invent replacement views or move a cover pair with furniture.

## Rendering and boundaries

The renderer stays Canvas2D: wall-line intersections on the floor plan determine vertical screen bands, floor/ceiling samples, architecture depth/picking, and sprite/panel compositing. There is no 3D model/mesh scene, WebGL dependency, or automatic image-angle synthesis.

The isometric cutaway shortens the displayed front/perimeter and partition heights for editing only. The first-person architecture, collision, and routes use actual wall geometry. Test routes still use straight floor-plan segments; walls/windows/closed doors block them, and bend navigation needs intermediate viewpoints. Custom short partitions are not a vault/jump system.

## Source and tests

`core.js` owns geometry/invariants/validation, `renderer.js` owns rendering/picking, and `app.js` owns interactions, imports, undo, and exports. The single HTML is built from `shell.html`, `style.css`, those scripts, and the retained legacy converters with `build.py`.

`window.RCApp` exposes selected commands for QA. Direct raw-project mutation is not the supported editor workflow. `RCCore.validateBundle` should be used for generated project files. See `../TEST_REPORT.md` for current tested paths and environment limits.

## Opening fields retained from v0.8

`panes: 1|2` (default 2), `leaves: 1|2` (default 1), `frameWidth` (m),
`dividerWidth` (m), `glassOpacity` (0–0.75),
`doorStyle: panel|flush|slatted`, `handleColor` (hex). Total width is always the
entire opening, not per-pane/per-leaf width. `open` is still a shared door state.
`openingGeometry` derives capped trim widths; `openingRanges` derives bounds
from neighboring cuts and host dimensions. `editOpening` validates and rolls
back atomically, including occupied-viewpoint safety.

## Surface fields retained from v0.8

- `mapping: repeat|mirror|stretch`. Stretch maps once to the full surface.
- `tileSize` is the U dimension in metres; `tileSizeY` is V, or null to link.
- `flipX`, `flipY`, `angle`, `offsetX`, `offsetY` adjust the sampling transform.
- `coordinateMode: local|legacy`. Local walls use along-wall coordinate relative
  to their full host, with vertical origin at the top. Legacy retains old origin.
- `brightness`, `contrast`, `saturation`, `hue`, `tintStrength`, `textureOpacity`.
- `secondary` pattern colour, `jointWidth`, and `wear`.
- `baseHeight`, `baseColor`, `capHeight`, `capColor`: painted wall trim bands.

Surface images blend their alpha over the solid surface's base colour. They do
not make the actual wall geometrically transparent. Only architectural openings
do that. Exterior matte sampling is unchanged.

Room `light` adds `exposure`, `contrast`, `saturation`; individual `lights[]` add
`falloff` (default 2). These are 2D colour effects, not physically based lights.

## Named room looks

`project.stylePresets[]` stores `{id, name, look}`. `look` contains copied
`floor`, `wall`, `ceiling`, `walls`, and `light` settings only. Surface references
inside saved looks are validated against the embedded catalogue. Clearing images
clears those references as well. Opening/room geometry, matte and viewpoint/pair
records are deliberately excluded.

## Route network (0.13.1 prototype, optional `routeNet`)

A project may carry `routeNet`. It is only kept when present, so ordinary projects are unchanged. It is
authored as JSON for now (see `examples/Route_Prototype_Street.room.json` and
`scratch/make_route_scene.cjs` in the build workspace). Coordinates are plan metres; story 0 only.

```json
{"version":1,
 "settings":{"seed":1977,"start":{"edge":"e_harlan_w","s":8,"dir":1},"defaults":{"strafe":0.7}},
 "vertices":[{"id":"vD","name":"Bodega door","x":58.25,"y":37.85,"story":0}],
 "edges":[{"id":"e_bodega","a":"vD","b":"vIn","name":"Bodega","band":0.25,"door":"opening_bodega_door"}],
 "lanes":[{"id":"near_in","side":"near","offMin":-0.1,"offMax":0.8,"door":null,"points":[{"x":50,"y":-1.6}]}],
 "nodes":[{"id":"N4","name":"Behind the parked car","x":33,"y":39.2,"facing":180,"types":["cover","hide","spy"],
           "radius":0.55,"reach":true,"door":null,"insidePath":null}],
 "zones":[{"id":"Z1","x":47,"y":52.95,"width":5,"length":0.9,"slots":[{"x":47.8,"y":53.4,"facing":45}]}],
 "portals":[{"id":"P1","name":"Alley (corner)","kind":"corner","x":50,"y":-2.1}],
 "traffic":[{"id":"car_w","speed":8.5,"gap":9,"delay":3,"points":[{"x":65.6,"y":-19}]}],
 "actors":[{"id":"mark","role":"mark","cls":"combatant","lane":"far_w","startS":16,"divertAt":"N6","watch":40}]}
```

- **edges**: the player's walkable route. `band` caps the strafe distance each side (the Route walk
  slider caps it further). `door` names an opening: while that door is closed the branch is blocked.
- **lanes**: one-way NPC walking lines. `offMin`/`offMax` limit how far walkers may step aside
  (+ = the walker's right). `door`: walkers only appear on this lane while that door is open.
  A lane should start and end at a hidden spot (a portal).
- **nodes**: shared spots. One occupant at a time (player or NPC). A node within 1.9 m of a route edge
  makes the strafe band bulge so the player can step into it (`reach:false` turns that off).
  `insidePath` lets an NPC leave through a door (last point = hidden exit).
- **zones**: gathering places; `slots` are where loiterers stand.
- **portals**: documentation and debug markers for valid ways in and out. The rules are enforced by
  sight lines at run time, not by the marker.
- **actors**: `role` walker | loiter | stoop | mark; `cls` pedestrian | stationary | background |
  combatant (how hard the card may cheat); `views` limits the body pictures (default FRONT, 3/4, BACK).
