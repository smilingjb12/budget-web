import { categories, db, records } from "@/db";
import { sql } from "drizzle-orm";

export type CategorySummaryDto = {
  categoryName: string;
  totalExpenses: number;
  icon: string;
};

export type MonthSummaryDto = {
  categorySummaries: CategorySummaryDto[];
};

export type AllTimeSummaryDto = {
  totalExpenses: number;
  totalProfit: number;
};

export type CreateRecordRequest = {
  categoryId: number;
  value: number;
  comment?: string;
};

export const RecordService = {
  async getMonthSummary(month: number): Promise<MonthSummaryDto> {
    const categorySummaries = await db
      .select({
        categoryName: categories.name,
        totalExpenses: sql<number>`SUM(${records.value})`,
        icon: categories.icon,
      })
      .from(records)
      .innerJoin(categories, sql`${records.categoryId} = ${categories.id}`)
      .where(
        sql`EXTRACT(MONTH FROM ${records.date}) = ${month} AND ${records.isExpense} = true`
      )
      .groupBy(categories.name, categories.icon)
      .orderBy(sql`SUM(${records.value}) DESC`);

    return {
      categorySummaries,
    };
  },

  async getAllTimeSummary(): Promise<AllTimeSummaryDto> {
    const [{ totalExpenses = 0 } = {}] = await db
      .select({
        totalExpenses: sql<number>`SUM(${records.value})`,
      })
      .from(records)
      .where(sql`${records.isExpense} = true`);

    const [{ totalProfit = 0 } = {}] = await db
      .select({
        totalProfit: sql<number>`SUM(${records.value})`,
      })
      .from(records)
      .where(sql`${records.isExpense} = false`);

    return {
      totalExpenses,
      totalProfit,
    };
  },

  async createRecord(request: CreateRecordRequest) {
    const InsertType = records.$inferInsert;
    const row: typeof InsertType = {
      categoryId: request.categoryId,
      date: new Date(),
      value: String(request.value),
      comment: request.comment || null,
      isExpense: true,
    };
    return await db.insert(records).values(row);
  },
};
