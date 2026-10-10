"use client";

import React from "react";
import Link from "next/link";
import { Zap, Gift } from "lucide-react";
import { terminalAudio } from "@/audio/terminalAudio";

export default function StickyMobileCta() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#020704]/95 border-t border-[#00ff66]/25 p-3 backdrop-blur-2xl flex items-center gap-2.5 shadow-[0_-10px_30px_rgba(0,0,0,0.9)]">
      <Link
        href="#presale"
        onClick={() => {
          terminalAudio.playClick();
          terminalAudio.playSurge();
        }}
        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#14F195] text-black font-mono font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,102,0.4)] active:scale-[0.98] transition-all"
      >
        <Zap className="w-3.5 h-3.5 fill-black" />
        <span>BUY $DEMOBULL</span>
      </Link>

      <Link
        href="#airdrop"
        onClick={() => {
          terminalAudio.playClick();
          terminalAudio.playScan();
        }}
        className="flex-1 py-3 px-3 rounded-xl bg-[#06140b] border border-[#00ff66]/40 text-[#00ff66] font-mono font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
      >
        <Gift className="w-3.5 h-3.5 text-[#00ff66]" />
        <span>AIRDROP (200K)</span>
      </Link>
    </div>
  );
}
