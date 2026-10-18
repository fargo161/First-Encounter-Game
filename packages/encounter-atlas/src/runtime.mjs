import { ContractError, canonicalJson, copy, freeze, fields, id, integer, isRecord, packageRef, requireThat } from './contracts.mjs';

function validateCommand(command) {
  fields(command, ['schema', 'id', 'sessionId', 'packageRef', 'expectedRevision', 'kind', 'payload']);
  requireThat(command.schema === 'encounter-command@2'); id(command.id, 'command'); id(command.sessionId, 'run');
  packageRef(command.packageRef); integer(command.expectedRevision);
  requireThat(['send_message', 'perform_action'].includes(command.kind), 'UNSUPPORTED_COMMAND');
  requireThat(isRecord(command.payload));
}
export function validateRun(run) {
  canonicalJson(run);
  fields(run, ['schema', 'id', 'packageRef', 'revision', 'data', 'journal']);
  requireThat(run.schema === 'encounter-run@2'); id(run.id, 'run'); packageRef(run.packageRef); integer(run.revision);
  requireThat(isRecord(run.data) && Array.isArray(run.journal) && run.journal.length === run.revision);
  const used = new Set();
  for (const [index, entry] of run.journal.entries()) {
    fields(entry, ['command', 'receipt']); validateCommand(entry.command);
    fields(entry.receipt, ['commandId', 'committedRevision', 'result']);
    requireThat(!used.has(entry.command.id)); used.add(entry.command.id);
    requireThat(entry.command.sessionId === run.id && canonicalJson(entry.command.packageRef) === canonicalJson(run.packageRef));
    requireThat(entry.command.expectedRevision === index && entry.receipt.committedRevision === index + 1 && entry.receipt.commandId === entry.command.id);
  }
  return true;
}
export function createRun({ id: sessionId, packageRef: ref, data }) {
  const run = copy({ schema: 'encounter-run@2', id: sessionId, packageRef: ref, revision: 0, data, journal: [] });
  validateRun(run); return freeze(run);
}

/**
 * One synchronous local commit owner. Hooks receive copies, never live state.
 * M2 supplies domain resolution in the documented staged order; M1 tests use
 * neutral processors. The caller installs `run` only when status is committed.
 */
export function executeCommand(run, command, handlers) {
  const rejected = code => ({ status: 'rejected', code, run });
  try {
    validateRun(run);
    // One submitted snapshot owns identity before any callback can mutate aliases.
    const immutableCommand = freeze(copy(command));
    const serialized = canonicalJson(immutableCommand);
    id(immutableCommand.id, 'command'); id(immutableCommand.sessionId, 'run');
    requireThat(immutableCommand.sessionId === run.id, 'WRONG_SESSION');
    const prior = run.journal.find(entry => entry.command.id === immutableCommand.id);
    if (prior) {
      if (canonicalJson(prior.command) !== serialized) return rejected('IDENTITY_CONFLICT');
      return { status: 'replayed', run, receipt: freeze(copy(prior.receipt)) };
    }
    validateCommand(immutableCommand);
    requireThat(canonicalJson(immutableCommand.packageRef) === canonicalJson(run.packageRef), 'PACKAGE_MISMATCH');
    requireThat(immutableCommand.expectedRevision === run.revision, 'STALE_COMMAND');
    requireThat(isRecord(handlers) && ['validateNew', 'resolve', 'validateStaged'].every(key =>
      typeof handlers[key] === 'function' && handlers[key].constructor.name !== 'AsyncFunction'), 'INVALID_HANDLERS');
    requireThat(handlers.validateNew(freeze(copy(run.data)), immutableCommand) === true, 'INVALID_COMMAND');
    const staged = copy(run.data);
    const result = handlers.resolve(staged, immutableCommand);
    // JSON-only result excludes asynchronous resolution or opaque handles.
    canonicalJson(result); canonicalJson(staged);
    requireThat(handlers.validateStaged(freeze(copy(staged)), freeze(copy(result)), immutableCommand) === true, 'INVALID_COMMAND');
    const receipt = { commandId: immutableCommand.id, committedRevision: run.revision + 1, result: copy(result) };
    const next = { schema: run.schema, id: run.id, packageRef: copy(run.packageRef), revision: run.revision + 1,
      data: staged, journal: [...copy(run.journal), { command: immutableCommand, receipt }] };
    validateRun(next);
    return { status: 'committed', run: freeze(next), receipt: freeze(copy(receipt)) };
  } catch (error) {
    // Never turn an author exception/hidden source value into player feedback.
    const safeCodes = new Set(['WRONG_SESSION', 'PACKAGE_MISMATCH', 'STALE_COMMAND', 'UNSUPPORTED_COMMAND', 'INVALID_HANDLERS', 'INVALID_COMMAND']);
    return rejected(error instanceof ContractError && safeCodes.has(error.code) ? error.code : 'TECHNICAL_REJECTION');
  }
}
