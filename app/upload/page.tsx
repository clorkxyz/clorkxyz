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

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setContent(await file.text());
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) file.text().then(setContent);
  }

  async function upload() {
    if (!content.trim() || !publicKey) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, wallet: publicKey }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e) { setError(String(e)); }
    setLoading(false);
  }

  async function registerOnChain() {
    if (!result?.hash || !publicKey) return;
    setMemoLoading(true);
    try {
      const res = await fetch('/api/onchain', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'memo', wallet: publicKey, hash: result.hash }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const provider = getProvider();
      if (!provider) throw new Error('wallet not connected');
      const signed = await provider.signAndSendTransaction(Transaction.from(Buffer.from(data.transaction, 'base64')));
      setMemoTx(signed.signature);
    } catch (e) { setError(`Registration failed: ${e}`); }
    setMemoLoading(false);
  }

  async function listOnMarketplace() {
    if (!result?.uploadId) return;
    const price = parseFloat(listPrice);
    if (isNaN(price) || price <= 0) return;
    try {
      await fetch('/api/marketplace', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uploadId: result.uploadId, priceSol: price }) });
      setListed(true);
    } catch { /* */ }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />
      <div className="max-w-[680px] mx-auto px-4 pt-20 pb-16">

        {!connected ? (
          <div className="bg-white rounded-2xl shadow-card p-10 text-center mt-4">
            <div className="w-14 h-14 rounded-full bg-[#e7f3ff] flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#1877F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-[#1c1e21] mb-2">Connect your wallet</h2>
            <p className="text-sm text-[#65676b] mb-6">Connect a Solana wallet to upload data and register ownership on-chain.</p>
            <button onClick={connect} className="px-6 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold rounded-lg transition-colors">
              Connect Wallet
            </button>
          </div>
        ) : !result ? (
          <div>
            <div className="bg-white rounded-2xl shadow-card p-6 mb-4">
              <h2 className="text-lg font-bold text-[#1c1e21] mb-1">Upload conversations</h2>
              <p className="text-sm text-[#65676b] mb-5">Drop a file or paste your AI conversation data below.</p>

              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
                  dragOver ? 'border-[#1877F2] bg-[#e7f3ff]' : 'border-[#e4e6eb] hover:border-[#bcc0c4] bg-[#f0f2f5]'
                }`}>
                <svg className="w-8 h-8 text-[#8a8d91] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <div className="text-sm font-semibold text-[#1c1e21]">Drop file here or click to browse</div>
                <div className="text-xs text-[#8a8d91] mt-1">.json, .txt, .md files supported</div>
                <input ref={fileRef} type="file" accept=".json,.txt,.md" onChange={handleFile} className="hidden" />
              </div>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-[#e4e6eb]" /><span className="text-xs text-[#8a8d91]">or paste</span><div className="flex-1 h-px bg-[#e4e6eb]" />
              </div>

              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Paste your AI conversations here..."
                className="w-full bg-[#f0f2f5] border border-[#e4e6eb] rounded-xl p-4 text-sm text-[#1c1e21] placeholder:text-[#8a8d91] focus:outline-none focus:border-[#1877F2] h-32 resize-none" />

              {content && <div className="mt-1 text-xs text-[#8a8d91]">{(content.length / 1024).toFixed(1)} KB</div>}

              <button onClick={upload} disabled={!content.trim() || loading}
                className="mt-4 w-full py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold rounded-lg transition-colors disabled:opacity-40">
                {loading ? 'Processing...' : 'Upload & Parse'}
              </button>

              {error && <p className="mt-3 text-xs text-[#fa3e3e]">{error}</p>}
            </div>

            <div className="bg-white rounded-2xl shadow-card p-5">
              <div className="text-sm font-semibold text-[#1c1e21] mb-3">How to export</div>
              <div className="space-y-2 text-sm text-[#65676b]">
                <div><span className="font-semibold text-[#1c1e21]">ChatGPT</span> — Settings → Data controls → Export data</div>
                <div><span className="font-semibold text-[#1c1e21]">Claude</span> — Settings → Account → Export Data</div>
                <div><span className="font-semibold text-[#1c1e21]">Any text</span> — Copy and paste directly above</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Result */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#31a24c]" />
                <span className="text-sm font-semibold text-[#31a24c]">Upload complete</span>
              </div>
              <p className="text-sm text-[#65676b] mb-4 italic">&quot;{result.clorkMessage}&quot;</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { l: 'Conversations', v: result.stats.conversations },
                  { l: 'Messages', v: result.stats.messages },
                  { l: 'Source', v: result.stats.source },
                  { l: 'Category', v: result.stats.category },
                ].map((s, i) => (
                  <div key={i} className="bg-[#f0f2f5] rounded-xl p-3">
                    <div className="text-[10px] text-[#8a8d91] uppercase">{s.l}</div>
                    <div className="text-sm font-bold text-[#1c1e21] mt-0.5">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="bg-[#f0f2f5] rounded-xl p-3">
                <div className="text-[10px] text-[#8a8d91] uppercase mb-1">SHA-256 Hash</div>
                <div className="text-xs text-[#1877F2] font-mono break-all">{result.hash}</div>
              </div>
            </div>

            {/* On-chain */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#1c1e21]">Step 1 — Register on Solana</span>
                {memoTx && <span className="text-xs px-2 py-0.5 rounded-full bg-[#e6f7e9] text-[#31a24c] font-semibold">Done</span>}
              </div>
              <p className="text-xs text-[#65676b] mb-3">Write your data hash to the blockchain for immutable proof of ownership.</p>
              {!memoTx ? (
                <button onClick={registerOnChain} disabled={memoLoading}
                  className="w-full py-2.5 bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#1c1e21] font-semibold text-sm rounded-lg transition-colors disabled:opacity-50">
                  {memoLoading ? 'Writing...' : 'Register On-Chain (~$0.001)'}
                </button>
              ) : (
                <a href={`https://solscan.io/tx/${memoTx}`} target="_blank" rel="noopener"
                  className="text-xs text-[#1877F2] font-mono break-all hover:underline block">{memoTx}</a>
              )}
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <span className="text-sm font-semibold text-[#1c1e21]">Step 2 — List on marketplace</span>
              <p className="text-xs text-[#65676b] mt-1 mb-4">Set your price. You receive 95% of every sale.</p>
              {!listed ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#f0f2f5] border border-[#e4e6eb] rounded-lg px-3 py-2.5">
                    <input type="number" step="0.01" min="0.01" value={listPrice} onChange={e => setListPrice(e.target.value)}
                      className="bg-transparent text-sm font-semibold text-[#1c1e21] w-16 focus:outline-none" />
                    <span className="text-xs text-[#8a8d91] ml-1">SOL</span>
                  </div>
                  <button onClick={listOnMarketplace}
                    className="flex-1 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-sm rounded-lg transition-colors">
                    List Now
                  </button>
                </div>
              ) : (
                <div className="bg-[#e7f3ff] rounded-xl p-4 text-center">
                  <div className="text-sm font-semibold text-[#1877F2]">Listed for {listPrice} SOL</div>
                  <Link href="/marketplace" className="text-xs text-[#65676b] mt-1 inline-block hover:underline">View in marketplace &rarr;</Link>
                </div>
              )}
            </div>

            <button onClick={() => { setResult(null); setContent(''); setMemoTx(null); setListed(false); setError(''); }}
              className="w-full py-3 bg-white shadow-card text-[#65676b] text-sm font-semibold rounded-2xl hover:bg-[#f0f2f5] transition-colors">
              Upload More
            </button>
            {error && <p className="text-xs text-[#fa3e3e] mt-2">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
