import { NextResponse } from "next/server";
import { CategoryService } from "../../(services)/category-service";

export async function GET() {
  const categories = await CategoryService.getExpenseCategories();
  return NextResponse.json(categories);
}
