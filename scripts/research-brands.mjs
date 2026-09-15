import {load} from 'cheerio';
import fs from 'node:fs/promises';
await fs.mkdir('work',{recursive:true});
const get=async(url)=>{const r=await fetch(url,{signal:AbortSignal.timeout(18000)});if(!r.ok)throw Error(r.status);return {html:await r.text(),url:r.url}};
const feed=await fetch('http://localhost:5173/api/ipos').then(r=>r.json());
const list=load((await get('https://www.ipomarket.in/ipo/upcoming')).html);
list('table').each((index,table)=>list(table).find('tbody tr').each((_,row)=>{const cell=list(row).find('td').first();const link=cell.find('a').first();const name=link.find('span').last().text().trim()||link.text().trim()||cell.text().trim();const href=link.attr('href');if(!name)return;const found=feed.ipos.find(p=>p.name===name);if(found&&href)found.source=new URL(href,'https://www.ipomarket.in').href;else if(!found)feed.ipos.push({id:name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),name,board:index%2?'SME':'Mainboard',source:href?new URL(href,'https://www.ipomarket.in').href:'https://www.ipomarket.in/ipo/upcoming'});}));
const records=[];
for(let offset=0;offset<feed.ipos.length;offset+=4){await Promise.allSettled(feed.ipos.slice(offset,offset+4).map(async ipo=>{
 const record={...ipo};records.push(record);
 try{if(ipo.source.endsWith('/upcoming'))return;const page=await get(ipo.source);const $=load(page.html);const about=$('h2').filter((_,h)=>$(h).text().startsWith('About ')).parent();
 const official=about.find('a[href^="http"]').map((_,a)=>$(a).attr('href')).get().find(u=>!u.includes('ipomarket')&&!u.includes('nseindia')&&!u.includes('bseindia'));
 record.official=official;
 const detail=await fetch('http://localhost:5173/api/company?source='+encodeURIComponent(ipo.source)).then(r=>r.json());record.detail=detail;
 if(official){const home=await get(official);const dom=load(home.html);record.logoCandidates=dom('img').map((_,img)=>({src:dom(img).attr('src')||dom(img).attr('data-src'),alt:dom(img).attr('alt')})).get().filter(i=>i.src&&/logo/i.test(i.src+' '+i.alt)).slice(0,6).map(i=>({...i,src:new URL(i.src,home.url).href}));}
 }catch(e){record.error=String(e.message)}
 console.log(JSON.stringify({name:ipo.name,official:record.official,logos:record.logoCandidates,error:record.error}));
 }));}
await fs.writeFile('work/brand-research.json',JSON.stringify(records,null,2));
