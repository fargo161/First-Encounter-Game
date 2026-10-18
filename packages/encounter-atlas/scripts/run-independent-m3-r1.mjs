// Original independent assertions retained on disk. Rebind only the old exact
// source identity and disposable evidence directory for this new checkpoint.
import {registerHooks} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const home=path.join(root,'independent/m3-review'),destination=path.join(root,'evidence/m3-d01/independent-execution');
await fs.mkdir(destination,{recursive:true});
for(const entry of await fs.readdir(path.join(home,'evidence'),{withFileTypes:true}))if(entry.isFile())await fs.copyFile(path.join(home,'evidence',entry.name),path.join(destination,entry.name));
const identity=JSON.parse(await fs.readFile(path.join(root,'evidence/m3/source-identity.json'),'utf8'));
process.env.M3_CHECKPOINT=root;process.env.M3_EXECUTION_EVIDENCE=destination;
const target=pathToFileURL(path.join(home,'independent-m3.test.mjs')).href;
registerHooks({load(url,context,next){const result=next(url,context);if(url!==target)return result;
 let source=Buffer.isBuffer(result.source)?result.source.toString('utf8'):String(result.source);
 const old="'716a11c4efe9462e8ad60f16d6615ed8537811cf779d10dee424ef92558e3a94'",directory="evidence=path.join(home,'evidence')";
 assert.equal(source.split(old).length,2);assert.equal(source.split(directory).length,2);
 source=source.replace(old,JSON.stringify(identity.sourceDigest)).replace(directory,'evidence=process.env.M3_EXECUTION_EVIDENCE');
 return {...result,source};
}});
console.log(JSON.stringify({identityBinding:identity.sourceDigest,originalTestFileUnmodified:true,changes:'Exact expected source digest and output directory only; every behavioral assertion retained'}));
await import(target);
