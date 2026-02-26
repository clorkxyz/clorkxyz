import { NextResponse } from 'next/server';
import { parseConversations } from '@/lib/parser';
import { addUpload, initClorkDB } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await initClorkDB();
    const { content, wallet } = await req.json();
    
    if (!content || !wallet) {
      return NextResponse.json({ error: 'clork needs content and a wallet address. he is not very smart but he knows that much' }, { status: 400 });
    }

    const parsed = parseConversations(content);
    
    if (parsed.conversations.length === 0) {
      return NextResponse.json({ error: 'clork could not find any conversations in this data. clork tried very hard. please check the format' }, { status: 400 });
    }

    // Hash the content for on-chain proof
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    
    // Get dominant category
    const catCounts: Record<string, number> = {};
    for (const c of parsed.conversations) {
      catCounts[c.category] = (catCounts[c.category] || 0) + 1;
    }
    const category = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'general';

    // Preview: first message snippet
    const preview = parsed.conversations[0]?.messages[0]?.content.slice(0, 200) || '';

    const uploadId = await addUpload({
      wallet,
      hash,
      category,
      conversationCount: parsed.conversations.length,
      messageCount: parsed.totalMessages,
      sizeBytes: parsed.sizeBytes,
      source: parsed.source,
      preview: preview.replace(/[^\x20-\x7E]/g, '').slice(0, 200),
    });

    return NextResponse.json({
      success: true,
      uploadId,
      hash,
      stats: {
        conversations: parsed.conversations.length,
        messages: parsed.totalMessages,
        source: parsed.source,
        category,
        sizeBytes: parsed.sizeBytes,
        categories: catCounts,
      },
      clorkMessage: `clork has processed ${parsed.totalMessages} messages from ${parsed.conversations.length} conversations. the dominant category is "${category}". clork put them in his special folder. your data hash is ${hash.slice(0, 16)}... — use this to prove ownership on-chain.`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'clork had a panic attack while processing your data. please try again' }, { status: 500 });
  }
}
