import { SQL } from "bun";
import { config, presaleSupply, referenceTokenPriceUsd, presaleCapacityUsd } from "../config.ts";

const url = process.env.DB_POSTGRES_URL ?? process.env.DB_POSTGRES_PRISMA_URL;
if (!url) throw new Error("Missing database connection in .env");
const sql = new SQL(url, { max: 1, connectionTimeout: 15, prepare: false });
try {
  await sql.begin(async (tx) => {
    await tx`ALTER TABLE public.presale_config ADD COLUMN IF NOT EXISTS site_config jsonb NOT NULL DEFAULT '{}'::jsonb`;
    await tx`CREATE UNIQUE INDEX IF NOT EXISTS airdrop_claims_wallet_unique ON public.airdrop_claims (wallet_address)`;
    await tx`CREATE OR REPLACE FUNCTION public.claim_airdrop(p_wallet text, p_amount double precision, p_pool double precision)
      RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
      DECLARE existing public.airdrop_claims%ROWTYPE; allocated double precision; claims integer;
      BEGIN
        IF p_amount <= 0 OR p_pool < p_amount OR p_amount = 'NaN'::float8 OR p_pool = 'NaN'::float8 OR
           p_amount = 'Infinity'::float8 OR p_pool = 'Infinity'::float8 OR p_wallet !~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$' THEN
          RAISE EXCEPTION 'Invalid airdrop configuration or wallet';
        END IF;
        PERFORM id FROM public.presale_config WHERE id = 1 FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'Missing presale configuration'; END IF;
        SELECT * INTO existing FROM public.airdrop_claims WHERE wallet_address = p_wallet;
        SELECT COALESCE(sum(amount), 0), count(*) INTO allocated, claims FROM public.airdrop_claims;
        IF existing.id IS NOT NULL THEN
          RETURN jsonb_build_object('walletAddress', p_wallet, 'amount', existing.amount, 'alreadyClaimed', true, 'totalClaims', claims, 'totalAllocated', allocated);
        END IF;
        IF allocated + p_amount > p_pool THEN RAISE EXCEPTION 'Airdrop pool exhausted'; END IF;
        INSERT INTO public.airdrop_claims(wallet_address, amount, status) VALUES (p_wallet, p_amount, 'CLAIMED');
        RETURN jsonb_build_object('walletAddress', p_wallet, 'amount', p_amount, 'alreadyClaimed', false, 'totalClaims', claims + 1, 'totalAllocated', allocated + p_amount);
      END $$`;
    await tx`REVOKE ALL ON FUNCTION public.claim_airdrop(text, double precision, double precision) FROM PUBLIC, anon, authenticated`;
    await tx`GRANT EXECUTE ON FUNCTION public.claim_airdrop(text, double precision, double precision) TO service_role`;
    await tx`REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.airdrop_claims FROM anon, authenticated`;
    await tx`INSERT INTO public.presale_config(id, token_price, total_supply, presale_supply, total_cap, start_time, end_time, site_config)
      VALUES (1, ${referenceTokenPriceUsd}, ${config.token.totalSupply}, ${presaleSupply}, ${presaleCapacityUsd}, ${config.presale.startsAt}, ${config.presale.endsAt}, ${JSON.stringify(config)}::jsonb)
      ON CONFLICT(id) DO UPDATE SET token_price=EXCLUDED.token_price, total_supply=EXCLUDED.total_supply, presale_supply=EXCLUDED.presale_supply, total_cap=EXCLUDED.total_cap, start_time=EXCLUDED.start_time, end_time=EXCLUDED.end_time, site_config=EXCLUDED.site_config`;
  });
  console.log("Config synced and one-claim-per-wallet airdrop installed. Existing records preserved.");
} catch (error) {
  console.error(String(error.message).replaceAll(url, "[database connection]").replace(/postgres(?:ql)?:\/\/\S+/g, "[database connection]"));
  process.exitCode = 1;
} finally { await sql.close(); }
