# v0.14.1 remediation verification

Use Python 3.12, Node 24.18 (Node 18+ supported by the inherited data suites), Playwright 1.56.0 and Chrome/Chromium. The recorded run uses Chrome 155 on Windows with software graphics. Install `tests/requirements.txt` in an isolated environment. The canonical library remains external and read-only.

```
python tests/run_tests.py --suite node
python tests/run_tests.py --library "/path/to/Trapstar_RoomCreator_Asset_Library_v1" --browser "/path/to/chrome" --suite all
```

PowerShell: `tests/run_tests.ps1 -Library <folder> -Browser <chrome.exe> -Suite all`.
Bash: `tests/run_asset_tests.sh <folder> quick` or `all`.

The Python runner supplies localhost mounts, Windows-safe file URIs, UTF-8 console output and explicit Chrome ANGLE/SwiftShader flags. It creates no library symlinks and never writes to the library. It applies the launch adapter only to test child processes. `--port`, `--out`, `--scripts` and `--prior-v12` are configurable. The last is optional; the restored final check skips the old-version comparison if it is absent. `RC_PRIOR_V12` also works. Python's Windows async event loop and browser subprocesses must be allowed by the execution environment. Each subprocess is bounded to 900 seconds.

Every run has a new `test_runs/<timestamp>` log directory. `run-index.json` labels assertion suites separately from observational scripts and records the built HTML hash. The inherited scripts additionally write result JSON and pictures under `tests/`; use the run index and logs to identify fresh outcomes. Supplied v0.14 records are historical evidence, not a new pass.

## New assertions

- `remediation_core.test.js`: F1 occupancy/delete/collapse/floor retention, F2 transform compensation, F4 exact polygon-prism intersection, F5 unresolved and valid references/custom metadata.
- `remediation_browser.py`: real F1 mutation/undo/redo/reopen; setup deletion/import with renderer/footprint/world-point checks; actual raised handle drags at several scales, turns and stories; visible repair IDs and field-only reset; injected transient/persistent model failures, explicit retry; project texture-cache cleanup.
- `build_repro.py`: builds from LF and CRLF source copies; exact byte hash equality and no CR bytes in output.

The ten inherited Node suites contain 297 assertions. The asset acceptance suite contains 60 checks, all-model loading covers 327 models, and the demo suite asserts four integration outcomes. The recovered `browser/` scripts and `route/` scripts are primarily observational: read their output and view their images; process exit 0 alone does not certify all behavior. Legacy obsolete selectors remain historical debt. Do not regenerate the route baseline with `route/make_route_scene.cjs`.

`make_asset_demo.py` now uses bounded model readiness, reports individual failures, and defaults to `generated/Route_Prototype_Street_ASSET_DEMO.room.json`. Set `RC_DEMO_OUT` to change the destination. It never overwrites the shipped demo by default. The recovered `browser/make_city.py` also writes generated copies under the run output directory and requires the optional v0.12 input.
