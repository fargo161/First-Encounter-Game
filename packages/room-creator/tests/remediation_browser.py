"""Assertions for audit F1-F7 and the reproduced texture-cache reset failure."""
import asyncio,json,math,os
from pathlib import Path
from playwright.async_api import async_playwright
from rc_test_runtime import rc_output
URL=os.environ['RC_URL'];LIB=os.environ.get('RC_LIB','/lib/');ID='lp_furniture_chairs_mesh_chair_wood_01'
ROWS=[]
def record(name,passed,detail=None):
 ROWS.append(dict(name=name,passed=bool(passed),detail=detail));print(('PASS ' if passed else 'FAIL ')+name,flush=True)
 Path(rc_output('remediation_browser_results.json')).write_text(json.dumps(ROWS,indent=2),encoding='utf-8')
SETUP=r'''async({lib,id})=>{const A=RCApp,C=A.core;A.newProject(true);if(!RCAssets.connected)await RCAssets.connectUrl(lib);const r=await RCAssets.waitForModels([id]);if(r.failures.length)throw Error(JSON.stringify(r));
 A.mutate(()=>{A.project.objectLibrary={schema:1,looks:[],palettes:[],setups:{[id]:{frontTurn:90,custom:{keep:1},points:[{type:'future'}]}}};},'fixture');A.ext().props.place(id,{x:4,y:3,story:0});
 A.mutate(()=>{const q=A.project.props[0];q.points=[{id:'pt',type:'future/custom',x:.2,y:1,z:.7,yaw:17,meta:{keep:true}}];q.gameplay.tags.push({custom:true});q.extra={keep:[1,2]};q.z=1;q.scale=[1.2,1.5,.8];},'fixture');
 A.ext().props.select(A.project.props[0].id);A.setMode('iso');A.focusMap({x:4,y:3},5,0);A.draw();}'''
STATE=r'''()=>{const A=RCApp,C=A.core,q=A.project.props[0],s=A.project.objectLibrary?.setups?.[q.asset];A.draw();return {yaw:C.norm(C.propYaw(q,s)*180/Math.PI),renderYaw:C.norm(A.engine.propObject(q.id)?.rotation.y*180/Math.PI),footprint:C.propFootprint(q,s,null,C.propFloorZ(A.project,q)),points:q.points.map(p=>C.propToPlan(q,p,s,C.propFloorZ(A.project,q))),pointData:q.points,gameplay:q.gameplay,extra:q.extra};}'''
def close(a,b):
 if isinstance(a,(int,float)) and isinstance(b,(int,float)):return abs(a-b)<1e-7
 if isinstance(a,dict) and isinstance(b,dict):return a.keys()==b.keys() and all(close(a[k],b[k]) for k in a)
 if isinstance(a,list) and isinstance(b,list):return len(a)==len(b) and all(close(x,y) for x,y in zip(a,b))
 return a==b
async def main():
 async with async_playwright() as pw:
  b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':1600,'height':950});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));await pg.goto(URL)
  record('WebGL precondition',await pg.evaluate('()=>!!RCApp.engine'))
  # Each independent F1 reproduction: public mutation, undo, redo and serialized reopen.
  rows=await pg.evaluate(r'''async()=>{const A=RCApp,C=A.core,rows=[];
   for(const kind of ['shift','force','occupied','room-remove','room-retain']){A.newProject(true);let rid;
    A.mutate(()=>{const p=A.project;const prop=(id,story,x=3)=>({id,asset:'audit-missing',story,x,y:3,z:1,rotation:23,scale:[1,1,1],points:[{id:'p',type:'custom',x:.2,y:1,z:.5,custom:true}],gameplay:{tags:[{future:true}],props:{keep:9}},extra:{keep:true}});
     if(['shift','force','occupied'].includes(kind)){C.addStory(p);if(kind==='shift')C.addStory(p);const st=kind==='shift'?2:1;if(kind!=='occupied')p.rooms.push(C.makeRoom('upper',0,0,8,6,st));p.props=[prop('upper',st)];}
     else{const r=C.makeRoom('remove',20,0,8,6,0);p.rooms.push(r);rid=r.id;p.props=[prop('target',0,23)];if(kind==='room-retain')C.makeFloorSection(p,0,{x:20,y:0},{x:28,y:6});}},'fixture');
    const before=JSON.stringify(A.project);let refused=false;
    const ok=A.mutate(()=>{if(kind==='occupied'){try{C.deleteStory(A.project,1);}catch(e){refused=true;return;}throw Error('occupied deletion accepted');}else if(kind==='shift')C.deleteStory(A.project,1);else if(kind==='force')C.deleteStory(A.project,1,{force:true});else C.deleteRoom(A.project,rid);},'audit lifecycle');
    const after=JSON.stringify(A.project),p=A.project,q=p.props[0];const correct=kind==='occupied'?refused&&after===before:kind==='shift'?q?.story===1:kind==='room-retain'?q?.roomId===null&&q.extra.keep:p.props.length===0;
    if(kind==='occupied'){rows.push({name:'F1 '+kind,passed:correct});continue;}
    A.undo();const undo=JSON.stringify(A.project)===before;A.redo();const redo=JSON.stringify(A.project)===after;await A.applyBundle(JSON.parse(JSON.stringify(A.makeBundle())));rows.push({name:'F1 '+kind+' edit/undo/redo/reopen',passed:ok&&correct&&undo&&redo&&JSON.stringify(A.project)===after,detail:{correct,undo,redo}});
   }return rows;}''')
  for r in rows:record(r['name'],r['passed'],r.get('detail'))
  await pg.evaluate(SETUP,dict(lib=LIB,id=ID));before=await pg.evaluate(STATE)
  await pg.click('[data-pane="library"]');await pg.click('[data-pa="lib-mode"][data-v="looks"]');await pg.click('[data-pa="setup-delete"]');await pg.click('#confirmYes');after=await pg.evaluate(STATE)
  record('F2 setup deletion preserves render/footprint/world points/metadata',close(before,after),{'before':before,'after':after})
  await pg.evaluate('()=>RCApp.undo()');record('F2 deletion undo restores world pose',close(before,await pg.evaluate(STATE)))
  await pg.evaluate('()=>RCApp.redo()');record('F2 deletion redo preserves world pose',close(after,await pg.evaluate(STATE)))
  await pg.evaluate('async()=>RCApp.applyBundle(JSON.parse(JSON.stringify(RCApp.makeBundle())))');record('F2 deletion save/reopen preserves world pose',close(after,await pg.evaluate(STATE)))
  await pg.evaluate(SETUP,dict(lib=LIB,id=ID));before=await pg.evaluate(STATE)
  res=await pg.evaluate('id=>RCApp.ext().props.mergeLooks({format:"trapstar-room-creator-looks",version:1,looks:[],palettes:[],setups:{[id]:{frontTurn:180,custom:"incoming"}}})',ID)
  record('F2 conflict import keeps setup/pose and reports asset ID',close(before,await pg.evaluate(STATE)) and res['setupConflicts']==[ID] and await pg.evaluate('id=>RCApp.project.objectLibrary.setups[id].custom.keep===1',ID),res)
  await pg.evaluate('()=>RCApp.undo()');record('F2 import undo preserves world pose',close(before,await pg.evaluate(STATE)))
  await pg.evaluate('()=>RCApp.redo()');await pg.evaluate('async()=>RCApp.applyBundle(JSON.parse(JSON.stringify(RCApp.makeBundle())))');record('F2 import redo/reopen preserves world pose',close(before,await pg.evaluate(STATE)))
  # Import new calibration where instances exist but no setup yet.
  await pg.evaluate('()=>RCApp.mutate(()=>{delete RCApp.project.objectLibrary.setups[RCApp.project.props[0].asset];},"fixture")');before=await pg.evaluate(STATE)
  await pg.evaluate('id=>RCApp.ext().props.mergeLooks({format:"trapstar-room-creator-looks",looks:[],palettes:[],setups:{[id]:{frontTurn:270,custom:{new:true}}}})',ID)
  record('F2 new calibration import compensates existing instances',close(before,await pg.evaluate(STATE)))
  # Real canvas drags at elevated handles, including a point off the model centre.
  for story,rotation,scale in [(0,0,[1,1,1]),(0,37,[2,1.5,.5]),(1,128,[.7,2,1.4])]:
   await pg.evaluate(SETUP,dict(lib=LIB,id=ID))
   await pg.evaluate('v=>{const A=RCApp;A.mutate(()=>{if(v.story){A.core.addStory(A.project);A.project.rooms.push(A.core.makeRoom("upper",0,0,8,6,1));}const q=A.project.props[0];Object.assign(q,v);q.points[0].x=0;q.points[0].z=.7;},"fixture");A.ext().props.select(A.project.props[0].id);A.focusMap({x:4,y:3},3,v.story);A.draw();}',dict(story=story,rotation=rotation,scale=scale))
   point=await pg.evaluate('()=>{const A=RCApp,C=A.core,q=A.project.props[0],pt=q.points[0],w=C.propToPlan(q,pt,A.project.objectLibrary.setups[q.asset],C.propFloorZ(A.project,q));return {screen:A.viewPoint(C.isoPoint(A.project,w,w.z)),world:w,local:{...pt},height:w.z};}')
   x,y=point['screen']['x'],point['screen']['y'];await pg.mouse.move(x,y);await pg.mouse.down();await pg.mouse.move(x+.1,y+.1);await pg.mouse.up()
   record(f'F3 tiny elevated drag story={story} rotation={rotation}',close(point['local'],await pg.evaluate('()=>RCApp.project.props[0].points[0]')))
   await pg.mouse.move(x,y);await pg.mouse.down();await pg.mouse.move(x+8,y+5);await pg.mouse.up()
   await pg.screenshot(path=rc_output(f'point-drag-{story}-{rotation}.png'))
   state=await pg.evaluate('()=>{const q=RCApp.project.props[0];const A=RCApp,C=A.core,w=C.propToPlan(q,q.points[0],A.project.objectLibrary.setups[q.asset],C.propFloorZ(A.project,q));return {point:q.points[0],screen:A.viewPoint(C.isoPoint(A.project,w,w.z)),history:A.state.history};}');dist=math.hypot(state['point']['x']-point['local']['x'],state['point']['z']-point['local']['z'])
   record(f'F3 elevated drag stays small and keeps height story={story}',.001<dist<.5 and math.hypot(state['screen']['x']-x-8,state['screen']['y']-y-5)<1.5 and state['point']['y']==point['local']['y'] and state['point']['meta']==point['local']['meta'],{'displacement':dist,'point':point,'after':state})
   await pg.evaluate('()=>RCApp.undo()');record(f'F3 drag undo story={story}',close(point['local'],await pg.evaluate('()=>RCApp.project.props[0].points[0]')))
   await pg.evaluate('()=>RCApp.redo()');await pg.evaluate('async()=>RCApp.applyBundle(JSON.parse(JSON.stringify(RCApp.makeBundle())))');record(f'F3 drag redo/reopen story={story}',close(state['point'],await pg.evaluate('()=>RCApp.project.props[0].points[0]')))
  await pg.evaluate(SETUP,dict(lib=LIB,id=ID))
  r=await pg.evaluate('()=>{const A=RCApp;A.mutate(()=>{const q=A.project.props[0];Object.assign(q,{z:0,scale:[1,1,1],rotation:0,collision:{solid:true,shape:"cylinder",size:[2,2,2]}});A.project.objectLibrary.setups[q.asset]={frontTurn:0};},"round");const E=A.ext().route;E.buildSight();return {corner:E.sightBlock({x:4.9,y:3.9},1,{x:5.2,y:3.9},1),crossing:E.sightBlock({x:2,y:3},1,{x:6,y:3},1)};}')
  record('F4 round empty corner clear; centre crossing blocked',not r['corner'] and bool(r['crossing']),r)
  for override,label in [({'palette':'missing-palette'},'Missing palette'),({'texture':{'library':'missing-texture','custom':True}},'Missing texture'),({'texture':{'image':'missing-image'}},'Missing texture'),({'palette':'pal_kent'},'Incompatible palette')]:
   if label=='Incompatible palette':
    override={'palette':await pg.evaluate('()=>RCAssets.state.palettes.find(p=>p.id!==RCAssets.entry(RCApp.project.props[0].asset).paletteFamily).id')}
   await pg.evaluate('o=>{RCApp.mutate(()=>{RCApp.project.props[0].override={...o,custom:{keep:[1,2]}};},"missing");RCApp.ext().props.select(RCApp.project.props[0].id);}',override)
   text=await pg.locator('#inspector').inner_text();key=override.get('palette') or next(iter(override['texture'].values()))
   record('F5 '+label+' '+str(key),label in text and str(key) in text)
   await pg.screenshot(path=rc_output('missing-reference.png'))
   await pg.click('[data-pa="appearance-reset"]');record('F5 field reset retains custom metadata',await pg.evaluate('()=>RCApp.project.props[0].override.custom.keep[1]===2'))
   await pg.evaluate('()=>RCApp.undo()');await pg.evaluate('async()=>RCApp.applyBundle(JSON.parse(JSON.stringify(RCApp.makeBundle())))');record('F5 undo/reopen retains unresolved reference',await pg.evaluate('o=>Object.entries(o).every(([k,v])=>JSON.stringify(RCApp.project.props[0].override[k])===JSON.stringify(v))',override))
  # Fault injection at provider boundary; no canonical files are modified.
  r=await pg.evaluate(r'''async id=>{const A=RCAssets,P=A.state.provider,original=P.get.bind(P),path=A.entry(id).working_path;A.state.templates.delete(id);let calls=0;P.get=async rel=>{if(rel===path&&++calls===1)throw Error('injected transient read failure');return original(rel);};const recovered=await A.waitForModels([id]);const attempts=A.template(id).attempts;
   A.state.templates.delete(id);calls=0;P.get=async rel=>{if(rel===path){calls++;throw Error('injected persistent read failure');}return original(rel);};const failed=await A.waitForModels([id]);const bounded=calls;P.get=original;A.retryTemplate(id);const retried=await A.waitForModels([id]);return {recovered,attempts,failed,bounded,retried};}''',ID)
  record('F7 transient model read recovers within bounded retry',r['recovered']['ready']==1 and r['attempts']==2,r)
  record('F7 persistent failure has ID/path/error and exactly three attempts',r['bounded']==3 and r['failed']['failures'][0]['id']==ID and bool(r['failed']['failures'][0]['path']) and 'injected' in r['failed']['failures'][0]['error'])
  record('F7 explicit retry recovers without changing project',r['retried']['ready']==1)
  deadline=await pg.evaluate(r"""async id=>{const A=RCAssets,P=A.state.provider,original=P.get.bind(P),path=A.entry(id).working_path;A.state.templates.delete(id);P.get=async rel=>{if(rel===path)await new Promise(r=>setTimeout(r,250));return original(rel);};const early=await A.waitForModels([id],{timeoutMs:10});P.get=original;const later=await A.waitForModels([id]);return {early,later};}""",ID)
  record('F7 caller deadline reports loading ID and later load recovers',deadline['early']['failures'][0]['id']==ID and deadline['early']['failures'][0]['status']=='loading' and deadline['later']['ready']==1,deadline)
  await pg.evaluate(SETUP,dict(lib=LIB,id=ID))
  r=await pg.evaluate('async()=>{const A=RCApp;await A.ext().props.quickPalette(RCAssets.entry(A.project.props[0].asset).paletteFamily,"grimy","Grimy");A.draw();await new Promise(r=>setTimeout(r,300));A.draw();const before=A.engine.propTex.size;A.newProject(true);A.draw();return {before,after:A.engine.propTex.size,objects:A.engine.propEntries.size};}')
  record('Cache new project releases prop textures and objects',r['before']>0 and r['after']==0 and r['objects']==0,r)
  record('No page errors',not errs,errs);await b.close()
 if not all(r['passed'] for r in ROWS):raise SystemExit(1)
asyncio.run(main())
