# Repository working rules

Current authorized scope: Stage 4 Encounter/Atlas import only. Stop before Stage 5.

- Read docs/provenance/source-authority.json and docs/consolidation/NEXT_STAGE_GATE.md.
- The full accepted A1 package under packages/encounter-atlas is byte-identical to the preserved source. Do not normalize, refactor, rename, edit validators/tests, alter behavior or fix historical issues as part of import.
- Stage 4 allows basic import membership/hash/fingerprint/Git checks only. Do not run subsystem builds, tests, evidence generators, launchers or browser verification until Stage 5 is explicitly authorized.
- No Room Creator or ZANT import, shared-contract implementation, Unity setup, LFS conversion, source-dependent CI, or archive cleanup/deletion is authorized.
- Later explicit user authorization governs its stated scope; do not reopen settled decisions without a concrete blocker.
- Older Trapstar repositories are non-authoritative. No fork, merge, history import or recovery without a specific justified current need and appropriate authorization.
- Keep builder claims, independent findings, byte integrity and owner acceptance distinct. Prior A1 acceptance does not substitute for Stage 5 migration verification.
- Preserve originals and archive bytes. Keep IR3-25 and historical metadata conflicts disclosed.
- Eight package ZIP fixtures are specifically selected for unchanged preservation checks; other large or restricted archives remain external.
- The historical foundation verifier certifies the Stage 0-3 commit only. Use tools/verify_stage4_import.py for current basic byte integrity.
- Encounter owns interaction contracts; preserve subsystem boundaries.
