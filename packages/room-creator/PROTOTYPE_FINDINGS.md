# Route-walk prototype: findings

Room Creator 0.13.1 · 2026-10-18 · scene: `examples/Route_Prototype_Street.room.json`

## The short version

- **Locking the feet to a route mostly hides itself on your own sidewalk.** People on your sidewalk walk
  parallel to you, so you see them from the front or the back about 90% of the time. With only FRONT,
  3/4 and BACK pictures, their picture pointed the wrong way (more than 30° off) just 4.6% of the time.
- **Across the street is where it breaks.** Seen from across the street, walkers are side-on about half
  the time. With FRONT, 3/4 and BACK, their picture pointed the wrong way **51% of the time** while you
  watched the street, and 36% during the spying test. They look like they slide sideways.
- **So a SIDE walking picture does look necessary**, for walkers who can be seen across the street. It
  cut the wrong-way time from 51% to 9% in the watching test. Standing NPCs don't need one.
- **The rubber band does not fix this.** Turning the card toward you hides how flat it is, but it can't
  change which way the drawn person faces. Rubber band 0° and 60° gave identical wrong-way numbers.
- **The rules held.** Across 27 scripted walks (about 47 simulated minutes): 190 NPC and car
  appearances and 193 exits, **none where you could see them**; never two people on one spot; no
  bodies overlapping; nobody walked through from behind.
- **The across-street spy and shoot loop works without a combat mode.** You stay on the route, strafe
  into the spot behind the parked car, crouch (hidden by the car), stand (the mark sees you) and shoot
  (hit at 16.8 m).

**An honest limit before you read on.** I can't feel a game. The machine I tested on has no graphics card,
so the live view ran at about 2 frames a second. Everything below comes from scripted walks with
measurements, plus screenshots I looked at. Where I say something "felt" convincing, read it as "looked
convincing in the screenshots and measured well". You should play it and move the sliders. The right-hand
panel has a **Download measurements** button, so your own walks give the same numbers.

## 1. The runnable prototype

`Room_Creator.html` → **Open** → `examples/Route_Prototype_Street.room.json` → **Route walk** (top
right). Click the picture once to steer with the mouse. `README_ROUTE_PROTOTYPE.md` has every control,
a list of things to try, and what the cards and the dial mean.

## 2. What was added

One new interface module, `source/ui-route.js` (about 550 long lines), plus small hooks:

- **Route walk mode.** Your feet are on a route graph (points joined by straight pieces). W/S move you along
  it, A/D strafe inside a band (0.7 m each side by default) that bulges out to 1.35 m at "spots", the mouse
  turns your head within a look limit (95° each side, 30° up, 35° down), R is a deliberate 0.4 s
  turn-around, C crouches, Shift is a short sprint, Space or click shoots.
- **Junctions.** At a junction you take the branch you are looking toward (within 40°). Looking straight
  ahead carries on. A branch can name a door: while the door is closed you stop with a message, E opens it.
- **NPC lanes.** One-way walking lines on both sidewalks, each with a limit on how far walkers may step
  aside, so they never step through the newspaper boxes. Walkers slow behind each other and step around you.
  A walker you are catching up with steps into a free doorway or speeds up instead of being walked through.
- **Spots (nodes).** Tenement doorway, bodega window, bodega door, two behind the parked car, a doorway
  across the street. Strict occupancy: one person per spot, you included, checked every step.
- **Gathering zone** with three loiterers outside the pizza place; a stoop sitter who leaves after 45 s;
  a shopper who comes out of the bodega only while its door is open; "the mark", who walks the far
  sidewalk, stops in the pizza doorway, looks around, notices you if it has a clear line to you, and runs
  off when shot.
- **Spawn rules.** NPCs and cars appear and vanish only where you could not see them even by turning your
  head (your body direction ± look limit ± half the lens, plus a sight-line test through walls, windows
  and solid objects). If the exit is visible, a walker waits there and a car pulls over and parks.
- **Solid parked car** (six plain boxes in the project, so it blocks sight lines and shots) and **two 2D
  traffic cars** (front/side/back sprites) on right-hand lanes that stop for people.
- **Placeholder NPC cards:** FRONT, 3/4 (mirrored for left/right), BACK; SIDE and BACK 3/4 exist only as
  tick-box diagnostics. The card turns toward you by up to the rubber-band angle; a picture switch needs
  a clear improvement (hysteresis 12°, raised up to 2.5× for NPCs closer than 4 m). The head is a separate
  card with its own direction (turns up to 65° toward you). The phone checker raises a phone now and then.
  The legs use a strict four-frame step.
- **Debug overlay** (Tab: off / labels / full) and a **measurements panel** (the numbers in sections 6, 7 and 9 come from it).

## 3. Existing v0.13 systems reused

- **The project and its data checks** (`core.js`): the route network is an optional `routeNet` block in the
  normal project file, checked on load, saved and reopened with everything else.
- **The City Block scene itself**: rooms, walls, windows, doors, sidewalks, curbs and street furniture. The
  bodega door branch uses the real door opening (`opening_bodega_door`); opening it changes the 3D model.
- **The graphics engine** (`gl.js`, three.js): the street renders exactly as in v0.13. NPC cards and cars sit
  in a new "moving things" layer that the map views and clicking ignore.
- **First person** (`ui-fp.js`): the route walk is just another camera source for the existing first-person
  view (same lens, eye height and look-up/down model), so sky, haze and lighting all work.
- **Pillars** as the solid objects: the parked car is made of ordinary pillars, so the existing collision
  and sight data include it.
- **Walls, windows and door state** for sight lines: see-through where the project has windows, open
  passages or open doors.
- **The map, mini-map, camera marker, side panels, sliders and download helpers** from the editor.

Not reused, on purpose: the rail planner's walking grid (rails.js). It plans free paths around walls, which
is the opposite of what this test needs. The route graph is hand-authored instead. Stairs are not in the
route walk yet (see section 8).

## 4. What felt convincing

These held up in the numbers and looked right in the screenshots.

- **Your own sidewalk.** Walkers coming toward you show FRONT, then BACK once they have passed. The
  switch happens beside you, where you are barely looking. On the near sidewalk the picture was more than
  30° wrong only 4.6% of the walking time (stroll test). This is the main bet of the design document, and
  it held.
- **A walker ahead of you doesn't get walked through.** Walker C, going your way but slower, reserved the
  bodega window spot and stepped into it to let you by (screen 02). With no free spot nearby it speeds up
  instead. Same-direction pass-throughs: 0 in every run.
- **Heads.** The stoop sitter's and the loiterers' heads turn toward you while their bodies stay put
  (screen 10). The head held attention without the body changing picture for 12–68 seconds per run. Even
  with placeholder art, this sells "they noticed me" better than anything else in the test.
- **Hidden entrances.** NPCs come round the Kestrel corner, out of the alley, out of the bodega door
  (only while it is open), and cars come off Dunmore and leave into the alley. Nothing appeared or vanished
  in view in 27 runs. If an exit is in view, the walker waits and a car pulls over. That never had to
  happen here, because every exit is round a corner.
- **Spying and shooting are the same movement.** From the spot behind the parked car: crouched, the car
  body blocks the mark's line of sight (screen 07); standing, the mark sees you over the car (screen 08);
  one shot hit at 16.8 m, and the mark ran off (screen 09). No separate combat mode was needed. Strafe,
  look, crouch and the spot did it all.
- **Junctions by looking.** Looking toward the bodega door as you reach it takes the branch. Looking ahead
  carries on. A closed door stops you with a message (screen 13), E opens it, and you walk in (screen 14).
  A blocked branch you only glanced at never stops you if you can go straight.
- **The 2D traffic car** reads exactly like an old rail shooter (screen 11). Watching the street, you see
  it from the side 91% of the time, and FRONT/SIDE/BACK car pictures were enough. Cars stop for people in
  the road.
- **Flicker control.** Walking past a standing NPC at 3 m gave the minimum 2 picture changes once
  hysteresis was 4° or more (6 changes with none). Hysteresis means a new picture must be clearly better,
  by a set number of degrees, before the card switches.

## 5. What visibly broke the illusion

In order of how much it matters:

1. **Walkers across the street slide sideways.** The 3/4 picture says "walking toward you at an angle"
   while the person moves straight across your view (screens 03, 04, 09). Far-sidewalk walkers were side-on
   42–55% of the time in the spying and watching tests. Their picture was more than 30° wrong 58–64% of
   their walking time. This is the biggest problem, and it happens at exactly the distance you spy and
   shoot from (13–20 m), so "it's far away" doesn't hide it.
2. **The gap between 3/4 and BACK.** Someone seen from behind at an angle (about 110–150° round from
   their front) is 45–67° away from the nearest picture. You see this a lot while strolling: walkers you've
   passed, and far walkers heading away diagonally. That angle band was about 18% of all walking
   time on screen in the stroll. The first version of the switching rule even **flickered** here (56 changes in
   20 seconds while shuffling). I fixed it: a forced switch now only happens if the new picture is actually
   acceptable. The card now holds one wrong picture instead of flickering between two.
3. **Close passes.** At 1–1.5 m a card is obviously cardboard, and the separate head disc is obvious
   (screen 10, the stoop sitter at 1.4 m). When you look across the street while a near-side NPC passes
   close, that NPC is side-on. With rubber band 25° the card was visibly edge-on 34% of that close time;
   45° brought it down to 15%.
4. **Billboard loiterers stare.** The "background" class always faces you, so a group of them looks like
   everyone is staring at you. Keep that class for far, small figures.
5. **Speeding up to stay ahead.** When no spot is free, a walker you're catching speeds up to stay in
   front. At walking pace it's fine. If you sprint it will look like they're running from you.
6. **The waiting rule could become visible.** "Never appear or vanish in view" means a walker stands at
   a visible lane end, or a car parks, until you look away. Here it never happened because every exit is
   behind a corner. Put an exit in the open and you'll see people loitering at the end of the world.
7. **Cover spots are very close to the cover.** Crouched 1.5 m from the parked car, the car fills the
   screen (screen 07). That's honest, but it means peeking (stand up, or strafe to the car's end) is the
   only way to see anything, so it needs to be quick.
8. **Small things:** cards have no shadow, so they float a little; the debug overlay draws through walls
   (by design, so switch it to labels or off when judging the look); the parked car is plain boxes.

## 6. Is a true SIDE view necessary?

**For walkers who can be seen across the street: yes, by this test. For standing NPCs: no.**

The prototype judged every walking NPC on screen with four picture sets at the same time, so the
comparison is fair. "Wrong" means the drawn person faces more than 30° away from where they really face.

| Test (seeded, same NPCs) | FRONT, 3/4, BACK | + SIDE | + BACK 3/4 | + both |
|---|---|---|---|---|
| Stroll along your sidewalk, glancing around (150 s) | 18% wrong | 13% | **4%** | 0.3% |
| Spy from behind the parked car (75 s) | 36% | **8%** | 21% | 0.1% |
| Walk while looking across the street (40 s) | 25% | **1.4%** | 17% | 1% |
| Stand and watch the street (120 s) | 51% | **9%** | 29% | 0.6% |
| Worst error seen | 73–82° | 45–59° | 51–59° | 36–37° |

What this says:

- **The answer depends on where you look.** Looking across the street (spying, watching, shooting),
  SIDE is the big win. Strolling along your own sidewalk, a **BACK 3/4** picture helps more than SIDE,
  because the common awkward angle there is "from behind, off to one side".
- **Neither cheat removes the need.** The rubber band only hides flatness (section 9). Distance doesn't
  help, because across the street is 13–20 m, which is the spying and shooting distance.
- **Standing NPCs are fine without SIDE.** Loiterers and the stoop sitter seen side-on with a 3/4 picture
  just read as "half turned toward you", and their heads do the rest. The wrong-way problem is mostly a
  walking problem: legs that step one way while the body slides another.
- **The cost is smaller than it sounds.** One SIDE drawing covers both directions, because it is mirrored,
  as the 3/4 is. The same goes for BACK 3/4. Only the walk cycle (lower body) has to be drawn per view;
  the upper body can stay a still.

Suggested order: **(1) a SIDE walk cycle for pedestrians that can appear on the far sidewalk, (2) BACK 3/4
if strolling past walkers still looks off, (3) nothing extra for standing NPCs.** If art budget is very
tight, the alternative is design rather than art: fewer walkers on the far side, more loiterers there,
and parked cars and street furniture that cover far walkers' legs.

## 7. Freelook and strafe ranges

These are measured and geometric reasons, not feel. Start from them, then trust your hands.

- **Look left/right: 95° to 110° each side.** Across the street is 90° from your walking direction. At 95°
  you can aim straight across and about 1.3 m past. At 110° you can keep the crosshair on someone up to
  about 5 m behind you; past that, turn around (R). At 60–75° you can't aim straight across at all: the
  target has to be 4–8 m ahead of you. The lens adds 37° of side vision, so at 95° you can *see* to 132°
  without being able to aim there, which keeps "facing forward" honest.
- **Look up 30°, down 35°:** plenty. A second-floor window across the street is about 13° up.
- **Strafe: 0.7 m each side, plus bulges to about 1.35 m at spots.** On this 3.9 m sidewalk (scripted
  walk with constant side-stepping):

  | Strafe band | NPCs had to stop and wait | You bumped into NPCs |
  |---|---|---|
  | 0.4 m | 6.5 s | 1.8 s |
  | **0.7 m** | **0.8 s** | **0.3 s** |
  | 1.0 m | 3.1 s | 2.2 s |

  At 0.4 m you stand half in the curb lane, and walkers can't get round you. At 1.0 m you can block
  both lanes. 0.7 m worked best here, but mostly because of where these lanes sit, so plan lanes from the
  band edge (section 8). The **bulges** are what make strafing useful. Without them, 0.7 m doesn't reach
  the doorway or the cover behind the car.
- **Turn-around 0.4 s** and **branch cone 40°** caused no problems in the scripted walks.

## 8. Architectural issues to settle before Quick-build

1. **One route concept, not three.** The project now has viewpoints + links (test walk), rails (automatic
   camera paths) and `routeNet` (player routes and NPC lanes). They overlap. Suggest one graph type with
   per-edge settings: who uses it (player / NPC / camera rail), strafe band, door gate, one-way, speed.
   Rails become "a route the camera drives for you".
2. **Stories and stairs.** The prototype is ground floor only. Route vertices need a story and height, and
   edges need to run up stairs. The rail planner already knows stairs; the route graph should borrow that.
3. **Sidewalk meaning in the room model.** The street is one 18 m room with curbs as thin pillars. To generate
   routes and lanes automatically, Quick-build needs to know which strip is sidewalk, road, crosswalk,
   doorway recess, and where the street-furniture line is. Suggest tags on floor pieces (or a "strip"
   object) that templates create and routes/lanes are offset from.
4. **Plan lanes from the strafe band, not the route centre.** On a 3.9 m sidewalk the curb lane sat inside
   the player's band. Lane offsets should be computed from the band edge plus clearance, and each lane needs
   its side-step limits (the prototype's `offMin/offMax`) derived from the furniture line.
5. **Cover is relative to a threat.** "Behind the parked car (east)" did not hide you from the mark,
   because the mark stood to the east. The prototype now decides cover purely by sight lines, live. Nodes
   should carry "covers from" directions only as authoring hints, and the game should keep the live test.
6. **One shared sight-line service.** The prototype has its own line-of-sight test (walls with see-through
   openings, pillar boxes with heights). Spawn rules, the mark's eyes, shooting and cover all use it. The
   editor's existing cover analysis is a separate, image-based system. Quick-build should have one
   sight-line function in `core.js` that the editor, the AI and the game share. It should also include
   objects (signs, awnings), which the prototype ignores.
7. **Spawn safety needs the reachable view, not the current frame.** The prototype only allows appearing or
   vanishing outside your whole reachable look cone or behind solid things. Turn-around (R) makes the rear
   reachable in 0.4 s, so hidden-behind-geometry portals (corners, doors, alley mouths) are the only fully
   safe kind. Templates should place portals at corners and doors, never in open sidewalk.
8. **Runtime state vs. the authored project.** Opening a door while walking must not edit the project. The
   prototype copies and restores door states. A game needs a separate world-state layer (doors, who stands
   where, the mark's alert level) on top of the authored file.
9. **Fixed simulation step.** The prototype advances by real frame time (capped). On a slow machine the
   world slows down. A game build should simulate at a fixed rate (e.g. 30 or 60 steps a second) and draw
   in between, which also makes test runs repeatable (the evaluation already does this).
10. **Art pipeline per character.** Decide the set now (see section 6): FRONT, 3/4, BACK, plus SIDE for
    walkers who can be seen across the street, and possibly BACK 3/4. Mirroring halves the work for 3/4,
    SIDE and BACK 3/4. Heads as separate cards worked and should stay separate. Walk cycles only need the
    lower body; the upper body can be a still with an occasional flourish.
11. **Authoring tools.** The route network is JSON for now. Before templates generate it, the editor needs
    a way to see and drag routes, lanes, spots, zones and portals on the map. The debug drawing in this
    prototype is a start.

## 9. How this was measured

**Scripted walks.** `tests/route/route_eval.py` drives the real editor in a headless browser. The
simulation steps in fixed 1/30-second steps from the same random seed, so every setting is compared on
identical NPC traffic. Five scripts:

1. **Stroll:** walk east along Harlan Av glancing around (ahead, across, at the shopfronts), cross
   Dunmore, turn around at the pier, walk back (150 s).
2. **Spy:** walk to the spot behind the parked car, step in, crouch and watch the mark, stand up, shoot (75 s).
3. **Across:** walk east while looking across the street the whole time (40 s).
4. **Watch:** stand on the sidewalk looking across, like a rail-shooter stop (120 s).
5. **Wiggle:** stand near the stoop sitter and shuffle left and right (40 s).

Then the same walks with different settings: rubber band 0/15/25/45/60°, leftover angle 10/30°, no
distance cheat, no hysteresis, and strafe band 0.4/0.7/1.0 m with constant side-stepping. There is also
a direct test of the picture picker: a camera drifting past a standing NPC with a 0.35 m shuffle.

**What the numbers mean.**

- *True angle:* where you stand compared with the way the NPC faces. 0° means you are straight in front of
  them, 90° means you see them side-on, 180° means you are behind them.
- *Wrong (art faces more than 30° wrong):* the difference between the true angle and the angle the chosen
  picture was drawn for. This is what makes a walker look like they're sliding or moonwalking. It is
  counted only while the NPC is walking and on screen.
- *Edge-on:* the card itself is turned away from you by more than the leftover allowance (18°), so it can
  look thin. The rubber band fixes this one.
- *Rubber band:* how far the flat card may turn toward your camera to hide that it's flat.
- *Leftover angle:* how much edge-on is allowed before the picture must change.
- *Rules:* appearing or vanishing where you could see it (your body direction ± look limit ± half the
  lens, plus a sight-line test through walls, windows and solid objects), two people on one spot, bodies
  overlapping, and an NPC going your way being passed through.

**Rubber band sweep** (watch for the two columns that don't move):

| Rubber band | Across: edge-on, near NPCs | Across: wrong while walking, near | Stroll: edge-on, mid distance | Stroll: wrong while walking, mid |
|---|---|---|---|---|
| 0° | 62% | 53% | 19% | 12% |
| 15° | 47% | 53% | 12% | 12% |
| 25° | 34% | 53% | 8% | 12% |
| 45° | 15% | 53% | 0% | 12% |
| 60° | 4% | 53% | 0% | 12% |

The rubber band removes edge-on cards and never touches wrong-facing ones. Wrong-facing can only be fixed
by having a closer picture.

**Flicker test** (picture changes in 20 s; standing 3 m from an NPC and shuffling ±0.35 m sideways):

| Hysteresis | Walking past | Standing on the FRONT/3-4 border | Standing on the 3-4/BACK border |
|---|---|---|---|
| 0° | 6 | 56 | 56 |
| 8° | 2 | 56 | 56 |
| 12° | 2 | 0 | 56 |
| 16° | 2 | 0 | 0 |

The same shuffle swings the angle more when you're close. So the prototype now raises hysteresis for NPCs
nearer than 4 m: 12° becomes 16° at 3 m and up to 30° at 1.6 m. That gives zero flicker in both border
cases at 3 m.

**Fixes made because of these runs:** the traffic cars weren't moving (a code slip); the crosshair was
below where the camera points, so shots missed; cover was decided by a spot's label instead of a real
sight line; the flicker in the 3/4-BACK gap; a miscounted overtake; appearance checks now use your whole
reachable view, not just the current frame; cars park if their exit is in view; right-hand traffic.

**Limits:** one street, one seed and scripted players. Real players stop, double back and stare more.
The 30° "wrong" threshold is my choice, and you may find 40° acceptable for chunky low-resolution
sprites. Placeholder cards are crisper and more obviously flat than real 90s sprites would be. All raw
numbers are in `findings_screens/route_eval_results.json`.

## Screens (`findings_screens/`)

01 street view, no debug · 02 the walker ahead steps into the window spot · 03 across the street, no debug
(3/4 walkers sliding sideways) · 04–06 the same moment with FRONT/3-4/BACK, with SIDE, with BACK 3/4 ·
07 crouched behind the car, hidden · 08 standing, seen · 09 the mark hit and running off, side-on ·
10 passing the stoop sitter, head turned · 11 the 2D traffic car · 12 the map with the route network ·
13 a closed door blocks the branch · 14 opened and walked in · 15 full debug view after turning around.
