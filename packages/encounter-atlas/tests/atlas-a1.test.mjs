import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {openAtlas,explainValidation} from '../src/atlas-a1/adapter.mjs';
import {makePersonView} from '../src/atlas-a1/person-view.mjs';
import {renderPerson,renderPeople,renderFailure} from '../src/atlas-a1/render.mjs';
import * as E from '../src/m3/engine.mjs';
import * as A from '../src/ar0/atlas.mjs';
import {sealPackage} from '../src/m3/types.mjs';
const read=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
const catalog=await read('content/ar0/last-collection.json'),saved=await read('evidence/ar0-r1/browser/ui-warned.json'),initial=await read('evidence/ar0-r1/browser/ui-initial.json'),recovery=await read('evidence/ar0-r1/browser/ui-recovery.json'),rule=saved.package.content.initial.rule;
const reader=await openAtlas(saved,catalog),player=await openAtlas(saved,catalog,{audience:'player'}),done=await openAtlas(recovery,catalog),person=(r,id)=>r.model.people.find(p=>p.id===id),rows=p=>p.sections.flatMap(s=>s.rows),section=(p,id)=>p.sections.find(s=>s.id===id),copy=structuredClone;

test('A1-01 validates a real saved run and uses canonical Person identities',()=>{
 assert.deepEqual(reader.model.people.map(p=>p.id),catalog.entities.filter(e=>e.kind==='person').map(e=>e.id));assert.equal(reader.model.context.revision,saved.run.revision);assert.equal(reader.model.context.packageRef.digest,saved.package.ref.digest);
});
test('A1-02 Orrin shared report preserves unidentified case, direction and actual message source',()=>{
 const witness=person(reader,rule.witnessId),shared=section(witness,'shared');assert.ok(shared.rows.length);const r=shared.rows.find(r=>r.text.includes('exact identity was not established'));assert.ok(r);assert.equal(r.source.immediate[0].citation.kind,'message');assert.equal(r.source.immediate[0].fullDeveloperRecord.outward.senderId,rule.witnessId);assert.ok(r.source.earlier.some(p=>p.citation.kind==='event'));assert.ok(!r.text.includes('dry storage'));assert.ok(!r.text.includes('spill'));
});
test('A1-03 report recipient is not described as witnessing or automatically believing it',()=>{
 const human=person(reader,saved.package.content.humanId),reports=section(human,'reports');assert.ok(reports.rows.some(r=>r.text.startsWith('Was told by Orrin')));assert.ok(reports.rows.every(r=>r.note.includes('does not imply witnessing or believing')));assert.equal(section(human,'beliefs'),undefined);
});
test('A1-04 Nera remains one absent owner without witness state or invented ignorance',()=>{
 const owner=person(reader,rule.ownerId);assert.equal(reader.model.people.filter(p=>p.id===owner.id).length,1);assert.equal(owner.status,'No received information recorded in this run');assert.equal(section(owner,'received'),undefined);assert.equal(section(owner,'beliefs'),undefined);assert.ok(section(owner,'owns').rows.length);assert.equal(section(owner,'holds'),undefined);assert.ok(!/knows nothing/i.test(renderPerson(owner)));
});
test('A1-05 Tamsin belief remains separate from received evidence and objective truth',()=>{
 const p=person(reader,rule.custodianId);assert.ok(section(p,'received').rows.some(r=>r.basis==='Direct evidence'));const belief=section(p,'beliefs').rows.find(r=>r.text.includes('protect it from damp'));assert.ok(belief.text.startsWith('Tamsin believes:'));assert.ok(belief.note.includes('not an assertion of objective world truth'));assert.ok(belief.source.support.length);assert.ok(belief.source.support.every(o=>o.record.observerId===rule.custodianId));
});
test('A1-06 human receipt has no invented psychology or NPC beliefs',()=>{
 const p=person(reader,saved.package.content.humanId);assert.ok(section(p,'received').rows.length);assert.equal(section(p,'beliefs'),undefined);assert.equal(section(p,'concerns'),undefined);assert.match(p.identityNote,/not simulated/);
});
test('A1-07 player view distinguishes hidden NPC records from empty absent-person records',()=>{
 const p=person(player,rule.ownerId);assert.equal(p.mode,'hidden');assert.equal(p.status,'Not shown in this view');assert.equal(person(reader,rule.ownerId).mode,'modeled');assert.equal(section(p,'beliefs'),undefined);
});
test('A1-08 a descriptive Person has unmodeled state, not a negative knowledge claim',async()=>{
 const c=copy(catalog);c.entities.push({id:'neutral_person',kind:'person',source:{kind:'authored',id:'neutral'},aliases:[],displayName:'Neutral descriptive Person',description:'Test fixture only.',scenarioRefs:[],disclosure:'public',tags:[]});const r=await openAtlas(initial,c);const p=person(r,'neutral_person');assert.equal(p.mode,'unmodeled');assert.equal(p.status,'This person has no modeled local state');
});
test('A1-09 duplicate display names remain independently selectable by stable identity',async()=>{
 const c=copy(catalog);c.entities.filter(e=>e.kind==='person').forEach(e=>e.displayName='Shared name');const r=await openAtlas(saved,c);assert.equal(r.model.people.length,4);assert.ok(r.model.people.every(p=>p.sharedName));const html=renderPeople(r.model.people,rule.ownerId);for(const p of r.model.people)assert.ok(html.includes('data-person="'+p.id+'"'));assert.equal(person(r,rule.ownerId).status,'No received information recorded in this run');assert.ok(section(person(r,rule.witnessId),'shared').rows.length);
});
test('A1-10 generic display renaming does not alter stable identities or sources',async()=>{
 const c=copy(catalog);c.entities.filter(e=>e.kind==='person').forEach((e,i)=>e.displayName='Renamed '+i);const r=await openAtlas(saved,c);assert.deepEqual(r.model.people.map(p=>p.id),reader.model.people.map(p=>p.id));const report=section(person(r,rule.witnessId),'shared').rows[0];assert.equal(report.source.immediate[0].fullDeveloperRecord.outward.senderId,rule.witnessId);
});
test('A1-11 conflicting canonical actors fail before producing any Person model',async()=>{
 const c=await read('independent/ar0-review/evidence/alias-trust-catalog.json');await assert.rejects(openAtlas(saved,c),/CONFLICTING_ACTOR_CARD_BINDING/);assert.match(explainValidation(Error('CONFLICTING_ACTOR_CARD_BINDING')).text,/Conflicting Person identity/);
});
test('A1-12 wrong package catalog and missing references reject without automatic repair',async()=>{
 const c=copy(catalog);c.packageRef.digest='f'.repeat(64);await assert.rejects(openAtlas(saved,c));const broken=copy(catalog);broken.entities[0].source.id='actor_ffff';await assert.rejects(openAtlas(saved,broken));
});
test('A1-13 tampered or incompatible snapshots cannot be treated as trusted projections',async()=>{
 const s=copy(saved);s.run.data.world.serviceOpen=false;await assert.rejects(openAtlas(s,catalog));await assert.rejects(openAtlas(reader.model,catalog));
});
test('A1-14 repeated inspection and rendering are pure across all authoritative state',async()=>{
 const before=JSON.stringify({saved,catalog});for(let i=0;i<3;i++){for(const p of reader.model.people){renderPerson(p);renderPeople(reader.model.people,p.id);}assert.equal((await reader.integrity()).unchanged,true);}
 assert.equal(JSON.stringify({saved,catalog}),before);assert.ok(Object.isFrozen(reader));assert.ok(Object.isFrozen(reader.model.people[0].technical.person));assert.throws(()=>reader.model.people[0].sections.push({}));assert.deepEqual(Object.keys(reader).sort(),['integrity','model']);
});
test('A1-15 exact save/load preserves summaries and source paths byte for byte',async()=>{
 const run=await E.importRun(saved,saved.package),again=await openAtlas(E.exportRun(run,saved.package),catalog);assert.deepEqual(again.model,reader.model);assert.deepEqual(await again.integrity(),await reader.integrity());
});
test('A1-16 no Event command message effect belief source or revision is installed by reading',async()=>{
 const before=JSON.stringify(saved);await openAtlas(saved,catalog);await reader.integrity();for(const p of reader.model.people)renderPerson(p);assert.equal(JSON.stringify(saved),before);assert.equal(saved.run.journal.length,saved.run.revision);
});
test('A1-17 source technical details preserve exact records and do not replace plain assertions',()=>{
 const p=person(reader,rule.witnessId),r=section(p,'shared').rows[0],html=renderPerson(p);assert.ok(html.includes('Encounter details'));assert.equal(r.source.technicalRecord.senderId,rule.witnessId);assert.ok(r.text.includes('exact identity was not established'));assert.equal(p.technical.person.id,p.id);assert.equal(p.technical.context.packageRef.digest,saved.package.ref.digest);
});
test('A1-18 player source expansion never exposes full developer records or hidden payloads',()=>{
 const json=JSON.stringify(player.model);for(const f of saved.package.content.facts.filter(f=>saved.package.content.protectedFactIds.includes(f.id)))assert.ok(!json.includes(String(f.value)));
 for(const p of player.model.people)for(const row of rows(p))for(const path of [...row.source.immediate,...row.source.earlier,...row.source.support.map(s=>s.path)])assert.equal(path.fullDeveloperRecord,null);
 assert.ok(!json.includes('spill_protection'));assert.ok(!json.includes('storage_location'));
});
test('A1-19 earlier citations stay opaque when no matching fragment was received',()=>{
 const report=section(person(player,saved.package.content.humanId),'reports').rows[0];assert.ok(report.source.earlier.length);assert.equal(report.source.earlier[0].fullDeveloperRecord,null);assert.equal(report.source.earlier[0].receivedFragments.length,0);assert.ok(report.source.earlier[0].access.includes('does not reveal'));
 assert.equal(report.source.immediate[0].period,'During this run');assert.equal(report.source.immediate[0].title,'Communication from Orrin');
 const shared=section(person(player,rule.witnessId),'shared').rows[0];assert.equal(shared.source.immediate[0].title,'Communication from Orrin');assert.equal(shared.source.immediate[0].period,'During this run');assert.equal(shared.source.immediate[0].fullDeveloperRecord,null);
});
test('A1-20 current owner and holder remain separate from retained location beliefs',()=>{
 const human=person(done,recovery.package.content.humanId),owner=person(done,rule.ownerId);assert.ok(section(human,'holds').rows.length);assert.ok(section(owner,'owns').rows.length);assert.equal(section(owner,'holds'),undefined);const beliefs=section(person(done,rule.custodianId),'beliefs');assert.ok(beliefs.rows.some(r=>r.text.includes('dry storage')&&r.note.includes('separate from current holding')));
});
test('A1-21 addressed concern keeps actual supporting and correction observations',()=>{
 const h=section(person(done,rule.custodianId),'concerns').rows[0];assert.equal(h.basis,'Addressed concern');assert.ok(h.source.support.length);assert.ok(h.source.correction.length);assert.ok(h.note.includes('not proof of motive'));assert.ok(h.note.includes('warning'));
});
test('A1-22 claims do not disappear when an earlier Event has no projected endpoint',async()=>{
 const c=copy(catalog);c.entities=c.entities.filter(e=>e.source.kind!=='historical_event');const r=await openAtlas(saved,c);assert.ok(section(person(r,saved.package.content.humanId),'reports').rows.length);
});
test('A1-23 recorded technical issues remain visible without a repair command',async()=>{
 const s=await read('evidence/ar0-r1/browser/ui-collapse.json'),r=await openAtlas(s,catalog);assert.deepEqual(r.model.technicalDefects.map(d=>d.type),['MISSING_CLOSURE_PREVIEW']);assert.equal((await r.integrity()).unchanged,true);assert.equal(Object.hasOwn(r,'repair'),false);
});
async function mappingFixture(mutate){
 const run=await E.importRun(saved,saved.package),projection=copy(await A.projectAtlas(run,saved.package,catalog)),card=projection.cards.find(c=>c.id===rule.custodianId);mutate(card,projection);
 return makePersonView(card,{audience:'author',label:id=>id,sourcePath:r=>({title:'Fixture source',period:'Before this run',citation:r,receivedFragments:[],fullDeveloperRecord:null,access:'Fixture only'}),context:reader.model.context,binding:new Map(),entities:catalog.entities,projection});
}
test('A1-24 suspected and disputed belief stances are translated without accepting them as truth',async()=>{
 const suspected=await mappingFixture(c=>c.state.beliefs[0].stance='suspected');assert.ok(section(suspected,'beliefs').rows.some(r=>r.basis==='Suspects'));
 const disputed=await mappingFixture(c=>{c.state.beliefs[0].stance='disputed';c.state.beliefs[0].value=null;});assert.ok(section(disputed,'beliefs').rows.some(r=>r.basis==='Conflicting evidence'));
});
test('A1-25 unsupported stance hypothesis and relation receive neutral fallbacks',async()=>{
 const p=await mappingFixture((c,projection)=>{c.state.beliefs[0].stance='future';c.state.hypotheses[0].type='future';projection.links.push({id:'future_link',fromRef:c.id,toRef:rule.ownerId,relationKind:'future_relation',epistemic:'authored_context',provenance:{},details:{}});});
 for(const id of ['beliefs','concerns','connections'])assert.ok(section(p,id).rows.some(r=>r.text==='Untranslated Encounter detail'&&r.basis==='Untranslated'));
});
test('A1-26 untranslatable belief values do not borrow objective facts or invent prose',async()=>{
 const p=await mappingFixture(c=>c.state.beliefs[0].value='unknown_future_value');assert.equal(section(p,'beliefs').rows[0].text,'Untranslated Encounter detail');
});
test('A1-27 repeated roots deduplicate citations without pretending corroboration',()=>{
 for(const p of reader.model.people)for(const r of rows(p)){assert.equal(new Set(r.source.earlier.map(x=>x.citation.kind+':'+x.citation.id)).size,r.source.earlier.length);assert.match(r.source.note,/not independent corroboration/);}
 assert.ok(renderPerson(person(reader,rule.witnessId)).includes('Repeated entries do not mean independent sources'));
});
test('A1-28 names and raw records cannot inject HTML into the browser reader',async()=>{
 const c=copy(catalog);c.entities.find(e=>e.id===rule.ownerId).displayName='<img src=x onerror=alert(1)>';const r=await openAtlas(saved,c),html=renderPerson(person(r,rule.ownerId));assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));assert.ok(renderFailure({text:'<script>x</script>',code:'bad'}).includes('&lt;script&gt;'));
});
test('A1-29 no UI editing or persistence endpoints are introduced',async()=>{
 const text=await fs.readFile(new URL('../src/atlas-a1/ui.mjs',import.meta.url),'utf8');assert.ok(!/\b(dispatch|prepareSend|prepareAction|prepareConfirmation|localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest)\s*[.(]/.test(text));assert.ok(!/\b(Tamsin|Orrin|Nera)\b/.test(text));
});
test('A1-30 every accepted R1 member remains byte-identical',async()=>{
 const identity=await read('historical/Encounter_AR0_Atlas_Readiness_Checkpoint_R1.identity.json');for(const e of identity.files){const bytes=await fs.readFile(new URL('../'+e.path,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),e.sha256,e.path);}assert.equal(identity.files.length,2310);
});
