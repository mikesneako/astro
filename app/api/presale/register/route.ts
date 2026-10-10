import { NextRequest, NextResponse } from "next/server";
import { getWallet, registerWallet } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress || typeof walletAddress !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing wallet address." },
        { status: 400 }
      );
    }

    const trimmedAddress = walletAddress.trim();
    if (trimmedAddress.length < 32 || trimmedAddress.length > 44) {
      return NextResponse.json(
        { success: false, error: "Invalid Solana wallet address format." },
        { status: 400 }
      );
    }

    const existing = await getWallet(trimmedAddress);

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "This wallet has already participated in the presale.",
        },
        { status: 409 }
      );
    }

    const result = await registerWallet(trimmedAddress);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "This wallet has already participated in the presale.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Wallet registered successfully for DEMOBULL presale.",
        walletAddress: trimmedAddress,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: err.message || "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
