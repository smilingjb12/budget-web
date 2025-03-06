import { Month } from "@/lib/routes";

export function usePreviousMonth(month: Month, year: number) {
  // Calculate previous month and year
  let prevMonth = (month - 1) as Month;
  let prevYear = year;

  if (prevMonth < 1) {
    prevMonth = 12 as Month;
    prevYear = year - 1;
  }

  return { prevMonth, prevYear };
}
