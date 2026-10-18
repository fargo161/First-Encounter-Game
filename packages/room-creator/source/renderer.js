/* Room Creator 0.10 — Canvas 2D renderer.
   The first-person architecture is drawn from 2D wall-line intersections and
   vertically arranged screen bands. Floors and pictures share floor-plan
   coordinates. No mesh or 3D scene is constructed. */
(function(){'use strict';
const C=window.RCCore;
const rgb=hex=>[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];
const pack=(r,g,b)=>((255<<24)|((C.clamp(b,0,255)|0)<<16)|((C.clamp(g,0,255)|0)<<8)|(C.clamp(r,0,255)|0))>>>0;
const unpack=v=>[v&255,(v>>>8)&255,(v>>>16)&255];
const makeCanvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
const inPoly=(q,pts)=>{let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a.y>q.y)!==(b.y>q.y)&&q.x<(b.x-a.x)*(q.y-a.y)/(b.y-a.y)+a.x)inside=!inside;}return inside;};
class Renderer {
  constructor(catalog){this.catalog=catalog;this.images=new Map();this.archCache=new Map();this.fullCache=new Map();this.isoWalls=[];this.isoObjects=[];this.isoFloors=[];this.textures=new Map();this.matteTextures=new Map();this.isoMatteCache=new Map();this.wallPaintCache=new Map();this.objectTintCache=new Map();}
  clear(){this.archCache.clear();this.fullCache.clear();this.isoMatteCache.clear();this.wallPaintCache.clear();this.objectTintCache.clear();}
  async load(){await Promise.all([...this.catalog.values()].map(a=>new Promise((resolve,reject)=>{if(this.images.has(a.id))return resolve();const im=new Image();im.onload=()=>{this.images.set(a.id,im);resolve();};im.onerror=()=>reject(Error('Cannot decode '+a.name));im.src=a.src;})));this.clear();}
  texture(id){if(!id)return null;if(this.textures.has(id))return this.textures.get(id);const im=this.images.get(id);if(!im)return null;const w=Math.min(512,im.width),h=Math.max(1,Math.round(im.height*w/im.width));const c=makeCanvas(w,h),g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0,w,h);const t={w,h,pixels:g.getImageData(0,0,w,h).data};this.textures.set(id,t);return t;}
  backdrop(spec){
    if(!spec?.assetId)return null;
    const id=spec.assetId,im=this.images.get(id);if(!im)return null;
    const old=this.matteTextures.get(id);if(old?.image===im)return old;
    const factor=Math.min(1,2048/Math.max(im.width,im.height));
    const w=Math.max(1,Math.round(im.width*factor)),h=Math.max(1,Math.round(im.height*factor));
    const canvas=makeCanvas(w,h),g=canvas.getContext('2d',{willReadFrequently:true});
    g.drawImage(im,0,0,w,h);
    const result={w,h,pixels:g.getImageData(0,0,w,h).data,image:im};
    this.matteTextures.set(id,result);return result;
  }
  sampleBackdrop(spec,frame,xNorm,yNorm,tex=this.backdrop(spec)){
    if(!tex||(spec.alpha??1)<=0)return null;
    const uv=C.backdropUV(spec,frame,xNorm,yNorm,tex.w,tex.h);if(!uv)return null;
    const xx=C.clamp(Math.floor(uv.u*tex.w),0,tex.w-1),yy=C.clamp(Math.floor(uv.v*tex.h),0,tex.h-1),i=(yy*tex.w+xx)*4;
    const alpha=(spec.alpha??1)*tex.pixels[i+3]/255;
    return alpha>0?{rgb:[tex.pixels[i],tex.pixels[i+1],tex.pixels[i+2]],alpha}:null;
  }
  prepareStyle(s,space={}){s={...C.SURFACE_EXTRA,...s};return {...s,space,rgb:rgb(s.color),secondaryRGB:rgb(s.secondary),baseRGB:rgb(s.baseColor),capRGB:rgb(s.capColor),cos:Math.cos(C.rad(s.angle)),sin:Math.sin(C.rad(s.angle)),hueCos:Math.cos(C.rad(s.hue)),hueSin:Math.sin(C.rad(s.hue)),texture:this.texture(s.textureId)};}
  wallSpace(p,w,owner){const l=C.wallBase(p,owner);return {wall:true,origin:l.start,w:l.end-l.start,h:C.wallCap(p,w)};}
  adjustColor(col,s){
    let [r,g,b]=col;const y=.299*r+.587*g+.114*b;
    if(s.hue){const i=.596*r-.275*g-.321*b,q=.212*r-.523*g+.311*b,ii=i*s.hueCos-q*s.hueSin,qq=i*s.hueSin+q*s.hueCos;r=y+.956*ii+.621*qq;g=y-.272*ii-.647*qq;b=y-1.106*ii+1.703*qq;}
    const sat=s.saturation??1,ct=s.contrast??1,br=s.brightness??1;
    return [r,g,b].map(c=>((y+(c-y)*sat-127.5)*ct+127.5)*br);
  }
  prepareRoom(p,r){return {room:r,wall:this.prepareStyle(r.wall),floor:this.prepareStyle(r.floor,{w:r.width,h:r.length}),ceiling:this.prepareStyle(r.ceiling,{w:r.width,h:r.length}),lightRGB:rgb(r.light.tint).map(x=>x/255),lights:p.lights.filter(l=>l.roomId===r.id&&l.enabled).map(l=>({...l,rgb:rgb(l.color).map(x=>x/255)}))};}
  factors(r,x,y,dim=1){const a=r.room.light,t=a.tintStrength,b=a.brightness*Math.pow(2,a.exposure||0);let rr=b*(1-t+t*r.lightRGB[0]),gg=b*(1-t+t*r.lightRGB[1]),bb=b*(1-t+t*r.lightRGB[2]);for(const l of r.lights){const d=Math.hypot(x-l.x,y-l.y)/l.radius;if(d<1){const f=Math.pow(1-d,l.falloff??2)*l.intensity;rr+=f*l.rgb[0];gg+=f*l.rgb[1];bb+=f*l.rgb[2];}}return [rr*dim,gg*dim,bb*dim];}
  sample(s,u,v,r,x,y,dim=1,grid=0){
    const space=s.space||{},wall=!!space.wall,z=v,local=s.coordinateMode==='local';
    const a=local&&wall?u-(space.origin||0):u,b=local&&wall?(space.h||2.7)-v:v;
    const uu=a+(s.offsetX||0),vv=b+(s.offsetY||0),U=uu*s.cos-vv*s.sin,V=uu*s.sin+vv*s.cos;
    const ts=s.tileSize,ty=s.tileSizeY??ts,mod=(n,z)=>((n%z)+z)%z,j=s.jointWidth??.015;
    let col=s.rgb,m=1;
    if(s.finish==='image'&&s.texture){
      const t=s.texture;let u,v;
      if(s.mapping==='stretch'){u=U/(space.w||ts);v=V/(space.h||ty);}
      else if(s.mapping==='mirror'){const f=n=>{const a=mod(n,2);return a<=1?a:2-a;};u=f(U/ts);v=f(V/ty);}
      else {u=mod(U,ts)/ts;v=mod(V,ty)/ty;}
      if(s.flipX)u=1-u;if(s.flipY)v=1-v;
      let alpha=0,tc=s.rgb;
      if(u>=0&&u<=1&&v>=0&&v<=1){const tx=C.clamp(Math.floor(u*t.w),0,t.w-1),yy=C.clamp(Math.floor(v*t.h),0,t.h-1),i=(yy*t.w+tx)*4;alpha=(s.textureOpacity??1)*t.pixels[i+3]/255;const tint=s.tintStrength||0;tc=[t.pixels[i],t.pixels[i+1],t.pixels[i+2]].map((c,k)=>c*(1-tint+tint*s.rgb[k]/255));}
      col=col.map((c,k)=>c*(1-alpha)+tc[k]*alpha);
    }
    else if(s.finish==='wood'){const row=Math.floor(V/(ty*.24)),seam=mod(V,ty*.24),joint=mod(U+(row%3)*ts*.37,ts*1.8);m=seam<j||joint<j?.55:.88+(Math.sin(V*230+Math.sin(U*4)*2)*.025)+mod(row*37,7)*.024;}
    else if(s.finish==='tile'){m=mod(U,ts)<j||mod(V,ty)<j?.53:(mod(Math.floor(U/ts)+Math.floor(V/ty),2)===0?1:.92);}
    else if(s.finish==='brick'){const row=Math.floor(V/(ty*.32));m=mod(U+mod(row,2)*ts*.5,ts)<j||mod(V,ty*.32)<j?.55:.83+mod(row*17+Math.floor(U/ts)*7,5)*.035;}
    else if(s.finish==='concrete'){const h=((Math.floor(U*73)*374761393)^(Math.floor(V*73)*668265263))>>>0;m=.93+(h%100)*.001;}
    else if(s.finish==='checker'){if(mod(Math.floor(U/ts)+Math.floor(V/ty),2))col=s.secondaryRGB;m=mod(U,ts)<j||mod(V,ty)<j?.65:1;}
    else if(s.finish==='wallpaper'){if(mod(U,ts)<ts*.30)col=s.secondaryRGB;m=.96+.025*Math.sin(V*200);}
    else if(s.finish==='carpet'){const h=((Math.floor(U*150)*374761393)^(Math.floor(V*150)*668265263))>>>0;m=.83+(h%100)*.002;}
    else if(s.finish==='terrazzo'){const h=((Math.floor(U*28/ts)*374761393)^(Math.floor(V*28/ty)*668265263))>>>0;if(h%13<3)col=s.secondaryRGB;m=.85+(h%100)*.0015;}
    if(wall&&z<(s.baseHeight||0)){col=s.baseRGB;m=1;}
    if(wall&&z>(space.h||2.7)-(s.capHeight||0)){col=s.capRGB;m=1;}
    if(s.wear){const h=((Math.floor(U*23)*374761393)^(Math.floor(V*23)*668265263))>>>0,stain=.5+.5*Math.sin(U*2.9+Math.sin(V*3.1));m*=1-s.wear*(.24*stain+.22*(h%100)/100);}
    col=this.adjustColor(col,s);
    const f=this.factors(r,x,y,dim);let rr=col[0]*m*f[0],gg=col[1]*m*f[1],bb=col[2]*m*f[2];
    const l=r.room.light,sat=l.saturation??1,ct=l.contrast??1,Y=.299*rr+.587*gg+.114*bb;
    rr=(Y+(rr-Y)*sat-127.5)*ct+127.5;gg=(Y+(gg-Y)*sat-127.5)*ct+127.5;bb=(Y+(bb-Y)*sat-127.5)*ct+127.5;
    if(grid&&(mod(u,grid)<.009||mod(v,grid)<.009)){rr=rr*.6+150*.4;gg=gg*.6+160*.4;bb=bb*.6+170*.4;}
    return pack(rr,gg,bb);
  }
  doorColor(p,o,pos,z,room,dim=1){
    const l=C.openingLine(p,o),leaves=o.leaves??1,f=C.openingGeometry(o),usable=o.width-2*f.frame;
    const u=C.clamp((pos-l.start-f.frame)/Math.max(.1,usable),0,.999999),leaf=Math.floor(u*leaves),t=u*leaves-leaf;
    const wx=C.wallPoint(l,pos),st=this.prepareStyle({...C.surface(o.panelColor,o.textureId?'image':'wood'),textureId:o.textureId,mapping:'stretch'}, {w:1,h:o.height});
    let c=unpack(this.sample(st,t,o.height-(z-o.bottom),room,wx.x,wx.y,dim));
    const zz=(z-o.bottom)/o.height,style=o.doorStyle||'panel';
    const seam=leaves===2&&Math.abs(u-.5)<.007;
    const edge=style==='panel'&&((t>.11&&t<.89&&[.18,.52,.87].some(a=>Math.abs(zz-a)<.010))||((Math.abs(t-.12)<.009||Math.abs(t-.88)<.009)&&zz>.18&&zz<.87));
    if(seam||edge||(style==='slatted'&&zz>.12&&zz<.9&&t>.12&&t<.88&&((zz*26)%1)<.13))c=c.map(x=>x*(seam?.35:.65));
    const hx=leaves===2?(leaf===0?.84:.16):.84;
    if(Math.abs(t-hx)<.03&&Math.abs(z-o.bottom-Math.min(1.02,o.height*.48))<.023)c=rgb(o.handleColor||'#c3a672');
    return pack(...c);
  }
  architecture(p,v,grid=false,width=960){
    const key=JSON.stringify([p.rooms,p.floorSections,p.ceilingCuts,p.ceilingPatches,p.pillars,p.partitions,p.openings,p.lights,p.wallHeight,p.storyHeight,grid,p.grid,v.x,v.y,v.story,v.floorZ,v.facing,v.fov,v.eyeHeight,v.width,v.height,width]);
    if(this.archCache.has(key))return this.archCache.get(key);
    const W=width,H=Math.round(v.height/v.width*W),sv={...v,width:W,height:H},k=C.lens(sv),b=C.basis(sv.facing),count=W*H;
    const data=new ImageData(W,H),pixels=new Uint32Array(data.data.buffer),depth=new Float32Array(count),pick=new Uint16Array(count);depth.fill(Infinity);
    const tags=[null],tagMap=new Map(),tag=meta=>{const key=JSON.stringify(meta);if(tagMap.has(key))return tagMap.get(key);const n=tags.push(meta)-1;tagMap.set(key,n);return n;};
    const rooms=p.rooms.map(r=>this.prepareRoom(p,r)),roomMap=new Map(rooms.map(r=>[r.room.id,r]));
    const floorSections=(p.floorSections||[]).map(f=>{const host=C.floorSectionHost(p,f),rr=this.prepareRoom(p,host);return {section:f,host,room:rr,floor:this.prepareStyle(f.floor,{w:f.width,h:f.length}),underside:this.prepareStyle(f.underside,{w:f.width,h:f.length})};});
    const currentRoom=C.roomById(p,v.roomId)||C.roomAtStory(p,v,v.story||0)||p.rooms[0],eyeZ=(v.floorZ??C.storyElevation(p,v.story||currentRoom.story||0))+v.eyeHeight;
    const dirs=Array.from({length:W},(_,x)=>{const side=(x+.5-W/2)/k.f;return {x:b.fx+b.rx*side,y:b.fy+b.ry*side};});
    const floorTags=new Map(),ceilTags=new Map(),sectionTags=new Map();for(const rr of rooms){floorTags.set(rr.room.id,tag({kind:'room',id:rr.room.id,face:'floor',story:rr.room.story||0}));ceilTags.set(rr.room.id,tag({kind:'room',id:rr.room.id,face:'ceiling',story:rr.room.story||0}));}for(const ff of floorSections)sectionTags.set(ff.section.id,tag({kind:'floorSection',id:ff.section.id,story:ff.section.story}));
    // Horizontal planes are real story elevations. Missing upper rooms are true vertical voids.
    for(let y=0;y<H;y++){
      const vz=-(y+.5-k.horizon)/k.f;
      for(let x=0;x<W;x++){
        const i=y*W+x,dir=dirs[x];let best=Infinity,bestRoom=null,bestFace=null,bestZ=0;
        let bestSection=null;
        if(Math.abs(vz)>1e-8){for(const rr of rooms){const r=rr.room,base=C.roomElevation(p,r),planes=[[base,'floor'],[C.roomTop(p,r),'ceiling']];for(const [z,face] of planes){const t=(z-eyeZ)/vz;if(t<=.075||t>=best||t>300)continue;const wx=v.x+dir.x*t,wy=v.y+dir.y*t;if(C.inRect(r,{x:wx,y:wy})&&(face!=='ceiling'||C.ceilingExistsAt(p,r,wx,wy))){best=t;bestRoom=rr;bestFace=face;bestZ=z;bestSection=null;}}}for(const ff of floorSections){const f=ff.section,z=C.storyElevation(p,f.story),t=(z-eyeZ)/vz,coplanar=bestFace!==null&&Math.abs(z-bestZ)<1e-4;if(t<=.075||(t>=best&&!coplanar)||t>300)continue;const wx=v.x+dir.x*t,wy=v.y+dir.y*t;if(C.inRect(f,{x:wx,y:wy})){best=t;bestRoom=null;bestFace='floorSection';bestZ=z;bestSection=ff;}}}
        if(bestRoom){const wx=v.x+dir.x*best,wy=v.y+dir.y*best,r=bestRoom.room,fromAbove=eyeZ>bestZ;let style;if(bestFace==='floor')style=fromAbove?bestRoom.floor:bestRoom.ceiling;else {const raw=C.ceilingSurfaceAt(p,r,wx,wy),prepared=this.prepareStyle(raw,{w:r.width,h:r.length});style=fromAbove?prepared:bestRoom.floor;}pixels[i]=this.sample(style,wx-r.x,wy-r.y,bestRoom,wx,wy,bestFace==='floor'?1:.9,grid&&bestFace==='floor'?p.grid:0);depth[i]=best;pick[i]=bestFace==='floor'?floorTags.get(r.id):ceilTags.get(r.id);}
        else if(bestSection){const wx=v.x+dir.x*best,wy=v.y+dir.y*best,f=bestSection.section,fromAbove=eyeZ>bestZ,style=fromAbove?bestSection.floor:bestSection.underside;pixels[i]=this.sample(style,wx-f.x,wy-f.y,bestSection.room,wx,wy,fromAbove?1:.9,grid&&fromAbove?p.grid:0);depth[i]=best;pick[i]=sectionTags.get(f.id);}
        else pixels[i]=vz<0?pack(31,38,49):pack(82+(y/H)*12,105+(y/H)*10,132+(y/H)*9);
      }
    }
    const walls=C.roomWalls(p),glass=[];
    const prepared=walls.map(w=>{
      const own=C.ownerFacing(w,v,p),room=roomMap.get(own.roomId),style=this.prepareStyle(C.wallStyle(p,own),this.wallSpace(p,w,own)),baseZ=C.storyElevation(p,w.story||room.room.story||0);
      const spec=!w.partitionId&&w.owners.length===1?C.backdropFor(p,own):null;
      const matte=spec?{spec,frame:C.backdropFrame(p,own,spec),texture:this.backdrop(spec),tag:tag({kind:'exterior',roomId:own.roomId,side:own.side})}:null;
      return {...w,owner:own,room,style,baseZ,matte,cap:C.wallCap(p,w),slab:this.slabTop(p,w),tag:tag(w.partitionId?{kind:'partition',id:w.partitionId,face:own.face}:{kind:'wall',id:w.id,owners:w.owners,story:w.story||0}),openings:C.openingsForWall(p,w).map(o=>({...o,line:C.openingLine(p,o),tag:tag({kind:'opening',id:o.id}),frame:this.prepareStyle(C.surface(o.frameColor)),panel:this.prepareStyle({...C.surface(o.panelColor,'wood'),textureId:o.textureId,finish:o.textureId?'image':'wood'})}))};
    });
    for(let x=0;x<W;x++)for(const w of prepared){
      const h=C.rayHit(w,v,dirs[x]);if(!h||h.depth<.075)continue;
      const wx=h.point.x,wy=h.point.y,dim=w.axis==='h'?1:.89,scale=k.f/h.depth,o=w.openings.find(o=>h.pos>=o.line.start-1e-6&&h.pos<=o.line.end+1e-6);
      const band=(bottom,top,style,tagId,kind='wall')=>{if(top<=bottom)return;const absBottom=w.baseZ+bottom,absTop=w.baseZ+top,y0=Math.max(0,Math.floor(k.horizon+(eyeZ-absTop)*scale)),y1=Math.min(H,Math.ceil(k.horizon+(eyeZ-absBottom)*scale));for(let y=y0;y<y1;y++){const i=y*W+x;if(h.depth>=depth[i]-.00001)continue;const absZ=eyeZ-(y+.5-k.horizon)/scale,z=absZ-w.baseZ;let color=this.sample(style,h.pos,z,w.room,wx,wy,dim);if(kind==='door'&&o)color=this.doorColor(p,o,h.pos,z,w.room,dim);pixels[i]=color;depth[i]=h.depth;pick[i]=tagId;}};
      if(!o){band(0,w.cap,w.style,w.tag);band(w.cap,w.slab,w.style,w.tag);continue;}
      band(0,o.bottom,w.style,w.tag);band(o.bottom+o.height,w.cap,w.style,w.tag);band(w.cap,w.slab,w.style,w.tag);
      const shape=C.openingGeometry(o),jamb=shape.frame,isJamb=jamb&&(h.pos<o.line.start+jamb||h.pos>o.line.end-jamb);
      if(isJamb){band(o.bottom,o.bottom+o.height,o.frame,o.tag);continue;}if(jamb){band(o.bottom+o.height-shape.head,o.bottom+o.height,o.frame,o.tag);if(o.kind==='window')band(o.bottom,o.bottom+shape.sill,o.frame,o.tag);}
      const low=o.bottom+shape.sill,high=o.bottom+o.height-shape.head;if(o.kind==='door'&&!o.open){band(low,high,o.panel,o.tag,'door');continue;}if(o.kind==='window'&&shape.divider>0&&Math.abs(h.pos-(o.line.start+o.width/2))<shape.divider/2){band(low,high,o.frame,o.tag);continue;}
      if(w.matte?.texture){const mat=w.matte,hit=C.backdropRay(mat.frame,sv,dirs[x],eyeZ);if(hit){const backdropDepth=Math.max(h.depth+.0001,hit.depth),y0=Math.max(0,Math.floor(k.horizon+(eyeZ-(w.baseZ+high))*scale)),y1=Math.min(H,Math.ceil(k.horizon+(eyeZ-(w.baseZ+low))*scale));for(let y=y0;y<y1;y++){const i=y*W+x;if(backdropDepth>=depth[i]-.00001)continue;const z=eyeZ+(k.horizon-y-.5)*hit.depth/k.f,sample=this.sampleBackdrop(mat.spec,mat.frame,hit.u,1-(z-(mat.frame.baseZ||0))/mat.frame.height,mat.texture);if(!sample)continue;const old=unpack(pixels[i]),c=sample.rgb,a=sample.alpha;pixels[i]=pack(c[0]*a+old[0]*(1-a),c[1]*a+old[1]*(1-a),c[2]*a+old[2]*(1-a));depth[i]=backdropDepth;pick[i]=mat.tag;}}}
      if(o.kind==='window')glass.push({x,y0:Math.max(0,Math.floor(k.horizon+(eyeZ-(w.baseZ+high))*scale)),y1:Math.min(H,Math.ceil(k.horizon+(eyeZ-(w.baseZ+low))*scale)),depth:h.depth,color:rgb(o.glassColor),opacity:o.glassOpacity??.16,tag:o.tag});
    }
    // General-purpose structural pillars can stand inside rooms or in unsupported/open space.
    const rayBox=(origin,dir,q)=>{const minX=q.x-q.width/2,maxX=q.x+q.width/2,minY=q.y-q.depth/2,maxY=q.y+q.depth/2;let t0=.075,t1=Infinity;for(const [o,d,a,b] of [[origin.x,dir.x,minX,maxX],[origin.y,dir.y,minY,maxY]]){if(Math.abs(d)<1e-9){if(o<a||o>b)return null;continue;}let A=(a-o)/d,B=(b-o)/d;if(A>B)[A,B]=[B,A];t0=Math.max(t0,A);t1=Math.min(t1,B);if(t0>t1)return null;}return t0;};
    for(let x=0;x<W;x++)for(const q of p.pillars||[]){const dep=rayBox(sv,dirs[x],q);if(!dep||dep>300)continue;const baseZ=C.storyElevation(p,q.story||0),topZ=baseZ+q.height,scale=k.f/dep,y0=Math.max(0,Math.floor(k.horizon+(eyeZ-topZ)*scale)),y1=Math.min(H,Math.ceil(k.horizon+(eyeZ-baseZ)*scale));if(y1<=y0)continue;const host=C.roomAtStory(p,q,q.story||0)||p.rooms.find(r=>(r.story||0)===(q.story||0))||p.rooms[0],rr=this.prepareRoom(p,host),style=this.prepareStyle(q.surface,{w:q.width+q.depth,h:q.height}),id=tag({kind:'pillar',id:q.id});for(let y=y0;y<y1;y++){const i=y*W+x;if(dep>=depth[i]-.001)continue;const z=eyeZ-(y+.5-k.horizon)/scale;pixels[i]=this.sample(style,((x/W)*(q.width+q.depth)),z-baseZ,rr,q.x,q.y,.9);depth[i]=dep;pick[i]=id;}}
    const arch={key,W,H,v:sv,pixels,depth,pick,tags,glass,eyeZ};if(this.archCache.size>=8)this.archCache.delete(this.archCache.keys().next().value);this.archCache.set(key,arch);return arch;
  }
  path(g,pts){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();}
  polygon(g,pts,fill,stroke=null,width=1){if(pts.length<3)return;this.path(g,pts);g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke();}}
  triangle(g,img,src,dst){
    const [a,b,c]=src,[A,B,D]=dst,det=a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y);if(Math.abs(det)<1e-8)return;
    const calc=(u,v,w)=>[(u*(b.y-c.y)+v*(c.y-a.y)+w*(a.y-b.y))/det,(u*(c.x-b.x)+v*(a.x-c.x)+w*(b.x-a.x))/det,(u*(b.x*c.y-c.x*b.y)+v*(c.x*a.y-a.x*c.y)+w*(a.x*b.y-b.x*a.y))/det];
    const tx=calc(A.x,B.x,D.x),ty=calc(A.y,B.y,D.y);g.save();this.path(g,dst);g.clip();g.transform(tx[0],ty[0],tx[1],ty[1],tx[2],ty[2]);g.drawImage(img,0,0);g.restore();
  }
  objectSurface(p,o,kind,v){
    if(o.surface==='sprite')return null;const floor=o.surface==='floor',b=C.basis(o.facing),cols=kind==='fp'?16:1,rows=floor&&kind==='fp'?8:1;
    const point=(u,t)=>floor?{x:o.x+(u-.5)*o.width*b.rx-(t-.5)*o.depth*b.fx,y:o.y+(u-.5)*o.width*b.ry-(t-.5)*o.depth*b.fy,h:o.mount+.003}:{x:o.x-(u-.5)*o.width*b.rx,y:o.y-(u-.5)*o.width*b.ry,h:o.mount+(1-t)*o.height};
    const project=q=>kind==='iso'?C.isoPoint(p,q,q.h):C.fpPoint(v,q,q.h),triangles=[];
    for(let ix=0;ix<cols;ix++)for(let iy=0;iy<rows;iy++){
      let uv=[{u:ix/cols,v:iy/rows},{u:(ix+1)/cols,v:iy/rows},{u:(ix+1)/cols,v:(iy+1)/rows},{u:ix/cols,v:(iy+1)/rows}];
      if(kind==='fp'){const clipped=[];for(let j=0;j<uv.length;j++){const a=uv[j],z=uv[(j+1)%uv.length],da=C.localFloor(v,point(a.u,a.v)).depth,dz=C.localFloor(v,point(z.u,z.v)).depth;if(da>=.08)clipped.push(a);if((da>=.08)!==(dz>=.08)){const t=(.08-da)/(dz-da);clipped.push({u:a.u+(z.u-a.u)*t,v:a.v+(z.v-a.v)*t});}}uv=clipped;}
      if(uv.length<3)continue;const ps=uv.map(t=>project(point(t.u,t.v)));if(ps.some(q=>!q))continue;
      for(let j=1;j<ps.length-1;j++)triangles.push({src:[uv[0],uv[j],uv[j+1]],dst:[ps[0],ps[j],ps[j+1]]});
    }
    return triangles;
  }
  gradeRoomColor(r,g,b,light){const sat=light.saturation??1,ct=light.contrast??1;if(sat===1&&ct===1)return [r,g,b];const y=.299*r+.587*g+.114*b;return [r,g,b].map(c=>(y+(c-y)*sat-127.5)*ct+127.5);}
  // Room boundary walls continue up to the next story's floor wherever that story has floor above the wall line,
  // so open ceilings and atriums never show a gap between the wall top and the slab above.
  slabTop(p,w){const cap=C.wallCap(p,w),sh=p.storyHeight||3.2;if(w.partitionId||cap!==p.wallHeight||sh<=cap+1e-6)return cap;
    const st=w.story||0,above=[...p.rooms,...(p.floorSections||[])].filter(r=>(r.story||0)===st+1),fx=w.axis==='h'?'y':'x',ax=w.axis==='h'?'x':'y',dim=w.axis==='h'?'width':'length',fd=w.axis==='h'?'length':'width';
    return above.some(r=>w.fixed>=r[fx]-1e-6&&w.fixed<=r[fx]+r[fd]+1e-6&&Math.min(w.end,r[ax]+r[dim])-Math.max(w.start,r[ax])>1e-6)?sh:cap;}
  isoObjectImage(p,o,asset,image){
    const r=C.roomById(p,o.roomId)||C.lightingRoomAt(p,o,o.story||0),rr=this.prepareRoom(p,r),f=this.factors(rr,o.x,o.y),key=JSON.stringify([asset.id,r.light,rr.lights,o.x,o.y]);
    if(f.every(v=>v===1)&&(r.light.saturation??1)===1&&(r.light.contrast??1)===1)return image;
    if(this.objectTintCache.has(key))return this.objectTintCache.get(key);
    const scale=Math.min(1,1024/Math.max(image.width,image.height)),c=makeCanvas(Math.max(1,Math.round(image.width*scale)),Math.max(1,Math.round(image.height*scale))),g=c.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0,c.width,c.height);const im=g.getImageData(0,0,c.width,c.height),d=im.data;
    for(let i=0;i<d.length;i+=4){if(d[i+3]===0)continue;const col=this.gradeRoomColor(d[i]*f[0],d[i+1]*f[1],d[i+2]*f[2],r.light);d[i]=col[0];d[i+1]=col[1];d[i+2]=col[2];}g.putImageData(im,0,0);if(this.objectTintCache.size>=16)this.objectTintCache.delete(this.objectTintCache.keys().next().value);this.objectTintCache.set(key,c);return c;
  }
  drawObject(g,p,o,kind,v,{tint=null}={}){
    const art=C.assetFor(o,kind,v),asset=this.catalog.get(art.id);let image=this.images.get(art.id);if(!asset||!image||!o.visible||o.opacity<=0)return null;if(kind==='iso')image=this.isoObjectImage(p,o,asset,image);
    const tris=this.objectSurface(p,o,kind,v),rect=C.rectFor(p,o,kind,v,asset);if(!rect&&(!tris||!tris.length))return null;
    g.save();g.globalAlpha=o.opacity;
    if(tris){for(const tri of tris){const src=tri.src.map(q=>({x:(o.flipX?1-q.u:q.u)*image.width,y:(o.flipY?1-q.v:q.v)*image.height}));this.triangle(g,image,src,tri.dst);}}
    else {g.translate(rect.x,rect.y);g.rotate(C.rad(o.rotation));g.scale(o.flipX?-1:1,o.flipY?-1:1);g.drawImage(image,-rect.w/2,-rect.h/2,rect.w,rect.h);}
    g.restore();return {object:o,rect,triangles:tris,art};
  }
  drawFP(p,v,{grid=false,width=960}={}){
    const a=this.architecture(p,v,grid,width),key=a.key+'|'+JSON.stringify(p.objects);
    if(this.fullCache.has(key))return this.fullCache.get(key);
    const W=a.W,H=a.H,sv=a.v,pixels=new Uint32Array(a.pixels),depth=new Float32Array(a.depth),pick=new Uint16Array(a.pick),tags=a.tags.slice();
    const layer=makeCanvas(W,H),lg=layer.getContext('2d',{willReadFrequently:true});
    const objects=p.objects.filter(o=>o.visible&&o.opacity>0).sort((x,y)=>C.localFloor(sv,y).depth-C.localFloor(sv,x).depth||x.layer-y.layer);
    for(const o of objects){
      lg.clearRect(0,0,W,H);const item=this.drawObject(lg,p,o,'fp',sv);if(!item)continue;
      const pts=item.triangles?item.triangles.flatMap(t=>t.dst):null;
      let x0,y0,x1,y1;
      if(pts?.length){x0=Math.max(0,Math.floor(Math.min(...pts.map(q=>q.x))));y0=Math.max(0,Math.floor(Math.min(...pts.map(q=>q.y))));x1=Math.min(W,Math.ceil(Math.max(...pts.map(q=>q.x))));y1=Math.min(H,Math.ceil(Math.max(...pts.map(q=>q.y))));}
      else {const r=item.rect,ex=Math.abs(Math.cos(C.rad(o.rotation)))*r.w/2+Math.abs(Math.sin(C.rad(o.rotation)))*r.h/2,ey=Math.abs(Math.sin(C.rad(o.rotation)))*r.w/2+Math.abs(Math.cos(C.rad(o.rotation)))*r.h/2;x0=Math.max(0,Math.floor(r.x-ex));y0=Math.max(0,Math.floor(r.y-ey));x1=Math.min(W,Math.ceil(r.x+ex));y1=Math.min(H,Math.ceil(r.y+ey));}
      if(x1<=x0||y1<=y0)continue;
      const id=tags.push({kind:'object',id:o.id,blocks:o.blocks})-1,im=lg.getImageData(x0,y0,x1-x0,y1-y0),d=im.data,room=C.roomById(p,o.roomId)||C.lightingRoomAt(p,o,o.story||0),prepared=this.prepareRoom(p,room||p.rooms[0]),f=this.factors(prepared,o.x,o.y),ob=C.basis(o.facing),cb=C.basis(sv.facing),k=C.lens(sv);
      for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
        const j=((y-y0)*(x1-x0)+x-x0)*4,alpha=d[j+3]/255;if(alpha<.03)continue;
        const i=y*W+x;let dep=C.localFloor(sv,o).depth;
        if(o.surface==='floor'){const dy=y+.5-k.horizon;dep=dy>0?(sv.eyeHeight-o.mount)*k.f/dy:Infinity;}
        else if(o.surface==='panel'){const side=(x+.5-W/2)/k.f,dx=cb.fx+cb.rx*side,dy=cb.fy+cb.ry*side,den=dx*ob.fx+dy*ob.fy;dep=Math.abs(den)>1e-9?((o.x-sv.x)*ob.fx+(o.y-sv.y)*ob.fy)/den:Infinity;}
        if(dep<.075||dep>depth[i]+.012)continue;
        const dest=pixels[i],col=this.gradeRoomColor(d[j]*f[0],d[j+1]*f[1],d[j+2]*f[2],prepared.room.light);pixels[i]=pack(col[0]*alpha+(dest&255)*(1-alpha),col[1]*alpha+((dest>>>8)&255)*(1-alpha),col[2]*alpha+((dest>>>16)&255)*(1-alpha));
        if(alpha>.1){depth[i]=dep;pick[i]=id;}
      }
    }
    for(const g of a.glass)for(let y=g.y0;y<g.y1;y++){
      const i=y*W+g.x;if(g.depth<depth[i]+.001){const old=unpack(pixels[i]),m=g.opacity??.16;pixels[i]=pack(old[0]*(1-m)+g.color[0]*m,old[1]*(1-m)+g.color[1]*m,old[2]*(1-m)+g.color[2]*m);}
    }
    const image=new ImageData(new Uint8ClampedArray(pixels.buffer),W,H),canvas=makeCanvas(W,H);canvas.getContext('2d').putImageData(image,0,0);
    const result={canvas,W,H,pixels,depth,pick,tags,arch:a};
    if(this.fullCache.size>=10)this.fullCache.delete(this.fullCache.keys().next().value);this.fullCache.set(key,result);return result;
  }
  sourceMatches(meta,source){
    if(!meta||!source)return false;
    if(source.kind==='object'||source.kind==='opening'||source.kind==='partition'||source.kind==='pillar')return meta.kind===source.kind&&meta.id===source.id;
    return meta.kind==='wall'&&meta.owners.some(o=>o.roomId===source.roomId&&o.side===source.side);
  }
  probe(p,v,q,source=null){const r=this.drawFP(p,v),x=C.clamp(Math.floor(q.x/v.width*r.W),0,r.W-1),y=C.clamp(Math.floor(q.y/v.height*r.H),0,r.H-1),i=y*r.W+x,meta=r.tags[r.pick[i]];return {meta,blocked:this.sourceMatches(meta,source),depth:r.depth[i]};}
  coverage(p,v,source){const r=this.drawFP(p,v,{width:480}),matched=new Set(r.tags.map((m,i)=>this.sourceMatches(m,source)?i:-1));let count=0;for(let i=0;i<r.pick.length;i++)if(matched.has(r.pick[i]))count++;return count/r.pick.length;}
  mask(p,v,source){const r=this.drawFP(p,v),c=makeCanvas(r.W,r.H),im=new ImageData(r.W,r.H),d=new Uint32Array(im.data.buffer),match=new Set(r.tags.map((m,i)=>this.sourceMatches(m,source)?i:-1));for(let i=0;i<d.length;i++)d[i]=match.has(r.pick[i])?pack(255,255,255):pack(0,0,0);c.getContext('2d').putImageData(im,0,0);return c;}
  floorVisible(p,v,q){const fq=C.fpInverse(v,q),floor=fq&&{...fq,story:v.story||0};if(!floor||!C.inFloor(p,floor))return null;const proj=C.fpPoint(v,floor),r=this.drawFP(p,v),x=C.clamp(Math.floor(q.x/v.width*r.W),0,r.W-1),y=C.clamp(Math.floor(q.y/v.height*r.H),0,r.H-1);return proj.depth<=r.arch.depth[y*r.W+x]+.09?floor:null;}
  isoMattePanel(p,owner,spec){
    const frame=C.backdropFrame(p,owner,spec),tex=this.backdrop(spec);if(!tex)return null;
    // The existing fixed isometric projection has this constant screen ray.
    // It is a 2D affine transform, shared by every aperture on this side.
    const dir={x:-1,y:-1},slope=-1/1.1;
    if(dir.x*frame.outward.x+dir.y*frame.outward.y<=0)return null;
    const key=JSON.stringify([owner,frame,spec]);
    if(this.isoMatteCache.has(key))return this.isoMatteCache.get(key);
    const W=Math.min(1200,Math.max(192,Math.round(frame.width*C.isoTransform(p).s*1.12))),H=Math.min(600,Math.max(72,Math.round(frame.height*C.isoTransform(p).s*1.1)));
    const canvas=makeCanvas(W,H),im=new ImageData(W,H),pixels=im.data;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const pos=frame.line.start+(x+.5)/W*frame.width,z=frame.height*(1-(y+.5)/H);
      const q=C.backdropAtWall(frame,pos,z,dir,slope);if(!q)continue;
      const sample=this.sampleBackdrop(spec,frame,q.u,q.v,tex);if(!sample)continue;
      const i=(y*W+x)*4;pixels[i]=sample.rgb[0];pixels[i+1]=sample.rgb[1];pixels[i+2]=sample.rgb[2];pixels[i+3]=Math.round(sample.alpha*255);
    }
    canvas.getContext('2d').putImageData(im,0,0);
    const result={canvas,frame};if(this.isoMatteCache.size>=16)this.isoMatteCache.delete(this.isoMatteCache.keys().next().value);
    this.isoMatteCache.set(key,result);return result;
  }
  drawIsoMatte(g,p,w,owner,spec,a,b,low,high){
    if(high<=low)return;
    const panel=this.isoMattePanel(p,owner,spec);if(!panel)return;
    const f=panel.frame,W=panel.canvas.width,H=panel.canvas.height;
    const x0=(a-f.line.start)/f.width*W,x1=(b-f.line.start)/f.width*W,y0=(1-high/f.height)*H,y1=(1-low/f.height)*H;
    const base=f.baseZ||0,dst=[C.isoPoint(p,C.wallPoint(w,a),base+low),C.isoPoint(p,C.wallPoint(w,b),base+low),C.isoPoint(p,C.wallPoint(w,b),base+high),C.isoPoint(p,C.wallPoint(w,a),base+high)];
    const src=[{x:x0,y:y1},{x:x1,y:y1},{x:x1,y:y0},{x:x0,y:y0}];
    this.triangle(g,panel.canvas,[src[0],src[1],src[2]],[dst[0],dst[1],dst[2]]);
    this.triangle(g,panel.canvas,[src[0],src[2],src[3]],[dst[0],dst[2],dst[3]]);
  }
  drawMatteSidePreview(canvas,p,owner){
    const g=canvas.getContext('2d'),W=canvas.width,H=canvas.height,spec=C.backdropFor(p,owner)||C.backdrop(),frame=C.backdropFrame(p,owner,spec);
    const image=new ImageData(W,H),out=image.data,tex=this.backdrop(spec);
    const clearRects=[];
    for(const w of C.roomWalls(p))if(w.owners.length===1&&w.owners[0].roomId===owner.roomId&&w.owners[0].side===owner.side){
      for(const o of C.openingsForWall(p,w)){
        const l=C.openingLine(p,o),a=Math.max(w.start,l.start),b=Math.min(w.end,l.end);
        const u1=.5+((C.wallPoint(w,a).x-frame.center.x)*frame.right.x+(C.wallPoint(w,a).y-frame.center.y)*frame.right.y)/frame.width;
        const u2=.5+((C.wallPoint(w,b).x-frame.center.x)*frame.right.x+(C.wallPoint(w,b).y-frame.center.y)*frame.right.y)/frame.width;
        clearRects.push({x:Math.min(u1,u2)*W,y:(1-(o.bottom+o.height)/frame.height)*H,w:Math.abs(u2-u1)*W,h:o.height/frame.height*H,o});
      }
    }
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const sample=tex?this.sampleBackdrop(spec,frame,(x+.5)/W,(y+.5)/H,tex):null;
      const visible=clearRects.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h&&!(r.o.kind==='door'&&!r.o.open));
      const alpha=sample?.alpha??0,col=sample?.rgb||[15,29,42],dim=visible?1:.36,i=(y*W+x)*4;
      for(let c=0;c<3;c++)out[i+c]=(col[c]*alpha+[15,29,42][c]*(1-alpha))*dim;
      out[i+3]=255;
    }
    g.putImageData(image,0,0);g.font='bold 13px Segoe UI';g.textAlign='left';g.lineWidth=2;
    for(const r of clearRects){g.strokeStyle=r.o.kind==='door'&&!r.o.open?'#f8ae92':'#91e7de';g.strokeRect(r.x+1,r.y+1,r.w-2,r.h-2);if(r.o.kind==='window'&&r.o.trim&&(r.o.panes??2)===2){g.beginPath();g.moveTo(r.x+r.w/2,r.y);g.lineTo(r.x+r.w/2,r.y+r.h);g.stroke();}g.fillStyle='#07141fee';g.fillRect(r.x+3,r.y+3,Math.min(r.w-6,g.measureText(r.o.name).width+10),21);g.save();g.beginPath();g.rect(r.x+3,r.y+3,Math.max(1,r.w-6),21);g.clip();g.fillStyle='#e7f6f3';g.fillText(r.o.name,r.x+7,r.y+18);g.restore();}
  }
  paintWallFace(g,p,w,room,s,a,b,bottom,top,points,owner){
    const key=JSON.stringify([w.axis,w.fixed,a,b,bottom,top,s,room.room.light,room.lights,owner,C.wallCap(p,w)]);
    let canvas=this.wallPaintCache.get(key);
    if(!canvas){
      const W=Math.max(2,Math.min(960,Math.ceil((b-a)*90))),H=Math.max(2,Math.min(600,Math.ceil((top-bottom)*90)));
      canvas=makeCanvas(W,H);const image=new ImageData(W,H),pixels=new Uint32Array(image.data.buffer),prep=this.prepareStyle(s,this.wallSpace(p,w,owner)),dim=w.axis==='h'?1:.89;
      for(let y=0;y<H;y++){const z=top-(y+.5)/H*(top-bottom);
        for(let x=0;x<W;x++){const along=a+(x+.5)/W*(b-a),pos=C.wallPoint(w,along);pixels[y*W+x]=this.sample(prep,along,z,room,pos.x,pos.y,dim);}
      }
      canvas.getContext('2d').putImageData(image,0,0);
      if(this.wallPaintCache.size>=100)this.wallPaintCache.delete(this.wallPaintCache.keys().next().value);
      this.wallPaintCache.set(key,canvas);
    }
    const W=canvas.width,H=canvas.height;
    this.triangle(g,canvas,[{x:0,y:H},{x:W,y:H},{x:W,y:0}],points.slice(0,3));
    this.triangle(g,canvas,[{x:0,y:H},{x:W,y:0},{x:0,y:0}],[points[0],points[2],points[3]]);
  }
  surfaceCanvas(p,r,s,space,W,H,{neutral=false,door=null,wall=null}={}){
    const ctxRoom=neutral?{...r,light:{brightness:1,tint:'#ffffff',tintStrength:0,contrast:1,saturation:1,exposure:0}}:r;
    const room=this.prepareRoom(neutral?{...p,lights:[]}:p,ctxRoom),prep=this.prepareStyle(s,space),canvas=makeCanvas(W,H),im=new ImageData(W,H),out=new Uint32Array(im.data.buffer);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const u=(x+.5)/W*space.w,v=(y+.5)/H*space.h;
      const along=(space.origin||0)+u,z=space.h-v,wx=wall?C.wallPoint(wall,along):{x:r.x+u,y:r.y+v};
      out[y*W+x]=door?this.doorColor(p,door,along,z,room):this.sample(prep,space.wall?along:u,space.wall?z:v,room,wx.x,wx.y,space.wall&&wall?.axis==='v'?.89:1);
    }
    canvas.getContext('2d').putImageData(im,0,0);return canvas;
  }
  paintFloor(g,p,r,pts){
    const k=JSON.stringify(['floor',r,p.lights]);let im=this.wallPaintCache.get(k);
    if(!im){im=this.surfaceCanvas(p,r,r.floor,{w:r.width,h:r.length},Math.min(1024,Math.ceil(r.width*80)),Math.min(1024,Math.ceil(r.length*80)));if(this.wallPaintCache.size>100)this.wallPaintCache.clear();this.wallPaintCache.set(k,im);}
    this.triangle(g,im,[{x:0,y:0},{x:im.width,y:0},{x:im.width,y:im.height}],pts.slice(0,3));
    this.triangle(g,im,[{x:0,y:0},{x:im.width,y:im.height},{x:0,y:im.height}],[pts[0],pts[2],pts[3]]);
  }
  paintDoorFace(g,p,w,r,o,a,b,low,high,pts){
    const l=C.openingLine(p,o),key=JSON.stringify(['door',o,r.light,p.lights]);let im=this.wallPaintCache.get(key);
    if(!im){const W=320,H=Math.max(64,Math.min(720,Math.round(W*o.height/o.width))),canvas=makeCanvas(W,H),img=new ImageData(W,H),out=new Uint32Array(img.data.buffer),rr=this.prepareRoom(p,r);
      for(let y=0;y<H;y++)for(let x=0;x<W;x++)out[y*W+x]=this.doorColor(p,o,l.start+(x+.5)/W*o.width,o.bottom+o.height*(1-(y+.5)/H),rr,w.axis==='h'?1:.89);
      canvas.getContext('2d').putImageData(img,0,0);im=canvas;this.wallPaintCache.set(key,im);}
    const X=u=>(u-l.start)/o.width*im.width,Y=z=>(1-(z-o.bottom)/o.height)*im.height,src=[{x:X(a),y:Y(low)},{x:X(b),y:Y(low)},{x:X(b),y:Y(high)},{x:X(a),y:Y(high)}];
    this.triangle(g,im,src.slice(0,3),pts.slice(0,3));this.triangle(g,im,[src[0],src[2],src[3]],[pts[0],pts[2],pts[3]]);
  }
  colorAt(s,r,x,y,u=0,v=0,dim=1){const val=this.sample(this.prepareStyle(s),u,v,r,x,y,dim),c=unpack(val);return 'rgb('+c.join(',')+')';}
  drawWorkPlane(g,p,story,grid,reference){
    const b=C.bounds(p),z=C.storyElevation(p,story),P=q=>C.isoPoint(p,q,z),pad=2,box={x:b.x-pad,y:b.y-pad,maxX:b.maxX+pad,maxY:b.maxY+pad};
    const corners=[{x:box.x,y:box.y},{x:box.maxX,y:box.y},{x:box.maxX,y:box.maxY},{x:box.x,y:box.maxY}];
    g.save();this.polygon(g,corners.map(P),'#ffc47f08','#c5965360',1.4);
    if(grid){const step=Math.max(p.grid,Math.ceil(Math.max(b.width,b.length)/90/p.grid)*p.grid);g.strokeStyle='#e3ad6324';g.lineWidth=1;g.beginPath();for(let x=Math.ceil(box.x/step)*step;x<=box.maxX;x+=step){const a=P({x,y:box.y}),b=P({x,y:box.maxY});g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);}for(let y=Math.ceil(box.y/step)*step;y<=box.maxY;y+=step){const a=P({x:box.x,y}),b=P({x:box.maxX,y});g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);}g.stroke();}
    if(reference&&story>0){
      g.strokeStyle='#a7b5c27a';g.setLineDash([7,6]);g.lineWidth=1.5;
      for(const r of [...p.rooms,...p.floorSections].filter(r=>r.story===story-1)){
        const pts=[{x:r.x,y:r.y},{x:r.x+r.width,y:r.y},{x:r.x+r.width,y:r.y+r.length},{x:r.x,y:r.y+r.length}];this.path(g,pts.map(P));g.stroke();
        for(const q of pts){const a=P(q),lower=C.isoPoint(p,q,C.storyElevation(p,story-1));g.beginPath();g.moveTo(a.x,a.y);g.lineTo(lower.x,lower.y);g.stroke();}
      }
      g.setLineDash([]);
    }
    const label=P(corners[0]);g.font='bold 13px Segoe UI';g.fillStyle='#efbc7c';g.textAlign='left';g.fillText((C.storyRecord(p,story)?.name||C.storyLabel(story))+' · work plane',label.x+12,label.y-13);g.restore();
  }
  drawIso(g,p,{grid=true,dimensions=true,cutaway=true,selectedRoom=null,activeStory=null,storyMode='stacked',workPlane=false,showReference=true,showAllStories=false,clear=true}={}){
    if(clear){g.fillStyle='#0b1018';g.fillRect(0,0,1440,1080);}
    const selected=C.roomById(p,selectedRoom);activeStory=activeStory??selected?.story??0;
    if(storyMode==='focus'){
      for(const story of C.storyList(p).filter(s=>s<activeStory&&showReference||s>activeStory&&showAllStories)){
        g.save();g.globalAlpha=.30;g.filter='grayscale(1)';this.drawIso(g,p,{grid:false,dimensions:false,cutaway:true,activeStory:story,storyMode:'single',clear:false});g.restore();
      }
      if(workPlane)this.drawWorkPlane(g,p,activeStory,grid,showReference);
    }
    this.isoFloors=[];this.isoWalls=[];this.isoObjects=[];
    const P=(q,h=0)=>C.isoPoint(p,q,h),t=C.isoTransform(p),allRooms=p.rooms.map(r=>this.prepareRoom(p,r)),rooms=allRooms.filter(rr=>storyMode==='stacked'||(rr.room.story||0)===activeStory);
    const drawRoomFloor=rr=>{const r=rr.room,base=C.roomElevation(p,r),points=[[r.x,r.y],[r.x+r.width,r.y],[r.x+r.width,r.y+r.length],[r.x,r.y+r.length]].map(([x,y])=>P({x,y},base));this.isoFloors.push({room:r,points});this.polygon(g,points,this.colorAt(r.floor,rr,r.x+r.width/2,r.y+r.length/2),r.id===selectedRoom?'#60d4dc':'#363f4b',r.id===selectedRoom?3:1);
      g.save();this.path(g,points);g.clip();const step=r.floor.finish==='wood'?.35:r.floor.finish==='tile'?r.floor.tileSize:1;
      this.paintFloor(g,p,r,points);
      if(grid){g.strokeStyle='#c2cbd02e';g.lineWidth=1;g.beginPath();for(let x=r.x;x<=r.x+r.width+.001;x+=p.grid){const a=P({x,y:r.y},base),b=P({x,y:r.y+r.length},base);g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);}for(let y=r.y;y<=r.y+r.length+.001;y+=p.grid){const a=P({x:r.x,y},base),b=P({x:r.x+r.width,y},base);g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);}g.stroke();}g.restore();
    };
    const activeStories=storyMode==='stacked'?new Set(C.storyList(p)):new Set([activeStory]),floorSections=(p.floorSections||[]).filter(f=>activeStories.has(f.story||0));
    const drawSectionFloor=f=>{const z=C.storyElevation(p,f.story||0),pts=[[f.x,f.y],[f.x+f.width,f.y],[f.x+f.width,f.y+f.length],[f.x,f.y+f.length]].map(([x,y])=>P({x,y},z)),host=C.floorSectionHost(p,f),rr=this.prepareRoom(p,host);this.isoFloors.push({floorSection:f,points:pts});this.polygon(g,pts,this.colorAt(f.floor,rr,f.x+f.width/2,f.y+f.length/2),'#4f8c94',1.2);const fake={...host,x:f.x,y:f.y,width:f.width,length:f.length,floor:f.floor};this.paintFloor(g,p,fake,pts);if(storyMode==='focus')this.polygon(g,pts,'#ffc47f18','#dfb375',1.5);};
    // Stacked: paint each story's room floors then its floor sections, lowest story first, so lower sections never cover upper floors.
    if(storyMode==='stacked'){const order=[...new Set([...rooms.map(rr=>rr.room.story||0),...floorSections.map(f=>f.story||0)])].sort((a,b)=>a-b);for(const st of order){for(const rr of rooms)if((rr.room.story||0)===st)drawRoomFloor(rr);for(const f of floorSections)if((f.story||0)===st)drawSectionFloor(f);}}
    else{for(const rr of rooms)drawRoomFloor(rr);for(const f of floorSections)drawSectionFloor(f);}
    const visibleStories=new Set(rooms.map(r=>r.room.story||0));for(const st of activeStories)visibleStories.add(st);const walls=C.roomWalls(p).filter(w=>visibleStories.has(w.story||0)).sort((a,b)=>(a.a.x+a.a.y+a.b.x+a.b.y)-(b.a.x+b.a.y+b.b.x+b.b.y));
    const objects=p.objects.filter(o=>o.visible&&visibleStories.has(o.story||0)).sort((a,b)=>(a.x+a.y)-(b.x+b.y)||a.layer-b.layer);
    const drawPillar=q=>{const z=C.storyElevation(p,q.story||0),x0=q.x-q.width/2,x1=q.x+q.width/2,y0=q.y-q.depth/2,y1=q.y+q.depth/2,base=[P({x:x0,y:y0},z),P({x:x1,y:y0},z),P({x:x1,y:y1},z),P({x:x0,y:y1},z)],top=[P({x:x0,y:y0},z+q.height),P({x:x1,y:y0},z+q.height),P({x:x1,y:y1},z+q.height),P({x:x0,y:y1},z+q.height)],host=C.roomAtStory(p,q,q.story||0)||p.rooms.find(r=>(r.story||0)===(q.story||0))||p.rooms[0],rr=this.prepareRoom(p,host),fill=this.colorAt(q.surface,rr,q.x,q.y);this.polygon(g,[base[0],base[1],top[1],top[0]],fill,'#29313a',1);this.polygon(g,[base[1],base[2],top[2],top[1]],this.colorAt(q.surface,rr,q.x+.1,q.y+.1,0,0,.88),'#29313a',1);this.polygon(g,top,this.colorAt(q.surface,rr,q.x,q.y,0,0,1.08),'#29313a',1);};
    const drawWall=w=>{
      const owner=w.owners.find(o=>o.side==='N'||o.side==='W')||w.owners[0],rr=allRooms.find(r=>r.room.id===owner.roomId);if(!rr)return;const style=C.wallStyle(p,owner),base=C.storyElevation(p,w.story||rr.room.story||0),front=!w.partitionId&&w.owners.length===1&&(owner.side==='S'||owner.side==='E');
      const cap=C.wallCap(p,w),height=cutaway?Math.min(cap,front?.18:w.owners.length>1?1.35:cap):cap;
      const ops=C.openingsForWall(p,w),stops=[w.start,w.end];
      for(const o of ops){const l=C.openingLine(p,o);for(const x of [l.start,l.end])if(x>w.start&&x<w.end)stops.push(x);}stops.sort((a,b)=>a-b);
      const face=(a,b,bottom,top,fill,stroke='#202830',mapped=null)=>{top=Math.min(top,height);bottom=Math.max(0,bottom);if(top<=bottom)return;const pts=[P(C.wallPoint(w,a),base+bottom),P(C.wallPoint(w,b),base+bottom),P(C.wallPoint(w,b),base+top),P(C.wallPoint(w,a),base+top)];this.polygon(g,pts,fill,stroke,1.1);if(mapped)this.paintWallFace(g,p,w,rr,mapped,a,b,bottom,top,pts,owner);this.isoWalls.push({wall:w,owner,points:pts});};
      for(let i=0;i<stops.length-1;i++){
        const a=stops[i],b=stops[i+1],mid=(a+b)/2,o=C.openingAt(p,w,mid),pos=C.wallPoint(w,mid),fill=this.colorAt(style,rr,pos.x,pos.y,mid,.6,w.axis==='h'?1:.87);
        if(!o){face(a,b,0,cap,fill,'#202830',style);continue;}
        face(a,b,0,o.bottom,fill,'#202830',style);face(a,b,o.bottom+o.height,cap,fill,'#202830',style);
        if(o.kind==='door'&&!o.open){const low=o.bottom,high=Math.min(height,o.bottom+o.height);if(high>low){const pts=[P(C.wallPoint(w,a),base+low),P(C.wallPoint(w,b),base+low),P(C.wallPoint(w,b),base+high),P(C.wallPoint(w,a),base+high)];this.paintDoorFace(g,p,w,rr.room,o,a,b,low,high,pts);}}
        else if(!w.partitionId&&w.owners.length===1){
          const spec=C.backdropFor(p,owner);if(spec)this.drawIsoMatte(g,p,w,owner,spec,a,b,Math.max(0,o.bottom),Math.min(height,o.bottom+o.height));
        }
        if(o.kind==='window'&&height>o.bottom){
          g.save();g.globalAlpha*=o.glassOpacity??.16;face(a,b,o.bottom,o.bottom+o.height,o.glassColor,null);g.restore();
        }
        if(o.trim){
          const l=C.openingLine(p,o),f=C.openingGeometry(o);
          if(a<l.start+f.frame)face(a,Math.min(b,l.start+f.frame),o.bottom,o.bottom+o.height,o.frameColor);
          if(b>l.end-f.frame)face(Math.max(a,l.end-f.frame),b,o.bottom,o.bottom+o.height,o.frameColor);
          face(a,b,o.bottom+o.height-f.head,o.bottom+o.height,o.frameColor);
          if(o.kind==='window'){
            face(a,b,o.bottom,o.bottom+f.sill,o.frameColor);
            const mid=(l.start+l.end)/2;if(f.divider>0&&a<mid+f.divider/2&&b>mid-f.divider/2)face(Math.max(a,mid-f.divider/2),Math.min(b,mid+f.divider/2),o.bottom,o.bottom+o.height,o.frameColor);
          }
        }
        const A=P(C.wallPoint(w,a),base+.025),B=P(C.wallPoint(w,b),base+.025);g.strokeStyle=o.kind==='window'?'#78c5e9':o.kind==='door'?(o.open?'#e1bd79':'#df8d78'):'#65d0ae';g.lineWidth=5;g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.stroke();
      }
    };
    // Draw far boundary first; interleave interior wall planes with floor objects.
    const items=[...walls.map(w=>({wall:w,depth:(w.a.x+w.a.y+w.b.x+w.b.y)/2-C.storyElevation(p,w.story||0)*1.8})),...(p.pillars||[]).filter(q=>visibleStories.has(q.story||0)).map(q=>({pillar:q,depth:q.x+q.y-C.storyElevation(p,q.story||0)*1.8})),...objects.map(o=>({object:o,depth:o.x+o.y-(o.floorZ||0)*1.8+.01+o.layer*.001}))].sort((a,b)=>a.depth-b.depth);
    for(const item of items)if(item.wall)drawWall(item.wall);else if(item.pillar)drawPillar(item.pillar);else{const it=this.drawObject(g,p,item.object,'iso',null);if(it)this.isoObjects.push(it);}
    if(dimensions){
      for(const rr of rooms){const r=rr.room,center=P({x:r.x+r.width/2,y:r.y+r.length/2},C.roomElevation(p,r));g.save();g.textAlign='center';g.font='bold 16px Segoe UI';const title=r.name,tw=g.measureText(title).width;g.fillStyle='#0b131ddc';g.fillRect(center.x-tw/2-12,center.y-20,tw+24,61);g.fillStyle='#f1efe5';g.fillText(title,center.x,center.y-1);g.font='10px Segoe UI';g.fillStyle='#8fd4d6';g.fillText(C.storyRecord(p,r.story||0)?.name||C.storyLabel(r.story||0),center.x,center.y+14);g.font='12px Segoe UI';g.fillStyle='#b4c4cc';g.fillText(C.round(C.toDisplay(r.width,p.units),2)+' × '+C.round(C.toDisplay(r.length,p.units),2)+' '+p.units,center.x,center.y+31);g.restore();}
      const r=C.roomById(p,selectedRoom)||rooms[0]?.room;if(!r)return;const z=C.roomElevation(p,r),a=P({x:r.x,y:r.y+r.length},z),b=P({x:r.x+r.width,y:r.y+r.length},z),c=P({x:r.x+r.width,y:r.y},z);
      this.dimension(g,{x:a.x,y:a.y+45},{x:b.x,y:b.y+45},'WIDTH '+C.round(C.toDisplay(r.width,p.units),2)+' '+p.units,'#68d3de');
      this.dimension(g,{x:c.x+35,y:c.y+18},{x:b.x+35,y:b.y+18},'LENGTH '+C.round(C.toDisplay(r.length,p.units),2)+' '+p.units,'#e9a576');
    }
  }
  // 0.13: hit-test geometry for the map without painting anything (the graphics card draws the pixels).
  isoHitGeometry(p,{cutaway=true,activeStory=0,showAllStories=false}={}){
    this.isoFloors=[];this.isoWalls=[];this.isoObjects=[];const P=(q,h=0)=>C.isoPoint(p,q,h),t=C.isoTransform(p),plan=t.mode==='plan';
    for(const r of p.rooms.filter(r=>(r.story||0)===activeStory)){const base=C.roomElevation(p,r);this.isoFloors.push({room:r,points:[[r.x,r.y],[r.x+r.width,r.y],[r.x+r.width,r.y+r.length],[r.x,r.y+r.length]].map(([x,y])=>P({x,y},base))});}
    for(const f of (p.floorSections||[]).filter(f=>(f.story||0)===activeStory)){const z=C.storyElevation(p,f.story||0);this.isoFloors.push({floorSection:f,points:[[f.x,f.y],[f.x+f.width,f.y],[f.x+f.width,f.y+f.length],[f.x,f.y+f.length]].map(([x,y])=>P({x,y},z))});}
    if(!plan)for(const w of C.roomWalls(p).filter(w=>(w.story||0)===activeStory)){
      const owner=w.owners.find(o=>o.side==='N'||o.side==='W')||w.owners[0],base=C.storyElevation(p,w.story||0),front=!w.partitionId&&w.owners.length===1&&(owner.side==='S'||owner.side==='E'),cap=C.wallCap(p,w),height=cutaway?Math.min(cap,front?.18:w.owners.length>1?1.35:cap):cap;
      const pts=[P(C.wallPoint(w,w.start),base),P(C.wallPoint(w,w.end),base),P(C.wallPoint(w,w.end),base+height),P(C.wallPoint(w,w.start),base+height)];this.isoWalls.push({wall:w,owner,points:pts});}
    const visible=new Set([activeStory]);if(showAllStories)for(const s of C.storyList(p))visible.add(s);
    for(const o of p.objects.filter(o=>o.visible&&visible.has(o.story||0))){const art=C.assetFor(o,'iso',null),asset=this.catalog.get(art.id);if(!asset)continue;
      if(o.surface==='sprite'&&!plan){const rect=C.rectFor(p,o,'iso',null,asset);this.isoObjects.push({object:o,rect,triangles:null,art});}
      else{const tris=plan&&o.surface==='sprite'?this.objectSurface(p,{...o,surface:'floor'},'iso',null):this.objectSurface(p,o,'iso',null);this.isoObjects.push({object:o,rect:null,triangles:tris,art});}}
  }
  dimension(g,a,b,label,color){g.save();g.strokeStyle=color;g.fillStyle=color;g.lineWidth=1.7;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();let angle=Math.atan2(b.y-a.y,b.x-a.x);for(const p of [a,b]){g.beginPath();g.moveTo(p.x-Math.sin(angle)*7,p.y+Math.cos(angle)*7);g.lineTo(p.x+Math.sin(angle)*7,p.y-Math.cos(angle)*7);g.stroke();}g.translate((a.x+b.x)/2,(a.y+b.y)/2);if(angle>Math.PI/2)angle-=Math.PI;if(angle<-Math.PI/2)angle+=Math.PI;g.rotate(angle);g.font='bold 13px Segoe UI';g.textAlign='center';const w=g.measureText(label).width;g.fillStyle='#111925';g.fillRect(-w/2-9,-11,w+18,24);g.fillStyle=color;g.fillText(label,0,5);g.restore();}
  hitIsoObject(p,q){
    const items=[...this.isoObjects].reverse();
    for(const item of items){
      if(item.triangles?.length){if(item.triangles.some(t=>inPoly(q,t.dst)))return item.object;continue;}
      const r=item.rect;if(!r)continue;const angle=C.rad(-r.rotation),dx=q.x-r.x,dy=q.y-r.y,u=(dx*Math.cos(angle)-dy*Math.sin(angle))/r.w+.5,v=(dx*Math.sin(angle)+dy*Math.cos(angle))/r.h+.5;if(u<0||u>1||v<0||v>1)continue;
      const tex=this.texture(r.assetId);if(!tex)return item.object;const xx=C.clamp(Math.floor((r.flipX?1-u:u)*tex.w),0,tex.w-1),yy=C.clamp(Math.floor((r.flipY?1-v:v)*tex.h),0,tex.h-1);if(tex.pixels[(yy*tex.w+xx)*4+3]>25)return item.object;
    }return null;
  }
}
window.RCRenderer=Renderer;window.RCInPolygon=inPoly;
})();
