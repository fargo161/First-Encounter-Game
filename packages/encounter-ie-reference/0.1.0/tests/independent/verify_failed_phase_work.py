"""Observe originating work on refused nested admission/checkpoint phases."""
import argparse
from pathlib import Path

from verify_independent import SOURCE,Suite,plain,save,sql_oracle


def main():
    p=argparse.ArgumentParser();p.add_argument('--out',type=Path,required=True);a=p.parse_args()
    assert a.out.is_absolute() and not a.out.exists() and not a.out.is_relative_to(SOURCE)
    assert not any((x/'AGENTS.md').exists() and (x/'contracts').exists() for x in SOURCE.parents)
    a.out.mkdir(parents=True)
    from eaie import Core
    from eaie.data import Work
    from eaie.profile import DEFAULT_LIMITS
    trials=[]
    for phase in ('admission','checkpoint'):
        folder=a.out/phase;folder.mkdir()
        limits=dict(DEFAULT_LIMITS,**({'admission_work':1400000,'cold_work':1000000}
                     if phase=='admission' else {'checkpoint_work':1000000}))
        c=Core.create(folder/'world.db',limits);before=sql_oracle(c.path)['tables']
        request=c.prepare('failed-nested','AdvanceTime',{'to':1}) if phase=='admission' else None
        original=Work.charge;depth=0;observations=[];completed=[];rejected=[]
        transfers={'scratch_cold_replay','prospective_retry_comparisons','prospective_snapshot_output',
                   'verified_snapshot','prospective_holder_recipe','prospective_author_recipe','complete_root_creation'}
        def spy(self,n,stage):
            nonlocal depth
            origin=depth==0 and stage not in transfers
            if origin:observations.append((stage,n))
            depth+=1
            try:
                value=original(self,n,stage)
                if origin:completed.append((stage,n))
                return value
            except Exception:
                if origin:rejected.append((stage,n))
                raise
            finally:depth-=1
        Work.charge=spy
        try:answer=c.admit(request) if phase=='admission' else c.checkpoint()
        finally:Work.charge=original
        report=plain(c.last_work);stages={}
        for stage,n in observations:stages[stage]=stages.get(stage,0)+n
        trial={'phase':phase,'answer':answer,'reported':report,'originating':{'total':sum(stages.values()),'stages':stages},
               'completed_charge_units':sum(n for _,n in completed),'rejected_charge_attempts':rejected,
               'sql_unchanged':sql_oracle(c.path)['tables']==before,'ordinal':c.snapshot().ordinal}
        trials.append(trial);save(a.out/'results.json',{'status':'RUNNING','groups':trials})
        assert answer['status']=='O4' and trial['sql_unchanged'] and trial['ordinal']==0,trial
        assert report['total']==trial['originating']['total'],('nested work lost or double counted',trial)
        assert trial['completed_charge_units']<=limits['admission_work' if phase=='admission' else 'checkpoint_work'],trial
        trial['status']='PASS'
        print({'phase':phase,'status':'PASS','reported':report['total'],'originating':trial['originating']['total']},flush=True)
    save(a.out/'results.json',{'status':'PASS','groups':trials,'pass':2,'fail':0,'skip':0})


if __name__=='__main__':main()
