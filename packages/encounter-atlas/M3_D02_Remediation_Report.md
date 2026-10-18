# M3-D02 remediation report — R2

READY FOR INDEPENDENT M3 RE-REVIEW. No remaining blocker found in executed coverage. Independent re-review is the next gate. No M4 work was begun.

## Authority, evidence and baseline

The owner requested M3-D02 remediation only after R1 independent re-review verified M3-D01 fixed and found horizontal-offscreen/zero-width false display receipts. The rule remains **No displayed closure notice = no closure**. Direct request is retained in `reference/M3_D02_Owner_Request_2026-10-18.md`.

Before production edits, the complete independent report, source/harness material, evidence/structured logs and decisive screenshots were reviewed. All 236 evidence members were read, all 235 manifest-listed hashes/sizes verified, JSON records fully parsed and contained R1 archive members read. Ingestion is recorded under `independent/m3-r1-review/INGESTION_READ_RECORD.json`. Supplied evidence ZIP SHA-256: `b4c3ad7c3dd1a6adaf143139a9ae6e4bcb82d3f33c069ef43141dd3b362490f7`.

R2 starts from a separate extraction of the exact 592-member R1 ZIP, SHA-256 `f7afae2bfa1b75a4a8ec3e2ded09a7845671dbfb0ca9fc5ad487c655c6a68ed4`. Its external identity SHA-256 is `14ec8df2a70645cb0e955e1a626b951254050c95a2bf875f0c694b2ae3cf6c17`. Original R1 outputs and the preserved copies remain unchanged.

## Exact narrow fix

Only `src/m3/ui.mjs` changed in production. The final acknowledgment condition now requires every rectangle coordinate/dimension and both viewport dimensions to be finite; viewport dimensions, width and height must be positive; right must exceed left and bottom exceed top; the whole rectangle must fit within both horizontal and vertical bounds. This applies the existing full vertical-containment semantics consistently to the horizontal axis.

The R1 own/ancestor opacity walk, hidden/display/visibility checks, pending current-preview/draft/revision binding and early return for an already-earned truthful receipt remain. No scenario/character/item/message/CSS-fixture branch was added. No policy/engine guard was bypassed. A newly invalid display earns no receipt; the existing engine then receives/refuses the message, keeps service open, commits zero physical service-close results and records exactly one `MISSING_CLOSURE_PREVIEW`. World and visit state remain unchanged by any extra punishment. A truthful receipt already earned for the current unedited notice survives subsequent scrolling.

`evidence/m3-d02/production.diff` is the exact production diff. All engine/policy/knowledge/meaning/type/core/content bytes are unchanged. Test, metadata, generated build/evidence and documentation changes are classified separately.

## Exact tested identities

| Component | Identity |
| --- | --- |
| Source revision | `M3-runtime-v1-R2-D02` |
| Source digest, 61 entries | `7bbf91958abfb963830f412136baab95601da19cebc6673bf6d72207d18766d0` |
| Browser HTML bytes / SHA-256 | 133,750 / `7cbc1251a627631cf352e8a0cd8c5c78b93b76fedd1205a1e84676bfcecfbbe8` |
| Unchanged content | `M3-protective-shortcut-v1` |
| Unchanged package | `package_0003`, revision 1, `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f` |
| Original M3 archive | `de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64` |
| Verified M2 archive | `940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7` |

The new sibling R2 identity supplies its ZIP hash/length and every member hash. A containing archive's hash cannot appear inside that archive without circularity. The external verification JSON records fresh extraction, checks and deterministic re-export.

## Production-bound tests

Nineteen new builder cases extract the actual production function and pass its resulting receipt through the real unchanged engine. They cover visible positive fully-contained geometry, own/ancestor opacity zero, vertical above/below, horizontal left/right, partial horizontal clipping on either edge, zero width/height, hidden/display-none/visibility-hidden, non-finite rectangle/viewport fields, negative/inverted dimensions, truthful receipt after scroll, stale/edited binding and completed recovery. Every invalid-display vector asserts normal boundary refusal, unchanged world/visit state, open service, no new physical result, zero close results, exactly one correct technical defect and idempotent retry. Grouped non-finite vectors are not inflated into separate reported test cases.

Before the production fix, the corrected builder reproducer had 12 passes and 7 geometry failures; the untouched independent R1 suite had 7 passes and the 2 expected D02 failures. Afterward all 24 focused builder display cases (19 new + 5 R1) pass. Full builder count is 136 (117 inherited + 19 new).

The inherited R1 display fixture originally omitted horizontal geometry and the `innerWidth` function argument. Its fixture now supplies positive left/right/width and viewport width; every behavioral assertion is unchanged. Preservation tooling enforces exactly those fixture-only substitutions.

The supplied independent R1 test source is unmodified. `run-independent-m3-d02.mjs` explicitly supplies its already-measured viewport width to the extracted guard and redirects writes to disposable output. These are the only in-memory substitutions; all nine assertions and engine dispatch checks remain intact. Original before-fix evidence stays untouched. The prior independent M3 suite retains its disclosed exact-source identity rebinding to the new manifest and output isolation. The original independent D01 test runs unchanged and passes. None of these adapters alters the production guard or skips a case.

An initial new stale-command test accidentally reused the automatically chosen command ID for a different command, producing the correct identity-conflict rejection. The fixture was corrected to use a distinct ID before the corrected red run. `initial-test-draft.tap` preserves that authoring error; it is not a final production failure.

## Fresh visible-browser evidence

The loopback host serves exact R1 or R2 executable bytes with declared CSS-only faults. Removing each injected style recreates its source HTML byte-for-byte. `rendering-fault-provenance.json` records source/served hashes. No production file was altered by the host.

The warned starting save for focused display tests is the independent re-review's fresh legitimate intermediate `r1-fresh-warned.json`, replay-validated against the unchanged engine. It is an accelerator, not a completed recovery substituted for gameplay. Two fresh preserved-R1 controls reproduce the defects before testing R2.

| Actual UI path | Display receipt | Close results | Service open | Defects |
| --- | --- | ---: | --- | --- |
| Preserved R1, horizontal offscreen | true, erroneous | 1 | false | none |
| Preserved R1, zero width | true, erroneous | 1 | false | none |
| R2, horizontal offscreen | false | 0 | true | one MISSING_CLOSURE_PREVIEW |
| R2, zero width | false | 0 | true | one MISSING_CLOSURE_PREVIEW |
| R2, own opacity zero | false | 0 | true | one MISSING_CLOSURE_PREVIEW |
| R2, ancestor opacity zero | false | 0 | true | one MISSING_CLOSURE_PREVIEW |
| R2, vertical offscreen | false | 0 | true | one MISSING_CLOSURE_PREVIEW |
| R2, fully visible + deliberate Send | true | 1 | false | none |
| R2, earned visible receipt then PageUp without editing | true | 1 | false | none |

Measured horizontal rectangle: left -10000/right -9700, top 107/bottom 214.8000, width 300. Zero-width rectangle: left = right = 100, width 0, top 107/bottom 207. Both have valid vertical geometry in a 920 by 764 viewport and no readable current notice. The identical R2 fault geometry now refuses acknowledgment. The actual visible control fits both axes. In the scrolling case, the notice was genuinely visible first, then PageUp moved its top to 1124.2001 beyond viewport height 764 without draft edits; deliberate sending retained the truthful receipt. The production-bound test additionally compares the exact marked command before/after scrolling.

A fresh New run separately exercised authority, protected paperwork, real extract/tray actions, Tamsin's distinct evasive reply, Orrin's limited account, unnecessary payment refusal, privacy restriction, Why, substantive case-only repair and exact repaired-state save/reload. Actual physical comparison and exact confirmation recovered the case for zero coins, Nera still owner, one custody handover, private contact undisclosed. Optional record correction remained separate. A later protected demand left the entire completed world state unchanged.

Thirteen browser records comprise two expected before-fix defect reproductions and eleven passed after-fix checks. Fourteen complete actual UI exports validate by deterministic journal replay. Four raw actual inspector exports (horizontal, zero-width, visible closure and recovery) exactly match generated traces; all fourteen matching transcripts/traces retain correct source/build/package/run identities. Visible closure and repaired saves reload with complete equality. No hidden engine call substitutes for UI actions. Screenshots are staged/observed and captured in separate calls; original supplied decisive images remain preserved. Current evidence is under `evidence/m3-d02/`; earlier captures remain historical even when freshly revalidated.

## Full fresh regression and preservation

| Fresh suite | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| M0 audit | 7 | 0 | 0 |
| All builder M1/M2/M3/R1/R2 | 136 | 0 | 0 |
| Independent M1 | 22 | 0 | 0 |
| Independent M2 | 18 | 0 | 0 |
| Prior independent M3 | 18 | 0 | 0 |
| Original independent M3-D01 | 1 | 0 | 0 |
| Independent R1 rendering suite including M3-D02 | 9 | 0 | 0 |

Exact commands/bindings/outputs/exits and environment records are retained under `evidence/m3/`, `evidence/m3-d01/` and `evidence/m3-d02/`. Repeated runs, input-vector loops, transcripts and browser records are not additional distinct automated cases.

Fresh old assertions and unchanged core/content confirm privacy/local knowledge, authority, substantive repair, warning persistence, money, custody/ownership, exact confirmation, save/load, retries/idempotence, causal inspector, equivalent-package renaming and host separation. No host geometry/locomotion/LOS/spawning system or new scenario rule was implemented.

`preservation.json` verifies all 592 original R1 members, classifies intentional changes and enforces only `src/m3/ui.mjs` as changed production. All inherited tests except the explicitly enforced R1 DOM-fixture completion remain byte-identical. Source metadata, generated bundle/evidence and current docs are intentional non-production changes; new tests/tools are additions. Original R1 ZIP/identity and all original delivered files are separately rehashed unchanged before freeze. Exact R1 is also embedded in `historical/`.

## Limits and stop point

This fixes the demonstrated geometry boundary and preserves the existing contract. It does not implement pixel-level occlusion, overlays, accessibility certification or rendering-engine redesign. One desktop in-app browser was exercised; other-browser/mobile certification is unclaimed. Existing fallback art/wording, manual bounded persistence and deferred systems remain unchanged. No additional owner rule was needed.

Stop at M3. Independent re-review is required; M4, Seed B, full Assembler, NPC initiation and host routes/rails/lanes/nodes/geometry/locomotion/LOS/spawning/sprite-facing remain deferred.
