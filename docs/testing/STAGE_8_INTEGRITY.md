# Stage 8 read-only import integrity

From the canonical repository, use bundled Python or suitable Python 3.12:

    python -B tools/verify_stage8_import.py
    python -B tools/verify_stage8_import.py --originals --require-git

Checks exact package/supplemental/documentation bytes, frozen manifest membership, 20 accepted-neutral locks, recorded ledger/matrix/run states, unchanged Encounter/Room Creator source/authority and Room Creator HOLD. --originals hashes all 6,722 originals and archive copies and checks original modification times plus excluded R5 cache. --require-git requires clean main and unchanged other-subsystem Git paths.

No ZANT source is imported/executed. No renderer, portable verifier, pixel replay, authoring, generator, test or browser runs. Prior behavioral results are preserved, not freshly rerun.

The 166-file canonical tree exactly matches the frozen failure packet. Wrapper documentation remains outside so its strict manifest can later verify a disposable copy without edits.

Stage 9 is not authorized. Proposed scope: STAGE_9_RECOMMENDED_SCOPE.md.
