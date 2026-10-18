# Atlas-readiness proof
Audience: player · Run: run_0003 · Revision: 0

Derived read-only from Encounter; this is a proof export, not Atlas UI.

## Referenced historical occurrence
Identity: event_0001 · Kind: event

Only the received fragments citing this occurrence are shown; unseen details remain unavailable.

- Referenced historical occurrence → references_thing → Nera’s green instrument case [observation; link:thing:event_0001:subject_0001]
- Referenced historical occurrence → references_thing → Collection ticket [observation; link:thing:event_0001:subject_0002]
- Referenced historical occurrence → references_thing → Collection record [observation; link:thing:event_0001:subject_0003]
- Referenced historical occurrence → references_thing → Coins [observation; link:thing:event_0001:subject_000d]
- Collector → received_observation → Referenced historical occurrence [observation; link:observation:observation_0001]
- Referenced historical occurrence → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:event_0001]

```json
{
  "eventClass": "authored_history",
  "order": 1,
  "epistemic": "observation",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0001"
    }
  ],
  "cause": null,
  "participantRefs": [],
  "observerRefs": [],
  "thingRefs": [
    "subject_0001",
    "subject_0002",
    "subject_0003",
    "subject_000d"
  ],
  "placeRef": null,
  "details": {
    "receivedFragments": [
      {
        "observationId": "observation_0001",
        "channel": "initial",
        "details": {
          "collection": {
            "entry": "collected",
            "itemId": "subject_0001",
            "recordId": "subject_0003",
            "ticketId": "subject_0002"
          },
          "participants": [
            {
              "id": "actor_0001",
              "kind": "human",
              "label": "Collector"
            },
            {
              "id": "actor_0002",
              "kind": "npc",
              "label": "Tamsin"
            },
            {
              "id": "actor_0003",
              "kind": "absent",
              "label": "Nera Vale"
            },
            {
              "id": "actor_0004",
              "kind": "npc",
              "label": "Orrin"
            }
          ],
          "references": [
            {
              "id": "subject_0001",
              "label": "Nera’s green instrument case"
            },
            {
              "id": "subject_0002",
              "label": "Collection ticket"
            },
            {
              "id": "subject_0003",
              "label": "Collection record"
            },
            {
              "id": "subject_0009",
              "label": "Nera Vale"
            },
            {
              "id": "subject_000d",
              "label": "Coins"
            }
          ]
        },
        "roots": [
          {
            "id": "event_0001",
            "kind": "event"
          }
        ]
      }
    ]
  }
}
```

## Collector
Identity: actor_0001 · Kind: person

The collecting participant. Information here records receipt and factual state, not private psychology.

- Collector → received_observation → Referenced historical occurrence [observation; link:observation:observation_0001]
- Collector → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0001]

```json
{
  "actorKind": "human",
  "observations": [
    {
      "channel": "initial",
      "id": "observation_0001",
      "observerId": "actor_0001",
      "receivedDetails": {
        "collection": {
          "entry": "collected",
          "itemId": "subject_0001",
          "recordId": "subject_0003",
          "ticketId": "subject_0002"
        },
        "participants": [
          {
            "id": "actor_0001",
            "kind": "human",
            "label": "Collector"
          },
          {
            "id": "actor_0002",
            "kind": "npc",
            "label": "Tamsin"
          },
          {
            "id": "actor_0003",
            "kind": "absent",
            "label": "Nera Vale"
          },
          {
            "id": "actor_0004",
            "kind": "npc",
            "label": "Orrin"
          }
        ],
        "references": [
          {
            "id": "subject_0001",
            "label": "Nera’s green instrument case"
          },
          {
            "id": "subject_0002",
            "label": "Collection ticket"
          },
          {
            "id": "subject_0003",
            "label": "Collection record"
          },
          {
            "id": "subject_0009",
            "label": "Nera Vale"
          },
          {
            "id": "subject_000d",
            "label": "Coins"
          }
        ]
      },
      "roots": [
        {
          "id": "event_0001",
          "kind": "event"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 1,
      "source": {
        "id": "event_0001",
        "kind": "event"
      }
    }
  ],
  "receivedClaims": [],
  "beliefs": [],
  "hypotheses": [],
  "permissions": [
    {
      "actionId": "action_0001",
      "granteeId": "actor_0001",
      "grantorId": "actor_0002",
      "id": "permission_0001",
      "source": {
        "id": "event_0001",
        "kind": "event"
      },
      "status": "allowed",
      "targetId": "subject_0002"
    }
  ],
  "visit": null
}
```

## Tamsin
Identity: actor_0002 · Kind: person

A participant in the collection visit. Knowledge and interpretations remain actor-local.

- Tamsin → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0002]

## Nera Vale
Identity: actor_0003 · Kind: person

The absent owner. Absence does not grant receipt of the visit’s communications.

- Nera Vale → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0003]

## Orrin
Identity: actor_0004 · Kind: person

A participant in the collection visit. Knowledge and interpretations remain actor-local.

- Orrin → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0004]

## Transport Office
Identity: place_0001 · Kind: place

The small transport office in which the collection visit takes place (Master §1.4).

- Transport Office → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:place_0001]

## Last Collection · The Protective Shortcut
Identity: scenario_0001 · Kind: scenario

Recover the owner’s instrument case; money, privacy and record correction remain separate outcomes.

- Collector → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0001]
- Tamsin → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0002]
- Nera Vale → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0003]
- Orrin → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0004]
- Nera’s green instrument case → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0001]
- Collection ticket → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0002]
- Collection record → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0003]
- Coins → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000d]
- Transport Office → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:place_0001]
- Referenced historical occurrence → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:event_0001]

```json
{
  "status": {
    "recovered": false,
    "serviceClosed": false,
    "comparisonComplete": false,
    "recordCorrected": false
  },
  "pendingOffer": null
}
```

## Nera’s green instrument case
Identity: subject_0001 · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Referenced historical occurrence → references_thing → Nera’s green instrument case [observation; link:thing:event_0001:subject_0001]
- Nera’s green instrument case → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0001]

## Collection ticket
Identity: subject_0002 · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Referenced historical occurrence → references_thing → Collection ticket [observation; link:thing:event_0001:subject_0002]
- Collection ticket → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0002]

## Collection record
Identity: subject_0003 · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Referenced historical occurrence → references_thing → Collection record [observation; link:thing:event_0001:subject_0003]
- Collection record → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0003]

## Coins
Identity: subject_000d · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Referenced historical occurrence → references_thing → Coins [observation; link:thing:event_0001:subject_000d]
- Coins → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000d]

## Recent meaningful changes

