import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {E,pkg,rule,draft,markNoticeDisplayed,restricted,recovered} from './m3-fixtures.mjs';
const source=await fs.readFile(new URL('../src/m3/ui.mjs',import.meta.url),'utf8');
const guard=source.slice(source.indexOf('function acknowledgeVisibleNotice(){'),source.indexOf('\nfunction preview(){'));
assert.ok(guard.startsWith('function acknowledgeVisibleNotice(){'));
const invoke=new Function('pending','$','getComputedStyle','innerHeight','innerWidth','markNoticeDisplayed',guard+'\nacknowledgeVisibleNotice();return pending;');
const base=await restricted(pkg,{withEvidence:false});
const command=()=>E.prepareSend(base,pkg,draft('request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}));
function ack(c,v={}){
 const rect={top:100,bottom:200,left:100,right:400,width:300,height:100,...v.rect};
 const parent={parentElement:null,style:{opacity:v.ancestorOpacity??'1'}};
 const el={hidden:v.hidden??false,parentElement:parent,style:{opacity:v.opacity??'1',display:v.display??'block',visibility:v.visibility??'visible'},getBoundingClientRect:()=>rect};
 return invoke(c,()=>el,n=>n.style,v.viewportHeight??720,v.viewportWidth??1280,markNoticeDisplayed);
}
function invalid(v){
 const c=command(),before=structuredClone(c),input=structuredClone(base),marked=ack(c,v);
 assert.equal(marked.payload.preview.notice.displayed,false);assert.deepEqual(c,before);assert.deepEqual(base,input);
 const x=E.dispatch(base,pkg,marked);assert.equal(x.status,'committed');assert.equal(x.run.data.world.serviceOpen,true);
 assert.deepEqual(x.run.data.world,base.data.world);assert.deepEqual(x.run.data.visits,base.data.visits);
 assert.equal(x.run.data.messages.at(-1).outward.act,'boundary_refusal');
 assert.equal(x.run.data.actionResults.filter(r=>r.request.actionType===rule.closeActionId).length,0);
 assert.equal(x.run.data.actionResults.length,base.data.actionResults.length);
 assert.deepEqual(x.run.data.defects.map(d=>d.type),['MISSING_CLOSURE_PREVIEW']);
 const retry=E.dispatch(x.run,pkg,marked);assert.equal(retry.status,'replayed');assert.deepEqual(retry.run,x.run);
}
test('M3-D02-01 visible positive rectangle fully contained on both axes closes exactly once',()=>{
 const c=command(),before=structuredClone(c),marked=ack(c);assert.equal(marked.payload.preview.notice.displayed,true);assert.deepEqual(c,before);
 const x=E.dispatch(base,pkg,marked);assert.equal(x.status,'committed');assert.equal(x.run.data.world.serviceOpen,false);
 assert.equal(x.run.data.actionResults.filter(r=>r.request.actionType===rule.closeActionId).length,1);assert.equal(x.run.data.defects.length,0);
 const retry=E.dispatch(x.run,pkg,marked);assert.equal(retry.status,'replayed');assert.deepEqual(retry.run,x.run);
});
const cases=[
 ['02 own opacity zero',{opacity:'0'}],['03 ancestor opacity zero',{ancestorOpacity:'0'}],
 ['04 vertically above viewport',{rect:{top:-100,bottom:-1,height:99}}],
 ['05 vertically below viewport',{rect:{top:721,bottom:821}}],
 ['06 horizontally outside left',{rect:{left:-10000,right:-9700}}],
 ['07 horizontally outside right',{rect:{left:1400,right:1700}}],
 ['08 partially outside left',{rect:{left:-1,right:299}}],
 ['09 partially outside right',{rect:{left:1000,right:1300}}],
 ['10 zero width',{rect:{width:0,left:100,right:100}}],
 ['11 zero height',{rect:{height:0,top:100,bottom:100}}],
 ['12 hidden attribute',{hidden:true}],['13 display none',{display:'none'}],['14 visibility hidden',{visibility:'hidden'}]
];
for(const [name,vector] of cases)test('M3-D02-'+name+' cannot earn a receipt or close service',()=>invalid(vector));
test('M3-D02-15 invalid and non-finite geometry or viewport cannot earn a receipt',()=>{
 for(const field of ['top','bottom','left','right','width','height'])for(const value of [NaN,Infinity,-Infinity])invalid({rect:{[field]:value}});
 for(const field of ['viewportWidth','viewportHeight'])for(const value of [NaN,Infinity,-Infinity,0,-1])invalid({[field]:value});
});
test('M3-D02-16 negative or inverted rectangle cannot earn a receipt',()=>{
 for(const rect of [{width:-1},{height:-1},{left:400,right:100},{top:200,bottom:100}])invalid({rect});
});
test('M3-D02-17 truthful receipt survives later scrolling of the same unedited notice',()=>{
 const marked=ack(command()),scrolled=ack(marked,{rect:{top:900,bottom:1000}});assert.deepEqual(scrolled,marked);
 assert.equal(scrolled.payload.preview.notice.displayed,true);const x=E.dispatch(base,pkg,scrolled);
 assert.equal(x.status,'committed');assert.equal(x.run.data.world.serviceOpen,false);assert.equal(x.run.data.defects.length,0);
});
test('M3-D02-18 edited or stale draft cannot reuse an earned receipt',()=>{
 const c=ack(command()),edited=structuredClone(c);edited.payload.draft.scopeId=rule.relevantScopeId;assert.equal(E.dispatch(base,pkg,edited).status,'rejected');
 const why=E.prepareSend(base,pkg,draft('why',{operation:'explain',targetId:rule.recordId,scopeId:rule.relevantScopeId,contextMessageId:base.data.visits[0].warningMessageId}),'command_f802');
 const newer=E.dispatch(base,pkg,why);assert.equal(newer.status,'committed');assert.equal(E.dispatch(newer.run,pkg,c).code,'STALE_COMMAND');
});
test('M3-D02-19 completed recovery remains protected from later warned demands',async()=>{
 const done=await recovered(),before=structuredClone(done.data.world);
 const c=E.prepareSend(done,pkg,draft('request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}));assert.equal(c.payload.preview.notice,null);
 const x=E.dispatch(done,pkg,c);assert.equal(x.status,'committed');assert.deepEqual(x.run.data.world,before);assert.equal(x.run.data.world.recovered,true);
});
