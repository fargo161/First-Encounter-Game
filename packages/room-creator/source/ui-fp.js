/* ===================== 0.13 · ui-fp.js =====================
   First person you can edit directly.
   - On a placed viewpoint, every gesture edits that viewpoint: drag = look around (grab the picture),
     mouse wheel = lens angle, W A S D / arrow keys = walk (walls stop you), Q / E = lower / raise the eye.
     One whole gesture is one Undo step.
   - The free camera walks anywhere, even up stairs, without changing any viewpoint. "Save as viewpoint"
     turns the current spot into a new placed viewpoint. */
let fpLive=null,fpCommitTimer=0,fpKeys=new Set(),fpShift=false,fpLoopId=0,fpLastT=0,fpDrag=null,fpGlide=null,fpGuides='off',fpShowHorizon=0,fpHudKey='';
const navCache={p:null,key:''};
const FP_CODES=new Set(['KeyW','KeyA','KeyS','KeyD','KeyQ','KeyE','ArrowUp','ArrowDown','ArrowLeft','ArrowRight']);

// What the first-person view is showing right now: a rail ride, a test-walk transit, the free camera, or a viewpoint.
function fpFrame(){const rw=typeof routeWalkView==='function'?routeWalkView():null;if(rw)return rw;const rp=railRidePose();if(rp)return rp;const tp=transitPose();if(tp)return tp;if(freeCam&&mode==='build')return freeCam;return currentView();}
function fpCamera(){return GLE.camFromView(project,fpFrame());}
// What first-person gestures edit (null while riding a rail, travelling, testing or on the map).
function fpTarget(){if(active!=='fp'||mode!=='build'||railRiding()||transitActive())return null;if(freeCam)return {free:true,v:freeCam};const v=currentView();if(!v)return null;const pair=C.pairFor(project,v.id),cv=pair?project.viewpoints.find(q=>q.id===pair.coverViewId):v;return {free:false,v,cv,pair};}
function poseOf(t){const v=t.v,cv=t.cv||v;return {x:v.x,y:v.y,facing:cv.facing,horizon:cv.horizon??.42,fov:cv.fov,eye:v.eyeHeight};}

// ------------------------------------------------------------------ live edits with one Undo per gesture
function beginLive(label){if(!fpLive)fpLive={before:capture(),label};else fpLive.label=label;}
function scheduleCommit(ms=450){clearTimeout(fpCommitTimer);fpCommitTimer=setTimeout(commitLive,ms);}
function commitLive(){
  if(skyLive)skyCommit();clearTimeout(fpCommitTimer);fpCommitTimer=0;if(!fpLive)return;const L=fpLive;fpLive=null;
  try{const old=new Map(L.before.project.viewpoints.map(v=>[v.id,v]));
    for(const v of project.viewpoints){const o=old.get(v.id);if(o&&(Math.abs(o.x-v.x)>1e-9||Math.abs(o.y-v.y)>1e-9)){const r=C.roomAtStory(project,v,v.story||0);v.roomId=r?.id||null;}}
    C.syncPairs(project);C.checkViewpoints(project);const valid=C.validateBundle({project,assets:[...catalog.values()]});project=valid.project;pushHistory(L.before,L.label);}
  catch(e){project=L.before.project;toast('That change was undone: '+e.message,6500);}
  liveRev++;refresh();
}
function applyPose(t,ch,label){
  if(t.free)Object.assign(freeCam,ch);
  else{beginLive(label);const {v,cv,pair}=t;
    if('facing' in ch)cv.facing=C.norm(ch.facing);
    if('horizon' in ch)cv.horizon=C.clamp(ch.horizon,.1,.9);
    if('fov' in ch)cv.fov=C.clamp(ch.fov,35,110);
    if('eyeHeight' in ch){const e=C.clamp(ch.eyeHeight,.35,2.5);if(pair&&v.id===pair.exposedViewId)pair.exposedEye=e;else v.eyeHeight=e;}
    if('x' in ch){cv.x+=ch.x-v.x;cv.y+=ch.y-v.y;}
    if(pair)C.syncPairs(project);}
  liveRev++;drawSoon();updateFpHud();
}

// ------------------------------------------------------------------ walking: walls, floor edges and stairs
function navGridFor(story){if(navCache.p!==project){navCache.p=project;navCache.key=RR.navKey(project);}return RR.storyGrid(project,story,navCache.key);}
function cellFree(g,x,y){if(!g)return false;const i=Math.floor((x-g.x0)/RR.CELL),j=Math.floor((y-g.y0)/RR.CELL);return i>=0&&j>=0&&i<g.W&&j<g.H&&g.cells[j*g.W+i]===1;}
function floorZAt(story,x,y){const r=C.roomAtStory(project,{x,y},story);return r?C.roomElevation(project,r):C.storyElevation(project,story);}
function stairAt(x,y,story){for(const st of project.stairs||[]){if(x>st.x&&x<st.x+st.width&&y>st.y&&y<st.y+st.length&&(st.story===story||st.story+1===story))return st;}return null;}
function nearStair(x,y,story,pad=.45){return (project.stairs||[]).some(st=>(st.story===story||st.story+1===story)&&x>st.x-pad&&x<st.x+st.width+pad&&y>st.y-pad&&y<st.y+st.length+pad);}
function stairFrac(st,x,y){const g=C.stairGeometry(project,st);return ((x-g.bottom.x)*g.dir.x+(y-g.bottom.y)*g.dir.y)/g.along;}
function nearestFloor(pt,story){const g=navGridFor(story);if(!g)return null;const ci=Math.floor((pt.x-g.x0)/RR.CELL),cj=Math.floor((pt.y-g.y0)/RR.CELL);let best=null,bd=Infinity;for(let j=0;j<g.H;j++)for(let i=0;i<g.W;i++){if(g.cells[j*g.W+i]!==1)continue;const d=(i-ci)*(i-ci)+(j-cj)*(j-cj);if(d<bd){bd=d;best={i,j};}}return best?{x:g.cx(best.i),y:g.cy(best.j)}:null;}
// One step of movement. Returns the new position or null when something solid is in the way.
function stepTo(cam,nx,ny,allowStairs){
  const sh=project.storyHeight||3.2,story=cam.story||0;
  if(cam.onStair){const st=C.stairById(project,cam.onStair);
    if(st){const f=stairFrac(st,nx,ny),inside=nx>=st.x&&nx<=st.x+st.width&&ny>=st.y&&ny<=st.y+st.length;
      if(inside)return {x:nx,y:ny,story:st.story,floorZ:C.storyElevation(project,st.story)+C.clamp(f,0,1)*sh,onStair:st.id};
      if(f>.15&&f<.85)return null; // no stepping off the side halfway up
      const to=f>=.5?st.story+1:st.story,q={x:nx,y:ny,story:to};if(!C.inFloor(project,q,0,to))return null;
      return {x:nx,y:ny,story:to,floorZ:floorZAt(to,nx,ny),onStair:null};}
  }
  if(allowStairs){const st=stairAt(nx,ny,story);if(st){const f=stairFrac(st,nx,ny),fromBelow=st.story===story;if(fromBelow?f<=.25:f>=.75)return {x:nx,y:ny,story:st.story,floorZ:C.storyElevation(project,st.story)+C.clamp(f,0,1)*sh,onStair:st.id};return null;}}
  const g=navGridFor(story);
  if(cellFree(g,nx,ny))return {x:nx,y:ny,story,floorZ:floorZAt(story,nx,ny),onStair:null};
  // Standing in the safety margin next to a wall or a stair opening: allow moves that stay on floor and cross no wall.
  const ns=allowStairs&&nearStair(nx,ny,story);if(!cellFree(g,cam.x,cam.y)||ns){const q={x:nx,y:ny,story};if(C.inFloor(project,q,ns?0:.05,story)&&!propAt(story,nx,ny)&&C.routeCheck(project,{x:cam.x,y:cam.y,story},q,{ignoreDoorState:false}).ok)return {x:nx,y:ny,story,floorZ:floorZAt(story,nx,ny),onStair:null};}
  return null;
}
function fpTick(now){
  fpLoopId=0;const t=fpTarget();if(!t){fpKeys.clear();fpLastT=0;return;}
  const dt=fpLastT?Math.min(.1,(now-fpLastT)/1000):1/60;fpLastT=now;
  const k=fpKeys,run=fpShift?2.6:1;let f=0,s=0,yaw=0,eye=0;
  if(k.has('KeyW')||k.has('ArrowUp'))f++;if(k.has('KeyS')||k.has('ArrowDown'))f--;if(k.has('KeyD'))s++;if(k.has('KeyA'))s--;
  if(k.has('ArrowRight'))yaw++;if(k.has('ArrowLeft'))yaw--;if(k.has('KeyE'))eye++;if(k.has('KeyQ'))eye--;
  const p=poseOf(t),ch={};
  if(yaw)ch.facing=p.facing+yaw*80*run*dt;
  if(eye)ch.eyeHeight=C.clamp(p.eye+eye*.75*run*dt,.35,2.5);
  if(f||s){const b=C.basis(ch.facing??p.facing),n=Math.hypot(f,s),sp=2.3*run*dt/n,dx=(b.fx*f+b.rx*s)*sp,dy=(b.fy*f+b.ry*s)*sp;
    const cam=t.free?freeCam:{x:p.x,y:p.y,story:t.v.story||0,onStair:null};
    let r=stepTo(cam,p.x+dx,p.y+dy,t.free)||stepTo(cam,p.x+dx,p.y,t.free)||stepTo(cam,p.x,p.y+dy,t.free);
    if(r&&!t.free&&(r.onStair||r.story!==(t.v.story||0)))r=null;
    if(r){if(t.free)Object.assign(ch,r);else{ch.x=r.x;ch.y=r.y;}}}
  if(Object.keys(ch).length)applyPose(t,ch,f||s?'Walk viewpoint':eye?'Change eye level':'Turn viewpoint');
  if(fpKeys.size)fpLoopId=requestAnimationFrame(fpTick);else{fpLastT=0;if(!t.free)scheduleCommit(300);if(t.free)refresh();}
}

// ------------------------------------------------------------------ free camera
function makeFreeCam(v){const story=v.story||0;return {id:null,name:'Free camera',x:v.x,y:v.y,story,floorZ:v.floorZ??floorZAt(story,v.x,v.y),facing:v.facing??0,fov:v.fov??72,eyeHeight:v.eyeHeight??1.6,horizon:v.horizon??.42,width:v.width||1440,height:v.height||900,roomId:null,role:'movement',fromViewId:v.id||null,onStair:null};}
function startFreeCam(from=null){
  const v=from||currentView();if(v){freeCam=makeFreeCam(v);return true;}
  bindIsoFrame();const c=active==='iso'?centreOfScreen():{x:720,y:540},raw=C.isoInverse(project,c,C.storyElevation(project,activeStory)),pt=nearestFloor(raw,activeStory);
  if(!pt){toast('Draw some floor on this story first — the free camera needs somewhere to stand.');return false;}
  freeCam=makeFreeCam({x:pt.x,y:pt.y,story:activeStory,facing:mapProj==='iso'?C.heading(pt,{x:pt.x-1,y:pt.y-1}):C.heading(pt,{x:pt.x,y:pt.y-1})});return true;
}
function enterFreeCam(){if(active==='iso')rememberMap();active='fp';tool='select';pending=null;lastProbe=null;fit();refresh();}
function startFreeCamAt(pt){const g=navGridFor(pt.story);let q=pt;if(!cellFree(g,pt.x,pt.y)){q=nearestFloor(pt,pt.story);if(!q){toast('There is no walkable floor there.');return;}}
  freeCam=makeFreeCam({x:q.x,y:q.y,story:pt.story,facing:mapProj==='iso'?C.heading(q,{x:q.x-1,y:q.y-1}):C.heading(q,{x:q.x,y:q.y-1})});activeStory=pt.story;enterFreeCam();
  toast('Free camera: drag to look, W A S D to walk, then “Save as viewpoint” to keep the spot. Press 1 to go back to the map.',7000);}
function saveFreeCam(){
  const f=freeCam;if(!f)return;if(f.onStair){toast('Step off the stairs first — a viewpoint needs level floor.');return;}
  const b=C.basis(f.facing);let made=null;
  if(mutate(()=>{const v=C.createViewpoint(project,{x:f.x,y:f.y},{x:f.x+b.fx,y:f.y+b.fy},'View '+String(project.viewpoints.length+1).padStart(2,'0'),null,f.story);
    v.fov=C.clamp(Math.round(f.fov),35,110);v.eyeHeight=C.clamp(f.eyeHeight,.35,2.5);v.horizon=C.clamp(f.horizon,.1,.9);v.facing=C.norm(f.facing);C.checkViewpoints(project);made={id:v.id,name:v.name,story:v.story||0};viewId=v.id;selection={kind:'view',id:v.id};panel='selection';},'Save free camera as viewpoint')){
    freeCam=null;activeStory=made.story;refresh();toast(made.name+' saved. You are now editing it: every drag, scroll or step changes this viewpoint (Ctrl+Z undoes).',7000);}
}
function moveViewToFreeCam(){
  const f=freeCam,v=project.viewpoints.find(q=>q.id===f?.fromViewId);if(!v)return;
  if(f.onStair||f.story!==(v.story||0)){toast('Bring the free camera back to '+storyName(v.story||0)+' (off the stairs) to move this viewpoint.');return;}
  if(mutate(()=>{const pair=C.pairFor(project,v.id),cv=pair?project.viewpoints.find(q=>q.id===pair.coverViewId):v;C.moveView(project,v.id,{x:f.x,y:f.y});cv.facing=C.norm(f.facing);cv.fov=C.clamp(f.fov,35,110);cv.horizon=C.clamp(f.horizon,.1,.9);
    if(pair&&v.id===pair.exposedViewId)pair.exposedEye=C.clamp(f.eyeHeight,.35,2.5);else v.eyeHeight=C.clamp(f.eyeHeight,.35,2.5);C.syncPairs(project);C.checkViewpoints(project);const r=C.roomAtStory(project,v,v.story||0);v.roomId=r?.id||null;viewId=v.id;selection={kind:'view',id:v.id};panel='selection';},'Move viewpoint to free camera')){freeCam=null;refresh();}
}
function leaveFreeCam(){const f=freeCam,v=project.viewpoints.find(q=>q.id===f?.fromViewId)||currentView();freeCam=null;if(v){viewId=v.id;selection={kind:'view',id:v.id};activeStory=v.story||0;panel='selection';refresh();}else setMode('iso');}

// ------------------------------------------------------------------ gestures
function glideTo(t,pt){
  const p=poseOf(t),story=t.free?freeCam.story:(t.v.story||0);if(t.free&&freeCam.onStair){toast('Walk off the stairs with W A S D first.');return;}
  if((pt.story??story)!==story){toast('That floor is on another story. Walk there with W A S D — the free camera can climb stairs.');return;}
  const a={x:p.x,y:p.y,story},b={x:pt.x,y:pt.y,story};let path=null;
  if(C.routeCheck(project,a,b,{ignoreDoorState:false}).ok)path=[a,b];else if(t.free){const f=RR.findPath(project,a,b);if(f&&f.every(q=>q.story===story))path=f;}
  if(!path){toast('Something solid is in the way. Double-click a floor point you can walk straight to.');return;}
  let L=0;for(let i=1;i<path.length;i++)L+=Math.hypot(path[i].x-path[i-1].x,path[i].y-path[i-1].y);
  fpGlide={path,L,t0:performance.now(),dur:C.clamp(L/3.2,.35,2.8)*1000};requestAnimationFrame(glideStep);
}
function pointAlong(path,d){for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],l=Math.hypot(b.x-a.x,b.y-a.y);if(d<=l||i===path.length-1){const u=l>1e-9?C.clamp(d/l,0,1):1;return {x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u};}d-=l;}return path[path.length-1];}
function glideStep(now){const G=fpGlide;if(!G)return;const t=fpTarget();if(!t){fpGlide=null;return;}
  const u=Math.min(1,(now-G.t0)/G.dur),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2,q=pointAlong(G.path,e*G.L),ch={x:q.x,y:q.y};if(t.free)ch.floorZ=floorZAt(freeCam.story,q.x,q.y);
  applyPose(t,ch,'Step viewpoint');if(u<1)requestAnimationFrame(glideStep);else{fpGlide=null;if(!t.free)commitLive();else refresh();}}
function fpClickSelect(q,meta){
  const v=fpFrame();if(!v)return;const st=x=>{if(Number.isInteger(x))activeStory=x;};
  if(meta?.kind==='object'){const o=project.objects.find(o=>o.id===meta.id);if(o){st(o.story||0);selection={kind:'object',id:o.id};panel='selection';roomId=o.roomId||roomId;refresh();}return;}
  if(meta?.kind==='exterior'){roomId=meta.roomId;backdropTarget=meta.side;st(C.roomById(project,meta.roomId)?.story);selection={kind:'room',id:roomId};panel='style';refresh();setTimeout(()=>document.querySelector('.matte-side-preview')?.closest('.section')?.scrollIntoView({block:'start'}),20);return;}
  if(meta?.kind==='opening'){const o=project.openings.find(o=>o.id===meta.id);if(o){st(itemStory(o));selection={kind:'opening',id:o.id};roomId=o.roomId||roomId;panel='selection';refresh();}return;}
  if(meta?.kind==='partition'){selectPartition(meta.id,meta.face||'A');return;}
  if(meta?.kind==='wall'){const w=C.roomWalls(project).find(w=>w.id===meta.id);if(w)selectWall(w,C.ownerFacing(w,v,project));return;}
  if(meta?.kind==='stairs'){const s=C.stairById(project,meta.id);if(s){st(s.story);selection={kind:'stairs',id:s.id};panel='selection';refresh();}return;}
  if(meta?.kind==='pillar'){const s=C.pillarById(project,meta.id);if(s){st(s.story||0);selection={kind:'pillar',id:s.id};panel='selection';refresh();}return;}
  if(meta?.kind==='floorSection'){const s=C.floorSectionById(project,meta.id);if(s){st(s.story||0);selection={kind:'floorsection',id:s.id};panel='selection';refresh();}return;}
  if(meta?.kind==='room'){const r=C.roomById(project,meta.id);if(r){st(r.story||0);roomId=r.id;selection={kind:'room',id:r.id};panel='room';refresh();}return;}
  if(currentView()&&!freeCam){selection={kind:'view',id:currentView().id};panel='selection';}refresh();
}
HOOKS.pointerDown.push((e,q)=>{
  // map: clicking the free-camera marker walks on from there
  if(active==='iso'&&freeCam&&mode==='build'&&tool==='select'&&e.button===0){const z=freeCam.floorZ??C.storyElevation(project,freeCam.story),o=C.isoPoint(project,freeCam,z);if((freeCam.story===activeStory||freeCam.onStair)&&Math.hypot(q.x-o.x,q.y-o.y)<12*mk()){enterFreeCam();return true;}}
  const t=fpTarget();if(!t||e.button!==0||tool==='asset'||tool==='prop')return false;fpGlide=null;
  const v=fpFrame(),meta=fpProbe(v,q).meta;
  if(meta?.kind==='prop'&&mode==='build')return false; /* 0.14: placed 3D objects take the click (select / drag) */
  if(meta?.kind==='object'){const o=project.objects.find(o=>o.id===meta.id);if(o&&!o.locked)return false;} // objects keep drag-to-move
  fpDrag={x:e.clientX,y:e.clientY,q,moved:false,start:poseOf(t),meta};return true;
});
canvas.addEventListener('pointerdown',e=>{if(e.button!==2)return;const t=fpTarget();if(!t)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);fpGlide=null;fpDrag={x:e.clientX,y:e.clientY,q:eventPoint(e),moved:false,start:poseOf(t),meta:null,right:true};});
HOOKS.pointerMove.push(e=>{
  if(!fpDrag)return false;const t=fpTarget();if(!t){fpDrag=null;return false;}
  const dx=e.clientX-fpDrag.x,dy=e.clientY-fpDrag.y;if(!fpDrag.moved&&Math.hypot(dx,dy)<4)return true;fpDrag.moved=true;
  const g=geometry(),v=fpFrame(),wpx=v.width*g.scale,hpx=v.height*g.scale,s=fpDrag.start;
  // grab the picture: drag right turns the view left, so what is under the cursor follows the cursor
  applyPose(t,{facing:s.facing-dx*s.fov/wpx,horizon:C.clamp(s.horizon+dy/hpx,.1,.9)},'Look around');fpShowHorizon=performance.now();canvas.style.cursor='grabbing';return true;
});
HOOKS.pointerUp.push(e=>{
  if(!fpDrag)return false;const d=fpDrag;fpDrag=null;canvas.style.cursor='';if(e&&canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);
  if(d.moved){if(!fpTarget()?.free)commitLive();else refresh();setTimeout(drawSoon,950);return true;}
  if(!d.right)fpClickSelect(d.q,d.meta);return true;
});
HOOKS.wheel.push(e=>{const t=fpTarget();if(!t||e.ctrlKey||e.metaKey)return false;const p=poseOf(t);applyPose(t,{fov:C.clamp(p.fov*Math.exp(C.clamp(e.deltaY,-240,240)*.0006),35,110)},'Change view angle');if(!t.free)scheduleCommit(550);return true;});
HOOKS.dblClick.push(e=>{
  if(mode!=='build')return false;
  if(active==='fp'){const t=fpTarget();if(!t)return false;const v=fpFrame(),pt=fpFloorPoint(v,eventPoint(e));if(!pt){toast('Double-click a visible floor point to step there.');return true;}glideTo(t,pt);return true;}
  if(active==='iso'&&tool==='select'){const q=eventPoint(e);if(project.viewpoints.some(v=>itemStory(v)===activeStory&&Math.hypot(q.x-nodePoint(v).x,q.y-nodePoint(v).y)<20*mk()))return false;
    const pt=C.isoInverse(project,q,C.storyElevation(project,activeStory));if(!C.inFloor(project,{...pt,story:activeStory},0,activeStory))return false;startFreeCamAt({x:pt.x,y:pt.y,story:activeStory});return true;}
  return false;
});
HOOKS.keyDown.push(e=>{
  if(e.ctrlKey||e.metaKey||e.altKey||!FP_CODES.has(e.code))return false;const t=fpTarget();if(!t)return false;e.preventDefault();fpShift=e.shiftKey;fpGlide=null;
  if(!fpKeys.has(e.code)){fpKeys.add(e.code);if(!fpLoopId){fpLastT=0;fpLoopId=requestAnimationFrame(fpTick);}}return true;
});
HOOKS.keyUp.push(e=>{fpShift=e.shiftKey;fpKeys.delete(e.code);return false;});
window.addEventListener('blur',()=>{fpKeys.clear();});

// ------------------------------------------------------------------ heads-up bar, guides, map marker
function updateFpHud(){
  const el=$('fpHud');if(!el)return;const t=fpTarget();if(!t){el.classList.add('hidden');fpHudKey='';return;}el.classList.remove('hidden');
  const p=poseOf(t),look=Math.round((.42-p.horizon)*100),from=t.free&&freeCam.fromViewId?project.viewpoints.find(v=>v.id===freeCam.fromViewId):null,back=from||(t.free?currentView():null);
  const read=`facing ${Math.round(C.norm(p.facing))}° · look ${look>0?'+':''}${look} · lens ${Math.round(p.fov)}° · eye ${fmt(p.eye)} ${unit()}`;
  const key=[t.free,t.v.id,t.v.name,from?.id,back?.id,fpGuides,t.free&&freeCam.onStair,t.free&&freeCam.story].join('|');
  if(key===fpHudKey){const r=el.querySelector('.read');if(r)r.textContent=read;return;}fpHudKey=key;
  const head=t.free?`<span class="tag free">FREE CAMERA</span><b>${freeCam.onStair?'On the stairs':esc(storyName(freeCam.story))}</b>`:`<span class="tag">EDITING VIEW</span><b>${esc(t.v.name)}</b>`;
  const btns=t.free?`<button class="primary" data-fp="save">Save as viewpoint</button>${from?`<button data-fp="move">Move “${esc(from.name)}” here</button>`:''}${back?`<button data-fp="back">Back to ${esc(back.name)}</button>`:''}`:`<button data-fp="free" title="Walk anywhere without changing this viewpoint">Walk freely from here</button>`;
  el.title='Drag = look around · W A S D = walk · ← → = turn · Q / E = lower / raise eye · mouse wheel = lens angle · Shift = faster · double-click floor = step there'+(t.free?' · the free camera climbs stairs':' · every change edits this viewpoint (Ctrl+Z undoes)');
  el.innerHTML=`<div class="row">${head}<span class="grow"></span><span class="read">${read}</span></div><div class="row">${btns}<span class="grow"></span><button data-fp="level" title="Look straight ahead: no up or down tilt">Level</button><button data-fp="guides" class="${fpGuides!=='off'?'active':''}" title="Rule-of-thirds lines and the eye-level line">Guides</button></div>`;
}
HOOKS.top.push(updateFpHud);
HOOKS.click.push((e,b)=>{
  const a=b.dataset.fp;if(!a)return false;const t=fpTarget();
  if(a==='save')saveFreeCam();else if(a==='move')moveViewToFreeCam();else if(a==='back')leaveFreeCam();
  else if(a==='free'){if(startFreeCam(currentView())){refresh();toast('Free camera: walk anywhere, even up stairs. The viewpoint stays where it was until you choose “Move … here”.',7000);}}
  else if(a==='level'&&t){applyPose(t,{horizon:.42},'Level view');if(!t.free)commitLive();}
  else if(a==='guides'){fpGuides=fpGuides==='off'?'thirds':'off';fpHudKey='';updateFpHud();drawSoon();}
  canvas.focus({preventScroll:true});return true;
});
HOOKS.action.push(name=>{if(name!=='free-camera')return false;if(mode==='test')return true;if(startFreeCam(currentView()))enterFreeCam();return true;});
function drawFPGuides(g,v){
  if(typeof routeFPOverlay==='function'&&mode==='route'){routeFPOverlay(g,v);return;}
  if(typeof propsFPOverlay==='function')propsFPOverlay(g,v);
  if(mode!=='build'||railRiding()||transitActive())return;const k=1/geometry().scale,W=v.width,H=v.height,hy=H*C.clamp(v.horizon??.42,.1,.9),recent=performance.now()-fpShowHorizon<900||fpDrag?.moved;
  if(fpGuides==='thirds'){g.save();g.strokeStyle='#ffffff45';g.lineWidth=k;g.beginPath();for(const f of [1/3,2/3]){g.moveTo(W*f,0);g.lineTo(W*f,H);g.moveTo(0,H*f);g.lineTo(W,H*f);}g.stroke();g.restore();}
  if(fpGuides!=='off'||recent){g.save();g.strokeStyle='#ffd27acc';g.setLineDash([10*k,8*k]);g.lineWidth=1.5*k;g.beginPath();g.moveTo(0,hy);g.lineTo(W,hy);g.stroke();g.setLineDash([]);g.font=`600 ${11*k}px Segoe UI`;g.fillStyle='#ffd27a';g.textAlign='left';g.fillText('eye level',8*k,hy-6*k);g.restore();}
}
HOOKS.drawGraph.push((g,k)=>{if(freeCam&&active==='iso'&&(freeCam.story===activeStory||freeCam.onStair))drawCamMarker(g,freeCam,k,'#ffd27a','Free camera');});
HOOKS.messages.push(()=>active==='fp'&&mode==='build'&&railRiding()?{select:'Riding the rail camera. Use the timeline to play, pause and scrub. ◇ Map returns to the map.'}:active==='fp'&&mode==='build'?{select:freeCam?'Free camera: drag to look, W A S D to walk (stairs work), wheel changes the lens. “Save as viewpoint” keeps this spot.':currentView()?'Editing this viewpoint directly: drag to look, wheel = lens, W A S D = move, Q / E = eye height. Click a wall, opening or object to select it.':'Place a viewpoint, or double-click floor on the map to walk there with the free camera.'}:active==='iso'&&mode==='build'&&tool==='select'?{select:'Select floor space to move it or resize its handles. Double-click any floor to stand there in first person.'}:{});
{const oldMini=$('mini').onclick;$('mini').onclick=e=>{if(mode!=='test'&&active==='iso'&&!currentView()&&freeCam){enterFreeCam();return;}oldMini(e);};}
EXT.fp={fpTarget,stepTo,startFreeCamAt,saveFreeCam,get freeCam(){return freeCam;},get keys(){return fpKeys;}};
