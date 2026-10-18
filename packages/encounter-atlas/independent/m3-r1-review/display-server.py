"""Tester-owned CSS-only fault host. No executable bytes or checkpoint files edited."""
from pathlib import Path
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
import hashlib,json
R=Path(__file__).resolve().parent;E=R/'evidence';sha=lambda b:hashlib.sha256(b).hexdigest()
new=(R/'checkpoint/dist-m3/index.html').read_bytes();old=(R/'failed-checkpoint/dist-m3/index.html').read_bytes()
assert sha(new)=='11393dde2ae110d3b04aac03c1044e000be6b410e4bffacb16216829c9050052';assert sha(old)=='4fa1f60a1ec6a561375bdc38799693943b0910886d2f7ea838099d9303469e58'
rules={'normal':'','before':'#closure-notice{opacity:0!important}','opacity':'#closure-notice{opacity:0!important}','ancestor':'.preview{opacity:0!important}','vertical':'#closure-notice{position:fixed!important;top:-1000px!important}','horizontal':'#closure-notice{position:fixed!important;left:-10000px!important;top:100px!important;width:300px!important}','hidden':'#closure-notice{visibility:hidden!important}','display-none':'#closure-notice{display:none!important}','zero-height':'#closure-notice{height:0!important;max-height:0!important;padding:0!important;border:0!important;overflow:hidden!important}','zero-width':'#closure-notice{position:fixed!important;top:100px!important;left:100px!important;width:0!important;min-width:0!important;max-width:0!important;height:100px!important;padding:0!important;border:0!important;overflow:hidden!important;box-sizing:border-box!important}'}
pages={};records={}
for name,css in rules.items():
 original=old if name=='before' else new;injection=('<style id="independent-r1-display-fault">'+css+'</style>').encode() if css else b'';page=original.replace(b'</head>',injection+b'</head>',1) if injection else original
 assert page.replace(injection,b'',1)==original if injection else page==original
 pages['/'+name+'/']=page;records[name]={'sourceBuildSha256':sha(original),'servedSha256':sha(page),'cssInjection':css,'executableBytesUnchanged':True}
(E/'rendering-fault-provenance.json').write_text(json.dumps(records,indent=2)+'\n',encoding='utf-8')
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  b=pages.get(self.path)
  if b is None:self.send_error(404);return
  self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(b)));self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(b)
s=ThreadingHTTPServer(('127.0.0.1',0),Handler);print(f'Local: http://127.0.0.1:{s.server_port}/normal/',flush=True)
try:s.serve_forever()
except KeyboardInterrupt:pass
finally:s.server_close()
