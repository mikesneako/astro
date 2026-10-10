"use client";

import React from "react";
import { PieChart, ShieldCheck, Flame, Lock, Layers, Zap } from "lucide-react";
import { TOKENOMICS_CONFIG, AMOUNT_CONFIG } from "@/config";

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="section-shell bg-transparent relative overflow-hidden">

      {/* Hero-matching scan-line overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,102,0.15) 2px, rgba(0,255,102,0.15) 3px)', backgroundSize: '100% 3px' }} />

      <div className="container-custom relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 gap-3">
          <div className="status-badge">
            <PieChart className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>COMMUNITY-FIRST ARCHITECTURE</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight">
            ORBITAL <span className="bg-gradient-to-r from-[#00ff66] via-[#14F195] to-[#9945FF] bg-clip-text text-transparent">TOKENOMICS</span>
          </h2>
          <p className="text-sm sm:text-base font-sans text-gray-300 max-w-2xl mt-1 leading-relaxed">
            10 Billion hard-capped supply on Solana. Zero mint authority, 80% dedicated to early community presale, and 100% unlocked at TGE launch.
          </p>
        </div>

        {/* Global Supply Bar Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#06140a] to-[#020704] border border-[#00ff66]/25 shadow-[0_20px_50px_rgba(0,0,0,0.8)] mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 mb-5 gap-3">
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">
                TOTAL MAXIMUM HARD-CAPPED SUPPLY:
              </span>
              <span className="text-2xl sm:text-4xl font-mono font-black text-white mt-1 block">
                {AMOUNT_CONFIG.totalSupplyFormatted} <span className="text-[#00ff66]">$DEMOBULL</span>
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/40 text-xs font-mono text-[#00ff66] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
              <span>CONTRACT AUDITED • MINT REVOKED</span>
            </div>
          </div>

          {/* Segmented Allocation Bar */}
          <div className="w-full h-5 bg-black/90 rounded-full border border-white/15 p-0.5 flex overflow-hidden shadow-inner">
            <div style={{ width: "80%" }} className="h-full bg-[#00ff66] rounded-l-full shadow-[0_0_15px_rgba(0,255,102,0.6)]" title="80% Presale" />
            <div style={{ width: "10%" }} className="h-full bg-[#9945FF]" title="10% Liquidity" />
            <div style={{ width: "5%" }} className="h-full bg-[#38BDF8]" title="5% Airdrop" />
            <div style={{ width: "3%" }} className="h-full bg-[#F59E0B]" title="3% Marketing" />
            <div style={{ width: "2%" }} className="h-full bg-[#EC4899] rounded-r-full" title="2% Team" />
          </div>

          {/* Allocation Legend */}
          <div className="flex items-center justify-between text-xs font-mono text-gray-300 mt-4 flex-wrap gap-3">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66]" />
              <strong className="text-white">80%</strong> PRESALE & ORBIT
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9945FF]" />
              <strong className="text-white">10%</strong> LIQUIDITY POOL
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
              <strong className="text-white">5%</strong> COMMUNITY AIRDROP
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <strong className="text-white">3%</strong> MARKETING & KOLS
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
              <strong className="text-white">2%</strong> CORE TEAM
            </span>
          </div>
        </div>

        {/* Detailed Allocation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {TOKENOMICS_CONFIG.map((item, idx) => (
            <div
              key={idx}
              className="glass-card-interactive p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#051108] to-[#020704] border border-white/10 hover:border-[#00ff66]/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-xs font-mono font-bold text-gray-200 uppercase">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xl font-mono font-black text-white">
                    {item.percentage}%
                  </span>
                </div>

                <div className="text-2xl font-mono font-black text-[#00ff66] my-1">
                  {item.amount.toLocaleString()}
                </div>

                <p className="text-xs font-sans text-gray-300 mt-2.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>Vesting Terms:</span>
                <span className="text-[#39ff88] font-bold">{item.vesting}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
