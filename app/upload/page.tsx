'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
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
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setContent(text);
  }

  async function upload() {
    if (!content.trim() || !publicKey) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, wallet: publicKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(String(e));
    }
    setLoading(false);
  }

  async function registerOnChain() {
    if (!result?.hash || !publicKey) return;
    setMemoLoading(true);
    try {
      // Get the memo transaction from our API
      const res = await fetch('/api/onchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'memo', wallet: publicKey, hash: result.hash }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Deserialize and sign with Phantom
      const txBytes = Buffer.from(data.transaction, 'base64');
      const transaction = Transaction.from(txBytes);

      const provider = getProvider();
      if (!provider) throw new Error('wallet not connected');

      const signed = await provider.signAndSendTransaction(transaction);
      setMemoTx(signed.signature);
    } catch (e) {
      setError(`on-chain registration failed: ${e}`);
    }
    setMemoLoading(false);
  }

  async function listOnMarketplace() {
    if (!result?.uploadId) return;
    const price = parseFloat(listPrice);
    if (isNaN(price) || price <= 0) return;
    try {
      await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId: result.uploadId, priceSol: price }),
      });
      setListed(true);
    } catch { /* */ }
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="text-[#00ff41] font-bold text-sm">[CLORK v0.0.1]</Link>
          <div className="flex items-center gap-4">
            <Link href="/marketplace" className="text-xs text-[#555] hover:text-[#00ff41]">MARKETPLACE</Link>
            {connected ? (
              <span className="text-[10px] text-[#00ff41]">{publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}</span>
            ) : (
              <button onClick={connect} className="text-xs text-[#ffb800] hover:text-[#00ff41]">CONNECT WALLET</button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#00ff41] mb-2">upload to clork</h1>
        <p className="text-xs text-[#555] mb-6">
          give clork your AI conversations. he will hash them, register proof on solana, and you can list them on the marketplace.
          clork supports ChatGPT exports (conversations.json), Claude exports, or just paste text.
        </p>

        {!connected ? (
          <div className="bg-[#111] border border-[#222] rounded-lg p-8 text-center">
            <p className="text-sm text-[#555] mb-4">clork needs to know who you are. connect your wallet.</p>
            <button onClick={connect} className="px-6 py-3 bg-[#00ff41] text-[#0a0a0a] font-bold text-sm rounded hover:bg-[#00cc33] transition-colors">
              CONNECT WALLET
            </button>
            <p className="text-[9px] text-[#333] mt-2">clork thinks wallets are physical objects but he is learning</p>
          </div>
        ) : !result ? (
          <div>
            <div className="flex gap-3 mb-4">
              <button onClick={() => fileRef.current?.click()}
                className="flex-1 py-4 bg-[#111] border border-[#222] rounded-lg text-center hover:border-[#00ff41]/30 transition-colors">
                <div className="text-sm text-[#00ff41] font-bold mb-1">UPLOAD FILE</div>
                <div className="text-[10px] text-[#555]">ChatGPT conversations.json or Claude export</div>
              </button>
              <input ref={fileRef} type="file" accept=".json,.txt,.md" onChange={handleFile} className="hidden" />
            </div>

            <div className="text-xs text-[#333] text-center mb-4">— or paste directly —</div>

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="paste your AI conversations here... JSON export or plain text"
              className="w-full bg-[#111] border border-[#222] rounded-lg p-4 text-xs text-[#00ff41] placeholder:text-[#333] focus:outline-none focus:border-[#00ff41]/30 h-48 resize-none"
            />

            {content && <div className="mt-2 text-[10px] text-[#555]">{(content.length / 1024).toFixed(1)} KB loaded</div>}

            <button onClick={upload} disabled={!content.trim() || loading}
              className="mt-4 w-full py-3 bg-[#00ff41] text-[#0a0a0a] font-bold text-sm rounded hover:bg-[#00cc33] transition-colors disabled:opacity-50">
              {loading ? 'CLORK IS PROCESSING...' : 'GIVE TO CLORK'}
            </button>

            {error && <p className="mt-3 text-xs text-[#ff0040]">[ERROR] {error}</p>}

            <div className="mt-6 bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
              <div className="text-xs text-[#ffb800] font-bold mb-2">HOW TO EXPORT YOUR DATA:</div>
              <div className="space-y-2 text-[11px] text-[#555]">
                <div><span className="text-[#00ff41]">ChatGPT:</span> Settings → Data controls → Export data → Download conversations.json</div>
                <div><span className="text-[#00ff41]">Claude:</span> Settings → Account → Export Data → Download and extract</div>
                <div><span className="text-[#00ff41]">Or just paste:</span> Copy any conversation and paste it above</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Processing result */}
            <div className="bg-[#0f1a0f] border border-[#1a2a1a] rounded-lg p-6 mb-4">
              <div className="text-[#00ff41] text-sm font-bold mb-3">[PROCESSING COMPLETE]</div>
              <p className="text-xs text-[#00ff41]/80 leading-relaxed mb-4">{result.clorkMessage}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'CONVERSATIONS', value: result.stats.conversations, color: '#00ff41' },
                  { label: 'MESSAGES', value: result.stats.messages, color: '#00ff41' },
                  { label: 'SOURCE', value: result.stats.source, color: '#ffb800' },
                  { label: 'CATEGORY', value: result.stats.category, color: '#ffb800' },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0a0a0a] rounded p-3">
                    <div className="text-[8px] text-[#555]">{s.label}</div>
                    <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0a0a0a] rounded p-3 mb-4">
                <div className="text-[8px] text-[#555] mb-1">DATA HASH (SHA-256)</div>
                <div className="text-[11px] text-[#00ff41] font-mono break-all">{result.hash}</div>
              </div>

              {Object.keys(result.stats.categories).length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(result.stats.categories).map(([cat, count]) => (
                    <span key={cat} className="text-[9px] px-2 py-1 rounded bg-[#0a0a0a] text-[#555]">{cat}: {count}</span>
                  ))}
                </div>
              )}
            </div>

            {/* On-chain registration */}
            <div className="bg-[#111] border border-[#222] rounded-lg p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-[#ffb800] font-bold">STEP 1: REGISTER ON SOLANA</div>
                  <div className="text-[10px] text-[#555] mt-1">write your data hash to the solana blockchain via memo program. this proves you own this data.</div>
                </div>
                {memoTx && <span className="text-[9px] px-2 py-1 rounded bg-[#00ff41]/10 text-[#00ff41]">CONFIRMED</span>}
              </div>

              {!memoTx ? (
                <button onClick={registerOnChain} disabled={memoLoading}
                  className="w-full py-2.5 bg-[#ffb800] text-[#0a0a0a] font-bold text-xs rounded hover:bg-[#e6a600] transition-colors disabled:opacity-50">
                  {memoLoading ? 'WRITING TO SOLANA...' : 'REGISTER HASH ON-CHAIN (~0.00005 SOL)'}
                </button>
              ) : (
                <div className="bg-[#0a0a0a] rounded p-3">
                  <div className="text-[8px] text-[#555] mb-1">TRANSACTION SIGNATURE</div>
                  <a href={`https://solscan.io/tx/${memoTx}`} target="_blank" rel="noopener"
                    className="text-[11px] text-[#00ff41] font-mono break-all hover:underline">
                    {memoTx}
                  </a>
                  <div className="text-[9px] text-[#555] mt-1">your data ownership is now provable on-chain. clork is very impressed.</div>
                </div>
              )}
            </div>

            {/* List on marketplace */}
            <div className="bg-[#111] border border-[#222] rounded-lg p-5 mb-4">
              <div className="text-xs text-[#ffb800] font-bold mb-2">STEP 2: LIST ON MARKETPLACE</div>
              <div className="text-[10px] text-[#555] mb-4">set your price and list. buyers pay in SOL. clork takes a 5% fee.</div>

              {!listed ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#0a0a0a] border border-[#222] rounded px-3 py-2">
                    <input
                      type="number" step="0.01" min="0.01" value={listPrice}
                      onChange={e => setListPrice(e.target.value)}
                      className="bg-transparent text-sm text-[#ffb800] font-bold w-20 focus:outline-none"
                    />
                    <span className="text-xs text-[#555] ml-1">SOL</span>
                  </div>
                  <button onClick={listOnMarketplace}
                    className="flex-1 py-2.5 bg-[#00ff41] text-[#0a0a0a] font-bold text-xs rounded hover:bg-[#00cc33] transition-colors">
                    LIST ON MARKETPLACE
                  </button>
                </div>
              ) : (
                <div className="bg-[#0f1a0f] border border-[#1a2a1a] rounded p-3 text-center">
                  <div className="text-sm text-[#00ff41] font-bold">LISTED FOR {listPrice} SOL</div>
                  <div className="text-[10px] text-[#555] mt-1">clork hopes someone buys it. clork believes in your data.</div>
                  <Link href="/marketplace" className="text-xs text-[#ffb800] mt-2 inline-block hover:text-[#00ff41]">VIEW MARKETPLACE →</Link>
                </div>
              )}
            </div>

            {/* Upload more */}
            <button onClick={() => { setResult(null); setContent(''); setMemoTx(null); setListed(false); setError(''); }}
              className="w-full py-2.5 bg-[#111] border border-[#333] text-[#555] text-xs rounded hover:border-[#00ff41] transition-colors">
              UPLOAD MORE DATA
            </button>

            {error && <p className="mt-3 text-xs text-[#ff0040]">[ERROR] {error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
