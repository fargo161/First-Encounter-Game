"""Record the reached stop condition and preservation evidence. No art writes."""
from gate_a_core import *
from collections import Counter
PROJECT=ROOT.parent.parent
def tree(p):return {f.relative_to(p).as_posix():{'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for f in sorted(p.rglob('*')) if f.is_file()}
assert_neutral_lock()
base=json.loads((ROOT/'validation/preservation_baseline.json').read_text());preserve={}
for key,info in base['roots'].items():
    now=tree(PROJECT/info['path']);assert now==info['files'],key
    preserve[key]={'files':len(now),'changed':0,'missing':0,'added':0,'unchanged':True}
(ROOT/'validation/preservation_results.json').write_text(json.dumps(preserve,indent=2)+'\n')
failed=json.loads((ROOT/'validation/G_L_failed_wrist_measurement.json').read_text())
ledger=json.loads((ROOT/'data/surface_ledger.json').read_text())
assert len(ledger['surfaces'])==32 and len({s['id'] for s in ledger['surfaces']})==32
assert len([s for s in ledger['surfaces'] if s['path']])==18 and not ledger['reserves']
matrix=json.loads((ROOT/'data/required_matrix.json').read_text());counts=Counter();ids=[]
def walk(v):
    if isinstance(v,dict):
        if 'id' in v and 'status' in v:ids.append(v['id']);counts[v['status']]+=1
        for x in v.values():walk(x)
    elif isinstance(v,list):
        for x in v:walk(x)
walk(matrix);assert len(ids)==len(set(ids))==243
assert counts['NOT_RUN_R5_STOP_CONDITION']==239
for row in matrix['body']:
    if row['id'] in ['B_off_NN_NN','B_on_NN_NN']:row['reason']='OWNER_ACCEPTED_R4_CANDIDATE02; R5_REPRODUCES_EXACTLY'
    elif row['id']=='B_off_GN_NN':row['reason']='UNACCEPTED_PILOT; NOT_PROPAGATED_AFTER_JACKET_INTERFACE_FAILURE'
(ROOT/'data/required_matrix.json').write_text(json.dumps(matrix,indent=2)+'\n')
(ROOT/'validation/matrix_execution_summary.json').write_text(json.dumps({'required':243,'valid':226,'productionNegatives':17,'actualStatuses':dict(counts),'twoSupplementaryPixelControls':'separate comparator checks; not production negatives','fullGateAVerdict':'FAILED_AT_G_SLEEVE_PILOT','viewerImplemented':False},indent=2)+'\n')
report=f'''# C001 Gate A R5 implementation stop report

**GATE A FAILED AT THE G-SLEEVE PILOT — STOP FOR OWNER REVIEW.**

The accepted R4 candidate02 neutral pair, including authored A16, is frozen. A25 is unchanged. The resumed build stops at the first anatomical L/image-right G-arm shared-wrist trial. This is a failed partial candidate, not a completed32-surface proof. It does not establish that the five-slot architecture or the finite body architecture is impossible; the current new sleeve artwork/export does not satisfy its interfaces or source-fidelity review.

## Actual result and stop condition

New tee/skin G art and a matching open hand were drawn, then one jacket-sleeve donor and one focused donor revision were tried against that same hand. No neutral part, anchor or scale was changed to make them fit. The jacket revision still places its cuff through the shared palm instead of meeting the declared G wrist, and its new shoulder/stripe transition and garment volume are not clean enough to accept against the frozen source-style jacket.

The body registration is1024x1536; anatomical L shoulder remains(612,407). The new pilot G wrist was declared at(637,705), with seam line `y=.7*(x-637)+705` and10-pixel signed vertical overlap on each side. This G wrist is a builder pilot datum, not an owner-approved extension of the neutral calibration. The G hand file is identical in both outfits. **{failed['pixels']:,} opaque/core hand texels are covered by the revised sleeve beyond that declared band**, in body bounds{failed['bodyBoundsXYXY']}. The deepest coverage is{failed['maximumSignedVerticalDistanceFromWristLine']:.1f} vertical pixels from the seam line, or{failed['maximumPerpendicularDistanceFromWristLine']:.2f} perpendicular pixels. Native evidence shows the cuff running over the palm toward the fingers. This quantifies the failed pilot interface; it is not a cast-wide anatomical tolerance.

The source-fidelity and clean shared-wrist requirements in preflight sections3/6, RISK-01/RISK-05, and the owner's frozen-interface resume instruction are not met. Authoring stopped. No outfit-specific second hand, neutral-body change, per-recipe fitting, mirrored arm, extra full torso or whole-body replacement was introduced. A further new G drawing method may solve this within the budget; that remains unproven and is returned for owner review rather than asserted impossible.

## Work attempted and provenance

Only three previously empty logical slots were attempted: A06 tee L G arm, A14 shared L G hand, and A10 jacket L G sleeve. A06/A14 are unaccepted pilots, not validated finished parts. A10 is a failed draft. All other new slots remain absent.

Built-in imagegen produced three working donors: `G_L_tee_hand_v1.png`, `G_L_jacket_v1.png` and `G_L_jacket_v2.png`. Exact prompts are in `authoring/prompts/`, raw outputs in `authoring/raw/`. The imagegen skill was used; no CLI fallback or API runner was used. The two body references excluded the accepted head; A25 was never a generation input. One coherent tee/skin/hand working donor supplies two separately counted logical exports. The jacket donors supply only A10; their generated hand RGB is not selected as a second hand.

Each887x1774 donor is exported by a single declared whole-canvas Lanczos resize to300x600 and body origin(520,350), without bounding-box fitting. Existing N cap paint is retained above435, transitioning into new G paint at435–480. These are disclosed new-G authoring derivatives, not changes to the neutral assets. The G hand has a10-pixel wrist overlap; exterior antialias ownership is assigned to one part. Pure root-occlusion masks come from frozen A02/A03 coverage, full through550 and fading out by580. They carry no repair RGB, add no painted surface, and leave the complete forearm at its single front draw depth.

The first jacket export had an additional **builder processing defect**: its broad warm-color skin predicate also removed warm stripe texels, producing holes. That export is rejected and retained under `authoring/rejected/`. The final failed evidence uses v2, supplied without a hand, and does **not** apply that predicate. V2 still fails cuff fit and native garment/root quality. No repair was made after declaring the stop; the subsequent operations only rendered, measured, documented and archived existing failed art.

## Frozen neutral integrity

`contract/ACCEPTED_R4_NEUTRAL_LOCK.json` hashes all15 accepted painted parts, A25 silhouette and the original calibration/interface/recipe/head-lock records. Every byte remains exact. R5 replays both accepted neutral composites in every RGBA channel exactly, including hidden RGB. Body root(512,1472), source translation(0,54), A25 placement(256,54), N wrists L(684,824)/R(301,822), neck-base(501,381), and all other frozen datums remain unchanged. No G pilot datum replaces an N datum.

A25 PNG SHA-256: `f57ca9e06a203810c3a7f5d9e4c94bf6ecb9f5a2ff83d74b27eff62b4fbba724`.

A16 PNG SHA-256: `23ad2c87efb724bb4c747d13d4bd76c49f4c411e5517c6f59f44f1de000008c7`.

A16 is now an **owner-accepted authored waist proposal**, unchanged from R4 candidate02. Its prior13,564 source-seed RGB differences, including5,066 at y840–864, are disclosed in the preserved CSV. It is not relabeled as wholly source-exact RGB.

Historical draft/review labels in the byte-preserved calibration and accepted-neural snapshot remain historical text; the new explicit owner-acceptance record controls their current authority. It does not approve any new G art.

All original sources and R1–R4 history are unchanged. The fresh audit covers{', '.join(k+': '+str(v['files'])+' files' for k,v in preserve.items())}. There are zero changed, missing or added files in those roots.

## Actual validation and unrun requirements

| Requirement | Actual result |
|---|---|
|32 baseline IDs | All retained;15 frozen accepted neutral parts +3 unaccepted/failed pilot parts +14 unauthored |
| Reserves |0 of4 lining/occlusion;0 of2 pelvis; no additional painted layer |
|24 body cases |2 accepted neutral replays exact; off/GN/NN unaccepted pilot; on/GN/NN failed visual/interface pilot;20 unrun |
|54 palette cases |Not run; no semantic material masks or palettes authored |
|120 isolated-face +28 body-face cases |Not run; no facial patch authored |
|17 production negatives |Not run; separate one-pixel RGB/alpha comparator controls only |
| Viewer |Not started after stop; no viewer pass implied |
| G R / O / remaining work |Not started after stop |

The full243 unique requirement IDs remain present. **222 valid cases and all17 production negatives are unrun**; the four rendered evidence cases include two unaccepted pilots and do not count as four Gate A passes. The portable standard-library verifier checks the manifest, all frozen neutral hashes, retained source head/hand RGB, authoritative head alpha, protected facial pixels, four exact canonical replays/reopened PNGs, comparator controls and independent reproduction of the failed wrist-overlap count. A successful verifier exit means that the **failed evidence** reproduced intact, not that the artwork passed.

## Checkpoint and owner handoff

The frozen failure snapshot is `C001_ZANT_GATE_A_R5_FAILED_G_SLEEVE_PILOT/` plus a ZIP and external SHA-256 sidecar. Begin with `evidence/R5_STOP_comparison_384.png`, `B_on_GN_NN_upper_interface_native.png`, `FAILED_G_L_wrist_registration_native.png`, and the native wrist background crops. The original accepted pair is included for direct comparison. The standard-library verifier writes only to a new external audit directory. Fresh builder replay results accompany the archive and remain distinct from independent testing.

The owner review point is the failed L G sleeve/root/shared-wrist method. Accepted R4 neutral anatomy, A16, A25 and their registration have not been reopened. Any resumption needs an explicit owner decision; this failed trial does not authorize loosening those locks or moving to later work.

**STOP FOR OWNER REVIEW.** No Gate B, other character, animation, Unity, Encounter/Room Creator or database changes.
'''
(ROOT/'IMPLEMENTATION_REPORT.md').write_text(report,encoding='utf-8')
start='''# C001 Gate A R5 failed G-sleeve checkpoint

**GATE A FAILED AT G-SLEEVE PILOT. STOP FOR OWNER REVIEW.**

This is a reproducible partial failure packet, not a completed Gate A capsule or approved new pose. R4 candidate02 neutral interfaces and A16 were accepted and are frozen; A25 remains unchanged. Read `IMPLEMENTATION_REPORT.md`, `contract/OWNER_RESUME_AFTER_R4.md` and `contract/ACCEPTED_R4_NEUTRAL_LOCK.json` first. The original preflight/spec are unchanged. The new owner resume record supersedes historical neutral-hold text.

Begin with the four-column384px comparison in `evidence/R5_STOP_comparison_384.png` and the native failed wrist/upper-interface images. Only the15 neutral parts are owner-accepted. Three new pilot parts are unaccepted/failed,14 baseline slots absent,0 reserves used. Failed pilot renders are evidence, never whole-body runtime substitutes. No full viewer or missing pose/face/palette is implemented.

Verify the ZIP/hash sidecar and extract to a new directory. From its packet root:

```powershell
python .\\validation\\verify_checkpoint.py --out ..\\audit-r5-failed-pilot
```

Python3.12 standard library only; no installation/network/browser/server. Use a NEW external output directory. Exit0 means evidence integrity/reproduction passes. `gateAVerdict` must remain `GATE_A_FAILED_AT_G_SLEEVE_PILOT`. This command neither repairs artwork nor resumes Gate A. It does not import/run authoring scripts. Do not run the authoring or initialization/export scripts in an independent review.

The root manifest governs all packet files except itself. `accepted_neutral/ORIGINAL_R4_MANIFEST.json` is retained provenance, not a manifest asserting that the complete prior archive was nested here. The complete R4 archive/history remains unchanged in the source workspace and is covered by preservation hashes. Record independent results outside this packet and return them to the owner. A numerical replay cannot approve the failed cuff/source fidelity.

**STOP FOR OWNER REVIEW.**
'''
(ROOT/'START_HERE.md').write_text(start,encoding='utf-8')
(ROOT/'TESTER_HANDOFF.md').write_text('''# Independent tester handoff: R5 stopped G-sleeve pilot

The owner accepted R4 candidate02 neutral interfaces, including A16, and authorized remaining Gate A work. The builder stopped at L G sleeve/shared-wrist and source-fidelity failure after one focused garment revision. No full Gate A pass is claimed. Reproduce and assess this failure only; do not repair or continue authoring.

1. Verify external ZIP/manifest SHA-256, CRC and exact inventory; extract afresh. Read START_HERE and the implementation report.
2. Run the portable verifier into a new external directory. It must reproduce four evidence PNGs in all RGBA channels, including hidden RGB; check frozen neutral/head registration/alpha/source RGB and source hand core invariants. Reopened PNGs must match. The two one-pixel controls must detect their single changed channels. Integrity PASS coexists with Gate A FAIL.
3. Inspect accepted neutral versus new G L off/on at native and384px. Inspect new sleeve source-style root/stripe transition, fabric/volume and cuff/palm. The marked common G wrist is(637,705), not an approved neutral datum revision. Independently check1252 hand/sleeve core-overlap texels beyond the declared10-pixel signed seam band; the verifier reproduces this count. This locates the failed join, not a general cast tolerance.
4. Confirm the same A14 hand file is selected in both G pilots and that no generated jacket-hand RGB is selected. Confirm no outfit-specific second hand, whole-body fallback, mirrored arm, neutral fitting or uncounted repair layer. Three new logical slots were attempted; revisions/raw working donors are not selectable extra variants.
5. Recheck all accepted-neutral hash locks, A25, A16 and original N anchors/layer orders. A16 is owner-accepted authored art, not wholly source-exact RGB. The historical calibration draft labels do not undo the explicit owner acceptance record.
6. Confirm32 baseline IDs,18 present including3 unaccepted/failed pilots,14 absent and0 reserves. Two neutral cases replay; two G pilots render, on-state fails. All other222 valid and17 production-negative cases are unrun. No face/palette/viewer/G R/O or later-gate result may be inferred.
7. With original workspace access, independently compare preservation baseline trees (including complete R4/history and both independent reviews). Otherwise state that preservation outside the packet could not be observed independently. Recheck the root manifest after review; leave all packet files unchanged.

Report technical integrity, visual/interface findings, untested work and owner decisions separately. The current failed authoring attempt does not prove that no future drawing can satisfy the architecture. Any new art or continued Gate A run requires owner steering after this stop.

**STOP FOR OWNER REVIEW.**
''',encoding='utf-8')
print(json.dumps({'failureRecorded':True,'matrixStatuses':dict(counts),'preservation':preserve,'acceptedNeutralLock':'EXACT'}))
