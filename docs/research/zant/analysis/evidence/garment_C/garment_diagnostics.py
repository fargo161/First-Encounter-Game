"""Nonproduction source-inspection contact sheets; original assets are read only."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json

ROOT = Path(__file__).resolve().parents[4]
MOD = ROOT / 'work/ZANT_analysis_sources/modular/NEUTRAL_CHARACTER_MODULAR_REBUILD_V03_2'
WARD = ROOT / 'work/ZANT_analysis_sources/wardrobe'
OUT = Path(__file__).resolve().parent
IDS = ['C001','C003','C018','C020','C028','C033','C034','C042']
FAMILIES = [
 ('source', MOD/'source_masters', '_source_neutral_rgba.png'),
 ('wardrobe', WARD, '_clothing_inventory_rgba.png'),
 ('kit', MOD/'kit_plates', '_modular_kit_plate_rgba.png'),
 ('rebuild', MOD/'rebuilt_composites', '_neutral_composite_rgba.png'),
 ('gear', MOD/'gear_accessory_catalogs', '_gear_accessories_inventory_rgba.png'),
]
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16)
measurements=[]
for ids, name in [(IDS[:4],'representative_A'),(IDS[4:],'representative_B')]:
    sheet=Image.new('RGB',(1800,2080),'#393a3d'); d=ImageDraw.Draw(sheet)
    for r,cid in enumerate(ids):
        for c,(label,folder,suffix) in enumerate(FAMILIES):
            p=folder/(cid+suffix)
            if not p.exists():
                candidates=list(folder.glob(cid+'*'))
                if candidates:p=candidates[0]
                else:
                    d.text((c*360+8,r*520+8),cid+' '+label+' MISSING',fill='white',font=font); continue
            im=Image.open(p).convert('RGBA')
            box=im.getchannel('A').getbbox()
            measurements.append({'id':cid,'family':label,'file':str(p.relative_to(ROOT)),'size':im.size,'alpha_bbox':box})
            # Whole-source sheets are retained; only display resized copies.
            im.thumbnail((348,475),Image.Resampling.LANCZOS)
            x=c*360+(360-im.width)//2;y=r*520+35
            sheet.paste(im,(x,y),im)
            d.text((c*360+8,r*520+8),cid+' '+label,fill='white',font=font)
    sheet.save(OUT/(name+'.jpg'),quality=92)

# Larger individual source/wardrobe/kit details enable inspection of texture,
# stripes, hollow interfaces and source-isolation quality.
for cid in IDS:
    sheet=Image.new('RGB',(1800,1000),'#434347'); d=ImageDraw.Draw(sheet)
    for c,(label,folder,suffix) in enumerate(FAMILIES[:3]):
        p=folder/(cid+suffix); im=Image.open(p).convert('RGBA')
        im.thumbnail((590,940),Image.Resampling.LANCZOS)
        sheet.paste(im,(c*600+(600-im.width)//2,40),im)
        d.text((c*600+8,8),cid+' '+label,fill='white',font=font)
    sheet.save(OUT/(cid+'_source_wardrobe_kit.jpg'),quality=94)
(OUT/'representative_measurements.json').write_text(json.dumps(measurements,indent=2),encoding='utf-8')
print(json.dumps({'out':str(OUT),'images':10,'measurements':len(measurements)}))

repair=json.loads((MOD/'metadata/gear_accessory_catalog_repair_v03_2.json').read_text(encoding='utf-8'))
gear_meta=json.loads((MOD/'metadata/gear_accessory_catalog_v03.json').read_text(encoding='utf-8'))
remaining=[f'C{i:03d}' for i in range(1,45) if f'C{i:03d}' not in repair['characters']]
sheet=Image.new('RGB',(1800,1320),'#393a3d'); d=ImageDraw.Draw(sheet)
remaining_stats=[]
for n,cid in enumerate(remaining):
    p=MOD/'gear_accessory_catalogs'/(cid+'_gear_accessory_inventory_rgba.png')
    im=Image.open(p).convert('RGBA'); a=im.getchannel('A')
    remaining_stats.append({'id':cid,'file':str(p.relative_to(ROOT)),'declared_items':gear_meta[cid],
      'alpha_bbox':a.getbbox(),'alpha_nonzero_pixels':sum(x>0 for x in a.getdata())})
    im.thumbnail((352,265),Image.Resampling.LANCZOS)
    c=n%5;r=n//5
    sheet.paste(im,(c*360+(360-im.width)//2,r*330+45),im)
    d.text((c*360+7,r*330+8),f'{cid} declared {len(gear_meta[cid])}',fill='white',font=font)
sheet.save(OUT/'gear_remaining19.jpg',quality=94)
(OUT/'gear_remaining19_measurements.json').write_text(json.dumps(remaining_stats,indent=2),encoding='utf-8')
print(json.dumps({'remaining19':remaining,'nonempty':sum(x['alpha_bbox'] is not None for x in remaining_stats)}))
