from rc_test_runtime import rc_path, rc_uri, rc_output, rc_prior
import asyncio, json, time
from playwright.async_api import async_playwright
OUT=rc_output('shots')
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); pg = await b.new_page(viewport={'width': 1500, 'height': 900}, accept_downloads=True)
        logs=[]; pg.on('pageerror', lambda e: logs.append('PAGEERROR '+str(e))); pg.on('console', lambda m: logs.append(m.text) if m.type=='error' else None)
        await pg.goto(rc_uri('Room_Creator.html')); await pg.wait_for_timeout(300)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));}", open(rc_path('examples/City_Block_Dusk.room.json')).read())
        await pg.evaluate("""()=>RCApp.mutate(()=>{const p=RCApp.project,C=RCApp.core;
            const mk=(n,x,y,f)=>{const b=C.basis(f);const v=C.createViewpoint(p,{x,y},{x:x+b.fx,y:y+b.fy},n,null,0);v.facing=f;v.fov=75;return v;};
            mk('Harlan east',18,46,90);mk('Bodega front',53,51.5,0);mk('Bodega inside',47.6,34.6,40);},'Place viewpoints')""")
        print('views', await pg.evaluate("()=>RCApp.project.viewpoints.map(v=>v.name+' '+v.facing)"))
        # zoom so markers are clickable
        await pg.evaluate("()=>{RCApp.zoom=2.2;RCApp.draw();}")
        c = await pg.evaluate("()=>{const p=RCApp.project,v=p.viewpoints[1];return RCApp.projectPoint(v,0)}")
        # centre the map on view 2 via pan: easier to use mouse wheel at that point
        await pg.click('[data-pane="rails"]'); await pg.wait_for_timeout(200)
        await pg.click('[data-rail-act="new"]'); await pg.wait_for_timeout(300)
        print('tool', await pg.evaluate("()=>RCApp.state.tool"), 'sel', await pg.evaluate("()=>JSON.stringify(RCApp.state.selection)"))
        for i in range(3):
            pt = await pg.evaluate(f"()=>{{const v=RCApp.project.viewpoints[{i}];return RCApp.projectPoint(v,0)}}")
            await pg.mouse.click(pt['x'], pt['y']); await pg.wait_for_timeout(250)
        # add a bend point on the street east of the bodega front, inserted with shift between stop 2 and 3? just append one more bend then stop 1 again
        n = await pg.evaluate("()=>RCApp.project.rails[0].nodes.map(n=>n.kind+(n.viewId?':'+n.viewId.slice(-4):''))")
        print('nodes', n)
        plan = await pg.evaluate("()=>{const r=RCApp.project.rails[0],pl=RCApp.ext().rails.planFor(r);return {dur:+pl.duration.toFixed(2),len:+pl.length.toFixed(1),warn:pl.warnings.map(w=>w.reason),legs:pl.legs.length}}")
        print('plan', plan)
        await pg.keyboard.press('Enter'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=f'{OUT}/rail1_map.png')
        await pg.click('[data-tl="play"]'); await pg.wait_for_timeout(2500)
        print('t after play', await pg.evaluate("()=>RCApp.ext().rails.play.t.toFixed(2)"))
        await pg.screenshot(path=f'{OUT}/rail2_playing.png')
        await pg.click('[data-tl="ride"]'); await pg.wait_for_timeout(1500)
        print('active', await pg.evaluate("()=>RCApp.state.active"), 'riding pose', await pg.evaluate("()=>{const v=RCApp.ext().rails.railPose(RCApp.project.rails[0]);return v&&[v.x.toFixed(2),v.y.toFixed(2),v.facing.toFixed(1)]}"))
        await pg.screenshot(path=f'{OUT}/rail3_ride.png')
        # scrub to the middle
        await pg.evaluate("()=>{const s=document.querySelector('[data-tl-scrub]');s.value=s.max*0.55;s.dispatchEvent(new Event('input',{bubbles:true}));}")
        await pg.wait_for_timeout(400); await pg.screenshot(path=f'{OUT}/rail4_scrub.png')
        await pg.click('[data-tl="ride"]'); await pg.wait_for_timeout(300)
        # export json
        await pg.click('[data-tl="export"]'); await pg.wait_for_timeout(300)
        async with pg.expect_download() as dl: await pg.click('#railExpJson')
        d = await dl.value; pth = await d.path(); j=json.load(open(pth)); print('json frames', len(j['frames']), j['frames'][len(j['frames'])//2])
        await pg.select_option('#railExpSize', index=0); await pg.select_option('#railExpFps', '12')
        t=time.time()
        async with pg.expect_download(timeout=120000) as dl: await pg.click('#railExpFrames')
        d = await dl.value; print('frames zip', d.suggested_filename, round(time.time()-t,1),'s')
        async with pg.expect_download(timeout=120000) as dl: await pg.click('#railExpVideo')
        d = await dl.value; p2=await d.path(); import os; print('video', d.suggested_filename, os.path.getsize(p2), 'bytes')
        await pg.keyboard.press('Escape')
        # test walk transit
        ok = await pg.evaluate("()=>RCApp.mutate(()=>{const p=RCApp.project;RCApp.core.addLink(p,p.viewpoints[0].id,p.viewpoints[1].id);},'link')")
        print('link', ok)
        await pg.evaluate("()=>{RCApp.selectView(RCApp.project.viewpoints[0].id);RCApp.enterTest();}"); await pg.wait_for_timeout(300)
        await pg.evaluate("()=>RCApp.travel(RCApp.project.viewpoints[1].id)")
        await pg.wait_for_timeout(900)
        print('mid transit', await pg.evaluate("()=>!!RCApp.ext().rails.transit"), await pg.evaluate("()=>RCApp.state.walkId===RCApp.project.viewpoints[0].id"))
        await pg.screenshot(path=f'{OUT}/rail5_transit.png')
        await pg.wait_for_timeout(6000)
        print('arrived', await pg.evaluate("()=>RCApp.state.walkId===RCApp.project.viewpoints[1].id"), 'transit', await pg.evaluate("()=>!!RCApp.ext().rails.transit"))
        await pg.screenshot(path=f'{OUT}/rail6_test_left.png')
        print('\n'.join(logs[:20]))
        await b.close()
asyncio.run(main())
