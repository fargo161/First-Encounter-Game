/* ===================== 0.13 · ui-gl.js =====================
   Graphics-card drawing for the editor: the hook registry used by the other ui-*.js modules,
   zoom limits, icons and labels that keep one on-screen size at every zoom, isometric / plan
   switching, smooth story changes, live previews, thumbnails, cover checks and exports. */
const ZOOM_MIN=.15,ZOOM_MAX=80;
const HOOKS={pointerDown:[],pointerMove:[],pointerUp:[],mapClick:[],dblClick:[],wheel:[],keyDown:[],keyUp:[],click:[],action:[],drawGraph:[],underGraph:[],underlay:[],top:[],messages:[],leftRender:[],inspectorRender:[]};
const EXT={hooks:HOOKS};
let liveRev=0,mapViewSaved=null,panTween=null,glFailCount=0;
const runHooks=(name,...a)=>{for(const f of HOOKS[name])if(f(...a))return true;return false;};
function extPointerDown(e,q){panTween=null;return runHooks('pointerDown',e,q);}
function extPointerMove(e){return runHooks('pointerMove',e);}
function extPointerUp(e){return runHooks('pointerUp',e);}
function extMapClick(e,q,floor){return runHooks('mapClick',e,q,floor);}
function extDblClick(e){return runHooks('dblClick',e);}
function extWheel(e){panTween=null;return runHooks('wheel',e);}
function extKeyDown(e){return runHooks('keyDown',e);}
function extKeyUp(e){runHooks('keyUp',e);}
function extClick(e,b){return runHooks('click',e,b);}
function extAction(name){return runHooks('action',name);}
function extDrawGraph(g,k){for(const f of HOOKS.drawGraph)f(g,k);}
function extUnderGraph(g,k){for(const f of HOOKS.underGraph)f(g,k);}
function drawMapUnderlay(g){const k=mk();for(const f of HOOKS.underlay)f(g,k);}
function extUpdateTop(){for(const f of HOOKS.top)f();}
function extToolMessages(){const m={};for(const f of HOOKS.messages)Object.assign(m,f());return m;}
function afterLeftRender(el){for(const f of HOOKS.leftRender)f(el);}
function afterInspectorRender(el){for(const f of HOOKS.inspectorRender)f(el);}

// One map unit in screen pixels is geometry().scale, so multiplying a size by mk() keeps it the same on screen.
function mk(){if(active!=='iso')return 1;return 1/Math.max(.01,geometry().scale);}
function centreOfScreen(){const g=geometry();return {x:(g.cw/2-g.ox)/g.scale,y:(g.ch/2-g.oy)/g.scale};}

// ------------------------------------------------------------------ engine health
function updateEngineBadge(){const b=$('engineBadge');if(!b)return;b.textContent=GLE?'3D · GRAPHICS CARD':'2D FALLBACK';b.title=GLE?'Drawing with the graphics card (WebGL2): fast pan, zoom and first person.':'WebGL2 is not available here, so the slower 2D renderer is used.';b.classList.toggle('fallback',!GLE);glCanvas.style.display=GLE?'':'none';}
function disableGL(reason){if(!GLE)return;try{GLE.dispose();}catch(_){}GLE=null;updateEngineBadge();toast(reason+', so the editor switched to the slower 2D renderer. Your work is safe — save, then reload the page to try the fast renderer again.',10000);drawSoon();}
function glFailed(e){console.error('Graphics-card renderer error',e);glFailCount++;if(glFailCount>=3)disableGL('The graphics-card renderer kept failing');else drawSoon();}
glCanvas.addEventListener('webglcontextlost',e=>{e.preventDefault();disableGL('The graphics card reset');});

// ------------------------------------------------------------------ icons and labels
function openingIconVisible(o){if(selection?.kind==='opening'&&selection.id===o.id)return true;if(['door','window','passage'].includes(tool)||iconMode==='all')return true;if(iconMode==='doors')return o.kind==='door';return false;}
function lightIconVisible(l){if(selection?.kind==='light'&&selection.id===l.id)return true;if(tool==='light'||iconMode==='all')return true;if(iconMode==='doors')return (selection?.kind==='room'||selection?.kind==='wall')&&l.roomId===roomId;return false;}
const LABEL_NEXT={selected:'all',all:'off',off:'selected'},ICON_NEXT={doors:'all',all:'none',none:'doors'};
function cycleLabels(){labelMode=LABEL_NEXT[labelMode]||'selected';toast({selected:'Labels: only the selected room or floor is named.',all:'Labels: every room on this story is named (overlapping names are skipped).',off:'Labels: off.'}[labelMode],2600);updateTop();drawSoon();}
function cycleIcons(){iconMode=ICON_NEXT[iconMode]||'doors';toast({doors:'Icons: doors only, plus lights in the selected room.',all:'Icons: every door, window, open wall and light.',none:'Icons: off (the selected item still shows).'}[iconMode],2600);updateTop();drawSoon();}
function updateLabelButtons(){const lb=$('labelsBtn'),ib=$('iconsBtn');if(lb){lb.textContent='Labels: '+labelMode;lb.classList.toggle('active',labelMode!=='off');}if(ib){ib.textContent='Icons: '+{doors:'doors',all:'all',none:'off'}[iconMode];ib.classList.toggle('active',iconMode!=='none');}}
$('labelsBtn').onclick=cycleLabels;$('iconsBtn').onclick=cycleIcons;$('planBtn').onclick=()=>setMode('plan');
HOOKS.top.push(updateLabelButtons,updateEngineBadge);

// Room names drawn at a fixed screen size. Bigger rooms win when names would overlap.
function drawMapLabels(g,{all=false,k=mk()}={}){
  const lm=all?'all':labelMode;if(lm==='off')return;
  const selRoomId=selection?.kind==='room'?selection.id:selection?.kind==='wall'?selection.roomId:null,items=[];
  for(const r of project.rooms.filter(r=>(r.story||0)===activeStory)){const sel=r.id===selRoomId;if(lm==='selected'&&!sel)continue;items.push({x:r.x+r.width/2,y:r.y+r.length/2,z:C.roomElevation(project,r),title:r.name,sub:sel||all?`${fmt(r.width)} × ${fmt(r.length)} ${unit()}`:'',pri:sel?1e9:r.width*r.length,sel});}
  if(selection?.kind==='floorsection'){const f=selected();if(f&&f.story===activeStory)items.push({x:f.x+f.width/2,y:f.y+f.length/2,z:C.storyElevation(project,f.story),title:f.name,sub:`${fmt(f.width)} × ${fmt(f.length)} ${unit()} · floor space`,pri:1e9,sel:true});}
  items.sort((a,b)=>b.pri-a.pri);const placed=[];g.save();g.textAlign='center';
  for(const it of items){
    const q=C.isoPoint(project,{x:it.x,y:it.y},it.z);g.font=`600 ${12*k}px Segoe UI`;const tw=g.measureText(it.title).width;let sw=0;if(it.sub){g.font=`${10*k}px Segoe UI`;sw=g.measureText(it.sub).width;}
    const w=Math.max(tw,sw)+18*k,h=(it.sub?35:23)*k,box={x:q.x-w/2,y:q.y-h/2,w,h};
    if(!it.sel&&placed.some(b=>b.x<box.x+box.w&&box.x<b.x+b.w&&b.y<box.y+box.h&&box.y<b.y+b.h))continue;placed.push(box);
    g.fillStyle=it.sel?'#0c1823f2':'#0c1823c4';g.strokeStyle=it.sel?'#6dd4d5':'#3d5366';g.lineWidth=k;g.beginPath();g.roundRect(box.x,box.y,box.w,box.h,5*k);g.fill();g.stroke();
    g.fillStyle='#f1efe5';g.font=`600 ${12*k}px Segoe UI`;g.fillText(it.title,q.x,box.y+15.5*k);if(it.sub){g.fillStyle='#8fd4d6';g.font=`${10*k}px Segoe UI`;g.fillText(it.sub,q.x,box.y+29*k);}
  }
  g.restore();
}

// The amber work plane for upper stories, with lower-story outlines for reference (graphics-card path only;
// the 2D fallback draws its own).
HOOKS.underlay.push((g,k)=>{
  if(activeStory<1)return;const b=C.bounds(project),z=C.storyElevation(project,activeStory),P=q=>C.isoPoint(project,q,z),pad=2,box={x:b.x-pad,y:b.y-pad,X:b.maxX+pad,Y:b.maxY+pad};
  const corners=[{x:box.x,y:box.y},{x:box.X,y:box.y},{x:box.X,y:box.Y},{x:box.x,y:box.Y}];g.save();R.path(g,corners.map(P));g.fillStyle='#ffc47f0b';g.fill();g.strokeStyle='#c5965388';g.lineWidth=1.4*k;g.stroke();
  if(grid){const s=geometry().scale*C.isoTransform(project).s;let step=project.grid;while(step*s<16)step*=2;g.strokeStyle='#e3ad6322';g.lineWidth=k;g.beginPath();for(let x=Math.ceil(box.x/step)*step;x<=box.X;x+=step){const a=P({x,y:box.y}),c=P({x,y:box.Y});g.moveTo(a.x,a.y);g.lineTo(c.x,c.y);}for(let y=Math.ceil(box.y/step)*step;y<=box.Y;y+=step){const a=P({x:box.x,y}),c=P({x:box.X,y});g.moveTo(a.x,a.y);g.lineTo(c.x,c.y);}g.stroke();}
  if(showReference){g.strokeStyle='#a7b5c27a';g.setLineDash([7*k,6*k]);g.lineWidth=1.5*k;const zl=C.storyElevation(project,activeStory-1);
    for(const r of [...project.rooms,...project.floorSections].filter(r=>r.story===activeStory-1)){const pts=[{x:r.x,y:r.y},{x:r.x+r.width,y:r.y},{x:r.x+r.width,y:r.y+r.length},{x:r.x,y:r.y+r.length}];R.path(g,pts.map(P));g.stroke();if(mapProj==='iso')for(const q of pts){const a=P(q),lo=C.isoPoint(project,q,zl);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(lo.x,lo.y);g.stroke();}}g.setLineDash([]);}
  const tag=P(corners[0]);g.font=`bold ${12*k}px Segoe UI`;g.fillStyle='#efbc7c';g.textAlign='left';g.fillText(storyName(activeStory)+' · work plane',tag.x+12*k,tag.y-12*k);g.restore();
});

// Camera marker used by previews (free camera, rail playhead).
function drawCamMarker(g,v,k,color='#ffd27a',label=''){
  const z=v.floorZ??C.storyElevation(project,v.story||0),P=q=>C.isoPoint(project,q,z),o=P(v),L=C.basis(v.facing-v.fov/2),Rb=C.basis(v.facing+v.fov/2),reach=2.4;
  g.save();R.polygon(g,[o,P({x:v.x+L.fx*reach,y:v.y+L.fy*reach}),P({x:v.x+Rb.fx*reach,y:v.y+Rb.fy*reach})],color+'33',color,1.5*k);
  g.fillStyle=color;g.strokeStyle='#10202a';g.lineWidth=2*k;g.beginPath();g.arc(o.x,o.y,7*k,0,Math.PI*2);g.fill();g.stroke();
  if(label){g.font=`600 ${11*k}px Segoe UI`;const w=g.measureText(label).width;g.fillStyle='#0c1823e8';g.fillRect(o.x+12*k,o.y-9*k,w+10*k,19*k);g.fillStyle=color;g.textAlign='left';g.fillText(label,o.x+17*k,o.y+5*k);}g.restore();
}

// ------------------------------------------------------------------ isometric / plan, map memory, smooth story changes
function setMapProjection(kind){
  kind=kind==='plan'?'plan':'iso';if(kind===mapProj&&C.mapProjection()===kind)return;
  let c=null,q=null,sOld=0;if(active==='iso'){bindIsoFrame();c=centreOfScreen();q=C.isoInverse(project,c,C.storyElevation(project,activeStory));sOld=C.isoTransform(project).s*(mapProj==='iso'?1.118:1);}
  mapProj=kind;C.setMapProjection(kind);C.setIsoFrame(project,null);isoFrame=null;bindIsoFrame();
  if(q){const sNew=C.isoTransform(project).s*(kind==='iso'?1.118:1);zoom=C.clamp(zoom*sOld/sNew,ZOOM_MIN,ZOOM_MAX);const g=geometry(),f=C.isoPoint(project,q,C.storyElevation(project,activeStory)),cc=centreOfScreen();pan={x:pan.x+(cc.x-f.x)*g.scale,y:pan.y+(cc.y-f.y)*g.scale};}
  if(mapViewSaved)mapViewSaved=null;
}
function rememberMap(){mapViewSaved={zoom,pan:{...pan},proj:mapProj,op:operation};}
function restoreMap(){const m=mapViewSaved;mapViewSaved=null;if(!m||m.op!==operation||m.proj!==mapProj)return false;zoom=m.zoom;pan={...m.pan};bindIsoFrame();drawSoon();return true;}
function tweenPan(to,ms=280){const from={...pan},t0=performance.now(),tw={};panTween=tw;const step=()=>{if(panTween!==tw)return;const t=Math.min(1,(performance.now()-t0)/ms),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;pan={x:from.x+(to.x-from.x)*e,y:from.y+(to.y-from.y)*e};draw();if(t<1)requestAnimationFrame(step);else panTween=null;};requestAnimationFrame(step);}
// Changing story keeps the zoom and keeps the same street corner in the middle of the screen; the map glides up or down.
function keepStoryView(prev,next){if(active!=='iso')return;bindIsoFrame();const g=geometry(),c=centreOfScreen(),q=C.isoInverse(project,c,C.storyElevation(project,prev)),f=C.isoPoint(project,q,C.storyElevation(project,next));if(Math.hypot(c.x-f.x,c.y-f.y)<1e-3)return;tweenPan({x:pan.x+(c.x-f.x)*g.scale,y:pan.y+(c.y-f.y)*g.scale});}

HOOKS.keyDown.push(e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return false;
  if(mode!=='test'&&(e.key==='1'||e.key==='2')){setMode(e.key==='1'?'iso':'plan');return true;}
  if(e.key==='3'&&mode!=='test'){setMode('fp');return true;}
  if(active==='iso'&&(e.key==='l'||e.key==='L')){cycleLabels();return true;}
  if(active==='iso'&&(e.key==='i'||e.key==='I')){cycleIcons();return true;}
  return false;
});

// ------------------------------------------------------------------ live previews
const miniState={key:'',p:null,canvas:document.createElement('canvas'),last:0,timer:0,mapKey:'',mapP:null,mapCanvas:document.createElement('canvas'),mapLast:0};
function poseKey(v){return [v.x,v.y,v.story,v.floorZ,v.facing,v.fov,v.eyeHeight,v.horizon,v.width,v.height].map(n=>typeof n==='number'?n.toFixed(3):String(n)).join(',');}
function miniCamera(){const rw=typeof routeWalkView==='function'?routeWalkView():null;if(rw)return {view:rw,label:'Route walk · click to go back'};const rv=railPreviewView();if(rv)return {view:rv,label:rv.name||'Rail preview'};const v=currentView();if(v)return {view:v,label:v.name+' · click to edit this view'};if(freeCam)return {view:freeCam,label:'Free camera · click to keep walking'};return null;}
// Re-render only when something changed, and at most ~14 times a second while dragging.
function cachedRender(state,keyProp,pProp,lastProp,key,render){
  if(state[keyProp]===key&&state[pProp]===project)return;const now=performance.now();
  if(state[keyProp]&&now-state[lastProp]<70){clearTimeout(state.timer);state.timer=setTimeout(()=>drawMini(),75);return;}
  render();state[keyProp]=key;state[pProp]=project;state[lastProp]=now;
}
function drawMiniFP(c,g,mc){
  if(!GLE){const r=R.drawFP(project,mc.view,{width:480});g.drawImage(r.canvas,0,0,c.width,c.height);return;}
  try{cachedRender(miniState,'key','p','last',[liveRev,poseKey(mc.view),c.width,c.height].join('|'),()=>GLE.renderFPToCanvas(project,GLE.camFromView(project,mc.view,{aspect:c.width/c.height}),c.width,c.height,miniState.canvas));}catch(e){glFailed(e);return;}
  if(miniState.canvas.width)g.drawImage(miniState.canvas,0,0,c.width,c.height);
}
function drawMiniMap(c,g){
  const v=fpFrame(),story=v?(v.story||0):activeStory;bindIsoFrame();
  const s=Math.min(c.width/1440,c.height/1080)*3.2,ctr=v?C.isoPoint(project,v,v.floorZ??C.storyElevation(project,story)):{x:720,y:540},geo={ox:c.width/2-ctr.x*s,oy:c.height/2-ctr.y*s,scale:s};
  if(GLE){try{cachedRender(miniState,'mapKey','mapP','mapLast',[liveRev,story,mapProj,geo.ox.toFixed(1),geo.oy.toFixed(1),c.width].join('|'),()=>GLE.renderMapToCanvas(project,{frame:C.isoTransform(project),geometry:geo,activeStory:story,showReference,showAllStories:false,cutaway:true,grid:false},c.width,c.height,miniState.mapCanvas));}catch(e){glFailed(e);}
    if(miniState.mapCanvas.width)g.drawImage(miniState.mapCanvas,0,0,c.width,c.height);}
  else{g.save();g.translate(geo.ox,geo.oy);g.scale(s,s);R.drawIso(g,project,{grid:false,dimensions:false,cutaway:true,activeStory:story,storyMode:'focus',clear:false});g.restore();}
  g.save();g.translate(geo.ox,geo.oy);g.scale(s,s);drawGraph(g,{labels:false,k:1/s});if(v)drawCamMarker(g,v,1/s,'#ffd27a');g.restore();
}
function thumbView(v,canvas){
  if(GLE){try{GLE.renderFPToCanvas(project,GLE.camFromView(project,v,{aspect:canvas.width/canvas.height}),canvas.width,canvas.height,canvas);return;}catch(e){glFailed(e);}}
  const r=R.drawFP(project,v,{width:480});canvas.getContext('2d').drawImage(r.canvas,0,0,canvas.width,canvas.height);
}
function coverageOf(v,source){if(GLE){try{return GLE.coverage(project,v,source);}catch(e){glFailed(e);}}return R.coverage(project,v,source);}
function fpFloorPoint(v,q){if(GLE){try{return GLE.floorAt(project,GLE.camFromView(project,v),q.x/v.width,q.y/v.height,v.width,v.height);}catch(e){glFailed(e);}}return R.floorVisible(project,v,q);}
function fpProbe(v,q,source=null){if(GLE){try{return GLE.probe(project,v,q.x/v.width,q.y/v.height,source);}catch(e){glFailed(e);}}return R.probe(project,v,q,source);}

// ------------------------------------------------------------------ exports
const CRC_T=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc32(b){let c=~0;for(let i=0;i<b.length;i++)c=CRC_T[(c^b[i])&255]^(c>>>8);return (~c)>>>0;}
// A plain (uncompressed) zip: PNG, WebM and JPEG are already compressed.
function makeZip(files){
  const enc=new TextEncoder(),parts=[],central=[];let offset=0;
  for(const f of files){const name=enc.encode(f.name),crc=crc32(f.data),n=f.data.length,h=new DataView(new ArrayBuffer(30));
    h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(12,0x21,true);h.setUint32(14,crc,true);h.setUint32(18,n,true);h.setUint32(22,n,true);h.setUint16(26,name.length,true);parts.push(h.buffer,name,f.data);
    const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(14,0x21,true);c.setUint32(16,crc,true);c.setUint32(20,n,true);c.setUint32(24,n,true);c.setUint16(28,name.length,true);c.setUint32(42,offset,true);central.push(c.buffer,name);
    offset+=30+name.length+n;}
  const csize=central.reduce((s,x)=>s+(x.byteLength??x.length),0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,csize,true);e.setUint32(16,offset,true);
  return new Blob([...parts,...central,e.buffer],{type:'application/zip'});
}
function renderViewCanvas(v,w=v.width,h=v.height){const c=document.createElement('canvas');if(GLE)GLE.renderFPToCanvas(project,GLE.camFromView(project,v,{aspect:w/h}),w,h,c);else{c.width=w;c.height=h;c.getContext('2d').drawImage(R.drawFP(project,v,{width:Math.min(1440,w)}).canvas,0,0,w,h);}return c;}
async function exportAllViews(){
  if(!project.viewpoints.length){toast('Place a viewpoint first.');return;}closeModal();toast('Rendering '+project.viewpoints.length+' views…',60000);
  try{const files=[],used=new Set();for(const v of project.viewpoints){const c=renderViewCanvas(v),blob=await new Promise(r=>c.toBlob(r,'image/png'));let name=safeName(v.name)+'.png';for(let n=2;used.has(name.toLowerCase());n++)name=safeName(v.name)+' ('+n+').png';used.add(name.toLowerCase());files.push({name,data:new Uint8Array(await blob.arrayBuffer())});}
    download(makeZip(files),safeName(project.name)+' · views.zip');toast(files.length+' viewpoint images exported as one zip.');}
  catch(e){toast('Export stopped: '+e.message,8000);}
}
EXT.makeZip=makeZip;EXT.renderViewCanvas=renderViewCanvas;
