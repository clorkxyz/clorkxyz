import { NextResponse } from 'next/server';
import { getStats, initClorkDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initClorkDB();
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ totals: { uploads: 0, messages: 0, users: 0 }, categories: [] });
  }
}
