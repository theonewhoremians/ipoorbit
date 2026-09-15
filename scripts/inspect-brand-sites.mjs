import {load} from 'cheerio';import fs from 'node:fs/promises';
const sites={
 'national-stock-exchange-of-india':'https://www.nseindia.com',
 'jindal-supreme-india':'https://jindalsupreme.com',
 'ss-retail':'https://www.ssmobile.com',
 'a-one-steels-india':'https://www.aonesteelgroup.com',
 'spectraa-technology-solutions':'https://www.spectraa.com',
 'jio-platforms':'https://www.jio.com',
 'zepto':'https://www.zepto.com',
 'oyo-oravel-stays-prism':'https://www.oyorooms.com',
 'hero-fincorp':'https://www.herofincorp.com',
 'veritas-finance':'https://www.veritasfin.in',
 'milky-mist':'https://www.milkymist.com',
 'boat-imagine-marketing':'https://www.boat-lifestyle.com',
 'vardhman-airport-solutions':'https://vardhmanairports.com',
 'vaibhav-vyapaar':'https://www.vaibhav-vyapaar.com',
 'hgs-india':'https://www.hgsindia.com',
 'tgtmc-supply-chain':'https://www.thego2marketcompany.com',
 'maxwell-engineering-solutions':'https://maxwells.in',
 'ideas-electricals-engineers':'https://www.ideasengineers.com'
};
const results=[];
for(let i=0;i<Object.keys(sites).length;i+=4)await Promise.allSettled(Object.entries(sites).slice(i,i+4).map(async([id,url])=>{try{const res=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!res.ok)throw Error(res.status);const html=await res.text();const $=load(html);await fs.writeFile('work/'+id+'.html',html);const images=$('img').slice(0,30).map((_,img)=>({src:$(img).attr('src')||$(img).attr('data-src'),alt:$(img).attr('alt')})).get().filter(i=>i.src&&!i.src.startsWith('data:')).map(i=>({...i,src:new URL(i.src,res.url).href}));const r={id,url:res.url,title:$('title').text(),images};results.push(r);console.log(JSON.stringify(r));}catch(e){console.log(JSON.stringify({id,error:e.message}));}}));
await fs.writeFile('work/site-logos.json',JSON.stringify(results,null,2));
