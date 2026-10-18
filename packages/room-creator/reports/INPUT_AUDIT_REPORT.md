# Room Creator v0.14 independent audit

**Decision: hold promotion. v0.14 is a useful implementation candidate, but is not suitable to become the canonical Room Creator baseline in its present state.** Repair the scene lifecycle and transform defects below, then issue and audit a replacement package. Keep the full v0.13.1 prototype baseline and both supplied ZIPs intact.

Audit date: 18 October 2026, America/New_York. This is an audit of an internal authoring tool, not approval for a game release or asset redistribution.

## Scope and package provenance

The audit began with `CODEX_HANDOFF.md` inside the supplied v0.14 archive. Its commands, working rules, and completion statements were treated as handoff material to evaluate. They did not authorize implementation work. No production source was modified. Extraction, rebuilding, tests, environment adapters, and adversarial probes used `work/rc014-audit`; audit deliverables are in this folder. The canonical library was read from an extracted copy and retained as an external dependency.

| Input | Bytes | SHA256 |
|---|---:|---|
| `Room_Creator_v0_14_asset_library.zip` | 81,686,920 | `a829c93663a6b79208391721a15f3f1f01f84ba211782b8fcbe08719fcd90224` |
| `Trapstar_RoomCreator_Asset_Library_v1.zip` | 178,595,688 | `4cf39cb712d55e866a593ad12394efec891d5ae3ac14dfd35d932b32bd8b1241` |
| Full v0.13.1 prototype ZIP, additional comparison input in Downloads | — | `935d74f5eb38e773fdafac3d2813371829177b17882eef69eab3991df4ecf129` |

There are two distinct prior-version packages. The canonical library contains the reduced `Room_Creator_v0_13_1_route_preview(1).zip`, SHA256 `bf4ecc6ca8679d7d781ca41efaa6258d80a1b75ef20e0baab6406bcca051861e`. It has no source tree, and its map hash is `10a0d8d8…`; it is not the byte-preservation reference claimed by v0.14. The full prototype ZIP found in Downloads contains source and the map with SHA256 `5b296703315cf9c1dec1db809faedf2d72df04b11d76e9cae0af0ff374c72d01`. That map is byte-identical to the supplied v0.14 baseline. This distinction prevents a false regression finding and should be explicit in the next handoff.

The manifest proves package integrity relative to its own checksum list. It supplies no independent signature or Git ancestry. Preservation conclusions additionally use direct comparison with the full prior package. See `package-identity.json`, archive inventories, `additional-prior-provenance.json`, and `source-comparison.json`.

## Verified claims

| Claim | Independent result |
|---|---|
| Complete package checksums | All 168 listed handoff files and all 2,753 listed library files match. Each checksum list excludes only itself. A final recheck confirms both originals, both extracted inputs and every production source file remain unchanged. |
| Build comes from supplied source | `source/build.py` runs successfully. LF-normalized output matches the packaged HTML; forcing LF output in memory reproduces the exact packaged hash. The unadapted Windows build has a portability defect described below. |
| Existing data rules and new prop tests | All ten Node suites pass: **297 assertions**, including the eight older suites' 281 assertions, ten prop metadata checks, and six demo-file checks. |
| Asset browser acceptance | **60 passed, 0 failed**, using the supplied test logic with audit-only Windows environment adaptations. |
| Entire model library loads | **327/327 ready**, zero size/pivot/palette problems reported by the fresh browser loader test; all 327 thumbnails generated. |
| Independent library structure | 1,373 unique logical asset IDs; 327 valid, self-contained GLBs; all **306 palette-model embedded images byte-identical** to their expected canonical palettes. All 1,043 surface textures and three palette images decode. |
| Read-only library workflow | Providers use read access; project appearances, palettes, setups and embedded surface images are project-local. No library write operation appears in the provider code. The external library is not bundled into the editor package. |
| Metadata and repair references | Supplied Node and browser checks exercise unknown prop/library/route metadata, structured tags, custom point types, load/edit/save/reopen, and disconnected projects. Missing object/look references persist. Missing palette visibility is defective, despite reference preservation. |
| Furnished scene integration | Fresh demo checks **4/4**; no page errors. 69 props, 24 Use Points, three looks, five project palettes, nine model setups, 18 rooms, 17 viewpoints and 89 image assets. |
| Route-walk baseline behavior | Smoke, key-control, performance and 27-scenario route evaluation scripts complete; the evaluation reports 190 spawns and 193 despawns with no in-view appearance/disappearance violations. The furnished demo starts and advances with 29 solid prop sight boxes; the 569-object stress scene starts with 279. |
| Asset provenance warnings | All 29 models from the two vehicle packs with unverified supplied licence status remain flagged. This verifies reporting of supplied provenance, not legal clearance. |

Browser environment: Python 3.12, Playwright 1.56.0 installed only into the audit directory, Node 24.18.0, Chrome 155.0.8059.41, Windows, headless software graphics. A localhost adapter serves the disposable package and read-only library copy. Production scripts were not edited to obtain the 60/60 result.

The supplied `--use-gl=swiftshader` flag creates a null WebGL engine on this Windows Chrome. A preflight compared it with `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`, which creates the engine correctly. An early acceptance attempt therefore used fallback graphics and is excluded from application findings. Another run hit the Windows console's encoding error while printing a passing check name; enabling `PYTHONUTF8=1` resolved it. These are reproducibility problems, not evidence that placement or metadata failed. The final 60/60 result supersedes those attempts.

Evidence: `node-suites-fresh.json`, `fresh-assets_browser_results.json`, `fresh-assets_all_models_results.json`, `independent-library-structure.json`, `fresh-assets_demo_checks_results.json`, and fresh-run logs/indexes.

## Preservation of the 0.13.1 systems

Direct source comparison shows that the old render fallback, three.js vendor file, legacy importers, sky UI, rail UI, story UI and WebGL interface module remain text-identical to the full prototype source. Changes to existing code chiefly add props to validation, GL rendering, navigation, first-person event handling and route sight/blocking. Keeping a UI module unchanged does not establish complete integration: the story lifecycle bug is a counterexample.

The full prior package's `tests/browser` directory is absent from the v0.14 handoff, although the report lists those tests. For this audit, its tests were recovered from the prior archive and copied into an audit directory. Only environment paths/output destinations were adapted. Their printed behavior was reviewed; several are observational scripts rather than assertion-based test suites, so a zero process exit is not by itself proof of every named feature.

| System | Fresh checks and practical conclusion |
|---|---|
| Architecture, openings, surfaces, sprites, mattes, cover pairs | Older core assertions pass. The legacy model, view/pair data and import paths remain. Sampled old multi-story browser results are identical with the same test code on v0.13.1 and v0.14; this supports a pre-existing failure classification for that sample, not for every obsolete suite. |
| First-person editing and free camera | Recovered `fp_test` and `fp_test2` exercise look, movement, lens/eye edits, undo, wall stops, free-camera saving and stair traversal. Their output confirms those paths still operate. |
| Sky and haze | Recovered sky test exercises presets, panorama controls, horizon selection, live changes and undo. Source UI is unchanged. |
| Rails and export | Recovered rail tests produce a 62.1 m / 27.21 s plan with no warnings, an 818-frame JSON export, frame ZIP and WebM output; bend insertion/drag/removal and test-walk travel operate. File creation is verified; video quality and real-time cadence are not certified. |
| Stories, stairs and floor holes | Existing construction/story assertions and recovered build-up/stair tests run. Props can be placed/picked upstairs. New props are omitted from deletion/collapse logic, so full integration fails. |
| Examples and fallback | All 11 packaged example maps open; the rail-demo project round-trips identically, the v0.12 City Block upgrades to format 11, the 52.2-second demo rail reaches story 1 at 3 m, and disabled WebGL yields an error-free 2D FALLBACK. Detailed outcomes are retained in the preservation logs and results. |
| Route walk and NPC cards | Original route-network records remain; key controls, door interaction, strafe limits and prototype evaluation run. This remains an authored ground-level prototype; it is not a general gameplay engine or arbitrary multi-story NPC pathfinder. |

The route-key output from v0.14 and the full v0.13.1 build is identical after excluding frame rate (4.1 versus 3.9 FPS in that software-graphics run).

The demo preserves the route network, stories, stairs, floor cuts, pairs and links after normalization. Every original viewpoint is unchanged; seven inspection viewpoints were added. Fifteen intended placeholder pillars were removed, including the six-box parked car. The stair's added default `filter: pixel` is normalization, not altered stair geometry. The preserved route net has nine vertices, eight edges, five NPC lanes, six spots, one zone, nine portals, two traffic lanes and twelve actors.

Evidence: source diffs, `independent-data-probes.json`, `preservation-index.json`, `preservation-*.log`, `legacy-multistory-final-comparison.json`, and route evaluation results.

## Failures and regressions

Priorities describe the promotion decision: P1 affects authored-scene integrity; P2 is a functional or reproducibility defect that should be repaired during stabilization.

### F1 P1 Props are missing from room and story lifecycle operations

`source/core.js:163–186` counts, clears and shifts legacy objects, but not `project.props`.

Reproductions using public core operations:

- Make stories 0, 1 and 2, put a room and prop on story 2, then delete empty story 1. The room shifts to story 1, the prop retains 2, and subsequent validation silently resets the prop to Ground (0).
- Force-delete a furnished upper story. Its architecture disappears, but its prop survives and normalizes onto Ground.
- A story containing only a 3D prop is considered empty and can be deleted without the occupied-story refusal.
- Delete a room with a prop and no remaining floor under it. The prop remains at the old position with `roomId: null`, outside every floor; the removal count does not include it.

This is an integration regression introduced by the new prop data path, even though the older lifecycle functions themselves were not edited. Add props to occupancy, clearing, shifting, floor-retention rules, removal counts and UI messages. Verify undo/redo and save/reopen for each case. Evidence: the first four cases in `independent-data-probes.json` and `independent_data.cjs`.

### F2 P1 Setup deletion and conflicting setup import change placed transforms

The direct front-side editor compensates instance rotations to preserve model pose. The setup deletion and import paths do not.

- Place a chair using `frontTurn: 90` and `rotation: 0`. Delete its setup through Library → Looks → Object setups. The displayed confirmation promises that placed copies keep their turn. Actual render yaw changes from π/2 to π, and the collision footprint changes with it.
- Import a setup for the same asset with `frontTurn: 180`. `mergeLooks` overwrites the current setup, reports zero renamed conflicts, and changes yaw from π/2 to 0. Existing setup metadata/defaults can be replaced as well.

Relevant code: `source/ui-props.js:431–434` and `:512–522`. A setup is keyed by asset ID, so a conflicting setup cannot be handled like an ordinary palette ID. Define an explicit conflict policy, preserve existing metadata, and compensate all affected instance rotations whenever front calibration changes. Test rendered pose, collision polygon and world-space Use Points across delete/import/undo/save. Evidence: `independent-browser-probes.json`, `audit_probe.py`, and `independent-evidence/setup-deletion.png`.

### F3 P1 Elevated Use Points jump when dragged

The point's handle is drawn at its world height, but map dragging inverse-projects the pointer onto the story floor (`source/ui-props.js:194`).

With object height 1 m and a point 1 m above the object's pivot, a roughly 0.1-pixel drag changed model-space `(x,z)` from `(0,0.7)` to `(2.2,-1.499)`: approximately **3.11 m** of unintended plan displacement. The height value stayed unchanged.

Project onto the selected point's actual height plane, or use pointer deltas relative to its starting projection. Add cases covering raised objects, nonzero point height, rotated/scaled objects and upper stories. Evidence: the recorded before/after world, screen and local coordinates in `independent-browser-probes.json`.

### F4 P2 Round collision gives square sight occlusion

Walking uses the round footprint polygon, but route sight construction replaces a cylinder with its surrounding square (`source/ui-route.js:87–89`). A ray entirely outside a radius-1 circle, through its empty corner at relative `(0.9,0.9)`, is reported blocked by the prop. This can manufacture cover where the collision shape says space is empty.

Use the same polygon/ellipse footprint in sight intersection, or clearly expose a separate sight-blocking shape. This is distinct from the intentionally coarse single-box vehicle limitation. Evidence: round-collision probe with `inside: false` and a non-null sight blocker.

### F5 P2 Missing palettes are retained but not surfaced for repair

An object with `override.palette = "missing-palette"` saves the reference. Its inspector shows default appearance text and palette controls without identifying the missing ID, and rendering silently falls back. This does not meet the handoff's broad “missing asset / look / palette → message for repair” claim.

Display an explicit missing-palette status, the retained ID and repair/reset choices. Also cover missing texture and incompatible palette references. Relevant code: `source/ui-props.js:288–304`, `source/gl.js:388–394`. Evidence: complete inspector text in the missing-palette probe.

### F6 P2 The exact build hash is platform-dependent

Packaged HTML: 1,608,299 bytes, SHA256 `c8c2190019810bf942aae5d8e92d5d4719c4e5a79c9b61ab230d631d2681b706`.

Unmodified Windows rebuild: 1,618,559 bytes, SHA256 `b5d5f9d9651e0c13e21429fe4fe29438409e3718e6fea3d2679448decafb2ca8`.

`Path.write_text` uses platform newlines. After CRLF→LF normalization the files are identical. An in-memory byte-output adaptation, without source edits, reproduces the exact packaged hash. Pin LF output explicitly and add a byte-level post-build check. Evidence: `integrity-and-build.json`, `lf-build-confirmation.json`, `source/build.py:24`.

### F7 Intermittent demo regeneration failure

The first untouched generator run stopped before saving because seven canonical model IDs were not ready. All seven IDs exist, the supplied furnished map has no unresolved asset IDs, and the full library loader test passed. A retry with only additional failure diagnostics completed with 69 props and no page errors. A further isolated retry of the untouched generator also succeeded: all 69 model references resolve, placement/collision records and route net match the supplied demo, and the baseline remains unchanged. Generated palette/image IDs and serialization differ, so regenerated map bytes are not identical. No root cause was established, so the first failure is retained as an unresolved intermittent loading observation, not classified as a proven deterministic application regression. See the original failure, diagnostic log and isolated-retry result. The build/demo tooling should report individual model errors and provide a bounded retry or actionable recovery.

## Architectural concerns

**Shared private scope remains fragile.** The build's duplicate-name guard is a useful safeguard, but its regular expression examines only certain declarations at the beginning of lines. It is not a JavaScript scope parser and misses indented declarations, later declarators and other binding forms. Treat it as a partial check. Prefer explicit module interfaces or parser-based validation during future maintenance.

**Cache lifecycle needs bounds and identity rules.** Prop textures are cached by reference/filter without eviction; starting a new project removes rendered props but retains the texture cache (observed 1 texture before and after). `dispose()` does not explicitly clear these new prop resources. Library thumbnail identity uses name/schema/date/count rather than content hashes; reconnecting another library revision with the same IDs can also reuse renderer texture keys. This is a resource/staleness concern, not proof of a leak crash in this audit. Add a measured repeated-open/reconnect/palette-edit soak test before large scenes become normal.

**Collision has multiple interpretations.** Walking grid, safety-margin fallback, route player blocking, sight boxes and conflict warnings share helpers but differ in padding and height rules; the round-sight defect demonstrates drift. Define one tested spatial contract and document deliberate conservative margins. NPC/traffic conflict reporting remains an authoring warning; it does not establish that actors dynamically navigate arbitrary furniture.

**Tests are stronger on addition than lifecycle transitions.** The supplied suites cover creation, single-instance edits, metadata and selected route integration well. They miss room/story deletion with props, setup conflict/delete behavior and elevated-point dragging. The missing `tests/browser` directory also prevents a recipient from reproducing all reported 0.13 checks from this package alone. Restore those tests, parameterize paths, add a Windows runner, pin the test environment, and distinguish assertions from measurement/screenshot scripts. `assets_perf.py` and the vehicle-front sheet have no comprehensive behavioral pass threshold.

**Format 11 is additive, not byte-stable serialization.** Keeping optional props/library blocks is compatible with older project structure, but old surfaces acquire `filter: pixel` during normalization. The blanket statement that object-free saved files are byte-for-byte what 0.13.1 wrote is too strong. Distinguish unchanged baseline files on disk, normalized semantic preservation and byte-identical exports.

## Usability concerns

The Library tab, actual-model thumbnails, search, plain-language appearance controls, copy-local overrides, licence flags and disconnected placeholders form a usable workflow. Fresh browser interactions verify placing on the map/in first person, turning, movement, duplication, replacement, look/palette/texture editing, surface texturing and export/import.

The controls still require careful interpretation:

- “Locked” prevents map movement/turning but permits inspector edits. Label this as movement locking or enforce the broader expectation.
- Front calibration is stored in each project, not in the read-only canonical library. A new project can encounter the same chair/monitor orientation issue again unless setups are imported. Provide a clear starter-setup workflow after fixing import conflicts.
- Missing palette recovery needs a visible status. Raw data retention alone is insufficient for a novice author.
- Object height is a manual number; no stacking, surface snapping or multi-selection exists. This is acceptable scope, but it makes detailed furnishing slow.
- Fresh screenshots show a convincing stockroom/shop/street demonstration. The upstairs “flat” retains stockroom imagery because of overlapping walls, and the library lacks a bed/sofa/counter set. Treat it as a feature demonstration rather than proof of a finished residential scene. The repainted cover car still visibly has a roof bar; “unmarked” is a demo label, not a geometry conversion.

See `fresh-scene-review.jpg` and the fresh individual screenshots. Review was performed at the documented desktop test viewport; this is not certification of every smaller screen or touch workflow.

## Acceptable known limitations and challenged claims

| Limitation | Audit judgment |
|---|---|
| One box/circle per object, especially the full-height car box | Acceptable for the prototype with clear disclosure. Reproduced crouched hidden shares: baseline N4/N5 **0.535/0.451**, furnished **0.732/0.845**. Standing shares stay **0.028/0.014**. More cover is real, but not evidence of physically accurate vehicle cover. Round sight mismatch remains a defect. |
| Story walls overlap where wall height exceeds story spacing | Inherited architectural limitation, visually evident in the demo. Acceptable only as explicit debt for this phase; it limits independent upstairs styling. Verify a geometry fix before using multi-story interiors as a quality reference. |
| No instancing or LOD | Acceptable at the 69-object demo scale, with measurable expansion cost. Fresh stress has 569 props and 1,282,936 triangles; map draw was 64.2 ms versus demo 19.0 ms in the software-rendered check. These measurements do not establish performance on a real GPU. |
| First palette generation and rebuild stalls | Fresh perf recorded about **3.27 s** for the initial demo palette operation and **3.22 s** for two stress story switches. Ordinary demo edit/duplicate/undo/redo measurements were roughly 32–61 ms, with initial selection 312.5 ms. “Only the full-map rebuild is a bottleneck” understates first-use latency. Keep loading feedback and profile before expanding scene scale. |
| Whole-picture UV vehicle texture replacement | Reproduced workflow and disclosed effect; acceptable prototype functionality, not a fitted vehicle repaint tool. Preserve the original/default appearance as an easy return path. |
| Inconsistent model fronts and incorrect library preview colours | Independently verified model loading and palette bytes; editor-generated thumbnails work around the preview issue. Per-model setup is a reasonable project-local workaround once setup mutations are safe. |
| NPC card direction and prototype evaluation | Fresh evaluation reproduces **51.2%** wrong-facing walking time while watching the street with FRONT/3/4/BACK, versus **9.0%** when SIDE is allowed. Acceptable as an explicitly unfinished art/prototype limitation; furnishing does not solve it. Across the 27 runs, reported in-view spawns/despawns, node conflicts, same-direction pass-throughs and body-overlap time remain zero. Player bump/wait measurements are separate and nonzero. |
| Runtime tags/Use Points are data only; route net remains JSON | Acceptable and consistent with this authoring pass. Do not imply implemented gameplay, procedural furnishing, Unity export or a route GUI. |
| Chrome/Edge target; other-browser folder persistence | Acceptable documented target. Folder-upload fallback was exercised in Chrome; native remembered-directory permissions and Firefox/Safari behavior were not independently certified here. |
| Unverified vehicle licences | Preserve warning/provenance as supplied. Internal baseline promotion is separate from commercial use or redistribution decisions. |

Performance figures describe this Windows software-graphics environment and test method. They are not hardware promises or statistically controlled cross-version benchmarks.

## Recommended builder actions and promotion gate

1. **Stabilize scene integrity first:** fix prop occupancy/deletion/story collapse and room-floor cleanup; test the full load → edit → undo/redo → save → reopen sequence.
2. **Make setup changes safe:** preserve world poses, footprints and point positions on deletion/import; define and expose conflicts without silent metadata replacement.
3. **Fix elevated-point dragging** with height-aware projection and meaningful movement thresholds.
4. **Align round sight collision** and expose missing palette/texture recovery.
5. **Repair reproducibility:** explicit LF builds, exact output hashes, complete preservation tests, portable environment configuration and fresh per-run result provenance.
6. **Then address scale/usability debt:** bounded caches and reconnect identity, latency feedback, story-wall overlap, setup starter data, snapping and multi-selection. Keep the canonical asset library unchanged; library metadata corrections belong in a separately versioned dependency.

Reissue as a new candidate package rather than silently replacing the audited ZIP. Promotion should require: the 297 existing Node assertions, 60 existing browser checks, all-model loading, the demo/route checks, recovered preservation coverage, and new regression tests for F1–F5; zero unresolved scene-integrity failures; a reproducible build; unchanged original baseline; and a reviewed furnished scene with known limitations clearly disclosed.

**Final recommendation: do not make this v0.14 archive canonical yet.** Keep it as the asset-integration candidate and use a focused repair phase. The demonstrated asset workflow is worth retaining; the independently reproduced integrity defects make immediate baseline promotion premature.
