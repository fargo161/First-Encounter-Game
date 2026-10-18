"""Portable Node/browser runner. No library writes, symlinks or global Python changes."""
import argparse,functools,hashlib,json,os,shutil,subprocess,sys,threading,time
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from urllib.parse import unquote,urlsplit
ROOT=Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser();parser.add_argument('--library',type=Path);parser.add_argument('--browser');parser.add_argument('--prior-v12',type=Path);parser.add_argument('--port',type=int,default=8771);parser.add_argument('--suite',choices=['node','assets','preservation','route','regression','all'],default='all');parser.add_argument('--scripts',nargs='*');parser.add_argument('--out',type=Path);args=parser.parse_args()
OUT=(args.out or ROOT/'test_runs'/time.strftime('%Y%m%d-%H%M%S')).resolve();OUT.mkdir(parents=True,exist_ok=True)
lib=args.library.resolve() if args.library else None
class Handler(SimpleHTTPRequestHandler):
 def translate_path(self,path):
  path=unquote(urlsplit(path).path)
  special='/pkg/tests/fixtures/badlibs/missing_file/STANDARDIZED_LIBRARY/'
  mounts=[(special,lib/'STANDARDIZED_LIBRARY' if lib else ROOT/'not-found'),('/pkg/',ROOT),('/lib/',lib)]
  for prefix,root in mounts:
   if root and path.startswith(prefix):
    dest=(root/path[len(prefix):]).resolve()
    if dest.is_relative_to(root):return str(dest)
  return str(ROOT/'not-found')
 def do_GET(self):
  if urlsplit(self.path).path=='/favicon.ico':self.send_response(204);self.end_headers();return
  super().do_GET()
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
env=os.environ.copy();env.update(PYTHONUTF8='1',PYTHONPATH=str(ROOT/'tests')+os.pathsep+env.get('PYTHONPATH',''),RC_BASE=f'http://127.0.0.1:{args.port}',RC_PAGE='/pkg/Room_Creator.html',RC_LIB='/lib/',RC_FIXTURES='/pkg/tests/fixtures/',RC_TEST_OUT=str(OUT))
env['RC_URL']=env['RC_BASE']+env['RC_PAGE']
if lib:env['RC_LIB_DIR']=str(lib)
if args.browser:env['RC_BROWSER']=args.browser
if args.prior_v12:env['RC_PRIOR_V12']=str(args.prior_v12.resolve())
records=[]
def run(name,cmd,kind):
 start=time.monotonic();log=OUT/(name.replace('/','-')+'.log');print('START',name,flush=True)
 with log.open('w',encoding='utf-8',newline='\n') as f:r=subprocess.run(cmd,cwd=ROOT,env=env,stdout=f,stderr=subprocess.STDOUT,timeout=900)
 record={'script':name,'buildSHA256':hashlib.sha256((ROOT/'Room_Creator.html').read_bytes()).hexdigest(),'kind':kind,'exitCode':r.returncode,'seconds':round(time.monotonic()-start,2),'log':log.name};records.append(record);print(json.dumps(record),flush=True);(OUT/'run-index.json').write_text(json.dumps(records,indent=2),encoding='utf-8',newline='\n')
if args.suite in ['node','all']:
 for f in sorted((ROOT/'tests').glob('*.test.js')):run(f.name,['node',str(f)],'assertions')
 run('build_repro.py',[sys.executable,str(ROOT/'tests/build_repro.py')],'assertions')
assets=['assets_browser.py','assets_all_models.py','assets_demo_checks.py','assets_perf.py','assets_vehicle_fronts.py','demo_screens.py']
preservation=['browser/'+n+'.py' for n in ['ui_smoke','fp_test','fp_test2','sky_test','rails_test','rails_test2','stories_test','rail_stairs_check','final_test']]
route=['route/'+n+'.py' for n in ['route_smoke','route_keys','route_perf','route_eval']]
scripts=args.scripts if args.scripts is not None else {'node':[],'regression':['remediation_browser.py'],'assets':assets,'preservation':preservation,'route':route,'all':['remediation_browser.py']+assets+preservation+route}[args.suite]
env['RC_TEST_RUNTIME']='1'
for script in scripts:
 if (script.startswith('assets_') or script=='remediation_browser.py' or script in ['demo_screens.py','make_asset_demo.py']) and not lib:raise SystemExit('--library is required for '+script)
 run(script,[sys.executable,'-u',str(ROOT/'tests'/script)],'assertions' if script in ['assets_browser.py','assets_all_models.py','assets_demo_checks.py','remediation_browser.py'] else 'observational')
server.shutdown()
print('RESULTS',OUT)
sys.exit(1 if any(r['exitCode'] for r in records) else 0)
