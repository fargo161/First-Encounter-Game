# Terminology and semantic separation map

**Version:** v0.1 / Phase 1  
**Date:** 2026-10-23, America/New_York  
**Status:** PHASE 1 FRAMING FOR OWNER REVIEW; ECONOMY DESIGN NOT ACCEPTED

This is a shared reading guide for later assignments. It does not choose tables, fields, runtime types, formulas or a universal ontology. Economy labels below describe questions in the current Context. The accepted constraints are identified separately from terminology awaiting reconciliation.

Basis keys: **KW** = owner-accepted KeyWrapping semantic architecture under the [owner correction](AUTHORITY_AND_PREFLIGHT_UPDATE.md); **S12** = existing Stage 12 documentation conventions; **C1** = accepted bounded Core scope; **CTX** = current Economy Context design direction, not accepted Economy architecture. Exact representation and policies left OPEN in the sources remain OPEN.

| Terms to keep separate | Working interpretation for discussion | Basis / unresolved boundary |
| --- | --- | --- |
| Authoritative occurrence / economic transaction / economic effect | What actually happened is different from what a business or witness says happened. A transaction may concern several distinguishable effects. | KW-03/10/13, C1, CTX sections 2/20; no transaction atomicity or runtime envelope selected |
| Bookkeeping transaction / SQLite transaction | A business record and a database durability operation have different meanings. | CTX section 20; C1 persistence qualifications; no backend or accounting method selected |
| Money amount / physical cash / bank balance | Quantity, cash held at a particular place, and an account position are distinct concerns. | CTX sections 15-17; units, denominations and accounting representation open |
| Product type / aggregate stock / specific item | A kind of merchandise, coarse quantity and consequential individual continuity answer different questions. | CTX sections 8/21/46; no stock-unit or identity-allocation model selected |
| Ownership / custody / possession / control / authorization | Entitlement, holding, practical access/control and permission must not collapse into one flag. | S12 inventory E4; CTX sections 9/10; general property semantics require reconciliation |
| Economic ownership interest / organizational membership | A profit interest or asset entitlement need not imply faction membership or governance power. | CTX section 12; Factions/shared authority unresolved |
| Payment / transfer / sale | Moving value, changing custody or entitlement, and the agreed commercial exchange must be examined separately. | KW-10/13, CTX sections 9/20; no automatic simultaneous transfer or rollback selected |
| Job / work / wages due / wage payment | Employment terms, performed activity, owed performance and actual payment are distinct. | KW-13, CTX sections 11/17; economic specialization of obligations remains open |
| Revenue / cash on hand / profit / owner payout | A revenue measure, cash location, derived result and distribution are different concerns. | CTX sections 12/15; recognition, expense and distribution formulas remain open |
| Rent/bill / contractual commitment / statutory duty / Core environmental obligation | These may share language but have different bases and authority. A Core due-event mechanism is not evidence of a general legal or economic duty engine. | C1, KW transaction semantics, CTX sections 23/24/28; reconciliation required |
| Proposal / assent / agreement / fulfillment | Communicated terms, scoped acceptance, commitment formation and actual supported performance remain separate. | KW-10/13 and transaction model; open lifecycle policies and representations are not frozen |
| Permission / capability / willingness / legality | Being allowed, being physically able, deciding to act and normative classification answer separate questions. | KW-10 and scoped authority semantics; Laws contract unaccepted |
| Official ledger / off-books ledger / authoritative history | Both ledgers are descriptions that may be incomplete or false. Off-books is an abstraction, not an omniscient second history or mandatory notebook. | KW-03, CTX sections 18-20/42 |
| Insurance loss / claim / payout / recovery | Actual loss, assertion of loss, payment and later recovery must be distinguishable. | KW claim/effect separation, CTX sections 29/41; policy/recovery rules open |
| Actual provenance / asserted provenance / discoverable evidence | Actual source and movement, a claimed account of them and what an actor can obtain differ. | KW perspective model; CTX sections 20/21; trace granularity/retention open |
| Trace / authoritative causal evidence / discoverable evidence | Trace is an umbrella economic discussion term. The causal basis of an actual effect differs from fallible records and what an actor can discover. | KW-03/06, CTX section 20; no generic trace-record type, unlimited retention or automatic witness knowledge selected |
| Commercial receipt / actual payment | A commercial receipt is a business document/assertion concerning a transaction; it can be false or incomplete and does not itself establish actual payment. | KW claim/effect separation; CTX sections 18-20 |
| Communication receipt / observation / claim / acquisition | Content actually delivered to an actor, perceived aspects, attributed propositions and acquired information remain distinguishable. Receipt alone establishes neither belief, comprehension nor assent. | KW-03/06/10 and perspective model; employment, proximity or shared reference does not grant automatic acquisition |
| Reference identity / label / acquired handle / true subject facts | Addressing a subject or hearing a name grants no hidden facts or secret identity join. | KW-01/02/04; actual handle encoding and policies unfrozen |
| Event significance / elaboration / acquisition / salience / retention | Continuity and simulation attention do not automatically teach anyone; active attention and historical preservation differ. | KW-05/06/07/15; triggers, budgets and compaction open |
| Aggregate activity / explicit continuity / reconstructed detail | Coarse history cannot justify invented exact customers, products, dates or witnesses. Later consequential continuity must respect what was actually retained. | CTX sections 3/21/46, KW-15; promotion mechanism undecided |
| Occurrence time / reception time / due time / discovery time | A later report does not move the earlier event or reset a promised deadline. | C1 logical time; KW perspective/transaction semantics; cadence and boundary rules open |
| Business rule / social reputation / legal violation / enforcement action | A store ban, transmitted reputation, normative classification and institutional response are separate. | CTX sections 10/50; runbook sections 24-26; no automatic spread or police response |
| Legitimate activity / illicit activity / concealed activity | Classification, concealment and value movement are separate concerns; shared economic machinery is current direction. | CTX sections 31-44; no universal legality flag or separate crime engine selected |
| Authored location / interaction meaning / presentation | Spatial metadata and visible art do not establish permission, economic truth, health or intent. | S12 ownership matrix; RC HOLD and ZANT acceptance subsets retained |
| Schema version / content revision / run revision / artifact hash | Native identity axes and hash scopes remain qualified and distinct. | S12; no Economy version/ID envelope is installed |

## Reading constraints

A phrase such as paid, stolen, known, owned or overdue must carry enough discussion context to distinguish an actual effect, attributed record, actor-local account or normative conclusion. This is a review discipline, not a requirement for particular fields.

The accepted semantic constraints do not mean every economic fact must be actor-visible or individually instantiated. They also do not grant permission to erase consequential history. The exact aggregate/explicit and retention policies belong in the [conflict register](CONFLICT_REGISTER.md), not an implicit glossary decision.

Source reading: [KeyWrapping specification](../../../keywrapping-substrate/v0.1/SUBSTRATE_SPEC.md), [transactions](../../../keywrapping-substrate/v0.1/TRANSACTIONS_COMMITMENTS.md), [perspective/provenance](../../../keywrapping-substrate/v0.1/PERSPECTIVE_PROVENANCE.md), [references/promotion](../../../keywrapping-substrate/v0.1/REFERENCES_PROMOTION.md), [open policies](../../../keywrapping-substrate/v0.1/OPEN_QUESTIONS.md), [Stage 12 inventory](../../../../../contracts/SHARED_CONTRACT_INVENTORY.md) and [C1 scope](../../../../../packages/encounter-core-c1/README.md).
