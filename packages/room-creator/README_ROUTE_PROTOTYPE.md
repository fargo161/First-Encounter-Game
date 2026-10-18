# Route walk prototype (Room Creator 0.13.1)

This is a test, not a feature. It answers one question: can Trapstar feel like a freely lived-in
first-person street while your feet are actually locked to a narrow, hand-drawn route and every
pedestrian is locked to a lane?

## Open it (about one minute)

1. Unzip the folder anywhere.
2. Double-click **Room_Creator.html**. Use Chrome or Edge.
3. Click **Open** (top bar) and choose **examples/Route_Prototype_Street.room.json**. It is a big file
   (18 MB of pictures), so give it a few seconds.
4. Click **Route walk** (top right, just left of "Test walk").
5. Click once on the picture. That captures the mouse, so moving the mouse turns your head.
   Press **Esc** once to free the mouse, and **Esc** again to leave the route walk.

Nothing you do in the route walk changes the project. Doors you open are put back when you leave,
and nothing goes on the Undo list.

## Controls

| Key | What it does |
|---|---|
| **W / S** (or ↑ / ↓) | walk forward / back along the route |
| **A / D** | strafe a little to the side (this is for peeking and lining up a shot, not for roaming) |
| **mouse** (or ← / →, PgUp / PgDn) | look around, within limits |
| **R** | turn around (a quick, deliberate 180°) |
| **C** | crouch (lower eyes; behind the parked car you are hidden) |
| **Shift** | short sprint (you run out of breath) |
| **Space** or **click** | shoot at whatever is under the cross in the middle |
| **E** | open / close the bodega door when you are next to it |
| **Tab** | debug overlay: off → labels → full |
| **1** / **3** | map / back to first person |
| **Esc** | free the mouse, then leave |

**Junctions** (white diamonds in debug view): to take a branch, look toward it as you walk into the
junction. Look straight ahead to carry on. The top-left box tells you what the next junction offers.

**Spots** (circles on the ground): where the strafe band bulges out you can step sideways into a spot,
such as the tenement doorway, the bodega window, or behind the parked car. Only one person can stand in a
spot at a time, you included. If an NPC is standing there you can't get in.

## Things to try

1. **Walk east** along Harlan Av. Walker C, ahead of you, walks the same way. Catch up and watch what it
   does: people ahead of you should step aside into a doorway or speed up, not let you pass through them.
2. **Look across the street** (mouse right). Watch the far walkers, the people hanging out at the pizza
   place, and "the mark", who stops in the pizza doorway and looks around.
3. **Spy and fight.** Strafe right (D) into the spot behind the parked car and crouch (C). The top-left box
   says whether the mark can see you. Stand up and it can. Shoot it (Space). If the car is in the way,
   the shot is blocked.
4. **The door.** At the bodega the door starts closed. Look at it and walk: you stop. Press E, then walk in.
   The shopper NPC can only come out of the bodega while the door is open.
5. **The corner.** At Harlan & Dunmore, look left and walk to turn up Dunmore St. Look straight to use the
   crosswalk. Cars stop if you are standing in the road.
6. **Turn around** (R) and watch people you have just passed. Then walk backwards (S).
7. **Play with the sliders** in the left panel while walking: strafe band, look limit, rubber band,
   leftover angle, hysteresis, and the two test-only pictures (SIDE, BACK 3/4).

## What the NPC cards mean

Every NPC is a flat placeholder card. Its colour and big label tell you which body picture was chosen:
**green FRONT**, **amber 3/4**, **blue BACK**, plus two test-only pictures that are off until you tick
them: **red SIDE** and **purple BACK 3/4**. The head is a separate small card (F, ¾, S, B), because it can
turn on its own.

- **Rubber band:** the card turns toward you by up to this many degrees, to hide how flat it is.
- **Leftover angle:** if the card would still be seen more edge-on than this, it switches picture.
- **Hysteresis:** a new picture has to be clearly better (by this many degrees) before the card
  switches, so it doesn't flicker between FRONT and 3/4 when you shuffle sideways. "More hysteresis up
  close" raises it for NPCs nearer than 4 m, because the same shuffle changes the angle more up close.

In **full** debug view each nearby NPC gets a label with a little dial seen from above. You are the white
dot at the bottom. The green arrow is where the NPC is really facing. The dashed line is the angle its
picture was drawn for. The thick bar is the card itself. Pink is the head. Red label text means the card is
being seen too edge-on.

## The numbers on the right

The right panel measures the walk as you go: how often each card was shown, how often a SIDE card *would*
have been picked if allowed, a side-by-side comparison of four art sets judged on the same walk, the true viewing angles, where the cheat showed (card edge-on, or a walker
whose picture faces more than 30° the wrong way), and the rules (anyone appearing or vanishing in view,
two people on one spot, NPCs being passed from behind). **Download measurements** saves it as a file you
can send back.
