import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { E, pkg, rule, draft, markNoticeDisplayed, restricted } from './m3-fixtures.mjs';

// Exercise the production DOM acknowledgment function itself, then dispatch the
// resulting command through the unchanged engine. No test substitutes a boolean.
const source=await fs.readFile(new URL('../src/m3/ui.mjs',import.meta.url),'utf8');
const guard=source.slice(source.indexOf('function acknowledgeVisibleNotice(){'),source.indexOf('\nfunction preview(){'));
assert.ok(guard.startsWith('function acknowledgeVisibleNotice(){'));
const invoke=new Function('pending','$','getComputedStyle','innerHeight','innerWidth','markNoticeDisplayed',guard+'\nacknowledgeVisibleNotice();return pending;');
const start=await restricted();
const command=()=>E.prepareSend(start,pkg,draft('request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}));
function acknowledge(c,{opacity='1',ancestorOpacity='1',hidden=false,display='block',visibility='visible',top=316.0500183105469,bottom=403.7000198364258,height=87.6500015258789,viewport=720}={}){
 const parent={parentElement:null,style:{opacity:ancestorOpacity,display:'block',visibility:'visible'}};
 const el={hidden,parentElement:parent,style:{opacity,display,visibility},getBoundingClientRect:()=>({top,bottom,height,left:100,right:400,width:300})};
 return invoke(c,()=>el,node=>node.style,viewport,1280,markNoticeDisplayed);
}
function expectMissing(c){
 assert.equal(c.payload.preview.notice.displayed,false);
 const result=E.dispatch(start,pkg,c);assert.equal(result.status,'committed');
 assert.equal(result.run.data.world.serviceOpen,true);assert.deepEqual(result.run.data.world,start.data.world);
 assert.equal(result.run.data.messages.at(-1).outward.act,'boundary_refusal');
 assert.equal(result.run.data.actionResults.filter(x=>x.request.actionType===rule.closeActionId).length,0);
 assert.equal(result.run.data.defects.length,1);assert.equal(result.run.data.defects[0].type,'MISSING_CLOSURE_PREVIEW');
 const retry=E.dispatch(result.run,pkg,c);assert.equal(retry.status,'replayed');assert.deepEqual(retry.run,result.run);
}
test('M3-D01-01 fully transparent production notice cannot authorize closure',()=>{
 expectMissing(acknowledge(command(),{opacity:'0'}));
});
test('M3-D01-02 fully transparent ancestor cannot authorize closure',()=>{
 expectMissing(acknowledge(command(),{ancestorOpacity:'0'}));
});
test('M3-D01-03 genuinely visible current notice authorizes exactly one closure',()=>{
 const c=acknowledge(command());assert.equal(c.payload.preview.notice.displayed,true);
 const result=E.dispatch(start,pkg,c);assert.equal(result.status,'committed');assert.equal(result.run.data.world.serviceOpen,false);
 assert.equal(result.run.data.actionResults.filter(x=>x.request.actionType===rule.closeActionId).length,1);assert.equal(result.run.data.defects.length,0);
 const retry=E.dispatch(result.run,pkg,c);assert.equal(retry.status,'replayed');assert.deepEqual(retry.run,result.run);
});
test('M3-D01-04 offscreen/hidden/empty display receipts remain invalid',()=>{
 for(const vector of [{top:721,bottom:809},{top:-90,bottom:-2},{height:0},{hidden:true},{display:'none'},{visibility:'hidden'}])expectMissing(acknowledge(command(),vector));
});
test('M3-D01-05 acknowledgment stays non-mutating and accepts nonzero opacity',()=>{
 const c=command(),before=structuredClone(c),runBefore=structuredClone(start);
 const marked=acknowledge(c,{opacity:'0.6',ancestorOpacity:'0.8'});assert.equal(marked.payload.preview.notice.displayed,true);
 assert.deepEqual(c,before);assert.deepEqual(start,runBefore);
 assert.equal(invoke(null,()=>{throw Error('No notice to inspect');},()=>{},720,1280,markNoticeDisplayed),null);
});
