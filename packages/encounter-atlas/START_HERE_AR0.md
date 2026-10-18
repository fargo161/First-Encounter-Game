# Start here — Encounter AR0 Atlas Readiness

READY FOR INDEPENDENT AR0 REVIEW. Independent acceptance is pending. Stop at AR0; no Atlas UI or M4.

This package adds a read-only card/link projection over accepted M3 R3. All 1,430 accepted files remain byte-identical. Existing root README/test reports are preserved historical R3 documents; use this file for the current handoff.

## Review entry points

- `AR0_Preflight_Report.md` and `AR0_Implementation_Plan.md`.
- `AR0_Implementation_Report.md` and `AR0_Test_Results.md`.
- `AR0_Proof_Export_Index.md`, then `proofs/ar0/ui-initial-player.md` and `ui-recovery-author.md` / `ui-recovery-player.md`.
- `AR0_Independent_Tester_Handoff.md`.
- `evidence/ar0/source-identity.json`, `preservation.json`, `production-additions.patch`, `source-diff-classification.json`, `generated-evidence-summary.json`, `test-summary.json` and fresh logs/browser evidence.

## Launch the preserved game

Extract the new AR0 ZIP into its own folder. Open a terminal there, run `python scripts/serve-m3.py` and open its printed Local URL. Keep the terminal open; Ctrl+C stops it. The runnable HTML remains `dist-m3/index.html`, byte-identical to accepted M3 R3. Manual M3 Save/Open remains unchanged. No account, installation, internet or runtime AI is needed. Python 3 serves the game; Node 24+ runs the export/tests. Direct double-click launch remains unverified.

## Export Atlas-readiness data

```powershell
node scripts/atlas-export.mjs evidence/ar0/browser/ui-recovery.json exports/recovery-author author
node scripts/atlas-export.mjs evidence/ar0/browser/ui-recovery.json exports/recovery-player player
```

Each writes JSON, Markdown and network JSON from the same projection. Author files contain diagnostic truth; player files contain only the supported player-safe projection. This is proof data, not Atlas UI. The module API and catalog contract are described in the implementation report.

## Verify

```powershell
python scripts/check-ar0.py
python scripts/verify-checkpoint.py ..\Encounter_AR0_Atlas_Readiness_Checkpoint.identity.json
```

`check-ar0.py` runs all inherited gates plus the AR0 tests in an identical disposable sibling copy, the unmodified independent R3 suite, proof/browser replay and preservation. `--regressions` / `--evidence` split phases. The inherited IR3-25 synthetic contradiction intentionally remains failing under its accepted non-blocking classification; the helper requires exactly that one known failure, 24 passes and zero skips. Every other gate must pass. Exact outputs are retained rather than called all-green.

For fresh visible-browser checks, run `python scripts/serve-ar0.py`. `/normal/` serves exact accepted M3 bytes; `/collapse/`, `/missing/`, `/opacity/`, `/ancestor/`, `/horizontal/` add CSS only. Load the fresh `evidence/ar0/browser/ui-warned.json` through Open run and select Request / Request the whole customer file. Bring the preview area into view and deliberately Send. Inspect provenance and actual saved outcome. This helper creates no Atlas UI and alters no production executable bytes.

Keep the external identity beside the frozen ZIP. New freeze tooling accepts only the AR0 label and refuses overwrite. Accepted M3 R3 and its full original delivered tree remain at their original output paths; its exact external identity is also preserved inside `historical/`. No redundant R3 ZIP is nested again.
