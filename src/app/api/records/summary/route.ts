import { NextResponse } from "next/server";
import { RecordService } from "../../(services)/record-service";

export async function GET() {
  const summary = await RecordService.getAllTimeSummary();
  return NextResponse.json(summary);
}
