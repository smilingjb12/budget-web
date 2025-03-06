"use client";

import {
  AllTimeSummaryDto,
  MonthSummaryDto,
} from "@/app/api/(services)/record-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SegmentedProgress } from "@/components/ui/segmented-progress";
import { useCategoryIcon } from "@/lib/hooks/use-category-icon";
import { QueryKeys } from "@/lib/query-keys";
import { ApiRoutes, Month } from "@/lib/routes";
import { formatUSD } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { AddRecordDialog } from "./add-record-dialog";

export default function MonthsPage() {
  const params = useParams<{ month: string }>();
  const month = Number(params.month) as Month;
  const { getCategoryIcon } = useCategoryIcon();

  const date = new Date();
  date.setMonth(month - 1); // Adjust for 0-indexed months in JS
  const monthName = format(date, "MMMM");
  const year = format(date, "yyyy");

  const { data, isLoading, error } = useQuery<MonthSummaryDto>({
    queryKey: QueryKeys.monthSummary(month),
    queryFn: async () => {
      const response = await fetch(ApiRoutes.recordsByMonth(month));
      return response.json();
    },
  });

  const { data: allTimeSummary, isLoading: isLoadingAllTime } =
    useQuery<AllTimeSummaryDto>({
      queryKey: QueryKeys.allTimeSummary(),
      queryFn: async () => {
        const response = await fetch(ApiRoutes.allTimeSummary());
        return response.json();
      },
    });

  if (isLoading) {
    return <div className="p-4">Loading month summary...</div>;
  }

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
  };

  // Calculate total spending for all categories
  const totalMonthlySpending =
    data?.categorySummaries?.reduce(
      (sum, category) => sum + Number(category.totalExpenses),
      0
    ) || 0;

  // Sort categories by value for better visualization
  const sortedCategories = [...(data?.categorySummaries || [])].sort(
    (a, b) => b.totalExpenses - a.totalExpenses
  );

  // Ensure we have valid data for the progress bar
  const hasValidData = totalMonthlySpending > 0 && sortedCategories.length > 0;

  // Calculate balance (profit - expenses)
  const balance = allTimeSummary
    ? allTimeSummary.totalProfit - allTimeSummary.totalExpenses
    : 0;
  const isPositiveBalance = balance >= 0;

  return (
    <div className="p-4 space-y-4 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {monthName} {year}
        </h1>
        {!isLoadingAllTime && allTimeSummary && (
          <div
            className={`font-semibold text-xl ${
              isPositiveBalance ? "text-green-400" : "text-red-400"
            }`}
          >
            {formatUSD(balance)}
          </div>
        )}
      </div>

      {data && data.categorySummaries && data.categorySummaries.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {formatUSD(totalMonthlySpending)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasValidData && (
                <div className="mb-6">
                  <SegmentedProgress
                    height={24}
                    segments={sortedCategories.map((category) => {
                      const IconComponent = getCategoryIcon(category.icon);
                      return {
                        value: Number(category.totalExpenses),
                        color:
                          categoryColors[category.categoryName] || undefined,
                        tooltip: (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <IconComponent className="size-4" />
                              <span>{category.categoryName}</span>
                            </div>
                            <div className="text-xs mt-1">
                              {formatUSD(Number(category.totalExpenses))} (
                              {(
                                (Number(category.totalExpenses) /
                                  totalMonthlySpending) *
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
                  const IconComponent = getCategoryIcon(category.icon);
                  return (
                    <div
                      key={category.categoryName}
                      className="flex justify-between items-center"
                    >
                      <span className="flex items-center">
                        <IconComponent className="mr-2 size-5" />
                        {category.categoryName}
                      </span>
                      <span>{formatUSD(Number(category.totalExpenses))}</span>
                    </div>
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
              No expense data available for {monthName}.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-50">
        <AddRecordDialog />
      </div>
    </div>
  );
}
