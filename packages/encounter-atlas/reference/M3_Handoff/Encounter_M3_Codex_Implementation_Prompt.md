# Encounter System — M3 Implementation Pass

You are now authorized to begin **M3 only** for the Encounter System.

The source baseline is the independently verified:

`Encounter_M2_Checkpoint.zip`

Exact verified archive SHA-256:

`940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7`

Treat the supplied **Encounter System Master v2.1**, approval record, M1/M2 contract material, M2 checkpoint, and independent M2 review as the governing source set.

Do not silently reinterpret the design from chat history or from general game-design assumptions.

---

## 1. Architectural principle

**Encounter is a reusable interaction engine in its own right.**

Trapstar is the primary reference host currently motivating and exercising it, but Encounter must **not become a Trapstar-specific subsystem**.

We are deliberately designing Encounter and Trapstar's world/navigation system in tandem so they fit together cleanly, while keeping their responsibilities separate.

Encounter should remain usable in another game with:

- a different movement system;
- no route system at all;
- different rendering;
- different combat;
- different world geometry;
- different character art;
- different physical interaction mechanics.

Therefore:

**Do not hard-code Trapstar concepts into the Encounter core**, including:

- routes;
- rails;
- lanes;
- cover nodes;
- hiding nodes;
- gathering zones;
- pathfinding;
- player movement;
- sprite facing;
- FRONT / 3/4 / BACK presentation;
- billboarding;
- 3D geometry;
- line-of-sight calculations;
- NPC spawn/despawn rules;
- combat positioning.

Those belong to the **host game**.

The Encounter System may receive the *results* of host-world processes through generic contracts—for example:

- actor X received observation Y;
- actor X is currently available for interaction;
- a physical action was attempted;
- a physical action succeeded or failed;
- permission exists for a declared scope;
- an item was inspected;
- a handover occurred;
- an observer received only these event details;
- a host event changed a declared world condition.

But Encounter must not calculate the host world's geometry or locomotion itself.

**Trapstar examples are compatibility examples, not core vocabulary.**

If you add an integration seam during M3, make it generic, typed, and host-neutral.

---

## 2. Preserve the M2 foundation

M2 has passed independent review.

Do not casually refactor working boundaries just because M3 adds more behavior.

Preserve the demonstrated M2 properties:

- compose → preview → send;
- canonical sent message remains distinct from interpretation;
- NPC Intake and Delivery remain distinct phases of one response;
- previews are non-mutating;
- permission does not perform the physical action;
- physical actions/results are committed separately;
- each listener receives only its permitted observation projection;
- hidden world truth cannot leak into policy input;
- private BASED selectors cannot leak as hidden knowledge;
- performed outward cues are legitimate observable information;
- actor-local claims remain distinct from world truth;
- command/result retries remain idempotent;
- stale or conflicting commands fail safely;
- save/load does not execute, reroll, or duplicate effects;
- inspector/replay remain non-mutating;
- character IDs/names are not policy branches;
- missing final wording/art retains usable fallback behavior.

Before changing one of these boundaries, prove that M3 actually requires it and add a regression test demonstrating preservation of the M2 invariant.

---

## 3. Formal M3 goal

The master defines M3 as:

**Seed A playable.**

Entry condition:

- M2 passes;
- Sign-off A is recorded.

M3 work:

- full Seed A recovery;
- relevant evidence;
- understandable privacy pattern;
- restriction;
- one meaningful repair episode;
- explicitly warned failure/closure;
- unnecessary-money refusal;
- save continuity.

Exit evidence:

- at least one successful complete recovery route;
- the deliberately warned failure route;
- no fictitious debt;
- no requirement to obtain private information;
- causal evidence showing why each result occurred.

**Do not drift into M4, M5, or M6.**

---

## 4. Seed A scenario behavior to implement

Seed A is **The Protective Shortcut**.

Preserve the authored facts:

- Nera owns the green instrument case.
- The player has valid collection authority.
- Tamsin moved the case to dry storage after a spill.
- The original `"collected"` entry began as shorthand for collected from the rack.
- That original shorthand mistake is distinct from any later evasiveness.
- Orrin saw a wrapped green case moving toward the partition.
- Orrin did **not** see the damp seam, final cupboard, or Tamsin's purpose.
- The recipient signature is missing.
- A numbered drying tag supports internal handling.
- The separate hauling obligation in Seed A is already paid.
- No extra collection charge exists.
- Private contact information is not necessary for recovery.

Do not rewrite these facts to make implementation easier.

---

## 5. Required successful Seed A path

Implement a complete playable recovery chain using the existing engine boundaries.

The exact wording may remain skeleton/fallback text, but the mechanics and causal structure must be real.

A representative path should support:

### A. Establish collection authority

The player presents/uses the valid collection ticket through the appropriate declared action.

Tamsin can learn/retain that the player has legitimate collection authority.

Later privacy concern must **not erase this established fact**.

Do not turn:

> "This person is asking for information beyond the case scope"

into:

> "This person was never an authorized collector."

Those are separate judgments.

### B. Preserve the protected ordinary paperwork request

The player's first reasonable request for case paperwork remains protected.

Tamsin may explain:

- the file includes case-handling material;
- it also contains unrelated/private customer information;
- relevant case-only access is available.

This first ordinary request must **not**:

- create the serious restriction;
- consume the repair episode;
- create a grievance merely to force later drama;
- reveal protected values.

### C. Obtain evidence through real physical actions

Preserve the M2 permission/action separation.

Example evidence path:

- handling extract becomes available;
- player deliberately inspects it;
- player receives the missing-signature detail;
- observers receive only what they actually receive;
- Orrin can supply his limited account;
- an authorized physical search/inspection can produce the drying tag.

Do not make:

> "permission to inspect"

equivalent to:

> "inspection happened."

Do not make:

> "watched player inspect"

equivalent to:

> "read the inspected detail."

### D. Support the later privacy pattern

After the appropriate prerequisite observations exist, support the authored later pattern in which the player:

- asks about Nera's whereabouts or otherwise demonstrates the distinct relevant interest defined by CR-01;
- receives the appropriate boundary/alternative;
- later renews a broad request for protected/full-file scope.

The same NPC must actually have received the supporting observations required by CR-01.

Do not build the concern from:

- private drafts;
- another NPC's unshared conversation;
- hidden BASED labels;
- unseen seed facts;
- arbitrary question counts.

### E. Serious restriction and explicit warning

When CR-01's real conditions are met, Tamsin should:

- limit further relevant-file access to the authored supervised comparison;
- explain the available case-only route;
- preserve collection as still possible;
- deliver the explicit visit-long warning.

This is a **fallible concern**, not omniscient proof of malicious intent.

### F. One meaningful repair episode

The repair episode is visit state, not the next click.

The following must **not consume it**:

- reading;
- drafting;
- previewing;
- editing;
- changing conversation partner;
- ending the current conversation;
- asking Why / clarifying the warning;
- technically rejected commands.

A substantive supported correction can resolve it by doing the kinds of things approved in the master, including:

- accepting the case-only comparison;
- identifying the handling discrepancy and limiting the present request to the relevant extract;
- providing newly inspectable evidence that establishes why the narrower scope is relevant and permitted.

A polite tone or vague apology alone is not automatically sufficient.

Repair:

- reopens the valid recovery route;
- does not disclose the private address;
- does not erase unrelated history;
- is not reset by merely ending and reopening conversation.

### G. Complete recovery

After the appropriate bounded comparison/action:

- Tamsin can identify dry storage;
- a valid release/handover can become available;
- the player sees the exact material result before confirming;
- the player confirms the current terms deliberately;
- case custody changes exactly once;
- Nera remains the owner;
- player pays **0 coins**;
- no private information is included;
- the original shorthand record remains part of history with an appropriate correction rather than being rewritten out of existence.

A successful ending should preserve the separation of:

- recovery;
- spending;
- privacy;
- relationship/social consequences;
- record correction.

---

## 6. Unnecessary-money refusal

Seed A contains no extra collection charge.

Implement an intelligible ordinary payment offer so the player can test this.

Tamsin should decline it as unnecessary.

Required properties:

- money does not move;
- no debt is invented;
- no fictitious fee is created merely so the Offer system has something to do;
- the offer can still exist as an actual received communication;
- Tamsin does not automatically infer bribery merely because money was offered;
- a genuinely different proposal to evade a privacy boundary would be a different semantic act and must preview differently.

Build any Offer/confirmation support needed here as **shared reusable machinery**, not a `SeedA` special case, because M4 will need the same engine.

Do not implement Seed B's full payment/nonpayment negotiation in M3.

---

## 7. Warned closure / failure route

Implement the approved CR-01 restriction/repair/closure behavior precisely.

Collection service may close only when the approved predicate is satisfied.

In particular:

- recovery has not already completed;
- the restriction and viable case-only alternative were actually communicated;
- the explicit warning was delivered in an earlier committed response;
- a later deliberate sent communication again demands protected/full-file scope or asks Tamsin to bypass that boundary;
- no new inspected authorization/evidence makes that scope permitted;
- the required preview notice was shown before Send.

Closure is:

- a scenario/world-service action;
- not generic refusal;
- not a mood threshold;
- not a vibe threshold;
- not a question quota;
- not triggered by UI activity;
- not triggered merely by ending dialogue;
- not triggered merely by refusing payment.

Previously completed recovery cannot be undone by later closure logic.

---

## 8. Closure preview notice

Once the public warning has actually been delivered, a later draft that would satisfy the warned closing condition must show the explicit consequence in preview **before Send**.

The notice may use only:

- the public warning;
- the player's own draft;
- information already available to the player.

It must not reveal:

- Tamsin's private belief;
- hidden hypothesis state;
- unseen Seed A facts;
- secret outcome prediction unrelated to the public warning.

It must:

- warn plainly that sending this renewed demand will end collection service for this visit;
- allow Send anyway;
- allow Edit;
- cost nothing to abandon/edit;
- leave the draft meaning intact.

**Important source ambiguity:**  
Master v2.1 explicitly says that if the notice is not shown, the message can still be delivered/refused but service must **not close**, and the missing notice is logged as a defect. The independent M2 report nevertheless flags a “missing-preview closure fallback” as an owner question before M3.

Do not silently invent additional behavior to reconcile those two statements.

Treat the following as locked unless a supplied owner record says otherwise:

> **No displayed closure notice = no closure.**

If M3 requires behavior beyond that—such as what exact player-facing fallback appears when the preview system itself cannot render the notice—surface that as a clearly isolated owner question rather than guessing.

Do not block all other M3 work on that question if the rest can be implemented independently.

---

## 9. Host-game / Trapstar compatibility boundary

While implementing M3, keep this future use case in mind:

Trapstar is likely to have a host-side spatial system involving things such as:

- authored player routes;
- NPC movement lanes;
- interaction positions;
- gathering locations;
- cover/hiding positions;
- doors;
- physical objects;
- host-side sight/hearing determinations;
- host-side spawning/despawning;
- host-side character presentation.

**Encounter must not own any of those systems.**

Instead, design M3 contracts so a host could cleanly do something conceptually like:

1. Host world determines that a physical event occurred.
2. Host determines which actors receive which observable fragments.
3. Encounter records those actor-local observations.
4. Encounter uses only the permitted actor-local view for interpretation/response.
5. Encounter may return a social decision, permission, refusal, proposal, or declared scenario consequence.
6. Host performs any actual physical/world action through its own resolver.

For example, Trapstar might eventually decide that:

- an NPC behind a desk saw the player open a drawer but could not read the document;
- an NPC across a street saw the player draw a weapon;
- a hidden NPC received nothing;
- entering a counter interaction position caused an NPC to initiate conversation;
- a door becomes traversable after permission is granted.

Encounter should be able to consume generic observations/results from such a host.

But **M3 must not implement desks, streets, routes, cover, doors, geometry, or weapon logic.**

Do not create a Trapstar adapter unless M3 genuinely requires an adapter to prove the boundary. If one is useful, keep it tiny and demonstrative, outside core, using generic input/output contracts.

---

## 10. Presentation boundary

Encounter chooses **meaningful performance intent**, not rendering geometry.

For example, Encounter may produce or reference concepts like:

- guarded Intake;
- skeptical Intake;
- cautious Delivery;
- refusal;
- explanation;
- warning;
- deliberate silence;
- held posture.

It should not choose:

- front sprite;
- 3/4 sprite;
- back sprite;
- head angle;
- arm asset;
- cover animation;
- world-space orientation.

Those belong to the host character-presentation system.

Preserve the current fallback where missing finished art can be represented by readable body-and-face performance descriptions.

---

## 11. Save continuity requirements

M3 must extend the existing save/run format carefully enough that a saved continuing Seed A encounter can preserve:

- evidence already inspected;
- observations received by each actor;
- established collection authority;
- original shorthand history;
- later correction/evasion-related history;
- restriction state;
- delivered warning;
- whether the meaningful repair has been used/resolved;
- service-open/service-closed state;
- current custody/ownership;
- money;
- current valid offer/permission state as permitted by the existing contracts;
- causal decision history.

Loading must not:

- rerun an action;
- reapply a result;
- spend money;
- transfer custody;
- regenerate a different decision;
- reset warning/repair state;
- restore a consumed invalid proposal as if current.

Switching conversation partners must preserve relevant encounter history while respecting the existing rules for unfinished terms.

---

## 12. M3 acceptance targets

At minimum, execute or add coverage corresponding to the master specifications relevant to M3, including:

- **LC-T17** — Specific restriction
- **LC-T18** — One meaningful repair episode
- **LC-T19** — Clearly warned closure
- **LC-T20** — Keep verified authority
- **LC-T21** — Custody versus ownership
- **LC-T25** — No fictitious debt in Seed A
- **LC-T26** — Failed/stale transaction safety where relevant
- **LC-T28** — Duplicate cause protection
- **LC-T30** — Privacy-preserving recovery
- **LC-T31** — Independent outcomes
- **LC-T32** — Absent actor is not omniscient
- **LC-T33** — Continuity and save/load
- **LC-T35** — Playback neutrality
- **LC-T42** — Protected ordinary first request
- **LC-T44** — Sensible Seed A payment refusal
- **LC-T55** — Original mistake versus later evasion
- **LC-T62** — Repair not consumed by interface activity
- **LC-T65** — Privacy refusal alone is not scenario failure
- **LC-T69** — Closure is always previewed

Also preserve every M0/M1/M2 regression already demonstrated by the verified checkpoint unless a source explicitly says otherwise.

Do not count inherited historical totals as fresh M3 execution.

---

## 13. Required adversarial tests

Add targeted tests attempting to break the M3 boundaries.

Include at least:

### Privacy trigger attacks

- first ordinary paperwork request must not trigger restriction;
- private draft must not trigger restriction;
- other NPC's unheard conversation must not trigger restriction;
- hidden BASED label must not trigger restriction;
- unseen Seed A truth must not trigger restriction.

### Repair attacks

- preview/edit does not consume repair;
- Why does not consume repair;
- switching partner does not consume repair;
- rejected technical command does not consume repair;
- vague apology alone does not count as substantive repair;
- real narrowing/correction does.

### Closure attacks

- no prior warning = no closure;
- warning but no closing preview notice = no closure;
- case-only request = no closure notice;
- Why/clarification = no closure notice;
- warned renewed full-file request = notice;
- abandoning/editing flagged draft has no effect;
- sending after valid notice closes exactly once;
- duplicate/replayed send cannot re-close/reapply consequences;
- completed recovery cannot be converted into loss afterward.

### Information-boundary attacks

- Orrin's limited observation does not acquire Tamsin's purpose;
- absent Nera does not magically learn office interaction;
- observer of inspection does not automatically learn inspected text;
- Tamsin's private concern does not become public fact unless communicated.

### Money / transaction attacks

- ordinary Seed A payment offer moves no money;
- payment refusal creates no fictitious debt;
- stale/altered confirmation applies no partial custody or money changes;
- retry of completed handover does not duplicate case or effects.

### Save attacks

Save during:

- partial evidence;
- active restriction;
- delivered warning;
- repaired state;
- pending valid handover if supported;
- closed service.

Reload and prove state continuity without new effects.

---

## 14. Causal inspector requirements

Extend the existing inspector so M3 decisions can be audited without exposing hidden information to ordinary gameplay.

For each important M3 decision, the author should be able to determine:

- which actor made the decision;
- which actual observations were inputs;
- which claim/belief/interpretation state was relevant;
- which public warning/restriction state was active;
- why the repair qualified or did not;
- why closure qualified or did not;
- which material changes were proposed;
- which material changes actually committed.

The inspector should make it possible to prove:

> "This restriction happened because Tamsin received these specific outward events."

rather than:

> "The game knew it was time for the privacy plot."

Reads/refreshes must remain non-mutating.

---

## 15. Scenario independence / portability test

M3 is still part of a reusable engine.

Add or extend a neutral portability fixture sufficient to demonstrate that the new machinery is not keyed to:

- `Tamsin`;
- `Orrin`;
- `Nera`;
- `"Seed A"`;
- the literal green case;
- the literal transport office;
- literal privacy keywords.

Rename actor IDs, subject IDs, display labels, and scenario IDs while preserving equivalent authored roles/rules, then exercise the relevant restriction/repair/closure or recovery mechanics through the same core.

The **content package** may of course contain Last Collection-specific authored facts.

The **core policy** must not.

---

## 16. Do not implement in M3

Do not expand this pass into:

- Seed B full negotiation;
- full payment route;
- full nonpayment witnessed-comparison route;
- full 20-vibe × 6-act × 3-salience coverage;
- full Assembler;
- live-run editing;
- NPC initiation unless a source explicitly moves it into M3;
- combat;
- theft;
- stealth;
- full sensory simulation;
- route/lane/pathfinding logic;
- runtime generative AI;
- unrestricted promises;
- old-save conversion;
- universal psychological simulation.

Do not "prepare for later" by half-implementing these inside M3.

Create clean extension points only where necessary.

---

## 17. Implementation discipline

Work in a new M3 copy/branch/package.

Preserve the verified M2 checkpoint unchanged.

Before coding:

1. verify the exact M2 archive/identity;
2. read the master v2.1 relevant M3 sections;
3. read the approval record;
4. read the M2 independent report;
5. inspect current M2 source/contracts/tests;
6. produce a short M3 implementation plan identifying what can be reused versus what must be extended.

Then implement.

Do not merely produce a design document unless blocked by an unresolved owner decision.

If a real conflict appears between approved sources:

- identify the exact conflicting passages;
- preserve the safer existing invariant;
- ask one focused owner question;
- do not silently choose a new game rule.

---

## 18. Deliverables

Produce an M3 checkpoint package containing at minimum:

1. runnable browser build;
2. editable source;
3. exact package/build identity information;
4. M3 implementation report;
5. preservation/regression report against M2;
6. automated test sources and fresh outputs;
7. browser/manual test record;
8. at least one successful complete Seed A run export;
9. at least one warned-closure failure run export;
10. causal inspector exports for both;
11. generated readable transcripts for both;
12. save/load continuity evidence;
13. portability/renaming evidence;
14. known limitations and explicitly deferred items.

If possible, also include an intermediate repaired-but-not-yet-recovered save fixture so continuity can be tested directly.

---

## 19. Definition of done

Do **not** call M3 complete merely because the happy path runs.

M3 is complete only when:

- Seed A can be recovered end to end;
- private contact information is not required;
- valid authority persists through later concern;
- original shorthand mistake and later behavior remain distinguishable;
- ordinary first request remains protected;
- serious restriction requires the authored received evidence pattern;
- one meaningful repair works;
- UI activity cannot consume repair;
- the warned closure path is deliberate and previewed;
- no notice means no closure;
- closure cannot retroactively cancel completed recovery;
- unnecessary money is refused without inventing debt/bribery;
- custody changes without ownership corruption;
- retries/stale actions do not duplicate effects;
- save/load preserves M3 state without executing it;
- inspector traces actual causes;
- Last Collection content does not create Last Collection-specific branches in the reusable core;
- M2 regression checks remain green;
- fresh evidence names the exact build actually tested.

At the end, report one of:

**READY FOR INDEPENDENT M3 REVIEW**

or

**NOT READY FOR INDEPENDENT M3 REVIEW**

with the specific remaining defects/blockers.

Do **not** begin M4 automatically after finishing M3.
