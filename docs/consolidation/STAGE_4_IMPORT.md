# Stage 4 Encounter/Atlas import

Authority: ../provenance/governing/FIRST_ENCOUNTER_GAME_STAGE_4_AUTHORIZATION.md.

Imported baseline: Atlas-A1-person-source-v1, with unchanged AR0-projection-v1-R1-D01 and accepted M3 R3 dependencies. All 2731 files and 422798195 bytes of the accepted working snapshot are preserved under packages/encounter-atlas with exactly the original relative paths and bytes.

Source digest (132 independently enumerated execution inputs): 1a8558b3654e52881a288d2a5ab99e574878531f7a9d5fca86223e511146f085.
Full source-tree fingerprint: 01d90c554b2dc00bf169d98d8d4b36691f93311b3c0a81dc4d18da764008e76d.
Accepted checkpoint ZIP SHA-256: 867f3278e3d6a09937b43503c2b886724dd21593533c1ae929c858f970acd72e.

The package contains source/contracts, tests, fixtures, authored content, six directly imported saved-run evidence inputs, frozen runnable HTML, proofs, source identities, preserved dependency members and historical reports. Retaining the complete snapshot avoids trimming dependencies or rewriting existing preservation checks before Stage 5.

## Specific bounded archive exceptions

The approved policy permits deliberately selected tracked items. These eight existing package ZIPs are exact members of the 2310-file AR0 R1 dependency manifest. Removing any would fail the unchanged A1 preservation check. Earlier preservation helpers also directly open M2/M3 archives and independent M2 evidence. Keep them as locked verification fixtures; do not add other archives by default.

| Package-relative fixture | Bytes |
| --- | ---: |
| baseline/Encounter_M2_Checkpoint.zip | 1855021 |
| historical/Encounter_M3_Checkpoint.zip | 7534657 |
| historical/Encounter_M3_Checkpoint_R1.zip | 28146000 |
| independent/M1_Independent_Tester_Evidence.zip | 375777 |
| independent/M1_Independent_Tester_Evidence_R2.zip | 1016809 |
| independent/M2_Independent_Test_Evidence.zip | 2176404 |
| independent/m3-r1-review/reviewed-checkpoint/Encounter_M3_Checkpoint_R1.zip | 28146000 |
| independent/m3-review/reviewed-checkpoint/Encounter_M3_Checkpoint.zip | 7534657 |

Total: 76785325 bytes; largest individual file: 28146000 bytes. Large A1/AR0 checkpoint and independent-evidence bundles remain outside Git. Selection identities and justification are recorded per file in the import manifest. No archive was changed or deleted.

## Packaging and byte preservation

Only the enclosing repository path changed. No internal path, source, contract, test, fixture, generated baseline or historical documentation was edited. The original package README replaces the foundation placeholder; its old M3 wording remains unchanged. Current status is explained here and in the repository root.

Exact-byte Git attributes override foundation text rules for the package and copied reviewer artifacts. Manifest-selected logs that .gitignore would omit are explicitly staged; .gitignore is unchanged.

The independent A1 report and unchanged 21-case adversarial test are preserved outside the fingerprinted package. The test expects checkpoint and evidence siblings; Stage 5 must stage that documented layout in a disposable directory rather than editing the test or running it in place.

## Verification and stop

Stage 4 performs file membership/hash comparisons, the 132-input digest calculation, static required-input presence and Git byte integrity only. Prior independent acceptance is provenance, not a newly executed migration acceptance run.

No subsystem build, behavioral/adversarial test, source module import, evidence generation, launcher or browser review was run. IR3-25 remains disclosed and unchanged. No A2, Room Creator, ZANT, shared-contract, Unity, LFS, CI or archive cleanup work is included.

Stop before Stage 5.
