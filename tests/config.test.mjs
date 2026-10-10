import { describe, expect, test } from "bun:test";
import { config, effectiveTokenPriceUsd, presaleCapacityUsd, presaleSupply, quoteTokens, saleStatus, validateAmount } from "../config.ts";

describe("presale quote and configuration", () => {
  test("matches the requested allocation tiers and existing upper tiers exactly", () => {
    expect(quoteTokens(0.2)).toBe(20_000_000);
    expect(quoteTokens(1)).toBe(200_000_000);
    expect(quoteTokens(2)).toBe(500_000_000);
    expect(quoteTokens(5)).toBe(650_000_000);
    expect(quoteTokens(10)).toBe(2_000_000_000);
  });
  test("interpolates custom amounts without discontinuities at a tier", () => {
    expect(quoteTokens(0.5)).toBe(87_500_000);
    expect(quoteTokens(1.5)).toBe(350_000_000);
    expect(quoteTokens(3)).toBe(550_000_000);
    expect(quoteTokens(7.5)).toBe(1_325_000_000);
    for (const sol of [1, 2, 5]) {
      expect(quoteTokens(sol - 0.000000001)).toBeLessThan(quoteTokens(sol));
      expect(quoteTokens(sol + 0.000000001)).toBeGreaterThan(quoteTokens(sol));
    }
    expect(effectiveTokenPriceUsd(10)).toBeCloseTo(0.0000009, 12);
    expect(effectiveTokenPriceUsd(1)).toBeCloseTo(0.0000009, 12);
  });
  test("rejects invalid and out-of-range amounts", () => {
    for (const sol of [NaN, Infinity, -Infinity, -1, 0, config.presale.minSol / 2, config.presale.maxSol + 1, 0.2000000001]) expect(validateAmount(sol)).not.toBeNull();
    for (const sol of [config.presale.minSol, config.presale.maxSol, ...config.presale.tiers.map((tier) => tier.sol)]) expect(validateAmount(sol)).toBeNull();
    expect(quoteTokens(Infinity)).toBe(0);
    expect(quoteTokens(-1)).toBe(0);
  });
  test("supply, allocation and goal agree", () => {
    expect(config.token.allocations.reduce((total, item) => total + item.percent, 0)).toBe(100);
    expect(presaleCapacityUsd).toBe(presaleSupply * effectiveTokenPriceUsd(2));
    expect(config.presale.tiers[0].sol).toBe(config.presale.minSol);
    expect(config.presale.tiers.at(-1).sol).toBe(config.presale.maxSol);
    expect(config.presale.solPriceUsd).toBeGreaterThan(0);
    expect(config.airdrop.poolTokens).toBeLessThanOrEqual(config.token.totalSupply * config.token.allocations.find((allocation) => allocation.name === "Community").percent / 100);
    expect(config.airdrop.rewardTokens).toBeGreaterThan(0);
    expect(config.airdrop.poolTokens % config.airdrop.rewardTokens).toBe(0);
  });
  test("sale respects start and end boundaries", () => {
    expect(saleStatus(Date.parse(config.presale.startsAt) - 1)).toBe("upcoming");
    expect(saleStatus(Date.parse(config.presale.startsAt))).toBe("open");
    expect(saleStatus(Date.parse(config.presale.endsAt))).toBe("closed");
  });
});
