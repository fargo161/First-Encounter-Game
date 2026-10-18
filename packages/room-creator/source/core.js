/* TRAPSTAR Room Creator 0.13 — shared floor plan and authoring rules.
   0.13 adds project format 11: sky, rails, stairs, floor openings and viewpoint look up/down.
   Rooms are rectangles on stacked 2D stories. Wall intervals and attached apertures
   are derived from that plan. Viewpoints project the same objects into 2D.
   No 3D models, meshes, WebGL, packages, or network dependencies. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.RCCore = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  const EPS = 1e-6, SIDES = ['N','E','S','W'], SIDE_NAMES = {N:'North', E:'East', S:'South', W:'West'};
  const uid = prefix => prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,9);
  const clone = value => JSON.parse(JSON.stringify(value));
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const rad = angle => angle*Math.PI/180;
  const norm = angle => { const n=((angle%360)+360)%360; return n<EPS||360-n<EPS?0:n; };
  const round = (n,d=3) => Number(n.toFixed(d));
  const finite = (v,a,b,label) => { if(typeof v!=='number'||!Number.isFinite(v)||v<a||v>b) throw Error('Invalid '+label+'.'); return v; };
  const basis = angle => ({fx:Math.sin(rad(angle)),fy:-Math.cos(rad(angle)),rx:Math.cos(rad(angle)),ry:Math.sin(rad(angle))});
  const heading = (a,b) => norm(Math.atan2(b.x-a.x,-(b.y-a.y))*180/Math.PI);
  const fromDisplay = (n,units) => units==='ft'?n*.3048:n;
  const toDisplay = (n,units) => units==='ft'?n/.3048:n;
  const SURFACE_EXTRA = {mapping:'repeat',tileSizeY:null,flipX:false,flipY:false,brightness:1,contrast:1,saturation:1,hue:0,tintStrength:0,wear:0,secondary:'#d9d3c6',jointWidth:.015,baseHeight:0,baseColor:'#444951',capHeight:0,capColor:'#ddd9cf',coordinateMode:'local',filter:'pixel'};
  const surface = (color,finish='paint') => ({color,finish,textureId:null,tileSize:1,angle:0,offsetX:0,offsetY:0,textureOpacity:1,...SURFACE_EXTRA});
  const LIGHT_EXTRA={exposure:0,saturation:1,contrast:1};
  const OPENING_EXTRA={panes:2,leaves:1,frameWidth:.06,dividerWidth:.05,glassOpacity:.16,doorStyle:'panel',handleColor:'#c3a672'};
  const FINISHES=['paint','concrete','wood','tile','brick','image','wallpaper','carpet','terrazzo','checker'];
  function normalizeSurface(s,legacy=false){for(const [k,v]of Object.entries(SURFACE_EXTRA))if(s[k]===undefined)s[k]=k==='coordinateMode'&&legacy?'legacy':v;return s;}
  function normalizeOpening(o){for(const [k,v]of Object.entries(OPENING_EXTRA))if(o[k]===undefined)o[k]=v;return o;}

  const backdrop = (assetId=null) => ({assetId,fit:'cover',scale:1,offsetX:0,offsetY:0,alpha:1,distance:0});
  const PALETTES = {
    neutral:{name:'Neutral studio',wall:'#a8aaa6',floor:'#736d65',ceiling:'#afb2b4',finish:'concrete',tint:'#ffffff',brightness:1},
    apartment:{name:'Warm apartment',wall:'#b1a38d',floor:'#866548',ceiling:'#b9b0a1',finish:'wood',tint:'#ffd6a1',brightness:.92},
    midnight:{name:'Midnight violet',wall:'#66637c',floor:'#424550',ceiling:'#292c40',finish:'tile',tint:'#b8c4ff',brightness:.70},
    utility:{name:'Utility / slate',wall:'#829392',floor:'#555f61',ceiling:'#737e80',finish:'concrete',tint:'#c6edeb',brightness:.87},
    coastal:{name:'Coastal pastel',wall:'#b7d5cb',floor:'#ceae8d',ceiling:'#f2e7d1',finish:'wood',tint:'#fff2d5',brightness:1.04},
    noir:{name:'Noir monochrome',wall:'#99999f',floor:'#44444a',ceiling:'#77777d',finish:'concrete',tint:'#c6cede',brightness:.74,saturation:.05},
    tenement:{name:'Worn tenement',wall:'#aa9e83',floor:'#645143',ceiling:'#a7a08f',finish:'wood',tint:'#e5c090',brightness:.86,wear:.34},
    nightclub:{name:'After-hours club',wall:'#72566f',floor:'#312638',ceiling:'#403d57',finish:'checker',tint:'#d397ec',brightness:.8},
    lounge:{name:'Wood-panel lounge',wall:'#896548',floor:'#745663',ceiling:'#b7a68e',finish:'carpet',wallFinish:'wood',tint:'#f2c18f',brightness:.9},
    clean:{name:'Tiled workspace',wall:'#c7d4cf',floor:'#9aafa9',ceiling:'#dae6e4',finish:'tile',tint:'#e1fbff',brightness:1.05},
    sunset:{name:'Sunset terracotta',wall:'#c08c74',floor:'#b49871',ceiling:'#e2c8ac',finish:'terrazzo',tint:'#ffc393',brightness:1.02},
    deco:{name:'Deco stripes',wall:'#5c7d73',floor:'#443b48',ceiling:'#cec8ad',finish:'checker',wallFinish:'wallpaper',tint:'#efddb5',brightness:.95}
  };
  function makeRoom(name='Room 01', x=0,y=0,width=8,length=6,story=0) {
    return {id:uid('room'),name,x,y,width,length,story,openAbove:false,balconySides:[],
      floor:surface('#736d65','concrete'),wall:surface('#a8aaa6','paint'),ceiling:surface('#afb2b4','paint'),walls:{},
      light:{brightness:1,tint:'#ffffff',tintStrength:.18,...LIGHT_EXTRA},
      exterior:{default:backdrop(null),sides:{}}};
  }
  const SKY_DEFAULT={mode:'gradient',top:'#526984',horizon:'#5a708c',bottom:'#1f2631',curve:1,assetId:null,rotation:0,repeat:1,mirror:false,flipX:false,horizonV:.62,size:1,lift:0,fadeTop:.25,fadeBottom:.05,brightness:1,saturation:1,tint:'#ffffff',tintStrength:0,haze:{enabled:false,color:null,start:25,end:180,strength:.45}};
  const SKY_PRESETS={
    legacy:{name:'Editor slate (classic)',top:'#526984',horizon:'#5a708c',bottom:'#1f2631',curve:1},
    dusk:{name:'Purple dusk',top:'#3b3f8f',horizon:'#c7a3e6',bottom:'#241d33',curve:.7},
    sunset:{name:'Orange sunset',top:'#2f3f7a',horizon:'#ffb178',bottom:'#2a1d1d',curve:.55},
    night:{name:'City night',top:'#070b18',horizon:'#2d2a4a',bottom:'#06070c',curve:.8},
    overcast:{name:'Overcast day',top:'#8d97a3',horizon:'#c9cdd2',bottom:'#4d5257',curve:1.2},
    clear:{name:'Clear day',top:'#3d7fd6',horizon:'#bfe0f5',bottom:'#5b6670',curve:.9}
  };
  function defaultSky(){return clone(SKY_DEFAULT);}
  // 0.13.1 prototype: an optional route network (player routes, NPC lanes, nodes, zones, portals, traffic lanes).
  // Stored as authored data; only shape-checked here because the design is still being prototyped.
  function normalizeRouteNet(rn){if(!rn||typeof rn!=='object')return null;const out={...rn,version:1,settings:(rn.settings&&typeof rn.settings==='object')?rn.settings:{}}; // 0.14: unknown top-level keys are kept
    for(const k of ['vertices','edges','lanes','nodes','zones','portals','traffic','actors'])out[k]=Array.isArray(rn[k])?rn[k].filter(x=>x&&typeof x==='object'):[];
    const num=(v,n)=>{if(!Number.isFinite(v))throw Error('Route network: '+n+' must be a number.');};
    for(const v of out.vertices){num(v.x,'vertex X');num(v.y,'vertex Y');v.story=Number.isInteger(v.story)?v.story:0;}
    for(const l of [...out.lanes,...out.traffic])for(const q of l.points||[]){num(q.x,'lane point X');num(q.y,'lane point Y');}
    for(const n of [...out.nodes,...out.portals]){num(n.x,'node X');num(n.y,'node Y');}
    return out;}
  // ---------------------------------------------------------------- 0.14 placed 3D objects ("props")
  // A placed object is one scene instance of a library asset, referenced by the library's stable asset_id.
  // No model data is stored in the project. HARD RULE: every field this editor does not know is kept exactly
  // as written (custom tags, custom point types, extra properties, future keys), so later game systems and
  // later editor versions can add meaning without rebuilding old scenes.
  const isObj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
  const numOr=(v,d,lo=-Infinity,hi=Infinity)=>Number.isFinite(v)?Math.min(hi,Math.max(lo,v)):d;
  function validBounds(b){return isObj(b)&&Array.isArray(b.min)&&Array.isArray(b.max)&&b.min.length===3&&b.max.length===3&&[...b.min,...b.max].every(Number.isFinite)&&b.max[0]>=b.min[0]&&b.max[1]>=b.min[1]&&b.max[2]>=b.min[2];}
  function normalizePropPoint(pt){if(!isObj(pt))return null;
    if(typeof pt.id!=='string'||!pt.id)pt.id=uid('pt');if(typeof pt.type!=='string'||!pt.type.trim())pt.type='point';
    for(const k of ['x','y','z','yaw'])pt[k]=numOr(pt[k],0,-1e4,1e4);if(typeof pt.enabled!=='boolean')pt.enabled=true;
    if(pt.name!==undefined&&typeof pt.name!=='string')pt.name=String(pt.name);return pt;}
  function propScale(q){const s=q.scale;return Array.isArray(s)?s:[s,s,s];}
  function normalizeProp(p,q){if(!isObj(q))return null;
    if(typeof q.id!=='string'||!q.id)q.id=uid('prop');q.asset=typeof q.asset==='string'?q.asset:String(q.asset??'');
    if(q.name!==undefined&&typeof q.name!=='string')q.name=String(q.name);
    q.x=numOr(q.x,0,-500,500);q.y=numOr(q.y,0,-500,500);q.story=Number.isInteger(q.story)&&storyRecord(p,q.story)?q.story:0;
    q.z=numOr(q.z,0,-5,60);q.rotation=numOr(q.rotation,0,-1e5,1e5);
    if(Number.isFinite(q.scale))q.scale=[q.scale,q.scale,q.scale];if(!(Array.isArray(q.scale)&&q.scale.length===3&&q.scale.every(v=>Number.isFinite(v)&&v>0)))q.scale=[1,1,1];
    q.scale=q.scale.map(v=>Math.min(50,Math.max(.01,v)));
    if(typeof q.enabled!=='boolean')q.enabled=true;if(typeof q.locked!=='boolean')q.locked=false;
    if(!(typeof q.look==='string'&&q.look))q.look=null; // a look that no longer exists is kept as a reference to repair
    if(!isObj(q.override))q.override={};
    if(!isObj(q.collision))q.collision={solid:true,shape:'auto'};if(typeof q.collision.solid!=='boolean')q.collision.solid=true;if(typeof q.collision.shape!=='string')q.collision.shape='auto';
    if(!isObj(q.gameplay))q.gameplay={};if(!Array.isArray(q.gameplay.tags))q.gameplay.tags=typeof q.gameplay.tags==='string'&&q.gameplay.tags?[q.gameplay.tags]:[];if(q.gameplay.props===undefined)q.gameplay.props={};
    q.points=Array.isArray(q.points)?q.points.map(normalizePropPoint).filter(Boolean):[];
    if(q.bounds!==undefined&&!validBounds(q.bounds))delete q.bounds;
    const r=roomAtStory(p,q,q.story);q.roomId=r?r.id:null;return q;}
  function normalizeObjectLibrary(ol){if(!isObj(ol))return null;if(!Number.isInteger(ol.schema))ol.schema=1;
    ol.looks=Array.isArray(ol.looks)?ol.looks.filter(isObj):[];for(const l of ol.looks){if(typeof l.id!=='string'||!l.id)l.id=uid('look');if(typeof l.name!=='string')l.name=String(l.name??'Look');}
    ol.palettes=Array.isArray(ol.palettes)?ol.palettes.filter(isObj):[];for(const v of ol.palettes){if(typeof v.id!=='string'||!v.id)v.id=uid('palv');if(typeof v.name!=='string')v.name=String(v.name??'Palette');}
    if(!isObj(ol.setups))ol.setups={};for(const k of Object.keys(ol.setups))if(!isObj(ol.setups[k]))delete ol.setups[k];
    if(ol.looks.length>5000||ol.palettes.length>2000)throw Error('Too many looks or palettes in this project.');return ol;}
  // --- appearance: asset default <- reusable look <- this object's own override (only the fields below are drawn;
  // any other field in a look or override is kept untouched for later systems)
  const LOOK_FIELDS=['palette','texture','tint','tintStrength','brightness','contrast','saturation','hue','filter'];
  function lookById(p,id){return (p.objectLibrary?.looks||[]).find(l=>l.id===id)||null;}
  function paletteVariantById(p,id){return (p.objectLibrary?.palettes||[]).find(v=>v.id===id)||null;}
  function propAppearance(p,q){const look=q.look?lookById(p,q.look):null,o=isObj(q.override)?q.override:{},out={},from={};
    for(const k of LOOK_FIELDS){if(o[k]!==undefined&&o[k]!==null){out[k]=o[k];from[k]='object';}else if(look&&look[k]!==undefined&&look[k]!==null){out[k]=look[k];from[k]='look';}}
    if(out.palette==='default')delete out.palette;if(out.texture==='default')delete out.texture;
    return {...out,from,look,lookMissing:!!q.look&&!look};}
  // --- placement maths. Model space = the library GLB's own axes: metres, +Y up, front = +Z, +X = the model's left.
  // rotation = plan heading (0 north, 90 east) the model's front faces. An asset setup can say the real front is another side:
  // setup.frontTurn = 0 / 90 / 180 / 270 degrees from +Z toward +X (90 = the model's left side, 180 = the -Z end).
  // (setup.front===-1 is the older way of saying 180 and is still read.)
  function propFrontTurn(setup){if(!setup||typeof setup!=='object')return 0;if(Number.isFinite(setup.frontTurn))return norm(setup.frontTurn);return setup.front===-1?180:0;}
  function propYaw(q,setup){return Math.PI-rad(q.rotation||0)-rad(propFrontTurn(setup));}
  // Calibrations change heading labels, never the placed model's world transform.
  function preservePropSetup(p,asset,next){const old=propFrontTurn(p.objectLibrary?.setups?.[asset]),turn=propFrontTurn(next);
    for(const q of p.props||[])if(q.asset===asset)q.rotation=norm((q.rotation||0)+old-turn);}
  // Clip against the same convex footprint used by walking; includes the vertical interval.
  function propSegmentHits(a,za,b,zb,fp){let lo=0,hi=1,area=0;const poly=fp.poly;
    for(let i=0;i<poly.length;i++){const v=poly[i],w=poly[(i+1)%poly.length];area+=v.x*w.y-w.x*v.y;}
    const sign=area>=0?1:-1,clip=(v,d)=>{if(Math.abs(d)<1e-12)return v>=-1e-9;const t=-v/d;if(d>0)lo=Math.max(lo,t);else hi=Math.min(hi,t);return lo<=hi+1e-9;};
    for(let i=0;i<poly.length;i++){const v=poly[i],w=poly[(i+1)%poly.length],ex=w.x-v.x,ey=w.y-v.y;
      if(!clip(sign*(ex*(a.y-v.y)-ey*(a.x-v.x)),sign*(ex*(b.y-a.y)-ey*(b.x-a.x))))return false;}
    return clip(za-fp.z0,zb-za)&&clip(fp.z1-za,za-zb)&&hi>0&&lo<1;}
  function propAppearanceIssues(p,q,entry,lookup,hasImage,template){const app=propAppearance(p,q),issues=[];
    const add=(field,id,reason)=>issues.push({field,id:String(id),reason});
    if(app.palette){const id=app.palette,v=paletteVariantById(p,id),e=lookup(id);
      if(!v&&!e)add('palette',id,'Missing palette');
      else if(entry&&(entry.material_system!=='palette'||template?.paletteMismatch||(v?v.base:e.id)!==entry.paletteFamily))add('palette',id,'Incompatible palette');
      else if(v&&!v.image)add('palette',id,'Missing palette image');}
    if(app.texture){const tx=app.texture,id=tx.library||tx.image||JSON.stringify(tx),e=tx.library&&lookup(tx.library);
      if(tx.library? !e : tx.image? !hasImage(tx.image) : true)add('texture',id,'Missing texture');
      else if(tx.library&&e.asset_type!=='surface_texture')add('texture',id,'Incompatible texture');}
    return issues;}
  function propFloorZ(p,q){const r=roomAtStory(p,q,q.story||0);return r?roomElevation(p,r):storyElevation(p,q.story||0);}
  function propToPlan(q,local,setup,floorZ=0){const th=propYaw(q,setup),c=Math.cos(th),s=Math.sin(th),[sx,sy,sz]=propScale(q),mx=(local.x||0)*sx,mz=(local.z||0)*sz;
    return {x:q.x+c*mx+s*mz,y:q.y-s*mx+c*mz,z:floorZ+(q.z||0)+(local.y||0)*sy};}
  function planToProp(q,pt,setup){const th=propYaw(q,setup),c=Math.cos(th),s=Math.sin(th),[sx,,sz]=propScale(q),dx=pt.x-q.x,dy=pt.y-q.y;return {x:(c*dx-s*dy)/sx,z:(s*dx+c*dy)/sz};}
  function propPointHeading(q,pt,setup){return norm(180-(180/Math.PI)*(rad(pt.yaw||0)+propYaw(q,setup)));}
  function propBoundsOf(q,fallback){return validBounds(q.bounds)?q.bounds:validBounds(fallback)?fallback:{min:[-.25,0,-.25],max:[.25,.5,.25]};}
  // simple collision footprint in plan (polygon), with its height range
  function propFootprint(q,setup,bounds,floorZ=0){const b=propBoundsOf(q,bounds),col=q.collision||{},[sx,sy,sz]=propScale(q);
    let cx=(b.min[0]+b.max[0])/2,cz=(b.min[2]+b.max[2])/2,w=b.max[0]-b.min[0],d=b.max[2]-b.min[2],h=b.max[1]-b.min[1],y0=b.min[1];
    if((col.shape==='box'||col.shape==='cylinder')&&Array.isArray(col.size)&&col.size.length===3&&col.size.every(v=>Number.isFinite(v)&&v>0)){[w,d,h]=col.size;y0=0;}
    if(Array.isArray(col.offset)&&col.offset.length===2&&col.offset.every(Number.isFinite)){cx+=col.offset[0];cz+=col.offset[1];}
    let poly;if(col.shape==='cylinder'){const r=Math.max(w,d)/2;poly=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2;poly.push(propToPlan(q,{x:cx+Math.cos(a)*r,z:cz+Math.sin(a)*r},setup));}}
    else poly=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([u,v])=>propToPlan(q,{x:cx+u*w/2,z:cz+v*d/2},setup));
    const z0=floorZ+(q.z||0)+y0*sy;return {poly:poly.map(pt=>({x:pt.x,y:pt.y})),z0,z1:z0+h*sy,shape:col.shape==='cylinder'?'cylinder':'box',size:[w*sx,d*sz,h*sy]};}
  // a placed object stops walking when it is switched on, marked solid and overlaps knee-to-head height above its floor
  function propBlocksWalking(q,fp,floorZ=0){return q.enabled!==false&&q.collision?.solid!==false&&fp.z1>floorZ+.15&&fp.z0<floorZ+1.8;}
  function pointInPoly(pt,poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if(((a.y>pt.y)!==(b.y>pt.y))&&(pt.x<(b.x-a.x)*(pt.y-a.y)/((b.y-a.y)||1e-12)+a.x))inside=!inside;}return inside;}
  function segDist(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy,t=L?clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/L,0,1):0;return Math.hypot(p.x-a.x-dx*t,p.y-a.y-dy*t);}
  function polyDistToSegment(poly,a,b){if(pointInPoly(a,poly)||pointInPoly(b,poly))return 0;let best=Infinity;for(let i=0;i<poly.length;i++){const p0=poly[i],p1=poly[(i+1)%poly.length];best=Math.min(best,segDist(p0,a,b),segDist(p1,a,b),segDist(a,p0,p1),segDist(b,p0,p1));
      const d=(p1.x-p0.x)*(b.y-a.y)-(p1.y-p0.y)*(b.x-a.x);if(Math.abs(d)>1e-12){const t=((a.x-p0.x)*(b.y-a.y)-(a.y-p0.y)*(b.x-a.x))/d,u=((a.x-p0.x)*(p1.y-p0.y)-(a.y-p0.y)*(p1.x-p0.x))/d;if(t>=0&&t<=1&&u>=0&&u<=1)return 0;}}return best;}
  function normalizeSky(sky){const out=clone(SKY_DEFAULT);if(sky&&typeof sky==='object'){for(const k of Object.keys(SKY_DEFAULT))if(k!=='haze'&&sky[k]!==undefined)out[k]=sky[k];if(sky.haze&&typeof sky.haze==='object')for(const k of Object.keys(SKY_DEFAULT.haze))if(sky.haze[k]!==undefined)out.haze[k]=sky.haze[k];}return out;}
  function newProject() {
    const room = makeRoom();
    return {format:'trapstar-room-creator',version:11,sky:defaultSky(),rails:[],stairs:[],floorCuts:[],name:'Untitled floor plan',units:'m',grid:.5,wallHeight:2.7,storyHeight:3.2,
      stories:[{id:'story_0',index:0,name:'Ground'}],rooms:[room],floorSections:[],ceilingCuts:[],ceilingPatches:[],pillars:[],partitions:[],openings:[],lights:[],objects:[],viewpoints:[],pairs:[],links:[],startViewId:null,
      migrationNotes:[],stylePresets:[],legacyArchive:null};
  }
  function normalizeStories(p){
    if(!Array.isArray(p.stories)||!p.stories.length){const max=Math.max(0,...p.rooms.map(r=>r.story||0));p.stories=Array.from({length:max+1},(_,i)=>({id:'story_'+i,index:i,name:i===0?'Ground':'Floor '+(i+1)}));}
    p.stories.sort((a,b)=>a.index-b.index);p.stories.forEach((st,i)=>{st.index=i;st.id='story_'+i;st.name=String(st.name|| (i===0?'Ground':'Floor '+(i+1))).slice(0,80);});
    return p.stories;
  }
  function roomElevation(p,r){return (r?.story||0)*(p.storyHeight||3.2);}
  function storyElevation(p,story){return story*(p.storyHeight||3.2);}
  function roomTop(p,r){return roomElevation(p,r)+p.wallHeight;}
  function storyList(p){return normalizeStories(p).map(s=>s.index);}
  function storyRecord(p,index){return normalizeStories(p)[index]||null;}
  function roomAtStory(p,q,story,margin=0){return p.rooms.find(r=>(r.story||0)===story&&inRect(r,q,margin))||null;}
  function storyLabel(story){return story===0?'Ground':'Floor '+(story+1);}
  function storyName(p,index){const st=Array.isArray(p?.stories)?p.stories.find(s=>s&&s.index===index)||p.stories[index]:null;return (st&&st.name)?String(st.name):storyLabel(index);}
  function addStory(p,name=''){normalizeStories(p);const index=p.stories.length;if(index>20)throw Error('Use at most 21 stories.');let label=String(name||'').slice(0,80);if(!label){const taken=new Set(p.stories.map(s=>s.name));label=storyLabel(index);for(let k=2;taken.has(label);k++)label=storyLabel(index)+' ('+k+')';}const st={id:'story_'+index,index,name:label};p.stories.push(st);return st;}
  function renameStory(p,index,name){const st=storyRecord(p,index);if(!st)throw Error('Select an existing story.');st.name=String(name||storyLabel(index)).slice(0,80);return st;}
  function partitionStory(p,q){return Number.isInteger(q?.story)?q.story:(roomById(p,q?.roomId)?.story||0);}
  function storyContents(p,index){const on=x=>(x.story??roomById(p,x.roomId)?.story??0)===index,rooms=p.rooms.filter(r=>(r.story||0)===index),rids=new Set(rooms.map(r=>r.id));
    return {rooms:rooms.length,floorSections:(p.floorSections||[]).filter(on).length,walls:(p.partitions||[]).filter(q=>partitionStory(p,q)===index).length,pillars:(p.pillars||[]).filter(on).length,ceilingEdits:[...(p.ceilingCuts||[]),...(p.ceilingPatches||[])].filter(on).length,
      openings:p.openings.filter(o=>rids.has(o.roomId)).length,lights:p.lights.filter(l=>rids.has(l.roomId)).length,props:(p.props||[]).filter(on).length,objects:p.objects.filter(o=>(o.story||0)===index).length,viewpoints:p.viewpoints.filter(v=>(v.story||0)===index).length,stairs:(p.stairs||[]).filter(on).length,floorCuts:(p.floorCuts||[]).filter(x=>(x.story||0)===index&&!x.stairId).length};}
  function clearStory(p,index){const rids=new Set(p.rooms.filter(r=>(r.story||0)===index).map(r=>r.id)),on=x=>(x.story??roomById(p,x.roomId)?.story??0)===index;
    for(const v of p.viewpoints.filter(v=>(v.story||0)===index))deleteView(p,v.id);
    if(p.props)p.props=p.props.filter(x=>!on(x));p.objects=p.objects.filter(o=>(o.story||0)!==index);const gone=new Set((p.partitions||[]).filter(q=>partitionStory(p,q)===index).map(q=>q.id));
    p.openings=p.openings.filter(o=>!rids.has(o.roomId)&&!gone.has(o.partitionId));p.lights=p.lights.filter(l=>!rids.has(l.roomId));
    p.partitions=(p.partitions||[]).filter(q=>!gone.has(q.id));p.floorSections=(p.floorSections||[]).filter(x=>!on(x));p.pillars=(p.pillars||[]).filter(x=>!on(x));
    p.ceilingCuts=(p.ceilingCuts||[]).filter(x=>!rids.has(x.roomId));p.ceilingPatches=(p.ceilingPatches||[]).filter(x=>!rids.has(x.roomId));p.rooms=p.rooms.filter(r=>!rids.has(r.id));
    for(const st of (p.stairs||[]).filter(s=>(s.story||0)===index||(s.story||0)===index-1))deleteStairs(p,st.id);p.floorCuts=(p.floorCuts||[]).filter(x=>(x.story||0)!==index);
    for(const rail of p.rails||[])rail.nodes=rail.nodes.filter(n=>n.kind!=='via'||(n.story||0)!==index);
    if(!p.rooms.length)throw Error('A project needs at least one enclosed room. Keep a room on another story.');rehostWalls(p);cleanupSources(p);}
  function rehostWalls(p){for(const q of p.partitions||[])if(!roomById(p,q.roomId)){const st=partitionStory(p,q),l=partitionLine(q),mid=wallPoint(l,(l.start+l.end)/2);q.roomId=(roomAtStory(p,mid,st)||p.rooms.find(r=>(r.story||0)===st)||p.rooms[0]).id;q.story=st;}}
  function deleteStory(p,index,{collapse=true,force=false}={}){normalizeStories(p);if(index<0||index>=p.stories.length)throw Error('Select an existing story.');if(p.stories.length===1)throw Error('A project needs at least one story.');if(force)clearStory(p,index);
    const used=[...p.rooms,...(p.floorSections||[]),...(p.ceilingCuts||[]),...(p.ceilingPatches||[]),...(p.pillars||[]),...(p.partitions||[]),...(p.stairs||[]),...(p.floorCuts||[]),...(p.props||[])].some(x=>(x.story??roomById(p,x.roomId)?.story??0)===index)||p.objects.some(x=>(x.story||0)===index)||p.viewpoints.some(x=>(x.story||0)===index);
    if(used)throw Error('This story still contains architecture, objects or viewpoints. Delete or move them first.');
    const shifted=p.stories.slice(index+1).map((st,k)=>({st,wasDefault:st.name===storyLabel(index+1+k)}));
    p.stories.splice(index,1);if(collapse){for(const arr of [p.rooms,p.floorSections||[],p.ceilingCuts||[],p.ceilingPatches||[],p.pillars||[],p.partitions||[],p.props||[],p.objects,p.viewpoints,p.stairs||[],p.floorCuts||[],...(p.rails||[]).map(r=>r.nodes.filter(n=>n.kind==='via'))])for(const x of arr)if((x.story||0)>index)x.story--;}
    shifted.forEach(({st,wasDefault},k)=>{if(wasDefault)st.name=storyLabel(index+k);});normalizeStories(p);return true;}
  function deleteRoom(p,id){const r=roomById(p,id);if(!r)throw Error('Select a room.');if(p.rooms.length<2)throw Error('Keep at least one enclosed room. New starts a fresh empty plan.');const st=r.story||0,inside=q=>(q.story??st)===st&&inRect(r,q);
    const t=clone(p);t.rooms=t.rooms.filter(q=>q.id!==id);const removed={objects:0,props:0,viewpoints:0};
    for(const v of t.viewpoints.filter(v=>v.roomId===id||((v.story||0)===st&&!v.roomId&&inRect(r,v))))if(inFloor(t,v,.055,st)){v.roomId=null;}else{deleteView(t,v.id);removed.viewpoints++;}
    t.objects=t.objects.filter(o=>{if(o.roomId!==id&&!(inside(o)&&!o.roomId))return true;o.roomId=null;if(objectInside(t,o))return true;removed.objects++;return false;});
    if(t.props)t.props=t.props.filter(q=>{if(q.roomId!==id&&!(inside(q)&&!q.roomId))return true;const host=roomAtStory(t,q,q.story||0);q.roomId=host?host.id:null;if(inFloor(t,q,0,q.story||0))return true;removed.props++;return false;});
    const gone=new Set((t.partitions||[]).filter(q=>q.roomId===id&&!q.free).map(q=>q.id));t.partitions=(t.partitions||[]).filter(q=>!gone.has(q.id));
    t.openings=t.openings.filter(o=>o.roomId!==id&&!gone.has(o.partitionId));t.lights=t.lights.filter(l=>l.roomId!==id);
    t.ceilingCuts=(t.ceilingCuts||[]).filter(q=>q.roomId!==id);t.ceilingPatches=(t.ceilingPatches||[]).filter(q=>q.roomId!==id);rehostWalls(t);cleanupSources(t);
    Object.assign(p,t);return removed;}
  function floorSectionToRoom(p,id,{name=''}={}){const f=floorSectionById(p,id);if(!f)throw Error('Select floor space first.');
    if(f.width<2-EPS||f.length<2-EPS)throw Error('An enclosed room must be at least 2 m in each direction. Resize the floor space first.');if(f.width>40+EPS||f.length>40+EPS)throw Error('An enclosed room can be at most 40 m in each direction.');
    const host=floorSectionHost(p,f)||p.rooms[0],r=makeRoom(name||String(f.name||'Room').replace(/ · floor space$/,'')+' · room',f.x,f.y,f.width,f.length,f.story||0);
    r.floor=clone(f.floor);r.ceiling=clone(host.ceiling);r.wall=clone(host.wall);r.light=clone(host.light);r.exterior=clone(host.exterior);
    const t=clone(p);t.rooms.push(r);checkRooms(t);t.floorSections=t.floorSections.filter(q=>q.id!==id);
    for(const x of [...t.viewpoints,...t.objects,...(t.props||[])])if(!x.roomId&&(x.story||0)===r.story&&inRect(r,x))x.roomId=r.id;
    Object.assign(p,t);return roomById(p,r.id);}
  function addStoryWithRooms(p,{name='',sourceIds=null}={}){normalizeStories(p);const t=clone(p),st=addStory(t,name),below=st.index-1;
    let src=t.rooms.filter(r=>(r.story||0)===below);if(Array.isArray(sourceIds))src=src.filter(r=>sourceIds.includes(r.id));const made=[];
    const stName=st.name;
    if(src.length){for(const b of src){const r=makeRoom(b.name+' · '+stName,b.x,b.y,b.width,b.length,st.index);for(const k of ['floor','wall','ceiling','walls','light','exterior'])r[k]=clone(b[k]);t.rooms.push(r);made.push(r.id);}}
    else{const fl=(t.floorSections||[]).filter(f=>(f.story||0)===below),xs=fl.flatMap(f=>[f.x,f.x+f.width]),ys=fl.flatMap(f=>[f.y,f.y+f.length]),ref=t.rooms[0];
      let box=fl.length?{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),l:Math.max(...ys)-Math.min(...ys)}:{x:ref.x,y:ref.y,w:ref.width,l:ref.length};box.w=clamp(box.w,2,40);box.l=clamp(box.l,2,40);
      const r=makeRoom('Room · '+stName,box.x,box.y,box.w,box.l,st.index);for(const k of ['floor','wall','ceiling','light','exterior'])r[k]=clone(ref[k]);t.rooms.push(r);made.push(r.id);}
    checkRooms(t);Object.assign(p,t);return {story:st.index,roomIds:made};}
  function addRoomAbove(p,roomId,{storyDelta=1,offsetX=0,offsetY=0,width=null,length=null,name=''}={}){
    const base=roomById(p,roomId);if(!base)throw Error('Choose a room to build above.');
    const story=(base.story||0)+storyDelta;if(storyDelta<1||story>20)throw Error('Upper rooms must be placed 1–20 stories above the selected room.');normalizeStories(p);const trial=clone(p);while(trial.stories.length<=story)addStory(trial);
    const r=makeRoom(name||base.name+' · upper',base.x+offsetX,base.y+offsetY,width||base.width,length||base.length,story);
    r.floor=clone(base.floor);r.wall=clone(base.wall);r.ceiling=clone(base.ceiling);r.light=clone(base.light);r.exterior=clone(base.exterior);
    trial.rooms.push(r);checkRooms(trial);while(p.stories.length<=story)addStory(p);p.rooms=trial.rooms;return r;
  }
  function applyPalette(room,key) {
    const v=PALETTES[key]; if(!v)throw Error('Unknown room palette.');
    room.wall=surface(v.wall,v.wallFinish||'paint');room.floor=surface(v.floor,v.finish);room.ceiling=surface(v.ceiling);if(v.wear){room.wall.wear=v.wear;room.floor.wear=v.wear*.6;}
    room.walls={};room.light={brightness:v.brightness,tint:v.tint,tintStrength:.18,...LIGHT_EXTRA,saturation:v.saturation??1};
  }
  function roomById(p,id) { return p.rooms.find(r=>r.id===id)||null; }
  function inRect(r,q,margin=0) {
    return Number.isFinite(q.x)&&Number.isFinite(q.y)&&q.x>=r.x+margin-EPS&&q.y>=r.y+margin-EPS&&q.x<=r.x+r.width-margin+EPS&&q.y<=r.y+r.length-margin+EPS;
  }
  function roomAt(p,q,margin=0,story=null) { if(story==null&&Number.isInteger(q?.story))story=q.story;return p.rooms.find(r=>(story==null||(r.story||0)===story)&&inRect(r,q,margin))||null; }
  function floorSectionAt(p,q,story,margin=0){return (p.floorSections||[]).find(f=>(f.story||0)===story&&inRect(f,q,margin))||null;}
  function floorCutAt(p,q,story){return (p.floorCuts||[]).find(c=>(c.story||0)===story&&q.x>c.x+EPS&&q.x<c.x+c.width-EPS&&q.y>c.y+EPS&&q.y<c.y+c.length-EPS)||null;}
  function inFloor(p,q,margin=0,story=null) { if(story==null&&Number.isInteger(q?.story))story=q.story;if(story==null)story=0;
    const hit=z=>(!!roomAt(p,z,0,story)||!!floorSectionAt(p,z,story,0))&&!floorCutAt(p,z,story);if(!hit(q))return false;if(margin<=0)return true;
    return [[margin,0],[-margin,0],[0,margin],[0,-margin]].every(([x,y])=>hit({x:q.x+x,y:q.y+y}));
  }
  function bounds(p) {
    const rects=[...p.rooms,...(p.floorSections||[]),...(p.pillars||[]).map(q=>({x:q.x-q.width/2,y:q.y-q.depth/2,width:q.width,length:q.depth}))];const xs=rects.flatMap(r=>[r.x,r.x+r.width]),ys=rects.flatMap(r=>[r.y,r.y+(r.length??r.depth??0)]);
    return {x:Math.min(...xs),y:Math.min(...ys),maxX:Math.max(...xs),maxY:Math.max(...ys),width:Math.max(...xs)-Math.min(...xs),length:Math.max(...ys)-Math.min(...ys)};
  }
  function roomsOverlap(a,b) {
    return Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>EPS&&Math.min(a.y+a.length,b.y+b.length)-Math.max(a.y,b.y)>EPS;
  }
  function checkRooms(p) {
    if(!p.rooms.length||p.rooms.length>80)throw Error('Use between 1 and 80 room sections.');
    finite(p.storyHeight||3.2,2.2,8,'story height');
    for(let i=0;i<p.rooms.length;i++){
      const r=p.rooms[i];if(!Number.isInteger(r.story))r.story=0;if(r.story<0||r.story>20)throw Error('Room story must be Ground through Floor 21.');if(!storyRecord(p,r.story))throw Error('Room story does not exist. Add stories contiguously first.');r.openAbove=!!r.openAbove;r.balconySides=Array.isArray(r.balconySides)?r.balconySides.filter(x=>SIDES.includes(x)):[];
      finite(r.x,-150,150,'room X');finite(r.y,-150,150,'room Y');finite(r.width,2,40,'room width');finite(r.length,2,40,'room length');
      for(let j=0;j<i;j++)if((r.story||0)===(p.rooms[j].story||0)&&roomsOverlap(r,p.rooms[j]))throw Error('“'+r.name+'” overlaps “'+p.rooms[j].name+'” on '+storyName(p,r.story)+'. Rooms may overlap only on different stories.');
    }
  }
  function lightingRoomAt(p,q,story){const st=Number.isInteger(story)?story:(q?.story||0),r=roomAtStory(p,q,st);if(r)return r;const f=floorSectionAt(p,q,st,0);return f?floorSectionHost(p,f):(p.rooms.find(x=>(x.story||0)===st)||p.rooms[0]||null);}
  function floorSectionHost(p,f){const story=f?.story||0,c={x:(f?.x||0)+(f?.width||0)/2,y:(f?.y||0)+(f?.length||0)/2};let r=roomAtStory(p,c,story);for(let s=story-1;!r&&s>=0;s--)r=roomAtStory(p,c,s);return r||p.rooms.find(q=>(q.story||0)===story)||p.rooms[0]||null;}
  function makeFloorSection(p,story,a,b,options={}){normalizeStories(p);if(!storyRecord(p,story))throw Error('Add/select the story first.');const x=Math.min(a.x,b.x),y=Math.min(a.y,b.y),width=Math.abs(b.x-a.x),length=Math.abs(b.y-a.y);if(width<.25||length<.25)throw Error('Floor sections must be at least 0.25 m in both directions.');const base=floorSectionHost(p,{story,x,y,width,length});const f={id:uid('floor'),name:options.name||'Floor section '+((p.floorSections||[]).length+1),story,x,y,width,length,floor:clone(base.floor),underside:clone(base.ceiling)};p.floorSections=p.floorSections||[];p.floorSections.push(f);return f;}
  function makeCeilingRect(p,roomId,a,b,kind='cut'){const r=roomById(p,roomId);if(!r)throw Error('Select a room first.');const x=Math.max(r.x,Math.min(a.x,b.x)),y=Math.max(r.y,Math.min(a.y,b.y)),x2=Math.min(r.x+r.width,Math.max(a.x,b.x)),y2=Math.min(r.y+r.length,Math.max(a.y,b.y));if(x2-x<.2||y2-y<.2)throw Error('Ceiling section is too small.');const rec={id:uid(kind==='cut'?'ceilcut':'ceilpatch'),name:(kind==='cut'?'Ceiling opening ':'Ceiling patch ')+(((kind==='cut'?p.ceilingCuts:p.ceilingPatches)||[]).length+1),roomId:r.id,story:r.story||0,x,y,width:x2-x,length:y2-y,surface:clone(r.ceiling)};(kind==='cut'?(p.ceilingCuts=p.ceilingCuts||[]):(p.ceilingPatches=p.ceilingPatches||[])).push(rec);return rec;}
  function pointInRect(r,x,y){return x>=r.x-EPS&&x<=r.x+r.width+EPS&&y>=r.y-EPS&&y<=r.y+r.length+EPS;}
  function ceilingPatchAt(p,r,x,y){return (p.ceilingPatches||[]).find(q=>q.roomId===r.id&&pointInRect(q,x,y))||null;}
  function ceilingExistsAt(p,r,x,y){const patch=ceilingPatchAt(p,r,x,y);if(patch)return true;if(r.openAbove)return false;if((p.ceilingCuts||[]).some(q=>q.roomId===r.id&&pointInRect(q,x,y)))return false;return true;}
  function ceilingSurfaceAt(p,r,x,y){const patch=ceilingPatchAt(p,r,x,y);return patch?.surface||r.ceiling;}
  function createFreeWall(p,story,a,b,options={}){normalizeStories(p);if(!storyRecord(p,story))throw Error('Add/select the story first.');if(Math.hypot(b.x-a.x,b.y-a.y)<.35)throw Error('Wall must be at least 0.35 m long.');const host=options.roomId?roomById(p,options.roomId):roomAtStory(p,a,story)||p.rooms.find(r=>(r.story||0)===story)||p.rooms[0];const axis=Math.abs(b.x-a.x)>=Math.abs(b.y-a.y)?'h':'v',q={id:uid('partition'),name:options.name||'Free wall '+((p.partitions||[]).length+1),roomId:host.id,story,axis,x:axis==='h'?Math.min(a.x,b.x):a.x,y:axis==='v'?Math.min(a.y,b.y):a.y,length:axis==='h'?Math.abs(b.x-a.x):Math.abs(b.y-a.y),height:options.height??null,free:true,faces:{A:clone(host.wall),B:clone(host.wall)}};p.partitions.push(q);checkPartitions(p);return q;}
  function createPillar(p,story,point,options={}){normalizeStories(p);if(!storyRecord(p,story))throw Error('Add/select the story first.');const host=roomAtStory(p,point,story)||p.rooms.find(r=>(r.story||0)===story)||p.rooms[0],q={id:uid('pillar'),name:options.name||'Pillar '+((p.pillars||[]).length+1),story,x:point.x,y:point.y,width:options.width??.45,depth:options.depth??.45,height:options.height??(p.storyHeight||3.2),surface:clone(host.wall),blocks:true};p.pillars=p.pillars||[];p.pillars.push(q);return q;}
  function pillarById(p,id){return (p.pillars||[]).find(q=>q.id===id)||null;}

  // ---------------------------------------------------------------- stairs (0.13)
  // A straight flight on story `story` rising to story+1. dir = direction of ascent (N/E/S/W).
  // The footprint below is solid; the same footprint becomes a floor opening on the story above.
  const STAIR_DIRS={N:{x:0,y:-1},S:{x:0,y:1},E:{x:1,y:0},W:{x:-1,y:0}};
  function stairById(p,id){return (p.stairs||[]).find(s=>s.id===id)||null;}
  function stairGeometry(p,st){const sh=p.storyHeight||3.2,steps=st.steps||Math.max(3,Math.round(sh/.18)),d=STAIR_DIRS[st.dir]||STAIR_DIRS.N,along=st.dir==='N'||st.dir==='S'?st.length:st.width,across=st.dir==='N'||st.dir==='S'?st.width:st.length;
    const cx=st.x+st.width/2,cy=st.y+st.length/2,half=along/2,bottom={x:cx-d.x*half,y:cy-d.y*half},top={x:cx+d.x*half,y:cy+d.y*half};
    return {steps,rise:sh/steps,run:along/steps,along,across,dir:d,bottom,top,base:storyElevation(p,st.story||0),
      entry:{x:bottom.x-d.x*.45,y:bottom.y-d.y*.45,story:st.story||0},exit:{x:top.x+d.x*.45,y:top.y+d.y*.45,story:(st.story||0)+1}};}
  function stairRect(st){return {x:st.x,y:st.y,width:st.width,length:st.length};}
  function createStairs(p,{story,x,y,width=1.1,length=null,dir='N',steps=null,rails=true,cutCeiling=true,name=''}={}){
    normalizeStories(p);if(!storyRecord(p,story))throw Error('Choose an existing story for the bottom of the stairs.');if(!storyRecord(p,story+1))throw Error('Add the story above first. Stairs climb to the next story.');
    if(!STAIR_DIRS[dir])throw Error('Choose a stair direction.');const sh=p.storyHeight||3.2,n=steps||Math.max(3,Math.round(sh/.18)),run=length??n*.28;
    const st={id:uid('stairs'),name:name||'Stairs '+((p.stairs||[]).length+1),story,x,y,width:dir==='N'||dir==='S'?width:run,length:dir==='N'||dir==='S'?run:width,dir,steps:n,surface:surface('#8d8a83','concrete'),rails:!!rails};
    const host=roomAtStory(p,{x:x+st.width/2,y:y+st.length/2},story);if(host)st.surface=clone(host.floor);if(st.surface.finish==='image'){st.surface.finish='concrete';st.surface.textureId=null;}
    const trial=clone(p);trial.stairs=trial.stairs||[];trial.floorCuts=trial.floorCuts||[];trial.stairs.push(st);applyStairCuts(trial,st,{rails,cutCeiling});checkStairs(trial);
    Object.assign(p,trial);return stairById(p,st.id);}
  function applyStairCuts(p,st,{rails=true,cutCeiling=true}={}){
    const up=(st.story||0)+1,g=stairGeometry(p,st);
    p.floorCuts=(p.floorCuts||[]).filter(c=>c.stairId!==st.id);p.floorCuts.push({id:uid('floorcut'),name:st.name+' · opening above',story:up,x:st.x,y:st.y,width:st.width,length:st.length,stairId:st.id});
    p.ceilingCuts=(p.ceilingCuts||[]).filter(c=>c.stairId!==st.id);
    if(cutCeiling)for(const r of p.rooms.filter(r=>(r.story||0)===(st.story||0))){const x0=Math.max(r.x,st.x),y0=Math.max(r.y,st.y),x1=Math.min(r.x+r.width,st.x+st.width),y1=Math.min(r.y+r.length,st.y+st.length);if(x1-x0>=.2&&y1-y0>=.2&&!r.openAbove)p.ceilingCuts.push({id:uid('ceilcut'),name:st.name+' · stairwell',roomId:r.id,story:r.story||0,x:x0,y:y0,width:x1-x0,length:y1-y0,surface:clone(r.ceiling),stairId:st.id});}
    p.partitions=(p.partitions||[]).filter(q=>q.stairId!==st.id);
    if(rails){const host=roomAtStory(p,{x:st.x+st.width/2,y:st.y+st.length/2},up)||p.rooms.find(r=>(r.story||0)===up)||roomAtStory(p,{x:st.x+st.width/2,y:st.y+st.length/2},st.story||0)||p.rooms[0],h=Math.min(1.05,p.wallHeight);
      // Guard rails on the upper story round three sides of the opening; the arrival side stays open.
      const sides={N:['W','E','S'],S:['W','E','N'],E:['N','S','W'],W:['N','S','E']}[st.dir];
      for(const side of sides){const axis=side==='N'||side==='S'?'h':'v',x=side==='E'?st.x+st.width:st.x,y=side==='S'?st.y+st.length:st.y,len=axis==='h'?st.width:st.length;
        if(len<.35)continue;const q={id:uid('partition'),name:st.name+' · guard rail',roomId:host.id,story:up,axis,x,y,length:len,height:h,free:true,faces:{A:surface('#2b2d31'),B:surface('#2b2d31')},stairId:st.id};p.partitions.push(q);
        p.openings.push(normalizeOpening({id:uid('opening'),name:st.name+' · rail spindles',roomId:host.id,side:null,partitionId:q.id,offset:0,width:len,bottom:.1,height:Math.max(.2,h-.16),kind:'window',open:true,trim:true,frameColor:'#2b2d31',panelColor:'#735843',glassColor:'#202020',textureId:null,panes:len>2.2?2:1,leaves:1,frameWidth:.04,dividerWidth:.04,glassOpacity:0,doorStyle:'panel',handleColor:'#c3a672'}));}
    }
    void g;}
  function deleteStairs(p,id){p.stairs=(p.stairs||[]).filter(s=>s.id!==id);p.floorCuts=(p.floorCuts||[]).filter(c=>c.stairId!==id);p.ceilingCuts=(p.ceilingCuts||[]).filter(c=>c.stairId!==id);const gone=new Set((p.partitions||[]).filter(q=>q.stairId===id).map(q=>q.id));p.partitions=(p.partitions||[]).filter(q=>!gone.has(q.id));p.openings=p.openings.filter(o=>!gone.has(o.partitionId));cleanupSources(p);}
  function editStairs(p,id,changes){const trial=clone(p),st=stairById(trial,id);if(!st)throw Error('Select stairs.');for(const k of Object.keys(changes))if(!['name','x','y','width','length','dir','steps','rails'].includes(k))throw Error('Unknown stair setting.');Object.assign(st,changes);applyStairCuts(trial,st,{rails:st.rails!==false,cutCeiling:true});checkStairs(trial);Object.assign(p,trial);return stairById(p,id);}
  function checkStairs(p){for(const st of p.stairs||[]){if(!Number.isInteger(st.story)||!storyRecord(p,st.story))throw Error('Stairs need an existing story.');if(!storyRecord(p,st.story+1))throw Error('“'+st.name+'” climbs to a story that does not exist. Add the story above or delete the stairs.');if(!STAIR_DIRS[st.dir])throw Error('Invalid stair direction.');
      finite(st.x,-200,200,'stair X');finite(st.y,-200,200,'stair Y');finite(st.width,.5,12,'stair width');finite(st.length,.5,12,'stair length');finite(st.steps,3,60,'stair step count');
      const g=stairGeometry(p,st);if(g.across<.6)throw Error('Stairs must be at least 0.6 m wide.');if(g.along<1)throw Error('Stairs must be at least 1 m long.');
      const c={x:st.x+st.width/2,y:st.y+st.length/2};if(!(roomAt(p,c,0,st.story)||floorSectionAt(p,c,st.story,0)))throw Error('Place stairs on floor space or inside a room.');}}
  function floorSectionById(p,id){return (p.floorSections||[]).find(q=>q.id===id)||null;}
  function wallLine(room,side) {
    switch(side){
      case 'N':return {axis:'h',fixed:room.y,start:room.x,end:room.x+room.width};
      case 'S':return {axis:'h',fixed:room.y+room.length,start:room.x,end:room.x+room.width};
      case 'E':return {axis:'v',fixed:room.x+room.width,start:room.y,end:room.y+room.length};
      case 'W':return {axis:'v',fixed:room.x,start:room.y,end:room.y+room.length};
      default:throw Error('Choose a room wall.');
    }
  }
  function wallPoint(line,t) {return line.axis==='h'?{x:t,y:line.fixed}:{x:line.fixed,y:t};}
  function partitionById(p,id) { return (p.partitions||[]).find(q=>q.id===id)||null; }
  function partitionLine(q) {
    const start=q.axis==='h'?q.x:q.y;
    return {axis:q.axis,fixed:q.axis==='h'?q.y:q.x,start,end:start+q.length};
  }
  function partitionHeight(p,q) {return q.height==null?p.wallHeight:q.height;}
  function partitionWall(p,q) {
    const l=partitionLine(q);
    const r=roomById(p,q.roomId);return {...l,id:'partition_wall_'+q.id,kind:q.free?'freewall':'partition',partitionId:q.id,story:q.story??r?.story??0,height:partitionHeight(p,q),
      owners:['A','B'].map(face=>({roomId:q.roomId,partitionId:q.id,face,side:face})),a:wallPoint(l,l.start),b:wallPoint(l,l.end)};
  }
  function wallBase(p,owner) {
    if(owner.partitionId){const q=partitionById(p,owner.partitionId);if(!q)throw Error('This partition no longer exists.');return partitionLine(q);}
    return wallLine(roomById(p,owner.roomId),owner.side);
  }
  function isBalconyWall(p,owner){if(owner?.partitionId)return false;const r=roomById(p,owner.roomId);return !!r&&(r.story||0)>0&&r.balconySides?.includes(owner.side);}
  function wallCap(p,w) {if(w.partitionId)return partitionHeight(p,partitionById(p,w.partitionId));const owner=w.owners[0];return isBalconyWall(p,owner)?1.05:p.wallHeight;}
  function openingHostLine(p,o) {
    if(o.partitionId){const q=partitionById(p,o.partitionId);if(!q)throw Error('An opening lost its partition.');return partitionLine(q);}
    const r=roomById(p,o.roomId);if(!r)throw Error('An opening lost its wall.');return wallLine(r,o.side);
  }
  function openingCap(p,o) {return o.partitionId?partitionHeight(p,partitionById(p,o.partitionId)):p.wallHeight;}
  function openingHostLabel(p,o) {
    return o.partitionId?(partitionById(p,o.partitionId)?.name||'Missing partition'):(roomById(p,o.roomId)?.name||'Missing room')+' · '+SIDE_NAMES[o.side]+' wall';
  }
  function checkPartitions(p) {
    if(!Array.isArray(p.partitions)||p.partitions.length>150)throw Error('Use at most 150 interior partitions.');
    for(const q of p.partitions){
      const r=roomById(p,q.roomId);if(!r)throw Error('A partition/wall needs a style host room.');if(!Number.isInteger(q.story))q.story=r.story||0;
      if(!['h','v'].includes(q.axis))throw Error('Partition direction must be East–West or North–South.');
      finite(q.x,-200,200,'partition X');finite(q.y,-200,200,'partition Y');finite(q.length,.35,40,'partition length');
      if(q.height!=null)finite(q.height,.3,p.wallHeight,'partition height');
      const l=partitionLine(q);
      if(!q.free){if(!inRect(r,wallPoint(l,l.start))||!inRect(r,wallPoint(l,l.end)))throw Error('“'+q.name+'” leaves its room. Move or shorten the partition before resizing the room.');const lo=q.axis==='h'?r.y:r.x,hi=lo+(q.axis==='h'?r.length:r.width);if(l.fixed<lo+.04||l.fixed>hi-.04)throw Error('Interior partitions must lie inside the room, not on its boundary wall.');}
      if(q.exterior||q.matte||q.backdrop)throw Error('An interior partition cannot have an exterior matte. Its openings reveal the room behind it.');
      for(const other of p.partitions){if(other.id===q.id)continue;const ol=partitionLine(other);
        if(partitionStory(p,q)===partitionStory(p,other)&&sameLine(l,ol)&&Math.min(l.end,ol.end)-Math.max(l.start,ol.start)>EPS)throw Error('Interior partitions cannot overlap on the same line.');
      }
    }
    // A junction may meet solid partition, but may not run through its doorway/window.
    for(const o of p.openings||[])if(o.partitionId){const l=openingLine(p,o);
      const hostStory=partitionStory(p,partitionById(p,o.partitionId));for(const q of p.partitions)if(q.id!==o.partitionId&&partitionStory(p,q)===hostStory){const b=partitionLine(q);if(l.axis===b.axis)continue;
        if(b.fixed>l.start+EPS&&b.fixed<l.end-EPS&&l.fixed>=b.start-EPS&&l.fixed<=b.end+EPS)throw Error('A partition junction crosses an existing opening. Move the opening or the partition.');
      }
    }
  }
  function createPartition(p,roomId,a,b,options={}) {
    const r=roomById(p,roomId);if(!r)throw Error('Choose a room first.');
    if(!a||!b||Math.hypot(b.x-a.x,b.y-a.y)<.35)throw Error('Click two points at least 0.35 metres apart.');
    const axis=options.axis||(Math.abs(b.x-a.x)>=Math.abs(b.y-a.y)?'h':'v');
    const q={id:uid('partition'),name:'Partition '+((p.partitions||[]).length+1),roomId,axis,
      x:axis==='h'?Math.min(a.x,b.x):a.x,y:axis==='v'?Math.min(a.y,b.y):a.y,
      length:axis==='h'?Math.abs(b.x-a.x):Math.abs(b.y-a.y),height:null,free:false,story:r.story||0,
      faces:{A:clone(r.wall),B:clone(r.wall)}};
    if(options.name)q.name=String(options.name).slice(0,180);if(options.height!=null)q.height=options.height;
    const trial={...p,partitions:[...(p.partitions||[]),q]};checkPartitions(trial);checkViewpoints(trial);
    p.partitions=trial.partitions;return q;
  }
  function editPartition(p,id,changes) {
    const trial=clone(p),q=partitionById(trial,id);if(!q)throw Error('Select an interior partition.');
    const allowed=['name','x','y','length','axis','height'];
    for(const key of Object.keys(changes))if(!allowed.includes(key))throw Error('Unknown partition setting.');
    Object.assign(q,changes);checkPartitions(trial);for(const o of trial.openings)validateOpening(trial,o);checkViewpoints(trial);
    p.partitions=trial.partitions;return partitionById(p,id);
  }
  function deletePartition(p,id) {
    p.partitions=(p.partitions||[]).filter(q=>q.id!==id);p.openings=p.openings.filter(o=>o.partitionId!==id);cleanupSources(p);
  }
  function roomWalls(p) {
    // Split collinear boundaries at all endpoints, then deduplicate shared walls.
    const groups=new Map();
    for(const room of p.rooms)for(const side of SIDES){
      const l=wallLine(room,side),story=room.story||0,key=story+':'+l.axis+':'+round(l.fixed,5);
      if(!groups.has(key))groups.set(key,[]);groups.get(key).push({...l,roomId:room.id,side,story});
    }
    const out=[];
    for(const lines of groups.values()){
      const stops=[...new Set(lines.flatMap(l=>[round(l.start,5),round(l.end,5)]))].sort((a,b)=>a-b);
      for(let i=0;i<stops.length-1;i++){
        const start=stops[i],end=stops[i+1],mid=(start+end)/2;
        const owners=lines.filter(l=>mid>l.start-EPS&&mid<l.end+EPS).map(l=>({roomId:l.roomId,side:l.side}));
        if(!owners.length||end-start<EPS)continue;
        const l=lines[0],id='wall_'+l.story+'_'+l.axis+'_'+round(l.fixed,5)+'_'+start+'_'+end;
        out.push({id,story:l.story,axis:l.axis,fixed:l.fixed,start,end,owners,a:wallPoint(l,start),b:wallPoint(l,end)});
      }
    }
    return out.concat((p.partitions||[]).map(q=>partitionWall(p,q)));
  }
  function openingLine(p,o) {
    const l=openingHostLine(p,o);return {...l,start:l.start+o.offset,end:l.start+o.offset+o.width};
  }
  function sameLine(a,b) {return a.axis===b.axis&&Math.abs(a.fixed-b.fixed)<EPS;}
  function openingsForWall(p,w) {
    return p.openings.filter(o=>{if((o.partitionId||null)!==(w.partitionId||null))return false;const r=roomById(p,o.roomId);if(!w.partitionId&&(r?.story||0)!==(w.story||0))return false;const l=openingLine(p,o);return sameLine(l,w)&&Math.min(l.end,w.end)-Math.max(l.start,w.start)>EPS;});
  }
  function adjacentRoom(p,o) {
    if(o.partitionId)return roomById(p,o.roomId);
    const l=openingLine(p,o),mid=(l.start+l.end)/2;
    const story=roomById(p,o.roomId)?.story||0,wall=roomWalls(p).find(w=>!w.partitionId&&(w.story||0)===story&&sameLine(l,w)&&mid>=w.start-EPS&&mid<=w.end+EPS);
    const other=wall?.owners.find(a=>a.roomId!==o.roomId);return other?roomById(p,other.roomId):null;
  }
  function ownerFacing(w,q,p) {
    if(w.partitionId){const positive=w.axis==='h'?q.y>=w.fixed:q.x>=w.fixed;return w.owners.find(o=>o.face===(positive?'A':'B'))||w.owners[0];}
    const owner=w.owners.find(o=>{
      const r=roomById(p,o.roomId);
      return (o.side==='N'&&q.y>=r.y)||(o.side==='S'&&q.y<=r.y+r.length)||(o.side==='E'&&q.x<=r.x+r.width)||(o.side==='W'&&q.x>=r.x);
    });return owner||w.owners[0];
  }
  function wallStyle(p,owner) { if(owner.partitionId)return partitionById(p,owner.partitionId).faces[owner.face||owner.side||'A'];const r=roomById(p,owner.roomId);return r.walls[owner.side]||r.wall; }
  function backdropFor(p,owner) {
    if(owner.partitionId||isBalconyWall(p,owner))return null;
    // A read must not create overrides or change the project. Empty overrides
    // deliberately inherit their room's default image and framing.
    const r=roomById(p,owner.roomId),ex=r?.exterior;
    const side=ex?.sides?.[owner.side];
    return side?.assetId?side:ex?.default?.assetId?ex.default:null;
  }
  function backdropFrame(p,owner,spec=backdrop()) {
    const room=roomById(p,owner.roomId);
    if(owner.partitionId||!room||!SIDES.includes(owner.side))throw Error('An exterior matte needs a room boundary side, never an interior partition.');
    const line=wallLine(room,owner.side),center=wallPoint(line,(line.start+line.end)/2);
    const outward={N:{x:0,y:-1},E:{x:1,y:0},S:{x:0,y:1},W:{x:-1,y:0}}[owner.side];
    // Image left/right is defined while standing INSIDE and looking OUT.
    const right={x:-outward.y,y:outward.x},distance=spec.distance??0;
    return {roomId:room.id,side:owner.side,line,center,outward,right,distance,
      plane:{x:center.x+outward.x*distance,y:center.y+outward.y*distance},
      width:line.end-line.start,height:p.wallHeight,baseZ:roomElevation(p,room)};
  }
  function backdropRay(frame,origin,dir,eyeHeight,verticalSlope=0) {
    const denom=dir.x*frame.outward.x+dir.y*frame.outward.y;
    // Only the interior, outward-looking face exposes an exterior matte.
    if(denom<=1e-8)return null;
    const depth=((frame.plane.x-origin.x)*frame.outward.x+(frame.plane.y-origin.y)*frame.outward.y)/denom;
    if(depth<0)return null;
    const x=origin.x+dir.x*depth,y=origin.y+dir.y*depth,z=eyeHeight+verticalSlope*depth;
    return {depth,x,y,z,u:.5+((x-frame.center.x)*frame.right.x+(y-frame.center.y)*frame.right.y)/frame.width,
      v:1-(z-(frame.baseZ||0))/frame.height};
  }
  function backdropAtWall(frame,pos,height,dir,verticalSlope=0) {
    const q=wallPoint(frame.line,pos);
    return backdropRay(frame,q,dir,(frame.baseZ||0)+height,verticalSlope);
  }
  function backdropUV(spec,frame,u,v,imageWidth,imageHeight) {
    // Fit to the WHOLE SIDE canvas, never to a window or its visible pixels.
    // This single transform is shared by the first-person renderer, isometric
    // openings and the side-composition preview.
    const imageAspect=imageWidth/imageHeight,frameAspect=frame.width/frame.height;
    let sx=1,sy=1;
    if(spec.fit==='contain') {
      if(imageAspect>=frameAspect)sy=frameAspect/imageAspect;else sx=imageAspect/frameAspect;
    } else if(spec.fit!=='stretch') {
      if(imageAspect>=frameAspect)sx=imageAspect/frameAspect;else sy=frameAspect/imageAspect;
    }
    const zoom=spec.scale??1;
    const x=.5+(u-.5)/(sx*zoom)+(spec.offsetX??0),y=.5+(v-.5)/(sy*zoom)+(spec.offsetY??0);
    // No repeated skies and no smeared/clamped edge pixels outside the image.
    if(x<0||x>1||y<0||y>1)return null;
    return {u:x,v:y};
  }
  function openingAt(p,w,pos) {
    return openingsForWall(p,w).find(o=>{const l=openingLine(p,o);return pos>=l.start-EPS&&pos<=l.end+EPS;})||null;
  }
  // Bounds are calculated in metres against *all* cuts on the same host line,
  // including cuts authored from the opposite face of a shared wall.
  function openingRanges(p,o){
    const l=openingHostLine(p,o),line=openingLine(p,o),cap=openingCap(p,o);let left=0,right=l.end-l.start;
    for(const b of p.openings){if(b.id===o.id||(b.partitionId||null)!==(o.partitionId||null))continue;if(!o.partitionId&&(roomById(p,b.roomId)?.story||0)!==(roomById(p,o.roomId)?.story||0))continue;
      const bl=openingLine(p,b);if(!sameLine(line,bl))continue;
      if(bl.end<=line.start+EPS)left=Math.max(left,bl.end-l.start);
      if(bl.start>=line.end-EPS)right=Math.min(right,bl.start-l.start);
    }
    return {offset:{min:round(left,6),max:round(right-o.width,6)},width:{min:.35,max:round(right-o.offset,6)},height:{min:.2,max:round(cap-o.bottom,6)},bottom:{min:0,max:round(cap-o.height,6)}};
  }
  function editOpening(p,id,changes){
    const o=p.openings.find(a=>a.id===id);if(!o)throw Error('Select an existing opening.');
    const old=clone(o);try{Object.assign(o,changes);normalizeOpening(o);validateOpening(p,o);checkViewpoints(p);}catch(e){Object.assign(o,old);throw e;}return o;
  }
  function openingGeometry(o){
    const frame=o.trim?Math.min(o.frameWidth??.06,o.width/4,o.height/4):0;
    return {frame,head:frame?frame+.005:0,sill:o.kind==='window'&&frame?frame*.75:0,
      divider:o.kind==='window'&&o.trim&&(o.panes??2)===2?Math.min(o.dividerWidth??.05,o.width/6):0};
  }
  function styleSnapshot(r){return clone({wall:r.wall,floor:r.floor,ceiling:r.ceiling,walls:r.walls,light:r.light});}
  function applyStyleSnapshot(r,look,{textures=true}={}){
    const q=clone(look);if(!textures){for(const s of [q.wall,q.floor,q.ceiling,...Object.values(q.walls||{})]){s.textureId=null;if(s.finish==='image')s.finish='paint';}}
    for(const key of ['wall','floor','ceiling','walls','light'])r[key]=q[key];
  }
  function validateOpening(p,o,others=p.openings) {
    const r=roomById(p,o.roomId),part=o.partitionId?partitionById(p,o.partitionId):null;
    if(!r||(o.partitionId?(!part||part.roomId!==o.roomId):!SIDES.includes(o.side)))throw Error('Doors, windows and open sections must be attached to an existing wall or interior partition.');
    if(!['door','window','passage'].includes(o.kind))throw Error('Choose Door, Window, or Open wall.');
    const l=openingHostLine(p,o),len=l.end-l.start,height=openingCap(p,o);
    finite(o.offset,0,len,'distance along wall');finite(o.width,.35,40,'opening width');
    if(o.offset+o.width>len+EPS)throw Error('This opening does not fit on its wall.');
    finite(o.bottom,0,height-.2,'window sill');finite(o.height,.2,height,'opening height');
    if(o.bottom+o.height>height+EPS)throw Error('The opening is taller than its wall.');
    if(o.kind!=='window'&&o.bottom>EPS)throw Error('A door or open wall must reach the floor.');
    const ol=openingLine(p,o);
    for(const b of others)if(b.id!==o.id&&(b.partitionId||null)===(o.partitionId||null)&& (o.partitionId||(roomById(p,b.roomId)?.story||0)===(r.story||0))){
      const bl=openingLine(p,b);if(sameLine(ol,bl)&&Math.min(ol.end,bl.end)-Math.max(ol.start,bl.start)>.001)throw Error('This opening overlaps “'+b.name+'”. Use a free span beside it, or resize/move one of the openings.');
    }
    normalizeOpening(o);
    if(![1,2].includes(o.panes)||![1,2].includes(o.leaves))throw Error('Choose one or two window panes / door leaves.');
    finite(o.frameWidth,.01,.18,'frame width');finite(o.dividerWidth,.01,.15,'window divider width');finite(o.glassOpacity,0,.75,'glass tint strength');
    if(!['panel','flush','slatted'].includes(o.doorStyle))throw Error('Unknown door face style.');
    if(typeof o.handleColor!=='string'||!/^#[0-9a-f]{6}$/i.test(o.handleColor))throw Error('Invalid handle colour.');
    if(typeof o.open!=='boolean')throw Error('Invalid door state.');
    return true;
  }
  function createOpening(p,roomId,side,offset,kind='door',options={}) {
    if(!roomById(p,roomId))throw Error('Select a wall first.');
    const part=options.partitionId?partitionById(p,options.partitionId):null;
    if(options.partitionId&&!part)throw Error('Select an existing interior partition.');
    const o={id:uid('opening'),name:kind==='passage'?'Open wall':kind==='window'?'Window':'Door',roomId,side,offset,
      width:kind==='window'?1.6:kind==='passage'?2:1.0,bottom:kind==='window'?.9:0,height:kind==='window'?1.25:kind==='passage'?p.wallHeight:2.1,
      kind,open:true,trim:kind!=='passage',frameColor:'#d0c7b7',panelColor:'#735843',glassColor:'#87bdd6',textureId:null,...OPENING_EXTRA,...options};
    if(part){o.side=null;const cap=partitionHeight(p,part);if(options.height==null)o.height=Math.min(o.height,cap-o.bottom);}
    validateOpening(p,o);const trial={...p,openings:[...p.openings,o]};checkPartitions({...trial,partitions:trial.partitions||[]});p.openings.push(o);return o;
  }
  function unusedWallSpans(p,w) {
    const occupied=openingsForWall(p,w).map(o=>openingLine(p,o)).sort((a,b)=>a.start-b.start),out=[];let cursor=w.start;
    for(const o of occupied){const end=Math.min(w.end,o.start);if(end-cursor>=.35-EPS)out.push({start:cursor,end});cursor=Math.max(cursor,o.end);}
    if(w.end-cursor>=.35-EPS)out.push({start:cursor,end:w.end});return out;
  }
  function suggestOpening(p,w,preferredWidth=1,center=(w.start+w.end)/2) {
    const gaps=unusedWallSpans(p,w);if(!gaps.length)throw Error('No unused span at least 0.35 m remains here. Resize or remove an existing opening first.');
    gaps.sort((a,b)=>Math.abs(clamp(center,a.start,a.end)-center)-Math.abs(clamp(center,b.start,b.end)-center)||(b.end-b.start)-(a.end-a.start));
    const gap=gaps[0],width=Math.min(preferredWidth,gap.end-gap.start),start=clamp(center-width/2,gap.start,gap.end-width);
    return {start,width,gap};
  }
  function fullOpenWall(p,w) {
    const owner=w.owners[0],base=wallBase(p,owner);
    if(openingsForWall(p,w).length)throw Error('This wall already has openings. Use Open unused spans to keep its doors and windows.');
    return createOpening(p,owner.roomId,w.partitionId?null:owner.side,round(w.start-base.start,5),'passage',{partitionId:w.partitionId||null,width:round(w.end-w.start,5),height:wallCap(p,w),trim:false,name:w.partitionId?'Partition · open':w.owners.length>1?'Shared wall · open':'Exterior wall · open'});
  }
  function openUnusedSpans(p,w) {
    const gaps=unusedWallSpans(p,w);if(!gaps.length)throw Error('No unused span at least 0.35 m remains here.');
    const trial=clone(p),owner=w.owners[0],base=wallBase(trial,owner),added=[];
    for(const gap of gaps)added.push(createOpening(trial,owner.roomId,w.partitionId?null:owner.side,round(gap.start-base.start,5),'passage',{partitionId:w.partitionId||null,width:round(gap.end-gap.start,5),height:wallCap(trial,w),trim:false,name:'Open span '+(trial.openings.length+1)}));
    p.openings=trial.openings;return added;
  }
  function exteriorSpans(p,o) {
    if(o.partitionId)return [];const l=openingLine(p,o);
    const story=roomById(p,o.roomId)?.story||0;return roomWalls(p).filter(w=>!w.partitionId&&(w.story||0)===story&&w.owners.length===1&&sameLine(l,w)&&Math.min(l.end,w.end)-Math.max(l.start,w.start)>EPS)
      .map(w=>({start:Math.max(l.start,w.start),end:Math.min(l.end,w.end)}));
  }
  function canAttachRoom(p,o) {
    if(!o||o.partitionId)return false;
    return exteriorSpans(p,o).reduce((sum,q)=>sum+q.end-q.start,0)>=o.width-EPS;
  }
  function attachRoomPlan(p,openingId,{width=4,length=3,inset=null,name=''}={}) {
    const o=p.openings.find(q=>q.id===openingId);if(!canAttachRoom(p,o))throw Error('Choose an opening entirely on an exterior boundary. Interior openings and partitions already reveal the space behind them.');
    finite(width,2,40,'new room width');finite(length,2,40,'new room length');
    const parent=roomById(p,o.roomId),line=openingLine(p,o),span=line.axis==='h'?width:length;
    if(span<o.width-EPS)throw Error('The new room’s adjoining wall must be at least as wide as the selected opening.');
    inset=inset==null?(span-o.width)/2:inset;finite(inset,0,Math.max(0,span-o.width),'opening inset on new wall');
    let x,y;
    if(o.side==='N'||o.side==='S'){x=line.start-inset;y=o.side==='N'?parent.y-length:parent.y+parent.length;}
    else {y=line.start-inset;x=o.side==='W'?parent.x-width:parent.x+parent.width;}
    const room=makeRoom(name||'Room '+String(p.rooms.length+1).padStart(2,'0'),x,y,width,length,parent.story||0);
    room.floor=clone(parent.floor);room.wall=clone(parent.wall);room.ceiling=clone(parent.ceiling);room.light=clone(parent.light);
    const trial=clone(p);trial.rooms.push(room);checkRooms(trial);checkPartitions({...trial,partitions:trial.partitions||[]});
    // Preserve the aperture's identity, style, frame, cover references and door state.
    const attached=trial.openings.find(q=>q.id===openingId),shared=roomWalls(trial).filter(w=>!w.partitionId&&w.owners.some(a=>a.roomId===room.id)&&w.owners.some(a=>a.roomId===parent.id));
    const spanCovered=shared.reduce((sum,w)=>sum+Math.max(0,Math.min(w.end,line.end)-Math.max(w.start,line.start)),0);
    if(spanCovered<o.width-EPS)throw Error('The new room must cover the whole existing opening.');
    for(const op of trial.openings)validateOpening(trial,op);checkViewpoints(trial);
    const affected=p.openings.filter(op=>!op.partitionId&&op.roomId!==room.id&&canAttachRoom(p,op)&&shared.some(w=>{const ol=openingLine(p,op);return sameLine(ol,w)&&Math.min(ol.end,w.end)-Math.max(ol.start,w.start)>EPS;})).map(op=>op.name);
    return {project:trial,room,opening:attached,affected};
  }
  function attachRoom(p,openingId,options={}) {const plan=attachRoomPlan(p,openingId,options);p.rooms=plan.project.rooms;return plan.room;}
  function rayHit(w,origin,dir) {
    const denom=w.axis==='h'?dir.y:dir.x;if(Math.abs(denom)<1e-10)return null;
    const t=(w.fixed-(w.axis==='h'?origin.y:origin.x))/denom;if(t<=.00001)return null;
    const pos=(w.axis==='h'?origin.x:origin.y)+t*(w.axis==='h'?dir.x:dir.y);
    return pos>=w.start-EPS&&pos<=w.end+EPS?{depth:t,pos,point:wallPoint(w,pos)}:null;
  }
  function segmentInFloor(p,a,b,story=null) {
    story=story??a.story??b.story??0;const dir={x:b.x-a.x,y:b.y-a.y},ts=[0,1];
    for(const r of p.rooms.filter(r=>(r.story||0)===story)){
      if(Math.abs(dir.x)>EPS)for(const x of [r.x,r.x+r.width]){const t=(x-a.x)/dir.x;if(t>0&&t<1)ts.push(t);}
      if(Math.abs(dir.y)>EPS)for(const y of [r.y,r.y+r.length]){const t=(y-a.y)/dir.y;if(t>0&&t<1)ts.push(t);}
    }
    ts.sort((a,b)=>a-b);
    return inFloor(p,a,0,story)&&inFloor(p,b,0,story)&&ts.slice(0,-1).every((t,i)=>{const mid=(t+ts[i+1])/2;return inFloor(p,{x:a.x+dir.x*mid,y:a.y+dir.y*mid},0,story);});
  }
  function routeCheck(p,a,b,{ignoreDoorState=false}={}) {
    if(!a||!b)return {ok:false,reason:'Missing route endpoint.'};
    const storyA=a.story??roomById(p,a.roomId)?.story??0,storyB=b.story??roomById(p,b.roomId)?.story??0;
    if(storyA!==storyB)return {ok:true,reason:'Vertical transition between stories'};
    if(!segmentInFloor(p,a,b,storyA))return {ok:false,reason:'This line leaves the floor plan. Add a viewpoint at the bend and connect shorter routes.'};
    const dir={x:b.x-a.x,y:b.y-a.y};
    for(const w of roomWalls(p).filter(w=>(w.story??0)===storyA)){
      const h=rayHit(w,a,dir);if(!h||h.depth>=1-EPS)continue;
      const o=openingAt(p,w,h.pos);
      if(!o)return {ok:false,reason:'A solid wall blocks this route. Add a door or open wall section.',wallId:w.id};
      const ol=openingLine(p,o),jamb=openingGeometry(o).frame;
      if(h.pos<ol.start+jamb||h.pos>ol.end-jamb||o.height<1.65||o.kind==='window')return {ok:false,reason:'This route crosses a window, frame, or opening that cannot be walked through.',openingId:o.id};
      if(o.kind==='door'&&!o.open&&!ignoreDoorState)return {ok:false,reason:'The connecting door is closed.',openingId:o.id};
    }
    return {ok:true,reason:''};
  }
  function lens(v) {return {f:v.width/(2*Math.tan(rad(v.fov)/2)),horizon:v.height*clamp(v.horizon??.42,.1,.9)};}
  function localFloor(v,p) {const b=basis(v.facing),x=p.x-v.x,y=p.y-v.y;return {side:x*b.rx+y*b.ry,depth:x*b.fx+y*b.fy};}
  function fpPoint(v,p,height=0) {const q=localFloor(v,p);if(q.depth<.075)return null;const k=lens(v),scale=k.f/q.depth,eye=(v.floorZ||0)+v.eyeHeight,target=(p.floorZ||0)+height;return {x:v.width/2+q.side*scale,y:k.horizon+(eye-target)*scale,scale,depth:q.depth};}
  function fpInverse(v,q,height=0) {const k=lens(v),dy=q.y-k.horizon,eye=(v.floorZ||0)+v.eyeHeight,target=(v.floorZ||0)+height;if(dy<=2||eye<=target)return null;const depth=(eye-target)*k.f/dy,side=(q.x-v.width/2)*depth/k.f,b=basis(v.facing);return {x:v.x+b.fx*depth+b.rx*side,y:v.y+b.fy*depth+b.ry*side,story:v.story||0};}
  const isoFrames=new WeakMap();let mapMode='iso';
  // 0.13: the map can be drawn as the classic isometric view or as a flat top-down plan. Both are affine, so every
  // overlay, hit test and drag uses the same isoPoint / isoInverse pair whichever is active.
  function setMapProjection(mode){mapMode=mode==='plan'?'plan':'iso';}
  function mapProjection(){return mapMode;}
  function setIsoFrame(p,frame){if(frame)isoFrames.set(p,frame);else isoFrames.delete(p);}
  function isoTransform(p,W=1440,H=1080) {
    if(W===1440&&H===1080&&isoFrames.has(p)&&isoFrames.get(p).mode===mapMode)return isoFrames.get(p);
    if(mapMode==='plan'){const raw=bounds(p),b={...raw,x:raw.x-2,y:raw.y-2,width:raw.width+4,length:raw.length+4},s=Math.min((W-120)/b.width,(H-140)/b.length);return {mode:'plan',s,ox:(W-b.width*s)/2,oy:(H-b.length*s)/2,minX:b.x,minY:b.y};}
    const raw=bounds(p),b={...raw,x:raw.x-2,y:raw.y-2,width:raw.width+4,length:raw.length+4},maxTop=Math.max(...p.rooms.map(r=>roomTop(p,r)),...(p.pillars||[]).map(q=>storyElevation(p,q.story||0)+q.height),storyElevation(p,Math.max(0,(p.stories?.length||1)-1))+p.wallHeight),minZ=Math.min(...p.rooms.map(r=>roomElevation(p,r)),0),lift=(maxTop-minZ)*1.1,s=Math.min((W-200)/(b.width+b.length),(H-245)/((b.width+b.length)*.5+lift));
    return {mode:'iso',s,ox:W/2+(b.length-b.width)*s/2,oy:80+lift*s,minX:b.x,minY:b.y};
  }
  function isoPoint(p,q,height=0,W=1440,H=1080) {const t=isoTransform(p,W,H),x=q.x-t.minX,y=q.y-t.minY;if(t.mode==='plan')return {x:t.ox+x*t.s,y:t.oy+y*t.s};return {x:t.ox+(x-y)*t.s,y:t.oy+(x+y)*t.s*.5-height*t.s*1.1};}
  function isoInverse(p,q,height=0,W=1440,H=1080) {const t=isoTransform(p,W,H);if(t.mode==='plan')return {x:(q.x-t.ox)/t.s+t.minX,y:(q.y-t.oy)/t.s+t.minY};const dx=(q.x-t.ox)/t.s,dy=(q.y-t.oy+height*t.s*1.1)/(t.s*.5);return {x:(dx+dy)/2+t.minX,y:(dy-dx)/2+t.minY};}
  function footprint(o) {const a=rad(o.facing),co=Math.cos(a),si=Math.sin(a);return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y])=>({x:o.x+x*o.width/2*co-y*o.depth/2*si,y:o.y+x*o.width/2*si+y*o.depth/2*co}));}
  function objectInside(p,o) {const story=o.story??roomById(p,o.roomId)?.story??0,points=footprint(o);return inFloor(p,o,0,story)&&points.every((a,i)=>segmentInFloor(p,{...a,story},{...points[(i+1)%4],story},story));}
  function extent(o) {const a=rad(o.facing),co=Math.abs(Math.cos(a)),si=Math.abs(Math.sin(a));return {x:(o.width*co+o.depth*si)/2,y:(o.width*si+o.depth*co)/2};}
  function clampObject(p,o) {
    if(objectInside(p,o))return {x:o.x,y:o.y};const e=extent(o),choices=[],story=o.story??roomById(p,o.roomId)?.story??0;
    for(const r of [...p.rooms,...(p.floorSections||[])].filter(r=>(r.story||0)===story))if(2*e.x<=r.width+EPS&&2*e.y<=r.length+EPS){const q={x:clamp(o.x,r.x+e.x,r.x+r.width-e.x),y:clamp(o.y,r.y+e.y,r.y+r.length-e.y)};choices.push(q);}
    if(!choices.length)throw Error('This object is larger than the available floor sections. Reduce its footprint or enlarge the room.');
    choices.sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y));return choices[0];
  }
  function createObject(asset,point,roomId=null,p=null) {
    const r=p&&roomId?roomById(p,roomId):null;return {id:uid('obj'),name:asset.name,assetId:asset.id,isoAssetId:asset.id,viewAssetId:asset.id,variants:{front:null,right:null,back:null,left:null},
      x:point.x,y:point.y,roomId:r?.id||null,story:r?(r.story||0):(Number.isInteger(point.story)?point.story:0),floorZ:p?(r?roomElevation(p,r):storyElevation(p,Number.isInteger(point.story)?point.story:0)):0,width:1,depth:.5,height:1,mount:0,facing:180,rotation:0,opacity:1,flipX:false,flipY:false,visible:true,locked:false,
      blocks:false,artFit:'height',surface:'sprite',anchorX:.5,anchorY:1,layer:0};
  }
  function facingSlot(o,v) {let rel=norm(heading(o,v)-o.facing);if(rel>180)rel-=360;return Math.abs(rel)<=45?'front':Math.abs(rel)>=135?'back':rel>0?'right':'left';}
  function assetFor(o,kind,v) {if(kind==='iso')return {id:o.surface==='panel'?o.viewAssetId:o.isoAssetId,fallback:false,slot:'iso'};const slot=facingSlot(o,v);return {id:o.variants[slot]||o.viewAssetId||o.assetId,slot,fallback:!o.variants[slot]&&slot!=='front'};}
  function rectFor(p,o,kind,v,asset) {
    let foot,w,h,depth;
    if(kind==='iso'){const t=isoTransform(p);const r=roomById(p,o.roomId)||roomAt(p,o,0,o.story??0);const z=(r?roomElevation(p,r):storyElevation(p,o.story||0))+o.mount;foot=isoPoint(p,o,z);w=(o.width+o.depth*.55)*t.s;h=(o.height*1.1+o.depth*.5)*t.s;depth=o.x+o.y;}
    else {foot=fpPoint(v,o,o.mount);if(!foot)return null;w=o.width*foot.scale;h=o.height*foot.scale;depth=foot.depth;}
    if(o.artFit!=='stretch'&&o.surface==='sprite')w=h*asset.width/asset.height;
    return {id:o.id,assetId:asset.id,x:foot.x+(.5-o.anchorX)*w,y:foot.y+(.5-o.anchorY)*h,w,h,foot,depth,rotation:o.rotation,flipX:o.flipX,flipY:o.flipY,opacity:o.opacity,blocks:o.blocks};
  }
  function createViewpoint(p,point,target,name='Viewpoint',roomId=null,story=null) {
    if(p.viewpoints.length>=150)throw Error('The plan supports up to 150 placed viewpoints.');
    let r=roomId?roomById(p,roomId):null,st=r?(r.story||0):(Number.isInteger(story)?story:null);if(!r&&st==null){r=roomAt(p,point,.06);st=r?(r.story||0):null;}if(!r&&st!=null)r=roomAtStory(p,point,st,.06);if(roomId?!r||!inRect(r,point,.06):!(r||(st!=null&&floorSectionAt(p,point,st,.06))))throw Error('Place the viewpoint inside the selected room floor or floor space, slightly away from its edge.');
    if(!target||Math.hypot(point.x-target.x,point.y-target.y)<.08)throw Error('Click a second point to choose a facing direction.');
    const v={id:uid('view'),name,x:point.x,y:point.y,roomId:r?r.id:null,story:st,floorZ:storyElevation(p,st),facing:heading(point,target),fov:72,eyeHeight:1.55,horizon:.42,width:1440,height:900,role:'movement',cover:null,notes:''};
    if(!viewPointClear(p,v))throw Error('Place the viewpoint on clear floor, not inside a solid wall.');
    p.viewpoints.push(v);if(!p.startViewId)p.startViewId=v.id;return v;
  }
  function pairFor(p,id) {return p.pairs.find(pair=>pair.coverViewId===id||pair.exposedViewId===id)||null;}
  function sourceExists(p,s) {
    if(!s)return false;
    if(s.kind==='partition')return !!partitionById(p,s.id);
    if(s.kind==='object')return p.objects.some(o=>o.id===s.id&&o.visible&&o.opacity>0);if(s.kind==='pillar')return (p.pillars||[]).some(o=>o.id===s.id);
    if(s.kind==='opening')return p.openings.some(o=>o.id===s.id&&(o.kind!=='passage'||o.trim));
    if(s.kind==='wall')return !!roomById(p,s.roomId)&&SIDES.includes(s.side);
    return false;
  }
  function sourceLabel(p,s) {
    if(!s)return 'No cover assigned';
    if(s.kind==='partition')return partitionById(p,s.id)?.name||'Missing partition';
    if(s.kind==='object')return p.objects.find(o=>o.id===s.id)?.name||'Missing object';if(s.kind==='pillar')return pillarById(p,s.id)?.name||'Missing pillar';
    if(s.kind==='opening')return p.openings.find(o=>o.id===s.id)?.name||'Missing opening';
    return (roomById(p,s.roomId)?.name||'Missing room')+' · '+SIDE_NAMES[s.side]+' wall';
  }
  function assignCover(p,viewId,source,style='edge') {
    const v=p.viewpoints.find(v=>v.id===viewId);if(!v)throw Error('Place and select a viewpoint before assigning cover.');
    const pair=pairFor(p,viewId);if(pair&&pair.exposedViewId===viewId)throw Error('An exposed partner cannot own cover. Select its primary covered viewpoint.');
    if(!sourceExists(p,source))throw Error('Choose an existing wall, partition, framed opening, or visible object as cover.');
    if(!['edge','low'].includes(style))throw Error('Choose tuck/peek or duck/rise.');
    v.cover={source:clone(source),style};v.role='cover';
    if(source.kind==='object')p.objects.find(o=>o.id===source.id).blocks=true;
    return v;
  }
  function pairPose(p,pair) {
    const cv=p.viewpoints.find(v=>v.id===pair.coverViewId);if(!cv)throw Error('Missing primary covered viewpoint.');
    const b=basis(cv.facing);return {x:cv.x+b.rx*pair.sideOffset+b.fx*pair.forwardOffset,y:cv.y+b.ry*pair.sideOffset+b.fy*pair.forwardOffset};
  }
  function syncPairs(p) {
    for(const pair of p.pairs){
      const cv=p.viewpoints.find(v=>v.id===pair.coverViewId),ev=p.viewpoints.find(v=>v.id===pair.exposedViewId);
      if(!cv||!ev||!cv.cover)throw Error('An exposed partner must belong to an assigned covered viewpoint.');
      Object.assign(ev,pairPose(p,pair),{roomId:cv.roomId,story:cv.story||0,floorZ:cv.floorZ||0,facing:cv.facing,fov:cv.fov,horizon:cv.horizon??.42,eyeHeight:pair.exposedEye,role:'exposed'});
      cv.role='cover';
    }
  }
  function createPartner(p,coverId,options={}) {
    const cv=p.viewpoints.find(v=>v.id===coverId);
    if(!cv?.cover||!sourceExists(p,cv.cover.source))throw Error('Assign cover to this placed viewpoint before creating or pairing an exposed partner.');
    if(pairFor(p,coverId))throw Error('This covered viewpoint already has an exposed partner.');
    const low=cv.cover.style==='low';
    const pair={id:uid('pair'),name:options.name||cv.name,coverViewId:cv.id,exposedViewId:null,
      sideOffset:low?0:(options.sideOffset??.8),forwardOffset:low?0:(options.forwardOffset??0),exposedEye:low?(options.exposedEye??Math.min(2.2,Math.max(cv.eyeHeight+.55,1.55))):(options.exposedEye??cv.eyeHeight)};
    finite(pair.sideOffset,-3,3,'sideways offset');finite(pair.forwardOffset,-3,3,'forward offset');finite(pair.exposedEye,.35,2.5,'exposed eye level');
    if(low&&pair.exposedEye<=cv.eyeHeight+.05)throw Error('For duck/rise, the exposed eye level must be higher than the covered eye level.');
    let ev;
    if(options.existingId){
      ev=p.viewpoints.find(v=>v.id===options.existingId);
      if(!ev||ev.id===cv.id||ev.cover||pairFor(p,ev.id))throw Error('Choose an ordinary, unpaired viewpoint.');
      const q=localFloor(cv,ev);pair.sideOffset=q.side;pair.forwardOffset=q.depth;pair.exposedEye=ev.eyeHeight;
      if(Math.hypot(pair.sideOffset,pair.forwardOffset)>3)throw Error('Choose an exposed viewpoint within 3 metres of the covered viewpoint.');
      if(low&&(Math.hypot(pair.sideOffset,pair.forwardOffset)>.02||ev.eyeHeight<=cv.eyeHeight+.05))throw Error('Duck/rise needs the same floor position and a higher exposed eye level. Use tuck/peek for a side offset.');
    }
    const pos=pairPose(p,pair);
    if(!inFloor(p,pos,.06,cv.story||0))throw Error('The exposed partner would be outside this story’s floor. Change the peek direction or distance.');
    const path=routeCheck(p,cv,pos);if(!path.ok)throw Error('The exposed offset crosses a wall or closed door. '+path.reason);
    if(!ev){const b=basis(cv.facing);ev=createViewpoint(p,pos,{x:pos.x+b.fx,y:pos.y+b.fy},cv.name+' · exposed',null,cv.story||0);}
    pair.exposedViewId=ev.id;p.pairs.push(pair);syncPairs(p);return pair;
  }
  function unpair(p,pairId) {
    const pair=p.pairs.find(q=>q.id===pairId);if(!pair)return;
    const ev=p.viewpoints.find(v=>v.id===pair.exposedViewId);if(ev)ev.role='movement';
    p.pairs=p.pairs.filter(q=>q.id!==pairId);
  }
  function removeCover(p,id) {
    const pair=pairFor(p,id);if(pair)unpair(p,pair.id);
    const v=p.viewpoints.find(v=>v.id===id);if(v){v.cover=null;v.role='movement';}
  }
  function moveView(p,id,pos) {
    const v=p.viewpoints.find(v=>v.id===id);if(!v)throw Error('Select a viewpoint.');
    const pair=pairFor(p,id);
    if(pair){const cv=p.viewpoints.find(a=>a.id===pair.coverViewId);cv.x+=pos.x-v.x;cv.y+=pos.y-v.y;syncPairs(p);}
    else {v.x=pos.x;v.y=pos.y;}
    checkViewpoints(p);
  }
  function turnView(p,id,angle) {const v=p.viewpoints.find(v=>v.id===id),pair=pairFor(p,id);if(!v)throw Error('Select a viewpoint.');(pair?p.viewpoints.find(q=>q.id===pair.coverViewId):v).facing=norm(angle);syncPairs(p);checkViewpoints(p);}
  function deleteView(p,id) {
    const pair=pairFor(p,id);if(pair)unpair(p,pair.id);
    p.viewpoints=p.viewpoints.filter(v=>v.id!==id);p.links=p.links.filter(l=>l.a!==id&&l.b!==id);if(p.startViewId===id)p.startViewId=p.viewpoints[0]?.id||null;
    for(const rail of p.rails||[])rail.nodes=rail.nodes.filter(n=>n.viewId!==id);
  }
  function cleanupSources(p) {
    const removed=[];for(const v of p.viewpoints)if(v.cover&&!sourceExists(p,v.cover.source)){removed.push(v.name);removeCover(p,v.id);}return removed;
  }
  function viewPointClear(p,v) {
    const story=v.story??roomById(p,v.roomId)?.story??0;if(!inFloor(p,v,.055,story))return false;
    for(const w of roomWalls(p).filter(w=>(w.story??0)===story)){
      const pos=w.axis==='h'?v.x:v.y,dist=Math.abs((w.axis==='h'?v.y:v.x)-w.fixed);
      if(dist>.025||pos<w.start||pos>w.end)continue;
      const o=openingAt(p,w,pos);if(!o||o.kind==='window')return false;
      const l=openingLine(p,o),edge=openingGeometry(o).frame;
      if(pos<l.start+edge||pos>l.end-edge||o.height<v.eyeHeight+.05||(o.kind==='door'&&!o.open))return false;
    }
    return true;
  }
  function checkViewpoints(p) {
    for(const v of p.viewpoints){if(!viewPointClear(p,v))throw Error('Viewpoint “'+v.name+'” would be outside the floor or inside a solid wall.');}
    for(const pair of p.pairs){
      const cv=p.viewpoints.find(v=>v.id===pair.coverViewId),ev=p.viewpoints.find(v=>v.id===pair.exposedViewId);
      if(!cv?.cover||!ev||!sourceExists(p,cv.cover.source))throw Error('Every pair needs an assigned primary covered viewpoint and its exposed partner.');
      const path=routeCheck(p,cv,ev,{ignoreDoorState:true});if(!path.ok)throw Error('Cover / Exposed positions cross a solid wall. '+path.reason);
      if(cv.cover.style==='low'&&(Math.hypot(cv.x-ev.x,cv.y-ev.y)>.02||ev.eyeHeight<=cv.eyeHeight+.05))throw Error('Duck/rise needs one floor position and a higher exposed eye level.');
    }
  }
  function addLink(p,a,b,bidirectional=true) {
    if(a===b)throw Error('Choose two different viewpoints.');
    const av=p.viewpoints.find(v=>v.id===a),bv=p.viewpoints.find(v=>v.id===b);
    if(!av||!bv)throw Error('Routes require two placed viewpoints.');
    if(p.links.some(l=>(l.a===a&&l.b===b)||(l.a===b&&l.b===a)))throw Error('These viewpoints already have a route.');
    const check=routeCheck(p,av,bv,{ignoreDoorState:true});if(!check.ok)throw Error(check.reason);
    const link={id:uid('route'),a,b,bidirectional:!!bidirectional};p.links.push(link);return link;
  }
  function neighbors(p,id) {
    const ids=[];for(const l of p.links){if(l.a===id)ids.push(l.b);else if(l.b===id&&l.bidirectional)ids.push(l.a);}
    return [...new Set(ids)].map(id=>p.viewpoints.find(v=>v.id===id)).filter(Boolean);
  }
  function addAdjoining(p,roomId,side,width,length,offset=0,connection='passage') {
    const parent=roomById(p,roomId);if(!parent)throw Error('Choose the room to extend.');
    let x=parent.x,y=parent.y;
    if(side==='E'){x+=parent.width;y+=offset;}else if(side==='W'){x-=width;y+=offset;}else if(side==='N'){x+=offset;y-=length;}else if(side==='S'){x+=offset;y+=parent.length;}else throw Error('Choose an adjoining side.');
    const room=makeRoom('Room '+String(p.rooms.length+1).padStart(2,'0'),x,y,width,length,parent.story||0);
    room.floor=clone(parent.floor);room.wall=clone(parent.wall);room.ceiling=clone(parent.ceiling);room.light=clone(parent.light);
    const trial=clone(p);trial.rooms.push(room);checkRooms(trial);
    const shared=roomWalls(trial).filter(w=>w.owners.some(o=>o.roomId===parent.id)&&w.owners.some(o=>o.roomId===room.id));
    if(!shared.length)throw Error('The new room must share an edge with the selected room. Adjust its offset.');
    if(connection!=='solid'){
      const w=shared.sort((a,b)=>(b.end-b.start)-(a.end-a.start))[0];
      if(connection==='passage')fullOpenWall(trial,w);
      else {const owner=w.owners.find(a=>a.roomId===parent.id),l=wallLine(parent,owner.side),len=w.end-w.start;if(len<1.05)throw Error('The shared edge is too narrow for a door.');createOpening(trial,parent.id,owner.side,round(w.start-l.start+(len-1)/2,5),'door');}
    }
    p.rooms=trial.rooms;p.openings=trial.openings;return room;
  }
  function roomEditPlan(p,id,changes,{relocate=false,moveContents=true}={}) {
    const t=clone(p),r=roomById(t,id),old=roomById(p,id);if(!r)throw Error('Select a room.');
    Object.assign(r,changes);checkRooms(t);
    const dx=r.x-old.x,dy=r.y-old.y,notices=[];
    if(moveContents&&(dx||dy)){
      for(const o of t.objects)if(o.roomId===id){o.x+=dx;o.y+=dy;}
      for(const v of t.viewpoints)if(v.roomId===id&&!t.pairs.some(q=>q.exposedViewId===v.id)){v.x+=dx;v.y+=dy;}
      for(const l of t.lights)if(l.roomId===id){l.x+=dx;l.y+=dy;}
      for(const q of t.partitions||[])if(q.roomId===id){q.x+=dx;q.y+=dy;}
      syncPairs(t);
    }
    checkPartitions({...t,partitions:t.partitions||[]});
    for(const o of t.openings)validateOpening(t,o);
    for(const o of t.objects)if(!objectInside(t,o)){
      notices.push(o.name);if(relocate)Object.assign(o,clampObject(t,o));
    }
    for(const v of t.viewpoints)if(!inFloor(t,v,.06,v.story||0)){
      notices.push(v.name);if(relocate&&!t.pairs.some(q=>q.exposedViewId===v.id)){
        v.x=clamp(v.x,r.x+.07,r.x+r.width-.07);v.y=clamp(v.y,r.y+.07,r.y+r.length-.07);
      }
    }
    for(const l of t.lights)if(!inRect(roomById(t,l.roomId),l,.01)){
      notices.push(l.name);if(relocate){const lr=roomById(t,l.roomId);l.x=clamp(l.x,lr.x+.01,lr.x+lr.width-.01);l.y=clamp(l.y,lr.y+.01,lr.y+lr.length-.01);}
    }
    if(notices.length&&!relocate)return {project:t,needsRelocation:true,affected:[...new Set(notices)]};
    syncPairs(t);checkViewpoints(t);
    const lostConnections=p.openings.filter(o=>adjacentRoom(p,o)).filter(o=>{const no=t.openings.find(a=>a.id===o.id);return !adjacentRoom(t,no)||adjacentRoom(t,no).id!==adjacentRoom(p,o).id;}).map(o=>o.name);
    return {project:t,needsRelocation:false,affected:[...new Set(notices)],lostConnections};
  }
  function createLight(p,point,roomId=null) {
    const r=roomId?roomById(p,roomId):roomAt(p,point);if(!r||!inRect(r,point))throw Error('Place a light inside the selected room floor.');
    const l={id:uid('light'),name:'Light pool '+(p.lights.length+1),roomId:r.id,x:point.x,y:point.y,color:'#ffd4a0',radius:3,intensity:.55,falloff:2,enabled:true};p.lights.push(l);return l;
  }
  const checkedAssets=new WeakMap();
  function validateBundle(bundle) {
    if(!bundle||typeof bundle!=='object')throw Error('Choose a Room Creator project.');
    // 0.13: images are immutable data URIs, so they are shared instead of deep-copied on every edit.
    const p=clone(bundle.project||bundle),assets=(bundle.assets||[]).map(a=>a);
    if(p.format!=='trapstar-room-creator'||![4,7,8,9,10,11].includes(p.version))throw Error('Choose a Room Creator v0.4–v0.13 project. Older projects use the conversion dialog.');
    const legacy=p.version<10;if(p.version===4)p.partitions=p.partitions||[];p.version=11;p.sky=normalizeSky(p.sky);p.rails=Array.isArray(p.rails)?p.rails:[];p.stairs=Array.isArray(p.stairs)?p.stairs:[];p.floorCuts=Array.isArray(p.floorCuts)?p.floorCuts:[];if('routeNet' in p){const rn=normalizeRouteNet(p.routeNet);if(rn)p.routeNet=rn;else delete p.routeNet;}if('objectLibrary' in p){const ol=normalizeObjectLibrary(p.objectLibrary);if(ol)p.objectLibrary=ol;else delete p.objectLibrary;}p.storyHeight=p.storyHeight||3.2;p.stylePresets=p.stylePresets||[];p.floorSections=p.floorSections||[];p.ceilingCuts=p.ceilingCuts||[];p.ceilingPatches=p.ceilingPatches||[];p.pillars=p.pillars||[];normalizeStories(p);
    for(const r of p.rooms){if(!Number.isInteger(r.story))r.story=0;r.openAbove=!!r.openAbove;r.balconySides=Array.isArray(r.balconySides)?r.balconySides:[];}
    for(const v of p.viewpoints){const st=Number.isInteger(v.story)?v.story:null,r=roomById(p,v.roomId)||roomAt(p,v,0,st??0)||(st==null?p.rooms.find(r=>inRect(r,v)):null);if(r){v.roomId=r.id;v.story=r.story||0;v.floorZ=roomElevation(p,r);}else{v.roomId=null;v.story=st??0;v.floorZ=storyElevation(p,v.story);}}
    for(const o of p.objects){const st=Number.isInteger(o.story)?o.story:null,r=roomById(p,o.roomId)||roomAt(p,o,0,st??0)||(st==null?p.rooms.find(r=>inRect(r,o)):null);if(r){o.roomId=r.id;o.story=r.story||0;o.floorZ=roomElevation(p,r);}else{o.roomId=null;o.story=st??0;o.floorZ=storyElevation(p,o.story);}}
    if(!Array.isArray(p.partitions))throw Error('Missing interior partitions list.');
    const ids=(arr,max,label)=>{if(!Array.isArray(arr)||arr.length>max)throw Error('Invalid '+label+' list.');const set=new Set();for(const o of arr){if(typeof o.id!=='string'||!/^[-a-zA-Z0-9_]{1,100}$/.test(o.id)||set.has(o.id))throw Error('Invalid or duplicate '+label+' ID.');set.add(o.id);}return set;};
    const text=(s,max=180)=>String(s??'').slice(0,max);
    const color=s=>{if(typeof s!=='string'||!/^#[0-9a-f]{6}$/i.test(s))throw Error('Use a six-digit colour.');};
    const aids=ids(assets,500,'asset');let total=0;
    for(const a of assets){if(!a||typeof a!=='object')throw Error('Invalid image record.');a.name=text(a.name);if(!checkedAssets.has(a)||checkedAssets.get(a)!==a.src){if(typeof a.src!=='string'||!/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(a.src))throw Error('Embed PNG, JPEG, or WebP artwork only.');checkedAssets.set(a,a.src);}total+=a.src.length;if(total>125*1024*1024)throw Error('The embedded image library exceeds 125 MB.');finite(a.width,1,8192,'image width');finite(a.height,1,8192,'image height');}
    p.name=text(p.name)||'Untitled floor plan';if(!['m','ft'].includes(p.units))throw Error('Choose metres or feet.');finite(p.grid,.1,2,'grid spacing');finite(p.wallHeight,1.8,6,'common wall height');
    normalizeStories(p);if(!p.stories.every((st,i)=>st.index===i))throw Error('Stories must be contiguous; skipped stories are not allowed.');const rids=ids(p.rooms,80,'room');checkRooms(p);
    function checkSurface(s){if(!s)throw Error('Missing surface settings.');if(!Number.isFinite(s.offsetX))s.offsetX=0;if(!Number.isFinite(s.offsetY))s.offsetY=0;if(!Number.isFinite(s.textureOpacity))s.textureOpacity=1;color(s.color);if(!FINISHES.includes(s.finish))throw Error('Unknown surface finish.');if(s.textureId&&!aids.has(s.textureId))throw Error('A surface texture is missing.');normalizeSurface(s,legacy);finite(s.tileSize,.05,40,'finish repeat size');if(s.tileSizeY!==null)finite(s.tileSizeY,.05,40,'vertical repeat size');if(!['repeat','mirror','stretch'].includes(s.mapping))throw Error('Unknown texture mapping.');if(!['local','legacy'].includes(s.coordinateMode))throw Error('Unknown texture coordinates.');for(const k of ['flipX','flipY'])if(typeof s[k]!=='boolean')throw Error('Invalid texture flip.');finite(s.brightness,.1,3,'surface brightness');finite(s.contrast,0,2.5,'surface contrast');finite(s.saturation,0,2.5,'surface saturation');finite(s.hue,-180,180,'surface hue');finite(s.tintStrength,0,1,'surface tint');finite(s.wear,0,1,'surface wear');finite(s.jointWidth,.002,.15,'pattern joint width');finite(s.baseHeight,0,1.5,'baseboard height');finite(s.capHeight,0,.5,'top trim height');for(const k of ['secondary','baseColor','capColor'])color(s[k]);finite(s.angle,-360,360,'finish direction');finite(s.offsetX,-40,40,'texture offset X');finite(s.offsetY,-40,40,'texture offset Y');finite(s.textureOpacity,0,1,'texture opacity');}
    function checkLight(a){for(const [k,v] of Object.entries(LIGHT_EXTRA))if(a[k]===undefined)a[k]=v;finite(a.brightness,.1,1.8,'ambient brightness');color(a.tint);finite(a.tintStrength,0,.8,'light tint');finite(a.exposure,-2,2,'room exposure');finite(a.contrast,0,2,'room contrast');finite(a.saturation,0,2,'room saturation');}
    ids(p.stylePresets,60,'saved style');for(const look of p.stylePresets){look.name=text(look.name);if(!look.look||typeof look.look!=='object')throw Error('Missing style settings.');for(const surf of [look.look.floor,look.look.wall,look.look.ceiling,...Object.values(look.look.walls||{})])checkSurface(surf);checkLight(look.look.light);}
    for(const r of p.rooms){r.name=text(r.name)||'Room';checkSurface(r.floor);checkSurface(r.wall);checkSurface(r.ceiling);if(!r.walls||typeof r.walls!=='object')throw Error('Invalid wall overrides.');for(const [side,s]of Object.entries(r.walls)){if(!SIDES.includes(side))throw Error('Unknown wall side.');checkSurface(s);}checkLight(r.light);
      if(!r.exterior||typeof r.exterior!=='object')r.exterior={default:backdrop(null),sides:{}};
      if(!r.exterior.default)r.exterior.default=backdrop(null);
      if(!r.exterior.sides||typeof r.exterior.sides!=='object')r.exterior.sides={};
      const checkBackdrop=(b,label='exterior backdrop')=>{if(!b)return; if(typeof b!=='object'||Array.isArray(b))throw Error('Invalid exterior matte settings.'); if(b.distance===undefined)b.distance=0; finite(b.distance,0,100,label+' distance'); if(b.assetId&&!aids.has(b.assetId))throw Error(label+' is missing.'); if(!['cover','contain','stretch'].includes(b.fit||'cover'))throw Error('Unknown backdrop fit.'); finite(b.scale,.1,8,label+' scale'); finite(b.offsetX,-5,5,label+' offset X'); finite(b.offsetY,-5,5,label+' offset Y'); finite(b.alpha,0,1,label+' opacity');};
      checkBackdrop(r.exterior.default,'room exterior backdrop');
      for(const [side,b] of Object.entries(r.exterior.sides)){if(!SIDES.includes(side))throw Error('Unknown exterior side.'); checkBackdrop(b,'side exterior backdrop');}
    }
    ids(p.floorSections,300,'floor section');for(const f of p.floorSections){f.name=text(f.name)||'Floor section';if(!Number.isInteger(f.story)||!storyRecord(p,f.story))throw Error('Floor section story is missing.');for(const k of ['x','y'])finite(f[k],-200,200,'floor section '+k);finite(f.width,.2,80,'floor section width');finite(f.length,.2,80,'floor section length');checkSurface(f.floor);checkSurface(f.underside);}
    ids(p.ceilingCuts,300,'ceiling cut');ids(p.ceilingPatches,300,'ceiling patch');for(const q of [...p.ceilingCuts,...p.ceilingPatches]){q.name=text(q.name);const rr=roomById(p,q.roomId);if(!rr)throw Error('Ceiling edit lost its room.');q.story=rr.story||0;finite(q.x,rr.x,rr.x+rr.width,'ceiling X');finite(q.y,rr.y,rr.y+rr.length,'ceiling Y');finite(q.width,.2,rr.width,'ceiling width');finite(q.length,.2,rr.length,'ceiling length');if(q.x+q.width>rr.x+rr.width+EPS||q.y+q.length>rr.y+rr.length+EPS)throw Error('Ceiling edit leaves its room.');if(q.surface)checkSurface(q.surface);}
    ids(p.pillars,300,'pillar');for(const q of p.pillars){q.name=text(q.name)||'Pillar';if(!Number.isInteger(q.story)||!storyRecord(p,q.story))throw Error('Pillar story is missing.');finite(q.x,-200,200,'pillar X');finite(q.y,-200,200,'pillar Y');finite(q.width,.08,8,'pillar width');finite(q.depth,.08,8,'pillar depth');finite(q.height,.2,30,'pillar height');checkSurface(q.surface);q.blocks=q.blocks!==false;}
    ids(p.partitions,250,'partition');for(const q of p.partitions){q.name=text(q.name)||'Partition';q.free=!!q.free;if(!q.faces)throw Error('Missing partition surface settings.');checkSurface(q.faces.A);checkSurface(q.faces.B);if(q.height===undefined)q.height=null;}
    checkPartitions(p);
    ids(p.openings,300,'opening');for(const o of p.openings){o.name=text(o.name);validateOpening(p,o);color(o.frameColor);color(o.panelColor);color(o.glassColor);if(o.textureId&&!aids.has(o.textureId))throw Error('Opening texture is missing.');o.trim=!!o.trim;}
    const oids=ids(p.objects,1000,'object');
    if('props' in p){if(!Array.isArray(p.props))p.props=[];p.props=p.props.map(q=>normalizeProp(p,q)).filter(Boolean);if(p.props.length>5000)throw Error('A project can hold up to 5000 placed 3D objects.');const seen=new Set();for(const q of p.props){if(seen.has(q.id))q.id=uid('prop');seen.add(q.id);}}
    for(const o of p.objects){o.name=text(o.name);if(!Number.isInteger(o.story))o.story=roomById(p,o.roomId)?.story||0;if(o.roomId&&!rids.has(o.roomId))throw Error('Object room is missing.');if(!storyRecord(p,o.story))throw Error('Object story is missing.');{const rr=roomById(p,o.roomId)||roomAt(p,o,0,o.story);o.floorZ=rr?roomElevation(p,rr):storyElevation(p,o.story);}for(const key of ['assetId','isoAssetId','viewAssetId'])if(!aids.has(o[key]))throw Error('Missing artwork for '+o.name+'.');finite(o.x,-200,200,'object X');finite(o.y,-200,200,'object Y');for(const key of ['width','depth'])finite(o[key],.02,40,'object '+key);finite(o.height,.02,12,'object height');finite(o.mount,0,6,'mount height');finite(o.facing,-36000,36000,'object facing');finite(o.rotation,-36000,36000,'image rotation');finite(o.opacity,0,1,'image opacity');finite(o.anchorX,0,1,'anchor X');finite(o.anchorY,0,1,'anchor Y');finite(o.layer,-1000,1000,'layer order');if(!['sprite','panel','floor'].includes(o.surface)||!['height','stretch'].includes(o.artFit))throw Error('Invalid object representation.');for(const key of ['visible','locked','blocks','flipX','flipY'])o[key]=!!o[key];if(!o.variants)throw Error('Missing directional assignments.');for(const id of Object.values(o.variants))if(id&&!aids.has(id))throw Error('Missing directional image.');if(!objectInside(p,o))throw Error('Object footprint leaves the floor plan: '+o.name);}
    ids(p.lights,80,'light');for(const l of p.lights){l.name=text(l.name);if(!rids.has(l.roomId)||!inRect(roomById(p,l.roomId),l))throw Error('A light must be inside its room.');color(l.color);finite(l.radius,.25,20,'light radius');finite(l.intensity,0,2,'light intensity');if(l.falloff===undefined)l.falloff=2;finite(l.falloff,.5,6,'light falloff');l.enabled=!!l.enabled;}
    const vids=ids(p.viewpoints,150,'viewpoint');
    for(const v of p.viewpoints){v.name=text(v.name);v.notes=text(v.notes,2000);if(v.horizon===undefined||v.horizon===null)v.horizon=.42;finite(v.horizon,.1,.9,'look up / down');if(!Number.isInteger(v.story))v.story=roomById(p,v.roomId)?.story||0;if(!storyRecord(p,v.story))throw Error('Viewpoint story is missing.');{const rr=roomById(p,v.roomId)||roomAt(p,v,0,v.story);v.floorZ=rr?roomElevation(p,rr):storyElevation(p,v.story);}finite(v.x,-200,200,'viewpoint X');finite(v.y,-200,200,'viewpoint Y');finite(v.facing,-36000,36000,'view direction');finite(v.fov,35,110,'view angle');finite(v.eyeHeight,.35,2.5,'eye height');finite(v.width,320,4096,'view width');finite(v.height,240,4096,'view height');if(!['movement','cover','exposed'].includes(v.role))throw Error('Invalid viewpoint role.');if(v.cover){if(v.role!=='cover'||!sourceExists(p,v.cover.source)||!['edge','low'].includes(v.cover.style))throw Error('Invalid viewpoint cover assignment.');}else if(v.role==='cover')throw Error('A covered viewpoint needs an explicit cover assignment.');}
    ids(p.pairs,75,'pair');const used=new Set();
    for(const q of p.pairs){q.name=text(q.name);if(!vids.has(q.coverViewId)||!vids.has(q.exposedViewId)||q.coverViewId===q.exposedViewId||used.has(q.coverViewId)||used.has(q.exposedViewId))throw Error('Each pair needs two unique placed viewpoints.');used.add(q.coverViewId);used.add(q.exposedViewId);finite(q.sideOffset,-3,3,'pair side offset');finite(q.forwardOffset,-3,3,'pair forward offset');finite(q.exposedEye,.35,2.5,'exposed eye height');const cv=p.viewpoints.find(v=>v.id===q.coverViewId),ev=p.viewpoints.find(v=>v.id===q.exposedViewId);if(!cv.cover||cv.role!=='cover'||ev.role!=='exposed'||ev.cover)throw Error('A pair starts at an assigned covered viewpoint, not an object or a label.');const expected=pairPose(p,q);if(Math.hypot(ev.x-expected.x,ev.y-expected.y)>1e-5||Math.abs(norm(ev.facing)-norm(cv.facing))>1e-5||Math.abs(ev.fov-cv.fov)>1e-5||Math.abs(ev.eyeHeight-q.exposedEye)>1e-5)throw Error('Paired viewpoints are out of sync.');}
    for(const v of p.viewpoints)if(v.role==='exposed'&&!p.pairs.some(q=>q.exposedViewId===v.id))throw Error('An exposed viewpoint must have a primary covered partner.');

    // 0.13 records: sky, floor openings, stairs, rails
    {const sk=p.sky;if(!['gradient','image'].includes(sk.mode))throw Error('Unknown sky mode.');for(const k of ['top','horizon','bottom','tint'])color(sk[k]);finite(sk.curve,.1,4,'sky gradient curve');if(sk.assetId&&!aids.has(sk.assetId))throw Error('The sky image is missing from the image library.');if(sk.mode==='image'&&!sk.assetId)sk.mode='gradient';
      finite(sk.rotation,-3600,3600,'sky rotation');finite(sk.repeat,1,16,'sky repeat');sk.repeat=Math.round(sk.repeat);sk.mirror=!!sk.mirror;sk.flipX=!!sk.flipX;finite(sk.horizonV,0,1,'sky horizon line');finite(sk.size,.1,8,'sky size');finite(sk.lift,-45,45,'sky lift');finite(sk.fadeTop,0,1,'sky top fade');finite(sk.fadeBottom,0,1,'sky bottom fade');finite(sk.brightness,.1,3,'sky brightness');finite(sk.saturation,0,2.5,'sky saturation');finite(sk.tintStrength,0,1,'sky tint');
      const hz=sk.haze;hz.enabled=!!hz.enabled;if(hz.color!==null)color(hz.color);finite(hz.start,0,2000,'haze start');finite(hz.end,1,4000,'haze end');if(hz.end<=hz.start)hz.end=hz.start+1;finite(hz.strength,0,1,'haze strength');}
    ids(p.floorCuts,300,'floor opening');for(const c of p.floorCuts){c.name=text(c.name)||'Floor opening';if(!Number.isInteger(c.story)||!storyRecord(p,c.story))throw Error('Floor opening story is missing.');finite(c.x,-200,200,'floor opening X');finite(c.y,-200,200,'floor opening Y');finite(c.width,.2,80,'floor opening width');finite(c.length,.2,80,'floor opening length');}
    ids(p.stairs,120,'stairs');for(const st of p.stairs){st.name=text(st.name)||'Stairs';if(!st.surface)st.surface=surface('#8d8a83','concrete');checkSurface(st.surface);st.rails=st.rails!==false;}checkStairs(p);
    ids(p.rails,60,'rail');for(const rail of p.rails){rail.name=text(rail.name)||'Rail';for(const [k,d,a,b] of [['speed',3,.2,40],['ease',1.5,0,20],['corner',1.2,0,6],['lookAhead',2,0,20],['turnDistance',2.5,0,30],['hold',1.5,0,120]]){if(rail[k]===undefined||rail[k]===null)rail[k]=d;finite(rail[k],a,b,'rail '+k);}
      rail.autoPath=rail.autoPath!==false;rail.loop=!!rail.loop;if(!Array.isArray(rail.nodes))rail.nodes=[];if(rail.nodes.length>200)throw Error('A rail can hold at most 200 points.');const nids=new Set();
      for(const n of rail.nodes){if(typeof n.id!=='string'||!/^[-a-zA-Z0-9_]{1,100}$/.test(n.id)||nids.has(n.id))throw Error('Invalid rail point ID.');nids.add(n.id);
        if(n.kind==='stop'){if(!vids.has(n.viewId))throw Error('A rail stop refers to a missing viewpoint.');if(n.hold===undefined||n.hold===null)n.hold=null;else finite(n.hold,0,120,'rail stop hold');}
        else if(n.kind==='via'){n.kind='via';finite(n.x,-200,200,'rail point X');finite(n.y,-200,200,'rail point Y');if(!Number.isInteger(n.story)||!storyRecord(p,n.story))throw Error('A rail point is on a missing story.');}
        else throw Error('Unknown rail point type.');
        if(n.speed===undefined||n.speed===null)n.speed=null;else finite(n.speed,.2,40,'rail segment speed');}}
    checkViewpoints(p);ids(p.links,2000,'route');for(const l of p.links){if(!vids.has(l.a)||!vids.has(l.b)||l.a===l.b||typeof l.bidirectional!=='boolean')throw Error('Invalid route endpoints.');}
    if(p.startViewId&&!vids.has(p.startViewId))throw Error('Missing start viewpoint.');
    p.migrationNotes=Array.isArray(p.migrationNotes)?p.migrationNotes.map(s=>text(s,1000)).slice(0,100):[];
    return {project:p,assets};
  }
  function migrateLegacy(bundle,oldCore,{architectureOnly=false}={}) {
    const valid=oldCore.validateBundle(bundle),old=valid.project,p=newProject(),r=p.rooms[0];
    p.name=old.name;p.units=old.room.units;p.grid=old.room.grid;p.wallHeight=old.room.wallHeight;
    Object.assign(r,{name:old.name,width:old.room.width,length:old.room.length});
    r.wall=surface(old.room.wallColor);r.floor=surface(old.room.floorColor,'concrete');r.ceiling=surface(old.room.ceilingColor);
    let assets=architectureOnly?[]:valid.assets;
    p.objects=architectureOnly?[]:clone(old.objects).map(o=>({...o,surface:o.surface||'sprite',artFit:o.artFit||'height'}));
    p.viewpoints=clone(old.viewpoints).map(v=>({...v,cover:null,role:'movement'}));
    const oldNodes=new Map(old.nodes.map(n=>[n.id,n]));
    p.startViewId=oldNodes.get(old.startNodeId)?.viewId||p.viewpoints[0]?.id||null;
    const seen=new Set();
    for(const l of old.links){const a=oldNodes.get(l.a)?.viewId,b=oldNodes.get(l.b)?.viewId;if(!a||!b||a===b||l.locationId)continue;const key=[a,b].sort().join('|');if(seen.has(key))continue;seen.add(key);p.links.push({id:l.id,a,b,bidirectional:l.bidirectional});}
    p.migrationNotes.push('Converted the single room to a shared floor section. Existing viewpoint positions and directions are retained. Routes now connect viewpoints directly.');
    const archMap=new Map();
    if(!architectureOnly)for(const o of [...p.objects])if(['door','window_iso','window_view'].includes(o.assetId)){
      const distances=[['N',Math.abs(o.y)],['S',Math.abs(o.y-r.length)],['W',Math.abs(o.x)],['E',Math.abs(o.x-r.width)]].sort((a,b)=>a[1]-b[1]);
      const side=distances[0][0],len=side==='N'||side==='S'?r.width:r.length,width=Math.min(o.width,len-.1),center=side==='N'||side==='S'?o.x:o.y;
      try{
        const kind=o.assetId==='door'?'door':'window',bottom=kind==='window'?clamp(o.mount,0,p.wallHeight-.3):0;
        const op=createOpening(p,r.id,side,clamp(center-width/2,.05,len-width-.05),kind,{name:o.name,width,bottom,height:clamp(o.height,.2,p.wallHeight-bottom),open:true});
        archMap.set(o.id,{kind:'opening',id:op.id});p.objects=p.objects.filter(q=>q.id!==o.id);p.migrationNotes.push(o.name+': converted from a loose legacy sprite to the nearest wall opening; review its placement.');
      }catch(e){p.objects=p.objects.filter(q=>q.id!==o.id);p.migrationNotes.push(o.name+': not placed as a loose door/window. Add its architectural opening manually ('+e.message+').');}
    }
    for(const l of old.locations||[]){
      const cv=p.viewpoints.find(v=>v.id===l.coverViewId),ev=p.viewpoints.find(v=>v.id===l.exposedViewId),src=archMap.get(l.objectId)||(p.objects.some(o=>o.id===l.objectId)?{kind:'object',id:l.objectId}:null);
      if(!cv||!ev||!src){p.migrationNotes.push(l.name+': retained as ordinary viewpoints; assign a new cover source before pairing.');continue;}
      try{assignCover(p,cv.id,src,l.style);createPartner(p,cv.id,{existingId:ev.id,name:l.name});}
      catch(e){removeCover(p,cv.id);p.migrationNotes.push(l.name+': review and reassign cover ('+e.message+').');}
    }
    p.migrationNotes.push(architectureOnly?'Architecture-only conversion intentionally leaves the image library and object list empty.':'Images come only from the opened file. No legacy artwork is bundled with v0.4.');
    if(!architectureOnly)p.legacyArchive={version:old.version,project:old,assetIds:valid.assets.map(a=>a.id)};
    return validateBundle({project:p,assets});
  }
  function example() {
    const p=newProject();p.name='Open-plan corner · architecture example';const r=p.rooms[0];Object.assign(r,{name:'Main room',width:7,length:5});applyPalette(r,'apartment');
    const w=addAdjoining(p,r.id,'E',3.5,3,2,'passage');w.name='Window alcove';applyPalette(w,'utility');w.floor.finish='tile';w.floor.tileSize=.65;
    const hall=addAdjoining(p,w.id,'S',3.5,3,0,'door');hall.name='Hall';applyPalette(hall,'midnight');
    createOpening(p,r.id,'N',2.4,'window',{width:2,height:1.3});createOpening(p,w.id,'E',.9,'window',{width:1.2});
    const lp=createLight(p,{x:2,y:1.5});lp.color='#ffc28a';lp.radius=4;
    const a=createViewpoint(p,{x:1.5,y:3.8},{x:6.7,y:2.9},'Entry');
    const c=createViewpoint(p,{x:5.7,y:1.8},{x:6.7,y:1.8},'Corner');assignCover(p,c.id,{kind:'wall',roomId:r.id,side:'E'},'edge');const pair=createPartner(p,c.id,{sideOffset:1,name:'Corner peek'});
    const e=p.viewpoints.find(v=>v.id===pair.exposedViewId);e.name='Corner · exposed';
    const av=createViewpoint(p,{x:8.5,y:3.8},{x:8.5,y:5.5},'Alcove');
    const hv=createViewpoint(p,{x:8.5,y:6.6},{x:8.5,y:4.8},'Hall');
    addLink(p,a.id,c.id);addLink(p,e.id,av.id);addLink(p,av.id,hv.id);p.startViewId=a.id;
    return p;
  }
  function partitionExample() {
    const p=newProject();p.name='Studio · partitions and connected rooms';const r=p.rooms[0];Object.assign(r,{name:'Main studio',width:10,length:7});applyPalette(r,'apartment');
    createOpening(p,r.id,'N',.6,'door',{name:'Service door',width:1.1,open:false});
    createOpening(p,r.id,'N',2.3,'window',{name:'Street window',width:2,bottom:.85,height:1.35});
    const opening=createOpening(p,r.id,'N',6.5,'passage',{name:'Studio connection',width:2.2,height:p.wallHeight,trim:true});
    const annex=attachRoom(p,opening.id,{width:4.4,length:3.5,inset:1.1,name:'Back studio'});applyPalette(annex,'utility');
    createOpening(p,annex.id,'N',1.1,'window',{name:'Back studio window',width:2.2});
    const q=createPartition(p,r.id,{x:1,y:3.4},{x:9,y:3.4},{name:'Interior studio divider'});
    q.faces.A=surface('#906a52','brick');q.faces.A.tileSize=.7;q.faces.B=surface('#777c82','concrete');
    createOpening(p,r.id,null,1.3,'door',{partitionId:q.id,name:'Divider door',width:1.2});
    createOpening(p,r.id,null,3.3,'window',{partitionId:q.id,name:'Interior window',width:1.5,bottom:.9,height:1.1});
    createOpening(p,r.id,null,6,'passage',{partitionId:q.id,name:'Divider open span',width:1.2,height:p.wallHeight});
    const a=createViewpoint(p,{x:5,y:6},{x:5,y:1},'Entry overview');a.fov=100;
    const c=createViewpoint(p,{x:6.4,y:5.1},{x:6.4,y:1},'Divider · cover');assignCover(p,c.id,{kind:'partition',id:q.id});
    const pair=createPartner(p,c.id,{sideOffset:1.1,name:'Divider peek'}),e=p.viewpoints.find(v=>v.id===pair.exposedViewId);e.name='Divider · exposed';
    const through=createViewpoint(p,{x:7.5,y:2},{x:7.5,y:-2},'Through the divider'),back=createViewpoint(p,{x:7.5,y:-1.5},{x:7.5,y:5},'Back studio · return');
    addLink(p,a.id,c.id);addLink(p,e.id,through.id);addLink(p,through.id,back.id);p.startViewId=a.id;
    return p;
  }
  function multiStoryExample(){
    const p=newProject();p.name='Atrium gallery · multi-story example';p.storyHeight=3.1;const r=p.rooms[0];Object.assign(r,{name:'Atrium floor',width:10,length:8,openAbove:true});applyPalette(r,'nightclub');
    const n=addRoomAbove(p,r.id,{width:10,length:2,offsetX:0,offsetY:0,name:'North gallery'});n.balconySides=['S'];applyPalette(n,'lounge');
    const e=addRoomAbove(p,r.id,{width:2,length:6,offsetX:8,offsetY:2,name:'East gallery'});e.balconySides=['W'];applyPalette(e,'lounge');
    const low=createViewpoint(p,{x:5,y:7.1},{x:5,y:1.2},'Atrium · lower floor',r.id);low.fov=100;
    const upper=createViewpoint(p,{x:5,y:1},{x:5,y:5},'North gallery',n.id);upper.fov=92;addLink(p,low.id,upper.id);p.startViewId=low.id;return p;
  }
  return {SKY_DEFAULT,SKY_PRESETS,defaultSky,normalizeSky,normalizeRouteNet,normalizeProp,normalizePropPoint,normalizeObjectLibrary,LOOK_FIELDS,lookById,paletteVariantById,propAppearance,propYaw,propFrontTurn,preservePropSetup,propSegmentHits,propAppearanceIssues,propFloorZ,propToPlan,planToProp,propPointHeading,propBoundsOf,propFootprint,propBlocksWalking,propScale,validBounds,pointInPoly,polyDistToSegment,segDist,setMapProjection,mapProjection,floorCutAt,stairById,stairGeometry,stairRect,createStairs,applyStairCuts,deleteStairs,editStairs,checkStairs,STAIR_DIRS,SURFACE_EXTRA,OPENING_EXTRA,LIGHT_EXTRA,FINISHES,normalizeSurface,normalizeOpening,openingGeometry,openingRanges,editOpening,styleSnapshot,applyStyleSnapshot,EPS,SIDES,SIDE_NAMES,PALETTES,uid,clone,clamp,rad,norm,round,finite,basis,heading,fromDisplay,toDisplay,surface,backdrop,
    newProject,makeRoom,addRoomAbove,normalizeStories,addStory,renameStory,deleteStory,storyRecord,storyElevation,roomElevation,roomTop,storyList,storyLabel,storyName,roomAtStory,floorSectionAt,floorSectionHost,lightingRoomAt,storyContents,deleteRoom,floorSectionToRoom,addStoryWithRooms,makeFloorSection,floorSectionById,makeCeilingRect,ceilingPatchAt,ceilingExistsAt,ceilingSurfaceAt,createFreeWall,createPillar,pillarById,isBalconyWall,applyPalette,partitionById,partitionLine,partitionHeight,partitionWall,wallBase,wallCap,openingHostLine,openingCap,openingHostLabel,checkPartitions,createPartition,editPartition,deletePartition,unusedWallSpans,suggestOpening,openUnusedSpans,exteriorSpans,canAttachRoom,attachRoomPlan,attachRoom,roomById,inRect,roomAt,inFloor,bounds,roomsOverlap,checkRooms,wallLine,wallPoint,roomWalls,openingLine,
    openingsForWall,adjacentRoom,ownerFacing,wallStyle,backdropFor,backdropFrame,backdropRay,backdropAtWall,backdropUV,openingAt,validateOpening,createOpening,fullOpenWall,rayHit,segmentInFloor,routeCheck,
    lens,localFloor,fpPoint,fpInverse,setIsoFrame,isoTransform,isoPoint,isoInverse,footprint,extent,objectInside,clampObject,createObject,facingSlot,assetFor,rectFor,
    createViewpoint,pairFor,sourceExists,sourceLabel,assignCover,pairPose,syncPairs,createPartner,unpair,removeCover,moveView,turnView,deleteView,cleanupSources,viewPointClear,checkViewpoints,
    addLink,neighbors,addAdjoining,roomEditPlan,createLight,validateBundle,migrateLegacy,example,partitionExample,multiStoryExample};
});
