/* Run: node tests/props_metadata.test.js
   0.14 placed 3D objects: data model, the "unknown fields survive" rule, and placement maths. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../source/core.js');
const results=[];
function test(name,fn){try{fn();results.push({name,passed:true});console.log('PASS '+name);}catch(e){results.push({name,passed:false,error:e.stack});console.error('FAIL '+name+'\n'+e.stack);}}
const approx=(a,b,tol=1e-6)=>assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);
const base=()=>{const p=C.newProject();return p;};
const roundTrip=bundle=>C.validateBundle(JSON.parse(JSON.stringify(C.validateBundle(bundle))));

// a deliberately "future" object: custom keys at every level the editor knows nothing about
function futureProp(){return {id:'prop_future',asset:'lp_dumpster_bins_mesh_dumpster_closed',name:'Alley dumpster',x:2,y:1.5,story:0,z:0,rotation:90,scale:[1,1,1],
  enabled:true,locked:false,look:'look_green',override:{tint:'#335544',tintStrength:.3,weathering:{rust:.4,decals:['tag_07']}},
  collision:{solid:true,shape:'box',size:[1.3,1.9,1.5],material:'metal',navCost:4},
  gameplay:{tags:['cover','hide','smells-bad',{id:'faction-cache',faction:'Kings'}],props:{loot:{table:'alley_junk',rolls:2},cover:{height:'high'},noise:0.7},questHook:'Q12'},
  points:[{id:'pt_cover_n',type:'cover',name:'North side',x:0,y:0,z:-1.1,yaw:180,enabled:true,props:{lean:'left'},stance:'crouch'},
          {id:'pt_custom',type:'graffiti-spot',x:.3,y:1.2,z:.9,yaw:0,enabled:false,custom:{artist:'unknown'}}],
  bounds:{min:[-.6,0,-.9],max:[.6,1.49,.9]},lod:{far:'billboard'},editorNotes:'future key at the root',unity:{prefabGuid:'abc'}};}
function futureLibrary(){return {schema:1,customTopLevel:{keep:true},
  looks:[{id:'look_green',name:'Council green',asset:'lp_dumpster_bins_mesh_dumpster_closed',palette:null,tint:'#2e6b3a',tintStrength:.5,author:'Teddy',shaderHints:{grime:.2}}],
  palettes:[{id:'palv_grimy',name:'Grimy',base:'pal_lowpoly_master_32',image:'data:image/png;base64,iVBORw0KGgo=',mood:'dirty',source:{from:'Default',op:'grime'}}],
  setups:{car_kent_ford_crown_victoria:{front:-1,points:[{id:'d',type:'driver',x:-.9,y:0,z:.3,yaw:-90}],notes:'front verified by eye',custom:[1,2,3]}}};}

test('a project without placed objects is unchanged (no props/objectLibrary keys are added)',()=>{
  const p=base(),out=C.validateBundle({project:p,assets:[]}).project;
  assert.equal('props' in out,false);assert.equal('objectLibrary' in out,false);});

test('unknown fields on placed objects, collision, gameplay, tags and use points survive load and save unchanged',()=>{
  const p=base();p.props=[futureProp()];p.objectLibrary=futureLibrary();
  const out=roundTrip({project:p,assets:[]}).project,q=out.props[0],f=futureProp();
  for(const k of ['lod','editorNotes','unity','override','gameplay','bounds','name','asset','look'])assert.deepEqual(q[k],f[k],k);
  assert.deepEqual(q.collision,f.collision);assert.deepEqual(q.points,f.points);
  assert.deepEqual(q.gameplay.tags,['cover','hide','smells-bad',{id:'faction-cache',faction:'Kings'}]);});

test('unknown fields in looks, palettes, asset setups and the library block survive unchanged',()=>{
  const p=base();p.props=[futureProp()];p.objectLibrary=futureLibrary();
  const ol=roundTrip({project:p,assets:[]}).project.objectLibrary;assert.deepEqual(ol,futureLibrary());});

test('editing one known field (move, turn, add a tag) leaves every unknown field byte-identical',()=>{
  const p=base();p.props=[futureProp()];p.objectLibrary=futureLibrary();
  let b=roundTrip({project:p,assets:[]});const q=b.project.props[0];q.x+=1;q.rotation+=15;q.gameplay.tags.push('lootable');q.points[0].name='North edge';
  b=roundTrip(b);const r=b.project.props[0],f=futureProp();
  assert.equal(r.x,3);assert.equal(r.rotation,105);assert.deepEqual(r.lod,f.lod);assert.deepEqual(r.unity,f.unity);
  assert.deepEqual(r.points[0].props,f.points[0].props);assert.equal(r.points[0].stance,'crouch');assert.deepEqual(r.points[1],f.points[1]);
  assert.deepEqual(r.gameplay.props,f.gameplay.props);assert.equal(r.gameplay.questHook,'Q12');});

test('a reference to an asset or look that does not exist is kept for repair, not deleted',()=>{
  const p=base();const q=futureProp();q.asset='asset_that_was_renamed_in_v2';q.look='look_gone';p.props=[q];
  const r=roundTrip({project:p,assets:[]}).project.props[0];assert.equal(r.asset,'asset_that_was_renamed_in_v2');assert.equal(r.look,'look_gone');});

test('missing or broken known fields get safe defaults without touching unknown ones',()=>{
  const p=base();p.props=[{asset:'x',x:'oops',rotation:null,scale:2,points:[{type:'',foo:1},42],collision:'yes',gameplay:{tags:'cover'},myKey:7}];
  const r=C.validateBundle({project:p,assets:[]}).project.props[0];
  assert.ok(r.id.startsWith('prop_'));assert.equal(r.x,0);assert.deepEqual(r.scale,[2,2,2]);assert.equal(r.collision.solid,true);
  assert.deepEqual(r.gameplay.tags,['cover']);assert.equal(r.points.length,1);assert.equal(r.points[0].type,'point');assert.equal(r.points[0].foo,1);assert.equal(r.myKey,7);});

test('unknown top-level keys on the route network are kept (0.14 fix)',()=>{
  const p=base();p.routeNet={vertices:[],edges:[],futureLayer:{a:1}};assert.deepEqual(C.validateBundle({project:p,assets:[]}).project.routeNet.futureLayer,{a:1});});

test('placement maths: front faces the given heading; points and footprint turn with the object',()=>{
  const q={x:10,y:5,rotation:0,scale:[1,1,1],z:0,collision:{solid:true,shape:'auto'},bounds:{min:[-1,0,-2],max:[1,1.5,2]}};
  let a=C.propToPlan(q,{x:0,y:0,z:1});approx(a.x,10);approx(a.y,4); // front (+Z) faces north (-y)
  q.rotation=90;a=C.propToPlan(q,{x:0,y:0,z:1});approx(a.x,11);approx(a.y,5); // east
  a=C.propToPlan(q,{x:1,y:0,z:0});approx(a.x,10);approx(a.y,4); // +X is the model's left: facing east, left is north
  const back=C.planToProp(q,{x:11,y:5});approx(back.x,0);approx(back.z,1);
  assert.equal(C.propPointHeading(q,{yaw:0}),90);assert.equal(C.propPointHeading(q,{yaw:180}),270);
  const flipped=C.propToPlan(q,{x:0,y:0,z:1},{front:-1});approx(flipped.x,9); // asset setup: front is the -Z end
  const fp=C.propFootprint(q,null,null,0);const xs=fp.poly.map(p=>p.x),ys=fp.poly.map(p=>p.y);
  approx(Math.min(...xs),8);approx(Math.max(...xs),12);approx(Math.min(...ys),4);approx(Math.max(...ys),6);approx(fp.z1,1.5);
  assert.ok(C.propBlocksWalking(q,fp,0));q.z=2;assert.equal(C.propBlocksWalking(q,C.propFootprint(q,null,null,0),0),false);});

test('collision overrides: box size and round shape',()=>{
  const q={x:0,y:0,rotation:0,scale:[2,1,2],z:0,collision:{solid:true,shape:'cylinder',size:[1,1,1]},bounds:{min:[-1,0,-1],max:[1,1,1]}};
  const fp=C.propFootprint(q,null,null,0);assert.equal(fp.poly.length,12);approx(Math.max(...fp.poly.map(p=>Math.hypot(p.x,p.y))),1,1e-6);});

test('route conflict helpers',()=>{const sq=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
  assert.ok(C.pointInPoly({x:.5,y:.5},sq));assert.equal(C.pointInPoly({x:2,y:.5},sq),false);
  approx(C.polyDistToSegment(sq,{x:3,y:.5},{x:3,y:2}),2);assert.equal(C.polyDistToSegment(sq,{x:-1,y:.5},{x:2,y:.5}),0);});

const ok=results.filter(r=>r.passed).length;fs.writeFileSync(path.join(__dirname,'props_metadata_results.json'),JSON.stringify({passed:ok,failed:results.length-ok,results},null,1));
console.log(`${ok} passed, ${results.length-ok} failed`);process.exit(ok===results.length?0:1);
