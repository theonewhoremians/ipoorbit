import fs from 'node:fs/promises';
const entries={
'anawil-wire-and-engineering':'https://anawilvapi.in/images/Anawin%20WNE_Final%20Logo.png',
'zepto':'https://cdn.zeptonow.com/web-static-assets-prod/artifacts/16.31.0/images/logo.svg',
'hgs-india':'https://www.hgsindia.com/reckon_product/images/hgs_img.png',
'jindal-supreme-india':'https://jindalsupreme.com/wp-content/uploads/2024/11/logo.webp',
'hero-motors':'https://www.heromotors.com/images/logo1.png',
'sonaselection-india':'https://www.sonaselection.com/Icons/sona-logo.webp',
'spectraa-technology-solutions':'https://www.spectraa.com/wp-content/uploads/2023/02/spectraa32.png',
'kheria-autocomp':'https://kheria.com/wp-content/uploads/2025/05/logo.svg',
'axiom-gas-engineering':'https://axiomgas.com/assets/images/logo.svg',
'robokidz-eduventures':'https://www.robokidz.co.in/wp-content/uploads/2021/06/cropped-robokidz-logo-resized-compressed-114x50.png',
'fx-multitech':'https://www.fxmultitech.com/wp-content/uploads/2025/11/FX-logo.png',
's-k-offset':'https://www.skoffset.com/assets/images/logos/skoffsetlogo4.png',
'a-one-steels-india':'https://www.aonesteelgroup.com/wp-content/uploads/2023/10/cropped-logo-aone.png',
'hero-fincorp':'https://www.herofincorp.com/images/logo.webp',
'jio-platforms':'https://myjiostatic.cdn.jio.com/jiocom/static/images/jio10.svg',
'oyo-oravel-stays-prism':'https://assets.oyoroomscdn.com/cmsMedia/cbb32ddf-9493-48f2-90ae-9a89f8361754.png',
'boat-imagine-marketing':'https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_black_24889e30-925c-4185-a028-9fef497a8e44.svg?v=1732879339',
'milky-mist':'https://static.wixstatic.com/media/972f01_eec37aaba55849debf25ce804b886daa~mv2.png/v1/crop/x_4,y_0,w_436,h_120/fill/w_145,h_40,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/MMD.png',
'vardhman-airport-solutions':'https://vardhmanairports.com/favicon/1.svg',
'vaibhav-vyapaar':'https://www.vaibhav-vyapaar.com/assets/Group%201.svg',
'tgtmc-supply-chain':'https://www.thego2marketcompany.com/wp-content/uploads/2024/07/logo.svg',
'maxwell-engineering-solutions':'https://maxwells.in/wp-content/uploads/2024/10/MAXWELL_AI_FILE_LOGO-removebg-preview-e1761842363894.png',
'ideas-electricals-engineers':'https://www.ideasengineers.com/assets/IEEPL-Logo--4VgptoA.png',
'ss-retail':'https://ssmobile.com/aboutus/investor/assets/images/SS-RETAIL-LIMITED.svg',
'eventions':'https://eventions.in/wp-content/uploads/2024/11/logo.png',
'veritas-finance':'https://www.veritasfin.in/image/logo/logo.png',
'national-stock-exchange-of-india':'https://nsearchives.nseindia.com///web/sites/default/files/2019-07/NSE%404x-100.jpg'
};
await fs.mkdir('public/logos',{recursive:true});
const manifest=JSON.parse(await fs.readFile('lib/company-brands.json','utf8'));
for(let i=0;i<Object.keys(entries).length;i+=5)await Promise.allSettled(Object.entries(entries).slice(i,i+5).map(async([id,source])=>{try{if(manifest[id])return;const r=await fetch(source,{signal:AbortSignal.timeout(40000)});const type=r.headers.get('content-type')||'';if(!r.ok||!type.startsWith('image/'))throw Error(r.status+' '+type);const ext=type.split('/')[1].split(';')[0].replace('svg+xml','svg');const logo='/logos/'+id+'.'+ext;await fs.writeFile('public'+logo,Buffer.from(await r.arrayBuffer()));manifest[id]={logo,source,checkedAt:'2026-09-16'};console.log(id+' OK')}catch(e){console.log(id+' '+e.message)}}));
manifest['s-s-k-offset']=manifest['s-k-offset'];manifest['nse-national-stock-exchange']=manifest['national-stock-exchange-of-india'];
await fs.writeFile('lib/company-brands.json',JSON.stringify(manifest,null,2));
