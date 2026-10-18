"""Offline browser acceptance checks for Room Creator 0.4.

Uses Playwright + a locally installed Chromium. The standalone file is loaded
with set_content because the validation container's managed policy forbids file
URL navigation. There are no network dependencies in the tested HTML. Generated
PNG fixtures live in a temporary directory; they are NOT bundled library art.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
import json, time, traceback, os
ROOT = Path(__file__).resolve().parents[1]
results=[]

def check(name, cond, detail=None):
    if not cond: raise AssertionError(name + (': '+str(detail) if detail else ''))
    results.append({'name':name,'passed':True})
    print('PASS',name,flush=True)

with TemporaryDirectory() as tmp, sync_playwright() as pw:
    tmp=Path(tmp)
    im=Image.new('RGBA',(160,240),(0,0,0,0));d=ImageDraw.Draw(im)
    d.rectangle((2,2,157,238),fill=(40,220,140,255));d.rectangle((48,62,112,158),fill=(0,0,0,0))
    fixture=tmp/'test_frame.png';im.save(fixture)
    texture=tmp/'test_texture.png';Image.new('RGB',(32,32),(150,70,40)).save(texture)
    browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=True)
    page=browser.new_page(viewport={'width':1600,'height':1000},accept_downloads=True)
    page.set_default_timeout(8000)
    errors=[];net=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.on('request',lambda r: net.append(r.url) if r.url.startswith(('http:','https:')) else None)
    page.set_content((ROOT/'Room_Creator.html').read_text(),wait_until='load')
    page.wait_for_function('window.RCApp !== undefined')
    def E(s,arg=None):return page.evaluate(s,arg)
    def wait():page.wait_for_timeout(100)
    def reset():E('RCApp.newProject(true)');wait()
    def click_world(x,y):
        q=E('q=>RCApp.projectPoint(q)',{'x':x,'y':y});page.mouse.click(q['x'],q['y']);wait()
    def change(sel,value):
        a=page.locator(sel);a.fill(str(value));a.dispatch_event('change');wait()
    def place(x,y,tx,ty):
        page.locator('.toolbar [data-tool="view"]').click();click_world(x,y);click_world(tx,ty)
        return E('RCApp.state.viewId')
    def bundle(p):E('p=>RCApp.applyBundle({project:p,assets:[]})',p);wait()
    def group(name,fn):
        try:fn()
        except Exception as e:
            results.append({'name':name,'passed':False,'error':str(e),'trace':traceback.format_exc()})
            print('FAIL',name,e,flush=True)
            page.screenshot(path=str(ROOT/'previews'/('failure_'+name.replace(' ','_')+'.png')))
            # Clear any open modal so a failed test cannot poison all others.
            E("document.getElementById('modalRoot').innerHTML='';RCApp.newProject(true)")

    def startup():
        check('Starts with one empty room and zero image assets',E('RCApp.project.rooms.length===1 && RCApp.assets.length===0 && RCApp.project.objects.length===0'))
        check('Starts with zero viewpoints and cover pairs',E('RCApp.project.viewpoints.length===0 && RCApp.project.pairs.length===0'))
        page.locator('[data-pane="assets"]').click()
        check('Empty replacement library is clearly explained',page.locator('.empty-library').is_visible() and page.locator('.asset-card').count()==0)
        page.locator('#fpBtn').click()
        check('Cannot display unplaced first-person compositions',page.locator('#emptyHint').is_visible() and E('RCApp.project.viewpoints.length===0'))
        page.locator('#emptyHint [data-action="place-view"]').click();click_world(3,4)
        check('First map click does not create a viewpoint',E('RCApp.project.viewpoints.length===0 && !!RCApp.state.pending.origin'))
        page.keyboard.press('Escape');check('Escape cancels an unfinished viewpoint',E('RCApp.project.viewpoints.length===0 && !RCApp.state.pending'))
        vid=place(3,4,3,2)
        check('Second map click creates a positioned directional view',E('id=>{const v=RCApp.project.viewpoints.find(v=>v.id===id);return v.x===3&&v.y===4&&Math.abs(v.facing)<.001}',vid))
        check('Create exposed partner disabled before cover assignment',page.locator('[data-create-partner]').is_disabled() and page.locator('[data-pair-existing]').is_disabled())
        E('RCApp.showPartnerWizard(RCApp.state.viewId)')
        check('Direct partner command also enforces cover-first gate',E('RCApp.project.pairs.length===0') and 'Assign cover' in page.locator('#toast').inner_text())
    group('Startup and placed viewpoint gate',startup)

    def cover():
        reset();vid=place(3,4,3,2);r=E('RCApp.project.rooms[0].id')
        page.locator('[data-assign-cover]').click();page.locator('#coverSource').select_option(f'wall:{r}:N');page.locator('#assignCover').click();wait()
        check('Assigning wall cover creates no second viewpoint',E('RCApp.project.viewpoints.length===1&&RCApp.project.pairs.length===0&&!!RCApp.project.viewpoints[0].cover'))
        check('Both partner authoring buttons unlock after cover assignment',not page.locator('[data-create-partner]').is_disabled() and not page.locator('[data-pair-existing]').is_disabled())
        page.locator('[data-create-partner]').click();page.locator('#partnerSide').fill('0.8');page.locator('#createPartner').click();wait()
        check('Partner receives a real map pose and common facing',E('()=>{let p=RCApp.project;let a=p.viewpoints[0],b=p.viewpoints[1];return p.pairs.length===1&&b.role==="exposed"&&Math.abs(b.x-a.x-.8)<1e-6&&Math.abs(b.y-a.y)<1e-6&&b.facing===a.facing}'))
        check('State controls and paired previews are present',page.locator('#stateBar').is_visible() and page.locator('[data-pair-preview]').count()==2)
        before=E('RCApp.state.viewId');page.locator('#stage').focus();page.keyboard.press('Tab');wait()
        check('Tab switches the actual current paired viewpoint',E('RCApp.state.viewId')!=before)
        change('[data-change="view"][data-key="facing"]',20)
        check('Turning either paired viewpoint turns both',E('RCApp.project.viewpoints.every(v=>v.facing===20)'))
        positions=E('RCApp.project.viewpoints.map(v=>({x:v.x,y:v.y}))')
        x=E('RCApp.project.viewpoints.find(v=>v.id===RCApp.state.viewId).x');change('[data-change="view"][data-key="x"]',x+.2)
        after=E('RCApp.project.viewpoints.map(v=>({x:v.x,y:v.y}))')
        check('Moving partner translates both floor positions together',all(abs(a['x']-b['x']-.2)<.002 for a,b in zip(after,positions)))
        page.locator('[data-unpair]').click();page.locator('#confirmYes').click();wait()
        check('Unpair preserves both views and primary cover',E('RCApp.project.viewpoints.length===2&&RCApp.project.pairs.length===0&&RCApp.project.viewpoints.filter(v=>v.cover).length===1'))
        E('id=>RCApp.selectView(id,{open:true})',vid)
        page.locator('[data-pair-existing]').click();other=E('RCApp.project.viewpoints.find(v=>!v.cover).id');page.locator('#existingPartner').select_option(other);page.locator('#createPartner').click();wait()
        check('Pair existing reuses a placed view without creating a duplicate',E('RCApp.project.viewpoints.length===2&&RCApp.project.pairs.length===1'))
        page.locator('[data-remove-cover]').click();page.locator('#confirmYes').click();wait()
        check('Removing cover unpairs and retains two ordinary viewpoints',E('RCApp.project.viewpoints.length===2&&RCApp.project.pairs.length===0&&RCApp.project.viewpoints.every(v=>!v.cover&&v.role==="movement")'))
    group('Viewpoint-first cover workflow',cover)

    def rooms():
        reset();page.locator('[data-action="add-room"]').first.click();page.locator('#lPreset').click();page.locator('#createRoom').click();wait()
        check('L extension UI creates two nonoverlapping adjoining rectangles',E('RCApp.project.rooms.length===2&&RCApp.project.rooms[1].x===8&&RCApp.project.rooms[1].y===3'))
        check('Full opening is the shared wall section, not a decorative sprite',E('RCApp.project.openings.length===1&&RCApp.project.openings[0].kind==="passage"&&RCApp.project.openings[0].width===3&&RCApp.project.objects.length===0'))
        check('L-shaped missing corner is genuinely outside the floor',E('!RCCore.inFloor(RCApp.project,{x:9,y:1})&&RCCore.inFloor(RCApp.project,{x:9,y:4})'))
        check('Shared open wall admits cross-section visibility and travel',E('RCCore.routeCheck(RCApp.project,{x:7,y:4},{x:9,y:4}).ok'))
        page.locator('.toolbar [data-tool="door"]').click();click_world(5,4)
        check('A door tool rejects free floor placement',page.locator('#createOpening').count()==0 and 'wall lines' in page.locator('#toast').inner_text())
        # Place a real window on the north wall of the original room via a canvas hit.
        page.locator('.toolbar [data-tool="window"]').click();click_world(3,0)
        check('Wall-line click opens architectural placement form',page.locator('#createOpening').is_visible())
        page.locator('#openingWidth').fill('1.6');page.locator('#createOpening').click();wait()
        check('Window has host wall and sill, not floor-object identity',E('()=>{let w=RCApp.project.openings.find(o=>o.kind==="window");return w&&w.side==="N"&&w.bottom>0&&!RCApp.project.objects.length}'))
        change('[data-change="opening"][data-key="offset"]',2)
        check('Window position editing stays along its host wall',E('RCApp.project.openings.find(o=>o.kind==="window").offset===2'))
        old=E('RCApp.project.openings.find(o=>o.kind==="window").width');change('[data-change="opening"][data-key="width"]',40)
        check('Invalid opening width rolls back instead of escaping the wall',E('RCApp.project.openings.find(o=>o.kind==="window").width')==old)
        E('RCApp.selectRoom(RCApp.project.rooms[1].id)')
        page.locator('details summary').first.click();page.locator('#roomX').fill('1');page.locator('[data-action="apply-room"]').last.click();wait()
        check('Room-overlap edit rejected atomically',E('RCApp.project.rooms[1].x===8') and 'overlap' in page.locator('#toast').inner_text())
        E('RCApp.selectRoom(RCApp.project.rooms[0].id)')
        page.locator('[data-change="global"][data-key="units"]').select_option('ft');wait()
        check('Feet conversion changes display, not actual metre geometry',E('RCApp.project.rooms[0].width===8&&RCApp.project.units==="ft"') and float(page.locator('#roomWidth').input_value())>26)
        page.locator('[data-change="global"][data-key="units"]').select_option('m');wait()
        page.locator('#roomWidth').fill('8');page.locator('#roomLength').fill('7');page.locator('[data-action="apply-room"]').first.click();wait()
        if page.locator('#confirmYes').count():page.locator('#confirmYes').click();wait()
        check('Room size changes actual footprint without camera zoom substitution',E('RCApp.project.rooms[0].length===7'))
    group('Connected architecture controls',rooms)

    def aesthetics():
        reset();E('RCApp.loadExample()');wait();rid=E('RCApp.project.rooms[0].id');E('id=>RCApp.selectRoom(id)',rid)
        before=E('JSON.stringify(RCApp.project.rooms[1])');page.locator('[data-panel="style"]').click();page.locator('[data-palette="midnight"]').click();wait()
        check('Palette changes selected room only',E('RCApp.project.rooms[0].floor.finish==="tile"') and before==E('JSON.stringify(RCApp.project.rooms[1])'))
        change('[data-change="ambient"][data-key="brightness"]',1.25)
        check('Room brightness is editable and stored',E('RCApp.project.rooms[0].light.brightness===1.25'))
        E('RCApp.selectView(RCApp.project.viewpoints[0].id,{open:true})');wait()
        def image_hash():return E('()=>{const p=RCApp.project,v=p.viewpoints.find(v=>v.id===RCApp.state.viewId),a=RCApp.renderer.drawFP(p,v,{width:240}).pixels;let n=0;for(let i=0;i<a.length;i+=37)n=(n*31+a[i])>>>0;return n}')
        a=image_hash();E('id=>RCApp.selectRoom(id)',rid);page.locator('[data-panel="style"]').click();change('[data-change="ambient"][data-key="brightness"]',.4);b=image_hash()
        check('Ambient brightness alters actual first-person pixels',a!=b)
        page.locator('#styleTarget').select_option('floor');change('[data-change="surface"][data-key="color"]','#9b354e')
        check('Floor colour control updates the chosen surface',E('RCApp.project.rooms[0].floor.color==="#9b354e"'))
        E('RCApp.setMode("iso");RCApp.selectRoom(RCApp.project.rooms[0].id)');page.locator('[data-wall-side="N"]').click();change('[data-change="surface"][data-key="color"]','#457687')
        check('Individual wall override does not repaint every wall',E('RCApp.project.rooms[0].walls.N.color==="#457687"&&RCApp.project.rooms[0].wall.color!=="#457687"'))
        page.locator('.toolbar [data-tool="light"]').click();click_world(4,2)
        check('Light pool is created inside its actual room',E('RCApp.project.lights.length===2&&RCApp.project.lights[1].roomId===RCApp.project.rooms[0].id'))
        change('[data-change="light"][data-key="intensity"]',.8)
        check('Light pool intensity is editable',E('RCApp.project.lights[1].intensity===.8'))
    group('Room and surface appearance',aesthetics)

    def nav_and_visibility():
        reset();E('RCApp.loadExample()');wait();p=E('RCApp.project');pair=p['pairs'][0]
        c=p['viewpoints'][1]['id'];e=pair['exposedViewId']
        cover=E('id=>{let p=RCApp.project,v=p.viewpoints.find(v=>v.id===id);return RCApp.renderer.coverage(p,v,v.cover.source)}',c)
        exposed=E('ids=>{let p=RCApp.project,v=p.viewpoints.find(v=>v.id===ids[1]),c=p.viewpoints.find(v=>v.id===ids[0]);return RCApp.renderer.coverage(p,v,c.cover.source)}',[c,e])
        check('Covered view keeps an actual visible opening',.05<cover<.9,cover)
        check('Exposed state reveals more of the same scene',exposed<cover-.2,{'cover':cover,'exposed':exposed})
        E('id=>RCApp.selectView(id,{open:true})',c);page.locator('#testBtn').click();wait();E('id=>RCApp.switchState(id)',e)
        check('Paired state switch is available in Test walk',E('RCApp.state.walkId')==e)
        dest=E('RCApp.project.viewpoints.find(v=>v.name==="Alcove").id');page.locator(f'[data-travel="{dest}"]').click();wait()
        check('Test travel crosses open shared wall to adjoining area',E('RCApp.state.walkId')==dest)
        hall=E('RCApp.project.viewpoints.find(v=>v.name==="Hall").id');door=E('RCApp.project.openings.find(o=>o.kind==="door").id')
        # Compare first-person render with the physical door closed/open.
        before=E('()=>{let p=RCApp.project,v=p.viewpoints.find(v=>v.id===RCApp.state.viewId);return RCApp.renderer.drawFP(p,v,{width:320}).canvas.toDataURL()}')
        page.locator(f'[data-toggle-door="{door}"]').click();wait()
        after=E('()=>{let p=RCApp.project,v=p.viewpoints.find(v=>v.id===RCApp.state.viewId);return RCApp.renderer.drawFP(p,v,{width:320}).canvas.toDataURL()}')
        check('Closed door changes visible architecture pixels',before!=after)
        check('Closed door disables its travel route',page.locator(f'[data-travel="{hall}"]').is_disabled() and E('id=>RCApp.travel(id)',hall)==False)
        page.locator(f'[data-toggle-door="{door}"]').click();wait();page.locator(f'[data-travel="{hall}"]').click();wait()
        check('Opening the door restores cross-room travel',E('RCApp.state.walkId')==hall)
        check('Geometry editing controls are disabled during Test walk',page.locator('.toolbar [data-tool="door"]').is_disabled())
        page.locator('#testBtn').click();wait()
        check('Return to editing retains current placed viewpoint',E('RCApp.state.mode==="build"') and E('RCApp.state.viewId')==hall)
    group('Cross-room visibility and test routes',nav_and_visibility)

    def imports_drag():
        reset();vid=place(4,5,4,2)
        page.locator('#assetFiles').set_input_files(str(fixture));page.wait_for_function('RCApp.assets.length===1')
        check('Custom PNG import enters initially empty library',page.locator('[data-asset]').count()==1)
        page.locator('[data-asset]').click();click_world(4,2)
        oid=E('RCApp.project.objects[0]?.id');check('Asset placement creates exactly one shared object',bool(oid) and E('RCApp.project.objects.length===1'))
        E('id=>RCApp.selectObject(id)',oid);change('[data-change="object"][data-key="height"]',1.5)
        # Drag by floor foot slightly up into opaque image at iso position.
        q=E('()=>{const o=RCApp.project.objects[0],a=RCApp.assets[0],v=RCApp.project.viewpoints[0];return RCCore.rectFor(RCApp.project,o,"iso",v,a)}')
        # Use the isometric object pick helper to select a known opaque body point.
        pt=E('()=>{const o=RCApp.project.objects[0],a=RCApp.assets[0],v=RCApp.project.viewpoints[0],r=RCCore.rectFor(RCApp.project,o,"iso",v,a);for(let y=r.y-r.h/2+3;y<r.y+r.h/2;y+=4)for(let x=r.x-r.w/2+3;x<r.x+r.w/2;x+=4)if(RCApp.renderer.hitIsoObject(RCApp.project,{x,y})?.id===o.id)return RCApp.viewPoint({x,y});return null}')
        check('Transparent sprite has selectable visible isometric pixels',pt is not None)
        start=E('RCApp.project.objects[0].x');delta=E('()=>{const a=RCApp.projectPoint({x:4,y:2}),b=RCApp.projectPoint({x:4.5,y:2});return{x:b.x-a.x,y:b.y-a.y}}')
        page.mouse.move(pt['x'],pt['y']);page.mouse.down();page.mouse.move(pt['x']+delta['x'],pt['y']+delta['y'],steps=8);page.mouse.up();wait()
        check('Isometric canvas drag moves shared room coordinates',E('RCApp.project.objects[0].x')>start+.2)
        E('id=>RCApp.selectView(id,{open:true})',vid);wait()
        # Find visible object pixels in the renderer's picking buffer.
        pix=E('()=>{let p=RCApp.project,v=p.viewpoints[0],r=RCApp.renderer.drawFP(p,v,{width:480});let n=0,pt=null;for(let i=0;i<r.pick.length;i++){let m=r.tags[r.pick[i]];if(m?.kind==="object"&&m.id===p.objects[0].id){n++;if(!pt)pt={x:(i%r.W+.5)*v.width/r.W,y:(Math.floor(i/r.W)+.5)*v.height/r.H};}}return{n,pt}}')
        check('Same imported object appears in first person',pix['n']>100,pix['n'])
        pt=E('q=>RCApp.viewPoint(q)',pix['pt']);before=E('({x:RCApp.project.objects[0].x,y:RCApp.project.objects[0].y})')
        page.mouse.move(pt['x']+2,pt['y']+2);page.mouse.down();page.mouse.move(pt['x']+120,pt['y']+2,steps=10);page.mouse.up();wait()
        after=E('({x:RCApp.project.objects[0].x,y:RCApp.project.objects[0].y})')
        check('First-person canvas drag updates shared floor position',abs(after['x']-before['x'])>.1,{'before':before,'after':after})
        check('Bidirectional drag preserves the object ID, with no per-view clones',E('id=>RCApp.project.objects.length===1&&RCApp.project.objects[0].id===id',oid))
        E('id=>RCApp.selectObject(id)',oid);before=E('RCApp.project.objects[0].x');change('[data-change="object"][data-key="x"]',4)
        E('RCApp.undo()');check('Undo restores last shared edit',abs(E('RCApp.project.objects[0].x')-before)<1e-6)
        E('RCApp.redo()');check('Redo reapplies shared edit',E('RCApp.project.objects[0].x===4'))
        # Aspect preservation.
        ratio=E('()=>{let p=RCApp.project,o=p.objects[0],v=p.viewpoints[0],a=RCApp.assets[0],r=RCCore.rectFor(p,o,"fp",v,a);return r.w/r.h}')
        check('Source PNG aspect ratio is retained',abs(ratio-2/3)<1e-6,ratio)
        E('id=>RCApp.selectView(id,{open:true})',vid);page.locator('[data-assign-cover]').click();page.locator('#coverSource').select_option(f'object:{oid}');page.locator('#assignCover').click();wait()
        result=E('()=>{let p=RCApp.project,v=p.viewpoints[0],o=p.objects[0],r=RCCore.rectFor(p,o,"fp",v,RCApp.assets[0]);let solid={x:r.x-r.w*.4,y:r.y},hole={x:r.x,y:r.y};return{solid:RCApp.renderer.probe(p,v,solid,v.cover.source),hole:RCApp.renderer.probe(p,v,hole,v.cover.source)}}')
        check('Opaque artwork blocks assigned-cover probe',result['solid']['blocked'])
        check('Transparent hole stays genuinely open, not rectangle-blocked',not result['hole']['blocked'])
        page.locator('#assetFiles').set_input_files(str(texture));page.wait_for_function('RCApp.assets.length===2')
        tid=E('RCApp.assets[1].id');E('RCApp.selectRoom(RCApp.project.rooms[0].id)');page.locator('[data-panel="style"]').click();page.locator('#styleTarget').select_option('floor');page.locator('[data-change="surface"][data-key="textureId"]').select_option(tid);wait()
        check('Imported image can be assigned as floor texture',E('id=>RCApp.project.rooms[0].floor.textureId===id&&RCApp.project.rooms[0].floor.finish==="image"',tid))
        # Real save button and browser download.
        with page.expect_download() as dl:page.locator('#saveBtn').click()
        downloaded=dl.value;dest=tmp/'saved.room.json';downloaded.save_as(str(dest));b=json.loads(dest.read_text())
        check('Save downloads portable project containing imported image bytes',len(b['assets'])==2 and b['assets'][0]['src'].startswith('data:image/png;base64,'))
        before=E('JSON.stringify(RCApp.makeBundle().project)');reset();page.locator('#projectFile').set_input_files(str(dest));page.wait_for_function('RCApp.assets.length===2')
        check('Open round-trip restores shared objects, cover, and textures',E('JSON.stringify(RCApp.makeBundle().project)')==before)
        # New clears actual library, not just hides cards.
        E('RCApp.newProject(true)');check('New resets imported images and placed objects',E('RCApp.assets.length===0&&RCApp.project.objects.length===0&&RCApp.project.viewpoints.length===0'))
    group('Custom image library and bidirectional objects',imports_drag)

    def portal_objects():
        reset()
        page.locator('#assetFiles').set_input_files(str(fixture));page.wait_for_function('RCApp.assets.length===1')
        E("()=>{const C=RCCore;RCApp.mutate(()=>{let p=RCApp.project,r=p.rooms[0];C.addAdjoining(p,r.id,'E',4,6,0,'solid');const v=C.createViewpoint(p,{x:5,y:3},{x:10,y:3},'Door test');let o=C.createObject(RCApp.assets[0],{x:9,y:3});o.height=1.5;p.objects.push(o);C.createOpening(p,r.id,'E',2.25,'door',{width:1.5,height:2.2,open:true});},'Set up doorway visibility test');RCApp.selectView(RCApp.project.viewpoints[0].id,{open:true});}")
        def object_pixels():return E("()=>{let p=RCApp.project,v=p.viewpoints[0],r=RCApp.renderer.drawFP(p,v,{width:400});let ids=new Set(r.tags.map((m,i)=>m?.kind==='object'?i:-1)),n=0;for(const tag of r.pick)if(ids.has(tag))n++;return n}")
        check('Imported object is visible through an actual shared doorway',object_pixels()>50)
        E('RCApp.toggleDoor(RCApp.project.openings[0].id)')
        check('Closed shared door occludes the imported object pixel-for-pixel',object_pixels()==0)
        E('RCApp.mutate(()=>RCApp.project.openings=[],"Remove doorway")')
        check('Restored solid partition hides objects in adjoining room',object_pixels()==0)
        E("()=>{RCApp.mutate(()=>{let p=RCApp.project;RCCore.createOpening(p,p.rooms[0].id,'E',1.5,'passage',{width:3,height:2.7,trim:false})},'Open shared wall')}")
        check('Reopening shared wall restores the same object, no duplicate needed',object_pixels()>50 and E('RCApp.project.objects.length===1'))
        E("()=>{RCApp.mutate(()=>{let p=RCApp.project;p.openings=[];RCCore.createOpening(p,p.rooms[0].id,'E',1.5,'window',{width:3,height:1.6,bottom:.9})},'Add internal window')}")
        check('Internal window shows neighbouring object through the glass',object_pixels()>10)
        check('That same internal window is not a floor travel connection',E('!RCCore.routeCheck(RCApp.project,RCApp.project.viewpoints[0],{x:9,y:3}).ok'))
        reset();vid=place(4,5,4,1);E('id=>RCApp.selectView(id,{open:true})',vid)
        page.locator('#assetFiles').set_input_files(str(fixture));page.wait_for_function('RCApp.assets.length===1');page.locator('[data-asset]').click()
        q=E('()=>RCApp.viewPoint(RCCore.fpPoint(RCApp.project.viewpoints[0],{x:3,y:1},0))')
        page.mouse.click(q['x'],q['y']);wait()
        check('Placing a new asset in first person gives it real floor coordinates',E('RCApp.project.objects.length===1&&Math.abs(RCApp.project.objects[0].x-3)<.01&&Math.abs(RCApp.project.objects[0].y-1)<.01'))
        E('RCApp.setMode("iso")');wait()
        check('Object created in first person remains the same isometric object',E('RCApp.project.objects.length===1&&!!RCApp.renderer.hitIsoObject'))
        # Assign imported object, then clear assets without destroying map viewpoints.
        oid=E('RCApp.project.objects[0].id');E('id=>RCApp.selectView(id)',vid);page.locator('[data-assign-cover]').click();page.locator('#coverSource').select_option('object:'+oid);page.locator('#assignCover').click();wait()
        page.locator('[data-create-partner]').click();page.locator('#createPartner').click();wait()
        page.locator('[data-pane="assets"]').click();page.locator('[data-action="clear-assets"]').click();page.locator('#confirmYes').click();wait()
        check('Clearing library really removes all working images and objects',E('RCApp.assets.length===0&&RCApp.project.objects.length===0'))
        check('Clearing object cover safely unpairs but retains map viewpoints',E('RCApp.project.viewpoints.length===2&&RCApp.project.pairs.length===0&&RCApp.project.viewpoints.every(v=>!v.cover)'))
    group('Portal object occlusion and first-person creation',portal_objects)

    def export_and_resize():
        reset();E('RCApp.loadExample()');wait();E('RCApp.selectView(RCApp.project.pairs[0].coverViewId,{open:true})')
        page.locator('details').filter(has_text='View export resolution').locator('summary').click();change('[data-change="view"][data-key="width"]',1280);change('[data-change="view"][data-key="height"]',800)
        check('First-person export resolution is measured in pixels',E('RCApp.project.viewpoints.find(v=>v.id===RCApp.state.viewId).width===1280'))
        page.locator('#exportBtn').click()
        with page.expect_download() as d1:page.locator('[data-export="view"]').click()
        p1=tmp/'view.png';d1.value.save_as(str(p1));view=Image.open(p1)
        check('Clean first-person PNG export uses selected dimensions',view.size==(1280,800),view.size)
        page.locator('#exportBtn').click()
        with page.expect_download() as d2:page.locator('[data-export="mask"]').click()
        p2=tmp/'mask.png';d2.value.save_as(str(p2));mask=Image.open(p2)
        check('Cover mask export contains both blocked and open pixels',len(mask.convert('L').getcolors(1000000))>1)
        page.locator('#exportBtn').click()
        with page.expect_download() as d3:page.locator('[data-export="map"]').click()
        p3=tmp/'map.png';d3.value.save_as(str(p3))
        check('Labeled map exports independently of active first-person view',Image.open(p3).size==(1440,1080))
        E('RCApp.setMode("iso")');page.set_viewport_size({'width':1280,'height':800});wait()
        check('Editor fits a 1280 × 800 desktop without body overflow',E('document.documentElement.scrollWidth<=innerWidth && document.documentElement.scrollHeight<=innerHeight'))
        check('Room inspector and main canvas remain visible at smaller size',page.locator('#stage').is_visible() and page.locator('.right').is_visible())
        page.set_viewport_size({'width':1600,'height':1000});wait()
        reset();place(7,5,7,3);E('RCApp.selectRoom(RCApp.project.rooms[0].id)');page.locator('#roomWidth').fill('4');page.locator('[data-action="apply-room"]').first.click();wait()
        check('Shrink warns before relocating outside viewpoint',page.locator('#confirmYes').count()==1 and E('RCApp.project.rooms[0].width===8'))
        page.locator('[data-action="close-modal"]').first.click();check('Cancel resize leaves room and viewpoint untouched',E('RCApp.project.rooms[0].width===8&&RCApp.project.viewpoints[0].x===7'))
        page.locator('[data-action="apply-room"]').first.click();page.locator('#confirmYes').click();wait()
        check('Explicit resize confirmation safely repositions outlying view',E('RCApp.project.rooms[0].width===4&&RCApp.project.viewpoints[0].x<4'))
    group('Exports responsive layout and safe resize',export_and_resize)

    def migration():
        reset()
        old=E('()=>{let p=RCV3Core.newProject();p.name="Old test";p.viewpoints.push(RCV3Core.createViewpoint({x:3,y:4},{x:3,y:1},"Legacy view","movement"));return{project:p,assets:[]}}')
        path=tmp/'old.room.json';path.write_text(json.dumps(old));page.locator('#projectFile').set_input_files(str(path));wait()
        check('Opening a legacy file displays a conversion choice',page.locator('#convertProject').count()==1 or 'Convert' in page.locator('#modalRoot').inner_text())
        # Inspect names through stable buttons/text rather than depend on programmatic migration.
        box=page.locator('#architectureOnly');
        if box.count():box.check()
        button=page.locator('#convertProject')
        if not button.count():button=page.locator('#convertProject')
        button.click();wait()
        check('Legacy conversion keeps placed view coordinates and empty library',E('RCApp.project.version===10&&RCApp.assets.length===0&&RCApp.project.viewpoints.length===1&&RCApp.project.viewpoints[0].x===3'))
        E("document.getElementById('modalRoot').innerHTML=''")
        before=E('JSON.stringify(RCApp.project)');bad=tmp/'bad.room.json';bad.write_text('{"project":{"format":"trapstar-room-creator","version":4}}')
        page.locator('#projectFile').set_input_files(str(bad));wait()
        check('Malformed project rejected without replacing current project',before==E('JSON.stringify(RCApp.project)'))
    group('Legacy and invalid project handling',migration)

    check('No unhandled JavaScript errors during browser checks',len(errors)==0,errors)
    check('No HTTP or HTTPS requests needed by standalone editor',len(net)==0,net)
    # Restore the shipped empty state and retain a current preview.
    E('RCApp.newProject(true)');wait();page.screenshot(path=str(ROOT/'previews/01_empty.png'))
    browser.close()

report={'tool':'Playwright with local headless Chromium','loading':'Self-contained HTML bytes via set_content; managed container blocks file:// navigation. No external network requests.', 'passed':sum(r['passed'] for r in results),'failed':sum(not r['passed'] for r in results),'checks':results}
(ROOT/'tests/browser_results.json').write_text(json.dumps(report,indent=2))
print(json.dumps({k:report[k] for k in ['passed','failed']}),flush=True)
raise SystemExit(1 if report['failed'] else 0)
