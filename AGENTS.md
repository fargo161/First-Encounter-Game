# Repository working rules

Stage 11 repository orchestration is the current authorized scope. Stop before Stage 12.

- Read DEVELOPMENT.md, docs/provenance/source-authority.json, docs/consolidation/STAGE_11_READINESS.md and docs/consolidation/NEXT_STAGE_GATE.md.
- Use python -B tools/repo.py doctor, integrity, or a package target from the root. Never run package build/test writers against canonical packages; wrappers create disposable copies.
- Preserve every canonical package file. A1 has 2460 files, 132 execution inputs, 2310 AR0 R1 members and six required saved-run imports. Room Creator has 383 baseline files plus Git metadata. ZANT is an exact 166-file packet; no bytecode/outputs inside it.
- Keep all 271 Stage 10 removals absent, retained duplicate bindings intact, 48 unique inherited run records and required archives.
- Preserve subsystem authority entries, known-defects.json, STATUS_INTERPRETATION.md and source-fingerprints.json. IR3-25 remains one actual accepted failure; Room Creator remains HOLD_FOR_FURTHER_REMEDIATION.
- ZANT R4/A25/A16 remain accepted; A10 failed; A06/A14 unaccepted; G interface provisional; Gate A incomplete, 14 unauthored slots, zero reserves, 222 unrun valid and 17 unrun production-negative cases.
- Historical verifiers remain byte-identical and belong to recorded Git states. Current repository_integrity.py uses frozen Stage 10 hash helpers and exact package checks with the Stage 11 pointer.
- Normal checks need no archive. Original absolute paths are archival provenance only; optional library identity uses an explicit CLI path or FIRST_ENCOUNTER_ROOM_LIBRARY_ZIP. Never mutate originals/archives.
- No Stage 12 contracts, remediation, art authoring, interface revision, integration, Unity, LFS, history rewriting or unrelated refactor is authorized.
- Older Trapstar repositories are non-authoritative and unused. Later explicit owner authorization governs only its stated scope.
