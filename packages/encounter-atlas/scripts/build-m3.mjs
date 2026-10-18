import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sealPackage } from '../src/m3/types.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const fixture=await sealPackage(JSON.parse(await fs.readFile(path.join(root,'content/m3/seed.json'),'utf8')));
await fs.writeFile(path.join(root,'content/m3/seed.mjs'),`// Generated from authored M3 JSON by scripts/build-m3.mjs.\nexport const fixture = ${JSON.stringify(fixture,null,2)};\n`);
const visited=new Set(),chunks=[];
async function bundle(file){file=path.resolve(file);const name=path.relative(root,file).replaceAll('\\','/');if(visited.has(name))return name;visited.add(name);let source=await fs.readFile(file,'utf8');
 const imports=[...source.matchAll(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?/g)];for(const match of imports){const dep=await bundle(path.resolve(path.dirname(file),match[2]));source=source.replace(match[0],`const {${match[1]}}=__modules[${JSON.stringify(dep)}];`);}
 const exports=[...source.matchAll(/export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/g)].map(m=>m[1]);for(const match of [...source.matchAll(/export\s+\{([^}]+)\};?/g)]){exports.push(...match[1].split(',').map(s=>s.trim()).filter(Boolean));source=source.replace(match[0],'');}
 source=source.replace(/\bexport\s+(?=(?:async\s+)?(?:function|const|let|class)\b)/g,'');if(/\b(?:import|export)\s+(?:\{|\*|.*from)/.test(source))throw Error('Unsupported ESM syntax in '+name);
 chunks.push(`__modules[${JSON.stringify(name)}]=(()=>{\n${source}\nreturn {${[...new Set(exports)].join(',')}};\n})();`);return name;
}
await bundle(path.join(root,'src/m3/ui.mjs'));const css=await fs.readFile(path.join(root,'src/ui.css'),'utf8');
const extra='.partner-controls{padding:0 22px 20px;display:flex;align-items:end;gap:8px;flex-wrap:wrap}.partner-controls label{width:100%;margin:0}.partner-controls select{flex:1;min-width:130px}.physical-action{margin-top:9px}.closure-notice,.public-warning{background:#fff0d8;border:2px solid #9b5b19;border-radius:5px;padding:12px;color:#613a15}.closure-notice{font-weight:700}.public-warning{margin:12px 0;font-size:13px}.outcome{padding:20px;background:#dcebd8;border:2px solid #53794a;border-radius:7px;margin:12px 0;font-weight:600}.outcome.closed{background:#f3dfd4;border-color:#8f5438}#offer-terms p{margin-bottom:7px}input{width:100%;min-height:42px;border:1px solid #a9b7a4;border-radius:4px;padding:9px;font:inherit}';
let html=await fs.readFile(path.join(root,'src/m3/shell.html'),'utf8');const script=`(()=>{'use strict';const __modules=Object.create(null);\n${chunks.join('\n')}\n})();`;
html=html.replace('/*APP_CSS*/',css+extra).replace('<!--APP_SCRIPT-->',()=>'<script>'+script.replace(/<\/script/gi,'<\\/script')+'</script>');
await fs.mkdir(path.join(root,'dist-m3'),{recursive:true});await fs.writeFile(path.join(root,'dist-m3/index.html'),html);console.log(JSON.stringify({build:'dist-m3/index.html',bytes:Buffer.byteLength(html),modules:visited.size,packageRef:fixture.ref}));
