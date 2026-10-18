/* ===================== 0.13 · ui-sky.js =====================
   The Sky tab. The sky is what you see behind everything in first person: above streets, through
   windows and open walls. It is either a colour gradient or a picture wrapped all the way around
   you like the inside of a drum (a "panorama"). Sliders change the picture live; letting go of a
   slider makes one Undo step. Distance haze fades far-away walls toward the sky colour. */
let skyCommitTimer=0,skyLive=null,skyPreviewQueued=0,skyYaw=0,skyPitch=0,skyFileInput=null,skyDrag=null;
function skyNow(){return C.normalizeSky(project.sky);}
function skyRange(label,key,value,min,max,step,{haze=false,len=false,suffix=''}={}){
  const attr=haze?'data-sky-haze':'data-sky',v=len?fmt(value,3):value,lo=len?fmt(min,3):min,hi=len?fmt(max,3):max,u=len?' ('+unit()+')':suffix?' ('+suffix+')':'';
  return `<div class="range-field"><label>${esc(label)}${u}</label><div class="range-controls"><input type="range" ${attr}="${key}" ${len?'data-len="1"':''} min="${lo}" max="${hi}" step="${step}" value="${v}" aria-label="${esc(label)} slider"><input type="number" ${attr}="${key}" ${len?'data-len="1"':''} min="${lo}" max="${hi}" step="${step}" value="${v}" aria-label="${esc(label)} value"></div></div>`;
}
function skyColor(label,key,value,haze=false){return `<label>${esc(label)}<input type="color" ${haze?'data-sky-haze':'data-sky'}="${key}" value="${esc(value)}"></label>`;}
function skyCheck(label,key,value,haze=false,title=''){return `<label class="check" ${title?`title="${esc(title)}"`:''}><input type="checkbox" ${haze?'data-sky-haze':'data-sky'}="${key}" ${value?'checked':''}>${esc(label)}</label>`;}
function skyPane(){
  const s=skyNow(),hz=s.haze,a=s.assetId?catalog.get(s.assetId):null,imgs=[...catalog.values()];
  const presets=Object.entries(C.SKY_PRESETS).map(([k,p])=>`<button data-sky-preset="${k}" class="${s.mode==='gradient'&&s.top===p.top&&s.horizon===p.horizon&&s.bottom===p.bottom?'active':''}" style="background:linear-gradient(180deg,${p.top} 0%,${p.horizon} 62%,${p.bottom} 100%)" title="${esc(p.name)}">${esc(p.name)}</button>`).join('');
  const gradient=`<div class="form-grid">${skyColor('Top of the sky','top',s.top)}${skyColor('At the horizon','horizon',s.horizon)}${skyColor('Below the horizon','bottom',s.bottom)}</div>${skyRange('Gradient shape','curve',s.curve,.1,4,.01)}<p class="subtle">Lower numbers spread the horizon colour higher up the sky.</p>`;
  let body;
  if(s.mode==='image'&&a){
    body=`<div class="material-actions"><button data-sky-act="import" class="primary">Replace picture…</button><button data-sky-act="wrap" title="One copy all the way around, normal height, no tilt">Wrap once around</button></div>
      <label style="margin-top:8px">Picture<select data-sky="assetId">${imgs.map(x=>`<option value="${x.id}" ${x.id===s.assetId?'selected':''}>${esc(x.name)} · ${x.width}×${x.height}</option>`).join('')}</select></label>
      <div class="sky-image-pick" data-sky-pick title="Click where the ground meets the sky in this picture" style="margin-top:8px"><img src="${a.src}" alt="Sky picture"><div class="hline" style="top:${s.horizonV*100}%"></div><span class="hlabel" style="top:${s.horizonV*100}%">horizon line</span></div>
      <p class="editor-note">Click the picture where its horizon is. That line is placed at eye level, so a skyline sits on the ground instead of floating.</p>
      ${skyRange('Turn around','rotation',C.round(s.rotation,1),-180,180,1,{suffix:'°'})}${skyRange('Copies around the circle','repeat',s.repeat,1,8,1)}
      ${skyCheck('Mirror every other copy (hides the join)','mirror',s.mirror)}${skyCheck('Flip left–right','flipX',s.flipX)}
      ${skyRange('Horizon line in the picture','horizonV',s.horizonV,0,1,.005)}${skyRange('Picture height','size',s.size,.2,4,.01)}${skyRange('Raise / lower','lift',s.lift,-30,30,.5,{suffix:'°'})}
      ${skyRange('Soften top edge','fadeTop',s.fadeTop,0,1,.01)}${skyRange('Soften bottom edge','fadeBottom',s.fadeBottom,0,1,.01)}
      ${skyRange('Brightness','brightness',s.brightness,.1,3,.01)}${skyRange('Colour strength','saturation',s.saturation,0,2.5,.01)}
      <div class="form-grid">${skyColor('Tint colour','tint',s.tint)}</div>${skyRange('Tint strength','tintStrength',s.tintStrength,0,1,.01)}
      <details class="details"><summary>Gradient behind the picture</summary><p class="subtle">Shows above and below the picture and wherever its edges are softened.</p>${gradient}</details>`;
  }else body=`${gradient}<button data-sky-act="import" class="block" style="margin-top:8px">Use a picture (panorama) instead…</button><p class="subtle">Any wide photo works. Very wide pictures (3 : 1 or wider) wrap around once without looking stretched.</p>`;
  return `<div class="section"><div class="row"><h2 class="grow">Sky</h2><span class="badge">${s.mode==='image'&&a?'PICTURE':'GRADIENT'}</span></div><p>Shows behind everything in first person — above the streets and through windows and open walls.</p><h3>Starting looks</h3><div class="sky-swatches">${presets}</div></div>
    <div class="section"><h3>Preview · drag to look around</h3><canvas class="sky-preview" id="skyPreview" width="480" height="270" aria-label="Sky preview"></canvas><div class="button-row"><button data-sky-act="open-fp">Look in first person</button><button data-sky-act="reset">Reset sky…</button></div></div>
    <div class="section"><h3>Sky type</h3><div class="segmented" style="margin:4px 0 10px"><button data-sky-mode="gradient" class="${s.mode!=='image'||!a?'active':''}">Colour gradient</button><button data-sky-mode="image" class="${s.mode==='image'&&a?'active':''}">Picture</button></div>${body}</div>
    <div class="section"><h3>Distance haze</h3>${skyCheck('Fade far-away walls into the sky','enabled',hz.enabled,true,'Also called fog. Makes big outdoor maps feel deeper.')}
      <label class="check"><input type="checkbox" data-sky-hazeauto ${hz.color===null?'checked':''}>Use the horizon colour</label>${hz.color!==null?`<div class="form-grid">${skyColor('Haze colour','color',hz.color,true)}</div>`:''}
      ${skyRange('Haze starts at','start',hz.start,0,300,.5,{haze:true,len:true})}${skyRange('Fully hazy at','end',hz.end,1,800,1,{haze:true,len:true})}${skyRange('Strength','strength',hz.strength,0,1,.01,{haze:true})}
      <p class="subtle">Nothing nearer than “starts at” is touched. At “fully hazy” walls take on the strength you set.</p></div>`;
}
// ------------------------------------------------------------------ live edits (no history) and one Undo per release
function skyTargetValue(el){
  const isHaze=el.hasAttribute('data-sky-haze'),key=isHaze?el.dataset.skyHaze:el.dataset.sky;let v;
  if(el.type==='checkbox')v=el.checked;else if(el.type==='color'||el.tagName==='SELECT')v=el.value;
  else{v=Number(el.value);if(!Number.isFinite(v))return null;if(el.min!=='')v=Math.max(Number(el.min),v);if(el.max!=='')v=Math.min(Number(el.max),v);if(el.dataset.len)v=parseLength(v);}
  if(key==='assetId')v=v||null;if(key==='repeat')v=Math.round(v);return {isHaze,key,v};
}
function skyApply(el,commit){
  if(mode==='test')return;if(fpLive)commitLive();const t=skyTargetValue(el);if(!t)return;if(!skyLive)skyLive={before:capture()};
  project.sky=C.normalizeSky(project.sky);(t.isHaze?project.sky.haze:project.sky)[t.key]=t.v;if(t.key==='assetId'&&t.v)project.sky.mode='image';
  const attr=t.isHaze?'data-sky-haze':'data-sky';document.querySelectorAll(`[${attr}="${t.key}"]`).forEach(o=>{if(o!==el&&o.type!=='checkbox'&&o.tagName!=='SELECT')o.value=el.value;});
  if(t.key==='horizonV')document.querySelectorAll('.sky-image-pick .hline,.sky-image-pick .hlabel').forEach(o=>o.style.top=t.v*100+'%');
  liveRev++;drawSoon();queueSkyPreview();
  if(commit){clearTimeout(skyCommitTimer);if(['mode','assetId','enabled'].includes(t.key))skyCommit(true);else skyCommitTimer=setTimeout(()=>skyCommit(false),350);} // key presses on a slider become one Undo step
}
function skyCommit(rerender=false){
  clearTimeout(skyCommitTimer);const L=skyLive;skyLive=null;if(!L)return;
  try{const valid=C.validateBundle({project,assets:[...catalog.values()]});project=valid.project;if(JSON.stringify(L.before.project.sky)!==JSON.stringify(project.sky))pushHistory(L.before,'Edit sky');}
  catch(e){project=L.before.project;toast(e.message,6000);rerender=true;}
  liveRev++;updateTop();if(rerender)renderLeft();drawSoon();queueSkyPreview();
}
document.addEventListener('input',e=>{const el=e.target;if(el.matches?.('[data-sky],[data-sky-haze]')&&el.tagName!=='SELECT'&&el.type!=='checkbox')skyApply(el,false);});
document.addEventListener('change',e=>{const el=e.target;
  if(el.matches?.('[data-sky],[data-sky-haze]')){skyApply(el,true);return;}
  if(el.matches?.('[data-sky-hazeauto]')){const s=skyNow();mutate(()=>{project.sky=C.normalizeSky(project.sky);project.sky.haze.color=el.checked?null:s.horizon;},el.checked?'Haze uses horizon colour':'Custom haze colour');}
});
function setSky(changes,label){return mutate(()=>{const s=C.normalizeSky(project.sky);Object.assign(s,changes);project.sky=s;},label);}
function pickSkyImage(){
  if(!skyFileInput){skyFileInput=document.createElement('input');skyFileInput.type='file';skyFileInput.accept='image/png,image/jpeg,image/webp';skyFileInput.style.display='none';document.body.append(skyFileInput);skyFileInput.onchange=()=>{const f=skyFileInput.files[0];skyFileInput.value='';if(f)importSkyImage(f);};}
  skyFileInput.click();
}
async function importSkyImage(file){
  const token=operation;
  try{if(catalog.size>=500)throw Error('The image library is full (500 images).');const {asset,image}=await readImage(file),total=[...catalog.values()].reduce((s,a)=>s+a.src.length,0)+asset.src.length;
    if(total>125*1024*1024)throw Error('The embedded library would exceed 125 MB.');if(token!==operation)throw Error('The project changed during import. Import again.');asset.category='sky';
    const wide=asset.width/asset.height;
    if(mutate(()=>{catalog.set(asset.id,asset);R.images.set(asset.id,image);const s=C.normalizeSky(project.sky);Object.assign(s,{mode:'image',assetId:asset.id,horizonV:.62,repeat:wide>=3?1:2,mirror:wide<3,rotation:0,size:1,lift:0});project.sky=s;pane='sky';},'Import sky picture'))
      toast('Sky picture added. In the Sky tab, click the picture where its horizon is so the skyline sits at eye level.',8000);}
  catch(e){toast('Import stopped: '+e.message,8000);}
}
HOOKS.click.push((e,b)=>{
  if(b.dataset.skyPreset){const p=C.SKY_PRESETS[b.dataset.skyPreset];if(!p)return true;const wasImage=skyNow().mode==='image';if(setSky({mode:'gradient',top:p.top,horizon:p.horizon,bottom:p.bottom,curve:p.curve},'Sky: '+p.name)&&wasImage)toast('Switched to a colour gradient. Your picture is kept — choose “Picture” to use it again.',6000);return true;}
  if(b.dataset.skyMode){const want=b.dataset.skyMode,s=skyNow();
    if(want==='gradient'){setSky({mode:'gradient'},'Sky: colour gradient');return true;}
    if(s.assetId&&catalog.has(s.assetId)){setSky({mode:'image'},'Sky: picture');return true;}
    // best guess at a panorama: wide, reasonably tall, and named or filed as a sky / matte / skyline picture
    const score=a=>(/sky|matte|pano|horizon|skyline/i.test(a.name+' '+(a.category||''))?4:0)+(a.height>=500?2:a.height>=300?1:-4)+Math.min(2,a.width/a.height/2);
    const pano=[...catalog.values()].filter(a=>a.width/a.height>=2&&a.width/a.height<=10&&a.height>=200).sort((x,y)=>score(y)-score(x))[0];
    if(pano){const wide=pano.width/pano.height;setSky({mode:'image',assetId:pano.id,repeat:wide>=3?1:2,mirror:wide<3},'Sky: picture');toast('Using “'+pano.name+'”, the widest picture in your library. Pick another in the list, or Replace picture.',7000);}
    else pickSkyImage();return true;}
  const a=b.dataset.skyAct;if(!a)return false;
  if(a==='import')pickSkyImage();
  else if(a==='wrap')setSky({repeat:1,size:1,mirror:false,lift:0,rotation:0},'Wrap sky once around');
  else if(a==='reset')ask('Reset the sky?','This returns to the plain editor gradient and turns haze off. Your sky picture stays in the image library. Undo restores the current sky.',()=>mutate(()=>{project.sky=C.defaultSky();},'Reset sky'),'Reset sky');
  else if(a==='open-fp'){const v=currentView();if(v)selectView(v.id,{open:true});else if(startFreeCam())enterFreeCam();}
  return true;
});
document.addEventListener('click',e=>{const pick=e.target.closest?.('[data-sky-pick]');if(!pick||mode==='test')return;const r=(pick.querySelector('img')||pick).getBoundingClientRect(),v=C.clamp((e.clientY-r.top)/r.height,0,1);setSky({horizonV:C.round(v,3)},'Set sky horizon line');});
// ------------------------------------------------------------------ preview you can drag to look around
function skyPreviewCam(){
  const base=currentView()||freeCam;let v;
  if(base)v={...base};else{const b=C.bounds(project),c={x:b.x+b.width/2,y:b.y+b.length/2},pt=nearestFloor(c,0)||c;v={x:pt.x,y:pt.y,story:0,floorZ:C.storyElevation(project,0),facing:0,fov:80,eyeHeight:1.6,horizon:.42,width:1440,height:900};}
  v.facing=(v.facing||0)+skyYaw;v.horizon=C.clamp((v.horizon??.42)+skyPitch,.1,.9);v.fov=Math.max(v.fov||72,75);return v;
}
function queueSkyPreview(){if(skyPreviewQueued||pane!=='sky'||!$('skyPreview'))return;skyPreviewQueued=requestAnimationFrame(()=>{skyPreviewQueued=0;drawSkyPreview();});}
function drawSkyPreview(){
  const c=$('skyPreview');if(!c)return;
  if(GLE){try{GLE.renderFPToCanvas(project,GLE.camFromView(project,skyPreviewCam(),{aspect:c.width/c.height}),c.width,c.height,c);}catch(e){glFailed(e);}}
  else{const g=c.getContext('2d'),s=skyNow(),gr=g.createLinearGradient(0,0,0,c.height);gr.addColorStop(0,s.top);gr.addColorStop(.62,s.horizon);gr.addColorStop(1,s.bottom);g.fillStyle=gr;g.fillRect(0,0,c.width,c.height);g.fillStyle='#fff';g.font='12px Segoe UI';g.fillText('Full preview needs the graphics-card renderer.',12,22);}
}
HOOKS.leftRender.push(el=>{
  const c=el.querySelector('#skyPreview');if(!c)return;queueSkyPreview();
  c.addEventListener('pointerdown',e=>{c.setPointerCapture(e.pointerId);skyDrag={x:e.clientX,y:e.clientY,yaw:skyYaw,pitch:skyPitch};c.style.cursor='grabbing';});
  c.addEventListener('pointermove',e=>{if(!skyDrag)return;const r=c.getBoundingClientRect(),fov=skyPreviewCam().fov;skyYaw=skyDrag.yaw-(e.clientX-skyDrag.x)*fov/r.width;skyPitch=C.clamp(skyDrag.pitch+(e.clientY-skyDrag.y)/r.height,-.3,.45);queueSkyPreview();});
  const end=()=>{skyDrag=null;c.style.cursor='';};c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
});
EXT.sky={skyPane,setSky,importSkyImage,get live(){return skyLive;}};
