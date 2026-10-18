import test from 'node:test';
import assert from 'node:assert/strict';
import { BASED_CATALOG, ACT_FAMILIES, SALIENCE, canonicalJson, copy, validateMessage, validatePermission } from '../src/contracts.mjs';
import { authorInspector, listenerView, observeMessage, previewView, projectObservation, readObservedSource, recipientHistory } from '../src/views.mjs';
import { stageMatchedResult } from '../src/action-boundary.mjs';
import { message, profile, actionRequest, actionResult } from './fixtures.mjs';
function view(msg = message(), extras = [], claims = []) {
  const observation = observeMessage(msg, { id: 'observation_0001', observerId: 'actor_0002' });
  return listenerView({ actorId: 'actor_0002', currentMessageId: msg.id, observations: [observation, ...extras], claims, profile });
}
function physicalObservation(source = { kind: 'action_result', id: 'result_0001', sequence: 2,
  details: { conduct: 'Inspects the extract.', smallPrint: 'UNREAD-CANARY', privateContact: 'CONTACT-CANARY' } }) {
  return projectObservation(source, { id: 'observation_0002', observerId: 'actor_0002', channel: 'sight', receivedKeys: ['conduct'], roots: [{ kind: 'action_result', id: 'result_0001' }] });
}
test('catalog preserves twenty ordered pairs, six actions, and three settings', () => {
  assert.equal(Object.keys(BASED_CATALOG).length, 20); assert.equal(Object.keys(ACT_FAMILIES).length, 6); assert.equal(SALIENCE.length, 3);
  assert.ok(Object.keys(BASED_CATALOG).every(pair => pair[0] !== pair[1]));
});
test('strict outward schema rejects selected labels, asset/cache keys and provenance fields', () => {
  for (const key of ['selectedVibe', 'deceptiveMode', 'assetId', 'cacheKey', 'templateId', 'intendedHiddenConclusion']) {
    const candidate = message(); candidate.outward[key] = 'PRIVATE-CANARY'; assert.throws(() => validateMessage(candidate));
  }
});
test('private selector perturbation with fixed outward payload produces identical complete listener input', () => {
  const original = message(), changed = copy(original);
  changed.privateComposition = { ...changed.privateComposition, selectedVibe: 'DE', selectedSalience: 'OVERT', templateId: 'template_0099', intendedFraming: 'AUTHOR-ONLY-CANARY' };
  assert.deepEqual(view(original), view(changed));
  const received = canonicalJson(view(changed));
  for (const token of ['privateComposition', 'selectedVibe', 'selectedSalience', 'templateId', 'AUTHOR-ONLY-CANARY']) assert.ok(!received.includes(token));
});
test('schema accepts a legitimately performed distinctive cue without a hidden vibe key', () => {
  const candidate = message(); candidate.outward.framing = [{ kind: 'displayed_alignment', text: 'Invites reliance on the performed shared concern.', subjectIds: ['subject_0001'] }];
  assert.equal(view(candidate).incoming.framing[0].kind, 'displayed_alignment');
});
test('preview/recipient history/author inspection are independent frozen read-only copies', () => {
  const candidate = message(), before = canonicalJson(candidate), preview = previewView(candidate), inspector = authorInspector(candidate);
  assert.ok(preview.privateComposition); assert.ok(inspector.privateComposition); assert.throws(() => { preview.outward.targetId = 'subject_0002'; }, TypeError);
  for (let i = 0; i < 4; i++) { authorInspector(candidate); recipientHistory([observeMessage(candidate, { id: 'observation_0001', observerId: 'actor_0002' })], 'actor_0002'); }
  assert.equal(canonicalJson(candidate), before);
});
test('REQUIRED: a known source ID retrieves only received conduct, never hidden source fields', () => {
  const received = view(message(), [physicalObservation()]);
  const lookup = readObservedSource(received, { kind: 'action_result', id: 'result_0001' });
  assert.deepEqual(lookup, [{ observationId: 'observation_0002', receivedDetails: { conduct: 'Inspects the extract.' } }]);
  assert.equal(lookup[0].receivedDetails.smallPrint, undefined); assert.equal(lookup[0].receivedDetails.privateContact, undefined);
  assert.deepEqual(readObservedSource(received, { kind: 'event', id: 'event_9999' }), []);
  assert.ok(!canonicalJson(received).includes('CANARY'));
});
test('changing unreceived authoritative details leaves the entire listener view unchanged', () => {
  const altered = { kind: 'action_result', id: 'result_0001', sequence: 2, details: { conduct: 'Inspects the extract.', smallPrint: 'OTHER-CANARY', privateContact: 'OTHER-CONTACT' } };
  assert.deepEqual(view(message(), [physicalObservation()]), view(message(), [physicalObservation(altered)]));
});
test('an observed historical event ID grants no access to its concealed destination or purpose', () => {
  const observation = projectObservation({ kind: 'event', id: 'event_0012', sequence: 0,
    details: { visibleMovement: 'Wrapped item leaves the rack toward the partition.', destination: 'DESTINATION-CANARY', purpose: 'PURPOSE-CANARY' } },
    { id: 'observation_0012', observerId: 'actor_0002', channel: 'sight', receivedKeys: ['visibleMovement'], roots: [{ kind: 'event', id: 'event_0012' }] });
  const received = view(message(), [observation]);
  assert.deepEqual(readObservedSource(received, { kind: 'event', id: 'event_0012' }),
    [{ observationId: 'observation_0012', receivedDetails: { visibleMovement: 'Wrapped item leaves the rack toward the partition.' } }]);
  assert.ok(!canonicalJson(received).includes('CANARY'));
});
test('no receiving path and another actor observation cannot become local knowledge', () => {
  assert.throws(() => observeMessage(message(), { id: 'observation_0001', observerId: 'actor_0003' }));
  const other = copy(physicalObservation()); other.observerId = 'actor_0003';
  assert.equal(view(message(), [other]).observations.length, 1);
});
test('projection rejects unknown detail grants; missing fields are not negated beliefs', () => {
  assert.throws(() => projectObservation({ kind: 'event', id: 'event_0001', sequence: 1, details: {} },
    { id: 'observation_0001', observerId: 'actor_0002', channel: 'sight', receivedKeys: ['nonexistent'], roots: [{ kind: 'event', id: 'event_0001' }] }));
  const received = physicalObservation(); assert.equal(Object.hasOwn(received.receivedDetails, 'privateContact'), false); assert.equal(Object.hasOwn(received, 'beliefs'), false);
});
test('hearing an assertion produces a received claim, not firsthand perception or world truth', () => {
  const candidate = message(); candidate.outward.family = 'Remark'; candidate.outward.act = 'challenge_record';
  candidate.outward.content = { kind: 'assertion', predicate: 'recipient_signature', value: 'unfilled', timeScope: 'current_entry' };
  const claim = { id: 'claim_0001', speakerId: 'actor_0001', recipientIds: ['actor_0002'], messageId: candidate.id,
    proposition: { subjectId: 'subject_0001', predicate: 'recipient_signature', value: 'unfilled', timeScope: 'current_entry' },
    observationIds: ['observation_0001'], roots: [{ kind: 'message', id: candidate.id }] };
  const received = view(candidate, [], [claim]); assert.equal(received.claims.length, 1);
  assert.equal(received.observations[0].source.kind, 'message'); assert.equal(received.observations[0].channel, 'hearing');
  assert.equal(Object.hasOwn(received, 'worldFacts'), false);
  const fabricated = copy(claim); fabricated.proposition.value = 'signed'; assert.equal(view(candidate, [], [fabricated]).claims.length, 0);
});
test('a permission record alone has no inspection result or observation effects', () => {
  const permission = { id: 'permission_0001', granteeId: 'actor_0001', grantorId: 'actor_0002', actionType: 'inspect_records', targetId: 'subject_0001', scope: 'relevant_records', status: 'allowed', sourceMessageId: 'message_0001' };
  const data = { permissions: [permission], observations: [], actionResults: [] }, before = canonicalJson(data);
  assert.equal(validatePermission(permission), true); assert.equal(canonicalJson(data), before); assert.deepEqual(data.observations, []);
});
test('matched neutral result stages once; visible observer gets conduct while reader gets print', () => {
  const data = { count: 0, observations: [], actionResults: [] }, result = actionResult();
  const apply = (draft, effects, observers) => { draft.count += effects[0].payload.amount; draft.observations.push(...observers); return true; };
  const first = stageMatchedResult(data, actionRequest(), result, ['neutral_increment'], apply);
  const retry = stageMatchedResult(first.data, actionRequest(), result, ['neutral_increment'], () => { throw Error('double effect'); });
  assert.equal(retry.replayed, true); assert.equal(retry.data.count, 1); assert.equal(data.count, 0);
  assert.equal(retry.data.observations.find(o => o.observerId === 'actor_0002').details.printedDetail, undefined);
});
test('result/request mismatch, changed result identity and second result for one request reject', () => {
  const data = { actionResults: [actionResult()] }, changed = actionResult(); changed.effects[0].payload.amount = 2;
  assert.throws(() => stageMatchedResult(data, actionRequest(), changed, ['neutral_increment'], () => true));
  const second = actionResult(); second.id = 'result_0002';
  assert.throws(() => stageMatchedResult(data, actionRequest(), second, ['neutral_increment'], () => true));
  const otherRequest = actionRequest(); otherRequest.targetId = 'subject_0002';
  assert.throws(() => stageMatchedResult(data, otherRequest, actionResult(), ['neutral_increment'], () => true));
});
test('unsupported future physical effects fail clearly', () => {
  assert.throws(() => stageMatchedResult({ actionResults: [] }, actionRequest(), actionResult(), [], () => true));
});
test('JSON validation rejects silent loss, accessors, cycles, NaN and sparse arrays', () => {
  for (const invalid of [undefined, { x: undefined }, { x: NaN }, { get x() { throw Error('getter ran'); } }, new Date(), [, 1]]) assert.throws(() => canonicalJson(invalid));
  const cyclic = {}; cyclic.self = cyclic; assert.throws(() => canonicalJson(cyclic));
});
test('IDs cannot embed story names or selected labels', () => {
  for (const bad of ['message_Tamsin', 'message_EA', 'message_seed_a']) { const candidate = message(); candidate.id = bad; assert.throws(() => validateMessage(candidate)); }
});
test('nested private metadata cannot hide in a scalar substantive value', () => {
  const candidate = message(); candidate.outward.content.value = { selectedVibe: 'EA', asset: 'secret' };
  assert.throws(() => validateMessage(candidate));
});
test('duplicate observation identity rejects rather than supplying two competing received records', () => {
  const observation = observeMessage(message(), { id: 'observation_0001', observerId: 'actor_0002' });
  assert.throws(() => recipientHistory([observation, observation], 'actor_0002'));
});
test('neutral renamed participants and an absent actor work without fixed seats', () => {
  const candidate = message(); candidate.outward.senderId = 'actor_0042'; candidate.outward.recipientIds = ['actor_0066'];
  const observation = observeMessage(candidate, { id: 'observation_0020', observerId: 'actor_0066' });
  const packageActors = [{ id: 'actor_0042', label: 'Visitor' }, { id: 'actor_0066', label: 'Archivist' }, { id: 'actor_0099', label: 'Absent owner' }];
  const renamed = copy(packageActors); renamed.forEach((actor, i) => { actor.label = `Renamed ${i}`; });
  const receive = actors => listenerView({ actorId: actors[1].id, currentMessageId: candidate.id, observations: [observation], claims: [], profile });
  assert.deepEqual(receive(packageActors), receive(renamed));
  assert.equal(receive(packageActors).actorId, 'actor_0066');
  assert.equal(recipientHistory([observation], packageActors[2].id).length, 0);
});
test('NPC outward replies use the same canonical message envelope and hide their own private expression', () => {
  const reply = message(); reply.id = 'message_0002'; reply.outward.senderId = 'actor_0002'; reply.outward.recipientIds = ['actor_0001'];
  reply.outward.family = 'Remark'; reply.outward.act = 'explain_access';
  reply.outward.content = { kind: 'assertion', predicate: 'access_scope', value: 'relevant_records_only', timeScope: 'current_visit' };
  const received = observeMessage(reply, { id: 'observation_0003', observerId: 'actor_0001' });
  assert.equal(received.receivedDetails.communication.act, 'explain_access');
  assert.equal(Object.hasOwn(received.receivedDetails, 'privateComposition'), false);
  assert.ok(!canonicalJson(received).includes('selectedVibe'));
});
