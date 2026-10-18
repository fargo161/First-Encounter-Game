import asyncio, json
from playwright.async_api import async_playwright
import os as _o
_PKG=_o.path.dirname(_o.path.dirname(_o.path.dirname(_o.path.abspath(__file__))))  # package folder
_OUT=_o.path.join(_o.path.dirname(_o.path.abspath(__file__)),'out'); _o.makedirs(_OUT,exist_ok=True)
from pathlib import Path
URL=_o.environ.get('RC_URL',Path(_PKG,'Room_Creator.html').as_uri())
SCENE=_PKG+'/examples/Route_Prototype_Street.room.json'
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1600,'height':950})
        await pg.goto(URL);await pg.wait_for_timeout(500)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));RCApp.draw();}",open(SCENE).read())
        r=await pg.evaluate("""()=>{const X=RCApp.ext().route;X.start();X.pause(true);X.input({fwd:true});
          let t=performance.now();for(let i=0;i<600;i++)X.step(1/60);const step=(performance.now()-t)/600;
          for(let i=0;i<4;i++){X.sync();RCApp.draw();}t=performance.now();for(let i=0;i<5;i++){X.sync();RCApp.draw();}const draw=(performance.now()-t)/5;
          X.RW.settings.debug=0;t=performance.now();for(let i=0;i<5;i++){RCApp.draw();}const drawNoDebug=(performance.now()-t)/5;X.RW.settings.debug=2;
          const g=document.getElementById('stage').getContext('2d');
          return {stepMs:+step.toFixed(3),drawMs:+draw.toFixed(1),drawNoDebugMs:+drawNoDebug.toFixed(1),npcsOn:X.npcs().filter(n=>n.state!=='hidden').length};}""")
        print(json.dumps(r))
        await b.close()
asyncio.run(main())
