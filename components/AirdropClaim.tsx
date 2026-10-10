"use client";

import React, { useState, useEffect } from "react";
import { Gift, Sparkles, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { AMOUNT_CONFIG, CONFIG } from "@/config";
import { terminalAudio } from "@/audio/terminalAudio";

interface ClaimFeedItem {
  id: number;
  wallet_address: string;
  amount: number;
  created_at: string;
}

export default function AirdropClaim() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    status?: string;
    message: string;
  } | null>(null);

  const [stats, setStats] = useState({
    totalClaims: 4120,
    totalTokensAllocated: 824000000,
  });

  const [recentClaims, setRecentClaims] = useState<ClaimFeedItem[]>([
    { id: 1, wallet_address: "7xK3mN82vLt9QmP1", amount: 200000, created_at: "Just now" },
    { id: 2, wallet_address: "9bV2kZa2wP98hXc4", amount: 200000, created_at: "1m ago" },
    { id: 3, wallet_address: "6tL41mQy8yR73pKs", amount: 200000, created_at: "2m ago" },
    { id: 4, wallet_address: "5kM14zWq3dF67nJx", amount: 200000, created_at: "3m ago" },
    { id: 5, wallet_address: "8pQ72mNx4vRt9KmY", amount: 200000, created_at: "4m ago" },
  ]);

  useEffect(() => {
    fetch("/api/airdrop/claim")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.stats) setStats(data.stats);
          if (data.recentClaims && data.recentClaims.length > 0) {
            setRecentClaims(data.recentClaims);
          }
        }
      })
      .catch(() => { });
  }, []);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.trim()) return;

    setLoading(true);
    setResult(null);
    terminalAudio.playClick();
    terminalAudio.playScan();

    try {
      const res = await fetch("/api/airdrop/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: wallet.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        terminalAudio.playSurge();
        setResult({
          success: true,
          status: data.status,
          message:
            data.status === "ALREADY_CLAIMED"
              ? "This wallet is already registered! Allocation confirmed in ledger."
              : `Success! 200,000 $DEMOBULL allocated to your address in database.`,
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to process claim. Please check your address format.",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Failed to connect to cluster API. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="airdrop" className="section-shell bg-transparent relative">

      <div className="container-custom relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 gap-3">
          <div className="status-badge">
            <Gift className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>COMMUNITY AIRDROP PORTAL</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight">
            CLAIM <span className="bg-gradient-to-r from-[#00ff66] via-[#14F195] to-[#38BDF8] bg-clip-text text-transparent">200,000 $DEMOBULL</span>
          </h2>
          <p className="text-sm sm:text-base font-sans text-gray-300 max-w-2xl mt-1 leading-relaxed">
            Free community allocation for early Solana bulls. Enter your wallet address to register your 200,000 $DEMOBULL allocation ($200 listing target value).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">

          {/* Left Column: Claim Box */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#06140b] to-[#030905] border border-[#00ff66]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <span className="text-xs font-mono font-bold text-[#00ff66] flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00ff66] rounded-full animate-ping" />
                <span>CLAIM ALLOCATION:</span>
              </span>
              <span className="text-xs font-mono text-gray-400 font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                1 CLAIM PER WALLET
              </span>
            </div>

            <form onSubmit={handleClaim} className="space-y-5">
              <div>
                <label className="text-xs font-mono text-gray-200 font-bold block mb-2">
                  SOLANA WALLET ADDRESS (BASE58):
                </label>
                <div className="bg-[#020603] rounded-xl border border-white/15 focus-within:border-[#00ff66] transition-all p-1">
                  <input
                    type="text"
                    placeholder="Paste your Phantom, Solflare, or Backpack address..."
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    className="w-full bg-transparent px-3.5 py-3 text-xs sm:text-sm font-mono text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#14F195] hover:from-[#39ff88] hover:to-[#22e890] text-black font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_25px_rgba(0,255,102,0.4)] active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>RECORDING IN DATABASE...</span>
                  </>
                ) : (
                  <>
                    <span>CLAIM 200,000 $DEMOBULL</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </form>

            {result && (
              <div
                className={`mt-5 p-4 rounded-xl border font-mono text-xs ${result.success
                    ? "bg-[#00ff66]/15 border-[#00ff66] text-[#00ff66]"
                    : "bg-red-950/40 border-red-500 text-red-300"
                  }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {result.success ? <CheckCircle2 className="w-4 h-4 text-[#00ff66]" /> : <AlertCircle className="w-4 h-4 text-yellow-400" />}
                  <span>{result.message}</span>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-gray-400 space-y-1.5">
              <p className="flex items-center gap-2">
                <span className="text-[#00ff66]">✓</span> Allocation is stored in decentralized Supabase PostgreSQL database.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#00ff66]">✓</span> Distributed directly to your registered wallet address at DEX launch.
              </p>
            </div>
          </div>

          {/* Right Column: Live Feed & Telemetry */}
          <div className="lg:col-span-5 space-y-5">
            {/* Global Stats */}
            <div className="p-6 rounded-2xl bg-[#040e07] border border-[#00ff66]/30 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1 font-bold">
                TOTAL AIRDROP CLAIMS:
              </span>
              <div className="text-3xl font-mono font-black text-white my-1">
                {stats.totalClaims.toLocaleString()} WALLETS
              </div>
              <div className="text-xs font-mono text-[#00ff66] font-bold flex items-center gap-1.5 mt-2">
                <Zap className="w-3.5 h-3.5 text-[#00ff66]" />
                <span>{stats.totalTokensAllocated.toLocaleString()} $DEMOBULL ALLOCATED</span>
              </div>
            </div>

            {/* Live Feed */}
            <div className="p-6 rounded-2xl bg-[#030905] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs font-mono">
                <span className="text-[#00ff66] font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
                  <span>LIVE CLAIM STREAM</span>
                </span>
                <span className="text-gray-400">200K / CLAIM</span>
              </div>

              <div className="space-y-2.5">
                {recentClaims.slice(0, 5).map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs font-mono p-2.5 rounded-xl bg-black/60 border border-white/5"
                  >
                    <span className="text-gray-300 font-semibold truncate max-w-[150px]">
                      {c.wallet_address.slice(0, 6)}...{c.wallet_address.slice(-4)}
                    </span>
                    <span className="text-[#00ff66] font-bold">
                      +{c.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
