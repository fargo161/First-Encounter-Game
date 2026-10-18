# Stage 4 basic import integrity

From the repository root:

    python -B tools/verify_stage4_import.py --require-git

To compare against the untouched original tree, including original sizes/mtimes:

    python -B tools/verify_stage4_import.py --require-git --original-root "C:\Users\mcdon\Documents\ChatGPT\First Encounter Game\work\Atlas_A1_Person_Source_Inspection"

This read-only tool checks the exact 2731-file set, all SHA-256 values, full tree fingerprint, independently enumerated 132-input source digest, six required saved runs, eight selected ZIP fixtures, supplemental reviewer artifacts, unchanged non-Encounter records/placeholders and Git state.

It never loads subsystem modules or runs builds, tests, evidence generators or browsers. A PASS means import byte integrity, not Stage 5 acceptance.
