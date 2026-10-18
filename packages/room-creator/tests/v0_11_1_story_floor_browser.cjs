// v0.11.1 story/floor browser regression suite. Findings are numbered as in the v0.11 review.
// Run: node tests/v0_11_1_story_floor_browser.cjs
//   ROOM_CREATOR_HTML=/path/to/build.html  overrides the page under test (default ../Room_Creator.html)
//   CHROMIUM=/path/to/chrome                overrides the Chromium executable
// Every check runs in a fresh page so one failure cannot cascade into the next.
'use strict';
const fs=require('fs'),path=require('path');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
const root=path.resolve(__dirname,'..');
const html=path.resolve(process.env.ROOM_CREATOR_HTML||path.join(root,'Room_Creator.html'));
const outFile=path.join(__dirname,'v0_11_1_story_floor_browser_results.json');
const results=[];
const near=(a,b,t=1e-3)=>Number.isFinite(a)&&Math.abs(a-b)<=t;
function expect(cond,msg){if(!cond)throw Error(msg);}

(async()=>{
const launch={headless:true,args:['--no-sandbox']};if(process.env.CHROMIUM)launch.executablePath=process.env.CHROMIUM;
const browser=await chromium.launch(launch);

async function openPage(){
  const page=await browser.newPage({viewport:{width:1600,height:1000}});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());page.setDefaultTimeout(10000);
  await page.goto('file://'+html);await page.waitForFunction('window.RCApp');
  await page.evaluate(async()=>{await RCApp.applyBundle({project:RCApp.core.newProject(),assets:[]});});
  const E=(f,a)=>page.evaluate(f,a);
  const settle=()=>E(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const point=(x,y,story)=>E(({x,y,story})=>RCApp.projectPoint({x,y},story),{x,y,story});
  const state=()=>E(()=>RCApp.state);
  const toast=()=>E(()=>{const t=document.getElementById('toast');return t&&!t.classList.contains('hidden')?t.textContent:'';});
  // Drag in world coordinates on the given story's plane. `during` runs while the button is still held.
  async function dragWorld(a,b,story,during){const p=await point(a.x,a.y,story),q=await point(b.x,b.y,story);await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(q.x,q.y,{steps:10});if(during)await during(q);await page.mouse.up();await settle();}
  async function clickWorld(x,y,story){const p=await point(x,y,story);await page.mouse.click(p.x,p.y);await settle();}
  return {page,errors,E,settle,point,state,toast,dragWorld,clickWorld};
}
async function check(finding,name,fn){
  let ctx=null;const rec={finding,name,passed:false};
  try{ctx=await openPage();const detail=await fn(ctx);rec.passed=true;if(detail!==undefined)rec.detail=detail;}
  catch(e){rec.error=e.message;}
  if(ctx){rec.pageErrors=ctx.errors.slice();if(rec.passed&&ctx.errors.length){rec.passed=false;rec.error='Unhandled page error: '+ctx.errors.join(' | ');}await ctx.page.close().catch(()=>{});}
  results.push(rec);console.log((rec.passed?'PASS ':'FAIL ')+`[F${finding}] ${name}`+(rec.passed?'':'\n     '+rec.error));
}

// Shared fixture: Ground room (0,0 8×6) with an identical room directly above on Floor 2, plus a light in the upper room.
const upperLightSetup=E=>E(()=>{const C=RCApp.core;let up,l;RCApp.mutate(()=>{up=C.addRoomAbove(RCApp.project,RCApp.project.rooms[0].id,{name:'Upper'});},'up');RCApp.mutate(()=>{l=C.createLight(RCApp.project,{x:3,y:3},up.id);},'light');RCApp.selectRoom(up.id);RCApp.draw();return {up:up.id,light:l.id,ground:RCApp.project.rooms[0].id};});
const lightOf=(E,id)=>E(id=>{const l=RCApp.project.lights.find(l=>l.id===id);return {...l,story:RCApp.core.roomById(RCApp.project,l.roomId)?.story};},id);

try{
// ---------------- Finding 1: lights on upper stories ----------------
await check(1,'Dragging an upper-story light keeps it bound to the upper room',async({E,state,dragWorld})=>{
  const ids=await upperLightSetup(E);expect((await state()).activeStory===1,'setup: expected Floor 2 active');
  await dragWorld({x:3,y:3},{x:5,y:4},1);
  const l=await lightOf(E,ids.light);
  expect(near(l.x,5,0.01)&&near(l.y,4,0.01),`light did not move to (5,4): (${l.x},${l.y})`);
  expect(l.roomId===ids.up,`light rebound to ${l.roomId===ids.ground?'the Ground room':l.roomId} (story ${l.story}) instead of the upper room`);
});
await check(1,'Arrow-key nudge of an upper-story light keeps it bound to the upper room',async({page,E,state,clickWorld})=>{
  const ids=await upperLightSetup(E);await clickWorld(3,3,1);
  const s=await state();expect(s.selection?.kind==='light'&&s.selection.id===ids.light,'clicking the light did not select it: '+JSON.stringify(s.selection));
  await page.keyboard.press('ArrowRight');
  const l=await lightOf(E,ids.light);
  expect(near(l.x,3.1,1e-6),`nudge did not move the light: x=${l.x}`);
  expect(l.roomId===ids.up,`light rebound to ${l.roomId===ids.ground?'the Ground room':l.roomId} (story ${l.story}) after nudge`);
});

// ---------------- Finding 2: object drag validated on the object's own story ----------------
await check(2,'Dragging an object on an offset upper room validates against its own story',async({page,E,state,point,settle})=>{
  const ids=await E(async()=>{const C=RCApp.core,cv=document.createElement('canvas');cv.width=64;cv.height=128;const g=cv.getContext('2d');g.fillStyle='#d04020';g.fillRect(0,0,64,128);
    const asset={id:'asset_v0111_crate',name:'Crate',src:cv.toDataURL('image/png'),width:64,height:128,category:'imported',view:'both'};
    const p=C.newProject(),up=C.addRoomAbove(p,p.rooms[0].id,{name:'Offset upper',offsetX:20});const o=C.createObject(asset,{x:up.x+3,y:up.y+3},up.id,p);p.objects.push(o);
    await RCApp.applyBundle({project:p,assets:[asset]});RCApp.selectRoom(up.id);RCApp.draw();return {up:up.id,obj:o.id,x:o.x,y:o.y};});
  expect((await state()).activeStory===1,'setup: expected Floor 2 active');
  await settle();
  const grab=await E(id=>{const R=RCApp.renderer,item=R.isoObjects.find(i=>i.object.id===id);if(!item)return null;const r=item.rect;
    if(r){for(let dy=-0.4;dy<=0.4;dy+=0.05)for(let dx=-0.3;dx<=0.3;dx+=0.05){const q={x:r.x+dx*r.w,y:r.y+dy*r.h};if(R.hitIsoObject(RCApp.project,q)?.id===id)return RCApp.viewPoint(q);}}
    return null;},ids.obj);
  expect(grab,'could not find a clickable pixel of the object in the iso view');
  const a=await point(ids.x,ids.y,1),b=await point(ids.x+2,ids.y+1,1);
  await page.mouse.move(grab.x,grab.y);await page.mouse.down();await page.mouse.move(grab.x+b.x-a.x,grab.y+b.y-a.y,{steps:10});await page.mouse.up();await settle();
  const o=await E(id=>RCApp.project.objects.find(o=>o.id===id),ids.obj);
  expect(o.story===1,'object changed story: '+o.story);
  expect(near(o.x,ids.x+2,0.01)&&near(o.y,ids.y+1,0.01),`object did not move on its upper room: (${o.x},${o.y}) expected (${ids.x+2},${ids.y+1})`);
});

// ---------------- Finding 3: story height uses display units ----------------
const feetStory=async({page,E,settle})=>{await E(()=>{RCApp.mutate(()=>{RCApp.project.units='ft';RCApp.core.addStory(RCApp.project);},'ft');RCApp.selectStory(1);});await settle();
  const input=page.locator('#inspector [data-key="storyHeight"]').first();expect(await input.count(),'story inspector has no storyHeight input');
  if(!(await input.isVisible())){await page.locator('#inspector details:has([data-key="storyHeight"]) > summary').first().click();}
  return input;};
await check(3,'Story inspector: floor-to-floor height typed in feet is stored in metres',async(ctx)=>{
  const input=await feetStory(ctx);const shown=Number(await input.inputValue());
  expect(near(shown,3.2/0.3048,0.01),'3.2 m should display as ~10.50 ft, got '+shown);
  await input.fill('11');await input.dispatchEvent('change');await ctx.settle();
  const sh=await ctx.E(()=>RCApp.project.storyHeight);
  expect(near(sh,11*0.3048,1e-3),`11 ft should store ${11*0.3048} m, stored ${sh} (toast: ${await ctx.toast()})`);
});
await check(3,'Story inspector: storyHeight min/max attributes are in feet when units are feet',async(ctx)=>{
  const input=await feetStory(ctx);const min=Number(await input.getAttribute('min')),max=Number(await input.getAttribute('max'));
  expect(near(min,2.2/0.3048,0.02)&&near(max,8/0.3048,0.02),`expected min≈7.22 max≈26.25 ft, got min=${min} max=${max}`);
});
await check(3,'Story Settings dialog: floor-to-floor height in feet is converted and limited in feet',async({page,E,settle,toast})=>{
  await E(()=>{RCApp.mutate(()=>{RCApp.project.units='ft';},'ft');const b=document.createElement('button');b.dataset.action='story-settings';b.id='v0111StorySettings';document.body.appendChild(b);});
  await page.locator('#v0111StorySettings').click();const input=page.locator('#modalRoot [data-key="storyHeight"]');expect(await input.count(),'Story Settings dialog has no storyHeight input');
  const min=Number(await input.getAttribute('min')),max=Number(await input.getAttribute('max'));
  await input.fill('12');await input.dispatchEvent('change');await settle();const sh=await E(()=>RCApp.project.storyHeight);
  expect(near(sh,12*0.3048,1e-3),`12 ft should store ${12*0.3048} m, stored ${sh} (toast: ${await toast()})`);
  expect(near(min,2.2/0.3048,0.02)&&near(max,8/0.3048,0.02),`dialog limits not in feet: min=${min} max=${max}`);
});
await check(3,'Regression guard: storyHeight in metres still edits and keeps 2.2–8 limits',async({page,E,settle})=>{
  await E(()=>{RCApp.mutate(()=>RCApp.core.addStory(RCApp.project),'s');RCApp.selectStory(1);});await settle();
  const input=page.locator('#inspector [data-key="storyHeight"]').first();if(!(await input.isVisible()))await page.locator('#inspector details:has([data-key="storyHeight"]) > summary').first().click();
  expect(Number(await input.getAttribute('min'))===2.2&&Number(await input.getAttribute('max'))===8,'metre limits changed');
  await input.fill('3.5');await input.dispatchEvent('change');await settle();expect(near(await E(()=>RCApp.project.storyHeight),3.5),'3.5 m not stored');
});

// ---------------- Finding 4: first-person coplanar tie-break ----------------
// Sample floor points inside `rect`, project them into the viewpoint and probe what first person shows there.
const fpSamples=(E,args)=>E(({rect,z,inset})=>{const C=RCApp.core,p=RCApp.project,v=p.viewpoints.at(-1),R=RCApp.renderer,out=[];
  for(let i=0;i<5;i++)for(let j=0;j<5;j++){const x=rect.x+inset+(rect.width-2*inset)*i/4,y=rect.y+inset+(rect.length-2*inset)*j/4,s=C.fpPoint(v,{x,y,floorZ:z});
    if(!s||s.x<2||s.y<2||s.x>v.width-2||s.y>v.height-2)continue;const m=R.probe(p,v,{x:s.x,y:s.y}).meta;out.push({x,y,kind:m?.kind,id:m?.id,face:m?.face});}
  return out;},args);
const summarize=s=>JSON.stringify(s.reduce((a,x)=>{const k=x.kind+(x.face?':'+x.face:'');a[k]=(a[k]||0)+1;return a;},{}));
await check(4,'First person shows a floor section drawn over a coplanar room floor (matches iso)',async({E})=>{
  const ids=await E(()=>{const C=RCApp.core;let f;RCApp.mutate(()=>{f=C.makeFloorSection(RCApp.project,0,{x:2,y:1},{x:6,y:4});C.createViewpoint(RCApp.project,{x:4,y:5.4},{x:4,y:0},'FP probe',RCApp.project.rooms[0].id);},'fp');return {f:f.id,rect:{x:f.x,y:f.y,width:f.width,length:f.length}};});
  const s=await fpSamples(E,{rect:ids.rect,z:0,inset:0.3});expect(s.length>=8,'too few visible samples: '+s.length);
  expect(s.every(x=>x.kind==='floorSection'&&x.id===ids.f),'first person shows '+summarize(s)+' instead of the floor section');
});
await check(4,'First person: later overlapping coplanar floor section wins (iso draw order)',async({E})=>{
  const ids=await E(()=>{const C=RCApp.core;let a,b;RCApp.mutate(()=>{a=C.makeFloorSection(RCApp.project,0,{x:1,y:1},{x:5,y:4});b=C.makeFloorSection(RCApp.project,0,{x:3,y:2},{x:7,y:5});C.createViewpoint(RCApp.project,{x:4,y:5.6},{x:4,y:0},'FP probe',RCApp.project.rooms[0].id);},'fp');return {a:a.id,b:b.id};});
  const overlap=await fpSamples(E,{rect:{x:3,y:2,width:2,length:2},z:0,inset:0.2});expect(overlap.length>=8,'too few visible overlap samples');
  expect(overlap.every(x=>x.id===ids.b),'overlap shows '+summarize(overlap)+' (ids '+[...new Set(overlap.map(x=>x.id))].join(',')+'), expected the later section');
  const onlyA=await fpSamples(E,{rect:{x:1,y:1,width:1.8,length:0.8},z:0,inset:0.15});expect(onlyA.length>=4,'too few visible samples of the first section');
  expect(onlyA.every(x=>x.id===ids.a),'non-overlapping part of the first section shows '+summarize(onlyA));
});
await check(4,'First person from below: floor-section underside wins over a coplanar upper room floor',async({E})=>{
  const ids=await E(()=>{const C=RCApp.core;let f;const g=RCApp.project.rooms[0];RCApp.mutate(()=>{g.length=14;g.openAbove=true;C.addRoomAbove(RCApp.project,g.id,{name:'Upper'});f=C.makeFloorSection(RCApp.project,1,{x:2,y:1},{x:6,y:4});C.createViewpoint(RCApp.project,{x:4,y:13.5},{x:4,y:0},'FP up',g.id);},'fp');return {f:f.id,rect:{x:f.x,y:f.y,width:f.width,length:f.length},z:RCApp.core.storyElevation(RCApp.project,1)};});
  const s=await fpSamples(E,{rect:ids.rect,z:ids.z,inset:0.3});expect(s.length>=6,'too few visible underside samples: '+s.length);
  expect(s.every(x=>x.kind==='floorSection'&&x.id===ids.f),'looking up shows '+summarize(s)+' instead of the floor-section underside');
});

// ---------------- Finding 5: stacked iso draw order ----------------
await check(5,'Stacked drawIso: lower-story floor section does not paint over the upper room floor',async({E})=>{
  const r=await E(async()=>{const C=RCApp.core;const p=C.newProject(),g=p.rooms[0];g.width=12;g.length=10;
    const up=C.addRoomAbove(p,g.id,{name:'Upper',offsetX:4,offsetY:4,width:6,length:5});up.floor=C.surface('#30a050','paint');
    const f=C.makeFloorSection(p,0,{x:2,y:1.5},{x:5,y:4.5});f.floor=C.surface('#ff00ff','paint');C.validateBundle({project:p,assets:[]});
    const R=new window.RCRenderer(new Map());if(R.load)await R.load();
    const shot=opts=>{const cv=document.createElement('canvas');cv.width=1440;cv.height=1080;const ctx=cv.getContext('2d');R.drawIso(ctx,p,{grid:false,dimensions:false,cutaway:true,...opts});return ctx;};
    const z=C.storyElevation(p,1),cx=up.x+up.width/2,cy=up.y+up.length/2,pts=[[0,0],[-0.6,0],[0.6,0],[0,-0.6],[0,0.6]].map(([dx,dy])=>C.isoPoint(p,{x:cx+dx,y:cy+dy},z));
    const px=(ctx,q)=>Array.from(ctx.getImageData(Math.round(q.x),Math.round(q.y),1,1).data.slice(0,3));
    const magenta=c=>c[0]>170&&c[2]>170&&c[1]<100;
    // Control: the same pixel on Ground alone really is covered by the magenta floor section.
    const ground=pts.map(q=>px(shot({storyMode:'single',activeStory:0}),q)),stacked=pts.map(q=>px(shot({}),q));
    const hidden=pts.map(q=>C.isoInverse(p,q,0)).every(w=>C.inRect(f,w));
    return {hidden,controlMagenta:ground.map(magenta),stackedMagenta:stacked.map(magenta),stacked};});
  expect(r.hidden,'fixture error: sampled pixels are not over the lower floor section');
  expect(r.controlMagenta.every(Boolean),'fixture error: control render does not show the magenta section '+JSON.stringify(r.controlMagenta));
  expect(!r.stackedMagenta.some(Boolean),'stacked render shows the lower floor-section colour on the upper room floor: '+JSON.stringify(r.stacked));
});

// ---------------- Finding 6 (app): stored story names ----------------
await check(6,'Story Settings dialog lists stored (custom) story names',async({page,E})=>{
  await E(()=>{const C=RCApp.core;RCApp.mutate(()=>{C.addStory(RCApp.project);C.renameStory(RCApp.project,1,'Mezzanine');},'s');const b=document.createElement('button');b.dataset.action='story-settings';b.id='v0111StorySettings';document.body.appendChild(b);});
  await page.locator('#v0111StorySettings').click();const t=await page.locator('#modalRoot').innerText();
  expect(t.includes('Mezzanine'),'dialog does not show the stored name: '+t.replace(/\s+/g,' ').slice(0,300));
  expect(!/Floor 2/.test(t),'dialog still shows the default label "Floor 2"');
});
await check(6,'Deleting a middle story via the UI relabels the shifted default story tab',async({page,E,settle})=>{
  await E(()=>{const C=RCApp.core;RCApp.mutate(()=>{C.addStory(RCApp.project);C.addStory(RCApp.project);C.makeFloorSection(RCApp.project,2,{x:0,y:0},{x:2,y:2});},'s');RCApp.selectStory(1);});
  await page.locator('[data-action="delete-story"]').click();await page.locator('#confirmYes').click();await settle();
  const tabs=await page.locator('[data-story]').allInnerTexts();const names=await E(()=>RCApp.project.stories.map(s=>s.name));
  expect(JSON.stringify(names)===JSON.stringify(['Ground','Floor 2']),'stored names after delete: '+JSON.stringify(names));
  expect(tabs.length===2&&tabs[1].includes('Floor 2')&&!tabs[1].includes('Floor 3'),'story tabs: '+JSON.stringify(tabs));
});
await check(6,'Overlap error toast names the stored story',async({E,toast})=>{
  const ok=await E(()=>{const C=RCApp.core,g=RCApp.project.rooms[0];RCApp.mutate(()=>{C.addRoomAbove(RCApp.project,g.id,{name:'Upper A'});C.renameStory(RCApp.project,1,'Mezzanine');},'s');
    return RCApp.mutate(()=>{RCApp.project.rooms.push(C.makeRoom('Upper B',1,1,3,3,1));C.checkRooms(RCApp.project);},'bad');});
  const t=await toast();expect(ok===false,'overlapping room was accepted');expect(t.includes('Mezzanine')&&!t.includes('Floor 2'),'toast: '+t);
});

// ---------------- Finding 7: snapping to the just-drawn floor ----------------
await check(7,'A just-drawn (selected) floor is a snap target while drawing the next floor',async({page,E,state,settle,point})=>{
  const id=await E(()=>{const C=RCApp.core;RCApp.mutate(()=>C.addStory(RCApp.project),'s');RCApp.selectStory(1);let f;RCApp.mutate(()=>{f=C.makeFloorSection(RCApp.project,1,{x:10.3,y:1.3},{x:12.3,y:3.3});},'f');RCApp.draw();return f.id;});
  await page.locator(`[data-floorsection="${id}"]`).click();await settle();
  expect((await state()).selection?.id===id,'floor card did not select the floor');
  await page.locator('[data-tool="floorsection"]').first().click();await settle();
  const s0=await state();expect(s0.tool==='floorsection'&&s0.selection?.id===id,'expected floor tool with the drawn floor still selected: '+JSON.stringify({tool:s0.tool,sel:s0.selection}));
  const thr=await E(()=>10/(RCApp.geometry().scale*RCApp.core.isoTransform(RCApp.project).s));const d=Math.min(0.08,thr*0.4);
  const p=await point(12.3+d,2,1);await page.mouse.click(p.x,p.y);await settle();
  const o=(await state()).pending?.origin;expect(o,'no pending floor origin after clicking');
  expect(near(o.x,12.3,1e-6),`origin x=${o.x} did not snap to the drawn floor edge 12.3 (offset ${d.toFixed(3)} m, threshold ${thr.toFixed(3)} m)`);
});
await check(7,'Regression guard: a floor being dragged does not snap to itself',async({E,state,dragWorld})=>{
  const id=await E(()=>{const C=RCApp.core;RCApp.mutate(()=>C.addStory(RCApp.project),'s');RCApp.selectStory(1);let f;RCApp.mutate(()=>{f=C.makeFloorSection(RCApp.project,1,{x:10.3,y:1.3},{x:12.3,y:3.3});},'f');RCApp.draw();return f.id;});
  // Moving by 0.1 m: grid snap gives x=10.5; snapping to its own old edge would wrongly hold it at 10.3.
  await dragWorld({x:11.3,y:2.3},{x:11.4,y:2.3},1);const f=await E(id=>RCApp.core.floorSectionById(RCApp.project,id),id);
  expect(near(f.x,10.5,1e-6),'dragged floor x='+f.x+' (expected grid 10.5; 10.3 means it snapped to itself)');
});

// ---------------- Finding 8: undo/redo during a live drag ----------------
await check(8,'Ctrl+Z during a live floor drag cancels the drag, then undoes',async({page,E,state,clickWorld,dragWorld,settle})=>{
  await E(()=>{RCApp.mutate(()=>RCApp.core.addStory(RCApp.project),'s');RCApp.selectStory(1);RCApp.setTool('floorsection');});
  await clickWorld(1,1,1);await clickWorld(4,3,1);
  const f0=await E(()=>RCApp.project.floorSections[0]);expect(f0&&f0.x===1&&f0.y===1&&f0.width===3,'floor draw failed: '+JSON.stringify(f0));
  const h0=(await state()).history;
  await dragWorld({x:2.5,y:2},{x:3.5,y:3},1,async q=>{await page.keyboard.press('Control+z');await page.mouse.move(q.x+40,q.y+30,{steps:4});});
  await page.mouse.move(10,10);await settle();
  const s=await state(),n=await E(()=>RCApp.project.floorSections.length);
  expect(n===0,`undo was lost: ${n} floor section(s) remain at ${JSON.stringify(await E(()=>RCApp.project.floorSections.map(f=>[f.x,f.y])))}`);
  expect(s.history===h0-1,`history ${s.history}, expected ${h0-1}`);
  await E(()=>RCApp.redo());const f1=await E(()=>RCApp.project.floorSections[0]);
  expect(f1&&f1.x===1&&f1.y===1,'redo should restore the pre-drag floor at (1,1): '+JSON.stringify(f1&&[f1.x,f1.y]));
});
await check(8,'Ctrl+Shift+Z during a live floor drag cancels the drag, then redoes',async({page,E,state,dragWorld,settle})=>{
  const ids=await E(()=>{const C=RCApp.core;let a,b;RCApp.mutate(()=>C.addStory(RCApp.project),'s');RCApp.selectStory(1);RCApp.mutate(()=>{a=C.makeFloorSection(RCApp.project,1,{x:1,y:1},{x:4,y:3});},'a');RCApp.mutate(()=>{b=C.makeFloorSection(RCApp.project,1,{x:6,y:1},{x:8,y:3});},'b');RCApp.undo();RCApp.draw();return {a:a.id,b:b.id};});
  const h0=(await state()).history;expect(await E(()=>RCApp.project.floorSections.length)===1,'setup undo failed');
  await dragWorld({x:2.5,y:2},{x:3.5,y:3},1,async q=>{await page.keyboard.press('Control+Shift+Z');await page.mouse.move(q.x+40,q.y+30,{steps:4});});
  await page.mouse.move(10,10);await settle();
  const fs_=await E(()=>RCApp.project.floorSections.map(f=>({id:f.id,x:f.x,y:f.y})));const s=await state();
  expect(fs_.some(f=>f.id===ids.b),'redo was lost: '+JSON.stringify(fs_));
  const a=fs_.find(f=>f.id===ids.a);expect(a&&a.x===1&&a.y===1,'live drag was not cancelled before redo: '+JSON.stringify(a));
  expect(s.history===h0+1,`history ${s.history}, expected ${h0+1}`);
});
await check(8,'Regression guard: Escape still cancels a live drag with no undo entry',async({page,E,state,dragWorld})=>{
  await E(()=>{const C=RCApp.core;RCApp.mutate(()=>C.addStory(RCApp.project),'s');RCApp.selectStory(1);RCApp.mutate(()=>C.makeFloorSection(RCApp.project,1,{x:1,y:1},{x:4,y:3}),'a');RCApp.draw();});
  const h0=(await state()).history;await dragWorld({x:2.5,y:2},{x:3.5,y:3},1,async()=>{await page.keyboard.press('Escape');});
  const f=await E(()=>RCApp.project.floorSections[0]);expect(f.x===1&&f.y===1&&(await state()).history===h0,'Escape did not cancel cleanly');
});

// ---------------- Finding 9: Match room below ----------------
const openMatch=async({page,E,settle})=>{await E(()=>{RCApp.mutate(()=>RCApp.core.addStory(RCApp.project),'s');RCApp.selectStory(1);});await settle();await page.locator('[data-action="floor-match"]').first().click();
  const v=async()=>({w:Number(await page.locator('#matchWidth').inputValue()),l:Number(await page.locator('#matchLength').inputValue()),x:Number(await page.locator('#matchX').inputValue()),y:Number(await page.locator('#matchY').inputValue())});return v;};
await check(9,'Half footprint halves width and length, centred on the room below',async(ctx)=>{
  const v=await openMatch(ctx);await ctx.page.locator('#matchHalf').click();const h=await v();
  expect(h.w===4&&h.l===3&&h.x===2&&h.y===1.5,'half footprint fields '+JSON.stringify(h)+' expected {w:4,l:3,x:2,y:1.5}');
  await ctx.page.locator('#matchCreate').click();await ctx.settle();
  const f=await ctx.E(()=>RCApp.project.floorSections.at(-1));expect(f&&f.story===1&&f.x===2&&f.y===1.5&&f.width===4&&f.length===3,'created floor '+JSON.stringify(f&&{story:f.story,x:f.x,y:f.y,w:f.width,l:f.length}));
});
await check(9,'Full footprint resets size and offsets after Half',async(ctx)=>{
  const v=await openMatch(ctx);await ctx.page.locator('#matchHalf').click();await ctx.page.locator('#matchFull').click();const h=await v();
  expect(h.w===8&&h.l===6&&h.x===0&&h.y===0,'full footprint fields '+JSON.stringify(h));
});

// ---------------- Finding 10: selection after deleting a story ----------------
await check(10,'Deleting a story never selects a room on a different story',async({page,E,state,settle})=>{
  await E(()=>{const C=RCApp.core;RCApp.mutate(()=>{C.addStory(RCApp.project);C.addStory(RCApp.project);C.makeFloorSection(RCApp.project,1,{x:0,y:0},{x:3,y:3});},'s');RCApp.selectStory(2);});
  await page.locator('[data-action="delete-story"]').click();await page.locator('#confirmYes').click();await settle();
  const s=await state(),info=await E(()=>{const st=RCApp.state,sel=st.selection,r=sel?.kind==='room'?RCApp.core.roomById(RCApp.project,sel.id):null,rr=RCApp.core.roomById(RCApp.project,st.roomId);return {selStory:r?.story??null,roomIdStory:rr?.story??null,stories:RCApp.project.stories.length};});
  expect(info.stories===2&&s.activeStory===1,'expected Floor 2 active after deleting Floor 3: '+JSON.stringify({active:s.activeStory,...info}));
  expect(!(s.selection?.kind==='room')||info.selStory===1,`selection is a room on story ${info.selStory} while Floor 2 is active`);
  expect(s.roomId==null||info.roomIdStory===1,`room context is on story ${info.roomIdStory} while Floor 2 is active`);
});
await check(10,'Deleting the top story activates the story below and selects its room',async({page,E,state,settle})=>{
  const up=await E(()=>{const C=RCApp.core;let u;RCApp.mutate(()=>{u=C.addRoomAbove(RCApp.project,RCApp.project.rooms[0].id,{name:'Upper'});C.addStory(RCApp.project);},'s');RCApp.selectStory(2);return u.id;});
  await page.locator('[data-action="delete-story"]').click();await page.locator('#confirmYes').click();await settle();
  const s=await state();expect(s.activeStory===1&&s.selection?.kind==='room'&&s.selection.id===up&&s.roomId===up,'activeStory '+s.activeStory+' (expected 1), selection '+JSON.stringify(s.selection)+', roomId '+s.roomId+', upper room '+up);
});

// ---------------- Finding 12 (app): inspector minimum for floor sections ----------------
const floorInspector=async({page,E,settle},units='m')=>{const id=await E(u=>{const C=RCApp.core;let f;RCApp.mutate(()=>{RCApp.project.units=u;f=C.makeFloorSection(RCApp.project,0,{x:2,y:2},{x:4,y:4});},'f');RCApp.draw();return f.id;},units);
  await page.locator(`[data-floorsection="${id}"]`).click();await settle();return id;};
for(const key of ['width','length'])await check(12,`Inspector rejects a floor-section ${key} below 0.25 m with a clear message`,async(ctx)=>{
  const id=await floorInspector(ctx);const input=ctx.page.locator(`#inspector [data-change="floorsection"][data-key="${key}"]`);expect(await input.count(),'no '+key+' input in floor inspector');
  await input.fill('0.22');await input.dispatchEvent('change');await ctx.settle();
  const f=await ctx.E(id=>RCApp.core.floorSectionById(RCApp.project,id),id),t=await ctx.toast();
  expect(f[key]===2,`${key} 0.22 m was accepted (now ${f[key]})`);expect(/0\.25/.test(t),'rejection message does not mention 0.25 m: "'+t+'"');
});
await check(12,'Inspector rejects a floor-section width below 0.25 m entered in feet',async(ctx)=>{
  const id=await floorInspector(ctx,'ft');const input=ctx.page.locator('#inspector [data-change="floorsection"][data-key="width"]');
  await input.fill('0.7');await input.dispatchEvent('change');await ctx.settle();const f=await ctx.E(id=>RCApp.core.floorSectionById(RCApp.project,id),id);
  expect(f.width===2,'0.7 ft (0.213 m) was accepted: width '+f.width);
});
await check(12,'Regression guard: inspector accepts a floor-section width of 0.3 m',async(ctx)=>{
  const id=await floorInspector(ctx);const input=ctx.page.locator('#inspector [data-change="floorsection"][data-key="width"]');
  await input.fill('0.3');await input.dispatchEvent('change');await ctx.settle();const f=await ctx.E(id=>RCApp.core.floorSectionById(RCApp.project,id),id);
  expect(near(f.width,0.3,1e-9),'0.3 m rejected: width '+f.width+' toast '+(await ctx.toast()));
});
}catch(e){results.push({finding:0,name:'Suite completion',passed:false,error:e.stack});console.error(e);}
finally{
  const summary={html,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,results};
  fs.writeFileSync(outFile,JSON.stringify(summary,null,2));
  console.log(`${summary.passed} passed, ${summary.failed} failed`);
  await browser.close();process.exitCode=summary.failed?1:0;
}
})();
