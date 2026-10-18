import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { canonicalJson,copy,sealPackage } from '../src/m3/types.mjs';
import { startEncounter,dispatch,importRun,exportRun,inspectRun,playerView } from '../src/m3/engine.mjs';
import { draft } from '../src/m3/meaning.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=async file=>JSON.parse(await fs.readFile(path.join(root,file),'utf8'));
const write=async(file,value)=>fs.writeFile(path.join(root,file),JSON.stringify(value,null,2)+'\n');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const sealed=await sealPackage(await read('content/m3/seed.json')),source=await read('evidence/m3/source-identity.json');
await fs.mkdir(path.join(root,'transcripts'),{recursive:true});await fs.mkdir(path.join(root,'traces'),{recursive:true});
const records=[];
for(const name of (await fs.readdir(path.join(root,'runs'))).filter(n=>n.endsWith('.json')).sort()){
 const file='runs/'+name,bytes=await fs.readFile(path.join(root,file)),save=JSON.parse(bytes),run=await importRun(save,sealed),trace=inspectRun(run,sealed);
 assert.ok(run.data.beliefs.every(b=>b.holderId!==run.data.humanId));assert.ok(run.data.hypotheses.every(h=>h.holderId!==run.data.humanId));
 const before=canonicalJson(run);if(run.journal.length)assert.equal(dispatch(run,sealed,run.journal[0].command).status,'replayed');assert.equal(canonicalJson(run),before);
 const stem=name.replace('.json','');const meta={origin:'Actual browser UI Save run export',runFile:file,runSHA256:sha(bytes),sessionId:run.id,revision:run.revision,sourceRevision:source.sourceRevision,sourceDigest:source.sourceDigest,contentRevision:sealed.content.contentRevision,packageRef:sealed.ref};
 await write('traces/'+stem+'.json',{metadata:meta,trace});
 const lines=['# Generated M3 interaction transcript','',`Source run: \`${file}\`, SHA-256 \`${meta.runSHA256}\`.`,`Code: \`${source.sourceRevision}\`, source digest \`${source.sourceDigest}\`.`,`Content: \`${sealed.content.contentRevision}\`, package digest \`${sealed.ref.digest}\`.`,
 'Generated from the actual browser Save run export after complete package, domain and command-journal validation. The text below is emitted by the implementation.',''];
 const block=t=>'```text\n'+t+'\n```';
 let replay=await startEncounter(sealed,{runId:run.id,noPressure:run.data.opportunities.noPressure});
 for(const entry of run.journal){const c=entry.command;lines.push(`## Commit ${entry.receipt.committedRevision} · ${c.kind}${c.payload.operation?' / '+c.payload.operation:''}`,'',`Command \`${c.id}\`, expected revision ${c.expectedRevision}.`,'');
  if(c.kind==='send_message'){lines.push('Bound preview:',block(c.payload.preview.text),'');if(c.payload.preview.notice)lines.push('Closure preview notice:',block(c.payload.preview.notice.text),`Displayed before Send: **${c.payload.preview.notice.displayed}**. Public warning: \`${c.payload.preview.notice.warningMessageId}\`.`,'');}
  const priorResults=new Set(replay.data.actionResults.map(r=>r.id));const applied=dispatch(replay,sealed,c);assert.equal(applied.status,'committed');assert.equal(canonicalJson(applied.receipt),canonicalJson(entry.receipt));replay=applied.run;
  for(const result of replay.data.actionResults.filter(r=>!priorResults.has(r.id))){lines.push(`Physical result \`${result.id}\`: ${result.outcome}; request action \`${result.request.actionType}\`.`,'');for(const observer of result.observerDetails)lines.push(`Received by \`${observer.observerId}\`:`,block(JSON.stringify(observer.details,null,2)),'');lines.push('Actual effects:',block(JSON.stringify(result.effects,null,2)),'');}
  const episode=replay.data.episodes.find(e=>e.commandId===c.id);if(episode)lines.push('Intake:',block(episode.intake.description),'','Delivery:',block(episode.delivery.description+'\n'+episode.delivery.text),'',`Decision \`${episode.decisionId}\`; exact actor-local input and eligibility reasons are in the matching trace.`,'');
  lines.push('Committed changes:',block(JSON.stringify(entry.receipt.result.changes,null,2)),'');
 }
 assert.equal(canonicalJson(replay),canonicalJson(run));lines.push('## Final independent outcomes','',block(JSON.stringify(trace.outcomes,null,2)),`Repair/visit state: \`${JSON.stringify(trace.visits)}\`.`,`Technical defects: ${trace.technicalDefects.length}. Canonical observations: ${trace.observations.length}.`,
 'Private contact values are absent from player knowledge and actual decision inputs. Author/package exports retain synthetic fixture truth. Recovery, spending, privacy and record correction remain distinct.','');
 await fs.writeFile(path.join(root,'transcripts/'+stem+'.md'),lines.join('\n'));
 records.push({...meta,outcomes:trace.outcomes,commands:run.journal.length,messages:run.data.messages.length,observations:run.data.observations.length,validatedReplay:true});
}
for(const [runFile,traceFile] of [['runs/browser-recovery.json','evidence/m3/browser-recovery-trace.json'],['runs/browser-closure.json','evidence/m3/browser-closure-trace.json']]){
 const run=await importRun(await read(runFile),sealed),actual=await read(traceFile);assert.deepEqual(inspectRun(run,sealed),actual,'Raw browser inspector must match the same saved run');
}
for(const [a,b] of [['runs/browser-recovery.json','evidence/m3/browser-after-inspector-replay.json'],['runs/browser-repaired.json','evidence/m3/browser-repaired-after-load.json'],['runs/browser-restricted.json','evidence/m3/browser-restriction-after-preview-edits.json'],['runs/browser-closure.json','evidence/m3/browser-closed-after-load.json'],['runs/browser-closure.json','evidence/m3/browser-after-invalid-import.json'],['runs/browser-closure.json','evidence/m3/browser-downloaded-run.json']])assert.deepEqual(await read(a),await read(b),a+' equality check');
// The approved no-notice path is tested without adding a debug bypass to gameplay.
const restrictedSave=await read('runs/browser-restricted.json'),limited=await importRun(restrictedSave,sealed),r=sealed.content.initial.rule;
const missing=dispatch(limited,sealed,prepareMissingNotice(limited));assert.equal(missing.status,'committed');assert.equal(missing.run.data.world.serviceOpen,true);assert.equal(missing.run.data.defects.length,1);
function prepareMissingNotice(run){const id=`command_eeee${run.revision.toString(16).padStart(4,'0')}`;return prepareSendAlias(run,sealed,draft('request_access',{targetId:r.recordId,scopeId:r.wholeScopeId}),id);}
// Named import is below to keep the deliberate suppressed-notice harness explicit.
const missingTrace=inspectRun(missing.run,sealed);await write('evidence/m3/missing-notice-run.json',exportRun(missing.run,sealed));await write('evidence/m3/missing-notice-trace.json',missingTrace);
// Portability uses the exact same core with all authored identities renamed.
let text=JSON.stringify(sealed.content);const ids=[...new Set(text.match(/(?:actor|subject|action|fact|service|package)_[0-9a-f]{4}/g))];for(const id of ids)text=text.replaceAll(id,id.replace(/_([0-9a-f]+)/,(_,v)=>'_'+(parseInt(v,16)+512).toString(16).padStart(4,'0')));
const neutral=JSON.parse(text);neutral.title='Neutral archive portability fixture';neutral.contentRevision='M3-neutral-portability-v1';neutral.actors.forEach((a,i)=>a.label='Participant '+i);neutral.subjects.forEach((s,i)=>s.label='Reference '+i);neutral.facts.forEach((f,i)=>f.label='Observed fragment '+i);neutral.initial.witnessAccount.interpretation='A limited report about an unidentified object, without destination or purpose.';
const neutralPackage=await sealPackage(neutral);
const fixtures=await import('../tests/m3-fixtures.mjs');const portableRecovered=await fixtures.recovered(neutralPackage),portableRestricted=await fixtures.restricted(neutralPackage),nr=neutralPackage.content.initial.rule;
const portableClosed=fixtures.send(portableRestricted,draft('request_access',{targetId:nr.recordId,scopeId:nr.wholeScopeId}),neutralPackage);
assert.equal(portableRecovered.data.world.recovered,true);assert.equal(portableClosed.data.world.serviceOpen,false);
await write('evidence/m3/neutral-package.json',neutralPackage);await write('evidence/m3/neutral-recovery-run.json',exportRun(portableRecovered,neutralPackage));await write('evidence/m3/neutral-closure-run.json',exportRun(portableClosed,neutralPackage));await write('evidence/m3/neutral-recovery-trace.json',inspectRun(portableRecovered,neutralPackage));await write('evidence/m3/neutral-closure-trace.json',inspectRun(portableClosed,neutralPackage));
const checks=await read('evidence/m3/browser-checks.json');assert.ok(checks.every(c=>c.passed));
await write('evidence/m3/generated-evidence-summary.json',{source,packageRef:sealed.ref,runs:records,rawBrowserInspectorsMatch:true,saveLoadAndReadEquality:true,missingNotice:{status:missing.status,serviceOpen:missing.run.data.world.serviceOpen,defects:missing.run.data.defects.length},portability:{recovered:portableRecovered.data.world.recovered,closed:!portableClosed.data.world.serviceOpen,packageRef:neutralPackage.ref},browserRecords:checks.length,browserGroups:new Set(checks.map(c=>c.groupId??c.name)).size});
console.log(JSON.stringify({sourceRevision:source.sourceRevision,sourceDigest:source.sourceDigest,packageRef:sealed.ref,validatedBrowserRuns:records.length,rawBrowserInspectorsMatch:true,missingNoticeServiceOpen:true,neutralRecoveryAndClosure:true}));
import { prepareSend as prepareSendAlias } from '../src/m3/engine.mjs';
