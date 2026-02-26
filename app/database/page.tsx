'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Nav from '../../components/Nav';

const FEED = [
  { source: 'ChatGPT', cat: 'Coding', msgs: 1247, time: '2m ago' },
  { source: 'Claude', cat: 'Research', msgs: 892, time: '5m ago' },
  { source: 'ChatGPT', cat: 'Business', msgs: 2103, time: '8m ago' },
  { source: 'Claude', cat: 'Creative', msgs: 445, time: '12m ago' },
  { source: 'ChatGPT', cat: 'Crypto', msgs: 3201, time: '15m ago' },
  { source: 'Claude', cat: 'Education', msgs: 678, time: '22m ago' },
];

export default function Database() {
  const [visible, setVisible] = useState(3);
  useEffect(() => { const iv = setInterval(() => setVisible(v => Math.min(v + 1, FEED.length)), 1500); return () => clearInterval(iv); }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />
      <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-[#1c1e21]">Live Feed</h1>
          <p className="mt-1 text-sm text-[#65676b]">Recent uploads into the Clork database.</p>
        </div>

        <div className="mb-8 space-y-2">
          {FEED.slice(0, visible).map((item, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card transition-all hover:shadow-card-hover animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <span className="text-sm font-bold text-[#1877F2]">{item.cat[0]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#1c1e21]">{item.cat}</span>
                  <span className="text-xs text-[#8a8d91]">via {item.source}</span>
                </div>
                <div className="text-xs text-[#8a8d91]">{item.msgs.toLocaleString()} messages</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-dot" />
                <span className="text-xs text-[#8a8d91]">{item.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/upload" className="rounded-lg bg-[#1877F2] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#166fe5]">Add Your Data</Link>
        </div>
      </div>
    </div>
  );
}
