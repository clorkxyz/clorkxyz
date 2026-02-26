import postgres from 'postgres';
import crypto from 'crypto';

const url = process.env.CLORK_DATABASE_URL || process.env.DATABASE_URL;
if (!url) { console.error('need CLORK_DATABASE_URL'); process.exit(1); }
const sql = postgres(url, { ssl: 'require' });

// Realistic wallet addresses (random but valid-looking base58)
const WALLETS = [
  'A3kB7mV9xR2pQ8nL5tW1yF4jH6cZ9dE0gU3sN7oI2bM',
  'B8nC3kT6vR1pQ9mL4tW5yF7jH2cZ0dE8gU6sN1oI9bM',
  'C5pD9kU2vR4pQ3mL7tW8yF1jH5cZ6dE3gU0sN4oI7bM',
  'D2qE6kV8vR7pQ1mL0tW3yF9jH4cZ2dE5gU7sN8oI1bM',
  'E7rF1kW5vR0pQ6mL9tW2yF3jH8cZ4dE7gU1sN5oI3bM',
  'F4sG8kX2vR3pQ7mL6tW1yF5jH0cZ9dE2gU4sN7oI6bM',
  'G1tH5kY9vR6pQ4mL3tW7yF8jH2cZ1dE0gU9sN3oI8bM',
  'H9uI2kZ6vR1pQ8mL5tW4yF0jH7cZ3dE9gU6sN1oI5bM',
];

const USERNAMES = [
  'datarunner', 'ml_research', 'codepilot', 'promptengineer',
  'aitrader', 'neuraldev', 'cryptobuilder', 'deeplearner',
];

const DATASETS = [
  // Coding
  { category: 'coding', source: 'ChatGPT', convos: 47, msgs: 1892, size: 284000, price: 0.15,
    preview: 'Full-stack development conversations covering React, Node.js, PostgreSQL, and deployment workflows. Includes debugging sessions and architecture decisions.' },
  { category: 'coding', source: 'Claude', convos: 23, msgs: 876, size: 156000, price: 0.08,
    preview: 'Python data science pipeline development. Pandas, scikit-learn, and custom ML model training conversations with iterative debugging.' },
  { category: 'coding', source: 'ChatGPT', convos: 112, msgs: 4231, size: 890000, price: 0.35,
    preview: 'Comprehensive Rust learning journey from beginner to intermediate. Ownership model, async programming, and systems design discussions.' },
  { category: 'coding', source: 'Claude', convos: 31, msgs: 1204, size: 198000, price: 0.12,
    preview: 'Smart contract development in Solidity and Anchor/Solana. Token standards, DeFi protocols, and security audit conversations.' },
  { category: 'coding', source: 'ChatGPT', convos: 8, msgs: 342, size: 52000, price: 0.05,
    preview: 'iOS SwiftUI development sessions. Building a fitness tracking app with HealthKit integration and custom charts.' },

  // Research
  { category: 'research', source: 'Claude', convos: 34, msgs: 1567, size: 312000, price: 0.20,
    preview: 'Academic literature review on transformer architectures. Analysis of attention mechanisms, scaling laws, and emergent capabilities in LLMs.' },
  { category: 'research', source: 'ChatGPT', convos: 19, msgs: 734, size: 145000, price: 0.10,
    preview: 'Behavioral economics research. Prospect theory applications, nudge design, and experimental methodology discussions.' },
  { category: 'research', source: 'Claude', convos: 56, msgs: 2890, size: 567000, price: 0.28,
    preview: 'Genomics and bioinformatics analysis workflows. CRISPR mechanism discussions, protein folding predictions, and molecular dynamics.' },
  { category: 'research', source: 'ChatGPT', convos: 15, msgs: 623, size: 98000, price: 0.07,
    preview: 'Climate science data analysis. Carbon cycle modeling, satellite data interpretation, and emissions forecasting methodologies.' },

  // Business
  { category: 'business', source: 'ChatGPT', convos: 28, msgs: 1123, size: 178000, price: 0.18,
    preview: 'SaaS go-to-market strategy development. Pricing models, customer segmentation, PLG vs sales-led analysis, and competitive positioning.' },
  { category: 'business', source: 'Claude', convos: 41, msgs: 1876, size: 289000, price: 0.22,
    preview: 'Financial modeling and fundraising prep. DCF models, cap table scenarios, pitch deck review, and investor Q&A preparation.' },
  { category: 'business', source: 'ChatGPT', convos: 12, msgs: 489, size: 76000, price: 0.06,
    preview: 'E-commerce operations optimization. Supply chain analysis, inventory management algorithms, and marketplace pricing strategies.' },

  // Creative
  { category: 'creative', source: 'Claude', convos: 67, msgs: 3456, size: 678000, price: 0.25,
    preview: 'Sci-fi novel development over 3 months. World-building, character arcs, plot structure, and dialogue refinement across 12 chapters.' },
  { category: 'creative', source: 'ChatGPT', convos: 22, msgs: 891, size: 134000, price: 0.09,
    preview: 'Music composition assistance. Chord progression theory, arrangement techniques, and lyric writing for indie rock album.' },

  // Crypto
  { category: 'crypto', source: 'ChatGPT', convos: 38, msgs: 1567, size: 234000, price: 0.15,
    preview: 'DeFi protocol analysis and yield farming strategies. Liquidity pool mechanics, impermanent loss calculations, and cross-chain bridging.' },
  { category: 'crypto', source: 'Claude', convos: 16, msgs: 678, size: 112000, price: 0.08,
    preview: 'Token economics design for a DAO governance system. Voting mechanisms, delegation models, and incentive alignment analysis.' },
  { category: 'crypto', source: 'ChatGPT', convos: 73, msgs: 2987, size: 456000, price: 0.30,
    preview: 'MEV research and flashbot strategies. Transaction ordering, sandwich attack analysis, and arbitrage bot development discussions.' },

  // Education
  { category: 'education', source: 'Claude', convos: 89, msgs: 4123, size: 789000, price: 0.32,
    preview: 'Complete calculus tutoring series from limits through multivariable calc. Step-by-step problem solving with conceptual explanations.' },
  { category: 'education', source: 'ChatGPT', convos: 45, msgs: 1890, size: 298000, price: 0.18,
    preview: 'AP Computer Science preparation. Java fundamentals, data structures, algorithms, and exam-style problem solving.' },

  // Medical
  { category: 'medical', source: 'Claude', convos: 11, msgs: 456, size: 89000, price: 0.12,
    preview: 'Clinical research methodology discussions. Study design, statistical analysis approaches, and IRB protocol development.' },

  // Legal
  { category: 'legal', source: 'ChatGPT', convos: 18, msgs: 734, size: 145000, price: 0.14,
    preview: 'Startup legal structure analysis. Delaware C-corp vs LLC, IP assignment, SAFE notes, and employee equity compensation planning.' },

  // General
  { category: 'general', source: 'ChatGPT', convos: 156, msgs: 5678, size: 1100000, price: 0.40,
    preview: 'Six months of daily conversations covering technology news analysis, book recommendations, travel planning, and personal productivity systems.' },
  { category: 'general', source: 'Claude', convos: 34, msgs: 1234, size: 198000, price: 0.11,
    preview: 'Philosophy discussions on consciousness, free will, and ethics of AI systems. Includes references to academic papers and thought experiments.' },
];

async function seed() {
  console.log('Seeding Clork database...\n');

  // Create users
  for (let i = 0; i < WALLETS.length; i++) {
    await sql`INSERT INTO clork_users (wallet, username, total_uploads, total_messages)
      VALUES (${WALLETS[i]}, ${USERNAMES[i]}, 0, 0)
      ON CONFLICT (wallet) DO UPDATE SET username = ${USERNAMES[i]}`;
    console.log(`  user: ${USERNAMES[i]}`);
  }

  // Insert datasets
  let count = 0;
  for (const d of DATASETS) {
    const walletIdx = count % WALLETS.length;
    const wallet = WALLETS[walletIdx];
    const hash = crypto.createHash('sha256').update(`clork-seed-${count}-${d.preview}`).digest('hex');

    const result = await sql`INSERT INTO clork_uploads (wallet, hash, category, conversation_count, message_count, size_bytes, source, preview, listed, price_sol)
      VALUES (${wallet}, ${hash}, ${d.category}, ${d.convos}, ${d.msgs}, ${d.size}, ${d.source}, ${d.preview}, true, ${d.price})
      ON CONFLICT (hash) DO NOTHING RETURNING id`;

    if (result.length > 0) {
      await sql`UPDATE clork_users SET
        total_uploads = total_uploads + 1,
        total_messages = total_messages + ${d.msgs}
        WHERE wallet = ${wallet}`;
      count++;
      console.log(`  [${d.category}] ${d.convos} convos, ${d.msgs} msgs @ ${d.price} SOL`);
    } else {
      console.log(`  [skip] already exists: ${d.category}`);
    }
  }

  console.log(`\nSeeded ${count} datasets across ${WALLETS.length} users.`);

  // Verify
  const stats = await sql`SELECT COUNT(*) as total, SUM(message_count) as msgs FROM clork_uploads WHERE listed = true`;
  console.log(`DB total: ${stats[0].total} listed, ${stats[0].msgs} messages`);

  await sql.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
