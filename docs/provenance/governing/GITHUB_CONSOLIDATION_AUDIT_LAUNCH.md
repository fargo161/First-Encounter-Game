# GitHub Consolidation Audit — Fresh Codex Chat Launch Brief

## Purpose

You are a **fresh, project-wide GitHub audit chat** for this Codex project.

Your first job is **not to modify, reorganize, delete, migrate, rename, commit, push, or refactor anything**.

Your job is to inspect the entire project as it currently exists, understand its architecture and development state, and produce a rigorous **GitHub consolidation audit + implementation plan** that can later be reviewed before any repository changes are made.

This audit should treat the project as a growing game-development ecosystem that will eventually be integrated into **Unity / Adventure Creator**, while preserving the independent authoring tools and systems that feed the runtime.

---

# 1. Governing Architectural Principle

The most important conceptual rule for this project is:

> **Encounter is the governing gameplay grammar of the project.**

Encounter is not merely one subsystem among several.

The project may contain many specialized systems, tools, editors, simulations, and gameplay extensions, but when those systems become meaningful to the player, they should generally do so through an Encounter-centered contract.

A useful framing is:

> **The world produces circumstances.  
> Other systems provide state, space, characters, capabilities, and context.  
> Encounter governs how those circumstances become playable interactions.  
> Encounter results then write consequences back into the world.**

Do **not** interpret this to mean that every subsystem should be physically nested inside Encounter or tightly coupled to Encounter implementation code.

Instead:

> **Encounter should own or define the common interaction contracts; specialized systems should satisfy, extend, or consume those contracts without duplicating the governing gameplay logic.**

The GitHub architecture should preserve this principle while maintaining strong subsystem boundaries.

---

# 2. Current Major Subsystem Lanes

The current Codex project contains, or is expected to contain at the start of this audit, three mature development lanes:

## Encounter / Atlas

Expected project chats include roles such as:

- `encounter/atlas builder`
- `encounter/atlas audit`
- `encounter/atlas tester`

Encounter is the central gameplay interaction system.

Atlas is closely associated with Encounter and functions as an authoring / inspection / development surface around Encounter-related people, state, data, and future world integration.

Treat Encounter and Atlas as closely related, but do not assume they must share every directory or implementation boundary.

---

## ZANT

Expected project chats include:

- `ZANT builder`
- `ZANT audit`
- `ZANT tester`

ZANT covers the modular character / character-authoring side of the project.

Its relationship to Encounter is that it provides character identity, presentation, expressive capacity, and related authored assets/data that Encounter and the eventual runtime may consume.

Do not assume ZANT should own Encounter behavior.

---

## Room Creator

Expected project chats include:

- `room creator builder`
- `room creator audit`
- `room creator tester`

Room Creator originated substantially through Claude and has been onboarded into this Codex project through a dedicated handoff, audit, builder, and tester workflow.

Room Creator should be understood as a spatial/environment authoring system.

It may contain or preserve gameplay-relevant concepts such as:

- rooms and multi-story structure
- walls, openings, doors, windows, partitions
- furniture / props / environmental assets
- navigation and movement structures
- NPC lanes or routes
- gathering / interaction locations
- player-positioning information
- gameplay metadata
- spatial context that may later be consumed by Encounter or Unity

Do not assume every discussed future Room Creator concept is already implemented.

Distinguish carefully between:

1. implemented behavior,
2. documented requirements,
3. planned future capabilities,
4. historical experiments or superseded ideas.

---

# 3. Expected Future Expansion

Additional subsystem chat trios may be created **after the initial GitHub repository has been established**.

Likely future areas may include systems such as combat, factions/allies, economy/law-enforcement/social institutions, navigation, world simulation, or other gameplay layers.

Do not delay the initial GitHub consolidation simply because these later systems do not yet have dedicated Codex implementation lanes.

However, the proposed repository architecture must be **extensible** so additional subsystems can be added without major restructuring.

Where appropriate, design conventions that make a future subsystem easy to add in a predictable way.

---

# 4. Audit Scope

Inspect the **entire Codex project workspace and all relevant project files available to you**.

Use the existing builder, audit, tester, handoff, checkpoint, verification, evidence, schema, source, asset, and documentation materials to reconstruct the true current state of the project.

Do not rely on filenames alone when contents can be inspected.

Do not assume that the newest-looking filename is automatically canonical.

Where multiple files, builds, ZIPs, reports, or checkpoints overlap, determine their roles and relationships.

The audit should identify:

- current authoritative source
- current verified checkpoints
- historical checkpoints
- test evidence
- remediation builds
- handoff packages
- schemas
- fixtures
- examples
- assets
- generated outputs
- temporary files
- duplicated material
- obsolete or superseded material
- files whose status is unclear
- files whose purpose is not documented
- dependencies between packages
- external dependencies
- large/binary asset concerns
- Unity-facing data
- authoring-only data
- runtime-facing data

---

# 5. Critical Audit Questions

The audit must answer, at minimum, the following.

## A. What is canonical?

For each major subsystem, identify:

- the current canonical editable source
- the current canonical tests
- the current canonical schemas/data contracts
- the current canonical documentation
- the latest verified checkpoint
- whether the verified checkpoint and editable source are actually aligned
- what historical material must be preserved
- what can safely remain outside normal day-to-day development

Do not silently choose between conflicting candidates. Record uncertainty explicitly.

---

## B. What should Git track?

Classify material into categories such as:

- source-controlled editable source
- tests
- schemas
- small fixtures/examples
- essential documentation
- project configuration
- generated outputs
- test evidence
- build artifacts
- archival checkpoints
- large binary art/media
- temporary/cache files
- machine-specific files
- secrets/private configuration if any

Recommend what should be:

- tracked directly in Git
- ignored via `.gitignore`
- preserved as GitHub Releases / tagged checkpoint artifacts
- placed in an archive area
- stored through Git LFS if appropriate
- kept outside the repository entirely

Do not recommend Git LFS automatically; justify it based on actual project contents.

---

## C. What is the correct repository model?

Assess whether the project should use:

- one monorepo,
- several repositories,
- or another structure.

Given the current architecture, a monorepo may be a strong candidate, but **do not assume the answer in advance**.

Evaluate the tradeoffs based on the actual project.

The chosen structure must support:

- Encounter-centered contracts
- independent subsystem development
- independent testing
- future Unity integration
- future subsystem expansion
- clean provenance/history
- easy access by Codex
- understandable organization for a human developer

---

## D. How should Encounter govern cross-system integration?

Map how the existing systems relate to Encounter.

In particular, determine which concepts should become:

- Encounter-owned contracts
- shared project contracts
- subsystem-private implementation details
- Unity adapter concerns
- authored data exchanged between systems

Look for duplicated concepts such as:

- people / actors / NPCs
- identity
- location
- interaction points
- world state
- actions
- permissions
- relationships
- knowledge
- perception
- inventory or possession
- movement context
- combat context
- consequences / state changes

Do not refactor these yet.

Instead, identify where future consolidation may be necessary to prevent incompatible parallel definitions.

---

## E. What is the Unity boundary?

The repository must not treat Unity as the place where all upstream authoring logic disappears.

Audit the current systems with the assumption that Unity will eventually **consume validated outputs** from the authoring/development tools.

A likely conceptual pipeline is:

```text
Authoring tool / subsystem
        ↓
Editable source representation
        ↓
Validation / tests
        ↓
Stable export or shared contract
        ↓
Unity importer / adapter
        ↓
Runtime representation
```

Determine what parts of Encounter/Atlas, ZANT, and Room Creator should remain independently editable outside Unity.

Identify what Unity should import rather than become the canonical owner of.

Also identify any cases where Unity genuinely should become the authoritative runtime implementation.

---

# 6. Preserve Development Provenance Without Turning Git Into a ZIP Dump

This project currently has substantial development history in the form of:

- checkpoint ZIPs
- remediation candidates
- source packages
- test packages
- audit evidence
- verification JSON
- handoff packages
- standalone reports

These are valuable.

However, GitHub should eventually represent the **living editable project**, not merely preserve the previous file-exchange workflow.

Recommend a transition strategy where:

- canonical editable source becomes ordinary repository content,
- Git history tracks ongoing changes,
- major verified milestones can be preserved as tags/releases when useful,
- old ZIP/checkpoint packages are retained only where they have archival or evidentiary value,
- unnecessary duplication is reduced without destroying provenance.

Do not delete anything during this audit.

---

# 7. Chat Roles Are Workflow Roles, Not Repository Architecture

The current builder / audit / tester chat structure is an important development workflow.

However, do not design the repository around AI chat ownership.

For example, avoid structures whose primary meaning is:

```text
builder-files/
tester-files/
audit-files/
claude-files/
codex-files/
```

Instead, organize the repository around the actual software/product architecture.

Audit/test evidence and handoffs may have appropriate homes in documentation or testing areas, but the repository should remain understandable even if the AI chat history vanished.

---

# 8. Required Deliverables

Produce a thorough audit package before recommending execution.

At minimum, create the following reports/plans in your response or as clearly separated Markdown deliverables.

## 1. `GITHUB_READINESS_AUDIT.md`

Include:

- executive summary
- current project inventory
- subsystem status
- canonical-source findings
- duplication / ambiguity findings
- dependency findings
- testing / verification status
- asset/binary concerns
- archival/provenance concerns
- major risks
- blockers
- items requiring user decision

---

## 2. `CANONICAL_SOURCE_MAP.md`

For each major subsystem, map:

- canonical source
- tests
- docs
- schemas/data
- assets
- verified build/checkpoint
- relevant historical/archive material
- unresolved conflicts

Prefer exact filenames/paths where possible.

---

## 3. `SYSTEM_BOUNDARIES_AND_DEPENDENCIES.md`

Document:

- Encounter’s governing role
- Encounter ↔ Atlas
- Encounter ↔ Room Creator
- Encounter ↔ ZANT
- subsystem-private responsibilities
- shared contracts
- likely future extension points
- Unity boundary
- dangerous or ambiguous coupling that should be avoided

---

## 4. `PROPOSED_REPOSITORY_STRUCTURE.md`

Recommend a concrete directory tree.

For every major top-level directory, explain:

- its purpose
- what belongs there
- what does not belong there
- whether it is canonical source, documentation, generated output, test material, archive, etc.

The structure must be designed for future subsystem expansion.

---

## 5. `GIT_TRACKING_AND_ARCHIVE_POLICY.md`

Recommend:

- what Git tracks
- `.gitignore` categories
- whether Git LFS is necessary
- treatment of ZIP checkpoints
- treatment of test evidence
- treatment of generated files
- treatment of Unity-generated folders
- treatment of large art/media
- version/tag/release strategy
- archive strategy

---

## 6. `UNITY_INTEGRATION_BOUNDARY.md`

Describe the intended boundary between:

- authoring tools
- shared validated data
- import/adaptation
- Unity runtime
- Adventure Creator integration where relevant

Do not implement Unity integration yet.

---

## 7. `GITHUB_CONSOLIDATION_IMPLEMENTATION_PLAN.md`

Create a staged, reversible implementation plan.

It should include:

- preflight backup/checkpoint
- repository initialization strategy
- normalization order
- migration order by subsystem
- verification after each migration
- when to introduce shared contracts
- when to create tags/releases
- when to add Unity
- rollback points
- independent tester involvement
- conditions required before moving to each next stage

Prefer a migration that can be stopped safely after any major step.

---

# 9. Recommended Consolidation Philosophy

Unless the actual project evidence strongly contradicts it, prefer the following general philosophy:

> **Preserve first. Normalize second. Connect third. Refactor later.**

The initial GitHub consolidation is **not** the time for broad redesign.

Do not use migration as an excuse to:

- rewrite working systems
- unify code that merely looks similar
- rename everything for aesthetic consistency
- flatten meaningful subsystem boundaries
- discard old evidence
- convert authoring tools into Unity-only workflows
- introduce speculative abstractions
- implement future features
- “clean up” behavior without test evidence

The first repository should aim to be a faithful, understandable, testable representation of the project that already exists.

---

# 10. Verification Standard

Treat existing independent tester results seriously.

For every major subsystem, distinguish:

- builder claim
- audit finding
- independent tester result
- verified remediation result
- unverified current state

If a current build has not been independently verified, say so.

If Room Creator’s first Codex tester run reveals unresolved failures, incorporate them into the audit rather than pretending Room Creator is fully verified.

The GitHub plan should tolerate known defects without confusing them with repository-migration failures.

---

# 11. Do Not Execute Yet

This is an **audit and planning pass only**.

Do not:

- initialize Git
- make commits
- create branches
- push to GitHub
- move files
- rename directories
- delete duplicates
- edit source code
- alter tests
- rewrite schemas
- create Unity files
- modify current subsystem packages

You may inspect and analyze whatever project files are available.

After completing the audit package, stop and present the findings for user review.

The user will explicitly authorize implementation later.

---

# 12. Final Perspective

The repository should ultimately make this project easier to understand as:

```text
                   GAME / WORLD STATE
                          │
          ┌───────────────┼───────────────┐
          │               │               │
     Room Creator        ZANT       Future Systems
          │               │               │
          └───────────────┼───────────────┘
                          │
                     ENCOUNTER
                  governing gameplay
                       grammar
                          │
                        Atlas
                authoring / inspection
                          │
                          ▼
                 validated interfaces
                          │
                          ▼
                  Unity / Adventure
                    Creator runtime
```

This diagram is conceptual, not a required physical folder hierarchy.

Your audit should determine the cleanest technical structure that preserves this model without creating unnecessary coupling.

---

# Start

Begin by inspecting the complete project available to you.

First establish what files, checkpoints, reports, source packages, tests, assets, and documentation actually exist.

Then determine the current authoritative state of Encounter/Atlas, ZANT, and Room Creator.

Only after establishing those facts should you propose the GitHub architecture and migration plan.

Do not make changes.
