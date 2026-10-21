import type {IPO} from './ipos';

type OfferDisclosure = {
 totalSize:number|null;
 freshIssue?:number;
 ofsIssue?:number;
 freshShares?:number;
 ofsShares?:number;
 issueType:'Fresh issue'|'OFS'|'Hybrid';
 issueDisclosureDate:string;
 issueDisclosureUrl:string;
 supersedesFeed?:boolean;
};

// Public offer documents are the source of truth for issue structure. Values in
// rupees are in crore; when the draft gives only share counts, retain that unit.
const disclosures:Record<string,OfferDisclosure>={
 'jio-platforms':{totalSize:30213,freshIssue:30213,ofsIssue:0,issueType:'Fresh issue',issueDisclosureDate:'2026-10-15',issueDisclosureUrl:'https://www.sebi.gov.in/filings/public-issues/oct-2026/jio-platforms-limited-rhp_105274.html'},
 'paras-healthcare':{totalSize:1450,freshIssue:500,ofsIssue:950,issueType:'Hybrid',issueDisclosureDate:'2026-10-15',issueDisclosureUrl:'https://www.sebi.gov.in/filings/public-issues/oct-2026/paras-healthcare-limited-rhp_105284.html'},
 'bls-polymers':{totalSize:255,freshIssue:255,ofsIssue:0,issueType:'Fresh issue',issueDisclosureDate:'2026-10-19',issueDisclosureUrl:'https://www.sebi.gov.in/filings/public-issues/oct-2026/bls-polymers-limited-rhp_105327.html'},
 'sfc-environmental-technologies':{totalSize:667.53,freshIssue:150,ofsIssue:517.53,issueType:'Hybrid',issueDisclosureDate:'2026-10-19',issueDisclosureUrl:'https://sfcenvironment.com/investor/draft-red-herring-prospectus/'},
 'core4-engineers':{totalSize:54.82,freshIssue:54.82,ofsIssue:0,issueType:'Fresh issue',issueDisclosureDate:'2026-10-19',issueDisclosureUrl:'https://core4engineers.com/investors'},
 'eaaa-india-alternatives':{totalSize:1200,freshIssue:0,ofsIssue:1200,issueType:'OFS',issueDisclosureDate:'2026-10-19',issueDisclosureUrl:'https://www.kotakneo.com/news/ipos/eaaa-india-alternatives-ipo-rhp-filed/'},
 'oyo-oravel-stays-prism':{totalSize:6650,freshIssue:6650,ofsIssue:0,issueType:'Fresh issue',issueDisclosureDate:'2026-06-30',issueDisclosureUrl:'https://www.prismlife.com/ipo-kit.html'},
 'hero-fincorp':{totalSize:3358.135,freshIssue:1790.001,ofsIssue:1568.134,issueType:'Hybrid',issueDisclosureDate:'2025-11-17',issueDisclosureUrl:'https://www.sebi.gov.in/sebi_data/attachdocs/nov-2025/1764331093856.pdf',supersedesFeed:true},
 'veritas-finance':{totalSize:2800,freshIssue:600,ofsIssue:2200,issueType:'Hybrid',issueDisclosureDate:'2026-08-03',issueDisclosureUrl:'https://www.sebi.gov.in/filings/public-issues/aug-2026/veritas-finance-limited-drhp_103304.html'},
 'boat-imagine-marketing':{totalSize:1500,freshIssue:500,ofsIssue:1000,issueType:'Hybrid',issueDisclosureDate:'2025-10-29',issueDisclosureUrl:'https://www.sebi.gov.in/filings/public-issues/oct-2025/imagine-marketing-limited-udrhp_97510.html'},
 'm-p-steel-india':{totalSize:null,freshIssue:95,ofsShares:2307290,issueType:'Hybrid',issueDisclosureDate:'2026-08-25',issueDisclosureUrl:'https://www.sebi.gov.in/filings/public-issues/aug-2026/m-p-steel-india-limited-drhp_103990.html'},
 'avaada-electro':{totalSize:7600,freshIssue:1600,ofsIssue:6000,issueType:'Hybrid',issueDisclosureDate:'2026-08-26',issueDisclosureUrl:'https://avaadaelectro.com/investors-relations/'},
 'atomberg-technologies':{totalSize:null,freshIssue:450,ofsShares:76542051,issueType:'Hybrid',issueDisclosureDate:'2026-08-21',issueDisclosureUrl:'https://www.bseindia.com/corporates/download/325308/IPO%20Prior/2DRHP_20260821021405.pdf'},
 'vardhman-airport-solutions':{totalSize:null,freshShares:4796000,ofsShares:1138000,issueType:'Hybrid',issueDisclosureDate:'2026-06-30',issueDisclosureUrl:'https://vardhmanairports.com/investors/offer-documents'},
 'shree-siddhivinayak-greentech-industries':{totalSize:null,freshShares:6596000,ofsIssue:0,issueType:'Fresh issue',issueDisclosureDate:'2026-07-24',issueDisclosureUrl:'https://shreesiddhivinayakgreentech.com/investors/'},
 'hgs-india':{totalSize:null,freshShares:2326000,ofsShares:554000,issueType:'Hybrid',issueDisclosureDate:'2026-03-30',issueDisclosureUrl:'https://www.hgsindia.com/public/uploads/pdfs/ipomeetings/DRHP.pdf'},
 'alde-medi-impex':{totalSize:null,freshShares:4728000,ofsIssue:0,issueType:'Fresh issue',issueDisclosureDate:'2026-09-14',issueDisclosureUrl:'https://www.corporateprofessionals.com/investors/'},
 'panchratan-steels':{totalSize:36.14,freshIssue:36.14,ofsIssue:0,issueType:'Fresh issue',issueDisclosureDate:'2026-08-31',issueDisclosureUrl:'https://www.business-standard.com/markets/ipo/panchratan-steels-ltd-ipo-97563'},
 'sunkind-india':{totalSize:null,freshShares:6408000,ofsIssue:0,issueType:'Fresh issue',issueDisclosureDate:'2026-08-11',issueDisclosureUrl:'https://sunkind.in/investors'},
 'dynamic-eyewear-india':{totalSize:null,freshShares:2800000,ofsShares:310000,issueType:'Hybrid',issueDisclosureDate:'2026-07-20',issueDisclosureUrl:'https://ipobarta.ai/ipo/upcoming-ipos/company/dynamic-eyewear-india-ipo/3199'},
 'geeta-glasses-india':{totalSize:null,freshShares:4009600,ofsShares:576000,issueType:'Hybrid',issueDisclosureDate:'2026-08-31',issueDisclosureUrl:'https://www.ipoplatform.com/ipo/review/geeta-glasses-india-ipo/4794'},
};

export function applyIPOOfferDisclosure(ipo:IPO):IPO{
 const disclosure=disclosures[ipo.id];
 if(!disclosure)return ipo;
 if(ipo.issueDisclosureDate&&ipo.issueDisclosureDate>disclosure.issueDisclosureDate)return ipo;
 if(!disclosure.supersedesFeed&&disclosure.totalSize!=null&&ipo.size!=null&&Math.abs(ipo.size-disclosure.totalSize)>0.6)return ipo;
 const mismatch=(current:number|undefined|null,expected:number|undefined)=>current!=null&&expected!=null&&current!==expected;
 if(!disclosure.supersedesFeed&&(mismatch(ipo.freshIssue,disclosure.freshIssue)||mismatch(ipo.ofsIssue,disclosure.ofsIssue)||mismatch(ipo.freshShares,disclosure.freshShares)||mismatch(ipo.ofsShares,disclosure.ofsShares)))return ipo;
 const prefer=(current:number|undefined|null,fallback:number|undefined)=>disclosure.supersedesFeed?fallback??current:current??fallback;
 const replaceSize=disclosure.totalSize!=null&&(disclosure.supersedesFeed||ipo.size==null);
 return {
  ...ipo,
  size:replaceSize?disclosure.totalSize:ipo.size,
  sizeLabel:replaceSize?`₹${disclosure.totalSize!.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})} Cr`:ipo.sizeLabel,
  freshIssue:prefer(ipo.freshIssue,disclosure.freshIssue),
  ofsIssue:prefer(ipo.ofsIssue,disclosure.ofsIssue),
  freshShares:prefer(ipo.freshShares,disclosure.freshShares),
  ofsShares:prefer(ipo.ofsShares,disclosure.ofsShares),
  issueType:disclosure.supersedesFeed?disclosure.issueType:ipo.issueType??disclosure.issueType,
  issueDisclosureDate:ipo.issueDisclosureDate??disclosure.issueDisclosureDate,
  issueDisclosureUrl:ipo.issueDisclosureUrl??disclosure.issueDisclosureUrl,
 };
}
