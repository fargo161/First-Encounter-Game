"""J-owned independent adversarial audit. Run -B, copy runtime, external outputs."""
from pathlib import Path
import hashlib,json,shutil,sqlite3,subprocess,sys,traceback

repo=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]).resolve()
assert out.is_absolute() and not out.exists() and repo not in out.parents
out.mkdir();shutil.copytree(repo/'packages/encounter-ie-reference/0.1.0',out/'source')
shutil.copyfile(__file__,out/'j_final_probe.py')
sys.path.insert(0,str(out/'source'))
from eaie import Core,Rejected,Unavailable
from eaie.data import metered,canonical
from eaie.profile import DEFAULT_LIMITS
from eaie.fixtures import OBSERVATION,LOSS_OBSERVATION
from eaie.identity import source_identity

result={'auditor':'J','source':source_identity(),'harness_sha256':hashlib.sha256((out/'j_final_probe.py').read_bytes()).hexdigest(),'out':str(out),'probes':{}}
def probe(name,fn):
    try:result['probes'][name]={'status':'PASS','value':fn()}
    except BaseException as e:result['probes'][name]={'status':'FAIL','exception':type(e).__name__,'reason':str(e),'traceback':traceback.format_exc()}
    (out/'result.json').write_text(json.dumps(result,indent=2,default=dict)+'\n',encoding='utf8')
def state(c):return c.inspect()['state']
def submit(c,name,kind,p):
    r=c.prepare(name,kind,p);a=c.admit(r);assert a['status'] in ['O1','O2'],(name,a);return r,a
def claim(body='J report',corrects=None):return {'actor':'alice','body':body,'subject':{'kind':'alleged','scope':'alice','label':'J alleged incident'},'value':'TRUE','source_assertion':'J supplied claim','valid_until':None,'corrects':corrects}

def reserve_peak(fn):
    """Conservative pre-stage reservation can exceed final executed work."""
    from eaie import data
    original=data.Work.reserve;peak=[0]
    def observed(self,n,stage):
        if self.parent is None:peak[0]=max(peak[0],self.total+n)
        return original(self,n,stage)
    data.Work.reserve=observed
    try:value=fn()
    finally:data.Work.reserve=original
    return value,peak[0]

def observation():
    c=Core.create(out/'observation.db');submit(c,'o-initial','Observe',OBSERVATION)
    submit(c,'o-time','AdvanceTime',{'to':6});before=c.snapshot().head
    stale=c.admit(c.prepare('o-stale','Observe',OBSERVATION));assert stale['status']=='O4' and c.snapshot().head==before,stale
    submit(c,'o-loss','Observe',LOSS_OBSERVATION)
    return {'stale':stale,'actual_D':state(c)['families']['Env']['D'],'holder':c.holder_view('observer')}

def optional():
    c=Core.create(out/'optional.db');assert c.checkpoint()['status']=='checkpointed';head=c.snapshot().head;cases=[]
    for payload in ['{"seq":0,"seq":0}','{"seq":NaN}','"'+'x'*6000+'"',b'\xff'*6000,b'{}']:
        db=sqlite3.connect(out/'optional.db');db.execute('UPDATE checkpoints SET payload=?',(payload,));db.commit()
        raw=payload if type(payload) is bytes else payload.encode()
        expected=db.execute("SELECT sum(length(CAST(payload AS BLOB))) FROM root").fetchone()[0]+len(raw);db.close()
        s=c.snapshot();assert s.head==head and s.stores['9-proof-index']['accelerator_status']==('ignored_invalid_accelerator',)
        assert s.census['encoded_prefix_bytes']==expected
        cases.append({'raw_bytes':len(raw),'type':type(payload).__name__,'encoded_total':expected,'cold_work':s.census['cold_work']})
    return cases

def reduced_work():
    limits=dict(DEFAULT_LIMITS,admission_work=0)
    try:Core.create(out/'zero-admission.db',limits=limits)
    except (Rejected,Unavailable) as e:creation={'refused':str(e)}
    else:raise AssertionError('zero admission budget created world')
    limits=dict(DEFAULT_LIMITS,checkpoint_work=0);c=Core.create(out/'zero-checkpoint.db',limits=limits);before=c.snapshot().head
    cp=c.checkpoint();assert cp['status']=='O4' and c.snapshot().head==before,cp
    db=sqlite3.connect(out/'zero-checkpoint.db');count=db.execute('SELECT count(*) FROM checkpoints').fetchone()[0];db.close();assert count==0
    import eaie.core as core
    from eaie.data import METER
    original=core.profile;entries=[]
    def watched(*args,**kwargs):
        entries.append(None if METER.get() is None else METER.get().limit)
        return original(*args,**kwargs)
    core.profile=watched
    try:tight,peak=reserve_peak(lambda:Core.create(out/'metered-profile.db'))
    finally:core.profile=original
    assert entries and all(x is not None for x in entries),entries
    cap=max(tight.last_work['total'],peak);boundaries=[]
    for n in range(3):
        candidate,peak=reserve_peak(lambda:Core.create(out/('tight-create-'+str(n)+'.db'),limits=dict(DEFAULT_LIMITS,admission_work=cap)))
        assert candidate.last_work['total']<=cap
        boundaries.append({'selected':cap,'reported_complete':candidate.last_work['total'],'peak_outer_reserve':peak});cap=max(candidate.last_work['total'],peak)
    for delta in [-1,1]:
        selected=cap+delta;path=out/('tight-create-boundary-'+str(delta)+'.db')
        try:trial=Core.create(path,limits=dict(DEFAULT_LIMITS,admission_work=selected))
        except Rejected as e:
            assert delta<0
            db=sqlite3.connect(path);tables=db.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall();db.close();assert not tables,tables
            boundaries.append({'selected':selected,'refused':str(e),'published_tables':tables})
        else:
            assert delta>0 and trial.last_work['total']<=selected
            boundaries.append({'selected':selected,'reported_complete':trial.last_work['total'],'ordinal':trial.snapshot().ordinal})
    try:Core.create(out/'zero-root-state.db',limits=dict(DEFAULT_LIMITS,state_bytes=0))
    except (Rejected,Unavailable) as e:initial_state={'refused':str(e)}
    else:raise AssertionError('zero admitted-state capacity created a root')
    return {'create':creation,'checkpoint':cp,'profile_entry_meter_limits':entries,'tight_complete_create_boundaries':boundaries,'zero_initial_state':initial_state}

def serialization_reserve():
    from eaie import data
    value={'large':'x'*4096}
    with metered(20000000) as baseline:data.canonical(value)
    selected=baseline.total-4000;calls=[];original=data.json.dumps
    def watched(v,*args,**kwargs):
        if type(v) is dict:calls.append(data.METER.get().limit-data.METER.get().total)
        return original(v,*args,**kwargs)
    data.json.dumps=watched
    try:
        try:
            with metered(selected) as limited:data.canonical(value)
        except Rejected as e:refusal=str(e)
        else:raise AssertionError('insufficient serialization work unexpectedly succeeded')
    finally:data.json.dumps=original
    assert not calls,(selected,calls)
    return {'selected':selected,'baseline':baseline.report(),'limited':limited.report(),'whole_object_encode_calls':calls,'refusal':refusal}

def publication_completion_budget():
    cases=[]
    for hooks in [False,True]:
        cap=DEFAULT_LIMITS['admission_work']
        for n in range(3):
            c=Core.create(out/('completion-'+str(hooks)+'-'+str(n)+'.db'),limits=dict(DEFAULT_LIMITS,admission_work=cap))
            r=c.prepare('j-completion','AdvanceTime',{'to':1})
            answer,peak=reserve_peak(lambda:c.admit(r,publication_hook=(lambda phase,entry:None) if hooks else None))
            assert answer['status']=='O1',answer
            used=c.last_work['total'];cases.append({'hooks':hooks,'selected':cap,'used':used,'peak_outer_reserve':peak,'status':answer['status'],'ordinal':c.snapshot().ordinal});cap=max(used,peak)
        for delta in [-1,1]:
            selected=cap+delta
            c=Core.create(out/('completion-'+str(hooks)+'-delta-'+str(delta)+'.db'),limits=dict(DEFAULT_LIMITS,admission_work=selected))
            r=c.prepare('j-completion','AdvanceTime',{'to':1});answer=c.admit(r,publication_hook=(lambda phase,entry:None) if hooks else None)
            ordinal=c.snapshot().ordinal
            assert (answer['status']=='O4' and ordinal==0) if delta<0 else (answer['status']=='O1' and ordinal==1),(selected,answer,ordinal)
            cases.append({'hooks':hooks,'selected':selected,'used':c.last_work['total'],'status':answer['status'],'ordinal':ordinal})
    return cases

def nested_phase_accounting():
    from eaie import data
    with metered(1000000) as parent:
        with metered(1000000) as child:data.canonical({'small':[1,2,3]})
    assert parent.total==child.total and parent.total>0
    original_dump=data.json.dumps;dump_calls=[]
    def watched_dump(v,*args,**kwargs):
        if type(v) is dict:dump_calls.append(True)
        return original_dump(v,*args,**kwargs)
    data.json.dumps=watched_dump
    try:
        try:
            with metered(4236) as tight_parent:
                with metered(20000000) as ample_child:data.canonical({'large':'x'*4096})
        except Rejected as e:reserve_refusal=str(e)
        else:raise AssertionError('child ignored insufficient parent serialization work')
    finally:data.json.dumps=original_dump
    assert not dump_calls
    c=Core.create(out/'failed-nested.db',limits=dict(DEFAULT_LIMITS,admission_work=1400000,cold_work=1000000))
    r=c.prepare('j-nested','AdvanceTime',{'to':1});original=data.Work.charge;depth=[0];origin={'requested':0,'successful':0}
    def observed(self,n,stage):
        top=depth[0]==0
        if top:origin['requested']+=n
        depth[0]+=1
        try:value=original(self,n,stage)
        finally:depth[0]-=1
        if top:origin['successful']+=n
        return value
    data.Work.charge=observed
    try:answer=c.admit(r);reported=c.last_work
    finally:data.Work.charge=original
    assert answer['status']=='O4' and c.snapshot().ordinal==0
    assert reported['total']==origin['requested'],(reported,origin)
    assert origin['successful']<=1400000,origin
    return {'successful_nested_parent':parent.report(),'successful_nested_child':child.report(),'parent_tight_child_ample':{'parent':tight_parent.report(),'child':ample_child.report(),'whole_dump_calls':dump_calls,'refusal':reserve_refusal},'failed_native':{'answer':answer,'reported':reported,'originating_charges_once':origin}}

def source_read_reservation():
    from eaie import data
    original=Path.read_bytes;reads=[]
    def watched(path):
        if path.suffix=='.py':reads.append({'file':path.name,'bytes':path.stat().st_size})
        return original(path)
    Path.read_bytes=watched
    try:
        try:
            with metered(10000) as parent:
                with metered(20000000) as child:source_identity()
        except Rejected as e:refusal=str(e)
        else:raise AssertionError('source modules read under insufficient parent phase budget')
    finally:Path.read_bytes=original
    assert not [x for x in reads if x['bytes']>4096],reads
    source_case={'reads':reads,'parent':parent.report(),'child':child.report(),'refusal':refusal}
    reads=[]
    def watched_fixture(path):
        reads.append({'file':path.name,'bytes':path.stat().st_size})
        return original(path)
    Path.read_bytes=watched_fixture
    try:
        try:
            with metered(1) as fixture_parent:
                with metered(20000000) as fixture_child:data.literals()
        except Rejected as e:fixture_refusal=str(e)
        else:raise AssertionError('fixtures read under insufficient parent phase budget')
    finally:Path.read_bytes=original
    assert not reads,reads
    fixture_case={'reads':reads,'parent':fixture_parent.report(),'child':fixture_child.report(),'refusal':fixture_refusal}
    raw='['+','.join('"'+'x'*4096+'"' for _ in range(128))+']';decode_cases=[]
    for value in [raw,raw.encode()]:
        calls=[]
        def watched_conversion(frame,event,arg):
            if event not in ['c_call','c_return'] or getattr(arg,'__name__',None) not in ['encode','decode']:return
            obj=getattr(arg,'__self__',None)
            if type(obj) in [str,bytes] and len(obj)>4096:
                m=data.METER.get();remaining=[]
                while m is not None:remaining.append(m.limit-m.total);m=m.parent
                calls.append({'event':event,'method':arg.__name__,'length':len(obj),'remaining_inner_to_outer':remaining})
        sys.setprofile(watched_conversion)
        try:
            try:
                with metered(100) as decode_parent:
                    with metered(20000000) as decode_child:data.decode(value)
            except Rejected as e:decode_refusal=str(e)
            else:raise AssertionError('large decode ignored insufficient enclosing budget')
        finally:sys.setprofile(None)
        assert not calls,calls
        decode_cases.append({'type':type(value).__name__,'input_length':len(value),'conversion_calls':calls,'parent':decode_parent.report(),'child':decode_child.report(),'refusal':decode_refusal})
    v=['x'*4096 for _ in range(128)]
    with metered(20000000) as canonical_work:data.canonical(v)
    calls=[];sys.setprofile(watched_conversion)
    try:
        try:
            with metered(canonical_work.total+100) as digest_parent:
                with metered(20000000) as digest_child:data.digest(v)
        except Rejected as e:digest_refusal=str(e)
        else:raise AssertionError('large hash encoding ignored insufficient enclosing budget')
    finally:sys.setprofile(None)
    assert not calls,calls
    return {'source':source_case,'fixtures':fixture_case,'raw_decode_conversions':decode_cases,'digest_conversion':{'canonical_work':canonical_work.report(),'conversion_calls':calls,'parent':digest_parent.report(),'child':digest_child.report(),'refusal':digest_refusal}}

def exact_request_boundary():
    cap=DEFAULT_LIMITS['request_bytes']
    for n in range(3):
        c=Core.create(out/('request-size-calibration-'+str(n)+'.db'),limits=dict(DEFAULT_LIMITS,request_bytes=cap))
        r=c._prepare('j-request','AdvanceTime',{'to':1})
        cap=len(json.dumps(r,sort_keys=True,separators=(',',':'),ensure_ascii=True).encode())
    cases=[]
    for delta in [-1,0,1]:
        selected=cap+delta;c=Core.create(out/('request-boundary-'+str(delta)+'.db'),limits=dict(DEFAULT_LIMITS,request_bytes=selected))
        raw=c._prepare('j-request','AdvanceTime',{'to':1});actual=len(json.dumps(raw,sort_keys=True,separators=(',',':'),ensure_ascii=True).encode())
        if delta>=0:assert actual<=selected and c.prepare('j-request','AdvanceTime',{'to':1})==raw
        answer=c.admit(raw)
        if delta<0:assert answer['status']=='O4' and c.snapshot().ordinal==0
        else:
            assert answer['status']=='O1' and c.admit(raw)['status']=='O3',(actual,selected,answer)
        cases.append({'selected':selected,'actual_canonical_bytes':actual,'answer':answer,'ordinal':c.snapshot().ordinal})
    return cases

def closure_cost():
    from eaie.data import closure,GRAPH,ESSENTIAL
    with metered(20000000) as work:answer=closure(GRAPH,ESSENTIAL)
    assert answer['edges_visited']==16 and len(answer['protected'])==11
    assert work.stages['closure_edge_visit']==16 and work.stages['closure_node_visit']>=11
    assert work.stages['full_key_sort']>0
    try:
        with metered(0):closure(GRAPH,ESSENTIAL)
    except Rejected as e:refusal=str(e)
    else:raise AssertionError('graph closure still bypasses zero work budget')
    return {'answer':answer,'work':work.report(),'zero_budget_refusal':refusal}

def snapshot_guard():
    from eaie.core import Snapshot
    from eaie.atlas import inspect as diagnostic
    c=Core.create(out/'snapshot-guard.db');valid=c.snapshot()
    empty=object.__new__(Snapshot);partial=object.__new__(Snapshot)
    object.__setattr__(partial,'state',valid.state);object.__setattr__(partial,'census',valid.census)
    malformed=c.snapshot();object.__delattr__(malformed,'head')
    cases={name:diagnostic(value) for name,value in [('empty',empty),('partial',partial),('issued_missing_head',malformed)]}
    assert all(v=={'status':'O5','reason':'unverified_snapshot'} for v in cases.values())
    assert diagnostic(valid)=={'status':'O5','reason':'unavailable'}
    assert diagnostic(valid,'author','current')['status']=='available'
    return cases

def publication():
    cases=[]
    for phase in ['before_write','before_commit','commit_enter','after_commit']:
        c=Core.create(out/('pub-'+phase+'.db'));r=c.prepare('pub','AdvanceTime',{'to':1});nested=[]
        def hook(p,e):
            if p==phase:nested.append(c.admit(r))
        answer=c.admit(r,publication_hook=hook);s=c.snapshot()
        assert nested and nested[0]['status']=='O4'
        if phase in ['before_write','before_commit']:assert answer['status']=='O4' and s.ordinal==0
        else:assert answer['status']=='O5' and s.ordinal==(1 if phase=='after_commit' else 0)
        if phase=='after_commit':
            assert c.admit(r)['reason']=='RECONCILIATION_REQUIRED';c.reconcile();assert c.admit(r)['status']=='O3'
        cases.append({'phase':phase,'answer':answer,'ordinal':s.ordinal})
    c=Core.create(out/'pub-async.db');r=c.prepare('pub','AdvanceTime',{'to':1})
    async def awaitable():return None
    def sync_returns_async(p,e):return awaitable()
    answer=c.admit(r,publication_hook=sync_returns_async);assert answer['status']=='O4' and c.snapshot().ordinal==0
    return cases+[{'sync_async_return':answer}]

def aggregate_guard():
    limits=dict(DEFAULT_LIMITS,logical_bytes=65536);c=Core.create(out/'aggregate.db',limits=limits)
    db=sqlite3.connect(out/'aggregate.db');db.execute('INSERT INTO history VALUES (1,?,?)',('invalid',' '*30000));db.execute('INSERT INTO checkpoints VALUES (1,?)',(' '*30000,));db.commit();db.close()
    import eaie.core as core
    original=core.decode;calls=[]
    def watched(*args,**kwargs):calls.append(len(args[0]));return original(*args,**kwargs)
    core.decode=watched
    try:
        try:c.snapshot()
        except Unavailable as e:reason=str(e)
        else:raise AssertionError('aggregate oversized corrupt DB accepted')
    finally:core.decode=original
    assert reason=='PREDECODE_AGGREGATE_BYTES' and not calls,(reason,calls)
    return {'reason':reason,'decode_calls':calls}

def mixed16():
    c=Core.create(out/'mixed16.db');admissions=[];first=None
    def a(n,k,p):
        nonlocal first
        r,v=submit(c,'j-mixed-'+str(n),k,p);admissions.append(v)
        if first is None:first=r
        return v
    a(1,'AssertClaim',claim())
    a(2,'Refer',{'actor':'alice','source':'h1','body':'J report','targets':[{'kind':'container','id':'receiver-inbox'}],'source_assertion':'J selected referral','disclose_origin':False,'organization':'receiver','create_case':True,'dispatcher':'dispatcher'})
    case=state(c)['organization']['cases'][0]['id'];task=state(c)['organization']['tasks'][0]['id']
    a(3,'AssignTask',{'actor':'dispatcher','task':task,'assignee':'handler'})
    notice=c.holder_view('handler');assert notice['receipts']==[{'handle':'h1','kind':'notice','record_handle':'h1','available':True}]
    a(4,'AcquireRecord',{'actor':'handler','notice':'h1'})
    a(5,'TransitionCase',{'actor':'handler','case':case,'state':'in_review','evidence':'h2'})
    a(6,'RecordDecision',{'actor':'handler','case':case,'evidence':'h2','policy':'reference-true-v1','reason':'J first decision'})
    decision=state(c)['organization']['decisions'][0]['id']
    effect_request=c.prepare('j-mixed-7','ApplyReferenceEffect',{'actor':'handler','decision':decision});effect=c.admit(effect_request);assert effect['status']=='O1';admissions.append(effect)
    a(8,'TransitionCase',{'actor':'handler','case':case,'state':'closed','evidence':'h2'})
    a(9,'AssertClaim',claim('J new evidence','h1'))
    a(10,'Deliver',{'actor':'alice','source':'h2','body':'J new evidence','targets':[{'kind':'actor','id':'handler'}],'source_assertion':'J new source','disclose_origin':False})
    a(11,'TransitionCase',{'actor':'handler','case':case,'state':'queued','evidence':'h3'})
    newtask=state(c)['organization']['cases'][0]['task'];assert newtask!=task
    a(12,'AssignTask',{'actor':'dispatcher','task':newtask,'assignee':'handler'})
    a(13,'AcquireRecord',{'actor':'handler','notice':'h4'})
    a(14,'TransitionCase',{'actor':'handler','case':case,'state':'in_review','evidence':'h3'})
    a(15,'RecordDecision',{'actor':'handler','case':case,'evidence':'h3','policy':'reference-true-v1','reason':'J reassessment'})
    a(16,'AdvanceTime',{'to':1})
    with metered(20000000) as work:s=c.snapshot()
    assert s.ordinal==16 and s.state['families']['Env']['ReferenceCounter']['value']==1
    tasks=s.state['organization']['tasks'];assert len(tasks)==2 and tasks[0]['state']=='closed' and tasks[0]['enqueued']<tasks[1]['enqueued']
    assert len(s.state['organization']['decisions'])==2 and s.census['cold_work']>=work.total
    assert c.admit(first)['status']=='O3';retry_work=c.last_work
    assert retry_work['total']<=20000000
    assert c.admit(effect_request)['status']=='O3'
    duplicate=c.admit(c.prepare('j-duplicate-effect','ApplyReferenceEffect',{'actor':'handler','decision':decision}));assert duplicate['status']=='O4' and 'EFFECT_CREDIT_CONSUMED' in duplicate['reason'],duplicate
    before=hashlib.sha256((out/'mixed16.db').read_bytes()).hexdigest()
    views={}
    for actor in ['alice','handler','dispatcher','outsider','player']:
        for cutoff in [0,4,16]:
            views[actor+':'+str(cutoff)]=c.holder_view(actor,cutoff=cutoff)
            assert c.last_query_work['total']<=20000000
    assert c.holder_view('outsider',handle='h1')==c.holder_view('outsider',handle='unknown')=={'status':'unavailable'}
    assert hashlib.sha256((out/'mixed16.db').read_bytes()).hexdigest()==before
    records=list(s.state['information']['versions'])+list(s.state['information']['receipts'])+list(s.state['information']['transmissions'])+list(s.state['information']['derivations'])
    byid={x['id']:x for x in records}
    for record in records:
        for parent in record['parents']:
            assert parent in byid and (byid[parent]['seq'],byid[parent]['pos'])<(record['seq'],record['pos'])
    (out/'oldest-request.json').write_text(canonical(first))
    child="import sys,json;sys.path.insert(0,sys.argv[1]);from eaie import Core;c=Core(sys.argv[2]);s=c.snapshot();r=json.load(open(sys.argv[3]));a=c.admit(r);assert s.ordinal==16 and a['status']=='O3';assert c.holder_view('handler',cutoff=4)['receipts'][1]['body']=='J report';print(json.dumps({'ordinal':s.ordinal,'oldest':a,'cold':c.last_cold_work,'retry':c.last_work,'boundary':c.inspect('boundary'),'receipt':c.inspect('receipt',operation='j-mixed-1')}))"
    fresh=subprocess.run([sys.executable,'-B','-c',child,str(out/'source'),str(out/'mixed16.db'),str(out/'oldest-request.json')],capture_output=True,text=True)
    assert fresh.returncode==0,fresh.stderr
    return {'admissions':len(admissions),'cold_actual':work.report(),'census':dict(s.census),'oldest_retry_actual':retry_work,'duplicate_effect':duplicate,'notice':notice,'views':views,'fresh_process':json.loads(fresh.stdout),'causal_records':len(records),'db_sha256_after_read_queries':before}

for name,fn in [('IJ01_observation_closure',observation),('IJ02_optional_closure',optional),('IJ03_phase_closure',reduced_work),('IJ05_closure_cost',closure_cost),('IJ06_snapshot_guard',snapshot_guard),('IJ07_serialization_reserve',serialization_reserve),('IJ08_publication_completion_budget',publication_completion_budget),('BH02_nested_phase_accounting',nested_phase_accounting),('IJ09_source_read_reservation',source_read_reservation),('IT09_exact_request_boundary',exact_request_boundary),('publication_reentrancy_async',publication),('aggregate_predecode_guard',aggregate_guard),('IJ04_complete_cold_mixed16',mixed16)]:probe(name,fn)
print(json.dumps({'source':result['source'],'out':str(out),'status':{k:v['status'] for k,v in result['probes'].items()}},indent=2))
sys.exit(0 if all(x['status']=='PASS' for x in result['probes'].values()) else 1)
