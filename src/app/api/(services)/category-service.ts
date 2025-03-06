import { categories, db } from "@/db";
import { eq } from "drizzle-orm";

export type CategoryDto = {
  id: number;
  name: string;
  icon: string;
  isExpense: boolean;
};

export const CategoryService = {
  async getCategories(): Promise<CategoryDto[]> {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        isExpense: categories.isExpense,
      })
      .from(categories)
      .orderBy(categories.order);

    return result;
  },

  async getExpenseCategories(): Promise<CategoryDto[]> {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        isExpense: categories.isExpense,
      })
      .from(categories)
      .where(eq(categories.isExpense, true))
      .orderBy(categories.order);

    return result;
  },

  async getIncomeCategories(): Promise<CategoryDto[]> {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        isExpense: categories.isExpense,
      })
      .from(categories)
      .where(eq(categories.isExpense, false))
      .orderBy(categories.order);

    return result;
  },
};
