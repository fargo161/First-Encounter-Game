from rc_test_runtime import rc_path, rc_uri, rc_output, rc_prior
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); pg = await b.new_page()
        await pg.goto(rc_uri('Room_Creator.html')); await pg.wait_for_timeout(300)
        r = await pg.evaluate("""()=>{const A=RCApp,C=A.core;A.mutate(()=>{const r=A.project.rooms[0];r.width=12;r.length=10;},'size');
          const o={name:'Floor 2',base:'all',shape:'full',edges:'room',setback:1,overhang:1.5,ring:2.5,sides:{N:0,E:0,S:0,W:0},copyLook:true,stairs:true};
          A.mutate(()=>A.ext().stories.buildUpApply(A.project,o),'build');
          A.mutate(()=>{const p=A.project;const a=C.createViewpoint(p,{x:9,y:8},{x:9,y:2},'Down',null,0);const b=C.createViewpoint(p,{x:9,y:7},{x:9,y:2},'Up',null,1);const rl=A.rails.newRail('Climb');rl.nodes=[A.rails.stopNode(a.id),A.rails.stopNode(b.id)];p.rails.push(rl);},'rail');
          const p=A.project,pl=A.rails.railPlan(p,p.rails[0]);const zs=pl.legs[0].rs.zs;return {dur:pl.duration.toFixed(1),len:pl.length.toFixed(1),warn:pl.warnings.map(w=>w.reason),zMin:Math.min(...zs),zMax:Math.max(...zs)};}""")
        print(r); await b.close()
asyncio.run(main())
