"use client";

import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export default function Disclaimer() {
  return (
    <section id="disclaimer" className="py-12 sm:py-16 bg-transparent text-gray-400 font-sans text-xs leading-relaxed">
      <div className="container-custom">
        <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex items-start gap-4 shadow-inner">
          <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <div className="text-gray-200 font-mono font-bold uppercase tracking-wider text-xs">
              IMPORTANT REGULATORY & RISK DISCLOSURE:
            </div>
            <p>
              $DEMOBULL is a decentralized cryptographic utility and community token operating on the Solana blockchain. Cryptocurrency assets are subject to substantial market volatility and speculative risk. Nothing contained on this site constitutes investment, financial, tax, or legal advice.
            </p>
            <p className="text-gray-500">
              Participation in early-stage presale initiatives carries risk of capital loss. Always conduct independent due diligence, verify network parameters, and never contribute funds you cannot afford to lose. Residents of jurisdictions where decentralized token sales are restricted are prohibited from participating.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
