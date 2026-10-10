import { NextRequest, NextResponse } from "next/server";
import { resetPresaleWallet } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: "Missing wallet address." },
        { status: 400 }
      );
    }

    const trimmed = walletAddress.trim();
    await resetPresaleWallet(trimmed);

    return NextResponse.json({
      success: true,
      message: `State reset for wallet ${trimmed}`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Failed to reset wallet state." },
      { status: 500 }
    );
  }
}
