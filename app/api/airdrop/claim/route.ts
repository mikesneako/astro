import { NextRequest, NextResponse } from "next/server";
import {
  claimAirdrop,
  getAirdropClaim,
  getRecentAirdropClaims,
  getAirdropStats,
  resetAirdropWallet,
} from "@/lib/db";
import { AMOUNT_CONFIG } from "@/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function isValidSolanaAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false;
  const trimmed = address.trim();
  if (trimmed.length < 32 || trimmed.length > 44) return false;
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return base58Regex.test(trimmed);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, reset } = body;

    if (!walletAddress || typeof walletAddress !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid Solana wallet address." },
        { status: 400 }
      );
    }

    const trimmedAddress = walletAddress.trim();

    if (reset) {
      await resetAirdropWallet(trimmedAddress);
      return NextResponse.json({
        success: true,
        message: "Wallet airdrop status reset successfully.",
      });
    }

    if (!isValidSolanaAddress(trimmedAddress)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid Solana wallet address format. Please enter a valid base58 address (32-44 characters).",
        },
        { status: 400 }
      );
    }

    const claimAmount = AMOUNT_CONFIG.airdropAmountPerClaim;
    const result = await claimAirdrop(trimmedAddress, claimAmount);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to process airdrop claim." },
        { status: 500 }
      );
    }

    if (result.alreadyClaimed) {
      return NextResponse.json({
        success: true,
        status: "ALREADY_CLAIMED",
        claimed: true,
        message: "This wallet has already claimed the $DEMOBULL airdrop allocation.",
        claim: result.claim,
      });
    }

    return NextResponse.json({
      success: true,
      status: "CLAIMED",
      claimed: true,
      message: `Claimed! ${claimAmount.toLocaleString()} $DEMOBULL has been successfully credited to your wallet in the database.`,
      claim: result.claim,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (wallet) {
      const claim = await getAirdropClaim(wallet.trim());
      return NextResponse.json({
        success: true,
        claimed: !!claim,
        status: claim ? "CLAIMED" : "UNCLAIMED",
        claim: claim || null,
      });
    }

    const stats = await getAirdropStats();
    const recentClaims = await getRecentAirdropClaims(8);

    return NextResponse.json(
      {
        success: true,
        stats,
        recentClaims,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch airdrop data." },
      { status: 500 }
    );
  }
}
