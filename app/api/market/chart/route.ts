import { createMarketSnapshot } from "@/lib/market-simulation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();
  const snapshot = createMarketSnapshot(now);
  // Never cache a daily snapshot beyond its reset boundary.
  const maxAge = Math.max(0, Math.min(300, Math.floor((Date.parse(snapshot.nextUpdateAt) - now.getTime()) / 1000)));
  return Response.json(snapshot, { headers: { "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge}, must-revalidate` } });
}
