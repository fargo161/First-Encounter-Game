"""Builder reference runner. Copy the package first; output must be new/external."""
import argparse,json,sys,os,time,tracemalloc,ctypes
from pathlib import Path
PACKAGE=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(PACKAGE))
def external(path):
    p=Path(path);assert p.is_absolute(),'absolute external output required'
    p=p.resolve();assert not p.exists(),'new output directory required'
    assert not p.is_relative_to(PACKAGE),'output must be outside disposable source'
    assert not any((a/'AGENTS.md').exists() and (a/'contracts').exists() for a in PACKAGE.parents),'copy package to disposable external source first'
    return p
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output',required=True);args=parser.parse_args();out=external(args.output)
    sys.path.insert(0,str(PACKAGE/'tests'/'reference'));from smoke import run
    start=time.perf_counter();tracemalloc.start();run(out);_,peak=tracemalloc.get_traced_memory();tracemalloc.stop()
    from eaie.identity import source_identity
    result={'owner':'Builder H','independent_verdict':False,'source':source_identity(),'elapsed_seconds':time.perf_counter()-start,'traced_peak_bytes':peak,'python':sys.version,'platform':sys.platform,'gate_b':'PENDING'}
    (out/'qualification.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
if __name__=='__main__':main()
