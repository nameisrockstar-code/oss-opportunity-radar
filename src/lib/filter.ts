import { Opportunity } from './schema';
export type Filters={q:string;category:string;audience:string;geography:string;benefit:string;status:string;deadline:string;recent:boolean};
export const initialFilters:Filters={q:'',category:'',audience:'',geography:'',benefit:'',status:'',deadline:'',recent:false};
export function daysSince(iso:string|null,now=new Date()):number|null{return iso===null?null:Math.floor((now.getTime()-Date.parse(iso))/86400000)}
export function stale(o:Opportunity,now=new Date()):boolean{
  const age=daysSince(o.verification.lastVerifiedAt,now);
  const deadline=o.application.deadline;
  const soon=deadline!==null && Date.parse(`${deadline}T23:59:59Z`)>=now.getTime() && Date.parse(`${deadline}T23:59:59Z`)-now.getTime()<=7*86400000;
  return age===null || age>(soon?7:30);
}
export function effectiveStatus(o:Opportunity,now=new Date()){
  if(o.application.deadline && Date.parse(`${o.application.deadline}T23:59:59Z`)<now.getTime() && ['open','upcoming'].includes(o.application.status)) return 'needs_review';
  return o.application.status;
}
export function filterOpportunities(items:Opportunity[], f:Filters,now=new Date()){
  const q=f.q.trim().toLowerCase();
  return items.filter(o=>{
    const blob=[o.name,o.provider,o.summary,o.description,o.eligibility.summary,...o.benefits.map(b=>b.description),...o.categories,...o.audiences].join(' ').toLowerCase();
    if(q&&!blob.includes(q))return false;
    if(f.category&&!o.categories.includes(f.category as Opportunity['categories'][number]))return false;
    if(f.audience&&!o.audiences.includes(f.audience as Opportunity['audiences'][number]))return false;
    if(f.geography&&!o.eligibility.geographies.some(g=>g.toLowerCase().includes(f.geography.toLowerCase())) && !o.eligibility.geographies.includes('Global'))return false;
    if(f.benefit&&!o.benefits.some(b=>b.type===f.benefit))return false;
    if(f.status&&effectiveStatus(o,now)!==f.status)return false;
    if(f.recent&&(stale(o,now)||o.verification.status!=='verified'))return false;
    if(f.deadline){
      if(!o.application.deadline)return false;
      const end=Date.parse(`${o.application.deadline}T23:59:59Z`),days=Number(f.deadline);
      if(end<now.getTime()||end>now.getTime()+days*86400000)return false;
    }
    return true;
  });
}
