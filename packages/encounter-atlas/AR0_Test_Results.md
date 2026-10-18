# AR0 test results

READY FOR INDEPENDENT AR0 REVIEW. The builder has not independently certified Atlas v0.1.

| Final fresh suite | Passed | Failed | Skipped |
|---|---:|---:|---:|
| M0 audit | 7 | 0 | 0 |
| Full builder: 137 inherited + 47 AR0 | 184 | 0 | 0 |
| Independent M1 | 22 | 0 | 0 |
| Independent M2 | 18 | 0 | 0 |
| Prior independent M3 | 18 | 0 | 0 |
| Original independent D01 | 1 | 0 | 0 |
| Independent R1/D02 | 9 | 0 | 0 |
| Independent R2/D03 | 20 | 0 | 0 |
| Independent R3 boundary | 24 | 1 accepted non-blocking IR3-25 | 0 |

The synthetic contradiction remains an explicit failed assertion, with original expectation and evidence. It is not counted as passing, skipped, fixed or a new blocker. No realistic production/browser path was newly demonstrated. Other gates pass. Counts are as reported by overlapping suites, not unique semantic assurances.

New AR0 tests cover identities/case collisions/source binding, renaming, kinds, missing references, metadata-only constraints, shared/global scenario membership, Group support, same-link article/network proof, historical/runtime event causes and ordering, no UI/preview events, exact retries/save/load, owner/custody distinction, actor-local observation/report/belief/hypothesis boundaries, hidden author truth, player-safe names/historical citations, human asymmetry, purity/detachment, recent-change cursors, exact handover, stale/tampered input, broken export endpoints, neutral full ID/prose renaming, host separation, unchanged M3 bytes, distinct command identities despite repeated run labels, and rejection of fabricated unanchored Events.

Fresh browser proof: 18 validated exports, 36 deterministic author/player projections, three matching actual inspector traces and 14 passed check records. Every journal command supports exact retry from its saved run. Repaired and closed saves reload exactly; response playback is pure; zero-payment one-time custody and post-recovery protection pass. Collapse/missing/opacity/ancestor/offscreen all refuse closure correctly.

Current machine-readable results: `evidence/ar0/test-summary.json`, `generated-evidence-summary.json` and `executed-commands.json`. Fresh inherited outputs are under `evidence/ar0/regression/regression/`; independent R2 is `evidence/ar0/regression/fresh-independent-r2.json`; independent R3 is `evidence/ar0/fresh-independent-r3.json`. Legacy material elsewhere remains historical. `regression-source-binding.json` binds the identical execution copy to the final AR0 source digest.

Run `python scripts/check-ar0.py` to repeat the complete gates. See the implementation report for evidence provenance, exact identity, scope and known limitations. No Atlas UI, M4 or host-world feature was added.
