'use client';

import { useState, useEffect } from 'react';
import Nav from '../../components/Nav';

interface Leader { wallet: string; username: string; total_uploads: number; total_conversations: number; total_messages: number; total_sales: number; total_earned: number; }

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard').then(r => r.json())
      .then(d => { setLeaders(Array.isArray(d) ? d : d.leaders || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />
      <div className="mx-auto max-w-4xl px-6 pt-24 pb-16">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-[#1c1e21]">Leaderboard</h1>
          <p className="mt-1 text-sm text-[#65676b]">Top contributors by uploads, data volume, and earnings.</p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-card animate-fade-in-up delay-200">
          <div className="grid grid-cols-6 gap-4 border-b border-gray-100 px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#8a8d91]">
            <div>#</div><div>Contributor</div><div className="text-right">Uploads</div><div className="text-right">Conversations</div><div className="text-right">Sales</div><div className="text-right">Earned</div>
          </div>

          {loading ? (
            <div className="py-16 text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#1877F2]" /></div>
          ) : leaders.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#65676b]">No contributors yet. Be the first to upload.</div>
          ) : leaders.map((l, i) => (
            <div key={l.wallet} className="grid grid-cols-6 items-center gap-4 border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50" style={{ animationDelay: `${i * 60}ms` }}>
              <div>
                {i < 3 ? (
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-amber-50 text-amber-600' : i === 1 ? 'bg-gray-100 text-gray-500' : 'bg-orange-50 text-orange-500'}`}>{i+1}</div>
                ) : <span className="pl-2 text-sm text-[#8a8d91]">{i+1}</span>}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1c1e21]">{l.username || 'Anonymous'}</div>
                <div className="font-mono text-[11px] text-[#8a8d91]">{l.wallet.slice(0,6)}...{l.wallet.slice(-4)}</div>
              </div>
              <div className="text-right text-sm font-medium text-[#1c1e21]">{l.total_uploads}</div>
              <div className="text-right text-sm text-[#1c1e21]">{l.total_conversations?.toLocaleString()}</div>
              <div className="text-right text-sm text-[#1c1e21]">{l.total_sales || 0}</div>
              <div className="text-right text-sm font-semibold text-[#1877F2]">{Number(l.total_earned || 0).toFixed(2)} SOL</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
