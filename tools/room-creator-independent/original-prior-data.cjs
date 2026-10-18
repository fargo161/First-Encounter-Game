const fs=require('fs'),path=require('path');
const B=__dirname,C=require("C:\\Users\\mcdon\\Documents\\ChatGPT\\encounter and rc\\work\\rc0141-independent-review\\original\\Room_Creator_v0_14_asset_library\\source\\core.js");
const out="C:\\Users\\mcdon\\Documents\\ChatGPT\\encounter and rc\\outputs\\Room_Creator_v0_14_1_Independent_Audit";
const rows=[];
function record(name,detail,ok){rows.push({name,passed:!!ok,detail});}
function prop(id,story=0){return {id,asset:'audit_asset',x:3,y:3,story,z:0,rotation:0,scale:[1,1,1],bounds:{min:[-1,0,-.5],max:[1,1,.5]},collision:{solid:true,shape:'auto'},points:[],gameplay:{tags:[],props:{}}};}
function valid(p){return C.validateBundle({project:p,assets:[]}).project;}
{
 const p=C.newProject();C.addStory(p);C.addStory(p);p.rooms.push(C.makeRoom('Upper',0,0,8,6,2));p.props=[prop('upper',2)];
 const before=valid(p);C.deleteStory(p,1);const after=valid(p);
 record('Deleting an empty intermediate story shifts 3D props with their room',{roomStory:after.rooms.find(r=>r.name==='Upper').story,propStory:after.props[0].story},after.props[0].story===1);
}
{
 const p=C.newProject();C.addStory(p);p.rooms.push(C.makeRoom('Upper',0,0,8,6,1));p.props=[prop('upper',1)];valid(p);
 const contents=C.storyContents(p,1);C.deleteStory(p,1,{force:true});const after=valid(p);
 record('Forced story deletion removes its 3D props',{contents,remainingProps:after.props.map(q=>({id:q.id,story:q.story,roomId:q.roomId}))},after.props.length===0);
}
{
 const p=C.newProject();C.addStory(p);p.props=[prop('only-prop',1)];valid(p);let error=null;
 try{C.deleteStory(p,1);}catch(e){error=e.message;}
 record('A story containing only 3D props is treated as occupied',{error,stories:p.stories.length,props:p.props},!!error);
}
{
 const p=C.newProject();const r=C.makeRoom('Remove me',20,0,8,6,0);p.rooms.push(r);const q=prop('orphan');q.x=23;p.props=[q];valid(p);const removed=C.deleteRoom(p,r.id);const after=valid(p);
 record('Room deletion removes a 3D prop when no floor remains',{removed,prop:after.props[0],hasFloor:C.inFloor(after,{x:23,y:3},0,0)},after.props.length===0);
}
{
 const base=JSON.parse(fs.readFileSync(path.join("C:\\Users\\mcdon\\Documents\\ChatGPT\\encounter and rc\\work\\rc0141-independent-review\\original\\Room_Creator_v0_14_asset_library",'examples/Route_Prototype_Street.room.json'),'utf8'));
 const demo=JSON.parse(fs.readFileSync(path.join("C:\\Users\\mcdon\\Documents\\ChatGPT\\encounter and rc\\work\\rc0141-independent-review\\original\\Room_Creator_v0_14_asset_library",'examples/Route_Prototype_Street_ASSET_DEMO.room.json'),'utf8'));
 const normalizedBase=C.validateBundle(C.clone(base)),normalizedDemo=C.validateBundle(C.clone(demo));
 const keys=['routeNet','stories','stairs','floorCuts','pairs','links'];const unchanged=Object.fromEntries(keys.map(k=>[k,JSON.stringify(normalizedBase.project[k])===JSON.stringify(normalizedDemo.project[k])]));
 record('Furnished demo preserves route network and structural navigation records',unchanged,Object.values(unchanged).every(Boolean));
 record('Original viewpoints remain unchanged',base.project.viewpoints.map(v=>({id:v.id,equal:JSON.stringify(v)===JSON.stringify(demo.project.viewpoints.find(x=>x.id===v.id))})),base.project.viewpoints.every(v=>JSON.stringify(v)===JSON.stringify(demo.project.viewpoints.find(x=>x.id===v.id))));
 const removed=base.project.pillars.filter(x=>!demo.project.pillars.some(y=>y.id===x.id));
 record('Demo replacement inventory',{baseline:{rooms:base.project.rooms.length,pillars:base.project.pillars.length,views:base.project.viewpoints.length,assets:base.assets.length},demo:{rooms:demo.project.rooms.length,pillars:demo.project.pillars.length,views:demo.project.viewpoints.length,assets:demo.assets.length,props:demo.project.props.length,looks:demo.project.objectLibrary.looks.length,palettes:demo.project.objectLibrary.palettes.length,setups:Object.keys(demo.project.objectLibrary.setups).length},removedPillars:removed.map(x=>({id:x.id,name:x.name}))},true);
}
fs.writeFileSync(path.join(out,'original-prior-data-probes.json'),JSON.stringify(rows,null,2));console.log(JSON.stringify(rows,null,2));
