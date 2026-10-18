const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),C=require('../source/core.js'),root=path.resolve(__dirname,'..');
const read=n=>JSON.parse(fs.readFileSync(path.join(root,n),'utf8'));
const base=C.validateBundle(read('examples/Route_Prototype_Street.room.json')).project;
const generated=C.validateBundle(read(process.env.RC_GENERATED||'generated/Route_Prototype_Street_ASSET_DEMO.room.json')).project;
const shipped=C.validateBundle(read('examples/Route_Prototype_Street_ASSET_DEMO.room.json')).project;
for(const key of ['routeNet','stories','stairs','floorCuts','pairs','links'])assert.deepEqual(generated[key],base[key],key);
assert.equal(generated.props.length,69);assert.equal(generated.viewpoints.length,17);assert.equal(generated.objectLibrary.looks.length,3);assert.equal(generated.objectLibrary.palettes.length,5);
for(const q of generated.props){const s=shipped.props.find(x=>x.id===q.id);assert.ok(s,q.id);for(const key of ['asset','x','y','story','z','rotation','scale','collision','gameplay'])assert.deepEqual(q[key],s[key],q.id+' '+key);}
console.log(JSON.stringify({passed:true,props:generated.props.length,uniqueModels:new Set(generated.props.map(q=>q.asset)).size,preservedNavigation:true,placementCollisionGameplayMatch:true}));
