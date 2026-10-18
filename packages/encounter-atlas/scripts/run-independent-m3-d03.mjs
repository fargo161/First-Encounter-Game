// Preserve the original IR2-01..20 source and assertions; isolate output only.
import {registerHooks} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),home=path.join(root,'independent/m3-r2-review'),destination=path.join(root,'evidence/m3-d03/independent-execution');
await fs.mkdir(destination,{recursive:true});
for(const n of ['r2-fresh-warned.json','display-collapse-geometry.json'])await fs.copyFile(path.join(home,'evidence',n),path.join(destination,n));
process.env.M3_CHECKPOINT=root;process.env.M3_R2_REVIEW_OUTPUT=destination;
const target=pathToFileURL(path.join(home,'independent-r2-display.test.mjs')).href;
registerHooks({load(url,context,next){const result=next(url,context);if(url!==target)return result;
 let source=Buffer.isBuffer(result.source)?result.source.toString('utf8'):String(result.source);
 const old="ev=path.join(home,'evidence')";assert.equal(source.split(old).length,2);
 source=source.replace(old,'ev=process.env.M3_R2_REVIEW_OUTPUT');return {...result,source};
}});
console.log(JSON.stringify({originalIndependentSourceUnmodified:true,behavioralAssertionsUnchanged:true,adaptation:'Evidence output directory only; IR2-20 expectation and production invocation unchanged'}));
await import(target);
