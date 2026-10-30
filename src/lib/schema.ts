import { z } from 'zod';
export const categories = ['ai-tools','startup-grants','cloud-credits','open-source','hackathons','student-programs','api-credits','accelerators'] as const;
export const audiences = ['independent-developers','open-source-maintainers','startup-founders','students','hackathon-participants','developers'] as const;
export const statuses = ['open','upcoming','closed','rolling','paused','unknown'] as const;
export const benefitTypes = ['subscription','credit','grant','mentorship','access','prize','other'] as const;
const dateTime = z.iso.datetime({ offset: true });
const day = z.iso.date();
const https = z.url().refine(v => new URL(v).protocol === 'https:', 'HTTPS required');
const evidence = z.object({url: https, checkedAt: dateTime, note: z.string().min(1)}).strict();
export const opportunitySchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1), provider: z.string().min(1), summary: z.string().min(1), description: z.string().min(1),
  categories: z.array(z.enum(categories)).min(1), audiences: z.array(z.enum(audiences)).min(1),
  benefits: z.array(z.object({type:z.enum(benefitTypes),description:z.string().min(1)}).strict()).min(1),
  eligibility: z.object({ summary:z.string().min(1), criteria:z.array(z.string()), geographies:z.array(z.string()), unknowns:z.array(z.string()) }).strict(),
  application: z.object({status:z.enum(statuses),url:https.nullable(),deadline:day.nullable(),deadlineTimezone:z.string().min(1).nullable()}).strict(),
  sources: z.array(z.object({url:https,type:z.literal('official'),label:z.string().min(1)}).strict()).min(1),
  verification: z.object({status:z.enum(['verified','needs_review','unverified','stale']),lastVerifiedAt:dateTime.nullable(), notes:z.array(z.string()),statusEvidence:evidence.nullable(),history:z.array(z.object({status:z.enum(statuses), changedAt:dateTime,evidence}).strict())}).strict(),
  requiredDocuments:z.array(z.string()), applicationProcess:z.string().min(1),limitations:z.array(z.string()),
  createdAt:dateTime, updatedAt:dateTime, fixture:z.boolean().optional()
}).strict().superRefine((o,ctx)=>{
  if(o.slug!==o.id)ctx.addIssue({code:'custom',message:'id and slug must match',path:['slug']});
  if(Boolean(o.application.deadline)!==Boolean(o.application.deadlineTimezone))ctx.addIssue({code:'custom',message:'Deadline and timezone must both be present or null',path:['application']});
  if(o.application.status!=='unknown'&&!o.verification.statusEvidence)ctx.addIssue({code:'custom',message:'Non-unknown status requires dated official evidence',path:['verification','statusEvidence']});
  if(o.verification.status==='verified'&&!o.verification.lastVerifiedAt)ctx.addIssue({code:'custom',message:'Verified requires timestamp',path:['verification','lastVerifiedAt']});
  if(o.verification.statusEvidence && !o.sources.some(s=>s.url===o.verification.statusEvidence?.url))ctx.addIssue({code:'custom',message:'Status evidence must reference an official listed source',path:['verification','statusEvidence']});
  if(o.createdAt>o.updatedAt)ctx.addIssue({code:'custom',message:'updatedAt predates createdAt',path:['updatedAt']});
});
export type Opportunity = z.infer<typeof opportunitySchema>;
export function normalizedUrl(raw:string){const u=new URL(raw);return `${u.hostname.toLowerCase().replace(/^www\./,'')}${u.pathname.replace(/\/$/,'')}`.toLowerCase();}
export function validateCollection(records:unknown[], production=true):Opportunity[]{
  const all=records.map((o,i)=>{try{return opportunitySchema.parse(o)}catch(e){throw new Error(`Record ${i}: ${String(e)}`)}});
  const ids=new Set<string>(),urls=new Set<string>();
  for(const o of all){
    if(production&&o.fixture)throw new Error(`${o.id}: fixture forbidden in production`);
    if(ids.has(o.id))throw new Error(`Duplicate ID: ${o.id}`);ids.add(o.id);
    // Source URLs must be unique across records; application URLs are also
    // checked across records, but may equal their own official source.
    const recordUrls=new Set([...o.sources.map(s=>normalizedUrl(s.url)), ...(o.application.url?[normalizedUrl(o.application.url)]:[])]);
    for(const key of recordUrls){
      if(urls.has(key))throw new Error(`Duplicate official/application URL: ${key}`);
      urls.add(key);
    }
  }
  return all;
}
