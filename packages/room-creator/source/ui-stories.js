/* ===================== 0.13 · ui-stories.js =====================
   Second (and third, and tenth) stories made easy:
   - the story "elevator" on the map (also Page Up / Page Down) glides between stories,
   - "Build up" makes the next story from what is below it (same size, set back, overhang, gallery
     ring around an open middle, or roof deck) with walls, a low parapet or nothing, and can add
     stairs automatically — with a live preview before anything changes,
   - the Stairs tool: press where the flight starts, drag to where it arrives,
   - the Floor hole tool: cut an opening in an upper floor (it also opens the ceiling below). */
let stairsDraft=null,floorDraft=null,stairMove=null,buOpts=null;
const DIR_LABEL={N:'Climbs north ↑',E:'Climbs east →',S:'Climbs south ↓',W:'Climbs west ←'};
function toolAllowed(t){
  if(t==='rail')return railToolAllowed();
  if(t==='stairs'){if(!C.storyRecord(project,activeStory+1)){ask('Add a story above first?','Stairs climb from this story to the next one up, and '+storyName(activeStory)+' has nothing above it yet.',()=>showBuildUp(),'Build up a story…');return false;}return true;}
  if(t==='floorcut'){if(activeStory<1){toast('A floor hole opens an upper floor onto the story below. Go up a story first (Page Up, or the story list on the right of the map).',6500);return false;}return true;}
  return true;
}
// ------------------------------------------------------------------ elevator
function updateElevator(){
  const el=$('elevator');if(!el)return;const show=active==='iso'&&mode==='build';el.classList.toggle('hidden',!show);if(!show)return;
  const st=C.normalizeStories(project),items=[...st].reverse().map(s=>{const n=project.rooms.filter(r=>(r.story||0)===s.index).length+(project.floorSections||[]).filter(f=>(f.story||0)===s.index).length;return `<button data-story-go="${s.index}" class="${s.index===activeStory?'active':''}" title="${n} room / floor pieces, ${C.storyContents(project,s.index).props} 3D objects · ${fmt(C.storyElevation(project,s.index))} ${unit()}"><span>${esc(s.name)}</span><small>${n?n:(C.storyContents(project,s.index).props?'3D objects':'empty')}</small></button>`;}).join('');
  el.innerHTML=`<div class="elev-title">STORIES · PgUp / PgDn</div><button class="add" data-action="add-story" title="Make the next story from what is below">+ Build up</button>${items}`;
}
HOOKS.top.push(updateElevator);
HOOKS.click.push((e,b)=>{if(b.dataset.storyGo!==undefined){selectStory(Number(b.dataset.storyGo));return true;}return false;});
HOOKS.keyDown.push(e=>{if(mode!=='build'||active!=='iso'||e.ctrlKey||e.metaKey)return false;if(e.key==='PageUp'||e.key==='PageDown'){e.preventDefault();const n=activeStory+(e.key==='PageUp'?1:-1);if(n>=0&&n<project.stories.length)selectStory(n);else if(n>=project.stories.length)toast('This is the top story. “+ Build up” adds another.');return true;}return false;});
// ------------------------------------------------------------------ build up a story
const rectEdges=r=>[[{x:r.x,y:r.y},{x:r.x+r.width,y:r.y}],[{x:r.x+r.width,y:r.y},{x:r.x+r.width,y:r.y+r.length}],[{x:r.x,y:r.y+r.length},{x:r.x+r.width,y:r.y+r.length}],[{x:r.x,y:r.y},{x:r.x,y:r.y+r.length}]];
const rectAnd=(a,b)=>{const x0=Math.max(a.x,b.x),y0=Math.max(a.y,b.y),x1=Math.min(a.x+a.width,b.x+b.width),y1=Math.min(a.y+a.length,b.y+b.length);return x1-x0>1e-6&&y1-y0>1e-6?{x:x0,y:y0,width:x1-x0,length:y1-y0}:null;};
// The outside edge of several floor rectangles: every rectangle edge, cut where other rectangles start or
// stop, keeping only the pieces with no new floor on their outer side. Collinear neighbours are joined.
function outlineSegments(items){
  const rects=items.map(i=>i.r),inside=(x,y)=>rects.some(r=>x>r.x+1e-6&&x<r.x+r.width-1e-6&&y>r.y+1e-6&&y<r.y+r.length-1e-6),out=[],seen=new Set();
  for(const it of items){const r=it.r;
    for(const [h,fixed,lo,hi,dir] of [[true,r.y,r.x,r.x+r.width,-1],[true,r.y+r.length,r.x,r.x+r.width,1],[false,r.x,r.y,r.y+r.length,-1],[false,r.x+r.width,r.y,r.y+r.length,1]]){
      const cuts=new Set([lo,hi]);for(const o of rects)for(const c of h?[o.x,o.x+o.width]:[o.y,o.y+o.length])if(c>lo+1e-6&&c<hi-1e-6)cuts.add(c);
      const cs=[...cuts].sort((m,n)=>m-n);let run=null;const flush=()=>{if(!run)return;const key=[h,fixed.toFixed(3),run.a.toFixed(3),run.b.toFixed(3)].join('|');if(!seen.has(key)){seen.add(key);out.push({h,fixed,a:run.a,b:run.b,src:it});}run=null;};
      for(let i=0;i<cs.length-1;i++){const m=(cs[i]+cs[i+1])/2,keep=h?!inside(m,fixed+dir*.05):!inside(fixed+dir*.05,m);if(keep){if(run&&Math.abs(run.b-cs[i])<1e-6)run.b=cs[i+1];else{flush();run={a:cs[i],b:cs[i+1]};}}else flush();}flush();}
  }
  return out;
}
function onRectEdge(sg,r){const e=1e-6,m=(sg.a+sg.b)/2;return sg.h?((Math.abs(sg.fixed-r.y)<e||Math.abs(sg.fixed-r.y-r.length)<e)&&m>r.x-e&&m<r.x+r.width+e):((Math.abs(sg.fixed-r.x)<e||Math.abs(sg.fixed-r.x-r.width)<e)&&m>r.y-e&&m<r.y+r.length+e);}
function buildUpApply(p,o){
  C.normalizeStories(p);const next=p.stories.length;C.addStory(p,o.name);const below=next-1;
  const src=o.base==='none'?[]:[...p.rooms.filter(r=>(r.story||0)===below),...(p.floorSections||[]).filter(f=>(f.story||0)===below)].filter(s=>o.base==='all'||s.id===o.base);
  const made={story:next,rooms:[],floors:[],walls:[],stairs:null,notes:[],tops:[]},storyLabel=(o.name||C.storyLabel(next)).slice(0,40),edgeRects=[];
  for(const s of src){
    const R={x:s.x,y:s.y,width:s.width,length:s.length},isRoom=!!s.walls;let rects,inner=null;
    if(o.shape==='setback'){const d=o.setback;rects=[{x:R.x+d,y:R.y+d,width:R.width-2*d,length:R.length-2*d}];}
    else if(o.shape==='overhang'){const d=o.overhang,S=o.sides;rects=[{x:R.x-(S.W?d:0),y:R.y-(S.N?d:0),width:R.width+(S.W?d:0)+(S.E?d:0),length:R.length+(S.N?d:0)+(S.S?d:0)}];}
    else if(o.shape==='ring'){const w=Math.min(o.ring,R.width/2-.6,R.length/2-.6);if(w<.8)throw Error('“'+s.name+'” is too small for a gallery ring. Use a narrower ring or another shape.');
      rects=[{x:R.x,y:R.y,width:R.width,length:w},{x:R.x,y:R.y+R.length-w,width:R.width,length:w},{x:R.x,y:R.y+w,width:w,length:R.length-2*w},{x:R.x+R.width-w,y:R.y+w,width:w,length:R.length-2*w}];inner={x:R.x+w,y:R.y+w,width:R.width-2*w,length:R.length-2*w};if(isRoom)s.openAbove=true;}
    else rects=[R];
    if(rects.some(r=>r.width<.6||r.length<.6))throw Error('“'+s.name+'” is too small for that set-back. Use a smaller distance.');
    made.tops.push(...rects);
    const host=isRoom?s:(C.floorSectionHost(p,s)||p.rooms[0]),base=String(s.name||'Floor').split(' · ')[0],label=base+' · '+storyLabel;
    if(o.edges==='room'&&o.shape!=='ring'){
      for(const r of rects){if(r.width<2-1e-6||r.length<2-1e-6)throw Error('An enclosed room must be at least 2 m each way (“'+s.name+'” would be smaller). Choose “Low wall” or “No walls”, or a smaller set-back.');if(r.width>40+1e-6||r.length>40+1e-6)throw Error('An enclosed room can be at most 40 m each way (“'+s.name+'” would be bigger). Choose “Low wall” or “No walls”.');
        const room=C.makeRoom(label,r.x,r.y,r.width,r.length,next);if(o.copyLook)for(const k of ['floor','wall','ceiling','walls','light','exterior'])if(host?.[k]!==undefined)room[k]=C.clone(host[k]);if(!o.copyLook&&host){room.light=C.clone(host.light);}p.rooms.push(room);made.rooms.push(room.id);}
    }else{
      for(const r of rects){const f=C.makeFloorSection(p,next,{x:r.x,y:r.y},{x:r.x+r.width,y:r.y+r.length},{name:label+' · floor'});if(o.copyLook&&s.floor)f.floor=C.clone(s.floor);made.floors.push(f.id);}
      for(const r of rects)edgeRects.push({r,host,label,inner});
    }
  }
  // Walls go round the outside of all the new floor together, so neighbouring pieces do not get a wall between them.
  if(o.edges!=='none'&&edgeRects.length){const full=o.edges==='parapet'?Math.min(1.05,p.wallHeight):null,rail=Math.min(1.05,p.wallHeight);
    for(const sg of outlineSegments(edgeRects)){if(sg.b-sg.a<.35)continue;const A=sg.h?{x:sg.a,y:sg.fixed}:{x:sg.fixed,y:sg.a},B=sg.h?{x:sg.b,y:sg.fixed}:{x:sg.fixed,y:sg.b},isRail=!!sg.src.inner&&onRectEdge(sg,sg.src.inner);
      const q=C.createFreeWall(p,next,A,B,{height:isRail?rail:full,roomId:sg.src.host?.id,name:sg.src.label+(isRail?' · gallery rail':full?' · parapet':' · wall')});made.walls.push(q.id);}}
  if(o.edges==='room'&&o.shape!=='ring')C.checkRooms(p);
  if(o.stairs&&src.length){const sh=p.storyHeight||3.2,steps=Math.max(3,Math.round(sh/.18)),L=steps*.28;
    const order=[...src].sort((a,b)=>(b.walls?1:0)-(a.walls?1:0)||b.width*b.length-a.width*a.length);
    outer:for(const s of order)for(const top of made.tops){const I=rectAnd(s,top);if(!I)continue;
      const tries=[];if(I.length>=L+1.6&&I.width>=1.8)tries.push({x:I.x+.3,y:I.y+I.length-.9-L,width:1.1,length:L,dir:'N'});if(I.width>=L+1.6&&I.length>=1.8)tries.push({x:I.x+.9,y:I.y+.3,width:1.1,length:L,dir:'E'});
      for(const t of tries){try{made.stairs=C.createStairs(p,{story:below,...t,steps}).id;break outer;}catch(e){made.notes.push(e.message);}}}
    if(!made.stairs)made.notes.unshift('No spot was big enough for automatic stairs (they need about '+fmt(L+1.6,1)+' '+unit()+' of clear floor in a row). Add them yourself with the Stairs tool.');}
  return made;
}
function buildUpTrial(o){const t=C.clone(project);try{const info=buildUpApply(t,o);const v=C.validateBundle({project:t,assets:[...catalog.values()]});return {t:v.project,info};}catch(e){return {error:e.message};}}
function buildUpSVG(trial,next){
  const below=[...project.rooms,...project.floorSections].filter(r=>(r.story||0)===next-1),tp=trial?.t;
  const rooms=tp?tp.rooms.filter(r=>(r.story||0)===next):[],floors=tp?tp.floorSections.filter(f=>(f.story||0)===next):[],walls=tp?tp.partitions.filter(q=>q.story===next&&!q.stairId):[],stairs=tp?(tp.stairs||[]).filter(s=>!(project.stairs||[]).some(x=>x.id===s.id)):[];
  const all=[...below,...rooms,...floors];if(!all.length)return '<text x="165" y="120" fill="#8ea3b0" font-size="12" text-anchor="middle">An empty story — draw floor on it afterwards</text>';
  const x0=Math.min(...all.map(r=>r.x))-1,y0=Math.min(...all.map(r=>r.y))-1,x1=Math.max(...all.map(r=>r.x+r.width))+1,y1=Math.max(...all.map(r=>r.y+r.length))+1,s=Math.min(320/(x1-x0),230/(y1-y0)),ox=(330-(x1-x0)*s)/2,oy=(240-(y1-y0)*s)/2;
  const X=x=>(ox+(x-x0)*s).toFixed(1),Y=y=>(oy+(y-y0)*s).toFixed(1),W=w=>(w*s).toFixed(1),rect=(r,fill,stroke,extra='')=>`<rect x="${X(r.x)}" y="${Y(r.y)}" width="${W(r.width)}" height="${W(r.length)}" fill="${fill}" stroke="${stroke}" ${extra}/>`;
  let out=below.map(r=>rect(r,'#1c2833','#4b6070','stroke-width="1"')).join('');
  out+=floors.map(r=>rect(r,'#ffc47f30','#ffc47f','stroke-width="1.2" stroke-dasharray="4 3"')).join('');
  out+=rooms.map(r=>rect(r,'#ffc47f2a','#f1efe5','stroke-width="2.4"')).join('');
  out+=walls.map(q=>{const w=C.partitionWall(tp,q),low=q.height!=null&&q.height<1.5;return `<line x1="${X(w.a.x)}" y1="${Y(w.a.y)}" x2="${X(w.b.x)}" y2="${Y(w.b.y)}" stroke="${low?'#ffd27a':'#f1efe5'}" stroke-width="${low?1.6:2.4}" ${low?'stroke-dasharray="3 2"':''}/>`;}).join('');
  for(const st of stairs){const g=C.stairGeometry(tp,st);out+=rect(st,'#6dd4d540','#6dd4d5','stroke-width="1.4"');for(let i=1;i<g.steps;i+=2){const f=i/g.steps,a={x:g.bottom.x+(g.top.x-g.bottom.x)*f,y:g.bottom.y+(g.top.y-g.bottom.y)*f},px=g.dir.y,py=-g.dir.x,h=g.across/2;out+=`<line x1="${X(a.x+px*h)}" y1="${Y(a.y+py*h)}" x2="${X(a.x-px*h)}" y2="${Y(a.y-py*h)}" stroke="#6dd4d5" stroke-width=".7"/>`;}out+=`<text x="${X(st.x+st.width/2)}" y="${Y(st.y+st.length/2)}" fill="#bff5f0" font-size="9" text-anchor="middle" dominant-baseline="middle">UP</text>`;}
  return out;
}
function readBuildUp(){const v=id=>$(id)?.value,c=id=>!!$(id)?.checked,shape=document.querySelector('input[name=buShape]:checked')?.value||'full',edges=document.querySelector('input[name=buEdges]:checked')?.value||'room';
  return {name:v('buName')||'',base:v('buBase')||'all',shape,edges,setback:Math.max(.1,parseLength(v('buSetback')||1)),overhang:Math.max(.1,parseLength(v('buOverhang')||1.5)),ring:Math.max(.8,parseLength(v('buRing')||2.5)),sides:{N:c('buN'),E:c('buE'),S:c('buS'),W:c('buW')},copyLook:c('buLook'),stairs:c('buStairs')};}
function showBuildUp(){
  if(mode==='test')return;if(project.stories.length>=21){toast('Room Creator supports up to 21 stories.');return;}
  const next=project.stories.length,below=[...project.rooms.filter(r=>(r.story||0)===next-1),...project.floorSections.filter(f=>(f.story||0)===next-1)];
  const nRooms=below.filter(s=>s.walls).length,nFloors=below.length-nRooms,o=buOpts||{shape:'full',edges:'room',setback:1,overhang:1.5,ring:2.5,sides:{N:false,E:false,S:true,W:false},copyLook:true,stairs:true};
  const shapeChoice=(v,t,d)=>`<label><input type="radio" name="buShape" value="${v}" ${o.shape===v?'checked':''}><span><b>${t}</b><small>${d}</small></span></label>`,edgeChoice=(v,t,d)=>`<label><input type="radio" name="buEdges" value="${v}" ${o.edges===v?'checked':''}><span><b>${t}</b><small>${d}</small></span></label>`;
  modal(`${modalTitle('Build up a new story')}<p class="lead">Adds <b>${esc(defaultStoryName(next))}</b> at ${fmt(C.storyElevation(project,next))} ${unit()}, on top of <b>${esc(storyName(next-1))}</b>. Nothing changes until you press Build story — and Undo removes it again.</p>
    <div style="display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:16px;align-items:start"><div>
      <label>Story name<input id="buName" value="${esc(defaultStoryName(next))}" maxlength="80"></label>
      <label style="margin-top:10px">Start from<select id="buBase">${below.length?`<option value="all">Everything on ${esc(storyName(next-1))} (${nRooms} room${nRooms===1?'':'s'}${nFloors?`, ${nFloors} floor piece${nFloors===1?'':'s'}`:''})</option>`:''}${below.map(s=>`<option value="${s.id}">Only ${esc(s.name)} · ${fmt(s.width)} × ${fmt(s.length)} ${unit()}</option>`).join('')}<option value="none" ${below.length?'':'selected'}>Nothing — an empty story I will draw on</option></select></label>
      <h3>Shape</h3><div class="choice-grid">${shapeChoice('full','Same size','Exactly over what is below')}${shapeChoice('setback','Set back','Smaller, stepped in on every side')}${shapeChoice('overhang','Overhang','Sticks out past the walls below')}${shapeChoice('ring','Gallery ring','A walkway round an open middle (see down)')}${shapeChoice('deck','Roof deck','Open roof with a low wall')}</div>
      <div id="buShapeOpts" style="margin-top:8px"></div>
      <h3>Edges</h3><div class="choice-grid">${edgeChoice('room','Enclosed room','Full walls; doors, windows and lights work')}${edgeChoice('parapet','Low wall','1.05 m parapet or balcony rail')}${edgeChoice('none','No walls','Open floor; add walls later')}</div>
      <label class="check" style="margin-top:10px"><input type="checkbox" id="buLook" ${o.copyLook?'checked':''}>Copy floor, wall and ceiling looks from below</label>
      <label class="check"><input type="checkbox" id="buStairs" ${o.stairs?'checked':''}>Add stairs up from below automatically</label>
    </div><div><svg id="buPreview" class="buildup-preview" viewBox="0 0 330 240" role="img" aria-label="Top view preview"></svg><p class="subtle">Top view · grey = ${esc(storyName(next-1))} · amber = new floor · white = walls · yellow dashes = low walls · teal = stairs</p><div id="buSummary" class="info"></div><div id="buError" class="error-text hidden"></div></div></div>
    <div class="button-row"><button data-action="close-modal">Cancel</button><button data-action="add-story-simple" title="The older dialog: one matching room, or an empty story">Simple add…</button><button id="buCreate" class="primary">Build story</button></div>`);
  $('modalRoot').querySelector('.modal').style.width='min(900px,96vw)';
  const shapeOpts=()=>{const sh=document.querySelector('input[name=buShape]:checked')?.value,cur=readBuildUpSafe();const box=$('buShapeOpts');if(!box)return;
    box.innerHTML=sh==='setback'?`<label>Step in by (${unit()})<input type="number" id="buSetback" step="0.1" min="0.1" value="${fmt(cur.setback??o.setback)}"></label>`:sh==='overhang'?`<div class="form-grid"><label>Sticks out by (${unit()})<input type="number" id="buOverhang" step="0.1" min="0.1" value="${fmt(cur.overhang??o.overhang)}"></label></div><div class="wall-directions" style="margin-top:6px">${['N','E','S','W'].map(k=>`<label class="check"><input type="checkbox" id="bu${k}" ${(cur.sides||o.sides)[k]?'checked':''}>${C.SIDE_NAMES[k]}</label>`).join('')}</div>`:sh==='ring'?`<label>Walkway width (${unit()})<input type="number" id="buRing" step="0.1" min="0.8" value="${fmt(cur.ring??o.ring)}"></label><p class="subtle">The room below becomes double height in the middle, so you can look down from the gallery.</p>`:'';};
  const readBuildUpSafe=()=>{try{return readBuildUp();}catch(e){return {};}};
  const update=()=>{const opts=readBuildUp(),trial=buildUpTrial(opts),svg=$('buPreview');if(!svg)return;svg.innerHTML=buildUpSVG(trial,next);buOpts=opts;
    const err=$('buError'),sum=$('buSummary');err.classList.toggle('hidden',!trial.error);err.textContent=trial.error||'';$('buCreate').disabled=!!trial.error;
    if(trial.info){const i=trial.info;sum.textContent=[i.rooms.length?`${i.rooms.length} enclosed room${i.rooms.length>1?'s':''}`:'',i.floors.length?`${i.floors.length} floor piece${i.floors.length>1?'s':''}`:'',i.walls.length?`${i.walls.length} wall segment${i.walls.length>1?'s':''}`:'',i.stairs?'stairs from below':''].filter(Boolean).join(' · ')||'An empty story';if(opts.stairs&&!i.stairs&&i.notes[0])sum.textContent+=' — '+i.notes[0];}else sum.textContent='';};
  const box=$('modalRoot').querySelector('.modal'); // listeners live on this dialog only, so they vanish with it
  box.addEventListener('change',e=>{if(e.target.name==='buShape'){if(e.target.value==='deck'){const p=document.querySelector('input[name=buEdges][value=parapet]');if(p)p.checked=true;}shapeOpts();}update();});
  box.addEventListener('input',e=>{if(['buSetback','buOverhang','buRing'].includes(e.target.id))update();});
  shapeOpts();update();
  $('buCreate').onclick=()=>{const opts=readBuildUp();let info=null;if(mutate(()=>{info=buildUpApply(project,opts);},'Build up '+(opts.name||'a story'))){closeModal();selectStory(info.story);
      if(info.rooms[0]){roomId=info.rooms[0];selection={kind:'room',id:roomId};panel='room';}else if(info.floors[0]){selection={kind:'floorsection',id:info.floors[0]};panel='selection';}refresh();
      toast(`${storyName(info.story)} built${info.stairs?' with stairs from below':''}. ${info.stairs?'Double-click the floor beside the stairs to walk up them.':info.notes[0]||''}`,8000);}};
}
// ------------------------------------------------------------------ stairs tool
function stairsFromDrag(S,E){const sh=project.storyHeight||3.2,steps=Math.max(3,Math.round(sh/.18)),def=steps*.28,dx=E.x-S.x,dy=E.y-S.y,drag=Math.hypot(dx,dy);let dir='N',L=def;
  if(drag>=.4){dir=Math.abs(dy)>=Math.abs(dx)?(dy<0?'N':'S'):(dx>0?'E':'W');L=C.clamp(Math.abs(dir==='N'||dir==='S'?dy:dx),1.4,12);}
  const w=1.1;let r;if(dir==='N'||dir==='S')r={x:S.x-w/2,y:dir==='N'?S.y-L:S.y,width:w,length:L};else r={x:dir==='E'?S.x:S.x-L,y:S.y-w/2,width:L,length:w};return {...r,dir,steps,run:L};}
function drawStairOutline(g,k,st,{color='#6dd4d5',dash=null,label='UP',fill=null,width=1.8,z=null}={}){
  const g0=C.stairGeometry(project,st);z=z??C.storyElevation(project,st.story||0);const P=q=>C.isoPoint(project,q,z),c=[{x:st.x,y:st.y},{x:st.x+st.width,y:st.y},{x:st.x+st.width,y:st.y+st.length},{x:st.x,y:st.y+st.length}].map(P);
  g.save();R.path(g,c);if(fill){g.fillStyle=fill;g.fill();}g.strokeStyle=color;g.lineWidth=width*k;if(dash)g.setLineDash(dash.map(d=>d*k));g.stroke();g.setLineDash([]);
  const px=g0.dir.y,py=-g0.dir.x,h=g0.across/2;g.lineWidth=.8*k;g.globalAlpha=.75;g.beginPath();for(let i=1;i<g0.steps;i++){const f=i/g0.steps,a={x:g0.bottom.x+(g0.top.x-g0.bottom.x)*f,y:g0.bottom.y+(g0.top.y-g0.bottom.y)*f},A=P({x:a.x+px*h,y:a.y+py*h}),B=P({x:a.x-px*h,y:a.y-py*h});g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);}g.stroke();g.globalAlpha=1;
  const a=P(g0.bottom),b=P(g0.top),ang=Math.atan2(b.y-a.y,b.x-a.x),s=7*k;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.lineWidth=1.6*k;g.stroke();g.fillStyle=color;g.beginPath();g.moveTo(b.x,b.y);g.lineTo(b.x-Math.cos(ang-.5)*s,b.y-Math.sin(ang-.5)*s);g.lineTo(b.x-Math.cos(ang+.5)*s,b.y-Math.sin(ang+.5)*s);g.closePath();g.fill();
  if(label){const m=P({x:st.x+st.width/2,y:st.y+st.length/2});g.font=`bold ${10*k}px Segoe UI`;const tw=g.measureText(label).width;g.fillStyle='#0c1823d8';g.fillRect(m.x-tw/2-4*k,m.y-8*k,tw+8*k,15*k);g.fillStyle=color;g.textAlign='center';g.fillText(label,m.x,m.y+3.5*k);}g.restore();
}
function stairHitMap(q){for(const st of [...(project.stairs||[])].reverse()){if((st.story||0)!==activeStory)continue;const f=C.isoInverse(project,q,C.storyElevation(project,st.story||0));if(f.x>=st.x&&f.x<=st.x+st.width&&f.y>=st.y&&f.y<=st.y+st.length)return st;}return null;}
HOOKS.drawGraph.push((g,k)=>{
  if(active!=='iso')return;
  for(const st of project.stairs||[]){const sel=selection?.kind==='stairs'&&selection.id===st.id,mv=stairMove?.id===st.id?{...st,...stairMove.pos}:st;
    if((st.story||0)===activeStory)drawStairOutline(g,k,mv,{color:sel?'#ffd27a':'#6dd4d5',label:sel?'UP · '+st.name:'UP',width:sel?2.6:1.6,fill:sel?'#ffd27a18':null});
    else if((st.story||0)+1===activeStory)drawStairOutline(g,k,mv,{color:'#6dd4d5aa',dash:[5,4],label:'DOWN',width:1.2,z:C.storyElevation(project,activeStory)});}
  for(const c of (project.floorCuts||[]).filter(c=>(c.story||0)===activeStory&&!c.stairId)){const sel=selection?.kind==='floorcut'&&selection.id===c.id,z=C.storyElevation(project,activeStory),P=q=>C.isoPoint(project,q,z),pts=[{x:c.x,y:c.y},{x:c.x+c.width,y:c.y},{x:c.x+c.width,y:c.y+c.length},{x:c.x,y:c.y+c.length}].map(P);
    g.save();R.path(g,pts);g.strokeStyle=sel?'#ffd27a':'#ff9c8d';g.lineWidth=(sel?2.6:1.6)*k;g.setLineDash([6*k,4*k]);g.stroke();g.setLineDash([]);g.beginPath();g.moveTo(pts[0].x,pts[0].y);g.lineTo(pts[2].x,pts[2].y);g.moveTo(pts[1].x,pts[1].y);g.lineTo(pts[3].x,pts[3].y);g.lineWidth=k;g.stroke();g.restore();}
  if(stairsDraft){const d=stairsFromDrag(stairsDraft.S,stairsDraft.E);drawStairOutline(g,k,{...d,story:activeStory,steps:d.steps},{color:'#ffcf9a',label:'NEW',fill:'#ffcf9a22',width:2.4});}
  if(floorDraft&&hover){const a=floorDraft.origin,b=snapPoint(hover),z=C.storyElevation(project,activeStory),P=q=>C.isoPoint(project,q,z),r={x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),X:Math.max(a.x,b.x),Y:Math.max(a.y,b.y)};R.polygon(g,[{x:r.x,y:r.y},{x:r.X,y:r.y},{x:r.X,y:r.Y},{x:r.x,y:r.Y}].map(P),'#ff9c8d22','#ff9c8d',2*k);}
});
// The live readout goes in the guide bar under the map (the floor readout box is redrawn by the floor tools).
HOOKS.top.push(()=>{if(tool!=='stairs')stairsDraft=null;if(tool!=='floorcut')floorDraft=null;});
function stairReadout(){if(!stairsDraft)return;const d=stairsFromDrag(stairsDraft.S,stairsDraft.E),going=d.run/d.steps,rise=(project.storyHeight||3.2)/d.steps;$('guideText').textContent=`Stairs up to ${storyName(activeStory+1)} · ${DIR_LABEL[d.dir]} · ${d.steps} steps · ${fmt(d.run)} ${unit()} long · each step ${fmt(rise,2)} high, ${fmt(going,2)} deep${going<.22?' · steep! drag further':''} · release to place`;}
HOOKS.pointerDown.push((e,q)=>{
  if(active!=='iso'||mode!=='build'||e.button!==0)return false;
  if(tool==='stairs'){const S=snapPoint(C.isoInverse(project,q,C.storyElevation(project,activeStory)));if(!C.inFloor(project,{...S,story:activeStory},0,activeStory)){toast('Start the stairs on floor: press where the bottom step should be.');return true;}stairsDraft={S,E:S};stairReadout();drawSoon();return true;}
  if(tool==='floorcut'){const f=snapPoint(C.isoInverse(project,q,C.storyElevation(project,activeStory)));if(!floorDraft){floorDraft={origin:f};hover=f;updateTop();drawSoon();return true;}
    const a=floorDraft.origin,r={x:Math.min(a.x,f.x),y:Math.min(a.y,f.y),width:Math.abs(f.x-a.x),length:Math.abs(f.y-a.y)};floorDraft=null;
    if(r.width<.3||r.length<.3){toast('Make the hole at least 0.3 m each way.');drawSoon();return true;}
    let made=null;if(mutate(()=>{made=makeFloorHole(project,activeStory,r);selection={kind:'floorcut',id:made.id};panel='selection';tool='select';},'Cut floor hole'))toast('Floor hole cut'+(made.ceilings?' (the ceiling below is opened too)':'')+'. Its edges are open — add a low wall or rail if people should not fall in.',7000);return true;}
  if(tool==='select'){const vNear=project.viewpoints.some(v=>itemStory(v)===activeStory&&Math.hypot(q.x-nodePoint(v).x,q.y-nodePoint(v).y)<19*mk());if(vNear)return false;const st=stairHitMap(q);
    if(st){selection={kind:'stairs',id:st.id};panel='selection';stairMove={id:st.id,start:C.isoInverse(project,q,C.storyElevation(project,st.story||0)),pos:{x:st.x,y:st.y},moved:false,client:{x:e.clientX,y:e.clientY}};refresh();return true;}}
  return false;
});
HOOKS.mapClick.push((e,q,floor)=>{if(tool!=='select')return false;const c=[...(project.floorCuts||[])].reverse().find(c=>(c.story||0)===activeStory&&!c.stairId&&C.inRect(c,floor));if(c){selection={kind:'floorcut',id:c.id};panel='selection';refresh();return true;}return false;});
HOOKS.pointerMove.push(e=>{
  if(stairsDraft){stairsDraft.E=snapPoint(C.isoInverse(project,eventPoint(e),C.storyElevation(project,activeStory)));stairReadout();drawSoon();return true;}
  if(stairMove){if(!stairMove.moved&&Math.hypot(e.clientX-stairMove.client.x,e.clientY-stairMove.client.y)<3)return true;stairMove.moved=true;const st=C.stairById(project,stairMove.id);if(!st){stairMove=null;return true;}const f=C.isoInverse(project,eventPoint(e),C.storyElevation(project,st.story||0)),p=snapPoint({x:st.x+f.x-stairMove.start.x,y:st.y+f.y-stairMove.start.y});stairMove.pos=p;$('guideText').textContent=`Moving ${st.name} · let go to place it (the opening upstairs moves with it)`;drawSoon();return true;}
  if(floorDraft){drawSoon();}
  return false;
});
HOOKS.pointerUp.push(e=>{
  if(stairsDraft){const d=stairsFromDrag(stairsDraft.S,stairsDraft.E);stairsDraft=null;$('floorReadout').classList.add('hidden');let id=null;
    if(mutate(()=>{const st=C.createStairs(project,{story:activeStory,x:d.x,y:d.y,width:1.1,length:d.run,dir:d.dir,steps:d.steps});id=st.id;selection={kind:'stairs',id};panel='selection';tool='select';},'Add stairs'))toast('Stairs added. The floor above is opened over them and a guard rail goes round the opening. Double-click the floor in front to walk up.',7500);else drawSoon();return true;}
  if(stairMove){const m=stairMove;stairMove=null;$('floorReadout').classList.add('hidden');if(m.moved)mutate(()=>C.editStairs(project,m.id,{x:m.pos.x,y:m.pos.y}),'Move stairs');else drawSoon();return true;}
  return false;
});
HOOKS.keyDown.push(e=>{if(e.key==='Escape'&&(stairsDraft||floorDraft||stairMove)){stairsDraft=null;floorDraft=null;stairMove=null;$('floorReadout').classList.add('hidden');drawSoon();}return false;});
HOOKS.messages.push(()=>({stairs:`Press on the floor where the stairs should START (the bottom step), drag toward where they should arrive, and let go. A plain click makes a standard flight climbing north. They climb to ${storyName(activeStory+1)}.`,floorcut:floorDraft?'Click the opposite corner of the hole. Escape cancels.':`Click one corner of the hole in ${storyName(activeStory)}’s floor, then the opposite corner. The ceiling of the room below opens too.`}));
// ------------------------------------------------------------------ floor holes
function makeFloorHole(p,story,r){const c={id:C.uid('floorcut'),name:'Floor hole '+((p.floorCuts||[]).filter(x=>!x.stairId).length+1),story,x:r.x,y:r.y,width:r.width,length:r.length};p.floorCuts=p.floorCuts||[];p.floorCuts.push(c);let n=0;syncHoleCeilings(p,c);n=(p.ceilingCuts||[]).filter(x=>x.floorCutId===c.id).length;return {id:c.id,ceilings:n};}
function syncHoleCeilings(p,c){p.ceilingCuts=(p.ceilingCuts||[]).filter(x=>x.floorCutId!==c.id);if(c.openBelow===false)return;for(const room of p.rooms.filter(r=>(r.story||0)===c.story-1&&!r.openAbove)){if(!rectAnd(room,c))continue;try{const cut=C.makeCeilingRect(p,room.id,{x:c.x,y:c.y},{x:c.x+c.width,y:c.y+c.length},'cut');cut.floorCutId=c.id;cut.name=c.name+' · ceiling below';}catch(e){}}}
function floorCutForm(c){
  if(c.stairId){const st=C.stairById(project,c.stairId);return `<section class="section"><span class="eyebrow">Floor opening</span><h2>${esc(c.name)}</h2><p>This opening belongs to <b>${esc(st?.name||'stairs')}</b> and moves with them. Select the stairs to change it.</p>${st?`<button data-select-stairs="${st.id}" class="block">Select ${esc(st.name)}</button>`:''}</section>`;}
  const v=k=>fmt(c[k]);return `<section class="section"><span class="eyebrow">Floor hole · ${esc(storyName(c.story||0))}</span><label>Name<input type="text" data-floorcut="name" value="${esc(c.name)}" maxlength="80"></label><div class="form-grid">${['x','y','width','length'].map(k=>`<label>${{x:'From X',y:'From Y',width:'Width',length:'Length'}[k]} (${unit()})<input type="number" step="0.05" data-floorcut="${k}" value="${v(k)}"></label>`).join('')}</div><label class="check"><input type="checkbox" data-floorcut="openBelow" ${c.openBelow===false?'':'checked'}>Also open the ceiling of the room below</label><p>You can see down through the hole; walking (and the free camera) stops at its edge. Add a Wall with a low height round it for a balcony rail.</p><div class="button-row"><button data-action="delete-selection" class="danger">Delete hole</button></div></section>`;
}
document.addEventListener('change',e=>{const el=e.target;if(!el.matches?.('[data-floorcut]'))return;const c=selection?.kind==='floorcut'?selected():null;if(!c)return;const k=el.dataset.floorcut;let val=el.type==='checkbox'?el.checked:el.type==='text'?el.value:parseLength(el.value);if(el.type==='number'&&!Number.isFinite(val))return;
  mutate(()=>{const q=project.floorCuts.find(x=>x.id===c.id);if(['width','length'].includes(k)&&val<.2)throw Error('A floor hole must be at least 0.2 m each way.');q[k]=val;syncHoleCeilings(project,q);},'Edit floor hole');});
HOOKS.action.push(name=>{
  if(name==='delete-selection'&&selection?.kind==='floorcut'){const c=selected();if(c&&!c.stairId)mutate(()=>{project.floorCuts=project.floorCuts.filter(x=>x.id!==c.id);project.ceilingCuts=project.ceilingCuts.filter(x=>x.floorCutId!==c.id);selection=null;panel='selection';},'Delete floor hole');return true;}
  if(name==='import-stairs-texture'){beginMaterialImport(surfaceSpec('stairs'));return true;}
  if(name==='clear-stairs-texture'){clearSurfaceTexture(surfaceSpec('stairs'));return true;}
  if(name==='reset-stairs-texture'){resetSurfaceMapping(surfaceSpec('stairs'));return true;}
  if(name==='walk-stairs'){const st=selection?.kind==='stairs'?selected():null;if(!st)return true;const g=C.stairGeometry(project,st);freeCam=makeFreeCam({x:g.entry.x,y:g.entry.y,story:st.story||0,facing:C.heading(g.bottom,g.top)});activeStory=st.story||0;enterFreeCam();toast('Hold W to walk up. S walks back down.',5000);return true;}
  return false;
});
// ------------------------------------------------------------------ stairs inspector
function stairsForm(st){
  const g=C.stairGeometry(project,st),ns=st.dir==='N'||st.dir==='S',across=ns?st.width:st.length,run=ns?st.length:st.width,going=run/g.steps;
  return `<section class="section"><span class="eyebrow">Stairs · ${esc(storyName(st.story||0))} → ${esc(storyName((st.story||0)+1))}</span><label>Name<input type="text" data-stairs="name" value="${esc(st.name)}" maxlength="80"></label>
    <div class="info" style="margin-top:8px">${g.steps} steps · each ${fmt(g.rise,2)} ${unit()} high and ${fmt(going,2)} ${unit()} deep${going<.22?' · <b>steep</b>: make the run longer or use fewer steps':''}</div>
    <div class="form-grid"><label>Direction<select data-stairs="dir">${Object.entries(DIR_LABEL).map(([k,t])=>`<option value="${k}" ${st.dir===k?'selected':''}>${t}</option>`).join('')}</select></label><label>Steps<input type="number" data-stairs="steps" min="3" max="60" step="1" value="${g.steps}"></label>
      <label>Width across (${unit()})<input type="number" data-stairs="across" step="0.05" min="0.6" value="${fmt(across)}"></label><label>Run length (${unit()})<input type="number" data-stairs="run" step="0.05" min="1" value="${fmt(run)}"></label>
      <label>Corner X (${unit()})<input type="number" data-stairs="x" step="0.05" value="${fmt(st.x)}"></label><label>Corner Y (${unit()})<input type="number" data-stairs="y" step="0.05" value="${fmt(st.y)}"></label></div>
    <label class="check"><input type="checkbox" data-stairs="rails" ${st.rails!==false?'checked':''}>Guard rail round the opening upstairs</label><p class="subtle">Drag the stairs on the map to move them. The floor above is opened over them automatically, and the ceiling below them too.</p>
    <div class="button-row"><button data-action="walk-stairs" class="primary">Walk up in first person</button><button data-action="delete-selection" class="danger">Delete stairs</button></div></section>
    <section class="section"><h3>Step surface</h3>${surfaceTextureEditor(C.normalizeSurface(st.surface),'stairsSurface','import-stairs-texture','clear-stairs-texture','reset-stairs-texture','Stairs texture')}</section>`;
}
document.addEventListener('change',e=>{const el=e.target;if(!el.matches?.('[data-stairs]'))return;const st=selection?.kind==='stairs'?selected():null;if(!st)return;const k=el.dataset.stairs;
  let val=el.type==='checkbox'?el.checked:(el.type==='text'||el.tagName==='SELECT')?el.value:Number(el.value);if(el.type==='number'&&!Number.isFinite(val))return;
  mutate(()=>{const s=C.stairById(project,st.id),ns=s.dir==='N'||s.dir==='S',across=ns?s.width:s.length,run=ns?s.length:s.width;let ch={};
    if(k==='dir'){const nns=val==='N'||val==='S';ch={dir:val,width:nns?across:run,length:nns?run:across};}
    else if(k==='across'){const v=parseLength(val);if(v<.6)throw Error('Stairs need to be at least 0.6 m wide.');ch=ns?{width:v}:{length:v};}
    else if(k==='run'){const v=parseLength(val);if(v<1)throw Error('Make the run at least 1 m long.');ch=ns?{length:v}:{width:v};}
    else if(k==='x'||k==='y')ch={[k]:parseLength(val)};else if(k==='steps')ch={steps:C.clamp(Math.round(val),3,60)};else ch={[k]:val};
    C.editStairs(project,st.id,ch);},'Edit stairs');});
HOOKS.click.push((e,b)=>{if(b.dataset.selectStairs){selection={kind:'stairs',id:b.dataset.selectStairs};panel='selection';refresh();return true;}return false;});
EXT.stories={buildUpApply,buildUpTrial,showBuildUp,stairsFromDrag,makeFloorHole};
