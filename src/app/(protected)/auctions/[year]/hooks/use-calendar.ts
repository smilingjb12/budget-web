import { unixToDate } from "@/lib/utils";
import { AuctionDto } from "../../../../../../convex/lib/types";

export function useCalendar() {
  const isAuctionDate = (auctions: AuctionDto[], date: Date) =>
    auctions.some((auction) => {
      const auctionDate = unixToDate(auction.dateTimestamp);
      return auctionDate.toDateString() === date.toDateString();
    });

  const getAuctionForDate = (auctions: AuctionDto[], date: Date) =>
    auctions.find(
      (auction) =>
        unixToDate(auction.dateTimestamp).toDateString() === date.toDateString()
    );

  const generateYearMonths = (year: number) =>
    Array.from({ length: 12 }, (_, i) => ({
      calendarMonth: new Date(Number(year), i, 1),
      key: i,
    }));

  return {
    isAuctionDate,
    getAuctionForDate,
    generateYearMonths,
  };
}
