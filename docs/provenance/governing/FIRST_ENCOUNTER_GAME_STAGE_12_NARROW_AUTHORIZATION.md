# First Encounter Game — Narrow Stage 12 Authorization: Shared-Contract Boundary Definition Only

You are authorized to proceed with **Stage 12 only**, using the deliberately narrow scope recommended by the completed Stage 11 report.

Stage 11 passed with documented external dependencies: the repository is fresh-clone ready, bounded local checks work without private archives, and all four hosted CI jobs passed while preserving the actual product states of Encounter/Atlas, Room Creator, and ZANT.

This Stage 12 is intended to complete the **initial GitHub consolidation phase**. It is **not** authorization to begin Unity integration, runtime adapters, or broad cross-system refactoring.

---

## Primary Goal

Establish the **minimum justified shared-contract foundation** for future Encounter-centered integration.

This stage should answer:

> What small set of cross-system identifiers, versions, references, and boundary rules is already justified by the current project?

Do not attempt to design a universal game ontology or solve future subsystems in advance.

Encounter remains the governing gameplay grammar / interaction contract of the project.

Other systems should retain their own internal responsibilities and expose only the minimum information needed to participate in Encounter-centered integration.

---

## Current States to Preserve

These remain authoritative and must not be changed by Stage 12:

- **Encounter/Atlas:** migrated and verified; IR3-25 remains the accepted known non-blocking limitation
- **Room Creator:** migrated and verified-as-migrated; remains `HOLD_FOR_FURTHER_REMEDIATION`
- **ZANT:** migrated and verified with acceptance states preserved; Gate A remains incomplete
- **Stage 10:** cleanup passed with retained necessary duplication
- **Stage 11:** repository orchestration/fresh-clone readiness passed with documented optional external dependencies

Shared-contract work must not imply product promotion or subsystem completion.

---

# Budget / Context Discipline

Use explicit resource/context budgeting throughout this stage.

Before broad inspection:

- begin with current authority manifests, package contracts, version identifiers, format documentation, existing IDs/references, and Stage 11 orchestration docs
- prioritize current canonical material over historical archives
- avoid bulk ingestion of research/evidence unless needed to resolve a specific boundary question
- reserve sufficient context/time/tool budget for comparison, documentation, compatibility examples, integrity checks, and final reporting
- if a proposed abstraction cannot be justified from current evidence, leave it proposed or omit it rather than expanding scope

Do not hard-code a specific token amount. Apply the budgeting discipline adaptively.

---

# Authorized Work

## 1. Inventory Existing Contracts and Identifiers

Inspect the current three packages and document what already exists.

At minimum inventory:

- Encounter/Atlas schema/version identifiers
- record/version distinctions that are already meaningful
- package/content/catalog identifiers
- person/actor/entity references currently used
- Room Creator format/version identifiers
- Room Creator stable asset IDs
- Room Creator map/object/Use Point/route/story identifiers where relevant
- ZANT character/part/surface/slot identifiers
- ZANT accepted-lock / recipe / matrix identifiers
- existing content hashes or package revision references
- existing coordinate/unit conventions
- existing status/acceptance references

Distinguish clearly between:

- **observed current contract**
- **package-private implementation detail**
- **candidate shared contract**
- **future idea not yet justified**

Do not silently promote package-local concepts into shared standards.

---

## 2. Define a Minimal Boundary Matrix

Create a documented cross-system boundary matrix showing, at minimum:

- which system owns each concept
- which systems may reference it
- which systems may mutate it
- what identifier crosses the boundary
- what versioning rule applies
- what should remain package-private

The matrix should cover only currently justified concepts such as:

- person / actor binding
- package/schema version references
- stable asset references
- spatial references / transforms / units where needed
- interaction-point references
- presentation/character-asset references
- command/result or consequence ownership at a conceptual level

Encounter should remain the owner of gameplay interaction meaning.

Room Creator should not become the owner of permissions, beliefs, or Encounter consequences.

ZANT should not become the owner of gameplay identity/state merely because it supplies character presentation.

Atlas should not become a competing mutable world-state authority.

---

## 3. Add Compatibility Examples

Create a small number of **documentation-level examples** showing how the existing packages could refer to one another without implementing runtime integration.

Examples may include:

- an Encounter actor explicitly bound to a ZANT character/presentation reference
- an Encounter-capable location referencing a Room Creator Use Point or authored spatial point
- package/version/hash references that allow an importer to reject incompatible data
- an example showing that a presentation asset reference carries no gameplay belief/emotion semantics
- an example showing that a Room Creator interaction point describes availability/location, not Encounter permission

Keep examples illustrative and non-executable unless an already-existing schema can represent them without changing product behavior.

---

## 4. Document Versioning and Ownership Rules

Define only the minimum rules needed now, such as:

- namespaced IDs where cross-package references are necessary
- explicit package/schema versions
- content/package hash references where useful
- no inference of identity from display names
- no reuse of Unity GUIDs as canonical upstream IDs
- no assumption that matching filenames imply identity
- unknown-field preservation where already required
- ownership of consequences and mutable gameplay state remains explicit

Do not introduce speculative fields for future Combat, Factions, Laws, or other not-yet-imported subsystem trios.

The architecture should remain extensible without pre-authoring their schemas.

---

# Deliverables

Create/update narrowly scoped repository documentation, preferably under the existing `contracts/`, `docs/architecture/`, `docs/decisions/`, or `integration/` areas.

At minimum produce:

## A. `SHARED_CONTRACT_INVENTORY.md`

Document:

- current package/schema/version identifiers
- existing cross-reference candidates
- observed ownership
- package-private concepts
- ambiguity/conflicts
- source locations supporting each observation

## B. `BOUNDARY_MATRIX.md`

Document:

- concept
- authoritative owner
- reference consumers
- mutation authority
- identifier/reference form
- versioning expectations
- explicit non-ownership rules

## C. `COMPATIBILITY_EXAMPLES.md`

Provide a few bounded examples showing how Encounter/Atlas, Room Creator, and ZANT can interoperate conceptually without runtime implementation.

## D. `SHARED_CONTRACT_DECISION.md`

Record the Stage 12 decision:

- what is accepted now as a minimal shared convention
- what remains proposed only
- what is deferred
- why broader schema implementation is intentionally postponed

If another filename/layout better fits the established repository structure, use it, but preserve the same information.

---

# Implementation Boundary

This Stage 12 may add **documentation, contract inventories, boundary definitions, and non-runtime examples**.

It may also add extremely small machine-readable convention records **only if** they merely encode already-established identifiers/version rules and do not require modifying canonical package behavior.

Do not create a new executable shared-schema framework merely to “complete Stage 12.”

Any actual shared schema implementation, converters, adapters, or package rewrites must be separately scoped and authorized later if/when a concrete integration requires them.

---

# Hard Constraints

Do **not**:

- modify canonical Encounter/Atlas behavior
- modify canonical Room Creator behavior
- repair or promote Room Creator
- modify canonical ZANT art/content
- repair, redraw, promote, or complete ZANT Gate A
- change any accepted/HOLD/failed/unaccepted/provisional state
- implement runtime adapters
- implement cross-system mutation
- create Unity files
- begin Stage 13
- add Git LFS
- normalize/refactor package internals
- recover old Trapstar repository content
- invent schemas for future subsystem trios
- turn Atlas into mutable world-state authority
- turn Room Creator metadata into Encounter permission/knowledge
- turn ZANT presentation data into gameplay truth

---

# Verification

Before committing:

- confirm all three canonical package fingerprints remain unchanged
- confirm Stage 10 cleanup remains intact
- confirm Stage 11 orchestration and CI still pass
- validate documentation/examples for internal consistency
- ensure observed facts are clearly distinguished from proposed conventions
- ensure no runtime/product behavior changed

If machine-readable records are added, validate them from a fresh checkout/export.

---

# Git Discipline

Use a dedicated Stage 12 commit or small clearly related Stage 12 commit set.

Commit only:

- contract inventory
- boundary matrix
- compatibility examples
- minimal decision records
- narrowly necessary navigation/index updates
- bounded verification/status records

Do not combine unrelated cleanup or refactoring.

---

# Hard Stop / Initial Consolidation Complete

After Stage 12 is complete:

**STOP. Do not begin Stage 13.**

Stage 13 is reserved for the future point when the user explicitly begins Unity integration.

Do not begin Unity setup merely because Stage 12 passes.

After a successful Stage 12, treat the **initial GitHub consolidation of First Encounter Game as complete**.

The repository should then become the normal canonical home for ongoing development and for adding future subsystem trios.

---

# Required Completion Report

Report back with:

1. Existing contract/identifier inventory findings
2. Minimal shared conventions accepted
3. Concepts deliberately kept package-private
4. Boundary matrix summary
5. Compatibility examples created
6. Any ambiguities or conflicts discovered
7. Any proposed conventions intentionally deferred
8. Files added/changed
9. Confirmation canonical package fingerprints are unchanged
10. Confirmation Stage 10 cleanup remains intact
11. Confirmation Stage 11 orchestration/fresh-clone checks still pass
12. CI result if rerun
13. Commit SHA(s) and message(s)
14. Confirmation local and remote `main` match
15. Confirmation all subsystem product/acceptance states remain unchanged
16. Confirmation no Unity, runtime adapters, remediation, LFS, or Stage 13 work was performed
17. Clear Stage 12 verdict:
   - PASS
   - PASS WITH DEFERRED CONTRACT QUESTIONS
   - HOLD
   - FAIL
18. Explicit statement whether the **initial GitHub consolidation is complete**
19. Recommended future Unity/Stage 13 entry criteria, but do not perform Stage 13

This authorization is for **narrow Stage 12 only**.
