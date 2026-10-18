/* ===================== 0.14 · ui-props.js — ASSET LIBRARY, 3D OBJECTS, LOOKS, USE POINTS =====================
   Library tab (browse + search the standardized library), placing and editing 3D objects, non-destructive looks,
   palettes, textures, collision footprints, open-ended gameplay tags and Use Points, export/import of looks.
   Plain-language UI on top; asset IDs, model space and data rules underneath. Data rule: fields this editor does not
   know are never removed; edits only touch the field being edited. */
const A=window.RCAssets;
const PZ={libMode:'objects',libCat:'All',libSub:'',libSearch:'',texCat:'',showHidden:false,limit:60,placing:null,placeRot:0,placeKeep:false,replacing:null,texTarget:null,
  ghost:null,ghostAsset:null,ghostPos:null,drag:null,gesture:null,selPoint:null,palEdit:null,conflictCache:{key:null,list:[]},lastMissingNote:'',libTimer:0};
const SUGGESTED_TAGS=[['interactable','Interactable'],['movable','Movable'],['cover','Cover'],['hide','Hiding spot'],['seat','Seat'],['container','Container / search'],['climb','Climbable'],['breakable','Breakable'],['spawn','Spawn / arrival'],['vehicle','Vehicle'],['commercial','Commercial'],['evidence','Evidence'],['pickup','Pickup']];
const SUGGESTED_POINTS=[['sit','Sit'],['use','Use (customer / player)'],['work','Work (staff / NPC)'],['customer','Customer'],['cover','Cover'],['hide','Hide'],['driver','Driver side'],['passenger','Passenger side'],['arrival','Arrival'],['look','Look at'],['stand','Stand'],['search','Search']];
const POINT_COLORS={sit:'#7fe0a0',use:'#ffd27a',work:'#56d6e0',customer:'#ffd27a',cover:'#ff9a4a',hide:'#b07cff',driver:'#6da8ff',passenger:'#6da8ff',arrival:'#e47cf0',look:'#ffffff',stand:'#cfd8dc',search:'#f0c36d'};
const QUICK_PALETTES=[['grimy','Grimy'],['faded','Faded'],['night','Night'],['warm','Warm']];
const lsGet=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d;}catch(e){return d;}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
const PROPS_LIB=()=>project.objectLibrary||null;
function ensureLib(){if(!project.objectLibrary)project.objectLibrary={schema:1,looks:[],palettes:[],setups:{}};return project.objectLibrary;}
function setupOf(assetId){return (project.objectLibrary?.setups||{})[assetId]||null;}
function propEntry(q){return A.entry(q.asset);}
function propName(q){return q.name||propEntry(q)?.name||q.asset||'3D object';}
function propBounds(q){const t=A.connected?A.template(q.asset):null;if(t?.status==='ready')return t.bounds;return C.propBoundsOf(q,dimsBounds(propEntry(q)));}
function dimsBounds(e){const d=e?.dims;return d?{min:[-d[0]/2,0,-d[2]/2],max:[d[0]/2,d[1],d[2]/2]}:null;}
const fmt2=v=>(Math.round(v*100)/100).toString();

// ------------------------------------------------------------------ library events
A.on((what,id)=>{
  if(what==='thumb'){document.querySelectorAll('img[data-thumb]').forEach(im=>{if(!im.getAttribute('src')){const u=A.state.thumbs.get(im.dataset.thumb);if(u){im.src=u;im.classList.remove('pending');}}});return;}
  if(what==='template'){GLE?.invalidateProps();drawSoon();clearTimeout(PZ.inspT);PZ.inspT=setTimeout(()=>{fillPropBounds();refreshPropInspector(id);},120);return;}
  clearTimeout(PZ.libTimer);PZ.libTimer=setTimeout(()=>{if(pane==='library')renderLeft();GLE?.invalidateProps();drawSoon();if(what==='connected'){fillPropBounds();if(selection?.kind==='prop')renderInspector();}},60);
});
// redraw the object panel when the selected object's model finishes loading — but never while you are typing in it
function refreshPropInspector(loadedId){if(selection?.kind!=='prop')return;const q=selected();if(!q||(loadedId&&loadedId!==q.asset))return;
  const ae=document.activeElement;if(ae&&ae.closest?.('#inspector')&&/^(INPUT|SELECT|TEXTAREA)$/.test(ae.tagName)){ae.addEventListener('blur',()=>setTimeout(()=>refreshPropInspector(null),0),{once:true});return;}renderInspector();}
// placed objects remember their real model size (so collision and placeholders work even without the library)
function fillPropBounds(){if(!A.connected||!project.props?.length)return;let n=0;for(const q of project.props){const t=A.template(q.asset);if(t.status==='ready'&&!C.validBounds(q.bounds)){q.bounds=C.clone(t.bounds);n++;}}if(n){RR?.clearCaches?.();GLE?.invalidateProps();}}
if(GLE)GLE.onNeedsDraw=()=>drawSoon();
setTimeout(()=>{A.reconnect({ask:false}).then(r=>{if(!r.ok)A.storedHandle().then(h=>{if(h&&pane==='library')renderLeft();});});},50);

// ------------------------------------------------------------------ Library tab
function libraryPane(){
  const S=A.state,c=S.report?.counts;let head;
  if(!A.connected){const stored=S.storedName;
    head=`<div class="section"><div class="row"><h2 class="grow">Asset library</h2><span class="badge">${S.connecting?'CHECKING…':'NOT CONNECTED'}</span></div>
      <p>Connect the Trapstar asset library folder to browse and place 3D objects, textures and palettes. Room Creator only reads it; the library itself is never changed.</p>
      ${stored?`<button class="primary block" data-pa="lib-reconnect">Reconnect “${esc(stored)}”</button><button class="block" style="margin-top:6px" data-pa="lib-connect">Choose a different folder…</button>`:`<button class="primary block" data-pa="lib-connect">Connect asset library…</button>`}
      <p class="subtle">Choose the folder called <b>Trapstar_RoomCreator_Asset_Library_v1</b>. ${A.pickerSupported()?'Chrome and Edge remember it, so next time it is one click.':'This browser cannot remember folders, so choose it again each session.'}</p>
      ${project.props?.length?`<div class="info">This project has ${project.props.length} placed 3D objects. They show as plain boxes until the library is connected. Nothing is lost.</div>`:''}</div>`;
    return head;}
  const probs=[...S.report.problems.filter(p=>p.level!=='info'),...S.report.missingFiles,...S.report.loadFailures],infos=S.report.problems.filter(p=>p.level==='info');
  head=`<div class="section lib-head"><div class="row"><h2 class="grow">Asset library</h2><button class="mini" data-pa="lib-disconnect" title="Disconnect">✕</button></div>
    <p class="lib-status">${c.models} objects · ${c.textures} textures · ${c.palettes} palettes<br><span class="${probs.length?'warn':'ok'}">${probs.length?`⚠ ${probs.length} problem${probs.length>1?'s':''} found`:'✓ Everything checks out'}</span>${S.fileCheck&&!S.fileCheck.done?` · checking files… ${S.fileCheck.count||0}`:''}</p>
    ${probs.length||infos.length?`<details class="details"><summary>Library check (${probs.length+infos.length})</summary><ul class="lib-problems">${[...probs,...infos].slice(0,60).map(p=>`<li class="${p.level==='info'?'':'warn'}">${esc(p.text)}</li>`).join('')}</ul></details>`:''}
    ${c.unverified?`<p class="subtle">⚠ ${c.unverified} vehicles come from packs with no licence text: marked “licence unverified”.</p>`:''}</div>`;
  let banner='';
  if(PZ.placing){const e=A.entry(PZ.placing);banner=`<div class="lib-banner"><b>Placing: ${esc(e?.name||PZ.placing)}</b><span>Click a floor on the map or in first person. [ ] turns it 15°. Hold Shift to keep placing. Esc stops.</span><button data-pa="lib-cancel">Stop placing</button></div>`;}
  else if(PZ.replacing){const q=(project.props||[]).find(x=>x.id===PZ.replacing);banner=`<div class="lib-banner"><b>Replace “${esc(q?propName(q):'object')}”</b><span>Click the object to put in its place. Position, turn, size, tags and use points are kept.</span><button data-pa="lib-cancel">Cancel</button></div>`;}
  else if(PZ.texTarget){banner=`<div class="lib-banner"><b>Texture for: ${esc(PZ.texTarget.label)}</b><span>Click a texture to use it. It is copied into this project.</span><button data-pa="lib-cancel">Cancel</button></div>`;}
  const modes=[['objects','Objects'],['textures','Textures'],['palettes','Palettes'],['looks','Looks']];
  const tabs=`<div class="lib-modes">${modes.map(([k,n])=>`<button class="${PZ.libMode===k?'active':''}" data-pa="lib-mode" data-v="${k}">${n}</button>`).join('')}</div>`;
  let body='';
  if(PZ.libMode==='objects')body=libObjects();else if(PZ.libMode==='textures')body=libTextures();else if(PZ.libMode==='palettes')body=libPalettes();else body=libLooks();
  return head+banner+`<div class="section lib-body">${tabs}${body}</div>`;
}
function libSearchBox(ph){return `<input id="libSearch" class="lib-search" placeholder="${esc(ph)}" value="${esc(PZ.libSearch)}" aria-label="${esc(ph)}">`;}
function libFilterModels(){
  const S=A.state,q=PZ.libSearch.trim().toLowerCase(),recent=lsGet('rc.lib.recent',[]),fav=lsGet('rc.lib.fav',[]);let list;
  if(PZ.libCat==='Recent')list=recent.map(id=>A.entry(id)).filter(Boolean);else if(PZ.libCat==='Favourites')list=fav.map(id=>A.entry(id)).filter(Boolean);
  else list=S.models.filter(e=>(PZ.showHidden||!e.hidden)&&(PZ.libCat==='All'||e.category===PZ.libCat)&&(!PZ.libSub||e.sub===PZ.libSub));
  if(q){const words=q.split(/\s+/).filter(Boolean);list=list.filter(e=>{const hay=(e.name+' '+e.category+' '+e.sub+' '+e.tags.join(' ')+' '+e.id).toLowerCase();return words.every(w=>hay.includes(w));});}return list;}
function libObjects(){
  const S=A.state,cats=['All','Recent','Favourites',...S.modelCategories.filter(c=>PZ.showHidden||c!=='Prototype Reference')];
  const subs=PZ.libCat!=='All'&&!['Recent','Favourites'].includes(PZ.libCat)?[...new Set(S.models.filter(e=>e.category===PZ.libCat).map(e=>e.sub).filter(Boolean))].sort():[];
  const list=libFilterModels(),fav=new Set(lsGet('rc.lib.fav',[]));
  return `${libSearchBox('Search objects… (chair, dumpster, CRT)')}<div class="chips">${cats.map(c=>`<button class="chip ${PZ.libCat===c?'active':''}" data-pa="lib-cat" data-v="${esc(c)}">${c==='Favourites'?'★ Favourites':esc(c)}</button>`).join('')}</div>
    ${subs.length?`<div class="chips sub"><button class="chip ${!PZ.libSub?'active':''}" data-pa="lib-sub" data-v="">All ${esc(PZ.libCat)}</button>${subs.map(s=>`<button class="chip ${PZ.libSub===s?'active':''}" data-pa="lib-sub" data-v="${esc(s)}">${esc(s)}</button>`).join('')}</div>`:''}
    <p class="subtle">${list.length} object${list.length===1?'':'s'}${PZ.libCat==='Recent'&&!list.length?' · nothing placed yet':''}. Click one to place it.</p>
    <div class="lib-grid">${list.slice(0,PZ.limit).map(e=>libCard(e,fav.has(e.id))).join('')}</div>
    ${list.length>PZ.limit?`<button class="block" data-pa="lib-more">Show more (${list.length-PZ.limit} left)</button>`:''}
    <label class="check"><input type="checkbox" data-pa-check="lib-hidden" ${PZ.showHidden?'checked':''}>Show reference samples (marked not for scenes)</label>`;}
function libCard(e,isFav){const u=A.thumb(e.id);
  return `<div class="lib-card ${PZ.placing===e.id?'selected':''}" data-lib-asset="${esc(e.id)}" title="${esc(e.name)} · ${esc(e.category)}${e.sub?' / '+esc(e.sub):''}${e.unverifiedLicense?' · licence unverified':''}">
    <img data-thumb="${esc(e.id)}" ${u?`src="${u}"`:'class="pending"'} alt=""><span>${esc(e.name)}</span>
    <button class="star ${isFav?'on':''}" data-pa="lib-fav" data-v="${esc(e.id)}" title="${isFav?'Remove from':'Add to'} favourites">★</button>${e.unverifiedLicense?'<i class="lic" title="Licence unverified: no licence text came with this pack">⚠</i>':''}</div>`;}
function libTextures(){
  const S=A.state,q=PZ.libSearch.trim().toLowerCase(),cat=PZ.texCat||'';
  let list=S.textures.filter(e=>!cat||(e.sub||e.category)===cat);if(q){const words=q.split(/\s+/).filter(Boolean);list=list.filter(e=>{const hay=(e.name+' '+e.sub+' '+e.tags.join(' ')+' '+e.id).toLowerCase();return words.every(w=>hay.includes(w));});}
  const target=PZ.texTarget?'':(selection?.kind==='prop'?'Click a texture to put it on the selected object (painted models only).':'Select a wall, floor or pillar, then click a texture. Or use “Library textures…” in its Style panel.');
  return `${libSearchBox('Search textures… (brick, tile, rust)')}<label>Category<select id="libTexCat"><option value="">All categories</option>${S.textureCategories.map(c=>`<option ${c===cat?'selected':''}>${esc(c)}</option>`).join('')}</select></label>
    <p class="subtle">${list.length} textures. Pixel-art textures stay crisp unless you choose Smooth.${target?' '+target:''}</p>
    <div class="lib-grid tex">${list.slice(0,PZ.limit).map(e=>{const u=A.thumb(e.id);return `<div class="lib-card" data-lib-texture="${esc(e.id)}" title="${esc(e.name)}"><img data-thumb="${esc(e.id)}" ${u?`src="${u}"`:'class="pending"'} alt=""><span>${esc(e.name)}</span></div>`;}).join('')}</div>
    ${list.length>PZ.limit?`<button class="block" data-pa="lib-more">Show more (${list.length-PZ.limit} left)</button>`:''}`;}
function libPalettes(){
  const S=A.state,ol=PROPS_LIB(),vars=ol?.palettes||[],sel=selection?.kind==='prop'?selected():null,fam=sel?propEntry(sel)?.paletteFamily:null;
  const card=(id,name,sub,img,uses)=>`<div class="pal-card ${fam&&(id===fam||vars.find(v=>v.id===id)?.base===fam)?'compatible':''}"><div class="pal-img" data-pal-preview="${esc(id)}">${img?`<img src="${img}" alt="">`:''}</div><div><strong>${esc(name)}</strong><small>${esc(sub)}${uses!=null?` · used by ${uses}`:''}</small>
    <div class="button-row">${sel&&fam&&(id===fam||vars.find(v=>v.id===id)?.base===fam)?`<button data-pa="pal-apply" data-v="${esc(id)}">Use on selected</button>`:''}${vars.find(v=>v.id===id)?`<button data-pa="pal-edit" data-v="${esc(id)}">Edit colours…</button>`:`<button data-pa="pal-copy" data-v="${esc(id)}">Make an editable copy</button>`}</div></div></div>`;
  const uses=id=>(project.props||[]).filter(q=>C.propAppearance(project,q).palette===id).length+(ol?.looks||[]).filter(l=>l.palette===id).length;
  return `<p class="subtle">Palette-coloured objects take every colour from one small colour grid. Swapping the grid recolours them all at once. Edited palettes are saved in this project; the library palettes never change.</p>
    <h3>Library palettes</h3>${S.palettes.map(p=>{const u=A.thumb(p.id);return card(p.id,p.name,`${p.dimensions_px?.join('×')||''} · ${S.models.filter(e=>e.paletteFamily===p.id).length} objects`,u,null);}).join('')}
    <h3>Your palettes (this project)</h3>${vars.map(v=>card(v.id,v.name,'from '+(A.entry(v.base)?.name||v.base||'?'),v.image,uses(v.id))).join('')||'<p class="subtle">None yet. Use “Make an editable copy”, or change a colour on a selected object.</p>'}`;}
function libLooks(){
  const ol=PROPS_LIB(),looks=ol?.looks||[],pals=ol?.palettes||[],setups=Object.entries(ol?.setups||{}),uses=id=>(project.props||[]).filter(q=>q.look===id).length;
  return `<p class="subtle">Looks are named appearances you can reuse on many objects. Palettes and object setups (front direction, default use points, tags) live here too. They are saved inside this project, and you can export them to use in other projects. The asset library itself is never edited.</p>
    <div class="button-row"><button class="primary" data-pa="looks-export" ${looks.length||pals.length||setups.length?'':'disabled'}>Export…</button><button data-pa="looks-import">Import…</button></div>
    <h3>Looks · ${looks.length}</h3>${looks.map(l=>`<div class="list-card static"><span><strong>${esc(l.name)}</strong><small>${esc(A.entry(l.asset)?.name||l.asset||(l.family?'any object on '+(A.entry(l.family)?.name||l.family):'any object'))} · used by ${uses(l.id)}</small></span><span class="row-actions"><button class="mini" data-pa="look-rename" data-v="${esc(l.id)}" title="Rename">✎</button><button class="mini" data-pa="look-delete" data-v="${esc(l.id)}" title="Delete">✕</button></span></div>`).join('')||'<p class="subtle">None yet. Select an object, change its appearance, then “Save as look…”.</p>'}
    <h3>Palettes · ${pals.length}</h3>${pals.map(v=>`<div class="list-card static"><span><strong>${esc(v.name)}</strong><small>from ${esc(A.entry(v.base)?.name||v.base||'?')}</small></span><span class="row-actions"><button class="mini" data-pa="pal-rename" data-v="${esc(v.id)}">✎</button><button class="mini" data-pa="pal-delete" data-v="${esc(v.id)}">✕</button></span></div>`).join('')||'<p class="subtle">None yet.</p>'}
    <h3>Object setups · ${setups.length}</h3>${setups.map(([id,s])=>`<div class="list-card static"><span><strong>${esc(A.entry(id)?.name||id)}</strong><small>${[C.propFrontTurn(s)?FRONT_NAMES[C.propFrontTurn(s)]:'',s.points?.length?s.points.length+' default points':'',s.tags?.length?s.tags.length+' default tags':'',s.collision?'collision default':''].filter(Boolean).join(' · ')||'setup'}</small></span><span class="row-actions"><button class="mini" data-pa="setup-delete" data-v="${esc(id)}">✕</button></span></div>`).join('')||'<p class="subtle">None yet. In an object’s Info section you can fix which end is the front or save its use points as defaults.</p>'}`;}

// library tab interactions
document.addEventListener('input',e=>{const t=e.target;if(t.id==='libSearch'){PZ.libSearch=t.value;PZ.limit=60;const pos=t.selectionStart;renderLeft();const n=$('libSearch');if(n){n.focus();n.setSelectionRange(pos,pos);}}});
document.addEventListener('change',e=>{const t=e.target;if(t.id==='libTexCat'){PZ.texCat=t.value;PZ.limit=60;renderLeft();}else if(t.dataset?.paCheck==='lib-hidden'){PZ.showHidden=t.checked;renderLeft();}
  else if(t.id==='libraryFolder'){const files=t.files;A.connectFiles(files).then(r=>{toast(r.message,7000);t.value='';});}
  else if(t.id==='looksFile'){const f=t.files?.[0];t.value='';if(f)importLooksFile(f);}});
document.addEventListener('click',e=>{const pr=e.target.closest('.pt-row');if(pr&&!e.target.closest('button')){const v=pr.dataset.v;PZ.selPoint=PZ.selPoint===v?null:v;renderInspector();drawSoon();return;}
  const card=e.target.closest('[data-lib-asset]');if(card&&!e.target.closest('.star')){libAssetClick(card.dataset.libAsset);return;}
  const tc=e.target.closest('[data-lib-texture]');if(tc){libTextureClick(tc.dataset.libTexture);}});
function remember(id){const r=lsGet('rc.lib.recent',[]).filter(x=>x!==id);r.unshift(id);lsSet('rc.lib.recent',r.slice(0,30));}
function libAssetClick(id){const e=A.entry(id);if(!e)return;
  if(PZ.replacing){replaceProp(PZ.replacing,id);return;}
  if(e.missing){toast('That object’s file is missing from the library folder.',5000);return;}
  startPlacing(id);}

// ------------------------------------------------------------------ placing
function startPlacing(id){if(mode!=='build'){toast('Return to editing to place objects.');return;}PZ.placing=id;PZ.replacing=null;PZ.texTarget=null;PZ.placeRot=PZ.placeRot||0;tool='prop';pending=null;A.template(id);
  if(active==='fp'&&(typeof RW!=='undefined'&&RW.on))return;renderLeft();updateTop();$('statusText').textContent='Placing '+(A.entry(id)?.name||id)+' · click a floor · [ ] turn · Esc stop';drawSoon();}
function stopPlacing(){PZ.placing=null;removeGhost();if(tool==='prop')tool='select';renderLeft();updateTop();drawSoon();}
function removeGhost(){if(PZ.ghost&&GLE){GLE.props.remove(PZ.ghost);PZ.ghost.userData.mats?.forEach(m=>m.dispose());}PZ.ghost=null;PZ.ghostAsset=null;}
function updateGhost(pt){
  PZ.ghostPos=pt;if(!GLE||!pt||!PZ.placing){removeGhost();return;}const t=A.template(PZ.placing);
  if(t.status==='ready'&&PZ.ghostAsset!==PZ.placing){removeGhost();const g=t.scene.clone(true),mat=new THREE.MeshBasicMaterial({map:t.baseTexture,transparent:true,opacity:.6,depthWrite:false});g.traverse(o=>{if(o.isMesh)o.material=mat;});g.userData.mats=[mat];PZ.ghost=g;PZ.ghostAsset=PZ.placing;GLE.props.add(g);}
  if(PZ.ghost){const q={x:pt.x,y:pt.y,story:pt.story,rotation:PZ.placeRot},s=setupOf(PZ.placing);PZ.ghost.position.set(pt.x,C.propFloorZ(project,q),pt.y);PZ.ghost.rotation.set(0,C.propYaw(q,s),0);}
  drawSoon();}
function defaultSolid(e,b){const w=b.max[0]-b.min[0],d=b.max[2]-b.min[2],h=b.max[1]-b.min[1];return e?.category==='Vehicles'||(w*d>=.2&&h>=.45);}
function makeProp(id,pt){
  const e=A.entry(id),t=A.template(id),b=t.status==='ready'?C.clone(t.bounds):dimsBounds(e)||{min:[-.25,0,-.25],max:[.25,.5,.25]},s=setupOf(id);
  const q={id:C.uid('prop'),asset:id,name:'',x:+pt.x.toFixed(3),y:+pt.y.toFixed(3),story:pt.story??activeStory,z:0,rotation:PZ.placeRot||0,scale:[1,1,1],enabled:true,locked:false,look:null,override:{},
    collision:s?.collision?C.clone(s.collision):{solid:defaultSolid(e,b),shape:'auto'},gameplay:{tags:s?.tags?C.clone(s.tags):[],props:{}},points:(s?.points||[]).map(p=>({...C.clone(p),id:C.uid('pt')})),bounds:b};
  return q;}
function placeAt(pt){
  const id=PZ.placing;if(!id||!pt)return;
  if(!C.inFloor(project,pt,0,pt.story??activeStory)&&!C.roomAtStory(project,pt,pt.story??activeStory)){toast('Place objects on a floor of this story.');return;}
  let q;if(mutate(()=>{q=makeProp(id,pt);if(!project.props)project.props=[];project.props.push(q);selection={kind:'prop',id:q.id};panel='selection';},'Place '+(A.entry(id)?.name||'object'))){remember(id);
    if(!PZ.placeKeep){PZ.placing=null;removeGhost();tool='select';}refresh();}}

// ------------------------------------------------------------------ map hit testing and first-person floor points
function hull(pts){pts=[...pts].sort((a,b)=>a.x-b.x||a.y-b.y);const cr=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x),lo=[],up=[];for(const p of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}for(const p of [...pts].reverse()){while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p);}return lo.slice(0,-1).concat(up.slice(0,-1));}
function propScreenHull(q){const b=propBounds(q),s=setupOf(q.asset),fz=C.propFloorZ(project,q),pts=[];for(const x of [b.min[0],b.max[0]])for(const y of [b.min[1],b.max[1]])for(const z of [b.min[2],b.max[2]]){const w=C.propToPlan(q,{x,y,z},s,fz);pts.push(C.isoPoint(project,{x:w.x,y:w.y},w.z));}return hull(pts);}
function hitProp(q){const list=(project.props||[]).filter(p=>(p.story||0)===activeStory);let best=null,bd=-Infinity;
  for(const p of list){const h=propScreenHull(p);if(h.length<3||!C.pointInPoly(q,h))continue;const d=p.x+p.y+C.propFloorZ(project,p)*.01+(p.z||0)*.5;if(d>bd){bd=d;best=p;}}return best;}
function propFloorAt(v,q,story){const W=v.width,H=v.height,f=W/(2*Math.tan(C.rad(v.fov)/2)),hy=H*C.clamp(v.horizon??.42,.1,.9),dy=q.y-hy,z=C.storyElevation(project,story),eye=(v.floorZ??C.storyElevation(project,v.story||0))+v.eyeHeight;
  if(dy<=1||eye<=z)return null;const depth=(eye-z)*f/dy;if(depth>200)return null;const side=(q.x-W/2)*depth/f,b=C.basis(v.facing);return {x:v.x+b.fx*depth+b.rx*side,y:v.y+b.fy*depth+b.ry*side,story};}
function iconUnder(q){const k=mk();if(project.viewpoints.some(v=>itemStory(v)===activeStory&&Math.hypot(q.x-nodePoint(v).x,q.y-nodePoint(v).y)<19*k))return true;
  if(project.openings.some(o=>itemStory(o)===activeStory&&openingIconVisible(o)&&Math.hypot(q.x-openingPoint(o).x,q.y-openingPoint(o).y)<18*k))return true;return false;}
// which side of the model is its real front: 0 = +Z as built, 90 = its left (+X), 180 = the -Z end, 270 = its right (-X)
const FRONT_NAMES={0:'front as built',90:'front is its left side',180:'front is the other end',270:'front is its right side'};
function frontTurn(q){return C.propFrontTurn(setupOf(q.asset));}
// the model's box measured in the object's own terms (right / forward), so handles and default points sit on the real front
function userExtents(q){const b=propBounds(q),th=frontTurn(q);let f0=Infinity,f1=-Infinity,r1=0;for(const x of [b.min[0],b.max[0]])for(const z of [b.min[2],b.max[2]]){const u=pointToUser(q,{x,y:0,z,yaw:0},th);f0=Math.min(f0,u.forward);f1=Math.max(f1,u.forward);r1=Math.max(r1,Math.abs(u.right));}return {front:f1,back:-f0,half:r1};}
function rotHandle(q){const s=setupOf(q.asset),fz=C.propFloorZ(project,q),ex=userExtents(q),m=pointFromUser(frontTurn(q),{right:0,forward:Math.max(ex.front,.3)+.55,up:0,facing:0}),pt=C.propToPlan(q,{x:m.x,y:0,z:m.z},s,fz);return {plan:pt,screen:C.isoPoint(project,pt,pt.z)};}
// use points are stored in the model's own axes; the panel shows them relative to the object's front
function pointToUser(q,p,turn){const t=turn??frontTurn(q),r=C.rad(t),c=Math.cos(r),sn=Math.sin(r),x=p.x||0,z=p.z||0;return {right:+(-x*c+z*sn).toFixed(6),forward:+(x*sn+z*c).toFixed(6),up:p.y||0,facing:C.norm(t-(p.yaw||0))};}
function pointFromUser(t,u){const r=C.rad(t),c=Math.cos(r),sn=Math.sin(r);return {x:+(-u.right*c+u.forward*sn).toFixed(6),z:+(u.right*sn+u.forward*c).toFixed(6),y:u.up,yaw:C.norm(t-u.facing)};}
function pointScreen(q,p){const s=setupOf(q.asset),w=C.propToPlan(q,p,s,C.propFloorZ(project,q));return {plan:w,screen:C.isoPoint(project,w,w.z)};}

HOOKS.pointerDown.push((e,q)=>{
  if(mode!=='build'||(typeof RW!=='undefined'&&RW.on))return false;
  if(active==='iso'){
    const floor=C.isoInverse(project,q,C.storyElevation(project,activeStory));
    if(PZ.placing){PZ.placeKeep=e.shiftKey;placeAt({x:floor.x,y:floor.y,story:activeStory});return true;}
    if(tool!=='select')return false;
    const sel=selection?.kind==='prop'?selected():null;
    if(sel&&!sel.locked){
      const rh=rotHandle(sel);if(Math.hypot(q.x-rh.screen.x,q.y-rh.screen.y)<12*mk()){PZ.drag={kind:'rotate',id:sel.id,before:capture(),moved:false};return true;}
      for(const p of sel.points){const ps=pointScreen(sel,p);if(Math.hypot(q.x-ps.screen.x,q.y-ps.screen.y)<9*mk()){PZ.selPoint=p.id;PZ.drag={kind:'point',id:sel.id,pid:p.id,before:capture(),moved:false,startClient:{x:e.clientX,y:e.clientY},height:ps.plan.z,start:C.isoInverse(project,q,ps.plan.z),orig:C.clone(p)};renderInspector();return true;}}}
    if(iconUnder(q))return false;
    const hit=hitProp(q);if(!hit)return false;
    selection={kind:'prop',id:hit.id};panel='selection';PZ.selPoint=null;
    if(!hit.locked)PZ.drag={kind:'move',id:hit.id,before:capture(),start:floor,orig:{x:hit.x,y:hit.y},moved:false,startClient:{x:e.clientX,y:e.clientY}};refresh();return true;}
  if(active==='fp'){
    const v=fpFrame();if(!v)return false;
    if(PZ.placing){PZ.placeKeep=e.shiftKey;placeAt(propFloorAt(v,q,v.story||0));return true;}
    if(tool!=='select'||!GLE)return false;
    const meta=GLE.pick(project,fpCamera(),q.x/v.width,q.y/v.height);if(meta?.kind!=='prop')return false;
    const hit=(project.props||[]).find(p=>p.id===meta.id);if(!hit)return false;selection={kind:'prop',id:hit.id};panel='selection';PZ.selPoint=null;
    if(!hit.locked){const fl=propFloorAt(v,q,hit.story||0);PZ.drag={kind:'move-fp',id:hit.id,before:capture(),start:fl,orig:{x:hit.x,y:hit.y},moved:false,startClient:{x:e.clientX,y:e.clientY}};}
    refresh();return true;}
  return false;});
HOOKS.pointerMove.push(e=>{
  const q=eventPoint(e);
  if(PZ.placing&&!PZ.drag){let pt=null;if(active==='iso'){const f=C.isoInverse(project,q,C.storyElevation(project,activeStory));pt={x:f.x,y:f.y,story:activeStory};}else{const v=fpFrame();if(v)pt=propFloorAt(v,q,v.story||0);}updateGhost(pt);canvas.style.cursor='copy';return true;}
  const d=PZ.drag;if(!d)return false;const o=(project.props||[]).find(p=>p.id===d.id);if(!o){PZ.drag=null;return false;}
  if(!d.moved&&d.startClient&&Math.hypot(e.clientX-d.startClient.x,e.clientY-d.startClient.y)<3)return true;d.moved=true;
  if(d.kind==='move'||d.kind==='move-fp'){let f;if(d.kind==='move')f=C.isoInverse(project,q,C.storyElevation(project,o.story||0));else{const v=fpFrame();f=v&&propFloorAt(v,q,o.story||0);}
    if(!f||!d.start){if(d.kind==='move-fp'&&f)d.start=f;return true;}let nx=d.orig.x+f.x-d.start.x,ny=d.orig.y+f.y-d.start.y;if(snap&&!e.altKey){nx=Math.round(nx/.05)*.05;ny=Math.round(ny/.05)*.05;}o.x=+nx.toFixed(3);o.y=+ny.toFixed(3);}
  else if(d.kind==='rotate'){const f=C.isoInverse(project,q,C.storyElevation(project,o.story||0)),s=setupOf(o.asset);let h=C.heading(o,f);if(!e.shiftKey)h=Math.round(h/15)*15;o.rotation=C.norm(h);}
  else if(d.kind==='point'){const f=C.isoInverse(project,q,d.height),pt=o.points.find(p=>p.id===d.pid);if(pt){const origin=C.propToPlan(o,d.orig,setupOf(o.asset)),l=C.planToProp(o,{x:origin.x+f.x-d.start.x,y:origin.y+f.y-d.start.y},setupOf(o.asset));pt.x=+l.x.toFixed(3);pt.z=+l.z.toFixed(3);}}
  GLE?.invalidateProps();drawSoon();return true;});
HOOKS.pointerUp.push(e=>{const d=PZ.drag;if(!d)return false;PZ.drag=null;
  if(d.moved){try{const o=(project.props||[]).find(p=>p.id===d.id);if(o){const r=C.roomAtStory(project,o,o.story||0);o.roomId=r?r.id:null;}project=C.validateBundle({project,assets:[...catalog.values()]}).project;pushHistory(d.before,d.kind==='rotate'?'Turn object':d.kind==='point'?'Move use point':'Move object');RR?.clearCaches?.();}catch(err){restore(d.before);toast(err.message,6000);}}
  refresh();return true;});

// ------------------------------------------------------------------ keyboard: turn, nudge, place, escape
HOOKS.keyDown.push(e=>{
  if(mode!=='build'||/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName))return false;
  if(e.key==='Escape'&&(PZ.placing||PZ.replacing||PZ.texTarget)){PZ.replacing=null;PZ.texTarget=null;stopPlacing();return true;}
  if(PZ.placing&&(e.key==='['||e.key===']')){PZ.placeRot=C.norm((PZ.placeRot||0)+(e.key===']'?1:-1)*(e.shiftKey?5:15));if(PZ.ghostPos)updateGhost(PZ.ghostPos);return true;}
  const o=selection?.kind==='prop'?selected():null;if(!o)return false;
  if(e.key==='['||e.key===']'){if(o.locked){toast('Unlock the object first.');return true;}mutate(()=>{o.rotation=C.norm((o.rotation||0)+(e.key===']'?1:-1)*(e.shiftKey?5:15));},'Turn object');return true;}
  if(active==='iso'&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();if(o.locked){toast('Unlock the object first.');return true;}const st=e.shiftKey?.01:.1;mutate(()=>{o.x+=e.key==='ArrowLeft'?-st:e.key==='ArrowRight'?st:0;o.y+=e.key==='ArrowUp'?-st:e.key==='ArrowDown'?st:0;},'Nudge object');return true;}
  return false;});

// ------------------------------------------------------------------ duplicate, replace
function duplicateProp(){const o=selected();if(selection?.kind!=='prop'||!o)return;
  mutate(()=>{const c=C.clone(o);c.id=C.uid('prop');c.x+=.4;c.y+=.4;c.locked=false;c.points=c.points.map(p=>({...p,id:C.uid('pt')}));if(c.name)c.name+=' copy';project.props.push(c);selection={kind:'prop',id:c.id};},'Duplicate object');}
function replaceProp(id,assetId){const q=(project.props||[]).find(p=>p.id===id),e=A.entry(assetId);if(!q||!e)return;const old=propEntry(q),t=A.template(assetId);
  const warnings=[];
  if(mutate(()=>{const lk=q.look?C.lookById(project,q.look):null;
      if(lk&&lk.asset&&lk.asset!==assetId){q.look=null;warnings.push('its look belonged to the old object and was removed');}
      if(q.override?.palette&&e.paletteFamily!==old?.paletteFamily){delete q.override.palette;warnings.push('its palette did not fit the new object');}
      if(q.override?.texture&&e.material_system!=='uv_texture'){delete q.override.texture;warnings.push('its texture did not fit the new object');}
      q.asset=assetId;q.bounds=t.status==='ready'?C.clone(t.bounds):dimsBounds(e)||q.bounds;if(q.collision?.shape==='auto')q.collision.solid=q.collision.solid!==false;
      if(q.points.length)warnings.push('its use points were kept, so check they still fit');},'Replace object')){
    remember(assetId);PZ.replacing=null;toast('Replaced with '+e.name+(warnings.length?'. Note: '+warnings.join('; ')+'.':'.'),7000);refresh();}}

// ------------------------------------------------------------------ appearance helpers: palettes
async function paletteCanvas(id){
  const pv=C.paletteVariantById(project,id);let img;
  if(pv?.image){img=await new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>rej(Error('cannot decode palette'));im.src=pv.image;});}
  else{const e=A.entry(id);if(!e)throw Error('That palette is not in the connected library.');img=await A.imageOf(e.working_path);}
  const c=document.createElement('canvas');c.width=img.width;c.height=img.height;c.getContext('2d').drawImage(img,0,0);return c;}
function familyOf(id){const pv=C.paletteVariantById(project,id);return pv?pv.base:id;}
const hex2rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const rgb2hex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
function transformPalette(c,kind){const g=c.getContext('2d'),im=g.getImageData(0,0,c.width,c.height),d=im.data;
  for(let i=0;i<d.length;i+=4){let [r,gg,b]=[d[i],d[i+1],d[i+2]];const y=.299*r+.587*gg+.114*b;
    if(kind==='grimy'){r=y+(r-y)*.6;gg=y+(gg-y)*.6;b=y+(b-y)*.6;r=r*.8*.85+90*.15;gg=gg*.8*.85+74*.15;b=b*.8*.85+48*.15;}
    else if(kind==='faded'){r=y+(r-y)*.5;gg=y+(gg-y)*.5;b=y+(b-y)*.5;r=(r-128)*.8+128+14;gg=(gg-128)*.8+128+14;b=(b-128)*.8+128+14;}
    else if(kind==='night'){r=(y+(r-y)*.7)*.55;gg=(y+(gg-y)*.7)*.62;b=(y+(b-y)*.7)*.9+8;}
    else if(kind==='warm'){r=r*1.05*.88+255*.12;gg=gg*1.02*.88+170*.12;b=b*.95*.88+80*.12;}
    d[i]=Math.max(0,Math.min(255,r));d[i+1]=Math.max(0,Math.min(255,gg));d[i+2]=Math.max(0,Math.min(255,b));}
  g.putImageData(im,0,0);return c;}
function recolorCanvas(c,fromHex,toHex){const g=c.getContext('2d'),im=g.getImageData(0,0,c.width,c.height),d=im.data,[fr,fg,fb]=hex2rgb(fromHex),[tr,tg,tb]=hex2rgb(toHex);let n=0;
  for(let i=0;i<d.length;i+=4)if(d[i]===fr&&d[i+1]===fg&&d[i+2]===fb){d[i]=tr;d[i+1]=tg;d[i+2]=tb;n++;}g.putImageData(im,0,0);return n;}
async function quickPalette(family,kind,label){
  const ol=PROPS_LIB(),existing=(ol?.palettes||[]).find(v=>v.base===family&&v.quick===kind);if(existing)return existing.id;
  const c=transformPalette(await paletteCanvas(family),kind),id=C.uid('palv'),fam=A.entry(family);
  mutate(()=>{ensureLib().palettes.push({id,name:label+' · '+(fam?.name||family),base:family,quick:kind,image:c.toDataURL('image/png')});},'Make '+label+' palette',{refreshNow:false});return id;}
// change one colour on one object: its own palette copy, so no other object changes
async function recolorOnProp(q,fromHex,toHex){
  const app=C.propAppearance(project,q),e=propEntry(q),fam=e?.paletteFamily;if(!fam)return;
  const cur=app.palette||fam,pv=C.paletteVariantById(project,cur),own=pv&&pv.owner===q.id;
  // colours are matched in the currently shown palette: find what the base colour became there
  const baseC=await paletteCanvas(fam),curC=await paletteCanvas(cur),bd=baseC.getContext('2d').getImageData(0,0,baseC.width,baseC.height).data,cd=curC.getContext('2d').getImageData(0,0,curC.width,curC.height).data,[fr,fg,fb]=hex2rgb(fromHex);
  let shown=fromHex;for(let i=0;i<bd.length;i+=4)if(bd[i]===fr&&bd[i+1]===fg&&bd[i+2]===fb){shown=rgb2hex(cd[i],cd[i+1],cd[i+2]);break;}
  const c=curC;recolorCanvas(c,shown,toHex);const image=c.toDataURL('image/png');
  mutate(()=>{if(own){pv.image=image;}else{const id=C.uid('palv');ensureLib().palettes.push({id,name:propName(q)+' · own colours',base:fam,owner:q.id,image});q.override.palette=id;}},'Change object colour');}

// ------------------------------------------------------------------ inspector
// sections remember whether you opened or closed them, so editing a value does not fold them back up
const SEC_OPEN={};
function sec(name,dflt,force=false){return `data-sec="${name}" ${force||(SEC_OPEN[name]??dflt)?'open':''}`;}
document.addEventListener('toggle',e=>{const d=e.target;if(d?.dataset?.sec&&d.closest?.('#inspector'))SEC_OPEN[d.dataset.sec]=d.open;},true);
const LOOK_DEF={tint:'#ffffff',tintStrength:0,brightness:1,contrast:1,saturation:1,hue:0};
function srcTag(app,k){const f=app.from?.[k];return f==='object'?'<i class="src obj" title="Changed on this object only">this object</i>':f==='look'?'<i class="src look" title="Comes from the shared look">look</i>':'';}
function pnum(label,path,value,step=.05,extra=''){return `<label>${esc(label)}<input type="number" data-pf="${path}" value="${esc(fmt2(value))}" step="${step}" ${extra}></label>`;}
function prange(label,path,value,min,max,step,tag=''){return `<div class="range-field"><label>${esc(label)} ${tag}</label><div class="range-controls"><input type="range" data-pf="${path}" min="${min}" max="${max}" step="${step}" value="${value}"><input type="number" data-pf="${path}" min="${min}" max="${max}" step="${step}" value="${fmt2(value)}"></div></div>`;}
function pcheck(label,path,on,extra=''){return `<label class="check"><input type="checkbox" data-pf="${path}" ${on?'checked':''} ${extra}>${esc(label)}</label>`;}
function propForm(q){
  const e=propEntry(q),t=A.connected?A.template(q.asset):{status:'offline'},b=propBounds(q),sc=C.propScale(q),uni=sc[0]===sc[1]&&sc[1]===sc[2],app=C.propAppearance(project,q),setup=setupOf(q.asset);
  const thumb=e?A.thumb(e.id):null,cat=e?`${e.category}${e.sub?' / '+e.sub:''}`:'';
  let status='';
  if(!A.connected)status=`<div class="info warn">The asset library is not connected, so this shows as a plain box. Its data is safe. <button class="mini" data-pa="go-library">Connect…</button></div>`;
  else if(t.status==='missing')status=`<div class="info warn">The model “${esc(q.asset)}” is not in the connected library. The reference is kept so it can be repaired. <button class="mini" data-pa="prop-replace">Replace…</button></div>`;
  else if(t.status==='error')status=`<div class="info warn">Model ${esc(q.asset)} could not be loaded after ${t.attempts||1} attempts: ${esc(t.error)}. <button data-pa="model-retry">Retry model</button></div>`;
  else if(t.status==='loading')status=`<div class="info">Loading model ${esc(q.asset)} · attempt ${t.attempts||1} of 3…</div>`;
  if(t.warning)status+=`<div class="info">${esc(t.warning)}</div>`;
  const conflicts=propConflicts().filter(c=>c.prop===q.id);
  const head=`<section class="section prop-head"><div class="prop-title">${e?`<img data-thumb="${esc(e.id)}" ${thumb?`src="${thumb}"`:'class="pending"'} alt="">`:'<div class="ph"></div>'}<div><span class="eyebrow">3D object${q.enabled===false?' · SWITCHED OFF':''}${q.locked?' · LOCKED':''}</span><h2>${esc(propName(q))}</h2><small>${esc(e?.name&&q.name?e.name+' · ':'')}${esc(cat)}</small></div></div>
    ${status}<label>Name (optional)<input type="text" data-pf="name" value="${esc(q.name||'')}" placeholder="${esc(e?.name||'')}"></label>
    <div class="button-row"><button data-pa="prop-duplicate" title="Ctrl+D">Duplicate</button><button data-pa="prop-replace">Replace…</button><button data-pa="prop-delete" class="danger">Delete</button></div>
    <div class="button-row">${pcheck('Switched on','enabled',q.enabled!==false)}${pcheck('Locked','locked',q.locked)}</div></section>`;
  const place=`<details class="section details" ${sec('place',true)}><summary>Placement</summary><div class="form-grid">${pnum('X (m)','x',q.x)}${pnum('Y (m)','y',q.y)}${pnum('Height above floor (m)','z',q.z||0)}${pnum('Turn (°)','rotation',q.rotation||0,5)}</div>
    <div class="button-row"><button data-pa="prop-turn" data-v="-15" title="Turn left 15° ( [ )">⟲ 15°</button><button data-pa="prop-turn" data-v="15" title="Turn right 15° ( ] )">⟳ 15°</button><button data-pa="prop-turn" data-v="90">⟳ 90°</button></div><div class="button-row"><button data-pa="prop-reset">Reset turn, size and height</button></div>
    ${uni?prange('Size','scaleU',sc[0],.25,3,.05):''}<details class="details" ${sec('stretch',false)}><summary>Stretch per axis</summary><div class="form-grid">${pnum('Across','scale.0',sc[0])}${pnum('Up','scale.1',sc[1])}${pnum('Along','scale.2',sc[2])}</div></details>
    <p class="subtle">Story: ${esc(storyName(q.story||0))}${q.roomId?' · '+esc(C.roomById(project,q.roomId)?.name||''):' · outside any room'} · size ${fmt2((b.max[0]-b.min[0])*sc[0])} × ${fmt2((b.max[2]-b.min[2])*sc[2])} × ${fmt2((b.max[1]-b.min[1])*sc[1])} m. Drag it on the map; drag the round handle to turn. Keys: [ ] turn, arrows nudge.</p></details>`;
  return head+place+appearanceSection(q,e,t,app)+collisionSection(q,b,conflicts)+gameplaySection(q,e)+pointsSection(q,e,b)+infoSection(q,e,t,setup);
}
function appearanceSection(q,e,t,app){
  const issues=C.propAppearanceIssues(project,q,e,id=>A.entry(id),id=>catalog.has(id),t),warning=issues.map(i=>`<div class="info warn" role="status"><b>${esc(i.reason)}: ${esc(i.id)}</b><p>The reference is kept. Choose a replacement below or reset this field.</p><button data-pa="appearance-reset" data-v="${i.field}">Use model default ${i.field}</button>${i.field==='texture'?'<button data-pa="tex-choose">Choose replacement texture…</button>':''}</div>`).join('');
  if(!e)return `<details class="section details" ${sec('appearance',true)}><summary>Appearance</summary>${warning}<p class="subtle">Connect the library to change how this object looks. Its saved look is kept.</p></details>`;
  const ol=PROPS_LIB(),looks=(ol?.looks||[]).filter(l=>l.asset===q.asset||(!l.asset&&(!l.family||l.family===e.paletteFamily))),lk=app.look,pal=e.material_system==='palette'&&e.paletteFamily&&!t.paletteMismatch;
  const anyOwn=C.LOOK_FIELDS.some(k=>q.override?.[k]!==undefined);
  let html=`<details class="section details" ${sec('appearance',true)}><summary>Appearance</summary>${warning}
    <label>Look<select data-pf="look"><option value="">Asset default</option>${looks.map(l=>`<option value="${esc(l.id)}" ${q.look===l.id?'selected':''}>${esc(l.name)}</option>`).join('')}${app.lookMissing?`<option value="${esc(q.look)}" selected>(missing look ${esc(q.look)})</option>`:''}</select></label>
    <p class="subtle">${lk?`Shared look “${esc(lk.name)}” · used by ${(project.props||[]).filter(p=>p.look===lk.id).length} objects.`:'Showing the object as it comes from the library.'}${anyOwn?' This object also has its own changes on top.':''}</p>
    <div class="button-row"><button data-pa="look-save">Save as look…</button>${lk&&anyOwn?'<button data-pa="look-update">Update the look from this object</button>':''}${anyOwn?'<button data-pa="look-clear-own">Clear this object’s changes</button>':''}</div>`;
  if(pal){
    const fam=e.paletteFamily,vars=(ol?.palettes||[]).filter(v=>v.base===fam),cur=app.palette||fam;
    html+=`<h3>Palette ${srcTag(app,'palette')}</h3><div class="pal-row"><button class="pal-chip ${cur===fam?'active':''}" data-pa="pal-set" data-v="default" title="The library palette">Default</button>${QUICK_PALETTES.map(([k,n])=>{const v=vars.find(x=>x.quick===k);return `<button class="pal-chip ${v&&cur===v.id?'active':''}" data-pa="pal-quick" data-v="${k}">${n}</button>`;}).join('')}${vars.filter(v=>!v.quick).map(v=>`<button class="pal-chip ${cur===v.id?'active':''}" data-pa="pal-set" data-v="${esc(v.id)}">${esc(v.name.replace(/ · .*$/,''))}</button>`).join('')}</div>
      <p class="subtle">Colours this object uses. Click one to change it on this object only:</p><div class="swatches" id="propSwatches" data-prop="${esc(q.id)}">${t.status==='ready'?'<span class="subtle">…</span>':'<span class="subtle">(loads with the model)</span>'}</div>`;}
  if(e.material_system==='uv_texture'){const tx=app.texture,txName=tx?.library?(A.entry(tx.library)?.name||tx.library):tx?.image?(catalog.get(tx.image)?.name||'imported image'):'The model’s own picture';
    html+=`<h3>Picture ${srcTag(app,'texture')}</h3><p class="subtle">${esc(txName)}</p><div class="button-row"><button data-pa="tex-choose">Choose from library textures…</button>${tx?'<button data-pa="tex-reset">Use the model’s own</button>':''}</div>`;}
  const a={...LOOK_DEF,...app};
  html+=`<h3>Colour adjustments</h3><div class="form-grid"><label>Tint colour ${srcTag(app,'tint')}<input type="color" data-pf="override.tint" value="${esc(/^#[0-9a-f]{6}$/i.test(a.tint)?a.tint:'#ffffff')}"></label></div>
    ${prange('Tint strength','override.tintStrength',a.tintStrength,0,1,.05,srcTag(app,'tintStrength'))}${prange('Brightness','override.brightness',a.brightness,.2,2,.05,srcTag(app,'brightness'))}${prange('Colour strength (saturation)','override.saturation',a.saturation,0,2,.05,srcTag(app,'saturation'))}
    <details class="details" ${sec('more',false)}><summary>More</summary>${prange('Contrast','override.contrast',a.contrast,.3,2,.05,srcTag(app,'contrast'))}${prange('Hue shift (°)','override.hue',a.hue,-180,180,5,srcTag(app,'hue'))}</details>
    <div class="row"><span>Texture look ${srcTag(app,'filter')}</span><span class="segmented small"><button class="${(app.filter||(e.recommended_filter==='linear'?'smooth':'pixel'))==='pixel'?'active':''}" data-pa="filter" data-v="pixel">Pixel / crisp</button><button class="${(app.filter||(e.recommended_filter==='linear'?'smooth':'pixel'))==='smooth'?'active':''}" data-pa="filter" data-v="smooth">Smooth</button></span></div></details>`;
  return html;}
function collisionSection(q,b,conflicts){const col=q.collision||{},sz=Array.isArray(col.size)?col.size:[b.max[0]-b.min[0],b.max[2]-b.min[2],b.max[1]-b.min[1]];
  return `<details class="section details" ${sec('collision',false,conflicts.length>0)}><summary>Collision ${col.solid!==false?'· solid':'· walk-through'}</summary>
    ${pcheck('Solid: people cannot walk through it','collision.solid',col.solid!==false)}
    <label>Footprint<select data-pf="collision.shape"><option value="auto" ${col.shape==='auto'||!col.shape?'selected':''}>Automatic box (fits the model)</option><option value="box" ${col.shape==='box'?'selected':''}>Box, my size</option><option value="cylinder" ${col.shape==='cylinder'?'selected':''}>Round</option></select></label>
    ${col.shape==='box'||col.shape==='cylinder'?`<div class="form-grid">${pnum(col.shape==='cylinder'?'Diameter (m)':'Width (m)','collision.size.0',sz[0])}${col.shape==='cylinder'?'':pnum('Depth (m)','collision.size.1',sz[1])}${pnum('Height (m)','collision.size.2',sz[2])}</div><button data-pa="col-fit">Fit to model</button>`:''}
    <p class="subtle">Used for first-person walking, rails, route sight lines and cover. Shown as an orange outline on the map.</p>
    ${conflicts.length?`<div class="info warn"><b>Route check:</b><ul>${conflicts.map(c=>`<li>${esc(c.text)}</li>`).join('')}</ul></div>`:project.routeNet?'<p class="subtle">✓ Clear of the player routes and NPC lanes.</p>':''}</details>`;}
function gameplaySection(q,e){
  const g=q.gameplay||{},tags=g.tags||[],strTags=tags.filter(t=>typeof t==='string'),structTags=tags.filter(t=>typeof t!=='string'),known=new Set(SUGGESTED_TAGS.map(t=>t[0]));
  const behaviour=strTags.length||structTags.length||q.points.length?'Gameplay: it has tags or use points':q.collision?.solid!==false?'Physical: blocks movement':'Decoration: visual only';
  const sugg=suggestedTags(e).filter(t=>!strTags.includes(t));const props=g.props&&typeof g.props==='object'&&!Array.isArray(g.props)?g.props:{};
  return `<details class="section details" ${sec('gameplay',false)}><summary>Gameplay · ${esc(behaviour.split(':')[0])}</summary><p class="subtle">${esc(behaviour)}. Tags only describe what this object could be; Room Creator does not run the gameplay.</p>
    <div class="chips">${SUGGESTED_TAGS.map(([k,n])=>`<button class="chip ${strTags.includes(k)?'active':''}" data-pa="tag-toggle" data-v="${k}">${esc(n)}</button>`).join('')}</div>
    ${strTags.filter(t=>!known.has(t)).length?`<div class="chips">${strTags.filter(t=>!known.has(t)).map(t=>`<span class="chip active custom">${esc(t)}<button class="x" data-pa="tag-remove" data-v="${esc(t)}" title="Remove">×</button></span>`).join('')}</div>`:''}
    ${structTags.length?`<p class="subtle">${structTags.length} structured tag${structTags.length>1?'s':''} from another tool (kept unchanged).</p>`:''}
    ${sugg.length?`<p class="subtle">Suggested: ${sugg.map(t=>`<button class="mini" data-pa="tag-toggle" data-v="${t}">+ ${esc((SUGGESTED_TAGS.find(x=>x[0]===t)||[t,t])[1])}</button>`).join(' ')}</p>`:''}
    <div class="row"><input id="propTagNew" placeholder="Add your own tag (any word)" list="propTagList"><button data-pa="tag-add">Add</button></div><datalist id="propTagList">${[...new Set((project.props||[]).flatMap(p=>(p.gameplay?.tags||[]).filter(t=>typeof t==='string')))].map(t=>`<option value="${esc(t)}">`).join('')}</datalist>
    <details class="details" ${sec('extra',false)}><summary>Extra properties (${Object.keys(props).length})</summary><p class="subtle">Free key / value notes for later game systems, e.g. loot = alley_junk. Values that look like numbers or JSON are stored as such.</p>
      ${Object.entries(props).map(([k,v])=>`<div class="kv"><input value="${esc(k)}" data-pkey="${esc(k)}" class="k" title="Key"><input value="${esc(typeof v==='string'?v:JSON.stringify(v))}" data-pval="${esc(k)}" class="v" title="Value"><button class="mini" data-pa="prop-kv-del" data-v="${esc(k)}">×</button></div>`).join('')}
      <button data-pa="prop-kv-add">+ Add property</button></details></details>`;}
function suggestedTags(e){if(!e)return [];const s=(e.sub||'').toLowerCase(),c=(e.category||'').toLowerCase(),n=e.name.toLowerCase();const out=[];
  if(c==='vehicles')out.push('vehicle','cover');if(s.includes('chair'))out.push('seat');if(s.includes('dumpster')||s.includes('bins'))out.push('cover','hide','container');if(s.includes('crate'))out.push('movable','container');
  if(n.includes('till')||n.includes('register'))out.push('interactable','commercial');if(s.includes('shel'))out.push('container');if(s.includes('table'))out.push('cover');if(s.includes('barrier'))out.push('cover');return [...new Set(out)];}
function suggestedPoints(e){if(!e)return [];const s=(e.sub||'').toLowerCase(),c=(e.category||'').toLowerCase(),n=e.name.toLowerCase();
  if(c==='vehicles')return ['driver','passenger','cover'];if(s.includes('chair'))return ['sit'];if(s.includes('dumpster')||s.includes('bins'))return ['cover','hide'];if(s.includes('table'))return ['work','customer'];if(n.includes('till'))return ['work','customer'];if(s.includes('crate'))return ['search'];return ['use'];}
function pointsSection(q,e,b){const sel=q.points.find(p=>p.id===PZ.selPoint);
  const types=[...new Set([...SUGGESTED_POINTS.map(t=>t[0]),...(project.props||[]).flatMap(p=>p.points.map(x=>x.type))])];
  const sugg=suggestedPoints(e).filter(t=>!q.points.some(p=>p.type===t));
  return `<details class="section details" ${sec('points',q.points.length>0)}><summary>Use Points · ${q.points.length}</summary>
    <p class="subtle">Spots attached to this object, such as where to sit, stand to use it, or take cover. They move and turn with it. Any type name works, including your own.</p>
    ${q.points.map(p=>{const uu=pointToUser(q,p),right=uu.right,fwd=uu.forward;return `<div class="pt-row ${p.id===PZ.selPoint?'active':''} ${p.enabled===false?'off':''}" data-pa="pt-select" data-v="${esc(p.id)}"><i style="background:${POINT_COLORS[p.type]||'#e0e0e0'}"></i><span><strong>${esc(p.name||labelForPoint(p.type))}</strong><small>${esc(p.type)} · ${fmt2(right)} right, ${fmt2(fwd)} forward, ${fmt2(p.y)} up</small></span><button class="mini" data-pa="pt-toggle" data-v="${esc(p.id)}" title="${p.enabled===false?'Switch on':'Switch off'}">${p.enabled===false?'○':'●'}</button><button class="mini" data-pa="pt-delete" data-v="${esc(p.id)}" title="Delete">×</button></div>`;}).join('')}
    ${sel?`<div class="pt-edit"><div class="form-grid"><label>Type<input type="text" data-pt="type" value="${esc(sel.type)}" list="ptTypeList"></label><label>Name<input type="text" data-pt="name" value="${esc(sel.name||'')}"></label>
      <label>Right (m)<input type="number" step="0.05" data-pt="right" value="${fmt2(pointToUser(q,sel).right)}"></label><label>Forward (m)<input type="number" step="0.05" data-pt="forward" value="${fmt2(pointToUser(q,sel).forward)}"></label>
      <label>Height (m)<input type="number" step="0.05" data-pt="up" value="${fmt2(sel.y)}"></label><label>Facing (° clockwise from the object’s front)<input type="number" step="15" data-pt="facing" value="${fmt2(pointToUser(q,sel).facing)}"></label></div><p class="subtle">Drag the point on the map to move it.</p></div>`:''}
    <datalist id="ptTypeList">${types.map(t=>`<option value="${esc(t)}">`).join('')}</datalist>
    <div class="row"><select id="ptNewType">${types.map(t=>`<option value="${esc(t)}">${esc(labelForPoint(t))}</option>`).join('')}<option value="__custom">Custom…</option></select><button data-pa="pt-add">+ Add point</button></div>
    ${sugg.length?`<p class="subtle">Suggested: ${sugg.map(t=>`<button class="mini" data-pa="pt-add-type" data-v="${t}">+ ${esc(labelForPoint(t))}</button>`).join(' ')}</p>`:''}
    <div class="button-row"><button data-pa="pt-save-defaults" ${q.points.length?'':'disabled'}>Make these the defaults for new copies</button>${setupOf(q.asset)?.points?.length?'<button data-pa="pt-apply-defaults">Add the default points</button>':''}</div></details>`;}
function labelForPoint(t){return (SUGGESTED_POINTS.find(x=>x[0]===t)||[t,t[0]?.toUpperCase()+t.slice(1)])[1];}
function infoSection(q,e,t,setup){const pv=A.provenance(e),b=propBounds(q);
  return `<details class="section details" ${sec('info',false)}><summary>Info · licence</summary><table class="kv-table">
    <tr><td>Asset ID</td><td class="mono">${esc(q.asset)}</td></tr>${e?`<tr><td>Category</td><td>${esc((e.category_path||[]).join(' / '))}</td></tr>
    <tr><td>Colours</td><td>${e.material_system==='palette'?'Palette (swappable colour grid)':e.material_system==='uv_texture'?'Painted picture (texture)':esc(e.material_system)}</td></tr>
    ${e.paletteFamily?`<tr><td>Palette</td><td>${esc(A.entry(e.paletteFamily)?.name||e.paletteFamily)}</td></tr>`:''}
    <tr><td>Model size</td><td>${fmt2(b.max[0]-b.min[0])} × ${fmt2(b.max[2]-b.min[2])} × ${fmt2(b.max[1]-b.min[1])} m</td></tr>
    ${t.status==='ready'?`<tr><td>Parts</td><td>${t.parts.length} (${esc(t.parts.slice(0,8).join(', '))}${t.parts.length>8?'…':''}) · ${t.triangles} triangles</td></tr>`:''}
    <tr><td>Source pack</td><td>${esc(pv.pack)} (${esc(pv.archive)})</td></tr>
    <tr><td>Licence</td><td class="${pv.unverified?'warn':''}">${esc(pv.license)} · commercial use ${pv.commercial}${pv.unverified?' — no licence text came with this pack; confirm before any commercial release':''}</td></tr>`:''}</table>
    ${e?.category==='Vehicles'?`<p class="subtle">The library could not tell which end of vehicles is the front.</p>`:''}
    ${e?`<h3>Which side is the front? <small>(all copies of this model)</small></h3><div class="segmented small front-pick">${[[0,'As built'],[90,'Its left'],[180,'Other end'],[270,'Its right']].map(([v,n])=>`<button class="${C.propFrontTurn(setup)===v?'active':''}" data-pa="setup-front" data-v="${v}">${n}</button>`).join('')}</div>
      <p class="subtle">Library models do not all agree on which side is the front. Pick the side that should face the way you turn it: the round handle on the map then points out of the real front, and new use points start in the right place. Copies already placed keep looking exactly the same.</p>`:''}</details>`;}
// swatches need the loaded colour image, so they are filled after the inspector draws
HOOKS.inspectorRender.push(el=>{const box=el.querySelector('#propSwatches');if(!box)return;const q=(project.props||[]).find(p=>p.id===box.dataset.prop);if(!q)return;
  const cols=A.usedColors(q.asset);if(!cols.length)return;const app=C.propAppearance(project,q),cur=app.palette;
  const show=list=>{box.innerHTML=list.slice(0,24).map(c=>`<label class="swatch" title="Used by ${c.n} points of the model"><input type="color" value="${c.shown}" data-swatch="${c.hex}"><i style="background:${c.shown}"></i></label>`).join('')+(list.length>24?`<span class="subtle">+${list.length-24} more</span>`:'');};
  if(!cur){show(cols.map(c=>({...c,shown:c.hex})));return;}
  Promise.all([paletteCanvas(propEntry(q).paletteFamily),paletteCanvas(cur)]).then(([bc,cc])=>{const bd=bc.getContext('2d').getImageData(0,0,bc.width,bc.height).data,cd=cc.getContext('2d').getImageData(0,0,cc.width,cc.height).data;
    show(cols.map(c=>{const [r,g,b]=hex2rgb(c.hex);for(let i=0;i<bd.length;i+=4)if(bd[i]===r&&bd[i+1]===g&&bd[i+2]===b)return {...c,shown:rgb2hex(cd[i],cd[i+1],cd[i+2])};return {...c,shown:c.hex};}));}).catch(()=>show(cols.map(c=>({...c,shown:c.hex}))));});

// ------------------------------------------------------------------ inspector input handling
function setPath(o,path,v){const ks=path.split('.');let cur=o;for(let i=0;i<ks.length-1;i++){const k=ks[i];if(cur[k]===undefined||cur[k]===null||typeof cur[k]!=='object')cur[k]=/^\d+$/.test(ks[i+1])?[]:{};cur=cur[k];}cur[ks[ks.length-1]]=v;}
function applyPropField(q,path,raw,type){
  if(path==='name'){q.name=String(raw).trim();if(!q.name)delete q.name;return;}
  if(path==='enabled'||path==='locked'){q[path]=!!raw;return;}
  if(path==='look'){q.look=raw||null;return;}
  if(path==='collision.solid'){q.collision.solid=!!raw;return;}
  if(path==='collision.shape'){q.collision.shape=raw;if(raw!=='auto'&&!Array.isArray(q.collision.size)){const b=propBounds(q);q.collision.size=[+(b.max[0]-b.min[0]).toFixed(3),+(b.max[2]-b.min[2]).toFixed(3),+(b.max[1]-b.min[1]).toFixed(3)];}return;}
  let v=type==='color'||type==='text'?raw:Number(raw);if(typeof v==='number'&&!Number.isFinite(v))return;
  if(path==='rotation')v=C.norm(v);
  if(path==='scaleU'){v=Math.max(.05,Math.min(20,v));q.scale=[v,v,v];return;}
  if(path.startsWith('scale.')){const s=C.propScale(q).slice();s[+path.slice(6)]=Math.max(.05,Math.min(20,v));q.scale=s;return;}
  if(path.startsWith('collision.size.')){const s=Array.isArray(q.collision.size)?q.collision.size.slice():[1,1,1];const i=+path.slice(15);s[i]=Math.max(.02,v);if(q.collision.shape==='cylinder'&&i===0)s[1]=s[0];q.collision.size=s;return;}
  if(path.startsWith('override.')){if(!q.override||typeof q.override!=='object')q.override={};q.override[path.slice(9)]=v;return;}
  setPath(q,path,v);}
function livePropEdit(path,raw,type,commit){const q=selection?.kind==='prop'?selected():null;if(!q)return;
  if(!PZ.gesture||PZ.gesture.id!==q.id||PZ.gesture.path!==path)PZ.gesture={id:q.id,path,before:capture()};
  applyPropField(q,path,raw,type);GLE?.invalidateProps();RR?.clearCaches?.();drawSoon();
  if(commit){const g=PZ.gesture;PZ.gesture=null;try{project=C.validateBundle({project,assets:[...catalog.values()]}).project;pushHistory(g.before,'Edit object');}catch(err){restore(g.before);toast(err.message,6000);}renderInspector();}}
document.addEventListener('input',e=>{const t=e.target;if(!t.matches?.('[data-pf]'))return;if(t.type==='checkbox'||t.tagName==='SELECT'||t.type==='text')return;
  livePropEdit(t.dataset.pf,t.value,t.type,false);const twin=[...document.querySelectorAll(`[data-pf="${t.dataset.pf}"]`)].find(x=>x!==t);if(twin)twin.value=t.value;});
document.addEventListener('change',e=>{const t=e.target;
  if(t.matches?.('[data-pf]')){const path=t.dataset.pf;
    if(t.type==='checkbox'||t.tagName==='SELECT'||t.type==='text'){const q=selected();if(!q)return;mutate(()=>applyPropField(q,path,t.type==='checkbox'?t.checked:t.value,t.type),'Edit object');return;}
    livePropEdit(path,t.value,t.type,true);return;}
  if(t.matches?.('[data-pt]')){const q=selected(),p=q?.points.find(x=>x.id===PZ.selPoint);if(!p)return;const k=t.dataset.pt,v=t.type==='number'?Number(t.value):t.value;if(t.type==='number'&&!Number.isFinite(v))return;
    mutate(()=>{if(k==='type')p.type=String(v).trim()||'point';else if(k==='name'){if(String(v).trim())p.name=String(v).trim();else delete p.name;}else{const u=pointToUser(q,p);u[k]=v;const m=pointFromUser(frontTurn(q),u);if(k==='right'||k==='forward'){p.x=+m.x.toFixed(3);p.z=+m.z.toFixed(3);}else if(k==='up')p.y=v;else if(k==='facing')p.yaw=m.yaw;}},'Edit use point');return;}
  if(t.matches?.('[data-swatch]')){const q=selected();if(q)recolorOnProp(q,t.dataset.swatch,t.value);return;}
  if(t.matches?.('[data-pkey]')||t.matches?.('[data-pval]')){const q=selected();if(!q)return;const props=q.gameplay.props&&typeof q.gameplay.props==='object'?q.gameplay.props:(q.gameplay.props={});
    if(t.dataset.pkey!==undefined){const old=t.dataset.pkey,nk=t.value.trim();if(!nk||nk===old)return;mutate(()=>{const entries=Object.entries(props);for(const k of Object.keys(props))delete props[k];for(const [k,v] of entries)props[k===old?nk:k]=v;},'Rename property');}
    else{const k=t.dataset.pval;let v=t.value;try{if(/^(-?\d+(\.\d+)?|true|false|null|[\[{].*)$/s.test(v.trim()))v=JSON.parse(v);}catch(err){}mutate(()=>{props[k]=v;},'Edit property');}}});

// ------------------------------------------------------------------ buttons
HOOKS.click.push((e,b)=>{const a=b.dataset.pa;if(!a)return false;const q=selection?.kind==='prop'?selected():null,v=b.dataset.v;
  switch(a){
    case 'lib-connect':if(A.pickerSupported())A.connectPicker().then(r=>{if(r.fallback)$('libraryFolder').click();else if(!r.cancelled)toast(r.message,7000);});else $('libraryFolder').click();break;
    case 'lib-reconnect':A.reconnect({ask:true}).then(r=>toast(r.message,7000));break;
    case 'lib-disconnect':ask('Disconnect the asset library?','Placed objects stay in the project and show as boxes until you connect again.',()=>{A.disconnect();refresh();},'Disconnect');break;
    case 'go-library':pane='library';renderLeft();break;
    case 'lib-mode':PZ.libMode=v;PZ.limit=60;PZ.libSearch='';renderLeft();break;
    case 'lib-cat':PZ.libCat=v;PZ.libSub='';PZ.limit=60;renderLeft();break;
    case 'lib-sub':PZ.libSub=v;PZ.limit=60;renderLeft();break;
    case 'lib-more':PZ.limit+=60;renderLeft();break;
    case 'lib-fav':{const f=new Set(lsGet('rc.lib.fav',[]));f.has(v)?f.delete(v):f.add(v);lsSet('rc.lib.fav',[...f]);renderLeft();break;}
    case 'lib-cancel':PZ.replacing=null;PZ.texTarget=null;stopPlacing();break;
    case 'prop-duplicate':duplicateProp();break;
    case 'prop-delete':deleteSelection();break;
    case 'prop-replace':if(q){PZ.replacing=q.id;PZ.placing=null;pane='library';PZ.libMode='objects';const e2=propEntry(q);if(e2){PZ.libCat=e2.category;PZ.libSub=e2.sub;}renderLeft();toast('Click the object to put in its place.',4000);}break;
    case 'prop-turn':if(q)mutate(()=>{q.rotation=C.norm((q.rotation||0)+Number(v));},'Turn object');break;
    case 'prop-reset':if(q)mutate(()=>{q.rotation=0;q.scale=[1,1,1];q.z=0;},'Reset object');break;
    case 'col-fit':if(q)mutate(()=>{const b=propBounds(q);q.collision.size=[+(b.max[0]-b.min[0]).toFixed(3),+(b.max[2]-b.min[2]).toFixed(3),+(b.max[1]-b.min[1]).toFixed(3)];if(q.collision.shape==='cylinder')q.collision.size[1]=q.collision.size[0]=Math.max(q.collision.size[0],q.collision.size[1]);},'Fit collision');break;
    case 'filter':if(q)mutate(()=>{q.override.filter=v;},'Texture look');break;
    case 'pal-set':if(q)mutate(()=>{if(v==='default'){const lk=q.look&&C.lookById(project,q.look);if(lk?.palette)q.override.palette='default';else delete q.override.palette;}else q.override.palette=v;},'Change palette');break;
    case 'pal-quick':if(q){const fam=propEntry(q)?.paletteFamily;if(fam)quickPalette(fam,v,(QUICK_PALETTES.find(x=>x[0]===v)||[v,v])[1]).then(id=>mutate(()=>{selected().override.palette=id;},'Change palette')).catch(err=>toast(err.message,6000));}break;
    case 'pal-apply':if(q)mutate(()=>{const fam=propEntry(q)?.paletteFamily;if(v===fam)delete q.override.palette;else q.override.palette=v;},'Change palette');break;
    case 'pal-copy':paletteCanvas(v).then(c=>{const id=C.uid('palv');mutate(()=>{ensureLib().palettes.push({id,name:'Copy of '+(A.entry(v)?.name||C.paletteVariantById(project,v)?.name||v),base:familyOf(v),image:c.toDataURL('image/png')});},'Copy palette');openPaletteEditor(id);}).catch(err=>toast(err.message,6000));break;
    case 'pal-edit':openPaletteEditor(v);break;
    case 'pal-rename':renamePrompt('Rename palette',C.paletteVariantById(project,v)?.name,n=>mutate(()=>{C.paletteVariantById(project,v).name=n;},'Rename palette'));break;
    case 'pal-delete':{const used=(project.props||[]).filter(p=>p.override?.palette===v).length+(PROPS_LIB()?.looks||[]).filter(l=>l.palette===v).length;ask('Delete this palette?',used?`${used} objects or looks use it. They go back to the library palette.`:'Nothing uses it.',()=>mutate(()=>{const ol=ensureLib();ol.palettes=ol.palettes.filter(x=>x.id!==v);for(const p of project.props||[])if(p.override?.palette===v)delete p.override.palette;for(const l of ol.looks)if(l.palette===v)delete l.palette;},'Delete palette'),'Delete');break;}
    case 'tex-choose':if(q){PZ.texTarget={kind:'prop',id:q.id,label:propName(q)};pane='library';PZ.libMode='textures';renderLeft();}break;
    case 'appearance-reset':if(q&&['palette','texture'].includes(v))mutate(()=>{q.override[v]='default';},'Reset '+v+' reference');break;
    case 'model-retry':if(q){A.retryTemplate(q.asset);renderInspector();}break;
    case 'tex-reset':if(q)mutate(()=>{const lk=q.look&&C.lookById(project,q.look);if(lk?.texture)q.override.texture='default';else delete q.override.texture;},'Use the model’s own picture');break;
    case 'look-save':if(q)renamePrompt('Save as look','Look '+((PROPS_LIB()?.looks.length||0)+1),n=>savePropLook(q,n));break;
    case 'look-update':if(q){const lk=C.lookById(project,q.look),n=(project.props||[]).filter(p=>p.look===lk.id).length;ask('Update the look “'+lk.name+'”?',`This changes all ${n} objects that use it.`,()=>mutate(()=>{for(const k of C.LOOK_FIELDS)if(q.override[k]!==undefined){if(q.override[k]==='default')delete lk[k];else lk[k]=q.override[k];delete q.override[k];}},'Update look'),'Update look');}break;
    case 'look-clear-own':if(q)mutate(()=>{for(const k of C.LOOK_FIELDS)delete q.override[k];},'Clear object appearance changes');break;
    case 'look-rename':renamePrompt('Rename look',C.lookById(project,v)?.name,n=>mutate(()=>{C.lookById(project,v).name=n;},'Rename look'));break;
    case 'look-delete':{const n=(project.props||[]).filter(p=>p.look===v).length;ask('Delete this look?',n?`${n} objects use it; they go back to the asset default (their own changes stay).`:'Nothing uses it.',()=>mutate(()=>{const ol=ensureLib();ol.looks=ol.looks.filter(l=>l.id!==v);for(const p of project.props||[])if(p.look===v)p.look=null;},'Delete look'),'Delete');break;}
    case 'setup-front':if(q){const nv=C.norm(Number(v));mutate(()=>{const lib=ensureLib(),s=lib.setups[q.asset]||(lib.setups[q.asset]={}),old=C.propFrontTurn(s);if(old===nv)return;
        s.frontTurn=nv;delete s.front;for(const p of project.props||[])if(p.asset===q.asset)p.rotation=C.norm((p.rotation||0)+old-nv); /* keeps every copy looking the same */
        if(nv===0&&Object.keys(s).length===1)delete lib.setups[q.asset];},'Set which side is the front');}break;
    case 'setup-delete':ask('Remove this object setup?','Placed copies keep their current points, tags and turn.',()=>mutate(()=>{C.preservePropSetup(project,v,null);delete ensureLib().setups[v];},'Remove setup'),'Remove');break;
    case 'looks-export':showLooksExport();break;
    case 'looks-import':$('looksFile').click();break;
    case 'tag-toggle':if(q)mutate(()=>{const t=q.gameplay.tags;const i=t.indexOf(v);if(i>=0)t.splice(i,1);else t.push(v);},'Gameplay tag');break;
    case 'tag-remove':if(q)mutate(()=>{const i=q.gameplay.tags.indexOf(v);if(i>=0)q.gameplay.tags.splice(i,1);},'Remove tag');break;
    case 'tag-add':if(q){const inp=$('propTagNew'),tv=inp?.value.trim();if(!tv)break;mutate(()=>{if(!q.gameplay.tags.includes(tv))q.gameplay.tags.push(tv);},'Add tag');}break;
    case 'prop-kv-add':if(q){const props=q.gameplay.props&&typeof q.gameplay.props==='object'?q.gameplay.props:(q.gameplay.props={});let k='note',i=2;while(k in props)k='note'+i++;mutate(()=>{if(typeof q.gameplay.props!=='object'||!q.gameplay.props)q.gameplay.props={};q.gameplay.props[k]='';},'Add property');}break;
    case 'prop-kv-del':if(q)mutate(()=>{delete q.gameplay.props[v];},'Remove property');break;
    case 'pt-select':if(b.closest('.mini'))break;PZ.selPoint=PZ.selPoint===v?null:v;renderInspector();drawSoon();break;
    case 'pt-toggle':if(q)mutate(()=>{const p=q.points.find(x=>x.id===v);if(p)p.enabled=p.enabled===false;},'Switch use point');break;
    case 'pt-delete':if(q)mutate(()=>{q.points=q.points.filter(x=>x.id!==v);if(PZ.selPoint===v)PZ.selPoint=null;},'Delete use point');break;
    case 'pt-add':case 'pt-add-type':if(q){let type=a==='pt-add-type'?v:$('ptNewType')?.value;if(type==='__custom'){renamePrompt('New point type','my-point',n=>addPoint(q,n.trim().replace(/\s+/g,'-')||'point'));break;}addPoint(q,type);}break;
    case 'pt-save-defaults':if(q)mutate(()=>{const s=ensureLib().setups[q.asset]||(ensureLib().setups[q.asset]={});s.points=q.points.map(p=>({...C.clone(p),id:'default_'+p.type+'_'+Math.random().toString(36).slice(2,6)}));},'Save default use points');toast('New copies of this object get these points.');break;
    case 'pt-apply-defaults':if(q)mutate(()=>{for(const p of setupOf(q.asset)?.points||[])q.points.push({...C.clone(p),id:C.uid('pt')});},'Add default use points');break;
    default:return false;}
  return true;});
function addPoint(q,type){const ex=userExtents(q),front=ex.front,back=ex.back,hw=ex.half,f=frontTurn(q);
  // sensible first guesses, in the object's own terms (it can be dragged afterwards)
  let u={right:0,forward:front+.45,up:0,facing:180};
  if(type==='sit')u={right:0,forward:0,up:0,facing:0};else if(type==='work')u={right:0,forward:-(back+.45),up:0,facing:0};else if(type==='cover'||type==='hide')u={right:0,forward:-(back+.4),up:0,facing:0};
  else if(type==='driver')u={right:-(hw+.45),forward:front*.15,up:0,facing:270};else if(type==='passenger')u={right:hw+.45,forward:front*.15,up:0,facing:90};else if(type==='arrival')u={right:0,forward:-(back+1.5),up:0,facing:0};
  const m=pointFromUser(f,u),id=C.uid('pt');mutate(()=>{q.points.push({id,type,x:+m.x.toFixed(3),y:0,z:+m.z.toFixed(3),yaw:m.yaw,enabled:true});PZ.selPoint=id;},'Add use point');}
function savePropLook(q,name){const app=C.propAppearance(project,q),e=propEntry(q),id=C.uid('look');
  mutate(()=>{const look={id,name,asset:q.asset};for(const k of C.LOOK_FIELDS)if(app[k]!==undefined)look[k]=app[k];ensureLib().looks.push(look);q.look=id;for(const k of C.LOOK_FIELDS)delete q.override[k];},'Save look');toast('Saved the look “'+name+'”. Choose it on other copies of '+(e?.name||'this object')+' under Appearance → Look.',6000);}
function renamePrompt(title,value,done){modal(`${modalTitle(title)}<label>Name<input id="renameValue" value="${esc(value||'')}"></label><div class="button-row"><button data-action="close-modal">Cancel</button><button class="primary" id="renameOk">OK</button></div>`);
  const ok=()=>{const v=$('renameValue').value.trim();if(!v)return;closeModal();done(v);};$('renameOk').onclick=ok;$('renameValue').onkeydown=e=>{if(e.key==='Enter')ok();};}

// ------------------------------------------------------------------ texture choices (walls / floors and painted objects)
const LIB_SURFACES={'import-floor-texture':'floor','import-wall-texture':'wall','import-ceiling-texture':'ceiling','import-selected-wall-texture':'selectedWall','import-partition-texture':'partition','import-floor-section-texture':'floorSection','import-floor-section-under-texture':'floorSectionUnder','import-ceiling-patch-texture':'ceilingPatch','import-pillar-texture':'pillar'};
HOOKS.action.push(name=>{if(!name.startsWith('lib-import-'))return false;const key=LIB_SURFACES[name.slice(4)];if(!key)return false;
  if(!A.connected){toast('Connect the asset library first (Library tab).',5000);pane='library';renderLeft();return true;}
  let spec;try{spec=surfaceSpec(key);}catch(err){toast(err.message);return true;}
  const label={floor:'floor',wall:'walls',ceiling:'ceiling',selectedWall:'selected wall',partition:'partition',floorSection:'floor space',floorSectionUnder:'underside',ceilingPatch:'ceiling patch',pillar:'pillar'}[key]||key;
  PZ.texTarget={kind:'surface',spec,label:label+(spec.roomId?' · '+(C.roomById(project,spec.roomId)?.name||''):'')};pane='library';PZ.libMode='textures';PZ.limit=60;renderLeft();return true;});
async function libraryImage(id){const e=A.entry(id);if(!e)throw Error('That texture is not in the connected library.');
  const existing=[...catalog.values()].find(a=>a.library?.asset_id===id);if(existing)return existing;
  const src=await A.dataUrl(e.working_path),image=await new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>rej(Error('cannot decode '+e.name));im.src=src;});
  const asset={id:C.uid('asset'),name:e.name,src,width:image.width,height:image.height,category:'texture',view:'both',library:{asset_id:id,library:A.state.name}};R.images.set(asset.id,image);return asset;}
async function libTextureClick(id){
  const tgt=PZ.texTarget||(selection?.kind==='prop'?{kind:'prop',id:selection.id,label:''}:null);
  if(!tgt){const k=selection?.kind==='wall'?'selectedWall':selection?.kind==='partition'?'partition':selection?.kind==='floorsection'?'floorSection':selection?.kind==='pillar'?'pillar':selection?.kind==='room'?'floor':null;
    if(!k){toast('Select a wall, floor, pillar or painted object first.',5000);return;}try{PZ.texTarget={kind:'surface',spec:surfaceSpec(k),label:k};}catch(err){toast(err.message);return;}return libTextureClick(id);}
  try{
    if(tgt.kind==='prop'){const q=(project.props||[]).find(p=>p.id===tgt.id);if(!q)return;const e=propEntry(q);if(e?.material_system!=='uv_texture'){toast('That object is palette-coloured. Use its Palette controls instead.',6000);return;}
      if(mutate(()=>{q.override.texture={library:id};},'Change object picture')){PZ.texTarget=null;pane='library';renderLeft();}return;}
    const asset=await libraryImage(id),spec=tgt.spec;
    if(mutate(()=>{catalog.set(asset.id,asset);const surf=getSurfaceTarget(spec);surf.textureId=asset.id;surf.finish='image';surf.textureOpacity=1;surf.filter='pixel';if(!(surf.tileSize>0))surf.tileSize=1;},'Library texture')){PZ.texTarget=null;toast('Texture applied. Adjust repeat size, offset and rotation in the Style panel.',5000);refresh();}
  }catch(err){toast('Could not use that texture: '+err.message,7000);}}

// ------------------------------------------------------------------ palette editor (full grid, for your own palettes)
function openPaletteEditor(id){const pv=C.paletteVariantById(project,id);if(!pv){toast('Only your own palettes can be edited. Make an editable copy first.');return;}
  paletteCanvas(id).then(c=>{const W=c.width,H=c.height,cells=W>64?8:W,cw=W/cells,g=c.getContext('2d'),d=g.getImageData(0,0,W,H).data,list=[];
    for(let j=0;j<(H>64?8:H);j++)for(let i=0;i<cells;i++){const x=Math.floor(i*cw+cw/2),y=Math.floor(j*(H/(H>64?8:H))+(H/(H>64?8:H))/2),k=(y*W+x)*4;list.push(rgb2hex(d[k],d[k+1],d[k+2]));}
    const uniq=[...new Set(list)];
    modal(`${modalTitle('Edit palette · '+pv.name)}<p class="subtle">Click a colour to change it everywhere this palette is used (${(project.props||[]).filter(q=>C.propAppearance(project,q).palette===id).length} objects).</p><div class="swatches big">${uniq.map(h=>`<label class="swatch"><input type="color" value="${h}" data-palswatch="${h}" data-pal="${esc(id)}"><i style="background:${h}"></i></label>`).join('')}</div><div class="button-row"><button data-action="close-modal" class="primary">Done</button></div>`);}).catch(err=>toast(err.message,6000));}
document.addEventListener('change',e=>{const t=e.target;if(!t.matches?.('[data-palswatch]'))return;const id=t.dataset.pal,from=t.dataset.palswatch;
  paletteCanvas(id).then(c=>{recolorCanvas(c,from,t.value);const img=c.toDataURL('image/png');mutate(()=>{C.paletteVariantById(project,id).image=img;},'Edit palette',{refreshNow:false});t.dataset.palswatch=t.value;t.nextElementSibling.style.background=t.value;GLE?.invalidateProps();drawSoon();});});

// ------------------------------------------------------------------ export / import looks, palettes and object setups
function showLooksExport(){const ol=PROPS_LIB()||{looks:[],palettes:[],setups:{}};
  modal(`${modalTitle('Export looks and setups')}<p>Saves a small file you can import into any other Room Creator project. The asset library is not touched.</p>
    <h3>Looks</h3>${ol.looks.map(l=>`<label class="check"><input type="checkbox" data-exp-look="${esc(l.id)}" checked>${esc(l.name)} <small>${esc(A.entry(l.asset)?.name||l.asset||'')}</small></label>`).join('')||'<p class="subtle">None.</p>'}
    <h3>Palettes</h3>${ol.palettes.map(v=>`<label class="check"><input type="checkbox" data-exp-pal="${esc(v.id)}" checked>${esc(v.name)}</label>`).join('')||'<p class="subtle">None.</p>'}
    <h3>Object setups</h3>${Object.keys(ol.setups||{}).map(k=>`<label class="check"><input type="checkbox" data-exp-setup="${esc(k)}" checked>${esc(A.entry(k)?.name||k)}</label>`).join('')||'<p class="subtle">None.</p>'}
    <p class="subtle">Palettes that a chosen look needs are always included.</p><div class="button-row"><button data-action="close-modal">Cancel</button><button class="primary" id="expGo">Download file</button></div>`);
  $('expGo').onclick=()=>{const pick=attr=>[...document.querySelectorAll(`[${attr}]`)].filter(x=>x.checked).map(x=>x.getAttribute(attr));const data=buildLooksExport(pick('data-exp-look'),pick('data-exp-pal'),pick('data-exp-setup'));closeModal();
    download(new Blob([JSON.stringify(data,null,1)],{type:'application/json'}),safeName(project.name||'room')+'_looks.rclooks.json');toast(`Exported ${data.looks.length} looks, ${data.palettes.length} palettes and ${Object.keys(data.setups).length} setups.`);};}
function buildLooksExport(lookIds,palIds,setupIds){const ol=PROPS_LIB()||{looks:[],palettes:[],setups:{}},looks=ol.looks.filter(l=>lookIds.includes(l.id)).map(l=>C.clone(l)),need=new Set(palIds);
  for(const l of looks)if(typeof l.palette==='string'&&C.paletteVariantById(project,l.palette))need.add(l.palette);
  const setups={};for(const k of setupIds)if(ol.setups[k])setups[k]=C.clone(ol.setups[k]);
  return {format:'trapstar-room-creator-looks',version:1,exportedWith:'TRAPSTAR Room Creator 0.14.1',library:{name:A.state.name||null},looks,palettes:ol.palettes.filter(v=>need.has(v.id)).map(v=>C.clone(v)),setups};}
async function importLooksFile(f){let data;try{data=JSON.parse(await f.text());}catch(e){toast('That file is not a looks file (it is not valid JSON).',6000);return;}
  try{const r=mergeLooks(data);toast(`Imported ${r.looks} looks, ${r.palettes} palettes, ${r.setups} setups${r.same?` (${r.same} were already here)`:''}${r.renamed?`; ${r.renamed} had clashing IDs and were added as new copies`:''}${r.setupConflicts.length?`; kept existing setups for: ${r.setupConflicts.join(', ')}`:''}.`,12000);}catch(e){toast('Import stopped: '+e.message,8000);}}
function mergeLooks(data){
  if(!data||data.format!=='trapstar-room-creator-looks'||!Array.isArray(data.looks)&&!Array.isArray(data.palettes))throw Error('this is not a Room Creator looks file');
  const res={looks:0,palettes:0,setups:0,same:0,renamed:0,setupConflicts:[]};
  mutate(()=>{const ol=ensureLib(),remap=new Map();
    for(const v of (data.palettes||[]).filter(x=>x&&typeof x==='object')){const cur=C.paletteVariantById(project,v.id);
      if(cur&&JSON.stringify(cur)===JSON.stringify(v)){res.same++;continue;}const copy=C.clone(v);if(cur||!copy.id){const nid=C.uid('palv');remap.set(v.id,nid);copy.id=nid;res.renamed+=cur?1:0;}ol.palettes.push(copy);res.palettes++;}
    for(const l of (data.looks||[]).filter(x=>x&&typeof x==='object')){const cur=C.lookById(project,l.id),copy=C.clone(l);if(remap.has(copy.palette))copy.palette=remap.get(copy.palette);
      if(cur&&JSON.stringify(cur)===JSON.stringify(copy)){res.same++;continue;}if(cur||!copy.id){copy.id=C.uid('look');res.renamed+=cur?1:0;}ol.looks.push(copy);res.looks++;}
    for(const [k,s] of Object.entries(data.setups||{})){if(!s||typeof s!=='object')continue;if(ol.setups[k]&&JSON.stringify(ol.setups[k])===JSON.stringify(s)){res.same++;continue;}if(ol.setups[k]){res.setupConflicts.push(k);continue;}C.preservePropSetup(project,k,s);ol.setups[k]=C.clone(s);res.setups++;}},'Import looks');
  return res;}

// ------------------------------------------------------------------ route check: solid objects on routes, lanes and spots
function propConflicts(){
  const net=project.routeNet,key=net&&project.props?.length?JSON.stringify([project.props.map(q=>[q.x,q.y,q.z,q.rotation,q.scale,q.story,q.enabled,q.collision,q.bounds,q.asset]),net.vertices,net.edges,net.lanes,net.traffic,net.nodes,project.objectLibrary?.setups]):'';
  if(PZ.conflictCache.key===key)return PZ.conflictCache.list;const list=[];PZ.conflictCache={key,list};if(!net)return list;
  const verts=new Map((net.vertices||[]).map(v=>[v.id,v])),strafe=net.settings?.defaults?.strafe??.7;
  for(const q of project.props||[]){if((q.story||0)!==0)continue;const fz=C.propFloorZ(project,q),fp=C.propFootprint(q,setupOf(q.asset),null,fz);if(!C.propBlocksWalking(q,fp,fz))continue;const nm=propName(q);
    for(const e of net.edges||[]){const a=verts.get(e.a),b=verts.get(e.b);if(!a||!b)continue;const band=Math.min(e.band??9,strafe),d=C.polyDistToSegment(fp.poly,a,b);
      if(d<.3)list.push({prop:q.id,kind:'route',severity:'blocks',text:`${nm} stands on the player route “${e.name||e.id}”.`});else if(d<band+.25)list.push({prop:q.id,kind:'band',severity:'narrows',text:`${nm} narrows the strafe space on “${e.name||e.id}” (${fmt2(d)} m from the route line).`});}
    for(const l of [...(net.lanes||[]),...(net.traffic||[])]){const pts=l.points||[],traffic=(net.traffic||[]).includes(l);for(let i=1;i<pts.length;i++){const d=C.polyDistToSegment(fp.poly,pts[i-1],pts[i]);if(d<(traffic?1.0:.35)){list.push({prop:q.id,kind:traffic?'traffic':'lane',severity:'blocks',text:`${nm} sits on the ${traffic?'traffic lane':'NPC lane'} “${l.name||l.id}”.`});break;}}}
    for(const nd of net.nodes||[]){const r=nd.radius||.55;if(C.pointInPoly(nd,fp.poly)||fp.poly.some((v,k)=>C.segDist(nd,v,fp.poly[(k+1)%fp.poly.length])<r*.6))list.push({prop:q.id,kind:'spot',severity:'blocks',text:`${nm} covers the spot “${nd.name||nd.id}”.`});}}
  return list;}
HOOKS.leftRender.push(el=>{if(pane!=='rails'||!project.routeNet||(typeof RW!=='undefined'&&RW.on))return;const list=propConflicts();if(!(project.props||[]).length)return;
  el.insertAdjacentHTML('beforeend',`<div class="section"><h3>3D objects on routes · ${list.length}</h3>${list.length?list.map(c=>`<button class="list-card" data-select-prop="${esc(c.prop)}"><span><strong>${esc(c.text)}</strong><small>${c.severity==='blocks'?'BLOCKS':'narrows'}</small></span></button>`).join(''):'<p class="subtle">✓ No solid object blocks a player route, NPC lane or spot.</p>'}</div>`);});
document.addEventListener('click',e=>{const b=e.target.closest('[data-select-prop]');if(!b)return;const q=(project.props||[]).find(p=>p.id===b.dataset.selectProp);if(!q)return;activeStory=q.story||0;selection={kind:'prop',id:q.id};panel='selection';refresh();});

// ------------------------------------------------------------------ drawing on the map and in first person
HOOKS.drawGraph.push((g,k)=>{
  if(active!=='iso')return;const list=(project.props||[]).filter(q=>(q.story||0)===activeStory);const conf=new Set(propConflicts().map(c=>c.prop));
  const showRoutes=typeof RW!=='undefined'&&(RW.showMap||RW.on)&&project.routeNet;
  for(const q of list){const missing=!A.connected||A.template(q.asset).status==='missing'||A.template(q.asset).status==='error',sel=selection?.kind==='prop'&&selection.id===q.id;
    if(!(sel||missing||(showRoutes&&q.collision?.solid!==false)||!GLE))continue;
    const fz=C.propFloorZ(project,q),fp=C.propFootprint(q,setupOf(q.asset),null,fz),pts=fp.poly.map(v=>C.isoPoint(project,v,fz+.02));
    g.save();g.lineWidth=(sel?2.2:1.4)*k;g.strokeStyle=conf.has(q.id)&&showRoutes?'#ff5d5d':missing?'#ff4fa8':q.collision?.solid!==false?'#ffad5c':'#9fb6c2';if(q.collision?.solid===false)g.setLineDash([5*k,4*k]);
    g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.stroke();
    if(missing||!GLE){const c=C.isoPoint(project,q,fz+.02);g.fillStyle=missing?'#ff4fa8':'#cfd8dc';g.font=`bold ${10*k}px Segoe UI`;g.textAlign='center';g.fillText((missing&&A.connected?'? ':'')+propName(q),c.x,c.y);}
    g.restore();
    if(sel){const rh=rotHandle(q),c=C.isoPoint(project,q,fz+.02);g.save();g.strokeStyle='#ffd27a';g.lineWidth=1.6*k;g.beginPath();g.moveTo(c.x,c.y);g.lineTo(rh.screen.x,rh.screen.y);g.stroke();g.fillStyle='#ffd27a';g.beginPath();g.arc(rh.screen.x,rh.screen.y,6*k,0,Math.PI*2);g.fill();g.restore();
      for(const p of q.points){const ps=pointScreen(q,p),h=C.propPointHeading(q,p,setupOf(q.asset)),bb=C.basis(h),tip=C.isoPoint(project,{x:ps.plan.x+bb.fx*.45,y:ps.plan.y+bb.fy*.45},ps.plan.z),col=POINT_COLORS[p.type]||'#e0e0e0',s=6*k;
        g.save();g.globalAlpha=p.enabled===false?.4:1;g.strokeStyle=col;g.lineWidth=1.6*k;g.beginPath();g.moveTo(ps.screen.x,ps.screen.y);g.lineTo(tip.x,tip.y);g.stroke();g.fillStyle=col;g.beginPath();g.moveTo(ps.screen.x,ps.screen.y-s);g.lineTo(ps.screen.x+s,ps.screen.y);g.lineTo(ps.screen.x,ps.screen.y+s);g.lineTo(ps.screen.x-s,ps.screen.y);g.closePath();g.fill();
        if(p.id===PZ.selPoint){g.strokeStyle='#fff';g.lineWidth=1.5*k;g.stroke();}g.font=`${9*k}px Segoe UI`;g.fillText(p.name||p.type,ps.screen.x+8*k,ps.screen.y-6*k);g.restore();}}}
  if(PZ.placing&&PZ.ghostPos&&!PZ.ghost){const e=A.entry(PZ.placing),b=dimsBounds(e)||{min:[-.25,0,-.25],max:[.25,.5,.25]},q={...PZ.ghostPos,rotation:PZ.placeRot,scale:[1,1,1],z:0,collision:{shape:'auto'},bounds:b},fz=C.propFloorZ(project,q),fp=C.propFootprint(q,setupOf(PZ.placing),null,fz);
    g.save();g.strokeStyle='#ffd27a';g.setLineDash([4*k,3*k]);g.lineWidth=1.5*k;g.beginPath();fp.poly.map(v=>C.isoPoint(project,v,fz)).forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.stroke();g.restore();}});
function propsFPOverlay(g,v){
  if(mode!=='build'||!v)return;const q=selection?.kind==='prop'?selected():null;if(!q||(q.story||0)!==(v.story||0)&&false)return;
  const k=1/geometry().scale,b=propBounds(q),s=setupOf(q.asset),fz=C.propFloorZ(project,q),P=(x,y,z)=>{const w=C.propToPlan(q,{x,y,z},s,fz);return C.fpPoint(v,{x:w.x,y:w.y,floorZ:0},w.z);};
  const cs=[];for(const x of [b.min[0],b.max[0]])for(const y of [b.min[1],b.max[1]])for(const z of [b.min[2],b.max[2]])cs.push(P(x,y,z));
  const edges=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];g.save();g.strokeStyle='#ffd27acc';g.lineWidth=1.5*k;g.setLineDash([6*k,4*k]);g.beginPath();
  for(const [a,c] of edges){if(!cs[a]||!cs[c])continue;g.moveTo(cs[a].x,cs[a].y);g.lineTo(cs[c].x,cs[c].y);}g.stroke();g.setLineDash([]);
  for(const p of q.points){const at=P(p.x,p.y,p.z);if(!at)continue;const col=POINT_COLORS[p.type]||'#e0e0e0',r=Math.max(3*k,.12*at.scale);g.globalAlpha=p.enabled===false?.4:1;g.fillStyle=col;g.beginPath();g.arc(at.x,at.y,r,0,Math.PI*2);g.fill();g.font=`${10*k}px Segoe UI`;g.fillText(p.name||p.type,at.x+r+3*k,at.y);}g.restore();}
// placed objects shown in the route-walk debug view (outline on the ground, red when on a route)
function propsRouteFP(g,v,k){const conf=new Set(propConflicts().map(c=>c.prop));for(const b of RW.propBoxes||[]){const pts=b.poly.map(p=>C.fpPoint(v,{x:p.x,y:p.y,floorZ:0},0));if(pts.some(p=>!p||p.depth<.4))continue;g.save();g.strokeStyle=conf.has(b.prop)?'#ff5d5dcc':'#ffad5c99';g.lineWidth=1.6*k;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.stroke();g.restore();}}

// first-person walking: is a point inside a solid object (no safety margin)? cached per layout
const PROP_AT={key:null,list:null};
function propAt(story,x,y){const key=RR.navKey(project);if(PROP_AT.key!==key){PROP_AT.key=key;PROP_AT.list=(project.props||[]).map(q=>{const fz=C.propFloorZ(project,q),fp=C.propFootprint(q,setupOf(q.asset),null,fz);return C.propBlocksWalking(q,fp,fz)?{story:q.story||0,poly:fp.poly}:null;}).filter(Boolean);}
  return PROP_AT.list.some(f=>f.story===story&&(C.pointInPoly({x,y},f.poly)||f.poly.some((v,k)=>C.segDist({x,y},v,f.poly[(k+1)%f.poly.length])<.12)));}
// ------------------------------------------------------------------ project-level notices and test hooks
HOOKS.top.push(()=>{const n=project.props?.length||0;if(!n||A.connected){PZ.lastMissingNote='';return;}const key=project.name+'|'+n;if(PZ.lastMissingNote===key)return;PZ.lastMissingNote=key;
  setTimeout(()=>toast(`This project has ${n} placed 3D objects. Open the Library tab and connect the asset library to see them (they show as boxes until then).`,8000),400);});
HOOKS.messages.push(()=>PZ.placing?{select:'Placing a 3D object: click a floor. [ ] turns it 15°, Shift keeps placing, Esc stops.'}:selection?.kind==='prop'?{select:'3D object selected: drag to move, drag the round handle to turn, [ ] turns 15°, Delete removes, Ctrl+D duplicates.'}:null);
EXT.props={PZ,place:(id,pt)=>{PZ.placing=id;placeAt(pt);PZ.placing=null;removeGhost();tool='select';},startPlacing,stopPlacing,duplicate:duplicateProp,replace:replaceProp,conflicts:propConflicts,saveLook:savePropLook,addPoint,quickPalette,recolorOnProp,
  buildLooksExport,mergeLooks,libraryImage,libTextureClick,hitProp,propScreenHull,fillPropBounds,propAt,select:id=>{const q=(project.props||[]).find(p=>p.id===id);if(q){activeStory=q.story||0;selection={kind:'prop',id};panel='selection';refresh();}}};
