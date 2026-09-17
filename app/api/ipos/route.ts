import {load} from 'cheerio';
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
  const records=new Map<string,IPO>();for(const p of successful.flatMap(r=>r.value)){const old=records.get(p.id);if(old?.open&&!p.open)continue;records.set(p.id,old?{...old,...p,size:p.size??old.size,sizeLabel:p.sizeLabel||old.sizeLabel,lot:p.lot??old.lot}:p);}
  const items=active([...records.values()]);
  const missing=items.filter(p=>p.size==null&&/^https:\/\/www\.ipomarket\.in\/ipo\/[a-z0-9-]+$/.test(p.source)&&!p.source.endsWith('/upcoming'));
  for(let i=0;i<missing.length;i+=6)await Promise.allSettled(missing.slice(i,i+6).map(async p=>{try{const r=await fetch(p.source,{redirect:'manual',cache:'no-store',signal:AbortSignal.timeout(5000)});if(!r.ok)return;const $=load(await r.text());$('tr').each((_,row)=>{const cells=$(row).find('td,th');if(cells.length===2&&/^(Total )?Issue Size$/i.test(cells.eq(0).text().trim())){const raw=cells.eq(1).text().trim(),m=raw.replace(/,/g,'').match(/(?:₹|Rs\.?\s*)([\d.]+)\s*(?:Cr|crore)/i);if(m){p.size=Number(m[1]);p.sizeLabel=raw;}}});}catch{}}));
  cache={at:Date.now(),ipos:items};return reply(cache.ipos,new Date(cache.at).toISOString(),'refreshed','Auto-updates every 5 minutes · closed issues are removed');
 }
 // ponytail: warm-instance fallback only; use persistent storage if a durable feed history is required.
 const fallback=cache?.ipos??snapshot;
 const records=new Map(fallback.map(p=>[p.id,p]));for(const p of successful.flatMap(r=>r.value))records.set(p.id,p);
 return reply([...records.values()],cache?new Date(cache.at).toISOString():snapshotDate,'snapshot','Live feed partially unavailable · showing dated fallback data; retrying automatically');
}
