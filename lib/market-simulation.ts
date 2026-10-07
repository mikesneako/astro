// Node-only generator. Import it in server routes, never in client components.
import { createHash } from "node:crypto";
import { config, symbol } from "../config";
import type { MarketSnapshot } from "./market-types";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

function dateParts(date: Date, timeZone: string) {
  return Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
}

function midnightInZone(calendarDate: number, timeZone: string) {
  let timestamp = calendarDate;
  for (let i = 0; i < 4; i++) {
    const parts = dateParts(new Date(timestamp), timeZone);
    const representedDate = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    const difference = representedDate - calendarDate;
    if (difference === 0) return timestamp;
    timestamp -= difference;
  }
  throw new Error("Could not resolve the configured market reset timezone.");
}

export function snapshotWindow(now: Date, timeZone = config.market.snapshotTimeZone) {
  const parts = dateParts(now, timeZone);
  const day = Date.UTC(parts.year, parts.month - 1, parts.day);
  return {
    snapshotDate: new Date(day).toISOString().slice(0, 10),
    start: midnightInZone(day, timeZone),
    end: midnightInZone(day + DAY, timeZone),
  };
}

function noise(key: string) {
  return createHash("sha256").update(`${config.market.simulationSeed}:${key}`).digest().readUInt32LE(0) / 0xffffffff;
}

function simulatedPrice(timestamp: number) {
  // Every absolute time maps to one price: overlapping ranges/days agree.
  const hours = timestamp / HOUR;
  const anchor = Math.floor(hours / 6);
  const blend = hours / 6 - anchor;
  const variation = noise(`price:${anchor}`) * (1 - blend) + noise(`price:${anchor + 1}`) * blend;
  const multiplier = 0.94 + Math.sin(hours / 37) * 0.1 + Math.sin(hours / 2.8) * 0.035 + variation * 0.12;
  return Number((config.market.referencePriceUsd * multiplier).toPrecision(12));
}

export function createMarketSnapshot(now = new Date()): MarketSnapshot {
  const window = snapshotWindow(now);
  const ranges = config.market.ranges.map(({ label, hours }) => {
    const timestamps = Array.from({ length: 25 }, (_, i) => window.start - hours * HOUR + hours * HOUR * i / 24);
    const prices = timestamps.map(simulatedPrice);
    let volumeUsd = 0;
    for (let i = 0; i < hours; i++) volumeUsd += config.market.referenceVolumeUsd * (0.6 + noise(`volume:${window.start / HOUR - i}`) * 0.8);
    return {
      label,
      prices,
      timestamps: timestamps.map((timestamp) => new Date(timestamp).toISOString()),
      labels: [hours < 24 ? `${hours}h before` : `${hours / 24}d before`, hours < 24 ? `${hours * 30}m before` : `${hours / 2}h before`, "Snapshot"],
      changePercent: (prices.at(-1)! / prices[0] - 1) * 100,
      volumeUsd: Math.round(volumeUsd * 100) / 100,
    };
  });
  const lastPriceUsd = simulatedPrice(window.start);
  return {
    simulated: true,
    snapshotDate: window.snapshotDate,
    timeZone: config.market.snapshotTimeZone,
    asOf: new Date(window.start).toISOString(),
    nextUpdateAt: new Date(window.end).toISOString(),
    symbol,
    lastPriceUsd,
    marketCapUsd: lastPriceUsd * config.token.totalSupply,
    ranges,
  };
}
