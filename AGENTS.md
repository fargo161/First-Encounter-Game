# Repository working rules

Current authorized scope: Stage 5 Encounter/Atlas verification, completed with documented known limitations. STOP before Stage 6.

- Read docs/provenance/source-authority.json, docs/consolidation/STAGE_5_VERIFICATION.md and docs/consolidation/NEXT_STAGE_GATE.md.
- The 2,731-file accepted A1 package under packages/encounter-atlas remains byte-identical to its preserved source. Do not normalize, refactor, rename, edit validators/tests, alter behavior or fix historical issues.
- Stage 5 tests, builds, generated proofs and browser runs were performed in external disposable copies only. Keep original sources and canonical package untouched.
- No Room Creator or ZANT import, shared-contract implementation, Unity setup, LFS conversion, source-dependent CI, or archive cleanup/deletion is authorized.
- Later explicit user authorization governs its stated scope; do not reopen settled decisions without a concrete blocker.
- Older Trapstar repositories are non-authoritative. No fork, merge, history import or recovery without a specific justified current need and appropriate authorization.
- Keep builder claims, independent findings, byte integrity and owner acceptance distinct. Stage 5 verifies migration behavior; it does not authorize new features or other subsystem promotion.
- IR3-25 remains an actual failing test, accepted historically as non-blocking: 24 pass, 1 fail, 0 skipped. Never remove, weaken, skip or silently count it as passing.
- Eight package ZIP fixtures are selected for unchanged preservation checks; other large or restricted archives remain external.
- Use tools/verify_stage5_evidence.py for read-only current source/evidence integrity. Foundation and Stage 4 verifiers remain unchanged and require their historical repository states.
- Room Creator remains HOLD. ZANT accepted R4 candidate02 and failed/provisional R5 remain distinct.
- Preserve originals, archive bytes and historical metadata conflicts. Encounter owns interaction contracts; preserve subsystem boundaries.
