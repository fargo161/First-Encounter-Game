# Repository working rules

Current authorized scope: Stage 10 package-duplication reduction, completed. STOP before Stage 11.

- Read docs/consolidation/STAGE_10_CLEANUP.md, docs/provenance/stage10-cleanup-manifest.json, docs/provenance/source-authority.json and docs/consolidation/NEXT_STAGE_GATE.md.
- Current verdict: PASS WITH RETAINED NECESSARY DUPLICATION. Only 271 listed duplicate outputs under packages/encounter-atlas/evidence/atlas-a1/inherited/ were removed. All other retained pre-existing files remain byte-identical except bounded cleanup/status metadata.
- A1 current tree 2460 files; original 2731-file identity is historical and reconstructible from retained byte copies. Keep all 132 execution inputs and all 2310 required AR0 R1 members. Six UI save imports, proofs and all source/tests/scripts remain.
- Preserve48 unique inherited run records, all required historical archives, all 384 Room Creator files and all 166 ZANT packet files. Identical bytes alone do not prove a safe removal.
- No subsystem build/test/verifier script was rewritten for cleanup. Earlier full-snapshot verifiers remain unchanged for their historical Git state; use tools/verify_stage10_cleanup.py for the current exact curated projection and preservation bindings.
- All subsystem authority entries, known-defects.json and STATUS_INTERPRETATION.md are unchanged. IR3-25 remains an actual accepted nonblocking failure; Room Creator retains HOLD_FOR_FURTHER_REMEDIATION.
- ZANT R4/A25/A16 remain accepted; A10 failed; A06/A14 unaccepted; G wrist/interface provisional; Gate A incomplete. Keep14 unauthored slots, zero reserves and222 unrun valid/17 unrun production-negative cases.
- External archive files are untouched. Stage 10 outputs are outside the archive under the verification root recorded in the manifest. Never remove original/archive copies under this scope.
- No Stage 11, remediation, art authoring, interface revision, shared contracts, integration, Unity, LFS, history rewriting, unrelated docs cleanup or refactoring is authorized.
- Older Trapstar Git repositories remain non-authoritative and unused. Later explicit owner authorization governs its stated scope.
