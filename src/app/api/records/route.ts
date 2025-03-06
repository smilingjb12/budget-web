import { NextRequest, NextResponse } from "next/server";
import {
  CreateOrUpdateRecordRequest,
  RecordService,
  createOrUpdateRecordSchema,
} from "../(services)/record-service";

export async function POST(request: NextRequest) {
  const result = createOrUpdateRecordSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid request data",
        details: result.error.format(),
      },
      { status: 400 }
    );
  }

  const recordData: CreateOrUpdateRecordRequest = result.data;

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
