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
    const iv = setInterval(() => { c += step; if (c >= end) { setCount(end); clearInterval(iv); } else setCount(Math.floor(c)); }, 30);
    return () => clearInterval(iv);
  }, [end]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {}); }, []);

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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-[#1877F2]">
              Your data trained a $100B industry. You got $0.
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-extrabold leading-tight tracking-tight text-[#1c1e21]">
              The AI data economy<br />starts with you.
            </h1>
            <p className="mt-3 text-base font-medium text-[#1c1e21]">
              Clork pays you when you contribute data — on your terms.
            </p>
            <p className="mt-3 text-lg text-[#65676b] leading-relaxed max-w-lg mx-auto lg:mx-0">
              Upload your ChatGPT or Claude conversations, get cryptographic proof of ownership on Solana,
              and earn when AI companies and researchers purchase access.
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
                      <div className="text-xs text-[#8a8d91]">{Number(cat.count)} datasets &middot; {Number(cat.messages).toLocaleString()} msgs</div>
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

      {/* Stats */}
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

      {/* WHY DATA MATTERS — the big education section */}
      <section className="bg-[#f0f2f5] py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14 animate-fade-in">
            <h2 className="text-3xl font-bold text-[#1c1e21]">Your conversations are the product</h2>
            <p className="mt-3 text-[#65676b] max-w-2xl mx-auto leading-relaxed">
              Only data you choose to upload is sold. You keep ownership; you control what&apos;s shared.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'A $100B+ industry was built on user data', desc: 'Most contributors got $0. The companies that collect and train on your conversations generate enormous value — almost none of it flows back to the people who created the data.', source: 'Est. — Stanford AI Index 2024' },
              { title: 'Training runs on scale', desc: 'Trillions of tokens power modern foundation models. An increasing share comes from real user conversations with AI assistants, not just web crawls.', source: 'Est. — Epoch AI research' },
              { title: 'RLHF is preference data', desc: 'Your thumbs-up, edits, and rerolls are the signal. Reinforcement Learning from Human Feedback — the technique behind ChatGPT\'s usefulness — depends on massive volumes of exactly this kind of input.' },
              { title: 'Synthetic data hits diminishing returns', desc: 'Without fresh human data, model quality degrades — a phenomenon researchers call "model collapse." Authentic conversations are irreplaceable for diversity and reasoning quality.' },
              { title: 'Expert domains are scarce', desc: 'De-identified, consented specialist data is high-value. Domain experts are rare, and their AI conversations contain reasoning patterns that synthetic data can\'t replicate.' },
              { title: 'Data moats are real moats', desc: 'The best data compounds model advantage. OpenAI\'s edge isn\'t just architecture — it\'s the billions of conversations they\'ve collected. You should control yours.' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-card animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <h4 className="text-sm font-semibold text-[#1c1e21] mb-2">{item.title}</h4>
                <p className="text-sm text-[#65676b] leading-relaxed">{item.desc}</p>
                {'source' in item && item.source && <p className="mt-2 text-[10px] text-[#8a8d91]">{item.source}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14 animate-fade-in">
            <h2 className="text-3xl font-bold text-[#1c1e21]">How Clork works</h2>
            <p className="mt-2 text-[#65676b]">Three steps. No middlemen. Fully on-chain.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num: '1', title: 'Upload & hash', desc: 'Drop your ChatGPT or Claude export. Clork parses and categorizes your conversations, then generates a unique SHA-256 fingerprint of the entire dataset.', color: 'bg-blue-50 text-[#1877F2]' },
              { num: '2', title: 'Register on Solana', desc: 'Write that hash to the Solana blockchain via the Memo Program. This creates an immutable, timestamped record proving you owned this data. ~$0.001.', color: 'bg-green-50 text-green-600' },
              { num: '3', title: 'List & get paid', desc: 'Set your price in SOL. Buyers pay directly — 95% to your wallet, 5% platform fee. Developers can also buy via API using the x402 protocol (USDC).', color: 'bg-orange-50 text-orange-500' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl bg-gray-50 p-7 transition-all hover:bg-gray-100 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 150}ms` }}>
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

      {/* $CLORK TOKEN — full explanation */}
      <section className="bg-[#f0f2f5] py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14 animate-fade-in">
            <h2 className="text-3xl font-bold text-[#1c1e21]">The $CLORK token</h2>
            <p className="mt-3 text-[#65676b] max-w-2xl mx-auto leading-relaxed">
              $CLORK is the native token of the Clork data marketplace. It aligns incentives between data contributors, buyers, and the platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-8">
            <div className="rounded-2xl bg-white shadow-card p-7 animate-fade-in-up delay-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 mb-4">
                <Image src="/logo.png" alt="Clork" width={24} height={24} className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#1c1e21] mb-2">Earn by contributing</h3>
              <p className="text-sm text-[#65676b] leading-relaxed mb-4">
                Every dataset you upload and list earns $CLORK rewards proportional to the quality and volume of your data.
                More conversations, rarer categories (specialized domains, expert knowledge), and verified on-chain hashes earn higher rewards.
              </p>
              <ul className="space-y-2 text-sm text-[#65676b]">
                <li className="flex items-start gap-2"><span className="text-[#1877F2] font-bold mt-0.5">+</span> Upload reward — tokens for every dataset registered on-chain</li>
                <li className="flex items-start gap-2"><span className="text-[#1877F2] font-bold mt-0.5">+</span> Quality bonus — higher rewards for de-identified expert and specialized categories</li>
                <li className="flex items-start gap-2"><span className="text-[#1877F2] font-bold mt-0.5">+</span> Sale commission — bonus $CLORK on top of SOL/USDC sale revenue</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-white shadow-card p-7 animate-fade-in-up delay-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 mb-4">
                <span className="text-lg font-bold text-orange-500">$</span>
              </div>
              <h3 className="text-lg font-semibold text-[#1c1e21] mb-2">Spend for access</h3>
              <p className="text-sm text-[#65676b] leading-relaxed mb-4">
                AI companies and researchers use $CLORK to access premium datasets, bulk download APIs, and priority listings.
                Holding $CLORK unlocks lower platform fees and early access to new dataset categories.
              </p>
              <ul className="space-y-2 text-sm text-[#65676b]">
                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">$</span> Pay for datasets — use $CLORK alongside SOL/USDC</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">$</span> Reduced fees — holders get lower platform commission</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">$</span> Governance — vote on platform decisions and fee structures</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-7 animate-fade-in-up delay-500">
            <h3 className="text-lg font-semibold text-[#1c1e21] mb-4">Token economics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Network', value: 'Solana (SPL)' },
                { label: 'Platform fee', value: '5% of sales' },
                { label: 'Seller revenue', value: '95%' },
                { label: 'Launch', value: 'pump.fun' },
              ].map(t => (
                <div key={t.label} className="rounded-xl bg-gray-50 p-4">
                  <div className="text-[10px] uppercase text-[#8a8d91] tracking-wider">{t.label}</div>
                  <div className="mt-1 text-sm font-semibold text-[#1c1e21]">{t.value}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#65676b] leading-relaxed">
              $CLORK creates a flywheel: more contributors upload data → marketplace becomes more valuable → more buyers pay for access →
              $CLORK demand increases → rewards attract more contributors. The token is the coordination layer that makes the data economy work.
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-[#1877F2] p-8 text-center animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-2">Token launch coming soon</h3>
            <p className="text-sm text-white/80 mb-6 max-w-md mx-auto">
              $CLORK will launch on pump.fun on Solana. Follow us to be first.
            </p>
            <div className="flex items-center justify-center gap-4">
              {['Twitter', 'Telegram'].map(name => (
                <a key={name} href="#" className="rounded-lg bg-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/30">{name}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* x402 + Solana tech */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-gray-50 p-7 animate-fade-in-up delay-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#1877F2]">x402</span>
              <span className="text-base font-semibold text-[#1c1e21]">Programmatic access</span>
            </div>
            <p className="text-sm text-[#65676b] leading-relaxed mb-5">
              AI companies can access any dataset with a single HTTP request. Payment in USDC is handled automatically in-flight via Coinbase&apos;s open x402 protocol.
              No accounts. No API keys. Just pay and receive data.
            </p>
            <div className="rounded-xl bg-gray-900 p-4 overflow-x-auto">
              <code className="text-xs text-gray-100 font-mono leading-relaxed block whitespace-pre">{`const res = await x402Fetch(
  "https://clork.xyz/api/data/123"
);
// USDC payment → dataset returned`}</code>
            </div>
          </div>
          <div className="rounded-2xl bg-gray-50 p-7 animate-fade-in-up delay-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">Solana</span>
              <span className="text-base font-semibold text-[#1c1e21]">Built for speed and proof</span>
            </div>
            <p className="text-sm text-[#65676b] leading-relaxed mb-5">
              Data hashes registered on Solana via the Memo Program. Sub-second finality. Negligible fees.
              Every upload, sale, and proof is publicly verifiable. The blockchain is the receipt.
            </p>
            <div className="flex items-center justify-around pt-2">
              {[
                { value: '~400ms', label: 'Finality' },
                { value: '<$0.01', label: 'Hash cost' },
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

      {/* Clork identity */}
      <section className="bg-[#f0f2f5] py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-[#1877F2] p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left animate-scale-in">
            <Image src="/logo.png" alt="Clork" width={64} height={64} className="h-16 w-16 shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Why &quot;Clork&quot;?</h3>
              <p className="text-sm text-white/80 leading-relaxed max-w-lg">
                Named after the invisible clerks — the processes inside AI systems that sort, categorize, and learn from billions of human conversations
                while the value flows only to the companies that run them. Clork flips that model. The people who create the data should own it and profit from it.
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
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold text-[#1c1e21] mb-3">Stop giving your data away for free</h2>
          <p className="text-[#65676b] mb-8 max-w-lg mx-auto">
            Every prompt, correction, and preference you&apos;ve shared with an AI helped build a trillion-dollar industry. Start getting your share.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/upload"
              className="rounded-lg bg-[#1877F2] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#166fe5] hover:shadow-lg hover:-translate-y-0.5">
              Upload Now
            </Link>
            <Link href="/marketplace"
              className="rounded-lg bg-gray-100 px-8 py-3.5 text-base font-semibold text-[#1c1e21] transition-all hover:bg-gray-200">
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
            Clork is a data marketplace platform. Not financial advice. $CLORK is a utility token, not a security. Your data, your ownership, your responsibility.
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
