# M0 — Baseline inventory and reuse plan

Date: 2026-10-17 (America/New_York). Status: completed inventory; M1 follows. Lead builder only; no other agent or tester was launched.

## Authority and source identity

The owner explicitly invoked the separate kickoff prompt. Its scope, review gate, and §3 clarifications govern; then the approval record; then master v2.1; the HTML supplies evidence of legacy implementation only. Dormant kickoff briefs and historic authorizations inside the master do not independently authorize work. All four files were read before choosing the new layout. The master's front matter is version 2.1.

Originals remain in `C:\Users\mcdon\Downloads` and are unchanged. Byte-identical reference copies use canonical names under `reference/`. The `(1)` suffixes are download filenames, not a different design version.

| Supplied filename | Bytes | SHA-256 |
|---|---:|---|
| Encounter_Codex_Lead_Builder_M0-M2_Prompt.md | 27,485 | e3942a672d064969c2629ae4c878445f0ca82b258297c2598cee74eaba7305e4 |
| Encounter_Approval_Record_2026-10-17 (1).md | 3,645 | 552b8eb6c5ee7c16a6f4ddf17a9b407cb46698e5e252e79e88c1a6dcefb8e778 |
| Encounter_System_Master_v2.1 (1).md | 280,489 | 6ded5dea91b4189b3901eb16beff244e3f3094ed220380314dd07cecc6e7ef37 |
| Encounter_Core (1).html | 102,613 | c9b50efed0ead41d0faa69757969feff8ced1fbc22187c11989aa9ff2dd21eb9 |

## Actually observed workspace and tools

Workspace: `C:\Users\mcdon\Documents\Codex\2026-10-17\execute-encounter-codex-lead-builder-m0`. It initially contained empty `work/` and `outputs/` directories. No repository, application source tree, test files, lockfile, package manifest, build configuration, or applicable ancestor AGENTS.md was present. `git rev-parse --show-toplevel` returned “not a git repository.” No Git history or remote is inferred, and no repository was initialized.

Available and executed: Git 2.55.0.windows.3; Node v24.18.0; npm 11.16.0; Python 3.12.0; PowerShell; `rg`. Version checks succeeded. `rg --files --hidden -g '!.git' .` found no initial files (exit 1 means no matches). Ancestor instruction-file checks found none. An initial wider AGENTS filename inventory returned unrelated projects; those projects were neither read nor adopted as sources. No old archive search is needed.

The HTML embeds catalog, belief rules, core, and browser workspace in one script. Its CommonJS branch mentions `./based.js` and `./beliefs.js`, but neither separate module was supplied. The inline browser globals do not require those external files. The missing modular originals are not a blocker for inspecting the actual HTML.

## Actual baseline audit

Locations refer to the preserved `reference/Encounter_Core.html` (1-based lines). These classifications describe proposed reuse, not approval of old semantics.

| Part | Classification | Reason / boundary |
|---|---|---|
| Catalog, 83–116 | **Reuse directly** (catalog data) | Twenty correct ordered pairs, names and fusion definitions; no listener policy in this data. Preserve the complete vocabulary even when M2 enables a subset. |
| Salience and delivery helpers, 117–135 | **Reuse after semantic refactor** | Retain three prominence choices and validation idea. Remove numeric reaction multipliers and any promise that a hidden selector is perceived. |
| Primitive field/number/ID checks, 201–212 | **Reuse after semantic refactor** | Closed fields and bounded integers are useful. New records need neutral typed IDs, JSON-only data and reference/view validation. |
| `validateWorld` / `createSession`, 243 / 273 | **Superseded / must not carry forward** | Exactly two actor seats, knowledge flags, one profile and current-world-as-package conflate required distinctions. |
| `validateSession`, 476 | **Reuse after semantic refactor** | Version, reference, counters and shape checks are useful patterns; old history and pending-offer constraints do not define new saves. |
| `validateIntent` / `playerLine`, 326 / 341 | **Superseded / must not carry forward** | ASK/TELL/TRADE and tone-independent player wording do not implement Offer/Request/Remark plus semantic BASED. |
| `normalizeTerms`, 283 | **Reuse after semantic refactor** | Integer amounts, revalidation, duplicate lines and overflow checks remain useful. Replace seats, global knowledge flags, hidden-balance errors and content-string identity; preserve ownership/custody and named obligations. Full negotiation is deferred. |
| `preview`, 368; UI `renderPreview`, 587 | **Reuse after semantic refactor** | Non-mutating validation and review pattern is sound; new preview must show complete outward meaning from player knowledge only. |
| `send`, 382 | **Reference only** | Working-copy and “heard despite refusal” ideas help; no new command IDs or filtered knowledge pipeline exists here. Pending is cleared on every send, violating PD-06. |
| `deliveryEffect`, 361; `defaultProfile`, 222 | **Superseded / must not carry forward** | Direct incoming-vibe reaction key, legacy trust and automatic mood/patience closure must be removed. Legacy trust is never persistent TRUSTS. |
| `acceptOffer` / `cancelOffer`, 443 / 464 | **Reuse after semantic refactor** | Exact confirmation, no new delivery roll, preflight and one cloned transfer are safety ideas. New offer revision must survive harmless discussion; session revision differs from offer revision. Retry journal and matched-result protection are absent. |
| `EncounterBeliefs`, 140–185; `knows` / `commitKnowledge`, 280 / 372 | **Superseded / must not carry forward** (representation and scale) | Keep conceptual distinction between hearing and accepting, plus strongest-support/dispute ideas. Replace 1/2/4, flags and string equivalence with scoped source-linked observations/claims and approved PD-05 where needed. No old numerical conversion. |
| `publicView`, 501 | **Superseded / must not carry forward** | Exposes all topic definitions, NPC good quantities, and offered-information labels derived from secret knowledge. New menus derive only from disclosed references. |
| Storage/import/export, 524–544, 717–733 | **Reuse after semantic refactor** | JSON download, explicit import and failed-storage notice are useful. New separate package/run formats and a new storage key; no old-save conversion or legacy-key overwrite. |
| `renderInspector`, 619 | **Reference only** | Read-only explanatory panel idea is useful; label deltas and live “Edit NPC response policy” path are unsuitable. New trace must explain actual evidence and effects. |
| Escaping, status notice, responsive controls, keyboard/dialog patterns, 8–75, 521–523, 635–650, 791–796 | **Reuse after semantic refactor** | Accessible labels, escaping/text insertion and explicit controls are useful UI patterns. New controls must use approved families and separate Intake/Delivery. No UI implementation at M1. |
| `applyWorld` and live ledger editor, 469, 628–790 | **Superseded / must not carry forward** | Applying author edits to an active run and resetting an encounter from its mutated world conflicts with package → validate → fresh run. Only staging/revert concepts are reusable. |

## Actually executed checks

Run from this checkpoint directory: `node scripts/audit-baseline.cjs`.

Seven newly written, limited checks passed; zero failed. The harness syntax-compiles the entire inline script, then evaluates its three non-DOM components in an isolated Node VM. It checks the catalog, sample world/session validation, preview non-mutation, spoken hearsay, proposal versus exact transfer/stale confirmation, stale-send non-mutation, and the actual overbroad legacy public projection. The last check confirms an incompatibility; it does not certify privacy safety. Exact output: `evidence/M0_baseline_checks.txt`.

These are fresh M0 checks, not the missing original suite and not new-core acceptance results. No browser was launched and no storage, download, dialog, double-click launch, artwork, or human playtest was executed. One malformed PowerShell inventory pipeline initially failed before reading metadata; the corrected inventory succeeded. That shell error is not a gameplay test failure.

## Historical claims and missing material

Master Appendix C reports **253 engine tests and 29 browser checks** historically. Neither those scripts nor an editable-source/test archive was supplied. No such totals were rerun. The older foundation/workbook/review documents named in Appendix C were not supplied for this task; the kickoff explicitly says they are not required. There is no concrete unresolved blocker requiring them. Their contents were not reconstructed or treated as newly verified evidence.

## Proposed M1/M2 approach and browser assumptions

Use dependency-free JavaScript modules with JSDoc contracts, strict runtime validators, and Node's built-in test runner. This avoids a downloaded build chain while making record/view boundaries executable. M1 contains shared records, source filtering and a generic staged command harness with neutral fixtures only. M2, after its gate, adds the semantic compiler, authored Last Collection fixture, real response policy, local inspection resolver, browser UI and persistence controls.

M2 should package classic scripts or an offline bundle plus explicit manual run/package JSON export. Browser localStorage is optional; its availability under `file:` is unverified. A loopback server can be an alternative if verified. Do not promise double-click support before actual browser testing. The legacy HTML has no external script, stylesheet or network requirement in its source, but that is static evidence only.

No closure, warning/repair algorithm, missing-preview fallback, transaction engine, full scenario, full Assembler, runtime AI or additional agent is included in M1. Before M3 the owner must confirm the specifically unapproved missing-preview fallback, per kickoff §3.1.

## M0 checkpoint

Because this workspace is not Git-backed, the exact snapshot is `../Encounter_M0_Checkpoint.zip`. Its external SHA-256 and per-file manifest are in `../Encounter_M0_Checkpoint.identity.json`. The ZIP freezes M0 before any M1 source is added. Reproduce the audit from its extracted root using the command above. The later M0/M1 archive is the tester checkpoint for the M1 gate.
