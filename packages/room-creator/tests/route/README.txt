Route-walk prototype tests (0.13.1). They use Playwright + headless Chromium. Since 0.14 the .py scripts find the
package folder themselves (two levels up) and write screenshots/results to tests/route/out/.
make_route_scene.cjs still carries absolute 0.13 workspace paths ON PURPOSE: it regenerates the baseline map
examples/Route_Prototype_Street.room.json, which must stay byte-identical — do not re-run it on this package.

make_route_scene.cjs  rebuilds examples/Route_Prototype_Street.room.json from City_Block_Rail_Demo (node).
route_smoke.py        loads the scene, starts the route walk, walks, looks, screenshots.
route_keys.py         drives every key (W/S/A/D, arrows, R, C, Tab, E, Space, 1, 3, Esc) and checks the result,
                      including that leaving restores the door and adds nothing to Undo.
route_perf.py         time for one simulation step and for one drawn frame (after warm-up).
route_eval.py         the scripted evaluation behind PROTOTYPE_FINDINGS.md: five seeded scenarios, settings
                      sweeps, a flicker test of the picture picker, and the screenshots.
