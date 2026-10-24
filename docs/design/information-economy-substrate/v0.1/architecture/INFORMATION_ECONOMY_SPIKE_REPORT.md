# Selected disposable architecture spikes

Status: completed question-oriented experiments, **not production substrate, successor qualification or A–L runtime acceptance**. Director authored the tiny harness; independent tester I inspected it, reran the final source and supplied separate adversarial probes. Only standard-library Python was used; no package install. [Source/results index](evidence/spike-index.json), [final source listing](evidence/spike-source.py.txt), [root run](evidence/spikes-final-seed-1.json), [independent verification](evidence/independent-spike-verification.json).

## Setup, identity and budgets

Selected P0 S1/S3/S4/S5. S2 optional NetworkX projection was not needed: none of NetworkX/prov/transitions/statemachine/rule_engine is present in the selected Python, and the bounded first-proof requirements fit explicit tables/adjacency work. No library-performance comparison is claimed. RETE/LTMS/event-store replacement were not spiked.

External nonproduction directory: `C:\Users\mcdon\.codex\visualizations\2026\10\24\01a16bab-b2c1-7100-ba15-0bcf0b16692b\ie-architecture-cca6d4a6`. Source: `run_spikes.py`; archival earlier source `run_spikes_r0_state_only.py`. New run directories retain copied C1 source, disposable toy DBs and results. The repository retains only clearly labeled `.py.txt` source listings, compact JSON evidence and reports. No accepted DB/package/schema was changed. Cleanup status: retained for review; no deletion, no installed dependency or production path promotion.

Runtime: Python 3.12.0 / SQLite 3.42.0, Windows. Commands from repository root use `python -B EXTERNAL_SOURCE --repo ABSOLUTE_CHECKOUT --out NEW_EXTERNAL_RUN`, with `PYTHONHASHSEED=1` for Director and `2` for independent reviewer. The final source SHA-256 is `87a47a71a098b2f39928acee3908072e04de6c39770a8d35086c9f2d433372e5`. Both final runs exited 0. S1/S3/S4 semantic result digest matched: `f6bfc3d08b64af02cbeb6bec3df6986e282086504e0a114190dbc8638a6d2fb0`. S5 is excluded from that digest because it contains operational timings; independent I separately compared its deterministic counts/byte totals/refusals.

Each selected question stayed within its P0 20–25 minute / 8–10 call ceiling; the final combined harness execution took seconds. Reported times/peaks below measure toy serialization/SQLite/decode only and are not IE performance evidence.

## S1 — provenance / visibility values

**Question:** Can small explicit lineage references distinguish common source from repeated holders and keep a chosen outward fragment independent of hidden fields, without adopting full PROV/NetworkX?

**Setup:** A fixed Mike→Sarah/Bob→return rumor, an unknown source, a separate originating basis, an explicitly false accusation against Q while the toy world identifies P, and an intentionally cyclic link input. A visited-set traversal has a cap; a projection selects already-received outward bodies.

**Observed:** Sarah/Bob/return trace to the same Mike origin; unknown source remains marked unknown; a depth/work cap returns incomplete. The deliberately cyclic input terminates without adding an origin. The specified outward value is equal when hidden culprit/source values change; false text leaves the separate toy world dictionary untouched.

**Independent limitation TI-01:** The malformed originless cycle returns `complete:true, origins:[], unknown:false`, and a dangling parent raises `KeyError`. This harness therefore proves termination and a supplied-value filtering example only. It does **not** validate causal lineage completeness, production authorization, unknown ancestry, actual acquisition, phantom-subject semantics or general noninterference. A fixed false-claim dictionary is not a test of an admission engine.

**Architecture consequence:** First native causal links must point backward in `(admission sequence, local causal position)`: already-admitted parents or earlier valid local records in the same atomic unit. External derivation premises must already exist in earlier admitted units. Mandatory dangling/forward/cyclic causal provenance refuses before commit. Optional genuinely unknown ancestry stays explicit unknown and never implies independent support. Semantic/topic cycles remain visited-set/budget bounded. Implementation tests must attack all of these cases. Do not promote the toy's malformed-cycle `complete` flag or exception behavior into a contract.

**Recommendation:** Keep explicit bounded native provenance/eligible projections; borrow PROV concepts. No provenance library required to answer this question. S1 production capability remains **NOT RUN**.

## S3 — generic synchronous workflow

**Question:** Does a small explicit transition table cover the first tiny/compartmentalized workflow without a workflow runtime?

**Setup:** `queued→assigned→in_review→decision_recorded→closed`, explicit reopen, supplied action grants and one-actor versus split-actor runs; priority/due/age/ID sort; an explicit X-only referral value selected from X/Y/hidden origin.

**Observed:** Tiny and split configurations use the same table/trace; membership without a supplied grant refuses. Queue order is stable under reversed construction; reprioritization keeps original age. Selected referral contains only X.

**Limits:** No durable organization, function delegation, actor acquisition, atomic actual transfer or effect is implemented. X-only dictionary selection alone cannot prove access control. The architecture adds those native admission obligations, including assignment notices and content acquisition separately. No real legal/insurance/tax/gang threshold is tested.

**Recommendation:** Keep a synchronous native transition table. Defer workflow dependencies, callbacks/timers/async work and broad statechart features.

## S4 — bounded support diagnostics

**Question:** Can finite alternative premise sets expose support loss without automatically overwriting recorded stance or adopting an LTMS?

**Setup:** D1 has E1 OR E2 support; D2 depends on D1. Explicit holder qualification sets, a private hidden withdrawal set, one bounded traversal and a tiny missing-input policy control.

**Observed:** One surviving alternative supports D1; both known withdrawn premises leave D2 unsupported; a capped traversal is affected/incomplete. Without a holder qualification, a hidden withdrawal does not change holder status. Recorded toy stances are byte-identical. Missing rule input is UNKNOWN.

**Limits:** This is a fixed known DAG; no general rule soundness, production invalidation closure, typed unknown algebra, persistence, actor reception, adversarial code purity or historical queries are proved. Future support diagnostic evaluation must distinguish unknown from known unsupported, mark relevant stale caches before reuse, and refuse a consequential update whose bounded closure cannot be accounted. Stance revision remains a separate explicit operation.

**Recommendation:** Adopt inspectable holder-qualified invalidation as the first capability; no automatic psychological/stance revision and no general LTMS.

## S5 — native rejection / coupled serialization costs

**Question:** Can accepted C1 already accept a social table, and what happens when a full-state history carries a full coarse witness as well as poststate?

**Setup:** Copy all 25 C1 source files byte-for-byte to a new external directory, create a disposable C1 world, add only `ie_probe` to that disposable DB, then reopen unchanged C1. Separately use a deliberately labeled `toy_history` database of repeated synthetic snapshots, canonical-byte census, transaction rollback at an operation/encoded-prefix cap and cold JSON decode measurements. This is not a successor store or replay implementation.

**Observed C1:** Reopen refused `Unavailable: STORE_INVENTORY`; accepted and copied source files remained unchanged. No C1 source/policy/schema extension is supported by this probe.

**Cost revision:** Initial r0 measured only poststate. C/G review identified that retaining C1's coarse witness also charges a potentially full state in the prepared request. Final source charges both. The architecture therefore retains complete private witnesses and increases the **full prepared request** ceiling to 160 KiB while limiting the semantic intent body to 8 KiB. No compact witness completeness proof is assumed.

| Final toy shape | State bytes | Admitted toy rows | Encoded history bytes | Next refusal | Independent seed2 confirmation |
| --- | ---: | ---: | ---: | --- | --- |
| Nominal ~48 KiB | 49,149 | 64 | 6,298,427 | Operation cap | Same deterministic values |
| Near-128 KiB | 131,069 | 31 | 8,129,805 | Prefix byte cap | Same deterministic values |

Director run cold-decode traced peaks were about 10.6 MB / 10.4 MB, with toy workspace reservations about 228 MB / 294 MB; these are **toy measurements**, not successor memory/reservation certification. The toy omits actual root/request/result/receipt/policy replay overhead, rich Unicode, full writer admission and crash windows. An integrated successor can refuse earlier. It must independently charge physical allocation and every encoded proof component before acknowledgement, then cold-reopen under the same profile.

**Recommendation:** A new explicitly authorized native successor, no C1 edit/overlay. Retain conjunctive operation/byte/work/state/physical limits with safe early refusal. There is no promise that all maxima, 64 large operations or city-scale workloads fit.

## Evidence-to-claim boundary and cleanup

The experiments support selecting simpler mechanisms and identify a real witness-cost interaction. They do not prove the minimum substrate, all A–L scenarios, native successor correctness, authority, sealing, deterministic replay of production state, safe migration, durability, psychology or scalability. Those remain implementation/independent test/owner-acceptance obligations after Gate A.

Keep the source listings and compact results as architecture evidence only. External disposable code/DBs are retained until review is complete; they are never imported as production modules. If later cleaned, verify exact absolute run paths stay under the named disposable root and remove only this phase's directory. No cleanup was required to finish architecture and no deletion of originals/archives is authorized.
