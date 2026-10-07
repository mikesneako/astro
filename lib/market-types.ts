export type MarketRange = {
  label: string;
  prices: number[];
  timestamps: string[];
  labels: string[];
  changePercent: number;
  volumeUsd: number;
};

export type MarketSnapshot = {
  simulated: true;
  snapshotDate: string;
  timeZone: string;
  asOf: string;
  nextUpdateAt: string;
  symbol: string;
  lastPriceUsd: number;
  marketCapUsd: number;
  ranges: MarketRange[];
};
