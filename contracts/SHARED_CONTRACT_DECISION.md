# Stage 12 shared-contract boundary decision

Decision: **PASS WITH DEFERRED CONTRACT QUESTIONS**. The initial GitHub consolidation is complete. This is acceptance of the small documentation-level conventions below, not product acceptance or implementation of a shared schema.

Encounter remains the governing gameplay grammar. The canonical repository is the normal home for ongoing explicitly scoped development and future subsystem trios. Older Trapstar repositories remain non-authoritative and unused.

## Accepted now — documentation-level conventions

1. **Explicit ownership.** Encounter owns gameplay identity, interaction meaning, permission/knowledge distinctions and validated consequences. Atlas owns descriptive catalog/read-only projection, RC authored spatial data, and ZANT presentation assets/registration. None acquires the others' mutation authority through a reference.
2. **Qualified references.** A cross-package reference must identify its producer/namespace, exact package or authored artifact, local record kind and original local ID. Include parent scope for nested points. This is a logical qualification rule; no URI/prefix syntax, registry, serialized envelope or rewritten native ID is adopted.
3. **Separate version axes.** Carry the owning package's exact schema/format and relevant content/artifact revision. A release label, schema token, package revision, catalog revision and run/journal revision are different. No common semantic-version scheme or automatic upgrade is assumed.
4. **Scoped content identity.** Use existing content/package/file/lock hashes where useful, with the existing algorithm and byte/canonical-record/pixel scope identified. A checksum proves that defined identity, not behavior, licensing, acceptance or compatibility across hash methods.
5. **No inferred identity.** Display names, filenames, array positions, RC route actor IDs and Unity GUIDs cannot stand in for explicit upstream actor/asset identity. Native IDs retain original case and spelling. No actor↔C001 or map↔place binding is accepted from the illustrative examples.
6. **Explicit frames.** Retain native units, axes, parent frame, story/prop calibration and snapshot. RC plan metres, GLB local metres, Encounter UI rectangles and ZANT pixels are not one coordinate system. No transform or engine/world scale is selected.
7. **Local preservation rules.** Preserve unknown fields only where the owning native contract already requires it. RC's documented round-trip rule does not authorize unknown fields in strict Encounter records or changes to frozen ZANT files.
8. **Status separation.** Preserve owner acceptance, product HOLD, failed/unaccepted/provisional work and verification results separately at the relevant artifact scope. Repository readiness or these conventions do not promote RC, complete ZANT Gate A or repair IR3-25.

The [inventory](SHARED_CONTRACT_INVENTORY.md) marks observed facts/private details/candidates/deferred questions. The [matrix](BOUNDARY_MATRIX.md) applies these rules. The [examples](COMPATIBILITY_EXAMPLES.md) are non-runtime sketches; no machine-readable convention record or executable shared-schema framework is needed for this stage.

## Proposed only

- Explicit actor→presentation and location→Use Point associations, qualified by exact content/artifact identity. The examples use observed IDs but propose no production assignment.
- A future consumer may resolve selected RC assets/points or accepted ZANT surfaces/neutral recipes while preserving the owners' responsibilities.
- Any future request/result bridge must preserve Encounter's matching, revision, replay/idempotence and semantic authority. Its serialized contract is not designed here.

## Deferred questions

| Question | Why deferred / evidence | Entry condition for a later decision |
| --- | --- | --- |
| Global map/artifact identity and binding lifecycle | Inspected RC bundle lacks project.id; story IDs/indexes are normalized and duplicate prop IDs renamed | Concrete importer/use case plus agreed snapshot identity, uniqueness and explicit edit/remapping policy |
| Binding wire format, storage and version negotiation | No runtime consumer exists; native version axes differ | Separately authorized integration with one bounded producer/consumer pair |
| World scale/origin/orientation and anatomical/view mapping | Native metre/pixel/DOM frames differ; source calibration and some ZANT interfaces remain provisional | Target engine/scene requirement plus a documented conversion test, preserving accepted source registration |
| Presentation eligibility/animation/full compatibility | Accepted neutral subset is distinct from failed pilots, absent slots and unrun matrix cases | Explicitly selected accepted subset or separate remediation/owner acceptance; no automatic Gate A promotion |
| Universal identity/asset/part ontology or migration framework | Not required by the three current packages | A demonstrated collision or cross-system need, never speculative future-trio fields |
| Unknown extensions across strict and permissive schemas | RC preserves documented metadata; Encounter rejects unknown envelope fields | Concrete extension need with producer-owned validation/preservation rules |

No Combat, Factions, Laws or other future-trio schemas, converters, runtime adapters, event bridges, cross-system mutation or Unity files are introduced. Broader implementation is postponed until there is a concrete consumer to justify fields, error handling and lifecycle guarantees.

## Verification and closure

Canonical package fingerprints and subsystem authority/defect records stay unchanged. Stage 10's 271 removals/retained bindings remain intact. Stage 11 wrappers/CI retain their commands and package assertions; only the current integrity check's stage-pointer handling is extended to recognize authorized Stage 12, with the next gate still enforced. This is bounded repository status handling, not product/runtime schema logic.

The Stage 12 report records fresh-export execution and CI outcomes. Initial consolidation completion means preservation, migration, readiness and the initial documented boundary definition are complete; RC HOLD and ZANT incomplete Gate A remain product constraints.

**STOP before Stage 13.** Stage 13 is reserved for a later explicitly authorized Unity integration. Suggested entry criteria: owner selects a concrete Unity/scene scope and consumer; selects eligible source subsets without promoting held/failed work; resolves the specific reference-lifecycle and coordinate questions needed by that scope; defines expected import/rejection and command/result tests; then separately authorizes the smallest adapter implementation. Do not select/install Unity, create its files or implement an adapter now.
