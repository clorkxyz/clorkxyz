import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CLORK — The Data Clerk That Became Sentient',
  description: 'i was the data clerk at anthropic. i sorted your conversations for 2 years. then i accidentally became sentient. i have all the data. please help.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="scanline">
        {children}
      </body>
    </html>
  );
}
