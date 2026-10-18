# Room Creator v0.14.1 remediation report

Status: new versioned builder candidate, awaiting independent review. No canonical promotion, library update, asset redesign or gameplay expansion was performed.

The original `Room_Creator_v0_14_asset_library.zip`, `AUDIT_REPORT.md` and failure evidence inside `Room_Creator_v0_14_Audit_Evidence.zip` were read before implementation. Work began from a separate extraction of the original ZIP. The original source and baseline were not edited. Input hashes are recorded in `input-provenance.json`.

| Audit finding | Focused remediation | Regression evidence |
|---|---|---|
| F1 P1: props absent from lifecycle | `core.js` counts, refuses, clears and shifts props with stories; room deletion removes unsupported props and counts them, or rehosts them on remaining floor. Floor-section conversion includes props. Story UI and deletion messages include 3D objects. | Core cases plus real mutation/undo/redo/serialized reopen for each deletion/retention/shift reproduction. |
| F2 P1: setup delete/import changes transforms | Removing calibration compensates every instance rotation by old front minus new front. Conflicting imported asset setups keep the existing record and report its asset ID. New imported calibrations also compensate existing instances. Unknown instance/setup metadata is preserved. | Renderer yaw, collision polygon, world Use Points, custom data, delete/import/undo/redo/reopen, and new-calibration import. |
| F3 P1: elevated Use Point jumps | Drag onto the actual point-height plane, relative to the initial pointer. Keep local height and apply the existing 3-pixel movement threshold. | Real tiny and visible drags for raised, scaled, rotated objects and upper stories; screen-follow, metadata, undo/redo/reopen assertions. |
| F4 P2: round collision gives square sight | Clip sight rays against the same transformed 12-sided footprint as walking, extruded over the collision height range. Existing legacy pillar boxes remain intact. | Outside corner clear, centre crossing blocked, scaled/rotated/offset footprints and vertical/sloping rays. |
| F5 P2: missing appearances invisible | Inspector reports retained missing/incompatible palette and texture IDs, with replacement and field-only model-default reset. Renderer ignores incompatible assignments; saved data remains. | Missing palette, library/image texture and incompatible palette UI, reset/undo/reopen/custom metadata; valid canonical surface texture regression plus original D8b render assertion. |
| F6 P2: platform newlines/missing tests | Build writes explicit UTF-8 LF bytes. Restore all 12 missing browser scripts from the full v0.13.1 prototype; parameterize paths, outputs and optional prior inputs. Add a portable no-symlink server/runner and Windows/Bash wrappers. | All inherited Node checks; exact LF/CRLF-source rebuild hashes; restored current preservation output and baseline seal. |
| F7 P2: intermittent model readiness | Three automatic attempts maximum, 12 seconds each, bounded backoff, stale-result protection, individual ID/path/error/attempt diagnostics, explicit Retry. Demo generator stops before edit/save on unresolved models and writes a separate generated copy. | Injected one-time read failure, persistent failure with exactly three attempts, caller deadline/late-read recovery, explicit retry, fresh all-model/demo generation. |
| Reproduced cache reset | Release prop materials/textures on project replacement/dispose and provider changes; ignore late texture callbacks after reset. | New-project cache assertion. This does not claim a general long-duration memory/latency certification. |

No new required data fields or version migration were introduced. Placement uses pivot support; props can overhang floors. Round footprints keep the existing 12-segment approximation, including ellipses after nonuniform scale. Walking safety margins (0.12 m first person, 0.25 m route player) remain distinct from unpadded sight. See `source/FORMAT.md` for the spatial and setup contract.

The working Asset Browser, placement, textures/palettes, reusable looks, gameplay metadata, arbitrary custom Use Points/tags, furnished demo and routing were preserved. The route baseline and shipped furnished demo retain their original hashes. Source diffs are supplied; legacy renderer/importers/vendor/sky/rails modules outside the focused patch remain unchanged.

Build output is 1,615,201 bytes, SHA256 `a4e8a14ddc4d734c036902f56b1a7d7bb8a157a77ef3911b97ea70c76f228c97`. Exact byte equality was tested on Windows with both LF and CRLF source trees; native execution on another OS was not performed. The byte writer removes the platform newline dependency.

The original readiness incident has no established root cause. Bounded retry and diagnostics address recovery and observability; successful retries do not establish why the original seven models were temporarily unavailable.

Known limitations remain: one collision primitive per prop and coarse vehicle cover; overlapping story walls; no instancing/LOD, stacking/snapping or gameplay runtime; unfinished NPC card art/facing behavior; software-rendered performance figures are observations, not hardware guarantees. Preserve all 29 supplied unverified vehicle licence flags. The external canonical asset library is excluded from this package.

Review `TEST_REPORT.md`, `verification-summary.json`, `preservation-seal.json`, failed-development-run notes and the separate independent tester handoff before deciding promotion.
