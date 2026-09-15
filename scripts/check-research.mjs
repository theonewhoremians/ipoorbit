import assert from 'node:assert/strict';
import fs from 'node:fs';
const brands=JSON.parse(fs.readFileSync('lib/company-brands.json'));
const research=JSON.parse(fs.readFileSync('lib/research-snapshots.json'));
assert.equal(new Set(research.map(r=>r.id)).size,research.length,'Duplicate research companies');
for(const r of research){
 assert(brands[r.id],r.id+' missing logo');
 assert(['Worth researching','Valuation caution','Wait for disclosures'].includes(r.verdict));
 assert(r.date&&r.source.startsWith('https://www.ipomarket.in/ipo/'));
 assert(r.risks.length&&r.nextStep&&r.metrics.length,'Assessment must include evidence and risks');
 assert(!JSON.stringify(r.metrics).match(/NaN|Infinity/),'Invalid financial calculation');
}
for(const b of Object.values(brands)){assert(b.logo.startsWith('/logos/'));assert(fs.statSync('public'+b.logo).size>100,'Empty logo');}
assert.equal(research.find(r=>r.id==='axiom-gas-engineering').metrics.find(m=>m.label.startsWith('Revenue growth')).value,'12.2%');
console.log('Research evidence, company links, growth calculation and logo assets verified.');
