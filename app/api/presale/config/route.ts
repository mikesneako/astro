import { NextResponse } from "next/server";
import { getPresaleConfig, getPresaleStats } from "@/lib/db";

export async function GET() {
  try {
    const config = await getPresaleConfig();
    const stats = await getPresaleStats();

    return NextResponse.json({
      success: true,
      config,
      stats,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch presale configuration." },
      { status: 500 }
    );
  }
}
