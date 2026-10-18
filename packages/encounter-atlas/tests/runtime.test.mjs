import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalJson, copy } from '../src/contracts.mjs';
import { createRun, executeCommand, validateRun } from '../src/runtime.mjs';
import { command, neutralHandlers, ref } from './fixtures.mjs';
const fresh = () => createRun({ id: 'run_0001', packageRef: ref, data: { count: 0, events: [] } });

test('new valid command stages once; caller state remains unchanged', () => {
  const before = fresh(), input = command(), result = executeCommand(before, input, neutralHandlers());
  assert.equal(result.status, 'committed'); assert.equal(result.run.revision, 1); assert.equal(result.run.data.count, 1);
  assert.equal(before.data.count, 0); assert.equal(before.journal.length, 0); assert.equal(validateRun(result.run), true);
  assert.deepEqual(input, command());
});
test('REQUIRED: identical committed retry returns saved receipt before stale revision check', () => {
  const counter = { calls: 0 }, hooks = neutralHandlers(counter), input = command();
  const first = executeCommand(fresh(), input, hooks);
  const second = executeCommand(first.run, input, hooks);
  assert.equal(second.status, 'replayed'); assert.deepEqual(second.receipt, first.receipt);
  assert.strictEqual(second.run, first.run); assert.equal(counter.calls, 1); assert.equal(second.run.data.events.length, 1);
});
test('REQUIRED: same identity and changed payload rejects as conflict even when stale', () => {
  const first = executeCommand(fresh(), command(), neutralHandlers());
  const changed = command(); changed.payload.message.privateComposition.selectedVibe = 'SE';
  const result = executeCommand(first.run, changed, neutralHandlers());
  assert.equal(result.code, 'IDENTITY_CONFLICT'); assert.strictEqual(result.run, first.run);
});
test('REQUIRED: a new identity with obsolete revision rejects without any effect', () => {
  const counter = { calls: 0 }, hooks = neutralHandlers(counter);
  const first = executeCommand(fresh(), command(), hooks), before = canonicalJson(first.run);
  const result = executeCommand(first.run, command({ id: 'command_0002' }), hooks);
  assert.equal(result.code, 'STALE_COMMAND'); assert.equal(canonicalJson(result.run), before); assert.equal(counter.calls, 1);
});
test('identity conflict is resolved before new-envelope support validation', () => {
  const first = executeCommand(fresh(), command(), neutralHandlers());
  const result = executeCommand(first.run, command({ kind: 'unsupported' }), neutralHandlers());
  assert.equal(result.code, 'IDENTITY_CONFLICT');
});
test('object field ordering is irrelevant; arrays retain their order', () => {
  const first = executeCommand(fresh(), command(), neutralHandlers());
  const reordered = Object.fromEntries(Object.entries(command()).reverse());
  assert.equal(executeCommand(first.run, reordered, neutralHandlers()).status, 'replayed');
  const changed = command(); changed.payload.message.outward.subjectIds.push('subject_0002');
  assert.equal(executeCommand(first.run, changed, neutralHandlers()).code, 'IDENTITY_CONFLICT');
});
test('a deliberate repeat with current revision and new identity is a new command', () => {
  const first = executeCommand(fresh(), command(), neutralHandlers());
  const input = command({ id: 'command_0002', expectedRevision: 1 });
  input.payload.message.id = 'message_0002'; input.payload.message.commandId = input.id;
  const result = executeCommand(first.run, input, neutralHandlers());
  assert.equal(result.status, 'committed'); assert.equal(result.run.data.events.length, 2);
});
test('staged failure rolls back all events and exposes no hidden exception text', () => {
  const run = fresh(), hooks = neutralHandlers();
  hooks.resolve = data => { data.count = 90; data.events.push({ secret: 'hidden-address-canary' }); throw Error('hidden-address-canary'); };
  const result = executeCommand(run, command(), hooks);
  assert.equal(result.status, 'rejected'); assert.strictEqual(result.run, run); assert.equal(run.data.count, 0);
  assert.ok(!canonicalJson(result).includes('hidden-address-canary'));
});
test('invariant failure after staging also leaves original session untouched', () => {
  const run = fresh(), hooks = neutralHandlers(); hooks.validateStaged = () => false;
  const result = executeCommand(run, command(), hooks);
  assert.equal(result.status, 'rejected'); assert.strictEqual(result.run, run); assert.equal(run.journal.length, 0);
});
test('preflight rejection creates no fictional initiating occurrence', () => {
  const counter = { calls: 0 }, hooks = neutralHandlers(counter); hooks.validateNew = () => false;
  const result = executeCommand(fresh(), command(), hooks);
  assert.equal(result.status, 'rejected'); assert.equal(counter.calls, 0); assert.equal(result.run.data.events.length, 0);
});
test('valid social refusal can commit receipt and hearing without executing an exchange', () => {
  const hooks = neutralHandlers(); hooks.resolve = data => { data.count++; data.events.push({ type: 'message_received' }); return { outcome: 'social_refusal', materialEffects: [] }; };
  const result = executeCommand(fresh(), command(), hooks);
  assert.equal(result.status, 'committed'); assert.equal(result.receipt.result.outcome, 'social_refusal');
  assert.equal(result.run.data.events.length, 1); assert.deepEqual(result.receipt.result.materialEffects, []);
});
test('journal JSON round trip preserves committed retry protection', () => {
  const first = executeCommand(fresh(), command(), neutralHandlers());
  const restored = copy(first.run); assert.equal(validateRun(restored), true);
  const hooks = neutralHandlers(); hooks.resolve = () => { throw Error('must not run'); };
  assert.equal(executeCommand(restored, command(), hooks).status, 'replayed');
});
test('new wrong package and wrong session fail safely', () => {
  assert.equal(executeCommand(fresh(), command({ packageRef: { ...ref, revision: 2 } }), neutralHandlers()).code, 'PACKAGE_MISMATCH');
  assert.equal(executeCommand(fresh(), command({ sessionId: 'run_0002' }), neutralHandlers()).code, 'WRONG_SESSION');
});
test('unsupported confirmation and asynchronous resolver are not implicit implementations', () => {
  assert.equal(executeCommand(fresh(), command({ kind: 'confirm_exchange' }), neutralHandlers()).code, 'UNSUPPORTED_COMMAND');
  const hooks = neutralHandlers(); hooks.resolve = async () => ({});
  assert.equal(executeCommand(fresh(), command(), hooks).code, 'INVALID_HANDLERS');
});
test('commands and returned receipts cannot be mutated through callback aliases', () => {
  const hooks = neutralHandlers(); let captured;
  hooks.resolve = data => { data.count++; data.events.push({ type: 'neutral' }); captured = { nested: { value: 1 } }; return captured; };
  const result = executeCommand(fresh(), command(), hooks); captured.nested.value = 7;
  assert.equal(result.receipt.result.nested.value, 1);
  assert.throws(() => { result.receipt.result.nested.value = 9; }, TypeError);
});
