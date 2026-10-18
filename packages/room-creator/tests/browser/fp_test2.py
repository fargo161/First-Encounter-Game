from rc_test_runtime import rc_path, rc_uri, rc_output, rc_prior
import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); pg = await b.new_page(viewport={'width': 1500, 'height': 900})
        logs=[]; pg.on('pageerror', lambda e: logs.append('PAGEERROR '+str(e)))
        await pg.goto(rc_uri('Room_Creator.html')); await pg.wait_for_timeout(300)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));}", open(rc_path('examples/City_Block_Dusk.room.json')).read())
        # collision: walk south from Harlan Av into the building line
        r = await pg.evaluate("""()=>{const A=RCApp,C=A.core,fp=A.ext().fp;let cam={x:18.3,y:46,story:0,onStair:null};const out=[];
          for(const facing of [0,90,180,270]){let c={...cam};const b=C.basis(facing);let n=0;for(let i=0;i<800;i++){const r=fp.stepTo(c,c.x+b.fx*.05,c.y+b.fy*.05,true);if(!r)break;c={...c,...r};n++;}out.push({facing,stoppedAt:[+c.x.toFixed(2),+c.y.toFixed(2)],steps:n});}
          return out;}""")
        print('collision runs (start 18.3,46):'); [print(' ',x) for x in r]
        # stairs: fresh project, two stories, stairs in the room, walk up
        r = await pg.evaluate("""()=>{const A=RCApp,C=A.core;A.newProject(true);let st;A.mutate(()=>{const p=A.project;const r=p.rooms[0];r.width=10;r.length=8;C.addStoryWithRooms(p,{});st=C.createStairs(p,{story:0,x:r.x+1,y:r.y+1.2,dir:'N',width:1.2});},'setup');
          const p=A.project,s=p.stairs[0],g=C.stairGeometry(p,s),fp=A.ext().fp;let c={x:g.entry.x,y:g.entry.y+.6,story:0,onStair:null};const trace=[];
          for(let i=0;i<400;i++){const r=fp.stepTo(c,c.x+g.dir.x*.05,c.y+g.dir.y*.05,true);if(!r){trace.push('blocked at '+c.x.toFixed(2)+','+c.y.toFixed(2)+' story '+c.story+' z '+(c.floorZ||0).toFixed(2));break;}c={...c,...r};if(i%10==0)trace.push([+c.x.toFixed(2),+c.y.toFixed(2),c.story,+(c.floorZ||0).toFixed(2),c.onStair?'stair':'']);}
          const down=[];for(let i=0;i<400;i++){const r=fp.stepTo(c,c.x-g.dir.x*.05,c.y-g.dir.y*.05,true);if(!r){down.push('blocked at '+c.x.toFixed(2)+','+c.y.toFixed(2)+' story '+c.story);break;}c={...c,...r};if(i%12==0)down.push([+c.x.toFixed(2),+c.y.toFixed(2),c.story,+(c.floorZ||0).toFixed(2),c.onStair?'stair':'']);}
          return {stairs:s,geo:g,trace,down};}""")
        print('stairs', json.dumps({k:r['stairs'][k] for k in ('x','y','width','length','dir','story')}))
        print('up:'); [print(' ',x) for x in r['trace']]
        print('down:'); [print(' ',x) for x in r['down']]
        print(logs)
        await b.close()
asyncio.run(main())
