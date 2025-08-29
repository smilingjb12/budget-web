"use client";

import { CategoryDto } from "@/app/api/(services)/category-service";
import {
  IncomeTrendsDto,
  MonthlyExpensesVsIncomeDto,
  MonthlyTotalsDto,
} from "@/app/api/(services)/charts-service";
import {
  AllTimeSummaryDto,
  MonthSummaryDto,
  RecordDto,
} from "@/app/api/(services)/record-service";
import { ExchangeRateDto } from "@/app/api/exchange-rate/route";
import { RegularPaymentDto } from "@/app/api/regular-payments/route";
import { ApiRoutes, Month } from "@/lib/routes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "./query-keys";
import {
  createJsonPostOptions,
  fetchWithErrorHandling,
  transformMonthlyDataForChart,
} from "./utils";

// Exchange rate query
export function useExchangeRateQuery() {
  return useQuery({
    queryKey: QueryKeys.exchangeRate(),
    queryFn: async () => {
      const data = await fetchWithErrorHandling<ExchangeRateDto>(
        ApiRoutes.exchangeRate(),
        "Failed to fetch exchange rate"
      );
      return data;
    },
  });
}

// Categories queries
export function useCategoriesQuery() {
  return useQuery({
    queryKey: QueryKeys.categories(),
    queryFn: () =>
      fetchWithErrorHandling<CategoryDto[]>(
        ApiRoutes.categories(),
        "Failed to fetch categories"
      ),
  });
}

export function useExpenseCategoriesQuery() {
  return useQuery({
    queryKey: QueryKeys.expenseCategories(),
    queryFn: () =>
      fetchWithErrorHandling<CategoryDto[]>(
        ApiRoutes.expenseCategories(),
        "Failed to fetch expense categories"
      ),
  });
}

export function useIncomeCategoriesQuery() {
  return useQuery({
    queryKey: QueryKeys.incomeCategories(),
    queryFn: () =>
      fetchWithErrorHandling<CategoryDto[]>(
        ApiRoutes.incomeCategories(),
        "Failed to fetch income categories"
      ),
  });
}

// Category expenses query
export function useCategoryExpensesQuery(categoryId: number) {
  return useQuery({
    queryKey: ["category-expenses", categoryId],
    queryFn: async () => {
      const data = await fetchWithErrorHandling<MonthlyTotalsDto[]>(
        ApiRoutes.expensesByCategory(categoryId),
        "Failed to fetch category expenses"
      );

      // Transform the data for the chart - include year information
      return transformMonthlyDataForChart(data);
    },
    enabled: !!categoryId,
  });
}

// Expenses vs Income query
export function useExpensesVsIncomeQuery() {
  return useQuery({
    queryKey: QueryKeys.expensesVsIncome(),
    queryFn: async () => {
      const data = await fetchWithErrorHandling<MonthlyExpensesVsIncomeDto[]>(
        ApiRoutes.expensesVsIncome(),
        "Failed to fetch expenses vs income data"
      );

      // Transform the data for the chart - include year information
      return transformMonthlyDataForChart(data);
    },
  });
}

// Month summary query
export function useMonthSummaryQuery(year: number, month: Month) {
  return useQuery<MonthSummaryDto>({
    queryKey: QueryKeys.monthSummary(year, month),
    queryFn: () =>
      fetchWithErrorHandling<MonthSummaryDto>(
        ApiRoutes.monthlyExpensesSummary(year, month),
        "Failed to fetch month summary"
      ),
  });
}

// Month records query
export function useMonthRecordsQuery(
  year: number,
  month: Month,
  enabled: boolean = true
) {
  return useQuery<RecordDto[]>({
    queryKey: QueryKeys.monthRecords(year, month),
    queryFn: () =>
      fetchWithErrorHandling<RecordDto[]>(
        ApiRoutes.allRecordsByMonth(year, month),
        "Failed to fetch records"
      ),
    enabled,
  });
}

// Previous month summary query
export function usePrevMonthSummaryQuery(prevYear: number, prevMonth: Month) {
  return useQuery<MonthSummaryDto>({
    queryKey: ["month-summary", prevYear, prevMonth],
    queryFn: () =>
      fetchWithErrorHandling<MonthSummaryDto>(
        ApiRoutes.monthlyExpensesSummary(prevYear, prevMonth),
        "Failed to fetch previous month summary"
      ),
  });
}

// All time summary query
export function useAllTimeSummaryQuery() {
  return useQuery({
    queryKey: QueryKeys.allTimeSummary(),
    queryFn: () =>
      fetchWithErrorHandling<AllTimeSummaryDto>(
        ApiRoutes.allTimeSummary(),
        "Failed to fetch all time summary"
      ),
  });
}

// Record queries
export function useRecordQuery(
  id: number | undefined,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: id ? QueryKeys.record(id) : ["record"],
    queryFn: async () => {
      if (!id) {
        throw new Error("Record ID is required");
      }

      return fetchWithErrorHandling<RecordDto>(
        ApiRoutes.recordById(id),
        "Failed to fetch record"
      );
    },
    enabled,
  });
}

export function useRecordCommentsQuery(comment: string) {
  return useQuery({
    queryKey: QueryKeys.recordComments(comment),
    queryFn: async () => {
      if (!comment.trim()) {
        return [] as string[];
      }

      return fetchWithErrorHandling<string[]>(
        ApiRoutes.recordComments(comment),
        "Failed to fetch record comments"
      );
    },
    enabled: comment.trim().length > 0,
  });
}

// Regular payments query
export function useRegularPaymentsQuery() {
  return useQuery({
    queryKey: QueryKeys.regularPayments(),
    queryFn: () =>
      fetchWithErrorHandling<RegularPaymentDto[]>(
        ApiRoutes.regularPayments(),
        "Failed to fetch regular payments"
      ),
  });
}

// Regular payments mutation
export function useUpdateRegularPaymentsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payments: RegularPaymentDto[]) => {
      return fetchWithErrorHandling<RegularPaymentDto[]>(
        ApiRoutes.regularPayments(),
        "Failed to update regular payments",
        createJsonPostOptions(payments)
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.regularPayments(),
      });
    },
  });
}

// Income trends query
export function useIncomeTrendsQuery() {
  return useQuery({
    queryKey: ["income-trends"],
    queryFn: async () => {
      const data = await fetchWithErrorHandling<IncomeTrendsDto[]>(
        ApiRoutes.incomeTrends(),
        "Failed to fetch income trends"
      );

      // Group data by month
      const monthlyData: Record<
        string,
        { monthDate: string; categories: Record<string, number>; total: number }
      > = {};

      // Process the data to group by month and collect category totals
      data.forEach((item) => {
        if (!monthlyData[item.monthDate]) {
          monthlyData[item.monthDate] = {
            monthDate: item.monthDate,
            categories: {},
            total: 0,
          };
        }

        monthlyData[item.monthDate].categories[item.categoryName] = item.total;
        monthlyData[item.monthDate].total += item.total;
      });

      // Convert to array and transform for chart
      const monthlyArray = Object.values(monthlyData);
      const transformedData = transformMonthlyDataForChart(monthlyArray);

      return {
        data: transformedData,
        categories: [...new Set(data.map((item) => item.categoryName))],
      };
    },
  });
}
