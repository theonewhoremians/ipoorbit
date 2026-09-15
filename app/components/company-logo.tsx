'use client';
import {useState,useEffect} from 'react';
import brands from '../../lib/company-brands.json';
export default function CompanyLogo({id,name,source=''}:{id:string;name:string;source?:string}) {
 const known=(brands as Record<string,{logo:string}>)[id];
 const [images,setImages]=useState<string[]>(known?[known.logo]:[]),[index,setIndex]=useState(0);
 useEffect(()=>{
  const controller=new AbortController();
  const refresh=()=>fetch('/api/logo?id='+encodeURIComponent(id)+'&source='+encodeURIComponent(source),{signal:controller.signal}).then(r=>r.json() as Promise<{images:unknown[]}>).then(d=>{if(Array.isArray(d.images)){setImages(d.images.filter((v:unknown)=>typeof v==='string'));setIndex(0)}}).catch(()=>{});
  refresh();const timer=setInterval(refresh,3600000);return()=>{controller.abort();clearInterval(timer)};
 },[id,source]);
 const image=images[index];
 return <span className={'company-mark '+(image?'official-logo':'')} title={image?'Company branding · automatically resolved':'Logo not published or temporarily unavailable'}>{image?<img src={image} alt={name+' logo'} loading="lazy" referrerPolicy="no-referrer" onError={()=>setIndex(i=>i+1)}/>:<span aria-label={name+' — logo unavailable'}>{name.split(/\s/).map(x=>x[0]).slice(0,2).join('')}</span>}</span>;
}
