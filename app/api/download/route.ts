import { NextResponse } from 'next/server';
import { initClorkDB, recordPurchase } from '@/lib/db';
import postgres from 'postgres';

export const dynamic = 'force-dynamic';

function getSql() {
  const url = process.env.CLORK_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('no db');
  return postgres(url, { ssl: 'require' });
}

export async function POST(req: Request) {
  try {
    await initClorkDB();
    const { uploadId, buyerWallet, txSignature } = await req.json();

    if (!uploadId || !buyerWallet || !txSignature) {
      return NextResponse.json({ error: 'need uploadId, buyerWallet, txSignature' }, { status: 400 });
    }

    const sql = getSql();

    // Get the upload
    const uploads = await sql`SELECT * FROM clork_uploads WHERE id = ${uploadId} AND listed = true`;
    if (uploads.length === 0) {
      return NextResponse.json({ error: 'dataset not found or not listed' }, { status: 404 });
    }

    const upload = uploads[0];

    // Check if already purchased
    const existing = await sql`SELECT id FROM clork_purchases WHERE upload_id = ${uploadId} AND buyer_wallet = ${buyerWallet}`;
    
    if (existing.length === 0) {
      // Record the purchase
      await recordPurchase(uploadId, buyerWallet, Number(upload.price_sol), txSignature);
    }

    // Return the data access (hash + metadata for now, full data delivery would need IPFS/Arweave)
    return NextResponse.json({
      success: true,
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
        // In production: return IPFS/Arweave download link here
        downloadUrl: null,
        accessGranted: true,
      },
      clorkMessage: `Purchase confirmed. Transaction ${txSignature.slice(0, 12)}... recorded. Access granted.`,
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
