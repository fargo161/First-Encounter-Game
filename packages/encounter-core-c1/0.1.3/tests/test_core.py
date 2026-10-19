import unittest,os,json,sqlite3,shutil,tempfile,copy as cp
from pathlib import Path
from eac1 import Core,Unavailable
from eac1.data import copy,canonical,digest,closure
from eac1.core import DEFAULT_LIMITS,Snapshot
from eac1.atlas import inspect
from reference import trace,reachable,work,text,sha

ROOT=Path(os.environ['EA_C1_TEST_OUT']) if 'EA_C1_TEST_OUT' in os.environ else Path(tempfile.mkdtemp(prefix='ea-c1-tests-'))
ROOT.mkdir(parents=True,exist_ok=True)

class Cases(unittest.TestCase):
    def new(self,name='case',limits=None):
        p=Path(tempfile.mkdtemp(prefix=name+'-',dir=ROOT))/'world.db'
        return Core.create(p,limits)
    def ref(self,c,scene='S/1',actor=False,decoy=False,epoch=None,revision=1):
        if actor:selector='actor_0007' if scene=='T/1' else 'actor_0001';kind='actor'
        else:selector='mechanism_0009' if scene=='T/1' else ('mechanism_0002' if decoy else 'mechanism_0001');kind='mechanism'
        return c.qualified(scene,kind,selector,epoch or {'S/1':'s1','T/1':'t1','U/1':'u1','S/2':'s2'}[scene],revision)
    def req(self,c,name,q=1,scene='S/1',**kw):return c.prepare(name,'contribute',{'q':q},'D2' if scene=='U/1' else 'D',self.ref(c,scene),**kw)
    def do(self,c,name,kind,params=None,target=None,ref=None):
        r=c.prepare(name,kind,params,target,ref);out=c.admit(r);self.assertIn(out['status'],['O1','O2'],out);return r,out
    def unchanged_reject(self,c,r,**kw):
        old=canonical(c.snapshot().stores);out=c.admit(r,**kw);self.assertEqual(out['status'],'O4',out);self.assertEqual(canonical(c.snapshot().stores),old);return out
    def env(self,c):return copy(c.snapshot().state['families']['Env'])

    def test_T01_actor_and_parent_identity(self):
        c=self.new();self.assertEqual(c.resolve(self.ref(c,actor=True))['binding']['target'],'P')
        self.assertEqual(c.resolve(self.ref(c,'T/1',actor=True))['binding']['target'],'P')
        self.assertEqual(c.resolve(self.ref(c,'U/1',actor=True))['binding']['target'],'Q')
        for parent,entity in [('mechanism_0001','D'),('mechanism_0002','D2')]:
            r=c.qualified('S/1','point',parent+'/point_0001','s1',1);self.assertEqual(c.resolve(r)['binding']['target'],entity)
        bad=c.qualified('S/1','point','point_0001','s1',1);self.assertEqual(c.resolve(bad)['status'],'O5')
        for field,value in [('digest','0'*64),('kind','actor'),('producer','foreign'),('epoch','wrong'),('revision',9)]:
            r=self.req(c,'bad');r['reference'][field]=value;self.unchanged_reject(c,r)
        unbound=c.qualified('U/1','place','place_0001','u1',1);self.assertEqual(c.resolve(unbound)['status'],'O5')
        r=c.prepare('conflict','rebind',{'entity':'Q'},'P',self.ref(c,actor=True));self.unchanged_reject(c,r)
        good=c.prepare('good','rebind',{'entity':'P'},'P',self.ref(c,actor=True));self.assertEqual(c.admit(good)['status'],'O1')

    def test_T02_continuity_and_optional_art(self):
        for first,second in [('S/1','T/1'),('T/1','S/1')]:
            c=self.new();r=self.req(c,'first',1,first);a=c.admit(r);self.assertEqual(a['status'],'O1')
            self.assertEqual(c.admit(r)['status'],'O3')
            epoch='s1' if first=='S/1' else 't1';self.do(c,'unload','unload',{'artifact':first,'old_epoch':epoch})
            c=Core(c.path);self.assertEqual(c.admit(self.req(c,'second',4,second))['status'],'O1')
            self.assertEqual(self.env(c)['D']['base'],5);self.assertEqual(self.env(c)['D2']['base'],4)
            self.assertEqual(c.admit(r)['receipt'],a['receipt'])
        c=self.new();r=self.req(c,'decoy',1,'U/1');self.assertEqual(c.admit(r)['status'],'O1');self.assertEqual(self.env(c)['D']['base'],0)

    def test_T03_remap_and_epoch(self):
        c=self.new();old=self.req(c,'old');a=c.admit(old)
        self.do(c,'remap','remap',{'digest':c.snapshot().state['binding_plan']['digest']})
        self.assertEqual(c.admit(old)['receipt'],a['receipt'])
        r=self.req(c,'stale');self.unchanged_reject(c,r)
        newref=self.ref(c,'S/2',revision=2);r=c.prepare('new','contribute',{'q':1},'D',newref);self.assertEqual(c.admit(r)['status'],'O1')
        c=self.new();self.do(c,'off','unload',{'artifact':'S/1','old_epoch':'s1'})
        self.unchanged_reject(c,self.req(c,'offline'))
        self.do(c,'on','reload',{'artifact':'S/1','old_epoch':'s1','new_epoch':'s2'})
        self.unchanged_reject(c,self.req(c,'old-epoch'))
        r=c.prepare('now','contribute',{'q':1},'D',self.ref(c,epoch='s2',revision=2));self.assertEqual(c.admit(r)['status'],'O1')

    def test_T04_absence_set_and_stale_proposals(self):
        c=self.new();p={'id':'C','due':9,'policy':'readiness5'}
        r1=c.prepare('create1','schedule',p,'D');r2=c.prepare('create2','schedule',p,'D')
        self.assertEqual(c.admit(r1)['status'],'O1');self.unchanged_reject(c,r2)
        fresh=c.prepare('fresh','schedule',p,'D');self.assertEqual(c.admit(fresh)['status'],'O2')
        c=self.new();r=c.prepare('missing','schedule',p,'D');r['witness']['clock']={};self.unchanged_reject(c,r)
        a=self.req(c,'a');b=self.req(c,'b');self.assertEqual(c.admit(a)['status'],'O1');self.unchanged_reject(c,b)

    def test_T06_order_threshold_cap_decay_reversal(self):
        sequences=[[1,4],[4,1],[4,2],[1,0,0,0,1,0,0,0,0,0],[1,1,0,0,0,0,0,0,0,0],[4,4,4,4,4]]
        for qs in sequences:
            c=self.new();actual=[]
            for i,q in enumerate(qs):
                out=c.admit(self.req(c,'op'+str(i),q));self.assertIn(out['status'],['O1','O2']);actual.append(self.env(c)['D']['base'])
            self.assertEqual(actual,trace(qs))
        c=self.new();self.assertEqual(c.admit(self.req(c,'zero',0))['status'],'O2')
        self.assertEqual(c.admit(self.req(c,'one',1))['status'],'O1');c.admit(self.req(c,'four',4))
        self.do(c,'time','advance',{'to':2});e=self.env(c)['D'];self.assertEqual((e['base'],e['at']),(5,0))
        self.assertEqual(inspect(c.snapshot(),'author')['value']['condition']['D']['effective'],3)
        old=copy(c.snapshot().state['lineage']['events']);r,_=self.do(c,'restore','restore',{},'D',self.ref(c))
        self.assertEqual(copy(c.snapshot().state['lineage']['events'])[:len(old)],old);self.assertEqual(c.admit(r)['status'],'O3')

    def test_T07_graph_fidelity_and_stale_analysis(self):
        c=self.new();s=c.snapshot();p=s.state['protection'];expected,n=reachable(p['graph'],p['essential'])
        a=inspect(s,'author','closure')['value'];self.assertEqual((len(a['protected']),a['edges_visited']),(11,16));self.assertEqual(a['protected'],expected)
        old=c.prepare('analysis','declare_dependency',{'from':'Live','to':'OU','fidelity':'exact'})
        self.do(c,'pin','pin',{'node':'OU'});a=inspect(c.snapshot(),'author','closure')['value'];self.assertEqual((len(a['protected']),a['edges_visited']),(13,18))
        self.unchanged_reject(c,old);self.do(c,'release','unpin',{'node':'OU'});self.assertEqual(len(inspect(c.snapshot(),'author','closure')['value']['protected']),11)
        self.do(c,'edge','declare_dependency',{'from':'Live','to':'OU','fidelity':'exact'});self.assertEqual(len(inspect(c.snapshot(),'author','closure')['value']['protected']),13)
        self.unchanged_reject(c,c.prepare('bad','unpin',{'node':'Live'}))
        self.unchanged_reject(c,c.prepare('weak','declare_dependency',{'from':'Live','to':'Policy','fidelity':'meaning'}))

    def test_T08_capacity_and_all_store_census(self):
        L=dict(DEFAULT_LIMITS,operations=1);c=self.new(limits=L);r=self.req(c,'one');self.assertEqual(c.admit(r)['status'],'O1')
        self.unchanged_reject(c,self.req(c,'over'));a=Core(c.path,L).snapshot();self.assertEqual(c.admit(r)['status'],'O3')
        stores=copy(a.stores);self.assertEqual(len(stores),9)
        proof=stores['9-proof-index'];self.assertEqual(a.census['cold_work'],work(proof['root'],proof['history']))
        for bound in ['memory_bytes','logical_bytes','workspace_bytes','cold_work']:
            # Every limit has a predeclared, distinct profile identity. Reject
            # a root that itself cannot fit, rather than certify a fake budget.
            L=dict(DEFAULT_LIMITS);L[bound]=1
            with self.assertRaises(Exception):self.new(limits=L)

    def test_T09_T18_detached_purity_privacy_availability(self):
        c=self.new();a=c.snapshot();before=canonical(a.stores)
        for query in ['current','identity','due','cause','typed-history','coverage','terminal-receipt','closure','resource-census','stores']:
            self.assertEqual(inspect(a,'author',query),inspect(a,'author',query))
        for b in [{'Z':{'status':'exact','text':'token-Z'}},{'Z':{'status':'offline'}},{'other':{'hidden':True}}]:
            self.assertEqual(inspect(a,'public','source:Z',b),{'status':'O5','reason':'unavailable'})
        self.assertEqual(inspect(a,'author','source:Z',{'Z':{'status':'exact','text':'token-Z'}})['value']['text'],'token-Z')
        self.assertEqual(inspect(a,'author','source:Z',{'Z':{'status':'offline'}})['status'],'O5')
        self.assertEqual(inspect(a,'author','quote:M')['status'],'O5')
        mutable=copy(a.stores);mutable['4-clock']['now']=99
        self.assertEqual(canonical(c.snapshot().stores),before)
        with self.assertRaises(TypeError):a.state['clock']['now']=99
        self.assertEqual(inspect({'unverified':True})['status'],'O5')

    def test_T18_no_unverified_snapshot_constructor(self):
        c=self.new();s=c.snapshot()
        with self.assertRaises(Exception):Snapshot(s.head,s.ordinal,s.state,s.stores,s.census)
        self.assertEqual(inspect(object.__new__(Snapshot))['status'],'O5')
        self.assertEqual(inspect(s,'author','current')['status'],'available')

    def test_T11_T12_modeA_tamper_and_external_boundary(self):
        c=self.new();self.assertEqual(c.snapshot().ordinal,0);c.admit(self.req(c,'a',1));c.admit(self.req(c,'b',4))
        expected={'seq':c.snapshot().ordinal,'head':c.snapshot().head};self.assertEqual(Core(c.path,expected=expected).snapshot().ordinal,2)
        self.assertEqual(c.checkpoint()['status'],'checkpointed')
        def attack(name,sql,params=()):
            p=c.path.parent/(name+'.db');shutil.copy2(c.path,p)
            with sqlite3.connect(p) as db:db.execute(sql,params)
            with self.assertRaises(Unavailable):Core(p,expected=expected).snapshot()
        attack('lost-last','DELETE FROM history WHERE seq=2')
        attack('lost-first','DELETE FROM history WHERE seq=1')
        attack('index','UPDATE history SET opkey=? WHERE seq=1',('wrong',))
        with sqlite3.connect(c.path) as db:
            entry=json.loads(db.execute('SELECT payload FROM history WHERE seq=2').fetchone()[0])
        entry['state']['families']['Env']['D']['base']=9
        entry['head']=sha({'previous':entry['previous'],'seq':2,'request':entry['request'],'result':entry['result'],'state':entry['state']});entry['receipt']['head']=entry['head']
        attack('rehashed','UPDATE history SET payload=? WHERE seq=2',(text(entry),))
        alt=self.new();alt.admit(self.req(alt,'a',4));alt.admit(self.req(alt,'b',1))
        self.assertEqual(alt.snapshot().ordinal,2)
        with self.assertRaises(Unavailable):Core(alt.path,expected=expected).snapshot()
        with sqlite3.connect(c.path) as db:db.execute('DELETE FROM checkpoints')
        self.assertEqual(Core(c.path,expected=expected).snapshot().ordinal,2)

    def test_T14_time_ordinal_due_and_atomic_quota(self):
        semantic=[]
        for targets in [[10],[5,8,10],[5,6,8,10]]:
            c=self.new();observed=[]
            for i,T in enumerate(targets):
                r=c.prepare('t'+str(i),'advance',{'to':T})
                def hook(phase,r,v):
                    if phase=='due':observed.append((v['obligation'],v['time'],v['effective']));self.assertLess(c.snapshot().state['clock']['now'],v['time'])
                self.assertEqual(c.admit(r,hook=hook)['status'],'O1')
            self.assertEqual(observed,[('A',5,0),('B',8,5)])
            s=c.snapshot().state;self.assertEqual((s['families']['Env']['D']['base'],s['families']['Env']['D']['at']),(8,5))
            self.assertEqual(s['clock']['obligations']['B']['status'],'expired-ready')
            semantic.append((s['clock']['now'],s['families']['Env']['D']['base'],s['clock']['obligations']['B']['status']))
        self.assertEqual(semantic,[semantic[0]]*3)
        for mode in ['cancel','fulfill']:
            c=self.new();self.do(c,'t4','advance',{'to':4});self.do(c,'qualify',mode,{'id':'A'});self.do(c,'t10','advance',{'to':10})
            self.assertEqual(c.snapshot().state['clock']['obligations']['B']['status'],'expired-blocked')
            c=self.new();stale=c.prepare('stale',mode,{'id':'A'});self.do(c,'t5','advance',{'to':5});self.unchanged_reject(c,stale)
            _,out=self.do(c,'fresh',mode,{'id':'A'});self.assertEqual(out['status'],'O2')
        c=self.new();self.do(c,'schedule','schedule',{'id':'C','due':5,'policy':'readiness8'},'D');self.do(c,'jump','advance',{'to':10})
        self.assertEqual(c.snapshot().state['clock']['obligations']['C']['status'],'expired-ready')
        c=self.new(limits=dict(DEFAULT_LIMITS,due_jobs=1));self.unchanged_reject(c,c.prepare('over','advance',{'to':10}))
        c=self.new(limits=dict(DEFAULT_LIMITS,due_jobs=2));self.assertEqual(c.admit(c.prepare('ok','advance',{'to':10}))['status'],'O1')
        c=self.new();self.assertEqual(c.admit(c.prepare('empty','advance',{'to':0}))['status'],'O2')
        for t in [-1,1001,0.5,float('inf'),True]:self.unchanged_reject(c,c.prepare('bad','advance',{'to':t}) if type(t) is not float else dict(c.prepare('bad','advance',{'to':0}),params={'to':t}))
        self.assertEqual(c.admit(c.prepare('large','advance',{'to':1000}))['status'],'O1')

    def test_T14_advance_only_occurrence_uses_target_time(self):
        c=self.new();self.do(c,'t2','advance',{'to':2})
        e=c.snapshot().state['lineage']['events'][-1]
        self.assertEqual((e['kind'],e['effective'],e['publication_time']),('advance',2,2))
        self.do(c,'t10','advance',{'to':10});self.do(c,'t12','advance',{'to':12})
        events=c.snapshot().state['lineage']['events'];self.assertEqual(events[-1]['effective'],12)
        due=[e for e in events if e['kind'] in ['expiry_release','expired-ready']]
        self.assertEqual([e['effective'] for e in due],[5,8])

    def test_T15_full_RVD_scope_and_result_conflicts(self):
        c=self.new();r=self.req(c,'o1',mode='supplied');v=c.preview(r);original=cp.deepcopy(v)
        a=c.admit(r,v);self.assertEqual(a['status'],'O1');calls=c.resolutions
        self.assertEqual(c.admit(r,v)['receipt'],a['receipt']);self.assertEqual(c.resolutions,calls)
        for mutate in [lambda x:x.update(id='other'),lambda x:x['dependencies'].update(time=1),lambda x:x['dependencies'].update(policy='foreign'),lambda x:x['effects']['families']['Env']['D'].update(base=4)]:
            changed=cp.deepcopy(v);mutate(changed);self.unchanged_reject(c,r,supplied=changed)
        self.assertEqual(c.resolutions,calls)
        self.assertEqual(c.admit(r,lookup=True)['status'],'O3')
        self.unchanged_reject(c,r,supplied=v,lookup=True)
        unknown=self.req(c,'unknown');self.unchanged_reject(c,unknown,lookup=True)
        self.unchanged_reject(c,r,caller={'producer':'test-producer','incarnation':'e2'})
        for k in ['world','lineage','producer']:
            bad=cp.deepcopy(r);bad['key'][k]='wrong';self.unchanged_reject(c,bad)
        fresh=self.req(c,'new',incarnation='e2');self.assertEqual(c.admit(fresh,caller={'producer':'test-producer','incarnation':'e2'})['status'],'O1');self.assertEqual(self.env(c)['D']['base'],2)
        self.assertEqual(v,original)

    def test_T16_T17_unsupported_ranges_and_required_validators(self):
        c=self.new()
        for q in [-1,5,0.25,float('nan'),float('inf'),True]:
            r=self.req(c,'bad');r['params']['q']=q;self.unchanged_reject(c,r)
        for kind in ['pending','thenable','async','upgrade','backfill','retire','promote','merge','split','import_B','reuse_identity','mixed_owner','remove_exact_detail','random']:
            self.unchanged_reject(c,c.prepare('bad-'+kind,kind))
        for field,value in [('owner','foreign'),('policy','redefined'),('profile','changed')]:
            r=self.req(c,'bad');r[field]=value;self.unchanged_reject(c,r)
        for extra in [{'then':True},{'status':'pending'},{'effects':{'social':{}}}]:
            r=self.req(c,'bad',mode='supplied');v=c.preview(r);v.update(extra);self.unchanged_reject(c,r,supplied=v)
        self.assertEqual(c.admit(self.req(c,'valid',4))['status'],'O1')
        with self.assertRaises(Unavailable):Core(c.path,dict(DEFAULT_LIMITS,operations=63)).snapshot()
        with self.assertRaises(Exception):Core.create(c.path.parent/'wrong.db',root_digest='0'*64)

    def test_T16_actual_async_hooks_and_opaque_results(self):
        c=self.new();r=self.req(c,'o1')
        async def delayed(*args):return True
        self.unchanged_reject(c,r,hook=delayed)
        self.unchanged_reject(c,r,publication_hook=delayed)
        self.unchanged_reject(c,r,hook=lambda *args:delayed())
        class Pending:
            def then(self):return True
        self.unchanged_reject(c,r,supplied=Pending())
        self.assertEqual(c.admit(r)['status'],'O1')

    def test_T08_capture_size_rejects_shared_expansion_before_encoding(self):
        c=self.new();r=self.req(c,'o1');r['junk']=['x'*100000]*100
        self.unchanged_reject(c,r)
        self.assertEqual(c.admit(self.req(c,'o1'))['status'],'O1')

    def test_T08_backend_padding_is_not_free_recovery_work(self):
        c=self.new();other=c.path.parent/'padded.db';shutil.copy2(c.path,other)
        with other.open('ab') as f:f.write(b'\0'*2097152)
        with self.assertRaises(Unavailable):Core(other).snapshot()
        self.assertEqual(c.snapshot().ordinal,0)

    def test_T11_storage_domain_matches_physical_byte_census(self):
        c=self.new();r=self.req(c,'o1');self.assertEqual(c.admit(r)['status'],'O1')
        for table in ['root','meta','history']:
            p=c.path.parent/(table+'-noncanonical.db');shutil.copy2(c.path,p)
            with sqlite3.connect(p) as db:db.execute('UPDATE '+table+" SET payload='  '||payload")
            with self.assertRaises(Unavailable):Core(p).snapshot()
        self.assertEqual(c.snapshot().ordinal,1)

    def test_T11_optional_bad_accelerator_never_replaces_full_replay(self):
        c=self.new();r=self.req(c,'o1');a=c.admit(r);c.checkpoint()
        with sqlite3.connect(c.path) as db:db.execute('UPDATE checkpoints SET payload=?',('{',))
        s=c.snapshot();self.assertEqual(s.ordinal,1)
        self.assertEqual(s.stores['9-proof-index']['accelerator_status'][0],'ignored_invalid_accelerator')
        self.assertEqual(c.admit(r)['receipt'],a['receipt'])

    def test_T19_selected_tombstones_preserve_receipts(self):
        for actor in [True,False]:
            c=self.new();target='P' if actor else 'D';ref=self.ref(c,actor=actor)
            if actor:r=c.prepare('original','rebind',{'entity':'P'},target,ref)
            else:r=self.req(c,'original')
            first=c.admit(r);self.assertEqual(first['status'],'O1')
            if not actor:
                self.unchanged_reject(c,c.prepare('premature','tombstone',{},target))
                self.do(c,'cancelA','cancel',{'id':'A'});self.do(c,'cancelB','cancel',{'id':'B'})
            self.do(c,'tomb','tombstone',{},target)
            self.assertEqual(c.admit(r)['receipt'],first['receipt'])
            live=c.prepare('live','rebind',{'entity':'P'},'P',self.ref(c,actor=True,revision=2)) if actor else self.req(c,'live')
            self.unchanged_reject(c,live)
        c=self.new();self.unchanged_reject(c,c.prepare('not-granted','tombstone',{},'Q'))

    def test_T15_terminal_after_clock_checkpoint_and_offline(self):
        c=self.new();r=self.req(c,'o1',mode='supplied');v=c.preview(r);first=c.admit(r,v)
        self.do(c,'advance','advance',{'to':10});self.assertEqual(c.checkpoint()['status'],'checkpointed')
        self.do(c,'off','unload',{'artifact':'S/1','old_epoch':'s1'})
        c=Core(c.path);self.assertEqual(c.admit(r,v)['receipt'],first['receipt']);self.assertEqual(c.resolutions,0)

    def test_T20_A1_caller_alias_each_phase(self):
        for phase in ['validate','resolve','final']:
            c=self.new();r=self.req(c,'o1');submitted=cp.deepcopy(r);seen=[]
            def hook(at,protected,v):
                seen.append(at);self.assertEqual(protected['params']['q'],1)
                if at==phase:r['params']['q']=4;r['key']['operation']='changed'
            out=c.admit(r,hook=hook);self.assertEqual(out['status'],'O1',out)
            self.assertEqual((r['params']['q'],self.env(c)['D']['base']),(4,1));self.assertIn(phase,seen)
            self.assertEqual(c.admit(submitted)['status'],'O3')
            r['key']['operation']='o1';self.unchanged_reject(c,r)

    def test_T20_A2_A3_and_invalid_result(self):
        c=self.new();r=self.req(c,'before');r['params']['q']=4;self.assertEqual(c.admit(r)['status'],'O1');self.assertEqual(self.env(c)['D']['base'],4)
        c=self.new();r=self.req(c,'o1',mode='supplied');v=c.preview(r);original=cp.deepcopy(v)
        def hook(phase,_,value):
            if phase=='resolve':v['effects']['families']['Env']['D']['base']=4
        self.assertEqual(c.admit(r,v,hook=hook)['status'],'O1');self.assertEqual(self.env(c)['D']['base'],1)
        self.assertEqual(c.admit(r,original)['status'],'O3');self.unchanged_reject(c,r,supplied=v)
        c=self.new();r=self.req(c,'o1',mode='supplied');v=c.preview(r);v['effects']['families']['Env']['D']['base']=4
        self.unchanged_reject(c,r,supplied=v)
        # Corrected rejected key is reusable.
        v=c.preview(r);self.assertEqual(c.admit(r,v)['status'],'O1')

    def test_T20_F1a_F1b_F2_faults_and_probes(self):
        for phase in ['validate','final']:
            for fault in ['write','explicit','false','contained','read']:
                c=self.new();r=self.req(c,'o1');before=canonical(c.snapshot().stores);seen=[]
                def hook(at,pr,v):
                    if at!=phase:return
                    seen.append(at)
                    obj=pr['params'] if at=='validate' else v['effects']['families']['Env']['D']
                    prop='q' if at=='validate' else 'base'
                    if fault=='write':obj[prop]=4
                    if fault=='explicit':raise Exception('TEST_SENTINEL')
                    if fault=='false':return False
                    if fault=='contained':
                        try:obj[prop]=4
                        except TypeError:seen.append('protected_write_failed')
                        self.assertEqual(obj[prop],1)
                a=c.admit(r,hook=hook);self.assertIn(phase,seen)
                if fault in ['contained','read']:
                    self.assertEqual(a['status'],'O1',a);self.assertEqual(self.env(c)['D']['base'],1)
                else:
                    self.assertEqual(a['status'],'O4',a);self.assertEqual(canonical(c.snapshot().stores),before)
                    self.assertEqual(c.admit(r)['status'],'O1');self.assertEqual(c.admit(r)['status'],'O3')
        # Exception after calculation, not just on input validation.
        c=self.new();r=self.req(c,'o1')
        def after_stage(phase,_,v):
            if phase=='resolve':raise Exception('AFTER_STAGING')
        self.unchanged_reject(c,r,hook=after_stage)

    def test_T20_F4_reentrant_write_caught_or_propagated(self):
        for phase in ['resolve','due']:
            for contained in [False,True]:
                c=self.new();nested=self.req(c,'nested') if phase=='resolve' else c.prepare('schedule','schedule',{'id':'C','due':20,'policy':'readiness8'},'D')
                outer=self.req(c,'outer') if phase=='resolve' else c.prepare('outer','advance',{'to':10})
                attempted=[]
                def hook(at,_,v):
                    if at==phase:
                        result=Core(c.path).admit(nested);attempted.append(result)
                        self.assertEqual(result['status'],'O4')
                        if not contained:raise Exception('nested writer')
                self.unchanged_reject(c,outer,hook=hook);self.assertEqual(len(attempted),1)
                self.assertIn(c.admit(outer)['status'],['O1','O2'])

    def test_T13_actual_sqlite_full_readonly_and_uncertainty(self):
        for fault in ['full','readonly']:
            c=self.new();r=self.req(c,'o1');out=self.unchanged_reject(c,r,backend_fault=fault)
            self.assertEqual(out['reason'],'PROVEN_PREPUBLICATION_FAILURE')
            self.assertEqual(c.admit(r)['status'],'O1')
        c=self.new();r=self.req(c,'o1')
        def hook(phase,e):
            if phase=='after_commit':raise OSError('lost response')
        self.assertEqual(c.admit(r,publication_hook=hook)['status'],'O5')
        self.assertEqual(c.admit(r)['status'],'O5');self.assertEqual(c.reconcile()['ordinal'],1);self.assertEqual(c.admit(r)['status'],'O3')

    def test_T08_exact_cold_work_boundary_from_separate_census(self):
        # Fixed point handles changed profile digit widths. Neither step changes
        # an existing profile; every iteration creates a separately identified DB.
        for offset,expected in [(-1,'O4'),(0,'O1')]:
            cap=50000
            for attempt in range(8):
                L=dict(DEFAULT_LIMITS,cold_work=cap);c=self.new(limits=L);a=c.snapshot();r=self.req(c,'o1');v=c.preview(r)
                state=copy(a.state);state.update(v['effects']);h=sha({'previous':a.head,'seq':1,'request':r,'result':v,'state':state})
                d={'key':r['key'],'ordinal':1,'head':h,'status':'O1','result_id':v['id']}
                entry={'seq':1,'generation':1,'previous':a.head,'head':h,'request':r,'result':v,'receipt':d,'state':state}
                needed=work(copy(a.stores['9-proof-index']['root']),[entry]);nextcap=needed+offset
                if cap==nextcap:break
                cap=nextcap
            else:self.fail('work-cap fixture failed to converge')
            out=c.admit(r);self.assertEqual(out['status'],expected,out)
            if expected=='O4':self.assertEqual(c.snapshot().ordinal,0)
            else:
                self.assertEqual(c.snapshot().census['cold_work'],cap)
                self.assertEqual(Core(c.path,L).admit(r)['status'],'O3')

if __name__=='__main__':unittest.main(verbosity=2)
