import { NextRequest, NextResponse } from "next/server";
import { RecordService } from "../../../../../(services)/record-service";

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

  try {
    const records = await RecordService.getRecordsByMonth(yearNum, monthNum);
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records", details: (error as Error).message },
      { status: 500 }
    );
  }
}
