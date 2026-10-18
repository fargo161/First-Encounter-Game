import json, pathlib, os
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
HTML=(ROOT/'Room_Creator.html').read_text(encoding='utf-8')
results=[]
def check(name,ok):
    results.append({'name':name,'passed':bool(ok)});print(('PASS ' if ok else 'FAIL ')+name)
with sync_playwright() as pw:
    errors=[]
    browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=True)
    page=browser.new_page(viewport={'width':1600,'height':1000})
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.set_content(HTML,wait_until='load');page.wait_for_function('window.RCApp!==undefined');page.wait_for_timeout(200)
    E=lambda s: page.evaluate(s)
    check('Editor identifies project format 10',E('RCApp.project.version===10'))
    check('Story manager starts with Ground only',E('RCApp.project.stories.length===1&&RCApp.project.stories[0].index===0'))
    check('Manual construction tools are visible',all(page.locator(f'[data-tool="{x}"]').count()>0 for x in ['floorsection','freewall','ceilingcut','ceilingpatch','pillar']))
    # Build a representative v0.10 scene directly through authoritative core calls.
    E('''()=>{const p=RCApp.project;const r=p.rooms[0];RCCore.addStory(p,'Gallery');r.openAbove=true;RCCore.makeFloorSection(p,1,{x:0,y:0},{x:3,y:2},{name:'Upper deck'});RCCore.createFreeWall(p,1,{x:0,y:2},{x:3,y:2},{roomId:r.id,name:'Gallery edge wall'});RCCore.createPillar(p,0,{x:9,y:2},{name:'Outside support',height:4.2});RCCore.createPillar(p,0,{x:1.5,y:3.3},{name:'Visible support',height:4.2});RCCore.makeCeilingRect(p,r.id,{x:2,y:2},{x:5,y:5},'cut');const patch=RCCore.makeCeilingRect(p,r.id,{x:3,y:3},{x:4,y:4},'patch');patch.surface.color='#4b6072';RCApp.refresh();}''')
    check('Floor section exists on story above',E('RCApp.project.floorSections.length===1&&RCApp.project.floorSections[0].story===1'))
    check('Free wall can exist on story with no room',E('RCApp.project.partitions.some(q=>q.free&&q.story===1)'))
    check('Pillar can exist outside room footprint',E('RCApp.project.pillars.some(q=>q.x>8)'))
    check('Ceiling cut and patch coexist',E('RCApp.project.ceilingCuts.length===1&&RCApp.project.ceilingPatches.length===1'))
    check('Ceiling patch restores only its area',E('(()=>{const r=RCApp.project.rooms[0];return !RCCore.ceilingExistsAt(RCApp.project,r,2.5,2.5)&&RCCore.ceilingExistsAt(RCApp.project,r,3.5,3.5)})()'))
    check('Portable validation accepts the construction scene',E('RCCore.validateBundle({project:RCApp.project,assets:RCApp.assets}).project.version===10'))
    # Isometric render should include added story content and pillar without crashing.
    iso=E('(()=>{const c=document.createElement("canvas");c.width=1440;c.height=1080;RCApp.renderer.drawIso(c.getContext("2d"),RCApp.project,{grid:false,dimensions:false,cutaway:false});return c.toDataURL().length})()')
    check('Isometric renderer includes new construction without error',iso>1000)
    fp=E('(()=>{const p=RCApp.project,r=p.rooms[0];const v=RCCore.createViewpoint(p,{x:1.5,y:5.5},{x:1.5,y:0.5},"Construction view",r.id);const out=RCApp.renderer.drawFP(p,v,{width:640});return {floorSection:out.tags.some(t=>t?.kind==="floorSection"),pillar:out.tags.some(t=>t?.kind==="pillar")}})()')
    check('Lower first-person view can see upper manual floor underside',fp['floorSection'])
    check('Pillars participate in first-person architecture picking',fp['pillar'])
    # UI story switch.
    page.locator('[data-pane="architecture"]').click();page.wait_for_timeout(50)
    check('Quick story buttons show Ground and Gallery',page.locator('[data-story]').count()>=2)
    page.locator('[data-story="1"]').click();page.wait_for_timeout(50)
    check('Story selection updates active story',E('RCApp.state.activeStory===1'))
    check('No unhandled browser errors',len(errors)==0)
    shot=ROOT/'previews'/'v0_10_construction.png';page.screenshot(path=str(shot),full_page=True)
    browser.close()
summary={'passed':sum(x['passed'] for x in results),'failed':sum(not x['passed'] for x in results),'errors':errors,'results':results}
(ROOT/'tests'/'construction_v10_browser_results.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
print(json.dumps({'passed':summary['passed'],'failed':summary['failed']}))
raise SystemExit(1 if summary['failed'] else 0)
