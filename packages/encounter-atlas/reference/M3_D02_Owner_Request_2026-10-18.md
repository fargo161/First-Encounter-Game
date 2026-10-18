Independent M3 R1 re-review has completed with verdict:
NOT READY FOR NEXT SCOPE
M3-D01 is independently verified fixed.
A new blocking defect, M3-D02, was found. Do not begin M4.
Read M3_R1_Independent_Test_Report.md and M3_R1_Independent_Test_Evidence.zip completely before changing production code.
M3-D02
The browser display acknowledgment still accepts geometrically invisible closure notices.
The current acknowledgeVisibleNotice boundary checks positive height and vertical viewport containment, but does not adequately require:
- positive width;
- valid horizontal viewport placement.
The independent tester reproduced two failures through actual browser controls:
1. Horizontally offscreen notice
   - notice rectangle entirely outside the viewport at approximately left: -10000, right: -9700;
   - vertical geometry remained valid;
   - no current warning notice was visible;
   - receipt nevertheless recorded displayed: true;
   - service closed;
   - no MISSING_CLOSURE_PREVIEW defect was recorded.
2. Zero-width notice
   - rectangle had width: 0, left == right;
   - height and vertical position remained valid;
   - no readable notice was displayed;
   - receipt nevertheless recorded displayed: true;
   - service closed;
   - no MISSING_CLOSURE_PREVIEW defect was recorded.
The owner rule remains unchanged:
No displayed closure notice = no closure.
Required remediation
Make a narrow remediation from the frozen R1 checkpoint.
Preserve R1 unchanged as historical evidence and work in a new copy.
Correct the production display-receipt guard itself. Do not special-case the independent fixtures, Seed A, Tamsin, message text, or CSS values.
At minimum, a new display receipt must require:
- nonzero positive rectangle width;
- nonzero positive rectangle height;
- valid vertical viewport placement;
- valid horizontal viewport placement;
- the existing hidden/display/visibility checks;
- the R1 own/ancestor opacity checks;
- the existing binding to the current notice/draft/revision.
Keep the geometry semantics internally consistent. In particular, if the current contract requires full vertical containment before acknowledgment, apply the equivalent horizontal containment rule rather than allowing a wholly or partly invalid horizontal rectangle through accidentally.
Do not broaden this into pixel-level occlusion detection, accessibility certification, overlay analysis, or a rendering-engine redesign. Fix the demonstrated geometry boundary and preserve the existing contract.
Required regression cases
Add production-bound tests for at least:
- visible, positive-width/height, fully valid onscreen notice → valid receipt;
- opacity: 0 notice → no receipt;
- ancestor opacity: 0 → no receipt;
- vertical offscreen → no receipt;
- horizontal offscreen left → no receipt;
- horizontal offscreen right → no receipt;
- zero width → no receipt;
- zero height → no receipt;
- hidden → no receipt;
- display:none → no receipt;
- invalid/non-finite geometry where representable → no receipt.
For every invalid-display case, verify through the real engine path:
- the communication may still be received/refused;
- serviceOpen remains true;
- zero physical service-close results;
- exactly the appropriate MISSING_CLOSURE_PREVIEW technical defect;
- no extra player-facing punishment.
Also preserve:
- visible notice + deliberate Send → closure exactly once;
- a truthful display receipt already earned while the current notice was genuinely visible remains valid if the player subsequently scrolls without editing/replacing that draft;
- completed recovery cannot be revoked.
Independent reproducer
Incorporate regression protection for the independent M3-D02 cases, but do not merely make the tester's reproducer pass syntactically. The actual production geometry decision must be corrected.
Preserve the tester's before-fix evidence.
Full regression
Re-run:
- M0;
- all builder M1/M2/M3/R1 tests;
- independent M1;
- independent M2;
- prior independent M3;
- independent M3-D01;
- independent M3-D02;
- fresh browser checks for transparent, ancestor-transparent, vertical-offscreen, horizontal-offscreen, zero-width, visible closure, recovery and post-recovery protection.
Confirm no regression to:
- privacy/local knowledge;
- authority;
- repair;
- warning persistence;
- money;
- custody/ownership;
- exact confirmation;
- save/load;
- retries/idempotence;
- causal inspector;
- portability;
- host-system separation.
The independent tester confirmed the rest of these areas remained intact in R1.    M3_R1_Independent_Test_Report
New checkpoint
If all checks pass, freeze a newly identified checkpoint such as:
Encounter_M3_Checkpoint_R2.zip
Do not overwrite R1 or reuse its identity/hash.
Deliver:
- new frozen checkpoint;
- external identity JSON;
- M3-D02 remediation report;
- verification JSON;
- before/after M3-D02 evidence;
- fresh test outputs;
- preservation diff proving the intentional production change set.
At completion stop and report:
READY FOR INDEPENDENT M3 RE-REVIEW
or
NOT READY FOR INDEPENDENT M3 RE-REVIEW
Do not begin M4.
Proceed with M3-D02 remediation only.