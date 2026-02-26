'use client';

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
  const { publicKey, connected, connect } = useWallet();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-nav">
      <div className="mx-auto max-w-5xl px-6 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.png" alt="Clork" width={32} height={32} className="h-8 w-8" />
          <span className="text-lg font-bold text-[#1c1e21] hidden sm:block">clork</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => {
            const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'text-[#1877F2] bg-blue-50'
                    : 'text-[#65676b] hover:bg-gray-100'
                }`}>
                {l.label}
                {active && <div className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#1877F2]" />}
              </Link>
            );
          })}
        </div>

        <div className="shrink-0">
          {connected ? (
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-dot" />
              <span className="text-xs font-semibold text-[#1877F2] font-mono">{publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}</span>
            </div>
          ) : (
            <button onClick={connect}
              className="rounded-lg bg-[#1877F2] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#166fe5]">
              Connect
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
