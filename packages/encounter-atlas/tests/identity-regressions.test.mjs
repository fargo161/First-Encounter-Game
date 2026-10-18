import test from 'node:test';
import assert from 'node:assert/strict';
import { copy } from '../src/contracts.mjs';
import { createRun, executeCommand } from '../src/runtime.mjs';
import { stageMatchedResult } from '../src/action-boundary.mjs';
import { command, ref, actionRequest, actionResult } from './fixtures.mjs';

test('D01-A regression: caller aliases cannot change the command resolved, receipted or journaled', () => {
  for (const phase of ['validateNew', 'resolve', 'validateStaged']) {
    const input = command(), submitted = copy(input);
    const run = createRun({ id: 'run_0001', packageRef: ref, data: { count: 0, events: [] } });
    let calls = 0;
    const mutateCallerAlias = () => {
      input.id = 'command_00ff'; input.expectedRevision = 99;
      input.payload.message.privateComposition.selectedVibe = 'DE';
    };
    const handlers = {
      validateNew: (_, received) => { assert.deepEqual(received, submitted); if (phase === 'validateNew') mutateCallerAlias(); return true; },
      resolve: (staged, received) => {
        calls++; staged.count++;
        staged.events.push({ commandId: received.id, submitted: copy(received) });
        if (phase === 'resolve') mutateCallerAlias();
        return { commandId: received.id };
      },
      validateStaged: (_, __, received) => { assert.deepEqual(received, submitted); if (phase === 'validateStaged') mutateCallerAlias(); return true; }
    };
    const first = executeCommand(run, input, handlers);
    assert.equal(first.status, 'committed', phase);
    assert.equal(input.id, 'command_00ff'); // Original stays mutable; it is not authoritative.
    assert.deepEqual(first.run.data.events[0].submitted, submitted);
    assert.deepEqual(first.run.journal[0].command, submitted);
    assert.equal(first.receipt.commandId, submitted.id);
    assert.equal(first.receipt.result.commandId, submitted.id);
    assert.equal(first.run.journal[0].command.payload.message.privateComposition.selectedVibe, 'EA');
    const retry = executeCommand(first.run, submitted, null);
    assert.equal(retry.status, 'replayed'); assert.deepEqual(retry.receipt, first.receipt);
    assert.equal(retry.run.data.count, 1); assert.equal(calls, 1); assert.equal(run.data.count, 0);
    const collision = copy(submitted); collision.payload.message.privateComposition.selectedVibe = 'DE';
    assert.equal(executeCommand(first.run, collision, null).code, 'IDENTITY_CONFLICT');
    const stale = copy(submitted); stale.id = 'command_0002';
    assert.equal(executeCommand(first.run, stale, null).code, 'STALE_COMMAND');
  }
});

test('D01-B regression: caller request/result alias mutation cannot disguise an applied result', () => {
  const request = actionRequest(), result = actionResult();
  const submittedRequest = copy(request), submittedResult = copy(result);
  const data = { count: 0, observations: [], actionResults: [] }, before = copy(data);
  let calls = 0;
  const first = stageMatchedResult(data, request, result, ['neutral_increment'], (staged, effects, observers) => {
    calls++; staged.count += effects[0].payload.amount; staged.observations.push(...observers);
    result.id = 'result_00ff'; result.request.commandId = 'command_00ff'; request.commandId = 'command_00ff';
    return true;
  });
  assert.deepEqual(data, before); assert.equal(first.data.count, 1);
  assert.deepEqual(first.data.actionResults, [submittedResult]);
  assert.equal(result.id, 'result_00ff'); // Mutation is visible only to its caller.
  const retry = stageMatchedResult(first.data, submittedRequest, submittedResult, ['neutral_increment'], () => {
    throw Error('an exact result retry must not apply effects');
  });
  assert.equal(retry.replayed, true); assert.equal(retry.data.count, 1); assert.equal(calls, 1);
  const changedBytes = copy(submittedResult); changedBytes.effects[0].payload.amount = 2;
  assert.throws(() => stageMatchedResult(first.data, submittedRequest, changedBytes, ['neutral_increment'], () => true));
  const secondResult = copy(submittedResult); secondResult.id = 'result_0002';
  assert.throws(() => stageMatchedResult(first.data, submittedRequest, secondResult, ['neutral_increment'], () => true));
  assert.deepEqual(first.data.actionResults, [submittedResult]); assert.equal(first.data.count, 1);
  assert.throws(() => stageMatchedResult(data, submittedRequest, submittedResult, ['neutral_increment'], staged => {
    staged.count++; throw Error('failed staging must not publish state');
  }));
  assert.deepEqual(data, before);
});
