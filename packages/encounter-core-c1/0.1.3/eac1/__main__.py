import argparse,json,sys
from pathlib import Path
from .core import Core
from .atlas import inspect
from .data import copy

def main():
    p=argparse.ArgumentParser(description='EA-C1/0.1.2 Windows local SQLite non-social candidate')
    p.add_argument('action',choices=['init','prepare','admit','export','checkpoint','config'])
    p.add_argument('database',type=Path);p.add_argument('--request',type=Path);p.add_argument('--result',type=Path)
    p.add_argument('--kind',default='contribute');p.add_argument('--operation',default='o1');p.add_argument('--q',type=int,default=1)
    p.add_argument('--expected',type=Path);p.add_argument('--query',default='current');p.add_argument('--audience',choices=['author','public'],default='public')
    a=p.parse_args();expected=json.loads(a.expected.read_text()) if a.expected else None
    try:
        c=Core.create(a.database) if a.action=='init' else Core(a.database,expected=expected)
        if a.action=='init':out={'head':c.snapshot().head,'ordinal':0,'status':'created'}
        elif a.action=='prepare':
            if a.kind=='contribute':out=c.prepare(a.operation,a.kind,{'q':a.q},'D',c.qualified('S/1','mechanism','mechanism_0001','s1',1))
            else:raise ValueError('CLI prepare convenience only supports contribution; use Python API for other operations')
        elif a.action=='admit':out=c.admit(json.loads(a.request.read_text()),json.loads(a.result.read_text()) if a.result else None)
        elif a.action=='export':out=inspect(c.snapshot(),a.audience,a.query)
        elif a.action=='checkpoint':out=c.checkpoint()
        else:out=c.configuration()
    except Exception as e:out={'status':'O5','reason':str(e)}
    print(json.dumps(out,indent=2))
    return 1 if out.get('status') in ['O4','O5'] else 0
if __name__=='__main__':sys.exit(main())
