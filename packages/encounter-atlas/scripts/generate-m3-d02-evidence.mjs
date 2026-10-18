import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import * as E from '../src/m3/engine.mjs';
import {sealPackage} from '../src/m3/types.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),folder=path.join(root,'evidence/m3-d02');
const read=async n=>JSON.parse(await fs.readFile(n,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const source=await read(path.join(root,'evidence/m3/source-identity.json')),pkg=await sealPackage(await read(path.join(root,'content/m3/seed.json'))),buildSHA256=sha(await fs.readFile(path.join(root,'dist-m3/index.html'))),records=[];
for(const name of (await fs.readdir(folder)).filter(n=>n.startsWith('browser-')&&n.endsWith('.json')&&!n.endsWith('-trace.json')).sort()){
 const bytes=await fs.readFile(path.join(folder,name)),saved=JSON.parse(bytes);if(saved?.schema!=='encounter-save@3')continue;
 const run=await E.importRun(saved,pkg),trace=E.inspectRun(run,pkg),stem=name.slice(0,-5),before=name.startsWith('browser-before-');let rawInspectorCompared=false;
 try{assert.deepEqual(await read(path.join(folder,stem+'-raw-trace.json')),trace);rawInspectorCompared=true;}catch(error){if(error.code!=='ENOENT')throw error;}
 const metadata={origin:'Actual M3-D02 remediation browser UI export',name,runSHA256:sha(bytes),sourceRevision:before?'M3-runtime-v1-R1-D01':source.sourceRevision,sourceDigest:before?'35fa58990b19a08933fefb7e2f37ba1d5c5edc5807390354eae238e531588711':source.sourceDigest,buildSHA256:before?'11393dde2ae110d3b04aac03c1044e000be6b410e4bffacb16216829c9050052':buildSHA256,packageRef:pkg.ref,revision:run.revision,historicalDefectReproduction:before,rawInspectorCompared};
 await fs.writeFile(path.join(folder,stem+'-trace.json'),JSON.stringify({metadata,trace},null,2)+'\n');
 const lines=['# M3-D02 browser interaction transcript','',...Object.entries(metadata).map(([k,v])=>`${k}: ${JSON.stringify(v)}`),'','Complete UI save validated by deterministic journal replay. Before-fix runs are preserved R1 controls.',''];
 for(const j of run.journal){const c=j.command;lines.push(`## Commit ${j.receipt.committedRevision}: ${c.kind} / ${c.payload.operation??c.payload.draft?.act}`,'');if(c.kind==='send_message')lines.push('Bound preview:','```text',c.payload.preview.text,'```',`Notice receipt: ${JSON.stringify(c.payload.preview.notice)}`,'');const e=run.data.episodes.find(e=>e.commandId===c.id);if(e)lines.push('Intake: '+e.intake.description,'','Delivery:','```text',e.delivery.text,'```','');for(const r of run.data.actionResults.filter(r=>r.request.commandId===c.id))lines.push('Physical result:','```json',JSON.stringify(r,null,2),'```','');lines.push('Committed changes:','```json',JSON.stringify(j.receipt.result.changes,null,2),'```','');}
 lines.push('## Final outcome','','```json',JSON.stringify({outcomes:trace.outcomes,visits:trace.visits,defects:trace.technicalDefects},null,2),'```','');await fs.writeFile(path.join(folder,stem+'-transcript.md'),lines.join('\n'));
 records.push({...metadata,outcomes:trace.outcomes,defects:trace.technicalDefects,closeResults:run.data.actionResults.filter(r=>r.request.actionType===pkg.content.initial.rule.closeActionId).length,handoverResults:run.data.actionResults.filter(r=>r.request.actionType===pkg.content.initial.rule.handoverActionId).length});
}
const get=n=>{const r=records.find(r=>r.name===n+'.json');assert.ok(r,n);return r;};
for(const n of ['before-horizontal','before-zero-width']){const r=get('browser-'+n);assert.equal(r.closeResults,1);assert.equal(r.outcomes.serviceOpen,false);assert.equal(r.defects.length,0);}
for(const n of ['horizontal','zero-width','opacity','ancestor','vertical']){const r=get('browser-'+n);assert.equal(r.closeResults,0);assert.equal(r.outcomes.serviceOpen,true);assert.deepEqual(r.defects.map(d=>d.type),['MISSING_CLOSURE_PREVIEW']);}
for(const n of ['normal','scroll']){const r=get('browser-'+n);assert.equal(r.closeResults,1);assert.equal(r.outcomes.serviceOpen,false);assert.equal(r.defects.length,0);}
const recovery=get('browser-recovery'),post=get('browser-post-recovery');assert.equal(recovery.handoverResults,1);assert.equal(recovery.outcomes.recovered,true);assert.equal(recovery.outcomes.ownerId,pkg.content.initial.rule.ownerId);assert.equal(recovery.outcomes.balances[pkg.content.humanId],1200);assert.equal(recovery.outcomes.privateDisclosed,false);assert.deepEqual(recovery.outcomes,post.outcomes);assert.equal(post.closeResults,0);
for(const [a,b] of [['browser-repaired','browser-repaired-after-load'],['browser-normal','browser-normal-after-load']])assert.deepEqual(await read(path.join(folder,a+'.json')),await read(path.join(folder,b+'.json')));
for(const n of ['browser-horizontal','browser-zero-width','browser-normal','browser-recovery'])assert.equal(get(n).rawInspectorCompared,true,n);
const checks=await read(path.join(folder,'browser-checks.json'));assert.ok(checks.filter(c=>c.stage==='after').every(c=>c.passed));assert.ok(checks.filter(c=>c.stage==='before').every(c=>c.expectedDefectReproduced));
const summary={result:'PASS',sourceRevision:source.sourceRevision,sourceDigest:source.sourceDigest,buildSHA256,packageRef:pkg.ref,browserExports:records.length,rawInspectorsCompared:records.filter(r=>r.rawInspectorCompared).length,beforeDefectsReproduced:true,allInvalidDisplaysKeepServiceOpen:true,visibleAndScrolledClosurePass:true,recoveryAndPostRecoveryPass:true,saveLoadEquality:true,browserRecords:checks.length,runs:records};await fs.writeFile(path.join(folder,'generated-evidence-summary.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({...summary,runs:undefined}));
