"""Measure promised author endpoints on the completed independent16 world."""
import argparse
import hashlib
import json
from pathlib import Path

from verify_independent import SOURCE,encoded,plain,save


def main():
    p=argparse.ArgumentParser();p.add_argument('--world',type=Path,required=True)
    p.add_argument('--out',type=Path,required=True);a=p.parse_args()
    assert a.out.is_absolute() and not a.out.exists() and not a.out.is_relative_to(SOURCE)
    assert a.world.is_absolute() and a.world.is_file() and not a.world.is_relative_to(SOURCE)
    assert not any((x/'AGENTS.md').exists() and (x/'contracts').exists() for x in SOURCE.parents)
    a.out.mkdir(parents=True)
    from eaie import Core
    from eaie.data import Work
    c=Core(a.world);assert c.snapshot().ordinal==16
    original_hash=hashlib.sha256(a.world.read_bytes()).hexdigest()
    expected=json.loads((a.world.parent/'expected.json').read_text())
    request=json.loads((a.world.parent/'oldest-request.json').read_text())
    results=[]
    for query in ('current','boundary','census','receipt'):
        original=Work.charge;depth=0;stages={}
        transfers={'scratch_cold_replay','prospective_retry_comparisons','prospective_snapshot_output',
                   'verified_snapshot','prospective_holder_recipe','prospective_author_recipe','complete_root_creation'}
        def spy(self,n,stage):
            nonlocal depth
            if depth==0 and stage not in transfers:stages[stage]=stages.get(stage,0)+n
            depth+=1
            try:return original(self,n,stage)
            finally:depth-=1
        Work.charge=spy
        try:value=c.inspect(query=query,operation=request['key']['operation'] if query=='receipt' else None)
        finally:Work.charge=original
        work=plain(c.last_query_work);size=len(encoded(value))
        assert value.get('status')!='unavailable',value
        assert work['total']==sum(stages.values())<=20000000
        assert size<=65536
        if query=='receipt':assert value['receipt']==expected['receipt'],value
        results.append({'query':query,'reply_bytes':size,'actual_work':work,
                        'independent_originating_work':{'total':sum(stages.values()),'stages':stages}})
    assert hashlib.sha256(a.world.read_bytes()).hexdigest()==original_hash
    save(a.out/'results.json',{'status':'PASS','pass':4,'fail':0,'skip':0,'queries':results,'db_hash_unchanged':original_hash})
    print([{'query':x['query'],'reply_bytes':x['reply_bytes'],'work':x['actual_work']['total']} for x in results],flush=True)


if __name__=='__main__':main()
