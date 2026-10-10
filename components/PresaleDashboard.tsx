"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  ShieldCheck,
  Sparkles,
  Zap,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
} from "lucide-react";

import {
  CONFIG,
  AMOUNT_CONFIG,
  PRICE_CONFIG,
  PRESALE_BONUS_TIERS,
  getDynamicPresaleMetrics,
  PRESALE_SCHEDULE_CONFIG,
} from "@/config";
import BuyPresale from "./BuyPresale";
import { terminalAudio } from "@/audio/terminalAudio";

const pad = (num: number) => num.toString().padStart(2, "0");

export default function PresaleDashboard() {
  const [metrics, setMetrics] = useState(getDynamicPresaleMetrics());
  const [selectedSol, setSelectedSol] = useState<string>("1.0");
  const [timeLeft, setTimeLeft] = useState(() => {
    const target = new Date(PRESALE_SCHEDULE_CONFIG.anchorEndTime).getTime();
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds, isEnded: diff <= 0 };
  });

  useEffect(() => {
    const target = new Date(PRESALE_SCHEDULE_CONFIG.anchorEndTime).getTime();
    const timer = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds, isEnded: diff <= 0 });
      setMetrics(getDynamicPresaleMetrics());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectTier = (solStr: string) => {
    setSelectedSol(solStr);
    terminalAudio.playClick();
    terminalAudio.playSurge();
    const el = document.getElementById("buy-module");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="presale" className="section-shell bg-transparent relative">
      {/* Background ambient lighting */}

      <div className="container-custom relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 gap-3">
          <div className="status-badge">
            <span className="status-dot status-dot-pulse" />
            <span>STAGE 1 LIVE • EXCLUSIVE BONUS MULTIPLIERS</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight">
            PRESALE <span className="bg-gradient-to-r from-[#00ff66] to-[#14F195] bg-clip-text text-transparent">DASHBOARD</span>
          </h2>
          <p className="text-sm sm:text-base font-sans text-gray-300 max-w-2xl mt-1 leading-relaxed">
            Secure your $DEMOBULL allocation at Stage 1 fixed valuation before Raydium liquidity deployment. Tiered milestone bonuses apply automatically.
          </p>
        </div>

        {/* Global Progress Metric Box */}
        <div className="glass-panel-elevated p-6 sm:p-8 mb-12 relative overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center border-b border-white/10 pb-6 mb-6">
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">
                TOTAL RAISED (STAGE 1):
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black text-white block mt-1">
                ${metrics.currentBaselineUsd.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-[#00ff66] font-bold block mt-1">
                HARD CAP: {AMOUNT_CONFIG.hardCapFormatted}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">
                TOKEN PRICE:
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black text-[#00ff66] block mt-1">
                $0.000001
              </span>
              <span className="text-[11px] font-mono text-[#9945FF] font-bold block mt-1">
                LISTING: $0.001 (1,000X TARGET)
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">
                PRESALE ALLOCATION:
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black text-white block mt-1">
                8,000,000,000
              </span>
              <span className="text-[11px] font-mono text-gray-400 block mt-1">
                80% OF TOTAL 10B SUPPLY
              </span>
            </div>

            <div className="flex flex-col items-start lg:items-end">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">
                MISSION COUNTDOWN:
              </span>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-[#00ff66] flex items-center gap-1.5 mt-1">
                <Clock className="w-5 h-5 text-[#00ff66] animate-pulse shrink-0" />
                <span>
                  {timeLeft.days}D {pad(timeLeft.hours)}H {pad(timeLeft.minutes)}M {pad(timeLeft.seconds)}S
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 block mt-1">
                ANCHOR: OCTOBER 2026
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-white font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#00ff66] animate-pulse" />
                PRESALE PROGRESSION: {metrics.currentBaselinePercent.toFixed(1)}%
              </span>
              <span className="text-[#00ff66] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" />
                SOFT CAP MET ($500K) ✓
              </span>
            </div>

            <div className="w-full h-4 bg-black/80 rounded-full border border-white/15 p-0.5 relative overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#9945FF] via-[#00ff66] to-[#39ff88] transition-all duration-700 shadow-[0_0_20px_rgba(0,255,102,0.7)]"
                style={{ width: `${metrics.currentBaselinePercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>0% LAUNCH</span>
              <span className="text-[#00ff66]">SOFT CAP: $500,000 (MET)</span>
              <span>HARD CAP: $1,000,000</span>
            </div>
          </div>
        </div>

        {/* Tier Cards Matrix */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00ff66]" />
                <span>OFFICIAL TIER BONUS MATRIX</span>
              </h3>
              <p className="text-xs font-mono text-gray-400 mt-0.5">
                Click any tier to auto-fill the deposit calculator below
              </p>
            </div>
            <div className="text-xs font-mono text-[#00ff66] font-bold">
              PRESALE ONLY • BONUS APPLIED INSTANTLY
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {PRESALE_BONUS_TIERS.map((tier) => {
              const isSelected = selectedSol === tier.solAmountStr;
              return (
                <div
                  key={tier.id}
                  onClick={() => handleSelectTier(tier.solAmountStr)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all relative flex flex-col justify-between ${isSelected
                      ? "bg-[#06180c] border-2 border-[#00ff66] shadow-[0_0_25px_rgba(0,255,102,0.35)] scale-[1.02]"
                      : tier.isPopular
                        ? "bg-[#040e07] border border-[#00ff66]/60 hover:border-[#00ff66] hover:scale-[1.01]"
                        : "bg-[#030905]/80 border border-white/10 hover:border-[#00ff66]/50 hover:scale-[1.01]"
                    }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-gray-300">
                        TIER {pad(tier.id)} • {tier.solAmount} SOL
                      </span>
                      <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border ${tier.badgeColor}`}>
                        {tier.badge}
                      </span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-mono font-black text-[#00ff66] my-1">
                      {tier.totalTokensFormatted}
                    </div>
                    <div className="text-xs font-mono text-gray-300">
                      {tier.bonusFormatted}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span>Valuation at Listing:</span>
                    <span className="text-white font-bold">
                      ${(tier.totalTokens * 0.001).toLocaleString()} USD
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Direct Buy Presale Module */}
        <div id="buy-module" className="max-w-3xl mx-auto">
          <BuyPresale initialSol={selectedSol} />
        </div>

      </div>
    </section>
  );
}
