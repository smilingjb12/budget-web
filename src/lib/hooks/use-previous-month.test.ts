import { Month } from "@/lib/routes";
import { describe, expect, it } from "vitest";
import { usePreviousMonth } from "./use-previous-month";

describe("usePreviousMonth", () => {
  it("should return the previous month and same year for months 2-12", () => {
    // Test for February (2)
    expect(usePreviousMonth(2 as Month, 2023)).toEqual({
      prevMonth: 1 as Month,
      prevYear: 2023,
    });

    // Test for middle of the year (July - 7)
    expect(usePreviousMonth(7 as Month, 2023)).toEqual({
      prevMonth: 6 as Month,
      prevYear: 2023,
    });

    // Test for December (12)
    expect(usePreviousMonth(12 as Month, 2023)).toEqual({
      prevMonth: 11 as Month,
      prevYear: 2023,
    });
  });

  it("should return December of previous year when current month is January", () => {
    expect(usePreviousMonth(1 as Month, 2023)).toEqual({
      prevMonth: 12 as Month,
      prevYear: 2022,
    });
  });

  it("should handle leap years correctly", () => {
    // Leap year behavior is the same as non-leap years for this function
    expect(usePreviousMonth(3 as Month, 2020)).toEqual({
      prevMonth: 2 as Month,
      prevYear: 2020,
    });

    expect(usePreviousMonth(1 as Month, 2020)).toEqual({
      prevMonth: 12 as Month,
      prevYear: 2019,
    });
  });

  it("should handle year transitions correctly", () => {
    // Test year transition from 2000 to 1999
    expect(usePreviousMonth(1 as Month, 2000)).toEqual({
      prevMonth: 12 as Month,
      prevYear: 1999,
    });

    // Test year transition from 2099 to 2098
    expect(usePreviousMonth(1 as Month, 2099)).toEqual({
      prevMonth: 12 as Month,
      prevYear: 2098,
    });
  });
});
