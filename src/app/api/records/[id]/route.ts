import { NextRequest, NextResponse } from "next/server";
import {
  CreateOrUpdateRecordRequest,
  RecordService,
  createOrUpdateRecordSchema,
} from "../../(services)/record-service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
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
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;
  const recordId = parseInt(id);

  if (isNaN(recordId)) {
    return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
  }

  const validationResult = createOrUpdateRecordSchema.safeParse({
    ...(await request.json()),
    id: recordId,
  });

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: "Invalid request data",
        details: validationResult.error.format(),
      },
      { status: 400 }
    );
  }

  const recordData: CreateOrUpdateRecordRequest = validationResult.data;

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

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;
  const recordId = parseInt(id);

  if (isNaN(recordId)) {
    return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
  }

  try {
    await RecordService.deleteRecord(recordId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json(
      { error: "Failed to delete record", details: (error as Error).message },
      { status: 500 }
    );
  }
}
