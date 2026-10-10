"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Flame, Volume2, VolumeX, ArrowUpRight } from "lucide-react";
import { SITE_CONFIG, getDynamicPresaleMetrics } from "@/config";
import { terminalAudio } from "@/audio/terminalAudio";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [metrics, setMetrics] = useState(getDynamicPresaleMetrics());

  useEffect(() => {
    setIsMuted(terminalAudio.getMuted());
    const handleScroll = () => {
      // Reveal sticky navbar once user scrolls past hero
      setScrolled(window.scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSound = () => {
    const next = terminalAudio.toggleMute();
    setIsMuted(next);
    if (!next) terminalAudio.playClick();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${scrolled
        ? "bg-[#020503]/92 backdrop-blur-2xl border-b border-[#00ff66]/25 shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_15px_rgba(0,255,102,0.08)] py-2"
        : "bg-black/70 backdrop-blur-md border-b border-white/10 py-3"
        }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Brand Identity */}
          <Link
            href="#orbit"
            onClick={() => terminalAudio.playClick()}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 rounded-full border border-[#00ff66]/60 p-0.5 bg-black shadow-[0_0_15px_rgba(0,255,102,0.35)] group-hover:border-[#00ff66] group-hover:shadow-[0_0_22px_rgba(0,255,102,0.6)] transition-all overflow-hidden shrink-0">
              <Image
                src="/logo.png"
                alt="AstroBull Solana Logo"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-base font-black tracking-wider text-white flex items-center gap-1.5">
                <span className="text-[#00ff66] group-hover:text-[#39ff88] transition-colors">ASTROBULL</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00ff66]/15 border border-[#00ff66]/40 text-[#00ff66] font-bold">
                  SOL
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5">
            {SITE_CONFIG.navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => terminalAudio.playClick()}
                onMouseEnter={() => terminalAudio.playHover()}
                className="text-xs font-mono font-bold tracking-wider text-gray-300 hover:text-[#00ff66] transition-colors uppercase relative py-1 group"
              >
                <span>{item.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#00ff66] transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Progress Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#051108] border border-[#00ff66]/40 text-[10px] font-mono font-bold text-[#00ff66]">
              <Flame className="w-3 h-3 text-[#00ff66] animate-pulse" />
              <span>{metrics.currentBaselinePercent}% ALLOCATED</span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              onMouseEnter={() => terminalAudio.playHover()}
              className="p-2 bg-black/60 border border-[#00ff66]/30 hover:border-[#00ff66] text-[#00ff66] transition-colors cursor-pointer"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-[#00ff66]" />}
            </button>


            {/* Quick Presale CTA */}
            <Link
              href="#presale"
              onClick={() => terminalAudio.playClick()}
              onMouseEnter={() => terminalAudio.playHover()}
              className="px-3 sm:px-4 py-2 bg-[#00ff66] hover:bg-[#39ff88] text-black font-mono font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] flex items-center gap-1"
            >
              <span>BUY $ASTRO</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white border border-[#00ff66]/30 bg-black/60 cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#00ff66]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/98 border-b border-[#00ff66]/30 px-5 py-6 space-y-4 backdrop-blur-xl">
          <div className="flex flex-col space-y-3">
            {SITE_CONFIG.navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  terminalAudio.playClick();
                  setMobileMenuOpen(false);
                }}
                className="text-sm font-mono font-bold tracking-wider text-gray-200 hover:text-[#00ff66] py-1 border-b border-white/5"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="#presale"
              onClick={() => {
                terminalAudio.playClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#00ff66] text-black text-center font-mono font-black text-xs uppercase tracking-wider"
            >
              JOIN PRESALE STAGE 1
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
