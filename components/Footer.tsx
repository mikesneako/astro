"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CONFIG, SITE_CONFIG } from "@/config";
import { terminalAudio } from "@/audio/terminalAudio";

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-[#00ff66]/20 py-12 sm:py-16 text-gray-400 font-mono text-xs">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">

          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-full border border-[#00ff66]/60 p-0.5 bg-black shadow-[0_0_15px_rgba(0,255,102,0.3)] overflow-hidden shrink-0">
                <Image
                  src="/logo.png"
                  alt="DemoBull"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <span className="font-mono text-base font-black text-white tracking-wider">
                DEMOBULL <span className="text-[#00ff66]">$DEMOBULL</span>
              </span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              The deep space Solana-native presale launchpad capturing the next crypto bull supercycle.
            </p>
            <div className="text-[10px] text-[#00ff66] font-bold">
              SOLANA SPL PROTOCOL // ORBIT V1.0
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <div className="text-white font-bold uppercase tracking-wider mb-3 text-xs">
              PROTOCOL
            </div>
            <ul className="space-y-2 text-xs">
              {SITE_CONFIG.navLinks.slice(0, 4).map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    onClick={() => terminalAudio.playClick()}
                    className="hover:text-[#00ff66] transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Intel */}
          <div>
            <div className="text-white font-bold uppercase tracking-wider mb-3 text-xs">
              INTEL
            </div>
            <ul className="space-y-2 text-xs">
              {SITE_CONFIG.navLinks.slice(4).map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    onClick={() => terminalAudio.playClick()}
                    className="hover:text-[#00ff66] transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Telemetry */}
          <div>
            <div className="text-white font-bold uppercase tracking-wider mb-3 text-xs">
              TELEMETRY NODE
            </div>
            <div className="space-y-1.5 text-xs text-gray-400">
              <div>CARRIER: {CONFIG.telemetry.carrierFreq}</div>
              <div>NODE ID: {CONFIG.telemetry.nodeId}</div>
              <div>NETWORK: SOLANA MAINNET</div>
              <div>STATUS: TRANSMITTING ORBITAL SIGNAL</div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div>
            © 2026 DEMOBULL ($DEMOBULL) PROTOCOL. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <a href={CONFIG.socials.xUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#00ff66]">
              𝕏 / TWITTER
            </a>
            <a href={CONFIG.socials.telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#00ff66]">
              TELEGRAM
            </a>
            <a href={CONFIG.socials.dexScreenerUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#00ff66]">
              DEXSCREENER
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
