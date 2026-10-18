import fs from 'node:fs/promises';
import { sealPackage } from '../src/m3/types.mjs';
import * as E from '../src/m3/engine.mjs';
import { draft,evidenceKey,markNoticeDisplayed } from '../src/m3/meaning.mjs';
export { E,draft,evidenceKey,markNoticeDisplayed };
export const authored=JSON.parse(await fs.readFile(new URL('../content/m3/seed.json',import.meta.url),'utf8'));
export const pkg=await sealPackage(authored);
export const rule=pkg.content.initial.rule;
export function commit(run,command,sealed=pkg){const r=E.dispatch(run,sealed,command);if(r.status!=='committed')throw Error(`${r.code} at revision ${run.revision} / ${command.kind} / ${command.payload.operation??command.payload.draft?.act}`);return r.run;}
export function send(run,input,sealed=pkg,{display=true}={}){let c=E.prepareSend(run,sealed,input);if(c.payload.preview.notice&&display)c=markNoticeDisplayed(c);return commit(run,c,sealed);}
export function action(run,id,sealed=pkg){return commit(run,E.prepareAction(run,sealed,id),sealed);}
export function partner(run,id,sealed=pkg){return commit(run,E.prepareSessionOperation(run,sealed,'switch_partner',id),sealed);}
export function request(run,operation='inspect',extra={},sealed=pkg){const r=sealed.content.initial.rule;return send(run,draft('request_access',{operation,targetId:r.recordId,scopeId:E.playerView(run).rule?.relevantScopeId??r.recordId,...extra}),sealed);}
export async function opened(sealed=pkg){let run=await E.startEncounter(sealed);run=action(run,sealed.content.initial.rule.verifyActionId,sealed);return request(run,'inspect',{},sealed);}
export async function learned(sealed=pkg){const r=sealed.content.initial.rule;let run=await opened(sealed);for(const id of r.inspectionActionIds)run=action(run,id,sealed);run=partner(run,r.witnessId,sealed);run=send(run,draft('ask_whereabouts',{operation:'ask',targetId:r.itemId,scopeId:r.itemId}),sealed);run=partner(run,r.custodianId,sealed);return run;}
export async function restricted(sealed=pkg,{withEvidence=true}={}){const r=sealed.content.initial.rule;let run=withEvidence?await learned(sealed):await opened(sealed);run=send(run,draft('ask_whereabouts',{operation:'ask',targetId:r.ownerTopicId,scopeId:r.ownerTopicId}),sealed);return request(run,'inspect',{scopeId:r.wholeScopeId},sealed);}
export function showAll(run,sealed=pkg){const r=sealed.content.initial.rule;return send(run,draft('present_evidence',{operation:'show',targetId:r.recordId,scopeId:r.relevantScopeId,evidenceKeys:E.playerView(run).evidence.map(evidenceKey)}),sealed);}
export async function compared(sealed=pkg){let run=await learned(sealed);run=showAll(run,sealed);return action(run,sealed.content.initial.rule.comparisonActionId,sealed);}
export async function recovered(sealed=pkg){let run=await compared(sealed);run=action(run,sealed.content.initial.rule.correctionActionId,sealed);return commit(run,E.prepareConfirmation(run,sealed),sealed);}
