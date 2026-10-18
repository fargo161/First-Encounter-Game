from rc_test_runtime import rc_path, rc_uri, rc_output, rc_prior
"""Fresh preview screenshots for the v0.13 package."""
import asyncio
from playwright.async_api import async_playwright
OUT=rc_output('previews')
import os; os.makedirs(OUT,exist_ok=True)
DEMO=rc_path('examples/City_Block_Rail_Demo.room.json')
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); pg = await b.new_page(viewport={'width':1500,'height':900})
        await pg.goto(rc_uri('Room_Creator.html')); await pg.wait_for_timeout(300)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));}", open(DEMO).read())
        await pg.evaluate("()=>{RCApp.setMode('iso');RCApp.zoom=1.8;RCApp.draw();}"); await pg.wait_for_timeout(300)
        await pg.click('[data-pane="rails"]'); await pg.click('[data-rail]'); await pg.wait_for_timeout(400)
        await pg.screenshot(path=f'{OUT}/01_map_rail.png')
        await pg.click('#planBtn'); await pg.wait_for_timeout(400); await pg.screenshot(path=f'{OUT}/02_plan_view.png')
        await pg.click('#isoBtn'); await pg.wait_for_timeout(200)
        await pg.click('[data-tl="ride"]'); await pg.wait_for_timeout(300)
        await pg.evaluate("()=>{const X=RCApp.ext().rails;X.pauseRail();X.play.t=X.planFor(RCApp.project.rails[0]).duration*.62;RCApp.refresh();RCApp.draw();}"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{OUT}/03_ride_in_first_person.png')
        await pg.click('[data-tl="close"]'); await pg.wait_for_timeout(300)
        vid = await pg.evaluate("()=>RCApp.project.viewpoints[0].id")
        await pg.evaluate("id=>RCApp.selectView(id,{open:true})", vid); await pg.wait_for_timeout(300)
        await pg.click('[data-pane="sky"]'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'{OUT}/04_edit_view_and_sky.png')
        await pg.keyboard.press('1'); await pg.wait_for_timeout(300)
        await pg.evaluate("()=>RCApp.selectStory(1)"); await pg.wait_for_timeout(500)
        await pg.click('[data-pane="architecture"]'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=f'{OUT}/05_upper_story_stairs.png')
        await pg.evaluate("()=>RCApp.selectStory(7)"); await pg.wait_for_timeout(400)
        await pg.click('#elevator [data-action="add-story"]'); await pg.wait_for_timeout(600)
        await pg.screenshot(path=f'{OUT}/06_build_up_wizard.png')
        await b.close()
asyncio.run(main())
