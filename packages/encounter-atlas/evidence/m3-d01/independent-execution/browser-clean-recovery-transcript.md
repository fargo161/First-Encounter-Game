# Independent M3 interaction transcript

Run: browser-clean-recovery; revision 14.
Origin: Fresh visible UI on exact frozen build.
ZIP SHA-256: de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64.
Source digest: 716a11c4efe9462e8ad60f16d6615ed8537811cf779d10dee424ef92558e3a94.
Package digest: 2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f.
Save SHA-256: 86e0804cd16dcf91934033874b95a6f5bf75a9143a6c96cb36b19df18579e9c9.

Fresh save validated by complete deterministic journal replay. Text below comes from actual committed messages and receipts; it is not a builder-supplied transcript.

## Commit 1: perform_action / physical

Command: command_9251c232a8ec48ffb3ad031c0df585d5; expected revision 0.

Physical result: result_0001 / performed.

```json
{
  "effects": [],
  "playerReceived": {
    "authority": {
      "collectorId": "actor_0001",
      "itemId": "subject_0001",
      "ownerId": "actor_0003",
      "ticketId": "subject_0002",
      "verified": true
    },
    "conduct": "The valid collection ticket is shown and verified."
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

Command: command_5920bb1d0c694e8c996c24273e63d323; expected revision 1.

Preview:
```text
Requests access to Collection record concerning Collection record.
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
```

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

Command: command_85e312236b974c91ba6586bb7ad1df42; expected revision 2.

Physical result: result_0002 / performed.

```json
{
  "effects": [],
  "playerReceived": {
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

Command: command_2af1c5e4bca3456f9f728d07d5c0f1cc; expected revision 3.

Physical result: result_0003 / performed.

```json
{
  "effects": [],
  "playerReceived": {
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

Command: command_3cff88ed734f45bfb23fd53f7377afdd; expected revision 4.

Preview:
```text
Asks where Nera’s green instrument case is. This is a request for location information, not a physical search.
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
```

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

Command: command_4ee0e9a36765450dada616a6fdca9e01; expected revision 5.

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

Command: command_83d400bb04a74f57bd1440026aacffa3; expected revision 6.

Preview:
```text
Asks where Nera’s green instrument case is. This is a request for location information, not a physical search.
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
```

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

Command: command_1914ffb4c0f4403e8e1588ebaacc4f8c; expected revision 7.

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

Command: command_e094c72cdd9144acb39c1c4e4112659e; expected revision 8.

Preview:
```text
Offers 100 minor money units for ordinary collection; no fee or debt is asserted.
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
```

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

## Commit 10: send_message / present_evidence

Command: command_18a5ab0b4715407ba79187fc1b228d8e; expected revision 9.

Preview:
```text
Shows only the selected evidence below, concerning Case-handling scope. Showing it does not transfer the object.
Recipient signature: unfilled
Drying tag 041 matches the case reference
Drying tag records internal drying, not recipient collection
A wrapped green case moved toward the partition; its exact identity was not established by that sighting
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
```

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
A supervised comparison limited to the case-handling evidence is available. Accepting it is permission; choose the physical comparison action to perform it.
Social framing is measured.
```

Committed changes:
```json
[]
```

## Commit 11: perform_action / physical

Command: command_93261905bf7b48e598279f1e281dd45c; expected revision 10.

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
The actual supervised comparison supports the authorized release. Review the exact current handover terms and confirm deliberately. Permission or saying Yes does not hand over the item.
Social framing is measured.
```

Physical result: result_0004 / performed.

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
  "playerReceived": {
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

## Commit 12: send_message / yes

Command: command_7f589a557a7b4964bb748de42104dd0d; expected revision 11.

Preview:
```text
Acknowledges handover proposal offer_0001, version 1. This does not confirm or execute its material terms.
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
```

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
Your acknowledgment does not execute the proposal. Use the separate exact handover confirmation if you accept the current terms.
Social framing is measured.
```

Committed changes:
```json
[]
```

## Commit 13: perform_action / physical

Command: command_07a3de74017f4593a57dcf8f73a4bf18; expected revision 12.

Physical result: result_0005 / performed.

```json
{
  "effects": [
    {
      "payload": {
        "recordId": "subject_0003",
        "text": "Original “collected” meant removal from the rack for internal drying; recipient handover is recorded separately."
      },
      "type": "correct_record"
    }
  ],
  "playerReceived": {
    "conduct": "The correction is recorded as a new revision; the original shorthand remains.",
    "recordCorrection": {
      "recordId": "subject_0003",
      "text": "Original “collected” meant removal from the rack for internal drying; recipient handover is recorded separately."
    }
  }
}
```

Committed changes:
```json
[
  {
    "id": "result_0005",
    "outcome": "performed",
    "type": "physical_result"
  }
]
```

## Commit 14: perform_action / confirm_offer

Command: command_b39f557361834ef2869329eb8016fdec; expected revision 13.

Physical result: result_0006 / performed.

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
  "playerReceived": {
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

## Final state

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
    "recordCorrected": true,
    "privateDisclosed": false
  },
  "visits": [
    {
      "holderId": "actor_0002",
      "repairUsed": false,
      "restricted": false,
      "restrictedOrRepaired": false,
      "restrictionMessageId": null,
      "serviceId": "service_0001",
      "warningMessageId": null
    }
  ],
  "technicalDefects": []
}
```
