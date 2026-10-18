import { canonicalJson, copy, freeze, requireThat, validateMatchedResult } from './contracts.mjs';

/**
 * Pure staging helper, never installs state. Adapter is local/synchronous and
 * applies supported effects to a copy. Runtime owns the eventual whole commit.
 * No physical action resolver or scenario action exists at M1.
 */
export function stageMatchedResult(data, request, result, supportedEffectTypes, apply) {
  const { request: immutableRequest, result: immutableResult } = freeze(copy({ request, result }));
  validateMatchedResult(immutableRequest, immutableResult, supportedEffectTypes);
  const next = copy(data);
  requireThat(Array.isArray(next.actionResults), 'INVALID_RESULT_STORE');
  const prior = next.actionResults.find(r => r.id === immutableResult.id || r.request.commandId === immutableRequest.commandId);
  if (prior) {
    requireThat(canonicalJson(prior) === canonicalJson(immutableResult), 'RESULT_IDENTITY_CONFLICT');
    return { data: next, replayed: true };
  }
  requireThat(typeof apply === 'function' && apply.constructor.name !== 'AsyncFunction');
  requireThat(apply(next, copy(immutableResult.effects), copy(immutableResult.observerDetails)) === true);
  next.actionResults.push(immutableResult);
  canonicalJson(next);
  return { data: next, replayed: false };
}
