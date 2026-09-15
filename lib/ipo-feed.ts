import {load} from 'cheerio';
import type {IPO} from './ipos';
export function parseIPOFeed(html:string,source:string):IPO[]{
 const $=load(html),ipos:IPO[]=[];
 if(!$('h1').text().match(/IPO/i))throw Error('Unexpected source page');
 $('table').each((_,table)=>{
  const headers=$(table).find('thead th').map((_,h)=>$(h).text().trim()).get();
  if(!headers.includes('Company'))return;
  const col=(pattern:RegExp)=>headers.findIndex(h=>pattern.test(h));
  const oi=col(/^Open(?: Date)?$/),ci=col(/^Close(?: Date)?$/),pi=col(/^Price Band/),si=col(/^Issue Size/),li=col(/^Lot Size/);
  if(source.endsWith('/open')&&oi<0)return;
  let section=$(table).parents().filter((_,e)=>$(e).find('h3').length===1).first().find('h3').text();
  $(table).find('tbody tr').each((_,row)=>{
   const cells=$(row).find('td'),cell=cells.eq(0),link=cell.find('a').first();
   const name=link.find('span').last().text().trim()||link.text().trim()||cell.text().trim();if(!name)return;
   const value=(i:number)=>i<0?'':cells.eq(i).text().trim();
   const date=(s:string)=>{const m=s.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);if(!m)return '';const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[2].slice(0,3).toLowerCase());return month<0?'':`${m[3]}-${String(month+1).padStart(2,'0')}-${m[1].padStart(2,'0')}`};
   const number=(s:string)=>Number(s.replace(/[^\d.]/g,''))||null;
   const prices=value(pi).replace(/,/g,'').match(/\d+(?:\.\d+)?/g);
   const canonical=name==='NSE (National Stock Exchange)'?'National Stock Exchange of India':name;
   const href=link.attr('href');let target=source;try{if(href){const u=new URL(href,source);if(u.protocol==='https:'&&u.hostname==='www.ipomarket.in')target=u.href;}}catch{}
   ipos.push({id:canonical.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),name:canonical,board:/SME/i.test(section)?'SME':'Mainboard',open:date(value(oi)),close:date(value(ci)),low:prices?Number(prices[0]):null,high:prices?Number(prices[1]||prices[0]):null,size:number(value(si)),lot:number(value(li)),sector:value(col(/^Sector$/))||'Industry',source:target});
  });
 });
 if(!ipos.length&&!/no (?:\w+ )*IPOs|0 IPOs/i.test($('main').text()))throw Error('Source format changed');
 return ipos;
}
