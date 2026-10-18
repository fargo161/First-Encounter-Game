/* Optional regression against an actual older saved project supplied by the user.
   Usage: node tests/migration_regression.js /path/to/older.room.json
   The older input is deliberately not bundled: v0.4 ships with no image pack. */
'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');
const C=require('../source/core.js'),L=require('../source/legacy-v3.js');
if(!process.argv[2]){console.error('Supply a v0.2/v0.3 .room.json to compare.');process.exit(2);}
const original=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const old=L.validateBundle(original).project;
for(const architectureOnly of [false,true]){
  const next=C.migrateLegacy(original,L,{architectureOnly});
  const poseChanges=old.viewpoints.filter(v=>{
    const n=next.project.viewpoints.find(n=>n.id===v.id);
    return !n||['x','y','facing','fov','eyeHeight'].some(k=>Math.abs(n[k]-v[k])>1e-6);
  });
  assert.equal(poseChanges.length,0,'Every previously placed viewpoint should retain its pose');
  if(architectureOnly){assert.equal(next.assets.length,0);assert.equal(next.project.objects.length,0);}
  const report={source:path.basename(process.argv[2]),mode:architectureOnly?'architecture only':'retain embedded art',passed:true,originalViewpoints:old.viewpoints.length,poseChanges:poseChanges.length,objects:next.project.objects.length,viewpoints:next.project.viewpoints.length,pairs:next.project.pairs.length,assets:next.assets.length,openings:next.project.openings.length,notes:next.project.migrationNotes};
  fs.writeFileSync(path.join(__dirname,'migration_'+(architectureOnly?'architecture':'preserve')+'_report.json'),JSON.stringify(report,null,2));
  console.log(report.mode+': '+report.viewpoints+' unchanged viewpoint poses; '+report.assets+' images.');
}
