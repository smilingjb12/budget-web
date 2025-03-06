import { categories, db } from "@/db";

export type CategoryDto = {
  id: number;
  name: string;
  icon: string;
};

export const CategoryService = {
  async getCategories(): Promise<CategoryDto[]> {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
      })
      .from(categories)
      .orderBy(categories.order);

    return result;
  },
};
