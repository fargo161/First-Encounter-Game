import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import * as A from './checkpoint/src/ar0/atlas.mjs';
import * as E from './checkpoint/src/m3/engine.mjs';
const home=path.dirname(fileURLToPath(import.meta.url)),root=path.join(home,'checkpoint'),out=path.join(home,'evidence'),proof=path.join(home,'proofs');
await fs.mkdir(proof,{recursive:true});
const saved=JSON.parse(await fs.readFile(path.join(root,'independent/ar0-review/evidence/ui-warned.json'),'utf8')),pkg=saved.package,run=await E.importRun(saved,pkg),rule=pkg.content.initial.rule;
const base=JSON.parse(await fs.readFile(path.join(root,'content/ar0/last-collection.json'),'utf8')),bad=JSON.parse(await fs.readFile(path.join(root,'independent/ar0-review/evidence/alias-trust-catalog.json'),'utf8')),actors=pkg.content.actors,cp=structuredClone;
const before=JSON.stringify({saved,run,pkg,base,bad}),record=[];
const entity=(c,id)=>c.entities.find(e=>[e.source,...e.aliases].some(r=>r.kind==='actor'&&r.id===id));
const project=(c=base,audience='author')=>A.projectAtlas(run,pkg,c,{audience});
const valid=c=>A.validateCatalog(c,pkg,run);
const rejected=(c,code)=>assert.throws(()=>valid(c),e=>e.message.includes(code));
const drop=(c,id)=>{const old=entity(c,id).id;c.entities=c.entities.filter(e=>e.id!==old);c.links=c.links.filter(l=>l.fromRef!==old&&l.toRef!==old);};
function assertLocal(p,c){
 for(const a of actors){const card=p.cards.find(x=>x.id===entity(c,a.id).id);if(!card)continue;
  if(p.projectionAudience==='player'&&a.id!==run.data.humanId){assert.deepEqual(card.state,{});continue;}
  assert.equal(card.state.actorKind,a.kind);assert.deepEqual(card.state.observations,run.data.observations.filter(o=>o.observerId===a.id));
  assert.ok(card.state.beliefs.every(b=>b.holderId===a.id));assert.ok(card.state.hypotheses.every(h=>h.holderId===a.id));
 }
 for(const l of p.links.filter(l=>l.relationKind==='reported_about')){
  const m=run.data.messages.find(m=>l.provenance.sourceRefs.some(s=>s.kind==='message'&&s.id===m.id));assert.ok(m);assert.equal(l.fromRef,entity(c,m.outward.senderId).id);
 }
}
test('IAR1-01 exact original conflict rejects at validation and both audience boundaries, without mutation',async()=>{
 rejected(bad,'CONFLICTING_ACTOR_CARD_BINDING');for(const audience of ['author','player'])await assert.rejects(project(bad,audience),/CONFLICTING_ACTOR_CARD_BINDING/);assert.equal(JSON.stringify({saved,run,pkg,base,bad}),before);
});
test('IAR1-02 every ordered actor pair conflicts with both entity and alias order reversed',()=>{
 let vectors=0;for(const a of actors)for(const b of actors.filter(b=>b.id!==a.id))for(const reverse of [false,true]){
  const c=cp(base);drop(c,b.id);const card=entity(c,a.id);card.aliases.push({kind:'actor',id:b.id});if(reverse){c.entities.reverse();card.aliases.reverse();}rejected(c,'CONFLICTING_ACTOR_CARD_BINDING');vectors++;
 }record.push({check:'actor-primary conflicts',vectors});
});
test('IAR1-03 alias-only Persons cannot bind distinct actors under arbitrary neutral labels and IDs',()=>{
 let vectors=0;for(const a of actors)for(const b of actors.filter(b=>b.id!==a.id))for(const reverse of [false,true]){
  const c=cp(base),model=cp(entity(c,a.id));drop(c,a.id);drop(c,b.id);model.id='neutral_binding';model.source={kind:'authored',id:'neutral_description'};model.displayName='Unrelated label';model.scenarioRefs=[];model.aliases=[{kind:'actor',id:a.id},{kind:'actor',id:b.id}];if(reverse)model.aliases.reverse();c.entities.push(model);rejected(c,'CONFLICTING_ACTOR_CARD_BINDING');vectors++;
 }record.push({check:'alias-only conflicts',vectors});
});
test('IAR1-04 canonical actor cannot be duplicated across separate Persons',()=>{
 for(const a of actors){const c=cp(base),model=cp(entity(c,a.id));model.id='independent_duplicate';model.aliases=[];c.entities.push(model);rejected(c,'DUPLICATE_CARD_SOURCE');}
});
test('IAR1-05 actor binding is total and rejects missing, unknown, wrong-case and wrong-kind references',()=>{
 for(const a of actors){let c=cp(base);drop(c,a.id);rejected(c,'MISSING_ACTOR_CARD_BINDING');
  for(const id of ['actor_dead',a.id.toUpperCase()]){c=cp(base);entity(c,a.id).source.id=id;assert.throws(()=>valid(c));}
  c=cp(base);entity(c,a.id).kind='thing';rejected(c,'INVALID_CARD_REFERENCE');
 }
});
test('IAR1-06 all normal Person local records and report sources match canonical actors',async()=>{
 for(const audience of ['author','player']){const p=await project(base,audience);assertLocal(p,base);const owner=p.cards.find(c=>c.id===entity(base,rule.ownerId).id);if(audience==='author'){assert.equal(owner.state.actorKind,'absent');assert.deepEqual(owner.state.observations,[]);assert.deepEqual(owner.state.beliefs,[]);}assert.ok(p.links.some(l=>l.relationKind==='reported_about'&&l.fromRef===entity(base,rule.witnessId).id));}
});
test('IAR1-07 a valid single actor alias on non-actor primary retains canonical local identity',async()=>{
 const c=cp(base);for(const a of actors){const p=entity(c,a.id);p.aliases.push(p.source);p.source={kind:'authored',id:'description_'+a.id};p.displayName='Independent Person '+a.id;}assert.equal(valid(c),true);for(const audience of ['author','player'])assertLocal(await project(c,audience),c);
});
test('IAR1-08 owner-topic and many non-actor aliases remain valid without extra state installation',async()=>{
 const c=cp(base),owner=entity(c,rule.ownerId);assert.ok(owner.aliases.some(r=>r.kind==='subject'&&r.id===rule.ownerTopicId));
 owner.aliases.push({kind:'authored',id:'owner_reference_one'},{kind:'authored',id:'owner_reference_two'});assert.equal(valid(c),true);const p=await project(c);assertLocal(p,c);assert.equal(p.cards.filter(x=>x.id===owner.id).length,1);assert.equal(p.cards.find(x=>x.id===owner.id).state.observations.length,0);
});
test('IAR1-09 card ID/label permutation preserves local records and attributed links',async()=>{
 const c=cp(base),ids=new Map(c.entities.map((e,i)=>[e.id,'card_'+(900+i)]));
 for(const e of c.entities){e.id=ids.get(e.id);e.scenarioRefs=e.scenarioRefs.map(x=>ids.get(x));e.displayName='Neutral '+e.id;}
 for(const l of c.links){l.fromRef=ids.get(l.fromRef);l.toRef=ids.get(l.toRef);}c.activeScenarioId=ids.get(c.activeScenarioId);c.runtimePlaceRef=ids.get(c.runtimePlaceRef);c.entities.reverse();assertLocal(await project(c),c);assertLocal(await project(c,'player'),c);
});
test('IAR1-10 extra descriptive Persons and shared scenario membership do not duplicate canonical actors',async()=>{
 const c=cp(base),scenario={id:'other_scenario',kind:'scenario',source:{kind:'authored',id:'other_scenario'},aliases:[],displayName:'Other index',description:'Neutral index.',tags:[],scenarioRefs:[],disclosure:'public'};c.entities.push(scenario,{...cp(scenario),id:'descriptive_person',kind:'person',source:{kind:'authored',id:'no_canonical_actor'},displayName:'Descriptive person'});
 entity(c,rule.witnessId).scenarioRefs.push(scenario.id);const p=await project(c);assertLocal(p,c);assert.equal(p.cards.filter(x=>x.id===entity(c,rule.witnessId).id).length,1);assert.deepEqual(p.cards.find(x=>x.id==='descriptive_person').state,{});assert.ok(p.scenarioIndex.every(s=>s.cardRefs.includes(entity(c,rule.witnessId).id)));
});
test('IAR1-11 exact conflicting catalog fails both real CLIs and creates no export files',async()=>{
 for(const audience of ['author','player']){const prefix=path.join(proof,'rejected-'+audience);for(const suffix of ['.json','.md','-network.json'])await assert.rejects(fs.stat(prefix+suffix),{code:'ENOENT'});
  const args=[path.join(root,'scripts/atlas-export.mjs'),path.join(root,'independent/ar0-review/evidence/ui-warned.json'),prefix,audience,path.join(root,'independent/ar0-review/evidence/alias-trust-catalog.json')],r=spawnSync(process.execPath,args,{encoding:'utf8'});assert.equal(r.status,1);assert.match(r.stderr,/CONFLICTING_ACTOR_CARD_BINDING/);for(const suffix of ['.json','.md','-network.json'])await assert.rejects(fs.stat(prefix+suffix),{code:'ENOENT'});record.push({check:'real R1 CLI rejection',audience,argv:[process.execPath,...args],status:r.status,stdout:r.stdout,stderr:r.stderr});
 }
});
test('IAR1-12 original CLI still reproduces exact defect on frozen failed baseline',async()=>{
 for(const audience of ['author','player']){const prefix=path.join(proof,'before-'+audience),args=[path.join(home,'before/checkpoint/scripts/atlas-export.mjs'),path.join(root,'independent/ar0-review/evidence/ui-warned.json'),prefix,audience,path.join(root,'independent/ar0-review/evidence/alias-trust-catalog.json')],r=spawnSync(process.execPath,args,{encoding:'utf8'});assert.equal(r.status,0,r.stderr);const p=JSON.parse(await fs.readFile(prefix+'.json','utf8'));
  if(audience==='author'){const owner=p.cards.find(c=>c.id===rule.ownerId);assert.equal(owner.state.actorKind,'npc');assert.ok(owner.state.observations.some(o=>o.observerId===rule.witnessId));assert.ok(owner.state.beliefs.some(b=>b.holderId===rule.witnessId));}else assert.ok(p.links.some(l=>l.relationKind==='reported_about'&&l.fromRef===rule.ownerId));record.push({check:'real original CLI reproduction',audience,argv:[process.execPath,...args],status:r.status,stdout:r.stdout,stderr:r.stderr});
 }
});
test('IAR1-13 normal actual CLI exports match independent API JSON Markdown and network',async()=>{
 for(const audience of ['author','player']){const prefix=path.join(proof,'normal-'+audience),args=[path.join(root,'scripts/atlas-export.mjs'),path.join(root,'independent/ar0-review/evidence/ui-warned.json'),prefix,audience],r=spawnSync(process.execPath,args,{encoding:'utf8'});assert.equal(r.status,0,r.stderr);const p=await project(base,audience);assert.deepEqual(JSON.parse(await fs.readFile(prefix+'.json','utf8')),p);assert.equal(await fs.readFile(prefix+'.md','utf8'),A.renderAtlasMarkdown(p));assert.deepEqual(JSON.parse(await fs.readFile(prefix+'-network.json','utf8')),A.networkFromAtlas(p));assertLocal(p,base);record.push({check:'normal CLI equivalence',audience,argv:[process.execPath,...args],status:r.status,stdout:r.stdout,stderr:r.stderr});}
});
test('IAR1-14 shipped catalog author/player outputs remain byte-identical to failed checkpoint',async()=>{
 const old=await import('./before/checkpoint/src/ar0/atlas.mjs');for(const audience of ['author','player']){const p=await project(base,audience),q=await old.projectAtlas(run,pkg,base,{audience});assert.deepEqual(p,q);assert.equal(A.renderAtlasMarkdown(p),old.renderAtlasMarkdown(q));assert.deepEqual(A.networkFromAtlas(p),old.networkFromAtlas(q));}
});
test('IAR1-15 no input mutations or private-NPC record exposure in ordinary player output',async()=>{
 assert.equal(JSON.stringify({saved,run,pkg,base,bad}),before);const p=await project(base,'player');assert.equal(p.worldTruth,undefined);assert.equal(p.technicalDefects,undefined);
 for(const a of actors.filter(a=>a.id!==run.data.humanId)){const card=p.cards.find(c=>c.id===entity(base,a.id).id);if(card)assert.deepEqual(card.state,{});}
 for(const f of pkg.content.facts.filter(f=>pkg.content.protectedFactIds.includes(f.id)))assert.ok(!JSON.stringify(p).includes(String(f.value)));
 await fs.writeFile(path.join(out,'independent-r1-diagnostics.json'),JSON.stringify({result:'PASS',exactOriginalConflictRejected:true,absentOwnerObservations:run.data.observations.filter(o=>o.observerId===rule.ownerId).length,records:record},null,2)+'\n');
});
