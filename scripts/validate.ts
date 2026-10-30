import fs from 'node:fs';
import path from 'node:path';
import {validateCollection} from '../src/lib/schema';
import {stale,effectiveStatus} from '../src/lib/filter';
const dir=path.join(process.cwd(),'data/opportunities');
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.json'));
const records=files.map(f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')) as unknown);
try{
  const items=validateCollection(records,true);
  for(const item of items){
    if(effectiveStatus(item)==='needs_review')throw new Error(`${item.id}: expired deadline inconsistent with open/upcoming`);
    if(stale(item))console.warn(`WARNING: ${item.id}: verification missing or stale`);
  }
  console.log(`Validated ${items.length} production records. Fictional fixtures are excluded.`);
}catch(e){console.error(e);process.exitCode=1;}
