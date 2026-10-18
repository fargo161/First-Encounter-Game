from rc_test_runtime import rc_path, rc_uri, rc_output, rc_prior
import asyncio, json
from playwright.async_api import async_playwright
OUT=rc_output('shots')
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); pg = await b.new_page(viewport={'width': 1500, 'height': 900})
        logs=[]; pg.on('pageerror', lambda e: logs.append('PAGEERROR '+str(e))); pg.on('console', lambda m: logs.append(m.text) if m.type=='error' else None)
        await pg.goto(rc_uri('Room_Creator.html')); await pg.wait_for_timeout(300)
        # make the starter room bigger: 12 x 10
        await pg.evaluate("()=>RCApp.mutate(()=>{const r=RCApp.project.rooms[0];r.width=12;r.length=10;},'size')")
        # trial every shape via the API
        for shape in ['full','setback','overhang','ring','deck']:
            for edges in ['room','parapet','none']:
                r = await pg.evaluate("""([shape,edges])=>{const o={name:'Floor 2',base:'all',shape,edges,setback:1,overhang:1.5,ring:2.5,sides:{N:false,E:true,S:true,W:false},copyLook:true,stairs:true};const t=RCApp.ext().stories.buildUpTrial(o);return t.error?('ERR '+t.error):JSON.stringify({rooms:t.info.rooms.length,floors:t.info.floors.length,walls:t.info.walls.length,stairs:!!t.info.stairs,note:t.info.notes[0]||''});}""", [shape, edges])
                print(f'{shape:9} {edges:8}', r)
        # open the wizard through the UI
        await pg.click('[data-action="add-story"]'); await pg.wait_for_timeout(400)
        await pg.screenshot(path=f'{OUT}/st1_wizard.png')
        await pg.check('input[name=buShape][value=ring]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{OUT}/st2_wizard_ring.png')
        await pg.check('input[name=buShape][value=full]'); await pg.wait_for_timeout(200)
        await pg.click('#buCreate'); await pg.wait_for_timeout(600)
        st = await pg.evaluate("()=>{const p=RCApp.project;return {stories:p.stories.length,active:RCApp.state.activeStory,rooms:p.rooms.map(r=>r.name+'@'+r.story),stairs:p.stairs.map(s=>s.dir+' '+s.x.toFixed(2)+','+s.y.toFixed(2)+' '+s.width.toFixed(2)+'x'+s.length.toFixed(2)),cuts:p.floorCuts.length,ceil:p.ceilingCuts.length,rails:p.partitions.filter(q=>q.stairId).length}}")
        print('after build', st)
        await pg.screenshot(path=f'{OUT}/st3_built.png')
        # walk up the stairs in first person
        await pg.evaluate("()=>{const s=RCApp.project.stairs[0];RCApp.selectStory(0);}"); await pg.wait_for_timeout(300)
        await pg.evaluate("()=>{const A=RCApp;A.ext();}")
        sid = await pg.evaluate("()=>RCApp.project.stairs[0].id")
        await pg.evaluate("id=>{RCApp.mutate(()=>{},'noop');}", sid)
        # select stairs via map click on its centre
        c = await pg.evaluate("()=>{const s=RCApp.project.stairs[0];return RCApp.projectPoint({x:s.x+s.width/2,y:s.y+s.length/2},0)}")
        await pg.mouse.click(c['x'], c['y']); await pg.wait_for_timeout(300)
        print('selected', await pg.evaluate("()=>JSON.stringify(RCApp.state.selection)"))
        await pg.screenshot(path=f'{OUT}/st4_stairs_selected.png')
        await pg.click('[data-action="walk-stairs"]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{OUT}/st5_stairs_fp.png')
        await pg.keyboard.down('KeyW'); await pg.wait_for_timeout(5000); await pg.keyboard.up('KeyW'); await pg.wait_for_timeout(300)
        print('free cam after W', await pg.evaluate("()=>{const f=RCApp.freeCam;return f&&[f.x.toFixed(2),f.y.toFixed(2),f.story,f.floorZ.toFixed(2),f.onStair]}"))
        await pg.screenshot(path=f'{OUT}/st6_upstairs.png')
        await pg.keyboard.press('1'); await pg.wait_for_timeout(300)
        # stairs tool drag on story 0 (needs story above: exists)
        await pg.evaluate("()=>RCApp.selectStory(0)"); await pg.wait_for_timeout(300)
        await pg.click('[data-tool="stairs"]'); await pg.wait_for_timeout(200)
        a = await pg.evaluate("()=>RCApp.projectPoint({x:8,y:8.5},0)"); bpt = await pg.evaluate("()=>RCApp.projectPoint({x:8,y:3},0)")
        await pg.mouse.move(a['x'],a['y']); await pg.mouse.down(); await pg.mouse.move(bpt['x'],bpt['y'],steps=6); await pg.wait_for_timeout(100)
        await pg.screenshot(path=f'{OUT}/st7_stairs_drag.png')
        await pg.mouse.up(); await pg.wait_for_timeout(400)
        print('stairs now', await pg.evaluate("()=>RCApp.project.stairs.map(s=>s.dir+' '+s.x.toFixed(2)+','+s.y.toFixed(2)+' '+s.width.toFixed(2)+'x'+s.length.toFixed(2))"))
        # floor hole on story 1
        await pg.keyboard.press('PageUp'); await pg.wait_for_timeout(400)
        print('active after PgUp', await pg.evaluate("()=>RCApp.state.activeStory"))
        await pg.click('[data-tool="floorcut"]'); await pg.wait_for_timeout(200)
        a = await pg.evaluate("()=>RCApp.projectPoint({x:3,y:2},1)"); bpt = await pg.evaluate("()=>RCApp.projectPoint({x:5,y:4},1)")
        await pg.mouse.click(a['x'],a['y']); await pg.wait_for_timeout(150); await pg.mouse.click(bpt['x'],bpt['y']); await pg.wait_for_timeout(400)
        print('holes', await pg.evaluate("()=>RCApp.project.floorCuts.filter(c=>!c.stairId).map(c=>[c.x,c.y,c.width,c.length])"), 'ceil cuts', await pg.evaluate("()=>RCApp.project.ceilingCuts.filter(c=>c.floorCutId).length"))
        await pg.screenshot(path=f'{OUT}/st8_hole.png')
        print('\n'.join(logs[:20]))
        await b.close()
asyncio.run(main())
