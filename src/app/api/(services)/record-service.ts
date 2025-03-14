import { categories, db, records } from "@/db";
import { sql } from "drizzle-orm";
import { desc, eq, ilike } from "drizzle-orm/expressions";
import { z } from "zod";

export type CategorySummaryDto = {
  categoryName: string;
  total: number;
  icon: string;
  isExpense: boolean;
};

export type MonthSummaryDto = {
  categorySummaries: CategorySummaryDto[];
};

export type AllTimeSummaryDto = {
  totalExpenses: number;
  totalProfit: number;
};

export type RecordDto = {
  id: number;
  categoryId: number;
  value: number;
  comment: string | null;
  dateUtc: string;
  isExpense: boolean;
};

export const createOrUpdateRecordSchema = z.object({
  id: z.number().optional(),
  categoryId: z.number(),
  value: z.number(),
  comment: z.string().optional(),
  dateUtc: z.string(), // ISO string in UTC format
  isExpense: z.boolean().default(true),
});

export type CreateOrUpdateRecordRequest = z.infer<
  typeof createOrUpdateRecordSchema
>;

export const RecordService = {
  async getMonthSummary(year: number, month: number): Promise<MonthSummaryDto> {
    // Get all categories in a single query
    const categorySummaries = await db
      .select({
        categoryName: categories.name,
        total: sql<number>`SUM(${records.value})`,
        icon: categories.icon,
        isExpense: records.isExpense,
      })
      .from(records)
      .innerJoin(categories, sql`${records.categoryId} = ${categories.id}`)
      .where(
        sql`EXTRACT(YEAR FROM ${records.date}) = ${year} AND EXTRACT(MONTH FROM ${records.date}) = ${month}`
      )
      .groupBy(categories.name, categories.icon, records.isExpense)
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

  async getRecordById(id: number): Promise<RecordDto | null> {
    const result = await db
      .select({
        id: records.id,
        categoryId: records.categoryId,
        value: records.value,
        comment: records.comment,
        date: records.date,
        isExpense: records.isExpense,
      })
      .from(records)
      .where(eq(records.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const record = result[0];
    return {
      id: record.id,
      categoryId: record.categoryId,
      value: parseFloat(record.value),
      comment: record.comment,
      dateUtc: record.date.toISOString(),
      isExpense: record.isExpense,
    };
  },

  async getRecordsByMonth(year: number, month: number): Promise<RecordDto[]> {
    const result = await db
      .select({
        id: records.id,
        categoryId: records.categoryId,
        value: records.value,
        comment: records.comment,
        date: records.date,
        isExpense: records.isExpense,
      })
      .from(records)
      .where(
        sql`EXTRACT(YEAR FROM ${records.date}) = ${year} AND EXTRACT(MONTH FROM ${records.date}) = ${month}`
      )
      .orderBy(desc(records.date));

    return result.map((record) => ({
      id: record.id,
      categoryId: record.categoryId,
      value: parseFloat(record.value),
      comment: record.comment,
      dateUtc: record.date.toISOString(),
      isExpense: record.isExpense,
    }));
  },

  async createRecord(request: CreateOrUpdateRecordRequest) {
    const date = new Date(request.dateUtc);
    const row: typeof records.$inferInsert = {
      categoryId: request.categoryId,
      date,
      value: String(request.value),
      comment: request.comment?.trim() || null,
      isExpense: request.isExpense,
    };
    return await db.insert(records).values(row);
  },

  async updateRecord(request: CreateOrUpdateRecordRequest) {
    if (!request.id) {
      throw new Error("Record ID is required for update");
    }

    const row = {
      categoryId: request.categoryId,
      value: String(request.value),
      comment: request.comment?.trim() || null,
    };

    return await db.update(records).set(row).where(eq(records.id, request.id));
  },

  async searchRecordComments(comment: string): Promise<string[]> {
    const result = await db
      .select({
        comment: records.comment,
      })
      .from(records)
      .where(ilike(records.comment, `%${comment}%`))
      .orderBy(records.comment);

    // Filter out null comments and get unique values
    const uniqueComments = [
      ...new Set(
        result
          .map((record) => record.comment)
          .filter((comment): comment is string => comment !== null)
      ),
    ];

    return uniqueComments;
  },
};
