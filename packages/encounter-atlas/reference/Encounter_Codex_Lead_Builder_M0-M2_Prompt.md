# Encounter System — Codex Lead Builder Kickoff
## M0–M2 only · First implementation task
### Owner: Theodore (Teddy) McDonald
### Date: 2026-10-17

> **EXECUTION AUTHORIZATION:** This prompt authorizes implementation work only through milestones **M0, M1, and M2** as defined in `Encounter_System_Master_v2.1.md`.
>
> It does **not** authorize M3 or later work, full Last Collection, Seed B negotiation, the exact collection-closure mechanic, all 360 BASED coverage cases, the full Assembler, additional agents, combat, theft, stealth, runtime generative AI, finished dialogue/art/audio, old-save conversion, or other deferred features.
>
> **Do not silently expand scope.**

---

# 1. Role

You are the **lead builder and integrator** for the first implementation slice of Encounter System.

Your job is not to redesign Encounter. Your job is to:

1. inspect the actual supplied baseline;
2. identify safe reuse versus superseded behavior;
3. establish the smallest coherent shared technical contracts needed for M2;
4. implement one complete, runnable end-to-end interaction;
5. make the causal chain inspectable and testable;
6. stop at M2 for owner/tester review.

The first working proof is intentionally small:

> **Player requests case paperwork → Tamsin explains the file split and offers relevant access → player deliberately performs a permitted inspection → only the correct details reach the appropriate recipients → a later player message using that discovered detail receives a response grounded in information Tamsin could legitimately have.**

This is a vertical slice of the reusable system, not a handcrafted dialogue scene.

---

# 2. Required input files and authority order

You must be given these exact three source/reference files with this task:

1. `Encounter_System_Master_v2.1.md`
2. `Encounter_Approval_Record_2026-10-17.md`
3. `Encounter_Core.html`

Read all three before making architecture decisions.

## Authority

Use this order when they differ:

1. **This kickoff prompt**, only for M0–M2 execution scope, review gates, and the two clarifications in §3 below.
2. **`Encounter_Approval_Record_2026-10-17.md`**, except for the specifically identified unapproved fallback in §3.1 below.
3. **`Encounter_System_Master_v2.1.md`**.
4. **`Encounter_Core.html`** only as evidence of the old implementation and a possible source of reusable code/ideas. It does not override later design decisions.

Older foundation documents and reviews are deliberately **not** required for this first Codex task. The master document already records the applicable decisions and provenance. If you believe an older source is necessary to resolve a concrete blocker, report exactly what is missing and why; do not invent its contents.

---

# 3. Two explicit clarifications for this task

These are included so the M0–M2 implementation does not inherit known handoff ambiguities.

## 3.1 Collection closure is out of scope, and one v2.1 fallback is not authorized here

The **preview reminder before a warned closure** is an approved design direction.

However, v2.1 additionally says that if a closing message is sent without the required preview reminder, the message is delivered but collection does not close and a defect is logged. That specific fallback was added after the owner's approval rather than explicitly approved by the owner.

Therefore, for **M0–M2**:

- do not implement collection closure;
- do not implement or rely on the missing-preview fallback;
- do not create a partial approximation of CR-01;
- preserve interfaces/state so M3 can add the approved restriction/repair/closure system cleanly;
- flag this fallback as requiring owner confirmation before M3.

This does **not** reopen the broader approved restriction/repair/warning design. It simply keeps all closure behavior out of the present milestone.

## 3.2 Duplicate retry versus stale command

The master requires both:

- exact retries of an already committed command must return/reuse the prior result without applying effects twice;
- genuinely new commands based on stale state must be rejected safely.

The staged-order example in the master checks staleness before duplicate-command identity, which can make a legitimate network/UI retry look stale after the first commit.

During M1, reconcile this explicitly. The required externally visible behavior is:

- **same committed command identity + same immutable command payload:** return the previously committed result; no new effects;
- **same command identity + different payload:** reject as an identity conflict;
- **new command identity referencing an obsolete revision/state:** reject as stale and apply no fictional/gameplay consequences.

Document the exact chosen order and add automated tests for all three cases.

This is a technical reconciliation of already-required behavior, not a new gameplay feature.

---

# 4. The project in plain terms

Encounter is a reusable system for dealing with people through what the player **offers, requests, or remarks**, plus **BASED**, which shapes the social meaning of the communication.

The NPC:

- has individual knowledge, priorities, needs, relationships, and beliefs;
- can perceive only specific details actually available to that NPC;
- can form revisable interpretations of the player's outward behavior;
- performs an **Intake** phase and then a **Delivery** phase;
- never reads the human player's private thoughts;
- never receives the player's hidden selected BASED label as a reaction key.

The first scenario is **Last Collection**. The player is authorized to collect Nera Vale's instrument case. Tamsin is the duty clerk. The relevant case-handling records sit in a customer file that also contains private contact information.

For M2, you are **not** solving the whole mystery. You are proving the basic connected machinery with an ordinary paperwork interaction.

---

# 5. Fixed design requirements you may not change

Treat these as invariants.

## 5.1 Encounter loop

Player initiated:

`compose → preview → send → NPC Intake → NPC Delivery → player control`

NPC initiated encounters begin at NPC Delivery and then use the same player controls.

For M2, implement the player-initiated ordinary paperwork path. Do not build a separate incompatible architecture that would prevent NPC initiation later.

## 5.2 Player controls

The current families are:

- **Offer**
- **Request**
- **Remark**

The complete first prototype eventually covers six communicative actions:

1. ask whereabouts;
2. challenge a record;
3. present evidence;
4. acknowledge a grievance;
5. request access;
6. propose an exchange.

M2 can implement the minimum subset needed for the paperwork path plus enough contrasting BASED behavior to prove the architecture. It must not hard-code a future limit smaller than the six actions.

## 5.3 BASED

The final target retains all 20 ordered vibes and Subtle/Nuanced/Overt.

M2 may use a small contrasting subset such as:

- Boundaried;
- Compassionate;
- Menacing.

But the data model and compiler must not make those the only possible vibes.

**BASED changes communicated social meaning. It is not merely a persuasion modifier.**

The listener must not receive the incoming selected-vibe label, selected-template identity, deceptive-mode tag, or a disguised equivalent.

A genuinely performed outward cue may be distinctive—even unique to a vibe—because the listener actually perceived it. What is forbidden is unperceivable information such as the selector label, human sincerity, hidden intent, secret template ID, or a cache/asset key that encodes those facts.

If complete outward communication, NPC state, context, and deterministic variation state are identical, changing only inaccessible selector metadata must not change the listener result.

## 5.4 Salience

Subtle / Nuanced / Overt change **prominence of social framing only**.

They never silently change:

- item;
- amount;
- person;
- permission;
- physical action;
- transaction terms;
- promise;
- actual evidence;
- truth.

## 5.5 Human-player boundary

Do not model the human player's private personality, sincerity, true emotion, or hidden psychological objective.

The player can have:

- identity;
- holdings/custody;
- permissions;
- obligations;
- information actually shown by the interface;
- outward actions and communications;
- relationships owned by NPCs toward the player.

NPCs may infer what the player appears to want from legitimate outward evidence. Those inferences are local, fallible, and revisable.

## 5.6 PERCEIVED and information boundaries

PERCEIVED is foundational and represented through linked observation records.

An observation must identify:

- observer;
- source occurrence/message/result;
- only the details actually received;
- time/sequence and channel where relevant.

Source references are bookkeeping links, not permissions to dereference hidden source fields.

Examples:

- seeing a wrapped green case leave the rack does not reveal final destination or motive;
- hearing "Orrin took it" is perception of a **claim**, not perception of the taking;
- seeing the player inspect a tray does not mean an NPC can read the small print the player found.

Missing perception is not a belief that the missing detail is false.

## 5.7 Facts, claims, beliefs, hypotheses

Keep these distinct:

- **world fact:** what actually holds;
- **claim:** what somebody communicated;
- **belief:** what an NPC currently accepts or disputes;
- **hypothesis:** an NPC's revisable interpretation, especially about behavior/purpose.

An NPC's hypothesis must never overwrite the canonical sent message.

## 5.8 Physical actions are not dialogue

Permission to inspect is not the inspection.

M2 must include a deliberate supported physical/local action:

`inspect relevant handling information`

The physical/local action resolver returns the actual result. The shared runtime owns the application/commit of the result so it cannot be applied twice by both host and core.

## 5.9 Transactions and proposals

M2 does not need the full Seed B deal, but architecture must preserve:

- proposal ≠ execution;
- conversational Yes ≠ exact material confirmation;
- preview ≠ execution;
- showing information/item ≠ transferring it;
- accepted terms must be revalidated before eventual confirmation;
- related material effects are atomic: all together or none.

Do not redesign this around the old ASK/TELL/TRADE implementation.

## 5.10 Presentation

Intake and Delivery are mechanically distinct phases.

For M2 they may use deterministic text descriptions as fallbacks.

Missing artwork or final dialogue must not:

- prevent the encounter from functioning;
- imply purposeful silence;
- change game state;
- duplicate effects when replayed/skipped.

## 5.11 Baseline preservation

Do not modify the supplied `Encounter_Core.html` in place.

Preserve it as a reference.

The new work must not silently inherit:

- fixed player/NPC seat architecture;
- old incoming-vibe reaction lookup;
- legacy session `trust` as persistent TRUSTS;
- old 1/2/4 evidence ranks as the new evidence model;
- old pending-offer behavior merely because it exists in the baseline.

Reuse verified catalog data, validators, transaction safety ideas, export/UI ideas, or other code only when the semantics still match.

---

# 6. M0 — Inventory and reuse audit

Do this first.

## 6.1 Inspect the actual supplied workspace

Report:

- all supplied source files;
- any repository structure that actually exists;
- whether git is available;
- runnable commands actually available;
- test files actually available;
- package manager/build configuration actually available;
- browser launch/storage assumptions;
- any missing source/test package referenced historically.

Do not search indefinitely for an unspecified old archive.

Do not claim historical test totals as fresh execution.

## 6.2 Inspect `Encounter_Core.html`

At minimum inspect the old equivalents/functions for:

- BASED catalog/vibes/salience;
- world/session validation;
- message/intent validation;
- offer term normalization;
- preview;
- send;
- exact offer acceptance/confirmation;
- knowledge/belief projection;
- public view;
- save/export/import;
- inspector/editor/UI patterns.

Identify each relevant part as one of:

- **reuse directly**;
- **reuse after semantic refactor**;
- **reference only**;
- **superseded / must not carry forward**.

Give a short reason.

## 6.3 Deliver M0 artifact

Create a concise document such as:

`M0_Baseline_Inventory_and_Reuse_Plan.md`

It must separate:

- what you actually observed;
- what you actually executed;
- historical claims from documents;
- missing material;
- proposed reuse.

If the workspace is git-backed, make a clean checkpoint commit after M0 and report its hash. Otherwise provide an exact snapshot/export identity.

---

# 7. M1 — Shared contracts for M2

Do not expand into a general engine specification. Establish only what M2 requires while keeping the approved future boundaries possible.

Create:

`M1_M2_Contract_Note.md`

It must cover the following.

## 7.1 Stable identities

Specify stable IDs for the M2 records you implement, including at minimum:

- actor;
- subject/item;
- message;
- command;
- event/action result;
- observation;
- claim;
- belief or accepted factual stance if implemented;
- hypothesis if implemented;
- permission;
- package/session revision.

IDs must not encode hidden story truth or BASED labels.

## 7.2 Canonical message and views

Define one canonical sent-message record with a strict split between:

### Private composition
May contain:

- selected BASED vibe;
- selected salience;
- author/template provenance;
- player's chosen intended framing.

### Outward communication
Contains only what is actually communicated/performed:

- family / supported act;
- participants;
- subject/target/scope;
- question/request/assertion;
- outward social framing;
- prominence as an observable feature;
- explicit terms if any.

### Views
Define at least:

- player preview;
- NPC listener/decision input;
- public history/response view;
- author inspector.

The NPC view must not contain private composition.

## 7.3 Observations

Define source-linked observations with detail filtering.

Prove through tests that an NPC with a source event ID cannot read concealed source fields.

## 7.4 Minimal belief/hypothesis handling

For M2, implement only what the interaction genuinely uses.

Do not build recursive theory of mind.

If a hypothesis is used, it must:

- cite legitimate observations;
- be owned by one NPC;
- have explicit support/correction;
- not rewrite player intent;
- be inspectable;
- not become new independent evidence for itself.

## 7.5 Permission and action/result boundary

Define:

- permission to inspect;
- deliberate inspection request;
- resolved inspection result;
- observer-specific details;
- single commit ownership.

A granted permission without a performed inspection reveals no inspection result.

## 7.6 Deterministic response selection

For M2, use the smallest deterministic selection policy sufficient to choose:

- explain the file split;
- offer relevant access;
- respond to a later message grounded in the discovered information.

The response must be derived from general state/meaning rules, not:

- `if character == Tamsin`;
- `if selectedVibe == EA`;
- seed name;
- hidden solution flag.

Scenario content may bind a reusable response policy to Tamsin's role/profile.

## 7.7 Update order

Write and implement one staged command path.

Resolve the duplicate/stale issue exactly as specified in §3.2 of this prompt.

The runtime must ensure:

- failed technical commands cause no in-world effects;
- a valid social refusal can still mean the NPC received the message;
- retries do not duplicate observations/effects;
- preview and rendering never commit effects;
- inspector refresh is read-only.

## 7.8 Persistence boundary

Define package/configuration versus running session.

M2 need not deliver the whole Assembler, but the run state and authored content must already be separable.

Do not auto-convert old saves.

## 7.9 M1 gate

After producing M0 and M1:

**STOP IMPLEMENTATION BEFORE M2 unless one of the following is true:**

- an independent tester has reviewed the same saved M0/M1 checkpoint and supplied feedback; or
- Teddy explicitly instructs you to proceed without that tester checkpoint.

Report the exact repository commit/snapshot the tester should inspect.

Do not interpret silence as permission to move into M2.

---

# 8. M2 — One complete connected interaction
## Execute only after the M1 gate above is cleared

Build a runnable, minimal browser interaction.

The exact user-facing wording can be mechanical skeleton text. Finished character dialogue is not required.

## 8.1 Required starting fixture

Minimum authored content:

- player;
- Tamsin;
- Nera as an absent owner/reference actor;
- Nera's case;
- valid collection ticket/authority;
- customer file with:
  - relevant handling section;
  - protected private contact section whose value is not initially known;
- collection record state appropriate to the minimal M2 fixture;
- at least one inspectable handling detail;
- minimal Tamsin profile/priorities needed for the path;
- a small BASED subset sufficient to prove semantic compilation;
- text fallback Intake/Delivery performances.

Orrin may exist in the data model, but M2 does not need to implement his full Seed B path.

## 8.2 Required interaction

### Step 1 — Compose and preview
The player uses **Request** to ask for case paperwork / relevant handling information.

Preview must accurately show the intended communication.

Changing draft options without Send changes no NPC/world state.

### Step 2 — Send
The canonical message commits once.

Tamsin receives only the outward message.

The first ordinary paperwork request is protected. It must not:

- create a grievance;
- create the serious privacy hypothesis merely to force a demo;
- spend a repair opportunity;
- close collection service;
- reveal the private address.

### Step 3 — Intake and Delivery
Tamsin performs readable Intake and Delivery fallbacks.

Her Delivery:

- explains that the file also contains unrelated private information;
- distinguishes that from the case-handling information;
- offers an appropriate limited inspection, extract, or supervised access.

This explanation must not rewrite the player's original request as an address demand.

### Step 4 — Deliberate inspection
The player explicitly chooses and performs the permitted inspection.

Permission alone is insufficient.

The resolved action gives the player only the declared handling detail(s), for example the missing recipient signature or another fixture detail selected for M2.

Protected contact information remains unavailable.

If any NPC can observe the act, that NPC receives only declared observable conduct/detail—not the player's private conclusions or unread text.

### Step 5 — Follow-up communication
The player sends a new supported message using the discovered handling detail, such as a bounded challenge/remark about the missing signature.

This is a new command with a new message identity.

### Step 6 — Consequential response
Tamsin's next response must be grounded in:

- the actual follow-up outward communication;
- the information she legitimately already has or has now received;
- declared priorities/rules.

It must not change because of hidden selected-vibe metadata.

The response can offer the next relevant verification step or acknowledge the concrete discrepancy. M2 does not need to complete case recovery.

### Step 7 — Inspector
The read-only inspector must make the causal chain understandable:

- canonical player message;
- outward payload;
- what Tamsin received;
- inspection permission;
- physical action result;
- what the player learned;
- what Tamsin did or did not learn from that action;
- follow-up message;
- eligible response reasoning;
- selected response;
- committed changes;
- protected details withheld.

Opening/refreshing the inspector changes nothing.

---

# 9. Required M0–M2 tests

Use the master as the source of the full acceptance specifications. For this task, implement and report the relevant subset instead of claiming all 69 tests.

At minimum include automated or reproducible checks for the behaviors below.

## Loop / message / preview

- player-initiated compose → preview → send → Intake → Delivery → control;
- preview is non-mutating;
- semantic BASED creates different outward meaning where the fixture defines it;
- salience never changes material target/scope/terms;
- missing art/wording uses fallbacks without mechanical changes.

## Information boundary

- initial keyword/menu does not expose the hidden file split before Tamsin explains it;
- first ordinary paperwork request does not become an address demand;
- NPC input contains no incoming selected vibe label;
- no secret template/asset/cache proxy influences NPC response;
- changing only private selected metadata while keeping outward payload/state/context fixed leaves listener result unchanged;
- hidden source-event fields cannot be read through an observation source link;
- an unlearned hidden-world detail cannot change NPC inference merely because it changed in authoritative state.

## Perception / actions

- permission without inspection reveals no search result;
- performed inspection reveals only declared details;
- visible inspection conduct does not automatically reveal small print;
- duplicate action result cannot apply twice.

## State correctness

- exact retry of committed command returns prior result without duplication;
- same command identity with changed payload is rejected;
- new stale command is rejected with no fictional/gameplay effect;
- read-only inspector refresh causes no mutation;
- switching view/presentation does not duplicate events.

## Portability

Create one tiny renamed/neutral fixture or equivalent test showing the reusable core does not depend on literal strings `Tamsin`, `Nera`, `Last Collection`, or a hidden seed name.

Do not represent unimplemented future tests as passed.

---

# 10. Architecture expectations

You may choose exact filenames, framework, and record field names, subject to the approved behavior.

Prefer:

- browser-independent core rules;
- typed or strongly validated records;
- scenario content separate from core logic;
- deterministic tests;
- a simple offline browser UI;
- manual import/export or another dependable local persistence path;
- no required runtime network dependency.

If you choose TypeScript, explain the build/run process and produce a runnable browser artifact. If you stay in plain JavaScript with rigorous validators/types-by-contract, explain why that is sufficient for M2.

Do not overbuild a plugin framework, ECS, database server, distributed event system, or general semantic-language engine for this slice.

---

# 11. Deliverables at the M2 checkpoint

When M2 is authorized and completed, provide all of the following.

## 11.1 Runnable build
A locally usable browser build for the M2 interaction.

## 11.2 Source
All source and content required to reproduce the build.

## 11.3 Launch instructions
A novice-readable `README` with exact commands/clicks.

State what was actually tested. Do not promise universal double-click behavior unless verified.

## 11.4 M0 inventory/reuse plan
`M0_Baseline_Inventory_and_Reuse_Plan.md`

## 11.5 M1 contract note
`M1_M2_Contract_Note.md`

## 11.6 Test results
A fresh report naming:

- exact code revision/snapshot;
- exact scenario/content revision;
- environment;
- commands executed;
- automated tests passed/failed;
- manual checks performed;
- tests not run;
- known defects.

Never reuse the historical `253 / 29` as new results.

## 11.7 Complete M2 transcript
Show the actual generated path:

`preview/send → Tamsin explanation → permitted inspection → discovered detail → follow-up message → consequential response`

This transcript must come from the runnable implementation, not be hand-written as evidence.

## 11.8 Matching inspector trace
For the same run, show the exact causal/data trace.

## 11.9 Scope report
Use these headings:

- **Completed**
- **Partial**
- **Blocked**
- **Deferred**
- **Design questions discovered**

Do not call M3+ work "partial M2" to hide scope expansion.

## 11.10 Checkpoint identity
If git is used, report the commit hash/tag for tester review. Otherwise provide a reproducible source snapshot/export identity.

---

# 12. Do not do these things

Do not:

- implement M3, M4, M5, or M6;
- implement CR-01 collection closure;
- implement the unapproved missing-preview fallback;
- finish Seed A recovery;
- implement full Seed B payment/nonpayment;
- write all 360 BASED coverage cases;
- reduce the final twenty-vibe target;
- replace Offer/Request/Remark with Ask/Tell/Trade or historical DPA controls;
- use the incoming selected vibe as an NPC reaction key;
- simulate the human player's private sincerity/personality;
- expose private contact information to make the demo convenient;
- hard-code Tamsin's name into core response logic;
- build combat, attack, theft, pickpocket, stealth, sight cones, or full hearing;
- build a general promises engine;
- add runtime generative AI;
- build a full rule-authoring language;
- implement live editing of a running encounter;
- auto-convert old saves;
- overwrite the supplied old executable;
- silently invent missing old tests/source archives;
- report planned tests as executed tests;
- launch subagents or additional specialist agents without owner authorization.

---

# 13. How to handle ambiguity or conflict

If you encounter a conflict:

1. preserve the highest-authority approved behavior;
2. prefer the narrowest M2-compatible implementation;
3. document the conflict in the M1 note;
4. distinguish owner-facing behavior from internal field/layout choices;
5. stop and ask only when the choice would change user-visible behavior or violate an approved invariant.

Equivalent implementation details may be decided and documented by you.

Do not convert a difficult design requirement into a simpler but different behavior without reporting it.

---

# 14. Definition of done for this task

This task is done only when:

### M0
- the real baseline/workspace is inventoried;
- reuse/supersession is documented;
- actual runnable tests are distinguished from historical reports.

### M1
- the M2 contracts and update order are explicit;
- duplicate/stale handling is reconciled;
- private/outward/NPC/public/author views are explicit;
- the independent tester has a precise checkpoint to review.

### M2
- only after the M1 gate is cleared;
- the ordinary paperwork interaction runs end to end;
- the player deliberately performs an inspection;
- knowledge is filtered correctly;
- a later response is causally grounded in legitimate information;
- Intake and Delivery remain distinct even with text fallbacks;
- hidden selected-vibe metadata cannot influence listener results;
- commands/effects are idempotent and stale-safe;
- the inspector explains the actual cause chain without mutating it;
- the build, source, run instructions, actual tests, transcript, inspector trace, and checkpoint identity are delivered.

Then **stop**.

Do not continue to M3 without a new owner instruction.
