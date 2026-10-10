"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { terminalAudio } from "@/audio/terminalAudio";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "WHAT IS DEMOBULL ($DEMOBULL)?",
      a: "DemoBull ($DEMOBULL) is a Solana-native launchpad token and decentralized orbital movement engineered for the upcoming crypto bull cycle. It features a fixed hard cap of 10 Billion tokens, 80% public presale allocation, and an asymmetric 1,000X launch target.",
    },
    {
      q: "HOW DO I PARTICIPATE IN THE PRESALE?",
      a: "Simply send SOL (between 0.2 SOL and 10 SOL) from your personal Solana self-custody wallet (Phantom, Solflare, or Backpack) to the official presale address. Never send funds from centralized exchanges like Binance, Coinbase, or Kraken.",
    },
    {
      q: "HOW DO THE TIERED BONUSES WORK?",
      a: "Tiered bonuses are applied automatically: 0.2 SOL yields 20,000,000 $DEMOBULL (Base Tier), 1.0 SOL yields 200,000,000 $DEMOBULL (+100% Bonus), and 5.0 SOL yields 2,000,000,000 $DEMOBULL (+300% Whale Bonus, Presale Only).",
    },
    {
      q: "HOW DO I CLAIM THE 200,000 $DEMOBULL AIRDROP?",
      a: "Navigate to the Airdrop Portal on this page, enter your Solana wallet address, and click Claim. Each unique wallet is entitled to 1 claim of 200,000 $DEMOBULL, recorded in our database for distribution at launch.",
    },
    {
      q: "WHEN AND WHERE WILL $DEMOBULL BE LISTED?",
      a: "Immediately following the conclusion of Stage 1 presale, $DEMOBULL will launch on Raydium CLMM and Orca with an initial target price of $0.001 USD. 100% of liquidity pool tokens will be locked and burned permanently.",
    },
    {
      q: "HOW ARE TOKENS DISTRIBUTED TO PRESALE BUYERS?",
      a: "Tokens are automatically distributed to the exact contributing Solana wallet address at TGE (Token Generation Event) prior to public DEX pool launch.",
    },
  ];

  return (
    <section id="faq" className="section-shell bg-black relative overflow-hidden">
      <div className="ambient-glow-top" />

      {/* Hero-matching scan-line overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,102,0.15) 2px, rgba(0,255,102,0.15) 3px)', backgroundSize: '100% 3px' }} />

      <div className="container-custom max-w-4xl relative z-10">

        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 gap-3">
          <div className="status-badge">
            <HelpCircle className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>KNOWLEDGE TELEMETRY & ANSWERS</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            FREQUENTLY ASKED <span className="bg-gradient-to-r from-[#00ff66] to-[#14F195] bg-clip-text text-transparent">QUESTIONS</span>
          </h2>
          <p className="text-sm sm:text-base font-sans text-gray-300 max-w-xl mt-1 leading-relaxed">
            Everything you need to know about the DemoBull presale, bonus calculation, security architecture, and token distribution.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((f, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-300 border ${isOpen
                  ? "bg-[#051108] border-[#00ff66]/50 shadow-[0_10px_30px_rgba(0,255,102,0.1)]"
                  : "bg-[#030805] border-white/10 hover:border-white/20"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    terminalAudio.playClick();
                    setOpenIdx(isOpen ? null : idx);
                  }}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-mono font-black text-white uppercase tracking-wider pr-4">
                    {f.q}
                  </span>
                  <div className={`p-1.5 rounded-lg border transition-transform shrink-0 ${isOpen ? "bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] rotate-180" : "bg-white/5 border-white/10 text-gray-400"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm font-sans text-gray-300 leading-relaxed border-t border-white/10 pt-4">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
