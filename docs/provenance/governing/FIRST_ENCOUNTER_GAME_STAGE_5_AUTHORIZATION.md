# First Encounter Game — Stage 5 Authorization: Encounter/Atlas Verification Only

You are authorized to proceed with **Stage 5 only** of the approved GitHub consolidation plan.

## Scope

Verify the imported **Encounter/Atlas A1 baseline** currently in the private `First-Encounter-Game` repository.

Use the Stage 4 import manifest, preserved source fingerprints, accepted checkpoint evidence, and existing testing documentation as the verification basis.

## Requirements

Perform verification in **disposable working copies / temporary output locations** where needed.

At minimum:

- run the supplied Encounter/Atlas test suites required by the accepted A1 baseline
- run the preserved independent/adversarial verification material
- rebuild the relevant A1 / M3 outputs where the existing workflow supports it
- compare rebuilt outputs, proofs, manifests, and fingerprints against the preserved accepted baseline
- verify required saved-run / evidence dependencies still resolve correctly
- preserve and explicitly report the known historical **IR3-25** treatment rather than “fixing” it
- perform the documented developer/player privacy, source/disclosure, and read-purity checks
- distinguish:
  - migration regressions
  - known pre-existing limitations
  - environment/toolchain failures
  - newly discovered defects

## Hard Constraints

Do **not**:

- modify the imported Encounter/Atlas baseline
- modify the original preserved source trees
- refactor, normalize, rename, or clean up source
- repair IR3-25 or other known issues
- import Room Creator
- import ZANT
- begin Stage 6
- implement shared contracts
- initialize Unity
- add Git LFS
- alter repository structure beyond verification artifacts/documentation needed for Stage 5
- claim acceptance if verification does not support it

If verification requires temporary layouts, copied fixtures, generated evidence, browser runs, or reconstructed sibling paths, keep those disposable and clearly separate from canonical imported source.

## Git Discipline

Prefer **no source commit** unless Stage 5 legitimately adds verification documentation/evidence that belongs in the repository.

If repository-tracked verification records are added:

- keep them clearly separate from canonical source
- do not alter source bytes
- commit them in a dedicated Stage 5 verification commit
- push only after all Stage 5 checks are complete

## Hard Stop

After Stage 5 verification is complete:

**STOP. Do not begin Stage 6 or any Room Creator import.**

Report back with:

1. Exact baseline verified
2. Toolchain/environment used
3. Supplied test results
4. Independent/adversarial test results
5. Rebuild/reproducibility results
6. Browser/manual verification results
7. Privacy/source/read-purity verification results
8. IR3-25 result and treatment
9. Any migration regressions found
10. Any known limitations reproduced
11. Any environment/toolchain failures
12. Any newly discovered defects
13. Files generated or repository files changed
14. Commit SHA if a Stage 5 verification commit was created
15. Confirmation that canonical imported source remains byte-identical
16. Confirmation that originals remain untouched
17. Confirmation that Room Creator and ZANT were not imported
18. Clear Stage 5 verdict:
   - PASS
   - PASS WITH DOCUMENTED KNOWN LIMITATIONS
   - HOLD
   - FAIL
19. Recommended next action, but do not perform it

This authorization is for **Stage 5 only**. Wait for explicit user approval before proceeding to Stage 6.
