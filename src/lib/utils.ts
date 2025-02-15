import { clsx, type ClassValue } from "clsx";
import { fromUnixTime } from "date-fns";
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

export function unixToDate(timestamp: number): Date {
  return fromUnixTime(timestamp / 1000);
}
