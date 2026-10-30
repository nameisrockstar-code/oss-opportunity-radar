import fs from 'node:fs';
import path from 'node:path';
import { Opportunity, validateCollection } from './schema';
export function loadOpportunities():Opportunity[]{
  const dir=path.join(process.cwd(),'data/opportunities');
  const files=fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort();
  const records=files.map(f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')) as unknown);
  return validateCollection(records,true);
}
export const getOpportunity=(slug:string)=>loadOpportunities().find(o=>o.slug===slug);
