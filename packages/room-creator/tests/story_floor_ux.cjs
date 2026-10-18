// Run with Playwright available; set CHROMIUM to your Chromium executable if needed.
const fs=require('fs'),path=require('path'),assert=require('assert');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
const root=path.resolve(__dirname,'..'),results=[],errors=[];
function check(name,condition){results.push({name,passed:!!condition});console.log((condition?'PASS ':'FAIL ')+name);if(!condition)throw Error(name);}
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM||chromium.executablePath(),args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1600,height:1000}});page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
page.setDefaultTimeout(10000);
const E=f=>page.evaluate(f),state=()=>E(()=>RCApp.state),floor=()=>E(()=>RCApp.project.floorSections[0]);
const point=async(x,y,story=1)=>page.evaluate(({x,y,story})=>RCApp.projectPoint({x,y},story),{x,y,story});
const click=async(x,y,story=1)=>{const p=await point(x,y,story);await page.mouse.click(p.x,p.y);};
const move=async(x,y,story=1)=>{const p=await point(x,y,story);await page.mouse.move(p.x,p.y,{steps:8});};
const drag=async(a,b)=>{await move(...a);await page.mouse.down();await move(...b);await page.mouse.up();};
const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
try{
 await page.goto('file://'+path.join(root,'Room_Creator.html'));await page.waitForFunction('window.RCApp');
 const ground=await E(()=>JSON.stringify(RCApp.project.rooms[0]));
 await page.locator('[data-action="add-story"]').click();await page.locator('input[name=newStoryMode][value=empty]').check();await page.locator('#storyAddConfirm').click();await settle();
 check('Empty upper story clears Ground selection and room context',(await state()).selection===null&&(await state()).roomId===null);
 check('New story starts floor placement on the elevated plane',(await state()).activeStory===1&&(await state()).tool==='floorsection');
 check('Inspector and canvas both identify Floor 2',(await page.locator('#inspector').innerText()).includes('Floor 2')&&(await page.locator('#stageTitle').innerText()).includes('Floor 2'));
 check('Reference floors and walls are excluded from picking',await E(()=>RCApp.renderer.isoFloors.length===0&&RCApp.renderer.isoWalls.length===0));
 await page.screenshot({path:path.join(root,'previews','v0_11_empty_story.png')});
 await click(1,1);await move(4,3);await settle();
 check('Elevated live rectangle uses accurate dimensions',(await page.locator('#floorReadout').innerText()).includes('3 × 2 m'));
 await click(4,3);check('Draw creates exact floor bounds on Floor 2',JSON.stringify(Object.fromEntries(Object.entries(await floor()).filter(([k])=>['story','x','y','width','length'].includes(k))))===JSON.stringify({story:1,x:1,y:1,width:3,length:2}));
 check('Drawing leaves lower architecture unchanged',ground===await E(()=>JSON.stringify(RCApp.project.rooms[0])));
 const history0=(await state()).history;await drag([2.5,2],[3.5,3]);
 check('Floor body drag moves on its own story',(await floor()).x===2&&(await floor()).y===2);
 check('One floor drag is one undo step',(await state()).history===history0+1);
 await E(()=>RCApp.undo());check('Undo restores the floor position',(await floor()).x===1&&(await floor()).y===1);await E(()=>RCApp.redo());check('Redo restores floor movement',(await floor()).x===2&&(await floor()).y===2);
 await drag([5,4],[6,5]);check('Corner handles resize both dimensions',(await floor()).width===4&&(await floor()).length===3);
 await drag([6,3.5],[7,3.5]);check('Edge handle resizes only its axis',(await floor()).width===5&&(await floor()).length===3);
 const beforeCancel=JSON.stringify(await floor()),hc=(await state()).history;await move(4.5,3.5);await page.mouse.down();await move(5.5,4.5);await page.keyboard.press('Escape');await page.mouse.up();check('Escape cancels a live floor drag with no undo entry',JSON.stringify(await floor())===beforeCancel&&(await state()).history===hc);
 // Geometry can grow beyond the initial footprint without changing the camera during a gesture.
 const p0=await point(2,2);await drag([7,3.5],[9,3.5]);const p1=await point(2,2);check('Extending past the lower footprint does not move the editing camera',Math.hypot(p1.x-p0.x,p1.y-p0.y)<.01&&(await floor()).width===7);
 await page.locator('[data-action="floor-split"]').click();await page.locator('#splitDistance').fill('3');await page.locator('#splitConfirm').click();
 check('Split preserves total floor area and creates two pieces',await E(()=>RCApp.project.floorSections.length===2&&RCApp.project.floorSections.reduce((s,f)=>s+f.width*f.length,0)===21));
 await page.locator('[data-action="floor-extend"]').click();await page.locator('#extendEdge').selectOption('S');await page.locator('#extendDepth').fill('2');await page.locator('#extendConfirm').click();
 check('Extend adds an adjoining floor on the same story',await E(()=>{const f=RCApp.project.floorSections.at(-1);return f.story===1&&f.x===5&&f.y===5&&f.width===4&&f.length===2;}));
 await page.screenshot({path:path.join(root,'previews','v0_11_floor_editing.png')});
 // Floor material editing must work even without any enclosed upper room.
 await page.locator('[data-deep-editor="floorSectionSurface"]').click();await settle();
 check('Standalone floor Texture Studio opens without a room',await page.locator('#studioPreview').isVisible());check('Standalone floor material preview renders',(await page.locator('#studioError').innerText())==='');await page.locator('[data-action="close-modal"]').first().click();
 await E(()=>RCApp.setTool('floorsection'));await click(1,5);await page.locator('[data-story="0"]').click();
 check('Story switching cancels unfinished floor drawing',(await state()).pending===null&&(await state()).tool==='select'&&(await state()).activeStory===0);
 await page.locator('[data-story="1"]').click();await E(()=>RCApp.draw());
 check('Returning to open upper story clears Ground inspector',(await state()).selection===null&&(await state()).roomId===null&&!(await page.locator('#inspector').innerText()).includes('Selected enclosed room'));
 const n=await E(()=>RCApp.project.floorSections.length);await click(-2,-2,0);check('Clicking reference geometry cannot select a lower room',(await state()).activeStory===1&&(await state()).selection?.kind!=='room');
 await page.locator('[data-action="floor-match"]').first().click();await page.locator('#matchHalf').click();await page.locator('#matchX').fill('-2');await page.locator('#matchY').fill('1');await page.locator('#matchCreate').click();
 check('Match / offset from room below creates partial upper footprint',await E(()=>{const f=RCApp.project.floorSections.at(-1);return f.story===1&&f.x===-2&&f.y===1&&f.width===4&&f.length===3;}));
 await page.locator('[data-action="rename-story"]').click();await page.locator('#storyRename').fill('Mezzanine');await page.locator('#storyRenameConfirm').click();
 check('Renamed story appears consistently in inspector and work context',(await page.locator('#stageTitle').innerText()).includes('Mezzanine')&&(await page.locator('#inspector').textContent()).includes('Mezzanine'));
 // Free walls use their own story even when their material host is below.
 await E(()=>{RCApp.mutate(()=>RCCore.createFreeWall(RCApp.project,1,{x:1,y:1},{x:3,y:1}),'Test wall');RCApp.draw();});
 check('Free walls render on an otherwise unenclosed upper story',await E(()=>RCApp.renderer.isoWalls.some(w=>w.wall.partitionId&&w.wall.story===1)));
 // Save through the actual download button, then reopen the resulting bundle.
 const downloadP=page.waitForEvent('download');await page.locator('#saveBtn').click();const download=await downloadP;const saved=path.join(root,'tests','story_floor_roundtrip.room.json');await download.saveAs(saved);const bundle=JSON.parse(fs.readFileSync(saved,'utf8'));check('Saved file retains compatible schema and story names',bundle.project.version===10&&bundle.project.stories[1].name==='Mezzanine'&&bundle.project.floorSections.length===n+1);
 await page.locator('#projectFile').setInputFiles(saved);await settle();await page.locator('[data-story="1"]').click();check('Saved project reopens with the complete floor geometry',await E(()=>RCApp.project.floorSections.length===4&&RCApp.project.stories[1].name==='Mezzanine'));
 // Regression examples must remain importable and both render modes operational.
 for(const name of ['Manual_Construction_Atrium','Atrium_Gallery','Partitions_and_Attached_Room']){const data=JSON.parse(fs.readFileSync(path.join(root,'examples',name+'.room.json'),'utf8'));await page.evaluate(b=>RCApp.applyBundle(b),data);await settle();await E(()=>{RCApp.draw();if(RCApp.project.viewpoints.length){RCApp.selectView(RCApp.project.viewpoints[0].id,{open:true});RCApp.draw();}});check(name+' still loads and renders',await E(()=>RCApp.project.rooms.length>0));}
 check('No unhandled browser errors',errors.length===0);
}catch(e){results.push({name:'Completion',passed:false,error:e.message});await page.screenshot({path:path.join(root,'previews','v0_11_failure.png')});console.error(e.message);}
finally{fs.writeFileSync(path.join(root,'tests','story_floor_ux_results.json'),JSON.stringify({passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,errors,results},null,2));await browser.close();process.exitCode=results.some(x=>!x.passed)?1:0;}
})();
