import { NextResponse } from 'next/server';
import { getMarketplace, listUpload, initClorkDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await initClorkDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'all';
    const listings = await getMarketplace(category);
    return NextResponse.json(listings);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    await initClorkDB();
    const { uploadId, priceSol } = await req.json();
    if (!uploadId || !priceSol) {
      return NextResponse.json({ error: 'need uploadId and priceSol' }, { status: 400 });
    }
    await listUpload(uploadId, priceSol);
    return NextResponse.json({ success: true, message: 'clork has listed your data on the marketplace. clork hopes someone buys it.' });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json({ error: 'listing failed' }, { status: 500 });
  }
}
