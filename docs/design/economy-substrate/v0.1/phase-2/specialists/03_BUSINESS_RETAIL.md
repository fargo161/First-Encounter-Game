# Business / Retail Operations specialist findings

**Version:** v0.1 / Phase 2  
**Date:** 2026-10-23, America/New_York  
**Status:** PROPOSED SPECIALIST FINDINGS / NOT ACCEPTED ECONOMY DESIGN  
**Role:** Runbook Agent 3 — Business / Retail Operations

## Remit and authority

This report investigates reusable businesses, physical retail, policies, work/social opportunities, schedules and ownership interests. These are specialist proposals, not synthesis, an executable model or an audit verdict. Candidate labels are document navigation only.

The current owner accepted Phase 1 and authorized Phase 2. KeyWrapping v0.1's bounded architectural baseline, semantic separations and invariants are **OWNER-ACCEPTED**. Runtime is absent/unaccepted; the shared Encounter integration contract is unaccepted; representations are unfrozen; merging remains unauthorized. Historical proposed-status headings do not reverse that instruction. No separate acceptance record is required. Publication visibility remains a nonblocking Steward issue.

## Repository authority and provenance

Repository evidence is pinned by the Phase 1 snapshot, HEAD `22c06dc179e3a0739a5ce1e747d0a46dc114fab5`; current owner instructions govern subsequent authority. Phase 1 is local documentary evidence, outside that commit.

| Repository source and inspected section | Constraint carried into this report |
| --- | --- |
| [Shared-contract decision](../../../../../../contracts/SHARED_CONTRACT_DECISION.md), “Accepted now,” items 1–8; [inventory](../../../../../../contracts/SHARED_CONTRACT_INVENTORY.md), E4–E7; [boundary matrix](../../../../../../contracts/BOUNDARY_MATRIX.md), actor, projection and consequence rows | Encounter owns identity, permission/knowledge distinctions and validated consequences. Native owner/holder distinctions survive. Atlas, RC and ZANT references grant no gameplay authority. |
| [C1 acceptance](../../../../../../packages/encounter-core-c1/provenance/0.1.3/EA_C1_0_1_3_OWNER_ACCEPTANCE_RECORD.md), “Accepted scope” and “Accepted limitations”; [C1 README](../../../../../../packages/encounter-core-c1/README.md), “Scope and qualifications” | Bounded non-social proof; finite history/support and N01/N02 remain. No business or employment engine is inferred. |
| [KeyWrapping specification](../../../../keywrapping-substrate/v0.1/SUBSTRATE_SPEC.md), KW-02/03/06/10/13/15; [transactions](../../../../keywrapping-substrate/v0.1/TRANSACTIONS_COMMITMENTS.md), §§5–6, C11/C12 | References, knowledge, agreement, performance and authority differ. Delegation is scoped; later change preserves earlier effects. Read under corrected owner acceptance. |
| Phase 1 [authority](../../phase-1/AUTHORITY_AND_PREFLIGHT_UPDATE.md), [scope](../../phase-1/SCOPE_AND_BOUNDARY_MAP.md), [terminology](../../phase-1/TERMINOLOGY_MAP.md), [assignments](../../phase-1/RESEARCH_ASSIGNMENTS.md), [conflicts](../../phase-1/CONFLICT_REGISTER.md) | Authority/boundary framing accepted by the owner; research assignments and open questions remain distinguishable from accepted Economy design. |

[Compatibility examples](../../../../../../contracts/COMPATIBILITY_EXAMPLES.md), [development rules](../../../../../../DEVELOPMENT.md), [source authority](../../../../../provenance/source-authority.json) and [next-stage gate](../../../../../consolidation/NEXT_STAGE_GATE.md) were also consulted. No frozen package, subsystem record or prior status is changed.

## Owner-established design direction

The supplied **Encounter / Trapstar — Economy Structure Context**, Context v0.1, 2026-10-22, §§6–14, 45–50 and 51.8, calls for reusable businesses, physical shelf-to-payment flow, ordinary jobs, investments and venues creating social opportunity. The **Economy Substrate v0.1 Codex Agent-Team Runbook**, v0.1, 2026-10-22, §§6–9, 18, 27/Agent 3 and 35, defines this bounded assignment. File identities/hashes are preserved in Phase 1's authority note. Their Downloads paths are provenance, not runtime dependencies.

These establish direction, not frozen mechanisms: a warehouse is generally restricted; a bar connects spending and meetings; a job supplies occasions to learn. Employment must not instantly disclose every routine. Ordinary and shadow activity should reuse stock, custody, payment, premises, staffing and record concerns.

## External research evidence

All sources were inspected on **2026-10-23**. B-01–03 are living, unversioned pages with no displayed publication/revision date. B-04 was read through the indexed official article body after direct retrieval returned HTTP 403; no immutable capture is claimed. Adaptations are specialist inferences.

| ID / exact title, organization, date/version, direct source | Inspected claim | Applicability and limit |
| --- | --- | --- |
| B-01 — [Locations](https://help.shopify.com/en/manual/inventory-and-locations/locations), Shopify Help Center; undated/live | Locations include retail premises and warehouses; inventory is tracked separately at physical locations. | Useful analogy for common operational concerns across different premises. Shopify also recognizes virtual/app locations; its location abstraction is not Encounter spatial identity or a physical simulation. |
| B-02 — [Point of Sale permissions](https://help.shopify.com/en/manual/your-account/users/roles/permissions/pos-permissions), Shopify Help Center; undated/live | Sales, refunds, transfers, analytics and cash tracking have distinct permissions; some actions require manager approval. Action logs are separately described. | Useful analogy for limited employee authority rather than all-powerful employment. Product access controls are not game law, human knowledge or proof that a permitted action occurred. Its full permission catalog is excessive here. |
| B-03 — [Plan your business](https://www.sba.gov/counseling/plan-your-business/), U.S. Small Business Administration; undated/live; “Calculate your startup costs” | Expenses vary by business; salaries, rent and utilities recur; break-even compares costs and revenue. | Useful analogy for a few recurring pressures and separating revenue from profitability. Its financing, tax and detailed planning machinery is not adopted; this supplies no game balance or jurisdiction. |
| B-04 — [Dev Blog 10/05/18](https://www.taleworlds.com/en/Games/Bannerlord/Blog/59), TaleWorlds Entertainment; 2018-05-10, pre-release design | Productive enterprises connect physical town premises, material inputs and products; supply/demand can affect profitability. | Original developer analogy for businesses as places and economic opportunities. It does not prove current Bannerlord behavior, bounded-cost simulation or suitability of its market model here. |

## Proposed minimum candidate concerns

These are local alternatives for later review, not a selected global primitive set, schema, API or new authority layer.

| Candidate | Proposed semantics and common reuse | Architecture versus content |
| --- | --- | --- |
| B-C01 — Configurable business operation | Relate offerings, premises, stock/cash and responsible actors. Restaurants, service desks, clubs, warehouses and concealed operations reuse concerns with different activities. A business label establishes neither personhood nor group authority. B-01/B-04 are analogies. | Candidate specialization; category, product mix, fixtures and theme remain content. |
| B-C02 — Scoped commercial performance | Retail specializes existing exchange distinctions: taking custody, presenting goods, paying and authorized transfer are separate effects. Services/admission exchange performance or access rather than automatically transferring an item. Ordinary sales and resale reuse this concern; legality is separate. | Candidate economic application of accepted distinctions. Prices, payment methods and exact transfer conditions remain open/content. |
| B-C03 — Operating availability and work | Opening, serving, receiving deliveries and closing may have different staffing/access conditions. A scoped work task creates an opportunity to perform and earn, not automatic wage payment or knowledge. Ordinary stock work and concealed goods handling reuse task/custody concerns. | Candidate operational concern; task lists, cadence and NPC behavior remain content. No parallel clock. |
| B-C04 — Local service/access policy | A properly authorized actor may establish bounded entry, service, refund or ban policy. Rule, communication, recognition, willingness and physical execution remain distinct. A restricted warehouse and private meeting use the same scope discipline. B-02 is analogy. | Candidate specialization constrained by KeyWrapping; authority source/conflict resolution needs Governance. Dress codes and response preferences are content. |
| B-C05 — Economic interest and distribution basis | Distinguish an economic share, any separately granted management authority, distributable amount and actual payout. Sales revenue, profit, physical cash and bank funds differ. Legitimate and concealed interests need the same separations. B-03 is analogy. | Candidate economic concern; profit policy, reserves and payout cadence remain unresolved. No corporate-law simulator. |

## Worked documentary cases and failures

1. **Shelf purchase:** Taking a phone changes custody; it does not establish payment or title. Checkout needs qualifying money and transfer effects under selected terms. Shelf movement must not subtract business-owned stock again when payment occurs. A commercial receipt is a fallible record, not payment itself. Declined payment, abandoned goods and goods returned to the shelf preserve the actual partial sequence.
2. **Store exit and ban:** Leaving unpaid creates an economic occurrence requiring its actual context. Laws classifies any violation; witnesses acquire only what they perceive. An authorized ban is local policy. A new clerk need not recognize the Player or know the ban. Police response and transmitted reputation require their own causes. A ban does not physically teleport the Player outside.
3. **Closing shift:** A worker stocks shelves, handles a till and receives a limited closing task. Custody of cash is not ownership or permission to keep it. The worker can learn a closing routine through actual access/observation; employment alone grants no schedule database. Missing staff may interrupt service without making the whole business nonexistent. Wages owed and wages paid remain separate.
4. **Club and service desk:** Admission, a drink purchase and a private introduction are distinct performances. Paying cover does not promise an introduction or purchase social assent. A garage accepting a repair payment does not establish completed repair. Partial delivery preserves payment and outstanding performance; refunds require new effects.
5. **Investor and busy evening:** A Player's minority interest does not authorize withdrawing the till, directing all workers or acquiring faction membership. Aggregate evening sales may change coarse stock/revenue; a later dispute cannot invent named customers or exact receipts. An explicit sale must not also remain counted in the background total. Recorded profit does not prove sufficient available payout funds.

These are reasoning cases, not executed simulation or independent verification.

## Conflicts and unresolved decisions

| Phase 1 key | Concrete dependency and routing |
| --- | --- |
| P1-03 / P1-12 | Work, service delivery, refunds and investor payouts need exact performance/credit scope. **PROMOTE / RECONCILE / SHARED CONTRACT REQUIRED** for general duty or allocation semantics; no universal lifecycle chosen. |
| P1-04 / P1-09 | Custody-before-payment, bans and restricted premises need property/authority and normative classification. Preserve economic occurrences; Laws/Governance decides general entitlement and violation rules. |
| P1-05 / P1-08 | Closing reports, receipts and job access are fallible descriptions or acquisition opportunities. Traceability/Information review must preserve actual-history versus discoverability separation. |
| P1-06 / P1-07 | Busy evenings and later disputes require bounded aggregate continuity. Logistics/Time/Traceability specialists must identify retained facts without invented detail or unlimited history. |
| P1-11 | Shareholding, hiring power, access delegation and faction status cannot substitute for one another. Governance/owner must specify the intended grants. |
| P1-14 | Shared business concerns appear sufficient for these cases; resale capacity, infinite payouts and concealed revenue remain exploit questions, not solved claims. |

Owner questions: How much work is played versus summarized? Which management powers, if any, accompany an investment? When does commercial ownership transfer during partial payment or service failure? Who can issue, communicate and revoke a ban? Which business interruptions should create meaningful choices rather than chores?

## Deferred content and evidence limits

Exact hours, staffing counts, prices, wages, margins, payout percentages, dress thresholds, service durations, ban responses and neighborhood demand remain content or owner policy. Combat resolves violence; Laws resolves normative classification; Information handles detection/investigation; Factions owns its own membership/authority. No subsystem implementation is proposed here.

Three operations sources and one historical developer source support analogies, not gameplay validation. No playtest, benchmark, balancing or accepted integration was produced. Phase 3 synthesis and runtime work require later authorization.
