"""I-controlled interruption of only this disposable child process."""
import json
import os
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from eaie import Core

path=Path(sys.argv[1]); phase=sys.argv[2]
c=Core(path)
r=c.prepare('fault-operation','AdvanceTime',{'to':1})
(path.parent/'request.json').write_text(json.dumps(r),encoding='utf8')
def hook(at,entry):
    if at==phase:
        os._exit(91)
a=c.admit(r,publication_hook=hook,backend_fault='commit-kill' if phase=='during_commit' else None)
if phase=='after_ack':
    print(json.dumps(a),flush=True)
    os._exit(91)
raise AssertionError(('phase not reached',phase,a))
