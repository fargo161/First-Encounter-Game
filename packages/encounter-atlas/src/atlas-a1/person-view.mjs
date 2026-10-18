import {copy,canonicalJson} from '../contracts.mjs';

const distinct=refs=>[...new Map(refs.map(r=>[r.kind+':'+r.id,r])).values()];
const formNames={direct:'Direct evidence',document:'Document evidence',report:'Report',inference:'Inference'};
const channelNames={initial:'Starting information',hearing:'Received by hearing',reading:'Received by reading',sight:'Received by sight'};
const same=(a,b)=>canonicalJson(a)===canonicalJson(b);

/** Deterministic presentation only. This function never derives or revises a belief. */
export function makePersonView(card,tools){
 const {audience,label,sourcePath,context,projection}=tools,state=card.state;
 const entity=tools.entities.find(e=>e.id===card.id),actorRefs=[entity.source,...entity.aliases].filter(r=>r.kind==='actor');
 const actorId=actorRefs[0]?.id??null,mode=Object.hasOwn(state,'actorKind')?'modeled':actorId&&audience==='player'?'hidden':'unmodeled';
 const observations=state.observations??[],sections=[],sectionsById=new Map();
 const section=(id,title)=>{if(!sectionsById.has(id)){const s={id,title,rows:[]};sections.push(s);sectionsById.set(id,s);}return sectionsById.get(id);};
 const source=(record,{immediate=[],earlier=[],support=[],correction=[]}={})=>({
  immediate:distinct(immediate).map(r=>sourcePath(r,observations)),earlier:distinct(earlier).map(r=>sourcePath(r,observations)),
  support:observations.filter(o=>support.includes(o.id)).map(o=>({arrival:channelNames[o.channel]??'Untranslated Encounter detail',record:copy(o),path:sourcePath(o.source,observations)})),
  correction:observations.filter(o=>correction.includes(o.id)).map(o=>({arrival:channelNames[o.channel]??'Untranslated Encounter detail',record:copy(o),path:sourcePath(o.source,observations)})),
  note:'Repeated references to one source are not independent corroboration.',technicalRecord:copy(record)
 });
 const add=(id,title,key,text,basis,record,paths={},note='')=>section(id,title).rows.push({key,text,basis,note,source:source(record,paths)});
 const obsPaths=o=>({immediate:[o.source],earlier:o.roots.filter(r=>r.kind!==o.source.kind||r.id!==o.source.id)});
 const claims=state.receivedClaims??[],claimedMessages=new Set(claims.map(c=>c.messageId));
 const allEvidence=observations.flatMap(o=>[...(o.receivedDetails.evidence??[]),...(o.receivedDetails.communication?.content?.evidence??[])].map(e=>({e,o})));
 for(const o of observations){
  const d=o.receivedDetails,arrival=channelNames[o.channel]??'Untranslated Encounter detail';
  for(const [i,e] of (d.evidence??[]).entries()){
   if(e.form==='report'&&o.source.kind==='message'&&claimedMessages.has(o.source.id))continue;
   add(e.form==='report'?'reports':'received',e.form==='report'?'Reports received':'Received information',o.id+':e:'+i,formNames[e.form]?e.label:'Untranslated Encounter detail',formNames[e.form]??'Untranslated',e,{immediate:[o.source],earlier:e.roots},arrival+(e.form==='document'||e.predicate==='storage_location'?' · Received evidence at this saved point; this does not establish current custody.':''));
  }
  for(const [key,value] of Object.entries(d)){
   if(key==='evidence')continue;
   let text,basis=arrival,id='received',title='Received information';
   if(key==='communication'){
    if(claimedMessages.has(o.source.id))continue;
    text='Received from '+label(value.senderId)+': '+value.content.text;basis='Received communication';
   }else if(key==='ownCommunication'){
    if(value.content.evidence.length)continue; // Actual evidence-bearing outgoing reports are listed once below.
    text='Communicated to '+value.recipientIds.map(label).join(', ')+': '+value.content.text;basis='Sent communication';id='communications';title='Communications';
   }else if(key==='accountInterpretation'){text=String(value);basis='Recorded interpretation';}
   else if(key==='conduct'){text=String(value);basis='Received action description';}
   else if(key==='references'){text='References received: '+value.map(x=>x.label).join(', ');}
   else if(key==='participants'){text='People named in received information: '+value.map(x=>x.label).join(', ');}
   else if(key==='serviceRule'){text='Collection-service instructions recorded.';basis='Received instructions';}
   else if(key==='recognizedMarks'){text='Recognized document marks recorded.';}
   else if(key==='publicRule'){text=typeof value==='string'?value:'Public collection-service rule recorded.';}
   else if(key==='collection'){text='Collection information recorded.';}
   else if(key==='authority'){text=value.verified?'Collection authority verified.':'Collection authority information recorded.';}
   else if(key==='comparison'){text=value.complete?'Comparison completed.':'Comparison information recorded.';basis='Received result';}
   else if(key==='handover'){text=value.complete?'Handover completed; the collector received custody. Ownership is separate.':'Handover information recorded.';basis='Received result';}
   else if(key==='service'&&typeof value.open==='boolean'){text=value.open?'Collection service remains open.':'Collection service closed for this visit.';basis='Received result';}
   else{text='Untranslated Encounter detail';basis='Untranslated';}
   add(id,title,o.id+':'+key,text,basis,{observationId:o.id,field:key,value},obsPaths(o));
   section(id,title).rows.at(-1).secondary=['communication','conduct','references','participants','serviceRule','recognizedMarks','publicRule','collection'].includes(key);
  }
 }
 for(const claim of claims)for(const [i,e] of claim.evidence.entries())add('reports','Reports received',claim.id+':'+i,'Was told by '+label(claim.speakerId)+': '+e.label,'Report',claim,{immediate:[{kind:'message',id:claim.messageId}],earlier:claim.roots,support:claim.observationIds},'Receiving this report does not imply witnessing or believing it.');
 for(const event of projection.cards.filter(c=>c.kind==='event')){
  const m=event.state.details?.communication;if(!m||m.senderId!==actorId||!m.content.evidence.length)continue;
  for(const [i,e] of m.content.evidence.entries())add('shared','Reports and evidence shared',event.id+':'+i,(e.form==='report'?'Reported to ':'Shared evidence with ')+m.recipientIds.map(label).join(', ')+': '+e.label,e.form==='report'?'Report shared':'Evidence shared',m,{immediate:event.state.sourceRefs.filter(r=>r.kind==='message'),earlier:e.roots},'This is the evidence communicated, not proof that a recipient believed it.');
 }
 for(const b of state.beliefs??[]){
  const basis=allEvidence.filter(({e,o})=>b.observationIds.includes(o.id)&&e.subjectId===b.subjectId&&e.predicate===b.predicate&&(b.stance==='disputed'||same(e.value,b.value)));
  const labels=[...new Set(basis.map(({e})=>e.label))];
  const verb={accepted:'believes',suspected:'suspects',disputed:'has conflicting evidence'}[b.stance];
  add('beliefs','Beliefs',b.id,verb&&labels.length?card.displayName+' '+verb+': '+labels.join(' / '):'Untranslated Encounter detail',({accepted:'Believes',suspected:'Suspects',disputed:'Conflicting evidence'})[b.stance]??'Untranslated',b,{earlier:b.roots,support:b.observationIds},'An NPC conclusion from received evidence; not an assertion of objective world truth. Earlier location evidence is separate from current holding.');
 }
 for(const h of state.hypotheses??[]){
  const known=h.type==='protected_scope_interest'&&['actionable','corrected'].includes(h.band);
  const text=known?(h.band==='corrected'?card.displayName+'’s earlier concern about '+label(h.targetId)+' seeking unrelated private information was addressed.':card.displayName+' has a concern that '+label(h.targetId)+' is seeking unrelated private information.'):'Untranslated Encounter detail';
  add('concerns','Concerns',h.id,text,known?(h.band==='corrected'?'Addressed concern':'Concern'):'Untranslated',h,{support:h.supportObservationIds,correction:h.correctionObservationIds},'An interpretation of received conduct, not proof of motive. Addressing a concern does not erase its recorded history or warning.');
 }
 const staticLabels={associated_with:'Associated with',related_to:'Related to',works_at:'Works at',member_of:'Member of',affiliated_with:'Affiliated with'};
 const represented=new Set(['received_observation','received_evidence','was_told_about','reported_about','believes_about','hypothesizes_about','communicated_in','performed_in','relevant_to']);
 for(const link of projection.links.filter(l=>l.fromRef===card.id||l.toRef===card.id)){
  if(link.fromRef===card.id&&['owns','holds'].includes(link.relationKind)){
   const target=projection.cards.find(c=>c.id===link.toRef);add(link.relationKind,link.relationKind==='owns'?'Owns':'Currently holds',link.id,(link.relationKind==='owns'?'Owns: ':'Currently holds: ')+target.displayName,link.epistemic==='world_truth'?'Current state':'Received information',link,{immediate:link.provenance.sourceRefs??[]},'Ownership, current holding and information received by this person are separate.');
  }else if(staticLabels[link.relationKind]){
   const other=projection.cards.find(c=>c.id===(link.fromRef===card.id?link.toRef:link.fromRef));add('connections','Connections',link.id,(link.fromRef===card.id?'':'Incoming connection · ')+staticLabels[link.relationKind]+': '+other.displayName,'Authored context',link);
  }else if(!represented.has(link.relationKind)&&!['owns','holds'].includes(link.relationKind))add('connections','Connections',link.id,'Untranslated Encounter detail','Untranslated',link,{immediate:link.provenance.sourceRefs??[]});
 }
 const order=['received','reports','shared','beliefs','concerns','communications','owns','holds','connections'];sections.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
 const status=mode==='hidden'?'Not shown in this view':mode==='unmodeled'?'This person has no modeled local state':observations.length?'Information received in this run':'No received information recorded in this run';
 const kindLabel=mode==='hidden'?'Private local state is hidden':mode==='unmodeled'?'Descriptive Person':({human:'Player-controlled person',npc:'Modeled character',absent:'Absent from this visit'})[state.actorKind]??'Untranslated Encounter detail';
 return {id:card.id,name:card.displayName,kindLabel,mode,status,identityNote:state.actorKind==='human'?'Received information is recorded. Human beliefs, motives and feelings are not simulated.':state.actorKind==='absent'?'Absence and ownership do not imply receipt of the visit’s communications.':'',sections,sharedName:false,
  technical:{context:copy(context),person:copy(card),references:audience==='author'?copy({source:entity.source,aliases:entity.aliases}):copy({sourceRefs:card.sourceRefs})}};
}
