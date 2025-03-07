"use client";

import { CategoryDto } from "@/app/api/(services)/category-service";
import {
  MonthlyExpensesVsIncomeDto,
  MonthlyTotalsDto,
} from "@/app/api/(services)/charts-service";
import {
  AllTimeSummaryDto,
  MonthSummaryDto,
  RecordDto,
} from "@/app/api/(services)/record-service";
import { ExchangeRateDto } from "@/app/api/exchange-rate/route";
import { ApiRoutes, Month } from "@/lib/routes";
import { useQuery } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import { QueryKeys } from "./query-keys";

// Exchange rate query
export function useExchangeRateQuery() {
  return useQuery({
    queryKey: QueryKeys.exchangeRate(),
    queryFn: async () => {
      const response = await fetch(ApiRoutes.exchangeRate());

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }

      const data = (await response.json()) as ExchangeRateDto;
      return data.rate;
    },
  });
}

// Categories queries
export function useCategoriesQuery() {
  return useQuery({
    queryKey: QueryKeys.categories(),
    queryFn: async () => {
      const response = await fetch(ApiRoutes.categories());

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return response.json() as Promise<CategoryDto[]>;
    },
  });
}

export function useExpenseCategoriesQuery() {
  return useQuery({
    queryKey: QueryKeys.expenseCategories(),
    queryFn: async () => {
      const response = await fetch(ApiRoutes.expenseCategories());

      if (!response.ok) {
        throw new Error("Failed to fetch expense categories");
      }

      return response.json() as Promise<CategoryDto[]>;
    },
  });
}

export function useIncomeCategoriesQuery() {
  return useQuery({
    queryKey: QueryKeys.incomeCategories(),
    queryFn: async () => {
      const response = await fetch(ApiRoutes.incomeCategories());

      if (!response.ok) {
        throw new Error("Failed to fetch income categories");
      }

      return response.json() as Promise<CategoryDto[]>;
    },
  });
}

// Category expenses query
export function useCategoryExpensesQuery(categoryId: number) {
  return useQuery({
    queryKey: ["category-expenses", categoryId],
    queryFn: async () => {
      const response = await fetch(ApiRoutes.expensesByCategory(categoryId));

      if (!response.ok) {
        throw new Error("Failed to fetch category expenses");
      }

      const data = (await response.json()) as MonthlyTotalsDto[];

      // Transform the data for the chart - include year information
      return data.map((item) => {
        const date = parse(item.monthDate + "-01", "yyyy-MM-dd", new Date());
        return {
          name: format(date, "MMM"),
          month: format(date, "MMM"),
          year: format(date, "yyyy"),
          yearMonth: item.monthDate,
          total: item.total,
          // Add a flag for the first month of the year
          isFirstMonthOfYear: item.monthDate.endsWith("-01"),
        };
      });
    },
    enabled: !!categoryId,
  });
}

// Expenses vs Income query
export function useExpensesVsIncomeQuery() {
  return useQuery({
    queryKey: QueryKeys.expensesVsIncome(),
    queryFn: async () => {
      const response = await fetch(ApiRoutes.expensesVsIncome());

      if (!response.ok) {
        throw new Error("Failed to fetch expenses vs income data");
      }

      const data = (await response.json()) as MonthlyExpensesVsIncomeDto[];

      // Transform the data for the chart - include year information
      return data.map((item) => {
        const date = parse(item.monthDate + "-01", "yyyy-MM-dd", new Date());
        return {
          name: format(date, "MMM"),
          month: format(date, "MMM"),
          year: format(date, "yyyy"),
          yearMonth: item.monthDate,
          expenses: item.expenses,
          income: item.income,
          // Add a flag for the first month of the year
          isFirstMonthOfYear: item.monthDate.endsWith("-01"),
        };
      });
    },
  });
}

// Month summary query
export function useMonthSummaryQuery(year: number, month: Month) {
  return useQuery<MonthSummaryDto>({
    queryKey: QueryKeys.monthSummary(year, month),
    queryFn: async () => {
      const response = await fetch(
        ApiRoutes.monthlyExpensesSummary(year, month)
      );

      if (!response.ok) {
        throw new Error("Failed to fetch month summary");
      }

      return response.json() as Promise<MonthSummaryDto>;
    },
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
    queryFn: async () => {
      const response = await fetch(ApiRoutes.allRecordsByMonth(year, month));

      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }

      return response.json() as Promise<RecordDto[]>;
    },
    enabled,
  });
}

// Previous month summary query
export function usePrevMonthSummaryQuery(prevYear: number, prevMonth: Month) {
  return useQuery<MonthSummaryDto>({
    queryKey: ["month-summary", prevYear, prevMonth],
    queryFn: async () => {
      const response = await fetch(
        ApiRoutes.monthlyExpensesSummary(prevYear, prevMonth)
      );

      if (!response.ok) {
        throw new Error("Failed to fetch previous month summary");
      }

      return response.json() as Promise<MonthSummaryDto>;
    },
  });
}

// All time summary query
export function useAllTimeSummaryQuery() {
  return useQuery({
    queryKey: QueryKeys.allTimeSummary(),
    queryFn: async () => {
      const response = await fetch(ApiRoutes.allTimeSummary());

      if (!response.ok) {
        throw new Error("Failed to fetch all time summary");
      }

      return response.json() as Promise<AllTimeSummaryDto>;
    },
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

      const response = await fetch(ApiRoutes.recordById(id));

      if (!response.ok) {
        throw new Error("Failed to fetch record");
      }

      return response.json() as Promise<RecordDto>;
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

      const response = await fetch(ApiRoutes.recordComments(comment));

      if (!response.ok) {
        throw new Error("Failed to fetch record comments");
      }

      return response.json() as Promise<string[]>;
    },
    enabled: comment.trim().length > 0,
  });
}
