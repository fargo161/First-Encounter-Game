# M3 R2 fresh tests and scope

READY FOR INDEPENDENT M3 RE-REVIEW. See `M3_D02_Remediation_Report.md` for identities, exact production diff, browser outcomes, adapters and limitations. Historical R1 NOT READY evidence is preserved, not rewritten.

Fresh results: M0 7 passed; all builder tests 136 passed (117 inherited + 19 new geometry cases); independent M1 22; independent M2 18; prior independent M3 18; independent M3-D01 1; independent R1 rendering/M3-D02 9. All have zero failures/skips.

All required invalid-display classes are production-bound and dispatched through the real engine, asserting open service, normal refusal, no close/extra physical result and exactly one MISSING_CLOSURE_PREVIEW. Visible closure/retry, an earned receipt after scrolling, stale/edited binding and post-recovery protection remain covered. The corrected before-fix reproductions have seven builder geometry failures and two independent D02 failures; these are historical red evidence, not final-suite failures.

Fresh browser records: 2 expected R1 defect reproductions + 11 passed R2 checks. All 14 actual UI exports replay-validate; 4 raw actual inspector exports match. Required transparent/ancestor-transparent, vertical/horizontal offscreen, zero-width, visible closure, scroll, fresh recovery/repair/save-load and post-recovery paths were executed through controls.

Run `python scripts/check-m3-r2.py` for the complete suite. It retains the prior helpers and assertions, adds independent rendering checks with measured viewport width supplied to their DOM fixture, then validates current browser evidence and preservation. No test is skipped. Exact arguments, roots, stdout/stderr and exits are in `evidence/m3-d02/executed-commands.json` and nested original command records.

Evidence:

- `evidence/m3/fresh-builder-tests.tap`, `fresh-independent-m1.tap`, `fresh-independent-m2.tap`, `fresh-m0-audit.txt`.
- `evidence/m3-d01/fresh-independent-m3.txt`, `fresh-independent-d01.txt`: current executions of prior independent assertions.
- `evidence/m3-d02/fresh-independent-d02.json`, `before-independent-d02.tap`, `before-builder-d02.tap`, `after-focused-display.tap`.
- `evidence/m3-d02/generated-evidence-summary.json`, `browser-*.json`, matching traces/transcripts/geometry/screenshots.
- `evidence/m3-d02/preservation.json`, `production.diff`: exact R1 comparison and enforced test-fixture-only adaptation.
- `independent/m3-r1-review/`: unmodified supplied re-review material, including original before-fix evidence.

Earlier LC-target assertions/behavioral tests remain intact. Authored content, engine/policy/knowledge/contracts and host separation are unchanged. Known limits: one desktop browser, no pixel/overlay/accessibility certification, fallback art/wording and manual bounded saves. No M4 or future-system implementation.
