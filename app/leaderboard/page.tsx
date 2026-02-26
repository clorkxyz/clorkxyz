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
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => { setLeaders(Array.isArray(data) ? data : data.leaders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-grid">
      <Nav />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-sm text-zinc-400 mb-8">Top data contributors ranked by uploads, conversations, and earnings.</p>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-green-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
            <h3 className="text-lg font-semibold text-white mb-2">No contributors yet</h3>
            <p className="text-sm text-zinc-500">Be the first to upload data and claim the top spot.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800/50 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-zinc-900/50 border-b border-zinc-800/50 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
              <div>Rank</div>
              <div>Contributor</div>
              <div className="text-right">Uploads</div>
              <div className="text-right">Conversations</div>
              <div className="text-right">Sales</div>
              <div className="text-right">Earned</div>
            </div>

            {leaders.map((leader, i) => (
              <div key={leader.wallet}
                className={`grid grid-cols-6 gap-4 px-5 py-4 items-center border-b border-zinc-800/30 hover:bg-zinc-900/30 transition-colors ${
                  i < 3 ? 'bg-zinc-900/20' : ''
                }`}>
                <div className="flex items-center gap-2">
                  {i < 3 ? (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? 'bg-amber-500/20 text-amber-400' :
                      i === 1 ? 'bg-zinc-400/20 text-zinc-300' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>{i + 1}</div>
                  ) : (
                    <span className="text-xs text-zinc-500 w-6 text-center">{i + 1}</span>
                  )}
                </div>
                <div>
                  <div className="text-sm text-white font-medium">{leader.username || 'Anonymous'}</div>
                  <div className="text-[10px] text-zinc-600 font-mono">{leader.wallet.slice(0, 6)}...{leader.wallet.slice(-4)}</div>
                </div>
                <div className="text-sm text-white text-right font-medium">{leader.total_uploads}</div>
                <div className="text-sm text-white text-right">{leader.total_conversations?.toLocaleString()}</div>
                <div className="text-sm text-white text-right">{leader.total_sales || 0}</div>
                <div className="text-sm text-amber-400 text-right font-semibold">{Number(leader.total_earned || 0).toFixed(2)} SOL</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
