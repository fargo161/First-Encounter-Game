# Room Creator v0.14.1 independent audit

**HOLD FOR FURTHER REMEDIATION.** The scene-integrity repairs are independently verified, and the inherited promotion suites pass. One P2 repair gap remains: a palette or texture whose ID is present in the library manifest but whose image file is missing still silently falls back on the selected object. The object inspector supplies no missing-reference warning or field-specific reset for that condition. This is an incomplete F5 repair, rather than a failure of the repaired missing-ID case.

Audit date: 18 October 2026, America/New_York. No canonical promotion, production-source repair, or asset-library modification was performed. All execution used disposable extractions under the audit work directory. This decision concerns the internal authoring-tool baseline.

## Verified repairs

| Finding | Independent conclusion |
|---|---|
| F1 Prop lifecycle | Reproduced all four original failures against v0.14; all four pass against v0.14.1. Prop-only occupancy refuses ordinary deletion; forced deletion removes the selected story's props; collapse shifts higher props with their rooms; room deletion removes unsupported props and counts them. Additional real editor checks pass for floor cuts, retention on independent floor space, rehosting onto a neighbouring room, floor-to-room conversion, and furnished middle-story deletion. Undo, redo and serialized reopen preserve the expected data and custom metadata. The actual room-deletion confirmation and completion message include prop counts. |
| F2 Setup deletion and import | Reproduced the original deletion and conflicting-import pose changes. The candidate preserves render yaw, footprints, world Use Points, their headings, collision and instance metadata. Additional checks compare complete rendered world matrices for front calibrations 90/180/270, instance rotation 37 degrees, scale [1.7, 2.2, 0.6], raised placement and an upper story, including history and reopen. Existing conflicting setups remain and their asset ID is reported. Importing a previously absent setup compensates existing instances; newly placed copies inherit the incoming points, tags and collision defaults. |
| F3 Elevated Use Point drag | The original tiny drag again produces 3.11056 m of unintended local displacement. The same original probe now produces zero displacement. Supplied real-pointer checks pass for visible drags on raised, rotated, nonuniformly scaled objects and an upper story, including screen-follow, unchanged height/custom data, undo, redo and reopen. |
| F4 Circular collision and sight | Reproduced the original empty-corner sight blocker; it is clear in the candidate. Additional route-level tests pass for centre crossings, rotated/stretched circles, collision offsets, low/high/sloping rays, disabled and non-solid props, and legacy pillars. Sight now uses the transformed collision polygon and vertical interval. The circle remains a 12-sided approximation. |
| F5 Appearance repair | The original missing-palette-ID reproduction is repaired. Missing palette IDs, missing texture IDs, missing embedded-image IDs and incompatible palette assignments show retained IDs and repair/reset controls. The supplied reset/history/reopen checks preserve unrelated custom fields. Valid canonical texture rendering still passes the original acceptance check. Missing image files behind existing manifest IDs remain defective, as detailed below. |
| F6 Build and restored tests | The original unmodified Windows build reproduces the prior CRLF hash mismatch. The candidate builds to the exact packaged bytes. Both LF-source and CRLF-source checks pass. Two pristine repackaging runs reproduce the entire delivered candidate ZIP exactly. All 12 prior browser scripts are restored; the portable runner executes the selected preservation checks without editing production scripts. |
| F7 Model readiness and generation | The original loader fails after one injected transient read and exposes neither readiness waiting nor explicit retry. The candidate recovers a transient read, stops a persistent read failure after exactly three attempts, and supports explicit retry. A real never-resolving-read test ends after 36,647 ms with three attempts and an ID/path/timeout error. A delayed old read cannot replace a template after library reconnection. The real generator readiness barrier refuses a failed model before changing the bundle. Normal generation succeeds separately with 50/50 unique models, 69 props and 24 Use Points, with no page errors. |
| Cache reset | Independently reproduced the original retained prop texture after New. The candidate releases those textures and rendered objects. This confirms replacement/reset cleanup, without establishing a long-duration memory bound. |

The intermittent seven-model readiness incident from the original audit has no deterministic original trigger or established root cause. The injected negative control and fresh candidate tests verify recovery and diagnostics; they do not establish why that historical incident occurred.

## Remaining failure

### R1 P2 Missing palette and texture files bypass object repair handling

Reproduction uses a virtual folder made from canonical bytes, leaving the external library untouched:

1. Keep the manifest records for `lp_furniture_chairs_mesh_chair_wood_01`, its palette `pal_lowpoly_master_32`, and texture `pix_bricks_brick_herringbone_blue_1`.
2. Supply the chair GLB, but omit the palette and texture PNG files. Connect this folder through the real `connectFiles` provider.
3. The chair loads. The library file check correctly names both missing files.
4. Assign the retained palette ID to the selected chair, then independently assign `{library: "pix_bricks_brick_herringbone_blue_1"}` as its texture.
5. In both cases the appearance issue resolver returns `[]`. The renderer's matching texture-cache entry has `failed: true` and no texture. The chair displays its original embedded image. The inspector presents the normal appearance controls without a missing-file warning or the new repair/reset control.
6. Save/reopen preserves the reference and the unrelated custom field, but does not surface the problem on the object.

The global library report does report the missing files. The failure is the missing connection between that evidence, the renderer's failed load, and the selected object's repair UI. Reference retention alone does not complete the requested repair workflow.

The resolver checks whether an entry exists, but does not use its `missing` state or the failed image load. The renderer records an image failure locally and falls back without feeding an issue back into the inspector. Relevant candidate locations are core lines 130–139, inspector construction around line 287, and renderer texture handling around lines 351–361. The independent source diffs are included in this evidence folder.

Evidence: `adversarial-results.json`, `adversarial-missing-palette-file.png`, `adversarial-missing-texture-file.png`, and `audit-scripts/adversarial.py`. Both missing-file assertions fail; their reference/metadata preservation assertions pass. The additional adversarial set has **16 passing and 2 failing checks**. No new P1 scene-integrity failure was found in this audit.

Before promotion, route known missing-file and failed-image conditions into the existing appearance repair UI, retain references and unrelated metadata, and add regressions for both folder-provider and URL-provider image failures. Reissue a new versioned candidate and independently rerun that change and the affected gates. No repair was made in this chat.

## Promotion gate results

| Coverage | Fresh result and practical evidence |
|---|---|
| Existing Node suites | 297 assertions pass across ten suites. |
| New core regressions | 11 cases pass. |
| Supplied new browser regressions | 45 checks pass, with no page errors. |
| Original Asset Browser acceptance | 60 pass, 0 fail. Placement, first-person interaction, appearance edits, palettes, textures, setup defaults, metadata and disconnected-project behavior are exercised. |
| Entire model library | 327/327 loaded; zero reported size/pivot/palette problems. The fresh contact sheet has all 327 rendered model thumbnails. All 29 supplied unverified vehicle licence flags remain. |
| Furnished demo | Four integration checks pass. The scene has 69 props, 24 points, three looks, five project palettes and nine setups. The route walk starts with 29 solid prop sight records. |
| Additional lifecycle cases | Five checks pass, including the real deletion dialog and all four added edit/history/reopen cases. |
| Examples and save/reopen | All 11 packaged examples open. Format-10 City Block upgrades to 11. The normalized rail-demo project round-trips identically. |
| First person, stories and stairs | Look/movement/lens/eye edits, undo, wall stops, free-camera saving and stair traversal operate. The build-up script exercises full/setback/overhang/ring/deck configurations and floor holes. It reaches story 1 at 3.2 m through the stairs. |
| Rails and export | The recovered rail script produces a 62.1 m, 27.21 s plan with no warnings, an 818-frame JSON export, a frame ZIP and a WebM. Bend insertion/drag/removal and test-walk riding operate. The example's 52.2 s rail reaches story 1 at 3 m. |
| Sky and fallback | Presets, image sky, haze and undo are exercised. Explicitly disabled WebGL produces `2D FALLBACK` with no reported errors. |
| Route preservation | Smoke, real-key controls, performance and all 27 evaluation scenarios complete. Scenario measurements match the prior audit; only two diagnostic strings correct the old middle-dot encoding. In-view spawn/despawn, car in-view despawn, node-conflict and same-direction-overtake counters remain zero. |
| Normal demo regeneration | Writes a separate generated file. All 69 prop placements/collision/gameplay/point records and the route network, stories, stairs, floor cuts, pairs and links match the shipped demo after normalization. Generated palette IDs and image serialization can differ. The shipped maps remain byte-identical. |

The restored preservation and route scripts are largely observational. Their printed states, output files and relevant fresh images were inspected; exit 0 is not counted as a blanket assertion for every feature. Fresh run provenance is in `fresh-native/run-index.json`, with the exact HTML hash for each script.

## Preservation and integrity

All 11 delivered checksum entries, all 382 candidate manifest entries, all 168 original v0.14 manifest entries, and all 2,753 extracted library checksum entries match at intake. The original ZIPs and prior audit evidence match the previous audit's recorded hashes. Every one of the full v0.13.1 prototype's **10 example maps** is byte-identical in the candidate. The furnished demo also remains byte-identical to v0.14.

Production source, runnable HTML and all packaged example maps were checked again after testing. Test outputs changed only inside the disposable extraction and separate audit folders. The external library was used through read access; failure injection replaced browser provider methods or assembled an in-memory file list. No canonical binary or manifest was edited. Final preservation details are in `integrity-final.json` and `production-preservation.json`.

The reduced preview ZIP inside the library is not the full v0.13.1 preservation reference. It has no source and a different route map. The full prototype archive below is the comparison source. Internal manifests and reproduced packages establish byte identity; they do not provide a signature or Git ancestry.

| Item | SHA256 |
|---|---|
| Remediation candidate ZIP | `9b9cd3e9220edbdffbd836154b44d69b5527aa8b0d74300ad546f868a18da78d` |
| Independent tester handoff ZIP | `503a7af4aad07988e1b921aa3e9c4e0f4252acd794ac407aab6c2328b6454ba7` |
| Original v0.14 ZIP | `a829c93663a6b79208391721a15f3f1f01f84ba211782b8fcbe08719fcd90224` |
| Full v0.13.1 prototype ZIP | `935d74f5eb38e773fdafac3d2813371829177b17882eef69eab3991df4ecf129` |
| Canonical asset-library ZIP | `4cf39cb712d55e866a593ad12394efec891d5ae3ac14dfd35d932b32bd8b1241` |
| Prior audit evidence ZIP | `6d31fe1d4406e11bde42f66533e850b83fd1c562e5b2cae9246b3cad6fab9d3e` |
| Candidate HTML, 1,615,201 bytes | `a4e8a14ddc4d734c036902f56b1a7d7bb8a157a77ef3911b97ea70c76f228c97` |
| Route baseline map | `5b296703315cf9c1dec1db809faedf2d72df04b11d76e9cae0af0ff374c72d01` |
| Shipped furnished demo map | `6497e3d5daa5fd877728e0d40713f965c0bb2cccc06eb3c3431e4175f71443b3` |

Independent runtime: Windows, Python **3.12.14**, Node **24.19.0**, Playwright **1.56.0**, Chrome **155.0.8059.41**, ANGLE SwiftShader. These Python/Node versions differ from the builder's recorded versions and still pass the suites. Native Linux/macOS execution was not available. Exact Windows builds, LF/CRLF source simulation and byte-identical repeated ZIP packaging are verified.

## Usability and architectural concerns

Fresh shop-counter and stockroom views show a coherent furnished demonstration. The upstairs dining/map views still show the disclosed stockroom wall imagery because lower-story walls overlap them. The maroon cover car still has a roof bar. These images support the furnishing integration, while limiting claims about a finished residential scene or an actual unmarked-car geometry conversion.

Setup conflict handling is now safe, but keeping the existing setup means the incoming conflict is not imported as an alternate. The displayed conflict ID is useful; a future preview/compare workflow would make this easier for authors. Front calibration remains project-local.

The shared private JavaScript scope and regex duplicate-name guard remain architectural debt. Cache cleanup now covers the reproduced reset failure, while cache capacity, content-based reconnect identity and a long-duration soak remain unverified. Spatial rules still deliberately differ between unpadded sight and walking safety margins. Those margins should stay documented and tested together.

Fresh software-graphics measurements include about 2.60 s for first demo palette generation and 4.42 s for two story switches in the expanded stress scene. These remain usability costs, and shared-machine timings are not GPU performance guarantees. There is no demonstrated new scale-related crash in this audit.

## Acceptable known limitations

The disclosed single collision primitive and coarse vehicle cover, 12-sided circle approximation, story-wall overlap, absence of instancing/LOD/stacking/snapping/multi-selection, unfinished NPC card art/facing, project-local setup calibration, data-only gameplay tags/Use Points and JSON route authoring remain acceptable prototype limitations. The extra vehicle cover is measurable but does not establish physically accurate cover geometry or general NPC navigation around furniture.

Chrome/Edge remain the target. The file-list folder workflow is exercised; native remembered-directory permission behavior and other browsers are not certified here. The 29 unverified vehicle licence flags remain supplied provenance warnings; internal baseline review does not grant asset redistribution clearance.

## Evidence and recommendation

The evidence bundle includes fresh assertion logs, preservation/route observations, additional independent probes, source comparisons, visual evidence, package/build reproductions, input identity, final preservation checks and per-file SHA256 values. `RUN_NOTES.json` distinguishes discarded environment/fixture attempts from application findings. Historical builder output is not used as a fresh pass. The external asset library and original candidate archives are excluded from the evidence bundle.

**HOLD FOR FURTHER REMEDIATION.** F1–F4 and F6 are repaired in the exercised cases; F7 recovery and safe generation are verified within the stated limits. F5's original missing-ID case is repaired, but known-ID missing-file recovery remains incomplete. Resolve R1, reissue and independently verify the affected candidate before canonical promotion. The project owner retains the promotion decision.
