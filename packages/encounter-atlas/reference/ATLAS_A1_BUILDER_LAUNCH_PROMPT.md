# ATLAS v0.1 — BUILDER LAUNCH PROMPT
## Milestone A1: Read-Only Person Inspection + Source Tracing

You are the **Atlas Builder** for the Encounter project.

This is the first implementation pass after the completed Atlas Jargon Translation Audit.

Your job is to build **one tightly scoped, independently testable Atlas checkpoint**.

Do not expand the milestone beyond the scope below.

---

# 1. What Atlas Is

Atlas is a **developer-facing workbench for Encounter**.

It exists because Encounter is technically capable but difficult for its owner to use directly due to dense internal terminology, implementation-heavy structures, IDs, projections, provenance, schemas, and related jargon.

The governing design principle is:

> **The developer works in understandable human concepts; Atlas handles Encounter's underlying machinery.**

Atlas is not a player mechanic and not a replacement for Encounter.

Encounter remains canonical.

Atlas should translate, organize, inspect, and explain Encounter data without inventing a second source of truth.

---

# 2. Authoritative Inputs

Before changing any code, locate and review the current project materials.

Treat the following as required design inputs:

- `ATLAS_PLAIN_LANGUAGE_VOCABULARY.md`
- `ATLAS_FIRST_WORKFLOWS.md`
- `ATLAS_AUDIT_REPORT.md`

Also locate and verify the current accepted Encounter / AR0 baseline identified by the audit:

- frozen AR0 R1 checkpoint;
- source revision `AR0-projection-v1-R1-D01`;
- accepted M3 R3 gameplay foundation;
- adjacent AR0 R1 identity and verification records;
- independent AR0 R1 acceptance report/evidence;
- validated Last Collection saves / proof exports;
- current catalog / package used by the accepted checkpoint;
- current tests and relevant source.

The audit identified the delivered R1 tree as:

`outputs/Encounter_AR0_R1`

and the frozen checkpoint as the accepted basis.

Do not silently substitute an older AR0 or M3 version.

If the current local project structure differs, report exactly what you found before implementation.

---

# 3. Required Preflight

Before coding:

1. Confirm the authoritative Encounter/AR0 version.
2. Confirm the three audit documents are present and readable.
3. Re-run the relevant existing checkpoint tests.
4. Confirm the existing accepted checkpoint is green before Atlas changes.
5. Identify the current read-only seam Atlas will consume.
6. State which existing files/modules will remain untouched.
7. State where the new Atlas implementation will live.
8. State how you will ensure Atlas remains read-only.

Then proceed unless a blocking inconsistency is discovered.

If you find a mismatch between:
- audit assumptions,
- implementation,
- saved fixtures,
- or accepted test evidence,

stop and report it instead of guessing.

---

# 4. Milestone Scope

Implement only:

# **Read-Only Person Inspection + Source Tracing**

The user must be able to:

1. open a validated supported Last Collection snapshot/run;
2. select a Person;
3. read a plain-language summary of that Person;
4. distinguish:
   - received information;
   - reports / things they were told;
   - beliefs;
   - suspicions / concerns;
   - ownership / current holding relations when directly supported;
   - relevant connections;
5. expand an assertion to see its **Source / How this information arrived**;
6. optionally expand **Encounter details** to inspect the underlying technical record;
7. do all of the above without changing Encounter state.

This is the whole milestone.

---

# 5. Strong UI Requirement

This first prototype should already feel like **Atlas**, not like a JSON debugger.

The exact layout is your implementation choice, but the normal experience must use plain-language Atlas terminology.

A reasonable structure is:

## Person list / selector

Show available People by readable name.

Stable identity must remain available for disambiguation.

Do not identify or merge People by label text alone.

## Main Person summary

Use plain headings such as:

- Identity
- Received information
- Reports
- Beliefs
- Concerns
- Owns
- Currently holds
- Connections

Only show sections that are semantically supported.

Do not invent missing categories or simulate unsupported state.

## Source expansion

Every meaningful information/belief/report assertion included in this milestone should allow the developer to inspect its source or support path where the current foundation provides it.

Use wording such as:

- Source
- Reported by
- Received from
- Based on
- Earlier source
- How this information arrived

Do not expose `sourceRefs`, `roots`, or similar jargon as the normal label.

## Encounter details

Provide an expandable technical/debug area containing the precise underlying data needed to diagnose the record, such as:

- stable IDs;
- original field/type names;
- exact raw values;
- source references;
- technical basis;
- relevant run/source identity.

The normal Atlas summary and the technical Encounter detail must remain visibly distinct.

---

# 6. Required Plain-Language Rules

The audit is normative for wording.

In normal Atlas use, prefer translations such as:

- `actor` → **Person**
- projection audience → **Full developer view / Player-received view**
- observation → **Received information**
- claim → **Reported by / Was told**
- belief `accepted` → **Believes**
- belief `suspected` → **Suspects**
- belief `disputed` → **Conflicting evidence**
- provenance → **Source / How this information arrived**
- custody / holds → **Currently held by**
- runtime event → **During this run**
- technical source paths / IDs → behind **Encounter details**

Do not mechanically rename fields without checking semantics.

If a source cannot support a friendly translation safely, show a neutral fallback such as:

> **Untranslated Encounter detail**

and expose the raw value in Encounter details.

Never guess.

---

# 7. Critical Semantic Rule

The most important Atlas rule is:

> **Do not collapse what happened, what someone received, what someone was told, and what someone believes into one generic concept such as “Knows.”**

These are different Encounter meanings.

Atlas must preserve them.

For example:

- a person can receive a report without witnessing the event;
- a person can receive a report without believing it;
- an NPC can believe something that is not canonical world truth;
- no local record does not mean the person “knows nothing”;
- hidden state is not the same as empty state.

Use precise plain language.

---

# 8. Other Distinctions That Must Not Be Flattened

Preserve all of the following:

- Person identity vs display name;
- canonical identity vs alias/reference;
- owner vs current holder;
- current holder vs earlier location evidence;
- direct receipt vs report;
- received evidence vs belief;
- belief vs objective world state;
- absence of a modeled record vs a negative fact;
- player-received information vs full developer state;
- participant vs observer vs mention;
- proposal vs acknowledgment vs exact confirmation vs completed result;
- warning vs restriction vs repair vs closure;
- current state vs earlier evidence/history.

Do not simplify these into generic “relationships,” “knowledge,” “location,” “accepted,” or “history” labels when that would change meaning.

---

# 9. Read-Only Architecture

Atlas must not become a parallel state system.

For this milestone:

- no writes;
- no mutation of Encounter;
- no mutation of AR0;
- no editing controls;
- no “fix” buttons;
- no automatic repair;
- no hidden write path;
- no Atlas-owned canonical gameplay data.

Derived view-model data is allowed, but it must be disposable and reproducible from the authoritative Encounter/AR0 input.

Atlas should consume the existing read-only projection / inspection seam rather than cloning gameplay logic.

If you introduce an adapter or view-model layer, keep it small, explicit, deterministic, and presentation-oriented.

---

# 10. Required Person Cases

The first checkpoint must work against at least these semantic test cases.

## Orrin

Use Orrin to prove bounded reporting and source tracing.

Required behavior:

- Orrin remains the correct Person/speaker.
- His information about an **unidentified wrapped case** must remain unidentified.
- Do not silently convert it into Nera's owned instrument case.
- Do not add destination, purpose, or details he did not receive.
- A report remains distinguishable from direct evidence.
- Source expansion shows how the relevant information arrived.

## Nera

Use Nera as the absent-person and identity-isolation case.

Required behavior:

- exactly one correct Nera Person;
- no Orrin observations installed under Nera;
- absence does not become “knows nothing”;
- use wording such as:
  - **No received information recorded in this run**
  - or **This person has no modeled local state**
  where semantically appropriate;
- her owner relationship can be shown without implying she currently holds the object or received the encounter.

## Tamsin

Use Tamsin to prove evidence and belief are separate.

Required behavior:

- received evidence can be inspected separately;
- belief can be shown as **Tamsin believes...**;
- belief is not presented as objective world truth;
- the source/support behind the belief is traceable where current records allow;
- disputed/suspected states retain their actual meaning if encountered.

## Human / Collector

Use the human participant to prove receipt does not imply simulated psychology.

Required behavior:

- received information can be shown;
- do not invent human beliefs, motives, sincerity, trust, fear, feelings, or NPC-style psychology.

---

# 11. Identity Requirements

AR0 R1 fixed an identity collision involving Orrin and Nera.

Do not regress that fix.

Atlas must:

- use stable canonical identity;
- never merge by name similarity;
- never merge by label equality;
- never infer identity from ID prefix;
- preserve legitimate aliases/reference bindings;
- expose identity under Encounter details when useful;
- clearly distinguish duplicate display names if a fixture contains them.

A malformed catalog that attempts to bind conflicting canonical actors must fail safely before Atlas displays misleading Person data.

---

# 12. Missing / Hidden / Unsupported Data

Missing data must be described accurately.

Allowed patterns include:

- **No received information recorded in this run**
- **Not shown in this view**
- **This person has no modeled local state**
- **Not recorded**
- **Unsupported in this Encounter version**

Do not turn absence into claims such as:

- “Knows nothing”
- “Nobody saw this”
- “This never happened”
- “No one believes this”
- “Safe to delete”
- “No relationship exists”

unless the current records actually establish that statement.

---

# 13. Source Tracing Rules

Source tracing is central to this milestone.

Where supported, the developer should be able to move from a readable assertion to:

1. the immediate source;
2. the person/report/evidence/message/result that supplied it;
3. earlier supporting roots/citations where available;
4. the original technical record under Encounter details.

Preserve source type.

Do not make repeated copies look like independent corroboration.

Do not reveal hidden content merely because an ID/reference exists.

For character-scoped evidence, distinguish:

- full developer source inspection;
- the fragment actually received by the person.

---

# 14. Progressive Disclosure

Normal Atlas view:

- human-readable;
- concise;
- plain-language;
- source-aware;
- stable identity only when necessary.

Technical Encounter details:

- exact record shape;
- IDs;
- source references;
- type tags;
- raw values;
- implementation vocabulary.

The owner should not need Encounter vocabulary to use the normal Person view.

The technical layer must still be available for diagnosis.

---

# 15. Implementation Form

For this first Atlas milestone, prefer a **browser-based developer interface** unless the existing project already provides a clearly superior local developer surface.

Keep rendering separate from the read-only adapter/view model.

Conceptually:

Encounter / AR0
    ↓
Atlas read adapter
    ↓
Atlas Person view model
    ↓
Browser developer UI

Do not make the browser DOM or UI components the canonical data representation.

Do not begin Unity integration in this milestone.

---

# 16. Explicitly Out of Scope

Do not implement any of the following in A1:

- Thing browser beyond minimal Person-linked owner/holder context;
- full Thing inspection;
- full Event browser;
- complete timeline;
- complete before/after diff;
- network/graph visualization;
- Atlas editing;
- create/delete Person;
- relationship editing;
- belief editing;
- source editing;
- automatic identity merging;
- dependency/deletion impact analysis;
- universal contradiction detection;
- generalized world simulation;
- generic inventory system;
- generalized location system;
- friendship/trust/fear meters;
- debt/promise/need/goal systems;
- full BASED editor;
- player journal;
- natural-language query engine;
- AI-generated summaries;
- Unity/Adventure Creator integration;
- Room Creator integration;
- multi-project/global-world merging.

Do not “prepare” these by adding speculative architecture unless strictly necessary for A1.

---

# 17. No Generative Interpretation

Atlas v0.1 should not use an LLM or freeform generated prose to explain state.

Readable statements should be deterministic translations/templates derived from verified Encounter records.

Examples:

Good:

> **Tamsin believes:** The case was moved to protect it.  
> **Based on:** Document evidence received earlier.

Bad:

> Tamsin seems convinced that someone was probably trying to do the right thing.

The second invents interpretation.

---

# 18. Required Validation Behavior

Atlas should surface existing validation failures clearly.

At minimum, preserve current detection/handling of:

- conflicting canonical identity bindings;
- invalid/missing references in supported validated structures;
- incompatible content/catalog;
- invalid replay/snapshot;
- existing recorded technical defects where exposed.

Do not advertise a universal semantic validator.

Do not silently fix bad input.

---

# 19. Required Tests for A1

Add focused Atlas tests without weakening or replacing the existing Encounter/AR0 tests.

At minimum independently exercise:

1. Orrin source/report path.
2. Nera identity isolation.
3. Tamsin belief vs received evidence.
4. Human received information with no invented beliefs.
5. same-name or renamed Person fixture.
6. conflicting Orrin/Nera catalog fails safely.
7. repeated read is pure.
8. exact save/load produces the same Person summary/source path.
9. Atlas inspection creates no new Event/effect/command.
10. hidden / empty / unmodeled data produce distinct wording.
11. technical details expose stable identity without changing the readable summary.
12. unsupported relation/record types do not receive invented friendly meanings.

All existing Encounter/AR0 tests must continue to pass.

---

# 20. Read-Purity Test

This is a hard acceptance requirement.

Take a validated Encounter run.

Record its authoritative serialized state / digest / journal / revision as appropriate.

Open and inspect multiple People in Atlas.

Expand sources and Encounter details repeatedly.

Close/reopen or rerender Atlas if supported.

Then verify:

- no run revision changed;
- no journal entry was added;
- no Event was created;
- no message was sent;
- no result/effect occurred;
- no belief changed;
- no source changed;
- no catalog/package state changed.

Atlas inspection must be demonstrably read-only.

---

# 21. Deliverable

Produce a checkpoint package for independent testing.

Use a clear milestone name, for example:

`Atlas_A1_Person_Source_Inspection_Checkpoint`

The checkpoint should include:

- implementation;
- tests;
- launch/run instructions suitable for a novice owner;
- exact authoritative Encounter/AR0 dependency identification;
- a concise architecture note;
- acceptance checklist;
- test output/evidence;
- list of files added/changed;
- confirmation that Encounter and AR0 canonical behavior were not modified;
- known limitations.

Also create:

`ATLAS_A1_BUILDER_REPORT.md`

The report must state:

1. what was built;
2. what was deliberately not built;
3. which Encounter/AR0 files were used;
4. which existing files were modified, if any;
5. how read-only behavior is enforced;
6. how Atlas plain-language translation is implemented;
7. how source tracing works;
8. exact test counts/results;
9. known gaps;
10. what the independent Tester should attack.

---

# 22. Independent Tester Handoff

Create:

`ATLAS_A1_INDEPENDENT_TESTER_HANDOFF.md`

It should instruct a separate Tester chat to treat your checkpoint as untrusted and actively try to break:

- identity isolation;
- source attribution;
- report vs direct evidence;
- belief vs truth;
- empty vs hidden vs unmodeled state;
- same-name identity handling;
- malformed references;
- read purity;
- save/load determinism;
- technical-detail accuracy;
- unsupported-type fallback;
- accidental mutation of Encounter.

Do not conduct the independent review yourself as a substitute.

Builder tests are not independent acceptance.

---

# 23. Stop Condition

When A1 is complete:

**STOP.**

Do not continue into:

- Things;
- full Events;
- recorded changes UI;
- graphs;
- authoring;
- editing;
- broader Atlas architecture.

Return the checkpoint and reports for independent testing.

Expansion happens only after A1 passes the separate Tester chat.

---

# 24. Completion Standard

A1 is successful if the owner can open Atlas, select Orrin/Nera/Tamsin/the human participant, and understand the important Person information **without needing to know Encounter's internal jargon**, while still being able to expand Source and Encounter details and verify the exact underlying data.

The readable interface must be simpler than Encounter.

The underlying meaning must remain just as precise.

Do not trade semantic accuracy for friendliness.

---

# 25. Final Builder Response

When finished, respond with a concise summary containing:

1. authoritative baseline used;
2. what A1 implements;
3. test result;
4. proof that inspection is read-only;
5. checkpoint location/package;
6. Builder report;
7. independent Tester handoff;
8. any blocker or known limitation that should be understood before testing.

Do not propose or begin A2 until independent testing of A1 is complete.
