# First Encounter Game — Stage 7 Authorization: Room Creator Verification Only

You are authorized to proceed with **Stage 7 only** of the approved GitHub consolidation plan.

## Scope

Verify the imported **Room Creator v0.14.1** baseline currently in the private `First-Encounter-Game` repository.

The imported baseline must remain classified as:

**HOLD_FOR_FURTHER_REMEDIATION**

unless fresh Stage 7 evidence clearly supports a different conclusion. Do not promote the build merely because migration verification succeeds.

Use the Stage 6 import manifest, preserved source/checkpoint fingerprints, prior independent audit material, current Room Creator tests, examples, external asset-library manifests, and `STAGE_7_RECOMMENDED_SCOPE.md` as the verification basis.

## Requirements

Perform verification in **disposable working copies / temporary output locations** wherever execution or generated output is required.

At minimum:

- run the supplied Room Creator test suites
- run the preserved independent/adversarial checks relevant to v0.14.1
- reproduce the documented build/package where supported
- compare rebuilt outputs, manifests, hashes, and preserved examples against the imported baseline
- verify representative authored maps/examples load and preserve expected structure
- verify documented stories, routes, stairs, rails, Use Points, collision, appearance/setup data, transforms, and other accepted v0.14.1 behaviors covered by existing tests/evidence
- verify format 11 preservation behavior, including stable IDs and unknown metadata where already specified
- verify external asset-library references resolve according to the preserved manifests/hashes without importing the full library into Git
- explicitly reproduce and examine the known missing-image / appearance-repair defect
- distinguish:
  - migration regressions
  - known pre-existing defects
  - environment/toolchain failures
  - newly discovered defects
  - limitations not covered by the current product scope

## Known Defect Treatment

The existing Room Creator defect must not be silently repaired, weakened, skipped, or reclassified.

Specifically preserve and verify the current issue where a palette/texture ID may exist in the manifest while the underlying image file is missing, and the object's appearance resolver/inspector falls back without adequate object-specific repair guidance/control.

If fresh verification confirms this issue, report it as a **known product defect**, not a migration regression.

If fresh verification shows the defect behaves differently than previously documented, report the discrepancy clearly.

## Hard Constraints

Do **not**:

- modify the imported canonical Room Creator baseline
- modify original preserved Room Creator source trees
- repair the known defect
- refactor, normalize, rename, redesign, or clean up source
- alter Encounter/Atlas canonical source
- import ZANT
- begin Stage 8
- implement Encounter ↔ Room Creator integration
- implement shared contracts
- initialize Unity
- add Git LFS
- ingest the full external asset library into Git
- alter product acceptance status without explicit evidence

Generated builds, browser evidence, screenshots, temporary reconstructed package layouts, or test output must remain separate from canonical source unless a bounded verification record belongs in repository documentation.

## Git Discipline

Prefer no canonical-source changes.

If Stage 7 adds verification/status documentation or small evidence indexes to the repository:

- keep them clearly separate from source
- do not alter baseline source bytes
- use a dedicated Stage 7 verification commit
- push only after all Stage 7 checks are complete
- preserve Room Creator's HOLD status unless the evidence and existing acceptance process explicitly justify otherwise

## Hard Stop

After Stage 7 verification is complete:

**STOP. Do not begin Stage 8 or any ZANT import.**

Report back with:

1. Exact Room Creator baseline verified
2. Toolchain/environment used
3. Supplied test results
4. Independent/adversarial test results
5. Rebuild/reproducibility results
6. Browser/manual verification results
7. Example/map preservation results
8. Asset-library reference/dependency verification
9. Known missing-image defect result
10. Any migration regressions found
11. Any known limitations/defects reproduced
12. Any environment/toolchain failures
13. Any newly discovered defects
14. Files generated or repository files changed
15. Commit SHA if a Stage 7 verification commit was created
16. Confirmation that canonical Room Creator source remains byte-identical
17. Confirmation that Encounter/Atlas canonical source remains unchanged
18. Confirmation that original source trees remain untouched
19. Confirmation that ZANT was not imported
20. Clear Stage 7 verdict:
   - PASS WITH HOLD PRESERVED
   - PASS WITH DOCUMENTED KNOWN LIMITATIONS
   - HOLD
   - FAIL
21. Explicit statement on whether Room Creator remains `HOLD_FOR_FURTHER_REMEDIATION`
22. Recommended next action, but do not perform it

This authorization is for **Stage 7 only**. Wait for explicit user approval before proceeding to Stage 8.
