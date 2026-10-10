"use client";

import React, { useState, useEffect } from "react";
import { terminalAudio } from "@/audio/terminalAudio";
import { CONFIG } from "@/config";

export const TerminalHUD: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [utcTime, setUtcTime] = useState<string>("");

  useEffect(() => {
    setIsMuted(terminalAudio.getMuted());
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = terminalAudio.toggleMute();
    setIsMuted(next);
    if (!next) {
      terminalAudio.playClick();
    }
  };

  return (
    <header className="hud-container">
      {/* =========================================================================
          DESKTOP HUD (>= 768px)
          ========================================================================= */}
      <div className="hud-desktop-view">
        {/* TOP LEFT TELEMETRY */}
        <div className="hud-top-left">
          <div className="telemetry-status-row">
            <span className="hud-led-dot" />
            <span className="telemetry-label">TRANSMISSION: ACTIVE</span>
            <span className="telemetry-sep">//</span>
            <span className="telemetry-time">{utcTime}</span>
          </div>
          <div className="telemetry-node">
            NODE: {CONFIG.telemetry.nodeId} // SOLANA MAINNET
          </div>
        </div>

        {/* TOP CENTER PROJECT BRANDING */}
        <div className="hud-top-center">
          <div className="hud-brand-title">
            <span className="brand-glow">$DEMOBULL</span>
            <span className="brand-sep">//</span>
            <span className="brand-sub">DEEP SPACE TERMINAL</span>
          </div>
          <div className="hud-brand-tagline">
            SOLANA PROTOCOL TRANSMISSION // LIVE ORBIT
          </div>
        </div>

        {/* TOP RIGHT TELEMETRY, X (TWITTER) LINK & AUDIO TOGGLE */}
        <div className="hud-top-right" style={{ right: "24px" }}>
          {/* X / Twitter Link */}
          <a
            href={CONFIG.socials.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => terminalAudio.playHover()}
            title="Open Official X / Twitter Transmission"
            className="hud-action-btn hover-glow-btn"
          >
            <span className="x-icon">𝕏</span>
            <span>X / COMMUNITY</span>
          </a>

          {/* Audio Toggle Button */}
          <button
            type="button"
            onClick={toggleSound}
            onMouseEnter={() => terminalAudio.playHover()}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="hud-action-btn hover-glow-btn"
          >
            <span className={`audio-dot ${isMuted ? "muted" : "active"}`} />
            <span>AUDIO: {isMuted ? "OFF" : "ON"}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MOBILE HUD (< 768px)
          ========================================================================= */}
      <div className="hud-mobile-view">
        {/* Left: Brand & Status */}
        <div className="mobile-nav-brand">
          <span className="hud-led-dot" />
          <span className="mobile-brand-name">$DEMOBULL</span>
          <span className="mobile-brand-tag">ORBIT</span>
        </div>

        {/* Right: Quick Actions */}
        <div className="mobile-nav-actions">
          <a
            href={CONFIG.socials.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => terminalAudio.playHover()}
            title="Open Official X"
            className="mobile-hud-btn hover-glow-btn"
            aria-label="X Twitter Community"
          >
            <span className="x-icon">𝕏</span>
          </a>

          <button
            type="button"
            onClick={toggleSound}
            onMouseEnter={() => terminalAudio.playHover()}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="mobile-hud-btn hover-glow-btn"
            aria-label="Toggle Audio"
          >
            <span className={`audio-dot ${isMuted ? "muted" : "active"}`} />
            <span>{isMuted ? "MUTE" : "AUDIO"}</span>
          </button>
        </div>
      </div>

      {/* BOTTOM FREQUENCY CARRIER LINE */}
      <div className="hud-bottom-carrier">
        CARRIER FREQ: {CONFIG.telemetry.carrierFreq} // HYDROGEN LINE // STANDBY
      </div>
    </header>
  );
};
