import Link from 'next/link';
import { OpportunityCard } from '@/components/opportunity-card';
import { GridPulse } from '@/components/grid-pulse';
import { TypewriterText } from '@/components/typewriter-text';
import { loadOpportunities } from '@/lib/opportunities';
import { categories } from '@/lib/schema';

const features = [
  {
    number: '01',
    title: 'Official-source evidence',
    description: 'Every published record must point to an official provider source. We keep source facts separate from community commentary.',
  },
  {
    number: '02',
    title: 'Honest application status',
    description: 'Open, upcoming, closed, rolling, paused, and unknown are distinct states. We never guess that a program is accepting applications.',
  },
  {
    number: '03',
    title: 'Freshness checks',
    description: 'Verification dates are visible, and old or missing checks are flagged so readers know when to re-check the provider.',
  },
  {
    number: '04',
    title: 'Transparent eligibility',
    description: 'Geography, audience, benefits, documents, and unknowns are shown as recorded—not turned into an eligibility promise.',
  },
  {
    number: '05',
    title: 'Community review',
    description: 'New listings and changes go through maintainer review with cited evidence and an auditable change history.',
  },
  {
    number: '06',
    title: 'No paid placement',
    description: 'The directory is independent. Providers cannot buy a better position, and inclusion does not imply endorsement.',
  },
];

const categoryNames = [
  'AI tools',
  'Startup grants',
  'Cloud credits',
  'Open source',
  'Hackathons',
  'Student programs',
  'API credits',
  'Accelerators',
];

export default function Home() {
  const items = loadOpportunities();
  const verified = items.filter((item) => item.verification.status === 'verified').length;
  const sources = new Set(items.flatMap((item) => item.sources.map((source) => source.url))).size;
  const stats = [
    { value: String(items.length), label: 'Published listings' },
    { value: String(verified), label: 'Marked verified' },
    { value: String(categories.length), label: 'Tracked categories' },
    { value: String(sources), label: 'Official source URLs' },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <GridPulse />
        <div className="shell hero-inner">
          <div className="hero-copy">
            <span className="eyebrow"><span className="live-dot" /> Independent · Open source · Evidence-first</span>
            <h1>Find your next <span className="accent-text"><TypewriterText text="developer opportunity." /></span></h1>
            <p className="hero-description">
              Discover grants, credits, open-source programs, and developer benefits—with transparent eligibility,
              official source links, and honest deadline status.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/opportunities">Explore the directory <span aria-hidden="true">↗</span></Link>
              <Link className="btn btn-ghost" href="/methodology">See how verification works</Link>
            </div>
            <p className="hero-note"><span className="live-dot" /> No invented listings. No guessed deadlines. No paid rankings.</p>
          </div>

          <div className="preview-window" aria-label="Live preview of the opportunity directory">
            <div className="preview-topbar">
              <div className="window-title">
                <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
                <span>oss-opportunity-radar / directory snapshot</span>
              </div>
              <span className="window-status">● SOURCE-AWARE DIRECTORY</span>
            </div>
            <div className="preview-metrics">
              {stats.map((stat, index) => (
                <div className="preview-metric" key={stat.label}>
                  <span className="metric-symbol">{['↗', '✓', '◈', '⌁'][index]}</span>
                  <div><strong>{stat.value}</strong><span>{stat.label}</span></div>
                </div>
              ))}
            </div>
            <div className="preview-columns">
              <section className="preview-column">
                <h3>Recently published</h3>
                {items.length ? (
                  <div className="preview-list">
                    {items.slice(0, 3).map((item) => (
                      <Link href={`/opportunities/${item.slug}`} key={item.id}>
                        <strong>{item.name}</strong><span>{item.provider} · {item.application.status}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="preview-empty">
                    <strong>No published records yet</strong>
                    <p>Production listings appear only after official-source review.</p>
                  </div>
                )}
              </section>
              <section className="preview-column">
                <h3>Verification snapshot</h3>
                <div className="preview-data-line"><span>Verified</span><strong>{verified}</strong></div>
                <div className="preview-data-line"><span>Needs review</span><strong>{items.filter((item) => item.verification.status === 'needs_review').length}</strong></div>
                <div className="preview-data-line"><span>Unverified / stale</span><strong>{items.filter((item) => ['unverified', 'stale'].includes(item.verification.status)).length}</strong></div>
                <div className="preview-data-line"><span>Unknown status</span><strong>{items.filter((item) => item.application.status === 'unknown').length}</strong></div>
              </section>
              <section className="preview-column">
                <h3>Opportunity categories</h3>
                <div className="preview-tags">
                  {categoryNames.map((name) => <span key={name}>{name}</span>)}
                </div>
                <p style={{ marginTop: '1rem', color: '#858585', fontSize: '.68rem', lineHeight: 1.6 }}>
                  Categories describe the type of program—not a promise that a listing is currently available.
                </p>
              </section>
              <section className="preview-column preview-code">
                <h3>Record requirements</h3>
                <pre><span className="code-orange">const</span> listing = {'{'}
{ '  '}source: <span className="code-green">&quot;official HTTPS&quot;</span>,
{ '  '}eligibility: <span className="code-green">&quot;documented&quot;</span>,
{ '  '}deadline: <span className="code-green">&quot;confirmed or null&quot;</span>,
{ '  '}status: <span className="code-green">&quot;evidence-backed&quot;</span>,
{ '  '}review: <span className="code-green">&quot;human-approved&quot;</span>
{'}'}</pre>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-band" aria-label="Directory statistics">
        <div className="shell stats-grid">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="section">
        <div className="shell">
          <div className="section-heading">
            <span className="section-kicker">Built around trust</span>
            <h2>Opportunity discovery, without the guesswork.</h2>
            <p>Useful listings are only useful when their facts can be checked. The Radar makes the evidence and uncertainty visible.</p>
          </div>
          <div className="feature-marquee" aria-label="Opportunity Radar features">
            <div className="feature-track">
              {[false, true].map((duplicate) => (
                <div className="feature-set" key={duplicate ? 'duplicate' : 'original'} aria-hidden={duplicate}>
                  {features.map((feature) => (
                    <article className="feature-card" key={feature.number}>
                      <span className="feature-number">{feature.number}</span>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="shell experience-grid">
          <div className="experience-copy">
            <span className="section-kicker">A transparent process</span>
            <h2>Every listing should show its work.</h2>
            <p>
              The directory is intentionally repository-first. A maintainer checks the provider’s official information,
              records what is known, and submits a structured listing for review before it can appear here.
            </p>
            <ul className="check-list">
              <li><span className="check-mark">✓</span><span>Official HTTPS source required for every published record.</span></li>
              <li><span className="check-mark">✓</span><span>Unconfirmed deadlines stay unpublished instead of being estimated.</span></li>
              <li><span className="check-mark">✓</span><span>Fixtures and examples never appear in the production directory.</span></li>
              <li><span className="check-mark">✓</span><span>Link failures trigger human review—not automatic closure.</span></li>
            </ul>
            <div style={{ marginTop: '1.8rem' }}>
              <Link href="/methodology" className="text-link">Read the verification methodology →</Link>
            </div>
          </div>
          <div className="terminal-card">
            <div className="terminal-head">
              <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
              <span>maintainer / validate-record</span>
            </div>
            <div className="terminal-body">
              <div><span className="prompt">$</span> npm run validate</div>
              <div className="success">✓ Schema and evidence rules checked</div>
              <div className="success">✓ Duplicate identifiers and source URLs checked</div>
              <div className="success">✓ Deadline/status conflicts checked</div>
              <div className="comment"># Records are reviewed before publication</div>
              <br />
              <div><span className="prompt">record.status</span> = &quot;unknown&quot;</div>
              <div><span className="prompt">record.deadline</span> = null</div>
              <div className="comment"># Unknown means unknown. Never infer.</div>
              <br />
              <div className="success">→ Evidence first. Then publish.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="latest" className="section">
        <div className="shell">
          <div className="section-heading">
            <span className="section-kicker">The directory</span>
            <h2>Explore opportunities with context.</h2>
            <p>Search by category, audience, geography, benefit type, status, and deadline—then inspect the source and verification history.</p>
          </div>
          {items.length ? (
            <div className="latest-grid">
              {items.slice(0, 4).map((item) => <OpportunityCard key={item.id} item={item} />)}
            </div>
          ) : (
            <div className="empty-state">
              <h3>The directory is ready. The listings are not guessed.</h3>
              <p>
                No real opportunity records have passed maintainer review yet. This space will show verified,
                source-backed programs as they are approved—never fictional examples or unconfirmed offers.
              </p>
              <Link href="/contribute" className="btn btn-primary">Contribute a sourced listing <span aria-hidden="true">↗</span></Link>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/opportunities" className="btn btn-ghost">Open full directory →</Link>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-grid" aria-hidden="true" />
        <div className="shell cta-content">
          <span className="section-kicker">Open source · Community reviewed</span>
          <h2>Help make opportunity data more trustworthy.</h2>
          <p>Know a program with an official source? Suggest it with evidence. A maintainer will review it before it appears in the directory.</p>
          <div className="hero-actions">
            <Link href="/contribute" className="btn btn-primary">Contribute a listing <span aria-hidden="true">↗</span></Link>
            <Link href="/opportunities" className="btn btn-ghost">Browse the directory</Link>
          </div>
        </div>
      </section>
    </>
  );
}
