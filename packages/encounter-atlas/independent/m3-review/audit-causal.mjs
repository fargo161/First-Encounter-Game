// External runtime instrumentation: intercept the policy import in memory only.
// No checkpoint file or algorithm is changed; wrapper records actual arguments/result.
import {registerHooks} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const home=path.dirname(fileURLToPath(import.meta.url)),root=path.join(home,'checkpoint'),evidence=path.join(home,'evidence');
globalThis.__independentPolicyCalls=[];
registerHooks({load(url,context,next){const loaded=next(url,context);if(url.endsWith('/src/m3/policy.mjs')){
 let source=Buffer.isBuffer(loaded.source)?loaded.source.toString('utf8'):String(loaded.source);
 assert.ok(source.includes('export function chooseResponse('));
 source=source.replace('export function chooseResponse(','function originalChooseResponse(')+`\nexport function chooseResponse(...args){const result=originalChooseResponse(...args);globalThis.__independentPolicyCalls.push(JSON.parse(JSON.stringify({view:args[0],options:args[1]??{},result})));return result;}\n`;
 return {...loaded,source};}return loaded;}});
const E=await import(pathToFileURL(path.join(root,'src/m3/engine.mjs'))),T=await import(pathToFileURL(path.join(root,'src/m3/types.mjs')));
const pkg=await T.sealPackage(JSON.parse(await fs.readFile(path.join(root,'content/m3/seed.json'),'utf8')));
const names=['browser-clean-recovery','browser-repaired-recovery','browser-warned-closure','browser-missing-display-receipt','browser-transparent-notice-result'];const records=[];
for(const name of names){const saved=JSON.parse(await fs.readFile(path.join(evidence,name+'.json'),'utf8'));globalThis.__independentPolicyCalls=[];
 let s=await E.startEncounter(pkg,{runId:saved.run.id,noPressure:saved.run.data.opportunities.noPressure});
 for(const j of saved.run.journal){const x=E.dispatch(s,pkg,j.command);assert.equal(x.status,'committed');s=x.run;}
 assert.deepEqual(s,saved.run);const calls=globalThis.__independentPolicyCalls;assert.equal(calls.length,s.data.decisions.length);
 for(let i=0;i<calls.length;i++){const d=s.data.decisions[i],actual=calls[i];assert.deepEqual(E.decisionInput(s,d.id),actual.view);assert.deepEqual(d.candidates,actual.result.candidates);assert.equal(d.selected,actual.result.selected);assert.equal(d.noticeDisplayed,actual.options.noticeDisplayed===true);}
 records.push({run:name,calls: calls.map((call,i)=>({decisionId:s.data.decisions[i].id,...call})),allArgumentsAndCandidatesEqual:true});
}
await fs.writeFile(path.join(evidence,'independent-actual-policy-capture.json'),JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify({runs:records.length,decisions:records.reduce((n,r)=>n+r.calls.length,0),exactCapturedViewsAndCandidates:true,checkpointSourceEdited:false}));
