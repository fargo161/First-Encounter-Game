---
title: "Encounter System — Owner Approval Record"
date: "2026-10-17"
owner: "Theodore (Teddy) McDonald"
applies_to: "Encounter_System_Master_v2.1.md"
---

# Encounter System — Owner Approval Record, 2026-10-17

**Teddy McDonald, project owner, approved both pending sign-offs in the Encounter master document on 2026-10-17, with two amendments.** Approval was given in conversation and is recorded here so that builders and testers can confirm it. Encounter_System_Master_v2.1.md already contains these approvals and amendments.

## What is approved

| Item | Decision | Amendment | Where in the master |
|---|---|---|---|
| **Sign-off A** — closing rule CR-01: one visit-long repair episode, a persistent public warning, and closure only for a renewed protected-information demand after that warning | **Approved** | Amendment 1: preview notice before any closing message | §2.12 (parts A–E, plus new C2) |
| **Sign-off B** — technical behavior package PD-01 through PD-12, including the 24-opportunity soft reminder, the evidence thresholds, and the offer lifecycle | **Approved** | None | §3.0, §§3.1–3.13 |
| **Seed B — Orrin’s reason to accept the nonpayment release** | **Approved** | Amendment 2: explicit motive | §1.6, §1.10 step 6 |

## Amendment 1 — preview notice before closure

After Tamsin has delivered her explicit warning, any draft to her that would end collection service must say so in its preview, before Send. The notice:

- restates only the public warning and uses only the player’s own draft and inspected evidence;
- reveals no NPC belief, hypothesis, or hidden seed fact;
- does not block Send or rewrite the draft;
- is required for closure: if a renewed demand is sent without the notice having been shown, collection service does not close, and the missing notice is logged as a defect.

Test: LC-T69.

## Amendment 2 — Orrin’s motive in Seed B

Until the witnessed comparison exists, the office treats Orrin’s hauling claim as already paid. The comparison is the first office record stating that his claim is separate and outstanding. In the official Seed B fixture, his priorities are ordered: **recognition of the claim as real and outstanding**, then payment, then workable relations. He accepts release without payment because he trades his leverage for that recognition. He keeps the claim against Nera. Exact priority values stay tunable; this order does not.

Test: LC-T24 (updated).

## Also corrected in v2.1, not requiring approval

- The first example ending in §1.8 mixed the two seeds. It now shows a Seed A ending, and both endings are labeled.
- §2.5 now says plainly that a performed cue only one vibe produces is allowed, because the listener actually perceived it. Only information the listener could not perceive is forbidden. This clarifies ES-D03; it does not change it.

## What this record does not do

- It does not start development. Each kickoff brief runs only when Teddy sends it to an agent.
- It does not reopen any decision already marked DECIDED in the master.
- It does not approve features listed as DEFERRED in master Part 8.

## For builders and testers

Read this record together with Encounter_System_Master_v2.1.md. If the master’s front matter says version 2.0, you have the wrong file; stop and ask Teddy for v2.1. (Some explanatory sentences inside v2.1 still call these items “proposed” or “pending”; Part 0 of the master says to read those as DECIDED.) Field names and file layout remain builder choices, provided the approved behavior is unchanged. Any change to player-visible behavior goes back to Teddy for approval.
