# Encounter AR0 — Independent Atlas-readiness Review

Review date: 2026-10-18, America/New_York. Execution timestamps use UTC.

**AR0-D01 blocks Atlas v0.1 acceptance.** The catalog validator accepts a configuration that aliases two distinct canonical actors into one Person card. The real projection API then overwrites the absent owner's state with the witness's observations/beliefs and attributes the witness's report to the owner. This was reproduced through the documented CLI with an untouched fresh browser save and a separate caller-supplied catalog. The supplied Last Collection catalog does not trigger the defect; its normal outputs and preserved M3 gameplay passed the executed checks. No production source was modified or defect remediated.

## Exact frozen source used

The original source was located at:

`C:/Users/mcdon/Documents/ChatGPT/encounter and rc/outputs/Encounter_AR0_Atlas_Readiness_Checkpoint.zip`

Its independently computed SHA-256 is exactly:

`d028b50107d639ade1ab31a1a68f5e70eaf8ebdc3a401f0abac9b9c2caa51828`

| Identity | Independently verified value |
| --- | --- |
| ZIP bytes / members | 103,359,835 / 1,786 regular files |
| Source revision | AR0-projection-v1 |
| Source digest, 101 independently enumerated inputs | `4589645177076d67067270df6d6020618b8fb200236fef584807a1921d0768ca` |
| Catalog file SHA-256 | `21a0747936c3e8e7e9cf33833348ff6eb7b07a183179ce1e21181d618c854c5b` |
| Preserved M3 runnable build SHA-256 | `8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb` |
| Accepted M3 R3 ZIP SHA-256 | `615ddc79e0f7bd8d903411401360fc321b7b916abcc69dc974e9673fd0e74c87` |
| Sealed package | package_0003, revision 1 |
| Independently sealed package digest | `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f` |
| Content | M3-protective-shortcut-v1 |

The matching original local identity and verification JSON were read, fingerprinted and copied unchanged. START_HERE_AR0.md, AR0_Independent_Tester_Handoff.md and the complete governing Encounter_Atlas_Concept_and_Readiness_Pass_v0.1.md were read from the hash-verified archive. Their matching local files under outputs/Encounter_AR0 were separately compared byte for byte with the archive members. No similarly named work folder or loose working copy was substituted.

Read the complete preflight, implementation plan/report, test results and proof index. Inspected the entire new projection module and catalog, supplied AR0 assertions, validation/CLI/regression tools and source classification. The governing independent-tester procedure, especially §§18–20 and 25, controls this review. Embedded lead-builder/future Atlas implementation instructions were reference material, not authorization to implement those scopes.

Before behavioral execution, independently verified ZIP length/hash, external identity fields, every member size/SHA-256, CRC integrity, exact membership, duplicate/case-colliding names, safe paths and regular-file status. All passed. Independently enumerated all 101 source/content/test/tool inputs and recomputed the source digest; separately verified catalog/build identities and sealed package identity.

Fresh primary extraction:

`C:/Users/mcdon/Documents/ChatGPT/encounter and rc/work/ar0-independent-review/checkpoint`

The accepted original M3 R3 ZIP at its original output path was independently rehashed and every one of its 1,430 manifest-listed members compared against AR0. **All 1,430 remain byte-identical; no accepted baseline file is modified or removed.** Exactly two production additions exist: src/ar0/atlas.mjs and content/ar0/last-collection.json. Independent additions patch and classifications are retained. There is no Atlas UI, alternate mutable world, gameplay refactor, M4/Seed B, faction simulation or host geometry implementation.

Tools that regenerate evidence ran in a disposable clone with source bindings checked against this exact extraction. Primary adversarial tests and actual CLI reproductions imported the frozen extraction's modules directly. The normal and CSS-fault browser routes served the exact preserved executable build from that extraction. Final preservation rechecks the original ZIP/identity/verification, matching local documents, all 1,786 fresh extraction members, accepted R3 inputs and source bindings.

## Blocking AR0-D01 — conflicting canonical actor aliases corrupt Person provenance

Severity: blocking correctness/identity/provenance issue in the reusable AR0 catalog/projection seam. This is not a newly reproduced M3 display defect or a claim that the supplied default catalog already leaks hidden truth.

Relevant locations in src/ar0/atlas.mjs:

- Lines 26–46 validate source existence and uniqueness of each source binding, but allow multiple distinct canonical actor bindings to resolve to one Person card.
- Lines 64–65 map every source and alias to that same card ID.
- Lines 128–134 iterate canonical actors and assign the complete local state to the resolved card. The later actor overwrites the earlier actor's state.
- Line 140 constructs report links through the same alias resolver, allowing an incorrect Person card to become the reported speaker.

### Actual supported API/CLI reproduction

Start from evidence/ui-warned.json, newly generated during this review through visible New run, authority verification, physical investigation, Orrin's limited report, ordinary-payment refusal and the privacy warning. Its complete journal passes the real importRun replay validation. It is not a fabricated or edited run.

Create an alternate descriptive catalog from the supplied catalog with only these binding edits:

```javascript
catalog.entities = catalog.entities.filter(e => e.id !== 'actor_0004');
catalog.entities.find(e => e.id === 'actor_0003')
  .aliases.push({ kind: 'actor', id: 'actor_0004' });
```

The primary source, ID, canonical name and description of the Nera card remain unchanged. The package reference is unchanged. No canonical actor, observation, claim, belief, journal, world state or production file is edited. This is a conflicting catalog binding, passed through the same explicit alternate-catalog argument supported by atlas-export.mjs.

`validateCatalog` returns true. `projectAtlas` and both CLI audience exports complete normally. The emitted outputs are also accepted by validateProjection.

| Canonical Encounter fact / required provenance | Actual accepted projection |
| --- | --- |
| Nera: actor_0003, kind absent | Card ID actor_0003, display name Nera Vale, primary source actor_0003, but state.actorKind becomes npc |
| Nera received zero observations | Nera card contains observations whose observerId is actor_0004 |
| Orrin's beliefs belong to actor_0004 | Nera card contains beliefs whose holderId is actor_0004 |
| Witness report speaker is actor_0004 | Player link reported_about has fromRef actor_0003 |

The player Markdown explicitly renders:

```text
Nera Vale → reported_about → Referenced historical occurrence
```

Its provenance points to the real witness message_0006, whose canonical speaker is Orrin/actor_0004. The author Markdown places Orrin's local records beneath the Nera Vale heading, with primary source actor_0003. The underlying run remains unchanged and still records zero owner observations.

This is not an impossible browser geometry vector. It is a documented catalog/API input path using valid existing canonical references and a fully validated actual save. The exact CLI accepts the input and emits the incorrect result with exit 0. Catalog authors can make a conflicting binding without editing game source; the validator currently certifies it, and consumers cannot safely trust each Person card's canonical local-state anchor.

Descriptive prose is legitimately trusted authored metadata. This finding does not demand that the validator judge arbitrary prose for truth. The failure concerns structured canonical actor bindings and generated factual state/report provenance. A flat Person state anchored to absent actor_0003 must not silently become the state of a different NPC merely because both references resolve to the same card. A safe rejection of conflicting bindings would also satisfy the independent test. The legitimate existing Nera owner-topic subject alias remains covered by passing tests.

Requirement basis: governing §§7 and 10.7 distinguish author truth, actor-local knowledge and player-known information; §18 requires local observations, attributed reports, absent-owner and human asymmetry, valid identity/source relationships; §§19–20/25 require an independently sound projection and treat identity/knowledge-boundary errors as blocking. The AR0 handoff expressly requests adversarial catalog/source-binding and alias tests.

### Preserved evidence and minimal commands

- independent-ar0-alias.test.mjs: one independently failing test, IA0-22. Expected Nera's source-local kind absent; actual npc. It also retains the complete observed misattribution before asserting.
- evidence/AR0_D01_reproducer.json: actual outcomes, conflicting catalog, untouched fresh save and confirmation that the run is unchanged.
- evidence/alias-trust-catalog.json and alias-trust-probe.json: exact standalone input and measured API results.
- proofs/alias-reproducer-author and proofs/alias-reproducer-player: actual CLI JSON, Markdown and network exports.
- evidence/independent-alias-reproducer.stdout.txt and CLI logs: exact commands, exits and outputs.

From a fresh evidence-package extraction with the supplied AR0 ZIP extracted into checkpoint/:

```powershell
node --test --test-reporter=tap independent-ar0-alias.test.mjs
node checkpoint/scripts/atlas-export.mjs evidence/ui-warned.json proofs/reproduce-alias-player player evidence/alias-trust-catalog.json
node checkpoint/scripts/atlas-export.mjs evidence/ui-warned.json proofs/reproduce-alias-author author evidence/alias-trust-catalog.json
```

Expected current checkpoint: the requirement test fails once; both CLI commands exit 0 and reproduce the incorrect attribution. The probe can also be rerun with node probe-aliases.mjs. No production remediation was performed.

## Fresh test results

| Independently executed suite | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| M0 audit | 7 | 0 | 0 |
| Builder M1/M2/M3/R1/R2/R3 plus 47 AR0 tests | 184 | 0 | 0 |
| Retained independent M1 | 22 | 0 | 0 |
| Retained independent M2 | 18 | 0 | 0 |
| Prior independent M3 | 18 | 0 | 0 |
| Retained original D01 | 1 | 0 | 0 |
| Retained independent R1/D02 | 9 | 0 | 0 |
| Retained independent R2/D03 | 20 | 0 | 0 |
| Retained independent R3 | 24 | 1 accepted non-blocking IR3-25 | 0 |
| New independent AR0 baseline/adversarial suite | 21 | 0 | 0 |
| New independent conflicting-actor-alias requirement | 0 | 1 blocking AR0-D01 | 0 |

These are overlapping suites, not a claim of that many unique semantic guarantees. The 21-case new suite includes 20 behavioral/adversarial checks and one intermediate-evidence export check. Repeated projections, vector loops, saves, retries, CLI reproductions and policy captures are not counted as extra tests.

The 21 passing cases use this reviewer's own action sequences and import actual frozen modules directly, without builder fixture helpers. They test duplicate/case-colliding IDs and bindings, missing references/endpoints/scenarios, explicit kinds, package binding, one shared Person across scenarios, global unindexed entities, neutral Group support, full semantic/canonical ID and label renaming, concealed truth/name sentinels, canonical alias/historical-prose redaction, actor-local observations/beliefs, absent owner/human asymmetry, attributed reports and opaque citations, ownership/custody/action/confirmation separation, save/load/purity, every exact command retry, rejected commands/no UI events, meaningful causes/order, repeated run labels, every revision cursor and the one link set used by article/network output. The additional alias probe extends that coverage to conflicting canonical actors rather than accepting the supplied duplicate-binding tests as complete.

The supplied AR0 tests reject duplicate uses of one canonical source across separate cards, but do not reject distinct canonical actors resolving into the same card. That explains their all-green result alongside AR0-D01. The failure does not depend on names: the resolver/state assignment is generic; the actual named fixture makes the violated absent-owner invariant easy to inspect.

## Preserved IR3-25 limitation

The retained independent R3 source was byte-compared with the accepted original reviewer source. Its assertion remains unchanged, unskipped and failing: 24 pass, one contradictory synthetic-geometry failure, zero skips. The regression helper requires exactly that failure and no additional failures. Only its evidence output directory is redirected in memory; no behavioral expectation is changed. Other inherited adapters retain their previously disclosed identity/output or viewport-fixture bindings.

No new realistic production/browser path for the contradictory geometry was demonstrated. Its accepted non-blocking classification remains unchanged. AR0-D01 is separate: a real documented catalog input accepted by the production projection and CLI.

## Fresh browser and projection evidence

Fresh visible controls, without loading builder-finished captures, exercised:

- New run, ticket verification, protected Compassionate/Overt first paperwork request and distinct Intake/Delivery.
- Permission-only and partial-evidence states, actual extract inspection/tray search, Tamsin's separate later evasive reply and Orrin's limited report.
- Ordinary payment refusal without charge/debt/bribery fabrication, owner inquiry, later broad demand, restriction and public visit-long warning.
- Why, End/reopen, partner changes and vague apology without consuming repair; substantive case-only acceptance repairs once while retaining warning/authority and performing no comparison. A new run and exact repaired-save reload preserve state.
- Actual comparison/pending terms, conversational acknowledgment without transfer, separate exact confirmation and zero-payment recovery. Custody changes once to the player; Nera remains owner; balance remains 1200 minor units. Recovery first completes with record correction false. Correction is then separately committed, retaining the original history.
- Post-recovery protected demand leaves the entire recovered world unchanged. Inspector and response replay/skip are pure. Closed-state reload and an incompatible legacy-import rejection preserve the complete saved state.
- Visible current warned notice followed by deliberate Send closes service once. Collapse, display-none/missing notice, own opacity zero, ancestor opacity zero and horizontal/vertical offscreen faults each earn no receipt, keep service open, commit zero close results and record exactly one MISSING_CLOSURE_PREVIEW, without extra punishment.
- A truthful receipt first earned while genuinely visible survives subsequent PageUp without draft edits. The notice moves from top 456.2000/bottom 543.8500 to top 1124.2001/bottom 1211.8501 in a 920 × 764 viewport. Deliberate Enter still closes once with no defect.

All **23 actual UI exports** were independently replay-validated. Every journal command was retried against its saved run and reused the result without additional effects. **Eleven actual raw inspector exports** match reconstructed traces. Other matching traces are generated from their validated saves and are labeled accordingly.

From those exact UI saves, generated **46 fresh author/player projections**, each with JSON, Markdown and network data. Repeated generation across full validated save/load is identical and leaves complete run/package/catalog input unchanged. All link endpoints and card link references agree; Markdown and network consume the exact normalized link set. Canonical catalog context digest and package references were independently checked. The actual CLI's normal recovery outputs match the independently generated API JSON/Markdown/network byte for byte.

For the shipped catalog, no protected contact value, concealed initial destination/purpose, private NPC belief/hypothesis or another NPC's private observation was found in the tested player outputs. Initial, warned, pending, recovery and post-recovery audiences were compared; metadata alias/historical-name sentinel tests also passed. This positive result is bounded to the supplied catalog and the passing neutral fixtures; it does not negate the separate conflicting-binding defect.

Separate external runtime instrumentation recorded **75 actual policy calls across ten fresh UI journals**. Captured filtered inputs, candidates, selected results and notice options all agree with reconstructed decisionInput. The wrapper records arguments/results in memory and changes no policy algorithm or checkpoint file. Atlas event cards and recent changes were separately checked against actual committed command/result causes and revision order.

## Scope, environment and limits

Windows 11 build 26200; PowerShell 7.6.5; Node v24.18.0; Python 3.12.0; actual desktop in-app browser. Exact browser-engine version and cross-browser certification are unclaimed. No dependency installation, runtime AI or external assets were required. The read-only server used 127.0.0.1:60813, served exact executable bytes with separate CSS-only fault injection, and was stopped; the review-created tab was closed.

Accepted M3 source/content/build/tests remain unchanged. The full source identity and independently generated additions patch show only the two AR0 production additions. There is no competing mutable Atlas world or write command, new gameplay, Atlas UI, Atlas v0.1, M4, Seed B, full Assembler, NPC initiation, faction simulation or host geometry/navigation implementation. Places remain semantic; Last Collection Groups remain empty while neutral tests demonstrate support.

Non-blocking limits: trusted descriptive prose cannot itself certify story truth; this remains a bounded per-run read-only adapter and proof exporter, not cross-project merging or polished article/network UI. Manual bounded debug saves contain author truth. Other browsers/mobile, pixel-level occlusion/overlay/transform/filter analysis and accessibility certification were not attempted. The previously accepted synthetic geometry limitation remains preserved.

## Evidence and stop point

AR0_Independent_Test_Evidence.zip contains this report, independent tests/probes, the minimal failing input/reproducer, fresh command/test logs, identity/member/source checks, matching-local-document fingerprints, full additions patch, actual UI saves/inspectors/transcripts/screenshots, fresh proof exports, CLI reproductions, policy captures and final preservation checks. The exact supplied ZIP/identity/verification remain identified input under reviewed-checkpoint/. EVIDENCE_MANIFEST.json records every listed evidence member's size/SHA-256. Exact tool/shell/browser commands and available outputs are exported from this AR0 task; child logs retain argv, roots, bindings and exits.

Normal proof data is not presented as Atlas UI. A copy of the faulty player Markdown is supplied separately for quick inspection, together with the actual API diagnostic. To rerun the passing independent suite use node --test independent-ar0.test.mjs; use independent-ar0-alias.test.mjs for the preserved blocking requirement failure. Node export-evidence.mjs regenerates default-catalog browser/projection evidence; node audit-causal.mjs repeats the policy capture. Do not overwrite existing extracted artifacts.

Atlas v0.1 should not begin under this checkpoint's current reusable catalog-validation contract. AR0-D01 is the sole new blocker identified in the executed review. No production remediation or next-scope implementation was begun.

**NOT READY FOR ATLAS v0.1**
