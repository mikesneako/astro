import { createClient } from "@supabase/supabase-js";
import { getDynamicPresaleMetrics, PRESALE_SCHEDULE_CONFIG } from "@/config";

// Supabase credentials resolution
const supabaseUrl =
  process.env.DB_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://yhfofbmynkayzeghdjoe.supabase.co";

const supabaseKey =
  process.env.DB_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.DB_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface PresaleWallet {
  id: number;
  wallet_address: string;
  created_at: string;
}

export interface PresaleTransaction {
  id: number;
  wallet_address: string;
  transaction_signature: string;
  sol_amount: number;
  token_amount: number;
  created_at: string;
}

export interface PresaleConfig {
  id: number;
  token_price: number;
  total_supply: number;
  presale_supply: number;
  total_cap: number;
  start_time: string;
  end_time: string;
}

export interface AirdropClaim {
  id: number;
  wallet_address: string;
  amount: number;
  status: string;
  created_at: string;
}

export async function getWallet(address: string): Promise<PresaleWallet | undefined> {
  const { data, error } = await supabase
    .from("presale_wallets")
    .select("id, wallet_address, created_at")
    .eq("wallet_address", address)
    .maybeSingle();

  if (error || !data) {
    return undefined;
  }

  return {
    id: Number(data.id),
    wallet_address: data.wallet_address,
    created_at: data.created_at,
  };
}

export async function registerWallet(
  address: string
): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("presale_wallets")
      .insert({ wallet_address: address })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505" || error.message?.includes("duplicate") || error.message?.includes("UNIQUE")) {
        return {
          success: false,
          error: "This wallet has already participated in the presale.",
        };
      }
      return { success: false, error: error.message };
    }

    return { success: true, id: Number(data.id) };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to register wallet." };
  }
}

export async function saveTransaction(data: {
  wallet_address: string;
  transaction_signature: string;
  sol_amount: number;
  token_amount: number;
}): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const { data: inserted, error } = await supabase
      .from("presale_transactions")
      .insert({
        wallet_address: data.wallet_address,
        transaction_signature: data.transaction_signature,
        sol_amount: data.sol_amount,
        token_amount: data.token_amount,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505" || error.message?.includes("duplicate")) {
        return {
          success: false,
          error: "This transaction signature has already been processed.",
        };
      }
      return { success: false, error: error.message };
    }

    return { success: true, id: Number(inserted.id) };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: err.message || "Failed to save presale transaction.",
    };
  }
}

export async function getTransactionsByWallet(
  walletAddress: string
): Promise<PresaleTransaction[]> {
  const { data, error } = await supabase
    .from("presale_transactions")
    .select("id, wallet_address, transaction_signature, sol_amount, token_amount, created_at")
    .eq("wallet_address", walletAddress)
    .order("id", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((tx) => ({
    id: Number(tx.id),
    wallet_address: tx.wallet_address,
    transaction_signature: tx.transaction_signature,
    sol_amount: Number(tx.sol_amount),
    token_amount: Number(tx.token_amount),
    created_at: tx.created_at,
  }));
}

export async function getPresaleStats(): Promise<{
  totalRaisedUsdc: number;
  totalSolRaised: number;
  totalTokensSold: number;
  participantCount: number;
}> {
  const { count: participantCount } = await supabase
    .from("presale_wallets")
    .select("*", { count: "exact", head: true });

  const { data: txs } = await supabase
    .from("presale_transactions")
    .select("sol_amount, token_amount");

  let totalSolRaised = 0;
  let totalTokensSold = 0;

  if (txs) {
    for (const tx of txs) {
      totalSolRaised += Number(tx.sol_amount || 0);
      totalTokensSold += Number(tx.token_amount || 0);
    }
  }

  const { currentBaselineUsd } = getDynamicPresaleMetrics();
  const solPrice = 180;
  const actualRaisedUsdc = totalSolRaised * solPrice;

  return {
    totalRaisedUsdc: currentBaselineUsd + actualRaisedUsdc,
    totalSolRaised,
    totalTokensSold,
    participantCount: participantCount || 0,
  };
}

export async function getPresaleConfig(): Promise<PresaleConfig> {
  const { data, error } = await supabase
    .from("presale_config")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    const startTime = PRESALE_SCHEDULE_CONFIG.anchorStartTime;
    const futureEndTime = PRESALE_SCHEDULE_CONFIG.anchorEndTime;

    return {
      id: 1,
      token_price: 0.000001,
      total_supply: 10000000000,
      presale_supply: 8000000000,
      total_cap: 1000000,
      start_time: startTime,
      end_time: futureEndTime,
    };
  }

  return {
    id: Number(data.id),
    token_price: Number(data.token_price),
    total_supply: Number(data.total_supply),
    presale_supply: Number(data.presale_supply),
    total_cap: Number(data.total_cap),
    start_time: data.start_time,
    end_time: data.end_time,
  };
}

export async function claimAirdrop(
  walletAddress: string,
  amount: number = 200000
): Promise<{ success: boolean; claim?: AirdropClaim; alreadyClaimed?: boolean; error?: string }> {
  try {
    const existing = await getAirdropClaim(walletAddress);
    if (existing) {
      return {
        success: true,
        alreadyClaimed: true,
        claim: existing,
      };
    }

    const { data, error } = await supabase
      .from("airdrop_claims")
      .insert({
        wallet_address: walletAddress,
        amount,
        status: "CLAIMED",
      })
      .select("id, wallet_address, amount, status, created_at")
      .single();

    if (error) {
      if (error.code === "23505" || error.message?.includes("duplicate") || error.message?.includes("UNIQUE")) {
        const fallback = await getAirdropClaim(walletAddress);
        return {
          success: true,
          alreadyClaimed: true,
          claim: fallback,
        };
      }
      return { success: false, error: error.message };
    }

    return {
      success: true,
      alreadyClaimed: false,
      claim: {
        id: Number(data.id),
        wallet_address: data.wallet_address,
        amount: Number(data.amount),
        status: data.status,
        created_at: data.created_at,
      },
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to process airdrop claim." };
  }
}

export async function getAirdropClaim(walletAddress: string): Promise<AirdropClaim | undefined> {
  const { data, error } = await supabase
    .from("airdrop_claims")
    .select("id, wallet_address, amount, status, created_at")
    .eq("wallet_address", walletAddress)
    .maybeSingle();

  if (error || !data) {
    return undefined;
  }

  return {
    id: Number(data.id),
    wallet_address: data.wallet_address,
    amount: Number(data.amount),
    status: data.status,
    created_at: data.created_at,
  };
}

export async function getRecentAirdropClaims(limit: number = 8): Promise<AirdropClaim[]> {
  const { data, error } = await supabase
    .from("airdrop_claims")
    .select("id, wallet_address, amount, status, created_at")
    .order("id", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((r) => ({
    id: Number(r.id),
    wallet_address: r.wallet_address,
    amount: !r.amount || Number(r.amount) < 200000 ? 200000 : Number(r.amount),
    status: r.status,
    created_at: r.created_at,
  }));
}

export async function getAirdropStats(): Promise<{ totalClaims: number; totalTokensAllocated: number }> {
  const { count, data } = await supabase
    .from("airdrop_claims")
    .select("amount", { count: "exact" });

  let sum = 0;
  if (data) {
    for (const row of data) {
      sum += Number(row.amount || 200000);
    }
  }

  const baselineCount = 3850;
  const baselineTokens = 770000000;

  return {
    totalClaims: baselineCount + (count || 0),
    totalTokensAllocated: baselineTokens + sum,
  };
}

export async function resetAirdropWallet(walletAddress: string): Promise<boolean> {
  await supabase.from("airdrop_claims").delete().eq("wallet_address", walletAddress);
  return true;
}

export async function resetPresaleWallet(walletAddress: string): Promise<boolean> {
  await supabase.from("presale_transactions").delete().eq("wallet_address", walletAddress);
  await supabase.from("presale_wallets").delete().eq("wallet_address", walletAddress);
  return true;
}

export default supabase;
