import { clsx, type ClassValue } from "clsx";
import { format, fromUnixTime, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEuro(money: number): string {
  const value = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(money);

  return `€ ${value}`;
}

export function formatUSD(amount: number): string {
  const isWholeNumber = amount % 1 === 0;
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: isWholeNumber ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function unixToDate(timestamp: number): Date {
  return fromUnixTime(timestamp / 1000);
}

export function toServerDate(date: Date): string {
  return date.toLocaleString("sv").replace(",", "");
}

export function nameof<T>(key: keyof T): keyof T {
  return key;
}

export function formatCurrency(amount: number): string {
  return formatUSD(amount);
}

export async function fetchWithErrorHandling<T>(
  url: string,
  errorMessage: string = "API request failed",
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export function transformMonthlyDataForChart<T extends { monthDate: string }>(
  data: T[]
) {
  return data.map((item) => {
    const date = parse(item.monthDate + "-01", "yyyy-MM-dd", new Date());
    return {
      ...item,
      name: format(date, "MMM"),
      month: format(date, "MMM"),
      year: format(date, "yyyy"),
      yearMonth: item.monthDate,
      // Add a flag for the first month of the year
      isFirstMonthOfYear: item.monthDate.endsWith("-01"),
    };
  });
}

export function createJsonPostOptions<T>(data: T): RequestInit {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}
