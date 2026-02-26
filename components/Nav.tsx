'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '../app/providers';

const LINKS = [
  { href: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { href: '/marketplace', label: 'Marketplace', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { href: '/upload', label: 'Upload', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  { href: '/leaderboard', label: 'Leaderboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { href: '/api-docs', label: 'Developers', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
];

export default function Nav() {
  const pathname = usePathname();
  const { publicKey, connected, connect } = useWallet();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-nav">
      <div className="max-w-[1100px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-9 h-9">
            <rect width="36" height="36" rx="8" fill="#1877F2"/>
            <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="800" fontFamily="Inter,sans-serif">c</text>
          </svg>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center max-w-[500px]">
          {LINKS.map(l => {
            const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href}
                className={`flex items-center justify-center px-6 py-2.5 rounded-lg transition-colors relative group ${
                  active ? 'text-[#1877F2]' : 'text-[#65676b] hover:bg-[#f0f2f5]'
                }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={l.icon} />
                </svg>
                {active && <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-[#1877F2] rounded-t-full" />}
                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1c1e21] text-white text-[11px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {l.label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {connected ? (
            <div className="flex items-center gap-2 bg-[#e7f3ff] px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#31a24c]" />
              <span className="text-xs font-semibold text-[#1877F2]">{publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}</span>
            </div>
          ) : (
            <button onClick={connect}
              className="px-4 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-sm font-semibold rounded-lg transition-colors">
              Connect
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
