from pathlib import Path
from http.server import BaseHTTPRequestHandler,HTTPServer
import hashlib,json
root=Path(__file__).resolve().parents[1];html=(root/'dist-m3/index.html').read_bytes();sha=lambda b:hashlib.sha256(b).hexdigest()
assert sha(html)=='8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb'
rules={'normal':'','collapse':'#closure-notice{visibility:collapse!important}','missing':'#closure-notice{display:none!important}','opacity':'#closure-notice{opacity:0!important}','ancestor':'.preview{opacity:0!important}','horizontal':'#closure-notice{position:fixed!important;left:-10000px!important;top:100px!important;width:300px!important}'}
served={}
for name,css in rules.items():
 style=('<style id="ar0-rendering-fault">'+css+'</style>').encode() if css else b''
 b=html.replace(b'</head>',style+b'</head>');assert (b.replace(style,b'',1) if style else b)==html
 served[name]=b
provenance={'normalAndAllExecutableBytesEqualAcceptedM3R3':True,'M3BuildSHA256':sha(html),'faults':{name:{'CSS':rules[name],'servedSHA256':sha(b),'removingInjectedCSSRestoresOriginal':True} for name,b in served.items()}}
(root/'evidence/ar0/rendering-fault-provenance.json').write_text(json.dumps(provenance,indent=2)+'\n',encoding='utf-8')
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  route=self.path.strip('/').split('?')[0] or 'normal'
  if route not in served:self.send_error(404);return
  b=served[route];self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(b)));self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(b)
server=HTTPServer(('127.0.0.1',0),Handler)
print(json.dumps({'url':f'http://127.0.0.1:{server.server_port}/normal/','port':server.server_port,'host':'CSS-only verification host; no Atlas UI'}),flush=True)
server.serve_forever()
