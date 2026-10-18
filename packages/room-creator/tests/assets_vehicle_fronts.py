"""Room Creator 0.14 — side views of every vehicle, to check by eye which end is the front.
The library says vehicles lie along the Z axis but does not say which end is the front. Each car is drawn from its
right-hand (-X) side with +Z pointing RIGHT, plus a three-quarter view from the +Z end. Writes
tests/assets_evidence/vehicle_fronts.png. Needs the local web server on port 8770 (same as the other asset tests)."""
import asyncio, base64, os
from playwright.async_api import async_playwright
import os as _os
RC_PAGE = _os.environ.get('RC_PAGE', '/pkg/Room_Creator.html')  # page path on the test web server
RC_LIB = _os.environ.get('RC_LIB', '/lib/')  # library folder on the test web server
RC_FIXTURES = _os.environ.get('RC_FIXTURES', '/pkg/tests/fixtures/')  # tests/fixtures on the test web server
_INIT = 'window.__RC_LIB=%r;window.__RC_FIX=%r;' % (RC_LIB, RC_FIXTURES)
URL = os.environ.get('RC_BASE', 'http://127.0.0.1:8770') + RC_PAGE
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets_evidence')
JS = r"""async()=>{await RCAssets.connectUrl(window.__RC_LIB);const T=THREE;
  const cars=RCAssets.state.models.filter(e=>e.category==='Vehicles');cars.forEach(e=>RCAssets.template(e.id));
  while(cars.some(e=>RCAssets.template(e.id).status==='loading'))await new Promise(r=>setTimeout(r,50));
  const W=300,H=150,cols=2,c=document.createElement('canvas');c.width=W*cols+260;c.height=H*cars.length;const g=c.getContext('2d');g.fillStyle='#1b2026';g.fillRect(0,0,c.width,c.height);
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const r=new T.WebGLRenderer({canvas:cv,antialias:true,preserveDrawingBuffer:true});T.ColorManagement.enabled=false;r.outputColorSpace=T.LinearSRGBColorSpace;
  for(let i=0;i<cars.length;i++){const e=cars[i],t=RCAssets.template(e.id),b=t.bounds,L=b.max[2]-b.min[2],Hh=b.max[1]-b.min[1];
    for(let k=0;k<2;k++){const sc=new T.Scene();sc.background=new T.Color(0x2a3038);sc.add(new T.AmbientLight(0xffffff,1.2));const dl=new T.DirectionalLight(0xffffff,1.1);dl.position.set(3,5,2);sc.add(dl);
      const o=t.scene.clone(true);o.traverse(m=>{if(m.isMesh)m.material=new T.MeshLambertMaterial({map:t.baseTexture,side:T.DoubleSide});});sc.add(o);
      const R=Math.max(L,Hh)*0.62,cam=k===0?new T.OrthographicCamera(-R*2*W/H/2*1.0,R*2*W/H/2*1.0,R,-R,0.1,100):new T.PerspectiveCamera(35,W/H,0.1,200);
      if(k===0){cam.position.set(-30,Hh/2,(b.min[2]+b.max[2])/2);cam.lookAt(0,Hh/2,(b.min[2]+b.max[2])/2);cam.up.set(0,1,0);}else{cam.position.set(L*0.55,Hh*1.3,b.max[2]+L*0.9);cam.lookAt(0,Hh*0.4,0);}
      r.render(sc,cam);g.drawImage(cv,k*W,i*H);}
    g.fillStyle='#ffd27a';g.font='bold 13px sans-serif';g.fillText(e.name,W*2+10,i*H+22);g.fillStyle='#cfd8dc';g.font='11px sans-serif';
    g.fillText('left: side view, +Z end is on the RIGHT',W*2+10,i*H+42);g.fillText('right: looking at the +Z end',W*2+10,i*H+58);g.fillText(e.id,W*2+10,i*H+78);
    g.strokeStyle='#ffd27a';g.lineWidth=2;g.beginPath();g.moveTo(W-60,i*H+H-14);g.lineTo(W-14,i*H+H-14);g.lineTo(W-22,i*H+H-20);g.moveTo(W-14,i*H+H-14);g.lineTo(W-22,i*H+H-8);g.stroke();g.fillStyle='#ffd27a';g.fillText('+Z',W-84,i*H+H-10);}
  return c.toDataURL('image/png');}"""
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        pg = await b.new_page(); await pg.add_init_script(_INIT); await pg.goto(URL); await pg.wait_for_timeout(400)
        png = await pg.evaluate(JS); open(os.path.join(OUT, 'vehicle_fronts.png'), 'wb').write(base64.b64decode(png.split(',')[1])); await b.close()
asyncio.run(main())
