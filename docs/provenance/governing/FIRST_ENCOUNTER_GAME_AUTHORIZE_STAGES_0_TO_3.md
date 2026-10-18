# First Encounter Game — Authorization for GitHub Consolidation Stages 0–3

You are authorized to proceed with **Stages 0–3 only** of the previously proposed GitHub consolidation plan for this project.

Do not proceed beyond Stage 3.  
After completing Stage 3, **STOP and report back for review and explicit authorization before importing any subsystem source.**

---

## Approved Stage-0 Decisions

Treat the following as settled user decisions. Do not reopen them unless execution reveals a concrete technical blocker.

- **Repository name:** `First Encounter Game`
- **GitHub repository slug:** `First-Encounter-Game`
- **Visibility:** Private
- **Repository model:** Fresh monorepo
- **Default branch:** `main`
- **History:** Completely new and independent Git history
- **Legacy Trapstar repositories:** Non-authoritative historical reference only
- Do **not** fork, merge, import history from, or otherwise base this repository on older Trapstar repositories
- Recover anything from an older repository only if a later task identifies a specific current need and explicitly justifies that recovery
- **Encounter remains the governing gameplay grammar / interaction contract of the project**
- Preserve strong subsystem boundaries rather than physically collapsing everything into Encounter
- **Room Creator:** current v0.14.1 development baseline may later be imported while explicitly preserving its current **HOLD** status
- **ZANT:** preserve the accepted R4 neutral baseline distinctly from current R5 failed/provisional work
- **Historical ZIPs, large evidence bundles, restricted assets, and large immutable source collections:** keep outside normal Git history in a separate private archive unless a specific item is intentionally selected for repository tracking
- Represent externally preserved artifacts through hashes, provenance, manifests, and status records inside the repository where appropriate
- **Git LFS:** do not enable initially; introduce it only later if maintained binary assets demonstrate an actual need
- **Unity:** do not add or initialize Unity yet
- **Migration philosophy:** Preserve first → Normalize second → Connect third → Refactor later

---

# Authorized Work

## Stage 0 — Lock Scope and Decisions

Record the approved decisions above as the authoritative starting point for this consolidation.

Resolve only implementation details necessary to execute Stages 1–3.

Do not redesign the previously approved repository plan.

---

## Stage 1 — Preserve Inputs

Create or verify a safe pre-migration preservation checkpoint for the source materials selected for later migration.

At minimum:

- identify the exact current source inputs for Encounter/Atlas, Room Creator, and ZANT
- record source locations
- record relevant file/package hashes
- preserve current acceptance states and known defects
- ensure the original working/source trees remain untouched
- ensure any external archive plan is documented and recoverable
- do not modify source in place

The purpose of this stage is to guarantee that later migration can be reversed or independently checked.

---

## Stage 2 — Establish the Authority Manifest

Create the project-wide source-authority/provenance manifest needed to govern later imports.

It must clearly distinguish, where applicable:

- current editable source
- accepted baseline
- held candidate
- failed/provisional work
- tests
- independent test evidence
- schemas/contracts
- assets
- historical checkpoints
- external/archive-only material
- known defects
- dependencies
- exact hashes or fingerprints where available

Do not use vague labels such as “latest” when a precise version/checkpoint/status is known.

The manifest must preserve the real current state rather than making all subsystems appear equally complete.

---

## Stage 3 — Create the Fresh Repository Foundation

Create the new private GitHub repository:

**`First-Encounter-Game`**

Create it as a completely fresh repository with independent history.

Set up the initial repository foundation according to the approved audit plan.

This may include, as appropriate:

- repository root
- `README.md`
- initial architecture/consolidation documentation
- authority/provenance manifest
- proposed subsystem directory skeleton
- `docs/`
- `contracts/`
- `integration/`
- `assets/` manifest/licensing area
- `archive/` index
- future `runtime/` placeholder only if justified by the existing plan
- `.gitignore`
- `.gitattributes`
- `.github/` scaffolding if useful at this stage
- initial commits establishing the repository foundation
- push of the foundation to the new private GitHub repository

Keep this foundation **minimal and truthful**.

Do not populate the repository with the actual Encounter/Atlas, Room Creator, or ZANT source trees yet.

Do not create speculative future subsystem implementations.

Do not add Unity yet.

---

# Hard Stop After Stage 3

After Stage 3 is complete:

**STOP.**

Do not begin:

- Stage 4 Encounter/Atlas import
- any subsystem migration
- source normalization
- refactoring
- Room Creator remediation
- ZANT repair
- shared contract implementation
- Unity setup
- Git LFS conversion
- archive cleanup/deletion
- CI that depends on not-yet-imported subsystem source

Instead, provide a completion report for review.

---

# Required Stage 0–3 Completion Report

Report back with:

1. **What was created**
2. **GitHub repository name and visibility**
3. **Local repository path**
4. **Current branch**
5. **Commit(s) created**
6. **Files/directories created**
7. **Authority manifest location**
8. **Pre-migration preservation/backup status**
9. **Any external archive locations or manifests established**
10. **Any deviations from the approved plan**
11. **Any blockers, warnings, or unresolved questions**
12. **Confirmation that no subsystem source has yet been imported**
13. **Confirmation that no legacy Trapstar repository history was reused**
14. **Confirmation that originals remain untouched**
15. **Recommended next action, but do not perform it**

If possible, include enough evidence that another reviewer can verify the repository foundation independently.

---

# Governing Constraint

This authorization is deliberately narrow.

You are being authorized to create the **safe foundation** for the new canonical repository, not to perform the full consolidation.

Once Stage 3 is complete, wait for explicit user approval before proceeding further.
