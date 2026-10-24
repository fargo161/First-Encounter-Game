"""Independent tester I: native semantic controls and raw-storage oracles.

Execute from a complete disposable package copy. No builder tests or reducers
provide expected semantic results. Outputs must be fresh and outside package.
"""
import argparse
import collections.abc
import ctypes
import hashlib
import json
import os
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys
import time
import traceback
import tracemalloc

SOURCE = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(SOURCE))


def plain(value):
    if isinstance(value, collections.abc.Mapping):
        return {k: plain(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [plain(v) for v in value]
    return value


def encoded(value):
    return json.dumps(plain(value), sort_keys=True, separators=(',', ':'),
                      ensure_ascii=True, allow_nan=False).encode('ascii')


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(plain(value), indent=2, ensure_ascii=True) + '\n', encoding='utf8')


def sql_oracle(path):
    with sqlite3.connect(path) as db:
        tables = {table: db.execute('SELECT * FROM ' + table).fetchall()
                  for table in ('root', 'history', 'meta', 'checkpoints')}
        ps = db.execute('PRAGMA page_size').fetchone()[0]
        pc = db.execute('PRAGMA page_count').fetchone()[0]
        inventory = db.execute("SELECT type,name,tbl_name,sql FROM sqlite_master ORDER BY name").fetchall()
    payload = {k: sum(len(r[-1].encode('utf8')) if isinstance(r[-1],str) else len(r[-1])
                      for r in rows) for k, rows in tables.items()}
    E = payload['root'] + payload['history'] + payload['checkpoints']
    files = {p.name: p.stat().st_size for p in path.parent.glob(path.name + '*') if p.is_file()}
    P = max(path.stat().st_size, ps * pc)
    return {'tables': tables, 'payload_bytes': payload, 'encoded_prefix_bytes': E,
            'page_size': ps, 'page_count': pc, 'physical_files': files,
            'required_workspace': 32 * E + 1048576 + 4 * P, 'inventory': inventory}


def rss_bytes():
    if sys.platform != 'win32':
        return None
    class Counters(ctypes.Structure):
        _fields_ = [('cb', ctypes.c_ulong), ('PageFaultCount', ctypes.c_ulong)] + [
            (n, ctypes.c_size_t) for n in ('PeakWorkingSetSize', 'WorkingSetSize',
            'QuotaPeakPagedPoolUsage', 'QuotaPagedPoolUsage', 'QuotaPeakNonPagedPoolUsage',
            'QuotaNonPagedPoolUsage', 'PagefileUsage', 'PeakPagefileUsage')]
    c = Counters(); c.cb = ctypes.sizeof(c)
    process = ctypes.windll.kernel32.GetCurrentProcess
    process.restype = ctypes.c_void_p
    fn = ctypes.windll.psapi.GetProcessMemoryInfo
    fn.argtypes = [ctypes.c_void_p, ctypes.c_void_p, ctypes.c_ulong]
    if fn(process(), ctypes.byref(c), c.cb):
        return {'working_set': c.WorkingSetSize, 'peak_working_set': c.PeakWorkingSetSize}
    return None


class Suite:
    def __init__(self, out, only=None, measure=False):
        from eaie import Core, Rejected, Unavailable
        self.Core, self.Rejected, self.Unavailable = Core, Rejected, Unavailable
        self.out, self.results, self.number = out, [], 0
        self.only,self.measure=only,measure
        self.phase_metrics=[]
        self.oldest = {}

    def new(self, name, fixture='reference', limits=None):
        p = self.out / name / 'world.db'; p.parent.mkdir(parents=True, exist_ok=False)
        c = self.Core.create(p, limits=limits, fixture=fixture)
        self.oldest[str(p)] = None
        return c

    def call(self, c, name, kind, params=None, **kwargs):
        r = c.prepare(name, kind, params, **kwargs)
        a = c.admit(r)
        self.record_work(c,name,kind,a)
        assert a['status'] in ('O1', 'O2'), (name, a)
        if self.oldest[str(c.path)] is None:
            self.oldest[str(c.path)] = (plain(r), plain(a))
        return a

    def record_work(self,c,name,kind,result):
        self.phase_metrics.append({'world':str(c.path),'operation':name,'kind':kind,
            'status':result.get('status'),'actual_admission':plain(getattr(c,'last_work',None)),
            'actual_prepare':plain(getattr(c,'last_prepare_work',None))})

    def refuse(self, c, name, kind, params=None, **kwargs):
        before = encoded(c.snapshot().state)
        r = c.prepare(name, kind, params, **kwargs)
        a = c.admit(r)
        assert a['status'] == 'O4', (name, a)
        assert encoded(c.snapshot().state) == before
        return a

    def items(self, c, actor, cutoff=None):
        v = c.holder_view(actor, cutoff=cutoff, limit=4)
        assert v.get('status') != 'unavailable', (actor, v)
        return plain(v)

    def state(self, c):
        return plain(c.snapshot().state)

    def receipts(self, c, holder, content=True):
        rows = self.state(c)['information']['receipts']
        return [r for r in rows if r['holder'] == holder and
                (not content or r['kind'] == 'content')]

    def claim(self, c, actor='alice', body='selected X', value='TRUE', name='claim', subject=None):
        p = {'actor': actor, 'body': body, 'subject': subject or
             {'kind': 'alleged', 'scope': actor, 'label': 'synthetic incident'},
             'value': value, 'source_assertion': 'claimed eyewitness',
             'valid_until': None, 'corrects': None}
        self.call(c, name, 'AssertClaim', p)
        return self.receipts(c, actor)[-1]['handle']

    def deliver(self, c, actor, source, targets, body='selected X', name='deliver', disclose=False):
        return self.call(c, name, 'Deliver', {'actor': actor, 'source': source, 'body': body,
            'targets': [{'kind': k, 'id': i} for k, i in targets],
            'source_assertion': 'claimed eyewitness', 'disclose_origin': disclose})

    def preserved(self, c, cutoffs=(0,)):
        key = str(c.path)
        first = self.oldest[key]
        assert first is not None
        before = plain(c.snapshot().state)
        seq = c.snapshot().ordinal
        retry_path = c.path.parent / 'oldest-request.json'; save(retry_path, first[0])
        expected_path = c.path.parent / 'expected.json'; save(expected_path, {'state': before, 'ordinal': seq,
                                                    'receipt': first[1]['receipt'],'limits':plain(c.profile['limits'])})
        cmd = [sys.executable, '-B', str(Path(__file__).resolve()), '--cold', str(c.path),
               '--fixture', getattr(c, 'fixture', 'reference'), '--request', str(retry_path),
               '--expected', str(expected_path)]
        child = subprocess.run(cmd, cwd=SOURCE, capture_output=True, text=True,
                               timeout=120, env=dict(os.environ, PYTHONDONTWRITEBYTECODE='1'))
        (c.path.parent / 'cold.stdout').write_text(child.stdout, encoding='utf8')
        (c.path.parent / 'cold.stderr').write_text(child.stderr, encoding='utf8')
        assert child.returncode == 0, child.stderr
        assert plain(c.snapshot().state) == before
        save(c.path.parent / 'storage.json', sql_oracle(c.path))
        save(c.path.parent / 'cold-command.json', {'command': cmd, 'exit': child.returncode,
                                                  'result': json.loads(child.stdout)})

    def run(self, name, fn):
        if self.only and self.only not in name:return
        start = time.perf_counter()
        if self.measure:tracemalloc.start()
        try:
            detail = fn() or {}
            result = {'id': name, 'status': 'PASS', 'detail': detail}
        except Exception as e:
            result = {'id': name, 'status': 'FAIL', 'error': str(e), 'traceback': traceback.format_exc()}
        current,peak=tracemalloc.get_traced_memory() if self.measure else (None,None)
        if self.measure:tracemalloc.stop()
        result.update(elapsed_seconds=time.perf_counter()-start, traced_peak_bytes=peak, rss=rss_bytes())
        self.results.append(result)
        save(self.out/'phase-metrics.json',self.phase_metrics)
        save(self.out / 'results.json', {'status': 'RUNNING', 'cases': self.results})
        print(json.dumps({k: v for k, v in result.items() if k not in ('traceback', 'detail')}), flush=True)


def cold(args):
    from eaie import Core
    expected = json.loads(args.expected.read_text(encoding='utf8'))
    c = Core(args.cold,limits=expected.get('limits',expected['state']['profile']['limits']),fixture=args.fixture)
    s = c.snapshot(); cold_work=plain(getattr(c,'last_cold_work',None))
    assert plain(s.state) == expected['state'] and s.ordinal == expected['ordinal']
    before = hashlib.sha256(args.cold.read_bytes()).hexdigest()
    views = [];query_work=[]
    for actor in ('alice', 'observer', 'dispatcher', 'handler', 'outsider', 'player'):
        for cutoff in sorted(set((0, 1, s.ordinal))):
            view = c.holder_view(actor, cutoff=cutoff, limit=4)
            views.append(view)
            query_work.append(plain(getattr(c,'last_query_work',None)))
    author = c.inspect()
    request = json.loads(args.request.read_text(encoding='utf8'))
    retry = c.admit(request)
    retry_work=plain(getattr(c,'last_work',None))
    assert retry == {'status': 'O3', 'receipt': expected['receipt']}, retry
    assert hashlib.sha256(args.cold.read_bytes()).hexdigest() == before
    print(json.dumps({'ordinal': s.ordinal, 'head': s.head, 'census': plain(s.census),
                      'views': plain(views), 'author': plain(author), 'retry': retry,
                      'actual_cold_work':cold_work,'actual_retry_work':retry_work,'actual_holder_query_work':query_work,
                      'sqlite': sqlite3.sqlite_version, 'python': sys.version}))


def main():
    p = argparse.ArgumentParser(); p.add_argument('--out', type=Path)
    p.add_argument('--only');p.add_argument('--measure',action='store_true')
    p.add_argument('--cold', type=Path); p.add_argument('--fixture', default='reference')
    p.add_argument('--request', type=Path); p.add_argument('--expected', type=Path)
    args = p.parse_args()
    if args.cold:
        cold(args); return
    assert args.out and args.out.is_absolute() and not args.out.exists()
    assert not args.out.is_relative_to(SOURCE), 'output must be external'
    assert 'packages' not in str(SOURCE.parent.parent).lower(), 'run a disposable copy'
    args.out.mkdir(parents=True)
    suite = Suite(args.out,only=args.only,measure=args.measure)
    from scenarios import register
    register(suite)
    from controls import register as register_controls
    register_controls(suite)
    from bounds import register as register_bounds
    register_bounds(suite)
    from semantics import register as register_semantics
    register_semantics(suite)
    from coupled import register as register_coupled
    register_coupled(suite)
    summary = {'status': 'PASS' if all(r['status']=='PASS' for r in suite.results) else 'FAIL',
               'pass': sum(r['status']=='PASS' for r in suite.results),
               'fail': sum(r['status']=='FAIL' for r in suite.results), 'skip': 0,
               'cases': suite.results, 'source': str(SOURCE), 'python': sys.version,
               'sqlite': sqlite3.sqlite_version,'selected':args.only,'tracemalloc_enabled':args.measure}
    save(args.out/'results.json', summary)
    sys.exit(0 if summary['status']=='PASS' else 1)


if __name__ == '__main__':
    main()
