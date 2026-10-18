import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const home=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(process.env.M3_CHECKPOINT??path.join(home,'checkpoint')),ev=path.join(home,'evidence');
const E=await import(pathToFileURL(path.join(root,'src/m3/engine.mjs'))),M=await import(pathToFileURL(path.join(root,'src/m3/meaning.mjs')));
const read=async n=>JSON.parse(await fs.readFile(path.join(ev,n+'.json'),'utf8'));
const saved=await read('r1-fresh-warned'),pkg=saved.package,base=await E.importRun(saved,pkg),rule=pkg.content.initial.rule;
const source=await fs.readFile(path.join(root,'src/m3/ui.mjs'),'utf8'),guard=source.slice(source.indexOf('function acknowledgeVisibleNotice(){'),source.indexOf('\nfunction preview(){'));
assert.ok(guard.startsWith('function acknowledgeVisibleNotice(){'));
const invoke=new Function('pending','$','getComputedStyle','innerHeight','markNoticeDisplayed',guard+'\nacknowledgeVisibleNotice();return pending;');
const command=()=>E.prepareSend(base,pkg,M.draft('request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}),'command_f101');
function ack(c,g){
 let parent=null;for(const p of [...g.ancestors].reverse())parent={parentElement:parent,style:{opacity:p.opacity,display:'block',visibility:'visible'}};
 const el={hidden:g.hidden,parentElement:parent,style:g.style,getBoundingClientRect:()=>g.rect};
 return invoke(c,()=>el,n=>n.style,g.viewport.height,M.markNoticeDisplayed);
}
async function noDisplay(name){
 const geometry=await read('display-'+name+'-geometry'),submitted=command(),marked=ack(submitted,geometry),x=E.dispatch(base,pkg,marked);assert.equal(x.status,'committed');
 const actual={displayed:marked.payload.preview.notice.displayed,serviceOpen:x.run.data.world.serviceOpen,closeResults:x.run.data.actionResults.filter(r=>r.request.actionType===rule.closeActionId).length,defects:x.run.data.defects.map(d=>d.type)};
 await fs.writeFile(path.join(ev,'independent-'+name+'-reproducer.json'),JSON.stringify({geometry,submitted,marked,actual,save:E.exportRun(x.run,pkg)},null,2)+'\n');
 assert.deepEqual(actual,{displayed:false,serviceOpen:true,closeResults:0,defects:['MISSING_CLOSURE_PREVIEW']},'Invisible notice must not authorize service closure');
 assert.deepEqual(x.run.data.world,base.data.world);assert.equal(x.run.data.messages.at(-1).outward.act,'boundary_refusal');const retry=E.dispatch(x.run,pkg,marked);assert.equal(retry.status,'replayed');assert.deepEqual(retry.run,x.run);
}
test('IR1-01 production guard rejects fully transparent own opacity with correct fallback',()=>noDisplay('opacity'));
test('IR1-02 production guard rejects fully transparent ancestor with correct fallback',()=>noDisplay('ancestor'));
test('IR1-03 vertical offscreen, hidden, display-none and zero-height remain invalid',async()=>{for(const n of ['vertical','hidden','display-none','zero-height'])await noDisplay(n);});
test('IR1-04 M3-D02 horizontally offscreen notice must not close service',()=>noDisplay('horizontal'));
test('IR1-05 M3-D02 zero-width notice must not close service',()=>noDisplay('zero-width'));
test('IR1-06 actual visible current notice closes exactly once and retries reuse result',async()=>{
 const g=await read('display-normal-geometry'),before=structuredClone(base),c=command(),original=structuredClone(c),marked=ack(c,g),x=E.dispatch(base,pkg,marked);assert.equal(marked.payload.preview.notice.displayed,true);assert.equal(x.status,'committed');assert.equal(x.run.data.world.serviceOpen,false);assert.equal(x.run.data.actionResults.filter(x=>x.request.actionType===rule.closeActionId).length,1);assert.equal(x.run.data.defects.length,0);assert.equal(E.dispatch(x.run,pkg,marked).status,'replayed');assert.deepEqual(c,original);assert.deepEqual(base,before);
});
test('IR1-07 truthful display receipt survives subsequent real offscreen scroll',async()=>{
 const g=await read('scroll-receipt-geometries');assert.ok(g.before.rect.top>=0&&g.before.rect.bottom<=g.before.viewport.height);assert.ok(g.after.rect.top>g.after.viewport.height);
 const marked=ack(command(),g.before),afterScroll=ack(marked,g.after);assert.equal(afterScroll.payload.preview.notice.displayed,true);assert.deepEqual(afterScroll,marked);
 const actual=await read('display-scroll-run');assert.equal(actual.run.journal.at(-1).command.payload.preview.notice.displayed,true);assert.equal(actual.run.data.world.serviceOpen,false);assert.equal(actual.run.data.defects.length,0);
});
test('IR1-08 marked stale or edited draft cannot reuse its receipt for another command',async()=>{
 const c=ack(command(),await read('display-normal-geometry')),bad=structuredClone(c);bad.payload.draft.scopeId=rule.relevantScopeId;assert.equal(E.dispatch(base,pkg,bad).status,'rejected');
 const why=E.prepareSend(base,pkg,M.draft('why',{operation:'explain',targetId:rule.recordId,scopeId:rule.relevantScopeId,contextMessageId:base.data.visits[0].warningMessageId}),'command_f102'),x=E.dispatch(base,pkg,why);assert.equal(x.status,'committed');assert.equal(E.dispatch(x.run,pkg,c).code,'STALE_COMMAND');const refreshed=structuredClone(c);refreshed.id='command_f103';refreshed.expectedRevision=x.run.revision;assert.equal(E.dispatch(x.run,pkg,refreshed).status,'rejected');
});
test('IR1-09 fresh browser results replay and equal actual inspector exports',async()=>{
 for(const n of ['r1-clean-recovery','r1-repaired','display-opacity-run','display-ancestor-run','display-horizontal-run','display-zero-width-run','display-normal-run','display-scroll-run']){const save=await read(n),s=await E.importRun(save,pkg);assert.deepEqual(E.inspectRun(s,pkg),await read(n+'-trace'));}
 const rec=await read('r1-clean-recovery'),repaired=await read('r1-repaired'),before=await read('r1-before-substantive-repair');assert.equal(before.run.data.visits[0].repairUsed,false);assert.equal(repaired.run.data.visits[0].repairUsed,true);assert.equal(repaired.run.data.world.comparisonComplete,false);assert.equal(repaired.run.data.visits[0].warningMessageId,before.run.data.visits[0].warningMessageId);assert.deepEqual(repaired,await read('r1-after-invalid-save'));assert.deepEqual(repaired,await read('r1-repaired-reloaded'));assert.deepEqual(rec,await read('r1-after-read-surfaces'));assert.deepEqual(rec.run.data.world,(await read('r1-post-recovery')).run.data.world);assert.equal(rec.run.data.world.ownerId,rule.ownerId);assert.equal(rec.run.data.world.holderId,pkg.content.humanId);assert.equal(rec.run.data.world.balances[pkg.content.humanId],1200);assert.equal(rec.run.data.actionResults.filter(x=>x.request.actionType===rule.handoverActionId).length,1);
});
