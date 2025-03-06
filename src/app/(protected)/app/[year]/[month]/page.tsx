"use client";

import { CategoryDto } from "@/app/api/(services)/category-service";
import {
  AllTimeSummaryDto,
  MonthSummaryDto,
} from "@/app/api/(services)/record-service";
import { MonthYearPicker } from "@/components/month-year-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SegmentedProgress } from "@/components/ui/segmented-progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTriggerNoChevron,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryIcon } from "@/lib/hooks/use-category-icon";
import { useMonthNavigation } from "@/lib/hooks/use-previous-month";
import { QueryKeys } from "@/lib/query-keys";
import { ApiRoutes, Month, Routes } from "@/lib/routes";
import { formatUSD } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AddRecordDialog } from "./add-record-dialog";
import { CategoryRecords } from "./category-records";

// Define view type for toggling between expenses and income
type ViewType = "expenses" | "income";

export default function MonthYearPage() {
  const [viewType, setViewType] = useState<ViewType>("expenses");
  const params = useParams<{ month: string; year: string }>();
  const month = Number(params.month) as Month;
  const year = Number(params.year);
  const { getCategoryIcon } = useCategoryIcon();
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
  const { data, error } = useQuery<MonthSummaryDto>({
    queryKey: QueryKeys.monthSummary(year, month),
    queryFn: async () => {
      const response = await fetch(
        ApiRoutes.monthlyExpensesSummary(year, month)
      );
      return response.json() as Promise<MonthSummaryDto>;
    },
  });

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

  const { data: allTimeSummary, isLoading: isLoadingAllTime } =
    useQuery<AllTimeSummaryDto>({
      queryKey: QueryKeys.allTimeSummary(),
      queryFn: async () => {
        const response = await fetch(ApiRoutes.allTimeSummary());
        return response.json() as Promise<AllTimeSummaryDto>;
      },
    });

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

  // Define category colors for consistent visualization
  const categoryColors: Record<string, string> = {
    Food: "bg-emerald-500",
    Transportation: "bg-blue-500",
    "Rent & Bills": "bg-purple-500",
    Shopping: "bg-pink-500",
    Travel: "bg-amber-500",
    Leisure: "bg-indigo-500",
    Education: "bg-cyan-500",
    "Wellness and Beauty": "bg-rose-500",
    Other: "bg-gray-500",
    Gifts: "bg-red-500",
    // Income categories
    Paycheck: "bg-green-600",
    Gift: "bg-teal-500",
  };

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

  // Calculate balance (profit - expenses)
  const balance = allTimeSummary
    ? allTimeSummary.totalProfit - allTimeSummary.totalExpenses
    : 0;
  const isPositiveBalance = balance >= 0;

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

  return (
    <div className="p-0 space-y-4 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MonthYearPicker initialMonth={month} initialYear={year} />
          <Select
            value={viewType}
            onValueChange={(value) => setViewType(value as ViewType)}
          >
            <SelectTriggerNoChevron className="w-auto">
              <SelectValue placeholder="View" />
            </SelectTriggerNoChevron>
            <SelectContent>
              <SelectItem value="expenses">E</SelectItem>
              <SelectItem value="income">I</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!isLoadingAllTime && allTimeSummary && (
          <div
            className={`font-semibold text-xl pr-2 ${
              isPositiveBalance ? "text-green-400" : "text-red-400"
            } cursor-pointer hover:underline`}
          >
            <AddRecordDialog
              isIncome={true}
              trigger={<span>{formatUSD(balance)}</span>}
            />
          </div>
        )}
      </div>

      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
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
              <CardTitle className="text-center">
                {formatUSD(totalMonthlyAmount)}
                {(() => {
                  const monthDiff = formatDifference(
                    totalMonthDifference,
                    totalPreviousMonthAmount
                  );
                  return (
                    monthDiff && (
                      <span
                        className={`ml-2 text-sm items-center inline-flex ${monthDiff.color}`}
                      >
                        {monthDiff.text}
                        {monthDiff.icon}
                      </span>
                    )
                  );
                })()}
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
                <div className="mb-6">
                  <SegmentedProgress
                    height={24}
                    segments={sortedCategories.map((category) => {
                      const IconComponent = getCategoryIcon(category.icon);
                      return {
                        value: Number(category.total),
                        color:
                          categoryColors[category.categoryName] || undefined,
                        tooltip: (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <IconComponent className="size-4" />
                              <span>{category.categoryName}</span>
                            </div>
                            <div className="text-xs mt-1">
                              {formatUSD(Number(category.total))} (
                              {(
                                (Number(category.total) / totalMonthlyAmount) *
                                100
                              ).toFixed(1)}
                              %)
                            </div>
                          </div>
                        ),
                        icon: <IconComponent className="size-4" />,
                      };
                    })}
                  />
                </div>
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
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No {viewType} data available for {monthName} {yearString}.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="fixed bottom-10 right-10 z-50">
        <AddRecordDialog isIncome={viewType === "income"} />
      </div>
    </div>
  );
}
