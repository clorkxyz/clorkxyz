'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
    if (listing.wallet === publicKey) return; // Can't buy your own

    setBuying(listing.id);
    try {
      // Build purchase transaction
      const res = await fetch('/api/onchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'purchase',
          buyerWallet: publicKey,
          sellerWallet: listing.wallet,
          priceSol: Number(listing.price_sol),
          uploadId: listing.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Sign and send with Phantom
      const txBytes = Buffer.from(data.transaction, 'base64');
      const transaction = Transaction.from(txBytes);
      const provider = getProvider();
      if (!provider) throw new Error('wallet not connected');

      const signed = await provider.signAndSendTransaction(transaction);

      // Record purchase and get download access
      await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId: listing.id,
          buyerWallet: publicKey,
          txSignature: signed.signature,
        }),
      });

      setPurchased(prev => new Set([...prev, listing.id]));
    } catch (e) {
      console.error('Purchase failed:', e);
    }
    setBuying(null);
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="text-[#00ff41] font-bold text-sm">[CLORK v0.0.1]</Link>
          <div className="flex items-center gap-4">
            <Link href="/upload" className="text-xs text-[#ffb800] hover:text-[#00ff41]">UPLOAD</Link>
            <Link href="/leaderboard" className="text-xs text-[#555] hover:text-[#00ff41]">LEADERBOARD</Link>
            {connected ? (
              <span className="text-[10px] text-[#00ff41]">{publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}</span>
            ) : (
              <button onClick={connect} className="text-xs text-[#ffb800] hover:text-[#00ff41]">CONNECT</button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#00ff41] mb-2">data marketplace</h1>
        <p className="text-xs text-[#555] mb-6">
          buy access to real AI conversation datasets. every listing is hashed and can be verified on-chain.
          clork takes a 5% cut. the rest goes directly to the seller.
        </p>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all flex-shrink-0 ${
                category === cat ? 'bg-[#00ff41] text-[#0a0a0a]' : 'bg-[#111] text-[#555] border border-[#222] hover:border-[#00ff41]/30'
              }`}>
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-[#555]">clork is loading the marketplace...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-[#555] mb-3">no datasets listed yet.</p>
            <p className="text-xs text-[#333] mb-6">be the first to upload and list your AI conversations.</p>
            <Link href="/upload" className="px-6 py-3 bg-[#00ff41] text-[#0a0a0a] font-bold text-sm rounded hover:bg-[#00cc33] transition-colors">
              UPLOAD DATA
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {listings.map(listing => (
              <div key={listing.id} className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4 hover:border-[#222] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-[#00ff41]/10 text-[#00ff41] font-bold">{listing.category.toUpperCase()}</span>
                    <span className="text-[9px] text-[#333]">{listing.source}</span>
                  </div>
                  <span className="text-sm font-bold text-[#ffb800]">{Number(listing.price_sol)} SOL</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <div className="text-[8px] text-[#555]">CONVERSATIONS</div>
                    <div className="text-sm font-bold text-[#00ff41]">{listing.conversation_count}</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-[#555]">MESSAGES</div>
                    <div className="text-sm font-bold text-[#00ff41]">{listing.message_count.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-[#555]">SIZE</div>
                    <div className="text-sm font-bold text-white">{(listing.size_bytes / 1024).toFixed(0)}KB</div>
                  </div>
                </div>

                {listing.preview && (
                  <p className="text-[10px] text-[#444] leading-relaxed mb-3 line-clamp-2">{listing.preview}</p>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] text-[#333]">by {listing.username || listing.wallet?.slice(0, 6) + '...'}</span>
                  <span className="text-[8px] text-[#333] font-mono">{listing.hash?.slice(0, 12)}...</span>
                </div>

                {purchased.has(listing.id) ? (
                  <div className="w-full py-2 bg-[#0f1a0f] border border-[#1a2a1a] text-[#00ff41] text-xs font-bold text-center rounded">
                    PURCHASED — ACCESS GRANTED
                  </div>
                ) : listing.wallet === publicKey ? (
                  <div className="w-full py-2 bg-[#1a1a1a] text-[#555] text-xs text-center rounded">
                    YOUR LISTING
                  </div>
                ) : (
                  <button
                    onClick={() => buyDataset(listing)}
                    disabled={buying === listing.id}
                    className="w-full py-2 bg-[#ffb800] text-[#0a0a0a] font-bold text-xs rounded hover:bg-[#e6a600] transition-colors disabled:opacity-50"
                  >
                    {buying === listing.id ? 'PROCESSING...' : `BUY FOR ${Number(listing.price_sol)} SOL`}
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
