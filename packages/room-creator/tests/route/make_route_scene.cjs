// Builds examples/Route_Prototype_Street.room.json from the City Block rail demo:
// adds a solid parked car (pillars), closes the bodega door, and authors the route network.
'use strict';
const fs=require('node:fs'),path=require('node:path');
const C=require('/home/claude/v13/work/source/core.js');
const src='/home/claude/v13/work/examples/City_Block_Rail_Demo.room.json',out='/home/claude/v13/work/examples/Route_Prototype_Street.room.json';
const bundle=JSON.parse(fs.readFileSync(src,'utf8'));const p=bundle.project;
p.name='Route Prototype · Harlan Av';
const door=p.openings.find(o=>o.id==='opening_bodega_door');door.open=false;door.name='Bodega front door';   // starts closed: tests the blocked branch
// ---- parked car: a few plain boxes (pillars), so it blocks sight lines and gives cover
p.pillars=p.pillars.filter(q=>!q.id.startsWith('pillar_parked_'));
function box(id,name,x,y,w,d,h,color,finish='paint'){const q=C.createPillar(p,0,{x,y},{name,width:w,depth:d,height:h});q.id='pillar_parked_'+id;q.surface=C.normalizeSurface({...q.surface,textureId:null,color,finish,wear:.3,tintStrength:0,brightness:1,contrast:1,saturation:1,hue:0});return q;}
box('body','Parked car · body',34.8,41.15,4.4,1.8,.95,'#7a2630');
box('cabin','Parked car · cabin',34.55,41.15,2.3,1.62,1.45,'#2a3644');
for(const [i,x] of [[1,33.45],[2,36.15]])for(const [j,y] of [['n',40.16],['s',42.14]])box('wheel'+i+j,'Parked car · wheel',x,y,.72,.24,.56,'#141414','concrete');
// ---- route network
const Y=37.85;
const v=(id,name,x,y)=>({id,name,x,y,story:0});
const routeNet={version:1,
  settings:{seed:1977,start:{edge:'e_harlan_w',s:8,dir:1},defaults:{},
    note:'Authored by hand for the route-walk prototype. Player route = yellow, NPC lanes = cyan, traffic = orange.'},
  vertices:[v('vW','Harlan Av · west end',6,Y),v('vD','Bodega door',58.25,Y),v('vC','Harlan & Dunmore corner',61.6,Y),v('vIn','Inside the bodega',58.25,33.4),
    v('vE','Across Dunmore',73.6,Y),v('vP','Pier',88,Y),v('vN','Alley mouth',61.6,-4),v('vNN','Dunmore St · north',61.6,-19),v('vAl','Back alley',44,-4)],
  edges:[{id:'e_harlan_w',a:'vW',b:'vD',name:'Harlan Av sidewalk',band:.9},{id:'e_harlan_c',a:'vD',b:'vC',name:'Harlan Av sidewalk',band:.9},
    {id:'e_bodega',a:'vD',b:'vIn',name:'Bodega',door:'opening_bodega_door',band:.25},{id:'e_cross',a:'vC',b:'vE',name:'Crosswalk over Dunmore',band:.6},
    {id:'e_pier',a:'vE',b:'vP',name:'Pier sidewalk',band:.9},{id:'e_dunmore',a:'vC',b:'vN',name:'Dunmore St sidewalk',band:.5},
    {id:'e_dunmore_n',a:'vN',b:'vNN',name:'Dunmore St north',band:.5},{id:'e_alley',a:'vN',b:'vAl',name:'Back alley',band:.6}],
  // offMin/offMax: how far a walker may step aside (m). + is the walker's right, which on these lanes is toward the player's route.
  lanes:[
    {id:'near_in',name:'Near side · walking west (curb side)',side:'near',offMin:-.1,offMax:.8,points:[{x:50,y:-1.6},{x:62.5,y:-1.6},{x:62.5,y:38.6},{x:-2.6,y:38.6},{x:-2.6,y:30}]},
    {id:'near_out',name:'Near side · walking east (wall side)',side:'near',offMin:-.15,offMax:.8,points:[{x:-.6,y:30},{x:-.6,y:36.6},{x:60.6,y:36.6},{x:60.6,y:-2.6},{x:50,y:-2.6}]},
    {id:'shop_out',name:'Out of the bodega · walking west',side:'near',door:'opening_bodega_door',offMin:-.1,offMax:.8,points:[{x:58,y:25.6},{x:58,y:28.6},{x:58.25,y:33.2},{x:58.25,y:36.9},{x:57.2,y:38.6},{x:-2.6,y:38.6},{x:-2.6,y:30}]},
    {id:'far_e',name:'Far side · walking east (curb side)',side:'far',offMin:-.3,offMax:.6,points:[{x:-2.6,y:62},{x:-2.6,y:51.9},{x:62.4,y:51.9},{x:62.4,y:64}]},
    {id:'far_w',name:'Far side · walking west (wall side)',side:'far',offMin:-.3,offMax:.6,points:[{x:60.8,y:64},{x:60.8,y:52.75},{x:-1.6,y:52.75},{x:-1.6,y:62}]}],
  nodes:[
    {id:'N1',name:'Tenement doorway',x:27.1,y:36.45,facing:180,types:['hide','cover','loiter','spy']},
    {id:'N2',name:'Bodega window',x:53.4,y:36.5,facing:0,types:['loiter','spy']},
    {id:'N3',name:'Bodega door',x:58.25,y:36.55,facing:180,types:['door','loiter'],door:'opening_bodega_door',insidePath:[{x:58.25,y:34.8},{x:58.25,y:33},{x:58,y:28.6},{x:58,y:25.6}]},
    {id:'N4',name:'Behind the parked car (west)',x:33,y:39.2,facing:180,types:['cover','hide','spy']},
    {id:'N5',name:'Behind the parked car (east)',x:36.2,y:39.2,facing:180,types:['cover','hide','spy']},
    {id:'N6',name:'Pizza place doorway (across)',x:41,y:53.55,facing:0,types:['spy','hide','loiter'],reach:false}],
  zones:[{id:'Z1',name:'Pizza place hangout',x:47,y:52.95,width:5,length:.9,slots:[{x:47.8,y:53.4,facing:45},{x:49.3,y:53.45,facing:0},{x:50.8,y:53.4,facing:315}]}],
  portals:[
    {id:'P1',name:'Alley (corner)',kind:'corner',x:50,y:-2.1},{id:'P2',name:'Kestrel corner, north side',kind:'corner',x:-1.6,y:30},
    {id:'P3',name:'Kestrel corner, south side',kind:'corner',x:-2.1,y:62},{id:'P4',name:'Dunmore south corner',kind:'corner',x:61.6,y:64},
    {id:'P5',name:'Bodega stockroom (door)',kind:'door',x:58,y:25.6},
    {id:'P6',name:'Dunmore north (cars)',kind:'vehicle',x:65.6,y:-19},{id:'P7',name:'Kestrel north (cars)',kind:'vehicle',x:-11.5,y:-19},
    {id:'P8',name:'Kestrel south (cars)',kind:'vehicle',x:-6.8,y:68},{id:'P9',name:'Back alley (cars out)',kind:'vehicle',x:36,y:-3}],
  traffic:[
    {id:'car_w',name:'Traffic · south on Dunmore, west on Harlan, north on Kestrel',kind:'traffic',speed:8.5,gap:9,delay:3,points:[{x:65.6,y:-19},{x:65.6,y:43.4},{x:-11.5,y:43.4},{x:-11.5,y:-19}]},
    {id:'car_e',name:'Traffic · east on Harlan, north on Dunmore, into the alley',kind:'traffic',speed:8.5,gap:9,delay:11,points:[{x:-6.8,y:68},{x:-6.8,y:47.2},{x:69.6,y:47.2},{x:69.6,y:-3},{x:36,y:-3}]}],
  actors:[
    {id:'w1',name:'Walker A',lane:'near_in',startS:75.2,speed:1.3},
    {id:'w2',name:'Walker B',lane:'near_in',startS:40,speed:1.2},
    {id:'o1',name:'Walker C (same way as you)',lane:'near_out',startS:28.2,speed:1.1},
    {id:'f1',name:'Far walker D',lane:'far_e',startS:22.7,speed:1.25},
    {id:'f2',name:'Far walker E',lane:'far_w',startS:42,speed:1.3},
    {id:'f3',name:'Far walker F',lane:'far_w',delay:6,speed:1.2,loiterChance:.5},
    {id:'mark',name:'The mark',role:'mark',cls:'combatant',lane:'far_w',startS:16,speed:1.15,divertAt:'N6',watch:40,respawn:12},
    {id:'stoop',name:'Stoop sitter',role:'stoop',cls:'stationary',node:'N1',lane:'near_out',stay:45},
    {id:'l1',name:'Talker',role:'loiter',cls:'background',zone:'Z1',slot:0,views:['front']},
    {id:'l2',name:'Phone checker',role:'loiter',cls:'stationary',zone:'Z1',slot:1,views:['front','q'],flourish:true},
    {id:'l3',name:'Talker 2',role:'loiter',cls:'stationary',zone:'Z1',slot:2},
    {id:'shop',name:'Shopper',lane:'shop_out',delay:4,speed:1.2,respawn:25}]};
p.routeNet=routeNet;
// a viewpoint at the route start, so plain first person also opens on the sidewalk
p.viewpoints=p.viewpoints.filter(x=>x.id!=='view_route_start');
const base=p.viewpoints[0];p.viewpoints.unshift({...C.clone(base),id:'view_route_start',name:'Route walk start · Harlan Av',x:14,y:Y,story:0,floorZ:0,facing:90,fov:75,eyeHeight:1.62,horizon:.42,role:'movement'});
p.startViewId='view_route_start';
bundle.savedWith='TRAPSTAR Room Creator 0.13.1 (route prototype)';
const checked=C.validateBundle(bundle);   // throws if anything is malformed
if(!checked.project.routeNet||checked.project.routeNet.edges.length!==routeNet.edges.length)throw Error('routeNet lost in validation');
fs.writeFileSync(out,JSON.stringify(bundle));
console.log('wrote',out,(fs.statSync(out).size/1e6).toFixed(2)+' MB','pillars',p.pillars.length,'lanes',routeNet.lanes.length,'actors',routeNet.actors.length);
