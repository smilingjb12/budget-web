"use client";

import { AllTimeSummaryDto } from "@/app/api/(services)/record-service";
import { MonthYearPicker } from "@/components/month-year-picker";
import { Button } from "@/components/ui/button";
import { QueryKeys } from "@/lib/query-keys";
import { ApiRoutes } from "@/lib/routes";
import { formatUSD } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AddRecordDialog } from "./add-record-dialog";

// Define view type for toggling between expenses and income
export type ViewType = "expenses" | "income";

type MonthlyHeaderProps = {
  viewType: ViewType;
  onToggleViewType: () => void;
  month: number;
  year: number;
};

export function MonthlyHeader({
  viewType,
  onToggleViewType,
  month,
  year,
}: MonthlyHeaderProps) {
  const { data: allTimeSummary, isLoading: isLoadingAllTime } =
    useQuery<AllTimeSummaryDto>({
      queryKey: QueryKeys.allTimeSummary(),
      queryFn: async () => {
        const response = await fetch(ApiRoutes.allTimeSummary());
        return response.json() as Promise<AllTimeSummaryDto>;
      },
    });

  // Calculate balance (profit - expenses)
  const balance = allTimeSummary
    ? allTimeSummary.totalProfit - allTimeSummary.totalExpenses
    : 0;
  const isPositiveBalance = balance >= 0;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <MonthYearPicker initialMonth={month} initialYear={year} />
        <Button
          variant="outline"
          size="sm"
          className="w-[40px]"
          onClick={onToggleViewType}
        >
          {viewType === "expenses" ? "E" : "I"}
        </Button>
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
  );
}
