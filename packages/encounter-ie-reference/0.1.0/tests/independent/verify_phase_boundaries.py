"""Independent black-box complete-phase budget boundaries on disposable worlds.

Every trial selects its immutable profile before creation. No runtime cap or
source is patched. A rejected admission/checkpoint must preserve all SQL rows.
"""
import argparse
import json
from pathlib import Path
import sqlite3
import sys
import time


def rows(path):
    if not path.exists():
        return None
    try:
        with sqlite3.connect(path) as db:
            return {name: db.execute('SELECT * FROM '+name+' ORDER BY 1').fetchall()
                    for name in ('root','history','meta','checkpoints')}
    except sqlite3.Error:
        return None


def main():
    p=argparse.ArgumentParser();p.add_argument('--out',type=Path,required=True)
    p.add_argument('--only',choices=('create','admission','checkpoint'))
    a=p.parse_args();source=Path(__file__).resolve().parents[2]
    assert a.out.is_absolute() and not a.out.exists() and not a.out.is_relative_to(source)
    assert not any((x/'AGENTS.md').exists() and (x/'contracts').exists() for x in source.parents)
    a.out.mkdir(parents=True);sys.path.insert(0,str(source))
    from eaie import Core
    from eaie.profile import DEFAULT_LIMITS
    all_results=[];started=time.perf_counter()
    for phase in ((a.only,) if a.only else ('create','admission','checkpoint')):
        trials=[]
        def attempt(cap):
            out=a.out/(phase+'-'+str(cap)+'-'+str(len(trials)))
            out.mkdir();path=out/'world.db';L=dict(DEFAULT_LIMITS)
            L['checkpoint_work' if phase=='checkpoint' else 'admission_work']=cap
            trial={'phase':phase,'cap':cap,'path':str(path)}
            before=None;core=None
            try:
                core=Core.create(path,L)
                if phase=='create':
                    answer={'status':'created'};ok=True
                else:
                    before=rows(path)
                    if phase=='admission':
                        request=core.prepare('phase-boundary','AdvanceTime',{'to':1})
                        answer=core.admit(request);ok=answer['status']=='O1'
                    else:
                        answer=core.checkpoint();ok=answer['status']=='checkpointed'
                trial['answer']=answer;trial['actual']=getattr(core,'last_work',None)
            except Exception as e:
                ok=False;trial['exception']=type(e).__name__+':'+str(e)
            after=rows(path);trial['acknowledged']=ok
            trial['sql_changed']=after!=before
            if phase!='create' and before is not None and not ok:
                trial['atomic_refusal']=after==before
            if ok:
                cold=Core(path,L).snapshot()
                trial['fresh_ordinal']=cold.ordinal
                if phase=='admission':
                    retry=Core(path,L).admit(request)
                    assert retry['status']=='O3',retry
                    trial['fresh_retry']=retry['status']
            trials.append(trial)
            (a.out/(phase+'-trials.json')).write_text(json.dumps(trials,indent=2),encoding='utf8')
            return ok,trial
        high=DEFAULT_LIMITS['checkpoint_work' if phase=='checkpoint' else 'admission_work'];low=1
        assert attempt(high)[0]
        while low<high:
            middle=(low+high)//2
            if attempt(middle)[0]:high=middle
            else:low=middle+1
        controls=[attempt(low+offset) for offset in (-1,0,1)]
        result={'phase':phase,'minimum_acknowledged':low,'controls':[x[1] for x in controls],
                'all_unacknowledged_trials_atomic':all(x.get('atomic_refusal',True) for x in trials)}
        assert [x[0] for x in controls]==[False,True,True],result
        if phase!='create':assert result['all_unacknowledged_trials_atomic'],result
        for ok,trial in controls:
            if ok:assert trial['actual']['total']<=trial['cap'],trial
        result['status']='PASS';all_results.append(result)
        print(json.dumps(result),flush=True)
    summary={'status':'PASS','groups':all_results,'elapsed_seconds':time.perf_counter()-started}
    (a.out/'results.json').write_text(json.dumps(summary,indent=2),encoding='utf8')


if __name__=='__main__':main()
