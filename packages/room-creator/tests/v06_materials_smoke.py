from pathlib import Path
from tempfile import TemporaryDirectory
from playwright.sync_api import sync_playwright
from PIL import Image
import os
ROOT=Path(__file__).resolve().parents[1]
with TemporaryDirectory() as td, sync_playwright() as pw:
    td=Path(td)
    tex=td/'floor.png'; Image.new('RGB',(64,64),(190,50,30)).save(tex)
    matte=td/'sky.png'; Image.new('RGB',(320,180),(20,240,60)).save(matte)
    browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=True)
    page=browser.new_page(viewport={'width':1600,'height':1000})
    page.set_content((ROOT/'Room_Creator.html').read_text(),wait_until='load')
    page.wait_for_function('window.RCApp!==undefined')
    page.locator('[data-panel="style"]').click()
    with page.expect_file_chooser() as fc:
        page.locator('[data-action="import-floor-texture"]').click()
    fc.value.set_files(str(tex)); page.wait_for_timeout(150)
    ok=page.evaluate('()=>{let r=RCApp.project.rooms[0];return !!r.floor.textureId&&r.floor.finish==="image"&&RCApp.assets.length===1}')
    print('PASS direct floor import' if ok else 'FAIL direct floor import')
    if not ok: raise SystemExit(1)
    page.locator('[data-change="floorSurface"][data-key="tileSize"]').fill('0.75'); page.locator('[data-change="floorSurface"][data-key="tileSize"]').dispatch_event('change')
    page.locator('[data-change="floorSurface"][data-key="angle"]').fill('30'); page.locator('[data-change="floorSurface"][data-key="angle"]').dispatch_event('change')
    ok=page.evaluate('()=>{let s=RCApp.project.rooms[0].floor;return Math.abs(s.tileSize-.75)<1e-6&&s.angle===30}')
    print('PASS floor mapping controls' if ok else 'FAIL floor mapping controls')
    if not ok: raise SystemExit(1)
    with page.expect_file_chooser() as fc:
        page.locator('[data-action="import-matte"]').click()
    fc.value.set_files(str(matte)); page.wait_for_timeout(150)
    ok=page.evaluate('()=>!!RCApp.project.rooms[0].exterior.default.assetId&&RCApp.assets.length===2')
    print('PASS direct matte import' if ok else 'FAIL direct matte import')
    if not ok: raise SystemExit(1)
    # architecture/window and view north
    page.evaluate('()=>{let p=RCApp.project,r=p.rooms[0];RCCore.createOpening(p,r.id,"N",3,"window",{width:2,height:1.4,bottom:.8});let v=RCCore.createViewpoint(p,{x:4,y:4},{x:4,y:0},"Matte test");RCApp.refresh();}')
    green=page.evaluate('()=>{let p=RCApp.project,v=p.viewpoints[0],r=RCApp.renderer.drawFP(p,v,{width:480}),n=0;for(let i=0;i<r.pixels.length;i++){let x=r.pixels[i],R=x&255,G=(x>>>8)&255,B=(x>>>16)&255;if(G>180&&R<80&&B<100)n++;}return n;}')
    print('PASS matte rendered through exterior opening' if green>30 else f'FAIL matte render {green}')
    if green<=30: raise SystemExit(1)
    browser.close()
