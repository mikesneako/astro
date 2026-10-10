import { NextRequest, NextResponse } from "next/server";
import { getWallet, getTransactionsByWallet } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: "Missing wallet address parameter." },
        { status: 400 }
      );
    }

    const trimmedAddress = wallet.trim();
    const existing = await getWallet(trimmedAddress);
    const transactions = existing ? await getTransactionsByWallet(trimmedAddress) : [];

    return NextResponse.json(
      {
        success: true,
        walletAddress: trimmedAddress,
        isRegistered: !!existing,
        hasParticipated: !!existing,
        registeredAt: existing ? existing.created_at : null,
        transactions,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to check wallet status.",
      },
      { status: 500 }
    );
  }
}
