# C001 Gate A R5 failed G-sleeve checkpoint

**GATE A FAILED AT G-SLEEVE PILOT. STOP FOR OWNER REVIEW.**

This is a reproducible partial failure packet, not a completed Gate A capsule or approved new pose. R4 candidate02 neutral interfaces and A16 were accepted and are frozen; A25 remains unchanged. Read `IMPLEMENTATION_REPORT.md`, `contract/OWNER_RESUME_AFTER_R4.md` and `contract/ACCEPTED_R4_NEUTRAL_LOCK.json` first. The original preflight/spec are unchanged. The new owner resume record supersedes historical neutral-hold text.

Begin with the four-column384px comparison in `evidence/R5_STOP_comparison_384.png` and the native failed wrist/upper-interface images. Only the15 neutral parts are owner-accepted. Three new pilot parts are unaccepted/failed,14 baseline slots absent,0 reserves used. Failed pilot renders are evidence, never whole-body runtime substitutes. No full viewer or missing pose/face/palette is implemented.

Verify the ZIP/hash sidecar and extract to a new directory. From its packet root:

```powershell
python .\validation\verify_checkpoint.py --out ..\audit-r5-failed-pilot
```

Python3.12 standard library only; no installation/network/browser/server. Use a NEW external output directory. Exit0 means evidence integrity/reproduction passes. `gateAVerdict` must remain `GATE_A_FAILED_AT_G_SLEEVE_PILOT`. This command neither repairs artwork nor resumes Gate A. It does not import/run authoring scripts. Do not run the authoring or initialization/export scripts in an independent review.

The root manifest governs all packet files except itself. `accepted_neutral/ORIGINAL_R4_MANIFEST.json` is retained provenance, not a manifest asserting that the complete prior archive was nested here. The complete R4 archive/history remains unchanged in the source workspace and is covered by preservation hashes. Record independent results outside this packet and return them to the owner. A numerical replay cannot approve the failed cuff/source fidelity.

**STOP FOR OWNER REVIEW.**
