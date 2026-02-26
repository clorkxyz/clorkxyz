'use client';

import { useState } from 'react';
import Nav from '../../components/Nav';

const EPS = [
  { m: 'GET', p: '/api/data', t: 'Browse Datasets', a: 'None', d: 'List all marketplace datasets. Filter by category.', c: `curl https://clork.xyz/api/data\ncurl https://clork.xyz/api/data?category=coding` },
  { m: 'GET', p: '/api/data/{id}', t: 'Access Dataset (x402)', a: 'x402 USDC', d: 'Purchase and access a dataset via x402. Payment is automatic.', c: `import { wrapFetch } from "@x402/fetch";\nimport { createSvmClient } from "@x402/svm/client";\n\nconst client = createSvmClient({ signer: wallet });\nconst x402Fetch = wrapFetch(fetch, client);\n\nconst res = await x402Fetch("https://clork.xyz/api/data/123");\n// Payment happens automatically` },
  { m: 'POST', p: '/api/onchain', t: 'Direct SOL Payment', a: 'Solana wallet', d: 'Build a purchase transaction for manual SOL payment.', c: `fetch("/api/onchain", {\n  method: "POST",\n  body: JSON.stringify({\n    action: "purchase",\n    buyerWallet: "...",\n    sellerWallet: "...",\n    priceSol: 0.1,\n    uploadId: 123\n  })\n})` },
  { m: 'POST', p: '/api/upload', t: 'Upload Conversations', a: 'Wallet address', d: 'Upload and parse AI conversation data.', c: `fetch("/api/upload", {\n  method: "POST",\n  body: JSON.stringify({\n    content: "<export data>",\n    wallet: "YOUR_WALLET"\n  })\n})` },
  { m: 'GET', p: '/api/stats', t: 'Platform Stats', a: 'None', d: 'Get aggregate platform statistics.', c: `curl https://clork.xyz/api/stats` },
];

export default function ApiDocs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />
      <div className="mx-auto max-w-4xl px-6 pt-24 pb-16">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-[#1c1e21]">API Documentation</h1>
          <p className="mt-1 text-sm text-[#65676b]">Programmatic access to the Clork marketplace.</p>
        </div>

        {/* x402 banner */}
        <div className="mb-6 flex flex-col gap-6 rounded-2xl bg-[#1877F2] p-8 md:flex-row md:items-center animate-fade-in-up delay-100">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-white/20 px-2.5 py-1 text-xs font-bold text-white">x402</span>
              <span className="font-semibold text-white">HTTP-native payments</span>
            </div>
            <p className="text-sm leading-relaxed text-white/80">Access any dataset with a single GET request. x402 clients handle USDC payment on Solana automatically.</p>
          </div>
          <div className="flex shrink-0 gap-3">
            <a href="https://x402.org" target="_blank" rel="noopener" className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#1877F2] transition-colors hover:bg-white/90">x402.org</a>
            <a href="https://github.com/coinbase/x402" target="_blank" rel="noopener" className="rounded-lg bg-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/30">GitHub</a>
          </div>
        </div>

        <div className="mb-4 rounded-2xl bg-white p-5 shadow-card animate-fade-in delay-200">
          <div className="mb-2 text-sm font-semibold text-[#1c1e21]">Quick start</div>
          <div className="rounded-xl bg-gray-900 p-4 font-mono text-sm text-gray-100">npm install @x402/fetch @x402/svm</div>
        </div>

        <div className="space-y-2">
          {EPS.map((ep, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-card animate-fade-in-up" style={{ animationDelay: `${(i+3)*80}ms` }}>
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50">
                <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${ep.m === 'GET' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>{ep.m}</span>
                <span className="flex-1 text-sm font-semibold text-[#1c1e21]">{ep.t}</span>
                <span className="hidden font-mono text-xs text-[#8a8d91] md:block">{ep.p}</span>
                <svg className={`h-4 w-4 text-[#8a8d91] transition-transform ${open === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {open === i && (
                <div className="border-t border-gray-100 px-5 pb-5">
                  <div className="py-2 text-xs text-[#8a8d91]">Auth: <span className="font-medium text-[#1c1e21]">{ep.a}</span></div>
                  <p className="mb-3 text-sm text-[#65676b]">{ep.d}</p>
                  <div className="overflow-x-auto rounded-xl bg-gray-900 p-4"><pre className="whitespace-pre font-mono text-xs leading-relaxed text-gray-100">{ep.c}</pre></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-card animate-fade-in delay-500">
          <h3 className="mb-4 text-sm font-bold text-[#1c1e21]">Payment methods</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2"><span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-[#1877F2]">x402</span><span className="text-sm font-semibold text-[#1c1e21]">USDC on Solana</span></div>
              <p className="text-xs text-[#65676b]">Automatic in-flight payment. Best for programmatic access.</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2"><span className="rounded bg-green-50 px-2 py-0.5 text-xs font-bold text-green-600">SOL</span><span className="text-sm font-semibold text-[#1c1e21]">Direct payment</span></div>
              <p className="text-xs text-[#65676b]">Phantom wallet on marketplace. 95% to seller, 5% fee.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
