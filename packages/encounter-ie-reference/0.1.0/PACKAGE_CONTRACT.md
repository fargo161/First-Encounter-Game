# EA-IE/0.1 bounded reference â€” M0 local contract

Frozen before the first new world. Private native proof contract, not a shared
schema. Owner Gate A candidate SHA256 30d8e8ce154f498f8bc523315eee12cb74923e2182a46bd34a057568c47a751f;
proposal d0e4585f2ad2f3ca05c5a012ff8d7465736fd977259fabc4b4af9474907a849a.
STOP for Gate B. No inherited acceptance, migration, live gameplay or integration.

## APIs and envelopes

`from eaie import Core, Rejected, Unavailable`; `Core.create(absolute_new_db,
limits=None, fixture='reference')`; `Core(path, limits=None, expected=None,
fixture='reference')`; no overwrite. Windows fixed local disk, explicit SQLite
win32/DELETE/EXTRA/UTF-8. Source, fixture, policy and profile pinned by root.
`prepare(operation, kind, params=None, target=None, ref=None, mode='internal',
incarnation='e1', result_id=None)` captures a complete private state witness.
`preview(request)` returns the deterministic result. `admit(request,
supplied=None, caller=None, lookup=False, hook=None, publication_hook=None,
backend_fault=None)` captures inputs before hooks and returns native O1 material,
O2 no material, O3 exact prior retry, O4 proved refusal, O5 unavailable/uncertain.
Exact retry precedes witness staleness; changed request/result is IDENTITY_CONFLICT.
`snapshot()` gives immutable verified head/ordinal/state/stores/census;
`reconcile()` verifies all mandatory history before clearing uncertainty;
`checkpoint()` installs optional derived acceleration only. `qualified/resolve`
retain C1 fixture binding semantics. `configuration()` reports actual backend.
`holder_view(actor, cutoff=None, after=0, limit=4, handle=None)` gives acquired
pages or eligible handle/support lookup. Unknown/missing/denied share the exact
`{'status':'unavailable'}` form. `inspect(query='current', operation=None,
request=None, cutoff=None)` is privileged read-only diagnostics including failed
guards. Cutoff is trusted admission ordinal; it is omitted from actor output.

Closed request keys: key,mode,kind,params,target,reference,witness,owner,policy,
profile,result_id. key: world,lineage,producer,incarnation,operation. witness:
head,query,state; query is `complete-state/1`. Result: id,request,status,effects,
occurrences,dependencies,disclosures. Entry: seq,generation,previous,head,request,
result,receipt,state. Receipt: key,ordinal,head,status,result_id. Meta:
seq,head,generation. Root: version,contracts,source,backend,fixtures,authority,
profile,initial. Four SQL tables only: root/history/meta/checkpoints, retaining
the C1 column definitions. Every native semantic record is a closed dictionary.

## Root fixture and native state

The unchanged copied R0/S/T/U/BX/S2/RX literal bytes retain qualified fixture
identity only. New authored world and lineage are `EA-IE-reference` and
`EA-IE-lineage-1`. Trusted caller is test-producer/e1 (e2 also allowed). L0 state
families,identity,lineage,clock,protection,profile,proof,binding_plan is derived
from C1; added `information`, `organization`, `reference_effects`. No source C1
world is read or changed. Information fields: actors,containers,items,versions,
receipts,transmissions,derivations,qualifications,stances,access. Organization:
organizations,grants,cases,tasks,decisions. Lists retain all historical records.
IDs are operation-key SHA256 plus typed local position. Canonical hash domains
are JSON dictionaries headed by `domain`; content hashes never convey truth.
Actual causal parents must precede child `(seq,pos)`. Query handles are holder
local `h1,h2,...`; they never encode head/version/other-holder receipt counts.

Actors alice,observer,dispatcher,handler,outsider,player; orgs tiny,receiver,
other,spare. Player has no stance operation. Containers alice-file (alice),
receiver-inbox (receiver), other-inbox (other), archive (tiny). Root authority
facts grant alice tiny functions and disclosure to receiver/other; dispatcher
receiver intake/route/assign; handler receiver analyze/decide/close/effect;
outsider other functions. Dispatcher and handler have receiver-inbox read;
alice alice-file/archive read; outsider other-inbox read. Container custody
never gives an actor a content receipt. `fixture='tiny'` gives alice all tiny
functions plus receiver functions/read as an explicit alternate fixture.
`fixture='compartment'` uses the reference grants. `fixture='A'..'L'` selects
the same bounded native vocabulary with a distinct root fixture label. No
general arbitrary fixture/policy callback is supported.

## Operation grammar (closed params)

Retained native contribute/restore/schedule/cancel/fulfill/unload/reload/remap/
rebind/tombstone/pin/unpin/declare_dependency have exactly C1 params and meaning.
`advance` is retained only as root-controlled alias of `AdvanceTime` (`{to}`).
`AdvanceTime` permits to<=1000000 and <=8 due jobs; root trusted producer only.

* AssertClaim: actor,body,subject,value,source_assertion,valid_until,corrects.
  body<=512 UTF-8; value is TRUE/FALSE/UNKNOWN assertion, not world truth;
  subject is `{kind:'actual',entity:<root entity>}` or
  `{kind:'alleged',scope:<actor>,label:<text>}`. source_assertion is text;
  valid_until null or tick; corrects null or an already acquired version handle.
* Observe: actor,body,subject,value,source_assertion,valid_until,corrects.
  Same grammar; requires observer actor and actual root entity subject.
* Deliver: actor,source,body,targets,source_assertion,disclose_origin.
  source is actor-local acquired handle; body must be exact substring of its
  acquired fragment; targets list `{kind:'actor'|'container',id:<native ID>}`;
  <=4, no duplicates. Source assertion need not be true. disclose_origin bool
  controls eligible known origin, never actual origin. Container delivery
  requires independently authored destination intake and sender disclosure.
* Refer: Deliver fields plus organization,create_case,dispatcher. create_case
  bool. Delivery-only uses dispatcher null. Combined requires receiver workflow
  authority, existing exact destination container target, explicit dispatcher
  existence notice counted as target; no receiver lifecycle grant inheritance.
* AcquireRecord: actor,notice. notice actor-local existence handle from assignment
  or intake; present separately authored read grant required; creates content
  receipt for exact receiver-held fragment, never original full-file expansion.
* SetRecordAccess: actor,holder,container,allow. actor must be container authority;
  holder actor, allow bool. Revocation does not remove historical receipts.
* Derive: actor,rule,alternatives,body,subject,value. rule `identity-v1` or
  `all-true-v1`; alternatives <=3 sets of <=4 earlier actor-local content handles.
  Pure rule evaluates acquired values only; depth<=8; no same-unit premises.
* QualifySupport: actor,target,basis,kind. target and basis acquired content
  handles; kind withdrawal/correction/challenge/expiry. UNKNOWN challenge;
  withdrawal/correction FALSE; expiry FALSE only at explicit current expiry.
* DeclareStance: actor,source,stance. stance accept/reject/uncertain; exact acquired
  basis; never implicit and disallowed for player.
* OpenCase: actor,organization,source,dispatcher. source exact container receipt
  native ID; dispatcher actor or null. Requires receiver workflow authority;
  optional notice is actual receipt. Initial case/task state queued.
* RouteTask: actor,task,priority,due. scoped route grant, priority integer -9..9,
  due null or tick; original enqueue point never changes.
* AssignTask: actor,task,assignee. current assign grant; exactly one existence
  notice, no content/read grant. Assignment moves queued to assigned.
* TransitionCase: actor,case,state,evidence. state in_review/closed or
  queued for reopen; evidence acquired content handle. Uses scoped functions,
  legal edges queued->assigned->in_review->decision_recorded->closed; reopen closed->queued
  requires a new later receipt and creates a new linked task, retains old task.
* RecordDecision: actor,case,evidence,policy,reason. policy `reference-true-v1`,
  pure acquired value==TRUE; reason bounded text; in_review->decision_recorded. Decision
  records exact evidence, root-pinned policy, current function grant and cause.
* ApplyReferenceEffect: actor,decision. separate L0 grant; fixed referenceEffectSlot,
  exactly +1 Env.ReferenceCounter, retained (decision,slot) credit. New operation
  cannot reuse credit; exact original retry returns original native receipt.

Information version fields: id,root,body,subject,value,source_assertion,valid_until,
corrects,creator,origin,seq,pos,parents. Receipt: id,holder_kind,holder,version,body,
value,kind,record,source_receipt,known_origin,source_assertion,seq,pos,handle,parents.
Transmissions: id,actor,source,receipts,seq,pos,parents. Derivation: id,actor,version,
rule,alternatives,depth,seq,pos,parents. Qualification: actor,target,basis,kind,seq.
Stance: actor,source,stance,seq. Case: id,organization,source,state,task,opened,
last_evidence,reason; task: id,case,assignee,state,priority,due,enqueued,previous;
decision: id,case,actor,evidence,policy,reason,seq. Access: holder,container,allow,
seq. Effect credit: decision,slot,operation,seq. Grants are root-owned finite data.

## Limits, work, corruption and seams

64 operations,16 actors,4 organizations,32 roots,64 versions,128 receipts,
64 transmissions,32 derivations,128 premise edges,16 cases,32 tasks,4 targets,
8 queue updates,8 accelerators,8 due jobs. Intent8192/request163840/state131072/
prefix8388608/query65536 bytes. JSON depth24/object128/array256/nodes32768/
string4096 UTF-8; integer +/-9007199254740991; duplicate keys, float, nonfinite,
opaque/async refused. Predecode string/escape-aware lexical scan bounds tokens
and depth before json.loads. Policies <=32 nodes/depth8, typed whitelist only.
Memory268435456/workspace1073741824; admission/checkpoint40000000 and
cold/retry/query20000000. All are conjunctive immutable profile maxima.
Each charged byte pass, node/edge/record visit, policy term, key construction and
full-key n*ceil(log2(n+1))*max-key-byte sort cost is counted. Prospective actual
writer-transaction scratch cold replay precedes COMMIT and verifies head/state;
future retry and current/historical page/support/existence recipes are reserved.
Post-SQL allocated page geometry and actual physical files/free disk checked.
Refuse before publication if any future promised phase cannot fit. Every cold
read rederives all mandatory entries. Optional invalid checkpoints are ignored
and charged; malformed/absent root/prefix/meta never repaired or ignored.

Controlled hooks are developer tests only: validate/resolve/final/due receive
immutable captured inputs; reentrant writes poison outer admission; async hook
refused. publication hooks before_write,before_commit,commit_enter,after_commit
allow own-disposable-process interruption. Exception at/after commit_enter sets
uncertain; reconciliation and exact retry required. Backend faults full,
readonly,commit-kill only own disposable DB. No hostile Python sandbox claim.

## M0 qualification recipes

Canonical A–L mapping: A unseen root-authored synthetic loss; B sincere mistaken
accusation of known innocent alice; C deliberate false allegation with actual
creation but no fabricated theft actuality; D common source; E returned rumor;
F correction/history; G possession/access/existence/revocation; H compartment
workflow; I cross-organization referral; J one-person organization; K separated
access/membership; L explicit support. Root actual event incident-1 records
culprit P and innocent alice, token count2->1. The finite LOSS_OBSERVATION recipe
reveals only discrepancy and no culprit. Actual native eligible referents are
fixture-issued D/P/alice/observer/incident-1/self; D2/Q remain unavailable to
new L1 authoring. Actors/containers/orgs/events are added to the SAME L0 identity
registry; information.actors is only an index. Player AssertClaim/Derive and
DeclareStance refuse; Player may receive and inspect acquired content.

Pinned nominal16 sequence: AssertClaim alice; Refer combined to receiver-inbox
plus dispatcher notice; AssignTask to handler; handler AcquireRecord; enter
in_review; RecordDecision; ApplyReferenceEffect; close; AssertClaim alice new
correction; Deliver new content directly to handler; reopen using that fresh
actually received evidence and prior original-case acquisition; AssignTask;
AcquireRecord from new assignment notice (old case slice remains exact);
enter in_review using explicitly linked new evidence; RecordDecision;
AdvanceTime. Reopen retains the old closed task, creates a new queued task,
and records the selected fresh evidence association. Expected count16 and
ReferenceCounter1,2decisions,2tasks,prior task closed. All writers/tests use
disposable copies and external output. Builder tests are not independent
verdicts. Gate B remains pending.

M0 amendments before first world: five workflow states; admission_seq root counter; actual root incident and finite observation recipes; holder eligible referents; Player authoring guard; actual original-case acquisition plus explicit reassessment evidence association; corrected canonical A–L and16 recipes.

## Implementation qualification clarifications after initial worlds

The pre-world M0 amended contract hash was
8494280325c609866f22184619079a51687dad3542d4276e7db40ea12285d91c.
The initial documentary draft was reviewed and amended before any world, as
recorded above. Subsequent runtime defect fixes preserve the approved meanings:
normalize immutable captured witness lists for exact equality; revalidate the
finite blocked observation against current actual context; ignore invalid
optional checkpoint syntax with exact raw-byte charge; meter complete root
creation/checkpoint phases; and avoid a duplicate prior-prefix replay inside
the writer by checking the bounded old meta boundary followed by the mandatory
complete actual prospective-prefix scratch replay in the same transaction.
The latter validates every prior row/source/state/head and full current witness;
it is not an older-head fallback. In-memory detached copying now recursively
validates and constructs plain JSON values directly; unnecessary JSON encode and
lexical parse passes were removed. Persisted raw JSON still uses strict lexical
decode. Actual remaining passes, full-key sorts and visits remain charged.
No profile limit or owner semantic changed.
Derivation alternatives must each justify the selected conclusion under the
pinned rule; identity-v1 has one premise per alternative. Later support is the
separate three-valued OR-of-AND eligibility calculation. Actor handle lookup of
a known record notice requires current access, while the already acquired notice
remains in historical/current acquired-receipt pages after revocation.

Further in-scope qualification fixes: byte-size-only guards use an exact size
walk without sorting keys (key order cannot alter canonical encoded length);
the prefix census uses actual validated SQL payload byte totals. Private entry
assembly reuses already detached private reducer outputs, then freezes them for
external exposure. The native actor cap counts ALL L0 actors including P/Q.
Full snapshot output and sealing are exercised prospectively and reserved with
bounded census allowance; actual retry capture/result/key/receipt comparisons
are exercised under20M, and the actual retry path enforces that phase cap.
The initial pre-world M0 hash remains preserved above; these amendments document
qualification repairs rather than a new owner-level operation or capacity.

IJ05 qualification sweep adds explicit closure node/edge/inventory visits,
canonical sort-walk and freeze visits, finite fixture byte passes, native binding,
obligation, retention, identity, L1/L2 lookup and record scans. Short-circuit scans
reserve their complete bounded collection length. All existing costs stay charged.
Actor support pages share one256-node/512-edge/depth8 budget and a local derived
cache; truncation stops before an over-budget expansion and stays incomplete.
IT06 feasibility repair executes every promised holder page window (up to4),
eligible handle/support lookup, boundary/census and receipt query at every retained
cutoff BEFORE COMMIT, checking actual encoded replies and cold-plus-query work.
These prospective recipes are themselves charged to admission/checkpoint work.
A lowered query-byte profile may refuse root creation if even its census cannot
fit, and refuses prospective unreadable pages before acknowledgment.
Finite fixture I isolates receiver authorization: observer may disclose to receiver
but is denied intake; outsider is allowed intake but denied disclosure; alice stays
positive. This is pinned fixture data only, not an arbitrary policy-loading API.

Final IJ05 consolidation charges typed causal edges, due-job/native terms,
AND/OR support evaluation, derivation alternative/premise evaluation, holder
origin/handle scans, author/history lookup and finite authored fixture parsing.
The model counts defined byte passes, semantic record/node/edge visits, finite
predicate terms and full-key sort bounds. It does not count arbitrary Python
instructions, allocator behavior, OS scheduling or CPU cycles. Short-circuit
scans reserve the full bounded collection; source/root/profile pin this exact
work recipe. Measurements remain a separate qualification obligation.

IT07 restores safe O5/unverified_snapshot for a structurally uninitialized Snapshot before reading its phase limits; valid snapshot verification remains charged inside the query phase.

IJ06 also contains malformed attributes/types during complete detached diagnostic verification, including a Core-issued shell whose head was removed by trusted Python tampering. This is defensive read-only robustness, not a hostile Python boundary claim.

IT08 enforces the selected root initial state_bytes limit before create publication and during load. H01 reads optional accelerator bytes without trusting SQLite TEXT decoding, charges raw bytes and ignores bounded invalid storage types/UTF-8 under the existing optional-only policy; mandatory root/history decoding remains strict.

IJ07 checks remaining work against plain-validation consumed-byte upper bound before whole-object json.dumps; actual serialized bytes are charged once afterward. Exact encoded-size walks charge punctuation/key/scalar byte fragments incrementally instead of constructing a whole unbudgeted aggregate; generic scalar quote fragments remain bounded by4096 UTF-8 input bytes. This models bounded stage granularity, not Python instructions.

IJ03 final create-phase closure includes initial profile capture: enter default40M bootstrap meter, validate/capture profile, tighten that same meter to the selected limit and refuse if already spent work exceeds it. Complete root-creation measured work includes this capture and propagates to an enclosing diagnostic meter.

IJ08 captures the exact native acknowledgement receipt and the one immutable publication-hook entry before BEGIN/publication. Successful COMMIT reuses these prepared values and performs no package-owned charged JSON capture afterward; tight admission budgets therefore refuse before publication. Actual backend or controlled after-commit callback faults still require reconciliation. The admission_work census field is a replay estimate (2*cold), not a certified complete admission bound; last_work records actual complete phase cost, and the selected40M meter enforces it.

BH02 qualification repair propagates each actual nested charge immediately to every enclosing phase, including failed replay/query stages. Nested pre-stage reserves check all enclosing remaining budgets. Successful-only aggregation is removed, so each actual unit is counted once within each enclosing phase; failed stages cannot hide work or defer enforcement of the outer limit.

IT09 separates exact encoded request limits from conservative validation work and serialization reserves. Exact container punctuation governs the selected encoded-byte guard; existing conservative validation charges and pre-dump separator reserve remain unchanged. Requests exactly at the selected full-request byte limit are not rejected because of the conservative reserve.

IJ09 precharges the stat-known source read/hash and fixture read/hash/decode byte bounds before reading each file, then checks the observed byte length against that size. The same byte cost formula remains charged once; an insufficient enclosing budget prevents the bulk file read rather than refusing after it.

IJ09 consolidated conversion review reserves the raw-text UTF-8 upper bound before encoding and precharges the known raw-byte bound before decoding, checking every enclosing phase. Byte input reuses its original bytes rather than encoding them again. Raw text encoding and raw byte decoding each charge their explicit materialization pass separately from the existing lexical scan and JSON decode. Digest separately precharges the known canonical ASCII encoding and hash byte passes. Size-only callers use the same ASCII string length without allocating redundant bytes. Scalar capture rejects character counts above4096 before UTF-8 conversion. Profile limits remain unchanged; actual newly covered pass costs are included, and stage reservations can conservatively refuse before performing an infeasible bulk conversion.
