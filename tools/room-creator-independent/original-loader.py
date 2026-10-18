import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
W=Path(__file__).resolve().parent;O=W.parents[1]/'outputs/Room_Creator_v0_14_1_Independent_Audit'
async def main():
 async with async_playwright() as pw:
  b=await pw.chromium.launch();p=await b.new_page();await p.goto('http://127.0.0.1:8783/original/Room_Creator.html')
  r=await p.evaluate(r'''async()=>{const A=RCAssets;await A.connectUrl('/lib/');const id='lp_furniture_chairs_mesh_chair_wood_01',P=A.state.provider,orig=P.get.bind(P),path=A.entry(id).working_path;let calls=0;P.get=async rel=>{if(rel===path&&++calls===1)throw Error('independent one-time read failure');return orig(rel);};const t=A.template(id),start=performance.now();while(t.status==='loading'&&performance.now()-start<5000)await new Promise(r=>setTimeout(r,20));P.get=orig;return {id,path,status:t.status,error:t.error,calls,waitForModelsAvailable:typeof A.waitForModels==='function',retryAvailable:typeof A.retryTemplate==='function'};}''')
  (O/'original-loader-negative-control.json').write_text(json.dumps(r,indent=2));print(json.dumps(r));await b.close()
asyncio.run(main())
