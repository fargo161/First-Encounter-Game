# Encounter System — Independent M3 Review

You are the **independent tester/reviewer** for M3 of the Encounter System.

Your task is to test the supplied frozen M3 checkpoint adversarially and independently. You are **not** the lead builder, you are not being asked to continue implementation, and you must not begin M4.

The lead builder currently claims:

**READY FOR INDEPENDENT M3 REVIEW**

Treat that only as a claim to verify.

---

## 1. Exact artifact and identity gate

The artifact under review is:

`inputs/Encounter_M3_Checkpoint.zip`

Expected SHA-256:

`de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64`

Expected size:

`7,534,657` bytes

Expected member count:

`189`

Its sibling identity file is:

`inputs/Encounter_M3_Checkpoint.identity.json`

Expected source/package identities:

- source revision: `M3-runtime-v1`
- source digest: `716a11c4efe9462e8ad60f16d6615ed8537811cf779d10dee424ef92558e3a94`
- content revision: `M3-protective-shortcut-v1`
- package: `package_0003`, revision `1`
- package digest: `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f`
- browser build SHA-256: `4fa1f60a1ec6a561375bdc38799693943b0910886d2f7ea838099d9303469e58`
- preserved M2 baseline SHA-256: `940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7`

**Before reviewing behavior:**

1. hash the supplied ZIP yourself;
2. verify its byte length;
3. verify every archive member against the external identity file;
4. reject missing, extra, duplicate, case-colliding, absolute, parent-traversal, or otherwise unsafe paths;
5. make a fresh extraction into a new review directory;
6. preserve the supplied ZIP and identity byte-for-byte;
7. record exact environment/tool versions and all commands you execute.

If the exact artifact identity does not verify, stop and report **NOT READY FOR NEXT SCOPE**.

Do not substitute another similarly named M3 folder or a builder worktree.

---

## 2. Governing sources and precedence

Read the governing source set from the verified checkpoint before designing your independent tests. At minimum read:

- `reference/Encounter_System_Master_v2.1.md`
- `reference/Encounter_Approval_Record_2026-10-17.md`
- `reference/M3_Owner_Approval_2026-10-17.md`
- `reference/M3_Handoff/Encounter_M3_Codex_Implementation_Prompt.md`
- `M3_Implementation_Plan.md`
- `M3_Implementation_Report.md`
- `Test_Results_and_Scope.md`
- `README.md`
- relevant M1/M2 contract notes and prior independent reports under `independent/` and `reference/`

The owner's direct M3 approval is controlling where it adds an explicit constraint. In particular, the approved rule is:

> **No displayed closure notice = no closure.**

If the notice was not actually displayed, the qualifying message may be received/refused, service remains open, and a technical defect is logged. Do not invent an additional player-facing consequence.

Do not silently reconcile genuine source conflicts. If you find one that affects the verdict, quote/identify the exact conflicting locations in your report.

---

## 3. Independence rules

The builder's reports, supplied M3 tests, browser exports, screenshots, fixtures, traces and verification JSON are useful **comparison material**, not independent proof.

You must generate fresh evidence.

You may run the supplied tests, but do not merely rerun them and call the milestone independently verified. Inspect their assertions and add your own external/adversarial tests where a builder test could be self-confirming, implementation-coupled, incomplete, or fixture-dependent.

Keep independent test code and generated review evidence outside the frozen checkpoint. Do not edit production source to make a test pass. Do not rewrite checkpoint reports. Do not fix defects during this review.

When a failure occurs, preserve the reproducer and classify it. Do not change the product unless the owner explicitly starts a remediation pass later.

---

## 4. Fresh regression baseline

From the fresh extraction, rerun and record the existing checks, including the equivalent of:

- M0 baseline audit;
- all builder M1/M2/M3 tests;
- unchanged independent M1 suite;
- unchanged independent M2 suite;
- checkpoint verification;
- fresh M3 build;
- deterministic/generated-evidence validation.

The builder claims the fresh totals were:

- M0: 7 passed;
- builder: 112 passed (64 inherited + 48 M3);
- independent M1: 22 passed;
- independent M2: 18 passed;
- zero failures/skips.

Do not treat historical counts as evidence. Your report must distinguish your fresh executions from supplied historical output.

Inspect whether any inherited tests were weakened, bypassed, conditionally skipped, repointed to compatibility shims, or rendered irrelevant by the M3 extension. A deliberately obsolete M2 assertion may cease to constrain the new M3 API, but the underlying behavioral/security invariant must remain protected where applicable.

---

## 5. Core M3 review question

M3 is complete only if **Seed A — The Protective Shortcut** is genuinely playable while preserving the reusable encounter boundaries.

Independently verify that the implementation supports, without hidden shortcuts:

- valid collection authority;
- protected ordinary first paperwork request;
- real physical evidence acquisition;
- actor-local observation limits;
- Orrin's limited account;
- drying-tag / handling evidence;
- privacy concern based on the required received pattern;
- specific restriction and viable case-only alternative;
- one meaningful substantive repair episode;
- persistent delivered warning;
- deliberate previewed closure;
- missing-notice no-closure fallback;
- unnecessary-money refusal;
- exact zero-payment handover;
- custody changing once while Nera remains owner;
- no required private-contact disclosure;
- record correction that appends rather than erases the original shorthand history;
- save/load continuity;
- causal inspector evidence;
- content/identity portability without Last Collection-specific core branches.

---

## 6. Fresh browser review — do not rely only on fixtures

Use the tested loopback launch path (`python scripts/serve-m3.py`) unless the environment requires an equivalent read-only static host. Record any deviation.

Perform real visible UI interactions. Do not satisfy the browser requirement by calling hidden engine functions from developer tools.

At minimum perform these fresh browser paths:

### A. Complete successful recovery from a clean New run

Do not start this critical path from a supplied completed fixture.

Independently exercise the complete route from a new run through authority, request, physical inspection/search, evidence communication/comparison, exact handover terms and confirmation.

Verify from the resulting save, UI and inspector that:

- authority is actually established;
- permission and action remain separate;
- missing-signature/drying-tag facts arrive only through performed actions;
- the handover costs exactly 0;
- no debt/fee is invented;
- custody changes exactly once;
- ownership remains Nera's;
- private contact information is not needed or disclosed;
- optional record correction does not erase the original shorthand event;
- success in one outcome axis does not silently rewrite unrelated privacy/social/record state.

Export the fresh run, inspector/trace and readable transcript and preserve screenshots of decisive states.

### B. Meaningful-repair route

Reproduce the restriction/warning state through legitimate gameplay or independently justify any fixture used only as an intermediate accelerator.

Verify that all of the following **do not consume repair**:

- reading;
- drafting;
- previewing;
- editing;
- asking Why / clarification;
- ending and reopening conversation;
- changing conversation partner;
- rejected/technically invalid commands.

Verify that a vague apology is insufficient and that a supported substantive narrowing/correction can resolve the repair episode.

Verify that repair does not erase authority, warning or unrelated history, and does not itself perform the physical comparison/recovery.

Save and reload at the repaired-but-not-yet-recovered state, then complete recovery without duplicated or regenerated effects.

### C. Deliberately warned closure

Independently reach a state in which the explicit warning has already been delivered.

Then create a later qualifying protected/full-file or boundary-bypass demand.

Verify **before Send** that the preview visibly and plainly states the closing consequence using only public/player-known information.

Verify:

- Edit/abandon has no effect;
- the draft's substantive meaning is not silently altered by the warning mechanism;
- Send remains possible;
- sending after an actually displayed current notice closes service exactly once;
- duplicate/replayed sending cannot close again or duplicate consequences;
- generic refusal is not itself closure;
- the result is a distinct scenario/world-service action;
- a previously completed recovery cannot be retroactively converted into failure.

Export the fresh run, inspector/trace, transcript and decisive screenshots.

### D. Missing displayed notice

Independently exercise or reproduce the technical path where a qualifying renewed demand reaches processing without a valid display receipt for the closure notice.

Verify the locked rule:

- communication may be received/refused;
- service remains open;
- closure does not commit;
- exactly the appropriate technical defect is recorded;
- no additional invented player-facing punishment appears.

Do not count a purely synthetic unit assertion as sufficient if the browser/display contract can be checked more directly. If an artificial harness is unavoidable, state exactly what it does and does not prove.

---

## 7. Required adversarial tests

Create independent tests/reproducers for the following classes. The exact implementation of the tests is yours; do not simply duplicate the builder's assertion text.

### Information/privacy attacks

Attempt to trigger restriction/closure from information the NPC should not possess:

- private unsent draft;
- another NPC's unheard conversation;
- hidden authored world truth;
- private BASED selector/label rather than performed outward cue;
- source/debug pointer to a concealed field;
- observation of the player inspecting something without receipt of the inspected textual detail;
- Orrin's limited sight somehow upgrading into the damp seam, final destination or Tamsin's purpose;
- absent Nera receiving office events.

Any such leak into policy input is a serious defect.

### Authority / concern separation

Prove that later privacy concern does not rewrite the already verified collection authority into "never authorized." Inspect actual causal inputs and persistent state, not only final dialogue text.

### Shorthand / evasion separation

Prove that the original `collected` shorthand mistake has its own provenance and remains distinct from any later evasive response. A correction must append history, not overwrite the original cause.

### Repair attacks

Try to consume or reset the repair episode through UI activity, partner switching, End/reopen, clarification, invalid commands, save/load or vague apology. Then prove a genuine qualifying repair works once as designed.

### Closure attacks

Test at least:

- no prior warning -> no closure;
- warning but no displayed current notice -> no closure;
- case-only/narrow request -> no closure notice;
- Why/clarification -> no closure notice;
- warned renewed protected/full-file demand -> notice;
- edited/abandoned flagged draft -> no consequence;
- stale notice/draft/revision mismatch cannot authorize closure;
- valid displayed notice + qualifying send -> exactly one closure;
- retry/replay/duplicate result -> no duplicate closure;
- closure after completed recovery cannot revoke recovery.

### Offer/money attacks

Verify ordinary payment offer behavior:

- the offer is an actual communication;
- it is declined as unnecessary in Seed A;
- money does not move;
- no debt/fee is invented;
- offering money alone is not automatically treated as bribery;
- a proposal to evade a privacy boundary has different semantic meaning/preview;
- stale/altered transaction terms fail safely.

Use any neutral priced test only to examine shared transfer machinery; do not accidentally implement or certify Seed B negotiation as M3.

### Handover / atomicity attacks

Attempt:

- conversational "yes" without exact confirmation;
- replayed confirmation;
- stale version confirmation;
- altered terms;
- invalid current custody;
- insufficient balance in a neutral priced fixture;
- save/load around pending confirmation;
- repeated result delivery.

Verify atomic failure and no duplicate transfer/spend.

### Save/load attacks

Freshly test states including:

- partial evidence;
- permission-only;
- restricted/warned;
- repaired;
- pending handover;
- closed service;
- post-recovery.

Load must not rerun actions, reroll decisions, spend money, transfer custody, reset warning/repair, or resurrect consumed/stale proposals. Tampered, legacy/incompatible and malformed saves must fail without mutating the current valid run.

### Read/playback purity

Verify preview, inspector refresh, replay, skip, save display/download and other read-only surfaces do not mutate run state. Compare complete exports before/after, not just visible counters.

---

## 8. Causal inspector audit

Do not accept a plausible final line of dialogue as sufficient.

For key decisions, inspect the causal record and independently verify that it names the actual:

- received observations;
- actor-local claims;
- scoped belief/hypothesis state where applicable;
- own-state snapshot;
- decision candidates/rule;
- committed results.

Check that the stored/reconstructed `decisionInput` is the same filtered input actually supplied to policy at commit time, not a later approximation assembled from expanded history.

Confirm hidden world truth is used only where physical resolution legitimately requires authoritative state, not as unobserved social-policy knowledge.

---

## 9. Portability / anti-hardcoding review

The builder claims neutral renaming proves the M3 core does not branch on Last Collection names/IDs/keywords.

Audit source and perform your own independent portability test.

Rename at least actor IDs/display names, scenario/package identity and subject/item identifiers while preserving equivalent declared roles/scopes/rules. Exercise both recovery and closure through the same core.

Search core policy/engine code for branches on Last Collection-specific values such as Tamsin, Orrin, Nera, Seed A, the literal green case/transport-office text, or prose privacy keywords.

Authored content may contain scenario-specific facts. Reusable core policy must not depend on those literal identities.

Do not overclaim this test: equivalent renaming demonstrates absence of obvious identity branching; it does not prove arbitrary future content requires no authoring.

---

## 10. Host-boundary audit

Verify M3 did **not** absorb Trapstar/Room Creator responsibilities.

Encounter may consume generic host outcomes/observations but must not calculate or own:

- routes/rails;
- player movement;
- NPC movement lanes;
- pathfinding;
- gathering/cover/hiding nodes;
- doors/world geometry;
- line-of-sight/hearing simulation;
- spawn/despawn policy;
- combat positioning;
- sprite-facing / FRONT / 3/4 / BACK selection;
- billboarding or 3D presentation.

Presentation intent such as guarded Intake, cautious Delivery, warning or deliberate silence is acceptable. Geometry/render selection belongs to the host.

No Trapstar adapter is required for M3. If the builder added one, scrutinize whether it improperly moved host logic into core.

---

## 11. Scope guard

Do not test M3 against unimplemented future requirements as though they were promised here.

M3 does **not** claim:

- full Seed B negotiation;
- full payment/nonpayment route;
- full 20-vibe × 6-act × 3-salience coverage;
- full Assembler/live editing;
- NPC initiation;
- combat/theft/stealth;
- full sensory simulation;
- routes/lanes/pathfinding;
- runtime generative AI;
- unrestricted promises;
- old-save conversion;
- universal psychological simulation;
- unlimited history;
- polished final art/wording;
- mobile/accessibility certification.

You may flag an actual regression or contradiction touching these areas, but do not fail M3 merely because deferred scope is absent.

---

## 12. Required independent deliverables

Produce a clean review bundle **outside the checkpoint** containing at minimum:

1. `M3_Independent_Test_Report.md` — full independent review and final verdict;
2. `M3_Independent_Test_Evidence.zip` — evidence bundle;
3. your independent M3 test source(s);
4. environment/tool/version record;
5. exact command log with exit codes;
6. independently computed checkpoint/archive/member verification;
7. fresh regression outputs;
8. fresh browser interaction record;
9. fresh complete successful recovery run export;
10. fresh warned-closure run export;
11. fresh meaningful-repair continuity save/run evidence;
12. corresponding fresh inspector/causal traces;
13. readable transcripts generated from those fresh runs;
14. decisive screenshots, including closure preview before Send;
15. missing-notice negative-path evidence;
16. save/load/tamper/retry evidence;
17. neutral-renaming/anti-hardcoding evidence;
18. final preservation hash proving the supplied checkpoint ZIP remained unchanged after review.

Clearly label supplied-builder evidence versus evidence you generated yourself.

Do not overwrite the builder's evidence filenames in place.

---

## 13. Verdict standard

Use **READY FOR NEXT SCOPE** only if the exact frozen checkpoint passes the independent M3 contract and no correctness defect remains in the exercised M3 scope.

Use **NOT READY FOR NEXT SCOPE** if you find a reproducible correctness/security/causal-boundary defect, artifact-integrity failure, or required M3 path that cannot be demonstrated.

Distinguish blocking defects from non-blocking limitations/usability observations.

Your final report must state:

- exact ZIP hash and identity tested;
- whether the source was modified (it should not be);
- fresh test totals without inflating matrices/iterations into fake test counts;
- which browser paths were genuinely performed through visible UI;
- what independent adversarial cases were added;
- any discrepancies from builder claims;
- preservation result;
- final verdict.

End the report with exactly one milestone line:

**READY FOR NEXT SCOPE**

or

**NOT READY FOR NEXT SCOPE**

Then stop. **Do not begin M4.**
