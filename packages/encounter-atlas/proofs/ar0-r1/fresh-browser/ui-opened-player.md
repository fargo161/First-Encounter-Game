# Atlas-readiness proof
Audience: player · Run: run_0003 · Revision: 2

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

## Observed physical result
Identity: runtime:package_0003:run_0003:command_e6f5120159d94707a2d79816705f6807:event_0003 · Kind: event

The valid collection ticket is shown and verified.

- Collector → performed_in → Observed physical result [observation; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003:actor_0001]
- Observed physical result → references_thing → Nera’s green instrument case [observation; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003:subject_0001]
- Observed physical result → references_thing → Collection ticket [observation; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003:subject_0002]
- Observed physical result → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003]
- Collector → received_observation → Observed physical result [observation; link:observation:observation_0006]
- Observed physical result → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003]

```json
{
  "eventClass": "performed_action",
  "order": 3,
  "epistemic": "observation",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0003"
    },
    {
      "kind": "action_result",
      "id": "result_0001"
    }
  ],
  "cause": {
    "commandId": "command_e6f5120159d94707a2d79816705f6807",
    "revision": 1
  },
  "participantRefs": [
    "actor_0001"
  ],
  "observerRefs": [
    "actor_0001"
  ],
  "thingRefs": [
    "subject_0001",
    "subject_0002"
  ],
  "placeRef": "place_0001",
  "details": {
    "observedResult": {
      "id": "result_0001",
      "outcome": "performed",
      "received": [
        {
          "authority": {
            "collectorId": "actor_0001",
            "itemId": "subject_0001",
            "ownerId": "actor_0003",
            "ticketId": "subject_0002",
            "verified": true
          },
          "conduct": "The valid collection ticket is shown and verified."
        }
      ]
    }
  }
}
```

## request access
Identity: runtime:package_0003:run_0003:command_a24ff940f1c64af888c1de0dc80f1821:event_0004 · Kind: event

Requests access to Collection record concerning Collection record.

- Collector → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004:actor_0001]
- Tamsin → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004:actor_0002]
- request access → references_thing → Collection record [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004:subject_0003]
- request access → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004]
- request access → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004]

```json
{
  "eventClass": "committed_communication",
  "order": 4,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0004"
    },
    {
      "kind": "message",
      "id": "message_0001"
    }
  ],
  "cause": {
    "commandId": "command_a24ff940f1c64af888c1de0dc80f1821",
    "revision": 2
  },
  "participantRefs": [
    "actor_0001",
    "actor_0002"
  ],
  "observerRefs": [],
  "thingRefs": [
    "subject_0003"
  ],
  "placeRef": "place_0001",
  "details": {
    "communication": {
      "act": "request_access",
      "content": {
        "amountMinor": 0,
        "evidence": [],
        "kind": "request",
        "operation": "inspect",
        "purpose": "ordinary_collection",
        "text": "Requests access to Collection record concerning Collection record."
      },
      "family": "Request",
      "framing": [
        {
          "kind": "displayed_concern",
          "text": "Acknowledges the clerk’s work and communicates supportive concern about a defensible handover."
        }
      ],
      "prominence": "emphatic",
      "recipientIds": [
        "actor_0002"
      ],
      "scope": {
        "kind": "subject",
        "subjectId": "subject_0003"
      },
      "senderId": "actor_0001",
      "subjectIds": [
        "subject_0003"
      ],
      "targetId": "subject_0003",
      "terms": null
    }
  }
}
```

## explain access
Identity: runtime:package_0003:run_0003:command_a24ff940f1c64af888c1de0dc80f1821:event_0005 · Kind: event

The customer file contains case-handling material and unrelated private contact information. The relevant extract and permitted handling tray are available. Private contact values remain covered.

- Tamsin → communicated_in → explain access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005:actor_0002]
- Collector → communicated_in → explain access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005:actor_0001]
- explain access → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005:subject_0001]
- explain access → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005]
- Collector → received_observation → explain access [observation; link:observation:observation_0009]
- Collector → received_observation → explain access [observation; link:observation:observation_000b]
- explain access → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005]

```json
{
  "eventClass": "committed_communication",
  "order": 5,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0005"
    },
    {
      "kind": "message",
      "id": "message_0002"
    }
  ],
  "cause": {
    "commandId": "command_a24ff940f1c64af888c1de0dc80f1821",
    "revision": 2
  },
  "participantRefs": [
    "actor_0002",
    "actor_0001"
  ],
  "observerRefs": [],
  "thingRefs": [
    "subject_0001"
  ],
  "placeRef": "place_0001",
  "details": {
    "communication": {
      "act": "explain_access",
      "content": {
        "amountMinor": 0,
        "evidence": [],
        "kind": "response",
        "operation": "explain_access",
        "purpose": "response",
        "text": "The customer file contains case-handling material and unrelated private contact information. The relevant extract and permitted handling tray are available. Private contact values remain covered."
      },
      "family": "Remark",
      "framing": [],
      "prominence": "measured",
      "recipientIds": [
        "actor_0001"
      ],
      "scope": {
        "kind": "subject",
        "subjectId": "subject_0001"
      },
      "senderId": "actor_0002",
      "subjectIds": [
        "subject_0001"
      ],
      "targetId": "subject_0001",
      "terms": null
    }
  }
}
```

## Collector
Identity: actor_0001 · Kind: person

The collecting participant. Information here records receipt and factual state, not private psychology.

- Collector → performed_in → Observed physical result [observation; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003:actor_0001]
- Collector → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004:actor_0001]
- Collector → communicated_in → explain access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005:actor_0001]
- Collector → received_observation → Referenced historical occurrence [observation; link:observation:observation_0001]
- Collector → received_observation → Observed physical result [observation; link:observation:observation_0006]
- Collector → received_observation → explain access [observation; link:observation:observation_0009]
- Collector → received_observation → explain access [observation; link:observation:observation_000b]
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
    },
    {
      "channel": "sight",
      "id": "observation_0006",
      "observerId": "actor_0001",
      "receivedDetails": {
        "authority": {
          "collectorId": "actor_0001",
          "itemId": "subject_0001",
          "ownerId": "actor_0003",
          "ticketId": "subject_0002",
          "verified": true
        },
        "conduct": "The valid collection ticket is shown and verified."
      },
      "roots": [
        {
          "id": "result_0001",
          "kind": "action_result"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 3,
      "source": {
        "id": "result_0001",
        "kind": "action_result"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0009",
      "observerId": "actor_0001",
      "receivedDetails": {
        "communication": {
          "act": "explain_access",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "response",
            "operation": "explain_access",
            "purpose": "response",
            "text": "The customer file contains case-handling material and unrelated private contact information. The relevant extract and permitted handling tray are available. Private contact values remain covered."
          },
          "family": "Remark",
          "framing": [],
          "prominence": "measured",
          "recipientIds": [
            "actor_0001"
          ],
          "scope": {
            "kind": "subject",
            "subjectId": "subject_0001"
          },
          "senderId": "actor_0002",
          "subjectIds": [
            "subject_0001"
          ],
          "targetId": "subject_0001",
          "terms": null
        }
      },
      "roots": [
        {
          "id": "message_0002",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 5,
      "source": {
        "id": "message_0002",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_000b",
      "observerId": "actor_0001",
      "receivedDetails": {
        "publicRule": {
          "custodianId": "actor_0002",
          "fileId": "subject_0004",
          "itemId": "subject_0001",
          "ownerTopicId": "subject_0009",
          "protectedScopeIds": [
            "subject_0006",
            "subject_0008"
          ],
          "recordId": "subject_0003",
          "relevantScopeId": "subject_0005",
          "serviceId": "service_0001",
          "wholeScopeId": "subject_0008",
          "witnessId": "actor_0004"
        },
        "references": [
          {
            "id": "subject_0004",
            "label": "Customer file"
          },
          {
            "id": "subject_0005",
            "label": "Case-handling scope"
          },
          {
            "id": "subject_0006",
            "label": "Private contact scope"
          },
          {
            "id": "subject_0008",
            "label": "Whole customer file"
          },
          {
            "id": "subject_000b",
            "label": "Handling tray"
          },
          {
            "id": "subject_000e",
            "label": "Supervised comparison"
          }
        ]
      },
      "roots": [
        {
          "id": "message_0002",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 5,
      "source": {
        "id": "message_0002",
        "kind": "message"
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
    },
    {
      "actionId": "action_0002",
      "granteeId": "actor_0001",
      "grantorId": "actor_0002",
      "id": "permission_0003",
      "source": {
        "id": "message_0002",
        "kind": "message"
      },
      "status": "allowed",
      "targetId": "subject_0003"
    },
    {
      "actionId": "action_0003",
      "granteeId": "actor_0001",
      "grantorId": "actor_0002",
      "id": "permission_0004",
      "source": {
        "id": "message_0002",
        "kind": "message"
      },
      "status": "allowed",
      "targetId": "subject_000b"
    }
  ],
  "visit": null
}
```

## Tamsin
Identity: actor_0002 · Kind: person

A participant in the collection visit. Knowledge and interpretations remain actor-local.

- Tamsin → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004:actor_0002]
- Tamsin → communicated_in → explain access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005:actor_0002]
- Tamsin → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0002]

## Nera Vale
Identity: actor_0003 · Kind: person

The absent owner. Absence does not grant receipt of the visit’s communications.

- Nera Vale → owns → Nera’s green instrument case [observation; link:owner:subject_0001]
- Nera Vale → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0003]

## Orrin
Identity: actor_0004 · Kind: person

A participant in the collection visit. Knowledge and interpretations remain actor-local.

- Orrin → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0004]

## Transport Office
Identity: place_0001 · Kind: place

The small transport office in which the collection visit takes place (Master §1.4).

- Observed physical result → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003]
- request access → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004]
- explain access → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005]
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
- Customer file → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0004]
- Handling tray → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000b]
- Coins → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000d]
- Transport Office → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:place_0001]
- Referenced historical occurrence → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:event_0001]
- Observed physical result → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003]
- request access → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004]
- explain access → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005]

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
- Observed physical result → references_thing → Nera’s green instrument case [observation; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003:subject_0001]
- explain access → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005:subject_0001]
- Nera Vale → owns → Nera’s green instrument case [observation; link:owner:subject_0001]
- Nera’s green instrument case → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0001]

## Collection ticket
Identity: subject_0002 · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Referenced historical occurrence → references_thing → Collection ticket [observation; link:thing:event_0001:subject_0002]
- Observed physical result → references_thing → Collection ticket [observation; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003:subject_0002]
- Collection ticket → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0002]

## Collection record
Identity: subject_0003 · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Referenced historical occurrence → references_thing → Collection record [observation; link:thing:event_0001:subject_0003]
- request access → references_thing → Collection record [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004:subject_0003]
- Collection record → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0003]

## Customer file
Identity: subject_0004 · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Customer file → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0004]

## Handling tray
Identity: subject_000b · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Handling tray → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000b]

## Coins
Identity: subject_000d · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Referenced historical occurrence → references_thing → Coins [observation; link:thing:event_0001:subject_000d]
- Coins → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000d]

## Recent meaningful changes

- Revision 1: An actual physical result was committed. [change:command_e6f5120159d94707a2d79816705f6807:physical_result:result_0001]
- Revision 2: A bounded action permission changed; the action itself is separate. [change:command_a24ff940f1c64af888c1de0dc80f1821:permission_changed:permission_0003]
- Revision 2: A bounded action permission changed; the action itself is separate. [change:command_a24ff940f1c64af888c1de0dc80f1821:permission_changed:permission_0004]
