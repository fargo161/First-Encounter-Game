# Encounter — M2 paperwork review build

One connected interaction: request the case paperwork, deliberately inspect the offered handling extract, and report the discovered signature detail. This checkpoint stops after M2 and awaits independent testing.

## Launch the verified browser build

1. Extract **Encounter_M2_Checkpoint.zip** to a normal folder. Keep its folders together.
2. Open that extracted folder in File Explorer. Click its address bar, type `powershell`, and press Enter.
3. Run this exact command (Python 3 is required):

```powershell
python scripts/serve.py
```

4. Open the `Local: http://127.0.0.1:8765/` address printed by the command in a browser. If the port is busy the command prints a different port; use that exact address.
5. Keep PowerShell open while playing. Press Ctrl+C there when finished.

The server serves only the included static `dist/index.html` on this computer's loopback interface. The build has no required runtime network service, external font, image, library, model or dependency download. Node is unnecessary to play the supplied build.

The HTML is self-contained and can also be opened directly from `dist/index.html` in compatible browsers. **Direct file/double-click launch was not verified**: the test browser prohibits file URLs. The localhost instructions above were exercised end to end in the Codex in-app Chromium browser on Windows 11.

## Play the M2 path

1. Keep **Request → Request case paperwork** selected. Choose Boundaried, Compassionate or Menacing, and any salience. Read the exact communication preview. Changing these options does not send anything.
2. Click **Send message**. The clerk enters **Intake**. Click **Continue to Delivery** to read the explanation of the file split and the limited access offer.
3. Click **Return to composer**. Permission has been granted, but nothing has been inspected yet.
4. In **Your notebook**, click **Inspect handling extract**. The recipient-signature field is now recorded as unfilled. The private contact value stays unavailable in gameplay.
5. Choose **Remark**. Read the new preview about the inspected signature detail, then click **Send message**.
6. Continue from **Intake** to **Delivery**. The clerk acknowledges your report and offers the next verification step. That verification/recovery is outside M2.

**Skip to composer** and **Replay latest response** change presentation only. The initial ordinary request remains protected for all nine available vibe/salience combinations. The 24-action soft reminder never closes service or creates a failure deadline.

Offer is displayed but disabled. Only request access and challenge a record are implemented. The registry retains all six future acts and all twenty BASED catalog entries; this authored package uses three contrasting expressions.

## Save, open and inspect

- **Save run → Download JSON** saves the full current-format run. You may also copy the entire JSON text. Save before closing or choosing New run; there is no autosave.
- **Open run** accepts the complete JSON pasted from that file. Click **Load this run**. Imports verify the exact package digest, domain state and a complete deterministic replay of committed commands before replacing the current run. Invalid/legacy saves leave it unchanged. Old storage keys are never read or converted.
- **Author inspector** opens the read-only causal trace. **Refresh inspector**, **Export trace** and **Export package** never commit actions.
- Package/run exports are author/debug snapshots and contain the synthetic authored fixture secrets. They are not player knowledge projections or encrypted save files. In-game notebook and NPC decision inputs receive only permitted observations.

To inspect the delivered example, open **M2_Interaction_Run.json**, copy its complete text, and import it through Open run. It restores revision 3. The generated transcript and matching inspector trace are supplied beside it.

## Source and reproduction

Tested tools: Node v24.18.0, npm 11.16.0, Python 3.12.0. No install step or package dependencies are required. From the extracted root:

```powershell
node scripts/build.mjs
node scripts/audit-baseline.cjs
node --test --test-reporter=tap tests/*.test.mjs
$env:ENCOUNTER_CHECKPOINT = (Get-Location).Path
node --test --test-reporter=tap independent/M1_Independent_Contract_Tests.test.mjs
python scripts/source-identity.py
node scripts/generate-evidence.mjs
```

`npm.cmd test`, `npm.cmd run build` and `npm.cmd run test:independent` are shortcuts. The independent test command above explicitly binds the checkpoint under test.

Core contracts are in `src/contracts.mjs`, `runtime.mjs`, `views.mjs`, and `action-boundary.mjs` (all byte-identical to approved R2). M2 integration is in `src/encounter.mjs`, `compiler.mjs`, `policy.mjs`, and `package.mjs`; browser controls/presentation are in `ui.mjs`, `shell.html`, and `ui.css`. Authored scenario data is `content/last-collection.json`. Build generates the sealed `content/last-collection.mjs` and self-contained HTML.

Plain JavaScript uses strict runtime contracts, immutable boundary snapshots, staged validation and Node's built-in deterministic tests. The bounded M2 rules need no downloaded compiler or general engine framework.

## Review materials and identity

- `Test_Results_and_Scope.md`: fresh test results, coverage, limits and M2 scope.
- `M2_Interaction_Transcript.md`, `M2_Inspector_Trace.json`, `M2_Interaction_Run.json`: the same actual browser run, validated against the implementation.
- `M0_Baseline_Inventory_and_Reuse_Plan.md`: preserved M0 audit.
- `M1_M2_Contract_Note.md`: current M2 integration addendum followed by the historical R2 note.
- `independent/M1_Independent_Tester_Review_R2.md`: READY FOR M2 applies to exact R2, not a new M2 verdict.
- `evidence/M2_*`: fresh M2 logs, browser checks/screenshots and source identity. Other retained logs and `M1_Defect_Remediation_Report.md` are historical M1 evidence.

The immutable review target is **Encounter_M2_Checkpoint.zip** with the adjacent **Encounter_M2_Checkpoint.identity.json** (archive SHA-256 plus every member hash). No git repository exists. Verify from the extracted root with the external identity path:

```powershell
python scripts/verify-checkpoint.py ../Encounter_M2_Checkpoint.identity.json
```

Packaging tool: `python scripts/snapshot.py Encounter_M2_Checkpoint`. It refuses existing archives/identities and any old M1 checkpoint label. Work from a separate disposable extraction when exercising this tool.

M3, collection closure, the missing-preview fallback, restrictions/repair, final recovery, exchanges and full coverage remain deferred. A new owner instruction is required before M3. The specific missing-preview fallback still requires owner confirmation before that later work.
