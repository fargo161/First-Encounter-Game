import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { copy, canonicalJson, SALIENCE } from '../src/contracts.mjs';
import { selectResponse } from '../src/policy.mjs';
import { readObservedSource } from '../src/views.mjs';
import { sealPackage, verifyPackage } from '../src/package.mjs';
import { startEncounter, prepareSend, prepareInspection, dispatch, playerView, renderEpisode, inspectRun, decisionInput, stageInspectionResult, exportRun, importRun } from '../src/encounter.mjs';
import { authored, sealed, draft, commit, path } from './m2-fixture.mjs';

test('M2-01 complete connected interaction commits once per deliberate action and returns two phases',async()=>{
  const {run,commands}=await path(); const d=run.data;
  assert.equal(run.revision,3); assert.equal(d.messages.length,4); assert.equal(d.actionResults.length,1); assert.equal(d.decisions.length,2);
  assert.equal(commands[0].payload.preview.message.outward.act,'request_access');
  assert.deepEqual(d.decisions.map(x=>x.selected),['explain_access','acknowledge_report']);
  for (const episode of d.episodes) { const rendered=renderEpisode(run,episode.id); assert.ok(rendered.intake.description); assert.ok(rendered.delivery.text); assert.equal(rendered.control,'player'); }
  assert.equal(d.world.ownerId,sealed.content.bindings.ownerId); assert.equal(d.world.holderId,sealed.content.bindings.holderId); assert.equal(d.world.balanceMinor,1200);
  assert.ok(!canonicalJson(playerView(run)).includes(authored.initial.protectedContact));
});
test('M2-02 repeated preview edits and abandonment do not mutate any run/NPC/event state',async()=>{
  const run=await startEncounter(sealed),before=canonicalJson(run);
  for (const vibe of ['EA','SE','AB']) for (const salience of SALIENCE) prepareSend(run,sealed,draft(vibe,salience));
  assert.equal(canonicalJson(run),before); assert.equal(run.data.opportunities.used,0);
});
test('M2-03 semantic BASED changes outward meaning, not just a reaction multiplier',async()=>{
  const run=await startEncounter(sealed);
  const messages=['EA','SE','AB'].map(v=>prepareSend(run,sealed,draft(v)).payload.preview.message);
  assert.equal(new Set(messages.map(m=>canonicalJson(m.outward.framing))).size,3);
  assert.ok(messages[2].outward.framing.some(c=>c.kind==='possible_consequence'));
  assert.ok(!messages[0].outward.framing.some(c=>c.kind==='possible_consequence'));
});
test('M2-04 all salience settings preserve content, framing, people, targets and terms across both acts',async()=>{
  const {run}=await path();
  for (const act of ['request_access','challenge_record']) for (const vibe of ['EA','SE','AB']) {
    const outward=SALIENCE.map(s=>copy(prepareSend(run,sealed,draft(vibe,s,act)).payload.preview.message.outward));
    assert.equal(new Set(outward.map(o=>o.prominence)).size,3); outward.forEach(o=>delete o.prominence);
    assert.deepEqual(outward[0],outward[1]); assert.deepEqual(outward[1],outward[2]);
  }
});
test('M2-05 all nine ordinary first-request expressions receive protection and limited access',async()=>{
  for (const vibe of ['EA','SE','AB']) for (const salience of SALIENCE) {
    const initial=await startEncounter(sealed),run=commit(initial,sealed,prepareSend(initial,sealed,draft(vibe,salience)));
    assert.equal(run.data.decisions[0].selected,'explain_access'); assert.equal(run.data.permissions.length,1); assert.equal(run.data.actionResults.length,0);
    assert.equal(playerView(run).inspectedDetail,null); assert.equal(run.data.messages[0].outward.scope.kind,'relevant_records');
    for (const forbidden of ['grievance','restriction','repair','closed']) assert.equal(Object.hasOwn(run.data,forbidden),false);
  }
});
test('M2-06 initial menu/reference projection reveals no hidden file split or contact value',async()=>{
  const initial=await startEncounter(sealed),view=playerView(initial),text=canonicalJson(view);
  assert.equal(view.references.length,3); for (const word of ['Handling extract','Private contact','Customer file','unfilled','PRIVATE-FIXTURE']) assert.ok(!text.includes(word));
  assert.equal(view.actionAvailable,false);
  assert.throws(()=>prepareSend(initial,sealed,draft('EA','NUANCED','challenge_record')),e=>e.code==='INSPECTION_REQUIRED');
});
test('M2-07 permission without inspection discloses vocabulary only; printing requires an action',async()=>{
  let run=await startEncounter(sealed); run=commit(run,sealed,prepareSend(run,sealed,draft())); const view=playerView(run);
  assert.equal(view.permissions.length,1); assert.equal(view.actionAvailable,true); assert.equal(view.inspectedDetail,null);
  assert.ok(view.references.some(x=>x.id===sealed.content.bindings.contactId)); assert.ok(!canonicalJson(view).includes('PRIVATE-FIXTURE'));
});
test('M2-08 performed inspection discloses print only to the player; the clerk observes conduct',async()=>{
  let run=await startEncounter(sealed); run=commit(run,sealed,prepareSend(run,sealed,draft())); run=commit(run,sealed,prepareInspection(run,sealed));
  assert.equal(playerView(run).inspectedDetail.value,'unfilled');
  const resultId=run.data.actionResults[0].id;
  const clerk=run.data.observations.find(o=>o.observerId===run.data.serviceId && o.source.id===resultId);
  assert.deepEqual(Object.keys(clerk.receivedDetails),['conduct']); assert.equal(clerk.channel,'sight');
  assert.ok(!canonicalJson(clerk).includes('unfilled')); assert.equal(run.data.claims.length,0);
});
test('M2-09 follow-up teaches the report as a claim, not as firsthand reading or a canonical rewrite',async()=>{
  const {run}=await path(); const trace=inspectRun(run,sealed),last=trace.decisions.at(-1);
  assert.equal(run.data.claims.length,1); assert.equal(last.actualListenerInput.claims[0].proposition.value,'unfilled');
  assert.equal(run.data.messages[0].outward.act,'request_access'); assert.equal(run.data.messages[0].outward.content.value,null);
  assert.ok(renderEpisode(run,run.data.episodes.at(-1).id).delivery.text.includes('not yet an independently verified finding'));
  assert.deepEqual(trace.hypotheses,[]); assert.deepEqual(trace.beliefs,[]);
});
test('M2-10 real source-event pointers cannot reveal concealed contact fields',async()=>{
  const {run}=await path(),input=inspectRun(run,sealed).decisions[0].actualListenerInput;
  const fragments=readObservedSource(input,{kind:'event',id:'event_0002'});
  assert.ok(fragments.length); assert.equal(fragments[0].receivedDetails.protectedContact,undefined);
  assert.ok(!canonicalJson(input).includes('PRIVATE-FIXTURE')); assert.ok(!canonicalJson(input).includes('privateComposition'));
});
test('M2-11 actual result redelivery is a no-op at the application boundary',async()=>{
  const {run}=await path(),data=run.data,result=data.actionResults[0],before=canonicalJson(data);
  const replay=stageInspectionResult(data,result.request,copy(result)); assert.equal(replay.replayed,true); assert.equal(canonicalJson(replay.data),before);
  const changed=copy(result); changed.id='result_00ff'; assert.throws(()=>stageInspectionResult(data,result.request,changed));
});
test('M2-12 exact retry after follow-up reuses receipt; collision and new stale command have no effects',async()=>{
  const {run,commands}=await path(),before=canonicalJson(run),replay=dispatch(run,sealed,commands[1]);
  assert.equal(replay.status,'replayed'); assert.equal(canonicalJson(replay.run),before);
  const collision=copy(commands[1]); collision.payload.request.targetId=sealed.content.bindings.contactId;
  assert.equal(dispatch(run,sealed,collision).code,'IDENTITY_CONFLICT');
  const stale=copy(commands[1]); stale.id='command_0099'; stale.payload.request.commandId=stale.id;
  assert.equal(dispatch(run,sealed,stale).code,'STALE_COMMAND'); assert.equal(canonicalJson(run),before);
});
test('M2-13 full connected paths with equal outward content and different private selections have equal listener results',async()=>{
  const neutral=copy(authored); neutral.communication.expressions[1].cues=copy(neutral.communication.expressions[0].cues);
  const pkg=await sealPackage(neutral),one=await path(pkg,'EA'),two=await path(pkg,'SE');
  assert.notDeepEqual(one.run.data.messages[0].privateComposition,two.run.data.messages[0].privateComposition);
  assert.deepEqual(one.run.data.messages.map(m=>m.outward),two.run.data.messages.map(m=>m.outward));
  assert.deepEqual(one.run.data.observations,two.run.data.observations);
  assert.deepEqual(one.run.data.decisions,two.run.data.decisions); assert.deepEqual(one.run.data.episodes,two.run.data.episodes);
  for (let i=0;i<2;i++) assert.deepEqual(inspectRun(one.run,pkg).decisions[i].actualListenerInput,inspectRun(two.run,pkg).decisions[i].actualListenerInput);
});
test('M2-14 unlearned contact-world perturbation leaves actual policy and later reply unchanged',async()=>{
  const variant=copy(authored); variant.initial.protectedContact='OTHER-HIDDEN-CONTACT'; const pkg=await sealPackage(variant);
  const one=await path(),two=await path(pkg);
  assert.deepEqual(one.run.data.decisions,two.run.data.decisions); assert.deepEqual(one.run.data.messages.map(m=>m.outward),two.run.data.messages.map(m=>m.outward));
});
test('M2-15 inspector refresh and Intake/Delivery replay/skip reads do not mutate a run',async()=>{
  const {run}=await path(),before=canonicalJson(run);
  for(let i=0;i<10;i++) { inspectRun(run,sealed); playerView(run); for(const e of run.data.episodes) renderEpisode(run,e.id); }
  assert.equal(canonicalJson(run),before);
});
test('M2-16 missing final wording/art uses complete fallback phases without changing mechanics',async()=>{
  const variant=copy(authored); variant.presentation={intake:'optional future art',delivery:'optional future wording',art:'optional future image'};
  const pkg=await sealPackage(variant),one=await path(),two=await path(pkg);
  assert.deepEqual(one.run.data,two.run.data); assert.deepEqual(renderEpisode(one.run,one.run.data.episodes[0].id),renderEpisode(two.run,two.run.data.episodes[0].id));
});
test('M2-17 tampered preview and missing permission are technical failures without fictional action',async()=>{
  const run=await startEncounter(sealed),command=copy(prepareSend(run,sealed,draft())),before=canonicalJson(run);
  command.payload.preview.message.outward.targetId=sealed.content.bindings.contactId;
  assert.equal(dispatch(run,sealed,command).status,'rejected'); assert.equal(canonicalJson(run),before);
  assert.throws(()=>prepareInspection(run,sealed),e=>e.code==='PERMISSION_REQUIRED');
});
test('M2-18 a valid social refusal still records hearing and changes no material state',async()=>{
  const variant=copy(authored); variant.actors[1].profile.roles=[]; const pkg=await sealPackage(variant);
  let run=await startEncounter(pkg); run=commit(run,pkg,prepareSend(run,pkg,draft()));
  assert.equal(run.data.decisions[0].selected,'decline_scope'); assert.equal(run.data.observations.filter(o=>o.source.kind==='message').length,2);
  assert.equal(run.data.permissions.length,0); assert.equal(run.data.world.balanceMinor,1200);
});
test('M2-19 neutral renamed actors/items and arbitrary IDs run the same reusable policy end to end',async()=>{
  let text=JSON.stringify(authored); for (const [from,to] of [['actor_0001','actor_0041'],['actor_0002','actor_0042'],['actor_0003','actor_0043']]) text=text.replaceAll(from,to);
  const variant=JSON.parse(text); variant.title='Archive inquiry'; variant.actors.forEach((a,i)=>a.label=['Visitor','Archivist','Absent depositor'][i]); variant.subjects[0].label='Blue document folder';
  const pkg=await sealPackage(variant),{run}=await path(pkg);
  assert.deepEqual(run.data.decisions.map(d=>d.selected),['explain_access','acknowledge_report']); assert.equal(run.data.claims.length,1); assert.equal(run.data.serviceId,'actor_0042');
  assert.equal(run.data.observations.filter(o=>o.observerId==='actor_0043').length,0);
});
test('M2-20 save/load validates exact package and replays journal without duplicating effects',async()=>{
  const {run,commands}=await path(),save=exportRun(run,sealed),restored=await importRun(save,sealed);
  assert.deepEqual(restored,run); assert.equal(dispatch(restored,sealed,commands[0]).status,'replayed');
  const corrupted=copy(save); corrupted.run.data.world.document.signature='filled'; await assert.rejects(importRun(corrupted,sealed));
  const broken=copy(save); broken.run.data.observations.pop(); await assert.rejects(importRun(broken,sealed));
  const legacy={version:'encounter-session@1'}; const before=JSON.stringify(legacy); await assert.rejects(importRun(legacy,sealed)); assert.equal(JSON.stringify(legacy),before);
});
test('M2-21 changed package bytes cannot silently replace a pinned package',async()=>{
  const changed=copy(sealed); changed.content.initial.signature='filled'; await assert.rejects(verifyPackage(changed));
  const {run}=await path(),other=copy(authored); other.revision++; const newPackage=await sealPackage(other);
  await assert.rejects(importRun(exportRun(run,sealed),newPackage));
});
test('M2-22 soft opportunity reminder never closes service or depends on playback time',async()=>{
  let run=await startEncounter(sealed); for(let i=0;i<25;i++) run=commit(run,sealed,prepareSend(run,sealed,draft()));
  assert.equal(run.data.opportunities.used,25); assert.equal(run.data.opportunities.allowance,24); assert.equal(run.data.permissions.length,1);
  assert.equal(Object.hasOwn(run.data,'closed'),false); assert.ok(playerView(run).actionAvailable);
  let free=await startEncounter(sealed,{noPressure:true}); free=commit(free,sealed,prepareSend(free,sealed,draft())); assert.equal(free.data.opportunities.noPressure,true);
});
test('M2-23 reviewed R2 production modules remain byte-identical',async()=>{
  const identity=JSON.parse(await fs.readFile(new URL('../reference/R2_Baseline.identity.json',import.meta.url),'utf8'));
  for(const file of ['runtime.mjs','action-boundary.mjs','contracts.mjs','views.mjs']) {
    const bytes=await fs.readFile(new URL('../src/'+file,import.meta.url)); assert.equal(createHash('sha256').update(bytes).digest('hex'),identity.files.find(x=>x.path==='src/'+file).sha256);
  }
});
test('M2-24 compiler can accept an additional catalog entry without a three-vibe branch',async()=>{
  const variant=copy(authored); variant.communication.expressions.push({vibe:'SB',templateId:'template_0030',cues:[{kind:'scope_limit',text:'Limits the request to this record.'}]});
  const pkg=await sealPackage(variant),run=await startEncounter(pkg),command=prepareSend(run,pkg,draft('SB')); assert.equal(command.payload.preview.message.privateComposition.selectedVibe,'SB');
  assert.equal(commit(run,pkg,command).data.decisions[0].selected,'explain_access');
});
test('M2-25 unsupported exchange is explicit and creates no transfer',async()=>{
  const run=await startEncounter(sealed),before=canonicalJson(run); assert.throws(()=>prepareSend(run,sealed,draft('EA','NUANCED','propose_exchange')));
  assert.equal(canonicalJson(run),before);
});
test('M2-26 selector/provenance/cache data never enters actual policy inputs or decision features',async()=>{
  const {run}=await path();
  for(const decision of run.data.decisions) {
    const input=decisionInput(run.data,sealed.content,decision.messageId,decision.inputObservationIds),text=canonicalJson(input);
    for(const forbidden of ['selectedVibe','selectedSalience','templateId','privateComposition','protectedContact','cacheKey','art']) assert.ok(!text.includes(forbidden));
    assert.equal(selectResponse(input).selected,decision.selected);
  }
});
