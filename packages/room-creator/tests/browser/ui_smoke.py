from rc_test_runtime import rc_path, rc_uri, rc_output, rc_prior
"""Headless browser smoke test for Room Creator 0.13.
usage: python3 ui_smoke.py [stage]   stage = hookup | fp | sky | rails | stories | all
Writes screenshots to /home/claude/v13/scratch/shots/ and prints timings + console errors."""
import asyncio, sys, json, time, os
from playwright.async_api import async_playwright
STAGE = sys.argv[1] if len(sys.argv) > 1 else 'hookup'
HTML = rc_uri('Room_Creator.html')
CITY = rc_path('examples/City_Block_Dusk.room.json')
OUT = rc_output('shots'); os.makedirs(OUT, exist_ok=True)

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        pg = await b.new_page(viewport={'width': 1500, 'height': 900})
        logs = []
        pg.on('console', lambda m: logs.append(m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: logs.append('PAGEERROR ' + str(e)))
        await pg.goto(HTML); await pg.wait_for_timeout(400)
        print('engine:', await pg.evaluate("()=>!!RCApp.engine"), '| badge:', await pg.inner_text('#engineBadge'))
        t = time.time()
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));}", open(CITY).read())
        await pg.wait_for_timeout(300); print('load city', round(time.time() - t, 2), 's')
        await pg.screenshot(path=f'{OUT}/01_map.png')
        # draw timing at a few zoom levels
        for z in (1, 4, 20, 60):
            ms = await pg.evaluate("z=>{RCApp.zoom=z;const t=performance.now();for(let i=0;i<5;i++)RCApp.draw();return (performance.now()-t)/5;}", z)
            print(f'draw ms @zoom {z}:', round(ms, 1))
        await pg.evaluate("()=>{RCApp.zoom=1;}")
        await pg.mouse.move(750, 450)
        for _ in range(12): await pg.mouse.wheel(0, -300); await pg.wait_for_timeout(20)
        await pg.wait_for_timeout(200); await pg.screenshot(path=f'{OUT}/02_zoomed.png')
        print('zoom after wheel:', round(await pg.evaluate("()=>RCApp.zoom"), 2))
        await pg.click('#fitBtn'); await pg.wait_for_timeout(150)
        await pg.click('#planBtn'); await pg.wait_for_timeout(250); await pg.screenshot(path=f'{OUT}/03_plan.png')
        print('projection:', await pg.evaluate("()=>RCApp.mapProjection"))
        await pg.click('#isoBtn'); await pg.wait_for_timeout(150)
        await pg.click('#labelsBtn'); await pg.wait_for_timeout(150); await pg.screenshot(path=f'{OUT}/04_labels_all.png')
        await pg.click('#labelsBtn'); await pg.click('#labelsBtn')
        await pg.evaluate("()=>RCApp.selectStory(2)"); await pg.wait_for_timeout(500); await pg.screenshot(path=f'{OUT}/05_story2.png')
        await pg.evaluate("()=>RCApp.selectStory(0)"); await pg.wait_for_timeout(400)
        # place a viewpoint and open first person
        ok = await pg.evaluate("""()=>RCApp.mutate(()=>{const p=RCApp.project,v=RCApp.core.createViewpoint(p,{x:18,y:46},{x:30,y:46},'Harlan east',null,0);v.fov=75;},'Place viewpoint')""")
        print('placed view:', ok)
        vid = await pg.evaluate("()=>RCApp.project.viewpoints[0].id")
        await pg.evaluate("id=>RCApp.selectView(id,{open:true})", vid); await pg.wait_for_timeout(400)
        await pg.screenshot(path=f'{OUT}/06_fp.png')
        ms = await pg.evaluate("()=>{const t=performance.now();for(let i=0;i<5;i++)RCApp.draw();return (performance.now()-t)/5;}")
        print('fp draw ms:', round(ms, 1))
        await pg.click('#isoBtn'); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/07_back_to_map.png')
        if STAGE in ('fp', 'sky', 'rails', 'stories', 'all'):
            pass
        print('--- console (errors/warnings) ---')
        for l in logs[:40]: print(l)
        await b.close()
asyncio.run(main())
