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
      const res = await fetch('/api/onchain', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'purchase', buyerWallet: publicKey, sellerWallet: listing.wallet, priceSol: Number(listing.price_sol), uploadId: listing.id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const provider = getProvider();
      if (!provider) throw new Error('wallet not connected');
      const signed = await provider.signAndSendTransaction(Transaction.from(Buffer.from(data.transaction, 'base64')));
      await fetch('/api/download', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId: listing.id, buyerWallet: publicKey, txSignature: signed.signature }) });
      setPurchased(prev => new Set([...prev, listing.id]));
    } catch (e) { console.error('Purchase failed:', e); }
    setBuying(null);
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />
      <div className="max-w-[1100px] mx-auto px-4 pt-20 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1c1e21]">Marketplace</h1>
            <p className="text-sm text-[#65676b] mt-1">Browse and purchase verified AI conversation datasets.</p>
          </div>
          <Link href="/upload" className="px-4 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-sm font-semibold rounded-lg transition-colors hidden md:block">
            List Your Data
          </Link>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0 ${
                category === cat
                  ? 'bg-[#1877F2] text-white'
                  : 'bg-white text-[#65676b] shadow-card hover:bg-[#e4e6eb]'
              }`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-3 border-[#e4e6eb] border-t-[#1877F2] rounded-full animate-spin mx-auto" />
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-12 text-center">
            <h3 className="text-lg font-bold text-[#1c1e21] mb-2">No datasets yet</h3>
            <p className="text-sm text-[#65676b] mb-6">Be the first to upload and list your AI conversations.</p>
            <Link href="/upload" className="px-6 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-sm rounded-lg transition-colors">
              Upload Data
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#e7f3ff] text-[#1877F2] font-semibold">{listing.category}</span>
                  <span className="text-base font-bold text-[#1c1e21]">{Number(listing.price_sol)} SOL</span>
                </div>

                <div className="flex gap-4 mb-3">
                  {[
                    { l: 'Conversations', v: listing.conversation_count },
                    { l: 'Messages', v: listing.message_count.toLocaleString() },
                    { l: 'Size', v: `${(listing.size_bytes / 1024).toFixed(0)}KB` },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="text-[10px] text-[#8a8d91] uppercase">{s.l}</div>
                      <div className="text-sm font-semibold text-[#1c1e21]">{s.v}</div>
                    </div>
                  ))}
                </div>

                {listing.preview && <p className="text-xs text-[#8a8d91] leading-relaxed mb-3 line-clamp-2">{listing.preview}</p>}

                <div className="flex items-center justify-between mb-3 pt-2 border-t border-[#e4e6eb]">
                  <span className="text-xs text-[#8a8d91]">{listing.username || listing.wallet?.slice(0, 6) + '...'}</span>
                  <span className="text-[10px] text-[#bcc0c4] font-mono">{listing.hash?.slice(0, 10)}...</span>
                </div>

                {purchased.has(listing.id) ? (
                  <div className="w-full py-2.5 bg-[#e6f7e9] text-[#31a24c] text-sm font-semibold text-center rounded-lg">Access Granted</div>
                ) : listing.wallet === publicKey ? (
                  <div className="w-full py-2.5 bg-[#f0f2f5] text-[#8a8d91] text-sm text-center rounded-lg">Your Listing</div>
                ) : (
                  <button onClick={() => buyDataset(listing)} disabled={buying === listing.id}
                    className="w-full py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50">
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
