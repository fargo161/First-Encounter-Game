"""Screenshots of the furnished ASSET_DEMO map (first-person views and close map views) for review and the report.
Needs the local web server on port 8770 (like the other asset tests). Writes tests/assets_evidence/demo_*.png."""
import asyncio, os, sys, json
from playwright.async_api import async_playwright
import os as _os
RC_PAGE = _os.environ.get('RC_PAGE', '/pkg/Room_Creator.html')  # page path on the test web server
RC_LIB = _os.environ.get('RC_LIB', '/lib/')  # library folder on the test web server
RC_FIXTURES = _os.environ.get('RC_FIXTURES', '/pkg/tests/fixtures/')  # tests/fixtures on the test web server
_INIT = 'window.__RC_LIB=%r;window.__RC_FIX=%r;' % (RC_LIB, RC_FIXTURES)
URL = os.environ.get('RC_BASE', 'http://127.0.0.1:8770') + RC_PAGE
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'assets_evidence')
DEMO = os.path.join(os.path.dirname(HERE), 'examples', 'Route_Prototype_Street_ASSET_DEMO.room.json')
FP = [('view_mvcv5kcl_h2iw3fo', 'shop_inside_door'), ('view_demo_shop_counter_clerk_side', 'shop_counter'), ('view_demo_stockroom', 'stockroom'),
      ('view_mvcv5kcl_ft6voqf', 'office'), ('view_mvcv5kd2_qk72wz9', 'flat_living'), ('view_demo_flat_dining', 'flat_dining'), ('view_demo_flat_living', 'flat_living2'),
      ('view_demo_parked_cover_car', 'cover_car'), ('view_demo_alley_dumpsters', 'alley'), ('view_demo_taco_truck', 'taco_truck'),
      ('view_mvcv5kcm_vrnaa6r', 'tunnel_van'), ('view_mvcv5kcl_dwgwaii', 'bodega_front')]
MAP = [('map_bodega', {'x': 53, 'y': 29}, 0, 5.5), ('map_flat', {'x': 55, 'y': 25}, 1, 7), ('map_street', {'x': 30, 'y': 40}, 0, 2.6), ('map_alley', {'x': 40, 'y': -3}, 0, 3)]
async def main():
    only = sys.argv[1:]
    async with async_playwright() as pw:
        b = await pw.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width': 1600, 'height': 950}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script(_INIT); await pg.goto(URL); await pg.wait_for_timeout(400)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));}", open(DEMO).read())
        await pg.evaluate("async()=>{await RCAssets.connectUrl(window.__RC_LIB);const ids=[...new Set(RCApp.project.props.map(q=>q.asset))];ids.forEach(id=>RCAssets.template(id));while(ids.some(id=>RCAssets.template(id).status==='loading'))await new Promise(r=>setTimeout(r,50));}")
        await pg.wait_for_timeout(800)
        for vid, name in FP:
            if only and name not in only: continue
            await pg.evaluate("v=>RCApp.selectView(v,{open:true})", vid); await pg.wait_for_timeout(1300)
            await pg.screenshot(path=f'{OUT}/demo_fp_{name}.png', clip={'x': 226, 'y': 182, 'width': 1074, 'height': 610})
        await pg.evaluate("()=>RCApp.setMode('iso')")
        for name, c, story, z in MAP:
            if only and name not in only: continue
            await pg.evaluate("([c,s,z])=>{RCApp.selectStory(s);RCApp.focusMap(c,z,s);}", [c, story, z]); await pg.wait_for_timeout(1300)
            await pg.screenshot(path=f'{OUT}/demo_{name}.png', clip={'x': 226, 'y': 182, 'width': 1074, 'height': 610})
        print('errors', errs); await b.close()
asyncio.run(main())
