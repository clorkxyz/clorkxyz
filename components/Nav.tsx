'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useWallet } from '../app/providers';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/upload', label: 'Upload' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/api-docs', label: 'Developers' },
];

export default function Nav() {
  const pathname = usePathname();
  const { publicKey, connected, connect, disconnect } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-nav">
      <div className="mx-auto max-w-5xl px-6 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.png" alt="Clork" width={32} height={32} className="h-8 w-8" />
          <span className="text-lg font-bold text-[#1c1e21] hidden sm:block">clork</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => {
            const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'text-[#1877F2] bg-blue-50' : 'text-[#65676b] hover:bg-gray-100'
                }`}>
                {l.label}
                {active && <div className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#1877F2]" />}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {connected ? (
            <button onClick={disconnect} className="flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 transition-colors hover:bg-blue-100">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-dot" />
              <span className="text-xs font-semibold text-[#1877F2] font-mono">{publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}</span>
            </button>
          ) : (
            <button onClick={connect}
              className="rounded-lg bg-[#1877F2] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#166fe5]">
              Connect
            </button>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="h-5 w-5 text-[#1c1e21]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 pb-4 pt-2 shadow-lg">
          {LINKS.map(l => {
            const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className={`block py-3 text-sm font-medium border-b border-gray-50 last:border-0 ${
                  active ? 'text-[#1877F2]' : 'text-[#1c1e21]'
                }`}>
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
