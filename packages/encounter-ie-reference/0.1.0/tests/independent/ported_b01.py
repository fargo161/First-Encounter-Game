# Tester I mechanical regression port; Builder-owned donor oracles remain labeled.
"""Public-API B01 boundaries with separate raw-SQL/page/JSON accounting.

The subclass observes the real writer connection, then calls the unchanged
production reservation. It does not replace its decision or expected oracle.
"""
import argparse, hashlib, json, os, shutil, sqlite3, subprocess, sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from eaie import Core, Rejected
from eaie.core import DEFAULT_LIMITS
from eaie.data import copy
from eaie.atlas import inspect
from verify_independent import plain as independent_plain

def write(p, x):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(independent_plain(x), indent=2)+'\n', encoding='utf-8')

def encoded(x):
    return json.dumps(x, sort_keys=True, separators=(',', ':'), ensure_ascii=True).encode()

def sql_measure(db, path):
    # No product census/estimator supplies the expected values below.
    tables = {}
    for table in ['root', 'history', 'meta', 'checkpoints']:
        rows = db.execute('SELECT * FROM '+table).fetchall()
        tables[table] = rows
    lengths = {k: sum(len(row[-1].encode('utf-8')) for row in v) for k,v in tables.items()}
    charged = lengths['root']+lengths['history']+lengths['checkpoints']
    ps = db.execute('PRAGMA page_size').fetchone()[0]
    pc = db.execute('PRAGMA page_count').fetchone()[0]
    actual = path.stat().st_size
    physical = {p.name:p.stat().st_size for p in path.parent.glob(path.name+'*') if p.is_file()}
    allocation = max(actual, ps*pc)
    return {'payload_bytes':lengths, 'charged_bytes':charged, 'page_size':ps,
      'page_count':pc, 'freelist_count':db.execute('PRAGMA freelist_count').fetchone()[0],
      'allocated_bytes':ps*pc, 'file_bytes':actual, 'physical_files':physical,
      'physical_total':sum(physical.values()), 'reserved_database_bytes':allocation,
      'independent_required_workspace':32*charged+1048576+4*allocation,
      'schema':db.execute('SELECT type,name,tbl_name,sql FROM sqlite_master ORDER BY name').fetchall(),
      'journal_mode':db.execute('PRAGMA journal_mode').fetchone()[0],
      'synchronous':db.execute('PRAGMA synchronous').fetchone()[0],
      'raw_tables':tables}

class MeasuredCore(Core):
    observations = []
    def _publication_budget(self, db, c, n, checkpoints):
        m = sql_measure(db, self.path)
        m.update(ordinal=n, checkpoint_count=checkpoints, cap=self.profile['limits']['workspace_bytes'])
        self.observations.append(m)
        try:
            result = super()._publication_budget(db, c, n, checkpoints)
            assert result == m['independent_required_workspace']
            assert m['physical_total']+32*m['charged_bytes']+1048576 <= result
            m['decision']='reserved'
            return result
        except Exception as e:
            m['decision']='refused';m['reason']=str(e)
            raise

def req(c, name='boundary-op', q=1, short=False):
    return c.prepare(name,'contribute',{'q':q},'D',
        c.qualified('S/1','mechanism','mechanism_0001','s1',1),
        result_id=name if short else None)

def fresh(path, limits):
    # Different Core object + new SQLite connection + complete mode-A replay.
    return Core(path, limits).snapshot()

def after(c, out, before=None):
    s=fresh(c.path,c.profile['limits'])
    db=sqlite3.connect(c.path)
    try:m=sql_measure(db,c.path)
    finally:db.close()
    assert m['independent_required_workspace'] <= c.profile['limits']['workspace_bytes']
    assert m['charged_bytes'] == s.census['logical_bytes']
    write(out,{'head':s.head,'ordinal':s.ordinal,'stores':copy(s.stores),'census':copy(s.census),'backend':m})
    if before is not None:assert encoded(copy(s.stores))==encoded(before)
    return s,m

def run(out):
    out.mkdir(parents=True,exist_ok=False)
    MeasuredCore.observations=[]
    results=[]
    def record(name, detail):
        results.append({'case':name,'status':'PASS',**detail})
        write(out/'results.json',{'status':'RUNNING','cases':results})

    # Independently measure the same small operation in an ample immutable
    # native profile; historical C1 byte floors do not transfer to this root.
    fixed_trial=out/'fixed-native-reference';fixed_trial.mkdir()
    fixed_core=MeasuredCore.create(fixed_trial/'world.db',dict(DEFAULT_LIMITS,workspace_bytes=4000000))
    assert fixed_core.admit(req(fixed_core,'o1'))['status']=='O1'
    with sqlite3.connect(fixed_core.path) as fixed_db:
        fixed_floor=sql_measure(fixed_db,fixed_core.path)['independent_required_workspace']
    write(out/'fixed-native-reference.json',{'operation':'o1','required':fixed_floor})
    # Preserve three actual fixed-cap controls, with new native expectations.
    for cap in [1784415,1784416,2097152]:
        f=out/('fixed-'+str(cap));f.mkdir();L=dict(DEFAULT_LIMITS,workspace_bytes=cap)
        c=MeasuredCore.create(f/'world.db',L);b=copy(c.snapshot().stores);r=req(c,'o1')
        shutil.copy2(c.path,f/'H0-preserved.db');a=c.admit(r)
        s,m=after(c,f/'cold.json',b if cap<2097152 else None)
        # Historical C1 floors do not transfer to this new root/encoding.
        # Measure the actual staged operation reservation independently.
        expected='O1' if fixed_floor<=cap else 'O4'
        assert a['status']==expected,(a,fixed_floor)
        assert s.ordinal==(1 if expected=='O1' else 0)
        if expected=='O1':
            retry=Core(c.path,L).admit(r);assert retry=={'status':'O3','receipt':a['receipt']}
        write(f/'admission.json',{'request':r,'result':a,'before':b,'profile':c.profile})
        record('fixed-cap-'+str(cap),{'admission':a['status'],'cold_ordinal':s.ordinal,'required':m['independent_required_workspace']})

    # Reference thresholds come from actual SQL record lengths and committed
    # SQLite page/file sizes in an independently declared ample-profile branch.
    trial=out/'reference-trial';trial.mkdir();L=dict(DEFAULT_LIMITS,workspace_bytes=4000000)
    c=MeasuredCore.create(trial/'world.db',L)
    _,m0=after(c,trial/'root.json')
    r=req(c);a=c.admit(r);assert a['status']=='O1'
    _,m1=after(c,trial/'operation.json')
    a=c.checkpoint();assert a['status']=='checkpointed'
    _,m2=after(c,trial/'checkpoint.json')
    thresholds={k:m['independent_required_workspace'] for k,m in [('root',m0),('operation',m1),('checkpoint',m2)]}
    assert m1['file_bytes']>m0['file_bytes'] and m2['file_bytes']>m1['file_bytes']
    write(out/'independent-thresholds.json',{'formula':'32 * raw canonical root/history/checkpoints bytes + 1048576 + 4 * max(staged page_count*page_size, current file size)',
      'thresholds':thresholds,'reference_records':[m0,m1,m2],
      'limitation':'Exact boundary for this backend, operation names and retained prefix, not a universal minimum/game duration'})
    for kind,floor in thresholds.items():
        for delta in [-1,0,1]:
            f=out/(kind+'-threshold-'+str(delta));f.mkdir();cap=floor+delta;L=dict(DEFAULT_LIMITS,workspace_bytes=cap)
            before=None;rejection=None
            try:c=MeasuredCore.create(f/'world.db',L)
            except Rejected as e:
                assert kind=='root' and delta==-1 and str(e)=='STORAGE_CAPACITY'
                db=sqlite3.connect(f/'world.db')
                assert db.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()==[]
                db.close();record('root-threshold--1',{'cap':cap,'outcome':'creation rejected before COMMIT','acknowledged':False});continue
            if kind=='root':
                s,m=after(c,f/'cold.json');assert s.ordinal==0
                assert m['independent_required_workspace']==floor
                record(kind+'-threshold-'+str(delta),{'cap':cap,'outcome':'created','required':floor});continue
            if kind=='checkpoint':assert c.admit(req(c))['status']=='O1'
            before=copy(c.snapshot().stores);before_hash=hashlib.sha256(c.path.read_bytes()).hexdigest()
            shutil.copy2(c.path,f/'before.db');r=req(c)
            result=c.admit(r) if kind=='operation' else c.checkpoint()
            assert result['status']==('O4' if delta==-1 else ('O1' if kind=='operation' else 'checkpointed')),result
            s,m=after(c,f/'cold.json',before if delta==-1 else None)
            if delta==-1:
                assert hashlib.sha256(c.path.read_bytes()).hexdigest()==before_hash
                if kind=='operation':
                    # A proven rejected key is not reserved. A shorter valid
                    # key/result envelope fits this same immutable cap.
                    short=req(c,'x',short=True);good=c.admit(short);assert good['status']=='O1',good
                    assert Core(c.path,L).admit(short)=={'status':'O3','receipt':good['receipt']}
                    after(c,f/'after-corrected-action.json')
            else:
                assert m['independent_required_workspace']==floor
                if kind=='operation':assert Core(c.path,L).admit(r)=={'status':'O3','receipt':result['receipt']}
                else:assert s.stores['9-proof-index']['accelerator_status']==('verified',)
            write(f/'outcome.json',{'result':result,'before':before,'after':copy(s.stores),'profile':c.profile})
            record(kind+'-threshold-'+str(delta),{'cap':cap,'outcome':result['status'],'required':m['independent_required_workspace']})

    # Repeated actual growth to a storage (not operation-count) limit, including
    # an optional checkpoint. Replay, all-store purity and conflicts at full.
    f=out/'storage-full';f.mkdir();L=dict(DEFAULT_LIMITS,workspace_bytes=4000000)
    c=MeasuredCore.create(f/'world.db',L);records=[];first=None
    assert c.checkpoint()['status']=='checkpointed'
    for i in range(1,65):
        b=copy(c.snapshot().stores);r=req(c,'growth-'+str(i),q=i%5);shutil.copy2(c.path,f/'previous-head.db')
        a=c.admit(r)
        s,m=after(c,f/('head-'+str(i)+'.json'),b if a['status']=='O4' else None)
        records.append({'request':r,'result':a,'ordinal':s.ordinal,'head':s.head,'required':m['independent_required_workspace'],'bytes':m['file_bytes']})
        if a['status']=='O4':
            assert i<64 and 'CAPACITY' in str(a)
            break
        assert a['status'] in ['O1','O2']
        if first is None:first=(r,a)
    else:raise AssertionError('storage boundary was not reached')
    frozen=copy(fresh(c.path,L).stores);one_over=c.admit(r);assert one_over['status']=='O4'
    replay=Core(c.path,L).admit(first[0]);assert replay=={'status':'O3','receipt':first[1]['receipt']}
    bad=json.loads(json.dumps(first[0]));bad['params']['q']=4 if bad['params']['q']!=4 else 3
    assert c.admit(bad)['status']=='O4'
    # A smaller accelerator may still fit after a larger operation refuses.
    # Exercise it rather than assuming all publication shapes share a floor.
    checkpoint_results=[]
    for j in range(DEFAULT_LIMITS['checkpoints']):
        prior=copy(fresh(c.path,L).stores);cp=c.checkpoint();checkpoint_results.append(cp)
        after(c,f/('full-checkpoint-'+str(j)+'.json'),prior if cp['status']=='O4' else None)
        if cp['status']=='O4':break
        assert cp['status']=='checkpointed'
    assert checkpoint_results[-1]['status']=='O4'
    frozen=copy(fresh(c.path,L).stores)
    assert Core(c.path,L).admit(first[0])=={'status':'O3','receipt':first[1]['receipt']}
    snap=fresh(c.path,L)
    for query in ['current','identity','due','cause','terminal-receipt','closure','coverage','resource-census','stores']:
        write(f/('export-'+query+'.json'),inspect(snap,'author',query))
    after(c,f/'after-full-retry-export.json',frozen)
    write(f/'operations.json',records)
    record('storage-full-retry-export-checkpoint-refusal',{'admitted':len(records)-1,'new_refusal':one_over,'exact_retry':replay,'checkpoint_attempts':checkpoint_results,'semantic_stores_unchanged_after_refusals_and_reads':True})

    # Actual process interruption at the independently calculated safe operation
    # boundary and checkpoint boundary, not just the generous default profile.
    env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1')
    src=Path(__file__).resolve().parents[2]
    for kind,modes in [('operation',['before_commit','during_commit','after_commit','after_ack']),('checkpoint',['before_commit','during_commit','after_ack'])]:
        for mode in modes:
            f=out/(kind+'-crash-'+mode);f.mkdir();L=dict(DEFAULT_LIMITS,workspace_bytes=thresholds[kind]);c=MeasuredCore.create(f/'world.db',L)
            if kind=='checkpoint':assert c.admit(req(c))['status']=='O1'
            before=copy(c.snapshot().stores);write(f/'limits.json',L);shutil.copy2(c.path,f/'before.db')
            cmd=[sys.executable,'-B',str(src/'tests/independent/b01_fault_worker.py'),kind,mode,str(f)]
            child=subprocess.run(cmd,cwd=src,env=env,capture_output=True,text=True,timeout=60)
            (f/'child.stdout').write_text(child.stdout);(f/'child.stderr').write_text(child.stderr);assert child.returncode==93,child.stderr
            # Cold process, no subclass/cache/active transaction inherited.
            cmd2=[sys.executable,'-B',str(src/'tests/independent/b01_fault_worker.py'),kind,'cold',str(f)]
            cold=subprocess.run(cmd2,cwd=src,env=env,capture_output=True,text=True,timeout=60)
            (f/'cold.stdout').write_text(cold.stdout);(f/'cold.stderr').write_text(cold.stderr);assert cold.returncode==0,cold.stderr
            obs=json.loads(cold.stdout)
            if mode=='before_commit':assert obs['published']==False
            if mode in ['after_commit','after_ack']:assert obs['published']==True
            assert obs['result']['status']==('O3' if kind=='operation' and obs['published'] else ('O1' if kind=='operation' else 'verified'))
            s,m=after(c,f/'final-cold.json')
            if kind=='operation':assert s.ordinal==1 and s.state['families']['Env']['D']['base']==1
            else:assert s.head==before['8-publication']['head']
            if mode=='after_ack':
                ack=json.loads(child.stdout)
                if kind=='operation':assert ack['receipt']==obs['result']['receipt']
                else:assert ack['generation']==obs['opened_generation']
            record(kind+'-crash-'+mode,{'command':cmd,'exit':child.returncode,'cold_command':cmd2,'cold_exit':cold.returncode,**obs})
    write(out/'writer-observations.json',MeasuredCore.observations)
    summary={'status':'PASS','cases':results,'pass':len(results),'fail':0,'skip':0,'thresholds':thresholds,
      'original_27_method_suite':'separate tests/independent/verify_regression27.py, native expectation adaptations documented',
      'donor_derived_expectations_fresh_new_proof_execution':True,
      'native_adaptations':'new namespace; historical fixed floors measured rather than inherited; actual new raw SQL thresholds; unchanged20 case shapes'}
    write(out/'results.json',summary)
    print(json.dumps({k:v for k,v in summary.items() if k!='cases'},indent=2))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--out',type=Path,required=True);a=p.parse_args();run(a.out.resolve())
