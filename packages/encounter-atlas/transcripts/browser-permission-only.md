# Generated M3 interaction transcript

Source run: `runs/browser-permission-only.json`, SHA-256 `e5cf17f8477800bae8f585e831e403d5120c9a1388c31ab79308cd6b311f6d1a`.
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
Repair/visit state: `[{"holderId":"actor_0002","repairUsed":false,"restricted":false,"restrictedOrRepaired":false,"restrictionMessageId":null,"serviceId":"service_0001","warningMessageId":null}]`.
Technical defects: 0. Canonical observations: 11.
Private contact values are absent from player knowledge and actual decision inputs. Author/package exports retain synthetic fixture truth. Recovery, spending, privacy and record correction remain distinct.
