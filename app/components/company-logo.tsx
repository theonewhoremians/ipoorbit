'use client';
import {useState} from 'react';
import brands from '../../lib/company-brands.json';
export default function CompanyLogo({id,name}:{id:string;name:string}) {
 const [failed,setFailed]=useState(false);
 const brand=(brands as Record<string,{logo:string;source:string;checkedAt:string}>)[id];
 return <span className={'company-mark '+(brand&&!failed?'official-logo':'')} title={brand&&!failed?`Official branding checked ${brand.checkedAt}`:'Company logo unavailable'}>{brand&&!failed?<img src={brand.logo} alt={name+' logo'} loading="lazy" onError={()=>setFailed(true)}/>:<span aria-label={name+' — logo unavailable'}>{name.split(/\s/).map(x=>x[0]).slice(0,2).join('')}</span>}</span>;
}
