import {loadOpportunities} from '../src/lib/opportunities';
// Run separately from CI's deterministic validation. HTTP failures trigger human review, never automatic status updates.
async function main(){
 const urls=[...new Set(loadOpportunities().flatMap(o=>[...o.sources.map(s=>s.url),o.application.url].filter((u):u is string=>!!u)))];
 const problems:string[]=[];
 for(const url of urls){
  try{
   let response=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(10000),headers:{'User-Agent':'OSSOpportunityRadarLinkReview/0.1'}});
   if(response.status===405||response.status===501)response=await fetch(url,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(10000),headers:{'User-Agent':'OSSOpportunityRadarLinkReview/0.1'}});
   if(!response.ok)problems.push(`${url}: HTTP ${response.status} (review manually; not proof of closure)`);
  }catch(e){problems.push(`${url}: ${String(e)} (review manually)`)}
 }
 console.log(JSON.stringify({checkedAt:new Date().toISOString(),urlCount:urls.length,problems},null,2));
 if(problems.length)process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1});
