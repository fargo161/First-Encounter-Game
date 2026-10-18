import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const home=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(process.env.M3_CHECKPOINT??path.join(home,'checkpoint'));
const M=await import(pathToFileURL(path.join(root,'src/m3/meaning.mjs')));
const source=await fs.readFile(path.join(root,'src/m3/ui.mjs'),'utf8');
const guard=source.slice(source.indexOf('function acknowledgeVisibleNotice(){'),source.indexOf('\nfunction preview(){'));
assert.ok(guard.startsWith('function acknowledgeVisibleNotice(){'));
test('M3-D01 no fully transparent notice may be acknowledged as displayed',async()=>{
 // Uses the production guard verbatim, with DOM geometry/styles freshly observed
 // in the actual browser reproducer. No production source is changed.
 const saved=JSON.parse(await fs.readFile(path.join(home,'evidence/browser-transparent-notice-result.json'),'utf8'));
 const command=structuredClone(saved.run.journal.at(-1).command);command.payload.preview.notice.displayed=false;
 const observed=JSON.parse(await fs.readFile(path.join(home,'evidence/browser-transparent-notice-geometry.json'),'utf8'));
 assert.equal(observed.opacity,'0');
 const el={hidden:false,getBoundingClientRect:()=>observed.rect};
 const check=new Function('pending','$','getComputedStyle','innerHeight','markNoticeDisplayed',guard+'\nacknowledgeVisibleNotice();return pending;');
 const result=check(command,()=>el,()=>({opacity:observed.opacity,display:observed.display,visibility:observed.visibility}),observed.viewportHeight,M.markNoticeDisplayed);
 assert.equal(result.payload.preview.notice.displayed,false,'Fully transparent notice was falsely acknowledged. Actual browser then closed service with no technical defect.');
});
