import {describe,it,expect} from 'vitest';
import {opportunitySchema,validateCollection} from '../src/lib/schema';
import fixture from '../data/fixtures/fictional-maintainer.json';
describe('production data integrity',()=>{
 it('fixture is schema valid but forbidden in production',()=>{expect(opportunitySchema.safeParse(fixture).success).toBe(true);expect(()=>validateCollection([fixture])).toThrow(/fixture forbidden/)});
 it('rejects duplicate IDs',()=>expect(()=>validateCollection([fixture,fixture],false)).toThrow(/Duplicate ID/));
 it('rejects duplicate normalized official URL',()=>expect(()=>validateCollection([fixture,{...fixture,id:'other',slug:'other'}],false)).toThrow(/Duplicate official\/application URL/));
 it('rejects repeated application URLs across records',()=>expect(()=>validateCollection([{...fixture,application:{...fixture.application,url:'https://example.com/apply'}},{...fixture,id:'second',slug:'second',application:{...fixture.application,url:'https://example.com/apply'},sources:[{url:'https://second.example.com/program',type:'official',label:'Source'}]}],false)).toThrow(/Duplicate official\/application URL/));
 it('rejects non-HTTPS URLs',()=>expect(opportunitySchema.safeParse({...fixture,sources:[{url:'http://example.com',type:'official',label:'Source'}]}).success).toBe(false));
 it('rejects unsupported status without evidence',()=>expect(opportunitySchema.safeParse({...fixture,application:{...fixture.application,status:'open'}}).success).toBe(false));
 it('rejects deadline without timezone',()=>expect(opportunitySchema.safeParse({...fixture,application:{...fixture.application,deadline:'2027-05-01'}}).success).toBe(false));
 it('rejects invalid dates',()=>expect(opportunitySchema.safeParse({...fixture,updatedAt:'yesterday'}).success).toBe(false));
});
