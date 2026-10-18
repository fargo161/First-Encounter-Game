# Stage 6 import integrity

Current status is HOLD, not behavior acceptance. No Room Creator tests/builds/browser runs were performed.

Read-only integrity of both imported subsystems and selected provenance:

    python -B tools/verify_stage6_import.py

Optional original/archive checks, after the dedicated import commit:

    python -B tools/verify_stage6_import.py --require-git --original-root "C:\Users\mcdon\Documents\ChatGPT\First Encounter Game\work\rc0141-remediation\Room_Creator_v0_14_1_remediation_candidate" --preservation-root "C:\Users\mcdon\Documents\ChatGPT\First Encounter Game Archive\pre-migration-2026-10-18-stages-0-3"

This reads files, hashes and Git metadata only. It does not execute subsystem source. The 383 baseline paths must match the authoritative full-tree digest; tests/.gitattributes is an explicitly separate Git-only file. Four pre-existing original Python caches are excluded under the preservation policy and separately guarded.

The original 382-entry MANIFEST_SHA256.txt excludes itself; do not rewrite it to include new Git metadata. The original package .gitattributes stays intact. The new test-directory override is needed to preserve two CRLF test scripts through a real Git checkout.

Earlier verifiers retain their historical stage/status assertions and are preserved unchanged. Stage 7 execution requires explicit new authorization.
