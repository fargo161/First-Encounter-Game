# Repository verification tools

verify_stage4_import.py performs current Stage 4 membership/hash/source-fingerprint/Git checks only. It never executes subsystem source, builds, tests, evidence generation or browser verification.

verify_foundation.py is retained unchanged for the historical 33-file Stage 0-3 commit. Its pre-import assertions intentionally do not apply to the current checkout.

encounter-atlas-independent preserves the original accepted A1 review test source byte-for-byte. It is not a runnable in-place harness; its checkpoint/evidence sibling layout must be created in a disposable directory during a separately authorized Stage 5.
