"""Loopback CSS-only browser faults; current and preserved R1 scripts unchanged."""
from pathlib import Path
from zipfile import ZipFile
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
import hashlib,json
root=Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
with ZipFile(root/'historical/Encounter_M3_Checkpoint_R1.zip') as z:before=z.read('dist-m3/index.html')
assert sha(before)=='11393dde2ae110d3b04aac03c1044e000be6b410e4bffacb16216829c9050052'
after=(root/'dist-m3/index.html').read_bytes()
horizontal='#closure-notice{position:fixed!important;left:-10000px!important;top:100px!important;width:300px!important}'
zero='#closure-notice{position:fixed!important;top:100px!important;left:100px!important;width:0!important;min-width:0!important;max-width:0!important;height:100px!important;padding:0!important;border:0!important;overflow:hidden!important;box-sizing:border-box!important}'
rules={'normal':'','before-horizontal':horizontal,'before-zero-width':zero,'horizontal':horizontal,'zero-width':zero,'opacity':'#closure-notice{opacity:0!important}','ancestor':'.preview{opacity:0!important}','vertical':'#closure-notice{position:fixed!important;top:-1000px!important}'}
pages={};provenance={}
for name,css in rules.items():
 original=before if name.startswith('before-') else after
 injection=('<style id="m3-d02-rendering-fault">'+css+'</style>').encode() if css else b''
 page=original.replace(b'</head>',injection+b'</head>',1) if injection else original
 assert page.replace(injection,b'',1)==original if injection else page==original
 pages['/'+name+'/']=page;provenance[name]={'sourceBuildSHA256':sha(original),'servedHTMLSHA256':sha(page),'cssInjection':css,'executableBytesUnchanged':True}
folder=root/'evidence/m3-d02';folder.mkdir(parents=True,exist_ok=True)
(folder/'rendering-fault-provenance.json').write_text(json.dumps(provenance,indent=2)+'\n',encoding='utf-8')
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  data=pages.get(self.path)
  if data is None:self.send_error(404);return
  self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
server=ThreadingHTTPServer(('127.0.0.1',0),Handler);print(f'Local: http://127.0.0.1:{server.server_port}/normal/',flush=True)
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
