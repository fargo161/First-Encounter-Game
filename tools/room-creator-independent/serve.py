from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from urllib.parse import unquote,urlsplit
W=Path(__file__).resolve().parent;B=W.parents[1]
M={'/candidate/':W/'candidate/Room_Creator_v0_14_1_remediation_candidate','/original/':W/'original/Room_Creator_v0_14_asset_library','/lib/':B/'work/rc014-audit/dependency/Trapstar_RoomCreator_Asset_Library_v1'}
class H(SimpleHTTPRequestHandler):
    def translate_path(self,path):
        path=unquote(urlsplit(path).path)
        for pre,root in M.items():
            if path.startswith(pre):
                p=(root/path[len(pre):]).resolve()
                if p.is_relative_to(root.resolve()):return str(p)
        return str(W/'missing')
    def log_message(self,*args):pass
print('Independent audit HTTP server 8783',flush=True)
ThreadingHTTPServer(('127.0.0.1',8783),H).serve_forever()
