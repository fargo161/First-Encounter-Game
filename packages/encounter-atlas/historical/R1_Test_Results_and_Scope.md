# M3 R1 fresh results and scope

READY FOR INDEPENDENT M3 RE-REVIEW. See `M3_D01_Remediation_Report.md` for the exact fix, identities, before/after evidence and limitations. The old checkpoint's independent NOT READY verdict is preserved, not rewritten.

| Fresh suite | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| M0 baseline audit | 7 | 0 | 0 |
| Builder tests: 112 inherited + 5 new D01 cases | 117 | 0 | 0 |
| Unchanged independent M1 | 22 | 0 | 0 |
| Unchanged independent M2 | 18 | 0 | 0 |
| Independent M3, explicit new identity binding only | 18 | 0 | 0 |
| Unchanged independent M3-D01 reproducer | 1 | 0 | 0 |

Fresh browser evidence has one expected before-fix failure reproduction and seven passed after-fix checks, with ten complete exports replay-validated. Normal visible closure, transparent fallback, offscreen fallback, fresh recovery/repair/save-load and post-recovery protection all ran through actual UI controls. No loop iterations/retries/repeated tests are counted as additional distinct cases.

Run `python scripts/check-m3-r1.py` for the complete suite. Existing `scripts/check-m3.py` remains unchanged and includes the new builder test file in its wildcard. Additional independent M3 and D01 commands plus the fresh browser-evidence validator and preservation run are orchestrated by the R1 helper. No npm installation is needed.

Evidence locations:

- `evidence/m3/fresh-builder-tests.tap`, `fresh-independent-m1.tap`, `fresh-independent-m2.tap`, `fresh-m0-audit.txt`: fresh inherited/full builder results.
- `evidence/m3-d01/fresh-*.txt`, `executed-commands.json`: new complete orchestration with exact commands/stdout/stderr/exits.
- `evidence/m3-d01/before-independent-d01.tap`, `before-builder-d01.tap`: verified red reproductions, followed by final green outputs.
- `evidence/m3-d01/generated-evidence-summary.json`: exact source/build/package identity, current before/after outcomes and validated save/trace records.
- `evidence/m3-d01/preservation.json`: previous-M3 comparison; `evidence/m3/preservation.json`: unchanged M2 baseline comparison.
- `independent/m3-review/`: original review/evidence/test files. Identity-only adaptation is documented in the remediation report and executable wrapper.

The earlier LC-target mapping, 48 original M3 tests and independent assertions remain intact. The fix adds five actual production-display-boundary tests without changing engine rules. This preserves the already-tested privacy, repair, custody/ownership, money, save/load, inspector, portability and host boundaries. Fresh renaming and all old behavioral assertions run again; no M4 requirement is introduced.

Limits: one desktop in-app browser; no cross-browser/mobile/accessibility certification; no exhaustive occlusion/pixel-readability guarantee; manual bounded saves and fallback art/wording. Stop at M3 for independent re-review.
