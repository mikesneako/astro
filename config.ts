/**
 * DemoBull ($DEMOBULL) — Project & Token Configuration
 * 
 * Centralized settings for the DemoBull Solana deep space ecosystem.
 * All constants, bonus formulas, presale tiers, and telemetry values.
 */

// ============================================================================
// 1. TOKEN / COIN IDENTITY
// ============================================================================
export const TOKEN_CONFIG = {
  name: "DemoBull",
  symbol: "$DEMOBULL",
  ticker: "DEMOBULL",
  chain: "Solana",
  tokenStandard: "SPL (Solana Program Library)",
  tagline: "The Deep Space Bull Market Movement",
  headline: "THE NEXT BULL RUN STARTS HERE // DEEP SPACE ORBIT",
  description:
    "DemoBull ($DEMOBULL) is the deep space Solana-native presale launchpad engineered for orbital momentum and 1,000X trajectory.",
  logoUrl: "/logo.png",
  heroImageUrl: "/bull-astronaut-floating.png",
  faviconUrl: "/favicon.ico",
  version: "V1.0-ORBIT",
} as const;

// ============================================================================
// 2. COIN PRICES & VALUATION TIERS
// ============================================================================
export const PRICE_CONFIG = {
  // SOL benchmark price in USD
  solPriceUsd: 180,

  // Standard Presale Rate (1 SOL = 200,000,000 $DEMOBULL)
  tokensPerSol: 200_000_000,

  // Presale Stage 1 Token Price ($0.000001 -> 1,000X to $0.001 listing price)
  tokenPriceUsd: 0.000001,

  // Future stage and listing prices
  nextStagePriceUsd: 0.000002,
  listingPriceUsd: 0.001, // 200,000 $DEMOBULL = $200 (1,000X target)
  expectedLaunchPriceUsd: 0.001,

  tokenPriceFormatted: "$0.000001 USDC",
  nextStagePriceFormatted: "$0.000002 USDC",
  listingPriceFormatted: "$0.001000 USDC",
  tokenPriceSol: 0.000001 / 180,
} as const;

// ============================================================================
// 3. AMOUNTS, SUPPLY & CONTRIBUTION LIMITS (10 BILLION TOTAL SUPPLY)
// ============================================================================
export const AMOUNT_CONFIG = {
  // Total hard-capped supply: 10,000,000,000 (10 Billion)
  totalSupply: 10_000_000_000,
  totalSupplyFormatted: "10,000,000,000",

  // Presale allocation: 8,000,000,000 (80% of 10B)
  presaleSupply: 8_000_000_000,
  presaleSupplyFormatted: "8,000,000,000",
  presalePercentage: 80,

  // Community Airdrop allocation: 500,000,000 (5% of 10B)
  airdropSupply: 500_000_000,
  airdropSupplyFormatted: "500,000,000",
  airdropPercentage: 5,
  airdropAmountPerClaim: 200_000, // 200,000 $DEMOBULL per claimed wallet ($200 at listing)

  // Contribution limits per wallet
  minSolContribution: 0.2, // 0.2 SOL -> 20,000,000 $DEMOBULL
  maxSolContribution: 10.0, // 10 SOL -> 4,000,000,000 $DEMOBULL

  // Official Presale Core Tiers
  tier02SolTokens: 20_000_000,     // 0.2 SOL = 20,000,000 $DEMOBULL
  tier1SolTokens: 200_000_000,     // 1.0 SOL = 200,000,000 $DEMOBULL
  tier5SolTokens: 2_000_000_000,   // 5.0 SOL = 2,000,000,000 $DEMOBULL (Presale Only)

  // Financial caps (USD)
  hardCapUsd: 1_000_000, // $1,000,000 Hard Cap
  softCapUsd: 500_000,   // $500,000 Soft Cap
  hardCapFormatted: "$1,000,000",
  softCapFormatted: "$500,000",

  // Baseline initial raised amount displayed for momentum (starts at 68% = $680,000)
  baselineRaisedUsd: 680_000,
  targetSol: 5555.55,
} as const;

// ============================================================================
// 3.1 DYNAMIC PRESALE PROGRESSION & SCHEDULE CONFIG
// ============================================================================
export const PRESALE_SCHEDULE_CONFIG = {
  anchorStartTime: "2026-09-23T09:42:00.000Z",
  // Presale ends in October
  anchorEndTime: "2026-10-18T21:42:00.000Z",

  // Baseline progress starting point (68% = $680,000 of $1,000,000 hard cap)
  baseProgressPercent: 68.0,
  baseRaisedUsd: 680_000,

  // Daily rate of increase: 1% per 24 hours
  dailyIncreasePercent: 1.0,

  // Hard Cap reference
  hardCapUsd: 1_000_000,
} as const;

/**
 * Calculates the dynamic presale baseline metrics.
 */
export function getDynamicPresaleMetrics(now: Date = new Date()) {
  const startTime = new Date(PRESALE_SCHEDULE_CONFIG.anchorStartTime).getTime();
  const endTime = new Date(PRESALE_SCHEDULE_CONFIG.anchorEndTime).getTime();
  const currentTime = now.getTime();

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysElapsed = Math.max(0, Math.floor((currentTime - startTime) / msPerDay));
  const usdPerPercent = PRESALE_SCHEDULE_CONFIG.hardCapUsd / 100;

  const additionalPercent = daysElapsed * PRESALE_SCHEDULE_CONFIG.dailyIncreasePercent;
  const currentBaselinePercent = Math.min(100, PRESALE_SCHEDULE_CONFIG.baseProgressPercent + additionalPercent);
  const additionalUsd = additionalPercent * usdPerPercent;
  const currentBaselineUsd = Math.min(
    PRESALE_SCHEDULE_CONFIG.hardCapUsd,
    PRESALE_SCHEDULE_CONFIG.baseRaisedUsd + additionalUsd
  );

  return {
    daysElapsed,
    currentBaselinePercent,
    currentBaselineUsd,
    endTime: PRESALE_SCHEDULE_CONFIG.anchorEndTime,
    isEnded: currentTime >= endTime,
  };
}

// ============================================================================
// 4. PRESALE BONUS TIERS MATRIX (PRESALE ONLY)
// ============================================================================
export interface PresaleBonusTier {
  id: number;
  solAmount: number;
  solAmountStr: string;
  baseTokens: number;
  bonusTokens: number;
  bonusPercent: number;
  totalTokens: number;
  totalTokensFormatted: string;
  bonusFormatted: string;
  badge: string;
  badgeColor: string;
  isPopular?: boolean;
  highlight?: boolean;
  isPresaleOnly?: boolean;
}

export const PRESALE_BONUS_TIERS: PresaleBonusTier[] = [
  {
    id: 1,
    solAmount: 0.2,
    solAmountStr: "0.2",
    baseTokens: 20_000_000,
    bonusTokens: 0,
    bonusPercent: 0,
    totalTokens: 20_000_000,
    totalTokensFormatted: "20,000,000",
    bonusFormatted: "BASE ALLOCATION",
    badge: "ENTRY TIER • 20M",
    badgeColor: "text-[#00ff66] border-[#00ff66]/40 bg-[#00ff66]/10",
    highlight: true,
  },
  {
    id: 2,
    solAmount: 0.5,
    solAmountStr: "0.5",
    baseTokens: 50_000_000,
    bonusTokens: 30_000_000,
    bonusPercent: 60,
    totalTokens: 80_000_000,
    totalTokensFormatted: "80,000,000",
    bonusFormatted: "+30M (+60% BONUS)",
    badge: "⚡ +60% BONUS",
    badgeColor: "text-[#38BDF8] border-[#38BDF8]/40 bg-[#38BDF8]/10",
  },
  {
    id: 3,
    solAmount: 1.0,
    solAmountStr: "1.0",
    baseTokens: 100_000_000,
    bonusTokens: 100_000_000,
    bonusPercent: 100,
    totalTokens: 200_000_000,
    totalTokensFormatted: "200,000,000",
    bonusFormatted: "+100M (+100% BONUS)",
    badge: "⭐ MOST POPULAR • +100% BONUS",
    badgeColor: "text-[#F59E0B] border-[#F59E0B]/40 bg-[#F59E0B]/10",
    isPopular: true,
    highlight: true,
  },
  {
    id: 4,
    solAmount: 2.0,
    solAmountStr: "2.0",
    baseTokens: 200_000_000,
    bonusTokens: 300_000_000,
    bonusPercent: 150,
    totalTokens: 500_000_000,
    totalTokensFormatted: "500,000,000",
    bonusFormatted: "+300M (+150% BONUS)",
    badge: "🐂 ORBITAL HERD • +150% BONUS",
    badgeColor: "text-[#9945FF] border-[#9945FF]/40 bg-[#9945FF]/10",
  },
  {
    id: 5,
    solAmount: 5.0,
    solAmountStr: "5.0",
    baseTokens: 500_000_000,
    bonusTokens: 1_500_000_000,
    bonusPercent: 300,
    totalTokens: 2_000_000_000,
    totalTokensFormatted: "2,000,000,000",
    bonusFormatted: "+1.5B (+300% BONUS) • PRESALE ONLY",
    badge: "💎 2 BILLION TOKENS • PRESALE ONLY",
    badgeColor: "text-[#EC4899] border-[#EC4899]/40 bg-[#EC4899]/10",
    highlight: true,
    isPresaleOnly: true,
  },
  {
    id: 6,
    solAmount: 10.0,
    solAmountStr: "10.0",
    baseTokens: 1_000_000_000,
    bonusTokens: 3_000_000_000,
    bonusPercent: 300,
    totalTokens: 4_000_000_000,
    totalTokensFormatted: "4,000,000,000",
    bonusFormatted: "+3B (+300% BONUS) • PRESALE ONLY",
    badge: "👑 4 BILLION TOKENS • APEX WHALE",
    badgeColor: "text-[#00ff66] border-[#00ff66]/40 bg-[#00ff66]/10",
    isPresaleOnly: true,
  },
];

// ============================================================================
// 5. CALCULATION HELPERS
// ============================================================================
export function calculatePresaleTokens(solAmount: number): {
  baseTokens: number;
  bonusTokens: number;
  bonusPercent: number;
  totalTokens: number;
  bonusLabel: string;
} {
  const sol = Number(solAmount);
  if (!sol || isNaN(sol) || sol <= 0) {
    return {
      baseTokens: 0,
      bonusTokens: 0,
      bonusPercent: 0,
      totalTokens: 0,
      bonusLabel: "0% BONUS",
    };
  }

  const tier = PRESALE_BONUS_TIERS.find((t) => Math.abs(t.solAmount - sol) < 0.0001);
  if (tier) {
    return {
      baseTokens: tier.baseTokens,
      bonusTokens: tier.bonusTokens,
      bonusPercent: tier.bonusPercent,
      totalTokens: tier.totalTokens,
      bonusLabel: tier.bonusFormatted,
    };
  }

  if (sol < 0.2) {
    const total = Math.floor(sol * 100_000_000);
    return {
      baseTokens: total,
      bonusTokens: 0,
      bonusPercent: 0,
      totalTokens: total,
      bonusLabel: "MIN 0.2 SOL",
    };
  }

  if (sol < 1.0) {
    const totalTokens = Math.floor(20_000_000 + ((sol - 0.2) / 0.8) * (200_000_000 - 20_000_000));
    const baseTokens = Math.floor(sol * 100_000_000);
    const bonusTokens = Math.max(0, totalTokens - baseTokens);
    const bonusPercent = baseTokens > 0 ? Math.round((bonusTokens / baseTokens) * 100) : 0;
    return {
      baseTokens,
      bonusTokens,
      bonusPercent,
      totalTokens,
      bonusLabel: `+${(bonusTokens / 1_000_000).toFixed(1)}M (+${bonusPercent}% BONUS)`,
    };
  }

  if (sol < 5.0) {
    const totalTokens = Math.floor(200_000_000 + ((sol - 1.0) / 4.0) * (2_000_000_000 - 200_000_000));
    const baseTokens = Math.floor(sol * 100_000_000);
    const bonusTokens = Math.max(0, totalTokens - baseTokens);
    const bonusPercent = baseTokens > 0 ? Math.round((bonusTokens / baseTokens) * 100) : 0;
    return {
      baseTokens,
      bonusTokens,
      bonusPercent,
      totalTokens,
      bonusLabel: `+${(bonusTokens / 1_000_000).toFixed(0)}M (+${bonusPercent}% BONUS)`,
    };
  }

  const totalTokens = Math.floor(sol * 400_000_000);
  const baseTokens = Math.floor(sol * 100_000_000);
  const bonusTokens = totalTokens - baseTokens;
  return {
    baseTokens,
    bonusTokens,
    bonusPercent: 300,
    totalTokens,
    bonusLabel: `+${(bonusTokens / 1_000_000).toFixed(0)}M (+300% WHALE BONUS • PRESALE ONLY)`,
  };
}

export function calculateTokensForSol(solAmount: number): number {
  return calculatePresaleTokens(solAmount).totalTokens;
}

export function validateSolContribution(solAmount: number): {
  isValid: boolean;
  error?: string;
} {
  if (isNaN(solAmount) || solAmount <= 0) {
    return { isValid: false, error: "Please enter a valid amount." };
  }
  if (solAmount < AMOUNT_CONFIG.minSolContribution) {
    return {
      isValid: false,
      error: `Minimum contribution is ${AMOUNT_CONFIG.minSolContribution} SOL (${AMOUNT_CONFIG.tier02SolTokens.toLocaleString()} $DEMOBULL).`,
    };
  }
  if (solAmount > AMOUNT_CONFIG.maxSolContribution) {
    return {
      isValid: false,
      error: `Maximum contribution is ${AMOUNT_CONFIG.maxSolContribution} SOL (4,000,000,000 $DEMOBULL).`,
    };
  }
  return { isValid: true };
}

// ============================================================================
// 6. X (TWITTER) & SOCIAL MEDIA CONFIGURATION
// ============================================================================
const rawXUsername = process.env.NEXT_PUBLIC_X_USERNAME || "DemoBullCoin";
const cleanXUsername = rawXUsername.replace(/^@/, "");

export const SOCIAL_CONFIG = {
  xUsername: cleanXUsername,
  xHandle: `@${cleanXUsername}`,
  xUrl: process.env.NEXT_PUBLIC_X_URL || `https://x.com/${cleanXUsername}`,
  telegramUsername: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "DemoBullCoin",
  telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/DemoBullCoin",
  discordUrl: process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.com",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com",
  dexScreenerUrl: "https://dexscreener.com/solana",
  birdeyeUrl: "https://birdeye.so",
  coinMarketCapUrl: "https://coinmarketcap.com",
  coinGeckoUrl: "https://coingecko.com",
} as const;

// ============================================================================
// 7. BLOCKCHAIN & WALLET ADDRESSES
// ============================================================================
export const NETWORK_CONFIG = {
  networkName: "Solana",
  cluster: "mainnet-beta",
  rpcEndpoint: "https://api.mainnet-beta.solana.com",
  blockTimeMs: 400,
  explorerBaseUrl: "https://solscan.io",
  presaleWalletAddress: "8trY7gA9kzf9Yu4LUW8SdGCuydHAHfodCEFH3CGHUgWR",
  displayShortAddress: "8trY...UgWR",
  contractAddress: "COMING SOON",
  isContractDeployed: false,
} as const;

// ============================================================================
// 8. TELEMETRY & SCI-FI TERMINAL AMBIANCE
// ============================================================================
export const TELEMETRY_CONFIG = {
  carrierFreq: "1420.405 MHz",
  nodeId: "ORBIT-01",
  initialBlockHeight: 312845000,
  gasTpsEstimate: "3,840 TPS",
} as const;

// ============================================================================
// 9. PRESALE ROUND & DURATION CONFIG
// ============================================================================
export const PRESALE_CONFIG = {
  currentRound: 1,
  totalRounds: 3,
  roundName: "STAGE 1 • DEEP SPACE ORBIT",
  roundStatus: "LIVE",
  depositAddress: NETWORK_CONFIG.presaleWalletAddress,
  tokenPrice: PRICE_CONFIG.tokenPriceUsd,
  minSol: AMOUNT_CONFIG.minSolContribution,
  maxSol: AMOUNT_CONFIG.maxSolContribution,
  hardCapUsd: AMOUNT_CONFIG.hardCapUsd,
  softCapUsd: AMOUNT_CONFIG.softCapUsd,
  tokensPerSol: PRICE_CONFIG.tokensPerSol,
  tiers: PRESALE_BONUS_TIERS,
} as const;

// ============================================================================
// 10. TOKENOMICS ALLOCATION BREAKDOWN (10 BILLION TOTAL SUPPLY)
// ============================================================================
export interface TokenomicsAllocation {
  name: string;
  percentage: number;
  amount: number;
  description: string;
  color: string;
  borderHover: string;
  vesting: string;
}

export const TOKENOMICS_CONFIG: TokenomicsAllocation[] = [
  {
    name: "PRESALES & ORBIT SALES",
    percentage: 80,
    amount: 8_000_000_000,
    description: "Public presales with tiered bonuses (0.2 SOL=20M, 1 SOL=200M, 5 SOL=2B).",
    color: "bg-[#00ff66]",
    borderHover: "hover:border-[#00ff66]",
    vesting: "100% unlocked at TGE",
  },
  {
    name: "LIQUIDITY POOLS",
    percentage: 10,
    amount: 1_000_000_000,
    description: "Raydium & Orca DEX liquidity pool, LP tokens burned/locked forever.",
    color: "bg-[#9945FF]",
    borderHover: "hover:border-[#9945FF]",
    vesting: "Locked at launch",
  },
  {
    name: "COMMUNITY & AIRDROPS",
    percentage: 5,
    amount: 500_000_000,
    description: "Community airdrops (200k tokens / $200 listing value per claim), orbital mission rewards.",
    color: "bg-[#38BDF8]",
    borderHover: "hover:border-[#38BDF8]",
    vesting: "Quarterly emissions",
  },
  {
    name: "MARKETING & KOL ORBIT",
    percentage: 3,
    amount: 300_000_000,
    description: "Global bull market momentum, Tier-1 KOLs and viral space campaigns.",
    color: "bg-[#F59E0B]",
    borderHover: "hover:border-[#F59E0B]",
    vesting: "6-month linear vest",
  },
  {
    name: "CORE TEAM & SECURITY",
    percentage: 2,
    amount: 200_000_000,
    description: "Core aerospace engineering, smart contract security, and operational audit commitment.",
    color: "bg-[#EC4899]",
    borderHover: "hover:border-[#EC4899]",
    vesting: "12-month lock + 12-month linear",
  },
];

// ============================================================================
// 11. SITE METADATA & NAVIGATION
// ============================================================================
export const SITE_CONFIG = {
  title: "DemoBull ($DEMOBULL) — Deep Space Solana Launchpad",
  description:
    "Official presale for DemoBull ($DEMOBULL) on Solana. 10B supply, 80% presale allocation, and $0.001 listing target. Join the orbital bull mission today.",
  ogTitle: "DemoBull ($DEMOBULL) — Deep Space Solana Launchpad",
  ogDescription:
    "Official presale for DemoBull ($DEMOBULL) on Solana: 10B supply, 80% presale allocation, and 1,000X target. Buy $DEMOBULL today!",
  twitterTitle: "DemoBull ($DEMOBULL) — Deep Space Solana Launchpad",
  twitterDescription:
    "Official presale for DemoBull ($DEMOBULL) on Solana: 10B supply, 80% presale allocation, and 1,000X target. Buy $DEMOBULL today!",
  url: "https://www.DemoBull.space",
  ogImage: "/og-image.png",
  navLinks: [
    { name: "ORBIT", href: "#orbit" },
    { name: "HOW TO BUY", href: "#how-to-buy" },
    { name: "PRESALE", href: "#presale" },
    { name: "AIRDROP", href: "#airdrop" },
    { name: "TOKENOMICS", href: "#tokenomics" },
    { name: "ROADMAP", href: "#roadmap" },
  ],
} as const;

// Top-level direct exports
export const NAME = TOKEN_CONFIG.name;
export const SYMBOL = TOKEN_CONFIG.symbol;
export const TICKER = TOKEN_CONFIG.ticker;
export const TOKEN_PRICE = PRICE_CONFIG.tokenPriceUsd;
export const SOL_PRICE_USD = PRICE_CONFIG.solPriceUsd;
export const TOTAL_SUPPLY = AMOUNT_CONFIG.totalSupply;
export const PRESALE_SUPPLY = AMOUNT_CONFIG.presaleSupply;
export const AIRDROP_AMOUNT = AMOUNT_CONFIG.airdropAmountPerClaim;
export const X_USERNAME = SOCIAL_CONFIG.xUsername;
export const X_URL = SOCIAL_CONFIG.xUrl;
export const TELEGRAM_URL = SOCIAL_CONFIG.telegramUrl;
export const DISCORD_URL = SOCIAL_CONFIG.discordUrl;
export const PRESALE_WALLET_ADDRESS = NETWORK_CONFIG.presaleWalletAddress;
export const CONTRACT_ADDRESS = NETWORK_CONFIG.contractAddress;

export const CONFIG = {
  token: TOKEN_CONFIG,
  price: PRICE_CONFIG,
  amount: AMOUNT_CONFIG,
  tiers: PRESALE_BONUS_TIERS,
  social: SOCIAL_CONFIG,
  socials: SOCIAL_CONFIG,
  network: NETWORK_CONFIG,
  wallet: {
    presaleAddress: NETWORK_CONFIG.presaleWalletAddress,
    displayShortAddress: NETWORK_CONFIG.displayShortAddress,
  },
  telemetry: TELEMETRY_CONFIG,
  presale: PRESALE_CONFIG,
  tokenomics: TOKENOMICS_CONFIG,
  site: SITE_CONFIG,
  pricing: {
    baseRatePerSol: PRICE_CONFIG.tokensPerSol,
    tiers: PRESALE_BONUS_TIERS,
    quickSelectAmounts: ["0.2", "0.5", "1", "2", "5", "10"],
  },
  airdrop: {
    rewardTokens: AMOUNT_CONFIG.airdropAmountPerClaim,
    rewardFormatted: "200,000 $DEMOBULL",
    poolTotal: "500,000,000",
    claimsPerWallet: 1,
  },
  countdown: {
    targetDate: PRESALE_SCHEDULE_CONFIG.anchorEndTime,
    targetLabel: "OCTOBER 2026",
    title: "MISSION LAUNCH",
    subtitle: "ORBITAL INSERTION",
  },
  helpers: {
    calculatePresaleTokens,
    calculateTokensForSol,
    validateSolContribution,
  },
};

export default CONFIG;
