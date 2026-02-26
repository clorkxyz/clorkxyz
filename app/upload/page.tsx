'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Nav from '../../components/Nav';
import { useWallet } from '../providers';
import { Transaction } from '@solana/web3.js';

interface UploadResult {
  hash: string;
  stats: {
    conversations: number;
    messages: number;
    source: string;
    category: string;
    sizeBytes: number;
    categories: Record<string, number>;
  };
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
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) file.text().then(setContent);
  }

  async function upload() {
    if (!content.trim() || !publicKey) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, wallet: publicKey }),
      });
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
      const res = await fetch('/api/onchain', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'memo', wallet: publicKey, hash: result.hash }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const transaction = Transaction.from(Buffer.from(data.transaction, 'base64'));
      const provider = getProvider();
      if (!provider) throw new Error('wallet not connected');
      const signed = await provider.signAndSendTransaction(transaction);
      setMemoTx(signed.signature);
    } catch (e) { setError(`On-chain registration failed: ${e}`); }
    setMemoLoading(false);
  }

  async function listOnMarketplace() {
    if (!result?.uploadId) return;
    const price = parseFloat(listPrice);
    if (isNaN(price) || price <= 0) return;
    try {
      await fetch('/api/marketplace', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId: result.uploadId, priceSol: price }),
      });
      setListed(true);
    } catch { /* */ }
  }

  return (
    <div className="min-h-screen bg-grid">
      <Nav />
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Data</h1>
        <p className="text-sm text-zinc-400 mb-8">
          Upload your AI conversations. Clork will parse, hash, and prepare them for on-chain registration and marketplace listing.
        </p>

        {!connected ? (
          <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-sm text-zinc-500 mb-6">Connect your Solana wallet to upload and register data ownership.</p>
            <button onClick={connect}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-all">
              Connect Wallet
            </button>
          </div>
        ) : !result ? (
          <div>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
                dragOver ? 'border-green-500/50 bg-green-500/5' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/30'
              }`}>
              <svg className="w-8 h-8 text-zinc-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <div className="text-sm text-white font-medium mb-1">Drop file here or click to browse</div>
              <div className="text-xs text-zinc-500">ChatGPT conversations.json, Claude export, or plain text</div>
              <input ref={fileRef} type="file" accept=".json,.txt,.md" onChange={handleFile} className="hidden" />
            </div>

            <div className="my-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-xs text-zinc-600">or paste directly</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste your AI conversations here..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 h-40 resize-none font-mono"
            />

            {content && (
              <div className="mt-2 text-xs text-zinc-500">{(content.length / 1024).toFixed(1)} KB loaded</div>
            )}

            <button onClick={upload} disabled={!content.trim() || loading}
              className="mt-4 w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? 'Processing...' : 'Upload & Parse'}
            </button>

            {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

            <div className="mt-8 rounded-xl bg-zinc-900/30 border border-zinc-800/50 p-5">
              <div className="text-xs font-medium text-zinc-300 mb-3">How to export your data</div>
              <div className="space-y-2 text-xs text-zinc-500">
                <div><span className="text-green-400 font-medium">ChatGPT:</span> Settings → Data controls → Export data → Download conversations.json</div>
                <div><span className="text-green-400 font-medium">Claude:</span> Settings → Account → Export Data → Download and extract</div>
                <div><span className="text-green-400 font-medium">Plain text:</span> Copy any conversation and paste it above</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Result */}
            <div className="rounded-2xl bg-zinc-900/50 border border-green-500/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-400">Upload Complete</span>
              </div>

              <p className="text-xs text-zinc-400 mb-5 font-mono leading-relaxed">{result.clorkMessage}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Conversations', value: result.stats.conversations },
                  { label: 'Messages', value: result.stats.messages },
                  { label: 'Source', value: result.stats.source },
                  { label: 'Category', value: result.stats.category },
                ].map((s, i) => (
                  <div key={i} className="bg-zinc-950 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{s.label}</div>
                    <div className="text-sm font-semibold text-white mt-1">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-950 rounded-lg p-3">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">SHA-256 Hash</div>
                <div className="text-xs text-green-400 font-mono break-all">{result.hash}</div>
              </div>
            </div>

            {/* Step 1: On-chain */}
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-zinc-300 font-semibold">Step 1: Register On-Chain</div>
                  <div className="text-xs text-zinc-500 mt-1">Write your data hash to Solana for immutable proof of ownership.</div>
                </div>
                {memoTx && <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-400 font-medium">Confirmed</span>}
              </div>

              {!memoTx ? (
                <button onClick={registerOnChain} disabled={memoLoading}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm rounded-xl border border-zinc-700 transition-all disabled:opacity-50">
                  {memoLoading ? 'Writing to Solana...' : 'Register Hash On-Chain (~0.00005 SOL)'}
                </button>
              ) : (
                <div className="bg-zinc-950 rounded-lg p-3">
                  <div className="text-[10px] text-zinc-500 mb-1">Transaction</div>
                  <a href={`https://solscan.io/tx/${memoTx}`} target="_blank" rel="noopener"
                    className="text-xs text-green-400 font-mono break-all hover:underline">{memoTx}</a>
                </div>
              )}
            </div>

            {/* Step 2: List */}
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6">
              <div className="text-xs text-zinc-300 font-semibold mb-1">Step 2: List on Marketplace</div>
              <div className="text-xs text-zinc-500 mb-4">Set your price. Buyers pay in SOL. You receive 95%, Clork takes 5%.</div>

              {!listed ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
                    <input type="number" step="0.01" min="0.01" value={listPrice}
                      onChange={e => setListPrice(e.target.value)}
                      className="bg-transparent text-sm text-white font-semibold w-20 focus:outline-none" />
                    <span className="text-xs text-zinc-500 ml-1">SOL</span>
                  </div>
                  <button onClick={listOnMarketplace}
                    className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-all">
                    List on Marketplace
                  </button>
                </div>
              ) : (
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 text-center">
                  <div className="text-sm font-semibold text-green-400">Listed for {listPrice} SOL</div>
                  <Link href="/marketplace" className="text-xs text-zinc-400 mt-2 inline-block hover:text-white transition-colors">View Marketplace →</Link>
                </div>
              )}
            </div>

            <button onClick={() => { setResult(null); setContent(''); setMemoTx(null); setListed(false); setError(''); }}
              className="w-full py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm rounded-xl hover:text-white hover:border-zinc-600 transition-all">
              Upload More Data
            </button>

            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
