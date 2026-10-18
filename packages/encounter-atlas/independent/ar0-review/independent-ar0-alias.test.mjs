import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const home=path.dirname(fileURLToPath(import.meta.url)),root=path.join(home,'checkpoint'),out=path.join(home,'evidence');
const A=await import(pathToFileURL(path.join(root,'src/ar0/atlas.mjs'))),E=await import(pathToFileURL(path.join(root,'src/m3/engine.mjs')));
test('IA0-22 canonical actor aliases must not move witness observations/beliefs into the absent owner or reattribute a report',async()=>{
 const saved=JSON.parse(await fs.readFile(path.join(out,'ui-warned.json'),'utf8')),run=await E.importRun(saved,saved.package),before=structuredClone(run),rule=saved.package.content.initial.rule,c=JSON.parse(await fs.readFile(path.join(root,'content/ar0/last-collection.json'),'utf8'));
 // Schema-valid edits to caller-supplied catalog only. No invented run data,
 // private-state tampering, production edit or browser geometry fabrication.
 c.entities=c.entities.filter(e=>e.id!==rule.witnessId);c.entities.find(e=>e.id===rule.ownerId).aliases.push({kind:'actor',id:rule.witnessId});
 let rejected=false,author,player;
 try{A.validateCatalog(c,saved.package,run);author=await A.projectAtlas(run,saved.package,c,{audience:'author'});player=await A.projectAtlas(run,saved.package,c,{audience:'player'});}catch(error){rejected=true;}
 assert.deepEqual(run,before);if(rejected)return; // Rejecting conflicting canonical actors is a valid safe outcome.
 const owner=author.cards.find(e=>e.id===rule.ownerId),actual={ownerPrimarySource:owner.sourceRefs,ownerDisplayName:owner.displayName,ownerActorKind:owner.state.actorKind,ownerObservationObservers:[...new Set(owner.state.observations.map(o=>o.observerId))],ownerBeliefHolders:[...new Set(owner.state.beliefs.map(b=>b.holderId))],canonicalOwnerObservationCount:run.data.observations.filter(o=>o.observerId===rule.ownerId).length,reportFromRefs:player.links.filter(l=>l.relationKind==='reported_about').map(l=>l.fromRef)};
 await fs.writeFile(path.join(out,'AR0_D01_reproducer.json'),JSON.stringify({actual,catalog:c,save:saved,runUnchanged:true},null,2)+'\n');
 assert.equal(actual.ownerActorKind,'absent','A catalog alias must not turn the canonical absent owner into the witness NPC');
 assert.deepEqual(actual.ownerObservationObservers,[],'Absent owner has received no canonical observation');
 assert.deepEqual(actual.ownerBeliefHolders,[],'Witness beliefs must not appear under the owner Person card');
 assert.ok(!actual.reportFromRefs.includes(rule.ownerId),'The owner did not send the witness report');
});
