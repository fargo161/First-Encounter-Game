# Encounter M3 R3 — Independent Re-review

Review date: 2026-10-18, America/New_York. Execution timestamps use UTC.

**M3-D01, M3-D02 and M3-D03 are independently verified fixed in R3. No new browser-reproducible or realistically reachable M3 blocker was found in the executed bounded re-review.** The contradictory synthetic-geometry assertion remains failing and is preserved as a non-blocking hardening limitation under the user's explicit clarification. No production source was modified. Review stops at M3.

## Exact artifact and preservation

| Identity | Independently verified value |
| --- | --- |
| Checkpoint | Encounter_M3_Checkpoint_R3.zip |
| ZIP SHA-256 | `615ddc79e0f7bd8d903411401360fc321b7b916abcc69dc974e9673fd0e74c87` |
| ZIP size / members | 98,549,633 bytes / 1,430 regular files |
| External identity SHA-256 | `4a2805485681ab4f61f8804cd9e3565104e83eea138a7551ec515adc1369aea9` |
| Source revision | M3-runtime-v1-R3-D03 |
| Independently enumerated source digest, 68 entries | `a609f63c56ed1e047f44e8f3ef28b21f91adec9e40e35d08eb988d0e78de9362` |
| Runnable build size / SHA-256 | 133,751 bytes / `8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb` |
| Content | M3-protective-shortcut-v1 |
| Package | package_0003, revision 1 |
| Independently sealed package digest | `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f` |
| Preserved R2 checkpoint SHA-256 | `c3c866834b64aebc573b42e2839e173bed486cdc8125a0287ddcd952f43a1a10` |
| Original complete R2 independent evidence SHA-256 | `38c47ea52edb952ec618618c52d6dba6d0985d89b1033b960745e2bc306f5446` |
| Preserved M2 baseline SHA-256 | `940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7` |

Read the complete START_HERE and R3 tester prompt, R3 remediation report, verification JSON, README and preserved R2 independent report. Inspected the actual UI diff, relevant production code, builder display assertions, retained independent tests and adapters. Prior governing Master/approval/M3/M2 material remains the unchanged authority read in earlier reviews; the complete retained reference/evidence bytes were re-read and checked. Builder declarations, prior screenshots and pass counts were treated as supplied claims/evidence, not as this review's proof.

Before behavioral testing, independently checked ZIP hash/length, external identity fields, every member size/SHA-256, CRC integrity, exact membership, duplicate/case-colliding names, unsafe paths and special-file entries. All passed. The outer handoff contains a legitimate top-level directory plus nine files; the first strict file-only outer enumeration rejected that directory before extracting anything. The corrected outer check explicitly permits safe directory entries while retaining regular-file enforcement for the checkpoint. HANDOFF_MANIFEST membership and hashes also passed.

Fresh reviewed extraction: `C:/Users/mcdon/Documents/ChatGPT/encounter and rc/work/m3-r3-independent-review/checkpoint`. All source paths were independently enumerated and their digest recomputed. Package identity was independently sealed from authored JSON. Build/check tools ran in a disposable `tooling-clone`, including its separately created legacy regression copy; the freshly built HTML equals the frozen supplied HTML byte for byte.

R3 explicitly omits another duplicate R2 ZIP. This reviewer independently verified the prior original supplied R2 ZIP against its matching identity and freshly extracted all 1,152 members into `r2-checkpoint` for comparison. The R3 historical R2 identity, UI and HTML match that verified R2 exactly. The complete original R2 review ZIP was reverified, including its 721 manifest-listed members. Its disclosed R3 subset has 139 original files; all were verified, read and JSON/text decoded where applicable. The preserved M3 and M3-R1 reviews contribute another 167 and 235 verified evidence files. The subset is not misrepresented as the whole R2 evidence archive.

The production claim is accurate: **one predicate replacement in `src/m3/ui.mjs`, and no other production change or addition.** R3 equals R2 after exactly replacing `style.visibility !== 'hidden'` with `style.visibility === 'visible'`. Engine, policy, knowledge, meaning, types/contracts, shared kernel, authored content and every inherited test source remain byte-identical. Documentation, added tooling/tests, generated artifacts and historical selections are separately classified. Final preservation rehashes all 1,430 reviewed files, all 1,152 fresh R2 comparison files, the supplied handoff/input files and the original prior artifacts.

## D01, D02 and D03: independently fixed

The locked owner rule remains **No displayed closure notice = no closure**. Without a valid current display acknowledgment, communication may still be received/refused, but service remains open, zero physical service-close results occur and exactly the appropriate MISSING_CLOSURE_PREVIEW is recorded. No extra punishment was introduced.

- **D01:** own opacity zero and transparent ancestor each refuse the display acknowledgment. Native browser tests and verbatim-production executable assertions confirm the correct engine fallback.
- **D02:** zero width/height, wholly offscreen placement in all four directions and partial clipping on all four edges refuse acknowledgment. Independent tests also cover finite positive dimensions, invalid viewport values/types, negative/inverted geometry, exact edges and current binding.
- **D03:** the original collapse failure was freshly reproduced against the exact preserved R2 HTML, then retested on exact R3 executable bytes. R2 falsely closes once with no defect. R3 records receipt false, receives/refuses normally, keeps service open, commits no close result and records one missing-preview defect. Retained IR2-20 and fresh IR3-20 both pass with their original expectation.

The tester-owned loopback host adds only declared CSS rendering faults. Removing each injected stylesheet recreates the exact verified original HTML; executable script bytes remain unchanged. The normal route is byte-identical R3. Provenance contains source/served hashes and every injected CSS rule. The portable host reads the byte-identical historical R2 HTML from R3; browser testing initially read the same bytes from the independently extracted R2. No runtime or frozen file was edited to simulate a fault.

| Fresh native browser check | Receipt | Service open | Close results | Defects |
| --- | ---: | ---: | ---: | --- |
| Preserved R2 + collapse (historical control) | true, erroneous | false | 1 | none |
| R3 collapse | false | true | 0 | one MISSING_CLOSURE_PREVIEW |
| R3 visibility hidden / display none | false | true | 0 | one MISSING_CLOSURE_PREVIEW each |
| R3 own / ancestor opacity zero | false | true | 0 | one MISSING_CLOSURE_PREVIEW each |
| R3 zero width / zero height | false | true | 0 | one MISSING_CLOSURE_PREVIEW each |
| R3 wholly offscreen left / right / above / below | false | true | 0 | one MISSING_CLOSURE_PREVIEW each |
| R3 partial left / right / above / below | false | true | 0 | one MISSING_CLOSURE_PREVIEW each |
| R3 genuinely visible current notice + deliberate Send | true | false | 1 | none |
| R3 already earned receipt, later scrolled offscreen without edits | true | false | 1 | none |

Every invalid browser result was independently replayed, compared with its actual raw inspector and retried through the engine. World/visit state remains equal to the warned starting state; the refusal adds no physical result or extra punishment. There are no duplicate defects or effects on exact retry.

For truthful receipt continuity, the visible notice began at top 456.2000/bottom 543.8500 in a 920 × 764 viewport. PageUp moved it to top 1124.2001/bottom 1211.8501, genuinely outside the viewport. The final geometry and screenshot establish that position; the first immediate post-key sample preceded the completed scroll and was not used as proof. Enter on the already focused Send control committed one closure with the truthful receipt retained, no draft edit and no defect. A separate valid visible closure survived exact save/load without new effects.

## Non-blocking hardening limitation — contradictory synthetic geometry

**IR3-25 remains failing, unchanged and unskipped.** It manually supplies this internally contradictory rectangle to the verbatim production acknowledgment function:

```json
{
  "rect": {
    "left": 100,
    "right": 400,
    "top": 100,
    "bottom": 200,
    "width": 1000,
    "height": 100
  },
  "viewport": { "width": 920, "height": 764 }
}
```

The edge coordinates describe width 300 while the independent width field claims 1,000. The guard checks finite/positive dimensions, ordered edges and full edge containment, but does not cross-check dimension/edge consistency. It therefore records receipt true. Dispatching that synthetic receipt through the real engine closes service once with no missing-preview defect. Exact retry is replayed with the complete run unchanged.

This is **not a reproduced native-browser defect**. No CSS/normal application operation in the executed review produced this contradictory state, and no realistic production browser/API path was identified. All 17 measured native rectangles, including empty/offscreen/clipped cases, are internally consistent within a 0.0001 CSS-pixel comparison tolerance. The additional scroll measurements are also consistent. Production reads one native getBoundingClientRect result synchronously; source inspection found no application wrapper, geometry fabrication or prototype override supplying those values. That is evidence from this bounded review, not universal certification of all browser implementations.

The user's subsequent direct clarification requires a native/normal-application reproduction or realistic API path before treating this artificial contradiction as blocking. Accordingly, this remains a **non-blocking hardening limitation**, without assigning a new blocking M3 defect. REVIEW_SCOPE_CLARIFICATION.md preserves that classification rule. No test expectation, production function or behavior was changed to produce a green result.

Evidence is complete: `independent-inconsistent-reproducer.json` contains the exact guard, fabricated vector, submitted and marked commands, actual engine result, replay outcome and full resulting save. `independent-r3-final.stdout.txt` retains the failed assertion and exit 1. To reproduce only this same assertion:

```powershell
node --test --test-name-pattern=IR3-25 independent-r3-display.test.mjs
```

That selected-case command is expected to fail. Other filtered cases in such a focused invocation are not counted as full-suite skips. The full suite also intentionally retains this failure; the milestone verdict does not claim an all-green synthetic suite.

## Fresh suite results and test independence

| Executed suite | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| M0 audit | 7 | 0 | 0 |
| Builder M1/M2/M3/R1/R2/R3 | 137 | 0 | 0 |
| Retained independent M1 | 22 | 0 | 0 |
| Retained independent M2 | 18 | 0 | 0 |
| Prior independent M3 | 18 | 0 | 0 |
| Original independent D01 | 1 | 0 | 0 |
| Retained independent R1/D02 | 9 | 0 | 0 |
| Retained independent R2/D03 | 20 | 0 | 0 |
| Independent R3 boundary suite, including synthetic hardening case | 24 | 1 non-blocking | 0 |

All inherited/builder gates were freshly executed against source byte-identical to the frozen R3 source. Logs retain actual argv, roots, environment bindings, outputs and exits. Their historical browser inputs remain regression evidence, not fresh independent R3 gameplay. Supplied generated-evidence and preservation tools were freshly run in disposable copies.

Inspected adapters preserve original source files and assertions. The retained M3 adapter rebinds only the old exact-source expectation and evidence output path. The R1 adapter completes its viewport-width invocation and isolates output as already disclosed in R2. The R2/D03 adapter redirects only evidence output, copying its original two input fixtures unchanged. It does not change IR2-20 or any behavioral expectation. Every inherited test source is byte-identical to R2.

The R3 independent suite retains 20 behavioral assertions from this reviewer's R2 suite, binding them to the fresh R3 warned state and measured collapse geometry, and adds five bounded cases: bottom clipping, exact viewport edges, unknown/nonvisible computed values, invalid numeric types and contradictory geometry. Four additions pass; the contradictory one remains failing. Inner vector loops and repeated suite runs are not new test counts. Suites overlap; no inflated aggregate of supposedly unique assertions is claimed.

## Wider M3 behavior independently checked

- **Fresh Seed A and protected request:** New run, deliberate ticket verification, Compassionate/Overt first paperwork request, distinct Intake and Delivery, permission-only save with no learned handling detail. Physically inspected the extract and searched the permitted tray. Permission did not perform those actions.
- **Local knowledge and original history:** Tamsin's later evasive location reply remains distinct from the original collected shorthand; Orrin supplies only his limited report. Retained independent assertions freshly perturb concealed truth/private selectors, separate unheard exchanges and unread print, audit observer-local source fragments and absent owner, and verify no private-information leakage. The social-policy input remains filtered local information rather than full world truth.
- **Repair and authority:** ordinary payment is received and declined without money/debt/bribery fabrication. Owner inquiry and later broad demand trigger the specific restriction, viable case-only alternative and public warning. Why, End/reopen, partner switching and vague apology do not consume substantive repair. Case-only acceptance uses repair once while retaining authority and warning; comparison and recovery are still false. Started a new run and reloaded the repaired save with exact equality, then continued.
- **Recovery, ownership, money and confirmation:** actual comparison creates pending terms; conversational acknowledgment does not transfer custody. Record correction is a separate action retaining original shorthand. Exact confirmation completes handover once, at zero payment, balance 1200 minor units, Nera still owner. A later protected demand leaves the entire recovered world unchanged. Retained tests freshly reject stale/altered terms, changed custody/balances and duplicate physical results atomically.
- **Persistence and read purity:** repaired reload and closed-state reload preserve complete exports. An incompatible legacy import leaves the closed run unchanged. Actual inspector and response replay/skip leave the complete recovered save unchanged. Every one of the 31 fresh UI exports passes complete deterministic journal replay and exact last-command retry validation. Twenty actual raw UI inspector exports exactly match reconstructed traces; other traces are explicitly generated from their validated saves.
- **Causal inspector:** separate external runtime instrumentation recorded 76 actual policy calls across ten fresh journals. All actual filtered inputs equal decisionInput reconstruction; candidates, selected result and notice option match. The wrapper records arguments/results in memory without changing the policy algorithm or any checkpoint file. Captures, assertions and actual UI trace comparisons are retained.
- **Portability and host boundary:** fresh retained independent tests exercise neutral identity/prose renaming through recovery and closure, while shared kernel/content preservation is independently checked. No route, lane, host geometry, LOS, spawning, locomotion or sprite-facing implementation was added to Encounter core. UI receipt viewport checks are confined to the existing UI boundary.

No browser-reproducible or realistically reachable blocker was found in these executed classes. Existing finite saves/manual persistence, fixture art and wording, broader sensory/psychological behavior, arbitrary authored packages, other browsers/mobile and excluded occlusion/overlay/transform/filter/accessibility certification remain outside this bounded verdict.

## Environment, execution evidence and reproduction

Windows 11 build 26200; PowerShell 7.6.5; Node v24.18.0; npm 11.16.0; Python 3.12.0; Git 2.55.0.windows.3; actual desktop in-app browser. Exact browser-engine version and cross-browser certification are unclaimed. No dependency installation, runtime AI or external asset download was needed. The read-only server used 127.0.0.1:54946 and was stopped after testing; the review-created tab was closed.

The partial-left CSS fault overlaps a header control. Keyboard activation of the ordinary Save control was used. One export attempt hit a dialog-state timeout; its raw partial export was retained as `raw-partial-left-export-attempt.json` and excluded from the 31 validated proof exports. The current state was reobserved and correctly exported with explicit dialog visibility waits. The corrected partial-left save matches its independently captured inspector. This tooling issue did not require a production edit or weaken an assertion. Screenshot pixels were inspected directly and never edited.

Evidence includes this report, all independent sources, unchanged failing synthetic assertion, complete synthetic reproducer, environment/exact command records, fresh suite outputs, input/member/source verification, diffs, actual UI saves/inspectors/transcripts/geometry/screenshots, actual policy captures, scope clarification and final preservation record. Supplied handoff artifacts remain identified input. EVIDENCE_MANIFEST.json hashes every evidence member. Exact tool/shell/browser calls and available outputs are exported from the whole R3 task, including the user's later steering; child logs retain exact command exits.

To reproduce, extract the evidence ZIP into a fresh directory, then extract `reviewed-checkpoint/Encounter_M3_Checkpoint_R3.zip` into fresh `checkpoint/` beside the reviewer scripts. The portable CSS host uses the exact historical R2 HTML already inside that checkpoint, so a second R2 ZIP is unnecessary for browser comparison.

```powershell
node --test --test-reporter=tap independent-r3-display.test.mjs
node export-evidence.mjs
node audit-causal.mjs
python display-server.py
```

Expected independent suite: 24 pass, one preserved synthetic hardening failure. Browser export validation and causal audit pass. For actual browser comparison, load `evidence/r3-fresh-warned.json` through Open run, choose the whole-file request and compare `/before/` (R2 collapse), `/collapse/` (R3 protected refusal) and `/normal/` (visible current notice and deliberate closure). Additional fault routes cover all tested native visibility/opacity/geometry cases. All frozen inputs and extraction members remain unchanged.

M3-D01, M3-D02 and M3-D03 are independently verified fixed in R3; no new M3 blocker was found in the executed bounded re-review. The contradictory synthetic-geometry assertion remains a documented non-blocking hardening limitation. No M4, Seed B, Assembler, NPC initiation, remediation or host spatial/navigation work was begun.

**READY FOR NEXT SCOPE**
