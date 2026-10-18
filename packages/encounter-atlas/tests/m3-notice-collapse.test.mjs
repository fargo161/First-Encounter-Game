import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {E,pkg,rule,draft,markNoticeDisplayed,restricted} from './m3-fixtures.mjs';

// Invoke the actual production acknowledgment body, then dispatch its command.
// Collapse retains a valid rectangle: geometry alone must not earn a receipt.
const source=await fs.readFile(new URL('../src/m3/ui.mjs',import.meta.url),'utf8');
const guard=source.slice(source.indexOf('function acknowledgeVisibleNotice(){'),source.indexOf('\nfunction preview(){'));
assert.ok(guard.startsWith('function acknowledgeVisibleNotice(){'));
const invoke=new Function('pending','$','getComputedStyle','innerHeight','innerWidth','markNoticeDisplayed',guard+'\nacknowledgeVisibleNotice();return pending;');
test('M3-D03 collapsed current notice cannot authorize closure; refusal and defect remain idempotent',async()=>{
 const base=await restricted(pkg,{withEvidence:false}),before=structuredClone(base);
 const command=E.prepareSend(base,pkg,draft('request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}));
 const original=structuredClone(command),parent={parentElement:null,style:{opacity:'1'}};
 const el={hidden:false,parentElement:parent,style:{opacity:'1',display:'block',visibility:'collapse'},getBoundingClientRect:()=>({left:100,right:400,top:100,bottom:200,width:300,height:100})};
 const marked=invoke(command,()=>el,n=>n.style,720,1280,markNoticeDisplayed);
 assert.equal(marked.payload.preview.notice.displayed,false);assert.deepEqual(command,original);assert.deepEqual(base,before);
 const result=E.dispatch(base,pkg,marked);assert.equal(result.status,'committed');
 assert.equal(result.run.data.world.serviceOpen,true);assert.deepEqual(result.run.data.world,base.data.world);assert.deepEqual(result.run.data.visits,base.data.visits);
 assert.equal(result.run.data.messages.length,base.data.messages.length+2);assert.equal(result.run.data.messages.at(-1).outward.act,'boundary_refusal');
 assert.equal(result.run.data.actionResults.length,base.data.actionResults.length);
 assert.equal(result.run.data.actionResults.filter(r=>r.request.actionType===rule.closeActionId).length,0);
 assert.deepEqual(result.run.data.defects.map(d=>d.type),['MISSING_CLOSURE_PREVIEW']);
 for(let n=0;n<3;n++){const retry=E.dispatch(result.run,pkg,marked);assert.equal(retry.status,'replayed');assert.deepEqual(retry.run,result.run);}
});
