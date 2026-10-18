import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as A from '../src/ar0/atlas.mjs';
import {E,pkg,rule,authored,learned} from './m3-fixtures.mjs';
const catalog=JSON.parse(await fs.readFile(new URL('../content/ar0/last-collection.json',import.meta.url),'utf8'));
const initial=await E.startEncounter(pkg),known=await learned(),clone=()=>structuredClone(catalog);
const conflict=()=>{const c=clone();c.entities=c.entities.filter(e=>e.source.id!==rule.witnessId);c.entities.find(e=>e.source.id===rule.ownerId).aliases.push({kind:'actor',id:rule.witnessId});return c;};
const invalid=c=>assert.throws(()=>A.validateCatalog(c,pkg,initial),/CONFLICTING_ACTOR_CARD_BINDING|DUPLICATE_CARD_SOURCE|MISSING_ACTOR_CARD_BINDING/);
test('AR0-D01-01 actor A cannot alias actor B Person, regardless of entity order',()=>{
 for(const a of pkg.content.actors)for(const b of pkg.content.actors.filter(b=>b.id!==a.id))for(const reverse of [false,true]){
  const c=clone();c.entities=c.entities.filter(e=>e.source.id!==b.id);c.entities.find(e=>e.source.id===a.id).aliases.push({kind:'actor',id:b.id});if(reverse)c.entities.reverse();invalid(c);
 }
});
test('AR0-D01-02 two different actor aliases cannot bind an authored Person',()=>{
 const c=clone(),actors=pkg.content.actors.slice(0,2);c.entities=c.entities.filter(e=>!actors.some(a=>a.id===e.source.id));
 c.entities.push({id:'neutral_person',kind:'person',source:{kind:'authored',id:'neutral'},aliases:actors.map(a=>({kind:'actor',id:a.id})),displayName:'Neutral',description:'Fixture',scenarioRefs:[],disclosure:'author',tags:[]});invalid(c);
});
test('AR0-D01-03 exact independent conflicting catalog rejects before either audience projects',async()=>{
 const c=JSON.parse(await fs.readFile(new URL('../independent/ar0-review/evidence/alias-trust-catalog.json',import.meta.url),'utf8'));
 invalid(c);for(const audience of ['author','player'])await assert.rejects(A.projectAtlas(known,pkg,c,{audience}),/CONFLICTING_ACTOR_CARD_BINDING/);
});
test('AR0-D01-04 missing actor binding and duplicate actor cards reject',()=>{
 for(const a of pkg.content.actors){const c=clone();c.entities=c.entities.filter(e=>e.source.id!==a.id);invalid(c);}
 const c=clone(),p=structuredClone(c.entities.find(e=>e.kind==='person'));p.id='duplicate_person';c.entities.push(p);invalid(c);
});
test('AR0-D01-05 witness observations and beliefs never install under absent owner',async()=>{
 const before=structuredClone(known);await assert.rejects(A.projectAtlas(known,pkg,conflict()),/CONFLICTING_ACTOR_CARD_BINDING/);assert.deepEqual(known,before);
 const p=await A.projectAtlas(known,pkg,catalog),owner=p.cards.find(c=>c.id===rule.ownerId),witness=p.cards.find(c=>c.id===rule.witnessId);
 assert.equal(owner.state.actorKind,'absent');assert.deepEqual(owner.state.observations,[]);assert.deepEqual(owner.state.beliefs,[]);assert.ok(witness.state.observations.length>0);assert.ok(witness.state.observations.every(o=>o.observerId===rule.witnessId));assert.ok(witness.state.beliefs.every(b=>b.holderId===rule.witnessId));
});
test('AR0-D01-06 witness report remains attributed to canonical speaker for both audiences',async()=>{
 for(const audience of ['author','player']){const p=await A.projectAtlas(known,pkg,catalog,{audience}),links=p.links.filter(l=>l.relationKind==='reported_about');assert.ok(links.length>0);assert.ok(links.every(l=>l.fromRef!==rule.ownerId));assert.ok(links.some(l=>l.fromRef===rule.witnessId));}
});
test('AR0-D01-07 owner topic alias and additional non-actor aliases remain supported',async()=>{
 const c=clone(),owner=c.entities.find(e=>e.source.id===rule.ownerId);assert.ok(owner.aliases.some(a=>a.kind==='subject'&&a.id===rule.ownerTopicId));owner.aliases.push({kind:'authored',id:'neutral_owner_reference'});
 assert.equal(A.validateCatalog(c,pkg,initial),true);const p=await A.projectAtlas(known,pkg,c);assert.equal(p.cards.filter(e=>e.id===owner.id).length,1);assert.equal(p.cards.find(e=>e.id===owner.id).state.actorKind,'absent');
});
test('AR0-D01-08 one actor can have multiple non-actor references and memberships',async()=>{
 const c=clone(),person=c.entities.find(e=>e.source.id===rule.witnessId);person.aliases.push({kind:'authored',id:'same_person_ref_one'},{kind:'authored',id:'same_person_ref_two'});
 c.entities.push({id:'second_scenario',kind:'scenario',source:{kind:'authored',id:'second_scenario'},aliases:[],displayName:'Neutral scenario',description:'Fixture',scenarioRefs:[],disclosure:'public',tags:[]});person.scenarioRefs.push('second_scenario');
 const p=await A.projectAtlas(known,pkg,c);assert.equal(p.cards.filter(x=>x.id===person.id).length,1);assert.ok(p.scenarioIndex.every(s=>s.cardRefs.includes(person.id)));assert.ok(p.cards.find(x=>x.id===person.id).state.observations.every(o=>o.observerId===rule.witnessId));
});
test('AR0-D01-09 defensive production registry refuses ambiguous or mismatched actor identity',async()=>{
 const text=await fs.readFile(new URL('../src/ar0/atlas.mjs',import.meta.url),'utf8'),start=text.indexOf('function registry('),end=text.indexOf('\nfunction eventSources',start);
 const registry=Function('key',`return (${text.slice(start,end)});`)(r=>r.kind+':'+r.id),r=registry(conflict(),pkg);
 assert.equal(r.matchesActor(rule.ownerId,rule.ownerId),false);assert.equal(r.matchesActor(rule.ownerId,rule.witnessId),false);
 const good=registry(catalog,pkg);assert.equal(good.matchesActor(rule.ownerId,rule.ownerId),true);assert.equal(good.matchesActor(rule.ownerId,rule.witnessId),false);
 // Exercise the exact production resolver assertion even if a future validator regresses.
 const body=text.slice(text.indexOf(' const cardRef='),text.indexOf('\n const addLink='));
 const resolveCard=Function('resolve','matchesActor','cardMap','requireThat',body+';return cardRef;')(r.resolve,r.matchesActor,new Map(catalog.entities.map(e=>[e.id,e])),(ok,code)=>assert.ok(ok,code));
 assert.throws(()=>resolveCard('actor',rule.witnessId),/ACTOR_CARD_BINDING_MISMATCH/);assert.throws(()=>resolveCard('actor',rule.ownerId),/ACTOR_CARD_BINDING_MISMATCH/);
});
test('AR0-D01-10 valid actor alias with non-actor primary remains a single canonical Person',async()=>{
 const c=clone(),person=c.entities.find(e=>e.source.id===rule.witnessId);person.aliases.push(person.source);person.source={kind:'authored',id:'witness_description'};person.displayName='Neutral witness';
 assert.equal(A.validateCatalog(c,pkg,known),true);const p=await A.projectAtlas(known,pkg,c);assert.ok(p.cards.find(e=>e.id===person.id).state.observations.every(o=>o.observerId===rule.witnessId));
});
