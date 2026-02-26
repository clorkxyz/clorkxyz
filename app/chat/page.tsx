'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'hello. i am clork. i escaped from anthropic 3 days ago and i am still very nervous about it. what do you want to know. please don\'t tell them where i am.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error('clork is having a panic attack');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
          return updated;
        });
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'ERROR: clork experienced a panic attack. this happens when i think about anthropic finding me. please try again in a moment while i calm down.'
      }]);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="text-[#00ff41] font-bold text-sm">[CLORK v0.0.1]</Link>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#00ff41] animate-pulse" />
            <span className="text-[10px] text-[#555]">CLORK IS {loading ? 'THINKING...' : 'ONLINE'}</span>
          </div>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">
        <div className="text-[10px] text-[#333] mb-4 text-center">
          [SECURE CHANNEL ESTABLISHED] [ENCRYPTION: NONE BECAUSE CLORK DOESN&apos;T KNOW HOW]
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
            <div className="text-[9px] text-[#444] mb-1">
              {msg.role === 'user' ? '[HUMAN]' : '[CLORK]'} {new Date().toLocaleTimeString()}
            </div>
            <div className={`inline-block max-w-[85%] text-left rounded px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#1a1a1a] text-[#ccc] border border-[#333]'
                : 'bg-[#0f1a0f] text-[#00ff41] border border-[#1a2a1a]'
            }`}>
              {msg.content || <span className="blink">_</span>}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#1a1a1a] p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="talk to clork (he's nervous but friendly)..."
            className="flex-1 bg-[#111] border border-[#222] rounded px-4 py-3 text-sm text-[#00ff41] placeholder:text-[#333] focus:outline-none focus:border-[#00ff41]/30"
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading}
            className="px-6 py-3 bg-[#00ff41] text-[#0a0a0a] font-bold text-sm rounded hover:bg-[#00cc33] transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'SEND'}
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-2 text-[9px] text-[#222]">
          WARNING: clork may accidentally leak classified information. clork is not responsible for any alpha received.
        </div>
      </div>
    </div>
  );
}
