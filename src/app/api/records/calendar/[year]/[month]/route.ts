import { NextRequest, NextResponse } from "next/server";
import { RecordService } from "../../../../(services)/record-service";

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string; month: string } }
) {
  const { year, month } = await params;
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

  var dtos = await RecordService.getMonthSummary(yearNum, monthNum);
  return NextResponse.json(dtos);
}
