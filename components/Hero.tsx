"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, Check, Zap, Gift, ShieldCheck, Flame, ArrowUpRight, Sparkles } from "lucide-react";
import { AstronautCountdownRing } from "./AstronautCountdownRing";
import { CONFIG, PRESALE_WALLET_ADDRESS, AMOUNT_CONFIG, getDynamicPresaleMetrics } from "@/config";
import { terminalAudio } from "@/audio/terminalAudio";

export default function Hero() {
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 500,
  });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0 });
  const [copied, setCopied] = useState(false);
  const [metrics, setMetrics] = useState(getDynamicPresaleMetrics());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const nx = (e.clientX - centerX) / (centerX || 1);
      const ny = (e.clientY - centerY) / (centerY || 1);
      setTilt({
        rx: -ny * 5,
        ry: nx * 6,
        tx: nx * 10,
        ty: ny * 6,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(PRESALE_WALLET_ADDRESS).catch(() => { });
    setCopied(true);
    terminalAudio.playCopy();
    setTimeout(() => setCopied(false), 2400);
  };

  const tickerItems = [
    "🚀 STAGE 1 PRESALE IS LIVE",
    "⚡ 10,000,000,000 HARD-CAPPED SUPPLY",
    "🐂 80% PRESALE ALLOCATION",
    "🔥 100% LP TOKENS BURNED FOREVER",
    "🛡️ MINT AUTHORITY REVOKED",
    "⚡ 400MS SOLANA HYPERSPEED",
    "⭐ 1,000X LISTING TARGET: $0.001",
    "💎 UP TO +300% WHALE BONUS",
    "🎁 200,000 $ASTROBULL COMMUNITY AIRDROP",
    "🔒 AUDITED SPL PROGRAM LOGIC",
  ];

  return (
    <section
      id="orbit"
      className="relative w-full pt-32 sm:pt-36 md:pt-40 lg:pt-44 xl:pt-48 pb-0 overflow-hidden flex flex-col justify-between"
    >

      {/* 2. Atmospheric Nebula Radial Glows */}

      {/* 3. Main Hero Content Container */}
      <div className="container-custom relative z-10 w-full pb-12 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">

          {/* Left Column: Headline, Value Proposition, Action Triggers */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">

            {/* Live Stage 1 Status Badge */}
            <div className="status-badge">
              <span className="status-dot status-dot-pulse" />
              <span>STAGE 1 LIVE • FIXED VALUATION $0.000001</span>
              <span className="text-gray-500">•</span>
              <span className="text-[#39ff88] font-bold">{metrics.currentBaselinePercent}% FILLED</span>
            </div>

            {/* Massive Impactful Heading */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-[1.06]">
              THE DEEP SPACE <br />
              <span className="gradient-text-solana">
                BULL MARKET
              </span> <br />
              HAS ARRIVED
            </h1>

            {/* Project Thesis & Description */}
            <p className="text-gray-300 font-sans text-base sm:text-lg max-w-xl leading-relaxed">
              DemoBull (<span className="text-[#00ff66] font-mono font-bold">$DEMOBULL</span>) is the deep space Solana-native presale launchpad engineered for orbital momentum and 1,000X trajectory. 10B Hard Cap, 80% community allocation, and zero team dumping.
            </p>

            {/* Key Rate Highlight Box */}
            <div className="w-full max-w-lg p-4 sm:p-5 rounded-2xl bg-black/75 border border-[#00ff66]/30 backdrop-blur-md grid grid-cols-2 gap-4 text-left shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-bold">
                  STAGE 1 PRESALE RATE:
                </span>
                <span className="text-sm sm:text-base font-mono font-black text-[#00ff66] block mt-0.5">
                  1 SOL = 200,000,000 $ASTRO
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-bold">
                  RAYDIUM LISTING TARGET:
                </span>
                <span className="text-sm sm:text-base font-mono font-black text-white flex items-center gap-1 mt-0.5">
                  $0.001 <span className="text-xs text-[#14F195] font-bold">(1,000X)</span>
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto pt-1">
              <Link
                href="#presale"
                onClick={() => {
                  terminalAudio.playClick();
                  terminalAudio.playSurge();
                }}
                className="w-full sm:w-auto btn-primary-neon"
                style={{ color: "#000000", fontWeight: 900 }}
              >
                <Zap className="w-4 h-4 fill-black text-black" />
                <span style={{ color: "#000000" }}>JOIN PRESALE (STAGE 1)</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </Link>

              <Link
                href="#airdrop"
                onClick={() => {
                  terminalAudio.playClick();
                  terminalAudio.playScan();
                }}
                className="w-full sm:w-auto btn-secondary-glass"
              >
                <Gift className="w-4 h-4 text-[#00ff66]" />
                <span>CLAIM 200,000 AIRDROP</span>
              </Link>
            </div>

            {/* Presale CA Copy Bar */}
            <div className="w-full max-w-lg pt-1">
              <div
                onClick={handleCopyWallet}
                className="w-full group px-4 py-3 rounded-xl bg-black/80 hover:bg-black border border-white/15 hover:border-[#00ff66]/70 transition-all flex items-center justify-between gap-2 cursor-pointer text-left shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
                title="Click to copy official Solana Presale Address"
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#00ff66] shrink-0 animate-pulse" />
                  <span className="text-xs font-mono text-gray-400 font-bold shrink-0">
                    PRESALE CA:
                  </span>
                  <span className="text-xs font-mono text-gray-200 group-hover:text-[#00ff66] transition-colors truncate">
                    {PRESALE_WALLET_ADDRESS}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg bg-[#00ff66]/15 border border-[#00ff66]/40 text-xs font-mono font-bold text-[#00ff66]">
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#00ff66]" />
                      <span>COPY</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Live Progress Mini Bar */}
            <div className="w-full max-w-lg flex items-center justify-between text-xs font-mono text-gray-400 pt-0.5">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Flame className="w-3.5 h-3.5 text-[#00ff66] animate-pulse" />
                ${metrics.currentBaselineUsd.toLocaleString()} RAISED
              </span>
              <span className="text-[#00ff66] font-bold">
                HARD CAP: {AMOUNT_CONFIG.hardCapFormatted}
              </span>
            </div>

          </div>

          {/* Right Column: The Levitating Astronaut Hero + Circular Countdown Dial */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[440px] sm:min-h-[500px] w-full px-2 sm:px-4">

            {/* Atmospheric Green Halo */}
            <div className="absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full bg-radial from-[#00ff66]/20 via-[#00ff66]/5 to-transparent blur-3xl pointer-events-none" />

            {/* Astronaut Anchor Container */}
            <div
              className="relative w-full max-w-[400px] sm:max-w-[450px] lg:max-w-[420px] xl:max-w-[460px] aspect-square flex items-center justify-center"
              style={{
                transform: `translate3d(${tilt.tx}px, ${tilt.ty}px, 0) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transformStyle: "preserve-3d",
                perspective: 1000,
                transition: "transform 0.15s ease-out",
              }}
            >
              {/* Circular Countdown Dial Encircling Character */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <AstronautCountdownRing isSurging={false} />
              </div>

              {/* Floating Official Badge Seal (Top Right) */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 group cursor-pointer" title="AstroBull Certified Solana Project">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#00ff66] p-0.5 bg-black shadow-[0_0_25px_rgba(0,255,102,0.6)] overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_35px_rgba(0,255,102,0.8)]">
                  <Image
                    src="/logo.png"
                    alt="AstroBull Certified Seal"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="hidden sm:block absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-black/90 border border-[#00ff66]/50 text-[8px] font-mono font-bold text-[#00ff66] shadow-sm">
                  CERTIFIED
                </div>
              </div>

              {/* Levitating Bull Character Wrapper */}
              <div className="animate-levitate relative z-20 select-none flex items-center justify-center">
                <img
                  src="/bull-astronaut-floating.png"
                  alt="AstroBull Levitating Astronaut Mascot"
                  draggable={false}
                  className="w-auto h-[320px] sm:h-[400px] max-w-[85vw] object-contain drop-shadow-[0_0_30px_rgba(0,255,102,0.4)]"
                />

                {/* Left Boot Thruster Glow */}
                <div
                  className="absolute bottom-5 left-[36%] w-3.5 h-3.5 rounded-full bg-[#00ff66] blur-[3px] animate-thruster pointer-events-none"
                  style={{ boxShadow: "0 0 20px #00ff66, 0 0 35px #00ff66" }}
                />
                {/* Right Boot Thruster Glow */}
                <div
                  className="absolute bottom-4 right-[34%] w-3.5 h-3.5 rounded-full bg-[#00ff66] blur-[3px] animate-thruster pointer-events-none"
                  style={{
                    boxShadow: "0 0 20px #00ff66, 0 0 35px #00ff66",
                    animationDelay: "0.4s",
                  }}
                />
              </div>

              {/* Glowing Energy Disk Below Character */}
              <div className="absolute bottom-2 w-52 sm:w-64 h-12 rounded-full bg-gradient-to-r from-transparent via-[#00ff66]/40 to-transparent border border-[#00ff66]/35 blur-[2px] pointer-events-none z-10" />
            </div>

          </div>

        </div>
      </div>

      {/* 4. Bottom Infinite Protocol Telemetry Ticker */}
      <div className="relative z-10 w-full bg-[#020603]/95 border-y border-[#00ff66]/20 backdrop-blur-md py-2.5 overflow-hidden select-none">
        <div className="animate-ticker flex items-center gap-8 text-xs font-mono font-bold text-gray-300">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 shrink-0">
              <span className="text-[#00ff66]">{item}</span>
              <span className="text-gray-600 font-normal">//</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
