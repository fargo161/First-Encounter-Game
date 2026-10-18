# Encounter M3 R1 — Independent Re-review

Date: 2026-10-18, America/New_York.

**The original M3-D01 opacity defect is independently verified fixed in R1. A newly identified geometry defect, M3-D02, still blocks the M3 gate.** A notice wholly outside the horizontal viewport, or with zero width, is falsely acknowledged as displayed and permits collection-service closure. Both cases were reproduced through actual browser controls and independent executable assertions. No production code was modified or defect remediated.

## Exact artifact and preservation

| Identity | Independently verified value |
| --- | --- |
| ZIP | Encounter_M3_Checkpoint_R1.zip |
| ZIP SHA-256 | `f7afae2bfa1b75a4a8ec3e2ded09a7845671dbfb0ca9fc5ad487c655c6a68ed4` |
| Bytes / members | 28,146,000 / 592 |
| Source revision | M3-runtime-v1-R1-D01 |
| Source digest, 54 entries | `35fa58990b19a08933fefb7e2f37ba1d5c5edc5807390354eae238e531588711` |
| Browser build SHA-256 | `11393dde2ae110d3b04aac03c1044e000be6b410e4bffacb16216829c9050052` |
| Preserved failed M3 ZIP SHA-256 | `de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64` |
| Preserved M2 ZIP SHA-256 | `940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7` |
| Unchanged content/package | M3-protective-shortcut-v1; package_0003, revision 1; digest `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f` |

Independently verified ZIP length/hash, every member's size/SHA-256, CRC integrity, exact membership, duplicate/case-colliding names, absolute/traversal/backslash/Windows-unsafe paths and special-file entries. All passed before behavioral tests. The source digest and package digest were separately recomputed. The outer handoff's four inputs, matching external identity and original Downloads handoff are fingerprinted in the evidence.

Fresh extraction: `C:/Users/mcdon/Documents/ChatGPT/encounter and rc/work/m3-r1-independent-review/checkpoint`. The failed checkpoint was separately verified against its matching identity and freshly extracted as `failed-checkpoint`. Existing builder and earlier tester directories were not substituted or overwritten.

The claimed production boundary is accurate: **only `src/m3/ui.mjs` differs in production**. No production file was added. All other source/content and inherited test bytes match the failed M3 checkpoint. The only UI diff adds an opacity check walking the notice and its ancestor chain. Generated build/evidence, source-revision tooling, added test/tool files and documentation changes are separately classified in `independent-preservation-diff.json`. The prior independent report/evidence were read and all 167 manifest-listed preserved evidence files were verified.

The final preservation check verifies that all 592 R1 extraction members, all 189 failed-control extraction members, supplied ZIP/identity and original outer handoff remain unchanged. The loose remediation report equals the checkpoint member. Build/check tools ran only in a disposable tooling clone.

## Original M3-D01 result

The original independent reproducer was retained unchanged. It freshly fails against the preserved failed source and passes against R1. Actual browser controls also reproduced the old transparent-notice closure, then verified both R1 opacity fixes:

| Fresh rendering case | Display receipt | Service open | Close results | Technical defects |
| --- | ---: | ---: | ---: | ---: |
| Failed M3, notice opacity 0 | true, incorrect | false | 1 | 0 |
| R1, notice opacity 0 | false | true | 0 | 1 |
| R1, preview ancestor opacity 0; notice's own opacity 1 | false | true | 0 | 1 |

R1's fallback records exactly one `MISSING_CLOSURE_PREVIEW`, receives/refuses the demand, leaves world state unchanged, and introduces no extra player punishment. The new ancestor walk addresses the fact that computed opacity is not inherited. No engine/policy behavior was weakened to obtain these results.

## Blocking M3-D02 — HIGH: incomplete geometry permits false display receipts

Location: `src/m3/ui.mjs:36`, the final condition in `acknowledgeVisibleNotice`; receipt propagation remains through the unchanged send/engine/policy path.

The condition checks positive **height** and vertical viewport containment, but checks neither **width** nor horizontal viewport containment. As a result, a completely invisible notice can still be marked displayed. This geometry weakness is retained from the previous guard; it is newly identified here, rather than evidence that the opacity patch introduced it.

### Independent browser reproduction

The tester-owned `display-server.py` serves exact frozen executable bytes with separate CSS-only rendering failures. Removing the injected style recreates the exact verified HTML bytes. The normal route serves byte-identical R1 HTML. No source, executable script or frozen artifact is edited.

All cases start by loading `evidence/r1-fresh-warned.json`, generated during this re-review through New run, ticket verification, protected request, actual extract/tray actions, separate Tamsin/Orrin conversations, ordinary-money refusal, owner-location inquiry and a later broad demand. Authority is verified, service is open, the warning is delivered, and repair is unused. This is not a builder-supplied completed fixture.

For the **horizontal** route, the injected CSS is:

```css
#closure-notice {
  position: fixed !important;
  left: -10000px !important;
  top: 100px !important;
  width: 300px !important;
}
```

The measured rectangle was left −10000, right −9700, top 107, bottom 214.8000, height 107.8000, in a viewport 920 wide × 764 high. The notice is wholly outside the horizontal viewport. It was never visibly displayed for this draft. Select **Request the whole customer file**, then use the visible **Send anyway** control. The command nevertheless records `displayed: true` and closes service.

For the **zero-width** route, the notice is fixed at left 100/top 100 with width/min-width/max-width 0, height 100, zero padding/border, and hidden overflow. Measured rectangle: left = right = 100, width 0, top 107, bottom 207, height 100. The notice paints no readable content, but the same false acknowledgment and closure occur.

| Required handling for both invisible notices | Actual result |
| --- | --- |
| No valid display acknowledgment | `displayed: true` |
| Service stays open | `serviceOpen: false` |
| No physical service-close result | One close result |
| Record missing-preview technical defect | Zero defects |

Both failures were repeated through visible browser controls. Decisive, visually inspected screenshots are `D02-horizontal-verified-before-send.jpg`, `D02-horizontal-verified-result.jpg` and `D02-zero-width-verified-before-send.jpg`. Complete original and repeated run exports, measured geometry, inspector exports and generated transcripts are included. The saved failures pass full deterministic journal replay and agree with actual UI inspector data.

The new independent tests `IR1-04` and `IR1-05` extract the production acknowledgment function verbatim, supply geometry/styles measured from the real browser, then dispatch its receipt through the real unchanged engine. Both requirement assertions fail with one closure and no technical defect. `independent-horizontal-reproducer.json` and `independent-zero-width-reproducer.json` retain the submitted command, resulting receipt, actual outcomes and complete run.

Requirement basis: the user's R1 checks 3–4 and the unchanged owner rule **No displayed closure notice = no closure**; Master §2.12 C2/D.6 and LC-T69. These are ordinary viewport/empty-box failures explicitly within this re-review, not a request to certify arbitrary overlays, pixel readability or future rendering systems. A previous warning and the Send anyway label do not replace the required current notice.

## Fresh checks and controls

| Fresh execution | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| M0 baseline audit | 7 | 0 | 0 |
| Builder M1/M2/M3/R1 suite | 117 | 0 | 0 |
| Unchanged independent M1 | 22 | 0 | 0 |
| Unchanged independent M2 | 18 | 0 | 0 |
| Prior independent M3 behavioral suite | 18 | 0 | 0 |
| Original independent M3-D01 reproducer on R1 | 1 | 0 | 0 |
| New independent R1 cases IR1-01–09 | 7 | 2 | 0 |

The unchanged original reproducer also produced its expected single failure on the failed M3 control. That is a successful before-fix reproduction, not an R1 failure. Repeated runs/loops, browser retries and the same D01 test executed again are not additional distinct cases.

The supplied R1 regression runner was inspected and freshly executed in the disposable clone, not accepted from its archived output. Its retained M3 suite adapter changes only the old exact-source digest expectation and evidence output directory in memory; all behavioral assertions remain intact and the original test file stays unchanged. Its historical M3 browser fixtures are regression inputs, not fresh R1 browser proof. This review separately generated fresh R1 UI evidence and independent rendering tests. The builder's five added tests cover vertical offscreen/height checks but omit horizontal bounds and zero width, explaining their all-green result alongside M3-D02.

Fresh build and generated-evidence checks reproduced all deterministic artifacts. Only execution logs and preservation reports changed in the tooling clone. All inherited test sources and shared kernel modules remain byte-identical; they were not skipped or repointed to replacement behavior.

Focused visible-browser controls passed for vertical offscreen, CSS visibility hidden, display none and zero height: false acknowledgment, open service, zero close results, one appropriate defect. A genuinely visible current notice closed exactly once. A notice first genuinely displayed was then moved offscreen by PageUp without editing the draft: its top became 837, beyond viewport height 764. Its truthful receipt remained valid and deliberate sending still closed once. The earlier PageDown attempt did not scroll and was not used as evidence for this requirement.

## M3 regression findings

- **Complete Seed A recovery:** fresh New run, explicit authority action, Compassionate/Overt protected first request, separate Intake/Delivery, permission-only and partial-evidence saves, actual inspection/search, limited Orrin account, separate Tamsin evasive reply, ordinary payment refusal, privacy restriction, clarification, substantive repair, actual comparison and exact handover. Cost 0; balance 1200 minor units; one custody change; Nera remains owner; private contact undisclosed. Correction appends a revision and retains original shorthand.
- **Repair/continuity:** Why, drafts, End/reopen, partner changes and vague apology did not consume repair. Substantive comparison acceptance used it once, retained authority/warning and did not perform comparison/recovery. The repaired save reloaded exactly, then completed recovery. An incompatible import left the current valid run unchanged.
- **Confirmation, money and outcomes:** conversational acknowledgment did not transfer custody; exact confirmation remained separate. Complete exports stayed equal across inspector/replay reads. Post-recovery protected demand left the entire world unchanged. Inherited and retained independent cases freshly exercise stale/altered terms, atomic balance/custody failure, exact retry/result idempotence and save tampering.
- **Privacy/local knowledge, portability and host boundary:** unchanged core/content plus fresh retained independent M3 tests cover private-selector equality, hidden-truth perturbation, unheard conversation, unread inspection detail, source-pointer filtering, absent Nera, substantive repair, neutral renaming of identities/prose, and absence of Last Collection/host-spatial branches. No additional blocker was reproduced in these classes.
- **Causal inspector:** separate external runtime instrumentation captured 62 actual policy calls while replaying eight fresh R1 browser journals, including both geometry failures. Every captured filtered input equals reconstructed `decisionInput`; candidates, selected result and notice options agree. The wrapper records arguments/results in memory and changes no checkpoint file or policy algorithm. Fresh raw UI inspector exports were separately compared with their saved runs.

Twenty-nine fresh UI save exports, including the failed-build control and repeated focused cases, were independently replay-validated. Fourteen corresponding raw UI inspector exports were compared; other matching traces were generated from validated saves and are labeled accordingly. Readable transcripts bind source/package/run identities. These are evidence artifacts, not extra test-count inflation.

Some initial rapid screenshot captures retained an earlier Open run dialog. Those files remain raw capture history and are not used as decisive pixel proof. Browser visibility was restored, the critical states were restaged, and screenshots were captured in separate calls and visually inspected. `SCREENSHOT_VALIDATION.md` lists the validated images.

## Environment, evidence and reproduction

Windows build 26200; PowerShell 7.6.5; Node v24.18.0; npm 11.16.0; Python 3.12.0; Git 2.55.0.windows.3; desktop in-app browser. Exact browser-engine version and cross-browser certification are not claimed. The read-only host bound loopback only, on port 60948, serving exact normal HTML and explicit CSS-only fault variants. No dependencies, runtime AI or external assets were needed. No production code was modified. All test output lives outside the frozen extraction. Exact commands, outputs/exits, environment bindings and browser tool calls are included.

The evidence ZIP contains this report, independent test/harness sources, fresh logs, identity/member/source verification, production diff, original inputs, fresh saves/traces/transcripts, validated screenshots, policy captures and final preservation record. Builder reports remain identified input/comparison material. Every listed evidence member has a size/SHA-256 in `EVIDENCE_MANIFEST.json`.

To reproduce, extract the evidence package into a new directory. Extract `reviewed-checkpoint/Encounter_M3_Checkpoint_R1.zip` into fresh `checkpoint/`, then its `historical/Encounter_M3_Checkpoint.zip` into fresh `failed-checkpoint/` beside the reviewer scripts. Do not overwrite existing extractions.

```powershell
node --test --test-reporter=tap original-D01-before.test.mjs
node --test --test-reporter=tap original-D01-after.test.mjs
node --test --test-reporter=tap independent-r1-display.test.mjs
node audit-causal.mjs
python display-server.py
```

Expected: original D01 fails on the old control and passes on R1; the new suite has seven passes and two M3-D02 failures. For just the minimal failing cases, run Node with `--test-name-pattern=M3-D02` before the test filename. For actual UI reproduction, open the printed host's `/horizontal/` or `/zero-width/`, use Open run to load `evidence/r1-fresh-warned.json`, choose the whole-file request and Send anyway. The CSS failure is active before that draft can acquire any receipt. Expected is refusal/open service plus technical defect; actual is closure/no defect.

The server and review-created browser tab were cleaned up after evidence capture. No M4, Seed B, Assembler, NPC initiation, remediation or host spatial/navigation work was begun. Original M3-D01 is fixed in the exercised R1 opacity cases; M3-D02 remains open and blocks this checkpoint.

**NOT READY FOR NEXT SCOPE**
