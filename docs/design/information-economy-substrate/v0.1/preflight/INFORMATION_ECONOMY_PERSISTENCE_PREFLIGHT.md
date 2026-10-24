# Information Economy persistence preflight

Date: 2026-10-23, America/New_York. Status: PREFLIGHT ONLY; exact observed persistence contracts and future design requirements. No information-substrate schema, canonical database, migration, conversion, adapter, persistent sidecar or write spike was created. Existing baseline tests use disposable databases outside the checkout, as recorded in the safety evidence. Roles C/G. Source IDs refer to the [context index](INFORMATION_ECONOMY_CONTEXT_INDEX.md).

## Finding

SQLite is already the accepted C1 proof's persistence mechanism, but its exact four-table inventory, authored root, source identity, policy and replay checks preclude simply adding information tables or appending foreign event types. SQLite's technical capability to hold data is not an accepted shared persistence extension. A future information implementation needs a separately approved bounded root/contract/proof; the accepted source and existing saves stay intact. E06–E12.

## Observed EA-C1/0.1.3 contract

Evidence: [core.py](../../../../../packages/encounter-core-c1/0.1.3/eac1/core.py) `TABLES:24`, `create:116`, `_load:197`, `admit:290`, `_publish:334`, `checkpoint:364`; [data.py](../../../../../packages/encounter-core-c1/0.1.3/eac1/data.py) `plain:23`, `canonical:46`, `authored:92`; [policies.py](../../../../../packages/encounter-core-c1/0.1.3/eac1/policies.py) `calculate:28`.

| Aspect | Implemented exact scope | Consequence for Information preflight |
| --- | --- | --- |
| Physical inventory | `root(id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL)`; `history(seq INTEGER PRIMARY KEY, opkey TEXT UNIQUE NOT NULL, payload TEXT NOT NULL)`; `meta(id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL)`; `checkpoints(generation INTEGER PRIMARY KEY, payload TEXT NOT NULL)` | `_load` requires exactly these table names, forbids triggers/views and requires SQLite quick_check. Adding claim/workflow tables to this DB is rejected rather than a supported migration |
| Root | Root payload includes version `EA-C1/0.1.3`, contracts `R1+R1a-owner-Q1-Q5`, exact source digest, selected backend labels, seven fixture hashes, authority, profile and authored initial state | Cold load requires equality to freshly computed `root_payload(profile)`. Source/policy/root changes are not transparently compatible with an existing world. No upgrade/downgrade path is implemented |
| Authoritative history | History payload contains `seq,generation,previous,head,request,result,receipt,state`; opkey is canonical full operation key | Complete ordered rows are mandatory mode-A evidence. Current state is rederived, not trusted merely because a stored snapshot exists |
| Meta | Exact `seq,head,generation`, with singleton cardinality and bounded relation to history/checkpoint capacity | A current head cannot be silently rolled back to an older readable prefix after required-proof loss. An external expected `{seq,head}` can enforce an acknowledged boundary |
| State | Authored identity/artifacts/bindings, Env family, lineage/events, logical clock/obligations, protection graph/pins, profile/proof/binding plan | No generic claim/record/access/inference/organization state exists. New fields require approved semantics, capacity accounting and replay policy |
| Publication | BEGIN IMMEDIATE; reload old meta; insert history/update meta; prospective allocated-page/workspace capacity check; COMMIT; then acknowledge | A delivery and its admitted receipt/effects need one approved atomic path. No independent workflow DB or external event library is given authority to commit canonical effects |
| Uncertainty | Possible post-COMMIT uncertainty sets reconciliation-required; same Core refuses writes until verified reconciliation | Retry must discover the original outcome, not replay a second transmission/assignment. Cross-system exactly-once/distributed delivery is absent |
| Retry scope | Key `{world,lineage,producer,incarnation,operation}`, producer-scoped result identity; exact prior request and any supplied result return O3 original receipt | Proposed social operations must define comparable exact identity semantics under the selected future contract. Content-equivalent rumors are not necessarily the same operation; subject grouping differs from retry deduplication |
| Checkpoint | Optional accelerator `{seq,head,state}` keyed by publication generation; no semantic sequence/head change | Cold state always derives from root/full history. C1 checks accelerator equality to that derived state and labels invalid accelerators ignored; checkpointing is not compaction or proof deletion |
| Bounds | Default ≤64 operations, ≤8 checkpoints, ≤8 due jobs, logical bytes 8 MiB, memory bound 256 MiB, workspace 1 GiB, bounded work/query bytes; caller may only lower finite default limits | Adding data changes encoded full-prefix/replay costs. These values qualify one proof fixture; they are neither information capacity requirements nor universal supported population sizes |

### Hash and serialization domains

These domains must remain separate; none is a truth/access/acceptance certificate.

- `data.canonical(v)` is Python JSON of validated JSON-only values with sorted keys, compact separators, `ensure_ascii=True`, no floats/opaque/async values and integer range ±(2^53−1). `digest(v)` is SHA-256 over its encoded canonical string. Exact JSON storage text is checked on load; do not conflate it with raw fixture bytes or another project's canonical JSON.
- Source identity is SHA-256 of compact sorted ASCII JSON mapping the **six eac1 Python basenames** to each file's raw SHA-256. Accepted Core digest: `194e86dbc636222384e0bfed8a9d2aa6981c172689b96ce27bb66be86baf585d`. It is not a Git tree, whole-package digest, archive hash or B0 source identity.
- Root head hashes `root_payload(profile)`. The recorded authored default root head is `ade8567d0e219fdaac791a4d6f83362338b019ee6e30953a00c1833a5e6cf233`; it is not the accepted source ZIP identity.
- Each semantic head is `digest({previous,seq,request,result,state})`; result carries a request digest; event IDs derive from operation-key digest plus event position. Receipt includes operation key, ordinal, head, status and result ID. Do not expose these privileged correlations as audience handles.
- Seven fixture hashes cover the exact original UTF-8/LF raw fixture texts. Runtime decoded objects use the separate canonical-JSON domain. Epoch, binding revision and native artifact digest are distinct identity/version axes.

E08/E09 identify these domains; [B0 hash registry](../../../encounter-core/c21-b0/v0.1.2/contracts/HASH_PREIMAGE_REGISTRY.json) defines a different **design-only** `J`/`Htag` domain: `ASCII("ea-c21/1/")+tag+00+J(value)`, with no trailing LF, and a separate six-relative-path source map. Its G9/row/family/storage/semantic hashes are not C1 hashes. No converter is selected.

### Logical time, causality and read purity

C1 has integer logical `clock.now`; `advance(to)` validates nondecreasing target time within its fixture range, sorts due obligations by `(due,ordinal)`, settles them and then installs the new clock. Events distinguish `effective` from `publication_time`; operation sequence and checkpoint generation are separate. Future information must additionally distinguish event validity time, communication, receipt, inference and later identity discovery as KeyWrapping P16 requires. A late report of yesterday's event cannot create yesterday's acquisition. Wall-clock expiry, graph-library callbacks and retrieval reads cannot create hidden simulation events.

Snapshots are detached/frozen, issued only after verification. C1 Atlas reads these snapshots without writer access. Full history, source identity and census diagnostics are privileged; the fixture's diagnostic `public` audience is not a general permission to expose them to actors. A future audience cache needs holder/world snapshot/knowledge cutoff/policy scope without leaking hidden revision activity. E09; E16 P07–P14/P16–P17.

## Loss and checkpoint contracts must not be merged

| Evidence scope | Required proof and tolerated loss | What is not established |
| --- | --- | --- |
| **Accepted implemented C1 mode A** | Mandatory authorized root/meta/full chronological request-result-state-receipt prefix and exact derivation/index/head checks. Checkpoint table must exist; accelerator payloads are optional for state establishment and invalid accelerators are ignored after bounded loading. Missing required data, malformed canonical history or derivation mismatch makes verification unavailable | No destructive collector, mode-B loader, generic archival restore, loss-tolerant replacement history, automatic repair or infinite retention. Without an external acknowledged anchor, a fully self-consistent alternate history is not universally detectable as forged |
| **C1 proof fidelity** | `atlas.py` exposes typed history; optional meaning-only source M cannot produce an exact quote. Optional exact source Z requires an explicit observed retrieval bundle. Actual mode-A records remain essential independently of optional graph eligibility | No recovery of unretained dialogue, precise unknown source or microscopic details from a semantic summary. Offline optional source is not proof of a nonexistent event, forgotten receipt or lost gameplay effect |
| **Reviewed B0 v0.1.2 proposal** | Checkpoint contract permits physical absence of only whole G9 `proofs` rows keyed `["checkpoint-payload",id]`, at most two eligible rows, while descriptors, all mandatory G1–G8 and other G9, original G8 manifests/prefix/anchors survive. Exact reconstruction is verification-only scratch/overlay from original prefix; all original current heads/hashes remain; missing physical rows stay absent | This is not C1 runtime behavior and has no executed B1 proof. Present-corrupt/malformed/null/wrong-key optional payload is O5, not eligible absence. Descriptor/prefix/policy/registry/index/G8 loss is O5. No canonical repair, fallback old head or cap increase |

The B0 contract's exact row-loss rule, retained commitments and independent acknowledged anchors must remain explicit if a later candidate adopts/revises it. C1's ignored-invalid accelerator policy must not be reported as B0-compatible corruption tolerance, and B0's scratch reconstruction must not be claimed as implemented C1 recovery. E09/E11/E12.

## Persistent versus derived candidate data

The following is a **design-work checklist**, not an adopted schema. A datum that changes continuation, eligibility, actor information, authority or future consequences cannot be dismissed as a cache merely because a library can serialize it. Conversely, copying all canonical history into each actor's memory is neither necessary nor acceptable by default. E07/E16/E20/E21.

| Candidate semantic responsibility | Persistent basis needed if selected | Rebuildable projection candidates / open choice |
| --- | --- | --- |
| Actual observation/acquisition/transmission | Actual participant, exact received fragment/content version, source/cause, logical receipt point and operation/retry identity | Holder index/search view may derive from retained receipts. Exact acquisition format must reconcile with KeyWrapping and chosen Core target |
| Claim/account/version | Attributed content/alleged subject, authorship/creation or correction, prior version basis where behavior depends on it; no mandatory true-event link | Current claim list/contradiction grouping may derive. Preserve economic F5 specialization without creating duplicate truth |
| Provenance and inference | Actual lineage separate from source assertions; selected rule/version, eligible premises and inference point when admitted | Graph traversal, SCC/cycle checks, common-origin sets and support-status views can derive if complete necessary support remains. Cached library graph never owns origin truth |
| Access and possession | Consequential explicit grants/revocations/custody or policies and their exact validity basis | Effective permission queries may derive; acquired receipt persists separately. Revocation/destruction is not unlearning |
| NPC stance / support loss | If selected, explicit modeled stance revisions and causally relevant belief changes | Candidate ranking/support explanations may derive; no universal confidence formula or automatic retraction selected. Do not store invented unexpressed Player beliefs |
| Organizational queue/case/referral | Consequential intake/assignment/decision/authority/actual transmitted referral and closure/reassessment points | Current queue/priority/workload views can derive where scheduling basis and tie order survive. Workflow serialized state must not be a second canonical engine |
| Index/cache/export | No new authority solely for a graph/index/cache | Rebuild from admitted basis with holder/snapshot/cutoff/policy scope and deterministic order; discard/rebuild must change no world or acquired history |

## Migration, rollback and next design gate

No existing migration is needed or performed for preflight. No general C1 migration framework, legacy save@3↔C1 conversion, C1↔B0 bridge or mixed-version replay is established. Adding schema columns/tables, editing accepted policies, changing source identity or trusting external-library serialized state would cross the currently unapproved implementation boundary.

For a later candidate, recommend an isolated versioned proof lineage with explicit admitted root/profile/policies and a stated relationship to accepted C1; preserve original source/world inputs read-only. This is a recommendation for architecture review, not an installed successor. If conversion is proposed, it must have an explicit supported source/target envelope, loss/precision report, no overwrite, preserved original evidence and independent reload/retry/head tests. Rolling back code is not enough if a newer writer has mutated the only world DB. Preserve original versioned artifacts and decide cross-version behavior before any writer exists.

An eventual proof must independently test commit/close/reopen, exact retry after uncertainty, old knowledge cutoff, false and phantom claims, source correlation, selective referral, grant revocation versus prior receipt, optional projection rebuild, mandatory proof loss, checkpoint corruption/loss under the **selected** contract, capacity refusal before acknowledgment and safe rollback. The accepted process-crash model remains Windows 11/Python 3.12.0/SQLite 3.42.0/win32/DELETE/EXTRA/UTF-8 with retained N01/N02 qualifications; local tool availability alone cannot broaden it. E06/E07/E10.

Implementation dependencies to resolve at the owner architecture gate: selected executor/proof scope; sole installer and root/identity relationship; minimal persistent causal basis; required queries and finite precision/capacity; deterministic admission ordering; exact loss/fidelity contract; privileged saves versus actor exports; and any migration/rollback claim. External libraries may supply derived views or evaluation machinery only within those approved boundaries. Stop at Gate P0.
