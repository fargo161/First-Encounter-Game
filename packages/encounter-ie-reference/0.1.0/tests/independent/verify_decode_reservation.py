"""Observe whole UTF8 encode/decode calls before a tight ancestor refusal."""
import argparse
import json
from pathlib import Path
import sys

from verify_independent import SOURCE,save


def main():
    p=argparse.ArgumentParser();p.add_argument('--out',type=Path,required=True);a=p.parse_args()
    assert a.out.is_absolute() and not a.out.exists() and not a.out.is_relative_to(SOURCE)
    assert not any((x/'AGENTS.md').exists() and (x/'contracts').exists() for x in SOURCE.parents)
    a.out.mkdir(parents=True)
    from eaie import data
    value={'a':['x'*4096]*128};text=json.dumps(value,separators=(',',':'))
    assert len(text)>500000 and len(text)==len(text.encode('ascii'))
    results=[]
    for mode,raw in (('text',text),('bytes',text.encode('utf8'))):
        events=[];old=sys.getprofile()
        def profile(frame,event,arg):
            if event in ('c_call','c_return') and getattr(arg,'__self__',None) is raw:
                if getattr(arg,'__name__',None) in ('encode','decode'):events.append((event,arg.__name__))
        sys.setprofile(profile)
        try:
            try:
                with data.metered(100):
                    with data.metered(20000000):data.decode(raw,8388608)
            except data.Rejected:pass
            else:raise AssertionError('tight parent accepted large decode')
        finally:sys.setprofile(old)
        result={'group':mode,'input_bytes':len(text),'parent_limit':100,'child_limit':20000000,
                'whole_utf8_calls_before_refusal':events}
        results.append(result);save(a.out/'results.json',{'status':'RUNNING','groups':results})
        assert not events,('whole UTF8 stage ran before ancestor reserve',result)
        with data.metered(20000000):assert data.decode(raw,8388608)==value
        result['status']='PASS';print(result,flush=True)
    save(a.out/'results.json',{'status':'PASS','pass':2,'fail':0,'skip':0,'groups':results})


if __name__=='__main__':main()
