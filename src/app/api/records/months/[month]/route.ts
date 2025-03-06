import { NextRequest, NextResponse } from "next/server";
import { RecordService } from "../../../(services)/record-service";

export async function GET(
  request: NextRequest,
  { params }: { params: { month: string } }
) {
  const { month } = await params;
  const monthNum = parseInt(month);

  if (isNaN(monthNum)) {
    return NextResponse.json(
      { error: "Invalid year parameter" },
      { status: 400 }
    );
  }

  var dtos = await RecordService.getMonthSummary(monthNum);
  return NextResponse.json(dtos);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { month: string } }
) {
  const body = await request.json();

  // Validate the request body
  if (!body.categoryId || body.value === undefined) {
    return NextResponse.json(
      { error: "Missing required fields: categoryId and value are required" },
      { status: 400 }
    );
  }

  // Create the record using the RecordService
  const result = await RecordService.createRecord({
    categoryId: body.categoryId,
    value: body.value,
    comment: body.comment,
  });

  return NextResponse.json({ success: true, data: result }, { status: 201 });
}
