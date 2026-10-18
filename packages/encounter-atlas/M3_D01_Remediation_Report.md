# M3-D01 remediation report — R1

READY FOR INDEPENDENT M3 RE-REVIEW. No remaining blocker found in the executed remediation coverage. Independent re-review is the next gate. No M4 work was begun.

## Defect and authority

Independent M3 review returned NOT READY FOR NEXT SCOPE because `acknowledgeVisibleNotice` accepted an onscreen rectangle with `opacity: 0` as displayed. This falsely authorized one physical service-close result and suppressed the missing-preview defect. The owner rule is unchanged: **No displayed closure notice = no closure.**

Before production edits, the complete independent report, test/harness sources and evidence bundle were ingested. All 168 members were read; all 167 manifest-listed member hashes/sizes verified. JSON/log structures were fully parsed and decisive screenshots inspected. `independent/m3-review/INGESTION_READ_RECORD.json` records ingestion. Supplied bundle SHA-256: `f0a74427cf3ca724dedbc3887f570338ae56aa633bf09856dbcc0064ac05bcf2`.

## Narrow production fix

The only changed production source is `src/m3/ui.mjs`. Immediately before the existing acknowledgment condition, the code walks the notice and its `parentElement` chain, reads each computed opacity and refuses acknowledgment if it is non-finite or zero. Parent opacity matters because a parent can make the notice fully transparent while the notice's own computed opacity remains one.

The original hidden, display, visibility, nonempty-height and viewport checks are retained. The existing preview binding, engine/policy receipt checks, missing-notice defect path and physical-result machinery are unchanged. No character/scenario/item/message/fixture branch was added. No additional punishment or player-facing fallback was added. There is no change to privacy, repair, beliefs, custody, ownership, money, save/load, inspector, portability or host responsibilities.

The receipt still records that the bound current notice was actually displayed earlier; a truthful earlier receipt is not invalidated merely because the player subsequently scrolls. This remediation prevents a new false receipt for a fully transparent notice.

## Exact identities

- Source revision: `M3-runtime-v1-R1-D01`.
- Source digest (54 source/content/test/tool entries): `35fa58990b19a08933fefb7e2f37ba1d5c5edc5807390354eae238e531588711`.
- Runnable build: `dist-m3/index.html`, 133,457 bytes, SHA-256 `11393dde2ae110d3b04aac03c1044e000be6b410e4bffacb16216829c9050052`.
- Authored content unchanged: `M3-protective-shortcut-v1`; package `package_0003`, revision 1, digest `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f`.
- Failed M3 archive unchanged: `de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64`; original identity SHA-256 `d025fe33a6a2773e88e249ce3c624280fca70921c8f541617ec8e92d4302abf4`.
- Verified M2 archive unchanged: `940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7`.

The new sibling `Encounter_M3_Checkpoint_R1.identity.json` contains the exact final ZIP hash/size and every member identity. That containing archive's hash cannot be included inside itself without circularity. The external verification record checks fresh extraction and deterministic re-export.

## Before/after browser evidence

The CSS-only test server serves preserved failed HTML for `/before/`, exact new HTML for `/normal/`, and the new HTML with separate transparent/offscreen stylesheets for the two negative paths. Removing each injected style recreates its source HTML byte-for-byte. Executable script bytes are unchanged by the harness. `rendering-fault-provenance.json` names every source/served hash.

The transparent cases use the tester's independently generated warned intermediate save, replay-validated by the unchanged engine. This isolates the visibility decision without substituting an already completed run. Measured before and after: opacity zero, visibility visible, display block, rectangle top 456.2000/bottom 543.8500, viewport height 764. The current notice paints no text in either screenshot.

| Actual rendered UI path | Display receipt | Service-close result | Service open | Technical defect |
| --- | --- | --- | --- | --- |
| Preserved build, transparent notice | true, erroneous | 1 | false | none |
| R1, same transparent notice | false | 0 | true | one MISSING_CLOSURE_PREVIEW |
| R1, offscreen notice | false | 0 | true | one MISSING_CLOSURE_PREVIEW |
| R1, visible onscreen notice + deliberate Send | true | 1 | false | none |

All sends, phases and save exports used actual rendered controls, never hidden engine calls. The visible result was saved/reloaded with complete equality. Transparent and offscreen sends produced the existing boundary refusal and viable case-only alternative, without a new player consequence. Geometry JSON, before-Send screenshots, outcome screenshots, complete run JSON, raw inspector JSON, generated traces and readable transcripts are under `evidence/m3-d01/`.

A separate fresh New run verified ticket authority, protected paperwork, physical extract/tray actions, Tamsin's separate evasive reply, Orrin's limited account, unnecessary-payment refusal and evidence sharing. It then reached privacy restriction, Why, substantive comparison acceptance, exact repaired-state save/reload, actual comparison and exact zero-payment handover. Custody changed once, Nera stayed owner, private contact stayed undisclosed and record correction remained separate. A later protected demand left the entire world state unchanged. These are fresh R1 UI paths, not old completed fixtures.

Eight browser records comprise one expected before-fix reproduction and seven successful after-fix checks. Ten fresh UI save exports are journal-validated. Before-fix evidence is labeled with the old source/build identity; current evidence is bound to R1. Earlier M3 captures remain historical comparison material, even when freshly replay-validated.

## Regression and preservation

Fresh final results: 117 builder tests (112 inherited plus 5 new display-boundary cases), 22 independent M1 tests, 18 independent M2 tests, 18 independent M3 cases, the 1 independent M3-D01 reproducer, and 7 M0 checks. All pass, with no skips. Full command/output records are retained. Repeated browser paths and test reruns do not inflate distinct counts.

The original independent defect test runs unchanged and extracts the actual production guard verbatim. Before the fix it fails; afterward it passes. The new builder tests also extract the production guard, exercise own/ancestor opacity, visible and offscreen/hidden/empty geometry, read purity and nonzero opacity, then dispatch the resulting receipt through the real unchanged engine. Visible closure and missing-receipt cases assert exact result/defect counts and retry equality.

The independent M3 suite's old exact-source hash intentionally refers to the failed checkpoint. `run-independent-m3-r1.mjs` explicitly rebinds only that expected hash to the new independently manifested source digest and its disposable evidence output directory in memory. Every behavioral assertion is retained, no test is skipped, and the supplied source/evidence remains unchanged. This is disclosed identity adaptation, not a behavioral bypass.

`preservation.json` verifies all 189 failed-checkpoint members and classifies every intentional change. All original source/content/tests except `src/m3/ui.mjs` remain byte-identical. Intentional non-production changes are source revision metadata, generated bundle/evidence, new test/tool files and current documentation. The shared kernel and M2 baseline are unchanged. Original outputs and failed ZIP/identity remain untouched; the exact failed ZIP is also included in `historical/`.

During new-test authoring, an assertion initially used `defect.code` instead of the existing `defect.type`; that test error was corrected before the final before-fix run. The corrected red run has exactly two opacity failures and three passes; the final suite has all five passes. Both development outputs are retained and are not counted as final failures.

## Limits and stop point

This is a focused opacity acknowledgment repair, not comprehensive pixel visibility/occlusion certification. Existing geometry checks are preserved. Near-transparent readability, overlays, clipping/filter combinations, mobile/accessibility and other browsers are not certified. Existing fallback art/wording, manual bounded persistence and deferred future scope remain as documented in historical M3 material.

No engine/policy rule was weakened and no extra owner decision was needed. M4, Seed B, full Assembler, NPC initiation and host routes/rails/lanes/nodes/geometry/locomotion/LOS/spawning/sprite-facing were not implemented. Stop at M3 for independent re-review.
