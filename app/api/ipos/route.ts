import {parseIPOFeed} from '../../../lib/ipo-feed';
import {snapshot,snapshotDate,issueStatus,type IPO} from '../../../lib/ipos';
export const dynamic='force-dynamic';
let cache:{at:number;ipos:IPO[]}|null=null;
export async function GET(){
 const active=(items:IPO[])=>items.filter(p=>issueStatus(p)!=='Closed');
 const reply=(ipos:IPO[],updatedAt:string,mode:string,message:string)=>Response.json({ipos:active(ipos),updatedAt,mode,message},{headers:{'Cache-Control':'no-store'}});
 if(cache&&Date.now()-cache.at<300000)return reply(cache.ipos,new Date(cache.at).toISOString(),'refreshed','Auto-updates every 5 minutes · closed issues are removed');
 const results=await Promise.allSettled(['upcoming','open'].map(async kind=>{const source='https://www.ipomarket.in/ipo/'+kind;const r=await fetch(source,{cache:'no-store',redirect:'manual',signal:AbortSignal.timeout(12000),headers:{'User-Agent':'IPO-Orbit/1.0'}});if(!r.ok)throw Error();return parseIPOFeed(await r.text(),source);}));
 const successful=results.filter((r):r is PromiseFulfilledResult<IPO[]>=>r.status==='fulfilled');
 if(successful.length===2){
  const records=new Map<string,IPO>();for(const p of successful.flatMap(r=>r.value)){const old=records.get(p.id);if(old?.open&&!p.open)continue;records.set(p.id,old?{...old,...p,size:p.size??old.size,lot:p.lot??old.lot}:p);}
  cache={at:Date.now(),ipos:[...records.values()]};return reply(cache.ipos,new Date(cache.at).toISOString(),'refreshed','Auto-updates every 5 minutes · closed issues are removed');
 }
 // ponytail: warm-instance fallback only; use persistent storage if a durable feed history is required.
 const fallback=cache?.ipos??snapshot;
 const records=new Map(fallback.map(p=>[p.id,p]));for(const p of successful.flatMap(r=>r.value))records.set(p.id,p);
 return reply([...records.values()],cache?new Date(cache.at).toISOString():snapshotDate,'snapshot','Live feed partially unavailable · showing dated fallback data; retrying automatically');
}
