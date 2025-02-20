import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { AuctionDto } from "../../../../../../convex/lib/types";
import { useCalendar } from "../hooks/use-calendar";
import { AuctionDetailsPopover } from "./auction-details-popover";

const CALENDAR_CELL_SIZE = "size-10";

interface DayContentProps {
  date: Date;
  calendarMonth: Date;
  handleDayClick: (date: Date) => void;
  auctions: AuctionDto[];
}

export const DayContent = memo(function DayContent({
  date,
  calendarMonth,
  handleDayClick,
  auctions,
}: DayContentProps) {
  const { isAuctionDate, getAuctionForDate, isWeekend } = useCalendar();
  const isCurrentMonth = useMemo(
    () => date.getMonth() === calendarMonth.getMonth(),
    [date, calendarMonth]
  );

  const hasAuction = useMemo(
    () => isAuctionDate(auctions, date),
    [date, isAuctionDate, auctions]
  );

  const isWeekendDay = useMemo(() => isWeekend(date), [date, isWeekend]);

  const handleClick = useCallback(() => {
    handleDayClick(date);
  }, [date, handleDayClick]);

  const dayContent = useMemo(
    () => (
      <div
        className={cn(
          `${CALENDAR_CELL_SIZE} p-0 font-normal flex items-center justify-center relative`,
          isWeekendDay
            ? "text-muted-foreground cursor-default"
            : "cursor-pointer",
          hasAuction && "bg-primary text-primary-foreground rounded-full",
          !hasAuction && "hover:bg-transparent group"
        )}
        onClick={handleClick}
      >
        {date.getDate()}
        {!hasAuction && !isWeekendDay && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div
              className={`bg-primary-foreground border-2 border-primary rounded-full ${CALENDAR_CELL_SIZE} flex items-center justify-center`}
            >
              <Plus className="size-5 text-primary" />
            </div>
          </div>
        )}
      </div>
    ),
    [date, isWeekendDay, hasAuction, handleClick]
  );

  if (!isCurrentMonth || !hasAuction) {
    return dayContent;
  }

  const auction = getAuctionForDate(auctions, date);
  if (!auction) return dayContent;

  return (
    <AuctionDetailsPopover auction={auction}>
      {dayContent}
    </AuctionDetailsPopover>
  );
});
