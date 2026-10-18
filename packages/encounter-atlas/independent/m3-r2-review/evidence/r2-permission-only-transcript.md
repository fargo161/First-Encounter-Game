# Independent M3 R2 interaction transcript

Run: r2-permission-only. Revision: 2.
Origin: Fresh visible UI on exact R2 executable, declared CSS-only fault where named.
Source digest: 7bbf91958abfb963830f412136baab95601da19cebc6673bf6d72207d18766d0.
Save SHA-256: 02d6ea6d1a17795856c8958dd97b03211a01c3fa4b8cf64317e7d0ce8fc45477.
Package: package_0003, revision 1, 2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f.

Fresh UI export independently validated by complete deterministic journal replay. Matching trace is generated from this validated save.

## Commit 1: perform_action / physical

Command: command_90b834a431734608960454466f863be1.

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

Command: command_f46dd38a4a18481eba557d1c77dd8c8e.

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
