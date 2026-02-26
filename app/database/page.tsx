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
  useEffect(() => {
    const iv = setInterval(() => setVisible(v => Math.min(v + 1, FEED.length)), 1500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />
      <div className="max-w-[680px] mx-auto px-4 pt-20 pb-16">
        <h1 className="text-2xl font-bold text-[#1c1e21] mb-1">Live Feed</h1>
        <p className="text-sm text-[#65676b] mb-6">Recent uploads coming into the Clork database.</p>

        <div className="space-y-2 mb-8">
          {FEED.slice(0, visible).map((item, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#e7f3ff] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#1877F2]">{item.cat[0]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#1c1e21]">{item.cat}</span>
                  <span className="text-xs text-[#8a8d91]">via {item.source}</span>
                </div>
                <div className="text-xs text-[#8a8d91]">{item.msgs.toLocaleString()} messages</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#31a24c]" />
                <span className="text-xs text-[#8a8d91]">{item.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/upload" className="px-6 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-sm rounded-lg transition-colors">
            Add Your Data
          </Link>
        </div>
      </div>
    </div>
  );
}
