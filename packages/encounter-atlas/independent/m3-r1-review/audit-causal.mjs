import {registerHooks} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const home=path.dirname(fileURLToPath(import.meta.url)),root=path.join(home,'checkpoint'),ev=path.join(home,'evidence');
globalThis.__r1PolicyCalls=[];
registerHooks({load(url,context,next){const result=next(url,context);if(url.endsWith('/src/m3/policy.mjs')){let s=Buffer.isBuffer(result.source)?result.source.toString('utf8'):String(result.source);assert.ok(s.includes('export function chooseResponse('));s=s.replace('export function chooseResponse(','function originalChooseResponse(')+'\nexport function chooseResponse(...args){const result=originalChooseResponse(...args);globalThis.__r1PolicyCalls.push(JSON.parse(JSON.stringify({view:args[0],options:args[1]??{},result})));return result;}\n';return {...result,source:s};}return result;}});
const E=await import(pathToFileURL(path.join(root,'src/m3/engine.mjs'))),T=await import(pathToFileURL(path.join(root,'src/m3/types.mjs'))),pkg=await T.sealPackage(JSON.parse(await fs.readFile(path.join(root,'content/m3/seed.json'),'utf8')));
assert.equal(pkg.ref.digest,'2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f');
const records=[];
for(const name of ['r1-clean-recovery','r1-repaired','display-opacity-run','display-ancestor-run','display-horizontal-run','display-zero-width-run','display-normal-run','display-scroll-run']){
 const saved=JSON.parse(await fs.readFile(path.join(ev,name+'.json'),'utf8'));globalThis.__r1PolicyCalls=[];let s=await E.startEncounter(pkg,{runId:saved.run.id,noPressure:saved.run.data.opportunities.noPressure});
 for(const j of saved.run.journal){const x=E.dispatch(s,pkg,j.command);assert.equal(x.status,'committed');s=x.run;}
 assert.deepEqual(s,saved.run);const calls=globalThis.__r1PolicyCalls;assert.equal(calls.length,s.data.decisions.length);
 calls.forEach((c,i)=>{const d=s.data.decisions[i];assert.deepEqual(c.view,E.decisionInput(s,d.id));assert.deepEqual(c.result.candidates,d.candidates);assert.equal(c.result.selected,d.selected);assert.equal(c.options.noticeDisplayed===true,d.noticeDisplayed);});records.push({run:name,calls,exactInputsAndCandidatesMatch:true});
}
await fs.writeFile(path.join(ev,'actual-policy-capture.json'),JSON.stringify(records,null,2)+'\n');console.log(JSON.stringify({runs:records.length,actualPolicyCalls:records.reduce((n,x)=>n+x.calls.length,0),allCapturedInputsAndCandidatesMatch:true,sourceFilesEdited:false}));
