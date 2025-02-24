import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { AuctionDto } from "../../../../../../../convex/lib/types";
import { useCalendar } from "../use-calendar";

describe("useCalendar", () => {
  const mockAuctions: AuctionDto[] = [
    {
      id: "mock_id" as Id<"auctions">,
      year: 2024,
      dateTimestamp: new Date("2024-02-24").getTime(),
      soldItems: 0,
      salesInEuros: 0,
      unsoldItems: 0,
      auctionFeesInEuros: 0,
      commissionsInEuros: 0,
      netReceiptsInEuros: 0,
    },
  ];

  it("should check if a date is an auction date", () => {
    const { result } = renderHook(() => useCalendar());

    expect(
      result.current.isAuctionDate(mockAuctions, new Date("2024-02-24"))
    ).toBe(true);
    expect(
      result.current.isAuctionDate(mockAuctions, new Date("2024-02-25"))
    ).toBe(false);
  });

  it("should get auction for a specific date", () => {
    const { result } = renderHook(() => useCalendar());

    const auction = result.current.getAuctionForDate(
      mockAuctions,
      new Date("2024-02-24")
    );
    expect(auction).toEqual(mockAuctions[0]);

    const noAuction = result.current.getAuctionForDate(
      mockAuctions,
      new Date("2024-02-25")
    );
    expect(noAuction).toBeUndefined();
  });

  it("should generate months for a year", () => {
    const { result } = renderHook(() => useCalendar());

    const months = result.current.generateYearMonths(2024);
    expect(months).toHaveLength(12);
    expect(months[0].calendarMonth).toEqual(new Date(2024, 0, 1));
    expect(months[11].calendarMonth).toEqual(new Date(2024, 11, 1));
  });

  it("should identify weekends correctly", () => {
    const { result } = renderHook(() => useCalendar());

    // Saturday
    expect(result.current.isWeekend(new Date("2024-02-24"))).toBe(true);
    // Sunday
    expect(result.current.isWeekend(new Date("2024-02-25"))).toBe(true);
    // Monday
    expect(result.current.isWeekend(new Date("2024-02-26"))).toBe(false);
  });

  it("should identify disabled days (weekends or auction dates)", () => {
    const { result } = renderHook(() => useCalendar());

    // Saturday (weekend)
    expect(
      result.current.isDisabledDay(mockAuctions, new Date("2024-02-24"))
    ).toBe(true);
    // Sunday (weekend)
    expect(
      result.current.isDisabledDay(mockAuctions, new Date("2024-02-25"))
    ).toBe(true);
    // Monday with no auction
    expect(
      result.current.isDisabledDay(mockAuctions, new Date("2024-02-26"))
    ).toBe(false);
  });
});
