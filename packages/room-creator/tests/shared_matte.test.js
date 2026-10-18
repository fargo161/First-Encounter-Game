'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),C=require('../source/core.js');
const result=[];function test(name,fn){try{fn();result.push({name,passed:true});console.log('PASS '+name);}catch(e){result.push({name,passed:false,error:e.stack});console.error('FAIL '+name+' '+e.message);}}
const p=C.newProject(),r=p.rooms[0],spec={...C.backdrop('atlas'),fit:'stretch'};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const owner=side=>({roomId:r.id,side});
test('No matte is supplied or assigned in a new room',()=>assert.equal(C.backdropFor(p,owner('N')),null));
test('Matte lookup has no read-side project mutation',()=>{const b=JSON.stringify(p);C.backdropFor(p,owner('N'));assert.equal(JSON.stringify(p),b);});
test('Side frame spans the complete room side, not any opening',()=>{const f=C.backdropFrame(p,owner('N'),spec);near(f.width,8);near(f.height,2.7);near(f.center.x,4);});
test('Two windows share one coordinate system',()=>{const f=C.backdropFrame(p,owner('N'),spec);const a=C.backdropAtWall(f,1,1.35,{x:0,y:-1}),b=C.backdropAtWall(f,6,1.35,{x:0,y:-1});near(a.u,1/8);near(b.u,6/8);near(a.v,b.v);});
test('Opening width and position cannot modify a matte frame',()=>{const f=C.backdropFrame(p,owner('N'),spec);const o=C.createOpening(p,r.id,'N',1,'window');o.offset=3;o.width=3;o.bottom=.3;assert.deepEqual(C.backdropFrame(p,owner('N'),spec),f);});
test('World height sets the common vertical image coordinate',()=>{const f=C.backdropFrame(p,owner('N'),spec);near(C.backdropAtWall(f,1,.675,{x:0,y:-1}).v,.75);});
for(const [side,point,expectedU] of [['N',{x:2,y:0},.25],['E',{x:8,y:1.5},.25],['S',{x:6,y:6},.25],['W',{x:0,y:4.5},.25]]){
 test(side+' exterior reads left-to-right from inside, not mirrored',()=>{const f=C.backdropFrame(p,owner(side),spec);const pos=f.line.axis==='h'?point.x:point.y;const q=C.backdropAtWall(f,pos,1.35,f.outward);near(q.u,expectedU);near(q.v,.5);});
}
test('Positive setback changes crop with observer movement',()=>{const f=C.backdropFrame(p,owner('N'),{...spec,distance:4}),a={x:3,y:4},b={x:4,y:4},wall={x:5,y:0};const qa=C.backdropRay(f,a,{x:wall.x-a.x,y:wall.y-a.y},1.3),qb=C.backdropRay(f,b,{x:wall.x-b.x,y:wall.y-b.y},1.3);assert.ok(qa.u>qb.u);});
test('Zero setback keeps a fixed wall-location crop as observer moves',()=>{const f=C.backdropFrame(p,owner('N'),spec),a=C.backdropRay(f,{x:2,y:3},{x:1,y:-3},1.3),b=C.backdropRay(f,{x:3,y:5},{x:0,y:-5},1.3);near(a.u,b.u);});
test('Looking inward does not use the outside matte of that wall',()=>assert.equal(C.backdropRay(C.backdropFrame(p,owner('N'),spec),{x:4,y:-2},{x:0,y:1},1.3),null));
test('Fit mode preserves proportions over the whole side',()=>{const f=C.backdropFrame(p,owner('N'),spec),uv=C.backdropUV({...spec,fit:'cover'},f,0,.5,1600,270);near(uv.u,.25);near(uv.v,.5);});
test('Contain mode letterboxes, without edge smear',()=>{const f=C.backdropFrame(p,owner('N'),spec);assert.equal(C.backdropUV({...spec,fit:'contain'},f,.5,0,1600,270),null);});
test('Stretch maps full side once, with independent X and Y',()=>{const f=C.backdropFrame(p,owner('N'),spec),uv=C.backdropUV(spec,f,.125,.75,1600,270);near(uv.u,.125);near(uv.v,.75);});
test('Image edges do not clamp or repeat at any fit',()=>{const f=C.backdropFrame(p,owner('N'),spec);for(const fit of ['stretch','contain','cover'])assert.equal(C.backdropUV({...spec,fit,offsetX:3},f,.5,.5,800,270),null);});
test('Scale and offset are one shared transformation',()=>{const f=C.backdropFrame(p,owner('N'),spec),uv=C.backdropUV({...spec,scale:2,offsetX:.1,offsetY:-.1},f,.1,.3,800,270);near(uv.u,.4);near(uv.v,.3);});
test('Room default is inherited on every unspecified side',()=>{r.exterior.default=spec;for(const side of C.SIDES)assert.equal(C.backdropFor(p,owner(side)),spec);});
test('Side override is independent of the default and other sides',()=>{r.exterior.sides.N={...spec,assetId:'different'};assert.equal(C.backdropFor(p,owner('N')).assetId,'different');assert.equal(C.backdropFor(p,owner('S')).assetId,'atlas');});
test('An empty override inherits the default rather than suppressing it',()=>{r.exterior.sides.N=C.backdrop();assert.equal(C.backdropFor(p,owner('N')).assetId,'atlas');});
test('Moved room keeps side-relative matte registration',()=>{const f=C.backdropFrame(p,owner('N'),spec),q=C.backdropAtWall(f,2,.8,{x:0,y:-1});const t=C.clone(p);t.rooms[0].x+=11;t.rooms[0].y-=7;const ff=C.backdropFrame(t,owner('N'),spec),qq=C.backdropAtWall(ff,13,.8,{x:0,y:-1});near(q.u,qq.u);near(q.v,qq.v);});
test('Partial shared boundary does not shorten the matte canvas',()=>{const t=C.newProject(),rr=t.rooms[0];C.addAdjoining(t,rr.id,'N',4,3,4,'solid');const spans=C.roomWalls(t).filter(w=>w.owners.some(o=>o.roomId===rr.id&&o.side==='N'));assert.equal(spans.length,2);assert.equal(C.backdropFrame(t,{roomId:rr.id,side:'N'},spec).width,8);});
const tiny={id:'atlas',name:'fixture',src:'data:image/png;base64,iVBORw0KGgo=',width:800,height:270};
test('v0.6 files missing distance default to zero without moving anything',()=>{const q=C.newProject();q.rooms[0].exterior.default={...spec};delete q.rooms[0].exterior.default.distance;const v=C.createViewpoint(q,{x:3,y:4},{x:3,y:0});const fixed=JSON.stringify(q.viewpoints);const valid=C.validateBundle({project:q,assets:[tiny]}).project;near(valid.rooms[0].exterior.default.distance,0);assert.equal(JSON.stringify(valid.viewpoints),fixed);});
test('Negative, infinite and nonnumeric matte distance are rejected',()=>{for(const distance of [-1,Infinity,'4']){const q=C.newProject();q.rooms[0].exterior.default={...spec,distance};assert.throws(()=>C.validateBundle({project:q,assets:[tiny]}));}});
test('Save/reopen preserves image, per-side transforms and setback',()=>{const q=C.newProject();q.rooms[0].exterior.default={...spec};q.rooms[0].exterior.sides.E={...spec,distance:5,scale:2,offsetX:.12,offsetY:-.15};const a=C.validateBundle({project:q,assets:[tiny]});const b=C.validateBundle(JSON.parse(JSON.stringify(a)));assert.deepEqual(a,b);});
fs.writeFileSync(path.join(__dirname,'shared_matte_core_results.json'),JSON.stringify({passed:result.filter(x=>x.passed).length,failed:result.filter(x=>!x.passed).length,tests:result},null,2));
console.log(`${result.filter(x=>x.passed).length} passed, ${result.filter(x=>!x.passed).length} failed`);
if(result.some(x=>!x.passed))process.exit(1);
