"""Loopback browser regression harness; CSS-only faults, executable bytes intact."""
from pathlib import Path
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from zipfile import ZipFile
import hashlib,json
root=Path(__file__).resolve().parents[1]
with ZipFile(root/'historical/Encounter_M3_Checkpoint.zip') as z:before=z.read('dist-m3/index.html')
after=(root/'dist-m3/index.html').read_bytes()
sha=lambda b:hashlib.sha256(b).hexdigest()
assert sha(before)=='4fa1f60a1ec6a561375bdc38799693943b0910886d2f7ea838099d9303469e58'
styles={'/before/':(before,'#closure-notice { opacity: 0 !important; }'),'/transparent/':(after,'#closure-notice { opacity: 0 !important; }'),'/offscreen/':(after,'#closure-notice { position: fixed !important; top: -1000px !important; }'),'/normal/':(after,'')}
pages={};provenance={}
for route,(original,css) in styles.items():
 injection=('<style id="m3-d01-rendering-fault">'+css+'</style>').encode() if css else b''
 page=original.replace(b'</head>',injection+b'</head>',1)
 assert page.replace(injection,b'',1)==original if injection else page==original
 pages[route]=page;provenance[route]={'sourceBuildSHA256':sha(original),'servedHTMLSHA256':sha(page),'injection':injection.decode(),'executableBytesUnchanged':True}
folder=root/'evidence/m3-d01';folder.mkdir(parents=True,exist_ok=True)
(folder/'rendering-fault-provenance.json').write_text(json.dumps(provenance,indent=2)+'\n',encoding='utf-8')
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  page=pages.get(self.path)
  if page is None:self.send_error(404);return
  self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(page)));self.end_headers();self.wfile.write(page)
server=ThreadingHTTPServer(('127.0.0.1',0),Handler)
print(f'Local: http://127.0.0.1:{server.server_port}/normal/',flush=True)
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
