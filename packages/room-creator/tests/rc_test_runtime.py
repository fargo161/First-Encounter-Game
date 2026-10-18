"""Portable environment for all current and recovered browser checks."""
import os
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
OUT=Path(os.environ.get('RC_TEST_OUT', ROOT/'test_runs'/'latest'))
def rc_path(relative): return (ROOT/relative).as_posix()
def rc_uri(relative): return os.environ.get('RC_URL') if relative=='Room_Creator.html' and os.environ.get('RC_URL') else (ROOT/relative).as_uri()
def rc_output(relative):
 p=OUT/relative;p.parent.mkdir(parents=True,exist_ok=True)
 if not p.suffix:p.mkdir(parents=True,exist_ok=True)
 return p.as_posix()
def rc_prior(relative,uri=False):
 root=os.environ.get('RC_PRIOR_V12')
 if not root:return None
 p=Path(root)/relative
 return p.as_uri() if uri else p.as_posix()
