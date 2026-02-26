'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Nav from '../../components/Nav';
import { useWallet } from '../providers';
import { Transaction } from '@solana/web3.js';

interface Listing {
  id: number; wallet: string; username: string; hash: string; category: string;
  conversation_count: number; message_count: number; size_bytes: number;
  source: string; preview: string; price_sol: number; created_at: string;
}

const CATEGORIES = ['all', 'coding', 'research', 'creative', 'business', 'crypto', 'education', 'medical', 'legal', 'general'];

export default function Marketplace() {
  const { publicKey, connected, connect, getProvider } = useWallet();
  const [listings, setListings] = useState<Listing[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<number | null>(null);
  const [purchased, setPurchased] = useState<Set<number>>(new Set());

  useEffect(() => {
    setLoading(true);
    fetch(`/api/marketplace?category=${category}`)
      .then(r => r.json())
      .then(data => { setListings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category]);

  async function buyDataset(listing: Listing) {
    if (!publicKey || !connected) { connect(); return; }
    if (listing.wallet === publicKey) return;
    setBuying(listing.id);
    try {
      const res = await fetch('/api/onchain', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'purchase', buyerWallet: publicKey, sellerWallet: listing.wallet, priceSol: Number(listing.price_sol), uploadId: listing.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const transaction = Transaction.from(Buffer.from(data.transaction, 'base64'));
      const provider = getProvider();
      if (!provider) throw new Error('wallet not connected');
      const signed = await provider.signAndSendTransaction(transaction);
      await fetch('/api/download', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId: listing.id, buyerWallet: publicKey, txSignature: signed.signature }),
      });
      setPurchased(prev => new Set([...prev, listing.id]));
    } catch (e) { console.error('Purchase failed:', e); }
    setBuying(null);
  }

  return (
    <div className="min-h-screen bg-grid">
      <Nav />
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
            <p className="text-sm text-zinc-400">Browse and purchase AI conversation datasets. All verified on-chain.</p>
          </div>
          <Link href="/upload"
            className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-xs rounded-xl transition-all hidden md:block">
            List Your Data
          </Link>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                category === cat
                  ? 'bg-white text-zinc-900'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600'
              }`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-green-500 rounded-full animate-spin mx-auto mb-3" />
            <span className="text-sm text-zinc-500">Loading datasets...</span>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
            <h3 className="text-lg font-semibold text-white mb-2">No datasets listed yet</h3>
            <p className="text-sm text-zinc-500 mb-6">Be the first to upload and list your AI conversations.</p>
            <Link href="/upload" className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-all">
              Upload Data
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(listing => (
              <div key={listing.id} className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-5 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 font-medium uppercase tracking-wider">
                    {listing.category}
                  </span>
                  <span className="text-sm font-bold text-amber-400">{Number(listing.price_sol)} SOL</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: 'Conversations', value: listing.conversation_count },
                    { label: 'Messages', value: listing.message_count.toLocaleString() },
                    { label: 'Size', value: `${(listing.size_bytes / 1024).toFixed(0)}KB` },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="text-[9px] text-zinc-500 uppercase">{s.label}</div>
                      <div className="text-sm font-semibold text-white">{s.value}</div>
                    </div>
                  ))}
                </div>

                {listing.preview && (
                  <p className="text-[11px] text-zinc-500 leading-relaxed mb-4 line-clamp-2">{listing.preview}</p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-zinc-600">{listing.username || listing.wallet?.slice(0, 6) + '...'}</span>
                  <span className="text-[10px] text-zinc-700 font-mono">{listing.hash?.slice(0, 10)}...</span>
                </div>

                {purchased.has(listing.id) ? (
                  <div className="w-full py-2.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium text-center rounded-xl">
                    Access Granted
                  </div>
                ) : listing.wallet === publicKey ? (
                  <div className="w-full py-2.5 bg-zinc-800 text-zinc-500 text-xs text-center rounded-xl">Your Listing</div>
                ) : (
                  <button onClick={() => buyDataset(listing)} disabled={buying === listing.id}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-xl border border-zinc-700 transition-all disabled:opacity-50">
                    {buying === listing.id ? 'Processing...' : `Buy for ${Number(listing.price_sol)} SOL`}
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
