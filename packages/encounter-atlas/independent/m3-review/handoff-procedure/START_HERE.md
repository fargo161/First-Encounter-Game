# Encounter System — Independent M3 Tester Handoff

## Purpose

This package is for **independent review of M3 only**. The lead builder has stopped at:

**READY FOR INDEPENDENT M3 REVIEW**

That is a builder-readiness claim, not independent sign-off. Do not begin M4 and do not modify the frozen M3 checkpoint while reviewing it.

## Exact artifact under review

- Archive: `inputs/Encounter_M3_Checkpoint.zip`
- SHA-256: `de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64`
- Bytes: `7,534,657`
- Members: `189`
- Source revision: `M3-runtime-v1`
- Source digest: `716a11c4efe9462e8ad60f16d6615ed8537811cf779d10dee424ef92558e3a94`
- Content revision: `M3-protective-shortcut-v1`
- Package: `package_0003`, revision `1`
- Package digest: `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f`
- Browser build SHA-256: `4fa1f60a1ec6a561375bdc38799693943b0910886d2f7ea838099d9303469e58`
- Preserved M2 baseline SHA-256: `940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7`

The external identity file is `inputs/Encounter_M3_Checkpoint.identity.json`. Verify the archive against it before trusting any report inside the checkpoint.

## Governing material

The checkpoint itself contains the governing source set under `reference/`, including:

- `reference/Encounter_System_Master_v2.1.md`
- `reference/Encounter_Approval_Record_2026-10-17.md`
- `reference/M3_Owner_Approval_2026-10-17.md`
- `reference/M3_Handoff/Encounter_M3_Codex_Implementation_Prompt.md`
- the M1/M2 contract and prior independent review material

The builder reports copied into `inputs/` are **claims to audit**, not authority and not independent evidence.

## First action

Give Codex the exact contents of `Encounter_M3_Independent_Tester_Prompt.md`.

The reviewer should work in a fresh extraction/review workspace, leave the supplied ZIP and identity unchanged, create independent tests/evidence outside the frozen checkpoint, and stop after an M3 verdict.

## Required final verdict

The independent reviewer must end with exactly one of:

**READY FOR NEXT SCOPE**

or

**NOT READY FOR NEXT SCOPE**

The verdict must identify the exact checkpoint hash tested and must not authorize or begin M4.
