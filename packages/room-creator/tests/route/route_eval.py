"""Scripted evaluation of the route-walk prototype.
Runs the same seeded scenarios under different settings with fixed 1/30 s steps, collects the
prototype's own measurements, and takes the screenshots used in PROTOTYPE_FINDINGS.md."""
import asyncio, json, os
from playwright.async_api import async_playwright
import os as _o
_PKG=_o.path.dirname(_o.path.dirname(_o.path.dirname(_o.path.abspath(__file__))))  # package folder
_OUT=_o.path.join(_o.path.dirname(_o.path.abspath(__file__)),'out'); _o.makedirs(_OUT,exist_ok=True)
from pathlib import Path
URL=_o.environ.get('RC_URL',Path(_PKG,'Room_Creator.html').as_uri())
SCENE=_PKG+'/examples/Route_Prototype_Street.room.json'
OUT=_OUT+'/route_eval_shots'; os.makedirs(OUT,exist_ok=True)
RES=_OUT+'/route_eval_results.json'

DRIVER = r"""
window.SCN = (()=>{
  const X=()=>RCApp.ext().route, RW=()=>X().RW;
  let cur=null;
  const node=id=>RW().nodes.find(n=>n.id===id);
  const scripts={
    // S1: an ordinary stroll east with glances around, use the crosswalk, turn at the pier, walk back.
    stroll:(t,c,P)=>{const cyc=t%12;let look=cyc<5?8*Math.sin(t*1.3):cyc<8?75:cyc<10?-50:0;
      if(c.strafe){const s7=t%7;P.inp.right=s7>=1&&s7<3;P.inp.left=s7>=4&&s7<6;}
      P.inp.fwd=true;if(RW().pl.stop&&/End/.test(RW().pl.stop)&&!c.turned){X().turn();c.turned=true;}if(c.turned&&RW().pl.dir>0&&RW().pl.edge.id==='e_harlan_w'&&RW().pl.s<10)P.inp.fwd=false;
      P.look=look;},
    // S2: walk to the parked car, step into the spot behind it, crouch, watch the mark, stand up, shoot.
    spy:(t,c,P)=>{const pl=RW().pl,n5=node('N4');
      if(!c.arrived){P.inp.fwd=pl.edge.id==='e_harlan_w'&&pl.s<n5.s-.05;P.look=0;if(!P.inp.fwd){P.inp.right=true;if(n5.occ==='player'){c.arrived=t;P.inp.right=false;}}return;}
      const dt=t-c.arrived;P.inp.right=false;P.inp.fwd=false;
      const m=RW().npcs.find(n=>n.role==='mark');const pp=X().pos();
      let aim=72;if(m&&m.state!=='hidden'){const h=Math.atan2(m.x-pp.x,-(m.y-pp.y))*180/Math.PI;aim=((h-90)%360+540)%360-180;}
      P.look=Math.max(-RW().settings.lookYaw,Math.min(RW().settings.lookYaw,aim));P.pitch=0;
      X().crouch(dt<25);if(dt>=25&&dt<25.04)c.standAt=t;if(dt>30&&!c.shot){c.shot=true;P.shoot=true;c.shotAt=t;}if(c.shot&&!c.shotMsg&&t>c.shotAt)c.shotMsg=RW().msg;},
    // S3: walk east while looking across the street the whole time (worst case for side-on far walkers).
    across:(t,c,P)=>{P.inp.fwd=true;P.look=80;},
    // S4: stand on the sidewalk and watch the street, like a rail-shooter stop.
    watch:(t,c,P)=>{const pl=RW().pl;P.inp.fwd=pl.edge.id==='e_harlan_w'&&pl.s<24;P.look=pl.s>=24?85:0;},
    // S5: stand near the stoop sitter and shuffle left and right, to test flicker.
    wiggle:(t,c,P)=>{const pl=RW().pl;if(pl.s<17.6&&!c.there){P.inp.fwd=true;P.look=0;return;}c.there=true;P.inp.fwd=false;
      const st=RW().npcs.find(n=>n.role==='stoop');let aim=-60;if(st&&st.state!=='hidden'){const pp=X().pos(),h=Math.atan2(st.x-pp.x,-(st.y-pp.y))*180/Math.PI;aim=((h-90)%360+540)%360-180;}
      P.look=aim;const k=Math.floor(t/.7)%2;P.inp.right=k===0;P.inp.left=k===1;},
  };
  return {
    init(cfg){const x=X();if(RW().on)x.stop();RW().userSettings={...cfg.settings};RCApp.ext().route.RW.settings={};x.start();x.pause(true);x.reset();
      cur={cfg,t:0,c:{...(cfg.flags||{})},script:scripts[cfg.script]};return x.pos();},
    run(until){const x=X(),dt=1/30;while(cur.t<until){const P={inp:{fwd:false,back:false,left:false,right:false},look:null,pitch:null,shoot:false};cur.script(cur.t,cur.c,P);
        x.input(P.inp);if(P.look!=null){const pl=RW().pl;const tgt=P.look,cap=RW().settings.lookYaw;pl.headYaw+=Math.max(-150*dt,Math.min(150*dt,tgt-pl.headYaw));pl.headYaw=Math.max(-cap,Math.min(cap,pl.headYaw));}
        if(P.pitch!=null)RW().pl.pitch=P.pitch;if(P.shoot)x.shoot();x.step(dt);cur.t+=dt;}
      return {t:+cur.t.toFixed(2),pos:x.pos(),msg:RW().msg,markWhy:RW().markWhy,c:cur.c};},
    draw(debug){if(debug!=null)RW().settings.debug=debug;X().sync();RCApp.draw();},
    stats(){return X().stats();},
    npcs(){return X().npcs();},
    cars(){return RW().cars.map(c=>({id:c.id,state:c.state,x:+c.x.toFixed(1),y:+c.y.toFixed(1),view:c.view,onScreen:c.onScreen,yield:!!c.yielding}));},
  };
})();
"""

async def main():
    out={}
    async with async_playwright() as pw:
        b=await pw.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1600,'height':950})
        errs=[];pg.on('pageerror',lambda e:errs.append('PAGEERROR '+str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(URL);await pg.wait_for_timeout(500)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));RCApp.draw();}",open(SCENE).read())
        await pg.evaluate(DRIVER)
        box=await pg.evaluate("()=>{const r=document.getElementById('stageWrap').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}")
        async def shot(name,debug=2,full=False):
            await pg.evaluate("d=>SCN.draw(d)",debug); await pg.wait_for_timeout(250)
            await pg.screenshot(path=f'{OUT}/{name}.png',clip=None if full else box)
        async def scenario(key,script,settings,T,shots=(),flags=None):
            await pg.evaluate("c=>SCN.init(c)",{'script':script,'settings':settings,'flags':flags or {}})
            log=[]
            for (ts,name,dbg) in sorted(shots):
                st=await pg.evaluate("t=>SCN.run(t)",ts); log.append(st); await shot(name,dbg)
            st=await pg.evaluate("t=>SCN.run(t)",T); log.append(st)
            s=await pg.evaluate("()=>SCN.stats()"); s['log']=log; out[key]=s
            print(key,'done',s['seconds'],'s', 'rules',s['rules'])
            return s
        base={}
        # ---- main runs with screenshots
        await scenario('S1_stroll','stroll',base,150,[(9,'s1_sidewalk_t09',2),(9.01,'s1_sidewalk_t09_clean',0),(16,'s1_walkerC_steps_aside_t16',1),(23,'s1_walkerC_at_window_t23',1),(27,'s1_walkerC_t27',2),(52,'s1_corner_t52',2),(52.01,'s1_corner_t52_clean',0)])
        await pg.keyboard.press('1'); await pg.wait_for_timeout(900); await pg.screenshot(path=f'{OUT}/map_route_network.png',clip=box); await pg.keyboard.press('3'); await pg.wait_for_timeout(300)
        await scenario('S1_stroll_side','stroll',{'allowSide':True},150)
        await scenario('S2_spy','spy',base,75,[(30,'s2_crouched_behind_car',2),(30.01,'s2_crouched_clean',0),(42,'s2_standing_exposed',2),(46.5,'s2_after_shot',2)])
        await scenario('S3_across','across',base,40,[(6,'s3_across_t06',2),(6.01,'s3_across_t06_clean',0),(14,'s3_across_t14',2)])
        await scenario('S3_across_side','across',{'allowSide':True},40,[(6,'s3_across_t06_SIDE',2),(14,'s3_across_t14_SIDE',2)])
        await scenario('S3_across_backq','across',{'allowBackQ':True},40,[(14,'s3_across_t14_BACKQ',2)])
        await pg.evaluate("c=>SCN.init(c)",{'script':'watch','settings':{},'flags':{}})
        got=None
        for i in range(1,240):
            await pg.evaluate("t=>SCN.run(t)",i*.5)
            cars=await pg.evaluate("()=>SCN.cars()")
            on=[c for c in cars if c['onScreen'] and 40<c['y']<50 and 5<c['x']<55]
            if on: got=(i*.5,on); break
        print('car on screen at',got)
        if got: await shot('s4_traffic_car',1); await shot('s4_traffic_car_clean',0)
        await scenario('S4_watch','watch',base,120)
        await scenario('S4_watch_side','watch',{'allowSide':True},120)
        # ---- flicker: the view picker alone, camera drifting past a standing NPC with a 0.35 m shuffle
        out['flicker']=await pg.evaluate('''()=>{const sel=RCApp.ext().route.select,res={};
          for(const H of [0,4,8,12,16,20]){const r={};
            for(const [name,d,x0,x1] of [['walk past at 3 m',3,-6,6],['stand on the FRONT/3-4 border, shuffle',3,3*Math.tan(22.5*Math.PI/180),3*Math.tan(22.5*Math.PI/180)],['stand on the 3-4/BACK border, shuffle',3,3*Math.tan(112.5*Math.PI/180),3*Math.tan(112.5*Math.PI/180)]]){
              const st={view:null,vsign:1};let sw=0;const T=20;for(let t=0;t<T;t+=1/30){const x=x0+(x1-x0)*t/T+.35*Math.sin(2*Math.PI*1.4*t);const cam=name.includes('BACK')?{x:3*Math.sin(112.5*Math.PI/180)+.35*Math.sin(2*Math.PI*1.4*t)*Math.cos(112.5*Math.PI/180),y:-3*Math.cos(112.5*Math.PI/180)+.35*Math.sin(2*Math.PI*1.4*t)*Math.sin(112.5*Math.PI/180)}:{x,y:-d};
                sel(st,0,['front','q','back'],cam,{x:0,y:0},25,H,18);if(st.switched)sw++;}r[name]=sw;}
            res['H'+H]=r;}return res;}''')
        print('flicker',out['flicker'])
        await scenario('S5_wiggle_H12','wiggle',base,40,[(20,'s5_wiggle_stoop',2)])
        await scenario('S5_wiggle_H0','wiggle',{'hysteresis':0},40)
        # ---- sweeps (no screenshots)
        for r in (0,15,25,45,60):
            await scenario(f'sweep_rubber{r}_across','across',{'rubber':r},40)
            await scenario(f'sweep_rubber{r}_stroll','stroll',{'rubber':r},150)
        for tol in (10,30):
            await scenario(f'sweep_tol{tol}_stroll','stroll',{'tolerance':tol},150)
        await scenario('sweep_nodistcheat_stroll','stroll',{'distCheat':False},150)
        await scenario('S1_stroll_H0','stroll',{'hysteresis':0},150)
        for sb in (.4,.7,1.0):
            await scenario(f'sweep_strafe{sb}_strafing_stroll','stroll',{'strafe':sb},150,flags={'strafe':True})
        out['errors']=errs[:20]
        await b.close()
    json.dump(out,open(RES,'w'),indent=1)
    print('saved',RES,'errors',errs[:5])
asyncio.run(main())
