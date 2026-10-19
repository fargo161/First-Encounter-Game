// Fresh headed native-browser controls over the unchanged disposable builds.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.EA_C1_PLAYWRIGHT||'playwright');
const root=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);
assert(root.includes('EA-C1-candidate')&&!root.includes('GitHub'));
await fs.mkdir(out,{recursive:false});
const json=async(f,x)=>fs.writeFile(path.join(out,f),JSON.stringify(x,null,2)+'\n');
const read=async n=>JSON.parse(await fs.readFile(path.join(root,n),'utf8'));
const server=http.createServer(async(req,res)=>{try{
 const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!file.startsWith(root+path.sep))throw Error('outside root');
 res.setHeader('content-type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.json')?'application/json':'text/plain');res.end(await fs.readFile(file));
}catch{res.statusCode=404;res.end('unavailable')}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:false,channel:'chrome',args:['--window-size=1600,1400']});
const context=await browser.newContext({viewport:{width:1500,height:1300}});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
const records=[];
const frame=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
async function ready(){await page.waitForFunction(()=>document.getElementById('intent')?.options.length>0);await frame();}
async function openSaved(saved){
 await page.locator('#open').click();await page.locator('#file-json').fill(JSON.stringify(saved));await page.locator('#load-json').click();await page.locator('#file-dialog').waitFor({state:'hidden'});await ready();
}
async function exported(id){if(id==='#export-trace'&&!(await page.locator('#inspector').isVisible()))await page.locator('#inspector-toggle').click();await page.locator(id).click();const v=JSON.parse(await page.locator('#file-json').inputValue());await page.locator('#close-file').click();return v;}
async function save(name){const s=await exported('#save'),t=await exported('#export-trace');await json(name+'.json',s);await json(name+'-trace.json',t);return s;}
async function settle(){if(await page.locator('#skip').isVisible())await page.locator('#skip').click();await ready();}
async function send(family,intent){await page.locator('#family-'+family.toLowerCase()).click();await page.locator('#intent').selectOption(intent);await page.locator('#send').click();await settle();}
async function act(id){await page.locator('[data-action="'+id+'"]').click();await settle();}
async function partner(id){await page.locator('#partner-select').selectOption(id);await page.locator('#switch-partner').click();await ready();}
const rule=(await read('content/m3/seed.json')).initial.rule;
try{
 await page.goto(base+'/dist-m3/index.html');await ready();
 const initial=await save('fresh-initial');assert.equal(initial.run.data.observations.filter(x=>x.source.kind==='action_result').length,0);
 await act(rule.verifyActionId);await send('Request','paperwork');
 let permitted=await save('permission-only');assert.equal(permitted.run.data.actionResults.filter(x=>x.effects.some(e=>e.type==='grant_evidence')).length,0);
 for(const id of rule.inspectionActionIds)await act(id);
 await partner(rule.witnessId);await send('Request','case-location');await partner(rule.custodianId);
 await send('Request','owner-location');await send('Request','whole-file');
 const warned=await save('fresh-warning');const visit=warned.run.data.visits.find(x=>x.holderId===rule.custodianId);assert.equal(visit.repairUsed,false);
 // Draft/preview/Why/partner/end/reopen do not consume substantive repair.
 for(const intent of ['comparison','whole-file','paperwork']){await page.locator('#intent').selectOption(intent);await frame();}
 await send('Remark','why');await partner(rule.witnessId);await page.locator('#end').click();await partner(rule.custodianId);
 const continuity=await save('repair-continuity');assert.equal(continuity.run.data.visits.find(x=>x.holderId===rule.custodianId).repairUsed,false);
 await openSaved(continuity);assert.deepEqual((await exported('#save')).run,continuity.run);
 await send('Remark','show-evidence');const repaired=await save('fresh-repaired');assert.equal(repaired.run.data.visits.find(x=>x.holderId===rule.custodianId).repairUsed,true);
 await openSaved(repaired);assert.deepEqual((await exported('#save')).run,repaired.run);
 await act(rule.comparisonActionId);await page.locator('#confirm').click();await settle();
 const recovered=await save('fresh-recovery');assert.equal(recovered.run.data.world.recovered,true);assert.equal(recovered.run.data.world.ownerId,rule.ownerId);assert.equal(recovered.run.data.world.recordCorrected,false);
 assert.deepEqual(recovered.run.data.world.balances,initial.run.data.world.balances);
 assert.equal(recovered.run.data.actionResults.flatMap(r=>r.effects).filter(e=>e.type==='custody_transfer').length,1);
 await page.screenshot({path:path.join(out,'successful-recovery.png'),fullPage:true});
 await send('Request','whole-file');const post=await save('post-recovery');assert.equal(post.run.data.world.recovered,true);assert.equal(post.run.data.world.serviceOpen,true);
 records.push({case:'fresh-full-recovery-repair-continuity-save-load-post-protection',status:'PASS',record_correction_independent:true});
 const freshWarned=await read('independent/m3-r2-review/evidence/r2-fresh-warned.json');
 for(const [name,css,closes] of [['visible','',true],['transparent','#closure-notice{opacity:0!important}',false],['collapse','#closure-notice{visibility:collapse!important}',false],['hidden','#closure-notice{visibility:hidden!important}',false],['offscreen','#closure-notice{transform:translateX(300vw)!important}',false]]){
  await page.goto(base+'/dist-m3/index.html');await ready();await openSaved(freshWarned);
  if(css)await page.addStyleTag({content:css});
  await page.locator('#family-request').click();await page.locator('#intent').selectOption('whole-file');
  if(name==='offscreen')await page.locator('#send').scrollIntoViewIfNeeded();else await page.locator('#closure-notice').evaluate(el=>el.scrollIntoView({block:'center'}));
  await frame();
  const geometry=await page.locator('#closure-notice').evaluate(el=>({rect:el.getBoundingClientRect().toJSON(),opacity:getComputedStyle(el).opacity,visibility:getComputedStyle(el).visibility,display:getComputedStyle(el).display,width:innerWidth,height:innerHeight,hidden:el.hidden}));
  await json(name+'-geometry.json',geometry);await page.screenshot({path:path.join(out,name+'-preview.png'),fullPage:false});
  await page.locator('#send').click();await settle();const saved=await save(name+'-closure');
  assert.equal(saved.run.data.world.serviceOpen,!closes,name);
  const physical=saved.run.data.actionResults.flatMap(x=>x.effects).filter(x=>x.type==='close_service');
  // Effect spelling is asserted also against authored close action correlation.
  const closeResults=saved.run.data.actionResults.filter(x=>x.request.actionType===rule.closeActionId);
  assert.equal(closeResults.length,closes?1:0,name);
  const defects=saved.run.data.defects.filter(x=>x.type==='MISSING_CLOSURE_PREVIEW');assert.equal(defects.length,closes?0:1,name);
  const cmd=saved.run.journal.at(-1).command;assert.equal(cmd.payload.preview.notice.displayed,closes,name);
  records.push({case:name+'-native-notice',status:'PASS',serviceOpen:saved.run.data.world.serviceOpen,closeResults:closeResults.length,missingPreview:defects.length,displayed:cmd.payload.preview.notice.displayed});
 }
 // Accepted A1 UI: six saved runs, two audiences, native source expansion and
 // original integrity control. No new Atlas interface is built.
 await page.goto(base+'/dist-atlas-a1/index.html');await page.waitForFunction(()=>document.getElementById('status').textContent.includes('Saved run validated'));
 for(const example of ['initial','warned','repaired','pending','recovery','collapse']){
  for(const audience of ['author','player']){
   await page.locator('#audience').selectOption(audience);await page.waitForFunction(()=>!document.getElementById('open-example').disabled);
   await page.locator('#example').selectOption(example);await page.locator('#open-example').click();await page.waitForFunction(()=>!document.getElementById('open-example').disabled);
   assert.match(await page.locator('#status').textContent(),/Saved run validated/);
   const buttons=page.locator('[data-person]');
   for(let i=0;i<await buttons.count();i++){await buttons.nth(i).click();const ds=page.locator('#person-view details');if(await ds.count())await ds.first().evaluate(el=>el.open=true);}
   await page.locator('#read-check').click();await page.waitForFunction(()=>document.getElementById('purity-result').textContent.includes('Read-only check passed'));
   await json('a1-'+example+'-'+audience+'.json',{context:JSON.parse(await page.locator('#snapshot-details').textContent()),integrity:JSON.parse(await page.locator('#purity-details').textContent()),text:await page.locator('#person-view').innerText()});
   records.push({case:'A1-'+example+'-'+audience,status:'PASS',nativeIntegrityControl:true});
  }
 }
 await page.screenshot({path:path.join(out,'a1-source-inspection.png'),fullPage:true});
 assert.equal(errors.length,0,errors.join('\n'));
 await json('summary.json',{status:'PASS',headed:true,browser:browser.version(),playwright:require((process.env.EA_C1_PLAYWRIGHT||'playwright')+'/package.json').version,base,viewport:page.viewportSize(),records,pageErrors:errors,
 buildHashes:Object.fromEntries(await Promise.all(['dist-m3/index.html','dist-atlas-a1/index.html'].map(async n=>[n,crypto.createHash('sha256').update(await fs.readFile(path.join(root,n))).digest('hex')])))});
 console.log(JSON.stringify({status:'PASS',cases:records.length,browser:browser.version()}));
}catch(e){await json('failure.json',{error:String(e),stack:e.stack,records,pageErrors:errors});await page.screenshot({path:path.join(out,'failure.png'),fullPage:true});throw e;}
finally{await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));}
