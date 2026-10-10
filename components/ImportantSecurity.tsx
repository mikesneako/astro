"use client";

import React from "react";
import { ShieldCheck, Lock, Key, Award, Cpu, CheckCircle2 } from "lucide-react";

export default function ImportantSecurity() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "LIQUIDITY BURN COMMITMENT",
      description: "100% of Raydium DEX Liquidity Pool tokens are locked and permanently burned at launch, eliminating rugpull vectors forever.",
      badge: "100% BURNED",
      color: "text-[#00ff66]",
    },
    {
      icon: Key,
      title: "MINT AUTHORITY REVOKED",
      description: "The total supply is hard-capped at 10,000,000,000 $DEMOBULL. Mint authority will be irrevocably revoked upon TGE contract finalization.",
      badge: "ZERO INFLATION",
      color: "text-[#14F195]",
    },
    {
      icon: Cpu,
      title: "MULTI-SIG TREASURY",
      description: "Presale capital is held under multi-signature protocol custody requiring redundant verification before any deployment.",
      badge: "MULTI-SIG CUSTODY",
      color: "text-[#38BDF8]",
    },
    {
      icon: Award,
      title: "COMPREHENSIVE CODE AUDIT",
      description: "Smart allocation logic and Solana program instructions reviewed under strict Web3 cybersecurity standards.",
      badge: "AUDITED LOGIC",
      color: "text-[#9945FF]",
    },
  ];

  return (
    <section id="security" className="section-shell bg-transparent relative overflow-hidden">

      {/* Hero-matching scan-line overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,102,0.15) 2px, rgba(0,255,102,0.15) 3px)', backgroundSize: '100% 3px' }} />

      <div className="container-custom relative z-10">

        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 gap-3">
          <div className="status-badge">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>SECURITY ARCHITECTURE & PROTOCOL AUDIT</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            INSTITUTIONAL <span className="bg-gradient-to-r from-[#00ff66] to-[#14F195] bg-clip-text text-transparent">SAFEGUARDS</span>
          </h2>
          <p className="text-sm sm:text-base font-sans text-gray-300 max-w-xl mt-1 leading-relaxed">
            Safety, transparency, and non-custodial cryptographic guarantees built into the foundation of the DemoBull protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {securityFeatures.map((sec, idx) => (
            <div
              key={idx}
              className="glass-card-interactive p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#051108] to-[#020704] border border-[#00ff66]/20 hover:border-[#00ff66]/60 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 group-hover:border-[#00ff66]/40 transition-colors">
                    <sec.icon className={`w-6 h-6 ${sec.color}`} />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    {sec.badge}
                  </span>
                </div>

                <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider mb-2.5">
                  {sec.title}
                </h3>
                <p className="text-xs font-sans text-gray-300 leading-relaxed">
                  {sec.description}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#00ff66] font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span>VERIFIED SECURE</span>
                </span>
                <span className="text-gray-500 font-normal">PROTOCOL V1</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
