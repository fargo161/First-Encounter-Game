/* Pure project, transform and graph utilities. No renderer or external dependency. */
(function(root, factory) {
  const core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  if (root) root.RCLegacyCore = core;
})(typeof window !== 'undefined' ? window : null, function() {
  'use strict';
  const TYPES = ['cover','exposed','movement'];
  const uid = p => p + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,9);
  const clone = v => JSON.parse(JSON.stringify(v));
  const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
  function newProject() {
    return {format:'trapstar-room-creator',version:1,name:'Apartment 305',layoutId:'layout',startNodeId:null,
      scenes:[{id:'layout',name:'Room layout',kind:'layout',width:1440,height:1080,backgroundId:'shell_iso',backgroundFit:'contain',backgroundColor:'#0b0d14',objects:[]},
        {id:'view_1',name:'View 01',kind:'view',width:1440,height:900,backgroundId:'shell_view',backgroundFit:'cover',backgroundColor:'#0b0d14',objects:[]}],nodes:[],links:[]};
  }
  function createLayer(asset,x,y,width) {
    const w=width || asset.defaultWidth || 280;
    return {id:uid('layer'),assetId:asset.id,name:asset.name,x,y,w,h:w*asset.height/asset.width,rotation:0,opacity:1,flipX:false,flipY:false,visible:true,locked:false,blocks:!!asset.blocker,keepAspect:true};
  }
  function localPoint(o,x,y) {
    const r=-o.rotation*Math.PI/180, dx=x-o.x,dy=y-o.y;
    let xx=dx*Math.cos(r)-dy*Math.sin(r),yy=dx*Math.sin(r)+dy*Math.cos(r);
    if(o.flipX)xx=-xx;if(o.flipY)yy=-yy;
    return {u:xx/o.w+.5,v:yy/o.h+.5};
  }
  function worldPoint(o,u,v) {
    let x=(u-.5)*o.w*(o.flipX?-1:1),y=(v-.5)*o.h*(o.flipY?-1:1),r=o.rotation*Math.PI/180;
    return {x:o.x+x*Math.cos(r)-y*Math.sin(r),y:o.y+x*Math.sin(r)+y*Math.cos(r)};
  }
  function neighbors(project,id) {
    const ids=[];
    for(const l of project.links) {if(l.a===id)ids.push(l.b);else if(l.b===id && l.bidirectional)ids.push(l.a);}
    return [...new Set(ids)].map(n=>project.nodes.find(x=>x.id===n)).filter(Boolean);
  }
  function reachable(project,start) {
    if(!project.nodes.some(n=>n.id===start))return [];
    const seen=new Set([start]),q=[start];
    while(q.length){for(const n of neighbors(project,q.shift()))if(!seen.has(n.id)){seen.add(n.id);q.push(n.id);}}
    return [...seen];
  }
  function validateBundle(input) {
    if(!input || typeof input!=='object')throw Error('This file is not a room project.');
    const p=clone(input.project || input), assets=clone(input.assets || []);
    if(p.format!=='trapstar-room-creator' || p.version!==1)throw Error('Choose a Room Creator v0.1 project (.room.json).');
    if(!Array.isArray(p.scenes)||!p.scenes.length||p.scenes.length>100)throw Error('A project needs 1–100 compositions.');
    if(!Array.isArray(p.nodes)||p.nodes.length>500||!Array.isArray(p.links)||p.links.length>2000)throw Error('Invalid node graph.');
    if(!Array.isArray(assets)||assets.length>500)throw Error('Invalid asset library.');
    const text=(v,n=160)=>String(v==null?'':v).slice(0,n);
    const number=(v,min,max,label)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error('Invalid '+label+'.');return v;};
    const id=(v)=>{if(typeof v!=='string'||!/^[-a-zA-Z0-9_]{1,100}$/.test(v))throw Error('An item has an invalid ID.');return v;};
    const unique=(arr,what)=>{const s=new Set();for(const a of arr){id(a.id);if(s.has(a.id))throw Error('Duplicate '+what+' ID.');s.add(a.id);}return s;};
    const assetIds=unique(assets,'asset');let total=0;
    for(const a of assets){
      a.name=text(a.name);a.category=['backgrounds','furniture','kitchen','props','cover','imported'].includes(a.category)?a.category:'imported';
      a.view=['iso','view','both'].includes(a.view)?a.view:'both';number(a.width,1,8192,'asset width');number(a.height,1,8192,'asset height');
      if(typeof a.src!=='string'||!/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(a.src))throw Error('Asset images must be embedded PNG, JPEG or WebP data.');
      total+=a.src.length;if(total>125*1024*1024)throw Error('Embedded artwork exceeds the 125 MB project limit.');
      a.defaultWidth=typeof a.defaultWidth==='number'?clamp(a.defaultWidth,1,8000):280;a.blocker=!!a.blocker;
    }
    const sceneIds=unique(p.scenes,'view');let layouts=0;const objectIds=new Set();
    for(const s of p.scenes){
      s.name=text(s.name);if(!['layout','view'].includes(s.kind))throw Error('Invalid composition type.');if(s.kind==='layout')layouts++;
      number(s.width,64,8192,'canvas width');number(s.height,64,8192,'canvas height');
      if(s.backgroundId!==null && !assetIds.has(s.backgroundId))throw Error('A background image is missing from the project.');
      s.backgroundFit=['cover','contain','stretch'].includes(s.backgroundFit)?s.backgroundFit:'contain';
      s.backgroundColor=/^#[0-9a-fA-F]{6}$/.test(s.backgroundColor)?s.backgroundColor:'#0b0d14';
      if(!Array.isArray(s.objects)||s.objects.length>1000)throw Error('Invalid layer list.');
      for(const o of s.objects){
        id(o.id);if(objectIds.has(o.id))throw Error('Duplicate layer ID.');objectIds.add(o.id);
        if(!assetIds.has(o.assetId))throw Error('Artwork is missing for '+text(o.name)+'.');
        o.name=text(o.name);number(o.x,-50000,50000,'layer X');number(o.y,-50000,50000,'layer Y');
        number(o.w,1,50000,'layer width');number(o.h,1,50000,'layer height');number(o.rotation,-36000,36000,'rotation');number(o.opacity,0,1,'opacity');
        for(const k of ['flipX','flipY','locked','blocks'])o[k]=!!o[k];o.visible=o.visible!==false;o.keepAspect=o.keepAspect!==false;
      }
    }
    if(layouts!==1 || !p.scenes.some(s=>s.id===p.layoutId&&s.kind==='layout'))throw Error('Exactly one room layout is required.');
    const nodeIds=unique(p.nodes,'node');
    for(const n of p.nodes){
      if(!TYPES.includes(n.type))throw Error('Invalid node type.');n.name=text(n.name);n.notes=text(n.notes,1000);
      number(n.x,-50000,50000,'node X');number(n.y,-50000,50000,'node Y');number(n.facing,-36000,36000,'node facing');
      if(n.viewId!==null&&!p.scenes.some(s=>s.id===n.viewId&&s.kind==='view'))throw Error('A node points to a missing first-person view.');
    }
    unique(p.links,'link');for(const l of p.links){if(!nodeIds.has(l.a)||!nodeIds.has(l.b)||l.a===l.b)throw Error('A route points to an invalid node.');l.bidirectional=l.bidirectional!==false;}
    if(p.startNodeId!==null&&!nodeIds.has(p.startNodeId))throw Error('The start node no longer exists.');p.name=text(p.name)||'Untitled room';
    return {project:p,assets};
  }
  return {TYPES,uid,clone,clamp,newProject,createLayer,localPoint,worldPoint,neighbors,reachable,validateBundle};
});
