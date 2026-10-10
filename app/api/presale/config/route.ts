import { getPresaleConfig, getPresaleStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json({ success: true, config: getPresaleConfig(), stats: await getPresaleStats() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ success: false, error: "Presale totals are temporarily unavailable.", config: getPresaleConfig() }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
