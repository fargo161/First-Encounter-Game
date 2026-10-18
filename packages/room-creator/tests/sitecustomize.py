"""Only active when tests/ is explicitly added to PYTHONPATH by the runner."""
import os
if os.environ.get('RC_TEST_RUNTIME')=='1':
 from playwright.async_api import BrowserType
 _launch=BrowserType.launch
 async def launch(self,*args,**kw):
  if os.environ.get('RC_BROWSER'):kw.setdefault('executable_path',os.environ['RC_BROWSER'])
  flags=list(kw.get('args') or [])
  if '--use-gl=swiftshader' in flags:flags.remove('--use-gl=swiftshader')
  if not any(x.startswith('--disable-webgl') for x in flags):flags+=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
  kw['args']=flags
  return await _launch(self,*args,**kw)
 BrowserType.launch=launch
