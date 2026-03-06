'use client';

import Nav from '../../components/Nav';

export default function Terms() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Nav />
      <div className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        <h1 className="text-2xl font-bold text-[#1c1e21] mb-6">Terms of Service & Legal</h1>

        <div className="space-y-6">

          {/* RISK WARNING - TOP */}
          <div className="rounded-2xl bg-red-50 border border-red-200 p-7">
            <h2 className="text-lg font-semibold text-red-800 mb-3">Risk Warning</h2>
            <p className="text-sm text-red-700 leading-relaxed mb-3">
              <strong>$CLORK is an experimental, highly speculative token.</strong> The value of $CLORK can fluctuate 
              dramatically and may drop to zero at any time without warning. There is no guarantee of any return on 
              investment. The token may become permanently worthless.
            </p>
            <ul className="text-sm text-red-700 space-y-2 list-disc pl-5">
              <li>Do NOT invest money you cannot afford to lose entirely.</li>
              <li>There is NO obligation from the team to maintain price, provide liquidity, or buy back tokens.</li>
              <li>Past performance (if any) does not indicate future results.</li>
              <li>$CLORK has no intrinsic value outside of the Clork marketplace.</li>
              <li>Cryptocurrency markets are unregulated and subject to extreme volatility.</li>
              <li>You may lose 100% of your funds. This is not unlikely.</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-7">
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">No Financial Advice</h2>
            <p className="text-sm text-[#65676b] leading-relaxed">
              Nothing on this website, in our communications, or on our social media constitutes financial advice, 
              investment advice, trading advice, or any other form of professional advice. Clork does not recommend 
              buying, selling, or holding any cryptocurrency, including $CLORK. All information is provided &quot;as is&quot; 
              for general informational purposes only. You should consult a qualified financial advisor before making 
              any investment decision. Any decision to purchase or interact with $CLORK is made entirely at your own risk.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-7">
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">Token Disclaimer</h2>
            <p className="text-sm text-[#65676b] leading-relaxed mb-3">
              $CLORK is a utility token intended solely for use within the Clork marketplace ecosystem. It is <strong>not</strong> a 
              security, investment contract, equity, share, bond, derivative, or financial instrument of any kind. 
              Purchasing or holding $CLORK does not constitute an investment in Clork or entitle holders to profits, 
              dividends, equity, revenue share, or any form of financial return.
            </p>
            <p className="text-sm text-[#65676b] leading-relaxed">
              The token has no backing, reserves, or assets supporting its value. Its price is determined entirely by 
              market forces and may be zero. The team makes no representations or warranties regarding the current 
              or future value of $CLORK.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-7">
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">Limitation of Liability</h2>
            <p className="text-sm text-[#65676b] leading-relaxed mb-3">
              To the maximum extent permitted by applicable law, Clork, its creators, developers, contributors, 
              affiliates, and any associated parties (collectively, &quot;the Team&quot;) shall not be liable for any direct, 
              indirect, incidental, special, consequential, exemplary, or punitive damages whatsoever, including but 
              not limited to:
            </p>
            <ul className="text-sm text-[#65676b] space-y-1 list-disc pl-5 mb-3">
              <li>Loss of funds, tokens, cryptocurrency, or fiat currency</li>
              <li>Loss of profits, revenue, or anticipated savings</li>
              <li>Loss of data or data breach</li>
              <li>Token price depreciation or total loss of token value</li>
              <li>Smart contract bugs, exploits, or vulnerabilities</li>
              <li>Wallet compromise, phishing, or unauthorized access</li>
              <li>Service interruption, downtime, or discontinuation</li>
              <li>Regulatory action or legal changes affecting the platform</li>
              <li>Any third-party actions, including exchange delistings</li>
            </ul>
            <p className="text-sm text-[#65676b] leading-relaxed">
              This limitation applies regardless of the theory of liability (contract, tort, negligence, strict liability, 
              or otherwise) and even if the Team has been advised of the possibility of such damages. Your sole remedy 
              for dissatisfaction with the platform is to stop using it.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-7">
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">No Warranties</h2>
            <p className="text-sm text-[#65676b] leading-relaxed">
              The platform, token, smart contracts, and all associated services are provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; 
              without warranties of any kind, whether express, implied, or statutory, including but not limited to 
              implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement. 
              The Team does not warrant that the platform will be uninterrupted, error-free, secure, or free of viruses 
              or harmful components. The Team does not warrant the accuracy, completeness, or reliability of any 
              information on the platform.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-7">
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">Assumption of Risk</h2>
            <p className="text-sm text-[#65676b] leading-relaxed">
              By using the Clork platform or interacting with $CLORK in any way, you expressly acknowledge and assume 
              all risks associated with cryptocurrency, decentralized finance, and blockchain technology. These risks 
              include but are not limited to: total loss of funds, smart contract failure, regulatory uncertainty, 
              market manipulation, low liquidity, and irreversible transactions. You confirm that you are acting on 
              your own behalf, have conducted your own research, and are not relying on any representation from the Team.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-7">
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">Indemnification</h2>
            <p className="text-sm text-[#65676b] leading-relaxed">
              You agree to indemnify, defend, and hold harmless the Team from and against any claims, liabilities, 
              damages, losses, and expenses (including reasonable legal fees) arising from your use of the platform, 
              your purchase or sale of $CLORK tokens, your violation of these terms, or your violation of any 
              applicable law or regulation.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-7">
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">Data Ownership</h2>
            <p className="text-sm text-[#65676b] leading-relaxed mb-3">
              You retain full ownership of any data you upload to Clork. By uploading, you grant Clork a limited license
              to store, parse, hash, and display metadata about your dataset on the marketplace. You may remove your data
              at any time.
            </p>
            <p className="text-sm text-[#65676b] leading-relaxed">
              When you list data for sale, you represent that you have the right to share it and that it does not contain
              personally identifiable information (PII) of third parties unless properly de-identified and consented.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-7">
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">Marketplace</h2>
            <p className="text-sm text-[#65676b] leading-relaxed mb-3">
              Clork operates as a peer-to-peer marketplace. All transactions occur directly between buyers and sellers
              on the Solana blockchain. Clork charges a 5% platform fee on completed sales. Clork does not guarantee
              the quality, accuracy, or completeness of any dataset listed on the marketplace.
            </p>
            <p className="text-sm text-[#65676b] leading-relaxed">
              Sellers are responsible for ensuring their data does not violate any applicable laws, third-party rights,
              or platform policies. Clork reserves the right to remove any listing at its discretion.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-7">
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">Privacy</h2>
            <p className="text-sm text-[#65676b] leading-relaxed">
              Clork collects wallet addresses for marketplace functionality. We do not collect personal information
              beyond what is necessary to operate the platform. Uploaded data is stored securely and only shared with
              buyers who complete a verified purchase. We do not sell user data to third parties.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-7">
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">Copyright</h2>
            <p className="text-sm text-[#65676b] leading-relaxed">
              &copy; {year} Clork. All rights reserved. The Clork name, logo, website design, and all associated
              intellectual property are the exclusive property of Clork and its creators.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-card p-7">
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">Modification of Terms</h2>
            <p className="text-sm text-[#65676b] leading-relaxed">
              Clork reserves the right to modify these terms at any time without prior notice. Continued use of the 
              platform after changes constitutes acceptance of the updated terms. It is your responsibility to review 
              these terms periodically.
            </p>
          </div>

          <p className="text-xs text-[#8a8d91] text-center pt-4">
            &copy; {year} Clork. All rights reserved. Last updated: March 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
