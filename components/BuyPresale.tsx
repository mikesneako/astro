"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Info, Send } from "lucide-react";
import { config, effectiveTokenPriceUsd, formatCompactTokens, formatNumber, formatUsd, networkLabel, quoteTokens, saleStatus, symbol, validateAmount } from "@/config";

export default function BuyPresale() {
  const [amount, setAmount] = useState(String(config.presale.defaultSol));
  const [now, setNow] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [message, setMessage] = useState("");
  const addressField = useRef<HTMLTextAreaElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sol = Number(amount);
  const error = validateAmount(sol);
  const tokens = error ? 0 : quoteTokens(sol);
  const status = now === null ? null : saleStatus(now);
  const remaining = now === null ? 0 : Math.max(0, Date.parse(status === "upcoming" ? config.presale.startsAt : config.presale.endsAt) - now);
  const countdown = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(interval); if (copyTimer.current) clearTimeout(copyTimer.current); };
  }, []);

  function changeAmount(value: string) {
    setAmount(value);
    setCopied(false);
    setMessage("");
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }

  async function copyAddress(event: React.FormEvent) {
    event.preventDefault();
    if (copying) return;
    setMessage("");
    if (error) { setMessage(error); return; }
    if (saleStatus() !== "open") { setMessage("This presale is not currently open."); return; }
    setCopying(true);
    try {
      await navigator.clipboard.writeText(config.network.presaleWalletAddress);
      setCopied(true);
      setMessage("Address copied. Paste it into your wallet and send the amount shown above.");
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
      addressField.current?.focus();
      addressField.current?.select();
      setMessage("Automatic copy is unavailable. The full wallet address is selected so you can copy it manually.");
    } finally { setCopying(false); }
  }

  return (
    <div className="presale-column" id="presale">
      <div className="presale-card">
        <div className="card-top"><span className="live-badge"><span className="status-dot" />{status === "closed" ? "PRESALE CLOSED" : status === "upcoming" ? "COMING SOON" : config.network.cluster === "mainnet-beta" ? "PRESALE OPEN" : `${config.network.cluster.toUpperCase()} PRESALE`}</span><span className="stage-label">STAGE {String(config.presale.stage).padStart(2, "0")}</span></div>
        <div className="buy-heading"><h2>GET YOUR {symbol}<span>!</span></h2><p>Less scrolling. More cosmic bull energy.</p></div>
        <div className="price-pair"><div><span>Your token price · USD estimate</span><strong>{error ? "—" : formatUsd(effectiveTokenPriceUsd(sol))}</strong></div><ArrowRight size={18} /><div><span>SOL reference price</span><strong>{formatUsd(config.presale.solPriceUsd)}</strong></div></div>
        <div className="countdown"><span>{status === "closed" ? "This stage has ended" : status === "upcoming" ? "Presale opens in" : "This stage ends in"}</span><div>{countdown.map((value, i) => <span key={i}><b>{now === null ? "—" : String(value).padStart(2, "0")}</b><small>{["D", "H", "M", "S"][i]}</small></span>)}</div></div>
        <form onSubmit={copyAddress} noValidate>
          <div className={`amount-box ${amount && error ? "has-error" : ""}`}><div className="field-heading"><label htmlFor="sol-amount">You send</label><span>{!error ? `≈ ${formatUsd(sol * config.presale.solPriceUsd)}` : `${config.presale.minSol}–${config.presale.maxSol} SOL`}</span></div><div className="amount-row"><input id="sol-amount" type="number" inputMode="decimal" min={config.presale.minSol} max={config.presale.maxSol} step="any" value={amount} onChange={(event) => changeAmount(event.target.value)} disabled={copying} aria-invalid={Boolean(error)} aria-describedby={error ? "amount-error" : "quote-note"} placeholder="0.00" /><span className="currency-chip"><span className="solana-mark" aria-hidden="true"><i /><i /><i /></span>{config.network.currency}</span></div></div>
          <div className="tier-heading"><span>Choose your allocation</span><span>SOL → TOKENS</span></div>
          <div className="quick-amounts tier-amounts" role="group" aria-label="Presale allocation tiers">{config.presale.tiers.map((tier) => <button type="button" key={tier.sol} disabled={copying} aria-label={`${tier.sol} SOL for ${formatCompactTokens(tier.tokens)} tokens`} aria-pressed={sol === tier.sol} className={sol === tier.sol ? "selected" : ""} onClick={() => changeAmount(String(tier.sol))}><span>{tier.sol} SOL</span><strong>{formatCompactTokens(tier.tokens)}</strong></button>)}</div>
          {error && <p className="field-error" id="amount-error">{error}</p>}
          <div className="quote-divider"><span><ArrowDown size={14} /></span></div>
          <div className="receive-box"><div className="field-heading"><span>Estimated tokens</span><span className="allocation-label">YOUR ALLOCATION</span></div><div className="amount-row"><output htmlFor="sol-amount" aria-live="polite">{formatNumber(tokens)}</output><span className="receive-symbol">{symbol}</span></div></div>
          <p className="quote-note" id="quote-note">Custom amounts scale between the displayed tiers.<Info size={12} aria-label="Token estimates use the presale tiers, independently of the simulated market chart" /></p>
          <div className="presale-wallet">
            <div className="wallet-heading"><label htmlFor="presale-address">Presale wallet</label><span>{networkLabel}</span></div>
            <textarea ref={addressField} id="presale-address" value={config.network.presaleWalletAddress} readOnly rows={2} spellCheck={false} onFocus={(event) => event.currentTarget.select()} aria-describedby="transfer-instructions" />
            <p id="transfer-instructions"><Send size={13} /><span>{error ? "Enter your amount, then copy this address and send from your own wallet." : <>Send <strong>{formatNumber(sol, 9)} {config.network.currency}</strong> to this address from your own wallet.</>}</span></p>
          </div>
          <button type="submit" className="button purchase-button" disabled={Boolean(error) || status !== "open" || copying}>{copied ? <Check size={18} /> : <Copy size={18} />}{status === "closed" ? "Presale closed" : status === "upcoming" ? "Opening soon" : copying ? "Copying…" : copied ? "Address copied!" : "Copy presale wallet"}<ArrowUpRight size={18} /></button>
          <p className="transfer-note">{config.network.cluster === "devnet" ? "Use devnet SOL for testing. " : ""}Complete the transfer in your wallet.</p>
        </form>
        <div role="status" aria-live="polite">{message && <p className="inline-message">{message}</p>}</div>
      </div>
      <a className="wallet-explorer" href={`${config.network.explorerUrl}/account/${config.network.presaleWalletAddress}?cluster=${encodeURIComponent(config.network.cluster)}`} target="_blank" rel="noreferrer">View presale wallet on explorer <ArrowUpRight size={13} /></a>
    </div>
  );
}
