import { NextRequest, NextResponse } from "next/server";
import {
  CreateOrUpdateRecordRequest,
  RecordService,
} from "../../(services)/record-service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const recordId = parseInt(id);

  if (isNaN(recordId)) {
    return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
  }

  const record = await RecordService.getRecordById(recordId);

  if (!record) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const recordId = parseInt(id);

  if (isNaN(recordId)) {
    return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
  }

  const body = await request.json();

  // Validate the request body
  if (!body.categoryId || body.value === undefined || !body.dateUtc) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: categoryId, value, and dateUtc are required",
      },
      { status: 400 }
    );
  }

  const recordData: CreateOrUpdateRecordRequest = {
    id: recordId,
    categoryId: body.categoryId,
    value: body.value,
    comment: body.comment,
    dateUtc: body.dateUtc,
  };

  try {
    const result = await RecordService.updateRecord(recordData);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json(
      { error: "Failed to update record", details: (error as Error).message },
      { status: 500 }
    );
  }
}
