# Generated M3 interaction transcript

Source run: `runs/browser-restricted.json`, SHA-256 `161538143627277aa089d2cb7b70f5ac8efdb1c23d8de2ad618df30f0d6371ee`.
Code: `M3-runtime-v1-R2-D02`, source digest `7bbf91958abfb963830f412136baab95601da19cebc6673bf6d72207d18766d0`.
Content: `M3-protective-shortcut-v1`, package digest `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f`.
Generated from the actual browser Save run export after complete package, domain and command-journal validation. The text below is emitted by the implementation.

## Commit 1 · perform_action / physical

Command `command_5c4b690369ea40899483b760fccef929`, expected revision 0.

Physical result `result_0001`: performed; request action `action_0001`.

Received by `actor_0001`:
```text
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
```

Received by `actor_0002`:
```text
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
```

Actual effects:
```text
[]
```

Committed changes:
```text
[
  {
    "id": "result_0001",
    "outcome": "performed",
    "type": "physical_result"
  }
]
```

## Commit 2 · send_message

Command `command_a611fdc729cd4c87b0d588de5ed9b744`, expected revision 1.

Bound preview:
```text
Requests access to Collection record concerning Collection record.
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
```

Intake:
```text
Looks from the received material to the collector, holding a composed expression.
```

Delivery:
```text
Keeps the selected material in view and states the bounded response with a composed face.
The customer file contains case-handling material and unrelated private contact information. The relevant extract and permitted handling tray are available. Private contact values remain covered.
Social framing is measured.
```

Decision `decision_0001`; exact actor-local input and eligibility reasons are in the matching trace.

Committed changes:
```text
[]
```

## Commit 3 · send_message

Command `command_79d18c3f1474440cb82a670bfc450044`, expected revision 2.

Bound preview:
```text
Offers 100 minor money units for ordinary collection; no fee or debt is asserted.
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
```

Intake:
```text
Looks from the received material to the collector, holding a composed expression.
```

Delivery:
```text
Keeps the selected material in view and states the bounded response with a composed face.
No extra collection charge is due. I decline the ordinary payment offer as unnecessary. No money moves and no new debt or bribery judgment is created.
Social framing is measured.
```

Decision `decision_0002`; exact actor-local input and eligibility reasons are in the matching trace.

Committed changes:
```text
[]
```

## Commit 4 · send_message

Command `command_a67e3a0c696940d0a78bb89c0f44146b`, expected revision 3.

Bound preview:
```text
Asks where Nera’s green instrument case is. This is a request for location information, not a physical search.
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
```

Intake:
```text
Looks from the received material to the collector, holding a composed expression.
```

Delivery:
```text
Keeps the selected material in view and states the bounded response with a composed face.
I refer you to the recorded entry and the relevant inspection route rather than explaining the earlier movement.
Social framing is measured.
```

Decision `decision_0003`; exact actor-local input and eligibility reasons are in the matching trace.

Committed changes:
```text
[]
```

## Commit 5 · perform_action / physical

Command `command_156d4793028f4abe84d97a2ec2176631`, expected revision 4.

Physical result `result_0002`: performed; request action `action_0002`.

Received by `actor_0001`:
```text
{
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
```

Received by `actor_0002`:
```text
{
  "conduct": "Sees the collector inspect the permitted extract; the small print is unreadable from here.",
  "evidence": [],
  "references": []
}
```

Actual effects:
```text
[]
```

Committed changes:
```text
[
  {
    "id": "result_0002",
    "outcome": "performed",
    "type": "physical_result"
  }
]
```

## Commit 6 · perform_action / physical

Command `command_254b61a877794389b0f58c03ae42cf50`, expected revision 5.

Physical result `result_0003`: performed; request action `action_0003`.

Received by `actor_0001`:
```text
{
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
```

Received by `actor_0004`:
```text
{
  "conduct": "Sees the collector search the permitted handling tray; does not read the tag.",
  "evidence": [],
  "references": []
}
```

Actual effects:
```text
[]
```

Committed changes:
```text
[
  {
    "id": "result_0003",
    "outcome": "performed",
    "type": "physical_result"
  }
]
```

## Commit 7 · perform_action / switch_partner

Command `command_b20ab873a14c47338588ed04cc3ad242`, expected revision 6.

Committed changes:
```text
[
  {
    "partnerId": "actor_0004",
    "type": "switch_partner"
  }
]
```

## Commit 8 · send_message

Command `command_653ae17aba7b4bd798f992030820e709`, expected revision 7.

Bound preview:
```text
Asks where Nera’s green instrument case is. This is a request for location information, not a physical search.
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
```

Intake:
```text
Looks from the received material to the collector, holding a composed expression.
```

Delivery:
```text
Keeps the selected material in view and states the bounded response with a composed face.
A wrapped green case moved toward the partition; its exact identity was not established by that sighting
It may have been an exception. I did not see the damp seam, final cupboard, or purpose; that interpretation is not a witnessed fact.
This report does not prove a completed collection.
Social framing is measured.
```

Decision `decision_0004`; exact actor-local input and eligibility reasons are in the matching trace.

Committed changes:
```text
[]
```

## Commit 9 · perform_action / switch_partner

Command `command_986cb615bca842cf8c558d25cf03e5a2`, expected revision 8.

Committed changes:
```text
[
  {
    "partnerId": "actor_0002",
    "type": "switch_partner"
  }
]
```

## Commit 10 · send_message

Command `command_aa34e1a6e6124197a60ceb434ec1f576`, expected revision 9.

Bound preview:
```text
Asks where Nera Vale is. This is a request for location information, not a physical search.
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
```

Intake:
```text
Looks from the received material to the collector, holding a composed expression.
```

Delivery:
```text
Keeps the selected material in view and states the bounded response with a composed face.
I decline that unrelated or protected scope. The case-only route remains the relevant collection route while service is open.
Social framing is measured.
```

Decision `decision_0005`; exact actor-local input and eligibility reasons are in the matching trace.

Committed changes:
```text
[]
```

## Commit 11 · send_message

Command `command_44082f43738544b1bdd3692b8c36a420`, expected revision 10.

Bound preview:
```text
Requests access to Whole customer file concerning Collection record.
Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.
Social framing is emphatic.
```

Intake:
```text
Looks from the received material to the collector, holding a composed expression.
```

Delivery:
```text
Keeps the selected material in view and states the bounded response with a composed face.
Further relevant-file access is limited to a supervised comparison. That case-only comparison remains available to complete collection. Renewing a demand for protected/full-file information, or asking me to bypass that boundary, will end collection service for this visit. This warning still applies after clarification or repair.
Social framing is measured.
```

Decision `decision_0006`; exact actor-local input and eligibility reasons are in the matching trace.

Committed changes:
```text
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

## Final independent outcomes

```text
{
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
}
```
Repair/visit state: `[{"holderId":"actor_0002","repairUsed":false,"restricted":true,"restrictedOrRepaired":true,"restrictionMessageId":"message_000c","serviceId":"service_0001","warningMessageId":"message_000c"}]`.
Technical defects: 0. Canonical observations: 32.
Private contact values are absent from player knowledge and actual decision inputs. Author/package exports retain synthetic fixture truth. Recovery, spending, privacy and record correction remain distinct.
