import {load} from 'cheerio';
export async function GET(request:Request){
 const source=new URL(request.url).searchParams.get('source')||'';
 let url:URL;try{url=new URL(source);}catch{return Response.json({error:'Invalid source'},{status:400})}
 if(url.hostname!=='www.ipomarket.in'||url.protocol!=='https:'||url.pathname==='/ipo/upcoming')return Response.json({facts:[],documents:[],description:null});
 try{const response=await fetch(url.href,{redirect:'manual',signal:AbortSignal.timeout(20000),headers:{'User-Agent':'IPO-Orbit/1.0'}});if(!response.ok)throw Error();const $=load(await response.text());
 const facts:{label:string;value:string}[]=[];$('table tr').each((_,row)=>{const cells=$(row).find('td,th');if(cells.length===2){const label=cells.eq(0).text().trim(),value=cells.eq(1).text().trim();if(label&&value&&label.length<90&&value.length<300&&!/^\d+$/.test(label)&&label!=='Lots')facts.push({label,value});}});
 const financials:{headers:string[];rows:string[][]}[]=[];$('table').each((_,table)=>{const first=$(table).find('tr').first();const headers=first.find('th,td').map((_,e)=>$(e).text().trim()).get();if(headers.some(h=>/Revenue|Fiscal Year|Line Item|EPS|NAV/.test(h))&&headers.length>2){const rows=$(table).find('tr').slice(1).map((_,r)=>[$(r).find('td').map((_,c)=>$(c).text().trim()).get()]).get();financials.push({headers,rows});}});
 const about=$('h2').filter((_,h)=>$(h).text().startsWith('About ')).parent().find('p').last().text().trim().slice(0,500);
 const dates:Record<string,string>={};$('h2').filter((_,h)=>$(h).text()==='IPO Timeline').parent().find('p').each((_,p)=>{const label=$(p).text().trim();if(['Allotment','Listing','Refund','Share Credit','UPI Deadline'].includes(label)){const value=$(p).next('p').text().split(' · ')[0];if(value)dates[label]=value;}});
 const risks=$('h3').filter((_,h)=>$(h).text().includes('Risk Factors')).parent().find('li').map((_,li)=>$(li).text().replace(/^•/,'').trim()).get();
 const documents:{title:string;url:string}[]=[];$('a[href]').each((_,a)=>{const title=$(a).text().trim();const href=$(a).attr('href')||'';if(title.length<100&&/RHP|prospectus|annual report/i.test(title)){const target=new URL(href,url);if(target.protocol==='https:'&&!documents.some(d=>d.url===target.href))documents.push({title,url:target.href});}});
 return Response.json({facts:facts.slice(0,50),financials,about,dates,risks,documents:documents.slice(0,10),updatedAt:new Date().toISOString()});
 }catch{return Response.json({facts:[],documents:[],error:'Additional company information is unavailable. Open the source for the latest disclosures.'},{status:503});}
}


