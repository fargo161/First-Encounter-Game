import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { canonicalJson,copy,sealPackage } from '../src/m3/types.mjs';
import { actorView,readObservedSource } from '../src/m3/knowledge.mjs';
import { chooseResponse } from '../src/m3/policy.mjs';
import { E,draft,evidenceKey,markNoticeDisplayed,authored,pkg,rule,commit,send,action,partner,request,opened,learned,restricted,showAll,compared,recovered } from './m3-fixtures.mjs';
const snapshot=canonicalJson;
const broad=run=>draft('request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId});
const why=run=>draft('why',{operation:'explain',targetId:rule.recordId,scopeId:rule.relevantScopeId,contextMessageId:E.playerView(run).warningMessageId});

test('M3-01 LC-T21/25/30/31: full evidence/comparison/correction/zero-payment recovery changes custody once',async()=>{
 const run=await recovered(),t=E.inspectRun(run,pkg);assert.equal(t.outcomes.recovered,true);assert.equal(t.outcomes.ownerId,rule.ownerId);assert.equal(t.outcomes.holderId,authored.humanId);assert.equal(t.outcomes.quantity,1);assert.equal(t.outcomes.balances[authored.humanId],1200);assert.equal(t.outcomes.privateDisclosed,false);assert.equal(t.outcomes.recordCorrected,true);
 assert.equal(run.data.actionResults.filter(r=>r.request.actionType===rule.handoverActionId).length,1);assert.equal(t.documentRevisions[0].text,'collected');assert.equal(t.documentRevisions.length,2);
});
test('M3-02 explicit ticket action establishes retained authority; mere permission does not',async()=>{
 let run=await E.startEncounter(pkg);assert.equal(actorView(run.data,rule.custodianId).authority,null);run=request(run);assert.equal(run.data.messages.at(-1).outward.act,'verify_first');run=action(run,rule.verifyActionId);assert.equal(actorView(run.data,rule.custodianId).authority.verified,true);
});
test('M3-03 LC-T42: all nine ordinary paperwork variants remain protected',async()=>{
 for(const vibe of ['EA','SE','AB'])for(const salience of ['SUBTLE','NUANCED','OVERT']){let run=await E.startEncounter(pkg);run=action(run,rule.verifyActionId);run=send(run,draft('request_access',{targetId:rule.recordId,scopeId:rule.recordId,vibe,salience}));assert.equal(run.data.visits[0].restricted,false);assert.equal(run.data.visits[0].repairUsed,false);assert.equal(run.data.hypotheses.length,0);assert.equal(run.data.world.serviceOpen,true);assert.equal(run.data.messages.at(-1).outward.act,'explain_access');}
});
test('M3-04 initial menu projection has no file split, missing signature or hidden values',async()=>{
 const run=await E.startEncounter(pkg),v=E.playerView(run);assert.equal(v.rule,null);assert.equal(v.evidence.length,0);for(const id of [rule.fileId,rule.relevantScopeId,rule.wholeScopeId,...rule.protectedScopeIds])assert.ok(!v.references.some(r=>r.id===id));assert.ok(!snapshot(v).includes('PRIVATE-M3-FIXTURE'));
});
test('M3-05 private draft/preview edits do not trigger privacy, consume repair or advance clocks',async()=>{
 const run=await restricted(),before=snapshot(run);for(let i=0;i<8;i++)E.prepareSend(run,pkg,broad(run));assert.equal(snapshot(run),before);
});
test('M3-06 permission is not inspection, comparison, search, or handover',async()=>{
 const run=await opened();assert.equal(run.data.world.comparisonComplete,false);assert.equal(run.data.world.recovered,false);assert.equal(run.data.actionResults.length,1);assert.equal(E.playerView(run).evidence.length,0);assert.equal(run.data.world.holderId,authored.initial.holderId);
});
test('M3-07 performed inspection and search give the reader detail; witnesses receive conduct only',async()=>{
 let run=await opened();run=action(run,rule.inspectionActionIds[0]);const result=run.data.actionResults.at(-1);assert.equal(result.observerDetails.find(x=>x.observerId===rule.custodianId).details.evidence.length,0);assert.ok(E.playerView(run).evidence.some(e=>e.predicate==='recipient_signature'));
 run=action(run,rule.inspectionActionIds[1]);assert.equal(run.data.actionResults.at(-1).observerDetails.find(x=>x.observerId===rule.witnessId).details.evidence.length,0);assert.ok(!snapshot(actorView(run.data,rule.witnessId)).includes('internal_drying'));
});
test('M3-08 Orrin limited account has an unidentified description and no damp seam, destination or purpose fact',async()=>{
 let run=await learned();const received=actorView(run.data,rule.witnessId);assert.ok(received.evidence.every(e=>e.predicate==='movement_direction'));assert.ok(received.evidence.every(e=>e.subjectId!==rule.itemId));assert.ok(!snapshot(received).includes('spill_protection'));assert.ok(!received.evidence.some(e=>e.predicate==='storage_location'));assert.ok(run.data.claims.some(c=>c.speakerId===rule.witnessId));
});
test('M3-09 other NPC unheard location inquiry cannot trigger custodian restriction',async()=>{
 let run=await opened();run=partner(run,rule.witnessId);run=send(run,draft('ask_whereabouts',{operation:'ask',targetId:rule.ownerTopicId,scopeId:rule.ownerTopicId}));run=partner(run,rule.custodianId);run=request(run,'inspect',{scopeId:rule.wholeScopeId});assert.equal(run.data.visits[0].restricted,false);
});
test('M3-10 LC-T17: restriction needs all same-observer pattern parts and a later broad demand',async()=>{
 let run=await opened();run=request(run,'inspect',{scopeId:rule.wholeScopeId});assert.equal(run.data.visits[0].restricted,false);
 run=send(run,draft('ask_whereabouts',{operation:'ask',targetId:rule.ownerTopicId,scopeId:rule.ownerTopicId}));assert.equal(run.data.visits[0].restricted,false);run=request(run,'inspect',{scopeId:rule.wholeScopeId});assert.equal(run.data.visits[0].restricted,true);assert.equal(run.data.world.serviceOpen,true);assert.ok(E.playerView(run).warningMessageId);assert.equal(run.data.hypotheses[0].band,'actionable');
});
test('M3-11 LC-T20: verified collection authority survives restriction, End and partner switch',async()=>{
 let run=await restricted();run=commit(run,E.prepareSessionOperation(run,pkg,'end_conversation'));run=partner(run,rule.witnessId);run=partner(run,rule.custodianId);assert.equal(actorView(run.data,rule.custodianId).authority.verified,true);assert.equal(run.data.visits[0].restricted,true);
});
test('M3-12 LC-T18/62: Why, End/switch and rejected commands cannot use repair or advance opportunities',async()=>{
 let run=await restricted();const used=run.data.opportunities.used,warning=run.data.visits[0].warningMessageId;
 run=send(run,why(run));run=partner(run,rule.witnessId);run=partner(run,rule.custodianId);run=commit(run,E.prepareSessionOperation(run,pkg,'end_conversation'));run=partner(run,rule.custodianId);
 const bad=copy(E.prepareSend(run,pkg,broad(run)));bad.expectedRevision--;const failed=E.dispatch(run,pkg,bad);assert.equal(failed.status,'rejected');assert.equal(run.data.opportunities.used,used);assert.equal(run.data.visits[0].repairUsed,false);assert.equal(run.data.visits[0].warningMessageId,warning);
});
test('M3-13 vague apology is heard but not substantive repair',async()=>{
 let run=await restricted();run=send(run,draft('acknowledge_grievance',{targetId:rule.recordId,scopeId:rule.relevantScopeId}));assert.equal(run.data.visits[0].repairUsed,false);assert.equal(run.data.visits[0].restricted,true);assert.equal(run.data.messages.at(-1).outward.act,'concern_acknowledged');
});
test('M3-14 genuine comparison acceptance repairs once and preserves the visit-long warning',async()=>{
 let run=await restricted();const warning=run.data.visits[0].warningMessageId;run=request(run,'compare');assert.equal(run.data.visits[0].repairUsed,true);assert.equal(run.data.visits[0].restricted,false);assert.equal(run.data.visits[0].warningMessageId,warning);assert.equal(run.data.hypotheses[0].band,'corrected');assert.ok(run.data.hypotheses[0].correctionObservationIds.length);
});
test('M3-15 relevant evidence-backed narrowing also repairs without a promise or contact disclosure',async()=>{
 let run=await restricted();run=showAll(run);assert.equal(run.data.visits[0].repairUsed,true);assert.equal(run.data.visits[0].restricted,false);assert.equal(E.inspectRun(run,pkg).outcomes.privateDisclosed,false);
});
test('M3-16 repaired route remains playable through actual comparison and exact handover',async()=>{
 let run=await restricted();run=send(run,why(run));run=request(run,'compare');run=action(run,rule.comparisonActionId);assert.ok(E.playerView(run).activeOffer);assert.equal(run.data.world.recovered,false);run=commit(run,E.prepareConfirmation(run,pkg));assert.equal(run.data.world.recovered,true);
});
test('M3-17 incomplete physical comparison is an actual inconclusive result, never a privacy breach',async()=>{
 let run=await restricted(pkg,{withEvidence:false});run=request(run,'compare');run=action(run,rule.comparisonActionId);assert.equal(run.data.actionResults.at(-1).outcome,'no_discovery');assert.equal(run.data.world.serviceOpen,true);assert.equal(run.data.world.comparisonComplete,false);assert.equal(run.data.world.recovered,false);
});
test('M3-18 no warning means no closure notice or collection closure',async()=>{
 const run=await opened(),c=E.prepareSend(run,pkg,broad(run));assert.equal(c.payload.preview.notice,null);const next=commit(run,c);assert.equal(next.data.world.serviceOpen,true);
});
test('M3-19 LC-T69: warning produces notice only for renewed protected/bypass meaning',async()=>{
 const run=await restricted();assert.ok(E.prepareSend(run,pkg,broad(run)).payload.preview.notice);assert.equal(E.prepareSend(run,pkg,why(run)).payload.preview.notice,null);assert.equal(E.prepareSend(run,pkg,draft('request_access',{operation:'compare',targetId:rule.recordId,scopeId:rule.relevantScopeId})).payload.preview.notice,null);assert.ok(E.prepareSend(run,pkg,draft('request_access',{operation:'bypass',targetId:rule.recordId,scopeId:rule.protectedScopeIds[0]})).payload.preview.notice);
});
test('M3-20 notice contains public warning/draft only; editing or abandonment costs nothing',async()=>{
 const run=await restricted(),before=snapshot(run),c=E.prepareSend(run,pkg,broad(run));assert.ok(!snapshot(c.payload.preview.notice).includes('hypothesis'));assert.ok(!snapshot(c.payload.preview.notice).includes('PRIVATE-M3'));assert.ok(!snapshot(c.payload.preview.notice).includes('spill'));E.prepareSend(run,pkg,why(run));assert.equal(snapshot(run),before);
});
test('M3-21 approved missing-notice fallback receives/refuses, leaves service open, logs one technical defect',async()=>{
 const run=await restricted(),c=E.prepareSend(run,pkg,broad(run)),next=commit(run,c);assert.equal(next.data.world.serviceOpen,true);assert.equal(next.data.messages.at(-1).outward.act,'boundary_refusal');assert.equal(next.data.defects.length,1);assert.equal(next.data.defects[0].type,'MISSING_CLOSURE_PREVIEW');const again=E.dispatch(next,pkg,c);assert.equal(again.status,'replayed');assert.equal(again.run.data.defects.length,1);
});
test('M3-22 LC-T19: displayed current notice closes through one explicit physical service result',async()=>{
 const run=await restricted(),c=markNoticeDisplayed(E.prepareSend(run,pkg,broad(run))),next=commit(run,c);assert.equal(next.data.world.serviceOpen,false);assert.equal(next.data.world.recovered,false);assert.equal(next.data.actionResults.filter(x=>x.request.actionType===rule.closeActionId).length,1);assert.equal(E.dispatch(next,pkg,c).status,'replayed');assert.ok(next.data.observations.some(o=>o.observerId===rule.witnessId&&o.receivedDetails.service?.open===false));
});
test('M3-23 successful repair does not reset warning; later renewed demand can close after a new notice',async()=>{
 let run=await restricted();run=request(run,'compare');const c=markNoticeDisplayed(E.prepareSend(run,pkg,broad(run)));run=commit(run,c);assert.equal(run.data.world.serviceOpen,false);assert.equal(run.data.visits[0].repairUsed,true);
});
test('M3-24 completed recovery can never be retroactively converted to failure or confiscation',async()=>{
 let run=await restricted();run=request(run,'compare');run=action(run,rule.comparisonActionId);run=commit(run,E.prepareConfirmation(run,pkg));const c=E.prepareSend(run,pkg,broad(run));assert.equal(c.payload.preview.notice,null);run=commit(run,c);assert.equal(run.data.world.recovered,true);assert.equal(run.data.world.holderId,authored.humanId);assert.equal(run.data.world.serviceOpen,true);
});
test('M3-25 LC-T44/25: ordinary payment is received and declined, creates no money, debt or bribery judgment',async()=>{
 let run=await opened();const before=copy(run.data.world.balances);run=send(run,draft('propose_exchange',{targetId:rule.itemId,scopeId:rule.itemId,amountMinor:100,purpose:'ordinary_collection'}));assert.equal(run.data.messages.at(-1).outward.act,'ordinary_payment_refusal');assert.deepEqual(run.data.world.balances,before);assert.equal(run.data.offers.length,0);assert.equal(run.data.hypotheses.length,0);assert.equal(run.data.world.serviceOpen,true);
});
test('M3-26 payment to bypass a boundary previews a different meaning from ordinary payment',async()=>{
 const run=await opened(),a=E.prepareSend(run,pkg,draft('propose_exchange',{targetId:rule.itemId,scopeId:rule.itemId,amountMinor:100})),b=E.prepareSend(run,pkg,draft('propose_exchange',{targetId:rule.itemId,scopeId:rule.wholeScopeId,amountMinor:100,purpose:'boundary_exception'}));assert.notEqual(a.payload.preview.text,b.payload.preview.text);assert.equal(commit(run,b).data.world.balances[authored.humanId],1200);
});
test('M3-27 conversational Yes and rendering terms do not confirm the handover',async()=>{
 let run=await compared();const before=run.data.world.holderId,offer=copy(E.playerView(run).activeOffer);run=send(run,draft('yes',{targetId:rule.itemId,scopeId:rule.itemId}));assert.equal(run.data.world.holderId,before);assert.equal(run.data.world.recovered,false);assert.deepEqual(E.playerView(run).activeOffer,offer);
});
test('M3-28 LC-T26: stale/altered confirmation fails with no partial money, custody or completion',async()=>{
 const run=await compared(),c=E.prepareConfirmation(run,pkg),before=snapshot(run);const altered=copy(c);altered.payload.terms.amountMinor=600;assert.equal(E.dispatch(run,pkg,altered).status,'rejected');assert.equal(snapshot(run),before);
 const stale=copy(c);stale.expectedRevision--;assert.equal(E.dispatch(run,pkg,stale).status,'rejected');assert.equal(snapshot(run),before);
});
test('M3-29 End/switch invalidate uncompleted terms; continuing save/load does not',async()=>{
 let run=await compared();const old=E.prepareConfirmation(run,pkg);const loaded=await E.importRun(E.exportRun(run,pkg),pkg);assert.equal(loaded.data.activeOfferId,run.data.activeOfferId);run=partner(run,rule.witnessId);run=partner(run,rule.custodianId);assert.equal(run.data.activeOfferId,null);const fresh=copy(old);fresh.id='command_eeee';fresh.expectedRevision=run.revision;assert.equal(E.dispatch(run,pkg,fresh).status,'rejected');assert.equal(run.data.world.recovered,false);run=request(run,'collect',{targetId:rule.itemId,scopeId:rule.itemId});assert.ok(run.data.activeOfferId);
});
test('M3-30 LC-T28: every command kind supports exact retry, conflict and genuinely new stale rejection',async()=>{
 const run=await recovered(),before=snapshot(run);for(const j of run.journal){assert.equal(E.dispatch(run,pkg,j.command).status,'replayed');const changed=copy(j.command);changed.payload.extra='altered';assert.equal(E.dispatch(run,pkg,changed).code,'IDENTITY_CONFLICT');const stale=copy(j.command);stale.id='command_ffff';assert.equal(E.dispatch(run,pkg,stale).status,'rejected');}assert.equal(snapshot(run),before);
});
test('M3-31 physical result redelivery is a no-op; altered result and undeclared observer leak reject',async()=>{
 const initial=await opened(),command=E.prepareAction(initial,pkg,rule.inspectionActionIds[0]),request=command.payload.request,result=E.resolveAction(initial.data,pkg.content,request),data=copy(initial.data);E.stageResolved(data,pkg.content,request,result);const before=snapshot(data);assert.equal(E.stageResolved(data,pkg.content,request,result).replayed,true);assert.equal(snapshot(data),before);
 const altered=copy(result);altered.observerDetails[1].details.evidence=copy(result.observerDetails[0].details.evidence);assert.throws(()=>E.stageResolved(copy(initial.data),pkg.content,request,altered));assert.throws(()=>E.stageResolved(data,pkg.content,request,altered));
});
test('M3-32 all required save phases preserve complete state and exact retry history without new effects',async()=>{
 const partial=await opened(),limited=await restricted(),repaired=request(limited,'compare'),pending=action(repaired,rule.comparisonActionId),closed=send(limited,broad(limited)),done=commit(pending,E.prepareConfirmation(pending,pkg));
 for(const run of [partial,limited,repaired,pending,closed,done]){const restored=await E.importRun(E.exportRun(run,pkg),pkg);assert.deepEqual(restored,run);assert.equal(E.dispatch(restored,pkg,run.journal[0].command).status,'replayed');}
});
test('M3-33 invalid, altered, package-mismatched and legacy saves reject without mutation',async()=>{
 const run=await recovered(),save=E.exportRun(run,pkg),bad=copy(save);bad.run.data.world.balances[authored.humanId]++;await assert.rejects(E.importRun(bad,pkg));const hidden=copy(save);hidden.run.data.world.facts[0].value='filled';await assert.rejects(E.importRun(hidden,pkg));const alteredPkg=copy(save);alteredPkg.package.content.revision++;await assert.rejects(E.importRun(alteredPkg,pkg));await assert.rejects(E.importRun({schema:'encounter-save@2'},pkg));assert.deepEqual(run,save.run);
});
test('M3-34 LC-T32/35: absent owner stays uninformed and inspector/phase reads are pure',async()=>{
 const run=await recovered(),before=snapshot(run);for(let i=0;i<4;i++){E.inspectRun(run,pkg);for(const e of run.data.episodes)E.renderEpisode(run,e.id);}assert.equal(snapshot(run),before);assert.equal(run.data.observations.filter(o=>o.observerId===rule.ownerId).length,0);
});
test('M3-35 LC-T55: original shorthand and later evasive response retain distinct causes',async()=>{
 let run=await opened();run=send(run,draft('ask_whereabouts',{operation:'ask',targetId:rule.itemId,scopeId:rule.itemId}));assert.equal(run.data.messages.at(-1).outward.act,'defer_location');assert.equal(run.data.world.documentRevisions[0].text,'collected');assert.equal(run.data.world.recordCorrected,false);const d=E.inspectRun(run,pkg).decisions.at(-1);assert.ok(d.actualInput.evidence.some(e=>e.predicate==='original_entry_meaning'));assert.equal(run.data.events[0].type,'authored_record_origin');assert.notEqual(run.data.events[0].id,run.data.events.at(-1).id);
});
test('M3-36 equal complete outward paths with different private selectors/provenance have equal future listener input',async()=>{
 const v=copy(authored);v.communication.expressions.push({...copy(v.communication.expressions[0]),vibe:'SB',templateId:'template_0030'});const p=await sealPackage(v);
 async function flow(vibe){let run=await E.startEncounter(p);run=action(run,p.content.initial.rule.verifyActionId,p);run=send(run,draft('request_access',{targetId:p.content.initial.rule.recordId,scopeId:p.content.initial.rule.recordId,vibe}),p);return run;}
 const a=await flow('EA'),b=await flow('SB');assert.deepEqual(a.data.messages.map(m=>m.outward),b.data.messages.map(m=>m.outward));assert.deepEqual(a.data.decisions,b.data.decisions);
});
test('M3-37 hidden contact/signature truth perturbation cannot alter an unreceived first-response inference',async()=>{
 const v=copy(authored);v.facts.find(f=>v.protectedFactIds.includes(f.id)).value='DIFFERENT-HIDDEN-CONTACT';v.facts.find(f=>f.predicate==='recipient_signature').value='filled';const p=await sealPackage(v),a=await opened(),b=await opened(p);assert.deepEqual(a.data.messages.map(m=>m.outward),b.data.messages.map(m=>m.outward));assert.deepEqual(a.data.decisions,b.data.decisions);
});
test('M3-38 source pointers cannot dereference concealed fields and no selector/asset proxy enters decisions',async()=>{
 const run=await restricted();for(const d of E.inspectRun(run,pkg).decisions){const view=d.actualInput;const text=snapshot(view);for(const word of ['privateComposition','selectedVibe','selectedSalience','templateId','cacheKey','PRIVATE-M3-FIXTURE'])assert.ok(!text.includes(word),word);for(const o of view.observations){const read=readObservedSource(view,o.source);assert.ok(!snapshot(read).includes('PRIVATE-M3-FIXTURE'));}}
});
test('M3-39 renamed actors/subjects/actions/package and neutral text use the same recovery and closure machinery',async()=>{
 let text=JSON.stringify(authored);const ids=[...new Set(text.match(/(?:actor|subject|action|fact|service|package)_[0-9a-f]{4}/g))];for(const value of ids)text=text.replaceAll(value,value.replace(/_([0-9a-f]+)/,(_,n)=>'_'+(parseInt(n,16)+256).toString(16).padStart(4,'0')));
 const v=JSON.parse(text);v.title='Neutral archive';v.contentRevision='neutral-portability-v1';v.actors.forEach((a,i)=>a.label='Participant '+i);v.subjects.forEach((s,i)=>s.label='Reference '+i);v.facts.forEach((f,i)=>f.label='Observed fragment '+i);v.initial.witnessAccount.interpretation='A bounded report with unobserved destination and purpose.';const p=await sealPackage(v);
 const win=await recovered(p);assert.equal(win.data.world.recovered,true);const limited=await restricted(p),r=p.content.initial.rule,c=markNoticeDisplayed(E.prepareSend(limited,p,draft('request_access',{targetId:r.recordId,scopeId:r.wholeScopeId})));assert.equal(commit(limited,c,p).data.world.serviceOpen,false);
});
test('M3-40 new core has no scenario/name/keyword policy branch; original M2 kernel bytes remain unchanged',async()=>{
 for(const file of ['engine.mjs','policy.mjs','knowledge.mjs','meaning.mjs']){const source=await fs.readFile(new URL('../src/m3/'+file,import.meta.url),'utf8');assert.ok(!/\b(?:Tamsin|Orrin|Nera|Seed A|Last Collection|green case|dry storage)\b/i.test(source),file);}
 const identity=JSON.parse(await fs.readFile(new URL('../reference/M2_Baseline.identity.json',import.meta.url),'utf8'));for(const file of ['runtime.mjs','action-boundary.mjs','contracts.mjs','views.mjs']){const b=await fs.readFile(new URL('../src/'+file,import.meta.url));assert.equal(createHash('sha256').update(b).digest('hex'),identity.files.find(x=>x.path==='src/'+file).sha256);}
});
test('M3-41 salience changes prominence only, including money and protected scope',async()=>{
 const run=await opened();for(const act of ['request_access','propose_exchange']){const o=['SUBTLE','NUANCED','OVERT'].map(s=>copy(E.prepareSend(run,pkg,draft(act,{targetId:rule.itemId,scopeId:rule.wholeScopeId,amountMinor:100,salience:s})).payload.preview.message.outward));o.forEach(x=>delete x.prominence);assert.deepEqual(o[0],o[1]);assert.deepEqual(o[1],o[2]);}
});
test('M3-42 recovery, money, privacy, social concern and record correction are independent outcomes',async()=>{
 let run=await restricted();run=request(run,'compare');run=action(run,rule.comparisonActionId);run=commit(run,E.prepareConfirmation(run,pkg));const out=E.inspectRun(run,pkg).outcomes;assert.equal(out.recovered,true);assert.equal(out.recordCorrected,false);assert.equal(out.privateDisclosed,false);assert.equal(out.balances[authored.humanId],1200);assert.equal(run.data.hypotheses[0].band,'corrected');
});
test('M3-43 human knowledge is received information, never a simulated accepted belief or psychology',async()=>{
 const run=await recovered();assert.ok(E.playerView(run).evidence.length>0);assert.equal(run.data.beliefs.filter(b=>b.holderId===authored.humanId).length,0);assert.equal(run.data.hypotheses.filter(h=>h.holderId===authored.humanId).length,0);assert.ok(run.data.beliefs.every(b=>Object.hasOwn(run.data.profiles,b.holderId)));
});
test('M3-44 no-charge refusal is derived from the authored service price, not a universal free-collection branch',async()=>{
 const v=copy(authored);v.initial.rule.handoverPriceMinor=100;const p=await sealPackage(v);let run=await opened(p);run=send(run,draft('propose_exchange',{targetId:p.content.initial.rule.itemId,scopeId:p.content.initial.rule.itemId,amountMinor:100}),p);assert.notEqual(run.data.messages.at(-1).outward.act,'ordinary_payment_refusal');assert.equal(run.data.world.balances[v.humanId],1200);
});
test('M3-45 closed domain schemas reject invented human psychology or unsupported world fields',async()=>{
 const run=await opened(),bad=copy(run);bad.data.humanSincerity='invented';assert.throws(()=>E.validateDomain(bad.data,pkg.content));const world=copy(run.data);world.world.hiddenGoal='invented';assert.throws(()=>E.validateDomain(world,pkg.content));
});
test('M3-46 physical inspection reads current authoritative facts without teaching an unobserving NPC',async()=>{
 const run=await opened(),data=copy(run.data);data.world.facts.find(f=>f.predicate==='recipient_signature').value='filled';const before=actorView(data,rule.custodianId);const request=E.prepareAction(run,pkg,rule.inspectionActionIds[0]).payload.request,result=E.resolveAction(data,pkg.content,request);assert.equal(result.observerDetails.find(x=>x.observerId===authored.humanId).details.evidence[0].value,'filled');assert.deepEqual(actorView(data,rule.custodianId),before);
});
test('M3-47 soft opportunity reminder is not a hidden state-size deadline; references reconstruct exact inputs',async()=>{
 let run=await opened();for(let i=0;i<30;i++)run=request(run);assert.ok(run.data.opportunities.used>24);assert.equal(run.data.world.serviceOpen,true);assert.equal(run.data.visits[0].repairUsed,false);const before=snapshot(run);for(const d of run.data.decisions){const input=E.decisionInput(run,d.id);assert.equal(chooseResponse(input,{noticeDisplayed:d.noticeDisplayed}).selected,d.selected);}E.inspectRun(run,pkg);assert.equal(snapshot(run),before);const loaded=await E.importRun(E.exportRun(run,pkg),pkg);assert.deepEqual(loaded,run);
});
test('M3-48 exact confirmation rechecks current custody and balances atomically in a neutral priced fixture',async()=>{
 const v=copy(authored);v.title='Neutral atomic transfer fixture';v.contentRevision='neutral-confirmation-v1';v.initial.rule.handoverPriceMinor=100;const p=await sealPackage(v),run=await compared(p),command=E.prepareConfirmation(run,p);
 const moved=copy(run);moved.data.world.holderId=p.content.subjects.find(s=>s.id!==v.initial.holderId&&s.id!==v.initial.itemId).id;const movedBefore=snapshot(moved);assert.equal(E.dispatch(moved,p,command).status,'rejected');assert.equal(snapshot(moved),movedBefore);
 const funds=copy(run);funds.data.world.balances[v.initial.rule.witnessId]+=funds.data.world.balances[v.humanId];funds.data.world.balances[v.humanId]=0;const fundsBefore=snapshot(funds);assert.equal(E.dispatch(funds,p,command).status,'rejected');assert.equal(snapshot(funds),fundsBefore);assert.equal(funds.data.world.recovered,false);
});
