# M3 R3 fresh tests and scope

READY FOR INDEPENDENT M3 RE-REVIEW. See `M3_D03_Remediation_Report.md` for the exact one-predicate production fix, identities, evidence provenance and limits. Independent acceptance is pending; stop at M3.

| Fresh gate | Passed | Failed / skipped |
|---|---:|---:|
| M0 audit | 7 | 0 / 0 |
| Full builder M1/M2/M3/R1/R2/D03 | 137 | 0 / 0 |
| Independent M1 | 22 | 0 / 0 |
| Independent M2 | 18 | 0 / 0 |
| Prior independent M3 | 18 | 0 / 0 |
| Original D01 reproducer | 1 | 0 / 0 |
| Independent R1/D02 rendering | 9 | 0 / 0 |
| Independent R2/D03 rendering | 20 | 0 / 0 |

Focused production-bound display tests pass 25/25. Before-fix evidence intentionally shows the new builder test failing and IR2-20 failing (19 independent passes); the preserved R2 browser control also reproduces false closure. These are historical red controls, not final-suite failures. No inherited behavioral expectation was weakened.

The new test extracts the actual production acknowledgment body and dispatches through the real engine. Collapse, hidden/display, own/ancestor opacity, both axes offscreen, zero/invalid/non-finite geometry, partial clipping, genuine visibility, earned receipt after scrolling, stale/edited binding and completed recovery are covered. Missing notice yields receipt/refusal, service open, no physical closure and exactly one technical defect; identical retries replay without new changes.

Fresh actual browser proof: 18 exported runs, all deterministically replay-valid; 3 raw inspector traces match; 17 check records (1 expected R2 reproduction and 16 passed R3 checks). Cases include all rendering faults, visible/scrolled closure, fresh zero-payment Seed A recovery, repair/save-load and post-recovery protection. Closed and repaired saves reload with exact JSON equality. No console warnings/errors were captured.

Current evidence map:

- `evidence/m3-d03/before-builder-d03.tap`, `before-independent-r2.tap`, `after-focused-display.tap`.
- `evidence/m3-d03/regression/m0-m3/`: fresh M0/build/builder/independent M1/M2 outputs.
- `evidence/m3-d03/regression/prior-m3/`: fresh independent M3/D01 outputs.
- `evidence/m3-d03/regression/r2/`: fresh independent R1/D02 output.
- `evidence/m3-d03/fresh-independent-r2.json`: fresh independent R2/D03 output; unmodified IR2-20 expectation.
- `evidence/m3-d03/regression-source-binding.json`, `executed-commands.json`: exact identical-source execution roots, arguments, environment and exit records.
- `evidence/m3-d03/browser-*.json`, `*-trace.json`, `*-transcript.md`, screenshots/geometry: actual fresh browser artifacts and matching causal evidence.
- `evidence/m3-d03/generated-evidence-summary.json`, `browser-checks.json`: machine-readable outcomes.
- `evidence/m3-d03/production.diff`, `preservation.json`, `original-artifact-preservation.json`: exact production diff and R2 preservation.

Run `python scripts/check-m3-r3.py` for complete gates and evidence validation. The inherited chain runs in a source-identical disposable sibling copy so its legacy generators cannot rewrite historical captures in the delivery. Fresh logs are copied to the dedicated R3 regression folder. Root `evidence/m3`, `m3-d01` and `m3-d02` retain historical captures. The independent R2 runner redirects only evidence output and leaves all test assertions unchanged.

Full regressions retain privacy/local knowledge, authority, repair/warning persistence, money, custody/ownership, exact confirmation, save/load, idempotence, inspector, renaming/portability and host separation. Known limits remain one desktop browser, fallback art/wording, manual bounded saves and no pixel/overlay/accessibility certification. No M4 or future-system expansion.
