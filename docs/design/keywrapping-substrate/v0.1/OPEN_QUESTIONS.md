# Open questions and entry conditions

**Version:** v0.1 · **Date:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT

Questions below are intentionally unresolved. A design example, audit recommendation or external donor must not silently close them. Sources: KW-CONTEXT §33, KW-REVIEW and KW-REPLY, identified in the [source snapshot](../../../research/keywrapping-substrate/v0.1/SOURCE_SNAPSHOT.md).

| ID | Question | Working boundary in this proposal | Evidence / next decision |
| --- | --- | --- | --- |
| OQ-01 | Which interactions promote which referents? | Name learning and consequential NPC encounters qualify; no numeric tiers or every-message promotion | Scenario/paper tests and owner selection |
| OQ-02 | Can learned book entries ever become unavailable? | Distinguish salience, canonical retention and availability; do not silently delete history | Resolve permanent-book recommendation versus forgetting/compaction design |
| OQ-03 | How are labels coined and misleading labels displayed? | Actor-local attribution; no canonical title implies truth | Alias and deceptive-label paper scenarios |
| OQ-04 | When may two known handles be recognized as one? | Record evidence for actor-specific identity linkage; world merge is not disclosure | Scenario rules and re-identification review |
| OQ-05 | How are event clusters formed? | Shared incident wrappers can reference multiple occurrences; uncertain reports need no real event | Grouping policy and provenance requirements |
| OQ-06 | How far may background information propagate? | Bounded causal receipts; no autonomous infinite conversation simulation | Scenario-specific path/cost budget |
| OQ-07 | Which action senses and near-duplicate distinctions become final? | Preserve 66-word surface with explicit candidate senses and gaps | Paper test plus owner-reviewed dictionary |
| OQ-08 | Are Attack/Hurt/Kill/Steal added? | Candidates only; examples do not add Player vocabulary | Explicit vocabulary decision |
| OQ-09 | What predicate families and uncertainty scales are needed? | TRUSTS/FEARS/NEEDS/BELIEVES are analyzed as predicates; no universal numeric psychology | Minimal authored scenario requirements |
| OQ-10 | What can context omit safely? | Only uniquely resolved actor-known references; ambiguous assent has no binding effect | Composer paper test and finite ambiguity scenarios |
| OQ-11 | Which social acts require receipt, comprehension, standing, witness or assent? | Each sense declares conditions; not all talk is automatically binding | Per-sense rules and scenario authority profiles |
| OQ-12 | Which groups can assent, delegate, waive or cancel? | Exact party/authority scope; no implicit group consensus | Multi-party and delegated-authority cases |
| OQ-13 | What constitutes fulfillment, impossibility, disputed breach or remedies? | Evaluate individual obligations; canonical evidence and actor claims differ | Scenario outcome rules; do not impose a law system |
| OQ-14 | How does BASED affect evaluation without revealing private intent? | Observable performance can inform actor-local interpretation; no truth detector | Playable interaction testing |
| OQ-15 | What resource bounds and reference/version axes are required? | Bounded expansion, stable local identities, separately named document/content/state revisions | Later concrete implementation contract and measurements |
| OQ-16 | Which persistence backend or Core integration is appropriate? | No backend selection, migration or adapter in this pass | Separate integration design/authorization; accepted C1 untouched |
| OQ-17 | What operational validation is needed beyond JSON shape? | Actor disclosure, authority, temporal and graph checks require semantic evidence | Later authorized runtime proof; no schema files now |
| OQ-18 | Is the language enjoyable to compose? | This specification cannot answer it | Paper test before implementation/design freeze; later standalone playability acceptance |
| OQ-19 | May the package be committed, pushed or merged, and how should visibility records change? | Uncommitted local branch; public/private discrepancy retained | Separate owner decision; no publication in this delivery |
| OQ-20 | May FrameNet data or other donor excerpts be redistributed? | Original analysis and links; no unresolved raw-data copy | Capture exact release license and attribution before any future redistribution |

An open gameplay policy does not authorize unsafe fallback. A future implementation must reject or defer a consequential operation whose required meaning/authority cannot be resolved. This is compatible with still permitting discussion, uncertainty, refusal and clarification.
