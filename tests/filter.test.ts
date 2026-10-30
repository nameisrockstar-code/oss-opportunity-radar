import {describe,it,expect} from 'vitest';
import {filterOpportunities,initialFilters,stale,effectiveStatus} from '../src/lib/filter';
import {opportunitySchema} from '../src/lib/schema';
import fixture from '../data/fixtures/fictional-maintainer.json';
const sample=opportunitySchema.parse(fixture);
describe('search, filters and freshness',()=>{
 it('searches descriptions',()=>expect(filterOpportunities([sample],{...initialFilters,q:'fictional'})).toHaveLength(1));
 it('combines filters',()=>expect(filterOpportunities([sample],{...initialFilters,q:'fictional',category:'cloud-credits'})).toHaveLength(0));
 it('matches category',()=>expect(filterOpportunities([sample],{...initialFilters,category:'open-source'})).toHaveLength(1));
 it('does not call unknown verified',()=>expect(filterOpportunities([sample],{...initialFilters,recent:true})).toHaveLength(0));
 it('detects missing verification',()=>expect(stale(sample)).toBe(true));
 it('preserves unknown status',()=>expect(effectiveStatus(sample)).toBe('unknown'));
 it('rejects past deadlines labeled open at display layer',()=>{const bad={...sample,application:{...sample.application,status:'open' as const,deadline:'2020-01-01',deadlineTimezone:'UTC'}};expect(effectiveStatus(bad)).toBe('needs_review')});
});
