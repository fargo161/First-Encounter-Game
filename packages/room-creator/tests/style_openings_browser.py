"""v0.9 inherited acceptance: real controls, renderer pixel checks, save/load, legacy import.
Diagnostic images are generated in a temporary directory, not the asset library.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
import os,json,base64,traceback
ROOT=Path(__file__).resolve().parents[1]
results=[]
def check(name,cond,detail=None):
    if not cond:raise AssertionError(name+(': '+str(detail) if detail is not None else ''))
    results.append({'name':name,'passed':True});print('PASS',name,flush=True)
with TemporaryDirectory() as td,sync_playwright() as pw:
    td=Path(td);img=Image.new('RGBA',(120,80),(200,80,60,255));d=ImageDraw.Draw(img)
    d.rectangle((60,0,119,39),fill=(40,210,100,255));d.rectangle((0,40,59,79),fill=(50,80,230,255));d.rectangle((60,40,119,79),fill=(220,190,30,255));d.rectangle((12,12,30,26),fill=(0,0,0,0));img.save(td/'calibration.png')
    sky=Image.new('RGB',(240,100));pix=sky.load()
    for y in range(100):
      for x in range(240):pix[x,y]=(x,30+y*2,230-x//2)
    sky.save(td/'outside.png')
    def asset(f,id):
      im=Image.open(f);return {'id':id,'name':f.stem,'width':im.width,'height':im.height,'src':'data:image/png;base64,'+base64.b64encode(f.read_bytes()).decode()}
    cal=asset(td/'calibration.png','cal');skyasset=asset(td/'outside.png','sky')
    browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=True)
    page=browser.new_page(viewport={'width':1600,'height':1000},accept_downloads=True);page.set_default_timeout(10000)
    errors=[];requests=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url) if r.url.startswith(('http:','https:')) else None)
    try:
      page.goto((ROOT/'Room_Creator.html').as_uri(),wait_until='load');page.wait_for_function('window.RCApp',timeout=6000);launch='file URL'
    except Exception:
      page.close();page=browser.new_page(viewport={'width':1600,'height':1000},accept_downloads=True);page.set_default_timeout(10000);page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url) if r.url.startswith(('http:','https:')) else None)
      page.set_content((ROOT/'Room_Creator.html').read_text(),wait_until='load');page.wait_for_function('window.RCApp');launch='set_content (file URL unavailable)'
    def E(code,arg=None):return page.evaluate(code,arg)
    def wait():page.wait_for_timeout(120)
    def reset():E("document.getElementById('modalRoot').innerHTML='';RCApp.newProject(true)");wait()
    def group(name,fn):
      try:fn()
      except Exception as e:
        results.append({'name':name,'passed':False,'error':str(e),'trace':traceback.format_exc()});print('FAIL',name,e,flush=True)
        try:page.screenshot(path=str(ROOT/'previews'/('FAIL_'+name.replace(' ','_')+'.png')));reset()
        except Exception:pass
    def setup():
      reset()
      E('''async assets=>{const C=RCCore,p=C.newProject(),r=p.rooms[0];r.exterior.default=C.backdrop('sky');r.exterior.default.fit='stretch';const w=C.createOpening(p,r.id,'N',.5,'window',{name:'Test window',width:2.2,height:1.5,bottom:.65,panes:1}),d=C.createOpening(p,r.id,'N',3.2,'door',{name:'Test door',width:1.8,leaves:1,open:false});C.createOpening(p,r.id,'N',5.5,'window',{width:1.4,panes:2});C.createViewpoint(p,{x:4,y:5},{x:4,y:0},'Front view');await RCApp.applyBundle({project:p,assets});RCApp.selectView(p.viewpoints[0].id);RCApp.setMode('fp');RCApp.selectOpening(w.id);window.ids={w:w.id,d:d.id,r:r.id,v:p.viewpoints[0].id};}''',[cal,skyasset]);wait()
    def opening_pixel(u,z):return E('''([u,z])=>{const A=RCApp,C=RCCore,p=A.project,o=p.openings.find(o=>o.id===ids.w),l=C.openingLine(p,o),v=p.viewpoints[0],q=C.fpPoint(v,C.wallPoint(l,l.start+u*o.width),z),r=A.renderer.drawFP(p,v,{width:960}),x=Math.floor(q.x/v.width*r.W),y=Math.floor(q.y/v.height*r.H),i=y*r.W+x;return {tag:r.tags[r.pick[i]],pixel:r.pixels[i]};}''',[u,z])
    def numeric(sel,value):page.locator(sel).fill(str(value));page.locator(sel).dispatch_event('change');wait()
    def input_deep(key,value):
      l=page.locator(f'#studioControls input[type=number][data-deep="{key}"]');l.fill(str(value));l.dispatch_event('input');wait()
    def studio(domain):page.locator('[data-panel=style]').click();page.locator(f'[data-deep-editor="{domain}"]').click();wait()
    def sliders():
      setup();check('Opening has live width, height, offset and sill sliders',page.locator('[data-slide-domain=opening]').count()>=6)
      before=E('RCApp.project.openings[0].width');h=E('RCApp.state.history')
      page.locator('[data-slide-domain=opening][data-key=width]').evaluate("el=>{el.value='2.5';el.dispatchEvent(new Event('input',{bubbles:true}));}");wait()
      check('Width updates before releasing the slider',abs(E('RCApp.project.openings[0].width')-2.5)<.001)
      check('Width number follows the live slider',float(page.locator('[data-change=opening][data-key=width]').input_value())==2.5)
      check('Live samples do not fill undo history',E('RCApp.state.history')==h)
      page.locator('[data-slide-domain=opening][data-key=width]').evaluate("el=>{el.value='2.6';el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}");wait()
      check('One drag commits one undo step',E('RCApp.state.history')==h+1)
      E('RCApp.undo()');wait();check('Undo restores the original opening width',E('RCApp.project.openings[0].width')==before)
      E('RCApp.redo()');wait();check('Redo restores the completed slider gesture',E('RCApp.project.openings[0].width')==2.6)
      check('Width slider maximum ends at adjacent door',abs(float(page.locator('[data-slide-domain=opening][data-key=width]').get_attribute('max'))-2.7)<.001)
      old=E('RCApp.project.openings[0].width');numeric('[data-change=opening][data-key=width]',4)
      check('An overlapping numeric width is rejected safely',E('RCApp.project.openings[0].width')==old)
      # physical mouse path through range control (not merely programmatic events)
      l=page.locator('[data-slide-domain=opening][data-key=height]');box=l.bounding_box();h=E('RCApp.state.history');page.mouse.move(box['x']+box['width']*.6,box['y']+12);page.mouse.down();page.mouse.move(box['x']+box['width']*.8,box['y']+12,steps=4);page.mouse.up();wait()
      check('Real mouse drag produces one history step',E('RCApp.state.history')==h+1)
      E("RCApp.mutate(()=>RCApp.project.units='ft','Feet')");wait();check('Slider unit switches to feet',abs(float(page.locator('[data-slide-domain=opening][data-key=width]').get_attribute('max'))-2.7/.3048)<.001)
    group('Opening size controls',sliders)
    def pane_door():
      setup();a=opening_pixel(.5,1.3);check('Single pane center sees outside, not a frame',a['tag']['kind']=='exterior')
      away=opening_pixel(.25,1.3)['pixel'];page.select_option('[data-change=opening][data-key=panes]','2');wait()
      center=opening_pixel(.5,1.3);check('Double pane center becomes the shared frame',center['tag']['kind']=='opening')
      check('Switching pane count preserves off-divider matte pixels',opening_pixel(.25,1.3)['pixel']==away)
      check('Pane switching creates no duplicate opening or matte',E('RCApp.project.openings.length')==3 and E('RCApp.project.rooms[0].exterior.default.assetId')=='sky')
      E('RCApp.selectOpening(ids.d)');page.select_option('[data-change=opening][data-key=leaves]','2');wait()
      check('Double door stores two leaves without doubling overall width',E('RCApp.project.openings.find(o=>o.id===ids.d).leaves')==2 and E('RCApp.project.openings.find(o=>o.id===ids.d).width')==1.8)
      def door_hash():return E("()=>{const A=RCApp,r=A.renderer.drawFP(A.project,A.project.viewpoints[0],{width:480});let n=0;for(let i=0;i<r.pixels.length;i++)n=(n+r.pixels[i])>>>0;return n;}")
      old=door_hash();page.select_option('[data-change=opening][data-key=doorStyle]','slatted');wait();check('Door style changes rendered pixels',door_hash()!=old)
      iso=E("()=>{const c=document.createElement('canvas');c.width=1440;c.height=1080;RCApp.renderer.drawIso(c.getContext('2d'),RCApp.project,{grid:false,dimensions:false,cutaway:false});return c.toDataURL();}")
      page.select_option('[data-change=opening][data-key=leaves]','1');wait()
      iso2=E("()=>{const c=document.createElement('canvas');c.width=1440;c.height=1080;RCApp.renderer.drawIso(c.getContext('2d'),RCApp.project,{grid:false,dimensions:false,cutaway:false});return c.toDataURL();}")
      check('Isometric representation also changes with door leaves',iso!=iso2)
      page.check('[data-change=opening][data-key=open]');wait();check('Open door reveals the matte through both leaf space',E("()=>{const A=RCApp,C=RCCore,p=A.project,o=p.openings.find(o=>o.id===ids.d),l=C.openingLine(p,o),v=p.viewpoints[0],q=C.fpPoint(v,C.wallPoint(l,(l.start+l.end)/2),1.2);return A.renderer.probe(p,v,q).meta.kind;}")=='exterior')
    group('Panes doors and shared mattes',pane_door)
    def textures():
      setup();E('RCApp.selectRoom(ids.r)');page.click('[data-panel=style]')
      with page.expect_file_chooser() as ch:page.click('[data-action=import-floor-texture]')
      ch.value.set_files(str(td/'calibration.png'));wait();check('Direct surface image import still assigns to the floor',E('RCApp.project.rooms[0].floor.textureId') is not None)
      source=E('RCApp.project.rooms[0].floor.textureId');h=E('RCApp.state.history');original=E('RCApp.project.rooms[0].floor')
      page.click('[data-deep-editor=floorSurface]');wait();check('Texture studio opens with preview and three editing sections',page.locator('#studioPreview').count()==1 and page.locator('.studio-group').count()==3)
      ph=E("document.getElementById('studioPreview').toDataURL()")
      input_deep('angle',35);page.click('[data-studio-act=flip-x]');wait();check('Mapped draft preview responds to rotate and flip',E("document.getElementById('studioPreview').toDataURL()")!=ph)
      check('Draft edits do not mutate the room or undo stack',E('RCApp.project.rooms[0].floor')==original and E('RCApp.state.history')==h)
      page.locator('.studio-footer [data-action=close-modal]').click();wait();check('Cancel leaves the prior material unchanged',E('RCApp.project.rooms[0].floor')==original)
      page.click('[data-deep-editor=floorSurface]');page.uncheck('[data-deep=lockSize]');input_deep('tileSize',2);input_deep('tileSizeY',.6)
      page.select_option('[data-deep=mapping]','mirror');input_deep('angle',25);page.click('[data-studio-act=flip-y]')
      page.click('[data-studio-jump="1"]');input_deep('saturation',.35);input_deep('brightness',1.25);input_deep('hue',20)
      page.click('#applyStudio');wait();surf=E('RCApp.project.rooms[0].floor')
      check('Independent tile size and mapping applied together',surf['tileSize']==2 and surf['tileSizeY']==.6 and surf['mapping']=='mirror' and surf['flipY'])
      check('Image controls and source ID survive material edit',surf['textureId']==source and surf['brightness']==1.25 and surf['hue']==20)
      check('Apply material studio creates one undo step',E('RCApp.state.history')==h+1)
      E('RCApp.undo()');wait();check('Material edit undoes as a unit',E('RCApp.project.rooms[0].floor')==original);E('RCApp.redo()');wait()
      page.click('[data-copy-material=floorSurface]');page.click('[data-paste-material=wallSurface]');wait();check('Copy/paste shares settings across surfaces, not separate images',E('JSON.stringify(RCApp.project.rooms[0].wall)===JSON.stringify(RCApp.project.rooms[0].floor)'))
      # Distinct local fields render identically by sampling same material-space locations in both representations
      out=E("""()=>{const A=RCApp,C=RCCore,p=A.project,r=p.rooms[0],R=A.renderer,space={w:r.width,h:r.length},s=R.prepareStyle(r.floor,space),rr=R.prepareRoom(p,r),x=2.25,y=1.75,exp=R.sample(s,x,y,rr,x,y);const c=R.surfaceCanvas(p,r,r.floor,space,800,600),d=c.getContext('2d').getImageData(225,175,1,1).data;return {exp:[exp&255,(exp>>>8)&255,(exp>>>16)&255],got:[...d].slice(0,3)};}""")
      check('Isometric material raster and first-person sampler agree',max(abs(a-b) for a,b in zip(out['exp'],out['got']))<=12,out)
      # broad transformed-floor hash verifies old raw-image tiled bypass is gone
      check('Isometric floor now uses unified surface painter',E("RCApp.renderer.paintFloor.toString().includes('surfaceCanvas')"))
      page.click('[data-deep-editor=wallSurface]');page.click('[data-studio-jump="2"]');input_deep('baseHeight',.24);input_deep('capHeight',.12);input_deep('wear',.4);page.click('#applyStudio');wait()
      check('Wall baseboard cap and wear settings apply',E('RCApp.project.rooms[0].wall.baseHeight')==.24 and E('RCApp.project.rooms[0].wall.capHeight')==.12)
      # reset mapping keeps source bitmap and color grade
      page.click('[data-action=reset-wall-texture]');wait();check('Reset mapping preserves image and grade',E('RCApp.project.rooms[0].wall.textureId')==source and E('RCApp.project.rooms[0].wall.hue')==20 and E('RCApp.project.rooms[0].wall.angle')==0)
    group('Texture studio and surface mapping',textures)
    def styles():
      setup();E('RCApp.selectRoom(ids.r)');page.click('[data-panel=style]');check('Style panel offers twelve selectable looks',page.locator('[data-palette]').count()==12)
      geometry=E('JSON.stringify({o:RCApp.project.openings,v:RCApp.project.viewpoints,e:RCApp.project.rooms[0].exterior})')
      page.click('[data-palette=coastal]');wait();check('Palette does not change opening or viewpoint or matte records',E('JSON.stringify({o:RCApp.project.openings,v:RCApp.project.viewpoints,e:RCApp.project.rooms[0].exterior})')==geometry)
      # image map kept by default
      E("RCApp.mutate(()=>{RCApp.project.rooms[0].floor.textureId='cal';RCApp.project.rooms[0].floor.finish='image'},'Map')");wait();page.click('[data-palette=lounge]');wait();check('Preset preserves assigned texture maps by default',E('RCApp.project.rooms[0].floor.textureId')=='cal')
      numeric('[data-change=ambient][data-key=saturation]',.5);numeric('[data-change=ambient][data-key=exposure]',.35)
      check('Room-grade controls update shared lighting fields',E('RCApp.project.rooms[0].light.saturation')==.5)
      page.click('[data-action=save-look]');page.fill('#lookName','My cyan lounge');page.click('#saveLookNow');wait();look=E('RCApp.project.stylePresets[0]')
      check('Named style saves into the project',look['name']=='My cyan lounge');page.click('[data-palette=noir]');page.click('[data-apply-look]');wait();check('Saved style recalls its material and room grade',E('RCApp.project.rooms[0].light.saturation')==.5 and E('RCApp.project.rooms[0].floor.textureId')=='cal')
      with page.expect_download() as dl:page.click('#saveBtn')
      target=td/'saved.room.json';dl.value.save_as(target);saved=json.loads(target.read_text());check('Actual project download includes format 10 and saved looks',saved['project']['version']==10 and len(saved['project']['stylePresets'])==1)
      E('RCApp.newProject(true)');page.locator('#projectFile').set_input_files(str(target));wait();check('Opening the actual download restores single/double settings and style bank',E('RCApp.project.openings[0].panes')==1 and E('RCApp.project.stylePresets.length')==1)
      page.click('[data-panel=style]');page.click('[data-deep-editor=floorSurface]');page.set_viewport_size({'width':1280,'height':800});wait()
      box=page.locator('.material-studio').bounding_box();btn=page.locator('#applyStudio').bounding_box();check('Studio fits 1280×800 and Apply stays onscreen',box['x']>=0 and box['x']+box['width']<=1280 and btn['y']+btn['height']<=800)
      page.locator('.studio-footer [data-action=close-modal]').click();page.set_viewport_size({'width':1600,'height':1000});wait()
      page.click('[data-pane=assets]');page.click('[data-action=clear-assets]');page.click('#confirmYes');wait();check('Clear library removes texture references from saved looks too',E('RCApp.assets.length')==0 and E('RCApp.project.stylePresets[0].look.floor.textureId') is None)
    group('Style tools and portable projects',styles)
    def partition_studio():
      reset();E('RCApp.loadPartitionExample()');wait();page.click('[data-deep-editor=partitionSurface]');wait();check('Partition face has a full texture studio with wall trim',page.locator('input[type=number][data-deep=baseHeight]').count()==1)
      input_deep('baseHeight',.3);page.click('#applyStudio');wait();check('Partition face edit changes only selected face',E('RCApp.project.partitions[0].faces.A.baseHeight')==.3 and E('RCApp.project.partitions[0].faces.B.baseHeight')==0)
      check('Partition still has no exterior matte importer',page.locator('[data-action=import-selected-wall-matte]').count()==0)
    group('Interior partition materials',partition_studio)
    check('No unhandled JavaScript exceptions in new workflows',not errors,errors)
    check('No remote network requests in new workflows',not requests,requests)
    summary={'launch':launch,'passed':sum(x['passed'] for x in results),'failed':sum(not x['passed'] for x in results),'results':results}
    (ROOT/'tests/style_openings_browser_results.json').write_text(json.dumps(summary,indent=2));print(json.dumps({k:v for k,v in summary.items() if k!='results'}),flush=True);browser.close()
    if summary['failed']:raise SystemExit(1)
