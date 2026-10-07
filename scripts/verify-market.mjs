import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.BROWSER_TEST_MODULE || "playwright");
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const url = "http://localhost:3001/api/market/chart";
const checks = [];
try {
  const first = await page.request.get(url);
  assert.equal(first.status(), 200);
  const snapshot = await first.json();
  const second = await (await page.request.get(url)).json();
  assert.deepEqual(second, snapshot);
  assert.equal(snapshot.simulated, true);
  assert.equal(snapshot.timeZone, "Africa/Lagos");
  for (const range of snapshot.ranges) assert.equal(range.prices.at(-1), snapshot.lastPriceUsd);
  checks.push("Backend returns identical daily snapshots and a shared closing price for every range");
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.locator("[data-price-line]").waitFor();
  const path = await page.locator("[data-price-line]").getAttribute("d");
  assert.equal(await page.locator(".market-grid").getAttribute("data-snapshot-date"), snapshot.snapshotDate);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("[data-price-line]").getAttribute("d"), path);
  for (const label of ["1H", "7D", "24H"]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    assert.match(await page.locator(".chart-plot svg").getAttribute("aria-label"), new RegExp(`Simulated ${label}`));
  }
  checks.push("Rendered chart persists across reloads and uses the backend time ranges");

  // Exercise network-failure recovery without altering any server data.
  await page.route("**/api/market/chart", (route) => route.fulfill({ status: 503, json: { error: "Test outage" } }));
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Retry chart", exact: true }).waitFor();
  assert.equal(await page.locator("[data-price-line]").count(), 0);
  await page.unroute("**/api/market/chart");
  await page.getByRole("button", { name: "Retry chart", exact: true }).click();
  await page.locator("[data-price-line]").waitFor();
  checks.push("Backend failures show retry UI, with no client-generated replacement data");

  const tomorrow = new Date(Date.parse(snapshot.asOf) + 86400000);
  const tomorrowDate = new Date(Date.parse(`${snapshot.snapshotDate}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
  const next = { ...snapshot, asOf: tomorrow.toISOString(), snapshotDate: tomorrowDate, nextUpdateAt: new Date(Date.now() + 86400000).toISOString() };
  let calls = 0;
  await page.route("**/api/market/chart", (route) => {
    calls++;
    return route.fulfill({ json: calls === 1 ? { ...snapshot, nextUpdateAt: new Date(Date.now() + 1500).toISOString() } : next });
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForFunction((date) => document.querySelector(".market-grid")?.getAttribute("data-snapshot-date") === date, tomorrowDate);
  assert.ok(calls >= 2);
  checks.push("An open tab fetches the next daily snapshot at the backend-provided expiry");
  await page.unroute("**/api/market/chart");
  await page.reload({ waitUntil: "networkidle" });
  const report = { passed: true, checks };
  await writeFile("artifacts/market-verification.json", `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
