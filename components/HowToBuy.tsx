"use client";

import React from "react";
import { Download, Wallet, Send, ArrowRight, CheckCircle2 } from "lucide-react";
import { PRESALE_WALLET_ADDRESS } from "@/config";

export default function HowToBuy() {
  const steps = [
    {
      num: "01",
      icon: Download,
      title: "SET UP A SOLANA WALLET",
      desc: "Download and create a Phantom, Solflare, or Backpack wallet on mobile or browser extension. Keep your secret recovery phrase secure and offline.",
    },
    {
      num: "02",
      icon: Wallet,
      title: "ACQUIRE SOLANA (SOL)",
      desc: "Purchase SOL on any major exchange (Coinbase, Binance, Kraken, OKX) and transfer it directly to your personal self-custody wallet address.",
    },
    {
      num: "03",
      icon: Send,
      title: "SEND SOL TO PRESALE CA",
      desc: `Send between 0.2 SOL and 10 SOL from your private wallet to the official presale address (${PRESALE_WALLET_ADDRESS.slice(0, 6)}...${PRESALE_WALLET_ADDRESS.slice(-4)}).`,
    },
    {
      num: "04",
      icon: ArrowRight,
      title: "RECEIVE $DEMOBULL AT TGE",
      desc: "Tokens and tiered bonus allocations are permanently logged in our verified ledger and distributed directly to your wallet upon DEX launch.",
    },
  ];

  return (
    <section id="how-to-buy" className="section-shell bg-transparent relative overflow-hidden">
      <div className="ambient-glow-top" />
      <div className="ambient-glow-purple" />

      {/* Hero-matching scan-line overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,102,0.15) 2px, rgba(0,255,102,0.15) 3px)', backgroundSize: '100% 3px' }} />

      <div className="container-custom relative z-10">

        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 gap-3">
          <div className="status-badge">
            <span>TRANSMISSION MANUAL & ONBOARDING</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            HOW TO <span className="bg-gradient-to-r from-[#00ff66] to-[#14F195] bg-clip-text text-transparent">PARTICIPATE</span>
          </h2>
          <p className="text-sm sm:text-base font-sans text-gray-300 max-w-2xl mt-1 leading-relaxed">
            Simple, frictionless direct contribution. No complex dApp token approvals or signature risks required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="glass-card-interactive p-7 rounded-2xl bg-gradient-to-b from-[#051108] to-[#020704] border border-white/10 hover:border-[#00ff66]/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl font-mono font-black text-[#00ff66]">
                    {s.num}
                  </span>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 group-hover:border-[#00ff66]/40 transition-colors">
                    <s.icon className="w-5 h-5 text-gray-300 group-hover:text-[#00ff66] transition-colors" />
                  </div>
                </div>

                <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider mb-2.5">
                  {s.title}
                </h3>
                <p className="text-xs font-sans text-gray-300 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#00ff66]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span>STEP READY</span>
                </span>
                <span className="text-gray-500 font-bold">0{idx + 1}/04</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
