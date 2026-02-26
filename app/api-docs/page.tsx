'use client';

import { useState } from 'react';
import Nav from '../../components/Nav';

const ENDPOINTS = [
  { method: 'GET', path: '/api/data', title: 'Browse Datasets', auth: 'None', desc: 'List all marketplace datasets. Filter by category.', code: `curl https://clork.xyz/api/data\ncurl https://clork.xyz/api/data?category=coding` },
  { method: 'GET', path: '/api/data/{id}', title: 'Access Dataset (x402)', auth: 'x402 USDC', desc: 'Purchase and access a dataset via the x402 protocol. Payment is automatic with an x402 client.', code: `import { wrapFetch } from "@x402/fetch";\nimport { createSvmClient } from "@x402/svm/client";\n\nconst client = createSvmClient({ signer: wallet });\nconst x402Fetch = wrapFetch(fetch, client);\n\nconst res = await x402Fetch("https://clork.xyz/api/data/123");\n// Payment happens automatically` },
  { method: 'POST', path: '/api/onchain', title: 'Direct SOL Payment', auth: 'Solana wallet', desc: 'Build a purchase transaction for manual SOL payment flow.', code: `fetch("/api/onchain", {\n  method: "POST",\n  body: JSON.stringify({\n    action: "purchase",\n    buyerWallet: "...",\n    sellerWallet: "...",\n    priceSol: 0.1,\n    uploadId: 123\n  })\n})` },
  { method: 'POST', path: '/api/upload', title: 'Upload Conversations', auth: 'Wallet address', desc: 'Upload and parse AI conversation data.', code: `fetch("/api/upload", {\n  method: "POST",\n  body: JSON.stringify({\n    content: "<export data>",\n    wallet: "YOUR_WALLET"\n  })\n})` },
  { method: 'GET', path: '/api/stats', title: 'Platform Stats', auth: 'None', desc: 'Get aggregate platform statistics and leaderboard.', code: `curl https://clork.xyz/api/stats` },
];

export default function ApiDocs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />
      <div className="max-w-[900px] mx-auto px-4 pt-20 pb-16">
        <h1 className="text-2xl font-bold text-[#1c1e21] mb-1">API Documentation</h1>
        <p className="text-sm text-[#65676b] mb-6">Programmatic access to the Clork marketplace.</p>

        {/* x402 highlight */}
        <div className="bg-[#1877F2] rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-bold rounded">x402</span>
              <span className="text-white font-semibold">HTTP-native payments</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Access any dataset with a single GET request. x402-enabled clients handle USDC payment on Solana automatically. No UI, no manual transactions.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="https://x402.org" target="_blank" rel="noopener" className="px-4 py-2 bg-white text-[#1877F2] text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors">x402.org</a>
            <a href="https://github.com/coinbase/x402" target="_blank" rel="noopener" className="px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/30 transition-colors">GitHub</a>
          </div>
        </div>

        {/* Install */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
          <div className="text-sm font-semibold text-[#1c1e21] mb-2">Quick start</div>
          <div className="bg-[#f0f2f5] rounded-xl p-4 font-mono text-sm text-[#1c1e21]">
            npm install @x402/fetch @x402/svm
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-2">
          {ENDPOINTS.map((ep, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-5 py-4 flex items-center gap-3 hover:bg-[#f0f2f5] transition-colors text-left">
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  ep.method === 'GET' ? 'bg-[#e6f7e9] text-[#31a24c]' : 'bg-[#fff0e6] text-[#f5793a]'
                }`}>{ep.method}</span>
                <span className="text-sm font-semibold text-[#1c1e21] flex-1">{ep.title}</span>
                <span className="text-xs text-[#8a8d91] font-mono hidden md:block">{ep.path}</span>
                <svg className={`w-4 h-4 text-[#8a8d91] transition-transform ${open === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {open === i && (
                <div className="px-5 pb-5 border-t border-[#e4e6eb]">
                  <div className="py-2 text-xs text-[#8a8d91]">Auth: <span className="text-[#1c1e21] font-medium">{ep.auth}</span></div>
                  <p className="text-sm text-[#65676b] mb-3">{ep.desc}</p>
                  <div className="bg-[#1c1e21] rounded-xl p-4 overflow-x-auto">
                    <pre className="text-[12px] text-[#e4e6eb] font-mono whitespace-pre leading-relaxed">{ep.code}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-2xl shadow-card p-6 mt-4">
          <h3 className="text-sm font-bold text-[#1c1e21] mb-4">Payment methods</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#f0f2f5] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-[#e7f3ff] text-[#1877F2] text-xs font-bold rounded">x402</span>
                <span className="text-sm font-semibold text-[#1c1e21]">USDC on Solana</span>
              </div>
              <p className="text-xs text-[#65676b]">Automatic in-flight payment. Best for programmatic access.</p>
            </div>
            <div className="bg-[#f0f2f5] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-[#e6f7e9] text-[#31a24c] text-xs font-bold rounded">SOL</span>
                <span className="text-sm font-semibold text-[#1c1e21]">Direct payment</span>
              </div>
              <p className="text-xs text-[#65676b]">Phantom wallet on marketplace. 95% to seller, 5% fee.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
