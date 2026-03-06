import { x402ResourceServer } from '@x402/next';
import { HTTPFacilitatorClient } from '@x402/core/server';

const facilitatorClient = new HTTPFacilitatorClient({
  url: 'https://facilitator.x402.org',
});

// Dynamic import to avoid TS issues with SVM scheme constructor
// @ts-ignore - x402/svm types are mismatched between packages
const { ExactSvmScheme, SOLANA_MAINNET_CAIP2 } = require('@x402/svm');

export const x402Server = new x402ResourceServer(facilitatorClient)
  .register(SOLANA_MAINNET_CAIP2, new ExactSvmScheme());

export const TREASURY_WALLET = process.env.CLORK_TREASURY_WALLET || '5nPKrqDfG9qX6K1mDteeSLVUeB52iTKs2RAXzNydwBeH';
export { SOLANA_MAINNET_CAIP2 };
