# Shared-contract boundaries

Stage 12 defines documentation-level conventions only:

- [Existing contracts and identifier inventory](SHARED_CONTRACT_INVENTORY.md)
- [Ownership and reference boundary matrix](BOUNDARY_MATRIX.md)
- [Illustrative compatibility examples](COMPATIBILITY_EXAMPLES.md)
- [Accepted conventions, deferred questions and decision](SHARED_CONTRACT_DECISION.md)

Canonical native contracts remain inside packages/encounter-atlas, packages/room-creator and packages/zant/C001_ZANT_GATE_A_R5. No shared executable schema, binding registry, converter, adapter or runtime integration is implemented.

Encounter governs gameplay interaction meaning. Atlas remains read-only; Room Creator owns authored space; ZANT owns presentation assets. All product acceptance states remain unchanged. Initial GitHub consolidation is complete; stop before Stage 13.
