# System boundaries

Encounter governs how world circumstances become playable interactions, validates supported actions and governs consequences. It does not physically contain every subsystem.

Atlas A1 reads validated Encounter saves and descriptive catalogs. It projects developer/player source views without owning mutable gameplay truth. The accepted A1 snapshot preserves its dependency code and content.

Room Creator owns editable spatial data: rooms, stories, openings, props, transforms, collision, routes, and Use Points. A point named search or a gameplay tag is authored metadata; it does not grant permission or run Encounter behavior.

ZANT owns character/presentation asset identity, registration, recipes, masks, and explicit compatibility rules. A pose or expression must not silently become a gameplay claim about knowledge, intent, emotion or permission.

Stage 12 accepts documentation-level qualification, version/hash/frame and ownership conventions in [the boundary decision](../../contracts/SHARED_CONTRACT_DECISION.md). The [matrix](../../contracts/BOUNDARY_MATRIX.md) keeps native concepts separate. Actual binding serialization, transforms and request/result bridges remain deferred. No shared executable schema or runtime integration is implemented.

Future Unity/Adventure Creator adapters consume validated outputs and own engine execution, scene objects, rendering, movement and runtime adaptation. They must not silently duplicate Encounter semantics or take canonical ownership of upstream authoring sources. No Unity version, API or runtime implementation is selected here.

Keep existing M1/M2 and M3 contract versions separate. Preserve ownership versus custody, observations versus beliefs, descriptive catalog records versus mutable state, authored points versus executed actions, and presentation identity versus actor identity.
