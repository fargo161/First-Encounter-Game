import { copy } from '../src/contracts.mjs';
export const ref = { id: 'package_0001', revision: 1, digest: 'a'.repeat(64) };
export const profile = { roles: ['record_custodian'], priorities: { relevantService: 10, privacy: 10, verification: 8 } };
export function message() {
  return { schema: 'encounter-message@2', id: 'message_0001', commandId: 'command_0001', sequence: 1, contextMessageId: null,
    privateComposition: { selectedVibe: 'EA', selectedSalience: 'NUANCED', authorId: 'author_0001', templateId: 'template_0001', intendedFraming: 'Limit the request to relevant records.' },
    outward: { family: 'Request', act: 'request_access', senderId: 'actor_0001', recipientIds: ['actor_0002'], subjectIds: ['subject_0001'], targetId: 'subject_0001',
      scope: { subjectId: 'subject_0001', kind: 'relevant_records' }, content: { kind: 'request', predicate: 'inspect_relevant_entry', value: null, timeScope: 'current_entry' },
      framing: [{ kind: 'scope_limit', text: 'Requests only records relevant to this item.', subjectIds: ['subject_0001'] }], prominence: 'measured', terms: null } };
}
export function command(overrides = {}) {
  return { schema: 'encounter-command@2', id: 'command_0001', sessionId: 'run_0001', packageRef: copy(ref), expectedRevision: 0, kind: 'send_message', payload: { message: message() }, ...overrides };
}
export function actionRequest() { return { commandId: 'command_0002', actorId: 'actor_0001', actionType: 'inspect_records', targetId: 'subject_0001', permissionId: 'permission_0001', expectedRevision: 1 }; }
export function actionResult() {
  return { id: 'result_0001', request: actionRequest(), outcome: 'performed', effects: [{ type: 'neutral_increment', payload: { amount: 1 } }],
    observerDetails: [{ observerId: 'actor_0001', details: { printedDetail: 'Unfilled recipient field.' } }, { observerId: 'actor_0002', details: { conduct: 'Inspects the permitted extract.' } }] };
}
export function neutralHandlers(counter = { calls: 0 }) {
  return { validateNew: () => true,
    resolve: (data, received) => { counter.calls++; data.count++; data.events.push({ id: `event_${String(data.count).padStart(4, '0')}`, commandId: received.id }); return { count: data.count }; },
    validateStaged: data => data.count === data.events.length };
}
