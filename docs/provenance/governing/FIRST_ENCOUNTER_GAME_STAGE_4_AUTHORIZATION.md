# First Encounter Game — Stage 4 Authorization: Encounter/Atlas Import Only

You are authorized to proceed with **Stage 4 only** of the approved GitHub consolidation plan.

## Scope

Import the approved current **Encounter/Atlas** source baseline into the existing private `First-Encounter-Game` repository.

Use the previously established authority/provenance manifest and preservation records as the source of truth.

## Requirements

- Import **Encounter/Atlas only**
- Preserve the accepted Atlas A1 / Encounter baseline exactly as documented
- Preserve existing source structure, contracts, tests, fixtures, required evidence dependencies, and provenance needed for later verification
- Do not refactor, normalize, rename for style, consolidate validators, alter behavior, or “clean up” implementation debt
- Do not modify the original source trees
- Do not import Room Creator or ZANT
- Do not begin shared-contract implementation
- Do not initialize Unity
- Do not add Git LFS
- Do not perform Stage 5 verification beyond basic checks necessary to confirm the import completed intact
- Keep known historical/non-blocking issues documented rather than silently fixing them

Commit and push the Stage 4 import to `main` once the imported files have been checked against the authority manifest and source fingerprints.

## Hard Stop

After the Encounter/Atlas import is complete:

**STOP. Do not begin Stage 5.**

Report back with:

1. Exact Encounter/Atlas source baseline imported
2. Files/directories added or changed
3. Commit SHA and message
4. Confirmation that local and remote `main` match
5. Hash/fingerprint comparison against the preserved source
6. Any path or packaging adjustments required during import
7. Any discrepancies, warnings, missing dependencies, or unexpected files
8. Confirmation that no source behavior was intentionally changed
9. Confirmation that Room Creator and ZANT were not imported
10. Confirmation that originals remain untouched
11. Recommended Stage 5 verification scope, but do not perform it

This authorization is for **Stage 4 only**. Wait for explicit user approval before proceeding to Stage 5.
