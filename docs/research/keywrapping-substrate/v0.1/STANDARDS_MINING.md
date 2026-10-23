# Standards mining and comparison

**Version:** v0.1 · **Date:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT

## Method and limits

Use mature resources to reduce reinvention, then test each borrowed concept against KeyWrapping. A match in terminology is not a match in gameplay semantics. The [source snapshot](SOURCE_SNAPSHOT.md) governs design precedence; the [license ledger](SOURCE_LICENSE_LEDGER.md) governs material reuse. Individual findings below are research conclusions and design proposals, not owner adoption of an external standard.

The four problem-oriented miners cover action/predicate semantics, transactions/authority, knowledge/provenance, and social reasoning. They supply evidence and gaps to synthesis. No external source is an installed dependency and no raw donor corpus is vendored.

## Retain, adapt, reject

| Problem | Donor and evidence | Retain/adapt | Reject as an Encounter default |
| --- | --- | --- | --- |
| English action senses | [VerbNet 3.4 pinned XML](https://github.com/cu-clear/verbnet/tree/ae8e9cfdc2c0d3414b748763612f1a0a34194cc1/verbnet3.4) | Class membership, roles, restrictions and frames as candidate evidence; inspect the actual sense | One lemma = one mechanic; linguistic role restriction = complete game permission rule |
| Frame/sense gaps | [FrameNet project](https://framenet.icsi.berkeley.edu/) and [Framester](https://framester.github.io/) | Supplementary frames and alignment leads with explicit release/license limits | Importing all graphs or treating a mapping edge as proof of exact semantic equivalence |
| Generic action structure | [Schema.org Action](https://schema.org/Action) and [potential actions](https://schema.org/docs/actions.html) | Agent/object/participant/result ideas and separation of potential from completed action | Open web markup as closed game validation, authority or completed performance |
| Social normative relationships | [ODRL model 2.2](https://www.w3.org/TR/2018/REC-odrl-model-20180215/) and [vocabulary 2.2](https://www.w3.org/TR/2018/REC-odrl-vocab-20180215/) | Separate offers, agreements, duties, permissions, prohibitions and constraints | Digital-rights ontology controlling social meaning; automatic conflict winner; flattened atomic rules as compound bargains |
| Incapable or dishonest acceptance | ODRL model §2.6.3 versus KW-CONTEXT §18 | Explicitly distinguish normative commitment, perceived feasibility, actual capability and fulfillment | Importing ODRL duty ability requirement as a universal assent precondition |
| Temporal/conditional exchange | ODRL model §2.7, vocabulary `andSequence`, KW-CONTEXT §§14, 18 | Explicit grouping, dependency and order in Encounter-proposed expressions | Assuming ODRL constraint ordering implements atomic barter or irreversible disclosure rollback |
| Activity/event records | [ActivityStreams 2.0 Core](https://www.w3.org/TR/2017/REC-activitystreams-core-20170523/) and [Vocabulary](https://www.w3.org/TR/2017/REC-activitystreams-vocabulary-20170523/) | Activity identity, actor/object/target/origin/result/instrument comparisons | Addressing as authorization; Undo as erased history or cancellation authority |
| Information origins | [PROV-O](https://www.w3.org/TR/2013/REC-prov-o-20130430/) and [PROV-DM](https://www.w3.org/TR/2013/REC-prov-dm-20130430/) | Attribution, derivation, actual source chains and explicit boundaries around disclosed provenance | Provenance = truth, access rights, firsthand evidence or independent corroboration |
| Social reasoning | [Ensemble](https://github.com/ensemble-engine/ensemble) and [FAtiMA Toolkit](https://github.com/GAIPS/FAtiMA-Toolkit) | Separate authored state/history, rule/evaluation inputs, structured decisions and realization | Full framework dependency, universal persuasion score, generated hidden motives or automatic Player disclosure |
| Structural documentation | [JSON Schema specification family](https://json-schema.org/specification) | 2020-12 vocabulary as a future validation candidate; bounded record families and typed references | Structural validity proving authorization, graph consistency, factual truth or gameplay fun; actual schema files in this pass |

The [action dictionary](ACTION_PREDICATE_MAPPING.md), [transaction mining](TRANSACTION_DONOR_MINING.md), [provenance mining](PROVENANCE_DONOR_MINING.md), and [social-reasoning analysis](SOCIAL_REASONING_DONORS.md) record specific evidence and semantic gaps. Read those before adopting a field or transition.

## C2.1 B0 comparison, without precedence promotion

The existing [C2.1 B0 v0.1.2 overview](../../../design/encounter-core/c21-b0/v0.1.2/README.md) and [reading guide](../../../design/encounter-core/c21-b0/v0.1.2/CONTRACT_READING_GUIDE.md) describe a reviewed proposed technical baseline. They are not an accepted implementation contract and are unchanged by this package.

| Comparison point | Useful consistency check | Limit |
| --- | --- | --- |
| Explicit deliberate communication and captured audience | Preparation is not receipt; a later delivery must not use stale listening rights | No adoption of its proposed wire format or operation ledger |
| Authority/capability separation | A submitted expression cannot acquire world mutation rights by containing an action | KeyWrapping still defines its own social/semantic proposal |
| Observation-scoped information and subjective belief | World occurrence, receipt and interpretation remain distinct | Existing finite fixtures do not exhaust KeyWrapping cases |
| Protected causal history and one semantic installer | Avoid double ownership and overwritten history in a future integration discussion | No installer, backend, migration, checkpoint or second writer added here |
| Finite authored proof and playability gate | Separate documentary analysis from runtime results and gameplay evidence | No B0 acceptance, B1 authorization, C2 promotion or playable-C2 claim |

The experimental BASED sandbox is likewise context, not accepted Core. No sandbox code is imported or fixed in this work. If future integration conflicts with KeyWrapping direction, record the conflict and seek a separately scoped decision rather than silently making either proposal govern the other.

## What remains Encounter-specific

Hard Keywords versus sealed Wrappers; NPC-anchored significance and Player acquisition; actor-local aliases and learned identity links; recursive references without global disclosure; and mechanically meaningful Function + Action + Keyword + Connector + Context + BASED composition remain Encounter design work. External donors help describe these concepts but do not supply their complete behavior.

The proposed technical representation must stay revisable after paper tests. The owner approved producing a specification, not freezing every proposed name, status, rule, threshold or action sense in it.
