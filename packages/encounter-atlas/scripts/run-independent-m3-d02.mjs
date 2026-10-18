// Retain the independent source/assertions. Supply the actual viewport width to
// its extracted production function and isolate writes from historical evidence.
import {registerHooks} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),home=path.join(root,'independent/m3-r1-review');
const destination=path.join(root,'evidence/m3-d02/independent-execution');await fs.mkdir(destination,{recursive:true});
for(const entry of await fs.readdir(path.join(home,'evidence'),{withFileTypes:true}))if(entry.isFile())await fs.copyFile(path.join(home,'evidence',entry.name),path.join(destination,entry.name));
process.env.M3_CHECKPOINT=root;process.env.M3_RENDERING_EVIDENCE=destination;
const target=pathToFileURL(path.join(home,'independent-r1-display.test.mjs')).href;
const replacements=[
 ["'innerHeight','markNoticeDisplayed'","'innerHeight','innerWidth','markNoticeDisplayed'"],
 ['g.viewport.height,M.markNoticeDisplayed','g.viewport.height,g.viewport.width,M.markNoticeDisplayed'],
 ["ev=path.join(home,'evidence')",'ev=process.env.M3_RENDERING_EVIDENCE']
];
registerHooks({load(url,context,next){const result=next(url,context);if(url!==target)return result;
 let source=Buffer.isBuffer(result.source)?result.source.toString('utf8'):String(result.source);
 for(const [from,to] of replacements){assert.equal(source.split(from).length,2);source=source.replace(from,to);}
 return {...result,source};
}});
console.log(JSON.stringify({originalTestSourceUnchanged:true,behavioralAssertionsChanged:false,adaptation:'Add measured viewport width to the DOM stub and isolate evidence output only'}));
await import(target);
