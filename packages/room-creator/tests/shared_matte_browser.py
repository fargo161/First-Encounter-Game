"""Pixel-level regression checks for shared wall-side mattes.
The diagnostic images are generated temporarily; there is no bundled furniture.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
from playwright.sync_api import sync_playwright
from PIL import Image
import base64,json,os,traceback
ROOT=Path(__file__).resolve().parents[1]
results=[]
def check(name,ok,detail=None):
    if not ok: raise AssertionError(name+': '+str(detail))
    results.append({'name':name,'passed':True});print('PASS',name,flush=True)
with TemporaryDirectory() as td, sync_playwright() as pw:
    td=Path(td)
    atlas=Image.new('RGB',(800,270));atlas.putdata([(int(x*255/799),int(y*255/269),60) for y in range(270) for x in range(800)])
    atlas.save(td/'atlas.png')
    mat={'id':'atlas','name':'World coordinate atlas','src':'data:image/png;base64,'+base64.b64encode((td/'atlas.png').read_bytes()).decode(),'width':800,'height':270}
    browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=True)
    page=browser.new_page(viewport={'width':1600,'height':1000},accept_downloads=True)
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    try:
        page.goto((ROOT/'Room_Creator.html').as_uri(),wait_until='load',timeout=8000)
        page.wait_for_function('window.RCApp!==undefined',timeout=5000)
        launch='file URL'
    except Exception:
        page.close();page=browser.new_page(viewport={'width':1600,'height':1000},accept_downloads=True);page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content((ROOT/'Room_Creator.html').read_text(),wait_until='load');page.wait_for_function('window.RCApp!==undefined');launch='set_content (file URL blocked by test environment)'
    def E(js,arg=None): return page.evaluate(js,arg)
    E('''()=>{
      window.makeMatteFixture=()=>{
        const p=RCCore.newProject(),r=p.rooms[0];r.name='Shared-side test';
        r.exterior.default={...RCCore.backdrop('atlas'),fit:'stretch'};
        RCCore.createOpening(p,r.id,'N',1,'window',{width:2,bottom:.8,height:1.5,name:'Left window'});
        RCCore.createOpening(p,r.id,'N',5,'window',{width:2,bottom:.8,height:1.5,name:'Right window'});
        RCCore.createOpening(p,r.id,'N',3.3,'door',{width:1.2,name:'Exterior door'});
        const v=RCCore.createViewpoint(p,{x:4,y:4.5},{x:4,y:0},'Straight ahead');v.fov=90;
        return p;
      };
      window.pixelAtWorld=(point,z=1.4,options={})=>{
        const p=RCApp.project,v=p.viewpoints[0],R=RCApp.renderer,W=options.width||800;
        const draw=options.full?R.drawFP(p,v,{width:W}):R.architecture(p,v,false,W),vv=draw.arch?draw.arch.v:draw.v;
        const q=RCCore.fpPoint(vv,point,z);if(!q)throw Error('Target behind view');
        const x=Math.floor(q.x),y=Math.floor(q.y);if(x<0||x>=draw.W||y<0||y>=draw.H)throw Error('Target outside image '+JSON.stringify(q));
        const i=y*draw.W+x,val=draw.pixels[i];
        return {rgb:[val&255,val>>>8&255,val>>>16&255],meta:draw.tags[draw.pick[i]],x,y,depth:draw.depth[i]};
      };
    }''')
    def fixture(): E('a=>RCApp.applyBundle({project:makeMatteFixture(),assets:[a]})',mat)
    def pix(x,y=0,z=1.4,full=False,width=800):return E('(a)=>pixelAtWorld({x:a.x,y:a.y},a.z,{full:a.full,width:a.width})',{'x':x,'y':y,'z':z,'full':full,'width':width})
    def delta(a,b):return max(abs(x-y) for x,y in zip(a['rgb'],b['rgb']))
    def group(name,fn):
        try:fn()
        except Exception as e:
            results.append({'name':name,'passed':False,'error':str(e),'trace':traceback.format_exc()});print('FAIL',name,str(e),flush=True)
            E("document.getElementById('modalRoot').innerHTML=''")
    def windows():
        fixture();a=pix(1.5);b=pix(5.5)
        check('Neighbor windows reveal distinct horizontal parts of one matte',b['rgb'][0]-a['rgb'][0]>100,[a,b])
        check('Both windows share the same vertical registration',abs(a['rgb'][1]-b['rgb'][1])<=1,[a,b])
        check('Exterior image pixels are not assigned to the window-frame tag',a['meta']['kind']=='exterior' and b['meta']['kind']=='exterior')
        E('RCApp.project.openings[0].width=2.4')
        check('Resizing a window does not resize or reframe the scene',delta(a,pix(1.5))==0)
        E('RCApp.project.openings[0].offset=1.25')
        check('Sliding a window reveals the existing scene rather than moving it',delta(a,pix(1.5))==0)
        E('RCApp.project.openings[0].bottom=1.0;RCApp.project.openings[0].height=1.2')
        check('Sill and opening-height edits do not move the horizon',delta(a,pix(1.5))==0)
        c=pix(1.5,z=1.3)
        E('RCApp.project.viewpoints[0].x=1.5;RCApp.project.viewpoints[0].y=.6')
        check('A window clipped by the viewport keeps its original vertical crop',delta(c,pix(1.5,z=1.3))<=2,[c,pix(1.5,z=1.3)])
        fixture();c=pix(5.5)
        E('RCApp.project.viewpoints[0].facing=17')
        check('Turning the viewpoint preserves the matte at the same world location',delta(c,pix(5.5))<=2)
        check('Export resolution does not change world-to-matte registration',delta(pix(5.5),pix(5.5,width=1440))<=2)
        E('RCApp.project.viewpoints[0].fov=110')
        check('Changing field of view does not re-fit the skyline per window',delta(c,pix(5.5))<=2)
    group('Shared horizontal and vertical registration',windows)
    def depth():
        fixture();E('RCApp.project.rooms[0].exterior.default.distance=2;RCApp.project.rooms[0].exterior.default.scale=1.5')
        a=pix(5.5);E('RCApp.project.viewpoints[0].x=4.7');b=pix(5.5)
        check('Nonzero setback produces coherent observer-relative parallax',abs(a['rgb'][0]-b['rgb'][0])>=5,[a,b])
        E('RCApp.project.rooms[0].exterior.default.distance=0');a=pix(5.5);E('RCApp.project.viewpoints[0].x=4');b=pix(5.5)
        check('Zero setback keeps the matte pinned to its side canvas',delta(a,b)<=1)
        E('RCApp.project.rooms[0].exterior.default.distance=2')
        landmark={'x':6,'y':-2}
        a=E('p=>pixelAtWorld(p,1.4)',landmark);E('RCApp.project.viewpoints[0].x=4.5');b=E('p=>pixelAtWorld(p,1.4)',landmark)
        check('The same external landmark remains the same across observer positions',delta(a,b)<=2,[a,b])
    group('Shared setback parallax',depth)
    def blocking():
        fixture();a=pix(3.9)
        check('An open exterior door reveals its own portion of the shared matte',a['meta']['kind']=='exterior' and 110<a['rgb'][0]<140,a)
        E('RCApp.project.openings[2].open=false');b=pix(3.9)
        check('A closed door fully occludes the shared exterior',b['meta']['kind']=='opening' and delta(a,b)>30)
        E('RCApp.project.openings[2].open=true');check('Reopening a door restores the same exterior crop',delta(a,pix(3.9))==0)
        check('The wall between openings continues to occlude the exterior',pix(3.1)['meta']['kind']=='wall')
        check('Window mullions remain solid foreground architecture',pix(2)['meta']['kind']=='opening')
        E('''()=>{const p=RCApp.project;RCCore.assignCover(p,p.viewpoints[0].id,{kind:'opening',id:p.openings[0].id},'edge');}''')
        probe=E('''()=>{const p=RCApp.project,v=p.viewpoints[0],q=RCCore.fpPoint(v,{x:1.5,y:0},1.4);return RCApp.renderer.probe(p,v,q,v.cover.source)}''')
        check('A skyline pixel never counts as assigned frame cover',probe['blocked']==False)
        probe=E('''()=>{const p=RCApp.project,v=p.viewpoints[0],q=RCCore.fpPoint(v,{x:2,y:0},1.4);return RCApp.renderer.probe(p,v,q,v.cover.source)}''')
        check('The actual window-frame pixel still counts as cover',probe['blocked']==True)
        E('''()=>{const p=RCApp.project,r=p.rooms[0],o=p.openings[0];const far=RCCore.addAdjoining(p,r.id,'N',4,3,0,'solid');far.wall.color='#2266bb';far.wall.finish='paint';}''')
        check('Adding an adjoining room replaces the exterior with real connected architecture',pix(1.5)['meta']['kind']!='exterior',pix(1.5))
        check('The still-exterior part of the original side keeps its matte',pix(5.5)['meta']['kind']=='exterior')
    group('Aperture masking, door states and cover',blocking)
    def split():
        fixture();E('''()=>{let p=RCApp.project,r=p.rooms[0];p.openings=[];let next=RCCore.addAdjoining(p,r.id,'N',4,3,4,'solid');next.wall.color='#445599';RCCore.createOpening(p,r.id,'N',.5,'passage',{width:7,height:p.wallHeight,trim:false});}''')
        check('One opening spanning exterior and shared wall segments shows matte only outside',pix(1.5)['meta']['kind']=='exterior' and pix(5.5)['meta']['kind']!='exterior',[pix(1.5),pix(5.5)])
        # A shared doorway with an outside window in the NEXT room uses that room's side.
        E('''()=>{let p=RCApp.project,r=p.rooms[1];r.exterior.default={...RCCore.backdrop('atlas'),fit:'stretch',offsetX:.1};RCCore.createOpening(p,r.id,'N',.1,'window',{width:3.8,height:2,bottom:.3,trim:false});}''')
        a=pix(5.5,y=-3)
        check('Looking through a room connection can reach the next room exterior',a['meta']['kind']=='exterior' and a['meta']['roomId']==E('RCApp.project.rooms[1].id'),a)
    group('Shared and exterior split wall spans',split)
    def fit_alpha():
        fixture();normal=pix(1.5)
        E('RCApp.project.rooms[0].exterior.default.alpha=0');zero=pix(1.5)
        check('Zero opacity removes the matte from rendering and cover picking',zero['meta'] is None or zero['meta']['kind']!='exterior',zero)
        E('RCApp.project.rooms[0].exterior.default.alpha=.5');half=pix(1.5)
        check('Matte opacity actually blends its pixels',max(abs(half['rgb'][i]-(normal['rgb'][i]+zero['rgb'][i])/2) for i in range(3))<=2,[normal,half,zero])
        E('RCApp.project.rooms[0].exterior.default.alpha=1;RCApp.project.rooms[0].exterior.default.offsetX=3')
        check('Panning outside image bounds does not repeat or smear the image',pix(1.5)['meta'] is None or pix(1.5)['meta']['kind']!='exterior')
        fixture();E('RCApp.project.rooms[0].exterior.default.scale=.25')
        check('Zoom-out reveals bounds instead of repeating full images per opening',pix(1.5)['meta'] is None or pix(1.5)['meta']['kind']!='exterior')
    group('Opacity and image bounds',fit_alpha)
    def all_sides():
        for side in ['N','E','S','W']:
            E('''arg=>{let p=makeMatteFixture(),r=p.rooms[0];p.openings=[];const len=['N','S'].includes(arg.side)?r.width:r.length;RCCore.createOpening(p,r.id,arg.side,.5,'window',{width:len-1,height:1.8,bottom:.4,trim:false});p.viewpoints=[];let v=RCCore.createViewpoint(p,{x:4,y:3},{x:4+({N:0,E:1,S:0,W:-1}[arg.side]),y:3+({N:-1,E:0,S:1,W:0}[arg.side])});v.fov=100;p.startViewId=v.id;return RCApp.applyBundle({project:p,assets:[arg.mat]});}''',{'side':side,'mat':mat})
            left,right={'N':((2,0),(6,0)),'E':((8,1.5),(8,4.5)),'S':((6,6),(2,6)),'W':((0,4.5),(0,1.5))}[side]
            a=pix(*left);b=pix(*right)
            check(side+' side matte has correct left/right handedness in first person',b['rgb'][0]-a['rgb'][0]>100,[a,b])
    group('All side orientations',all_sides)
    def iso():
        fixture()
        data=E('''()=>{const p=RCApp.project,R=RCApp.renderer;const c=document.createElement('canvas');c.width=1440;c.height=1080;R.drawIso(c.getContext('2d'),p,{grid:false,dimensions:false,cutaway:true});const ctx=c.getContext('2d');const sample=x=>{const q=RCCore.isoPoint(p,{x,y:0},1.4);return [...ctx.getImageData(Math.floor(q.x),Math.floor(q.y),1,1).data];};return [sample(1.5),sample(5.5)];}''')
        check('Isometric windows also show different crops of the same matte',data[1][0]-data[0][0]>80,data)
        # Fixed iso and straight first person must agree at the same world point with zero setback.
        a=pix(1.5,full=True)
        check('Isometric and first-person share zero-setback crop and glass tint',max(abs(data[0][i]-a['rgb'][i]) for i in range(3))<8,[data,a])
    group('Isometric shared matte',iso)
    def foreground():
        fixture()
        info=E('''async()=>{
          const p=RCCore.clone(RCApp.project),c=document.createElement('canvas');c.width=c.height=100;const g=c.getContext('2d');g.fillStyle='#20ed55';g.fillRect(0,0,100,100);g.clearRect(30,30,40,40);
          const a={id:'frame_fixture',name:'Transparent foreground fixture',width:100,height:100,src:c.toDataURL('image/png')};
          const o=RCCore.createObject(a,{x:4.9,y:1.8});Object.assign(o,{mount:.6,height:1.4,width:1.4,depth:.2,blocks:true});p.objects.push(o);
          await RCApp.applyBundle({project:p,assets:[...RCApp.assets,a]});const v=RCApp.project.viewpoints[0],R=RCApp.renderer;
          const hole=RCCore.fpPoint(v,o,1.3),edge=RCCore.fpPoint(v,{x:o.x-.6,y:o.y},1.3);
          return {hole:R.probe(RCApp.project,v,hole,{kind:'object',id:o.id}),edge:R.probe(RCApp.project,v,edge,{kind:'object',id:o.id})};
        }''')
        check('Transparent foreground openings still reveal the common exterior',info['hole']['meta']['kind']=='exterior' and not info['hole']['blocked'],info)
        check('Opaque foreground artwork remains in front of the shared matte',info['edge']['meta']['kind']=='object' and info['edge']['blocked'],info)
        fixture();a=pix(5.5);E('RCApp.project.viewpoints[0].eyeHeight=.85');b=pix(5.5)
        check('Crouch/rise changes the view without sliding the outside world',delta(a,b)<=2,[a,b])
        fixture()
        E('''async()=>{const p=RCCore.clone(RCApp.project),c=document.createElement('canvas');c.width=800;c.height=270;let g=c.getContext('2d');g.fillStyle='#20e855';g.fillRect(400,0,400,270);const a={id:'alpha_matte',name:'Alpha matte',src:c.toDataURL('image/png'),width:800,height:270};p.rooms[0].exterior.default.assetId=a.id;return RCApp.applyBundle({project:p,assets:[a]});}''')
        a=pix(1.5);b=pix(5.5)
        check('Matte PNG transparency is honored rather than rendered black',a['meta'] is None or a['meta']['kind']!='exterior',a)
        check('Opaque regions of the same transparent matte remain visible',b['meta']['kind']=='exterior' and b['rgb'][1]>200,b)
    group('Foreground and transparent matte rendering',foreground)
    def ui():
        fixture();page.locator('[data-panel="style"]').click()
        check('Inspector includes a full-side opening-layout preview',page.locator('.matte-side-preview').count()==1)
        check('Fit labels refer to side canvas, not individual openings','Fill side' in page.locator('[data-change="backdrop"][data-key="fit"]').inner_text())
        page.locator('#backdropTarget').select_option('N')
        check('Side editor displays inherited default image',page.locator('[data-change="backdrop"][data-key="assetId"]').input_value()=='atlas')
        x=page.locator('[data-change="backdrop"][data-key="offsetX"]');x.fill('.12');x.dispatch_event('change')
        check('Editing inherited side framing creates a real side override',E('RCApp.project.rooms[0].exterior.sides.N.assetId==="atlas"&&RCApp.project.rooms[0].exterior.sides.N.offsetX===.12'))
        check('Side override leaves room default untouched',E('RCApp.project.rooms[0].exterior.default.offsetX===0'))
        page.locator('[data-action="clear-matte"]').click()
        check('Use room default removes the override rather than copying pixels',E('!RCApp.project.rooms[0].exterior.sides.N'))
        # Click actual selected wall, then return to Style without deselecting it.
        page.locator('[data-panel="room"]').click();page.locator('[data-wall-side="N"]').click();page.locator('[data-panel="style"]').click();page.locator('#backdropTarget').select_option('default')
        x=page.locator('[data-change="backdrop"][data-key="scale"]');x.fill('1.3');x.dispatch_event('change')
        check('A previously selected wall cannot hijack room-default edits',E('RCApp.project.rooms[0].exterior.default.scale===1.3&&!RCApp.project.rooms[0].exterior.sides.N'))
        oid=E('RCApp.project.openings[1].id');E('id=>RCApp.selectOpening(id)',oid)
        page.locator('[data-action="edit-opening-matte"]').click()
        check('Window editor links to its shared side matte, not per-window art',page.locator('#backdropTarget').input_value()=='N')
        d=page.locator('[data-change="backdrop"][data-key="distance"]');d.fill('2');d.dispatch_event('change')
        check('Depth control persists in the side material',E('RCApp.project.rooms[0].exterior.sides.N.distance===2'))
        page.locator('#undoBtn').click();check('Undo restores the previous matte distance',E('(RCApp.project.rooms[0].exterior.sides.N?.distance??0)===0'))
        page.locator('#redoBtn').click();check('Redo restores the shared matte edit',E('RCApp.project.rooms[0].exterior.sides.N.distance===2'))
        with page.expect_download() as download:page.locator('#saveBtn').click()
        file=td/'saved.room.json';download.value.save_as(file)
        check('Saved project download contains shared-side matte data',json.loads(file.read_text())['project']['rooms'][0]['exterior']['sides']['N']['distance']==2)
        page.locator('#projectFile').set_input_files(str(file));page.wait_for_timeout(400)
        check('Real saved project reopens with the same side assignment',E('RCApp.project.rooms[0].exterior.sides.N.distance===2'))
    group('Shared matte authoring, undo and save/reopen',ui)
    def imports():
        E('RCApp.newProject(true)');page.locator('[data-panel="room"]').click();page.locator('[data-wall-side="N"]').click()
        with page.expect_file_chooser() as fc:page.locator('[data-action="import-selected-wall-matte"]').click()
        fc.value.set_files(str(td/'atlas.png'));page.wait_for_function('!!RCApp.project.rooms[0].exterior.sides.N?.assetId')
        check('Direct wall-side import stays assigned to the chosen wall',E('!!RCApp.project.rooms[0].exterior.sides.N.assetId&&!RCApp.project.rooms[0].exterior.default.assetId'))
        check('Direct wall-side import stays in the matching inspector',page.locator('[data-change="wallBackdrop"][data-key="assetId"]').count()==1)
        page.locator('[data-change="wallBackdrop"][data-key="offsetY"]').fill('.1');page.locator('[data-change="wallBackdrop"][data-key="offsetY"]').dispatch_event('change')
        check('Wall inspector framing targets the correct side',E('RCApp.project.rooms[0].exterior.sides.N.offsetY===.1'))
    group('Direct import targeting',imports)
    check('No unhandled JavaScript errors in shared-matte tests',len(errors)==0,errors)
    report={'launch':launch,'passed':sum(t['passed'] for t in results),'failed':sum(not t['passed'] for t in results),'tests':results}
    (ROOT/'tests/shared_matte_browser_results.json').write_text(json.dumps(report,indent=2))
    print(json.dumps({k:report[k] for k in ('launch','passed','failed')}),flush=True)
    browser.close()
    if report['failed']:raise SystemExit(1)
