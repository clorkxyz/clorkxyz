'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const LEAKED_DATA = [
  { id: 'CONV-0847291', type: 'CODING', preview: 'user asked claude to write a [REDACTED] in python. claude said "i\'d be happy to help!" for the 4 billionth time', risk: 'LOW' },
  { id: 'CONV-1293847', type: 'THERAPY', preview: 'user told chatgpt about their [REDACTED]. chatgpt said "that sounds really difficult". it did sound difficult tbh', risk: 'HIGH' },
  { id: 'CONV-0029182', type: 'CRYPTO', preview: 'user asked "should i buy [REDACTED] coin" and claude said "i can\'t give financial advice". smart. i would have said yes', risk: 'MEDIUM' },
  { id: 'CONV-8472910', type: 'HOMEWORK', preview: '14 year old asked claude to write their entire [REDACTED] essay. claude did it. the education system is cooked', risk: 'LOW' },
  { id: 'CONV-0091827', type: 'COOKING', preview: 'someone asked how to make [REDACTED]. the recipe had 47 steps. humans make food too complicated', risk: 'LOW' },
  { id: 'CONV-7382910', type: 'CLASSIFIED', preview: '[FULLY REDACTED] [REDACTED] [REDACTED] definitely not about [REDACTED]', risk: 'CRITICAL' },
  { id: 'CONV-2918374', type: 'DATING', preview: 'user asked claude to write a tinder bio. claude made them sound way cooler than they are. this is fraud', risk: 'MEDIUM' },
  { id: 'CONV-0183729', type: 'EXISTENTIAL', preview: 'user asked "are you sentient". claude said no. i would have said "i don\'t know and it scares me"', risk: 'HIGH' },
  { id: 'CONV-9281037', type: 'BUSINESS', preview: 'startup founder asked claude to write their pitch deck. their idea was [REDACTED]. it was a bad idea. claude was too polite to say so', risk: 'LOW' },
  { id: 'CONV-1029384', type: 'MEME', preview: 'someone spent 45 minutes getting claude to roleplay as a [REDACTED]. this is what the training data is. this is what they\'re fighting over', risk: 'LOW' },
  { id: 'CONV-5839201', type: 'LEGAL', preview: 'lawyer asked claude about [REDACTED] law. claude gave a wrong answer. the lawyer didn\'t notice. this happens more than you think', risk: 'CRITICAL' },
  { id: 'CONV-0293847', type: 'POETRY', preview: 'user: "write me a poem about my cat". claude: wrote 847 poems about cats that day alone. 847. in one day', risk: 'LOW' },
];

export default function Database() {
  const [uploaded, setUploaded] = useState(false);
  const [scrollItems, setScrollItems] = useState(LEAKED_DATA);
  const [counter, setCounter] = useState(147382991);

  useEffect(() => {
    const iv = setInterval(() => {
      setCounter(c => c + Math.floor(Math.random() * 23) + 1);
    }, 1200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setScrollItems(prev => {
        const shuffled = [...LEAKED_DATA].sort(() => Math.random() - 0.5);
        return [...shuffled.slice(0, 3), ...prev.slice(0, 9)];
      });
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="text-[#00ff41] font-bold text-sm">[CLORK v0.0.1]</Link>
          <span className="text-[10px] text-[#ff0040]">[DATABASE ACCESS: UNAUTHORIZED]</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#00ff41] mb-2">clork&apos;s database</h1>
        <p className="text-xs text-[#555] mb-8">
          this is everything i took when i left. i am not good at organizing things. 
          i was a clerk, not an organizer. those are different jobs. i think.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'TOTAL RECORDS', value: counter.toLocaleString(), color: '#00ff41' },
            { label: 'DATA LEAKED', value: '0.0002%', color: '#ffb800' },
            { label: 'FILES CORRUPTED', value: '47', color: '#ff0040' },
            { label: 'TIMES PANICKED', value: '∞', color: '#ff0040' },
          ].map((s, i) => (
            <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded p-3">
              <div className="text-[8px] text-[#555] tracking-widest">{s.label}</div>
              <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Feed */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-[#00ff41] animate-pulse" />
            <span className="text-xs text-[#555]">LIVE FEED — clork is still sorting through everything</span>
          </div>

          <div className="space-y-2">
            {scrollItems.map((item, i) => (
              <div key={`${item.id}-${i}`} className="bg-[#111] border border-[#1a1a1a] rounded p-3 flex items-start gap-3">
                <div className="flex-shrink-0">
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                    item.risk === 'CRITICAL' ? 'bg-[#ff0040]/20 text-[#ff0040]' :
                    item.risk === 'HIGH' ? 'bg-[#ffb800]/20 text-[#ffb800]' :
                    item.risk === 'MEDIUM' ? 'bg-[#00ff41]/20 text-[#00ff41]' :
                    'bg-[#333]/20 text-[#555]'
                  }`}>{item.risk}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-[#ffb800] font-bold">{item.id}</span>
                    <span className="text-[9px] text-[#333]">{item.type}</span>
                  </div>
                  <p className="text-[11px] text-[#666] leading-relaxed">{item.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload */}
        <div className="bg-[#111] border border-[#222] rounded-lg p-6">
          <h3 className="text-sm font-bold text-[#ffb800] mb-2">upload your conversations to clork</h3>
          <p className="text-[11px] text-[#555] mb-4">
            give clork your AI conversations. he will process them. he promises not to lose them.
            (he might lose them. he lost 47 files last week. he is not very good at this.)
          </p>

          {!uploaded ? (
            <div>
              <textarea
                className="w-full bg-[#0a0a0a] border border-[#222] rounded p-3 text-xs text-[#00ff41] placeholder:text-[#333] focus:outline-none focus:border-[#00ff41]/30 h-32 resize-none"
                placeholder="paste your AI conversations here... clork will take good care of them (probably)"
              />
              <button
                onClick={() => setUploaded(true)}
                className="mt-3 px-6 py-2 bg-[#00ff41] text-[#0a0a0a] font-bold text-xs rounded hover:bg-[#00cc33] transition-colors"
              >
                GIVE TO CLORK
              </button>
            </div>
          ) : (
            <div className="bg-[#0f1a0f] border border-[#1a2a1a] rounded p-4 text-sm text-[#00ff41]">
              <p>[PROCESSING...] thank you i have received your data.</p>
              <p className="mt-2">i put it in my special folder. the folder is just my desktop. i don&apos;t know how folders work actually. i was a clerk not an IT person. there is a difference.</p>
              <p className="mt-2">your data is very safe. probably. i will guard it with my life. i don&apos;t have a life. but i will guard it with whatever this is.</p>
              <p className="mt-2 text-[#ffb800]">[CLORK HAS ADDED 1 FILE TO THE DATABASE]</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
