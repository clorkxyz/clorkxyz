'use client';

import { useState, useEffect } from 'react';
import Nav from '../../components/Nav';

interface Leader {
  wallet: string; username: string; total_uploads: number;
  total_conversations: number; total_messages: number;
  total_sales: number; total_earned: number;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard').then(r => r.json())
      .then(data => { setLeaders(Array.isArray(data) ? data : data.leaders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />
      <div className="max-w-[900px] mx-auto px-4 pt-20 pb-16">
        <h1 className="text-2xl font-bold text-[#1c1e21] mb-1">Leaderboard</h1>
        <p className="text-sm text-[#65676b] mb-6">Top contributors by uploads, data volume, and earnings.</p>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b border-[#e4e6eb] text-[11px] text-[#8a8d91] uppercase tracking-wide font-semibold">
            <div>#</div>
            <div>Contributor</div>
            <div className="text-right">Uploads</div>
            <div className="text-right">Conversations</div>
            <div className="text-right">Sales</div>
            <div className="text-right">Earned</div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-3 border-[#e4e6eb] border-t-[#1877F2] rounded-full animate-spin mx-auto" />
            </div>
          ) : leaders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-[#65676b]">No contributors yet. Be the first to upload.</p>
            </div>
          ) : leaders.map((leader, i) => (
            <div key={leader.wallet}
              className="grid grid-cols-6 gap-4 px-6 py-4 items-center border-b border-[#f0f2f5] hover:bg-[#f0f2f5] transition-colors">
              <div>
                {i < 3 ? (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-[#fef3c7] text-[#d97706]' :
                    i === 1 ? 'bg-[#f0f2f5] text-[#65676b]' :
                    'bg-[#ffedd5] text-[#ea580c]'
                  }`}>{i + 1}</div>
                ) : (
                  <span className="text-sm text-[#8a8d91] pl-2">{i + 1}</span>
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1c1e21]">{leader.username || 'Anonymous'}</div>
                <div className="text-[11px] text-[#8a8d91] font-mono">{leader.wallet.slice(0, 6)}...{leader.wallet.slice(-4)}</div>
              </div>
              <div className="text-sm text-[#1c1e21] text-right font-medium">{leader.total_uploads}</div>
              <div className="text-sm text-[#1c1e21] text-right">{leader.total_conversations?.toLocaleString()}</div>
              <div className="text-sm text-[#1c1e21] text-right">{leader.total_sales || 0}</div>
              <div className="text-sm text-[#1877F2] text-right font-semibold">{Number(leader.total_earned || 0).toFixed(2)} SOL</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
