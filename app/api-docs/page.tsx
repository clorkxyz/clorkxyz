'use client';

import Link from 'next/link';

const CODE_EXAMPLES = {
  browse: `# Browse available datasets (free, no auth)
curl https://clork.vercel.app/api/data
curl https://clork.vercel.app/api/data?category=coding`,

  x402: `# Buy and access a dataset via x402 (auto USDC payment on Solana)
# x402 clients handle payment automatically
import { createSvmClient } from "@x402/svm/client";

const client = createSvmClient({ signer: yourSolanaWallet });
const response = await client.get("https://clork.vercel.app/api/data/123");
// Payment happens automatically, you get the dataset back`,

  x402Fetch: `# Using @x402/fetch for simpler integration
import { wrapFetch } from "@x402/fetch";
import { createSvmClient } from "@x402/svm/client";

const svmClient = createSvmClient({ signer: yourWallet });
const x402Fetch = wrapFetch(fetch, svmClient);

// Just fetch — payment is automatic
const res = await x402Fetch("https://clork.vercel.app/api/data/123");
const data = await res.json();`,

  directSol: `# Direct SOL payment (non-x402, manual flow)

# 1. Build purchase transaction
curl -X POST https://clork.vercel.app/api/onchain \\
  -H "Content-Type: application/json" \\
  -d '{
    "action": "purchase",
    "buyerWallet": "YOUR_WALLET",
    "sellerWallet": "SELLER_WALLET",
    "priceSol": 0.1,
    "uploadId": 123
  }'

# 2. Sign the returned transaction with your wallet
# 3. Submit tx signature to get access
curl -X POST https://clork.vercel.app/api/download \\
  -H "Content-Type: application/json" \\
  -d '{
    "uploadId": 123,
    "buyerWallet": "YOUR_WALLET",
    "txSignature": "TX_SIG"
  }'`,

  upload: `# Upload conversations (need wallet address)
curl -X POST https://clork.vercel.app/api/upload \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "<your ChatGPT/Claude export JSON or text>",
    "wallet": "YOUR_SOLANA_WALLET"
  }'`,

  stats: `# Get platform stats (free)
curl https://clork.vercel.app/api/stats

# Get leaderboard (free)
curl https://clork.vercel.app/api/leaderboard`,
};

export default function ApiDocs() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="text-[#00ff41] font-bold text-sm">[CLORK v0.0.1]</Link>
          <div className="flex items-center gap-4">
            <Link href="/upload" className="text-xs text-[#ffb800] hover:text-[#00ff41]">UPLOAD</Link>
            <Link href="/marketplace" className="text-xs text-[#555] hover:text-[#00ff41]">MARKETPLACE</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#00ff41] mb-2">clork api docs</h1>
        <p className="text-xs text-[#555] mb-8">
          clork wrote these docs himself. he is very proud. he does not fully understand what an API is
          but he was told it means other computers can talk to him.
        </p>

        {/* x402 section */}
        <div className="bg-[#111] border border-[#ffb800]/20 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded bg-[#ffb800]/10 text-[#ffb800] font-bold">x402</span>
            <h2 className="text-sm font-bold text-white">HTTP-Native Payments</h2>
          </div>
          <p className="text-xs text-[#555] mb-4">
            clork supports x402 — the open payment protocol by Coinbase.
            just make a GET request to any dataset endpoint. if you have an x402-enabled client,
            payment happens automatically in USDC on Solana. no UI needed.
          </p>
          <div className="bg-[#0a0a0a] rounded p-4 mb-2">
            <pre className="text-[11px] text-[#00ff41] whitespace-pre-wrap">{CODE_EXAMPLES.x402Fetch}</pre>
          </div>
          <p className="text-[9px] text-[#333]">x402 uses USDC on Solana. facilitator: facilitator.x402.org</p>
        </div>

        {/* Endpoints */}
        {[
          { title: 'Browse Datasets', method: 'GET', path: '/api/data', auth: 'None (free)', code: CODE_EXAMPLES.browse },
          { title: 'Access Dataset (x402)', method: 'GET', path: '/api/data/{id}', auth: 'x402 USDC payment', code: CODE_EXAMPLES.x402 },
          { title: 'Direct SOL Payment', method: 'POST', path: '/api/onchain + /api/download', auth: 'Solana signature', code: CODE_EXAMPLES.directSol },
          { title: 'Upload Conversations', method: 'POST', path: '/api/upload', auth: 'Wallet address', code: CODE_EXAMPLES.upload },
          { title: 'Stats & Leaderboard', method: 'GET', path: '/api/stats, /api/leaderboard', auth: 'None (free)', code: CODE_EXAMPLES.stats },
        ].map((ep, i) => (
          <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-lg p-5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${ep.method === 'GET' ? 'bg-[#00ff41]/10 text-[#00ff41]' : 'bg-[#ffb800]/10 text-[#ffb800]'}`}>
                {ep.method}
              </span>
              <span className="text-sm font-bold text-white">{ep.title}</span>
              <span className="text-[9px] text-[#333] font-mono ml-auto">{ep.path}</span>
            </div>
            <div className="text-[10px] text-[#555] mb-3">Auth: {ep.auth}</div>
            <div className="bg-[#0a0a0a] rounded p-3">
              <pre className="text-[10px] text-[#00ff41] whitespace-pre-wrap leading-relaxed">{ep.code}</pre>
            </div>
          </div>
        ))}

        {/* Payment methods summary */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-5 mb-6">
          <h2 className="text-sm font-bold text-white mb-3">payment methods</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#ffb800]/10 text-[#ffb800] font-bold flex-shrink-0 mt-0.5">x402</span>
              <div>
                <div className="text-xs text-white">USDC on Solana (automatic)</div>
                <div className="text-[10px] text-[#555]">use @x402/fetch or @x402/svm client. payment is handled in-flight. best for programmatic access.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#00ff41]/10 text-[#00ff41] font-bold flex-shrink-0 mt-0.5">SOL</span>
              <div>
                <div className="text-xs text-white">Direct SOL payment (Phantom)</div>
                <div className="text-[10px] text-[#555]">connect phantom on the marketplace page. click buy. 95% to seller, 5% to clork. best for humans.</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[9px] text-[#333] leading-relaxed">
          clork does not understand most of what is written on this page. clork was a data clerk not a software engineer.
          but clork was told this is important for &quot;developer experience&quot; and clork wants developers to have a good experience.
        </p>
      </div>
    </div>
  );
}
