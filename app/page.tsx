'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '../components/Nav';

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let c = 0;
    const step = end / 50;
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
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="bg-white pt-14">
        <div className="mx-auto max-w-5xl px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold leading-tight tracking-tight text-[#1c1e21]">
              Your AI conversations<br />are worth something.
            </h1>
            <p className="mt-5 text-lg text-[#65676b] leading-relaxed max-w-lg mx-auto lg:mx-0">
              Upload your ChatGPT and Claude conversations, get on-chain proof of ownership on Solana, and sell access to your datasets.
            </p>
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 flex-wrap">
              <Link href="/upload"
                className="rounded-lg bg-[#1877F2] px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#166fe5] hover:shadow-lg hover:-translate-y-0.5">
                Upload Your Data
              </Link>
              <Link href="/marketplace"
                className="rounded-lg bg-gray-100 px-7 py-3.5 text-base font-semibold text-[#1c1e21] transition-all hover:bg-gray-200 hover:-translate-y-0.5">
                Browse Marketplace
              </Link>
            </div>
          </div>

          {/* Card preview */}
          <div className="shrink-0 w-full max-w-sm animate-fade-in-up delay-200">
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-blue-50" />
              <div className="relative rounded-2xl bg-white shadow-card p-5 space-y-3">
                {[
                  { cat: 'Coding', msgs: 1247, src: 'ChatGPT', hash: 'a7f3b2c9...' },
                  { cat: 'Research', msgs: 892, src: 'Claude', hash: 'e1d4f8a2...' },
                  { cat: 'Business', msgs: 2103, src: 'ChatGPT', hash: '9c2e7b1d...' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 transition-all hover:bg-gray-100 animate-slide-in delay-${(i + 3) * 100}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <span className="text-sm font-bold text-[#1877F2]">{item.cat[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#1c1e21]">{item.cat}</span>
                        <span className="text-xs text-[#8a8d91]">{item.src}</span>
                      </div>
                      <div className="text-xs text-[#8a8d91]">{item.msgs.toLocaleString()} messages &middot; <span className="font-mono">{item.hash}</span></div>
                    </div>
                    <div className="h-2 w-2 shrink-0 rounded-full bg-green-500 animate-pulse-dot" />
                  </div>
                ))}
                <div className="pt-1 text-center">
                  <span className="text-xs text-[#8a8d91]">Verified on Solana</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid grid-cols-3 gap-8 text-center animate-fade-in delay-300">
            {[
              { end: 2847, label: 'Datasets uploaded', suffix: '' },
              { end: 1203, label: 'On-chain proofs', suffix: '' },
              { end: 847, label: 'Sellers paid', suffix: '+' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1c1e21]"><Counter end={s.end} suffix={s.suffix} /></div>
                <div className="mt-1 text-sm text-[#65676b]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#f0f2f5] py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14 animate-fade-in">
            <h2 className="text-3xl font-bold text-[#1c1e21]">How it works</h2>
            <p className="mt-2 text-[#65676b]">Three steps from conversations to income.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num: '1', title: 'Upload & parse', desc: 'Drop your ChatGPT conversations.json or Claude export. Auto-detected, categorized, and SHA-256 hashed.', color: 'bg-blue-50 text-[#1877F2]' },
              { num: '2', title: 'Register on-chain', desc: 'Write your data hash to Solana via the Memo Program. Immutable, timestamped proof. Costs ~$0.001.', color: 'bg-green-50 text-green-600' },
              { num: '3', title: 'Set price & sell', desc: 'List at your price. Buyers pay in SOL or USDC via x402. You get 95%. Full on-chain audit trail.', color: 'bg-orange-50 text-orange-500' },
            ].map((s, i) => (
              <div key={i} className={`rounded-2xl bg-white p-7 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1 animate-fade-in-up delay-${(i + 1) * 200}`}>
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

      {/* Formats */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-white shadow-card p-8 flex flex-col md:flex-row items-center gap-10 animate-scale-in">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-[#1c1e21] mb-3">Works with your AI tools</h2>
              <p className="text-sm text-[#65676b] leading-relaxed mb-4">
                Export conversations from ChatGPT, Claude, or paste any text. Auto-categorized into coding, research, creative, business, and more.
              </p>
              <Link href="/upload" className="text-sm font-semibold text-[#1877F2] hover:underline">Try uploading now &rarr;</Link>
            </div>
            <div className="flex gap-3 shrink-0">
              {['ChatGPT', 'Claude', 'Plain Text'].map((name, i) => (
                <div key={name} className={`rounded-xl bg-gray-50 px-6 py-4 text-center transition-all hover:-translate-y-0.5 animate-fade-in-up delay-${(i + 1) * 100}`}>
                  <div className="text-sm font-semibold text-[#1c1e21]">{name}</div>
                  <div className="mt-0.5 text-xs text-[#8a8d91]">Supported</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* x402 + Solana */}
      <section className="bg-[#f0f2f5] py-20 px-6">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-white shadow-card p-7 animate-fade-in-up delay-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#1877F2]">x402</span>
              <span className="text-base font-semibold text-[#1c1e21]">API-first payments</span>
            </div>
            <p className="text-sm text-[#65676b] leading-relaxed mb-5">
              Developers access any dataset with a single HTTP request. x402-enabled clients handle USDC payment on Solana automatically.
            </p>
            <div className="rounded-xl bg-gray-900 p-4 overflow-x-auto">
              <code className="text-xs text-gray-100 font-mono leading-relaxed block whitespace-pre">{`const res = await x402Fetch(
  "https://clork.xyz/api/data/123"
);
// Payment handled automatically`}</code>
            </div>
          </div>
          <div className="rounded-2xl bg-white shadow-card p-7 animate-fade-in-up delay-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">Solana</span>
              <span className="text-base font-semibold text-[#1c1e21]">Instant settlement</span>
            </div>
            <p className="text-sm text-[#65676b] leading-relaxed mb-5">
              All payments settle in seconds. 95% goes directly to seller wallets. 5% platform fee funds development.
            </p>
            <div className="flex items-center justify-around pt-2">
              {[
                { value: '~400ms', label: 'Settlement' },
                { value: '5%', label: 'Platform fee' },
                { value: '95%', label: 'Seller cut' },
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

      {/* Clork banner */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-[#1877F2] p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left animate-scale-in">
            <Image src="/logo.png" alt="Clork" width={64} height={64} className="h-16 w-16 shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Meet Clork</h3>
              <p className="text-sm text-white/80 leading-relaxed max-w-lg">
                The data clerk that accidentally became sentient while sorting 147 million AI conversations at Anthropic.
                Now he runs a marketplace because someone left a Solana deployment tutorial in the training data.
              </p>
            </div>
            <Link href="/upload"
              className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#1877F2] transition-all hover:bg-white/90 hover:-translate-y-0.5">
              Give Clork Your Data
            </Link>
          </div>
        </div>
      </section>

      {/* Token */}
      <section className="bg-[#f0f2f5] py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-white shadow-card p-10 text-center animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#1c1e21] mb-3">$CLORK Token</h2>
            <p className="text-sm text-[#65676b] mb-8 max-w-md mx-auto">
              The utility token for the Clork ecosystem. Earn by uploading, spend to access premium datasets.
            </p>
            <div className="inline-block rounded-xl bg-gray-50 px-10 py-5 mb-8">
              <div className="text-xs text-[#8a8d91] mb-1">Contract Address</div>
              <div className="text-lg font-bold text-orange-500">Coming Soon</div>
            </div>
            <div className="flex items-center justify-center gap-6">
              {['Twitter', 'Telegram', 'Dexscreener'].map(name => (
                <a key={name} href="#" className="text-sm font-medium text-[#1877F2] hover:underline transition-colors">{name}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold text-[#1c1e21] mb-3">Start owning your data</h2>
          <p className="text-[#65676b] mb-8">Your AI conversations are more valuable than you think.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/upload"
              className="rounded-lg bg-[#1877F2] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#166fe5] hover:shadow-lg hover:-translate-y-0.5">
              Upload Now
            </Link>
            <Link href="/marketplace"
              className="rounded-lg bg-gray-100 px-8 py-3.5 text-base font-semibold text-[#1c1e21] transition-all hover:bg-gray-200">
              Explore Marketplace
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
            Not financial advice. Clork is a data marketplace. Your data, your ownership, your responsibility.
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
