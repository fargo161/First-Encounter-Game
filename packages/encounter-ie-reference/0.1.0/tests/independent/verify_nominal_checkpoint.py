"""Measure and recover one checkpoint on a copy of the independent16 world."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import sys
import time
import tracemalloc

from verify_independent import SOURCE,Suite,plain,rss_bytes,save,sql_oracle


def main():
    p=argparse.ArgumentParser();p.add_argument('--world',type=Path,required=True)
    p.add_argument('--out',type=Path,required=True);a=p.parse_args()
    assert a.out.is_absolute() and not a.out.exists() and not a.out.is_relative_to(SOURCE)
    assert a.world.is_absolute() and a.world.is_file() and not a.world.is_relative_to(SOURCE)
    assert not any((x/'AGENTS.md').exists() and (x/'contracts').exists() for x in SOURCE.parents)
    a.out.mkdir(parents=True);folder=a.out/'nominal-checkpoint';folder.mkdir()
    path=folder/'world.db';source_hash=hashlib.sha256(a.world.read_bytes()).hexdigest()
    shutil.copy2(a.world,path)
    from eaie import Core
    from eaie.data import Work
    c=Core(path);before=c.snapshot();assert before.ordinal==16
    original=Work.charge;observed=[];depth=0
    transfers={'scratch_cold_replay','prospective_retry_comparisons','prospective_snapshot_output',
               'verified_snapshot','prospective_holder_recipe','prospective_author_recipe','complete_root_creation'}
    def spy(self,n,stage):
        nonlocal depth
        if depth==0 and stage not in transfers:observed.append((stage,n))
        depth+=1
        try:return original(self,n,stage)
        finally:depth-=1
    Work.charge=spy;tracemalloc.start();started=time.perf_counter()
    try:answer=c.checkpoint()
    finally:
        elapsed=time.perf_counter()-started
        _,peak=tracemalloc.get_traced_memory();tracemalloc.stop();Work.charge=original
    phase=plain(c.last_work);stages={}
    for stage,n in observed:stages[stage]=stages.get(stage,0)+n
    assert answer['status']=='checkpointed',answer
    assert phase['total']==sum(stages.values())<=40000000,(phase['total'],sum(stages.values()))
    after=c.snapshot()
    assert after.head==before.head and after.ordinal==16 and plain(after.state)==plain(before.state)
    assert after.stores['8-publication']['generation']==before.stores['8-publication']['generation']+1
    request=json.loads((a.world.parent/'oldest-request.json').read_text())
    expected=json.loads((a.world.parent/'expected.json').read_text())
    t=Suite(a.out);t.oldest[str(path)]=(request,{'receipt':expected['receipt']});t.preserved(c)
    assert hashlib.sha256(a.world.read_bytes()).hexdigest()==source_hash
    raw=sql_oracle(path)
    result={'status':'PASS','answer':answer,'complete_phase':phase,'independent_primitive_work':{'total':sum(stages.values()),'stages':stages},
            'elapsed_seconds':elapsed,'traced_peak_bytes':peak,'rss':rss_bytes(),
            'storage':{k:v for k,v in raw.items() if k!='tables'},'cold_result_path':str(folder/'cold.stdout'),
            'original_world_untouched':source_hash,'source':str(SOURCE)}
    save(a.out/'results.json',result)
    print(json.dumps({k:v for k,v in result.items() if k not in ('complete_phase','independent_primitive_work','storage')}),flush=True)


if __name__=='__main__':main()
