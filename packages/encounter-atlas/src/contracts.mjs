/** M1 records only. No scenario, semantic compiler or gameplay resolver. */
export class ContractError extends Error {
  constructor(code) { super(code); this.code = code; }
}
export function requireThat(condition, code = 'INVALID_RECORD') {
  if (!condition) throw new ContractError(code);
}
export const isRecord = value => value !== null && typeof value === 'object' &&
  !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));

/** Reject values JSON would silently discard or transform, and accessor code. */
export function validateJson(value, depth = 0, ancestors = new Set()) {
  requireThat(depth <= 32, 'INVALID_JSON');
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') { requireThat(Number.isFinite(value), 'INVALID_JSON'); return; }
  requireThat(typeof value === 'object' && !ancestors.has(value), 'INVALID_JSON');
  requireThat(Array.isArray(value) || isRecord(value), 'INVALID_JSON');
  requireThat(Object.getOwnPropertySymbols(value).length === 0, 'INVALID_JSON');
  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (Array.isArray(value) && key === 'length') continue;
    requireThat('value' in descriptor && descriptor.enumerable, 'INVALID_JSON');
    if (Array.isArray(value)) requireThat(/^(0|[1-9]\d*)$/.test(key) && Number(key) < value.length, 'INVALID_JSON');
  }
  if (Array.isArray(value)) requireThat(Object.keys(value).length === value.length, 'INVALID_JSON');
  const next = new Set(ancestors); next.add(value);
  for (const descriptor of Object.values(descriptors)) {
    if (Array.isArray(value) && descriptor === descriptors.length) continue;
    validateJson(descriptor.value, depth + 1, next);
  }
}
export function canonicalJson(value) {
  validateJson(value);
  const encode = node => {
    if (Array.isArray(node)) return `[${node.map(encode).join(',')}]`;
    if (isRecord(node)) return `{${Object.keys(node).sort().map(k => `${JSON.stringify(k)}:${encode(node[k])}`).join(',')}}`;
    return JSON.stringify(node);
  };
  const result = encode(value);
  requireThat(result.length <= 1024 * 1024, 'JSON_LIMIT');
  return result;
}
export const copy = value => JSON.parse(canonicalJson(value));
export function freeze(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
export function fields(value, required, optional = []) {
  requireThat(isRecord(value));
  requireThat(required.every(k => Object.hasOwn(value, k)));
  requireThat(Object.keys(value).every(k => [...required, ...optional].includes(k)));
}
export function text(value, limit = 4000) { requireThat(typeof value === 'string' && value.trim().length > 0 && value.length <= limit); }
export function integer(value) { requireThat(Number.isSafeInteger(value) && value >= 0); }
export function scalar(value) { requireThat(value === null || ['string', 'number', 'boolean'].includes(typeof value)); }
export function id(value, type) { requireThat(typeof value === 'string' && new RegExp(`^${type}_[0-9a-f]{4,32}$`).test(value)); }
export function ids(values, type) {
  requireThat(Array.isArray(values) && new Set(values).size === values.length);
  values.forEach(v => id(v, type));
}
export function packageRef(ref) {
  fields(ref, ['id', 'revision', 'digest']); id(ref.id, 'package'); integer(ref.revision);
  requireThat(typeof ref.digest === 'string' && /^[0-9a-f]{64}$/.test(ref.digest));
}

// Verified legacy catalog names/order; reaction deltas and 1/2/4 ranks are absent.
export const BASED_CATALOG = freeze({
  BA: 'Reckless', BS: 'Instigating', BE: 'Condemning', BD: 'Extortive',
  AB: 'Menacing', AS: 'Commanding', AE: 'Urgent', AD: 'Hustled',
  SB: 'Irreverent', SA: 'Charismatic', SE: 'Compassionate', SD: 'Coaxing',
  EB: 'Steadfast', EA: 'Boundaried', ES: 'Communal', ED: 'Deflecting',
  DB: 'Bluffing', DA: 'Predatory', DS: 'Insinuating', DE: 'Feigning'
});
export const ACT_FAMILIES = freeze({
  ask_whereabouts: 'Request', challenge_record: 'Remark', present_evidence: 'Remark',
  acknowledge_grievance: 'Remark', request_access: 'Request', propose_exchange: 'Offer'
});
// Reply shapes share the same canonical envelope; no reply policy is built here.
export const RESPONSE_FAMILIES = freeze({ explain_access: 'Remark', acknowledge_report: 'Remark', decline_scope: 'Remark' });
export const SALIENCE = freeze(['SUBTLE', 'NUANCED', 'OVERT']);
const sourceTypes = { message: 'message', event: 'event', action_result: 'result' };
export function validateSource(source) {
  fields(source, ['kind', 'id']); requireThat(Object.hasOwn(sourceTypes, source.kind)); id(source.id, sourceTypes[source.kind]);
}
export function validateOutward(outward) {
  canonicalJson(outward);
  fields(outward, ['family', 'act', 'senderId', 'recipientIds', 'subjectIds', 'targetId', 'scope', 'content', 'framing', 'prominence', 'terms']);
  const family = Object.hasOwn(ACT_FAMILIES, outward.act) ? ACT_FAMILIES[outward.act] :
    Object.hasOwn(RESPONSE_FAMILIES, outward.act) ? RESPONSE_FAMILIES[outward.act] : null;
  requireThat(family !== null && family === outward.family);
  id(outward.senderId, 'actor'); ids(outward.recipientIds, 'actor'); requireThat(outward.recipientIds.length > 0);
  ids(outward.subjectIds, 'subject'); id(outward.targetId, 'subject');
  requireThat(outward.subjectIds.includes(outward.targetId));
  fields(outward.scope, ['subjectId', 'kind']); id(outward.scope.subjectId, 'subject'); text(outward.scope.kind, 100);
  requireThat(outward.subjectIds.includes(outward.scope.subjectId));
  fields(outward.content, ['kind', 'predicate', 'value', 'timeScope']);
  requireThat(['request', 'question', 'assertion', 'proposal', 'acknowledgment'].includes(outward.content.kind)); text(outward.content.predicate, 100); text(outward.content.timeScope, 100);
  scalar(outward.content.value);
  requireThat(Array.isArray(outward.framing) && outward.framing.length <= 12);
  for (const cue of outward.framing) {
    fields(cue, ['kind', 'text', 'subjectIds']); text(cue.kind, 100); text(cue.text); ids(cue.subjectIds, 'subject');
    requireThat(cue.subjectIds.every(subject => outward.subjectIds.includes(subject)));
  }
  requireThat(['understated', 'measured', 'emphatic'].includes(outward.prominence));
  // M1 has no exchange implementation. A non-null terms record must fail clearly.
  requireThat(outward.terms === null, 'UNIMPLEMENTED_TERMS');
  requireThat(outward.act !== 'propose_exchange', 'UNIMPLEMENTED_ACT');
  return true;
}
export function validateMessage(message) {
  canonicalJson(message);
  fields(message, ['schema', 'id', 'commandId', 'sequence', 'contextMessageId', 'privateComposition', 'outward']);
  requireThat(message.schema === 'encounter-message@2'); id(message.id, 'message'); id(message.commandId, 'command'); integer(message.sequence);
  if (message.contextMessageId !== null) id(message.contextMessageId, 'message');
  const privatePart = message.privateComposition;
  fields(privatePart, ['selectedVibe', 'selectedSalience', 'authorId', 'templateId', 'intendedFraming']);
  requireThat(Object.hasOwn(BASED_CATALOG, privatePart.selectedVibe)); requireThat(SALIENCE.includes(privatePart.selectedSalience));
  id(privatePart.authorId, 'author'); id(privatePart.templateId, 'template'); text(privatePart.intendedFraming);
  validateOutward(message.outward); return true;
}
export function validateObservation(observation) {
  canonicalJson(observation);
  fields(observation, ['schema', 'id', 'observerId', 'source', 'sequence', 'channel', 'receivedDetails', 'roots']);
  requireThat(observation.schema === 'encounter-observation@2'); id(observation.id, 'observation'); id(observation.observerId, 'actor');
  validateSource(observation.source); integer(observation.sequence);
  requireThat(['hearing', 'sight', 'reading', 'initial'].includes(observation.channel));
  requireThat(isRecord(observation.receivedDetails));
  requireThat(Array.isArray(observation.roots) && observation.roots.length > 0);
  observation.roots.forEach(validateSource);
  requireThat(new Set(observation.roots.map(canonicalJson)).size === observation.roots.length);
  return true;
}
export function validateClaim(claim) {
  canonicalJson(claim);
  fields(claim, ['id', 'speakerId', 'recipientIds', 'messageId', 'proposition', 'observationIds', 'roots']);
  id(claim.id, 'claim'); id(claim.speakerId, 'actor'); ids(claim.recipientIds, 'actor'); id(claim.messageId, 'message');
  fields(claim.proposition, ['subjectId', 'predicate', 'value', 'timeScope']);
  id(claim.proposition.subjectId, 'subject'); text(claim.proposition.predicate, 100); text(claim.proposition.timeScope, 100);
  scalar(claim.proposition.value);
  ids(claim.observationIds, 'observation'); requireThat(claim.observationIds.length > 0);
  requireThat(Array.isArray(claim.roots) && claim.roots.length > 0); claim.roots.forEach(validateSource);
  return true;
}
export function validatePermission(permission) {
  canonicalJson(permission);
  fields(permission, ['id', 'granteeId', 'grantorId', 'actionType', 'targetId', 'scope', 'status', 'sourceMessageId']);
  id(permission.id, 'permission'); id(permission.granteeId, 'actor'); id(permission.grantorId, 'actor');
  text(permission.actionType, 100); id(permission.targetId, 'subject'); text(permission.scope, 100);
  requireThat(['allowed', 'unset', 'forbidden'].includes(permission.status)); id(permission.sourceMessageId, 'message'); return true;
}
export function validateActionRequest(request) {
  canonicalJson(request);
  fields(request, ['commandId', 'actorId', 'actionType', 'targetId', 'permissionId', 'expectedRevision']);
  id(request.commandId, 'command'); id(request.actorId, 'actor'); text(request.actionType, 100); id(request.targetId, 'subject');
  id(request.permissionId, 'permission'); integer(request.expectedRevision); return true;
}
export function validateMatchedResult(request, result, supportedEffectTypes) {
  validateActionRequest(request); canonicalJson(result);
  fields(result, ['id', 'request', 'outcome', 'effects', 'observerDetails']); id(result.id, 'result');
  requireThat(canonicalJson(result.request) === canonicalJson(request), 'RESULT_MISMATCH');
  requireThat(['performed', 'no_discovery', 'refused'].includes(result.outcome));
  requireThat(Array.isArray(result.effects) && Array.isArray(result.observerDetails));
  for (const effect of result.effects) {
    fields(effect, ['type', 'payload']); requireThat(supportedEffectTypes.includes(effect.type), 'UNSUPPORTED_EFFECT');
  }
  for (const recipient of result.observerDetails) {
    fields(recipient, ['observerId', 'details']); id(recipient.observerId, 'actor'); requireThat(isRecord(recipient.details));
  }
  requireThat(new Set(result.observerDetails.map(r => r.observerId)).size === result.observerDetails.length);
  return true;
}
