import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import * as E from '../src/m3/engine.mjs';
import {sealPackage} from '../src/m3/types.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),folder=path.join(root,'evidence/m3-d01');
const read=async p=>JSON.parse(await fs.readFile(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const pkg=await sealPackage(await read(path.join(root,'content/m3/seed.json'))),source=await read(path.join(root,'evidence/m3/source-identity.json'));
const buildSHA256=sha(await fs.readFile(path.join(root,'dist-m3/index.html'))),records=[];
for(const name of (await fs.readdir(folder)).filter(n=>n.startsWith('browser-')&&n.endsWith('.json')&&!n.endsWith('-trace.json')&&!n.endsWith('-generated-trace.json')).sort()){
 const file=path.join(folder,name),bytes=await fs.readFile(file),saved=JSON.parse(bytes);if(saved?.schema!=='encounter-save@3')continue;
 const run=await E.importRun(saved,pkg),trace=E.inspectRun(run,pkg),stem=name.slice(0,-5),historical=name==='browser-before-transparent.json';
 const metadata={origin:'Actual remediation browser UI Save run export',name,runSHA256:sha(bytes),sourceRevision:historical?'M3-runtime-v1':source.sourceRevision,sourceDigest:historical?'716a11c4efe9462e8ad60f16d6615ed8537811cf779d10dee424ef92558e3a94':source.sourceDigest,buildSHA256:historical?'4fa1f60a1ec6a561375bdc38799693943b0910886d2f7ea838099d9303469e58':buildSHA256,packageRef:pkg.ref,revision:run.revision,historicalDefectReproduction:historical};
 try{assert.deepEqual(await read(path.join(folder,stem+'-trace.json')),trace);}catch(error){if(error.code!=='ENOENT')throw error;}
 await fs.writeFile(path.join(folder,stem+'-generated-trace.json'),JSON.stringify({metadata,trace},null,2)+'\n');
 const lines=['# M3-D01 remediation browser transcript','',...Object.entries(metadata).map(([k,v])=>`${k}: ${JSON.stringify(v)}`),'','Generated from the complete committed UI export; journal replay validated. Before-fix evidence is explicitly historical.',''];
 for(const entry of run.journal){const c=entry.command;lines.push(`## Commit ${entry.receipt.committedRevision}: ${c.kind} / ${c.payload.operation??c.payload.draft?.act}`,'');
  if(c.kind==='send_message')lines.push('Bound preview:','```text',c.payload.preview.text,'```',`Closure display receipt: ${JSON.stringify(c.payload.preview.notice)}`,'');
  const episode=run.data.episodes.find(x=>x.commandId===c.id);if(episode)lines.push('Intake: '+episode.intake.description,'','Delivery:','```text',episode.delivery.text,'```','');
  for(const result of run.data.actionResults.filter(x=>x.request.commandId===c.id))lines.push('Physical result:','```json',JSON.stringify(result,null,2),'```','');
  lines.push('Committed changes:','```json',JSON.stringify(entry.receipt.result.changes,null,2),'```','');
 }
 lines.push('## Final outcome','','```json',JSON.stringify({outcomes:trace.outcomes,visits:trace.visits,defects:trace.technicalDefects},null,2),'```','');
 await fs.writeFile(path.join(folder,stem+'-transcript.md'),lines.join('\n'));
 records.push({...metadata,outcomes:trace.outcomes,defects:trace.technicalDefects,closureResults:run.data.actionResults.filter(x=>x.request.actionType===pkg.content.initial.rule.closeActionId).length,handoverResults:run.data.actionResults.filter(x=>x.request.actionType===pkg.content.initial.rule.handoverActionId).length});
}
const get=name=>{const r=records.find(r=>r.name===name+'.json');assert.ok(r,name);return r;};
const before=get('browser-before-transparent');assert.equal(before.outcomes.serviceOpen,false);assert.equal(before.closureResults,1);assert.equal(before.defects.length,0);
for(const name of ['browser-after-transparent','browser-offscreen']){const r=get(name);assert.equal(r.outcomes.serviceOpen,true);assert.equal(r.closureResults,0);assert.equal(r.defects.length,1);assert.equal(r.defects[0].type,'MISSING_CLOSURE_PREVIEW');}
const visible=get('browser-visible-closure');assert.equal(visible.outcomes.serviceOpen,false);assert.equal(visible.closureResults,1);assert.equal(visible.defects.length,0);
for(const pair of [['browser-visible-closure','browser-visible-closure-after-load'],['browser-repaired','browser-repaired-after-load']])assert.deepEqual(await read(path.join(folder,pair[0]+'.json')),await read(path.join(folder,pair[1]+'.json')));
const recovery=get('browser-recovery'),post=get('browser-post-recovery');assert.equal(recovery.outcomes.recovered,true);assert.equal(recovery.handoverResults,1);assert.equal(recovery.outcomes.ownerId,pkg.content.initial.rule.ownerId);assert.equal(recovery.outcomes.balances[pkg.content.humanId],1200);assert.equal(recovery.outcomes.privateDisclosed,false);assert.equal(post.closureResults,0);assert.deepEqual(recovery.outcomes,post.outcomes);
const checks=await read(path.join(folder,'browser-checks.json'));assert.ok(checks.filter(x=>x.stage==='after').every(x=>x.passed));assert.equal(checks.filter(x=>x.stage==='before')[0].expectedDefectReproduced,true);
const summary={result:'PASS',sourceRevision:source.sourceRevision,sourceDigest:source.sourceDigest,buildSHA256,packageRef:pkg.ref,validatedBrowserExports:records.length,beforeDefectReproduced:true,afterTransparentFallbackPass:true,offscreenFallbackPass:true,visibleClosurePass:true,exactSaveLoadEquality:true,recoveryAndPostRecoveryPass:true,browserChecks:checks.length,runs:records};
await fs.writeFile(path.join(folder,'generated-evidence-summary.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({...summary,runs:undefined}));
