# Compatibility examples — documentation only

These are human-readable reference sketches, not JSON, schemas, import fixtures or executable integration. The local IDs and artifact identities cited below are observed; every new cross-package association is explicitly hypothetical. No package file gains a field or binding. See [inventory](SHARED_CONTRACT_INVENTORY.md) and [ownership matrix](BOUNDARY_MATRIX.md).

## 1. Explicit actor → presentation selection

Observed Encounter reference:

    subsystem: Encounter
    schema: encounter-package@3
    package: package_0003, revision 1
    canonical-content digest: 2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f
    local record: actor / actor_0001

Observed presentation reference:

    subsystem: ZANT
    character/presentation identity: C001
    exact R5 packet tree: e6650aa6e28ab0b51e4d67dbd6d9922060d49673631b261718ae326cf71761ba
    accepted-neutral authority: C001_ZANT_GATE_A_R4_NEUTRAL_REVIEW_CANDIDATE_02
    selected local surface: A25_head_front_neutral
    encoded PNG SHA256: f57ca9e06a203810c3a7f5d9e4c94bf6ecb9f5a2ff83d74b27eff62b4fbba724

**Hypothetical association:** an authorized author might choose this accepted presentation reference for actor_0001. This is not a statement that the current Collector is C001, and no such binding is installed. The accepted head reference does not claim a complete animated C001 character or accept all R5 art.

The renderer could use presentation selection only. C001, F00, an uneven brow, a pose or filename cannot establish the actor's private emotion, intent, knowledge, permission or beliefs. Those remain Encounter-owned facts/interpretations. There is no gameplay-emotion field in this sketch.

Sources: [M3 actors](../packages/encounter-atlas/content/m3/seed.json), [A25 lock](../packages/zant/C001_ZANT_GATE_A_R5/contract/A25_LOCK.json), [accepted neutral lock](../packages/zant/C001_ZANT_GATE_A_R5/contract/ACCEPTED_R4_NEUTRAL_LOCK.json).

## 2. Explicit location → authored Use Point

Observed descriptive location: Atlas catalog_0001/revision 1, pinned to the M3 package above, card place_0001. It is authored context, not a mutable world-state owner.

Observed Room Creator selection:

    project artifact: examples/Route_Prototype_Street_ASSET_DEMO.room.json
    raw artifact SHA256: 6497e3d5daa5fd877728e0d40713f965c0bb2cccc06eb3c3431e4175f71443b3
    project format/version: trapstar-room-creator / 11
    placed prop ID: prop_car_unmarked
    library asset_id: car_kent_ford_crown_victoria
    point ID within that prop: pt_car_unmarked_1
    authored point type: cover; enabled: true
    point local position: x=-1.95, y=0, z=1.8 (model metres, +Y up)
    prop plan heading: 270 degrees; story: 0

The library must be identified separately (manifest schema_version 1.0, preserved library ZIP SHA256 4cf39cb712d55e866a593ad12394efec891d5ae3ac14dfd35d932b32bd8b1241). A manifest ID does not prove the external GLB/image is available or licensed for every use.

**Hypothetical association:** a future author could explicitly relate place_0001 to this exact project/prop/point after reviewing the intended scene. The current catalog and demo are not claimed to describe the same real location. No shared map ID is invented.

The point describes authored spatial availability/location only. enabled=true and type=cover do not grant permission, prove live reachability, start an Encounter action or commit a consequence. Local point y=0 is model height; local z=1.8 is not 1.8 metres above the story floor. Source prop transform/front calibration/story elevation must be considered before any future world-space conversion.

Sources: [catalog](../packages/encounter-atlas/content/ar0/last-collection.json), [authored demo](../packages/room-creator/examples/Route_Prototype_Street_ASSET_DEMO.room.json), [transform implementation](../packages/room-creator/source/core.js#L141), [point semantics](../packages/room-creator/source/FORMAT.md#L62).

## 3. Compatibility checks and rejection examples

| Situation | Documentation-level outcome | Existing support / implementation boundary |
| --- | --- | --- |
| M3 save uses encounter-save@3 with its exact sealed packageRef and matching catalog@1 ref | Existing Encounter/Atlas validators can validate/replay these native inputs | [M3 importRun](../packages/encounter-atlas/src/m3/engine.mjs#L292), [Atlas validateCatalog](../packages/encounter-atlas/src/ar0/atlas.mjs#L21) |
| Same display name or package ID, different digest/revision | Reject a native Encounter package/catalog mismatch; never select by name | Existing equality/verification checks; this stage adds no importer |
| Legacy encounter-save@2 renamed to @3 | Renaming is not conversion; do not route it to M3 as compatible | Exact native schema/domain checks; no converter authorized |
| A future spatial binding names the demo SHA above but the normalized prop/point is missing, duplicated or renamed | Reject or request explicit re-binding; no nearest-name/index fallback | Accepted boundary rule for a future importer; no cross-system validator implemented |
| An unknown RC project version or unsupported ZANT packet is supplied to a future integration | Require an explicit supported-version/artifact decision; do not infer compatibility from “newer” | RC's existing native validator can normalize its documented earlier formats; a shared version policy/wire schema remains deferred |
| R5 packet hashes match, but selected A10 or recipe B_on_GN_NN is failed | Integrity may pass while acceptance eligibility fails; do not promote failed content to an accepted asset | Existing ledger/matrix/authority; production eligibility policy implementation is deferred |
| A raw file SHA is compared as if it were Encounter canonical-content digest or ZANT decodedRGBA_SHA256 | Treat methods/scopes as different; do not declare compatibility from unequal hash domains | Existing hash methods remain package-owned |

Successful reference resolution does not grant behavioral permission or override a HOLD. Room Creator remains HOLD_FOR_FURTHER_REMEDIATION. ZANT Gate A remains incomplete even if an accepted head/neutral subset is named. IR3-25 remains the accepted actual nonblocking failure.

## 4. Unknown fields and semantic ownership

Room Creator already preserves unknown prop/point/gameplay/appearance metadata in the documented blocks. A custom tag or point type may survive a native save/reopen. Survival does not create an Encounter capability, belief, permission, consequence or shared schema. Do not copy arbitrary extensions into Encounter records: its fields() validators reject unrecognized keys in strict record envelopes.

An illustrative interaction sequence would be: a separately authorized runtime identifies a spatial target; Encounter evaluates the explicit actor/action/context; a matched result is validated and committed by Encounter; Atlas reads the resulting validated run. This is a conceptual ownership sequence only. No request protocol, engine executor, adapter, event bridge or cross-system mutation is implemented.

Sources: [RC preservation tests](../packages/room-creator/tests/props_metadata.test.js#L29), [Encounter strict fields](../packages/encounter-atlas/src/contracts.mjs#L48), [runtime commit/matched receipt](../packages/encounter-atlas/src/runtime.mjs#L44).

All associations remain illustrative. Exact serialization, binding lifecycle, spatial conversion and any future Unity mapping need separate authorization and concrete compatibility requirements.
