# TRAPSTAR — Routing, Player Movement, NPC Lanes, Nodes, Gathering Zones, and 2D-in-3D World Logic
## Context / Design Handoff for Claude
**Date:** 2026-10-17  
**Status:** Working design direction based on discussion with the user. This is intended as a detailed context document, not a mandate to immediately implement every item at once.

---

# 1. Purpose of this document

This document captures the current design thinking for how **player movement, NPC movement, route networks, lanes, nodes, gathering zones, cover/hiding positions, spawning/despawning, sprite-facing logic, and Quick-build spatial defaults** should work in Trapstar.

The core goal is to create a world that **feels spatially free and alive to the player** while remaining highly authored and economical under the hood.

The design deliberately avoids fully free FPS navigation and fully free NPC pathfinding. Instead, it uses a **route-based spatial grammar** that allows:

- deliberate player traversal;
- small amounts of lateral movement;
- limited free-look;
- turning at route intersections;
- believable pedestrian flow;
- 2D NPCs living inside 3D-ish spaces;
- stealth, observation, hiding, and combat without switching to a separate locomotion mode;
- a controlled asset burden for NPCs;
- strong compatibility with Trapstar's deliberately retro, slightly janky 1990s/early-2000s PC aesthetic.

The important principle is:

> **Constrain locomotion, but keep observation, interaction, and situational freedom broad enough that the player feels present inside the world rather than carried through it.**

---

# 2. The core spatial vocabulary

The emerging world model can be expressed with five main concepts:

## 2.1 Routes
Routes are the primary paths through which meaningful movement occurs.

Examples:

- sidewalk path;
- hallway path;
- shop circulation path;
- apartment path;
- alley path;
- road/vehicle path;
- stair path;
- route through a lobby;
- route through a club;
- short branch from a room center to a desk or bed.

Routes are not necessarily visible to the player.

They are the underlying spatial skeleton of the world.

---

## 2.2 Lanes
Lanes are preferred or restricted travel channels associated with a route.

The player usually has a primary route and a very narrow amount of lateral freedom around it.

NPCs can have their own parallel lanes.

Examples:

- player walking line;
- NPC inbound pedestrian lane;
- NPC outbound pedestrian lane;
- staff-only lane behind a counter;
- vehicle traffic lane;
- passing lane in a hallway.

A route may contain one or more lanes.

Important distinction:

> **The player is usually continuous within a narrow movement band, while NPCs are more discretely organized into lanes.**

---

## 2.3 Nodes
Nodes are meaningful positions associated with routes and lanes.

A node may represent:

- cover;
- hiding;
- spying;
- blending into a crowd;
- conversation position;
- doorway waiting position;
- counter interaction position;
- stair entry;
- stair exit;
- car door interaction;
- vehicle arrival/departure;
- ambush position;
- seat;
- bench;
- loiter point;
- work position;
- combat position;
- queue position;
- route intersection decision point.

Nodes are one of the most important concepts in the system.

A node is not necessarily tied to only one gameplay use.

For example, the same doorway recess might be used as:

- a civilian loiter spot;
- a hiding place;
- combat cover;
- an ambush position;
- a surveillance position.

This reuse is desirable.

---

## 2.4 Gathering / loiter zones
Gathering zones are small areas associated with routes where NPCs can occupy a slightly looser collection of positions rather than one exact lane or node.

Examples:

- outside a convenience store;
- at a bus stop;
- on a stoop;
- outside a club;
- around a bar;
- beside a parked car;
- at a food cart;
- behind a counter;
- on a dance floor;
- around a street corner.

Their purpose is to make NPC distribution feel socially natural rather than mechanically lane-bound.

These zones may also authorize more expressive animation or movement than normal walking lanes.

---

## 2.5 Intersections
Intersections are locations where a route can branch.

Examples:

- left/right at a street corner;
- hallway split;
- door into a room;
- alley branch;
- stairs;
- elevator;
- shop entrance;
- route into a back room.

Intersections are how a route-based world becomes a navigable world rather than a cinematic rail.

The player can move forward/backward on the current route, but at intersections can choose another route.

Some branches may be blocked by world state, such as:

- locked door;
- closed gate;
- blocked alley;
- inaccessible stair;
- scripted restriction.

---

# 3. Player movement: the preferred model

The player should have **strongly constrained feet but comparatively broad attention**.

The current preferred player movement model is:

- forward along route;
- backward along route;
- small side-to-side strafe allowance;
- limited free-look;
- ability to stop anywhere;
- ability to deliberately turn around;
- ability to turn left/right at route intersections;
- route branches can be blocked by doors or other world conditions;
- sprint is limited and deliberate rather than the default travel state.

The player is not freely walking throughout the full floor area like a modern FPS.

The player is walking through an authored route network.

---

# 4. The purpose of player strafing

The player's side-to-side movement should be **small but meaningful**.

It is not primarily there to allow broad navigation.

Its main purpose is to change sightlines and viewing position.

Examples:

- edge toward a shop window;
- look around a parked car;
- get a clearer angle on a person;
- move closer to the curb;
- move closer to a wall;
- peek around a doorway;
- improve a shooting angle;
- expose or hide part of the player's position;
- inspect something more closely.

A good working principle is:

> **Strafe distance should be large enough to alter what the player can see, but not so large that the player stops feeling route-bound.**

---

# 5. Player free-look

The player should have enough free-look to:

- inspect scenery;
- look at NPCs on adjacent or opposite lanes;
- turn to look across the street;
- aim or shoot across the street;
- observe windows and doors;
- look somewhat up/down;
- follow activity without changing walking direction.

However, free-look should be intentionally limited.

The player should not be able to:

- twist their head completely behind their body while still notionally walking forward;
- look upside down;
- freely spin the camera in impossible ways.

A full reversal should be a deliberate **turn-around action**, not just an endlessly rotating head.

This distinction is valuable:

- **look around** = head/camera motion;
- **turn around** = body/route-facing reversal.

Exact angular limits are not locked yet. Any numbers discussed previously were examples, not requirements.

---

# 6. Across-street observation and combat

The player must be able to remain on their route while looking/aiming across the street at NPCs occupying separate routes.

Example:

- player walks along one sidewalk route;
- NPC walks or stands on the opposite sidewalk route;
- player stops;
- player strafes slightly toward the curb;
- player turns view roughly sideways;
- player watches, aims at, shoots at, photographs, or otherwise interacts with that NPC.

This is important because:

> **The player's feet are route-constrained, but their attention and weapon direction should not be equally constrained.**

This is one reason limited free-look must still be generous enough to support strong lateral engagement.

---

# 7. Combat should not become a separate locomotion mode

The user strongly prefers that combat **not feel like a completely separate mode**.

The route system should remain the foundation during:

- exploration;
- conversation;
- surveillance;
- stealth;
- hiding;
- combat;
- pursuit.

Combat changes the meaning of the environment rather than replacing the movement system.

For example:

Before combat:
- doorway = ordinary doorway recess;
- car = scenery;
- dumpster = scenery;
- alley = branch.

During combat:
- doorway = cover/hiding node;
- car = cover;
- dumpster = cover;
- alley = retreat/flanking route.

Nothing fundamentally needs to switch to a separate navigation model.

---

# 8. Cover / hiding / spying nodes

Cover nodes should be authored along routes.

They may support:

- combat cover;
- hiding;
- spying;
- blending;
- surveillance;
- ambush;
- bracing;
- peeking;
- retreat.

Cover should not necessarily be constantly marked or obvious.

The user likes the idea that cover/hide nodes are:

> **always present, but mostly unnoticed until needed.**

This allows ordinary scenery to acquire tactical meaning contextually.

Examples:

- behind parked car;
- recessed doorway;
- dumpster;
- low wall;
- pillar;
- booth;
- counter;
- alley corner;
- stairwell;
- vehicle;
- storefront edge.

These nodes can be used by both the player and NPCs at different times.

---

# 9. Shared nodes and occupancy

The player and NPCs can share the **same node system**, but should not occupy the exact same node at the same time.

This should be quietly disallowed.

Important rule:

> **Shared node means shared resource, not simultaneous occupancy.**

If the player occupies a node:
- NPCs cannot select it.

If an NPC occupies a node:
- player cannot occupy the exact same node.

Avoid:
- collision wrestling;
- characters clipping through one another;
- two characters stacked in the same spatial point.

This should be solved by movement logic before collision becomes visible.

---

# 10. NPC lane philosophy

NPCs should appear to move freely, but in reality they are tethered to authored lanes and nodes.

Examples:

- walking toward player on adjacent lane;
- walking away on parallel lane;
- standing beside door;
- behind desk;
- behind counter;
- walking past player in parallel;
- waiting near curb;
- moving from sidewalk lane to doorway node;
- using staff route in a shop;
- walking across a crosswalk route.

The player's movement is somewhat flexible around the route.

NPC movement should generally be more controlled.

This makes NPC behavior:

- easier to author;
- easier to stage for 2D art;
- easier to debug;
- easier to keep collision-free;
- more visually predictable.

---

# 11. Same-direction passing should be uncommon

The user wants the world staged so it is relatively rare that the player is directly overtaking an NPC walking the same direction on the same side of the street.

The player's movement speed will be deliberate and sprint limited.

Most nearby same-side pedestrian encounters should naturally be:

- NPC approaching the player;
- NPC standing beside route;
- NPC crossing nearby;
- NPC at a door;
- NPC at a node;
- NPC in gathering area.

If the player begins catching up with an NPC, the world can quietly resolve it.

Possible NPC behaviors:

- move to a loiter node;
- enter a door;
- shift to another NPC lane;
- turn at an intersection;
- stop near a storefront;
- peel off to another route;
- slow or step aside.

The goal is to avoid needing full pedestrian collision simulation.

---

# 12. NPC facing and 2D sprite strategy

The likely standard NPC body-view set is:

- **facing/front**
- **3/4**
- **back**

A true side view is not currently considered a mandatory standard asset.

The route system should be designed to minimize situations where a side view is required.

The 3/4 view should act as a flexible utility view.

---

# 13. Same-side pedestrians may need very little 3/4 use

A useful cheat:

If an NPC walks toward the player on the adjacent NPC lane:

- show **facing/front** view.

If the player keeps walking, passes them, and later deliberately turns around:

- switch the NPC to **back** view during or after the player's turn-around.

Because the player's turn-around is itself a large camera motion, this can conceal the sprite switch.

This means same-side walking NPCs may often use:

- facing;
- back;

with 3/4 used much less often.

3/4 becomes more useful for:

- opposite sidewalk;
- across street;
- entering/leaving door;
- route intersection;
- standing angled toward object;
- cover position;
- cross-route movement;
- social pose;
- nearby lateral relation.

---

# 14. Important rule: free-look should not constantly drive body sprite swapping

NPC body orientation should primarily reflect:

- NPC locomotion;
- route relationship;
- major spatial relationship.

Small changes in where the player looks should not cause constant:

- facing -> 3/4 -> facing -> 3/4 flicker.

The body view should remain stable until a meaningful threshold is crossed.

This can be supported by hysteresis / dead zones so sprite selection has inertia.

---

# 15. Doom / Duke-style "rubber-band" sprite orientation

A major visual cheat under discussion is to borrow from early 2.5D FPS sprite logic.

The NPC has:

1. **logical world facing**
2. **selected body artwork**
3. **sprite-plane visual orientation toward player**

These do not need to be identical.

The sprite plane can visually swivel toward the player within a controlled range.

This prevents the player from seeing a thin cardboard edge and allows each body view to cover a broader angular range.

Conceptually:

- facing sprite covers a band of frontal angles;
- 3/4 sprite covers a band of lateral angles;
- back sprite covers a band of rear angles.

The sprite presentation can "rubber-band" toward the player's camera until a threshold is reached, then switch to another body view.

This is intentionally approximate.

The user is comfortable with visible 90s-PC-style graphical cheating if it serves the aesthetic.

---

# 16. Stationary noncombatants can cheat even harder

For stationary or decorative NPCs, it may not even be necessary to provide all three views.

Some NPCs may use:

- facing only;
- facing + 3/4;
- facing + back;
- full facing + 3/4 + back.

A stationary loitering NPC can potentially behave almost like a classic Duke-style billboard and continuously bias toward the player.

A background civilian does not need the same orientation fidelity as a combatant.

Possible rough "cheat budget":

- background decoration: cheat heavily;
- stationary/social NPC: cheat heavily;
- pedestrian: cheat moderately;
- combatant: cheat carefully;
- important recurring NPC: best assets and least crude cheating when close.

---

# 17. Distance-based cheating

The farther an NPC is from the player, the more visual cheating is acceptable.

Far:
- stronger billboard bias;
- simpler pose logic;
- fewer view assets;
- minimal head/limb complexity.

Medium:
- moderate body-view accuracy;
- 3/4 used when needed;
- head attention may matter.

Near:
- better body view;
- better head direction;
- arm/upper-body flourish;
- encounter-ready posing.

This can significantly reduce art and simulation cost.

---

# 18. Independent head orientation

The user has front and 3/4 body art examples and intends the head to be independently orientable.

This is a high-value cheat.

Important conceptual split:

> **Body orientation communicates locomotion / stance.**  
> **Head orientation communicates attention.**

Examples:

- body continues down sidewalk;
- head glances at player;
- body faces street;
- head looks toward storefront;
- body remains 3/4;
- head turns more frontal to sell player attention;
- back body;
- head glances over shoulder.

The head can help extend the believable angular range of the 3/4 body.

---

# 19. Body view should be stable; head can absorb small changes

A recommended principle:

> **Body commitment, head freedom.**

Do not swap the full body sprite every time the player changes position slightly.

Instead:

- player shifts slightly -> head can adjust;
- player changes relationship substantially -> body view changes.

This reduces popping/flicker and gives NPCs a more stable visual identity.

---

# 20. Arms and legs can also have independent posing

The user plans to allow some independent arm and leg pose variation.

Most of the expressive variation should come from:

- arms;
- hands;
- head;
- facial expression;
- stance changes.

Not from elaborate leg animation during normal traversal.

---

# 21. Strict leg-cycle philosophy

The user strongly prefers:

> **Very little leg motion outside locomotion, combat, and specifically authorized special situations.**

Walking NPCs should generally use a strict, controlled leg cycle.

Standing NPCs should mostly use simple leg states such as:

- neutral stand;
- weight shift;
- wider/aggressive stance;
- crouch;
- seated;
- lean.

This is valuable because:

- feet remain visually stable;
- ground contact is easier to preserve;
- modular sprite assembly is easier;
- special animation becomes more meaningful;
- art workload stays manageable.

---

# 22. Exceptional leg animation should communicate character or location

Examples where richer leg animation is appropriate:

- combat;
- exotic dancers / club performers;
- dance floor;
- martial artist;
- boxer;
- unique NPC with karate attacks;
- drunk/staggering character;
- injured/limping character;
- exercise/gym;
- special gathering zone.

This creates a meaningful contrast.

If most NPCs are restrained, a character suddenly performing a martial arts move is visually and narratively striking.

---

# 23. Close-range arm/upper-body flourishes

Nearby NPCs can briefly perform small upper-body flourishes to feel alive.

Examples:

- adjust jacket;
- scratch face;
- gesture;
- flick cigarette ash;
- shift bag;
- check phone;
- jingle keys;
- raise hand;
- rest hand on hip;
- lean on car;
- hold package differently;
- adjust glasses;
- point;
- brace on counter.

These should be short, occasional, and context-sensitive.

They are not full behavior trees.

A few seconds of visible upper-body life can make a route-tethered NPC feel much more human.

---

# 24. Suggested NPC presentation tiers

A useful quality ladder:

## Tier A — distant/background
- minimal animation;
- simple billboard behavior;
- basic route motion;
- few body views;
- no complex posing.

## Tier B — nearby passive
- improved body facing;
- head attention;
- occasional arm flourish;
- simple standing/walking variety.

## Tier C — encounter range
- expression changes;
- upper-body performance;
- intake/delivery encounter posing;
- better head direction;
- more deliberate staging.

## Tier D — combat/special
- combat-specific arm/leg poses;
- cover poses;
- weapon poses;
- special moves;
- richer animation where necessary.

The spawn/despawn policy should keep only a limited number of NPCs in the ranges where Tier C/D behavior is needed.

---

# 25. Strict NPC spawn/despawn policy

The user wants a strict policy to control how many NPCs are ever close enough to require dynamic posing/facing.

Important rule:

> **NPCs should never visibly spawn or disappear in ordinary circumstances.**

They should enter/leave through plausible authored mechanisms such as:

- corner;
- doorway;
- alley;
- store entrance;
- route end outside view;
- vehicle;
- stairwell;
- elevator;
- visual obstruction;
- sufficiently distant part of route.

Specialty nodes may intentionally permit visible "event entrances," such as:

- car pull-up;
- ambush from cover;
- door bursts open;
- scripted arrival.

Those are events, not generic despawns.

---

# 26. Population illusion

The game does not need to simulate every civilian persistently.

It needs believable entrances/exits.

A city can feel populated if NPCs:

- appear through valid spatial entrances;
- move along lanes;
- gather at plausible locations;
- leave through valid exits;
- are never visibly created/destroyed arbitrarily.

This is a deliberate simulation cheat.

---

# 27. Gathering zones and animation permissions

Gathering zones can also define what kinds of motion are permitted.

Examples:

## Sidewalk loiter zone
- stand;
- turn;
- light gesture;
- smoke;
- look around.

## Bar area
- sit;
- lean;
- talk;
- drink;
- small social gestures.

## Gentlemen's club stage
- full dance animation allowed.

## Dance floor
- rhythmic stepping / full-body movement allowed.

## Gym
- exercise motion allowed.

## Martial arts area
- special stances / kicks.

## Combat zone
- footwork / crouch / evasive motion allowed.

This allows the environment itself to authorize richer movement.

---

# 28. Quick-build should generate movement logic, not only geometry

A major design direction is that Quick-build should create a default route system whenever a new space is created.

The user should be able to edit or replace the default afterward.

Quick-build should consider:

- walls;
- doors;
- stairs;
- furnishings;
- counters;
- desks;
- interactive objects;
- player path;
- NPC lanes;
- gathering areas;
- cover/hide opportunities;
- route branches;
- access points.

This means Quick-build produces:

> **geometry + movement grammar + interaction access + NPC staging**

not just a shell.

---

# 29. Example Quick-build templates

## Hallway
Could automatically create:
- central player route;
- narrow player movement band;
- one or more NPC passing lanes;
- door approach nodes;
- wall-side waiting nodes;
- corners/intersections;
- stair connections if present.

## Street
Could create:
- player sidewalk route;
- NPC pedestrian lanes;
- opposite-side NPC route;
- road/vehicle routes;
- crosswalk routes;
- curb nodes;
- storefront approach nodes;
- alley branches;
- loiter/gathering zones;
- cover candidates;
- vehicle pull-up nodes.

## Shop
Could create:
- player entrance path;
- browsing path;
- counter approach node;
- employee-only route behind counter;
- queue nodes;
- door access;
- staff idle nodes;
- gathering/loiter area.

## Office
Could create:
- doorway-to-desk route;
- circulation path;
- desk interaction node;
- worker-side node;
- chair/seat nodes.

## Bar
Could create:
- entrance route;
- bar approach path;
- bar interaction nodes;
- table circulation;
- behind-bar staff lane;
- standing/loiter zones.

## Apartment / small room
Could create:
- short route network;
- room center;
- branches to bed, desk, window, door;
- not necessarily one wide free-walk zone.

---

# 30. Small route networks are preferred over broad free-walk rooms

If a room feels too restricted using one line, the solution is not necessarily to make the entire floor freely walkable.

Instead, build a small network.

Example:

    door ---- center ---- desk
                 |
                 |
                bed

This preserves authored viewing and NPC logic while still giving the player meaningful local freedom.

---

# 31. Doors are major route-generation anchors

Doors should be treated as meaningful spatial anchors.

A door may automatically suggest:

- outside approach node;
- inside approach node;
- crossing segment;
- route connection;
- left/right waiting positions;
- no-block zone;
- entry/exit direction;
- optional hide/cover position;
- possible spawn/despawn permission.

A door should not just be visual geometry.

It is a route transition.

---

# 32. Furniture and interactive objects should influence route generation

The user wants Quick-build routes to automatically consider furnishings and interactive elements.

Useful concept:

Each object can define:

## Solid footprint
Where people cannot move.

## Activity footprint
Where people should be able to stand to use the object.

Example — desk:

    WORKER NODE
        *
    [ DESK ]
        *
    CUSTOMER NODE

Example — sofa:

    [ SOFA ]
    sit nodes
    clear approach area

Example — parked car:

    cover node     cover node
        [ CAR ]
          door node

This is easier and more reliable than asking AI/pathfinding to infer spatial meaning every time.

---

# 33. 3D vs 2D environment objects

Current thinking:

Objects that strongly define physical space should generally be 3D, even if the 3D is crude.

Examples likely best as 3D:

- desks;
- counters;
- sofas;
- tables;
- chairs;
- dumpsters;
- large crates;
- nearby parked cars;
- pillars;
- shelving that affects navigation;
- doors/openings;
- large obstacles.

Why:

- physical footprint;
- occlusion;
- cover;
- collision;
- predictable sightline;
- interaction nodes;
- believable depth.

The 3D does not need to be high quality.

Crude, low-poly, slightly ugly 3D is compatible with the intended style.

---

# 34. Moving traffic can remain mostly 2D

The user likes moving cars being primarily 2D to evoke old-school rail shooters.

This is a good fit because moving traffic is:

- lane-bound;
- predictable;
- often seen briefly;
- frequently at medium/far distance;
- mostly presentation/atmosphere.

Possible distinction:

## Traffic cars
Mostly 2D sprite vehicles.
Used for:
- ambient traffic;
- drive-bys;
- passing cars;
- background motion;
- road occupancy;
- atmosphere.

## Persistent/local cars
More likely 3D or hybrid.
Used for:
- cover;
- close inspection;
- direct interaction;
- entering/exiting;
- parked object;
- persistent nearby obstruction.

A car may even transition from a cheap moving representation to a more solid local representation if it becomes important.

---

# 35. 2D traffic and route logic

Traffic cars still follow authored:

- road routes;
- traffic lanes;
- pull-up nodes;
- stop nodes;
- event nodes;
- intersections.

They are visually fake but spatially disciplined.

This mirrors the NPC philosophy.

---

# 36. Occlusion is a major reason to use 3D props

3D environmental objects help sell 2D characters by naturally hiding portions of sprites.

Examples:

- NPC walks behind dumpster;
- counter hides lower body;
- door frame hides NPC exiting;
- car hides enemy in cover;
- booth hides seated NPC legs.

This lets 2D characters feel embedded in the world.

---

# 37. Invisible/simplified physical geometry is acceptable

The visible art and the collision/cover geometry do not have to match perfectly.

Examples:

- couch may have simple rectangular collision;
- car may have simple box/low-poly collision;
- ornate counter can have crude hidden blocking shape.

The constrained player movement greatly reduces the need for perfect physics.

---

# 38. The world can become progressively more fake with distance

A useful rendering philosophy:

Near player:
- meaningful geometry;
- higher-quality props;
- better NPC presentation.

Medium:
- simpler geometry;
- cheaper NPC behavior;
- cheaper traffic.

Far:
- sprites;
- mattes;
- skyline imagery;
- low-detail objects;
- aggressive billboard cheating.

This is desirable, not a compromise.

---

# 39. Combat NPC movement should be more discrete than player movement

The player should feel relatively free within the route band.

Combat NPCs can be much more graph-driven.

Example state movement:

- advance node;
- cover node;
- flank node;
- crossing segment;
- retreat node;
- ambush node.

The player may perceive dynamic tactics.

Underneath, NPCs are selecting authored positions.

This is preferable to unrestricted navigation because it:

- works better with 2D art;
- controls viewing angles;
- controls combat readability;
- avoids navigation failures.

---

# 40. Stealth/spying should reuse normal routes

The same route system should support following and surveillance.

Example:

- target walks opposite sidewalk;
- player walks parallel on own route;
- player slows;
- target pauses;
- player uses doorway hide node;
- target looks across;
- player blends at gathering zone;
- player resumes route.

No explicit "stealth mode" is required.

The environment's route/node meaning is enough.

---

# 41. Parallel walking and conversations

Parallel player/NPC routes create opportunities for walk-and-talk sequences.

Example:

- player on player lane;
- NPC on adjacent lane;
- both move same general direction;
- NPC head turns toward player;
- encounter-style arm/head gestures happen while locomotion continues.

This could allow encounters to emerge naturally without always freezing the world.

The current encounter system's Intake/Delivery pose logic may later connect to this.

---

# 42. Route and node systems should be shared across gameplay systems

A core architectural idea:

The route system should not be "camera rails only."

It should become the spatial foundation used by:

- player travel;
- NPC travel;
- vehicles;
- stairs;
- combat positioning;
- stealth;
- surveillance;
- encounters;
- scripted entrances;
- chase sequences;
- loiter behavior;
- crowds;
- possibly point-and-click transitions.

Different systems use the same route/node graph in different ways.

---

# 43. Recommended conceptual hierarchy

A compact way to think about the spatial model:

## Routes
Where meaningful travel can happen.

## Lanes
Who tends to move where within a route.

## Nodes
Where meaningful actions happen.

## Zones
Where NPCs can occupy space more loosely.

## Intersections
Where direction / route choice changes.

This may be enough vocabulary to describe a very large part of Trapstar's world.

---

# 44. The intended player illusion

The player should not consciously feel:

> I am on Rail 12.

They should feel:

> I am walking down the sidewalk.

The route constraint should be concealed by:

- stopping anywhere;
- forward/backward movement;
- limited strafe;
- free-look;
- turn-around;
- intersections;
- doors;
- visible NPC flow;
- environmental sound;
- camera sway;
- branches;
- stairs;
- opposite-side activity;
- cover nodes;
- visual events.

Freedom of **attention and choice** can make the world feel larger than freedom of arbitrary position.

---

# 45. Intentional 90s/early-PC jank is acceptable

The user does not want to over-polish away the artificiality.

Acceptable or desirable traits may include:

- sprite snapping between views;
- slightly obvious billboarding;
- low-poly furniture;
- low-resolution textures;
- moving 2D vehicles;
- painted backgrounds;
- imperfect perspective;
- sprite sliding;
- abrupt but readable pose changes;
- crude shadows;
- old rail-shooter visual language.

The goal is not modern realism.

The goal is a coherent visual language.

---

# 46. Design principle for 2D people in 3D-ish space

The most useful summary may be:

> **Trapstar's NPCs are theatrical 2D performances placed inside a controlled 3D-ish stage. The world should be designed to present them at favorable angles rather than demanding that the artwork survive arbitrary 3D viewing.**

This philosophy should inform:

- route placement;
- lane placement;
- node placement;
- room Quick-build;
- spawn/despawn logic;
- camera constraints;
- billboard orientation;
- asset requirements.

---

# 47. Asset economy principle

Do not create every possible orientation and animation for every NPC.

Use the spatial system to reduce required art.

Possible asset tiers:

## Background civilian
- one facing pose may be enough.

## Stationary worker
- facing + maybe 3/4.

## Same-side pedestrian
- facing + back may often be enough.

## Opposite-side / more spatial NPC
- facing + 3/4 + back.

## Major recurring NPC
- facing + 3/4 + back;
- richer head/expression set;
- more arm/leg poses.

## Combat/special NPC
- relevant combat-specific poses;
- possibly additional view assets only if needed.

This should remain demand-driven.

---

# 48. Current implementation context from Room Creator v0.13

The current Room Creator direction is already compatible with this philosophy.

Relevant foundations now include:

- route/rail authoring;
- first-person traversal;
- multi-story navigation;
- stairs;
- floor openings;
- viewpoint/camera authoring;
- story switching;
- sky/matte environment work.

The next conceptual evolution is to treat routes as more than camera rails.

They can become the shared spatial skeleton described above.

Important: do not immediately rebuild everything into one giant gameplay system.

The current document is about the design language and architecture direction.

---

# 49. What should be automated in Quick-build first

A practical order would be:

1. Generate player route.
2. Generate narrow player movement band.
3. Generate door/intersection connectivity.
4. Generate NPC lanes.
5. Generate basic loiter/gathering areas.
6. Generate obvious interaction nodes.
7. Generate obvious cover/hide nodes.
8. Reserve valid spawn/despawn entrances.
9. Generate stair/vertical route connectivity.
10. Allow manual authoring/override of everything.

The default only needs to be usable, not perfect.

The user can edit it.

---

# 50. What should NOT be overbuilt yet

Avoid immediately turning Room Creator into:

- full navmesh simulator;
- unrestricted FPS engine;
- full behavioral AI editor;
- full encounter/personality editor;
- procedural life simulator;
- modern cover shooter system.

Room Creator should author **spatial behavior affordances**.

Other systems can later decide why an NPC uses them.

---

# 51. Good implementation philosophy

Prefer:

- authored constraints;
- simple occupancy rules;
- predictable route graphs;
- node-based actions;
- visually controlled cheats;
- reusable spatial metadata;
- clear editor visualization;
- strong defaults with manual overrides.

Avoid:

- continuous physics where discrete logic is enough;
- full free navigation where routes are enough;
- complex collision resolution where occupancy rules prevent the collision;
- enormous animation libraries where staging can remove the need.

---

# 52. Useful debugging/editor overlays

The editor may eventually benefit from optional debug views for:

- player routes;
- player movement band;
- NPC lanes;
- route direction;
- intersections;
- nodes;
- node type;
- node occupancy;
- gathering zones;
- spawn/despawn permissions;
- cover/hide nodes;
- object solid footprint;
- object activity footprint;
- likely player viewing region;
- sprite-facing bands;
- route connections between stories.

These should be authoring aids, not player-facing UI.

---

# 53. Open questions / not yet locked

The following are still open and should not be treated as final:

- exact freelook angle limits;
- exact strafe width;
- exact sprint behavior;
- exact turn-around timing;
- exact sprite-switch thresholds;
- exact hysteresis values;
- whether some NPCs need true side views;
- how much head rotation is practical;
- exact way combat cover is activated;
- exact number and type of gathering behaviors;
- whether nearby traffic converts from 2D to 3D/hybrid;
- how many route lanes Quick-build should generate by default;
- how node ownership/priority is visually debugged;
- how encounter posing blends with walk-and-talk behavior;
- whether some interiors use broader route bands than sidewalks.

These should be prototyped rather than prematurely fixed.

---

# 54. Strongly preferred current direction

The following points are much more settled conceptually:

- player movement is route-based, not free FPS navigation;
- player can move forward/backward;
- player has only small lateral strafe;
- player has limited but useful free-look;
- player can deliberately turn around;
- route intersections allow left/right/branch choice;
- doors can block/unblock route branches;
- NPCs use parallel lanes and nodes;
- NPCs do not need free pathfinding;
- nodes can be shared between player/NPC systems but not simultaneously occupied;
- cover/hiding/spying nodes are integrated into the same spatial graph;
- combat should not become a separate locomotion mode;
- NPC spawning/despawning should be tightly controlled and not visibly arbitrary;
- same-direction close passing should be uncommon;
- facing + 3/4 + back is the likely standard maximum NPC body-view set;
- some NPCs can use fewer views;
- billboard/rubber-band cheating is welcome;
- head orientation can be independent from body orientation;
- upper-body flourishes are valuable;
- normal leg motion should remain conservative;
- special leg/full-body motion should be exceptional;
- Quick-build should eventually include default route logic;
- moving traffic can remain heavily 2D;
- meaningful nearby physical props should often be 3D;
- the visual style is allowed to feel deliberately old, artificial, and slightly janky.

---

# 55. One-sentence design summary

> **Trapstar should feel like a freely inhabited city, but underneath it is a carefully authored network of routes, lanes, nodes, gathering zones, and controlled sprite presentation that lets 2D people and vehicles behave convincingly inside a deliberately rough 3D-ish world.**

---

# 56. Suggested next prototype

Do not implement the entire system at once.

A useful prototype would be one small street block containing:

- one player sidewalk route;
- small player strafe band;
- limited free-look;
- deliberate turn-around;
- opposite sidewalk;
- two NPC lanes;
- one gathering zone;
- one storefront door branch;
- one alley branch;
- two cover/hide nodes;
- one parked 3D car;
- one moving 2D traffic car;
- one facing/back pedestrian;
- one 3/4 opposite-side NPC;
- head-turn test;
- one small upper-body flourish;
- strict spawn/despawn entrance points;
- one simple combat/spying interaction across the street.

The goal would be to test whether the player experiences it as a real place rather than a rail.

If that illusion works, the system can then be generalized into Quick-build defaults and broader Room Creator support.

---

# 57. Instruction to Claude

When ingesting this document:

1. Treat it as a **design-context handoff**, not an instruction to immediately modify every subsystem.
2. Preserve the distinction between **confirmed direction** and **open implementation details**.
3. Prefer adapting the existing Room Creator route/rail foundation rather than creating an unrelated second navigation system.
4. Keep the player experience simple and readable.
5. Keep the internal system economical and highly authored.
6. Do not assume modern FPS conventions are desirable.
7. Do not "fix" deliberate visual jank if it serves the 90s PC / rail-shooter aesthetic.
8. Favor prototypes that test the illusion before committing to large architecture changes.
