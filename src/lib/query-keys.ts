import { Month } from "./routes";

export const QueryKeys = {
  monthSummary: (month: Month) => ["month-summary", month],
  categories: () => ["categories"],
  allTimeSummary: () => ["all-time-summary"],
} as const;
