# Encounter M3 R2 — Independent Re-review

Review date: 2026-10-18, America/New_York. Command timestamps use UTC.

**M3-D01 and M3-D02 are independently verified fixed in R2. A newly reproduced display-receipt defect, M3-D03, blocks advancement.** A notice hidden by `visibility:collapse` can be falsely acknowledged as displayed and authorize collection-service closure. Two fresh visible-browser reproductions and a production-bound executable assertion demonstrate the failure. No production code was modified or remediated. Testing ends at M3.

## Exact artifact and independent verification

| Component | Independently verified identity |
| --- | --- |
| Checkpoint | Encounter_M3_Checkpoint_R2.zip |
| ZIP SHA-256 | `c3c866834b64aebc573b42e2839e173bed486cdc8125a0287ddcd952f43a1a10` |
| ZIP size / members | 94,187,091 bytes / 1,152 files |
| Source revision | M3-runtime-v1-R2-D02 |
| Source digest, 61 independently enumerated entries | `7bbf91958abfb963830f412136baab95601da19cebc6673bf6d72207d18766d0` |
| Runnable HTML size / SHA-256 | 133,750 bytes / `7cbc1251a627631cf352e8a0cd8c5c78b93b76fedd1205a1e84676bfcecfbbe8` |
| Content revision | M3-protective-shortcut-v1 |
| Package | package_0003, revision 1 |
| Independently sealed package digest | `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f` |
| Preserved R1 ZIP | `f7afae2bfa1b75a4a8ec3e2ded09a7845671dbfb0ca9fc5ad487c655c6a68ed4` |
| Preserved original M3 ZIP | `de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64` |
| Preserved M2 ZIP | `940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7` |

Read START_HERE and the entire R2 tester prompt, R2 README and remediation report, and both preserved independent M3/M3-R1 reports. Inspected the actual production diff, UI function, new builder geometry assertions, retained display tests and independent-suite adapters. Earlier governing Master/approval/contract material remains the unchanged authority read in the previous independent reviews; the later owner rule controls: **No displayed closure notice = no closure.** The embedded builder remediation request was reference material, not authorization to implement changes during this review.

Before behavioral testing, independently verified ZIP length/hash, external identity fields, every member size/SHA-256, CRC integrity and exact membership. Rejected duplicate/case-colliding names, absolute/traversal/backslash/Windows-unsafe paths and non-regular archive entries. All checks passed. All 1,152 entries are regular files. The seven-file outer handoff and every external input were fingerprinted and preserved. Source paths were independently enumerated and their canonical digest recomputed, rather than trusting only the source manifest's list.

Fresh reviewed extraction: `C:/Users/mcdon/Documents/ChatGPT/encounter and rc/work/m3-r2-independent-review/checkpoint`. Preserved R1 and original M3 were separately verified against their matching manifests and freshly extracted as `r1-checkpoint` and `original-checkpoint`. All 235 manifest-listed preserved R1 independent evidence files and all 167 original independent evidence files were also verified.

The claimed production boundary is accurate: **only `src/m3/ui.mjs` changed from R1; no production file was added.** Engine, policy, knowledge, meaning, types, shared kernel and authored content bytes are unchanged. The UI diff adds finite/positive rectangle and viewport checks, ordered bounds and full viewport containment on both axes. Existing opacity and current-receipt behavior remain. All inherited test assertions remain intact: the single changed R1 test file supplies the previously omitted horizontal geometry and viewport-width argument only. That exact fixture-only transformation was independently checked. Other inherited test sources remain byte-identical. Full diffs and classifications are in the evidence.

Build/check tools ran in a disposable `tooling-clone`; the freshly rebuilt HTML equals the verified frozen build byte for byte. The frozen extraction was never used as a writable build/evidence destination. Final preservation rehashes all reviewed extraction members and original inputs.

## Fixed defects and fresh controls

M3-D01 is independently verified fixed for own opacity zero and ancestor opacity zero. M3-D02 is independently verified fixed for zero width and invalid horizontal placement. The new independent cases additionally cover offscreen left/right/above/below, partial left/right/vertical clipping, zero height, hidden, display none, visibility hidden, non-finite geometry/viewport, invalid viewport dimensions, negative/inverted geometry, stale/edited receipts, valid display and truthful receipt persistence.

For invalid displays, the new independent tests invoke the actual production function verbatim and dispatch its resulting command through the actual unchanged engine. They check normal receipt/refusal, open service, zero close results, exactly one `MISSING_CLOSURE_PREVIEW`, unchanged world/visit state, no extra physical result and exact retry idempotence. No builder fixture helper is imported by the new independent suite.

Fresh browser cases use the exact verified executable HTML. A tester-owned loopback host injects only a separate rendering-fault stylesheet. Removing it recreates the source HTML byte for byte; executable bytes remain unchanged. The normal route serves the exact unmodified R2 HTML. Provenance records source/served hashes and each CSS injection. This is explicit fault injection, not a claim that the normal shipped stylesheet already hides its notice.

| Fresh actual browser case | Receipt | Service open | Close results | Defects |
| --- | ---: | ---: | ---: | --- |
| Preserved R1, horizontal offscreen control | true, erroneous | false | 1 | none |
| R2, horizontal offscreen | false | true | 0 | one MISSING_CLOSURE_PREVIEW |
| R2, zero width | false | true | 0 | one MISSING_CLOSURE_PREVIEW |
| R2, own opacity zero | false | true | 0 | one MISSING_CLOSURE_PREVIEW |
| R2, preview ancestor opacity zero | false | true | 0 | one MISSING_CLOSURE_PREVIEW |
| R2, vertical offscreen | false | true | 0 | one MISSING_CLOSURE_PREVIEW |
| R2, visibility hidden | false | true | 0 | one MISSING_CLOSURE_PREVIEW |
| R2, display none | false | true | 0 | one MISSING_CLOSURE_PREVIEW |
| R2, genuinely visible + deliberate Send | true | false | 1 | none |
| R2, truthful receipt then actual scroll without edits | true | false | 1 | none |
| R2, visibility collapse, twice | true, erroneous | false | 1 | none |

The normal notice was genuinely visible before Send. For the scrolling control it was visible at top 456.2000/bottom 543.8500, then PageUp moved it to top 1124.2001/bottom 1211.8501 beyond viewport height 764. Geometry was re-read after scrolling settled. No draft was edited; Enter on the already focused Send control retained the truthful receipt. The initial immediate post-key geometry still showed the old position and is not counted as scroll proof. The final saved receipt, one closure and no technical defect are independently validated.

## Blocking M3-D03 — HIGH: CSS collapse hides the notice but authorizes closure

Location: `src/m3/ui.mjs:38`, the final acknowledgment condition in `acknowledgeVisibleNotice`.

The function rejects computed `visibility === 'hidden'`, but accepts `visibility === 'collapse'`. In the tested browser, collapse makes this ordinary notice element invisible while preserving a positive, fully contained rectangle. Opacity is 1 for the notice and all ancestors. The guard calls `markNoticeDisplayed` despite the invisible notice. The unchanged engine trusts that display receipt, chooses closure, commits one physical close result and records no missing-preview defect.

This is the same defined display-receipt boundary as the hidden/opacity/empty/offscreen checks. It does not require pixel-level occlusion, overlay analysis, accessibility certification or a rendering-engine redesign. The gap is retained from earlier guards, rather than introduced by the R2 geometry patch.

### Minimal independent reproduction

1. Run the supplied tester `display-server.py` from the evidence package. Its `/collapse/` route serves exact R2 executable bytes plus only:

   ```css
   #closure-notice { visibility: collapse !important; }
   ```

2. In the actual browser use **Open run** to load `evidence/r2-fresh-warned.json`. This is a legitimate intermediate generated during this re-review through New run and actual visible controls, not a builder-provided finished save. Authority is verified, warning delivered, service open, case unrecovered and repair unused.
3. Choose **Request the whole customer file**. Click the visible preview text to bring the preview region onscreen. The current closure notice is not visible. Its DOM text existing does not mean it is displayed.
4. Observed geometry: left 57.2000, right 405.6000, top 456.2000, bottom 543.8500, width 348.4000, height 87.6500, viewport 920 × 764. Computed visibility is `collapse`, display `block`, opacity `1`; hidden is false. Every ancestor's opacity is 1.
5. Capture the blank region before Send; then deliberately click **Send anyway**, complete Intake and Delivery and export Save run/Author inspector.

Both fresh reproductions produce:

| Required result | Actual result |
| --- | --- |
| No valid display receipt | `displayed: true` |
| Communication may be received/refused; service remains open | `serviceOpen: false` |
| Zero physical close results | One physical close result |
| Exactly appropriate missing-preview technical defect | No technical defect |

The prior warning/history and Send anyway label do not replace the required displayed current notice. The frozen owner rule remains violated.

Decisive pixels: `evidence/D03-collapse-before-send-verified2.jpg`, `D03-collapse-repeat-before-send.jpg` and `D03-collapse-closure-result.jpg`. They were visually inspected and agree with the measured current state. Earlier initial captures during a viewport transition remain raw history and are not decisive proof; see SCREENSHOT_VALIDATION.md.

Complete failing saves: `display-collapse-run.json` and `display-collapse-repeat-run.json`, with actual raw inspector exports, generated readable transcripts and geometry. Both pass full deterministic journal replay and exact retry validation. `independent-collapse-reproducer.json` retains the verbatim production guard, actual measured vector, original command, falsely marked command, outcomes and complete resulting save.

The new independent assertion **IR2-20** reads the real measured collapse geometry, invokes the actual production guard and dispatches the result through the actual engine. It fails with expected receipt false/open service/zero closure/one technical defect versus actual receipt true/closed service/one closure/no defect. No production code was changed to make the test fail or pass.

## Fresh suites and independence

| Executed suite | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| M0 audit | 7 | 0 | 0 |
| Builder M1/M2/M3/R1/R2 | 136 | 0 | 0 |
| Retained independent M1 | 22 | 0 | 0 |
| Retained independent M2 | 18 | 0 | 0 |
| Prior independent M3 | 18 | 0 | 0 |
| Original independent M3-D01 | 1 | 0 | 0 |
| Prior independent R1 rendering suite including D02 | 9 | 0 | 0 |
| New independent R2 cases IR2-01–20 | 19 | 1 | 0 |

Supplied checks were freshly run in the disposable clone, with commands, outputs and exits retained. Builder-generated historical evidence validation is labeled regression evidence, not fresh independent browser proof. The M3 adapter changes only the exact old source-digest expectation and evidence output directory in memory. The independent R1 adapter supplies its measured viewport width to the extracted function and isolates writes. Neither skips cases nor changes behavioral assertions; original independent source files remain byte-identical. The inherited builder fixture completion also preserves assertions.

Builder coverage checks visibility hidden but not visibility collapse. Its all-green result therefore does not contradict the new failing independent case. The original D01 test exits before geometry on opacity zero and is complemented here by a fuller independent matrix and actual browser tests.

The independent suite was first executed with an abstract collapse vector and then bound to freshly measured browser geometry; these are repeated executions of the same 20 cases. Vector loops, two browser failure reproductions, 23 saved exports, 76 captured policy calls and trace comparisons are not inflated into extra automated test counts. The preserved-R1 browser failure is an expected before-fix control, not an additional R2 regression failure.

## Wider M3 regression results

- **Fresh Seed A and repair continuity:** New run, explicit ticket verification, Compassionate/Overt protected first request, distinct Intake/Delivery, permission-only save, real extract inspection/tray search, Tamsin's separate evasive reply, Orrin's limited account, unnecessary ordinary-money refusal, owner inquiry and later broad demand. Why, End/reopen, partner changes and vague apology leave repair unused. Substantive case-only acceptance repairs once while preserving warning and authority, with comparison/recovery still false. Saved, started a new run, loaded the exact repaired state and continued.
- **Custody, payment, confirmation and history:** performed the actual comparison, saved pending terms, sent conversational acknowledgment without transfer, separately corrected the record, then confirmed exact handover. Recovery costs zero; balance remains 1200 minor units; custody changes once to the player while Nera remains owner. Original shorthand remains before the appended correction. Post-recovery protected demand leaves the entire completed world unchanged.
- **Save/read/retry purity:** repaired save/load exports are exactly equal. Inspector and response replay/skip leave the complete recovered export unchanged. Every one of the 23 fresh UI exports passes complete deterministic replay and exact final-command retry equality. Fourteen actual UI inspector exports exactly match reconstructed traces; other traces are explicitly generated. Retained independent assertions freshly check malformed/tampered saves, duplicate results, stale/altered confirmations, atomic transfer failure and warning/repair persistence.
- **Privacy, knowledge, portability and host boundary:** retained independent M3 cases freshly exercise equal outward paths with different private selectors, hidden-truth perturbation, unheard conversation, unread inspection details, observer-local source reads, absent owner, neutral renaming, and separation from Trapstar/Room Creator spatial implementation. Core/content byte preservation supports the narrow R2 boundary. No new blocker was reproduced in these classes.
- **Causal inspector:** external runtime instrumentation recorded 76 actual policy calls while replaying ten fresh journals, including both collapse failures. Every actual filtered input equals reconstructed decisionInput; candidates, selected result and notice option agree. The wrapper records arguments/results in memory and changes no checkpoint file or policy algorithm. Actual raw UI traces are separately compared. All captures and comparison assertions are retained.

## Environment, evidence and reproduction

Windows 11 build 26200; PowerShell 7.6.5; Node v24.18.0; npm 11.16.0; Python 3.12.0; Git 2.55.0.windows.3; actual desktop in-app browser. Exact browser-engine version, other browsers and mobile/accessibility certification are unclaimed. No dependency installation, runtime AI or external asset download was needed. The read-only fault host bound only `127.0.0.1`, on port 54872 during successful browser testing, and was stopped afterward; the review tab was closed.

The first sandboxed server attempts could not accept loopback connections because local sockets were restricted. The same read-only server was started with approved execution outside that restriction. Those setup failures and subsequent cleanup are preserved. One reviewer evidence enumeration initially included a generated trace as if it were a save; that correctly caused INVALID_RECORD. The harness filter was corrected to select saves, without changing production code or weakening validation, then all 23 exports validated. Initial screenshot/scroll/viewport transitions are documented separately. These setup issues are not additional product defects.

The evidence ZIP contains this report, independent sources/reproducer, CSS host/provenance, all fresh outputs, actual UI saves/inspectors/transcripts/screenshots, actual policy captures, environment/command logs, independent member/source/preservation checks and the seven unchanged supplied handoff inputs. The frozen checkpoint is identified input. `EVIDENCE_MANIFEST.json` records every evidence member's size/SHA-256. Exact tool/shell/browser commands and available outputs are exported from this turn's execution record; child suite logs retain exact arguments, bindings and exits.

To reproduce, extract the evidence ZIP into a fresh directory and extract `reviewed-checkpoint/Encounter_M3_Checkpoint_R2.zip` into `checkpoint/` beside the tester sources. For the preserved control also extract its embedded historical R1 ZIP into `r1-checkpoint/`. Do not overwrite existing extractions.

```powershell
node --test --test-reporter=tap independent-r2-display.test.mjs
node --test --test-name-pattern=IR2-20 independent-r2-display.test.mjs
node export-evidence.mjs
node audit-causal.mjs
python display-server.py
```

Expected full new suite: 19 pass, 1 fail (IR2-20). The minimal selected-case command reproduces that same failure; filtered other cases are not a new full-suite skip count. Fresh export validation and causal audit pass. Use `/collapse/` with the fresh warned save and visible controls for the actual browser failure. Use `/normal/` for the genuinely visible positive control and the declared fault routes for the fixed D01/D02 negative controls.

Frozen checkpoint, supplied inputs and historical extractions remain unchanged. No M4, Seed B, Assembler, NPC initiation, remediation or host spatial/navigation implementation was begun. M3-D03 is the sole new blocking defect found in the executed R2 re-review.

**NOT READY FOR NEXT SCOPE**
