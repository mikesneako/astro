"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { config, formatUsd } from "@/config";
import type { MarketSnapshot } from "@/lib/market-types";

export default function MarketChart() {
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let expiresAt = 0;
    let loading = false;

    async function load() {
      if (loading || controller.signal.aborted) return;
      loading = true;
      if (timer) clearTimeout(timer);
      try {
        const response = await fetch("/api/market/chart", { cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]) });
        if (!response.ok) throw new Error("Chart unavailable");
        const data: MarketSnapshot = await response.json();
        if (!data.simulated || !data.ranges?.length || data.ranges.some((range) => range.prices.length < 2)) throw new Error("Invalid chart snapshot");
        if (controller.signal.aborted) return;
        expiresAt = Date.parse(data.nextUpdateAt);
        setSnapshot(data);
        setError(false);
        timer = setTimeout(load, Math.max(1000, expiresAt - Date.now() + 250));
      } catch {
        if (controller.signal.aborted) return;
        setSnapshot(null);
        setError(true);
        timer = setTimeout(load, 30000);
      } finally { loading = false; }
    }

    function refreshIfExpired() {
      if (document.visibilityState === "visible" && Date.now() >= expiresAt) void load();
    }
    void load();
    window.addEventListener("focus", refreshIfExpired);
    document.addEventListener("visibilitychange", refreshIfExpired);
    return () => {
      controller.abort();
      if (timer) clearTimeout(timer);
      window.removeEventListener("focus", refreshIfExpired);
      document.removeEventListener("visibilitychange", refreshIfExpired);
    };
  }, [attempt]);

  return <section id="market" className="market-section">
    <div className="section-heading"><div><span className="eyebrow">THE BULL IS WATCHING THE CANDLES.</span><h2>{config.market.title}</h2></div><span className="simulation-badge">LIVE DATA</span></div>
    {snapshot ? <SnapshotChart key={snapshot.asOf} snapshot={snapshot} /> : <div className="chart-empty" role="status"><RefreshCw size={25} className={error ? "" : "spinner"} /><p>{error ? "The daily chart is temporarily unavailable." : "Loading today’s market snapshot…"}</p>{error && <button className="button" onClick={() => { setError(false); setAttempt((value) => value + 1); }}>Retry chart</button>}</div>}
  </section>;
}

function SnapshotChart({ snapshot }: { snapshot: MarketSnapshot }) {
  const [range, setRange] = useState(Math.max(0, snapshot.ranges.findIndex((range) => range.label === "24H")));
  const [hover, setHover] = useState<number | null>(null);
  const series = snapshot.ranges[range];
  const min = Math.min(...series.prices) * 0.98;
  const max = Math.max(...series.prices) * 1.02;
  const points = series.prices.map((value, i) => ({ x: 20 + i * 620 / (series.prices.length - 1), y: 184 - (value - min) / (max - min) * 150 }));
  const line = points.map((point, i) => `${i ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  const price = series.prices[hover ?? series.prices.length - 1];
  const rising = series.changePercent >= 0;
  const TrendIcon = rising ? TrendingUp : TrendingDown;
  const snapshotLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: snapshot.timeZone }).format(new Date(snapshot.asOf));
  function inspect(clientX: number, bounds: DOMRect) {
    const index = Math.round(((clientX - bounds.left) / bounds.width * 660 - 20) / 620 * (points.length - 1));
    setHover(Math.max(0, Math.min(points.length - 1, index)));
  }
  return <div className="market-grid" data-snapshot-date={snapshot.snapshotDate}>
    <div className="chart-card"><div className="chart-top"><div><span className="chart-pair">{snapshot.symbol} / USD</span><div className="chart-price"><strong>{formatUsd(price)}</strong><span className={rising ? "" : "negative"}><TrendIcon size={13} />{rising ? "+" : ""}{series.changePercent.toFixed(1)}%</span></div></div><div className="chart-ranges" role="group" aria-label="Chart time range">{snapshot.ranges.map((item, i) => <button key={item.label} aria-pressed={range === i} onClick={() => { setRange(i); setHover(null); }}>{item.label}</button>)}</div></div>
      <div className="chart-plot"><svg viewBox="0 0 660 215" role="img" aria-label={`Simulated ${series.label} price chart for ${snapshot.symbol}, snapshot ${snapshot.snapshotDate}. Starts at ${formatUsd(series.prices[0])} and ends at ${formatUsd(snapshot.lastPriceUsd)}. This is not market data.`} onMouseMove={(event) => inspect(event.clientX, event.currentTarget.getBoundingClientRect())} onMouseLeave={() => setHover(null)} onTouchMove={(event) => inspect(event.touches[0].clientX, event.currentTarget.getBoundingClientRect())} onTouchEnd={() => setHover(null)}>
        {[40, 88, 136, 184].map((y) => <line className="chart-grid-line" key={y} x1="20" x2="640" y1={y} y2={y} />)}
        <path d={`${line} L 640 194 L 20 194 Z`} fill="var(--accent)" opacity="0.08" />
        <path data-price-line d={line} fill="none" stroke="var(--accent)" strokeWidth="3.5" strokeLinejoin="round" />
        {hover !== null && <><line x1={points[hover].x} x2={points[hover].x} y1="20" y2="194" stroke="var(--secondary)" strokeDasharray="4 5" /><circle cx={points[hover].x} cy={points[hover].y} r="6" fill="var(--accent)" stroke="#050505" strokeWidth="3" /></>}
        {series.labels.map((label, i) => <text key={label} x={[20, 330, 640][i]} y="212" textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}>{label}</text>)}
      </svg></div><div className="chart-foot"><span>Daily snapshot · {snapshotLabel}</span><span title={`Next snapshot: ${new Date(snapshot.nextUpdateAt).toLocaleString("en-GB", { timeZone: snapshot.timeZone })} (${snapshot.timeZone})`}>Resets at midnight · {snapshot.timeZone}</span></div>
    </div><aside className="market-stats"><span className="eyebrow">FAKE CHART. REAL MEMES.</span><div><span>Simulated market cap</span><strong>{formatUsd(snapshot.marketCapUsd)}</strong></div><div><span>Simulated volume / {series.label}</span><strong>{formatUsd(series.volumeUsd)}</strong></div><p>For the vibes, not financial decisions. Presale allocations use the SOL tiers above.</p><a href="#presale">Back to the spaceship <ArrowUpRight size={17} /></a></aside>
  </div>;
}
