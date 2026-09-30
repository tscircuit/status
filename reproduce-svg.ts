import ky from 'ky'
import {readFileSync} from 'node:fs'
const text=readFileSync('status-checks/check-svg-service-health.ts','utf8')
const urls=[...text.matchAll(/`(https:[^`]+)`/g)].map(m=>m[1].replace('${randomParam}',crypto.randomUUID()))
console.log('runtime',process.versions.bun)
for (const base of ['https://svg-tscircuit-2wqxfa3jx-tscircuit.vercel.app','https://svg.tscircuit.com']) {
 console.log('deployment',base)
 for(let attempt=1;attempt<=2;attempt++) {
 await Promise.all(urls.map(async original=>{const url=new URL(original);url.host=new URL(base).host;url.searchParams.set('cachebust',crypto.randomUUID());const t=Date.now();try{const r=await ky.get(url,{timeout:20000,retry:0});const body=await r.text();console.log({attempt,type:url.searchParams.get('svg_type'),ms:Date.now()-t,status:r.status,cache:r.headers.get('cache-control'),region:r.headers.get('x-vercel-id'),svg:body.startsWith('<svg')})}catch(e){console.log('FAIL',Date.now()-t,String(e),e.cause)}}))
 }
}
