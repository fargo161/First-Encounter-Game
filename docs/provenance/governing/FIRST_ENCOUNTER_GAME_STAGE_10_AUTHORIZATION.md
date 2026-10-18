# First Encounter Game — Stage 10 Authorization: Reduce Package Duplication Only

You are authorized to proceed with **Stage 10 only** of the approved GitHub consolidation plan.

## Scope

Perform the planned **package-duplication reduction / repository cleanup pass** across the current `First-Encounter-Game` repository.

This stage is about reducing redundant imported archive/evidence duplication **without changing canonical subsystem behavior, acceptance states, or source authority**.

The current verified subsystem states must remain intact:

- Encounter/Atlas: migrated and verified, with IR3-25 preserved as the accepted known limitation
- Room Creator: migrated and verified-as-migrated, still `HOLD_FOR_FURTHER_REMEDIATION`
- ZANT: migrated and verified with acceptance states preserved; Gate A remains incomplete

## Budget / Context Discipline

Use explicit working-budget discipline.

Before broad inspection:

- start from the authority manifests, import manifests, verification manifests, dependency records, and known execution paths
- prioritize files/directories most likely to be redundant or recursively preserved
- do not re-ingest large historical archives unless needed to resolve a specific dependency question
- reserve sufficient capacity for dependency tracing, deletion-safety checks, rebuild/retest checks, Git diff review, and final reporting
- if a removal cannot be proven safe within available context/tool budget, leave it in place and report it

## Primary Goal

Identify and remove from the **working Git checkout only** those files that are demonstrably redundant because they are:

- duplicated historical package material
- repeated embedded checkpoint/archive copies
- repeated evidence already preserved externally and not required for execution
- redundant delivery wrappers or duplicated extracted trees
- other non-canonical copies whose removal does not break current builds, tests, preservation contracts, or verification workflows

Do **not** delete the external preservation/archive copies.

## Required Method

For every proposed removal:

1. identify the file/directory and why it appears redundant
2. trace whether any current script, build, test, verifier, fixture, manifest, or documented workflow references it
3. distinguish canonical source from historical/provenance/evidence copies
4. verify an external preserved copy or authoritative retained source exists where required
5. remove only after dependency safety is demonstrated
6. rerun the relevant bounded integrity/build/test checks needed to show the repository still reproduces the same verified behavior

Where a historical file must remain because a current workflow depends on its exact path, keep it and document that dependency rather than forcing cleanup.

## Hard Constraints

Do **not**:

- modify canonical Encounter/Atlas source behavior
- modify canonical Room Creator source behavior
- repair or promote Room Creator
- modify canonical ZANT source/art
- repair, redraw, promote, or reinterpret failed/provisional ZANT material
- change any acceptance/HOLD/failed/provisional state
- implement shared contracts
- implement cross-system integration
- initialize Unity
- add Git LFS
- begin Stage 11
- delete or alter the external preservation archive
- delete provenance merely because it is inconvenient
- remove execution dependencies just because they are located under `evidence/`, `historical/`, `independent/`, or similar directories
- rewrite scripts solely to justify deleting preserved files unless separately authorized

## Git Discipline

Use a dedicated Stage 10 cleanup commit.

Before committing:

- show exact removed/moved/changed paths
- verify canonical package fingerprints remain unchanged except for intentionally removed non-canonical redundant material
- rerun relevant package integrity checks and any bounded builds/tests needed to confirm no migration regression
- verify local and remote `main` will remain reproducible from a fresh checkout

Do not combine unrelated documentation cleanup or refactoring with this stage.

## Hard Stop

After Stage 10 is complete:

**STOP. Do not begin Stage 11.**

Report back with:

1. Duplication categories identified
2. Exact files/directories removed from Git
3. Exact files/directories deliberately retained and why
4. Any execution/test/build dependencies discovered in historical/evidence material
5. External preservation/archive confirmation for removed material
6. Encounter/Atlas integrity/retest results
7. Room Creator integrity/retest results
8. ZANT integrity/retest results
9. Any migration regressions found
10. Any cleanup candidates deferred because safety was uncertain
11. Repository size/file-count impact before vs after
12. Files changed outside deletion/removal records, if any
13. Commit SHA and message
14. Confirmation that local and remote `main` match
15. Confirmation that canonical acceptance/status records remain unchanged
16. Confirmation that external preservation archives remain untouched
17. Confirmation that no subsystem remediation, integration, Unity, LFS, or Stage 11 work was performed
18. Clear Stage 10 verdict:
   - PASS
   - PASS WITH RETAINED NECESSARY DUPLICATION
   - HOLD
   - FAIL
19. Recommended next action, but do not perform it

This authorization is for **Stage 10 only**. Wait for explicit user approval before proceeding to Stage 11.
