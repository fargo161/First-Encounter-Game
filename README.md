# First Encounter Game

Private canonical monorepo with independent history. Encounter governs gameplay grammar and interaction contracts. Older Trapstar repositories are non-authoritative and unused.

Initial GitHub consolidation is complete at narrow Stage 12: [contract inventory](contracts/SHARED_CONTRACT_INVENTORY.md), [boundary matrix](contracts/BOUNDARY_MATRIX.md), [illustrative examples](contracts/COMPATIBILITY_EXAMPLES.md) and [decision](contracts/SHARED_CONTRACT_DECISION.md). These are documentation-level conventions; no runtime integration or product promotion.

Stage 11 establishes fresh-clone setup, safe package verification wrappers and bounded CI. Start with [development setup and commands](DEVELOPMENT.md):

    python -B tools/repo.py doctor
    python -B tools/repo.py integrity
    python -B tools/repo.py all

Use Python 3.12.x and Node 24.x. Package checks run in disposable copies outside the checkout. No npm/pip install or private archive is needed for bounded checks.

| Package | Authoritative state |
| --- | --- |
| packages/encounter-atlas | Accepted A1; IR3-25 remains an actual accepted nonblocking failure |
| packages/encounter-core-c1/0.1.3 | [Owner-accepted bounded standalone C1 reference](packages/encounter-core-c1/README.md); separate Python checks, N01/N02 retained |
| packages/room-creator | HOLD_FOR_FURTHER_REMEDIATION |
| packages/zant/C001_ZANT_GATE_A_R5 | Accepted R4 neutral separate from failed/provisional pilots; Gate A incomplete |

Stage 10 cleanup remains intact: 271 redundant A1 copies removed, all 132 execution inputs and 2310 dependency members retained. See [cleanup](docs/consolidation/STAGE_10_CLEANUP.md), [mappings](docs/provenance/stage10-cleanup-manifest.json) and [authority](docs/provenance/source-authority.json).

Stage 11 checks prove preservation and runnable entry points. Optional asset/browser/archive replays remain external. See [Stage 11 report](docs/consolidation/STAGE_11_READINESS.md) and [next gate](docs/consolidation/NEXT_STAGE_GATE.md). **STOP before Stage 13.**
