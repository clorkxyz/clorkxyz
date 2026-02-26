// Parse conversation exports from ChatGPT and Claude

export interface ParsedConversation {
  id: string;
  title: string;
  messages: { role: string; content: string }[];
  messageCount: number;
  source: 'chatgpt' | 'claude' | 'unknown';
  category: string;
}

export interface ParseResult {
  conversations: ParsedConversation[];
  totalMessages: number;
  source: string;
  sizeBytes: number;
}

// Auto-detect and categorize based on content
function categorize(messages: { role: string; content: string }[]): string {
  const text = messages.map(m => m.content).join(' ').toLowerCase();
  
  const keywords: Record<string, string[]> = {
    coding: ['function', 'const ', 'import ', 'class ', 'def ', 'return ', 'console.log', 'print(', 'error', 'debug', 'api', 'database', 'npm', 'git', 'react', 'python', 'javascript', 'typescript'],
    research: ['study', 'paper', 'research', 'analysis', 'data', 'findings', 'methodology', 'hypothesis', 'experiment'],
    creative: ['story', 'write', 'poem', 'creative', 'character', 'narrative', 'fiction', 'imagine'],
    business: ['revenue', 'startup', 'market', 'customer', 'strategy', 'growth', 'pitch', 'investor', 'product'],
    education: ['learn', 'explain', 'teach', 'homework', 'essay', 'course', 'student', 'exam'],
    crypto: ['solana', 'ethereum', 'bitcoin', 'token', 'blockchain', 'defi', 'nft', 'wallet', 'swap', 'dex'],
    medical: ['health', 'symptom', 'doctor', 'medical', 'treatment', 'diagnosis', 'patient'],
    legal: ['law', 'legal', 'contract', 'regulation', 'compliance', 'court', 'attorney'],
  };

  let bestCategory = 'general';
  let bestScore = 0;

  for (const [cat, words] of Object.entries(keywords)) {
    const score = words.filter(w => text.includes(w)).length;
    if (score > bestScore) { bestScore = score; bestCategory = cat; }
  }

  return bestCategory;
}

// Parse ChatGPT export (conversations.json)
function parseChatGPT(data: unknown): ParsedConversation[] {
  if (!Array.isArray(data)) return [];
  
  return data.map((conv: Record<string, unknown>, i: number) => {
    const messages: { role: string; content: string }[] = [];
    const title = (conv.title as string) || `Conversation ${i + 1}`;
    
    // ChatGPT format: mapping object with message nodes
    const mapping = conv.mapping as Record<string, Record<string, unknown>> | undefined;
    if (mapping) {
      for (const node of Object.values(mapping)) {
        const msg = node.message as Record<string, unknown> | undefined;
        if (msg && msg.content) {
          const content = msg.content as Record<string, unknown>;
          const parts = content.parts as string[] | undefined;
          const role = msg.role as string || (msg.author as Record<string, unknown>)?.role as string || 'unknown';
          if (parts && parts.length > 0 && role !== 'system') {
            messages.push({ role, content: parts.join('\n') });
          }
        }
      }
    }

    return {
      id: (conv.id as string) || `chatgpt-${i}`,
      title,
      messages,
      messageCount: messages.length,
      source: 'chatgpt' as const,
      category: categorize(messages),
    };
  }).filter(c => c.messageCount > 0);
}

// Parse Claude export (could be various formats)
function parseClaude(data: unknown): ParsedConversation[] {
  if (Array.isArray(data)) {
    // Array of conversations
    return data.map((conv: Record<string, unknown>, i: number) => {
      const messages: { role: string; content: string }[] = [];
      const chatMessages = (conv.chat_messages || conv.messages) as Record<string, unknown>[] | undefined;
      
      if (chatMessages && Array.isArray(chatMessages)) {
        for (const msg of chatMessages) {
          const role = (msg.sender || msg.role) as string || 'unknown';
          const content = (msg.text || msg.content) as string || '';
          if (content && role !== 'system') {
            messages.push({ role: role === 'human' ? 'user' : role, content: typeof content === 'string' ? content : JSON.stringify(content) });
          }
        }
      }

      return {
        id: (conv.uuid || conv.id) as string || `claude-${i}`,
        title: (conv.name || conv.title) as string || `Conversation ${i + 1}`,
        messages,
        messageCount: messages.length,
        source: 'claude' as const,
        category: categorize(messages),
      };
    }).filter(c => c.messageCount > 0);
  }
  return [];
}

// Parse plain text / markdown conversations
function parsePlainText(text: string): ParsedConversation[] {
  const messages: { role: string; content: string }[] = [];
  const lines = text.split('\n');
  let currentRole = 'user';
  let currentContent = '';

  for (const line of lines) {
    if (line.match(/^(Human|User|Me):/i)) {
      if (currentContent.trim()) messages.push({ role: currentRole, content: currentContent.trim() });
      currentRole = 'user';
      currentContent = line.replace(/^(Human|User|Me):\s*/i, '');
    } else if (line.match(/^(Assistant|AI|Claude|ChatGPT|Bot):/i)) {
      if (currentContent.trim()) messages.push({ role: currentRole, content: currentContent.trim() });
      currentRole = 'assistant';
      currentContent = line.replace(/^(Assistant|AI|Claude|ChatGPT|Bot):\s*/i, '');
    } else {
      currentContent += '\n' + line;
    }
  }
  if (currentContent.trim()) messages.push({ role: currentRole, content: currentContent.trim() });

  if (messages.length === 0) {
    messages.push({ role: 'user', content: text });
  }

  return [{
    id: `text-${Date.now()}`,
    title: 'Pasted conversation',
    messages,
    messageCount: messages.length,
    source: 'unknown' as const,
    category: categorize(messages),
  }];
}

export function parseConversations(input: string): ParseResult {
  const sizeBytes = new TextEncoder().encode(input).length;
  let conversations: ParsedConversation[] = [];
  let source = 'unknown';

  try {
    const data = JSON.parse(input);
    
    // Detect format
    if (Array.isArray(data) && data[0]?.mapping) {
      conversations = parseChatGPT(data);
      source = 'chatgpt';
    } else if (Array.isArray(data) && (data[0]?.chat_messages || data[0]?.uuid)) {
      conversations = parseClaude(data);
      source = 'claude';
    } else if (Array.isArray(data)) {
      // Try both
      conversations = parseChatGPT(data);
      if (conversations.length === 0) conversations = parseClaude(data);
      source = conversations.length > 0 ? conversations[0].source : 'unknown';
    }
  } catch {
    // Not JSON — parse as plain text
    conversations = parsePlainText(input);
    source = 'paste';
  }

  const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0);

  return { conversations, totalMessages, source, sizeBytes };
}
