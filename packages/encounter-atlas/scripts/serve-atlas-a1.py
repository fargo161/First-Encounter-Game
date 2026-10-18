from pathlib import Path
from http.server import BaseHTTPRequestHandler,HTTPServer
import json,hashlib,sys,webbrowser
root=Path(__file__).resolve().parents[1];html=(root/'dist-atlas-a1/index.html').read_bytes()
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  if self.path.split('?')[0] not in ['/','/index.html']:self.send_error(404);return
  self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(html)));self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(html)
server=HTTPServer(('127.0.0.1',0),Handler);url=f'http://127.0.0.1:{server.server_port}/';print(json.dumps({'url':url,'bytes':len(html),'sha256':hashlib.sha256(html).hexdigest(),'readOnlyGETOnly':True}),flush=True)
if '--open' in sys.argv:webbrowser.open(url)
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
