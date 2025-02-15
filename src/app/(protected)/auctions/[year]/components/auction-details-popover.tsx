import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatEuro, unixToDate } from "@/lib/utils";
import { format } from "date-fns";
import {
  Gavel,
  Handshake,
  MicVocal,
  OctagonMinus,
  Package,
  Trash2,
} from "lucide-react";
import { ReactNode, memo } from "react";
import { Doc } from "../../../../../../convex/_generated/dataModel";

interface AuctionDetailsPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  auction: Doc<"auctions">;
  children: ReactNode;
}

export const AuctionDetailsPopover = memo(function AuctionDetailsPopover({
  isOpen,
  onOpenChange,
  auction,
  children,
}: AuctionDetailsPopoverProps) {
  const popoverContent = (
    <div className="p-5 py-3 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-md">
          Auction #{format(unixToDate(auction.dateTimestamp), "yyyy-MM-dd")}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive/80 cursor-pointer p-0 hover:bg-primary/0"
        >
          <div className="flex items-center gap-1 pr-4">
            <Trash2 className="size-4 text-destructive" />
            Delete
          </div>
        </Button>
      </div>
      <div className="space-y-0 text-sm divide-y divide-gray-200">
        <div className="py-2 flex justify-between items-center border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Package className="size-4" />
            <span className="text-gray-600">Sold items</span>
          </div>
          <span className="font-medium">{auction.soldItems}</span>
        </div>
        <div className="py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <OctagonMinus className="size-4" />
            <span className="text-gray-600">Unsold items</span>
          </div>
          <span className="font-medium">{auction.unsoldItems}</span>
        </div>
        <div className="py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gavel className="size-4" />
            <span className="text-gray-600">Sales</span>
          </div>
          <span className="font-medium">{formatEuro(auction.sales)}</span>
        </div>
        <div className="py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MicVocal className="size-4" />
            <span className="text-gray-600">Auction fee (20%)</span>
          </div>
          <span className="font-medium">{formatEuro(auction.auctionFee)}</span>
        </div>
        <div className="py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Handshake className="size-4" />
            <span className="text-gray-600">Commissions</span>
          </div>
          <span className="font-medium">
            {formatEuro(Math.abs(auction.commissions))}
          </span>
        </div>
        <div className="py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="size-4" />
            <span className="text-gray-600">Net receipts</span>
          </div>
          <span className="font-medium">{formatEuro(auction.netReceipts)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        side="right"
        align="start"
        onPointerDownOutside={() => onOpenChange(false)}
      >
        {popoverContent}
      </PopoverContent>
    </Popover>
  );
});
