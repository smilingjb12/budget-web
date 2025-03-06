import { NextResponse } from "next/server";
import { CategoryService } from "../../(services)/category-service";

export async function GET() {
  const categories = await CategoryService.getIncomeCategories();
  return NextResponse.json(categories);
}
