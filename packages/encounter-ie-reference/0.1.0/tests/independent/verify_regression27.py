"""Execute all27 mechanically ported C1 obligations against the new proof.

Native adaptations: new import/namespace, approved1M tick ceiling, raw SQL byte
census in place of old C1 work formula, and black-box real-writer cold boundary.
No Builder runtime expectations or skipped methods supply a passing result.
"""
import argparse
import io
import json
import os
from pathlib import Path
import sys
import unittest
import time

def main():
    p=argparse.ArgumentParser();p.add_argument('--out',required=True,type=Path);a=p.parse_args()
    source=Path(__file__).resolve().parents[2]
    assert a.out.is_absolute() and not a.out.exists() and not a.out.is_relative_to(source)
    assert not any((x/'AGENTS.md').exists() and (x/'contracts').exists() for x in source.parents)
    a.out.mkdir(parents=True)
    os.environ['EA_IE_DERIVED_TEST_OUT']=str(a.out/'worlds')
    sys.path.insert(0,str(source))
    import ported_donor27
    suite=unittest.defaultTestLoader.loadTestsFromModule(ported_donor27)
    stream=io.StringIO();start=time.perf_counter()
    result=unittest.TextTestRunner(stream=stream,verbosity=2).run(suite)
    (a.out/'test-output.txt').write_text(stream.getvalue(),encoding='utf8')
    summary={'tests':result.testsRun,'pass':result.testsRun-len(result.failures)-len(result.errors)-len(result.skipped),
        'fail':len(result.failures),'error':len(result.errors),'skip':len(result.skipped),
        'elapsed_seconds':time.perf_counter()-start,'failures':[(str(t),trace) for t,trace in result.failures],
        'errors':[(str(t),trace) for t,trace in result.errors],
        'status':'PASS' if result.wasSuccessful() and result.testsRun==27 and not result.skipped else 'FAIL'}
    (a.out/'results.json').write_text(json.dumps(summary,indent=2),encoding='utf8')
    print(json.dumps(summary),flush=True)
    sys.exit(0 if summary['status']=='PASS' else 1)
if __name__=='__main__':main()
