import { Month } from "./routes";

export const QueryKeys = {
  monthSummary: (year: number, month: Month) => ["month-summary", year, month],
  categories: () => ["categories"],
  expenseCategories: () => ["expense-categories"],
  incomeCategories: () => ["income-categories"],
  allTimeSummary: () => ["all-time-summary"],
  record: (id: number) => ["record", id],
  monthRecords: (year: number, month: Month) => ["month-records", year, month],
  exchangeRate: () => ["exchange-rate"],
  expensesVsIncome: () => ["expenses-vs-income"],
  recordComments: (comment: string) => ["record-comments", comment],
  regularPayments: () => ["regular-payments"],
} as const;
