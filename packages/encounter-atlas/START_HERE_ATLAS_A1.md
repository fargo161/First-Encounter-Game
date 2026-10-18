# Atlas A1 — Person and source inspection

**READY FOR INDEPENDENT A1 REVIEW** — builder completion, not independent acceptance.

## Open Atlas

1. Extract the entire checkpoint ZIP into a new folder.
2. Double-click **Start_Atlas_A1.cmd**. Python 3 must be available; this PC was verified with Python 3.12.
3. The default browser opens Atlas. Leave the small server window open. If the browser does not open, copy the printed http://127.0.0.1 address into your browser.
4. Start with **After warning**, then choose **Orrin**, **Nera Vale**, **Tamsin** or **Collector** from People.
5. Expand **Source** to follow an assertion. Expand **Encounter details** only when you want the exact record.
6. Use **Inspection view** for full developer or player-received information. **Check read-only inspection** compares the reader inputs.
7. To finish, return to the server window and press Ctrl+C, then close it.

No installation, account, AI service or external assets are needed. The server listens only on localhost and serves only the Atlas page. Opening Atlas never edits the saved run.

For a different supported saved run, expand **Open your saved run**, choose a saved-run JSON file, optionally choose its matching catalog, then **Validate and open**. Leave the optional catalog blank for the supplied Last Collection data. A projection export is not a reloadable saved run; invalid inputs are rejected.

## Developer commands

Run these from the extracted folder:

```powershell
node scripts/build-atlas-a1.mjs
node --test --test-reporter=tap tests/*.test.mjs
node scripts/generate-atlas-a1-evidence.mjs
python scripts/preserve-atlas-a1.py
python scripts/serve-atlas-a1.py
```

Use Node 24 and Python 3.12 for the tested toolchain. No dependency installation is required. The standalone HTML is dist-atlas-a1/index.html; runtime QA used the HTTP launcher because browser-tool policy blocks file:// navigation. Direct-file launch is not certified.

Read ATLAS_A1_BUILDER_REPORT.md and ATLAS_A1_INDEPENDENT_TESTER_HANDOFF.md. Older Encounter/AR0 start files and reports are preserved historical dependency material; this is the A1 entry point. Stop at A1.

Atlas source: `Atlas-A1-person-source-v1`, SHA-256 `1a8558b3654e52881a288d2a5ab99e574878531f7a9d5fca86223e511146f085` (132 enumerated source/content/test/tool/fixture/launcher inputs).

Runnable Atlas HTML SHA-256: `b9612d61f41bcf2bee5085902ff65c5e418b226de3dd5c8af6490ccd15e4ae9f` (1,039,524 bytes).

Authoritative dependency: `AR0-projection-v1-R1-D01`; source digest `8dd542efed9f74573bcb1913d367f7c791d63c3830d65b7f35f68abdcb92f09c`; frozen R1 ZIP `f5566fdcfa82dc8aaee9378d7a0e894f10a4a2342100b7665cbd1c23e26e72da`. Accepted M3 R3 gameplay remains unchanged; runnable M3 HTML `8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb`. Package `package_0003` revision 1, digest `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f`. Catalog SHA-256 `21a0747936c3e8e7e9cf33833348ff6eb7b07a183179ce1e21181d618c854c5b`.
