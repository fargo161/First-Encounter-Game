"""Room Creator 0.14 — checks on the furnished ASSET_DEMO map against the unchanged baseline map.

1. Cover: does the real 3D car still hide the player at the route-network cover spots N4 / N5 (behind the parked car)
   from people across the street, like the 6 placeholder boxes did? (route-walk sight lines, crouched 1.05 m, standing 1.62 m)
2. Route check on the demo (solid objects on player routes / NPC lanes / spots).
3. The route walk still runs on the demo (walk 20 s, no errors) and its sight boxes include the solid 3D objects.
4. Speed: time to draw first-person views and the map, baseline vs demo vs a stress copy with ~500 extra objects.
   (Headless test browser with software graphics — absolute numbers are pessimistic; compare them with each other.)
Needs the local web server on port 8770. Writes tests/assets_demo_checks_results.json."""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
import os as _os
RC_PAGE = _os.environ.get('RC_PAGE', '/pkg/Room_Creator.html')  # page path on the test web server
RC_LIB = _os.environ.get('RC_LIB', '/lib/')  # library folder on the test web server
RC_FIXTURES = _os.environ.get('RC_FIXTURES', '/pkg/tests/fixtures/')  # tests/fixtures on the test web server
_INIT = 'window.__RC_LIB=%r;window.__RC_FIX=%r;' % (RC_LIB, RC_FIXTURES)
BASE = os.environ.get('RC_BASE', 'http://127.0.0.1:8770'); URL = BASE + RC_PAGE
HERE = os.path.dirname(os.path.abspath(__file__)); EX = os.path.join(os.path.dirname(HERE), 'examples')
FILES = {'baseline': os.path.join(EX, 'Route_Prototype_Street.room.json'), 'demo': os.path.join(EX, 'Route_Prototype_Street_ASSET_DEMO.room.json')}

COVER = r"""()=>{const E=RCApp.ext().route,p=RCApp.project;E.buildSight();const nodes=p.routeNet.nodes.filter(n=>n.id==='N4'||n.id==='N5');
  const shooters=[];for(let x=18;x<=52;x+=1)for(const y of [51.9,52.8])shooters.push({x,y});const n6=p.routeNet.nodes.find(n=>n.id==='N6');if(n6)shooters.push({x:n6.x,y:n6.y});
  const out={};for(const nd of nodes)for(const [label,eye] of [['crouched',1.05],['standing',1.62]]){let hid=0;for(const s of shooters)if(E.sightBlock(s,1.6,nd,eye))hid++;out[nd.id+' '+label]=+(hid/shooters.length).toFixed(3);}
  return {shooters:shooters.length,hiddenShare:out};}"""
WALK = r"""async()=>{const E=RCApp.ext().route;const ok=E.start();E.pause(true);E.input({fwd:true});for(let i=0;i<600;i++)E.step(1/30);const pos=E.pos(),boxes=(E.RW.propBoxes||[]).length;
  E.input({fwd:false});E.stop();return {ok,pos,boxes};}"""
TIMING = r"""async(views)=>{const cv=document.getElementById('glStage'),gl=cv.getContext('webgl2')||cv.getContext('webgl');const fin=()=>{if(gl)gl.finish();};const res={};
  for(const v of views){RCApp.selectView(v,{open:true});for(let i=0;i<4;i++){RCApp.draw();fin();}const t=performance.now();for(let i=0;i<6;i++){RCApp.draw();fin();}res[v]=+((performance.now()-t)/6).toFixed(1);}
  RCApp.setMode('iso');RCApp.focusMap({x:40,y:30},1.6,0);for(let i=0;i<3;i++){RCApp.draw();fin();}let t=performance.now();for(let i=0;i<5;i++){RCApp.draw();fin();}res.map=+((performance.now()-t)/5).toFixed(1);
  return res;}"""
STRESS = r"""()=>{const p=RCApp.project,C=RCApp.core;const pool=p.props.filter(q=>q.story===0&&!RCAssets.entry(q.asset).category.startsWith('Vehicles'));let n=0;
  RCApp.mutate(()=>{for(let i=0;i<500;i++){const s=pool[i%pool.length],q=C.clone(s);q.id='prop_stress_'+i;q.x=-34+((i*1.37)%120);q.y=44+((i*0.91)%9);q.z=0;q.points=[];p.props.push(q);n++;}},'stress');
  return {props:p.props.length,triangles:p.props.reduce((a,q)=>a+(RCAssets.template(q.asset).triangles||0),0)};}"""
VIEWS = ['view_mvcv5kcl_h2iw3fo', 'view_demo_stockroom', 'view_mvcv5kd2_qk72wz9', 'view_route_start', 'view_mvcv5kcl_dwgwaii']

async def load(pg, path):
    await pg.add_init_script(_INIT); await pg.goto(URL); await pg.wait_for_timeout(400)
    await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));}", open(path).read())
    await pg.evaluate("async()=>{await RCAssets.connectUrl(window.__RC_LIB);const ids=[...new Set((RCApp.project.props||[]).map(q=>q.asset))];ids.forEach(id=>RCAssets.template(id));while(ids.some(id=>RCAssets.template(id).status==='loading'))await new Promise(r=>setTimeout(r,50));}")
    await pg.wait_for_timeout(1500)

async def main():
    out = {}
    async with async_playwright() as pw:
        b = await pw.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width': 1600, 'height': 950}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        for name, path in FILES.items():
            await load(pg, path)
            r = {'cover': await pg.evaluate(COVER), 'conflicts': await pg.evaluate("()=>RCApp.ext().props.conflicts().map(c=>c.text)"),
                 'walk': await pg.evaluate(WALK), 'props': await pg.evaluate("()=>(RCApp.project.props||[]).length"),
                 'triangles': await pg.evaluate("()=>(RCApp.project.props||[]).reduce((a,q)=>a+(RCAssets.template(q.asset).triangles||0),0)")}
            views = [v for v in VIEWS if await pg.evaluate("v=>RCApp.project.viewpoints.some(x=>x.id===v)", v)]
            r['drawMs'] = await pg.evaluate(TIMING, views)
            out[name] = r; print(name, json.dumps(r)[:900])
        await load(pg, FILES['demo'])
        s = await pg.evaluate(STRESS); await pg.wait_for_timeout(1500)
        s['drawMs'] = await pg.evaluate(TIMING, VIEWS); s['walk'] = await pg.evaluate(WALK)
        out['stress_demo_plus_500'] = s; print('stress', json.dumps(s))
        out['page_errors'] = errs; await b.close()
    b0, d0 = out['baseline']['cover']['hiddenShare'], out['demo']['cover']['hiddenShare']
    checks = {
        'cover spots N4/N5 stay hidden when crouched at least as often as with the placeholder boxes': all(d0[k] >= b0[k] - 0.02 for k in b0 if 'crouched' in k),
        'route walk runs on the demo with solid objects in its sight boxes': out['demo']['walk']['ok'] and out['demo']['walk']['boxes'] >= 20,
        'no solid object blocks a player route, NPC lane or spot in the demo (only the known narrowing note)': all('narrows' in c for c in out['demo']['conflicts']),
        'no page errors': not out['page_errors']}
    out['checks'] = checks
    for k, v in checks.items(): print(('PASS ' if v else 'FAIL ') + k)
    json.dump(out, open(os.path.join(HERE, 'assets_demo_checks_results.json'), 'w'), indent=1)
    sys.exit(0 if all(checks.values()) else 1)
asyncio.run(main())
