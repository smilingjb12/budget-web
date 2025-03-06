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
