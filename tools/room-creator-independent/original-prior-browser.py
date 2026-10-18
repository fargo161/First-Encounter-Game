import asyncio,json,os,math
from pathlib import Path
from playwright.async_api import async_playwright
B=Path(__file__).resolve().parent
O=Path('C:\\Users\\mcdon\\Documents\\ChatGPT\\encounter and rc\\outputs\\Room_Creator_v0_14_1_Independent_Audit')
PIC=O/'original-prior-browser';PIC.mkdir(exist_ok=True)
CHAIR='lp_furniture_chairs_mesh_chair_wood_01'
R=[]
def save(name,passed,detail):
 R.append(dict(name=name,passed=bool(passed),detail=detail));print(name,passed,json.dumps(detail)[:700],flush=True)
 (O/'original-prior-browser-probes.json').write_text(json.dumps(R,indent=2),encoding='utf-8')
SETUP=r'''async()=>{
 const A=RCApp,C=A.core;A.newProject(true);await RCAssets.connectUrl('/lib/');const id='lp_furniture_chairs_mesh_chair_wood_01';
 const t=RCAssets.template(id);while(t.status==='loading')await new Promise(r=>setTimeout(r,25));
 A.mutate(()=>{A.project.objectLibrary={schema:1,looks:[],palettes:[],setups:{[id]:{frontTurn:90}}};},'fixture');
 A.ext().props.place(id,{x:4,y:3,story:0});A.setMode('iso');A.ext().props.select(A.project.props[0].id);A.focusMap({x:4,y:3},5,0);A.draw();return A.project.props[0].id;
}'''
STATE=r'''()=>{const A=RCApp,C=A.core,q=A.project.props[0],s=A.project.objectLibrary.setups[q.asset];A.draw();return {rotation:q.rotation,front:C.propFrontTurn(s),yaw:C.propYaw(q,s),fp:C.propFootprint(q,s),objectYaw:A.engine?.propObject(q.id)?.rotation.y};}'''
async def main():
 async with async_playwright() as pw:
  b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':1600,'height':950});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
  await pg.goto('http://127.0.0.1:8783/original/Room_Creator.html');await pg.wait_for_timeout(300)
  save('WebGL precondition',await pg.evaluate('()=>!!RCApp.engine'),{'browser':b.version})
  await pg.evaluate(SETUP);before=await pg.evaluate(STATE)
  await pg.click('[data-pane="library"]');await pg.click('[data-pa="lib-mode"][data-v="looks"]')
  await pg.click('[data-pa="setup-delete"]');await pg.click('#confirmYes');after=await pg.evaluate(STATE)
  await pg.screenshot(path=str(PIC/'setup-deletion.png'))
  save('Deleting a model setup preserves placed object pose',abs(before['yaw']-after['yaw'])<.0001,{'before':before,'after':after})
  await pg.evaluate(SETUP);before=await pg.evaluate(STATE)
  result=await pg.evaluate(r'''()=>RCApp.ext().props.mergeLooks({format:'trapstar-room-creator-looks',version:1,looks:[],palettes:[],setups:{lp_furniture_chairs_mesh_chair_wood_01:{frontTurn:180,custom:'incoming'}}})''')
  after=await pg.evaluate(STATE)
  save('Importing conflicting setups preserves existing model setup and pose',abs(before['yaw']-after['yaw'])<.0001,{'before':before,'after':after,'importResult':result})
  await pg.evaluate(SETUP)
  await pg.evaluate(r'''()=>{const A=RCApp,q=A.project.props[0];A.mutate(()=>{q.z=1;q.points=[{id:'elevated',type:'custom',x:0,y:1,z:.7,yaw:0,enabled:true}];},'fixture');A.ext().props.select(q.id);A.draw();}''')
  await pg.wait_for_timeout(200)
  point=await pg.evaluate(r'''()=>{const A=RCApp,C=A.core,q=A.project.props[0],pt=q.points[0],s=A.project.objectLibrary.setups[q.asset],w=C.propToPlan(q,pt,s,C.propFloorZ(A.project,q));return {world:w,screen:A.viewPoint(C.isoPoint(A.project,w,w.z)),local:{...pt}};}''')
  x,y=point['screen']['x'],point['screen']['y'];await pg.mouse.move(x,y);await pg.mouse.down();await pg.mouse.move(x+.1,y+.1);await pg.mouse.up();await pg.wait_for_timeout(100)
  after=await pg.evaluate('()=>RCApp.project.props[0].points[0]')
  displacement=math.hypot(point['local']['x']-after['x'],point['local']['z']-after['z'])
  save('Tiny drag of elevated Use Point preserves its plan position',displacement<.02,{'before':point,'after':after,'modelPlanDisplacement':displacement})
  await pg.evaluate(SETUP)
  r=await pg.evaluate(r'''()=>{const A=RCApp,C=A.core,p=A.project,q=p.props[0];A.mutate(()=>{q.collision={solid:true,shape:'cylinder',size:[2,2,2]};p.objectLibrary.setups[q.asset]={frontTurn:0};},'round');const E=A.ext().route;E.buildSight();const a={x:4.9,y:3.9},b={x:5.2,y:3.9};return {actualFootprint:C.propFootprint(q,p.objectLibrary.setups[q.asset]),a,b,blocked:E.sightBlock(a,1,b,1),inside:C.pointInPoly(a,C.propFootprint(q).poly)};}''')
  save('Round collision does not occlude empty corner outside the circle',not r['blocked'],r)
  await pg.evaluate(SETUP)
  r=await pg.evaluate(r'''()=>{const A=RCApp,p=A.project,q=p.props[0];A.mutate(()=>{q.override.palette='missing-palette';},'missing');A.ext().props.select(q.id);return {stored:q.override.palette,panel:document.getElementById('inspector').innerText};}''')
  save('Missing palette reference is visible for repair','missing-palette' in r['panel'],r)
  await pg.evaluate(SETUP)
  r=await pg.evaluate(r'''async()=>{const A=RCApp,q=A.project.props[0];await A.ext().props.quickPalette('pal_lowpoly_master_32','grimy','Grimy');A.draw();await new Promise(r=>setTimeout(r,500));A.draw();const before={textures:A.engine.propTex.size,objects:A.engine.propEntries.size};A.newProject(true);A.draw();return {before,after:{textures:A.engine.propTex.size,objects:A.engine.propEntries.size}};}''')
  save('Starting a new project releases object texture cache',r['after']['textures']==0,r)
  save('Independent probes produce no page errors',not errs,errs)
  await b.close()
asyncio.run(main())
