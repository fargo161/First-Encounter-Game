# Stage 5 verification and current integrity

Stage 5 is complete. See ../consolidation/STAGE_5_VERIFICATION.md and ../provenance/encounter-atlas-stage5-verification.json. All subsystem execution occurred in disposable copies.

Read-only integrity of the current package and tracked Stage 5 evidence:

    python -B tools/verify_stage5_evidence.py

Optional local preservation checks:

    python -B tools/verify_stage5_evidence.py --require-git --original-root "C:\Users\mcdon\Documents\ChatGPT\First Encounter Game\work\Atlas_A1_Person_Source_Inspection" --evidence-root "C:\Users\mcdon\Documents\ChatGPT\First Encounter Game Archive\stage-5-verification-2026-10-18"

This reads files/Git; it does not execute subsystem source or repeat behavior suites. The original Stage 4 checker retains its Stage 4 metadata assertions and requires the historical Stage 4 state.

Completed execution:
- Git-archive extraction of 36f7e64d13ddf470bfc0ad949ea6965b996fab58:packages/encounter-atlas for the independent/browser checkpoint.
- Separate A1 tooling copy: node --test --test-reporter=tap tests/*.test.mjs; node scripts/build-m3.mjs; node scripts/build-atlas-a1.mjs; node scripts/generate-atlas-a1-evidence.mjs; python scripts/preserve-atlas-a1.py; python scripts/identity-atlas-a1.py.
- Unchanged standalone A1 independent test with checkpoint/evidence/fixtures siblings.
- Exact AR0 R1 extraction for python scripts/check-ar0-r1.py. Its preservation gates intentionally reject later A1 production additions; running it in A1 would be the wrong scope.
- Separate R1 checkpoint/before/checkpoint siblings for the unchanged 15-case independent test.
- Visible Chrome against the unchanged GET-only A1 server; unchanged preserved browser auditor; additional exact source audit for other saved points.

Logs record executable paths, working directories, arguments, times and exits. Full IR3-25 TAP is retained. Suite counts overlap and must not be summed as unique coverage.

The private 543-file selected index hashes DOM records, screenshots, live full-state closure captures, proofs, logs and harnesses. Duplicate source clones are omitted. Inherited output folders include historical and regenerated records; fresh command manifests identify actual executions. The index/small reports are tracked; bulk evidence is external.

The native computer-use JavaScript session was unavailable. Existing Node Playwright 1.62.1 with Chrome 155.0.8059.41 supplied visible checks; PNGs were inspected directly. An overbroad storage_location assertion and a UTF-8 helper-read issue were corrected in disposable verification tooling only and documented separately from baseline defects.

STOP before Stage 6.
