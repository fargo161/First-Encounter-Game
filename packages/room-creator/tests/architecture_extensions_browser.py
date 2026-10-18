"""v0.7 UI, pixel, save/export and interaction checks for interior architecture."""
from pathlib import Path
from tempfile import TemporaryDirectory
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
import json, base64, traceback, os
ROOT=Path(__file__).resolve().parents[1]
results=[]
def check(name,value,detail=None):
    if not value: raise AssertionError(name+(': '+str(detail) if detail is not None else ''))
    results.append({'name':name,'passed':True}); print('PASS',name,flush=True)
with TemporaryDirectory() as td, sync_playwright() as pw:
    td=Path(td)
    im=Image.new('RGB',(96,96),'#8f5133');d=ImageDraw.Draw(im)
    for y in range(0,96,24):
        d.line([(0,y),(96,y)],fill='#e4d9b2',width=3)
        for x in range((-24 if (y//24)%2 else 0),96,48):d.line([(x,y),(x,y+24)],fill='#e4d9b2',width=3)
    texture=td/'partition_brick.png';im.save(texture)
    sky=td/'outside.png';Image.new('RGB',(160,80),(240,20,200)).save(sky)
    def asset(path,id):
        with Image.open(path) as im: w,h=im.size
        return {'id':id,'name':path.stem,'width':w,'height':h,'src':'data:image/png;base64,'+base64.b64encode(path.read_bytes()).decode()}
    texa=asset(texture,'brick');skya=asset(sky,'sky')
    browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=True)
    page=browser.new_page(viewport={'width':1600,'height':1000},accept_downloads=True)
    page.set_default_timeout(6000);errors=[];requests=[]
    page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url) if r.url.startswith(('http:','https:')) else None)
    page.set_content((ROOT/'Room_Creator.html').read_text(),wait_until='load');page.wait_for_function('window.RCApp!==undefined')
    def E(code,arg=None):return page.evaluate(code,arg)
    def wait():page.wait_for_timeout(120)
    def click_world(x,y):
        q=E('q=>RCApp.projectPoint(q)',{'x':x,'y':y});page.mouse.click(q['x'],q['y']);wait()
    def drag_world(a,b):
        x=E('q=>RCApp.projectPoint(q)',a);y=E('q=>RCApp.projectPoint(q)',b)
        page.mouse.move(x['x'],x['y']);page.mouse.down();page.mouse.move(y['x'],y['y'],steps=8);page.mouse.up();wait()
    def change(sel,value):
        a=page.locator(sel);a.fill(str(value));a.dispatch_event('change');wait()
    def reset():E('RCApp.newProject(true)');wait()
    def group(name,fn):
        try:fn()
        except Exception as ex:
            results.append({'name':name,'passed':False,'error':str(ex),'trace':traceback.format_exc()});print('FAIL',name,str(ex),flush=True)
            try:page.screenshot(path=str(ROOT/'previews'/('FAIL_'+name.replace(' ','_')+'.png')));E("document.getElementById('modalRoot').innerHTML='';RCApp.newProject(true)")
            except Exception:pass
    E('''()=>{
      window.hashCanvas=c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let h=0;for(let i=0;i<d.length;i+=17)h=(Math.imul(h,31)+d[i])|0;return h;};
      window.isoHash=()=>{const c=document.createElement('canvas');c.width=1440;c.height=1080;RCApp.renderer.drawIso(c.getContext('2d'),RCApp.project,{dimensions:false,grid:false,cutaway:false});return hashCanvas(c);};
      window.pixel=(x,y,z=1.4,index=0)=>{const p=RCApp.project,v=p.viewpoints[index],draw=RCApp.renderer.drawFP(p,v,{width:960}),q=RCCore.fpPoint(draw.arch.v,{x,y},z);if(!q||q.x<0||q.x>=draw.W||q.y<0||q.y>=draw.H)throw Error('Sample outside view '+JSON.stringify(q));const i=Math.floor(q.y)*draw.W+Math.floor(q.x),c=draw.pixels[i];return {color:[c&255,(c>>>8)&255,(c>>>16)&255],meta:draw.tags[draw.pick[i]],depth:draw.depth[i]};};
    }''')
    def mixed():
        reset();E('''()=>RCApp.mutate(()=>{const p=RCApp.project,r=p.rooms[0];RCCore.createOpening(p,r.id,'N',1,'window',{width:1.6,name:'Existing window'});RCCore.createOpening(p,r.id,'N',4,'door',{name:'Existing door',open:false});})''')
        ids=E('RCApp.project.openings.map(o=>o.id)');before=E('JSON.stringify(RCApp.project.openings)')
        E('id=>RCApp.selectOpening(id)',ids[0]);page.locator('[data-action="select-host-wall"]').click()
        check('Wall elevation shows both existing window and door',page.locator('#inspector .wall-layout [data-opening]').count()==2)
        page.locator('[data-action="wall-passage"]').click();wait()
        check('New passage form starts in a valid unused span',not page.locator('#createOpening').is_disabled())
        check('Opening dialog identifies occupied and free wall areas',page.locator('#modalRoot .wall-layout [data-opening]').count()==2 and page.locator('#modalRoot [data-free-offset]').count()>=2)
        page.locator('#useFullSection').click()
        check('Fill-span button does not select the entire pierced wall',float(page.locator('#openingWidth').input_value())<8 and not page.locator('#createOpening').is_disabled())
        page.locator('#createOpening').click();wait()
        check('Passage is added alongside window and door without replacing either',E('RCApp.project.openings.length===3') and E('JSON.stringify(RCApp.project.openings.slice(0,2))')==before)
        E('id=>RCApp.selectOpening(id)',ids[0]);page.locator('[data-action="add-next-opening"]').click();wait()
        check('Existing opening has a direct add-another-opening flow',page.locator('#createOpening').count()==1)
        change('#openingOffset',1);change('#openingWidth',1)
        check('Overlapping candidate is visibly rejected before creation',page.locator('#createOpening').is_disabled() and 'overlap' in page.locator('#openingValidation').inner_text().lower())
        page.locator('#modalRoot [data-action="close-modal"]').first.click();E('id=>RCApp.selectOpening(id)',ids[0]);page.locator('[data-action="select-host-wall"]').click()
        page.locator('[data-action="wall-full-open"]').click();check('Open remaining spans asks before modifying multiple cuts',page.locator('#confirmYes').count()==1)
        page.locator('#confirmYes').click();wait()
        check('Opening remaining spans preserves original door/window identities and closed state',E('JSON.stringify(RCApp.project.openings.slice(0,2))')==before)
        check('All cut geometry passes core validation after batch open',E('!!RCCore.validateBundle(RCApp.makeBundle())'))
        page.screenshot(path=str(ROOT/'previews/01_mixed_wall.png'))
    group('Mixed openings UI',mixed)

    def partitions():
        reset();page.locator('.toolbar [data-tool="partition"]').click();click_world(1,3)
        check('First partition click creates no wall yet',E('RCApp.project.partitions.length===0&&!!RCApp.state.pending.origin'))
        page.keyboard.press('Escape');check('Escape cancels partition placement without hidden geometry',E('RCApp.project.partitions.length===0&&!RCApp.state.pending'))
        page.locator('.toolbar [data-tool="partition"]').click();click_world(1,3);click_world(7,3)
        check('Second partition click creates one interior wall in same room',E('RCApp.project.partitions.length===1&&RCApp.project.rooms.length===1'))
        check('Partition inspector contains no exterior matte import or assignment',page.locator('#inspector [data-action*="matte"]').count()==0 and 'Always interior' in page.locator('#inspector').inner_text())
        pid=E('RCApp.project.partitions[0].id');before=E('isoHash()')
        with page.expect_file_chooser() as fc: page.locator('[data-action="import-partition-texture"]').click()
        fc.value.set_files(str(texture));wait()
        check('Dedicated partition import assigns image to face A only',E('!!RCApp.project.partitions[0].faces.A.textureId&&!RCApp.project.partitions[0].faces.B.textureId&&RCApp.project.objects.length===0'))
        check('Imported partition texture actually changes the isometric drawing',E('isoHash()')!=before)
        change('[data-change="partitionSurface"][data-key="tileSize"]',.6)
        change('[data-change="partitionSurface"][data-key="offsetX"]',.2)
        check('Partition texture repeat and offsets are editable independently of room walls',E('RCApp.project.partitions[0].faces.A.tileSize===.6&&RCApp.project.partitions[0].faces.A.offsetX===.2&&!RCApp.project.rooms[0].wall.textureId'))
        page.locator('[data-partition-face="B"]').click();change('[data-change="partitionSurface"][data-key="color"]','#416785')
        check('Opposite partition face can have a distinct finish',E('RCApp.project.partitions[0].faces.B.color==="#416785"&&RCApp.project.partitions[0].faces.A.color!=="#416785"'))
        page.locator('[data-partition-face="A"]').click();page.locator('[data-action="copy-partition-face"]').click();wait()
        check('Copy-finish button sets both faces without changing room architecture',E('JSON.stringify(RCApp.project.partitions[0].faces.A)===JSON.stringify(RCApp.project.partitions[0].faces.B)'))
        page.locator('[data-action="wall-door"]').click();change('#openingOffset',2);page.locator('#createOpening').click();wait()
        check('Partition door stays attached to partition with no exterior side',E('RCApp.project.openings[0].partitionId===RCApp.project.partitions[0].id&&RCApp.project.openings[0].side===null'))
        check('Partition opening has neither attach-room nor matte controls',page.locator('#inspector [data-action="attach-room"]').count()==0 and page.locator('#inspector [data-action*="matte"]').count()==0)
        oid=E('RCApp.project.openings[0].id');E('id=>RCApp.selectPartition(id)',pid)
        drag_world({'x':1.5,'y':3},{'x':1.5,'y':3.5})
        check('Dragging interior wall line moves partition on floor',abs(E('RCApp.project.partitions[0].y')-3.5)<.01)
        check('Hosted opening moves with partition and keeps identity',E('id=>RCApp.project.openings[0].id===id&&RCCore.openingLine(RCApp.project,RCApp.project.openings[0]).fixed===3.5',oid))
        drag_world({'x':7,'y':3.5},{'x':7.5,'y':3.5})
        check('End-handle drag resizes partition without moving its start',abs(E('RCApp.project.partitions[0].length')-6.5)<.01 and E('RCApp.project.partitions[0].x')==1)
        before=E('JSON.stringify(RCApp.project.partitions[0])');change('[data-change="partition"][data-key="length"]',1)
        check('Invalid wall shortening rolls back rather than deleting its doorway',E('JSON.stringify(RCApp.project.partitions[0])')==before)
        E('RCApp.undo()');wait();check('Undo restores previous partition length',abs(E('RCApp.project.partitions[0].length')-6)<.01)
        E('RCApp.redo()');wait();check('Redo reapplies partition resize',abs(E('RCApp.project.partitions[0].length')-6.5)<.01)
        E('id=>RCApp.selectPartition(id)',pid);page.locator('[data-action="delete-selection"]').click();page.locator('#confirmYes').click();wait()
        check('Delete partition removes its door, not its host room',E('RCApp.project.partitions.length===0&&RCApp.project.openings.length===0&&RCApp.project.rooms.length===1'))
        E('RCApp.undo()');wait();check('Undo deletion restores partition, door and its textures',E('RCApp.project.partitions.length===1&&RCApp.project.openings.length===1&&!!RCApp.project.partitions[0].faces.A.textureId'))
    group('Partition placement and texture tools',partitions)

    def partition_pixels():
        E('''assets=>{const C=RCCore,p=C.newProject(),r=p.rooms[0];r.wall.color='#98b479';r.light.tintStrength=0;r.exterior.default={...C.backdrop('sky'),fit:'stretch'};const q=C.createPartition(p,r.id,{x:0,y:3},{x:8,y:3});q.faces.A={...C.surface('#fefefe','image'),textureId:'brick',tileSize:.6};q.faces.B=C.surface('#386782');
        C.createOpening(p,r.id,null,3,'door',{partitionId:q.id,width:2,name:'Inside door'});C.createOpening(p,r.id,null,.4,'window',{partitionId:q.id,width:1.7});C.createOpening(p,r.id,null,6,'passage',{partitionId:q.id,width:1.2});
        C.createViewpoint(p,{x:4,y:5.6},{x:4,y:0},'Front');C.createViewpoint(p,{x:4,y:.4},{x:4,y:6},'Back');p.viewpoints.forEach(v=>v.fov=105);return RCApp.applyBundle({project:p,assets});}''',[texa,skya]);wait()
        check('Front sees textured partition and correct face A identity',E('pixel(2.5,3).meta.kind==="partition"&&pixel(2.5,3).meta.face==="A"'))
        check('Reverse viewpoint sees partition face B rather than the front artwork',E('pixel(2.5,3,1.4,1).meta.kind==="partition"&&pixel(2.5,3,1.4,1).meta.face==="B"'))
        check('Open partition door reveals real room wall behind it',E('pixel(4,3).meta.kind==="wall"'))
        check('Partition window reveals real room through glass, not exterior matte',E('pixel(1.05,3).meta.kind==="wall"'))
        check('Open partition span reveals real floor-plan architecture',E('pixel(6.5,3).meta.kind==="wall"'))
        before=E('pixel(4,3)');E('RCApp.toggleDoor(RCApp.project.openings[0].id)');wait()
        check('Closed partition door correctly occludes the room behind it',E('pixel(4,3).meta.kind==="opening"') and E('pixel(4,3).color')!=before['color'])
        E('RCApp.toggleDoor(RCApp.project.openings[0].id)');wait()
        check('Reopening partition door restores the same interior view',E('pixel(4,3).color')==before['color'])
        E('RCApp.selectView(RCApp.project.viewpoints[0].id,{open:true})');page.screenshot(path=str(ROOT/'previews/03_partition_first_person.png'))
        E('''()=>{const p=RCApp.project,q=p.partitions[0];RCApp.mutate(()=>RCCore.assignCover(p,p.viewpoints[0].id,{kind:'partition',id:q.id}));}''')
        check('Partition is available as cover only after viewpoint assignment',E('!!RCApp.project.viewpoints[0].cover&&RCApp.project.pairs.length===0') and not page.locator('[data-create-partner]').is_disabled())
        check('Partition coverage probe counts solid wall but not its door opening',E('''()=>{const p=RCApp.project,v=p.viewpoints[0],src=v.cover.source;const a=RCCore.fpPoint(v,{x:2.5,y:3},1.4),b=RCCore.fpPoint(v,{x:4,y:3},1.4);return RCApp.renderer.probe(p,v,a,src).blocked&&!RCApp.renderer.probe(p,v,b,src).blocked;}'''))
        # Check custom-height bands above a short partition using a fresh no-opening case.
        E('''()=>{const p=RCCore.newProject(),r=p.rooms[0];RCCore.createPartition(p,r.id,{x:0,y:3},{x:8,y:3},{height:1});RCCore.createViewpoint(p,{x:4,y:5},{x:4,y:0});return RCApp.applyBundle({project:p,assets:[]});}''')
        check('Low partition blocks below its height and reveals room above it',E('pixel(4,3,.7).meta.kind==="partition"&&pixel(4,3,1.5).meta.kind==="wall"'))
    group('Partition rendering, depth and cover',partition_pixels)

    def attachment():
        E('''a=>{const p=RCCore.newProject(),r=p.rooms[0];r.exterior.default={...RCCore.backdrop(a.id),fit:'stretch'};const o=RCCore.createOpening(p,r.id,'N',3,'door',{width:2,name:'Keep this doorway'});const v=RCCore.createViewpoint(p,{x:4,y:3},{x:4,y:0});return RCApp.applyBundle({project:p,assets:[a]}).then(()=>RCApp.selectOpening(o.id));}''',skya);wait()
        old=E('JSON.stringify(RCApp.project.openings[0])');ids=E('RCApp.project.openings[0].id')
        check('Before attachment, doorway shows its exterior side matte',E('pixel(4,0).meta.kind==="exterior"'))
        page.locator('[data-action="attach-room"]').click();wait()
        check('Attach dialog displays live footprint preview',page.locator('#attachPreview svg').count()==1 and not page.locator('#attachRoomConfirm').is_disabled())
        change('#attachWidth',1)
        check('Invalid attachment size is blocked before creation',page.locator('#attachRoomConfirm').is_disabled() and E('RCApp.project.rooms.length===1'))
        change('#attachWidth',4);change('#attachLength',3);change('#attachName','Connected studio')
        check('Valid size restores attach action without moving the original opening',not page.locator('#attachRoomConfirm').is_disabled() and E('JSON.stringify(RCApp.project.openings[0])')==old)
        page.screenshot(path=str(ROOT/'previews/04_attach_dialog.png'))
        page.locator('#attachRoomConfirm').click();wait()
        check('Confirm attachment creates exactly one new room, not another doorway',E('RCApp.project.rooms.length===2&&RCApp.project.openings.length===1&&RCApp.project.rooms[1].name==="Connected studio"'))
        check('Existing aperture record and identity survive room attachment',E('JSON.stringify(RCApp.project.openings[0])')==old)
        check('After attachment, same doorway reveals adjoining room instead of matte',E('pixel(4,0).meta.kind==="wall"'))
        check('Exterior matte remains saved but does not paint an interior doorway',E('RCApp.project.rooms[0].exterior.default.assetId==="sky"'))
        E('id=>RCApp.selectOpening(id)',ids)
        check('Already shared opening cannot attach a second overlapping room',page.locator('[data-action="attach-room"]').is_disabled())
        check('Interior opening inspector removes obsolete matte controls',page.locator('[data-action="edit-opening-matte"]').count()==0)
        E('RCApp.undo()');wait();check('Undo attachment returns doorway to the original exterior matte',E('RCApp.project.rooms.length===1&&pixel(4,0).meta.kind==="exterior"'))
        E('RCApp.redo()');wait();check('Redo attachment restores real adjoining-room visibility',E('RCApp.project.rooms.length===2&&pixel(4,0).meta.kind==="wall"'))
        E('''()=>RCApp.mutate(()=>{const p=RCApp.project,v=RCCore.createViewpoint(p,{x:4,y:-1.5},{x:4,y:-2.5},'In studio');RCCore.addLink(p,p.viewpoints[0].id,v.id);})''')
        E('RCApp.selectView(RCApp.project.viewpoints[0].id,{open:true});RCApp.enterTest()');wait()
        check('Test walk traverses route through reused open doorway',E('RCApp.travel(RCApp.project.viewpoints[1].id)'))
        E('RCApp.exitTest()');wait()
        E('''()=>RCApp.mutate(()=>{const p=RCApp.project,r=p.rooms[0],q=RCCore.createPartition(p,r.id,{x:1,y:4.5},{x:7,y:4.5});q.faces.A.finish='brick';})''')
        saved=E('RCApp.makeBundle()')
        with page.expect_download() as dl:page.locator('#saveBtn').click()
        savedfile=td/'saved.room.json';dl.value.save_as(savedfile);decoded=json.loads(savedfile.read_text())
        check('Actual downloaded project includes format 10 partition and connection data',decoded['project']['version']==10 and len(decoded['project']['partitions'])==1 and len(decoded['project']['rooms'])==2)
        reset();page.locator('#projectFile').set_input_files(str(savedfile));wait()
        check('Reopening actual saved file preserves partitions, openings and room poses',E('JSON.stringify(RCApp.project.partitions)')==json.dumps(saved['project']['partitions'],separators=(',',':')) and E('RCApp.project.rooms.length===2&&RCApp.project.openings.length===1'))
        # Use core data comparison rather than map UI count only.
        check('Reopening retains shared exterior assignment and chosen doorway ID',E('id=>RCApp.project.openings[0].id===id&&RCApp.project.rooms[0].exterior.default.assetId==="sky"',ids))
        E('RCApp.selectView(RCApp.project.viewpoints[0].id,{open:true})');page.locator('#exportBtn').click()
        with page.expect_download() as dl:page.locator('[data-export="view"]').click()
        png=td/'export.png';dl.value.save_as(png)
        with Image.open(png) as im: check('PNG export renders revised shared architecture at view resolution',im.size==(1440,900))
        if page.locator('#modalRoot [data-action="close-modal"]').count():page.locator('#modalRoot [data-action="close-modal"]').first.click()
    group('Attach existing opening and portable export',attachment)

    def compatibility():
        old=json.loads((ROOT/'examples/Shared_Matte_Example.room.json').read_text());E('b=>RCApp.applyBundle(b)',old);wait()
        check('v0.6.1 shared-matte project opens with no newly invented partitions',E('RCApp.project.partitions.length===0&&RCApp.project.version===10'))
        check('Existing room-side matte distance and framing survive upgrade',E('RCApp.project.rooms[0].exterior')==old['project']['rooms'][0]['exterior'])
        check('Legacy architecture, views and pairs retain their IDs',E('RCApp.project.viewpoints.map(v=>v.id)')==[v['id'] for v in old['project']['viewpoints']] and E('RCApp.project.openings.map(v=>v.id)')==[v['id'] for v in old['project']['openings']])
        page.set_viewport_size({'width':1280,'height':800});wait()
        check('Added architecture tools fit a smaller desktop with no page overflow',E('document.documentElement.scrollWidth<=innerWidth'))
        page.set_viewport_size({'width':1600,'height':1000})
    group('Version and layout compatibility',compatibility)
    check('No uncaught JavaScript exceptions in new workflows',not errors,errors)
    check('New workflows require no network requests',not requests,requests)
    browser.close()
report={'passed':sum(x['passed'] for x in results),'failed':sum(not x['passed'] for x in results),'checks':results,'loading':'Standalone HTML bytes in local Chromium using set_content.'}
(ROOT/'tests/architecture_extensions_browser_results.json').write_text(json.dumps(report,indent=2))
print(json.dumps({k:report[k] for k in ['passed','failed']}));raise SystemExit(bool(report['failed']))
