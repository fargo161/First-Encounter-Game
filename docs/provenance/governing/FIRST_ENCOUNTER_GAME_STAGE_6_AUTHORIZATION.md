# First Encounter Game — Stage 6 Authorization: Room Creator Import Only

You are authorized to proceed with **Stage 6 only** of the approved GitHub consolidation plan.

## Scope

Import the approved current **Room Creator** development baseline into the existing private `First-Encounter-Game` repository.

Use the established authority/provenance manifest, Room Creator audit material, independent tester findings, preservation records, and current source fingerprints as the source of truth.

## Required Baseline Treatment

Import the currently documented Room Creator baseline while preserving its real status:

- **Room Creator v0.14.1 development baseline**
- Status remains **HOLD**
- Carry forward the documented missing-image / appearance-repair defect
- Do not present the imported baseline as accepted, promoted, or fully verified
- Preserve the full implementation and authored examples required for later Stage 7 verification

## Requirements

- Import **Room Creator only**
- Preserve the selected source, tests, examples, documentation, format/data contracts, handoff material, and required fixtures
- Preserve stable asset IDs, unknown metadata behavior, project-local appearance/setup data, coordinate conventions, and other documented format requirements
- Preserve the relationship to the external Room Creator asset library through manifests/hashes/provenance rather than indiscriminately importing large or restricted asset collections
- Preserve the current HOLD status and known defect records in repository documentation
- Keep the imported baseline byte-identical where the authority manifest defines exact preserved source
- Do not repair the known defect during import
- Do not normalize, refactor, rename for style, redesign, or alter behavior
- Do not modify the original Room Creator source trees
- Do not import ZANT
- Do not alter Encounter/Atlas except for bounded repository-level documentation/status references if genuinely required
- Do not implement Encounter ↔ Room Creator integration yet
- Do not implement shared contracts
- Do not initialize Unity
- Do not add Git LFS
- Do not begin Stage 7 verification beyond basic integrity checks necessary to confirm the import completed correctly

## Git Discipline

Commit and push the Stage 6 Room Creator import to `main` only after:

- the imported file set has been checked against the authority manifest
- source fingerprints/hashes have been compared
- the Room Creator HOLD status remains explicit
- no unintended Encounter/Atlas changes are present

Use a dedicated Stage 6 import commit.

## Hard Stop

After the Room Creator import is complete:

**STOP. Do not begin Stage 7.**

Report back with:

1. Exact Room Creator baseline imported
2. Current acceptance/status label carried into the repository
3. Known defect(s) carried forward
4. Files/directories added or changed
5. Commit SHA and message
6. Confirmation that local and remote `main` match
7. Hash/fingerprint comparison against the preserved Room Creator source
8. Asset-library handling and any external dependency references
9. Any path or packaging adjustments required during import
10. Any discrepancies, warnings, missing dependencies, or unexpected files
11. Confirmation that no Room Creator behavior was intentionally changed
12. Confirmation that the known HOLD defect was not repaired during import
13. Confirmation that Encounter/Atlas canonical source was not modified
14. Confirmation that ZANT was not imported
15. Confirmation that originals remain untouched
16. Recommended Stage 7 verification scope, but do not perform it

This authorization is for **Stage 6 only**. Wait for explicit user approval before proceeding to Stage 7.
