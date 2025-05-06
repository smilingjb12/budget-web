"use client";

import { CategoryDto } from "@/app/api/(services)/category-service";
import { MonthSummaryDto } from "@/app/api/(services)/record-service";
import LoadingIndicator from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonthNavigation } from "@/lib/hooks/use-previous-month";
import { useMonthSummaryQuery } from "@/lib/queries";
import { QueryKeys } from "@/lib/query-keys";
import { ApiRoutes, Month, Routes } from "@/lib/routes";
import { formatUSD } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryProgressSection } from "./category-progress-section";
import { CategoryRecords } from "./category-records";
import { ViewType } from "./monthly-header";

export function MonthlySummaryCard({ viewType }: { viewType: ViewType }) {
  const params = useParams<{ month: string; year: string }>();
  const month = Number(params.month) as Month;
  const year = Number(params.year);
  const router = useRouter();

  const { prevMonth, prevYear, nextMonth, nextYear } = useMonthNavigation(
    month,
    year
  );

  // Check if next month is in the future
  const currentDate = new Date();
  const nextMonthDate = new Date(nextYear, nextMonth - 1);
  const currentMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const isNextMonthInFuture = nextMonthDate > currentMonthDate;

  const date = new Date(year, month - 1); // Adjust for 0-indexed months in JS
  const monthName = format(date, "MMMM");
  const yearString = format(date, "yyyy");

  // Fetch data for both expenses and income
  const { data, error, isLoading } = useMonthSummaryQuery(year, month);

  // Fetch previous month data
  const { data: prevMonthData } = useQuery<MonthSummaryDto>({
    queryKey: QueryKeys.monthSummary(prevYear, prevMonth),
    queryFn: async () => {
      const response = await fetch(
        ApiRoutes.monthlyExpensesSummary(prevYear, prevMonth)
      );
      return response.json() as Promise<MonthSummaryDto>;
    },
  });

  // Fetch category data
  const { data: categories } = useQuery<CategoryDto[]>({
    queryKey: QueryKeys.categories(),
    queryFn: async () => {
      const response = await fetch(ApiRoutes.categories());
      return response.json() as Promise<CategoryDto[]>;
    },
  });

  const handlePreviousMonth = () => {
    router.push(Routes.monthlyExpensesSummary(prevYear, prevMonth));
  };

  const handleNextMonth = () => {
    router.push(Routes.monthlyExpensesSummary(nextYear, nextMonth));
  };

  if (error) {
    return (
      <div className="p-4 text-destructive">
        Error loading data: {error.message}
      </div>
    );
  }

  // Filter categories based on the selected view type
  const filteredCategories =
    data?.categorySummaries?.filter(
      (category) =>
        (viewType === "expenses" && category.isExpense) ||
        (viewType === "income" && !category.isExpense)
    ) || [];

  // Create a map of previous month expenses by category name
  const prevMonthExpensesByCategory = new Map<string, number>();
  prevMonthData?.categorySummaries?.forEach((category) => {
    if (
      (viewType === "expenses" && category.isExpense) ||
      (viewType === "income" && !category.isExpense)
    ) {
      prevMonthExpensesByCategory.set(
        category.categoryName,
        Number(category.total)
      );
    }
  });

  // Enhance current month data with previous month comparison
  const enhancedCategories = filteredCategories.map((category) => {
    const previousMonthExpenses =
      prevMonthExpensesByCategory.get(category.categoryName) || 0;
    const difference = Number(category.total) - previousMonthExpenses;

    return {
      ...category,
      previousMonthExpenses,
      difference,
      totalValue: Number(category.total),
    };
  });

  // Calculate total spending or income for all categories
  const totalMonthlyAmount =
    enhancedCategories.reduce(
      (sum, category) => sum + Number(category.total),
      0
    ) || 0;

  // Calculate total for previous month
  const totalPreviousMonthAmount =
    prevMonthData?.categorySummaries
      ?.filter(
        (category) =>
          (viewType === "expenses" && category.isExpense) ||
          (viewType === "income" && !category.isExpense)
      )
      .reduce((sum, category) => sum + Number(category.total), 0) || 0;

  // Calculate the difference between current and previous month totals
  const totalMonthDifference = totalMonthlyAmount - totalPreviousMonthAmount;

  // Sort categories by value for better visualization
  const sortedCategories = [...enhancedCategories].sort(
    (a, b) => b.total - a.total
  );

  // Ensure we have valid data for the progress bar
  const hasValidData = totalMonthlyAmount > 0 && sortedCategories.length > 0;

  // Helper function to format the difference
  const formatDifference = (
    difference: number | undefined,
    previousMonthExpenses: number | undefined
  ) => {
    // Only show difference if there were expenses in the previous month
    if (
      difference === undefined ||
      previousMonthExpenses === undefined ||
      previousMonthExpenses === 0
    ) {
      return null;
    }

    const isMore = difference > 0;
    const absValue = Math.abs(difference);

    return {
      text: `$${absValue.toFixed(2)}`,
      icon: isMore ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ArrowDown className="h-4 w-4" />
      ),
      color: isMore ? "text-red-400" : "text-green-400",
    };
  };

  const monthDiff = formatDifference(
    totalMonthDifference,
    totalPreviousMonthAmount
  );

  if (filteredCategories.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="py-8">
              <LoadingIndicator className="h-24" />
              <p className="text-center text-muted-foreground mt-4">
                Loading {viewType} data for {monthName} {yearString}...
              </p>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No {viewType} data available for {monthName} {yearString}.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <CardTitle className="flex items-center justify-center flex-col">
          {formatUSD(totalMonthlyAmount)}
          {monthDiff ? (
            <span
              className={`ml-2 text-sm items-center inline-flex ${monthDiff.color}`}
            >
              {monthDiff.text}
              {monthDiff.icon}
            </span>
          ) : (
            <span className="ml-2 text-sm items-center inline-flex invisible">
              $0.00
              <ArrowDown className="h-4 w-4" />
            </span>
          )}
        </CardTitle>
        {!isNextMonthInFuture ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="w-9 h-9"></div> // Empty div to maintain layout
        )}
      </CardHeader>
      <CardContent className="p-3">
        {hasValidData && (
          <CategoryProgressSection
            sortedCategories={sortedCategories}
            totalMonthlyAmount={totalMonthlyAmount}
          />
        )}

        <div className="space-y-2 mt-4">
          {sortedCategories.map((category) => {
            const diff = formatDifference(
              category.difference,
              category.previousMonthExpenses
            );

            const categoryData = categories?.find(
              (c) => c.name === category.categoryName
            );

            return (
              <CategoryRecords
                key={category.categoryName}
                categoryName={category.categoryName}
                categoryId={categoryData?.id || 0}
                year={year}
                month={month}
                totalExpenses={Number(category.total)}
                icon={category.icon}
                difference={diff || undefined}
                isExpense={category.isExpense}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
