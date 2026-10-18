from rc_test_runtime import rc_path, rc_uri, rc_output, rc_prior
"""Builds the two city block example files with the real editor (so they are valid format 11):
  examples/City_Block_Dusk.room.json       — the map with a sky + haze, NO viewpoints (Teddy places his own)
  examples/City_Block_Rail_Demo.room.json  — same map + viewpoints, a room upstairs with stairs, and a rail
Also writes preview PNGs to /home/claude/v13/scratch/shots/city_*.png"""
import asyncio, json, base64, sys
from playwright.async_api import async_playwright
SRC=rc_prior('City_Block_Dusk.room.json', uri=False)
EX=rc_output('generated-examples')
SKY="""{mode:'image',assetId:'asset_matte_skyline_water',top:'#2c2f63',horizon:'#c99ab8',bottom:'#1b1826',curve:.7,rotation:0,repeat:3,mirror:true,flipX:false,horizonV:%s,size:%s,lift:0,fadeTop:.35,fadeBottom:.04,brightness:1,saturation:1,tint:'#ffffff',tintStrength:0,haze:{enabled:true,color:null,start:30,end:220,strength:.38}}"""
async def main():
    hv = sys.argv[1] if len(sys.argv)>1 else '.78'
    sz = sys.argv[2] if len(sys.argv)>2 else '.9'
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); pg = await b.new_page(viewport={'width':1500,'height':900})
        logs=[]; pg.on('pageerror', lambda e: logs.append('PAGEERROR '+str(e))); pg.on('console', lambda m: logs.append(m.text) if m.type=='error' else None)
        await pg.goto(rc_uri('Room_Creator.html')); await pg.wait_for_timeout(300)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));}", open(SRC).read())
        ok = await pg.evaluate("s=>RCApp.mutate(()=>{RCApp.project.sky=RCApp.core.normalizeSky(eval('('+s+')'));},'City sky')", SKY % (hv, sz))
        print('sky set', ok)
        # previews of the sky from a few street spots (temporary views, not saved)
        shots = await pg.evaluate("""()=>{const A=RCApp,E=A.engine,p=A.project,C=A.core,out={};
          const spots={harlan:[18,46,90],pier:[84,45,90],dunmore:[67,33,0],tunnel:[-14,45,270]};
          for(const [k,[x,y,f]] of Object.entries(spots)){const v={x,y,story:0,floorZ:0,facing:f,fov:75,eyeHeight:1.6,horizon:.42,width:1440,height:900};const c=document.createElement('canvas');E.renderFPToCanvas(p,E.camFromView(p,v),960,600,c);out[k]=c.toDataURL('image/jpeg',.85);}return out;}""")
        for k,u in shots.items(): open(frc_output('shots/city_sky_{k}.jpg'),'wb').write(base64.b64decode(u.split(',')[1]))
        bundle = await pg.evaluate("()=>JSON.stringify(RCApp.makeBundle())")
        bj=json.loads(bundle); bj['project']['name']='City block · Harlan & Dunmore · dusk'
        open(f'{EX}/City_Block_Dusk.room.json','w').write(json.dumps(bj,separators=(',',':')))
        print('wrote City_Block_Dusk', len(bundle)//1024, 'KB; views', len(bj['project']['viewpoints']), 'version', bj['project']['version'])
        # ---------- rail demo
        r = await pg.evaluate("""()=>{const A=RCApp,C=A.core;let info={};
          const ok=A.mutate(()=>{const p=A.project;
            const mk=(n,x,y,f,fov=75)=>{const b=C.basis(f);const v=C.createViewpoint(p,{x,y},{x:x+b.fx,y:y+b.fy},n,null,0);v.facing=f;v.fov=fov;return v;};
            const vs=[mk('Harlan Av · looking east',18,46,90),mk('Bodega front',53,51.5,0),mk('Bodega · inside the door',47.6,34.6,40,85),mk('Back office',49.6,27.6,295,90),mk('Under the highway',-14,45,270),mk('Waterfront pier',84,45,90),mk('Back alley',4,-3,90),mk('Dunmore St · alley mouth',67,33,0)];
            p.startViewId=vs[0].id;info.views=vs.length;
            // a flat above the stockroom, reached by stairs
            const stock=p.rooms.find(r=>r.name==='Bodega · stockroom');info.stock=stock&&[stock.x,stock.y,stock.width,stock.length];
            const up=C.addRoomAbove(p,stock.id,{name:'Bodega · upstairs flat'});info.up=[up.x,up.y,up.width,up.length,up.story];
            const sh=p.storyHeight,steps=Math.max(3,Math.round(sh/.18)),L=steps*.28;
            const st=C.createStairs(p,{story:0,x:stock.x+.9,y:stock.y+.3,width:1.1,length:L,dir:'E',steps,name:'Stockroom stairs'});info.stairs=[st.x,st.y,st.width,st.length,st.dir,steps];
            const g=C.stairGeometry(p,st),f=C.heading(g.top,{x:g.top.x-1,y:g.top.y+1});
            const vUp=C.createViewpoint(p,{x:up.x+up.width-1.6,y:up.y+up.length-1.4},{x:up.x+1,y:up.y+1},'Upstairs flat',up.id,1);vUp.fov=80;
            const rail=A.rails.newRail('Bodega run');rail.speed=2.2;rail.hold=1.2;rail.nodes=[A.rails.stopNode(vs[0].id),A.rails.stopNode(vs[1].id),A.rails.stopNode(vs[2].id),A.rails.stopNode(vUp.id)];p.rails.push(rail);
            for(const [a,b] of [[0,1],[1,2],[2,3],[0,4],[1,7],[0,6]])try{C.addLink(p,vs[a].id,vs[b].id);}catch(e){}
          },'Rail demo');
          const p=A.project,pl=A.rails.railPlan(p,p.rails[0]);info.ok=ok;info.duration=pl.duration;info.length=pl.length;info.warn=pl.warnings.map(w=>w.reason);info.links=p.links.length;return info;}""")
        print('demo', json.dumps(r))
        if r.get('ok'):
            bundle = await pg.evaluate("()=>JSON.stringify(RCApp.makeBundle())")
            bj=json.loads(bundle); bj['project']['name']='City block · rail demo'
            open(f'{EX}/City_Block_Rail_Demo.room.json','w').write(json.dumps(bj,separators=(',',':')))
            print('wrote City_Block_Rail_Demo', len(bundle)//1024, 'KB')
        print('\n'.join(logs[:10]))
        await b.close()
asyncio.run(main())
