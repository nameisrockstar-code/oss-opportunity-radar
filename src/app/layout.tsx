import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: {
    default: 'OSS Opportunity Radar — Find developer opportunities',
    template: '%s | OSS Opportunity Radar',
  },
  description:
    'An independent, evidence-first directory for grants, credits, open-source programs, hackathons, and developer opportunities. Every published listing links to official evidence.',
  applicationName: 'OSS Opportunity Radar',
};

const nav = [
  ['Directory', '/opportunities'],
  ['Methodology', '/methodology'],
  ['Contribute', '/contribute'],
  ['About', '/about'],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${jetbrains.variable} antialiased`}>
        <a href="#main" className="skip-link">Skip to content</a>
        <header className="site-header">
          <div className="shell navbar">
            <Link href="/" className="brand" aria-label="OSS Opportunity Radar home">
              <span className="brand-mark" aria-hidden="true">◈</span>
              <span className="brand-name">OSS <span className="accent-text">Opportunity Radar</span></span>
            </Link>
            <nav className="nav-links" aria-label="Main navigation">
              {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            </nav>
            <div className="nav-actions">
              <Link className="btn btn-ghost" href="/methodology">How it works</Link>
              <Link className="btn btn-primary" href="/opportunities">Explore directory <span aria-hidden="true">↗</span></Link>
            </div>
            <details className="mobile-menu">
              <summary aria-label="Open navigation menu">Menu <span aria-hidden="true">☰</span></summary>
              <nav className="mobile-menu-panel" aria-label="Mobile navigation">
                {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
                <Link href="/opportunities">Explore directory ↗</Link>
              </nav>
            </details>
          </div>
        </header>
        <main id="main" className="min-h-screen">{children}</main>
        <footer className="site-footer">
          <div className="shell">
            <div className="footer-grid">
              <div>
                <Link href="/" className="brand">
                  <span className="brand-mark" aria-hidden="true">◈</span>
                  <span className="brand-name">OSS <span className="accent-text">Opportunity Radar</span></span>
                </Link>
                <p className="footer-description">
                  An independent, community-reviewed directory. Every published opportunity must be backed by an official source.
                </p>
              </div>
              <div className="footer-column">
                <h3>Explore</h3>
                <Link href="/opportunities">Opportunity directory</Link>
                <Link href="/about">About the project</Link>
              </div>
              <div className="footer-column">
                <h3>Project</h3>
                <Link href="/methodology">Verification policy</Link>
                <Link href="/contribute">Contribute a listing</Link>
              </div>
              <div className="footer-column">
                <h3>Help</h3>
                <Link href="/report">Report an issue</Link>
                <Link href="/methodology">How it works</Link>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} OSS Opportunity Radar</span>
              <span>Independent project · No provider endorsement implied</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
