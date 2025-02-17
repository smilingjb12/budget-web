import { unixToDate } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";
import { AuctionDto } from "../../../../../../convex/lib/types";

interface DeleteAuctionDialogContentProps {
  auction: AuctionDto | null;
}

export const DeleteAuctionDialogContent = React.memo(
  ({ auction }: DeleteAuctionDialogContentProps) => {
    if (!auction) return null;

    return (
      <div>
        <div className="flex justify-between items-center px-3 py-2 border-destructive rounded-full border-2">
          <div className="font-bold">
            Auction #{format(unixToDate(auction.dateTimestamp), "yyyy-MM-dd")}
          </div>
          <div className="text-muted-foreground text-sm">
            {format(unixToDate(auction.dateTimestamp), "EEEE, do MMMM yyyy")}
          </div>
        </div>
        <div className="mt-7 text-sm text-muted-foreground">
          Are you sure you want to delete this auction? This action cannot be
          undone.
        </div>
      </div>
    );
  }
);

DeleteAuctionDialogContent.displayName = "DeleteAuctionDialogContent";
