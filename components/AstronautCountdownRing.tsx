"use client";

import React, { useState, useEffect } from "react";
import { terminalAudio } from "@/audio/terminalAudio";
import { CONFIG, PRESALE_SCHEDULE_CONFIG } from "@/config";

interface AstronautCountdownRingProps {
  isSurging?: boolean;
}

const padZero = (n: number): string => n.toString().padStart(2, "0");

export const AstronautCountdownRing: React.FC<AstronautCountdownRingProps> = ({
  isSurging = false,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    progressPercent: 68.0,
  });

  const [secondAngle, setSecondAngle] = useState<number>(0);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const targetTime = new Date(PRESALE_SCHEDULE_CONFIG.anchorEndTime).getTime();
      const startTime = new Date(PRESALE_SCHEDULE_CONFIG.anchorStartTime).getTime();
      const current = now.getTime();

      const diff = Math.max(0, targetTime - current);
      const totalSpan = targetTime - startTime;
      const elapsed = Math.max(0, current - startTime);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const progress = Math.min(100, Math.max(0, (elapsed / (totalSpan || 1)) * 100));

      const sec = now.getSeconds();
      const ms = now.getMilliseconds();
      const angle = (sec + ms / 1000) * 6; // 360 / 60 = 6 deg/sec

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        progressPercent: progress,
      });
      setSecondAngle(angle);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 100);
    return () => clearInterval(interval);
  }, []);

  const radius = 280;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (timeLeft.progressPercent / 100) * circumference;

  return (
    <div
      className={`astronaut-countdown-container ${isSurging ? "is-surging" : ""}`}
    >
      <svg
        viewBox="-360 -360 720 720"
        className="countdown-svg-dial"
      >
        <defs>
          <filter id="neonDialGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="surgeDialGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="orbitArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff66" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#00ff66" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#39ff88" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* 1. Outer Cardinal Reticle Ring */}
        <circle
          cx="0"
          cy="0"
          r="330"
          fill="none"
          stroke="rgba(0, 255, 102, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* 2. Cardinal Crosshairs */}
        <line x1="0" y1="-335" x2="0" y2="-320" stroke="#00ff66" strokeWidth="2" opacity="0.75" />
        <line x1="320" y1="0" x2="335" y2="0" stroke="#00ff66" strokeWidth="2" opacity="0.75" />
        <line x1="0" y1="320" x2="0" y2="335" stroke="#00ff66" strokeWidth="2" opacity="0.75" />
        <line x1="-335" y1="0" x2="-320" y2="0" stroke="#00ff66" strokeWidth="2" opacity="0.75" />

        {/* 3. Cardinal Degree Markers */}
        <g opacity="0.75">
          <text
            x="0"
            y="-294"
            textAnchor="middle"
            fill="rgba(0, 255, 102, 0.7)"
            fontSize="8"
            fontFamily="var(--font-mono)"
            letterSpacing="1.5"
          >
            000° // NOR
          </text>
          <text
            x="294"
            y="3"
            textAnchor="start"
            fill="rgba(0, 255, 102, 0.6)"
            fontSize="8"
            fontFamily="var(--font-mono)"
            letterSpacing="1.5"
          >
            090°
          </text>
          <text
            x="0"
            y="300"
            textAnchor="middle"
            fill="rgba(0, 255, 102, 0.6)"
            fontSize="8"
            fontFamily="var(--font-mono)"
            letterSpacing="1.5"
          >
            180° // SOU
          </text>
          <text
            x="-294"
            y="3"
            textAnchor="end"
            fill="rgba(0, 255, 102, 0.6)"
            fontSize="8"
            fontFamily="var(--font-mono)"
            letterSpacing="1.5"
          >
            270°
          </text>
        </g>

        {/* 4. Rotating slow orbital telemetry ring */}
        <g className="rotating-orbit-ring">
          <circle
            cx="0"
            cy="0"
            r="262"
            fill="none"
            stroke="rgba(0, 255, 102, 0.22)"
            strokeWidth="1.2"
            strokeDasharray="24 14 48 14 10 10"
          />
          <circle cx="0" cy="-262" r="3.5" fill="#00ff66" opacity="0.8" />
          <circle cx="262" cy="0" r="3.5" fill="#00ff66" opacity="0.8" />
          <circle cx="0" cy="262" r="3.5" fill="#00ff66" opacity="0.8" />
          <circle cx="-262" cy="0" r="3.5" fill="#00ff66" opacity="0.8" />
        </g>

        {/* 5. Counter-rotating inner technical ring */}
        <g className="counter-orbit-ring">
          <circle
            cx="0"
            cy="0"
            r="220"
            fill="none"
            stroke="rgba(0, 255, 102, 0.16)"
            strokeWidth="1"
            strokeDasharray="8 24 16 24"
          />
        </g>

        {/* 6. Main Countdown Progress Track */}
        <circle
          cx="0"
          cy="0"
          r={radius}
          fill="none"
          stroke="rgba(0, 255, 102, 0.12)"
          strokeWidth="3.5"
        />

        {/* 7. Active Glowing Progress Arc */}
        <circle
          cx="0"
          cy="0"
          r={radius}
          fill="none"
          stroke="url(#orbitArcGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90)"
          filter={isSurging ? "url(#surgeDialGlow)" : "url(#neonDialGlow)"}
          style={{
            transition: "stroke-dashoffset 0.8s ease-in-out",
          }}
        />

        {/* 8. Real-Time Seconds Orbital Beacon */}
        <g transform={`rotate(${secondAngle})`}>
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={-radius}
            stroke="rgba(0, 255, 102, 0.18)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <circle
            cx="0"
            cy={-radius}
            r="9"
            fill="none"
            stroke="#00ff66"
            strokeWidth="1"
            opacity="0.75"
            className="beacon-pulse"
          />
          <circle
            cx="0"
            cy={-radius}
            r="4"
            fill="#ffffff"
            filter="url(#neonDialGlow)"
          />
        </g>
      </svg>

      {/* Top Mission Sequence Header */}
      <div
        className="countdown-top-badge"
        onMouseEnter={() => terminalAudio.playHover()}
      >
        <span className="badge-dot" />
        <span className="badge-title">T-MINUS //</span>
        <span className="badge-target">{CONFIG.countdown.targetLabel}</span>
      </div>

      {/* 4 Orbital Telemetry Time Capsules */}
      <div className="orbital-time-quadrants">
        {/* DAYS */}
        <div
          className="time-node node-days"
          onMouseEnter={() => terminalAudio.playHover()}
          title="Days Remaining to Launch"
        >
          <div className="node-bracket tl" />
          <div className="node-bracket tr" />
          <div className="node-bracket bl" />
          <div className="node-bracket br" />
          <div className="node-gauge-ring">
            <span className="node-val">{padZero(timeLeft.days)}</span>
          </div>
          <div className="node-meta">
            <span className="node-label">DAYS</span>
            <span className="node-sub">SOL-CYC</span>
          </div>
        </div>

        {/* HOURS */}
        <div
          className="time-node node-hours"
          onMouseEnter={() => terminalAudio.playHover()}
          title="Hours Remaining"
        >
          <div className="node-bracket tl" />
          <div className="node-bracket tr" />
          <div className="node-bracket bl" />
          <div className="node-bracket br" />
          <div className="node-gauge-ring">
            <span className="node-val">{padZero(timeLeft.hours)}</span>
          </div>
          <div className="node-meta">
            <span className="node-label">HOURS</span>
            <span className="node-sub">UTC-HR</span>
          </div>
        </div>

        {/* MINS */}
        <div
          className="time-node node-mins"
          onMouseEnter={() => terminalAudio.playHover()}
          title="Minutes Remaining"
        >
          <div className="node-bracket tl" />
          <div className="node-bracket tr" />
          <div className="node-bracket bl" />
          <div className="node-bracket br" />
          <div className="node-gauge-ring">
            <span className="node-val">{padZero(timeLeft.minutes)}</span>
          </div>
          <div className="node-meta">
            <span className="node-label">MINS</span>
            <span className="node-sub">ORB-MIN</span>
          </div>
        </div>

        {/* SECS */}
        <div
          className="time-node node-secs"
          onMouseEnter={() => terminalAudio.playHover()}
          title="Seconds Countdown"
        >
          <div className="node-bracket tl" />
          <div className="node-bracket tr" />
          <div className="node-bracket bl" />
          <div className="node-bracket br" />
          <div className="node-gauge-ring active-sec">
            <span className="node-val glow">{padZero(timeLeft.seconds)}</span>
          </div>
          <div className="node-meta">
            <span className="node-label live">SECS</span>
            <span className="node-sub">LIVE-TICK</span>
          </div>
        </div>
      </div>

      {/* Bottom Launch Status Telemetry Capsule */}
      <div
        className="countdown-bottom-pill"
        onMouseEnter={() => terminalAudio.playHover()}
      >
        <span className="status-code">
          T-{padZero(timeLeft.days)}D:{padZero(timeLeft.hours)}H:{padZero(timeLeft.minutes)}M:{padZero(timeLeft.seconds)}S
        </span>
        <span className="status-divider">|</span>
        <span className="status-percent">CALIBRATION {timeLeft.progressPercent.toFixed(1)}%</span>
      </div>
    </div>
  );
};
