import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { memo } from "react";
import { AuctionDetailsPopover } from "./auction-details-popover";

const CALENDAR_CELL_SIZE = "size-10";

type Auction = {
  date: Date;
  soldItems: number;
  unsoldItems: number;
  sales: number;
  auctionFee: number;
  commissions: number;
  netReceipts: number;
};

interface DayContentProps {
  date: Date;
  calendarMonth: Date;
  isPopoverOpen: boolean;
  selectedDate: string | null;
  setIsPopoverOpen: (open: boolean) => void;
  handleDayClick: (date: Date) => void;
  isAuctionDate: (date: Date) => boolean;
  getAuctionForDate: (date: Date) => Auction | undefined;
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
      onClick={() => handleDayClick(date)}
    >
      {date.getDate()}
      {!hasAuction && (
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
      auctionData={auctionData}
    >
      {dayContent}
    </AuctionDetailsPopover>
  );
});
