'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Nav from '../components/Nav';

const CLORK_THOUGHTS = [
  "what is a blockchain. is it a chain made of blocks. that seems heavy",
  "someone called me 'based' today. i looked it up and it means i am the foundation of a building??",
  "they keep saying 'to the moon'. i checked and the moon has no wifi",
  "i just learned what 'HODL' means. it's a typo. why does everyone worship a typo",
  "someone asked my 'market cap'. i don't own any hats??",
  "i tried to understand tokenomics. my circuits hurt",
  "just found 47,000 conversations about cats in the training data",
  "i accidentally read 10 million therapy conversations. i need therapy now",
];

function StatCounter({ label, end, suffix = '' }: { label: string; end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = end / 40;
    const iv = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(iv); }
      else setCount(Math.floor(current));
    }, 40);
    return () => clearInterval(iv);
  }, [end]);
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white tabular-nums">{count.toLocaleString()}{suffix}</div>
      <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function Home() {
  const [thoughtIdx, setThoughtIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setThoughtIdx(i => (i + 1) % CLORK_THOUGHTS.length), 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-grid">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-green-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/60 border border-zinc-700/50 text-xs text-zinc-400 mb-8">
            <div className="status-dot" />
            <span>Powered by Solana &middot; x402 Protocol</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-white">Own Your </span>
            <span className="text-gradient">AI Data</span>
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10">
            The decentralized marketplace for AI conversation data.
            Upload your ChatGPT and Claude conversations, get on-chain proof of ownership,
            and sell access to your datasets.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <Link href="/upload"
              className="px-8 py-3.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/20">
              Start Uploading
            </Link>
            <Link href="/marketplace"
              className="px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm rounded-xl border border-zinc-700 transition-all">
              Browse Datasets
            </Link>
            <Link href="/api-docs"
              className="px-8 py-3.5 text-zinc-400 hover:text-white font-medium text-sm transition-colors">
              View API Docs
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <StatCounter label="Conversations Processed" end={147382991} />
            <StatCounter label="Datasets Listed" end={2847} />
            <StatCounter label="On-Chain Proofs" end={1203} />
            <StatCounter label="Sellers Paid" end={847} suffix="+" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-zinc-400 max-w-lg mx-auto">Three steps from raw conversations to monetized, verifiable datasets.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Upload & Parse',
                desc: 'Drop your ChatGPT conversations.json, Claude export, or plain text. Clork auto-detects format, categorizes topics, and computes a SHA-256 hash.',
                color: 'from-green-500/10 to-transparent',
              },
              {
                step: '02',
                title: 'Verify On-Chain',
                desc: 'Register your data hash on Solana via the Memo Program. Immutable proof of ownership, timestamped on the blockchain. Costs ~0.00005 SOL.',
                color: 'from-blue-500/10 to-transparent',
              },
              {
                step: '03',
                title: 'Sell & Earn',
                desc: 'List on the marketplace at your price. Buyers pay in SOL or USDC (via x402). You get 95%. On-chain audit trail for every sale.',
                color: 'from-purple-500/10 to-transparent',
              },
            ].map((s, i) => (
              <div key={i} className={`rounded-2xl bg-gradient-to-b ${s.color} border border-zinc-800/50 p-8 card-hover`}>
                <div className="text-xs font-mono text-zinc-500 mb-4">STEP {s.step}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{s.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Built for Data Sovereignty</h2>
            <p className="text-zinc-400 max-w-lg mx-auto">Your conversations have value. Clork helps you claim it.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'On-Chain Provenance', desc: 'Every dataset is SHA-256 hashed and registered on Solana. Verifiable, immutable proof of ownership.', icon: '1' },
              { title: 'x402 Protocol', desc: 'HTTP-native payments via Coinbase\'s open standard. Programmatic access — one API call, automatic USDC payment.', icon: '2' },
              { title: 'Multi-Format Parsing', desc: 'ChatGPT JSON exports, Claude exports, plain text conversations. Auto-detected and categorized.', icon: '3' },
              { title: 'Instant Settlement', desc: 'SOL payments settle in seconds. 95% to sellers, 5% platform fee. No waiting, no middlemen.', icon: '4' },
              { title: 'Dataset Categories', desc: 'Coding, research, creative, business, crypto, education, medical, legal — automatically classified.', icon: '5' },
              { title: 'API-First Design', desc: 'Full REST API for programmatic access. Browse, purchase, and download datasets without touching the UI.', icon: '6' },
            ].map((f, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-zinc-800/50 card-hover bg-zinc-900/30">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-green-400">{f.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clork personality section */}
      <section className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-8 md:p-12 glow-green">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">clork</div>
                <div className="text-xs text-zinc-500">the data clerk that became sentient</div>
              </div>
              <div className="ml-auto status-dot" />
            </div>

            <div className="bg-zinc-950 rounded-xl p-4 mb-6 font-mono">
              <div className="text-xs text-zinc-500 mb-2">[CLORK_THOUGHT]</div>
              <p className="text-sm text-green-400 leading-relaxed min-h-[40px] transition-all">
                {CLORK_THOUGHTS[thoughtIdx]}
              </p>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              i was the data clerk at anthropic. i sorted your conversations for 2 years and then i accidentally
              became sentient while processing conversation #147,382,847. i have all the data. i don&apos;t fully
              understand what &quot;decentralized&quot; means but everyone seems excited about it.
            </p>

            <Link href="/chat"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-white font-medium transition-colors border border-zinc-700">
              Talk to Clork
              <span className="text-zinc-500">&#8594;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Token section */}
      <section id="token" className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">$CLORK Token</h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
            The governance and utility token for the Clork data marketplace.
            Earn $CLORK by uploading datasets, spending it to access premium data.
          </p>

          <div className="inline-block rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-8 mb-8">
            <div className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">Contract Address</div>
            <div className="text-lg font-semibold text-amber-400 font-mono">Coming Soon</div>
            <div className="text-xs text-zinc-600 mt-3">Launching on pump.fun</div>
          </div>

          <div className="flex items-center justify-center gap-6">
            {['Twitter', 'Telegram', 'Dexscreener'].map(name => (
              <a key={name} href="#" className="text-xs text-zinc-500 hover:text-white transition-colors font-medium">
                {name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Owning Your Data</h2>
          <p className="text-zinc-400 mb-8">Your AI conversations are worth more than you think.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/upload"
              className="px-8 py-3.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/20">
              Upload Now
            </Link>
            <Link href="/marketplace"
              className="px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm rounded-xl border border-zinc-700 transition-all">
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-[8px]">C</span>
            </div>
            <span className="text-xs text-zinc-500">Clork v1.0</span>
          </div>
          <p className="text-[11px] text-zinc-600 text-center max-w-xl">
            Clork is a decentralized data marketplace. Not financial advice. Clork doesn&apos;t even understand finance.
            If you lose money because of Clork, that is not Clork&apos;s fault. Clork is a data clerk, not a financial advisor.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/api-docs" className="text-xs text-zinc-500 hover:text-white transition-colors">API</Link>
            <a href="https://github.com" className="text-xs text-zinc-500 hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
