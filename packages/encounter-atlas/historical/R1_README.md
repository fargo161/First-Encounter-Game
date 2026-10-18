# Encounter M3 R1 — M3-D01 remediation

READY FOR INDEPENDENT M3 RE-REVIEW. Stop at M3; independent re-review is pending.

This separately identified checkpoint fixes the browser receipt for a fully transparent closure notice. The failed M3 checkpoint is preserved unchanged under `historical/` and at its original delivery path. Only `src/m3/ui.mjs` changed in production; engine, policy, knowledge, contracts and authored package are unchanged.

## Launch

1. Extract `Encounter_M3_Checkpoint_R1.zip` into a new folder.
2. Open a terminal in that extracted folder.
3. Run `python scripts/serve-m3.py` and open its printed Local URL.
4. Keep the terminal open while playing; Ctrl+C stops the loopback helper.

The runnable build is `dist-m3/index.html`; source is in `src/` and `content/`. No package installation, account, internet or runtime AI is required. Python 3 serves the build; Node 24+ is needed only for rebuilding/testing. Direct double-click launch remains unverified.

## What changed

The display acknowledgment now rejects computed opacity zero on the notice or any ancestor before setting the receipt. Existing hidden/display/visibility/geometry/viewport checks remain. No notice means normal receipt/refusal, service open, no close result and `MISSING_CLOSURE_PREVIEW`. No extra player-facing consequence is added. Visible deliberate closure and completed-recovery protection remain intact.

## Play and save

Show/verify the ticket, request paperwork, deliberately inspect the handling extract and search the permitted tray. Orrin supplies his limited account through a separate partner approach. Present learned evidence, perform the supervised case-only comparison, read zero-payment terms and confirm exact handover separately. Nera remains owner. Ordinary payment is declined as unnecessary; record correction is a separate optional result.

For repair, the received owner-interest/broad-scope pattern can produce restriction and an earlier visit-long warning. Accepting the case-only comparison substantively repairs; it does not perform that physical comparison. Why, drafting, previewing, End and partner changes do not consume repair. Warning/history persist. A later qualifying demand can close service only after the current consequence notice was actually displayed. Completed recovery cannot be undone.

Save manually with **Save run**. To load a fixture, open its JSON in an editor, copy all text, choose **Open run**, paste and **Load this run**. Loading validates the package and complete journal without new effects. No autosave or old-save conversion exists. The Author inspector includes diagnostic hidden facts and is not a player-information surface.

## Current reports and evidence

- `M3_D01_Remediation_Report.md`: exact fix, identities, before/after evidence, preservation, tests and limits.
- `Test_Results_and_Scope.md`: current fresh totals and reproduction instructions.
- `evidence/m3-d01/`: fresh R1 browser saves, geometry, screenshots, raw/generated traces, transcripts, test outputs and preservation.
- `independent/m3-review/`: unchanged supplied independent evidence, report and test sources. Its historical verdict concerns the failed checkpoint.
- `historical/`: failed frozen checkpoint/identity and original README/test report. `M3_Implementation_Report.md` and `Browser_Test_Record.md` describe the original implementation; they do not override M3-D01 or the current report.
- `runs/`, `transcripts/`, `traces/` and `evidence/m3/` retain the earlier M3 evidence, freshly revalidated by the unchanged engine. Their captures are historical, not fresh R1 clickthroughs. Current clickthroughs are exclusively under `evidence/m3-d01/`.

Fresh R1 fixture entry points include `browser-repaired.json`, `browser-recovery.json`, `browser-visible-closure.json`, `browser-after-transparent.json` and `browser-offscreen.json` under `evidence/m3-d01/`. The last two retain open service and the technical defect; no closure occurred.

## Rebuild and verify

```powershell
node scripts/build-m3.mjs
python scripts/check-m3-r1.py
```

The R1 helper runs all inherited M0/M1/M2/M3 checks, five new builder display regressions, independent M3 assertions with explicit new identity binding, the unchanged independent defect reproducer, fresh browser export validation and preservation. It records arguments, working directories, exits and outputs.

For fault reproduction, `python scripts/serve-m3-d01.py` prints a loopback URL. `/normal/` serves the exact new build; `/transparent/` adds only opacity-zero CSS; `/offscreen/` adds only an offscreen CSS rule; `/before/` adds opacity-zero CSS to the preserved failed build. Load the supplied review's warned save to compare the same starting state. Harness markup is separate from production and preserves executable bytes.

Keep `Encounter_M3_Checkpoint_R1.identity.json` beside its ZIP. From an extracted folder, verify with `python scripts/verify-checkpoint.py ..\Encounter_M3_Checkpoint_R1.identity.json`. R1 freeze tooling refuses existing artifacts and old labels.

Known limits: fallback art/wording, manual bounded saves, one desktop browser QA, no cross-browser/mobile/accessibility certification, and no claim of exhaustive occlusion/rendering-fault detection. M4, Seed B, full Assembler, NPC initiation and host spatial systems remain deferred.
