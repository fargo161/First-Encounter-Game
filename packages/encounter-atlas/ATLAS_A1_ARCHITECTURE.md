# A1 architecture and read-only boundary

Atlas source: `Atlas-A1-person-source-v1`, SHA-256 `1a8558b3654e52881a288d2a5ab99e574878531f7a9d5fca86223e511146f085` (132 enumerated source/content/test/tool/fixture/launcher inputs).

Runnable Atlas HTML SHA-256: `b9612d61f41bcf2bee5085902ff65c5e418b226de3dd5c8af6490ccd15e4ae9f` (1,039,524 bytes).

Authoritative dependency: `AR0-projection-v1-R1-D01`; source digest `8dd542efed9f74573bcb1913d367f7c791d63c3830d65b7f35f68abdcb92f09c`; frozen R1 ZIP `f5566fdcfa82dc8aaee9378d7a0e894f10a4a2342100b7665cbd1c23e26e72da`. Accepted M3 R3 gameplay remains unchanged; runnable M3 HTML `8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb`. Package `package_0003` revision 1, digest `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f`. Catalog SHA-256 `21a0747936c3e8e7e9cf33833348ff6eb7b07a183179ce1e21181d618c854c5b`.

The six new browser modules have one responsibility each: adapter validates and projects; person-view translates typed Person records; render escapes and presents the model; UI handles inspection selection/opening; shell and CSS supply layout. Build bundles unchanged Encounter/AR0 modules and actual saves into a single local HTML page. No external runtime requests or dependencies exist.

Canonical dependency code/content/tests are preserved byte for byte. No policy, knowledge, physical resolution, warning/repair/closure or save contract is reimplemented. The adapter's public methods are model and integrity; existing command functions remain internal to the original replay validator and are never exposed as UI actions. Sources are derived on each open, never stored as mutable gameplay truth. Browser DOM is presentation only.

Full developer source records are separate from actor-local received fragments. Player view does not receive an author inspector; it resolves only filtered message labels, received fragments and opaque citations. Catalog aliases resolve typed identity references after AR0 R1 validation. Same names are only a disambiguation concern, never a merge rule.

Integrity hashes the complete canonical saved-run input and companion catalog, checks that the replayed run still exactly equals the input, and reports exact content identity. Node tests compare full external input before/after as well. No local/session storage, IndexedDB, service worker, write endpoint or automatic repair exists. The Python host supports only the known HTML GET paths; other files are not served and no mutation handler exists.
