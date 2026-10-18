# Development run provenance

All attempted test logs are retained under `test_runs/`. Final assertion results are in `final-assertions/`; the expanded final browser regressions are in `final-regressions/`.

- `20261018-095609`: initial Node/build checks passed. A test-only sitecustomize import warning appeared without Playwright; the runner now enables that adapter only for browser children.
- `20261018-095658`: interrupted startup with no results. Windows async event-loop startup stalled inside the sandbox. Local browser checks ran successfully outside that boundary. This is not an application pass or failure.
- `20261018-095937` and `20261018-100039`: diagnostic regression attempts. New-setup yaw differed by a full turn while physical pose matched; the comparator was corrected to compare normalized angles. Some raised-point test handles were under the toolbar or outside the canvas; test framing was corrected and a direct screen-follow assertion added. These are not accepted final passes.
- `20261018-100110`: first broad asset pipeline. The initial regression attempt still had the framing issue. The original asset suite caught a new validation typo (`texture` versus the library's `surface_texture`), yielding 59/60. That implementation mistake was corrected and a valid-reference regression was added; final acceptance is 60/60. Its models/demo/perf/screens then completed. Keep these records as development evidence.
- `20261018-100319`: corrected regression framing passed, before the final caller-deadline check was added.
- `20261018-100216`: restored preservation, route and demo-generation pipeline. Early object-free preservation scripts began before the final prop-only reference validation fix; later final/demo/route checks used the final runtime. There were no legacy source changes between those revisions. Some HTTP observation logs include a missing favicon console 404; the portable runner now returns 204 for favicon requests. JavaScript page errors are checked separately.

Timing runs shared a software-rendered machine. Do not interpret their numbers as controlled cross-version benchmarks. Current pass counts come only from the final assertion logs and their recorded HTML hash; preserved supplied v0.14 results are historical records.
