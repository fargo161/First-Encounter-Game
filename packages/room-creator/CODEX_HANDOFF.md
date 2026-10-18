# Room Creator v0.14.1 remediation candidate

**Candidate for independent testing. Canonical promotion has not been performed.** Start with `reports/REMEDIATION_REPORT.md`, `reports/TEST_REPORT.md`, and the separate `INDEPENDENT_TESTER_HANDOFF.md`.

This is a focused repair of the audited v0.14 candidate. Source remains under `source/`; rebuild with `python source/build.py`. Open `Room_Creator.html` in Chrome/Edge and connect the external, read-only `Trapstar_RoomCreator_Asset_Library_v1` through the working Library tab. The browser/placement/appearance/gameplay/Use Point/demo/routing design is retained. Format remains 11. Do not edit the built HTML directly.

The original supplied ZIP, canonical library and original v0.13.1 reference remain unchanged. Both shipped route maps remain byte-identical to v0.14. The full v0.13.1 prototype, rather than the reduced preview ZIP inside the library, is the baseline preservation reference. Exact hashes and the final preservation seal are in `reports/`.

Run `python tests/run_tests.py --suite node` for data/build checks. See `tests/README_TESTS.md` for portable browser commands, environment pinning, Windows/Bash wrappers and the restored preservation scripts. New regression suites address audit F1-F7 and the reproduced texture-cache reset. Some recovered scripts print measurements/screenshots; their exit codes alone are not assertions.

All changes must preserve unknown/custom metadata, open tag/point names, project-local looks/palettes/setups and missing reference IDs. Library providers remain read-only. Model load recovery is bounded; demo regeneration defaults to `generated/`, leaving the shipped baseline and demo intact.

Historical v0.14 completion claims and checksums are retained in `reports/v0_14_supplied/`; they are not claims about this candidate. The independent audit is retained as `reports/INPUT_AUDIT_REPORT.md`. Do not run `tests/route/make_route_scene.cjs` against the baseline.
