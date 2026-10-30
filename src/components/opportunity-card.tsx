import Link from 'next/link';
import type { Opportunity } from '@/lib/schema';
import { effectiveStatus, stale } from '@/lib/filter';

const pretty = (value: string) => value.replaceAll('-', ' ').replaceAll('_', ' ');

export function OpportunityCard({ item }: { item: Opportunity }) {
  const status = effectiveStatus(item);
  const needsReview = stale(item) || item.verification.status !== 'verified';
  const statusLabel = status === 'needs_review' ? 'Deadline passed · review needed' : pretty(status);

  return (
    <article className="opportunity-card">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`pill ${status === 'open' || status === 'rolling' ? 'pill--success' : status === 'needs_review' || status === 'unknown' ? 'pill--warning' : ''}`}>
          {statusLabel}
        </span>
        {needsReview && <span className="pill pill--warning">Verification check needed</span>}
      </div>
      <h2><Link href={`/opportunities/${item.slug}`}>{item.name}</Link></h2>
      <p className="muted text-sm">{item.provider}</p>
      <p className="my-3 text-sm">{item.summary}</p>
      <div className="flex flex-wrap gap-2">
        {item.categories.slice(0, 3).map((category) => <span className="pill" key={category}>{pretty(category)}</span>)}
      </div>
      <p className="mt-4 text-sm font-semibold">{item.benefits.map((benefit) => benefit.description).join(' · ')}</p>
      <div className="card-bottom">
        <div className="flex flex-wrap justify-between gap-2 text-xs muted">
          <span>Audience: {item.audiences.map(pretty).join(', ')}</span>
          <span>Deadline: {item.application.deadline ?? 'Not published'}</span>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Link href={`/opportunities/${item.slug}`} className="text-link text-sm font-semibold">View details →</Link>
          <a href={item.sources[0].url} target="_blank" rel="noopener noreferrer" className="text-sm muted">Official source ↗</a>
        </div>
      </div>
    </article>
  );
}
