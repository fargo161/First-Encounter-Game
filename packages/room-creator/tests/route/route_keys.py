"""Drives the route walk with real key presses (animation loop running), checks each control."""
import asyncio, json
from playwright.async_api import async_playwright
import os as _o
_PKG=_o.path.dirname(_o.path.dirname(_o.path.dirname(_o.path.abspath(__file__))))  # package folder
_OUT=_o.path.join(_o.path.dirname(_o.path.abspath(__file__)),'out'); _o.makedirs(_OUT,exist_ok=True)
from pathlib import Path
URL=_o.environ.get('RC_URL',Path(_PKG,'Room_Creator.html').as_uri())
SCENE=_PKG+'/examples/Route_Prototype_Street.room.json'
OUT=_OUT+'/route_shots'
R={}
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1600,'height':950})
        errs=[];pg.on('pageerror',lambda e:errs.append('PAGEERROR '+str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(URL);await pg.wait_for_timeout(500)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));RCApp.draw();}",open(SCENE).read())
        pos="()=>RCApp.ext().route.pos()"
        await pg.click('#routeBtn'); await pg.wait_for_timeout(600)
        R['started']=await pg.evaluate("()=>({mode:RCApp.state.mode,active:RCApp.state.active,on:RCApp.ext().route.RW.on})")
        # frame rate of the live loop here (software GPU)
        R['fps']=await pg.evaluate("()=>new Promise(res=>{let n=0;const t0=performance.now();const f=()=>{n++;if(performance.now()-t0<2000)requestAnimationFrame(f);else res(+(n/((performance.now()-t0)/1000)).toFixed(1));};requestAnimationFrame(f);})")
        await pg.mouse.move(800,500)
        await pg.evaluate("()=>RCApp.ext().route.pause(true)")
        async def run(sec): await pg.evaluate("n=>{const X=RCApp.ext().route;for(let i=0;i<n;i++)X.step(1/30);X.sync();RCApp.draw();}",int(sec*30))
        await pg.keyboard.down('w'); R['in_fwd']=await pg.evaluate('()=>RCApp.ext().route.RW.in.fwd'); await run(2.5); await pg.keyboard.up('w'); await run(.3)
        R['after_W']=await pg.evaluate(pos)
        await pg.keyboard.down('d'); await run(1.2); await pg.keyboard.up('d'); await run(.2); R['after_D']=await pg.evaluate(pos)
        await pg.keyboard.down('a'); await run(2.5); await pg.keyboard.up('a'); await run(.2); R['after_A']=await pg.evaluate(pos)
        await pg.keyboard.down('ArrowRight'); await run(2.5); await pg.keyboard.up('ArrowRight'); R['look_right_max']=await pg.evaluate(pos)
        await pg.keyboard.press('r'); await run(.6); R['after_R']=await pg.evaluate(pos)
        await pg.keyboard.press('r'); await run(.6); R['after_R2']=await pg.evaluate(pos)
        await pg.keyboard.press('Tab'); await pg.wait_for_timeout(200); R['debug_after_tab']=await pg.evaluate("()=>RCApp.ext().route.RW.settings.debug")
        await pg.keyboard.press('Tab'); await pg.keyboard.press('Tab');
        await pg.keyboard.press('c'); await run(.7); R['crouch_eye']=await pg.evaluate("()=>+RCApp.ext().route.RW.pl.eye.toFixed(2)")
        await pg.keyboard.press('c')
        # jump near the bodega door junction, try the closed door, open it, walk in
        await pg.evaluate("()=>{const RW=RCApp.ext().route.RW;RW.pl.s=RW.pl.edge.len-1.5;RW.pl.off=0;RW.pl.headYaw=-80;RW.pl.dir=1;RW.pl.bodyYaw=90;}")
        await pg.keyboard.down('w'); await run(2.5); await pg.keyboard.up('w'); await run(.2)
        R['closed_door_try']=await pg.evaluate(pos); R['door_open_before']=await pg.evaluate("()=>RCApp.project.openings.find(o=>o.id==='opening_bodega_door').open")
        await pg.screenshot(path=f'{OUT}/10_closed_door.png')
        await pg.keyboard.press('e'); await pg.wait_for_timeout(300); R['door_open_after_E']=await pg.evaluate("()=>RCApp.project.openings.find(o=>o.id==='opening_bodega_door').open")
        await pg.keyboard.down('w'); await run(3.5); await pg.keyboard.up('w'); await run(.3)
        R['entered']=await pg.evaluate(pos); await pg.screenshot(path=f'{OUT}/11_inside.png')
        await pg.keyboard.press('Space'); await pg.wait_for_timeout(100)
        await pg.keyboard.press('1'); await pg.wait_for_timeout(800); await pg.screenshot(path=f'{OUT}/12_map_centered.png')
        await pg.keyboard.press('3'); await pg.wait_for_timeout(500)
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(600)
        R['after_esc']=await pg.evaluate("()=>({mode:RCApp.state.mode,active:RCApp.state.active,on:RCApp.ext().route.RW.on,door:RCApp.project.openings.find(o=>o.id==='opening_bodega_door').open,dirty:RCApp.state.dirty,history:RCApp.state.history})")
        R['errors']=errs[:10]
        print(json.dumps(R,indent=1))
        await b.close()
asyncio.run(main())
