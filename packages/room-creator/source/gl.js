/* TRAPSTAR Room Creator 0.13 — graphics-card (WebGL) renderer.
   Builds real 3D meshes from the shared floor plan so the map and first person can move at full frame rate.
   The surface shader reproduces the original 2D renderer's finishes, trims, wear, colour adjustments and
   light pools, and the first-person camera uses the same lens (horizontal view angle, horizon line). */
(function(){'use strict';
const C=window.RCCore,T=window.THREE;
const FIN={paint:0,concrete:1,wood:2,tile:3,brick:4,image:5,wallpaper:6,carpet:7,terrazzo:8,checker:9};
const MAP_MODE={repeat:0,mirror:1,stretch:2};
const MAXL=24;
const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const v3=h=>{const c=rgb(h);return new T.Vector3(c[0],c[1],c[2]);};
function supported(){try{if(!T)return false;const c=document.createElement('canvas');return !!c.getContext('webgl2');}catch(e){return false;}}

// ------------------------------------------------------------------ shaders
const SURF_VS=`
attribute vec2 aAB; attribute float aZ; attribute float aStory; attribute vec2 aCut; attribute vec3 aPick;
varying vec2 vAB; varying float vZ; varying vec3 vW; varying float vStory; varying vec2 vCut; varying vec3 vPick;
void main(){vAB=aAB;vZ=aZ;vStory=aStory;vCut=aCut;vPick=aPick;vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;
const COMMON_FS=`
uniform float uMap; uniform float uActive; uniform float uRef; uniform float uAbove; uniform float uCutaway; uniform float uPick;
uniform vec4 uHaze; uniform vec3 uHazeR; uniform vec3 uCam; uniform vec3 uBg; uniform float uGridStep;
vec3 hazeAndGhost(vec3 c, vec3 w, float story){
  if(uMap>0.5){ if(story>uActive+0.5&&uAbove<0.5) discard; if(story<uActive-0.5){ if(uRef<0.5) discard; float g=dot(c,vec3(.299,.587,.114)); c=mix(uBg,vec3(g),0.34); }
    else if(story>uActive+0.5){ float g=dot(c,vec3(.299,.587,.114)); c=mix(uBg,vec3(g),0.30); } return c; }
  if(uHaze.w>0.5){ float d=distance(w,uCam); float h=clamp((d-uHazeR.x)/max(1.0,uHazeR.y-uHazeR.x),0.0,1.0)*uHazeR.z; c=mix(c,uHaze.rgb,h); }
  return c;
}`;
const SURF_FS=`
uniform vec3 uColor; uniform vec3 uSecondary; uniform vec3 uBaseColor; uniform vec3 uCapColor;
uniform vec4 uP0; uniform vec4 uP1; uniform vec4 uP2; uniform vec4 uP3; uniform vec4 uP4; uniform vec4 uP5;
uniform sampler2D uTex; uniform vec3 uAmb; uniform vec2 uGrade; uniform float uDim; uniform float uFloorTop;
uniform vec4 uL[${MAXL}]; uniform vec4 uLC[${MAXL}]; uniform int uLN;
varying vec2 vAB; varying float vZ; varying vec3 vW; varying float vStory; varying vec2 vCut; varying vec3 vPick;
${COMMON_FS}
float hsh(float a,float b){uint h=(uint(int(a))*374761393u)^(uint(int(b))*668265263u);return float(h%100u);}
float md(float n,float z){return n-z*floor(n/z);}
void main(){
  if(uMap>0.5){ if(vW.y>vCut.y+0.001) discard; if(uCutaway>0.5&&vW.y>vCut.x+0.001) discard; }
  if(uPick>0.5){ if(uMap>0.5&&vStory>uActive+0.5&&uAbove<0.5) discard; gl_FragColor=vec4(vPick,1.0); return; }
  float uu=vAB.x+uP1.z, vv=vAB.y+uP1.w;
  float U=uu*uP1.x-vv*uP1.y, V=uu*uP1.y+vv*uP1.x;
  float ts=uP0.y, ty=uP0.z, j=uP2.w; int fin=int(uP0.x+0.5); int mp=int(uP0.w+0.5);
  vec3 col=uColor; float m=1.0;
  if(fin==5&&uP3.w>0.5){
    vec2 tg; vec2 t;
    if(mp==2){ tg=vec2(U/uP5.z,V/uP5.w); t=tg; }
    else if(mp==1){ tg=vec2(U/ts,V/ty); vec2 a=mod(tg,2.0); t=vec2(a.x<=1.0?a.x:2.0-a.x,a.y<=1.0?a.y:2.0-a.y); }
    else { tg=vec2(U/ts,V/ty); t=fract(tg); }
    if(uP4.z>0.5) t.x=1.0-t.x; if(uP4.w>0.5) t.y=1.0-t.y;
    if(t.x>=0.0&&t.x<=1.0&&t.y>=0.0&&t.y<=1.0){
      vec4 s=textureGrad(uTex,t,dFdx(tg),dFdy(tg)); float alpha=uP2.x*s.a; float tint=uP2.y;
      vec3 tc=s.rgb*255.0*(1.0-tint+tint*uColor/255.0); col=col*(1.0-alpha)+tc*alpha; }
  } else if(fin==2){ float row=floor(V/(ty*.24)); float seam=md(V,ty*.24); float joint=md(U+md(row,3.0)*ts*.37,ts*1.8);
    m=(seam<j||joint<j)?.55:.88+(sin(V*230.0+sin(U*4.0)*2.0)*.025)+md(row*37.0,7.0)*.024; }
  else if(fin==3){ m=(md(U,ts)<j||md(V,ty)<j)?.53:(md(floor(U/ts)+floor(V/ty),2.0)<0.5?1.0:.92); }
  else if(fin==4){ float row=floor(V/(ty*.32)); m=(md(U+md(row,2.0)*ts*.5,ts)<j||md(V,ty*.32)<j)?.55:.83+md(row*17.0+floor(U/ts)*7.0,5.0)*.035; }
  else if(fin==1){ m=.93+hsh(floor(U*73.0),floor(V*73.0))*.001; }
  else if(fin==9){ if(md(floor(U/ts)+floor(V/ty),2.0)>0.5) col=uSecondary; m=(md(U,ts)<j||md(V,ty)<j)?.65:1.0; }
  else if(fin==6){ if(md(U,ts)<ts*.30) col=uSecondary; m=.96+.025*sin(V*200.0); }
  else if(fin==7){ m=.83+hsh(floor(U*150.0),floor(V*150.0))*.002; }
  else if(fin==8){ float h=hsh(floor(U*28.0/ts),floor(V*28.0/ty)); if(md(h,13.0)<3.0) col=uSecondary; m=.85+h*.0015; }
  if(vZ>-1000.0){ if(vZ<uP5.x){col=uBaseColor;m=1.0;} if(vZ>uP5.w-uP5.y){col=uCapColor;m=1.0;} }
  if(uP2.z>0.0){ float h=hsh(floor(U*23.0),floor(V*23.0)); float stain=.5+.5*sin(U*2.9+sin(V*3.1)); m*=1.0-uP2.z*(.24*stain+.22*h/100.0); }
  float y=dot(col,vec3(.299,.587,.114));
  if(abs(uP4.y)>1e-5||abs(uP4.x-1.0)>1e-5){ float i=.596*col.r-.275*col.g-.321*col.b, q=.212*col.r-.523*col.g+.311*col.b; float ii=i*uP4.x-q*uP4.y, qq=i*uP4.y+q*uP4.x; col=vec3(y+.956*ii+.621*qq,y-.272*ii-.647*qq,y-1.106*ii+1.703*qq); }
  col=((y+(col-y)*uP3.z-127.5)*uP3.y+127.5)*uP3.x;
  vec3 f=uAmb;
  for(int k=0;k<${MAXL};k++){ if(k>=uLN) break; vec4 L=uL[k]; float d=distance(vW.xz,L.xy)/L.z; if(d<1.0){ float kk=pow(1.0-d,uLC[k].w)*L.w; f+=kk*uLC[k].rgb; } }
  f*=uDim; vec3 c=col*m*f; float Y=dot(c,vec3(.299,.587,.114)); c=(Y+(c-Y)*uGrade.x-127.5)*uGrade.y+127.5;
  if(uGridStep>0.0&&uFloorTop>0.5){ vec2 gq=vAB/uGridStep; vec2 ga=abs(fract(gq-0.5)-0.5); vec2 gd=ga/max(fwidth(gq),vec2(1e-5)); float line=1.0-clamp(min(gd.x,gd.y),0.0,1.0);
    if(uMap>0.5) c=mix(c,vec3(194.,203.,208.),.2*line); else { float wl=.009/uGridStep; float l2=max(line,(ga.x<wl||ga.y<wl)?1.0:0.0); c=mix(c,c*.6+vec3(150.,160.,170.)*.4,l2); } }
  c=clamp(c,0.0,255.0)/255.0; c=hazeAndGhost(c,vW,vStory);
  gl_FragColor=vec4(c,1.0);
}`;
const OBJ_VS=`varying vec2 vUv; varying vec3 vW; void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;
const OBJ_FS=`uniform sampler2D uTex; uniform vec3 uF; uniform vec2 uGrade; uniform float uOpacity; uniform float uStory; uniform vec3 uPickC;
varying vec2 vUv; varying vec3 vW;
${COMMON_FS}
void main(){ vec4 t=texture2D(uTex,vUv); float a=t.a*uOpacity; if(a<0.03) discard;
  if(uPick>0.5){ if(a<0.1) discard; if(uMap>0.5&&uStory>uActive+0.5&&uAbove<0.5) discard; gl_FragColor=vec4(uPickC,1.0); return; }
  vec3 c=t.rgb*255.0*uF; float Y=dot(c,vec3(.299,.587,.114)); c=(Y+(c-Y)*uGrade.x-127.5)*uGrade.y+127.5; c=clamp(c,0.0,255.0)/255.0;
  c=hazeAndGhost(c,vW,uStory); gl_FragColor=vec4(c,a); }`;
const MATTE_FS=`uniform sampler2D uTex; uniform float uAlpha; uniform vec3 uPickC; uniform float uStory;
varying vec2 vUv; varying vec3 vW;
${COMMON_FS}
void main(){ if(uMap>0.5) discard; vec4 t=texture2D(uTex,vUv); float a=t.a*uAlpha; if(a<0.01) discard;
  if(uPick>0.5){ gl_FragColor=vec4(uPickC,1.0); return; }
  vec3 c=hazeAndGhost(t.rgb,vW,uStory); gl_FragColor=vec4(c,a); }`;
const GLASS_FS=`uniform vec3 uColor; uniform float uAlpha; uniform float uStory;
varying vec2 vUv; varying vec3 vW;
${COMMON_FS}
void main(){ if(uPick>0.5) discard; vec3 c=hazeAndGhost(uColor/255.0,vW,uStory); gl_FragColor=vec4(c,uAlpha); }`;
const PROP_VS=`varying vec2 vUv; varying vec3 vW; varying vec3 vN; void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
// placed 3D objects: the model's own picture, the look's colour changes, the room's light pools, a simple sun-side shade, haze
const PROP_FS=`uniform sampler2D uTex; uniform vec3 uTint; uniform vec4 uAdj; uniform vec2 uHue; uniform float uOpacity; uniform float uStory; uniform vec3 uPickC;
uniform vec3 uAmb; uniform vec2 uGrade; uniform float uDim; uniform vec4 uL[${MAXL}]; uniform vec4 uLC[${MAXL}]; uniform int uLN;
varying vec2 vUv; varying vec3 vW; varying vec3 vN;
${COMMON_FS}
void main(){
  if(uPick>0.5){ if(uOpacity<0.6) discard; if(uMap>0.5&&uStory>uActive+0.5&&uAbove<0.5) discard; gl_FragColor=vec4(uPickC,1.0); return; }
  vec4 t=texture2D(uTex,vUv); vec3 col=t.rgb*255.0;
  col=col*(1.0-uAdj.w+uAdj.w*uTint/255.0);
  float y=dot(col,vec3(.299,.587,.114));
  if(abs(uHue.y)>1e-5){ float i=.596*col.r-.275*col.g-.321*col.b, q=.212*col.r-.523*col.g+.311*col.b; float ii=i*uHue.x-q*uHue.y, qq=i*uHue.y+q*uHue.x; col=vec3(y+.956*ii+.621*qq,y-.272*ii-.647*qq,y-1.106*ii+1.703*qq); }
  col=((y+(col-y)*uAdj.z-127.5)*uAdj.y+127.5)*uAdj.x;
  vec3 f=uAmb; for(int k=0;k<${MAXL};k++){ if(k>=uLN) break; vec4 L=uL[k]; float d=distance(vW.xz,L.xy)/L.z; if(d<1.0){ f+=pow(1.0-d,uLC[k].w)*L.w*uLC[k].rgb; } }
  vec3 N=normalize(vN); if(!gl_FrontFacing) N=-N; float lam=.66+.34*max(dot(N,normalize(vec3(-.35,.85,.42))),0.0);
  vec3 c=col*f*uDim*lam; float Y=dot(c,vec3(.299,.587,.114)); c=(Y+(c-Y)*uGrade.x-127.5)*uGrade.y+127.5;
  c=clamp(c,0.0,255.0)/255.0; c=hazeAndGhost(c,vW,uStory); gl_FragColor=vec4(c,uOpacity); }`;
const SKY_VS=`varying vec2 vNdc; void main(){ vNdc=position.xy; gl_Position=vec4(position.xy,0.9999,1.0); }`;
const SKY_FS=`uniform mat4 uInvPV; uniform vec3 uCamP; uniform float uPick;
uniform vec3 uTop; uniform vec3 uHor; uniform vec3 uBot; uniform float uCurve;
uniform float uHasImg; uniform sampler2D uImg; uniform vec2 uImgSize; uniform vec4 uS0; uniform vec4 uS1; uniform vec4 uS2; uniform vec3 uTint;
varying vec2 vNdc;
vec3 grad(float e){ if(e>=0.0) return mix(uHor,uTop,pow(clamp(e/1.5707963,0.0,1.0),uCurve)); return mix(uHor,uBot,pow(clamp(-e/0.35,0.0,1.0),0.7)); }
void main(){
  if(uPick>0.5){ gl_FragColor=vec4(0.0,0.0,0.0,1.0); return; }
  vec4 p=uInvPV*vec4(vNdc,1.0,1.0); vec3 d=normalize(p.xyz/p.w-uCamP);
  float hl=length(d.xz); float e=atan(d.y,max(hl,1e-6)); vec3 col=grad(e);
  if(uHasImg>0.5){
    float az=atan(d.x,-d.z)/6.2831853; float rep=uS0.y; float a=(az+uS0.x/360.0)*rep; float tile=floor(a); float u=a-tile;
    if(uS0.z>0.5&&mod(tile,2.0)>0.5) u=1.0-u; if(uS0.w>0.5) u=1.0-u;
    float hcyl=(uImgSize.y/uImgSize.x)*(6.2831853/rep)*uS1.y; float te=tan(clamp(e-uS1.z,-1.55,1.55));
    float v=uS1.x-te/hcyl;
    if(v>=0.0&&v<=1.0){ vec3 s=texture2D(uImg,vec2(u,v)).rgb*255.0; float y=dot(s,vec3(.299,.587,.114)); s=y+(s-y)*uS2.y; s*=uS2.x; s=mix(s,s*uTint/255.0,uS2.z);
      float w=1.0; if(uS1.w>0.0) w*=smoothstep(0.0,uS1.w,v); if(uS2.w>0.0) w*=smoothstep(0.0,uS2.w,1.0-v); col=mix(col,s,w); }
  }
  gl_FragColor=vec4(clamp(col,0.0,255.0)/255.0,1.0);
}`;

// ------------------------------------------------------------------ geometry helpers
function subtractRects(rect,holes){let out=[rect];for(const h of holes){const next=[];for(const r of out){const x0=Math.max(r.x,h.x),y0=Math.max(r.y,h.y),x1=Math.min(r.x+r.width,h.x+h.width),y1=Math.min(r.y+r.length,h.y+h.length);if(x1-x0<=1e-6||y1-y0<=1e-6){next.push(r);continue;}
  if(y0>r.y+1e-6)next.push({x:r.x,y:r.y,width:r.width,length:y0-r.y});if(r.y+r.length>y1+1e-6)next.push({x:r.x,y:y1,width:r.width,length:r.y+r.length-y1});if(x0>r.x+1e-6)next.push({x:r.x,y:y0,width:x0-r.x,length:y1-y0});if(r.x+r.width>x1+1e-6)next.push({x:x1,y:y0,width:r.x+r.width-x1,length:y1-y0});}out=next;}return out;}
function intersectRect(a,b){const x0=Math.max(a.x,b.x),y0=Math.max(a.y,b.y),x1=Math.min(a.x+a.width,b.x+b.width),y1=Math.min(a.y+a.length,b.y+b.length);return x1-x0>1e-6&&y1-y0>1e-6?{x:x0,y:y0,width:x1-x0,length:y1-y0}:null;}
function slabTop(p,w){const cap=C.wallCap(p,w),sh=p.storyHeight||3.2;if(w.partitionId||cap!==p.wallHeight||sh<=cap+1e-6)return cap;
  const st=w.story||0,above=[...p.rooms,...(p.floorSections||[])].filter(r=>(r.story||0)===st+1),fx=w.axis==='h'?'y':'x',ax=w.axis==='h'?'x':'y',dim=w.axis==='h'?'width':'length',fd=w.axis==='h'?'length':'width';
  return above.some(r=>w.fixed>=r[fx]-1e-6&&w.fixed<=r[fx]+r[fd]+1e-6&&Math.min(w.end,r[ax]+r[dim])-Math.max(w.start,r[ax])>1e-6)?sh:cap;}
function roomLightPack(p,r){
  const a=r.light,t=a.tintStrength,b=a.brightness*Math.pow(2,a.exposure||0),tint=rgb(a.tint).map(x=>x/255);
  const lights=p.lights.filter(l=>l.roomId===r.id&&l.enabled).slice(0,MAXL);
  return {amb:[b*(1-t+t*tint[0]),b*(1-t+t*tint[1]),b*(1-t+t*tint[2])],grade:[a.saturation??1,a.contrast??1],lights:lights.map(l=>({x:l.x,y:l.y,r:l.radius,i:l.intensity,c:rgb(l.color).map(x=>x/255),f:l.falloff??2})),key:JSON.stringify([a,lights])};
}
function lightFactor(pack,x,y){let f=[...pack.amb];for(const l of pack.lights){const d=Math.hypot(x-l.x,y-l.y)/l.r;if(d<1){const k=Math.pow(1-d,l.f)*l.i;f[0]+=k*l.c[0];f[1]+=k*l.c[1];f[2]+=k*l.c[2];}}return f;}
function idColor(id){return [(id&255)/255,((id>>8)&255)/255,((id>>16)&255)/255];}

class Group{constructor(mat){this.mat=mat;this.pos=[];this.ab=[];this.z=[];this.story=[];this.cut=[];this.pick=[];this.idx=[];}
  quad(P,AB,Z,story,cut,pick){const b=this.pos.length/3;for(let k=0;k<4;k++){this.pos.push(P[k][0],P[k][1],P[k][2]);this.ab.push(AB[k][0],AB[k][1]);this.z.push(Z[k]);this.story.push(story);this.cut.push(cut[0],cut[1]);this.pick.push(pick[0],pick[1],pick[2]);}this.idx.push(b,b+1,b+2,b,b+2,b+3);}
  mesh(){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(this.pos,3));g.setAttribute('aAB',new T.Float32BufferAttribute(this.ab,2));g.setAttribute('aZ',new T.Float32BufferAttribute(this.z,1));g.setAttribute('aStory',new T.Float32BufferAttribute(this.story,1));g.setAttribute('aCut',new T.Float32BufferAttribute(this.cut,2));g.setAttribute('aPick',new T.Float32BufferAttribute(this.pick,3));g.setIndex(this.idx);g.computeBoundingSphere();const m=new T.Mesh(g,this.mat);m.matrixAutoUpdate=false;return m;}}

class Engine{
  constructor(canvas,legacy){
    this.canvas=canvas;this.legacy=legacy;
    this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:false});
    T.ColorManagement.enabled=false;this.renderer.outputColorSpace=T.LinearSRGBColorSpace;this.renderer.setClearColor(0x0b1018,1);this.renderer.autoClear=false;
    this.maxAniso=this.renderer.capabilities.getMaxAnisotropy();
    this.G={uMap:{value:0},uActive:{value:0},uRef:{value:1},uAbove:{value:0},uCutaway:{value:1},uPick:{value:0},uHaze:{value:new T.Vector4(0,0,0,0)},uHazeR:{value:new T.Vector3(20,180,.4)},uCam:{value:new T.Vector3()},uBg:{value:new T.Vector3(11/255,16/255,24/255)},uGridStep:{value:0}};
    this.scene=new T.Scene();this.root=new T.Group();this.scene.add(this.root);this.dynamic=new T.Group();this.dynamic.name='dynamic';this.scene.add(this.dynamic); // dynamic: NPC cards and traffic sprites drawn only in first person
    this.props=new T.Group();this.props.name='props';this.scene.add(this.props);this.propEntries=new Map();this.propTex=new Map();this.propsRev=0;this._propsP=null;this._propsLib=-1;this.onNeedsDraw=null;
    this.objects=[];this.mattes=[];this.tags=[null];
    this.camera=new T.PerspectiveCamera(60,1,.075,800);this.mapCam=new T.Camera();this.mapCam.matrixAutoUpdate=false;this.mapCam.matrixWorldAutoUpdate=false;
    this.textures=new Map();this.doorTextures=new Map();this.materials=new Map();this.archKey=null;this.objKey=null;this.rts=new Map();
    this.sky=this.makeSky();this.skyScene=new T.Scene();this.skyScene.add(this.sky);this.stats={builds:0,lastBuildMs:0,meshes:0,materials:0};
  }
  get images(){return this.legacy?.images||new Map();}
  get catalog(){return this.legacy?.catalog||new Map();}
  setLegacy(legacy){this.clearPropResources();this.legacy=legacy;this.invalidate();for(const t of this.textures.values())t.dispose();this.textures.clear();}
  dispose(){this.clearPropResources();this.clearScene();for(const t of this.textures.values())t.dispose();for(const t of this.doorTextures.values())t.dispose();for(const rt of this.rts.values())rt.dispose();this.renderer.dispose();}
  // ---------------------------------------------------------------- textures
  texture(id,kind='surface',filter='pixel'){
    if(!id)return null;const key=kind+':'+id+(kind==='surface'&&filter==='smooth'?':smooth':'');if(this.textures.has(key))return this.textures.get(key);
    const im=this.images.get(id);if(!im||!im.complete||!im.naturalWidth)return null;
    const t=new T.Texture(im);t.flipY=false;t.colorSpace=T.NoColorSpace;t.generateMipmaps=true;
    if(kind==='surface'){t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=filter==='smooth'?T.LinearFilter:T.NearestFilter;t.minFilter=T.LinearMipmapLinearFilter;t.anisotropy=Math.min(8,this.maxAniso);}
    else if(kind==='sky'){t.wrapS=T.RepeatWrapping;t.wrapT=T.ClampToEdgeWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.anisotropy=Math.min(8,this.maxAniso);}
    else {t.wrapS=t.wrapT=T.ClampToEdgeWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.anisotropy=Math.min(4,this.maxAniso);}
    t.needsUpdate=true;this.textures.set(key,t);return t;
  }
  blankTex(){if(!this._blank){const d=new Uint8Array([255,255,255,255]);this._blank=new T.DataTexture(d,1,1);this._blank.needsUpdate=true;}return this._blank;}
  doorTexture(p,o,room){
    const key=JSON.stringify([o.id,o.width,o.height,o.leaves,o.doorStyle,o.panelColor,o.handleColor,o.textureId,o.frameWidth,o.trim]);
    if(this.doorTextures.has(key))return this.doorTextures.get(key);
    let canvas;try{const l=C.openingLine(p,o),W=256,H=Math.max(64,Math.min(512,Math.round(W*o.height/o.width)));canvas=this.legacy.surfaceCanvas(p,room,C.surface(o.panelColor),{w:o.width,h:o.height,origin:l.start},W,H,{neutral:true,door:o});}catch(e){canvas=null;}
    const t=canvas?new T.CanvasTexture(canvas):this.blankTex();if(canvas){t.flipY=false;t.colorSpace=T.NoColorSpace;t.wrapS=t.wrapT=T.ClampToEdgeWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;}
    this.doorTextures.set(key,t);if(this.doorTextures.size>200){const k=this.doorTextures.keys().next().value;this.doorTextures.get(k).dispose?.();this.doorTextures.delete(k);}return t;
  }
  // ---------------------------------------------------------------- materials
  surfMat(style,pack,dim,kind,texOverride=null){
    const s={...C.SURFACE_EXTRA,...style},key=JSON.stringify([s,pack.key,dim,kind,texOverride?texOverride.uuid:null]);
    if(this.materials.has(key)){const m=this.materials.get(key);m.userData.used=true;return m;}
    const tex=texOverride||(s.finish==='image'?this.texture(s.textureId,'surface',s.filter):null);
    const L=[],LC=[];for(let k=0;k<MAXL;k++){const l=pack.lights[k];L.push(new T.Vector4(l?l.x:0,l?l.y:0,l?l.r:1,l?l.i:0));LC.push(new T.Vector4(l?l.c[0]:0,l?l.c[1]:0,l?l.c[2]:0,l?l.f:2));}
    const a=C.rad(s.angle||0),h=C.rad(s.hue||0),tileY=s.tileSizeY??s.tileSize;
    const space=s._space||[1,1];
    const u={...this.G,uColor:{value:v3(s.color)},uSecondary:{value:v3(s.secondary)},uBaseColor:{value:v3(s.baseColor)},uCapColor:{value:v3(s.capColor)},
      uP0:{value:new T.Vector4(FIN[s.finish]??0,s.tileSize,tileY,MAP_MODE[s.mapping]??0)},uP1:{value:new T.Vector4(Math.cos(a),Math.sin(a),s.offsetX||0,s.offsetY||0)},
      uP2:{value:new T.Vector4(s.textureOpacity??1,s.tintStrength||0,s.wear||0,s.jointWidth??.015)},uP3:{value:new T.Vector4(s.brightness??1,s.contrast??1,s.saturation??1,tex?1:0)},
      uP4:{value:new T.Vector4(Math.cos(h),Math.sin(h),s.flipX?1:0,s.flipY?1:0)},uP5:{value:new T.Vector4(s.baseHeight||0,s.capHeight||0,space[0],space[1])},
      uTex:{value:tex||this.blankTex()},uAmb:{value:new T.Vector3(...pack.amb)},uGrade:{value:new T.Vector2(...pack.grade)},uDim:{value:dim},uFloorTop:{value:kind==='floorTop'?1:0},
      uL:{value:L},uLC:{value:LC},uLN:{value:pack.lights.length}};
    const m=new T.ShaderMaterial({uniforms:u,vertexShader:SURF_VS,fragmentShader:SURF_FS,side:T.FrontSide});m.userData.used=true;m.userData.key=key;this.materials.set(key,m);return m;
  }
  objMat(tex,f,grade,opacity,story,pick,blend=true){return new T.ShaderMaterial({uniforms:{...this.G,uTex:{value:tex},uF:{value:new T.Vector3(...f)},uGrade:{value:new T.Vector2(...grade)},uOpacity:{value:opacity},uStory:{value:story},uPickC:{value:new T.Vector3(...pick)}},vertexShader:OBJ_VS,fragmentShader:OBJ_FS,side:T.DoubleSide,transparent:blend,depthWrite:true});}
  makeSky(){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));
    const m=new T.ShaderMaterial({uniforms:{uInvPV:{value:new T.Matrix4()},uCamP:{value:new T.Vector3()},uPick:this.G.uPick,uTop:{value:new T.Vector3()},uHor:{value:new T.Vector3()},uBot:{value:new T.Vector3()},uCurve:{value:1},uHasImg:{value:0},uImg:{value:null},uImgSize:{value:new T.Vector2(1,1)},uS0:{value:new T.Vector4()},uS1:{value:new T.Vector4()},uS2:{value:new T.Vector4()},uTint:{value:new T.Vector3(255,255,255)}},vertexShader:SKY_VS,fragmentShader:SKY_FS,depthTest:false,depthWrite:false});
    const mesh=new T.Mesh(g,m);mesh.frustumCulled=false;return mesh;}
  // ---------------------------------------------------------------- scene building
  clearScene(){for(const m of [...this.root.children]){this.root.remove(m);m.geometry?.dispose();if(m.userData.ownMaterial)m.material.dispose();}this.objects=[];this.mattes=[];}
  architectureKey(p){return JSON.stringify([p.rooms,p.floorSections,p.ceilingCuts,p.ceilingPatches,p.pillars,p.partitions,p.openings,p.lights,p.wallHeight,p.storyHeight,p.stairs,p.floorCuts,p.stories.length,p.objects,[...this.catalog.keys()]]);}
  invalidate(){this._lastP=null;this.archKey=null;this._propsP=null;}
  invalidateProps(){this._propsP=null;}
  sync(p){if(p===this._lastP&&this.archKey)return false;this._lastP=p;const key=this.architectureKey(p);if(key===this.archKey)return false;const t0=performance.now();this.build(p);this.archKey=key;this.stats.builds++;this.stats.lastBuildMs=Math.round(performance.now()-t0);return true;}
  build(p){
    this.clearScene();for(const m of this.materials.values())m.userData.used=false;
    const tags=this.tags=[null],tagIds=new Map(),tag=meta=>{const k=JSON.stringify(meta);if(tagIds.has(k))return tagIds.get(k);const id=tags.push(meta)-1;tagIds.set(k,id);return id;};
    const groups=new Map(),grp=mat=>{let g=groups.get(mat);if(!g){g=new Group(mat);groups.set(mat,g);}return g;};
    const packs=new Map(),pack=r=>{if(!r)r=p.rooms[0];if(!packs.has(r.id))packs.set(r.id,roomLightPack(p,r));return packs.get(r.id);};
    const elev=s=>C.storyElevation(p,s||0),NOCUT=[1e6,1e6],HIDE=[-1e9,-1e9];
    const P3=(x,y,z)=>[x,z,y];
    const hquad=(g,r,z,up,abFn,story,cut,pick)=>{const c=[[r.x,r.y],[r.x+r.width,r.y],[r.x+r.width,r.y+r.length],[r.x,r.y+r.length]];const order=up?[3,2,1,0]:[0,1,2,3];
      // up=true: counter-clockwise seen from above (three: +Y)
      g.quad(order.map(k=>P3(c[k][0],c[k][1],z)),order.map(k=>abFn(c[k][0],c[k][1])),[-1e4,-1e4,-1e4,-1e4],story,cut,pick);};
    const vquad=(g,axis,fixed,s0,s1,z0,z1,base,plus,abFn,story,cut,pick)=>{
      const A0=axis==='h'?P3(s0,fixed,base+z0):P3(fixed,s0,base+z0),B0=axis==='h'?P3(s1,fixed,base+z0):P3(fixed,s1,base+z0),B1=axis==='h'?P3(s1,fixed,base+z1):P3(fixed,s1,base+z1),A1=axis==='h'?P3(s0,fixed,base+z1):P3(fixed,s0,base+z1);
      const ab=[abFn(s0,z0),abFn(s1,z0),abFn(s1,z1),abFn(s0,z1)],zz=[z0,z0,z1,z1];
      const fwd=axis==='h'?plus:!plus; // h: +y face is CCW A0,B0,B1,A1 ; v: -x face is CCW A0,B0,B1,A1
      if(fwd)g.quad([A0,B0,B1,A1],ab,zz,story,cut,pick);else g.quad([B0,A0,A1,B1],[ab[1],ab[0],ab[3],ab[2]],[z0,z0,z1,z1],story,cut,pick);};
    const withSpace=(s,w,h)=>({...s,_space:[w,h]});
    // floors -------------------------------------------------------
    const cutsOn=st=>(p.floorCuts||[]).filter(c=>(c.story||0)===st);
    for(const r of p.rooms){const st=r.story||0,z=elev(st),pk=pack(r),id=tag({kind:'room',id:r.id,face:'floor',story:st}),pc=idColor(id);
      for(const piece of subtractRects({x:r.x,y:r.y,width:r.width,length:r.length},cutsOn(st))){
        hquad(grp(this.surfMat(withSpace(r.floor,r.width,r.length),pk,1,'floorTop')),piece,z,true,(x,y)=>[x-r.x,y-r.y],st,NOCUT,pc);
        hquad(grp(this.surfMat(withSpace(r.ceiling,r.width,r.length),pk,.9,'floorBottom')),piece,z-.0005,false,(x,y)=>[x-r.x,y-r.y],st,HIDE,pc);}}
    (p.floorSections||[]).forEach((f,i)=>{const st=f.story||0,z=elev(st)+.0004*(i+1),host=C.floorSectionHost(p,f),pk=pack(host),id=tag({kind:'floorSection',id:f.id,story:st}),pc=idColor(id);
      for(const piece of subtractRects({x:f.x,y:f.y,width:f.width,length:f.length},cutsOn(st))){
        hquad(grp(this.surfMat(withSpace(f.floor,f.width,f.length),pk,1,'floorTop')),piece,z,true,(x,y)=>[x-f.x,y-f.y],st,NOCUT,pc);
        hquad(grp(this.surfMat(withSpace(f.underside,f.width,f.length),pk,.9,'floorBottom')),piece,z-.0006,false,(x,y)=>[x-f.x,y-f.y],st,HIDE,pc);}});
    // ceilings -----------------------------------------------------
    for(const r of p.rooms){const st=r.story||0,top=C.roomTop(p,r)-.002,pk=pack(r),id=tag({kind:'room',id:r.id,face:'ceiling',story:st}),pc=idColor(id);
      const patches=(p.ceilingPatches||[]).filter(q=>q.roomId===r.id),cuts=(p.ceilingCuts||[]).filter(q=>q.roomId===r.id),ab=(x,y)=>[x-r.x,y-r.y];
      if(!r.openAbove)for(const piece of subtractRects({x:r.x,y:r.y,width:r.width,length:r.length},[...cuts,...patches])){hquad(grp(this.surfMat(withSpace(r.ceiling,r.width,r.length),pk,.9,'ceiling')),piece,top,false,ab,st,HIDE,pc);hquad(grp(this.surfMat(withSpace(r.ceiling,r.width,r.length),pk,.9,'ceilingTop')),piece,top+.0004,true,ab,st,HIDE,pc);}
      for(const q of patches){const s=q.surface||r.ceiling;hquad(grp(this.surfMat(withSpace(s,r.width,r.length),pk,.9,'ceiling')),q,top,false,ab,st,HIDE,pc);hquad(grp(this.surfMat(withSpace(s,r.width,r.length),pk,.9,'ceilingTop')),q,top+.0004,true,ab,st,HIDE,pc);}}
    // walls --------------------------------------------------------
    const matteDone=new Set();
    for(const w of C.roomWalls(p)){
      const st=w.story||0,base=elev(st),cap=C.wallCap(p,w),slab=slabTop(p,w),dim=w.axis==='h'?1:.89;
      // faces: plus = +y (h) / +x (v); minus = the other side
      let faces;
      if(w.partitionId){const q=C.partitionById(p,w.partitionId),host=C.roomById(p,q.roomId),org=C.partitionLine(q).start;
        faces={plus:{style:q.faces.A,room:host,origin:org,len:q.length,tag:tag({kind:'partition',id:q.id,face:'A'})},minus:{style:q.faces.B,room:host,origin:org,len:q.length,tag:tag({kind:'partition',id:q.id,face:'B'})}};}
      else{const wt=tag({kind:'wall',id:w.id,owners:w.owners,story:st}),pick=side=>w.owners.find(o=>side==='plus'?(w.axis==='h'?o.side==='N':o.side==='W'):(w.axis==='h'?o.side==='S':o.side==='E'))||w.owners[0];
        const mk=o=>{const r=C.roomById(p,o.roomId),bl=C.wallBase(p,o);return {style:C.wallStyle(p,o),room:r,origin:bl.start,len:bl.end-bl.start,tag:wt,owner:o};};faces={plus:mk(pick('plus')),minus:mk(pick('minus'))};}
      const owner0=w.owners.find(o=>o.side==='N'||o.side==='W')||w.owners[0],front=!w.partitionId&&w.owners.length===1&&(owner0.side==='S'||owner0.side==='E');
      const cutH=w.partitionId?cap:Math.min(cap,front?.18:w.owners.length>1?1.35:cap),cutAttr=[base+cutH,base+cap],extCut=[base+cutH,base+cap];
      const faceMat=f=>{const local=f.style.coordinateMode!=='legacy',h=cap;return {mat:this.surfMat(withSpace(f.style,f.len||1,cap),pack(f.room),dim,'wall'),ab:(s,z)=>local?[s-f.origin,h-z]:[s,z]};};
      const fp=faceMat(faces.plus),fm=faceMat(faces.minus),pcP=idColor(faces.plus.tag),pcM=idColor(faces.minus.tag);
      const band=(s0,s1,z0,z1,cut)=>{if(z1-z0<1e-5||s1-s0<1e-5)return;vquad(grp(fp.mat),w.axis,w.fixed,s0,s1,z0,z1,base,true,fp.ab,st,cut,pcP);vquad(grp(fm.mat),w.axis,w.fixed,s0,s1,z0,z1,base,false,fm.ab,st,cut,pcM);};
      const ops=C.openingsForWall(p,w).map(o=>({o,l:C.openingLine(p,o)})).sort((a,b)=>a.l.start-b.l.start);
      const stops=[w.start,w.end];for(const {l} of ops)for(const x of [l.start,l.end])if(x>w.start+1e-6&&x<w.end-1e-6)stops.push(x);stops.sort((a,b)=>a-b);
      for(let i=0;i<stops.length-1;i++){const a=stops[i],b=stops[i+1];if(b-a<1e-6)continue;const mid=(a+b)/2,hit=ops.find(({l})=>mid>=l.start-1e-6&&mid<=l.end+1e-6);
        if(slab>cap+1e-6)band(a,b,cap,slab,extCut);
        if(!hit){band(a,b,0,cap,cutAttr);continue;}
        const {o,l}=hit;band(a,b,0,o.bottom,cutAttr);band(a,b,o.bottom+o.height,cap,cutAttr);
        const geo=C.openingGeometry(o),frame=geo.frame,ot=tag({kind:'opening',id:o.id}),opc=idColor(ot),fr=this.surfMat(C.surface(o.frameColor),pack(faces.plus.room),dim,'wall'),frm=this.surfMat(C.surface(o.frameColor),pack(faces.minus.room),dim,'wall');
        const fband=(s0,s1,z0,z1)=>{s0=Math.max(s0,a);s1=Math.min(s1,b);if(s1-s0<1e-5||z1-z0<1e-5)return;const ab=(s,z)=>[s,z];vquad(grp(fr),w.axis,w.fixed,s0,s1,z0,z1,base,true,ab,st,cutAttr,opc);vquad(grp(frm),w.axis,w.fixed,s0,s1,z0,z1,base,false,ab,st,cutAttr,opc);};
        const top=o.bottom+o.height;
        if(frame){fband(l.start,l.start+frame,o.bottom,top);fband(l.end-frame,l.end,o.bottom,top);fband(l.start,l.end,top-geo.head,top);if(o.kind==='window')fband(l.start,l.end,o.bottom,o.bottom+geo.sill);
          if(geo.divider>0){const m=(l.start+l.end)/2;fband(m-geo.divider/2,m+geo.divider/2,o.bottom+geo.sill,top-geo.head);}}
        const low=o.bottom+geo.sill,high=top-geo.head,s0=Math.max(a,l.start+frame),s1=Math.min(b,l.end-frame);
        if(o.kind==='door'&&!o.open&&s1-s0>1e-5){const room=faces.plus.room||p.rooms[0],tex=this.doorTexture(p,o,room),ds={...C.surface('#ffffff','image'),mapping:'stretch',_space:[o.width,o.height]};
          const dab=(s,z)=>[s-l.start,top-z];vquad(grp(this.surfMat(ds,pack(faces.plus.room),dim,'door',tex)),w.axis,w.fixed,s0,s1,low,high,base,true,dab,st,cutAttr,opc);vquad(grp(this.surfMat(ds,pack(faces.minus.room),dim,'door',tex)),w.axis,w.fixed,s0,s1,low,high,base,false,(s,z)=>[s-l.start,top-z],st,cutAttr,opc);}
        else if(o.kind==='window'&&(o.glassOpacity??.16)>.001&&s1-s0>1e-5)this.glassQuad(p,w,s0,s1,base+low,base+high,o,st);
        // exterior matte: one framed scene per room side, visible through that side's openings
        if(!w.partitionId&&w.owners.length===1){const own=w.owners[0],spec=C.backdropFor(p,own),k=own.roomId+':'+own.side;if(spec&&!matteDone.has(k)){matteDone.add(k);this.matteQuad(p,own,spec,st,tag({kind:'exterior',roomId:own.roomId,side:own.side}));}}
      }
    }
    // pillars ------------------------------------------------------
    for(const q of p.pillars||[]){const st=q.story||0,base=elev(st),host=C.roomAtStory(p,q,st)||p.rooms.find(r=>(r.story||0)===st)||p.rooms[0],pk=pack(host),pc=idColor(tag({kind:'pillar',id:q.id}));
      const mat=this.surfMat(withSpace(q.surface,q.width+q.depth,q.height),pk,.9,'pillar'),g=grp(mat),x0=q.x-q.width/2,x1=q.x+q.width/2,y0=q.y-q.depth/2,y1=q.y+q.depth/2,h=q.height;
      vquad(g,'h',y1,x0,x1,0,h,base,true,(s,z)=>[s-x0,z],st,NOCUT,pc);vquad(g,'h',y0,x0,x1,0,h,base,false,(s,z)=>[x1-s+q.width+q.depth,z],st,NOCUT,pc);
      vquad(g,'v',x1,y0,y1,0,h,base,true,(s,z)=>[q.width+(s-y0),z],st,NOCUT,pc);vquad(g,'v',x0,y0,y1,0,h,base,false,(s,z)=>[(y1-s)+q.width*2+q.depth,z],st,NOCUT,pc);
      hquad(g,{x:x0,y:y0,width:q.width,length:q.depth},base+h,true,(x,y)=>[x-x0,y-y0],st,NOCUT,pc);}
    // stairs -------------------------------------------------------
    for(const s of p.stairs||[]){const geo=C.stairGeometry(p,s),st=s.story||0,base=elev(st),host=C.roomAtStory(p,{x:s.x+s.width/2,y:s.y+s.length/2},st)||p.rooms[0],pk=pack(host),pc=idColor(tag({kind:'stairs',id:s.id}));
      const tread=this.surfMat(withSpace(s.surface,s.width,s.length),pk,1,'floorTop'),riser=this.surfMat(withSpace(s.surface,s.width,s.length),pk,.82,'pillar'),side=this.surfMat(withSpace(s.surface,s.width,s.length),pk,.9,'pillar');
      const d=geo.dir,n=geo.steps;
      for(let i=0;i<n;i++){const a0=i*geo.run,a1=(i+1)*geo.run,h=(i+1)*geo.rise;let r;
        if(s.dir==='N')r={x:s.x,y:s.y+s.length-a1,width:s.width,length:a1-a0};else if(s.dir==='S')r={x:s.x,y:s.y+a0,width:s.width,length:a1-a0};else if(s.dir==='E')r={x:s.x+a0,y:s.y,width:a1-a0,length:s.length};else r={x:s.x+s.width-a1,y:s.y,width:a1-a0,length:s.length};
        hquad(grp(tread),r,base+h,true,(x,y)=>[x-s.x,y-s.y],st,NOCUT,pc);
        const lo=i*geo.rise;
        if(s.dir==='N')vquad(grp(riser),'h',r.y+r.length,r.x,r.x+r.width,lo,h,base,true,(u,z)=>[u-s.x,z],st,NOCUT,pc);
        if(s.dir==='S')vquad(grp(riser),'h',r.y,r.x,r.x+r.width,lo,h,base,false,(u,z)=>[u-s.x,z],st,NOCUT,pc);
        if(s.dir==='E')vquad(grp(riser),'v',r.x,r.y,r.y+r.length,lo,h,base,false,(u,z)=>[u-s.y,z],st,NOCUT,pc);
        if(s.dir==='W')vquad(grp(riser),'v',r.x+r.width,r.y,r.y+r.length,lo,h,base,true,(u,z)=>[u-s.y,z],st,NOCUT,pc);
        if(s.dir==='N'||s.dir==='S'){vquad(grp(side),'v',r.x,r.y,r.y+r.length,0,h,base,false,(u,z)=>[u-s.y,z],st,NOCUT,pc);vquad(grp(side),'v',r.x+r.width,r.y,r.y+r.length,0,h,base,true,(u,z)=>[u-s.y,z],st,NOCUT,pc);}
        else{vquad(grp(side),'h',r.y,r.x,r.x+r.width,0,h,base,false,(u,z)=>[u-s.x,z],st,NOCUT,pc);vquad(grp(side),'h',r.y+r.length,r.x,r.x+r.width,0,h,base,true,(u,z)=>[u-s.x,z],st,NOCUT,pc);}}
      void d;}
    for(const g of groups.values()){const m=g.mesh();m.userData.kind='surface';this.root.add(m);}
    // objects ------------------------------------------------------
    for(const o of p.objects){if(!o.visible||o.opacity<=0)continue;const ob=this.makeObject(p,o,tag({kind:'object',id:o.id,blocks:o.blocks}));if(ob){this.root.add(ob);this.objects.push(ob);}}
    // drop materials nobody uses any more
    for(const [k,m] of this.materials)if(!m.userData.used){m.dispose();this.materials.delete(k);}
    this.stats.meshes=this.root.children.length;this.stats.materials=this.materials.size;
  }
  glassQuad(p,w,s0,s1,z0,z1,o,story){
    const g=new T.BufferGeometry(),A=w.axis==='h'?[[s0,w.fixed],[s1,w.fixed]]:[[w.fixed,s0],[w.fixed,s1]];
    g.setAttribute('position',new T.Float32BufferAttribute([A[0][0],z0,A[0][1],A[1][0],z0,A[1][1],A[1][0],z1,A[1][1],A[0][0],z1,A[0][1]],3));g.setAttribute('uv',new T.Float32BufferAttribute([0,1,1,1,1,0,0,0],2));g.setIndex([0,1,2,0,2,3]);
    const m=new T.Mesh(g,new T.ShaderMaterial({uniforms:{...this.G,uColor:{value:v3(o.glassColor)},uAlpha:{value:o.glassOpacity??.16},uStory:{value:story}},vertexShader:OBJ_VS,fragmentShader:GLASS_FS,side:T.DoubleSide,transparent:true,depthWrite:false}));
    m.userData.ownMaterial=true;m.userData.kind='glass';m.renderOrder=2;this.root.add(m);
  }
  matteQuad(p,owner,spec,story,tagId){
    const tex=this.texture(spec.assetId,'matte');if(!tex)return;const a=this.catalog.get(spec.assetId),iw=a?.width||tex.image.width,ih=a?.height||tex.image.height;
    const frame=C.backdropFrame(p,owner,spec),imageAspect=iw/ih,frameAspect=frame.width/frame.height;let sx=1,sy=1;
    if(spec.fit==='contain'){if(imageAspect>=frameAspect)sy=frameAspect/imageAspect;else sx=imageAspect/frameAspect;}else if(spec.fit!=='stretch'){if(imageAspect>=frameAspect)sx=imageAspect/frameAspect;else sy=frameAspect/imageAspect;}
    const zoom=spec.scale??1,ox=spec.offsetX??0,oy=spec.offsetY??0,uOf=x=>.5+(x-.5-ox)*sx*zoom,vOf=y=>.5+(y-.5-oy)*sy*zoom,dist=Math.max(.03,frame.distance||0);
    const c={x:frame.center.x+frame.outward.x*dist,y:frame.center.y+frame.outward.y*dist},pt=(x,y)=>{const u=uOf(x),v=vOf(y);return [c.x+frame.right.x*(u-.5)*frame.width,frame.baseZ+(1-v)*frame.height,c.y+frame.right.y*(u-.5)*frame.width];};
    const P00=pt(0,0),P10=pt(1,0),P11=pt(1,1),P01=pt(0,1),g=new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute([...P01,...P11,...P10,...P00],3));g.setAttribute('uv',new T.Float32BufferAttribute([0,1,1,1,1,0,0,0],2));g.setIndex([0,1,2,0,2,3]);
    const m=new T.Mesh(g,new T.ShaderMaterial({uniforms:{...this.G,uTex:{value:tex},uAlpha:{value:spec.alpha??1},uPickC:{value:new T.Vector3(...idColor(tagId))},uStory:{value:story}},vertexShader:OBJ_VS,fragmentShader:MATTE_FS,side:T.FrontSide,transparent:(spec.alpha??1)<1,depthWrite:true}));
    m.userData.ownMaterial=true;m.userData.kind='matte';m.renderOrder=-1;this.root.add(m);this.mattes.push(m);
  }
  makeObject(p,o,tagId){
    const room=C.roomById(p,o.roomId)||C.lightingRoomAt(p,o,o.story||0)||p.rooms[0],pk=roomLightPack(p,room),f=lightFactor(pk,o.x,o.y),grade=pk.grade;
    const tex0=this.texture(o.viewAssetId||o.assetId,'object');if(!tex0)return null;
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(new Array(12).fill(0),3));g.setAttribute('uv',new T.Float32BufferAttribute([0,0,1,0,1,1,0,1],2));g.setIndex([0,1,2,0,2,3]);
    const mat=this.objMat(tex0,f,grade,o.opacity,o.story||0,idColor(tagId),true);if(o.surface==='floor'){mat.polygonOffset=true;mat.polygonOffsetFactor=-2;mat.polygonOffsetUnits=-2;}
    const mesh=new T.Mesh(g,mat);mesh.userData={ownMaterial:true,kind:'object',object:C.clone(o),floorZ:C.storyElevation(p,o.story||0),lastKey:null};mesh.frustumCulled=false;mesh.renderOrder=1;return mesh;
  }
  // place / orient every object for the camera that is about to draw
  layoutObjects(mode,cam,frame){
    for(const mesh of this.objects){const o=mesh.userData.object,z=mesh.userData.floorZ,pos=mesh.geometry.attributes.position,uv=mesh.geometry.attributes.uv;
      let slot='front';if(mode==='fp'&&o.surface==='sprite'){slot=C.facingSlot(o,{x:cam.x,y:cam.y});}
      const art=mode==='fp'?(o.variants?.[slot]||o.viewAssetId||o.assetId):(o.surface==='panel'?o.viewAssetId:o.isoAssetId)||o.assetId,tex=this.texture(art,'object');if(tex&&mesh.material.uniforms.uTex.value!==tex)mesh.material.uniforms.uTex.value=tex;
      const a=this.catalog.get(art)||{width:1,height:1},aspect=(a.width||1)/(a.height||1);
      const key=JSON.stringify([mode,o.surface,mode==='fp'?[Math.round(cam.x*200),Math.round(cam.y*200),Math.round(cam.facing*20)]:frame?.mode,art]);if(key===mesh.userData.lastKey)continue;mesh.userData.lastKey=key;
      let pts;const fx=o.flipX,fy=o.flipY;
      if(o.surface==='floor'||(mode==='map'&&frame?.mode==='plan'&&o.surface==='sprite')){const b=C.basis(o.facing),pt=(u,t)=>[o.x+(u-.5)*o.width*b.rx-(t-.5)*o.depth*b.fx,z+(o.surface==='floor'?o.mount:0)+.003,o.y+(u-.5)*o.width*b.ry-(t-.5)*o.depth*b.fy];pts=[pt(0,0),pt(1,0),pt(1,1),pt(0,1)];}
      else if(o.surface==='panel'){const b=C.basis(o.facing),pt=(u,t)=>[o.x-(u-.5)*o.width*b.rx,z+o.mount+(1-t)*o.height,o.y-(u-.5)*o.width*b.ry];pts=[pt(0,0),pt(1,0),pt(1,1),pt(0,1)];}
      else{let right,W,H;
        if(mode==='fp'){const b=C.basis(cam.facing);right={x:b.rx,y:b.ry};H=o.height;W=o.artFit!=='stretch'?H*aspect:o.width;}
        else{const s=frame.s;right={x:Math.SQRT1_2,y:-Math.SQRT1_2};const hS=(o.height*1.1+o.depth*.5)*s,wS=o.artFit!=='stretch'?hS*aspect:(o.width+o.depth*.55)*s;W=wS/(Math.SQRT2*s);H=hS/(1.1*s);}
        const left=-o.anchorX*W,bottom=z+o.mount-(1-o.anchorY)*H,rot=C.rad(o.rotation||0),cx=left+W/2,cz=bottom+H/2,rc=Math.cos(rot),rs=Math.sin(rot);
        // art rotation turns the picture clockwise on screen around its centre, like the 2D renderer
        const corner=(u,t)=>{const dx0=left+u*W-cx,dz0=bottom+(1-t)*H-cz,dx=dx0*rc+dz0*rs,dz=-dx0*rs+dz0*rc;return [o.x+right.x*(cx+dx),cz+dz,o.y+right.y*(cx+dx)];};
        pts=[corner(0,0),corner(1,0),corner(1,1),corner(0,1)];}
      for(let k=0;k<4;k++)pos.setXYZ(k,pts[k][0],pts[k][1],pts[k][2]);pos.needsUpdate=true;
      const U=[0,1,1,0],V=[0,0,1,1];for(let k=0;k<4;k++)uv.setXY(k,fx?1-U[k]:U[k],fy?1-V[k]:V[k]);uv.needsUpdate=true;mesh.geometry.computeBoundingSphere();
    }
  }
  // ---------------------------------------------------------------- placed 3D objects (0.14)
  // Each library model is loaded once by RCAssets; every placed copy clones its node tree (geometry is shared) and gets
  // its own small material (room light, look, pick colour). Only objects whose data changed are rebuilt.
  clearPropResources(){for(const e of this.propEntries.values())this.removeProp(e);this.propEntries.clear();for(const e of this.propTex.values())e.tex?.dispose();this.propTex.clear();this._propsP=null;}
  propTexture(kind,ref,filter,base){
    const pixel=filter!=='smooth',key=kind+'|'+ref+'|'+(pixel?'p':'s');let e=this.propTex.get(key);if(e)return e.tex;
    const make=img=>{const t=new T.Texture(img);t.flipY=false;t.colorSpace=T.NoColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=pixel?T.NearestFilter:T.LinearFilter;t.minFilter=pixel?T.NearestMipmapNearestFilter:T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;};
    if(kind==='base'){const t=base.clone();t.magFilter=pixel?T.NearestFilter:T.LinearFilter;t.minFilter=pixel?T.NearestMipmapNearestFilter:T.LinearMipmapLinearFilter;t.needsUpdate=true;this.propTex.set(key,{tex:t});return t;}
    e={tex:null};this.propTex.set(key,e);const A=window.RCAssets,done=img=>{if(this.propTex.get(key)!==e)return;e.tex=make(img);for(const en of this.propEntries.values())if(en.waitTex)en.key=''; /* objects drawn before this picture arrived are rebuilt with it */this._propsP=null;this.onNeedsDraw?.();},failed=()=>{e.failed=true;};
    if(kind==='library'){const en=A?.entry(ref);if(en)A.imageOf(en.working_path).then(done,failed);else failed();}
    else if(kind==='data'){const im=new Image();im.onload=()=>done(im);im.onerror=failed;im.src=ref;}
    else if(kind==='image'){const im=this.images.get(ref);if(im?.complete&&im.naturalWidth)e.tex=make(im);else failed();}
    return e.tex;}
  propMaterial(p,q,app,tex,tagId,opacity){
    const room=C.roomById(p,q.roomId)||C.lightingRoomAt?.(p,q,q.story||0)||p.rooms[0],pk=roomLightPack(p,room),L=[],LC=[];
    for(let k=0;k<MAXL;k++){const l=pk.lights[k];L.push(new T.Vector4(l?l.x:0,l?l.y:0,l?l.r:1,l?l.i:0));LC.push(new T.Vector4(l?l.c[0]:0,l?l.c[1]:0,l?l.c[2]:0,l?l.f:2));}
    const h=C.rad(Number(app.hue)||0),num=(v,d)=>Number.isFinite(Number(v))?Number(v):d,tint=/^#[0-9a-f]{6}$/i.test(app.tint||'')?app.tint:'#ffffff';
    return new T.ShaderMaterial({uniforms:{...this.G,uTex:{value:tex||this.blankTex()},uTint:{value:v3(tint)},uAdj:{value:new T.Vector4(num(app.brightness,1),num(app.contrast,1),num(app.saturation,1),num(app.tintStrength,0))},uHue:{value:new T.Vector2(Math.cos(h),Math.sin(h))},
      uOpacity:{value:opacity},uStory:{value:q.story||0},uPickC:{value:new T.Vector3(...idColor(tagId))},uAmb:{value:new T.Vector3(...pk.amb)},uGrade:{value:new T.Vector2(...pk.grade)},uDim:{value:1},uL:{value:L},uLC:{value:LC},uLN:{value:pk.lights.length}},
      vertexShader:PROP_VS,fragmentShader:PROP_FS,side:T.DoubleSide,transparent:opacity<1,depthWrite:opacity>=1});}
  propEntryKey(p,q,t,app){const pv=app.palette?C.paletteVariantById(p,app.palette):null,room=C.roomById(p,q.roomId);
    return JSON.stringify([q.asset,q.x,q.y,q.z,q.story,q.rotation,q.scale,q.enabled,q.roomId,t.status,t.scene?1:0,app,pv?[pv.image?.length,String(pv.image||'').slice(-32)]:0,room?roomLightPack(p,room).key:'',C.propFrontTurn((p.objectLibrary?.setups||{})[q.asset])]);}
  syncProps(p,mode){
    const A=window.RCAssets,lib=A?A.revision:0;if(this._propProvider!==A?.state.provider){this.clearPropResources();this._propProvider=A?.state.provider;}
    if(p!==this._propsP||lib!==this._propsLib||this._tagsRef!==this.tags){
      this._propsP=p;this._propsLib=lib;const list=p.props||[],seen=new Set(),retag=this._tagsRef!==this.tags;this._tagsRef=this.tags;let changed=false;
      for(const q of list){seen.add(q.id);const t=A?A.template(q.asset):{status:'offline'},app=C.propAppearance(p,q);delete app.from;delete app.look;
        const key=this.propEntryKey(p,q,t,app);let e=this.propEntries.get(q.id);
        if(e&&e.key===key&&!retag)continue;if(e&&e.key===key&&retag){e.tag=this.tags.push({kind:'prop',id:q.id})-1;e.obj.traverse(o=>{if(o.material?.uniforms?.uPickC)o.material.uniforms.uPickC.value.set(...idColor(e.tag));});continue;}
        if(e)this.removeProp(e);e=this.makeProp(p,q,t,app);e.key=key;this.propEntries.set(q.id,e);this.props.add(e.obj);changed=true;}
      for(const [id,e] of this.propEntries)if(!seen.has(id)){this.removeProp(e);this.propEntries.delete(id);changed=true;}
      if(changed||retag)this.propsRev++;}
    // switched-off objects: faint in the map so they can be found, absent in first person
    for(const e of this.propEntries.values()){if(!e.disabled)continue;e.obj.visible=mode==='map';}
  }
  makeProp(p,q,t,app){
    const tag=this.tags.push({kind:'prop',id:q.id})-1,setup=(p.objectLibrary?.setups||{})[q.asset],floorZ=C.propFloorZ(p,q),disabled=q.enabled===false;
    let obj,waitTex=false;
    if(t.status==='ready'&&t.scene){
      const en=t.entry,issues=C.propAppearanceIssues(p,q,en,id=>window.RCAssets?.entry(id),id=>this.catalog.has(id),t),pal=en.material_system==='palette'&&!t.paletteMismatch,filter=app.filter||(en.recommended_filter==='linear'?'smooth':'pixel');let tex=null,want=false;
      if(pal&&app.palette&&!issues.some(i=>i.field==='palette')){const pv=C.paletteVariantById(p,app.palette);want=true;if(pv?.image)tex=this.propTexture('data',pv.image,filter);else if(window.RCAssets?.entry(app.palette)?.asset_type==='palette')tex=this.propTexture('library',app.palette,filter);else want=false;}
      if(!tex&&app.texture&&typeof app.texture==='object'&&!issues.some(i=>i.field==='texture')){want=true;if(app.texture.library)tex=this.propTexture('library',app.texture.library,filter);else if(app.texture.image)tex=this.propTexture('image',app.texture.image,filter);}
      waitTex=want&&!tex;
      if(!tex&&t.baseTexture)tex=this.propTexture('base',q.asset,filter,t.baseTexture);
      const mat=this.propMaterial(p,q,app,tex,tag,disabled?.35:1);obj=t.scene.clone(true);obj.traverse(o=>{if(o.isMesh){o.material=mat;o.frustumCulled=true;}});obj.userData.mats=[mat];obj.userData.appearanceIssues=issues;
    }else{
      // placeholder: a box of the right size. Grey while loading; pink when the model is missing from the library
      const b=C.propBoundsOf(q,t.entry?.dims?{min:[-t.entry.dims[0]/2,0,-t.entry.dims[2]/2],max:[t.entry.dims[0]/2,t.entry.dims[1],t.entry.dims[2]/2]}:null),g=this._unitBox||(this._unitBox=new T.BoxGeometry(1,1,1).translate(0,.5,0));
      const missing=t.status!=='loading',mat=this.propMaterial(p,q,{tint:missing?'#ff4fa8':'#9aa6b2',tintStrength:1},null,tag,disabled?.3:missing?.78:.5);
      obj=new T.Group();const m=new T.Mesh(g,mat);m.scale.set(Math.max(.05,b.max[0]-b.min[0]),Math.max(.05,b.max[1]-b.min[1]),Math.max(.05,b.max[2]-b.min[2]));m.position.set((b.min[0]+b.max[0])/2,b.min[1],(b.min[2]+b.max[2])/2);obj.add(m);obj.userData.mats=[mat];obj.userData.placeholder=missing?'missing':'loading';}
    const sc=C.propScale(q);obj.position.set(q.x,floorZ+(q.z||0),q.y);obj.rotation.set(0,C.propYaw(q,setup),0);obj.scale.set(sc[0],sc[1],sc[2]);obj.userData.propId=q.id;
    return {obj,tag,disabled,status:t.status,waitTex};}
  removeProp(e){this.props.remove(e.obj);for(const m of e.obj.userData.mats||[])m.dispose();}
  propObject(id){return this.propEntries.get(id)?.obj||null;}
  // ---------------------------------------------------------------- sky
  applySky(p){
    const s=C.normalizeSky(p.sky),u=this.sky.material.uniforms;u.uTop.value.copy(v3(s.top));u.uHor.value.copy(v3(s.horizon));u.uBot.value.copy(v3(s.bottom));u.uCurve.value=s.curve;
    const tex=s.mode==='image'?this.texture(s.assetId,'sky'):null;u.uHasImg.value=tex?1:0;u.uImg.value=tex;
    if(tex){const a=this.catalog.get(s.assetId);u.uImgSize.value.set(a?.width||tex.image.width,a?.height||tex.image.height);}
    u.uS0.value.set(s.rotation,s.repeat,s.mirror?1:0,s.flipX?1:0);u.uS1.value.set(s.horizonV,s.size,C.rad(s.lift),s.fadeTop);u.uS2.value.set(s.brightness,s.saturation,s.tintStrength,s.fadeBottom);u.uTint.value.copy(v3(s.tint));
    const hz=s.haze,hc=hz.color?rgb(hz.color):tex?this.skyHorizonColor(s):rgb(s.horizon);
    this.G.uHaze.value.set(hc[0]/255,hc[1]/255,hc[2]/255,hz.enabled?1:0);this.G.uHazeR.value.set(hz.start,hz.end,hz.strength);
  }
  skyHorizonColor(s){const key=JSON.stringify([s.assetId,s.horizonV,s.brightness,s.saturation]);if(this._skyColKey===key)return this._skyCol;
    let col=rgb(s.horizon);try{const im=this.images.get(s.assetId),c=document.createElement('canvas');c.width=64;c.height=1;const g=c.getContext('2d');g.drawImage(im,0,Math.max(0,Math.min(im.naturalHeight-2,Math.round(im.naturalHeight*s.horizonV)-6)),im.naturalWidth,4,0,0,64,1);const d=g.getImageData(0,0,64,1).data;let r=0,gg=0,b=0;for(let i=0;i<64;i++){r+=d[i*4];gg+=d[i*4+1];b+=d[i*4+2];}col=[r/64*s.brightness,gg/64*s.brightness,b/64*s.brightness];}catch(e){}
    this._skyColKey=key;this._skyCol=col;return col;}
  // ---------------------------------------------------------------- cameras
  fpCamera(cam,W,H){
    const c=this.camera,f=W/(2*Math.tan(C.rad(cam.fov)/2)),hy=H*C.clamp(cam.horizon??.42,.1,.9),n=.075,far=900;
    c.position.set(cam.x,cam.eyeZ,cam.y);const b=C.basis(cam.facing);c.up.set(0,1,0);c.lookAt(cam.x+b.fx,cam.eyeZ,cam.y+b.fy);c.updateMatrixWorld(true);
    c.projectionMatrix.makePerspective(-n*(W/2)/f,n*(W/2)/f,n*hy/f,-n*(H-hy)/f,n,far);c.projectionMatrixInverse.copy(c.projectionMatrix).invert();return c;
  }
  mapCamera(frame,g,cw,ch,p,stories){
    const s=frame.s,k=g.scale;const b=C.bounds(p),pad=4,zMax=C.storyElevation(p,Math.max(0,stories-1))+p.wallHeight+30,zMin=-5;
    let m;
    if(frame.mode==='plan'){const a1=k*s,a4=g.ox+k*(frame.ox-frame.minX*s),b2=k*s,b4=g.oy+k*(frame.oy-frame.minY*s),near=zMax,farz=zMin;
      // depth: higher is nearer. ndcZ = 1-2*(z-farz)/(near-farz)
      m=new T.Matrix4().set(2*a1/cw,0,0,2*a4/cw-1, 0,0,-2*b2/ch,1-2*b4/ch, 0,-2/(near-farz),0,1+2*farz/(near-farz), 0,0,0,1);}
    else{const a1=k*s,a2=-k*s,a4=g.ox+k*(frame.ox-(frame.minX-frame.minY)*s),b1=k*s*.5,b2=k*s*.5,b3=-k*s*1.1,b4=g.oy+k*(frame.oy-(frame.minX+frame.minY)*s*.5);
      const qs=[[b.x-pad,b.y-pad],[b.maxX+pad,b.maxY+pad]].flatMap(([x,y])=>[1.1*x+1.1*y+zMin,1.1*x+1.1*y+zMax]),qmin=Math.min(...qs)-10,qmax=Math.max(...qs)+10,cz=-2/(qmax-qmin),c4=1+2*qmin/(qmax-qmin);
      m=new T.Matrix4().set(2*a1/cw,0,2*a2/cw,2*a4/cw-1, -2*b1/ch,-2*b3/ch,-2*b2/ch,1-2*b4/ch, 1.1*cz,cz,1.1*cz,c4, 0,0,0,1);}
    const c=this.mapCam;c.projectionMatrix.copy(m);c.projectionMatrixInverse.copy(m).invert();c.matrixWorld.identity();c.matrixWorldInverse.identity();return c;
  }
  // ---------------------------------------------------------------- rendering
  resize(cw,ch,dpr){const r=this.renderer;if(this._size?.[0]!==cw||this._size?.[1]!==ch||this._size?.[2]!==dpr){r.setPixelRatio(dpr);r.setSize(cw,ch,false);this._size=[cw,ch,dpr];}}
  renderMap(p,{frame,geometry,cw,ch,dpr,activeStory=0,showReference=true,showAllStories=false,cutaway=true,grid=false}){
    this.sync(p);this.syncProps(p,'map');this.resize(cw,ch,dpr);const G=this.G;G.uMap.value=1;G.uPick.value=0;G.uActive.value=activeStory;G.uRef.value=showReference?1:0;G.uAbove.value=showAllStories?1:0;G.uCutaway.value=cutaway?1:0;G.uGridStep.value=grid?p.grid:0;G.uHaze.value.w=0;
    const cam=this.mapCamera(frame,geometry,cw,ch,p,p.stories.length);this.layoutObjects('map',null,frame);
    const r=this.renderer;r.setRenderTarget(null);r.setViewport(0,0,cw,ch);r.setScissorTest(false);r.setClearColor(0x0b1018,1);r.clear();this.dynamic.visible=false;r.render(this.scene,cam);this.dynamic.visible=true;
  }
  camFromView(p,v,over={}){return {x:v.x,y:v.y,eyeZ:(v.floorZ??C.storyElevation(p,v.story||0))+v.eyeHeight,facing:v.facing,fov:v.fov,horizon:v.horizon??.42,story:v.story||0,aspect:v.width/v.height,...over};}
  prepFP(p,cam,W,H,grid){this.sync(p);this.syncProps(p,'fp');this.applySky(p);const G=this.G;G.uMap.value=0;G.uPick.value=0;G.uGridStep.value=grid?p.grid:0;G.uCam.value.set(cam.x,cam.eyeZ,cam.y);
    const c=this.fpCamera(cam,W,H);this.layoutObjects('fp',cam,null);const su=this.sky.material.uniforms;su.uInvPV.value.multiplyMatrices(c.matrixWorld,c.projectionMatrixInverse);su.uCamP.value.copy(c.position);return c;}
  renderFP(p,cam,{cw,ch,dpr,rect,grid=false,background=0x0b1119}){
    this.resize(cw,ch,dpr);const c=this.prepFP(p,cam,rect.w,rect.h,grid),r=this.renderer;r.setRenderTarget(null);r.setScissorTest(false);r.setViewport(0,0,cw,ch);r.setClearColor(background,1);r.clear();
    r.setViewport(rect.x,ch-rect.y-rect.h,rect.w,rect.h);r.setScissor(Math.max(0,rect.x),Math.max(0,ch-rect.y-rect.h),rect.w,rect.h);r.setScissorTest(true);r.clear();r.render(this.skyScene,c);r.render(this.scene,c);r.setScissorTest(false);
  }
  target(w,h){const k=w+'x'+h;let rt=this.rts.get(k);if(!rt){rt=new T.WebGLRenderTarget(w,h,{samples:4});this.rts.set(k,rt);if(this.rts.size>6){const old=this.rts.keys().next().value;this.rts.get(old).dispose();this.rts.delete(old);}}return rt;}
  readTarget(rt,w,h){const buf=new Uint8Array(w*h*4);this.renderer.readRenderTargetPixels(rt,0,0,w,h,buf);return buf;}
  toImageData(buf,w,h){const out=new ImageData(w,h),d=out.data,row=w*4;for(let y=0;y<h;y++)d.set(buf.subarray((h-1-y)*row,(h-y)*row),y*row);return out;}
  renderFPToCanvas(p,cam,w,h,canvas,{grid=false}={}){
    const c=this.prepFP(p,cam,w,h,grid),r=this.renderer,rt=this.target(w,h);r.setRenderTarget(rt);r.setScissorTest(false);r.setClearColor(0x0b1119,1);r.clear();r.render(this.skyScene,c);r.render(this.scene,c);
    const buf=this.readTarget(rt,w,h);r.setRenderTarget(null);if(canvas){canvas.width=w;canvas.height=h;canvas.getContext('2d').putImageData(this.toImageData(buf,w,h),0,0);}return canvas;
  }
  renderMapToCanvas(p,opts,w,h,canvas){
    const frame=opts.frame,geometry=opts.geometry,G=this.G;this.sync(p);this.syncProps(p,'map');G.uMap.value=1;G.uPick.value=0;G.uActive.value=opts.activeStory??0;G.uRef.value=opts.showReference===false?0:1;G.uAbove.value=opts.showAllStories?1:0;G.uCutaway.value=opts.cutaway===false?0:1;G.uGridStep.value=opts.grid?p.grid:0;G.uHaze.value.w=0;
    const cam=this.mapCamera(frame,geometry,w,h,p,p.stories.length);this.layoutObjects('map',null,frame);const r=this.renderer,rt=this.target(w,h);r.setRenderTarget(rt);r.setScissorTest(false);r.setClearColor(0x0b1018,1);r.clear();this.dynamic.visible=false;r.render(this.scene,cam);this.dynamic.visible=true;
    const buf=this.readTarget(rt,w,h);r.setRenderTarget(null);if(canvas){canvas.width=w;canvas.height=h;canvas.getContext('2d').putImageData(this.toImageData(buf,w,h),0,0);}return canvas;
  }
  // ID buffer: which tagged surface covers each pixel (cover, picking, masks)
  idBuffer(p,cam,w,h){
    this.sync(p);this.syncProps(p,'fp');const key=this.archKey+'|'+this.propsRev+'|'+JSON.stringify(cam)+'|'+w+'x'+h;if(this._idKey===key)return this._id;
    const c=this.prepFP(p,cam,w,h,false),r=this.renderer,k=w+'x'+h+'id';let rt=this.rts.get(k);if(!rt){rt=new T.WebGLRenderTarget(w,h,{samples:0,minFilter:T.NearestFilter,magFilter:T.NearestFilter});this.rts.set(k,rt);}
    const G=this.G,glass=this.root.children.filter(m=>m.userData.kind==='glass');glass.forEach(m=>m.visible=false);G.uPick.value=1;this.dynamic.visible=false;
    r.setRenderTarget(rt);r.setScissorTest(false);r.setClearColor(0x000000,1);r.clear();r.render(this.scene,c);G.uPick.value=0;this.dynamic.visible=true;glass.forEach(m=>m.visible=true);
    const buf=this.readTarget(rt,w,h);r.setRenderTarget(null);const ids=new Uint32Array(w*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=((h-1-y)*w+x)*4;ids[y*w+x]=buf[i]|(buf[i+1]<<8)|(buf[i+2]<<16);}
    this._idKey=key;this._id={w,h,ids,tags:this.tags};return this._id;
  }
  pick(p,cam,nx,ny,w=960,h=600){if(cam.aspect){h=Math.round(w/cam.aspect);}const b=this.idBuffer(p,cam,w,h),x=C.clamp(Math.floor(nx*w),0,w-1),y=C.clamp(Math.floor(ny*h),0,h-1);return b.tags[b.ids[y*w+x]]||null;}
  sourceMatches(meta,source){if(!meta||!source)return false;if(['object','opening','partition','pillar','prop'].includes(source.kind))return meta.kind===source.kind&&meta.id===source.id;return meta.kind==='wall'&&meta.owners.some(o=>o.roomId===source.roomId&&o.side===source.side);}
  coverage(p,v,source){const cam=this.camFromView(p,v),b=this.idBuffer(p,cam,480,Math.round(480*v.height/v.width)),match=new Set();b.tags.forEach((m,i)=>{if(this.sourceMatches(m,source))match.add(i);});let n=0;for(const id of b.ids)if(match.has(id))n++;return n/b.ids.length;}
  mask(p,v,source,w,h){const cam=this.camFromView(p,v),b=this.idBuffer(p,cam,w,h),c=document.createElement('canvas');c.width=w;c.height=h;const im=new ImageData(w,h),d=im.data,match=new Set();b.tags.forEach((m,i)=>{if(this.sourceMatches(m,source))match.add(i);});for(let i=0;i<b.ids.length;i++){const on=match.has(b.ids[i])?255:0;d[i*4]=d[i*4+1]=d[i*4+2]=on;d[i*4+3]=255;}c.getContext('2d').putImageData(im,0,0);return c;}
  probe(p,v,nx,ny,source=null){const meta=this.pick(p,this.camFromView(p,v),nx,ny);return {meta,blocked:this.sourceMatches(meta,source)};}
  // floor point under a screen position (for placing images in first person)
  floorAt(p,cam,nx,ny,W,H){
    const f=W/(2*Math.tan(C.rad(cam.fov)/2)),hy=H*C.clamp(cam.horizon??.42,.1,.9),px=nx*W,py=ny*H,dy=py-hy,story=cam.story||0,z=C.storyElevation(p,story);if(dy<=2||cam.eyeZ<=z)return null;
    const depth=(cam.eyeZ-z)*f/dy,side=(px-W/2)*depth/f,b=C.basis(cam.facing),pt={x:cam.x+b.fx*depth+b.rx*side,y:cam.y+b.fy*depth+b.ry*side,story};
    if(!C.inFloor(p,pt,0,story))return null;const meta=this.pick(p,cam,nx,ny);if(!meta||!(meta.kind==='room'&&meta.face==='floor'||meta.kind==='floorSection'))return null;if((meta.story??story)!==story)return null;return pt;
  }
}
window.RCGL={supported,Engine,subtractRects,intersectRect,slabTop,roomLightPack,lightFactor};
})();
