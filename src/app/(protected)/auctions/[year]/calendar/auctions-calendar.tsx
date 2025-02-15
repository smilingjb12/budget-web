import { Calendar } from "@/components/ui/calendar";
import { unixToDate } from "@/lib/utils";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";
import { api } from "../../../../../../convex/_generated/api";
import { useCalendar } from "../hooks/use-calendar";
import { DayContent } from "../components/calendar-day-content";
import { CreateAuctionDialog } from "../components/create-auction-dialog";

const CALENDAR_CELL_SIZE = "size-10";

export function AuctionsCalendar() {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [createDialogDate, setCreateDialogDate] = React.useState<
    Date | undefined
  >();
  const params = useParams<{ year: string }>();
  const auctions =
    useQuery(api.auctions.getAuctions, {
      year: Number(params.year),
    }) ?? [];
  const { isAuctionDate, getAuctionForDate } = useCalendar();

  const months = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        calendarMonth: new Date(Number(params.year), i, 1),
        key: i,
      })),
    [params.year]
  );

  const handleDayClick = React.useCallback(
    (date: Date) => {
      if (isAuctionDate(auctions!, date)) {
        setSelectedDate(date.toDateString());
        setIsPopoverOpen(true);
      } else {
        setCreateDialogDate(date);
        setIsCreateDialogOpen(true);
      }
    },
    [isAuctionDate, auctions]
  );

  return (
    <>
      <div className="">
        <div className="mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-[960px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {months.map(({ calendarMonth, key }) => (
              <div key={key} className="flex justify-center">
                <Calendar
                  mode="single"
                  month={calendarMonth}
                  selected={undefined}
                  onSelect={() => {}}
                  modifiers={{
                    highlighted: auctions.map((auction) =>
                      unixToDate(auction.dateTimestamp)
                    ),
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
                          isAuctionDate={(date) =>
                            isAuctionDate(auctions, date)
                          }
                          getAuctionForDate={(date) =>
                            getAuctionForDate(auctions, date)
                          }
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
      <CreateAuctionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        defaultDate={createDialogDate}
      />
    </>
  );
}
