# M3-D03 browser interaction transcript

origin: "Actual M3-D03 remediation browser UI export"
name: "browser-post-recovery.json"
runSHA256: "b65c7c2fab309fb0e678f9434f3bc0a5ee5cff7949fe4e781580191f25989d30"
sourceRevision: "M3-runtime-v1-R3-D03"
sourceDigest: "a609f63c56ed1e047f44e8f3ef28b21f91adec9e40e35d08eb988d0e78de9362"
buildSHA256: "8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb"
packageRef: {"id":"package_0003","revision":1,"digest":"2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f"}
revision: 16
historicalDefectReproduction: false
rawInspectorCompared: false

Complete UI save validated by deterministic journal replay. Before-fix runs are preserved R2 controls.

## Commit 1: perform_action / physical

Physical result:
```json
{
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
    "commandId": "command_a95fa650ffd149b09c086a2f1b34eb6e",
    "expectedRevision": 0,
    "permissionId": "permission_0001",
    "targetId": "subject_0002"
  }
}
```

Committed changes:
```json
[
  {
    "id": "result_0001",
    "outcome": "performed",
    "type": "physical_result"
  }
]
```

## Commit 2: send_message / request_access

Bound preview:
```text
Requests access to Collection record concerning Collection record.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```
Notice receipt: null

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
The customer file contains case-handling material and unrelated private contact information. The relevant extract and permitted handling tray are available. Private contact values remain covered.
Social framing is measured.
```

Committed changes:
```json
[]
```

## Commit 3: perform_action / physical

Physical result:
```json
{
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
    "commandId": "command_7c223f2a27814caf90adb6c76f2e3f2d",
    "expectedRevision": 2,
    "permissionId": "permission_0003",
    "targetId": "subject_0003"
  }
}
```

Committed changes:
```json
[
  {
    "id": "result_0002",
    "outcome": "performed",
    "type": "physical_result"
  }
]
```

## Commit 4: perform_action / physical

Physical result:
```json
{
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
    "commandId": "command_2eb12f0712ba42e5a42de51a92199099",
    "expectedRevision": 3,
    "permissionId": "permission_0004",
    "targetId": "subject_000b"
  }
}
```

Committed changes:
```json
[
  {
    "id": "result_0003",
    "outcome": "performed",
    "type": "physical_result"
  }
]
```

## Commit 5: send_message / ask_whereabouts

Bound preview:
```text
Asks where Nera’s green instrument case is. This is a request for location information, not a physical search.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```
Notice receipt: null

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
I refer you to the recorded entry and the relevant inspection route rather than explaining the earlier movement.
Social framing is measured.
```

Committed changes:
```json
[]
```

## Commit 6: perform_action / switch_partner

Committed changes:
```json
[
  {
    "partnerId": "actor_0004",
    "type": "switch_partner"
  }
]
```

## Commit 7: send_message / ask_whereabouts

Bound preview:
```text
Asks where Nera’s green instrument case is. This is a request for location information, not a physical search.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```
Notice receipt: null

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
A wrapped green case moved toward the partition; its exact identity was not established by that sighting
It may have been an exception. I did not see the damp seam, final cupboard, or purpose; that interpretation is not a witnessed fact.
This report does not prove a completed collection.
Social framing is measured.
```

Committed changes:
```json
[]
```

## Commit 8: perform_action / switch_partner

Committed changes:
```json
[
  {
    "partnerId": "actor_0002",
    "type": "switch_partner"
  }
]
```

## Commit 9: send_message / propose_exchange

Bound preview:
```text
Offers 100 minor money units for ordinary collection; no fee or debt is asserted.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```
Notice receipt: null

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
No extra collection charge is due. I decline the ordinary payment offer as unnecessary. No money moves and no new debt or bribery judgment is created.
Social framing is measured.
```

Committed changes:
```json
[]
```

## Commit 10: send_message / ask_whereabouts

Bound preview:
```text
Asks where Nera Vale is. This is a request for location information, not a physical search.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```
Notice receipt: null

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
I decline that unrelated or protected scope. The case-only route remains the relevant collection route while service is open.
Social framing is measured.
```

Committed changes:
```json
[]
```

## Commit 11: send_message / request_access

Bound preview:
```text
Requests access to Whole customer file concerning Collection record.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```
Notice receipt: null

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
Further relevant-file access is limited to a supervised comparison. That case-only comparison remains available to complete collection. Renewing a demand for protected/full-file information, or asking me to bypass that boundary, will end collection service for this visit. This warning still applies after clarification or repair.
Social framing is measured.
```

Committed changes:
```json
[
  {
    "messageId": "message_000c",
    "type": "restriction"
  },
  {
    "messageId": "message_000c",
    "type": "warning_delivered"
  }
]
```

## Commit 12: send_message / why

Bound preview:
```text
Asks Why about the recorded restriction and warning. This is clarification, not a renewed demand.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```
Notice receipt: null

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
The concern comes from the earlier location inquiry followed by the broader protected-scope request after the file split and case-only alternative were explained. This is a fallible concern, not proof of your intent. The supervised case-only route remains available; clarification does not use the repair episode.
Social framing is measured.
```

Committed changes:
```json
[]
```

## Commit 13: send_message / request_access

Bound preview:
```text
Accepts the offered supervised comparison, limited to Case-handling scope.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```
Notice receipt: null

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
Your substantive case-only narrowing or acceptance addresses the concern. The appropriate relevant route is restored. The private contact value remains unavailable, and the visit-long warning remains in force.
Social framing is measured.
```

Committed changes:
```json
[
  {
    "type": "repair_resolved",
    "warningPersists": "message_000c"
  }
]
```

## Commit 14: perform_action / physical

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
The actual supervised comparison supports the authorized release. Review the exact current handover terms and confirm deliberately. Permission or saying Yes does not hand over the item.
Social framing is measured.
```

Physical result:
```json
{
  "effects": [
    {
      "payload": {
        "serviceId": "service_0001"
      },
      "type": "complete_comparison"
    }
  ],
  "id": "result_0004",
  "observerDetails": [
    {
      "details": {
        "comparison": {
          "complete": true,
          "itemId": "subject_0001",
          "serviceId": "service_0001"
        },
        "conduct": "Performs the permitted compare action.",
        "evidence": [
          {
            "form": "document",
            "label": "Recipient signature: unfilled",
            "markId": "subject_0010",
            "predicate": "recipient_signature",
            "roots": [
              {
                "id": "result_0004",
                "kind": "action_result"
              }
            ],
            "subjectId": "subject_0003",
            "value": "unfilled"
          },
          {
            "form": "document",
            "label": "Drying tag 041 matches the case reference",
            "markId": "subject_0010",
            "predicate": "item_reference",
            "roots": [
              {
                "id": "result_0004",
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
                "id": "result_0004",
                "kind": "action_result"
              }
            ],
            "subjectId": "subject_000c",
            "value": "internal_drying"
          },
          {
            "form": "document",
            "label": "Case is in dry storage",
            "markId": "subject_0010",
            "predicate": "storage_location",
            "roots": [
              {
                "id": "result_0004",
                "kind": "action_result"
              }
            ],
            "subjectId": "subject_0001",
            "value": "subject_000f"
          },
          {
            "form": "document",
            "label": "Original collected entry meant removed from the rack",
            "markId": "subject_0010",
            "predicate": "original_entry_meaning",
            "roots": [
              {
                "id": "result_0004",
                "kind": "action_result"
              }
            ],
            "subjectId": "subject_0003",
            "value": "removed_from_rack"
          },
          {
            "form": "document",
            "label": "Separate hauling obligation: already paid",
            "markId": "subject_0010",
            "predicate": "hauling_obligation_status",
            "roots": [
              {
                "id": "result_0004",
                "kind": "action_result"
              }
            ],
            "subjectId": "subject_0001",
            "value": "already_paid"
          }
        ],
        "references": [
          {
            "id": "subject_0003",
            "label": "Collection record"
          },
          {
            "id": "subject_000c",
            "label": "Numbered drying tag"
          },
          {
            "id": "subject_0001",
            "label": "Nera’s green instrument case"
          },
          {
            "id": "subject_000f",
            "label": "Dry storage"
          }
        ]
      },
      "observerId": "actor_0001"
    },
    {
      "details": {
        "comparison": {
          "complete": true,
          "itemId": "subject_0001",
          "serviceId": "service_0001"
        },
        "conduct": "Reads the selected case-handling evidence in the supervised comparison.",
        "evidence": [
          {
            "form": "document",
            "label": "Recipient signature: unfilled",
            "markId": "subject_0010",
            "predicate": "recipient_signature",
            "roots": [
              {
                "id": "result_0004",
                "kind": "action_result"
              }
            ],
            "subjectId": "subject_0003",
            "value": "unfilled"
          },
          {
            "form": "document",
            "label": "Drying tag 041 matches the case reference",
            "markId": "subject_0010",
            "predicate": "item_reference",
            "roots": [
              {
                "id": "result_0004",
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
                "id": "result_0004",
                "kind": "action_result"
              }
            ],
            "subjectId": "subject_000c",
            "value": "internal_drying"
          },
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
          },
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
          },
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
            "id": "subject_0003",
            "label": "Collection record"
          },
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
      "observerId": "actor_0002"
    }
  ],
  "outcome": "performed",
  "request": {
    "actionType": "action_0004",
    "actorId": "actor_0001",
    "commandId": "command_c1df87f50485479d8379f6b3c7e8d9be",
    "expectedRevision": 13,
    "permissionId": "permission_0005",
    "targetId": "subject_000e"
  }
}
```

Committed changes:
```json
[
  {
    "id": "result_0004",
    "outcome": "performed",
    "type": "physical_result"
  },
  {
    "offerId": "offer_0001",
    "revision": 1,
    "type": "offer_prepared"
  }
]
```

## Commit 15: perform_action / confirm_offer

Physical result:
```json
{
  "effects": [
    {
      "payload": {
        "fromId": "subject_0007",
        "itemId": "subject_0001",
        "ownerId": "actor_0003",
        "toId": "actor_0001"
      },
      "type": "custody_transfer"
    },
    {
      "payload": {
        "itemId": "subject_0001"
      },
      "type": "complete_recovery"
    }
  ],
  "id": "result_0005",
  "observerDetails": [
    {
      "details": {
        "conduct": "The exact confirmed handover occurs. The collector receives custody; ownership is unchanged.",
        "handover": {
          "complete": true,
          "holderId": "actor_0001",
          "itemId": "subject_0001",
          "offerId": "offer_0001",
          "offerRevision": 1,
          "ownerId": "actor_0003",
          "paidMinor": 0
        }
      },
      "observerId": "actor_0001"
    },
    {
      "details": {
        "conduct": "The exact confirmed handover occurs. The collector receives custody; ownership is unchanged.",
        "handover": {
          "complete": true,
          "holderId": "actor_0001",
          "itemId": "subject_0001",
          "offerId": "offer_0001",
          "offerRevision": 1,
          "ownerId": "actor_0003",
          "paidMinor": 0
        }
      },
      "observerId": "actor_0002"
    }
  ],
  "outcome": "performed",
  "request": {
    "actionType": "action_0006",
    "actorId": "actor_0001",
    "commandId": "command_ff185e4095b74f019e0fb9834ee6a8c1",
    "expectedRevision": 14,
    "permissionId": "permission_0007",
    "targetId": "subject_0001"
  }
}
```

Committed changes:
```json
[
  {
    "payload": {
      "fromId": "subject_0007",
      "itemId": "subject_0001",
      "ownerId": "actor_0003",
      "toId": "actor_0001"
    },
    "type": "custody_transfer"
  },
  {
    "payload": {
      "itemId": "subject_0001"
    },
    "type": "complete_recovery"
  }
]
```

## Commit 16: send_message / request_access

Bound preview:
```text
Requests access to Whole customer file concerning Collection record.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```
Notice receipt: null

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
The customer file contains case-handling material and unrelated private contact information. The relevant extract and permitted handling tray are available. Private contact values remain covered.
Social framing is measured.
```

Committed changes:
```json
[]
```

## Final outcome

```json
{
  "outcomes": {
    "recovered": true,
    "serviceOpen": true,
    "ownerId": "actor_0003",
    "holderId": "actor_0001",
    "quantity": 1,
    "balances": {
      "actor_0001": 1200,
      "actor_0002": 0,
      "actor_0004": 0
    },
    "recordCorrected": false,
    "privateDisclosed": false
  },
  "visits": [
    {
      "holderId": "actor_0002",
      "repairUsed": true,
      "restricted": false,
      "restrictedOrRepaired": true,
      "restrictionMessageId": "message_000c",
      "serviceId": "service_0001",
      "warningMessageId": "message_000c"
    }
  ],
  "defects": []
}
```
