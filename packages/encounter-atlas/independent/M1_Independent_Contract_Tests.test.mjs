import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const checkpoint = path.resolve(process.env.ENCOUNTER_CHECKPOINT ?? path.join(here, '../work/m1-review/checkpoint'));
const load = name => import(pathToFileURL(path.join(checkpoint, 'src', name)).href);
const C = await load('contracts.mjs');
const V = await load('views.mjs');
const R = await load('runtime.mjs');
const A = await load('action-boundary.mjs');
const clone = value => structuredClone(value);
const ref = { id: 'package_00aa', revision: 2, digest: 'b'.repeat(64) };
const profile = { roles: ['records_service'], priorities: { relevantService: 7, privacy: 9, verification: 8 } };
const hex = value => value.toString(16).padStart(4, '0');
function message(n = 1) {
  return { schema: 'encounter-message@2', id: `message_${hex(n)}`, commandId: `command_${hex(n)}`, sequence: n,
    contextMessageId: null,
    privateComposition: { selectedVibe: 'EA', selectedSalience: 'NUANCED', authorId: 'author_0010', templateId: 'template_0010', intendedFraming: 'Limit access to relevant records.' },
    outward: { family: 'Request', act: 'request_access', senderId: 'actor_0010', recipientIds: ['actor_0020'],
      subjectIds: ['subject_0010'], targetId: 'subject_0010', scope: { subjectId: 'subject_0010', kind: 'relevant_records' },
      content: { kind: 'request', predicate: 'inspect_relevant_entry', value: null, timeScope: 'current_entry' },
      framing: [{ kind: 'scope_limit', text: 'Requests only relevant handling records.', subjectIds: ['subject_0010'] }],
      prominence: 'measured', terms: null } };
}
function command(n = 1, revision = n - 1) {
  return { schema: 'encounter-command@2', id: `command_${hex(n)}`, sessionId: 'run_00aa', packageRef: clone(ref),
    expectedRevision: revision, kind: 'send_message', payload: { message: message(n) } };
}
const fresh = () => R.createRun({ id: 'run_00aa', packageRef: ref, data: { count: 0, events: [] } });
function hooks(counter = { calls: 0 }) {
  return { validateNew: () => true, resolve: (data, input) => {
    counter.calls++;
    data.count++;
    data.events.push({ commandId: input.id, sent: clone(input.payload.message) });
    return { count: data.count };
  }, validateStaged: data => data.count === data.events.length };
}
function heard(msg = message(), observerId = 'actor_0020', observationId = 'observation_0010') {
  return V.observeMessage(msg, { id: observationId, observerId });
}
function listener(msg = message(), extras = [], claims = []) {
  return V.listenerView({ actorId: 'actor_0020', currentMessageId: msg.id,
    observations: [heard(msg), ...extras], claims, profile });
}
function actionRequest() {
  return { commandId: 'command_000b', actorId: 'actor_0010', actionType: 'inspect_records',
    targetId: 'subject_0010', permissionId: 'permission_0010', expectedRevision: 0 };
}
function actionResult(request = actionRequest()) {
  return { id: 'result_0010', request: clone(request), outcome: 'performed',
    effects: [{ type: 'neutral_increment', payload: { amount: 1 } }],
    observerDetails: [{ observerId: 'actor_0010', details: { printedDetail: 'A neutral fixture result.' } },
      { observerId: 'actor_0020', details: { conduct: 'Inspects the permitted extract.' } }] };
}
const applyCounter = (data, effects, observers) => {
  data.count += effects[0].payload.amount;
  data.observations.push(...observers);
  return true;
};

test('I01: exact retry after multiple later commits returns original receipt without hooks', () => {
  const count = { calls: 0 }, h = hooks(count), firstInput = command();
  let result = R.executeCommand(fresh(), firstInput, h);
  const firstReceipt = clone(result.receipt);
  for (let n = 2; n <= 4; n++) result = R.executeCommand(result.run, command(n), h);
  const before = JSON.stringify(result.run);
  const replay = R.executeCommand(result.run, firstInput, { get resolve() { throw Error('must not inspect hooks'); } });
  assert.equal(replay.status, 'replayed');
  assert.deepEqual(replay.receipt, firstReceipt);
  assert.equal(JSON.stringify(replay.run), before);
  assert.equal(count.calls, 4);
});
test('I02: all tested immutable-payload collisions reject before hooks or staleness', () => {
  const first = R.executeCommand(fresh(), command(), hooks());
  for (const mutate of [c => c.payload.message.privateComposition.selectedVibe = 'DE',
    c => c.expectedRevision = 1, c => c.packageRef.revision++, c => c.kind = 'perform_action',
    c => c.payload.message.outward.content.value = 'changed']) {
    const input = command(); mutate(input);
    const result = R.executeCommand(first.run, input, null);
    assert.equal(result.code, 'IDENTITY_CONFLICT'); assert.strictEqual(result.run, first.run);
  }
});
test('I03: a new stale identity is rejected with no fictional event or resolver call', () => {
  const count = { calls: 0 }, h = hooks(count);
  const first = R.executeCommand(fresh(), command(), h);
  const result = R.executeCommand(first.run, command(2, 0), h);
  assert.equal(result.code, 'STALE_COMMAND'); assert.strictEqual(result.run, first.run);
  assert.equal(count.calls, 1); assert.equal(result.run.data.events.length, 1);
});
test('I04: preflight, stage exceptions, and invariant failures roll back and suppress hidden diagnostics', () => {
  for (const phase of ['preflight', 'resolve', 'postflight']) {
    const run = fresh(), h = hooks(), before = JSON.stringify(run);
    if (phase === 'preflight') h.validateNew = () => false;
    if (phase === 'resolve') h.resolve = data => { data.count = 50; throw Error('PRIVATE-ERROR-CANARY'); };
    if (phase === 'postflight') h.validateStaged = () => false;
    const result = R.executeCommand(run, command(), h);
    assert.equal(result.status, 'rejected'); assert.strictEqual(result.run, run);
    assert.equal(JSON.stringify(run), before); assert.ok(!JSON.stringify(result).includes('PRIVATE-ERROR-CANARY'));
  }
});
test('I05: a valid social refusal records hearing while material state stays unchanged', () => {
  const h = hooks(); h.resolve = (data, input) => {
    data.count++; data.events.push({ commandId: input.id, type: 'message_received' });
    return { outcome: 'social_refusal', materialEffects: [] };
  };
  const result = R.executeCommand(fresh(), command(), h);
  assert.equal(result.status, 'committed'); assert.equal(result.run.data.events[0].type, 'message_received');
  assert.deepEqual(result.receipt.result.materialEffects, []);
});
test('I06: restored journals retain retry protection and corrupted revision chains reject', () => {
  const first = R.executeCommand(fresh(), command(), hooks());
  const restored = JSON.parse(JSON.stringify(first.run));
  assert.equal(R.executeCommand(restored, command(), null).status, 'replayed');
  for (const mutate of [r => r.journal[0].receipt.committedRevision = 9,
    r => r.journal[0].command.expectedRevision = 9, r => r.revision = 2,
    r => r.journal[0].command.sessionId = 'run_00bb']) {
    const damaged = clone(restored); mutate(damaged); assert.throws(() => R.validateRun(damaged));
  }
});
test('I07: escaped staged-state and result aliases cannot mutate the committed run', () => {
  let capturedState, capturedResult;
  const h = hooks(); h.resolve = (data, input) => {
    capturedState = data; data.count++; data.events.push({ commandId: input.id });
    capturedResult = { nested: { value: 1 } }; return capturedResult;
  };
  const result = R.executeCommand(fresh(), command(), h);
  assert.throws(() => capturedState.count++, TypeError);
  capturedResult.nested.value = 99;
  assert.equal(result.receipt.result.nested.value, 1);
});
test('I08: createRun detaches package identity and starting data from later author edits', () => {
  const packageIdentity = clone(ref), data = { count: 0, events: [] };
  const run = R.createRun({ id: 'run_00aa', packageRef: packageIdentity, data });
  packageIdentity.revision = 99; data.count = 99;
  assert.equal(run.packageRef.revision, 2); assert.equal(run.data.count, 0);
});
test('I09: repeated preview/history/inspector reads do not change source records or a run', () => {
  const msg = message(), run = fresh(), before = JSON.stringify({ msg, run });
  for (let i = 0; i < 20; i++) {
    const preview = V.previewView(msg), history = V.recipientHistory([heard(msg)], 'actor_0020'), inspector = V.authorInspector(run);
    assert.throws(() => preview.outward.content.value = 'altered', TypeError);
    assert.ok(Object.isFrozen(history[0].receivedDetails)); assert.ok(Object.isFrozen(inspector.data));
  }
  assert.equal(JSON.stringify({ msg, run }), before);
});
test('I10: all 60 private vibe/salience perturbations preserve the complete M1 listener view', () => {
  const baseline = listener();
  for (const vibe of Object.keys(C.BASED_CATALOG)) for (const salience of C.SALIENCE) {
    const msg = message(); Object.assign(msg.privateComposition, {
      selectedVibe: vibe, selectedSalience: salience, templateId: 'template_00bb', intendedFraming: 'PRIVATE-FRAMING-CANARY' });
    assert.deepEqual(listener(msg), baseline);
    assert.ok(!JSON.stringify(listener(msg)).includes('PRIVATE-FRAMING-CANARY'));
  }
});
test('I11: an actually performed distinctive cue is preserved as legitimate outward information', () => {
  const msg = message(); msg.outward.framing = [{ kind: 'displayed_alignment', text: 'Invites reliance on this displayed concern.', subjectIds: ['subject_0010'] }];
  assert.equal(listener(msg).incoming.framing[0].text, msg.outward.framing[0].text);
});
test('I12: hidden selector/template/cache additions and nested private substantive values reject', () => {
  for (const key of ['selectedVibe', 'selectedSalience', 'templateId', 'assetId', 'cacheKey', 'trueHumanObjective']) {
    const msg = message(); msg.outward[key] = 'SECRET'; assert.throws(() => C.validateMessage(msg));
    const nested = message(); nested.outward.framing[0][key] = 'SECRET'; assert.throws(() => C.validateMessage(nested));
  }
  const msg = message(); msg.outward.content.value = { selectedVibe: 'DE' }; assert.throws(() => C.validateMessage(msg));
});
test('I13: every supported opaque source-kind lookup returns only explicitly received details', () => {
  for (const [kind, sourceId] of [['event', 'event_00aa'], ['action_result', 'result_00aa'], ['message', 'message_00aa']]) {
    const project = hidden => V.projectObservation({ kind, id: sourceId, sequence: 2,
      details: { conduct: 'Observed conduct.', smallPrint: hidden, privateContact: { secret: hidden } } },
      { id: 'observation_0020', observerId: 'actor_0020', channel: 'sight', receivedKeys: ['conduct'], roots: [{ kind, id: sourceId }] });
    const one = listener(message(), [project('FIRST-SECRET')]), two = listener(message(), [project('SECOND-SECRET')]);
    assert.deepEqual(one, two);
    const retrieved = V.readObservedSource(one, { kind, id: sourceId });
    assert.deepEqual(retrieved[0].receivedDetails, { conduct: 'Observed conduct.' });
    assert.ok(!JSON.stringify(one).includes('SECRET'));
  }
  assert.deepEqual(V.readObservedSource(listener(), { kind: 'event', id: 'event_ffff' }), []);
});
test('I14: another actor and an absent actor have no path to this addressed communication', () => {
  assert.throws(() => heard(message(), 'actor_0030'));
  assert.deepEqual(V.recipientHistory([heard()], 'actor_0030'), []);
  const other = V.projectObservation({ kind: 'event', id: 'event_0030', sequence: 0, details: { hidden: 'OTHER-ACTOR-SECRET' } },
    { id: 'observation_0030', observerId: 'actor_0030', channel: 'initial', receivedKeys: ['hidden'], roots: [{ kind: 'event', id: 'event_0030' }] });
  assert.deepEqual(listener(message(), [other]), listener());
});
test('I15: only an actually heard matching assertion enters claims; canonical message stays intact', () => {
  const msg = message(); Object.assign(msg.outward, { family: 'Remark', act: 'challenge_record' });
  msg.outward.content = { kind: 'assertion', predicate: 'recipient_signature', value: 'unfilled', timeScope: 'current_entry' };
  const original = JSON.stringify(msg);
  const claim = { id: 'claim_0010', speakerId: 'actor_0010', recipientIds: ['actor_0020'], messageId: msg.id,
    proposition: { subjectId: 'subject_0010', ...msg.outward.content }, observationIds: ['observation_0010'], roots: [{ kind: 'message', id: msg.id }] };
  delete claim.proposition.kind;
  assert.equal(listener(msg, [], [claim]).claims.length, 1);
  const falseAttribution = clone(claim); falseAttribution.proposition.value = 'filled';
  assert.equal(listener(msg, [], [falseAttribution]).claims.length, 0);
  assert.equal(listener(msg).observations[0].channel, 'hearing');
  assert.equal(JSON.stringify(msg), original); assert.equal(Object.hasOwn(listener(msg), 'worldFacts'), false);
});
test('I16: typed neutral IDs and renamed arbitrary actors work without mandatory player/NPC seats', () => {
  for (const bad of ['message_Tamsin', 'message_feigning', 'message_seed_a']) {
    const msg = message(); msg.id = bad; assert.throws(() => C.validateMessage(msg));
  }
  const msg = message(); msg.outward.senderId = 'actor_00aa'; msg.outward.recipientIds = ['actor_00bb'];
  const obs = heard(msg, 'actor_00bb');
  assert.equal(V.listenerView({ actorId: 'actor_00bb', currentMessageId: msg.id, observations: [obs], claims: [], profile }).actorId, 'actor_00bb');
  assert.deepEqual(V.recipientHistory([obs], 'actor_00cc'), []);
});
test('I17: permission validation alone produces no inspection or receiving observation', () => {
  const data = { permissions: [{ id: 'permission_0010', granteeId: 'actor_0010', grantorId: 'actor_0020', actionType: 'inspect_records',
    targetId: 'subject_0010', scope: 'relevant_records', status: 'allowed', sourceMessageId: 'message_0001' }], observations: [], actionResults: [] };
  const before = JSON.stringify(data); assert.equal(C.validatePermission(data.permissions[0]), true);
  assert.equal(JSON.stringify(data), before); assert.equal(data.actionResults.length, 0);
});
test('I18: ordinary matched-result redelivery and command retry apply one neutral effect', () => {
  const request = actionRequest(), result = actionResult(request);
  const data = { count: 0, observations: [], actionResults: [] };
  const first = A.stageMatchedResult(data, request, result, ['neutral_increment'], applyCounter);
  const repeat = A.stageMatchedResult(first.data, request, clone(result), ['neutral_increment'], () => { throw Error('duplicate'); });
  assert.equal(repeat.replayed, true); assert.equal(repeat.data.count, 1); assert.equal(data.count, 0);
  const run = R.createRun({ id: 'run_00aa', packageRef: ref, data });
  const input = command(11, 0); input.kind = 'perform_action'; input.payload = { request };
  const h = { validateNew: () => true, resolve: staged => {
    Object.assign(staged, A.stageMatchedResult(staged, request, result, ['neutral_increment'], applyCounter).data);
    return { resultId: result.id };
  }, validateStaged: () => true };
  const commit = R.executeCommand(run, input, h), retry = R.executeCommand(commit.run, input, null);
  assert.equal(commit.status, 'committed'); assert.equal(retry.status, 'replayed'); assert.equal(retry.run.data.count, 1);
  assert.equal(retry.run.data.observations.find(o => o.observerId === 'actor_0020').details.printedDetail, undefined);
});
test('I19: result mismatch, changed identity, and failed effect application preserve caller data', () => {
  const data = { count: 0, observations: [], actionResults: [] }, before = JSON.stringify(data);
  const mismatch = actionResult(); mismatch.request.targetId = 'subject_0020';
  assert.throws(() => A.stageMatchedResult(data, actionRequest(), mismatch, ['neutral_increment'], applyCounter));
  assert.throws(() => A.stageMatchedResult(data, actionRequest(), actionResult(), ['neutral_increment'], staged => { staged.count = 90; throw Error('failed'); }));
  assert.equal(JSON.stringify(data), before);
  const first = A.stageMatchedResult(data, actionRequest(), actionResult(), ['neutral_increment'], applyCounter);
  const changed = actionResult(); changed.id = 'result_0020';
  assert.throws(() => A.stageMatchedResult(first.data, actionRequest(), changed, ['neutral_increment'], applyCounter));
});
test('I20: unsupported exchange execution and legacy run formats are rejected explicitly', () => {
  const msg = message(); msg.outward.family = 'Offer'; msg.outward.act = 'propose_exchange';
  assert.throws(() => C.validateMessage(msg), error => error.code === 'UNIMPLEMENTED_ACT');
  assert.throws(() => R.validateRun({ version: 'encounter-session@1' }));
  const input = command(); input.kind = 'confirm_exchange';
  assert.equal(R.executeCommand(fresh(), input, hooks()).code, 'UNSUPPORTED_COMMAND');
});

test('D01-A: journaling must preserve the frozen command actually resolved despite a mutable caller alias', () => {
  const input = command(), submitted = clone(input), h = hooks();
  h.validateNew = () => { input.payload.message.privateComposition.selectedVibe = 'DE'; return true; };
  const first = R.executeCommand(fresh(), input, h);
  assert.equal(first.status, 'committed');
  assert.equal(first.run.data.events[0].sent.privateComposition.selectedVibe, 'EA');
  const retry = R.executeCommand(first.run, submitted, null);
  assert.equal(retry.status, 'replayed', `Original exact retry became ${retry.status}/${retry.code}; journal now contains ${first.run.journal[0].command.payload.message.privateComposition.selectedVibe}`);
});
test('D01-B: effect callback aliases must not rewrite stored result identity and enable duplicate application', () => {
  const request = actionRequest(), result = actionResult(request), submitted = clone(result);
  const data = { count: 0, observations: [], actionResults: [] };
  const first = A.stageMatchedResult(data, request, result, ['neutral_increment'], (staged, effects, observers) => {
    applyCounter(staged, effects, observers);
    result.id = 'result_00ff'; result.request.commandId = 'command_00ff';
    return true;
  });
  const retry = A.stageMatchedResult(first.data, request, submitted, ['neutral_increment'], applyCounter);
  assert.equal(retry.data.count, 1, `Original result redelivery applied ${retry.data.count} effects; first result was stored as ${first.data.actionResults[0].id}/${first.data.actionResults[0].request.commandId}`);
});
