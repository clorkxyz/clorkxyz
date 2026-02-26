'use client';

import { useState } from 'react';
import Nav from '../../components/Nav';

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/data',
    title: 'Browse Datasets',
    auth: 'None',
    desc: 'List all available datasets. Filter by category.',
    code: `curl https://clork.vercel.app/api/data
curl https://clork.vercel.app/api/data?category=coding`,
  },
  {
    method: 'GET',
    path: '/api/data/{id}',
    title: 'Access Dataset (x402)',
    auth: 'x402 USDC Payment',
    desc: 'Purchase and access a dataset via x402 protocol. Payment is automatic with an x402-enabled client.',
    code: `import { wrapFetch } from "@x402/fetch";
import { createSvmClient } from "@x402/svm/client";

const svmClient = createSvmClient({ signer: yourWallet });
const x402Fetch = wrapFetch(fetch, svmClient);

// Payment happens automatically
const res = await x402Fetch("https://clork.vercel.app/api/data/123");
const data = await res.json();`,
  },
  {
    method: 'POST',
    path: '/api/onchain',
    title: 'Direct SOL Payment',
    auth: 'Solana Signature',
    desc: 'Build a purchase transaction for direct SOL payment (non-x402 flow).',
    code: `// 1. Build purchase transaction
const res = await fetch("/api/onchain", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "purchase",
    buyerWallet: "YOUR_WALLET",
    sellerWallet: "SELLER_WALLET",
    priceSol: 0.1,
    uploadId: 123
  })
});
// 2. Sign returned transaction with wallet
// 3. POST to /api/download with txSignature`,
  },
  {
    method: 'POST',
    path: '/api/upload',
    title: 'Upload Conversations',
    auth: 'Wallet Address',
    desc: 'Upload and parse AI conversation data. Returns hash, stats, and upload ID.',
    code: `const res = await fetch("/api/upload", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: "<ChatGPT/Claude export or text>",
    wallet: "YOUR_SOLANA_WALLET"
  })
});`,
  },
  {
    method: 'GET',
    path: '/api/stats',
    title: 'Platform Stats',
    auth: 'None',
    desc: 'Get aggregate platform statistics.',
    code: `curl https://clork.vercel.app/api/stats`,
  },
];

function MethodBadge({ method }: { method: string }) {
  const colors = method === 'GET'
    ? 'bg-green-500/10 text-green-400 border-green-500/20'
    : 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${colors}`}>{method}</span>;
}

export default function ApiDocs() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-grid">
      <Nav />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-white mb-2">API Documentation</h1>
        <p className="text-sm text-zinc-400 mb-4">
          Programmatic access to the Clork data marketplace. Browse free, purchase via x402 or direct SOL.
        </p>

        {/* x402 highlight */}
        <div className="rounded-xl bg-gradient-to-r from-green-500/5 to-blue-500/5 border border-green-500/10 p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 font-semibold border border-green-500/20">x402</span>
            <h2 className="text-sm font-semibold text-white">HTTP-Native Payments</h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Clork supports the x402 open payment protocol. Make a standard GET request to any dataset endpoint — 
            if you have an x402-enabled client, payment in USDC on Solana happens automatically in-flight. No UI, no manual transactions.
          </p>
          <div className="flex gap-3">
            <a href="https://x402.org" target="_blank" rel="noopener"
              className="text-xs text-green-400 hover:text-green-300 font-medium transition-colors">x402.org →</a>
            <a href="https://github.com/coinbase/x402" target="_blank" rel="noopener"
              className="text-xs text-zinc-500 hover:text-white font-medium transition-colors">GitHub →</a>
          </div>
        </div>

        {/* Install */}
        <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-5 mb-8">
          <div className="text-xs text-zinc-300 font-medium mb-3">Quick Start</div>
          <div className="bg-zinc-950 rounded-lg p-4 font-mono text-xs text-green-400">
            npm install @x402/fetch @x402/svm
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-3">
          {ENDPOINTS.map((ep, i) => (
            <div key={i} className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden">
              <button onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full px-5 py-4 flex items-center gap-3 hover:bg-zinc-800/30 transition-colors text-left">
                <MethodBadge method={ep.method} />
                <span className="text-sm font-medium text-white flex-1">{ep.title}</span>
                <span className="text-xs text-zinc-600 font-mono hidden md:block">{ep.path}</span>
                <svg className={`w-4 h-4 text-zinc-500 transition-transform ${expanded === i ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {expanded === i && (
                <div className="px-5 pb-5 border-t border-zinc-800/30">
                  <div className="flex items-center gap-4 py-3 text-xs">
                    <span className="text-zinc-500">Auth: <span className="text-zinc-300">{ep.auth}</span></span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4">{ep.desc}</p>
                  <div className="bg-zinc-950 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-[11px] text-green-400 font-mono whitespace-pre leading-relaxed">{ep.code}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-8 rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Payment Methods</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-zinc-950 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-bold border border-green-500/20">x402</span>
                <span className="text-xs font-medium text-white">USDC on Solana</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">Automatic, in-flight payment via x402 protocol. Best for programmatic access and API integrations.</p>
            </div>
            <div className="bg-zinc-950 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">SOL</span>
                <span className="text-xs font-medium text-white">Direct SOL Payment</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">Connect Phantom wallet on the marketplace. 95% to seller, 5% platform fee. Best for manual purchases.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
