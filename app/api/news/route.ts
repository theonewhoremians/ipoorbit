import { XMLParser } from 'fast-xml-parser';
const cache=new Map<string,{at:number;data:unknown}>();
export async function GET(request:Request){
 const company=(new URL(request.url).searchParams.get('company')||'India').slice(0,120);
 const hit=cache.get(company);if(hit&&Date.now()-hit.at<300000)return Response.json(hit.data);
 try{
  const query=company==='India'?'India IPO':`"${company}" (IPO OR company)`;
  const res=await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`,{signal:AbortSignal.timeout(12000)});
  if(!res.ok)throw Error('News unavailable');
  const feed=new XMLParser({ignoreAttributes:false}).parse(await res.text());
  const entries=feed.rss?.channel?.item;const items=(Array.isArray(entries)?entries:entries?[entries]:[]).map((item:Record<string,any>)=>({title:String(item.title||''),url:String(item.link||''),publishedAt:item.pubDate||null,publisher:typeof item.source==='string'?item.source:item.source?.['#text']||'Google News'})).filter((n:{url:string})=>n.url.startsWith('https://')).sort((a:{publishedAt:string},b:{publishedAt:string})=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,24);
  const data={items,updatedAt:new Date().toISOString(),error:null};if(cache.size>100)cache.clear();cache.set(company,{at:Date.now(),data});return Response.json(data);
 }catch{return Response.json({items:[],error:'News could not be refreshed. Try again or open the full news search.',updatedAt:null},{status:503});}
}
