# v0.14.1 test report

Final runtime: 1,615,201 bytes; SHA256 `a4e8a14ddc4d734c036902f56b1a7d7bb8a157a77ef3911b97ea70c76f228c97`.

| Assertion coverage | Result | Fresh evidence |
|---|---|---|
| Ten inherited Node suites | 297 assertions pass | `test_runs/final-assertions/*.test.js.log` |
| New core regressions | 11 cases pass | `test_runs/final-assertions/remediation_core.test.js.log` |
| New browser regressions | 45 checks pass; zero page errors | `test_runs/final-regressions/` and `remediation_browser_results.json` |
| Original Asset Browser acceptance | 60 passed, 0 failed | `test_runs/final-assertions/assets_browser.py.log` and `assets_browser_results.json` |
| Entire model library | 327/327 ready | `test_runs/final-assertions/assets_all_models.py.log` and `assets_all_models_results.json` |
| Furnished demo integration | 4/4 pass | `test_runs/final-assertions/assets_demo_checks.py.log` and `assets_demo_checks_results.json` |
| Build byte portability | LF-source and CRLF-source rebuilds produce the exact final hash; no CR bytes | `test_runs/final-assertions/build_repro.py.log` |
| Input/library preservation | 168/168 original candidate files and 2,753/2,753 canonical library files unchanged | `preservation-seal.json` |
| Shipped maps | Baseline and furnished demo byte-identical to v0.14 | `preservation-seal.json` |
| Regenerated demo | 69 props / 50 unique models ready, no load failures or page errors; preserved navigation and matching placement/collision/gameplay | `demo-regeneration-verification.json` and generation log |

The generated demo is a separate file under `generated/`; it does not replace either shipped map. Palette IDs/PNG serialization can differ on regeneration, so byte-identical regenerated JSON is not claimed.

Nine restored preservation scripts completed: UI smoke, both first-person scripts, sky, both rail scripts, story construction, stair-rail check and final examples/roundtrip/fallback check. The latter opens all 11 examples, confirms format-10 migration to 11, confirms a normalized rail-demo roundtrip, and samples a 52.2-second rail reaching story 1 at 3 m. Rail scripts create JSON/frames ZIP/WebM exports. These are mostly observational scripts: printed behavior, exports and screenshots were reviewed; their exit codes are not treated as a new blanket assertion count.

Route smoke, real-key controls, performance and evaluation completed. The same 27 measured scenarios report 190 spawns and 193 despawns; in-view spawn/despawn, car in-view despawn, node-conflict and same-direction-overtake counters remain zero. All numerical route scenario data matches the audit reference. See `route-comparison.json` and `route_eval_results.json`. A log middle-dot encoding and HTTP favicon console message differ from the earlier audit text. The runner now handles favicon requests explicitly. This does not establish general gameplay navigation or resolve unfinished NPC-facing art.

Fresh screenshots retain the furnished shop/stockroom/street and upper-story inspection views. The shop-counter image was visually reviewed; existing story-wall overlap and residential-demonstration limitations remain. Broader asset/performance/vehicle-front image scripts completed under `test_runs/20261018-100110/`; their timings are observations on shared software graphics without a comprehensive pass threshold.

Environment: Windows 11, Python 3.12.0, Node 24.18.0, Playwright 1.56.0, Chrome 155.0.8059.41, ANGLE SwiftShader. Native Linux/macOS browser/build execution was not performed. The platform-independent byte writer and explicit LF/CRLF simulation remove the reproduced Windows output difference, without claiming a native multi-OS certification.

Development failures, retries and mixed-revision observational provenance are retained in `DEVELOPMENT_ATTEMPTS.md`. Final assertion runs record the runtime hash above. No unresolved scene-integrity failure remains in these builder reproductions; independent tester review and canonical promotion remain outstanding.
