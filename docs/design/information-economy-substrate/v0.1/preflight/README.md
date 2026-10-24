# Information economy substrate — Gate P0 preflight

Status: Gate P0 documentation complete; see the [preflight report](INFORMATION_ECONOMY_PREFLIGHT_REPORT.md) and its final verification evidence. This directory contains new review documents only. The owner's request, “information economy preflight”, scopes this run. The supplied draft team prompt is a requirements checklist, not independent authorization for architecture adoption, implementation, migrations, dependency installation, remote actions or a playable slice.

The Stage 12 consolidation gate remains closed to Stage 13 / Unity. No production files, accepted packages, authority manifests or existing fixture documents are in the change set. Gate P0 ends this run; any later architecture work needs explicit owner direction, and implementation additionally needs its architecture gate.

## Team and resource allocation

Four concurrent workers cover the draft's responsibilities. These are role assignments, not twelve separate processes.

| Worker | Responsibilities in this preflight | Independence |
| --- | --- | --- |
| Director (root) | A synthesis; D organization boundaries; K repository/evidence stewardship; L decisions and gates | Writes scope, safety, decisions, risks and final report |
| Context / compatibility reviewer | C semantics; G Encounter integration | Inspects repository authority; owns context, terms, Core and persistence reports |
| Reuse researcher / final auditor | E software reuse; B/F only as needed for P0 dependency validation; separate J final adversarial review pass | J is a different worker from test planner I; does not claim an independent audit of its own dependency research. No adoption or code copying |
| Independent verification reviewer | I test planning and boundedness analysis; adversarial testability review | Different worker from final auditor J; no Builder role or implementation in this run |
| Reserved for later | H Builder; expanded B/D/F specialist research | Inactive until separately authorized; Builder cannot sign independent test/audit acceptance |

Operational budget, established before substantive analysis (not a requested metered goal):

| Resource | Allocation / limit |
| --- | --- |
| Context | Approximately 60k working tokens across roles: director 16k, context 16k, reuse 14k, verification 14k; targeted reads rather than entire archives |
| Tools | Target 100 calls across workers; 30 context, 20 research, 25 verification, 25 director/synthesis; expand only for unresolved evidence |
| External research | 8–12 batched primary-source calls; candidate release/license/runtime validation only |
| Code spikes | Zero executed in P0; define disposable, bounded proposals for later approval |
| Implementation | Zero code, schemas, adapters, migrations, dependency installs or fixture execution changes |
| Verification reserve | Doctor, integrity, relevant disposable baseline checks and report/link checks; approximately 20% of effort |
| Audit reserve | Approximately 15% for independent review, authority collisions, unsupported claims and corrections |
| Reporting reserve | Approximately 20% for the twelve required artifacts, evidence ledger and Gate P0 recommendation |

Priorities if evidence gathering expands: authority correctness, Core preservation, verification, audit and traceable reporting. Optional dependency detail can remain a candidate-local hold.

## Evidence conventions

Repository-relative paths refer to this checkout, not historical Downloads/Desktop locations. Owner decisions, executable behavior, accepted design, research recommendations and unverified assumptions are separate categories. New information-economy tests and performance figures must not be described as executed or measured.

Research date: 2026-10-23, America/New_York. Runtime evidence may carry UTC timestamps that fall on 2026-10-24.
