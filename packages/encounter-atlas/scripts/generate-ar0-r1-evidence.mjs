import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import * as A from '../src/ar0/atlas.mjs';
import * as E from '../src/m3/engine.mjs';
import {canonicalJson} from '../src/m3/types.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),ev=path.join(root,'evidence/ar0-r1'),catalog=JSON.parse(await fs.readFile(path.join(root,'content/ar0/last-collection.json'),'utf8')),sha=b=>createHash('sha256').update(b).digest('hex'),records=[];
for(const [category,folder] of [['preserved-ar0','evidence/ar0/browser'],['fresh-browser','evidence/ar0-r1/browser']]){
 const dir=path.join(root,folder),dest=path.join(root,'proofs/ar0-r1',category);await fs.mkdir(dest,{recursive:true});
 for(const name of (await fs.readdir(dir)).filter(n=>/^ui-.*\.json$/.test(n)&&!n.includes('trace')).sort()){
  const bytes=await fs.readFile(path.join(dir,name)),saved=JSON.parse(bytes);if(saved.schema!=='encounter-save@3')continue;
  const run=await E.importRun(saved,saved.package),stem=name.slice(0,-5),trace=E.inspectRun(run,saved.package),before=canonicalJson({run,catalog,pkg:saved.package});let rawCompared=false;
  if(category==='fresh-browser'){
   try{assert.deepEqual(JSON.parse(await fs.readFile(path.join(dir,stem+'-raw-trace.json'),'utf8')),trace);rawCompared=true;}catch(e){if(e.code!=='ENOENT')throw e;}
   await fs.writeFile(path.join(dir,stem+'-trace.json'),JSON.stringify({origin:rawCompared?'compared with actual browser inspector':'reconstructed from validated UI save',trace},null,2)+'\n');
   const lines=['# AR0 R1 fresh browser transcript',`Save ${name}, SHA-256 ${sha(bytes)}.`,''];
   for(const j of run.journal){lines.push(`## Revision ${j.receipt.committedRevision}: ${j.command.kind}`,JSON.stringify(j.command.payload,null,2),'');const episode=run.data.episodes.find(e=>e.commandId===j.command.id);if(episode)lines.push('Intake: '+episode.intake.description,'Delivery: '+episode.delivery.text,'');lines.push('Physical/committed result: '+JSON.stringify(j.receipt.result),'');}await fs.writeFile(path.join(dir,stem+'-transcript.md'),lines.join('\n'));
  }
  for(const j of run.journal){const retry=E.dispatch(run,saved.package,j.command);assert.equal(retry.status,'replayed');assert.deepEqual(retry.run,run);}
  for(const audience of ['author','player']){
   const p=await A.projectAtlas(run,saved.package,catalog,{audience});assert.deepEqual(await A.projectAtlas(await E.importRun(saved,saved.package),saved.package,catalog,{audience}),p);
   if(audience==='player'){assert.equal(p.worldTruth,undefined);for(const f of saved.package.content.facts.filter(f=>saved.package.content.protectedFactIds.includes(f.id)))assert.ok(!JSON.stringify(p).includes(String(f.value)));}
   const artifacts={'.json':JSON.stringify(p,null,2)+'\n','.md':A.renderAtlasMarkdown(p),'-network.json':JSON.stringify(A.networkFromAtlas(p),null,2)+'\n'};
   for(const [suffix,text] of Object.entries(artifacts)){if(category==='preserved-ar0')assert.equal(await fs.readFile(path.join(root,'proofs/ar0',stem+'-'+audience+suffix),'utf8'),text,'Unaffected supplied projection changed');await fs.writeFile(path.join(dest,stem+'-'+audience+suffix),text);}
   records.push({category,save:name,saveSHA256:sha(bytes),audience,rawCompared,cards:p.cards.length,events:p.cards.filter(c=>c.kind==='event').length,recentChanges:p.recentChanges.length,projectionSHA256:sha(artifacts['.json']),normalOutputByteIdenticalToOriginal:category==='preserved-ar0'});
  }
  assert.equal(canonicalJson({run,catalog,pkg:saved.package}),before);
 }
}
const fresh=path.join(root,'evidence/ar0-r1/browser'),read=async n=>JSON.parse(await fs.readFile(path.join(fresh,n+'.json'),'utf8')),recovery=await read('ui-recovery'),post=await read('ui-post-recovery'),normal=await read('ui-normal'),collapse=await read('ui-collapse'),repaired=await read('ui-repaired'),loaded=await read('ui-repaired-loaded'),r=recovery.package.content.initial.rule;
assert.deepEqual(repaired,loaded);assert.deepEqual(recovery.run.data.world,post.run.data.world);assert.equal(recovery.run.data.world.recovered,true);assert.equal(recovery.run.data.world.ownerId,r.ownerId);assert.equal(recovery.run.data.world.holderId,recovery.package.content.humanId);assert.equal(recovery.run.data.world.balances[recovery.package.content.humanId],1200);assert.equal(recovery.run.data.actionResults.filter(a=>a.request.actionType===r.handoverActionId).length,1);
assert.equal(normal.run.data.world.serviceOpen,false);assert.equal(normal.run.data.actionResults.filter(a=>a.request.actionType===r.closeActionId).length,1);assert.equal(collapse.run.data.world.serviceOpen,true);assert.equal(collapse.run.data.actionResults.filter(a=>a.request.actionType===r.closeActionId).length,0);assert.deepEqual(collapse.run.data.defects.map(d=>d.type),['MISSING_CLOSURE_PREVIEW']);
const checks=await read('checks');assert.ok(checks.length>0&&checks.every(c=>c.passed));const summary={result:'PASS',normalSuppliedProjectionsByteIdentical:records.filter(r=>r.category==='preserved-ar0').length,freshBrowserProjections:records.filter(r=>r.category==='fresh-browser').length,checks,allSavesReplayedEveryCommandRetried:true,allProjectionsPureDeterministicSaveLoadStable:true,records};await fs.writeFile(path.join(ev,'proof-verification.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({...summary,records:undefined,checks:checks.length}));
