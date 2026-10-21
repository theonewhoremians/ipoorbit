import {load} from 'cheerio';
import type {IPO} from './ipos';
export function parseIPOFeed(html:string,source:string):IPO[]{
 const $=load(html),ipos:IPO[]=[];
 if(!$('h1').text().match(/IPO/i))throw Error('Unexpected source page');
 $('table').each((_,table)=>{
  const headers=$(table).find('thead th').map((_,h)=>$(h).text().trim()).get();
  if(!headers.includes('Company'))return;
  const col=(pattern:RegExp)=>headers.findIndex(h=>pattern.test(h));
  const oi=col(/^Open(?: Date)?$/),ci=col(/^Close(?: Date)?$/),pi=col(/^Price Band/),si=col(/^Issue Size/),li=col(/^Lot Size/),gi=col(/GMP/);
  if(source.endsWith('/open')&&oi<0)return;
  let section=$(table).parents().filter((_,e)=>$(e).find('h3').length===1).first().find('h3').text();
  $(table).find('tbody tr').each((_,row)=>{
   const cells=$(row).find('td'),cell=cells.eq(0),link=cell.find('a').first();
   const label=link.children('span').last();const name=link.find('[role=img][title]').attr('title')||(label.children('span').first().text()||label.text()).trim()||link.text().trim()||cell.text().trim();if(!name)return;
   const value=(i:number)=>i<0?'':cells.eq(i).text().trim();
   const date=(s:string)=>{const m=s.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);if(!m)return '';const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[2].slice(0,3).toLowerCase());return month<0?'':`${m[3]}-${String(month+1).padStart(2,'0')}-${m[1].padStart(2,'0')}`};
   const number=(s:string)=>{const match=s.replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return match?Number(match[0]):null};
   const prices=value(pi).replace(/,/g,'').match(/\d+(?:\.\d+)?/g);
   const canonical=name==='NSE (National Stock Exchange)'?'National Stock Exchange of India':name;
   const href=link.attr('href');let target=source;try{if(href){const u=new URL(href,source);if(u.protocol==='https:'&&u.hostname==='www.ipomarket.in')target=u.href;}}catch{}
   ipos.push({id:canonical.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),name:canonical,board:/SME/i.test(section)?'SME':'Mainboard',open:date(value(oi)),close:date(value(ci)),low:prices?Number(prices[0]):null,high:prices?Number(prices[1]||prices[0]):null,size:number(value(si)),sizeLabel:value(si)||undefined,gmp:number(value(gi)),lot:number(value(li)),sector:value(col(/^Sector$/))||'Industry',source:target});
  });
 });
 if(!ipos.length&&!/no (?:\w+ )*IPOs|0 IPOs/i.test($('main').text()))throw Error('Source format changed');
 return ipos;
}

export function parseIPOOfferDetails(html:string):Partial<IPO>{
 const $=load(html);
 const amount=(raw:string):number|null=>{
  if(/^\s*(?:nil|none|no\s+(?:fresh\s+)?issue|0+(?:\.0+)?(?:\s*(?:Cr|crores?))?)\s*$/i.test(raw))return 0;
  const match=raw.replace(/,/g,'').match(/(?:₹|Rs\.?\s*)?(\d+(?:\.\d+)?)\s*(?:Cr|crores?)/i);
  return match?Number(match[1]):null;
 };
 let size:number|null=null,freshIssue:number|null=null,ofsIssue:number|null=null;
 let sizeLabel:string|undefined;
 $('tr').each((_,row)=>{
  const cells=$(row).find('td,th');if(cells.length!==2)return;
  const key=cells.eq(0).text().replace(/\([^)]*\)/g,' ').replace(/\s+/g,' ').trim(),value=cells.eq(1).text().trim(),parsed=amount(value);
  if(/^(?:Total )?Issue Size(?: in .*)?$/i.test(key)&&parsed!=null){size=parsed;sizeLabel=value;}
  else if(/^Fresh Issue(?: Size)?(?: in .*)?$/i.test(key))freshIssue=parsed;
  else if(/^(?:OFS|Offer for Sale)(?: Size)?(?: in .*)?$/i.test(key))ofsIssue=parsed;
 });
 const fullText=$('body').text().replace(/\s+/g,' ').trim();
 const quotaStart=fullText.search(/Investor Quota/i);
 const quotaEnd=quotaStart<0?-1:fullText.slice(quotaStart+14).search(/Application Lot Sizes/i);
 const quotaText=quotaStart<0?'':fullText.slice(quotaStart,quotaEnd<0?quotaStart+1200:quotaStart+14+quotaEnd);
 const quotaMatch=quotaText.match(/\bRetail(?:\s+(?:Individual\s+)?(?:Investors?|Bidders?))?\b[^\d%]{0,24}(\d{1,3}(?:\.\d+)?)\s*%/i);
 const retailQuotaPercent=quotaMatch?Number(quotaMatch[1]):null;
 let retailSubscriptionFromRow:number|null=null;
 $('tr').each((_,row)=>{
  const cells=$(row).find('td,th');if(cells.length<2)return;
  const category=cells.eq(0).text().replace(/\s+/g,' ').trim();
  if(!/^Retail(?:\s+(?:Individual\s+)?(?:Investors?|Bidders?))?(?:\s*\([^)]*\))?$/i.test(category))return;
  const match=cells.eq(1).text().trim().match(/(\d+(?:\.\d+)?)\s*x\b/i);
  if(match)retailSubscriptionFromRow=Number(match[1]);
 });
 const subStart=fullText.search(/Subscription Status/i);
 const subTail=subStart<0?'':fullText.slice(subStart+18);
 const subEnd=subTail.search(/Allotment Statistics|Subscription Details/i);
 const subText=subStart<0?'':subTail.slice(0,subEnd<0?2200:subEnd);
 const subscriptionMatch=subText.match(/\bRetail(?:\s+(?:Individual\s+)?(?:Investors?|Bidders?))?\b[^\d.]{0,80}(\d+(?:\.\d+)?)\s*x\b/i);
 const retailSubscription=retailSubscriptionFromRow??(subscriptionMatch?Number(subscriptionMatch[1]):null);
 let issueType:string|null=null;
 if(freshIssue!=null&&ofsIssue!=null){
  if(freshIssue>0&&ofsIssue>0)issueType='Hybrid';
  else if(freshIssue>0&&ofsIssue===0)issueType='Fresh issue';
  else if(freshIssue===0&&ofsIssue>0)issueType='OFS';
 }
 return {size,sizeLabel,freshIssue,ofsIssue,issueType,retailQuotaPercent,retailSubscription};
}

export function parseIPOIssueTypeFromLabel(label:string,totalSize:number|null):Partial<IPO>{
 const fresh=label.match(/(?:₹|Rs\.?\s*)([\d,]+(?:\.\d+)?)\s*Cr\s*fresh(?:\s+issue)?/i);
 const ofs=label.match(/(?:₹|Rs\.?\s*)([\d,]+(?:\.\d+)?)\s*Cr\s*(?:OFS|offer\s+for\s+sale)/i);
 const freshIssue=fresh?Number(fresh[1].replace(/,/g,'')):null;
 const ofsIssue=ofs?Number(ofs[1].replace(/,/g,'')):null;
 if(freshIssue!=null&&ofsIssue!=null)return {freshIssue,ofsIssue,issueType:'Hybrid'};
 if(freshIssue!=null)return {freshIssue,issueType:'Fresh issue'};
 if(ofsIssue!=null&&/\b(?:OFS|offer\s+for\s+sale)\s+issue\b/i.test(label))return {ofsIssue,issueType:'OFS'};
 if(/\bfresh\s+issue\b/i.test(label)&&!/\bOFS\b/i.test(label))return {freshIssue:totalSize,issueType:'Fresh issue'};
 return {};
}
