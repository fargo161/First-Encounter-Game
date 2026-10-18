"""Smoke test for the route-walk prototype: load the scene, start, walk, look, screenshot."""
import asyncio, json, sys
from playwright.async_api import async_playwright
import os as _o
_PKG=_o.path.dirname(_o.path.dirname(_o.path.dirname(_o.path.abspath(__file__))))  # package folder
_OUT=_o.path.join(_o.path.dirname(_o.path.abspath(__file__)),'out'); _o.makedirs(_OUT,exist_ok=True)
from pathlib import Path
URL=_o.environ.get('RC_URL',Path(_PKG,'Room_Creator.html').as_uri())
SCENE=_PKG+'/examples/Route_Prototype_Street.room.json'
OUT=_OUT+'/route_shots'
import os; os.makedirs(OUT,exist_ok=True)
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1600,'height':950})
        errs=[];pg.on('pageerror',lambda e:errs.append('PAGEERROR '+str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(URL);await pg.wait_for_timeout(500)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));RCApp.draw();}",open(SCENE).read())
        r=await pg.evaluate("()=>{const X=RCApp.ext().route;const ok=X.start();X.pause(true);return {ok,state:RCApp.state.mode,active:RCApp.state.active,pos:X.pos()};}")
        print('start',r)
        async def step(sec,inp=None,dt=1/30):
            if inp is not None: await pg.evaluate("o=>RCApp.ext().route.input(o)",inp)
            await pg.evaluate("([n,dt])=>{const X=RCApp.ext().route;for(let i=0;i<n;i++)X.step(dt);}",[int(sec/dt),dt])
        async def shot(name):
            await pg.evaluate("()=>{const X=RCApp.ext().route;X.sync();RCApp.draw();}");await pg.wait_for_timeout(120)
            await pg.screenshot(path=f'{OUT}/{name}.png')
        await step(.5); await shot('01_start')
        print('npcs',await pg.evaluate("()=>RCApp.ext().route.npcs()"))
        await step(4,{'fwd':True}); print('after walk',await pg.evaluate("()=>RCApp.ext().route.pos()"))
        await pg.evaluate("()=>RCApp.ext().route.look(80,0)"); await step(.2,{'fwd':False}); await shot('02_look_across')
        await pg.evaluate("()=>RCApp.ext().route.look(-60,0)"); await step(.2); await shot('03_look_left')
        await pg.evaluate("()=>RCApp.ext().route.look(0,0)")
        await step(14,{'fwd':True}); print('after 14s',await pg.evaluate("()=>RCApp.ext().route.pos()")); await shot('04_walked')
        print('stats',json.dumps(await pg.evaluate("()=>RCApp.ext().route.stats().rules")))
        await pg.keyboard.press('1'); await pg.wait_for_timeout(300); await shot('05_map')
        print('errors',errs[:10])
        await b.close()
asyncio.run(main())
