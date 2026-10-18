# AR0-D01 remediation report

**READY FOR INDEPENDENT AR0 R1 REVIEW**

The complete independent report and preserved evidence were read before production edits. All 521 evidence-manifest entries were verified against bytes and SHA-256; the independent evidence ZIP is `88a8484fff91c7464e4a69362d5b794bd9ad8a14485f2f71c91a4042118f61e7`. The frozen original AR0 ZIP remains `d028b50107d639ade1ab31a1a68f5e70eaf8ebdc3a401f0abac9b9c2caa51828`; a separate exact extraction was used for remediation. Accepted M3 R3 remains `615ddc79e0f7bd8d903411401360fc321b7b916abcc69dc974e9673fd0e74c87`.

## Defect and correction

The original validator guaranteed uniqueness of each source token, but allowed multiple distinct canonical actor tokens within one Person card. The registry resolved both to that card; actor iteration overwrote its local state and report links used the merged identity. The original independent IA0-22 assertion fails against frozen AR0, and both actual alternate-catalog CLI exports exit 0 with wrong attribution. These before outputs and diagnostics are preserved under evidence/ar0-r1/before-*.

Only src/ar0/atlas.mjs changes in production. Validation now rejects a second distinct actor binding within any Person, including actor aliases on a non-actor primary source. Existing global source uniqueness rejects one actor on multiple cards. Every canonical package actor must have exactly one Person binding. Non-actor aliases, descriptive Persons without actors, multiple references and memberships for the same person remain supported. Nera's existing owner-topic subject alias and the authored Last Collection catalog are unchanged.

The registry independently computes each card's set of canonical actor bindings. Every projected actor reference asserts that the card binds exactly that actor and, when visible, is a Person. This protects both local-state installation and actor-derived links, including report speakers, without altering projection schema or normal output. No story names, IDs, messages or tester-fixture branches enter production policy. No M3 engine/policy/UI changes occur.

The exact conflicting input now fails catalog validation, author/player projection and both CLI exports with CONFLICTING_ACTOR_CARD_BINDING before output files exist. The original independent assertion passes unchanged. The original UI save remains unchanged. Normal owner state is absent with zero observations/beliefs; witness local records and player report attribution remain actor_0004. See after-d01-diagnostic.json and fresh-conflicting-cli-*.json.

## Preservation and verification

Of all 1,786 original AR0 members, only src/ar0/atlas.mjs differs; the other 1,785 remain byte-identical. All 1,430 accepted M3 R3 members, including tests/tooling/content/runnable HTML, remain byte-identical. The production diff, source identity and preservation.json enumerate the exact scope. New tests, bound independent-review inputs, R1-only tooling, proof exports, documentation and evidence are additions. Original checkpoint ZIP/identity/verification and delivered original tree are preserved.

Source revision: `AR0-projection-v1-R1-D01`. Source SHA-256: `8dd542efed9f74573bcb1913d367f7c791d63c3830d65b7f35f68abdcb92f09c` (112 enumerated inputs).

Preserved M3 runnable build SHA-256: `8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb`. Catalog SHA-256: `21a0747936c3e8e7e9cf33833348ff6eb7b07a183179ce1e21181d618c854c5b`. Sealed content remains package_0003 revision 1, digest `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f`.

Ten focused builder tests cover all canonical actor-pair conflicts in both catalog orders, alias/primary conflicts, missing and duplicate actor cards, the exact independent input, owner-local records, report attribution, valid non-actor aliases, shared memberships, non-actor primary with a valid single actor alias, and the extracted actual defensive production resolver. Full inherited and AR0 suites pass subject to the accepted unchanged IR3-25 failure; no tests are skipped or weakened.

The 18 original supplied UI saves produce 36 regenerated author/player projections. All JSON, Markdown and network exports are byte-identical to original AR0 (108 files). Fresh browser checks independently cover the protected paperwork request, actual evidence/actions and Orrin report, warning/money preservation, meaningful repair through clarification/End/partner changes, exact repaired save/load, comparison versus permission, conversational Yes versus exact confirmation, single zero-payment custody change with owner retained, post-recovery protection, pure replay, visible warned closure, and collapsed-notice refusal with service open, zero close results and one MISSING_CLOSURE_PREVIEW. Three actual raw inspectors match reconstructed traces. Fresh proof exports use validated current UI saves and the corrected module.

## Limits and stop point

IR3-25 remains byte-identical SHA-256 `52386d28e3e7388b643b3cc0fd446c1b9386ab4702d960f062042ba0c5070f75`: 24 independent R3 passes, that one accepted non-blocking contradictory synthetic-geometry failure, zero skips. No new rendering scope is implemented. Trusted descriptive prose, bounded per-run projection, manual author-debug saves and lack of cross-browser/accessibility certification remain as previously documented. Fresh screenshots show preserved M3 behavior, not an Atlas UI or a visual proof of the catalog defect.

No Atlas v0.1/UI, M4, Seed B, host-world system, new story material or unrelated refactor was begun. Independent acceptance is still required.
