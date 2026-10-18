# M1 Independent Tester Review

Date: 2026-10-17 (America/New_York). Independent review of the supplied M0/M1 checkpoint only.

**Verdict: NOT READY FOR M2**

The checkpoint is authentic and reproducible. The fresh baseline and builder suites pass. Two additional regressions expose mutable-input identity defects in the shared command and physical-result boundaries. These require lead code changes and review of a new checkpoint before this M1 gate can clear. Production source was not edited. M2 testing was not begun.

## 1. Checkpoint reviewed

| Item | Independently verified identity |
|---|---|
| Archive | `Encounter_M0_M1_Checkpoint.zip`, 183,126 bytes |
| Archive SHA-256 | `e42900345ee3c1aba1956d6212577683321bc5c5f42ab3e1d6f12eb45fceb3bf` |
| External identity | `Encounter_M0_M1_Checkpoint.identity.json` |
| Members | All 24 paths, byte counts, and SHA-256 values match; no missing, extra, duplicate, or unsafe member paths |
| Executable-source revision | `M1-contract-v1` |
| Independently recomputed source digest | `ff27bc93bc7b6105470555b73224f634f72bcf79a7a7e4e29e66264c2b3b7a26` |
| Builder fixture SHA-256 | `f4ddba46ab2804f0358d78c07d30c9c26adca42ea825b2744fee780ddb8b85e4` |
| Legacy HTML SHA-256 | `c9b50efed0ead41d0faa69757969feff8ced1fbc22187c11989aa9ff2dd21eb9` |

The archive and external identity were read from `C:\Users\mcdon\Documents\Codex\2026-10-17\execute-encounter-codex-lead-builder-m0\outputs`. Review execution used a separate extraction at `C:\Users\mcdon\Documents\Codex\2026-10-17\ca\work\m1-review\checkpoint`.

The six separately supplied reference/report documents match their corresponding archive members. The four original builder inputs in Downloads also match their preserved reference copies, including the originally supplied `(1)` download variants. The tester prompt was read from the supplied Downloads path and fingerprinted in `evidence/checkpoint-verification.json`.

The builder source-identity and snapshot scripts were rerun only in a second disposable copy. They regenerated the same source digest and a **byte-identical archive**. A final check confirmed the original archive, all 24 review-extraction members, and all 24 corresponding builder-output members were unchanged. No Git commit is claimed or required for this exported checkpoint.

## 2. Files inspected

All nine requested exact filenames were accessible:

1. `Encounter_Codex_Independent_Tester_M0-M2_Prompt.md`
2. `Encounter_M0_M1_Checkpoint.zip`
3. `Encounter_M0_M1_Checkpoint.identity.json`
4. `Encounter_System_Master_v2.1.md`
5. `Encounter_Approval_Record_2026-10-17.md`
6. `Encounter_Core.html`
7. `M0_Baseline_Inventory_and_Reuse_Plan.md`
8. `M1_M2_Contract_Note.md`
9. `Test_Results_and_Scope.md`

Source review covered all four modules: `src/contracts.mjs`, `src/views.mjs`, `src/runtime.mjs`, and `src/action-boundary.mjs`; both builder test files and `tests/fixtures.mjs`; `README.md`; `package.json`; and all four scripts under `scripts/`. The archived baseline log, contract-test log, source identity, and preservation evidence were checked against fresh execution and independent hashes.

The master review focused on Part 0, §§2.1–2.10, the closure conflict in §2.12, §§3.0–3.10, §§6.2–6.6, and Part 7. These are requirement reviews, not gameplay pass declarations. The additional archived lead prompt was treated as source context, not a new instruction to build M2.

The external independent tests use their own neutral fixtures and call the checkpoint modules directly. They do not import the builder's test fixtures or implement a second game.

## 3. Commands actually executed

Environment independently observed: Windows; PowerShell 7.6.5; Node v24.18.0; npm 11.16.0; Python 3.12.0; Git 2.55.0.windows.3; ripgrep 15.2.0. No dependency installation or network call was needed.

| Command / operation | Working location | Result |
|---|---|---|
| `python work\verify_m1_checkpoint.py` | This review workspace | Independent archive/member verification, separate-copy/original comparisons, safe extraction: pass |
| `node --version`, `npm.cmd --version`, `python --version`, `git --version` | Review extraction | All version queries succeeded |
| `git rev-parse --show-toplevel`; `git status --short` | Actual builder workspace | Both exit 128, “not a git repository,” consistent with the report |
| `node scripts/audit-baseline.cjs` | Review extraction | 7 passed, 0 failed |
| `npm.cmd test` | Review extraction | 36 passed, 0 failed; no skipped/cancelled/todo |
| `python scripts/verify-checkpoint.py <original external identity path>` | Review extraction | Archive and all 24 members verified |
| Independent read-only implementation of the source-digest calculation | Review extraction | Digest and all 12 executable-source entries match |
| `python scripts/source-identity.py` | Disposable tooling copy | Same source digest |
| `python scripts/snapshot.py Encounter_M0_M1_Checkpoint` | Disposable tooling copy | Same archive bytes and SHA-256 |
| `node --test --test-reporter=tap outputs\M1_Independent_Contract_Tests.test.mjs` | This review workspace, `ENCOUNTER_CHECKPOINT` set to the extraction | 22 tests: 20 passed, 2 failed |
| `node --test --test-name-pattern=D01- --test-reporter=tap <independent test file>` | This review workspace, same environment variable | Both defects reproduced; captured Node process exit 1 |
| `python work\record_m1_regressions.py` | This review workspace | Records focused child exit/output and verifies final preservation |

PowerShell `Get-Content`, `Get-Item`, `Get-Command`, ancestor instruction-file checks, and `rg` were also used for read-only inspection. Exact resolved executable paths, arguments, working directories, and execution logs are included in the evidence bundle. The full independent TAP file records the initial 22-case run; its enclosing display command ended successfully after printing the log, so that shell exit is not represented as the Node test exit. The focused rerun captures the actual failing child exit directly.

The focused rerun repeats the two existing cases; it does not add two new cases to the totals. The 60 vibe/salience perturbations are comparisons within independent test I10, not 60 separately reported tests.

## 4. M0 findings

No substantive disagreement with the lead's reuse classifications was found.

| Baseline element | Independent finding |
|---|---|
| BASED catalog | Twenty ordered pairs, names, and fusion descriptions are present at HTML lines 83–116. Catalog reuse is reasonable. The old fusion prose does not authorize hidden listener inputs. |
| Selected-vibe reaction lookup | `deliveryEffect`, lines 361–366, directly indexes reactions by the selected incoming vibe and applies intensity multipliers. Correctly superseded. |
| Fixed seats and legacy trust | `validateWorld` requires `player`/`npc` seats; `createSession` initializes a single legacy trust/tension/patience state. Correctly excluded from the new model. |
| Evidence ranks | `HEARSAY:1`, `SUPPORTED:2`, `OBSERVED:4` at line 175. These are legacy ranks, not approved new certainty values. |
| Preview/send | Preview validates and returns wording without changing the session. Send clones state but clears pending offers on every message at line 387. The reuse plan correctly separates that obsolete offer behavior. |
| Offer confirmation | `normalizeTerms` and `acceptOffer` recheck availability and exact confirmation, then transfer on a copy. Useful safeguards; the old offer/session revision coupling does not implement PD-06. |
| Public view | Lines 501–508 expose all topics, all good quantities, and available-information labels. The baseline audit deliberately confirms this limitation; it is not a new-core privacy pass. |
| Import/export/save | Static code contains version validation, manual JSON import/export and autosave handling. Browser behavior was not executed or certified. |
| Live editing | `applyWorld`, lines 469–474, and the live ledger Apply handler, lines 784–789, replace the running world. Correctly superseded by edit/validate/restart. |

The claimed source files and test scripts exist, and their executable commands reproduce the reported limited results. Current Git status and tool versions agree with the inventory. The initially empty workspace is a historical inventory statement: this review cannot independently reconstruct its earlier filesystem state.

The original HTML is byte-preserved. The missing historical 253 engine tests and 29 browser checks were not recovered or rerun, and are not included in any fresh count. No unspecified old archive search was needed.

## 5. M1 contract findings

| Review area | Finding |
|---|---|
| Stable IDs | Implemented record IDs use neutral typed hexadecimal syntax. Arbitrary participant IDs work; the new source has no production character/seed-name response branch. Semantic independence of future authored ID allocation still needs content review. |
| Canonical message split | `previewView` exposes the player's own selection; `observeMessage` copies outward communication into a receiving observation; `listenerView` exposes local fragments and claims; `recipientHistory` and `authorInspector` are detached read paths. Actual call flow supports the documented split. D01-A separately breaks command-journal fidelity under callback alias mutation. |
| Observation/source protection | The source-read API has no full-world resolver and returns only already received details. All three supported citation kinds were challenged. Concealed detail changes do not alter the complete listener view. Source grants remain authoritative configuration, not an arbitrary hostile-JSON security boundary. |
| Claims and hypotheses | Matching heard assertions enter claims; a changed, unheard assertion is filtered. Hearing is not firsthand physical observation. No hypothesis or factual-belief engine exists in this checkpoint. Its future conditions are specified, not tested as implemented. |
| Permission/action/result | Permission records are separate from action requests and matched results. Ordinary result matching and repeat delivery pass. D01-B defeats the helper's promised stored-result identity protection when its callback mutates a caller-held result alias. |
| Response policy | No actual production response selector exists. The proposed role-bound eligibility/priority/stable-tie policy is compatible with the approved direction; its implementation remains an M2 review task. No response equality or first-request gameplay pass is claimed. |
| Update order | Ordinary exact retry, identity collision, and new stale-command cases pass, including retry after intervening commits. Technical rejection rolls back; a neutral social refusal can record hearing. Frozen callback arguments do not protect the original objects that are reread after callbacks: see both defects. |
| Package/run separation | `createRun` detaches starting data and pins a copied package identity. Later changes to caller-held starting data/reference do not affect it. Full authored-package validation, domain save validation and import/export remain M2 work. Unsupported legacy envelopes are rejected rather than converted. |
| Future offers | Execution is explicitly unavailable at M1. The note preserves exact confirmation, separate offer/session revisions, harmless-discussion persistence, and atomic future transactions. No new transaction engine was inferred or tested. |

The note correctly excludes collection closure and the unapproved missing-preview fallback, and correctly puts committed-identity lookup ahead of staleness. Non-mutating read functions passed the exercised checks. Presentation/UI integration and actual inspector dispatch have not been built or tested.

## 6. Passed checks

| Fresh suite | Passed | Failed | Scope |
|---|---:|---:|---|
| Legacy M0 baseline audit | 7 | 0 | Non-DOM legacy checks and inline-script syntax only |
| Builder M1 contract suite, independently rerun | 36 | 0 | Supplied neutral contract tests |
| Independent M1 suite | 20 | 2 | Additional requirement-based neutral contract tests |

Independent cases I01–I20 passed. They cover delayed exact retries, changed immutable payloads, new stale commands, rollback/error suppression, social refusal versus technical rejection, restored/corrupt journals, detached committed-state/result aliases, package/run detachment, repeated read neutrality, all 20 × 3 private-selector perturbations with fixed outward information, legitimate distinctive cues, nested hidden-field rejection, opaque-source reads, actor locality, heard-claim attribution, neutral IDs, permission without action, ordinary once-only result staging, result mismatch/failure rollback, and explicit unsupported-operation rejection.

These exercise contract-level portions of LC-T04, LC-T09–13, LC-T28, LC-T38, LC-T40, LC-T46–47, LC-T57, LC-T59 and LC-T67–68. They are not full scenario acceptance passes. In particular, I10 is a listener-input equality check, not a test of an absent NPC policy or future observable gameplay trace.

## 7. Defects

Both defects require a synchronous trusted callback to mutate an input object through a caller-held alias. They are reproducible shared-boundary defects, not evidence of a data-only exploit or an observed playable M2 failure. The existing neutral builder callbacks do not trigger them. The contract currently accepts mutable inputs, creates detached callback arguments, and promises immutable command/result identity; it does not declare caller originals must already be frozen.

### D01-A — HIGH: the journal can record a different command from the one resolved

**Location:** `src/runtime.mjs:53–62`, especially receipt/journal construction from the original `command` at lines 60–62.

**Reproduction:** Independent test `D01-A`, test file lines 250–257.

1. Create a valid mutable command and retain an independent copy of its submitted bytes. Its private selected vibe is `EA`.
2. In `validateNew`, mutate the original caller-held command's selected vibe to `DE`, then return true. Do not change the frozen command argument supplied by the runtime.
3. Resolve the command, recording the frozen argument in neutral staged data.
4. Retry the original submitted copy against the resulting run.

**Expected:** Either reject safely with no commit, or commit/journal the same immutable submitted command that was validated and resolved. If committed, its exact original retry must reuse the saved receipt.

**Actual:** The operation commits. The resolved staged record contains `EA`, but the journal stores `DE`. Retrying the actual submitted command returns `rejected / IDENTITY_CONFLICT`, rather than `replayed`. The runtime creates `immutableCommand` before callbacks but rereads the mutable original to construct the authoritative journal afterward.

**Governing requirements:** Tester prompt §§4.2, 7.2 and 7.7; master §§3.2 and 3.7, PD-07/PD-08, LC-T28; M1 note §7 steps 2, 6 and 8, requiring the exact immutable command and receipt.

**Action required:** Lead code change. Use one authoritative detached command snapshot throughout resolution and commit, or reject mutation atomically. Add a regression covering original-input aliases, not only returned-result aliases. This can preserve approved behavior and needs no new owner-facing design decision. No fix was applied in this review.

### D01-B — CRITICAL: result alias mutation can bypass the helper's duplicate-effect journal

**Location:** `src/action-boundary.mjs:9–19`, especially copying the original `result` into `actionResults` after invoking `apply`.

**Reproduction:** Independent test `D01-B`, test file lines 259–268.

1. Construct a valid neutral result `result_0010` for `command_000b`; retain an independent copy of the submitted result.
2. Call `stageMatchedResult` with an adapter that applies one neutral increment using the copied effects.
3. In the same adapter, mutate the original caller-held result to `result_00ff` with request command `command_00ff`, and return true.
4. Redeliver the unchanged originally submitted result/request to the returned staged data.

**Expected:** Reject the first mutation without publishing staged effects, or record the original validated result identity so its redelivery is a no-op. The counter must remain one.

**Actual:** The first returned data has count one but records the changed `result_00ff / command_00ff`, which no longer matches the request used for validation/effect application. Redelivery of the real `result_0010 / command_000b` finds no prior identity and applies again: **count becomes two**. The original caller's initial data remains unchanged, but the helper's returned result journal is inconsistent and its duplicate protection fails.

**Severity basis:** The supplied severity guide classifies duplicate-effect invariant violations as CRITICAL. This reproduction demonstrates a neutral effect at the implemented staging-helper boundary. Ordinary whole-command exact retry still passes; no claim is made that a runnable M2 game has duplicated an effect.

**Governing requirements:** Tester prompt §§5 and 7.5–7.7; master §3.6, PD-07, LC-T28/LC-T40; M1 note §5, promising an exactly matched result, no repeat effect, and rejection of changed identity.

**Action required:** Lead code change. Bind validation, deduplication, effect staging and stored identity to the same detached request/result snapshots, or fail atomically if those identities change. Add a regression with an alias to the original supplied result. This is internal boundary repair; no gameplay redesign or owner decision is needed. No fix was applied in this review.

### Reproduce the independent tests

Extract the supplied source checkpoint unchanged. Put the delivered independent test file anywhere convenient and set its checkpoint location:

```powershell
$env:ENCOUNTER_CHECKPOINT = 'C:\path\to\extracted\checkpoint'
node --test --test-reporter=tap .\M1_Independent_Contract_Tests.test.mjs
```

To run only the two defect cases:

```powershell
node --test --test-name-pattern=D01- --test-reporter=tap .\M1_Independent_Contract_Tests.test.mjs
```

On this exact checkpoint the focused command exits 1 with the two expected failing assertions. Raw output and source hashes are supplied in the evidence bundle.

## 8. Questions/conflicts requiring owner or lead action

1. **Lead:** Repair D01-A and D01-B, retain the invariants above, and provide a new source archive with its matching external identity and updated test evidence. The note's warning that arbitrary domain callbacks need review does not make it safe for the outer command/result identity journal to differ from the frozen inputs actually resolved. The outer boundary can bind that identity without implementing M2 domain semantics.
2. **Owner, before M3:** The missing-preview closure fallback remains specifically unapproved under tester §4.1, despite its wording in the approval record/master. Confirm it before any M3 closure implementation. This review neither implements nor fails M0/M1 for its absence.
3. **Future M2 integration:** Validate authoritative grants, observation/claim lineage and domain references; bind actual message/command identities and preview revisions; keep policy input filtered; preserve fixed first-request and salience guards; pin the actual package; and verify the actual browser/save/presentation path. These are declared future responsibilities, not additional observed M1 defects or current passes.

No owner clarification is needed to make the two internal repairs concrete. No other chat was messaged, no agent was launched, and no production fix was attempted.

## 9. Verdict

**NOT READY FOR M2**

The archive identity, M0 audit and ordinary M1 contract behavior are verified, but the committed command/result identity boundaries still fail the two reproduced adversarial cases. Supply the lead's fixes as a newly identified checkpoint for M1 re-review. This verdict does not authorize M2 development.

Stopped at the M1 gate. No M2 browser, scenario path, first-request playthrough, semantic compiler, NPC policy, actual inspection resolver, gameplay transcript, inspector trace, full BASED coverage, collection closure or M3+ feature was tested. No `M2_Independent_Test_Report.md` was created. Historical 253/29 results and subjective play quality are not represented as fresh evidence.
