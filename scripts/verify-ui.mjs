import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.BROWSER_TEST_MODULE || "playwright");
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const checks = [];
await mkdir("artifacts", { recursive: true });
try {
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Copy presale wallet", exact: true }).waitFor();
  await page.screenshot({ path: "artifacts/desktop.png", fullPage: true });
  const result = await page.request.get("http://localhost:3001/api/presale/config");
  const data = await result.json();
  assert.equal(result.status(), 200);
  assert.equal(data.config.payment_method, "manual-transfer");
  assert.equal(await page.getByLabel("Presale wallet", { exact: true }).inputValue(), data.config.presale_wallet_address);
  checks.push("API and visible presale address use the same config");

  for (const width of [320, 390, 600, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Horizontal overflow at ${width}px`);
    const amount = page.getByLabel("You send", { exact: true });
    await amount.fill("0.5");
    assert.equal(await page.locator("output").textContent(), "87,500,000");
    if (width === 390) {
      await page.locator("#sol-amount").blur();
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: "artifacts/mobile.png", fullPage: true });
      await page.screenshot({ path: "artifacts/mobile-top.png" });
    }
    checks.push(`Responsive quote and layout at ${width}px`);
  }

  const buy = page.locator(".presale-card .purchase-button");
  const amount = page.getByLabel("You send", { exact: true });
  await amount.fill("0.1");
  assert.equal(await buy.isDisabled(), true);
  assert.match(await page.locator("#amount-error").textContent(), /Minimum/);
  await amount.fill("11");
  assert.equal(await buy.isDisabled(), true);
  assert.match(await page.locator("#amount-error").textContent(), /Maximum/);
  await amount.fill("");
  assert.equal(await buy.isDisabled(), true);
  checks.push("Invalid, empty and out-of-range amounts disable copying");

  for (const [label, expected] of [["0.2 SOL for 20M tokens", "20,000,000"], ["1 SOL for 200M tokens", "200,000,000"], ["2 SOL for 500M tokens", "500,000,000"], ["5 SOL for 1.5B tokens", "1,500,000,000"], ["10 SOL for 3B tokens", "3,000,000,000"]]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    assert.equal(await page.locator("output").textContent(), expected);
  }
  assert.equal(await page.getByRole("progressbar").count(), 0);
  assert.equal(await page.getByText("Presale progress", { exact: true }).count(), 0);
  checks.push("All five pricing tiers are exact and presale progress is removed");
  await page.getByRole("button", { name: "1 SOL for 200M tokens", exact: true }).click();
  const storageBefore = await page.evaluate(() => JSON.stringify(localStorage));
  await buy.click();
  await page.getByRole("button", { name: "Address copied!", exact: true }).waitFor();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), data.config.presale_wallet_address);
  assert.match(await page.locator("#transfer-instructions").textContent(), /Send 1 SOL/);
  assert.equal(await page.locator("dialog").count(), 0);
  assert.equal(await page.locator(".receipt").count(), 0);
  assert.equal(await page.evaluate(() => JSON.stringify(localStorage)), storageBefore);
  checks.push("Copies the exact configured address without checkout, fake receipt or storage writes");
  await page.getByRole("button", { name: "Copy hero presale wallet", exact: true }).click();
  await page.getByRole("button", { name: "Hero wallet copied", exact: true }).waitFor();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), data.config.presale_wallet_address);
  checks.push("Hero wallet copies the same configured address");

  await amount.fill("0.5");
  assert.match(await page.locator("#transfer-instructions").textContent(), /Send 0.5 SOL/);
  assert.equal(await buy.textContent(), "Copy presale wallet");
  await page.evaluate(() => Object.defineProperty(navigator.clipboard, "writeText", { configurable: true, value: () => Promise.reject(new DOMException("Denied", "NotAllowedError")) }));
  await buy.click();
  await page.getByText("Automatic copy is unavailable.", { exact: false }).waitFor();
  const selection = await page.locator("#presale-address").evaluate((element) => ({ start: element.selectionStart, end: element.selectionEnd, value: element.value }));
  assert.equal(selection.value.slice(selection.start, selection.end), data.config.presale_wallet_address);
  assert.equal(await buy.textContent(), "Copy presale wallet");
  checks.push("Amount changes reset copy feedback; denied clipboard selects the full address for manual copying");
  await page.reload({ waitUntil: "networkidle" });
  const afterCopy = await (await page.request.get("http://localhost:3001/api/presale/config")).json();
  assert.deepEqual(afterCopy.stats, data.stats);
  checks.push("Copying leaves presale database totals unchanged");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("navigation").getByRole("link", { name: "How to buy" }).click();
  assert.equal(await page.getByRole("button", { name: "Open navigation" }).getAttribute("aria-expanded"), "false");
  await page.getByText("How do I buy presale tokens?", { exact: true }).click();
  assert.equal(await page.getByText("Enter a SOL amount to see the token estimate.", { exact: false }).isVisible(), true);
  assert.equal(await page.getByLabel("Presale wallet", { exact: true }).isVisible(), true);
  const explorer = new URL(await page.locator(".wallet-explorer").getAttribute("href"));
  assert.equal(explorer.searchParams.get("cluster"), data.config.network_cluster);
  assert.ok(explorer.pathname.endsWith(data.config.presale_wallet_address));
  checks.push("Mobile menu, manual-transfer FAQ and configured explorer link work");
  assert.deepEqual(errors, []);
  checks.push("No browser runtime errors");
  console.log(JSON.stringify({ passed: true, checks }, null, 2));
  await writeFile("artifacts/ui-verification.json", `${JSON.stringify({ passed: true, checks }, null, 2)}\n`);
} finally { await browser.close(); }
