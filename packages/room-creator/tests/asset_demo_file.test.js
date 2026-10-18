/* Run: node tests/asset_demo_file.test.js
   0.14: the two example maps. The baseline stays exactly 0.13.1; the furnished ASSET_DEMO copy is valid, round-trips
   unchanged through the editor's own load/save rules, and uses every authoring feature the handoff asks to exercise. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const C=require('../source/core.js');const ex=f=>path.join(__dirname,'..','examples',f);const results=[];
function test(name,fn){try{fn();results.push({name,passed:true});console.log('PASS '+name);}catch(e){results.push({name,passed:false,error:e.stack});console.error('FAIL '+name+'\n'+e.stack);}}
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const demo=JSON.parse(fs.readFileSync(ex('Route_Prototype_Street_ASSET_DEMO.room.json'),'utf8'));
test('baseline Route_Prototype_Street.room.json is byte-identical to the final 0.13.1 file',()=>{
  assert.equal(sha(ex('Route_Prototype_Street.room.json')).slice(0,8),'5b296703');});
test('the demo map validates and survives load → save → load unchanged (objects and object library)',()=>{
  const a=C.validateBundle(JSON.parse(JSON.stringify(demo))),b=C.validateBundle(JSON.parse(JSON.stringify(a)));
  assert.deepEqual(b.project.props,a.project.props);assert.deepEqual(b.project.objectLibrary,a.project.objectLibrary);
  assert.deepEqual(a.project.props,demo.project.props);});
test('the demo keeps the route network, stories, stairs and views of the baseline',()=>{const p=demo.project,base=JSON.parse(fs.readFileSync(ex('Route_Prototype_Street.room.json'),'utf8')).project;
  assert.deepEqual(p.routeNet,base.routeNet);assert.equal(p.rooms.length,base.rooms.length);assert.deepEqual(p.stairs.map(s=>s.id),base.stairs.map(s=>s.id));
  for(const v of base.viewpoints)assert.ok(p.viewpoints.some(x=>x.id===v.id),v.id);});
test('only the placeholder boxes that 3D objects replace were removed',()=>{const p=demo.project,base=JSON.parse(fs.readFileSync(ex('Route_Prototype_Street.room.json'),'utf8')).project;
  const gone=base.pillars.filter(q=>!p.pillars.some(x=>x.id===q.id)).map(q=>q.id).sort();
  assert.deepEqual(gone,['pillar_can1','pillar_crates','pillar_crates2','pillar_desk','pillar_dumpster1','pillar_dumpster2','pillar_dumpster3','pillar_pallet1','pillar_pallet2',
    'pillar_parked_body','pillar_parked_cabin','pillar_parked_wheel1n','pillar_parked_wheel1s','pillar_parked_wheel2n','pillar_parked_wheel2s']);});
test('demo exercises: looks, project palettes, per-object override, front setups, default points, tags, extra properties, use points, textures',()=>{
  const p=demo.project,ol=p.objectLibrary,props=p.props;
  assert.ok(props.length>=60);for(const s of [0,1])assert.ok(props.some(q=>q.story===s),'story '+s);
  assert.ok(ol.looks.length>=3&&ol.palettes.length>=4);for(const q of props)if(q.look)assert.ok(ol.looks.some(l=>l.id===q.look),q.look);
  for(const q of props)if(q.override.palette)assert.ok(ol.palettes.some(v=>v.id===q.override.palette),q.id);
  assert.ok(props.some(q=>q.look&&Object.keys(q.override).some(k=>C.LOOK_FIELDS.includes(k))),'look + own change');
  assert.ok(props.some(q=>q.override.weathered),'unknown override key kept');assert.ok(props.some(q=>q.override.texture&&q.override.texture.library),'texture override');
  assert.ok(Object.values(ol.setups).some(s=>s.frontTurn===90)&&Object.values(ol.setups).some(s=>s.frontTurn===180));assert.ok(Object.values(ol.setups).some(s=>Array.isArray(s.points)&&s.points.length));
  const types=new Set(props.flatMap(q=>q.points.map(x=>x.type)));for(const t of ['sit','work','customer','cover','hide','search','driver','look','use'])assert.ok(types.has(t),t);
  assert.ok(props.some(q=>q.gameplay.tags.some(t=>typeof t==='object')),'structured tag');assert.ok(props.some(q=>Object.keys(q.gameplay.props).length),'extra properties');
  assert.ok(props.some(q=>q.collision.solid===false)&&props.some(q=>q.collision.solid===true));
  assert.ok(demo.assets.filter(a=>a.library&&a.library.asset_id).length>=2,'library textures copied into the project');});
test('every placed object has real measured bounds and every use point has a type',()=>{for(const q of demo.project.props){assert.ok(C.validBounds(q.bounds),q.id);for(const pt of q.points)assert.ok(pt.type,q.id);}});
const ok=results.filter(r=>r.passed).length;fs.writeFileSync(path.join(__dirname,'asset_demo_file_results.json'),JSON.stringify({passed:ok,failed:results.length-ok,results},null,1));
console.log(`${ok} passed, ${results.length-ok} failed`);process.exit(ok===results.length?0:1);
