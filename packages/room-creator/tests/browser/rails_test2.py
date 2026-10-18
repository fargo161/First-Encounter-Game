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
        await pg.evaluate("""()=>RCApp.mutate(()=>{const p=RCApp.project,C=RCApp.core;
            const mk=(n,x,y,f)=>{const b=C.basis(f);const v=C.createViewpoint(p,{x,y},{x:x+b.fx,y:y+b.fy},n,null,0);v.facing=f;v.fov=75;return v;};
            mk('Harlan east',18,46,90);mk('Bodega front',53,51.5,0);},'Place viewpoints')""")
        await pg.evaluate("()=>{RCApp.zoom=2.2;RCApp.draw();}")
        await pg.click('[data-tool="rail"]'); await pg.wait_for_timeout(300)
        for i in range(2):
            pt = await pg.evaluate(f"()=>RCApp.projectPoint(RCApp.project.viewpoints[{i}],0)")
            await pg.mouse.click(pt['x'], pt['y']); await pg.wait_for_timeout(200)
        # shift-click a bend between them, offset north on the street
        pt = await pg.evaluate("()=>RCApp.projectPoint({x:35,y:43},0)")
        await pg.keyboard.down('Shift'); await pg.mouse.click(pt['x'], pt['y']); await pg.keyboard.up('Shift'); await pg.wait_for_timeout(300)
        print('nodes', await pg.evaluate("()=>RCApp.project.rails[0].nodes.map(n=>n.kind+(n.x!=null?'@'+n.x+','+n.y:''))"))
        # drag the bend (diamond at its iso point)
        pt = await pg.evaluate("()=>{const n=RCApp.project.rails[0].nodes[1];return RCApp.projectPoint(n,0)}")
        await pg.mouse.move(pt['x'], pt['y']); await pg.mouse.down(); await pg.mouse.move(pt['x']+40, pt['y']+30, steps=5); await pg.mouse.up(); await pg.wait_for_timeout(300)
        print('after drag', await pg.evaluate("()=>{const n=RCApp.project.rails[0].nodes[1];return [n.x,n.y]}"), 'hist', await pg.evaluate("()=>RCApp.state.history"))
        await pg.screenshot(path=f'{OUT}/rail7_bend.png')
        # alt-click removes it
        pt = await pg.evaluate("()=>{const n=RCApp.project.rails[0].nodes[1];return RCApp.projectPoint(n,0)}")
        await pg.keyboard.down('Alt'); await pg.mouse.click(pt['x'], pt['y']); await pg.keyboard.up('Alt'); await pg.wait_for_timeout(300)
        print('after alt-click', await pg.evaluate("()=>RCApp.project.rails[0].nodes.length"))
        await pg.keyboard.press('Enter')
        # test walk ride
        await pg.evaluate("()=>{RCApp.selectView(RCApp.project.viewpoints[0].id);RCApp.enterTest();}"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{OUT}/rail8_test_panel.png')
        await pg.click('[data-rail-act^="ride-test:"]'); await pg.wait_for_timeout(1500)
        print('test ride', await pg.evaluate("()=>{const p=RCApp.ext().rails.play;return [p.id!=null,p.playing,p.ride,p.t.toFixed(2)]}"))
        await pg.screenshot(path=f'{OUT}/rail9_test_ride.png')
        await pg.evaluate("()=>{const p=RCApp.ext().rails.play;p.speed=4;}")
        await pg.wait_for_timeout(9000)
        print('ride end', await pg.evaluate("()=>{const p=RCApp.ext().rails.play;return [p.id,p.playing]}"), 'walk at view 2', await pg.evaluate("()=>RCApp.state.walkId===RCApp.project.viewpoints[1].id"))
        print('\n'.join(logs[:20]))
        await b.close()
asyncio.run(main())
