/* ===================== 0.13.1 · ui-route.js — ROUTE WALK PROTOTYPE =====================
   Tests Trapstar's route-based movement (design doc: "Routing, Player Movement, NPC Lanes…").
   - The player walks an authored route network: forward / back, a narrow strafe band, limited look,
     a deliberate turn-around, branch choice at junctions (look toward a branch and walk), and branches
     that a closed door blocks.
   - NPCs walk parallel lanes, use shared nodes with strict occupancy, gather in a zone, and only appear or
     leave where the player cannot see (corners, doors, far route ends).
   - NPCs are placeholder cards: FRONT, 3/4 and BACK (SIDE only as a diagnostic) with "rubber-band"
     rotation toward the camera, hysteresis against flicker, and an independent head.
   - Every hidden decision is drawn by the debug overlay and counted in the stats panel.
   Nothing here edits the project: door changes made while walking are put back when you leave. */
const RW_DEFAULTS={strafe:.7,branchCone:40,lookYaw:95,lookUp:30,lookDown:35,turnTime:.4,walk:1.45,back:.9,strafeSpeed:1.1,sprint:2.6,stamina:3.5,fov:75,eye:1.62,crouchEye:1.05,
  rubber:25,tolerance:18,hysteresis:12,nearHyst:true,headMax:65,headRubber:35,distCheat:true,allowSide:false,allowBackQ:false,debug:2,bob:true,noticeDist:70,mouseSens:.12};
const RW_CLASS={background:{rubber:180,label:'background · billboard'},stationary:{rubber:45,label:'stationary · heavy cheat'},pedestrian:{rubber:null,label:'pedestrian'},combatant:{rubber:15,label:'combatant · careful'}};
const RW_VIEW_ANGLE={front:0,q:45,side:90,bq:135,back:180,F:0,Q:45,S:90,BQ:135,B:180};
const RW_VIEW_LABEL={front:'FRONT',q:'3/4',side:'SIDE',bq:'BACK 3/4',back:'BACK'};
const RW_VIEW_COLOR={front:'#52c27a',q:'#e2b43c',side:'#e05656',bq:'#a879e6',back:'#5b8fd9'};
const RW={on:false,settings:{...RW_DEFAULTS},net:null,graph:null,pl:null,npcs:[],cars:[],nodes:[],lanes:new Map(),zones:[],t:0,raf:0,last:0,in:{},locked:false,drag:null,msg:null,msgT:0,
  doorsBefore:null,sight:null,stats:null,rng:Math.random,meshes:null,hud:null,panelT:0,paused:false,showMap:true,markSees:false,markWhy:''};
const rwWrap=a=>((a%360)+540)%360-180;
const RW_AIM_Y=.42; // the cross sits where the camera actually points (the level horizon line of this lens), not at the frame centre
function rwMulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
const rwEase=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
const rwDist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function rwSay(text,ms=2600){RW.msg=text;RW.msgT=performance.now()+ms;}

// ------------------------------------------------------------------ route graph (player)
function rwBuildGraph(net){
  const verts=new Map();for(const v of net.vertices)verts.set(v.id,{...v,edges:[]});const edges=[];
  for(const e of net.edges){const A=verts.get(e.a),B=verts.get(e.b);if(!A||!B)continue;const dx=B.x-A.x,dy=B.y-A.y,len=Math.hypot(dx,dy);if(len<.05)continue;const hd=C.heading(A,B),b=C.basis(hd);
    const E={...e,A,B,len,hd,ux:dx/len,uy:dy/len,rx:b.rx,ry:b.ry};edges.push(E);A.edges.push(E);B.edges.push(E);}
  return {verts,edges,byId:new Map(edges.map(e=>[e.id,e]))};
}
function rwProject(e,p){const dx=p.x-e.A.x,dy=p.y-e.A.y;return {s:dx*e.ux+dy*e.uy,off:dx*e.rx+dy*e.ry};}
function rwPlayerPos(){const P=RW.pl,e=P.edge;return {x:e.A.x+e.ux*P.s+e.rx*P.off,y:e.A.y+e.uy*P.s+e.ry*P.off,story:e.A.story||0};}
function rwBand(e){return Math.max(0,Math.min(e.band??9,RW.settings.strafe));}
// The strafe band bulges out at "spots" (doorway, behind the car, shop window), so you can step into them
// sideways without leaving the route. side = +1 (the edge's right) or -1 (its left).
function rwBandSide(e,s,side){let b=rwBand(e);for(const nd of RW.nodes){if(nd.edge!==e||Math.sign(nd.off)!==side)continue;const w=Math.abs(s-nd.s),full=Math.abs(nd.off);if(w<.35)b=Math.max(b,full);else if(w<.95)b=Math.max(b,full+(rwBand(e)-full)*(w-.35)/.6);}return b;}
function rwAttachNodes(){for(const nd of RW.nodes){nd.edge=null;if(nd.reach===false)continue;let best=null,bd=1.9;for(const e of RW.graph.edges){const pr=rwProject(e,nd);if(pr.s<.3||pr.s>e.len-.3)continue;const a=Math.abs(pr.off);if(a<bd){bd=a;best={e,...pr};}}if(best){nd.edge=best.e;nd.s=best.s;nd.off=best.off;}}}
function rwDoor(id){return project.openings.find(o=>o.id===id)||null;}
function rwEdgeBlock(e){if(e.door){const o=rwDoor(e.door);if(o&&o.kind==='door'&&!o.open)return (o.name||'The door')+' is closed — press E to open it';}if(e.gate===false)return (e.name||'This way')+' is blocked';return null;}
function rwChooseExit(V,from,travelYaw,viewYaw,forward){
  const cands=V.edges.filter(e=>e!==from).map(e=>({e,out:e.A===V?e.hd:C.norm(e.hd+180)}));if(!cands.length)return null;
  const pick=(yaw,lim)=>{let best=null,bd=lim;for(const c of cands){const d=Math.abs(rwWrap(c.out-yaw));if(d<bd){bd=d;best=c;}}return best;};
  // Walking forward: a branch is taken when you look toward it (within the branch cone) and it is closer to
  // your view than going straight. A blocked branch you merely glanced at never stops you if you can go straight.
  const straight=pick(travelYaw,30),viewed=forward?pick(viewYaw,RW.settings.branchCone):null;
  let c=viewed&&(!straight||Math.abs(rwWrap(viewed.out-viewYaw))<Math.abs(rwWrap(straight.out-viewYaw)))?viewed:straight;
  if(c&&c!==straight&&straight&&rwEdgeBlock(c.e)&&Math.abs(rwWrap(c.out-viewYaw))>25){rwSay(rwEdgeBlock(c.e));c=straight;}
  if(!c)return {none:true};
  return {edge:c.e,blocked:rwEdgeBlock(c.e)};
}
function rwExitsAhead(){ // what the next junction offers, relative to the body
  const P=RW.pl,e=P.edge,toB=P.dir>0,d=toB?e.len-P.s:P.s;if(d>6)return null;const V=toB?e.B:e.A;if(V.edges.length<2&&d>2)return null;
  const out=V.edges.filter(x=>x!==e).map(x=>{const o=x.A===V?x.hd:C.norm(x.hd+180),rel=rwWrap(o-P.bodyYaw);return {name:x.name||'route',rel,blocked:rwEdgeBlock(x)};});
  return {dist:d,out,dead:!out.length};
}
function rwSwitchEdge(ne,V,forward){
  const P=RW.pl,pos=rwPlayerPos(),fromA=ne.A===V,pr=rwProject(ne,pos);P.edge=ne;P.s=pr.s;P.off=pr.off;
  const newDir=forward?(fromA?1:-1):(fromA?-1:1),newBody=newDir>0?ne.hd:C.norm(ne.hd+180),delta=rwWrap(newBody-P.bodyYaw);P.dir=newDir;
  P.viewHold=P.bodyYaw+P.headYaw;P.bodyTurn={from:P.bodyYaw,delta,t:0,dur:Math.max(.12,Math.abs(delta)/360*.9)};RW.stats.junctions++;
}
function rwMoveAlong(dist){
  const P=RW.pl;
  for(let guard=0;guard<4&&Math.abs(dist)>1e-7;guard++){
    const e=P.edge,dm=Math.sign(dist)*P.dir,ns=P.s+dist*P.dir;
    if((dm>0&&ns<=e.len)||(dm<0&&ns>=0)){P.s=ns;return true;}
    const atB=dm>0,V=atB?e.B:e.A,used=Math.max(0,atB?e.len-P.s:P.s),rem=Math.max(0,Math.abs(dist)-used);P.s=atB?e.len:0;
    const forward=dist>0,travelYaw=forward?P.bodyYaw:P.bodyYaw+180,ch=rwChooseExit(V,e,travelYaw,P.bodyYaw+P.headYaw,forward);
    if(!ch){P.stop='End of this route — R turns around';P.vAlong=0;return false;}
    if(ch.none){P.stop='Junction — look toward the way you want and walk';P.vAlong=0;return false;}
    if(ch.blocked){P.stop=ch.blocked;P.vAlong=0;return false;}
    rwSwitchEdge(ch.edge,V,forward);dist=Math.sign(dist)*rem;
  }
  return true;
}
// ------------------------------------------------------------------ sight lines (walls with see-through openings, solid boxes with heights)
function rwBuildSight(){
  const walls=[];
  for(const w of C.roomWalls(project)){if((w.story||0)!==0)continue;const h=C.wallCap(project,w);if(h<.5)continue;
    const holes=C.openingsForWall(project,w).filter(o=>o.kind==='passage'||o.kind==='window'||(o.kind==='door'&&o.open)).map(o=>{const l=C.openingLine(project,o);return {a:l.start,b:l.end,z0:o.kind==='passage'?-1:o.bottom||0,z1:o.kind==='passage'?99:(o.bottom||0)+o.height};});
    walls.push({axis:w.axis,fixed:w.fixed,start:w.start,end:w.end,h,holes});}
  // boxes in their own frame (centre, unit axis u, half sizes) so turned 3D objects work too
  const boxes=(project.pillars||[]).filter(q=>(q.story||0)===0&&q.height>=.5).map(q=>({cx:q.x,cy:q.y,ux:1,uy:0,hu:q.width/2,hv:q.depth/2,z0:0,h:q.height,name:q.name}));
  RW.propBoxes=[];
  for(const q of project.props||[]){if((q.story||0)!==0||q.enabled===false||q.collision?.solid===false)continue;const fz=C.propFloorZ(project,q),fp=C.propFootprint(q,(project.objectLibrary?.setups||{})[q.asset],null,fz);if(fp.z1-fp.z0<.3)continue;
    const name=q.name||window.RCAssets?.entry(q.asset)?.name||'object';let box;
    if(fp.shape==='cylinder'){const c=fp.poly.reduce((a,v)=>({x:a.x+v.x/fp.poly.length,y:a.y+v.y/fp.poly.length}),{x:0,y:0}),r=Math.max(...fp.poly.map(v=>Math.hypot(v.x-c.x,v.y-c.y)));box={cx:c.x,cy:c.y,ux:1,uy:0,hu:r,hv:r};}
    else{const [p0,p1,,p3]=fp.poly,lu=Math.hypot(p1.x-p0.x,p1.y-p0.y)||1e-6,lv=Math.hypot(p3.x-p0.x,p3.y-p0.y)||1e-6;box={cx:(p0.x+p1.x+fp.poly[2].x+p3.x)/4,cy:(p0.y+p1.y+fp.poly[2].y+p3.y)/4,ux:(p1.x-p0.x)/lu,uy:(p1.y-p0.y)/lu,hu:lu/2,hv:lv/2};}
    Object.assign(box,{z0:fp.z0,h:fp.z1,name,prop:q.id,poly:fp.poly});boxes.push(box);RW.propBoxes.push(box);}
  RW.sight={walls,boxes};
}
// Is the straight line from a (height za) to b (height zb) clear? Returns null when clear, or what blocks it.
function rwSightBlock(a,za,b,zb,{ignoreBoxesBelow=0}={}){
  const S=RW.sight;if(!S)return null;const dx=b.x-a.x,dy=b.y-a.y;
  for(const w of S.walls){const den=w.axis==='h'?dy:dx;if(Math.abs(den)<1e-9)continue;const t=((w.fixed-(w.axis==='h'?a.y:a.x))/den);if(t<=1e-4||t>=1-1e-4)continue;
    const pos=(w.axis==='h'?a.x+dx*t:a.y+dy*t);if(pos<w.start-1e-6||pos>w.end+1e-6)continue;const z=za+(zb-za)*t;if(z>w.h)continue;
    if(w.holes.some(o=>pos>=o.a&&pos<=o.b&&z>=o.z0&&z<=o.z1))continue;return 'wall';}
  for(const q of S.boxes){if(q.h<ignoreBoxesBelow)continue;if(q.poly){if(C.propSegmentHits(a,za,b,zb,{poly:q.poly,z0:q.z0,z1:q.h}))return q.name||'solid object';continue;}let t0=0,t1=1;const vx=-q.uy,vy=q.ux,ax=a.x-q.cx,ay=a.y-q.cy;
    for(const [p0,d,lo,hi] of [[ax*q.ux+ay*q.uy,dx*q.ux+dy*q.uy,-q.hu,q.hu],[ax*vx+ay*vy,dx*vx+dy*vy,-q.hv,q.hv]]){if(Math.abs(d)<1e-9){if(p0<lo||p0>hi){t0=2;break;}continue;}let u0=(lo-p0)/d,u1=(hi-p0)/d;if(u0>u1)[u0,u1]=[u1,u0];t0=Math.max(t0,u0);t1=Math.min(t1,u1);if(t0>t1)break;}
    if(t0<=t1&&t1>0&&t0<1){const zA=za+(zb-za)*Math.max(0,t0),zB=za+(zb-za)*Math.min(1,t1);if(Math.min(zA,zB)<q.h&&Math.max(zA,zB)>(q.z0||0))return q.name||'solid object';}}
  return null;
}
function rwCam(){const P=RW.pl,p=rwPlayerPos();return {x:p.x,y:p.y,z:P.eye+P.bobZ,yaw:C.norm(P.bodyYaw+P.headYaw)};}
// Could the player notice something at p right now? Used to forbid visible spawning and despawning.
// reach:true asks "could the player see it just by turning their head?" (body yaw ± look limit ± half the lens),
// which is the safe test for spawning and despawning: a spot merely outside this frame is not good enough.
function rwVisible(p,{notice=RW.settings.noticeDist,reach=true}={}){
  const c=rwCam(),d=rwDist(c,p);if(d<.5)return true;if(d>notice)return false;
  const S=RW.settings,ang=reach?Math.abs(rwWrap(C.heading(c,p)-RW.pl.bodyYaw)):Math.abs(rwWrap(C.heading(c,p)-c.yaw)),lim=reach?S.lookYaw+S.fov/2+10:S.fov/2+14;if(ang>lim)return false;
  return !rwSightBlock(c,c.z,p,1.0,{ignoreBoxesBelow:1.8})||!rwSightBlock(c,c.z,p,1.7,{ignoreBoxesBelow:1.8});
}
// ------------------------------------------------------------------ lanes, nodes, zones
function rwLane(l){const pts=l.points.map(q=>({x:q.x,y:q.y})),cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+rwDist(pts[i-1],pts[i]));return {...l,pts,cum,len:cum[cum.length-1]};}
function rwLanePose(l,s){s=C.clamp(s,0,l.len);let i=1;while(i<l.pts.length-1&&l.cum[i]<s)i++;const a=l.pts[i-1],b=l.pts[i],span=l.cum[i]-l.cum[i-1],t=span>1e-9?(s-l.cum[i-1])/span:0,hd=C.heading(a,b),bs=C.basis(hd);
  return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,hd,fx:bs.fx,fy:bs.fy,rx:bs.rx,ry:bs.ry};}
function rwLaneProject(l,p){let best={s:0,d:Infinity};for(let i=1;i<l.pts.length;i++){const a=l.pts[i-1],b=l.pts[i],dx=b.x-a.x,dy=b.y-a.y,L2=dx*dx+dy*dy,t=L2?C.clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/L2,0,1):0,x=a.x+dx*t,y=a.y+dy*t,d=Math.hypot(p.x-x,p.y-y);if(d<best.d)best={s:l.cum[i-1]+Math.sqrt(L2)*t,d};}return best;}
function rwNode(id){return RW.nodes.find(n=>n.id===id)||null;}
// ------------------------------------------------------------------ NPCs and traffic
function rwMakeNpc(a){
  const cls=RW_CLASS[a.cls]?a.cls:'pedestrian';
  return {id:a.id,actor:a,name:a.name,role:a.role||'walker',cls,views:a.views||['front','q','back'],state:'hidden',lane:a.lane?RW.lanes.get(a.lane):null,s:0,off:0,offT:0,x:0,y:0,facing:0,
    baseSpeed:a.speed||1.25,speed:0,cycle:0,node:null,slot:null,timer:0,respawnAt:a.delay||0,divert:'',view:null,vsign:1,planeYaw:0,plane:0,resid:0,err:0,theta:0,band:'F',
    h:{view:null,vsign:1,planeYaw:0,plane:0},sh:{view:null,vsign:1},sets:Object.fromEntries(Object.keys(RW_SETS).map(k=>[k,{view:null,vsign:1}])),head:0,headT:0,attn:false,glanceT:0,flourish:0,flourishT:6+RW.rng()*6,onScreen:false,dist:99,switches:0,moving:false,lastAlong:null,scan:0};
}
function rwSpawnAtLaneStart(n){const l=n.lane;if(!l)return false;if(l.door&&!rwDoor(l.door)?.open)return false;const p=rwLanePose(l,0);if(rwVisible(p))return false;
  if(RW.npcs.some(m=>m!==n&&m.state!=='hidden'&&rwDist(m,p)<2.4))return false;
  Object.assign(n,{state:'walk',s:0,off:0,offT:0,x:p.x,y:p.y,facing:p.hd,divert:'',node:null});if(rwVisible(p))RW.stats.spawnInView++;RW.stats.spawns++;return true;}
function rwDespawn(n,why){if(rwVisible(n))RW.stats.despawnInView++;RW.stats.despawns++;if(n.node){const nd=n.node;if(nd.occ===n.id)nd.occ=null;if(nd.res===n.id)nd.res=null;}
  Object.assign(n,{state:'hidden',node:null,respawnAt:RW.t+(n.actor.respawn??(5+RW.rng()*8)),divert:'',view:null,onScreen:false,loiterTried:false,insideNode:null,lastAlong:null});n.h.view=null;n.sh.view=null;for(const st of Object.values(n.sets))st.view=null;if(n.role==='mark'){n.hit=false;}}
function rwRelease(n){if(n.node){if(n.node.occ===n.id)n.node.occ=null;if(n.node.res===n.id)n.node.res=null;}n.node=null;}
function rwReserve(n,node,why){node.res=n.id;n.node=node;n.divert=why;n.state='toNode';n.lastAlong=null;}
function rwPlayerAlong(n){ // how far ahead of the player the NPC is, along the player's travel direction
  const P=RW.pl,p=rwPlayerPos(),dir=C.basis(P.vAlong>=0?P.bodyYaw:P.bodyYaw+180);return {along:(n.x-p.x)*dir.fx+(n.y-p.y)*dir.fy,lat:Math.abs((n.x-p.x)*dir.rx+(n.y-p.y)*dir.ry)};}
function rwTryDivert(n,types,why,{ahead=[1.5,12],maxLane=1.8}={}){
  const l=n.lane;if(!l)return false;let best=null,bd=Infinity;
  for(const nd of RW.nodes){if(nd.occ||nd.res||!nd.types.some(t=>types.includes(t)))continue;const pr=rwLaneProject(l,nd);if(pr.d>maxLane)continue;const da=pr.s-n.s;if(da<ahead[0]||da>ahead[1])continue;if(da<bd){bd=da;best=nd;}}
  if(!best)return false;rwReserve(n,best,why);return true;
}
function rwObstacles(n){const out=[];const p=rwPlayerPos();out.push({x:p.x,y:p.y,player:true,moving:Math.abs(RW.pl.vAlong)>.2});for(const m of RW.npcs)if(m!==n&&m.state!=='hidden')out.push({x:m.x,y:m.y,npc:m,moving:m.moving,speed:m.speed,facing:m.facing});return out;}
function rwStepToward(n,target,speed,dt){const d=rwDist(n,target);if(d<1e-3)return true;const st=Math.min(d,speed*dt);n.facing=C.norm(n.facing+C.clamp(rwWrap(C.heading(n,target)-n.facing),-300*dt,300*dt));n.x+=(target.x-n.x)/d*st;n.y+=(target.y-n.y)/d*st;n.cycle+=st;n.moving=true;n.speed=speed;return d-st<.02;}
function rwTurnTo(n,yaw,dt,rate=220){n.facing=C.norm(n.facing+C.clamp(rwWrap(yaw-n.facing),-rate*dt,rate*dt));}
function rwNpcStep(n,dt){
  n.moving=false;
  if(n.state==='hidden'){if(RW.t>=n.respawnAt){if(n.role==='loiter'){const z=RW.zones.find(z=>z.id===n.actor.zone),slot=z?.slots[n.actor.slot||0];if(slot&&!rwVisible(slot)){Object.assign(n,{state:'loiter',x:slot.x,y:slot.y,facing:slot.facing});RW.stats.spawns++;}else n.respawnAt=RW.t+1;}else if(!rwSpawnAtLaneStart(n))n.respawnAt=RW.t+.5;}return;}
  if(n.role==='mark'&&n.hit&&n.state!=='walk'&&n.state!=='rejoin'){rwRelease(n);n.state='rejoin';n.rejoinS=null;}
  switch(n.state){
    case 'walk':{const l=n.lane;
      // Same-direction passing should be rare: if the player is catching up, step into a free spot ahead or keep pace.
      if(l.side==='near'&&!n.hit){const P=RW.pl,pa=rwPlayerAlong(n),same=Math.abs(rwWrap(n.facing-(P.vAlong>=0?P.bodyYaw:P.bodyYaw+180)))<45;
        if(same&&P.vAlong>.4&&pa.along>.4&&pa.along<7&&pa.lat<3.2){if(!rwTryDivert(n,['loiter','door','hide','cover'],'overtake'))n.boost=Math.max(n.boost||0,RW.pl.vAlong+.12-n.baseSpeed);}
        else n.boost=Math.max(0,(n.boost||0)-dt*.5);
        if(n.state==='walk'&&pa.lat<1.9&&same&&Math.abs(P.vAlong)>.2){if(n.lastAlong!=null&&n.lastAlong>0&&pa.along<=0){RW.stats.overtakes++;}n.lastAlong=pa.along;}else n.lastAlong=null;}
      if(n.state!=='walk')break;
      if(n.actor.divertAt&&!n.hit){const nd=rwNode(n.actor.divertAt);if(nd&&!nd.occ&&!nd.res){const pr=rwLaneProject(l,nd);if(pr.s-n.s>0&&pr.s-n.s<1.2){rwReserve(n,nd,n.role==='mark'?'watch':'stop');break;}}}
      if(n.actor.loiterChance&&!n.loiterTried&&n.s>4){n.loiterTried=true;if(RW.rng()<n.actor.loiterChance&&rwTryDivert(n,['loiter'],'stop',{ahead:[2,14]}))break;}
      // Lane walking with a small sideways allowance to step round whoever is in the way.
      // The lane says how far each side its walkers may step (offMin/offMax, metres, + = walker's right),
      // so nobody steps through the newspaper boxes. After waiting 2.5 s they squeeze a little further.
      const lp=rwLanePose(l,n.s);let speed=n.baseSpeed+(n.boost||0)+(n.hit?1.6:0);
      const relax=(n.waitT||0)>2.5,LO=relax?-.9:(l.offMin??-.6),HI=relax?.9:(l.offMax??.6),obs=[];
      for(const o of rwObstacles(n)){const dx=o.x-lp.x,dy=o.y-lp.y,al=dx*lp.fx+dy*lp.fy,la=dx*lp.rx+dy*lp.ry;if(al<-.5||al>2.2||Math.abs(la)>1.8)continue;
        if(o.npc&&o.moving&&al>.05&&Math.abs(rwWrap(o.facing-lp.hd))<60){if(Math.abs(la-n.off)<.66)speed=Math.min(speed,Math.max(0,(o.speed||0)-.05));continue;}
        obs.push({la,al});}
      const clear=off=>obs.every(o=>Math.abs(off-o.la)>=.66);let target=0;
      if(!clear(0)){const c=obs.flatMap(o=>[o.la-.67,o.la+.67]).filter(x=>x>=LO&&x<=HI&&clear(x)).sort((a,b)=>(Math.abs(a)+.5*Math.abs(a-n.off))-(Math.abs(b)+.5*Math.abs(b-n.off)));target=c.length?c[0]:null;}
      if(target==null){speed=0;n.waitT=(n.waitT||0)+dt;target=n.off;}else n.waitT=Math.max(0,(n.waitT||0)-dt*.5);
      n.offT=target;n.off+=C.clamp(target-n.off,-1.1*dt,1.1*dt);
      if(obs.some(o=>o.al>.05&&o.al<.9&&Math.abs(n.off-o.la)<.6))speed=Math.min(speed,.25);
      n.s+=speed*dt;n.cycle+=speed*dt;n.speed=speed;n.moving=speed>.05;
      const q=rwLanePose(l,n.s);n.x=q.x+q.rx*n.off;n.y=q.y+q.ry*n.off;rwTurnTo(n,q.hd,dt);
      if(n.s>=l.len-1e-6){if(rwVisible(n))n.state='waitEnd';else rwDespawn(n,'end');}
      break;}
    case 'toNode':{const nd=n.node;if(!nd){n.state='rejoin';break;}if(nd.occ&&nd.occ!==n.id){rwRelease(n);n.state='rejoin';break;}
      if(rwStepToward(n,nd,n.baseSpeed,dt)){if(nd.occ&&nd.occ!==n.id){rwRelease(n);n.state='rejoin';break;}nd.occ=n.id;nd.res=null;n.state='atNode';n.timer=n.divert==='watch'?(n.actor.watch||35):n.divert==='stop'?(n.actor.stopTime||(5+RW.rng()*6)):n.role==='stoop'?(n.actor.stay||40):999;}
      break;}
    case 'atNode':{const nd=n.node;rwTurnTo(n,nd.facing,dt,160);n.timer-=dt;
      let leave=n.timer<=0;
      if(n.divert==='overtake'){const pa=rwPlayerAlong(n);if(pa.along<-2.5||rwDist(n,rwPlayerPos())>14||Math.abs(RW.pl.vAlong)<.05&&RW.t-(n.waitStart||(n.waitStart=RW.t))>8)leave=true;}
      if(leave){const doorOk=!nd.door||rwDoor(nd.door)?.open;if(nd.insidePath&&doorOk&&(n.divert==='overtake'||n.actor.useDoor)){n.state='inside';n.insideStep=0;n.insideNode=nd;}else{n.state='rejoin';n.rejoinS=null;}if(nd.occ===n.id)nd.occ=null;n.node=null;n.waitStart=null;}
      break;}
    case 'inside':{const path=n.insideNode?.insidePath||[],tgt=path[n.insideStep];   // through the door and out of sight
      if(!tgt){if(!rwVisible(n))rwDespawn(n,'inside');break;}if(rwStepToward(n,tgt,n.baseSpeed,dt))n.insideStep++;break;}
    case 'rejoin':{const l=n.lane;if(!l){rwDespawn(n,'lost');break;}if(n.rejoinS==null){n.rejoinS=Math.min(l.len,rwLaneProject(l,n).s+1.2);}const q=rwLanePose(l,n.rejoinS);
      if(rwStepToward(n,{x:q.x,y:q.y},n.baseSpeed+(n.hit?1.6:0),dt)){n.s=n.rejoinS;n.off=0;n.state='walk';n.rejoinS=null;}break;}
    case 'waitEnd':{if(!rwVisible(n))rwDespawn(n,'end');break;}
    case 'loiter':{n.timer-=dt;if(n.timer<=0){const z=RW.zones.find(z=>z.id===n.actor.zone),slot=z?.slots[n.actor.slot||0];n.facingT=C.norm((slot?.facing||0)+(RW.rng()-.5)*50);n.timer=8+RW.rng()*7;}
      if(n.facingT!=null)rwTurnTo(n,n.facingT,dt,60);
      if(n.actor.flourish){n.flourishT-=dt;if(n.flourish>0)n.flourish-=dt;else if(n.flourishT<=0&&n.dist<22){n.flourish=2.4;n.flourishT=7+RW.rng()*5;RW.stats.flourishes++;}}
      break;}
  }
}
// Head attention: the head turns toward the player before the whole body changes view.
function rwHeadStep(n,dt){
  const S=RW.settings,c=rwCam(),rel=rwWrap(C.heading(n,c)-n.facing),d=rwDist(n,c);let want=0;n.attn=false;
  if(n.role==='mark'){if(RW.markSees){want=rel;n.attn=true;}else{n.scan+=dt;want=Math.sin(n.scan*.7)*48;}}
  else if(n.role==='loiter'){n.glanceT-=dt;if(d<6||(n.glanceT>0&&d<22)){want=rel;n.attn=true;}else if(n.glanceT<-6-RW.rng()*4)n.glanceT=3;}
  else if(d<10&&Math.abs(rel)<115){want=rel;n.attn=true;}
  want=C.clamp(want,-S.headMax,S.headMax);n.head+=C.clamp(rwWrap(want-n.head),-150*dt,150*dt);
}
// Pick the body art for the camera position: keep the current view unless another one fits clearly better
// (hysteresis), rotate the card toward the camera by up to R (rubber band), and record what is left over.
function rwSelectView(st,facing,views,cam,pos,R,H,tol){
  const theta=rwWrap(C.heading(pos,cam)-facing),sign=theta>=0?1:-1;
  const cands=views.map(v=>{const base=RW_VIEW_ANGLE[v],a=(base===0||base===180)?base:base*sign;return {v,a,d:rwWrap(theta-a)};});
  let best=cands.reduce((m,c)=>Math.abs(c.d)<Math.abs(m.d)?c:m);
  const cur=cands.find(c=>c.v===st.view&&(c.a===0||c.a===180||Math.sign(c.a)===st.vsign));
  // Keep the current picture unless another is clearly better (hysteresis H). When the current one is
  // past the rubber band + leftover allowance it may switch sooner, but only to a picture that is actually
  // acceptable; otherwise two equally wrong pictures flicker (this happened in the 3/4-to-BACK gap).
  const gain=cur?Math.abs(cur.d)-Math.abs(best.d):0;
  if(cur&&!(gain>H)&&!(Math.abs(cur.d)>R+tol+H&&Math.abs(best.d)<=R+tol&&gain>2))best=cur;
  const vs=(best.a===0||best.a===180)?1:Math.sign(best.a);st.switched=st.view!=null&&(best.v!==st.view||vs!==st.vsign);
  st.view=best.v;st.vsign=vs;const cheat=C.clamp(best.d,-R,R);st.plane=cheat;st.resid=Math.abs(best.d)-Math.abs(cheat);st.err=Math.abs(best.d);st.theta=theta;st.planeYaw=C.norm(facing+best.a+cheat);
  const at=Math.abs(theta);st.band=at<22.5?'F':at<67.5?'Q':at<112.5?'S':at<157.5?'BQ':'B';return st;
}
function rwNpcViews(n){const v=n.views.slice();if(v.length>=3){if(RW.settings.allowSide&&!v.includes('side'))v.push('side');if(RW.settings.allowBackQ&&!v.includes('bq'))v.push('bq');}return v;}
// The same NPC judged by four different art sets at once, so one walk compares them fairly.
const RW_SETS={'FRONT, 3/4, BACK':['front','q','back'],'+ SIDE':['front','q','side','back'],'+ BACK 3/4':['front','q','bq','back'],'+ SIDE + BACK 3/4':['front','q','side','bq','back']};
function rwRubber(n){const S=RW.settings,base=RW_CLASS[n.cls]?.rubber??S.rubber;return Math.min(180,base*(S.distCheat?1+C.clamp((n.dist-8)/25,0,1):1));}
function rwPresent(n){
  const S=RW.settings,c=rwCam();n.dist=rwDist(n,c);
  const Hn=S.hysteresis*(S.nearHyst?C.clamp(4/Math.max(.5,n.dist),1,2.5):1);n.hEff=Hn;
  const wasOn=n.onScreen;rwSelectView(n,n.facing,rwNpcViews(n),c,n,rwRubber(n),Hn,S.tolerance);if(n.switched&&wasOn)n.switches++;
  if(n.views.length>=3&&!n.views.includes('side'))rwSelectView(n.sh,n.facing,[...n.views,'side'],c,n,rwRubber(n),Hn,S.tolerance); // what a SIDE card would have done
  if(n.views.length>=3)for(const [k,vs] of Object.entries(RW_SETS)){const st=n.sets[k];rwSelectView(st,n.facing,vs,c,n,rwRubber(n),Hn,S.tolerance);if(st.switched&&wasOn)st.sw=(st.sw||0)+1;}
  const hv=['F','Q','B'];if(S.allowSide)hv.push('S');if(S.allowBackQ)hv.push('BQ');rwSelectView(n.h,C.norm(n.facing+n.head),hv,c,n,S.headRubber,8,S.tolerance);
  const ang=Math.abs(rwWrap(C.heading(c,n)-c.yaw));n.onScreen=n.dist<80&&ang<S.fov/2+Math.atan2(.35,Math.max(.3,n.dist))*57.3&&(!rwSightBlock(c,c.z,n,1.2)||!rwSightBlock(c,c.z,n,1.65));
}
function rwCarStep(car,dt){
  if(car.state==='hidden'){if(RW.t>=car.respawnAt){const p=rwLanePose(car.lane,0);if(!rwVisible(p,{notice:RW.settings.noticeDist+40})){Object.assign(car,{state:'drive',s:0,x:p.x,y:p.y,facing:p.hd,speed:car.lane.speed||8.5});RW.stats.carSpawns++;}else car.respawnAt=RW.t+.5;}return;}
  // A car that reaches the end of its lane while you can see that spot pulls over and parks until you look away.
  if(car.state==='parked'){if(!rwVisible(car,{notice:RW.settings.noticeDist+40})){car.state='hidden';car.respawnAt=RW.t+(car.lane.gap||6)+RW.rng()*6;}return;}
  const l=car.lane,p0=rwLanePose(l,car.s),turn=Math.abs(rwWrap(rwLanePose(l,car.s+6).hd-p0.hd));let target=turn>25?4:car.lane.speed||8.5;
  {const f=C.basis(car.facing),pp=rwPlayerPos();car.yieldTo=null;   // cars stop for people (and other cars) in front of them
    for(const o of [pp,...RW.npcs.filter(n=>n.state!=='hidden'),...RW.cars.filter(c=>c!==car&&c.state!=='hidden'&&c.yieldTo!==car.id)]){const dx=o.x-car.x,dy=o.y-car.y,al=dx*f.fx+dy*f.fy,la=Math.abs(dx*f.rx+dy*f.ry),car2=RW.cars.includes(o);if(al>0&&al<(car2?9:7.5)&&la<(car2?2.2:1.7)){target=0;car.yielding=true;if(car2)car.yieldTo=o.id;}}if(target>0)car.yielding=false;}
  car.speed+=C.clamp(target-car.speed,-6*dt,3*dt);car.s+=car.speed*dt;
  const q=rwLanePose(l,car.s);car.x=q.x;car.y=q.y;car.facing=C.norm(car.facing+C.clamp(rwWrap(q.hd-car.facing),-120*dt,120*dt));
  if(car.s>=l.len){car.s=l.len;car.speed=0;if(rwVisible(car,{notice:RW.settings.noticeDist+40})){car.state='parked';RW.stats.carParked=(RW.stats.carParked||0)+1;}else{car.state='hidden';car.respawnAt=RW.t+(l.gap||6)+RW.rng()*6;}}
}
function rwCarPresent(car){const c=rwCam();car.dist=rwDist(car,c);rwSelectView(car,car.facing,['front','side','back'],c,car,35,10,RW.settings.tolerance);const ang=Math.abs(rwWrap(C.heading(c,car)-c.yaw));car.onScreen=car.state!=='hidden'&&ang<RW.settings.fov/2+12&&!rwSightBlock(c,c.z,car,1.0);}
// ------------------------------------------------------------------ player
function rwPlayerStep(dt){
  const P=RW.pl,S=RW.settings,I=RW.in;
  if(P.turn){P.turn.t+=dt;const u=Math.min(1,P.turn.t/P.turn.dur);P.bodyYaw=C.norm(P.turn.from+P.turn.delta*rwEase(u));P.headYaw*=Math.max(0,1-dt*10);if(u>=1){P.turn=null;P.headYaw=0;}}
  if(P.bodyTurn){P.bodyTurn.t+=dt;const u=Math.min(1,P.bodyTurn.t/P.bodyTurn.dur);P.bodyYaw=C.norm(P.bodyTurn.from+P.bodyTurn.delta*rwEase(u));P.headYaw=C.clamp(rwWrap(P.viewHold-P.bodyYaw),-S.lookYaw,S.lookYaw);if(u>=1)P.bodyTurn=null;}
  const lookX=(I.lookR?1:0)-(I.lookL?1:0),lookY=(I.lookU?1:0)-(I.lookD?1:0);
  if(lookX){P.headYaw+=lookX*110*dt;if(P.bodyTurn)P.viewHold+=lookX*110*dt;}if(lookY)P.pitch+=lookY*70*dt;
  P.headYaw=C.clamp(P.headYaw,-S.lookYaw,S.lookYaw);P.pitch=C.clamp(P.pitch,-S.lookDown,S.lookUp);
  const eyeT=P.crouch?S.crouchEye:S.eye;P.eye+=C.clamp(eyeT-P.eye,-2.5*dt,2.5*dt);
  const fwd=(I.fwd?1:0)-(I.back?1:0),side=(I.right?1:0)-(I.left?1:0);
  const sprinting=I.sprint&&fwd>0&&P.stamina>0&&!P.crouch&&!P.tired;if(sprinting){P.stamina=Math.max(0,P.stamina-dt);if(!P.stamina)P.tired=true;}else{P.stamina=Math.min(S.stamina,P.stamina+dt*.5);if(P.tired&&P.stamina>S.stamina*.5)P.tired=false;}
  let tA=P.turn?0:fwd>0?(sprinting?S.sprint:S.walk):fwd<0?-S.back:0;if(P.crouch)tA*=.55;
  P.vAlong+=C.clamp(tA-P.vAlong,-6*dt,4*dt);const tS=P.turn?0:side*S.strafeSpeed*(P.crouch?.6:1);P.vSide+=C.clamp(tS-P.vSide,-8*dt,8*dt);
  if(Math.abs(fwd)>0)P.stop=null;
  const before={edge:P.edge,s:P.s,off:P.off,dir:P.dir,bodyYaw:P.bodyYaw,headYaw:P.headYaw,bodyTurn:P.bodyTurn,viewHold:P.viewHold};
  if(Math.abs(P.vAlong)>1e-4){rwMoveAlong(P.vAlong*dt);if(rwPlayerBlocked()){Object.assign(P,before);P.vAlong=0;P.blockedT=RW.t;RW.stats.playerBlocked+=dt;}}
  const bL=rwBandSide(P.edge,P.s,-1),bR=rwBandSide(P.edge,P.s,1);
  if(Math.abs(P.vSide)>1e-4){const o0=P.off,d=P.vSide*dt*P.dir;let n=P.off+d;if(d>0&&n>bR)n=Math.max(P.off,bR);if(d<0&&n<-bL)n=Math.min(P.off,-bL);P.off=n;if(rwPlayerBlocked()){P.off=o0;P.vSide=0;}}
  if(P.off>bR)P.off=Math.max(bR,P.off-1.4*dt);if(P.off<-bL)P.off=Math.min(-bL,P.off+1.4*dt);
  const moving=Math.abs(P.vAlong)>.1||Math.abs(P.vSide)>.1;if(moving)P.bobPhase+=dt*(Math.abs(P.vAlong)+.4)*5.4;P.bobZ=S.bob&&moving?Math.sin(P.bobPhase)*.022:P.bobZ*.9;
}
function rwPlayerBlocked(){const p=rwPlayerPos();if(RW.npcs.some(n=>n.state!=='hidden'&&rwDist(n,p)<.52))return true;
  if((RW.propBoxes||[]).some(b=>b.z0<RW.pl.eye&&(C.pointInPoly(p,b.poly)||b.poly.some((v,k)=>C.segDist(p,v,b.poly[(k+1)%b.poly.length])<.25))))return true; /* solid 3D objects stop you */return RW.nodes.some(nd=>nd.occ&&nd.occ!=='player'&&rwDist(nd,p)<nd.radius);}
function rwTurnAround(){const P=RW.pl;if(P.turn)return;const side=P.headYaw<0?-1:1;P.turn={from:P.bodyYaw,delta:180*side,t:0,dur:RW.settings.turnTime};P.dir*=-1;P.bodyTurn=null;P.vAlong=0;RW.stats.turnArounds++;}
function rwNearestDoorNode(){const p=rwPlayerPos();let best=null,bd=2.2;for(const nd of RW.nodes){if(!nd.door)continue;const d=rwDist(nd,p);if(d<bd){bd=d;best=nd;}}return best;}
function rwToggleDoor(){const nd=rwNearestDoorNode();if(!nd){rwSay('No door within reach.');return;}const o=rwDoor(nd.door);if(!o)return;o.open=!o.open;GLE?.invalidate();rwBuildSight();liveRev++;rwSay((o.name||'Door')+(o.open?' opened':' closed'));drawSoon();}
// ------------------------------------------------------------------ the mark (spy / combat target)
function rwMarkStep(){
  const m=RW.npcs.find(n=>n.role==='mark'&&n.state!=='hidden');RW.markSees=false;RW.markWhy='not here';if(!m)return;
  const c=rwCam(),p=rwPlayerPos(),d=rwDist(m,p),cone=Math.abs(rwWrap(C.heading(m,p)-(m.facing+m.head)));
  if(d>35){RW.markWhy='too far';return;}if(cone>62){RW.markWhy='looking elsewhere';return;}
  const blk=rwSightBlock({x:m.x,y:m.y},1.65,p,c.z)&&rwSightBlock({x:m.x,y:m.y},1.65,p,c.z-.25);if(blk){RW.markWhy='hidden: '+blk+' is in the way';return;}
  RW.markSees=true;RW.markWhy='can see you';RW.stats.markSeeTime+=0;
}
function rwShoot(){
  const v=routeWalkView();if(!v)return;RW.stats.shots++;const cx=v.width/2,cy=v.height*RW_AIM_Y,c=rwCam();let best=null;
  for(const n of [...RW.npcs,...RW.cars]){if(n.state==='hidden'||!n.onScreen)continue;const h=n.lane&&RW.cars.includes(n)?1.45:1.78,w=(RW.cars.includes(n)?(n.view==='side'?4.3:1.8):(n.view==='side'?.42:.62))/2;
    const b=C.fpPoint(v,{x:n.x,y:n.y,floorZ:0},0),t=C.fpPoint(v,{x:n.x,y:n.y,floorZ:0},h);if(!b||!t)continue;const hw=w*b.scale;if(cx<b.x-hw||cx>b.x+hw||cy<t.y||cy>b.y)continue;if(!best||b.depth<best.depth)best={n,depth:b.depth};}
  if(!best){rwSay('Miss — nothing under the crosshair.');return;}
  const n=best.n,blk=rwSightBlock(c,c.z,n,1.25);if(blk){rwSay('Blocked by '+blk+' ('+n.dist.toFixed(1)+' m)');RW.stats.blockedShots++;return;}
  RW.stats.hits++;rwSay('HIT '+(n.name||'car')+' at '+n.dist.toFixed(1)+' m');if(n.role==='mark'){n.hit=true;}
}
// ------------------------------------------------------------------ stats
function rwResetStats(){RW.stats={t:0,npcTime:0,byClass:{},band:{F:0,Q:0,S:0,BQ:0,B:0},bandMoving:{F:0,Q:0,S:0,BQ:0,B:0},err:{moving:{near:[0,0,0,0],mid:[0,0,0,0],far:[0,0,0,0]},standing:{near:[0,0,0,0],mid:[0,0,0,0],far:[0,0,0,0]}},
  sideNeeded:{near:0,mid:0,far:0},moonwalk:{near:0,mid:0,far:0},onScreenBand:{near:0,mid:0,far:0},carView:{front:0,side:0,back:0},carTime:0,switches:0,
  spawns:0,despawns:0,spawnInView:0,despawnInView:0,carSpawns:0,carDespawnInView:0,nodeConflicts:0,overtakes:0,playerBlocked:0,playerNodeUses:0,junctions:0,turnArounds:0,shots:0,hits:0,blockedShots:0,markSeeTime:0,flourishes:0,maxHead:0,headAbsorb:0,byGroup:{},npcWait:0,npcSidestep:0,overlap:0,sets:{}};
  for(const n of RW.npcs){n.switches=0;for(const st of Object.values(n.sets||{}))st.sw=0;}}
function rwAccumulate(dt){
  const st=RW.stats;st.t+=dt;if(RW.markSees)st.markSeeTime+=dt;
  for(const n of RW.npcs){if(n.state==='hidden'||!n.onScreen)continue;st.npcTime+=dt;const db=n.dist<8?'near':n.dist<20?'mid':'far';st.onScreenBand[db]+=dt;
    const bc=st.byClass[n.cls]||(st.byClass[n.cls]={front:0,q:0,back:0,side:0,bq:0,time:0,sh:{front:0,q:0,back:0,side:0,bq:0,time:0}});bc[n.view]+=dt;bc.time+=dt;if(n.sh.view){bc.sh[n.sh.view]+=dt;bc.sh.time+=dt;}st.band[n.band]+=dt;if(n.moving)st.bandMoving[n.band]+=dt;
    const eb=n.err<15?0:n.err<30?1:n.err<45?2:3;st.err[n.moving?'moving':'standing'][db][eb]+=dt;if(n.resid>RW.settings.tolerance)st.sideNeeded[db]+=dt;if(n.moving&&n.err>30)st.moonwalk[db]+=dt;
    if(n.attn&&n.view===n.prevView&&Math.abs(n.head)>10)st.headAbsorb+=dt;st.maxHead=Math.max(st.maxHead,Math.abs(n.head));
    const gk=n.role==='walker'?(n.lane?.side||'walker'):n.role,G=st.byGroup[gk]||(st.byGroup[gk]={time:0,band:{F:0,Q:0,S:0,BQ:0,B:0},shown:{front:0,q:0,back:0,side:0,bq:0},sh:{front:0,q:0,back:0,side:0,bq:0},edgeOn:0,wrong30:0,moving:0});
    G.time+=dt;G.band[n.band]+=dt;G.shown[n.view]+=dt;if(n.sh.view)G.sh[n.sh.view]+=dt;if(n.resid>RW.settings.tolerance)G.edgeOn+=dt;if(n.moving){G.moving+=dt;if(n.err>30)G.wrong30+=dt;}}
  for(const n of RW.npcs){if(n.state==='hidden'||!n.onScreen||n.views.length<3)continue;for(const [k,ss] of Object.entries(n.sets)){const A=st.sets[k]||(st.sets[k]={time:0,moving:0,wrong30:0,errSum:0,errMax:0,share:{}});A.time+=dt;A.share[ss.view]=(A.share[ss.view]||0)+dt;if(n.moving){A.moving+=dt;A.errSum+=ss.err*dt;A.errMax=Math.max(A.errMax,ss.err);if(ss.err>30)A.wrong30+=dt;}}}
  for(const n of RW.npcs){if(n.state==='walk'){if(n.speed<.05)st.npcWait+=dt;if(Math.abs(n.off)>.2)st.npcSidestep+=dt;}}
  {const vis=RW.npcs.filter(n=>n.state!=='hidden'&&n.onScreen),pp=rwPlayerPos();for(let i=0;i<vis.length;i++){if(rwDist(vis[i],pp)<.45)st.overlap+=dt;for(let j=i+1;j<vis.length;j++)if(rwDist(vis[i],vis[j])<.45)st.overlap+=dt;}}
  for(const car of RW.cars)if(car.onScreen){st.carView[car.view]+=dt;st.carTime+=dt;}
  const p=rwPlayerPos();for(const nd of RW.nodes){if(nd.occ&&nd.occ!=='player'&&rwDist(nd,p)<nd.radius*.8)st.nodeConflicts++;}
}
function rwStatsSummary(){
  const st=RW.stats,pc=(a,b)=>b>0?Math.round(1000*a/b)/10:0,cls={};
  for(const [k,v] of Object.entries(st.byClass))cls[k]={time:+v.time.toFixed(1),FRONT:pc(v.front,v.time),'3/4':pc(v.q,v.time),BACK:pc(v.back,v.time),SIDE:pc(v.side,v.time),'BACK 3/4':pc(v.bq,v.time),ifSideAllowed:v.sh.time?{FRONT:pc(v.sh.front,v.sh.time),'3/4':pc(v.sh.q,v.sh.time),BACK:pc(v.sh.back,v.sh.time),SIDE:pc(v.sh.side,v.sh.time)}:null};
  const band={};for(const [k,v] of Object.entries(st.band))band[k]=pc(v,st.npcTime);const bandM={},mt=Object.values(st.bandMoving).reduce((a,b)=>a+b,0);for(const [k,v] of Object.entries(st.bandMoving))bandM[k]=pc(v,mt);
  const side={},moon={};for(const k of ['near','mid','far']){side[k]=pc(st.sideNeeded[k],st.onScreenBand[k]);moon[k]=pc(st.moonwalk[k],st.onScreenBand[k]);}
  const switchesPerMin=st.npcTime>0?+(RW.npcs.reduce((a,n)=>a+n.switches,0)/(st.npcTime/60)).toFixed(1):0;
  return {seconds:+st.t.toFixed(1),npcOnScreenSeconds:+st.npcTime.toFixed(1),settings:{...RW.settings},bodyViewShareByClass:cls,trueAngleShare:{all:band,moving:bandM},
    cardWrongShare_residualOverTolerance:side,moonwalkShare_movingErrorOver30:moon,onScreenSecondsByDistance:Object.fromEntries(Object.entries(st.onScreenBand).map(([k,v])=>[k,+v.toFixed(1)])),
    viewSwitchesPerNpcMinute:switchesPerMin,carViewShare:{FRONT:pc(st.carView.front,st.carTime),SIDE:pc(st.carView.side,st.carTime),BACK:pc(st.carView.back,st.carTime)},
    rules:{spawns:st.spawns,despawns:st.despawns,spawnInView:st.spawnInView,despawnInView:st.despawnInView,carDespawnInView:st.carDespawnInView,carsParkedBecauseExitWasVisible:st.carParked||0,nodeConflicts:st.nodeConflicts,sameDirectionOvertakes:st.overtakes,playerBumpedIntoNpcSeconds:+st.playerBlocked.toFixed(1),playerNodeUses:st.playerNodeUses},
    player:{junctionsTaken:st.junctions,turnArounds:st.turnArounds,shots:st.shots,hits:st.hits,blockedShots:st.blockedShots,markCouldSeeYouSeconds:+st.markSeeTime.toFixed(1)},
    heads:{maxHeadTurn:Math.round(st.maxHead),secondsHeadHeldAttentionWithoutBodyChange:+st.headAbsorb.toFixed(1)},flourishes:st.flourishes,
    byGroup:Object.fromEntries(Object.entries(st.byGroup).map(([k,G])=>[k,{seconds:+G.time.toFixed(1),trueAngle:Object.fromEntries(Object.entries(G.band).map(([b,v])=>[b,pc(v,G.time)])),shown:{FRONT:pc(G.shown.front,G.time),'3/4':pc(G.shown.q,G.time),BACK:pc(G.shown.back,G.time),SIDE:pc(G.shown.side,G.time),'BACK 3/4':pc(G.shown.bq,G.time)},ifSideAllowed:{FRONT:pc(G.sh.front,G.time),'3/4':pc(G.sh.q,G.time),BACK:pc(G.sh.back,G.time),SIDE:pc(G.sh.side,G.time)},edgeOn:pc(G.edgeOn,G.time),walkingArtWrongOver30:pc(G.wrong30,G.moving)}])),
    artSets:Object.fromEntries(Object.entries(st.sets).map(([k,A])=>[k,{walkingArtWrongOver30:pc(A.wrong30,A.moving),meanErrorWhileWalking:A.moving?+(A.errSum/A.moving).toFixed(1):0,worstError:Math.round(A.errMax),switchesPerNpcMinute:A.time?+(RW.npcs.reduce((a,n)=>a+(n.sets[k]?.sw||0),0)/(A.time/60)).toFixed(1):0,share:Object.fromEntries(Object.entries(A.share).map(([v,x])=>[RW_VIEW_LABEL[v]||v,pc(x,A.time)]))}])),
    crowd:{npcWaitSeconds:+st.npcWait.toFixed(1),npcSidestepSeconds:+st.npcSidestep.toFixed(1),bodiesOverlappingSeconds:+st.overlap.toFixed(1)}};
}
// ------------------------------------------------------------------ main loop
function rwStep(dt){
  RW.t+=dt;rwPlayerStep(dt);
  for(const n of RW.npcs){n.prevView=n.view;rwNpcStep(n,dt);}
  rwMarkStep();
  for(const n of RW.npcs){if(n.state==='hidden'){n.onScreen=false;continue;}rwHeadStep(n,dt);rwPresent(n);}
  for(const car of RW.cars){rwCarStep(car,dt);if(car.state!=='hidden')rwCarPresent(car);else car.onScreen=false;}
  // node occupancy by the player
  const p=rwPlayerPos();for(const nd of RW.nodes){const d=rwDist(nd,p);if(nd.occ==='player'&&d>nd.radius+.1)nd.occ=null;if(!nd.occ&&d<=nd.radius){if(nd.res){const n=RW.npcs.find(x=>x.id===nd.res);if(n){n.node=null;n.state='rejoin';n.rejoinS=null;}nd.res=null;}nd.occ='player';RW.stats.playerNodeUses++;}}
  rwAccumulate(dt);
}
function rwLoop(now){
  RW.raf=0;if(!RW.on)return;const dt=Math.min(.1,(now-(RW.last||now))/1000)||1/60;RW.last=now;
  if(!RW.paused)rwStep(dt);rwSyncMeshes();draw();rwUpdateHud();if(now-RW.panelT>300){RW.panelT=now;rwUpdatePanels();}
  RW.raf=requestAnimationFrame(rwLoop);
}
// ------------------------------------------------------------------ placeholder cards (canvas art) and 3D meshes
const rwTexCache=new Map();
function rwCardCanvas(kind,view,leg=0,arm=0){
  const key=[kind,view,leg,arm].join('|');if(rwTexCache.has(key))return rwTexCache.get(key);const c=document.createElement('canvas');
  if(kind==='body'){c.width=128;c.height=256;const g=c.getContext('2d'),col=RW_VIEW_COLOR[view],W=128,H=256,dark='#16202a';g.lineJoin='round';
    const legs=(x1,x2,lift1,lift2,w)=>{g.fillStyle='#2b3440';g.fillRect(x1-w/2,140,w,108-lift1);g.fillRect(x2-w/2,140,w,108-lift2);g.fillStyle='#111';g.fillRect(x1-w/2-2,244-lift1,w+6,10);g.fillRect(x2-w/2-2,244-lift2,w+6,10);};
    const step=leg===1?[14,0]:leg===2?[0,14]:[0,0];
    if(view==='front'||view==='back'){legs(46,82,step[0],step[1],22);g.fillStyle=col;g.strokeStyle=dark;g.lineWidth=4;g.beginPath();g.moveTo(14,10);g.lineTo(114,10);g.lineTo(104,148);g.lineTo(24,148);g.closePath();g.fill();g.stroke();
      g.fillStyle=col;g.fillRect(2,16,14,100);g.fillRect(arm?96:112,arm?-6:16,14,arm?60:100);if(arm){g.fillStyle='#222';g.fillRect(92,-6,20,16);}
      if(view==='front'){g.fillStyle=dark;g.fillRect(62,20,4,120);}}
    else if(view==='q'){legs(52,84,step[0],step[1],20);g.fillStyle=col;g.strokeStyle=dark;g.lineWidth=4;g.beginPath();g.moveTo(22,12);g.lineTo(106,8);g.lineTo(98,148);g.lineTo(32,148);g.closePath();g.fill();g.stroke();
      g.fillStyle=col;g.fillRect(10,16,14,96);if(arm){g.fillRect(98,-6,14,60);g.fillStyle='#222';g.fillRect(94,-6,20,16);}g.fillStyle=dark;g.fillRect(80,20,4,118);
      g.fillStyle='#111';g.beginPath();g.moveTo(84,250);g.lineTo(100,256);g.lineTo(84,256);g.fill();}
    else if(view==='bq'){legs(48,80,step[0],step[1],20);g.fillStyle=col;g.strokeStyle=dark;g.lineWidth=4;g.beginPath();g.moveTo(20,10);g.lineTo(104,14);g.lineTo(96,148);g.lineTo(30,148);g.closePath();g.fill();g.stroke();
      g.fillStyle=col;g.fillRect(8,16,14,96);g.fillStyle='#0004';g.fillRect(84,18,14,126);g.fillStyle='#111';g.beginPath();g.moveTo(80,250);g.lineTo(96,256);g.lineTo(80,256);g.fill();}
    else{const sw=leg===1?18:leg===2?-18:0;g.fillStyle='#2b3440';g.save();g.translate(64,140);g.rotate(sw*Math.PI/180);g.fillRect(-11,0,22,108);g.fillStyle='#111';g.fillRect(-11,104,34,10);g.restore();g.save();g.translate(64,140);g.rotate(-sw*Math.PI/180);g.fillStyle='#3a4552';g.fillRect(-11,0,22,108);g.fillStyle='#111';g.fillRect(-11,104,34,10);g.restore();
      g.fillStyle=col;g.strokeStyle=dark;g.lineWidth=4;g.beginPath();g.moveTo(40,10);g.lineTo(90,10);g.lineTo(86,148);g.lineTo(44,148);g.closePath();g.fill();g.stroke();g.save();g.translate(64,22);g.rotate(-sw*Math.PI/180*1.2);g.fillStyle=col;g.strokeStyle=dark;g.fillRect(-7,0,14,96);g.strokeRect(-7,0,14,96);g.restore();}
    g.save();g.font='bold 26px Arial';g.textAlign='center';g.lineWidth=5;g.strokeStyle='#000';g.fillStyle='#fff';const lab=view==='bq'?'B3/4':RW_VIEW_LABEL[view];g.translate(64,86);if(view==='side'){g.rotate(-Math.PI/2);g.font='bold 22px Arial';}g.strokeText(lab,0,8);g.fillText(lab,0,8);g.restore();}
  else if(kind==='head'){c.width=64;c.height=64;const g=c.getContext('2d');g.fillStyle='#d9a77c';g.strokeStyle='#2a1c14';g.lineWidth=3;g.beginPath();g.arc(32,34,24,0,Math.PI*2);g.fill();g.stroke();g.fillStyle='#2a1c14';
    if(view==='B'){g.beginPath();g.arc(32,34,24,0,Math.PI*2);g.fill();}else if(view==='BQ'){g.beginPath();g.arc(32,34,24,0,Math.PI*2);g.fill();g.fillStyle='#d9a77c';g.beginPath();g.moveTo(50,22);g.quadraticCurveTo(60,34,52,52);g.lineTo(46,40);g.fill();}else{g.beginPath();g.arc(32,30,24,Math.PI*1.05,Math.PI*1.95);g.fill();
      const ex=view==='F'?[22,42]:view==='Q'?[30,46]:[48];for(const x of ex){g.fillRect(x-3,32,6,6);}g.beginPath();if(view==='F'){g.moveTo(32,38);g.lineTo(29,46);g.lineTo(35,46);}else if(view==='Q'){g.moveTo(42,38);g.lineTo(44,47);g.lineTo(38,47);}else{g.moveTo(54,36);g.lineTo(62,44);g.lineTo(54,46);}g.fill();}
    g.font='bold 13px Arial';g.fillStyle=view==='S'?'#ff6b6b':'#fff';g.strokeStyle='#000';g.lineWidth=3;g.strokeText(view==='Q'?'¾':view==='BQ'?'B¾':view,4,14);g.fillText(view==='Q'?'¾':view==='BQ'?'B¾':view,4,14);}
  else if(kind==='car'){const side=view==='side';c.width=side?256:128;c.height=96;const g=c.getContext('2d'),W=c.width;g.fillStyle='#2f6f78';g.strokeStyle='#0d1e22';g.lineWidth=4;
    if(side){g.beginPath();g.moveTo(8,70);g.lineTo(10,46);g.lineTo(60,40);g.lineTo(90,16);g.lineTo(170,16);g.lineTo(200,40);g.lineTo(248,46);g.lineTo(250,70);g.closePath();g.fill();g.stroke();g.fillStyle='#9fc6d6';g.fillRect(96,22,34,20);g.fillRect(136,22,32,20);
      g.fillStyle='#111';for(const x of [62,196]){g.beginPath();g.arc(x,72,15,0,Math.PI*2);g.fill();}g.fillStyle='#fff3c4';g.fillRect(238,48,10,9);g.fillStyle='#e33';g.fillRect(9,48,8,9);}
    else{g.beginPath();g.moveTo(8,74);g.lineTo(12,40);g.lineTo(30,14);g.lineTo(98,14);g.lineTo(116,40);g.lineTo(120,74);g.closePath();g.fill();g.stroke();g.fillStyle=view==='front'?'#9fc6d6':'#4a6a76';g.fillRect(30,20,68,22);
      g.fillStyle=view==='front'?'#fff3c4':'#e33';g.fillRect(14,48,20,10);g.fillRect(94,48,20,10);g.fillStyle='#111';g.fillRect(12,74,18,14);g.fillRect(98,74,18,14);}
    g.font='bold 14px Arial';g.fillStyle='#fff';g.strokeStyle='#000';g.lineWidth=3;const lab='CAR '+(view==='side'?'SIDE':view.toUpperCase());g.strokeText(lab,W/2-28,92);g.fillText(lab,W/2-28,92);}
  rwTexCache.set(key,c);return c;
}
function rwMaterial(kind,view,leg,arm){
  const T3=window.THREE,key=[kind,view,leg,arm].join('|');RW.meshes.mats=RW.meshes.mats||new Map();let m=RW.meshes.mats.get(key);
  if(!m){const tex=new T3.CanvasTexture(rwCardCanvas(kind,view,leg,arm));tex.magFilter=T3.NearestFilter;tex.generateMipmaps=true;m=new T3.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.3,side:T3.DoubleSide,color:new T3.Color(.86,.86,.86)});RW.meshes.mats.set(key,m);}
  return m;
}
function rwEnsureMeshes(){
  if(!GLE||!window.THREE)return false;const T3=window.THREE;if(RW.meshes&&RW.meshes.engine===GLE)return true;rwDisposeMeshes();
  const geo=new T3.PlaneGeometry(1,1);geo.translate(0,.5,0);RW.meshes={engine:GLE,geo,list:new Map()};return true;
}
function rwMesh(id){let m=RW.meshes.list.get(id);if(!m){m=new window.THREE.Mesh(RW.meshes.geo,rwMaterial('body','front',0,0));m.frustumCulled=false;m.renderOrder=2;GLE.dynamic.add(m);RW.meshes.list.set(id,m);}return m;}
function rwDisposeMeshes(){if(!RW.meshes)return;for(const m of RW.meshes.list.values())RW.meshes.engine?.dynamic.remove(m);for(const m of (RW.meshes.mats||new Map()).values()){m.map?.dispose();m.dispose();}RW.meshes.geo?.dispose();RW.meshes=null;}
function rwPlace(m,x,y,yaw,w,h,z=0,mirror=false){const b=C.basis(yaw);m.position.set(x,z,y);m.rotation.set(0,Math.atan2(b.fx,b.fy),0);m.scale.set(mirror?-w:w,h,1);m.visible=true;}
function rwSyncMeshes(){
  if(!rwEnsureMeshes())return;const c=rwCam();
  for(const n of RW.npcs){const body=rwMesh(n.id+':b'),head=rwMesh(n.id+':h');if(n.state==='hidden'){body.visible=head.visible=false;continue;}
    const leg=n.moving?(Math.floor(n.cycle/.55)%4===1?1:Math.floor(n.cycle/.55)%4===3?2:0):0,arm=n.flourish>0?1:0,w=n.view==='side'?.42:n.view==='q'||n.view==='bq'?.56:.62;
    body.material=rwMaterial('body',n.view,leg,arm);const toward=C.basis(C.heading(n,c));
    rwPlace(body,n.x,n.y,n.planeYaw,w,1.47,0,n.vsign<0);
    head.material=rwMaterial('head',n.h.view,0,0);rwPlace(head,n.x+toward.fx*.03,n.y+toward.fy*.03,n.h.planeYaw,.34,.34,1.45,n.h.vsign<0);}
  for(const car of RW.cars){const m=rwMesh(car.id);if(car.state==='hidden'){m.visible=false;continue;}m.material=rwMaterial('car',car.view,0,0);rwPlace(m,car.x,car.y,car.planeYaw,car.view==='side'?4.3:1.85,1.5,0,car.vsign<0);}
}
// ------------------------------------------------------------------ start / stop
function routeWalkView(){
  if(!RW.on||!RW.pl)return null;const P=RW.pl,p=rwPlayerPos(),S=RW.settings,W=1440,H=900,f=W/(2*Math.tan(C.rad(S.fov)/2)),hf=C.clamp(.42+f*Math.tan(C.rad(P.pitch))/H,.1,.9);
  return {id:null,name:'Route walk',x:p.x,y:p.y,story:p.story,floorZ:0,facing:C.norm(P.bodyYaw+P.headYaw),fov:S.fov,eyeHeight:P.eye+P.bobZ,horizon:hf,width:W,height:H,role:'movement'};
}
function rwStart(){
  const net=project.routeNet;if(!net||!net.edges?.length){toast('This project has no route network. Open examples/Route_Prototype_Street.room.json to try the prototype.',7000);return false;}
  if(mode!=='build')return false;commitLive();freeCam=null;stopRail();
  RW.net=net;RW.settings={...RW_DEFAULTS,...(net.settings?.defaults||{}),...(RW.userSettings||{})};RW.rng=rwMulberry(net.settings?.seed||1977);RW.graph=rwBuildGraph(net);
  RW.lanes=new Map(net.lanes.map(l=>[l.id,rwLane(l)]));for(const t of net.traffic)RW.lanes.set(t.id,rwLane(t));
  RW.nodes=net.nodes.map(n=>({...n,types:n.types||[],radius:n.radius||.55,occ:null,res:null}));
  RW.zones=net.zones.map(z=>({...z,slots:z.slots||[]}));RW.doorsBefore=new Map(project.openings.map(o=>[o.id,o.open]));
  rwBuildSight();rwAttachNodes();rwResetStats();RW.t=0;
  const st=net.settings?.start||{},e=RW.graph.byId.get(st.edge)||RW.graph.edges[0];
  RW.pl={edge:e,s:st.s??1,off:0,dir:st.dir||1,bodyYaw:(st.dir||1)>0?e.hd:C.norm(e.hd+180),headYaw:0,pitch:0,eye:RW.settings.eye,bobZ:0,bobPhase:0,vAlong:0,vSide:0,stamina:RW.settings.stamina,crouch:false,turn:null,bodyTurn:null,stop:null};
  RW.npcs=net.actors.map(rwMakeNpc);RW.cars=net.traffic.map((t,i)=>({id:'car_'+t.id,lane:RW.lanes.get(t.id),state:'hidden',respawnAt:(t.delay??(2+i*7)),s:0,speed:t.speed||8.5,facing:0,x:0,y:0,view:'side',vsign:1,planeYaw:0,switches:0,h:null}));
  // starting crowd: actors with a start position are already in the scene when the walk begins
  for(const n of RW.npcs){const a=n.actor;
    if(n.role==='loiter'){const z=RW.zones.find(z=>z.id===a.zone),slot=z?.slots[a.slot||0];if(slot)Object.assign(n,{state:'loiter',x:slot.x,y:slot.y,facing:slot.facing,timer:3+RW.rng()*5});}
    else if(n.role==='stoop'&&a.node){const nd=RW.nodes.find(x=>x.id===a.node);if(nd){Object.assign(n,{state:'atNode',node:nd,x:nd.x,y:nd.y,facing:nd.facing,divert:'stoop',timer:a.stay||40});nd.occ=n.id;}}
    else if(a.startS!=null&&n.lane){const q=rwLanePose(n.lane,a.startS);Object.assign(n,{state:'walk',s:a.startS,x:q.x,y:q.y,facing:q.hd});}}
  RW.on=true;RW.paused=false;mode='route';rememberMap();active='fp';tool='select';pending=null;selection=null;fit();
  rwEnsureHud();RW.last=0;RW.raf=requestAnimationFrame(rwLoop);refresh();rwSay('Route walk started. Click the picture to steer with the mouse.',5000);return true;
}
function rwStop(){
  if(!RW.on)return;RW.on=false;cancelAnimationFrame(RW.raf);if(document.pointerLockElement)document.exitPointerLock?.();
  for(const o of project.openings)if(RW.doorsBefore?.has(o.id))o.open=RW.doorsBefore.get(o.id);GLE?.invalidate();liveRev++;rwDisposeMeshes();
  RW.hud?.classList.add('hidden');mode='build';active='iso';if(!restoreMap())fit();refresh();
}
function rwCenterMap(){zoom=Math.max(zoom,4);const g=geometry(),q=C.isoPoint(project,rwPlayerPos(),0);pan.x+=g.cw/2-(g.ox+q.x*g.scale);pan.y+=g.ch/2-(g.oy+q.y*g.scale);drawSoon();}
function rwEnsureHud(){if(RW.hud)return;const d=document.createElement('div');d.className='route-hud hidden';d.id='routeHud';wrap.append(d);RW.hud=d;}
// ------------------------------------------------------------------ HUD, panels
function rwUpdateHud(){
  const el=RW.hud;if(!el)return;const show=RW.on&&active==='fp';el.classList.toggle('hidden',!show);if(!show)return;const P=RW.pl,S=RW.settings,ex=rwExitsAhead(),door=rwNearestDoorNode(),occ=RW.nodes.find(n=>n.occ==='player');
  const arrow=r=>Math.abs(r)<30?'↑':r<-150||r>150?'↓':r<0?'←':'→';
  const junction=ex&&!ex.dead?`<div class="rh-row">Junction in ${ex.dist.toFixed(1)} m: ${ex.out.map(o=>`<span class="${o.blocked?'blocked':''}">${arrow(o.rel)} ${esc(o.name)}${o.blocked?' (closed)':''}</span>`).join(' · ')}</div>`:ex&&ex.dead&&ex.dist<1.5?'<div class="rh-row">End of the route — R to turn around</div>':'';
  const dobj=door?rwDoor(door.door):null;
  el.innerHTML=`<div class="rh-row"><b>ROUTE WALK</b> <span class="tag">${esc(P.edge.name||'route')}</span> ${P.crouch?'<span class="tag warn">CROUCHED</span>':''}${P.tired?'<span class="tag warn">OUT OF BREATH</span>':''}</div>
    <div class="rh-row mono">speed ${Math.abs(P.vAlong).toFixed(1)} m/s · strafe ${P.off*P.dir>=0?'+':''}${(P.off*P.dir).toFixed(2)} / ±${rwBand(P.edge).toFixed(2)} m · look ${Math.round(P.headYaw)}° / ±${S.lookYaw}° · tilt ${Math.round(P.pitch)}°</div>
    ${P.stop?`<div class="rh-row warn">${esc(P.stop)}</div>`:junction}${dobj?`<div class="rh-row">${esc(dobj.name)}: ${dobj.open?'open':'closed'} — <b>E</b> to ${dobj.open?'close':'open'}</div>`:''}
    ${occ?`<div class="rh-row">At spot: <b>${esc(occ.name)}</b> (${occ.types.join(', ')})</div>`:''}
    <div class="rh-row ${RW.markSees?'warn':''}">Mark: ${esc(RW.markWhy)}</div>
    ${RW.msg&&performance.now()<RW.msgT?`<div class="rh-row msg">${esc(RW.msg)}</div>`:''}
    <div class="rh-keys">W/S walk · A/D strafe · mouse/arrows look · R turn · C crouch · Shift sprint · Space/click shoot · E door · Tab debug (${['off','labels','full'][S.debug]}) · 1 map · 3 back · Esc leave</div>`;
}
function rwSlider(label,key,min,max,step,unitTxt=''){const v=RW.settings[key];return `<div class="range-field"><label>${esc(label)}${unitTxt?' ('+unitTxt+')':''}</label><div class="range-controls"><input type="range" data-rw="${key}" min="${min}" max="${max}" step="${step}" value="${v}"><input type="number" data-rw="${key}" min="${min}" max="${max}" step="${step}" value="${v}"></div></div>`;}
function rwCheck(label,key){return `<label class="check"><input type="checkbox" data-rw="${key}" ${RW.settings[key]?'checked':''}>${esc(label)}</label>`;}
function rwLeftPanel(){
  return `<div class="section"><div class="row"><h2 class="grow">Route walk</h2><span class="badge">PROTOTYPE</span></div><p>You are walking an authored route. NPCs are placeholder cards: <b style="color:${RW_VIEW_COLOR.front}">FRONT</b>, <b style="color:${RW_VIEW_COLOR.q}">3/4</b>, <b style="color:${RW_VIEW_COLOR.back}">BACK</b> and <b style="color:${RW_VIEW_COLOR.side}">SIDE</b> (diagnostic only). Change the sliders while walking.</p><button class="block" data-rw-act="stop">Leave route walk (Esc)</button></div>
    <div class="section"><h3>Player</h3>${rwSlider('Strafe band, each side','strafe',0,1.5,.05,'m')}${rwSlider('Look left/right limit','lookYaw',30,180,1,'°')}${rwSlider('Look up limit','lookUp',0,60,1,'°')}${rwSlider('Look down limit','lookDown',0,60,1,'°')}${rwSlider('Turn-around time','turnTime',.1,1.2,.05,'s')}${rwSlider('Walking speed','walk',.8,2.5,.05,'m/s')}${rwSlider('Lens angle','fov',55,100,1,'°')}${rwCheck('Walking bob','bob')}</div>
    <div class="section"><h3>NPC sprite cheating</h3>${rwSlider('Rubber band (card turns toward you)','rubber',0,60,1,'°')}${rwSlider('Leftover angle allowed before switching','tolerance',0,45,1,'°')}${rwSlider('Hysteresis (resists flicker)','hysteresis',0,30,1,'°')}${rwSlider('Head turn limit','headMax',0,90,1,'°')}${rwCheck('Cheat more with distance','distCheat')}${rwCheck('More hysteresis up close','nearHyst')}${rwCheck('Allow a SIDE card (diagnostic)','allowSide')}${rwCheck('Allow a BACK 3/4 card (diagnostic)','allowBackQ')}
      <label>Debug overlay<select data-rw="debug"><option value="0" ${RW.settings.debug==0?'selected':''}>Off</option><option value="1" ${RW.settings.debug==1?'selected':''}>Labels</option><option value="2" ${RW.settings.debug==2?'selected':''}>Full</option></select></label>
      <p class="subtle"><b>The dial in each full label</b> is seen from above, with you at the white dot. Green arrow: where the NPC really faces. Dashed line: the angle its art was drawn for. Thick bar: the card itself. Pink: its head. Red text: the card is seen too edge-on.</p></div>
    <div class="section"><h3>Map colours</h3><p>Yellow: your route and strafe band (dotted = a spot you can step into). Cyan: NPC lanes. Orange dashes: traffic. Pink box: gathering zone. Circles: spots (green free, orange reserved, red taken, yellow you). ◆ purple: hidden way in/out, red when you can see it (nothing may appear there then). White diamond: junction.</p></div>`;
}
function rwRightPanel(){
  const s=rwStatsSummary(),cls=Object.entries(s.bodyViewShareByClass).map(([k,v])=>`<tr><td>${esc(RW_CLASS[k]?.label||k)}</td><td>${v.FRONT}</td><td>${v['3/4']}</td><td>${v.BACK}</td><td class="${v.SIDE?'warn':''}">${v.SIDE}</td></tr>`).join('');
  const b=s.trueAngleShare.all,bm=s.trueAngleShare.moving,r=s.rules;
  return `<section class="section"><span class="eyebrow">Live measurements · ${s.seconds}s walked · ${s.npcOnScreenSeconds}s of NPCs on screen</span>
    <h3>Body card shown (% of on-screen time)</h3><table class="rw-table"><tr><th></th><th>FRONT</th><th>3/4</th><th>BACK</th><th>SIDE</th></tr>${cls||'<tr><td colspan="5">No NPC on screen yet</td></tr>'}</table>
    <h3>If a SIDE card were allowed (% of time it would be picked)</h3><table class="rw-table"><tr><th></th><th>FRONT</th><th>3/4</th><th>BACK</th><th>SIDE</th></tr>${Object.entries(s.bodyViewShareByClass).filter(([k,v])=>v.ifSideAllowed).map(([k,v])=>`<tr><td>${esc(RW_CLASS[k]?.label||k)}</td><td>${v.ifSideAllowed.FRONT}</td><td>${v.ifSideAllowed['3/4']}</td><td>${v.ifSideAllowed.BACK}</td><td class="warn">${v.ifSideAllowed.SIDE}</td></tr>`).join('')||'<tr><td colspan="5">—</td></tr>'}</table>
    <h3>Art sets compared (walking NPCs)</h3><table class="rw-table"><tr><th></th><th>&gt;30° wrong %</th><th>avg °</th><th>worst °</th></tr>${Object.entries(s.artSets).map(([k,a])=>`<tr><td>${esc(k)}</td><td>${a.walkingArtWrongOver30}</td><td>${a.meanErrorWhileWalking}</td><td>${a.worstError}</td></tr>`).join('')||'<tr><td colspan="4">—</td></tr>'}</table>
    <h3>True viewing angle (% of on-screen time)</h3><table class="rw-table"><tr><th></th><th>front</th><th>3/4</th><th>side</th><th>back 3/4</th><th>back</th></tr><tr><td>all</td><td>${b.F}</td><td>${b.Q}</td><td class="warn">${b.S}</td><td>${b.BQ}</td><td>${b.B}</td></tr><tr><td>walking</td><td>${bm.F}</td><td>${bm.Q}</td><td class="warn">${bm.S}</td><td>${bm.BQ}</td><td>${bm.B}</td></tr></table>
    <h3>Where the cheat shows (% of on-screen time)</h3><table class="rw-table"><tr><th></th><th>near &lt;8 m</th><th>mid</th><th>far &gt;20 m</th></tr><tr><td>card seen edge-on</td><td>${s.cardWrongShare_residualOverTolerance.near}</td><td>${s.cardWrongShare_residualOverTolerance.mid}</td><td>${s.cardWrongShare_residualOverTolerance.far}</td></tr><tr><td>walking, art faces &gt;30° wrong</td><td>${s.moonwalkShare_movingErrorOver30.near}</td><td>${s.moonwalkShare_movingErrorOver30.mid}</td><td>${s.moonwalkShare_movingErrorOver30.far}</td></tr></table>
    <p class="subtle">View changes per NPC per minute on screen: <b>${s.viewSwitchesPerNpcMinute}</b> · traffic car: front ${s.carViewShare.FRONT}% / side ${s.carViewShare.SIDE}% / back ${s.carViewShare.BACK}%</p>
    <h3>Rules</h3><table class="rw-table"><tr><td>spawns / despawns</td><td>${r.spawns} / ${r.despawns}</td></tr><tr><td>appeared or vanished in view</td><td class="${r.spawnInView+r.despawnInView+r.carDespawnInView?'warn':''}">${r.spawnInView+r.despawnInView+r.carDespawnInView}</td></tr><tr><td>two characters on one spot</td><td class="${r.nodeConflicts?'warn':''}">${r.nodeConflicts}</td></tr><tr><td>same-direction overtakes</td><td>${r.sameDirectionOvertakes}</td></tr><tr><td>you bumped into an NPC (s)</td><td>${r.playerBumpedIntoNpcSeconds}</td></tr><tr><td>shots / hits / blocked</td><td>${s.player.shots} / ${s.player.hits} / ${s.player.blockedShots}</td></tr><tr><td>mark could see you</td><td>${s.player.markCouldSeeYouSeconds}s</td></tr></table>
    <div class="button-row"><button data-rw-act="reset">Reset counts</button><button data-rw-act="export">Download measurements</button></div></section>`;
}
function rwUpdatePanels(){if(!RW.on)return;const el=$('inspector');if(el&&!el.matches(':hover'))el.innerHTML=rwRightPanel();}
HOOKS.leftRender.push(el=>{if(RW.on){el.innerHTML=rwLeftPanel();return;}
  if(pane==='rails'&&project.routeNet){const n=project.routeNet;el.insertAdjacentHTML('beforeend',`<div class="section"><h3>Route network · prototype</h3><p>${n.edges.length} player route pieces · ${n.lanes.length} NPC lanes · ${n.nodes.length} spots · ${n.zones.length} gathering zone · ${n.traffic.length} traffic lanes.</p><button class="primary block" data-rw-act="start">▶ Route walk</button><label class="check"><input type="checkbox" id="rwShowMap" ${RW.showMap?'checked':''}>Show the route network on the map</label></div>`);}});
HOOKS.inspectorRender.push(el=>{if(RW.on)el.innerHTML=rwRightPanel();});
HOOKS.click.push((e,b)=>{const a=b.dataset.rwAct;if(!a)return false;
  if(a==='start')rwStart();else if(a==='stop')rwStop();else if(a==='reset'){rwResetStats();rwUpdatePanels();}
  else if(a==='export'){download(new Blob([JSON.stringify(rwStatsSummary(),null,1)],{type:'application/json'}),'route_walk_measurements.json');}
  return true;});
document.addEventListener('input',e=>{const el=e.target;if(!el.matches?.('[data-rw]'))return;const k=el.dataset.rw;let v=el.type==='checkbox'?el.checked:Number(el.value);if(el.type!=='checkbox'&&!Number.isFinite(v))return;RW.settings[k]=v;RW.userSettings={...(RW.userSettings||{}),[k]:v};document.querySelectorAll(`[data-rw="${k}"]`).forEach(o=>{if(o!==el&&o.type!=='checkbox')o.value=el.value;});drawSoon();});
document.addEventListener('change',e=>{const el=e.target;if(el.id==='rwShowMap'){RW.showMap=el.checked;drawSoon();return;}if(el.matches?.('[data-rw]')&&(el.type==='checkbox'||el.tagName==='SELECT')){const k=el.dataset.rw;RW.settings[k]=el.type==='checkbox'?el.checked:Number(el.value);RW.userSettings={...(RW.userSettings||{}),[k]:RW.settings[k]};drawSoon();}});
HOOKS.top.push(()=>{
  const b=$('routeBtn');if(b){b.disabled=mode==='test'||!project.routeNet;b.classList.toggle('active',RW.on);b.textContent=RW.on?'Leave route walk':'Route walk';}
  if(RW.on){document.querySelectorAll('[data-tool]').forEach(x=>x.disabled=true);$('testBtn').disabled=true;$('viewSelect').disabled=true;$('stageTitle').innerHTML='<b>Route walk · prototype</b><small>Route-bound feet, free attention · NPC cards show which body art is used</small>';$('guideText').textContent='Route walk prototype. Walk the sidewalk, look across the street, turn around (R), try the bodega door (E), take a spot behind the parked car, crouch (C), shoot (Space). Tab cycles the debug overlay.';}
  else $('testBtn').disabled=mode==='test'&&false;
  rwUpdateHud();
});
// ------------------------------------------------------------------ input
const RW_KEYS={KeyW:'fwd',ArrowUp:'fwd',KeyS:'back',ArrowDown:'back',KeyA:'left',KeyD:'right',ArrowLeft:'lookL',ArrowRight:'lookR',PageUp:'lookU',PageDown:'lookD'};
document.addEventListener('keydown',e=>{
  if(!RW.on)return;const editing=/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName);if(editing&&e.key!=='Escape')return;
  if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();rwStop();return;}
  const k=RW_KEYS[e.code];e.preventDefault();e.stopImmediatePropagation();
  if(k){RW.in[k]=true;return;}if(e.key==='Shift'){RW.in.sprint=true;return;}if(e.repeat)return;
  if(e.code==='KeyR')rwTurnAround();else if(e.code==='KeyC')RW.pl.crouch=!RW.pl.crouch;else if(e.code==='KeyE')rwToggleDoor();else if(e.code==='Space')rwShoot();
  else if(e.code==='Tab'){RW.settings.debug=(RW.settings.debug+1)%3;renderLeft();}else if(e.key==='1'){active='iso';if(!restoreMap())fit();rwCenterMap();refresh();}else if(e.key==='3'||e.key==='2'){active='fp';fit();refresh();}
},true);
document.addEventListener('keyup',e=>{if(!RW.on)return;const k=RW_KEYS[e.code];if(k)RW.in[k]=false;if(e.key==='Shift')RW.in.sprint=false;},true);
window.addEventListener('blur',()=>{RW.in={};});
HOOKS.pointerDown.unshift((e,q)=>{if(!RW.on)return false;if(active!=='fp')return true;
  if(document.pointerLockElement===canvas){rwShoot();return true;}RW.drag={x:e.clientX,y:e.clientY,moved:false,yaw:RW.pl.headYaw,pitch:RW.pl.pitch};return true;});
HOOKS.pointerMove.unshift(e=>{if(!RW.on||!RW.drag)return false;const d=RW.drag,dx=e.clientX-d.x,dy=e.clientY-d.y;if(!d.moved&&Math.hypot(dx,dy)<4)return true;d.moved=true;const S=RW.settings;
  RW.pl.headYaw=C.clamp(d.yaw-dx*S.mouseSens*1.6,-S.lookYaw,S.lookYaw);RW.pl.pitch=C.clamp(d.pitch+dy*S.mouseSens,-S.lookDown,S.lookUp);return true;});
HOOKS.pointerUp.unshift(e=>{if(!RW.on)return false;const d=RW.drag;RW.drag=null;if(d&&!d.moved&&active==='fp'){try{const r=canvas.requestPointerLock?.();r?.catch?.(()=>{});}catch(_){}rwSay('Mouse captured: move to look, click to shoot. Esc frees the mouse.',3500);}return true;}); // the first click only captures the mouse
document.addEventListener('mousemove',e=>{if(!RW.on||document.pointerLockElement!==canvas)return;const S=RW.settings;RW.pl.headYaw=C.clamp(RW.pl.headYaw+e.movementX*S.mouseSens,-S.lookYaw,S.lookYaw);RW.pl.pitch=C.clamp(RW.pl.pitch-e.movementY*S.mouseSens,-S.lookDown,S.lookUp);});
HOOKS.wheel.unshift(()=>RW.on&&active==='fp');HOOKS.dblClick.unshift(()=>RW.on);
// ------------------------------------------------------------------ debug overlay: first person
function rwFP(v,p,h=0){return C.fpPoint(v,{x:p.x,y:p.y,floorZ:0},h);}
function rwFPLine(g,v,pts,{color,width=2,dash=null,k}={}){
  // Straight ground lines stay straight in perspective, so only the part behind the camera needs cutting off.
  const f=C.basis(v.facing),dep=p=>(p.x-v.x)*f.fx+(p.y-v.y)*f.fy,NEAR=.4;
  g.save();g.strokeStyle=color;g.lineWidth=width*k;if(dash)g.setLineDash(dash.map(d=>d*k));g.beginPath();
  for(let i=1;i<pts.length;i++){let a=pts[i-1],b=pts[i];const da=dep(a),db=dep(b);if(da<NEAR&&db<NEAR)continue;
    if(da<NEAR){const t=(NEAR-da)/(db-da);a={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}else if(db<NEAR){const t=(NEAR-da)/(db-da);b={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}
    const qa=rwFP(v,a),qb=rwFP(v,b);if(!qa||!qb)continue;g.moveTo(qa.x,qa.y);g.lineTo(qb.x,qb.y);}
  g.stroke();g.restore();
}
function rwCompass(g,cx,cy,r,n,k){const c=rwCam(),up=C.heading(c,n),pt=(h,rr)=>{const a=C.rad(h-up);return {x:cx+Math.sin(a)*rr,y:cy-Math.cos(a)*rr};},ln=(p,q,col,w,dash)=>{g.strokeStyle=col;g.lineWidth=w*k;g.setLineDash(dash?dash.map(d=>d*k):[]);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke();};
  const o={x:cx,y:cy};g.save();g.strokeStyle='#ffffff38';g.lineWidth=k;g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.stroke();
  const ideal=C.norm(n.planeYaw-n.plane);ln(o,pt(ideal,r),RW_VIEW_COLOR[n.view],1.2,[2,2]);
  ln(pt(n.planeYaw+90,r*.62),pt(n.planeYaw-90,r*.62),RW_VIEW_COLOR[n.view],3.2);ln(o,pt(n.planeYaw,r*.42),RW_VIEW_COLOR[n.view],1.6);
  ln(o,pt(n.facing,r*.95),'#7fe0a0',1.8);const t=pt(n.facing,r*.95),bk=pt(n.facing+180,0);g.fillStyle='#7fe0a0';g.beginPath();g.arc(t.x,t.y,2.2*k,0,Math.PI*2);g.fill();
  ln(o,pt(n.facing+n.head,r*.7),'#f08ad0',1.4);const cm=pt(up+180,r);g.fillStyle='#fff';g.beginPath();g.arc(cm.x,cm.y,2.6*k,0,Math.PI*2);g.fill();g.restore();}
function routeFPOverlay(g,v){
  if(!RW.on||!v||v.name!=='Route walk')return;const S=RW.settings,k=1/geometry().scale,W=v.width,H=v.height;
  if(S.debug>=2){
    for(const e of RW.graph.edges){rwFPLine(g,v,[e.A,e.B],{color:'#ffd27add',width:2.5,k});const bd=rwBand(e);if(bd>.01)for(const s of [-1,1])rwFPLine(g,v,[{x:e.A.x+e.rx*bd*s,y:e.A.y+e.ry*bd*s},{x:e.B.x+e.rx*bd*s,y:e.B.y+e.ry*bd*s}],{color:'#ffd27a88',width:1.2,dash:[6,5],k});}
    for(const l of RW.lanes.values())rwFPLine(g,v,l.pts,{color:l.kind==='traffic'?'#ff9a4a99':'#56d6e0aa',width:1.6,dash:l.kind==='traffic'?[10,8]:null,k});
    for(const z of RW.zones){const c=[{x:z.x,y:z.y},{x:z.x+z.width,y:z.y},{x:z.x+z.width,y:z.y+z.length},{x:z.x,y:z.y+z.length},{x:z.x,y:z.y}];rwFPLine(g,v,c,{color:'#e47cf0cc',width:2,k});}
    for(const vx of RW.graph.verts.values()){if(vx.edges.length<3)continue;const q=rwFP(v,vx);if(q&&q.depth>.4){const s=7*k;g.fillStyle='#ffffff';g.beginPath();g.moveTo(q.x,q.y-s);g.lineTo(q.x+s,q.y);g.lineTo(q.x,q.y+s);g.lineTo(q.x-s,q.y);g.fill();}}
    for(const pt of RW.net.portals){const q=rwFP(v,pt);if(q&&q.depth>.4){const vis=rwVisible(pt);g.fillStyle=vis?'#ff5d5d':'#b07cff';g.font=`bold ${9*k}px Segoe UI`;g.textAlign='center';g.fillText('◆ '+(pt.kind==='vehicle'?'car in/out':pt.kind+' in/out'),q.x,q.y);}}
  }
  if(S.debug>=2&&typeof propsRouteFP==='function')propsRouteFP(g,v,k);
  if(S.debug>=2)for(const nd of RW.nodes)if(nd.edge){const e=nd.edge;rwFPLine(g,v,[{x:e.A.x+e.ux*nd.s,y:e.A.y+e.uy*nd.s},nd],{color:'#ffd27aaa',width:1.4,dash:[3,4],k});}
  if(S.debug>=1)for(const nd of RW.nodes){const q=rwFP(v,nd);if(!q||q.depth<.4)continue;const r=Math.max(4*k,nd.radius*q.scale),col=nd.occ==='player'?'#ffd27a':nd.occ?'#ff6b6b':nd.res?'#ffb35c':'#7fe0a0';
    g.save();g.strokeStyle=col;g.lineWidth=2*k;g.beginPath();g.ellipse(q.x,q.y,r,r*.35,0,0,Math.PI*2);g.stroke();if(S.debug>=2||nd.occ||nd.res){g.font=`${9.5*k}px Segoe UI`;g.fillStyle=col;g.textAlign='center';g.fillText(`${nd.name}${nd.occ?' · '+(nd.occ==='player'?'YOU':'taken'):nd.res?' · reserved':''}`,q.x,q.y-6*k);}g.restore();}
  if(S.debug>=1){ // labels: nearest first; a label that would overlap another moves up, or is dropped
    const vis=RW.npcs.filter(n=>n.state!=='hidden'&&n.onScreen).sort((a,b)=>a.dist-b.dist),placed=[],sg=x=>(x>=0?'+':'')+Math.round(x);
    const fits=(x,y,w,h)=>!placed.some(r=>x<r.x+r.w&&x+w>r.x&&y<r.y+r.h&&y+h>r.y);
    vis.forEach((n,i)=>{const top=rwFP(v,n,1.98),foot=rwFP(v,n,0);if(!top||top.depth<.4)return;
      const full=S.debug>=2&&(i<3||n.dist<12),bad=n.resid>S.tolerance,vl=RW_VIEW_LABEL[n.view]+(n.view==='q'||n.view==='side'?(n.vsign>0?'R':'L'):'');
      const L=full?[`${n.name} · ${n.dist.toFixed(1)} m · ${n.state}${n.divert?' / '+n.divert:''}`,`body ${vl} · true angle ${Math.round(n.theta)}°`,`card turned ${sg(n.plane)}° · edge-on ${Math.round(n.resid)}°`,`head ${sg(n.head)}° → ${n.h.view}${n.attn?' · watching you':''}`]:[`${vl} ${Math.round(n.theta)}° · ${n.dist.toFixed(0)} m`];
      g.save();g.font=`${(full?10.5:10)*k}px Consolas, monospace`;const lh=12.5*k,cw=full?46*k:0,w=Math.max(...L.map(t=>g.measureText(t).width))+10*k+cw,h=Math.max(L.length*lh+6*k,full?44*k:0);
      let x=top.x-w/2,y=top.y-h-4*k,tries=0;while(!fits(x,y,w,h)&&tries<6){y-=h*.6+2*k;tries++;}if(!fits(x,y,w,h)||y<H*.13){g.restore();return;}placed.push({x,y,w,h});
      if(tries){g.strokeStyle='#ffffff55';g.lineWidth=k;g.beginPath();g.moveTo(top.x,y+h);g.lineTo(top.x,top.y);g.stroke();}
      g.fillStyle='#0c1823d8';g.fillRect(x,y,w,h);g.fillStyle=RW_VIEW_COLOR[n.view];g.fillRect(x,y,3*k,h);
      g.fillStyle=bad?'#ff8f7a':'#e8f4ee';g.textAlign='left';L.forEach((t,j)=>g.fillText(t,x+cw+7*k,y+(j+1)*lh));
      if(full)rwCompass(g,x+cw/2+3*k,y+h/2,17*k,n,k);g.restore();
      if(S.debug>=2&&foot){const f=C.basis(n.facing),tip=rwFP(v,{x:n.x+f.fx*1.1,y:n.y+f.fy*1.1},0);if(tip&&tip.depth>.4){g.save();g.strokeStyle='#7fe0a0';g.lineWidth=2.5*k;g.beginPath();g.moveTo(foot.x,foot.y);g.lineTo(tip.x,tip.y);g.stroke();g.restore();}}});
  }
  if(S.debug>=1)for(const car of RW.cars){if(car.state==='hidden'||!car.onScreen)continue;const top=rwFP(v,car,1.7);if(!top||top.depth<.4)continue;g.save();g.font=`${11*k}px Consolas, monospace`;g.fillStyle='#ffb98a';g.textAlign='center';g.fillText(`car ${car.view.toUpperCase()} · true ${Math.round(car.theta)}° · ${car.dist.toFixed(0)} m`,top.x,top.y);g.restore();}
  // crosshair
  g.save();g.strokeStyle='#ffffffcc';g.lineWidth=1.6*k;const cx=W/2,cy=H*RW_AIM_Y,s=9*k;g.beginPath();g.moveTo(cx-s,cy);g.lineTo(cx-3*k,cy);g.moveTo(cx+3*k,cy);g.lineTo(cx+s,cy);g.moveTo(cx,cy-s);g.lineTo(cx,cy-3*k);g.moveTo(cx,cy+3*k);g.lineTo(cx,cy+s);g.stroke();g.restore();
}
// ------------------------------------------------------------------ debug overlay: map (and the small map beside first person)
function rwMapLayers(g,k){
  const net=project.routeNet;if(!net||(!RW.showMap&&!RW.on))return;const z=C.storyElevation(project,0);if(active==='iso'&&activeStory!==0)return;const P=q=>C.isoPoint(project,q,z),line=(pts,col,w,dash)=>{g.save();g.strokeStyle=col;g.lineWidth=w*k;if(dash)g.setLineDash(dash.map(d=>d*k));g.beginPath();pts.map(P).forEach((q,i)=>i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y));g.stroke();g.restore();};
  const graph=RW.on?RW.graph:rwBuildGraph(net),band=RW.on?RW.settings.strafe:(net.settings?.defaults?.strafe??RW_DEFAULTS.strafe);
  for(const l of [...net.lanes,...net.traffic]){const tr=net.traffic.includes(l);line(l.points,tr?'#ff9a4aaa':'#56d6e0cc',tr?1.4:1.8,tr?[8,6]:null);const a=l.points[l.points.length-2],b=l.points[l.points.length-1];if(a&&b){const A=P(a),B=P(b),ang=Math.atan2(B.y-A.y,B.x-A.x),s=6*k;g.fillStyle=tr?'#ff9a4a':'#56d6e0';g.beginPath();g.moveTo(B.x,B.y);g.lineTo(B.x-Math.cos(ang-.5)*s,B.y-Math.sin(ang-.5)*s);g.lineTo(B.x-Math.cos(ang+.5)*s,B.y-Math.sin(ang+.5)*s);g.fill();}}
  for(const e of graph.edges){const bd=Math.min(e.band??9,band);line([e.A,e.B],'#ffd27a',2.6);if(bd>.01)for(const s of [-1,1])line([{x:e.A.x+e.rx*bd*s,y:e.A.y+e.ry*bd*s},{x:e.B.x+e.rx*bd*s,y:e.B.y+e.ry*bd*s}],'#ffd27a99',1,[4,4]);if(e.door){const m=P({x:(e.A.x+e.B.x)/2,y:(e.A.y+e.B.y)/2});g.fillStyle=rwEdgeBlock(e)?'#ff6b6b':'#7fe0a0';g.font=`bold ${9*k}px Segoe UI`;g.fillText(rwEdgeBlock(e)?'DOOR SHUT':'DOOR',m.x+4*k,m.y);}}
  for(const vx of graph.verts.values()){if(vx.edges.length<3)continue;const q=P(vx),s=6*k;g.fillStyle='#fff';g.beginPath();g.moveTo(q.x,q.y-s);g.lineTo(q.x+s,q.y);g.lineTo(q.x,q.y+s);g.lineTo(q.x-s,q.y);g.fill();}
  for(const zn of net.zones){R.polygon(g,[{x:zn.x,y:zn.y},{x:zn.x+zn.width,y:zn.y},{x:zn.x+zn.width,y:zn.y+zn.length},{x:zn.x,y:zn.y+zn.length}].map(P),'#e47cf022','#e47cf0',1.6*k);}
  const nodes=RW.on?RW.nodes:net.nodes;if(RW.on)for(const nd of nodes)if(nd.edge){const e=nd.edge;line([{x:e.A.x+e.ux*nd.s,y:e.A.y+e.uy*nd.s},nd],'#ffd27a',1.4,[2,3]);}
  for(const nd of nodes){const q=P(nd),col=nd.occ==='player'?'#ffd27a':nd.occ?'#ff6b6b':nd.res?'#ffb35c':'#7fe0a0';g.save();g.strokeStyle=col;g.lineWidth=2*k;g.beginPath();g.arc(q.x,q.y,5.5*k,0,Math.PI*2);g.stroke();g.fillStyle=col;g.font=`${8.5*k}px Segoe UI`;g.fillText((nd.types||[]).map(t=>t[0].toUpperCase()).join(''),q.x+7*k,q.y+3*k);g.restore();}
  for(const pt of net.portals){const q=P(pt);g.fillStyle=RW.on&&rwVisible(pt)?'#ff5d5d':'#b07cff';g.font=`bold ${9*k}px Segoe UI`;g.fillText('◆',q.x-3*k,q.y+3*k);}
  if(RW.on){for(const n of RW.npcs){if(n.state==='hidden')continue;const q=P(n),f=C.basis(n.facing),t=P({x:n.x+f.fx*.9,y:n.y+f.fy*.9});g.save();g.fillStyle=RW_VIEW_COLOR[n.view];g.strokeStyle='#0c1823';g.lineWidth=1.5*k;g.beginPath();g.arc(q.x,q.y,4.5*k,0,Math.PI*2);g.fill();g.stroke();g.strokeStyle=RW_VIEW_COLOR[n.view];g.beginPath();g.moveTo(q.x,q.y);g.lineTo(t.x,t.y);g.stroke();g.restore();}
    for(const car of RW.cars){if(car.state==='hidden')continue;const q=P(car);g.fillStyle='#ff9a4a';g.fillRect(q.x-5*k,q.y-3*k,10*k,6*k);}
    if(active==='iso')drawCamMarker(g,routeWalkView(),k,'#ffd27a','You');}
}
HOOKS.underGraph.push(rwMapLayers);
// ------------------------------------------------------------------ header button and safety
{const tb=$('testBtn');if(tb&&!$('routeBtn')){const b=document.createElement('button');b.id='routeBtn';b.textContent='Route walk';b.title='Prototype: walk the route network with NPC lanes (needs a project with a route network)';tb.parentNode.insertBefore(b,tb);b.onclick=()=>RW.on?rwStop():rwStart();}}
HOOKS.action.push(name=>{if(RW.on&&name!=='close-modal'){return true;}return false;});
EXT.route={RW,buildSight:rwBuildSight,sightBlock:(a,za,b,zb)=>rwSightBlock(a,za,b,zb),select:rwSelectView,start:rwStart,stop:rwStop,step:dt=>{rwStep(dt);},sync:rwSyncMeshes,pause:f=>{RW.paused=!!f;},input:o=>Object.assign(RW.in,o),
  look:(yaw,pitch)=>{if(yaw!=null)RW.pl.headYaw=C.clamp(yaw,-RW.settings.lookYaw,RW.settings.lookYaw);if(pitch!=null)RW.pl.pitch=pitch;},turn:rwTurnAround,crouch:f=>{RW.pl.crouch=!!f;},door:rwToggleDoor,shoot:rwShoot,
  stats:rwStatsSummary,reset:rwResetStats,set:(o)=>{Object.assign(RW.settings,o);},pos:()=>{const p=rwPlayerPos();return {x:+p.x.toFixed(2),y:+p.y.toFixed(2),edge:RW.pl.edge.id,s:+RW.pl.s.toFixed(2),off:+RW.pl.off.toFixed(2),body:Math.round(RW.pl.bodyYaw),head:Math.round(RW.pl.headYaw),stop:RW.pl.stop};},
  npcs:()=>RW.npcs.map(n=>({id:n.id,state:n.state,x:+n.x.toFixed(1),y:+n.y.toFixed(1),view:n.view,theta:Math.round(n.theta),resid:Math.round(n.resid),head:Math.round(n.head),onScreen:n.onScreen,node:n.node?.id||null}))};
