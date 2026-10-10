"use client";

import React from "react";
import { Zap, Flame, Rocket, Target, Globe, Shield, ArrowUpRight } from "lucide-react";

export default function WhyDemoBull() {
  const points = [
    {
      icon: Rocket,
      title: "1,000X ASYMMETRIC UPSIDE",
      desc: "Stage 1 entry at $0.000001 targeting a $0.001 DEX listing price. 200,000,000 tokens per 1 SOL = $200,000 at target listing.",
      color: "text-[#00ff66]",
    },
    {
      icon: Zap,
      title: "SOLANA HYPERSPEED",
      desc: "Instant block finality at 400ms with negligible gas fees, outperforming congested legacy networks under peak trading demand.",
      color: "text-[#14F195]",
    },
    {
      icon: Flame,
      title: "TIERED WHALE BONUSES",
      desc: "Up to +300% whale multipliers for contributions from 0.2 SOL up to 10 SOL. Bonus tokens apply exclusively during presale.",
      color: "text-[#F59E0B]",
    },
    {
      icon: Target,
      title: "80% COMMUNITY DISTRIBUTION",
      desc: "No private VC allocations dumping on the herd. 8 Billion tokens are reserved exclusively for public early participants.",
      color: "text-[#38BDF8]",
    },
    {
      icon: Globe,
      title: "GLOBAL MEMETIC MOMENTUM",
      desc: "The definitive space bull movement capturing the astronomical energy of the upcoming Solana bull supercycle.",
      color: "text-[#9945FF]",
    },
    {
      icon: Shield,
      title: "AUTOMATED DISTRIBUTION",
      desc: "Database registration ensures deterministic token delivery straight to your contributing address at TGE launch.",
      color: "text-[#EC4899]",
    },
  ];

  return (
    <section id="why" className="section-shell bg-transparent relative overflow-hidden">

      {/* Hero-matching scan-line overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,102,0.15) 2px, rgba(0,255,102,0.15) 3px)', backgroundSize: '100% 3px' }} />

      <div className="container-custom relative z-10">

        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 gap-3">
          <div className="status-badge">
            <Flame className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>VALUE THESIS & MOMENTUM</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            WHY <span className="bg-gradient-to-r from-[#00ff66] via-[#14F195] to-[#9945FF] bg-clip-text text-transparent">$DEMOBULL</span>
          </h2>
          <p className="text-sm sm:text-base font-sans text-gray-300 max-w-2xl mt-1 leading-relaxed">
            Engineered from the ground up to lead the Solana supercycle with fair community tokenomics and parabolic upside mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="glass-card-interactive p-7 rounded-2xl bg-gradient-to-b from-[#051108] to-[#020704] border border-white/10 hover:border-[#00ff66]/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between group"
            >
              <div>
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 w-fit mb-5 group-hover:border-[#00ff66]/40 transition-colors">
                  <p.icon className={`w-7 h-7 ${p.color}`} />
                </div>
                <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider mb-2.5">
                  {p.title}
                </h3>
                <p className="text-xs font-sans text-gray-300 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#00ff66]">
                <span>// ORBIT SPECIFIED</span>
                <span className="text-gray-500">STAGE 1</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
