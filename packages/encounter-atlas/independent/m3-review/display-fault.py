"""External display fault harness; original executable bytes retained verbatim.
The only added markup is a CSS opacity rule. No engine/UI JavaScript is edited.
"""
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
import hashlib,json
r=Path(__file__).resolve().parent
original=(r/'checkpoint/dist-m3/index.html').read_bytes()
injection=b'<style id="independent-display-fault">#closure-notice { opacity: 0 !important; }</style>'
folder=r/'display-fault';folder.mkdir(exist_ok=True)
harness=original.replace(b'</head>',injection+b'</head>',1)
assert harness.replace(injection,b'',1)==original
(folder/'index.html').write_bytes(harness)
(r/'evidence/display-fault-provenance.json').write_text(json.dumps({'originalBuildSha256':hashlib.sha256(original).hexdigest(),'harnessSha256':hashlib.sha256(harness).hexdigest(),'injection':injection.decode(),'executableScriptBytesUnchanged':True,'purpose':'Inject a rendering failure: notice has normal geometry but is fully transparent. Test no displayed notice = no closure.'},indent=2),encoding='utf-8')
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(folder)))
print(f'Local: http://127.0.0.1:{server.server_port}/',flush=True)
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
