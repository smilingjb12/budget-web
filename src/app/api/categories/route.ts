import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "../(services)/category-service";

export async function GET(request: NextRequest) {
  const categories = await CategoryService.getCategories();
  return NextResponse.json(categories);
}
