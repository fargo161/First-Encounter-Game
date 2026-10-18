import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {openAtlas,digest} from '../src/atlas-a1/adapter.mjs';
import {renderPerson} from '../src/atlas-a1/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),ev=path.join(root,'evidence/atlas-a1'),fixtures=path.join(root,'fixtures/atlas-a1'),proofs=path.join(root,'proofs/atlas-a1');
await fs.mkdir(fixtures,{recursive:true});await fs.mkdir(proofs,{recursive:true});
const read=async p=>JSON.parse(await fs.readFile(path.join(root,p),'utf8')),write=async(p,v)=>fs.writeFile(p,JSON.stringify(v,null,2)+'\n'),catalog=await read('content/ar0/last-collection.json'),warned=await read('evidence/ar0-r1/browser/ui-warned.json'),records=[];
const sameName=structuredClone(catalog);sameName.entities.filter(e=>e.kind==='person').forEach(e=>e.displayName='Shared name');await write(path.join(fixtures,'same-name-catalog.json'),sameName);
const unmodeled=structuredClone(catalog);unmodeled.entities.push({id:'neutral_person',kind:'person',source:{kind:'authored',id:'neutral_description'},aliases:[],displayName:'Unmodeled Person fixture',description:'Neutral presentation test only; no new Last Collection story fact.',scenarioRefs:[],disclosure:'public',tags:[]});await write(path.join(fixtures,'unmodeled-catalog.json'),unmodeled);
const conflict=await read('independent/ar0-review/evidence/alias-trust-catalog.json');await write(path.join(fixtures,'conflicting-catalog.json'),conflict);
const invalid=structuredClone(warned);invalid.run.data.world.serviceOpen=false;await write(path.join(fixtures,'invalid-save.json'),invalid);
const badPackage=structuredClone(catalog);badPackage.packageRef.digest='f'.repeat(64);await write(path.join(fixtures,'incompatible-catalog.json'),badPackage);
for(const name of ['initial','warned','repaired','pending','recovery','collapse']){
 const save=await read('evidence/ar0-r1/browser/ui-'+name+'.json'),before=JSON.stringify({save,catalog});
 for(const audience of ['author','player']){
  const reader=await openAtlas(save,catalog,{audience}),json=JSON.stringify(reader.model,null,2)+'\n';
  const again=await openAtlas(save,catalog,{audience});assert.deepEqual(reader.model,again.model);for(const p of reader.model.people){renderPerson(p);renderPerson(p);}const check=await reader.integrity();assert.equal(check.unchanged,true);
  await fs.writeFile(path.join(proofs,name+'-'+audience+'.json'),json);
  records.push({name,audience,revision:save.run.revision,inputDigest:await digest(save),catalogDigest:await digest(catalog),modelSHA256:createHash('sha256').update(json).digest('hex'),people:reader.model.people.map(p=>({id:p.id,name:p.name,mode:p.mode,status:p.status,sections:p.sections.map(s=>({name:s.title,records:s.rows.length}))})),readOnlyCheck:check});
 }
 assert.equal(JSON.stringify({save,catalog}),before);
}
await write(path.join(ev,'expected-inputs.json'),records);await write(path.join(ev,'proof-summary.json'),{result:'PASS',models:records.length,validatedActualSaves:6,repeatedReadAndRenderPure:true,repeatOpenDeterministic:true,records});console.log(JSON.stringify({result:'PASS',models:records.length,validatedActualSaves:6}));
