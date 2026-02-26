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
          <div className="rounded-2xl bg-white shadow-card p-7">
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">Copyright</h2>
            <p className="text-sm text-[#65676b] leading-relaxed">
              &copy; {year} Clork. All rights reserved. The Clork name, logo, website design, and all associated
              intellectual property are the exclusive property of Clork and its creators. No part of this platform,
              including but not limited to its code, design, copy, and branding, may be reproduced, distributed,
              or transmitted in any form without prior written permission.
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
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">Token Disclaimer</h2>
            <p className="text-sm text-[#65676b] leading-relaxed">
              $CLORK is a utility token intended for use within the Clork marketplace ecosystem. It is not a security,
              investment contract, or financial instrument. Purchasing or holding $CLORK does not constitute an investment
              in Clork or entitle holders to profits, dividends, or equity. The value of $CLORK may fluctuate and you may
              lose some or all of your purchase amount. Nothing on this platform constitutes financial advice.
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
            <h2 className="text-lg font-semibold text-[#1c1e21] mb-3">Limitation of Liability</h2>
            <p className="text-sm text-[#65676b] leading-relaxed">
              Clork is provided &quot;as is&quot; without warranties of any kind. In no event shall Clork or its creators
              be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use
              of the platform, marketplace, token, or any associated services.
            </p>
          </div>

          <p className="text-xs text-[#8a8d91] text-center pt-4">
            &copy; {year} Clork. All rights reserved. Last updated: February 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
