import { ChartsService } from "@/app/api/(services)/charts-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const monthlyExpensesVsIncome =
      await ChartsService.getMonthlyExpensesVsIncome();

    return NextResponse.json(monthlyExpensesVsIncome);
  } catch (error) {
    console.error("Error fetching monthly expenses vs income:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly expenses vs income data" },
      { status: 500 }
    );
  }
}
