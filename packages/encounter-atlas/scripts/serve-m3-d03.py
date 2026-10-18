"""Loopback CSS-only display faults. No executable HTML/script bytes are edited."""
from pathlib import Path
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
import hashlib,json
root=Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
before=(root/'historical/R2_index.html').read_bytes();after=(root/'dist-m3/index.html').read_bytes()
assert sha(before)=='7cbc1251a627631cf352e8a0cd8c5c78b93b76fedd1205a1e84676bfcecfbbe8'
rules={'normal':'','before-collapse':'#closure-notice{visibility:collapse!important}','collapse':'#closure-notice{visibility:collapse!important}','hidden':'#closure-notice{visibility:hidden!important}','display-none':'#closure-notice{display:none!important}','opacity':'#closure-notice{opacity:0!important}','ancestor':'.preview{opacity:0!important}','vertical':'#closure-notice{position:fixed!important;top:-1000px!important}','horizontal':'#closure-notice{position:fixed!important;left:-10000px!important;top:100px!important;width:300px!important}','zero-width':'#closure-notice{position:fixed!important;top:100px!important;left:100px!important;width:0!important;min-width:0!important;max-width:0!important;height:100px!important;padding:0!important;border:0!important;overflow:hidden!important;box-sizing:border-box!important}','zero-height':'#closure-notice{height:0!important;max-height:0!important;padding:0!important;border:0!important;overflow:hidden!important}','partial-left':'#closure-notice{position:fixed!important;left:-1px!important;top:100px!important;width:300px!important}'}
pages={};provenance={}
for name,css in rules.items():
 original=before if name=='before-collapse' else after;injection=('<style id="m3-d03-display-fault">'+css+'</style>').encode() if css else b''
 page=original.replace(b'</head>',injection+b'</head>',1) if injection else original
 assert page.replace(injection,b'',1)==original if injection else page==original
 pages['/'+name+'/']=page;provenance[name]={'sourceBuildSHA256':sha(original),'servedHTMLSHA256':sha(page),'cssInjection':css,'executableBytesUnchanged':True}
folder=root/'evidence/m3-d03';folder.mkdir(parents=True,exist_ok=True)
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
