# Encounter → Atlas Foundation
## Atlas Concept and Encounter Atlas-Readiness Pass v0.1

**Status:** Owner-authorized planning/execution handoff for a narrow Encounter readiness pass  
**Date:** 2026-10-18  
**Purpose:** Prepare the independently accepted Encounter M3 R3 baseline so a future **Atlas** can read it cleanly without changing existing Encounter gameplay behavior.

---

# 0. Start Here

This document defines two connected ideas:

1. **Atlas** — the human-readable translation layer over Encounter.
2. **AR0 / Atlas Readiness** — a deliberately narrow structural pass on Encounter that makes its existing state easier for Atlas to read.

The intent is **not** to build Atlas yet.

The intent is **not** to redesign Encounter.

The intent is **not** to begin M4, Seed B, the full Assembler, NPC initiation, Trapstar navigation, combat, crime, faction simulation, procedural rumor systems, or any other broad future feature.

The immediate goal is:

> **Take the already working M3 Encounter system and give its important people, places, things, groups, events, scenarios, and relationships clean stable identities and readable projections, while preserving all existing M3 behavior.**

Atlas can then be built on top of that foundation.

---

# 1. Canonical Encounter Baseline

The Atlas-readiness work begins from the independently accepted M3 R3 checkpoint.

**Canonical checkpoint**

`Encounter_M3_Checkpoint_R3.zip`

**SHA-256**

`615ddc79e0f7bd8d903411401360fc321b7b916abcc69dc974e9673fd0e74c87`

**Source revision**

`M3-runtime-v1-R3-D03`

**Source digest**

`a609f63c56ed1e047f44e8f3ef28b21f91adec9e40e35d08eb988d0e78de9362`

**Runnable build SHA-256**

`8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb`

**Content revision**

`M3-protective-shortcut-v1`

**Package**

`package_0003`, revision `1`

**Package digest**

`2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f`

The independent M3 R3 re-review ended with:

> **READY FOR NEXT SCOPE**

M3-D01, M3-D02, and M3-D03 were independently verified fixed. No new browser-reproducible or realistically reachable M3 blocker remained in the bounded review.

The contradictory synthetic-geometry case remains documented as a **non-blocking hardening limitation**. Do not reopen it in AR0 unless a realistic production/browser path is newly demonstrated.

**Preserve this M3 R3 artifact byte-for-byte.** Work in a new copy/workspace and freeze a new Atlas-readiness checkpoint rather than overwriting the accepted M3 archive.

---

# 2. Atlas in Plain Language

Atlas is not a new simulation.

Atlas is not a second copy of the world.

Atlas is not a replacement for Encounter.

Atlas is:

> **The readable layer that explains what Encounter knows in normal human terms.**

Encounter can continue to store precise internal records such as:

- who owns an item;
- who currently holds it;
- who witnessed an event;
- what one NPC was told;
- what that NPC believes;
- what permission was granted;
- whether a physical action actually occurred;
- whether a warning is active;
- whether a transaction is pending;
- what changed after a committed action.

Atlas translates that into something a designer can read quickly:

> **Nera owns the instrument case.**  
> **The player currently holds it.**  
> **Tamsin saw the relevant handling record.**  
> **Orrin only reported seeing a wrapped case.**  
> **Tamsin warned the player not to demand the private file again.**  
> **Recovery is complete.**

The important architectural rule is:

> **Encounter remains the source of truth. Atlas reads and explains it.**

Atlas must not maintain an independent competing copy of ownership, knowledge, warnings, inventory, events, relationships, or scenario state.

---

# 3. The Three-Layer Mental Model

Use this model throughout AR0 and later Atlas work.

## Layer A — Encounter

Machine-readable rules and state.

Encounter answers questions such as:

- What actually happened?
- Who owns this?
- Who holds this?
- Who received this observation?
- What did this NPC hear?
- What does this NPC currently believe?
- Was permission granted?
- Did the physical action actually occur?
- Is this warning active?
- Was the offer confirmed?
- Did money actually move?
- Did recovery complete?

This layer may remain technical.

## Layer B — Atlas

Designer-readable translation.

Atlas answers:

- Who is this person?
- What do they know?
- What do they merely suspect?
- What happened between us?
- What does this object connect to?
- Where did this event happen?
- Who belongs to this group?
- Why did this NPC respond this way?
- What changed recently?
- Which cards are relevant to this scenario?

Atlas turns structured records into readable cards, links, and short explanations.

## Layer C — Actual game presentation

What the player experiences through Trapstar or another host game.

The player may simply see:

> Tamsin folds her arms.  
> “I told you. I can show you the case record, not her private information.”

The player does not need to see Encounter's internal state or the full Author Atlas.

---

# 4. Atlas Is One System, Not One Atlas Per Scenario

There should be **one Atlas system**.

A scenario does not receive a separate Atlas engine.

Instead:

> **A scenario contributes cards and relationships to Atlas, and can have its own Scenario Card that acts as an index into the relevant subset.**

For example, **Last Collection** would have a Scenario Card.

That card might link to:

### People
- Tamsin
- Orrin
- Nera
- Player, if represented as a card

### Places
- Transport Office
- any other semantically meaningful authored place already supported by the scenario

### Things
- Nera's Instrument Case
- Collection Ticket
- relevant customer/handling record objects where they are meaningful world entities

### Events
- original collection/handling record event
- recovery visit
- privacy restriction/warning
- supervised comparison
- case handover

### Groups
Only if a real group exists in the authored scenario. Do **not** invent a group just to fill the category.

The Scenario Card is analogous to an index page in a wiki. It points to relevant cards.

It does **not** duplicate those cards.

Later, Trapstar can contain many Scenario Cards that all point to shared persistent cards.

For example, five scenarios might all reference the same **Marcus** Person Card rather than creating five separate Marcuses.

---

# 5. Core Atlas Card Types

AR0 should prepare Encounter to support these six semantic card kinds.

They are broad categories, not a demand for a huge ontology.

## 5.1 Person

A human or person-like actor relevant to Encounter.

Examples:

- Tamsin
- Orrin
- Nera
- Marcus
- Keisha

A Person Card may eventually expose:

- name;
- short description;
- role;
- affiliations;
- important relationships;
- current location reference;
- what the person knows;
- what they were told;
- what they believe or suspect;
- important warnings or boundaries;
- permissions/authorities;
- important history;
- current relevant state.

**Important:** The human player may be represented as a Person/Actor card for factual state, inventory/custody, permissions, received information, and history. Do **not** give the human player a simulated private psychology, hidden motive, sincerity score, or machine-authored feelings. Preserve the existing human-player asymmetry.

## 5.2 Place

A semantically meaningful location.

Examples:

- Transport Office
- Blue Room
- South End
- Warehouse

A Place Card may eventually expose:

- name;
- short description;
- parent area;
- owner/operator;
- people associated with it;
- things located there;
- groups associated with it;
- important events that occurred there;
- optional opaque host-world reference.

**Critical boundary:** Atlas/Encounter Place cards describe **meaning**, not geometry.

Encounter still must not own:

- floor plans;
- paths;
- rails;
- lanes;
- cover nodes;
- doors as geometry;
- line-of-sight calculations;
- spawning;
- locomotion;
- sprite facing;
- Room Creator geometry.

A Place Card may point to an opaque host reference such as a Room Creator location ID. It must not pull host geometry into Encounter core.

## 5.3 Thing

A meaningful object, document, item, vehicle, key, weapon, package, or other persistent object.

Examples:

- Nera's Instrument Case
- Collection Ticket
- Blue Buick
- Marcus's phone
- staff key
- a specific document

A Thing Card may eventually expose:

- name;
- short description;
- owner;
- current holder/custodian;
- current semantic location;
- associated people;
- associated events;
- evidence relevance;
- important history.

Ownership and physical possession/custody must remain separate.

## 5.4 Group

An organization, crew, business, family, team, faction, department, or other meaningful collective.

Examples:

- South End Crew
- Blue Room Staff
- City Watch
- police department
- a family

A Group Card may eventually expose:

- name;
- short description;
- members;
- associated places;
- relationships to other groups;
- notable events;
- shared authored policies or affiliations if Encounter later needs them.

**Do not build a faction simulator in AR0.**

Group only needs to become a valid stable semantic entity/card type.

If Last Collection has no meaningful Group, support the type generically and test it with neutral fixtures. Do not invent story content.

## 5.5 Event

A meaningful happening in the world.

Examples:

- Case Recorded as Collected
- Recovery Visit
- Tamsin Issues Warning
- Friday Night Fight
- Blue Buick Theft
- Case Handover

An Event Card is extremely important because events can connect people, places, things, groups, observations, reports, and beliefs.

An Event Card may eventually expose:

- stable event identity;
- readable label;
- short description;
- order/time if available;
- participants;
- relevant things;
- location reference;
- groups involved;
- resulting state changes;
- observers;
- reports about the event;
- related evidence.

**Do not turn every UI click or low-level command into an Atlas Event.**

Atlas Events should represent meaningful world/social happenings.

Drafting text, opening a panel, previewing, replaying, scrolling, or clicking an inspector are not world events.

## 5.6 Scenario

A playable or test situation that groups relevant cards without duplicating them.

Examples:

- Last Collection
- Retrieve Marcus's Car
- Warehouse Meeting

A Scenario Card may eventually expose:

- name;
- short description;
- goals or author summary;
- relevant people;
- relevant places;
- relevant things;
- relevant groups;
- important events;
- current scenario status;
- scenario-specific authored starting conditions.

A Scenario Card is an **index into shared cards**, not a private Atlas database.

---

# 6. Two Atlas Views

Future Atlas should have two views over the **same underlying card/link projection**.

AR0 should prepare one data source capable of supporting both.

## 6.1 Article View

Primary view.

Wiki-like.

The designer clicks a card and reads a concise article.

Example:

### Tamsin

**Role**  
Transport-office employee handling the collection request.

**Knows**
- player has verified collection authority;
- relevant case handling information;
- the bounded facts she actually received.

**Believes / suspects**
- only what her existing Encounter belief state supports.

**Current boundaries**
- private information remains protected;
- case-only comparison remains viable;
- warning status if active.

**Can currently do**
- actions/permissions actually available under Encounter state.

**Important history**
- relevant committed events.

Every linked person/place/thing/group/event/scenario should be clickable in future Atlas.

## 6.2 Network View

Secondary view.

The same cards and relationships become a graph.

Example:

`Tamsin → works at → Transport Office`

`Nera → owns → Instrument Case`

`Player → currently holds → Instrument Case`

`Case Handover → involved → Instrument Case`

`Case Handover → happened at → Transport Office`

`Orrin → reported about → Case Movement`

This graph is **not** a second store.

It is another presentation of the same normalized relationships used by Article View.

Avoid building a visually impressive graph that has different semantics from the readable article view.

---

# 7. Author Atlas vs Player Atlas

Do not build polished Atlas UI in AR0, but prepare the information boundary correctly.

Future Atlas should be able to support at least two projections.

## 7.1 Author Atlas

Can show full legitimate author/debug truth:

- actual world facts;
- true owner/holder;
- concealed facts;
- NPC-local observations;
- NPC reports;
- NPC beliefs/hypotheses;
- player-known information;
- causal history;
- hidden scenario state where appropriate.

## 7.2 Player Atlas / Notebook

Optional future feature.

Can show **only** information the player has legitimately received.

It must not reveal:

- hidden world truth;
- unseen item locations;
- NPC private beliefs;
- NPC private observations;
- unrevealed groups/events;
- secret future consequences.

AR0 should therefore preserve and expose visibility/provenance clearly enough that a future Atlas projection can distinguish:

- author truth;
- actor-local knowledge;
- player-known information.

Do not weaken Encounter's existing information boundaries for convenience.

---

# 8. The Most Important Atlas Principle: No Duplicate Truth

Never create:

**Encounter truth**  
and separately  
**Atlas truth**

for the same fact.

Bad:

- Encounter says Nera owns the case.
- Atlas metadata separately says Tamsin owns the case.

Good:

- Encounter remains authoritative.
- Atlas asks the Encounter projection who owns the case.
- Atlas renders: “Nera owns the instrument case.”

Some readable descriptive metadata may be authored directly for cards, such as:

- display name;
- short description;
- category;
- optional author notes.

But mutable game facts should come from the authoritative Encounter state or a clearly owned host input.

---

# 9. AR0 — Encounter Atlas-Readiness Pass

Treat this as a small interstitial foundation pass.

Suggested name:

> **AR0 — Encounter Atlas Readiness**

AR0 is **not M4**.

Do not relabel M4.

Do not implement M4 behavior.

The desired output is a new frozen checkpoint descended from accepted M3 R3.

The exact internal naming may be refined, but do not overwrite the accepted M3 R3 artifact.

---

# 10. AR0 Required Structural Additions

## 10.1 Stable semantic IDs

Every Atlas-addressable entity must have a stable unique ID.

At minimum support:

- Person
- Place
- Thing
- Group
- Event
- Scenario

Requirements:

- deterministic within the authored package/run;
- unique within the relevant namespace;
- safe for linking;
- stable through save/load;
- not derived from mutable display text;
- renaming a display label must not silently create a different entity;
- IDs must not encode scenario-specific policy branches.

Examples are illustrative only:

- `person:tamsin`
- `place:transport_office`
- `thing:nera_case`
- `event:case_handover`
- `scenario:last_collection`

Do not expose ugly IDs as the primary Atlas wording.

## 10.2 Explicit semantic kind

Every Atlas-addressable entity must declare a kind:

- person
- place
- thing
- group
- event
- scenario

Atlas must not infer card type from naming conventions.

## 10.3 Readable metadata

Every card-addressable entity should support:

- display name;
- concise description;
- optional tags/categories only where useful.

Descriptions are presentation metadata, not mutable world truth.

Do not force prose into policy.

Do not branch game behavior on display names or descriptions.

## 10.4 Explicit relationships / links

Add or expose a normalized relationship mechanism that can support readable Atlas links.

Keep the initial vocabulary small and extensible.

Useful first relationships include concepts such as:

- owns;
- currently holds / has custody of;
- located at;
- works at;
- member of;
- affiliated with;
- involved in;
- happened at;
- witnessed;
- was told about;
- reported;
- knows about;
- related to.

Do not force every existing Encounter concept into one generic relationship if doing so destroys important semantics.

For example:

- direct observation;
- reported claim;
- belief/hypothesis;
- world truth

must remain meaningfully distinct.

Atlas may render them as readable links, but Encounter must not collapse them into one “knows” relation internally.

## 10.5 Meaningful Event records

Create or expose a clean Atlas-addressable representation for meaningful events.

Two broad event sources are expected:

### Authored historical events
Events already true at scenario start.

Example:

- a prior case movement/record event.

These receive stable authored IDs.

### Runtime committed events
Meaningful happenings that occur during play.

Examples:

- warning delivered;
- supervised comparison performed;
- handover committed.

Runtime Event identity should be stable and linked to existing committed journal/result identity rather than regenerated differently every time Atlas renders.

Do not create events for:

- drafts;
- previews;
- replay;
- inspector reads;
- UI navigation;
- scrolling;
- uncommitted attempts.

## 10.6 Scenario membership

Support many-to-many membership/relevance.

A card can be relevant to multiple scenarios.

A scenario links to shared cards rather than copying them.

Requirements:

- Last Collection should expose a Scenario identity;
- relevant Person/Place/Thing/Event cards can be enumerated for that scenario;
- Group support exists even if Last Collection has none;
- a future shared Person such as Marcus can belong to multiple scenarios while remaining one Person.

## 10.7 Visibility / knowledge projection

Expose enough structured provenance for a future Atlas reader to ask:

- What is world truth?
- What does Person A know?
- What was Person A merely told?
- What does Person A believe/suspect?
- What does the player know?
- What remains hidden from the player?

Preserve existing M3 rules:

- actor-local observations remain local;
- claims remain claims;
- beliefs remain fallible;
- hidden world truth does not leak into NPC social policy;
- absent actors do not magically receive events;
- player state records received information without inventing player psychology.

## 10.8 Recent meaningful changes

Provide a pure/read-only projection that can answer:

> **What meaningfully changed?**

Examples:

- Tamsin learned a new relevant fact.
- Tamsin issued a warning.
- Player gained permission for a bounded action.
- Player completed an inspection.
- Case custody moved from office to player.
- Nera remained owner.
- Recovery completed.

Prefer deriving this from already committed journal/results rather than creating a second mutable truth feed.

Do not include ordinary UI activity.

The recent-changes projection must not mutate the run.

## 10.9 Read-only Atlas projection/export seam

AR0 should expose a simple machine-readable projection that a future Atlas UI can consume.

This can be an API/module/exported JSON structure or equivalent.

It should be capable of returning, at minimum:

- card summaries;
- stable IDs;
- card kinds;
- readable labels/descriptions;
- relationships/links;
- scenario membership;
- relevant event references;
- author visibility/provenance;
- player-known projection where already supportable;
- recent meaningful changes.

This is **not Atlas UI**.

A small proof JSON/export is encouraged because it gives the tester and future Atlas builder something concrete to inspect.

The projection must be:

- read-only;
- deterministic for the same save/run;
- non-mutating;
- safe to call repeatedly;
- save/load stable;
- free of host geometry.

---

# 11. Last Collection as the AR0 Proof Case

Use Last Collection to prove the structure without changing its gameplay.

The expected conceptual result is something like this.

## Scenario

**Last Collection**

Links to the relevant existing cards.

## People

**Tamsin**  
**Orrin**  
**Nera**  
**Player** if the implementation chooses to expose the player as an Atlas-addressable actor card.

## Places

At minimum the semantically relevant transport-office location if the authored package can support it cleanly.

Do not invent extra geography.

## Things

Use only meaningful existing authored things.

Likely examples include:

- Nera's Instrument Case;
- collection authority/ticket;
- relevant record/document entities where they are represented as meaningful objects.

Do not fabricate object cards merely to satisfy a quota.

## Events

Map meaningful existing history and runtime outcomes into stable Event identities where justified.

Likely examples include:

- original handling/collection record event;
- recovery visit;
- explicit warning;
- supervised comparison;
- case handover.

Use the actual source material and current M3 state. Do not invent narrative events unsupported by the package.

## Groups

If Last Collection has no meaningful group, expose zero scenario groups.

Still demonstrate generic Group schema/validation through neutral tests or a tiny non-story fixture if needed.

---

# 12. Example Readable Projections

These are examples of desired **translation style**, not exact required dialogue.

## Thing

### Nera's Instrument Case

**Owner**  
Nera

**Current holder**  
Player

**Related scenario**  
Last Collection

**Important events**
- handling/collection history;
- supervised comparison;
- handover.

Atlas should not imply ownership changed merely because custody changed.

## Person

### Tamsin

**Role**  
Transport-office employee involved in the collection request.

**Knows**  
Only supported actor-local information.

**Was told**  
Reports must remain distinguished from direct observation.

**Believes / suspects**  
Only existing supported belief/hypothesis state.

**Current boundaries**  
Readable projection of active restriction/warning state where applicable.

**Important history**  
Links to committed meaningful events.

## Event

### Case Handover

**Participants**
- player;
- Tamsin or relevant releasing party as supported.

**Thing**
- Nera's Instrument Case.

**Result**
- custody changes exactly once;
- Nera remains owner;
- zero payment in Seed A.

**Scenario**
- Last Collection.

This readable output must be derived from canonical Encounter state/result records, not maintained as a separate mutable summary.

---

# 13. Host / Trapstar Boundary

Preserve the architectural boundary already established.

Encounter / Atlas may represent semantic facts such as:

- Marcus is associated with Blue Room;
- Friday Night Fight happened at Blue Room;
- Player received permission to enter the back room;
- an external host reported that Marcus witnessed a weapon draw.

Encounter / Atlas must **not** take ownership of:

- map geometry;
- floor plans;
- routes;
- rails;
- NPC movement lanes;
- pathfinding;
- cover/hiding nodes;
- line of sight;
- hearing simulation;
- spawning/despawning;
- locomotion;
- combat positioning;
- sprite facing;
- rendering angle;
- billboarding;
- 3D presentation.

A future Place card may store an opaque host reference such as:

`host_location_ref`

but Encounter must not interpret that reference as geometry.

Conceptually:

1. Host world determines that something physical happened.
2. Host determines observable fragments.
3. Encounter records allowed observations/results.
4. Encounter updates social/semantic state.
5. Atlas translates that state for a human.
6. Host remains responsible for physical presentation and navigation.

---

# 14. Preserve All Accepted M3 Behavior

AR0 is structural.

Existing M3 behavior should remain semantically unchanged.

At minimum preserve:

- compose → preview → send;
- NPC Intake and Delivery distinction;
- canonical sent communication distinct from interpretation;
- player BASED performance semantics;
- previews do not mutate state;
- first ordinary paperwork request remains protected;
- permission does not perform a physical action;
- saying Yes does not itself move money/items unless exact confirmation requires it;
- physical actions/results remain separate committed effects;
- observations are actor-local;
- world truth, observations, claims, beliefs/hypotheses remain distinct;
- original shorthand history and later evasive behavior remain causally distinct;
- correction appends history rather than rewriting the past;
- substantive repair rules remain unchanged;
- warnings remain visit state as already defined;
- **No displayed closure notice = no closure**;
- D01/D02/D03 display protections remain intact;
- successful Seed A handover changes custody once;
- Nera remains owner;
- Seed A payment remains zero;
- no fictitious debt/fee/bribery consequence is invented;
- completed recovery cannot be retroactively undone;
- retries remain idempotent;
- stale/conflicting commands fail safely;
- save/load does not rerun or duplicate effects;
- inspector/replay remains non-mutating;
- renaming IDs/labels must not create character-name policy branches;
- Encounter remains host-agnostic.

If an Atlas-readiness change would alter one of these, stop and justify why. Do not casually refactor accepted behavior.

---

# 15. What AR0 Must Not Build

Explicitly out of scope:

- Atlas Article UI;
- Atlas graph/network UI;
- editable Atlas cards;
- player notebook UI;
- M4 / Seed B;
- full payment/nonpayment bargaining;
- full 20 × 6 × 3 BASED coverage;
- full Assembler;
- NPC initiation;
- robbery;
- pickpocketing;
- police systems;
- stealth;
- sensory simulation;
- procedural rumor spreading;
- broad faction reputation;
- faction AI;
- group decision simulation;
- combat;
- navigation;
- Room Creator integration beyond an optional opaque semantic reference;
- routes/lanes/pathfinding;
- full world history;
- runtime generative AI;
- polished final dialogue/art;
- mobile/accessibility certification;
- a universal ontology containing hundreds of relationship types.

Do not invent future mechanics just because Atlas could eventually display them.

---

# 16. Suggested Internal Data Shape — Guidance, Not Mandatory Naming

The builder may refine field/module names if necessary, but preserve these meanings.

A conceptual entity record might expose:

```text
id
kind
displayName
description
scenarioRefs[]
authoredTags[]
optionalHostRef
```

A conceptual relationship/link might expose:

```text
id
relationKind
fromRef
toRef
provenance
visibility / audience where relevant
sourceRefs[]
```

A conceptual Event might expose:

```text
id
kind = event
displayName
description
scenarioRefs[]
participantRefs[]
thingRefs[]
placeRef?
groupRefs[]
sourceCommandOrResultRef?
order/time?
visibility/provenance
```

A conceptual Atlas projection might expose:

```text
cards[]
links[]
scenarioIndex[]
recentChanges[]
projectionAudience = author | player
```

Do not flatten existing observations, claims, beliefs, permissions, custody, ownership, or physical results into a vague generic link if the existing typed system is more precise.

It is acceptable for Atlas projection code to convert multiple precise internal record types into readable link objects **for presentation**, while retaining source/provenance backreferences.

---

# 17. Builder Workflow

Use the same disciplined builder role used through M3.

## Step 1 — Preflight

Before implementation:

1. Verify the exact M3 R3 checkpoint hash.
2. Extract into a new Atlas-readiness workspace.
3. Preserve the supplied M3 R3 ZIP byte-for-byte.
4. Read:
   - Encounter System Master v2.1;
   - relevant approval records;
   - M3 implementation report;
   - M3 R3 remediation/verification material;
   - independent M3 R3 final report;
   - existing source and tests.
5. Identify:
   - which stable IDs already exist;
   - which entity categories already exist implicitly;
   - which relationships can already be projected without new authoritative state;
   - how current event/journal/result identity can support Event cards;
   - where player-known versus author truth can be projected safely.

Write a short preflight report before changing production source.

## Step 2 — Reuse before adding

Do not duplicate records that already have valid stable identity.

Prefer adapters/projections over adding parallel state.

Examples:

- if an item already has canonical ownership/custody state, Atlas reads it;
- if observation/claim/belief records already have source identity, Atlas links to them;
- if journal/result records can anchor runtime Event identity, reuse them.

## Step 3 — Add only the missing AR0 structure

Implement the smallest reusable structural additions required by Sections 10–16.

## Step 4 — Produce a proof export

Create at least one deterministic, human-inspectable Atlas-readiness export from Last Collection showing:

- Scenario card identity;
- available Person cards;
- available Place cards;
- available Thing cards;
- Event cards;
- zero or real Group cards;
- links;
- recent changes;
- author projection;
- player-safe projection where supportable without inventing UI.

The proof export can be JSON plus a plain-text/Markdown rendering.

This is evidence, not Atlas v1.

## Step 5 — Preserve full regression behavior

Run all inherited accepted M3 tests and any additional AR0 tests.

Perform fresh browser verification of the key M3 paths rather than relying only on old pass counts.

## Step 6 — Freeze a new checkpoint

Do not overwrite M3 R3.

Suggested artifact naming:

`Encounter_AR0_Atlas_Readiness_Checkpoint.zip`

or another clearly equivalent name.

Include external identity/verification records and exact hashes.

Stop after AR0.

Do not begin Atlas UI.

Do not begin M4.

---

# 18. Required AR0 Tests

The builder should add focused Atlas-readiness tests.

The independent Tester must then create additional tests of their own.

At minimum cover:

## Identity

- every card ID unique;
- IDs stable through save/load;
- renaming display text does not change identity;
- card kind is explicit;
- invalid/missing references fail validation;
- duplicate or case-colliding IDs are rejected if applicable.

## Scenario membership

- Last Collection enumerates only legitimate relevant cards;
- one card can belong to more than one scenario in a neutral fixture;
- scenario membership does not duplicate underlying entity state;
- an entity can exist globally without belonging to the active scenario.

## Relationships

- owner and holder remain distinct;
- observation and report remain distinct;
- belief/hypothesis does not become world truth;
- related links contain valid endpoints;
- card links survive save/load;
- network projection and article projection are semantically consistent because they use the same source links.

## Events

- meaningful committed events receive stable identities;
- drafts/previews do not become world events;
- retries do not duplicate Event cards;
- save/load does not duplicate Event cards;
- a runtime event links back to its committed cause/result;
- authored historical events remain distinct from later runtime events;
- event ordering is stable.

## Visibility

- author projection may show legitimate hidden truth;
- player projection does not leak hidden truth;
- one NPC's private observation does not appear as another NPC's knowledge;
- reports remain attributed;
- NPC beliefs remain local/fallible;
- absent Nera does not magically receive observed information.

## Recent changes

- derived only from committed meaningful changes;
- reading the feed does not mutate state;
- exact retry does not create duplicate changes;
- preview/replay/inspector/UI actions do not create false world changes;
- handover change correctly states custody changed while ownership did not.

## M3 regression

Freshly confirm:

- successful recovery;
- repair route;
- warned closure;
- missing-notice protection;
- R3 visibility-collapse protection;
- zero payment;
- correct ownership/custody;
- save/load continuity;
- stale/retry safety;
- post-recovery protection;
- neutral renaming/anti-hardcoding;
- host boundary.

---

# 19. Independent Tester Role

Use the same independent Tester role pattern as M3.

The Tester does **not** edit production source.

The Tester independently verifies the frozen AR0 checkpoint.

The builder's pass counts are claims, not proof.

The tester should:

1. verify exact artifact identity and safe extraction;
2. inspect the production diff from accepted M3 R3;
3. confirm AR0 did not quietly become M4 or Atlas UI;
4. independently exercise the new entity/card/link projection;
5. create adversarial cases around identity, links, event duplication, visibility, scenario membership, and save/load;
6. run inherited M3 regression gates;
7. perform fresh visible-browser Last Collection recovery and warned-failure checks;
8. independently compare author and player-safe projections for leaks;
9. verify recent-changes purity/idempotence;
10. verify the accepted M3 R3 baseline remained unchanged;
11. produce an independent report/evidence bundle;
12. stop without beginning Atlas v1 or M4.

Suggested final verdict language:

**READY FOR ATLAS v0.1**

or

**NOT READY FOR ATLAS v0.1**

If the project prefers the prior generic milestone language, **READY FOR NEXT SCOPE** / **NOT READY FOR NEXT SCOPE** is also acceptable, but the report must explicitly say whether Atlas v0.1 can safely begin.

---

# 20. Blocking vs Non-Blocking AR0 Defects

Examples of **blocking** issues:

- Atlas projection duplicates mutable truth and can diverge from Encounter;
- stable identity changes when a label is renamed;
- one NPC's private knowledge leaks into another NPC or player projection;
- owner/holder are merged;
- a preview creates an Event card;
- a retry duplicates an Event;
- save/load changes card identity;
- Last Collection behavior changes;
- D01/D02/D03 protection regresses;
- Atlas readiness code begins calculating host geometry;
- a scenario creates duplicate versions of the same persistent person;
- network links disagree with article data because they are maintained separately.

Examples of likely **non-blocking** issues:

- wording of a proof Markdown export is ugly;
- a future card layout is not polished;
- no graph UI exists;
- Group has no real Last Collection member because the scenario contains no meaningful group;
- player notebook UI does not exist;
- every possible future relationship type is not implemented.

---

# 21. Atlas v0.1 After AR0 Passes

Only after AR0 independently passes should Atlas v0.1 begin.

Atlas v0.1 should preferably be **read-only**.

A good first Atlas could include:

- Last Collection Scenario page;
- Person cards;
- Thing cards;
- basic Place cards;
- Event cards;
- Group support even if empty in Last Collection;
- clickable article links;
- simple search/filter;
- “Recently Changed”;
- Author projection;
- possibly a basic player-safe toggle if the projection is ready;
- optional primitive network view only after article data is correct.

Do **not** begin with editable cards.

The major complexity jump comes later when Atlas becomes an authoring tool that writes valid Encounter data.

First prove:

> **Atlas can correctly explain Encounter.**

Then consider:

> **Atlas can safely author Encounter.**

---

# 22. Longer-Term Conceptual Direction

If successful, Atlas can become a general semantic/world interface used across multiple projects.

For Trapstar:

- **Room Creator / host world** answers: where are things and how do they move?
- **Encounter** answers: what do people know, say, believe, permit, refuse, offer, remember, and do socially?
- **Character/presentation system** answers: how do people visually perform those states?
- **Atlas** answers: what does all of that mean, and how is it connected?

A future Trapstar Atlas could contain:

- People;
- Places;
- Things;
- Groups;
- Events;
- Scenarios.

The same system could be reused for another game with different content.

A fantasy example might contain:

- Person: Sir Aldren
- Place: Red Keep
- Thing: Royal Seal
- Group: City Watch
- Event: Assassination Attempt
- Scenario: Gain Entry to the Keep

The card types and relationship logic stay broadly the same.

---

# 23. Owner Intent — Keep This Simple

The design goal is not:

> Build the most abstract universal ontology possible.

The design goal is:

> **Give the designer a clear wiki-like way to understand what the game knows and why things connect.**

When choosing between an elegant but complicated abstraction and a smaller readable solution that preserves the existing Encounter rules, prefer the smaller readable solution.

Atlas should reduce cognitive load.

If Atlas requires the owner to understand more jargon than Encounter already does, it has failed its purpose.

---

# 24. Lead Builder Execution Prompt

The block below can be supplied directly to the existing Encounter lead builder together with the accepted M3 R3 checkpoint and governing source material.

---

## TASK: Encounter AR0 — Atlas Readiness

You are the lead builder for a narrow **Encounter Atlas-Readiness pass (AR0)**.

The canonical source baseline is the independently accepted:

`Encounter_M3_Checkpoint_R3.zip`

SHA-256:

`615ddc79e0f7bd8d903411401360fc321b7b916abcc69dc974e9673fd0e74c87`

The independent M3 R3 review ended:

**READY FOR NEXT SCOPE**

Read this complete document before implementation.

### Your goal

Prepare Encounter so a future **Atlas** can read the existing world/encounter state as stable cards and links.

Atlas is a human-readable translation layer over Encounter.

Do **not** build Atlas UI in this task.

Do **not** begin M4 or Seed B.

Do **not** redesign M3 behavior.

Do **not** add unrelated future mechanics.

### Required AR0 capabilities

Add or expose the smallest reusable structure needed for:

1. stable IDs for Person, Place, Thing, Group, Event, and Scenario;
2. explicit semantic kind;
3. readable display name and concise description;
4. normalized readable relationships without collapsing existing typed semantics;
5. meaningful Event identity for authored historical and committed runtime events;
6. many-to-many Scenario membership;
7. safe author/player knowledge visibility projection;
8. pure recent-meaningful-changes projection;
9. deterministic read-only Atlas projection/export seam;
10. Last Collection proof export demonstrating these structures.

### Critical rules

- Encounter remains the source of truth.
- Do not create an independent mutable Atlas truth.
- Reuse existing canonical records whenever possible.
- Preserve world truth vs observation vs report/claim vs belief/hypothesis.
- Preserve owner vs holder/custody.
- Preserve permission vs physical action.
- Preserve offer/acknowledgment vs exact confirmation/transfer.
- Preserve all accepted M3 recovery, repair, warning, closure, privacy, money, save/load, retry, and causal rules.
- Preserve **No displayed closure notice = no closure**.
- Preserve D01/D02/D03 protections.
- Preserve host-world separation.
- Place cards contain semantic location information only, not geometry/navigation.
- Group support must not become a faction simulator.
- Event support must not turn UI clicks into world events.
- The human player may have a factual actor/person card but must not gain simulated private psychology.

### Last Collection proof

Use existing supported Last Collection material only.

Do not invent new story facts to make every category look populated.

If no meaningful Group exists, expose zero Last Collection groups and prove Group support with neutral tests.

Produce a deterministic proof export showing the Scenario card and all legitimate linked Person/Place/Thing/Event cards, relationships, visibility/provenance, and recent changes.

### Regression requirement

Existing M3 behavior must remain semantically unchanged.

Run all inherited accepted tests plus new AR0 tests.

Freshly demonstrate key browser paths, including:

- successful recovery;
- repair;
- warned closure;
- missing-preview protection;
- visibility-collapse protection;
- save/load continuity;
- ownership/custody correctness;
- zero payment;
- idempotent retry.

### Handoff

Freeze a new checkpoint. Do not overwrite M3 R3.

Include:

- preflight report;
- implementation plan;
- implementation report;
- exact source diff classification;
- test results;
- proof Atlas-readiness export(s);
- identity/verification records;
- frozen checkpoint;
- exact hashes;
- a concise independent-tester handoff note.

Then stop.

Do not begin Atlas v0.1.

Do not begin M4.

---

# 25. Independent Tester Prompt

After the builder freezes AR0, provide the frozen checkpoint and this document to the same independent Tester.

---

## TASK: Independent Encounter AR0 Atlas-Readiness Review

You are the independent tester/reviewer.

Do not edit production source.

Do not begin Atlas v0.1 or M4.

Treat builder reports as claims to verify.

### Verify artifact first

- exact checkpoint hash/size/member identity;
- safe paths;
- fresh extraction;
- source/package identity;
- preserved accepted M3 R3 baseline.

### Verify scope

Confirm AR0 contains only Atlas-readiness structure and necessary tests/docs.

Flag if the builder implemented:

- Atlas UI;
- M4/Seed B;
- broad faction systems;
- host geometry/navigation;
- unrelated gameplay.

### Independently verify

1. stable unique IDs;
2. label renaming does not change identity;
3. explicit card kind;
4. valid readable metadata;
5. valid link endpoints;
6. owner vs holder distinction;
7. observation vs report vs belief distinction;
8. stable Event identities;
9. no events from drafts/previews/reads;
10. retries/save-load do not duplicate events;
11. scenario membership does not duplicate entities;
12. one entity can belong to multiple scenarios;
13. author projection and player-safe projection do not leak private truth;
14. recent-changes read is pure and idempotent;
15. article-style proof data and network links are semantically consistent;
16. Last Collection proof contains only supported story entities/events;
17. Group support exists without fabricated Last Collection content;
18. host geometry/navigation remains outside Encounter.

### Re-run inherited behavior

Freshly verify accepted M3 behavior, especially:

- recovery;
- repair;
- warning;
- visible closure;
- missing-notice non-closure;
- D01 opacity;
- D02 geometry;
- D03 visibility collapse;
- ownership/custody;
- zero payment;
- save/load;
- retry/stale safety;
- post-recovery protection;
- neutral renaming;
- host boundary.

### Verdict

If the frozen AR0 checkpoint is structurally sound, preserves M3, and gives a clean deterministic projection for Atlas, end with:

**READY FOR ATLAS v0.1**

If a blocking correctness, privacy, identity, event-duplication, regression, or boundary defect remains, end with:

**NOT READY FOR ATLAS v0.1**

Distinguish blocking defects from usability observations or future hardening opportunities.

Then stop.

---

# 26. Definition of Done

AR0 is complete when:

- accepted M3 R3 remains preserved;
- existing Encounter gameplay behaves the same;
- card-addressable entities have stable identities and kinds;
- readable metadata exists without driving game policy;
- relationships can be projected as links without erasing important typed distinctions;
- meaningful events have stable identities;
- scenario membership can index shared cards;
- knowledge visibility can support future Author and Player Atlas views;
- recent meaningful changes can be read without mutation;
- Last Collection can be exported as a coherent card/link network;
- no Atlas UI was built;
- no M4 was built;
- independent review says **READY FOR ATLAS v0.1**.

At that point the next creative/implementation step is:

> **Atlas v0.1 — a read-only wiki-like view over Last Collection using the AR0 projection.**
