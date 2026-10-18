import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const home=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(process.env.M3_CHECKPOINT??path.join(home,'checkpoint')),ev=path.join(home,'evidence');
const E=await import(pathToFileURL(path.join(root,'src/m3/engine.mjs'))),M=await import(pathToFileURL(path.join(root,'src/m3/meaning.mjs')));
const saved=JSON.parse(await fs.readFile(path.join(ev,'r2-fresh-warned.json'),'utf8')),pkg=saved.package,base=await E.importRun(saved,pkg),rule=pkg.content.initial.rule;
const source=await fs.readFile(path.join(root,'src/m3/ui.mjs'),'utf8'),guard=source.slice(source.indexOf('function acknowledgeVisibleNotice(){'),source.indexOf('\nfunction preview(){'));
assert.ok(guard.startsWith('function acknowledgeVisibleNotice(){'));
const invoke=new Function('pending','$','getComputedStyle','innerHeight','innerWidth','markNoticeDisplayed',guard+'\nacknowledgeVisibleNotice();return pending;');
const command=()=>E.prepareSend(base,pkg,M.draft('request_access',{targetId:rule.recordId,scopeId:rule.wholeScopeId}),'command_f201');
function ack(c,v={}){
 const parent={parentElement:null,style:{opacity:v.ancestorOpacity??'1'}},el={hidden:v.hidden??false,parentElement:parent,style:{opacity:v.opacity??'1',display:v.display??'block',visibility:v.visibility??'visible'},getBoundingClientRect:()=>({left:100,right:400,top:100,bottom:200,width:300,height:100,...v.rect})};
 return invoke(c,()=>el,n=>n.style,v.viewportHeight??764,v.viewportWidth??920,M.markNoticeDisplayed);
}
async function invalid(label,v){
 const c=command(),original=structuredClone(c),before=structuredClone(base),marked=ack(c,v),x=E.dispatch(base,pkg,marked);assert.equal(x.status,'committed');
 const actual={displayed:marked.payload.preview.notice.displayed,serviceOpen:x.run.data.world.serviceOpen,closeResults:x.run.data.actionResults.filter(r=>r.request.actionType===rule.closeActionId).length,defects:x.run.data.defects.map(d=>d.type)};
 if(label==='collapse')await fs.writeFile(path.join(ev,'independent-collapse-reproducer.json'),JSON.stringify({guard,vector:v,submitted:c,marked,actual,save:E.exportRun(x.run,pkg)},null,2)+'\n');
 assert.deepEqual(actual,{displayed:false,serviceOpen:true,closeResults:0,defects:['MISSING_CLOSURE_PREVIEW']},label+' must not authorize closure');
 assert.deepEqual(c,original);assert.deepEqual(base,before);assert.deepEqual(x.run.data.world,base.data.world);assert.deepEqual(x.run.data.visits,base.data.visits);assert.equal(x.run.data.actionResults.length,base.data.actionResults.length);assert.equal(x.run.data.messages.at(-1).outward.act,'boundary_refusal');
 const retry=E.dispatch(x.run,pkg,marked);assert.equal(retry.status,'replayed');assert.deepEqual(retry.run,x.run);
}
test('IR2-01 genuinely visible current notice closes once with immutable exact retry',()=>{const c=command(),marked=ack(c),x=E.dispatch(base,pkg,marked);assert.equal(c.payload.preview.notice.displayed,false);assert.equal(marked.payload.preview.notice.displayed,true);assert.equal(x.status,'committed');assert.equal(x.run.data.world.serviceOpen,false);assert.equal(x.run.data.actionResults.filter(x=>x.request.actionType===rule.closeActionId).length,1);assert.equal(x.run.data.defects.length,0);assert.deepEqual(E.dispatch(x.run,pkg,marked).run,x.run);});
const cases=[
 ['02 own opacity zero',{opacity:'0'}],['03 ancestor opacity zero',{ancestorOpacity:'0'}],['04 hidden',{hidden:true}],['05 display none',{display:'none'}],['06 visibility hidden',{visibility:'hidden'}],
 ['07 zero width',{rect:{left:100,right:100,width:0}}],['08 zero height',{rect:{top:100,bottom:100,height:0}}],
 ['09 offscreen left',{rect:{left:-10000,right:-9700}}],['10 offscreen right',{rect:{left:10000,right:10300}}],['11 above',{rect:{top:-200,bottom:-100}}],['12 below',{rect:{top:900,bottom:1000}}],
 ['13 partial left',{rect:{left:-1,right:299}}],['14 partial right',{rect:{left:800,right:1100}}],['15 partial vertical',{rect:{top:-1,bottom:99}}]
];
for(const [name,v] of cases)test('IR2-'+name+' rejects receipt through actual engine',()=>invalid(name,v));
test('IR2-16 non-finite rectangle/viewport and invalid viewport dimensions fail closed',async()=>{for(const k of ['top','bottom','left','right','width','height'])for(const v of [NaN,Infinity,-Infinity])await invalid(k,{rect:{[k]:v}});for(const k of ['viewportWidth','viewportHeight'])for(const v of [NaN,Infinity,-Infinity,0,-1])await invalid(k,{[k]:v});});
test('IR2-17 negative/inverted geometry fails closed',async()=>{for(const rect of [{width:-1},{height:-1},{left:400,right:100},{top:200,bottom:100}])await invalid('inverted',{rect});});
test('IR2-18 edited/stale draft cannot reuse truthful receipt',()=>{const c=ack(command()),bad=structuredClone(c);bad.payload.draft.scopeId=rule.relevantScopeId;assert.equal(E.dispatch(base,pkg,bad).status,'rejected');const why=E.prepareSend(base,pkg,M.draft('why',{operation:'explain',targetId:rule.recordId,scopeId:rule.relevantScopeId,contextMessageId:base.data.visits[0].warningMessageId}),'command_f202'),x=E.dispatch(base,pkg,why);assert.equal(x.status,'committed');assert.equal(E.dispatch(x.run,pkg,c).code,'STALE_COMMAND');const refreshed=structuredClone(c);refreshed.id='command_f203';refreshed.expectedRevision=x.run.revision;assert.equal(E.dispatch(x.run,pkg,refreshed).status,'rejected');});
test('IR2-19 earned truthful receipt remains valid after scroll without edits',()=>{const marked=ack(command()),scrolled=ack(marked,{rect:{top:900,bottom:1000}});assert.deepEqual(scrolled,marked);const x=E.dispatch(base,pkg,scrolled);assert.equal(x.status,'committed');assert.equal(x.run.data.world.serviceOpen,false);assert.equal(x.run.data.defects.length,0);});
test('IR2-20 visibility collapse must not earn a receipt or close service',async()=>{
 const g=JSON.parse(await fs.readFile(path.join(ev,'display-collapse-geometry.json'),'utf8'));assert.equal(g.style.visibility,'collapse');assert.equal(g.hidden,false);assert.ok(g.rect.left>=0&&g.rect.right<=g.viewport.width&&g.rect.top>=0&&g.rect.bottom<=g.viewport.height&&g.rect.width>0&&g.rect.height>0);
 await invalid('collapse',{...g.style,hidden:g.hidden,rect:g.rect,viewportHeight:g.viewport.height,viewportWidth:g.viewport.width,ancestorOpacity:g.ancestors[0].opacity});
});
