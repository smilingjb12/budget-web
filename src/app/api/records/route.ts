import { NextRequest, NextResponse } from "next/server";
import {
  CreateOrUpdateRecordRequest,
  RecordService,
} from "../(services)/record-service";

export async function POST(request: NextRequest) {
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
    categoryId: body.categoryId,
    value: body.value,
    comment: body.comment,
    dateUtc: body.dateUtc,
  };

  try {
    const result = await RecordService.createRecord(recordData);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json(
      { error: "Failed to create record", details: (error as Error).message },
      { status: 500 }
    );
  }
}
