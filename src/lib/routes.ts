export const APP_SEGMENT = "app";

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const ApiRoutes = {
  monthlyExpensesSummary: (year: number, month: Month) =>
    `/api/records/calendar/${year}/${month}`,
  recordById: (id: number) => `/api/records/${id}`,
  records: () => `/api/records`,
  allRecordsByMonth: (year: number, month: Month) =>
    `/api/records/calendar/${year}/${month}/records`,
  categories: () => `/api/categories`,
  expenseCategories: () => `/api/categories/expense`,
  incomeCategories: () => `/api/categories/income`,
  allTimeSummary: () => `/api/records/summary`,
} as const;

export const Routes = {
  monthlyExpensesSummary: (year: number, month: Month) =>
    `/${APP_SEGMENT}/${year}/${month}`,
  signIn() {
    return "/sign-in";
  },
} as const;
