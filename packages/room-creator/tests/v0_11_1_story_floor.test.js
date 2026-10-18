'use strict';
// v0.11.1 story/floor regression suite (core). Findings are numbered as in the v0.11 review.
// Run: node tests/v0_11_1_story_floor.test.js
const C=require('../source/core.js'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const results=[];function test(name,fn){try{fn();results.push({name,passed:true});console.log('PASS '+name);}catch(e){results.push({name,passed:false,error:e.stack});console.error('FAIL '+name+'\n'+e.stack);}}
const eq=assert.equal;
function base(){const p=C.newProject(),r=p.rooms[0];r.name='Ground room';r.x=0;r.y=0;r.width=8;r.length=6;return {p,r};}
const names=p=>p.stories.map(s=>s.name);
const room=(p,name,x,y,w,l,story)=>{const r=C.makeRoom(name,x,y,w,l,story);p.rooms.push(r);C.checkRooms(p);return r;};
const section=(p,story,x,y,w=2,l=2)=>C.makeFloorSection(p,story,{x,y},{x:x+w,y:y+l});
const fnRequired=name=>assert.equal(typeof C[name],'function',`RCCore.${name} must be exported`);

// ---- Finding 6: story names after collapse / defaults ----
test('F6 deleting a middle story renames the shifted default-named story',()=>{const {p}=base();C.addStory(p);C.addStory(p);assert.deepEqual(names(p),['Ground','Floor 2','Floor 3']);section(p,2,0,0);C.deleteStory(p,1);assert.deepEqual(names(p),['Ground','Floor 2']);eq(p.floorSections[0].story,1);});
test('F6 several shifted default names all follow their new index',()=>{const {p}=base();C.addStory(p);C.addStory(p);C.addStory(p);section(p,2,0,0);section(p,3,0,0);C.deleteStory(p,1);assert.deepEqual(names(p),['Ground','Floor 2','Floor 3']);assert.deepEqual(p.stories.map(s=>s.index),[0,1,2]);});
test('F6 custom story names survive a collapse unchanged',()=>{const {p}=base();C.addStory(p);C.addStory(p);C.addStory(p);C.renameStory(p,2,'Roof deck');section(p,2,0,0);section(p,3,0,0);C.deleteStory(p,1);assert.deepEqual(names(p),['Ground','Roof deck','Floor 3']);});
test('F6 deleting the top story leaves lower names untouched',()=>{const {p}=base();C.addStory(p);C.addStory(p);C.renameStory(p,1,'Mezzanine');C.deleteStory(p,2);assert.deepEqual(names(p),['Ground','Mezzanine']);});
test('F6 addStory default name is the index label when free',()=>{const {p}=base();C.addStory(p);const st=C.addStory(p);eq(st.name,'Floor 3');});
test('F6 addStory default does not duplicate an existing story name',()=>{const {p}=base();C.addStory(p);C.renameStory(p,1,'Floor 3');const st=C.addStory(p);assert.notEqual(st.name,'Floor 3');eq(new Set(names(p)).size,p.stories.length);assert.match(st.name,/^Floor 3/);});
test('F6 addStory with an explicit name keeps that name',()=>{const {p}=base();eq(C.addStory(p,'Attic').name,'Attic');});
test('F6 storyName returns the stored record name',()=>{fnRequired('storyName');const {p}=base();C.addStory(p);C.renameStory(p,1,'Mezzanine');eq(C.storyName(p,0),'Ground');eq(C.storyName(p,1),'Mezzanine');});
test('F6 storyName falls back to storyLabel for a missing record',()=>{fnRequired('storyName');const {p}=base();eq(C.storyName(p,4),C.storyLabel(4));});
test('F6 checkRooms overlap error uses the stored story name',()=>{const {p,r}=base();C.addRoomAbove(p,r.id,{name:'Upper A'});C.renameStory(p,1,'Mezzanine');p.rooms.push(C.makeRoom('Upper B',1,1,3,3,1));assert.throws(()=>C.checkRooms(p),e=>/Mezzanine/.test(e.message)&&!/Floor 2/.test(e.message));});

// ---- Finding 11: floor-section material/lighting host ----
test('F11 host is the room on the same story containing the centre',()=>{fnRequired('floorSectionHost');const {p,r}=base();const u1=C.addRoomAbove(p,r.id,{name:'U1',width:4,length:6});const u2=room(p,'U2',4,0,4,6,1);const f=section(p,1,5,1);eq(C.floorSectionHost(p,f).id,u2.id);assert.notEqual(u1.id,u2.id);});
test('F11 host prefers the nearest lower story containing the centre',()=>{fnRequired('floorSectionHost');const {p,r}=base();const u=C.addRoomAbove(p,r.id,{name:'U1'});C.addStory(p);const f=section(p,2,3,2);eq(C.floorSectionHost(p,f).id,u.id);});
test('F11 a containing lower-story room beats an unrelated same-story room',()=>{fnRequired('floorSectionHost');const {p,r}=base();C.addStory(p);const far=room(p,'Far upper',30,30,4,4,1);const f=section(p,1,3,2);eq(C.floorSectionHost(p,f).id,r.id);assert.notEqual(C.floorSectionHost(p,f).id,far.id);});
test('F11 a containing lower room is used even when rooms[0] is elsewhere',()=>{fnRequired('floorSectionHost');const {p}=base();C.addStory(p);const east=room(p,'East wing',20,0,6,6,0);const f=section(p,1,22,2);eq(C.floorSectionHost(p,f).id,east.id);});
test('F11 falls back to any room on the section story',()=>{fnRequired('floorSectionHost');const {p}=base();C.addStory(p);const up=room(p,'Upper elsewhere',30,30,4,4,1);const f=section(p,1,-20,-20);eq(C.floorSectionHost(p,f).id,up.id);});
test('F11 final fallback is rooms[0]',()=>{fnRequired('floorSectionHost');const {p,r}=base();C.addStory(p);const f=section(p,1,-20,-20);eq(C.floorSectionHost(p,f).id,r.id);});
test('F11 rooms above the section story are never used as host',()=>{fnRequired('floorSectionHost');const {p,r}=base();const u=C.addRoomAbove(p,r.id,{name:'U1'});const f=section(p,0,-20,-20);assert.notEqual(C.floorSectionHost(p,f).id,u.id);eq(C.floorSectionHost(p,f).id,r.id);});
test('F11 makeFloorSection copies materials from the nearest lower containing room',()=>{const {p,r}=base();const u=C.addRoomAbove(p,r.id,{name:'U1'});u.floor.color='#123456';u.ceiling.color='#654321';r.floor.color='#aaaaaa';C.addStory(p);const f=section(p,2,3,2);eq(f.floor.color,'#123456');eq(f.underside.color,'#654321');});

// ---- Finding 12 (core): addRoomAbove is atomic ----
test('F12 failed addRoomAbove leaves the story list unchanged',()=>{const {p,r}=base();const before=JSON.stringify(p.stories);assert.throws(()=>C.addRoomAbove(p,r.id,{storyDelta:3,width:1}));eq(JSON.stringify(p.stories),before);eq(p.stories.length,1);});
test('F12 failed addRoomAbove leaves rooms unchanged',()=>{const {p,r}=base();const before=JSON.stringify(p.rooms);assert.throws(()=>C.addRoomAbove(p,r.id,{storyDelta:2,offsetX:400}));eq(JSON.stringify(p.rooms),before);eq(p.stories.length,1);});
test('F12 failed addRoomAbove onto an existing story does not touch stories',()=>{const {p,r}=base();C.addRoomAbove(p,r.id,{name:'U'});C.renameStory(p,1,'Mezzanine');const before=JSON.stringify(p.stories);assert.throws(()=>C.addRoomAbove(p,r.id,{}),/overlap/);eq(JSON.stringify(p.stories),before);eq(p.rooms.length,2);});
test('F12 successful addRoomAbove still adds the intermediate stories',()=>{const {p,r}=base();const u=C.addRoomAbove(p,r.id,{storyDelta:3});eq(u.story,3);eq(p.stories.length,4);assert.deepEqual(p.stories.map(s=>s.index),[0,1,2,3]);eq(new Set(names(p)).size,4);C.validateBundle({project:p,assets:[]});});
test('F12 saved files with 0.2 m floor sections still validate',()=>{const {p}=base();section(p,0,1,1);p.floorSections[0].width=0.2;p.floorSections[0].length=0.2;assert.doesNotThrow(()=>C.validateBundle({project:p,assets:[]}));});
test('F12 makeFloorSection still rejects new sections below 0.25 m',()=>{const {p}=base();assert.throws(()=>section(p,0,1,1,0.22,1),/0\.25/);});

const summary={passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,results};fs.writeFileSync(path.join(__dirname,'v0_11_1_story_floor_core_results.json'),JSON.stringify(summary,null,2));console.log(`${summary.passed} passed, ${summary.failed} failed`);if(summary.failed)process.exitCode=1;
