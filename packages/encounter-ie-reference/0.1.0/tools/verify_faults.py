"""Bounded builder process interruption; not power/device-loss certification."""
import argparse,sys,json,subprocess
from pathlib import Path
from verify_reference import PACKAGE,external
sys.path.insert(0,str(PACKAGE))
from eaie import Core
def main():
    p=argparse.ArgumentParser();p.add_argument('--output',required=True);a=p.parse_args();out=external(a.output);out.mkdir(parents=True);results=[]
    for phase in ['before_write','before_commit','commit_enter','after_commit']:
        d=out/('fault-'+phase);d.mkdir();c=Core.create(d/'world.db')
        child=subprocess.run([sys.executable,'-B',str(PACKAGE/'tools'/'fault_worker.py'),str(c.path),phase],timeout=60,capture_output=True,text=True)
        c=Core(c.path);snap=c.snapshot();expected=1 if phase=='after_commit' else 0
        assert child.returncode==91 and snap.ordinal==expected,(phase,child.returncode,child.stderr,snap.ordinal)
        results.append({'phase':phase,'returncode':child.returncode,'verified_ordinal':snap.ordinal})
    (out/'builder-process-faults.json').write_text(json.dumps({'owner':'Builder H','independent':False,'power_loss':False,'results':results},indent=2));print(results)
if __name__=='__main__':main()
