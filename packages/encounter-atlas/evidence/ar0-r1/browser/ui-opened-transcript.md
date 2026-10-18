# AR0 R1 fresh browser transcript
Save ui-opened.json, SHA-256 a086cab0da3044908b6e16535bc4451ac72bee4529e82a3e7b9c276e06e78635.

## Revision 1: perform_action
{
  "operation": "physical",
  "request": {
    "actionType": "action_0001",
    "actorId": "actor_0001",
    "commandId": "command_e6f5120159d94707a2d79816705f6807",
    "expectedRevision": 0,
    "permissionId": "permission_0001",
    "targetId": "subject_0002"
  }
}

Physical/committed result: {"changes":[{"id":"result_0001","outcome":"performed","type":"physical_result"}],"outcome":"performed","resultId":"result_0001"}

## Revision 2: send_message
{
  "draft": {
    "act": "request_access",
    "amountMinor": 0,
    "contextMessageId": null,
    "evidenceKeys": [],
    "operation": "inspect",
    "purpose": "ordinary_collection",
    "salience": "OVERT",
    "scopeId": "subject_0003",
    "targetId": "subject_0003",
    "vibe": "SE"
  },
  "preview": {
    "message": {
      "commandId": "command_a24ff940f1c64af888c1de0dc80f1821",
      "contextMessageId": null,
      "id": "message_0001",
      "outward": {
        "act": "request_access",
        "content": {
          "amountMinor": 0,
          "evidence": [],
          "kind": "request",
          "operation": "inspect",
          "purpose": "ordinary_collection",
          "text": "Requests access to Collection record concerning Collection record."
        },
        "family": "Request",
        "framing": [
          {
            "kind": "displayed_concern",
            "text": "Acknowledges the clerk’s work and communicates supportive concern about a defensible handover."
          }
        ],
        "prominence": "emphatic",
        "recipientIds": [
          "actor_0002"
        ],
        "scope": {
          "kind": "subject",
          "subjectId": "subject_0003"
        },
        "senderId": "actor_0001",
        "subjectIds": [
          "subject_0003"
        ],
        "targetId": "subject_0003",
        "terms": null
      },
      "privateComposition": {
        "authorId": "author_0001",
        "intendedFraming": "Acknowledges the clerk’s work and communicates supportive concern about a defensible handover.",
        "selectedSalience": "OVERT",
        "selectedVibe": "SE",
        "templateId": "template_0012"
      },
      "schema": "encounter-message@3",
      "sequence": 4
    },
    "notice": null,
    "revision": 1,
    "text": "Requests access to Collection record concerning Collection record.\nAcknowledges the clerk’s work and communicates supportive concern about a defensible handover.\nSocial framing is emphatic."
  }
}

Intake: Looks from the received material to the collector, holding a composed expression.
Delivery: The customer file contains case-handling material and unrelated private contact information. The relevant extract and permitted handling tray are available. Private contact values remain covered.
Social framing is measured.

Physical/committed result: {"changes":[],"decisionId":"decision_0001","episodeId":"event_0005","initiatingMessageId":"message_0001","messageId":"message_0002"}
