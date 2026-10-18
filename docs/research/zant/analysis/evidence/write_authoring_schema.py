"""Write a proposed authoring-data schema and explicitly non-production example."""
from pathlib import Path
import json

OUT = Path(__file__).resolve().parent
def obj(props, required=(), **kw):
    return {'type':'object','properties':props,'required':list(required),'additionalProperties':False,**kw}
string={'type':'string','minLength':1}
vec={'type':'array','items':{'type':'number'},'minItems':2,'maxItems':2}
ref={'$ref':'#/$defs/ref'}
provenance=obj({'source':string,'sha256':{'type':'string','pattern':'^[a-fA-F0-9]{64}$'},'role':{'enum':['original','construction_reference','derived_diagnostic','authored_candidate']},'authority':{'enum':['source_master','verified_reference','proposed','unknown']}},['source','role','authority'])
anchor=obj({'id':string,'xy':vec,'semanticSide':{'enum':['left','right','center']},'parent':string},['id','xy','semanticSide'])
qa=obj({'status':{'enum':['unreviewed','diagnostic_only','candidate','approved','rejected']},'checks':{'type':'array','items':string},'reviewRef':string},['status','checks'])
schema={
 '$schema':'https://json-schema.org/draft/2020-12/schema',
 '$id':'urn:trapstar:zant:asset-authoring:0.1.0',
 'title':'Proposed ZANT asset-authoring capsule 0.1.0 (research specification)',
 **obj({
  'schemaVersion':{'const':'0.1.0'},'capsuleId':string,'identityId':string,
  'coordinateSystem':obj({'units':{'const':'authoring_pixel'},'xPositive':{'const':'image_right'},'yPositive':{'const':'image_down'},'anatomicalSides':{'const':'subject_relative'},'scalePolicy':{'const':'preserve_identity_calibration'}},['units','xPositive','yPositive','anatomicalSides','scalePolicy']),
  'identity':obj({'sourceMaster':ref,'headPackage':ref,'visualDecisions':{'type':'array','items':string,'maxItems':6}},['sourceMaster','headPackage','visualDecisions']),
  'body':obj({'fitReference':ref,'calibration':ref,'profileId':string,'geometryAuthority':string},['fitReference','calibration','profileId','geometryAuthority']),
  'views':{'type':'array','minItems':4,'maxItems':4,'items':obj({'id':{'enum':['front','three_quarter_left','side_left','back']},'yawDegrees':{'enum':[0,45,90,180]},'frame':{'type':'array','items':{'type':'integer','minimum':1},'minItems':2,'maxItems':2},'root':vec,'anchors':{'type':'array','items':anchor},'headCompatibility':{'type':'array','items':string},'mirrorPolicy':{'enum':['audited_safe','authored_opposite_required','unreviewed']}},['id','yawDegrees','frame','root','anchors','headCompatibility','mirrorPolicy'])},
  'assets':{'type':'array','items':obj({'id':string,'file':ref,'view':string,'family':string,'domain':{'enum':['body','head','hair_back','hair_front','face','garment','hand','footwear','gear','mask']},'fitCompatibility':{'type':'array','items':string},'pose':string,'semanticSide':{'enum':['left','right','center','paired']},'attachAnchor':string,'offset':vec,'layer':string,'occlusionRefs':{'type':'array','items':ref},'paletteChannels':{'type':'array','items':obj({'id':string,'mask':ref,'method':{'enum':['value_preserving_material','authored_texture','unchanged']},'limits':string},['id','mask','method','limits'])},'mirrorPolicy':{'enum':['audited_safe','authored_opposite_required','unreviewed']},'provenance':{'type':'array','minItems':1,'items':provenance},'qa':qa},['id','file','view','family','domain','fitCompatibility','pose','semanticSide','attachAnchor','offset','layer','occlusionRefs','paletteChannels','mirrorPolicy','provenance','qa'])},
  'layerConstraints':{'type':'array','items':obj({'before':string,'after':string,'when':string},['before','after','when'])},
  'facePackages':{'type':'array','items':obj({'id':string,'view':string,'base':ref,'frame':{'type':'array','items':{'type':'integer','minimum':1},'minItems':2,'maxItems':2},'alphaPolicy':{'enum':['authoritative_silhouette_once','extended_head_group']},'silhouette':ref,'compositionProfile':string,'neutralSelection':{'const':'omitted_active_slots_use_neutral_base'},'activeSlots':{'type':'array','uniqueItems':True,'items':{'enum':['LEFT_BROW','RIGHT_BROW','LEFT_EYE','RIGHT_EYE','LOWER_FACE']}},'drawOrder':{'type':'array','uniqueItems':True,'items':string},'maskRefs':{'type':'object','propertyNames':{'enum':['LEFT_BROW','RIGHT_BROW','LEFT_EYE','RIGHT_EYE','LOWER_FACE']},'additionalProperties':ref},'variants':{'type':'array','items':obj({'id':string,'slot':{'enum':['LEFT_BROW','RIGHT_BROW','LEFT_EYE','RIGHT_EYE','LOWER_FACE']},'asset':ref,'maskRef':ref,'gazePairId':{'type':['string','null']},'requiredCompanions':{'type':'array','uniqueItems':True,'items':string},'compatibility':{'type':'array','items':string},'seamRisk':{'enum':['unreviewed','low','requires_review','blocked']},'silhouetteVariant':{'type':['string','null']}},['id','slot','asset','maskRef','gazePairId','requiredCompanions','compatibility','seamRisk','silhouetteVariant'])},'presets':{'type':'array','items':obj({'id':string,'selections':{'type':'object','propertyNames':{'enum':['LEFT_BROW','RIGHT_BROW','LEFT_EYE','RIGHT_EYE','LOWER_FACE']},'additionalProperties':{'type':'string'}},'qa':qa},['id','selections','qa'])}},['id','view','base','frame','alphaPolicy','silhouette','compositionProfile','neutralSelection','activeSlots','drawOrder','maskRefs','variants','presets'])},
  'recipes':{'type':'array','items':obj({'id':string,'view':string,'bodyPose':string,'headView':string,'assetIds':{'type':'array','uniqueItems':True,'items':string},'facePreset':{'type':['string','null']},'paletteSelections':{'type':'object','additionalProperties':string},'qa':qa},['id','view','bodyPose','headView','assetIds','facePreset','paletteSelections','qa'])},
  'provenance':{'type':'array','minItems':1,'items':provenance},'qa':qa
 },['schemaVersion','capsuleId','identityId','coordinateSystem','identity','body','views','assets','layerConstraints','facePackages','recipes','provenance','qa']),
 '$defs':{'ref':obj({'uri':string,'availability':{'enum':['supplied','proposed_uncreated','derived_diagnostic']},'sha256':{'type':'string','pattern':'^[a-fA-F0-9]{64}$'}},['uri','availability'])}
}

def proposed(uri): return {'uri':uri,'availability':'proposed_uncreated'}
example={
 'schemaVersion':'0.1.0','capsuleId':'C001_proof_SPEC_ONLY','identityId':'C001',
 'coordinateSystem':{'units':'authoring_pixel','xPositive':'image_right','yPositive':'image_down','anatomicalSides':'subject_relative','scalePolicy':'preserve_identity_calibration'},
 'identity':{'sourceMaster':{'uri':'Part2!ORIGINAL_USER_SOURCE/characters_trapstar_source.zip!characters trapstar source/C001_source_neutral_rgba.png','availability':'supplied'},'headPackage':proposed('C001/head/package.json'),'visualDecisions':['Preserve original bald head and facial proportions','Blue striped tracksuit over light T-shirt; cream sneakers']},
 'body':{'fitReference':{'uri':'Part3!NEUTRAL_CHARACTER_MODULAR_REBUILD_V03_2/fit_classes/male_short_slim_canonical_rgba.png','availability':'supplied'},'calibration':proposed('C001/body/calibration.json'),'profileId':'C001_measured_profile','geometryAuthority':'original C001 silhouette; supplied gray fit is construction reference only'},
 'views':[{'id':view,'yawDegrees':yaw,'frame':[1024,1536],'root':[512,1472],'anchors':[{'id':'floor_root','xy':[512,1472],'semanticSide':'center'}],'headCompatibility':[view],'mirrorPolicy':'unreviewed'} for view,yaw in [('front',0),('three_quarter_left',45),('side_left',90),('back',180)]],
 'assets':[], 'layerConstraints':[], 'facePackages':[], 'recipes':[],
 'provenance':[{'source':'Owner-approved research handoff, October 18, 2026','role':'authored_candidate','authority':'proposed'}],
 'qa':{'status':'unreviewed','checks':['Schema example only; art, anchors beyond root and recipes do not exist. Not eligible for rendering or production.']}
}
(OUT/'zant_asset_authoring_v0_1.schema.json').write_text(json.dumps(schema,indent=2),encoding='utf-8')
(OUT/'C001_proof_SPEC_ONLY.example.json').write_text(json.dumps(example,indent=2),encoding='utf-8')
import jsonschema
jsonschema.Draft202012Validator.check_schema(schema)
jsonschema.validate(example,schema)
print('Wrote schema and explicitly uncreated example; structural validation passed.')
