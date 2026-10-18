# Reference Only — Host World Boundary

`Trapstar_Routing_Player_Movement_NPC_Lanes_Context.md` is included so M3 can preserve a clean integration seam with the environment/navigation work being developed in parallel.

It is not implementation authority for Encounter core and must not turn Encounter into a Trapstar-specific system.

Do not add host spatial vocabulary to core policy merely because it appears in the reference document. In particular, do not make Encounter own routes, rails, nodes, lanes, cover, hiding, pathfinding, world geometry, line-of-sight calculations, spawning/despawning, sprite facing or locomotion.

Encounter may consume generic host results such as actor-local observations, action attempts/results, permissions, availability and declared world-condition changes.
