"use client";

import React, { useState, useEffect } from "react";
import { Activity, BarChart2, Radio, TrendingUp, Layers, RefreshCw, Zap } from "lucide-react";
import { terminalAudio } from "@/audio/terminalAudio";

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: string;
}

interface DexTrade {
  id: string;
  timestamp: number;
  timeAgo: string;
  type: "BUY" | "SELL";
  wallet: string;
  solAmount: number;
  tokenAmount: number;
  usdAmount: number;
  txHash: string;
}

export default function MarketTerminal() {
  const [timeframe, setTimeframe] = useState<"15M" | "1H" | "4H" | "1D" | "1W">("1H");
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [trades, setTrades] = useState<DexTrade[]>([]);
  const [metrics, setMetrics] = useState({
    currentPrice: 0.00000108,
    priceChange24h: 184.2,
    volume24h: 352400,
    solTps: 3840,
    slotNumber: 312845200,
  });

  const fetchTerminalData = () => {
    fetch(`/api/market/terminal?timeframe=${timeframe}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.candles) setCandles(data.candles);
          if (data.recentTrades) setTrades(data.recentTrades);
          if (data.metrics) {
            setMetrics((prev) => ({
              ...prev,
              currentPrice: data.metrics.currentPrice,
              priceChange24h: data.metrics.priceChange24h,
              volume24h: data.metrics.volume24h,
              solTps: data.telemetry?.solTps || 3840,
              slotNumber: data.telemetry?.slotNumber || 312845200,
            }));
          }
        }
      })
      .catch(() => { });
  };

  useEffect(() => {
    fetchTerminalData();
    const timer = setInterval(fetchTerminalData, 4000);
    return () => clearInterval(timer);
  }, [timeframe]);

  return (
    <section id="market" className="section-shell bg-transparent relative">

      <div className="container-custom relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="status-badge mb-2">
              <Radio className="w-3.5 h-3.5 text-[#00ff66] animate-pulse" />
              <span>LIVE SOLANA CLUSTER TELEMETRY</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
              MARKET <span className="bg-gradient-to-r from-[#00ff66] to-[#14F195] bg-clip-text text-transparent">TERMINAL</span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 self-start sm:self-auto">
            {(["15M", "1H", "4H", "1D", "1W"] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  terminalAudio.playClick();
                  setTimeframe(tf);
                }}
                className={`px-3 py-1.5 font-mono text-xs font-bold rounded-lg transition-all cursor-pointer ${timeframe === tf
                    ? "bg-[#00ff66] text-black shadow-[0_0_12px_rgba(0,255,102,0.4)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-2xl bg-[#040d07] border border-[#00ff66]/20 mb-6 text-xs font-mono shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">INDEX PRICE:</span>
            <span className="text-lg sm:text-xl font-black text-[#00ff66] block mt-0.5">
              ${metrics.currentPrice.toFixed(8)}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">24H MOMENTUM:</span>
            <span className="text-lg sm:text-xl font-black text-[#39ff88] block mt-0.5">
              +{metrics.priceChange24h.toFixed(2)}%
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">24H VOLUME:</span>
            <span className="text-lg sm:text-xl font-black text-white block mt-0.5">
              ${metrics.volume24h.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">SOLANA SPEED:</span>
            <span className="text-lg sm:text-xl font-black text-[#00ff66] flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
              {metrics.solTps} TPS
            </span>
          </div>
        </div>

        {/* Candlestick & Trade Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Interactive Candlestick Matrix */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-gradient-to-b from-[#051309] to-[#020704] border border-[#00ff66]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs font-mono">
              <span className="text-white font-bold flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#00ff66]" />
                SOL-DEMOBULL // RAYDIUM CLMM SIMULATOR
              </span>
              <span className="text-gray-400">TIMEFRAME: {timeframe}</span>
            </div>

            {/* Candle Visualizer */}
            <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-2 px-3 py-4 rounded-xl bg-[#010402] border border-white/5 relative">
              {candles.map((c, i) => {
                const isGreen = c.close >= c.open;
                const candleHeight = Math.max(12, Math.min(180, Math.floor(((c.close - 0.0000006) / 0.0000006) * 160)));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="text-[9px] font-mono text-gray-500 mb-1 group-hover:text-white">
                      {c.volume}
                    </div>
                    {/* Wick */}
                    <div
                      className={`w-[1.5px] ${isGreen ? "bg-[#00ff66]" : "bg-red-400"}`}
                      style={{ height: `${candleHeight + 16}px` }}
                    />
                    {/* Body */}
                    <div
                      className={`w-full max-w-[28px] rounded-sm ${isGreen ? "bg-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.5)]" : "bg-red-500"
                        }`}
                      style={{ height: `${candleHeight}px` }}
                    />
                    <div className="text-[9px] font-mono text-gray-400 mt-2 truncate w-full text-center">
                      {c.time}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-gray-400 gap-1">
              <span>TARGET LISTING PRICE: $0.001000 USDC</span>
              <span className="text-[#00ff66] font-bold">1,000X MULTIPLIER TRAJECTORY</span>
            </div>
          </div>

          {/* Right: Live Trades Feed */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-gradient-to-b from-[#051309] to-[#020704] border border-[#00ff66]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs font-mono">
              <span className="text-white font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00ff66]" />
                RECENT DEX ORDERS
              </span>
              <span className="text-[10px] text-[#00ff66] font-bold px-2 py-0.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 animate-pulse">
                STREAMING
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {trades.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5 text-xs font-mono"
                >
                  <div className="flex flex-col">
                    <span className={t.type === "BUY" ? "text-[#00ff66] font-bold" : "text-red-400 font-bold"}>
                      {t.type} {t.solAmount} SOL
                    </span>
                    <span className="text-[10px] text-gray-500">{t.wallet}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-white font-semibold">
                      ${t.usdAmount.toFixed(0)}
                    </span>
                    <span className="text-[10px] text-gray-400 block">{t.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
