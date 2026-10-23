# Verification evidence and limits

**Version:** v0.1 · **Date:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT
**Role:** Lead Synthesis / Systems Referee; execution evidence, distinct from independent documentary audits.

## Repository and execution scope

The production checkout is a fresh full clone of `fargo161/First-Encounter-Game`, based on `76a92fd82ac5ec6f10748f0b439a5d661fff5ea5`. The local branch is `docs/keywrapping-substrate-v0.1`; no package commit, push, merge, PR or publication was performed. New documentation is uncommitted for owner review.

Commands below were executed from the repository root under Windows 11, Python **3.12.0**, Node **v24.18.0**. No dependency installation, optional Room Creator asset library, browser audit or private archive was required. All package writers ran through the existing wrapper in external disposable copies. Canonical package paths were not used as writer destinations.

## Fresh package checks actually run

| Command | Observed outcome | Claim and limit |
| --- | --- | --- |
| `python -B tools/repo.py doctor` | Exit 0; Python/Node version families and three legacy package paths present; optional library NOT_CONFIGURED_OPTIONAL | Environment located, not gameplay acceptance |
| `python -B tools/repo.py integrity` | Exit 0; integrity PASS, Stage 12; retained bindings and authority states preserved | Exact preserved legacy package scope and known states; not KeyWrapping runtime verification |
| `python -B tools/repo.py all` | Exit 0, every wrapper subprocess had its expected exit | Existing package checks only; their detailed outcomes remain separate below |

The wrapper was run once with its default temporary output. This passed, but the command sandbox's temporary profile disappeared after the session, so those raw logs could not be retained. The unchanged command was repeated with a **new explicit output directory outside the checkout** solely to retain inspectable evidence. The retained run also passed. No code or package correction prompted that repetition.

The retained run's `commands.json` records **11 wrapper subprocesses**, all with the expected exits. One expected exit is 1 for the unchanged IR3 known-failure suite; it must not be rewritten as a fully passing suite.

| Package | Fresh evidence | Preserved status |
| --- | --- | --- |
| Encounter/Atlas | 224 supplied tests pass; 21 independent tests pass; IR3 exactly **24 pass / 1 actual IR3-25 fail / 0 skip**; both HTML builds match; 12 regenerated proofs match; 132 execution inputs retain their digest | Accepted A1 with documented known limitation; IR3-25 remains real |
| Room Creator | 11 Node suites, **308 assertions**, LF/CRLF reproduction and exact HTML build pass | HOLD_FOR_FURTHER_REMEDIATION; missing-image repair warning defect unresolved; optional browser/library checks not rerun |
| ZANT | **4 evidence replays**; exact source/lock evidence and **1252** known failed wrist texels reproduced | GATE_A_FAILED_AT_G_SLEEVE_PILOT; Gate A incomplete; accepted/failed/unaccepted/provisional subsets preserved |

`all` does **not** test the separate accepted C1 package, C2.1 B0 or a KeyWrapping runtime. C1 and C2.1 B0 remain unchanged; no standalone C1 rerun or C2 implementation result is claimed. No new substrate behavior, sealing enforcement, capacity, crash behavior, game UI or gameplay enjoyment was executed or proved.

## Retained local evidence identity

The owner-review evidence directory is outside the Git checkout, under this chat's local artifact storage, with final component `keywrapping-repository-checks`. Its raw logs, copied packages and JSON summaries are not proposed Git artifacts. The exact local location is supplied with the chat delivery; the portable package avoids embedding a personal absolute path.

| Evidence artifact | Raw file SHA-256 |
| --- | --- |
| `summary.json` | `2a6246854ca525a65daf39aaf4af300023106a8b2b6a6f1d02d9570f9c6b3a9c` |
| `commands.json` | `d865382eabc50990d373c46830e6bd8b4331d3cac364b7b9e2b241a2ef71b847` |

The commands index also records individual log hashes. These hashes identify evidence bytes, not product acceptance, license clearance or the correctness of the proposed substrate. No new Git commit identity exists for this delivery.

## Preserved package identities

Initial fresh integrity reported A1's **2460** files, all **132** execution inputs and **2310** AR0 R1 dependency members; all **271** removed Stage 10 duplicates remain absent. Room Creator has **384** preserved files including imported Git metadata; ZANT has **166** strict packet files. Existing acceptance records remained unchanged.

| Scope | SHA-256 reported by existing integrity checks |
| --- | --- |
| Current A1 tree | `f565b7f89329a02b17febec136b991ce99ee092db7d8c6b952c4159b9d32171c` |
| A1 execution-input digest | `1a8558b3654e52881a288d2a5ab99e574878531f7a9d5fca86223e511146f085` |
| Room Creator 383-file baseline tree | `63521f0d9068de3e4da40cd8ec4573d17b26481aa6557a908caaa8d10a4c485b` |
| ZANT strict packet tree | `e6650aa6e28ab0b51e4d67dbd6d9922060d49673631b261718ae326cf71761ba` |

File bytes, execution-input records and curated tree records have different hash scopes. None is a substitute for a proposal-version identity, knowledge permission or an audience-safe public handle.

## Reproduction and future checks

Follow [DEVELOPMENT.md](../../../../DEVELOPMENT.md). Use `python -B`, supported Python/Node versions and a full clone/export. For retained package logs use `python -B tools/repo.py all --out` followed by a **new absolute directory outside the checkout**. Do not run package writer scripts inside canonical packages; do not install dependencies or fetch optional private archives merely to run these bounded commands.

The [GitHub plan](../../../design/keywrapping-substrate/v0.1/GITHUB_INTEGRATION_PLAN.md) gives untracked-aware scope, whitespace, link/JSON and later commit comparisons. An empty `BASE...HEAD` diff does not show the new uncommitted files. Existing CI success belongs to the inspected base, not a new package commit or a KeyWrapping behavior test.

Independent [sealing](LEAK_SEALING_AUDIT.md) and [combinatorial](COMBINATORIAL_SEMANTIC_AUDIT.md) reviews are documentary reasoning over the design, examples and source evidence. Their findings and rechecks are recorded separately in those reports and [TEAM_EXECUTION.md](TEAM_EXECUTION.md). They do not turn paper scenarios into executed runtime tests or grant owner design acceptance.

## Source, scope and branch rechecks

The lead independently compared the dictionary's 66 numbered headings to the nine vocabulary rows in KW-CONTEXT §15: all words match in the same order, with sequential unique entries 01–66. This establishes coverage of the intended vocabulary, not correctness or execution of every sense. The semantic auditor separately reviews donor evidence and meaning.

All four owner-held source byte lengths and raw SHA-256 values were recomputed against [SOURCE_SNAPSHOT.md](../../../research/keywrapping-substrate/v0.1/SOURCE_SNAPSHOT.md). A transcription typo in the KW-REPLY hash was corrected; its original source file had not changed. All four table values then matched. There is no new assertion of equivalence to unavailable numbered copies.

A fresh read-only GitHub check on 2026-10-22 still reported **public** and `main` at the inspected base `76a92fd82ac5ec6f10748f0b439a5d661fff5ea5`. This does not settle the historical private descriptions or authorize publication. Local HEAD remains that same commit on `docs/keywrapping-substrate-v0.1`, with **zero new commits** and no staged paths.

The scope-exclusion comparison from the integration plan exited 0: no tracked change outside the three new versioned documentation trees and `docs/README.md`. A post-synthesis `python -B tools/repo.py integrity` also exited 0 with the exact retained tree/digest values above, unchanged acceptance records, Room Creator HOLD and ZANT Gate A false. Later documentary corrections do not warrant repeating the broad `all` command; final untracked-aware scope and document checks supplement this preservation evidence.

## Final documentary checks and audit disposition

Read-only inline Python and Git commands checked the actual working-tree files, including the new untracked documents. No check script, runtime harness, fixture JSON file or schema was installed in the repository.

| Check actually performed | Observed result | Limit |
| --- | --- | --- |
| Exact planned/actual path inventory | **23 new Markdown documents + one existing `docs/README.md` edit = 24 paths**; no unexpected tracked/untracked paths | Compares working tree, not an empty commit-range diff |
| Scope and staging | Protected-path exclusion diff exit 0; no staged paths; zero new commits; all changed paths are `.md` | No actual `.schema.json`, runtime, adapter, scaffolding, dependency, accepted-contract or frozen-package change |
| Metadata and text hygiene | All 23 new documents carry v0.1, date and proposed/non-runtime status; LF, terminal newline, balanced fences and no trailing whitespace; tracked `git diff --check` exits 0 | Untracked-file whitespace was explicitly inspected too |
| Fenced JSON | **12 strict JSON blocks** across the package parse, rejecting duplicate keys and non-JSON constants | Syntax only; not schema conformance or execution |
| Integrated F1 closure | **10 blocks, 64 records + 18 external declarations, 243 local references**; unique declarations and referenced revisions resolve | External fixture assumptions are declared, not observed game evidence |
| Local Markdown navigation | **216 local links and 3 local anchor targets** resolve | External research URLs/pins were inspected during mining; this is not a live external-link crawler |
| Reviewed model identities | All **16** sealing snapshot comparisons match, using the amended dictionary identity; all **10** semantic snapshot hashes match | Audit/index/team/verification bookkeeping is outside the frozen model lists |
| Source and vocabulary | Four original source byte lengths/hashes match; dictionary contains the exact 66 source words in order | No equivalence asserted to missing copies; no extra word adopted |
| Independent donor evidence | Role 10 recomputed 329 XMLs, 61 lemma hits/five no-hits, all 66 complete inventories and all 65 selected frame/restriction rows; zero differences | Lexical evidence is not an Encounter mechanic or executor |

The sealing audit reviewed **27** hostile cases and closed SL-01 (medium) after the lead correction and independent recheck. The semantic audit reviewed all **66** words and **50** nonsense/ambiguity cases, closing CS-01 (medium) after correction and independent recheck. Role 9 additionally rechecked the Hide correction and found no sealing regression. No unresolved critical/high/medium documentary finding remains in those bounded scopes. Their individual reports preserve exact evidence and residual policies.

This is a completed documentation proposal for owner review. It is not a runtime security result, accepted language/sense registry, design freeze, standalone fun/playability acceptance, C2/B1 authorization, source-data redistribution clearance or publication approval. The commit plan, public/private discrepancy and publication hold remain in force. No commit, push, merge, PR or release was created.
