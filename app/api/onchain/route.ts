import { NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction, SystemProgram, TransactionInstruction, LAMPORTS_PER_SOL } from '@solana/web3.js';

export const dynamic = 'force-dynamic';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const TREASURY_WALLET = process.env.CLORK_TREASURY_WALLET || '';

// Build a memo transaction to register data hash on-chain
export async function POST(req: Request) {
  try {
    const { action, wallet, hash, buyerWallet, sellerWallet, priceSol, uploadId } = await req.json();
    const connection = new Connection(RPC_URL, 'confirmed');

    if (action === 'memo') {
      // Register data hash on Solana via memo program
      if (!wallet || !hash) {
        return NextResponse.json({ error: 'need wallet and hash' }, { status: 400 });
      }

      const payer = new PublicKey(wallet);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      const memoData = `CLORK:DATA:${hash}`;
      const memoInstruction = new TransactionInstruction({
        keys: [{ pubkey: payer, isSigner: true, isWritable: true }],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(memoData, 'utf-8'),
      });

      const transaction = new Transaction();
      transaction.add(memoInstruction);
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = payer;

      const serialized = transaction.serialize({ requireAllSignatures: false, verifySignatures: false });

      return NextResponse.json({
        transaction: Buffer.from(serialized).toString('base64'),
        message: `clork is writing your data hash to solana. hash: ${hash.slice(0, 16)}...`,
      });
    }

    if (action === 'purchase') {
      // Build payment transaction: buyer pays seller (95%) + treasury (5%)
      if (!buyerWallet || !sellerWallet || !priceSol) {
        return NextResponse.json({ error: 'need buyerWallet, sellerWallet, priceSol' }, { status: 400 });
      }

      const buyer = new PublicKey(buyerWallet);
      const seller = new PublicKey(sellerWallet);
      const lamports = Math.floor(priceSol * LAMPORTS_PER_SOL);
      const fee = Math.floor(lamports * 0.05); // 5% to clork
      const sellerAmount = lamports - fee;

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      const transaction = new Transaction();

      // Pay seller
      transaction.add(
        SystemProgram.transfer({ fromPubkey: buyer, toPubkey: seller, lamports: sellerAmount })
      );

      // Pay fee to treasury
      if (TREASURY_WALLET) {
        transaction.add(
          SystemProgram.transfer({ fromPubkey: buyer, toPubkey: new PublicKey(TREASURY_WALLET), lamports: fee })
        );
      }

      // Add memo with purchase reference
      const memoData = `CLORK:BUY:${uploadId || 'unknown'}`;
      transaction.add(
        new TransactionInstruction({
          keys: [{ pubkey: buyer, isSigner: true, isWritable: true }],
          programId: MEMO_PROGRAM_ID,
          data: Buffer.from(memoData, 'utf-8'),
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = buyer;

      const serialized = transaction.serialize({ requireAllSignatures: false, verifySignatures: false });

      return NextResponse.json({
        transaction: Buffer.from(serialized).toString('base64'),
        sellerAmount: sellerAmount / LAMPORTS_PER_SOL,
        feeAmount: fee / LAMPORTS_PER_SOL,
        message: `paying ${priceSol} SOL: ${((lamports - fee) / LAMPORTS_PER_SOL).toFixed(4)} to seller, ${(fee / LAMPORTS_PER_SOL).toFixed(4)} to clork`,
      });
    }

    if (action === 'verify') {
      // Verify a transaction signature
      const { signature } = await req.json().catch(() => ({ signature: null }));
      if (!signature) return NextResponse.json({ error: 'need signature' }, { status: 400 });

      const tx = await connection.getTransaction(signature, { maxSupportedTransactionVersion: 0 });
      return NextResponse.json({ confirmed: !!tx, slot: tx?.slot });
    }

    return NextResponse.json({ error: 'unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Onchain error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
