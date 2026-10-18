import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const home=path.dirname(fileURLToPath(import.meta.url)), root=path.resolve(process.env.M3_CHECKPOINT??path.join(home,'checkpoint')), evidence=path.join(home,'evidence');
const load=n=>import(pathToFileURL(path.join(root,n)));
const E=await load('src/m3/engine.mjs'), T=await load('src/m3/types.mjs'), M=await load('src/m3/meaning.mjs'), K=await load('src/m3/knowledge.mjs');
const authored=JSON.parse(await fs.readFile(path.join(root,'content/m3/seed.json'),'utf8')), pkg=await T.sealPackage(authored), rule=pkg.content.initial.rule;
const cp=v=>JSON.parse(JSON.stringify(v)), same=(a,b)=>assert.deepEqual(a,b), persist=async(n,v)=>fs.writeFile(path.join(evidence,n+'.json'),JSON.stringify(v,null,2)+'\n');
let counter=0xa000;
const cid=()=>`command_${(++counter).toString(16)}`;
function commit(run,p,c){const x=E.dispatch(run,p,c);assert.equal(x.status,'committed',`${c.kind}/${c.payload.operation??c.payload.draft?.act}: ${x.code}`);return x.run;}
function send(run,p,act,extra={},display=false){let c=E.prepareSend(run,p,M.draft(act,extra),cid());if(display&&c.payload.preview.notice)c=M.markNoticeDisplayed(c);return commit(run,p,c);}
function action(run,p,kind){const a=p.content.actions.find(a=>a.kind===kind);return commit(run,p,E.prepareAction(run,p,a.id,cid()));}
function switchTo(run,p,who){return commit(run,p,E.prepareSessionOperation(run,p,'switch_partner',who,cid()));}
function req(run,p,operation='inspect',scope=null){const r=p.content.initial.rule;return send(run,p,'request_access',{operation,targetId:operation==='collect'?r.itemId:r.recordId,scopeId:scope??E.playerView(run).rule?.relevantScopeId??r.recordId});}
async function opened(p=pkg){let s=await E.startEncounter(p);s=action(s,p,'verify_authority');return req(s,p);}
async function learned(p=pkg){const r=p.content.initial.rule;let s=await opened(p);s=action(s,p,'search');s=action(s,p,'inspect');s=switchTo(s,p,r.witnessId);s=send(s,p,'ask_whereabouts',{operation:'ask',targetId:r.itemId,scopeId:r.itemId});return switchTo(s,p,r.custodianId);}
async function restricted(p=pkg,learn=true){const r=p.content.initial.rule;let s=learn?await learned(p):await opened(p);s=send(s,p,'ask_whereabouts',{operation:'ask',targetId:r.ownerTopicId,scopeId:r.ownerTopicId});return req(s,p,'inspect',r.wholeScopeId);}
function broad(s,p=pkg,display=false){const r=p.content.initial.rule;return send(s,p,'request_access',{targetId:r.recordId,scopeId:r.wholeScopeId},display);}
async function pending(p=pkg){let s=await learned(p);s=req(s,p,'compare');return action(s,p,'compare');}
const confirm=(s,p=pkg)=>commit(s,p,E.prepareConfirmation(s,p,cid()));
const why=(s,p=pkg)=>{const r=p.content.initial.rule;return send(s,p,'why',{operation:'explain',targetId:r.recordId,scopeId:r.relevantScopeId,contextMessageId:E.playerView(s).warningMessageId});};
async function roundtrip(s,p=pkg){const saved=E.exportRun(s,p),loaded=await E.importRun(cp(saved),p);same(loaded,s);for(const j of s.journal){const x=E.dispatch(loaded,p,j.command);assert.equal(x.status,'replayed');same(x.run,s);}return loaded;}

test('I3-01 exact source digest, baseline test/kernel preservation and absence of skip shims',async()=>{
 const original=JSON.parse(await fs.readFile(path.join(root,'baseline/Encounter_M2_Checkpoint.identity.json'),'utf8'));
 const relevant=original.files.filter(x=>/^tests\/|^src\/(runtime|contracts|views|action-boundary)\.mjs$|^independent\/.*\.test\.mjs$/.test(x.path));
 for(const x of relevant){assert.equal(createHash('sha256').update(await fs.readFile(path.join(root,x.path))).digest('hex'),x.sha256,x.path);}
 const source=JSON.parse(await fs.readFile(path.join(root,'evidence/m3/source-identity.json'),'utf8'));
 const entries=[];for(const x of source.files)entries.push({path:x.path,sha256:createHash('sha256').update(await fs.readFile(path.join(root,x.path))).digest('hex')});
 assert.equal(createHash('sha256').update(T.canonicalJson(entries)).digest('hex'),'716a11c4efe9462e8ad60f16d6615ed8537811cf779d10dee424ef92558e3a94');
 for(const n of ['tests/m3.test.mjs','tests/m3-fixtures.mjs'])assert.ok(!/\b(?:test|it)\.(?:skip|todo)|process\.env.*skip/i.test(await fs.readFile(path.join(root,n),'utf8')));
 await persist('independent-preservation',{baselineProtectedEntries:relevant,sourceDigest:source.sourceDigest});
});
test('I3-02 first paperwork stays protected across framing and earlier owner inquiry',async()=>{
 for(const vibe of ['EA','SE','AB'])for(const salience of ['SUBTLE','NUANCED','OVERT']){
  let s=await E.startEncounter(pkg);s=action(s,pkg,'verify_authority');s=send(s,pkg,'ask_whereabouts',{operation:'ask',targetId:rule.ownerTopicId,scopeId:rule.ownerTopicId});s=send(s,pkg,'request_access',{targetId:rule.recordId,scopeId:rule.recordId,vibe,salience});
  assert.equal(s.data.messages.at(-1).outward.act,'explain_access');assert.equal(s.data.visits[0].warningMessageId,null);assert.equal(s.data.hypotheses.length,0);assert.equal(E.playerView(s).evidence.length,0);
 }
});
test('I3-03 equal performed paths ignore private selectors throughout restriction and closure',async()=>{
 const content=cp(authored);content.communication.expressions.push({...cp(content.communication.expressions[0]),vibe:'SB',templateId:'template_f001'});const p=await T.sealPackage(content);
 async function flow(vibe){let s=await opened(p);for(const [act,extra] of [['ask_whereabouts',{operation:'ask',targetId:rule.ownerTopicId,scopeId:rule.ownerTopicId}],['request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}],['request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}]])s=send(s,p,act,{...extra,vibe},true);return s;}
 const a=await flow('EA'),b=await flow('SB');same(a.data.messages.map(x=>x.outward),b.data.messages.map(x=>x.outward));same(a.data.decisions,b.data.decisions);same(a.data.observations,b.data.observations);assert.equal(a.data.world.serviceOpen,false);
});
test('I3-04 concealed truth and unsent edits cannot change unreceived privacy decisions',async()=>{
 const v=cp(authored);v.facts.find(f=>v.protectedFactIds.includes(f.id)).value='INDEPENDENT-CONCEALED-SENTINEL';v.facts.find(f=>f.predicate==='recipient_signature').value='different-unread-signature';const p=await T.sealPackage(v);
 const a=await restricted(pkg,false),b=await restricted(p,false);same(a.data.decisions,b.data.decisions);
 const before=cp(a);for(let i=0;i<10;i++){E.prepareSend(a,pkg,M.draft('request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}),cid());E.inspectRun(a,pkg);}same(a,before);
});
test('I3-05 unheard owner inquiry to witness cannot supply custodian privacy support',async()=>{
 let s=await opened();s=switchTo(s,pkg,rule.witnessId);s=send(s,pkg,'ask_whereabouts',{operation:'ask',targetId:rule.ownerTopicId,scopeId:rule.ownerTopicId});s=switchTo(s,pkg,rule.custodianId);s=req(s,pkg,'inspect',rule.wholeScopeId);assert.equal(s.data.visits[0].restricted,false);assert.equal(s.data.hypotheses.length,0);
});
test('I3-06 inspect conduct, opaque roots, limited witness and absent owner remain distinct',async()=>{
 const s=await learned(),clerk=K.actorView(s.data,rule.custodianId),witness=K.actorView(s.data,rule.witnessId);
 assert.ok(!clerk.evidence.some(e=>e.predicate==='recipient_signature'));assert.ok(!witness.evidence.some(e=>['recipient_signature','storage_location','movement_reason','handling_type','item_reference'].includes(e.predicate)));
 assert.equal(s.data.observations.filter(o=>o.observerId===rule.ownerId).length,0);
 for(const view of [clerk,witness])for(const src of s.data.events.map(e=>({kind:'event',id:e.id}))){const read=K.readObservedSource(view,src);assert.ok(!JSON.stringify(read).includes('PRIVATE-M3-FIXTURE'));}
 assert.ok(!JSON.stringify(witness.evidence).includes('spill_protection'));same(K.readObservedSource(witness,{kind:'event',id:'event_ffff'}),[]);
});
test('I3-07 non-substantive activities, rejected commands and save reload preserve repair and authority',async()=>{
 let s=await restricted(),warning=s.data.visits[0].warningMessageId,authority=cp(K.actorView(s.data,rule.custodianId).authority),used=s.data.opportunities.used;
 s=why(s);s=switchTo(s,pkg,rule.witnessId);s=commit(s,pkg,E.prepareSessionOperation(s,pkg,'end_conversation',null,cid()));s=switchTo(s,pkg,rule.custodianId);
 const bad=cp(E.prepareSend(s,pkg,M.draft('request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}),cid()));bad.payload.preview.message.outward.content.text='Changed after preview';const before=cp(s);assert.equal(E.dispatch(s,pkg,bad).status,'rejected');same(s,before);
 s=await roundtrip(s);assert.equal(s.data.opportunities.used,used);assert.equal(s.data.visits[0].repairUsed,false);same(K.actorView(s.data,rule.custodianId).authority,authority);
 s=send(s,pkg,'acknowledge_grievance',{targetId:rule.recordId,scopeId:rule.relevantScopeId});assert.equal(s.data.visits[0].repairUsed,false);s=req(s,pkg,'compare');assert.equal(s.data.visits[0].repairUsed,true);assert.equal(s.data.visits[0].warningMessageId,warning);assert.equal(s.data.world.comparisonComplete,false);assert.equal(s.data.world.recovered,false);
 const repairs=s.data.decisions.filter(d=>d.selected==='scope_repaired').length;s=req(s,pkg,'compare');assert.equal(s.data.decisions.filter(d=>d.selected==='scope_repaired').length,repairs);await persist('independent-repair',E.exportRun(await roundtrip(s),pkg));
});
test('I3-08 full closure matrix: no warning, missing display, stale, edited and current receipts',async()=>{
 let a=await opened();a=broad(a);assert.equal(a.data.world.serviceOpen,true);const s=await restricted(),before=cp(s),c=M.markNoticeDisplayed(E.prepareSend(s,pkg,M.draft('request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}),cid()));
 const edited=cp(c);edited.payload.draft.scopeId=rule.relevantScopeId;assert.equal(E.dispatch(s,pkg,edited).status,'rejected');same(s,before);
 const narrowed=E.prepareSend(s,pkg,M.draft('request_access',{operation:'compare',targetId:rule.recordId,scopeId:rule.relevantScopeId}),cid());assert.equal(narrowed.payload.preview.notice,null);assert.equal(E.prepareSend(s,pkg,M.draft('why',{operation:'explain',targetId:rule.recordId,scopeId:rule.relevantScopeId,contextMessageId:E.playerView(s).warningMessageId}),cid()).payload.preview.notice,null);
 const newer=why(s);assert.equal(E.dispatch(newer,pkg,c).code,'STALE_COMMAND');const stale=cp(c);stale.id=cid();stale.expectedRevision=newer.revision;assert.equal(E.dispatch(newer,pkg,stale).status,'rejected');
 const missing=broad(s);assert.equal(missing.data.world.serviceOpen,true);assert.equal(missing.data.defects.length,1);assert.equal(missing.data.messages.at(-1).outward.act,'boundary_refusal');assert.equal(missing.data.actionResults.filter(x=>x.request.actionType===rule.closeActionId).length,0);same(missing.data.world,s.data.world);
 const closed=commit(s,pkg,c);assert.equal(closed.data.world.serviceOpen,false);assert.equal(closed.data.actionResults.filter(x=>x.request.actionType===rule.closeActionId).length,1);for(let i=0;i<3;i++){const x=E.dispatch(closed,pkg,c);assert.equal(x.status,'replayed');same(x.run,closed);}await persist('independent-closure',E.exportRun(closed,pkg));await persist('independent-missing-notice',E.exportRun(missing,pkg));
});
test('I3-09 completed recovery retains custody and success after warned broad request',async()=>{
 let s=await restricted();s=req(s,pkg,'compare');s=action(s,pkg,'compare');s=confirm(s);const w=cp(s.data.world);s=broad(s,pkg,true);same(s.data.world,w);assert.equal(s.data.world.recovered,true);assert.equal(s.data.defects.length,0);assert.equal(s.data.visits[0].repairUsed,true);
});
test('I3-10 money offer is actual communication; bypass has distinct outward meaning',async()=>{
 let s=await opened();const before=cp(s.data.world),messages=s.data.messages.length;
 s=send(s,pkg,'propose_exchange',{targetId:rule.itemId,scopeId:rule.itemId,amountMinor:300});same(s.data.world,before);assert.equal(s.data.messages.length,messages+2);assert.equal(s.data.messages.at(-1).outward.act,'ordinary_payment_refusal');assert.equal(s.data.hypotheses.length,0);
 const a=E.prepareSend(s,pkg,M.draft('propose_exchange',{targetId:rule.itemId,scopeId:rule.itemId,amountMinor:300}),cid()),b=E.prepareSend(s,pkg,M.draft('propose_exchange',{targetId:rule.itemId,scopeId:rule.wholeScopeId,amountMinor:300,purpose:'boundary_exception'}),cid());assert.notEqual(a.payload.preview.text,b.payload.preview.text);assert.notDeepEqual(a.payload.preview.message.outward,b.payload.preview.message.outward);
});
test('I3-11 acknowledgment and offer discussion do not transfer; confirmations bind every term',async()=>{
 let s=await pending(),offer=cp(E.playerView(s).activeOffer),w=cp(s.data.world);s=send(s,pkg,'yes',{targetId:rule.itemId,scopeId:rule.itemId});same(s.data.world,w);same(E.playerView(s).activeOffer,offer);
 const c=E.prepareConfirmation(s,pkg,cid());for(const [k,v] of Object.entries({amountMinor:1,ownerId:rule.witnessId,toId:rule.custodianId,fromId:rule.itemId,itemId:rule.recordId})){const x=cp(c);x.payload.terms[k]=v;assert.equal(E.dispatch(s,pkg,x).status,'rejected',k);same(s.data.world,w);}
 const loaded=await roundtrip(s),done=commit(loaded,pkg,c);assert.equal(done.data.world.holderId,authored.humanId);assert.equal(done.data.world.ownerId,rule.ownerId);assert.equal(done.data.world.balances[authored.humanId],1200);assert.equal(E.dispatch(done,pkg,c).status,'replayed');
});
test('I3-12 stale proposal and changed current custody or balance fail atomically',async()=>{
 const v=cp(authored);v.title='Neutral transfer primitive';v.contentRevision='review-priced-primitive';v.initial.rule.handoverPriceMinor=100;const p=await T.sealPackage(v),s=await pending(p),c=E.prepareConfirmation(s,p,cid());
 for(const kind of ['custody','balance','offer-version']){const x=cp(s);if(kind==='custody')x.data.world.holderId=rule.recordId;else if(kind==='balance'){x.data.world.balances[rule.witnessId]+=x.data.world.balances[v.humanId];x.data.world.balances[v.humanId]=0;}else x.data.offers.at(-1).revision++;const before=cp(x);assert.equal(E.dispatch(x,p,c).status,'rejected',kind);same(x,before);}
 let ended=commit(s,p,E.prepareSessionOperation(s,p,'end_conversation',null,cid()));ended=switchTo(ended,p,rule.custodianId);const retry=cp(c);retry.id=cid();retry.expectedRevision=ended.revision;assert.equal(E.dispatch(ended,p,retry).status,'rejected');assert.equal(ended.data.activeOfferId,null);
});
test('I3-13 all meaningful save stages retain complete state and no result redelivery effects',async()=>{
 const permission=await opened(),partial=action(permission,pkg,'inspect'),restrictedRun=await restricted(),repaired=req(restrictedRun,pkg,'compare'),pendingRun=action(repaired,pkg,'compare'),closed=broad(restrictedRun,pkg,true),done=confirm(pendingRun);
 for(const [n,s] of Object.entries({permission,partial,restricted:restrictedRun,repaired,pending:pendingRun,closed,done})){await roundtrip(s);const data=cp(s.data);for(const x of s.data.actionResults){const result=E.stageResolved(data,pkg.content,x.request,x);assert.equal(result.replayed,true);}same(data,s.data);await persist('independent-save-'+n,E.exportRun(s,pkg));}
});
test('I3-14 tamper journal, receipt, warning, repair, world and package reject without changing current run',async()=>{
 const s=await restricted(),saved=E.exportRun(s,pkg),before=cp(s);const mutations=[x=>x.run.data.visits[0].warningMessageId=null,x=>x.run.data.visits[0].repairUsed=true,x=>x.run.journal[0].receipt.result.changes=[],x=>x.run.journal.pop(),x=>x.run.data.world.ownerId=rule.witnessId,x=>x.package.content.title+='changed'];
 for(const mutate of mutations){const bad=cp(saved);mutate(bad);await assert.rejects(E.importRun(bad,pkg));same(s,before);}for(const invalid of [{schema:'encounter-save@1'},null,{},[]]){await assert.rejects(E.importRun(invalid,pkg));same(s,before);}
});
test('I3-15 preview/inspector/episode/export purity compares complete exported saves',async()=>{
 const s=await restricted(),before=E.exportRun(s,pkg);for(let i=0;i<4;i++){E.prepareSend(s,pkg,M.draft('request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}),cid());E.inspectRun(s,pkg);E.playerView(s);for(const e of s.data.episodes)E.renderEpisode(s,e.id);E.exportRun(s,pkg);}same(E.exportRun(s,pkg),before);
});
test('I3-16 independent simultaneous neutral identity and prose renaming preserves recovery and closure',async()=>{
 const mappings=new Map();let next=0xd000;const walk=x=>{if(Array.isArray(x))return x.map(walk);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[walk(k),walk(v)]));if(typeof x==='string')return x.replace(/\b(actor|subject|action|fact|service|package)_[0-9a-f]{4}\b/g,id=>{if(!mappings.has(id))mappings.set(id,id.split('_')[0]+'_'+(++next).toString(16));return mappings.get(id);});return x;};
 const v=walk(authored);v.title='Workshop consignment';v.contentRevision='independent-rename-v1';v.actors.forEach((x,i)=>x.label=['Courier','Mira','Sol','Ivo'][i]);v.subjects.forEach((x,i)=>x.label='Reference '+(100+i));v.facts.forEach((x,i)=>x.label='Evidence fragment '+(100+i));v.initial.entry='moved internally';v.initial.rule.recordCorrection='Earlier movement entry retained; authorized release recorded separately.';v.initial.witnessAccount.interpretation='A limited report, with no destination or purpose observed.';
 const p=await T.sealPackage(v),r=p.content.initial.rule;let s=await learned(p);s=req(s,p,'compare');s=action(s,p,'compare');s=action(s,p,'correct_record');s=confirm(s,p);assert.equal(s.data.world.recovered,true);assert.equal(s.data.world.ownerId,r.ownerId);
 const closed=broad(await restricted(p),p,true);assert.equal(closed.data.world.serviceOpen,false);await persist('independent-neutral-package',p);await persist('independent-neutral-recovery',E.exportRun(s,p));await persist('independent-neutral-closure',E.exportRun(closed,p));
});
test('I3-17 core hardcode and host spatial boundary audit',async()=>{
 const files=['engine.mjs','knowledge.mjs','meaning.mjs','policy.mjs','types.mjs'],records=[];
 for(const n of files){const s=await fs.readFile(path.join(root,'src/m3',n),'utf8');assert.ok(!/\b(Tamsin|Orrin|Nera|Last Collection|Seed A|Trapstar|green case|transport office|pathfinding|billboarding|spawn|despawn)\b/i.test(s),n);assert.ok(!/document\.|window\.|getBoundingClientRect|lineOfSight|routeGraph|npcLane/.test(s),n);records.push({file:n,bytes:s.length});}await persist('independent-source-audit',records);
});
test('I3-18 fresh visible-browser saves replay and match their actual UI traces',async()=>{
 const names=['browser-clean-recovery','browser-warned-closure','browser-repaired-not-recovered','browser-missing-display-receipt'];
 for(const n of names){const save=JSON.parse(await fs.readFile(path.join(evidence,n+'.json'),'utf8')),run=await E.importRun(save,pkg),trace=JSON.parse(await fs.readFile(path.join(evidence,n+'-trace.json'),'utf8'));same(E.inspectRun(run,pkg),trace);}
 const read=async n=>JSON.parse(await fs.readFile(path.join(evidence,n+'.json'),'utf8'));
 same(await read('browser-clean-recovery'),await read('browser-after-read-surfaces'));same(await read('browser-warned-closure'),await read('browser-closed-reloaded'));same(await read('browser-warned-closure'),await read('browser-downloaded-closure'));same(await read('browser-repaired-not-recovered'),await read('browser-repaired-reloaded'));same(await read('browser-repaired-not-recovered'),await read('browser-after-invalid-import'));
 const negative=await read('browser-missing-display-receipt');assert.equal(negative.run.data.world.serviceOpen,true);assert.equal(negative.run.data.defects.length,1);assert.equal(negative.run.journal.at(-1).command.payload.preview.notice.displayed,false);
});
