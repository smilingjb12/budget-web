import { db, records } from "@/db";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    // Delete all records from the database
    await db.delete(records);

    return NextResponse.json(
      {
        success: true,
        message: "All records have been cleared successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error clearing records:", error);
    return NextResponse.json(
      { error: "Failed to clear records", details: (error as Error).message },
      { status: 500 }
    );
  }
}
