# Specialist F — read-only asset-facing context

Reviewed by the lead as a separate specialist role. October 18, 2026. No surrounding project files changed.

Evidence root: `work/ZANT_analysis_sources/context/04_READ_ONLY_PROJECT_CONTEXT/` (byte-preserving copies of Part 1).

## Findings and limits

| Evidence | What it actually establishes | Asset-facing consequence |
|---|---|---|
| `Encounter/Encounter_System_Master_v2.1_READ_ONLY.txt`, lines 118–120, 353–355 | Body and face form one coherent performance; a phase can be one performance or a short sequence; final posture may persist; playback never changes committed facts | Author complete recipes that can be held indefinitely. A future sequence may reference recipes in order. Keep asset IDs independent of response policy and transaction semantics. |
| Same master, line 645 (PD-10) | Short ordered complete body-and-face units for Intake, Delivery, held posture | Provide compatible body/head/face selections and named presentation recipes. No mapping between semantic labels and required facial/body art. No changes to Encounter fields are proposed. |
| `Room_Creator/Trapstar_Routing_Player_Movement_NPC_Lanes_Context_READ_ONLY.md`, §§12–17, lines 436–579 | Older runtime economy uses front/3/4/back, stable view selection, controlled billboard bias, different detail budgets | Expose explicit view IDs, root/frame metadata, mirror safety, and availability. Let a future consumer choose a subset; do not implement facing thresholds, routes, billboarding, or tier selection here. |
| Same document, §§18–19, lines 585–623 | Independent head orientation has value; body view should remain stable | Author a finite table of approved body-view/head-view pairs. Independent head direction is bounded by neck/hair/garment compatibility, not arbitrary image rotation. |
| Same document, §§20–23, lines 625–717 | Conservative leg motion, stable feet, occasional upper-body flourishes | Prove still poses first, including a held pose with coherent face and stable root. A weight-shift leg state is a useful minimal test; gait generation is not required. |
| Same document, lines 1314–1324 | Snapping, rough presentation and abrupt readable pose changes can fit the intended language | Do not make smooth interpolated animation a prerequisite for the asset standard. Rough presentation does not excuse visible anatomical seams at encounter scale. |
| `Room_Creator/ROOM_CREATOR_CHARACTER_CONTEXT_ONLY.md`, current-goal override | Four canonical authoring views are explicitly required now | Current front/3/4/side/back authoring supersedes older runtime-only side omissions. |

The implementation checkpoint ZIP mentioned in the Encounter context note is not included among these attachments. It was not needed or requested: the supplied current master and scoped context establish every constraint used here. No claim is made about exact executable integration. The Room Creator HTML snapshot is preserved and readable; no execution or UI edits were needed for these asset-facing conclusions.

The recommendation must remain a portable asset-authoring contract. It must not define Encounter response choice, gameplay meaning, BASED/DPA/ATOMIC mappings, Room Creator camera thresholds, route logic, NPC-lane selection, or environmental redesign. A recipe records visible selections and compatibility only. A future consumer owns when to show that recipe.
