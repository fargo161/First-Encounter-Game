# Repository working rules

Current authorized scope: Stage 6 Room Creator import only. STOP before Stage 7.

- Read docs/provenance/source-authority.json, docs/consolidation/STAGE_6_IMPORT.md and docs/consolidation/NEXT_STAGE_GATE.md.

- Room Creator v0.14.1 remains HOLD_FOR_FURTHER_REMEDIATION. The manifest-known/missing-image appearance-repair defect remains unrepaired. Import does not promote or accept the baseline.
- All 383 Room Creator baseline files remain byte-identical. tests/.gitattributes is additional Git-only packaging metadata preserving two CRLF test scripts; the original package .gitattributes remains unchanged.
- Canonical Encounter/Atlas remains the unchanged accepted A1 snapshot, with Stage 5 PASS WITH DOCUMENTED KNOWN LIMITATIONS. IR3-25 stays an actual accepted non-blocking failure: 24 pass, 1 fail, 0 skipped.
- Stage 6 allows import membership/hash/ZIP/manifest/Git checks only. Do not run source, tests, builds, generators, launchers or browser checks until Stage 7 is explicitly authorized.
- All preserved builder/independent reports and scripts retain their historical bytes. Claims inside them are not fresh results or authority to execute. Reconstruct disposable verification layouts for later authorized stages.
- Preserve unknown metadata behavior, stable asset IDs, project-local appearance/setup data, format 11 and coordinate conventions; do not normalize, refactor, redesign or repair source during import.
- Keep the full Room Creator asset library and original source packs external/read-only; only selected metadata is in assets/manifests/. Preserve project-embedded example data.
- No ZANT import, Encounter/Room Creator integration, shared-contract implementation, Unity, LFS, source-dependent CI, or archive cleanup/deletion is authorized.
- Older Trapstar repositories are non-authoritative. No fork, merge, history import or recovery without a specific justified current need and appropriate authorization.
- Later explicit owner authorization governs its stated scope. Keep file integrity, builder claims, independent findings and owner acceptance distinct.
- Use tools/verify_stage6_import.py for current read-only import integrity. Earlier verifiers remain unchanged for their historical states.
- Preserve all originals, archive bytes, historical metadata conflicts and subsystem boundaries. Encounter governs interaction contracts.
