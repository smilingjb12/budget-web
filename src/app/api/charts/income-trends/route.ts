import { ChartsService } from "@/app/api/(services)/charts-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const monthlyIncomeByCategories =
      await ChartsService.getMonthlyIncomeByCategories();
    return NextResponse.json(monthlyIncomeByCategories);
  } catch (error) {
    console.error("Error fetching monthly income by categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly income data" },
      { status: 500 }
    );
  }
}
