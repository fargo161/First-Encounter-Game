"""Room Creator 0.14 — browser acceptance test for the asset library, 3D objects, looks, palettes, collision and Use Points.

Run (from the work folder, with the library unzipped next to it and a local web server on port 8770 serving /home/claude):
    python3 tests/assets_browser.py
Writes tests/assets_browser_results.json and screenshots in tests/assets_evidence/.
Most steps drive the real UI (library cards, canvas clicks, inspector fields, keyboard, buttons); a few use the
RCApp.ext().props test hooks where a native dialog would otherwise be needed."""
import asyncio, json, os, sys, time, hashlib, math
from playwright.async_api import async_playwright
import os as _os
RC_PAGE = _os.environ.get('RC_PAGE', '/pkg/Room_Creator.html')  # page path on the test web server
RC_LIB = _os.environ.get('RC_LIB', '/lib/')  # library folder on the test web server
RC_FIXTURES = _os.environ.get('RC_FIXTURES', '/pkg/tests/fixtures/')  # tests/fixtures on the test web server
_INIT = 'window.__RC_LIB=%r;window.__RC_FIX=%r;' % (RC_LIB, RC_FIXTURES)

BASE = os.environ.get('RC_BASE', 'http://127.0.0.1:8770')
URL = BASE + RC_PAGE
LIB_URL = RC_LIB
LIB_DIR = _os.environ.get('RC_LIB_DIR', '/home/claude/assets_in/Trapstar_RoomCreator_Asset_Library_v1')  # the same library on disk
HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.dirname(HERE)
SCENE = os.path.join(WORK, 'examples', 'Route_Prototype_Street.room.json')
OUT = os.path.join(HERE, 'assets_evidence'); os.makedirs(OUT, exist_ok=True)
DL = os.path.join(OUT, 'downloads'); os.makedirs(DL, exist_ok=True)
for _f in os.listdir(OUT):
    if _f.endswith('_crash.png'): os.remove(os.path.join(OUT, _f))  # stale screenshots from an earlier failed run

CHAIR = 'lp_furniture_chairs_mesh_chair_wood_01'
DUMP = 'lp_dumpster_bins_mesh_dumpster_closed'
CAR = 'car_kent_ford_crown_victoria'

results = []
def check(name, ok, detail=None):
    results.append({'name': name, 'passed': bool(ok), 'detail': detail})
    print(('PASS ' if ok else 'FAIL ') + name + ('' if ok else f'  -> {json.dumps(detail)[:600]}'))

HELPERS = r"""
window.T = {
  P: () => RCApp.project,
  X: () => RCApp.ext().props,
  wait: async (ids, ms = 30000) => { ids.forEach(id => RCAssets.template(id)); const t0 = performance.now();
    while (ids.some(id => RCAssets.template(id).status === 'loading')) { if (performance.now() - t0 > ms) throw Error('timeout loading ' + ids); await new Promise(r => setTimeout(r, 50)); }
    return ids.map(id => RCAssets.template(id).status); },
  prop: id => (RCApp.project.props || []).find(p => p.id === id),
  last: () => { const a = RCApp.project.props || []; return a[a.length - 1]; },
  sleep: ms => new Promise(r => setTimeout(r, ms)),
};
"""

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        ctx = await b.new_context(viewport={'width': 1600, 'height': 950}, accept_downloads=True)
        pg = await ctx.new_page()
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'favicon' not in m.text else None)
        pg.on('dialog', lambda d: asyncio.ensure_future(d.dismiss()))
        await pg.add_init_script(_INIT); await pg.goto(URL); await pg.wait_for_timeout(500)
        await pg.evaluate(HELPERS)
        baseline_text = open(SCENE).read()
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));RCApp.setMode('iso');RCApp.draw();}", baseline_text)

        # ------------------------------------------------------------ A. library connection and browsing
        try:
            r = await pg.evaluate("async lib=>{const r=await RCAssets.connectUrl(lib);const S=RCAssets.state;return {ok:r.ok,msg:r.message,c:S.report.counts,warn:S.report.problems.filter(p=>p.level!=='info').map(p=>p.text)};}", LIB_URL)
            check('A1 library connects by web address with the documented counts (327 objects, 1043 textures, 3 palettes)',
                  r['ok'] and r['c']['models'] == 327 and r['c']['textures'] == 1043 and r['c']['palettes'] == 3, r)
            check('A2 the real library passes the plain-language check with no warnings', not r['warn'], r['warn'])
            check('A3 the 29 vehicles from unlicensed packs are counted as licence-unverified', r['c'].get('unverified') == 29, r['c'])
            await pg.click('[data-pane="library"]'); await pg.wait_for_timeout(400)
            n_cards = await pg.locator('[data-lib-asset]').count()
            await pg.fill('#libSearch', 'dumpster'); await pg.wait_for_timeout(300)
            n_dump = await pg.locator('[data-lib-asset]').count()
            names = await pg.locator('[data-lib-asset] span').all_inner_texts()
            check('A4 Library tab lists objects and search filters them', n_cards >= 40 and 0 < n_dump < 20 and all('umpster' in n or 'in' in n.lower() for n in names), {'cards': n_cards, 'dumpster': n_dump, 'names': names[:8]})
            await pg.wait_for_timeout(4000)
            thumbs = await pg.evaluate("()=>[...document.querySelectorAll('[data-lib-asset] img')].map(i=>!!i.getAttribute('src'))")
            check('A5 thumbnails are rendered from the real models (not the colour-wrong package previews)', sum(thumbs) >= max(1, len(thumbs) - 1), thumbs)
            await pg.screenshot(path=f'{OUT}/A_library_search.png')
            await pg.fill('#libSearch', ''); await pg.wait_for_timeout(200)
            await pg.click('[data-pa="lib-cat"][data-v="Vehicles"]'); await pg.wait_for_timeout(300)
            lic = await pg.locator('[data-lib-asset] i.lic').count()
            check('A6 vehicle cards carry the "licence unverified" warning mark', lic >= 20, lic)
            await pg.click('[data-pa="lib-cat"][data-v="All"]')
            tabs = await pg.evaluate("()=>[...document.querySelectorAll('.left-tabs button')].map(b=>({t:b.textContent.trim(),w:b.scrollWidth,cw:b.clientWidth}))")
            check('A7 left panel tabs (incl. Library) fit without cut-off labels', all(t['w'] <= t['cw'] + 1 for t in tabs) and any('Library' in t['t'] for t in tabs), tabs)

            # broken libraries give plain messages and do not throw
            r = await pg.evaluate("async()=>{const a=await RCAssets.connectUrl(window.__RC_FIX+'badlibs/bad_json/');const b=await RCAssets.connectUrl(window.__RC_FIX+'badlibs/nothing_here/');return {a:a.message,b:b.message,stillConnected:RCAssets.connected,models:RCAssets.state.report.counts.models};}")
            check('A8 a damaged manifest and a wrong folder give plain messages and keep the working library connected',
                  'damaged' in r['a'] and 'could not be read' in r['b'] and r['stillConnected'] and r['models'] == 327, r)
            r = await pg.evaluate("""async()=>{const a=await RCAssets.connectUrl(window.__RC_FIX+'badlibs/missing_file/');const S=RCAssets.state;
                const st=await T.wait(['chair_file_deleted','lp_furniture_chairs_mesh_chair_wood_01']);
                return {ok:a.ok,msg:a.message,problems:S.report.problems.map(p=>p.text),models:S.report.counts.models,st,err:RCAssets.template('chair_file_deleted').error,fails:S.report.loadFailures.map(f=>f.text)};}""")
            check('A9 manifest problems (duplicate ID, entry without path, non-record) and a missing model file are reported in plain words',
                  r['ok'] and any('Two entries use the ID' in t for t in r['problems']) and any('no file path' in t for t in r['problems']) and any('not an asset record' in t for t in r['problems'])
                  and r['st'][0] in ('error', 'missing') and r['st'][1] == 'ready', r)
            # webkitdirectory fallback (what Firefox/Safari users get): choose the folder in a file input
            t0 = time.time()
            await pg.set_input_files('#libraryFolder', LIB_DIR)
            for _ in range(200):
                c = await pg.evaluate("()=>RCAssets.connected&&RCAssets.state.kind==='files'?RCAssets.state.report.counts:null")
                if c: break
                await pg.wait_for_timeout(100)
            st = await pg.evaluate(f"async()=>{{const s=await T.wait(['{CHAIR}']);return s;}}")
            check('A10 the folder-picker fallback (webkitdirectory) connects the same library and loads models', bool(c) and c['models'] == 327 and st == ['ready'], {'counts': c, 'status': st, 'seconds': round(time.time() - t0, 1)})
            await pg.evaluate("async lib=>{await RCAssets.connectUrl(lib);}", LIB_URL)
            await pg.evaluate(f"()=>T.wait(['{CHAIR}','{DUMP}','{CAR}'])")

        except Exception as ex:
            check('A group stopped early (see screenshot A_crash.png)', False, str(ex)[:500]); await pg.screenshot(path=f'{OUT}/A_crash.png')
            for _p in ctx.pages[1:]:
                await _p.close()
            await pg.evaluate("()=>{document.querySelector('[data-action=\"close-modal\"]')?.click();}")
        # ------------------------------------------------------------ B. placing and editing with the real UI
        try:
            # bodega shop floor: room_shop x 46..60, y 28..36 (story 0)
            await pg.evaluate("()=>{RCApp.setMode('iso');RCApp.focusMap({x:52,y:32},5.5,0);}"); await pg.wait_for_timeout(400)
            await pg.click('[data-pa="lib-mode"][data-v="objects"]')
            await pg.fill('#libSearch', 'Wood Chair'); await pg.wait_for_timeout(300)
            await pg.locator(f'[data-lib-asset="{CHAIR}"]').first.click(); await pg.wait_for_timeout(200)
            banner = await pg.locator('.lib-banner').count()
            pt = await pg.evaluate("()=>RCApp.projectPoint({x:50,y:31},0)")
            await pg.mouse.move(pt['x'] - 30, pt['y'] - 10); await pg.mouse.move(pt['x'], pt['y']); await pg.wait_for_timeout(300)
            ghost = await pg.evaluate("()=>!!T.X().PZ.ghost")
            await pg.keyboard.press(']'); await pg.keyboard.press(']'); await pg.wait_for_timeout(100)
            h0 = await pg.evaluate("()=>RCApp.state.history")
            await pg.mouse.click(pt['x'], pt['y']); await pg.wait_for_timeout(300)
            r = await pg.evaluate("()=>{const q=T.last();return {n:(RCApp.project.props||[]).length,asset:q&&q.asset,x:q&&q.x,y:q&&q.y,rot:q&&q.rotation,room:q&&q.roomId,sel:RCApp.state.selection,tool:RCApp.state.tool,hist:RCApp.state.history,bounds:q&&q.bounds};}")
            check('B1 click a library card, see a ghost under the cursor, turn it with ] and click a floor to place it',
                  banner == 1 and ghost and r['n'] == 1 and r['asset'] == CHAIR and abs(r['x'] - 50) < .1 and abs(r['y'] - 31) < .1 and r['rot'] == 30 and r['room'] == 'room_shop'
                  and r['sel']['kind'] == 'prop' and r['tool'] == 'select' and r['hist'] == h0 + 1, r)
            chair_id = await pg.evaluate("()=>T.last().id")
            # shift-click keeps placing
            await pg.locator(f'[data-lib-asset="{CHAIR}"]').first.click()
            for k, (x, y) in enumerate([(51, 31), (52, 31)]):
                p2 = await pg.evaluate(f"()=>RCApp.projectPoint({{x:{x},y:{y}}},0)")
                await pg.keyboard.down('Shift'); await pg.mouse.click(p2['x'], p2['y']); await pg.keyboard.up('Shift'); await pg.wait_for_timeout(150)
            still = await pg.evaluate("()=>!!T.X().PZ.placing")
            await pg.keyboard.press('Escape'); await pg.wait_for_timeout(100)
            r = await pg.evaluate("()=>({n:RCApp.project.props.length,placing:!!T.X().PZ.placing,ghost:!!T.X().PZ.ghost})")
            check('B2 Shift+click keeps placing copies; Esc stops placing', still and r['n'] == 3 and not r['placing'] and not r['ghost'], r)
            # place outside any floor is refused
            await pg.evaluate(f"()=>T.X().startPlacing('{CHAIR}')")
            n_before = await pg.evaluate("()=>RCApp.project.props.length")
            await pg.evaluate("()=>T.X().place('" + CHAIR + "',{x:500,y:500,story:0})")
            n_after = await pg.evaluate("()=>RCApp.project.props.length")
            await pg.keyboard.press('Escape')
            check('B3 placing off every floor is refused with a message (no stray objects)', n_before == n_after, [n_before, n_after])
            # select by clicking it on the map, then drag to move
            await pg.evaluate("()=>{RCApp.refresh();}")
            cpt = await pg.evaluate(f"()=>{{const q=T.prop('{chair_id}');return RCApp.projectPoint({{x:q.x,y:q.y}},0);}}")
            hull = await pg.evaluate(f"()=>{{const q=T.prop('{chair_id}');const h=T.X().propScreenHull(q);const c=h.reduce((a,p)=>({{x:a.x+p.x/h.length,y:a.y+p.y/h.length}}),{{x:0,y:0}});return RCApp.viewPoint(c);}}")
            await pg.mouse.click(10, 500)  # click empty panel area? (left panel) -> no change
            await pg.evaluate("()=>{RCApp.selectRoom('room_shop');}")
            await pg.mouse.move(hull['x'], hull['y']); await pg.mouse.down(); await pg.wait_for_timeout(50)
            tgt = await pg.evaluate("()=>RCApp.projectPoint({x:50,y:33},0)")
            dx, dy = tgt['x'] - cpt['x'], tgt['y'] - cpt['y']
            h0 = await pg.evaluate("()=>RCApp.state.history")
            for i in range(1, 9):
                await pg.mouse.move(hull['x'] + dx * i / 8, hull['y'] + dy * i / 8); await pg.wait_for_timeout(16)
            await pg.mouse.up(); await pg.wait_for_timeout(200)
            r = await pg.evaluate(f"()=>{{const q=T.prop('{chair_id}');return {{x:q.x,y:q.y,sel:RCApp.state.selection,hist:RCApp.state.history,room:q.roomId}};}}")
            check('B4 click an object on the map selects it; dragging moves it (snapped) as one undo step',
                  r['sel'] == {'kind': 'prop', 'id': chair_id} and abs(r['x'] - 50) < .08 and abs(r['y'] - 33) < .08 and r['hist'] == h0 + 1 and r['room'] == 'room_shop', r)
            await pg.keyboard.press('Control+z'); await pg.wait_for_timeout(150)
            u = await pg.evaluate(f"()=>{{const q=T.prop('{chair_id}');return [q.x,q.y];}}")
            await pg.keyboard.press('Control+y'); await pg.wait_for_timeout(150)
            rr = await pg.evaluate(f"()=>{{const q=T.prop('{chair_id}');return [q.x,q.y];}}")
            if abs(rr[1] - 33) > .08:
                await pg.keyboard.press('Control+Shift+z'); await pg.wait_for_timeout(150)
                rr = await pg.evaluate(f"()=>{{const q=T.prop('{chair_id}');return [q.x,q.y];}}")
            check('B5 undo puts it back; redo moves it again', abs(u[0] - 50) < .01 and abs(u[1] - 31) < .01 and abs(rr[1] - 33) < .08, {'undo': u, 'redo': rr})
            # rotation handle drag
            await pg.evaluate(f"()=>T.X().select('{chair_id}')"); await pg.wait_for_timeout(100)
            hp = await pg.evaluate(f"""()=>{{const q=T.prop('{chair_id}');const P=RCApp.core;const b=q.bounds;const pt=P.propToPlan(q,{{x:0,y:0,z:Math.max(b.max[2],.3)+.55}},null,0);
                return {{h:RCApp.viewPoint(P.isoPoint(RCApp.project,pt,pt.z)),c:RCApp.projectPoint({{x:q.x,y:q.y}},0),east:RCApp.projectPoint({{x:q.x+1.5,y:q.y}},0),rot:q.rotation}};}}""")
            await pg.mouse.move(hp['h']['x'], hp['h']['y']); await pg.mouse.down()
            for i in range(1, 7):
                await pg.mouse.move(hp['h']['x'] + (hp['east']['x'] - hp['h']['x']) * i / 6, hp['h']['y'] + (hp['east']['y'] - hp['h']['y']) * i / 6); await pg.wait_for_timeout(16)
            await pg.mouse.up(); await pg.wait_for_timeout(150)
            rot = await pg.evaluate(f"()=>T.prop('{chair_id}').rotation")
            check('B6 dragging the round handle turns the object toward the cursor in 15° steps', rot == 90, {'before': hp['rot'], 'after': rot})
            # keyboard turn and nudge
            await pg.mouse.move(800, 900)
            await pg.keyboard.press(']'); await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(100)
            r = await pg.evaluate(f"()=>{{const q=T.prop('{chair_id}');return [q.rotation,q.x];}}")
            check('B7 keys: ] turns 15°, arrow nudges 0.1 m', r[0] == 105 and abs(r[1] - 50.1) < .02, r)
            # inspector fields: X, size slider, name, duplicate, delete, undo
            await pg.fill('[data-pf="x"]', '49.5'); await pg.press('[data-pf="x"]', 'Enter'); await pg.wait_for_timeout(150)
            sl = pg.locator('input[type="range"][data-pf="scaleU"]')
            await sl.fill('1.5'); await sl.dispatch_event('change'); await pg.wait_for_timeout(150)
            await pg.fill('[data-pf="name"]', 'Shop chair'); await pg.press('[data-pf="name"]', 'Tab'); await pg.wait_for_timeout(150)
            r = await pg.evaluate(f"()=>{{const q=T.prop('{chair_id}');return {{x:q.x,s:q.scale,name:q.name,title:document.querySelector('.prop-head h2')?.textContent}};}}")
            check('B8 inspector edits: position field, size slider and name', abs(r['x'] - 49.5) < .001 and r['s'] == [1.5, 1.5, 1.5] and r['name'] == 'Shop chair' and r['title'] == 'Shop chair', r)
            await pg.evaluate(f"()=>T.X().addPoint(T.prop('{chair_id}'),'sit')")
            await pg.click('[data-pa="prop-duplicate"]'); await pg.wait_for_timeout(150)
            r = await pg.evaluate(f"()=>{{const a=T.prop('{chair_id}'),c=T.last();return {{n:RCApp.project.props.length,newId:c.id!==a.id,sel:RCApp.state.selection.id===c.id,ptIds:c.points.map(p=>p.id).join()!==a.points.map(p=>p.id).join(),name:c.name,dx:+(c.x-a.x).toFixed(2),pts:c.points.length}};}}")
            check('B9 Duplicate makes an independent copy (new IDs for it and its use points), offset and selected', r['n'] == 4 and r['newId'] and r['sel'] and r['ptIds'] and r['pts'] == 1 and r['name'] == 'Shop chair copy', r)
            dup_id = await pg.evaluate("()=>T.last().id")
            await pg.mouse.move(800, 900); await pg.keyboard.press('Delete'); await pg.wait_for_timeout(150)
            gone = await pg.evaluate(f"()=>!T.prop('{dup_id}')")
            await pg.keyboard.press('Control+z'); await pg.wait_for_timeout(150)
            back = await pg.evaluate(f"()=>!!T.prop('{dup_id}')")
            check('B10 Delete removes the selected object; undo brings it back', gone and back, [gone, back])
            await pg.screenshot(path=f'{OUT}/B_inspector_map.png')
            # replace keeps placement, tags and points
            await pg.evaluate(f"()=>{{T.X().select('{dup_id}');}}")
            await pg.click('[data-pa="prop-replace"]'); await pg.wait_for_timeout(200)
            await pg.fill('#libSearch', 'chair'); await pg.wait_for_timeout(300)
            rep_id = await pg.evaluate("()=>{const c=[...document.querySelectorAll('[data-lib-asset]')].find(c=>c.dataset.libAsset!=='lp_furniture_chairs_mesh_chair_wood_01'&&RCAssets.entry(c.dataset.libAsset).sub==='Chairs');return c&&c.dataset.libAsset;}")
            if rep_id:
                await pg.evaluate(f"()=>T.wait(['{rep_id}'])")
                await pg.locator(f'[data-lib-asset="{rep_id}"]').first.click(); await pg.wait_for_timeout(200)
            r = await pg.evaluate(f"()=>{{const q=T.prop('{dup_id}');return {{asset:q.asset,pts:q.points.length,x:q.x,rot:q.rotation,bounds:q.bounds}};}}")
            check('B11 Replace swaps the model in place and keeps position, turn and use points', rep_id and r['asset'] == rep_id and r['pts'] == 1, {'replacement': rep_id, **r})

            # first person: select and place by clicking
            await pg.evaluate("()=>{RCApp.selectView('view_mvcv5kcl_h2iw3fo',{open:true});}"); await pg.wait_for_timeout(1200)
            fpv = await pg.evaluate("()=>{const v=RCApp.project.viewpoints.find(v=>v.id==='view_mvcv5kcl_h2iw3fo');return {x:v.x,y:v.y,facing:v.facing,story:v.story||0};}")
            await pg.evaluate(f"()=>T.X().startPlacing('{DUMP}')")
            canvas_box = await pg.locator('#canvas').bounding_box() if await pg.locator('#canvas').count() else await pg.locator('canvas').first.bounding_box()
            # click in the lower middle of the frame (a floor point a couple of metres ahead)
            fp_click = await pg.evaluate("()=>{const g=RCApp.geometry(),v=RCApp.state;const r=document.querySelector('#stage').getBoundingClientRect();return {x:r.left+g.ox+g.W*0.5*g.scale,y:r.top+g.oy+g.H*0.8*g.scale};}")
            await pg.mouse.move(fp_click['x'], fp_click['y'] - 5); await pg.mouse.move(fp_click['x'], fp_click['y']); await pg.wait_for_timeout(300)
            await pg.mouse.click(fp_click['x'], fp_click['y']); await pg.wait_for_timeout(400)
            r = await pg.evaluate(f"()=>{{const q=T.last();return {{asset:q.asset,x:q.x,y:q.y,story:q.story,room:q.roomId}};}}")
            dist = ((r['x'] - fpv['x']) ** 2 + (r['y'] - fpv['y']) ** 2) ** .5
            check('B12 placing in first person drops the object on the floor point under the cursor', r['asset'] == DUMP and .5 < dist < 6, {**r, 'dist': round(dist, 2), 'view': fpv})
            fp_dump = await pg.evaluate("()=>T.last().id")
            await pg.evaluate("()=>{RCApp.selectRoom('room_shop');RCApp.setMode('fp');}"); await pg.wait_for_timeout(600)
            # click on the object itself in first person (project its centre to the screen)
            sp = await pg.evaluate(f"""()=>{{const E=RCApp.engine,p=RCApp.project,v=p.viewpoints.find(v=>v.id==='view_mvcv5kcl_h2iw3fo'),g=RCApp.geometry(),cam=E.camFromView(p,{{...v,width:g.W,height:g.H}});
                const r=document.querySelector('#stage').getBoundingClientRect();for(let j=0.35;j<0.98;j+=0.03)for(let i=0.02;i<0.98;i+=0.02){{const m=E.pick(p,cam,i,j);if(m&&m.kind==='prop'&&m.id==='{fp_dump}')return {{x:r.left+g.ox+i*g.W*g.scale,y:r.top+g.oy+j*g.H*g.scale,i,j}};}}return null;}}""")
            sel_ok = False
            if sp:
                await pg.mouse.click(sp['x'], sp['y']); await pg.wait_for_timeout(300)
                sel_ok = await pg.evaluate(f"()=>{{const s=RCApp.state.selection;return s&&s.kind==='prop'&&s.id==='{fp_dump}';}}")
            await pg.screenshot(path=f'{OUT}/B_first_person_selected.png')
            check('B13 clicking a 3D object in first person selects it (outline + inspector)', sel_ok, sp)
            await pg.evaluate("()=>RCApp.setMode('iso')")

        except Exception as ex:
            check('B group stopped early (see screenshot B_crash.png)', False, str(ex)[:500]); await pg.screenshot(path=f'{OUT}/B_crash.png')
            for _p in ctx.pages[1:]:
                await _p.close()
            await pg.evaluate("()=>{document.querySelector('[data-action=\"close-modal\"]')?.click();}")
        # ------------------------------------------------------------ C. save -> reload with unknown / custom metadata
        try:
            future = {
                'id': 'prop_future', 'asset': DUMP, 'name': 'Alley dumpster', 'x': 44.5, 'y': -2.2, 'story': 0, 'z': 0, 'rotation': 90, 'scale': [1, 1, 1],
                'enabled': True, 'locked': False, 'look': None, 'override': {'tint': '#335544', 'tintStrength': .3, 'weathering': {'rust': .4, 'decals': ['tag_07']}},
                'collision': {'solid': True, 'shape': 'box', 'size': [1.3, 1.9, 1.5], 'material': 'metal', 'navCost': 4},
                'gameplay': {'tags': ['cover', 'hide', 'smells-bad', {'id': 'faction-cache', 'faction': 'Kings'}], 'props': {'loot': {'table': 'alley_junk', 'rolls': 2}, 'noise': .7}, 'questHook': 'Q12'},
                'points': [{'id': 'pt_cover_n', 'type': 'cover', 'name': 'North side', 'x': 0, 'y': 0, 'z': -1.1, 'yaw': 180, 'enabled': True, 'props': {'lean': 'left'}, 'stance': 'crouch'},
                           {'id': 'pt_custom', 'type': 'graffiti-spot', 'x': .3, 'y': 1.2, 'z': .9, 'yaw': 0, 'enabled': False, 'custom': {'artist': 'unknown'}}],
                'lod': {'far': 'billboard'}, 'editorNotes': 'future key at the root', 'unity': {'prefabGuid': 'abc'}}
            flib = {'customTopLevel': {'keep': True}, 'looks': [{'id': 'look_green', 'name': 'Council green', 'asset': DUMP, 'tint': '#2e6b3a', 'tintStrength': .5, 'author': 'Teddy', 'shaderHints': {'grime': .2}}],
                    'palettes': [], 'setups': {'some_future_asset': {'front': -1, 'notes': 'kept', 'custom': [1, 2, 3]}}}
            await pg.evaluate("([f,l])=>RCApp.mutate(()=>{const p=RCApp.project;p.props.push(f);p.objectLibrary=Object.assign(p.objectLibrary||{schema:1,looks:[],palettes:[],setups:{}},{customTopLevel:l.customTopLevel,setups:Object.assign((p.objectLibrary||{}).setups||{},l.setups)});p.objectLibrary.looks=[...(p.objectLibrary.looks||[]),...l.looks];},'test future data')", [future, flib])
            # edit through the UI: select it, nudge with the arrow key, add a tag with the tag box, rename a point
            await pg.evaluate("()=>{T.X().select('prop_future');RCApp.focusMap({x:44.5,y:-2.2},4,0);}"); await pg.wait_for_timeout(200)
            await pg.mouse.move(800, 900); await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(100)
            await pg.evaluate("()=>{for(const d of document.querySelectorAll('#inspector details'))d.open=true;}")
            await pg.fill('#propTagNew', 'lootable'); await pg.click('[data-pa="tag-add"]'); await pg.wait_for_timeout(150)
            async with pg.expect_download() as dli:
                await pg.keyboard.press('Control+s')
            d = await dli.value; path = os.path.join(DL, 'saved_with_future.room.json'); await d.save_as(path)
            saved = json.load(open(path))
            sp_ = next(p for p in saved['project']['props'] if p['id'] == 'prop_future')
            def same(k): return sp_.get(k) == future.get(k)
            ok = all(same(k) for k in ['lod', 'editorNotes', 'unity', 'override', 'collision', 'points', 'name', 'asset']) and sp_['gameplay']['questHook'] == 'Q12' \
                and sp_['gameplay']['props'] == future['gameplay']['props'] and sp_['gameplay']['tags'][:4] == future['gameplay']['tags'] and sp_['gameplay']['tags'][4] == 'lootable' and abs(sp_['x'] - 44.6) < .001
            ol = saved['project']['objectLibrary']
            ok2 = ol.get('customTopLevel') == {'keep': True} and ol['setups']['some_future_asset'] == flib['setups']['some_future_asset'] and next(l for l in ol['looks'] if l['id'] == 'look_green') == flib['looks'][0]
            check('C1 after UI edits (nudge, add tag) the saved file keeps every unknown field byte-identical', ok, {k: sp_.get(k) for k in ['x', 'gameplay', 'lod']})
            check('C2 unknown fields in looks, setups and the library block are saved unchanged', ok2, ol.get('customTopLevel'))
            # reload in a fresh page from the downloaded file via the real Open button
            pg2 = await ctx.new_page(); pg2.on('pageerror', lambda e: errs.append('PAGEERROR(2) ' + str(e)))
            await pg2.add_init_script(_INIT); await pg2.goto(URL); await pg2.wait_for_timeout(500); await pg2.evaluate(HELPERS)
            inp = await pg2.evaluate("()=>[...document.querySelectorAll('input[type=file]')].map(i=>i.id)")
            proj_input = '#projectFile' if 'projectFile' in inp else '#' + next(i for i in inp if 'roject' in i or 'open' in i.lower())
            await pg2.set_input_files(proj_input, path); await pg2.wait_for_timeout(1200)
            r2 = await pg2.evaluate("()=>{const q=(RCApp.project.props||[]).find(p=>p.id==='prop_future');return {n:(RCApp.project.props||[]).length,q};}")
            check('C3 reopening the saved file in a fresh editor restores every object and the custom data', r2['q'] is not None and r2['q']['unity'] == future['unity'] and r2['q']['points'] == future['points'] and r2['n'] == len(saved['project']['props']), {'n': r2['n'], 'inputs': inp})
            nolib = await pg2.evaluate("()=>({connected:RCAssets.connected,html:document.body.innerText.includes('placed 3D objects')})")
            await pg2.wait_for_timeout(900)
            await pg2.screenshot(path=f'{OUT}/C_reopened_without_library.png')
            # re-save without the library connected: still identical
            async with pg2.expect_download() as dli2:
                await pg2.evaluate("()=>RCApp.saveProject()")
            d2 = await dli2.value; path2 = os.path.join(DL, 'resaved_without_library.room.json'); await d2.save_as(path2)
            s2 = json.load(open(path2))
            same_props = s2['project']['props'] == saved['project']['props'] and s2['project']['objectLibrary'] == saved['project']['objectLibrary']
            check('C4 saving again with no library connected changes nothing (objects show as boxes, data intact)', same_props and not nolib['connected'], nolib)
            await pg2.close()

        except Exception as ex:
            check('C group stopped early (see screenshot C_crash.png)', False, str(ex)[:500]); await pg.screenshot(path=f'{OUT}/C_crash.png')
            for _p in ctx.pages[1:]:
                await _p.close()
            await pg.evaluate("()=>{document.querySelector('[data-action=\"close-modal\"]')?.click();}")
        # ------------------------------------------------------------ D. appearance: looks, overrides, palettes, textures
        try:
            await pg.evaluate("()=>{RCApp.focusMap({x:52,y:32},5.5,0);}")
            ids = await pg.evaluate(f"""()=>{{const X=T.X();const out=[];for(const [x,y] of [[53,33],[54,33],[55,33]]){{X.place('{CHAIR}',{{x,y,story:0}});out.push(T.last().id);}}return out;}}""")
            a_id, b_id, c_id = ids
            await pg.evaluate(f"()=>T.X().select('{a_id}')"); await pg.wait_for_timeout(100)
            await pg.evaluate("()=>{for(const d of document.querySelectorAll('#inspector details'))d.open=true;}")
            rng = pg.locator('input[type="range"][data-pf="override.tintStrength"]')
            await rng.fill('0.6'); await rng.dispatch_event('change'); await pg.wait_for_timeout(100)
            await pg.evaluate("()=>{const i=document.querySelector('input[type=color][data-pf=\"override.tint\"]');i.value='#aa3322';i.dispatchEvent(new Event('change',{bubbles:true}));}"); await pg.wait_for_timeout(150)
            await pg.click('[data-pa="look-save"]'); await pg.fill('#renameValue', 'Red café chair'); await pg.click('#renameOk'); await pg.wait_for_timeout(200)
            look_id = await pg.evaluate(f"()=>T.prop('{a_id}').look")
            # apply the look to B with the Look dropdown
            await pg.evaluate(f"()=>T.X().select('{b_id}')"); await pg.wait_for_timeout(100)
            await pg.select_option('select[data-pf="look"]', look_id); await pg.wait_for_timeout(150)
            # C gets the look and its own brightness change
            await pg.evaluate(f"()=>T.X().select('{c_id}')"); await pg.wait_for_timeout(100)
            await pg.select_option('select[data-pf="look"]', look_id); await pg.wait_for_timeout(100)
            await pg.evaluate("()=>{for(const d of document.querySelectorAll('#inspector details'))d.open=true;}")
            br = pg.locator('input[type="range"][data-pf="override.brightness"]')
            await br.fill('1.6'); await br.dispatch_event('change'); await pg.wait_for_timeout(150)
            r = await pg.evaluate(f"""()=>{{const C=RCApp.core,p=RCApp.project,ap=id=>C.propAppearance(p,T.prop(id));const A=ap('{a_id}'),B=ap('{b_id}'),Cc=ap('{c_id}');
                return {{look:'{look_id}',A:[A.tint,A.tintStrength,A.brightness,A.from.tint],B:[B.tint,B.tintStrength,B.brightness],C:[Cc.tint,Cc.brightness,Cc.from.brightness,Cc.from.tint],
                tags:[...document.querySelectorAll('#inspector i.src')].map(i=>i.textContent)}};}}""")
            check('D1 "Save as look" turns one object\'s appearance into a named look that other copies pick from the Look menu',
                  look_id and r['A'][:2] == ['#aa3322', .6] and r['A'][3] == 'look' and r['B'][:2] == ['#aa3322', .6], r)
            check('D2 a per-object change (brightness on copy C) stays on that copy only and is labelled "this object"',
                  r['C'][1] == 1.6 and r['C'][2] == 'object' and r['C'][3] == 'look' and (r['A'][2] in (None, 1)) and (r['B'][2] in (None, 1)) and 'this object' in r['tags'], r)
            # editing the look changes all users but not C's own change
            await pg.evaluate(f"()=>RCApp.mutate(()=>{{RCApp.core.lookById(RCApp.project,'{look_id}').tint='#2255aa';}},'edit look')")
            r = await pg.evaluate(f"()=>{{const C=RCApp.core,p=RCApp.project;return ['{a_id}','{b_id}','{c_id}'].map(id=>{{const a=C.propAppearance(p,T.prop(id));return [a.tint,a.brightness];}});}}")
            check('D3 changing the shared look updates every object using it; copy C keeps its own brightness', [x[0] for x in r] == ['#2255aa'] * 3 and r[2][1] == 1.6 and r[0][1] in (None, 1), r)
            # rendering really differs: GL entries rebuild with different keys
            keys = await pg.evaluate(f"()=>{{const E=RCApp.engine;E.syncProps(RCApp.project,'build');return ['{a_id}','{c_id}'].map(id=>{{const e=E.propEntries.get(id);return e&&e.key;}});}}")
            check('D4 the 3D view rebuilds an object when its appearance changes (A and C render differently)', keys[0] and keys[1] and keys[0] != keys[1], keys)
            # quick palette via the Grimy chip
            await pg.evaluate(f"()=>T.X().select('{b_id}')"); await pg.wait_for_timeout(100)
            await pg.evaluate("()=>{for(const d of document.querySelectorAll('#inspector details'))d.open=true;}")
            await pg.click('[data-pa="pal-quick"][data-v="grimy"]'); await pg.wait_for_timeout(700)
            r = await pg.evaluate(f"""()=>{{const p=RCApp.project,q=T.prop('{b_id}'),pal=q.override.palette,v=RCApp.core.paletteVariantById(p,pal);
                return {{pal,base:v&&v.base,quick:v&&v.quick,img:!!(v&&v.image&&v.image.startsWith('data:image/png')),others:['{a_id}','{c_id}'].map(id=>RCApp.core.propAppearance(p,T.prop(id)).palette||null)}};}}""")
            check('D5 the Grimy palette chip makes a project palette and applies it to this object only', r['pal'] and r['base'] == 'pal_lowpoly_master_32' and r['quick'] == 'grimy' and r['img'] and r['others'] == [None, None], r)
            await pg.wait_for_timeout(600)
            r2 = await pg.evaluate(f"""()=>{{const E=RCApp.engine;E.syncProps(RCApp.project,'build');const tex=id=>{{const e=E.propEntries.get(id),u=e&&e.obj.userData.mats[0].uniforms.uTex.value;return u&&u.image?(u.image.src||u.image.currentSrc||'canvas').slice(0,22):null;}};
                return {{b:tex('{b_id}'),a:tex('{a_id}'),bWait:E.propEntries.get('{b_id}').waitTex}};}}""")
            check('D5b the 3D view really draws copy B with its new palette picture, copy A still with the model\'s own', r2['b'] and r2['b'].startswith('data:image/png') and r2['a'] != r2['b'] and not r2['bWait'], r2)
            # per-object colour change through a swatch
            await pg.wait_for_timeout(600)
            sw = await pg.evaluate("()=>[...document.querySelectorAll('#propSwatches input[data-swatch]')].map(i=>i.dataset.swatch)")
            if sw:
                await pg.evaluate("h=>{const i=document.querySelector(`#propSwatches input[data-swatch=\"${h}\"]`);i.value='#00ff66';i.dispatchEvent(new Event('change',{bubbles:true}));}", sw[0])
                await pg.wait_for_timeout(900)
            r = await pg.evaluate(f"""async()=>{{const p=RCApp.project,q=T.prop('{b_id}'),v=RCApp.core.paletteVariantById(p,q.override.palette);
                const im=await new Promise(res=>{{const i=new Image();i.onload=()=>res(i);i.src=v.image;}});const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);
                const d=g.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]===0&&d[i+1]===255&&d[i+2]===102)n++;
                return {{owner:v.owner,ownerOk:v.owner==='{b_id}',changedPixels:n,aPal:RCApp.core.propAppearance(p,T.prop('{a_id}')).palette||null,swatches:{len(sw)}}};}}""")
            check('D6 changing one colour swatch recolours just this object (its own palette copy); other copies unchanged',
                  len(sw) > 0 and r['ownerOk'] and r['changedPixels'] > 0 and r['aPal'] is None, r)
            # palette editor on a project palette via the Palettes library view
            await pg.click('[data-pa="lib-mode"][data-v="palettes"]'); await pg.wait_for_timeout(300)
            await pg.locator('[data-pa="pal-copy"][data-v="pal_lowpoly_master_32"]').first.click(); await pg.wait_for_timeout(900)
            modal_sw = await pg.locator('[data-palswatch]').count()
            if modal_sw:
                first = await pg.evaluate("()=>document.querySelector('[data-palswatch]').dataset.palswatch")
                await pg.evaluate("()=>{const i=document.querySelector('[data-palswatch]');i.value='#ff00ff';i.dispatchEvent(new Event('change',{bubbles:true}));}"); await pg.wait_for_timeout(700)
            r = await pg.evaluate("""async()=>{const ol=RCApp.project.objectLibrary,v=ol.palettes.find(x=>x.name.startsWith('Copy of'));if(!v)return null;
                const im=await new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.src=v.image;});const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);
                const d=g.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]===255&&d[i+1]===0&&d[i+2]===255)n++;return {id:v.id,base:v.base,magenta:n,w:im.width};}""")
            await pg.screenshot(path=f'{OUT}/D_palette_editor.png')
            await pg.evaluate("()=>document.querySelector('[data-action=\"close-modal\"]')?.click()")
            check('D7 "Make an editable copy" opens the palette editor; changing a colour edits the project copy (library file untouched)',
                  modal_sw >= 32 and r and r['magenta'] > 0 and r['base'] == 'pal_lowpoly_master_32', {'swatches': modal_sw, **(r or {})})
            lib_png_hash = hashlib.sha256(open(os.path.join(LIB_DIR, 'STANDARDIZED_LIBRARY/palettes/pal_lowpoly_master_32.png'), 'rb').read()).hexdigest() if os.path.exists(os.path.join(LIB_DIR, 'STANDARDIZED_LIBRARY/palettes/pal_lowpoly_master_32.png')) else None
            # texture override on a painted (uv_texture) model
            uv = await pg.evaluate("()=>{const e=RCAssets.state.models.find(m=>m.material_system==='uv_texture'&&!m.hidden);return e&&e.id;}")
            await pg.evaluate(f"async()=>{{await T.wait(['{uv}']);T.X().place('{uv}',{{x:56,y:34,story:0}});}}")
            uv_id = await pg.evaluate("()=>T.last().id")
            await pg.evaluate("()=>{for(const d of document.querySelectorAll('#inspector details'))d.open=true;}")
            await pg.click('[data-pa="tex-choose"]'); await pg.wait_for_timeout(300)
            await pg.fill('#libSearch', 'brick'); await pg.wait_for_timeout(300)
            tex_id = await pg.evaluate("()=>document.querySelector('[data-lib-texture]')?.dataset.libTexture")
            await pg.locator(f'[data-lib-texture="{tex_id}"]').first.click(); await pg.wait_for_timeout(1200)
            r = await pg.evaluate(f"()=>{{const q=T.prop('{uv_id}');const E=RCApp.engine;E.syncProps(RCApp.project,'build');const e=E.propEntries.get(q.id);return {{tex:q.override.texture,key:e&&e.key}};}}")
            check('D8 a painted model can take a library texture as its picture (stored as a reference, per object)', r['tex'] == {'library': tex_id}, {'uv_model': uv, **r})
            await pg.wait_for_timeout(600)
            r2 = await pg.evaluate(f"""()=>{{const E=RCApp.engine;E.syncProps(RCApp.project,'build');const e=E.propEntries.get('{uv_id}'),u=e.obj.userData.mats[0].uniforms.uTex.value;return {{w:u.image&&u.image.width,wait:e.waitTex}};}}""")
            check('D8b the 3D view draws the painted model with the chosen texture (256 px library picture)', r2['w'] == 256 and not r2['wait'], r2)
            # filter Pixel/Smooth on the object
            await pg.evaluate(f"()=>T.X().select('{uv_id}')"); await pg.wait_for_timeout(100)
            await pg.evaluate("()=>{for(const d of document.querySelectorAll('#inspector details'))d.open=true;}")
            await pg.click('[data-pa="filter"][data-v="smooth"]'); await pg.wait_for_timeout(150)
            f1 = await pg.evaluate(f"()=>T.prop('{uv_id}').override.filter")
            check('D9 Pixel / Smooth texture look is a per-object choice', f1 == 'smooth', f1)
            # surface textures from the library (walls/floors) with Pixel/Smooth
            await pg.evaluate("()=>{RCApp.selectRoom('room_office');}"); await pg.wait_for_timeout(200)
            await pg.click('[data-panel="style"]'); await pg.wait_for_timeout(200)
            await pg.locator('[data-action="lib-import-floor-texture"]').first.click(); await pg.wait_for_timeout(300)
            tgt = await pg.evaluate("()=>T.X().PZ.texTarget&&T.X().PZ.texTarget.label")
            await pg.fill('#libSearch', 'tile'); await pg.wait_for_timeout(300)
            ftex = await pg.evaluate("()=>document.querySelector('[data-lib-texture]')?.dataset.libTexture")
            await pg.locator(f'[data-lib-texture="{ftex}"]').first.click(); await pg.wait_for_timeout(1200)
            r = await pg.evaluate("()=>{const r=RCApp.project.rooms.find(r=>r.id==='room_office');const a=RCApp.assets.find(a=>a.library&&a.library.asset_id);return {tex:r.floorStyle?r.floorStyle.textureId:(r.floor&&r.floor.textureId),style:JSON.stringify(r).slice(0,0),lib:a&&a.library,filter:(r.floorStyle||r.floor||{}).filter};}")
            surf = await pg.evaluate("""()=>{const r=RCApp.project.rooms.find(r=>r.id==='room_office');const hits=[];const walk=(o,p)=>{if(!o||typeof o!=='object')return;for(const [k,v] of Object.entries(o)){if(k==='textureId'&&typeof v==='string'&&v)hits.push([p+'.'+k,v,o.filter]);else walk(v,p+'.'+k);}};walk(r,'room');return hits;}""")
            lib_assets = await pg.evaluate("()=>RCApp.assets.filter(a=>a.library).map(a=>({id:a.id,lib:a.library}))")
            check('D10 a library texture can be put on a floor from the Style panel button; it is copied into the project and set to Pixel',
                  tgt and any(lib_assets and h[1] in [a['id'] for a in lib_assets] and h[2] == 'pixel' for h in surf), {'target': tgt, 'surfaces': surf, 'libAssets': lib_assets})
            await pg.screenshot(path=f'{OUT}/D_floor_texture.png')
            # export / import looks between projects (UI export button -> file -> another project's Import button)
            await pg.click('[data-pane="library"]'); await pg.click('[data-pa="lib-mode"][data-v="looks"]'); await pg.wait_for_timeout(200)
            await pg.click('[data-pa="looks-export"]'); await pg.wait_for_timeout(200)
            async with pg.expect_download() as dl3:
                await pg.click('#expGo')
            d3 = await dl3.value; lpath = os.path.join(DL, 'exported.rclooks.json'); await d3.save_as(lpath)
            exp = json.load(open(lpath))
            check('D11 Export writes a looks file with the named looks, the palettes they need and object setups',
                  exp['format'] == 'trapstar-room-creator-looks' and any(l['id'] == look_id for l in exp['looks']) and len(exp['palettes']) >= 2 and 'some_future_asset' in exp['setups'],
                  {'looks': [l['name'] for l in exp['looks']], 'palettes': [p['name'] for p in exp['palettes']], 'setups': list(exp['setups'])})
            pg3 = await ctx.new_page(); pg3.on('pageerror', lambda e: errs.append('PAGEERROR(3) ' + str(e)))
            await pg3.add_init_script(_INIT); await pg3.goto(URL); await pg3.wait_for_timeout(500); await pg3.evaluate(HELPERS)
            await pg3.evaluate("async lib=>{await RCAssets.connectUrl(lib);}", LIB_URL)
            await pg3.click('[data-pane="library"]'); await pg3.wait_for_timeout(200); await pg3.click('[data-pa="lib-mode"][data-v="looks"]')
            await pg3.set_input_files('#looksFile', lpath); await pg3.wait_for_timeout(500)
            r3 = await pg3.evaluate("()=>{const ol=RCApp.project.objectLibrary||{};return {looks:(ol.looks||[]).map(l=>l.id),pals:(ol.palettes||[]).length,setups:Object.keys(ol.setups||{})};}")
            await pg3.set_input_files('#looksFile', lpath); await pg3.wait_for_timeout(500)
            r3b = await pg3.evaluate("()=>{const ol=RCApp.project.objectLibrary||{};return {looks:(ol.looks||[]).length,pals:(ol.palettes||[]).length};}")
            # clash: same id, different content -> added as a renamed copy, original untouched
            clash = json.loads(json.dumps(exp)); clash['looks'] = [dict(clash['looks'][0], tint='#000000')]; clash['palettes'] = []; clash['setups'] = {}
            r3c = await pg3.evaluate("d=>{const r=RCApp.ext().props.mergeLooks(d);const ol=RCApp.project.objectLibrary;return {r,looks:ol.looks.map(l=>[l.id,l.tint])};}", clash)
            check('D12 Import adds the looks/palettes/setups to another project; importing again adds nothing; a clashing ID is added as a new copy',
                  set(r3['looks']) == {l['id'] for l in exp['looks']} and r3['pals'] == len(exp['palettes']) and r3b['looks'] == len(exp['looks']) and r3b['pals'] == len(exp['palettes'])
                  and r3c['r']['renamed'] == 1 and len(r3c['looks']) == len(exp['looks']) + 1, {'first': r3, 'again': r3b, 'clash': r3c})
            await pg3.close()
            after_hash = hashlib.sha256(open(os.path.join(LIB_DIR, 'STANDARDIZED_LIBRARY/palettes/pal_lowpoly_master_32.png'), 'rb').read()).hexdigest() if lib_png_hash else None
            check('D13 the canonical library palette file is byte-identical after all palette edits', lib_png_hash and lib_png_hash == after_hash, [lib_png_hash, after_hash])

        except Exception as ex:
            check('D group stopped early (see screenshot D_crash.png)', False, str(ex)[:500]); await pg.screenshot(path=f'{OUT}/D_crash.png')
            for _p in ctx.pages[1:]:
                await _p.close()
            await pg.evaluate("()=>{document.querySelector('[data-action=\"close-modal\"]')?.click();}")
        # ------------------------------------------------------------ E. collision, walking, routes, sight lines
        try:
            r = await pg.evaluate(f"""()=>{{const X=T.X(),C=RCApp.core,RR=RCApp.rails;X.place('{DUMP}',{{x:20,y:37.85,story:0}});const q=T.last();
                const g=RR.storyGrid(RCApp.project,0,RR.navKey(RCApp.project));const cell=(x,y)=>g.cells[Math.floor((y-g.y0)/RR.CELL)*g.W+Math.floor((x-g.x0)/RR.CELL)];
                const conf=X.conflicts().filter(c=>c.prop===q.id);return {{id:q.id,solid:q.collision.solid,cell:cell(q.x,q.y),side:cell(q.x,q.y+1.6),at:X.propAt(0,q.x,q.y),conf:conf.map(c=>c.kind+':'+c.severity)}};}}""")
            dump_id = r['id']
            check('E1 a dumpster is solid by default: its footprint blocks first-person walking (nav grid) but the space beside it stays free', r['solid'] and r['cell'] == 0 and r['side'] == 1 and r['at'], r)
            check('E2 the route check reports a solid object standing on the player route', 'route:blocks' in r['conf'], r['conf'])
            await pg.click('[data-pane="rails"]'); await pg.wait_for_timeout(300)
            rails_txt = await pg.evaluate("()=>document.querySelector('#leftContent')?.innerText||document.body.innerText")
            check('E3 the Rails/Routes panel lists objects that block routes', '3d objects on routes' in rails_txt.lower() and 'stands on the player route' in rails_txt, rails_txt[-400:])
            await pg.evaluate(f"()=>{{T.X().select('{dump_id}');}}"); await pg.wait_for_timeout(100)
            await pg.evaluate("()=>{for(const d of document.querySelectorAll('#inspector details'))d.open=true;}")
            await pg.click('[data-pf="collision.solid"]'); await pg.wait_for_timeout(200)
            r = await pg.evaluate(f"""()=>{{const X=T.X(),RR=RCApp.rails,q=T.prop('{dump_id}');const g=RR.storyGrid(RCApp.project,0,RR.navKey(RCApp.project));
                return {{solid:q.collision.solid,cell:g.cells[Math.floor((q.y-g.y0)/RR.CELL)*g.W+Math.floor((q.x-g.x0)/RR.CELL)],conf:X.conflicts().filter(c=>c.prop===q.id).length}};}}""")
            check('E4 unticking "Solid" makes it walk-through: nav grid opens and the route warning clears', r['solid'] is False and r['cell'] == 1 and r['conf'] == 0, r)
            await pg.click('[data-pf="collision.solid"]'); await pg.wait_for_timeout(100)
            await pg.select_option('select[data-pf="collision.shape"]', 'cylinder'); await pg.wait_for_timeout(150)
            await pg.evaluate("()=>{for(const d of document.querySelectorAll('#inspector details'))d.open=true;}")
            await pg.fill('[data-pf="collision.size.0"]', '0.6'); await pg.press('[data-pf="collision.size.0"]', 'Enter'); await pg.wait_for_timeout(150)
            r = await pg.evaluate(f"()=>{{const q=T.prop('{dump_id}'),C=RCApp.core;const fp=C.propFootprint(q,null,null,0);return {{shape:q.collision.shape,size:q.collision.size,n:fp.poly.length,r:Math.max(...fp.poly.map(p=>Math.hypot(p.x-q.x,p.y-q.y)))}};}}")
            check('E5 collision can be a custom box or a round footprint with a chosen size', r['shape'] == 'cylinder' and r['n'] == 12 and abs(r['r'] - .3) < .01, r)
            # route sight lines: a solid car-sized object between two points blocks the line, a low one does not
            r = await pg.evaluate(f"""()=>{{const X=T.X(),E=RCApp.ext().route;X.place('{CAR}',{{x:10,y:42,story:0}});const car=T.last();E.buildSight();
                const hi=E.sightBlock({{x:10,y:38}},1.2,{{x:10,y:46}},1.2),over=E.sightBlock({{x:10,y:38}},2.2,{{x:10,y:46}},2.2),side=E.sightBlock({{x:13,y:38}},1.2,{{x:13,y:46}},1.2);
                RCApp.mutate(()=>{{T.prop(car.id).enabled=false;}},'off');E.buildSight();const off=E.sightBlock({{x:10,y:38}},1.2,{{x:10,y:46}},1.2);
                RCApp.mutate(()=>{{T.prop(car.id).enabled=true;}},'on');return {{id:car.id,hi,over,side,off}};}}""")
            check('E6 route sight lines are blocked by a solid car at eye height, clear above it, beside it, and when it is switched off',
                  r['hi'] and not r['over'] and not r['side'] and not r['off'], r)
            car_id = r['id']
            # first-person walking in the editor stops at the object
            r = await pg.evaluate(f"""()=>{{const C=RCApp.core,q=T.prop('{car_id}');const fp=C.propFootprint(q,null,null,0);return {{z1:+fp.z1.toFixed(2),blocks:C.propBlocksWalking(q,fp,0),at:T.X().propAt(0,q.x,q.y),beside:T.X().propAt(0,q.x+2,q.y)}};}}""")
            check('E7 a car blocks first-person walking at its footprint only', r['blocks'] and r['at'] and not r['beside'], r)

        except Exception as ex:
            check('E group stopped early (see screenshot E_crash.png)', False, str(ex)[:500]); await pg.screenshot(path=f'{OUT}/E_crash.png')
            for _p in ctx.pages[1:]:
                await _p.close()
            await pg.evaluate("()=>{document.querySelector('[data-action=\"close-modal\"]')?.click();}")
        # ------------------------------------------------------------ F. Use Points
        try:
            r = await pg.evaluate(f"""()=>{{const X=T.X(),C=RCApp.core;X.select('{car_id}');const q=T.prop('{car_id}');for(const t of ['driver','cover'])X.addPoint(T.prop('{car_id}'),t);
                const s=T.prop('{car_id}');const w=s.points.map(p=>C.propToPlan(s,p,null,0));return {{types:s.points.map(p=>p.type),w:w.map(p=>[+p.x.toFixed(2),+p.y.toFixed(2)]),rot:s.rotation}};}}""")
            before = r
            await pg.evaluate("()=>{for(const d of document.querySelectorAll('#inspector details'))d.open=true;}")
            await pg.click('[data-pa="prop-turn"][data-v="90"]'); await pg.wait_for_timeout(150)
            await pg.evaluate(f"()=>RCApp.mutate(()=>{{T.prop('{car_id}').x+=2;}},'move')")
            r = await pg.evaluate(f"""()=>{{const C=RCApp.core,s=T.prop('{car_id}');return s.points.map(p=>{{const w=C.propToPlan(s,p,null,0);return [+w.x.toFixed(2),+w.y.toFixed(2)];}});}}""")
            exp_pts = []
            for (x, y) in before['w']:
                # rotate 90° clockwise (plan heading) around the old centre (10,42), then move +2 in x
                dx, dy = x - 10, y - 42
                exp_pts.append([round(10 - dy + 2, 2), round(42 + dx, 2)])
            check('F1 use points move and turn with their object (turn 90° and move 2 m)', all(abs(a[0] - b_[0]) < .02 and abs(a[1] - b_[1]) < .02 for a, b_ in zip(r, exp_pts)), {'before': before['w'], 'after': r, 'expected': exp_pts})
            # edit a point's offset with the panel fields (Right / Forward / Facing)
            pid = await pg.evaluate(f"()=>T.prop('{car_id}').points[0].id")
            await pg.click(f'.pt-row[data-v="{pid}"]'); await pg.wait_for_timeout(150)
            await pg.fill('[data-pt="right"]', '-1.2'); await pg.press('[data-pt="right"]', 'Enter'); await pg.wait_for_timeout(120)
            await pg.fill('[data-pt="facing"]', '270'); await pg.press('[data-pt="facing"]', 'Enter'); await pg.wait_for_timeout(120)
            await pg.fill('[data-pt="type"]', 'driver-door'); await pg.press('[data-pt="type"]', 'Enter'); await pg.wait_for_timeout(120)
            r = await pg.evaluate(f"()=>{{const p=T.prop('{car_id}').points.find(p=>p.id==='{pid}');return {{x:p.x,yaw:p.yaw,type:p.type,head:RCApp.core.propPointHeading(T.prop('{car_id}'),p)}};}}")
            check('F2 a point is edited in plain terms (metres right of the front, facing); any new type name is accepted', abs(r['x'] - 1.2) < .001 and r['type'] == 'driver-door', r)
            # custom point type through the Custom… option (prompt modal)
            await pg.select_option('#ptNewType', '__custom'); await pg.click('[data-pa="pt-add"]'); await pg.wait_for_timeout(150)
            await pg.fill('#renameValue', 'stash spot'); await pg.click('#renameOk'); await pg.wait_for_timeout(150)
            types = await pg.evaluate(f"()=>T.prop('{car_id}').points.map(p=>p.type)")
            check('F3 "Custom…" adds a point of a brand-new type (not from a fixed list)', 'stash-spot' in types, types)
            # front flip (asset setup) keeps the car where it is and flips the point frame
            await pg.screenshot(path=f'{OUT}/F_use_points_map.png')
            w_before = await pg.evaluate(f"()=>{{const C=RCApp.core,s=T.prop('{car_id}');return s.points.map(p=>{{const w=C.propToPlan(s,p,null,0);return [+w.x.toFixed(2),+w.y.toFixed(2)];}});}}")
            await pg.evaluate("()=>{for(const d of document.querySelectorAll('#inspector details'))d.open=true;}")
            yaw0 = await pg.evaluate(f"()=>RCApp.core.propYaw(T.prop('{car_id}'),(RCApp.project.objectLibrary.setups||{{}})['{CAR}'])")
            await pg.click('[data-pa="setup-front"][data-v="180"]'); await pg.wait_for_timeout(200)
            r = await pg.evaluate(f"""()=>{{const C=RCApp.core,p=RCApp.project,s=T.prop('{car_id}'),set=p.objectLibrary.setups['{CAR}'];
                return {{front:set&&set.frontTurn,rot:s.rotation,w:s.points.map(pt=>{{const w=C.propToPlan(s,pt,set,0);return [+w.x.toFixed(2),+w.y.toFixed(2)];}}),yaw:C.propYaw(s,set)}};}}""")
            check('F4 "Which side is the front? → Other end" is saved once for the model; copies turn so nothing moves on screen; points stay put',
                  r['front'] == 180 and abs(math.atan2(math.sin(r['yaw'] - yaw0), math.cos(r['yaw'] - yaw0))) < 1e-6 and all(abs(a[0] - b_[0]) < .02 and abs(a[1] - b_[1]) < .02 for a, b_ in zip(r['w'], w_before)), {'after': r, 'before': w_before})
            # a model whose real front is its left side (+X): a new "use" point starts out on that side
            r = await pg.evaluate(f"""()=>{{const X=T.X();X.place('{CHAIR}',{{x:22,y:37,story:0}});const q=T.last();X.select(q.id);return q.id;}}""")
            side_id = r
            await pg.evaluate("()=>{for(const d of document.querySelectorAll('#inspector details'))d.open=true;}")
            await pg.click('[data-pa="setup-front"][data-v="90"]'); await pg.wait_for_timeout(150)
            r = await pg.evaluate(f"""()=>{{const X=T.X();X.addPoint(T.prop('{side_id}'),'use');const q=T.prop('{side_id}'),p=q.points[q.points.length-1];
                return {{turn:RCApp.project.objectLibrary.setups['{CHAIR}'].frontTurn,x:p.x,z:p.z,yaw:p.yaw,heading:RCApp.core.propPointHeading(q,p,RCApp.project.objectLibrary.setups['{CHAIR}']),rot:q.rotation}};}}""")
            check('F4b "Its left" works for models whose front is a side: new use points start out of that side and face back at it',
                  r['turn'] == 90 and r['x'] > .3 and abs(r['z']) < .05 and abs(((r['heading'] - (r['rot'] + 180)) % 360)) < 1e-6, r)
            await pg.click('[data-pa="setup-front"][data-v="0"]'); await pg.wait_for_timeout(150)
            await pg.evaluate(f"()=>T.X().select('{car_id}')"); await pg.wait_for_timeout(150)
            await pg.evaluate("()=>{for(const d of document.querySelectorAll('#inspector details'))d.open=true;}")
            # default points for new copies
            await pg.click('[data-pa="pt-save-defaults"]'); await pg.wait_for_timeout(150)
            r = await pg.evaluate(f"()=>{{T.X().place('{CAR}',{{x:20,y:45,story:0}});const q=T.last();return {{types:q.points.map(p=>p.type),ids:q.points.map(p=>p.id)}};}}")
            check('F5 "Make these the defaults" gives new copies the same use points (with fresh IDs)', len(r['types']) == 3 and 'stash-spot' in r['types'], r)

        except Exception as ex:
            check('F group stopped early (see screenshot F_crash.png)', False, str(ex)[:500]); await pg.screenshot(path=f'{OUT}/F_crash.png')
            for _p in ctx.pages[1:]:
                await _p.close()
            await pg.evaluate("()=>{document.querySelector('[data-action=\"close-modal\"]')?.click();}")
        # ------------------------------------------------------------ G. missing asset, offline, stories
        try:
            r = await pg.evaluate("""async()=>{RCApp.mutate(()=>{RCApp.project.props.push({id:'prop_missing',asset:'renamed_in_v2_chair',x:47,y:24,story:0,rotation:0,scale:[1,1,1],gameplay:{tags:['seat']},points:[]});},'missing');
                T.X().select('prop_missing');await T.sleep(300);const E=RCApp.engine;E.syncProps(RCApp.project,'build');const e=E.propEntries.get('prop_missing');
                return {status:RCAssets.template('renamed_in_v2_chair').status,warn:document.querySelector('#inspector')?.innerText.includes('is not in the connected library'),entry:!!e,asset:T.prop('prop_missing').asset};}""")
            check('G1 an object whose model is missing keeps its reference, shows a pink placeholder and a repair message', r['status'] == 'missing' and r['warn'] and r['entry'] and r['asset'] == 'renamed_in_v2_chair', r)
            # upstairs flat (story 1)
            r = await pg.evaluate(f"""()=>{{const X=T.X(),C=RCApp.core;RCApp.selectStory&&RCApp.selectStory(1);X.place('{CHAIR}',{{x:55,y:25,story:1}});const q=T.last();
                const fz=C.propFloorZ(RCApp.project,q);const hitAt1=!!X.hitProp(C.isoPoint(RCApp.project,q,fz));RCApp.selectStory&&RCApp.selectStory(0);
                const hitAt0=!!X.hitProp(C.isoPoint(RCApp.project,q,fz));return {{story:q.story,room:q.roomId,fz,elev:C.storyElevation(RCApp.project,1),hitAt1,hitAt0}};}}""")
            check('G2 objects placed upstairs sit on that story\'s floor and are only picked on that story', r['story'] == 1 and r['room'] == 'room_mvcv5kcr_o2gt4ij' and abs(r['fz'] - r['elev']) < .01 and r['hitAt1'] and not r['hitAt0'], r)
            await pg.evaluate("()=>{RCApp.selectView('view_mvcv5kd2_qk72wz9',{open:true});}"); await pg.wait_for_timeout(1200)
            await pg.screenshot(path=f'{OUT}/G_upstairs_fp.png')
            await pg.evaluate("()=>RCApp.setMode('iso')")

        except Exception as ex:
            check('G group stopped early (see screenshot G_crash.png)', False, str(ex)[:500]); await pg.screenshot(path=f'{OUT}/G_crash.png')
            for _p in ctx.pages[1:]:
                await _p.close()
            await pg.evaluate("()=>{document.querySelector('[data-action=\"close-modal\"]')?.click();}")
        # ------------------------------------------------------------ H. whole-project undo depth, existing systems still fine
        try:
            r = await pg.evaluate("""()=>{const p=RCApp.project;const C=RCApp.core;const v=C.validateBundle({project:p,assets:RCApp.assets});
                return {rooms:p.rooms.length,views:p.viewpoints.length,route:!!p.routeNet&&p.routeNet.edges.length,stairs:(p.stairs||[]).length,lights:(p.lights||[]).length,props:p.props.length,format:p.format,version:p.version};}""")
            check('H1 the project still validates with rooms, views, routes, stairs and lights intact', r['route'] == 8 and r['rooms'] == 18 and r['views'] >= 10 and r['props'] > 10, r)
            # route walk still runs with props present
            r = await pg.evaluate("""async()=>{const E=RCApp.ext().route;const ok=E.start();E.pause(true);E.input({fwd:true});const p0=E.pos();for(let i=0;i<60;i++)E.step(1/30);const s=E.pos();const boxes=(E.RW.propBoxes||[]).length;E.input({fwd:false});E.stop();return {ok,p0,pos:s,boxes};}""")
            check('H2 the route walk prototype still starts and runs, with solid 3D objects added to its sight boxes', r['ok'] and r['pos']['s'] != r['p0']['s'] and r['boxes'] >= 2, r)

        except Exception as ex:
            check('H group stopped early (see screenshot H_crash.png)', False, str(ex)[:500]); await pg.screenshot(path=f'{OUT}/H_crash.png')
            for _p in ctx.pages[1:]:
                await _p.close()
            await pg.evaluate("()=>{document.querySelector('[data-action=\"close-modal\"]')?.click();}")
        check('Z no page errors during the whole test', not [e for e in errs if 'PAGEERROR' in e], errs[:12])
        await pg.screenshot(path=f'{OUT}/Z_end_state.png')
        await b.close()

    ok = sum(1 for r in results if r['passed'])
    json.dump({'passed': ok, 'failed': len(results) - ok, 'results': results, 'console_errors': errs[:40]}, open(os.path.join(HERE, 'assets_browser_results.json'), 'w'), indent=1)
    print(f'{ok} passed, {len(results) - ok} failed')
    sys.exit(0 if ok == len(results) else 1)

asyncio.run(main())
