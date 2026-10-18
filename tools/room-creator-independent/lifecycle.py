import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
W=Path(__file__).resolve().parent;O=W.parents[1]/'outputs/Room_Creator_v0_14_1_Independent_Audit'
async def main():
 async with async_playwright() as pw:
  b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':1600,'height':950});await pg.goto('http://127.0.0.1:8783/candidate/Room_Creator.html')
  rows=await pg.evaluate(r'''async()=>{const A=RCApp,C=A.core,rows=[];const prop=(id,x=23,story=0)=>({id,asset:'missing',x,y:3,story,z:.8,rotation:29,scale:[1.2,2,.7],points:[{id:'future',type:'custom',x:.2,y:.9,z:.4,yaw:73,extra:{keep:1}}],collision:{solid:true,shape:'cylinder',size:[2,2,2]},extra:{keep:2},gameplay:{tags:[{future:true}],props:{a:[1,2]}}});
   for(const kind of ['cut','rehost-neighbour','floor-conversion','force-middle']){A.newProject(true);let rid,section;
    A.mutate(()=>{const p=A.project;if(kind==='force-middle'){C.addStory(p);C.addStory(p);p.rooms.push(C.makeRoom('middle',20,0,8,6,1),C.makeRoom('top',20,0,8,6,2));p.props=[prop('ground'),prop('middle',23,1),prop('top',23,2)];}
     else if(kind==='floor-conversion'){section=C.makeFloorSection(p,0,{x:20,y:0},{x:28,y:6}).id;p.props=[prop('target')];}
     else{const r=C.makeRoom('target',20,0,8,6);p.rooms.push(r);rid=r.id;p.props=[prop('target')];if(kind==='cut'){C.makeFloorSection(p,0,{x:20,y:0},{x:28,y:6});p.floorCuts.push({id:'cut',story:0,x:22,y:2,width:2,length:2});}
      else{p.rooms.push(C.makeRoom('neighbour',28,0,8,6));p.props[0].x=28;}}},'fixture');
    const before=JSON.stringify(A.project);let result;const ok=A.mutate(()=>{if(kind==='force-middle')result=C.deleteStory(A.project,1,{force:true});else if(kind==='floor-conversion')result=C.floorSectionToRoom(A.project,section);else result=C.deleteRoom(A.project,rid);},'independent lifecycle');const after=JSON.stringify(A.project),props=C.clone(A.project.props);let correct;
    if(kind==='cut')correct=result.props===1&&!props.length;else if(kind==='rehost-neighbour')correct=result.props===0&&props.length===1&&props[0].roomId===A.project.rooms.find(r=>r.name==='neighbour').id;else if(kind==='floor-conversion')correct=props[0].roomId===result.id;else correct=props.length===2&&props[1].id==='top'&&props[1].story===1&&props[1].extra.keep===2&&props[1].points[0].extra.keep===1;
    A.undo();const undo=JSON.stringify(A.project)===before;A.redo();const redo=JSON.stringify(A.project)===after;await A.applyBundle(JSON.parse(JSON.stringify(A.makeBundle())));rows.push({kind,passed:ok&&correct&&undo&&redo&&JSON.stringify(A.project)===after,correct,undo,redo,props,result});
   }return rows;}''')
  # Confirm real room-deletion dialog and counts, then delete via UI.
  await pg.evaluate('()=>{const A=RCApp,C=A.core;A.newProject(true);let r;A.mutate(()=>{r=C.makeRoom("Delete target",20,0,8,6);A.project.rooms.push(r);A.project.props=[{id:"remove",asset:"missing",x:23,y:3,story:0,extra:{keep:9}}];},"fixture");A.selectRoom(r.id);}')
  await pg.locator('[data-action="delete-room"]').first.click();text=await pg.locator('#modalRoot').inner_text();await pg.screenshot(path=str(O/'lifecycle-room-dialog.png'));await pg.click('#confirmYes');toast=await pg.locator('#toast').inner_text();rows.append({'kind':'room-dialog-count','passed':'1 3D objects' in text and 'Removed 1 3D objects' in toast and await pg.evaluate('()=>RCApp.project.props.length===0'),'dialog':text,'toast':toast})
  (O/'additional-lifecycle-results.json').write_text(json.dumps(rows,indent=2),encoding='utf-8');print(json.dumps(rows,indent=2));await b.close()
asyncio.run(main())
