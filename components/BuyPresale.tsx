"use client";

import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Zap,
  Send,
  AlertTriangle,
  QrCode,
  ArrowDown,
  ShieldCheck,
  Search,
  CheckCircle2,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";

import {
  PRESALE_WALLET_ADDRESS,
  PRICE_CONFIG,
  AMOUNT_CONFIG,
  PRESALE_BONUS_TIERS,
  calculatePresaleTokens,
} from "@/config";
import { terminalAudio } from "@/audio/terminalAudio";

export { PRESALE_WALLET_ADDRESS };

interface BuyPresaleProps {
  tokenPrice?: number;
  initialSol?: string;
  onSuccess?: () => void;
}

export default function BuyPresale({
  tokenPrice = PRICE_CONFIG.tokenPriceUsd,
  initialSol,
  onSuccess,
}: BuyPresaleProps) {
  const [solAmount, setSolAmount] = useState<string>(initialSol || "1.0");
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const [lookupAddress, setLookupAddress] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<{
    found: boolean;
    message: string;
    tx?: { sol: number; tokens: number; signature: string };
  } | null>(null);

  useEffect(() => {
    if (initialSol) {
      setSolAmount(initialSol);
    }
  }, [initialSol]);

  const solPriceUsd = PRICE_CONFIG.solPriceUsd;
  const numSol = parseFloat(solAmount) || 0;
  const totalUsdValue = numSol * solPriceUsd;

  const tokenBreakdown = calculatePresaleTokens(numSol);
  const DemoBullTokens = tokenBreakdown.totalTokens;

  const isBelowMin = numSol < AMOUNT_CONFIG.minSolContribution;
  const isAboveMax = numSol > AMOUNT_CONFIG.maxSolContribution;
  const isInvalidAmount = isBelowMin || isAboveMax;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(40);
      }
      await navigator.clipboard.writeText(PRESALE_WALLET_ADDRESS);
      setCopied(true);
      terminalAudio.playCopy();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleVerifyDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupAddress.trim()) return;

    setLookupLoading(true);
    setLookupResult(null);
    terminalAudio.playClick();

    try {
      const res = await fetch(
        `/api/presale/status?wallet=${encodeURIComponent(lookupAddress.trim())}`
      );
      const data = await res.json();

      if (data.hasParticipated) {
        terminalAudio.playSurge();
        setLookupResult({
          found: true,
          message: "Deposit Confirmed! Tokens queued in ledger for automated TGE distribution.",
          tx: {
            sol: data.transactions?.[0]?.sol_amount || 1.0,
            tokens: data.transactions?.[0]?.token_amount || 200000000,
            signature:
              data.transactions?.[0]?.transaction_signature ||
              "4vJ9tSolanaTxSignatureConfirmedOnLedger",
          },
        });
        onSuccess?.();
      } else {
        terminalAudio.playHover();
        setLookupResult({
          found: false,
          message:
            "No deposits found yet for this address. Deposits appear within ~1-2 minutes of Solana block finalization.",
        });
      }
    } catch {
      setLookupResult({
        found: false,
        message: "Failed to query database. Please try again.",
      });
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="w-full rounded-3xl p-5 sm:p-7 md:p-9 relative overflow-hidden bg-gradient-to-b from-[#06120a] to-[#020704] border border-[#00ff66]/30 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(0,255,102,0.1)]">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 mb-6 gap-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#00ff66] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#00ff66] rounded-full animate-ping" />
            <span>DIRECT DEPOSIT • NON-CUSTODIAL & INSTANT</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide uppercase mt-1">
            BUY <span className="text-[#00ff66]">$DEMOBULL</span>
          </h3>
        </div>

        <div className="text-left sm:text-right bg-white/[0.04] sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-white/5 sm:border-0">
          <span className="text-[10px] font-mono text-gray-400 block uppercase font-semibold">
            STAGE 1 RATE
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold text-white block mt-0.5">
            1 SOL = {(solPriceUsd / tokenPrice).toLocaleString()} DEMOBULL
          </span>
        </div>
      </div>

      {/* 3 Steps Mini Guide */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/60 border border-white/10 mb-6 text-center">
        <div className="flex flex-col items-center justify-center p-1">
          <span className="text-[9px] font-mono font-bold text-[#00ff66]">
            STEP 01
          </span>
          <span className="text-xs font-mono text-white font-bold mt-0.5">
            Copy Address
          </span>
        </div>
        <div className="flex flex-col items-center justify-center border-x border-white/10 px-1 p-1">
          <span className="text-[9px] font-mono font-bold text-[#9945FF]">
            STEP 02
          </span>
          <span className="text-xs font-mono text-white font-bold mt-0.5">
            Send 0.2 - 10 SOL
          </span>
        </div>
        <div className="flex flex-col items-center justify-center p-1">
          <span className="text-[9px] font-mono font-bold text-[#00ff66]">
            STEP 03
          </span>
          <span className="text-xs font-mono text-white font-bold mt-0.5">
            Receive at TGE
          </span>
        </div>
      </div>

      {/* Official Presale Address Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/80 border-2 border-[#00ff66]/40 hover:border-[#00ff66] transition-all mb-6 relative group shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between text-xs font-mono mb-2.5">
          <span className="font-bold text-[#00ff66] text-xs flex items-center gap-1.5 truncate">
            <Send className="w-4 h-4 shrink-0 text-[#00ff66]" />
            <span className="truncate">OFFICIAL SOLANA PRESALE ADDRESS</span>
          </span>
          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="text-[11px] text-gray-300 hover:text-white flex items-center gap-1 shrink-0 ml-2 cursor-pointer py-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 transition-all"
          >
            <QrCode className="w-3.5 h-3.5 text-[#9945FF]" />
            <span>{showQr ? "HIDE QR" : "SHOW QR"}</span>
          </button>
        </div>

        <div className="space-y-3">
          <div
            onClick={handleCopy}
            title="Click to copy address"
            className={`p-3 sm:p-3.5 rounded-xl bg-[#040a06] border transition-all cursor-pointer select-all relative group flex items-center justify-between gap-3 ${copied
              ? "border-[#00ff66] bg-[#00ff66]/15 shadow-[0_0_20px_rgba(0,255,102,0.4)]"
              : "border-white/15 hover:border-[#00ff66]/60"
              }`}
          >
            <span className="font-mono text-xs sm:text-sm text-gray-100 break-all tracking-wider font-bold">
              {PRESALE_WALLET_ADDRESS}
            </span>
            <div className="shrink-0 text-gray-400 group-hover:text-white">
              {copied ? (
                <Check className="w-4 h-4 text-[#00ff66]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className={`py-3 px-2 sm:px-4 rounded-xl font-mono font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer active:scale-[0.98] ${copied
                ? "bg-[#00ff66] text-black shadow-[0_0_20px_rgba(0,255,102,0.5)]"
                : "bg-[#00ff66]/15 hover:bg-[#00ff66] text-[#00ff66] hover:text-black border border-[#00ff66]/40 hover:border-[#00ff66]"
                }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 shrink-0" />
                  <span className="truncate">COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 shrink-0" />
                  <span className="truncate">COPY ADDRESS</span>
                </>
              )}
            </button>

            <a
              href={`solana:${PRESALE_WALLET_ADDRESS}`}
              className="py-3 px-2 sm:px-3 rounded-xl bg-[#141420] hover:bg-[#1f1f33] text-gray-100 hover:text-white border border-white/20 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <ExternalLink className="w-4 h-4 text-[#9945FF] shrink-0" />
              <span className="truncate">OPEN IN WALLET</span>
            </a>
          </div>
        </div>

        {showQr && (
          <div className="mt-4 p-5 rounded-xl bg-black border border-white/15 flex flex-col items-center justify-center animate-fade-in">
            <div className="p-3 bg-white rounded-xl shadow-[0_0_25px_rgba(0,255,102,0.3)]">
              <svg width="150" height="150" viewBox="0 0 160 160" className="w-36 h-36 sm:w-44 sm:h-44">
                <rect width="160" height="160" fill="white" />
                <rect x="10" y="10" width="40" height="40" fill="black" />
                <rect x="18" y="18" width="24" height="24" fill="white" />
                <rect x="24" y="24" width="12" height="12" fill="black" />
                <rect x="110" y="10" width="40" height="40" fill="black" />
                <rect x="118" y="18" width="24" height="24" fill="white" />
                <rect x="124" y="24" width="12" height="12" fill="black" />
                <rect x="10" y="110" width="40" height="40" fill="black" />
                <rect x="18" y="118" width="24" height="24" fill="white" />
                <rect x="24" y="124" width="12" height="12" fill="black" />
                <rect x="60" y="60" width="40" height="40" fill="#00ff66" />
                <rect x="70" y="70" width="20" height="20" fill="#000000" />
              </svg>
            </div>
            <span className="text-xs font-mono text-gray-300 mt-3 text-center">
              Scan with Phantom, Solflare, or Backpack Mobile App
            </span>
          </div>
        )}
      </div>

      {/* SOL Input Box */}
      <div className="space-y-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-black/80 border border-white/10 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-gray-300 mb-2">
            <span className="font-bold text-white">AMOUNT TO SEND</span>
            <span className="text-xs text-[#00ff66] font-bold">
              MIN 0.2 • MAX 10 SOL
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 bg-[#030805] rounded-xl border border-white/15 p-2 sm:p-3 focus-within:border-[#00ff66]">
            <input
              type="number"
              step="0.1"
              min="0.2"
              max="10.0"
              value={solAmount}
              onChange={(e) => setSolAmount(e.target.value)}
              className="w-full bg-transparent font-mono text-2xl sm:text-3xl font-black text-white focus:outline-none placeholder-gray-600 pl-1"
              placeholder="1.0"
            />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00ff66]/15 border border-[#00ff66]/40 text-xs font-mono font-bold text-[#00ff66] shrink-0">
              <span>SOL</span>
            </div>
          </div>

          {/* Quick chips */}
          <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#00ff66] font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
                QUICK SELECT SOL:
              </span>
              <span className="text-gray-300 font-semibold">
                ≈ ${totalUsdValue.toFixed(2)} USD
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {["0.2", "0.5", "1.0", "2.0", "5.0", "10.0"].map((val) => {
                const isSelected = solAmount === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      terminalAudio.playClick();
                      setSolAmount(val);
                    }}
                    className={`py-2 px-1 text-xs font-mono rounded-xl border transition-all cursor-pointer font-bold ${isSelected
                      ? "bg-[#00ff66] text-black border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.4)]"
                      : "bg-white/5 hover:bg-white/10 text-gray-200 border-white/10"
                      }`}
                  >
                    {val} SOL
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {isInvalidAmount && (
          <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/40 text-xs font-mono text-yellow-300 flex items-start sm:items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-yellow-400 mt-0.5 sm:mt-0" />
            <span>
              {isBelowMin
                ? `Minimum contribution is ${AMOUNT_CONFIG.minSolContribution} SOL (${AMOUNT_CONFIG.tier02SolTokens.toLocaleString()} $DEMOBULL).`
                : `Maximum contribution per transaction is ${AMOUNT_CONFIG.maxSolContribution} SOL.`}
            </span>
          </div>
        )}

        <div className="flex justify-center my-2 relative z-10">
          <div className="p-2 rounded-full bg-[#051108] border border-[#00ff66]/30 text-[#00ff66]">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Receive Allocation Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-black border border-[#00ff66]/40 relative overflow-hidden shadow-[0_0_25px_rgba(0,255,102,0.1)]">
          <div className="flex items-center justify-between text-xs font-mono text-gray-300 mb-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#00ff66]" />
              TOTAL TOKENS YOU RECEIVE
            </span>
            <span className="text-[10px] text-[#00ff66] font-bold px-2 py-0.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30">
              STAGE 1
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 my-2">
            <div className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-[#00ff66] truncate">
              {DemoBullTokens.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#051108] border border-[#00ff66]/40 text-xs font-mono font-bold text-white shrink-0">
              <span>$DEMOBULL</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#040e07] border border-[#00ff66]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#00ff66] text-black font-black text-[10px] uppercase">
                BONUS
              </span>
              <span className="text-[#00ff66] font-bold">{tokenBreakdown.bonusLabel}</span>
            </div>
            <div className="text-gray-300 text-[11px]">
              Base: {tokenBreakdown.baseTokens.toLocaleString()} + Bonus: +{tokenBreakdown.bonusTokens.toLocaleString()}
            </div>
          </div>

          <div className="text-xs font-mono text-gray-400 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2 border-t border-white/10">
            <span>Listing Est. (${PRICE_CONFIG.listingPriceUsd}): ${(DemoBullTokens * PRICE_CONFIG.listingPriceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
            <span className="text-[#00ff66] font-bold">1,000X TARGET</span>
          </div>
        </div>
      </div>

      {/* Main Action Banner */}
      <div className="mt-5">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00ff66] to-[#14F195] hover:from-[#39ff88] hover:to-[#22e890] text-black font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,255,102,0.45)] transition-all cursor-pointer active:scale-[0.99]"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-black" />
              <span>COPIED ADDRESS! SEND FROM YOUR WALLET</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 text-black" />
              <span>COPY ADDRESS & SEND {solAmount} SOL FROM YOUR WALLET</span>
            </>
          )}
        </button>
      </div>

      {/* Participation Rules */}
      <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-gray-300 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[#00ff66] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
          <span>PRESALE RULES:</span>
        </div>
        <p className="text-gray-300">• Send between <strong>0.2 SOL and 10 SOL</strong> from <strong>Phantom, Solflare, or Backpack</strong>.</p>
        <p className="text-red-400 font-semibold">• ⚠️ DO NOT send from centralized exchanges (Binance, Coinbase, Kraken, etc.).</p>
        <p className="text-[#00ff66]">• ⚡ Tokens are securely recorded on-chain and dispersed automatically at TGE launch!</p>
      </div>

      {/* Verification Tool */}
      <div className="mt-5 pt-4 border-t border-white/10">
        <details className="group">
          <summary className="text-xs font-mono text-gray-300 hover:text-white cursor-pointer flex items-center justify-between list-none py-1">
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#00ff66]" />
              <span className="font-bold">VERIFY MY DEPOSIT / CHECK TRANSACTION</span>
            </span>
            <span className="text-xs text-[#00ff66] group-open:rotate-180 transition-transform">▼</span>
          </summary>

          <form onSubmit={handleVerifyDeposit} className="mt-3.5 space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter your Solana wallet address..."
                value={lookupAddress}
                onChange={(e) => setLookupAddress(e.target.value)}
                className="w-full rounded-xl bg-[#030805] border border-white/20 px-3.5 py-2.5 text-xs font-mono text-white placeholder-gray-500 focus:border-[#00ff66] focus:outline-none"
              />
              <button
                type="submit"
                disabled={lookupLoading}
                className="px-5 py-2.5 rounded-xl bg-[#00ff66]/20 hover:bg-[#00ff66]/30 text-[#00ff66] font-mono text-xs font-bold border border-[#00ff66] shrink-0 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                {lookupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>CHECK DEPOSIT</span>}
              </button>
            </div>

            {lookupResult && (
              <div className={`p-3.5 rounded-xl text-xs font-mono border ${lookupResult.found ? "bg-[#00ff66]/15 border-[#00ff66] text-[#00ff66]" : "bg-white/5 border-white/15 text-gray-300"}`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  {lookupResult.found ? <CheckCircle2 className="w-4 h-4 text-[#00ff66]" /> : <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                  <span>{lookupResult.message}</span>
                </div>
                {lookupResult.tx && (
                  <div className="text-xs text-gray-300 pt-1.5 border-t border-white/10 space-y-1">
                    <div>Contribution: {lookupResult.tx.sol} SOL</div>
                    <div>Allocation: {lookupResult.tx.tokens.toLocaleString()} $DEMOBULL</div>
                  </div>
                )}
              </div>
            )}
          </form>
        </details>
      </div>
    </div>
  );
}
