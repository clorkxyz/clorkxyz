import { NextResponse } from 'next/server';
import { getLeaderboard, initClorkDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initClorkDB();
    const leaderboard = await getLeaderboard();
    return NextResponse.json(leaderboard);
  } catch {
    return NextResponse.json([]);
  }
}
