# Encounter System — M3 Codex Handoff

## Purpose

This package authorizes **M3 only** for the reusable Encounter System.

M3 is the first complete playable **Seed A — The Protective Shortcut** slice built on the independently verified M2 checkpoint.

The formal implementation instructions are in:

`Encounter_M3_Codex_Implementation_Prompt.md`

Read that file in full before changing source.

---

## Governing baseline

The only implementation baseline is:

`baseline/Encounter_M2_Checkpoint.zip`

Verified SHA-256:

`940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7`

Do not edit this ZIP in place. Verify it, extract it into a new M3 work area/branch/copy, and preserve the supplied checkpoint unchanged for regression comparison.

The M2 checkpoint already contains the governing Encounter documents under its `reference/` directory, including:

- `Encounter_System_Master_v2.1.md`
- `Encounter_Approval_Record_2026-10-17.md`
- the M0–M2 lead-builder prompt
- the M1 remediation prompt
- the R2/M1/M2 contract notes

Do not substitute older project documents for these embedded copies.

---

## Independent M2 evidence

Before M3 work, read:

`review/M2_Independent_Test_Report.md`

The M2 verdict is:

**READY FOR NEXT SCOPE**

The review independently verified the exact checkpoint, browser path, causal trace, save/load behavior, regeneration, idempotency and existing M0/M1/M2 tests. The accompanying raw evidence is:

`review/M2_Independent_Test_Evidence.zip`

M3 must preserve those demonstrated invariants unless the governing source explicitly changes one.

---

## M3 target

M3 is **Seed A playable**, including:

- full recovery path;
- relevant evidence acquisition through real actions;
- understandable privacy boundary;
- authored restriction behavior;
- one meaningful repair episode;
- explicitly warned/previewed failure closure;
- unnecessary-money refusal without invented debt or bribery logic;
- custody/ownership correctness;
- save/load continuity;
- causal inspector evidence;
- portability/renaming proof that core logic is not scenario-name dependent.

Do not drift into M4+.

---

## Critical locked boundary: Encounter vs host world

Encounter remains a reusable interaction engine. Trapstar is a reference host, not a dependency.

The file:

`reference/Trapstar_Routing_Player_Movement_NPC_Lanes_Context.md`

is **reference-only integration context**. It explains the host systems Encounter must be able to cooperate with later: player routes, NPC lanes, gathering/interaction locations, cover/hiding, movement, sight/hearing results, spawning/despawning and presentation.

Do **not** copy route, lane, node, pathfinding, geometry, spawning, facing or locomotion logic into Encounter core.

The intended boundary is:

1. Host world determines physical/spatial facts and actions.
2. Host determines which actor receives which observable fragment.
3. Encounter records actor-local observations/results.
4. Encounter interprets only the actor-local information it is allowed to use.
5. Encounter returns social meaning: response, refusal, permission, proposal, warning, etc.
6. Host performs any actual physical/world action through its own resolver.

If an integration seam is needed for M3, it must be generic, host-neutral and small.

---

## Locked closure rule for M3

For the warned Seed A closure path:

**No displayed closure notice = no closure.**

A renewed protected/full-file demand may close collection service only when the approved predicate is satisfied and the player was shown the required consequence before Send.

Do not silently invent a harsher fallback.

---

## Required working order

1. Verify component hashes from `manifest/M3_Handoff_Manifest.json`.
2. Verify the M2 checkpoint with its supplied identity tooling.
3. Read the M3 implementation prompt completely.
4. Read the embedded Master v2.1 and approval record from the M2 checkpoint.
5. Read the independent M2 report.
6. Inspect M2 contracts/source/tests before coding.
7. Write a short M3 implementation plan identifying reuse vs extension.
8. Implement M3 in a new work copy/branch.
9. Run inherited regression suites plus fresh M3 tests.
10. Exercise browser/manual happy, repair, closure, Offer and save/load routes.
11. Produce exact tested-build identity and causal evidence.
12. Return an M3 checkpoint marked either:
   - **READY FOR INDEPENDENT M3 REVIEW**, or
   - **NOT READY FOR INDEPENDENT M3 REVIEW** with specific blockers.

Do not begin M4 automatically.

---

## Expected final M3 deliverable

The implementation prompt defines the full required output. At minimum the returned checkpoint should contain runnable build, editable source, identity information, implementation/regression reports, fresh automated outputs, browser/manual records, successful and closure run exports, causal inspector traces, readable transcripts, save/load evidence, portability evidence, limitations/deferred items, and preferably a repaired-but-not-yet-recovered save fixture.
