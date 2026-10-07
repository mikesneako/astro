# Demo Bull

A compact AMOLED neubrutalist meme presale built with Next.js. Includes the floating bull, manual-transfer presale calculator, database-backed demo airdrops with confetti, simulated price charts, tokenomics, roadmap, FAQ, and community links. Buyers enter a SOL amount, copy the presale address, and send the transfer from their own wallet.

## Run

```sh
bun install
bun run dev
```

## Customize

Edit `config.ts` for the name, ticker (without `$`), astronaut, colors, metadata, SOL reference price, presale tiers and limits, sale dates, supply allocation, airdrop reward and pool, chart simulation settings, roadmap, presale wallet, explorer network, social links, navigation, and page copy. Rebuild after changing configuration. Blank optional links are hidden.

Presale allocations come from `presale.tiers`: 0.2 SOL = 15M, 1 SOL = 100M, 5 SOL = 650M, 10 SOL = 2B tokens. Custom amounts interpolate linearly between adjacent tiers, using integer lamports and token units. The displayed USD token estimate uses the chosen amount and SOL reference price. The chart never changes presale pricing. The old database scalar price is a reference for the default tier; `site_config.presale.tiers` holds the authoritative pricing schedule. Presale progress, raised amounts, and goals are not displayed. `presale.enabled` and the start/end dates control availability of the purchase-card copy action.

The full `network.presaleWalletAddress` is visible in the card. The copy button copies only that address, with a manual-selection fallback if clipboard access is unavailable. The transfer instructions and explorer use `network.cluster`, currently `devnet` for test SOL. There is no simulated checkout or browser receipt. Copying an address does not record a purchase or confirm a deposit; buyers check transfers in their own wallet or the explorer. Automatic deposit verification and token delivery are not implemented.

## Database

Server access requires `DB_SUPABASE_URL` and `DB_SUPABASE_SERVICE_ROLE_KEY` in `.env`. Database credentials remain server-side. Without them, the page and manual-transfer flow still work and totals show as unavailable. Runtime pricing always comes from `config.ts`; the old database config cannot override it.

The reset script also needs `DB_POSTGRES_URL` (or `DB_POSTGRES_PRISMA_URL`). It targets only `presale_transactions`, `presale_wallets`, `airdrop_claims`, and `presale_config`. It uses one transaction, restarts IDs, adds a JSON config snapshot column, and seeds a single configuration row from `config.ts`. Other tables, auth users, and storage are untouched. Old presale write/reset endpoints were removed.

```sh
bun run db:reset          # Preview only
bun run db:reset --apply  # Destructive reset of the four demo tables
bun run db:sync           # Sync config and install the demo airdrop function without clearing data
```

Successful resets create `scripts/db-reset-result.json` with before/after counts and verification. Never place credentials in `config.ts`.

The airdrop POST validates Solana public keys and saves the wallet, configured amount, and `DEMO_CLAIMED` status. An atomic database function and unique wallet index prevent duplicate claims and pool over-allocation, including concurrent requests. Only the server service role can execute that function. First claims show confetti, respecting reduced-motion preferences. Repeat claims return the original reward. These are saved demo allocations, not on-chain token transfers.

The chart loads from `GET /api/market/chart`, with 1H/24H/7D controls and pointer inspection. A deterministic Node backend generates one snapshot per calendar day in `market.snapshotTimeZone` (Africa/Lagos by default). Prices, volume, and market cap are identical for all visitors throughout that day, including after reloads or server restarts. All ranges share a closing price and overlapping historical timestamps agree. The response includes its next update time; the client refreshes at midnight and when a stale tab regains focus. Cache lifetime never crosses midnight. Generation is stateless and needs no scheduled job or market database table. Configuration/seed changes intentionally change the simulated series. The UI shows an error/retry state when the backend is unavailable instead of inventing browser data. No live market activity is implied.

## Check

```sh
bun run lint
bun run typecheck
bun run test
bun run build
```
