import { NextResponse } from "next/server";
import {
  RegularPaymentDto,
  RegularPaymentService,
} from "../(services)/regular-payment-service";

export type { RegularPaymentDto } from "../(services)/regular-payment-service";

export async function GET() {
  try {
    const payments = await RegularPaymentService.getAllRegularPayments();
    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching regular payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch regular payments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payments = (await request.json()) as RegularPaymentDto[];
    await RegularPaymentService.saveRegularPayments(payments);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving regular payments:", error);
    return NextResponse.json(
      { error: "Failed to save regular payments" },
      { status: 500 }
    );
  }
}
