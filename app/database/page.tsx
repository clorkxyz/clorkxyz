'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Nav from '../../components/Nav';

interface Upload {
  id: number;
  category: string;
  source: string;
  conversationCount: number;
  messageCount: number;
  created_at: string;
}

export default function Database() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(d => { setUploads(d.datasets || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />
      <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-[#1c1e21]">Live Feed</h1>
          <p className="mt-1 text-sm text-[#65676b]">Recent uploads into the Clork database.</p>
        </div>

        {loading ? (
          <div className="py-16 text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#1877F2]" /></div>
        ) : uploads.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-card animate-scale-in">
            <h3 className="text-lg font-bold text-[#1c1e21] mb-2">No datasets yet</h3>
            <p className="mb-6 text-sm text-[#65676b]">Be the first to upload your AI conversations.</p>
            <Link href="/upload" className="rounded-lg bg-[#1877F2] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#166fe5]">Upload Data</Link>
          </div>
        ) : (
          <div className="mb-8 space-y-2">
            {uploads.map((item, i) => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card transition-all hover:shadow-card-hover animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <span className="text-sm font-bold text-[#1877F2]">{(item.category || 'G')[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#1c1e21] capitalize">{item.category || 'general'}</span>
                    <span className="text-xs text-[#8a8d91]">via {item.source || 'upload'}</span>
                  </div>
                  <div className="text-xs text-[#8a8d91]">{(item.messageCount || 0).toLocaleString()} messages</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-dot" />
                  <span className="text-xs text-[#8a8d91]">{item.created_at ? timeAgo(item.created_at) : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/upload" className="rounded-lg bg-[#1877F2] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#166fe5]">Add Your Data</Link>
        </div>
      </div>
    </div>
  );
}
