import { NextRequest, NextResponse } from "next/server";
import { getWallet, registerWallet, saveTransaction } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, transactionSignature, solAmount, tokenAmount } = body;

    if (!walletAddress || !transactionSignature || !solAmount || !tokenAmount) {
      return NextResponse.json(
        { success: false, error: "Missing required transaction parameters." },
        { status: 400 }
      );
    }

    const trimmedAddress = walletAddress.trim();
    const existing = await getWallet(trimmedAddress);

    if (!existing) {
      await registerWallet(trimmedAddress);
    }

    const result = await saveTransaction({
      wallet_address: trimmedAddress,
      transaction_signature: transactionSignature,
      sol_amount: Number(solAmount),
      token_amount: Number(tokenAmount),
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to record transaction." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Presale transaction recorded successfully.",
        transactionId: result.id,
        signature: transactionSignature,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process transaction." },
      { status: 500 }
    );
  }
}
