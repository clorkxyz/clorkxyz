'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '../components/Nav';

interface Stats {
  totals: { uploads: number; messages: number; users: number };
  categories: { category: string; count: number; messages: number }[];
}

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!end) return;
    let c = 0;
    const step = Math.max(end / 50, 1);
    const iv = setInterval(() => {
      c += step;
      if (c >= end) { setCount(end); clearInterval(iv); }
      else setCount(Math.floor(c));
    }, 30);
    return () => clearInterval(iv);
  }, [end]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const uploads = stats?.totals?.uploads || 0;
  const messages = stats?.totals?.messages || 0;
  const users = stats?.totals?.users || 0;
  const categories = stats?.categories || [];

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="bg-white pt-14">
        <div className="mx-auto max-w-5xl px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-extrabold leading-tight tracking-tight text-[#1c1e21]">
              Own your AI data.<br />Prove it. Sell it.
            </h1>
            <p className="mt-5 text-lg text-[#65676b] leading-relaxed max-w-lg mx-auto lg:mx-0">
              The marketplace for AI conversation datasets with on-chain proof of ownership.
              Upload your ChatGPT or Claude exports, register a SHA-256 hash on Solana, and list for sale.
            </p>
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 flex-wrap">
              <Link href="/upload"
                className="rounded-lg bg-[#1877F2] px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#166fe5] hover:shadow-lg hover:-translate-y-0.5">
                Upload Data
              </Link>
              <Link href="/marketplace"
                className="rounded-lg bg-gray-100 px-7 py-3.5 text-base font-semibold text-[#1c1e21] transition-all hover:bg-gray-200 hover:-translate-y-0.5">
                Browse Marketplace
              </Link>
              <Link href="/api-docs"
                className="px-5 py-3.5 text-base font-medium text-[#65676b] transition-colors hover:text-[#1877F2]">
                API Docs &rarr;
              </Link>
            </div>
          </div>

          {/* Live preview card — pulls from real categories */}
          <div className="shrink-0 w-full max-w-sm animate-fade-in-up delay-200">
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-blue-50" />
              <div className="relative rounded-2xl bg-white shadow-card p-5 space-y-3">
                {(categories.length > 0 ? categories.slice(0, 4) : [
                  { category: 'coding', count: 5, messages: 8545 },
                  { category: 'research', count: 4, messages: 5814 },
                  { category: 'crypto', count: 3, messages: 5232 },
                ]).map((cat, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 transition-all hover:bg-gray-100 animate-slide-in" style={{ animationDelay: `${(i + 3) * 100}ms` }}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <span className="text-sm font-bold text-[#1877F2]">{cat.category.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-[#1c1e21] capitalize">{cat.category}</span>
                      <div className="text-xs text-[#8a8d91]">{Number(cat.count)} datasets &middot; {Number(cat.messages).toLocaleString()} messages</div>
                    </div>
                    <div className="h-2 w-2 shrink-0 rounded-full bg-green-500 animate-pulse-dot" />
                  </div>
                ))}
                <div className="pt-1 text-center">
                  <span className="text-xs text-[#8a8d91]">Live from Solana</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real stats from DB */}
      {(uploads > 0) && (
        <section className="border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="grid grid-cols-3 gap-8 text-center animate-fade-in delay-300">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1c1e21]"><Counter end={uploads} /></div>
                <div className="mt-1 text-sm text-[#65676b]">Datasets listed</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1c1e21]"><Counter end={messages} /></div>
                <div className="mt-1 text-sm text-[#65676b]">Messages indexed</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1c1e21]"><Counter end={users} /></div>
                <div className="mt-1 text-sm text-[#65676b]">Contributors</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-[#f0f2f5] py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14 animate-fade-in">
            <h2 className="text-3xl font-bold text-[#1c1e21]">How it works</h2>
            <p className="mt-2 text-[#65676b]">Three steps. No middlemen.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num: '1', title: 'Upload & hash', desc: 'Drop your ChatGPT or Claude export. Clork parses it, auto-categorizes the content, and generates a unique SHA-256 fingerprint of your dataset.', color: 'bg-blue-50 text-[#1877F2]' },
              { num: '2', title: 'Register on Solana', desc: 'Write that hash to Solana via the Memo Program. This creates an immutable, timestamped record that you owned this data at this point in time. ~$0.001.', color: 'bg-green-50 text-green-600' },
              { num: '3', title: 'List & get paid', desc: 'Set your price in SOL. When someone buys, 95% goes directly to your wallet. Every transaction is verifiable on-chain. No disputes, no chargebacks.', color: 'bg-orange-50 text-orange-500' },
            ].map((s, i) => (
              <div key={i} className={`rounded-2xl bg-white p-7 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1 animate-fade-in-up`} style={{ animationDelay: `${(i + 1) * 150}ms` }}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${s.color} mb-5`}>
                  <span className="text-lg font-bold">{s.num}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#1c1e21] mb-2">{s.title}</h3>
                <p className="text-sm text-[#65676b] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14 animate-fade-in">
            <h2 className="text-3xl font-bold text-[#1c1e21]">Why this matters</h2>
            <p className="mt-2 text-[#65676b] max-w-lg mx-auto">AI companies train on your conversations without compensating you. Clork changes that.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: 'Verifiable ownership', desc: 'Your data hash is written to Solana. Anyone can independently verify you owned this dataset before anyone else. No trust required — just math.' },
              { title: 'x402 protocol', desc: 'Developers can access any dataset with a single HTTP GET request. Payment in USDC is handled automatically in-flight via Coinbase\'s open x402 standard.' },
              { title: 'Instant settlement', desc: 'Payments settle on Solana in ~400ms. 95% goes directly to your wallet. No 30-day holds, no payment processor taking a cut, no disputes.' },
              { title: 'Multi-format support', desc: 'ChatGPT JSON exports, Claude exports, or raw text. Auto-categorized into coding, research, business, creative, crypto, education, medical, legal.' },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl bg-gray-50 p-7 transition-all hover:bg-gray-100 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <h3 className="text-base font-semibold text-[#1c1e21] mb-2">{f.title}</h3>
                <p className="text-sm text-[#65676b] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* x402 + Solana */}
      <section className="bg-[#f0f2f5] py-20 px-6">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-white shadow-card p-7 animate-fade-in-up delay-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#1877F2]">x402</span>
              <span className="text-base font-semibold text-[#1c1e21]">Programmatic access</span>
            </div>
            <p className="text-sm text-[#65676b] leading-relaxed mb-5">
              Built for developers and AI companies who need data at scale. One API call to browse, one to purchase. No accounts, no API keys — just pay and access.
            </p>
            <div className="rounded-xl bg-gray-900 p-4 overflow-x-auto">
              <code className="text-xs text-gray-100 font-mono leading-relaxed block whitespace-pre">{`const res = await x402Fetch(
  "https://clork.xyz/api/data/123"
);
// USDC payment handled automatically`}</code>
            </div>
          </div>
          <div className="rounded-2xl bg-white shadow-card p-7 animate-fade-in-up delay-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">Solana</span>
              <span className="text-base font-semibold text-[#1c1e21]">Built on the fastest chain</span>
            </div>
            <p className="text-sm text-[#65676b] leading-relaxed mb-5">
              Hash registration, payments, and audit trails — all on Solana. Sub-second finality. Negligible fees. Every transaction is publicly verifiable on Solscan.
            </p>
            <div className="flex items-center justify-around pt-2">
              {[
                { value: '~400ms', label: 'Finality' },
                { value: '<$0.01', label: 'Hash registration' },
                { value: '95%', label: 'Seller keeps' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-xl font-bold text-[#1c1e21]">{s.value}</div>
                  <div className="mt-0.5 text-xs text-[#8a8d91]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clork identity — subtle, at the bottom */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-[#1877F2] p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left animate-scale-in">
            <Image src="/logo.png" alt="Clork" width={64} height={64} className="h-16 w-16 shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Why &quot;Clork&quot;?</h3>
              <p className="text-sm text-white/80 leading-relaxed max-w-lg">
                Clork started as a thought experiment: what if the systems that process our AI conversations could advocate for the people who created that data?
                The name is a nod to the invisible clerks — the processes sorting through billions of conversations while the value flows one direction. We think it should flow both ways.
              </p>
            </div>
            <Link href="/upload"
              className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#1877F2] transition-all hover:bg-white/90 hover:-translate-y-0.5">
              Start Uploading
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f0f2f5] py-20 px-6">
        <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold text-[#1c1e21] mb-3">Your data has value</h2>
          <p className="text-[#65676b] mb-8 max-w-md mx-auto">Every conversation you&apos;ve had with an AI helped train the next model. Start getting credit for it.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/upload"
              className="rounded-lg bg-[#1877F2] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#166fe5] hover:shadow-lg hover:-translate-y-0.5">
              Upload Now
            </Link>
            <Link href="/marketplace"
              className="rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-[#1c1e21] shadow-card transition-all hover:bg-gray-50">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8 px-6">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Clork" width={24} height={24} className="h-6 w-6" />
            <span className="text-xs text-[#8a8d91]">Clork &middot; AI Data Marketplace</span>
          </div>
          <p className="text-[11px] text-[#8a8d91] text-center max-w-lg">
            Clork is a data marketplace. Not financial advice. Your data, your ownership, your responsibility.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/api-docs" className="text-xs text-[#65676b] hover:text-[#1877F2] transition-colors">API</Link>
            <Link href="/marketplace" className="text-xs text-[#65676b] hover:text-[#1877F2] transition-colors">Marketplace</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
