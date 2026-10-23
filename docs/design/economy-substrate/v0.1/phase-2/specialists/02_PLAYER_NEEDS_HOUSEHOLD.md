# Player needs and household economy — specialist findings

**Version:** v0.1 / Phase 2 / role 2  
**Date:** 2026-10-23, America/New_York  
**Status:** PROPOSED SPECIALIST RESEARCH/DESIGN; OWNER REVIEW PENDING  
**Source baseline:** repository HEAD `22c06dc179e3a0739a5ce1e747d0a46dc114fab5`, accepted Phase 1, current Phase 2 owner authorization. Local navigation IDs below are not runtime identifiers.

## Remit and status

Investigate material pressure, household access and recovery without survival chores or medical detail. Findings are documentary proposals for later reconciliation, not Phase 3 synthesis, an accepted Economy design, executed simulation, or independent audit. Only this report is authored by this specialist; no package, Core, KeyWrapping, Laws, Combat or Information implementation changes are proposed as authorized work.

## 1. Repository authority

The [Phase 1 authority correction](../../phase-1/AUTHORITY_AND_PREFLIGHT_UPDATE.md), “Current owner authority,” governs older KeyWrapping headings: its bounded architectural baseline and semantic invariants are **OWNER-ACCEPTED**. Runtime is absent/unaccepted; shared Encounter integration is unaccepted; JSON, fields, schemas and APIs remain unfrozen. No further acceptance record is prerequisite.

The [Stage 12 boundary matrix](../../../../../../contracts/BOUNDARY_MATRIX.md), actor, interaction and presentation rows, reserves gameplay identity/state/consequences to Encounter. An authored bed or clothing image cannot establish permission, recovery or attractiveness. The [C1 README](../../../../../../packages/encounter-core-c1/README.md), “Scope and qualifications,” limits EA-C1/0.1.3 to its bounded non-social proof and finite support; this report does not infer an installed needs/social engine.

[KeyWrapping invariants](../../../../keywrapping-substrate/v0.1/SUBSTRATE_SPEC.md), section 2, especially KW-02/03/06/08/10/13/15, separate occurrence, acquisition, claims, references and performance. [Transactions](../../../../keywrapping-substrate/v0.1/TRANSACTIONS_COMMITMENTS.md), C02/C08/C09/C11, constrain disclosed rent terms, due conditions, actual payment credit and scoped authority. Open deadlines/remedies remain open.

The accepted Phase 1 [scope](../../phase-1/SCOPE_AND_BOUNDARY_MAP.md), [terminology](../../phase-1/TERMINOLOGY_MAP.md), role-2 [assignment](../../phase-1/RESEARCH_ASSIGNMENTS.md) and [conflict register](../../phase-1/CONFLICT_REGISTER.md) supply the immediate boundaries. Their historical “queued” status is superseded by current Phase 2 authorization, not by this specialist.

## 2. Owner-established design direction

The [Economy Context](</C:/Users/mcdon/Downloads/Encounter_Trapstar_Economy_Structure_Context_v0_1.md>), sections 4–5, 23–24, 49, 53–54, and [runbook](</C:/Users/mcdon/Downloads/Economy_Substrate_v0_1_Codex_Agent_Team_Runbook.md>), sections 5, 15 and Agent 2, establish direction rather than accepted Economy architecture:

- Health is overall condition. Sustained hunger/sleep neglect harms it; hygiene has a smaller health/recovery effect and larger contextual social effect. No organs, calories or pharmacology.
- Sleep quality stays restful/poor; food stays good/cheap/spoiled; clothing stays tattered/cheap/proper/fashionable. Exact rates/effects are undecided.
- Minimum clothes/hygiene standards constrain richer engagement above roughly mid-working-class status, while basic transactions, emergencies, instructions and refusals remain possible. This is not universal Charisma.
- Medicine addresses conditions; it need not be instant healing. Substances temporarily borrow capability against later recovery/dependence pressure; these are abstract authored effects, not real medical claims.
- Phones and optional weapons are capabilities. Housing supplies sleep, hygiene, storage, security, hosting and charging convenience for recurring costs. Possession does not imply public knowledge.

## 3. External evidence and provenance

All three sources were inspected **2026-10-23**. They are primary developer/publisher material. No external mechanic becomes repository authority.

| ID | Source / organization / date or version / direct URL | Inspected evidence and classification | Applicability and limits |
| --- | --- | --- | --- |
| N-01 | *The Sims 4 Skills: Natural Living*, EA Help; live article, exact revision date/version unstated; page displays “Updated 6 months ago.” [Source](https://help.ea.com/en/articles/the-sims/the-sims-4/natural-living-skill/) | “Natural Living activities” and “skill rewards”: several needs have alternative fulfillment routes; initial outdoor fulfillment can be slower. **ANALOGY.** | Supports investigating fallback access distinct from premium convenience. The skill tree, magic, outdoor safety and real survival practices are not donors. No Trapstar route or recovery rate is proved. |
| N-02 | *How to create Residential Rentals in The Sims 4 For Rent*, EA Help; live article, exact revision/version unstated; displays “Updated 6 months ago.” [Source](https://help.ea.com/en/articles/the-sims/the-sims-4/for-rent-residential-rentals-guide/) | “Tenant Agreement,” “Unit Rating,” maintenance: lease terms, facilities and condition are distinguishable; maintenance events can be disabled. **ANALOGY / CAUTION.** | Useful separation of service quality and recurring expense. Reject automatic occupancy-to-ownership conversion, donor weekly cadence, fines, ratings and eviction rules as Trapstar defaults. |
| N-03 | Lucas Pope, *Papers, Please: TIGSource — April 2013*, author-hosted development-log archive; posts #342 (2013-04-14), #424 (2013-04-24), beta-era. [Source](https://dukope.com/devlogs/papers-please/tig-05/) | Author acknowledged the reported penalty exploit, fixed clickable Rent/Penalties in beta 0.5.7, and added a first-night feeding explanation. **CAUTION.** Only author statements are used as primary evidence; quoted player feedback is not independently validated. | Maintenance must be understandable; nominal charges do not ensure meaningful pressure. Historical fixes do not prove final balance or justify Trapstar punishment/death policy. |

Inference from these donors: access alternatives, readable costs and bounded maintenance attention deserve evaluation. None establishes enjoyable timing, class policy or health effects for this project.

## 4. Candidate primitives — all PROPOSED

These are local discussion concepts, not a selected global family, data structures or new authority owners.

| Local ID / concept | Minimal semantics and reuse rationale |
| --- | --- |
| N-C01 Maintenance pressure | A named unmet material concern can constrain available activity and make later recovery costlier under authored rules. Health/Sleep/Hunger/Hygiene are content specializations; Encounter retains actual consequences. Do not create separate economy health truth. |
| N-C02 Satisfaction opportunity | Food, a bed, washing, medicine or a service can meet specified concerns given actual access, time and resources. Reuse ordinary goods/services and consumption; buying, possessing and successfully using remain different. Quality categories are content, not an engine per need. |
| N-C03 Presentation requirement | A person/venue's relevant clothes/hygiene requirement constrains an engagement scope, with the owner's basic/emergency exceptions. Reuse scoped access and social evaluation; do not invent a universal worth/status score or hidden-health oracle. |
| N-C04 Housing service bundle | A place offers separately available rest, washing, charging, storage and hosting qualities. Rent buys defined access, not automatic ownership of premises/contents. Reuse location/access/services; housing tiers are content. |
| N-C05 Recurring household charge | Rent, utilities and upkeep specify a basis, period, due point and payee; actual payment is separate from assertion and credit. Reuse obligation/payment distinctions; arrears, notice and eviction require owner/Laws reconciliation. |
| N-C06 Coarse condition and maintenance | Relevant clothing/equipment/facilities can deteriorate and be restored at material/time cost. Apply only where condition changes choices; no blanket daily repair task for every object. Reuse repair/service and inventory concerns. |
| N-C07 Deferred recovery burden | An explicitly authored temporary benefit can leave later impairment/recovery or dependence pressure. Reuse condition/time concerns for abstract substances; no independent drug economy, doses, recipes or medical model. Temporary resilience cannot erase injury truth. |
| N-C08 Capability access | Actual usable phone/weapon capability depends on possession/access, condition and relevant support. Reuse goods/control; concealment, observation, regulation, combat effect and communication receipt remain separate boundaries. |

## 5. Worked documentary cases and failure modes

**N-W01 — Wage versus rent versus presentation.** A tired Player can buy adequate cheap food, pay rent, or replace tattered clothes before a consequential meeting. A basic sale still works below the social threshold. PROPOSED recovery content includes modest food, poor-but-usable sleep and accessible washing; availability/price/permission remain authored, not guaranteed entitlements. If all wages require inaccessible rich conversation, the economy has a poverty trap rather than a meaningful choice. Repeated refill errands with no opportunity cost are the opposite failure.

**N-W02 — Good home, broken charger.** A nicer tenancy normally supplies restful sleep and reliable charging. A maintenance failure can remove charging while retaining storage/rest if the content supports that distinction. Buying a new phone cannot duplicate cash, stored goods or learned references. A charger is an opportunity, not automatic acquisition of every incoming message. Phone notes must not silently add forbidden Player keyword/reference authoring.

**N-W03 — Unpaid rent and moved goods.** Actual partial payment can coexist with contested arrears; a receipt or landlord accusation does not decide truth. Permission to sleep, physical entry, legal entitlement, and ownership/custody of stored items remain distinct. No automatic confiscation, remote item deletion or police awareness follows. Storage loss requires an explicit supported occurrence and retained continuity.

**N-W04 — Deferred recovery and optional weapon.** An authored substance may postpone exhaustion penalties for an opportunity, followed by recovery expense/time. It does not delete prior deprivation or guarantee combat survival. A concealed weapon creates no universal intimidation buff; display/use, interpretation and escalation need their separate authorities. No empirical health claims or tactical weapon procedure is supplied.

**N-W05 — Background interval becomes consequential.** Coarse household expenditure/consumption must not charge again when an explicit meal, medicine purchase or rent payment is retained. Preserve quantity/time/cost boundaries without inventing a named meal seller, witness or exact offscreen medical history. Advance through Encounter time only; aggregation does not install general elaboration.

These are paper reasoning cases, **NOT RUN**, not proof of playability or conservation.

## 6. Conflicts and candidate tensions

| Phase 1 key | Role-2 finding / routing |
| --- | --- |
| P1-03 / P1-12 | Rent renewal, grace, partial payment and concurrent bills need exact terms and credit rules. N-C05 cannot choose a generic duty lifecycle. **PROMOTE / RECONCILE / SHARED CONTRACT REQUIRED.** |
| P1-04 / P1-09 | Tenancy, hosting, locks and storage do not settle property law, eviction or confiscation. Route normative rules to owner/Laws. |
| P1-05 / P1-07 | Household traces need bounded retention; neither a full consumption diary nor unlimited condition history is justified. Coordinate roles 7/9/10. |
| P1-06 | N-W05 exposes duplicate consumption/charges and fabricated prior detail. Coordinate inventory/time specialists; promotion remains open. |
| P1-08 / P1-10 | Visible presentation cannot disclose actual illness, dependence or concealed weapons. Class-based rich engagement must retain basic/emergency access and remain actor-contextual. Phone “notes” versus KW-08 needs explicit reconciliation. |
| P1-10 / P1-14 | Cascading deprivation can make recovery inaccessible; excessive repair/charging can crowd out social play. Coordinate role 11 before selecting rates or content. |
| P1-01 / P1-02 / P1-15 | Carry corrected acceptance; visibility remains a nonblocking Steward publication issue; no KeyWrapping text edits. |

## 7. Unresolved owner/Governance decisions

1. Which minimum recovery opportunities must remain available, and what happens when hunger/exhaustion prevents normal action? Basic requests for aid must be considered alongside the owner's engagement exceptions.
2. How is the desired social threshold expressed across people/venues without inventing a universally known class rank or charisma penalty?
3. What needs/condition consequences belong to a future Encounter/Combat contract, and how do competing effects avoid duplicate impairment?
4. Which tenancy terms, grace periods, arrears consequences and property-access remedies may Economy specialize? Shared semantics require Governance/Laws review.
5. What phone notes/backlog capability is compatible with acquired references and KW-08, and what survives phone replacement?
6. What trace granularity suffices for household consumption, recurring payments and contested recovery within finite Core support?

## 8. Content choices, deferred work and research limits

Food/clothing categories, housing qualities, facility availability, prices, cadence, repair frequency, substance effects and recovery routes remain content proposals requiring owner review and later authorized evaluation. Personal cash uses the money specialist's location/provenance distinctions; a household budget is not a second balance/history.

No exact rates, formulas, legality, injury resolution, jurisdiction, medical realism, death/failure rule or schema is frozen. Two EA articles are related donors, so the source set is narrow. The official Sims player-guide PDF failed retrieval; the official This War of Mine page timed out, so neither supplies report evidence. No playtest, medical research or runtime experiment was conducted. Phase 3 must wait for owner review; this report claims no independent-audit PASS.
