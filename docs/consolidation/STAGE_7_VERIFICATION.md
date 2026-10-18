# Stage 7 Room Creator verification - 2026-10-18

**Migration verdict: PASS WITH HOLD PRESERVED. Product status: HOLD_FOR_FURTHER_REMEDIATION.** The known missing-image defect remains unrepaired. No migration regression or new baseline defect was found within these checks.

1. **Exact baseline.** Room Creator v0.14.1 held remediation candidate under packages/room-creator at commit 3b9d1cfe9daff13bcb89dd6672ad58e65add7356: 383 baseline files / 201,955,025 bytes, plus the separate Git-only tests/.gitattributes file. Full-tree SHA-256: 63521f0d9068de3e4da40cd8ec4573d17b26481aa6557a908caaa8d10a4c485b. The Stage 6 manifest governs exact membership and original bytes.


2. **Toolchain.** Windows 11 build 26200; bundled Python 3.12.14 and Node 24.19.0; existing Playwright 1.56.0, Pillow 12.3.0 and observed Chrome 155.0.8059.41 with ANGLE SwiftShader. No installation. Executable/dependency paths are recorded. Supplied tests retain documented launch settings; independent probes run in visible browsers through a separate adapter.

3. **Supplied results.** All 32 runner entries exited 0. Ten inherited Node suites: 297 assertions passed; new core regressions: 11 passed; supplied browser regressions: 45/45; asset acceptance: 60/60; model loads: 327/327 with no reported model problems/missing thumbnails; demo integration: 4/4. Sixteen runner entries are observational and were inspected through data/logs/images rather than counted as assertions. Separate normal demo generation also succeeded. Counts describe overlapping suites and different units, not a summed unique-test total.

4. **Independent results.** Current prior-data probes: 7/7; prior-browser probes: 8/8; extra lifecycle checks: 5/5. Adversarial set: 16 passed and 2 actual failures, solely the known missing palette/texture image cases. Original v0.14 negative controls reproduce four data failures and six browser failures; its injected one-time loader failure lacks readiness/retry support. Those are expected old-version controls, not current migration failures. Runtime path relocation and headed launch defaults changed no stored script or assertion.

5. **Reproducibility.** HTML rebuilt byte-identically: 1,615,201 bytes, SHA-256 a4e8a14ddc4d734c036902f56b1a7d7bb8a157a77ef3911b97ea70c76f228c97. The unchanged supplied LF/CRLF simulation passes both variants in tool-created temporary source copies. Two pristine 383-path package reproductions each match the original candidate ZIP exactly: 9b9cd3e9220edbdffbd836154b44d69b5527aa8b0d74300ad546f868a18da78d. The Git-only attribute file is excluded only from that historical package reconstruction, as documented in Stage 6.

6. **Browser/visual review.** Supplied workflows exercise selection/appearance/setup controls, actual point drags, undo/redo/reopen, first person, collision, stories/stairs/floor cuts, rails/exports, sky, fallback and routes. Observed rails include the 62.1 m / 27.21 s plan, 818-frame JSON, frame ZIP/WebM, and a 52.2 s example rail reaching story 1 at 3 m. Stairs reach story 1 at 3.2 m; 2D FALLBACK appears without page errors. Seven actual fresh PNGs were directly inspected: furnished map/shop, upstairs dining, Use Points, full-model contact sheet and both known failures. This combines automated browser interaction and direct image review, not a claim of a human-operated session.

7. **Examples/maps.** All 11 examples open and normalize to format 11. The additional browser check matches independently computed full-bundle/project/asset digests and structure counts for every example, then repeats serialized reopen identically. Stable identities/structure remain intact; supplied metadata tests also retain unknown/custom prop, point, look/setup and library data. All ten full v0.13.1 example maps and the shipped furnished demo remain byte-identical. Separate regeneration retains 69 props, 24 Use Points and 50 unique models; all placement/collision/gameplay/point data and routeNet/stories/stairs/floorCuts/pairs/links compare equal after normalization. Generated appearance IDs/image serialization may differ; no byte-identical regenerated-map claim.

8. **External assets.** Library ZIP SHA-256 4cf39cb712d55e866a593ad12394efec891d5ae3ac14dfd35d932b32bd8b1241 matches; all 2,753 covered entries verify before/after use, with the checksum file itself unchanged. All 327 models load, references resolve and no raw collection enters Git. Stable IDs/coordinate metadata, three palettes, 1,043 surface textures and all 29 unverified vehicle license flags remain preserved. Original library/source packs stay external/read-only; negative fixtures use browser virtual files/provider injection.

9. **Known missing-image defect.** Both independent warning assertions actually fail. Global file checking names the absent canonical palette and texture images; their manifest IDs remain present. Image caches record failed loads, propAppearanceIssues returns [], the embedded base image renders, and adequate object-specific warning/reset guidance is absent. Reopen retains the references and unrelated metadata. This is ROOM_CREATOR_V0141_R1, a known product defect, not a migration regression. No repair, weakening, skip or reclassification.

10. **Migration regressions.** None found within these tests, dependency, reproducibility, example, browser and integrity checks.

11. **Known defects/limitations.** R1 is reproduced. Known coarse/single collision primitives and 12-sided circular approximation, upstairs wall-image overlap, project-local setup calibration, limited conflict UX, absent instancing/LOD/stacking/snapping/multi-selection, unfinished NPC facing/card art and data-only tags/Use Points remain prototype limits. The original intermittent model-readiness root cause remains unknown; injected recovery, actual three-attempt timeout, reconnect protection and generator safety are verified. Long-duration cache/performance, native remembered-directory permissions, other browsers and native Linux/macOS remain outside certification.

12. **Environment/toolchain issues.** No unresolved execution failure. Recorded runtime adapters reconstruct historic absolute paths in disposable layouts without stored source edits. Optional prior-v0.12 comparison is omitted under the runner's supported behavior; the full v0.13.1 preservation source is used. Asset acceptance logs contain six resource-404 messages during negative fixture exercises and no uncaught page errors. All 27 route measurements and flicker metadata match preserved results; its old resource-404 console message is absent in this run. Software-graphics timings remain observations.

13. **New baseline defects.** None discovered within scope.

14. **Generated/repository files.** Disposable candidate/original/reference/library layouts, rebuilt HTML, two reproduced ZIPs, generated demo, logs, screenshots, rail exports and probe results are under C:\Users\mcdon\Documents\ChatGPT\First Encounter Game Archive\stage-7-verification-2026-10-18. A selected 256-file / 755,542,411-byte private evidence index records exact hashes. Bulk remains external. Repository changes are separate Stage 7 records/indexes/small logs/results, exact authorization, a read-only checker, and bounded README/AGENTS/gate/authority/known-defect status updates. No canonical package file changes. Exact Git file list is in private git-completion.json.

15. **Commit.** The dedicated commit containing this report is Stage 7 verification. Full eventual SHA and clean local/remote main confirmation are in the completion response and private git-completion.json; this report cannot embed its own eventual commit hash.

16. **Room Creator canonical identity.** All 383 original baseline files and the separate Git metadata file remain byte-identical, with unchanged membership. Before documentation writes, all 3,228 pre-existing repository files matched pre-test hashes, sizes and modification times.

17. **Encounter/Atlas.** All 2,731 canonical files and its authority entry remain unchanged. Stage 5 acceptance and actual IR3-25 limitation remain intact; Encounter behavior was not rerun or altered in Stage 7.

18. **Originals.** All 6,722 originals and 6,722 preservation copies match hashes/sizes, with original modification times intact. The four excluded original cache files are unchanged. Ninety production/test-code/example paths in the mutable test copy and all 13 preserved independent source files remain byte-exact. The private archive is a same-drive checkpoint.

19. **ZANT/scope.** ZANT is not imported; its placeholder and authority entry remain unchanged. No Stage 8, integration, shared executable contracts, Unity, LFS, legacy repository content/history import, CI or cleanup.

20. **Stage 7 verdict.** PASS WITH HOLD PRESERVED: migration verification succeeded against the held baseline while its known product failure remained visible and reproduced.

21. **Product acceptance.** Room Creator remains HOLD_FOR_FURTHER_REMEDIATION. Migration verification does not accept, promote or repair the product.


22. **Recommended next action, not performed.** Review this result and retained HOLD. Any Stage 8 scope needs explicit new owner authorization. Product promotion needs a separately versioned R1 remediation candidate followed by independent verification, including folder and URL image-failure handling. STOP here; no Stage 8 or repair was performed.

Evidence: [verification manifest](../provenance/room-creator-stage7-verification.json), [selected fresh records](../audits/room-creator/stage7-2026-10-18/), [read-only integrity](../testing/STAGE_7_VERIFICATION.md), and [hard stop](NEXT_STAGE_GATE.md).
