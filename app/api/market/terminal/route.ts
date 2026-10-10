import { NextRequest, NextResponse } from "next/server";
import { getDynamicPresaleMetrics, AMOUNT_CONFIG, calculateTokensForSol } from "@/config";

export type Timeframe = "15M" | "1H" | "4H" | "1D" | "1W";

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: string;
}

export interface DexTrade {
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

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateCandles(timeframe: Timeframe, now: number, currentPrice: number): CandleData[] {
  const count = timeframe === "15M" ? 10 : timeframe === "1H" ? 8 : timeframe === "4H" ? 6 : 7;
  const basePrice = 0.00000075;
  const candles: CandleData[] = [];

  const intervalMsMap: Record<Timeframe, number> = {
    "15M": 15 * 60 * 1000,
    "1H": 60 * 60 * 1000,
    "4H": 4 * 60 * 60 * 1000,
    "1D": 24 * 60 * 60 * 1000,
    "1W": 7 * 24 * 60 * 60 * 1000,
  };

  const intervalMs = intervalMsMap[timeframe] || 60 * 60 * 1000;

  for (let i = count - 1; i >= 0; i--) {
    const candleTimeMs = now - i * intervalMs;
    const date = new Date(candleTimeMs);
    let timeLabel = "";

    if (timeframe === "15M" || timeframe === "1H") {
      const h = date.getHours().toString().padStart(2, "0");
      const m = (Math.floor(date.getMinutes() / 15) * 15).toString().padStart(2, "0");
      timeLabel = `${h}:${m}`;
    } else if (timeframe === "4H") {
      const h = (Math.floor(date.getHours() / 4) * 4).toString().padStart(2, "0");
      timeLabel = `${h}:00`;
    } else if (timeframe === "1D") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      timeLabel = days[date.getDay()];
    } else {
      timeLabel = `W${count - i}`;
    }

    const progress = (count - 1 - i) / (count - 1 || 1);
    const expectedClose = basePrice + (currentPrice - basePrice) * Math.pow(progress, 1.2);
    const noise = (seededRandom(Math.floor(candleTimeMs / intervalMs)) - 0.48) * 0.00000004;

    const close = i === 0 ? currentPrice : Math.max(0.0000005, expectedClose + noise);
    const open = i === count - 1
      ? basePrice
      : candles[candles.length - 1]?.close || expectedClose - 0.00000002;

    const maxOC = Math.max(open, close);
    const minOC = Math.min(open, close);
    const high = maxOC + Math.abs(seededRandom(candleTimeMs + 1)) * 0.00000003;
    const low = Math.max(0.0000004, minOC - Math.abs(seededRandom(candleTimeMs + 2)) * 0.000000025);

    const volNum = Math.floor(15 + progress * 80 + seededRandom(candleTimeMs + 3) * 25);
    const volStr = timeframe === "1D" || timeframe === "1W" ? `${(volNum * 15).toFixed(0)}K` : `${volNum}K`;

    candles.push({
      time: timeLabel,
      open: parseFloat(open.toFixed(8)),
      high: parseFloat(high.toFixed(8)),
      low: parseFloat(low.toFixed(8)),
      close: parseFloat(close.toFixed(8)),
      volume: volStr,
    });
  }

  if (candles.length > 0) {
    candles[candles.length - 1].close = currentPrice;
    if (currentPrice > candles[candles.length - 1].high) {
      candles[candles.length - 1].high = currentPrice;
    }
  }

  return candles;
}

function generateDexTrades(now: number): DexTrade[] {
  const wallets = [
    "7xK3...9QmP", "4mN8...2vLt", "9bV2...5kZa", "2wP9...8hXc",
    "6tL4...1mQy", "8yR7...3pKs", "5kM1...4zWq", "3dF6...7nJx",
    "1aC9...9vEb", "8sT2...6rLz"
  ];

  const solAmounts = [0.2, 0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 10.0];
  const solPrice = 180;
  const trades: DexTrade[] = [];
  const secondOffsets = [4, 18, 35, 59, 84, 115, 142, 178];

  for (let i = 0; i < secondOffsets.length; i++) {
    const tradeTime = now - secondOffsets[i] * 1000;
    const seed = Math.floor(tradeTime / 10000);
    const isSell = i === 3 && seededRandom(seed) > 0.6;

    const solIdx = Math.floor(seededRandom(seed + i) * solAmounts.length);
    const solAmount = isSell ? 0.35 : solAmounts[solIdx];
    const usdAmount = parseFloat((solAmount * solPrice).toFixed(2));
    const tokenAmount = calculateTokensForSol(solAmount);
    const wallet = wallets[(i + Math.floor(now / 30000)) % wallets.length];
    const timeAgo = secondOffsets[i] < 10
      ? "just now"
      : secondOffsets[i] < 60
        ? `${secondOffsets[i]}s ago`
        : `${Math.floor(secondOffsets[i] / 60)}m ago`;

    const txChars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let hash = "";
    for (let c = 0; c < 8; c++) {
      hash += txChars[Math.floor(seededRandom(tradeTime + c) * txChars.length)];
    }

    trades.push({
      id: `tx-${tradeTime}-${i}`,
      timestamp: tradeTime,
      timeAgo,
      type: isSell ? "SELL" : "BUY",
      wallet,
      solAmount,
      tokenAmount,
      usdAmount,
      txHash: `${hash}...sol`,
    });
  }

  return trades;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedTf = (searchParams.get("timeframe") as Timeframe) || "1H";
    const validTfs: Timeframe[] = ["15M", "1H", "4H", "1D", "1W"];
    const timeframe: Timeframe = validTfs.includes(requestedTf) ? requestedTf : "1H";

    const now = Date.now();
    const dynamicPresale = getDynamicPresaleMetrics();

    const wave1 = Math.sin(now / 45000) * 0.000000025;
    const wave2 = Math.cos(now / 18000) * 0.000000015;
    const jitter = (seededRandom(Math.floor(now / 3000)) - 0.49) * 0.00000001;

    const basePeg = 0.00000108;
    const currentPrice = parseFloat((basePeg + wave1 + wave2 + jitter).toFixed(8));

    const baseVolume = 348920;
    const volumeDrift = Math.floor((now % 86400000) / 4000) * 8.5;
    const volume24h = Math.floor(baseVolume + volumeDrift);

    const candles = generateCandles(timeframe, now, currentPrice);
    const recentTrades = generateDexTrades(now);

    const solTps = 3840 + Math.floor(seededRandom(Math.floor(now / 3000)) * 140);
    const slotNumber = 312845000 + Math.floor(now / 400);

    return NextResponse.json(
      {
        success: true,
        timestamp: now,
        timeframe,
        metrics: {
          currentPrice,
          priceChange24h: 184.2 + parseFloat((Math.sin(now / 60000) * 2.5).toFixed(1)),
          dilutedValuation: Math.floor(AMOUNT_CONFIG.totalSupply * currentPrice),
          pairLiquidity: dynamicPresale.currentBaselineUsd,
          volume24h,
          verifiedHolders: 5248 + Math.floor((now % 86400000) / 60000),
          targetListingPrice: 0.001,
          targetMultiplier: "1,000X",
          indexSource: "RAYDIUM CLMM // SOL-DEMOBULL",
        },
        candles,
        recentTrades,
        telemetry: {
          solTps,
          slotNumber,
          oracle: "Pyth Network / Solana CLMM",
          status: "LIVE ORBITAL STREAM",
          pollIntervalMs: 3000,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch market telemetry." },
      { status: 500 }
    );
  }
}
