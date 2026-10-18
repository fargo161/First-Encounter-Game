"""Serve the self-contained M3 build on loopback only; Ctrl+C stops this helper."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
root=Path(__file__).resolve().parents[1]/'dist-m3'
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(root)))
print(f'Local: http://127.0.0.1:{server.server_port}/',flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
