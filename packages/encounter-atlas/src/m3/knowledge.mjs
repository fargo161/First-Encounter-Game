import { copy, freeze, canonicalJson } from './types.mjs';
import { recipientHistory, readObservedSource } from '../views.mjs';
import { evidenceKey } from './meaning.mjs';

export function receivedEvidence(observations){
 const entries=[];for(const o of observations)for(const e of o.receivedDetails.evidence??[])entries.push({...copy(e),observationId:o.id});return entries;
}
export function uniqueEvidence(observations){
 const map=new Map();for(const e of receivedEvidence(observations)){const {observationId,...value}=e;map.set(evidenceKey(e),value);}return [...map.values()];
}
export function actorView(data,actorId,incoming=null){
 const observations=recipientHistory(data.observations,actorId),rule=observations.find(o=>o.receivedDetails.serviceRule)?.receivedDetails.serviceRule??null;
 const authority=observations.flatMap(o=>o.receivedDetails.authority?[o.receivedDetails.authority]:[]).find(a=>a.verified&&a.itemId===rule?.itemId)??null;
 const visit=data.visits.find(v=>v.holderId===actorId)??null;
 const localIds=new Set(observations.map(o=>o.id));
 return freeze({actorId,profile:copy(data.profiles[actorId]),observations:copy(observations),rule:copy(rule),authority:copy(authority),incoming:copy(incoming),
  evidence:uniqueEvidence(observations),beliefs:data.beliefs.filter(b=>b.holderId===actorId).map(copy),hypotheses:data.hypotheses.filter(h=>h.holderId===actorId).map(copy),
  claims:data.claims.filter(c=>c.recipientIds.includes(actorId)&&c.observationIds.every(id=>localIds.has(id))).map(copy),visit:copy(visit),
  comparison:observations.some(o=>o.receivedDetails.comparison?.complete),
  recovered:observations.some(o=>o.receivedDetails.handover?.complete),
  serviceClosed:observations.some(o=>o.receivedDetails.service?.open===false),
  reportedAccount:observations.find(o=>o.receivedDetails.accountInterpretation)?.receivedDetails.accountInterpretation??null});
}
export { readObservedSource };
export function qualifiesEvidence(rule,evidence){return rule.requiredEvidence.every(req=>evidence.some(e=>e.subjectId===req.subjectId&&e.predicate===req.predicate&&req.forms.includes(e.form)));}
export function recomputeBeliefs(data,actorId,allocate){
 // Human knowledge is an observation projection, never simulated acceptance.
 if(!Object.hasOwn(data.profiles,actorId))return;
 const local=data.observations.filter(o=>o.observerId===actorId),marks=new Set(local.flatMap(o=>o.receivedDetails.recognizedMarks??[]));
 const candidates=receivedEvidence(local),questions=new Map();
 for(const e of candidates){const key=[e.subjectId,e.predicate].join('|');if(!questions.has(key))questions.set(key,[]);questions.get(key).push(e);}
 for(const [key,group] of questions){
  const rated=group.map(e=>({e,support:e.form==='direct'?5:e.form==='document'&&marks.has(e.markId)?4:e.form==='inference'?1:2}));
  const best=Math.max(...rated.map(x=>x.support)),leaders=rated.filter(x=>x.support===best),values=new Set(leaders.map(x=>canonicalJson(x.e.value)));
  const threshold=data.profiles[actorId]?.acceptanceThreshold??3;
  const stance=values.size>1?'disputed':best>=threshold?'accepted':'suspected';const value=values.size>1?null:copy(leaders[0].e.value);
  const current=data.beliefs.find(b=>b.holderId===actorId&&b.question===key);
  const update={stance,value,support:best,observationIds:[...new Set(group.map(e=>e.observationId))],roots:[...new Map(group.flatMap(e=>e.roots).map(r=>[canonicalJson(r),copy(r)])).values()]};
  if(current){if(canonicalJson({...update})!==canonicalJson({stance:current.stance,value:current.value,support:current.support,observationIds:current.observationIds,roots:current.roots})){current.history.push({revision:data.sequence,priorStance:current.stance,priorValue:copy(current.value),causeObservationIds:copy(update.observationIds)});Object.assign(current,update);}}
  else data.beliefs.push({id:allocate('belief'),holderId:actorId,question:key,subjectId:group[0].subjectId,predicate:group[0].predicate,...update,history:[]});
 }
}
export function privacySupport(view){
 const r=view.rule;if(!r)return {ready:false,support:[]};
 const explanations=view.observations.filter(o=>o.receivedDetails.ownCommunication?.act==='explain_access');
 const interests=view.observations.filter(o=>{const m=o.receivedDetails.communication;return m?.act==='ask_whereabouts'&&m.targetId===r.ownerTopicId&&m.content.operation==='ask';});
 const broad=view.observations.filter(o=>{const m=o.receivedDetails.communication;return m&&r.protectedScopeIds.includes(m.scope.subjectId)&&((m.act==='request_access'&&['inspect','bypass'].includes(m.content.operation))||(m.act==='propose_exchange'&&m.content.purpose==='boundary_exception'));});
 const pair=broad.find(b=>explanations.some(e=>e.sequence<b.sequence)&&interests.some(i=>i.sequence<b.sequence&&i.id!==b.id));
 return {ready:Boolean(pair),support:pair?[explanations.filter(e=>e.sequence<pair.sequence).at(-1).id,interests.filter(i=>i.sequence<pair.sequence).at(-1).id,pair.id]:[]};
}
export function substantiveCorrection(view){
 const o=view.incoming;if(!o||!view.rule||o.scope.subjectId!==view.rule.relevantScopeId)return false;
 if(o.act==='request_access'&&o.content.operation==='compare')return true;
 return ['request_access','challenge_record','present_evidence'].includes(o.act)&&o.content.evidence.some(e=>view.rule.requiredEvidence.some(r=>r.subjectId===e.subjectId&&r.predicate===e.predicate));
}
