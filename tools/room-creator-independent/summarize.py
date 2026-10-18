from pathlib import Path
import hashlib,json,zipfile,sys,re,importlib.metadata
W=Path(__file__).resolve().parent;B=W.parents[1];O=B/'outputs/Room_Creator_v0_14_1_Independent_Audit';C=W/'candidate/Room_Creator_v0_14_1_remediation_candidate';OR=W/'original/Room_Creator_v0_14_asset_library'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(n,x):(O/n).write_text(json.dumps(x,indent=2),encoding='utf-8')
maps=[]
with zipfile.ZipFile('C:/Users/mcdon/Downloads/Room_Creator_v0_13_1_route_prototype.zip') as z:
 for n in z.namelist():
  if '/examples/' in n and n.endswith('.room.json'):
   name=n.split('/')[-1];h=hashlib.sha256(z.read(n)).hexdigest();q=C/'examples'/name;maps.append({'file':name,'priorSHA256':h,'candidateSHA256':sha(q) if q.is_file() else None,'equal':q.is_file() and sha(q)==h})
save('all-baseline-map-comparison.json',maps)
comparisons=json.loads((O/'independent-source-comparison.json').read_text());print('CHANGED_SOURCE',[r['file'] for r in comparisons if not r['equal']]);print('BASELINE_MAPS',len(maps),all(x['equal'] for x in maps))
restored=[]
with zipfile.ZipFile('C:/Users/mcdon/Downloads/Room_Creator_v0_13_1_route_prototype.zip') as z:
 for n in z.namelist():
  if '/tests/browser/' in n and n.endswith('.py'):
   name=n.split('/')[-1];p=C/'tests/browser'/name;restored.append({'file':name,'present':p.is_file(),'priorSHA256':hashlib.sha256(z.read(n)).hexdigest(),'candidateSHA256':sha(p) if p.is_file() else None})
save('restored-test-inventory.json',restored)
logs={p.name:p.read_text(encoding='utf-8') for p in (O/'fresh-native').glob('*.test.js.log')};node=[]
for n,t in logs.items():
 counts=re.findall(r'(\d+) passed, (\d+) failed',t);node.append({'file':n,'counts':counts,'lastLine':t.splitlines()[-1] if t else ''})
save('node-counts.json',node)
print('NODE',node)
for f in ['assets_browser_results.json','assets_all_models_results.json','assets_demo_checks_results.json','assets_perf_results.json']:
 p=C/'tests'/f
 if p.exists():(O/f).write_bytes(p.read_bytes())
for folder in ['assets_evidence','route/out']:
 import shutil
 shutil.copytree(C/'tests'/folder,O/('fresh-'+folder.replace('/','-')),dirs_exist_ok=True)
print('PLAYWRIGHT',importlib.metadata.version('playwright'))
if (C/'tests/route/out/route_eval_results.json').exists():
 old=json.loads((W/'prior-evidence/fresh-route-eval-results.json').read_text());new=json.loads((C/'tests/route/out/route_eval_results.json').read_text());save('route-evaluation-comparison.json',{'exactDataEqual':old==new,'oldType':type(old).__name__,'newType':type(new).__name__,'scenarioCount':len(new)});print('ROUTE_EQUAL',old==new)
generated=C/'generated/Route_Prototype_Street_ASSET_DEMO.room.json'
if generated.exists():
 core=C/'source/core.js';(W/'compare-generated.cjs').write_text('const fs=require("fs"),C=require('+json.dumps(str(core))+');const a=C.validateBundle(JSON.parse(fs.readFileSync('+json.dumps(str(C/'examples/Route_Prototype_Street_ASSET_DEMO.room.json'))+'))),b=C.validateBundle(JSON.parse(fs.readFileSync('+json.dumps(str(generated))+')));const keys=["routeNet","stories","stairs","floorCuts","pairs","links"];const r={propCount:b.project.props.length,points:b.project.props.reduce((n,q)=>n+q.points.length,0),preserved:Object.fromEntries(keys.map(k=>[k,JSON.stringify(a.project[k])===JSON.stringify(b.project[k])])),propPlacementAndMetadataEqual:JSON.stringify(a.project.props.map(({override,look,...q})=>q))===JSON.stringify(b.project.props.map(({override,look,...q})=>q))};console.log(JSON.stringify(r,null,2));');print('GENERATED',sha(generated))
