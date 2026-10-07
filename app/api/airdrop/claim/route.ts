import { PublicKey } from "@solana/web3.js";
import { config } from "@/config";
import { claimDemoAirdrop, getAirdropStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try { return Response.json({ success: true, stats: await getAirdropStats() }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ success: false, error: "Airdrop totals are temporarily unavailable." }, { status: 503 }); }
}

export async function POST(request: Request) {
  if (!config.airdrop.enabled || !config.airdrop.demoMode) return Response.json({ success: false, error: "Demo claims are currently closed." }, { status: 403 });
  let walletAddress: string;
  try {
    const body = await request.json();
    if (typeof body.walletAddress !== "string" || body.walletAddress.length > 100) throw new Error("Invalid wallet");
    walletAddress = body.walletAddress.trim();
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress) || new PublicKey(walletAddress).toBase58() !== walletAddress) throw new Error("Invalid wallet");
  } catch { return Response.json({ success: false, error: "Enter a valid Solana wallet address." }, { status: 400 }); }
  try {
    const claim = await claimDemoAirdrop(walletAddress);
    if ("exhausted" in claim) return Response.json({ success: false, error: "The airdrop pool is fully claimed." }, { status: 409 });
    return Response.json({ success: true, claim }, { status: claim.alreadyClaimed ? 200 : 201 });
  } catch { return Response.json({ success: false, error: "Couldn’t save your claim. Please try again." }, { status: 503 }); }
}
