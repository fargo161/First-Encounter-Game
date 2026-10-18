# Independent M3 R1 interaction transcript

Run: r1-partial-evidence.json; revision 3.
Origin: Fresh visible UI on exact unmodified R1 HTML.
Source digest: 35fa58990b19a08933fefb7e2f37ba1d5c5edc5807390354eae238e531588711.
Save SHA-256: 203a954a8ebc6ffe9b2abfc88ab79947e24939301fef32c6cfcf354fbddb63b2.
Package: package_0003, revision 1, 2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f.

Fresh UI export validated by complete deterministic journal replay. The original warning save was generated in this R1 review through New run and actual actions.

## Commit 1: perform_action / physical

Command: command_515ceb0ab77243ec819650ef0a5e7736.

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

Command: command_9dc977aba4a44391a779310734bd2410.

Bound preview:
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

Command: command_17bb93a47f7e41449cd26470b2579b5e.

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

## Final state

```json
{
  "outcomes": {
    "recovered": false,
    "serviceOpen": true,
    "ownerId": "actor_0003",
    "holderId": "subject_0007",
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
