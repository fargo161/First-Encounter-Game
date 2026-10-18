import {copy,freeze,canonicalJson} from '../contracts.mjs';
import {importRun,inspectRun,playerView} from '../m3/engine.mjs';
import {projectAtlas} from '../ar0/atlas.mjs';
import {makePersonView} from './person-view.mjs';

export async function digest(value){
 const bytes=new TextEncoder().encode(canonicalJson(value));
 return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
}

/** An in-memory reader. The public surface contains no command, write or repair operation. */
export async function openAtlas(saved,catalog,{audience='author'}={}){
 const input=freeze(copy(saved)),names=freeze(copy(catalog)),before=canonicalJson({input,names});
 const run=await importRun(input,input.package);
 const projection=await projectAtlas(run,input.package,names,{audience});
 const trace=audience==='author'?inspectRun(run,input.package):null;
 const received=playerView(run),snapshotDigest=await digest(input),catalogDigest=await digest(names);
 const binding=new Map();
 for(const entity of names.entities)for(const ref of [entity.source,...entity.aliases])binding.set(ref.kind+':'+ref.id,entity.id);
 const cards=new Map(projection.cards.map(c=>[c.id,c]));
 const labelMap=new Map((audience==='author'?[...input.package.content.actors,...input.package.content.subjects]:[...received.references,...received.participants]).map(x=>[x.id,x.label]));
 const nameCounts=new Map();for(const c of projection.cards.filter(c=>c.kind==='person'))nameCounts.set(c.displayName,(nameCounts.get(c.displayName)??0)+1);
 const label=id=>{
  const card=cards.get(binding.get('actor:'+id)??binding.get('subject:'+id));
  return card?(card.kind==='person'&&nameCounts.get(card.displayName)>1?card.displayName+' (identity '+card.id+')':card.displayName):labelMap.get(id)??'Untranslated Encounter detail';
 };
 const sourceRecord=ref=>{
  if(!trace)return null;
  if(ref.kind==='event')return run.data.events.find(e=>e.id===ref.id)??null;
  if(ref.kind==='message')return trace.canonicalMessages.find(m=>m.id===ref.id)??null;
  if(ref.kind==='action_result')return trace.actionResults.find(r=>r.id===ref.id)??null;
  if(ref.kind==='world')return {itemId:run.data.world.itemId,ownerId:run.data.world.ownerId,holderId:run.data.world.holderId,quantity:run.data.world.quantity};
  return null;
 };
 const sourcePath=(ref,observations=[])=>{
  const full=sourceRecord(ref),local=observations.filter(o=>o.source.kind===ref.kind&&o.source.id===ref.id);
  const visibleMessage=ref.kind==='message'?projection.cards.find(c=>c.kind==='event'&&c.sourceRefs.some(s=>s.kind==='message'&&s.id===ref.id))?.state.details?.communication:null;
  const message=full?.outward??local.find(o=>o.receivedDetails.communication)?.receivedDetails.communication??local.find(o=>o.receivedDetails.ownCommunication)?.receivedDetails.ownCommunication??visibleMessage??null;
  const eventCard=ref.kind==='event'?cards.get(binding.get('historical_event:'+ref.id))??projection.cards.find(c=>c.kind==='event'&&c.sourceRefs.some(s=>s.kind==='event'&&s.id===ref.id)):null;
  const title=ref.kind==='message'?(message?'Communication from '+label(message.senderId):'Communication'):ref.kind==='action_result'?'Physical result':ref.kind==='world'?'Relevant current ownership and holding state':ref.kind==='event'?(eventCard?.displayName??'Recorded occurrence'):'Untranslated Encounter detail';
  const historical=full?.type?.startsWith('authored_')||eventCard?.state.eventClass==='authored_history';
  return {title,period:ref.kind==='world'?'Current state':historical?'Before this run':full||message||local.length?'During this run':'Earlier source citation',citation:copy(ref),receivedFragments:local.map(o=>({observationId:o.id,channel:o.channel,receivedDetails:copy(o.receivedDetails)})),fullDeveloperRecord:copy(full),access:audience==='author'?'Full developer source is separate from the received fragments.':'Only received fragments are shown. An earlier citation does not reveal its full contents.'};
 };
 const context={audience,viewLabel:audience==='author'?'Full developer view':'Player-received view',foundationRevision:'AR0-projection-v1-R1-D01',foundationSourceDigest:'8dd542efed9f74573bcb1913d367f7c791d63c3830d65b7f35f68abdcb92f09c',runId:run.id,revision:run.revision,packageRef:copy(projection.context.packageRef),catalogId:names.id,catalogDigest,snapshotDigest};
 const tools={audience,label,sourcePath,context,binding,entities:names.entities,projection};
 const people=projection.cards.filter(c=>c.kind==='person').map(c=>makePersonView(c,tools));
 const duplicateNames=new Map();for(const p of people)duplicateNames.set(p.name,(duplicateNames.get(p.name)??0)+1);
 for(const p of people)p.sharedName=duplicateNames.get(p.name)>1;
 const model=freeze({context,people,technicalDefects:copy(projection.technicalDefects??[])});
 async function integrity(){
  const unchanged=before===canonicalJson({input,names})&&canonicalJson(run)===canonicalJson(input.run);
  return freeze({unchanged,snapshotDigest:await digest(input),catalogDigest:await digest(names),revision:run.revision,journalEntries:run.journal.length,packageDigest:input.package.ref.digest});
 }
 if(!(await integrity()).unchanged)throw Error('ATLAS_READ_PURITY_FAILURE');
 return freeze({model,integrity});
}

export function explainValidation(error){
 const code=error?.code??error?.message??'INVALID_INPUT';
 const text=code.includes('ACTOR_CARD_BINDING')||code.includes('DUPLICATE_CARD_SOURCE')?'Conflicting Person identity. This input cannot be inspected.':code.includes('PACKAGE')?'The saved run and names/catalog do not match the supplied content.':code.includes('SAVE')||code.includes('RUN')?'This saved run could not be validated by replay.':code.includes('REFERENCE')||code.includes('SOURCE')?'An invalid or missing reference prevents inspection.':code.includes('JSON')||error instanceof SyntaxError?'The file does not contain a supported saved run or catalog.':'This input failed Encounter validation. No Person information has been displayed.';
 return {text,code:String(code)};
}
