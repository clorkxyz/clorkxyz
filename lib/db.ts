import postgres from 'postgres';

let sql: ReturnType<typeof postgres> | null = null;

function getSql() {
  if (!sql) {
    const url = process.env.CLORK_DATABASE_URL || process.env.DATABASE_URL;
    if (!url) throw new Error('clork has no brain (database url missing)');
    sql = postgres(url, { ssl: 'require' });
  }
  return sql;
}

export async function initClorkDB() {
  const db = getSql();
  
  await db`CREATE TABLE IF NOT EXISTS clork_uploads (
    id SERIAL PRIMARY KEY,
    wallet TEXT,
    hash TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'uncategorized',
    conversation_count INTEGER DEFAULT 0,
    message_count INTEGER DEFAULT 0,
    size_bytes INTEGER DEFAULT 0,
    source TEXT DEFAULT 'unknown',
    preview TEXT,
    tx_signature TEXT,
    price_sol DECIMAL(10,4) DEFAULT 0,
    listed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  )`;

  await db`CREATE TABLE IF NOT EXISTS clork_users (
    wallet TEXT PRIMARY KEY,
    username TEXT,
    total_uploads INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    earnings_sol DECIMAL(10,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
  )`;

  await db`CREATE TABLE IF NOT EXISTS clork_purchases (
    id SERIAL PRIMARY KEY,
    upload_id INTEGER REFERENCES clork_uploads(id),
    buyer_wallet TEXT NOT NULL,
    seller_wallet TEXT,
    price_sol DECIMAL(10,4) NOT NULL,
    tx_signature TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`;

  await db`CREATE INDEX IF NOT EXISTS idx_uploads_wallet ON clork_uploads(wallet)`;
  await db`CREATE INDEX IF NOT EXISTS idx_uploads_listed ON clork_uploads(listed)`;
  await db`CREATE INDEX IF NOT EXISTS idx_uploads_category ON clork_uploads(category)`;
}

export async function upsertUser(wallet: string, username?: string) {
  const db = getSql();
  await db`INSERT INTO clork_users (wallet, username) VALUES (${wallet}, ${username || wallet.slice(0,8)+'...'})
    ON CONFLICT (wallet) DO UPDATE SET username = COALESCE(EXCLUDED.username, clork_users.username)`;
}

export async function addUpload(data: {
  wallet: string; hash: string; category: string; conversationCount: number;
  messageCount: number; sizeBytes: number; source: string; preview: string; txSignature?: string;
}) {
  const db = getSql();
  await upsertUser(data.wallet);
  
  const result = await db`INSERT INTO clork_uploads (wallet, hash, category, conversation_count, message_count, size_bytes, source, preview, tx_signature)
    VALUES (${data.wallet}, ${data.hash}, ${data.category}, ${data.conversationCount}, ${data.messageCount}, ${data.sizeBytes}, ${data.source}, ${data.preview}, ${data.txSignature || null})
    ON CONFLICT (hash) DO NOTHING RETURNING id`;
  
  if (result.length > 0) {
    await db`UPDATE clork_users SET total_uploads = total_uploads + 1, total_messages = total_messages + ${data.messageCount} WHERE wallet = ${data.wallet}`;
  }
  return result[0]?.id;
}

export async function listUpload(id: number, priceSol: number) {
  const db = getSql();
  await db`UPDATE clork_uploads SET listed = true, price_sol = ${priceSol} WHERE id = ${id}`;
}

export async function getMarketplace(category?: string, limit = 50) {
  const db = getSql();
  if (category && category !== 'all') {
    return db`SELECT u.*, cu.username FROM clork_uploads u LEFT JOIN clork_users cu ON u.wallet = cu.wallet WHERE u.listed = true AND u.category = ${category} ORDER BY u.created_at DESC LIMIT ${limit}`;
  }
  return db`SELECT u.*, cu.username FROM clork_uploads u LEFT JOIN clork_users cu ON u.wallet = cu.wallet WHERE u.listed = true ORDER BY u.created_at DESC LIMIT ${limit}`;
}

export async function getLeaderboard(limit = 20) {
  const db = getSql();
  return db`SELECT wallet, username, total_uploads, total_messages, total_sales, earnings_sol FROM clork_users ORDER BY total_messages DESC LIMIT ${limit}`;
}

export async function getStats() {
  const db = getSql();
  const totals = await db`SELECT COUNT(*) as uploads, SUM(message_count) as messages, COUNT(DISTINCT wallet) as users FROM clork_uploads`;
  const categories = await db`SELECT category, COUNT(*) as count, SUM(message_count) as messages FROM clork_uploads GROUP BY category ORDER BY count DESC`;
  return { totals: totals[0], categories };
}

export async function recordPurchase(uploadId: number, buyerWallet: string, priceSol: number, txSignature: string) {
  const db = getSql();
  const upload = await db`SELECT wallet FROM clork_uploads WHERE id = ${uploadId}`;
  if (!upload[0]) return;
  
  await db`INSERT INTO clork_purchases (upload_id, buyer_wallet, seller_wallet, price_sol, tx_signature)
    VALUES (${uploadId}, ${buyerWallet}, ${upload[0].wallet}, ${priceSol}, ${txSignature})`;
  await db`UPDATE clork_users SET total_sales = total_sales + 1, earnings_sol = earnings_sol + ${priceSol * 0.95} WHERE wallet = ${upload[0].wallet}`;
}
