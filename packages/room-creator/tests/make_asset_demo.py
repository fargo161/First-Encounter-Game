"""Builds examples/Route_Prototype_Street_ASSET_DEMO.room.json from the unchanged Route_Prototype_Street.room.json.

It drives the real editor (Room Creator 0.14) in a headless browser with the asset library connected, so every object
gets its real measured size, and looks / palettes / textures are made with the editor's own functions. The baseline file
is only read, never written. Needs the local web server on port 8770 serving /home/claude (like the other asset tests).

What it does
- removes the placeholder boxes that real 3D objects replace (the 6-box parked car, dumpsters, pallets, crates, desk, a can);
- lightly furnishes the street, alley, tunnel and Dunmore St; fully furnishes the bodega shop floor, stockroom,
  back office and the upstairs flat;
- adds named looks, project palettes, per-object overrides, object setups (front side, default use points),
  gameplay tags, extra properties and Use Points, library textures on the flat and office surfaces;
- adds a few viewpoints for checking the furnished spaces."""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
import os as _os
RC_PAGE = _os.environ.get('RC_PAGE', '/pkg/Room_Creator.html')  # page path on the test web server
RC_LIB = _os.environ.get('RC_LIB', '/lib/')  # library folder on the test web server
RC_FIXTURES = _os.environ.get('RC_FIXTURES', '/pkg/tests/fixtures/')  # tests/fixtures on the test web server
_INIT = 'window.__RC_LIB=%r;window.__RC_FIX=%r;' % (RC_LIB, RC_FIXTURES)

BASE = os.environ.get('RC_BASE', 'http://127.0.0.1:8770')
URL = BASE + RC_PAGE
LIB_URL = RC_LIB
WORK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(WORK, 'examples', 'Route_Prototype_Street.room.json')
DST = os.environ.get('RC_DEMO_OUT', os.path.join(WORK, 'generated', 'Route_Prototype_Street_ASSET_DEMO.room.json'))
os.makedirs(os.path.dirname(DST), exist_ok=True)

CHAIR = 'lp_furniture_chairs_mesh_chair_wood_01'
CAR = 'car_kent_ford_crown_victoria'
FLAT = 'room_mvcv5kcr_o2gt4ij'

def P(type_, right=0, forward=0, up=0, facing=0, name=None, **extra):
    d = {'type': type_, 'right': right, 'forward': forward, 'up': up, 'facing': facing}
    if name: d['name'] = name
    d.update(extra); return d

# ---------------------------------------------------------------- placements (plan metres; rot = heading the front faces)
PROPS = [
    # ===== EXTERIOR (light pass) =====
    dict(id='prop_car_unmarked', asset=CAR, name='Unmarked Crown Vic (cover car)', x=34.8, y=41.15, rot=270,
         tags=['vehicle', 'cover'], props={'cover': {'height': 'low', 'note': 'replaces the 6 placeholder boxes; route-net spots N4/N5 stay as they were'}},
         points=[P('cover', right=1.95, forward=1.8, facing=270, name='Behind the car · west (= N4)'),
                 P('cover', right=1.95, forward=-1.4, facing=270, name='Behind the car · east (= N5)'),
                 P('driver', right=-1.3, forward=0.4, facing=90, name='Driver door')]),
    dict(id='prop_car_police', asset=CAR, name='Police Crown Vic (default livery)', x=14, y=49.1, rot=90,
         tags=['vehicle', 'cover', {'id': 'faction', 'value': 'police'}], props={'siren': False}),
    dict(id='prop_dumpster_west', asset='lp_dumpster_bins_mesh_dumpster_closed', name='Alley dumpster (west)', x=25, y=-5.35, rot=180,
         tags=['cover', 'hide', 'container'], props={'loot': {'table': 'alley_junk', 'rolls': 2}}),
    dict(id='prop_dumpster_mid', asset='lp_dumpster_bins_mesh_dumpster_open', name='Alley dumpster (open)', x=44, y=-0.65, rot=0,
         tags=['cover', 'container'], props={'smell': 0.8}),
    dict(id='prop_dumpster_east', asset='lp_dumpster_bins_mesh_dumpster_closed', name='Alley dumpster (east, grimy)', x=56, y=-5.35, rot=180,
         tags=['cover', 'hide'], palette_quick='grimy'),
    dict(id='prop_binbag_1', asset='lp_misc_props_mesh_binbag_01', x=23.6, y=-5.55, rot=20, solid=False, tags=['breakable']),
    dict(id='prop_binbag_2', asset='lp_misc_props_mesh_binbag_02', x=24.1, y=-4.6, rot=200, solid=False),
    dict(id='prop_binbag_3', asset='lp_misc_props_mesh_binbag_01', x=26.4, y=-4.55, rot=90, solid=False),
    dict(id='prop_alley_crate_1', asset='lp_furniture_storage_crates_mesh_storagecrate_010', x=12.2, y=-0.55, rot=0, tags=['movable', 'container'],
         points=[P('search', forward=0.6, facing=180)]),
    dict(id='prop_alley_crate_2', asset='lp_furniture_storage_crates_mesh_storagecrate_010', x=12.25, y=-0.5, z=0.51, rot=10, tags=['movable']),
    dict(id='prop_wheelie_bodega', asset='lp_dumpster_bins_mesh_wheelie_bin_closed', name='Bodega wheelie bin', x=59.1, y=39.45, rot=180, tags=['container']),
    dict(id='prop_food_truck', asset='car_kent_food_truck', name='Taco truck', x=68, y=60, rot=180,
         tags=['vehicle', 'commercial', 'interactable'], props={'menu': 'tacos', 'open_hours': '18-02'},
         points=[P('customer', right=2.0, forward=0.3, facing=270, name='Serving hatch (customer)'), P('work', right=0.6, forward=0.3, facing=90, name='Cook (inside)')]),
    dict(id='prop_van_rusty', asset='car_lp2_van', name='Abandoned van (rust texture)', x=-28, y=41.5, rot=270,
         tags=['vehicle', 'cover', 'hide'], texture='pix_metal_metal_01_grey_rust_3',
         points=[P('hide', right=-1.5, forward=0, facing=90, name='Behind the van')]),

    # ===== BODEGA · SHOP FLOOR (46..60 x 28..36) =====
    dict(id='prop_shop_shelf_long', asset='lp_furniture_shelves_shelf_05_mesh_shelf_05', name='Wall shelving (west)', x=46.6, y=30.6, rot=0, tags=['container', 'commercial']),
    dict(id='prop_shop_shelf_n1', asset='lp_furniture_shelves_shelf_04_mesh_shelf_04a', name='Shelf (north wall, west)', x=50.9, y=28.4, rot=90, tags=['commercial']),
    dict(id='prop_shop_shelf_n2', asset='lp_furniture_shelves_shelf_04_mesh_shelf_04b', name='Shelf (north wall, east)', x=54.8, y=28.4, rot=90, tags=['commercial']),
    dict(id='prop_shop_rack', asset='lp_furniture_shelves_shelf_03_mesh_shelf_03_tall', name='Crisp rack', x=54.1, y=34.4, rot=0, tags=['commercial']),
    dict(id='prop_shop_crate_drinks', asset='lp_furniture_storage_crates_mesh_storagecrate_012', name='Drinks crate', x=48.2, y=28.5, rot=90, tags=['movable', 'container']),
    dict(id='prop_shop_box', asset='lp_misc_props_mesh_box_04', x=56.3, y=34.9, rot=15, tags=['movable']),
    dict(id='prop_cafe_table', asset='lp_furniture_tables_mesh_table_wood_01', name='Coffee table', x=50.3, y=35.05, rot=0, tags=['cover'],
         points=[P('use', forward=0.65, facing=180, name='Stand at table')]),
    dict(id='prop_cafe_chair_a', asset=CHAIR, name='Café chair (black lacquer look)', x=49.6, y=35.05, rot=90, look='look_chair_black', tags=['seat']),
    dict(id='prop_cafe_chair_b', asset=CHAIR, name='Café chair (faded palette)', x=51.0, y=35.05, rot=270, palette_quick='faded', tags=['seat']),
    dict(id='prop_till', asset='lp_technology_props_misc_tech_props_mesh_checkout_till_02', name='Register', x=57.35, y=31.9, z=1.0, rot=270,
         tags=['interactable', 'commercial'], props={'cash': {'min': 40, 'max': 220}, 'alarm': True},
         points=[P('customer', forward=0.85, facing=180, name='Customer pays here'), P('work', forward=-0.9, facing=0, name='Cashier')]),
    dict(id='prop_cardreader', asset='lp_technology_props_misc_tech_props_mesh_cardreader_01', x=57.2, y=32.55, z=1.0, rot=270, tags=['interactable']),
    dict(id='prop_cctv_tv', asset='lp_technology_props_tv_mesh_tv_crt_01', name='Security monitor', x=57.4, y=30.15, z=1.0, rot=90, solid=False, tags=['interactable', 'evidence']),
    dict(id='prop_counter_radio', asset='lp_technology_props_audio_equipment_mesh_radio_02', x=57.4, y=33.0, z=1.0, rot=90),
    dict(id='prop_counter_drinks1', asset='lp_misc_props_mesh_drinks_06', x=57.15, y=31.2, z=1.0, rot=0, tags=['pickup']),
    dict(id='prop_counter_drinks2', asset='lp_misc_props_mesh_drinks_05', x=57.3, y=31.05, z=1.0, rot=40, tags=['pickup']),
    dict(id='prop_counter_bottle', asset='lp_misc_props_mesh_bottles_04', x=57.5, y=30.9, z=1.0, rot=0, tags=['pickup']),
    dict(id='prop_clerk_stool', asset='lp_furniture_chairs_mesh_chair_stool_01', name='Clerk stool', x=59.35, y=31.6, rot=270, tags=['seat'],
         points=[P('sit', facing=0)]),
    dict(id='prop_extinguisher_shop', asset='lp_misc_props_mesh_extinguisher', x=59.75, y=35.7, rot=270, tags=['interactable', 'pickup']),

    # ===== BODEGA · STOCKROOM (50..60 x 22..28; stairs along the north wall) =====
    dict(id='prop_stock_racking', asset='lp_furniture_shelves_shelf_07_mesh_shelf_07a', name='Racking', x=57.15, y=22.55, rot=180, tags=['container', 'climb']),
    dict(id='prop_stock_shelf_e', asset='lp_furniture_shelves_shelf_06_mesh_shelf_06_mid', name='Warehouse shelf', x=59.42, y=24.0, rot=0, tags=['container']),
    dict(id='prop_stock_crate_big', asset='lp_furniture_storage_crates_mesh_storagecrate_014', name='Crate (bottom)', x=56.8, y=24.75, rot=0, tags=['movable', 'container', 'cover'],
         points=[P('search', forward=0.85, facing=180, name='Open crate')]),
    dict(id='prop_stock_crate_top', asset='lp_furniture_storage_crates_mesh_storagecrate_08', name='Crate (stacked)', x=56.8, y=24.75, z=1.01, rot=5, tags=['movable', 'container']),
    dict(id='prop_stock_crate_long', asset='lp_furniture_storage_crates_mesh_storagecrate_013', x=53.2, y=27.3, rot=90, tags=['movable', 'container']),
    dict(id='prop_stock_box', asset='lp_misc_props_mesh_box_04', x=54.15, y=27.35, rot=0, tags=['movable']),
    dict(id='prop_stock_small_1', asset='lp_furniture_storage_crates_mesh_storagecrate_010', x=59.45, y=27.5, rot=0, tags=['movable', 'container']),
    dict(id='prop_stock_small_2', asset='lp_furniture_storage_crates_mesh_storagecrate_010', x=59.45, y=27.5, z=0.51, rot=-8, tags=['movable']),
    dict(id='prop_stock_trolley', asset='lp_furniture_trolleys_mesh_trolley_013', name='Stock trolley', x=55.4, y=25.95, rot=90, tags=['movable']),
    dict(id='prop_stock_bag_1', asset='lp_misc_props_mesh_binbag_02', x=50.5, y=27.5, rot=0, solid=False),
    dict(id='prop_stock_bag_2', asset='lp_misc_props_mesh_binbag_01', x=51.0, y=27.6, rot=130, solid=False),
    dict(id='prop_extinguisher_stock', asset='lp_misc_props_mesh_extinguisher', x=57.05, y=27.8, rot=180, tags=['interactable', 'pickup']),

    # ===== BODEGA · BACK OFFICE (46..50 x 22..28) =====
    dict(id='prop_office_desk', asset='lp_furniture_tables_mesh_table_rectangle_01', name='Office desk', x=48.2, y=26.6, rot=90, tags=['interactable', 'cover'],
         props={'drawer': {'locked': True, 'key': 'office_key'}},
         points=[P('work', right=0.85, forward=0, facing=270, name='Desk (owner side)'), P('customer', right=-0.95, forward=0, facing=90, name='Visitor stands here')]),
    dict(id='prop_office_chair', asset='lp_furniture_chairs_mesh_chair_single_05', name='Office chair', x=48.2, y=25.75, rot=180, tags=['seat'],
         points=[P('sit', facing=0)]),
    dict(id='prop_office_monitor', asset='lp_technology_props_monitors_mesh_monitor_02', x=48.1, y=26.55, z=0.77, rot=0, solid=False, tags=['interactable', 'evidence']),
    dict(id='prop_office_keyboard', asset='lp_technology_props_computer_parts_mesh_computer_keyboard_01', x=48.15, y=26.2, z=0.77, rot=90),
    dict(id='prop_office_mouse', asset='lp_technology_props_computer_parts_mesh_computer_mouse_01', x=48.7, y=26.25, z=0.77, rot=0),
    dict(id='prop_office_papers', asset='lp_misc_props_mesh_paperstack_01', x=47.65, y=26.75, z=0.77, rot=12, tags=['evidence', 'pickup']),
    dict(id='prop_office_pc', asset='lp_technology_props_computer_parts_mesh_pc_tower_01', x=47.05, y=26.65, rot=0),
    dict(id='prop_office_rack', asset='lp_furniture_shelves_shelf_03_mesh_shelf_03_medium', name='Files rack', x=47.3, y=22.4, rot=180, tags=['container', 'search']),
    dict(id='prop_office_boxes', asset='lp_misc_props_mesh_box_02', x=46.4, y=27.55, rot=0),
    dict(id='prop_office_boxes2', asset='lp_misc_props_mesh_box_02', x=46.42, y=27.55, z=0.18, rot=9),
    dict(id='prop_office_key', asset='lp_misc_props_mesh_keys_02', name='Office keys', x=48.75, y=26.85, z=0.77, rot=30, tags=['pickup', {'id': 'unlocks', 'value': 'office_key'}]),

    # ===== UPSTAIRS FLAT (story 1, 50..60 x 22..28; stair opening along the north wall to x 55.7) =====
    dict(id='prop_flat_table', asset='lp_furniture_tables_mesh_table_wood_01', name='Kitchen table', x=52.6, y=26.0, story=1, rot=0),
    dict(id='prop_flat_chair_n', asset=CHAIR, name='Chair (default look)', x=52.6, y=25.35, story=1, rot=180, tags=['seat']),
    dict(id='prop_flat_chair_s', asset=CHAIR, name='Chair (painted red look)', x=52.6, y=26.65, story=1, rot=0, look='look_chair_red', tags=['seat']),
    dict(id='prop_flat_chair_w', asset=CHAIR, name='Chair (painted red look)', x=51.95, y=26.0, story=1, rot=90, look='look_chair_red', tags=['seat']),
    dict(id='prop_flat_chair_e', asset=CHAIR, name='Chair (red look + own change)', x=53.25, y=26.0, story=1, rot=270, look='look_chair_red',
         override={'brightness': 0.6, 'saturation': 1.4, 'weathered': {'scratches': 3}}, tags=['seat', 'breakable']),
    dict(id='prop_flat_armchair', asset='lp_furniture_chairs_mesh_chair_single_010', name='Armchair', x=58.0, y=25.2, story=1, rot=180, tags=['seat'],
         points=[P('sit', facing=0)]),
    dict(id='prop_flat_armchair2', asset='lp_furniture_chairs_mesh_chair_single_09', name='Second armchair', x=59.3, y=25.7, story=1, rot=210, tags=['seat'],
         points=[P('sit', facing=0)]),
    dict(id='prop_flat_tvstand', asset='lp_furniture_storage_crates_mesh_storagecrate_06', name='Crate as TV stand', x=58.6, y=27.6, story=1, rot=90),
    dict(id='prop_flat_tv', asset='lp_technology_props_tv_mesh_tv_crt_05', name='TV', x=58.6, y=27.6, z=0.31, story=1, rot=0, tags=['interactable'],
         points=[P('look', forward=1.6, facing=180, name='Watch TV')]),
    dict(id='prop_flat_console', asset='lp_technology_props_games_consoles_mesh_gameconsole_02', x=57.75, y=27.6, story=1, rot=0, tags=['interactable', 'pickup']),
    dict(id='prop_flat_pad', asset='lp_technology_props_games_consoles_mesh_gameconsolecontroller_02', x=58.05, y=26.95, story=1, rot=25, tags=['pickup']),
    dict(id='prop_flat_radio', asset='lp_technology_props_audio_equipment_mesh_radio_04', x=56.9, y=27.65, story=1, rot=0, tags=['interactable']),
    dict(id='prop_flat_bookshelf', asset='lp_furniture_shelves_shelf_04_mesh_shelf_04b', name='Bookshelf', x=59.62, y=23.3, story=1, rot=0, tags=['container', 'search']),
    dict(id='prop_flat_clock', asset='lp_technology_props_misc_tech_props_mesh_alarmclock_01', x=59.6, y=23.0, z=1.8, story=1, rot=270),
    dict(id='prop_flat_bag', asset='lp_misc_props_mesh_binbag_01', x=50.45, y=27.55, story=1, rot=0, solid=False),
]

# named looks (reusable appearances). 'look_chair_cafe' uses a project palette made below.
LOOKS = [
    {'id': 'look_chair_red', 'name': 'Painted red', 'asset': CHAIR, 'palette': 'palv_red_paint', 'notes': 'kitchen chairs in the flat'},
    {'id': 'look_chair_black', 'name': 'Black lacquer', 'asset': CHAIR, 'brightness': 0.45, 'saturation': 0.4, 'contrast': 1.2},
]
# project palettes (copies of the library palette with a few colours changed); looks above point at them
PALETTES = [
    {'id': 'palv_red_paint', 'name': 'Red paint, teal seat', 'asset': CHAIR, 'swap': {'6e4328': 'a3271f'}},
    {'id': 'palv_ash_red', 'name': 'Ash wood, red seat', 'asset': CHAIR, 'swap': {'6e4328': 'd8c8a8', '015870': 'b03030'}},
]
# asset setups: which side is the real front (checked by eye), default use points for new copies
SETUPS = {
    CHAIR: {'defaultPoints': True, 'frontTurn': 180, 'note': 'seat faces -Z (checked by eye)'},
    'lp_furniture_chairs_mesh_chair_single_05': {'frontTurn': 180, 'note': 'seat faces -Z'},
    'lp_technology_props_monitors_mesh_monitor_02': {'frontTurn': 90, 'note': 'screen faces +X (the model\'s left)'},
    'lp_technology_props_tv_mesh_tv_crt_01': {'frontTurn': 90, 'note': 'screen faces +X'},
    'lp_technology_props_tv_mesh_tv_crt_05': {'frontTurn': 90, 'note': 'screen faces +X'},
    'lp_furniture_chairs_mesh_chair_single_010': {'frontTurn': 180, 'note': 'model faces -Z'},
    CAR: {'defaultPoints': True},
    'lp_dumpster_bins_mesh_dumpster_closed': {'frontTurn': 90, 'note': 'lid opens on the model\'s left (+X) long side'},
    'lp_dumpster_bins_mesh_dumpster_open': {'frontTurn': 90},
}
REMOVE_PILLARS = ['pillar_parked_body', 'pillar_parked_cabin', 'pillar_parked_wheel1n', 'pillar_parked_wheel1s', 'pillar_parked_wheel2n', 'pillar_parked_wheel2s',
                  'pillar_dumpster1', 'pillar_dumpster2', 'pillar_dumpster3', 'pillar_pallet1', 'pillar_pallet2', 'pillar_crates', 'pillar_desk', 'pillar_can1', 'pillar_crates2']
VIEWS = [  # name, x, y, story, facing, fov, room
    ('Stockroom', 51.2, 27.4, 0, 70, 85, 'room_stock'),
    ('Shop counter (clerk side)', 59.4, 34.9, 0, 315, 85, 'room_shop'),
    ('Parked cover car', 30.5, 38.6, 0, 110, 75, 'room_mA'),
    ('Alley dumpsters', 33.5, -3.2, 0, 95, 75, 'room_lE'),
    ('Taco truck', 63.6, 57.5, 0, 110, 75, 'room_sS'),
    ('Flat · dining', 55.2, 24.2, 1, 235, 80, FLAT),
    ('Flat · living', 55.3, 24.3, 1, 118, 80, FLAT),
]

PAGE_BUILD = r"""async(spec)=>{
  const C=RCApp.core,X=RCApp.ext().props,A=RCAssets;
  const ids=[...new Set(spec.props.map(s=>s.asset))],ready=await A.waitForModels(ids);
  if(ready.failures.length)throw Error('Demo stopped before editing or saving. Model readiness: '+JSON.stringify(ready)+'. Check the library files, then retry generation.');
  const fromUser=(turn,u)=>{const r=C.rad(turn),c=Math.cos(r),s=Math.sin(r);return {x:+(-u.right*c+u.forward*s).toFixed(3),z:+(u.right*s+u.forward*c).toFixed(3),y:u.up||0,yaw:C.norm(turn-(u.facing||0))};};
  const solidDefault=(e,b)=>{const w=b.max[0]-b.min[0],d=b.max[2]-b.min[2],h=b.max[1]-b.min[1];return e.category==='Vehicles'||(w*d>=.2&&h>=.45);};
  const ok=RCApp.mutate(()=>{
    const p=RCApp.project;p.name=spec.name;
    p.pillars=p.pillars.filter(q=>!spec.remove.includes(q.id));
    const setups={};for(const [k,v] of Object.entries(spec.setups)){const s={...v};delete s.defaultPoints;setups[k]=s;}
    p.objectLibrary={schema:1,looks:spec.looks,palettes:[],setups,demo:{madeBy:'tests/make_asset_demo.py',from:'Route_Prototype_Street.room.json'}};
    p.props=spec.props.map(s=>{const e=A.entry(s.asset),t=A.template(s.asset),b=C.clone(t.bounds),turn=C.propFrontTurn(setups[s.asset]);
      const q={id:s.id,asset:s.asset,x:s.x,y:s.y,story:s.story||0,z:s.z||0,rotation:C.norm(s.rot||0),scale:[1,1,1],enabled:true,locked:false,look:s.look||null,override:s.override||{},
        collision:{solid:s.solid??solidDefault(e,b),shape:'auto'},gameplay:{tags:s.tags||[],props:s.props||{}},
        points:(s.points||[]).map((u,i)=>{const m=fromUser(turn,u),pt={id:s.id.replace('prop_','pt_')+'_'+(i+1),type:u.type,x:m.x,y:m.y,z:m.z,yaw:m.yaw,enabled:true};if(u.name)pt.name=u.name;return pt;}),bounds:b};
      if(s.name)q.name=s.name;return q;});
    // default use points for new copies, taken from a placed example
    for(const [k,v] of Object.entries(spec.setups))if(v.defaultPoints){const ex=p.props.find(q=>q.asset===k&&q.points.length);
      if(k===spec.chair){setups[k].points=[{id:'default_sit',type:'sit',x:0,y:0,z:0,yaw:C.propFrontTurn(setups[k]),enabled:true}];}
      else if(ex)setups[k].points=ex.points.filter(pt=>pt.type!=='cover').map((pt,i)=>({...pt,id:'default_'+pt.type+'_'+i}));}
    // chairs placed from the setup default get the sit point
    for(const q of p.props)if(q.asset===spec.chair&&!q.points.length)q.points=[{id:q.id.replace('prop_','pt_')+'_sit',type:'sit',x:0,y:0,z:0,yaw:C.propFrontTurn(setups[spec.chair]),enabled:true}];
    // extra viewpoints for checking the furnished spaces
    const tpl=p.viewpoints.find(v=>v.id==='view_mvcv5kcl_ft6voqf');
    for(const [name,x,y,story,facing,fov,room] of spec.views){const v=C.clone(tpl);v.id='view_demo_'+name.toLowerCase().replace(/[^a-z]+/g,'_').replace(/^_|_$/g,'');v.name=name;v.x=x;v.y=y;v.story=story;v.facing=facing;v.fov=fov;v.roomId=room;delete v.cover;p.viewpoints.push(v);}
  },'Furnish asset demo');
  if(!ok)throw Error('the furnishing edit was refused: '+document.querySelector('#toast').textContent);
  // palettes made with the editor's own functions
  for(const s of spec.props.filter(s=>s.palette_quick)){const fam=A.entry(s.asset).paletteFamily;const kind=s.palette_quick,label=kind[0].toUpperCase()+kind.slice(1);
    const pid=await X.quickPalette(fam,kind,label);RCApp.mutate(()=>{RCApp.project.props.find(q=>q.id===s.id).override.palette=pid;},'Palette '+label);}
  // unmarked car: repaint body, doors and light bar on this object only (its own palette copy)
  const car=()=>RCApp.project.props.find(q=>q.id==='prop_car_unmarked');
  for(const from of ['#1f1f1f','#f5f5f5','#ab3a1d','#185676'])await X.recolorOnProp(car(),from,'#4a1c24');
  RCApp.mutate(()=>{const ol=RCApp.project.objectLibrary,v=ol.palettes.find(v=>v.owner==='prop_car_unmarked');if(v)v.name='Unmarked car · maroon';},'Name palette');
  // project palettes for looks: a copy of the library palette with some colours swapped (the library file is untouched)
  for(const pl of spec.palettes){const fam=A.entry(pl.asset).paletteFamily,src=await A.dataUrl(A.entry(fam).working_path),im=await new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=src;});
    const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;const g=cv.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,cv.width,cv.height);
    for(let i=0;i<d.data.length;i+=4){const h=[d.data[i],d.data[i+1],d.data[i+2]].map(v=>v.toString(16).padStart(2,'0')).join(''),to=pl.swap[h];if(to){d.data[i]=parseInt(to.slice(0,2),16);d.data[i+1]=parseInt(to.slice(2,4),16);d.data[i+2]=parseInt(to.slice(4,6),16);}}
    g.putImageData(d,0,0);const img=cv.toDataURL('image/png');RCApp.mutate(()=>{RCApp.project.objectLibrary.palettes.push({id:pl.id,name:pl.name,base:fam,image:img});},'Palette '+pl.name);}
  RCApp.mutate(()=>{const ol=RCApp.project.objectLibrary;ol.looks.push({id:'look_chair_cafe',name:'Café (ash + red)',asset:spec.chair,palette:'palv_ash_red'});
    const q=RCApp.project.props.find(q=>q.id==='prop_flat_chair_n');q.name='Chair (café palette look)';q.look='look_chair_cafe';},'Café look');
  return {modelReadiness:ready,props:RCApp.project.props.length,palettes:RCApp.project.objectLibrary.palettes.map(v=>v.name),looks:RCApp.project.objectLibrary.looks.map(l=>l.name)};
}"""

async def texture_on(pg, room, surface, tex):
    """Put a library texture on a room surface through the real UI: Style tab -> Library textures… -> click the texture."""
    await pg.evaluate("r=>RCApp.selectRoom(r)", room); await pg.wait_for_timeout(150)
    await pg.click('[data-panel="style"]'); await pg.wait_for_timeout(150)
    await pg.locator(f'[data-action="lib-import-{surface}-texture"]').first.click(); await pg.wait_for_timeout(200)
    await pg.fill('#libSearch', tex); await pg.wait_for_timeout(250)
    await pg.locator(f'[data-lib-texture="{tex}"]').first.click(); await pg.wait_for_timeout(900)

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        ctx = await b.new_context(viewport={'width': 1600, 'height': 950}, accept_downloads=True)
        pg = await ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script(_INIT); await pg.goto(URL); await pg.wait_for_timeout(500)
        await pg.evaluate("async j=>{await RCApp.applyBundle(JSON.parse(j));RCApp.setMode('iso');}", open(SRC).read())
        r = await pg.evaluate("async lib=>(await RCAssets.connectUrl(lib)).message", LIB_URL); print(r)
        await pg.click('[data-pane="library"]')
        spec = {'name': 'Route Prototype · Harlan Av · ASSET DEMO (0.14)', 'props': PROPS, 'looks': LOOKS, 'palettes': PALETTES, 'setups': SETUPS, 'remove': REMOVE_PILLARS,
                'views': VIEWS, 'chair': CHAIR}
        r = await pg.evaluate(PAGE_BUILD, spec); print(json.dumps(r))
        # textures through the UI (copied into the project, Pixel filter)
        # (the flat's walls are left alone: in this map the street-level walls are 6 m tall and overlap the upstairs walls,
        #  so a different upstairs wallpaper would flicker against them — see the implementation report)
        await texture_on(pg, FLAT, 'floor', 'pix_wood_wood_planks_01_brown_2')
        await texture_on(pg, 'room_office', 'floor', 'pix_patterns_pattern_01_retro_carpet_red_1')
        await pg.evaluate("f=>RCApp.mutate(()=>{for(const r of RCApp.project.rooms)if(r.id===f||r.id==='room_office')r.floor.tileSize=1;},'Texture size')", FLAT)
        # picture override on the painted van: a library texture as its paint
        tx = next(p['texture'] for p in PROPS if p.get('texture'))
        await pg.evaluate("t=>RCApp.mutate(()=>{RCApp.project.props.find(q=>q.id==='prop_van_rusty').override.texture={library:t};},'Van texture')", tx)
        conf = await pg.evaluate("()=>RCApp.ext().props.conflicts().map(c=>c.text)")
        print('route conflicts:', conf)
        async with pg.expect_download() as dl:
            await pg.evaluate("()=>RCApp.saveProject()")
        d = await dl.value; await d.save_as(DST)
        print('saved', DST, os.path.getsize(DST), 'bytes; page errors:', errs)
        await b.close()
        sys.exit(1 if errs else 0)

asyncio.run(main())
