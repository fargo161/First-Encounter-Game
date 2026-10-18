# M1 Independent Tester Re-review — R2

Date: 2026-10-17 (America/New_York). Independent re-review of the supplied R2 M1 checkpoint against the previous review and unchanged tester evidence.

**Verdict: READY FOR M2**

D01-A and D01-B are resolved on this exact R2 checkpoint. Both defects were freshly reproduced against R1, then passed against R2 using the same unchanged independent tests. All required M0/M1 suites passed. No new defect was observed in the reviewed remediation or executed M1 checks. Production code was not modified, and M2 testing was not begun.

## 1. Checkpoint reviewed

| Item | Independently verified identity |
|---|---|
| R2 archive | `Encounter_M0_M1_Checkpoint_R2.zip`, 584,636 bytes |
| R2 archive SHA-256 | `47a879c74ac7f684ff5d3d7d1de742d800d8d5cd801fe833234707ec66be555d` |
| Matching external identity | `Encounter_M0_M1_Checkpoint_R2.identity.json` |
| Identity-file SHA-256 | `32c4ba2e84fe0e522a8376a6ff8d20a46162f15d49446a32c16576a7f4823164` |
| Archive verification | All 35 paths, byte counts and member SHA-256 values match; no missing, extra, duplicate, case-colliding or unsafe paths; ZIP integrity check passed |
| Source revision | `M1-contract-v2` |
| Independently recomputed source digest | `137b1eeda83f325392ffc3b137a90574bd527801c7a766287e0a08c74015e171`, 13 executable-source entries |
| Preserved R1 archive SHA-256 | `e42900345ee3c1aba1956d6212577683321bc5c5f42ab3e1d6f12eb45fceb3bf` |

The supplied files were read from the lead's output directory. Tests ran against fresh, isolated extractions under `C:\Users\mcdon\Documents\Codex\2026-10-17\ca\work\r2-review`, including an R1 control extraction. The separately supplied remediation report matches its R2 archive member exactly.

The source-identity calculation was independently reproduced without rewriting the reviewed extraction. The changed source-identity and snapshot scripts were also run in a separate disposable copy: they regenerated the same digest and a byte-identical R2 archive. The snapshot script refused a second write and refused the old checkpoint name, leaving the generated archive unchanged.

This verdict applies to the R2 archive identified above. The previous NOT READY FOR M2 verdict remains the correct result for the preserved R1 archive.

## 2. Files inspected

The review used:

- The three supplied R2 files: archive, matching external identity, and `M1_Defect_Remediation_Report.md`.
- The original `M1_Independent_Tester_Review.md`, `M1_Independent_Contract_Tests.test.mjs`, and `M1_Independent_Tester_Evidence.zip` from this tester workspace.
- R2's complete production-source diff, both repaired modules in full, and the complete added `tests/identity-regressions.test.mjs`.
- The updated `M1_M2_Contract_Note.md`, `README.md`, `Test_Results_and_Scope.md`, changed snapshot/source-identity scripts, and the new remediation prompt's scope and required identity invariants as background evidence.
- Archived before/after logs, source-preservation evidence, environment records and executed-command records, checked against fresh independent execution.
- The preserved R1 manifest, archive and embedded original evidence manifest. Unchanged authoritative references, M0 plan, record/view modules, package configuration, original fixtures and original builder tests were compared by byte hashes to the previously reviewed versions.

The R2 copies under `independent/` match the original tester files byte for byte:

| Unchanged tester item | SHA-256 |
|---|---|
| Test source | `c591b4366097e77da7d21b4ddb861161a6ee3e71e9bc2af15acf5f1393ba4651` |
| Previous review | `9eb82f368f336dea8db17cfc4347ccebb729d1988995c17a9d227267ab36c5a6` |
| Previous evidence ZIP | `30e0f7937339958ac49980a410df74c044a8ceac8b79d5ac70587d4dee878932` |

All members covered by the previous evidence bundle's manifest were reverified, including its embedded R1 checkpoint. The original tester tests and evidence were not edited to obtain passing R2 results.

## 3. Commands actually executed

Freshly checked runtime: Node v24.18.0, npm 11.16.0, Python 3.12.0 on Windows. No dependency installation, browser launch or network service was required.

| Command / operation | Result |
|---|---|
| `python work\verify_r2_checkpoint.py` | Independently verifies R1/R2 archives, original tester evidence and source differences; extracts R2 safely |
| `node --version`; `npm.cmd --version`; `python --version` | All succeed with the versions above |
| `node --test --test-name-pattern=D01- --test-reporter=tap <unchanged tester file>` with `ENCOUNTER_CHECKPOINT` pointing to fresh R1 | Exit 1: 0 passed, 2 failed, reproducing the original expected failures |
| Same unchanged focused command with `ENCOUNTER_CHECKPOINT` pointing to fresh R2 | Exit 0: 2 passed, 0 failed |
| `node scripts/audit-baseline.cjs` in R2 | Exit 0: 7 passed, 0 failed |
| `npm.cmd test -- --test-reporter=tap` in R2 | Exit 0: all 38 builder tests passed; captured output used Node's default reporter despite the forwarded reporter argument |
| `node --test --test-reporter=tap <unchanged tester file>` bound to R2 | Exit 0: all 22 independent tests passed |
| `python scripts/verify-checkpoint.py <matching R2 identity path>` | Exit 0: same archive hash and all 35 members verified |
| Independent read-only source-digest calculation | Matches revision v2, all 13 source entries and the stored digest |
| `python scripts/source-identity.py` in a disposable copy | Exit 0: same source digest |
| `python scripts/snapshot.py Encounter_M0_M1_Checkpoint_R2` in that copy | Exit 0: byte-identical R2 archive |
| Repeat snapshot command against its existing destination | Expected exit 1: overwrite refused; archive hash unchanged |
| `python scripts/snapshot.py Encounter_M0_M1_Checkpoint` in that copy | Expected exit 1: old label refused |

`python work\run_r2_checks.py` captured exact resolved executables, arguments, working directories, environment bindings, stdout/stderr and child exit codes. Read-only PowerShell source/diff inspection and final preservation/package checks are recorded separately in the delivered evidence.

The focused defect runs overlap the complete independent suite. They establish before/after reproduction and are not counted as additional distinct R2 tests. Expected R1 failures and packaging-guard refusals are not failures of the repaired R2 M1 suites.

## 4. M0 findings

The original M0 inventory and reuse plan, all four original reference files, baseline audit source and legacy HTML are unchanged from the previously reviewed checkpoint. The fresh baseline audit again passed all seven checks. The HTML remains SHA-256 `c9b50efed0ead41d0faa69757969feff8ced1fbc22187c11989aa9ff2dd21eb9`.

The previous M0 findings stand: catalog data and selected safeguards can be reused; hidden-label reaction lookup, fixed player/NPC seats, legacy trust, ranks 1/2/4, broad public projection and live world editing are not valid new-core semantics. The baseline test that confirms overbroad public data is still a demonstration of a legacy limitation.

There is no new M0 disagreement or blocker. Historical 253 engine/29 browser results remain historical only. This re-review does not claim to reconstruct the originally empty workspace or to have run legacy browser behavior.

## 5. M1 contract findings

### D01-A remediation inspection

`src/runtime.mjs:38–62` now creates one detached, deeply frozen `immutableCommand` before identity lookup and callback access. That same snapshot supplies identity comparison, new-command validation, session/package/revision checks, all hook arguments, receipt identity and journal storage. After entry, the function does not reread the mutable caller command to build the commit.

This repairs the original mismatch without changing retry order: exact committed retry is checked before current-revision rejection; changed payload conflicts; a genuinely new obsolete command is stale. The original tests passed, and the new builder regression additionally mutates caller identity/metadata during preflight, resolution and postflight while checking resolved content, receipt, journal and replay.

### D01-B remediation inspection

`src/action-boundary.mjs:9–20` now creates one detached, frozen request/result snapshot pair before validation. Matching, duplicate lookup, adapter effect/observer copies and stored result all derive from that pair. The original caller request/result objects are not reread after `apply` returns.

The helper still works on copied gameplay data and leaves installation of authoritative state to the shared runtime. Ordinary result replay, identity conflicts, mismatches, unsupported effects and failed-stage behavior remain covered. The new builder regression also changes the caller's request alias, checks the original stored result, rejects changed bytes/second results and verifies rollback of failed staging.

### Regression and scope inspection

Only `src/runtime.mjs` and `src/action-boundary.mjs` changed in production. `src/contracts.mjs` and `src/views.mjs` are byte-identical. Original builder fixture/test files, package configuration, M0 plan and all original references are unchanged. No source member was removed. The remaining changes are the added regressions, revision/packaging tooling, documentation and evidence.

The public function signatures and record schemas are unchanged. The command snapshot remains private to the authoritative runtime; it is not added to listener inputs. The result helper continues passing copied effects and observer details rather than exposing private caller objects. The updates to the contract note accurately describe these internal repairs and retain the original M1/M2 limits.

The unchanged independent suite confirms the exercised information boundaries and read-only behavior still hold: private-selector perturbation, opaque-source filtering, actor locality, canonical received claims, preview/history/inspector neutrality, package/run detachment, technical rollback, ordinary retry/collision/staleness and once-only neutral results. No regression was observed in those implemented M1 contracts.

## 6. Passed checks

| Fresh execution | Passed | Failed | Meaning |
|---|---:|---:|---|
| R1 control, original D01 cases | 0 | 2 | Expected original failures reproduced; does not describe R2 |
| R2 focused original D01 cases | 2 | 0 | Both exact original reproductions now pass |
| R2 M0 baseline audit | 7 | 0 | Limited non-DOM legacy checks |
| R2 builder M1 suite | 38 | 0 | Original 36 tests plus two added remediation regressions |
| R2 unchanged independent M1 suite | 22 | 0 | All original I01–I20 and D01-A/B cases |

Builder and full independent suites had no skipped, cancelled or todo cases. I10's 60 private vibe/salience comparisons remain one test case, not 60 separate reported tests. Source/member verification and packaging checks passed independently of these behavioral counts.

These are contract-level results. They do not mark absent scenario acceptance behavior, actual NPC decisions, all 69 acceptance specifications, or all 360 BASED coverage cases as passed.

## 7. Defects

| Original finding | Fresh R1 actual result | Fresh R2 actual result | Status |
|---|---|---|---|
| D01-A — HIGH, journal differs from the resolved submitted command | Original exact retry rejected with `IDENTITY_CONFLICT`; journal contained changed `DE` instead of submitted `EA` | Original exact retry replays; journal/receipt/resolved command remain bound to the submitted snapshot | **RESOLVED** |
| D01-B — CRITICAL, alias mutation hides an applied result identity | Original result redelivery applies a second neutral increment; counter becomes 2 | Original result redelivery is a replay/no-op; counter remains 1 | **RESOLVED** |

No original finding remains open on R2, and no new defect was observed in this scoped re-review. Severity labels above identify the original findings; they are not current unresolved R2 defects.

The requirement basis is unchanged: tester §§4.2, 5 and 7.2/7.5–7.7; master §§3.2, 3.6–3.7, PD-07/PD-08 and LC-T28/LC-T40; plus the M1 note's immutable command and exactly matched result contracts. Neither repair weakens those requirements or changes approved player-visible behavior.

## 8. Questions/conflicts requiring owner or lead action

No clarification or further M1 repair is required for the two reviewed defects.

The previous before-M3 question about the specifically unapproved missing-preview closure fallback remains open in its original later scope. It does not block M1 readiness, and no closure behavior was implemented or tested here.

Future integration still has to validate actual domain records and source grants, maintain package/run identity, supply the real compiler/policy/resolver, preserve the protected ordinary first request and salience meaning, and verify browser/save/presentation behavior against an actual M2 build. Those are future M2 responsibilities, not additional defects or passes assigned to this M1 checkpoint.

The repaired functions protect the reviewed submitted command/request/result identities. They do not sandbox arbitrary trusted hook code, undo external side effects in callbacks, or prove the correctness of an unbuilt domain resolver. The original information-boundary and single-commit requirements continue to apply.

## 9. Verdict

**READY FOR M2**

This R2 checkpoint satisfies the independently exercised M1 gate: authentic source, unchanged tester evidence, both original defects reproduced then resolved, required suites passing, and no observed remediation regression.

This is an M1 readiness verdict. It does not begin or authorize M2 work in this chat. Stopped at the M1 gate as requested. No M2 browser interaction, scenario playthrough, semantic compiler, production NPC policy, actual inspection resolver, generated gameplay transcript, matching inspector trace, collection closure or later milestone was tested. No production source, original tester test file, previous review or previous evidence bundle was modified.

### Reproduce on the supplied R2 checkpoint

Extract `Encounter_M0_M1_Checkpoint_R2.zip` unchanged into a fresh folder and use the unchanged independent test file from the delivered bundle:

```powershell
$env:ENCOUNTER_CHECKPOINT = 'C:\path\to\extracted\R2'
node --test --test-name-pattern=D01- --test-reporter=tap .\M1_Independent_Contract_Tests.test.mjs
node --test --test-reporter=tap .\M1_Independent_Contract_Tests.test.mjs
```

From the extracted R2 root, run `node scripts/audit-baseline.cjs` and `npm.cmd test`. Expected results are 7 baseline, 38 builder and 22 independent tests passed. The focused two cases are a subset of the 22. Rebinding the unchanged tests to the preserved R1 archive reproduces the two original failures.
