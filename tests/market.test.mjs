import { describe, expect, test } from "bun:test";
import { createMarketSnapshot, snapshotWindow } from "../lib/market-simulation.ts";

describe("backend daily market snapshot", () => {
  test("all visitors receive identical data throughout the Lagos day", () => {
    const start = createMarketSnapshot(new Date("2026-10-06T23:00:00Z"));
    const midday = createMarketSnapshot(new Date("2026-10-07T12:00:00Z"));
    const end = createMarketSnapshot(new Date("2026-10-07T22:59:59.999Z"));
    expect(start).toEqual(midday);
    expect(start).toEqual(end);
    expect(start.snapshotDate).toBe("2026-10-07");
    expect(start.nextUpdateAt).toBe("2026-10-07T23:00:00.000Z");
  });
  test("changes once at local midnight and keeps historical points consistent", () => {
    const before = createMarketSnapshot(new Date("2026-10-07T22:59:59Z"));
    const after = createMarketSnapshot(new Date("2026-10-07T23:00:00Z"));
    expect(after.snapshotDate).toBe("2026-10-08");
    expect(before).not.toEqual(after);
    expect(after.lastPriceUsd).not.toBe(before.lastPriceUsd);
    expect(after.ranges.find((range) => range.label === "24H").prices[0]).toBe(before.lastPriceUsd);
  });
  test("ranges share an endpoint, timestamp-consistent prices and positive volumes", () => {
    const snapshot = createMarketSnapshot(new Date("2026-10-07T12:00:00Z"));
    const known = new Map();
    for (const range of snapshot.ranges) {
      expect(range.prices.length).toBe(25);
      expect(range.prices.at(-1)).toBe(snapshot.lastPriceUsd);
      expect(range.timestamps.at(-1)).toBe(snapshot.asOf);
      expect(range.volumeUsd).toBeGreaterThan(0);
      for (const [index, price] of range.prices.entries()) {
        expect(price).toBeGreaterThan(0);
        const timestamp = range.timestamps[index];
        if (known.has(timestamp)) expect(price).toBe(known.get(timestamp));
        known.set(timestamp, price);
      }
    }
  });
  test("reset window respects timezone DST instead of assuming 24 hours", () => {
    const window = snapshotWindow(new Date("2026-03-08T12:00:00Z"), "America/New_York");
    expect(window.end - window.start).toBe(23 * 3600000);
  });
});
