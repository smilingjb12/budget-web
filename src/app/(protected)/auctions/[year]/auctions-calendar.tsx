import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { DayContent } from "./calendar-day-content";

const CALENDAR_CELL_SIZE = "size-10";

const auctions = [
  {
    date: new Date(2025, 0, 14),
    soldItems: 645,
    unsoldItems: 23,
    sales: 31250.0,
    auctionFee: 6250.0,
    commissions: -3890.5,
    netReceipts: 33609.5,
  },
  {
    date: new Date(2025, 0, 28),
    soldItems: 702,
    unsoldItems: 14,
    sales: 29512.0,
    auctionFee: 5902.4,
    commissions: -4211.5,
    netReceipts: 31202.9,
  },
  {
    date: new Date(2025, 1, 11),
    soldItems: 589,
    unsoldItems: 31,
    sales: 27800.0,
    auctionFee: 5560.0,
    commissions: -3450.0,
    netReceipts: 29910.0,
  },
  {
    date: new Date(2025, 2, 11),
    soldItems: 634,
    unsoldItems: 18,
    sales: 33100.0,
    auctionFee: 6620.0,
    commissions: -4120.5,
    netReceipts: 35599.5,
  },
  {
    date: new Date(2025, 2, 25),
    soldItems: 678,
    unsoldItems: 25,
    sales: 30150.0,
    auctionFee: 6030.0,
    commissions: -3768.75,
    netReceipts: 32411.25,
  },
  {
    date: new Date(2025, 3, 8),
    soldItems: 612,
    unsoldItems: 29,
    sales: 28900.0,
    auctionFee: 5780.0,
    commissions: -3612.5,
    netReceipts: 31067.5,
  },
];

const isAuctionDate = (date: Date) =>
  auctions.some(
    (auction) => auction.date.toDateString() === date.toDateString()
  );

const getAuctionForDate = (date: Date) =>
  auctions.find(
    (auction) => auction.date.toDateString() === date.toDateString()
  );

export function AuctionsCalendar() {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  const months = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        calendarMonth: new Date(2025, i, 1),
        key: i,
      })),
    []
  );

  const handleDayClick = React.useCallback((date: Date) => {
    if (isAuctionDate(date)) {
      setSelectedDate(date.toDateString());
      setIsPopoverOpen(true);
    } else {
      alert(`Clicked on ${date.toDateString()}`);
    }
  }, []);

  return (
    <div className="">
      <div className="mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {months.map(({ calendarMonth, key }) => (
            <div key={key} className="flex justify-start">
              <Calendar
                mode="single"
                month={calendarMonth}
                selected={undefined}
                onSelect={() => {}}
                modifiers={{
                  highlighted: auctions.map((auction) => auction.date),
                }}
                weekStartsOn={1}
                className=""
                classNames={{
                  months: "w-full",
                  month: "w-full",
                  table: "w-full border-collapse",
                  head_row: "flex",
                  head_cell: "rounded-md w-10 font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: `${CALENDAR_CELL_SIZE} text-center text-md p-0 relative focus-within:relative focus-within:z-20`,
                  day: `${CALENDAR_CELL_SIZE} p-0 font-normal text-md`,
                  day_selected: "",
                  day_outside: "opacity-0 pointer-events-none",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_hidden: "invisible",
                  nav: "hidden",
                  caption:
                    "flex justify-start pl-2 relative items-center mb-4 [&>div]:!text-lg ",
                }}
                formatters={{
                  formatCaption: (date) => {
                    return date.toLocaleString("default", { month: "long" });
                  },
                }}
                components={{
                  DayContent: ({ date }) => {
                    return (
                      <DayContent
                        date={date}
                        calendarMonth={calendarMonth}
                        isPopoverOpen={isPopoverOpen}
                        selectedDate={selectedDate}
                        setIsPopoverOpen={setIsPopoverOpen}
                        handleDayClick={handleDayClick}
                        isAuctionDate={isAuctionDate}
                        getAuctionForDate={getAuctionForDate}
                      />
                    );
                  },
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
