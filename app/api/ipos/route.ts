import { load } from 'cheerio';
import { snapshot,snapshotDate,slug, type IPO } from '../../../lib/ipos';
let cache: {at:number;data:unknown}|null=null;
export async function GET(){
 if(cache && Date.now()-cache.at<300000)return Response.json(cache.data);
 try{
  const source='https://www.ipomarket.in/ipo/upcoming';
  const response=await fetch(source,{signal:AbortSignal.timeout(12000),headers:{'User-Agent':'IPO-Orbit/1.0'}});
  if(!response.ok)throw Error('Source unavailable');
  const $=load(await response.text());const ipos:IPO[]=[];
  $('table').each((index,table)=>{$(table).find('tbody tr').each((_,row)=>{
   const cells=$(row).find('td');const raw=cells.eq(0).text().trim();const link=cells.eq(0).find('a').first();
   const name=link.find('span').last().text().trim()||link.text().trim()||raw;
   if(!name)return;
   const parseDate=(s:string)=>{const match=s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);if(!match)return '';const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(match[2].slice(0,3).toLowerCase());return month<0?'':`${match[3]}-${String(month+1).padStart(2,'0')}-${match[1].padStart(2,'0')}`};
   const open=parseDate(cells.eq(1).text().trim());
   if(index<2&&!open)return;
   const prices=cells.eq(3).text().replace(/,/g,'').match(/\d+(?:\.\d+)?/g);
   const prior=snapshot.find(p=>slug(p.name)===slug(name));
   if(!open && name==='NSE (National Stock Exchange)' && ipos.some(p=>p.id==='national-stock-exchange-of-india'))return;
   const href=link.attr('href');
   ipos.push({id:slug(name),name,board:index===1||index===3?'SME':'Mainboard',open:index<2?open:'',close:index<2?parseDate(cells.eq(2).text().trim()):'',low:index<2&&prices?Number(prices[0]):null,high:index<2&&prices?Number(prices[1]||prices[0]):null,size:index<2?Number(cells.eq(4).text().replace(/[^\d.]/g,''))||null:null,lot:prior?.lot||null,sector:prior?.sector||(index===2?cells.eq(1).text().trim():'Industry'),source:href?new URL(href,source).href:source});
  });});
  if(ipos.length<3)throw Error('Source format changed');
  const data={ipos:[...new Map(ipos.map(p=>[p.id,p])).values()],updatedAt:new Date().toISOString(),mode:'refreshed',message:'Public-source data · confirm final terms in the prospectus'};
  cache={at:Date.now(),data};return Response.json(data);
 }catch{return Response.json({ipos:snapshot,updatedAt:snapshotDate,mode:'snapshot',message:'Saved research snapshot · live source is unavailable. Coverage is not exhaustive.'});}
}
