"""v0.10 multi-story browser smoke checks against the self-contained HTML."""
import json, pathlib, tempfile, os
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
HTML=(ROOT/'Room_Creator.html').read_text(encoding='utf-8')
results=[]
def check(name,ok):
    results.append({'name':name,'passed':bool(ok)})
    print(('PASS ' if ok else 'FAIL ')+name)

def main():
  errors=[]
  with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=True)
    page=browser.new_page(viewport={'width':1440,'height':900})
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.set_content(HTML,wait_until='load')
    page.wait_for_timeout(300)
    E=lambda s: page.evaluate(s)
    check('Editor identifies itself as v0.10', '0.10' in page.title())
    check('New project starts with one Ground room', E('RCApp.project.version===10&&RCApp.project.rooms.length===1&&RCApp.project.rooms[0].story===0'))
    check('Build panel exposes Room above', page.get_by_text('Room above',exact=False).count()>0)
    check('Build panel exposes contiguous story controls', page.get_by_text('Next story',exact=False).count()>0 and page.get_by_text('Rename',exact=False).count()>0)
    check('Ground room inspector exposes Open ceiling control', page.get_by_text('Open ceiling / atrium above this room',exact=False).count()>0)
    # Load example through exposed application action to avoid brittle modal timing.
    page.evaluate('async()=>{await RCApp.applyBundle({project:RCCore.multiStoryExample(),assets:[]});}')
    page.wait_for_timeout(250)
    check('Example contains Ground and Floor 2', E('RCCore.storyList(RCApp.project).join(",")==="0,1"'))
    check('Example contains a true open-above atrium', E('RCApp.project.rooms.some(r=>r.story===0&&r.openAbove)'))
    check('Example contains upper balcony edges', E('RCApp.project.rooms.some(r=>r.story===1&&r.balconySides.length>0)'))
    check('Lower and upper viewpoints retain distinct floor elevations', E('(()=>{const v=RCApp.project.viewpoints;return v.some(x=>x.story===0&&x.floorZ===0)&&v.some(x=>x.story===1&&x.floorZ>0)})()'))
    check('Example contains an explicit cross-story route', E('(()=>{for(const l of RCApp.project.links){const a=RCApp.project.viewpoints.find(v=>v.id===l.a),b=RCApp.project.viewpoints.find(v=>v.id===l.b);if(a&&b&&a.story!==b.story)return true}return false})()'))
    # Force lower FP scene and check renderer returns nonempty architecture.
    fp=E('(()=>{const v=RCApp.project.viewpoints.find(v=>v.story===0);const r=RCApp.renderer.drawFP(RCApp.project,v,{width:640});return {w:r.W,h:r.H,finite:[...r.depth].some(Number.isFinite),tags:r.tags.length}})()')
    check('Lower-floor first-person renderer produces architecture', fp['w']==640 and fp['h']>300 and fp['finite'] and fp['tags']>1)
    # Add an overlapping upper room in code and verify plan retains both rooms rather than collision.
    check('Overlapping upper room can be authored without moving ground room', E('(()=>{const p=RCCore.newProject(),g=p.rooms[0];const before=[g.x,g.y,g.width,g.length];const u=RCCore.addRoomAbove(p,g.id,{});return p.rooms.length===2&&u.story===1&&JSON.stringify(before)===JSON.stringify([g.x,g.y,g.width,g.length])})()'))
    # Select upper room and ensure room inspector shows balcony authoring controls.
    E('(()=>{const r=RCApp.project.rooms.find(r=>r.story===1);RCApp.selectRoom(r.id)})()')
    page.wait_for_timeout(100)
    check('Upper-room inspector exposes balcony/gallery controls', page.get_by_text('Balcony / gallery edges',exact=False).count()>0)
    # Save bundle validates current example as format 10.
    check('Current example validates as portable format 10', E('RCCore.validateBundle({project:RCApp.project,assets:RCApp.assets}).project.version===10'))
    check('No unhandled JavaScript errors in multi-story smoke test', len(errors)==0)
    out=ROOT/'previews'/'Multi_story_browser_smoke.png'
    page.screenshot(path=str(out),full_page=True)
    browser.close()
  summary={'passed':sum(r['passed'] for r in results),'failed':sum(not r['passed'] for r in results),'results':results,'errors':errors}
  (ROOT/'tests'/'multistory_browser_results.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
  print(json.dumps({'passed':summary['passed'],'failed':summary['failed']}))
  raise SystemExit(1 if summary['failed'] else 0)
if __name__=='__main__':main()
