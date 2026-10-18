# M3-D03 browser interaction transcript

origin: "Actual M3-D03 remediation browser UI export"
name: "browser-partial-left.json"
runSHA256: "c1f777f68bf4985cc726267b4724d23597fdcde150a4da1adb19cc8ab07706bb"
sourceRevision: "M3-runtime-v1-R3-D03"
sourceDigest: "aa2d37d3e0f1cb9c0743af0da5ca373cd724a7e02ae79a304a9e970227b99eb6"
buildSHA256: "8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb"
packageRef: {"id":"package_0003","revision":1,"digest":"2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f"}
revision: 12
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
    "commandId": "command_90b834a431734608960454466f863be1",
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
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
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
    "commandId": "command_a59820834fde4857aaf40cd5036fcf20",
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
    "commandId": "command_64fc692cd71b4ca3aab15db3a8632a7d",
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
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
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
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
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
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
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
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
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
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
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

## Commit 12: send_message / request_access

Bound preview:
```text
Requests access to Whole customer file concerning Collection record.
States the selected scope firmly and without adding unrelated demands.
Social framing is measured.
```
Notice receipt: {"displayed":false,"text":"The clerk warned that renewing this protected/full-file demand will end collection service for this visit. Send anyway or edit the draft.","warningMessageId":"message_000c"}

Intake: Looks from the received material to the collector, holding a composed expression.

Delivery:
```text
I decline that unrelated or protected scope. The case-only route remains the relevant collection route while service is open.
Social framing is measured.
```

Committed changes:
```json
[
  {
    "id": "defect_0001",
    "type": "technical_defect"
  }
]
```

## Final outcome

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
      "restricted": true,
      "restrictedOrRepaired": true,
      "restrictionMessageId": "message_000c",
      "serviceId": "service_0001",
      "warningMessageId": "message_000c"
    }
  ],
  "defects": [
    {
      "id": "defect_0001",
      "commandId": "command_c4aa17ff40454774b626b87bf99e4b21",
      "type": "MISSING_CLOSURE_PREVIEW",
      "warningMessageId": "message_000c",
      "serviceRemainsOpen": true
    }
  ]
}
```
