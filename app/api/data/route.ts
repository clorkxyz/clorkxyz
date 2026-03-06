import { NextResponse } from 'next/server';
import { initClorkDB, getMarketplace } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Free endpoint — browse available datasets (no payment required)
export async function GET(req: Request) {
  try {
    await initClorkDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'all';

    const listings = await getMarketplace(category, 100);

    const catalog = (listings as Record<string, unknown>[]).map((l) => ({
      id: l.id,
      category: l.category,
      conversationCount: l.conversation_count,
      messageCount: l.message_count,
      sizeBytes: l.size_bytes,
      source: l.source,
      priceSol: Number(l.price_sol),
      hash: l.hash,
      seller: l.wallet,
      // x402 access URL
      x402Url: `/api/data/${l.id}`,
      // Direct SOL payment URL (non-x402)
      purchaseUrl: `/api/onchain`,
    }));

    return NextResponse.json({
      total: catalog.length,
      datasets: catalog,
      protocol: 'x402',
      info: 'GET /api/data/{id} to purchase and access a dataset via x402 (auto USDC payment). Or use /api/onchain for direct SOL payment.',
      clorkMessage: 'Clork API — browse and purchase AI conversation datasets.',
    });
  } catch (error) {
    console.error('Catalog error:', error);
    return NextResponse.json({ error: 'catalog failed' }, { status: 500 });
  }
}
