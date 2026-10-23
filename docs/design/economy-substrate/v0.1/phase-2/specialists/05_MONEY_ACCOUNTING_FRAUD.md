# Money, accounting, banking and fraud: specialist findings

**Version:** v0.1 / Phase 2 / role 5  
**Date:** 2026-10-23, America/New_York  
**Status:** PROPOSED ECONOMY RESEARCH AND DESIGN; NOT ACCEPTED ARCHITECTURE  
**Authorization:** Owner-approved Phase 2 only; no Phase 3 synthesis, implementation, commit or publication.

## Remit and authority

This report investigates the minimum distinctions needed for physical cash, account balances, payroll, business results, ownership payouts, taxes, insurance and dishonest reporting. Candidate labels below are document navigation, not schema types, fields or APIs.

| Evidence class | Controlling material and consequence |
| --- | --- |
| Repository authority | [Stage 12 decision](../../../../../../contracts/SHARED_CONTRACT_DECISION.md), accepted conventions 1-8; [inventory](../../../../../../contracts/SHARED_CONTRACT_INVENTORY.md), Encounter E3/E4/E7; [boundary matrix](../../../../../../contracts/BOUNDARY_MATRIX.md), interaction and projection rows: Encounter owns validated consequences. References grant no mutation authority. |
| Accepted Core scope | [C1 package](../../../../../../packages/encounter-core-c1/README.md), Scope and qualifications: EA-C1/0.1.3 is a bounded non-social reference proof with finite-history and N01/N02 limitations. It proves no banking, payroll or generic debt capability. |
| Accepted KeyWrapping semantics | [Owner correction](../../phase-1/AUTHORITY_AND_PREFLIGHT_UPDATE.md), effective status dimensions; [transactions](../../../../keywrapping-substrate/v0.1/TRANSACTIONS_COMMITMENTS.md), C01-C04/C07-C12; [perspective](../../../../keywrapping-substrate/v0.1/PERSPECTIVE_PROVENANCE.md), clocks, acquisition and change by addition: bounded architectural baseline and invariants OWNER-ACCEPTED. Runtime absent/unaccepted; shared Encounter integration unaccepted; representations unfrozen. Historical proposal headings do not reverse that correction. |
| Observed native example | [M3 engine](../../../../../../packages/encounter-atlas/src/m3/engine.mjs), `stageMatchedResult`, handover and `validateDomain`: matched effects distinguish owner/holder and conserve the fixture's balances. This is a scoped example, not a universal Economy implementation. |
| Phase 1 framing | [Scope](../../phase-1/SCOPE_AND_BOUNDARY_MAP.md), [terms](../../phase-1/TERMINOLOGY_MAP.md), [assignments](../../phase-1/RESEARCH_ASSIGNMENTS.md) and [conflicts](../../phase-1/CONFLICT_REGISTER.md) govern this role's questions. Phase 1 is accepted by the subsequent owner message; historical stop/queued wording is superseded only within approved Phase 2. |

The required [development rules](../../../../../../DEVELOPMENT.md), [compatibility examples](../../../../../../contracts/COMPATIBILITY_EXAMPLES.md), [source authority](../../../../../provenance/source-authority.json) and [next-stage gate](../../../../../consolidation/NEXT_STAGE_GATE.md) preserve native scopes and package bytes. Nothing here modifies those sources or authorizes Stage 13.

**Owner-established direction:** supplied Economy Context v0.1 sections 12, 15-20, 28-31, 41, 44 and 46 require cash/bank distinctions, simple accounting, fallible official/off-books records, traceable consequential effects and shared legitimate/shadow machinery. Runbook section 27 role 5 requires actual, recorded and reported transactions to remain distinguishable. Input hashes and provenance are in the Phase 1 authority note. Neither attached document self-authorizes later phases.

## Research evidence and limitations

All sources accessed **2026-10-23**. Only primary publisher material was used. External findings are analogies or cautions; they do not select game law, reporting standards or an economic implementation.

| ID | Title / organization / date or version / direct source | Inspected evidence | Applicability and limits |
| --- | --- | --- | --- |
| M-01 | Michael McLeay, Amar Radia and Ryland Thomas, *Money creation in the modern economy*, Bank of England, Quarterly Bulletin 2014 Q1, published 2014-03-14; [article](https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy), [PDF](https://www.bankofengland.co.uk/-/media/boe/files/quarterly-bulletin/2014/money-creation-in-the-modern-economy.pdf) | PDF pp. 14-17: currency and commercial-bank deposit money differ; lending can create deposits and repayment destroy them. | Analogy supporting distinct monetary forms; caution against equating local transfer conservation with fixed global money. Reject importing monetary policy, reserves, lending or bank solvency simulation into this phase. Historical UK account, not current banking advice. |
| M-02 | *Beginners' Guide to Financial Statement*, U.S. Securities and Exchange Commission, 2007-02-04, last reviewed 2007-02-05; [guide](https://www.sec.gov/investor/pubs/begfinstmtguide.htm) | Balance Sheets, Income Statements and Cash Flow Statements: position at a date differs from period performance and cash movement; owner interests and distributions are distinguishable. | Directly useful conceptual distinctions, not a selected accounting system. The accounting equation is a mathematical reporting relationship, not proof that records describe real events. No investment, tax or compliance advice is inferred. |
| M-03 | *Conceptual Framework for Financial Reporting*, IFRS Foundation / IASB, revised March 2018; [official overview](https://www.ifrs.org/issued-standards/list-of-standards/conceptual-framework/) | About section: reporting-entity boundary, recognition, measurement and presentation are separate conceptual concerns. | Analogy: declare what a business result covers before calculating it. No detailed recognition rule adopted. Attempted 2021 issued-text PDF redirected to subscription access; full paragraphs were not inspected or relied upon. |

**Research inference:** a small game model benefits from distinguishing balances, flows, obligations and descriptions while declining the full real-world machinery. These sources do not establish fraud intent, insurance recovery rights, tax bases or gameplay quality; owner direction and shared review govern those questions.

## Candidate primitives and economic specializations

These are deliberately overlapping candidates for later comparison, not a selected global model. Architecture means a proposed semantic distinction; content means an authored parameter or policy needing later approval.

| Candidate | Proposed meaning / reuse | Architecture versus content |
| --- | --- | --- |
| M-C01 Monetary holding | Distinguish cash at register, safe or in transit from bank-account balance. Custody/access need not imply ownership. Reuse for retail, payroll, concealed proceeds and deposits. | Architecture candidate; exact denominations, limits, accounts and access rules are content/open shared authority. |
| M-C02 Actual value movement | An actual effect has a declared monetary form, supported quantity and relevant origin/destination or boundary. Deposit/withdrawal conversion cannot leave the same spendable value in both forms. | Architecture candidate under Encounter authority; settlement delay, fees, failure and cash availability remain open. No executable transfer protocol. |
| M-C03 Economic obligation and performance | Wages, supplier payment, rent, tax and premiums specialize a separately justified duty basis. Due, contested, paid and credited are distinct. | Reuse accepted KeyWrapping semantics; obligation formation and normative bases require reconciliation. Amounts/cadence are content. |
| M-C04 Attributed economic record/report | A ledger entry, commercial receipt, payroll description or submitted statement can describe an actual effect, omit it or assert a nonexistent one. Official/off-books identify recording contexts, not truth rankings. | Architecture candidate using existing claim/provenance separations; record format, access and retention are open. |
| M-C05 Period result | Revenue, scoped operating costs and resulting surplus/deficit describe performance over a declared interval and basis. They differ from current liquidity. | Architecture candidate; cash/accrual simplification, restock treatment and exact profit formula are unselected. Do not charge restock twice. |
| M-C06 Ownership payout interest | A scoped economic interest can support a later payout calculation. Interest, authority to approve distribution and actual payment differ. | Shared-boundary candidate; shares, retained earnings, dilution, sale proceeds and distribution priority need owner decisions. No Factions authority implied. |
| M-C07 Loss, claim and recovery relation | Actual loss, attributed claimed loss, evaluated coverage, payout and later recovery remain linked but distinct. Reuse goods/cash movement and obligations. | Architecture candidate; coverage categories/limits are content; policy rights and remedies require Governance/Laws review. |
| M-C08 Declared simulation boundary | External supply, consumers, insurers and taxes can connect a bounded explicit economy to authored aggregate sources/sinks. Preserve what the coarse effect actually established. | Architecture candidate; frequencies/amounts are content. Does not require every outside payer or city resident to exist. |

## Documentary cases

These are reasoning fixtures, not executed simulations, formal audit results or acceptance claims. Quantities are arbitrary examples.

1. **Payroll custodianship:** a business withdraws 100 units; cash passes to a courier, then a payroll custodian. Each custody stage differs from wages received. Paying a worker 30 moves that portion; merely earmarking the remaining 70 does not pay anyone. Robbery or loss does not automatically erase an earned wage claim. Transfer authority and entitlement remain separate.

2. **Partial payment/delivery:** agreed supplier terms require 30 units and three crates. An actual 10-unit payment supports only 10 credited toward the same required scope; replay cannot credit it again. One delivered crate is separate performance. A real second payment has separate effect evidence. Late delivery, refunds, substituted goods and one payment allocated across several obligations need explicit policies; joint terms imply no automatic atomic rollback.

3. **No-show wages:** work occurred or did not; wages were due or disputed under an identified basis; money moved or did not; payroll recorded an amount. These are different facts. Payment to someone who did not attend is not automatically a proven fraudulent wage: paid leave, standby or another authored basis may exist. Classification and intent require their own basis; detection and enforcement belong elsewhere.

4. **Inaccurate official/off-books records:** an actual 50-unit sale can be recorded as 40 officially and 45 privately, then reported as 35. Neither book fills missing truth. Conversely, a 50-unit receipt can exist without payment. A mathematically balanced invented account is still false. Destroying a record changes available evidence, not the earlier effect, and teaches no actor automatically.

5. **Insurance loss/claim/payout/recovery:** ten crates are diverted; a claimant asserts twelve lost; an insurer later pays 60; four original crates are recovered. Goods, claims, payment and recovery preserve distinct histories. Recovery does not silently duplicate goods or reverse payment. Repayment, salvage rights and disclosure obligations require selected terms/rules, not an automatic Economy remedy. Damage/injury truth remains with Encounter/Combat.

6. **Shares versus revenue:** a store has 100 revenue, 80 scoped costs, and a candidate 20 surplus. A 25% interest does not grant 25 of gross sales or immediate withdrawal authority. Under an explicitly selected full-distribution fixture it could yield 5; retained funds and insufficient liquidity may change payment timing or availability. Buying an existing owner's share pays that seller unless the actual deal instead contributes capital to the business.

7. **External sources/sinks and aggregation:** aggregate sales can add 80 local receipts while reducing scoped stock without fabricating eighty named buyers. A later explicit sale must not recount an already included portion. An external tax payment or insurance receipt crosses a declared boundary; it need not conserve the sum of every local balance. Consequential local movements still require causal support. Later elaboration cannot invent exact anonymous customers or precise witnesses.

## Conflicts and unresolved decisions

All rows remain open for later reconciliation; none is closed by specialist preference.

| Phase 1 issue | Concrete tension / route |
| --- | --- |
| P1-03 / P1-12 | Payroll, statutory tax and insurance do not share one demonstrated formation basis. Preserve once-only credit for the same required scope; leave cross-obligation allocation, priority and remedies open. **PROMOTE / RECONCILE / SHARED CONTRACT REQUIRED.** |
| P1-04 / P1-11 | Courier custody, account operation, business shares and beneficial interests cannot grant universal property/group authority. Owner/Governance must scope delegation and distribution authority. |
| P1-05 / P1-07 / P1-08 | Trace direction must coexist with finite support and sealed actor knowledge. Which consequential monetary relations survive aggregation/retention, and through which eligible acquisitions are records visible? Roles 9/10 and Governance decide shared requirements; no unlimited ledger or automatic investigator access. |
| P1-06 / P1-13 | M3's fixed fixture balance sum cannot establish a closed-city economy or bridge to C1. Aggregate/explicit portions need reconciliation without a converter, migration or invented fine history. |
| P1-09 / P1-14 | A discrepancy supports a question, not automatic fraud, illegality or enforcement. Shadow payments reuse M-C01-C04; concealment changes claims/access, not a separate monetary physics. Roles 6/8/11 retain classification and exploit questions. |

Owner decisions still include the simplest accounting basis; whether individuals broadly use accounts; payment timing and overdraft policy; wage accrual versus attendance; tax basis/cadence; insurance recovery terms; payout reserves/priority; boundary-source limits; and tolerable retained-history granularity. Rates, fees, tax percentages, shares and scheduling values are deferred content.

Research does not validate balance, fun, exploit resistance, legal realism or executable conservation. This report proposes no standalone fraud minigame, double-entry requirement, bank-credit simulation, information investigator or new authority owner. It ends at specialist findings; Phase 3 synthesis and later independent audits remain owner-gated.
