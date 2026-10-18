// Generated from authored M3 JSON by scripts/build-m3.mjs.
export const fixture = {
  "content": {
    "actions": [
      {
        "disclosures": [],
        "id": "action_0001",
        "kind": "verify_authority",
        "label": "Show and verify collection ticket",
        "requiresAuthority": false,
        "requiresComparison": false,
        "targetId": "subject_0002"
      },
      {
        "disclosures": [
          {
            "actorId": "actor_0001",
            "conduct": null,
            "factIds": [
              "fact_0001"
            ],
            "form": "document",
            "markId": "subject_0010"
          },
          {
            "actorId": "actor_0002",
            "conduct": "Sees the collector inspect the permitted extract; the small print is unreadable from here.",
            "factIds": [],
            "form": "direct",
            "markId": null
          }
        ],
        "id": "action_0002",
        "kind": "inspect",
        "label": "Inspect handling extract",
        "requiresAuthority": true,
        "requiresComparison": false,
        "targetId": "subject_0003"
      },
      {
        "disclosures": [
          {
            "actorId": "actor_0001",
            "conduct": null,
            "factIds": [
              "fact_0005",
              "fact_0006"
            ],
            "form": "document",
            "markId": "subject_0010"
          },
          {
            "actorId": "actor_0004",
            "conduct": "Sees the collector search the permitted handling tray; does not read the tag.",
            "factIds": [],
            "form": "direct",
            "markId": null
          }
        ],
        "id": "action_0003",
        "kind": "search",
        "label": "Search permitted handling tray",
        "requiresAuthority": true,
        "requiresComparison": false,
        "targetId": "subject_000b"
      },
      {
        "disclosures": [
          {
            "actorId": "actor_0001",
            "conduct": null,
            "factIds": [
              "fact_0001",
              "fact_0005",
              "fact_0006",
              "fact_0003",
              "fact_0007",
              "fact_0008"
            ],
            "form": "document",
            "markId": "subject_0010"
          },
          {
            "actorId": "actor_0002",
            "conduct": "Reads the selected case-handling evidence in the supervised comparison.",
            "factIds": [
              "fact_0001",
              "fact_0005",
              "fact_0006"
            ],
            "form": "document",
            "markId": "subject_0010"
          }
        ],
        "id": "action_0004",
        "kind": "compare",
        "label": "Perform supervised case-only comparison",
        "requiresAuthority": true,
        "requiresComparison": false,
        "targetId": "subject_000e"
      },
      {
        "disclosures": [],
        "id": "action_0005",
        "kind": "correct_record",
        "label": "Record correction to the original entry",
        "requiresAuthority": true,
        "requiresComparison": true,
        "targetId": "subject_0003"
      },
      {
        "disclosures": [],
        "id": "action_0006",
        "kind": "handover",
        "label": "Complete confirmed case handover",
        "requiresAuthority": true,
        "requiresComparison": true,
        "targetId": "subject_0001"
      },
      {
        "disclosures": [],
        "id": "action_0007",
        "kind": "close_service",
        "label": "Close collection service for this visit",
        "requiresAuthority": false,
        "requiresComparison": false,
        "targetId": "subject_0004"
      }
    ],
    "actors": [
      {
        "id": "actor_0001",
        "kind": "human",
        "label": "Collector",
        "profile": null
      },
      {
        "id": "actor_0002",
        "kind": "npc",
        "label": "Tamsin",
        "profile": {
          "acceptanceThreshold": 3,
          "priorities": {
            "privacy": 10,
            "service": 10,
            "verification": 9
          },
          "roles": [
            "record_custodian"
          ]
        }
      },
      {
        "id": "actor_0003",
        "kind": "absent",
        "label": "Nera Vale",
        "profile": null
      },
      {
        "id": "actor_0004",
        "kind": "npc",
        "label": "Orrin",
        "profile": {
          "acceptanceThreshold": 3,
          "priorities": {
            "privacy": 10,
            "service": 10,
            "verification": 9
          },
          "roles": [
            "handling_witness"
          ]
        }
      }
    ],
    "communication": {
      "expressions": [
        {
          "cues": [
            {
              "kind": "scope_limit",
              "text": "States the selected scope firmly and without adding unrelated demands."
            }
          ],
          "templateId": "template_0011",
          "vibe": "EA"
        },
        {
          "cues": [
            {
              "kind": "displayed_concern",
              "text": "Acknowledges the clerk’s work and communicates supportive concern about a defensible handover."
            }
          ],
          "templateId": "template_0012",
          "vibe": "SE"
        },
        {
          "cues": [
            {
              "kind": "direct_demand",
              "text": "Makes a direct demand for attention to the selected matter."
            },
            {
              "kind": "possible_consequence",
              "text": "Raises the possibility of a procedural complaint; no complaint is filed or promised."
            }
          ],
          "templateId": "template_0013",
          "vibe": "AB"
        }
      ]
    },
    "contentRevision": "M3-protective-shortcut-v1",
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
    ],
    "humanId": "actor_0001",
    "id": "package_0003",
    "initial": {
      "balances": {
        "actor_0001": 1200,
        "actor_0002": 0,
        "actor_0004": 0
      },
      "entry": "collected",
      "historicalMovement": {
        "actorReceipts": [
          {
            "actorId": "actor_0002",
            "conduct": null,
            "factIds": [
              "fact_0002",
              "fact_0003",
              "fact_0004",
              "fact_0007"
            ],
            "form": "direct",
            "markId": null
          },
          {
            "actorId": "actor_0004",
            "conduct": null,
            "factIds": [
              "fact_0002"
            ],
            "form": "direct",
            "markId": null
          }
        ],
        "allFactIds": [
          "fact_0002",
          "fact_0003",
          "fact_0004",
          "fact_0007"
        ]
      },
      "holderId": "subject_0007",
      "initialReferenceIds": [
        "subject_0001",
        "subject_0002",
        "subject_0003",
        "subject_0009",
        "subject_000d"
      ],
      "itemId": "subject_0001",
      "minorUnitsPerCoin": 100,
      "ownerId": "actor_0003",
      "quantity": 1,
      "rule": {
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
      },
      "softAllowance": 24,
      "witnessAccount": {
        "actorId": "actor_0004",
        "factIds": [
          "fact_0002"
        ],
        "interpretation": "It may have been an exception. I did not see the damp seam, final cupboard, or purpose; that interpretation is not a witnessed fact."
      }
    },
    "initialPartnerId": "actor_0002",
    "presentation": {
      "art": null,
      "delivery": null,
      "intake": null
    },
    "protectedFactIds": [
      "fact_0009"
    ],
    "revision": 1,
    "schema": "encounter-package@3",
    "subjects": [
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
        "id": "subject_0007",
        "label": "Office storage"
      },
      {
        "id": "subject_0008",
        "label": "Whole customer file"
      },
      {
        "id": "subject_0009",
        "label": "Nera Vale"
      },
      {
        "id": "subject_000a",
        "label": "Partition"
      },
      {
        "id": "subject_000b",
        "label": "Handling tray"
      },
      {
        "id": "subject_000c",
        "label": "Numbered drying tag"
      },
      {
        "id": "subject_000d",
        "label": "Coins"
      },
      {
        "id": "subject_000e",
        "label": "Supervised comparison"
      },
      {
        "id": "subject_000f",
        "label": "Dry storage"
      },
      {
        "id": "subject_0010",
        "label": "Office record mark"
      },
      {
        "id": "subject_0011",
        "label": "Observed wrapped green case — identity not established"
      }
    ],
    "title": "Last Collection · The Protective Shortcut"
  },
  "ref": {
    "id": "package_0003",
    "revision": 1,
    "digest": "2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f"
  }
};
