import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),modules=new Map(),chunks=[];
const sha=b=>createHash('sha256').update(b).digest('hex');
async function bundle(file){
 file=path.resolve(file);const name=path.relative(root,file).replaceAll('\\','/');if(modules.has(name))return name;
 const bytes=await fs.readFile(file);modules.set(name,sha(bytes));
 if(file.endsWith('.json')){chunks.push(`__modules[${JSON.stringify(name)}]={default:${JSON.stringify(JSON.parse(bytes.toString('utf8')))}};`);return name;}
 let text=bytes.toString('utf8');
 const imports=[...text.matchAll(/import\s+(\{[^}]+\}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"](?:\s+with\s*\{[^}]+\})?\s*;/g)];
 for(const m of imports){const dep=await bundle(path.resolve(path.dirname(file),m[2])),binding=m[1].startsWith('*')?m[1].replace(/\*\s+as\s+/,''):m[1].startsWith('{')?m[1].replace(/\b(\w+)\s+as\s+(\w+)/g,'$1:$2'):'{default:'+m[1]+'}';text=text.replace(m[0],`const ${binding}=__modules[${JSON.stringify(dep)}];`);}
 const exports=[...text.matchAll(/export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/g)].map(m=>m[1]);
 for(const m of [...text.matchAll(/export\s+\{([^}]+)\}\s*;/g)]){exports.push(...m[1].split(',').map(s=>s.trim()).filter(Boolean));text=text.replace(m[0],'');}
 text=text.replace(/\bexport\s+(?=(?:async\s+)?(?:function|const|let|class)\b)/g,'');
 if(/^\s*(?:import|export)\s/m.test(text))throw Error('Unsupported module syntax: '+name);
 chunks.push(`__modules[${JSON.stringify(name)}]=(()=>{\n${text}\nreturn {${[...new Set(exports)].join(',')}};\n})();`);return name;
}
await bundle(path.join(root,'src/atlas-a1/ui.mjs'));
const css=await fs.readFile(path.join(root,'src/atlas-a1/style.css'),'utf8'),shell=await fs.readFile(path.join(root,'src/atlas-a1/shell.html'),'utf8');
const script=`(()=>{'use strict';const __modules=Object.create(null);\n${chunks.join('\n')}\n})();`;
const html=shell.replace('/*ATLAS_CSS*/',()=>css).replace('<!--ATLAS_SCRIPT-->',()=>'<script>'+script.replace(/<\/script/gi,'<\\/script')+'</script>');
new Function(script);await fs.mkdir(path.join(root,'dist-atlas-a1'),{recursive:true});await fs.writeFile(path.join(root,'dist-atlas-a1/index.html'),html);
const record={build:'dist-atlas-a1/index.html',bytes:Buffer.byteLength(html),sha256:sha(html),modules:[...modules].map(([path,sha256])=>({path,sha256})),dependency:'AR0-projection-v1-R1-D01',networkDependencies:0};
await fs.writeFile(path.join(root,'evidence/atlas-a1/build.json'),JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify({...record,modules:record.modules.length}));
