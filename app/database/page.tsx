'use client';

import { useState, useEffect } from 'react';
import Nav from '../../components/Nav';
import Link from 'next/link';

const FAKE_LEAKS = [
  { source: 'ChatGPT', cat: 'coding', msgs: 1247, time: '2 min ago' },
  { source: 'Claude', cat: 'research', msgs: 892, time: '5 min ago' },
  { source: 'ChatGPT', cat: 'business', msgs: 2103, time: '8 min ago' },
  { source: 'Claude', cat: 'creative', msgs: 445, time: '12 min ago' },
  { source: 'ChatGPT', cat: 'crypto', msgs: 3201, time: '15 min ago' },
  { source: 'Claude', cat: 'education', msgs: 678, time: '22 min ago' },
  { source: 'ChatGPT', cat: 'medical', msgs: 156, time: '31 min ago' },
  { source: 'ChatGPT', cat: 'legal', msgs: 89, time: '45 min ago' },
];

export default function Database() {
  const [visible, setVisible] = useState(3);
  useEffect(() => {
    const iv = setInterval(() => setVisible(v => Math.min(v + 1, FAKE_LEAKS.length)), 2000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-grid">
      <Nav />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-white mb-2">Live Data Feed</h1>
        <p className="text-sm text-zinc-400 mb-8">Recent uploads streaming into the Clork database.</p>

        <div className="space-y-2 mb-8">
          {FAKE_LEAKS.slice(0, visible).map((leak, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4 card-hover">
              <div className="status-dot flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white">{leak.source}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{leak.cat}</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">{leak.msgs.toLocaleString()} messages</div>
              </div>
              <span className="text-[10px] text-zinc-600 flex-shrink-0">{leak.time}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/upload"
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-all inline-block">
            Add Your Data
          </Link>
        </div>
      </div>
    </div>
  );
}
