"use client";

import { config, networkLabel } from "@/config";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function HeroWallet() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const field = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    setError("");
    try {
      await navigator.clipboard.writeText(config.network.presaleWalletAddress);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
      field.current?.focus();
      field.current?.select();
      setError(
        "Address selected. Copy it manually if clipboard access is blocked.",
      );
    }
  }

  return (
    <div className="hero-wallet">
      <div className="wallet-heading">
        <label htmlFor="hero-presale-wallet">Presale wallet</label>
        <span>{networkLabel}</span>
      </div>
      <div className="hero-wallet-row">
        <input
          id="hero-presale-wallet"
          ref={field}
          readOnly
          value={config.network.presaleWalletAddress}
          onFocus={(event) => event.currentTarget.select()}
          aria-label="Hero presale wallet address"
        />
        <button
          onClick={copy}
          type="button"
          aria-label={
            copied ? "Hero wallet copied" : "Copy hero presale wallet"
          }
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <a className="hero-wallet-cta" href="#airdrop">
        Claim airdrop <ArrowUpRight size={15} />
      </a>
      <span className="hero-wallet-feedback" role="status">
        {error || (copied ? "Presale wallet address copied." : "")}
      </span>
    </div>
  );
}
