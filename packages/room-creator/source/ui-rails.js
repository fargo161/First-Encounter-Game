/* ===================== 0.13 · ui-rails.js =====================
   Rails: automatic camera routes, like a rail shooter. A rail is an ordered list of stops (placed
   viewpoints) and bend points. The camera glides between them on a walking path that goes around
   walls, through open doors and up stairs, speeds up and slows down gently, and turns to face each
   stop before it arrives. Test walk uses the same machinery so travelling between viewpoints glides
   instead of jumping. */
let railShowAll=true,railDrag=null,transit=null,railRec=null,railTLKey='';
const railPlay={id:null,t:0,playing:false,speed:1,ride:false,last:0,raf:0,test:false};
const planCacheUI={p:null,map:new Map()};
const railById=id=>(project.rails||[]).find(r=>r.id===id)||null;
function currentRail(){return selection?.kind==='rail'?railById(selection.id):null;}
function playingRail(){return railPlay.id?railById(railPlay.id):null;}
function planFor(rail,{fast=false}={}){
  if(!rail||!RR)return null;if(planCacheUI.p!==project){planCacheUI.p=project;planCacheUI.map.clear();}
  const r=fast?{...rail,autoPath:false}:rail,key=JSON.stringify(r);let pl=planCacheUI.map.get(key);
  if(!pl){try{pl=RR.railPlan(project,r);}catch(e){console.error(e);pl={rail:r,legs:[],timeline:[],duration:0,length:0,warnings:[{type:'error',reason:e.message}]};}planCacheUI.map.set(key,pl);if(planCacheUI.map.size>40)planCacheUI.map.delete(planCacheUI.map.keys().next().value);}
  return pl;
}
const fmtTime=t=>{t=Math.max(0,t||0);const m=Math.floor(t/60),s=t-m*60;return m+':'+(s<10?'0':'')+s.toFixed(1);};
function stopView(rail){const n=rail?.nodes.find(n=>n.kind==='stop');return n?project.viewpoints.find(v=>v.id===n.viewId):null;}
function poseToView(q,name='',w=1440,h=900){return {id:null,name,x:q.x,y:q.y,story:q.story,floorZ:q.z,facing:q.facing,fov:q.fov,eyeHeight:q.eye,horizon:q.horizon,width:w,height:h,role:'movement'};}
function railPose(rail){const pl=planFor(rail);if(!pl)return null;const q=RR.sampleRail(pl,railPlay.t);if(!q)return null;const sv=stopView(rail);return poseToView(q,rail.name+' · '+fmtTime(railPlay.t),sv?.width||1440,sv?.height||900);}
// ------------------------------------------------------------------ what other modules ask
function railRidePose(){if(!railPlay.id||!railPlay.ride||active!=='fp')return null;const r=playingRail();return r?railPose(r):null;}
function railRiding(){return !!railRidePose();}
function railPreviewView(){if(active!=='iso')return null;const r=playingRail()||currentRail();if(!r||(!railPlay.id&&!railPlay.t))return null;if(railPlay.id&&railPlay.id!==r.id)return null;const v=railPose(r);if(v)v.name='Rail preview · '+r.name+' · '+fmtTime(railPlay.t)+' · click to ride';return v;}
function transitActive(){return !!transit;}
function transitPose(){if(!transit)return null;const q=RR.sampleRail(transit.plan,(performance.now()-transit.t0)/1000);return q?poseToView(q,'Travelling to '+transit.toName,transit.w,transit.h):null;}
function startTransit(from,to,done){
  if(!RR||!from||!to)return false;let plan;
  try{plan=RR.transitPlan(project,from,to,{speed:2.6});if(plan.duration>5)plan=RR.transitPlan(project,from,to,{speed:Math.min(40,2.6*plan.duration/5)});}catch(e){console.error(e);return false;}
  if(!plan||!(plan.duration>0)||plan.warnings.some(w=>w.type==='nopath'||w.type==='error'))return false;
  transit={plan,t0:performance.now(),done,toName:to.name,w:to.width||1440,h:to.height||900};lastProbe=null;updateTop();
  const tick=()=>{if(!transit)return;if((performance.now()-transit.t0)/1000>=transit.plan.duration){const d=transit.done;transit=null;d();return;}draw();requestAnimationFrame(tick);};requestAnimationFrame(tick);return true;
}
function stopTransit(){transit=null;}
function stopRail(){cancelAnimationFrame(railPlay.raf);Object.assign(railPlay,{id:null,t:0,playing:false,ride:false,raf:0,test:false});railTLKey='';updateTimeline();}
// ------------------------------------------------------------------ playback
function playRail(id,{ride=null,from=null}={}){
  const r=railById(id);if(!r)return;const pl=planFor(r);if(!pl||!(pl.duration>0)){toast(pl?.warnings?.[0]?.reason||'Add at least two points to this rail.');return;}
  if(railPlay.id!==id){railPlay.t=0;railPlay.id=id;}if(from!==null)railPlay.t=from;if(railPlay.t>=pl.duration-1e-3)railPlay.t=0;
  if(ride!==null&&ride!==railPlay.ride){railPlay.ride=ride;if(ride){if(active==='iso')rememberMap();active='fp';fit();}else if(active==='fp'){active='iso';if(!restoreMap())fit();}}
  railPlay.playing=true;railPlay.last=performance.now();cancelAnimationFrame(railPlay.raf);railPlay.raf=requestAnimationFrame(railTick);refresh();
}
function pauseRail(){railPlay.playing=false;cancelAnimationFrame(railPlay.raf);updateTimeline();drawSoon();}
function railTick(now){
  railPlay.raf=0;if(!railPlay.playing)return;const r=playingRail();if(!r){stopRail();return;}const pl=planFor(r);
  const dt=Math.min(.25,(now-railPlay.last)/1000);railPlay.last=now;railPlay.t+=dt*railPlay.speed;
  if(railPlay.t>=pl.duration){if(r.loop&&pl.duration>0)railPlay.t%=pl.duration;else{railPlay.t=pl.duration;railPlay.playing=false;railEnded(r,pl);}}
  updateTimeline(true);draw();if(railPlay.playing)railPlay.raf=requestAnimationFrame(railTick);
}
function railEnded(r){
  if(mode==='test'&&railPlay.test){const last=[...r.nodes].reverse().find(n=>n.kind==='stop'),v=last&&project.viewpoints.find(q=>q.id===last.viewId);stopRail();if(v)travelNow(v.id);else refresh();toast('Ride finished'+(v?' at '+v.name:'')+'.');return;}
  updateTimeline();
}
function toggleRide(){const r=playingRail()||currentRail();if(!r)return;if(railPlay.ride&&active==='fp'){railPlay.ride=false;active='iso';if(!restoreMap())fit();refresh();return;}if(railPlay.id!==r.id){railPlay.id=r.id;railPlay.t=0;}railPlay.ride=true;if(active==='iso')rememberMap();active='fp';fit();refresh();}
// ------------------------------------------------------------------ timeline bar
function updateTimeline(fast=false){
  const el=$('timeline');if(!el)return;const r=playingRail()||(mode==='build'?currentRail():null);
  if(!r||(mode==='test'&&!railPlay.id)){el.classList.add('hidden');railTLKey='';return;}
  const pl=planFor(r),dur=pl?.duration||0;
  const key=[r.id,r.name,dur.toFixed(3),railPlay.playing,railPlay.ride,active,railPlay.speed,mode,JSON.stringify(pl?.timeline?.filter(s=>s.type==='hold').map(s=>s.t0.toFixed(2)))].join('|');
  el.classList.remove('hidden');
  if(fast&&key===railTLKey){const s=el.querySelector('[data-tl-scrub]');if(s)s.value=railPlay.t;const tt=el.querySelector('.tl-time');if(tt)tt.textContent=fmtTime(railPlay.t)+' / '+fmtTime(dur);return;}
  if(key===railTLKey){const s=el.querySelector('[data-tl-scrub]');if(s)s.value=railPlay.t;const tt=el.querySelector('.tl-time');if(tt)tt.textContent=fmtTime(railPlay.t)+' / '+fmtTime(dur);return;}
  railTLKey=key;const stops=(pl?.timeline||[]).filter(s=>s.type==='hold').map(s=>`<i class="tl-stop" style="left:${dur?s.t0/dur*100:0}%" title="${esc(s.pose.name||'stop')}"></i>`).join('');
  el.innerHTML=`<button data-tl="play" class="primary" title="Play / pause">${railPlay.playing?'❚❚':'▶'}</button><button data-tl="start" title="Back to the start">⏮</button><span class="tl-name" title="${esc(r.name)}">⟿ ${esc(r.name)}</span><div class="tl-track">${stops}<input type="range" data-tl-scrub min="0" max="${dur.toFixed(3)}" step="0.01" value="${Math.min(railPlay.t,dur)}" aria-label="Rail time"></div><span class="tl-time">${fmtTime(railPlay.t)} / ${fmtTime(dur)}</span><select data-tl-speed title="Playback speed">${[.25,.5,1,2,4].map(s=>`<option value="${s}" ${s===railPlay.speed?'selected':''}>${s}×</option>`).join('')}</select><button data-tl="ride" title="Watch through the camera in first person">${railPlay.ride&&active==='fp'?'◇ Map':'◈ Ride'}</button>${mode==='build'?'<button data-tl="export" title="Export a video, still frames or the camera path">⤓</button>':''}<button data-tl="close" title="Close the timeline">×</button>`;
}
HOOKS.top.push(()=>updateTimeline());
document.addEventListener('input',e=>{if(e.target.matches?.('[data-tl-scrub]')){const r=playingRail()||currentRail();if(!r)return;railPlay.id=r.id;railPlay.playing=false;railPlay.t=Number(e.target.value)||0;updateTimeline(true);drawSoon();}});
document.addEventListener('change',e=>{if(e.target.matches?.('[data-tl-speed]')){railPlay.speed=Number(e.target.value)||1;railPlay.last=performance.now();updateTimeline();}});
// ------------------------------------------------------------------ Rails tab, inspector form
function railSummary(r){const pl=planFor(r),stops=r.nodes.filter(n=>n.kind==='stop').length,bends=r.nodes.length-stops;return {pl,text:`${stops} stop${stops===1?'':'s'}${bends?` · ${bends} bend${bends===1?'':'s'}`:''} · ${fmt(pl?.length||0,1)} ${unit()} · ${fmtTime(pl?.duration||0)}`};}
function railsPane(){
  const rails=project.rails||[],cur=currentRail();
  return `<div class="section"><div class="row"><h2 class="grow">Rails</h2><span class="badge">${rails.length}</span></div><p>A rail is an automatic camera route, like a rail shooter: the camera glides from viewpoint to viewpoint, walks around walls and through open doors, climbs stairs, and turns smoothly to face each stop.</p><button class="primary block" data-rail-act="new">+ New rail</button>
    ${rails.map(r=>{const s=railSummary(r);return `<button class="list-card ${cur?.id===r.id?'active':''}" data-rail="${r.id}"><span><strong>⟿ ${esc(r.name)}${r.loop?' · loop':''}</strong><small>${esc(s.text)}${s.pl?.warnings?.length?' · ⚠ '+s.pl.warnings.length:''}</small></span></button>`;}).join('')||'<p class="empty-story-note">No rails yet.</p>'}
    <label class="check" style="margin-top:10px"><input type="checkbox" id="railShowAll" ${railShowAll?'checked':''}>Show every rail on the map (the selected one is brighter)</label></div>
    <div class="section"><h3>How to build one</h3><p>1. Place viewpoints where the camera should stop (Views tab, or walk there with the free camera and press Save as viewpoint).</p><p>2. Select a rail, pick the <b>⟿ Rail</b> tool and click viewpoint markers in order. Click empty floor to add a bend point; Shift-click near the path to insert one.</p><p>3. Press ▶ on the timeline to watch it on the map, or <b>◈ Ride</b> to see it in first person.</p><p>To reach another story the path needs stairs between the stories.</p></div>`;
}
function railNum(label,key,value,min,max,step,{len=false,title=''}={}){const v=len?fmt(value,3):value;return `<label ${title?`title="${esc(title)}"`:''}>${esc(label)}${len?' ('+unit()+')':''}<input type="number" data-rail-field="${key}" ${len?'data-len="1"':''} min="${len?fmt(min,3):min}" max="${len?fmt(max,3):max}" step="${step}" value="${v}"></label>`;}
function railForm(r){
  const s=railSummary(r),pl=s.pl,warn=(pl?.warnings||[]).map(w=>`<div class="rail-warn">⚠ ${esc(w.reason)}</div>`).join('');
  const nodes=r.nodes.map((n,i)=>{const v=n.kind==='stop'?project.viewpoints.find(q=>q.id===n.viewId):null,label=n.kind==='stop'?(v?.name||'missing viewpoint'):'Bend · '+storyName(n.story||0);
    return `<div class="rail-node" data-rail-node-row="${n.id}"><div class="rn-top"><b>${i+1}</b><span class="grow" title="${esc(label)}">${n.kind==='stop'?'●':'◆'} ${esc(label)}</span><button data-node-act="up" data-node-id="${n.id}" ${i?'':'disabled'} title="Move earlier">↑</button><button data-node-act="down" data-node-id="${n.id}" ${i<r.nodes.length-1?'':'disabled'} title="Move later">↓</button><button data-node-act="del" data-node-id="${n.id}" title="Remove this point">×</button></div><div class="rn-bottom">${n.kind==='stop'?`<label title="Seconds to pause here (blank = the rail’s setting)">pause <input type="number" data-rail-node="${n.id}" data-node-field="hold" min="0" max="120" step="0.1" placeholder="${r.hold}" value="${n.hold??''}"> s</label>`:''}<label title="Speed leaving this point (blank = the rail’s setting)">speed <input type="number" data-rail-node="${n.id}" data-node-field="speed" min="0.2" max="40" step="0.1" placeholder="${fmt(r.speed,1)}" value="${n.speed!=null?fmt(n.speed,2):''}"> ${unit()}/s</label></div></div>`;}).join('');
  return `<section class="section"><span class="eyebrow">Rail · automatic camera route</span><label>Rail name<input type="text" data-rail-field="name" value="${esc(r.name)}" maxlength="80"></label><div class="info" style="margin-top:8px">${esc(s.text)}</div>${warn}
    <div class="button-row"><button class="primary" data-rail-act="tool">⟿ Add points on the map</button><button data-rail-act="play">${railPlay.playing&&railPlay.id===r.id?'❚❚ Pause':'▶ Play'}</button><button data-rail-act="ride">◈ Ride in first person</button></div></section>
    <section class="section"><h3>Movement</h3><div class="form-grid">${railNum('Speed ('+unit()+'/s)','speed',C.round(C.toDisplay(r.speed,project.units),2),.2,40,.1,{title:'Cruising speed between points. Walking ≈ 1.4 m/s, jogging ≈ 3, running ≈ 5.'})}${railNum('Pause at stops (s)','hold',r.hold,0,120,.1,{title:'How long the camera waits at each stop'})}${railNum('Speed-up / slow-down','ease',r.ease,0,20,.1,{len:true,title:'Distance used to accelerate after a stop and to brake before the next one'})}${railNum('Corner rounding','corner',r.corner,0,6,.1,{len:true,title:'Bigger = wider, smoother curves at corners and doors'})}${railNum('Look ahead','lookAhead',r.lookAhead,0,20,.1,{len:true,title:'How far ahead the camera aims while moving. Bigger = calmer turning'})}${railNum('Turn to face stops over','turnDistance',r.turnDistance,0,30,.1,{len:true,title:'Distance over which the camera swings round to the stop’s view direction'})}</div>
      <label class="check"><input type="checkbox" data-rail-field="autoPath" ${r.autoPath?'checked':''}>Find a walking path around walls (off = straight lines)</label><label class="check"><input type="checkbox" data-rail-field="loop" ${r.loop?'checked':''}>Loop back to the first point</label></section>
    <section class="section"><h3>Points · ${r.nodes.length}</h3><p class="subtle">● stop = a placed viewpoint (the camera pauses and looks where it looks). ◆ bend = a point the path must pass through.</p>${nodes||'<p>No points yet. Choose “Add points on the map”.</p>'}</section>
    <section class="section"><div class="button-row"><button data-rail-act="export">Export video / frames / path…</button><button data-rail-act="duplicate">Duplicate</button><button class="danger" data-rail-act="delete">Delete rail…</button></div></section>`;
}
function selectRail(id){const r=railById(id);if(!r)return;selection={kind:'rail',id};panel='selection';if(railPlay.id!==id&&!railPlay.playing){railPlay.id=id;railPlay.t=0;railPlay.ride=false;}refresh();}
function newRail(){let made=null;if(mutate(()=>{const names=new Set(project.rails.map(r=>r.name));let n=project.rails.length+1;while(names.has('Rail '+n))n++;const r=RR.newRail('Rail '+n);project.rails.push(r);made=r.id;selection={kind:'rail',id:r.id};panel='selection';},'New rail')){railPlay.id=made;railPlay.t=0;setTool('rail');}}
function railToolAllowed(){if(mode==='test')return false;if(!(project.rails||[]).length){newRail();return false;}if(!currentRail()){selection={kind:'rail',id:(railPlay.id&&railById(railPlay.id)?railPlay.id:project.rails[0].id)};panel='selection';}return true;}
function editRail(fn,label='Edit rail'){const r=currentRail();if(!r){toast('Select a rail first.');return false;}const id=r.id;return mutate(()=>fn(railById(id)),label);}
HOOKS.click.push((e,b)=>{
  if(b.dataset.rail){selectRail(b.dataset.rail);return true;}
  const ta=b.dataset.tl;if(ta){const r=playingRail()||currentRail();if(!r)return true;
    if(ta==='play'){if(railPlay.playing)pauseRail();else playRail(r.id);}else if(ta==='start'){railPlay.id=r.id;railPlay.t=0;updateTimeline(true);drawSoon();}
    else if(ta==='ride')toggleRide();else if(ta==='export')showRailExport(r);else if(ta==='close'){const was=railPlay.ride&&active==='fp';if(selection?.kind==='rail'){selection=null;panel='selection';}if(tool==='rail')tool='select';stopRail();if(was){active='iso';if(!restoreMap())fit();}refresh();}
    return true;}
  if(b.dataset.nodeAct){const id=b.dataset.nodeId,a=b.dataset.nodeAct;editRail(r=>{const i=r.nodes.findIndex(n=>n.id===id);if(i<0)return;if(a==='del')r.nodes.splice(i,1);else{const j=a==='up'?i-1:i+1;if(j<0||j>=r.nodes.length)return;[r.nodes[i],r.nodes[j]]=[r.nodes[j],r.nodes[i]];}},a==='del'?'Remove rail point':'Reorder rail points');return true;}
  const a=b.dataset.railAct;if(!a)return false;const r=currentRail();
  if(a==='new')newRail();
  else if(a==='tool')setTool('rail');
  else if(a==='play'&&r){if(railPlay.playing&&railPlay.id===r.id)pauseRail();else playRail(r.id);renderInspector();}
  else if(a==='ride'&&r){railPlay.id=r.id;if(!railPlay.playing&&railPlay.t>=(planFor(r)?.duration||0)-1e-3)railPlay.t=0;playRail(r.id,{ride:true});}
  else if(a==='export'&&r)showRailExport(r);
  else if(a==='duplicate'&&r){let id=null;if(mutate(()=>{const c=C.clone(r);c.id=C.uid('rail');c.name=r.name+' copy';c.nodes=c.nodes.map(n=>({...n,id:C.uid('rnode')}));project.rails.push(c);id=c.id;selection={kind:'rail',id};panel='selection';},'Duplicate rail'))railPlay.id=id;}
  else if(a==='delete'&&r)ask('Delete '+r.name+'?','The viewpoints it visits are kept. Undo brings the rail back.',()=>{if(mutate(()=>{project.rails=project.rails.filter(x=>x.id!==r.id);selection=null;panel='selection';},'Delete rail')&&railPlay.id===r.id)stopRail();},'Delete rail');
  else if(a.startsWith('ride-test:')){const id=a.slice(10);startTestRide(id);}
  return true;
});
HOOKS.action.push(name=>{if(name==='rail-export'){const r=currentRail()||project.rails[0];closeModal();if(r)showRailExport(r);else toast('Make a rail first (Rails tab).');return true;}return false;});
document.addEventListener('change',e=>{const el=e.target;
  if(el.id==='railShowAll'){railShowAll=el.checked;drawSoon();return;}
  if(el.matches?.('[data-rail-field]')){const k=el.dataset.railField;let v=el.type==='checkbox'?el.checked:el.type==='text'?el.value:Number(el.value);if(el.type==='number'){if(!Number.isFinite(v))return;if(el.dataset.len)v=parseLength(v);if(k==='speed')v=C.fromDisplay(v,project.units);}editRail(r=>{r[k]=v;},'Edit rail '+k);return;}
  if(el.matches?.('[data-node-field]')){const id=el.dataset.railNode,k=el.dataset.nodeField;let v=el.value===''?null:Number(el.value);if(v!==null&&!Number.isFinite(v))return;if(v!==null&&k==='speed')v=C.fromDisplay(v,project.units);editRail(r=>{const n=r.nodes.find(n=>n.id===id);if(n)n[k]=v;},'Edit rail point');}
});
// ------------------------------------------------------------------ map: drawing
function nodeFramePoint(n){if(n.kind==='stop'){const v=project.viewpoints.find(q=>q.id===n.viewId);return v?{q:C.isoPoint(project,v,v.floorZ||C.storyElevation(project,v.story||0)),story:v.story||0}:null;}return {q:C.isoPoint(project,{x:n.x,y:n.y},C.storyElevation(project,n.story||0)),story:n.story||0};}
function drawRailPath(g,k,rail,pl,bright){
  if(!pl?.legs?.length)return;const P=(x,y,z)=>C.isoPoint(project,{x,y},z),hasWarn=pl.warnings.length>0,col=hasWarn?'#f0a46e':'#7fd6a3';
  g.save();g.lineCap='round';g.lineJoin='round';
  for(const leg of pl.legs){const rs=leg.rs;if(!rs)continue;const step=Math.max(1,Math.floor(rs.n/500));let run=null;
    const flush=()=>{if(!run||run.pts.length<2)return;g.beginPath();run.pts.forEach((q,i)=>i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y));g.setLineDash(run.on?[]:[6*k,6*k]);g.strokeStyle=col+(bright?(run.on?'':'70'):(run.on?'66':'2a'));g.lineWidth=(bright?(run.on?3.4:2):1.6)*k;g.stroke();};
    for(let i=0;;i=Math.min(rs.n,i+step)){const on=rs.st[i]===activeStory,q=P(rs.xs[i],rs.ys[i],rs.zs[i]);if(!run||run.on!==on){const last=run?.pts[run.pts.length-1];flush();run={on,pts:last?[last]:[]};}run.pts.push(q);if(i>=rs.n)break;}flush();
    if(bright){const every=Math.max(1,Math.round(7/(rs.L/Math.max(1,rs.n))));g.setLineDash([]);g.fillStyle=col;for(let i=every;i<rs.n-2;i+=every){if(rs.st[i]!==activeStory)continue;const a=P(rs.xs[i],rs.ys[i],rs.zs[i]),b2=P(rs.xs[i+2],rs.ys[i+2],rs.zs[i+2]),ang=Math.atan2(b2.y-a.y,b2.x-a.x),s=6*k;g.beginPath();g.moveTo(a.x+Math.cos(ang)*s,a.y+Math.sin(ang)*s);g.lineTo(a.x+Math.cos(ang+2.5)*s,a.y+Math.sin(ang+2.5)*s);g.lineTo(a.x+Math.cos(ang-2.5)*s,a.y+Math.sin(ang-2.5)*s);g.closePath();g.fill();}}
  }
  g.restore();
}
function railsToDraw(){const cur=currentRail(),play=playingRail(),list=[];for(const r of project.rails||[]){const bright=r.id===cur?.id||r.id===play?.id;if(bright||railShowAll)list.push({r,bright});}return list;}
HOOKS.underGraph.push((g,k)=>{
  if(active==='fp'&&!railRiding())return; // the small map beside first person stays quick
  for(const {r,bright} of railsToDraw()){const pl=railDrag&&railDrag.railId===r.id?planFor(r,{fast:true}):planFor(r);drawRailPath(g,k,r,pl,bright);}
});
HOOKS.drawGraph.push((g,k)=>{
  const cur=currentRail();
  if(cur&&active==='iso'){g.save();cur.nodes.forEach((n,i)=>{const p=nodeFramePoint(n);if(!p)return;const on=p.story===activeStory;g.globalAlpha=on?1:.45;
      if(n.kind==='stop'){const x=p.q.x-15*k,y=p.q.y-15*k;g.fillStyle='#173b2b';g.strokeStyle='#7fd6a3';g.lineWidth=1.6*k;g.beginPath();g.arc(x,y,8.5*k,0,Math.PI*2);g.fill();g.stroke();g.fillStyle='#bff5d4';g.font=`bold ${9*k}px Segoe UI`;g.textAlign='center';g.fillText(String(i+1),x,y+3.2*k);}
      else{const s=6.5*k,x=p.q.x,y=p.q.y;g.fillStyle=railDrag?.nodeId===n.id?'#ffffff':'#7fd6a3';g.strokeStyle='#10261c';g.lineWidth=1.5*k;g.beginPath();g.moveTo(x,y-s);g.lineTo(x+s,y);g.lineTo(x,y+s);g.lineTo(x-s,y);g.closePath();g.fill();g.stroke();g.fillStyle='#bff5d4';g.font=`${8.5*k}px Segoe UI`;g.textAlign='left';g.fillText(String(i+1),x+8*k,y-6*k);}});g.restore();}
  const pr=playingRail()||cur;if(pr&&active==='iso'&&(railPlay.id===pr.id)&&(railPlay.t>0||railPlay.playing)){const v=railPose(pr);if(v&&(v.story===activeStory||Math.abs((v.floorZ||0)-C.storyElevation(project,activeStory))<project.storyHeight))drawCamMarker(g,v,k,'#7fd6a3','');}
});
// ------------------------------------------------------------------ map: the Rail tool and dragging bend points
function railNodeHit(r,q){const k=mk();for(let i=r.nodes.length-1;i>=0;i--){const n=r.nodes[i],p=nodeFramePoint(n);if(!p||p.story!==activeStory)continue;const pt=n.kind==='stop'?{x:p.q.x-15*k,y:p.q.y-15*k}:p.q;if(Math.hypot(q.x-pt.x,q.y-pt.y)<10*k)return n;}return null;}
function nearestLegIndex(r,floor){ // where a Shift-click bend should go: between the two points whose straight line passes closest
  let best=r.nodes.length,bd=Infinity;const pos=n=>n.kind==='stop'?project.viewpoints.find(v=>v.id===n.viewId):n;
  for(let i=1;i<r.nodes.length;i++){const a=pos(r.nodes[i-1]),b=pos(r.nodes[i]);if(!a||!b)continue;const dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy,t=L?C.clamp(((floor.x-a.x)*dx+(floor.y-a.y)*dy)/L,0,1):0,d=Math.hypot(floor.x-a.x-dx*t,floor.y-a.y-dy*t);if(d<bd){bd=d;best=i;}}return best;}
HOOKS.pointerDown.push((e,q)=>{
  if(active!=='iso'||mode!=='build'||e.button!==0)return false;const r=currentRail();if(!r)return false;
  const hit=railNodeHit(r,q);
  if(hit&&e.altKey&&tool==='rail'){editRail(rr=>{rr.nodes=rr.nodes.filter(n=>n.id!==hit.id);},'Remove rail point');return true;}
  if(hit&&hit.kind==='via'&&(tool==='rail'||tool==='select')){railDrag={railId:r.id,nodeId:hit.id,before:capture(),moved:false,start:{x:e.clientX,y:e.clientY}};return true;}
  if(tool!=='rail')return false;
  const view=project.viewpoints.filter(v=>itemStory(v)===activeStory).reverse().find(v=>Math.hypot(q.x-nodePoint(v).x,q.y-nodePoint(v).y)<19*mk());
  if(view){const last=r.nodes[r.nodes.length-1];if(last?.kind==='stop'&&last.viewId===view.id){toast('That viewpoint is already the last stop.');return true;}editRail(rr=>{rr.nodes.push(RR.stopNode(view.id));},'Add rail stop');return true;}
  const floor=snapPoint(C.isoInverse(project,q,C.storyElevation(project,activeStory)));
  if(!C.inFloor(project,{...floor,story:activeStory},0,activeStory)){toast('Bend points must be on floor. Click a viewpoint marker to add a stop.');return true;}
  if(!r.nodes.length){toast('Start a rail at a viewpoint: click a viewpoint marker first.',5000);return true;}
  editRail(rr=>{const n=RR.viaNode(floor,activeStory);if(e.shiftKey&&rr.nodes.length>1)rr.nodes.splice(nearestLegIndex(rr,floor),0,n);else rr.nodes.push(n);},'Add rail bend');return true;
});
HOOKS.pointerMove.push(e=>{
  if(!railDrag)return false;if(!railDrag.moved&&Math.hypot(e.clientX-railDrag.start.x,e.clientY-railDrag.start.y)<3)return true;railDrag.moved=true;
  const r=railById(railDrag.railId),n=r?.nodes.find(n=>n.id===railDrag.nodeId);if(!n){railDrag=null;return true;}
  const floor=snapPoint(C.isoInverse(project,eventPoint(e),C.storyElevation(project,n.story||0)));if(C.inFloor(project,{...floor,story:n.story||0},0,n.story||0)){n.x=floor.x;n.y=floor.y;}drawSoon();return true;
});
HOOKS.pointerUp.push(e=>{
  if(!railDrag)return false;const d=railDrag;railDrag=null;if(e&&canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);
  if(!d.moved){selection={kind:'rail',id:d.railId};panel='selection';refresh();return true;}
  try{const valid=C.validateBundle({project,assets:[...catalog.values()]});project=valid.project;pushHistory(d.before,'Move rail bend');}catch(err){project=d.before.project;toast(err.message,6000);}refresh();return true;
});
HOOKS.keyDown.push(e=>{
  if(tool==='rail'&&mode==='build'&&(e.key==='Backspace'||e.key==='Delete')){e.preventDefault();const r=currentRail();if(r?.nodes.length)editRail(rr=>{rr.nodes.pop();},'Remove last rail point');return true;}
  if(tool==='rail'&&e.key==='Enter'){setTool('select');return true;}
  if(e.code==='Space'&&railPlay.id&&(railRiding()||mode==='test')){e.preventDefault();if(railPlay.playing)pauseRail();else playRail(railPlay.id);return true;}
  return false;
});
HOOKS.messages.push(()=>({rail:currentRail()?`Building “${currentRail().name}”: click viewpoint markers in order to add stops. Click empty floor for a bend; Shift-click near the path to insert one. Drag bends to move them. Alt-click a point to remove it, Backspace removes the last. Enter when done.`:'Choose a rail in the Rails tab, or press New rail.'}));
// clicking the rail preview beside the map rides it
{const prevMini=$('mini').onclick;$('mini').onclick=e=>{if(mode!=='test'&&active==='iso'&&railPreviewView()){toggleRide();return;}prevMini(e);};}
// ------------------------------------------------------------------ test walk: ride rails
function testRailsSection(){
  const rails=(project.rails||[]).filter(r=>(planFor(r)?.duration||0)>0);if(!rails.length)return '';
  return `<div class="section"><h3>Rails · automatic routes</h3>${rails.map(r=>`<button class="route-button" data-rail-act="ride-test:${r.id}">▶ Ride ${esc(r.name)}<small>${esc(railSummary(r).text)}</small></button>`).join('')}</div>`;
}
function startTestRide(id){const r=railById(id);if(!r)return;stopTransit();railPlay.test=true;railPlay.id=id;railPlay.t=0;railPlay.ride=true;active='fp';playRail(id,{from:0});}
HOOKS.top.push(()=>{if(mode==='test'&&railPlay.id&&railPlay.ride){$('stageTitle').innerHTML=`<b>Riding ${esc(playingRail()?.name||'')}</b><small>Space pauses · the timeline below scrubs</small>`;}else if(mode==='build'&&railRiding()){$('stageTitle').innerHTML=`<b>Riding ${esc(playingRail()?.name||'')}</b><small>Watching through the rail camera · ◇ Map returns to the map</small>`;}else if(transit){$('stageTitle').innerHTML=`<b>Travelling to ${esc(transit.toName)}</b><small>Following the walking path</small>`;}});
// ------------------------------------------------------------------ exports
function showRailExport(r){
  const pl=planFor(r);if(!pl||!(pl.duration>0)){toast('This rail needs at least two points before it can be exported.');return;}
  const sv=stopView(r),ar=(sv?.width||1440)/(sv?.height||900),sizes=[640,960,1280,1920].map(w=>[w,Math.round(w/ar/2)*2]);
  modal(`${modalTitle('Export '+r.name)}<p>${esc(railSummary(r).text)}</p>
    <div class="form-grid"><label>Picture size<select id="railExpSize">${sizes.map(([w,h])=>`<option value="${w}x${h}" ${w===1280?'selected':''}>${w} × ${h}</option>`).join('')}</select></label><label>Frames per second<select id="railExpFps"><option>12</option><option>24</option><option selected>30</option><option>60</option></select></label></div>
    <div class="button-row"><button class="primary" id="railExpVideo">Video (.webm)</button><button id="railExpFrames">Still frames (.zip of JPEGs)</button><button id="railExpJson">Camera path (.json)</button></div>
    <p class="subtle">Video records while the rail plays in real time, so a slow computer gives a choppier video. Still frames are rendered one by one and are always exact — any video editor can join them. The camera path lists the position, height, direction, lens and look up/down for every frame, for use in the game.</p><div id="railExpProgress" class="info hidden"></div><div class="button-row"><button data-action="close-modal">Close</button></div>`);
  const opts=()=>{const [w,h]=$('railExpSize').value.split('x').map(Number);return {w,h,fps:Number($('railExpFps').value)};};
  $('railExpJson').onclick=()=>{const {fps}=opts(),frames=RR.exportFrames(pl,fps);download(new Blob([JSON.stringify({format:'trapstar-rail-path',version:1,rail:{id:r.id,name:r.name,loop:r.loop},units:'m',fps,duration:+pl.duration.toFixed(4),stops:RR.stopTimes(pl),frames},null,1)],{type:'application/json'}),safeName(r.name)+' · camera path.json');toast(frames.length+' camera frames exported.');};
  $('railExpFrames').onclick=()=>exportRailFrames(r,pl,opts());$('railExpVideo').onclick=()=>recordRailVideo(r,pl,opts());
}
function railProgress(text){const el=$('railExpProgress');if(el){el.classList.remove('hidden');el.textContent=text;}}
async function exportRailFrames(r,pl,{w,h,fps}){
  if(!GLE){toast('Still frames need the graphics-card renderer.');return;}const n=Math.max(1,Math.ceil(pl.duration*fps)),files=[],c=document.createElement('canvas');
  for(let i=0;i<=n;i++){const q=RR.sampleRail(pl,i/fps),v=poseToView(q,'',w,h);GLE.renderFPToCanvas(project,GLE.camFromView(project,v,{aspect:w/h}),w,h,c);const blob=await new Promise(res=>c.toBlob(res,'image/jpeg',.9));files.push({name:`${safeName(r.name)}_${String(i).padStart(5,'0')}.jpg`,data:new Uint8Array(await blob.arrayBuffer())});if(i%5===0){railProgress(`Rendering frame ${i} of ${n}…`);await new Promise(res=>setTimeout(res,0));}}
  railProgress(`${files.length} frames ready.`);download(makeZip(files),safeName(r.name)+` · ${fps}fps frames.zip`);
}
async function recordRailVideo(r,pl,{w,h,fps}){
  if(!GLE){toast('Video needs the graphics-card renderer.');return;}if(typeof MediaRecorder==='undefined'){toast('This browser cannot record video. Use Still frames instead.');return;}
  const mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));if(!mime){toast('This browser cannot record WebM video. Use Still frames instead.');return;}
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),tmp=document.createElement('canvas'),stream=c.captureStream(fps),rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:Math.round(w*h*fps*.12)}),chunks=[];
  rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};const stopped=new Promise(res=>rec.onstop=res);
  const frame=t=>{const v=poseToView(RR.sampleRail(pl,Math.min(t,pl.duration)),'',w,h);GLE.renderFPToCanvas(project,GLE.camFromView(project,v,{aspect:w/h}),w,h,tmp);g.drawImage(tmp,0,0);};
  frame(0);rec.start(250);const t0=performance.now();railRec={cancel:false};
  await new Promise(res=>{const step=()=>{const t=(performance.now()-t0)/1000;frame(t);railProgress(`Recording ${fmtTime(Math.min(t,pl.duration))} of ${fmtTime(pl.duration)}…`);if(t>=pl.duration+.25||railRec.cancel||!$('railExpProgress')){res();return;}requestAnimationFrame(step);};step();});
  rec.stop();await stopped;railRec=null;const blob=new Blob(chunks,{type:'video/webm'});railProgress(`Video ready · ${(blob.size/1048576).toFixed(1)} MB.`);download(blob,safeName(r.name)+'.webm');
}
EXT.rails={planFor,playRail,pauseRail,stopRail,railPose,startTestRide,newRail,get play(){return railPlay;},get transit(){return transit;}};
