"""Independent identity, publication, strict-data and retained-proof controls."""
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys
from verify_independent import SOURCE, encoded, plain, save, sql_oracle


def register(t):
    def identity_retry():
        c=t.new('identity-retry'); r=c.prepare('first','AdvanceTime',{'to':1})
        a=c.admit(r); assert a['status']=='O1'; t.oldest[str(c.path)]=(plain(r),plain(a))
        t.call(c,'second','AdvanceTime',{'to':2})
        assert c.admit(r)=={'status':'O3','receipt':a['receipt']}
        for field in ('world','lineage','producer','incarnation'):
            bad=plain(r); bad['key'][field]='foreign'
            before=t.state(c); out=c.admit(bad); assert out['status']=='O4',(field,out)
            assert t.state(c)==before
        assert c.admit(r,caller={'producer':'test-producer','incarnation':'e2'})['status']=='O4'
        bad=plain(r);bad['params']['to']=3
        assert c.admit(bad)['status']=='O4'
        stale=c.prepare('stale','AdvanceTime',{'to':4});t.call(c,'third','AdvanceTime',{'to':3})
        assert c.admit(stale)['status']=='O4'
        assert c.admit(r,lookup=True)=={'status':'O3','receipt':a['receipt']}
        assert c.admit(c.prepare('unknown','AdvanceTime',{'to':4}),lookup=True)['status']=='O4'
        t.preserved(c)
    t.run('C1-identity-scope-exact-retry-before-staleness',identity_retry)

    def capture_and_result():
        c=t.new('capture');r=c.prepare('captured','AdvanceTime',{'to':1});original=plain(r)
        seen=[]
        def hook(phase,protected,value):
            seen.append(phase)
            if phase=='validate':r['params']['to']=9;r['key']['operation']='mutated'
        a=c.admit(r,hook=hook);assert a['status']=='O1',a
        assert t.state(c)['clock']['now']==1 and 'validate' in seen
        assert c.admit(original)['status']=='O3'
        t.oldest[str(c.path)]=(original,plain(a))
        r=c.prepare('supplied','AdvanceTime',{'to':2},mode='supplied');v=c.preview(r);original_v=plain(v)
        def result_hook(phase,protected,value):
            if phase=='resolve':v['id']='mutation'
        a=c.admit(r,supplied=v,hook=result_hook);assert a['status']=='O1',a
        assert c.admit(r,supplied=original_v)['status']=='O3'
        assert c.admit(r,supplied=v)['status']=='O4'
        bad=plain(original_v);bad['dependencies']['policy']='foreign'
        assert c.admit(r,supplied=bad)['status']=='O4'
        t.preserved(c)
    t.run('C1-captured-request-result-alias-result-conflicts',capture_and_result)

    def hook_boundaries():
        for phase in ('validate','resolve','final'):
            for fault in ('throw','false','protected-write','reentrant'):
                c=t.new('hook-'+phase+'-'+fault);r=c.prepare('outer','AdvanceTime',{'to':1})
                nested=c.prepare('nested','AdvanceTime',{'to':2});prior=t.state(c);observed=[]
                def hook(at,protected,value):
                    if at!=phase:return
                    observed.append(at)
                    if fault=='throw':raise RuntimeError('I-controlled')
                    if fault=='false':return False
                    if fault=='protected-write':protected['params']['to']=3
                    if fault=='reentrant':
                        x=t.Core(c.path).admit(nested);assert x['status']=='O4',x
                a=c.admit(r,hook=hook);assert observed and a['status']=='O4',(phase,fault,a)
                assert t.state(c)==prior
                a=c.admit(r);assert a['status']=='O1';assert c.admit(r)['status']=='O3'
        c=t.new('async-hook');r=c.prepare('async','AdvanceTime',{'to':1})
        async def delayed(*a):return True
        assert c.admit(r,hook=delayed)['status']=='O4'
        assert c.admit(r,publication_hook=delayed)['status']=='O4'
        assert c.admit(r,supplied=object())['status']=='O4'
    t.run('C1-pure-hooks-faults-reentrancy-async',hook_boundaries)

    def publication_reentrancy():
        for phase in ('before_write','before_commit'):
            for call in ('admit','checkpoint'):
                c=t.new('publication-reentrant-'+phase+'-'+call);before=t.state(c)
                r=c.prepare('outer','AdvanceTime',{'to':1});nested=c.prepare('nested','AdvanceTime',{'to':2})
                seen=[]
                def hook(at,entry):
                    if at==phase:
                        x=t.Core(c.path).admit(nested) if call=='admit' else t.Core(c.path).checkpoint()
                        seen.append(x);assert x['status']=='O4',x
                a=c.admit(r,publication_hook=hook)
                assert seen and a['status']=='O4',(phase,call,a)
                assert t.state(c)==before
        for phase in ('before_write','before_commit'):
            c=t.new('publication-awaitable-'+phase);before=t.state(c)
            async def pending():return True
            def hook(at,entry):
                if at==phase:return pending()
            a=c.admit(c.prepare('outer','AdvanceTime',{'to':1}),publication_hook=hook)
            assert a['status']=='O4',(phase,a)
            assert t.state(c)==before
    t.run('C1-publication-hook-reentrancy-awaitable-refusal',publication_reentrancy)

    def faults():
        detail=[]
        for phase in ('before_write','before_commit','commit_enter','during_commit','after_commit','after_ack'):
            c=t.new('process-'+phase);before=t.state(c)
            cmd=[sys.executable,'-B',str(Path(__file__).with_name('fault_worker.py')),str(c.path),phase]
            child=subprocess.run(cmd,cwd=SOURCE,capture_output=True,text=True,timeout=120,
                                 env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1'))
            save(c.path.parent/'child.json',{'command':cmd,'exit':child.returncode,'stdout':child.stdout,'stderr':child.stderr})
            assert child.returncode==(93 if phase=='during_commit' else 91),(phase,child.stderr,child.stdout)
            cold=t.Core(c.path);s=cold.snapshot();published=s.ordinal==1
            if phase in ('before_write','before_commit'):assert not published
            if phase in ('after_commit','after_ack'):assert published
            r=json.loads((c.path.parent/'request.json').read_text(encoding='utf8'))
            a=cold.admit(r);assert a['status']==('O3' if published else 'O1'),a
            assert cold.snapshot().ordinal==1 and plain(cold.snapshot().state)['clock']['now']==1
            t.oldest[str(c.path)]=(r,{'receipt':a['receipt']})
            t.preserved(cold);detail.append({'phase':phase,'published_at_interrupt':published,'retry':a})
        return detail
    t.run('M4-six-real-process-publication-windows',faults)

    def uncertainty_and_backend():
        c=t.new('uncertainty');r=c.prepare('lost-response','AdvanceTime',{'to':1})
        def hook(phase,entry):
            if phase=='after_commit':raise OSError('I lost acknowledgement')
        a=c.admit(r,publication_hook=hook);assert a['status']=='O5',a
        assert c.admit(r)['status']=='O5'
        reconciled=c.reconcile();assert reconciled['ordinal']==1,reconciled
        retry=c.admit(r);assert retry['status']=='O3'
        t.oldest[str(c.path)]=(plain(r),plain(retry));t.preserved(c)
        for fault in ('full','readonly'):
            c=t.new('backend-'+fault);before=t.state(c);r=c.prepare('failure','AdvanceTime',{'to':1})
            a=c.admit(r,backend_fault=fault);assert a['status']=='O4',a
            assert t.state(c)==before
            assert c.admit(r)['status']=='O1'
    t.run('C1-backend-failures-uncertainty-reconcile-exact-once',uncertainty_and_backend)

    def mandatory_corruption():
        c=t.new('mandatory-corruption');h=t.claim(c);t.deliver(c,'alice',h,[('actor','handler')])
        before_bytes=c.path.read_bytes()
        try:t.Core.create(c.path)
        except t.Rejected:pass
        else:raise AssertionError('existing world overwritten')
        assert c.path.read_bytes()==before_bytes
        c.checkpoint();expected={'seq':c.snapshot().ordinal,'head':c.snapshot().head}
        def attack(name,sql,values=()):
            path=c.path.parent/(name+'.db');shutil.copy2(c.path,path)
            with sqlite3.connect(path) as db:db.execute(sql,values)
            try:t.Core(path,expected=expected).snapshot()
            except t.Unavailable:return
            raise AssertionError('mandatory corruption accepted: '+name)
        attack('root-missing','DELETE FROM root')
        attack('first-missing','DELETE FROM history WHERE seq=1')
        attack('last-missing','DELETE FROM history WHERE seq=2')
        attack('meta-missing','DELETE FROM meta')
        attack('operation-index','UPDATE history SET opkey=? WHERE seq=1',('foreign',))
        attack('root-noncanonical',"UPDATE root SET payload=' '||payload")
        attack('history-noncanonical',"UPDATE history SET payload=' '||payload")
        attack('meta-noncanonical',"UPDATE meta SET payload=' '||payload")
        attack('extra-table','CREATE TABLE foreign_state(payload TEXT)')
        with sqlite3.connect(c.path) as db:
            root=json.loads(db.execute('SELECT payload FROM root').fetchone()[0])
            entry=json.loads(db.execute('SELECT payload FROM history WHERE seq=2').fetchone()[0])
        for field in ('source','contracts','authority','profile','initial'):
            bad=copy.deepcopy(root);bad[field]='foreign'
            attack('root-'+field,'UPDATE root SET payload=?',(encoded(bad).decode(),))
        for field in ('receipt','request','result','state','previous','head'):
            bad=copy.deepcopy(entry);bad[field]={} if isinstance(bad[field],dict) else 'foreign'
            attack('entry-'+field,'UPDATE history SET payload=? WHERE seq=2',(encoded(bad).decode(),))
        def native_head(e):
            return hashlib.sha256(encoded({'domain':'EA-IE-head/1','previous':e['previous'],'seq':e['seq'],
                 'request':e['request'],'result':e['result'],'state':e['state']})).hexdigest()
        assert native_head(entry)==entry['head'],'independent head-domain oracle disagrees'
        forged=copy.deepcopy(entry);forged['state']['information']['receipts'][-1]['body']='FORGED'
        forged['head']=native_head(forged);forged['receipt']['head']=forged['head']
        path=c.path.parent/'self-consistently-rehashed-false-state.db';shutil.copy2(c.path,path)
        with sqlite3.connect(path) as db:
            meta=json.loads(db.execute('SELECT payload FROM meta').fetchone()[0]);meta['head']=forged['head']
            db.execute('UPDATE history SET payload=? WHERE seq=2',(encoded(forged).decode(),))
            db.execute('UPDATE meta SET payload=?',(encoded(meta).decode(),))
        try:t.Core(path).snapshot()
        except t.Unavailable:pass
        else:raise AssertionError('self-consistent hashes substituted for full semantic replay')
        padded=c.path.parent/'padding.db';shutil.copy2(c.path,padded)
        with padded.open('ab') as f:f.write(b'\0'*2097152)
        try:t.Core(padded).snapshot()
        except t.Unavailable:pass
        else:raise AssertionError('backend padding ignored')
        before=t.state(c)
        invalids=['{','{"a":1,"a":2}','{"a":NaN}','{"a":1.5}',' '*5000,' {"seq":0}',
                  '{"arbitrary":"'+'x'*5000+'"}',b'\xff',b'\xff'*5000]
        for index,payload in enumerate(invalids):
            path=c.path.parent/('invalid-accelerator-'+str(index)+'.db');shutil.copy2(c.path,path)
            with sqlite3.connect(path) as db:db.execute('UPDATE checkpoints SET payload=?',(payload,))
            recovered=t.Core(path).snapshot()
            assert plain(recovered.state)==before,(index,payload[:50])
            independent=sql_oracle(path)
            assert recovered.census['logical_bytes']==independent['encoded_prefix_bytes'],(index,plain(recovered.census),independent['encoded_prefix_bytes'])
            assert 'ignored_invalid_accelerator' in recovered.stores['9-proof-index']['accelerator_status']
        with sqlite3.connect(c.path) as db:db.execute('DELETE FROM checkpoints')
        assert t.state(c)==before
        t.preserved(c)
    t.run('C1-whole-prefix-mandatory-loss-corruption-optional-cache',mandatory_corruption)

    def strict_data():
        from eaie.data import decode,canonical
        for raw in ('{"a":1,"a":2}','{"a":1.2}','{"a":NaN}','{"a":Infinity}',
                    '['*25+'0'+']'*25,'{"a":9007199254740992}',
                    json.dumps({'a':'x'*4097}),json.dumps({'a':[0]*257})):
            try:decode(raw)
            except Exception:pass
            else:raise AssertionError('strict input accepted '+raw[:60])
        for n in (511,512):
            c=t.new('fragment-'+str(n));t.claim(c,body='x'*n)
        c=t.new('fragment-513');p={'actor':'alice','body':'x'*513,
          'subject':{'kind':'alleged','scope':'alice','label':'test'},'value':'TRUE','source_assertion':'x',
          'valid_until':None,'corrects':None}
        t.refuse(c,'oversized','AssertClaim',p)
        assert decode('{"a":"[\\\"{}]"}')=={'a':'["{}]'}
        assert canonical({'z':'\u00e9','a':1}).encode()==encoded({'a':1,'z':'\u00e9'})
        for x in (0,1,9007199254740991,-9007199254740991):assert decode(str(x))==x
        for n in (999999,1000000):
            c=t.new('time-'+str(n));t.call(c,'time','AdvanceTime',{'to':n})
        c=t.new('time-one-over');t.refuse(c,'time','AdvanceTime',{'to':1000001})
    t.run('M4-strict-json-lexical-unicode-fragment-time-boundaries',strict_data)

    def target_atomicity():
        c=t.new('targets');h=t.claim(c)
        targets=[{'kind':'actor','id':a} for a in ('observer','dispatcher','handler','outsider')]
        for n in (3,4):
            t.call(c,'targets-'+str(n),'Deliver',{'actor':'alice','source':h,'body':'selected X',
              'targets':targets[:n],'source_assertion':'x','disclose_origin':False})
        for name,values in [('duplicate',targets[:1]*2),('one-over',targets+[{'kind':'actor','id':'player'}])]:
            t.refuse(c,name,'Deliver',{'actor':'alice','source':h,'body':'selected X',
              'targets':values,'source_assertion':'x','disclose_origin':False})
        t.preserved(c)
    t.run('M4-targets-minus-at-plus-atomic-refusal',target_atomicity)

    def phase_work_caps():
        from eaie.profile import DEFAULT_LIMITS
        L=dict(DEFAULT_LIMITS,admission_work=0)
        try:c=t.new('zero-create-work',limits=L)
        except (t.Rejected,t.Unavailable):pass
        else:raise AssertionError('root publication succeeded with zero admission_work')
        c=t.new('zero-checkpoint-work',limits=dict(DEFAULT_LIMITS,checkpoint_work=0))
        before=sql_oracle(c.path)['tables'];a=c.checkpoint()
        assert a['status']=='O4',a
        assert sql_oracle(c.path)['tables']==before
        for field in ('cold_work','retry_work','query_work','memory_bytes','workspace_bytes','logical_bytes','state_bytes'):
            try:t.new('root-one-'+field,limits=dict(DEFAULT_LIMITS,**{field:1}))
            except (t.Rejected,t.Unavailable):pass
            else:raise AssertionError('root certified incapable '+field)
    t.run('M4-create-checkpoint-future-phase-work-caps',phase_work_caps)

    def native_registry_bounds():
        from eaie.profile import DEFAULT_LIMITS
        c=t.new('registry-reference');entities=t.state(c)['identity']['entities']
        counts={kind:sum(v['kind']==kind and v['live'] for v in entities.values())
                for kind in ('actor','organization')}
        assert counts['actor']==8 and counts['organization']==4,counts
        for field,kind in [('actors','actor'),('organizations','organization')]:
            count=counts[kind]
            for delta in (-1,0,1):
                if count+delta>DEFAULT_LIMITS[field]:
                    try:t.new('registry-'+field+'-unsupported-plus',limits=dict(DEFAULT_LIMITS,**{field:count+delta}))
                    except t.Rejected:pass
                    else:raise AssertionError('approved cap silently raised')
                    continue
                try:w=t.new('registry-'+field+'-'+str(delta),limits=dict(DEFAULT_LIMITS,**{field:count+delta}))
                except (t.Rejected,t.Unavailable):
                    assert delta==-1,(field,delta);continue
                assert delta>=0,('native registry exceeds admitted profile',field,count,count+delta)
                assert sum(v['kind']==kind and v['live'] for v in t.state(w)['identity']['entities'].values())<=count+delta
    t.run('M4-native-L0-actor-org-boundaries',native_registry_bounds)

    def observation_context_and_ordinals():
        from eaie.fixtures import OBSERVATION
        c=t.new('observation-context');t.call(c,'time','AdvanceTime',{'to':6})
        assert t.state(c)['families']['Env']['D']['blocked'] is False
        t.refuse(c,'stale-observation','Observe',plain(OBSERVATION))
        c=t.new('admission-ordinal');t.call(c,'multi-due','AdvanceTime',{'to':10})
        h=t.claim(c)
        assert c.snapshot().ordinal==2
        assert t.receipts(c,'alice')[-1]['seq']==2
        assert t.items(c,'alice',cutoff=1)['receipts']==[]
        assert t.items(c,'alice',cutoff=2)['receipts'][0]['handle']==h
        t.preserved(c)
    t.run('M2-observation-current-context-and-native-admission-cutoffs',observation_context_and_ordinals)

    def full_api_work():
        from eaie.data import Work,metered
        from eaie.profile import DEFAULT_LIMITS
        c=t.new('full-api-work');r=c.prepare('first','AdvanceTime',{'to':1})
        assert c.admit(r)['status']=='O1'
        def measured(call):
            observations=[];original=Work.charge;depth=0
            def spy(self,n,stage):
                nonlocal depth
                # These stages transfer already observed nested-meter work to
                # their parent. Actual primitive charges are counted once.
                if depth==0 and stage not in ('scratch_cold_replay','prospective_retry_comparisons',
                                 'prospective_snapshot_output','verified_snapshot',
                                 'prospective_holder_recipe','prospective_author_recipe','complete_root_creation'):
                    observations.append((stage,n))
                depth+=1
                try:return original(self,n,stage)
                finally:depth-=1
            Work.charge=spy
            try:
                with metered(100000000):answer=call()
            finally:Work.charge=original
            stages={}
            for stage,n in observations:stages[stage]=stages.get(stage,0)+n
            return answer,{'total':sum(stages.values()),'stages':stages}
        snap,snapshot_work=measured(c.snapshot)
        created,create_work=measured(lambda:t.new('full-api-create-observed'))
        retry,retry_work=measured(lambda:c.admit(r))
        view,query_work=measured(lambda:c.holder_view('alice',limit=4))
        boundary,boundary_work=measured(lambda:c.inspect(query='boundary'))
        receipt,receipt_work=measured(lambda:c.inspect(query='receipt',operation='first'))
        checkpoint,checkpoint_work=measured(c.checkpoint)
        save(c.path.parent/'independent-api-work.json',{'snapshot':snapshot_work,'retry':retry_work,
            'holder_query':query_work,'boundary_query':boundary_work,'receipt_query':receipt_work,
            'create_actual':create_work,'create_reported':plain(getattr(created,'last_work',None)),
            'checkpoint_actual':checkpoint_work,'checkpoint_result':checkpoint,'reported':plain(snap.census)})
        assert retry['status']=='O3' and view['status']=='ok'
        assert snapshot_work['total']<=DEFAULT_LIMITS['cold_work']
        assert retry_work['total']<=DEFAULT_LIMITS['retry_work']
        assert max(query_work['total'],boundary_work['total'],receipt_work['total'])<=DEFAULT_LIMITS['query_work']
        assert checkpoint['status']=='checkpointed' and checkpoint_work['total']<=DEFAULT_LIMITS['checkpoint_work']
        assert create_work['total']<=DEFAULT_LIMITS['admission_work']
        assert created.last_work['total']>=create_work['total'],('create census omits API configuration work',create_work,created.last_work)
        assert snap.census['cold_work']>=snapshot_work['total'],('cold census omits API work',snapshot_work['total'],plain(snap.census))
    t.run('M4-independent-full-cold-retry-promised-query-work',full_api_work)

    def integrated_uncertainty():
        c=t.new('integrated-uncertainty');h=t.claim(c)
        def once_across_faults(name,kind,params):
            request=c.prepare(name,kind,params);before=t.state(c)
            def before_commit(phase,entry):
                if phase=='before_commit':raise OSError('I precommit refusal')
            out=c.admit(request,publication_hook=before_commit)
            assert out['status']=='O4',out
            assert t.state(c)==before
            def after_commit(phase,entry):
                if phase=='after_commit':raise OSError('I acknowledgement lost')
            out=c.admit(request,publication_hook=after_commit);assert out['status']=='O5',out
            assert c.admit(request)['status']=='O5'
            reconciled=c.reconcile();assert reconciled['status']=='verified'
            after=t.state(c);retry=c.admit(request)
            assert retry['status']=='O3' and t.state(c)==after
            assert c.admit(request)==retry
            return retry
        once_across_faults('referral','Refer',{'actor':'alice','source':h,'body':'selected X',
            'targets':[{'kind':'container','id':'receiver-inbox'}],'source_assertion':'selected source',
            'disclose_origin':False,'organization':'receiver','create_case':True,'dispatcher':'dispatcher'})
        org=t.state(c)['organization'];case=org['cases'][0];task=org['tasks'][0]
        assert len(org['cases'])==len(org['tasks'])==1
        assert len(t.receipts(c,'receiver-inbox',content=False))==1
        assert len(t.receipts(c,'dispatcher',content=False))==1
        t.call(c,'assign','AssignTask',{'actor':'dispatcher','task':task['id'],'assignee':'handler'})
        notice=t.receipts(c,'handler',content=False)[-1]['handle']
        t.call(c,'acquire','AcquireRecord',{'actor':'handler','notice':notice})
        evidence=t.receipts(c,'handler')[-1]['handle']
        t.call(c,'review','TransitionCase',{'actor':'handler','case':case['id'],'state':'in_review','evidence':evidence})
        t.call(c,'decision','RecordDecision',{'actor':'handler','case':case['id'],'evidence':evidence,
            'policy':'reference-true-v1','reason':'explicit information basis'})
        decision=t.state(c)['organization']['decisions'][0]
        once_across_faults('effect','ApplyReferenceEffect',{'actor':'handler','decision':decision['id']})
        assert t.state(c)['families']['Env']['ReferenceCounter']['value']==1
        assert len(t.state(c)['reference_effects'])==1
        t.refuse(c,'new-effect-key','ApplyReferenceEffect',{'actor':'handler','decision':decision['id']})
        t.call(c,'close','TransitionCase',{'actor':'handler','case':case['id'],'state':'closed','evidence':evidence})
        fresh=t.claim(c,actor='alice',body='fresh evidence',name='fresh-claim')
        t.deliver(c,'alice',fresh,[('actor','handler')],body='fresh evidence',name='fresh-delivery')
        newevidence=t.receipts(c,'handler')[-1]['handle']
        once_across_faults('reopen','TransitionCase',{'actor':'handler','case':case['id'],'state':'queued','evidence':newevidence})
        org=t.state(c)['organization'];assert len(org['cases'])==1 and len(org['tasks'])==2
        assert org['tasks'][0]['state']=='closed'
        assert org['tasks'][1]['previous']==org['tasks'][0]['id']
        assert org['tasks'][1]['enqueued']>org['tasks'][0]['enqueued']
        assert len(t.state(c)['reference_effects'])==1
        t.preserved(c)
    t.run('M3-M4-integrated-referral-reopen-effect-fault-reconcile-once',integrated_uncertainty)
