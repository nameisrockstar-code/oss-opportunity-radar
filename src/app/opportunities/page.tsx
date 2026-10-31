import { Directory } from '@/components/directory';
import { loadOpportunities } from '@/lib/opportunities';

export default function Opportunities() {
  const items = loadOpportunities();
  return (
    <div className="shell section" style={{ paddingTop: '7.5rem' }}>
      <div className="max-w-3xl">
        <span className="section-kicker">Search · Filter · Verify</span>
        <h1 className="mt-3 font-mono text-4xl font-bold tracking-tight">Opportunity directory</h1>
        <p className="mt-4 max-w-2xl leading-relaxed muted">
          Explore programs backed by official provider sources. Check eligibility, application status, and deadlines on the provider’s website before applying.
        </p>
      </div>
      <Directory items={items} />
    </div>
  );
}
