"use client";

import React from "react";
import { MessageSquare, Send, Globe, Radio, ExternalLink } from "lucide-react";
import { CONFIG } from "@/config";

export default function Community() {
  const channels = [
    {
      name: "𝕏 (TWITTER)",
      handle: "@DemoBullCoin",
      url: CONFIG.socials.xUrl,
      desc: "Live announcements, market telemetry, and alpha transmissions.",
      badge: "OFFICIAL 𝕏",
      color: "text-white",
    },
    {
      name: "TELEGRAM",
      handle: "t.me/DemoBullCoin",
      url: CONFIG.socials.telegramUrl,
      desc: "Connect with the orbital herd and engage with core contributors 24/7.",
      badge: "HERD CHAT",
      color: "text-[#38BDF8]",
    },
    {
      name: "DEXSCREENER",
      handle: "DEX Analytics",
      url: CONFIG.socials.dexScreenerUrl,
      desc: "Track on-chain liquidity pairs and real-time Solana volume.",
      badge: "CHART TELEMETRY",
      color: "text-[#00ff66]",
    },
    {
      name: "SOLSCAN EXPLORER",
      handle: "Solana Explorer",
      url: `https://solscan.io/account/${CONFIG.wallet.presaleAddress}`,
      desc: "Verify on-chain presale transactions transparently in real time.",
      badge: "ON-CHAIN LEDGER",
      color: "text-[#9945FF]",
    },
  ];

  return (
    <section id="community" className="section-shell bg-[#020503] relative overflow-hidden">
      <div className="ambient-glow-top" />
      <div className="ambient-glow-purple" />

      {/* Hero-matching scan-line overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,102,0.15) 2px, rgba(0,255,102,0.15) 3px)', backgroundSize: '100% 3px' }} />

      <div className="container-custom relative z-10">

        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 gap-3">
          <div className="status-badge">
            <Radio className="w-3.5 h-3.5 text-[#00ff66] animate-pulse" />
            <span>ORBITAL FREQUENCIES & DISPATCH</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            JOIN THE <span className="bg-gradient-to-r from-[#00ff66] to-[#14F195] bg-clip-text text-transparent">COMMUNITY</span>
          </h2>
          <p className="text-sm sm:text-base font-sans text-gray-300 max-w-2xl mt-1 leading-relaxed">
            The DemoBull mission is fueled by thousands of decentralized Solana bulls across the globe. Join the discussion and track live transmissions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {channels.map((c, idx) => (
            <a
              key={idx}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card-interactive p-7 rounded-2xl bg-gradient-to-b from-[#051108] to-[#020704] border border-white/10 hover:border-[#00ff66] transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 group-hover:text-[#00ff66] group-hover:border-[#00ff66]/40 transition-colors">
                    {c.badge}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#00ff66] transition-colors" />
                </div>

                <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider group-hover:text-[#00ff66] transition-colors mb-1.5">
                  {c.name}
                </h3>
                <div className="text-xs font-mono text-[#00ff66] font-bold mb-3">
                  {c.handle}
                </div>
                <p className="text-xs font-sans text-gray-300 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-white/10 text-xs font-mono text-gray-400 group-hover:text-white transition-colors flex items-center justify-between">
                <span>CONNECT TO FREQUENCY</span>
                <span className="text-[#00ff66]">›</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
