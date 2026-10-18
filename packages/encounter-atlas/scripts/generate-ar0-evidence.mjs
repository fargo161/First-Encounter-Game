import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {projectAtlas,renderAtlasMarkdown,networkFromAtlas} from '../src/ar0/atlas.mjs';
import {canonicalJson} from '../src/m3/types.mjs';
import * as E from '../src/m3/engine.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),folder=path.join(root,'evidence/ar0'),browser=path.join(folder,'browser'),proofs=path.join(root,'proofs/ar0');
const read=async p=>JSON.parse(await fs.readFile(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const catalog=await read(path.join(root,'content/ar0/last-collection.json')),identity=await read(path.join(folder,'source-identity.json')),records=[];
await fs.mkdir(proofs,{recursive:true});
for(const name of (await fs.readdir(browser)).filter(n=>n.startsWith('ui-')&&n.endsWith('.json')&&!n.endsWith('-trace.json')).sort()){
 const bytes=await fs.readFile(path.join(browser,name)),saved=JSON.parse(bytes);if(saved.schema!=='encounter-save@3')continue;
 const run=await E.importRun(saved,saved.package),before=canonicalJson(run),trace=E.inspectRun(run,saved.package),stem=name.slice(0,-5);let rawCompared=false;
 try{assert.deepEqual(await read(path.join(browser,stem+'-raw-trace.json')),trace);rawCompared=true;}catch(error){if(error.code!=='ENOENT')throw error;}
 for(const j of run.journal){const retry=E.dispatch(run,saved.package,j.command);assert.equal(retry.status,'replayed');assert.deepEqual(retry.run,run);}
 const projections={};
 for(const audience of ['author','player']){
  const projection=await projectAtlas(run,saved.package,catalog,{audience});assert.deepEqual(await projectAtlas(await E.importRun(saved,saved.package),saved.package,catalog,{audience}),projection);
  if(audience==='player')for(const f of saved.package.content.facts.filter(f=>saved.package.content.protectedFactIds.includes(f.id)))assert.ok(!JSON.stringify(projection).includes(String(f.value)));
  projections[audience]={cards:projection.cards.length,links:projection.links.length,events:projection.cards.filter(c=>c.kind==='event').length,groups:projection.cards.filter(c=>c.kind==='group').length,recentChanges:projection.recentChanges.length};
  assert.equal(projections[audience].groups,0);
  const prefix=path.join(proofs,stem+'-'+audience);
  await fs.writeFile(prefix+'.json',JSON.stringify(projection,null,2)+'\n');await fs.writeFile(prefix+'.md',renderAtlasMarkdown(projection));await fs.writeFile(prefix+'-network.json',JSON.stringify(networkFromAtlas(projection),null,2)+'\n');
 }
 assert.equal(canonicalJson(run),before);
 await fs.writeFile(path.join(browser,stem+'-trace.json'),JSON.stringify({metadata:{sourceRevision:identity.sourceRevision,sourceDigest:identity.sourceDigest,buildSHA256:identity.M3BuildSHA256,saveSHA256:sha(bytes),rawCompared},trace},null,2)+'\n');
 const lines=['# AR0 fresh browser interaction transcript',`Run ${run.id}, revision ${run.revision}. Save SHA-256 ${sha(bytes)}.`, '','Canonical M3 interactions and results; Atlas projections are read-only.',''];
 for(const j of run.journal){lines.push(`## Revision ${j.receipt.committedRevision}: ${j.command.kind} / ${j.command.payload.operation??j.command.payload.draft?.act}`,'');if(j.command.kind==='send_message')lines.push(j.command.payload.preview.text,`Display receipt: ${JSON.stringify(j.command.payload.preview.notice)}`,'');const e=run.data.episodes.find(e=>e.commandId===j.command.id);if(e)lines.push('Intake: '+e.intake.description,'','Delivery: '+e.delivery.text,'');lines.push('Committed result:','```json',JSON.stringify(j.receipt.result,null,2),'```','');}await fs.writeFile(path.join(browser,stem+'-transcript.md'),lines.join('\n'));
 records.push({name,saveSHA256:sha(bytes),revision:run.revision,rawCompared,outcomes:trace.outcomes,defects:trace.technicalDefects,closeResults:run.data.actionResults.filter(r=>r.request.actionType===saved.package.content.initial.rule.closeActionId).length,handoverResults:run.data.actionResults.filter(r=>r.request.actionType===saved.package.content.initial.rule.handoverActionId).length,projections});
}
const get=n=>{const r=records.find(r=>r.name===n+'.json');assert.ok(r,n);return r;};
for(const n of ['collapse','missing','opacity','ancestor','horizontal']){const r=get('ui-'+n);assert.equal(r.outcomes.serviceOpen,true);assert.equal(r.closeResults,0);assert.deepEqual(r.defects.map(d=>d.type),['MISSING_CLOSURE_PREVIEW']);}
const normal=get('ui-normal');assert.equal(normal.outcomes.serviceOpen,false);assert.equal(normal.closeResults,1);assert.equal(normal.defects.length,0);
for(const [a,b] of [['ui-repaired','ui-repaired-loaded'],['ui-normal','ui-normal-loaded'],['ui-post-recovery','ui-replayed']])assert.deepEqual(await read(path.join(browser,a+'.json')),await read(path.join(browser,b+'.json')));
const recovery=get('ui-recovery'),post=get('ui-post-recovery');assert.equal(recovery.handoverResults,1);assert.equal(recovery.outcomes.recovered,true);assert.equal(recovery.outcomes.ownerId,'actor_0003');assert.equal(recovery.outcomes.balances.actor_0001,1200);assert.equal(recovery.outcomes.privateDisclosed,false);assert.deepEqual(recovery.outcomes,post.outcomes);assert.equal(post.closeResults,0);
for(const n of ['ui-collapse','ui-normal','ui-recovery'])assert.equal(get(n).rawCompared,true,n);
assert.equal(get('ui-pending').handoverResults,0);assert.equal(get('ui-acknowledged').handoverResults,0);
const checks=await read(path.join(browser,'checks.json'));assert.ok(checks.length>0&&checks.every(c=>c.passed));
const summary={result:'PASS',sourceRevision:identity.sourceRevision,sourceDigest:identity.sourceDigest,unchangedM3BuildSHA256:identity.M3BuildSHA256,browserRuns:records.length,rawInspectorsCompared:records.filter(r=>r.rawCompared).length,proofProjections:records.length*2,allProjectionsDeterministicPureAndSaveLoadStable:true,allBrowserJournalsReplayedAndEveryExactCommandRetryValidated:true,playerPrivateValueLeak:false,allRenderingFaultsProtected:true,visibleClosureExactlyOnce:true,recoveryProtected:true,saveLoadAndUIReplayEquality:true,checks:checks.length,runs:records};await fs.writeFile(path.join(folder,'generated-evidence-summary.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({...summary,runs:undefined}));
