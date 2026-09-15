import {load} from 'cheerio';
import brands from '../../../lib/company-brands.json';
export async function GET(request:Request){
 const params=new URL(request.url).searchParams,id=params.get('id')||'',source=params.get('source')||'';
 const known=(brands as Record<string,{source:string;logo:string}>)[id];
 const images:string[]=[];
 if(known)images.push(known.source,known.logo);
 try{
  const url=new URL(source);
  if(url.protocol==='https:'&&url.hostname==='www.ipomarket.in'&&!url.port&&!url.username&&!url.password&&/^\/ipo\/[a-z0-9-]+$/.test(url.pathname)&&!['/ipo/upcoming','/ipo/open'].includes(url.pathname)){
   const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(10000),cache:'no-store'});
   if(r.ok){const $=load(await r.text());
    const about=$('h2').filter((_,h)=>$(h).text().startsWith('About ')).parent();
    const website=about.find('a[href]').map((_,a)=>$(a).attr('href')||'').get().find(s=>{try{const u=new URL(s);return u.protocol==='https:'&&!/ipomarket|nseindia|bseindia|sebi\.gov/.test(u.hostname)}catch{return false}});
    const logo=$('h1').parent().find('img').first().attr('src');
    if(logo){const u=new URL(logo,url);if(u.protocol==='https:')images.unshift(u.href);}
    if(website)images.push('https://www.google.com/s2/favicons?domain='+encodeURIComponent(new URL(website).hostname)+'&sz=128');
   }
  }
 }catch{}
 return Response.json({images:[...new Set(images)]},{headers:{'Cache-Control':images.length?'public, max-age=3600, s-maxage=86400':'public, max-age=60, s-maxage=60'}});
}
