import {parseIPOFeed,parseIPOOfferDetails,parseIPOIssueTypeFromLabel} from '../../../lib/ipo-feed';
import {snapshot,snapshotDate,issueStatus,type IPO} from '../../../lib/ipos';
import {applyIPOOfferDisclosure} from '../../../lib/ipo-offer-disclosures';
export const dynamic='force-dynamic';
let cache:{at:number;ipos:IPO[]}|null=null;
export async function GET(){
 const active=(items:IPO[])=>items.filter(p=>issueStatus(p)!=='Closed');
 const reply=(ipos:IPO[],updatedAt:string,mode:string,message:string)=>Response.json({ipos:active(ipos).map(applyIPOOfferDisclosure),updatedAt,mode,message},{headers:{'Cache-Control':'no-store'}});
 if(cache&&Date.now()-cache.at<300000)return reply(cache.ipos,new Date(cache.at).toISOString(),'refreshed','Auto-updates every 5 minutes · closed issues are removed');
 const results=await Promise.allSettled(['upcoming','open'].map(async kind=>{const source='https://www.ipomarket.in/ipo/'+kind;const r=await fetch(source,{cache:'no-store',redirect:'manual',signal:AbortSignal.timeout(12000),headers:{'User-Agent':'IPO-Orbit/1.0'}});if(!r.ok)throw Error();return parseIPOFeed(await r.text(),source);}));
 const successful=results.filter((r):r is PromiseFulfilledResult<IPO[]>=>r.status==='fulfilled');
 if(successful.length===2){
  const records=new Map<string,IPO>();for(const p of successful.flatMap(r=>r.value)){const old=records.get(p.id);if(old?.open&&!p.open)continue;records.set(p.id,old?{...old,...p,size:p.size??old.size,sizeLabel:p.sizeLabel||old.sizeLabel,lot:p.lot??old.lot}:p);}
  const items=active([...records.values()]);
  for(const p of items)Object.assign(p,parseIPOIssueTypeFromLabel(p.sizeLabel||'',p.size));
  const detailItems=items.filter(p=>/^https:\/\/www\.ipomarket\.in\/ipo\/[a-z0-9-]+$/.test(p.source)&&!p.source.endsWith('/upcoming'));
  for(let i=0;i<detailItems.length;i+=8)await Promise.allSettled(detailItems.slice(i,i+8).map(async p=>{try{const r=await fetch(p.source,{redirect:'manual',cache:'no-store',signal:AbortSignal.timeout(6000),headers:{'User-Agent':'IPO-Orbit/1.0'}});if(!r.ok)return;const details=parseIPOOfferDetails(await r.text());Object.assign(p,details,{freshIssue:details.freshIssue??p.freshIssue,ofsIssue:details.ofsIssue??p.ofsIssue,issueType:details.issueType??p.issueType});p.size=details.size??p.size;p.sizeLabel=details.sizeLabel||p.sizeLabel;p.retailQuotaSize=details.size!=null&&details.retailQuotaPercent!=null?Number((details.size*details.retailQuotaPercent/100).toFixed(2)):null;}catch{}}));
  cache={at:Date.now(),ipos:items};return reply(cache.ipos,new Date(cache.at).toISOString(),'refreshed','Auto-updates every 5 minutes · closed issues are removed');
 }
 // ponytail: warm-instance fallback only; use persistent storage if a durable feed history is required.
 const fallback=cache?.ipos??snapshot;
 const records=new Map(fallback.map(p=>[p.id,p]));for(const p of successful.flatMap(r=>r.value))records.set(p.id,p);
 return reply([...records.values()],cache?new Date(cache.at).toISOString():snapshotDate,'snapshot','Live feed partially unavailable · showing dated fallback data; retrying automatically');
}
