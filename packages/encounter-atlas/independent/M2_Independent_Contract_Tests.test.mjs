import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(process.env.ENCOUNTER_CHECKPOINT ?? path.join(here,'../work/m2-review/checkpoint'));
const evidence=path.resolve(process.env.M2_BROWSER_EVIDENCE ?? path.join(here,'../work/m2-review/evidence'));
const load=name=>import(pathToFileURL(path.join(root,'src',name)).href);
const C=await load('contracts.mjs'), E=await load('encounter.mjs'), P=await load('package.mjs');
const V=await load('views.mjs'), Policy=await load('policy.mjs');
const clone=value=>structuredClone(value);
const authored=JSON.parse(await fs.readFile(path.join(root,'content/last-collection.json'),'utf8'));
const sealed=await P.sealPackage(authored);
const draft=(vibe='EA',salience='NUANCED',act='request_access')=>({act,vibe,salience});
function commit(run,pkg,command){const result=E.dispatch(run,pkg,command);assert.equal(result.status,'committed',result.code);return result.run;}
async function flow(pkg=sealed,vibe='EA',salience='NUANCED'){
  const initial=await E.startEncounter(pkg,{runId:'run_00f0'});
  const request=E.prepareSend(initial,pkg,draft(vibe,salience),'command_1001');
  const permission=commit(initial,pkg,request);
  const inspection=E.prepareInspection(permission,pkg,'command_1002');
  const inspected=commit(permission,pkg,inspection);
  const report=E.prepareSend(inspected,pkg,draft(vibe,salience,'challenge_record'),'command_1003');
  const final=commit(inspected,pkg,report);
  return {initial,permission,inspected,final,commands:[request,inspection,report]};
}
const local=(run,actor)=>run.data.observations.filter(o=>o.observerId===actor);
const json=value=>JSON.stringify(value);

test('IM2-01: repeated edits/abandoned drafts do not teach, spend or advance a run',async()=>{
  const run=await E.startEncounter(sealed),before=json(run);
  for(const vibe of ['EA','SE','AB'])for(const salience of C.SALIENCE){
    const cmd=E.prepareSend(run,sealed,draft(vibe,salience));
    assert.equal(cmd.payload.preview.revision,0);
    assert.equal(cmd.payload.preview.message.outward.act,'request_access');
  }
  assert.equal(json(run),before);assert.equal(run.data.messages.length,0);assert.equal(run.data.opportunities.used,0);
});
test('IM2-02: all nine first requests preserve canonical meaning and the protected ordinary path',async()=>{
  for(const vibe of ['EA','SE','AB'])for(const salience of C.SALIENCE){
    const initial=await E.startEncounter(sealed),cmd=E.prepareSend(initial,sealed,draft(vibe,salience));
    const run=commit(initial,sealed,cmd),sent=run.data.messages[0];
    assert.deepEqual(sent,cmd.payload.preview.message);assert.equal(sent.outward.targetId,authored.bindings.recordId);
    assert.equal(sent.outward.content.kind,'request');assert.equal(sent.outward.content.value,null);
    assert.equal(run.data.decisions[0].selected,'explain_access');assert.equal(run.data.permissions.length,1);
    assert.equal(run.data.actionResults.length,0);assert.equal(E.playerView(run).inspectedDetail,null);
    for(const forbidden of ['grievance','restriction','repair','closed'])assert.ok(!Object.hasOwn(run.data,forbidden));
    assert.deepEqual(run.data.world,initial.data.world);
    assert.ok(!json(E.playerView(run)).includes(authored.initial.protectedContact));
  }
});
test('IM2-03: salience changes only prominence for both acts under each contrasting vibe',async()=>{
  const {inspected}=await flow();
  for(const act of ['request_access','challenge_record'])for(const vibe of ['EA','SE','AB']){
    const outward=C.SALIENCE.map(s=>clone(E.prepareSend(inspected,sealed,draft(vibe,s,act)).payload.preview.message.outward));
    assert.deepEqual(outward.map(o=>o.prominence),['understated','measured','emphatic']);
    outward.forEach(o=>delete o.prominence);assert.deepEqual(outward[0],outward[1]);assert.deepEqual(outward[1],outward[2]);
  }
});
test('IM2-04: vocabulary discloses the file split only after explanation, never the private value',async()=>{
  const {initial,permission}=await flow();
  const before=E.playerView(initial),after=E.playerView(permission);
  assert.deepEqual(before.references.map(r=>r.id),[authored.bindings.itemId,authored.bindings.ticketId,authored.bindings.recordId]);
  for(const key of ['fileId','handlingId','contactId']){
    assert.ok(!before.references.some(r=>r.id===authored.bindings[key]));
    assert.ok(after.references.some(r=>r.id===authored.bindings[key]));
  }
  assert.ok(!json(after).includes(authored.initial.protectedContact));
  assert.throws(()=>E.prepareSend(initial,sealed,draft('EA','NUANCED','challenge_record')));
});
test('IM2-05: complete three-command path has two responses and no material transfer or invented mind',async()=>{
  const {initial,final,commands}=await flow(sealed,'SE','OVERT'),d=final.data,t=E.inspectRun(final,sealed);
  assert.equal(final.revision,3);assert.equal(d.messages.length,4);assert.equal(d.observations.length,10);
  assert.equal(d.permissions.length,1);assert.equal(d.actionResults.length,1);assert.equal(d.claims.length,1);
  assert.deepEqual(d.decisions.map(x=>x.selected),['explain_access','acknowledge_report']);
  assert.deepEqual(d.messages[0],commands[0].payload.preview.message);
  assert.deepEqual(d.messages[2],commands[2].payload.preview.message);
  assert.deepEqual(d.world,initial.data.world);assert.equal(d.opportunities.used,3);
  assert.deepEqual(t.hypotheses,[]);assert.deepEqual(t.beliefs,[]);
  assert.equal(local(final,authored.bindings.ownerId).length,0);
  for(const ep of d.episodes){const shown=E.renderEpisode(final,ep.id);assert.ok(shown.intake.description);assert.ok(shown.delivery.description);assert.equal(shown.control,'player');}
});
test('IM2-06: equal complete outward paths with different private selectors/provenance have equal future listener traces',async()=>{
  const content=clone(authored);
  for(const expression of content.communication.expressions)expression.cues=clone(content.communication.expressions[0].cues);
  const pkg=await P.sealPackage(content),runs=[];
  for(const vibe of ['EA','SE','AB'])runs.push((await flow(pkg,vibe,'OVERT')).final);
  assert.equal(new Set(runs.map(r=>r.data.messages[0].privateComposition.templateId)).size,3);
  for(const run of runs.slice(1)){
    assert.notDeepEqual(run.data.messages[0].privateComposition,runs[0].data.messages[0].privateComposition);
    assert.deepEqual(run.data.messages.map(m=>m.outward),runs[0].data.messages.map(m=>m.outward));
    for(const key of ['observations','decisions','episodes','permissions','actionResults','claims'])assert.deepEqual(run.data[key],runs[0].data[key]);
    assert.deepEqual(E.inspectRun(run,pkg).decisions,E.inspectRun(runs[0],pkg).decisions);
  }
});
test('IM2-07: hidden-world changes do not become NPC evidence before receipt',async()=>{
  const contact=clone(authored);contact.initial.protectedContact='INDEPENDENT-HIDDEN-CONTACT';
  const variant=await P.sealPackage(contact),a=await flow(),b=await flow(variant);
  assert.deepEqual(a.final.data.decisions,b.final.data.decisions);
  assert.deepEqual(a.final.data.messages.map(m=>m.outward),b.final.data.messages.map(m=>m.outward));
  const signature=clone(authored);signature.initial.signature='filled';const changed=await P.sealPackage(signature);
  const c=await flow(changed);
  assert.deepEqual(a.permission.data.decisions,c.permission.data.decisions);
  assert.deepEqual(a.permission.data.messages.map(m=>m.outward),c.permission.data.messages.map(m=>m.outward));
  assert.equal(E.playerView(c.inspected).inspectedDetail.value,'filled');
  assert.equal(E.playerView(a.inspected).inspectedDetail.value,'unfilled');
});
test('IM2-08: permission is not inspection; performed detail is readable only by the declared reader',async()=>{
  const {initial,permission,inspected}=await flow();
  assert.throws(()=>E.prepareInspection(initial,sealed));
  assert.equal(E.playerView(permission).inspectedDetail,null);assert.equal(permission.data.actionResults.length,0);
  assert.equal(E.playerView(inspected).inspectedDetail.value,'unfilled');assert.equal(inspected.data.claims.length,0);
  const resultId=inspected.data.actionResults[0].id;
  const reader=local(inspected,inspected.data.humanId).find(o=>o.source.id===resultId);
  const watcher=local(inspected,inspected.data.serviceId).find(o=>o.source.id===resultId);
  assert.equal(reader.channel,'reading');assert.equal(watcher.channel,'sight');
  assert.deepEqual(Object.keys(watcher.receivedDetails),['conduct']);assert.ok(!json(watcher).includes('unfilled'));
  assert.ok(!json(local(inspected,inspected.data.humanId)).includes(authored.initial.protectedContact));
});
test('IM2-09: every actual NPC source/root read path returns received fragments without hidden canaries',async()=>{
  const {final}=await flow();const trace=E.inspectRun(final,sealed);
  for(const decision of trace.decisions){
    const input=decision.actualListenerInput;
    for(const observation of input.observations)for(const source of [observation.source,...observation.roots]){
      const result=V.readObservedSource(input,source);
      assert.ok(!json(result).includes(authored.initial.protectedContact));
      assert.ok(!json(result).includes('privateComposition'));assert.ok(!json(result).includes('selectedVibe'));
    }
    assert.deepEqual(V.readObservedSource(input,{kind:'event',id:'event_ffff'}),[]);
    const unreceived=V.readObservedSource(input,{kind:'event',id:'event_0002'});
    assert.equal(unreceived[0].receivedDetails.protectedContact,undefined);
  }
});
test('IM2-10: actual policy inputs exclude hidden proxies, while performed cues are retained',async()=>{
  const {final}=await flow(sealed,'AB','SUBTLE');
  for(const decision of E.inspectRun(final,sealed).decisions){
    const input=decision.actualListenerInput,text=json(input);
    for(const key of ['selectedVibe','selectedSalience','templateId','privateComposition','cacheKey','protectedContact','trueHumanObjective','sincerity'])assert.ok(!text.includes(key),key);
    assert.ok(input.incoming.framing.some(c=>c.kind==='possible_consequence'));
    assert.equal(Policy.selectResponse(input).selected,decision.selected);
  }
  for(const filename of ['compiler.mjs','policy.mjs','encounter.mjs','package.mjs']){
    const source=await fs.readFile(path.join(root,'src',filename),'utf8');
    assert.ok(!/Tamsin|Orrin|Nera|Last Collection/.test(source),filename);
  }
});
test('IM2-11: the later received assertion is a report, not retroactive observation or a rewritten request',async()=>{
  const {initial,permission,inspected,final}=await flow();
  assert.equal(permission.data.claims.length,0);assert.equal(inspected.data.claims.length,0);
  assert.equal(final.data.claims.length,1);const claim=final.data.claims[0];
  const report=final.data.messages.find(m=>m.id===claim.messageId);
  assert.equal(report.outward.content.kind,'assertion');assert.equal(claim.proposition.value,'unfilled');
  const received=final.data.observations.find(o=>claim.observationIds.includes(o.id));
  assert.equal(received.channel,'hearing');assert.equal(received.source.kind,'message');
  assert.deepEqual(final.data.messages[0],permission.data.messages[0]);
  assert.equal(final.data.messages[0].outward.content.kind,'request');
  assert.deepEqual(initial.data.world,final.data.world);
  assert.ok(E.renderEpisode(final,final.data.episodes.at(-1).id).delivery.text.includes('not yet an independently verified finding'));
});
test('IM2-12: all committed command kinds preserve exact retry, collision and new-stale safety',async()=>{
  const {final,commands}=await flow(),before=json(final);
  for(const [index,cmd] of commands.entries()){
    const exact=E.dispatch(final,sealed,clone(cmd));assert.equal(exact.status,'replayed');assert.deepEqual(exact.receipt,final.journal[index].receipt);
    const conflict=clone(cmd);conflict.payload.unexpected='changed';
    assert.equal(E.dispatch(final,sealed,conflict).code,'IDENTITY_CONFLICT');
    const stale=clone(cmd);stale.id=`command_${(0x9001+index).toString(16)}`;
    assert.equal(E.dispatch(final,sealed,stale).code,'STALE_COMMAND');
  }
  assert.equal(json(final),before);
});
test('IM2-13: technical rejection and failed staged result produce no fictional partial action',async()=>{
  const {initial,permission}=await flow(),beforeInitial=json(initial),beforePermission=json(permission);
  const altered=clone(E.prepareSend(initial,sealed,draft()));altered.payload.preview.message.outward.targetId=authored.bindings.contactId;
  assert.equal(E.dispatch(initial,sealed,altered).status,'rejected');assert.equal(json(initial),beforeInitial);
  const command=clone(E.prepareInspection(permission,sealed));command.payload.request.permissionId='permission_ffff';
  assert.equal(E.dispatch(permission,sealed,command).status,'rejected');assert.equal(json(permission),beforePermission);
  const valid=E.prepareInspection(permission,sealed),result=clone(E.resolveInspection(permission.data,valid.payload.request));
  result.observerDetails.find(r=>r.observerId===permission.data.serviceId).details.secretContact=authored.initial.protectedContact;
  assert.throws(()=>E.stageInspectionResult(permission.data,valid.payload.request,result));assert.equal(json(permission),beforePermission);
  const unavailable=clone(authored);unavailable.actors.find(a=>a.id===unavailable.bindings.serviceId).profile.roles=[];
  const pkg=await P.sealPackage(unavailable),run=await E.startEncounter(pkg),refusal=commit(run,pkg,E.prepareSend(run,pkg,draft()));
  assert.equal(refusal.data.decisions[0].selected,'decline_scope');assert.equal(refusal.data.messages.length,2);
  assert.equal(refusal.data.permissions.length,0);assert.deepEqual(refusal.data.world,run.data.world);
});
test('IM2-14: physical result redelivery cannot add observations, opportunities or effects',async()=>{
  const {final}=await flow(),result=final.data.actionResults[0],before=json(final.data);
  const repeated=E.stageInspectionResult(final.data,clone(result.request),clone(result));
  assert.equal(repeated.replayed,true);assert.deepEqual(repeated.data,final.data);
  const changed=clone(result);changed.observerDetails[0].details.recordDetail.value='filled';
  assert.throws(()=>E.stageInspectionResult(final.data,clone(result.request),changed));
  const second=clone(result);second.id='result_ffff';assert.throws(()=>E.stageInspectionResult(final.data,result.request,second));
  assert.equal(json(final.data),before);
});
test('IM2-15: repeated inspector and performance reads remain detached and mechanically neutral',async()=>{
  const {final}=await flow(),before=json(final);
  for(let n=0;n<20;n++){
    const trace=E.inspectRun(final,sealed);E.playerView(final);
    assert.throws(()=>trace.revision++,TypeError);
    for(const episode of final.data.episodes)E.renderEpisode(final,episode.id);
  }
  assert.equal(json(final),before);
});
test('IM2-16: a fully renamed neutral fixture and missing optional assets preserve the connected mechanics',async()=>{
  const map=new Map([...authored.actors,...authored.subjects].map((x,i)=>[x.id,x.id.replace(/_[0-9a-f]+$/,'_'+(0x7001+i).toString(16))]));
  const rename=value=>typeof value==='string'?(map.get(value)??value):Array.isArray(value)?value.map(rename):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,rename(v)])):value;
  const content=rename(clone(authored));content.title='Neutral archive inquiry';
  content.actors.forEach((actor,i)=>actor.label=['Visitor','Archivist','Absent depositor'][i]);content.subjects.forEach((s,i)=>s.label=`Neutral reference ${i+1}`);
  content.presentation={intake:null,delivery:null,art:null};const pkg=await P.sealPackage(content),{final}=await flow(pkg,'AB','OVERT');
  assert.deepEqual(final.data.decisions.map(d=>d.selected),['explain_access','acknowledge_report']);
  assert.equal(final.data.world.ownerId,content.bindings.ownerId);assert.equal(local(final,content.bindings.ownerId).length,0);
  for(const episode of final.data.episodes){const view=E.renderEpisode(final,episode.id);assert.ok(view.intake.description);assert.ok(view.delivery.description);assert.ok(view.delivery.text);assert.equal(view.control,'player');}
});
test('IM2-17: exact save/package import preserves retry history and rejects altered or legacy saves',async()=>{
  const {final,commands}=await flow(),save=E.exportRun(final,sealed),before=json(save);
  const restored=await E.importRun(clone(save),sealed);assert.deepEqual(restored,final);assert.equal(E.dispatch(restored,sealed,commands[1]).status,'replayed');
  for(const mutate of [s=>s.run.data.observations.pop(),s=>s.run.data.world.document.signature='filled',s=>s.package.content.initial.protectedContact='CHANGED']){
    const changed=clone(save);mutate(changed);await assert.rejects(E.importRun(changed,sealed));
  }
  const legacy={version:'encounter-session@1'};await assert.rejects(E.importRun(legacy,sealed));assert.deepEqual(legacy,{version:'encounter-session@1'});
  assert.equal(json(save),before);
});
test('IM2-18: delivered and independently generated browser runs replay exactly and match their inspector traces',async()=>{
  const read=async filename=>JSON.parse(await fs.readFile(filename,'utf8'));
  const delivered=await read(path.join(root,'M2_Interaction_Run.json'));
  const suppliedTrace=await read(path.join(root,'M2_Inspector_Trace.json'));
  const browserSave=await read(path.join(evidence,'Independent_M2_Browser_Run.json'));
  const browserTrace=await read(path.join(evidence,'Independent_M2_Browser_Inspector.json'));
  const verifiedDelivered=await E.importRun(delivered,sealed),verifiedBrowser=await E.importRun(browserSave,sealed);
  assert.deepEqual(E.inspectRun(verifiedDelivered,sealed),suppliedTrace.trace);
  assert.deepEqual(E.inspectRun(verifiedBrowser,sealed),browserTrace);
  const normalize=run=>{
    const mapping=new Map(run.journal.map((j,i)=>[j.command.id,`command_${(i+1).toString(16).padStart(4,'0')}`]));
    const replace=value=>typeof value==='string'?(mapping.get(value)??value):Array.isArray(value)?value.map(replace):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,replace(v)])):value;
    return replace(run);
  };
  assert.deepEqual(normalize(verifiedDelivered),normalize(verifiedBrowser));
  assert.equal(verifiedBrowser.revision,3);assert.equal(verifiedBrowser.data.actionResults.length,1);
});
