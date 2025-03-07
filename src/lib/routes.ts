export const APP_SEGMENT = "app";
export const CHARTS_SEGMENT = "charts";
export const SETTINGS_SEGMENT = "settings";

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
  expensesByCategory: (categoryId: number) =>
    `/api/charts/expenses-by-category/${categoryId}`,
  expensesVsIncome: () => `/api/charts/expenses-vs-income`,
  exchangeRate: () => `/api/exchange-rate`,
  recordComments: (comment: string) =>
    `/api/records/comments?comment=${encodeURIComponent(comment)}`,
  regularPayments: () => `/api/regular-payments`,
} as const;

export const Routes = {
  monthlyExpensesSummary: (year: number, month: Month) =>
    `/${APP_SEGMENT}/${year}/${month}`,
  signIn() {
    return "/sign-in";
  },
  charts() {
    return `/${APP_SEGMENT}/${CHARTS_SEGMENT}`;
  },
  settings() {
    return `/${APP_SEGMENT}/${SETTINGS_SEGMENT}`;
  },
} as const;
