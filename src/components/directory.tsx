'use client';

import { useMemo, useState } from 'react';
import type { Opportunity } from '@/lib/schema';
import { categories, audiences, benefitTypes, statuses } from '@/lib/schema';
import { filterOpportunities, initialFilters, type Filters } from '@/lib/filter';
import { OpportunityCard } from './opportunity-card';

const display = (value: string) => value.replaceAll('-', ' ').replaceAll('_', ' ');

export function Directory({ items, category = '' }: { items: Opportunity[]; category?: string }) {
  const [filters, setFilters] = useState<Filters>({ ...initialFilters, category });
  const results = useMemo(() => filterOpportunities(items, filters), [items, filters]);
  const set = (key: keyof Filters, value: string | boolean) => setFilters((current) => ({ ...current, [key]: value }));

  function selection(label: string, key: keyof Filters, options: readonly string[]) {
    return (
      <label className="filter-label" htmlFor={`filter-${key}`}>
        {label}
        <select id={`filter-${key}`} className="control" value={String(filters[key])} onChange={(event) => set(key, event.target.value)}>
          <option value="">All {label.toLowerCase()}</option>
          {options.map((value) => <option key={value} value={value}>{display(value)}</option>)}
        </select>
      </label>
    );
  }

  return (
    <div className="mt-8">
      <section className="filter-panel" aria-label="Opportunity search and filters">
        <label className="filter-label" htmlFor="opportunity-search">Search opportunities</label>
        <input
          id="opportunity-search"
          type="search"
          className="control"
          value={filters.q}
          onChange={(event) => set('q', event.target.value)}
          placeholder="Search names, providers, eligibility, or benefits…"
        />
        <div className="filter-grid">
          {selection('Category', 'category', categories)}
          {selection('Audience', 'audience', audiences)}
          <label className="filter-label" htmlFor="filter-geography">
            Geography
            <input id="filter-geography" className="control" value={filters.geography} onChange={(event) => set('geography', event.target.value)} placeholder="e.g. India, Global" />
          </label>
          {selection('Benefit type', 'benefit', benefitTypes)}
          {selection('Application status', 'status', [...statuses, 'needs_review'])}
          {selection('Deadline window', 'deadline', ['7', '30', '90'])}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <label className="flex items-center gap-2 text-sm muted">
            <input type="checkbox" checked={filters.recent} onChange={(event) => set('recent', event.target.checked)} />
            Verified within freshness window
          </label>
          <button type="button" className="text-sm font-semibold text-link" onClick={() => setFilters(initialFilters)}>Clear all filters ↺</button>
        </div>
      </section>

      <div className="my-5 flex flex-wrap items-center justify-between gap-2">
        <p role="status" aria-live="polite" className="text-sm muted">
          <strong className="text-white">{results.length}</strong> {results.length === 1 ? 'opportunity' : 'opportunities'} match your filters
        </p>
        <span className="text-xs muted">Listings require official-source review</span>
      </div>

      {results.length ? (
        <div className="grid gap-4 md:grid-cols-2">{results.map((item) => <OpportunityCard key={item.id} item={item} />)}</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>No listings have been published yet.</h3>
          <p>The production directory starts empty on purpose. Only real programs with official evidence are added after maintainer review.</p>
          <a className="btn btn-primary" href="/contribute">How to contribute ↗</a>
        </div>
      ) : (
        <div className="empty-state">
          <h3>No matching opportunities</h3>
          <p>Try changing your search or filters. The directory does not include fictional examples.</p>
          <button type="button" className="btn btn-ghost" onClick={() => setFilters(initialFilters)}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
