import { ChartsService } from "@/app/api/(services)/charts-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ categoryId: string }> }
) {
  try {
    const categoryId = parseInt((await context.params).categoryId, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const monthlyTotals = await ChartsService.getMonthlyTotalsByCategory(
      categoryId
    );

    return NextResponse.json(monthlyTotals);
  } catch (error) {
    console.error("Error fetching monthly totals by category:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly totals" },
      { status: 500 }
    );
  }
}
