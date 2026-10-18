"""Build the standalone offline HTML from source. Python standard library only.

0.13: the interface modules ui-*.js are spliced into app.js at /*UI_EXTENSIONS*/ so they share its
private state (project, selection, history). three.js r159 (MIT, see THREE_LICENSE.txt) is inlined."""
from pathlib import Path
HERE=Path(__file__).resolve().parent
UI=["ui-gl.js","ui-fp.js","ui-sky.js","ui-rails.js","ui-stories.js","ui-route.js","ui-props.js"]
def read(name):return (HERE/name).read_text(encoding="utf-8")
# 0.14 guard: app.js and the ui-*.js files share one scope, so two top-level functions with the same name would
# silently replace each other (the later one wins). Stop the build instead.
import re,collections
_names=collections.defaultdict(list)
for _n in ["app.js"]+UI:
    for _m in re.finditer(r"(?m)^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|^(?:const|let|var)\s+([A-Za-z_$][\w$]*)",read(_n)):_names[_m.group(1) or _m.group(2)].append(_n)
_dups={k:v for k,v in _names.items() if len(v)>1}
if _dups:raise SystemExit("Build stopped: the same top-level name is defined twice (one would silently replace the other): "+repr(_dups))
app=read("app.js").replace("/*UI_EXTENSIONS*/","\n".join("/* ---- %s ---- */\n%s"%(n,read(n)) for n in UI))
text=read("shell.html")
for token,source in {"STYLE":read("style.css"),"THREE":read("vendor-three.min.js"),"GLTFLOADER":read("vendor-gltfloader.js"),"LEGACY1":read("legacy-v1.js"),"LEGACY3":read("legacy-v3.js"),
 "CORE":read("core.js"),"RAILS":read("rails.js"),"RENDERER":read("renderer.js"),"GL":read("gl.js"),"ASSETS":read("assetlib.js"),"APP":app}.items():
    if token!="STYLE":source=source.replace("</script","<\\/script")
    text=text.replace("/*"+token+"*/",source,1)
out=HERE.parent/"Room_Creator.html"
out.write_bytes(text.replace("\r\n","\n").replace("\r","\n").encode("utf-8"))
print(f"Built {out.name}: {out.stat().st_size:,} bytes")
