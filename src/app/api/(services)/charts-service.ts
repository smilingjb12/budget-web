import { db, records } from "@/db";
import { sql } from "drizzle-orm";
import { z } from "zod";

export type MonthlyTotalsDto = {
  monthDate: string; // Format: YYYY-MM
  total: number;
};

export const getExpensesByCategorySchema = z.object({
  categoryId: z.number(),
});

export type GetExpensesByCategoryRequest = z.infer<
  typeof getExpensesByCategorySchema
>;

export const ChartsService = {
  async getMonthlyTotalsByCategory(
    categoryId: number
  ): Promise<MonthlyTotalsDto[]> {
    const result = await db
      .select({
        year: sql<number>`EXTRACT(YEAR FROM ${records.date})`,
        month: sql<number>`EXTRACT(MONTH FROM ${records.date})`,
        total: sql<number>`SUM(${records.value})`,
      })
      .from(records)
      .where(sql`${records.categoryId} = ${categoryId}`)
      .groupBy(
        sql`EXTRACT(YEAR FROM ${records.date})`,
        sql`EXTRACT(MONTH FROM ${records.date})`
      )
      .orderBy(
        sql`EXTRACT(YEAR FROM ${records.date})`,
        sql`EXTRACT(MONTH FROM ${records.date})`
      );

    return result.map((item) => ({
      monthDate: `${item.year}-${item.month.toString().padStart(2, "0")}`,
      total: parseFloat(String(item.total)),
    }));
  },
};
