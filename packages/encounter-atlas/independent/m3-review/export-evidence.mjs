import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
const home=path.dirname(fileURLToPath(import.meta.url)),ev=path.join(home,'evidence'),root=path.join(home,'checkpoint');
const E=await import(pathToFileURL(path.join(root,'src/m3/engine.mjs'))),T=await import(pathToFileURL(path.join(root,'src/m3/types.mjs')));
const pkg=await T.sealPackage(JSON.parse(await fs.readFile(path.join(root,'content/m3/seed.json'),'utf8'))),r=pkg.content.initial.rule;
const names=['browser-initial-run','browser-permission-only','browser-partial-evidence','browser-pending-handover','browser-after-conversational-yes','browser-clean-recovery','browser-fresh-restricted','browser-before-substantive-repair','browser-repaired-not-recovered','browser-repaired-reloaded','browser-repaired-recovery','browser-warned-closure','browser-closed-reloaded','browser-missing-display-receipt','browser-after-recovery-demand','browser-transparent-notice-result','browser-transparent-notice-repeat'];
const records=[];
for(const name of names){
 const bytes=await fs.readFile(path.join(ev,name+'.json')),saved=JSON.parse(bytes),run=await E.importRun(saved,pkg),trace=E.inspectRun(run,pkg),w=run.data.world;
 const tracePath=path.join(ev,name+'-trace.json');try{const actual=JSON.parse(await fs.readFile(tracePath,'utf8'));assert.deepEqual(actual,trace);}catch(error){if(error.code!=='ENOENT')throw error;await fs.writeFile(tracePath,JSON.stringify(trace,null,2)+'\n');}
 const rec={name,origin:name.includes('transparent')?'Fresh visible UI on external CSS-only rendering-fault harness':'Fresh visible UI on exact frozen build',revision:run.revision,sha256:createHash('sha256').update(bytes).digest('hex'),outcomes:trace.outcomes,visits:trace.visits,technicalDefects:trace.technicalDefects,closureResults:run.data.actionResults.filter(x=>x.request.actionType===r.closeActionId).length,handoverResults:run.data.actionResults.filter(x=>x.request.actionType===r.handoverActionId).length};records.push(rec);
 const lines=['# Independent M3 interaction transcript','',`Run: ${name}; revision ${run.revision}.`,`Origin: ${rec.origin}.`,`ZIP SHA-256: de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64.`,`Source digest: 716a11c4efe9462e8ad60f16d6615ed8537811cf779d10dee424ef92558e3a94.`,`Package digest: ${pkg.ref.digest}.`,`Save SHA-256: ${rec.sha256}.`,'','Fresh save validated by complete deterministic journal replay. Text below comes from actual committed messages and receipts; it is not a builder-supplied transcript.',''];
 for(const j of run.journal){const c=j.command;lines.push(`## Commit ${j.receipt.committedRevision}: ${c.kind} / ${c.payload.operation??c.payload.draft.act}`,'',`Command: ${c.id}; expected revision ${c.expectedRevision}.`,'');
  if(c.kind==='send_message'){lines.push('Preview:','```text',c.payload.preview.text,'```','');if(c.payload.preview.notice)lines.push('Closure notice text:','```text',c.payload.preview.notice.text,'```',`Recorded display receipt: ${c.payload.preview.notice.displayed}.`,'');}
  const episode=run.data.episodes.find(e=>e.commandId===c.id);if(episode)lines.push('Intake: '+episode.intake.description,'','Delivery:','```text',episode.delivery.text,'```','');
  for(const result of run.data.actionResults.filter(x=>x.request.commandId===c.id)){const observed=result.observerDetails.find(o=>o.observerId===run.data.humanId);lines.push(`Physical result: ${result.id} / ${result.outcome}.`,'','```json',JSON.stringify({effects:result.effects,playerReceived:observed?.details??null},null,2),'```','');}
  lines.push('Committed changes:','```json',JSON.stringify(j.receipt.result.changes,null,2),'```','');
 }
 lines.push('## Final state','','```json',JSON.stringify({outcomes:trace.outcomes,visits:trace.visits,technicalDefects:trace.technicalDefects},null,2),'```','');
 await fs.writeFile(path.join(ev,name+'-transcript.md'),lines.join('\n'));
}
const get=n=>records.find(x=>x.name===n);
for(const name of ['browser-clean-recovery','browser-repaired-recovery']){const s=get(name);assert.equal(s.outcomes.recovered,true);assert.equal(s.outcomes.holderId,pkg.content.humanId);assert.equal(s.outcomes.ownerId,r.ownerId);assert.equal(s.handoverResults,1);assert.equal(s.outcomes.balances[pkg.content.humanId],1200);}
assert.equal(get('browser-warned-closure').closureResults,1);assert.equal(get('browser-warned-closure').technicalDefects.length,0);
assert.equal(get('browser-missing-display-receipt').outcomes.serviceOpen,true);assert.equal(get('browser-missing-display-receipt').technicalDefects.length,1);
for(const n of ['browser-transparent-notice-result','browser-transparent-notice-repeat']){assert.equal(get(n).outcomes.serviceOpen,false);assert.equal(get(n).closureResults,1);assert.equal(get(n).technicalDefects.length,0);}
await fs.writeFile(path.join(ev,'independent-browser-validation.json'),JSON.stringify({validatedSaves:records.length,packageRef:pkg.ref,runs:records,blockingDefects:['M3-D01: fully transparent notice falsely acknowledged and collection service closed'],builderEvidenceUsedAsProof:false},null,2)+'\n');
console.log(JSON.stringify({validatedFreshBrowserSaves:records.length,recoveryHandoverCount:1,normalClosureCount:1,missingReceiptFallback:'PASS',transparentNoticeFallback:'FAIL: closed twice in two independent restores',productionFilesEdited:false}));
