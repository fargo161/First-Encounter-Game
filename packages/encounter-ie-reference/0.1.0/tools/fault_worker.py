"""Process fault seam for a caller-owned disposable world only."""
import os,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from eaie import Core
from eaie.fixtures import LOSS_OBSERVATION
def main():
    path=Path(sys.argv[1]);phase=sys.argv[2]
    assert path.is_absolute() and path.parent.name.startswith('fault-'),'own disposable fault directory required'
    c=Core(path);r=c.prepare('fault-operation','Observe',LOSS_OBSERVATION)
    def stop(point,entry):
        if point==phase:os._exit(91)
    c.admit(r,publication_hook=stop)
if __name__=='__main__':main()
