// Path-only adapter for the unchanged inherited AR0 R1 assertions in a
// disposable Stage12 package. No behavioral expectation/source file edited.
import {registerHooks} from 'node:module';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root=path.resolve(process.env.EA_C1_LEGACY_ROOT);
const home=path.join(root,'independent/atlas-a1-inherited-review');
const target=pathToFileURL(path.join(home,'independent-r1.test.mjs')).href;
const prefix=pathToFileURL(path.join(home,'checkpoint')).href+'/';
registerHooks({resolve(specifier,context,next){
 let url;try{url=new URL(specifier,context.parentURL).href;}catch{}
 if(url?.startsWith(prefix))return next(pathToFileURL(root).href+'/'+url.slice(prefix.length),context);
 return next(specifier,context);
},load(url,context,next){
 const result=next(url,context);if(url!==target)return result;
 let text=Buffer.isBuffer(result.source)?result.source.toString('utf8'):String(result.source);
 const old="root=path.join(home,'checkpoint')";assert.equal(text.split(old).length,2);
 return {...result,source:text.replace(old,'root='+JSON.stringify(root))};
}});
console.log('Path rebinding only; original test source and all assertions retained.');
await import(target);
