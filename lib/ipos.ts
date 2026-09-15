export type IPO = { id:string; name:string; board:string; open:string; close:string; low:number|null; high:number|null; size:number|null; lot:number|null; sector:string; source:string };
const rows: [string,string,string,string,number|null,number|null,number|null,number|null,string][] = [
 ['National Stock Exchange of India','Mainboard','2026-09-17','2026-09-21',1700,1785,22561.57,8,'Financial services'],
 ['Hero Motors','Mainboard','2026-09-16','2026-09-18',79,84,1000,178,'Automotive'],
 ['SS Retail','Mainboard','2026-09-16','2026-09-18',403,424,500,35,'Retail'],
 ['Jindal Supreme (India)','Mainboard','2026-09-16','2026-09-18',88,93,124.88,161,'Industrials'],
 ['Sonaselection India','Mainboard','2026-09-17','2026-09-21',94,99,141.57,150,'Retail'],
 ['A-One Steels India','Mainboard','2026-09-24','2026-09-28',null,null,405,null,'Steel'],
 ['SpectraA Technology Solutions','SME','2026-09-17','2026-09-21',112,118,42.52,1200,'Technology'],
 ['Kheria Autocomp','SME','2026-09-17','2026-09-21',96,101,46.44,1200,'Automotive'],
 ['Axiom Gas Engineering','SME','2026-09-18','2026-09-22',50,53,49.81,2000,'Energy'],
 ['Robokidz Eduventures','SME','2026-09-21','2026-09-23',100,106,31.09,1200,'Education'],
 ['FX Multitech','SME','2026-09-21','2026-09-23',null,null,3.9,null,'Industrials'],
 ['S.K.Offset','SME','2026-09-23','2026-09-25',119,125,29.06,1000,'Printing'],
];
export const slug = (s:string) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const snapshot: IPO[] = rows.map(([name,board,open,close,low,high,size,lot,sector])=>({id:slug(name),name,board,open,close,low,high,size,lot,sector,source:['Hero Motors','National Stock Exchange of India'].includes(name)?'https://www.ipomarket.in/ipo/'+slug(name):'https://www.ipomarket.in/ipo/upcoming'}));
export const snapshotDate='2026-09-15T10:00:00.000Z';
export const money=(n:number|null)=>n===null?'To be announced':'₹'+n.toLocaleString('en-IN');
export const dateLabel=(s:string)=>s?new Date(s+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'}):'To be announced';
export function issueStatus(p:IPO,now=new Date()){const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(now);if(p.close&&today>p.close)return 'Closed';if(!p.open)return 'Pipeline';return today<p.open?'Upcoming':'Open now';}
