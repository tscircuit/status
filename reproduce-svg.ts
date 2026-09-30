import ky from 'ky'
import {readFileSync} from 'node:fs'
const text=readFileSync('status-checks/check-svg-service-health.ts','utf8')
const urls=[...text.matchAll(/`(https:[^`]+)`/g)].map(m=>m[1].replace('${randomParam}',crypto.randomUUID()))
console.log('runtime',process.versions.bun)
await Promise.all(urls.map(async url=>{const t=Date.now();try{const r=await ky.get(url,{timeout:20000,retry:0});console.log('PASS',new URL(url).searchParams.get('svg_type'),Date.now()-t,r.status,Object.fromEntries(r.headers));console.log((await r.text()).slice(0,90))}catch(e){console.log('FAIL',Date.now()-t,String(e),e.cause)}}))
