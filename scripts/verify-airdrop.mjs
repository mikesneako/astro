import { SQL } from "bun";
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { Keypair } from "@solana/web3.js";
import { config } from "../config.ts";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.BROWSER_TEST_MODULE || "playwright");
const sql = new SQL(process.env.DB_POSTGRES_URL ?? process.env.DB_POSTGRES_PRISMA_URL, { max: 1, prepare: false });
const wallets = [Keypair.generate().publicKey.toBase58(), Keypair.generate().publicKey.toBase58()];
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const checks = [];
try {
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  const invalid = await page.request.post("http://localhost:3001/api/airdrop/claim", { data: { walletAddress: "not-a-wallet" } });
  assert.equal(invalid.status(), 400);
  checks.push("Server rejects invalid wallets");
  const input = page.getByLabel("Your Solana wallet address");
  await input.fill(wallets[0]);
  const submitted = page.waitForResponse((response) => response.url().endsWith("/api/airdrop/claim") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Claim my airdrop" }).click();
  const response = await submitted;
  assert.equal(response.status(), 201);
  const result = await response.json();
  assert.equal(result.claim.amount, config.airdrop.rewardTokens);
  assert.equal(result.claim.alreadyClaimed, false);
  await page.getByText("You’re in the herd!", { exact: true }).waitFor();
  assert.equal(await page.locator(".confetti i").count(), 64);
  assert.equal(await page.locator(".confetti i").first().evaluate((element) => getComputedStyle(element).animationName), "confetti-fall");
  const [saved] = await sql`SELECT wallet_address, amount, status FROM public.airdrop_claims WHERE wallet_address = ${wallets[0]}`;
  assert.equal(saved.wallet_address, wallets[0]);
  assert.equal(Number(saved.amount), config.airdrop.rewardTokens);
  assert.equal(saved.status, "CLAIMED");
  checks.push("Claim saves wallet, reward and claim status in PostgreSQL and launches 64 animated confetti particles");
  await page.reload({ waitUntil: "networkidle" });
  await page.getByLabel("Your Solana wallet address").fill(wallets[0]);
  await page.getByRole("button", { name: "Claim my airdrop" }).click();
  await page.getByText("You’re already in the herd!", { exact: true }).waitFor();
  assert.equal(await page.locator(".confetti").count(), 0);
  checks.push("Duplicate wallet remains claimed after reload, with no second allocation or celebration");
  let poolBlocked = false;
  try { await sql`SELECT public.claim_airdrop(${wallets[1]}, ${config.airdrop.rewardTokens}, ${config.airdrop.rewardTokens})`; }
  catch (error) { poolBlocked = error.message.includes("Airdrop pool exhausted"); }
  assert.equal(poolBlocked, true);
  checks.push("Database refuses claims beyond pool capacity");
  const concurrent = await Promise.all([0, 1].map(() => page.request.post("http://localhost:3001/api/airdrop/claim", { data: { walletAddress: wallets[1] } })));
  assert.deepEqual(concurrent.map((response) => response.status()).sort(), [200, 201]);
  const [count] = await sql`SELECT count(*)::integer AS total FROM public.airdrop_claims WHERE wallet_address = ${wallets[1]}`;
  assert.equal(count.total, 1);
  checks.push("Concurrent claims for the same wallet produce exactly one record");
  await page.getByRole("button", { name: "7D", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "7D", exact: true }).getAttribute("aria-pressed"), "true");
  assert.match(await page.locator(".chart-plot svg").getAttribute("aria-label"), /Simulated 7D/);
  await page.getByRole("button", { name: "1H", exact: true }).click();
  assert.match(await page.locator(".chart-plot svg").getAttribute("aria-label"), /Simulated 1H/);
  checks.push("Simulated chart time range controls update data and accessible labels");
  const report = { passed: true, checks, cleanup: "Only the two generated test wallets are removed after this run." };
  await writeFile("artifacts/airdrop-verification.json", `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await sql`DELETE FROM public.airdrop_claims WHERE wallet_address IN (${wallets[0]}, ${wallets[1]})`;
  const [remaining] = await sql`SELECT count(*)::integer AS total FROM public.airdrop_claims`;
  console.log(`Airdrop records after test cleanup: ${remaining.total}`);
  await sql.close();
  await browser.close();
}
