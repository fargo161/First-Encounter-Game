import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const home=path.dirname(fileURLToPath(import.meta.url)),root=path.join(home,'checkpoint'),out=path.join(home,'evidence'),load=n=>import(pathToFileURL(path.join(root,n)));
const A=await load('src/ar0/atlas.mjs'),E=await load('src/m3/engine.mjs'),M=await load('src/m3/meaning.mjs'),T=await load('src/m3/types.mjs');
const authored=JSON.parse(await fs.readFile(path.join(root,'content/m3/seed.json'),'utf8')),catalog=JSON.parse(await fs.readFile(path.join(root,'content/ar0/last-collection.json'),'utf8')),pkg=await T.sealPackage(authored),rule=pkg.content.initial.rule;
assert.equal(pkg.ref.digest,'2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f');
let counter=0xb100;const cid=()=>`command_${(++counter).toString(16)}`,cp=structuredClone,canon=T.canonicalJson;
function commit(s,p,c){const x=E.dispatch(s,p,c);assert.equal(x.status,'committed',x.code);return x.run;}
function send(s,p,act,extra={}){return commit(s,p,E.prepareSend(s,p,M.draft(act,extra),cid()));}
function act(s,p,kind){const a=p.content.actions.find(x=>x.kind===kind);return commit(s,p,E.prepareAction(s,p,a.id,cid()));}
const request=(s,p,operation='inspect',scope=null)=>send(s,p,'request_access',{operation,targetId:p.content.initial.rule.recordId,scopeId:scope??E.playerView(s).rule?.relevantScopeId??p.content.initial.rule.recordId});
const switchTo=(s,p,id)=>commit(s,p,E.prepareSessionOperation(s,p,'switch_partner',id,cid()));
async function stages(p=pkg){
 const r=p.content.initial.rule,initial=await E.startEncounter(p);let s=act(initial,p,'verify_authority');s=request(s,p);const opened=s;s=act(s,p,'inspect');s=act(s,p,'search');s=switchTo(s,p,r.witnessId);s=send(s,p,'ask_whereabouts',{operation:'ask',targetId:r.itemId,scopeId:r.itemId});s=switchTo(s,p,r.custodianId);const learned=s;
 s=send(s,p,'ask_whereabouts',{operation:'ask',targetId:r.ownerTopicId,scopeId:r.ownerTopicId});s=request(s,p,'inspect',r.wholeScopeId);const warned=s;s=request(s,p,'compare');const repaired=s;s=act(s,p,'compare');const pending=s;s=send(s,p,'yes',{targetId:r.itemId,scopeId:r.itemId});const yes=s;s=commit(s,p,E.prepareConfirmation(s,p,cid()));const recovery=s;s=request(s,p,'inspect',r.protectedScopeIds[0]);return {initial,opened,learned,warned,repaired,pending,yes,recovery,post:s};
}
const s=await stages(),project=(run,c=catalog,audience='author',p=pkg,extra={})=>A.projectAtlas(run,p,c,{audience,...extra}),events=p=>p.cards.filter(c=>c.kind==='event'),ids=p=>p.cards.map(c=>c.id),newEntity=(id,kind='person',scenarioRefs=[])=>({id,kind,source:{kind:'authored',id},aliases:[],displayName:'Neutral '+id,description:'Descriptive fixture, not mutable truth.',scenarioRefs,disclosure:'public',tags:[]});
const baseline={};for(const n of ['initial','warned','pending','recovery','post'])baseline[n]={author:await project(s[n]),player:await project(s[n],catalog,'player')};
const save=async(n,v)=>fs.writeFile(path.join(out,n+'.json'),JSON.stringify(v,null,2)+'\n');
test('IA0-01 duplicate/case-colliding card IDs, bindings, aliases and links reject',()=>{
 const mutations=[c=>c.entities.push(cp(c.entities[0])),c=>c.entities.push(newEntity(c.entities[0].id.toUpperCase())),c=>{const e=cp(c.entities[0]);e.id='independent_duplicate';c.entities.push(e);},c=>c.entities[0].aliases.push(cp(c.entities[1].source)),c=>{const l={id:'REL_TEST',relationKind:'related_to',fromRef:c.entities[0].id,toRef:c.entities[1].id,description:'Neutral',authority:'Independent fixture'};c.links.push(l,{...l,id:'rel_test'});}];
 for(const mutate of mutations){const c=cp(catalog);mutate(c);assert.throws(()=>A.validateCatalog(c,pkg,s.initial));}
});
test('IA0-02 missing canonical source, endpoint, scenario, kind and wrong package fail validation',async()=>{
 const mutations=[c=>c.entities[0].source.id='actor_ffff',c=>c.entities[0].scenarioRefs.push('absent_scenario'),c=>c.activeScenarioId=c.entities[0].id,c=>c.runtimePlaceRef=c.entities[0].id,c=>c.entities[0].kind='invalid',c=>c.packageRef.digest='f'.repeat(64),c=>c.links.push({id:'bad_link',relationKind:'related_to',fromRef:c.entities[0].id,toRef:'absent',description:'Neutral',authority:'Fixture'})];
 for(const mutate of mutations){const c=cp(catalog);mutate(c);await assert.rejects(project(s.initial,c));}
});
test('IA0-03 one shared Person, global unindexed card, neutral Group and zero authored scenario groups',async()=>{
 const c=cp(catalog),scenario=newEntity('neutral_scenario','scenario'),global=newEntity('global_person'),group=newEntity('neutral_group','group');c.entities.push(scenario,global,group);c.entities.find(e=>e.id===rule.custodianId).scenarioRefs.push(scenario.id);c.links.push({id:'membership',relationKind:'member_of',fromRef:global.id,toRef:group.id,description:'Neutral membership',authority:'Independent fixture'});
 const p=await project(s.initial,c);assert.equal(p.cards.filter(x=>x.id===rule.custodianId).length,1);assert.ok(p.scenarioIndex.every(x=>x.cardRefs.includes(rule.custodianId)));assert.ok(p.scenarioIndex.every(x=>!x.cardRefs.includes(global.id)&&!x.cardRefs.includes(group.id)));assert.equal(baseline.initial.author.cards.filter(x=>x.kind==='group').length,0);
});
test('IA0-04 renaming every semantic card ID preserves kinds and shared-source meaning',async()=>{
 const c=cp(catalog),mapping=new Map(c.entities.map((e,i)=>[e.id,'node_'+(0xc000+i).toString(16)]));for(const e of c.entities){e.id=mapping.get(e.id);e.scenarioRefs=e.scenarioRefs.map(x=>mapping.get(x));}c.activeScenarioId=mapping.get(c.activeScenarioId);c.runtimePlaceRef=mapping.get(c.runtimePlaceRef);for(const l of c.links){l.fromRef=mapping.get(l.fromRef);l.toRef=mapping.get(l.toRef);}const p=await project(s.recovery,c);assert.equal(p.cards.length,baseline.recovery.author.cards.length);assert.equal(p.links.find(l=>l.relationKind==='owns').fromRef,mapping.get(rule.ownerId));assert.equal(p.links.find(l=>l.relationKind==='holds').fromRef,mapping.get(authored.humanId));assert.equal(new Set(ids(p)).size,p.cards.length);
});
test('IA0-05 canonical full-ID/prose renaming and label-only renaming preserve identity rules',async()=>{
 let body=JSON.stringify(authored),meta=JSON.stringify(catalog);const refs=[...new Set(body.match(/\b(?:actor|subject|action|fact|service|package)_[0-9a-f]{4}\b/g))];for(const id of refs){const next=id.replace(/_([0-9a-f]+)$/,(_,v)=>'_'+(parseInt(v,16)+0x700).toString(16).padStart(4,'0'));body=body.replaceAll(id,next);meta=meta.replaceAll(id,next);}const content=JSON.parse(body);content.title='Neutral independent situation';content.actors.forEach((a,i)=>a.label='Independent person '+i);content.subjects.forEach((a,i)=>a.label='Independent subject '+i);const p=await T.sealPackage(content),c=JSON.parse(meta);c.packageRef=cp(p.ref);const renamed=await stages(p),proof=await project(renamed.recovery,c,'author',p);assert.equal(proof.worldTruth.recovered,true);assert.equal(proof.links.find(l=>l.relationKind==='owns').fromRef,p.content.initial.ownerId);
 const labels=cp(authored);labels.actors.forEach((a,i)=>a.label='Label '+i);labels.subjects.forEach((a,i)=>a.label='Description '+i);const lp=await T.sealPackage(labels),lc=cp(catalog);lc.packageRef=cp(lp.ref);const initial=await E.startEncounter(lp);assert.deepEqual(ids(await project(initial,lc,'author',lp)),ids(baseline.initial.author));
});
test('IA0-06 concealed truth/unknown names do not leak to initial or warned player projections',async()=>{
 const content=cp(authored);content.facts.find(f=>f.predicate==='protected_contact').value='UNRECEIVED-CONTACT-SENTINEL';content.facts.find(f=>f.predicate==='movement_reason').value='UNRECEIVED-CAUSE-SENTINEL';content.subjects.find(x=>x.id==='subject_000f').label='UNRECEIVED-PLACE-SENTINEL';const p=await T.sealPackage(content),c=cp(catalog);c.packageRef=cp(p.ref);const runs=await stages(p);
 for(const n of ['initial','warned']){const projection=await project(runs[n],c,'player',p);assert.ok(!canon(projection).includes('UNRECEIVED-'));const stripped=cp(projection);delete stripped.context;const original=cp(baseline[n].player);delete original.context; // command IDs differ, so compare semantic private-free observations rather than fabricated total equality.
 assert.equal(projection.worldTruth,undefined);assert.ok(projection.cards.filter(x=>x.kind==='person'&&x.id!==content.humanId).every(x=>Object.keys(x.state).length===0));}
 assert.ok(canon(await project(runs.initial,c,'author',p)).includes('UNRECEIVED-CONTACT-SENTINEL'));
});
test('IA0-07 private canonical aliases/historical prose do not override player-received names',async()=>{
 const c=cp(catalog);for(const e of c.entities){if(e.kind==='event'){e.displayName='UNSEEN-HISTORY';e.description='UNSEEN-HISTORY';e.tags=['UNSEEN-HISTORY'];}else if(['actor','subject'].includes(e.source.kind))e.displayName='UNSEEN-ALIAS';}for(const run of [s.initial,s.warned,s.pending,s.recovery,s.post]){const p=await project(run,c,'player');assert.ok(!canon(p).includes('UNSEEN-'));}
});
test('IA0-08 private NPC local observations/beliefs remain separate; absent owner and human have no invented psychology',()=>{
 const p=baseline.warned.author,w=p.cards.find(c=>c.id===rule.witnessId),cl=p.cards.find(c=>c.id===rule.custodianId),owner=p.cards.find(c=>c.id===rule.ownerId),human=p.cards.find(c=>c.id===authored.humanId);assert.ok(w.state.observations.every(o=>o.observerId===rule.witnessId));assert.ok(cl.state.observations.every(o=>o.observerId===rule.custodianId));assert.ok(!w.state.beliefs.some(b=>b.predicate==='storage_location'));assert.equal(owner.state.observations.length,0);assert.deepEqual(human.state.beliefs,[]);assert.deepEqual(human.state.hypotheses,[]);assert.ok(!Object.hasOwn(human.state,'motive'));assert.ok(!Object.hasOwn(human.state,'feelings'));
});
test('IA0-09 report attribution and historical source citations do not dereference hidden payloads',async()=>{
 const p=await project(s.learned,catalog,'player');assert.ok(p.links.some(l=>l.relationKind==='reported_about'&&l.fromRef===rule.witnessId&&l.epistemic==='report'));const history=p.cards.find(c=>c.id==='event_0002');assert.equal(history.state.epistemic,'report');assert.ok(!canon(history).includes('spill_protection'));assert.ok(!canon(history).includes('storage_location'));assert.ok(p.links.filter(l=>l.epistemic==='belief'||l.epistemic==='hypothesis').length===0);
});
test('IA0-10 ownership/custody, permission/action, acknowledgment/confirmation and correction remain distinct',async()=>{
 const initial=baseline.initial.author,done=baseline.recovery.author;assert.equal(initial.links.find(l=>l.relationKind==='owns').fromRef,rule.ownerId);assert.notEqual(initial.links.find(l=>l.relationKind==='holds').fromRef,rule.ownerId);assert.equal(done.links.find(l=>l.relationKind==='owns').fromRef,rule.ownerId);assert.equal(done.links.find(l=>l.relationKind==='holds').fromRef,authored.humanId);assert.deepEqual(s.pending.data.world,s.yes.data.world);assert.equal(s.opened.data.world.comparisonComplete,false);assert.equal(s.recovery.data.world.recordCorrected,false);assert.equal(s.recovery.data.world.balances[authored.humanId],1200);assert.equal(done.recentChanges.filter(c=>c.kind==='custody_changed').length,1);
});
test('IA0-11 initial/warned/pending/recovery/post save-load, determinism and complete input purity',async()=>{
 for(const [name,run] of Object.entries(s)){const before=canon({run,pkg,catalog}),saved=E.exportRun(run,pkg),loaded=await E.importRun(saved,pkg);for(const audience of ['author','player']){assert.deepEqual(await project(run,catalog,audience),await project(loaded,catalog,audience));}assert.equal(canon({run,pkg,catalog}),before);}
});
test('IA0-12 every exact command retry leaves Event cards and recent changes unchanged',async()=>{
 for(const j of s.recovery.journal){const x=E.dispatch(s.recovery,pkg,j.command);assert.equal(x.status,'replayed');assert.deepEqual(await project(x.run),baseline.recovery.author);}
});
test('IA0-13 drafts, reads, rejected commands, context switching create no invented world Events',async()=>{
 const before=await project(s.warned);for(let i=0;i<3;i++){E.prepareSend(s.warned,pkg,M.draft('request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}),cid());E.inspectRun(s.warned,pkg);for(const e of s.warned.data.episodes)E.renderEpisode(s.warned,e.id);}assert.deepEqual(await project(s.warned),before);
 let context=switchTo(s.warned,pkg,rule.witnessId);context=switchTo(context,pkg,rule.custodianId);assert.deepEqual(events(await project(context)).map(e=>e.id),events(before).map(e=>e.id));assert.deepEqual((await project(context,catalog,'author',pkg,{sinceRevision:s.warned.revision})).recentChanges,[]);
 const stale=cp(E.prepareConfirmation(s.pending,pkg,cid()));stale.expectedRevision--;const rejected=E.dispatch(s.pending,pkg,stale);assert.equal(rejected.status,'rejected');assert.deepEqual(await project(rejected.run),baseline.pending.author);
});
test('IA0-14 meaningful runtime Event IDs, causes and order survive append; authored events cannot be invented',async()=>{
 const p=baseline.recovery.author;for(const e of events(p).filter(e=>e.state.cause)){assert.ok(s.recovery.journal.some(j=>j.command.id===e.state.cause.commandId&&j.receipt.committedRevision===e.state.cause.revision));assert.ok(e.sourceRefs.some(x=>x.kind==='event'&&s.recovery.data.events.some(o=>o.id===x.id)));}const previous=events(baseline.pending.author).map(e=>e.id);assert.ok(previous.every(id=>p.cards.some(c=>c.id===id)));const orders=events(p).map(e=>e.state.order);assert.deepEqual(orders,[...orders].sort((a,b)=>a-b));const c=cp(catalog);c.entities.push(newEntity('invented_history','event'));assert.throws(()=>A.validateCatalog(c,pkg,s.initial));
});
test('IA0-15 repeated default run labels with distinct actual commands yield distinct runtime occurrences',async()=>{
 const a=commit(s.initial,pkg,E.prepareAction(s.initial,pkg,rule.verifyActionId,'command_ff01')),b=commit(s.initial,pkg,E.prepareAction(s.initial,pkg,rule.verifyActionId,'command_ff02'));assert.equal(a.id,b.id);const pa=await project(a),pb=await project(b);assert.ok(events(pa).filter(e=>e.state.cause).every(e=>!pb.cards.some(c=>c.id===e.id)));
});
test('IA0-16 recent changes obey every cursor, preserve committed causes and never duplicate',async()=>{
 const all=baseline.recovery.author.recentChanges;for(let revision=0;revision<=s.recovery.revision;revision++){const p=await project(s.recovery,catalog,'author',pkg,{sinceRevision:revision});assert.deepEqual(p.recentChanges,all.filter(x=>x.revision>revision));}for(const c of all)assert.ok(s.recovery.journal.some(j=>j.command.id===c.sourceRefs[0].id&&j.receipt.committedRevision===c.revision));assert.equal(new Set(all.map(c=>c.id)).size,all.length);for(const bad of [-1,0.5,NaN,s.recovery.revision+1])await assert.rejects(project(s.recovery,catalog,'author',pkg,{sinceRevision:bad}));
});
test('IA0-17 articles/network agree with the sole normalized link set and all endpoint references',()=>{
 for(const pair of Object.values(baseline))for(const p of Object.values(pair)){const n=A.networkFromAtlas(p),md=A.renderAtlasMarkdown(p);assert.deepEqual(n.links,p.links);for(const l of p.links){assert.ok(ids(p).includes(l.fromRef)&&ids(p).includes(l.toRef));assert.ok(md.includes(l.id));assert.ok(p.cards.find(c=>c.id===l.fromRef).linkRefs.includes(l.id));assert.ok(p.cards.find(c=>c.id===l.toRef).linkRefs.includes(l.id));}assert.ok(Object.isFrozen(n.links));}
});
test('IA0-18 corrupted run/catalog/package and audience are rejected without mutable Atlas state',async()=>{
 const run=cp(s.warned);run.data.visits[0].repairUsed=true;await assert.rejects(project(run));const c=cp(catalog);c.links.push({id:'fake_owner',relationKind:'owns',fromRef:rule.custodianId,toRef:rule.itemId,description:'Not authority',authority:'Adversarial fixture'});await assert.rejects(project(s.warned,c));await assert.rejects(project(s.warned,catalog,'npc'));assert.deepEqual(await project(s.warned),baseline.warned.author);
});
test('IA0-19 recovery remains protected and each audience exposes only supported knowledge',()=>{
 assert.deepEqual(s.recovery.data.world,s.post.data.world);for(const [name,pair] of Object.entries(baseline)){assert.ok(!canon(pair.player).includes('PRIVATE-M3-FIXTURE'));assert.equal(pair.player.worldTruth,undefined);assert.ok(pair.player.cards.filter(c=>c.kind==='person'&&c.id!==authored.humanId).every(c=>Object.keys(c.state).length===0));}const x=baseline.recovery.player.recentChanges.find(c=>c.kind==='custody_changed');assert.equal(x.details.ownershipChanged,false);assert.equal(x.details.ownerRef,rule.ownerId);assert.equal(x.details.holderRef,authored.humanId);assert.equal(x.details.paidMinor,0);
});
test('IA0-20 catalog metadata is descriptive trusted input, not a second mutable world or policy branch',async()=>{
 const c=cp(catalog);c.entities.find(e=>e.id===rule.itemId).description='Independent presentation wording';const before=canon(s.recovery),p=await project(s.recovery,c);assert.equal(p.worldTruth.ownerId,rule.ownerId);assert.equal(p.worldTruth.holderId,authored.humanId);assert.equal(canon(s.recovery),before);const text=await fs.readFile(path.join(root,'src/ar0/atlas.mjs'),'utf8');assert.ok(!/\b(Tamsin|Orrin|Nera|Last Collection|pathfinding|lineOfSight|RoomCreator)\b/.test(text));
});
test('IA0-21 preserve independent intermediate runs and both proof audiences for inspection',async()=>{
 for(const n of ['initial','warned','pending','recovery','post']){await save('independent-api-'+n,E.exportRun(s[n],pkg));for(const audience of ['author','player'])await save('independent-api-'+n+'-'+audience,baseline[n][audience]);}assert.equal(s.recovery.data.world.recovered,true);
});
