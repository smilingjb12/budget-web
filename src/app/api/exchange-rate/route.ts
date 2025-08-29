import { db } from "@/db";
import { exchangeRates } from "@/db/schema/schema";
import { nextEnv } from "@/nextEnv";
import { addDays, isBefore } from "date-fns";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export type ExchangeRateDto = { rate: number; lastUpdatedAt: string };

interface ExchangeRateResponse {
  result: string;
  conversion_rates: {
    PLN: number;
    [key: string]: number;
  };
}

export async function GET() {
  try {
    // Check if we have a recent exchange rate in the database
    const existingRates = await db.select().from(exchangeRates);
    const latestRate = existingRates[0];

    // If we have a rate and it's less than a day old, return it
    if (
      latestRate &&
      isBefore(new Date(), addDays(latestRate.lastUpdatedAt, 1))
    ) {
      return NextResponse.json<ExchangeRateDto>({
        rate: parseFloat((latestRate.rate as unknown as string) ?? "0"),
        lastUpdatedAt: latestRate.lastUpdatedAt.toISOString(),
      });
    }

    // Otherwise, fetch a new rate from the API
    const apiKey = nextEnv.EXCHANGE_RATE_API_KEY;
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
    );

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.statusText}`);
    }

    const data = (await response.json()) as ExchangeRateResponse;
    const plnRate = data.conversion_rates.PLN;

    // Update or insert the rate in the database
    const now = new Date();
    if (latestRate) {
      await db
        .update(exchangeRates)
        .set({
          rate: plnRate.toString(),
          lastUpdatedAt: now,
        })
        .where(eq(exchangeRates.id, latestRate.id));
    } else {
      await db.insert(exchangeRates).values({
        rate: plnRate.toString(),
        lastUpdatedAt: now,
      });
    }

    return NextResponse.json<ExchangeRateDto>({
      rate: plnRate,
      lastUpdatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange rate" },
      { status: 500 }
    );
  }
}
