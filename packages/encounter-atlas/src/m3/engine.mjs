import { canonicalJson, copy, freeze, fields, id, integer, requireThat, verifyPackage, messageRecord, termsRecord } from './types.mjs';
import { createRun, validateRun, executeCommand } from '../runtime.mjs';
import { projectObservation } from '../views.mjs';
import { stageMatchedResult } from '../action-boundary.mjs';
import { compile, describe, closureNotice, evidenceKey } from './meaning.mjs';
import { actorView, uniqueEvidence, recomputeBeliefs, privacySupport, qualifiesEvidence } from './knowledge.mjs';
import { chooseResponse } from './policy.mjs';

const token=(type,n)=>`${type}_${n.toString(16).padStart(4,'0')}`;
const alloc=(d,type)=>token(type,++d.counters[type]);
const ref=(p,id)=>{const v=p.subjects.find(s=>s.id===id);requireThat(Boolean(v),'UNKNOWN_REFERENCE');return copy(v);};
const publicRule=r=>{const keys=['serviceId','custodianId','witnessId','itemId','ownerTopicId','recordId','fileId','relevantScopeId','protectedScopeIds','wholeScopeId'];return Object.fromEntries(keys.map(k=>[k,copy(r[k])]));};
function event(d,type,details){const e={id:alloc(d,'event'),sequence:++d.sequence,type,details:copy(details)};d.events.push(e);return e;}
function observe(d,source,actorId,details,channel='initial',roots=null){
 const o=projectObservation({kind:source.kind??'event',id:source.id,sequence:source.sequence,details},
  {id:alloc(d,'observation'),observerId:actorId,channel,receivedKeys:Object.keys(details),roots:roots??[{kind:source.kind??'event',id:source.id}]});d.observations.push(o);return o;
}
function factEvidence(p,ids,form,markId,roots){return ids.map(id=>{const f=p.facts.find(f=>f.id===id);requireThat(Boolean(f));const {id:_,...e}=f;return {...copy(e),form,markId,roots:copy(roots)};});}
function receiveMessage(d,p,m){
 messageRecord(m);const received=[];
 for(const actorId of m.outward.recipientIds){
  const o=observe(d,{kind:'message',id:m.id,sequence:m.sequence},actorId,{communication:copy(m.outward)},'hearing');received.push(o);
  if(m.outward.content.evidence.length){
   const shown=copy(m.outward.content.evidence);const source={kind:'message',id:m.id,sequence:m.sequence};
   observe(d,source,actorId,{evidence:shown,references:[...new Set(shown.flatMap(e=>[e.subjectId,...(typeof e.value==='string'&&p.subjects.some(s=>s.id===e.value)?[e.value]:[])]))].map(id=>ref(p,id))},shown.every(e=>e.form==='document')?'reading':'hearing',[...new Map(shown.flatMap(e=>e.roots).map(r=>[canonicalJson(r),copy(r)])).values()]);
  }
 }
 if(m.outward.content.evidence.length)d.claims.push({id:alloc(d,'claim'),messageId:m.id,speakerId:m.outward.senderId,recipientIds:copy(m.outward.recipientIds),evidence:copy(m.outward.content.evidence),observationIds:received.map(o=>o.id),roots:[...new Map(m.outward.content.evidence.flatMap(e=>e.roots).map(r=>[canonicalJson(r),copy(r)])).values()]});
 if(d.profiles[m.outward.senderId])observe(d,{kind:'message',id:m.id,sequence:m.sequence},m.outward.senderId,{ownCommunication:copy(m.outward)},'hearing');
 for(const actorId of m.outward.recipientIds)recomputeBeliefs(d,actorId,type=>alloc(d,type));
 return received;
}
function permission(d,actorId,actionId,p,source){
 const action=p.actions.find(a=>a.id===actionId);requireThat(Boolean(action));let existing=d.permissions.find(x=>x.granteeId===actorId&&x.actionId===actionId);
 if(existing){existing.status='allowed';existing.source=copy(source);return existing;}
 existing={id:alloc(d,'permission'),granteeId:actorId,grantorId:p.initial.rule.custodianId,actionId,targetId:action.targetId,status:'allowed',source:copy(source)};d.permissions.push(existing);return existing;
}
function updateHypothesis(d,view){
 const support=privacySupport(view);if(!support.ready)return;
 const o=view.incoming;if(!o||!view.rule.protectedScopeIds.includes(o.scope.subjectId))return;
 let h=d.hypotheses.find(h=>h.holderId===view.actorId&&h.type==='protected_scope_interest');
 if(!h){h={id:alloc(d,'hypothesis'),holderId:view.actorId,type:'protected_scope_interest',targetId:d.humanId,scopeId:view.rule.fileId,band:'actionable',supportObservationIds:[],correctionObservationIds:[],history:[],appliedCauses:[]};d.hypotheses.push(h);}
 const prior=h.band;h.band='actionable';h.supportObservationIds=[...new Set([...h.supportObservationIds,...support.support])];h.history.push({sequence:d.sequence,prior,band:h.band,causes:copy(support.support)});
}
export async function startEncounter(sealed,{runId='run_0003',noPressure=false}={}){
 const checked=await verifyPackage(sealed),p=checked.content,r=p.initial.rule;id(runId,'run');
 const d={schema:'encounter-domain@3',humanId:p.humanId,currentPartnerId:p.initialPartnerId,sequence:0,
  counters:Object.fromEntries(['event','message','observation','claim','permission','result','decision','belief','hypothesis','offer','defect'].map(k=>[k,0])),
  profiles:Object.fromEntries(p.actors.filter(a=>a.kind==='npc').map(a=>[a.id,copy(a.profile)])),
  world:{itemId:p.initial.itemId,ownerId:p.initial.ownerId,holderId:p.initial.holderId,quantity:1,balances:copy(p.initial.balances),serviceOpen:true,recovered:false,comparisonComplete:false,recordCorrected:false,documentRevisions:[{revision:1,text:p.initial.entry,sourceEventId:null}],facts:copy(p.facts)},
  observations:[],events:[],messages:[],claims:[],permissions:[],actionResults:[],decisions:[],beliefs:[],hypotheses:[],offers:[],activeOfferId:null,episodes:[],defects:[],
  visits:[{holderId:r.custodianId,serviceId:r.serviceId,restricted:false,restrictedOrRepaired:false,repairUsed:false,warningMessageId:null,restrictionMessageId:null}],
  opportunities:{used:0,allowance:p.initial.softAllowance,noPressure}};
 const origin=event(d,'authored_record_origin',{entry:p.initial.entry,facts:copy(p.facts)});d.world.documentRevisions[0].sourceEventId=origin.id;
 observe(d,origin,p.humanId,{references:p.initial.initialReferenceIds.map(id=>ref(p,id)),participants:p.actors.map(a=>({id:a.id,label:a.label,kind:a.kind})),collection:{itemId:r.itemId,ticketId:r.ticketId,recordId:r.recordId,entry:p.initial.entry}});
 const markIds=p.subjects.filter(s=>p.actions.some(a=>a.disclosures.some(x=>x.markId===s.id))).map(s=>s.id);
 observe(d,origin,r.custodianId,{serviceRule:copy(r),recognizedMarks:markIds});
 const witnessRule=publicRule(r);observe(d,origin,r.witnessId,{serviceRule:witnessRule,recognizedMarks:markIds,accountInterpretation:p.initial.witnessAccount.interpretation});
 const movement=event(d,'authored_historical_movement',{evidence:factEvidence(p,p.initial.historicalMovement.allFactIds,'direct',null,[{kind:'event',id:origin.id}])});
 for(const grant of p.initial.historicalMovement.actorReceipts){const evidence=factEvidence(p,grant.factIds,grant.form,grant.markId,[{kind:'event',id:movement.id}]);observe(d,movement,grant.actorId,{evidence},'initial');recomputeBeliefs(d,grant.actorId,type=>alloc(d,type));}
 permission(d,p.humanId,r.verifyActionId,p,{kind:'event',id:origin.id});
 permission(d,r.custodianId,r.closeActionId,p,{kind:'event',id:origin.id});
 validateDomain(d,p);return createRun({id:runId,packageRef:checked.ref,data:d});
}
export function playerView(run){
 const d=run.data,local=d.observations.filter(o=>o.observerId===d.humanId),refs=new Map(),participants=new Map();let collection=null,rule=null;
 for(const o of local){for(const r of o.receivedDetails.references??[])refs.set(r.id,copy(r));for(const a of o.receivedDetails.participants??[])participants.set(a.id,copy(a));if(o.receivedDetails.collection)collection=o.receivedDetails.collection;if(o.receivedDetails.publicRule)rule=o.receivedDetails.publicRule;}
 const heard=new Set(local.filter(o=>o.source.kind==='message').map(o=>o.source.id));
 const messages=d.messages.filter(m=>m.outward.senderId===d.humanId||heard.has(m.id)).map(m=>({id:m.id,sequence:m.sequence,outward:copy(m.outward),ownComposition:m.outward.senderId===d.humanId?copy(m.privateComposition):null}));
 const warning=messages.filter(m=>m.outward.act==='restriction_warning').at(-1);
 const seenPermissions=d.permissions.filter(x=>x.granteeId===d.humanId&&(x.source.kind==='event'||heard.has(x.source.id))).map(copy);
 return freeze({actorId:d.humanId,partnerId:d.currentPartnerId,itemId:collection.itemId,ticketId:collection.ticketId,recordId:collection.recordId,entry:collection.entry,
  participants:[...participants.values()],references:[...refs.values()],rule,evidence:uniqueEvidence(local),messages,permissions:seenPermissions,
  warningMessageId:warning?.id??null,activeOffer:d.activeOfferId?copy(d.offers.find(o=>o.id===d.activeOfferId)):null,
  recovered:local.some(o=>o.receivedDetails.handover?.complete),serviceClosed:local.some(o=>o.receivedDetails.service?.open===false),
  comparisonComplete:local.some(o=>o.receivedDetails.comparison?.complete),recordCorrected:local.some(o=>o.receivedDetails.recordCorrection),
  ticketVerified:local.some(o=>o.receivedDetails.authority?.verified),performedActionIds:d.actionResults.filter(x=>x.request.actorId===d.humanId&&x.outcome==='performed'&&local.some(o=>o.source.kind==='action_result'&&o.source.id===x.id)).map(x=>x.request.actionType),
  opportunities:copy(d.opportunities),balanceMinor:d.world.balances[d.humanId]});
}
export function prepareSend(run,sealed,input,commandId=token('command',run.revision+1)){
 validateRun(run);requireThat(canonicalJson(run.packageRef)===canonicalJson(sealed.ref),'PACKAGE_MISMATCH');requireThat(run.data.currentPartnerId!==null,'NO_PARTNER');id(commandId,'command');
 const view=playerView(run),message=compile(sealed.content.communication,view,input,{id:token('message',run.data.counters.message+1),commandId,sequence:run.data.sequence+1,contextMessageId:input.contextMessageId??view.messages.filter(m=>m.outward.senderId===view.partnerId).at(-1)?.id??null});
 return freeze({schema:'encounter-command@2',id:commandId,sessionId:run.id,packageRef:copy(run.packageRef),expectedRevision:run.revision,kind:'send_message',payload:{draft:copy(input),preview:{revision:run.revision,message,text:describe(message.outward),notice:closureNotice(view,message.outward)}}});
}
export function prepareAction(run,sealed,actionId,commandId=token('command',run.revision+1)){
 const a=sealed.content.actions.find(a=>a.id===actionId);requireThat(Boolean(a),'UNSUPPORTED_ACTION');const p=run.data.permissions.find(p=>p.granteeId===run.data.humanId&&p.actionId===actionId&&p.status==='allowed');requireThat(Boolean(p),'PERMISSION_REQUIRED');
 return freeze({schema:'encounter-command@2',id:commandId,sessionId:run.id,packageRef:copy(run.packageRef),expectedRevision:run.revision,kind:'perform_action',payload:{operation:'physical',request:{commandId,actorId:run.data.humanId,actionType:actionId,targetId:a.targetId,permissionId:p.id,expectedRevision:run.revision}}});
}
export function prepareSessionOperation(run,sealed,operation,partnerId=null,commandId=token('command',run.revision+1)){
 requireThat(['switch_partner','end_conversation'].includes(operation));return freeze({schema:'encounter-command@2',id:commandId,sessionId:run.id,packageRef:copy(run.packageRef),expectedRevision:run.revision,kind:'perform_action',payload:{operation,partnerId}});
}
export function prepareConfirmation(run,sealed,commandId=token('command',run.revision+1)){
 const o=run.data.offers.find(o=>o.id===run.data.activeOfferId);requireThat(Boolean(o)&&o.status==='accepted','NO_ACTIVE_OFFER');
 return freeze({schema:'encounter-command@2',id:commandId,sessionId:run.id,packageRef:copy(run.packageRef),expectedRevision:run.revision,kind:'perform_action',payload:{operation:'confirm_offer',offerId:o.id,offerRevision:o.revision,terms:copy(o.terms)}});
}
function closeOffer(d,reason){const o=d.offers.find(o=>o.id===d.activeOfferId);if(o){o.status=reason;o.history.push({sequence:d.sequence,status:reason});}d.activeOfferId=null;}
function buildOffer(d,p,sourceMessageId){
 const r=p.initial.rule;closeOffer(d,'superseded');const terms={parties:[d.humanId,r.custodianId],itemId:r.itemId,fromId:p.initial.holderId,toId:d.humanId,ownerId:r.ownerId,moneyId:r.moneyId,amountMinor:r.handoverPriceMinor,privateDisclosures:[],settlements:[]};termsRecord(terms);
 const offer={id:alloc(d,'offer'),revision:1,partnerId:r.custodianId,status:'accepted',terms,sourceMessageId,history:[{sequence:d.sequence,status:'accepted'}]};d.offers.push(offer);d.activeOfferId=offer.id;return offer;
}
function replyText(plan,view,p){
 const descriptions={
  explain_access:'The customer file contains case-handling material and unrelated private contact information. The relevant extract and permitted handling tray are available. Private contact values remain covered.',
  verify_first:'Please show the valid collection ticket through the ticket-verification action. Collection authority must actually be checked.',
  limited_account:view.evidence.map(e=>e.label).join('\n')+'\n'+view.reportedAccount+'\nThis report does not prove a completed collection.',
  defer_location:'I refer you to the recorded entry and the relevant inspection route rather than explaining the earlier movement.',
  acknowledge_report:'I received your report or selected evidence. Its stated scope and source remain distinct from firsthand verification. A case-only comparison can establish the handling discrepancy.',
  comparison_offer:'A supervised comparison limited to the case-handling evidence is available. Accepting it is permission; choose the physical comparison action to perform it.',
  restriction_warning:'Further relevant-file access is limited to a supervised comparison. That case-only comparison remains available to complete collection. Renewing a demand for protected/full-file information, or asking me to bypass that boundary, will end collection service for this visit. This warning still applies after clarification or repair.',
  explain_warning:'The concern comes from the earlier location inquiry followed by the broader protected-scope request after the file split and case-only alternative were explained. This is a fallible concern, not proof of your intent. The supervised case-only route remains available; clarification does not use the repair episode.',
  scope_repaired:'Your substantive case-only narrowing or acceptance addresses the concern. The appropriate relevant route is restored. The private contact value remains unavailable, and the visit-long warning remains in force.',
  boundary_refusal:'I decline that unrelated or protected scope. The case-only route remains the relevant collection route while service is open.',
  ordinary_payment_refusal:'No extra collection charge is due. I decline the ordinary payment offer as unnecessary. No money moves and no new debt or bribery judgment is created.',
  payment_boundary_refusal:'I decline the explicit proposal to pay for bypassing the private-information boundary. This is different from an ordinary collection payment offer; no money moves.',
  handover_offer:'The actual supervised comparison supports the authorized release. Review the exact current handover terms and confirm deliberately. Permission or saying Yes does not hand over the item.',
  confirm_reminder:'Your acknowledgment does not execute the proposal. Use the separate exact handover confirmation if you accept the current terms.',
  service_closure:'Collection service is now closed for this visit following the previously warned, previewed renewed protected-scope demand.',
  already_recovered:'The completed handover remains a successful recovery. Later conversation cannot undo it.',
  unavailable:view.serviceClosed?'Collection service is closed for this visit. No uncompleted release proposal can bypass that state.':'That supported step is not currently available in this context.',
  concern_acknowledged:'Your acknowledgment was heard. A vague apology alone does not narrow the request or accept the supervised comparison; the substantive repair opportunity remains.'
 };return descriptions[plan.selected];
}
function applyResponse(d,p,command,view,plan,source){
 const r=p.initial.rule,messageId=alloc(d,'message'),visit=d.visits.find(v=>v.holderId===view.actorId);const changes=[];
 const evidence=plan.selected==='limited_account'?view.evidence.map(e=>({...copy(e),form:'report',markId:null})):[];
 const refs=new Set([r.itemId]);for(const e of evidence){refs.add(e.subjectId);if(typeof e.value==='string'&&p.subjects.some(s=>s.id===e.value))refs.add(e.value);}
 let offer=null;
 if(plan.selected==='handover_offer'){offer=buildOffer(d,p,messageId);changes.push({type:'offer_prepared',offerId:offer.id,revision:offer.revision});}
 if(offer)refs.add(offer.terms.fromId);
 const outward={family:'Remark',act:plan.selected,senderId:view.actorId,recipientIds:[d.humanId],subjectIds:[...refs],targetId:r.itemId,scope:{subjectId:r.itemId,kind:'subject'},
  content:{kind:'response',operation:plan.selected,evidence,amountMinor:0,purpose:'response',text:replyText(plan,view,p)},framing:[],prominence:'measured',terms:offer?copy(offer.terms):null};
 const message={schema:'encounter-message@3',id:messageId,commandId:command.id,sequence:d.sequence+1,contextMessageId:source.kind==='message'?source.id:null,privateComposition:{selectedVibe:'EA',selectedSalience:'NUANCED',authorId:'author_0001',templateId:'template_0020',intendedFraming:'Communicate the selected role-bound response and exact scope.'},outward};messageRecord(message);
 d.messages.push(message);const response=event(d,'response_delivered',{messageId,act:plan.selected});receiveMessage(d,p,message);
 if(offer)observe(d,{kind:'message',id:messageId,sequence:message.sequence},d.humanId,{references:[ref(p,offer.terms.fromId)]},'hearing');
 if(['explain_access','restriction_warning','scope_repaired','comparison_offer'].includes(plan.selected)){
  observe(d,{kind:'message',id:messageId,sequence:message.sequence},d.humanId,{references:r.explainReferenceIds.map(id=>ref(p,id)),publicRule:publicRule(r)},'hearing');
  if(plan.selected==='explain_access'||plan.selected==='scope_repaired')for(const actionId of r.inspectionActionIds)permission(d,d.humanId,actionId,p,{kind:'message',id:messageId});
  if(['restriction_warning','scope_repaired','comparison_offer'].includes(plan.selected))permission(d,d.humanId,r.comparisonActionId,p,{kind:'message',id:messageId});
 }
 if(plan.selected==='restriction_warning'){
  visit.restricted=true;visit.restrictedOrRepaired=true;visit.warningMessageId=messageId;visit.restrictionMessageId=messageId;
  for(const x of d.permissions)if(x.granteeId===d.humanId&&r.inspectionActionIds.includes(x.actionId))x.status='suspended';
  const h=d.hypotheses.find(h=>h.holderId===view.actorId&&h.type==='protected_scope_interest');if(h)h.appliedCauses.push(messageId);
  changes.push({type:'restriction',messageId},{type:'warning_delivered',messageId});
 }
 if(plan.selected==='scope_repaired'){
  visit.restricted=false;visit.repairUsed=true;const h=d.hypotheses.find(h=>h.holderId===view.actorId&&h.type==='protected_scope_interest');if(h){h.history.push({sequence:d.sequence,prior:h.band,band:'corrected',causes:[source.id]});h.band='corrected';h.correctionObservationIds.push(...view.observations.filter(o=>o.source.id===source.id).map(o=>o.id));}
  changes.push({type:'repair_resolved',warningPersists:visit.warningMessageId});
 }
 if(plan.missingNotice){const defect={id:alloc(d,'defect'),commandId:command.id,type:'MISSING_CLOSURE_PREVIEW',warningMessageId:visit.warningMessageId,serviceRemainsOpen:true};d.defects.push(defect);changes.push({type:'technical_defect',id:defect.id});}
 if(plan.selected==='service_closure'){
  const action=p.actions.find(a=>a.id===r.closeActionId);const permit=d.permissions.find(x=>x.granteeId===view.actorId&&x.actionId===action.id&&x.status==='allowed');requireThat(Boolean(permit));const permissionId=permit.id;
  const request={commandId:command.id,actorId:view.actorId,actionType:action.id,targetId:action.targetId,permissionId,expectedRevision:command.expectedRevision};
  const result={id:token('result',d.counters.result+1),request,outcome:'performed',effects:[{type:'close_service',payload:{serviceId:r.serviceId}}],observerDetails:[d.humanId,r.custodianId,r.witnessId].map(observerId=>({observerId,details:{service:{id:r.serviceId,open:false},conduct:'Collection service closed for this visit after the declared warning and renewed demand.'}}))};
  stageResolved(d,p,request,result);closeOffer(d,'closed_by_service');changes.push({type:'service_closed',resultId:result.id});
 }
 const {observations,evidence:inputEvidence,claims,...inputState}=view;
 const inputBasis={state:copy(inputState),observationIds:observations.map(o=>o.id),claimIds:claims.map(c=>c.id)};
 const decision={id:alloc(d,'decision'),actorId:view.actorId,source:copy(source),inputBasis,candidates:copy(plan.candidates),selected:plan.selected,privacySupport:copy(plan.privacySupport),repairQualified:plan.repair,noticeDisplayed:Boolean(command.payload.preview?.notice?.displayed),changes:copy(changes)};d.decisions.push(decision);
 requireThat(canonicalJson(decisionInput({data:d},decision.id))===canonicalJson(view),'INVALID_DECISION_SNAPSHOT');
 const episode={id:response.id,commandId:command.id,messageId,decisionId:decision.id,intake:{description:view.incoming?.framing.some(c=>c.kind==='possible_consequence')?'Sets both hands beside the material and meets the collector’s gaze with a steady expression.':'Looks from the received material to the collector, holding a composed expression.'},delivery:{description:'Keeps the selected material in view and states the bounded response with a composed face.',text:describe(outward)}};d.episodes.push(episode);
 return {messageId,episodeId:episode.id,decisionId:decision.id,changes};
}
function commitMessage(d,p,command){
 const m=copy(command.payload.preview.message);alloc(d,'message');d.messages.push(m);event(d,'message_sent',{messageId:m.id});receiveMessage(d,p,m);
 let view=actorView(d,d.currentPartnerId,m.outward);updateHypothesis(d,view);view=actorView(d,d.currentPartnerId,m.outward);
 const plan=chooseResponse(view,{noticeDisplayed:command.payload.preview.notice?.displayed===true});
 const result=applyResponse(d,p,command,view,plan,{kind:'message',id:m.id});if(m.outward.act!=='why')d.opportunities.used++;
 return {...result,initiatingMessageId:m.id};
}
function validatePhysical(d,p,request){
 const action=p.actions.find(a=>a.id===request.actionType);requireThat(Boolean(action)&&action.targetId===request.targetId,'INVALID_COMMAND');
 const permit=d.permissions.find(x=>x.id===request.permissionId&&x.actionId===action.id&&x.granteeId===request.actorId&&x.status==='allowed');requireThat(Boolean(permit)&&request.actorId===d.humanId,'INVALID_COMMAND');
 requireThat(d.world.serviceOpen||action.kind==='verify_authority'||d.world.recovered,'SERVICE_UNAVAILABLE');
 if(action.requiresAuthority)requireThat(d.observations.some(o=>o.observerId===p.initial.rule.custodianId&&o.receivedDetails.authority?.verified),'AUTHORITY_REQUIRED');
 if(action.requiresComparison)requireThat(d.world.comparisonComplete,'COMPARISON_REQUIRED');return action;
}
/** Host-side local resolver: authoritative outcome, no installed mutation. */
export function resolveAction(d,p,request){
 const a=validatePhysical(d,p,request),r=p.initial.rule;
 requireThat(!['handover','close_service'].includes(a.kind),'EXACT_CONFIRMATION_REQUIRED');
 const duplicate=d.actionResults.some(x=>x.request.actionType===a.id&&x.outcome==='performed');
 const selected=uniqueEvidence(d.observations.filter(o=>o.observerId===d.humanId));
 const inconclusive=a.kind==='compare'&&!qualifiesEvidence(r,selected);
 const result={id:token('result',d.counters.result+1),request:copy(request),outcome:duplicate||inconclusive?'no_discovery':'performed',effects:[],observerDetails:[]};
 const root={kind:'action_result',id:result.id};
 if(duplicate||inconclusive){result.observerDetails=[{observerId:d.humanId,details:{conduct:duplicate?'The supported action supplies no new discovery or second effect.':'The bounded comparison was performed but the available evidence is incomplete; collection service remains open.'}}];return freeze(result);}
 if(a.kind==='verify_authority'){
  const authority={collectorId:d.humanId,itemId:r.itemId,ownerId:r.ownerId,ticketId:r.ticketId,verified:true};result.observerDetails=[d.humanId,r.custodianId].map(observerId=>({observerId,details:{authority,conduct:'The valid collection ticket is shown and verified.'}}));
 }else if(a.kind==='correct_record'){
  result.effects.push({type:'correct_record',payload:{recordId:r.recordId,text:r.recordCorrection}});result.observerDetails=[d.humanId,r.custodianId].map(observerId=>({observerId,details:{recordCorrection:{recordId:r.recordId,text:r.recordCorrection},conduct:'The correction is recorded as a new revision; the original shorthand remains.'}}));
 }else{
  for(const grant of a.disclosures){const evidence=factEvidence({...p,facts:d.world.facts},grant.factIds,grant.form,grant.markId,[root]);const details={conduct:grant.conduct??`Performs the permitted ${a.kind} action.`,evidence,references:[...new Set(evidence.flatMap(e=>[e.subjectId,...(typeof e.value==='string'&&p.subjects.some(s=>s.id===e.value)?[e.value]:[])]))].map(id=>ref(p,id))};
   if(a.kind==='compare'){details.comparison={serviceId:r.serviceId,itemId:r.itemId,complete:true};if(grant.actorId===r.custodianId)details.evidence=[...details.evidence,...selected.map(copy)];}
   result.observerDetails.push({observerId:grant.actorId,details});
  }
  if(a.kind==='compare')result.effects.push({type:'complete_comparison',payload:{serviceId:r.serviceId}});
 }
 return freeze(result);
}
export function stageResolved(d,p,request,result){
 const prior=d.actionResults.find(x=>x.id===result.id||x.request.commandId===request.commandId);
 const declared=p.actions.find(a=>a.id===request.actionType);requireThat(Boolean(declared),'UNSUPPORTED_ACTION');
 if(!prior&&!['handover','close_service'].includes(declared.kind))requireThat(canonicalJson(resolveAction(d,p,request))===canonicalJson(result),'RESULT_DECLARATION_MISMATCH');
 const staged=stageMatchedResult(d,request,result,['close_service','complete_comparison','correct_record','custody_transfer','complete_recovery','transfer_money'],(next,effects,recipients)=>{
  requireThat(result.id===token('result',next.counters.result+1),'INVALID_RESULT');next.counters.result++;
  for(const e of effects){
   if(e.type==='close_service'){requireThat(!next.world.recovered&&next.world.serviceOpen);next.world.serviceOpen=false;}
   else if(e.type==='complete_comparison')next.world.comparisonComplete=true;
   else if(e.type==='correct_record'){requireThat(!next.world.recordCorrected&&e.payload.recordId===p.initial.rule.recordId);next.world.documentRevisions.push({revision:next.world.documentRevisions.length+1,text:e.payload.text,sourceEventId:token('event',next.counters.event+1)});next.world.recordCorrected=true;}
   else if(e.type==='custody_transfer'){requireThat(next.world.holderId===e.payload.fromId&&next.world.itemId===e.payload.itemId&&next.world.ownerId===e.payload.ownerId);next.world.holderId=e.payload.toId;}
   else if(e.type==='complete_recovery'){requireThat(next.world.holderId===next.humanId&&!next.world.recovered);next.world.recovered=true;}
   else {requireThat(e.type==='transfer_money');const {fromId,toId,amountMinor}=e.payload;integer(amountMinor);requireThat(next.world.balances[fromId]>=amountMinor);next.world.balances[fromId]-=amountMinor;next.world.balances[toId]+=amountMinor;}
  }
  const actionEvent=event(next,'physical_result_committed',{resultId:result.id,actionId:request.actionType,outcome:result.outcome});
  for(const recipient of recipients){
   requireThat(p.actors.some(a=>a.id===recipient.observerId&&a.kind!=='absent'),'INVALID_RECIPIENT');
   const action=p.actions.find(a=>a.id===request.actionType);const actual=recipient.details;
   if(['inspect','search'].includes(action.kind)&&recipient.observerId!==next.humanId)requireThat(!actual.evidence?.length,'UNREAD_DETAIL_LEAK');
   const protectedValues=p.facts.filter(f=>p.protectedFactIds.includes(f.id)).map(f=>f.value);if(recipient.observerId===next.humanId)requireThat(!protectedValues.some(value=>canonicalJson(actual).includes(JSON.stringify(value))),'PROTECTED_DISCLOSURE');
   observe(next,{kind:'action_result',id:result.id,sequence:actionEvent.sequence},recipient.observerId,actual,actual.evidence?.length?'reading':'sight');recomputeBeliefs(next,recipient.observerId,type=>alloc(next,type));
  }
  return true;
 });if(!staged.replayed)Object.assign(d,staged.data);return {data:d,replayed:staged.replayed};
}
function commitPhysical(d,p,command){
 const request=command.payload.request,result=resolveAction(d,p,request);stageResolved(d,p,request,result);d.opportunities.used++;
 const r=p.initial.rule;let response=null;
 if(request.actionType===r.comparisonActionId&&result.outcome==='performed'){
  permission(d,d.humanId,r.correctionActionId,p,{kind:'event',id:d.events.at(-1).id});permission(d,d.humanId,r.handoverActionId,p,{kind:'event',id:d.events.at(-1).id});
  const view=actorView(d,r.custodianId);response=applyResponse(d,p,command,view,chooseResponse(view,{afterAction:true}),{kind:'action_result',id:result.id});
 }
 return {resultId:result.id,outcome:result.outcome,...(response??{}),changes:[{type:'physical_result',id:result.id,outcome:result.outcome},...(response?.changes??[])]};
}
function validateConfirmation(d,p,payload){
 fields(payload,['operation','offerId','offerRevision','terms']);const offer=d.offers.find(o=>o.id===payload.offerId);requireThat(Boolean(offer)&&d.activeOfferId===offer.id&&offer.partnerId===d.currentPartnerId&&offer.status==='accepted','INVALID_OFFER');
 requireThat(offer.revision===payload.offerRevision&&canonicalJson(offer.terms)===canonicalJson(payload.terms),'ALTERED_TERMS');termsRecord(payload.terms);
 const t=offer.terms,r=p.initial.rule;requireThat(d.world.serviceOpen&&!d.world.recovered&&d.world.comparisonComplete,'SERVICE_UNAVAILABLE');requireThat(t.itemId===d.world.itemId&&t.fromId===d.world.holderId&&t.toId===d.humanId&&t.ownerId===d.world.ownerId,'CUSTODY_CHANGED');
 requireThat(t.amountMinor===r.handoverPriceMinor&&d.world.balances[d.humanId]>=t.amountMinor,'INVALID_BALANCE');
 requireThat(d.observations.some(o=>o.observerId===r.custodianId&&o.receivedDetails.authority?.verified),'AUTHORITY_REQUIRED');return offer;
}
function commitConfirmation(d,p,command){
 const offer=validateConfirmation(d,p,command.payload),t=offer.terms,r=p.initial.rule,permit=d.permissions.find(x=>x.granteeId===d.humanId&&x.actionId===r.handoverActionId&&x.status==='allowed');requireThat(Boolean(permit));
 const request={commandId:command.id,actorId:d.humanId,actionType:r.handoverActionId,targetId:r.itemId,permissionId:permit.id,expectedRevision:command.expectedRevision};
 const result={id:token('result',d.counters.result+1),request,outcome:'performed',effects:[...(t.amountMinor?[{type:'transfer_money',payload:{fromId:d.humanId,toId:r.custodianId,amountMinor:t.amountMinor}}]:[]),{type:'custody_transfer',payload:{itemId:t.itemId,fromId:t.fromId,toId:t.toId,ownerId:t.ownerId}},{type:'complete_recovery',payload:{itemId:t.itemId}}],observerDetails:[d.humanId,r.custodianId].map(observerId=>({observerId,details:{handover:{complete:true,itemId:t.itemId,holderId:t.toId,ownerId:t.ownerId,paidMinor:t.amountMinor,offerId:offer.id,offerRevision:offer.revision},conduct:'The exact confirmed handover occurs. The collector receives custody; ownership is unchanged.'}}))};
 stageResolved(d,p,request,result);const installed=d.offers.find(o=>o.id===offer.id);installed.status='confirmed';installed.history.push({sequence:d.sequence,status:'confirmed',resultId:result.id});d.activeOfferId=null;d.opportunities.used++;
 return {resultId:result.id,offerId:offer.id,changes:result.effects.map(e=>copy(e)),recovered:true};
}
export function dispatch(run,sealed,command){
 requireThat(canonicalJson(run.packageRef)===canonicalJson(sealed.ref),'PACKAGE_MISMATCH');const p=sealed.content;
 return executeCommand(run,command,{
  validateNew:(d,c)=>{
   validateDomain(d,p);
   if(c.kind==='send_message'){
    fields(c.payload,['draft','preview']);const expected=prepareSend({id:run.id,revision:c.expectedRevision,packageRef:run.packageRef,data:d,journal:run.journal,schema:run.schema},sealed,c.payload.draft,c.id);
    const submitted=copy(c.payload.preview);if(submitted.notice!==null){requireThat(typeof submitted.notice.displayed==='boolean');submitted.notice.displayed=false;}
    requireThat(canonicalJson(submitted)===canonicalJson(expected.payload.preview),'INVALID_PREVIEW');
   }else{
    const op=c.payload.operation;
    if(op==='physical'){fields(c.payload,['operation','request']);const q=c.payload.request;requireThat(q.commandId===c.id&&q.expectedRevision===c.expectedRevision);validatePhysical(d,p,q);}
    else if(op==='confirm_offer')validateConfirmation(d,p,c.payload);
    else{fields(c.payload,['operation','partnerId']);requireThat(['switch_partner','end_conversation'].includes(op));if(op==='switch_partner')requireThat(c.payload.partnerId!==d.currentPartnerId&&p.actors.some(a=>a.id===c.payload.partnerId&&a.kind==='npc'));else requireThat(c.payload.partnerId===null);}
   }return true;
  },
  resolve:(d,c)=>{
   if(c.kind==='send_message')return commitMessage(d,p,c);
   if(c.payload.operation==='physical')return commitPhysical(d,p,c);
   if(c.payload.operation==='confirm_offer')return commitConfirmation(d,p,c);
   closeOffer(d,c.payload.operation==='end_conversation'?'closed_on_end':'closed_on_switch');d.currentPartnerId=c.payload.operation==='switch_partner'?c.payload.partnerId:null;const e=event(d,'conversation_context_changed',{operation:c.payload.operation,partnerId:d.currentPartnerId});return {eventId:e.id,changes:[{type:c.payload.operation,partnerId:d.currentPartnerId}]};
  },validateStaged:d=>validateDomain(d,p)
 });
}
export function validateDomain(d,p){
 canonicalJson(d);fields(d,['schema','humanId','currentPartnerId','sequence','counters','profiles','world','observations','events','messages','claims','permissions','actionResults','decisions','beliefs','hypotheses','offers','activeOfferId','episodes','defects','visits','opportunities']);requireThat(d.schema==='encounter-domain@3'&&d.humanId===p.humanId);requireThat(d.currentPartnerId===null||p.actors.some(a=>a.id===d.currentPartnerId&&a.kind==='npc'));integer(d.sequence);
 const w=d.world;fields(w,['itemId','ownerId','holderId','quantity','balances','serviceOpen','recovered','comparisonComplete','recordCorrected','documentRevisions','facts']);requireThat(w.itemId===p.initial.itemId&&w.ownerId===p.initial.ownerId&&w.quantity===1&&[p.humanId,...p.subjects.map(s=>s.id)].includes(w.holderId));requireThat(typeof w.serviceOpen==='boolean'&&typeof w.recovered==='boolean');requireThat(!w.recovered||w.holderId===d.humanId);requireThat(w.documentRevisions[0].text===p.initial.entry);requireThat(w.documentRevisions.every((r,i)=>r.revision===i+1));
 Object.values(w.balances).forEach(integer);requireThat(Object.values(w.balances).reduce((a,b)=>a+b,0)===Object.values(p.initial.balances).reduce((a,b)=>a+b,0),'MONEY_CONSERVATION');
 const kinds={events:'event',messages:'message',observations:'observation',claims:'claim',permissions:'permission',actionResults:'result',decisions:'decision',beliefs:'belief',hypotheses:'hypothesis',offers:'offer',defects:'defect'};
 for(const [key,kind] of Object.entries(kinds)){requireThat(Array.isArray(d[key])&&new Set(d[key].map(x=>x.id)).size===d[key].length&&d.counters[kind]===d[key].length);d[key].forEach(x=>id(x.id,kind));}
 d.messages.forEach(messageRecord);requireThat(d.events.every((e,i)=>e.sequence===i+1)&&d.events.length===d.sequence);
 const actors=new Set(p.actors.map(a=>a.id)),sourceExists=s=>({event:d.events,message:d.messages,action_result:d.actionResults}[s.kind]??[]).some(x=>x.id===s.id);
 for(const o of d.observations){requireThat(actors.has(o.observerId)&&sourceExists(o.source)&&o.roots.every(sourceExists));requireThat(p.actors.find(a=>a.id===o.observerId).kind!=='absent');}
 for(const b of d.beliefs)requireThat(Object.hasOwn(d.profiles,b.holderId)&&b.observationIds.every(id=>d.observations.some(o=>o.id===id&&o.observerId===b.holderId)));
 for(const h of d.hypotheses)requireThat(h.supportObservationIds.every(id=>d.observations.some(o=>o.id===id&&o.observerId===h.holderId))&&['actionable','corrected'].includes(h.band));
 for(const x of d.permissions)requireThat(actors.has(x.granteeId)&&p.actions.some(a=>a.id===x.actionId&&a.targetId===x.targetId)&&sourceExists(x.source)&&['allowed','suspended'].includes(x.status));
 for(const v of d.visits){requireThat(typeof v.repairUsed==='boolean'&&typeof v.restricted==='boolean');if(v.warningMessageId)requireThat(d.messages.some(m=>m.id===v.warningMessageId&&m.outward.act==='restriction_warning'));}
 requireThat(d.activeOfferId===null||d.offers.some(o=>o.id===d.activeOfferId&&o.status==='accepted'&&o.partnerId===d.currentPartnerId));d.offers.forEach(o=>termsRecord(o.terms));integer(d.opportunities.used);requireThat(d.opportunities.allowance===p.initial.softAllowance);
 return true;
}
export function decisionInput(run,decisionId){const d=run.data,record=d.decisions.find(x=>x.id===decisionId);requireThat(Boolean(record),'UNKNOWN_DECISION');const b=record.inputBasis,observations=b.observationIds.map(id=>{const o=d.observations.find(o=>o.id===id&&o.observerId===record.actorId);requireThat(Boolean(o));return copy(o);}),claims=b.claimIds.map(id=>{const c=d.claims.find(c=>c.id===id);requireThat(Boolean(c));return copy(c);});return freeze({...copy(b.state),observations,evidence:uniqueEvidence(observations),claims});}
export function inspectRun(run,sealed){const d=run.data;return freeze(structuredClone({sessionId:run.id,revision:run.revision,packageRef:run.packageRef,canonicalMessages:d.messages,observations:d.observations,claims:d.claims,beliefs:d.beliefs,hypotheses:d.hypotheses,permissions:d.permissions,visits:d.visits,actionResults:d.actionResults,offers:d.offers,decisions:d.decisions.map(x=>({...x,actualInput:decisionInput(run,x.id)})),episodes:d.episodes,technicalDefects:d.defects,documentRevisions:d.world.documentRevisions,commits:run.journal.map(j=>({commandId:j.command.id,revision:j.receipt.committedRevision,changes:j.receipt.result.changes})),outcomes:{recovered:d.world.recovered,serviceOpen:d.world.serviceOpen,ownerId:d.world.ownerId,holderId:d.world.holderId,quantity:d.world.quantity,balances:d.world.balances,recordCorrected:d.world.recordCorrected,privateDisclosed:false},withheld:{factIds:sealed.content.protectedFactIds,reason:'No supported action or response discloses these values.'}}));}
export function renderEpisode(run,id){const e=run.data.episodes.find(e=>e.id===id);requireThat(Boolean(e));return freeze(copy(e));}
export function exportRun(run,sealed){validateRun(run);validateDomain(run.data,sealed.content);return copy({schema:'encounter-save@3',package:sealed,run});}
export async function importRun(input,expectedPackage){
 canonicalJson(input);fields(input,['schema','package','run']);requireThat(input.schema==='encounter-save@3','UNSUPPORTED_SAVE');const sealed=await verifyPackage(input.package);requireThat(canonicalJson(sealed.ref)===canonicalJson(expectedPackage.ref),'PACKAGE_MISMATCH');validateRun(input.run);validateDomain(input.run.data,sealed.content);
 let replay=await startEncounter(sealed,{runId:input.run.id,noPressure:input.run.data.opportunities.noPressure});for(const j of input.run.journal){const result=dispatch(replay,sealed,j.command);requireThat(result.status==='committed','INVALID_SAVE');replay=result.run;}
 requireThat(canonicalJson(replay)===canonicalJson(input.run),'INVALID_SAVE');return replay;
}
