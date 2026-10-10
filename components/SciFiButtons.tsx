"use client";

import React, { useState } from "react";
import { terminalAudio } from "@/audio/terminalAudio";
import { CONFIG } from "@/config";

export const SciFiButtons: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleHover = () => {
    terminalAudio.playHover();
  };

  const handlePresale = (e: React.MouseEvent) => {
    e.preventDefault();
    terminalAudio.playClick();
    terminalAudio.playScan();
    const el = document.getElementById("presale");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "presale";
    }
  };

  const handleAirdrop = (e: React.MouseEvent) => {
    e.preventDefault();
    terminalAudio.playClick();
    terminalAudio.playScan();
    const el = document.getElementById("airdrop");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "airdrop";
    }
  };

  const handleCopyWallet = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(CONFIG.wallet.presaleAddress).catch(() => {});
    setCopied(true);
    terminalAudio.playCopy();
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="orbit-controls-wrapper visible">
      {/* WALLET ADDRESS BADGE WITH COPY ICON JUST ABOVE BUTTONS */}
      <div
        onClick={handleCopyWallet}
        onMouseEnter={handleHover}
        className={`sci-wallet-pill ${copied ? "is-copied" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Copy Official Presale Wallet Address"
        title="Click to copy official presale address"
      >
        {/* Corner Brackets */}
        <span className="bracket tl" />
        <span className="bracket tr" />
        <span className="bracket bl" />
        <span className="bracket br" />

        {/* Status dot */}
        <span className="pill-status-dot" />

        {/* Label */}
        <span className="pill-ca-label">PRESALE CA:</span>

        {/* Address: Desktop / Mobile adaptive truncation */}
        <span className="pill-ca-address desktop-address">
          {CONFIG.wallet.presaleAddress.slice(0, 10)}...{CONFIG.wallet.presaleAddress.slice(-6)}
        </span>
        <span className="pill-ca-address mobile-address">
          {CONFIG.wallet.presaleAddress.slice(0, 6)}...{CONFIG.wallet.presaleAddress.slice(-4)}
        </span>

        {/* Copy Icon Button */}
        <div className="pill-copy-icon-box">
          {copied ? (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00ff66"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#39ff88"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </div>

        {/* Copied notification text */}
        {copied && <span className="pill-copied-text">COPIED ✓</span>}
      </div>

      {/* COMMAND BUTTONS ROW [ PRESALE ] [ AIRDROP ] */}
      <div className="sci-command-row">
        {/* PRESALE COMMAND BUTTON -> DIRECT SCROLL TO SECTION */}
        <a
          href="#presale"
          onClick={handlePresale}
          onMouseEnter={handleHover}
          className="sci-command-btn btn-presale"
          aria-label="Go to Presale Section"
        >
          {/* Corner Brackets */}
          <span className="bracket tl" />
          <span className="bracket tr" />
          <span className="bracket bl" />
          <span className="bracket br" />

          {/* Scanning Light Sweep */}
          <span className="btn-scan-beam" />

          {/* Blinking Status LED */}
          <span className="btn-status-led led-presale" />

          <span className="btn-label-text">PRESALE</span>
        </a>

        {/* AIRDROP COMMAND BUTTON -> DIRECT SCROLL TO SECTION */}
        <a
          href="#airdrop"
          onClick={handleAirdrop}
          onMouseEnter={handleHover}
          className="sci-command-btn btn-airdrop"
          aria-label="Go to Airdrop Section"
        >
          {/* Corner Brackets */}
          <span className="bracket tl" />
          <span className="bracket tr" />
          <span className="bracket bl" />
          <span className="bracket br" />

          {/* Scanning Light Sweep */}
          <span className="btn-scan-beam" />

          {/* Blinking Status LED */}
          <span className="btn-status-led led-airdrop" />

          <span className="btn-label-text">AIRDROP</span>
        </a>
      </div>
    </div>
  );
};
