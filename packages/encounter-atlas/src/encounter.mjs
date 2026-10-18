import { canonicalJson, copy, freeze, fields, id, ids, integer, requireThat, validateMessage, validateObservation, validateClaim, validatePermission } from './contracts.mjs';
import { createRun, executeCommand, validateRun } from './runtime.mjs';
import { observeMessage, projectObservation, listenerView, authorInspector } from './views.mjs';
import { stageMatchedResult } from './action-boundary.mjs';
import { verifyPackage } from './package.mjs';
import { compileMessage, describeOutward } from './compiler.mjs';
import { selectResponse } from './policy.mjs';

const token=(kind,n)=>`${kind}_${n.toString(16).padStart(4,'0')}`;
const nextId=(data,kind)=>token(kind,++data.counters[kind]);
const subjectRef=(pkg,key)=>copy(pkg.subjects.find(s=>s.id===pkg.bindings[key]));
const profileFor=(pkg,actorId)=>pkg.actors.find(a=>a.id===actorId).profile;
const addEvent=(data,type,details)=>{
  const event={id:nextId(data,'event'),sequence:++data.sequence,type,details:copy(details)}; data.events.push(event); return event;
};
const addObservation=(data,source,observerId,channel,keys)=>{
  const observation=projectObservation(source,{id:nextId(data,'observation'),observerId,channel,receivedKeys:keys,roots:[{kind:source.kind,id:source.id}]});
  data.observations.push(observation); return observation;
};
const routeMessage=(data,message)=>{
  const received=[];
  for (const recipient of message.outward.recipientIds) {
    const observation=observeMessage(message,{id:nextId(data,'observation'),observerId:recipient}); data.observations.push(observation); received.push(observation);
  }
  return received;
};

export async function startEncounter(sealed,{runId='run_0002',noPressure=false}={}) {
  const pkg=await verifyPackage(sealed); id(runId,'run');
  const p=pkg.content,b=p.bindings;
  const data={schema:'encounter-domain@2',humanId:b.humanId,serviceId:b.serviceId,sequence:0,
    world:{itemId:b.itemId,ownerId:b.ownerId,holderId:b.holderId,quantity:1,balanceMinor:p.initial.balanceMinor,
      document:{recordId:b.recordId,handlingId:b.handlingId,entry:p.initial.entry,signature:p.initial.signature,contactId:b.contactId,protectedContact:p.initial.protectedContact}},
    counters:{event:0,message:0,result:0,observation:0,claim:0,permission:0,decision:0},
    events:[],messages:[],observations:[],claims:[],permissions:[],actionResults:[],decisions:[],episodes:[],
    opportunities:{used:0,allowance:p.initial.softAllowance,noPressure}};
  const authority={collectorId:b.humanId,itemId:b.itemId,ownerId:b.ownerId,ticketId:b.ticketId,verified:true};
  const publicRefs=['itemId','ticketId','recordId'].map(key=>subjectRef(p,key));
  const ticket=addEvent(data,'initial_ticket_check',{collectionAuthority:authority,references:publicRefs,participants:p.actors.map(a=>({id:a.id,label:a.label})),
    collection:{itemId:b.itemId,recordId:b.recordId,ticketId:b.ticketId,entry:p.initial.entry}});
  const ticketSource={kind:'event',id:ticket.id,sequence:ticket.sequence,details:ticket.details};
  addObservation(data,ticketSource,b.humanId,'initial',['references','participants','collection','collectionAuthority']);
  addObservation(data,ticketSource,b.serviceId,'initial',['collectionAuthority']);
  const accessRule={itemId:b.itemId,recordId:b.recordId,fileId:b.fileId,handlingId:b.handlingId,contactId:b.contactId,
    scope:'relevant_records',actionType:'inspect_records',references:['itemId','recordId','fileId','handlingId','contactId'].map(key=>subjectRef(p,key))};
  const file=addEvent(data,'initial_file_read',{accessRule,protectedContact:p.initial.protectedContact});
  addObservation(data,{kind:'event',id:file.id,sequence:file.sequence,details:file.details},b.serviceId,'initial',['accessRule']);
  validateDomain(data,p); return createRun({id:runId,packageRef:pkg.ref,data});
}

/** Projection has no package/world lookup. Vocabulary comes from received references. */
export function playerView(run) {
  const d=run.data,local=d.observations.filter(o=>o.observerId===d.humanId);
  const references=new Map(),participants=new Map(); let collection=null,detail=null;
  for (const o of local) {
    for (const ref of o.receivedDetails.references || []) references.set(ref.id,copy(ref));
    for (const actor of o.receivedDetails.participants || []) participants.set(actor.id,copy(actor));
    if (o.receivedDetails.collection) collection=o.receivedDetails.collection;
    if (o.receivedDetails.recordDetail) detail=o.receivedDetails.recordDetail;
  }
  const heardIds=new Set(local.filter(o=>o.source.kind==='message').map(o=>o.source.id));
  const messages=d.messages.filter(m=>m.outward.senderId===d.humanId || heardIds.has(m.id)).map(m=>({id:m.id,sequence:m.sequence,senderId:m.outward.senderId,
    outward:copy(m.outward),ownComposition:m.outward.senderId===d.humanId?copy(m.privateComposition):null}));
  const permissions=d.permissions.filter(p=>p.granteeId===d.humanId && heardIds.has(p.sourceMessageId)).map(copy);
  return freeze({actorId:d.humanId,partnerId:d.serviceId,participants:[...participants.values()],references:[...references.values()],
    item:collection?references.get(collection.itemId):null,record:collection?references.get(collection.recordId):null,entry:collection?.entry??null,
    inspectedDetail:detail?copy(detail):null,messages,permissions,
    actionAvailable:permissions.some(p=>p.status==='allowed') && !detail,
    opportunities:copy(d.opportunities),balanceMinor:d.world.balanceMinor});
}

function previewForData(data,pkg,draft,commandId,revision) {
  const message=compileMessage(pkg.communication,playerView({data}),draft,{id:token('message',data.counters.message+1),commandId,sequence:data.sequence+1,
    contextMessageId:data.messages.filter(m=>m.outward.senderId===data.serviceId).at(-1)?.id ?? null});
  return freeze({revision,message,text:describeOutward(message.outward)});
}
export function prepareSend(run,sealed,draft,commandId=token('command',run.revision+1)) {
  validateRun(run); requireThat(canonicalJson(run.packageRef)===canonicalJson(sealed.ref),'PACKAGE_MISMATCH'); id(commandId,'command');
  return freeze({schema:'encounter-command@2',id:commandId,sessionId:run.id,packageRef:copy(run.packageRef),expectedRevision:run.revision,kind:'send_message',
    payload:{draft:copy(draft),preview:previewForData(run.data,sealed.content,draft,commandId,run.revision)}});
}
export function prepareInspection(run,sealed,commandId=token('command',run.revision+1)) {
  requireThat(canonicalJson(run.packageRef)===canonicalJson(sealed.ref),'PACKAGE_MISMATCH');
  const permission=playerView(run).permissions.find(p=>p.status==='allowed'); requireThat(Boolean(permission),'PERMISSION_REQUIRED');
  return freeze({schema:'encounter-command@2',id:commandId,sessionId:run.id,packageRef:copy(run.packageRef),expectedRevision:run.revision,kind:'perform_action',
    payload:{request:{commandId,actorId:run.data.humanId,actionType:permission.actionType,targetId:permission.targetId,permissionId:permission.id,expectedRevision:run.revision}}});
}

export function decisionInput(data,pkg,messageId,observationIds=null) {
  const observations=observationIds?data.observations.filter(o=>observationIds.includes(o.id)):data.observations;
  return listenerView({actorId:data.serviceId,currentMessageId:messageId,observations,claims:data.claims,profile:profileFor(pkg,data.serviceId)});
}
function makeReply(data,command,plan) {
  const rule=plan.rule;
  const subjectIds=rule?[...new Set([rule.itemId,rule.recordId,...(plan.selected==='explain_access'?[rule.fileId,rule.handlingId,rule.contactId]:[])])]:copy(command.payload.preview.message.outward.subjectIds);
  const targetId=rule?.recordId ?? command.payload.preview.message.outward.targetId;
  const outward={family:'Remark',act:plan.selected,senderId:data.serviceId,recipientIds:[data.humanId],subjectIds,targetId,
    scope:{subjectId:targetId,kind:'relevant_records'},content:{kind:'assertion',predicate:plan.selected==='acknowledge_report'?'recipient_signature_report':'access_scope',
      value:plan.selected==='acknowledge_report'?plan.reportedValue:'relevant_records_only',timeScope:'current_visit'},framing:[],prominence:'measured',terms:null};
  const message={schema:'encounter-message@2',id:nextId(data,'message'),commandId:command.id,sequence:data.sequence+1,
    contextMessageId:command.payload.preview.message.id,
    privateComposition:{selectedVibe:'EA',selectedSalience:'NUANCED',authorId:'author_0001',templateId:'template_0020',intendedFraming:'Explain the applicable procedure and bounded next step.'},outward};
  validateMessage(message); return message;
}
function commitMessage(data,pkg,command) {
  const incoming=copy(command.payload.preview.message); nextId(data,'message');
  data.messages.push(incoming); addEvent(data,'message_sent',{messageId:incoming.id});
  const received=routeMessage(data,incoming);
  if (incoming.outward.content.kind==='assertion') {
    data.claims.push({id:nextId(data,'claim'),speakerId:incoming.outward.senderId,recipientIds:copy(incoming.outward.recipientIds),messageId:incoming.id,
      proposition:{subjectId:incoming.outward.targetId,predicate:incoming.outward.content.predicate,value:incoming.outward.content.value,timeScope:incoming.outward.content.timeScope},
      observationIds:received.map(o=>o.id),roots:[{kind:'message',id:incoming.id}]});
  }
  const input=decisionInput(data,pkg,incoming.id),plan=selectResponse(input);
  const decision={id:nextId(data,'decision'),messageId:incoming.id,actorId:data.serviceId,inputObservationIds:input.observations.map(o=>o.id),
    candidates:copy(plan.candidates),selected:plan.selected,evidenceObservationIds:copy(plan.evidenceObservationIds)};
  data.decisions.push(decision);
  const reply=makeReply(data,command,plan); data.messages.push(reply); const responseEvent=addEvent(data,'response_delivered',{messageId:reply.id,decisionId:decision.id});
  routeMessage(data,reply);
  const changes=[];
  if (plan.selected==='explain_access') {
    const rule=plan.rule;
    addObservation(data,{kind:'message',id:reply.id,sequence:reply.sequence,details:{references:rule.references}},data.humanId,'hearing',['references']);
    if (!data.permissions.some(p=>p.granteeId===data.humanId && p.targetId===rule.handlingId && p.status==='allowed')) {
      const permission={id:nextId(data,'permission'),granteeId:data.humanId,grantorId:data.serviceId,actionType:rule.actionType,targetId:rule.handlingId,scope:rule.scope,status:'allowed',sourceMessageId:reply.id};
      data.permissions.push(permission); changes.push({type:'permission_granted',id:permission.id});
    }
    changes.push({type:'references_disclosed',ids:rule.references.map(r=>r.id)});
  }
  const episode={id:responseEvent.id,commandId:command.id,incomingMessageId:incoming.id,replyMessageId:reply.id,decisionId:decision.id,
    intake:{description:plan.intakeDescription},delivery:{description:'Opens the relevant edge of the file, keeps the rest covered, and addresses the collector with a composed face.'},changes};
  data.episodes.push(episode); data.opportunities.used++;
  return {episodeId:episode.id,messageId:incoming.id,replyMessageId:reply.id,decisionId:decision.id,changes};
}

function requirePermission(data,request) {
  const permission=data.permissions.find(p=>p.id===request.permissionId);
  requireThat(Boolean(permission) && permission.status==='allowed' && permission.granteeId===request.actorId && permission.actionType===request.actionType &&
    permission.targetId===request.targetId && permission.scope==='relevant_records' && request.actorId===data.humanId,'INVALID_COMMAND');
  requireThat(!data.actionResults.some(r=>r.request.commandId!==request.commandId && r.request.targetId===request.targetId),'INVALID_COMMAND');
}
/** Local physical resolver determines an outcome but never changes its input. */
export function resolveInspection(data,request) {
  requirePermission(data,request);
  return freeze({id:token('result',data.counters.result+1),request:copy(request),outcome:'performed',effects:[],observerDetails:[
    {observerId:data.humanId,details:{conduct:'Inspects the permitted handling extract.',recordDetail:{subjectId:data.world.document.recordId,predicate:'recipient_signature',value:data.world.document.signature}}},
    {observerId:data.serviceId,details:{conduct:'Sees the collector inspect the permitted extract; cannot read the small print from here.'}}
  ]});
}
/** R2 matched-result helper is the sole application route for receiving details. */
export function stageInspectionResult(data,request,result) {
  requireThat(result.effects.length===0,'INVALID_COMMAND');
  const staged=stageMatchedResult(data,request,result,[],(next,_,recipients)=>{
    requireThat(result.id===token('result',next.counters.result+1),'INVALID_COMMAND'); next.counters.result++;
    requireThat(recipients.length===2 && recipients.some(r=>r.observerId===next.humanId) && recipients.some(r=>r.observerId===next.serviceId),'INVALID_COMMAND');
    const event=addEvent(next,'inspection_performed',{resultId:result.id,request:copy(request)});
    for (const recipient of recipients) {
      if (recipient.observerId===next.humanId) fields(recipient.details,['conduct','recordDetail']); else fields(recipient.details,['conduct']);
      addObservation(next,{kind:'action_result',id:result.id,sequence:event.sequence,details:recipient.details},recipient.observerId,
        recipient.observerId===next.humanId?'reading':'sight',Object.keys(recipient.details));
    }
    return true;
  });
  return staged;
}
function commitInspection(data,command) {
  const request=command.payload.request,result=resolveInspection(data,request);
  const staged=stageInspectionResult(data,request,result); Object.assign(data,staged.data); data.opportunities.used++;
  return {resultId:result.id,changes:[{type:'inspection_performed',resultId:result.id},{type:'detail_disclosed',to:data.humanId},{type:'conduct_observed',to:data.serviceId}]};
}

export function dispatch(run,sealed,command) {
  requireThat(canonicalJson(run.packageRef)===canonicalJson(sealed.ref),'PACKAGE_MISMATCH');
  const pkg=sealed.content;
  return executeCommand(run,command,{
    validateNew:(data,cmd)=>{
      validateDomain(data,pkg);
      if (cmd.kind==='send_message') {
        fields(cmd.payload,['draft','preview']);
        const expected=previewForData(data,pkg,cmd.payload.draft,cmd.id,cmd.expectedRevision);
        requireThat(canonicalJson(expected)===canonicalJson(cmd.payload.preview),'INVALID_COMMAND');
        requireThat(!data.messages.some(m=>m.id===expected.message.id),'INVALID_COMMAND');
      } else {
        fields(cmd.payload,['request']);
        const r=cmd.payload.request; fields(r,['commandId','actorId','actionType','targetId','permissionId','expectedRevision']);
        requireThat(r.commandId===cmd.id && r.expectedRevision===cmd.expectedRevision,'INVALID_COMMAND'); requirePermission(data,r);
      }
      return true;
    },
    resolve:(data,cmd)=>cmd.kind==='send_message'?commitMessage(data,pkg,cmd):commitInspection(data,cmd),
    validateStaged:(data)=>validateDomain(data,pkg)
  });
}

export function validateDomain(data,pkg) {
  canonicalJson(data);
  fields(data,['schema','humanId','serviceId','sequence','world','counters','events','messages','observations','claims','permissions','actionResults','decisions','episodes','opportunities']);
  requireThat(data.schema==='encounter-domain@2' && data.humanId===pkg.bindings.humanId && data.serviceId===pkg.bindings.serviceId); integer(data.sequence);
  fields(data.world,['itemId','ownerId','holderId','quantity','balanceMinor','document']);
  requireThat(data.world.itemId===pkg.bindings.itemId && data.world.ownerId===pkg.bindings.ownerId && data.world.holderId===pkg.bindings.holderId && data.world.quantity===1);
  requireThat(data.world.balanceMinor===pkg.initial.balanceMinor); fields(data.world.document,['recordId','handlingId','entry','signature','contactId','protectedContact']);
  requireThat(data.world.document.recordId===pkg.bindings.recordId && data.world.document.handlingId===pkg.bindings.handlingId && data.world.document.contactId===pkg.bindings.contactId);
  requireThat(data.world.document.entry===pkg.initial.entry && ['filled','unfilled'].includes(data.world.document.signature));
  fields(data.counters,['event','message','result','observation','claim','permission','decision']); Object.values(data.counters).forEach(integer);
  for (const [key,type] of [['events','event'],['messages','message'],['observations','observation'],['claims','claim'],['permissions','permission'],['actionResults','result'],['decisions','decision']]) {
    requireThat(Array.isArray(data[key])); ids(data[key].map(x=>x.id),type); requireThat(data.counters[type]===data[key].length);
  }
  data.messages.forEach(validateMessage); data.observations.forEach(validateObservation); data.claims.forEach(validateClaim); data.permissions.forEach(validatePermission);
  const actors=new Set(pkg.actors.map(a=>a.id));
  const sourceExists=s=>({event:data.events,message:data.messages,action_result:data.actionResults}[s.kind] || []).some(x=>x.id===s.id);
  for (const o of data.observations) { requireThat(actors.has(o.observerId) && sourceExists(o.source)); o.roots.forEach(s=>requireThat(sourceExists(s))); }
  for (const m of data.messages) requireThat(actors.has(m.outward.senderId) && m.outward.recipientIds.every(x=>actors.has(x)) && (m.contextMessageId===null || data.messages.some(x=>x.id===m.contextMessageId)));
  for (const p of data.permissions) requireThat(data.messages.some(m=>m.id===p.sourceMessageId && m.outward.act==='explain_access') && p.targetId===pkg.bindings.handlingId && p.scope==='relevant_records');
  for (const c of data.claims) requireThat(data.messages.some(m=>m.id===c.messageId) && c.observationIds.every(x=>data.observations.some(o=>o.id===x)));
  for (const r of data.actionResults) requireThat(r.request.actorId===data.humanId && r.request.targetId===pkg.bindings.handlingId && r.effects.length===0);
  requireThat(data.events.every((e,index)=>e.sequence===index+1) && data.sequence===data.events.length);
  fields(data.opportunities,['used','allowance','noPressure']); integer(data.opportunities.used); requireThat(data.opportunities.allowance===pkg.initial.softAllowance && typeof data.opportunities.noPressure==='boolean');
  requireThat(data.opportunities.used===data.episodes.length+data.actionResults.length);
  requireThat(data.decisions.length===data.episodes.length && data.messages.length===data.episodes.length*2);
  for (const e of data.episodes) requireThat(data.decisions.some(d=>d.id===e.decisionId) && data.messages.some(m=>m.id===e.incomingMessageId) && data.messages.some(m=>m.id===e.replyMessageId));
  return true;
}

export function renderEpisode(run,episodeId) {
  const episode=run.data.episodes.find(e=>e.id===episodeId); requireThat(Boolean(episode));
  const reply=run.data.messages.find(m=>m.id===episode.replyMessageId);
  return freeze({episodeId,intake:copy(episode.intake),delivery:{description:episode.delivery.description,text:describeOutward(reply.outward)},control:'player'});
}
export function inspectRun(run,sealed) {
  return authorInspector({sessionId:run.id,revision:run.revision,packageRef:run.packageRef,
    initialOccurrences:run.data.events.filter(e=>e.type.startsWith('initial_')).map(e=>({id:e.id,type:e.type,sequence:e.sequence})),
    canonicalMessages:run.data.messages,permissions:run.data.permissions,actionResults:run.data.actionResults,observations:run.data.observations,claims:run.data.claims,
    decisions:run.data.decisions.map(d=>({...copy(d),actualListenerInput:decisionInput(run.data,sealed.content,d.messageId,d.inputObservationIds)})),
    episodes:run.data.episodes,commits:run.journal.map(j=>({commandId:j.command.id,revision:j.receipt.committedRevision,changes:j.receipt.result.changes})),
    materialState:{ownerId:run.data.world.ownerId,holderId:run.data.world.holderId,quantity:run.data.world.quantity,balanceMinor:run.data.world.balanceMinor},
    withheld:[{subjectId:sealed.content.bindings.contactId,detail:'Protected contact value',receivedByPlayer:false,reason:'No supported disclosure grants this value.'}],
    hypotheses:[],beliefs:[],note:'The clerk acknowledges a heard report without asserting firsthand reading or a private player motive.'});
}
export function exportRun(run,sealed) { validateRun(run); validateDomain(run.data,sealed.content); return copy({schema:'encounter-save@2',package:sealed,run}); }
export async function importRun(input,expectedPackage) {
  canonicalJson(input); fields(input,['schema','package','run']); requireThat(input.schema==='encounter-save@2','UNSUPPORTED_SAVE');
  const pkg=await verifyPackage(input.package); requireThat(canonicalJson(pkg.ref)===canonicalJson(expectedPackage.ref),'PACKAGE_MISMATCH');
  validateRun(input.run); requireThat(canonicalJson(input.run.packageRef)===canonicalJson(pkg.ref),'PACKAGE_MISMATCH'); validateDomain(input.run.data,pkg.content);
  let replay=await startEncounter(pkg,{runId:input.run.id,noPressure:input.run.data.opportunities.noPressure});
  for (const entry of input.run.journal) { const result=dispatch(replay,pkg,entry.command); requireThat(result.status==='committed','INVALID_SAVE'); replay=result.run; }
  requireThat(canonicalJson(replay)===canonicalJson(input.run),'INVALID_SAVE'); return replay;
}
