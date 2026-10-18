from rc_test_runtime import rc_path, rc_uri, rc_output, rc_prior
import asyncio, json
from playwright.async_api import async_playwright
OUT=rc_output('shots')
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); pg = await b.new_page(viewport={'width': 1500, 'height': 900})
        logs=[]; pg.on('pageerror', lambda e: logs.append('PAGEERROR '+str(e))); pg.on('console', lambda m: logs.append(m.text) if m.type=='error' else None)
        await pg.goto(rc_uri('Room_Creator.html')); await pg.wait_for_timeout(300)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));}", open(rc_path('examples/City_Block_Dusk.room.json')).read())
        await pg.evaluate("""()=>RCApp.mutate(()=>{const p=RCApp.project,v=RCApp.core.createViewpoint(p,{x:18,y:46},{x:30,y:46},'Harlan east',null,0);v.fov=75;},'Place viewpoint')""")
        vid = await pg.evaluate("()=>RCApp.project.viewpoints[0].id")
        await pg.evaluate("id=>RCApp.selectView(id,{open:true})", vid); await pg.wait_for_timeout(300)
        await pg.click('[data-pane="sky"]'); await pg.wait_for_timeout(400)
        await pg.screenshot(path=f'{OUT}/sky1_pane.png')
        await pg.click('[data-sky-preset="sunset"]'); await pg.wait_for_timeout(400)
        print('after preset', await pg.evaluate("()=>JSON.stringify(RCApp.project.sky).slice(0,140)"), 'hist', await pg.evaluate("()=>RCApp.state.history"))
        await pg.screenshot(path=f'{OUT}/sky2_sunset.png')
        await pg.click('[data-sky-mode="image"]'); await pg.wait_for_timeout(500)
        print('image mode', await pg.evaluate("()=>{const s=RCApp.project.sky;return [s.mode,s.assetId,s.repeat,s.mirror]}"))
        await pg.screenshot(path=f'{OUT}/sky3_image.png')
        # drag the "Turn around" slider via keyboard on the range input
        sl = pg.locator('input[type=range][data-sky="rotation"]')
        await sl.focus()
        for i in range(20): await pg.keyboard.press('ArrowRight')
        await pg.wait_for_timeout(300)
        print('rotation now', await pg.evaluate("()=>RCApp.project.sky.rotation"), 'hist', await pg.evaluate("()=>RCApp.state.history"))
        # click horizon picker 70% down
        box = await pg.locator('[data-sky-pick]').bounding_box()
        await pg.mouse.click(box['x']+box['width']/2, box['y']+box['height']*0.7); await pg.wait_for_timeout(400)
        print('horizonV', await pg.evaluate("()=>RCApp.project.sky.horizonV"))
        # haze on
        await pg.locator('input[type=checkbox][data-sky-haze="enabled"]').check(); await pg.wait_for_timeout(400)
        print('haze', await pg.evaluate("()=>JSON.stringify(RCApp.project.sky.haze)"))
        # drag preview
        pb = await pg.locator('#skyPreview').bounding_box()
        await pg.mouse.move(pb['x']+200, pb['y']+100); await pg.mouse.down(); await pg.mouse.move(pb['x']+60, pb['y']+130, steps=6); await pg.mouse.up(); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{OUT}/sky4_haze.png')
        await pg.keyboard.press('Control+z'); await pg.wait_for_timeout(300)
        print('after undo haze', await pg.evaluate("()=>RCApp.project.sky.haze.enabled"))
        print('\n'.join(logs[:20]))
        await b.close()
asyncio.run(main())
