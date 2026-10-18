# Atlas-readiness proof
Audience: author · Run: run_0003 · Revision: 0

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

## Collector
Identity: actor_0001 · Kind: person

The collecting participant. Information here records receipt and factual state, not private psychology.

- Collector → received_observation → Collection record origin [observation; link:observation:observation_0001]
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

- Tamsin → received_observation → Collection record origin [observation; link:observation:observation_0002]
- Tamsin → received_observation → Earlier handling movement [observation; link:observation:observation_0004]
- Tamsin → received_evidence → Observed wrapped green case — identity not established [observation; link:evidence:observation_0004:0]
- Tamsin → received_evidence → Nera’s green instrument case [observation; link:evidence:observation_0004:1]
- Tamsin → received_evidence → Nera’s green instrument case [observation; link:evidence:observation_0004:2]
- Tamsin → received_evidence → Collection record [observation; link:evidence:observation_0004:3]
- Tamsin → believes_about → Observed wrapped green case — identity not established [belief; link:belief:belief_0001]
- Tamsin → believes_about → Nera’s green instrument case [belief; link:belief:belief_0002]
- Tamsin → believes_about → Nera’s green instrument case [belief; link:belief:belief_0003]
- Tamsin → believes_about → Collection record [belief; link:belief:belief_0004]
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
  "hypotheses": [],
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
    "restricted": false,
    "restrictedOrRepaired": false,
    "restrictionMessageId": null,
    "serviceId": "service_0001",
    "warningMessageId": null
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

- Orrin → received_observation → Collection record origin [observation; link:observation:observation_0003]
- Orrin → received_observation → Earlier handling movement [observation; link:observation:observation_0005]
- Orrin → received_evidence → Observed wrapped green case — identity not established [observation; link:evidence:observation_0005:0]
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

- Collection ticket → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0002]

## Collection record
Identity: subject_0003 · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Collection record origin → references_thing → Collection record [world_truth; link:thing:event_0001:subject_0003]
- Earlier handling movement → references_thing → Collection record [world_truth; link:thing:event_0002:subject_0003]
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

- Handling tray → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_000b]

## Numbered drying tag
Identity: subject_000c · Kind: thing

An existing object or resource reference. Ownership, custody and evidence come from Encounter records.

- Collection record origin → references_thing → Numbered drying tag [world_truth; link:thing:event_0001:subject_000c]
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
- Tamsin → received_evidence → Observed wrapped green case — identity not established [observation; link:evidence:observation_0004:0]
- Tamsin → believes_about → Observed wrapped green case — identity not established [belief; link:belief:belief_0001]
- Orrin → received_evidence → Observed wrapped green case — identity not established [observation; link:evidence:observation_0005:0]
- Orrin → believes_about → Observed wrapped green case — identity not established [belief; link:belief:belief_0005]
- Observed wrapped green case — identity not established → relevant_to → Last Collection · The Protective Shortcut [authored_context; link:scenario:scenario_0001:subject_0011]

## Recent meaningful changes

