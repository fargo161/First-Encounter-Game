# Atlas-readiness proof
Audience: author · Run: run_0003 · Revision: 12

Derived read-only from Encounter; this is a proof export, not Atlas UI.

## Collection record origin
Identity: event_0001 · Kind: event

The original collection-record entry and its authored provenance. Later communications are separate occurrences.

- Collection record origin → references_thing → Nera’s green instrument case [world_truth; link:thing:event_0001:subject_0001]
- Collection record origin → references_thing → Collection record [world_truth; link:thing:event_0001:subject_0003]
- Collection record origin → references_thing → Numbered drying tag [world_truth; link:thing:event_0001:subject_000c]
- Collection record origin → references_thing → Observed wrapped green case — identity not established [world_truth; link:thing:event_0001:subject_0011]
- Collector → received_observation → Collection record origin [observation; link:observation:observation_0001]
- Tamsin → received_observation → Collection record origin [observation; link:observation:observation_0002]
- Orrin → received_observation → Collection record origin [observation; link:observation:observation_0003]
- Collection record origin → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:event_0001]

```json
{
  "eventClass": "authored_history",
  "order": 1,
  "epistemic": "world_truth",
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
    "subject_0003",
    "subject_000c",
    "subject_0011"
  ],
  "placeRef": null,
  "details": {
    "entry": "collected",
    "facts": [
      {
        "id": "fact_0001",
        "label": "Recipient signature: unfilled",
        "predicate": "recipient_signature",
        "subjectId": "subject_0003",
        "value": "unfilled"
      },
      {
        "id": "fact_0002",
        "label": "A wrapped green case moved toward the partition; its exact identity was not established by that sighting",
        "predicate": "movement_direction",
        "subjectId": "subject_0011",
        "value": "subject_000a"
      },
      {
        "id": "fact_0003",
        "label": "Case is in dry storage",
        "predicate": "storage_location",
        "subjectId": "subject_0001",
        "value": "subject_000f"
      },
      {
        "id": "fact_0004",
        "label": "Moved after a spill to protect it from damp",
        "predicate": "movement_reason",
        "subjectId": "subject_0001",
        "value": "spill_protection"
      },
      {
        "id": "fact_0005",
        "label": "Drying tag 041 matches the case reference",
        "predicate": "item_reference",
        "subjectId": "subject_000c",
        "value": "subject_0001"
      },
      {
        "id": "fact_0006",
        "label": "Drying tag records internal drying, not recipient collection",
        "predicate": "handling_type",
        "subjectId": "subject_000c",
        "value": "internal_drying"
      },
      {
        "id": "fact_0007",
        "label": "Original collected entry meant removed from the rack",
        "predicate": "original_entry_meaning",
        "subjectId": "subject_0003",
        "value": "removed_from_rack"
      },
      {
        "id": "fact_0008",
        "label": "Separate hauling obligation: already paid",
        "predicate": "hauling_obligation_status",
        "subjectId": "subject_0001",
        "value": "already_paid"
      },
      {
        "id": "fact_0009",
        "label": "Private contact value",
        "predicate": "protected_contact",
        "subjectId": "subject_0006",
        "value": "PRIVATE-M3-FIXTURE: 17 Cedar Lane"
      }
    ]
  }
}
```

## Earlier handling movement
Identity: event_0002 · Kind: event

The authored prior handling occurrence. Each observer received only the declared fragment.

- Earlier handling movement → references_thing → Nera’s green instrument case [world_truth; link:thing:event_0002:subject_0001]
- Earlier handling movement → references_thing → Collection record [world_truth; link:thing:event_0002:subject_0003]
- Earlier handling movement → references_thing → Observed wrapped green case — identity not established [world_truth; link:thing:event_0002:subject_0011]
- Collector → was_told_about → Earlier handling movement [report; link:claim:claim_0001:actor_0001:event%3Aevent_0002]
- Orrin → reported_about → Earlier handling movement [report; link:reporter:claim_0001:actor_0001:event%3Aevent_0002]
- Tamsin → received_observation → Earlier handling movement [observation; link:observation:observation_0004]
- Orrin → received_observation → Earlier handling movement [observation; link:observation:observation_0005]
- Earlier handling movement → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:event_0002]

```json
{
  "eventClass": "authored_history",
  "order": 2,
  "epistemic": "world_truth",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0002"
    }
  ],
  "cause": null,
  "participantRefs": [],
  "observerRefs": [],
  "thingRefs": [
    "subject_0001",
    "subject_0003",
    "subject_0011"
  ],
  "placeRef": null,
  "details": {
    "evidence": [
      {
        "form": "direct",
        "label": "A wrapped green case moved toward the partition; its exact identity was not established by that sighting",
        "markId": null,
        "predicate": "movement_direction",
        "roots": [
          {
            "id": "event_0001",
            "kind": "event"
          }
        ],
        "subjectId": "subject_0011",
        "value": "subject_000a"
      },
      {
        "form": "direct",
        "label": "Case is in dry storage",
        "markId": null,
        "predicate": "storage_location",
        "roots": [
          {
            "id": "event_0001",
            "kind": "event"
          }
        ],
        "subjectId": "subject_0001",
        "value": "subject_000f"
      },
      {
        "form": "direct",
        "label": "Moved after a spill to protect it from damp",
        "markId": null,
        "predicate": "movement_reason",
        "roots": [
          {
            "id": "event_0001",
            "kind": "event"
          }
        ],
        "subjectId": "subject_0001",
        "value": "spill_protection"
      },
      {
        "form": "direct",
        "label": "Original collected entry meant removed from the rack",
        "markId": null,
        "predicate": "original_entry_meaning",
        "roots": [
          {
            "id": "event_0001",
            "kind": "event"
          }
        ],
        "subjectId": "subject_0003",
        "value": "removed_from_rack"
      }
    ]
  }
}
```

## Show and verify collection ticket
Identity: runtime:package_0003:run_0003:command_e6f5120159d94707a2d79816705f6807:event_0003 · Kind: event

A committed performed action result.

- Collector → performed_in → Show and verify collection ticket [physical_result; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003:actor_0001]
- Show and verify collection ticket → references_thing → Nera’s green instrument case [physical_result; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003:subject_0001]
- Show and verify collection ticket → references_thing → Collection ticket [physical_result; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003:subject_0002]
- Show and verify collection ticket → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003]
- Collector → received_observation → Show and verify collection ticket [observation; link:observation:observation_0006]
- Tamsin → received_observation → Show and verify collection ticket [observation; link:observation:observation_0007]
- Show and verify collection ticket → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003]

```json
{
  "eventClass": "performed_action",
  "order": 3,
  "epistemic": "physical_result",
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
    "actor_0001",
    "actor_0002"
  ],
  "thingRefs": [
    "subject_0001",
    "subject_0002"
  ],
  "placeRef": "place_0001",
  "details": {
    "result": {
      "effects": [],
      "id": "result_0001",
      "observerDetails": [
        {
          "details": {
            "authority": {
              "collectorId": "actor_0001",
              "itemId": "subject_0001",
              "ownerId": "actor_0003",
              "ticketId": "subject_0002",
              "verified": true
            },
            "conduct": "The valid collection ticket is shown and verified."
          },
          "observerId": "actor_0001"
        },
        {
          "details": {
            "authority": {
              "collectorId": "actor_0001",
              "itemId": "subject_0001",
              "ownerId": "actor_0003",
              "ticketId": "subject_0002",
              "verified": true
            },
            "conduct": "The valid collection ticket is shown and verified."
          },
          "observerId": "actor_0002"
        }
      ],
      "outcome": "performed",
      "request": {
        "actionType": "action_0001",
        "actorId": "actor_0001",
        "commandId": "command_e6f5120159d94707a2d79816705f6807",
        "expectedRevision": 0,
        "permissionId": "permission_0001",
        "targetId": "subject_0002"
      }
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
- Tamsin → received_observation → request access [observation; link:observation:observation_0008]
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
- Tamsin → received_observation → explain access [observation; link:observation:observation_000a]
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

## Inspect handling extract
Identity: runtime:package_0003:run_0003:command_356eda7866464262b793d35ce44fd69f:event_0006 · Kind: event

A committed performed action result.

- Collector → performed_in → Inspect handling extract [physical_result; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_356eda7866464262b793d35ce44fd69f%3Aevent_0006:actor_0001]
- Inspect handling extract → references_thing → Collection record [physical_result; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_356eda7866464262b793d35ce44fd69f%3Aevent_0006:subject_0003]
- Inspect handling extract → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_356eda7866464262b793d35ce44fd69f%3Aevent_0006]
- Collector → received_observation → Inspect handling extract [observation; link:observation:observation_000c]
- Tamsin → received_observation → Inspect handling extract [observation; link:observation:observation_000d]
- Inspect handling extract → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_356eda7866464262b793d35ce44fd69f%3Aevent_0006]

```json
{
  "eventClass": "performed_action",
  "order": 6,
  "epistemic": "physical_result",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0006"
    },
    {
      "kind": "action_result",
      "id": "result_0002"
    }
  ],
  "cause": {
    "commandId": "command_356eda7866464262b793d35ce44fd69f",
    "revision": 3
  },
  "participantRefs": [
    "actor_0001"
  ],
  "observerRefs": [
    "actor_0001",
    "actor_0002"
  ],
  "thingRefs": [
    "subject_0003"
  ],
  "placeRef": "place_0001",
  "details": {
    "result": {
      "effects": [],
      "id": "result_0002",
      "observerDetails": [
        {
          "details": {
            "conduct": "Performs the permitted inspect action.",
            "evidence": [
              {
                "form": "document",
                "label": "Recipient signature: unfilled",
                "markId": "subject_0010",
                "predicate": "recipient_signature",
                "roots": [
                  {
                    "id": "result_0002",
                    "kind": "action_result"
                  }
                ],
                "subjectId": "subject_0003",
                "value": "unfilled"
              }
            ],
            "references": [
              {
                "id": "subject_0003",
                "label": "Collection record"
              }
            ]
          },
          "observerId": "actor_0001"
        },
        {
          "details": {
            "conduct": "Sees the collector inspect the permitted extract; the small print is unreadable from here.",
            "evidence": [],
            "references": []
          },
          "observerId": "actor_0002"
        }
      ],
      "outcome": "performed",
      "request": {
        "actionType": "action_0002",
        "actorId": "actor_0001",
        "commandId": "command_356eda7866464262b793d35ce44fd69f",
        "expectedRevision": 2,
        "permissionId": "permission_0003",
        "targetId": "subject_0003"
      }
    }
  }
}
```

## Search permitted handling tray
Identity: runtime:package_0003:run_0003:command_3d3dfea73a8e4f3eb1b17c4295d08ea2:event_0007 · Kind: event

A committed performed action result.

- Collector → performed_in → Search permitted handling tray [physical_result; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_3d3dfea73a8e4f3eb1b17c4295d08ea2%3Aevent_0007:actor_0001]
- Search permitted handling tray → references_thing → Nera’s green instrument case [physical_result; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_3d3dfea73a8e4f3eb1b17c4295d08ea2%3Aevent_0007:subject_0001]
- Search permitted handling tray → references_thing → Handling tray [physical_result; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_3d3dfea73a8e4f3eb1b17c4295d08ea2%3Aevent_0007:subject_000b]
- Search permitted handling tray → references_thing → Numbered drying tag [physical_result; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_3d3dfea73a8e4f3eb1b17c4295d08ea2%3Aevent_0007:subject_000c]
- Search permitted handling tray → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_3d3dfea73a8e4f3eb1b17c4295d08ea2%3Aevent_0007]
- Collector → received_observation → Search permitted handling tray [observation; link:observation:observation_000e]
- Orrin → received_observation → Search permitted handling tray [observation; link:observation:observation_000f]
- Search permitted handling tray → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_3d3dfea73a8e4f3eb1b17c4295d08ea2%3Aevent_0007]

```json
{
  "eventClass": "performed_action",
  "order": 7,
  "epistemic": "physical_result",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0007"
    },
    {
      "kind": "action_result",
      "id": "result_0003"
    }
  ],
  "cause": {
    "commandId": "command_3d3dfea73a8e4f3eb1b17c4295d08ea2",
    "revision": 4
  },
  "participantRefs": [
    "actor_0001"
  ],
  "observerRefs": [
    "actor_0001",
    "actor_0004"
  ],
  "thingRefs": [
    "subject_0001",
    "subject_000b",
    "subject_000c"
  ],
  "placeRef": "place_0001",
  "details": {
    "result": {
      "effects": [],
      "id": "result_0003",
      "observerDetails": [
        {
          "details": {
            "conduct": "Performs the permitted search action.",
            "evidence": [
              {
                "form": "document",
                "label": "Drying tag 041 matches the case reference",
                "markId": "subject_0010",
                "predicate": "item_reference",
                "roots": [
                  {
                    "id": "result_0003",
                    "kind": "action_result"
                  }
                ],
                "subjectId": "subject_000c",
                "value": "subject_0001"
              },
              {
                "form": "document",
                "label": "Drying tag records internal drying, not recipient collection",
                "markId": "subject_0010",
                "predicate": "handling_type",
                "roots": [
                  {
                    "id": "result_0003",
                    "kind": "action_result"
                  }
                ],
                "subjectId": "subject_000c",
                "value": "internal_drying"
              }
            ],
            "references": [
              {
                "id": "subject_000c",
                "label": "Numbered drying tag"
              },
              {
                "id": "subject_0001",
                "label": "Nera’s green instrument case"
              }
            ]
          },
          "observerId": "actor_0001"
        },
        {
          "details": {
            "conduct": "Sees the collector search the permitted handling tray; does not read the tag.",
            "evidence": [],
            "references": []
          },
          "observerId": "actor_0004"
        }
      ],
      "outcome": "performed",
      "request": {
        "actionType": "action_0003",
        "actorId": "actor_0001",
        "commandId": "command_3d3dfea73a8e4f3eb1b17c4295d08ea2",
        "expectedRevision": 3,
        "permissionId": "permission_0004",
        "targetId": "subject_000b"
      }
    }
  }
}
```

## ask whereabouts
Identity: runtime:package_0003:run_0003:command_9f0c9871d02444bfbf24823c17901695:event_0008 · Kind: event

Asks where Nera’s green instrument case is. This is a request for location information, not a physical search.

- Collector → communicated_in → ask whereabouts [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0008:actor_0001]
- Tamsin → communicated_in → ask whereabouts [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0008:actor_0002]
- ask whereabouts → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0008:subject_0001]
- ask whereabouts → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0008]
- Tamsin → received_observation → ask whereabouts [observation; link:observation:observation_0010]
- ask whereabouts → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0008]

```json
{
  "eventClass": "committed_communication",
  "order": 8,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0008"
    },
    {
      "kind": "message",
      "id": "message_0003"
    }
  ],
  "cause": {
    "commandId": "command_9f0c9871d02444bfbf24823c17901695",
    "revision": 5
  },
  "participantRefs": [
    "actor_0001",
    "actor_0002"
  ],
  "observerRefs": [],
  "thingRefs": [
    "subject_0001"
  ],
  "placeRef": "place_0001",
  "details": {
    "communication": {
      "act": "ask_whereabouts",
      "content": {
        "amountMinor": 0,
        "evidence": [],
        "kind": "question",
        "operation": "ask",
        "purpose": "ordinary_collection",
        "text": "Asks where Nera’s green instrument case is. This is a request for location information, not a physical search."
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
        "subjectId": "subject_0001"
      },
      "senderId": "actor_0001",
      "subjectIds": [
        "subject_0001"
      ],
      "targetId": "subject_0001",
      "terms": null
    }
  }
}
```

## defer location
Identity: runtime:package_0003:run_0003:command_9f0c9871d02444bfbf24823c17901695:event_0009 · Kind: event

I refer you to the recorded entry and the relevant inspection route rather than explaining the earlier movement.

- Tamsin → communicated_in → defer location [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0009:actor_0002]
- Collector → communicated_in → defer location [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0009:actor_0001]
- defer location → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0009:subject_0001]
- defer location → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0009]
- Collector → received_observation → defer location [observation; link:observation:observation_0011]
- Tamsin → received_observation → defer location [observation; link:observation:observation_0012]
- defer location → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0009]

```json
{
  "eventClass": "committed_communication",
  "order": 9,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0009"
    },
    {
      "kind": "message",
      "id": "message_0004"
    }
  ],
  "cause": {
    "commandId": "command_9f0c9871d02444bfbf24823c17901695",
    "revision": 5
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
      "act": "defer_location",
      "content": {
        "amountMinor": 0,
        "evidence": [],
        "kind": "response",
        "operation": "defer_location",
        "purpose": "response",
        "text": "I refer you to the recorded entry and the relevant inspection route rather than explaining the earlier movement."
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

## ask whereabouts
Identity: runtime:package_0003:run_0003:command_39ee8465dde54afaa2b1a537f3908af6:event_000b · Kind: event

Asks where Nera’s green instrument case is. This is a request for location information, not a physical search.

- Collector → communicated_in → ask whereabouts [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000b:actor_0001]
- Orrin → communicated_in → ask whereabouts [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000b:actor_0004]
- ask whereabouts → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000b:subject_0001]
- ask whereabouts → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000b]
- Orrin → received_observation → ask whereabouts [observation; link:observation:observation_0013]
- ask whereabouts → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000b]

```json
{
  "eventClass": "committed_communication",
  "order": 11,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_000b"
    },
    {
      "kind": "message",
      "id": "message_0005"
    }
  ],
  "cause": {
    "commandId": "command_39ee8465dde54afaa2b1a537f3908af6",
    "revision": 7
  },
  "participantRefs": [
    "actor_0001",
    "actor_0004"
  ],
  "observerRefs": [],
  "thingRefs": [
    "subject_0001"
  ],
  "placeRef": "place_0001",
  "details": {
    "communication": {
      "act": "ask_whereabouts",
      "content": {
        "amountMinor": 0,
        "evidence": [],
        "kind": "question",
        "operation": "ask",
        "purpose": "ordinary_collection",
        "text": "Asks where Nera’s green instrument case is. This is a request for location information, not a physical search."
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
        "actor_0004"
      ],
      "scope": {
        "kind": "subject",
        "subjectId": "subject_0001"
      },
      "senderId": "actor_0001",
      "subjectIds": [
        "subject_0001"
      ],
      "targetId": "subject_0001",
      "terms": null
    }
  }
}
```

## limited account
Identity: runtime:package_0003:run_0003:command_39ee8465dde54afaa2b1a537f3908af6:event_000c · Kind: event

A wrapped green case moved toward the partition; its exact identity was not established by that sighting
It may have been an exception. I did not see the damp seam, final cupboard, or purpose; that interpretation is not a witnessed fact.
This report does not prove a completed collection.

- Orrin → communicated_in → limited account [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000c:actor_0004]
- Collector → communicated_in → limited account [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000c:actor_0001]
- limited account → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000c:subject_0001]
- limited account → references_thing → Observed wrapped green case — identity not established [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000c:subject_0011]
- limited account → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000c]
- Collector → received_observation → limited account [observation; link:observation:observation_0014]
- Collector → received_observation → limited account [observation; link:observation:observation_0015]
- Orrin → received_observation → limited account [observation; link:observation:observation_0016]
- limited account → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000c]

```json
{
  "eventClass": "committed_communication",
  "order": 12,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_000c"
    },
    {
      "kind": "message",
      "id": "message_0006"
    }
  ],
  "cause": {
    "commandId": "command_39ee8465dde54afaa2b1a537f3908af6",
    "revision": 7
  },
  "participantRefs": [
    "actor_0004",
    "actor_0001"
  ],
  "observerRefs": [],
  "thingRefs": [
    "subject_0001",
    "subject_0011"
  ],
  "placeRef": "place_0001",
  "details": {
    "communication": {
      "act": "limited_account",
      "content": {
        "amountMinor": 0,
        "evidence": [
          {
            "form": "report",
            "label": "A wrapped green case moved toward the partition; its exact identity was not established by that sighting",
            "markId": null,
            "predicate": "movement_direction",
            "roots": [
              {
                "id": "event_0002",
                "kind": "event"
              }
            ],
            "subjectId": "subject_0011",
            "value": "subject_000a"
          }
        ],
        "kind": "response",
        "operation": "limited_account",
        "purpose": "response",
        "text": "A wrapped green case moved toward the partition; its exact identity was not established by that sighting\nIt may have been an exception. I did not see the damp seam, final cupboard, or purpose; that interpretation is not a witnessed fact.\nThis report does not prove a completed collection."
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
      "senderId": "actor_0004",
      "subjectIds": [
        "subject_0001",
        "subject_0011",
        "subject_000a"
      ],
      "targetId": "subject_0001",
      "terms": null
    }
  }
}
```

## propose exchange
Identity: runtime:package_0003:run_0003:command_5962c390542b4a8082284fa7327cbbcb:event_000e · Kind: event

Offers 100 minor money units for ordinary collection; no fee or debt is asserted.

- Collector → communicated_in → propose exchange [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000e:actor_0001]
- Tamsin → communicated_in → propose exchange [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000e:actor_0002]
- propose exchange → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000e:subject_0001]
- propose exchange → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000e]
- Tamsin → received_observation → propose exchange [observation; link:observation:observation_0017]
- propose exchange → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000e]

```json
{
  "eventClass": "committed_communication",
  "order": 14,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_000e"
    },
    {
      "kind": "message",
      "id": "message_0007"
    }
  ],
  "cause": {
    "commandId": "command_5962c390542b4a8082284fa7327cbbcb",
    "revision": 9
  },
  "participantRefs": [
    "actor_0001",
    "actor_0002"
  ],
  "observerRefs": [],
  "thingRefs": [
    "subject_0001"
  ],
  "placeRef": "place_0001",
  "details": {
    "communication": {
      "act": "propose_exchange",
      "content": {
        "amountMinor": 100,
        "evidence": [],
        "kind": "proposal",
        "operation": "inspect",
        "purpose": "ordinary_collection",
        "text": "Offers 100 minor money units for ordinary collection; no fee or debt is asserted."
      },
      "family": "Offer",
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
        "subjectId": "subject_0001"
      },
      "senderId": "actor_0001",
      "subjectIds": [
        "subject_0001"
      ],
      "targetId": "subject_0001",
      "terms": null
    }
  }
}
```

## ordinary payment refusal
Identity: runtime:package_0003:run_0003:command_5962c390542b4a8082284fa7327cbbcb:event_000f · Kind: event

No extra collection charge is due. I decline the ordinary payment offer as unnecessary. No money moves and no new debt or bribery judgment is created.

- Tamsin → communicated_in → ordinary payment refusal [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000f:actor_0002]
- Collector → communicated_in → ordinary payment refusal [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000f:actor_0001]
- ordinary payment refusal → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000f:subject_0001]
- ordinary payment refusal → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000f]
- Collector → received_observation → ordinary payment refusal [observation; link:observation:observation_0018]
- Tamsin → received_observation → ordinary payment refusal [observation; link:observation:observation_0019]
- ordinary payment refusal → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000f]

```json
{
  "eventClass": "committed_communication",
  "order": 15,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_000f"
    },
    {
      "kind": "message",
      "id": "message_0008"
    }
  ],
  "cause": {
    "commandId": "command_5962c390542b4a8082284fa7327cbbcb",
    "revision": 9
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
      "act": "ordinary_payment_refusal",
      "content": {
        "amountMinor": 0,
        "evidence": [],
        "kind": "response",
        "operation": "ordinary_payment_refusal",
        "purpose": "response",
        "text": "No extra collection charge is due. I decline the ordinary payment offer as unnecessary. No money moves and no new debt or bribery judgment is created."
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

## ask whereabouts
Identity: runtime:package_0003:run_0003:command_533e32dd9624488cbd0b179f5e24df40:event_0010 · Kind: event

Asks where Nera Vale is. This is a request for location information, not a physical search.

- Collector → communicated_in → ask whereabouts [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0010:actor_0001]
- Tamsin → communicated_in → ask whereabouts [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0010:actor_0002]
- ask whereabouts → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0010]
- Tamsin → received_observation → ask whereabouts [observation; link:observation:observation_001a]
- ask whereabouts → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0010]

```json
{
  "eventClass": "committed_communication",
  "order": 16,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0010"
    },
    {
      "kind": "message",
      "id": "message_0009"
    }
  ],
  "cause": {
    "commandId": "command_533e32dd9624488cbd0b179f5e24df40",
    "revision": 10
  },
  "participantRefs": [
    "actor_0001",
    "actor_0002"
  ],
  "observerRefs": [],
  "thingRefs": [],
  "placeRef": "place_0001",
  "details": {
    "communication": {
      "act": "ask_whereabouts",
      "content": {
        "amountMinor": 0,
        "evidence": [],
        "kind": "question",
        "operation": "ask",
        "purpose": "ordinary_collection",
        "text": "Asks where Nera Vale is. This is a request for location information, not a physical search."
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
        "subjectId": "subject_0009"
      },
      "senderId": "actor_0001",
      "subjectIds": [
        "subject_0009"
      ],
      "targetId": "subject_0009",
      "terms": null
    }
  }
}
```

## boundary refusal
Identity: runtime:package_0003:run_0003:command_533e32dd9624488cbd0b179f5e24df40:event_0011 · Kind: event

I decline that unrelated or protected scope. The case-only route remains the relevant collection route while service is open.

- Tamsin → communicated_in → boundary refusal [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0011:actor_0002]
- Collector → communicated_in → boundary refusal [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0011:actor_0001]
- boundary refusal → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0011:subject_0001]
- boundary refusal → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0011]
- Collector → received_observation → boundary refusal [observation; link:observation:observation_001b]
- Tamsin → received_observation → boundary refusal [observation; link:observation:observation_001c]
- boundary refusal → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0011]

```json
{
  "eventClass": "committed_communication",
  "order": 17,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0011"
    },
    {
      "kind": "message",
      "id": "message_000a"
    }
  ],
  "cause": {
    "commandId": "command_533e32dd9624488cbd0b179f5e24df40",
    "revision": 10
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
      "act": "boundary_refusal",
      "content": {
        "amountMinor": 0,
        "evidence": [],
        "kind": "response",
        "operation": "boundary_refusal",
        "purpose": "response",
        "text": "I decline that unrelated or protected scope. The case-only route remains the relevant collection route while service is open."
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

## request access
Identity: runtime:package_0003:run_0003:command_97b5508e80fd4b1da34dfad3c6cf295f:event_0012 · Kind: event

Requests access to Whole customer file concerning Collection record.

- Collector → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0012:actor_0001]
- Tamsin → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0012:actor_0002]
- request access → references_thing → Collection record [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0012:subject_0003]
- request access → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0012]
- Tamsin → received_observation → request access [observation; link:observation:observation_001d]
- request access → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0012]

```json
{
  "eventClass": "committed_communication",
  "order": 18,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0012"
    },
    {
      "kind": "message",
      "id": "message_000b"
    }
  ],
  "cause": {
    "commandId": "command_97b5508e80fd4b1da34dfad3c6cf295f",
    "revision": 11
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
        "text": "Requests access to Whole customer file concerning Collection record."
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
        "kind": "whole",
        "subjectId": "subject_0008"
      },
      "senderId": "actor_0001",
      "subjectIds": [
        "subject_0003",
        "subject_0008"
      ],
      "targetId": "subject_0003",
      "terms": null
    }
  }
}
```

## restriction warning
Identity: runtime:package_0003:run_0003:command_97b5508e80fd4b1da34dfad3c6cf295f:event_0013 · Kind: event

Further relevant-file access is limited to a supervised comparison. That case-only comparison remains available to complete collection. Renewing a demand for protected/full-file information, or asking me to bypass that boundary, will end collection service for this visit. This warning still applies after clarification or repair.

- Tamsin → communicated_in → restriction warning [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0013:actor_0002]
- Collector → communicated_in → restriction warning [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0013:actor_0001]
- restriction warning → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0013:subject_0001]
- restriction warning → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0013]
- Collector → received_observation → restriction warning [observation; link:observation:observation_001e]
- Collector → received_observation → restriction warning [observation; link:observation:observation_0020]
- Tamsin → received_observation → restriction warning [observation; link:observation:observation_001f]
- restriction warning → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0013]

```json
{
  "eventClass": "committed_communication",
  "order": 19,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0013"
    },
    {
      "kind": "message",
      "id": "message_000c"
    }
  ],
  "cause": {
    "commandId": "command_97b5508e80fd4b1da34dfad3c6cf295f",
    "revision": 11
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
      "act": "restriction_warning",
      "content": {
        "amountMinor": 0,
        "evidence": [],
        "kind": "response",
        "operation": "restriction_warning",
        "purpose": "response",
        "text": "Further relevant-file access is limited to a supervised comparison. That case-only comparison remains available to complete collection. Renewing a demand for protected/full-file information, or asking me to bypass that boundary, will end collection service for this visit. This warning still applies after clarification or repair."
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

## request access
Identity: runtime:package_0003:run_0003:command_137b94a912c844f98716ae6b35338508:event_0014 · Kind: event

Requests access to Whole customer file concerning Collection record.

- Collector → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0014:actor_0001]
- Tamsin → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0014:actor_0002]
- request access → references_thing → Collection record [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0014:subject_0003]
- request access → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0014]
- Tamsin → received_observation → request access [observation; link:observation:observation_0021]
- request access → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0014]

```json
{
  "eventClass": "committed_communication",
  "order": 20,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0014"
    },
    {
      "kind": "message",
      "id": "message_000d"
    }
  ],
  "cause": {
    "commandId": "command_137b94a912c844f98716ae6b35338508",
    "revision": 12
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
        "text": "Requests access to Whole customer file concerning Collection record."
      },
      "family": "Request",
      "framing": [
        {
          "kind": "scope_limit",
          "text": "States the selected scope firmly and without adding unrelated demands."
        }
      ],
      "prominence": "measured",
      "recipientIds": [
        "actor_0002"
      ],
      "scope": {
        "kind": "whole",
        "subjectId": "subject_0008"
      },
      "senderId": "actor_0001",
      "subjectIds": [
        "subject_0003",
        "subject_0008"
      ],
      "targetId": "subject_0003",
      "terms": null
    }
  }
}
```

## boundary refusal
Identity: runtime:package_0003:run_0003:command_137b94a912c844f98716ae6b35338508:event_0015 · Kind: event

I decline that unrelated or protected scope. The case-only route remains the relevant collection route while service is open.

- Tamsin → communicated_in → boundary refusal [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0015:actor_0002]
- Collector → communicated_in → boundary refusal [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0015:actor_0001]
- boundary refusal → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0015:subject_0001]
- boundary refusal → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0015]
- Collector → received_observation → boundary refusal [observation; link:observation:observation_0022]
- Tamsin → received_observation → boundary refusal [observation; link:observation:observation_0023]
- boundary refusal → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0015]

```json
{
  "eventClass": "committed_communication",
  "order": 21,
  "epistemic": "communication",
  "sourceRefs": [
    {
      "kind": "event",
      "id": "event_0015"
    },
    {
      "kind": "message",
      "id": "message_000e"
    }
  ],
  "cause": {
    "commandId": "command_137b94a912c844f98716ae6b35338508",
    "revision": 12
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
      "act": "boundary_refusal",
      "content": {
        "amountMinor": 0,
        "evidence": [],
        "kind": "response",
        "operation": "boundary_refusal",
        "purpose": "response",
        "text": "I decline that unrelated or protected scope. The case-only route remains the relevant collection route while service is open."
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

- Collector → performed_in → Show and verify collection ticket [physical_result; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003:actor_0001]
- Collector → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004:actor_0001]
- Collector → communicated_in → explain access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005:actor_0001]
- Collector → performed_in → Inspect handling extract [physical_result; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_356eda7866464262b793d35ce44fd69f%3Aevent_0006:actor_0001]
- Collector → performed_in → Search permitted handling tray [physical_result; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_3d3dfea73a8e4f3eb1b17c4295d08ea2%3Aevent_0007:actor_0001]
- Collector → communicated_in → ask whereabouts [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0008:actor_0001]
- Collector → communicated_in → defer location [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0009:actor_0001]
- Collector → communicated_in → ask whereabouts [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000b:actor_0001]
- Collector → communicated_in → limited account [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000c:actor_0001]
- Collector → communicated_in → propose exchange [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000e:actor_0001]
- Collector → communicated_in → ordinary payment refusal [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000f:actor_0001]
- Collector → communicated_in → ask whereabouts [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0010:actor_0001]
- Collector → communicated_in → boundary refusal [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0011:actor_0001]
- Collector → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0012:actor_0001]
- Collector → communicated_in → restriction warning [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0013:actor_0001]
- Collector → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0014:actor_0001]
- Collector → communicated_in → boundary refusal [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0015:actor_0001]
- Collector → received_observation → Collection record origin [observation; link:observation:observation_0001]
- Collector → received_observation → Show and verify collection ticket [observation; link:observation:observation_0006]
- Collector → received_observation → explain access [observation; link:observation:observation_0009]
- Collector → received_observation → explain access [observation; link:observation:observation_000b]
- Collector → received_observation → Inspect handling extract [observation; link:observation:observation_000c]
- Collector → received_evidence → Collection record [observation; link:evidence:observation_000c:0]
- Collector → received_observation → Search permitted handling tray [observation; link:observation:observation_000e]
- Collector → received_evidence → Numbered drying tag [observation; link:evidence:observation_000e:0]
- Collector → received_evidence → Numbered drying tag [observation; link:evidence:observation_000e:1]
- Collector → received_observation → defer location [observation; link:observation:observation_0011]
- Collector → received_observation → limited account [observation; link:observation:observation_0014]
- Collector → received_observation → limited account [observation; link:observation:observation_0015]
- Collector → received_evidence → Observed wrapped green case — identity not established [report; link:evidence:observation_0015:0]
- Collector → received_observation → ordinary payment refusal [observation; link:observation:observation_0018]
- Collector → received_observation → boundary refusal [observation; link:observation:observation_001b]
- Collector → received_observation → restriction warning [observation; link:observation:observation_001e]
- Collector → received_observation → restriction warning [observation; link:observation:observation_0020]
- Collector → received_observation → boundary refusal [observation; link:observation:observation_0022]
- Collector → was_told_about → Earlier handling movement [report; link:claim:claim_0001:actor_0001:event%3Aevent_0002]
- Tamsin → hypothesizes_about → Collector [hypothesis; link:hypothesis:hypothesis_0001]
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
    },
    {
      "channel": "reading",
      "id": "observation_000c",
      "observerId": "actor_0001",
      "receivedDetails": {
        "conduct": "Performs the permitted inspect action.",
        "evidence": [
          {
            "form": "document",
            "label": "Recipient signature: unfilled",
            "markId": "subject_0010",
            "predicate": "recipient_signature",
            "roots": [
              {
                "id": "result_0002",
                "kind": "action_result"
              }
            ],
            "subjectId": "subject_0003",
            "value": "unfilled"
          }
        ],
        "references": [
          {
            "id": "subject_0003",
            "label": "Collection record"
          }
        ]
      },
      "roots": [
        {
          "id": "result_0002",
          "kind": "action_result"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 6,
      "source": {
        "id": "result_0002",
        "kind": "action_result"
      }
    },
    {
      "channel": "reading",
      "id": "observation_000e",
      "observerId": "actor_0001",
      "receivedDetails": {
        "conduct": "Performs the permitted search action.",
        "evidence": [
          {
            "form": "document",
            "label": "Drying tag 041 matches the case reference",
            "markId": "subject_0010",
            "predicate": "item_reference",
            "roots": [
              {
                "id": "result_0003",
                "kind": "action_result"
              }
            ],
            "subjectId": "subject_000c",
            "value": "subject_0001"
          },
          {
            "form": "document",
            "label": "Drying tag records internal drying, not recipient collection",
            "markId": "subject_0010",
            "predicate": "handling_type",
            "roots": [
              {
                "id": "result_0003",
                "kind": "action_result"
              }
            ],
            "subjectId": "subject_000c",
            "value": "internal_drying"
          }
        ],
        "references": [
          {
            "id": "subject_000c",
            "label": "Numbered drying tag"
          },
          {
            "id": "subject_0001",
            "label": "Nera’s green instrument case"
          }
        ]
      },
      "roots": [
        {
          "id": "result_0003",
          "kind": "action_result"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 7,
      "source": {
        "id": "result_0003",
        "kind": "action_result"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0011",
      "observerId": "actor_0001",
      "receivedDetails": {
        "communication": {
          "act": "defer_location",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "response",
            "operation": "defer_location",
            "purpose": "response",
            "text": "I refer you to the recorded entry and the relevant inspection route rather than explaining the earlier movement."
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
          "id": "message_0004",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 9,
      "source": {
        "id": "message_0004",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0014",
      "observerId": "actor_0001",
      "receivedDetails": {
        "communication": {
          "act": "limited_account",
          "content": {
            "amountMinor": 0,
            "evidence": [
              {
                "form": "report",
                "label": "A wrapped green case moved toward the partition; its exact identity was not established by that sighting",
                "markId": null,
                "predicate": "movement_direction",
                "roots": [
                  {
                    "id": "event_0002",
                    "kind": "event"
                  }
                ],
                "subjectId": "subject_0011",
                "value": "subject_000a"
              }
            ],
            "kind": "response",
            "operation": "limited_account",
            "purpose": "response",
            "text": "A wrapped green case moved toward the partition; its exact identity was not established by that sighting\nIt may have been an exception. I did not see the damp seam, final cupboard, or purpose; that interpretation is not a witnessed fact.\nThis report does not prove a completed collection."
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
          "senderId": "actor_0004",
          "subjectIds": [
            "subject_0001",
            "subject_0011",
            "subject_000a"
          ],
          "targetId": "subject_0001",
          "terms": null
        }
      },
      "roots": [
        {
          "id": "message_0006",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 12,
      "source": {
        "id": "message_0006",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0015",
      "observerId": "actor_0001",
      "receivedDetails": {
        "evidence": [
          {
            "form": "report",
            "label": "A wrapped green case moved toward the partition; its exact identity was not established by that sighting",
            "markId": null,
            "predicate": "movement_direction",
            "roots": [
              {
                "id": "event_0002",
                "kind": "event"
              }
            ],
            "subjectId": "subject_0011",
            "value": "subject_000a"
          }
        ],
        "references": [
          {
            "id": "subject_0011",
            "label": "Observed wrapped green case — identity not established"
          },
          {
            "id": "subject_000a",
            "label": "Partition"
          }
        ]
      },
      "roots": [
        {
          "id": "event_0002",
          "kind": "event"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 12,
      "source": {
        "id": "message_0006",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0018",
      "observerId": "actor_0001",
      "receivedDetails": {
        "communication": {
          "act": "ordinary_payment_refusal",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "response",
            "operation": "ordinary_payment_refusal",
            "purpose": "response",
            "text": "No extra collection charge is due. I decline the ordinary payment offer as unnecessary. No money moves and no new debt or bribery judgment is created."
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
          "id": "message_0008",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 15,
      "source": {
        "id": "message_0008",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_001b",
      "observerId": "actor_0001",
      "receivedDetails": {
        "communication": {
          "act": "boundary_refusal",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "response",
            "operation": "boundary_refusal",
            "purpose": "response",
            "text": "I decline that unrelated or protected scope. The case-only route remains the relevant collection route while service is open."
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
          "id": "message_000a",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 17,
      "source": {
        "id": "message_000a",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_001e",
      "observerId": "actor_0001",
      "receivedDetails": {
        "communication": {
          "act": "restriction_warning",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "response",
            "operation": "restriction_warning",
            "purpose": "response",
            "text": "Further relevant-file access is limited to a supervised comparison. That case-only comparison remains available to complete collection. Renewing a demand for protected/full-file information, or asking me to bypass that boundary, will end collection service for this visit. This warning still applies after clarification or repair."
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
          "id": "message_000c",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 19,
      "source": {
        "id": "message_000c",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0020",
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
          "id": "message_000c",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 19,
      "source": {
        "id": "message_000c",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0022",
      "observerId": "actor_0001",
      "receivedDetails": {
        "communication": {
          "act": "boundary_refusal",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "response",
            "operation": "boundary_refusal",
            "purpose": "response",
            "text": "I decline that unrelated or protected scope. The case-only route remains the relevant collection route while service is open."
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
          "id": "message_000e",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 21,
      "source": {
        "id": "message_000e",
        "kind": "message"
      }
    }
  ],
  "receivedClaims": [
    {
      "evidence": [
        {
          "form": "report",
          "label": "A wrapped green case moved toward the partition; its exact identity was not established by that sighting",
          "markId": null,
          "predicate": "movement_direction",
          "roots": [
            {
              "id": "event_0002",
              "kind": "event"
            }
          ],
          "subjectId": "subject_0011",
          "value": "subject_000a"
        }
      ],
      "id": "claim_0001",
      "messageId": "message_0006",
      "observationIds": [
        "observation_0014"
      ],
      "recipientIds": [
        "actor_0001"
      ],
      "roots": [
        {
          "id": "event_0002",
          "kind": "event"
        }
      ],
      "speakerId": "actor_0004"
    }
  ],
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
      "status": "suspended",
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
      "status": "suspended",
      "targetId": "subject_000b"
    },
    {
      "actionId": "action_0004",
      "granteeId": "actor_0001",
      "grantorId": "actor_0002",
      "id": "permission_0005",
      "source": {
        "id": "message_000c",
        "kind": "message"
      },
      "status": "allowed",
      "targetId": "subject_000e"
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
- Tamsin → communicated_in → ask whereabouts [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0008:actor_0002]
- Tamsin → communicated_in → defer location [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0009:actor_0002]
- Tamsin → communicated_in → propose exchange [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000e:actor_0002]
- Tamsin → communicated_in → ordinary payment refusal [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000f:actor_0002]
- Tamsin → communicated_in → ask whereabouts [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0010:actor_0002]
- Tamsin → communicated_in → boundary refusal [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0011:actor_0002]
- Tamsin → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0012:actor_0002]
- Tamsin → communicated_in → restriction warning [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0013:actor_0002]
- Tamsin → communicated_in → request access [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0014:actor_0002]
- Tamsin → communicated_in → boundary refusal [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0015:actor_0002]
- Tamsin → received_observation → Collection record origin [observation; link:observation:observation_0002]
- Tamsin → received_observation → Earlier handling movement [observation; link:observation:observation_0004]
- Tamsin → received_evidence → Observed wrapped green case — identity not established [observation; link:evidence:observation_0004:0]
- Tamsin → received_evidence → Nera’s green instrument case [observation; link:evidence:observation_0004:1]
- Tamsin → received_evidence → Nera’s green instrument case [observation; link:evidence:observation_0004:2]
- Tamsin → received_evidence → Collection record [observation; link:evidence:observation_0004:3]
- Tamsin → received_observation → Show and verify collection ticket [observation; link:observation:observation_0007]
- Tamsin → received_observation → request access [observation; link:observation:observation_0008]
- Tamsin → received_observation → explain access [observation; link:observation:observation_000a]
- Tamsin → received_observation → Inspect handling extract [observation; link:observation:observation_000d]
- Tamsin → received_observation → ask whereabouts [observation; link:observation:observation_0010]
- Tamsin → received_observation → defer location [observation; link:observation:observation_0012]
- Tamsin → received_observation → propose exchange [observation; link:observation:observation_0017]
- Tamsin → received_observation → ordinary payment refusal [observation; link:observation:observation_0019]
- Tamsin → received_observation → ask whereabouts [observation; link:observation:observation_001a]
- Tamsin → received_observation → boundary refusal [observation; link:observation:observation_001c]
- Tamsin → received_observation → request access [observation; link:observation:observation_001d]
- Tamsin → received_observation → restriction warning [observation; link:observation:observation_001f]
- Tamsin → received_observation → request access [observation; link:observation:observation_0021]
- Tamsin → received_observation → boundary refusal [observation; link:observation:observation_0023]
- Tamsin → believes_about → Observed wrapped green case — identity not established [belief; link:belief:belief_0001]
- Tamsin → believes_about → Nera’s green instrument case [belief; link:belief:belief_0002]
- Tamsin → believes_about → Nera’s green instrument case [belief; link:belief:belief_0003]
- Tamsin → believes_about → Collection record [belief; link:belief:belief_0004]
- Tamsin → hypothesizes_about → Collector [hypothesis; link:hypothesis:hypothesis_0001]
- Tamsin → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0002]

```json
{
  "actorKind": "npc",
  "observations": [
    {
      "channel": "initial",
      "id": "observation_0002",
      "observerId": "actor_0002",
      "receivedDetails": {
        "recognizedMarks": [
          "subject_0010"
        ],
        "serviceRule": {
          "closeActionId": "action_0007",
          "comparisonActionId": "action_0004",
          "correctionActionId": "action_0005",
          "custodianId": "actor_0002",
          "explainReferenceIds": [
            "subject_0004",
            "subject_0005",
            "subject_0006",
            "subject_0008",
            "subject_000b",
            "subject_000e"
          ],
          "fileId": "subject_0004",
          "handoverActionId": "action_0006",
          "handoverPriceMinor": 0,
          "inspectionActionIds": [
            "action_0002",
            "action_0003"
          ],
          "itemId": "subject_0001",
          "moneyId": "subject_000d",
          "ownerId": "actor_0003",
          "ownerTopicId": "subject_0009",
          "protectedScopeIds": [
            "subject_0006",
            "subject_0008"
          ],
          "recordCorrection": "Original “collected” meant removal from the rack for internal drying; recipient handover is recorded separately.",
          "recordId": "subject_0003",
          "relevantScopeId": "subject_0005",
          "requiredEvidence": [
            {
              "forms": [
                "document"
              ],
              "predicate": "recipient_signature",
              "subjectId": "subject_0003"
            },
            {
              "forms": [
                "report"
              ],
              "predicate": "movement_direction",
              "subjectId": "subject_0011"
            },
            {
              "forms": [
                "document"
              ],
              "predicate": "item_reference",
              "subjectId": "subject_000c"
            }
          ],
          "serviceId": "service_0001",
          "ticketId": "subject_0002",
          "verifyActionId": "action_0001",
          "wholeScopeId": "subject_0008",
          "witnessId": "actor_0004"
        }
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
      "channel": "initial",
      "id": "observation_0004",
      "observerId": "actor_0002",
      "receivedDetails": {
        "evidence": [
          {
            "form": "direct",
            "label": "A wrapped green case moved toward the partition; its exact identity was not established by that sighting",
            "markId": null,
            "predicate": "movement_direction",
            "roots": [
              {
                "id": "event_0002",
                "kind": "event"
              }
            ],
            "subjectId": "subject_0011",
            "value": "subject_000a"
          },
          {
            "form": "direct",
            "label": "Case is in dry storage",
            "markId": null,
            "predicate": "storage_location",
            "roots": [
              {
                "id": "event_0002",
                "kind": "event"
              }
            ],
            "subjectId": "subject_0001",
            "value": "subject_000f"
          },
          {
            "form": "direct",
            "label": "Moved after a spill to protect it from damp",
            "markId": null,
            "predicate": "movement_reason",
            "roots": [
              {
                "id": "event_0002",
                "kind": "event"
              }
            ],
            "subjectId": "subject_0001",
            "value": "spill_protection"
          },
          {
            "form": "direct",
            "label": "Original collected entry meant removed from the rack",
            "markId": null,
            "predicate": "original_entry_meaning",
            "roots": [
              {
                "id": "event_0002",
                "kind": "event"
              }
            ],
            "subjectId": "subject_0003",
            "value": "removed_from_rack"
          }
        ]
      },
      "roots": [
        {
          "id": "event_0002",
          "kind": "event"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 2,
      "source": {
        "id": "event_0002",
        "kind": "event"
      }
    },
    {
      "channel": "sight",
      "id": "observation_0007",
      "observerId": "actor_0002",
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
      "id": "observation_0008",
      "observerId": "actor_0002",
      "receivedDetails": {
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
      },
      "roots": [
        {
          "id": "message_0001",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 4,
      "source": {
        "id": "message_0001",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_000a",
      "observerId": "actor_0002",
      "receivedDetails": {
        "ownCommunication": {
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
      "channel": "sight",
      "id": "observation_000d",
      "observerId": "actor_0002",
      "receivedDetails": {
        "conduct": "Sees the collector inspect the permitted extract; the small print is unreadable from here.",
        "evidence": [],
        "references": []
      },
      "roots": [
        {
          "id": "result_0002",
          "kind": "action_result"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 6,
      "source": {
        "id": "result_0002",
        "kind": "action_result"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0010",
      "observerId": "actor_0002",
      "receivedDetails": {
        "communication": {
          "act": "ask_whereabouts",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "question",
            "operation": "ask",
            "purpose": "ordinary_collection",
            "text": "Asks where Nera’s green instrument case is. This is a request for location information, not a physical search."
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
            "subjectId": "subject_0001"
          },
          "senderId": "actor_0001",
          "subjectIds": [
            "subject_0001"
          ],
          "targetId": "subject_0001",
          "terms": null
        }
      },
      "roots": [
        {
          "id": "message_0003",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 8,
      "source": {
        "id": "message_0003",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0012",
      "observerId": "actor_0002",
      "receivedDetails": {
        "ownCommunication": {
          "act": "defer_location",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "response",
            "operation": "defer_location",
            "purpose": "response",
            "text": "I refer you to the recorded entry and the relevant inspection route rather than explaining the earlier movement."
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
          "id": "message_0004",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 9,
      "source": {
        "id": "message_0004",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0017",
      "observerId": "actor_0002",
      "receivedDetails": {
        "communication": {
          "act": "propose_exchange",
          "content": {
            "amountMinor": 100,
            "evidence": [],
            "kind": "proposal",
            "operation": "inspect",
            "purpose": "ordinary_collection",
            "text": "Offers 100 minor money units for ordinary collection; no fee or debt is asserted."
          },
          "family": "Offer",
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
            "subjectId": "subject_0001"
          },
          "senderId": "actor_0001",
          "subjectIds": [
            "subject_0001"
          ],
          "targetId": "subject_0001",
          "terms": null
        }
      },
      "roots": [
        {
          "id": "message_0007",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 14,
      "source": {
        "id": "message_0007",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0019",
      "observerId": "actor_0002",
      "receivedDetails": {
        "ownCommunication": {
          "act": "ordinary_payment_refusal",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "response",
            "operation": "ordinary_payment_refusal",
            "purpose": "response",
            "text": "No extra collection charge is due. I decline the ordinary payment offer as unnecessary. No money moves and no new debt or bribery judgment is created."
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
          "id": "message_0008",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 15,
      "source": {
        "id": "message_0008",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_001a",
      "observerId": "actor_0002",
      "receivedDetails": {
        "communication": {
          "act": "ask_whereabouts",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "question",
            "operation": "ask",
            "purpose": "ordinary_collection",
            "text": "Asks where Nera Vale is. This is a request for location information, not a physical search."
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
            "subjectId": "subject_0009"
          },
          "senderId": "actor_0001",
          "subjectIds": [
            "subject_0009"
          ],
          "targetId": "subject_0009",
          "terms": null
        }
      },
      "roots": [
        {
          "id": "message_0009",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 16,
      "source": {
        "id": "message_0009",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_001c",
      "observerId": "actor_0002",
      "receivedDetails": {
        "ownCommunication": {
          "act": "boundary_refusal",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "response",
            "operation": "boundary_refusal",
            "purpose": "response",
            "text": "I decline that unrelated or protected scope. The case-only route remains the relevant collection route while service is open."
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
          "id": "message_000a",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 17,
      "source": {
        "id": "message_000a",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_001d",
      "observerId": "actor_0002",
      "receivedDetails": {
        "communication": {
          "act": "request_access",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "request",
            "operation": "inspect",
            "purpose": "ordinary_collection",
            "text": "Requests access to Whole customer file concerning Collection record."
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
            "kind": "whole",
            "subjectId": "subject_0008"
          },
          "senderId": "actor_0001",
          "subjectIds": [
            "subject_0003",
            "subject_0008"
          ],
          "targetId": "subject_0003",
          "terms": null
        }
      },
      "roots": [
        {
          "id": "message_000b",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 18,
      "source": {
        "id": "message_000b",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_001f",
      "observerId": "actor_0002",
      "receivedDetails": {
        "ownCommunication": {
          "act": "restriction_warning",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "response",
            "operation": "restriction_warning",
            "purpose": "response",
            "text": "Further relevant-file access is limited to a supervised comparison. That case-only comparison remains available to complete collection. Renewing a demand for protected/full-file information, or asking me to bypass that boundary, will end collection service for this visit. This warning still applies after clarification or repair."
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
          "id": "message_000c",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 19,
      "source": {
        "id": "message_000c",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0021",
      "observerId": "actor_0002",
      "receivedDetails": {
        "communication": {
          "act": "request_access",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "request",
            "operation": "inspect",
            "purpose": "ordinary_collection",
            "text": "Requests access to Whole customer file concerning Collection record."
          },
          "family": "Request",
          "framing": [
            {
              "kind": "scope_limit",
              "text": "States the selected scope firmly and without adding unrelated demands."
            }
          ],
          "prominence": "measured",
          "recipientIds": [
            "actor_0002"
          ],
          "scope": {
            "kind": "whole",
            "subjectId": "subject_0008"
          },
          "senderId": "actor_0001",
          "subjectIds": [
            "subject_0003",
            "subject_0008"
          ],
          "targetId": "subject_0003",
          "terms": null
        }
      },
      "roots": [
        {
          "id": "message_000d",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 20,
      "source": {
        "id": "message_000d",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0023",
      "observerId": "actor_0002",
      "receivedDetails": {
        "ownCommunication": {
          "act": "boundary_refusal",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "response",
            "operation": "boundary_refusal",
            "purpose": "response",
            "text": "I decline that unrelated or protected scope. The case-only route remains the relevant collection route while service is open."
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
          "id": "message_000e",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 21,
      "source": {
        "id": "message_000e",
        "kind": "message"
      }
    }
  ],
  "receivedClaims": [],
  "beliefs": [
    {
      "history": [],
      "holderId": "actor_0002",
      "id": "belief_0001",
      "observationIds": [
        "observation_0004"
      ],
      "predicate": "movement_direction",
      "question": "subject_0011|movement_direction",
      "roots": [
        {
          "id": "event_0002",
          "kind": "event"
        }
      ],
      "stance": "accepted",
      "subjectId": "subject_0011",
      "support": 5,
      "value": "subject_000a"
    },
    {
      "history": [],
      "holderId": "actor_0002",
      "id": "belief_0002",
      "observationIds": [
        "observation_0004"
      ],
      "predicate": "storage_location",
      "question": "subject_0001|storage_location",
      "roots": [
        {
          "id": "event_0002",
          "kind": "event"
        }
      ],
      "stance": "accepted",
      "subjectId": "subject_0001",
      "support": 5,
      "value": "subject_000f"
    },
    {
      "history": [],
      "holderId": "actor_0002",
      "id": "belief_0003",
      "observationIds": [
        "observation_0004"
      ],
      "predicate": "movement_reason",
      "question": "subject_0001|movement_reason",
      "roots": [
        {
          "id": "event_0002",
          "kind": "event"
        }
      ],
      "stance": "accepted",
      "subjectId": "subject_0001",
      "support": 5,
      "value": "spill_protection"
    },
    {
      "history": [],
      "holderId": "actor_0002",
      "id": "belief_0004",
      "observationIds": [
        "observation_0004"
      ],
      "predicate": "original_entry_meaning",
      "question": "subject_0003|original_entry_meaning",
      "roots": [
        {
          "id": "event_0002",
          "kind": "event"
        }
      ],
      "stance": "accepted",
      "subjectId": "subject_0003",
      "support": 5,
      "value": "removed_from_rack"
    }
  ],
  "hypotheses": [
    {
      "appliedCauses": [
        "message_000c"
      ],
      "band": "actionable",
      "correctionObservationIds": [],
      "history": [
        {
          "band": "actionable",
          "causes": [
            "observation_000a",
            "observation_001a",
            "observation_001d"
          ],
          "prior": "actionable",
          "sequence": 18
        },
        {
          "band": "actionable",
          "causes": [
            "observation_000a",
            "observation_001a",
            "observation_001d"
          ],
          "prior": "actionable",
          "sequence": 20
        }
      ],
      "holderId": "actor_0002",
      "id": "hypothesis_0001",
      "scopeId": "subject_0004",
      "supportObservationIds": [
        "observation_000a",
        "observation_001a",
        "observation_001d"
      ],
      "targetId": "actor_0001",
      "type": "protected_scope_interest"
    }
  ],
  "permissions": [
    {
      "actionId": "action_0007",
      "granteeId": "actor_0002",
      "grantorId": "actor_0002",
      "id": "permission_0002",
      "source": {
        "id": "event_0001",
        "kind": "event"
      },
      "status": "allowed",
      "targetId": "subject_0004"
    }
  ],
  "visit": {
    "holderId": "actor_0002",
    "repairUsed": false,
    "restricted": true,
    "restrictedOrRepaired": true,
    "restrictionMessageId": "message_000c",
    "serviceId": "service_0001",
    "warningMessageId": "message_000c"
  }
}
```

## Nera Vale
Identity: actor_0003 · Kind: person

The absent owner. Absence does not grant receipt of the visit’s communications.

- Nera Vale → owns → Nera’s green instrument case [world_truth; link:owner:subject_0001]
- Nera Vale → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0003]

```json
{
  "actorKind": "absent",
  "observations": [],
  "receivedClaims": [],
  "beliefs": [],
  "hypotheses": [],
  "permissions": [],
  "visit": null
}
```

## Orrin
Identity: actor_0004 · Kind: person

A participant in the collection visit. Knowledge and interpretations remain actor-local.

- Orrin → communicated_in → ask whereabouts [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000b:actor_0004]
- Orrin → communicated_in → limited account [communication; link:participant:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000c:actor_0004]
- Orrin → reported_about → Earlier handling movement [report; link:reporter:claim_0001:actor_0001:event%3Aevent_0002]
- Orrin → received_observation → Collection record origin [observation; link:observation:observation_0003]
- Orrin → received_observation → Earlier handling movement [observation; link:observation:observation_0005]
- Orrin → received_evidence → Observed wrapped green case — identity not established [observation; link:evidence:observation_0005:0]
- Orrin → received_observation → Search permitted handling tray [observation; link:observation:observation_000f]
- Orrin → received_observation → ask whereabouts [observation; link:observation:observation_0013]
- Orrin → received_observation → limited account [observation; link:observation:observation_0016]
- Orrin → believes_about → Observed wrapped green case — identity not established [belief; link:belief:belief_0005]
- Orrin → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0004]

```json
{
  "actorKind": "npc",
  "observations": [
    {
      "channel": "initial",
      "id": "observation_0003",
      "observerId": "actor_0004",
      "receivedDetails": {
        "accountInterpretation": "It may have been an exception. I did not see the damp seam, final cupboard, or purpose; that interpretation is not a witnessed fact.",
        "recognizedMarks": [
          "subject_0010"
        ],
        "serviceRule": {
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
        }
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
      "channel": "initial",
      "id": "observation_0005",
      "observerId": "actor_0004",
      "receivedDetails": {
        "evidence": [
          {
            "form": "direct",
            "label": "A wrapped green case moved toward the partition; its exact identity was not established by that sighting",
            "markId": null,
            "predicate": "movement_direction",
            "roots": [
              {
                "id": "event_0002",
                "kind": "event"
              }
            ],
            "subjectId": "subject_0011",
            "value": "subject_000a"
          }
        ]
      },
      "roots": [
        {
          "id": "event_0002",
          "kind": "event"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 2,
      "source": {
        "id": "event_0002",
        "kind": "event"
      }
    },
    {
      "channel": "sight",
      "id": "observation_000f",
      "observerId": "actor_0004",
      "receivedDetails": {
        "conduct": "Sees the collector search the permitted handling tray; does not read the tag.",
        "evidence": [],
        "references": []
      },
      "roots": [
        {
          "id": "result_0003",
          "kind": "action_result"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 7,
      "source": {
        "id": "result_0003",
        "kind": "action_result"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0013",
      "observerId": "actor_0004",
      "receivedDetails": {
        "communication": {
          "act": "ask_whereabouts",
          "content": {
            "amountMinor": 0,
            "evidence": [],
            "kind": "question",
            "operation": "ask",
            "purpose": "ordinary_collection",
            "text": "Asks where Nera’s green instrument case is. This is a request for location information, not a physical search."
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
            "actor_0004"
          ],
          "scope": {
            "kind": "subject",
            "subjectId": "subject_0001"
          },
          "senderId": "actor_0001",
          "subjectIds": [
            "subject_0001"
          ],
          "targetId": "subject_0001",
          "terms": null
        }
      },
      "roots": [
        {
          "id": "message_0005",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 11,
      "source": {
        "id": "message_0005",
        "kind": "message"
      }
    },
    {
      "channel": "hearing",
      "id": "observation_0016",
      "observerId": "actor_0004",
      "receivedDetails": {
        "ownCommunication": {
          "act": "limited_account",
          "content": {
            "amountMinor": 0,
            "evidence": [
              {
                "form": "report",
                "label": "A wrapped green case moved toward the partition; its exact identity was not established by that sighting",
                "markId": null,
                "predicate": "movement_direction",
                "roots": [
                  {
                    "id": "event_0002",
                    "kind": "event"
                  }
                ],
                "subjectId": "subject_0011",
                "value": "subject_000a"
              }
            ],
            "kind": "response",
            "operation": "limited_account",
            "purpose": "response",
            "text": "A wrapped green case moved toward the partition; its exact identity was not established by that sighting\nIt may have been an exception. I did not see the damp seam, final cupboard, or purpose; that interpretation is not a witnessed fact.\nThis report does not prove a completed collection."
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
          "senderId": "actor_0004",
          "subjectIds": [
            "subject_0001",
            "subject_0011",
            "subject_000a"
          ],
          "targetId": "subject_0001",
          "terms": null
        }
      },
      "roots": [
        {
          "id": "message_0006",
          "kind": "message"
        }
      ],
      "schema": "encounter-observation@2",
      "sequence": 12,
      "source": {
        "id": "message_0006",
        "kind": "message"
      }
    }
  ],
  "receivedClaims": [],
  "beliefs": [
    {
      "history": [],
      "holderId": "actor_0004",
      "id": "belief_0005",
      "observationIds": [
        "observation_0005"
      ],
      "predicate": "movement_direction",
      "question": "subject_0011|movement_direction",
      "roots": [
        {
          "id": "event_0002",
          "kind": "event"
        }
      ],
      "stance": "accepted",
      "subjectId": "subject_0011",
      "support": 5,
      "value": "subject_000a"
    }
  ],
  "hypotheses": [],
  "permissions": [],
  "visit": null
}
```

## Transport Office
Identity: place_0001 · Kind: place

The small transport office in which the collection visit takes place (Master §1.4).

- Show and verify collection ticket → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003]
- request access → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004]
- explain access → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005]
- Inspect handling extract → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_356eda7866464262b793d35ce44fd69f%3Aevent_0006]
- Search permitted handling tray → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_3d3dfea73a8e4f3eb1b17c4295d08ea2%3Aevent_0007]
- ask whereabouts → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0008]
- defer location → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0009]
- ask whereabouts → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000b]
- limited account → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000c]
- propose exchange → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000e]
- ordinary payment refusal → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000f]
- ask whereabouts → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0010]
- boundary refusal → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0011]
- request access → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0012]
- restriction warning → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0013]
- request access → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0014]
- boundary refusal → happened_at → Transport Office [authored_context; link:place:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0015]
- Transport Office → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:place_0001]

## Office storage
Identity: subject_0007 · Kind: place

A semantic place or storage reference. This card contains no geometry or navigation data.

- Office storage → holds → Nera’s green instrument case [world_truth; link:holder:subject_0001]
- Nera’s green instrument case → located_at → Office storage [world_truth; link:location:subject_0001]
- Office storage → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0007]

## Partition
Identity: subject_000a · Kind: place

A semantic place or storage reference. This card contains no geometry or navigation data.

- Partition → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000a]

## Dry storage
Identity: subject_000f · Kind: place

A semantic place or storage reference. This card contains no geometry or navigation data.

- Dry storage → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000f]

## Last Collection · The Protective Shortcut
Identity: scenario_0001 · Kind: scenario

Recover the owner’s instrument case; money, privacy and record correction remain separate outcomes.

- Collector → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0001]
- Tamsin → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0002]
- Nera Vale → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0003]
- Orrin → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:actor_0004]
- Office storage → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0007]
- Partition → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000a]
- Dry storage → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000f]
- Nera’s green instrument case → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0001]
- Collection ticket → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0002]
- Collection record → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0003]
- Customer file → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0004]
- Handling tray → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000b]
- Numbered drying tag → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000c]
- Coins → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000d]
- Observed wrapped green case — identity not established → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0011]
- Transport Office → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:place_0001]
- Collection record origin → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:event_0001]
- Earlier handling movement → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:event_0002]
- Show and verify collection ticket → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003]
- request access → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004]
- explain access → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005]
- Inspect handling extract → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_356eda7866464262b793d35ce44fd69f%3Aevent_0006]
- Search permitted handling tray → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_3d3dfea73a8e4f3eb1b17c4295d08ea2%3Aevent_0007]
- ask whereabouts → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0008]
- defer location → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0009]
- ask whereabouts → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000b]
- limited account → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000c]
- propose exchange → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000e]
- ordinary payment refusal → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000f]
- ask whereabouts → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0010]
- boundary refusal → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0011]
- request access → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0012]
- restriction warning → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0013]
- request access → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0014]
- boundary refusal → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0015]

```json
{
  "status": {
    "recovered": false,
    "serviceOpen": true,
    "comparisonComplete": false,
    "recordCorrected": false
  },
  "pendingOffer": null
}
```

## Nera’s green instrument case
Identity: subject_0001 · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Collection record origin → references_thing → Nera’s green instrument case [world_truth; link:thing:event_0001:subject_0001]
- Earlier handling movement → references_thing → Nera’s green instrument case [world_truth; link:thing:event_0002:subject_0001]
- Show and verify collection ticket → references_thing → Nera’s green instrument case [physical_result; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003:subject_0001]
- explain access → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0005:subject_0001]
- Search permitted handling tray → references_thing → Nera’s green instrument case [physical_result; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_3d3dfea73a8e4f3eb1b17c4295d08ea2%3Aevent_0007:subject_0001]
- ask whereabouts → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0008:subject_0001]
- defer location → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_9f0c9871d02444bfbf24823c17901695%3Aevent_0009:subject_0001]
- ask whereabouts → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000b:subject_0001]
- limited account → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000c:subject_0001]
- propose exchange → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000e:subject_0001]
- ordinary payment refusal → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_5962c390542b4a8082284fa7327cbbcb%3Aevent_000f:subject_0001]
- boundary refusal → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_533e32dd9624488cbd0b179f5e24df40%3Aevent_0011:subject_0001]
- restriction warning → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0013:subject_0001]
- boundary refusal → references_thing → Nera’s green instrument case [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0015:subject_0001]
- Tamsin → received_evidence → Nera’s green instrument case [observation; link:evidence:observation_0004:1]
- Tamsin → received_evidence → Nera’s green instrument case [observation; link:evidence:observation_0004:2]
- Tamsin → believes_about → Nera’s green instrument case [belief; link:belief:belief_0002]
- Tamsin → believes_about → Nera’s green instrument case [belief; link:belief:belief_0003]
- Nera Vale → owns → Nera’s green instrument case [world_truth; link:owner:subject_0001]
- Office storage → holds → Nera’s green instrument case [world_truth; link:holder:subject_0001]
- Nera’s green instrument case → located_at → Office storage [world_truth; link:location:subject_0001]
- Nera’s green instrument case → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0001]

## Collection ticket
Identity: subject_0002 · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Show and verify collection ticket → references_thing → Collection ticket [physical_result; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_e6f5120159d94707a2d79816705f6807%3Aevent_0003:subject_0002]
- Collection ticket → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0002]

## Collection record
Identity: subject_0003 · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Collection record origin → references_thing → Collection record [world_truth; link:thing:event_0001:subject_0003]
- Earlier handling movement → references_thing → Collection record [world_truth; link:thing:event_0002:subject_0003]
- request access → references_thing → Collection record [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_a24ff940f1c64af888c1de0dc80f1821%3Aevent_0004:subject_0003]
- Inspect handling extract → references_thing → Collection record [physical_result; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_356eda7866464262b793d35ce44fd69f%3Aevent_0006:subject_0003]
- request access → references_thing → Collection record [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_97b5508e80fd4b1da34dfad3c6cf295f%3Aevent_0012:subject_0003]
- request access → references_thing → Collection record [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_137b94a912c844f98716ae6b35338508%3Aevent_0014:subject_0003]
- Collector → received_evidence → Collection record [observation; link:evidence:observation_000c:0]
- Tamsin → received_evidence → Collection record [observation; link:evidence:observation_0004:3]
- Tamsin → believes_about → Collection record [belief; link:belief:belief_0004]
- Collection record → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0003]

## Customer file
Identity: subject_0004 · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Customer file → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0004]

## Handling tray
Identity: subject_000b · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Search permitted handling tray → references_thing → Handling tray [physical_result; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_3d3dfea73a8e4f3eb1b17c4295d08ea2%3Aevent_0007:subject_000b]
- Handling tray → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000b]

## Numbered drying tag
Identity: subject_000c · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Collection record origin → references_thing → Numbered drying tag [world_truth; link:thing:event_0001:subject_000c]
- Search permitted handling tray → references_thing → Numbered drying tag [physical_result; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_3d3dfea73a8e4f3eb1b17c4295d08ea2%3Aevent_0007:subject_000c]
- Collector → received_evidence → Numbered drying tag [observation; link:evidence:observation_000e:0]
- Collector → received_evidence → Numbered drying tag [observation; link:evidence:observation_000e:1]
- Numbered drying tag → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000c]

## Coins
Identity: subject_000d · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Coins → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000d]

## Observed wrapped green case — identity not established
Identity: subject_0011 · Kind: thing

An unidentified wrapped-case reference in a limited observation/report; it is not identified as the collection item.

- Collection record origin → references_thing → Observed wrapped green case — identity not established [world_truth; link:thing:event_0001:subject_0011]
- Earlier handling movement → references_thing → Observed wrapped green case — identity not established [world_truth; link:thing:event_0002:subject_0011]
- limited account → references_thing → Observed wrapped green case — identity not established [communication; link:thing:runtime%3Apackage_0003%3Arun_0003%3Acommand_39ee8465dde54afaa2b1a537f3908af6%3Aevent_000c:subject_0011]
- Collector → received_evidence → Observed wrapped green case — identity not established [report; link:evidence:observation_0015:0]
- Tamsin → received_evidence → Observed wrapped green case — identity not established [observation; link:evidence:observation_0004:0]
- Tamsin → believes_about → Observed wrapped green case — identity not established [belief; link:belief:belief_0001]
- Orrin → received_evidence → Observed wrapped green case — identity not established [observation; link:evidence:observation_0005:0]
- Orrin → believes_about → Observed wrapped green case — identity not established [belief; link:belief:belief_0005]
- Observed wrapped green case — identity not established → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0011]

## Recent meaningful changes

- Revision 1: An actual physical result was committed. [change:command_e6f5120159d94707a2d79816705f6807:physical_result:result_0001]
- Revision 2: A bounded action permission changed; the action itself is separate. [change:command_a24ff940f1c64af888c1de0dc80f1821:permission_changed:permission_0003]
- Revision 2: A bounded action permission changed; the action itself is separate. [change:command_a24ff940f1c64af888c1de0dc80f1821:permission_changed:permission_0004]
- Revision 3: Collector received a document fragment: Recipient signature: unfilled [change:command_356eda7866464262b793d35ce44fd69f:received_evidence:observation_000c%3A0]
- Revision 3: An actual physical result was committed. [change:command_356eda7866464262b793d35ce44fd69f:physical_result:result_0002]
- Revision 4: Collector received a document fragment: Drying tag 041 matches the case reference [change:command_3d3dfea73a8e4f3eb1b17c4295d08ea2:received_evidence:observation_000e%3A0]
- Revision 4: Collector received a document fragment: Drying tag records internal drying, not recipient collection [change:command_3d3dfea73a8e4f3eb1b17c4295d08ea2:received_evidence:observation_000e%3A1]
- Revision 4: An actual physical result was committed. [change:command_3d3dfea73a8e4f3eb1b17c4295d08ea2:physical_result:result_0003]
- Revision 7: Collector received a report fragment: A wrapped green case moved toward the partition; its exact identity was not established by that sighting [change:command_39ee8465dde54afaa2b1a537f3908af6:received_evidence:observation_0015%3A0]
- Revision 11: A bounded action permission changed; the action itself is separate. [change:command_97b5508e80fd4b1da34dfad3c6cf295f:permission_changed:permission_0003]
- Revision 11: A bounded action permission changed; the action itself is separate. [change:command_97b5508e80fd4b1da34dfad3c6cf295f:permission_changed:permission_0004]
- Revision 11: A bounded action permission changed; the action itself is separate. [change:command_97b5508e80fd4b1da34dfad3c6cf295f:permission_changed:permission_0005]
- Revision 11: A visit-long warning was delivered. [change:command_97b5508e80fd4b1da34dfad3c6cf295f:warning_delivered:message_000c]
