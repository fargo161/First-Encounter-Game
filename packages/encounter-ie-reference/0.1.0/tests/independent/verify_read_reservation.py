"""Independent pre-read reservation probes on source and authored fixtures."""
import argparse
from pathlib import Path

from verify_independent import SOURCE,save


def main():
    p=argparse.ArgumentParser();p.add_argument('--out',type=Path,required=True);a=p.parse_args()
    assert a.out.is_absolute() and not a.out.exists() and not a.out.is_relative_to(SOURCE)
    assert not any((x/'AGENTS.md').exists() and (x/'contracts').exists() for x in SOURCE.parents)
    a.out.mkdir(parents=True)
    from eaie import data
    from eaie.identity import source_identity
    original_read=Path.read_bytes;original_charge=data.Work.charge
    rows=[];last_charge=None;depth=0
    def observe_charge(self,n,stage):
        nonlocal last_charge,depth
        if depth==0:last_charge=(stage,n)
        depth+=1
        try:return original_charge(self,n,stage)
        finally:depth-=1
    def observe_read(path):
        work=data.METER.get()
        rows.append({'path':str(path),'before_total':work.total if work else None,
                     'last_origin_charge':last_charge,'size':path.stat().st_size})
        return original_read(path)
    data.Work.charge=observe_charge;Path.read_bytes=observe_read
    results=[]
    try:
        for name,call,target,multiplier,stage in (
            ('source',source_identity,SOURCE/'eaie/core.py',2,'source_read_hash'),
            ('fixture',data.literals,SOURCE/'fixtures/R0.txt',4,'fixture_read_hash_decode_bytes')):
            rows.clear()
            with data.metered(20000000):call()
            record=next(x for x in rows if Path(x['path'])==target)
            cost=multiplier*record['size']+1
            assert tuple(record['last_origin_charge'])==(stage,cost),('read preceded its declared stage reservation',record)
            parent_limit=record['before_total']-cost+100
            assert parent_limit>0
            rows.clear()
            try:
                with data.metered(parent_limit):
                    with data.metered(20000000):call()
            except data.Rejected:pass
            else:raise AssertionError('tight parent bulk read accepted')
            assert not any(Path(x['path'])==target for x in rows),('whole bulk read before ancestor budget refusal',rows)
            result={'group':name,'status':'PASS','positive_pre_read':record,'tight_parent_limit':parent_limit,
                    'ample_child_limit':20000000,'target_read_on_refusal':False}
            results.append(result);print(result,flush=True)
    finally:Path.read_bytes=original_read;data.Work.charge=original_charge
    save(a.out/'results.json',{'status':'PASS','pass':2,'fail':0,'skip':0,'groups':results})


if __name__=='__main__':main()
