# Conservation / Traceability finding register

**Date:** 2026-10-23  
**Auditor:** Fresh independent Auditor A  
**Overall outcome: PASS**  
**Counts:** 0 BLOCKER; 0 MAJOR; 0 MINOR; 4 NOTE. No corrective defect finding.

Severity/outcome thresholds and independence limits are defined in the [audit](CONSERVATION_TRACEABILITY_AUDIT.md). Notes below are future-support/policy observations, not failures of the documentary model and not conditions on this PASS. Line references were checked against the actual Phase 4 source text. A range identifies several verified lines; quoted excerpts remain exact. Phase 1-4 sources are unchanged.

## A-N01 — Same-occurrence requirements remain an integration gate

**Severity:** NOTE.  
**Exact invariant:** One actual economic occurrence is represented once; F3 qualification cannot perform it again; the same required scope cannot receive duplicate fulfillment credit. A genuine later occurrence must remain distinguishable from retry/acknowledgment of the earlier one.

**Exact source:** [ECONOMY_SUBSTRATE_V0_1_RECONCILED.md:64](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L64): “F2 describes the actual occurrence/effect once.” At [line 75](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L75): “Same-occurrence acknowledgment cannot repeat an effect; the same required scope cannot receive duplicate credit.” [RECONCILED_DECISION_REGISTER.md:70](../phase-4/RECONCILED_DECISION_REGISTER.md#L70) explicitly leaves actual shared guarantees and executable consumer authorization for later.

**Counterexample/reasoning:** A work shift qualifies for wages, a bank conversion funds payroll, a worker is paid, and a replayed payslip/credit evaluation tries to create a second shift or payment. The first two quoted requirements prohibit it independently of record truth. Nothing in the family organization requires a second occurrence. An absent mechanism for committing/correlating those operations cannot be called an implemented guarantee, and the candidate does not call it one.

**Failure classification:** Primary future runtime-integration requirement; no present architectural failure. Secondary unresolved-policy-dependent outcome only for allocation between different duties. The same-scope prohibition itself is not open policy.

**Minimum required remediation:** None to close Phase 5. Before any future executable-support claim, its separately authorized contract/evidence must show consistent position/effect/credit admission, exact identity scope, interrupted/repeated acknowledgment behavior and genuine later occurrence distinction. This note prescribes no API or persistence design.

**Owner/Governance choice needed?** No new audit-gap decision. Existing D01/D10 apply before cross-duty results or an executable consumer is claimed. No implementation is authorized now.

## A-N02 — Finite support must preserve repeat and causal obligations

**Severity:** NOTE.  
**Exact invariant:** Reduced attention, duty closure, summaries and evidence destruction cannot discard protected history or support still needed for continuation/repeat prevention. Future supported duration/activity/precision and limit response must be declared; unavailable old precision remains unavailable.

**Exact source:** [ECONOMY_SUBSTRATE_V0_1_RECONCILED.md:139](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L139): “A summary, closed duty or reduced salience does not authorize deletion.” [RECONCILED_DECISION_REGISTER.md:28](../phase-4/RECONCILED_DECISION_REGISTER.md#L28): “declining/stopping unsupported continuation before required support is lost.” [PROOF_SCENARIOS_FOR_AUDIT.md:33](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L33) expressly includes prior payout/retry evidence, exact terms, concealed source and a consequential aggregate exception at the limit.

**Counterexample/reasoning:** A closed insurance duty loses its old credit identity while a summary keeps only balances. The same payout request is then treated as fresh. That continuation violates the retained-support requirement, even if the visible balance looks plausible. C1's finite accepted proof cannot supply a general Economy retention lifetime. The candidate expressly withholds such a guarantee and chooses no presumed-safe compaction.

**Failure classification:** Primary future runtime-integration requirement; secondary unresolved-policy-dependent supported-envelope choice. No current architectural or documentation defect was found.

**Minimum required remediation:** None to close Phase 5. Any later support claim must identify promised historical questions, protected prefix/terms/credits/exceptions, admitted workload and a behavior before required support can be lost. Compaction, if ever commissioned, needs separate preservation evidence; a summary is insufficient.

**Owner/Governance choice needed?** Existing D03/D10, with owner/Core/Governance, before capacity/continuation claims. Learned-book permanence stays independently open and is not decided by this note.

## A-N03 — Mixed-source precision is conditional, not a reconstruction oracle

**Severity:** NOTE.  
**Exact invariant:** Mixing/splitting/refinement preserves supported consequential quantities and origin distinctions, without inventing exact per-unit ancestry or discarding already promised provenance. Actor knowledge is separately acquired.

**Exact source:** [ECONOMY_SUBSTRATE_V0_1_RECONCILED.md:56](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L56): “Mixing does not erase supported provenance or grant per-unit ancestry beyond what was retained.” At [line 111](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L111): “If old linkage is unsupported, leave association unresolved; new testimony remains an account.” The authority memo [AUTHORITY_AND_CONTINUITY.md:60-62](../phase-4/reconciliation/AUTHORITY_AND_CONTINUITY.md#L60) also separates retained precision from acquired precision.

**Counterexample/reasoning:** Three diverted and seven ordinary units are commingled. A later buyer requests proof that one selected unit came from the ordinary seven. The candidate can retain the three/seven supported contribution and the later movement while leaving the selected unit's exact ancestry unknown. Labeling all ten ordinary erases source; assigning a fabricated serial lineage invents history; revealing hidden contribution to every buyer creates knowledge. All three shortcuts are rejected. The rule need not promise per-note or microscopic history to remain coherent.

**Failure classification:** Primary future runtime-integration requirement; secondary unresolved-policy-dependent precision/envelope. No architectural failure is inferred from an intentionally unavailable historical answer.

**Minimum required remediation:** None to close Phase 5. A later bounded fixture must state what source contributions/relations and resulting questions are retained across split, merge, use, resale and recovery. It must label unsupported association unresolved. The note selects no attribution formula.

**Owner/Governance choice needed?** Existing D03 for promised precision and D10 for support; D02/D04 only if an entitlement/classification result needs those facts. No new creative decision is demanded merely to preserve unknown detail.

## A-N04 — Rights-dependent outcomes stay withheld pending supplied basis

**Severity:** NOTE.  
**Exact invariant:** No record assertion, occurrence, payout or recovery creates authority, general title law, intent, a remedy or legal classification without its actual supplied basis. Completed effects/history remain intact whichever compatible policy is later selected.

**Exact source:** [PROOF_SCENARIOS_FOR_AUDIT.md:14](../phase-4/PROOF_SCENARIOS_FOR_AUDIT.md#L14): “A case without a selected title, policy, outcome or authority basis must label that result unresolved.” [ECONOMY_SUBSTRATE_V0_1_RECONCILED.md:58](../phase-4/ECONOMY_SUBSTRATE_V0_1_RECONCILED.md#L58): “it does not mint grants, decide general title law or turn a claimed permission into authority.” [RECONCILED_DECISION_REGISTER.md:40](../phase-4/RECONCILED_DECISION_REGISTER.md#L40) retains both no-repayment and explicit new-duty-on-recovery insurance variants.

**Counterexample/reasoning:** After a real insurer payout and recovery of original goods, an auditor demands that repayment is always due, or that no repayment is ever due. Neither conclusion follows from economic continuity. The candidate keeps both effects, leaves policy-specific rights conditional, and requires new supported effects for any repayment. Similarly, possession cannot supply title and a shareholder percentage cannot approve its own payout. This is preserved uncertainty, not missing conservation semantics.

**Failure classification:** Primary unresolved-policy-dependent outcome; secondary future runtime-integration requirement where any such effect is later implemented. No current architectural/documentation failure.

**Minimum required remediation:** None to close Phase 5. Before a later rights-dependent result is asserted, supply exact terms, relevant standing, outcome authority and chosen policy, or keep the result unresolved. No wholesale resolution of all D01-D11 cards is required for documentary review.

**Owner/Governance choice needed?** Existing D01/D02/D04/D05/D09 as applicable; no new audit-gap choice. Audit PASS cannot ratify those choices or freeze final Economy architecture.
