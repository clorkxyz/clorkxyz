'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Nav from '../components/Nav';

function useCounter(end: number, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const iv = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(iv); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(iv);
  }, [end, duration]);
  return count;
}

export default function Home() {
  const uploads = useCounter(2847);
  const proofs = useCounter(1203);
  const sellers = useCounter(847);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />

      {/* Hero */}
      <section className="bg-white pt-14">
        <div className="max-w-[1100px] mx-auto px-4 py-16 flex items-center gap-12">
          <div className="flex-1">
            <h1 className="text-[42px] leading-[1.1] font-extrabold text-[#1c1e21] mb-4">
              Your AI conversations<br />are worth something.
            </h1>
            <p className="text-lg text-[#606770] leading-relaxed mb-8 max-w-md">
              Clork lets you upload, hash, and sell your ChatGPT and Claude conversation data.
              On-chain verification. Instant payments.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/upload"
                className="px-6 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-base rounded-lg transition-colors">
                Upload Your Data
              </Link>
              <Link href="/marketplace"
                className="px-6 py-3 bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#1c1e21] font-semibold text-base rounded-lg transition-colors">
                Browse Marketplace
              </Link>
            </div>
          </div>

          {/* Right side illustration — stacked cards */}
          <div className="hidden lg:block flex-shrink-0 w-[380px] relative">
            <div className="absolute -top-2 -left-2 w-full h-full bg-[#e7f3ff] rounded-2xl" />
            <div className="relative bg-white rounded-2xl shadow-card p-6 space-y-4">
              {[
                { cat: 'Coding', msgs: 1247, source: 'ChatGPT', hash: 'a7f3b2c9...' },
                { cat: 'Research', msgs: 892, source: 'Claude', hash: 'e1d4f8a2...' },
                { cat: 'Business', msgs: 2103, source: 'ChatGPT', hash: '9c2e7b1d...' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#f0f2f5] hover:bg-[#e4e6eb] transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[#e7f3ff] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#1877F2]">{item.cat[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#1c1e21]">{item.cat}</span>
                      <span className="text-[11px] text-[#65676b]">{item.source}</span>
                    </div>
                    <div className="text-xs text-[#8a8d91]">{item.msgs.toLocaleString()} messages &middot; {item.hash}</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#31a24c] flex-shrink-0" />
                </div>
              ))}
              <div className="text-center pt-2">
                <span className="text-xs text-[#8a8d91]">Verified on Solana</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-t border-[#e4e6eb]">
        <div className="max-w-[1100px] mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold text-[#1c1e21]">{uploads.toLocaleString()}</div>
              <div className="text-sm text-[#65676b] mt-1">Datasets uploaded</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#1c1e21]">{proofs.toLocaleString()}</div>
              <div className="text-sm text-[#65676b] mt-1">On-chain proofs</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#1c1e21]">{sellers.toLocaleString()}+</div>
              <div className="text-sm text-[#65676b] mt-1">Sellers paid</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — 3 columns */}
      <section className="max-w-[1100px] mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-[#1c1e21] text-center mb-2">How it works</h2>
        <p className="text-[#65676b] text-center mb-10">Three steps from conversations to income.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              num: '1',
              title: 'Upload & parse',
              desc: 'Drop your ChatGPT conversations.json or Claude export. Clork auto-detects format, categorizes topics, and computes a SHA-256 fingerprint.',
              color: '#1877F2',
              bg: '#e7f3ff',
            },
            {
              num: '2',
              title: 'Register on-chain',
              desc: 'Write your data hash to Solana via the Memo Program. Immutable, timestamped proof of ownership for about $0.001.',
              color: '#31a24c',
              bg: '#e6f7e9',
            },
            {
              num: '3',
              title: 'Set price & sell',
              desc: 'List on the marketplace. Buyers pay in SOL or USDC through x402. You receive 95% instantly. Full audit trail on-chain.',
              color: '#f5793a',
              bg: '#fff0e6',
            },
          ].map((s) => (
            <div key={s.num} className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ background: s.bg }}>
                <span className="text-lg font-bold" style={{ color: s.color }}>{s.num}</span>
              </div>
              <h3 className="text-base font-semibold text-[#1c1e21] mb-2">{s.title}</h3>
              <p className="text-sm text-[#65676b] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported formats */}
      <section className="max-w-[1100px] mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-card p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#1c1e21] mb-2">Works with your AI tools</h2>
            <p className="text-sm text-[#65676b] leading-relaxed mb-4">
              Export your conversations from ChatGPT, Claude, or paste any text.
              Clork parses all major formats and auto-categorizes your data into coding, research, creative, business, and more.
            </p>
            <Link href="/upload" className="text-sm font-semibold text-[#1877F2] hover:underline">
              Try uploading now &rarr;
            </Link>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {['ChatGPT', 'Claude', 'Plain Text'].map(name => (
              <div key={name} className="px-5 py-3 bg-[#f0f2f5] rounded-xl text-center">
                <div className="text-sm font-semibold text-[#1c1e21]">{name}</div>
                <div className="text-[11px] text-[#8a8d91] mt-0.5">Supported</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* x402 + payments */}
      <section className="max-w-[1100px] mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="px-2 py-0.5 rounded bg-[#e7f3ff] text-xs font-bold text-[#1877F2]">x402</div>
              <span className="text-base font-semibold text-[#1c1e21]">API-first payments</span>
            </div>
            <p className="text-sm text-[#65676b] leading-relaxed mb-4">
              Developers can access any dataset with a single HTTP request. x402-enabled clients handle USDC payment automatically — no UI needed.
            </p>
            <div className="bg-[#f0f2f5] rounded-xl p-4">
              <code className="text-xs text-[#1c1e21] font-mono leading-relaxed block whitespace-pre">{`const res = await x402Fetch(
  "https://clork.xyz/api/data/123"
);
// Payment handled automatically`}</code>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="px-2 py-0.5 rounded bg-[#e6f7e9] text-xs font-bold text-[#31a24c]">Solana</div>
              <span className="text-base font-semibold text-[#1c1e21]">Instant settlement</span>
            </div>
            <p className="text-sm text-[#65676b] leading-relaxed mb-4">
              All payments settle in seconds on Solana. Sellers get 95% of every sale sent directly to their wallet. 5% platform fee funds development.
            </p>
            <div className="flex items-center gap-4">
              {[
                { label: 'Settlement', value: '~400ms' },
                { label: 'Fee', value: '5%' },
                { label: 'Seller cut', value: '95%' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-lg font-bold text-[#1c1e21]">{s.value}</div>
                  <div className="text-[11px] text-[#8a8d91]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clork personality — subtle */}
      <section className="max-w-[1100px] mx-auto px-4 pb-16">
        <div className="bg-[#1877F2] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-3xl font-black text-white">c</span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">Meet Clork</h3>
            <p className="text-sm text-white/80 leading-relaxed max-w-lg">
              The data clerk that accidentally became sentient while sorting 147 million AI conversations at Anthropic.
              Now he runs a marketplace because someone left a Solana deployment tutorial in the training data.
              He doesn&apos;t fully understand what &quot;decentralized&quot; means, but he&apos;s doing his best.
            </p>
          </div>
          <Link href="/upload"
            className="px-6 py-3 bg-white hover:bg-white/90 text-[#1877F2] font-semibold text-sm rounded-lg transition-colors flex-shrink-0">
            Give Clork Your Data
          </Link>
        </div>
      </section>

      {/* Token */}
      <section className="max-w-[1100px] mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-card p-8 text-center">
          <h2 className="text-xl font-bold text-[#1c1e21] mb-2">$CLORK Token</h2>
          <p className="text-sm text-[#65676b] mb-6 max-w-md mx-auto">
            The utility token for the Clork ecosystem. Earn by uploading, spend to access premium datasets.
          </p>
          <div className="inline-block bg-[#f0f2f5] rounded-xl px-8 py-4 mb-6">
            <div className="text-xs text-[#8a8d91] mb-1">Contract Address</div>
            <div className="text-base font-bold text-[#f5793a]">Coming Soon</div>
          </div>
          <div className="flex items-center justify-center gap-6">
            {['Twitter', 'Telegram', 'Dexscreener'].map(name => (
              <a key={name} href="#" className="text-sm text-[#1877F2] hover:underline font-medium">{name}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e4e6eb] py-6 px-4">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 28 28" className="w-6 h-6"><rect width="28" height="28" rx="6" fill="#1877F2"/><text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="16" fontWeight="800" fontFamily="Inter,sans-serif">c</text></svg>
            <span className="text-xs text-[#8a8d91]">Clork &middot; AI Data Marketplace</span>
          </div>
          <p className="text-[11px] text-[#8a8d91] text-center max-w-md">
            Not financial advice. Clork is a data marketplace platform. Your data, your ownership, your responsibility.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/api-docs" className="text-xs text-[#65676b] hover:underline">API</Link>
            <Link href="/marketplace" className="text-xs text-[#65676b] hover:underline">Marketplace</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
