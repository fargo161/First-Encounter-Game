# Information economy license and reuse ledger

Research date: **2026-10-23, America/New_York**. Gate P0 evidence only. Recommendations are not adoption, legal clearance, an approved dependency lock or permission to redistribute the private repository.

## Actual reuse this run

| Category | Actual state |
| --- | --- |
| Concepts studied | PROV vocabulary, support/retraction, graph projections, workflow/rule boundaries and event-sourcing comparison; limited institutional/social-agent research |
| Code copied or adapted | **None** |
| New runtime dependencies | **None** |
| New development-only dependencies | **None** |
| New test-only dependencies | **None** |
| Package/source distributions downloaded or installed | **None**; metadata/license text was inspected through primary web sources |
| Existing baseline | Repository Python/Node wrappers and accepted bounded EA-C1/0.1.3 retained unchanged |

This report paraphrases short findings and links sources. It does not reproduce library code, book material, diagrams or complete license texts. Candidate-specific versions, compatibility and recommendations are in [dependency preflight](INFORMATION_ECONOMY_DEPENDENCY_PREFLIGHT.md).

## Candidate license record

Primary registry metadata is attributable to the project maintainer; an inspected moving-branch license is supporting evidence about the project, **not** proof of the exact contents of an unacquired wheel/source distribution. Release-matched notices and all transitive licenses must be checked before later copying/adoption. Missing exact files hold only the candidate that needs them.

| ID / candidate | License and primary source inspected | Proposed reuse category / decision | Obligations or unresolved scope |
| --- | --- | --- | --- |
| D01 — EA-C1/0.1.3 and private repository | [Local provenance](../../../../provenance/encounter-core-c1-0.1.3.json) says no standalone source/root LICENSE located; private incorporation only, no public redistribution permission inferred. | Existing accepted bounded reference; **USE** authority/persistence lessons, no copying beyond existing repository | Preserve owner/source authority and all original acceptance qualifications. Absence of a public license does not block this authorized private documentation inspection; public redistribution remains unauthorized. |
| D02 — W3C PROV-DM Recommendation 2013-04-30 | [Specification](https://www.w3.org/TR/2013/REC-prov-dm-20130430/) links document-use terms. That link currently resolves to [W3C Document License, 2023 version](https://www.w3.org/copyright/document-license-2023/). This is a document license, **not MIT software licensing**. | Concepts only; **BORROW CONCEPT** | If copying document portions later, preserve required original link, copyright and status; review the document license's derivative-material conditions. No W3C compliance or endorsement claimed; no PROV text/schema copied. |
| D03 — `prov` 3.2.3 | MIT per [release registry metadata](https://pypi.org/project/prov/); [project LICENSE on moving main](https://github.com/trungdong/prov/blob/main/LICENSE), copyright Trung Dong Huynh / University of Southampton. Exact 3.2.3-tag license retrieval failed. | Candidate development-only export; **OPTIONAL / HOLD** | MIT requires copyright/permission notice in copies or substantial portions. Release-matched text/metadata and selected extras remain a local adoption hold. No RDF/XML/Graphviz dependency license is cleared here. |
| D04 — `networkx` 3.7 | BSD-3-Clause; [exact release-tag license](https://raw.githubusercontent.com/networkx/networkx/networkx-3.7/LICENSE.txt), copyright NetworkX developers | Candidate diagnostic/derived graph dependency; **OPTIONAL / HOLD** | Retain copyright/conditions/disclaimer in source and binary distribution documentation; no endorsement using project/contributor names. Optional scientific/rendering stack requires its own ledger if chosen. |
| D05 — `transitions` 0.9.3 | MIT; [exact-tag LICENSE](https://github.com/pytransitions/transitions/blob/0.9.3/LICENSE), Tal Yarkoni / Alexander Neumann | Candidate Level 2 helper; **OPTIONAL / HOLD** | Preserve MIT notices if distributed/copied. Its `six` requirement and optional graph/testing stack are separate components whose exact versions/licenses are not cleared by the parent MIT license. |
| D06 — `python-statemachine` 3.2.1 | MIT; [exact-tag LICENSE](https://raw.githubusercontent.com/fgmacedo/python-statemachine/v3.2.1/LICENSE), Fernando Macedo | Alternative workflow helper; **OPTIONAL / HOLD** | Preserve MIT copyright/permission notices. Diagram/YAML/validation extras are not approved and need separate notices/closure review. |
| D07 — `rule-engine` 5.1.0 | BSD-3-Clause per [registry](https://pypi.org/project/rule-engine/); [project LICENSE on moving master](https://github.com/zeroSteiner/rule-engine/blob/master/LICENSE), Spencer McIntyre. Exact v5.1.0 license fetch failed. | Candidate expression evaluator; **OPTIONAL / HOLD** | Retain BSD source/binary notices and non-endorsement condition. Release file, vendored portions and dateutil/transitive obligations require exact-artifact inspection before adoption. |
| D08 — `prete` 2.5.3.1 / pRETE | MIT per [registry](https://pypi.org/project/prete/); [moving main LICENSE](https://github.com/stefano-bragaglia/pRETE/blob/main/LICENSE), Stefano Bragaglia | RETE comparison candidate; **OPTIONAL / HOLD** | Preserve MIT notices upon code reuse. Exact release/license correspondence is unverified. The cited RETE papers do not license their text/figures or imply that their reference implementations may be copied. |
| D09 — `durable-rules` 2.0.28 | MIT per [registry](https://pypi.org/project/durable-rules/); [project LICENSE on moving master](https://github.com/jruizgit/rules/blob/master/LICENSE), Jesus Ruiz | Rejected code/runtime candidate; **REJECT** | No code reused; no distribution obligations incurred by inspection. MIT would require notices if later copied; present rejection is maintenance/fit driven, not a copyleft incompatibility claim. |
| D10 — `pyrete` 0.2.0 | **Unknown / not established**: [primary registry](https://pypi.org/project/pyrete/) has no license declaration or project description. Do not confuse with D08. | Rejected candidate; **REJECT** | No copying/adaptation/distribution allowed on this evidence. Unknown licensing is a **blocker for this candidate's code reuse**, not for the overall preflight or independently studied RETE concepts. |
| D11 — `ltms` 0.1.0 / pisanuw/ltms | MIT per [registry](https://pypi.org/project/ltms/) and [moving main LICENSE](https://github.com/pisanuw/ltms/blob/main/LICENSE), pisanuw. Project attributes algorithms to Forbus/de Kleer and distinguishes its reimplementation from book/reference material. | **BORROW CONCEPT**; implementation on hold, no source reuse | MIT notices apply to library code if later adopted. Inspect exact release NOTICE as well as LICENSE. Free access to the book/reference material does not establish permission to copy it; no such material is copied here. |
| D12 — `eventsourcing` 9.5.6 | [Registry](https://pypi.org/project/eventsourcing/) says BSD; [project LICENSE on moving main](https://github.com/pyeventsourcing/eventsourcing/blob/main/LICENSE) specifies **BSD-3-Clause**, John Bywater. Exact 9.5.6-tag text not retrieved. | Replacement/additional canonical store rejected; **REJECT** | No code reused. BSD notices/non-endorsement apply if reconsidered. The generic BSD registry label alone was not treated as sufficient to choose a clause variant. Exact release closure remains unverified. |

## Research-only sources

| Source examined | Reuse treatment |
| --- | --- |
| [Forbus, Logic-based Truth Maintenance Systems, EECS344 Winter 2008](https://users.cs.northwestern.edu/~forbus/c44/Lectures/ltms.pdf) | Concept study and attribution only; no software license inferred from public access, no slides/figures/code copied. |
| [Generative Agents, arXiv:2304.03442v2, 2023-08-06](https://arxiv.org/html/2304.03442v2) | Research findings paraphrased with attribution only. The page states arXiv perpetual non-exclusive license, which is not blanket permission to reuse project code or figures. No implementation is adopted. |
| [ODNI ICD203, official analytic standards PDF](https://www.dni.gov/files/documents/ICD/ICD-203.pdf) | Limited conceptual comparison with attribution; no legal advice, institutional rules or thresholds installed. No software/code license decision arises. |
| Ensemble/CiF, FAtiMA, VelvetRP, AI Town | Named research families in supplied draft only; no code acquired or license evaluated. Further study is a later specialist task if authorized. |

## Obligation and incompatibility disposition

No license incompatibility requiring a repository change was found in the inspected MIT/BSD candidate declarations; that is a **preliminary compatibility inference**, not clearance of an uninspected release/transitive closure. No dependency is necessary to proceed with architecture. Keep the smallest future closure and maintain separate records for runtime, development and test components.

Before any code copy/adaptation or dependency adoption, require the exact artifact/hash, exact LICENSE/NOTICE and vendored/transitive components, intended distribution category and retained notices. Record future decisions separately from these recommendations. Reject unknown-license components instead of treating owner silence or a useful idea as permission. The private baseline's missing standalone license is not remedied by adding permissively licensed libraries.

**Gate P0 disposition:** zero third-party code/dependencies introduced; no overall license blocker for this documentation preflight. D10 is blocked for code reuse and rejected. Incomplete exact-artifact/transitive evidence for all optional candidates is candidate-local HOLD; it becomes an implementation blocker only if a later approved design actually requires that candidate.
