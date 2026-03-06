'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Nav from '../../components/Nav';
import { useWallet } from '../providers';
import { Transaction, Connection } from '@solana/web3.js';

interface Listing {
  id: number; wallet: string; username: string; hash: string; category: string;
  conversation_count: number; message_count: number; size_bytes: number;
  source: string; preview: string; price_sol: number; created_at: string;
}

const CATS = ['all','coding','research','creative','business','crypto','education','medical','legal','general'];

export default function Marketplace() {
  const { publicKey, connected, connect, getProvider } = useWallet();
  const [listings, setListings] = useState<Listing[]>([]);
  const [cat, setCat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<number | null>(null);
  const [purchased, setPurchased] = useState<Set<number>>(new Set());
  const [buyError, setBuyError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/marketplace?category=${cat}`).then(r => r.json())
      .then(d => { setListings(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, [cat]);

  async function buy(l: Listing) {
    if (!publicKey || !connected) { connect(); return; }
    if (l.wallet === publicKey) return;
    if (!l.wallet || l.wallet.length < 32) { setBuyError('Seller wallet not available for this listing'); return; }
    setBuying(l.id);
    setBuyError(null);
    try {
      const res = await fetch('/api/onchain', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'purchase', buyerWallet: publicKey, sellerWallet: l.wallet, priceSol: Number(l.price_sol), uploadId: l.id }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Failed to create transaction');
      const provider = getProvider(); if (!provider) throw new Error('Wallet not found. Please install Phantom.');

      // Deserialize, sign via wallet, then send ourselves for reliability
      const tx = Transaction.from(Buffer.from(data.transaction, 'base64'));
      const signedTx = await provider.signTransaction(tx);
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com', 'confirmed');
      const signature = await connection.sendRawTransaction((signedTx as Transaction).serialize());
      await connection.confirmTransaction(signature, 'confirmed');

      await fetch('/api/download', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId: l.id, buyerWallet: publicKey, txSignature: signature }) });
      setPurchased(prev => new Set([...prev, l.id]));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Transaction failed';
      console.error('Purchase error:', e);
      if (msg.includes('User rejected')) setBuyError('Transaction cancelled');
      else setBuyError(msg);
    }
    setBuying(null);
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />
      <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-[#1c1e21]">Marketplace</h1>
            <p className="mt-1 text-sm text-[#65676b]">Browse and purchase verified AI conversation datasets.</p>
          </div>
          <Link href="/upload" className="hidden sm:block shrink-0 rounded-lg bg-[#1877F2] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#166fe5]">List Your Data</Link>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-1 animate-fade-in delay-200" style={{ scrollbarWidth: 'none' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${cat === c ? 'bg-[#1877F2] text-white' : 'bg-white text-[#65676b] shadow-card hover:bg-gray-100'}`}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {buyError && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
            <span>{buyError}</span>
            <button onClick={() => setBuyError(null)} className="text-red-400 hover:text-red-600 ml-4">&times;</button>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#1877F2]" /></div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow-card animate-scale-in">
            <h3 className="text-lg font-bold text-[#1c1e21] mb-2">No datasets yet</h3>
            <p className="mb-6 text-sm text-[#65676b]">Be the first to upload and list your AI conversations.</p>
            <Link href="/upload" className="rounded-lg bg-[#1877F2] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#166fe5]">Upload Data</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l, i) => (
              <div key={l.id} className={`rounded-2xl bg-white p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5 animate-fade-in-up`} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#1877F2]">{l.category}</span>
                  <span className="text-base font-bold text-[#1c1e21]">{Number(l.price_sol)} SOL</span>
                </div>
                <div className="mb-3 flex gap-4">
                  {[{ k: 'Conversations', v: l.conversation_count }, { k: 'Messages', v: l.message_count.toLocaleString() }, { k: 'Size', v: `${(l.size_bytes/1024).toFixed(0)}KB` }].map(s => (
                    <div key={s.k}><div className="text-[10px] uppercase text-[#8a8d91]">{s.k}</div><div className="text-sm font-semibold text-[#1c1e21]">{s.v}</div></div>
                  ))}
                </div>
                {l.preview && <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[#8a8d91]">{l.preview}</p>}
                <div className="mb-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-[#8a8d91]">{l.username || l.wallet?.slice(0,6)+'...'}</span>
                  <span className="font-mono text-[10px] text-gray-300">{l.hash?.slice(0,10)}...</span>
                </div>
                {purchased.has(l.id) ? (
                  <div className="w-full rounded-lg bg-green-50 py-2.5 text-center text-sm font-semibold text-green-600">Access Granted</div>
                ) : l.wallet === publicKey ? (
                  <div className="w-full rounded-lg bg-gray-50 py-2.5 text-center text-sm text-[#8a8d91]">Your Listing</div>
                ) : (
                  <button onClick={() => buy(l)} disabled={buying === l.id}
                    className="w-full rounded-lg bg-[#1877F2] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#166fe5] disabled:opacity-50">
                    {buying === l.id ? 'Processing...' : `Buy for ${Number(l.price_sol)} SOL`}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
