from rc_test_runtime import rc_path, rc_uri, rc_output, rc_prior
import asyncio, json, time
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
        V="()=>{const v=RCApp.project.viewpoints[0];return {x:+v.x.toFixed(3),y:+v.y.toFixed(3),facing:+v.facing.toFixed(2),fov:+v.fov.toFixed(2),eye:+v.eyeHeight.toFixed(3),horizon:+v.horizon.toFixed(3),hist:RCApp.state.history}}"
        print('start', await pg.evaluate(V))
        # drag in the sky area (top middle of the frame) to look
        await pg.mouse.move(700, 260); await pg.mouse.down();
        for i in range(10): await pg.mouse.move(700-12*i, 260+3*i); await pg.wait_for_timeout(16)
        await pg.mouse.up(); await pg.wait_for_timeout(200)
        print('after drag', await pg.evaluate(V))
        await pg.screenshot(path=f'{OUT}/fp1_after_drag.png')
        # walk forward
        await pg.keyboard.down('KeyW'); await pg.wait_for_timeout(700); await pg.keyboard.up('KeyW'); await pg.wait_for_timeout(500)
        print('after W', await pg.evaluate(V))
        # wheel lens
        await pg.mouse.move(700, 450)
        for i in range(4): await pg.mouse.wheel(0, -200); await pg.wait_for_timeout(30)
        await pg.wait_for_timeout(700); print('after wheel', await pg.evaluate(V))
        await pg.keyboard.down('KeyE'); await pg.wait_for_timeout(400); await pg.keyboard.up('KeyE'); await pg.wait_for_timeout(500)
        print('after E', await pg.evaluate(V))
        await pg.screenshot(path=f'{OUT}/fp2_edited.png')
        await pg.keyboard.press('Control+z'); await pg.wait_for_timeout(200); print('after undo', await pg.evaluate(V))
        # free camera
        await pg.click('[data-fp="free"]'); await pg.wait_for_timeout(200)
        F="()=>{const f=RCApp.freeCam;return f&&{x:+f.x.toFixed(2),y:+f.y.toFixed(2),story:f.story,z:+f.floorZ.toFixed(2),facing:+f.facing.toFixed(1),onStair:f.onStair}}"
        print('free', await pg.evaluate(F))
        # turn right 90 degrees (towards a building) and walk into it for 3 s
        await pg.keyboard.down('ArrowRight'); await pg.wait_for_timeout(1150); await pg.keyboard.up('ArrowRight')
        await pg.keyboard.down('KeyW'); await pg.wait_for_timeout(3000); await pg.keyboard.up('KeyW'); await pg.wait_for_timeout(200)
        print('free after walking into wall', await pg.evaluate(F))
        await pg.screenshot(path=f'{OUT}/fp3_free_wall.png')
        await pg.click('[data-fp="save"]'); await pg.wait_for_timeout(300)
        print('views', await pg.evaluate("()=>RCApp.project.viewpoints.map(v=>v.name+' '+v.x.toFixed(2)+','+v.y.toFixed(2))"), 'freeCam', await pg.evaluate(F))
        # back to map, double-click floor on the map to start the free camera there
        await pg.keyboard.press('1'); await pg.wait_for_timeout(300)
        pt = await pg.evaluate("()=>RCApp.projectPoint({x:60,y:46},0)")
        await pg.mouse.dblclick(pt['x'], pt['y']); await pg.wait_for_timeout(400)
        print('dbl map ->', await pg.evaluate("()=>RCApp.state.active"), await pg.evaluate(F))
        await pg.screenshot(path=f'{OUT}/fp4_free_from_map.png')
        # double-click a floor point in first person to glide
        await pg.mouse.dblclick(720, 640); await pg.wait_for_timeout(1500)
        print('after glide', await pg.evaluate(F))
        await pg.keyboard.press('1'); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/fp5_map_marker.png')
        print('\n'.join(logs[:20]))
        await b.close()
asyncio.run(main())
