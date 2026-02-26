'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '../app/providers';

const LINKS = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/upload', label: 'Upload' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/chat', label: 'Chat' },
  { href: '/api-docs', label: 'API' },
];

export default function Nav() {
  const pathname = usePathname();
  const { publicKey, connected, connect } = useWallet();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">C</span>
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">clork</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                pathname === l.href
                  ? 'text-white bg-zinc-800'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {connected ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
              <div className="status-dot" />
              <span className="text-xs text-zinc-300 font-mono">{publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}</span>
            </div>
          ) : (
            <button onClick={connect}
              className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition-colors">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
