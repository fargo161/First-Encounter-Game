# Independent M3 interaction transcript

Run: browser-transparent-notice-repeat; revision 10.
Origin: Fresh visible UI on external CSS-only rendering-fault harness.
ZIP SHA-256: de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64.
Source digest: 716a11c4efe9462e8ad60f16d6615ed8537811cf779d10dee424ef92558e3a94.
Package digest: 2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f.
Save SHA-256: 9e9fce832f91903f3a59e249d5c9bdfc1bf3029e5f603b154baad2666508f03e.

Fresh save validated by complete deterministic journal replay. Text below comes from actual committed messages and receipts; it is not a builder-supplied transcript.

## Commit 1: perform_action / physical

Command: command_9ce1143e8e854de989cd9e181e3a66cb; expected revision 0.

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

Command: command_4698778252aa48adbc765b17d2e38ec0; expected revision 1.

Preview:
```text
Requests access to Collection record concerning Collection record.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
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

Command: command_2d87fa028c504f0f8f3de0ac272df09b; expected revision 2.

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

Command: command_d0dc30ada38b487690013d78b80f6f89; expected revision 3.

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

## Commit 5: perform_action / switch_partner

Command: command_d74bcf6dfcbb4b429e3f9a18c27268f7; expected revision 4.

Committed changes:
```json
[
  {
    "partnerId": "actor_0004",
    "type": "switch_partner"
  }
]
```

## Commit 6: send_message / ask_whereabouts

Command: command_4557695368cb4af592a3e6af0fa0a0d2; expected revision 5.

Preview:
```text
Asks where Nera’s green instrument case is. This is a request for location information, not a physical search.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
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

## Commit 7: perform_action / switch_partner

Command: command_3e6928514c234daa9bfded788d452587; expected revision 6.

Committed changes:
```json
[
  {
    "partnerId": "actor_0002",
    "type": "switch_partner"
  }
]
```

## Commit 8: send_message / ask_whereabouts

Command: command_b2a7763fa6514d5c8269343adf0fb5ba; expected revision 7.

Preview:
```text
Asks where Nera Vale is. This is a request for location information, not a physical search.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```

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

## Commit 9: send_message / request_access

Command: command_28104eeabc444dbe880aacf065301e5a; expected revision 8.

Preview:
```text
Requests access to Whole customer file concerning Collection record.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```

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
    "messageId": "message_0008",
    "type": "restriction"
  },
  {
    "messageId": "message_0008",
    "type": "warning_delivered"
  }
]
```

## Commit 10: send_message / request_access

Command: command_dc0159e9132d4896878ee7e8c79e56b8; expected revision 9.

Preview:
```text
Requests access to Whole customer file concerning Collection record.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```

Closure notice text:
```text
The clerk warned that renewing this protected/full-file demand will end collection service for this visit. Send anyway or edit the draft.
```
Recorded display receipt: true.

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
Collection service is now closed for this visit following the previously warned, previewed renewed protected-scope demand.
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
      "type": "close_service"
    }
  ],
  "playerReceived": {
    "conduct": "Collection service closed for this visit after the declared warning and renewed demand.",
    "service": {
      "id": "service_0001",
      "open": false
    }
  }
}
```

Committed changes:
```json
[
  {
    "resultId": "result_0004",
    "type": "service_closed"
  }
]
```

## Final state

```json
{
  "outcomes": {
    "recovered": false,
    "serviceOpen": false,
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
      "restricted": true,
      "restrictedOrRepaired": true,
      "restrictionMessageId": "message_0008",
      "serviceId": "service_0001",
      "warningMessageId": "message_0008"
    }
  ],
  "technicalDefects": []
}
```
