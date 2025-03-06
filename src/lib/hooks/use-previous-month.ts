import { Month } from "@/lib/routes";

export function useMonthNavigation(month: Month, year: number) {
  // Calculate previous month and year
  let prevMonth = (month - 1) as Month;
  let prevYear = year;

  if (prevMonth < 1) {
    prevMonth = 12 as Month;
    prevYear = year - 1;
  }

  // Calculate next month and year
  let nextMonth = (month + 1) as Month;
  let nextYear = year;

  if (nextMonth > 12) {
    nextMonth = 1 as Month;
    nextYear = year + 1;
  }

  return { prevMonth, prevYear, nextMonth, nextYear };
}

// Keep the original function for backward compatibility
export function usePreviousMonth(month: Month, year: number) {
  const { prevMonth, prevYear } = useMonthNavigation(month, year);
  return { prevMonth, prevYear };
}
