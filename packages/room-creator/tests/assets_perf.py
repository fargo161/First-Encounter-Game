"""Room Creator 0.14 — editor responsiveness with the furnished map (handoff §28).
Times: open the project, save it (build the file), one object edit (mutate + validate), duplicate, undo, redo,
palette change, story switch, select an object — on the demo (69 objects) and on a stress copy (+500 objects).
Headless browser with software graphics: compare the numbers with each other. Needs the web server on port 8770.
Writes tests/assets_perf_results.json."""
import asyncio, json, os
from playwright.async_api import async_playwright
import os as _os
RC_PAGE = _os.environ.get('RC_PAGE', '/pkg/Room_Creator.html')  # page path on the test web server
RC_LIB = _os.environ.get('RC_LIB', '/lib/')  # library folder on the test web server
RC_FIXTURES = _os.environ.get('RC_FIXTURES', '/pkg/tests/fixtures/')  # tests/fixtures on the test web server
_INIT = 'window.__RC_LIB=%r;window.__RC_FIX=%r;' % (RC_LIB, RC_FIXTURES)
URL = os.environ.get('RC_BASE', 'http://127.0.0.1:8770') + RC_PAGE
HERE = os.path.dirname(os.path.abspath(__file__)); DEMO = os.path.join(os.path.dirname(HERE), 'examples', 'Route_Prototype_Street_ASSET_DEMO.room.json')
JS = r"""async()=>{const T={},now=()=>performance.now(),X=RCApp.ext().props,p=()=>RCApp.project;let t;
  t=now();const b=RCApp.makeBundle();const txt=JSON.stringify(RCApp.core.validateBundle(b));T.saveMs=+(now()-t).toFixed(0);T.fileMB=+(txt.length/1e6).toFixed(1);
  t=now();await RCApp.applyBundle(JSON.parse(txt));T.openMs=+(now()-t).toFixed(0);
  const id=p().props.find(q=>q.id==='prop_flat_chair_e')?.id||p().props[0].id;
  t=now();X.select(id);T.selectMs=+(now()-t).toFixed(1);
  t=now();RCApp.mutate(()=>{p().props.find(q=>q.id===id).x+=0.1;},'perf move');T.editMs=+(now()-t).toFixed(1);
  t=now();X.duplicate();T.duplicateMs=+(now()-t).toFixed(1);
  t=now();RCApp.undo();T.undoMs=+(now()-t).toFixed(1);t=now();RCApp.redo();T.redoMs=+(now()-t).toFixed(1);
  X.select(id);const fam=RCAssets.entry(p().props.find(q=>q.id===id).asset).paletteFamily;t=now();const pid=await X.quickPalette(fam,'night','Night');RCApp.mutate(()=>{p().props.find(q=>q.id===id).override.palette=pid;},'perf palette');T.paletteMs=+(now()-t).toFixed(1);
  t=now();RCApp.selectStory(1);RCApp.draw();RCApp.selectStory(0);RCApp.draw();T.storySwitchTwiceMs=+(now()-t).toFixed(1);
  T.props=p().props.length;return T;}"""
STRESS = r"""()=>{const p=RCApp.project,C=RCApp.core,pool=p.props.filter(q=>q.story===0&&!RCAssets.entry(q.asset).category.startsWith('Vehicles'));
  RCApp.mutate(()=>{for(let i=0;i<500;i++){const q=C.clone(pool[i%pool.length]);q.id='prop_stress_'+i;q.x=-34+((i*1.37)%120);q.y=44+((i*0.91)%9);q.z=0;q.points=[];p.props.push(q);}},'stress');return p.props.length;}"""
async def main():
    out = {}
    async with async_playwright() as pw:
        b = await pw.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width': 1600, 'height': 950}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script(_INIT); await pg.goto(URL); await pg.wait_for_timeout(400)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));RCApp.setMode('iso');}", open(DEMO).read())
        await pg.evaluate("async()=>{await RCAssets.connectUrl(window.__RC_LIB);const ids=[...new Set(RCApp.project.props.map(q=>q.asset))];ids.forEach(id=>RCAssets.template(id));while(ids.some(id=>RCAssets.template(id).status==='loading'))await new Promise(r=>setTimeout(r,50));}")
        out['demo'] = await pg.evaluate(JS); print('demo', out['demo'])
        await pg.evaluate(STRESS); out['stress'] = await pg.evaluate(JS); print('stress', out['stress'])
        out['page_errors'] = errs; await b.close()
    json.dump(out, open(os.path.join(HERE, 'assets_perf_results.json'), 'w'), indent=1)
asyncio.run(main())
