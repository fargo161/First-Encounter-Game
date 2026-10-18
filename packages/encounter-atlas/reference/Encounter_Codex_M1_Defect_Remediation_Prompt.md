# Encounter System — Codex Lead Builder M1 Defect Remediation
## Repair D01-A and D01-B only · Do not begin M2
### Owner: Theodore (Teddy) McDonald
### Date: 2026-10-17

> **AUTHORIZATION:** Repair the two M1 defects identified by the independent tester, rerun the M0/M1 contract tests, create a new frozen M1 checkpoint, and stop for independent re-review.
>
> **M2 IS NOT AUTHORIZED.** Do not build the browser interaction, Last Collection M2 content, semantic compiler, production NPC policy, physical inspection resolver, collection closure, Seed A recovery, Seed B negotiation, full BASED coverage, or later milestones.

---

# 1. Inputs

Read these tester outputs in full before editing production source:

1. `M1_Independent_Tester_Review.md`
2. `M1_Independent_Tester_Evidence.zip`

Continue to use the existing M0/M1 authority/reference set already present in this lead-builder task:

- `Encounter_Codex_Lead_Builder_M0-M2_Prompt.md`
- `Encounter_System_Master_v2.1.md`
- `Encounter_Approval_Record_2026-10-17.md`
- `Encounter_Core.html`
- the existing M0/M1 checkpoint and its identity file
- `M0_Baseline_Inventory_and_Reuse_Plan.md`
- `M1_M2_Contract_Note.md`
- `Test_Results_and_Scope.md`

The independent review verdict on the current checkpoint is **NOT READY FOR M2** because of two reproduced mutable-input identity defects. The tester did not modify production source and did not begin M2.

---

# 2. Scope

Fix exactly these two defects:

- **D01-A — HIGH:** the command journal can record a different command than the immutable command actually validated/resolved when a callback mutates a caller-held command alias.
- **D01-B — CRITICAL:** the physical-result staging helper can store a mutated result identity after effects were applied from the original result, allowing the original result to be delivered again and applied twice.

These are internal M1 boundary repairs. They do **not** require a new owner-facing design decision.

Do not use this remediation as permission to refactor unrelated behavior or add M2 features.

---

# 3. Required invariant for D01-A

One authoritative immutable submitted-command snapshot must govern the entire operation.

For a new command, the command bytes/structure used for:

- identity comparison;
- validation;
- callbacks;
- resolution;
- receipt identity;
- journal storage;
- future exact-retry comparison

must describe the **same submitted command**.

A callback may receive detached/frozen data, but mutating another caller-held alias to the original input must not cause the authoritative journal to change after validation/resolution.

Required externally visible behavior:

1. **Exact retry** — same committed command ID + same immutable submitted payload: return/reuse the prior receipt, with no new effects, even though the original expected revision is now old.
2. **Identity collision** — same command ID + different payload: reject with identity conflict, no gameplay effect.
3. **New stale command** — new command ID + obsolete state revision: reject as stale, no gameplay effect.
4. A callback's mutation of a caller-held alias must not make the journal disagree with the command that was actually resolved.

The clean implementation is expected to use one detached authoritative command snapshot throughout commit. Equivalent code is acceptable if it satisfies the same invariant.

Do **not** solve this by trusting callbacks, changing the retry semantics, or weakening identity comparison.

---

# 4. Required invariant for D01-B

One authoritative immutable request/result snapshot pair must govern validation, deduplication, effect application, and stored result identity.

For `stageMatchedResult` or its equivalent:

- validate a detached request/result snapshot;
- perform duplicate lookup against that same result/request identity;
- pass effect/observer copies derived from that immutable snapshot to the callback;
- store the same immutable result identity after successful staging;
- never reread a mutable caller-owned request/result object after invoking the effect callback.

A callback that mutates an external alias to the original result must not change the result identity recorded in staged state.

Required externally visible behavior:

1. First valid result applies its supported effect once.
2. Re-delivery of the exact original result is a replay/no-op.
3. Same result identity with changed bytes is rejected.
4. A second different result for the same action request is rejected.
5. Callback mutation cannot make an already-applied original result appear unseen and therefore apply twice.
6. Failure remains atomic: caller input/state must not be partially mutated/published.

Do **not** solve this by removing duplicate-result protection or by treating the callback-mutated identity as authoritative.

---

# 5. Required regression tests

Add production regression tests for both defects. Do not rely only on the tester's external test file.

## 5.1 D01-A regression

Create a mutable submitted command and an independent copy of its original submitted bytes/structure.

During a trusted synchronous callback such as `validateNew`, mutate the caller-held original command alias after the runtime has created its authoritative snapshot.

Verify:

- the operation either rejects atomically **or**, preferably under the current contract, commits using the original immutable submitted command;
- resolved staged data and the journal describe the same original command;
- the journal does not contain the callback-mutated value;
- retrying the independent original submitted copy returns `replayed`;
- no duplicate gameplay effects occur.

Keep the existing retry / identity-conflict / stale-command tests.

## 5.2 D01-B regression

Create a valid request and result plus an independent copy of the original result.

During the effect callback:

- apply the supported neutral effect;
- mutate the caller-held original result alias, including its result ID and request command ID.

Verify:

- returned staged data stores the original validated result identity;
- effect count is one;
- re-delivering the independent original result is recognized as replay/no-op;
- effect count remains one;
- changed-identity / second-result cases still reject.

## 5.3 Independent tester suite

Extract/read the tester evidence bundle and run the tester's supplied `M1_Independent_Contract_Tests.test.mjs` against the repaired checkpoint source.

Expected after repair:

- all prior independent passing tests remain passing;
- D01-A passes;
- D01-B passes;
- no independent M1 test fails.

Do not edit the tester's test file to obtain a pass.

---

# 6. Required fresh execution after the fix

At minimum rerun and report:

1. M0 baseline audit — expected existing 7 checks still pass.
2. Builder M1 contract suite — all existing checks plus the new regression tests must pass.
3. Independent tester M1 suite from the evidence bundle — all cases must pass unchanged.
4. Source-preservation checks for the original supplied reference files.
5. Snapshot/checkpoint verification for the newly generated archive.

Clearly separate:

- builder tests;
- tester-supplied independent tests;
- static checks;
- anything not run.

Do not reuse the old 36-pass result as the new result; rerun it on the repaired source.

Do not represent historical 253/29 tests as fresh validation.

---

# 7. Update the M1 documentation

Update `M1_M2_Contract_Note.md` only where necessary to reflect the repaired authoritative-snapshot rule.

The note must state plainly that:

- one immutable command snapshot is used through validation/resolution/commit/journaling;
- caller alias mutation cannot alter authoritative command identity;
- one immutable request/result snapshot pair is used through result validation/effect staging/result journaling;
- callbacks never make caller-owned mutable identities authoritative after they run.

Update `Test_Results_and_Scope.md` with fresh results and make clear that M2 remains gated.

Create a short new remediation report:

`M1_Defect_Remediation_Report.md`

with these sections:

1. Defects addressed
2. Production files changed
3. Exact fix for D01-A
4. Exact fix for D01-B
5. Regression tests added
6. Commands executed
7. Fresh results
8. New checkpoint identity
9. Remaining limitations
10. M1 gate status

---

# 8. Produce a new checkpoint; preserve the old one

Do not overwrite the failed checkpoint or its identity file.

Create a new frozen checkpoint with an unambiguous new name, preferably:

- `Encounter_M0_M1_Checkpoint_R2.zip`
- `Encounter_M0_M1_Checkpoint_R2.identity.json`

Use a new source revision identity, for example `M1-contract-v2`, or another clearly documented equivalent.

The new identity file must contain:

- archive SHA-256;
- per-member byte counts;
- per-member SHA-256 values.

Verify the archive against that identity after creation.

The checkpoint must include at minimum:

- repaired production source;
- builder tests including both regressions;
- M0 plan;
- updated M1 contract note;
- updated test-results report;
- `M1_Defect_Remediation_Report.md`;
- exact test logs;
- reference copies required to reproduce the checkpoint;
- snapshot/verification tooling needed to verify it.

Do not include edited versions of the independent tester evidence as though they were original tester output. You may include an untouched copy or record its external hash/reference if useful.

---

# 9. M1 gate after remediation

After the new checkpoint is produced:

**STOP. M2 remains unauthorized.**

Your final message must state:

- that D01-A and D01-B were repaired;
- fresh builder test counts;
- fresh independent tester-suite counts;
- the new archive filename;
- the new archive SHA-256;
- the source revision identity;
- whether all source-preservation checks passed;
- that M2 has not begun;
- that the new checkpoint requires independent tester re-review.

Do not claim the M1 gate is cleared yourself.

Only the independent tester's re-review (or an explicit owner waiver) can clear it.

---

# 10. Do not do these things

Do not:

- begin M2;
- author Last Collection M2 content;
- build the browser UI;
- implement semantic BASED production coverage;
- implement production NPC response policy;
- implement the physical inspection resolver;
- implement CR-01 restriction/repair/closure;
- implement the missing-preview fallback;
- implement Seed A recovery or Seed B negotiation;
- expand the Assembler;
- add specialists/subagents;
- change approved player-visible behavior;
- alter the independent tester's tests to make them pass;
- erase or replace the original failed checkpoint;
- weaken retry, identity, atomicity, or duplicate-result invariants.

---

# 11. Definition of done

This remediation is complete only when:

- D01-A is fixed in production source;
- D01-B is fixed in production source;
- both have builder regression tests;
- all original builder M1 tests still pass;
- the new builder regression tests pass;
- the tester-supplied independent suite passes unchanged;
- M0 baseline checks remain passing;
- original references remain byte-preserved;
- updated M1 documentation describes the actual fixed behavior;
- a newly named frozen checkpoint and matching external identity file are produced and verified;
- the remediation report is produced;
- M2 has not begun;
- the lead stops for independent tester re-review.
