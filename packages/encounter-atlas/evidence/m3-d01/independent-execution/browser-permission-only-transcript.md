# Independent M3 interaction transcript

Run: browser-permission-only; revision 2.
Origin: Fresh visible UI on exact frozen build.
ZIP SHA-256: de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64.
Source digest: 716a11c4efe9462e8ad60f16d6615ed8537811cf779d10dee424ef92558e3a94.
Package digest: 2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f.
Save SHA-256: 3ce53e87b06cdaeab19e0600c6d6d38bf5c542907759c1ec2d8a1e4381631bca.

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
