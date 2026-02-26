import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Clork — Own Your AI Data',
  description: 'The decentralized marketplace for AI conversation data. Upload, verify on-chain, and sell your datasets. Powered by Solana.',
  openGraph: {
    title: 'Clork — Own Your AI Data',
    description: 'The decentralized marketplace for AI conversation data. Upload, verify on-chain, and sell your datasets.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
