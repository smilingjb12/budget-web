"use client";

import { Button } from "@/components/ui/button";
import { Constants } from "@/constants";
import { unixToDate } from "@/lib/utils";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { SquarePlus } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { SummaryPanel } from "../../[year]/summary-panel";
import { AddItemDialog } from "./add-item-dialog";
import { AuctionTabs } from "./auction-tabs";

export default function AuctionDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const params = useParams<{ auctionId: string }>();
  const auction = useQuery(api.auctions.getAuctionById, {
    id: params.auctionId as Id<"auctions">,
  });
  const stats = useQuery(api.auctions.getAuctionSummary, {
    auctionId: params.auctionId as Id<"auctions">,
  });

  return (
    <>
      <div className="flex">
        <div
          className="flex-1"
          style={{ paddingLeft: Constants.SIDEBAR_WIDTH_PX }}
        >
          <div className="p-2 mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="text-3xl font-bold p-4 pl-0">
                Auction #
                {auction &&
                  format(unixToDate(auction.dateTimestamp), "yyyy-MM-dd")}
              </div>
              <Button onClick={() => setIsAddItemDialogOpen(true)}>
                <SquarePlus className="size-5 mr-2" />
                Add an item
              </Button>
            </div>

            <SummaryPanel stats={stats} />
            <AuctionTabs />
            {children}
          </div>
        </div>
      </div>
      <AddItemDialog
        auctionId={params.auctionId}
        onOpenChange={setIsAddItemDialogOpen}
        open={isAddItemDialogOpen}
      />
    </>
  );
}
