from rc_test_runtime import rc_path, rc_uri, rc_output, rc_prior
"""Final checks for v0.13: every example opens, save→open round trip, rail demo ride (incl. stairs),
2D fallback without WebGL, and speed versus v0.12 on the City Block. Prints a JSON summary."""
import asyncio, json, time, glob, os
from playwright.async_api import async_playwright
NEW=rc_uri('Room_Creator.html')
OLD=rc_prior('Room_Creator.html', uri=True)
CITY_OLD=rc_prior('City_Block_Dusk.room.json', uri=False)
EX=rc_path('examples')
OUT=rc_output('shots')
R={}
async def page(b, url, **kw):
    pg = await b.new_page(viewport={'width':1500,'height':900}, **kw)
    errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
    await pg.goto(url); await pg.wait_for_timeout(400); return pg, errs
TIMING = """async()=>{const A=RCApp,out={};const t0=performance.now();A.draw();out.first=performance.now()-t0;
  for(const z of [1,4,20]){A.zoom=z;const t=performance.now();for(let i=0;i<10;i++)A.draw();out['zoom'+z]=(performance.now()-t)/10;}
  // pan: 20 frames moving the view
  const g=A.geometry();const t=performance.now();for(let i=0;i<20;i++){A.zoom=3;A.draw();}out.pan=(performance.now()-t)/20;A.zoom=1;return out;}"""
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        # 1. every example opens in the new editor
        pg, errs = await page(b, NEW)
        ex={}
        for f in sorted(glob.glob(EX+'/*.room.json')):
            t=time.time()
            r = await pg.evaluate("async j=>{try{await RCApp.applyBundle(JSON.parse(j));RCApp.draw();const p=RCApp.project;return {ok:true,version:p.version,rooms:p.rooms.length,views:p.viewpoints.length,rails:p.rails.length,stairs:p.stairs.length,sky:p.sky.mode};}catch(e){return {ok:false,error:e.message};}}", open(f).read())
            r['s']=round(time.time()-t,1); ex[os.path.basename(f)]=r
        R['examples']=ex
        # the untouched v0.12 city file (format 10) opens and upgrades
        if CITY_OLD:
            r = await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));return RCApp.project.version;}", open(CITY_OLD).read()); R['v012_city_upgrades_to']=r
        # 2. save -> open round trip on the rail demo
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));}", open(EX+'/City_Block_Rail_Demo.room.json').read())
        r = await pg.evaluate("""async()=>{const a=RCApp.makeBundle(),s=JSON.stringify(a.project);await RCApp.applyBundle(JSON.parse(JSON.stringify(a)));const s2=JSON.stringify(RCApp.makeBundle().project);return {same:s===s2,size:s.length};}"""); R['roundtrip']=r
        # 3. ride the demo rail to the end in first person; check it climbs to the flat
        r = await pg.evaluate("""async()=>{const A=RCApp,X=A.ext().rails,p=A.project,rail=p.rails[0];X.playRail(rail.id,{ride:true});const pl=X.planFor(rail);
          const zs=[];for(const f of [.1,.5,.8,.97,1]){X.play.t=pl.duration*f;const v=X.railPose(rail);zs.push([+v.x.toFixed(1),+v.y.toFixed(1),v.story,+v.floorZ.toFixed(2)]);}X.pauseRail();X.play.t=pl.duration*.97;A.draw();return {duration:+pl.duration.toFixed(1),samples:zs,active:A.state.active};}""")
        R['demo_ride']=r
        await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/final_demo_ride_end.png')
        await pg.evaluate("()=>{const X=RCApp.ext().rails;X.play.t=X.planFor(RCApp.project.rails[0]).duration*.45;RCApp.draw();}"); await pg.wait_for_timeout(200); await pg.screenshot(path=f'{OUT}/final_demo_ride_mid.png')
        # 4. speed on the City Block (new)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));}", open(EX+'/City_Block_Dusk.room.json').read())
        await pg.evaluate("()=>RCApp.setMode('iso')")
        R['speed_new_map_ms'] = await pg.evaluate(TIMING)
        r = await pg.evaluate("""()=>{const A=RCApp,C=A.core;A.mutate(()=>{const p=A.project,v=C.createViewpoint(p,{x:18,y:46},{x:30,y:46},'t',null,0);},'v');A.selectView(A.project.viewpoints[0].id,{open:true});const t=performance.now();for(let i=0;i<10;i++)A.draw();const fp=(performance.now()-t)/10;
          const t2=performance.now();for(let i=0;i<5;i++)C.validateBundle({project:A.project,assets:A.assets});return {fp_draw:fp,validate:(performance.now()-t2)/5};}""")
        R['speed_new_other_ms']=r
        R['errors_new']=errs[:10]
        await pg.close()
        # 5. v0.12 for comparison
        if OLD:
            pg, errs = await page(b, OLD)
            await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));}", open(CITY_OLD).read())
            R['speed_v012_map_ms'] = await pg.evaluate(TIMING)
            await pg.close()
        await b.close()
        # 6. no WebGL at all -> 2D fallback still works
        b = await pw.chromium.launch(args=['--disable-gpu','--disable-software-rasterizer','--disable-webgl','--disable-webgl2'])
        pg, errs = await page(b, NEW)
        r = await pg.evaluate("async j=>{const gl=!!RCApp.engine;await RCApp.applyBundle(JSON.parse(j));RCApp.draw();const badge=document.getElementById('engineBadge').textContent;const C=RCApp.core;RCApp.mutate(()=>{const p=RCApp.project;C.createViewpoint(p,{x:18,y:46},{x:30,y:46},'t',null,0);},'v');RCApp.selectView(RCApp.project.viewpoints[0].id,{open:true});RCApp.draw();return {engine:gl,badge};}", open(EX+'/City_Block_Dusk.room.json').read())
        await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/final_fallback_fp.png')
        r['errors']=errs[:5]; R['fallback']=r
        await b.close()
    print(json.dumps(R, indent=1))
    json.dump(R, open(rc_output('final_results.json'),'w'), indent=1)
asyncio.run(main())
