import { canonicalJson, copy, freeze, fields, id, integer, isRecord, requireThat, text, validateSource, validateObservation, validateMessage, validateOutward, validateClaim } from './contracts.mjs';

/** Authoritative routing adapter only: the caller supplies a declared detail grant. */
export function projectObservation(source, grant) {
  canonicalJson(source); canonicalJson(grant);
  fields(source, ['kind', 'id', 'sequence', 'details']); validateSource({ kind: source.kind, id: source.id }); integer(source.sequence);
  requireThat(isRecord(source.details));
  fields(grant, ['id', 'observerId', 'channel', 'receivedKeys', 'roots']);
  requireThat(Array.isArray(grant.receivedKeys) && new Set(grant.receivedKeys).size === grant.receivedKeys.length);
  const received = Object.create(null);
  for (const key of grant.receivedKeys) {
    text(key, 100); requireThat(Object.hasOwn(source.details, key), 'INVALID_DETAIL_GRANT');
    received[key] = copy(source.details[key]);
  }
  const observation = { schema: 'encounter-observation@2', id: grant.id, observerId: grant.observerId,
    source: { kind: source.kind, id: source.id }, sequence: source.sequence, channel: grant.channel,
    receivedDetails: received, roots: copy(grant.roots) };
  validateObservation(observation); return freeze(copy(observation));
}
export function observeMessage(message, { id: observationId, observerId }) {
  validateMessage(message); id(observerId, 'actor');
  requireThat(message.outward.recipientIds.includes(observerId), 'NO_RECEIVING_PATH');
  return projectObservation({ kind: 'message', id: message.id, sequence: message.sequence, details: { communication: message.outward } },
    { id: observationId, observerId, channel: 'hearing', receivedKeys: ['communication'], roots: [{ kind: 'message', id: message.id }] });
}
export function previewView(compiledCandidate) {
  validateMessage(compiledCandidate);
  return freeze(copy({ privateComposition: compiledCandidate.privateComposition, outward: compiledCandidate.outward, contextMessageId: compiledCandidate.contextMessageId }));
}
export function recipientHistory(observations, actorId) {
  id(actorId, 'actor'); observations.forEach(validateObservation);
  requireThat(new Set(observations.map(o => o.id)).size === observations.length, 'DUPLICATE_OBSERVATION');
  return freeze(copy(observations.filter(o => o.observerId === actorId)));
}

/** No source-event store, canonical messages, assets or package data enter this API. */
export function listenerView({ actorId, currentMessageId, observations, claims, profile }) {
  id(actorId, 'actor'); id(currentMessageId, 'message');
  const local = recipientHistory(observations, actorId);
  const delivery = local.find(o => o.source.kind === 'message' && o.source.id === currentMessageId && Object.hasOwn(o.receivedDetails, 'communication'));
  requireThat(Boolean(delivery), 'NO_RECEIVING_PATH'); validateOutward(delivery.receivedDetails.communication);
  requireThat(delivery.receivedDetails.communication.recipientIds.includes(actorId), 'NO_RECEIVING_PATH');
  canonicalJson(profile); fields(profile, ['roles', 'priorities']);
  requireThat(Array.isArray(profile.roles)); profile.roles.forEach(role => text(role, 100));
  fields(profile.priorities, ['relevantService', 'privacy', 'verification']);
  Object.values(profile.priorities).forEach(weight => { integer(weight); requireThat(weight <= 100); });
  claims.forEach(validateClaim);
  const localIds = new Set(local.map(o => o.id));
  const localClaims = claims.filter(claim => claim.recipientIds.includes(actorId) && claim.observationIds.every(ref => localIds.has(ref)) &&
    local.some(o => {
      if (!claim.observationIds.includes(o.id) || o.source.kind !== 'message' || o.source.id !== claim.messageId) return false;
      const spoken = o.receivedDetails.communication;
      if (!spoken || spoken.content.kind !== 'assertion') return false;
      return spoken.senderId === claim.speakerId && spoken.recipientIds.includes(actorId) && spoken.targetId === claim.proposition.subjectId &&
        spoken.content.predicate === claim.proposition.predicate && spoken.content.timeScope === claim.proposition.timeScope &&
        canonicalJson(spoken.content.value) === canonicalJson(claim.proposition.value);
    }));
  return freeze(copy({ actorId, currentMessageId, incoming: delivery.receivedDetails.communication, observations: local, claims: localClaims, profile }));
}
/** Opaque source citation can retrieve only already received fragments. */
export function readObservedSource(boundListenerView, source) {
  validateSource(source);
  return freeze(copy(boundListenerView.observations.filter(o => o.source.kind === source.kind && o.source.id === source.id)
    .map(o => ({ observationId: o.id, receivedDetails: o.receivedDetails }))));
}
/** Explicit author-only read. Never supplied to listener/presentation adapters. */
export function authorInspector(record) { return freeze(copy(record)); }
