import asyncio,ast,json,math,os
from pathlib import Path
from playwright.async_api import async_playwright
W=Path(__file__).resolve().parent;B=W.parents[1];O=B/'outputs/Room_Creator_v0_14_1_Independent_Audit';C=W/'candidate/Room_Creator_v0_14_1_remediation_candidate';ID='lp_furniture_chairs_mesh_chair_wood_01'
R=[]
def record(name,ok,data=None):
 R.append({'name':name,'passed':bool(ok),'detail':data});(O/'adversarial-results.json').write_text(json.dumps(R,indent=2),encoding='utf-8');print(('PASS ' if ok else 'FAIL ')+name,flush=True)
def close(a,b):
 if isinstance(a,(int,float)) and isinstance(b,(int,float)):return abs(a-b)<1e-7
 if isinstance(a,dict) and isinstance(b,dict):return a.keys()==b.keys() and all(close(a[k],b[k]) for k in a)
 if isinstance(a,list) and isinstance(b,list):return len(a)==len(b) and all(close(x,y) for x,y in zip(a,b))
 return a==b
FIX=r'''async({id,front})=>{const A=RCApp,C=A.core;A.newProject(true);await RCAssets.connectUrl('/lib/');await RCAssets.waitForModels([id]);
 A.mutate(()=>{C.addStory(A.project);A.project.rooms.push(C.makeRoom('Upper',0,0,8,6,1));A.project.objectLibrary={schema:1,looks:[],palettes:[],setups:{[id]:{frontTurn:front,custom:{keep:1},points:[{type:'future/point',x:.3,y:.6,z:.2,yaw:39,custom:{keep:2}}],tags:[{future:true}],collision:{solid:true,shape:'cylinder',size:[1,1,2]}}}};},'fixture');
 A.ext().props.place(id,{x:4,y:3,story:1});A.mutate(()=>{const q=A.project.props[0];Object.assign(q,{rotation:37,z:.8,scale:[1.7,2.2,.6],points:[{id:'one',x:.3,y:.8,z:.4,yaw:79,type:'future',custom:{keep:3}}],extra:{keep:4}});},'fixture');A.ext().props.select(A.project.props[0].id);A.setMode('iso');A.focusMap({x:4,y:3},3,1);A.draw();}'''
STATE=r'''()=>{const A=RCApp,C=A.core,q=A.project.props[0],s=A.project.objectLibrary.setups[q.asset];A.draw();const obj=A.engine.propObject(q.id);obj.updateMatrixWorld(true);return {matrix:obj.matrixWorld.elements,poly:C.propFootprint(q,s,null,C.propFloorZ(A.project,q)),points:q.points.map(p=>({...C.propToPlan(q,p,s,C.propFloorZ(A.project,q)),heading:C.propPointHeading(q,p,s)})),pointData:q.points,collision:q.collision,extra:q.extra,gameplay:q.gameplay};}'''
async def main():
 async with async_playwright() as pw:
  browser=await pw.chromium.launch();pg=await browser.new_page(viewport={'width':1600,'height':950});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));await pg.goto('http://127.0.0.1:8783/candidate/Room_Creator.html')
  for front in [90,180,270]:
   await pg.evaluate(FIX,{'id':ID,'front':front});before=await pg.evaluate(STATE)
   await pg.click('[data-pane="library"]');await pg.click('[data-pa="lib-mode"][data-v="looks"]');await pg.click('[data-pa="setup-delete"]');await pg.click('#confirmYes');after=await pg.evaluate(STATE)
   await pg.evaluate('()=>RCApp.undo()');undo=await pg.evaluate(STATE);await pg.evaluate('()=>RCApp.redo()');await pg.evaluate('async()=>RCApp.applyBundle(JSON.parse(JSON.stringify(RCApp.makeBundle())))');reopen=await pg.evaluate(STATE)
   record(f'F2 deletion front {front}, rotated stretched upper-story matrix/point heading/history',close(before,after) and close(before,undo) and close(before,reopen),{'before':before,'after':after,'reopen':reopen})
   r=await pg.evaluate('id=>RCApp.ext().props.mergeLooks({format:"trapstar-room-creator-looks",looks:[],setups:{[id]:{frontTurn:270,custom:{new:7},points:[{type:"new/default",x:.2,y:.3,z:.4,custom:{keep:8}}],tags:[{fromSetup:true}],collision:{solid:false,shape:"box",size:[1,2,3]}}}})',ID)
   record(f'F2 new setup import {front} keeps world matrix and points',close(before,await pg.evaluate(STATE)),r)
   await pg.evaluate('id=>RCApp.ext().props.place(id,{x:5,y:3,story:1})',ID)
   new=await pg.evaluate('()=>RCApp.project.props[1]');record(f'F2 subsequently placed copy inherits setup defaults {front}',new['points'][0]['type']=='new/default' and new['points'][0]['custom']['keep']==8 and new['collision']['solid']==False,new)
  # Expanded route wiring tests, using known local rays outside/through the convex circle.
  r=await pg.evaluate(r'''()=>{const A=RCApp,C=A.core;A.newProject(true);Object.assign(A.project.rooms[0],{x:-10,y:-10,width:40,length:40});const rows=[];for(const rotation of [0,37,90,214])for(const scale of [[1,1,1],[2,.7,.4]]){A.mutate(()=>{A.project.props=[{id:'probe',asset:'missing',name:'probe',x:4,y:3,z:.4,rotation,scale,bounds:{min:[-1,0,-1],max:[1,2,1]},collision:{shape:'cylinder',solid:true,size:[2,2,2],offset:[.2,-.3]}}];},'fixture');const q=A.project.props[0],E=A.ext().route;E.buildSight();const ray=(a,za,b,zb)=>E.sightBlock(C.propToPlan(q,{x:a[0]+.2,z:a[1]-.3}),za,C.propToPlan(q,{x:b[0]+.2,z:b[1]-.3}),zb)==='probe';const lo=.4,hi=.4+2*scale[1];rows.push({rotation,scale,corner:!ray([.9,.9],1,[1.2,.9],1),centre:ray([-.5,0],(lo+hi)/2,[.5,0],(lo+hi)/2),high:!ray([-2,0],hi+.1,[2,0],hi+.1),low:!ray([-2,0],lo-.1,[2,0],lo-.1),slope:ray([-2,0],lo-1,[2,0],hi+1)});
   for(const key of ['enabled','solid']){if(key==='enabled')q.enabled=false;else{q.enabled=true;q.collision.solid=false;}E.buildSight();rows.push({key,clear:!ray([-.5,0],1,[.5,0],1)});}}
   A.project.props=[];A.project.pillars=[{id:'legacy',name:'legacy',x:4,y:3,width:1,depth:1,height:2,story:0}];A.ext().route.buildSight();rows.push({legacy:A.ext().route.sightBlock({x:3.2,y:3},1,{x:4.8,y:3},1)==='legacy'});A.newProject(true);return rows;}''')
  record('F4 route rays: ellipses, offsets, rotations, vertical bounds, slopes, disabled/non-solid and legacy pillar',all(all(v for k,v in x.items() if k not in ['rotation','scale','key']) for x in r),r)
  # Manifest-known but physically absent canonical palette/texture files, using a read-only virtual folder.
  await pg.evaluate(FIX,{'id':ID,'front':90})
  r=await pg.evaluate(r'''async id=>{const A=RCAssets,m=structuredClone(A.state.manifest),model=A.entry(id),pal=A.entry(model.paletteFamily),tx=A.state.textures[0];m.assets=m.assets.filter(e=>[id,pal.id,tx.id].includes(e.asset_id));const glb=await A.blob(model.working_path);const files=[new File([JSON.stringify(m)],'ASSET_MANIFEST.json'),new File([glb],model.working_path)];await A.connectFiles(files);await A.waitForModels([id]);while(!A.state.fileCheck.done)await new Promise(r=>setTimeout(r,20));return {palette:pal.id,texture:tx.id,missingFiles:A.state.report.missingFiles};}''',ID)
  for field,key in [('palette',r['palette']),('texture',r['texture'])]:
   await pg.evaluate('({field,key})=>{RCApp.mutate(()=>{RCApp.project.props[0].override={custom:{keep:9},[field]:field==="texture"?{library:key}:key};},"missing file");RCApp.ext().props.select(RCApp.project.props[0].id);RCApp.draw();}',{'field':field,'key':key});await pg.wait_for_timeout(500)
   data=await pg.evaluate('()=>{RCApp.draw();const q=RCApp.project.props[0];return {panel:document.getElementById("inspector").innerText,issues:RCApp.core.propAppearanceIssues(RCApp.project,q,RCAssets.entry(q.asset),id=>RCAssets.entry(id),id=>RCApp.catalog.has(id),RCAssets.template(q.asset)),cache:[...RCApp.engine.propTex].map(([k,v])=>({key:k,failed:!!v.failed,hasTexture:!!v.tex}))};}')
   data['missingFiles']=r['missingFiles'];await pg.screenshot(path=str(O/f'adversarial-missing-{field}-file.png'))
   record(f'F5 manifest-known missing {field} file has explicit object repair warning',any(x['field']==field for x in data['issues']),data)
   await pg.evaluate('async()=>RCApp.applyBundle(JSON.parse(JSON.stringify(RCApp.makeBundle())))');retained=await pg.evaluate('()=>RCApp.project.props[0].override');record(f'F5 missing {field} file reference and unknown metadata survive reopen',retained.get('custom',{}).get('keep')==9 and (retained.get(field)==key if field=='palette' else retained.get(field,{}).get('library')==key),retained)
  await pg.evaluate('async()=>RCAssets.connectUrl("/lib/")')
  # Timeout uses actual 12-second attempt timers; old results are not allowed to replace new template/connection.
  r=await pg.evaluate(r'''async id=>{const A=RCAssets,P=A.state.provider,orig=P.get.bind(P),path=A.entry(id).working_path;A.state.templates.delete(id);let calls=0;P.get=rel=>rel===path?(calls++,new Promise(()=>{})):orig(rel);const start=performance.now(),result=await A.waitForModels([id],{timeoutMs:40000});P.get=orig;return {calls,ms:performance.now()-start,result};}''',ID)
  record('F7 real readiness timeouts stop at three attempts with actionable diagnostics',r['calls']==3 and 36000<=r['ms']<41000 and r['result']['failures'][0]['attempts']==3 and 'timed out' in r['result']['failures'][0]['error'],r)
  r=await pg.evaluate(r'''async id=>{const A=RCAssets,P=A.state.provider,orig=P.get.bind(P),path=A.entry(id).working_path;A.state.templates.delete(id);P.get=async rel=>{const b=await orig(rel);if(rel===path)await new Promise(r=>setTimeout(r,1200));return b;};const old=A.template(id);await new Promise(r=>setTimeout(r,40));await A.connectUrl('/lib/');const newT=A.template(id);await A.waitForModels([id]);await new Promise(r=>setTimeout(r,1500));return {different:old!==newT,current:A.template(id)===newT,status:A.template(id).status,failures:A.state.report.loadFailures};}''',ID)
  record('F7 late read cannot replace model after library reconnection',r['different'] and r['current'] and r['status']=='ready' and not r['failures'],r)
  # Execute the generator's real readiness barrier with a permanently failing model; no scene edit can occur.
  tree=ast.parse((C/'tests/make_asset_demo.py').read_text());build=next(ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='PAGE_BUILD' for t in n.targets))
  await pg.evaluate(FIX,{'id':ID,'front':180});before=await pg.evaluate('()=>JSON.stringify(RCApp.makeBundle())')
  await pg.evaluate('id=>{const A=RCAssets,P=A.state.provider,orig=P.get.bind(P),path=A.entry(id).working_path;A.state.templates.delete(id);P.get=rel=>rel===path?Promise.reject(Error("independent permanent demo read failure")):orig(rel);}',ID)
  err=''
  try:await pg.evaluate(build,{'props':[{'asset':ID}]})
  except Exception as e:err=str(e)
  after=await pg.evaluate('()=>JSON.stringify(RCApp.makeBundle())');record('F7 real generator refuses unresolved model before changing scene',before==after and 'Demo stopped before editing or saving' in err and ID in err,{'error':err,'bundleUnchanged':before==after})
  record('No uncaught page errors in independent adversarial probes',not errors,errors);await browser.close()
asyncio.run(main())
