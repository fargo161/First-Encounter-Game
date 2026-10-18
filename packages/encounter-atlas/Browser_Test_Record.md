# M3 actual browser test record

The self-contained M3 build ran through `scripts/serve-m3.py` on loopback in the desktop in-app browser. Tests used rendered controls for composition, physical actions, partner changes, exact confirmation, phases, inspector, replay/skip and save/load. Complete Save run JSON was read in validated chunks from the UI; it was not synthesized from engine fixtures. The actual downloaded closed-run JSON was compared with the complete dialog export.

`evidence/m3/browser-checks.json` has 19 passed records for 18 distinct groups; the second B18 is explicitly a repeat. `browser-console.json` has no captured warnings/errors. This is not cross-browser, mobile or accessibility certification.

| Groups | Actual result |
| --- | --- |
| B01–02 | Nine draft variants leave complete initial run equal. Physical ticket verification and protected request have distinct Intake/Delivery, with no automatic inspection. `browser-permission-only.json`. |
| B03–04 | Ordinary money refused without fee/transfer; real inspect/search produce learned evidence; Orrin retains limited unidentified report. Partial/evidence-ready saves. |
| B05–07 | Comparison produces exact zero-payment terms; conversational Yes does not execute; separate correction preserves original; exact confirmation changes unique custody once, owner Nera, no spending or human belief. Pending/recovery saves. |
| B08 | Inspector/refresh/replay/skip leave complete recovered export equal; raw inspector matches reconstructed trace. |
| B09–10 | Same-observer later pattern produces restriction/alternative/warning. Why, End/reopen, partner changes and vague apology preserve authority and unused repair. Restricted/before-repair saves. |
| B11–12 | Substantive case-only acceptance repairs; reload is equal; actual comparison/correction/exact handover completes restored route with warning/history retained. Repaired/repaired-recovery saves. |
| B13–14 | Case-only/Why drafts have no notice; edits/abandonment leave full state equal. Later whole-file demand has displayed consequence before Send anyway and commits one closure result. Closure save, inspector and preview image. |
| B15–17 | Closed reload equal; legacy import visibly refused without mutation; actual download equals closed export. |
| B18 | Later protected demand cannot preview closure or undo completed repaired recovery. Post-recovery save. Repeated once. |

All save names refer to `runs/browser-*.json`. All 11 final actual exports pass schema/package validation and complete journal replay against final source. Matching `transcripts/` and `traces/` retain source/package and run hashes. Recovery/closure raw UI inspector JSON matches the complete reconstructed diagnostic object, not selected fields only.

Final representative images under `evidence/m3/`: `browser-final.jpg`/`browser-recovered.jpg` show successful recovery; `browser-closure-preview.jpg` shows the visible consequence before Send; `browser-closed.jpg` shows service closed without recovery. These representative captures were taken after painting, with save dialogs closed. Other intermediate screenshots may show dialogs as part of the workflow; complete-state exports are the primary evidence.

The missing-display and neutral-renaming cases are explicitly engine harness runs, not browser clickthroughs. Initially truncated JSON captures were replaced using chunked reads and complete validation. A browser automation interruption was recovered before final routes were rerun; critical final paths use the final source/build identity.
