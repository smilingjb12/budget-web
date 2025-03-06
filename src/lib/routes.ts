export const APP_SEGMENT = "app";

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const ApiRoutes = {
  recordsByMonth: (month: Month) => `/api/records/months/${month}`,
  categories: () => `/api/categories`,
  allTimeSummary: () => `/api/records/summary`,
} as const;

export const Routes = {
  recordsByMonth: (month: Month) => `/app/months/${month}`,
  signIn() {
    return "/sign-in";
  },
} as const;
