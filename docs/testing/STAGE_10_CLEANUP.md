# Stage 10 cleanup integrity and bounded retests

Current read-only integrity:

    python -B tools/verify_stage10_cleanup.py
    python -B tools/verify_stage10_cleanup.py --check-external --evidence-root "C:\Users\mcdon\Documents\ChatGPT\First Encounter Game Stage 10 Verification\2026-10-18" --require-git

Default verification needs only the checkout. It checks strict retained membership and bytes; all removed bytes remain available at listed retained paths. It verifies all 2731 historical A1 byte identities through actual retained files/copies, current 2460-member projection, unchanged 132-source digest, all 2310 physical AR0 R1 members, unchanged Room Creator384/ZANT166, prior selected provenance and unchanged acceptance/known-defect records. Optional external checks verify each original/archive removal binding and archive metadata guard; evidence checks verify the frozen private selection.

Existing import manifests and old verifiers are unchanged historical contracts, not redefined or weakened. Full old-state tools require their original Git commits/metadata states (Stage 9 baseline17eac3c20eb9952c0d5cd444363c1d3e286d3db9 contains every original path). Stage 10 adds a current projection record rather than rewriting their assertions.

Fresh bounded checks ran in a pruned Git export before canonical removal: A1 supplied224/224, standalone independent21/21, expected IR3-25 retained 24/25 with zero skips; M3/A1 builds exact; A1 generated12 proofs exact; preserve-atlas-a1.py verifies all 2310 required members; identity-atlas-a1.py retains132 inputs and original digest. Room Creator11 Node suites/308 assertions and LF/CRLF reproduction pass; HTML exact. Unchanged ZANT portable verifier replays4 exact buffers and retains1252-texel failure/Gate A incomplete.

Two temporary setup issues are recorded, resolved without source/assertion edits: Git archive producer completion wait (complete export membership/hashes independently validated), and missing standalone independent evidence output sibling (created outside canonical; unchanged retry passed). Original failed setup log is retained.

Full source clones and generated evidence stay outside the preservation archive. No additional browser/full-stage rerun is claimed; unchanged relevant source, exact outputs, bounded suites and dependency closure support this cleanup scope.

**STOP before Stage 11.**
