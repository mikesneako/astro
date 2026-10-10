"use client";

import React from "react";
import { Compass, CheckCircle2, Clock, Rocket, Zap } from "lucide-react";

export default function Roadmap() {
  const phases = [
    {
      phase: "PHASE 01",
      title: "DEEP SPACE IGNITION",
      status: "COMPLETED",
      items: [
        "Smart contract architecture & security audit",
        "Deep Space Terminal visual design engine",
        "Official Presale deposit address initialization",
        "Social telemetry transmission channels live",
      ],
    },
    {
      phase: "PHASE 02",
      title: "ORBITAL PRESALE & AIRDROP",
      status: "CURRENTLY LIVE",
      items: [
        "Stage 1 public presale with tiered bonus milestones",
        "Community airdrop portal deployment (200k/wallet)",
        "Global crypto bull market momentum campaign",
        "Listing preparation with Solana liquidity providers",
      ],
    },
    {
      phase: "PHASE 03",
      title: "RAYDIUM DEX LAUNCH & TGE",
      status: "SCHEDULED",
      items: [
        "Token Generation Event (TGE) SPL contract deployment",
        "Automated token distribution to presale & airdrop wallets",
        "Raydium CLMM & Orca pool injection ($0.001 list target)",
        "100% LP tokens permanently burned on-chain",
      ],
    },
    {
      phase: "PHASE 04",
      title: "GALACTIC EXPANSION",
      status: "UPCOMING",
      items: [
        "Tier-1 Centralized Exchange (CEX) listings",
        "DemoBull staking & orbital multiplier vault",
        "Cross-chain bull market liquidity bridge",
        "Ecosystem DAO governance transition",
      ],
    },
  ];

  return (
    <section id="roadmap" className="section-shell bg-black relative overflow-hidden">
      <div className="ambient-glow-top" />
      <div className="ambient-glow-purple" />

      {/* Hero-matching scan-line overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,102,0.15) 2px, rgba(0,255,102,0.15) 3px)', backgroundSize: '100% 3px' }} />

      <div className="container-custom relative z-10">

        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 gap-3">
          <div className="status-badge">
            <Compass className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>MISSION TIMELINE & MILESTONES</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            ORBITAL <span className="bg-gradient-to-r from-[#00ff66] via-[#14F195] to-[#9945FF] bg-clip-text text-transparent">ROADMAP</span>
          </h2>
          <p className="text-sm sm:text-base font-sans text-gray-300 max-w-2xl mt-1 leading-relaxed">
            A methodical 4-stage trajectory from initial presale ignition to galactic Solana ecosystem dominance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((p, idx) => {
            const isLive = p.status === "CURRENTLY LIVE";
            const isDone = p.status === "COMPLETED";

            return (
              <div
                key={idx}
                className={`p-7 rounded-2xl transition-all duration-300 flex flex-col justify-between ${isLive
                    ? "bg-gradient-to-b from-[#082011] to-[#030d06] border-2 border-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,0.25)] scale-[1.02]"
                    : "bg-gradient-to-b from-[#051108] to-[#020704] border border-white/10 hover:border-[#00ff66]/40 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-black text-gray-400">
                      {p.phase}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${isDone
                          ? "text-[#00ff66] border-[#00ff66]/40 bg-[#00ff66]/10"
                          : isLive
                            ? "text-[#00ff66] border-[#00ff66] bg-[#00ff66]/20 animate-pulse font-black"
                            : "text-gray-400 border-white/20 bg-white/5"
                        }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider mb-5">
                    {p.title}
                  </h3>

                  <ul className="space-y-3 text-xs font-sans text-gray-300">
                    {p.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className={`mt-0.5 font-bold ${isDone ? "text-[#00ff66]" : isLive ? "text-[#39ff88]" : "text-gray-500"}`}>
                          ›
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#7fa890]">
                  <span>STAGE STATUS:</span>
                  <span className={`font-bold ${isLive ? "text-[#00ff66]" : "text-gray-400"}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
