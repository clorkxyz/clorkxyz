import { NextRequest, NextResponse } from 'next/server';
import { withX402 } from '@x402/next';
import { x402Server, TREASURY_WALLET } from '@/lib/x402server';
import { SOLANA_MAINNET_CAIP2 } from '@/lib/x402server';
import { initClorkDB } from '@/lib/db';
import postgres from 'postgres';

export const dynamic = 'force-dynamic';

function getSql() {
  const url = process.env.CLORK_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('no db');
  return postgres(url, { ssl: 'require' });
}

// This handler is called AFTER payment is verified by x402
async function handler(req: NextRequest) {
  try {
    await initClorkDB();
    const sql = getSql();

    // Extract upload ID from URL
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 1];

    const uploads = await sql`SELECT * FROM clork_uploads WHERE id = ${id} AND listed = true`;
    if (uploads.length === 0) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      );
    }

    const upload = uploads[0];

    return NextResponse.json({
      success: true,
      error: '',
      dataset: {
        id: upload.id,
        hash: upload.hash,
        category: upload.category,
        conversationCount: upload.conversation_count,
        messageCount: upload.message_count,
        sizeBytes: upload.size_bytes,
        source: upload.source,
        preview: upload.preview,
        seller: upload.wallet,
        accessGranted: true,
        protocol: 'x402',
      },
      clorkMessage: 'Payment verified via x402. Access granted.',
    });
  } catch (error) {
    console.error('x402 data error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// Wrap with x402 — requires USDC payment on Solana
// Price is set per-dataset, default $0.10
export const GET = withX402(
  handler,
  {
    accepts: {
      scheme: 'exact',
      price: '$0.10',
      network: SOLANA_MAINNET_CAIP2,
      payTo: TREASURY_WALLET || '11111111111111111111111111111111',
    },
    description: 'Access AI conversation dataset via Clork marketplace',
  },
  x402Server,
);
