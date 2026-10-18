import {canonicalJson,copy,freeze,fields,requireThat,text,integer} from '../contracts.mjs';
import {verifyPackage} from '../m3/types.mjs';
import {validateRun} from '../runtime.mjs';
import * as E from '../m3/engine.mjs';

export const CARD_KINDS=freeze(['person','place','thing','group','event','scenario']);
const key=r=>r.kind+':'+r.id;
const eq=(a,b)=>canonicalJson(a)===canonicalJson(b);
const stableId=s=>{requireThat(typeof s==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,179}$/.test(s),'INVALID_ATLAS_ID');};
const uniq=values=>[...new Set(values)];
const ordered=values=>values.sort((a,b)=>(a.kind??'').localeCompare(b.kind??'','en')||(a.kind==='event'?a.state.order-b.state.order:0)||a.id.localeCompare(b.id,'en'));
const source=(kind,id)=>({kind,id});
const identifier=(type,...parts)=>type+':'+parts.map(encodeURIComponent).join(':');
const runtimeId=(run,event)=>{
 const commandId=run.data.messages.find(m=>m.id===event.details.messageId)?.commandId??run.data.actionResults.find(r=>r.id===event.details.resultId)?.request.commandId;
 requireThat(Boolean(commandId),'UNANCHORED_RUNTIME_EVENT');
 return identifier('runtime',run.packageRef.id,run.id,commandId,event.id);
};
const staticRelations=['associated_with','related_to','works_at','member_of','affiliated_with','happened_at'];

/** Descriptive catalog only. Ownership/custody and other mutable facts are forbidden here. */
export function validateCatalog(c,pkg,run){
 canonicalJson(c);fields(c,['schema','id','revision','packageRef','activeScenarioId','runtimePlaceRef','entities','links']);
 requireThat(c.schema==='encounter-atlas-catalog@1','UNSUPPORTED_ATLAS_CATALOG');stableId(c.id);integer(c.revision);
 requireThat(eq(c.packageRef,pkg.ref),'ATLAS_PACKAGE_MISMATCH');requireThat(Array.isArray(c.entities)&&Array.isArray(c.links));
 const entities=new Map(),bindings=new Map();
 for(const entity of c.entities){
  fields(entity,['id','kind','source','aliases','displayName','description','scenarioRefs','disclosure','tags']);
  stableId(entity.id);requireThat(!entity.id.startsWith('runtime:'),'RESERVED_ATLAS_ID');
  const folded=entity.id.toLowerCase();requireThat(!entities.has(folded),'DUPLICATE_ATLAS_ID');entities.set(folded,entity);
  requireThat(CARD_KINDS.includes(entity.kind),'INVALID_CARD_KIND');text(entity.description,600);
  if(entity.kind==='event')requireThat(entity.source.kind==='historical_event','UNANCHORED_AUTHORED_EVENT');
  if(entity.displayName!==null)text(entity.displayName,160);
  requireThat(Array.isArray(entity.tags)&&new Set(entity.tags).size===entity.tags.length);entity.tags.forEach(t=>text(t,60));
  requireThat(['public','known_reference','author'].includes(entity.disclosure));
  requireThat(Array.isArray(entity.scenarioRefs)&&new Set(entity.scenarioRefs).size===entity.scenarioRefs.length);entity.scenarioRefs.forEach(stableId);
  requireThat(Array.isArray(entity.aliases));
  let canonicalActor=null;
  for(const r of [entity.source,...entity.aliases]){
   fields(r,['kind','id']);stableId(r.id);requireThat(['actor','subject','historical_event','package','authored'].includes(r.kind),'INVALID_CARD_SOURCE');
   const k=key(r).toLowerCase();requireThat(!bindings.has(k),'DUPLICATE_CARD_SOURCE');bindings.set(k,entity.id);
   if(r.kind==='actor'){
    requireThat(entity.kind==='person'&&pkg.content.actors.some(a=>a.id===r.id),'INVALID_CARD_REFERENCE');
    requireThat(canonicalActor===null||canonicalActor===r.id,'CONFLICTING_ACTOR_CARD_BINDING');canonicalActor=r.id;
   }
   if(r.kind==='subject')requireThat(pkg.content.subjects.some(s=>s.id===r.id),'INVALID_CARD_REFERENCE');
   if(r.kind==='historical_event')requireThat(entity.kind==='event'&&run.data.events.some(e=>e.id===r.id&&e.type.startsWith('authored_')),'INVALID_CARD_REFERENCE');
   if(r.kind==='package')requireThat(entity.kind==='scenario'&&r.id===pkg.ref.id,'INVALID_CARD_REFERENCE');
  }
  if(entity.disclosure==='public')requireThat(['authored','package'].includes(entity.source.kind),'INVALID_PUBLIC_METADATA');
  if(['authored','historical_event'].includes(entity.source.kind))requireThat(entity.displayName!==null,'MISSING_CARD_NAME');
 }
 for(const actor of pkg.content.actors)requireThat(bindings.has(key(source('actor',actor.id)).toLowerCase()),'MISSING_ACTOR_CARD_BINDING');
 const find=id=>entities.get(String(id).toLowerCase());
 requireThat(find(c.activeScenarioId)?.id===c.activeScenarioId&&find(c.activeScenarioId).kind==='scenario','INVALID_SCENARIO_REFERENCE');
 if(c.runtimePlaceRef!==null)requireThat(find(c.runtimePlaceRef)?.id===c.runtimePlaceRef&&find(c.runtimePlaceRef).kind==='place','INVALID_PLACE_REFERENCE');
 for(const e of c.entities)for(const ref of e.scenarioRefs)requireThat(find(ref)?.id===ref&&find(ref).kind==='scenario','INVALID_SCENARIO_REFERENCE');
 const linkIds=new Set();
 for(const l of c.links){
  fields(l,['id','relationKind','fromRef','toRef','description','authority']);stableId(l.id);text(l.description,600);text(l.authority,300);
  requireThat(!linkIds.has(l.id.toLowerCase()),'DUPLICATE_LINK_ID');linkIds.add(l.id.toLowerCase());
  requireThat(staticRelations.includes(l.relationKind),'MUTABLE_OR_UNSUPPORTED_AUTHORED_LINK');
  requireThat(find(l.fromRef)?.id===l.fromRef&&find(l.toRef)?.id===l.toRef,'INVALID_LINK_ENDPOINT');
 }
 return true;
}

function registry(c,pkg){
 const bySource=new Map();for(const e of c.entities)for(const r of [e.source,...e.aliases])bySource.set(key(r),e.id);
 const actorsByCard=new Map(c.entities.map(e=>[e.id,new Set([e.source,...e.aliases].filter(r=>r.kind==='actor').map(r=>r.id))]));
 const matchesActor=(ref,id)=>actorsByCard.get(ref)?.size===1&&actorsByCard.get(ref).has(id);
 const resolve=(kind,id)=>bySource.get(key({kind,id}))??null;
 const label=e=>e.displayName??(e.source.kind==='actor'?pkg.content.actors.find(a=>a.id===e.source.id).label:e.source.kind==='subject'?pkg.content.subjects.find(s=>s.id===e.source.id).label:pkg.content.title);
 return {resolve,label,matchesActor};
}
function eventSources(e,d){
 if(e.type==='message_sent'||e.type==='response_delivered')return [source('event',e.id),source('message',e.details.messageId)];
 if(e.type==='physical_result_committed')return [source('event',e.id),source('action_result',e.details.resultId)];
 return [source('event',e.id)];
}
function matchingObservations(e,observations,d){
 const refs=eventSources(e,d);return observations.filter(o=>refs.some(r=>eq(r,o.source))||o.roots.some(root=>refs.some(r=>eq(root,r))));
}
function isMeaningful(e,d){
 if(e.type.startsWith('authored_'))return true;
 if(['message_sent','response_delivered'].includes(e.type))return true; // Actual received/sent social acts, not compose/preview UI.
 return e.type==='physical_result_committed'&&d.actionResults.find(r=>r.id===e.details.resultId)?.outcome==='performed';
}
async function framesFor(run,pkg){
 let current=await E.startEncounter(pkg,{runId:run.id,noPressure:run.data.opportunities.noPressure});const frames=[];
 for(const j of run.journal){const before=current,result=E.dispatch(current,pkg,j.command);requireThat(result.status==='committed','INVALID_ATLAS_RUN');current=result.run;frames.push({before,after:current,command:j.command,receipt:j.receipt});}
 requireThat(eq(current,run),'INVALID_ATLAS_RUN');return frames;
}

/** Pure, detached projection. No Atlas store and no mutation/commit API exist. */
export async function projectAtlas(run,sealed,catalog,{audience='author',sinceRevision=0}={}){
 requireThat(['author','player'].includes(audience),'INVALID_ATLAS_AUDIENCE');integer(sinceRevision);requireThat(sinceRevision<=run.revision,'INVALID_CHANGE_CURSOR');
 const pkg=await verifyPackage(sealed);validateRun(run);requireThat(eq(run.packageRef,pkg.ref),'ATLAS_PACKAGE_MISMATCH');E.validateDomain(run.data,pkg.content);validateCatalog(catalog,pkg,run);
 const frames=await framesFor(run,pkg),d=run.data,author=audience==='author',human=d.humanId,{resolve,label,matchesActor}=registry(catalog,pkg);
 const local=d.observations.filter(o=>o.observerId===human),pv=E.playerView(run),known=new Set(pv.references.map(r=>r.id)),people=new Set(pv.participants.map(a=>a.id));
 const visibleMessages=new Set(pv.messages.map(m=>m.id));
 const visibleEvent=e=>author||matchingObservations(e,local,d).length>0||visibleMessages.has(e.details.messageId);
 const allowed=e=>author||e.disclosure==='public'||e.disclosure==='known_reference'&&[e.source,...e.aliases].some(r=>r.kind==='actor'?people.has(r.id):r.kind==='subject'?known.has(r.id):r.kind==='historical_event'?visibleEvent(d.events.find(x=>x.id===r.id)):false);
 const receivedLabels=new Map([...pv.references,...pv.participants].map(r=>[r.id,r.label]));
 const receivedName=e=>[e.source,...e.aliases].map(r=>receivedLabels.get(r.id)).find(Boolean);
 const cards=catalog.entities.filter(allowed).map(e=>({id:e.id,kind:e.kind,displayName:!author&&e.kind==='event'?'Referenced historical occurrence':!author&&['actor','subject'].includes(e.source.kind)?receivedName(e):label(e),description:!author&&e.kind==='event'?'Only the received fragments citing this occurrence are shown; unseen details remain unavailable.':e.description,tags:!author&&e.kind==='event'?[]:copy(e.tags),scenarioRefs:copy(e.scenarioRefs),sourceRefs:[copy(e.source)],linkRefs:[],state:{}}));
 const cardMap=new Map(cards.map(c=>[c.id,c])),links=[],recentChanges=[],eventMap=new Map();
 const cardRef=(kind,id)=>{
  const ref=resolve(kind,id);
  if(kind==='actor'&&ref)requireThat(matchesActor(ref,id)&&(!cardMap.has(ref)||cardMap.get(ref).kind==='person'),'ACTOR_CARD_BINDING_MISMATCH');
  return cardMap.has(ref)?ref:null;
 };
 const addLink=(id,relationKind,fromRef,toRef,epistemic,provenance,details={})=>{if(fromRef&&toRef&&cardMap.has(fromRef)&&cardMap.has(toRef))links.push({id,relationKind,fromRef,toRef,epistemic,provenance:copy(provenance),details:copy(details)});};
 for(const e of d.events.filter(e=>isMeaningful(e,d)&&visibleEvent(e))){
  const historical=e.type.startsWith('authored_'),eid=historical?resolve('historical_event',e.id):runtimeId(run,e);
  if(!eid)continue;
  const observations=author?d.observations:local,matches=matchingObservations(e,observations,d),message=d.messages.find(m=>m.id===e.details.messageId),result=d.actionResults.find(r=>r.id===e.details.resultId);
  const commandId=message?.commandId??result?.request.commandId??null,commit=commandId?run.journal.find(j=>j.command.id===commandId):null;
  const direct=matches.filter(o=>eventSources(e,d).some(r=>eq(r,o.source))),reported=matches.filter(o=>!direct.includes(o));
  const participants=message?uniq([message.outward.senderId,...message.outward.recipientIds]):result&&(author||result.request.actorId===human)?[result.request.actorId]:[];
  const observers=result?(author?result.observerDetails.map(o=>o.observerId):result.observerDetails.filter(o=>o.observerId===human).map(o=>o.observerId)):[];
  const participantRefs=participants.map(id=>cardRef('actor',id)).filter(Boolean),observerRefs=observers.map(id=>cardRef('actor',id)).filter(Boolean),placeRef=cardMap.has(catalog.runtimePlaceRef)?catalog.runtimePlaceRef:null;
  let details,displayName,description,epistemic;
  if(historical){details=author?copy(e.details):{receivedFragments:matches.map(o=>({observationId:o.id,channel:o.channel,details:copy(o.receivedDetails),roots:copy(o.roots)}))};epistemic=author?'world_truth':direct.length?'observation':'report';}
  else if(message){details={communication:copy(message.outward)};displayName=message.outward.act.replaceAll('_',' ');description=message.outward.content.text;epistemic='communication';}
  else{details=author?{result:copy(result)}:{observedResult:{id:result.id,outcome:result.outcome,received:result.observerDetails.filter(o=>o.observerId===human).map(o=>copy(o.details))}};displayName=author?pkg.content.actions.find(a=>a.id===result.request.actionType).label:'Observed physical result';description=author?`A committed ${result.outcome} action result.`:result.observerDetails.find(o=>o.observerId===human)?.details.conduct??'A physical result was received.';epistemic=author?'physical_result':'observation';}
  const referenced=new Set();const collect=value=>{if(typeof value==='string'){const ref=cardRef('subject',value);if(ref)referenced.add(ref);}else if(value&&typeof value==='object')Object.values(value).forEach(collect);};collect(details);
  const thingRefs=[...referenced].filter(ref=>cardMap.get(ref).kind==='thing').sort();
  const state={eventClass:historical?'authored_history':message?'committed_communication':'performed_action',order:e.sequence,epistemic,sourceRefs:eventSources(e,d),cause:commandId?{commandId,revision:commit.receipt.committedRevision}:null,participantRefs,observerRefs,thingRefs,placeRef:historical?null:placeRef,details};
  if(historical){const card=cardMap.get(eid);if(!card)continue;card.state=state;}
  else{const card={id:eid,kind:'event',displayName,description,tags:[],scenarioRefs:[catalog.activeScenarioId],sourceRefs:eventSources(e,d),linkRefs:[],state};requireThat(!cardMap.has(eid),'DUPLICATE_RUNTIME_EVENT');cards.push(card);cardMap.set(eid,card);}
  for(const ref of eventSources(e,d))eventMap.set(key(ref),eid);
  for(const ref of participantRefs)addLink(identifier('link','participant',eid,ref),message?'communicated_in':'performed_in',ref,eid,epistemic,{sourceRefs:state.sourceRefs});
  for(const ref of thingRefs)addLink(identifier('link','thing',eid,ref),'references_thing',eid,ref,epistemic,{sourceRefs:state.sourceRefs});
  if(!historical&&placeRef)addLink(identifier('link','place',eid),'happened_at',eid,placeRef,'authored_context',{sourceRefs:state.sourceRefs,catalogId:catalog.id});
 }
 // Metadata links are explicitly authored context. Mutable ownership/custody never comes from this list.
 for(const l of catalog.links)addLink(identifier('link','catalog',l.id),l.relationKind,l.fromRef,l.toRef,'authored_context',{catalogId:catalog.id,authority:l.authority},{description:l.description});
 const personRecords=author?pkg.content.actors.filter(a=>a.kind!=='absent'||cardRef('actor',a.id)):pkg.content.actors.filter(a=>a.id===human);
 for(const actor of personRecords){
  const personRef=cardRef('actor',actor.id);if(!personRef)continue;
  const observations=d.observations.filter(o=>o.observerId===actor.id),observationIds=new Set(observations.map(o=>o.id));
  const claims=d.claims.filter(c=>c.recipientIds.includes(actor.id)&&c.observationIds.every(id=>observationIds.has(id)));
  const beliefs=author&&actor.kind==='npc'?d.beliefs.filter(b=>b.holderId===actor.id):[],hypotheses=author&&actor.kind==='npc'?d.hypotheses.filter(h=>h.holderId===actor.id):[];
  cardMap.get(personRef).state={actorKind:actor.kind,observations:copy(observations),receivedClaims:copy(claims),beliefs:copy(beliefs),hypotheses:copy(hypotheses),permissions:copy(author?d.permissions.filter(p=>p.granteeId===actor.id):pv.permissions),visit:author?copy(d.visits.find(v=>v.holderId===actor.id)??null):null};
  for(const o of observations){
   const eventRef=eventMap.get(key(o.source));
   addLink(identifier('link','observation',o.id),'received_observation',personRef,eventRef,'observation',{observerId:actor.id,sourceRefs:[o.source],observationIds:[o.id],roots:o.roots},{channel:o.channel,details:o.receivedDetails});
   for(const [i,e] of (o.receivedDetails.evidence??[]).entries())addLink(identifier('link','evidence',o.id,i),'received_evidence',personRef,cardRef('subject',e.subjectId),e.form==='report'?'report':'observation',{observerId:actor.id,sourceRefs:[o.source],observationIds:[o.id],roots:e.roots},{...e});
  }
  for(const claim of claims)for(const root of claim.roots){const eventRef=eventMap.get(key(root));addLink(identifier('link','claim',claim.id,actor.id,key(root)),'was_told_about',personRef,eventRef,'report',{observerId:actor.id,sourceRefs:[source('message',claim.messageId)],claimIds:[claim.id],roots:claim.roots},{speakerRef:cardRef('actor',claim.speakerId),evidence:claim.evidence});addLink(identifier('link','reporter',claim.id,actor.id,key(root)),'reported_about',cardRef('actor',claim.speakerId),eventRef,'report',{sourceRefs:[source('message',claim.messageId)],claimIds:[claim.id],roots:claim.roots},{recipientRef:personRef});}
  for(const b of beliefs)addLink(identifier('link','belief',b.id),'believes_about',personRef,cardRef('subject',b.subjectId)??catalog.activeScenarioId,'belief',{observerId:actor.id,sourceRefs:b.roots,beliefIds:[b.id],observationIds:b.observationIds},b);
  for(const h of hypotheses)addLink(identifier('link','hypothesis',h.id),'hypothesizes_about',personRef,cardRef('actor',h.targetId),'hypothesis',{observerId:actor.id,hypothesisIds:[h.id],observationIds:h.supportObservationIds},h);
 }
 const itemRef=cardRef('subject',d.world.itemId);
 if(author){
  const provenance={sourceRefs:[source('world',run.id)],path:'world'};
  addLink(identifier('link','owner',d.world.itemId),'owns',cardRef('actor',d.world.ownerId),itemRef,'world_truth',provenance,{quantity:d.world.quantity});
  const holder=cardRef('actor',d.world.holderId)??cardRef('subject',d.world.holderId);addLink(identifier('link','holder',d.world.itemId),'holds',holder,itemRef,'world_truth',provenance,{quantity:d.world.quantity});
  if(cardMap.get(holder)?.kind==='place')addLink(identifier('link','location',d.world.itemId),'located_at',itemRef,holder,'world_truth',provenance);
 }else{
  const authority=local.flatMap(o=>o.receivedDetails.authority?[{o,value:o.receivedDetails.authority}]:[]).at(-1),handover=local.flatMap(o=>o.receivedDetails.handover?[{o,value:o.receivedDetails.handover}]:[]).at(-1),owner=handover??authority;
  if(owner)addLink(identifier('link','owner',d.world.itemId),'owns',cardRef('actor',owner.value.ownerId),itemRef,'observation',{sourceRefs:[owner.o.source],observationIds:[owner.o.id]});
  if(handover)addLink(identifier('link','holder',d.world.itemId),'holds',cardRef('actor',handover.value.holderId),itemRef,'observation',{sourceRefs:[handover.o.source],observationIds:[handover.o.id]});
 }
 // Derive recent changes from real committed frames; no mutable parallel feed exists.
 for(const frame of frames){
  const revision=frame.receipt.committedRevision;if(revision<=sinceRevision)continue;
  const before=frame.before.data,after=frame.after.data,commandId=frame.command.id;
  const push=(kind,id,summary,details,refs=[],actorRef=null,targetRef=null)=>recentChanges.push({id:identifier('change',commandId,kind,id),revision,kind,summary,details:copy(details),actorRef,targetRef,sourceRefs:[source('command',commandId),...refs]});
  const fresh=after.observations.filter(o=>!before.observations.some(p=>p.id===o.id)&&(author||o.observerId===human));
  for(const o of fresh)for(const [i,e] of (o.receivedDetails.evidence??[]).entries())push('received_evidence',o.id+':'+i,`${cardMap.get(cardRef('actor',o.observerId))?.displayName??'An observer'} received a ${e.form} fragment: ${e.label}`,{form:e.form,evidence:e,observerId:o.observerId},[o.source,source('observation',o.id)],cardRef('actor',o.observerId),cardRef('subject',e.subjectId));
  for(const p of after.permissions){const old=before.permissions.find(o=>o.id===p.id);if(eq(old??null,p))continue;if(!author&&(p.granteeId!==human||!pv.permissions.some(x=>x.id===p.id)))continue;push('permission_changed',p.id,'A bounded action permission changed; the action itself is separate.',p,[p.source,source('permission',p.id)],cardRef('actor',p.granteeId),cardRef('subject',p.targetId));}
  for(const v of after.visits){const old=before.visits.find(p=>p.holderId===v.holderId);if(!old)continue;
   if(!author&&!pv.messages.some(m=>m.id===v.warningMessageId))continue;
   if(v.warningMessageId!==old.warningMessageId)push('warning_delivered',v.warningMessageId,'A visit-long warning was delivered.',{warningMessageId:v.warningMessageId},[source('message',v.warningMessageId)],cardRef('actor',v.holderId));
   if(v.repairUsed&&!old.repairUsed)push('repair_resolved',v.holderId,'Substantive repair restored the relevant route; the warning remains.',{warningMessageId:v.warningMessageId},[],cardRef('actor',v.holderId));
  }
  for(const r of after.actionResults.filter(r=>!before.actionResults.some(old=>old.id===r.id))){
   const received=r.observerDetails.find(o=>o.observerId===human);if(!author&&!received)continue;
   push('physical_result',r.id,'An actual physical result was committed.',author?r:{id:r.id,outcome:r.outcome,receivedDetails:received.details},[source('action_result',r.id)],cardRef('actor',r.request.actorId),cardRef('subject',r.request.targetId));
   const handover=received?.details.handover;
   if(r.effects.some(e=>e.type==='custody_transfer')&&(author||handover))push('custody_changed',r.id,'Custody changed; ownership remained unchanged.',{itemRef,holderRef:cardRef('actor',after.world.holderId)??cardRef('subject',after.world.holderId),ownerRef:cardRef('actor',after.world.ownerId),ownershipChanged:before.world.ownerId!==after.world.ownerId,paidMinor:author?r.effects.find(e=>e.type==='transfer_money')?.payload.amountMinor??0:handover.paidMinor},[source('action_result',r.id)]);
   if(r.effects.some(e=>e.type==='complete_recovery')&&(author||handover))push('recovery_completed',r.id,'Recovery completed.',{itemRef},[source('action_result',r.id)]);
  }
 }
 // One shared link set supports articles and networks. Scenario cards index existing cards.
 for(const card of cards){card.scenarioRefs=card.scenarioRefs.filter(ref=>cardMap.has(ref));for(const scenario of card.scenarioRefs)addLink(identifier('link','scenario',scenario,card.id),'relevant_to',card.id,scenario,'authored_context',{catalogId:catalog.id});}
 const ids=new Set();for(const l of links){requireThat(!ids.has(l.id),'DUPLICATE_PROJECTED_LINK');ids.add(l.id);cardMap.get(l.fromRef).linkRefs.push(l.id);if(l.toRef!==l.fromRef)cardMap.get(l.toRef).linkRefs.push(l.id);}
 const scenarioIndex=cards.filter(c=>c.kind==='scenario').map(s=>({scenarioRef:s.id,cardRefs:cards.filter(c=>c.scenarioRefs.includes(s.id)).map(c=>c.id).sort()}));
 const status=author?{recovered:d.world.recovered,serviceOpen:d.world.serviceOpen,comparisonComplete:d.world.comparisonComplete,recordCorrected:d.world.recordCorrected}: {recovered:pv.recovered,serviceClosed:pv.serviceClosed,comparisonComplete:pv.comparisonComplete,recordCorrected:pv.recordCorrected};
 if(cardMap.has(catalog.activeScenarioId))cardMap.get(catalog.activeScenarioId).state={status,pendingOffer:copy(author?d.offers.find(o=>o.id===d.activeOfferId)??null:pv.activeOffer)};
 const catalogDigest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonicalJson(catalog))))].map(v=>v.toString(16).padStart(2,'0')).join('');
 const projection={schema:'encounter-atlas-projection@1',projectionAudience:audience,context:{catalogId:catalog.id,catalogRevision:catalog.revision,catalogDigest,packageRef:copy(pkg.ref),runId:run.id,revision:run.revision,sinceRevision},cards:ordered(cards),links:ordered(links),scenarioIndex,recentChanges,...(author?{worldTruth:copy(d.world),technicalDefects:copy(d.defects)}:{playerState:{recovered:pv.recovered,serviceClosed:pv.serviceClosed,comparisonComplete:pv.comparisonComplete,recordCorrected:pv.recordCorrected,balanceMinor:pv.balanceMinor,warningMessageId:pv.warningMessageId}})};
 validateProjection(projection);return freeze(projection);
}
export function validateProjection(p){
 const cards=new Map();for(const c of p.cards){requireThat(!cards.has(c.id.toLowerCase()),'DUPLICATE_PROJECTED_CARD');cards.set(c.id.toLowerCase(),c);requireThat(CARD_KINDS.includes(c.kind));text(c.displayName,400);}
 const links=new Map();for(const l of p.links){requireThat(!links.has(l.id),'DUPLICATE_PROJECTED_LINK');links.set(l.id,l);requireThat(cards.get(l.fromRef.toLowerCase())?.id===l.fromRef&&cards.get(l.toRef.toLowerCase())?.id===l.toRef,'INVALID_LINK_ENDPOINT');}
 for(const c of p.cards)for(const id of c.linkRefs)requireThat(links.has(id)&&(links.get(id).fromRef===c.id||links.get(id).toRef===c.id),'INVALID_CARD_LINK');
 for(const c of p.cards)for(const ref of c.scenarioRefs)requireThat(cards.get(ref.toLowerCase())?.kind==='scenario','INVALID_SCENARIO_REFERENCE');
 requireThat(new Set(p.recentChanges.map(c=>c.id)).size===p.recentChanges.length,'DUPLICATE_CHANGE');return true;
}
export function networkFromAtlas(projection){validateProjection(projection);return freeze({nodes:projection.cards.map(c=>({id:c.id,kind:c.kind,label:c.displayName})),links:copy(projection.links)});}
export function renderAtlasMarkdown(p){
 validateProjection(p);const names=new Map(p.cards.map(c=>[c.id,c.displayName])),lines=['# Atlas-readiness proof',`Audience: ${p.projectionAudience} · Run: ${p.context.runId} · Revision: ${p.context.revision}`,'','Derived read-only from Encounter; this is a proof export, not Atlas UI.',''];
 for(const c of p.cards){lines.push(`## ${c.displayName}`,`Identity: ${c.id} · Kind: ${c.kind}`,'',c.description,'');for(const id of c.linkRefs){const l=p.links.find(l=>l.id===id);lines.push(`- ${names.get(l.fromRef)} → ${l.relationKind} → ${names.get(l.toRef)} [${l.epistemic}; ${l.id}]`);}if(Object.keys(c.state).length)lines.push('','```json',JSON.stringify(c.state,null,2),'```');lines.push('');}
 lines.push('## Recent meaningful changes','');for(const c of p.recentChanges)lines.push(`- Revision ${c.revision}: ${c.summary} [${c.id}]`);
 return lines.join('\n')+'\n';
}
