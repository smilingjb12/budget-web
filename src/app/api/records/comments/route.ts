import { NextResponse } from "next/server";
import { RecordService } from "../../(services)/record-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const comment = searchParams.get("comment");

  if (!comment) {
    return NextResponse.json(
      { error: "Comment parameter is required" },
      { status: 400 }
    );
  }

  const suggestions = await RecordService.searchRecordComments(comment);

  return NextResponse.json(suggestions);
}
