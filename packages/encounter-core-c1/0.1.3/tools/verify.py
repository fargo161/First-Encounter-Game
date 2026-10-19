"""Reproduce candidate gates in a NEW output directory. No legacy dependencies.

Legacy tests/browser are separately bound to the preserved Stage 12 package.
"""
import argparse,json,os,sys,subprocess,time,sqlite3,statistics,tracemalloc,shutil
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from eac1 import Core,Unavailable
from eac1.core import DEFAULT_LIMITS
from eac1.data import copy,canonical,digest
from eac1.atlas import inspect

def write(p,value):p.write_text(json.dumps(value,indent=2)+'\n',encoding='utf-8')
def run(out):
    out.mkdir(parents=True,exist_ok=False);src=Path(__file__).resolve().parents[1]
    env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1',EA_C1_TEST_OUT=str(out/'unit-worlds'))
    start=time.monotonic()
    u=subprocess.run([sys.executable,'-B','-m','unittest','discover','-s','tests','-v'],cwd=src,env=env,capture_output=True,text=True)
    (out/'unit.log').write_text(u.stdout+u.stderr,encoding='utf-8')
    result={'unit_exit':u.returncode,'unit_seconds':time.monotonic()-start,'faults':[],'builder_tests_only':True,'independent_acceptance':'PENDING'}
    write(out/'results.json',result)
    if u.returncode:raise RuntimeError('Candidate unit failure; preserved unit.log')
    for mode in ['before_write','before_commit','during_commit','after_commit','after_ack']:
        folder=out/mode;folder.mkdir();db=folder/'world.db';c=Core.create(db);roothead=c.snapshot().head
        child=subprocess.run([sys.executable,'-B',str(src/'tools'/'fault_worker.py'),mode,str(db),str(folder)],cwd=src,env=env,capture_output=True,text=True,timeout=30)
        (folder/'child.stdout').write_text(child.stdout,encoding='utf-8');(folder/'child.stderr').write_text(child.stderr,encoding='utf-8')
        assert child.returncode==93,(mode,child.returncode,child.stderr)
        cold=subprocess.run([sys.executable,'-B',str(src/'tools'/'fault_worker.py'),'cold',str(db),str(folder)],cwd=src,env=env,capture_output=True,text=True,timeout=30)
        (folder/'cold.stdout').write_text(cold.stdout,encoding='utf-8');(folder/'cold.stderr').write_text(cold.stderr,encoding='utf-8')
        assert cold.returncode==0,cold.stderr
        observed=json.loads(cold.stdout);assert 'open_ordinal' in observed,observed
        n=observed['open_ordinal'];assert n in [0,1]
        if mode in ['before_write','before_commit']:assert n==0
        if mode in ['after_commit','after_ack']:assert n==1
        assert observed['retry']['status']==('O1' if n==0 else 'O3')
        assert observed['resolutions']==(1 if n==0 else 0)
        assert len(observed['stores_after']['6-RVD-registry'])==1
        assert observed['stores_after']['1-families']['Env']['D']['base']==1
        if n==0:assert observed['open_head']==roothead
        else:
            marker=json.loads((folder/'before_commit.json').read_text());assert observed['open_head']==marker['prospective_head']
        record={'mode':mode,'exit':child.returncode,'cold_exit':cold.returncode,'recovered_ordinal':n,'retry':observed['retry']['status'],'resolver_calls':observed['resolutions'],'ack_received':bool(child.stdout.strip()),'status':'PASS'}
        if mode=='before_commit':assert json.loads((folder/'before_commit.json').read_text())['journal_exists']
        if mode=='after_ack':assert json.loads(child.stdout)['receipt']==observed['retry']['receipt']
        result['faults'].append(record);write(out/'results.json',result)
    storage=[]
    for fault in ['full','readonly']:
        folder=out/('sqlite-'+fault);folder.mkdir();c=Core.create(folder/'world.db');before=canonical(c.snapshot().stores)
        r=c.prepare('o1','contribute',{'q':1},'D',c.qualified('S/1','mechanism','mechanism_0001','s1',1));a=c.admit(r,backend_fault=fault)
        assert a['status']=='O4' and canonical(c.snapshot().stores)==before
        storage.append({'fault':fault,'actual_sqlite_result':a,'valid_retry':c.admit(r)})
    write(out/'backend-faults.json',storage)
    # Longest supported growth workload. Actual measured numbers do not turn
    # deterministic accounting units into CPU-cycle or infinite-play guarantees.
    folder=out/'capacity';folder.mkdir();c=Core.create(folder/'world.db');times=[];reads=[];rss=[];censuses=[]
    def windows_rss():
        import ctypes
        from ctypes import wintypes
        class PMC(ctypes.Structure):
            _fields_=[('cb',wintypes.DWORD),('PageFaultCount',wintypes.DWORD),('PeakWorkingSetSize',ctypes.c_size_t),('WorkingSetSize',ctypes.c_size_t),('QuotaPeakPagedPoolUsage',ctypes.c_size_t),('QuotaPagedPoolUsage',ctypes.c_size_t),('QuotaPeakNonPagedPoolUsage',ctypes.c_size_t),('QuotaNonPagedPoolUsage',ctypes.c_size_t),('PagefileUsage',ctypes.c_size_t),('PeakPagefileUsage',ctypes.c_size_t)]
        v=PMC();v.cb=ctypes.sizeof(v)
        get=ctypes.windll.psapi.GetProcessMemoryInfo;get.argtypes=[wintypes.HANDLE,ctypes.c_void_p,wintypes.DWORD];get.restype=wintypes.BOOL
        assert get(wintypes.HANDLE(-1),ctypes.byref(v),v.cb),'GetProcessMemoryInfo failed'
        return {'rss':v.WorkingSetSize,'process_peak_rss':v.PeakWorkingSetSize}
    for i in range(DEFAULT_LIMITS['operations']):
        r=c.prepare('load'+str(i),'contribute',{'q':i%5},'D',c.qualified('S/1','mechanism','mechanism_0001','s1',1));start=time.perf_counter();a=c.admit(r);times.append(time.perf_counter()-start)
        assert a['status'] in ['O1','O2'],a
        start=time.perf_counter();snap=Core(c.path).snapshot();reads.append(time.perf_counter()-start);rss.append(windows_rss());censuses.append(copy(snap.census))
    # Keep latency measurements free of allocation-tracing distortion. Sample
    # heap at full capacity during complete reopening and prospective staging.
    tracemalloc.start();Core(c.path).snapshot()
    rejected=c.admit(c.prepare('one-over','contribute',{'q':1},'D',c.qualified('S/1','mechanism','mechanism_0001','s1',1)));assert rejected['status']=='O4'
    peak=tracemalloc.get_traced_memory()[1];tracemalloc.stop()
    assert c.admit(r)['status']=='O3'
    measured={'operations':64,'one_over':rejected,'supported_profile':c.profile,'commit_seconds':times,'new_connection_full_reopen_seconds':reads,
      'commit_p50':statistics.median(times),'commit_p95':sorted(times)[int(len(times)*.95)-1],'commit_worst':max(times),
      'reopen_worst':max(reads),'python_tracemalloc_peak':peak,'rss_observations':rss,'census_each_head':censuses,
      'database_bytes':c.path.stat().st_size,'free_bytes':shutil.disk_usage(folder).free,'configuration':c.configuration(),
      'latency_instrumentation':'No tracemalloc in timed growth loop; separate full-capacity cold+prospective heap sample',
      'limits_status':'BUILDER_MEASURED_CANDIDATE_ENVELOPE_PENDING_INDEPENDENT_REVIEW','power_loss_certified':False}
    assert peak<=c.profile['limits']['memory_bytes']
    write(folder/'measurements.json',measured)
    # Small portable proof build: both scenes and two due instants.
    folder=out/'proof';folder.mkdir();c=Core.create(folder/'world.db');receipts=[]
    ref=c.qualified('S/1','mechanism','mechanism_0001','s1',1);r=c.prepare('scene0','contribute',{'q':1},'D',ref);receipts.append(c.admit(r));write(folder/'original-request.json',r)
    receipts.append(c.admit(c.prepare('unload','unload',{'artifact':'S/1','old_epoch':'s1'})))
    child=subprocess.run([sys.executable,'-B',str(src/'tools'/'continuity_worker.py'),str(c.path),'T/1',str(folder/'original-request.json')],cwd=src,env=env,capture_output=True,text=True,timeout=60)
    (folder/'continuity.stdout').write_text(child.stdout,encoding='utf-8');(folder/'continuity.stderr').write_text(child.stderr,encoding='utf-8');assert child.returncode==0,child.stderr
    continuation=json.loads(child.stdout);assert continuation['status']=='PASS';receipts.append(continuation['commit']);c=Core(c.path)
    reverse=out/'reverse-continuity';reverse.mkdir();other=Core.create(reverse/'world.db');ref=other.qualified('T/1','mechanism','mechanism_0009','t1',1)
    original=other.prepare('scene0','contribute',{'q':1},'D',ref);assert other.admit(original)['status']=='O1';write(reverse/'original-request.json',original)
    assert other.admit(other.prepare('unload','unload',{'artifact':'T/1','old_epoch':'t1'}))['status']=='O1'
    child=subprocess.run([sys.executable,'-B',str(src/'tools'/'continuity_worker.py'),str(other.path),'S/1',str(reverse/'original-request.json')],cwd=src,env=env,capture_output=True,text=True,timeout=60)
    (reverse/'continuity.stdout').write_text(child.stdout,encoding='utf-8');(reverse/'continuity.stderr').write_text(child.stderr,encoding='utf-8');assert child.returncode==0,child.stderr
    assert json.loads(child.stdout)['status']=='PASS'
    r=c.prepare('clock','advance',{'to':10});receipts.append(c.admit(r));c.checkpoint();a=c.snapshot()
    write(folder/'expected-boundary.json',{'seq':a.ordinal,'head':a.head});write(folder/'receipts.json',receipts)
    for query in ['current','identity','due','cause','terminal-receipt','closure','coverage','resource-census','stores']:
        write(folder/(query+'.json'),inspect(a,'author',query))
    result.update(status='PASS',storage_faults=len(storage),measured_operations=64,fresh_process_cross_scene_directions=2,configuration=c.configuration(),
      runtime_unit_test_methods=27,power_loss_claim=False,legacy_gate='separate exact Stage12 disposable wrapper and native browser evidence required')
    write(out/'results.json',result);print(json.dumps(result,indent=2))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--out',type=Path,required=True);a=p.parse_args();run(a.out.resolve())
