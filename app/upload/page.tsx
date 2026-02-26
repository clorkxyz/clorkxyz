'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Nav from '../../components/Nav';
import { useWallet } from '../providers';
import { Transaction } from '@solana/web3.js';

interface UploadResult {
  hash: string;
  stats: { conversations: number; messages: number; source: string; category: string; sizeBytes: number; categories: Record<string, number>; };
  clorkMessage: string;
  uploadId: number;
}

export default function Upload() {
  const { publicKey, connected, connect, getProvider } = useWallet();
  const [content, setContent] = useState('');
  const [result, setResult] = useState<UploadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [memoTx, setMemoTx] = useState<string | null>(null);
  const [memoLoading, setMemoLoading] = useState(false);
  const [error, setError] = useState('');
  const [listed, setListed] = useState(false);
  const [listPrice, setListPrice] = useState('0.1');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) { const f = e.target.files?.[0]; if (f) setContent(await f.text()); }
  function handleDrop(e: React.DragEvent) { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) f.text().then(setContent); }

  async function upload() {
    if (!content.trim() || !publicKey) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, wallet: publicKey }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error); setResult(data);
    } catch (e) { setError(String(e)); } setLoading(false);
  }

  async function registerOnChain() {
    if (!result?.hash || !publicKey) return; setMemoLoading(true);
    try {
      const res = await fetch('/api/onchain', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'memo', wallet: publicKey, hash: result.hash }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error);
      const provider = getProvider(); if (!provider) throw new Error('no wallet');
      const signed = await provider.signAndSendTransaction(Transaction.from(Buffer.from(data.transaction, 'base64')));
      setMemoTx(signed.signature);
    } catch (e) { setError(`Registration failed: ${e}`); } setMemoLoading(false);
  }

  async function listOnMarketplace() {
    if (!result?.uploadId) return; const price = parseFloat(listPrice); if (isNaN(price) || price <= 0) return;
    try { await fetch('/api/marketplace', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uploadId: result.uploadId, priceSol: price }) }); setListed(true); } catch { /* */ }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />
      <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">

        {!connected ? (
          <div className="rounded-2xl bg-white shadow-card p-12 text-center animate-scale-in">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg className="h-6 w-6 text-[#1877F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-[#1c1e21] mb-2">Connect your wallet</h2>
            <p className="text-sm text-[#65676b] mb-6">A Solana wallet is needed to upload data and register ownership on-chain.</p>
            <button onClick={connect} className="rounded-lg bg-[#1877F2] px-6 py-3 text-sm font-semibold text-white hover:bg-[#166fe5] transition-colors">Connect Wallet</button>
          </div>
        ) : !result ? (
          <div className="space-y-4 animate-fade-in-up">
            <div className="rounded-2xl bg-white shadow-card p-7">
              <h2 className="text-lg font-bold text-[#1c1e21] mb-1">Upload conversations</h2>
              <p className="text-sm text-[#65676b] mb-5">Drop a file or paste your AI conversation data.</p>

              <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => fileRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${dragOver ? 'border-[#1877F2] bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
                <svg className="mx-auto mb-2 h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <div className="text-sm font-semibold text-[#1c1e21]">Drop file here or click to browse</div>
                <div className="mt-1 text-xs text-[#8a8d91]">.json, .txt, .md files supported</div>
                <input ref={fileRef} type="file" accept=".json,.txt,.md" onChange={handleFile} className="hidden" />
              </div>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" /><span className="text-xs text-[#8a8d91]">or paste</span><div className="h-px flex-1 bg-gray-200" />
              </div>

              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Paste your AI conversations here..."
                className="h-32 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-[#1c1e21] placeholder:text-gray-400 focus:border-[#1877F2] focus:outline-none" />
              {content && <div className="mt-1 text-xs text-[#8a8d91]">{(content.length / 1024).toFixed(1)} KB</div>}

              <button onClick={upload} disabled={!content.trim() || loading}
                className="mt-4 w-full rounded-lg bg-[#1877F2] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#166fe5] disabled:opacity-40">
                {loading ? 'Processing...' : 'Upload & Parse'}
              </button>
              {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
            </div>

            <div className="rounded-2xl bg-white shadow-card p-6">
              <div className="mb-3 text-sm font-semibold text-[#1c1e21]">How to export</div>
              <div className="space-y-2 text-sm text-[#65676b]">
                <div><span className="font-semibold text-[#1c1e21]">ChatGPT</span> — Settings → Data controls → Export data</div>
                <div><span className="font-semibold text-[#1c1e21]">Claude</span> — Settings → Account → Export Data</div>
                <div><span className="font-semibold text-[#1c1e21]">Any text</span> — Copy and paste directly above</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
            <div className="rounded-2xl bg-white shadow-card p-7">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse-dot" />
                <span className="text-sm font-semibold text-green-600">Upload complete</span>
              </div>
              <p className="mb-4 text-sm italic text-[#65676b]">&quot;{result.clorkMessage}&quot;</p>
              <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[{ l: 'Conversations', v: result.stats.conversations }, { l: 'Messages', v: result.stats.messages }, { l: 'Source', v: result.stats.source }, { l: 'Category', v: result.stats.category }].map((s, i) => (
                  <div key={i} className="rounded-xl bg-gray-50 p-3">
                    <div className="text-[10px] uppercase text-[#8a8d91]">{s.l}</div>
                    <div className="mt-0.5 text-sm font-bold text-[#1c1e21]">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="mb-1 text-[10px] uppercase text-[#8a8d91]">SHA-256 Hash</div>
                <div className="break-all font-mono text-xs text-[#1877F2]">{result.hash}</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white shadow-card p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1c1e21]">Step 1 — Register on Solana</span>
                {memoTx && <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-600">Done</span>}
              </div>
              <p className="mb-3 text-xs text-[#65676b]">Write your hash to the blockchain for immutable ownership proof.</p>
              {!memoTx ? (
                <button onClick={registerOnChain} disabled={memoLoading}
                  className="w-full rounded-lg bg-gray-100 py-2.5 text-sm font-semibold text-[#1c1e21] transition-colors hover:bg-gray-200 disabled:opacity-50">
                  {memoLoading ? 'Writing...' : 'Register On-Chain (~$0.001)'}
                </button>
              ) : (
                <a href={`https://solscan.io/tx/${memoTx}`} target="_blank" rel="noopener" className="block break-all font-mono text-xs text-[#1877F2] hover:underline">{memoTx}</a>
              )}
            </div>

            <div className="rounded-2xl bg-white shadow-card p-6">
              <div className="mb-1 text-sm font-semibold text-[#1c1e21]">Step 2 — List on marketplace</div>
              <p className="mb-4 text-xs text-[#65676b]">Set your price. You receive 95% of every sale.</p>
              {!listed ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                    <input type="number" step="0.01" min="0.01" value={listPrice} onChange={e => setListPrice(e.target.value)}
                      className="w-16 bg-transparent text-sm font-semibold text-[#1c1e21] focus:outline-none" />
                    <span className="ml-1 text-xs text-[#8a8d91]">SOL</span>
                  </div>
                  <button onClick={listOnMarketplace} className="flex-1 rounded-lg bg-[#1877F2] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#166fe5]">List Now</button>
                </div>
              ) : (
                <div className="rounded-xl bg-blue-50 p-4 text-center">
                  <div className="text-sm font-semibold text-[#1877F2]">Listed for {listPrice} SOL</div>
                  <Link href="/marketplace" className="mt-1 inline-block text-xs text-[#65676b] hover:underline">View in marketplace &rarr;</Link>
                </div>
              )}
            </div>

            <button onClick={() => { setResult(null); setContent(''); setMemoTx(null); setListed(false); setError(''); }}
              className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-[#65676b] shadow-card transition-colors hover:bg-gray-50">
              Upload More
            </button>
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
