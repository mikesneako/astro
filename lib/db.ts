import "server-only";
import { createClient } from "@supabase/supabase-js";
import { config, presaleSupply, referenceTokenPriceUsd, presaleCapacityUsd } from "@/config";

// Server credentials only. No project URL or key is bundled into the browser.
function database() {
  const url = process.env.DB_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.DB_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Database is not configured.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function getPresaleConfig() {
  return {
    id: 1,
    token_name: config.brand.name,
    token_symbol: config.brand.ticker,
    token_price: referenceTokenPriceUsd,
    pricing_model: "tiered-linear",
    tiers: config.presale.tiers,
    sol_price_usd: config.presale.solPriceUsd,
    total_supply: config.token.totalSupply,
    presale_supply: presaleSupply,
    total_cap: presaleCapacityUsd,
    start_time: config.presale.startsAt,
    end_time: config.presale.endsAt,
    presale_wallet_address: config.network.presaleWalletAddress,
    network_cluster: config.network.cluster,
    payment_method: "manual-transfer",
  };
}

export async function getPresaleStats() {
  const client = database();
  let totalSolRaised = 0;
  let totalTokensSold = 0;
  const participants = new Set<string>();
  // Supabase limits each response; paginate so totals never silently truncate.
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client.from("presale_transactions")
      .select("wallet_address, sol_amount, token_amount").order("id").range(offset, offset + 999)
      .abortSignal(AbortSignal.timeout(8000));
    if (error) throw new Error("Unable to load presale totals.");
    for (const row of data) {
      totalSolRaised += Number(row.sol_amount);
      totalTokensSold += Number(row.token_amount);
      participants.add(row.wallet_address);
    }
    if (data.length < 1000) break;
  }
  return { totalRaisedUsd: totalSolRaised * config.presale.solPriceUsd, totalSolRaised, totalTokensSold, participantCount: participants.size };
}

export async function getAirdropStats() {
  const client = database();
  let totalClaims = 0;
  let totalAllocated = 0;
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client.from("airdrop_claims").select("amount").order("id").range(offset, offset + 999)
      .abortSignal(AbortSignal.timeout(8000));
    if (error) throw new Error("Unable to load airdrop totals.");
    totalClaims += data.length;
    totalAllocated += data.reduce((sum, row) => sum + Number(row.amount), 0);
    if (data.length < 1000) break;
  }
  return { totalClaims, totalAllocated };
}

export async function claimDemoAirdrop(walletAddress: string) {
  const { data, error } = await database().rpc("claim_demo_airdrop", {
    p_wallet: walletAddress,
    p_amount: config.airdrop.rewardTokens,
    p_pool: config.airdrop.poolTokens,
  }).abortSignal(AbortSignal.timeout(8000));
  if (error) {
    if (error.message.includes("Airdrop pool exhausted")) return { exhausted: true as const };
    throw new Error("Unable to save the demo claim.");
  }
  return data as { walletAddress: string; amount: number; alreadyClaimed: boolean; totalClaims: number; totalAllocated: number };
}
