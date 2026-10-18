"""Room Creator 0.14 — load every model in the asset library in the real editor and report what fails or looks wrong.

For each of the 327 models: does it load, how long, how many parts/triangles, does its real size match the manifest,
is its pivot on the ground in the middle, does its colour image match its palette. Also renders a contact sheet of
every thumbnail (drawn from the models themselves) for a visual check.
Needs the local web server on port 8770 serving /home/claude (same as assets_browser.py).
Writes tests/assets_all_models_results.json and tests/assets_evidence/all_models_contact_sheet.png."""
import asyncio, json, os, sys, base64
from playwright.async_api import async_playwright
import os as _os
RC_PAGE = _os.environ.get('RC_PAGE', '/pkg/Room_Creator.html')  # page path on the test web server
RC_LIB = _os.environ.get('RC_LIB', '/lib/')  # library folder on the test web server
RC_FIXTURES = _os.environ.get('RC_FIXTURES', '/pkg/tests/fixtures/')  # tests/fixtures on the test web server
_INIT = 'window.__RC_LIB=%r;window.__RC_FIX=%r;' % (RC_LIB, RC_FIXTURES)
BASE = os.environ.get('RC_BASE', 'http://127.0.0.1:8770')
URL = BASE + RC_PAGE
LIB_URL = RC_LIB
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'assets_evidence'); os.makedirs(OUT, exist_ok=True)

JS_LOAD_ALL = r"""async()=>{
  const S=RCAssets.state,out=[];
  for(const e of S.models){
    const t0=performance.now();let t=RCAssets.template(e.id);
    while(t.status==='loading'){await new Promise(r=>setTimeout(r,15));if(performance.now()-t0>30000)break;t=RCAssets.template(e.id);}
    const ms=performance.now()-t0;const b=t.bounds;const d=e.dims;
    const size=b?[b.max[0]-b.min[0],b.max[1]-b.min[1],b.max[2]-b.min[2]]:null;
    out.push({id:e.id,name:e.name,category:e.category,sub:e.sub,material:e.material_system,hidden:!!e.hidden,unverified:!!e.unverifiedLicense,
      status:t.status,error:t.error||null,warning:t.warning||null,paletteMismatch:t.paletteMismatch||null,ms:Math.round(ms),
      parts:t.parts?t.parts.length:null,triangles:t.triangles??null,bounds:b||null,size,manifest:d||null,manifestTriangles:e.triangle_count??null});
  }
  return out;}"""

JS_SHEET = r"""async(list)=>{
  // wait for every thumbnail, then draw a labelled grid
  const ids=list.map(r=>r.id);ids.forEach(id=>RCAssets.thumb(id));const t0=performance.now();
  while(ids.some(id=>!RCAssets.state.thumbs.get(id))&&performance.now()-t0<240000)await new Promise(r=>setTimeout(r,250));
  const cols=16,cw=132,ch=150,rows=Math.ceil(ids.length/cols),c=document.createElement('canvas');c.width=cols*cw;c.height=rows*ch+40;const g=c.getContext('2d');
  g.fillStyle='#14181d';g.fillRect(0,0,c.width,c.height);g.fillStyle='#e8eef2';g.font='bold 18px sans-serif';g.fillText('Trapstar asset library v1 — all '+ids.length+' models, thumbnails rendered from the GLB files by Room Creator 0.14',10,26);
  let missing=0;
  for(let i=0;i<ids.length;i++){const r=list[i],x=(i%cols)*cw,y=40+Math.floor(i/cols)*ch,u=RCAssets.state.thumbs.get(r.id);
    g.fillStyle=r.status!=='ready'?'#5a1f2c':r.hidden?'#2a2f36':'#1d232a';g.fillRect(x+2,y+2,cw-4,ch-4);
    if(u){const im=await new Promise(res=>{const m=new Image();m.onload=()=>res(m);m.onerror=()=>res(null);m.src=u;});if(im)g.drawImage(im,x+6,y+4,cw-12,cw-12);}else missing++;
    g.fillStyle=r.unverified?'#ffcf6e':'#cfd8dc';g.font='10px sans-serif';const nm=(r.unverified?'⚠ ':'')+r.name;g.fillText(nm.length>22?nm.slice(0,21)+'…':nm,x+6,y+ch-10);}
  return {png:c.toDataURL('image/png'),missing};}"""

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width': 1400, 'height': 900})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script(_INIT); await pg.goto(URL); await pg.wait_for_timeout(500)
        r = await pg.evaluate("async lib=>{const r=await RCAssets.connectUrl(lib);return r;}", LIB_URL)
        print('connect:', r['message'])
        rows = await pg.evaluate(JS_LOAD_ALL)
        issues = []
        for x in rows:
            prob = []
            if x['status'] != 'ready': prob.append(f"did not load ({x['status']}: {x['error']})")
            if x['warning']: prob.append('warning: ' + x['warning'])
            if x['paletteMismatch']: prob.append('colour image differs from its palette')
            if x['size'] and x['manifest']:
                d = x['manifest']; s = x['size']
                bad = [k for k in range(3) if abs(s[k] - d[k]) > max(.02, .03 * max(d[k], .01))]
                if bad: prob.append('real size %s differs from manifest %s' % ([round(v, 3) for v in s], [round(v, 3) for v in d]))
            if x['bounds']:
                bb = x['bounds']; cx = (bb['min'][0] + bb['max'][0]) / 2; cz = (bb['min'][2] + bb['max'][2]) / 2; s = x['size']
                if abs(bb['min'][1]) > max(.02, .05 * s[1]): prob.append('bottom is %.3f m from the ground (pivot not on the floor)' % bb['min'][1])
                if abs(cx) > max(.03, .1 * s[0]) or abs(cz) > max(.03, .1 * s[2]): prob.append('pivot is off-centre by (%.2f, %.2f) m' % (cx, cz))
            if x['triangles'] and x['manifestTriangles'] and abs(x['triangles'] - x['manifestTriangles']) > max(2, .02 * x['manifestTriangles']):
                prob.append('triangle count %d differs from manifest %d' % (x['triangles'], x['manifestTriangles']))
            x['problems'] = prob
            if prob: issues.append({'id': x['id'], 'name': x['name'], 'category': x['category'] + ' / ' + x['sub'], 'hidden': x['hidden'], 'problems': prob})
        ready = sum(1 for x in rows if x['status'] == 'ready')
        times = sorted(x['ms'] for x in rows)
        summary = {'models': len(rows), 'loaded': ready, 'failed': len(rows) - ready, 'with_problems': len(issues),
                   'load_ms_median': times[len(times) // 2], 'load_ms_max': times[-1], 'triangles_total': sum(x['triangles'] or 0 for x in rows),
                   'unverified_licence': sum(1 for x in rows if x['unverified'])}
        print(json.dumps(summary))
        for i in issues: print(' -', i['name'], '|', i['category'], '|', '; '.join(i['problems']))
        sheet = await pg.evaluate(JS_SHEET, rows)
        open(os.path.join(OUT, 'all_models_contact_sheet.png'), 'wb').write(base64.b64decode(sheet['png'].split(',')[1]))
        summary['thumbnails_missing'] = sheet['missing']
        json.dump({'summary': summary, 'issues': issues, 'models': rows, 'page_errors': errs}, open(os.path.join(HERE, 'assets_all_models_results.json'), 'w'), indent=1)
        await b.close()
        sys.exit(0 if ready == len(rows) and not errs else 1)
asyncio.run(main())
