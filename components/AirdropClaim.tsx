"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, Gift, LoaderCircle } from "lucide-react";
import { config, formatNumber, symbol } from "@/config";
import Confetti from "./Confetti";

export default function AirdropClaim() {
  const [wallet, setWallet] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [claim, setClaim] = useState<{ amount: number; alreadyClaimed: boolean; walletAddress: string } | null>(null);
  const [stats, setStats] = useState<{ totalClaims: number; totalAllocated: number } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/airdrop/claim", { signal: controller.signal, cache: "no-store" })
      .then((response) => response.json()).then((data) => { if (data.success) setStats(data.stats); }).catch(() => {});
    return () => { controller.abort(); if (celebrationTimer.current) clearTimeout(celebrationTimer.current); };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(""); setClaim(null);
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet.trim())) { setError("Enter a valid Solana wallet address."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/airdrop/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ walletAddress: wallet.trim() }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Couldn’t save your claim. Try again.");
      setClaim(data.claim);
      setStats({ totalClaims: data.claim.totalClaims, totalAllocated: data.claim.totalAllocated });
      if (!data.claim.alreadyClaimed) {
        setCelebrate(true);
        if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
        celebrationTimer.current = setTimeout(() => setCelebrate(false), 4500);
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Couldn’t save your claim. Try again."); }
    finally { setBusy(false); }
  }

  if (!config.airdrop.enabled) return null;
  const full = stats !== null && stats.totalAllocated + config.airdrop.rewardTokens > config.airdrop.poolTokens;
  return (
    <section id="airdrop" className="airdrop-section">
      {celebrate && <Confetti />}
      <div className="airdrop-copy"><span className="eyebrow sticker-label">FREE STUFF? SAY LESS.</span><h2>{config.airdrop.title[0]}<br />{config.airdrop.title[1]}</h2><p>{config.airdrop.description}</p><div className="airdrop-reward"><span className="gift-sticker"><Gift size={37} strokeWidth={2.5} /></span><div><strong>{formatNumber(config.airdrop.rewardTokens)}</strong><span>{symbol} PER WALLET</span></div><span className="reward-spark" aria-hidden="true">✳</span></div><p className="airdrop-pool">{formatNumber(config.airdrop.poolTokens)} token pool · One claim per wallet</p></div>
      <div className="claim-card"><div className="claim-card-heading"><h3>YOUR FREE SPACE SNACK.</h3><span>ASTRO AIRDROP</span></div><form onSubmit={submit} noValidate><label htmlFor="airdrop-wallet">Your Solana wallet address</label><input id="airdrop-wallet" placeholder="Paste your wallet address" value={wallet} onChange={(event) => { setWallet(event.target.value); setError(""); setClaim(null); }} autoComplete="off" spellCheck={false} maxLength={100} aria-describedby="airdrop-help" aria-invalid={Boolean(error)} disabled={busy} /><p id="airdrop-help">Public address only. No connecting. No seed phrases.</p><button className="button claim-button" type="submit" disabled={busy || !wallet.trim() || full}>{busy ? <><LoaderCircle className="spinner" size={18} />Claiming…</> : full ? "Airdrop fully claimed" : <>Claim my airdrop <ArrowUpRight size={20} /></>}</button></form><div aria-live="polite">{error && <p className="field-error">{error}</p>}{claim && <div className="claim-success"><CheckCircle2 size={21} /><div><strong>{claim.alreadyClaimed ? "You’re already in the herd!" : "You’re in the herd!"}</strong><p>{formatNumber(claim.amount)} {symbol} reserved for this wallet.</p></div></div>}</div><div className="claim-bottom"><span>{stats ? `${formatNumber(stats.totalClaims)} wallets in the herd` : "Be part of the herd"}</span><span>AIRDROP ALLOCATION</span></div></div>
    </section>
  );
}
