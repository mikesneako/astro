// Run with Bun (loads .env automatically). Only --apply changes data.
import { SQL } from "bun";
import { writeFile } from "node:fs/promises";
import { config, presaleSupply, referenceTokenPriceUsd, presaleCapacityUsd } from "../config.ts";

const url = process.env.DB_POSTGRES_URL ?? process.env.DB_POSTGRES_PRISMA_URL;
if (!url) throw new Error("Missing database connection in .env");
// Transaction poolers cannot reuse named prepared statements across sessions.
const sql = new SQL(url, { max: 1, connectionTimeout: 15, prepare: false });
const apply = process.argv.includes("--apply");

async function counts(connection) {
  const [result] = await connection`SELECT
    (SELECT count(*)::integer FROM public.presale_wallets) AS wallets,
    (SELECT count(*)::integer FROM public.presale_transactions) AS transactions,
    (SELECT count(*)::integer FROM public.airdrop_claims) AS airdrop_claims,
    (SELECT count(*)::integer FROM public.presale_config) AS config_rows`;
  return result;
}

try {
  const before = await counts(sql);
  if (!apply) {
    console.log(JSON.stringify({ mode: "preview", tables: before, replacement: { name: config.brand.name, ticker: config.brand.ticker, tokenPrice: referenceTokenPriceUsd, presaleSupply, goal: presaleCapacityUsd }, instruction: "Run bun run db:reset --apply to clear these four project tables and save the new config." }, null, 2));
  } else {
    const after = await sql.begin(async (tx) => {
      // Explicit scope; no CASCADE, no auth users, storage buckets or other tables.
      await tx`TRUNCATE TABLE public.presale_transactions, public.airdrop_claims, public.presale_wallets, public.presale_config RESTART IDENTITY`;
      await tx`ALTER TABLE public.presale_config ADD COLUMN IF NOT EXISTS site_config jsonb NOT NULL DEFAULT '{}'::jsonb`;
      const snapshot = JSON.stringify(config);
      await tx`INSERT INTO public.presale_config
        (id, token_price, total_supply, presale_supply, total_cap, start_time, end_time, site_config)
        VALUES (1, ${referenceTokenPriceUsd}, ${config.token.totalSupply}, ${presaleSupply},
          ${presaleCapacityUsd}, ${config.presale.startsAt}, ${config.presale.endsAt}, ${snapshot}::jsonb)`;
      const result = await counts(tx);
      if (result.wallets || result.transactions || result.airdrop_claims || result.config_rows !== 1) throw new Error("Reset verification failed");
      const [saved] = await tx`SELECT token_price, total_supply, presale_supply, total_cap, site_config FROM public.presale_config WHERE id = 1`;
      if (Number(saved.token_price) !== referenceTokenPriceUsd || Number(saved.total_supply) !== config.token.totalSupply ||
          Number(saved.presale_supply) !== presaleSupply || Number(saved.total_cap) !== presaleCapacityUsd || saved.site_config.brand.ticker !== config.brand.ticker) throw new Error("Config verification failed");
      return result;
    });
    const report = { resetAt: new Date().toISOString(), scope: "Demo project presale and airdrop tables only", before, after, config: { name: config.brand.name, ticker: config.brand.ticker, tokenPriceUsd: referenceTokenPriceUsd, presaleSupply, goalUsd: presaleCapacityUsd }, verified: true };
    await writeFile(new URL("./db-reset-result.json", import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
  }
} catch (error) {
  // Avoid leaking a connection string or credentials in command output.
  const safeMessage = String(error.message).replaceAll(url, "[database connection]").replace(/postgres(?:ql)?:\/\/\S+/g, "[database connection]");
  console.error(`Database operation failed (${error.code ?? "connection or validation error"}): ${safeMessage}. An unfinished transaction is rolled back.`);
  process.exitCode = 1;
} finally { await sql.close(); }
