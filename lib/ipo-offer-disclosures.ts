import type {IPO} from './ipos';

type OfferDisclosure = {
 totalSize:number;
 freshIssue:number;
 ofsIssue:number;
 issueType:'Fresh issue'|'OFS'|'Hybrid';
 issueDisclosureDate:string;
 issueDisclosureUrl:string;
};

// Current filed offer terms bridge gaps in the live summary feed. Live, complete
// offer data always wins; these fallbacks apply only while the total still matches.
const disclosures:Record<string,OfferDisclosure>={
 'jio-platforms':{totalSize:30213,freshIssue:30213,ofsIssue:0,issueType:'Fresh issue',issueDisclosureDate:'2026-10-15',issueDisclosureUrl:'https://www.sebi.gov.in/filings/public-issues/oct-2026/jio-platforms-limited-rhp_105274.html'},
 'paras-healthcare':{totalSize:1450,freshIssue:500,ofsIssue:950,issueType:'Hybrid',issueDisclosureDate:'2026-10-15',issueDisclosureUrl:'https://www.sebi.gov.in/filings/public-issues/oct-2026/paras-healthcare-limited-rhp_105284.html'},
 'bls-polymers':{totalSize:255,freshIssue:255,ofsIssue:0,issueType:'Fresh issue',issueDisclosureDate:'2026-10-19',issueDisclosureUrl:'https://www.sebi.gov.in/filings/public-issues/oct-2026/bls-polymers-limited-rhp_105327.html'},
 'sfc-environmental-technologies':{totalSize:667.53,freshIssue:150,ofsIssue:517.53,issueType:'Hybrid',issueDisclosureDate:'2026-10-19',issueDisclosureUrl:'https://sfcenvironment.com/investor/draft-red-herring-prospectus/'},
 'core4-engineers':{totalSize:54.82,freshIssue:54.82,ofsIssue:0,issueType:'Fresh issue',issueDisclosureDate:'2026-10-19',issueDisclosureUrl:'https://core4engineers.com/investors'},
 'eaaa-india-alternatives':{totalSize:1200,freshIssue:0,ofsIssue:1200,issueType:'OFS',issueDisclosureDate:'2026-10-19',issueDisclosureUrl:'https://www.kotakneo.com/news/ipos/eaaa-india-alternatives-ipo-rhp-filed/'},
};

export function applyIPOOfferDisclosure(ipo:IPO):IPO{
 const disclosure=disclosures[ipo.id];
 if(!disclosure||ipo.size==null||Math.abs(ipo.size-disclosure.totalSize)>0.6)return ipo;
 if(ipo.freshIssue!=null&&ipo.freshIssue!==disclosure.freshIssue)return ipo;
 if(ipo.ofsIssue!=null&&ipo.ofsIssue!==disclosure.ofsIssue)return ipo;
 return {...ipo,freshIssue:ipo.freshIssue??disclosure.freshIssue,ofsIssue:ipo.ofsIssue??disclosure.ofsIssue,issueType:ipo.issueType??disclosure.issueType,issueDisclosureDate:ipo.issueDisclosureDate??disclosure.issueDisclosureDate,issueDisclosureUrl:ipo.issueDisclosureUrl??disclosure.issueDisclosureUrl};
}
