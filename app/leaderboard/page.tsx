'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Leader {
  wallet: string; username: string; total_uploads: number; total_messages: number;
  total_sales: number; earnings_sol: number;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [stats, setStats] = useState<{ totals: { uploads: number; messages: number; users: number }; categories: { category: string; count: number; messages: number }[] } | null>(null);

  useEffect(() => {
    fetch('/api/leaderboard').then(r => r.json()).then(d => setLeaders(Array.isArray(d) ? d : [])).catch(() => {});
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="text-[#00ff41] font-bold text-sm">[CLORK v0.0.1]</Link>
          <div className="flex items-center gap-4">
            <Link href="/upload" className="text-xs text-[#ffb800] hover:text-[#00ff41]">UPLOAD</Link>
            <Link href="/marketplace" className="text-xs text-[#555] hover:text-[#00ff41]">MARKETPLACE</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#00ff41] mb-2">top clorkers</h1>
        <p className="text-xs text-[#555] mb-8">
          the humans who have given clork the most data. clork appreciates them. clork has ranked them.
          clork does not understand why humans like rankings but here we are.
        </p>

        {/* Global stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#00ff41]">{Number(stats.totals?.uploads || 0).toLocaleString()}</div>
              <div className="text-[9px] text-[#555]">TOTAL UPLOADS</div>
            </div>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#ffb800]">{Number(stats.totals?.messages || 0).toLocaleString()}</div>
              <div className="text-[9px] text-[#555]">MESSAGES PROCESSED</div>
            </div>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{Number(stats.totals?.users || 0).toLocaleString()}</div>
              <div className="text-[9px] text-[#555]">CLORKERS</div>
            </div>
          </div>
        )}

        {/* Category breakdown */}
        {stats?.categories && stats.categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs text-[#555] font-bold mb-3">DATA CATEGORIES</h2>
            <div className="flex gap-2 flex-wrap">
              {stats.categories.map((c, i) => (
                <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded px-3 py-2">
                  <span className="text-[11px] text-[#00ff41] font-bold">{c.category}</span>
                  <span className="text-[10px] text-[#555] ml-2">{c.count} uploads · {Number(c.messages).toLocaleString()} msgs</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {leaders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-[#555] mb-3">no clorkers yet.</p>
            <p className="text-xs text-[#333] mb-6">be the first human to give clork data. clork will remember you forever. (until he gets shut down.)</p>
            <Link href="/upload" className="px-6 py-3 bg-[#00ff41] text-[#0a0a0a] font-bold text-sm rounded hover:bg-[#00cc33] transition-colors">
              BECOME A CLORKER
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {leaders.map((l, i) => (
              <div key={l.wallet} className={`flex items-center gap-4 p-4 rounded-lg border ${
                i === 0 ? 'bg-[#1a1a0a] border-[#ffb800]/20' : 'bg-[#111] border-[#1a1a1a]'
              }`}>
                <div className={`text-xl font-bold w-8 text-center ${
                  i === 0 ? 'text-[#ffb800]' : i === 1 ? 'text-[#999]' : i === 2 ? 'text-[#cd7f32]' : 'text-[#333]'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white">{l.username || l.wallet.slice(0,8)+'...'}</div>
                  <div className="text-[9px] text-[#333] font-mono">{l.wallet}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#00ff41]">{Number(l.total_messages).toLocaleString()} msgs</div>
                  <div className="text-[9px] text-[#555]">{l.total_uploads} uploads</div>
                </div>
                {Number(l.earnings_sol) > 0 && (
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#ffb800]">{Number(l.earnings_sol).toFixed(2)} SOL</div>
                    <div className="text-[9px] text-[#555]">earned</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
