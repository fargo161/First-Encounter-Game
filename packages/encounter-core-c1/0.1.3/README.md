# EA-C1/0.1.3 — C1-B01 remediation candidate

Builder candidate for independent review; no product acceptance or next milestone
authorization. This namespace is separate from accepted Encounter M3/AR0/A1.

Windows local fixed disk, Python **3.12.0**, SQLite **3.42.0** as shipped with the
tested Python. Standard library only for the Core and its tests. The chosen
SQLite library/VFS/configuration and exact Core source identity are pinned into
each root; a different build/configuration cannot silently reopen an old DB.
Do not use Python `-O`. No install, npm or pip command is needed for C1.

Run from this extracted directory, with a NEW external output directory:

```powershell
python -B tools/verify.py --out C:\Users\mcdon\Documents\Codex\EA-C1-reproduction
```

This runs the unit/adversarial cases, five real child-process termination
windows with fresh-process recovery, real SQLite FULL/READONLY responses,
bounded-capacity measurements and proof exports. It retains failures and stops;
it does not turn a failed result into a passing summary. The 64-operation
measurement includes allocation tracing and repeated complete-prefix reads and
can take several minutes. All tests are Builder tests, never an independent
Auditor/Tester verdict.

Small runnable path (make the parent directory first):

```powershell
python -B -m eac1 init C:\Users\mcdon\Documents\Codex\EA-C1-demo\world.db
python -B -m eac1 prepare C:\Users\mcdon\Documents\Codex\EA-C1-demo\world.db --operation o1 --q 1 > C:\Users\mcdon\Documents\Codex\EA-C1-demo\request.json
python -B -m eac1 admit C:\Users\mcdon\Documents\Codex\EA-C1-demo\world.db --request C:\Users\mcdon\Documents\Codex\EA-C1-demo\request.json
python -B -m eac1 export C:\Users\mcdon\Documents\Codex\EA-C1-demo\world.db --audience author --query current
```

Repeat `admit` with the exact request to get O3/original receipt without another
effect. CLI exit1 means O4/O5, not a successful world action. `checkpoint` creates
only a derived accelerator; `export` is detached/read-only. The Python API used
by the delivered tests supports the complete bounded operation set beyond this
CLI's q-contribution convenience command.

## Source and API map

* `eac1/data.py`: strict JSON values/deep immutable captures, exact seven fixture
  hashes/decoder and nondestructive graph traversal. Fixture interpretation is
  authored proof content; policy calculation does not branch on story names.
* `eac1/policies.py`: pure environment, obligation and selected identity/pin
  calculations. No SQLite access, social state or hidden host-world writer.
* `eac1/core.py`: authorized root, qualified identity, complete family/head
  witness, result admission/replay, atomic SQLite publication and full mode-A
  reconstruction. `snapshot().stores` exposes all nine authoritative groups.
* `eac1/atlas.py`: deterministic read-only queries of a protected verified
  Snapshot, with explicit audience and observed retrieval bundle.
* `tests/reference.py`: separately written Builder reference arithmetic,
  reachability and cost calculation; it imports no product implementation.
* `tests/test_core.py`: applicable C1 and R1a positive/negative controls. C2-only
  EA-T05 and EA-T21 and all Later work are excluded, not counted as passed.
* `tools/fault_worker.py`: destructive termination of its own disposable process
  only; never point it at accepted data.

`Core.create(path, limits=None)` refuses overwrite and unauthorized root selection.
`Core(path, limits=None, expected={seq,head})` requires the selected profile and
can enforce an independent minimum acknowledged boundary; fixed-schedule
reviewers additionally compare their exact final head. No surviving external
anchor means an internally valid alternate history cannot be called forged.

`qualified(artifact,kind,selector,epoch,revision)` constructs an exact reference.
`resolve(ref,historical=False)` validates it against the verified current state.
`prepare(operation,kind,params,target,ref,mode,incarnation,result_id)` captures full
coarse witnesses. `preview(R)` calculates a result without committing.
`admit(R,V=None,caller=None,lookup=False)` captures original immutable R/V before
validation; exact committed replay precedes current staleness after scope checks.
Explicit e2 requests need matching caller scope. `reconcile()` is required after
uncertain publication on the same Core instance. No external effect executor.

Controlled `hook`, `publication_hook` and `backend_fault` keyword arguments are
test seams. They are not serialized capabilities or arbitrary plugin support.
R1a hook phases are `validate`, `resolve`, `final` and the permitted `due`
coordinator substep. Reentrant writes invalidate the outer admission even when
the hook contains the inner error. Failed protected writes that report no fault
and change no bytes are distinguished from escaping/explicit validator faults.

## Literal-to-runtime mapping

`fixtures/R0.txt`, `S.txt`, `T.txt`, `U.txt`, `BX.txt`, `S2.txt`, `RX.txt` retain
the exact approved UTF-8/LF text and their seven original SHA-256 identities.
R0 names the root namespace, entity kinds, initial environment/time/obligations,
owners, fidelity and available artifacts. S/T/U/S2 decode kind/parent-qualified
selectors and their native/normalization/digest metadata. BX decodes explicit
entity associations and initial epochs; RX decodes the one approved remap. No
display-name, illustration or array-position matching binds an actor.

The P4-authored A/B target D, P7 authored graph, source M/Z and root producer
grants are proof-fixture content. The original raw text remains available for
lossless comparison; runtime JSON is a distinct deterministic serializer, never
claimed to have the raw-text hash. Epochs and binding revisions remain distinct
from artifact identities. The two parent-qualified `point_0001` selectors remain
different; U's place stays unbound. No geometry or RC normalization is performed.

## Legacy and independent review

Legacy data is intentionally absent from the C1 source ZIP. Use the exact Stage12
repository and accepted archives identified by the outer EA-C1 manifest. Run:

```powershell
python -B tools/repo.py encounter-atlas --out NEW_EXTERNAL_DIRECTORY
```

from that repository. It copies before writing and preserves the actual accepted
IR3-25 failure (24 pass / 1 fail / 0 skip), not an all-green fiction. Additional
legacy commands and fresh headed Chrome reproduction are documented in the
outer reproduction report. `tools/legacy_gates.py`, the path-only
`legacy-ar0-r1.mjs` adapter and `legacy_browser.mjs` are supplied for review.
They require a disposable legacy package and separate historical negative
control inputs; they are not dependencies of the new Core.

The browser harness uses pre-existing Chrome and Playwright (tested 1.62.1),
local HTTP, actual native controls, screenshots, saves and matching inspectors.
Set `EA_C1_PLAYWRIGHT` to an existing Playwright module directory when it is not
on Node's normal resolution path. A network sandbox may block Chrome's loopback
request; use the permitted local test environment, never relabel it PASS.

No C2, Atlas UI/A2, async executor, destructive collector, mode-B loader,
Governance, Unity or specialist system is implemented. No repository edits,
commits, pushes or acceptance promotion are authorized by this source delivery.

Stored authoritative SQLite payloads use compact sorted-key ASCII JSON with no final newline in a UTF-8 database. The loader checks this exact storage domain before trusting its encoded-byte census. Public caller JSON is captured as values and does not need to arrive in this textual form. Noncanonical optional accelerators are ignored as optional data and their raw bytes remain charged.

## C1-B01 accounting v2

The original unaccepted 0.1.2 packet, 27-method tests and original reproducer
remain unchanged negative/reference controls. This copy changes only the Core
publication accounting plus runtime/profile identity. No migration is provided.
The profile prefix is EA-C1-profile/2/ and accounting is full-prefix/2. Exact
limits have the same digest suffix but a different contract-qualified identity.

Before root, operation or checkpoint COMMIT, the actual writer transaction reads
SQLite page_count and page_size after all SQL mutations. Let P be the larger of
that allocation and the existing file length, and E the canonical root + complete
history + optional checkpoint bytes. The required workspace is
32*E + 1048576 + 4*P. It reserves complete encoded proof/staging overhead plus
four backend images for database/journal/publication/recovery. Actual live file
bytes are checked within this reservation too. SQL/SQLite page allocation is
finished before this check; only COMMIT follows it. Cold full replay enforces the
same formula using the committed file. Free-disk checks remain additional and
conservative. No acknowledged publication is rolled back to fit a later budget.

Run the narrow new gates separately, from this exact extracted source:

```powershell
python -B tools/verify_b01.py --out C:\Users\mcdon\Documents\Codex\EA-C1-B01-independent-boundaries
```

This adds fixed historical capacities, independent raw-SQL/page measurements,
root/operation/checkpoint just-below/at/above thresholds, storage-full retries,
read-only exports and seven real boundary process interruptions. The unchanged
27-method suite and tools/verify.py remain separately required. New helpers
observe then invoke the actual production reservation; their expected costs are
computed separately from stored record lengths and SQLite pages, not Core.census.
These are Builder-owned reference calculations, never independent acceptance.

A valid operation can be conservatively refused; a smaller valid checkpoint or
request can still fit under the same immutable profile. Failed initialization
may leave an empty unacknowledged SQLite file after rollback; use a new path.
There is no new world or acknowledged root in that file. Original 0.1.2 stores
are deliberately not compatible with this exact-source/profile build.

References: https://www.sqlite.org/atomiccommit.html and
https://www.sqlite.org/pragma.html#pragma_page_count. Delivered evidence is for
the pinned Windows win32 DELETE/EXTRA backend and process-crash model only.
No device/power-loss/whole-volume-ENOSPC/ACL certification is added.
