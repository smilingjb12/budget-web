import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { memo } from "react";
import { AuctionDetailsPopover } from "./auction-details-popover";
import { Doc } from "../../../../../../convex/_generated/dataModel";

const CALENDAR_CELL_SIZE = "size-10";

interface DayContentProps {
  date: Date;
  calendarMonth: Date;
  isPopoverOpen: boolean;
  selectedDate: string | null;
  setIsPopoverOpen: (open: boolean) => void;
  handleDayClick: (date: Date) => void;
  isAuctionDate: (date: Date) => boolean;
  getAuctionForDate: (date: Date) => Doc<"auctions"> | undefined;
}

export const DayContent = memo(function DayContent({
  date,
  calendarMonth,
  isPopoverOpen,
  selectedDate,
  setIsPopoverOpen,
  handleDayClick,
  isAuctionDate,
  getAuctionForDate,
}: DayContentProps) {
  const isCurrentMonth = date.getMonth() === calendarMonth.getMonth();
  const hasAuction = isAuctionDate(date);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  const dayContent = (
    <div
      className={cn(
        `${CALENDAR_CELL_SIZE} p-0 font-normal flex items-center justify-center relative cursor-pointer`,
        isWeekend && "text-muted-foreground ",
        hasAuction && "bg-primary text-primary-foreground rounded-full",
        !hasAuction && "hover:bg-transparent group"
      )}
      onClick={() => !isWeekend && handleDayClick(date)}
    >
      {date.getDate()}
      {!hasAuction && !isWeekend && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div
            className={`bg-primary-foreground border-2 border-primary rounded-full ${CALENDAR_CELL_SIZE} flex items-center justify-center`}
          >
            <Plus className="size-5 text-primary" />
          </div>
        </div>
      )}
    </div>
  );

  if (!isCurrentMonth || !hasAuction) {
    return dayContent;
  }

  const auctionData = getAuctionForDate(date);
  if (!auctionData) return dayContent;

  return (
    <AuctionDetailsPopover
      isOpen={isPopoverOpen && selectedDate === date.toDateString()}
      onOpenChange={(open) => setIsPopoverOpen(open)}
      auction={auctionData}
    >
      {dayContent}
    </AuctionDetailsPopover>
  );
});
