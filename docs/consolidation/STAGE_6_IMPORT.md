# Stage 6 Room Creator import â€” 2026-10-18

**Import integrity: complete. Product status: HOLD_FOR_FURTHER_REMEDIATION.** This stage imports the existing development baseline; no behavior verification or promotion is implied.

1. **Exact baseline.** Room Creator v0.14.1 remediation development candidate, from the authority-selected source and its preserved snapshot. All 383 baseline files / 201,955,025 bytes are unchanged. Source, tests, all 11 authored examples, format/data contracts, handoff, reports, previews and required historical fixtures are retained.

2. **Status.** HOLD_FOR_FURTHER_REMEDIATION, carried into README, AGENTS, source authority, known defects and stage gate. Original builder documents keep their historical candidate labels; the later independent audit governs the HOLD.

3. **Known defect.** ROOM_CREATOR_V0141_R1: palette/texture ID exists in the manifest, but its image file is missing. The global library report identifies missing files, while the object's appearance resolver/inspector silently falls back without object-specific warning/reset. No repair was made.


4. **Files/directories.** packages/room-creator now has the full 383-file baseline plus tests/.gitattributes, a separately recorded Git-only packaging file. Copied independent reports/results are in docs/audits/room-creator; unchanged independent scripts in tools/room-creator-independent. Selected asset manifests/checksums/license documents are under assets/manifests/room-creator-library-v1. Stage 6 adds provenance, authorization, import/integrity records, a read-only checker and a proposed Stage 7 scope. Bounded root/status/asset-lock documents are updated. Exact Git paths/counts are recorded in the private completion record.

5. **Commit.** The dedicated commit containing this file is the Stage 6 import commit, message: Import held Room Creator v0.14.1 baseline (stage 6). Full resulting SHA is in the completion response and private git-completion.json; this document cannot embed its own eventual commit hash.

6. **Local/remote main.** Completion requires clean local main and remote main at that same dedicated commit. The final Git comparison is retained in the private completion record.

7. **Fingerprints.** All 383 files match original source, preservation snapshot and checkpoint members. Full-tree SHA-256: 63521f0d9068de3e4da40cd8ec4573d17b26481aa6557a908caaa8d10a4c485b. Tree-manifest SHA-256: 73444d33f4dca2c5ac90beb5e3be3ccb3ed22ce87951567eb5b02fd3eabd2536. Candidate ZIP: 9b9cd3e9220edbdffbd836154b44d69b5527aa8b0d74300ad546f868a18da78d. All 382 original self-excluding checksum entries match. Packaged HTML remains 1,615,201 bytes, SHA-256 a4e8a14ddc4d734c036902f56b1a7d7bb8a157a77ef3911b97ea70c76f228c97. Checks are hashes/membership/CRC/Git only.

8. **Asset-library handling.** Full library/source packs remain external and read-only. Archive SHA-256: 4cf39cb712d55e866a593ad12394efec891d5ae3ac14dfd35d932b32bd8b1241. Exact ASSET_MANIFEST, package/source-pack manifests, CHECKSUMS and supplied license/status documents preserve stable IDs and source bindings for 327 models, 1,043 surface textures and three palettes. No raw library collection is imported. Existing project-embedded images remain part of required examples/fixtures. The 29 unverified vehicle license flags and raw pixel-art pack restriction remain unchanged.

9. **Path/packaging adjustments.** Map the candidate ZIP wrapper to packages/room-creator while keeping internal baseline names. Replace only the foundation placeholder README with the authoritative README. Add tests/.gitattributes because original parent rules would normalize two CRLF Python test files; the original .gitattributes remains unchanged. Deliberately track 54 preserved .log fixtures despite the global ignore. For historical ZIP reproduction in a later authorized stage, reconstruct exactly the original 383 baseline paths and wrapper name in a disposable folder, excluding the added Git metadata.

10. **Discrepancies/warnings/dependencies.** Four pre-existing original Python cache files are excluded under the established preservation policy and left untouched. Two original CRLF test files are preserved through the Git-only override. Historical manifests/claims/absolute paths remain exact, including the original 382-entry self-excluding manifest. Full assets and prior prototype packages are available in the external archive; optional prior-v0.12 comparisons are not required for import. No missing authoritative baseline file was found. Stage 6 preflight helper assumptions about cache exclusions, its saved helper path and the ZIP wrapper were corrected before import; these were tooling/layout observations, not application failures.

11. **Behavior.** No Room Creator behavior was intentionally changed. No source execution, build, test, evidence generator, browser run or dependency installation was performed. Format 11, coordinate conventions, unknown metadata, stable IDs and project-local appearance/setup semantics retain their original bytes.

12. **HOLD repair.** The known defect was not fixed, weakened or retested. Preserved prior findings remain prior evidence, not fresh Stage 6 behavior results.

13. **Encounter/Atlas.** Its 2,731 canonical files, historical reports, independent scripts and authority entry remain unchanged. Stage 5 acceptance with the IR3-25 limitation remains intact.

14. **ZANT.** Not imported; its README-only placeholder and authority entry remain unchanged. No integration, shared executable contracts, Unity, LFS, legacy-repository history/content import or CI was added.

15. **Originals.** Original source trees and preservation archives remain untouched. Room Creator's 383 baseline files and four excluded cache files are guarded. Completion rechecks the 6,722 preserved originals and their archive copies, plus original modification times. The private archive remains a same-drive checkpoint.

16. **Next action, not performed.** Review the import, then explicitly authorize the recommended Stage 7 Room Creator verification if desired. Use disposable copies, run supplied/independent/rebuild/browser gates, preserve known HOLD findings, compare examples and hashes, and report migration behavior separately from product promotion.

**STOP before Stage 7.** Current authorization is Stage 6 import only.

See [file-level import manifest](../provenance/room-creator-stage6-import.json), [independent HOLD audit](../audits/room-creator/AUDIT_REPORT.md), [current integrity instructions](../testing/STAGE_6_INTEGRITY.md), and [proposed Stage 7 scope](../testing/STAGE_7_RECOMMENDED_SCOPE.md).
