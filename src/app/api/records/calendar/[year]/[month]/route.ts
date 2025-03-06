import { NextRequest, NextResponse } from "next/server";
import { RecordService } from "../../../../(services)/record-service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ year: string; month: string }> }
) {
  const params = await context.params;
  const { year, month } = params;
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);

  if (isNaN(yearNum)) {
    return NextResponse.json(
      { error: "Invalid year parameter" },
      { status: 400 }
    );
  }

  if (isNaN(monthNum)) {
    return NextResponse.json(
      { error: "Invalid month parameter" },
      { status: 400 }
    );
  }

  const dtos = await RecordService.getMonthSummary(yearNum, monthNum);
  return NextResponse.json(dtos);
}
