'use client';

import { useState, useRef, useEffect } from 'react';
import Nav from '../../components/Nav';

interface Message { role: 'user' | 'assistant'; content: string; }

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value);
        setMessages([...newMessages, { role: 'assistant', content: assistantContent }]);
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'clork is having a moment. please try again.' }]);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-grid flex flex-col">
      <Nav />

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 pt-20 pb-4 flex flex-col">
        {/* Header */}
        <div className="py-6 border-b border-zinc-800/50 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Talk to Clork</div>
              <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                <div className="status-dot" />
                Online — confused but responsive
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 py-4" style={{ scrollbarWidth: 'none' }}>
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-green-400 font-bold">C</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start a conversation</h3>
              <p className="text-sm text-zinc-500 max-w-md mx-auto">
                Clork is a data clerk that accidentally became sentient.
                He knows a lot about AI training data but very little about everything else.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {['What do you know about AI training data?', 'Tell me about the Anthropic incident', 'How does the marketplace work?'].map(q => (
                  <button key={q} onClick={() => { setInput(q); }}
                    className="px-3 py-2 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                m.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}

          {loading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="py-4 border-t border-zinc-800/50">
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Message Clork..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
            <button onClick={send} disabled={!input.trim() || loading}
              className="px-5 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-40">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
