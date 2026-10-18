# First Encounter Game — Stage 11 Authorization: Repository Orchestration / Fresh-Clone Readiness

You are authorized to proceed with **Stage 11 only** of the approved GitHub consolidation plan.

## Scope

Make the current private `First-Encounter-Game` repository operational as a clean, repeatable development workspace from a **fresh clone**.

This stage is about repository orchestration, setup clarity, package-level entry points, and bounded CI/readiness checks.

Do not change subsystem product behavior or acceptance states.

## Current State to Preserve

The following verified states remain authoritative:

- **Encounter/Atlas:** migrated and verified; IR3-25 remains the accepted known non-blocking limitation
- **Room Creator:** migrated and verified-as-migrated; remains `HOLD_FOR_FURTHER_REMEDIATION`
- **ZANT:** migrated and verified with acceptance states preserved; Gate A remains incomplete
- **Stage 10 cleanup:** passed with retained necessary duplication; dependency-bound material remains intentionally retained

## Budget / Context Discipline

Use explicit working-budget discipline throughout Stage 11.

Before broad inspection:

- start from current repository manifests, package READMEs, testing docs, dependency records, and known path assumptions
- prioritize the minimum orchestration needed to make a fresh clone understandable and runnable
- avoid deep historical-material ingestion unless it resolves a concrete setup/dependency question
- reserve sufficient capacity for actual fresh-clone execution, package checks, CI validation, and reporting
- if a workflow cannot be made reliable without broader source changes, document the blocker rather than expanding scope silently

## Primary Goal

A competent developer or future Codex agent should be able to:

1. clone `First-Encounter-Game`
2. understand the repository layout
3. identify each subsystem's current status
4. install or locate required tooling/dependencies
5. run the supported package-level integrity/test/build commands
6. understand which dependencies remain external
7. reproduce the supported verification entry points without relying on undocumented local machine paths

## Required Work

Create or refine only the repository-level orchestration needed for that goal.

This may include, where justified:

- root-level setup/development documentation
- per-package command documentation
- repository-level helper scripts for supported checks
- explicit dependency/version documentation
- environment/setup checks
- path/dependency validation helpers
- package status summaries
- CI workflows for bounded non-destructive checks
- fresh-clone verification scripts
- clear external-asset/archive requirements
- documentation of optional vs required tooling
- documentation of known platform limitations

Prefer wrappers/orchestration around existing verified package behavior rather than rewriting package internals.

## Fresh-Clone Test

Perform a genuine **fresh-clone / clean-export verification** in a disposable location.

At minimum, verify that the clone can:

- identify the three subsystem packages correctly
- run repository integrity/status checks
- run the supported Encounter/Atlas verification entry points that do not require historical mutable source changes
- run the supported Room Creator integrity/test/build checks appropriate to its current HOLD state
- run the supported ZANT portable/integrity verification appropriate to its current incomplete Gate A state
- locate or clearly report external dependencies rather than failing opaquely
- avoid dependence on undocumented `Downloads`, `Desktop`, or prior-chat working paths for normal supported repo operations

Historical preservation workflows may still legitimately refer to archived original locations if they are clearly documented as archival/provenance-only and are not required for ordinary fresh-clone development.

## CI / Automation Discipline

If CI is added:

- keep it bounded and truthful
- prefer separate jobs/checks for Encounter/Atlas, Room Creator, ZANT, and repository integrity
- do not present one green repository badge as proof that all product states are accepted
- preserve Room Creator HOLD and ZANT incomplete/failed/provisional statuses in reporting
- do not require inaccessible private external archives for ordinary CI unless clearly segregated as optional/manual checks
- do not introduce secrets unless strictly necessary
- do not add speculative deployment/release automation

## Hard Constraints

Do **not**:

- modify canonical subsystem behavior
- repair Encounter/Atlas IR3-25
- repair or promote Room Creator
- repair, redraw, promote, or complete ZANT Gate A
- change accepted/HOLD/failed/provisional states
- begin Stage 12 shared-contract implementation
- begin Unity work
- add Git LFS unless separately authorized
- rewrite history
- re-import deleted Stage 10 duplication
- remove dependency-bound retained material
- normalize/refactor subsystem internals merely for aesthetic consistency
- depend on old Trapstar repositories

## Git Discipline

Use a dedicated Stage 11 orchestration commit or small clearly related Stage 11 commit set.

Before push:

- verify canonical package fingerprints remain unchanged
- verify Stage 10 cleanup state remains intact
- verify fresh-clone behavior from a disposable clone/export
- review all new automation for hidden machine-specific assumptions
- confirm local and remote `main` agree

## Hard Stop

After Stage 11 is complete:

**STOP. Do not begin Stage 12.**

Report back with:

1. Repository-level orchestration/docs/scripts added or changed
2. Per-package commands established
3. Dependency/toolchain requirements documented
4. Fresh-clone test location/method
5. Fresh-clone results
6. Encounter/Atlas fresh-clone verification results
7. Room Creator fresh-clone verification results
8. ZANT fresh-clone verification results
9. CI/workflow changes, if any
10. Any external dependencies still required
11. Any machine-specific assumptions eliminated
12. Any machine-specific assumptions intentionally retained and why
13. Any setup/dependency blockers discovered
14. Canonical package fingerprint confirmation
15. Stage 10 cleanup preservation confirmation
16. Commit SHA(s) and message(s)
17. Confirmation local and remote `main` match
18. Confirmation subsystem acceptance/status records are unchanged
19. Confirmation no Stage 12, Unity, LFS, remediation, or unrelated refactor was performed
20. Clear Stage 11 verdict:
   - PASS
   - PASS WITH DOCUMENTED EXTERNAL DEPENDENCIES
   - HOLD
   - FAIL
21. Recommended narrow Stage 12 shared-contract scope, but do not perform it

This authorization is for **Stage 11 only**. Wait for explicit user approval before proceeding to Stage 12.
